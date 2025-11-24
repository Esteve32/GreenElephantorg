import { 
  type User, 
  type InsertUser, 
  type RecommendationSubmission, 
  type InsertRecommendationSubmission,
  type Contact,
  type InsertContact,
  type WaitlistEntry,
  type InsertWaitlistEntry,
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
  users,
  recommendationSubmissions,
  contacts,
  waitlistEntries,
  newsletterSubscriptions,
  signalsQuizResults,
  purchases,
  contactMessages,
  satellitescanPurchases
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, avg } from "drizzle-orm";

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
  
  // Waitlist entries
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  getAllWaitlistEntries(): Promise<WaitlistEntry[]>;
  
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
    const contact: Contact = {
      ...insertContact,
      id,
      name: insertContact.name || null,
      consentedAt: new Date(),
      createdAt: new Date(),
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
      typeformCompleted: "false",
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

  async createWaitlistEntry(insertEntry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const [entry] = await db.insert(waitlistEntries).values(insertEntry).returning();
    console.log(`✓ Waitlist entry created: ${insertEntry.contactId}`);
    return entry;
  }

  async getAllWaitlistEntries(): Promise<WaitlistEntry[]> {
    return await db.select().from(waitlistEntries);
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
}

// Use PostgreSQL storage (persistent) instead of MemStorage
export const storage = new DatabaseStorage();
