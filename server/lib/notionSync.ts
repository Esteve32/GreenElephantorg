import { getNotionClient } from './notionClient';
import { db } from '../db';
import { contacts } from '@shared/schema';
import { eq, isNull, and, or } from 'drizzle-orm';
import { isConnectorEnabled } from './connectorGuard';

const NOTION_DATABASE_ID = '8818608d251c426c8538920ec88bbde3';

// Email normalization - ensures consistent matching
function normalizeEmail(email: string): string {
  return (email || '').trim().toLowerCase();
}

// Race condition prevention - ensures second sync for same email waits for first
const emailLocks = new Map<string, Promise<string | null>>();

// Source mapping from local to Notion select options
const SOURCE_MAPPING: Record<string, string> = {
  'waitlist': 'Waitlist',
  'newsletter': 'Newsletter',
  'recommendation': 'Recommendation',
  'quiz': 'Quiz',
  'purchase': 'Purchase',
  'webinar': 'Webinar',
};

interface NotionContact {
  id: string;
  properties: {
    Email?: { email: string | null };
    Name?: { title: Array<{ text: { content: string } }> };
    Source?: { select: { name: string } | null };
    'Consent Given'?: { checkbox: boolean };
    'Created At'?: { date: { start: string } | null };
    Status?: { select: { name: string } | null };
    Notes?: { rich_text: Array<{ text: { content: string } }> };
    [key: string]: any;
  };
  last_edited_time: string;
}

interface SyncResult {
  pushed: number;
  pulled: number;
  errors: string[];
}

export async function getNotionDatabaseSchema() {
  if (!(await isConnectorEnabled("notion"))) {
    console.log('⏸️ Notion disabled — skipping schema fetch');
    return null;
  }
  try {
    const notion = await getNotionClient();
    const database = await notion.databases.retrieve({ database_id: NOTION_DATABASE_ID });
    return database;
  } catch (error: any) {
    console.error('Failed to retrieve Notion database schema:', error.message);
    throw error;
  }
}

// IMPORTANT: Do NOT catch errors - let them propagate to trigger retries
// This prevents creating duplicates when Notion API fails
export async function findNotionContactByEmail(email: string): Promise<{ found: true; pageId: string; name?: string } | { found: false }> {
  if (!(await isConnectorEnabled("notion"))) {
    return { found: false };
  }
  const notion = await getNotionClient();
  const normalizedEmail = normalizeEmail(email);
  
  const response = await notion.databases.query({
    database_id: NOTION_DATABASE_ID,
    filter: {
      property: 'Email',
      email: {
        equals: normalizedEmail,
      },
    },
    page_size: 1,
  });
  
  if (response.results.length > 0) {
    const page = response.results[0] as any;
    const nameArr = page.properties?.Name?.title;
    const name = nameArr && nameArr.length > 0 ? nameArr[0].text?.content : undefined;
    
    console.log(`Found existing Notion contact for ${email}: ${page.id}`);
    return { found: true, pageId: page.id, name };
  }
  
  return { found: false };
}

// Safe wrapper for backward compatibility in places that expect null
export async function findNotionContactByEmailSafe(email: string): Promise<{ pageId: string; name?: string } | null> {
  try {
    const result = await findNotionContactByEmail(email);
    if (result.found) {
      return { pageId: result.pageId, name: result.name };
    }
    return null;
  } catch (error: any) {
    console.error(`Error searching Notion for ${email}:`, error.message);
    return null;
  }
}

// Internal upsert function - checks for existing contact and updates or creates
async function pushContactToNotionInternal(contact: typeof contacts.$inferSelect): Promise<string | null> {
  const notion = await getNotionClient();
  const normalizedEmail = normalizeEmail(contact.email);
  
  // If we already have a Notion page ID, just update
  if (contact.notionPageId) {
    await notion.pages.update({
      page_id: contact.notionPageId,
      properties: buildNotionUpdateProperties(contact),
    });
    console.log(`Updated Notion page for contact: ${contact.email}`);
    return contact.notionPageId;
  }
  
  // Search for existing contact by email (UPSERT logic)
  // IMPORTANT: Don't catch errors here - let them propagate to prevent duplicates
  const existingResult = await findNotionContactByEmail(normalizedEmail);
  
  if (existingResult.found) {
    // UPDATE existing page (don't include email - it's the immutable key)
    await notion.pages.update({
      page_id: existingResult.pageId,
      properties: buildNotionUpdateProperties(contact),
    });
    console.log(`Upsert: Updated existing Notion page for ${contact.email}: ${existingResult.pageId}`);
    return existingResult.pageId;
  } else {
    // CREATE new page (include email)
    const response = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: buildNotionProperties(contact),
    });
    console.log(`Upsert: Created new Notion page for ${contact.email}: ${response.id}`);
    return response.id;
  }
}

