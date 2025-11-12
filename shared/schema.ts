import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const recommendationSubmissions = pgTable("recommendation_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  preferredContactTime: text("preferred_contact_time"),
  recommendedPath: text("recommended_path").notNull(),
  answers: jsonb("answers").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRecommendationSubmissionSchema = createInsertSchema(recommendationSubmissions).pick({
  name: true,
  email: true,
  phone: true,
  preferredContactTime: true,
  recommendedPath: true,
  answers: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Please enter your full name"),
  phone: z.string().optional(),
  preferredContactTime: z.string().optional(),
});

export type InsertRecommendationSubmission = z.infer<typeof insertRecommendationSubmissionSchema>;
export type RecommendationSubmission = typeof recommendationSubmissions.$inferSelect;

// Central contacts table with GDPR consent tracking
export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),
  consentGiven: text("consent_given").notNull(), // Boolean stored as text "true" or "false"
  consentText: text("consent_text").notNull(), // Legal copy they agreed to
  consentedAt: timestamp("consented_at").defaultNow().notNull(),
  source: text("source").notNull(), // "waitlist", "newsletter", "recommendation", "quiz"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  email: true,
  name: true,
  consentGiven: true,
  consentText: true,
  source: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2).optional(),
  consentGiven: z.string(),
  consentText: z.string(),
  source: z.enum(["waitlist", "newsletter", "recommendation", "quiz"]),
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

// Retreat waitlist entries
export const waitlistEntries = pgTable("waitlist_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contactId: varchar("contact_id").notNull(),
  motivation: text("motivation").notNull(),
  retreatType: text("retreat_type"), // "provence" or "lapland"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWaitlistEntrySchema = createInsertSchema(waitlistEntries).pick({
  contactId: true,
  motivation: true,
  retreatType: true,
}).extend({
  motivation: z.string().min(10, "Please share a bit more about your motivation (at least 10 characters)"),
  retreatType: z.enum(["provence", "lapland"]).optional(),
});

export type InsertWaitlistEntry = z.infer<typeof insertWaitlistEntrySchema>;
export type WaitlistEntry = typeof waitlistEntries.$inferSelect;

// Newsletter subscriptions
export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contactId: varchar("contact_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).pick({
  contactId: true,
});

export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;

// Signals quiz results with aggregate tracking
export const signalsQuizResults = pgTable("signals_quiz_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contactId: varchar("contact_id"),
  score: text("score").notNull(), // Stored as text, convert to number
  answers: jsonb("answers").notNull(), // Raw quiz responses
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSignalsQuizResultSchema = createInsertSchema(signalsQuizResults).pick({
  contactId: true,
  score: true,
  answers: true,
}).extend({
  contactId: z.string().nullish(), // Allow string, null, or undefined
  score: z.coerce.number().min(0, "Score must be at least 0").max(100, "Score cannot exceed 100"),
  answers: z.record(z.any()),
});

export type InsertSignalsQuizResult = z.infer<typeof insertSignalsQuizResultSchema>;
export type SignalsQuizResult = typeof signalsQuizResults.$inferSelect;
