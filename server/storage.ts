import { 
  type User, 
  type InsertUser, 
  type RecommendationSubmission, 
  type InsertRecommendationSubmission,
  type Contact,
  type InsertContact,
  type WaitlistEntry,
  type InsertWaitlistEntry,
  type WebinarWaitlistEntry,
  type InsertWebinarWaitlistEntry,
  type NewsletterSubscription,
  type InsertNewsletterSubscription,
  type SignalsQuizResult,
  type InsertSignalsQuizResult,
  type Purchase,
  type InsertPurchase,
  type ContactMessage,
  type InsertContactMessage,
  type SatellitescanPurchase,
  type InsertSatellitescanPurchase,
  type Coupon,
  type InsertCoupon,
  type Prompt,
  type InsertPrompt,
  type EmailVerification,
  type InsertEmailVerification,
  type OnboardingEmailTemplate,
  type InsertOnboardingEmailTemplate,
  type OnboardingEmailLog,
  type InsertOnboardingEmailLog,
  type BatchEmailSend,
  type BatchEmailRecipient,
  type NewsletterCampaign,
  type InsertNewsletterCampaign,
  type NewsletterRecipient,
  type InsertNewsletterRecipient,
  type WebinarSettings,
  type InsertWebinarSettings,
  type WebinarSession,
  type InsertWebinarSession,
  type CalendarEvent,
  type InsertCalendarEvent,
  type FlowCheckResult,
  type InsertFlowCheckResult,
  users,
  recommendationSubmissions,
  contacts,
  waitlistEntries,
  webinarWaitlistEntries,
  newsletterSubscriptions,
  signalsQuizResults,
  purchases,
  contactMessages,
  satellitescanPurchases,
  coupons,
  prompts,
  emailVerifications,
  onboardingEmailTemplates,
  onboardingEmailLogs,
  batchEmailSends,
  batchEmailRecipients,
  newsletterCampaigns,
  newsletterRecipients,
  webinarSettings,
  webinarSessions,
  calendarEvents,
  flowCheckResults
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, avg, and, lt, sql } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createRecommendationSubmission(submission: InsertRecommendationSubmission): Promise<RecommendationSubmission>;
  getAllRecommendationSubmissions(): Promise<RecommendationSubmission[]>;
  
  // Contact management with GDPR support
  createContact(contact: InsertContact): Promise<Contact>;
  getContactByEmail(email: string): Promise<Contact | undefined>;
  getAllContacts(): Promise<Contact[]>;
  addChannelToContact(email: string, channel: string): Promise<Contact | undefined>;
  getContactsByChannel(channel: string): Promise<Contact[]>;
  getContactsWithoutChannel(channel: string): Promise<Contact[]>;
  updateScanSubmittedAt(email: string, submittedAt: Date): Promise<Contact | undefined>;
  
  // Waitlist entries
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  getAllWaitlistEntries(): Promise<WaitlistEntry[]>;
  
  // Webinar waitlist entries
  createWebinarWaitlistEntry(entry: InsertWebinarWaitlistEntry): Promise<WebinarWaitlistEntry>;
  getAllWebinarWaitlistEntries(): Promise<WebinarWaitlistEntry[]>;
  
  // Newsletter subscriptions
  createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription>;
  getAllNewsletterSubscriptions(): Promise<NewsletterSubscription[]>;
  
  // Signals quiz results
  createSignalsQuizResult(result: InsertSignalsQuizResult): Promise<SignalsQuizResult>;
  getQuizAverageScore(): Promise<number>;
  getAllSignalsQuizResults(): Promise<SignalsQuizResult[]>;
  
  // Purchases
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  getPurchaseByPaymentIntent(paymentIntentId: string): Promise<Purchase | undefined>;
  getAllPurchases(): Promise<Purchase[]>;
  
  // Contact messages (general inquiries)
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  
  // Satellite Scan purchases
  createSatellitescanPurchase(purchase: InsertSatellitescanPurchase): Promise<SatellitescanPurchase>;
  getSatellitescanPurchaseByPaymentIntent(paymentIntentId: string): Promise<SatellitescanPurchase | undefined>;
  getAllSatellitescanPurchases(): Promise<SatellitescanPurchase[]>;
  getOverdueSatellitescanPurchases(hoursThreshold: number): Promise<SatellitescanPurchase[]>;
  updateSatellitescanReminderCount(purchaseId: string, count: number): Promise<void>;
  markTypeformCompletedByEmail(email: string): Promise<number>; // Returns count of updated purchases
  updateSatellitescanRole(email: string, role: string): Promise<void>;

  // Coupons
  getCouponByCode(code: string): Promise<Coupon | undefined>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  getAllCoupons(): Promise<Coupon[]>;
  updateCoupon(code: string, updates: Partial<InsertCoupon>): Promise<Coupon | undefined>;
  deleteCoupon(code: string): Promise<void>;
  incrementCouponUsage(couponId: string): Promise<void>;
  
  // Prompts
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  getPromptById(id: string): Promise<Prompt | undefined>;
  getAllPrompts(): Promise<Prompt[]>;
  getActivePrompts(): Promise<Prompt[]>;
  getPromptsByLens(lensType: string): Promise<Prompt[]>;
  getPromptsByRole(roleCategory: string): Promise<Prompt[]>;
  updatePrompt(id: string, prompt: Partial<InsertPrompt>): Promise<Prompt | undefined>;
  deletePrompt(id: string): Promise<boolean>;
  upvotePrompt(id: string): Promise<Prompt | undefined>;
  
  // Email verification
  createEmailVerification(email: string, code: string): Promise<EmailVerification>;
  getEmailVerification(email: string, code: string): Promise<EmailVerification | undefined>;
  markEmailVerified(email: string): Promise<void>;
  cleanupExpiredVerifications(): Promise<void>;
  
  // Onboarding email templates
  createOnboardingEmailTemplate(template: InsertOnboardingEmailTemplate): Promise<OnboardingEmailTemplate>;
  getOnboardingEmailTemplateById(id: string): Promise<OnboardingEmailTemplate | undefined>;
  getOnboardingEmailTemplateBySequence(sequenceNumber: string): Promise<OnboardingEmailTemplate | undefined>;
  getAllOnboardingEmailTemplates(): Promise<OnboardingEmailTemplate[]>;
  getActiveOnboardingEmailTemplates(): Promise<OnboardingEmailTemplate[]>;
  getOnboardingEmailTemplatesByTrigger(triggerEvent: string): Promise<OnboardingEmailTemplate[]>;
  updateOnboardingEmailTemplate(id: string, template: Partial<InsertOnboardingEmailTemplate>): Promise<OnboardingEmailTemplate | undefined>;
  deleteOnboardingEmailTemplate(id: string): Promise<boolean>;
  
  // Onboarding email logs
  createOnboardingEmailLog(log: InsertOnboardingEmailLog): Promise<OnboardingEmailLog>;
  getOnboardingEmailLogsByCustomer(customerEmail: string): Promise<OnboardingEmailLog[]>;
  getLastSentEmailForCustomer(customerEmail: string): Promise<OnboardingEmailLog | undefined>;
  hasEmailBeenSent(customerEmail: string, sequenceNumber: string): Promise<boolean>;
  getCustomersDueForEmail(triggerEvent: string, sequenceNumber: string): Promise<string[]>;
  
  // Batch email campaigns
  getContactsWithFilters(includeChannels?: string[], excludeChannels?: string[]): Promise<Contact[]>;
  createBatchEmailSend(data: { subject: string; body: string; filterCriteria: object; recipientCount: string }): Promise<BatchEmailSend>;
  updateBatchEmailSend(id: string, data: Partial<{ successCount: string; failedCount: string; status: string; sentAt: Date }>): Promise<BatchEmailSend | undefined>;
  getAllBatchEmailSends(): Promise<BatchEmailSend[]>;
  getBatchEmailSendById(id: string): Promise<BatchEmailSend | undefined>;
  createBatchEmailRecipient(data: { batchId: string; contactId: string; email: string; status?: string }): Promise<BatchEmailRecipient>;
  updateBatchEmailRecipient(id: string, data: Partial<{ status: string; errorMessage?: string; sentAt?: Date }>): Promise<BatchEmailRecipient | undefined>;
  getBatchEmailRecipientsByBatchId(batchId: string): Promise<BatchEmailRecipient[]>;
  
  // Newsletter campaigns
  createNewsletterCampaign(data: InsertNewsletterCampaign): Promise<NewsletterCampaign>;
  getNewsletterCampaignById(id: string): Promise<NewsletterCampaign | undefined>;
  getAllNewsletterCampaigns(): Promise<NewsletterCampaign[]>;
  updateNewsletterCampaign(id: string, data: Partial<InsertNewsletterCampaign & { sentAt?: Date }>): Promise<NewsletterCampaign | undefined>;
  deleteNewsletterCampaign(id: string): Promise<boolean>;
  
  // Newsletter recipients
  createNewsletterRecipient(data: InsertNewsletterRecipient): Promise<NewsletterRecipient>;
  getNewsletterRecipientsByCampaign(campaignId: string): Promise<NewsletterRecipient[]>;
  updateNewsletterRecipient(id: string, data: Partial<{ status: string; excluded: string; openedAt?: Date; openCount: string; notionSynced: string; errorMessage?: string; sentAt?: Date }>): Promise<NewsletterRecipient | undefined>;
  getNewsletterRecipientByTracking(campaignId: string, contactId: string): Promise<NewsletterRecipient | undefined>;
  recordNewsletterOpen(campaignId: string, contactId: string): Promise<NewsletterRecipient | undefined>;
  getUnsyncedNewsletterRecipients(): Promise<NewsletterRecipient[]>;
  
  // Webinar settings
  getWebinarSettings(): Promise<WebinarSettings | undefined>;
  upsertWebinarSettings(settings: InsertWebinarSettings): Promise<WebinarSettings>;

  // Webinar sessions (admin-configurable upcoming sessions)
  getAllWebinarSessions(): Promise<WebinarSession[]>;
  createWebinarSession(session: InsertWebinarSession): Promise<WebinarSession>;
  updateWebinarSession(id: string, session: Partial<InsertWebinarSession>): Promise<WebinarSession | undefined>;
  deleteWebinarSession(id: string): Promise<boolean>;

  // Calendar events (12-month lens calendar, admin-editable)
  getAllCalendarEvents(): Promise<CalendarEvent[]>;
  createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent>;
  updateCalendarEvent(id: string, event: Partial<InsertCalendarEvent>): Promise<CalendarEvent | undefined>;
  deleteCalendarEvent(id: string): Promise<boolean>;

  // Flow check results
  createFlowCheckResult(result: InsertFlowCheckResult): Promise<FlowCheckResult>;
  getAllFlowCheckResults(): Promise<FlowCheckResult[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private recommendationSubmissions: Map<string, RecommendationSubmission>;
  private contacts: Map<string, Contact>;
  private waitlistEntries: Map<string, WaitlistEntry>;
  private newsletterSubscriptions: Map<string, NewsletterSubscription>;
  private signalsQuizResults: Map<string, SignalsQuizResult>;
  private purchases: Map<string, Purchase>;
  private contactMessages: Map<string, ContactMessage>;
  private satellitescanPurchases: Map<string, SatellitescanPurchase>;
  private flowCheckResultsMap: Map<string, FlowCheckResult>;
  private webinarSessionsMap: Map<string, WebinarSession>;
  private calendarEventsMap: Map<string, CalendarEvent>;

  constructor() {
    this.users = new Map();
    this.recommendationSubmissions = new Map();
    this.contacts = new Map();
    this.waitlistEntries = new Map();
    this.newsletterSubscriptions = new Map();
    this.signalsQuizResults = new Map();
    this.purchases = new Map();
    this.contactMessages = new Map();
    this.satellitescanPurchases = new Map();
    this.flowCheckResultsMap = new Map();
    this.webinarSessionsMap = new Map();
    this.calendarEventsMap = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createRecommendationSubmission(insertSubmission: InsertRecommendationSubmission): Promise<RecommendationSubmission> {
    const id = randomUUID();
    const submission: RecommendationSubmission = {
      ...insertSubmission,
      id,
      createdAt: new Date(),
      phone: insertSubmission.phone || null,
      preferredContactTime: insertSubmission.preferredContactTime || null,
    };
    this.recommendationSubmissions.set(id, submission);
    console.log(`✓ Recommendation submission stored: ${insertSubmission.name} → ${insertSubmission.recommendedPath}`);
    return submission;
  }

  async getAllRecommendationSubmissions(): Promise<RecommendationSubmission[]> {
    return Array.from(this.recommendationSubmissions.values());
  }

  // Contact management methods
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const { channelsReached: chReached, ...restInsert } = insertContact;
    const contact: Contact = {
      ...restInsert,
      id,
      name: insertContact.name || null,
      consentedAt: new Date(),
      createdAt: new Date(),
      notionPageId: null,
      notionSyncedAt: null,
      scanSubmittedAt: null,
      channelsReached: chReached ?? null,
    };
    this.contacts.set(id, contact);
    console.log(`✓ Contact created: ${insertContact.email} (${insertContact.source})`);
    return contact;
  }

  async getContactByEmail(email: string): Promise<Contact | undefined> {
    return Array.from(this.contacts.values()).find(
      (contact) => contact.email === email,
    );
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async addChannelToContact(email: string, channel: string): Promise<Contact | undefined> {
    const contact = await this.getContactByEmail(email);
    if (!contact) return undefined;
    
    const currentChannels = contact.channelsReached || [];
    if (!currentChannels.includes(channel)) {
      contact.channelsReached = [...currentChannels, channel];
      this.contacts.set(contact.id, contact);
      console.log(`✓ Added channel '${channel}' to contact: ${email}`);
    }
    return contact;
  }

  async getContactsByChannel(channel: string): Promise<Contact[]> {
    return Array.from(this.contacts.values()).filter(
      contact => contact.channelsReached?.includes(channel)
    );
  }

  async getContactsWithoutChannel(channel: string): Promise<Contact[]> {
    return Array.from(this.contacts.values()).filter(
      contact => !contact.channelsReached?.includes(channel)
    );
  }

  async updateScanSubmittedAt(email: string, submittedAt: Date): Promise<Contact | undefined> {
    const contact = await this.getContactByEmail(email);
    if (!contact) return undefined;
    
    contact.scanSubmittedAt = submittedAt;
    this.contacts.set(contact.id, contact);
    console.log(`✓ Updated scan submitted date for: ${email}`);
    return contact;
  }

  // Waitlist entry methods
  async createWaitlistEntry(insertEntry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const id = randomUUID();
    const entry: WaitlistEntry = {
      ...insertEntry,
      id,
      retreatType: insertEntry.retreatType || null,
      createdAt: new Date(),
    };
    this.waitlistEntries.set(id, entry);
    console.log(`✓ Waitlist entry created: ${insertEntry.contactId}`);
    return entry;
  }

  async getAllWaitlistEntries(): Promise<WaitlistEntry[]> {
    return Array.from(this.waitlistEntries.values());
  }

  // Newsletter subscription methods
  async createNewsletterSubscription(insertSubscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    const id = randomUUID();
    const subscription: NewsletterSubscription = {
      ...insertSubscription,
      id,
      createdAt: new Date(),
    };
    this.newsletterSubscriptions.set(id, subscription);
    console.log(`✓ Newsletter subscription created: ${insertSubscription.contactId}`);
    return subscription;
  }

  async getAllNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return Array.from(this.newsletterSubscriptions.values());
  }

  // Signals quiz methods
  async createSignalsQuizResult(insertResult: InsertSignalsQuizResult): Promise<SignalsQuizResult> {
    const id = randomUUID();
    // Score is validated as number by Zod, convert to string for storage
    const result: SignalsQuizResult = {
      id,
      contactId: insertResult.contactId || null,
      score: insertResult.score.toString(),
      answers: insertResult.answers,
      createdAt: new Date(),
    };
    this.signalsQuizResults.set(id, result);
    console.log(`✓ Signals quiz result stored: score ${insertResult.score}`);
    return result;
  }

  async getQuizAverageScore(): Promise<number> {
    const results = Array.from(this.signalsQuizResults.values());
    if (results.length === 0) {
      return 0;
    }
    
    // Filter out any invalid scores and calculate average safely
    const validScores = results
      .map(result => parseFloat(result.score))
      .filter(score => !isNaN(score) && isFinite(score));
    
    if (validScores.length === 0) {
      return 0;
    }
    
    const total = validScores.reduce((sum, score) => sum + score, 0);
    return Math.round(total / validScores.length);
  }

  async getAllSignalsQuizResults(): Promise<SignalsQuizResult[]> {
    return Array.from(this.signalsQuizResults.values());
  }

  // Purchase methods
  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const id = randomUUID();
    const purchase: Purchase = {
      ...insertPurchase,
      id,
      customerName: insertPurchase.customerName || null,
      calendlyBooked: "false",
      createdAt: new Date(),
    };
    this.purchases.set(id, purchase);
    console.log(`✓ Purchase created: ${insertPurchase.customerEmail} → ${insertPurchase.packageName} (€${insertPurchase.amount})`);
    return purchase;
  }

  async getPurchaseByPaymentIntent(paymentIntentId: string): Promise<Purchase | undefined> {
    return Array.from(this.purchases.values()).find(
      (purchase) => purchase.stripePaymentIntentId === paymentIntentId,
    );
  }

  async getAllPurchases(): Promise<Purchase[]> {
    return Array.from(this.purchases.values());
  }

  // Contact message methods
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const message: ContactMessage = {
      ...insertMessage,
      id,
      intent: insertMessage.intent || null,
      createdAt: new Date(),
    };
    this.contactMessages.set(id, message);
    console.log(`✓ Contact message created: ${insertMessage.name} (${insertMessage.email})`);
    return message;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  // Satellite Scan purchase methods
  async createSatellitescanPurchase(insertPurchase: InsertSatellitescanPurchase): Promise<SatellitescanPurchase> {
    const id = randomUUID();
    const purchase: SatellitescanPurchase = {
      ...insertPurchase,
      id,
      customerName: insertPurchase.customerName || null,
      role: insertPurchase.role ?? null,
      typeformCompleted: "false",
      typeformCompletedAt: null,
      dashboardSent: "false",
      remindersCount: "0",
      createdAt: new Date(),
    };
    this.satellitescanPurchases.set(id, purchase);
    console.log(`✓ Satellitescan purchase created: ${insertPurchase.customerEmail} (€${insertPurchase.amount})`);
    return purchase;
  }

  async getSatellitescanPurchaseByPaymentIntent(paymentIntentId: string): Promise<SatellitescanPurchase | undefined> {
    return Array.from(this.satellitescanPurchases.values()).find(
      (purchase) => purchase.stripePaymentIntentId === paymentIntentId,
    );
  }

  async getAllSatellitescanPurchases(): Promise<SatellitescanPurchase[]> {
    return Array.from(this.satellitescanPurchases.values());
  }

  async getOverdueSatellitescanPurchases(hoursThreshold: number): Promise<SatellitescanPurchase[]> {
    const now = new Date();
    const thresholdMs = hoursThreshold * 60 * 60 * 1000;
    
    return Array.from(this.satellitescanPurchases.values()).filter(purchase => {
      const createdAt = new Date(purchase.createdAt);
      const ageMs = now.getTime() - createdAt.getTime();
      
      return (
        purchase.typeformCompleted === "false" &&
        parseInt(purchase.remindersCount) === 0 &&
        ageMs >= thresholdMs
      );
    });
  }

  async updateSatellitescanReminderCount(purchaseId: string, count: number): Promise<void> {
    const purchase = this.satellitescanPurchases.get(purchaseId);
    if (purchase) {
      purchase.remindersCount = count.toString();
      this.satellitescanPurchases.set(purchaseId, purchase);
    }
  }
  
  async markTypeformCompletedByEmail(email: string): Promise<number> {
    let count = 0;
    const normalizedEmail = email.toLowerCase().trim();
    for (const [id, purchase] of Array.from(this.satellitescanPurchases.entries())) {
      if (purchase.customerEmail.toLowerCase().trim() === normalizedEmail && purchase.typeformCompleted === "false") {
        purchase.typeformCompleted = "true";
        purchase.typeformCompletedAt = new Date();
        this.satellitescanPurchases.set(id, purchase);
        count++;
      }
    }
    return count;
  }

  async updateSatellitescanRole(email: string, role: string): Promise<void> {
    const normalizedEmail = email.toLowerCase().trim();
    for (const [id, purchase] of Array.from(this.satellitescanPurchases.entries())) {
      if (purchase.customerEmail.toLowerCase().trim() === normalizedEmail) {
        (purchase as any).role = role;
        this.satellitescanPurchases.set(id, purchase);
      }
    }
  }
  
  // Email verification methods (memory implementation - not used in production)
  async createEmailVerification(email: string, code: string): Promise<EmailVerification> {
    throw new Error("MemStorage does not support email verification");
  }
  
  async getEmailVerification(email: string, code: string): Promise<EmailVerification | undefined> {
    throw new Error("MemStorage does not support email verification");
  }
  
  async markEmailVerified(email: string): Promise<void> {
    throw new Error("MemStorage does not support email verification");
  }
  
  async cleanupExpiredVerifications(): Promise<void> {
    // No-op for memory storage
  }

  // Batch email methods (stub implementations for MemStorage)
  async getContactsWithFilters(includeChannels?: string[], excludeChannels?: string[]): Promise<Contact[]> {
    let result = Array.from(this.contacts.values());
    
    if (includeChannels && includeChannels.length > 0) {
      result = result.filter(c => 
        c.channelsReached && includeChannels.some(ch => c.channelsReached!.includes(ch))
      );
    }
    
    if (excludeChannels && excludeChannels.length > 0) {
      result = result.filter(c => 
        !c.channelsReached || !excludeChannels.some(ch => c.channelsReached!.includes(ch))
      );
    }
    
    return result;
  }

  async createBatchEmailSend(data: { subject: string; body: string; filterCriteria: object; recipientCount: string }): Promise<BatchEmailSend> {
    throw new Error("MemStorage does not support batch email sends");
  }

  async updateBatchEmailSend(id: string, data: Partial<{ successCount: string; failedCount: string; status: string; sentAt: Date }>): Promise<BatchEmailSend | undefined> {
    throw new Error("MemStorage does not support batch email sends");
  }

  async getAllBatchEmailSends(): Promise<BatchEmailSend[]> {
    return [];
  }

  async getBatchEmailSendById(id: string): Promise<BatchEmailSend | undefined> {
    throw new Error("MemStorage does not support batch email sends");
  }

  async createBatchEmailRecipient(data: { batchId: string; contactId: string; email: string; status?: string }): Promise<BatchEmailRecipient> {
    throw new Error("MemStorage does not support batch email recipients");
  }

  async updateBatchEmailRecipient(id: string, data: Partial<{ status: string; errorMessage?: string; sentAt?: Date }>): Promise<BatchEmailRecipient | undefined> {
    throw new Error("MemStorage does not support batch email recipients");
  }

  async getBatchEmailRecipientsByBatchId(batchId: string): Promise<BatchEmailRecipient[]> {
    return [];
  }

  // Newsletter campaign stubs
  async createNewsletterCampaign(data: InsertNewsletterCampaign): Promise<NewsletterCampaign> {
    throw new Error("MemStorage does not support newsletter campaigns");
  }
  async getNewsletterCampaignById(id: string): Promise<NewsletterCampaign | undefined> {
    return undefined;
  }
  async getAllNewsletterCampaigns(): Promise<NewsletterCampaign[]> {
    return [];
  }
  async updateNewsletterCampaign(id: string, data: Partial<InsertNewsletterCampaign & { sentAt?: Date }>): Promise<NewsletterCampaign | undefined> {
    return undefined;
  }
  async deleteNewsletterCampaign(id: string): Promise<boolean> {
    return false;
  }
  async createNewsletterRecipient(data: InsertNewsletterRecipient): Promise<NewsletterRecipient> {
    throw new Error("MemStorage does not support newsletter recipients");
  }
  async getNewsletterRecipientsByCampaign(campaignId: string): Promise<NewsletterRecipient[]> {
    return [];
  }
  async updateNewsletterRecipient(id: string, data: Partial<{ status: string; excluded: string; openedAt?: Date; openCount: string; notionSynced: string; errorMessage?: string; sentAt?: Date }>): Promise<NewsletterRecipient | undefined> {
    return undefined;
  }
  async getNewsletterRecipientByTracking(campaignId: string, contactId: string): Promise<NewsletterRecipient | undefined> {
    return undefined;
  }
  async recordNewsletterOpen(campaignId: string, contactId: string): Promise<NewsletterRecipient | undefined> {
    return undefined;
  }
  async getUnsyncedNewsletterRecipients(): Promise<NewsletterRecipient[]> {
    return [];
  }
  async getWebinarSettings(): Promise<WebinarSettings | undefined> {
    return undefined;
  }
  async upsertWebinarSettings(settings: InsertWebinarSettings): Promise<WebinarSettings> {
    throw new Error("Not implemented in MemStorage");
  }

  async getAllWebinarSessions(): Promise<WebinarSession[]> {
    return Array.from(this.webinarSessionsMap.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }
  async createWebinarSession(session: InsertWebinarSession): Promise<WebinarSession> {
    const id = randomUUID();
    const record: WebinarSession = { ...session, id, createdAt: new Date() };
    this.webinarSessionsMap.set(id, record);
    return record;
  }
  async updateWebinarSession(id: string, session: Partial<InsertWebinarSession>): Promise<WebinarSession | undefined> {
    const existing = this.webinarSessionsMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...session };
    this.webinarSessionsMap.set(id, updated);
    return updated;
  }
  async deleteWebinarSession(id: string): Promise<boolean> {
    return this.webinarSessionsMap.delete(id);
  }

  async getAllCalendarEvents(): Promise<CalendarEvent[]> {
    return Array.from(this.calendarEventsMap.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }
  async createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent> {
    const id = randomUUID();
    const record: CalendarEvent = { ...event, id, createdAt: new Date() };
    this.calendarEventsMap.set(id, record);
    return record;
  }
  async updateCalendarEvent(id: string, event: Partial<InsertCalendarEvent>): Promise<CalendarEvent | undefined> {
    const existing = this.calendarEventsMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...event };
    this.calendarEventsMap.set(id, updated);
    return updated;
  }
  async deleteCalendarEvent(id: string): Promise<boolean> {
    return this.calendarEventsMap.delete(id);
  }

  async createFlowCheckResult(result: InsertFlowCheckResult): Promise<FlowCheckResult> {
    const id = randomUUID();
    const record: FlowCheckResult = {
      id,
      contactId: result.contactId ?? null,
      situation: result.situation,
      customSituation: result.customSituation ?? null,
      role: result.role,
      motivation: result.motivation,
      challenge: result.challenge,
      competence: result.competence,
      zone: result.zone,
      createdAt: new Date(),
    };
    this.flowCheckResultsMap.set(id, record);
    return record;
  }

  async getAllFlowCheckResults(): Promise<FlowCheckResult[]> {
    return Array.from(this.flowCheckResultsMap.values());
  }
}

