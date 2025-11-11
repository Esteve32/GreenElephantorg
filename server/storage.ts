import { type User, type InsertUser, type RecommendationSubmission, type InsertRecommendationSubmission } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createRecommendationSubmission(submission: InsertRecommendationSubmission): Promise<RecommendationSubmission>;
  getAllRecommendationSubmissions(): Promise<RecommendationSubmission[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private recommendationSubmissions: Map<string, RecommendationSubmission>;

  constructor() {
    this.users = new Map();
    this.recommendationSubmissions = new Map();
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
}

export const storage = new MemStorage();
