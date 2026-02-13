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
  channelsReached: text("channels_reached").array(), // Multi-select tags: newsletter, purchase, quiz, webinar, recommendation, contact
  createdAt: timestamp("created_at").defaultNow().notNull(),
  notionPageId: text("notion_page_id"), // Notion CRM sync tracking
  notionSyncedAt: timestamp("notion_synced_at"), // Last sync timestamp
  scanSubmittedAt: timestamp("scan_submitted_at"), // When Typeform Satellite Scan was submitted
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  email: true,
  name: true,
  consentGiven: true,
  consentText: true,
  source: true,
  channelsReached: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2).optional(),
  consentGiven: z.string(),
  consentText: z.string(),
  source: z.enum(["waitlist", "newsletter", "recommendation", "quiz", "webinar"]),
  channelsReached: z.array(z.string()).optional(),
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

// Webinar/Play Labs waitlist entries (Calendar page)
export const webinarWaitlistEntries = pgTable("webinar_waitlist_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contactId: varchar("contact_id").notNull(),
  preferredLens: text("preferred_lens"), // influence, attitude, chaordic, flow, alignment, needs, ego, dynamics
  interests: text("interests"), // Optional text about what they want to learn
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWebinarWaitlistEntrySchema = createInsertSchema(webinarWaitlistEntries).pick({
  contactId: true,
  preferredLens: true,
  interests: true,
}).extend({
  preferredLens: z.enum(["influence", "attitude", "chaordic", "flow", "alignment", "needs", "ego", "dynamics"]).optional(),
  interests: z.string().optional(),
});

export type InsertWebinarWaitlistEntry = z.infer<typeof insertWebinarWaitlistEntrySchema>;
export type WebinarWaitlistEntry = typeof webinarWaitlistEntries.$inferSelect;

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
  typeformCompletedAt: timestamp("typeform_completed_at"), // When the Typeform scan was actually completed
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

// Prompt library for Satellite Scan resources
export const prompts = pgTable("prompts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lensType: text("lens_type").notNull(), // "influence", "attitude", "chaordic", "flow", "alignment", "needs", "ego", "dynamics", "quickwins"
  title: text("title").notNull(),
  description: text("description").notNull(),
  whatItDoes: text("what_it_does").array().notNull(), // Array of strings describing what the prompt does
  perfectFor: text("perfect_for").notNull(),
  promptContent: text("prompt_content").notNull(), // The actual prompt template text
  roleCategory: text("role_category").notNull(), // "EA", "ACX", "TealLeaders", or "all"
  votes: text("votes").default("0").notNull(),
  isActive: text("is_active").default("true").notNull(), // "true" or "false"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPromptSchema = createInsertSchema(prompts).pick({
  lensType: true,
  title: true,
  description: true,
  whatItDoes: true,
  perfectFor: true,
  promptContent: true,
  roleCategory: true,
  isActive: true,
}).extend({
  lensType: z.enum(["influence", "attitude", "chaordic", "flow", "alignment", "needs", "ego", "dynamics", "quickwins"]),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  whatItDoes: z.array(z.string()).min(1, "At least one item required"),
  perfectFor: z.string().min(10, "Perfect for must be at least 10 characters"),
  promptContent: z.string().min(50, "Prompt content must be at least 50 characters"),
  roleCategory: z.enum(["EA", "ACX", "TealLeaders", "all"]),
  isActive: z.string().default("true"),
});

export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type Prompt = typeof prompts.$inferSelect;