// PostgreSQL-based storage using Drizzle ORM
export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createRecommendationSubmission(insertSubmission: InsertRecommendationSubmission): Promise<RecommendationSubmission> {
    const [submission] = await db.insert(recommendationSubmissions).values(insertSubmission).returning();
    console.log(`✓ Recommendation submission stored: ${insertSubmission.name} → ${insertSubmission.recommendedPath}`);
    return submission;
  }

  async getAllRecommendationSubmissions(): Promise<RecommendationSubmission[]> {
    return await db.select().from(recommendationSubmissions);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    console.log(`✓ Contact created: ${insertContact.email} (${insertContact.source})`);
    return contact;
  }

  async getContactByEmail(email: string): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.email, email)).limit(1);
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts);
  }

  async addChannelToContact(email: string, channel: string): Promise<Contact | undefined> {
    const contact = await this.getContactByEmail(email);
    if (!contact) return undefined;
    
    const currentChannels = contact.channelsReached || [];
    if (!currentChannels.includes(channel)) {
      const [updated] = await db.update(contacts)
        .set({ channelsReached: [...currentChannels, channel] })
        .where(eq(contacts.email, email))
        .returning();
      console.log(`✓ Added channel '${channel}' to contact: ${email}`);
      return updated;
    }
    return contact;
  }

  async getContactsByChannel(channel: string): Promise<Contact[]> {
    const allContacts = await db.select().from(contacts);
    return allContacts.filter(contact => contact.channelsReached?.includes(channel));
  }

  async getContactsWithoutChannel(channel: string): Promise<Contact[]> {
    const allContacts = await db.select().from(contacts);
    return allContacts.filter(contact => !contact.channelsReached?.includes(channel));
  }

  async updateScanSubmittedAt(email: string, submittedAt: Date): Promise<Contact | undefined> {
    const [contact] = await db.update(contacts)
      .set({ scanSubmittedAt: submittedAt })
      .where(eq(contacts.email, email))
      .returning();
    if (contact) {
      console.log(`✓ Updated scan submitted date for: ${email}`);
    }
    return contact;
  }

  async createWaitlistEntry(insertEntry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const [entry] = await db.insert(waitlistEntries).values(insertEntry).returning();
    console.log(`✓ Waitlist entry created: ${insertEntry.contactId}`);
    return entry;
  }

  async getAllWaitlistEntries(): Promise<WaitlistEntry[]> {
    return await db.select().from(waitlistEntries);
  }

  async createWebinarWaitlistEntry(insertEntry: InsertWebinarWaitlistEntry): Promise<WebinarWaitlistEntry> {
    const [entry] = await db.insert(webinarWaitlistEntries).values(insertEntry).returning();
    console.log(`✓ Webinar waitlist entry created: ${insertEntry.contactId}`);
    return entry;
  }

  async getAllWebinarWaitlistEntries(): Promise<WebinarWaitlistEntry[]> {
    return await db.select().from(webinarWaitlistEntries);
  }

  async createNewsletterSubscription(insertSubscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    const [subscription] = await db.insert(newsletterSubscriptions).values(insertSubscription).returning();
    console.log(`✓ Newsletter subscription created: ${insertSubscription.contactId}`);
    return subscription;
  }

  async getAllNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return await db.select().from(newsletterSubscriptions);
  }

  async createSignalsQuizResult(insertResult: InsertSignalsQuizResult): Promise<SignalsQuizResult> {
    const [result] = await db.insert(signalsQuizResults).values({
      contactId: insertResult.contactId || null,
      score: insertResult.score.toString(),
      answers: insertResult.answers,
    }).returning();
    console.log(`✓ Signals quiz result stored: score ${insertResult.score}`);
    return result;
  }

  async getQuizAverageScore(): Promise<number> {
    const results = await db.select().from(signalsQuizResults);
    if (results.length === 0) {
      return 0;
    }
    
    const validScores = results
      .map(result => parseFloat(result.score))
      .filter(score => !isNaN(score) && isFinite(score));
    
    if (validScores.length === 0) {
      return 0;
    }
    
    const total = validScores.reduce((sum, score) => sum + score, 0);
    return Math.round(total / validScores.length);
  }

  async getAllSignalsQuizResults(): Promise<SignalsQuizResult[]> {
    return await db.select().from(signalsQuizResults);
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const [purchase] = await db.insert(purchases).values(insertPurchase).returning();
    console.log(`✓ Purchase created: ${insertPurchase.customerEmail} → ${insertPurchase.packageName} (€${insertPurchase.amount})`);
    return purchase;
  }

  async getPurchaseByPaymentIntent(paymentIntentId: string): Promise<Purchase | undefined> {
    const [purchase] = await db.select().from(purchases)
      .where(eq(purchases.stripePaymentIntentId, paymentIntentId))
      .limit(1);
    return purchase;
  }

  async getAllPurchases(): Promise<Purchase[]> {
    return await db.select().from(purchases);
  }

  // Contact message methods
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db.insert(contactMessages).values(insertMessage).returning();
    console.log(`✓ Contact message created: ${insertMessage.name} (${insertMessage.email})`);
    return message;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages);
  }

  // Satellite Scan purchase methods
  async createSatellitescanPurchase(insertPurchase: InsertSatellitescanPurchase): Promise<SatellitescanPurchase> {
    const [purchase] = await db.insert(satellitescanPurchases).values(insertPurchase).returning();
    console.log(`✓ Satellitescan purchase created: ${insertPurchase.customerEmail} (€${insertPurchase.amount})`);
    return purchase;
  }

  async getSatellitescanPurchaseByPaymentIntent(paymentIntentId: string): Promise<SatellitescanPurchase | undefined> {
    const [purchase] = await db.select().from(satellitescanPurchases)
      .where(eq(satellitescanPurchases.stripePaymentIntentId, paymentIntentId))
      .limit(1);
    return purchase;
  }

  async getAllSatellitescanPurchases(): Promise<SatellitescanPurchase[]> {
    return await db.select().from(satellitescanPurchases);
  }

  async getOverdueSatellitescanPurchases(hoursThreshold: number): Promise<SatellitescanPurchase[]> {
    const thresholdDate = new Date(Date.now() - hoursThreshold * 60 * 60 * 1000);
    
    return await db.select().from(satellitescanPurchases).where(
      and(
        eq(satellitescanPurchases.typeformCompleted, "false"),
        eq(satellitescanPurchases.remindersCount, "0"),
        lt(satellitescanPurchases.createdAt, thresholdDate)
      )
    );
  }

  async updateSatellitescanReminderCount(purchaseId: string, count: number): Promise<void> {
    await db.update(satellitescanPurchases)
      .set({ remindersCount: count.toString() })
      .where(eq(satellitescanPurchases.id, purchaseId));
  }

  async markTypeformCompletedByEmail(email: string): Promise<number> {
    const normalizedEmail = email.toLowerCase().trim();
    const result = await db.update(satellitescanPurchases)
      .set({ 
        typeformCompleted: "true",
        typeformCompletedAt: new Date() // Track actual completion time for Fibonacci email scheduling
      })
      .where(
        and(
          sql`LOWER(${satellitescanPurchases.customerEmail}) = ${normalizedEmail}`,
          eq(satellitescanPurchases.typeformCompleted, "false")
        )
      )
      .returning();
    return result.length;
  }

  async updateSatellitescanRole(email: string, role: string): Promise<void> {
    const normalizedEmail = email.toLowerCase().trim();
    await db.update(satellitescanPurchases)
      .set({ role })
      .where(sql`LOWER(${satellitescanPurchases.customerEmail}) = ${normalizedEmail}`);
  }

  // Coupon methods
  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const [coupon] = await db.select().from(coupons)
      .where(eq(coupons.code, code.toUpperCase()))
      .limit(1);
    return coupon;
  }

  async createCoupon(insertCoupon: InsertCoupon): Promise<Coupon> {
    const [coupon] = await db.insert(coupons).values({
      code: insertCoupon.code.toUpperCase(),
      discountAmount: insertCoupon.discountAmount,
      category: insertCoupon.category,
      isActive: insertCoupon.isActive || "true",
      maxUses: insertCoupon.maxUses || null,
      usedCount: "0",
    }).returning();
    console.log(`✓ Coupon created: ${coupon.code} (${coupon.category})`);
    return coupon;
  }

  async getAllCoupons(): Promise<Coupon[]> {
    return await db.select().from(coupons);
  }

  async updateCoupon(code: string, updates: Partial<InsertCoupon>): Promise<Coupon | undefined> {
    const [coupon] = await db.update(coupons)
      .set(updates)
      .where(eq(coupons.code, code.toUpperCase()))
      .returning();
    return coupon;
  }

  async deleteCoupon(code: string): Promise<void> {
    await db.delete(coupons).where(eq(coupons.code, code.toUpperCase()));
  }

  async incrementCouponUsage(couponId: string): Promise<void> {
    const coupon = await db.select().from(coupons).where(eq(coupons.id, couponId)).limit(1);
    if (coupon.length > 0) {
      const newCount = (parseInt(coupon[0].usedCount) + 1).toString();
      await db.update(coupons).set({ usedCount: newCount }).where(eq(coupons.id, couponId));
    }
  }
  
  // Prompt methods
  async createPrompt(insertPrompt: InsertPrompt): Promise<Prompt> {
    const [prompt] = await db.insert(prompts).values({
      lensType: insertPrompt.lensType,
      title: insertPrompt.title,
      description: insertPrompt.description,
      whatItDoes: insertPrompt.whatItDoes,
      perfectFor: insertPrompt.perfectFor,
      promptContent: insertPrompt.promptContent,
      roleCategory: insertPrompt.roleCategory,
      isActive: insertPrompt.isActive || "true",
      votes: "0",
    }).returning();
    console.log(`✓ Prompt created: ${prompt.title} (${prompt.lensType})`);
    return prompt;
  }
  
  async getPromptById(id: string): Promise<Prompt | undefined> {
    const [prompt] = await db.select().from(prompts).where(eq(prompts.id, id)).limit(1);
    return prompt;
  }
  
  async getAllPrompts(): Promise<Prompt[]> {
    return await db.select().from(prompts);
  }
  
  async getActivePrompts(): Promise<Prompt[]> {
    return await db.select().from(prompts).where(eq(prompts.isActive, "true"));
  }
  
  async getPromptsByLens(lensType: string): Promise<Prompt[]> {
    return await db.select().from(prompts)
      .where(and(eq(prompts.lensType, lensType), eq(prompts.isActive, "true")));
  }
  
  async getPromptsByRole(roleCategory: string): Promise<Prompt[]> {
    return await db.select().from(prompts)
      .where(and(eq(prompts.roleCategory, roleCategory), eq(prompts.isActive, "true")));
  }
  
  async updatePrompt(id: string, updateData: Partial<InsertPrompt>): Promise<Prompt | undefined> {
    const [prompt] = await db.update(prompts)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(prompts.id, id))
      .returning();
    if (prompt) {
      console.log(`✓ Prompt updated: ${prompt.title}`);
    }
    return prompt;
  }
  
  async deletePrompt(id: string): Promise<boolean> {
    const result = await db.delete(prompts).where(eq(prompts.id, id)).returning();
    if (result.length > 0) {
      console.log(`✓ Prompt deleted: ${result[0].title}`);
      return true;
    }
    return false;
  }
  
  async upvotePrompt(id: string): Promise<Prompt | undefined> {
    const [existing] = await db.select().from(prompts).where(eq(prompts.id, id)).limit(1);
    if (!existing) return undefined;
    
    const newVotes = (parseInt(existing.votes) + 1).toString();
    const [prompt] = await db.update(prompts)
      .set({ votes: newVotes })
      .where(eq(prompts.id, id))
      .returning();
    return prompt;
  }
  
  // Email verification methods
  async createEmailVerification(email: string, code: string): Promise<EmailVerification> {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const [verification] = await db.insert(emailVerifications).values({
      email,
      code,
      expiresAt,
    }).returning();
    console.log(`✓ Email verification created for: ${email}`);
    return verification;
  }
  
  async getEmailVerification(email: string, code: string): Promise<EmailVerification | undefined> {
    const [verification] = await db.select()
      .from(emailVerifications)
      .where(and(
        eq(emailVerifications.email, email),
        eq(emailVerifications.code, code),
        eq(emailVerifications.verified, "false")
      ))
      .limit(1);
    
    if (verification && new Date(verification.expiresAt) > new Date()) {
      return verification;
    }
    return undefined;
  }
  
  async markEmailVerified(email: string): Promise<void> {
    await db.update(emailVerifications)
      .set({ verified: "true" })
      .where(eq(emailVerifications.email, email));
    console.log(`✓ Email verified: ${email}`);
  }
  
  async cleanupExpiredVerifications(): Promise<void> {
    await db.delete(emailVerifications)
      .where(lt(emailVerifications.expiresAt, new Date()));
  }
  
  // Onboarding email template methods
  async createOnboardingEmailTemplate(template: InsertOnboardingEmailTemplate): Promise<OnboardingEmailTemplate> {
    const [result] = await db.insert(onboardingEmailTemplates).values(template).returning();
    console.log(`✓ Onboarding email template created: ${template.title}`);
    return result;
  }
  
  async getOnboardingEmailTemplateById(id: string): Promise<OnboardingEmailTemplate | undefined> {
    const [template] = await db.select().from(onboardingEmailTemplates).where(eq(onboardingEmailTemplates.id, id)).limit(1);
    return template;
  }
  
  async getOnboardingEmailTemplateBySequence(sequenceNumber: string): Promise<OnboardingEmailTemplate | undefined> {
    const [template] = await db.select().from(onboardingEmailTemplates)
      .where(eq(onboardingEmailTemplates.sequenceNumber, sequenceNumber)).limit(1);
    return template;
  }
  
  async getAllOnboardingEmailTemplates(): Promise<OnboardingEmailTemplate[]> {
    return await db.select().from(onboardingEmailTemplates);
  }
  
  async getActiveOnboardingEmailTemplates(): Promise<OnboardingEmailTemplate[]> {
    return await db.select().from(onboardingEmailTemplates)
      .where(eq(onboardingEmailTemplates.isActive, "true"));
  }
  
  async getOnboardingEmailTemplatesByTrigger(triggerEvent: string): Promise<OnboardingEmailTemplate[]> {
    return await db.select().from(onboardingEmailTemplates)
      .where(and(eq(onboardingEmailTemplates.triggerEvent, triggerEvent), eq(onboardingEmailTemplates.isActive, "true")));
  }
  
  async updateOnboardingEmailTemplate(id: string, updateData: Partial<InsertOnboardingEmailTemplate>): Promise<OnboardingEmailTemplate | undefined> {
    const [template] = await db.update(onboardingEmailTemplates)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(onboardingEmailTemplates.id, id))
      .returning();
    if (template) {
      console.log(`✓ Onboarding email template updated: ${template.title}`);
    }
    return template;
  }
  
  async deleteOnboardingEmailTemplate(id: string): Promise<boolean> {
    const result = await db.delete(onboardingEmailTemplates).where(eq(onboardingEmailTemplates.id, id)).returning();
    if (result.length > 0) {
      console.log(`✓ Onboarding email template deleted: ${result[0].title}`);
      return true;
    }
    return false;
  }
  
  // Onboarding email log methods
  async createOnboardingEmailLog(log: InsertOnboardingEmailLog): Promise<OnboardingEmailLog> {
    const [result] = await db.insert(onboardingEmailLogs).values(log).returning();
    console.log(`✓ Onboarding email log created: ${log.customerEmail} - sequence ${log.sequenceNumber}`);
    return result;
  }
  
  async getOnboardingEmailLogsByCustomer(customerEmail: string): Promise<OnboardingEmailLog[]> {
    return await db.select().from(onboardingEmailLogs)
      .where(eq(onboardingEmailLogs.customerEmail, customerEmail));
  }
  
  async getLastSentEmailForCustomer(customerEmail: string): Promise<OnboardingEmailLog | undefined> {
    const logs = await db.select().from(onboardingEmailLogs)
      .where(and(
        eq(onboardingEmailLogs.customerEmail, customerEmail),
        eq(onboardingEmailLogs.status, "sent")
      ));
    
    if (logs.length === 0) return undefined;
    
    // Find the one with highest sequence number
    return logs.reduce((max, log) => 
      parseInt(log.sequenceNumber) > parseInt(max.sequenceNumber) ? log : max
    );
  }
  
  async hasEmailBeenSent(customerEmail: string, sequenceNumber: string): Promise<boolean> {
    const [log] = await db.select().from(onboardingEmailLogs)
      .where(and(
        eq(onboardingEmailLogs.customerEmail, customerEmail),
        eq(onboardingEmailLogs.sequenceNumber, sequenceNumber),
        eq(onboardingEmailLogs.status, "sent")
      ))
      .limit(1);
    return !!log;
  }
  
  async getCustomersDueForEmail(triggerEvent: string, sequenceNumber: string): Promise<string[]> {
    // This will be used by the scheduler to find customers who need emails
    // For now, return empty array - the scheduler will handle the logic
    return [];
  }

  // Batch email methods
  async getContactsWithFilters(includeChannels?: string[], excludeChannels?: string[]): Promise<Contact[]> {
    let allContacts = await db.select().from(contacts);
    
    if (includeChannels && includeChannels.length > 0) {
      allContacts = allContacts.filter(c => 
        c.channelsReached && includeChannels.some(ch => c.channelsReached!.includes(ch))
      );
    }
    
    if (excludeChannels && excludeChannels.length > 0) {
      allContacts = allContacts.filter(c => 
        !c.channelsReached || !excludeChannels.some(ch => c.channelsReached!.includes(ch))
      );
    }
    
    return allContacts;
  }

  async createBatchEmailSend(data: { subject: string; body: string; filterCriteria: object; recipientCount: string }): Promise<BatchEmailSend> {
    const [result] = await db.insert(batchEmailSends).values(data).returning();
    console.log(`✓ Batch email send created: "${data.subject}" to ${data.recipientCount} recipients`);
    return result;
  }

  async updateBatchEmailSend(id: string, data: Partial<{ successCount: string; failedCount: string; status: string; sentAt: Date }>): Promise<BatchEmailSend | undefined> {
    const [result] = await db.update(batchEmailSends)
      .set(data)
      .where(eq(batchEmailSends.id, id))
      .returning();
    return result;
  }

  async getAllBatchEmailSends(): Promise<BatchEmailSend[]> {
    return await db.select().from(batchEmailSends);
  }

  async getBatchEmailSendById(id: string): Promise<BatchEmailSend | undefined> {
    const [result] = await db.select().from(batchEmailSends).where(eq(batchEmailSends.id, id)).limit(1);
    return result;
  }

  async createBatchEmailRecipient(data: { batchId: string; contactId: string; email: string; status?: string }): Promise<BatchEmailRecipient> {
    const [result] = await db.insert(batchEmailRecipients).values(data).returning();
    return result;
  }

  async updateBatchEmailRecipient(id: string, data: Partial<{ status: string; errorMessage?: string; sentAt?: Date }>): Promise<BatchEmailRecipient | undefined> {
    const [result] = await db.update(batchEmailRecipients)
      .set(data)
      .where(eq(batchEmailRecipients.id, id))
      .returning();
    return result;
  }

  async getBatchEmailRecipientsByBatchId(batchId: string): Promise<BatchEmailRecipient[]> {
    return await db.select().from(batchEmailRecipients)
      .where(eq(batchEmailRecipients.batchId, batchId));
  }

  // Newsletter campaign methods
  async createNewsletterCampaign(data: InsertNewsletterCampaign): Promise<NewsletterCampaign> {
    const [result] = await db.insert(newsletterCampaigns).values(data).returning();
    console.log(`✓ Newsletter campaign created: "${data.name}"`);
    return result;
  }

  async getNewsletterCampaignById(id: string): Promise<NewsletterCampaign | undefined> {
    const [result] = await db.select().from(newsletterCampaigns).where(eq(newsletterCampaigns.id, id)).limit(1);
    return result;
  }

  async getAllNewsletterCampaigns(): Promise<NewsletterCampaign[]> {
    return await db.select().from(newsletterCampaigns);
  }

  async updateNewsletterCampaign(id: string, data: Partial<InsertNewsletterCampaign & { sentAt?: Date }>): Promise<NewsletterCampaign | undefined> {
    const [result] = await db.update(newsletterCampaigns)
      .set(data)
      .where(eq(newsletterCampaigns.id, id))
      .returning();
    return result;
  }

  async deleteNewsletterCampaign(id: string): Promise<boolean> {
    const result = await db.delete(newsletterCampaigns).where(eq(newsletterCampaigns.id, id));
    return true;
  }

  // Newsletter recipient methods
  async createNewsletterRecipient(data: InsertNewsletterRecipient): Promise<NewsletterRecipient> {
    const [result] = await db.insert(newsletterRecipients).values(data).returning();
    return result;
  }

  async getNewsletterRecipientsByCampaign(campaignId: string): Promise<NewsletterRecipient[]> {
    return await db.select().from(newsletterRecipients)
      .where(eq(newsletterRecipients.campaignId, campaignId));
  }

  async updateNewsletterRecipient(id: string, data: Partial<{ status: string; excluded: string; openedAt?: Date; openCount: string; notionSynced: string; errorMessage?: string; sentAt?: Date }>): Promise<NewsletterRecipient | undefined> {
    const [result] = await db.update(newsletterRecipients)
      .set(data)
      .where(eq(newsletterRecipients.id, id))
      .returning();
    return result;
  }

  async getNewsletterRecipientByTracking(campaignId: string, contactId: string): Promise<NewsletterRecipient | undefined> {
    const [result] = await db.select().from(newsletterRecipients)
      .where(and(
        eq(newsletterRecipients.campaignId, campaignId),
        eq(newsletterRecipients.contactId, contactId)
      ))
      .limit(1);
    return result;
  }

  async recordNewsletterOpen(campaignId: string, contactId: string): Promise<NewsletterRecipient | undefined> {
    const existing = await this.getNewsletterRecipientByTracking(campaignId, contactId);
    if (!existing) return undefined;
    
    const currentCount = parseInt(existing.openCount) || 0;
    const [result] = await db.update(newsletterRecipients)
      .set({
        openedAt: existing.openedAt || new Date(),
        openCount: String(currentCount + 1)
      })
      .where(eq(newsletterRecipients.id, existing.id))
      .returning();
    
    console.log(`📧 Newsletter opened: campaign=${campaignId}, contact=${contactId}, count=${currentCount + 1}`);
    return result;
  }

  async getUnsyncedNewsletterRecipients(): Promise<NewsletterRecipient[]> {
    return await db.select().from(newsletterRecipients)
      .where(and(
        eq(newsletterRecipients.status, "sent"),
        eq(newsletterRecipients.notionSynced, "false")
      ));
  }

  async getWebinarSettings(): Promise<WebinarSettings | undefined> {
    const [result] = await db.select().from(webinarSettings).limit(1);
    return result;
  }

  async upsertWebinarSettings(settings: InsertWebinarSettings): Promise<WebinarSettings> {
    const existing = await this.getWebinarSettings();
    const deadline = typeof settings.countdownDeadline === 'string' 
      ? new Date(settings.countdownDeadline) 
      : settings.countdownDeadline;
    
    if (existing) {
      const [result] = await db.update(webinarSettings)
        .set({
          countdownDeadline: deadline,
          hostNames: settings.hostNames,
          bonusDescription: settings.bonusDescription,
          sessionTitle: settings.sessionTitle,
          sessionSubtitle: settings.sessionSubtitle,
          sessionDuration: settings.sessionDuration,
          ctaButtonText: settings.ctaButtonText ?? null,
          ctaButtonTextExpired: settings.ctaButtonTextExpired ?? null,
          updatedAt: new Date(),
        })
        .where(eq(webinarSettings.id, existing.id))
        .returning();
      return result;
    } else {
      const [result] = await db.insert(webinarSettings)
        .values({
          countdownDeadline: deadline,
          hostNames: settings.hostNames,
          bonusDescription: settings.bonusDescription,
          sessionTitle: settings.sessionTitle,
          sessionSubtitle: settings.sessionSubtitle,
          sessionDuration: settings.sessionDuration,
          ctaButtonText: settings.ctaButtonText ?? null,
          ctaButtonTextExpired: settings.ctaButtonTextExpired ?? null,
        })
        .returning();
      return result;
    }
  }

  async getAllWebinarSessions(): Promise<WebinarSession[]> {
    return await db.select().from(webinarSessions).orderBy(webinarSessions.sortOrder, webinarSessions.createdAt);
  }
  async createWebinarSession(session: InsertWebinarSession): Promise<WebinarSession> {
    const [record] = await db.insert(webinarSessions).values(session).returning();
    return record;
  }
  async updateWebinarSession(id: string, session: Partial<InsertWebinarSession>): Promise<WebinarSession | undefined> {
    const [record] = await db.update(webinarSessions).set(session).where(eq(webinarSessions.id, id)).returning();
    return record;
  }
  async deleteWebinarSession(id: string): Promise<boolean> {
    const result = await db.delete(webinarSessions).where(eq(webinarSessions.id, id)).returning();
    return result.length > 0;
  }

  async getAllCalendarEvents(): Promise<CalendarEvent[]> {
    return await db.select().from(calendarEvents).orderBy(calendarEvents.sortOrder, calendarEvents.createdAt);
  }
  async createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent> {
    const [record] = await db.insert(calendarEvents).values(event).returning();
    return record;
  }
  async updateCalendarEvent(id: string, event: Partial<InsertCalendarEvent>): Promise<CalendarEvent | undefined> {
    const [record] = await db.update(calendarEvents).set(event).where(eq(calendarEvents.id, id)).returning();
    return record;
  }
  async deleteCalendarEvent(id: string): Promise<boolean> {
    const result = await db.delete(calendarEvents).where(eq(calendarEvents.id, id)).returning();
    return result.length > 0;
  }

  async createFlowCheckResult(result: InsertFlowCheckResult): Promise<FlowCheckResult> {
    const [record] = await db.insert(flowCheckResults)
      .values({
        contactId: result.contactId ?? null,
        situation: result.situation,
        customSituation: result.customSituation ?? null,
        role: result.role,
        motivation: result.motivation,
        challenge: result.challenge,
        competence: result.competence,
        zone: result.zone,
      })
      .returning();
    return record;
  }

  async getAllFlowCheckResults(): Promise<FlowCheckResult[]> {
    return await db.select().from(flowCheckResults).orderBy(flowCheckResults.createdAt);
  }
}

// Use PostgreSQL storage (persistent) instead of MemStorage
export const storage = new DatabaseStorage();
