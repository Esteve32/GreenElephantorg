import { getNotionClient } from './notionClient';
import { db } from '../db';
import { contacts } from '@shared/schema';
import { eq, isNull, and, or } from 'drizzle-orm';

const NOTION_DATABASE_ID = '8818608d251c426c8538920ec88bbde3';

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
  try {
    const notion = await getNotionClient();
    const database = await notion.databases.retrieve({ database_id: NOTION_DATABASE_ID });
    return database;
  } catch (error: any) {
    console.error('Failed to retrieve Notion database schema:', error.message);
    throw error;
  }
}

export async function findNotionContactByEmail(email: string): Promise<{ pageId: string; name?: string } | null> {
  try {
    const notion = await getNotionClient();
    
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        property: 'Email',
        email: {
          equals: email.toLowerCase(),
        },
      },
      page_size: 1,
    });
    
    if (response.results.length > 0) {
      const page = response.results[0] as any;
      const nameArr = page.properties?.Name?.title;
      const name = nameArr && nameArr.length > 0 ? nameArr[0].text?.content : undefined;
      
      console.log(`Found existing Notion contact for ${email}: ${page.id}`);
      return { pageId: page.id, name };
    }
    
    return null;
  } catch (error: any) {
    console.error(`Error searching Notion for ${email}:`, error.message);
    return null;
  }
}

export async function pushContactToNotion(contact: typeof contacts.$inferSelect): Promise<string | null> {
  try {
    const notion = await getNotionClient();
    
    if (contact.notionPageId) {
      await notion.pages.update({
        page_id: contact.notionPageId,
        properties: buildNotionProperties(contact),
      });
      console.log(`Updated Notion page for contact: ${contact.email}`);
      return contact.notionPageId;
    } else {
      const response = await notion.pages.create({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: buildNotionProperties(contact),
      });
      console.log(`Created Notion page for contact: ${contact.email}`);
      return response.id;
    }
  } catch (error: any) {
    console.error(`Failed to push contact ${contact.email} to Notion:`, error.message);
    return null;
  }
}

function buildNotionProperties(contact: typeof contacts.$inferSelect, isNewPage: boolean = true): any {
  const properties: any = {};
  
  if (contact.name) {
    properties['Name'] = {
      title: [{ text: { content: contact.name } }],
    };
  }
  
  if (contact.email) {
    properties['Email'] = {
      email: contact.email,
    };
  }
  
  if (contact.source) {
    const sourceMap: Record<string, string> = {
      'waitlist': 'Waitlist',
      'newsletter': 'Newsletter', 
      'recommendation': 'Recommendation',
      'quiz': 'Quiz',
    };
    properties['Source'] = {
      select: { name: sourceMap[contact.source] || contact.source },
    };
  }
  
  return properties;
}

export async function pullContactsFromNotion(): Promise<{ updated: number; created: number; errors: string[] }> {
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
    
    if (existingNotionContact) {
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
