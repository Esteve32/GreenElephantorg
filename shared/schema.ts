import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer, index, uniqueIndex, check } from "drizzle-orm/pg-core";
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
  source: z.enum(["waitlist", "newsletter", "recommendation", "quiz", "webinar", "scan_interest", "flow_check"]),
  channelsReached: z.array(z.string()).optional(),
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

// ============================================================================
// MYFIVE EXTENSION SCHEMAS (Brownfield Extension - Drizzle ORM)
// ============================================================================

// MyFive Connection Slots (Hard Dunbar Cap of 5 Seats + Philautia Vault)
export const myfiveConnectionSlots = pgTable("myfive_connection_slots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  slotIndex: integer("slot_index").notNull(), // 0 = Philautia, 1..5 = Partner Seats
  partnerName: text("partner_name"),
  partnerUserId: varchar("partner_user_id"),
  relationType: text("relation_type"), // e.g. "Partner", "Friend", "Family"
  status: text("status").notNull().default("empty"), // "active", "empty", "siloed"
  isSelfVault: text("is_self_vault").notNull().default("false"), // "true" or "false"
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userSlotIdentity: uniqueIndex("myfive_connection_slot_user_index_idx").on(table.userId, table.slotIndex),
  validSlotIndex: check("myfive_connection_slot_index_check", sql`${table.slotIndex} BETWEEN 0 AND 5`),
  selfSlotConsistency: check(
    "myfive_connection_slot_self_check",
    sql`(${table.slotIndex} = 0 AND ${table.isSelfVault} = 'true') OR (${table.slotIndex} BETWEEN 1 AND 5 AND ${table.isSelfVault} = 'false')`,
  ),
}));

export const myfiveInvitations = pgTable("myfive_invitations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sponsorUserId: varchar("sponsor_user_id").notNull(),
  slotId: varchar("slot_id").notNull(),
  inviteeEmail: text("invitee_email").notNull(),
  tokenHash: text("token_hash").notNull().unique(),
  status: text("status").notNull().default("pending"),
  acceptedByUserId: varchar("accepted_by_user_id"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  acceptedAt: timestamp("accepted_at"),
}, (table) => ({
  sponsorStatus: index("myfive_invitation_sponsor_status_idx").on(table.sponsorUserId, table.status),
  slotStatus: index("myfive_invitation_slot_status_idx").on(table.slotId, table.status),
}));

// Private Check-Ins Vault (100% blind to partners and admins)
export const myfiveCheckIns = pgTable("myfive_check_ins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  slotId: varchar("slot_id").notNull(),
  flowOctant: text("flow_octant").notNull(), // "flow", "control", "relaxation", etc.
  privateReflection: text("private_reflection"),
  isVaultEncrypted: text("is_vault_encrypted").notNull().default("true"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Dyadic Relationship Agreements
export const myfiveAgreements = pgTable("myfive_agreements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slotId: varchar("slot_id").notNull(),
  creatorUserId: varchar("creator_user_id").notNull(),
  partnerUserId: varchar("partner_user_id"),
  agreementText: text("agreement_text").notNull(),
  valueRulesConsented: text("value_rules_consented").notNull().default("true"),
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  versionIdentity: uniqueIndex("myfive_agreement_slot_creator_version_idx").on(
    table.slotId,
    table.creatorUserId,
    table.version,
  ),
}));

// Immutable authorization events. Rows are inserted, never updated in place.
export const myfiveConsentLedger = pgTable("myfive_consent_ledger", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  actorUserId: varchar("actor_user_id").notNull(),
  slotId: varchar("slot_id").notNull(),
  consentType: text("consent_type").notNull(),
  rulesVersion: text("rules_version").notNull(),
  acceptedRuleIds: text("accepted_rule_ids").array().notNull(),
  acceptedAt: timestamp("accepted_at").defaultNow().notNull(),
});

// Private, append-only snapshots of all eight Greek-love Flow calibrations.
export const myfiveLoveProfileSnapshots = pgTable("myfive_love_profile_snapshots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  actorUserId: varchar("actor_user_id").notNull(),
  slotId: varchar("slot_id").notNull(),
  profile: jsonb("profile").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  actorSlotCreated: index("myfive_love_profile_actor_slot_created_idx").on(
    table.actorUserId,
    table.slotId,
    table.createdAt.desc(),
  ),
}));

