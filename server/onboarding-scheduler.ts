import { storage } from "./storage";
import { sendOnboardingEmail } from "./email-notifications";
import type { OnboardingEmailTemplate, SatellitescanPurchase } from "@shared/schema";

// Fibonacci delay intervals in minutes (cumulative from scan completion)
// Email 0: 0 (immediately after purchase) - Welcome
// Email 1: 60 (1 hour after scan) - Data is in
// Email 2: 1440 (Day 1) - Start mining patterns
// Email 3: 2880 (Day 2) - Dashboard insights
// Email 4: 4320 (Day 3) - EGO LENS: Conflict Triggers (+1 day Fibonacci)
// Email 5: 7200 (Day 5) - DYNAMICS LENS: Relationships (+2 days)
// Email 6: 11520 (Day 8) - INFLUENCE LENS: Actions & Decisions (+3 days)
// Email 7: 18720 (Day 13) - ATTITUDE LENS: Growth Mindset (+5 days)
// Email 8: 30240 (Day 21) - CHAORDIC LENS: Time Use (+8 days)
// Email 9: 48960 (Day 34) - FLOW LENS: Motivation Radar (+13 days)
// Email 10: 79200 (Day 55) - ALIGNMENT LENS: Empathy & Integrity (+21 days)
// Email 11: 128160 (Day 89) - NEEDS LENS: Unlocking Factors (+34 days)
// Email 12: 207360 (Day 144) - Journey Recap (+55 days)

const SCHEDULER_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes

interface CustomerEmailState {
  customerEmail: string;
  customerName: string | null;
  purchaseDate: Date;
  scanCompletedDate: Date | null;
  lastSentSequence: number;
  lastSentAt: Date | null;
}

async function getCustomersNeedingEmails(): Promise<CustomerEmailState[]> {
  const purchases = await storage.getAllSatellitescanPurchases();
  const results: CustomerEmailState[] = [];
  
  // Group purchases by customer email to avoid duplicates
  const customerMap = new Map<string, {
    customerEmail: string;
    customerName: string | null;
    latestPurchaseDate: Date;
    scanCompletedDate: Date | null;
  }>();
  
  for (const purchase of purchases) {
    if (purchase.status !== 'succeeded') continue;
    
    const existing = customerMap.get(purchase.customerEmail);
    
    // Use the actual typeformCompletedAt timestamp if available
    // Otherwise fall back to createdAt only if typeformCompleted is true
    let scanDate: Date | null = null;
    if (purchase.typeformCompleted === 'true') {
      // Use the new typeformCompletedAt field if it exists, otherwise use createdAt as fallback
      scanDate = purchase.typeformCompletedAt || null;
    }
    
    if (!existing) {
      customerMap.set(purchase.customerEmail, {
        customerEmail: purchase.customerEmail,
        customerName: purchase.customerName,
        latestPurchaseDate: purchase.createdAt,
        scanCompletedDate: scanDate,
      });
    } else {
      // Update to use the LATEST purchase date
      if (purchase.createdAt > existing.latestPurchaseDate) {
        existing.latestPurchaseDate = purchase.createdAt;
        existing.customerName = purchase.customerName || existing.customerName;
      }
      // Use the LATEST scan completion date if available
      if (scanDate && (!existing.scanCompletedDate || scanDate > existing.scanCompletedDate)) {
        existing.scanCompletedDate = scanDate;
      }
    }
  }
  
  // Now get email logs for each unique customer
  for (const customer of Array.from(customerMap.values())) {
    const logs = await storage.getOnboardingEmailLogsByCustomer(customer.customerEmail);
    const sentLogs = logs.filter(l => l.status === 'sent');
    
    let lastSentSequence = -1;
    let lastSentAt: Date | null = null;
    
    if (sentLogs.length > 0) {
      const maxLog = sentLogs.reduce((max, log) => 
        parseInt(log.sequenceNumber) > parseInt(max.sequenceNumber) ? log : max
      );
      lastSentSequence = parseInt(maxLog.sequenceNumber);
      lastSentAt = maxLog.sentAt;
    }
    
    results.push({
      customerEmail: customer.customerEmail,
      customerName: customer.customerName,
      purchaseDate: customer.latestPurchaseDate,
      scanCompletedDate: customer.scanCompletedDate,
      lastSentSequence,
      lastSentAt,
    });
  }
  
  return results;
}