// Onboarding email templates for Fibonacci-timed automation
export const onboardingEmailTemplates = pgTable("onboarding_email_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sequenceNumber: text("sequence_number").notNull(), // 0-9 for the Fibonacci sequence
  title: text("title").notNull(), // Internal title for admin reference
  subject: text("subject").notNull(), // Email subject line
  body: text("body").notNull(), // HTML email body content
  delayMinutes: text("delay_minutes").notNull(), // Delay in minutes from trigger event
  triggerEvent: text("trigger_event").notNull(), // "purchase" or "scan_completed"
  isActive: text("is_active").default("true").notNull(), // "true" or "false"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertOnboardingEmailTemplateSchema = createInsertSchema(onboardingEmailTemplates).pick({
  sequenceNumber: true,
  title: true,
  subject: true,
  body: true,
  delayMinutes: true,
  triggerEvent: true,
  isActive: true,
}).extend({
  sequenceNumber: z.string(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  body: z.string().min(10, "Body must be at least 10 characters"),
  delayMinutes: z.string(),
  triggerEvent: z.enum(["purchase", "scan_completed"]),
  isActive: z.string().default("true"),
});

export type InsertOnboardingEmailTemplate = z.infer<typeof insertOnboardingEmailTemplateSchema>;
export type OnboardingEmailTemplate = typeof onboardingEmailTemplates.$inferSelect;

// Onboarding email delivery logs to track what's been sent
export const onboardingEmailLogs = pgTable("onboarding_email_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerEmail: text("customer_email").notNull(),
  templateId: varchar("template_id").notNull(), // References onboardingEmailTemplates.id
  sequenceNumber: text("sequence_number").notNull(), // For quick lookup without joins
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  status: text("status").notNull(), // "sent", "failed", "skipped"
  errorMessage: text("error_message"), // If failed, why
});

export const insertOnboardingEmailLogSchema = createInsertSchema(onboardingEmailLogs).pick({
  customerEmail: true,
  templateId: true,
  sequenceNumber: true,
  status: true,
  errorMessage: true,
}).extend({
  customerEmail: z.string().email(),
  templateId: z.string(),
  sequenceNumber: z.string(),
  status: z.enum(["sent", "failed", "skipped"]),
  errorMessage: z.string().optional(),
});

export type InsertOnboardingEmailLog = z.infer<typeof insertOnboardingEmailLogSchema>;
export type OnboardingEmailLog = typeof onboardingEmailLogs.$inferSelect;