// Public function with race condition lock
export async function pushContactToNotion(contact: typeof contacts.$inferSelect): Promise<string | null> {
  if (!(await isConnectorEnabled("notion"))) {
    console.log(`⏸️ Notion connector disabled — skipping push for ${contact.email}`);
    return null;
  }
  const normalizedEmail = normalizeEmail(contact.email);
  
  // Wait for any existing lock on this email
  const existingLock = emailLocks.get(normalizedEmail);
  if (existingLock) {
    console.log(`Waiting for existing sync lock on ${contact.email}`);
    await existingLock;
  }
  
  // Create new lock for this sync
  const syncPromise = pushContactToNotionInternal(contact);
  emailLocks.set(normalizedEmail, syncPromise);
  
  try {
    return await syncPromise;
  } catch (error: any) {
    console.error(`Failed to push contact ${contact.email} to Notion:`, error.message);
    return null;
  } finally {
    emailLocks.delete(normalizedEmail);
  }
}

// Build properties for CREATE (includes email)
function buildNotionProperties(contact: typeof contacts.$inferSelect): any {
  const properties: any = {};
  
  // Name is title field
  if (contact.name) {
    properties['Name'] = {
      title: [{ text: { content: contact.name } }],
    };
  }
  
  // Email is only set on CREATE (immutable key)
  if (contact.email) {
    properties['Email'] = {
      email: normalizeEmail(contact.email),
    };
  }
  
  // Source mapping
  if (contact.source) {
    properties['Source'] = {
      select: { name: SOURCE_MAPPING[contact.source] || contact.source },
    };
  }
  
  // Channels Reached multi-select (🟢 Channels Reached)
  if (contact.channelsReached && contact.channelsReached.length > 0) {
    properties['🟢 Channels Reached'] = {
      multi_select: contact.channelsReached.map(channel => ({ name: channel })),
    };
  }
  
  // Scan Submitted At date (maps to Notion field "label_🛰️ SatelliteScanDone_added_at")
  if (contact.scanSubmittedAt) {
    properties['label_🛰️ SatelliteScanDone_added_at'] = {
      date: { start: contact.scanSubmittedAt.toISOString().split('T')[0] },
    };
  }
  
  return properties;
}

// Build properties for UPDATE (excludes email - it's the immutable key)
function buildNotionUpdateProperties(contact: typeof contacts.$inferSelect): any {
  const properties: any = {};
  
  // Name is title field
  if (contact.name) {
    properties['Name'] = {
      title: [{ text: { content: contact.name } }],
    };
  }
  
  // Note: Email is NOT included in updates - it's the immutable lookup key
  
  // Source mapping - only update if set
  if (contact.source) {
    properties['Source'] = {
      select: { name: SOURCE_MAPPING[contact.source] || contact.source },
    };
  }
  
  // Channels Reached multi-select (🟢 Channels Reached) - append, don't replace
  if (contact.channelsReached && contact.channelsReached.length > 0) {
    properties['🟢 Channels Reached'] = {
      multi_select: contact.channelsReached.map(channel => ({ name: channel })),
    };
  }
  
  // Scan Submitted At date
  if (contact.scanSubmittedAt) {
    properties['label_🛰️ SatelliteScanDone_added_at'] = {
      date: { start: contact.scanSubmittedAt.toISOString().split('T')[0] },
    };
  }
  
  return properties;
}

