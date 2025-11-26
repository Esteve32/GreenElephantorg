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
  notionPageId: text("notion_page_id"), // Notion CRM sync tracking
  notionSyncedAt: timestamp("notion_synced_at"), // Last sync timestamp
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

// Coaching package purchases
export const purchases = pgTable("purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name"),
  packageId: text("package_id").notNull(), // foundation, transformation, team
  packageName: text("package_name").notNull(),
  amount: text("amount").notNull(), // Price in EUR (stored as text, e.g., "795")
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull().unique(),
  status: text("status").notNull(), // succeeded, pending, failed
  calendlyBooked: text("calendly_booked").default("false").notNull(), // Track if they've booked
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPurchaseSchema = createInsertSchema(purchases).pick({
  customerEmail: true,
  customerName: true,
  packageId: true,
  packageName: true,
  amount: true,
  stripePaymentIntentId: true,
  status: true,
}).extend({
  customerEmail: z.string().email("Please enter a valid email address"),
  customerName: z.string().optional(),
  packageId: z.string(),
  packageName: z.string(),
  amount: z.string(),
  stripePaymentIntentId: z.string(),
  status: z.enum(["succeeded", "pending", "failed"]),
});

export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = typeof purchases.$inferSelect;

// Contact form messages (general inquiries)
export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  intent: text("intent"), // "retreats", "coaching", "research", or null
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  message: true,
  intent: true,
}).extend({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Please share a bit more detail (at least 10 characters)"),
  intent: z.enum(["retreats", "coaching", "research", "general"]).default("general"), // Default to "general" if not selected
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

// Satellite Scan purchases (beta product)
export const satellitescanPurchases = pgTable("satellitescan_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name"),
  amount: text("amount").notNull(), // Price in EUR (stored as text, e.g., "29.99")
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull().unique(),
  status: text("status").notNull(), // "succeeded", "pending", "failed"
  typeformCompleted: text("typeform_completed").default("false").notNull(), // Track if they completed Typeform
  dashboardSent: text("dashboard_sent").default("false").notNull(), // Track if dashboard sent
  remindersCount: text("reminders_count").default("0").notNull(), // Track how many reminders sent
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSatellitescanPurchaseSchema = createInsertSchema(satellitescanPurchases).pick({
  customerEmail: true,
  customerName: true,
  amount: true,
  stripePaymentIntentId: true,
  status: true,
}).extend({
  customerEmail: z.string().email("Please enter a valid email address"),
  customerName: z.string().optional(),
  amount: z.string(),
  stripePaymentIntentId: z.string(),
  status: z.enum(["succeeded", "pending", "failed"]),
});

export type InsertSatellitescanPurchase = z.infer<typeof insertSatellitescanPurchaseSchema>;
export type SatellitescanPurchase = typeof satellitescanPurchases.$inferSelect;

// Coupons for free/discounted scans
export const coupons = pgTable("coupons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(), // e.g., "STUDENT50", "STARTUP100"
  discountAmount: text("discount_amount").notNull(), // Amount in EUR as text (e.g., "29.99" for free, "14.99" for 50% off)
  category: text("category").notNull(), // "student", "startup", "social_enterprise", "unemployed"
  isActive: text("is_active").default("true").notNull(), // "true" or "false"
  maxUses: text("max_uses"), // null for unlimited, or number as text
  usedCount: text("used_count").default("0").notNull(), // How many times coupon has been used
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCouponSchema = createInsertSchema(coupons).pick({
  code: true,
  discountAmount: true,
  category: true,
  isActive: true,
  maxUses: true,
}).extend({
  code: z.string().min(3).toUpperCase(),
  discountAmount: z.string(),
  category: z.enum(["student", "startup", "social_enterprise", "unemployed"]),
  isActive: z.string().default("true"),
  maxUses: z.string().optional(),
});

export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type Coupon = typeof coupons.$inferSelect;