// Email verification tokens for checkout
export const emailVerifications = pgTable("email_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  code: text("code").notNull(), // 6-digit verification code
  verified: text("verified").default("false").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEmailVerificationSchema = createInsertSchema(emailVerifications).pick({
  email: true,
  code: true,
  expiresAt: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  code: z.string().length(6),
});

export type InsertEmailVerification = z.infer<typeof insertEmailVerificationSchema>;
export type EmailVerification = typeof emailVerifications.$inferSelect;

// Batch email campaigns - for admin to send emails to filtered contacts
export const batchEmailSends = pgTable("batch_email_sends", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  filterCriteria: jsonb("filter_criteria").notNull(), // Store channel filters as JSON
  recipientCount: text("recipient_count").notNull(), // Number of recipients attempted
  successCount: text("success_count").default("0").notNull(), // Number successfully sent
  failedCount: text("failed_count").default("0").notNull(), // Number failed
  status: text("status").default("pending").notNull(), // "pending", "sending", "completed", "failed"
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBatchEmailSendSchema = createInsertSchema(batchEmailSends).pick({
  subject: true,
  body: true,
  filterCriteria: true,
  recipientCount: true,
}).extend({
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  body: z.string().min(10, "Body must be at least 10 characters"),
  filterCriteria: z.object({
    includeChannels: z.array(z.string()).optional(),
    excludeChannels: z.array(z.string()).optional(),
  }),
  recipientCount: z.string(),
});

export type InsertBatchEmailSend = z.infer<typeof insertBatchEmailSendSchema>;
export type BatchEmailSend = typeof batchEmailSends.$inferSelect;

// Individual recipient tracking for batch emails
export const batchEmailRecipients = pgTable("batch_email_recipients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  batchId: varchar("batch_id").notNull(), // References batchEmailSends.id
  contactId: varchar("contact_id").notNull(), // References contacts.id
  email: text("email").notNull(),
  status: text("status").default("pending").notNull(), // "pending", "sent", "failed"
  errorMessage: text("error_message"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBatchEmailRecipientSchema = createInsertSchema(batchEmailRecipients).pick({
  batchId: true,
  contactId: true,
  email: true,
  status: true,
  errorMessage: true,
}).extend({
  batchId: z.string(),
  contactId: z.string(),
  email: z.string().email(),
  status: z.enum(["pending", "sent", "failed"]).default("pending"),
  errorMessage: z.string().optional(),
});

export type InsertBatchEmailRecipient = z.infer<typeof insertBatchEmailRecipientSchema>;
export type BatchEmailRecipient = typeof batchEmailRecipients.$inferSelect;

// Newsletter campaigns - reusable campaign templates for periodic sends
export const newsletterCampaigns = pgTable("newsletter_campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // Campaign name for identification (e.g., "Q1 2026 Newsletter")
  subject: text("subject").notNull(),
  htmlContent: text("html_content").notNull(), // Full HTML email body
  status: text("status").default("draft").notNull(), // "draft", "ready", "sending", "sent"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  sentAt: timestamp("sent_at"),
});

export const insertNewsletterCampaignSchema = createInsertSchema(newsletterCampaigns).pick({
  name: true,
  subject: true,
  htmlContent: true,
  status: true,
}).extend({
  name: z.string().min(3, "Campaign name must be at least 3 characters"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  htmlContent: z.string().min(10, "Content must be at least 10 characters"),
  status: z.enum(["draft", "ready", "sending", "sent"]).default("draft"),
});

export type InsertNewsletterCampaign = z.infer<typeof insertNewsletterCampaignSchema>;
export type NewsletterCampaign = typeof newsletterCampaigns.$inferSelect;

// Newsletter recipients - tracks delivery and open status per contact per campaign
export const newsletterRecipients = pgTable("newsletter_recipients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id").notNull(), // References newsletterCampaigns.id
  contactId: varchar("contact_id").notNull(), // References contacts.id
  email: text("email").notNull(),
  excluded: text("excluded").default("false").notNull(), // "true" = manually opted out for this campaign
  status: text("status").default("pending").notNull(), // "pending", "sent", "failed"
  openedAt: timestamp("opened_at"), // When email was first opened
  openCount: text("open_count").default("0").notNull(), // How many times opened
  notionSynced: text("notion_synced").default("false").notNull(), // "true" = synced to Notion
  errorMessage: text("error_message"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNewsletterRecipientSchema = createInsertSchema(newsletterRecipients).pick({
  campaignId: true,
  contactId: true,
  email: true,
  excluded: true,
  status: true,
}).extend({
  campaignId: z.string(),
  contactId: z.string(),
  email: z.string().email(),
  excluded: z.enum(["true", "false"]).default("false"),
  status: z.enum(["pending", "sent", "failed"]).default("pending"),
});

export type InsertNewsletterRecipient = z.infer<typeof insertNewsletterRecipientSchema>;
export type NewsletterRecipient = typeof newsletterRecipients.$inferSelect;

export const webinarSettings = pgTable("webinar_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  countdownDeadline: timestamp("countdown_deadline").notNull(),
  hostNames: text("host_names").notNull(),
  bonusDescription: text("bonus_description").notNull(),
  sessionTitle: text("session_title").notNull(),
  sessionSubtitle: text("session_subtitle").notNull(),
  sessionDuration: text("session_duration").notNull(),
  ctaButtonText: text("cta_button_text"),
  ctaButtonTextExpired: text("cta_button_text_expired"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWebinarSettingsSchema = createInsertSchema(webinarSettings).omit({
  id: true,
  updatedAt: true,
}).extend({
  countdownDeadline: z.string().or(z.date()),
  hostNames: z.string().min(1, "Host name is required"),
  bonusDescription: z.string().min(1, "Bonus description is required"),
  sessionTitle: z.string().min(1, "Title is required"),
  sessionSubtitle: z.string().min(1, "Subtitle is required"),
  sessionDuration: z.string().min(1, "Duration is required"),
  ctaButtonText: z.string().optional().nullable(),
  ctaButtonTextExpired: z.string().optional().nullable(),
});

export type InsertWebinarSettings = z.infer<typeof insertWebinarSettingsSchema>;
export type WebinarSettings = typeof webinarSettings.$inferSelect;