export async function pullContactsFromNotion(): Promise<{ updated: number; created: number; errors: string[] }> {
  if (!(await isConnectorEnabled("notion"))) {
    console.log('⏸️ Notion disabled — skipping pull');
    return { updated: 0, created: 0, errors: ['Notion connector disabled'] };
  }
  const result = { updated: 0, created: 0, errors: [] as string[] };
  
  try {
    const notion = await getNotionClient();
    let hasMore = true;
    let startCursor: string | undefined = undefined;
    
    while (hasMore) {
      const response = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        start_cursor: startCursor,
        page_size: 100,
      });
      
      for (const page of response.results) {
        try {
          const notionPage = page as any;
          const props = notionPage.properties;
          
          const email = props.Email?.email;
          if (!email) continue;
          
          const nameArr = props.Name?.title;
          const name = nameArr && nameArr.length > 0 ? nameArr[0].text?.content : null;
          
          const sourceSelect = props.Source?.select?.name;
          const source = sourceSelect ? sourceSelect.toLowerCase() : 'newsletter';
          
          const existingContact = await db.select().from(contacts).where(eq(contacts.email, email)).limit(1);
          
          if (existingContact.length > 0) {
            const contact = existingContact[0];
            const notionEditedTime = new Date(notionPage.last_edited_time);
            const localSyncedAt = contact.notionSyncedAt;
            
            if (!localSyncedAt || notionEditedTime > localSyncedAt) {
              await db.update(contacts)
                .set({
                  name: name || contact.name,
                  notionPageId: notionPage.id,
                  notionSyncedAt: new Date(),
                })
                .where(eq(contacts.id, contact.id));
              result.updated++;
            }
          } else {
            const validSources = ['waitlist', 'newsletter', 'recommendation', 'quiz'];
            const safeSource = validSources.includes(source) ? source : 'newsletter';
            
            await db.insert(contacts).values({
              email,
              name: name || null,
              consentGiven: 'true',
              consentText: 'Imported from Notion CRM',
              source: safeSource as any,
              notionPageId: notionPage.id,
              notionSyncedAt: new Date(),
            });
            result.created++;
            console.log(`Created new contact from Notion: ${email}`);
          }
        } catch (pageError: any) {
          result.errors.push(`Error processing Notion page: ${pageError.message}`);
        }
      }
      
      hasMore = response.has_more;
      startCursor = response.next_cursor ?? undefined;
    }
  } catch (error: any) {
    result.errors.push(`Failed to pull from Notion: ${error.message}`);
  }
  
  return result;
}

export async function pushAllContactsToNotion(): Promise<{ pushed: number; errors: string[] }> {
  if (!(await isConnectorEnabled("notion"))) {
    console.log('⏸️ Notion disabled — skipping pushAll');
    return { pushed: 0, errors: ['Notion connector disabled'] };
  }
  const result = { pushed: 0, errors: [] as string[] };
  
  try {
    const allContacts = await db.select().from(contacts);
    
    for (const contact of allContacts) {
      const notionPageId = await pushContactToNotion(contact);
      if (notionPageId) {
        await db.update(contacts)
          .set({
            notionPageId,
            notionSyncedAt: new Date(),
          })
          .where(eq(contacts.id, contact.id));
        result.pushed++;
      } else {
        result.errors.push(`Failed to push contact: ${contact.email}`);
      }
    }
  } catch (error: any) {
    result.errors.push(`Push all failed: ${error.message}`);
  }
  
  return result;
}

export async function syncContactWithNotion(contactId: string): Promise<boolean> {
  try {
    const contactResults = await db.select().from(contacts).where(eq(contacts.id, contactId)).limit(1);
    if (contactResults.length === 0) return false;
    
    const contact = contactResults[0];
    const notionPageId = await pushContactToNotion(contact);
    
    if (notionPageId) {
      await db.update(contacts)
        .set({
          notionPageId,
          notionSyncedAt: new Date(),
        })
        .where(eq(contacts.id, contactId));
      return true;
    }
    return false;
  } catch (error: any) {
    console.error(`Failed to sync contact ${contactId}:`, error.message);
    return false;
  }
}

export async function fullSync(): Promise<SyncResult> {
  const result: SyncResult = { pushed: 0, pulled: 0, errors: [] };
  
  console.log('Starting full Notion sync...');
  
  const pullResult = await pullContactsFromNotion();
  result.pulled = pullResult.updated + pullResult.created;
  result.errors.push(...pullResult.errors);
  
  const pushResult = await pushAllContactsToNotion();
  result.pushed = pushResult.pushed;
  result.errors.push(...pushResult.errors);
  
  console.log(`Full sync complete. Pushed: ${result.pushed}, Pulled: ${result.pulled}, Errors: ${result.errors.length}`);
  
  return result;
}