// MyFive Stripe Sponsorship & Pay Gate Mapping
export const myfiveSubscriptions = pgTable("myfive_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  planStatus: text("plan_status").notNull().default("active"), // "active", "canceled", "sponsored"
  sponsorUserId: text("sponsor_user_id"), // Null if primary subscriber; Populated if partner seat is sponsored
  sponsoredSeatsAllocated: integer("sponsored_seats_allocated").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

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
  role: text("role"), // Self-reported professional role from Typeform
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSatellitescanPurchaseSchema = createInsertSchema(satellitescanPurchases).pick({
  customerEmail: true,
  customerName: true,
  amount: true,
  stripePaymentIntentId: true,
  status: true,
  role: true,
}).extend({
  customerEmail: z.string().email("Please enter a valid email address"),
  customerName: z.string().optional(),
  amount: z.string(),
  stripePaymentIntentId: z.string(),
  status: z.enum(["succeeded", "pending", "failed"]),
  role: z.string().optional(),
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

export const webinarSessions = pgTable("webinar_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lens: text("lens").notNull(),
  topic: text("topic").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  spotsLeft: integer("spots_left").notNull().default(12),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWebinarSessionSchema = createInsertSchema(webinarSessions).omit({
  id: true,
  createdAt: true,
});

export type InsertWebinarSession = z.infer<typeof insertWebinarSessionSchema>;
export type WebinarSession = typeof webinarSessions.$inferSelect;

export const calendarEvents = pgTable("calendar_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  month: text("month").notNull(),
  lens: text("lens").notNull(),
  color: text("color").notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCalendarEventSchema = createInsertSchema(calendarEvents).omit({
  id: true,
  createdAt: true,
});

export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;
export type CalendarEvent = typeof calendarEvents.$inferSelect;

export const flowCheckResults = pgTable("flow_check_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contactId: varchar("contact_id"),
  situation: text("situation").notNull(),
  customSituation: text("custom_situation"),
  role: text("role").notNull(),
  motivation: integer("motivation").notNull(),
  challenge: integer("challenge").notNull(),
  competence: integer("competence").notNull(),
  zone: text("zone").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFlowCheckResultSchema = createInsertSchema(flowCheckResults).pick({
  contactId: true,
  situation: true,
  customSituation: true,
  role: true,
  motivation: true,
  challenge: true,
  competence: true,
  zone: true,
}).extend({
  contactId: z.string().nullish(),
  situation: z.string().min(1),
  customSituation: z.string().nullish(),
  role: z.string().min(1),
  motivation: z.coerce.number().min(0).max(10),
  challenge: z.coerce.number().min(0).max(10),
  competence: z.coerce.number().min(0).max(10),
  zone: z.enum(["flow", "challenge", "comfort", "danger"]),
});

export type InsertFlowCheckResult = z.infer<typeof insertFlowCheckResultSchema>;
export type FlowCheckResult = typeof flowCheckResults.$inferSelect;

export const connectorStates = pgTable("connector_states", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  enabled: text("enabled").notNull().default("true"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertConnectorStateSchema = createInsertSchema(connectorStates).pick({
  name: true,
  enabled: true,
});

export type InsertConnectorState = z.infer<typeof insertConnectorStateSchema>;
export type ConnectorState = typeof connectorStates.$inferSelect;

export const connectorToggleLogs = pgTable("connector_toggle_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  connectorName: text("connector_name").notNull(),
  action: text("action").notNull(),
  previousEnabled: text("previous_enabled"),
  newEnabled: text("new_enabled"),
  triggeredBy: text("triggered_by").notNull().default("individual"),
  performedBy: text("performed_by").notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertConnectorToggleLogSchema = createInsertSchema(connectorToggleLogs).pick({
  connectorName: true,
  action: true,
  previousEnabled: true,
  newEnabled: true,
  triggeredBy: true,
  performedBy: true,
});

export type InsertConnectorToggleLog = z.infer<typeof insertConnectorToggleLogSchema>;
export type ConnectorToggleLog = typeof connectorToggleLogs.$inferSelect;

export const seoSuggestions = pgTable("seo_suggestions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  generatorType: text("generator_type").notNull(),
  targetPage: text("target_page").notNull(),
  suggestionType: text("suggestion_type").notNull(),
  content: jsonb("content").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSeoSuggestionSchema = createInsertSchema(seoSuggestions).pick({
  generatorType: true,
  targetPage: true,
  suggestionType: true,
  content: true,
  status: true,
});

export type InsertSeoSuggestion = z.infer<typeof insertSeoSuggestionSchema>;
export type SeoSuggestion = typeof seoSuggestions.$inferSelect;

export const clientUsers = pgTable("client_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),
  googleId: text("google_id").unique(),
  avatarUrl: text("avatar_url"),
  passwordHash: text("password_hash"),
  twoFactorSecret: text("two_factor_secret"),
  twoFactorEnabled: text("two_factor_enabled").default("false").notNull(),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  isActive: text("is_active").default("true").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
  notionAccessToken: text("notion_access_token"),
  notionWorkspaceName: text("notion_workspace_name"),
  notionWorkspaceId: text("notion_workspace_id"),
  notionBotId: text("notion_bot_id"),
  linkedinSub: text("linkedin_sub").unique(),
  linkedinAccessToken: text("linkedin_access_token"),
  linkedinTokenExpiry: timestamp("linkedin_token_expiry"),
  spotifyId: text("spotify_id"),
  spotifyAccessToken: text("spotify_access_token"),
  spotifyRefreshToken: text("spotify_refresh_token"),
  spotifyTokenExpiry: timestamp("spotify_token_expiry"),
  ouraId: text("oura_id"),
  ouraAccessToken: text("oura_access_token"),
  ouraRefreshToken: text("oura_refresh_token"),
  ouraTokenExpiry: timestamp("oura_token_expiry"),
  ouraConsentGrantedAt: timestamp("oura_consent_granted_at"),
});

export const insertClientUserSchema = createInsertSchema(clientUsers).pick({
  email: true,
  name: true,
  googleId: true,
  avatarUrl: true,
  passwordHash: true,
  linkedinSub: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().optional(),
  linkedinSub: z.string().optional(),
});

export type InsertClientUser = z.infer<typeof insertClientUserSchema>;
export type ClientUser = typeof clientUsers.$inferSelect;

export const clientSubscriptions = pgTable("client_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  plan: text("plan").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripeCustomerId: text("stripe_customer_id"),
  status: text("status").notNull().default("active"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelledAt: timestamp("cancelled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertClientSubscriptionSchema = createInsertSchema(clientSubscriptions).pick({
  userId: true,
  plan: true,
  stripeSubscriptionId: true,
  stripeCustomerId: true,
  status: true,
  currentPeriodStart: true,
  currentPeriodEnd: true,
});

export type InsertClientSubscription = z.infer<typeof insertClientSubscriptionSchema>;
export type ClientSubscription = typeof clientSubscriptions.$inferSelect;

export const adminSettings = pgTable("admin_settings", {
  key: varchar("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AdminSetting = typeof adminSettings.$inferSelect;

export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role"),
  company: text("company"),
  quote: text("quote").notNull(),
  consentGiven: text("consent_given").notNull().default("false"),
  visible: text("visible").notNull().default("false"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  googleId: text("google_id").unique(),
  role: text("role").notNull().default("viewer"),
  invitedBy: text("invited_by"),
  isActive: text("is_active").notNull().default("true"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  lastLoginAt: true,
}).extend({
  email: z.string().email(),
  role: z.enum(["super_admin", "admin", "viewer"]),
});

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userEmail: text("user_email").notNull(),
  actionType: text("action_type").notNull(),
  resource: text("resource"),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;

export const portalTimelineEvents = pgTable("portal_timeline_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  details: text("details"),
  lens: text("lens"),
  toolId: text("tool_id"),
  date: timestamp("date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPortalTimelineEventSchema = createInsertSchema(portalTimelineEvents).omit({
  id: true,
  createdAt: true,
});

export type InsertPortalTimelineEvent = z.infer<typeof insertPortalTimelineEventSchema>;
export type PortalTimelineEvent = typeof portalTimelineEvents.$inferSelect;

export const portalUserContext = pgTable("portal_user_context", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  key: text("key").notNull(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPortalUserContextSchema = createInsertSchema(portalUserContext).omit({
  id: true,
  updatedAt: true,
});

export type InsertPortalUserContext = z.infer<typeof insertPortalUserContextSchema>;
export type PortalUserContext = typeof portalUserContext.$inferSelect;

export const qrCodes = pgTable("qr_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  targetUrl: text("target_url").notNull(),
  type: text("type").notNull().default("campaign"),
  description: text("description"),
  isActive: text("is_active").notNull().default("true"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQrCodeSchema = createInsertSchema(qrCodes).omit({
  id: true,
  createdAt: true,
});

export type InsertQrCode = z.infer<typeof insertQrCodeSchema>;
export type QrCode = typeof qrCodes.$inferSelect;

export const qrScans = pgTable("qr_scans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  qrCodeId: varchar("qr_code_id").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  referer: text("referer"),
  country: text("country"),
  city: text("city"),
  region: text("region"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  isp: text("isp"),
  deviceType: text("device_type"),
  consentAcknowledged: text("consent_acknowledged").default("false"),
  scannedAt: timestamp("scanned_at").defaultNow().notNull(),
});

export const insertQrScanSchema = createInsertSchema(qrScans).omit({
  id: true,
  scannedAt: true,
});

export type InsertQrScan = z.infer<typeof insertQrScanSchema>;
export type QrScan = typeof qrScans.$inferSelect;

export const coachingDebriefs = pgTable("coaching_debriefs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientName: text("client_name").notNull(),
  sessionNumber: integer("session_number").notNull().default(1),
  lens: text("lens"),
  keyInsights: text("key_insights"),
  actionItems: text("action_items").array(),
  coachNotes: text("coach_notes"),
  progress: integer("progress").default(3),
  status: text("status").default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCoachingDebriefSchema = createInsertSchema(coachingDebriefs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCoachingDebrief = z.infer<typeof insertCoachingDebriefSchema>;
export type CoachingDebrief = typeof coachingDebriefs.$inferSelect;
