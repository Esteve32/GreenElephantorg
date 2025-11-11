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
  type InsertSignalsQuizResult
} from "@shared/schema";
import { randomUUID } from "crypto";

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private recommendationSubmissions: Map<string, RecommendationSubmission>;
  private contacts: Map<string, Contact>;
  private waitlistEntries: Map<string, WaitlistEntry>;
  private newsletterSubscriptions: Map<string, NewsletterSubscription>;
  private signalsQuizResults: Map<string, SignalsQuizResult>;

  constructor() {
    this.users = new Map();
    this.recommendationSubmissions = new Map();
    this.contacts = new Map();
    this.waitlistEntries = new Map();
    this.newsletterSubscriptions = new Map();
    this.signalsQuizResults = new Map();
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
}

export const storage = new MemStorage();