export async function getUnsyncedContacts(): Promise<typeof contacts.$inferSelect[]> {
  return db.select().from(contacts).where(isNull(contacts.notionPageId));
}

export async function markContactAsCustomer(
  email: string, 
  purchaseDetails: { 
    productName: string; 
    amount: string; 
    customerName?: string;
  }
): Promise<{ success: boolean; isNewContact: boolean; notionPageId?: string; linkedExisting?: boolean }> {
  if (!(await isConnectorEnabled("notion"))) {
    console.log(`⏸️ Notion disabled — skipping markContactAsCustomer for ${email}`);
    return { success: false, isNewContact: false };
  }
  try {
    const notion = await getNotionClient();
    
    let existingContact = await db.select().from(contacts).where(eq(contacts.email, email)).limit(1);
    let isNewContact = false;
    let linkedExisting = false;
    let contact: typeof contacts.$inferSelect;
    
    if (existingContact.length === 0) {
      const [newContact] = await db.insert(contacts).values({
        email,
        name: purchaseDetails.customerName || null,
        consentGiven: 'true',
        consentText: `Purchase consent for ${purchaseDetails.productName}`,
        source: 'recommendation' as any,
      }).returning();
      contact = newContact;
      isNewContact = true;
      console.log(`Created new contact for customer: ${email}`);
    } else {
      contact = existingContact[0];
      if (purchaseDetails.customerName && !contact.name) {
        await db.update(contacts)
          .set({ name: purchaseDetails.customerName })
          .where(eq(contacts.id, contact.id));
        contact.name = purchaseDetails.customerName;
      }
    }
    
    if (contact.notionPageId) {
      console.log(`Contact ${email} already synced to Notion (page: ${contact.notionPageId})`);
      
      await db.update(contacts)
        .set({ notionSyncedAt: new Date() })
        .where(eq(contacts.id, contact.id));
      
      return { success: true, isNewContact, notionPageId: contact.notionPageId };
    }
    
    const existingNotionContact = await findNotionContactByEmail(email);
    
    if (existingNotionContact.found) {
      console.log(`Found existing Notion contact for ${email}, linking to local record`);
      linkedExisting = true;
      
      if (existingNotionContact.name && !contact.name) {
        await db.update(contacts)
          .set({ 
            name: existingNotionContact.name,
            notionPageId: existingNotionContact.pageId,
            notionSyncedAt: new Date() 
          })
          .where(eq(contacts.id, contact.id));
      } else {
        await db.update(contacts)
          .set({ 
            notionPageId: existingNotionContact.pageId,
            notionSyncedAt: new Date() 
          })
          .where(eq(contacts.id, contact.id));
      }
      
      console.log(`Linked existing Notion contact for: ${email}`);
      return { success: true, isNewContact, notionPageId: existingNotionContact.pageId, linkedExisting };
    }
    
    const properties: any = {
      'Email': { email: email },
      'Source': { select: { name: 'Purchase' } },
    };
    
    if (contact.name) {
      properties['Name'] = { title: [{ text: { content: contact.name } }] };
    }
    
    const response = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID },
      properties,
    });
    
    await db.update(contacts)
      .set({ 
        notionPageId: response.id,
        notionSyncedAt: new Date() 
      })
      .where(eq(contacts.id, contact.id));
    
    console.log(`Created new Notion page for customer: ${email}`);
    return { success: true, isNewContact, notionPageId: response.id };
  } catch (error: any) {
    console.error(`Failed to mark ${email} as customer in Notion:`, error.message);
    return { success: false, isNewContact: false };
  }
}

export async function findContactByEmail(email: string): Promise<typeof contacts.$inferSelect | null> {
  const results = await db.select().from(contacts).where(eq(contacts.email, email)).limit(1);
  return results.length > 0 ? results[0] : null;
}