function shouldSendEmail(
  customer: CustomerEmailState,
  template: OnboardingEmailTemplate,
  now: Date
): boolean {
  const sequenceNum = parseInt(template.sequenceNumber);
  const delayMinutes = parseInt(template.delayMinutes);
  
  // Already sent this sequence?
  if (customer.lastSentSequence >= sequenceNum) {
    return false;
  }
  
  // Must be the next in sequence
  if (customer.lastSentSequence + 1 !== sequenceNum) {
    return false;
  }
  
  // Check trigger event
  if (template.triggerEvent === 'purchase') {
    // Calculate if enough time has passed since purchase
    const triggerTime = customer.purchaseDate;
    const dueTime = new Date(triggerTime.getTime() + delayMinutes * 60 * 1000);
    return now >= dueTime;
  } else if (template.triggerEvent === 'scan_completed') {
    // Must have completed scan
    if (!customer.scanCompletedDate) {
      return false;
    }
    
    // Calculate cumulative delay from scan completion
    const triggerTime = customer.scanCompletedDate;
    const dueTime = new Date(triggerTime.getTime() + delayMinutes * 60 * 1000);
    return now >= dueTime;
  }
  
  return false;
}

async function processOnboardingEmails(): Promise<void> {
  try {
    const templates = await storage.getActiveOnboardingEmailTemplates();
    if (templates.length === 0) {
      return; // No templates configured yet
    }
    
    const customers = await getCustomersNeedingEmails();
    const now = new Date();
    
    for (const customer of customers) {
      // Sort templates by sequence number
      const sortedTemplates = templates.sort((a, b) => 
        parseInt(a.sequenceNumber) - parseInt(b.sequenceNumber)
      );
      
      for (const template of sortedTemplates) {
        if (shouldSendEmail(customer, template, now)) {
          try {
            const sent = await sendOnboardingEmail({
              customerEmail: customer.customerEmail,
              customerName: customer.customerName,
              subject: template.subject,
              body: template.body,
              sequenceNumber: template.sequenceNumber,
            });
            
            // Log the result
            await storage.createOnboardingEmailLog({
              customerEmail: customer.customerEmail,
              templateId: template.id,
              sequenceNumber: template.sequenceNumber,
              status: sent ? 'sent' : 'failed',
              errorMessage: sent ? undefined : 'Email send returned false',
            });
            
            if (sent) {
              console.log(`📧 Onboarding email #${template.sequenceNumber} sent to ${customer.customerEmail}`);
            }
            
            // Only send one email per customer per cycle
            break;
          } catch (error: any) {
            console.error(`❌ Error sending onboarding email #${template.sequenceNumber} to ${customer.customerEmail}:`, error);
            
            await storage.createOnboardingEmailLog({
              customerEmail: customer.customerEmail,
              templateId: template.id,
              sequenceNumber: template.sequenceNumber,
              status: 'failed',
              errorMessage: error.message || 'Unknown error',
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Error in onboarding email scheduler:', error);
  }
}

// Manual trigger for a specific customer and sequence
export async function triggerOnboardingEmail(
  customerEmail: string,
  sequenceNumber: string
): Promise<{ success: boolean; message: string }> {
  try {
    const template = await storage.getOnboardingEmailTemplateBySequence(sequenceNumber);
    if (!template) {
      return { success: false, message: `Template for sequence ${sequenceNumber} not found` };
    }
    
    if (template.isActive !== 'true') {
      return { success: false, message: `Template for sequence ${sequenceNumber} is not active` };
    }
    
    // Check if already sent
    const alreadySent = await storage.hasEmailBeenSent(customerEmail, sequenceNumber);
    if (alreadySent) {
      return { success: false, message: `Email #${sequenceNumber} already sent to ${customerEmail}` };
    }
    
    // Get customer info
    const purchases = await storage.getAllSatellitescanPurchases();
    const purchase = purchases.find(p => p.customerEmail === customerEmail);
    
    const sent = await sendOnboardingEmail({
      customerEmail,
      customerName: purchase?.customerName || null,
      subject: template.subject,
      body: template.body,
      sequenceNumber: template.sequenceNumber,
    });
    
    await storage.createOnboardingEmailLog({
      customerEmail,
      templateId: template.id,
      sequenceNumber: template.sequenceNumber,
      status: sent ? 'sent' : 'failed',
      errorMessage: sent ? undefined : 'Email send returned false',
    });
    
    if (sent) {
      return { success: true, message: `Email #${sequenceNumber} sent to ${customerEmail}` };
    } else {
      return { success: false, message: `Failed to send email #${sequenceNumber}` };
    }
  } catch (error: any) {
    console.error('Error triggering onboarding email:', error);
    return { success: false, message: error.message || 'Unknown error' };
  }
}

// Start the scheduler
let schedulerInterval: NodeJS.Timeout | null = null;

export function startOnboardingScheduler(): void {
  if (schedulerInterval) {
    console.log('⚠️ Onboarding email scheduler already running');
    return;
  }
  
  console.log('🔔 Onboarding email scheduler initialized');
  console.log(`⏰ Will check for pending onboarding emails every ${SCHEDULER_INTERVAL / 60000} minutes`);
  
  // Run immediately once
  processOnboardingEmails();
  
  // Then run on interval
  schedulerInterval = setInterval(processOnboardingEmails, SCHEDULER_INTERVAL);
}

export function stopOnboardingScheduler(): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log('🛑 Onboarding email scheduler stopped');
  }
}

// Export for testing
export { processOnboardingEmails };