// Sync newsletter campaign status to Notion CRM
// Updates "Satellite Scan Reachout Campaign Comments" column with sent/opened status
export async function syncNewsletterToNotion(campaignId: string, contactId?: string): Promise<{ synced: number; errors: string[] }> {
  if (!(await isConnectorEnabled("notion"))) {
    console.log('⏸️ Notion disabled — skipping newsletter sync');
    return { synced: 0, errors: ['Notion connector disabled'] };
  }
  const result = { synced: 0, errors: [] as string[] };
  
  try {
    const notion = await getNotionClient();
    
    // Import storage dynamically to avoid circular dependency
    const { storage } = await import('../storage');
    const campaign = await storage.getNewsletterCampaignById(campaignId);
    if (!campaign) {
      result.errors.push("Campaign not found");
      return result;
    }
    
    // Get recipients to sync
    let recipients;
    if (contactId) {
      // Sync single recipient
      const recipient = await storage.getNewsletterRecipientByTracking(campaignId, contactId);
      recipients = recipient ? [recipient] : [];
    } else {
      // Sync all unsent recipients for this campaign
      const allRecipients = await storage.getNewsletterRecipientsByCampaign(campaignId);
      recipients = allRecipients.filter(r => r.status === "sent" && r.notionSynced === "false");
    }
    
    for (const recipient of recipients) {
      try {
        // Find contact's Notion page
        const contact = await findContactByEmail(recipient.email);
        let notionPageId = contact?.notionPageId;
        
        if (!notionPageId) {
          // Try to find in Notion by email
          const notionContact = await findNotionContactByEmail(recipient.email);
          if (!notionContact.found) {
            result.errors.push(`No Notion page for ${recipient.email}`);
            continue;
          }
          notionPageId = notionContact.pageId;
        }
        
        if (!notionPageId) continue;
        
        // Build the comment for "Satellite Scan Reachout Campaign Comments"
        const sentDate = recipient.sentAt ? new Date(recipient.sentAt).toLocaleDateString() : "Unknown";
        const openedInfo = recipient.openedAt 
          ? ` | Opened: ${new Date(recipient.openedAt).toLocaleDateString()} (${recipient.openCount}x)` 
          : " | Not opened";
        const comment = `${campaign.name} sent ${sentDate}${openedInfo}`;
        
        // Update Notion page
        await notion.pages.update({
          page_id: notionPageId,
          properties: {
            'Satellite Scan Reachout Campaign Comments': {
              rich_text: [{ text: { content: comment } }],
            },
          },
        });
        
        // Mark as synced
        await storage.updateNewsletterRecipient(recipient.id, {
          notionSynced: "true"
        });
        
        result.synced++;
        console.log(`✓ Synced newsletter status for ${recipient.email} to Notion`);
      } catch (recipientError: any) {
        result.errors.push(`${recipient.email}: ${recipientError.message}`);
      }
    }
    
    return result;
  } catch (error: any) {
    console.error("Newsletter Notion sync error:", error.message);
    result.errors.push(error.message);
    return result;
  }
}

const PIPELINE_OS_DATABASE_ID = '6a43844676574202a5a8e30a935c9eaa';

export async function getPipelineOSTasks(): Promise<string> {
  if (!(await isConnectorEnabled("notion"))) {
    console.log('⏸️ Notion connector disabled — skipping Pipeline OS read');
    return '';
  }

  try {
    const notion = await getNotionClient();
    const response = await notion.databases.query({
      database_id: PIPELINE_OS_DATABASE_ID,
      page_size: 20,
    });

    const tasks: string[] = [];
    for (const page of response.results) {
      if (!('properties' in page)) continue;
      const props = page.properties as any;

      let title = '';
      for (const key of Object.keys(props)) {
        const prop = props[key];
        if (prop.type === 'title' && prop.title?.length > 0) {
          title = prop.title.map((t: any) => t.plain_text).join('');
          break;
        }
      }

      let status = '';
      for (const key of Object.keys(props)) {
        const prop = props[key];
        if (prop.type === 'status' && prop.status?.name) {
          status = prop.status.name;
          break;
        } else if (prop.type === 'select' && prop.select?.name) {
          if (key.toLowerCase().includes('status') || key.toLowerCase().includes('stage')) {
            status = prop.select.name;
            break;
          }
        }
      }

      if (title) {
        tasks.push(status ? `- [${status}] ${title}` : `- ${title}`);
      }
    }

    return tasks.length > 0
      ? `Active Pipeline OS tasks:\n${tasks.join('\n')}`
      : '';
  } catch (error: any) {
    console.error('Failed to read Pipeline OS:', error.message);
    return '';
  }
}
