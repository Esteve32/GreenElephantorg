var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  adminSettings: () => adminSettings,
  adminUsers: () => adminUsers,
  auditLogs: () => auditLogs,
  batchEmailRecipients: () => batchEmailRecipients,
  batchEmailSends: () => batchEmailSends,
  calendarEvents: () => calendarEvents,
  clientSubscriptions: () => clientSubscriptions,
  clientUsers: () => clientUsers,
  coachingDebriefs: () => coachingDebriefs,
  connectorStates: () => connectorStates,
  connectorToggleLogs: () => connectorToggleLogs,
  contactMessages: () => contactMessages,
  contacts: () => contacts,
  coupons: () => coupons,
  emailVerifications: () => emailVerifications,
  flowCheckResults: () => flowCheckResults,
  insertAdminUserSchema: () => insertAdminUserSchema,
  insertAuditLogSchema: () => insertAuditLogSchema,
  insertBatchEmailRecipientSchema: () => insertBatchEmailRecipientSchema,
  insertBatchEmailSendSchema: () => insertBatchEmailSendSchema,
  insertCalendarEventSchema: () => insertCalendarEventSchema,
  insertClientSubscriptionSchema: () => insertClientSubscriptionSchema,
  insertClientUserSchema: () => insertClientUserSchema,
  insertCoachingDebriefSchema: () => insertCoachingDebriefSchema,
  insertConnectorStateSchema: () => insertConnectorStateSchema,
  insertConnectorToggleLogSchema: () => insertConnectorToggleLogSchema,
  insertContactMessageSchema: () => insertContactMessageSchema,
  insertContactSchema: () => insertContactSchema,
  insertCouponSchema: () => insertCouponSchema,
  insertEmailVerificationSchema: () => insertEmailVerificationSchema,
  insertFlowCheckResultSchema: () => insertFlowCheckResultSchema,
  insertNewsletterCampaignSchema: () => insertNewsletterCampaignSchema,
  insertNewsletterRecipientSchema: () => insertNewsletterRecipientSchema,
  insertNewsletterSubscriptionSchema: () => insertNewsletterSubscriptionSchema,
  insertOnboardingEmailLogSchema: () => insertOnboardingEmailLogSchema,
  insertOnboardingEmailTemplateSchema: () => insertOnboardingEmailTemplateSchema,
  insertPortalTimelineEventSchema: () => insertPortalTimelineEventSchema,
  insertPortalUserContextSchema: () => insertPortalUserContextSchema,
  insertPromptSchema: () => insertPromptSchema,
  insertPurchaseSchema: () => insertPurchaseSchema,
  insertQrCodeSchema: () => insertQrCodeSchema,
  insertQrScanSchema: () => insertQrScanSchema,
  insertRecommendationSubmissionSchema: () => insertRecommendationSubmissionSchema,
  insertSatellitescanPurchaseSchema: () => insertSatellitescanPurchaseSchema,
  insertSeoSuggestionSchema: () => insertSeoSuggestionSchema,
  insertSignalsQuizResultSchema: () => insertSignalsQuizResultSchema,
  insertTestimonialSchema: () => insertTestimonialSchema,
  insertUserSchema: () => insertUserSchema,
  insertWaitlistEntrySchema: () => insertWaitlistEntrySchema,
  insertWebinarSessionSchema: () => insertWebinarSessionSchema,
  insertWebinarSettingsSchema: () => insertWebinarSettingsSchema,
  insertWebinarWaitlistEntrySchema: () => insertWebinarWaitlistEntrySchema,
  newsletterCampaigns: () => newsletterCampaigns,
  newsletterRecipients: () => newsletterRecipients,
  newsletterSubscriptions: () => newsletterSubscriptions,
  onboardingEmailLogs: () => onboardingEmailLogs,
  onboardingEmailTemplates: () => onboardingEmailTemplates,
  portalTimelineEvents: () => portalTimelineEvents,
  portalUserContext: () => portalUserContext,
  prompts: () => prompts,
  purchases: () => purchases,
  qrCodes: () => qrCodes,
  qrScans: () => qrScans,
  recommendationSubmissions: () => recommendationSubmissions,
  satellitescanPurchases: () => satellitescanPurchases,
  seoSuggestions: () => seoSuggestions,
  signalsQuizResults: () => signalsQuizResults,
  testimonials: () => testimonials,
  users: () => users,
  waitlistEntries: () => waitlistEntries,
  webinarSessions: () => webinarSessions,
  webinarSettings: () => webinarSettings,
  webinarWaitlistEntries: () => webinarWaitlistEntries
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users, insertUserSchema, recommendationSubmissions, insertRecommendationSubmissionSchema, contacts, insertContactSchema, webinarWaitlistEntries, insertWebinarWaitlistEntrySchema, waitlistEntries, insertWaitlistEntrySchema, newsletterSubscriptions, insertNewsletterSubscriptionSchema, signalsQuizResults, insertSignalsQuizResultSchema, purchases, insertPurchaseSchema, contactMessages, insertContactMessageSchema, satellitescanPurchases, insertSatellitescanPurchaseSchema, coupons, insertCouponSchema, prompts, insertPromptSchema, onboardingEmailTemplates, insertOnboardingEmailTemplateSchema, onboardingEmailLogs, insertOnboardingEmailLogSchema, emailVerifications, insertEmailVerificationSchema, batchEmailSends, insertBatchEmailSendSchema, batchEmailRecipients, insertBatchEmailRecipientSchema, newsletterCampaigns, insertNewsletterCampaignSchema, newsletterRecipients, insertNewsletterRecipientSchema, webinarSettings, insertWebinarSettingsSchema, webinarSessions, insertWebinarSessionSchema, calendarEvents, insertCalendarEventSchema, flowCheckResults, insertFlowCheckResultSchema, connectorStates, insertConnectorStateSchema, connectorToggleLogs, insertConnectorToggleLogSchema, seoSuggestions, insertSeoSuggestionSchema, clientUsers, insertClientUserSchema, clientSubscriptions, insertClientSubscriptionSchema, adminSettings, testimonials, insertTestimonialSchema, adminUsers, insertAdminUserSchema, auditLogs, insertAuditLogSchema, portalTimelineEvents, insertPortalTimelineEventSchema, portalUserContext, insertPortalUserContextSchema, qrCodes, insertQrCodeSchema, qrScans, insertQrScanSchema, coachingDebriefs, insertCoachingDebriefSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    users = pgTable("users", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      username: text("username").notNull().unique(),
      password: text("password").notNull()
    });
    insertUserSchema = createInsertSchema(users).pick({
      username: true,
      password: true
    });
    recommendationSubmissions = pgTable("recommendation_submissions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      email: text("email").notNull(),
      phone: text("phone"),
      preferredContactTime: text("preferred_contact_time"),
      recommendedPath: text("recommended_path").notNull(),
      answers: jsonb("answers").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertRecommendationSubmissionSchema = createInsertSchema(recommendationSubmissions).pick({
      name: true,
      email: true,
      phone: true,
      preferredContactTime: true,
      recommendedPath: true,
      answers: true
    }).extend({
      email: z.string().email("Please enter a valid email address"),
      name: z.string().min(2, "Please enter your full name"),
      phone: z.string().optional(),
      preferredContactTime: z.string().optional()
    });
    contacts = pgTable("contacts", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      email: text("email").notNull().unique(),
      name: text("name"),
      consentGiven: text("consent_given").notNull(),
      // Boolean stored as text "true" or "false"
      consentText: text("consent_text").notNull(),
      // Legal copy they agreed to
      consentedAt: timestamp("consented_at").defaultNow().notNull(),
      source: text("source").notNull(),
      // "waitlist", "newsletter", "recommendation", "quiz"
      channelsReached: text("channels_reached").array(),
      // Multi-select tags: newsletter, purchase, quiz, webinar, recommendation, contact
      createdAt: timestamp("created_at").defaultNow().notNull(),
      notionPageId: text("notion_page_id"),
      // Notion CRM sync tracking
      notionSyncedAt: timestamp("notion_synced_at"),
      // Last sync timestamp
      scanSubmittedAt: timestamp("scan_submitted_at")
      // When Typeform Satellite Scan was submitted
    });
    insertContactSchema = createInsertSchema(contacts).pick({
      email: true,
      name: true,
      consentGiven: true,
      consentText: true,
      source: true,
      channelsReached: true
    }).extend({
      email: z.string().email("Please enter a valid email address"),
      name: z.string().min(2).optional(),
      consentGiven: z.string(),
      consentText: z.string(),
      source: z.enum(["waitlist", "newsletter", "recommendation", "quiz", "webinar", "scan_interest", "flow_check"]),
      channelsReached: z.array(z.string()).optional()
    });
    webinarWaitlistEntries = pgTable("webinar_waitlist_entries", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      contactId: varchar("contact_id").notNull(),
      preferredLens: text("preferred_lens"),
      // influence, attitude, chaordic, flow, alignment, needs, ego, dynamics
      interests: text("interests"),
      // Optional text about what they want to learn
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertWebinarWaitlistEntrySchema = createInsertSchema(webinarWaitlistEntries).pick({
      contactId: true,
      preferredLens: true,
      interests: true
    }).extend({
      preferredLens: z.enum(["influence", "attitude", "chaordic", "flow", "alignment", "needs", "ego", "dynamics"]).optional(),
      interests: z.string().optional()
    });
    waitlistEntries = pgTable("waitlist_entries", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      contactId: varchar("contact_id").notNull(),
      motivation: text("motivation").notNull(),
      retreatType: text("retreat_type"),
      // "provence" or "lapland"
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertWaitlistEntrySchema = createInsertSchema(waitlistEntries).pick({
      contactId: true,
      motivation: true,
      retreatType: true
    }).extend({
      motivation: z.string().min(10, "Please share a bit more about your motivation (at least 10 characters)"),
      retreatType: z.enum(["provence", "lapland"]).optional()
    });
    newsletterSubscriptions = pgTable("newsletter_subscriptions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      contactId: varchar("contact_id").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).pick({
      contactId: true
    });
    signalsQuizResults = pgTable("signals_quiz_results", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      contactId: varchar("contact_id"),
      score: text("score").notNull(),
      // Stored as text, convert to number
      answers: jsonb("answers").notNull(),
      // Raw quiz responses
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertSignalsQuizResultSchema = createInsertSchema(signalsQuizResults).pick({
      contactId: true,
      score: true,
      answers: true
    }).extend({
      contactId: z.string().nullish(),
      // Allow string, null, or undefined
      score: z.coerce.number().min(0, "Score must be at least 0").max(100, "Score cannot exceed 100"),
      answers: z.record(z.any())
    });
    purchases = pgTable("purchases", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      customerEmail: text("customer_email").notNull(),
      customerName: text("customer_name"),
      packageId: text("package_id").notNull(),
      // foundation, transformation, team
      packageName: text("package_name").notNull(),
      amount: text("amount").notNull(),
      // Price in EUR (stored as text, e.g., "795")
      stripePaymentIntentId: text("stripe_payment_intent_id").notNull().unique(),
      status: text("status").notNull(),
      // succeeded, pending, failed
      calendlyBooked: text("calendly_booked").default("false").notNull(),
      // Track if they've booked
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertPurchaseSchema = createInsertSchema(purchases).pick({
      customerEmail: true,
      customerName: true,
      packageId: true,
      packageName: true,
      amount: true,
      stripePaymentIntentId: true,
      status: true
    }).extend({
      customerEmail: z.string().email("Please enter a valid email address"),
      customerName: z.string().optional(),
      packageId: z.string(),
      packageName: z.string(),
      amount: z.string(),
      stripePaymentIntentId: z.string(),
      status: z.enum(["succeeded", "pending", "failed"])
    });
    contactMessages = pgTable("contact_messages", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      email: text("email").notNull(),
      message: text("message").notNull(),
      intent: text("intent"),
      // "retreats", "coaching", "research", or null
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertContactMessageSchema = createInsertSchema(contactMessages).pick({
      name: true,
      email: true,
      message: true,
      intent: true
    }).extend({
      name: z.string().min(2, "Please enter your name"),
      email: z.string().email("Please enter a valid email address"),
      message: z.string().min(10, "Please share a bit more detail (at least 10 characters)"),
      intent: z.enum(["retreats", "coaching", "research", "general"]).default("general")
      // Default to "general" if not selected
    });
    satellitescanPurchases = pgTable("satellitescan_purchases", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      customerEmail: text("customer_email").notNull(),
      customerName: text("customer_name"),
      amount: text("amount").notNull(),
      // Price in EUR (stored as text, e.g., "29.99")
      stripePaymentIntentId: text("stripe_payment_intent_id").notNull().unique(),
      status: text("status").notNull(),
      // "succeeded", "pending", "failed"
      typeformCompleted: text("typeform_completed").default("false").notNull(),
      // Track if they completed Typeform
      typeformCompletedAt: timestamp("typeform_completed_at"),
      // When the Typeform scan was actually completed
      dashboardSent: text("dashboard_sent").default("false").notNull(),
      // Track if dashboard sent
      remindersCount: text("reminders_count").default("0").notNull(),
      // Track how many reminders sent
      role: text("role"),
      // Self-reported professional role from Typeform
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertSatellitescanPurchaseSchema = createInsertSchema(satellitescanPurchases).pick({
      customerEmail: true,
      customerName: true,
      amount: true,
      stripePaymentIntentId: true,
      status: true,
      role: true
    }).extend({
      customerEmail: z.string().email("Please enter a valid email address"),
      customerName: z.string().optional(),
      amount: z.string(),
      stripePaymentIntentId: z.string(),
      status: z.enum(["succeeded", "pending", "failed"]),
      role: z.string().optional()
    });
    coupons = pgTable("coupons", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      code: text("code").notNull().unique(),
      // e.g., "STUDENT50", "STARTUP100"
      discountAmount: text("discount_amount").notNull(),
      // Amount in EUR as text (e.g., "29.99" for free, "14.99" for 50% off)
      category: text("category").notNull(),
      // "student", "startup", "social_enterprise", "unemployed"
      isActive: text("is_active").default("true").notNull(),
      // "true" or "false"
      maxUses: text("max_uses"),
      // null for unlimited, or number as text
      usedCount: text("used_count").default("0").notNull(),
      // How many times coupon has been used
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertCouponSchema = createInsertSchema(coupons).pick({
      code: true,
      discountAmount: true,
      category: true,
      isActive: true,
      maxUses: true
    }).extend({
      code: z.string().min(3).toUpperCase(),
      discountAmount: z.string(),
      category: z.enum(["student", "startup", "social_enterprise", "unemployed"]),
      isActive: z.string().default("true"),
      maxUses: z.string().optional()
    });
    prompts = pgTable("prompts", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      lensType: text("lens_type").notNull(),
      // "influence", "attitude", "chaordic", "flow", "alignment", "needs", "ego", "dynamics", "quickwins"
      title: text("title").notNull(),
      description: text("description").notNull(),
      whatItDoes: text("what_it_does").array().notNull(),
      // Array of strings describing what the prompt does
      perfectFor: text("perfect_for").notNull(),
      promptContent: text("prompt_content").notNull(),
      // The actual prompt template text
      roleCategory: text("role_category").notNull(),
      // "EA", "ACX", "TealLeaders", or "all"
      votes: text("votes").default("0").notNull(),
      isActive: text("is_active").default("true").notNull(),
      // "true" or "false"
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertPromptSchema = createInsertSchema(prompts).pick({
      lensType: true,
      title: true,
      description: true,
      whatItDoes: true,
      perfectFor: true,
      promptContent: true,
      roleCategory: true,
      isActive: true
    }).extend({
      lensType: z.enum(["influence", "attitude", "chaordic", "flow", "alignment", "needs", "ego", "dynamics", "quickwins"]),
      title: z.string().min(3, "Title must be at least 3 characters"),
      description: z.string().min(10, "Description must be at least 10 characters"),
      whatItDoes: z.array(z.string()).min(1, "At least one item required"),
      perfectFor: z.string().min(10, "Perfect for must be at least 10 characters"),
      promptContent: z.string().min(50, "Prompt content must be at least 50 characters"),
      roleCategory: z.enum(["EA", "ACX", "TealLeaders", "all"]),
      isActive: z.string().default("true")
    });
    onboardingEmailTemplates = pgTable("onboarding_email_templates", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      sequenceNumber: text("sequence_number").notNull(),
      // 0-9 for the Fibonacci sequence
      title: text("title").notNull(),
      // Internal title for admin reference
      subject: text("subject").notNull(),
      // Email subject line
      body: text("body").notNull(),
      // HTML email body content
      delayMinutes: text("delay_minutes").notNull(),
      // Delay in minutes from trigger event
      triggerEvent: text("trigger_event").notNull(),
      // "purchase" or "scan_completed"
      isActive: text("is_active").default("true").notNull(),
      // "true" or "false"
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertOnboardingEmailTemplateSchema = createInsertSchema(onboardingEmailTemplates).pick({
      sequenceNumber: true,
      title: true,
      subject: true,
      body: true,
      delayMinutes: true,
      triggerEvent: true,
      isActive: true
    }).extend({
      sequenceNumber: z.string(),
      title: z.string().min(3, "Title must be at least 3 characters"),
      subject: z.string().min(3, "Subject must be at least 3 characters"),
      body: z.string().min(10, "Body must be at least 10 characters"),
      delayMinutes: z.string(),
      triggerEvent: z.enum(["purchase", "scan_completed"]),
      isActive: z.string().default("true")
    });
    onboardingEmailLogs = pgTable("onboarding_email_logs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      customerEmail: text("customer_email").notNull(),
      templateId: varchar("template_id").notNull(),
      // References onboardingEmailTemplates.id
      sequenceNumber: text("sequence_number").notNull(),
      // For quick lookup without joins
      sentAt: timestamp("sent_at").defaultNow().notNull(),
      status: text("status").notNull(),
      // "sent", "failed", "skipped"
      errorMessage: text("error_message")
      // If failed, why
    });
    insertOnboardingEmailLogSchema = createInsertSchema(onboardingEmailLogs).pick({
      customerEmail: true,
      templateId: true,
      sequenceNumber: true,
      status: true,
      errorMessage: true
    }).extend({
      customerEmail: z.string().email(),
      templateId: z.string(),
      sequenceNumber: z.string(),
      status: z.enum(["sent", "failed", "skipped"]),
      errorMessage: z.string().optional()
    });
    emailVerifications = pgTable("email_verifications", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      email: text("email").notNull(),
      code: text("code").notNull(),
      // 6-digit verification code
      verified: text("verified").default("false").notNull(),
      expiresAt: timestamp("expires_at").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertEmailVerificationSchema = createInsertSchema(emailVerifications).pick({
      email: true,
      code: true,
      expiresAt: true
    }).extend({
      email: z.string().email("Please enter a valid email address"),
      code: z.string().length(6)
    });
    batchEmailSends = pgTable("batch_email_sends", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      subject: text("subject").notNull(),
      body: text("body").notNull(),
      filterCriteria: jsonb("filter_criteria").notNull(),
      // Store channel filters as JSON
      recipientCount: text("recipient_count").notNull(),
      // Number of recipients attempted
      successCount: text("success_count").default("0").notNull(),
      // Number successfully sent
      failedCount: text("failed_count").default("0").notNull(),
      // Number failed
      status: text("status").default("pending").notNull(),
      // "pending", "sending", "completed", "failed"
      sentAt: timestamp("sent_at"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertBatchEmailSendSchema = createInsertSchema(batchEmailSends).pick({
      subject: true,
      body: true,
      filterCriteria: true,
      recipientCount: true
    }).extend({
      subject: z.string().min(3, "Subject must be at least 3 characters"),
      body: z.string().min(10, "Body must be at least 10 characters"),
      filterCriteria: z.object({
        includeChannels: z.array(z.string()).optional(),
        excludeChannels: z.array(z.string()).optional()
      }),
      recipientCount: z.string()
    });
    batchEmailRecipients = pgTable("batch_email_recipients", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      batchId: varchar("batch_id").notNull(),
      // References batchEmailSends.id
      contactId: varchar("contact_id").notNull(),
      // References contacts.id
      email: text("email").notNull(),
      status: text("status").default("pending").notNull(),
      // "pending", "sent", "failed"
      errorMessage: text("error_message"),
      sentAt: timestamp("sent_at"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertBatchEmailRecipientSchema = createInsertSchema(batchEmailRecipients).pick({
      batchId: true,
      contactId: true,
      email: true,
      status: true,
      errorMessage: true
    }).extend({
      batchId: z.string(),
      contactId: z.string(),
      email: z.string().email(),
      status: z.enum(["pending", "sent", "failed"]).default("pending"),
      errorMessage: z.string().optional()
    });
    newsletterCampaigns = pgTable("newsletter_campaigns", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      // Campaign name for identification (e.g., "Q1 2026 Newsletter")
      subject: text("subject").notNull(),
      htmlContent: text("html_content").notNull(),
      // Full HTML email body
      status: text("status").default("draft").notNull(),
      // "draft", "ready", "sending", "sent"
      createdAt: timestamp("created_at").defaultNow().notNull(),
      sentAt: timestamp("sent_at")
    });
    insertNewsletterCampaignSchema = createInsertSchema(newsletterCampaigns).pick({
      name: true,
      subject: true,
      htmlContent: true,
      status: true
    }).extend({
      name: z.string().min(3, "Campaign name must be at least 3 characters"),
      subject: z.string().min(3, "Subject must be at least 3 characters"),
      htmlContent: z.string().min(10, "Content must be at least 10 characters"),
      status: z.enum(["draft", "ready", "sending", "sent"]).default("draft")
    });
    newsletterRecipients = pgTable("newsletter_recipients", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      campaignId: varchar("campaign_id").notNull(),
      // References newsletterCampaigns.id
      contactId: varchar("contact_id").notNull(),
      // References contacts.id
      email: text("email").notNull(),
      excluded: text("excluded").default("false").notNull(),
      // "true" = manually opted out for this campaign
      status: text("status").default("pending").notNull(),
      // "pending", "sent", "failed"
      openedAt: timestamp("opened_at"),
      // When email was first opened
      openCount: text("open_count").default("0").notNull(),
      // How many times opened
      notionSynced: text("notion_synced").default("false").notNull(),
      // "true" = synced to Notion
      errorMessage: text("error_message"),
      sentAt: timestamp("sent_at"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertNewsletterRecipientSchema = createInsertSchema(newsletterRecipients).pick({
      campaignId: true,
      contactId: true,
      email: true,
      excluded: true,
      status: true
    }).extend({
      campaignId: z.string(),
      contactId: z.string(),
      email: z.string().email(),
      excluded: z.enum(["true", "false"]).default("false"),
      status: z.enum(["pending", "sent", "failed"]).default("pending")
    });
    webinarSettings = pgTable("webinar_settings", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      countdownDeadline: timestamp("countdown_deadline").notNull(),
      hostNames: text("host_names").notNull(),
      bonusDescription: text("bonus_description").notNull(),
      sessionTitle: text("session_title").notNull(),
      sessionSubtitle: text("session_subtitle").notNull(),
      sessionDuration: text("session_duration").notNull(),
      ctaButtonText: text("cta_button_text"),
      ctaButtonTextExpired: text("cta_button_text_expired"),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertWebinarSettingsSchema = createInsertSchema(webinarSettings).omit({
      id: true,
      updatedAt: true
    }).extend({
      countdownDeadline: z.string().or(z.date()),
      hostNames: z.string().min(1, "Host name is required"),
      bonusDescription: z.string().min(1, "Bonus description is required"),
      sessionTitle: z.string().min(1, "Title is required"),
      sessionSubtitle: z.string().min(1, "Subtitle is required"),
      sessionDuration: z.string().min(1, "Duration is required"),
      ctaButtonText: z.string().optional().nullable(),
      ctaButtonTextExpired: z.string().optional().nullable()
    });
    webinarSessions = pgTable("webinar_sessions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      lens: text("lens").notNull(),
      topic: text("topic").notNull(),
      description: text("description").notNull(),
      date: text("date").notNull(),
      time: text("time").notNull(),
      spotsLeft: integer("spots_left").notNull().default(12),
      sortOrder: integer("sort_order").notNull().default(0),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertWebinarSessionSchema = createInsertSchema(webinarSessions).omit({
      id: true,
      createdAt: true
    });
    calendarEvents = pgTable("calendar_events", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      month: text("month").notNull(),
      lens: text("lens").notNull(),
      color: text("color").notNull(),
      description: text("description").notNull(),
      sortOrder: integer("sort_order").notNull().default(0),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertCalendarEventSchema = createInsertSchema(calendarEvents).omit({
      id: true,
      createdAt: true
    });
    flowCheckResults = pgTable("flow_check_results", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      contactId: varchar("contact_id"),
      situation: text("situation").notNull(),
      customSituation: text("custom_situation"),
      role: text("role").notNull(),
      motivation: integer("motivation").notNull(),
      challenge: integer("challenge").notNull(),
      competence: integer("competence").notNull(),
      zone: text("zone").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertFlowCheckResultSchema = createInsertSchema(flowCheckResults).pick({
      contactId: true,
      situation: true,
      customSituation: true,
      role: true,
      motivation: true,
      challenge: true,
      competence: true,
      zone: true
    }).extend({
      contactId: z.string().nullish(),
      situation: z.string().min(1),
      customSituation: z.string().nullish(),
      role: z.string().min(1),
      motivation: z.coerce.number().min(0).max(10),
      challenge: z.coerce.number().min(0).max(10),
      competence: z.coerce.number().min(0).max(10),
      zone: z.enum(["flow", "challenge", "comfort", "danger"])
    });
    connectorStates = pgTable("connector_states", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull().unique(),
      enabled: text("enabled").notNull().default("true"),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertConnectorStateSchema = createInsertSchema(connectorStates).pick({
      name: true,
      enabled: true
    });
    connectorToggleLogs = pgTable("connector_toggle_logs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      connectorName: text("connector_name").notNull(),
      action: text("action").notNull(),
      previousEnabled: text("previous_enabled"),
      newEnabled: text("new_enabled"),
      triggeredBy: text("triggered_by").notNull().default("individual"),
      performedBy: text("performed_by").notNull().default("admin"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertConnectorToggleLogSchema = createInsertSchema(connectorToggleLogs).pick({
      connectorName: true,
      action: true,
      previousEnabled: true,
      newEnabled: true,
      triggeredBy: true,
      performedBy: true
    });
    seoSuggestions = pgTable("seo_suggestions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      generatorType: text("generator_type").notNull(),
      targetPage: text("target_page").notNull(),
      suggestionType: text("suggestion_type").notNull(),
      content: jsonb("content").notNull(),
      status: text("status").notNull().default("pending"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertSeoSuggestionSchema = createInsertSchema(seoSuggestions).pick({
      generatorType: true,
      targetPage: true,
      suggestionType: true,
      content: true,
      status: true
    });
    clientUsers = pgTable("client_users", {
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
      ouraConsentGrantedAt: timestamp("oura_consent_granted_at")
    });
    insertClientUserSchema = createInsertSchema(clientUsers).pick({
      email: true,
      name: true,
      googleId: true,
      avatarUrl: true,
      passwordHash: true,
      linkedinSub: true
    }).extend({
      email: z.string().email("Please enter a valid email address"),
      name: z.string().optional(),
      linkedinSub: z.string().optional()
    });
    clientSubscriptions = pgTable("client_subscriptions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull(),
      plan: text("plan").notNull(),
      stripeSubscriptionId: text("stripe_subscription_id"),
      stripeCustomerId: text("stripe_customer_id"),
      status: text("status").notNull().default("active"),
      currentPeriodStart: timestamp("current_period_start"),
      currentPeriodEnd: timestamp("current_period_end"),
      cancelledAt: timestamp("cancelled_at"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertClientSubscriptionSchema = createInsertSchema(clientSubscriptions).pick({
      userId: true,
      plan: true,
      stripeSubscriptionId: true,
      stripeCustomerId: true,
      status: true,
      currentPeriodStart: true,
      currentPeriodEnd: true
    });
    adminSettings = pgTable("admin_settings", {
      key: varchar("key").primaryKey(),
      value: text("value").notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    testimonials = pgTable("testimonials", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      role: text("role"),
      company: text("company"),
      quote: text("quote").notNull(),
      consentGiven: text("consent_given").notNull().default("false"),
      visible: text("visible").notNull().default("false"),
      sortOrder: integer("sort_order").notNull().default(0),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertTestimonialSchema = createInsertSchema(testimonials).omit({
      id: true,
      createdAt: true
    });
    adminUsers = pgTable("admin_users", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      email: text("email").notNull().unique(),
      name: text("name"),
      avatarUrl: text("avatar_url"),
      googleId: text("google_id").unique(),
      role: text("role").notNull().default("viewer"),
      invitedBy: text("invited_by"),
      isActive: text("is_active").notNull().default("true"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      lastLoginAt: timestamp("last_login_at")
    });
    insertAdminUserSchema = createInsertSchema(adminUsers).omit({
      id: true,
      createdAt: true,
      lastLoginAt: true
    }).extend({
      email: z.string().email(),
      role: z.enum(["super_admin", "admin", "viewer"])
    });
    auditLogs = pgTable("audit_logs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userEmail: text("user_email").notNull(),
      actionType: text("action_type").notNull(),
      resource: text("resource"),
      details: jsonb("details"),
      ipAddress: text("ip_address"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertAuditLogSchema = createInsertSchema(auditLogs).omit({
      id: true,
      createdAt: true
    });
    portalTimelineEvents = pgTable("portal_timeline_events", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull(),
      type: text("type").notNull(),
      title: text("title").notNull(),
      description: text("description"),
      details: text("details"),
      lens: text("lens"),
      toolId: text("tool_id"),
      date: timestamp("date").defaultNow().notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertPortalTimelineEventSchema = createInsertSchema(portalTimelineEvents).omit({
      id: true,
      createdAt: true
    });
    portalUserContext = pgTable("portal_user_context", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull(),
      key: text("key").notNull(),
      value: text("value").notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertPortalUserContextSchema = createInsertSchema(portalUserContext).omit({
      id: true,
      updatedAt: true
    });
    qrCodes = pgTable("qr_codes", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      slug: text("slug").notNull().unique(),
      targetUrl: text("target_url").notNull(),
      type: text("type").notNull().default("campaign"),
      description: text("description"),
      isActive: text("is_active").notNull().default("true"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertQrCodeSchema = createInsertSchema(qrCodes).omit({
      id: true,
      createdAt: true
    });
    qrScans = pgTable("qr_scans", {
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
      scannedAt: timestamp("scanned_at").defaultNow().notNull()
    });
    insertQrScanSchema = createInsertSchema(qrScans).omit({
      id: true,
      scannedAt: true
    });
    coachingDebriefs = pgTable("coaching_debriefs", {
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
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertCoachingDebriefSchema = createInsertSchema(coachingDebriefs).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
  }
});

// server/db.ts
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
var neonPool, db, pool;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    neonConfig.webSocketConstructor = ws;
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    neonPool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle(neonPool, { schema: schema_exports });
    pool = neonPool;
  }
});

// server/storage.ts
var storage_exports = {};
__export(storage_exports, {
  DatabaseStorage: () => DatabaseStorage,
  MemStorage: () => MemStorage,
  storage: () => storage
});
import { randomUUID } from "crypto";
import { eq, and, lt, sql as sql2, desc } from "drizzle-orm";
var MemStorage, DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    MemStorage = class {
      users;
      recommendationSubmissions;
      contacts;
      waitlistEntries;
      newsletterSubscriptions;
      signalsQuizResults;
      purchases;
      contactMessages;
      satellitescanPurchases;
      flowCheckResultsMap;
      webinarSessionsMap;
      calendarEventsMap;
      constructor() {
        this.users = /* @__PURE__ */ new Map();
        this.recommendationSubmissions = /* @__PURE__ */ new Map();
        this.contacts = /* @__PURE__ */ new Map();
        this.waitlistEntries = /* @__PURE__ */ new Map();
        this.newsletterSubscriptions = /* @__PURE__ */ new Map();
        this.signalsQuizResults = /* @__PURE__ */ new Map();
        this.purchases = /* @__PURE__ */ new Map();
        this.contactMessages = /* @__PURE__ */ new Map();
        this.satellitescanPurchases = /* @__PURE__ */ new Map();
        this.flowCheckResultsMap = /* @__PURE__ */ new Map();
        this.webinarSessionsMap = /* @__PURE__ */ new Map();
        this.calendarEventsMap = /* @__PURE__ */ new Map();
      }
      async getUser(id) {
        return this.users.get(id);
      }
      async getUserByUsername(username) {
        return Array.from(this.users.values()).find(
          (user) => user.username === username
        );
      }
      async createUser(insertUser) {
        const id = randomUUID();
        const user = { ...insertUser, id };
        this.users.set(id, user);
        return user;
      }
      async createRecommendationSubmission(insertSubmission) {
        const id = randomUUID();
        const submission = {
          ...insertSubmission,
          id,
          createdAt: /* @__PURE__ */ new Date(),
          phone: insertSubmission.phone || null,
          preferredContactTime: insertSubmission.preferredContactTime || null
        };
        this.recommendationSubmissions.set(id, submission);
        console.log(`\u2713 Recommendation submission stored: ${insertSubmission.name} \u2192 ${insertSubmission.recommendedPath}`);
        return submission;
      }
      async getAllRecommendationSubmissions() {
        return Array.from(this.recommendationSubmissions.values());
      }
      // Contact management methods
      async createContact(insertContact) {
        const id = randomUUID();
        const { channelsReached: chReached, ...restInsert } = insertContact;
        const contact = {
          ...restInsert,
          id,
          name: insertContact.name || null,
          consentedAt: /* @__PURE__ */ new Date(),
          createdAt: /* @__PURE__ */ new Date(),
          notionPageId: null,
          notionSyncedAt: null,
          scanSubmittedAt: null,
          channelsReached: chReached ?? null
        };
        this.contacts.set(id, contact);
        console.log(`\u2713 Contact created: ${insertContact.email} (${insertContact.source})`);
        return contact;
      }
      async getContactByEmail(email) {
        return Array.from(this.contacts.values()).find(
          (contact) => contact.email === email
        );
      }
      async getAllContacts() {
        return Array.from(this.contacts.values());
      }
      async addChannelToContact(email, channel) {
        const contact = await this.getContactByEmail(email);
        if (!contact) return void 0;
        const currentChannels = contact.channelsReached || [];
        if (!currentChannels.includes(channel)) {
          contact.channelsReached = [...currentChannels, channel];
          this.contacts.set(contact.id, contact);
          console.log(`\u2713 Added channel '${channel}' to contact: ${email}`);
        }
        return contact;
      }
      async getContactsByChannel(channel) {
        return Array.from(this.contacts.values()).filter(
          (contact) => contact.channelsReached?.includes(channel)
        );
      }
      async getContactsWithoutChannel(channel) {
        return Array.from(this.contacts.values()).filter(
          (contact) => !contact.channelsReached?.includes(channel)
        );
      }
      async updateScanSubmittedAt(email, submittedAt) {
        const contact = await this.getContactByEmail(email);
        if (!contact) return void 0;
        contact.scanSubmittedAt = submittedAt;
        this.contacts.set(contact.id, contact);
        console.log(`\u2713 Updated scan submitted date for: ${email}`);
        return contact;
      }
      // Waitlist entry methods
      async createWaitlistEntry(insertEntry) {
        const id = randomUUID();
        const entry = {
          ...insertEntry,
          id,
          retreatType: insertEntry.retreatType || null,
          createdAt: /* @__PURE__ */ new Date()
        };
        this.waitlistEntries.set(id, entry);
        console.log(`\u2713 Waitlist entry created: ${insertEntry.contactId}`);
        return entry;
      }
      async getAllWaitlistEntries() {
        return Array.from(this.waitlistEntries.values());
      }
      // Newsletter subscription methods
      async createNewsletterSubscription(insertSubscription) {
        const id = randomUUID();
        const subscription = {
          ...insertSubscription,
          id,
          createdAt: /* @__PURE__ */ new Date()
        };
        this.newsletterSubscriptions.set(id, subscription);
        console.log(`\u2713 Newsletter subscription created: ${insertSubscription.contactId}`);
        return subscription;
      }
      async getAllNewsletterSubscriptions() {
        return Array.from(this.newsletterSubscriptions.values());
      }
      // Signals quiz methods
      async createSignalsQuizResult(insertResult) {
        const id = randomUUID();
        const result = {
          id,
          contactId: insertResult.contactId || null,
          score: insertResult.score.toString(),
          answers: insertResult.answers,
          createdAt: /* @__PURE__ */ new Date()
        };
        this.signalsQuizResults.set(id, result);
        console.log(`\u2713 Signals quiz result stored: score ${insertResult.score}`);
        return result;
      }
      async getQuizAverageScore() {
        const results = Array.from(this.signalsQuizResults.values());
        if (results.length === 0) {
          return 0;
        }
        const validScores = results.map((result) => parseFloat(result.score)).filter((score) => !isNaN(score) && isFinite(score));
        if (validScores.length === 0) {
          return 0;
        }
        const total = validScores.reduce((sum, score) => sum + score, 0);
        return Math.round(total / validScores.length);
      }
      async getAllSignalsQuizResults() {
        return Array.from(this.signalsQuizResults.values());
      }
      // Purchase methods
      async createPurchase(insertPurchase) {
        const id = randomUUID();
        const purchase = {
          ...insertPurchase,
          id,
          customerName: insertPurchase.customerName || null,
          calendlyBooked: "false",
          createdAt: /* @__PURE__ */ new Date()
        };
        this.purchases.set(id, purchase);
        console.log(`\u2713 Purchase created: ${insertPurchase.customerEmail} \u2192 ${insertPurchase.packageName} (\u20AC${insertPurchase.amount})`);
        return purchase;
      }
      async getPurchaseByPaymentIntent(paymentIntentId) {
        return Array.from(this.purchases.values()).find(
          (purchase) => purchase.stripePaymentIntentId === paymentIntentId
        );
      }
      async getAllPurchases() {
        return Array.from(this.purchases.values());
      }
      // Contact message methods
      async createContactMessage(insertMessage) {
        const id = randomUUID();
        const message = {
          ...insertMessage,
          id,
          intent: insertMessage.intent || null,
          createdAt: /* @__PURE__ */ new Date()
        };
        this.contactMessages.set(id, message);
        console.log(`\u2713 Contact message created: ${insertMessage.name} (${insertMessage.email})`);
        return message;
      }
      async getAllContactMessages() {
        return Array.from(this.contactMessages.values());
      }
      // Satellite Scan purchase methods
      async createSatellitescanPurchase(insertPurchase) {
        const id = randomUUID();
        const purchase = {
          ...insertPurchase,
          id,
          customerName: insertPurchase.customerName || null,
          role: insertPurchase.role ?? null,
          typeformCompleted: "false",
          typeformCompletedAt: null,
          dashboardSent: "false",
          remindersCount: "0",
          createdAt: /* @__PURE__ */ new Date()
        };
        this.satellitescanPurchases.set(id, purchase);
        console.log(`\u2713 Satellitescan purchase created: ${insertPurchase.customerEmail} (\u20AC${insertPurchase.amount})`);
        return purchase;
      }
      async getSatellitescanPurchaseByPaymentIntent(paymentIntentId) {
        return Array.from(this.satellitescanPurchases.values()).find(
          (purchase) => purchase.stripePaymentIntentId === paymentIntentId
        );
      }
      async getAllSatellitescanPurchases() {
        return Array.from(this.satellitescanPurchases.values());
      }
      async getSatellitescanPurchasesByEmail(email) {
        const normalizedEmail = email.toLowerCase().trim();
        return Array.from(this.satellitescanPurchases.values()).filter(
          (p) => p.customerEmail.toLowerCase().trim() === normalizedEmail
        );
      }
      async getOverdueSatellitescanPurchases(hoursThreshold) {
        const now = /* @__PURE__ */ new Date();
        const thresholdMs = hoursThreshold * 60 * 60 * 1e3;
        return Array.from(this.satellitescanPurchases.values()).filter((purchase) => {
          const createdAt = new Date(purchase.createdAt);
          const ageMs = now.getTime() - createdAt.getTime();
          return purchase.typeformCompleted === "false" && parseInt(purchase.remindersCount) === 0 && ageMs >= thresholdMs;
        });
      }
      async updateSatellitescanReminderCount(purchaseId, count) {
        const purchase = this.satellitescanPurchases.get(purchaseId);
        if (purchase) {
          purchase.remindersCount = count.toString();
          this.satellitescanPurchases.set(purchaseId, purchase);
        }
      }
      async markTypeformCompletedByEmail(email) {
        let count = 0;
        const normalizedEmail = email.toLowerCase().trim();
        for (const [id, purchase] of Array.from(this.satellitescanPurchases.entries())) {
          if (purchase.customerEmail.toLowerCase().trim() === normalizedEmail && purchase.typeformCompleted === "false") {
            purchase.typeformCompleted = "true";
            purchase.typeformCompletedAt = /* @__PURE__ */ new Date();
            this.satellitescanPurchases.set(id, purchase);
            count++;
          }
        }
        return count;
      }
      async updateSatellitescanRole(email, role) {
        const normalizedEmail = email.toLowerCase().trim();
        for (const [id, purchase] of Array.from(this.satellitescanPurchases.entries())) {
          if (purchase.customerEmail.toLowerCase().trim() === normalizedEmail) {
            purchase.role = role;
            this.satellitescanPurchases.set(id, purchase);
          }
        }
      }
      // Email verification methods (memory implementation - not used in production)
      async createEmailVerification(email, code) {
        throw new Error("MemStorage does not support email verification");
      }
      async getEmailVerification(email, code) {
        throw new Error("MemStorage does not support email verification");
      }
      async markEmailVerified(email) {
        throw new Error("MemStorage does not support email verification");
      }
      async cleanupExpiredVerifications() {
      }
      // Batch email methods (stub implementations for MemStorage)
      async getContactsWithFilters(includeChannels, excludeChannels) {
        let result = Array.from(this.contacts.values());
        if (includeChannels && includeChannels.length > 0) {
          result = result.filter(
            (c) => c.channelsReached && includeChannels.some((ch) => c.channelsReached.includes(ch))
          );
        }
        if (excludeChannels && excludeChannels.length > 0) {
          result = result.filter(
            (c) => !c.channelsReached || !excludeChannels.some((ch) => c.channelsReached.includes(ch))
          );
        }
        return result;
      }
      async createBatchEmailSend(data) {
        throw new Error("MemStorage does not support batch email sends");
      }
      async updateBatchEmailSend(id, data) {
        throw new Error("MemStorage does not support batch email sends");
      }
      async getAllBatchEmailSends() {
        return [];
      }
      async getBatchEmailSendById(id) {
        throw new Error("MemStorage does not support batch email sends");
      }
      async createBatchEmailRecipient(data) {
        throw new Error("MemStorage does not support batch email recipients");
      }
      async updateBatchEmailRecipient(id, data) {
        throw new Error("MemStorage does not support batch email recipients");
      }
      async getBatchEmailRecipientsByBatchId(batchId) {
        return [];
      }
      // Newsletter campaign stubs
      async createNewsletterCampaign(data) {
        throw new Error("MemStorage does not support newsletter campaigns");
      }
      async getNewsletterCampaignById(id) {
        return void 0;
      }
      async getAllNewsletterCampaigns() {
        return [];
      }
      async updateNewsletterCampaign(id, data) {
        return void 0;
      }
      async deleteNewsletterCampaign(id) {
        return false;
      }
      async createNewsletterRecipient(data) {
        throw new Error("MemStorage does not support newsletter recipients");
      }
      async getNewsletterRecipientsByCampaign(campaignId) {
        return [];
      }
      async updateNewsletterRecipient(id, data) {
        return void 0;
      }
      async getNewsletterRecipientByTracking(campaignId, contactId) {
        return void 0;
      }
      async recordNewsletterOpen(campaignId, contactId) {
        return void 0;
      }
      async getUnsyncedNewsletterRecipients() {
        return [];
      }
      async getWebinarSettings() {
        return void 0;
      }
      async upsertWebinarSettings(settings) {
        throw new Error("Not implemented in MemStorage");
      }
      async getAllWebinarSessions() {
        return Array.from(this.webinarSessionsMap.values()).sort((a, b) => a.sortOrder - b.sortOrder);
      }
      async createWebinarSession(session2) {
        const id = randomUUID();
        const record = { ...session2, id, createdAt: /* @__PURE__ */ new Date() };
        this.webinarSessionsMap.set(id, record);
        return record;
      }
      async updateWebinarSession(id, session2) {
        const existing = this.webinarSessionsMap.get(id);
        if (!existing) return void 0;
        const updated = { ...existing, ...session2 };
        this.webinarSessionsMap.set(id, updated);
        return updated;
      }
      async deleteWebinarSession(id) {
        return this.webinarSessionsMap.delete(id);
      }
      async getAllCalendarEvents() {
        return Array.from(this.calendarEventsMap.values()).sort((a, b) => a.sortOrder - b.sortOrder);
      }
      async createCalendarEvent(event) {
        const id = randomUUID();
        const record = { ...event, id, createdAt: /* @__PURE__ */ new Date() };
        this.calendarEventsMap.set(id, record);
        return record;
      }
      async updateCalendarEvent(id, event) {
        const existing = this.calendarEventsMap.get(id);
        if (!existing) return void 0;
        const updated = { ...existing, ...event };
        this.calendarEventsMap.set(id, updated);
        return updated;
      }
      async deleteCalendarEvent(id) {
        return this.calendarEventsMap.delete(id);
      }
      async createFlowCheckResult(result) {
        const id = randomUUID();
        const record = {
          id,
          contactId: result.contactId ?? null,
          situation: result.situation,
          customSituation: result.customSituation ?? null,
          role: result.role,
          motivation: result.motivation,
          challenge: result.challenge,
          competence: result.competence,
          zone: result.zone,
          createdAt: /* @__PURE__ */ new Date()
        };
        this.flowCheckResultsMap.set(id, record);
        return record;
      }
      async getAllFlowCheckResults() {
        return Array.from(this.flowCheckResultsMap.values());
      }
      async getAllConnectorStates() {
        return [];
      }
      async getConnectorState(_name) {
        return void 0;
      }
      async upsertConnectorState(name, enabled) {
        return { id: randomUUID(), name, enabled, updatedAt: /* @__PURE__ */ new Date() };
      }
      async isConnectorEnabled(_name) {
        return true;
      }
      async createConnectorToggleLog(log2) {
        return { id: randomUUID(), connectorName: log2.connectorName, action: log2.action, performedBy: log2.performedBy || "admin", createdAt: /* @__PURE__ */ new Date() };
      }
      async getConnectorToggleLogs(_limit) {
        return [];
      }
      async createClientUser(user) {
        const id = randomUUID();
        return { id, email: user.email, name: user.name || null, googleId: user.googleId || null, avatarUrl: user.avatarUrl || null, passwordHash: user.passwordHash || null, twoFactorSecret: null, twoFactorEnabled: "false", resetToken: null, resetTokenExpiry: null, isActive: "true", createdAt: /* @__PURE__ */ new Date(), lastLoginAt: null };
      }
      async getClientUserById(_id) {
        return void 0;
      }
      async getClientUserByEmail(_email) {
        return void 0;
      }
      async getClientUserByGoogleId(_googleId) {
        return void 0;
      }
      async getClientUserByLinkedinSub(_linkedinSub) {
        return void 0;
      }
      async updateClientUser(_id, _data) {
        return void 0;
      }
      async getAllClientUsers() {
        return [];
      }
      async createClientSubscription(sub) {
        return { id: randomUUID(), userId: sub.userId, plan: sub.plan, stripeSubscriptionId: sub.stripeSubscriptionId || null, stripeCustomerId: sub.stripeCustomerId || null, status: sub.status || "active", currentPeriodStart: sub.currentPeriodStart || null, currentPeriodEnd: sub.currentPeriodEnd || null, cancelledAt: null, createdAt: /* @__PURE__ */ new Date() };
      }
      async getClientSubscriptionByUserId(_userId) {
        return void 0;
      }
      async updateClientSubscription(_id, _data) {
        return void 0;
      }
      async getAllClientSubscriptions() {
        return [];
      }
      async getAdminSetting(_key) {
        return void 0;
      }
      async setAdminSetting(key, value) {
        return { key, value, updatedAt: /* @__PURE__ */ new Date() };
      }
      async getAllAdminSettings() {
        return [];
      }
      async getAllTestimonials() {
        return [];
      }
      async getVisibleTestimonials() {
        return [];
      }
      async createTestimonial(_t) {
        return {};
      }
      async updateTestimonial(_id, _t) {
        return void 0;
      }
      async deleteTestimonial(_id) {
        return false;
      }
      async createAdminUser(_u) {
        return {};
      }
      async getAdminUserById(_id) {
        return void 0;
      }
      async getAdminUserByEmail(_email) {
        return void 0;
      }
      async getAdminUserByGoogleId(_gid) {
        return void 0;
      }
      async updateAdminUser(_id, _data) {
        return void 0;
      }
      async getAllAdminUsers() {
        return [];
      }
      async deleteAdminUser(_id) {
        return false;
      }
      async createAuditLog(_log) {
        return {};
      }
      async getAuditLogs(_limit, _offset, _filters) {
        return [];
      }
      async getAuditLogsByUser(_email) {
        return [];
      }
      async getAuditLogCount(_filters) {
        return 0;
      }
      portalTimelineEvents = /* @__PURE__ */ new Map();
      async createPortalTimelineEvent(event) {
        const id = randomUUID();
        const created = { ...event, id, createdAt: /* @__PURE__ */ new Date(), date: event.date || /* @__PURE__ */ new Date(), description: event.description ?? null, details: event.details ?? null, lens: event.lens ?? null, toolId: event.toolId ?? null };
        this.portalTimelineEvents.set(id, created);
        return created;
      }
      async getPortalTimelineEvents(userId) {
        return Array.from(this.portalTimelineEvents.values()).filter((e) => e.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
      async deletePortalTimelineEvent(id, userId) {
        const event = this.portalTimelineEvents.get(id);
        if (event && event.userId === userId) {
          this.portalTimelineEvents.delete(id);
          return true;
        }
        return false;
      }
      async deleteAllPortalTimelineEvents(userId) {
        let count = 0;
        for (const [id, event] of this.portalTimelineEvents.entries()) {
          if (event.userId === userId) {
            this.portalTimelineEvents.delete(id);
            count++;
          }
        }
        return count;
      }
      portalUserContextMap = /* @__PURE__ */ new Map();
      async getPortalUserContext(userId) {
        return Array.from(this.portalUserContextMap.values()).filter((c) => c.userId === userId);
      }
      async setPortalUserContext(userId, key, value) {
        const existing = Array.from(this.portalUserContextMap.values()).find((c) => c.userId === userId && c.key === key);
        if (existing) {
          existing.value = value;
          existing.updatedAt = /* @__PURE__ */ new Date();
          this.portalUserContextMap.set(existing.id, existing);
          return existing;
        }
        const id = randomUUID();
        const created = { id, userId, key, value, updatedAt: /* @__PURE__ */ new Date() };
        this.portalUserContextMap.set(id, created);
        return created;
      }
      async getPortalUserContextByKey(userId, key) {
        return Array.from(this.portalUserContextMap.values()).find((c) => c.userId === userId && c.key === key);
      }
      async deleteAllPortalUserContext(userId) {
        let count = 0;
        for (const [id, ctx] of this.portalUserContextMap.entries()) {
          if (ctx.userId === userId) {
            this.portalUserContextMap.delete(id);
            count++;
          }
        }
        return count;
      }
      qrCodesMap = /* @__PURE__ */ new Map();
      qrScansMap = /* @__PURE__ */ new Map();
      async createQrCode(qrCode) {
        const id = randomUUID();
        const created = { id, ...qrCode, description: qrCode.description ?? null, type: qrCode.type ?? "campaign", isActive: qrCode.isActive ?? "true", createdAt: /* @__PURE__ */ new Date() };
        this.qrCodesMap.set(id, created);
        return created;
      }
      async getQrCodeById(id) {
        return this.qrCodesMap.get(id);
      }
      async getQrCodeBySlug(slug) {
        return Array.from(this.qrCodesMap.values()).find((q) => q.slug === slug);
      }
      async getAllQrCodes() {
        return Array.from(this.qrCodesMap.values());
      }
      async updateQrCode(id, updates) {
        const existing = this.qrCodesMap.get(id);
        if (!existing) return void 0;
        const updated = { ...existing, ...updates };
        this.qrCodesMap.set(id, updated);
        return updated;
      }
      async deleteQrCode(id) {
        return this.qrCodesMap.delete(id);
      }
      async createQrScan(scan) {
        const id = randomUUID();
        const created = { id, ...scan, ipAddress: scan.ipAddress ?? null, userAgent: scan.userAgent ?? null, referer: scan.referer ?? null, country: scan.country ?? null, city: scan.city ?? null, region: scan.region ?? null, latitude: scan.latitude ?? null, longitude: scan.longitude ?? null, isp: scan.isp ?? null, deviceType: scan.deviceType ?? null, consentAcknowledged: scan.consentAcknowledged ?? "false", scannedAt: /* @__PURE__ */ new Date() };
        this.qrScansMap.set(id, created);
        return created;
      }
      async getQrScansByCodeId(qrCodeId) {
        return Array.from(this.qrScansMap.values()).filter((s) => s.qrCodeId === qrCodeId);
      }
      async getQrScanCount(qrCodeId) {
        return Array.from(this.qrScansMap.values()).filter((s) => s.qrCodeId === qrCodeId).length;
      }
      async getAllQrScans(limit) {
        const all = Array.from(this.qrScansMap.values()).sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime());
        return limit ? all.slice(0, limit) : all;
      }
      async deleteQrScansByCodeId(qrCodeId) {
        let count = 0;
        for (const [id, scan] of this.qrScansMap.entries()) {
          if (scan.qrCodeId === qrCodeId) {
            this.qrScansMap.delete(id);
            count++;
          }
        }
        return count;
      }
      coachingDebriefsMap = /* @__PURE__ */ new Map();
      async createCoachingDebrief(debrief) {
        const id = randomUUID();
        const created = { id, clientName: debrief.clientName, sessionNumber: debrief.sessionNumber ?? 1, lens: debrief.lens ?? null, keyInsights: debrief.keyInsights ?? null, actionItems: debrief.actionItems ?? null, coachNotes: debrief.coachNotes ?? null, progress: debrief.progress ?? 3, status: debrief.status ?? "draft", createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() };
        this.coachingDebriefsMap.set(id, created);
        return created;
      }
      async getAllCoachingDebriefs() {
        return Array.from(this.coachingDebriefsMap.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      async updateCoachingDebrief(id, updates) {
        const existing = this.coachingDebriefsMap.get(id);
        if (!existing) return void 0;
        const updated = { ...existing, ...updates, updatedAt: /* @__PURE__ */ new Date() };
        this.coachingDebriefsMap.set(id, updated);
        return updated;
      }
      async deleteCoachingDebrief(id) {
        return this.coachingDebriefsMap.delete(id);
      }
    };
    DatabaseStorage = class {
      async getUser(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
        return user;
      }
      async getUserByUsername(username) {
        const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
        return user;
      }
      async createUser(insertUser) {
        const [user] = await db.insert(users).values(insertUser).returning();
        return user;
      }
      async createRecommendationSubmission(insertSubmission) {
        const [submission] = await db.insert(recommendationSubmissions).values(insertSubmission).returning();
        console.log(`\u2713 Recommendation submission stored: ${insertSubmission.name} \u2192 ${insertSubmission.recommendedPath}`);
        return submission;
      }
      async getAllRecommendationSubmissions() {
        return await db.select().from(recommendationSubmissions);
      }
      async createContact(insertContact) {
        const [contact] = await db.insert(contacts).values(insertContact).returning();
        console.log(`\u2713 Contact created: ${insertContact.email} (${insertContact.source})`);
        return contact;
      }
      async getContactByEmail(email) {
        const [contact] = await db.select().from(contacts).where(eq(contacts.email, email)).limit(1);
        return contact;
      }
      async getAllContacts() {
        return await db.select().from(contacts);
      }
      async addChannelToContact(email, channel) {
        const contact = await this.getContactByEmail(email);
        if (!contact) return void 0;
        const currentChannels = contact.channelsReached || [];
        if (!currentChannels.includes(channel)) {
          const [updated] = await db.update(contacts).set({ channelsReached: [...currentChannels, channel] }).where(eq(contacts.email, email)).returning();
          console.log(`\u2713 Added channel '${channel}' to contact: ${email}`);
          return updated;
        }
        return contact;
      }
      async getContactsByChannel(channel) {
        const allContacts = await db.select().from(contacts);
        return allContacts.filter((contact) => contact.channelsReached?.includes(channel));
      }
      async getContactsWithoutChannel(channel) {
        const allContacts = await db.select().from(contacts);
        return allContacts.filter((contact) => !contact.channelsReached?.includes(channel));
      }
      async updateScanSubmittedAt(email, submittedAt) {
        const [contact] = await db.update(contacts).set({ scanSubmittedAt: submittedAt }).where(eq(contacts.email, email)).returning();
        if (contact) {
          console.log(`\u2713 Updated scan submitted date for: ${email}`);
        }
        return contact;
      }
      async createWaitlistEntry(insertEntry) {
        const [entry] = await db.insert(waitlistEntries).values(insertEntry).returning();
        console.log(`\u2713 Waitlist entry created: ${insertEntry.contactId}`);
        return entry;
      }
      async getAllWaitlistEntries() {
        return await db.select().from(waitlistEntries);
      }
      async createWebinarWaitlistEntry(insertEntry) {
        const [entry] = await db.insert(webinarWaitlistEntries).values(insertEntry).returning();
        console.log(`\u2713 Webinar waitlist entry created: ${insertEntry.contactId}`);
        return entry;
      }
      async getAllWebinarWaitlistEntries() {
        return await db.select().from(webinarWaitlistEntries);
      }
      async createNewsletterSubscription(insertSubscription) {
        const [subscription] = await db.insert(newsletterSubscriptions).values(insertSubscription).returning();
        console.log(`\u2713 Newsletter subscription created: ${insertSubscription.contactId}`);
        return subscription;
      }
      async getAllNewsletterSubscriptions() {
        return await db.select().from(newsletterSubscriptions);
      }
      async createSignalsQuizResult(insertResult) {
        const [result] = await db.insert(signalsQuizResults).values({
          contactId: insertResult.contactId || null,
          score: insertResult.score.toString(),
          answers: insertResult.answers
        }).returning();
        console.log(`\u2713 Signals quiz result stored: score ${insertResult.score}`);
        return result;
      }
      async getQuizAverageScore() {
        const results = await db.select().from(signalsQuizResults);
        if (results.length === 0) {
          return 0;
        }
        const validScores = results.map((result) => parseFloat(result.score)).filter((score) => !isNaN(score) && isFinite(score));
        if (validScores.length === 0) {
          return 0;
        }
        const total = validScores.reduce((sum, score) => sum + score, 0);
        return Math.round(total / validScores.length);
      }
      async getAllSignalsQuizResults() {
        return await db.select().from(signalsQuizResults);
      }
      async createPurchase(insertPurchase) {
        const [purchase] = await db.insert(purchases).values(insertPurchase).returning();
        console.log(`\u2713 Purchase created: ${insertPurchase.customerEmail} \u2192 ${insertPurchase.packageName} (\u20AC${insertPurchase.amount})`);
        return purchase;
      }
      async getPurchaseByPaymentIntent(paymentIntentId) {
        const [purchase] = await db.select().from(purchases).where(eq(purchases.stripePaymentIntentId, paymentIntentId)).limit(1);
        return purchase;
      }
      async getAllPurchases() {
        return await db.select().from(purchases);
      }
      // Contact message methods
      async createContactMessage(insertMessage) {
        const [message] = await db.insert(contactMessages).values(insertMessage).returning();
        console.log(`\u2713 Contact message created: ${insertMessage.name} (${insertMessage.email})`);
        return message;
      }
      async getAllContactMessages() {
        return await db.select().from(contactMessages);
      }
      // Satellite Scan purchase methods
      async createSatellitescanPurchase(insertPurchase) {
        const [purchase] = await db.insert(satellitescanPurchases).values(insertPurchase).returning();
        console.log(`\u2713 Satellitescan purchase created: ${insertPurchase.customerEmail} (\u20AC${insertPurchase.amount})`);
        return purchase;
      }
      async getSatellitescanPurchaseByPaymentIntent(paymentIntentId) {
        const [purchase] = await db.select().from(satellitescanPurchases).where(eq(satellitescanPurchases.stripePaymentIntentId, paymentIntentId)).limit(1);
        return purchase;
      }
      async getAllSatellitescanPurchases() {
        return await db.select().from(satellitescanPurchases);
      }
      async getSatellitescanPurchasesByEmail(email) {
        const normalizedEmail = email.toLowerCase().trim();
        return await db.select().from(satellitescanPurchases).where(sql2`LOWER(${satellitescanPurchases.customerEmail}) = ${normalizedEmail}`);
      }
      async getOverdueSatellitescanPurchases(hoursThreshold) {
        const thresholdDate = new Date(Date.now() - hoursThreshold * 60 * 60 * 1e3);
        return await db.select().from(satellitescanPurchases).where(
          and(
            eq(satellitescanPurchases.typeformCompleted, "false"),
            eq(satellitescanPurchases.remindersCount, "0"),
            lt(satellitescanPurchases.createdAt, thresholdDate)
          )
        );
      }
      async updateSatellitescanReminderCount(purchaseId, count) {
        await db.update(satellitescanPurchases).set({ remindersCount: count.toString() }).where(eq(satellitescanPurchases.id, purchaseId));
      }
      async markTypeformCompletedByEmail(email) {
        const normalizedEmail = email.toLowerCase().trim();
        const result = await db.update(satellitescanPurchases).set({
          typeformCompleted: "true",
          typeformCompletedAt: /* @__PURE__ */ new Date()
          // Track actual completion time for Fibonacci email scheduling
        }).where(
          and(
            sql2`LOWER(${satellitescanPurchases.customerEmail}) = ${normalizedEmail}`,
            eq(satellitescanPurchases.typeformCompleted, "false")
          )
        ).returning();
        return result.length;
      }
      async updateSatellitescanRole(email, role) {
        const normalizedEmail = email.toLowerCase().trim();
        await db.update(satellitescanPurchases).set({ role }).where(sql2`LOWER(${satellitescanPurchases.customerEmail}) = ${normalizedEmail}`);
      }
      // Coupon methods
      async getCouponByCode(code) {
        const [coupon] = await db.select().from(coupons).where(eq(coupons.code, code.toUpperCase())).limit(1);
        return coupon;
      }
      async createCoupon(insertCoupon) {
        const [coupon] = await db.insert(coupons).values({
          code: insertCoupon.code.toUpperCase(),
          discountAmount: insertCoupon.discountAmount,
          category: insertCoupon.category,
          isActive: insertCoupon.isActive || "true",
          maxUses: insertCoupon.maxUses || null,
          usedCount: "0"
        }).returning();
        console.log(`\u2713 Coupon created: ${coupon.code} (${coupon.category})`);
        return coupon;
      }
      async getAllCoupons() {
        return await db.select().from(coupons);
      }
      async updateCoupon(code, updates) {
        const [coupon] = await db.update(coupons).set(updates).where(eq(coupons.code, code.toUpperCase())).returning();
        return coupon;
      }
      async deleteCoupon(code) {
        await db.delete(coupons).where(eq(coupons.code, code.toUpperCase()));
      }
      async incrementCouponUsage(couponId) {
        const coupon = await db.select().from(coupons).where(eq(coupons.id, couponId)).limit(1);
        if (coupon.length > 0) {
          const newCount = (parseInt(coupon[0].usedCount) + 1).toString();
          await db.update(coupons).set({ usedCount: newCount }).where(eq(coupons.id, couponId));
        }
      }
      // Prompt methods
      async createPrompt(insertPrompt) {
        const [prompt] = await db.insert(prompts).values({
          lensType: insertPrompt.lensType,
          title: insertPrompt.title,
          description: insertPrompt.description,
          whatItDoes: insertPrompt.whatItDoes,
          perfectFor: insertPrompt.perfectFor,
          promptContent: insertPrompt.promptContent,
          roleCategory: insertPrompt.roleCategory,
          isActive: insertPrompt.isActive || "true",
          votes: "0"
        }).returning();
        console.log(`\u2713 Prompt created: ${prompt.title} (${prompt.lensType})`);
        return prompt;
      }
      async getPromptById(id) {
        const [prompt] = await db.select().from(prompts).where(eq(prompts.id, id)).limit(1);
        return prompt;
      }
      async getAllPrompts() {
        return await db.select().from(prompts);
      }
      async getActivePrompts() {
        return await db.select().from(prompts).where(eq(prompts.isActive, "true"));
      }
      async getPromptsByLens(lensType) {
        return await db.select().from(prompts).where(and(eq(prompts.lensType, lensType), eq(prompts.isActive, "true")));
      }
      async getPromptsByRole(roleCategory) {
        return await db.select().from(prompts).where(and(eq(prompts.roleCategory, roleCategory), eq(prompts.isActive, "true")));
      }
      async updatePrompt(id, updateData) {
        const [prompt] = await db.update(prompts).set({ ...updateData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(prompts.id, id)).returning();
        if (prompt) {
          console.log(`\u2713 Prompt updated: ${prompt.title}`);
        }
        return prompt;
      }
      async deletePrompt(id) {
        const result = await db.delete(prompts).where(eq(prompts.id, id)).returning();
        if (result.length > 0) {
          console.log(`\u2713 Prompt deleted: ${result[0].title}`);
          return true;
        }
        return false;
      }
      async upvotePrompt(id) {
        const [existing] = await db.select().from(prompts).where(eq(prompts.id, id)).limit(1);
        if (!existing) return void 0;
        const newVotes = (parseInt(existing.votes) + 1).toString();
        const [prompt] = await db.update(prompts).set({ votes: newVotes }).where(eq(prompts.id, id)).returning();
        return prompt;
      }
      // Email verification methods
      async createEmailVerification(email, code) {
        const expiresAt = new Date(Date.now() + 10 * 60 * 1e3);
        const [verification] = await db.insert(emailVerifications).values({
          email,
          code,
          expiresAt
        }).returning();
        console.log(`\u2713 Email verification created for: ${email}`);
        return verification;
      }
      async getEmailVerification(email, code) {
        const [verification] = await db.select().from(emailVerifications).where(and(
          eq(emailVerifications.email, email),
          eq(emailVerifications.code, code),
          eq(emailVerifications.verified, "false")
        )).limit(1);
        if (verification && new Date(verification.expiresAt) > /* @__PURE__ */ new Date()) {
          return verification;
        }
        return void 0;
      }
      async markEmailVerified(email) {
        await db.update(emailVerifications).set({ verified: "true" }).where(eq(emailVerifications.email, email));
        console.log(`\u2713 Email verified: ${email}`);
      }
      async cleanupExpiredVerifications() {
        await db.delete(emailVerifications).where(lt(emailVerifications.expiresAt, /* @__PURE__ */ new Date()));
      }
      // Onboarding email template methods
      async createOnboardingEmailTemplate(template) {
        const [result] = await db.insert(onboardingEmailTemplates).values(template).returning();
        console.log(`\u2713 Onboarding email template created: ${template.title}`);
        return result;
      }
      async getOnboardingEmailTemplateById(id) {
        const [template] = await db.select().from(onboardingEmailTemplates).where(eq(onboardingEmailTemplates.id, id)).limit(1);
        return template;
      }
      async getOnboardingEmailTemplateBySequence(sequenceNumber) {
        const [template] = await db.select().from(onboardingEmailTemplates).where(eq(onboardingEmailTemplates.sequenceNumber, sequenceNumber)).limit(1);
        return template;
      }
      async getAllOnboardingEmailTemplates() {
        return await db.select().from(onboardingEmailTemplates);
      }
      async getActiveOnboardingEmailTemplates() {
        return await db.select().from(onboardingEmailTemplates).where(eq(onboardingEmailTemplates.isActive, "true"));
      }
      async getOnboardingEmailTemplatesByTrigger(triggerEvent) {
        return await db.select().from(onboardingEmailTemplates).where(and(eq(onboardingEmailTemplates.triggerEvent, triggerEvent), eq(onboardingEmailTemplates.isActive, "true")));
      }
      async updateOnboardingEmailTemplate(id, updateData) {
        const [template] = await db.update(onboardingEmailTemplates).set({ ...updateData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(onboardingEmailTemplates.id, id)).returning();
        if (template) {
          console.log(`\u2713 Onboarding email template updated: ${template.title}`);
        }
        return template;
      }
      async deleteOnboardingEmailTemplate(id) {
        const result = await db.delete(onboardingEmailTemplates).where(eq(onboardingEmailTemplates.id, id)).returning();
        if (result.length > 0) {
          console.log(`\u2713 Onboarding email template deleted: ${result[0].title}`);
          return true;
        }
        return false;
      }
      // Onboarding email log methods
      async createOnboardingEmailLog(log2) {
        const [result] = await db.insert(onboardingEmailLogs).values(log2).returning();
        console.log(`\u2713 Onboarding email log created: ${log2.customerEmail} - sequence ${log2.sequenceNumber}`);
        return result;
      }
      async getOnboardingEmailLogsByCustomer(customerEmail) {
        return await db.select().from(onboardingEmailLogs).where(eq(onboardingEmailLogs.customerEmail, customerEmail));
      }
      async getLastSentEmailForCustomer(customerEmail) {
        const logs = await db.select().from(onboardingEmailLogs).where(and(
          eq(onboardingEmailLogs.customerEmail, customerEmail),
          eq(onboardingEmailLogs.status, "sent")
        ));
        if (logs.length === 0) return void 0;
        return logs.reduce(
          (max, log2) => parseInt(log2.sequenceNumber) > parseInt(max.sequenceNumber) ? log2 : max
        );
      }
      async hasEmailBeenSent(customerEmail, sequenceNumber) {
        const [log2] = await db.select().from(onboardingEmailLogs).where(and(
          eq(onboardingEmailLogs.customerEmail, customerEmail),
          eq(onboardingEmailLogs.sequenceNumber, sequenceNumber),
          eq(onboardingEmailLogs.status, "sent")
        )).limit(1);
        return !!log2;
      }
      async getAllOnboardingEmailLogs() {
        return await db.select().from(onboardingEmailLogs);
      }
      async getCustomersDueForEmail(triggerEvent, sequenceNumber) {
        return [];
      }
      // Batch email methods
      async getContactsWithFilters(includeChannels, excludeChannels) {
        let allContacts = await db.select().from(contacts);
        if (includeChannels && includeChannels.length > 0) {
          allContacts = allContacts.filter(
            (c) => c.channelsReached && includeChannels.some((ch) => c.channelsReached.includes(ch))
          );
        }
        if (excludeChannels && excludeChannels.length > 0) {
          allContacts = allContacts.filter(
            (c) => !c.channelsReached || !excludeChannels.some((ch) => c.channelsReached.includes(ch))
          );
        }
        return allContacts;
      }
      async createBatchEmailSend(data) {
        const [result] = await db.insert(batchEmailSends).values(data).returning();
        console.log(`\u2713 Batch email send created: "${data.subject}" to ${data.recipientCount} recipients`);
        return result;
      }
      async updateBatchEmailSend(id, data) {
        const [result] = await db.update(batchEmailSends).set(data).where(eq(batchEmailSends.id, id)).returning();
        return result;
      }
      async getAllBatchEmailSends() {
        return await db.select().from(batchEmailSends);
      }
      async getBatchEmailSendById(id) {
        const [result] = await db.select().from(batchEmailSends).where(eq(batchEmailSends.id, id)).limit(1);
        return result;
      }
      async createBatchEmailRecipient(data) {
        const [result] = await db.insert(batchEmailRecipients).values(data).returning();
        return result;
      }
      async updateBatchEmailRecipient(id, data) {
        const [result] = await db.update(batchEmailRecipients).set(data).where(eq(batchEmailRecipients.id, id)).returning();
        return result;
      }
      async getBatchEmailRecipientsByBatchId(batchId) {
        return await db.select().from(batchEmailRecipients).where(eq(batchEmailRecipients.batchId, batchId));
      }
      // Newsletter campaign methods
      async createNewsletterCampaign(data) {
        const [result] = await db.insert(newsletterCampaigns).values(data).returning();
        console.log(`\u2713 Newsletter campaign created: "${data.name}"`);
        return result;
      }
      async getNewsletterCampaignById(id) {
        const [result] = await db.select().from(newsletterCampaigns).where(eq(newsletterCampaigns.id, id)).limit(1);
        return result;
      }
      async getAllNewsletterCampaigns() {
        return await db.select().from(newsletterCampaigns);
      }
      async updateNewsletterCampaign(id, data) {
        const [result] = await db.update(newsletterCampaigns).set(data).where(eq(newsletterCampaigns.id, id)).returning();
        return result;
      }
      async deleteNewsletterCampaign(id) {
        const result = await db.delete(newsletterCampaigns).where(eq(newsletterCampaigns.id, id));
        return true;
      }
      // Newsletter recipient methods
      async createNewsletterRecipient(data) {
        const [result] = await db.insert(newsletterRecipients).values(data).returning();
        return result;
      }
      async getNewsletterRecipientsByCampaign(campaignId) {
        return await db.select().from(newsletterRecipients).where(eq(newsletterRecipients.campaignId, campaignId));
      }
      async updateNewsletterRecipient(id, data) {
        const [result] = await db.update(newsletterRecipients).set(data).where(eq(newsletterRecipients.id, id)).returning();
        return result;
      }
      async getNewsletterRecipientByTracking(campaignId, contactId) {
        const [result] = await db.select().from(newsletterRecipients).where(and(
          eq(newsletterRecipients.campaignId, campaignId),
          eq(newsletterRecipients.contactId, contactId)
        )).limit(1);
        return result;
      }
      async recordNewsletterOpen(campaignId, contactId) {
        const existing = await this.getNewsletterRecipientByTracking(campaignId, contactId);
        if (!existing) return void 0;
        const currentCount = parseInt(existing.openCount) || 0;
        const [result] = await db.update(newsletterRecipients).set({
          openedAt: existing.openedAt || /* @__PURE__ */ new Date(),
          openCount: String(currentCount + 1)
        }).where(eq(newsletterRecipients.id, existing.id)).returning();
        console.log(`\u{1F4E7} Newsletter opened: campaign=${campaignId}, contact=${contactId}, count=${currentCount + 1}`);
        return result;
      }
      async getUnsyncedNewsletterRecipients() {
        return await db.select().from(newsletterRecipients).where(and(
          eq(newsletterRecipients.status, "sent"),
          eq(newsletterRecipients.notionSynced, "false")
        ));
      }
      async getWebinarSettings() {
        const [result] = await db.select().from(webinarSettings).limit(1);
        return result;
      }
      async upsertWebinarSettings(settings) {
        const existing = await this.getWebinarSettings();
        const deadline = typeof settings.countdownDeadline === "string" ? new Date(settings.countdownDeadline) : settings.countdownDeadline;
        if (existing) {
          const [result] = await db.update(webinarSettings).set({
            countdownDeadline: deadline,
            hostNames: settings.hostNames,
            bonusDescription: settings.bonusDescription,
            sessionTitle: settings.sessionTitle,
            sessionSubtitle: settings.sessionSubtitle,
            sessionDuration: settings.sessionDuration,
            ctaButtonText: settings.ctaButtonText ?? null,
            ctaButtonTextExpired: settings.ctaButtonTextExpired ?? null,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(webinarSettings.id, existing.id)).returning();
          return result;
        } else {
          const [result] = await db.insert(webinarSettings).values({
            countdownDeadline: deadline,
            hostNames: settings.hostNames,
            bonusDescription: settings.bonusDescription,
            sessionTitle: settings.sessionTitle,
            sessionSubtitle: settings.sessionSubtitle,
            sessionDuration: settings.sessionDuration,
            ctaButtonText: settings.ctaButtonText ?? null,
            ctaButtonTextExpired: settings.ctaButtonTextExpired ?? null
          }).returning();
          return result;
        }
      }
      async getAllWebinarSessions() {
        return await db.select().from(webinarSessions).orderBy(webinarSessions.sortOrder, webinarSessions.createdAt);
      }
      async createWebinarSession(session2) {
        const [record] = await db.insert(webinarSessions).values(session2).returning();
        return record;
      }
      async updateWebinarSession(id, session2) {
        const [record] = await db.update(webinarSessions).set(session2).where(eq(webinarSessions.id, id)).returning();
        return record;
      }
      async deleteWebinarSession(id) {
        const result = await db.delete(webinarSessions).where(eq(webinarSessions.id, id)).returning();
        return result.length > 0;
      }
      async getAllCalendarEvents() {
        return await db.select().from(calendarEvents).orderBy(calendarEvents.sortOrder, calendarEvents.createdAt);
      }
      async createCalendarEvent(event) {
        const [record] = await db.insert(calendarEvents).values(event).returning();
        return record;
      }
      async updateCalendarEvent(id, event) {
        const [record] = await db.update(calendarEvents).set(event).where(eq(calendarEvents.id, id)).returning();
        return record;
      }
      async deleteCalendarEvent(id) {
        const result = await db.delete(calendarEvents).where(eq(calendarEvents.id, id)).returning();
        return result.length > 0;
      }
      async createFlowCheckResult(result) {
        const [record] = await db.insert(flowCheckResults).values({
          contactId: result.contactId ?? null,
          situation: result.situation,
          customSituation: result.customSituation ?? null,
          role: result.role,
          motivation: result.motivation,
          challenge: result.challenge,
          competence: result.competence,
          zone: result.zone
        }).returning();
        return record;
      }
      async getAllFlowCheckResults() {
        return await db.select().from(flowCheckResults).orderBy(flowCheckResults.createdAt);
      }
      async getAllConnectorStates() {
        return await db.select().from(connectorStates).orderBy(connectorStates.name);
      }
      async getConnectorState(name) {
        const [record] = await db.select().from(connectorStates).where(eq(connectorStates.name, name)).limit(1);
        return record;
      }
      async upsertConnectorState(name, enabled) {
        const existing = await this.getConnectorState(name);
        if (existing) {
          const [record2] = await db.update(connectorStates).set({ enabled, updatedAt: /* @__PURE__ */ new Date() }).where(eq(connectorStates.name, name)).returning();
          return record2;
        }
        const [record] = await db.insert(connectorStates).values({ name, enabled }).returning();
        return record;
      }
      async isConnectorEnabled(name) {
        const state = await this.getConnectorState(name);
        if (!state) return true;
        return state.enabled === "true";
      }
      async createConnectorToggleLog(log2) {
        const [record] = await db.insert(connectorToggleLogs).values(log2).returning();
        return record;
      }
      async getConnectorToggleLogs(limit) {
        const query = db.select().from(connectorToggleLogs).orderBy(sql2`${connectorToggleLogs.createdAt} DESC`);
        if (limit) {
          return await query.limit(limit);
        }
        return await query;
      }
      async createClientUser(user) {
        const [record] = await db.insert(clientUsers).values(user).returning();
        return record;
      }
      async getClientUserById(id) {
        const [record] = await db.select().from(clientUsers).where(eq(clientUsers.id, id)).limit(1);
        return record;
      }
      async getClientUserByEmail(email) {
        const [record] = await db.select().from(clientUsers).where(eq(clientUsers.email, email.toLowerCase().trim())).limit(1);
        return record;
      }
      async getClientUserByGoogleId(googleId) {
        const [record] = await db.select().from(clientUsers).where(eq(clientUsers.googleId, googleId)).limit(1);
        return record;
      }
      async getClientUserByLinkedinSub(linkedinSub) {
        const [record] = await db.select().from(clientUsers).where(eq(clientUsers.linkedinSub, linkedinSub)).limit(1);
        return record;
      }
      async updateClientUser(id, data) {
        const [record] = await db.update(clientUsers).set(data).where(eq(clientUsers.id, id)).returning();
        return record;
      }
      async getAllClientUsers() {
        return await db.select().from(clientUsers).orderBy(sql2`${clientUsers.createdAt} DESC`);
      }
      async createClientSubscription(sub) {
        const [record] = await db.insert(clientSubscriptions).values(sub).returning();
        return record;
      }
      async getClientSubscriptionByUserId(userId) {
        const [record] = await db.select().from(clientSubscriptions).where(eq(clientSubscriptions.userId, userId)).orderBy(sql2`${clientSubscriptions.createdAt} DESC`).limit(1);
        return record;
      }
      async updateClientSubscription(id, data) {
        const [record] = await db.update(clientSubscriptions).set(data).where(eq(clientSubscriptions.id, id)).returning();
        return record;
      }
      async getAllClientSubscriptions() {
        return await db.select().from(clientSubscriptions).orderBy(sql2`${clientSubscriptions.createdAt} DESC`);
      }
      async getAdminSetting(key) {
        const [record] = await db.select().from(adminSettings).where(eq(adminSettings.key, key)).limit(1);
        return record?.value;
      }
      async setAdminSetting(key, value) {
        const existing = await this.getAdminSetting(key);
        if (existing !== void 0) {
          const [record2] = await db.update(adminSettings).set({ value, updatedAt: /* @__PURE__ */ new Date() }).where(eq(adminSettings.key, key)).returning();
          return record2;
        }
        const [record] = await db.insert(adminSettings).values({ key, value }).returning();
        return record;
      }
      async getAllAdminSettings() {
        return await db.select().from(adminSettings);
      }
      async getAllTestimonials() {
        return await db.select().from(testimonials).orderBy(testimonials.sortOrder);
      }
      async getVisibleTestimonials() {
        return await db.select().from(testimonials).where(and(eq(testimonials.visible, "true"), eq(testimonials.consentGiven, "true"))).orderBy(testimonials.sortOrder);
      }
      async createTestimonial(testimonial) {
        const [record] = await db.insert(testimonials).values(testimonial).returning();
        return record;
      }
      async updateTestimonial(id, data) {
        const [record] = await db.update(testimonials).set(data).where(eq(testimonials.id, id)).returning();
        return record;
      }
      async deleteTestimonial(id) {
        const result = await db.delete(testimonials).where(eq(testimonials.id, id)).returning();
        return result.length > 0;
      }
      async createAdminUser(user) {
        const [record] = await db.insert(adminUsers).values(user).returning();
        return record;
      }
      async getAdminUserById(id) {
        const [record] = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
        return record;
      }
      async getAdminUserByEmail(email) {
        const [record] = await db.select().from(adminUsers).where(eq(adminUsers.email, email.toLowerCase())).limit(1);
        return record;
      }
      async getAdminUserByGoogleId(googleId) {
        const [record] = await db.select().from(adminUsers).where(eq(adminUsers.googleId, googleId)).limit(1);
        return record;
      }
      async updateAdminUser(id, data) {
        const [record] = await db.update(adminUsers).set(data).where(eq(adminUsers.id, id)).returning();
        return record;
      }
      async getAllAdminUsers() {
        return await db.select().from(adminUsers).orderBy(adminUsers.createdAt);
      }
      async deleteAdminUser(id) {
        const result = await db.delete(adminUsers).where(eq(adminUsers.id, id)).returning();
        return result.length > 0;
      }
      async createAuditLog(log2) {
        const [record] = await db.insert(auditLogs).values(log2).returning();
        return record;
      }
      async getAuditLogs(limit = 100, offset = 0, filters) {
        const conditions = [];
        if (filters?.userEmail) {
          conditions.push(eq(auditLogs.userEmail, filters.userEmail));
        }
        if (filters?.actionType) {
          conditions.push(sql2`${auditLogs.actionType} ILIKE ${"%" + filters.actionType + "%"}`);
        }
        const query = db.select().from(auditLogs);
        if (conditions.length > 0) {
          return await query.where(and(...conditions)).orderBy(desc(auditLogs.createdAt)).limit(limit).offset(offset);
        }
        return await query.orderBy(desc(auditLogs.createdAt)).limit(limit).offset(offset);
      }
      async getAuditLogsByUser(email) {
        return await db.select().from(auditLogs).where(eq(auditLogs.userEmail, email)).orderBy(desc(auditLogs.createdAt));
      }
      async getAuditLogCount(filters) {
        const conditions = [];
        if (filters?.userEmail) {
          conditions.push(eq(auditLogs.userEmail, filters.userEmail));
        }
        if (filters?.actionType) {
          conditions.push(sql2`${auditLogs.actionType} ILIKE ${"%" + filters.actionType + "%"}`);
        }
        const query = db.select({ count: sql2`count(*)` }).from(auditLogs);
        if (conditions.length > 0) {
          const [result2] = await query.where(and(...conditions));
          return Number(result2?.count || 0);
        }
        const [result] = await query;
        return Number(result?.count || 0);
      }
      async createPortalTimelineEvent(event) {
        const [created] = await db.insert(portalTimelineEvents).values(event).returning();
        return created;
      }
      async getPortalTimelineEvents(userId) {
        return db.select().from(portalTimelineEvents).where(eq(portalTimelineEvents.userId, userId)).orderBy(desc(portalTimelineEvents.date));
      }
      async deletePortalTimelineEvent(id, userId) {
        const result = await db.delete(portalTimelineEvents).where(and(eq(portalTimelineEvents.id, id), eq(portalTimelineEvents.userId, userId))).returning();
        return result.length > 0;
      }
      async deleteAllPortalTimelineEvents(userId) {
        const result = await db.delete(portalTimelineEvents).where(eq(portalTimelineEvents.userId, userId)).returning();
        return result.length;
      }
      async getPortalUserContext(userId) {
        return db.select().from(portalUserContext).where(eq(portalUserContext.userId, userId));
      }
      async setPortalUserContext(userId, key, value) {
        const existing = await this.getPortalUserContextByKey(userId, key);
        if (existing) {
          const [updated] = await db.update(portalUserContext).set({ value, updatedAt: /* @__PURE__ */ new Date() }).where(eq(portalUserContext.id, existing.id)).returning();
          return updated;
        }
        const [created] = await db.insert(portalUserContext).values({ userId, key, value }).returning();
        return created;
      }
      async getPortalUserContextByKey(userId, key) {
        const [result] = await db.select().from(portalUserContext).where(and(eq(portalUserContext.userId, userId), eq(portalUserContext.key, key))).limit(1);
        return result;
      }
      async deleteAllPortalUserContext(userId) {
        const result = await db.delete(portalUserContext).where(eq(portalUserContext.userId, userId)).returning();
        return result.length;
      }
      async createQrCode(qrCode) {
        const [created] = await db.insert(qrCodes).values(qrCode).returning();
        return created;
      }
      async getQrCodeById(id) {
        const [qr] = await db.select().from(qrCodes).where(eq(qrCodes.id, id)).limit(1);
        return qr;
      }
      async getQrCodeBySlug(slug) {
        const [qr] = await db.select().from(qrCodes).where(eq(qrCodes.slug, slug)).limit(1);
        return qr;
      }
      async getAllQrCodes() {
        return db.select().from(qrCodes).orderBy(desc(qrCodes.createdAt));
      }
      async updateQrCode(id, updates) {
        const [updated] = await db.update(qrCodes).set(updates).where(eq(qrCodes.id, id)).returning();
        return updated;
      }
      async deleteQrCode(id) {
        const result = await db.delete(qrCodes).where(eq(qrCodes.id, id)).returning();
        return result.length > 0;
      }
      async createQrScan(scan) {
        const [created] = await db.insert(qrScans).values(scan).returning();
        return created;
      }
      async getQrScansByCodeId(qrCodeId) {
        return db.select().from(qrScans).where(eq(qrScans.qrCodeId, qrCodeId)).orderBy(desc(qrScans.scannedAt));
      }
      async getQrScanCount(qrCodeId) {
        const result = await db.select({ count: sql2`count(*)` }).from(qrScans).where(eq(qrScans.qrCodeId, qrCodeId));
        return Number(result[0]?.count || 0);
      }
      async getAllQrScans(limit) {
        const q = db.select().from(qrScans).orderBy(desc(qrScans.scannedAt));
        if (limit) return q.limit(limit);
        return q;
      }
      async deleteQrScansByCodeId(qrCodeId) {
        const result = await db.delete(qrScans).where(eq(qrScans.qrCodeId, qrCodeId)).returning();
        return result.length;
      }
      async createCoachingDebrief(debrief) {
        const [created] = await db.insert(coachingDebriefs).values(debrief).returning();
        return created;
      }
      async getAllCoachingDebriefs() {
        return db.select().from(coachingDebriefs).orderBy(desc(coachingDebriefs.createdAt));
      }
      async updateCoachingDebrief(id, updates) {
        const [updated] = await db.update(coachingDebriefs).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(coachingDebriefs.id, id)).returning();
        return updated;
      }
      async deleteCoachingDebrief(id) {
        const result = await db.delete(coachingDebriefs).where(eq(coachingDebriefs.id, id)).returning();
        return result.length > 0;
      }
    };
    storage = new DatabaseStorage();
  }
});

// server/lib/connectorGuard.ts
async function isConnectorEnabled(name) {
  return storage.isConnectorEnabled(name);
}
var init_connectorGuard = __esm({
  "server/lib/connectorGuard.ts"() {
    "use strict";
    init_storage();
  }
});

// server/resend-client.ts
var resend_client_exports = {};
__export(resend_client_exports, {
  getUncachableResendClient: () => getUncachableResendClient
});
import { Resend } from "resend";
async function getCredentials() {
  if (process.env.RESEND_API_KEY) {
    console.log("\u{1F4E7} Using RESEND_API_KEY from environment");
    return {
      apiKey: process.env.RESEND_API_KEY,
      fromEmail: process.env.RESEND_FROM_EMAIL || "esteve@greenelephant.org"
    };
  }
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY ? "repl " + process.env.REPL_IDENTITY : process.env.WEB_REPL_RENEWAL ? "depl " + process.env.WEB_REPL_RENEWAL : null;
  if (!xReplitToken) {
    throw new Error("Resend API key not found. Please set RESEND_API_KEY in secrets.");
  }
  try {
    connectionSettings = await fetch(
      "https://" + hostname + "/api/v2/connection?include_secrets=true&connector_names=resend",
      {
        headers: {
          "Accept": "application/json",
          "X_REPLIT_TOKEN": xReplitToken
        }
      }
    ).then((res) => res.json()).then((data) => data.items?.[0]);
    if (!connectionSettings || !connectionSettings.settings.api_key) {
      throw new Error("Resend connector not configured");
    }
    console.log("\u{1F4E7} Using Resend from Replit connector");
    return { apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email };
  } catch (error) {
    throw new Error(`Resend not connected. Please set RESEND_API_KEY in secrets. Error: ${error.message}`);
  }
}
async function getUncachableResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}
var connectionSettings;
var init_resend_client = __esm({
  "server/resend-client.ts"() {
    "use strict";
  }
});

// server/email-notifications.ts
var email_notifications_exports = {};
__export(email_notifications_exports, {
  brandedEmailWrapper: () => brandedEmailWrapper,
  sendCoachOnlyEmail: () => sendCoachOnlyEmail,
  sendCoachingDocLinkEmail: () => sendCoachingDocLinkEmail,
  sendCoachingRawDataEmail: () => sendCoachingRawDataEmail,
  sendContactFormEmails: () => sendContactFormEmails,
  sendContentFlywheelEmail: () => sendContentFlywheelEmail,
  sendDailyPulseEmail: () => sendDailyPulseEmail,
  sendFlowCheckAdminNotification: () => sendFlowCheckAdminNotification,
  sendFlowCheckResultEmail: () => sendFlowCheckResultEmail,
  sendNewsletterConfirmationEmail: () => sendNewsletterConfirmationEmail,
  sendNudgeDevNotification: () => sendNudgeDevNotification,
  sendOnboardingEmail: () => sendOnboardingEmail,
  sendPasswordResetEmail: () => sendPasswordResetEmail,
  sendPortalDataExportEmail: () => sendPortalDataExportEmail,
  sendPurchaseNotification: () => sendPurchaseNotification,
  sendQuizResultsEmail: () => sendQuizResultsEmail,
  sendSatellitescanPurchaseEmail: () => sendSatellitescanPurchaseEmail,
  sendSatellitescanReminderEmail: () => sendSatellitescanReminderEmail,
  sendScanInterestAdminNotification: () => sendScanInterestAdminNotification,
  sendScanInterestConfirmationEmail: () => sendScanInterestConfirmationEmail,
  sendTypeformScanCompletionEmail: () => sendTypeformScanCompletionEmail,
  sendVerificationEmail: () => sendVerificationEmail,
  sendWaitlistConfirmationEmail: () => sendWaitlistConfirmationEmail,
  sendWebinarReplayConfirmationEmail: () => sendWebinarReplayConfirmationEmail,
  sendWebinarWaitlistConfirmation: () => sendWebinarWaitlistConfirmation
});
async function sendVerificationEmail(data) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log(`\u23F8\uFE0F Resend connector disabled \u2014 skipping verification email to ${data.email}`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    await client.emails.send({
      from: fromEmail,
      to: data.email,
      subject: "Your verification code \u2014 GreenElephant",
      html: brandedEmailWrapper(
        "Verify your email",
        "One step to complete your purchase",
        `
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 20px 0;">
          Use the code below to complete your purchase. It expires in 10 minutes.
        </p>
        <div style="background-color:#111111;border:2px solid #009999;border-radius:8px;padding:28px;margin:24px 0;text-align:center;">
          <span style="font-size:38px;font-weight:700;letter-spacing:12px;color:#009999;font-family:'Poppins',Arial,sans-serif;">
            ${data.code}
          </span>
        </div>
        <p style="color:#777777;font-size:13px;line-height:1.6;margin:0;">
          If you didn't request this, you can safely ignore this email.
        </p>
        `,
        "You received this because you initiated a purchase at GreenElephant.org. This is a one-time transactional email."
      )
    });
    console.log(`\u2705 Verification email sent to: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`\u274C Failed to send verification email to ${data.email}:`, error);
    return false;
  }
}
async function sendPurchaseNotification(data) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log(`\u23F8\uFE0F Resend connector disabled \u2014 skipping purchase notification for ${data.customerEmail}`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const adminEmails = ["esteve@greenelephant.org", "anu@greenelephant.org"];
    const isInterviewMastery = data.packageId === "interview-mastery";
    let actionItemsHtml = "";
    let customerEmailHtml = "";
    if (isInterviewMastery) {
      actionItemsHtml = `
        <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">Interview Mastery Bundle - Action Required</h3>
          <ol style="line-height: 1.8;">
            <li>Customer has received automatic welcome email with Scan + Calendly links</li>
            <li>Monitor for Typeform completion within 3-4 days</li>
            <li>Prepare dashboard within 48-72 hours after scan completion</li>
            <li>First coaching session will be booked via Calendly</li>
          </ol>
        </div>
      `;
      customerEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0a1628 0%, #1a6180 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to Interview Mastery!</h1>
            <p style="color: #87CEEB; margin-top: 10px; font-size: 16px;">Your bundle includes Satellite Scan + 3 Coaching Sessions</p>
          </div>
          
          <div style="padding: 30px;">
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              Hi ${data.customerName || "there"},
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              Thank you for investing in your Interview Mastery journey! You're about to unlock powerful insights about your communication style and learn how to present your authentic self with confidence.
            </p>
            
            <div style="background-color: #dcfce7; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #16a34a;">
              <h2 style="margin-top: 0; color: #166534; font-size: 18px;">Step 1: Complete Your Satellite Scan</h2>
              <p style="color: #15803d; line-height: 1.6;">
                Start with the 90-minute diagnostic to map your unique communication patterns. This data will power your personalized coaching sessions.
              </p>
              <div style="text-align: center; margin-top: 15px;">
                <a href="https://greenelephantorg.typeform.com/individualscan" style="display: inline-block; background-color: #16a34a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Start Your Satellite Scan</a>
              </div>
            </div>
            
            <div style="background-color: #dbeafe; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2563eb;">
              <h2 style="margin-top: 0; color: #1e40af; font-size: 18px;">Step 2: Book Your First Coaching Session</h2>
              <p style="color: #1e3a8a; line-height: 1.6;">
                Schedule your first 1-hour coaching session. We recommend completing the Satellite Scan first, but you can book now to secure your preferred time.
              </p>
              <div style="text-align: center; margin-top: 15px;">
                <a href="https://calendly.com/greenelephant/3-session-interview-mastery" style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Book Coaching Session</a>
              </div>
            </div>
            
            <div style="background-color: #f3f4f6; padding: 25px; border-radius: 8px; margin: 25px 0;">
              <h2 style="margin-top: 0; color: #1f2937; font-size: 18px;">What's Included in Your Bundle</h2>
              <ul style="line-height: 1.8; margin: 0; padding-left: 20px; color: #374151;">
                <li><strong>Full Satellite Scan:</strong> 90-question diagnostic mapping your communication patterns</li>
                <li><strong>3 x 1-Hour Coaching Sessions:</strong> Personalized interview preparation</li>
                <li><strong>Interview Communication Analysis:</strong> Data-driven insights for interviews</li>
                <li><strong>Mock Interview:</strong> Practice with real-time feedback</li>
                <li><strong>Post-Interview Debrief:</strong> Celebrate wins and refine your approach</li>
              </ul>
            </div>
            
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
              <h3 style="margin-top: 0; color: #92400e; font-size: 16px;">Dashboard Timeline</h3>
              <p style="margin-bottom: 0; color: #78350f; line-height: 1.6;">
                After completing your Satellite Scan, please allow <strong>48-72 hours</strong> for us to review your responses and build your personalized visual map.
              </p>
            </div>
            
            <p style="color: #374151; line-height: 1.6;">
              Questions? Just reply to this email\u2014we're here to help you succeed.
            </p>
            
            <p style="color: #374151; margin-top: 25px;">
              Ready to ace your next interview,<br>
              <strong>Esteve from GreenElephant</strong>
            </p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              You're receiving this because you purchased the Interview Mastery Bundle at GreenElephant.org.
            </p>
          </div>
        </div>
      `;
      await client.emails.send({
        from: fromEmail,
        to: data.customerEmail,
        subject: `Welcome to Interview Mastery - Start Your Scan + Book Coaching \u{1F3AF}`,
        html: customerEmailHtml
      });
      console.log("\u2705 Interview Mastery welcome email sent to:", data.customerEmail);
    } else {
      actionItemsHtml = `
        <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">Action Required</h3>
          <ol style="line-height: 1.8;">
            <li>Email the customer at <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></li>
            <li>Welcome them to the program</li>
            <li>Include the Typeform scan link: <a href="https://greenelephantorg.typeform.com/individualscan">Start Satellite Scan</a></li>
            <li>Provide any onboarding materials</li>
          </ol>
        </div>
      `;
    }
    await client.emails.send({
      from: fromEmail,
      to: adminEmails,
      subject: `New Purchase: ${data.packageName} - \u20AC${data.amount}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Purchase Received!</h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Customer Details</h3>
            <p><strong>Name:</strong> ${data.customerName || "Not provided"}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Purchase Details</h3>
            <p><strong>Package:</strong> ${data.packageName}</p>
            <p><strong>Package ID:</strong> ${data.packageId}</p>
            <p><strong>Amount:</strong> \u20AC${data.amount}</p>
            <p><strong>Payment ID:</strong> ${data.paymentIntentId}</p>
            <p><strong>Purchase ID:</strong> ${data.purchaseId}</p>
            <p><strong>Time:</strong> ${(/* @__PURE__ */ new Date()).toLocaleString()}</p>
          </div>
          
          ${actionItemsHtml}
          
          <p style="color: #6b7280; font-size: 14px;">
            This notification was automatically sent from GreenElephant.org
          </p>
        </div>
      `
    });
    console.log("\u2705 Purchase notification email sent to:", adminEmails.join(", "));
    return true;
  } catch (error) {
    console.error("\u274C Failed to send purchase notification email:", error);
    return false;
  }
}
async function sendSatellitescanPurchaseEmail(data) {
  if (!data.customerEmail || !data.customerEmail.includes("@")) {
    console.error("\u274C CRITICAL: sendSatellitescanPurchaseEmail called with invalid/empty customerEmail:", data.customerEmail);
    console.error("\u274C Purchase data:", JSON.stringify(data, null, 2));
    return false;
  }
  if (!await isConnectorEnabled("resend")) {
    console.log(`\u23F8\uFE0F Resend connector disabled \u2014 skipping Satellitescan purchase emails for ${data.customerEmail}`);
    return false;
  }
  console.log("\u{1F4E7} Attempting to send Satellitescan purchase emails...");
  console.log("\u{1F4E7} Customer email:", data.customerEmail);
  console.log("\u{1F4E7} Customer name:", data.customerName || "Not provided");
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    console.log("\u{1F4E7} Resend client obtained, from email:", fromEmail);
    const adminEmail = "esteve@greenelephant.org";
    await client.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `\u{1F3AF} New Satellitescan Purchase - \u20AC${data.amount}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Satellitescan Beta Purchase! \u{1F680}</h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Customer Details</h3>
            <p><strong>Name:</strong> ${data.customerName || "Not provided"}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Purchase Details</h3>
            <p><strong>Product:</strong> Satellitescan Beta</p>
            <p><strong>Amount:</strong> \u20AC${data.amount}</p>
            <p><strong>Payment ID:</strong> ${data.paymentIntentId}</p>
            <p><strong>Purchase ID:</strong> ${data.purchaseId}</p>
            <p><strong>Time:</strong> ${(/* @__PURE__ */ new Date()).toLocaleString()}</p>
          </div>
          
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">\u26A1 Action Required</h3>
            <ol style="line-height: 1.8;">
              <li><strong>Dashboard timeline:</strong> Create their personalized dashboard within 48-72 hours after they complete the scan</li>
              <li><strong>Follow-up:</strong> Set reminder to check if they completed the Typeform in 3-4 days</li>
            </ol>
          </div>
          
          <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #166534;">\u2705 Customer Resources (Sent Automatically)</h3>
            <ul style="line-height: 1.8;">
              <li><strong>Typeform Scan:</strong> <a href="https://greenelephantorg.typeform.com/individualscan">https://greenelephantorg.typeform.com/individualscan</a></li>
              <li><strong>Prompt Library:</strong> <a href="https://greenelephant.org/resources">Access Prompts</a></li>
              <li><strong>Video Tutorials (YouTube):</strong> <a href="https://www.youtube.com/playlist?list=PLYvfWnYASrYcADsrLB75TRKtcYx7BUdxB">Watch Tutorials</a></li>
            </ul>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            This notification was automatically sent from GreenElephant.org
          </p>
        </div>
      `
    });
    await client.emails.send({
      from: fromEmail,
      to: data.customerEmail,
      subject: "Your Satellite Scan is confirmed \u2014 begin when you're ready",
      html: brandedEmailWrapper(
        "Satellite Scan confirmed",
        "Your 90-minute communication diagnostic is ready",
        `
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 16px 0;">
          Hi ${data.customerName?.split(" ")[0] || "there"},
        </p>
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 24px 0;">
          Thank you for your purchase. You're about to map your communication patterns across 8 research-backed lenses. Set aside 90 uninterrupted minutes and start when you feel focused.
        </p>
        <div style="text-align:center;margin:0 0 28px 0;">
          <a href="https://greenelephantorg.typeform.com/individualscan" style="display:inline-block;background-color:#009999;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:6px;font-family:'Poppins',Arial,sans-serif;font-weight:600;font-size:15px;">
            Begin Your Satellite Scan
          </a>
        </div>
        <div style="background-color:#111111;padding:22px;border-radius:8px;margin:0 0 20px 0;border-left:3px solid #009999;">
          <h3 style="font-family:'Poppins',Arial,sans-serif;margin-top:0;color:#009999;font-size:15px;font-weight:600;">Dashboard timeline</h3>
          <p style="color:#cccccc;font-size:14px;line-height:1.7;margin:0;">
            Your personalized dashboard is built by our coaches \u2014 not automated. After you complete the scan, allow <strong style="color:#e0e0e0;">48\u201372 hours</strong> for delivery.
          </p>
        </div>
        <div style="background-color:#111111;padding:22px;border-radius:8px;margin:0 0 20px 0;">
          <h3 style="font-family:'Poppins',Arial,sans-serif;margin-top:0;color:#e0e0e0;font-size:15px;font-weight:600;">Explore while you wait</h3>
          <ul style="color:#cccccc;font-size:14px;line-height:2;margin:0;padding-left:18px;">
            <li><a href="https://greenelephant.org/resources" style="color:#009999;text-decoration:none;">Communication Prompt Library</a> \u2014 40+ AI-ready prompts</li>
            <li><a href="https://greenelephant.org/periodic-table" style="color:#009999;text-decoration:none;">Periodic Table of Conscious Communication</a></li>
            <li><a href="https://www.youtube.com/playlist?list=PLYvfWnYASrYcADsrLB75TRKtcYx7BUdxB" style="color:#009999;text-decoration:none;">Video Tutorials on YouTube</a></li>
          </ul>
        </div>
        <p style="color:#cccccc;font-size:14px;line-height:1.7;margin:0;">
          Questions? Reply to this email and we'll get back to you.<br><br>
          <strong style="color:#e0e0e0;">Esteve from GreenElephant</strong>
        </p>
        `,
        "You received this because you purchased Satellite Scan at GreenElephant.org. This is a transactional confirmation email sent under legitimate interest."
      )
    });
    console.log("\u2705 Satellitescan purchase notification email sent to admin:", adminEmail);
    console.log("\u2705 Satellitescan welcome email sent to customer:", data.customerEmail);
    console.log("\u2705 Both Satellitescan emails sent successfully");
    return true;
  } catch (error) {
    console.error("\u274C CRITICAL: Failed to send satellitescan purchase email");
    console.error("\u274C Error details:", error?.message || error);
    console.error("\u274C Customer email was:", data.customerEmail);
    console.error("\u274C Full error:", JSON.stringify(error, null, 2));
    return false;
  }
}
async function sendSatellitescanReminderEmail(customerEmail, customerName) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log(`\u23F8\uFE0F Resend disabled \u2014 skipping reminder for ${customerEmail}`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const firstName = customerName?.split(" ")[0] || "there";
    await client.emails.send({
      from: fromEmail,
      to: customerEmail,
      subject: "Your Satellite Scan is still waiting for you",
      html: brandedEmailWrapper(
        "Your scan is waiting",
        "Pick it up whenever you're ready",
        `
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 16px 0;">
          Hi ${firstName},
        </p>
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 24px 0;">
          We noticed you haven't completed your Satellite Scan yet. No pressure \u2014 we just wanted to make sure the link didn't get buried.
        </p>
        <div style="text-align:center;margin:0 0 28px 0;">
          <a href="https://greenelephantorg.typeform.com/individualscan" style="display:inline-block;background-color:#009999;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:6px;font-family:'Poppins',Arial,sans-serif;font-weight:600;font-size:15px;">
            Complete Your Satellite Scan
          </a>
        </div>
        <div style="background-color:#111111;padding:22px;border-radius:8px;margin:0 0 20px 0;border-left:3px solid #009999;">
          <h3 style="font-family:'Poppins',Arial,sans-serif;margin-top:0;color:#009999;font-size:15px;font-weight:600;">A few things to remember</h3>
          <ul style="color:#cccccc;font-size:14px;line-height:2;margin:0;padding-left:18px;">
            <li>90 minutes of focused, uninterrupted time</li>
            <li>Best done in one sitting</li>
            <li>Your personalized dashboard is delivered within 48\u201372 hours of completion</li>
          </ul>
        </div>
        <p style="color:#cccccc;font-size:14px;line-height:1.7;margin:0;">
          Have a question before you start? Just reply here.<br><br>
          <strong style="color:#e0e0e0;">Esteve from GreenElephant</strong>
        </p>
        `,
        "You received this because you purchased Satellite Scan at GreenElephant.org. To unsubscribe from reminders, reply with the word STOP."
      )
    });
    console.log(`\u2705 Reminder email sent to: ${customerEmail}`);
    return true;
  } catch (error) {
    console.error(`\u274C Failed to send reminder email to ${customerEmail}:`, error);
    return false;
  }
}
async function sendWebinarWaitlistConfirmation(data) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log(`\u23F8\uFE0F Resend disabled \u2014 skipping sendWebinarWaitlistConfirmation`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const adminEmail = "esteve@greenelephant.org";
    const lensName = data.preferredLens ? data.preferredLens.charAt(0).toUpperCase() + data.preferredLens.slice(1) : "All lenses";
    await client.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `Play Labs Waitlist: New Signup`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Play Labs Waitlist Signup</h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${data.customerName || "Not provided"}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></p>
            <p><strong>Preferred Lens:</strong> ${lensName}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            This notification was automatically sent from GreenElephant.org Calendar & Play Labs page.
          </p>
        </div>
      `
    });
    await client.emails.send({
      from: fromEmail,
      to: data.customerEmail,
      subject: "You're on the Monthly Lens Webinar list",
      html: brandedEmailWrapper(
        "You're on the list",
        "Monthly Lens Webinars \u2014 one lens, one hour, real conversations",
        `
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 16px 0;">
          Hi ${data.customerName?.split(" ")[0] || "there"},
        </p>
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 24px 0;">
          Thank you for joining the waitlist. Each month we go deep on one lens from the Periodic Table of Conscious Communication \u2014 live theory, live practice, and live Q&A. You'll hear from us as soon as the next session is scheduled.
        </p>
        <div style="background-color:#111111;padding:22px;border-radius:8px;margin:0 0 20px 0;border-left:3px solid #009999;">
          <h3 style="font-family:'Poppins',Arial,sans-serif;margin-top:0;color:#009999;font-size:15px;font-weight:600;">What to expect</h3>
          <ul style="color:#cccccc;font-size:14px;line-height:2;margin:0;padding-left:18px;">
            <li>Monthly sessions, each focused on one of the 8 communication lenses</li>
            <li>Live interaction \u2014 mic and camera open for Satellite Scan holders</li>
            <li>Chat access for all guests, free of charge</li>
            <li>Replay link sent after each session</li>
          </ul>
        </div>
        <div style="background-color:#111111;padding:22px;border-radius:8px;margin:0 0 24px 0;">
          <h3 style="font-family:'Poppins',Arial,sans-serif;margin-top:0;color:#e0e0e0;font-size:15px;font-weight:600;">Explore in the meantime</h3>
          <ul style="color:#cccccc;font-size:14px;line-height:2;margin:0;padding-left:18px;">
            <li><a href="https://greenelephant.org/periodic-table" style="color:#009999;text-decoration:none;">Periodic Table of Conscious Communication</a></li>
            <li><a href="https://greenelephant.org/resources" style="color:#009999;text-decoration:none;">Prompt Library \u2014 40 AI-ready prompts</a></li>
            <li><a href="https://greenelephant.org/scan" style="color:#009999;text-decoration:none;">Satellite Scan \u2014 map your communication patterns</a></li>
          </ul>
        </div>
        <p style="color:#cccccc;font-size:14px;line-height:1.7;margin:0;">
          Looking forward to exploring this with you,<br><br>
          <strong style="color:#e0e0e0;">Esteve from GreenElephant</strong>
        </p>
        `,
        "You received this because you signed up for the Monthly Lens Webinar waitlist at GreenElephant.org. To unsubscribe, reply with the word UNSUBSCRIBE."
      )
    });
    console.log("\u2705 Webinar waitlist confirmation sent to:", data.customerEmail);
    return true;
  } catch (error) {
    console.error("\u274C Failed to send webinar waitlist confirmation:", error);
    return false;
  }
}
async function sendTypeformScanCompletionEmail(data) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log(`\u23F8\uFE0F Resend disabled \u2014 skipping sendTypeformScanCompletionEmail`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const adminEmails = ["esteve@greenelephant.org", "anu@greenelephant.org"];
    const firstName = data.formattedSummary.firstName || "Explorer";
    const rawDataRows = Object.entries(data.rawData).filter(([_, value]) => value && value.trim() !== "").map(([question, answer]) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; vertical-align: top; font-weight: 500; color: #374151; width: 40%;">${question}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; vertical-align: top; color: #1f2937;">${answer}</td>
        </tr>
      `).join("");
    const summaryItems = [];
    if (data.formattedSummary.role) summaryItems.push(`<strong>Role:</strong> ${data.formattedSummary.role}`);
    if (data.formattedSummary.jobTitle) summaryItems.push(`<strong>Job Title:</strong> ${data.formattedSummary.jobTitle}`);
    if (data.formattedSummary.country) summaryItems.push(`<strong>Country:</strong> ${data.formattedSummary.country}`);
    if (data.formattedSummary.education) summaryItems.push(`<strong>Education:</strong> ${data.formattedSummary.education}`);
    if (data.formattedSummary.experience) summaryItems.push(`<strong>Experience:</strong> ${data.formattedSummary.experience}`);
    const summaryHtml = summaryItems.length > 0 ? `<ul style="line-height: 1.8; margin: 0; padding-left: 20px;">${summaryItems.map((item) => `<li>${item}</li>`).join("")}</ul>` : '<p style="color: #6b7280;">Summary data not available</p>';
    const situationsHtml = data.formattedSummary.communicationSituations ? `<p style="line-height: 1.6; color: #1f2937;">${data.formattedSummary.communicationSituations}</p>` : "";
    const customerEmailHtml = brandedEmailWrapper(
      `Scan complete, ${firstName}`,
      "Your responses are in \u2014 your dashboard is being built",
      `
      <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 20px 0;">
        Congratulations on completing your 90-minute Satellite Scan. Your responses are safely stored and your coaches are reviewing them now.
      </p>
      <div style="background-color:#111111;padding:22px;border-radius:8px;margin:0 0 20px 0;border-left:3px solid #009999;">
        <h3 style="font-family:'Poppins',Arial,sans-serif;margin-top:0;color:#009999;font-size:15px;font-weight:600;">What happens next</h3>
        <p style="color:#cccccc;font-size:14px;line-height:1.7;margin:0;">
          Your personalized dashboard is built by hand \u2014 not automated. Each response is reviewed carefully to create a visual map of your communication patterns. Allow <strong style="color:#e0e0e0;">48\u201372 hours</strong> for delivery.
        </p>
      </div>
      <div style="background-color:#111111;padding:22px;border-radius:8px;margin:0 0 20px 0;border-left:3px solid #009999;">
        <h3 style="font-family:'Poppins',Arial,sans-serif;margin-top:0;color:#009999;font-size:15px;font-weight:600;">Use your data now \u2014 don't wait</h3>
        <p style="color:#cccccc;font-size:14px;line-height:1.7;margin:0 0 16px 0;">
          Your scan data is already valuable. Copy your responses from the table below and paste them into any of the 40+ prompts in our library for instant insights.
        </p>
        <ol style="color:#cccccc;font-size:14px;line-height:2;margin:0;padding-left:18px;">
          <li>Scroll down and copy your full scan data from the table</li>
          <li>Go to the Resources page and pick a prompt</li>
          <li>Paste into our GPT assistant for immediate analysis</li>
        </ol>
        <div style="text-align:center;margin:20px 0 0 0;">
          <a href="https://greenelephant.org/resources" style="display:inline-block;background-color:#009999;color:#ffffff;padding:14px 28px;text-decoration:none;border-radius:6px;font-family:'Poppins',Arial,sans-serif;font-weight:600;font-size:15px;">
            Go to Resources &amp; Prompts
          </a>
        </div>
      </div>
      ${summaryHtml ? `
      <div style="background-color:#111111;padding:22px;border-radius:8px;margin:0 0 20px 0;">
        <h3 style="font-family:'Poppins',Arial,sans-serif;margin-top:0;color:#e0e0e0;font-size:15px;font-weight:600;">Your quick summary</h3>
        <div style="color:#cccccc;font-size:14px;line-height:1.8;">${summaryHtml}</div>
        ${situationsHtml ? `<div style="margin-top:14px;padding-top:14px;border-top:1px solid #222;"><strong style="color:#009999;">Communication focus areas:</strong>${situationsHtml}</div>` : ""}
      </div>
      ` : ""}
      <div style="margin:0 0 24px 0;">
        <h3 style="font-family:'Poppins',Arial,sans-serif;color:#e0e0e0;font-size:15px;font-weight:600;margin:0 0 8px 0;">Your complete scan data</h3>
        <p style="color:#777777;font-size:13px;margin:0 0 14px 0;">Copy and paste this into any prompt or AI assistant to start discovering patterns.</p>
        <div style="border:1px solid #1a1a1a;border-radius:8px;overflow:hidden;">
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <thead>
              <tr style="background-color:#0f1f2e;">
                <th style="padding:12px;text-align:left;color:#009999;font-weight:600;width:40%;">Question</th>
                <th style="padding:12px;text-align:left;color:#009999;font-weight:600;">Your response</th>
              </tr>
            </thead>
            <tbody>
              ${rawDataRows.replace(/style="padding: 10px; border-bottom: 1px solid #e5e7eb; vertical-align: top; font-weight: 500; color: #374151; width: 40%;"/g, 'style="padding:10px;border-bottom:1px solid #1a1a1a;vertical-align:top;font-weight:500;color:#cccccc;width:40%;"').replace(/style="padding: 10px; border-bottom: 1px solid #e5e7eb; vertical-align: top; color: #1f2937;"/g, 'style="padding:10px;border-bottom:1px solid #1a1a1a;vertical-align:top;color:#e0e0e0;"')}
            </tbody>
          </table>
        </div>
      </div>
      <div style="background-color:#111111;padding:18px;border-radius:8px;margin:0 0 24px 0;">
        <p style="color:#cccccc;font-size:13px;margin:0;">
          For best results, use our <a href="https://chatgpt.com/g/g-bUJ6dvAHK-conscious-communicator" style="color:#009999;text-decoration:none;">Conscious Communicator GPT</a> when exploring your data with prompts from our library.
        </p>
      </div>
      <p style="color:#cccccc;font-size:14px;line-height:1.7;margin:0;">
        Questions about your data? Just reply here.<br><br>
        <strong style="color:#e0e0e0;">Esteve from GreenElephant</strong><br>
        <span style="color:#777777;font-size:12px;">Submitted: ${data.submittedAt}</span>
      </p>
      `,
      "You received this because you completed the Satellite Scan at GreenElephant.org. This is a transactional email sent under legitimate interest."
    );
    await client.emails.send({
      from: fromEmail,
      to: data.customerEmail,
      cc: adminEmails,
      subject: `Your Satellite Scan Data is Ready, ${firstName}!`,
      html: customerEmailHtml
    });
    console.log("\u2705 Typeform scan completion email sent to:", data.customerEmail);
    console.log("\u2705 CC sent to admins:", adminEmails.join(", "));
    return true;
  } catch (error) {
    console.error("\u274C Failed to send Typeform scan completion email:", error);
    return false;
  }
}
async function sendOnboardingEmail(data) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log(`\u23F8\uFE0F Resend disabled \u2014 skipping sendOnboardingEmail`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const firstName = data.customerName?.split(" ")[0] || "Explorer";
    const personalizedBody = data.body.replace(/\{\{firstName\}\}/g, firstName).replace(/\{\{customerName\}\}/g, data.customerName || "Explorer").replace(/\{\{email\}\}/g, data.customerEmail);
    const personalizedSubject = data.subject.replace(/\{\{firstName\}\}/g, firstName).replace(/\{\{customerName\}\}/g, data.customerName || "Explorer");
    const emailHtml = brandedEmailWrapper(
      "GreenElephant",
      "Conscious Communication",
      `<div style="color:#cccccc;font-size:15px;line-height:1.7;">${personalizedBody}</div>`,
      `You're receiving this as part of your Satellite Scan onboarding journey (email ${data.sequenceNumber} of 12). To unsubscribe, reply with the word UNSUBSCRIBE.`
    );
    await client.emails.send({
      from: fromEmail,
      to: data.customerEmail,
      subject: personalizedSubject,
      html: emailHtml
    });
    console.log(`\u2705 Onboarding email #${data.sequenceNumber} sent to: ${data.customerEmail}`);
    return true;
  } catch (error) {
    console.error(`\u274C Failed to send onboarding email #${data.sequenceNumber} to ${data.customerEmail}:`, error);
    return false;
  }
}
function brandedEmailWrapper(title, subtitle, bodyHtml, footerText) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <style>
    :root { color-scheme: dark; }
    body, html { margin: 0; padding: 0; background-color: #0a0a0a; }
  </style>
</head>
<body bgcolor="#0a0a0a" style="margin: 0; padding: 0; background-color: #0a0a0a;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0a0a0a" style="background-color: #0a0a0a; width: 100%;">
    <tr>
      <td align="center" style="padding: 24px 12px; background-color: #0a0a0a;" bgcolor="#0a0a0a">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #0a0a0a; border-radius: 12px; overflow: hidden; font-family: 'Lato', Arial, sans-serif;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0a0a0a 0%, #0f1f2e 50%, #0a0a0a 100%); padding: 40px 30px; text-align: center; border-bottom: 1px solid #1a1a1a;">
              <img src="https://greenelephant.org/ge-logo-512.png" alt="GreenElephant" width="48" height="48" style="margin-bottom: 16px; border-radius: 8px; display: block; margin-left: auto; margin-right: auto;" />
              <h1 style="font-family: 'Poppins', Arial, sans-serif; color: #ffffff; margin: 0; font-size: 26px; font-weight: 600; letter-spacing: -0.5px;">${title}</h1>
              ${subtitle ? `<p style="color: #009999; margin-top: 8px; margin-bottom: 0; font-size: 15px; font-weight: 500;">${subtitle}</p>` : ""}
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 32px 28px; background-color: #0a0a0a;">
              ${bodyHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 28px; border-top: 1px solid #1a1a1a; text-align: center; background-color: #0a0a0a;">
              <p style="color: #555555; font-size: 11px; margin: 0; line-height: 1.6;">
                ${footerText}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
function tealButton(text2, href) {
  return `<a href="${href}" style="display: inline-block; background-color: #009999; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; letter-spacing: 0.3px;">${text2}</a>`;
}
function darkCard(content, borderColor) {
  const border = borderColor ? `border-left: 3px solid ${borderColor};` : "";
  return `<div style="background-color: #111111; padding: 22px; border-radius: 8px; margin: 20px 0; ${border}">${content}</div>`;
}
async function sendNewsletterConfirmationEmail(data) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log(`\u23F8\uFE0F Resend disabled \u2014 skipping sendNewsletterConfirmationEmail`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const body = `
      <p style="font-size: 16px; line-height: 1.7; color: #e0e0e0;">
        Hi ${data.name || "there"},
      </p>
      <p style="font-size: 16px; line-height: 1.7; color: #cccccc;">
        Thank you for subscribing to the GreenElephant newsletter. You'll receive insights on conscious communication, updates on upcoming retreats and Play Labs sessions, and practical tools for transforming how you connect with others.
      </p>
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #009999; font-size: 16px; font-weight: 600;">What You'll Receive</h3>
        <ul style="line-height: 2; margin-bottom: 0; color: #cccccc; padding-left: 18px;">
          <li>Research-backed communication insights</li>
          <li>Early access to retreats and events</li>
          <li>New prompts and resources from our library</li>
          <li>Updates on the Periodic Table of Conscious Communication</li>
        </ul>
      `, "#009999")}
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #e0e0e0; font-size: 16px; font-weight: 600;">Explore While You're Here</h3>
        <ul style="line-height: 2; padding-left: 18px;">
          <li><a href="https://greenelephant.org/periodic-table" style="color: #009999; text-decoration: none;">The Periodic Table of Conscious Communication</a></li>
          <li><a href="https://greenelephant.org/resources" style="color: #009999; text-decoration: none;">Communication Prompts & Resources</a></li>
          <li><a href="https://greenelephant.org/scan" style="color: #009999; text-decoration: none;">Satellite Scan - Map Your Patterns</a></li>
        </ul>
      `)}
      <p style="color: #cccccc; line-height: 1.7;">
        Looking forward to sharing this journey with you,<br>
        <strong style="color: #e0e0e0;">Esteve from GreenElephant</strong>
      </p>
    `;
    await client.emails.send({
      from: fromEmail,
      to: data.email,
      subject: "Welcome to the GreenElephant Newsletter",
      html: brandedEmailWrapper(
        "Welcome to the Community",
        "Conscious Communication Insights",
        body,
        `You're receiving this because you subscribed to the GreenElephant newsletter at greenelephant.org.<br/>To unsubscribe, simply reply to this email with "unsubscribe".`
      )
    });
    console.log(`\u2705 Newsletter confirmation email sent to: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`\u274C Failed to send newsletter confirmation email to ${data.email}:`, error);
    return false;
  }
}
async function sendScanInterestConfirmationEmail(data) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log(`\u23F8\uFE0F Resend disabled \u2014 skipping sendScanInterestConfirmationEmail`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const body = `
      <p style="font-size: 16px; line-height: 1.7; color: #e0e0e0;">
        Hi ${data.name || "there"},
      </p>
      <p style="font-size: 16px; line-height: 1.7; color: #cccccc;">
        Thank you for your interest in the Satellite Scan. Here's a free tool to start exploring your communication patterns right away.
      </p>
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #009999; font-size: 16px; font-weight: 600;">Check Your Communication Flow &mdash; Free</h3>
        <p style="color: #cccccc; font-size: 14px; line-height: 1.6;">
          The Flow Check measures your motivation, perceived challenge, and perceived competence in a specific communication situation. Based on Csikszentmihalyi's flow model, it maps you into one of 4 zones: Flow, Challenge, Comfort, or Danger.
        </p>
        <p style="color: #999999; font-size: 14px; line-height: 1.6;">
          It takes about 2 minutes and gives you a personalized interpretation of your results with actionable insights.
        </p>
        <div style="text-align: center; margin-top: 16px;">
          ${tealButton("Take the Free Flow Check", "https://greenelephant.org/flow-check")}
        </div>
      `, "#009999")}
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #e0e0e0; font-size: 16px; font-weight: 600;">Go Deeper with the Full Satellite Scan</h3>
        <p style="color: #cccccc; font-size: 14px; line-height: 1.6;">
          The Flow Check measures 1 of 8 lenses. The full Satellite Scan maps your patterns across all 8 communication lenses with 129 questions, delivering a personalized dashboard and access to our complete prompt library.
        </p>
        <div style="text-align: center; margin-top: 16px;">
          ${tealButton("Get Your Full Scan &mdash; &euro;99.95", "https://greenelephant.org/checkout?product=satellitescan")}
        </div>
      `)}
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #e0e0e0; font-size: 16px; font-weight: 600;">Or Try the Free Signals Quiz</h3>
        <p style="color: #cccccc; font-size: 14px; line-height: 1.6;">
          Get a quick snapshot of your communication style in just 6 questions with our free Signals Quiz.
        </p>
        <div style="text-align: center; margin-top: 16px;">
          <a href="https://greenelephant.org/signals" style="display: inline-block; color: #009999; padding: 12px 24px; text-decoration: none; border: 1px solid #009999; border-radius: 6px; font-weight: 600; font-size: 14px;">Take the Free Quiz</a>
        </div>
      `)}
      <p style="color: #cccccc; line-height: 1.7;">
        Looking forward to supporting your communication journey,<br>
        <strong style="color: #e0e0e0;">Esteve from GreenElephant</strong>
      </p>
    `;
    await client.emails.send({
      from: fromEmail,
      to: data.email,
      subject: "Check Your Communication Flow - Free Assessment from GreenElephant",
      html: brandedEmailWrapper(
        "Your Communication Flow Check",
        "Discover Which Zone You're In",
        body,
        `You're receiving this because you signed up for communication insights at greenelephant.org.<br/>To unsubscribe, simply reply to this email with "unsubscribe".`
      )
    });
    console.log(`\u2705 Scan interest confirmation email sent to: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`\u274C Failed to send scan interest confirmation email to ${data.email}:`, error);
    return false;
  }
}
async function sendScanInterestAdminNotification(data) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log(`\u23F8\uFE0F Resend disabled \u2014 skipping sendScanInterestAdminNotification`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const adminEmail = "esteve@greenelephant.org";
    await client.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `New Scan Interest Lead: ${data.email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Scan Interest Lead</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${data.name || "Not provided"}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Source:</strong> Scan page lead magnet (Flow Check + updates)</p>
            <p><strong>Time:</strong> ${(/* @__PURE__ */ new Date()).toLocaleString()}</p>
          </div>
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Next Steps</h3>
            <ul style="line-height: 1.8;">
              <li>Contact has been synced to Notion CRM with "Scan Interest" channel</li>
              <li>They received a link to the free Flow Check and communication insights</li>
              <li>Consider a personal follow-up in 3-5 days if no purchase</li>
            </ul>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This notification was automatically sent from GreenElephant.org Scan page.</p>
        </div>
      `
    });
    console.log(`\u2705 Scan interest admin notification sent for: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`\u274C Failed to send scan interest admin notification:`, error);
    return false;
  }
}
async function sendWaitlistConfirmationEmail(data) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log(`\u23F8\uFE0F Resend disabled \u2014 skipping sendWaitlistConfirmationEmail`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const adminEmail = "esteve@greenelephant.org";
    const retreatName = data.retreatType === "provence" ? "Equinoxe Provence" : data.retreatType === "lapland" ? "Equinoxe Lapland" : data.retreatType || "Equinoxe Retreat";
    await client.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `Retreat Waitlist: New Signup - ${retreatName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Retreat Waitlist Signup</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${data.name || "Not provided"}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Retreat:</strong> ${retreatName}</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Motivation</h3>
            <p style="color: #374151; line-height: 1.6;">${data.motivation}</p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This notification was automatically sent from GreenElephant.org Retreats page.</p>
        </div>
      `
    });
    const customerBody = `
      <p style="font-size: 16px; line-height: 1.7; color: #e0e0e0;">
        Hi ${data.name || "there"},
      </p>
      <p style="font-size: 16px; line-height: 1.7; color: #cccccc;">
        Thank you for your interest in the ${retreatName} retreat. We've received your application and you're now on the waitlist.
      </p>
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #009999; font-size: 16px; font-weight: 600;">What Happens Next</h3>
        <ul style="line-height: 2; margin-bottom: 0; color: #cccccc; padding-left: 18px;">
          <li>We review every application personally</li>
          <li>When spots open up, we'll contact you directly</li>
          <li>You'll receive details about dates, location, and what to expect</li>
        </ul>
      `, "#009999")}
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #e0e0e0; font-size: 16px; font-weight: 600;">Explore While You Wait</h3>
        <ul style="line-height: 2; padding-left: 18px;">
          <li><a href="https://greenelephant.org/periodic-table" style="color: #009999; text-decoration: none;">The Periodic Table of Conscious Communication</a></li>
          <li><a href="https://greenelephant.org/resources" style="color: #009999; text-decoration: none;">Communication Prompts & Resources</a></li>
          <li><a href="https://greenelephant.org/scan" style="color: #009999; text-decoration: none;">Try the Satellite Scan</a></li>
        </ul>
      `)}
      <p style="color: #cccccc; line-height: 1.7;">
        We're excited about your interest in conscious communication,<br>
        <strong style="color: #e0e0e0;">Esteve from GreenElephant</strong>
      </p>
    `;
    await client.emails.send({
      from: fromEmail,
      to: data.email,
      subject: `You're on the ${retreatName} Waitlist`,
      html: brandedEmailWrapper(
        "You're on the Waitlist",
        retreatName,
        customerBody,
        `You're receiving this because you joined the retreat waitlist at GreenElephant.org.<br/>To unsubscribe, simply reply to this email with "unsubscribe".`
      )
    });
    console.log(`\u2705 Waitlist confirmation emails sent for: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`\u274C Failed to send waitlist confirmation email to ${data.email}:`, error);
    return false;
  }
}
async function sendContactFormEmails(data) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log(`\u23F8\uFE0F Resend disabled \u2014 skipping sendContactFormEmails`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const adminEmail = "esteve@greenelephant.org";
    const intentLabels = {
      coaching: "EA Coaching",
      interview: "Interview Coaching",
      consulting: "Consulting",
      general: "General Inquiry"
    };
    const intentLabel = intentLabels[data.intent] || data.intent || "General Inquiry";
    await client.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `New Contact Form: ${intentLabel} - ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Intent:</strong> ${intentLabel}</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Message</h3>
            <p style="color: #374151; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
          </div>
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Action Required</h3>
            <p style="margin-bottom: 0; color: #1e3a8a;">Reply to <a href="mailto:${data.email}">${data.email}</a> within 24 hours.</p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This notification was automatically sent from GreenElephant.org Contact page.</p>
        </div>
      `
    });
    const customerBody = `
      <p style="font-size: 16px; line-height: 1.7; color: #e0e0e0;">
        Hi ${data.name},
      </p>
      <p style="font-size: 16px; line-height: 1.7; color: #cccccc;">
        Thank you for reaching out. We've received your message and will respond personally within 24 hours.
      </p>
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #888888; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Your Message</h3>
        <p style="color: #999999; line-height: 1.7; white-space: pre-wrap; font-style: italic; margin-bottom: 0;">${data.message}</p>
      `)}
      <p style="font-size: 16px; line-height: 1.7; color: #cccccc;">
        In the meantime, feel free to explore:
      </p>
      <ul style="line-height: 2; padding-left: 18px;">
        <li><a href="https://greenelephant.org/periodic-table" style="color: #009999; text-decoration: none;">The Periodic Table of Conscious Communication</a></li>
        <li><a href="https://greenelephant.org/resources" style="color: #009999; text-decoration: none;">Communication Prompts & Resources</a></li>
      </ul>
      <p style="color: #cccccc; line-height: 1.7;">
        With care,<br>
        <strong style="color: #e0e0e0;">The GreenElephant Team</strong>
      </p>
    `;
    await client.emails.send({
      from: fromEmail,
      to: data.email,
      subject: "We received your message - GreenElephant",
      html: brandedEmailWrapper(
        "Message Received",
        "",
        customerBody,
        "You're receiving this one-time confirmation because you submitted a contact form at GreenElephant.org.<br/>No marketing emails will be sent. If you have questions, reply to this email."
      )
    });
    console.log(`\u2705 Contact form emails sent for: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`\u274C Failed to send contact form emails to ${data.email}:`, error);
    return false;
  }
}
async function sendQuizResultsEmail(data) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log(`\u23F8\uFE0F Resend disabled \u2014 skipping sendQuizResultsEmail`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const scoreLevel = data.score >= 80 ? "High" : data.score >= 50 ? "Moderate" : "Developing";
    const scoreColor = data.score >= 80 ? "#00cc99" : data.score >= 50 ? "#e6a817" : "#e05555";
    const scoreBorderColor = data.score >= 80 ? "#009999" : data.score >= 50 ? "#b8860b" : "#cc3333";
    const scoreMessage = data.score >= 80 ? "You show strong conscious communication patterns. Your awareness of how you communicate is a significant asset." : data.score >= 50 ? "You have a solid foundation in conscious communication with room to grow. Targeted practice can help you strengthen specific areas." : "You're at the beginning of your conscious communication journey. The good news? Awareness is the first step, and you've already taken it.";
    const body = `
      <p style="font-size: 16px; line-height: 1.7; color: #e0e0e0;">
        Hi ${data.name || "there"},
      </p>
      <p style="font-size: 16px; line-height: 1.7; color: #cccccc;">
        Thank you for completing the Signals Quiz. Here are your results:
      </p>
      
      <div style="background-color: #111111; padding: 30px; border-radius: 8px; margin: 24px 0; text-align: center; border: 1px solid #1a1a1a;">
        <p style="margin: 0 0 8px 0; color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Your Score</p>
        <p style="margin: 0; font-size: 56px; font-weight: 700; color: ${scoreColor}; font-family: 'Poppins', Arial, sans-serif;">${data.score}%</p>
        <p style="margin: 8px 0 0 0; color: ${scoreColor}; font-weight: 600; font-size: 16px;">${scoreLevel} Awareness</p>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #1a1a1a;">
          <p style="margin: 0; color: #666666; font-size: 13px;">Community average: ${data.averageScore}%</p>
        </div>
      </div>
      
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #e0e0e0; font-size: 16px; font-weight: 600;">What This Means</h3>
        <p style="color: #cccccc; line-height: 1.7; margin-bottom: 0;">${scoreMessage}</p>
      `, scoreBorderColor)}
      
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #009999; font-size: 16px; font-weight: 600;">Go Deeper with the Satellite Scan</h3>
        <p style="color: #cccccc; line-height: 1.7;">
          The Signals Quiz gives you a snapshot. The <strong style="color: #e0e0e0;">Satellite Scan</strong> gives you the full picture \u2014 a 90-minute deep dive mapping your communication patterns across all 8 lenses, with a personalized dashboard created by our coaches.
        </p>
        <div style="text-align: center; margin-top: 18px;">
          ${tealButton("Explore the Satellite Scan", "https://greenelephant.org/scan")}
        </div>
      `, "#009999")}
      
      <p style="color: #cccccc; line-height: 1.7;">
        Questions about your results? Just reply to this email.<br>
        <strong style="color: #e0e0e0;">Esteve from GreenElephant</strong>
      </p>
    `;
    await client.emails.send({
      from: fromEmail,
      to: data.email,
      subject: `Your Signals Quiz Results: ${scoreLevel} Awareness - GreenElephant`,
      html: brandedEmailWrapper(
        "Your Signals Quiz Results",
        "Communication Awareness Assessment",
        body,
        `You're receiving this because you completed the Signals Quiz and opted to receive your results at GreenElephant.org.<br/>To unsubscribe, simply reply to this email with "unsubscribe".`
      )
    });
    console.log(`\u2705 Quiz results email sent to: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`\u274C Failed to send quiz results email to ${data.email}:`, error);
    return false;
  }
}
function flowAOrAn(word) {
  return /^[aeiou]/i.test(word.trim()) ? "an" : "a";
}
function flowPersonalisedInterpretation(zone, situation, role, motivation, challenge, competence) {
  switch (zone) {
    case "flow":
      return `As ${flowAOrAn(role)} ${role} in &ldquo;${situation}&rdquo;, you perceive both high challenge (${challenge}/10) and high competence (${competence}/10), with strong motivation (${motivation}/10). This is the optimal state&mdash;you&rsquo;re stretched just enough to stay engaged without feeling overwhelmed. Your skills match the demands of this situation, creating deep involvement and satisfaction.`;
    case "challenge":
      return `As ${flowAOrAn(role)} ${role} in &ldquo;${situation}&rdquo;, you perceive high challenge (${challenge}/10) but lower competence (${competence}/10). With motivation at ${motivation}/10, this creates a stress pattern. The situation demands more than you currently feel equipped to handle. This isn&rsquo;t about actual ability&mdash;it&rsquo;s about perception. Targeted support can shift this rapidly.`;
    case "comfort":
      return `As ${flowAOrAn(role)} ${role} in &ldquo;${situation}&rdquo;, you perceive low challenge (${challenge}/10) but high competence (${competence}/10). With motivation at ${motivation}/10, you&rsquo;re in your comfort zone. While this feels safe, sustained comfort leads to stagnation. Your skills exceed the demands&mdash;which means you have capacity for growth.`;
    case "danger":
      return `As ${flowAOrAn(role)} ${role} in &ldquo;${situation}&rdquo;, you perceive both low challenge (${challenge}/10) and low competence (${competence}/10), with motivation at ${motivation}/10. This is the danger zone&mdash;neither the situation nor your skills feel adequate. This creates apathy and disengagement, which compounds over time. Urgent attention is needed.`;
    default:
      return "";
  }
}
async function sendFlowCheckResultEmail(data) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log(`\u23F8\uFE0F Resend disabled \u2014 skipping sendFlowCheckResultEmail`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const zone = FLOW_ZONE_CONFIG[data.zone] || FLOW_ZONE_CONFIG.comfort;
    const body = `
      <p style="font-size: 16px; line-height: 1.7; color: #e0e0e0;">
        Hi ${data.name || "there"},
      </p>
      <p style="font-size: 16px; line-height: 1.7; color: #cccccc;">
        Here are your Check-my-FLOW results. You assessed your communication flow in the context of <strong style="color: #e0e0e0;">${data.situation}</strong> as ${flowAOrAn(data.role)} <strong style="color: #e0e0e0;">${data.role}</strong>.
      </p>
      ${darkCard(`
        <div style="text-align: center; margin-bottom: 16px;">
          <span style="display: inline-block; background-color: ${zone.color}22; border: 1px solid ${zone.color}; color: ${zone.color}; padding: 8px 20px; border-radius: 20px; font-family: 'Poppins', Arial, sans-serif; font-weight: 600; font-size: 18px; letter-spacing: 0.5px;">${zone.label}</span>
        </div>
        <p style="color: #cccccc; font-size: 14px; line-height: 1.6; text-align: center;">${zone.description}</p>
      `, zone.color)}
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #e0e0e0; font-size: 16px; font-weight: 600;">Your Personalised Interpretation</h3>
        <p style="color: #cccccc; font-size: 14px; line-height: 1.7;">${flowPersonalisedInterpretation(data.zone, data.situation, data.role, data.motivation, data.challenge, data.competence)}</p>
      `)}
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #009999; font-size: 16px; font-weight: 600;">Your Scores</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #999; padding: 8px 0; border-bottom: 1px solid #1a1a1a;">Perceived Motivation</td>
            <td style="color: #e0e0e0; font-weight: 600; text-align: right; padding: 8px 0; border-bottom: 1px solid #1a1a1a;">${data.motivation}/10</td>
          </tr>
          <tr>
            <td style="color: #999; padding: 8px 0; border-bottom: 1px solid #1a1a1a;">Perceived Challenge</td>
            <td style="color: #e0e0e0; font-weight: 600; text-align: right; padding: 8px 0; border-bottom: 1px solid #1a1a1a;">${data.challenge}/10</td>
          </tr>
          <tr>
            <td style="color: #999; padding: 8px 0;">Perceived Competence</td>
            <td style="color: #e0e0e0; font-weight: 600; text-align: right; padding: 8px 0;">${data.competence}/10</td>
          </tr>
        </table>
      `)}
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #e0e0e0; font-size: 16px; font-weight: 600;">What To Do Next</h3>
        <p style="color: #cccccc; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">${zone.advice}</p>
        <ul style="margin: 0; padding-left: 20px; color: #cccccc; font-size: 13px; line-height: 1.8;">
          ${zone.recommendations.map((r) => `<li style="margin-bottom: 4px;">${r}</li>`).join("")}
        </ul>
      `)}
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #e0e0e0; font-size: 16px; font-weight: 600;">You Measured 1 of 8 Lenses</h3>
        <p style="color: #cccccc; font-size: 14px; line-height: 1.6;">
          Flow is one of the 8 lenses in the Periodic Table of Conscious Communication. The full Satellite Scan maps all 8 lenses with 129 questions, giving you a complete communication dashboard.
        </p>
        <div style="text-align: center; margin-top: 16px;">
          ${tealButton("Get Your Full Satellite Scan &mdash; &euro;99.95", "https://greenelephant.org/checkout?product=satellitescan")}
        </div>
      `)}
      ${darkCard(`
        <h3 style="font-family: 'Poppins', Arial, sans-serif; margin-top: 0; color: #e0e0e0; font-size: 16px; font-weight: 600;">Learn More About Flow</h3>
        <p style="color: #cccccc; font-size: 14px; line-height: 1.6;">
          Watch this short video to understand how to measure and hack communication flow in your work and team:
        </p>
        <div style="text-align: center; margin-top: 12px;">
          <a href="https://youtu.be/EZBP2FByWBg" style="color: #009999; font-size: 14px; text-decoration: none; font-weight: 600;">Watch: Measuring Flow (YouTube)</a>
        </div>
      `)}
      <p style="color: #cccccc; line-height: 1.7;">
        Looking forward to supporting your communication journey,<br>
        <strong style="color: #e0e0e0;">Esteve from GreenElephant</strong>
      </p>
    `;
    await client.emails.send({
      from: fromEmail,
      to: data.email,
      subject: `Your Flow Check Result: ${zone.label} - GreenElephant`,
      html: brandedEmailWrapper(
        "Your Check-my-FLOW Results",
        "Communication Flow Assessment",
        body,
        `You're receiving this because you completed the Check-my-FLOW assessment and opted to receive your results at greenelephant.org.<br/>To unsubscribe, simply reply to this email with "unsubscribe".`
      )
    });
    console.log(`\u2705 Flow check result email sent to: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`\u274C Failed to send flow check result email to ${data.email}:`, error);
    return false;
  }
}
async function sendFlowCheckAdminNotification(data) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log(`\u23F8\uFE0F Resend disabled \u2014 skipping sendFlowCheckAdminNotification`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const adminEmail = "esteve@greenelephant.org";
    const zone = FLOW_ZONE_CONFIG[data.zone] || FLOW_ZONE_CONFIG.comfort;
    await client.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `New Flow Check: ${zone.label} - ${data.email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Flow Check Submission</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${data.name || "Not provided"}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Time:</strong> ${(/* @__PURE__ */ new Date()).toLocaleString()}</p>
          </div>
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #166534;">Flow Check Results</h3>
            <p><strong>Zone:</strong> <span style="color: ${zone.color}; font-weight: bold;">${zone.label}</span></p>
            <p><strong>Situation:</strong> ${data.situation}</p>
            <p><strong>Role:</strong> ${data.role}</p>
            <p><strong>Motivation:</strong> ${data.motivation}/10</p>
            <p><strong>Challenge:</strong> ${data.challenge}/10</p>
            <p><strong>Competence:</strong> ${data.competence}/10</p>
          </div>
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Next Steps</h3>
            <ul style="line-height: 1.8;">
              <li>Contact synced to Notion CRM with "Flow Check" channel</li>
              <li>They received branded result email with Satellite Scan CTA</li>
              <li>Consider personal follow-up if in Danger or Challenge zone</li>
            </ul>
          </div>
          <p style="color: #6b7280; font-size: 14px;">Automatically sent from GreenElephant.org Flow Check.</p>
        </div>
      `
    });
    console.log(`\u2705 Flow check admin notification sent for: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`\u274C Failed to send flow check admin notification for ${data.email}:`, error);
    return false;
  }
}
async function sendWebinarReplayConfirmationEmail(data) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log(`\u23F8\uFE0F Resend disabled \u2014 skipping sendWebinarReplayConfirmationEmail`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    await client.emails.send({
      from: fromEmail,
      to: data.email,
      subject: "Your Monthly Lens Webinar replay link",
      html: brandedEmailWrapper(
        "Monthly Lens Webinars",
        "Your replay link is on its way",
        `
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 16px 0;">
          Hi ${data.name},
        </p>
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 16px 0;">
          Thank you for registering for the GreenElephant Monthly Lens Webinar series. The replay link for the most recent session will be sent to this address within a few hours.
        </p>
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 24px 0;">
          Each month we go deep on one lens from the Periodic Table of Conscious Communication \u2014 live theory, live practice, and live Q&A. Future session invitations will come to this inbox.
        </p>
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 8px 0;">
          Want the full experience with mic and camera access?
        </p>
        <a href="https://greenelephant.org/scan" style="display:inline-block;background-color:#009999;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;font-family:Poppins,sans-serif;font-weight:600;font-size:14px;margin-bottom:24px;">
          Get the Satellite Scan \u2014 \u20AC99.95
        </a>
        `,
        "You received this email because you requested access to the GreenElephant Monthly Lens Webinar replay. To unsubscribe, reply to this email with the word UNSUBSCRIBE."
      )
    });
    console.log(`\u2705 Webinar replay gate confirmation sent to: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`\u274C Failed to send webinar replay gate email to ${data.email}:`, error);
    return false;
  }
}
async function sendDailyPulseEmail(data) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log(`\u23F8\uFE0F Resend disabled \u2014 skipping sendDailyPulseEmail`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const zoneRows = Object.entries(data.flowZones).map(([zone, count]) => `
        <tr>
          <td style="padding:6px 12px;color:#cccccc;font-size:13px;border-bottom:1px solid #222;">${zone}</td>
          <td style="padding:6px 12px;color:#009999;font-size:13px;font-weight:600;border-bottom:1px solid #222;text-align:right;">${count}</td>
        </tr>`).join("");
    const statCard = (label, value, note) => `
      <div style="background:#111;border:1px solid #222;border-radius:6px;padding:16px 20px;margin-bottom:12px;">
        <div style="color:#cccccc;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">${label}</div>
        <div style="color:#ffffff;font-size:28px;font-weight:700;font-family:Poppins,sans-serif;">${value}</div>
        ${note ? `<div style="color:#666;font-size:12px;margin-top:4px;">${note}</div>` : ""}
      </div>`;
    const bodyHtml = `
      <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 20px 0;">
        Here is your automated activity summary for the last 24 hours ending <strong style="color:#ffffff;">${data.date}</strong>.
      </p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        ${statCard("Scan Purchases", data.scanPurchases, `\u20AC${data.revenue.toFixed(2)} revenue`)}
        ${statCard("Newsletter Subs", data.newsletterSubs)}
        ${statCard("Webinar Signups", data.webinarSignups)}
        ${statCard("Flow Checks", data.flowChecks)}
        ${statCard("Quiz Completions", data.quizCompletions)}
        ${statCard("Contact Messages", data.contactMessages)}
      </div>

      ${data.flowChecks > 0 ? `
      <div style="margin-top:24px;">
        <p style="color:#009999;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Flow Zones Breakdown</p>
        <table style="width:100%;border-collapse:collapse;background:#111;border:1px solid #222;border-radius:6px;overflow:hidden;">
          <tbody>${zoneRows}</tbody>
        </table>
      </div>` : ""}

      <div style="margin-top:28px;">
        ${tealButton("Open Admin Dashboard", "https://greenelephant.org/admin/submissions")}
        &nbsp;&nbsp;
        <a href="https://greenelephant.org/admin/email-control-room" style="display:inline-block;border:1px solid #009999;color:#009999;padding:12px 20px;text-decoration:none;border-radius:6px;font-family:Poppins,sans-serif;font-weight:600;font-size:14px;">
          Email Control Room
        </a>
      </div>
    `;
    await client.emails.send({
      from: fromEmail,
      to: "esteve@greenelephant.org",
      subject: `GE Daily Pulse \u2014 ${data.date}`,
      html: brandedEmailWrapper(
        "Daily Pulse",
        `Activity summary for ${data.date}`,
        bodyHtml,
        "This email is sent automatically every morning at 8:00 AM UTC to esteve@greenelephant.org. It is an internal admin digest and does not contain customer data shared with third parties."
      )
    });
    console.log(`\u2705 Daily pulse email sent for ${data.date}`);
    return true;
  } catch (error) {
    console.error("\u274C Failed to send daily pulse email:", error);
    return false;
  }
}
async function sendContentFlywheelEmail(data) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log("\u23F8\uFE0F Resend connector disabled \u2014 skipping content flywheel email");
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const generatorLabels = {
      headlines: "Decode the Headlines",
      "ai-gap": "The AI Communication Gap",
      workplace: "Workplace Conflict Decoded"
    };
    const articleHtml = data.article.replace(/\n/g, "<br/>");
    const pollHtml = data.poll.replace(/\n/g, "<br/>");
    const artHtml = data.artDirection.replace(/\n/g, "<br/>");
    const bodyHtml = `
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="display: inline-block; background-color: ${data.lensColor}22; color: ${data.lensColor}; border: 1px solid ${data.lensColor}44; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600;">
          ${data.lensName} Lens
        </span>
      </div>
      <p style="color: #ff6666; font-size: 14px; font-weight: 700; text-align: center; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1px;">
        HITL Review \u2014 Not for posting until approved
      </p>

      ${darkCard(`
        <h3 style="color: #ffffff; margin: 0 0 16px 0; font-family: 'Poppins', Arial, sans-serif; font-size: 18px;">LinkedIn Article Draft</h3>
        <p style="color: #cccccc; font-size: 13px; margin-bottom: 12px; font-style: italic;">For Esteve's personal LinkedIn profile</p>
        <div style="color: #dddddd; font-size: 14px; line-height: 1.7;">${articleHtml}</div>
      `, data.lensColor)}

      ${darkCard(`
        <h3 style="color: #ffffff; margin: 0 0 16px 0; font-family: 'Poppins', Arial, sans-serif; font-size: 18px;">LinkedIn Poll Draft</h3>
        <p style="color: #cccccc; font-size: 13px; margin-bottom: 12px; font-style: italic;">For GreenElephant company page</p>
        <div style="color: #dddddd; font-size: 14px; line-height: 1.7;">${pollHtml}</div>
      `, "#009999")}

      ${darkCard(`
        <h3 style="color: #ffffff; margin: 0 0 16px 0; font-family: 'Poppins', Arial, sans-serif; font-size: 18px;">Art Direction for Canva</h3>
        <div style="color: #dddddd; font-size: 14px; line-height: 1.7;">${artHtml}</div>
      `, "#663399")}

      ${data.seoKeywords.length > 0 ? darkCard(`
        <h3 style="color: #ffffff; margin: 0 0 12px 0; font-family: 'Poppins', Arial, sans-serif; font-size: 16px;">SEO/GEO Enrichment Summary</h3>
        <p style="color: #999999; font-size: 13px; margin-bottom: 12px;">Keywords: ${data.seoKeywords.join(", ")}</p>
        ${data.seoFaqItems.map((f) => `<p style="color: #cccccc; font-size: 13px;"><strong>Q:</strong> ${f.question}<br/><strong>A:</strong> ${f.answer}</p>`).join("")}
        ${data.seoInternalLinks.length > 0 ? `<p style="color: #999999; font-size: 13px; margin-top: 12px;">Internal linking: ${data.seoInternalLinks.join(" | ")}</p>` : ""}
      `, "#669966") : ""}
    `;
    await client.emails.send({
      from: fromEmail,
      to: data.recipients,
      subject: `[Content Flywheel] ${generatorLabels[data.generatorType] || data.generatorType} \u2014 ${data.lensName} Lens`,
      html: brandedEmailWrapper(
        "Content Flywheel",
        `${generatorLabels[data.generatorType] || data.generatorType} \u2014 ${data.lensName} Lens`,
        bodyHtml,
        "This is an internal GreenElephant admin email. Content requires human review before publishing. Do not forward or post without approval."
      )
    });
    console.log(`\u2705 Content flywheel email sent to ${data.recipients.join(", ")}`);
    return true;
  } catch (error) {
    console.error("\u274C Failed to send content flywheel email:", error);
    return false;
  }
}
async function sendCoachingRawDataEmail(data) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log(`\u23F8\uFE0F Resend disabled \u2014 skipping coaching raw data email to ${data.coacheeEmail}`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const firstName = data.coacheeName?.split(" ")[0] || "there";
    const rawDataRows = Object.entries(data.rawData).map(([q, a]) => `<tr><td style="padding:6px 10px;border-bottom:1px solid #222;color:#999;font-size:13px;vertical-align:top;white-space:nowrap;">${q}</td><td style="padding:6px 10px;border-bottom:1px solid #222;color:#e0e0e0;font-size:13px;">${a}</td></tr>`).join("");
    await client.emails.send({
      from: fromEmail,
      to: data.coacheeEmail,
      subject: `Your Satellite Scan Raw Data \u2014 GreenElephant`,
      html: brandedEmailWrapper(
        "Your Satellite Scan Data",
        "Copy-paste ready for the Conscious Communicator GPT",
        `
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 16px 0;">
          Hi ${firstName},
        </p>
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 24px 0;">
          Here is your raw Satellite Scan data. You can select all the text in the box below and paste it directly into the
          <a href="https://chatgpt.com/g/g-A2D8HFqGl-conscious-communicator" style="color:#009999;text-decoration:none;">Conscious Communicator GPT</a>
          for a personalized analysis.
        </p>
        <div style="background-color:#111111;border:1px solid #333;border-radius:8px;padding:0;margin:0 0 24px 0;overflow:auto;max-height:500px;">
          <table cellpadding="0" cellspacing="0" border="0" style="width:100%;font-family:monospace;">
            ${rawDataRows}
          </table>
        </div>
        <p style="color:#999;font-size:13px;line-height:1.7;margin:0;">
          Questions? Reply to this email and we'll get back to you.
        </p>
        `,
        "You received this because your coach at GreenElephant sent you your Satellite Scan data."
      )
    });
    console.log(`\u2705 Coaching raw data email sent to: ${data.coacheeEmail}`);
    return true;
  } catch (error) {
    console.error(`\u274C Failed to send coaching raw data email to ${data.coacheeEmail}:`, error);
    return false;
  }
}
async function sendCoachingDocLinkEmail(data) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log(`\u23F8\uFE0F Resend disabled \u2014 skipping coaching doc link email to ${data.coacheeEmail}`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const firstName = data.coacheeName?.split(" ")[0] || "there";
    const reportHtml = data.reportText.split("\n").map((line) => line.trim() ? `<p style="color:#cccccc;font-size:14px;line-height:1.7;margin:0 0 8px 0;">${line}</p>` : "<br/>").join("");
    await client.emails.send({
      from: fromEmail,
      to: data.coacheeEmail,
      subject: `Your Coaching Dashboard is Ready \u2014 GreenElephant`,
      html: brandedEmailWrapper(
        "Your Coaching Dashboard",
        "Review your personalized communication insights",
        `
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 16px 0;">
          Hi ${firstName},
        </p>
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 24px 0;">
          Your coaching dashboard is ready. You can view the full interactive version using the link below,
          or read the summary right here in this email.
        </p>
        <div style="text-align:center;margin:0 0 28px 0;">
          <a href="${data.docUrl}" style="display:inline-block;background-color:#009999;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:6px;font-family:'Poppins',Arial,sans-serif;font-weight:600;font-size:15px;">
            Open Your Dashboard
          </a>
        </div>
        <div style="background-color:#111111;border:1px solid #333;border-radius:8px;padding:22px;margin:0 0 24px 0;">
          <h3 style="font-family:'Poppins',Arial,sans-serif;margin-top:0;color:#009999;font-size:15px;font-weight:600;">Report Summary</h3>
          ${reportHtml}
        </div>
        <p style="color:#999;font-size:13px;line-height:1.7;margin:0;">
          Questions about your results? Reply to this email and your coach will follow up.
        </p>
        `,
        "You received this because your coach at GreenElephant prepared your coaching dashboard."
      )
    });
    console.log(`\u2705 Coaching doc link email sent to: ${data.coacheeEmail}`);
    return true;
  } catch (error) {
    console.error(`\u274C Failed to send coaching doc link email to ${data.coacheeEmail}:`, error);
    return false;
  }
}
async function sendCoachOnlyEmail(data) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log(`\u23F8\uFE0F Resend disabled \u2014 skipping coach-only email`);
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const coachEmails = ["esteve@greenelephant.org", "anu@greenelephant.org"];
    const coacheeName = data.coacheeName || "Unknown";
    const rawDataRows = Object.entries(data.rawData).map(([q, a]) => `<tr><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;vertical-align:top;white-space:nowrap;">${q}</td><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:13px;">${a}</td></tr>`).join("");
    await client.emails.send({
      from: fromEmail,
      to: coachEmails,
      subject: `[Internal] Scan Data for ${coacheeName} \u2014 Review Before Delivery`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #0f2744 100%); padding: 24px 28px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Internal: Scan Data Review</h1>
            <p style="color: #93c5fd; margin-top: 6px; margin-bottom: 0; font-size: 14px;">Coachee: ${coacheeName}</p>
          </div>
          
          ${data.notes ? `
          <div style="background-color: #fef3c7; padding: 16px 20px; border-left: 4px solid #f59e0b;">
            <h3 style="margin-top: 0; color: #92400e; font-size: 14px;">Coach Notes</h3>
            <p style="color: #78350f; font-size: 14px; margin-bottom: 0;">${data.notes}</p>
          </div>
          ` : ""}
          
          <div style="padding: 24px; background-color: #ffffff;">
            <h3 style="margin-top: 0; color: #1f2937; font-size: 16px;">Raw Scan Data</h3>
            <div style="border:1px solid #e5e7eb;border-radius:6px;overflow:auto;">
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                ${rawDataRows}
              </table>
            </div>
          </div>
          
          <div style="background-color: #f9fafb; padding: 16px 24px; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              This is an internal email \u2014 the coachee was NOT notified. Sent automatically from the Coaching Cockpit.
            </p>
          </div>
        </div>
      `
    });
    console.log(`\u2705 Coach-only email sent to: ${coachEmails.join(", ")} for coachee: ${coacheeName}`);
    return true;
  } catch (error) {
    console.error(`\u274C Failed to send coach-only email:`, error);
    return false;
  }
}
async function sendPortalDataExportEmail(email, name, exportData) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log("\u23F8\uFE0F Resend disabled \u2014 skipping portal data export email");
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const eventCount = exportData.timeline.length;
    const exportDate = (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    await client.emails.send({
      from: fromEmail,
      to: email,
      subject: "Your Communication Journey Data Export",
      html: brandedEmailWrapper(
        "Your Data Export",
        `Exported on ${exportDate}`,
        `
          <p style="color: #cccccc; font-size: 15px; line-height: 1.8;">
            Hi${name ? ` ${name}` : ""},
          </p>
          <p style="color: #cccccc; font-size: 15px; line-height: 1.8;">
            Here is your complete GreenElephant communication journey data. This export contains
            <strong style="color: #009999;">${eventCount} timeline event${eventCount !== 1 ? "s" : ""}</strong>
            and your stored preferences.
          </p>
          <div style="background: #111; border: 1px solid #222; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; margin: 0 0 8px;">Attached below as JSON:</p>
            <pre style="color: #009999; font-size: 11px; white-space: pre-wrap; word-break: break-all; margin: 0;">${JSON.stringify(exportData, null, 2).slice(0, 3e3)}${JSON.stringify(exportData).length > 3e3 ? "\n... (truncated \u2014 full data in attachment)" : ""}</pre>
          </div>
          <p style="color: #888; font-size: 13px;">
            You can re-export your data anytime from your portal Settings page.
          </p>
        `,
        "This email was sent because you requested a data export from your GreenElephant portal account. Under GDPR Article 20, you have the right to receive your personal data in a structured, commonly used format. If you did not request this, please contact us at hello@greenelephant.org."
      )
    });
    console.log(`\u2705 Portal data export email sent to: ${email}`);
    return true;
  } catch (error) {
    console.error("\u274C Failed to send portal data export email:", error);
    return false;
  }
}
async function sendNudgeDevNotification(userId, context) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log("\u23F8\uFE0F Resend disabled \u2014 skipping nudge dev notification");
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    const adminEmail = "esteve@greenelephant.org";
    const timestamp2 = (/* @__PURE__ */ new Date()).toLocaleString("en-GB", { timeZone: "Europe/Amsterdam", dateStyle: "medium", timeStyle: "short" });
    await client.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `Portal Nudge: User ${userId} needs attention`,
      html: brandedEmailWrapper(
        "Portal Nudge",
        "A portal user is requesting help",
        `
        ${darkCard(`
          <p style="color:#009999;font-size:13px;font-weight:600;margin:0 0 8px 0;text-transform:uppercase;letter-spacing:0.5px;">User Details</p>
          <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0;">
            <strong style="color:#e5e5e5;">User ID:</strong> ${userId}<br/>
            <strong style="color:#e5e5e5;">Time:</strong> ${timestamp2}
          </p>
        `, "#009999")}
        ${darkCard(`
          <p style="color:#009999;font-size:13px;font-weight:600;margin:0 0 8px 0;text-transform:uppercase;letter-spacing:0.5px;">Context</p>
          <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0;">${context}</p>
        `, "#e8833a")}
        <p style="color:#888888;font-size:13px;line-height:1.6;margin:24px 0 0 0;">
          This nudge was sent from the GreenElephant portal dashboard. Check in with this user to see how you can help.
        </p>
        `,
        "This is an internal admin notification from GreenElephant.org portal. You received this because a portal user used the 'Nudge Dev Team' feature."
      )
    });
    console.log(`\u2705 Nudge dev notification sent for user: ${userId}`);
    return true;
  } catch (error) {
    console.error("\u274C Failed to send nudge dev notification:", error);
    return false;
  }
}
async function sendPasswordResetEmail(email, resetUrl) {
  try {
    if (!await isConnectorEnabled("resend")) {
      console.log("\u23F8\uFE0F Resend disabled \u2014 skipping password reset email");
      return false;
    }
    const { client, fromEmail } = await getUncachableResendClient();
    await client.emails.send({
      from: fromEmail,
      to: email,
      subject: "Reset your GreenElephant password",
      html: brandedEmailWrapper(
        "Password reset",
        "You requested a password reset",
        `
        <p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 20px 0;">
          Click the button below to set a new password. This link expires in 1 hour.
        </p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${resetUrl}" style="display:inline-block;padding:14px 36px;background:#009999;color:#ffffff;text-decoration:none;border-radius:8px;font-family:'Poppins',sans-serif;font-weight:600;font-size:15px;">
            Reset password
          </a>
        </div>
        <p style="color:#888888;font-size:13px;line-height:1.6;margin:24px 0 0 0;">
          If you didn't request this, you can safely ignore this email. Your password won't change.
        </p>
        `,
        "You received this email because a password reset was requested for your GreenElephant portal account. If you did not make this request, no action is needed."
      )
    });
    console.log(`\u2705 Password reset email sent to: ${email}`);
    return true;
  } catch (error) {
    console.error("\u274C Failed to send password reset email:", error);
    return false;
  }
}
var FLOW_ZONE_CONFIG;
var init_email_notifications = __esm({
  "server/email-notifications.ts"() {
    "use strict";
    init_resend_client();
    init_connectorGuard();
    FLOW_ZONE_CONFIG = {
      flow: {
        label: "Flow Zone",
        color: "#009999",
        description: "Your perceived challenge and competence are well-balanced, and your motivation is strong. This is the optimal state for growth and engagement.",
        advice: "Keep nurturing this balance. The Satellite Scan can reveal which of the other 7 communication lenses are also in flow &mdash; and which might need attention.",
        recommendations: [
          "Protect this state&mdash;notice what conditions create it so you can replicate them",
          "Talk to a colleague about what is working &mdash; it can help them find their rhythm too",
          "Consider increasing complexity gradually to keep growing"
        ]
      },
      challenge: {
        label: "Challenge / Stress Zone",
        color: "#e67e22",
        description: "You perceive high challenge but feel your competence isn&rsquo;t matching up. This can lead to stress, anxiety, or feeling overwhelmed.",
        advice: "The key is to boost your perceived competence &mdash; through feedback, structure, or skill-building. The full Satellite Scan maps exactly where to focus.",
        recommendations: [
          "Ask trusted colleagues to share what they notice you doing well",
          "Break the challenge into smaller, manageable sub-tasks",
          "Request mentoring or pair up with someone experienced in this area",
          "Bring more structure to the situation &mdash; a clear agenda, a time limit, written preparation"
        ]
      },
      comfort: {
        label: "Comfort Zone",
        color: "#3b82f6",
        description: "You feel capable but the challenge is low. This can feel safe but may lead to boredom or disengagement over time.",
        advice: "Consider raising the challenge level &mdash; take on a new communication role, or explore a different lens. The Satellite Scan shows you how.",
        recommendations: [
          "Volunteer for a stretch role &mdash; host a session, mentor someone, or take notes for the group",
          "Set a personal challenge within the situation (e.g., ask a question you&rsquo;ve been avoiding)",
          "Explore adjacent skills that would raise the challenge level",
          "Reflect on whether staying comfortable is holding you back from a more meaningful challenge"
        ]
      },
      danger: {
        label: "Danger / Apathy Zone",
        color: "#ef4444",
        description: "Both perceived challenge and competence are low, often combined with low motivation. This zone signals disengagement or burnout risk.",
        advice: "Start small &mdash; find one micro-win to rebuild momentum. The Satellite Scan can identify which lenses hold the most potential for re-engagement.",
        recommendations: [
          "Reconnect with your purpose &mdash; why does this situation matter to you?",
          "Ask for honest perspective from a trusted peer or coach",
          "Ask yourself honestly whether this situation is the right fit for your energy right now",
          "Start small &mdash; identify one specific communication habit to practise today"
        ]
      }
    };
  }
});

// server/lib/googleSheets.ts
var googleSheets_exports = {};
__export(googleSheets_exports, {
  getSheetData: () => getSheetData,
  getUncachableGoogleSheetClient: () => getUncachableGoogleSheetClient
});
import { google } from "googleapis";
async function getAccessToken2() {
  if (connectionSettings2 && connectionSettings2.settings.expires_at && new Date(connectionSettings2.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings2.settings.access_token;
  }
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY ? "repl " + process.env.REPL_IDENTITY : process.env.WEB_REPL_RENEWAL ? "depl " + process.env.WEB_REPL_RENEWAL : null;
  if (!xReplitToken) {
    throw new Error("X_REPLIT_TOKEN not found for repl/depl");
  }
  connectionSettings2 = await fetch(
    "https://" + hostname + "/api/v2/connection?include_secrets=true&connector_names=google-sheet",
    {
      headers: {
        "Accept": "application/json",
        "X_REPLIT_TOKEN": xReplitToken
      }
    }
  ).then((res) => res.json()).then((data) => data.items?.[0]);
  const accessToken = connectionSettings2?.settings?.access_token || connectionSettings2.settings?.oauth?.credentials?.access_token;
  if (!connectionSettings2 || !accessToken) {
    throw new Error("Google Sheet not connected");
  }
  return accessToken;
}
async function getUncachableGoogleSheetClient() {
  const accessToken = await getAccessToken2();
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });
  return google.sheets({ version: "v4", auth: oauth2Client });
}
async function getSheetData(spreadsheetId, range) {
  if (!await isConnectorEnabled("google-sheets")) {
    console.log("\u23F8\uFE0F Google Sheets connector disabled \u2014 skipping data fetch");
    return [];
  }
  const sheets = await getUncachableGoogleSheetClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range
  });
  return response.data.values || [];
}
var connectionSettings2;
var init_googleSheets = __esm({
  "server/lib/googleSheets.ts"() {
    "use strict";
    init_connectorGuard();
  }
});

// server/lib/thesysApi.ts
var thesysApi_exports = {};
__export(thesysApi_exports, {
  generateDashboardUI: () => generateDashboardUI,
  generateElementPrompt: () => generateElementPrompt,
  generateFlywheelContent: () => generateFlywheelContent,
  generateJourneyAIResponse: () => generateJourneyAIResponse,
  generateLeadListSuggestions: () => generateLeadListSuggestions,
  generateLinkedInPoll: () => generateLinkedInPoll,
  generatePMFAssumptions: () => generatePMFAssumptions,
  generateSeoSuggestions: () => generateSeoSuggestions,
  generateSocialCopy: () => generateSocialCopy,
  getCurrentLens: () => getCurrentLens,
  portalAiChat: () => portalAiChat,
  streamDashboardUI: () => streamDashboardUI
});
import OpenAI from "openai";
async function generateDashboardUI(prompt, data) {
  if (!await isConnectorEnabled("thesys")) {
    console.log("\u23F8\uFE0F Thesys connector disabled \u2014 skipping dashboard UI generation");
    return '<div style="padding:2rem;text-align:center;color:#666;">Thesys connector is currently disabled. Enable it in Admin &gt; Connected Tools.</div>';
  }
  const systemPrompt = `You are a UI generator for GreenElephant's Conscious Communication dashboard.
You MUST return a COMPLETE, SELF-CONTAINED HTML document that can be rendered inside an iframe srcDoc.
Include all CSS inline or in a <style> tag. Include any JavaScript for charts inline in a <script> tag.
Do NOT return JSON, component trees, or React/JSX \u2014 return ONLY valid HTML.

For charts, use inline SVG or a CDN-loaded library like Chart.js via <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>.

Use these lens colors:
- Influence: #cc3333 (red)
- Attitude: #e8833a (orange)
- Chaordic: #e8c840 (yellow)
- Flow: #33a854 (green)
- Alignment: #009999 (teal)
- Needs: #33a854 (green)
- Ego: #3b7dd8 (blue)
- Dynamics: #9933cc (purple)

Style guidelines:
- Dark background (#0a0a0a or #111) with light text (#e5e5e5)
- Use cards with bg: rgba(255,255,255,0.05), border: 1px solid rgba(255,255,255,0.1), border-radius: 12px
- Font: system-ui, -apple-system, sans-serif
- Professional, clean layout with good spacing
- Responsive \u2014 works at any width

Your response must start with <!DOCTYPE html> or <html> and be valid HTML.`;
  const userMessage = data ? `${prompt}

Here is the data to visualize:
${JSON.stringify(data, null, 2)}` : prompt;
  try {
    const response = await thesysClient.chat.completions.create({
      model: "c1/anthropic/claude-sonnet-4/v-20250930",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });
    let rawContent = response.choices[0]?.message?.content || "";
    console.log("[Dashboard UI] Raw response type:", typeof rawContent, "value preview:", typeof rawContent === "string" ? rawContent.substring(0, 120) : JSON.stringify(rawContent).substring(0, 120));
    if (typeof rawContent === "object" && rawContent !== null) {
      console.log("[Dashboard UI] Content is an object, converting to HTML via component tree");
      return convertComponentTreeToHtml(rawContent);
    }
    let content = String(rawContent);
    const decodeEntities = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    if (content.includes("<content thesys=")) {
      content = content.replace(/<content thesys="true">/g, "").replace(/<\/content>/g, "");
      content = decodeEntities(content);
      console.log("[Dashboard UI] After thesys unwrap, starts with:", content.trim().substring(0, 80));
    }
    const trimmed = content.trim();
    const looksLikeJson = trimmed.startsWith("{") || trimmed.startsWith("[") || trimmed.includes('"component"');
    const looksLikeHtml = trimmed.startsWith("<!") || trimmed.startsWith("<html") || trimmed.startsWith("<") && !looksLikeJson;
    if (looksLikeJson && !looksLikeHtml) {
      console.log("[Dashboard UI] Detected JSON component tree, converting to HTML");
      try {
        const parsed = JSON.parse(trimmed);
        content = convertComponentTreeToHtml(parsed);
      } catch {
        const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            content = convertComponentTreeToHtml(parsed);
          } catch {
            content = convertComponentTreeToHtml(JSON.parse("{" + trimmed.split("{").slice(1).join("{").split("}").slice(0, -1).join("}") + "}") || trimmed);
          }
        }
        if (content === trimmed || !content.includes("<html")) {
          content = `<!DOCTYPE html><html><body style="background:#0a0a0a;color:#e5e5e5;font-family:system-ui,sans-serif;padding:2rem;"><pre style="white-space:pre-wrap;word-break:break-word;">${trimmed.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></body></html>`;
        }
      }
    }
    if (!content.includes("<") || !content.includes("<html") && !content.includes("<div") && !content.includes("<svg") && !content.includes("<table") && !content.includes("<canvas")) {
      content = `<!DOCTYPE html><html><body style="background:#0a0a0a;color:#e5e5e5;font-family:system-ui,sans-serif;padding:2rem;"><div>${content}</div></body></html>`;
    }
    if (!content.includes("<html")) {
      content = `<!DOCTYPE html><html><head><style>body{background:#0a0a0a;color:#e5e5e5;font-family:system-ui,-apple-system,sans-serif;margin:0;padding:2rem;}</style></head><body>${content}</body></html>`;
    }
    console.log("[Dashboard UI] Final output starts with:", content.substring(0, 100));
    return content;
  } catch (error) {
    console.error("Thesys API error:", error);
    throw error;
  }
}
function convertComponentTreeToHtml(tree) {
  if (!tree || typeof tree !== "object") return String(tree || "");
  if (tree.component && typeof tree.component === "object") {
    return convertComponentTreeToHtml(tree.component);
  }
  const lensColors = {
    influence: "#cc3333",
    attitude: "#e8833a",
    chaordic: "#e8c840",
    flow: "#33a854",
    alignment: "#009999",
    needs: "#33a854",
    ego: "#3b7dd8",
    dynamics: "#9933cc"
  };
  const renderNode = (node) => {
    if (!node) return "";
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(renderNode).join("");
    if (node.component && typeof node.component === "object") {
      return renderNode(node.component);
    }
    const comp = String(node.component || node.type || "");
    const props = node.props || {};
    const children = props.children || node.children || [];
    const childHtml = Array.isArray(children) ? children.map(renderNode).join("") : renderNode(children);
    switch (comp.toLowerCase()) {
      case "card":
        return `<div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:1.5rem;margin-bottom:1rem;">${childHtml}</div>`;
      case "header":
      case "inlineheader":
        return `<div style="margin-bottom:1rem;"><h2 style="margin:0;font-size:1.25rem;color:#e5e5e5;">${props.title || props.heading || ""}</h2>${props.subtitle || props.description ? `<p style="margin:0.25rem 0 0;font-size:0.875rem;color:rgba(255,255,255,0.5);">${props.subtitle || props.description}</p>` : ""}</div>`;
      case "textcontent":
      case "text":
        return `<p style="color:rgba(255,255,255,0.7);line-height:1.6;font-size:0.9rem;">${props.textMarkdown || props.text || childHtml}</p>`;
      case "minicardblock":
        return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin:1rem 0;">${childHtml}</div>`;
      case "minicard":
        return `<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:1rem;">${childHtml}</div>`;
      case "datatile":
        return `<div style="text-align:center;"><div style="font-size:1.5rem;font-weight:700;color:#009999;">${props.amount || ""}</div><div style="font-size:0.75rem;color:rgba(255,255,255,0.5);margin-top:0.25rem;">${props.description || ""}</div></div>`;
      case "barchartv2":
      case "barchart": {
        const chartData = props.chartData || {};
        const innerData = chartData.data || chartData;
        const labels = innerData.labels || chartData.labels || [];
        const series = innerData.series || chartData.series || innerData.datasets || [];
        const maxVal = Math.max(...series[0]?.values || [1], 1);
        let bars = "";
        labels.forEach((label, i) => {
          const val = series[0]?.values?.[i] || 0;
          const pct = val / maxVal * 100;
          const color = lensColors[label.toLowerCase()] || "#009999";
          bars += `<div style="display:flex;align-items:center;gap:0.75rem;margin:0.5rem 0;">
            <div style="width:80px;font-size:0.75rem;color:rgba(255,255,255,0.6);text-align:right;">${label}</div>
            <div style="flex:1;background:rgba(255,255,255,0.05);border-radius:4px;height:28px;overflow:hidden;">
              <div style="height:100%;width:${pct}%;background:${color};border-radius:4px;display:flex;align-items:center;padding:0 8px;">
                <span style="font-size:0.7rem;color:#fff;font-weight:600;">${val}%</span>
              </div>
            </div>
          </div>`;
        });
        return `<div style="margin:1rem 0;">${props.title ? `<h3 style="font-size:1rem;margin-bottom:0.75rem;color:#e5e5e5;">${props.title}</h3>` : ""}${bars}</div>`;
      }
      case "sectionblock": {
        const sections = props.sections || [];
        let html = "";
        sections.forEach((s) => {
          html += `<details style="margin:0.5rem 0;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:1rem;" ${s.isFoldable === false ? "open" : ""}>
            <summary style="cursor:pointer;font-weight:600;color:#e5e5e5;font-size:0.9rem;">${s.title || ""}</summary>
            <p style="margin-top:0.5rem;color:rgba(255,255,255,0.5);font-size:0.85rem;">${s.subtitle || ""}</p>
          </details>`;
        });
        return html;
      }
      case "list": {
        const items = props.items || [];
        let html = '<ul style="list-style:none;padding:0;margin:0.5rem 0;">';
        items.forEach((item) => {
          html += `<li style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:flex-start;gap:0.5rem;">
            <span style="color:rgba(255,255,255,0.3);">&#8226;</span>
            <div><strong style="color:#e5e5e5;">${item.title || ""}</strong><br/><span style="color:rgba(255,255,255,0.5);font-size:0.85rem;">${item.subtitle || ""}</span></div>
          </li>`;
        });
        html += "</ul>";
        return html;
      }
      default:
        return childHtml || JSON.stringify(node).substring(0, 200);
    }
  };
  const bodyHtml = renderNode(tree);
  return `<!DOCTYPE html><html><head><style>body{background:#0a0a0a;color:#e5e5e5;font-family:system-ui,-apple-system,sans-serif;margin:0;padding:2rem;line-height:1.5;}</style></head><body>${bodyHtml}</body></html>`;
}
async function generateSocialCopy() {
  if (!await isConnectorEnabled("thesys")) {
    console.log("\u23F8\uFE0F Thesys connector disabled \u2014 skipping social copy generation");
    throw new Error("Thesys connector is currently disabled. Enable it in Admin > Connected Tools.");
  }
  const systemPrompt = `You are a brand copywriter for GreenElephant.org \u2014 a Conscious Communication platform.

Write a LinkedIn "About" section for the GreenElephant.org company/organization page. It must:
- Write from the organization's perspective ("We" / "At GreenElephant"), NOT from any individual's perspective
- Position GreenElephant as a coaching, facilitation, and research platform for conscious communication
- Reference the Periodic Table of Conscious Communication with its 8 lenses: Influence (red), Attitude (orange), Chaordic (yellow), Flow (green-yellow), Alignment (sage green), Needs (teal), Ego (blue), and Dynamics (purple)
- Mention the Satellite Scan (communication profiling tool), Check-my-FLOW assessment, and Speech Lab (decoding hub)
- Reference the three core audiences: Executive Assistants, TEAL startup founders, and Design & Innovation students
- Include a call-to-action pointing to greenelephant.org
- Use first-person plural ("we"), warm and approachable tone \u2014 no buzzwords, no corporate clich\xE9s
- Hard limit: the ENTIRE response must be 2000 characters or fewer (this is the LinkedIn About section character limit)
- Do NOT include any markdown, headers, or formatting \u2014 just plain text paragraphs
- Do NOT wrap the text in quotes
- Do NOT mention any individual names (no Est\xE8ve, no Anu) \u2014 speak as the organization`;
  try {
    const response = await thesysClient.chat.completions.create({
      model: "c1/anthropic/claude-sonnet-4/v-20250930",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Write a fresh LinkedIn About section for the GreenElephant.org organization page. Keep it under 2000 characters total." }
      ]
    });
    let content = response.choices[0]?.message?.content || "";
    const decodeEntities = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    if (content.includes("<content thesys=")) {
      let inner = content.replace(/<content thesys="true">/g, "").replace(/<\/content>/g, "");
      inner = decodeEntities(inner);
      try {
        const parsed = JSON.parse(inner);
        const extractText = (obj) => {
          if (typeof obj === "string") return obj;
          if (!obj || typeof obj !== "object") return "";
          if (obj.textMarkdown) return obj.textMarkdown;
          if (obj.text) return obj.text;
          if (obj.props) return extractText(obj.props);
          if (obj.children) {
            if (Array.isArray(obj.children)) return obj.children.map(extractText).filter(Boolean).join("\n\n");
            return extractText(obj.children);
          }
          if (obj.component) return extractText(obj);
          return Object.values(obj).map((v) => extractText(v)).filter(Boolean).join("\n\n");
        };
        content = extractText(parsed);
      } catch {
        const mdMatch = inner.match(/"textMarkdown"\s*:\s*"((?:[^"\\]|\\.)*)"/);
        if (mdMatch) {
          content = mdMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\'/g, "'");
        } else {
          const textMatch = inner.match(/"text"\s*:\s*"((?:[^"\\]|\\.)*)"/);
          if (textMatch) {
            content = textMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\'/g, "'");
          }
        }
      }
    }
    content = content.replace(/\\n/g, "\n").trim();
    if (content.length > 2e3) {
      content = content.substring(0, 1997) + "...";
    }
    return content;
  } catch (error) {
    console.error("Thesys API error (social copy):", error);
    throw error;
  }
}
function getCurrentLens() {
  const month = (/* @__PURE__ */ new Date()).getMonth() + 1;
  return LENS_ROTATION[month] || LENS_ROTATION[1];
}
function stripMarkdown(text2) {
  return text2.replace(/^#{1,6}\s+/gm, "").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").replace(/__([^_]+)__/g, "$1").replace(/_([^_]+)_/g, "$1").replace(/`([^`]+)`/g, "$1").replace(/```[\s\S]*?```/g, "").replace(/^\s*[-*+]\s/gm, "- ").replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)").trim();
}
function normalizePollOutput(raw) {
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (parsed && parsed.question && Array.isArray(parsed.options)) {
      const lines = [
        `QUESTION: ${parsed.question}`,
        "",
        ...parsed.options.map((opt, i) => `${String.fromCharCode(65 + i)}) ${opt}`),
        "",
        `CONTEXT: ${parsed.context || ""}`
      ];
      return lines.join("\n");
    }
  } catch {
    const nestedJson = raw.match(/\{[\s\S]*"question"[\s\S]*"options"[\s\S]*\}/);
    if (nestedJson) {
      try {
        const parsed = JSON.parse(nestedJson[0]);
        if (parsed.question && Array.isArray(parsed.options)) {
          const lines = [
            `QUESTION: ${parsed.question}`,
            "",
            ...parsed.options.map((opt, i) => `${String.fromCharCode(65 + i)}) ${opt}`),
            "",
            `CONTEXT: ${parsed.context || ""}`
          ];
          return lines.join("\n");
        }
      } catch {
      }
    }
  }
  if (raw.includes("QUESTION:") || raw.match(/[A-D]\)/)) {
    return stripMarkdown(raw);
  }
  return stripMarkdown(raw);
}
async function generateLinkedInPoll(topicContext) {
  if (!await isConnectorEnabled("thesys")) {
    throw new Error("Thesys connector is currently disabled. Enable it in Admin > Connected Tools.");
  }
  const lens = getCurrentLens();
  const monthName = (/* @__PURE__ */ new Date()).toLocaleString("en", { month: "long" });
  const systemPrompt = `You are a LinkedIn engagement strategist for GreenElephant.org, a Conscious Communication platform.

${GBR_FRAMEWORK}

${BRAND_CONTEXT}

Your job is to create a LinkedIn poll that sparks professional conversation about communication, leadership, and human connection \u2014 tied to the current lens and current global events.`;
  const userMessage = `Create a LinkedIn poll for the GreenElephant company page.

Current month: ${monthName} 2026
Current lens: ${lens.name} \u2014 "${lens.description}"

Additional context: ${topicContext}

Think about current news, geopolitical trends, workplace shifts, and how they connect to the ${lens.name} lens and conscious communication themes from the GreenElephant webinars.

IMPORTANT: Respond with ONLY this JSON and nothing else \u2014 no markdown, no code fences:
{
  "question": "The poll question (max 140 characters)",
  "options": ["Option A (max 30 chars)", "Option B (max 30 chars)", "Option C (max 30 chars)", "Option D (max 30 chars)"],
  "context": "2-3 sentences to post above the poll that provide context, spark curiosity, and tie back to the ${lens.name} lens. Plain text, no markdown."
}`;
  try {
    const response = await thesysClient.chat.completions.create({
      model: "c1/anthropic/claude-sonnet-4/v-20250930",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });
    let content = response.choices[0]?.message?.content || "";
    if (content.includes("<content thesys=")) {
      content = content.replace(/<content thesys="true">/g, "").replace(/<\/content>/g, "");
      content = content.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    }
    const jsonMatch = content.match(/\{[\s\S]*"question"[\s\S]*"options"[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        question: String(parsed.question || "").slice(0, 140),
        options: (parsed.options || []).slice(0, 4).map((o) => String(o).slice(0, 30)),
        context: stripMarkdown(String(parsed.context || ""))
      };
    }
    throw new Error("Could not parse poll response from AI");
  } catch (error) {
    console.error("Thesys API error (poll):", error);
    throw error;
  }
}
async function generateElementPrompt(elementCode, elementName, elementSymbol, elementLens, elementCategory, elementDescription, existingPrompt, roleCategory, customInstructions) {
  if (!await isConnectorEnabled("thesys")) {
    throw new Error("Thesys connector is currently disabled. Enable it in Admin > Connected Tools.");
  }
  const lens = getCurrentLens();
  const systemPrompt = `You are a prompt engineer and communication coach for GreenElephant.org's Periodic Table of Conscious Communication.

${GBR_FRAMEWORK}

${BRAND_CONTEXT}

Your job is to create a high-quality prompt library entry for a specific element from the Periodic Table. Each prompt should help users (EAs, TEAL founders, Design students) practice conscious communication using this element.

The prompt you create will be added to the Prompt Library on greenelephant.org, where users can copy-paste it into AI tools (like ChatGPT) to get personalised communication coaching.`;
  const userMessage = `Create a prompt library entry for this Periodic Table element:

ELEMENT: ${elementName} (${elementSymbol}, code ${elementCode})
LENS: ${elementLens}
CATEGORY: ${elementCategory || "General"}
DESCRIPTION: ${elementDescription || "No description available"}
EXISTING EXAMPLE PROMPT: ${existingPrompt || "None"}
TARGET AUDIENCE: ${roleCategory === "all" ? "All audiences" : roleCategory === "EA" ? "Executive Assistants" : roleCategory === "ACX" ? "ACX Prompt Engineers" : "Teal Organization Leaders"}
CURRENT MONTH LENS: ${lens.name} \u2014 "${lens.description}"

${customInstructions ? `CUSTOM INSTRUCTIONS FROM ADMIN:
${customInstructions}
` : ""}

IMPORTANT: Respond with EXACTLY this JSON and nothing else \u2014 no markdown, no code fences:
{
  "title": "A compelling title for this prompt (e.g., 'Deep Influence Pattern Analysis', 'Flow State Communication Audit'). Keep it specific to this element.",
  "description": "A 1-2 sentence description of what this prompt helps users do. Written in plain language for the website.",
  "whatItDoes": ["First thing this prompt does", "Second thing", "Third thing", "Fourth thing (optional)", "Fifth thing (optional)"],
  "perfectFor": "Describe the ideal scenario when someone would use this prompt. Be specific about the user's situation.",
  "promptContent": "The full AI prompt template (200-400 words). This is what users will copy into ChatGPT or similar. It should:\\n- Reference the ${elementName} element and its concepts\\n- Include [[DATA_START]] and [[DATA_END]] markers where users paste their Satellite Scan data\\n- Ask the AI to analyse communication patterns through the ${elementLens} lens\\n- Provide specific, actionable coaching advice\\n- Use warm, grounded, evidence-based language (never preachy)\\n- End with a micro-habit suggestion tied to the element"
}`;
  try {
    const response = await thesysClient.chat.completions.create({
      model: "c1/anthropic/claude-sonnet-4/v-20250930",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });
    let content = response.choices[0]?.message?.content || "";
    if (content.includes("<content thesys=")) {
      content = content.replace(/<content thesys="true">/g, "").replace(/<\/content>/g, "");
      content = content.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    }
    const jsonMatch = content.match(/\{[\s\S]*"title"[\s\S]*"promptContent"[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: stripMarkdown(String(parsed.title || elementName)),
        description: stripMarkdown(String(parsed.description || "")),
        whatItDoes: Array.isArray(parsed.whatItDoes) ? parsed.whatItDoes.map((s) => stripMarkdown(s)) : ["Analyses communication patterns"],
        perfectFor: stripMarkdown(String(parsed.perfectFor || "")),
        promptContent: String(parsed.promptContent || "")
      };
    }
    throw new Error("Could not parse prompt response from AI");
  } catch (error) {
    console.error("Thesys API error (element prompt):", error);
    throw error;
  }
}
async function generateFlywheelContent(generatorType, customPrompt, pipelineContext) {
  if (!await isConnectorEnabled("thesys")) {
    throw new Error("Thesys connector is currently disabled. Enable it in Admin > Connected Tools.");
  }
  const lens = getCurrentLens();
  const monthName = (/* @__PURE__ */ new Date()).toLocaleString("en", { month: "long" });
  const generatorPrompts = {
    headlines: `You are a communication analyst for GreenElephant.org. Your task is to find a CURRENT, trending speech, press conference, CEO statement, or political address from the news and decode it through the GBR (Green-Blue-Red) framework.

This month's lens is ${lens.name} (${lens.hexColor}, code ${lens.code}): "${lens.description}". Weave this lens angle into your analysis.

${GBR_FRAMEWORK}

${BRAND_CONTEXT}

${pipelineContext ? `Current priorities from the GreenElephant Pipeline OS:
${pipelineContext}

Weave relevant priorities into the content angle where natural.` : ""}

The user may have customised the prompt below. Follow their instructions but always produce the required output format.`,
    "ai-gap": `You are a thought-leadership writer for GreenElephant.org. Your task is to write about what humans can do in communication that AI cannot \u2014 tied to the current month's lens.

This month's lens is ${lens.name} (${lens.hexColor}, code ${lens.code}): "${lens.description}". The piece should demonstrate why this specific human communication skill matters MORE in an AI-saturated world.

${GBR_FRAMEWORK}

${BRAND_CONTEXT}

${pipelineContext ? `Current priorities from the GreenElephant Pipeline OS:
${pipelineContext}

Weave relevant priorities into the content angle where natural.` : ""}

The user may have customised the prompt below. Follow their instructions but always produce the required output format.`,
    workplace: `You are a workplace communication coach for GreenElephant.org. Your task is to create a practical, real-world workplace scenario that EAs, VAs, and team leads face \u2014 decode it through GBR, and provide a conscious rewrite.

This month's lens is ${lens.name} (${lens.hexColor}, code ${lens.code}): "${lens.description}". Tie the scenario to a current workplace trend (return-to-office, async communication, generational tension, AI-augmented teams, etc.).

${GBR_FRAMEWORK}

${BRAND_CONTEXT}

${pipelineContext ? `Current priorities from the GreenElephant Pipeline OS:
${pipelineContext}

Weave relevant priorities into the content angle where natural.` : ""}

The user may have customised the prompt below. Follow their instructions but always produce the required output format.`,
    "case-study": `You are a case study writer for GreenElephant.org. Your task is to create a compelling client transformation narrative from a Satellite Scan coaching journey \u2014 showing before/after communication patterns, key breakthroughs, and quotable outcomes.

This month's lens is ${lens.name} (${lens.hexColor}, code ${lens.code}): "${lens.description}". The case study should highlight transformation through this specific lens.

${GBR_FRAMEWORK}

${BRAND_CONTEXT}

${pipelineContext ? `Current priorities from the GreenElephant Pipeline OS:
${pipelineContext}

Weave relevant priorities into the narrative where natural.` : ""}

IMPORTANT: All client names must be fictional but realistic. The case study should feel authentic \u2014 include specific metrics (team feedback scores, meeting efficiency improvements, conflict reduction percentages), direct quotes from the "client", and a clear before\u2192intervention\u2192after arc. Output should work as both a LinkedIn article and website testimonial page copy.

The user may have customised the prompt below. Follow their instructions but always produce the required output format.`
  };
  const systemPrompt = generatorPrompts[generatorType] || generatorPrompts.headlines;
  const userMessage = `${customPrompt}

IMPORTANT: You MUST respond with EXACTLY this JSON structure and nothing else. No markdown, no code fences, just raw JSON:
{
  "article": "A LinkedIn article draft (800-1200 words) for Esteve Pannetier's personal LinkedIn profile. CRITICAL FORMATTING RULES: Do NOT use markdown. No #, ##, **, *, or backticks. Use PLAIN TEXT only \u2014 LinkedIn does not render markdown. Use ALL CAPS or line breaks for emphasis instead. Use line breaks between paragraphs. Include a compelling hook on the first line, GBR analysis with specific element references, and end with a call-to-action pointing to greenelephant.org. Month: ${monthName}. Lens: ${lens.name}.",
  "poll": "A LinkedIn poll for the GreenElephant company page. Return a JSON object (nested inside this string as valid JSON) with exactly these keys: {question: string (max 140 chars), options: [string, string, string, string] (each max 30 chars), context: string (2-3 sentences to post above the poll)}. The poll must relate to the article topic and the ${lens.name} lens.",
  "artDirection": "Two Canva visual suggestions in PLAIN TEXT (no markdown). Separate with a blank line.\\n\\nFOR ANU (photo composite): Describe a professional photo concept using Anu's face/portrait with a situational background that fits the content topic. Be specific about mood, colors, overlays.\\n\\nFOR ESTEVE (hand-sketch): Describe a whiteboard/hand-drawn style diagram, framework visualization, or 'How Might We' design question. Reference specific GBR elements or lens concepts. Think theoretical, academic, visual."
}`;
  try {
    const response = await thesysClient.chat.completions.create({
      model: "c1/anthropic/claude-sonnet-4/v-20250930",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });
    let content = response.choices[0]?.message?.content || "";
    if (content.includes("<content thesys=")) {
      content = content.replace(/<content thesys="true">/g, "").replace(/<\/content>/g, "");
      content = content.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    }
    const jsonMatch = content.match(/\{[\s\S]*"article"[\s\S]*"poll"[\s\S]*"artDirection"[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        const article = stripMarkdown(parsed.article || "");
        const artDirection = stripMarkdown(parsed.artDirection || "");
        const poll = normalizePollOutput(parsed.poll || "");
        return { article, poll, artDirection };
      } catch {
      }
    }
    return {
      article: stripMarkdown(content),
      poll: "Could not parse poll \u2014 see article for full output.",
      artDirection: "Could not parse art direction \u2014 see article for full output."
    };
  } catch (error) {
    console.error("Thesys API error (flywheel):", error);
    throw error;
  }
}
async function generateSeoSuggestions(generatorType, contentSummary) {
  if (!await isConnectorEnabled("thesys")) {
    throw new Error("Thesys connector is currently disabled.");
  }
  const lens = getCurrentLens();
  const systemPrompt = `You are an SEO/GEO specialist for GreenElephant.org \u2014 a Conscious Communication platform.
Your job is to analyse content that was just generated and suggest SEO improvements for the website.

${GBR_FRAMEWORK}

The site has these key pages:
- /scan \u2014 Satellite Scan (communication profiling tool)
- /flow-check \u2014 Check-my-FLOW assessment
- /decode \u2014 Speech Lab / Decoding Hub
- /periodic-table \u2014 Periodic Table of Conscious Communication
- /coaching \u2014 Coaching services
- /webinar \u2014 Monthly lens webinars
- /connect \u2014 Contact page

Current month's lens: ${lens.name} (${lens.description})`;
  const userMessage = `Analyse this content and suggest SEO improvements:

${contentSummary}

Respond with EXACTLY this JSON structure, no markdown, no code fences:
{
  "keywords": ["keyword1", "keyword2", "long-tail phrase 1", "long-tail phrase 2"],
  "faqItems": [
    {"question": "A natural question someone might search", "answer": "A concise, informative answer (2-3 sentences)"}
  ],
  "internalLinks": ["Brief suggestion for which pages should cross-link to this topic"],
  "targetPage": "/decode"
}

Provide 6-10 keywords (mix of short and long-tail), 2-3 FAQ items, and 2-3 internal linking suggestions. The targetPage should be the most relevant existing page.`;
  try {
    const response = await thesysClient.chat.completions.create({
      model: "c1/anthropic/claude-sonnet-4/v-20250930",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });
    let content = response.choices[0]?.message?.content || "";
    if (content.includes("<content thesys=")) {
      content = content.replace(/<content thesys="true">/g, "").replace(/<\/content>/g, "");
      content = content.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    }
    const jsonMatch = content.match(/\{[\s\S]*"keywords"[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
      }
    }
    return { keywords: [], faqItems: [], internalLinks: [], targetPage: "/decode" };
  } catch (error) {
    console.error("Thesys API error (SEO):", error);
    throw error;
  }
}
async function generatePMFAssumptions(targetingCategories, customContext) {
  if (!await isConnectorEnabled("thesys")) {
    throw new Error("Thesys connector is currently disabled. Enable it in Admin > Connected Tools.");
  }
  const lens = getCurrentLens();
  const systemPrompt = `You are a Product-Market Fit strategist for GreenElephant.org \u2014 a Conscious Communication coaching platform.

${BRAND_CONTEXT}

Your job is to generate PMF hypotheses that can be immediately tested using LinkedIn targeting. Each hypothesis should map to specific LinkedIn filter categories.

LinkedIn Free Plan filters: Location, Industry, Company Size, Job Title, School, Connection degree
LinkedIn Sales Navigator filters: Seniority Level, Years in Position, Function, Company Headcount, Revenue, Technologies Used, Groups, Posted on LinkedIn in last 30 days

Current month lens: ${lens.name} \u2014 "${lens.description}"`;
  const userMessage = `Generate 4-6 PMF assumptions for GreenElephant's Conscious Communication services.

Targeting criteria provided:
${Object.entries(targetingCategories).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

Additional context: ${customContext || "None provided"}

IMPORTANT: Respond with ONLY this JSON and nothing else \u2014 no markdown, no code fences:
{
  "assumptions": [
    {
      "id": "PMF-001",
      "hypothesis": "A clear PMF hypothesis statement",
      "targetSegment": "Who this targets",
      "painPoint": "The specific pain this addresses",
      "linkedinFilters": {"Location": "value", "Industry": "value", "Job Title": "value"},
      "confidence": "High/Medium/Low",
      "testMethod": "How to validate this assumption"
    }
  ],
  "pmfIndicators": {
    "painsWorthSolving": ["pain 1", "pain 2", "pain 3"],
    "tensionsUnresolved": ["tension 1", "tension 2"],
    "trends": ["trend 1", "trend 2", "trend 3"]
  }
}`;
  try {
    const response = await thesysClient.chat.completions.create({
      model: "c1/anthropic/claude-sonnet-4/v-20250930",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });
    let content = response.choices[0]?.message?.content || "";
    if (content.includes("<content thesys=")) {
      content = content.replace(/<content thesys="true">/g, "").replace(/<\/content>/g, "");
      content = content.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    }
    const jsonMatch = content.match(/\{[\s\S]*"assumptions"[\s\S]*"pmfIndicators"[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Could not parse PMF assumptions from AI response");
  } catch (error) {
    console.error("Thesys API error (PMF):", error);
    throw error;
  }
}
async function generateLeadListSuggestions(calibration, filters) {
  if (!await isConnectorEnabled("thesys")) {
    throw new Error("Thesys connector is currently disabled. Enable it in Admin > Connected Tools.");
  }
  const lens = getCurrentLens();
  const systemPrompt = `You are a B2B lead research strategist for GreenElephant.org \u2014 a Conscious Communication platform.

${BRAND_CONTEXT}

Your job is to generate a qualified prospecting list based on calibration inputs and LinkedIn targeting filters. For each lead entry, provide:
1. A specific, real company name that matches the targeting criteria (use publicly known companies)
2. The exact job title to search for at that company
3. A working LinkedIn search URL that will find this role at this company
4. The recommended prospecting tool to find the contact's email
5. A fit score based on how closely the company/role matches the calibration inputs

Use your knowledge of real companies, industries, and organizational structures to generate actionable leads. Recommend the best real data source for each lead:
- LinkedIn Free Search: boolean search URL for the specific company + title
- LinkedIn Sales Navigator: for advanced lead filters
- Apollo.io: for verified B2B email lookup
- ZoomInfo: for org chart and direct dial lookup
- Hunter.io: for domain-based email discovery
- Crunchbase: for startup funding stage verification

Current month lens: ${lens.name} \u2014 "${lens.description}"`;
  const userMessage = `Generate a qualified prospecting list based on these calibration inputs:

WHY (purpose of outreach): ${calibration.why}
WHAT (what we're offering): ${calibration.what}
HOW (outreach channel/method): ${calibration.how}

LinkedIn targeting filters:
${Object.entries(filters).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

IMPORTANT: Use REAL company names that match the filters. Generate actionable entries the user can immediately search. Respond with ONLY this JSON and nothing else:
{
  "leads": [
    {
      "name": "Head of L&D at Siemens",
      "title": "Head of Learning & Development",
      "company": "Siemens AG",
      "linkedinProfile": "https://www.linkedin.com/search/results/people/?keywords=Head%20of%20Learning%20Siemens",
      "email": "Use Hunter.io with domain siemens.com",
      "source": "LinkedIn Free Search + Hunter.io",
      "fitScore": "High"
    }
  ],
  "dataSources": ["Apollo.io \u2014 verified B2B emails, filter by title + industry", "LinkedIn Sales Navigator \u2014 saved lead searches with seniority filters", "Hunter.io \u2014 find emails by company domain"],
  "refinementTips": ["Tip for improving targeting accuracy using the recommended sources"]
}`;
  try {
    const response = await thesysClient.chat.completions.create({
      model: "c1/anthropic/claude-sonnet-4/v-20250930",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });
    let content = response.choices[0]?.message?.content || "";
    if (content.includes("<content thesys=")) {
      content = content.replace(/<content thesys="true">/g, "").replace(/<\/content>/g, "");
      content = content.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    }
    const jsonMatch = content.match(/\{[\s\S]*"leads"[\s\S]*"dataSources"[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Could not parse lead list from AI response");
  } catch (error) {
    console.error("Thesys API error (leads):", error);
    throw error;
  }
}
async function generateJourneyAIResponse(journeyStage, stageData, userQuestion) {
  if (!await isConnectorEnabled("thesys")) {
    throw new Error("Thesys connector is currently disabled. Enable it in Admin > Connected Tools.");
  }
  const systemPrompt = `You are a growth analytics advisor for GreenElephant.org \u2014 a Conscious Communication platform.

${BRAND_CONTEXT}

You help the admin ("steward") understand their customer journey funnel metrics, validate data, spot anomalies, and suggest improvements. You have access to data from Notion CRM, Google Sheets, Stripe, Typeform, and the internal database.

Be concise, actionable, and data-driven. Use plain language. Reference specific numbers from the data provided. If you don't have enough data to answer confidently, say so.`;
  const userMessage = `The steward is asking about the "${journeyStage}" stage of the customer journey funnel.

Here is the current data for this stage:
${JSON.stringify(stageData, null, 2)}

Steward's question: ${userQuestion}

Provide a helpful, concise answer (2-4 paragraphs max). Reference specific metrics. If relevant, suggest what to track or improve.`;
  try {
    const response = await thesysClient.chat.completions.create({
      model: "c1/anthropic/claude-sonnet-4/v-20250930",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });
    let content = response.choices[0]?.message?.content || "";
    if (content.includes("<content thesys=")) {
      content = content.replace(/<content thesys="true">/g, "").replace(/<\/content>/g, "");
      content = content.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    }
    return stripMarkdown(content);
  } catch (error) {
    console.error("Thesys API error (journey AI):", error);
    throw error;
  }
}
async function streamDashboardUI(prompt, data) {
  if (!await isConnectorEnabled("thesys")) {
    throw new Error("Thesys connector is currently disabled. Enable it in Admin > Connected Tools.");
  }
  const systemPrompt = `You are a UI generator for GreenElephant's Conscious Communication dashboard.
Generate clean, modern UI components that display communication lens data.`;
  const userMessage = data ? `${prompt}

Data:
${JSON.stringify(data, null, 2)}` : prompt;
  const stream = await thesysClient.chat.completions.create({
    model: "c1/anthropic/claude-sonnet-4/v-20250930",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ],
    stream: true
  });
  return stream;
}
async function portalAiChat(systemPrompt, userMessage) {
  if (!await isConnectorEnabled("thesys")) {
    throw new Error("AI features are currently unavailable. Please try again later.");
  }
  const response = await thesysClient.chat.completions.create({
    model: "c1/anthropic/claude-sonnet-4/v-20250930",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ]
  });
  let content = response.choices[0]?.message?.content || "";
  if (content.includes("<content thesys=")) {
    content = content.replace(/<content thesys="true">/g, "").replace(/<\/content>/g, "");
    content = content.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    try {
      const parsed = JSON.parse(content);
      const extractText = (obj) => {
        if (typeof obj === "string") return obj;
        if (!obj || typeof obj !== "object") return "";
        if (obj.textMarkdown) return obj.textMarkdown;
        if (obj.text) return obj.text;
        if (obj.children) {
          if (Array.isArray(obj.children)) return obj.children.map(extractText).filter(Boolean).join("\n\n");
          return extractText(obj.children);
        }
        return Object.values(obj).map((v) => extractText(v)).filter(Boolean).join("\n\n");
      };
      content = extractText(parsed);
    } catch {
      const textMatch = content.match(/"textMarkdown"\s*:\s*"((?:[^"\\]|\\.)*)"/);
      if (textMatch) {
        content = textMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
      }
    }
  }
  return stripMarkdown(content.replace(/\\n/g, "\n").trim());
}
var thesysClient, LENS_ROTATION, GBR_FRAMEWORK, BRAND_CONTEXT;
var init_thesysApi = __esm({
  "server/lib/thesysApi.ts"() {
    "use strict";
    init_connectorGuard();
    thesysClient = new OpenAI({
      apiKey: process.env.THESYS_API_KEY,
      baseURL: "https://api.thesys.dev/v1/embed"
    });
    LENS_ROTATION = {
      1: { name: "Influence", hexColor: "#cc3333", code: 1100, description: "How you exert influence with integrity" },
      2: { name: "Attitude", hexColor: "#ff9933", code: 2100, description: "Your stance toward change and growth" },
      3: { name: "Chaordic", hexColor: "#ffcc00", code: 3100, description: "Order in creative chaos" },
      4: { name: "Flow", hexColor: "#cccc33", code: 4100, description: "Sensing flow in conversations" },
      5: { name: "Alignment", hexColor: "#669966", code: 5100, description: "Building empathy and shared understanding" },
      6: { name: "Energy & Needs", hexColor: "#009999", code: 6100, description: "Honoring your energy and core needs" },
      7: { name: "Ego", hexColor: "#3399cc", code: 7100, description: "Recognizing and loosening ego patterns" },
      8: { name: "Dynamics", hexColor: "#663399", code: 8100, description: "Understanding relationship dynamics" },
      9: { name: "Influence", hexColor: "#cc3333", code: 1100, description: "How you exert influence with integrity" },
      10: { name: "Attitude", hexColor: "#ff9933", code: 2100, description: "Your stance toward change and growth" },
      11: { name: "Chaordic", hexColor: "#ffcc00", code: 3100, description: "Order in creative chaos" },
      12: { name: "Flow", hexColor: "#cccc33", code: 4100, description: "Sensing flow in conversations" }
    };
    GBR_FRAMEWORK = `The GreenBlueRed (GBR) Framework:
- GREEN = Other-focused: empathy, naming feelings/needs, building trust, asking about the other person
- BLUE = Self-focused: informing, sharing knowledge/opinions/ideas/stories, expressing your perspective  
- RED = Shared-focused: influencing, uniting, proposing agreements, collective action, shared decisions

The Periodic Table of Conscious Communication has 146 elements across 8 lenses:
1. Influence (#cc3333) \u2014 exerting influence with integrity
2. Attitude (#ff9933) \u2014 stance toward change and growth
3. Chaordic (#ffcc00) \u2014 order in creative chaos
4. Flow (#cccc33) \u2014 sensing flow in conversations
5. Alignment (#669966) \u2014 building empathy and shared understanding
6. Energy & Needs (#009999) \u2014 honoring energy and core needs
7. Ego (#3399cc) \u2014 recognizing and loosening ego patterns
8. Dynamics (#663399) \u2014 understanding relationship dynamics`;
    BRAND_CONTEXT = `GreenElephant.org is a Conscious Communication platform. 
Target audiences: Executive Assistants (EAs), TEAL startup founders, Design & Innovation students.
Tools: Satellite Scan (communication profiling), Check-my-FLOW (flow-state diagnostic), Speech Lab (GBR decode hub).
Tone: warm, grounded, evidence-based, never preachy. Academic roots but accessible language.`;
  }
});

// server/lib/notionClient.ts
var notionClient_exports = {};
__export(notionClient_exports, {
  getNotionClient: () => getNotionClient
});
import { Client } from "@notionhq/client";
async function getAccessToken3() {
  if (connectionSettings3 && connectionSettings3.settings.expires_at && new Date(connectionSettings3.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings3.settings.access_token;
  }
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY ? "repl " + process.env.REPL_IDENTITY : process.env.WEB_REPL_RENEWAL ? "depl " + process.env.WEB_REPL_RENEWAL : null;
  if (!xReplitToken) {
    throw new Error("X_REPLIT_TOKEN not found for repl/depl");
  }
  connectionSettings3 = await fetch(
    "https://" + hostname + "/api/v2/connection?include_secrets=true&connector_names=notion",
    {
      headers: {
        "Accept": "application/json",
        "X_REPLIT_TOKEN": xReplitToken
      }
    }
  ).then((res) => res.json()).then((data) => data.items?.[0]);
  const accessToken = connectionSettings3?.settings?.access_token || connectionSettings3.settings?.oauth?.credentials?.access_token;
  if (!connectionSettings3 || !accessToken) {
    throw new Error("Notion not connected");
  }
  return accessToken;
}
async function getNotionClient() {
  const accessToken = await getAccessToken3();
  return new Client({ auth: accessToken });
}
var connectionSettings3;
var init_notionClient = __esm({
  "server/lib/notionClient.ts"() {
    "use strict";
  }
});

// server/lib/notionSync.ts
var notionSync_exports = {};
__export(notionSync_exports, {
  findContactByEmail: () => findContactByEmail,
  findNotionContactByEmail: () => findNotionContactByEmail,
  findNotionContactByEmailSafe: () => findNotionContactByEmailSafe,
  fullSync: () => fullSync,
  getNotionDatabaseSchema: () => getNotionDatabaseSchema,
  getPipelineOSTasks: () => getPipelineOSTasks,
  getUnsyncedContacts: () => getUnsyncedContacts,
  markContactAsCustomer: () => markContactAsCustomer,
  pullContactsFromNotion: () => pullContactsFromNotion,
  pushAllContactsToNotion: () => pushAllContactsToNotion,
  pushContactToNotion: () => pushContactToNotion,
  syncContactWithNotion: () => syncContactWithNotion,
  syncNewsletterToNotion: () => syncNewsletterToNotion
});
import { eq as eq2, isNull } from "drizzle-orm";
function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}
async function getNotionDatabaseSchema() {
  if (!await isConnectorEnabled("notion")) {
    console.log("\u23F8\uFE0F Notion disabled \u2014 skipping schema fetch");
    return null;
  }
  try {
    const notion = await getNotionClient();
    const database = await notion.databases.retrieve({ database_id: NOTION_DATABASE_ID });
    return database;
  } catch (error) {
    console.error("Failed to retrieve Notion database schema:", error.message);
    throw error;
  }
}
async function findNotionContactByEmail(email) {
  if (!await isConnectorEnabled("notion")) {
    return { found: false };
  }
  const notion = await getNotionClient();
  const normalizedEmail = normalizeEmail(email);
  const response = await notion.databases.query({
    database_id: NOTION_DATABASE_ID,
    filter: {
      property: "Email",
      email: {
        equals: normalizedEmail
      }
    },
    page_size: 1
  });
  if (response.results.length > 0) {
    const page = response.results[0];
    const nameArr = page.properties?.Name?.title;
    const name = nameArr && nameArr.length > 0 ? nameArr[0].text?.content : void 0;
    console.log(`Found existing Notion contact for ${email}: ${page.id}`);
    return { found: true, pageId: page.id, name };
  }
  return { found: false };
}
async function findNotionContactByEmailSafe(email) {
  try {
    const result = await findNotionContactByEmail(email);
    if (result.found) {
      return { pageId: result.pageId, name: result.name };
    }
    return null;
  } catch (error) {
    console.error(`Error searching Notion for ${email}:`, error.message);
    return null;
  }
}
async function pushContactToNotionInternal(contact) {
  const notion = await getNotionClient();
  const normalizedEmail = normalizeEmail(contact.email);
  if (contact.notionPageId) {
    await notion.pages.update({
      page_id: contact.notionPageId,
      properties: buildNotionUpdateProperties(contact)
    });
    console.log(`Updated Notion page for contact: ${contact.email}`);
    return contact.notionPageId;
  }
  const existingResult = await findNotionContactByEmail(normalizedEmail);
  if (existingResult.found) {
    await notion.pages.update({
      page_id: existingResult.pageId,
      properties: buildNotionUpdateProperties(contact)
    });
    console.log(`Upsert: Updated existing Notion page for ${contact.email}: ${existingResult.pageId}`);
    return existingResult.pageId;
  } else {
    const response = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: buildNotionProperties(contact)
    });
    console.log(`Upsert: Created new Notion page for ${contact.email}: ${response.id}`);
    return response.id;
  }
}
async function pushContactToNotion(contact) {
  if (!await isConnectorEnabled("notion")) {
    console.log(`\u23F8\uFE0F Notion connector disabled \u2014 skipping push for ${contact.email}`);
    return null;
  }
  const normalizedEmail = normalizeEmail(contact.email);
  const existingLock = emailLocks.get(normalizedEmail);
  if (existingLock) {
    console.log(`Waiting for existing sync lock on ${contact.email}`);
    await existingLock;
  }
  const syncPromise = pushContactToNotionInternal(contact);
  emailLocks.set(normalizedEmail, syncPromise);
  try {
    return await syncPromise;
  } catch (error) {
    console.error(`Failed to push contact ${contact.email} to Notion:`, error.message);
    return null;
  } finally {
    emailLocks.delete(normalizedEmail);
  }
}
function buildNotionProperties(contact) {
  const properties = {};
  if (contact.name) {
    properties["Name"] = {
      title: [{ text: { content: contact.name } }]
    };
  }
  if (contact.email) {
    properties["Email"] = {
      email: normalizeEmail(contact.email)
    };
  }
  if (contact.source) {
    properties["Source"] = {
      select: { name: SOURCE_MAPPING[contact.source] || contact.source }
    };
  }
  if (contact.channelsReached && contact.channelsReached.length > 0) {
    properties["\u{1F7E2} Channels Reached"] = {
      multi_select: contact.channelsReached.map((channel) => ({ name: channel }))
    };
  }
  if (contact.scanSubmittedAt) {
    properties["label_\u{1F6F0}\uFE0F SatelliteScanDone_added_at"] = {
      date: { start: contact.scanSubmittedAt.toISOString().split("T")[0] }
    };
  }
  return properties;
}
function buildNotionUpdateProperties(contact) {
  const properties = {};
  if (contact.name) {
    properties["Name"] = {
      title: [{ text: { content: contact.name } }]
    };
  }
  if (contact.source) {
    properties["Source"] = {
      select: { name: SOURCE_MAPPING[contact.source] || contact.source }
    };
  }
  if (contact.channelsReached && contact.channelsReached.length > 0) {
    properties["\u{1F7E2} Channels Reached"] = {
      multi_select: contact.channelsReached.map((channel) => ({ name: channel }))
    };
  }
  if (contact.scanSubmittedAt) {
    properties["label_\u{1F6F0}\uFE0F SatelliteScanDone_added_at"] = {
      date: { start: contact.scanSubmittedAt.toISOString().split("T")[0] }
    };
  }
  return properties;
}
async function pullContactsFromNotion() {
  if (!await isConnectorEnabled("notion")) {
    console.log("\u23F8\uFE0F Notion disabled \u2014 skipping pull");
    return { updated: 0, created: 0, errors: ["Notion connector disabled"] };
  }
  const result = { updated: 0, created: 0, errors: [] };
  try {
    const notion = await getNotionClient();
    let hasMore = true;
    let startCursor = void 0;
    while (hasMore) {
      const response = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        start_cursor: startCursor,
        page_size: 100
      });
      for (const page of response.results) {
        try {
          const notionPage = page;
          const props = notionPage.properties;
          const email = props.Email?.email;
          if (!email) continue;
          const nameArr = props.Name?.title;
          const name = nameArr && nameArr.length > 0 ? nameArr[0].text?.content : null;
          const sourceSelect = props.Source?.select?.name;
          const source = sourceSelect ? sourceSelect.toLowerCase() : "newsletter";
          const existingContact = await db.select().from(contacts).where(eq2(contacts.email, email)).limit(1);
          if (existingContact.length > 0) {
            const contact = existingContact[0];
            const notionEditedTime = new Date(notionPage.last_edited_time);
            const localSyncedAt = contact.notionSyncedAt;
            if (!localSyncedAt || notionEditedTime > localSyncedAt) {
              await db.update(contacts).set({
                name: name || contact.name,
                notionPageId: notionPage.id,
                notionSyncedAt: /* @__PURE__ */ new Date()
              }).where(eq2(contacts.id, contact.id));
              result.updated++;
            }
          } else {
            const validSources = ["waitlist", "newsletter", "recommendation", "quiz"];
            const safeSource = validSources.includes(source) ? source : "newsletter";
            await db.insert(contacts).values({
              email,
              name: name || null,
              consentGiven: "true",
              consentText: "Imported from Notion CRM",
              source: safeSource,
              notionPageId: notionPage.id,
              notionSyncedAt: /* @__PURE__ */ new Date()
            });
            result.created++;
            console.log(`Created new contact from Notion: ${email}`);
          }
        } catch (pageError) {
          result.errors.push(`Error processing Notion page: ${pageError.message}`);
        }
      }
      hasMore = response.has_more;
      startCursor = response.next_cursor ?? void 0;
    }
  } catch (error) {
    result.errors.push(`Failed to pull from Notion: ${error.message}`);
  }
  return result;
}
async function pushAllContactsToNotion() {
  if (!await isConnectorEnabled("notion")) {
    console.log("\u23F8\uFE0F Notion disabled \u2014 skipping pushAll");
    return { pushed: 0, errors: ["Notion connector disabled"] };
  }
  const result = { pushed: 0, errors: [] };
  try {
    const allContacts = await db.select().from(contacts);
    for (const contact of allContacts) {
      const notionPageId = await pushContactToNotion(contact);
      if (notionPageId) {
        await db.update(contacts).set({
          notionPageId,
          notionSyncedAt: /* @__PURE__ */ new Date()
        }).where(eq2(contacts.id, contact.id));
        result.pushed++;
      } else {
        result.errors.push(`Failed to push contact: ${contact.email}`);
      }
    }
  } catch (error) {
    result.errors.push(`Push all failed: ${error.message}`);
  }
  return result;
}
async function syncContactWithNotion(contactId) {
  try {
    const contactResults = await db.select().from(contacts).where(eq2(contacts.id, contactId)).limit(1);
    if (contactResults.length === 0) return false;
    const contact = contactResults[0];
    const notionPageId = await pushContactToNotion(contact);
    if (notionPageId) {
      await db.update(contacts).set({
        notionPageId,
        notionSyncedAt: /* @__PURE__ */ new Date()
      }).where(eq2(contacts.id, contactId));
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Failed to sync contact ${contactId}:`, error.message);
    return false;
  }
}
async function fullSync() {
  const result = { pushed: 0, pulled: 0, errors: [] };
  console.log("Starting full Notion sync...");
  const pullResult = await pullContactsFromNotion();
  result.pulled = pullResult.updated + pullResult.created;
  result.errors.push(...pullResult.errors);
  const pushResult = await pushAllContactsToNotion();
  result.pushed = pushResult.pushed;
  result.errors.push(...pushResult.errors);
  console.log(`Full sync complete. Pushed: ${result.pushed}, Pulled: ${result.pulled}, Errors: ${result.errors.length}`);
  return result;
}
async function getUnsyncedContacts() {
  return db.select().from(contacts).where(isNull(contacts.notionPageId));
}
async function markContactAsCustomer(email, purchaseDetails) {
  if (!await isConnectorEnabled("notion")) {
    console.log(`\u23F8\uFE0F Notion disabled \u2014 skipping markContactAsCustomer for ${email}`);
    return { success: false, isNewContact: false };
  }
  try {
    const notion = await getNotionClient();
    let existingContact = await db.select().from(contacts).where(eq2(contacts.email, email)).limit(1);
    let isNewContact = false;
    let linkedExisting = false;
    let contact;
    if (existingContact.length === 0) {
      const [newContact] = await db.insert(contacts).values({
        email,
        name: purchaseDetails.customerName || null,
        consentGiven: "true",
        consentText: `Purchase consent for ${purchaseDetails.productName}`,
        source: "recommendation"
      }).returning();
      contact = newContact;
      isNewContact = true;
      console.log(`Created new contact for customer: ${email}`);
    } else {
      contact = existingContact[0];
      if (purchaseDetails.customerName && !contact.name) {
        await db.update(contacts).set({ name: purchaseDetails.customerName }).where(eq2(contacts.id, contact.id));
        contact.name = purchaseDetails.customerName;
      }
    }
    if (contact.notionPageId) {
      console.log(`Contact ${email} already synced to Notion (page: ${contact.notionPageId})`);
      await db.update(contacts).set({ notionSyncedAt: /* @__PURE__ */ new Date() }).where(eq2(contacts.id, contact.id));
      return { success: true, isNewContact, notionPageId: contact.notionPageId };
    }
    const existingNotionContact = await findNotionContactByEmail(email);
    if (existingNotionContact.found) {
      console.log(`Found existing Notion contact for ${email}, linking to local record`);
      linkedExisting = true;
      if (existingNotionContact.name && !contact.name) {
        await db.update(contacts).set({
          name: existingNotionContact.name,
          notionPageId: existingNotionContact.pageId,
          notionSyncedAt: /* @__PURE__ */ new Date()
        }).where(eq2(contacts.id, contact.id));
      } else {
        await db.update(contacts).set({
          notionPageId: existingNotionContact.pageId,
          notionSyncedAt: /* @__PURE__ */ new Date()
        }).where(eq2(contacts.id, contact.id));
      }
      console.log(`Linked existing Notion contact for: ${email}`);
      return { success: true, isNewContact, notionPageId: existingNotionContact.pageId, linkedExisting };
    }
    const properties = {
      "Email": { email },
      "Source": { select: { name: "Purchase" } }
    };
    if (contact.name) {
      properties["Name"] = { title: [{ text: { content: contact.name } }] };
    }
    const response = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID },
      properties
    });
    await db.update(contacts).set({
      notionPageId: response.id,
      notionSyncedAt: /* @__PURE__ */ new Date()
    }).where(eq2(contacts.id, contact.id));
    console.log(`Created new Notion page for customer: ${email}`);
    return { success: true, isNewContact, notionPageId: response.id };
  } catch (error) {
    console.error(`Failed to mark ${email} as customer in Notion:`, error.message);
    return { success: false, isNewContact: false };
  }
}
async function findContactByEmail(email) {
  const results = await db.select().from(contacts).where(eq2(contacts.email, email)).limit(1);
  return results.length > 0 ? results[0] : null;
}
async function syncNewsletterToNotion(campaignId, contactId) {
  if (!await isConnectorEnabled("notion")) {
    console.log("\u23F8\uFE0F Notion disabled \u2014 skipping newsletter sync");
    return { synced: 0, errors: ["Notion connector disabled"] };
  }
  const result = { synced: 0, errors: [] };
  try {
    const notion = await getNotionClient();
    const { storage: storage2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
    const campaign = await storage2.getNewsletterCampaignById(campaignId);
    if (!campaign) {
      result.errors.push("Campaign not found");
      return result;
    }
    let recipients;
    if (contactId) {
      const recipient = await storage2.getNewsletterRecipientByTracking(campaignId, contactId);
      recipients = recipient ? [recipient] : [];
    } else {
      const allRecipients = await storage2.getNewsletterRecipientsByCampaign(campaignId);
      recipients = allRecipients.filter((r) => r.status === "sent" && r.notionSynced === "false");
    }
    for (const recipient of recipients) {
      try {
        const contact = await findContactByEmail(recipient.email);
        let notionPageId = contact?.notionPageId;
        if (!notionPageId) {
          const notionContact = await findNotionContactByEmail(recipient.email);
          if (!notionContact.found) {
            result.errors.push(`No Notion page for ${recipient.email}`);
            continue;
          }
          notionPageId = notionContact.pageId;
        }
        if (!notionPageId) continue;
        const sentDate = recipient.sentAt ? new Date(recipient.sentAt).toLocaleDateString() : "Unknown";
        const openedInfo = recipient.openedAt ? ` | Opened: ${new Date(recipient.openedAt).toLocaleDateString()} (${recipient.openCount}x)` : " | Not opened";
        const comment = `${campaign.name} sent ${sentDate}${openedInfo}`;
        await notion.pages.update({
          page_id: notionPageId,
          properties: {
            "Satellite Scan Reachout Campaign Comments": {
              rich_text: [{ text: { content: comment } }]
            }
          }
        });
        await storage2.updateNewsletterRecipient(recipient.id, {
          notionSynced: "true"
        });
        result.synced++;
        console.log(`\u2713 Synced newsletter status for ${recipient.email} to Notion`);
      } catch (recipientError) {
        result.errors.push(`${recipient.email}: ${recipientError.message}`);
      }
    }
    return result;
  } catch (error) {
    console.error("Newsletter Notion sync error:", error.message);
    result.errors.push(error.message);
    return result;
  }
}
async function getPipelineOSTasks() {
  if (!await isConnectorEnabled("notion")) {
    console.log("\u23F8\uFE0F Notion connector disabled \u2014 skipping Pipeline OS read");
    return "";
  }
  try {
    const notion = await getNotionClient();
    const response = await notion.databases.query({
      database_id: PIPELINE_OS_DATABASE_ID,
      page_size: 20
    });
    const tasks = [];
    for (const page of response.results) {
      if (!("properties" in page)) continue;
      const props = page.properties;
      let title = "";
      for (const key of Object.keys(props)) {
        const prop = props[key];
        if (prop.type === "title" && prop.title?.length > 0) {
          title = prop.title.map((t) => t.plain_text).join("");
          break;
        }
      }
      let status = "";
      for (const key of Object.keys(props)) {
        const prop = props[key];
        if (prop.type === "status" && prop.status?.name) {
          status = prop.status.name;
          break;
        } else if (prop.type === "select" && prop.select?.name) {
          if (key.toLowerCase().includes("status") || key.toLowerCase().includes("stage")) {
            status = prop.select.name;
            break;
          }
        }
      }
      if (title) {
        tasks.push(status ? `- [${status}] ${title}` : `- ${title}`);
      }
    }
    return tasks.length > 0 ? `Active Pipeline OS tasks:
${tasks.join("\n")}` : "";
  } catch (error) {
    console.error("Failed to read Pipeline OS:", error.message);
    return "";
  }
}
var NOTION_DATABASE_ID, emailLocks, SOURCE_MAPPING, PIPELINE_OS_DATABASE_ID;
var init_notionSync = __esm({
  "server/lib/notionSync.ts"() {
    "use strict";
    init_notionClient();
    init_db();
    init_schema();
    init_connectorGuard();
    NOTION_DATABASE_ID = "8818608d251c426c8538920ec88bbde3";
    emailLocks = /* @__PURE__ */ new Map();
    SOURCE_MAPPING = {
      "waitlist": "Waitlist",
      "newsletter": "Newsletter",
      "recommendation": "Recommendation",
      "quiz": "Quiz",
      "purchase": "Purchase",
      "webinar": "Webinar"
    };
    PIPELINE_OS_DATABASE_ID = "6a43844676574202a5a8e30a935c9eaa";
  }
});

// server/portal-auth.ts
var portal_auth_exports = {};
__export(portal_auth_exports, {
  getBaseUrl: () => getBaseUrl,
  registerPortalRoutes: () => registerPortalRoutes,
  requirePortalAuth: () => requirePortalAuth
});
import { scrypt as scrypt2, randomBytes as randomBytes2, timingSafeEqual as timingSafeEqual2 } from "crypto";
import { promisify as promisify2 } from "util";
function getBaseUrl(req) {
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }
  const proto = req.get("x-forwarded-proto") || req.protocol || "https";
  const host = req.get("x-forwarded-host") || req.get("host") || "greenelephant.org";
  return `${proto}://${host}`;
}
async function isAdminUser(email) {
  const adminUser = await storage.getAdminUserByEmail(email.toLowerCase());
  return !!adminUser && adminUser.isActive === "true";
}
async function autoConnectScansToUser(userId, email) {
  try {
    const scans = await storage.getSatellitescanPurchasesByEmail(email);
    if (scans.length === 0) return;
    const existingEvents = await storage.getPortalTimelineEvents(userId);
    const existingScanIds = new Set(
      existingEvents.filter((e) => e.type === "scan" && e.toolId).map((e) => e.toolId)
    );
    for (const scan of scans) {
      if (scan.status !== "succeeded") continue;
      if (existingScanIds.has(scan.id)) continue;
      const completedLabel = scan.typeformCompleted === "true" ? " (completed)" : " (pending)";
      await storage.createPortalTimelineEvent({
        userId,
        type: "scan",
        title: `Satellite Scan${completedLabel}`,
        description: `Satellite Scan purchased on ${new Date(scan.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`,
        details: scan.role ? `Role: ${scan.role}` : null,
        lens: "Needs",
        toolId: scan.id,
        date: scan.typeformCompletedAt || scan.createdAt
      });
    }
    const linked = scans.filter((s) => s.status === "succeeded" && !existingScanIds.has(s.id)).length;
    if (linked > 0) {
      console.log(`\u{1F517} Auto-connected ${linked} scan(s) to portal user ${email}`);
    }
  } catch (error) {
    console.error("Auto-connect scans error:", error instanceof Error ? error.message : "Unknown error");
  }
}
async function hashPassword(password) {
  const salt = randomBytes2(16).toString("hex");
  const buf = await scryptAsync2(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function verifyPassword(password, hash) {
  const [hashedPassword, salt] = hash.split(".");
  const buf = await scryptAsync2(password, salt, 64);
  return timingSafeEqual2(Buffer.from(hashedPassword, "hex"), buf);
}
function requirePortalAuth(req, res, next) {
  if (req.session && req.session.clientUserId) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
}
async function isPortalLoginEnabled() {
  const setting = await storage.getAdminSetting("portal_login_enabled");
  return setting !== "false";
}
function registerPortalRoutes(app2) {
  app2.post("/api/portal/register", async (req, res) => {
    try {
      if (!await isPortalLoginEnabled()) {
        return res.status(403).json({ message: "Portal registration is currently disabled" });
      }
      const { email, password, name } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }
      const normalizedEmail = email.toLowerCase().trim();
      const existing = await storage.getClientUserByEmail(normalizedEmail);
      if (existing) {
        return res.status(409).json({ message: "An account with this email already exists" });
      }
      const passwordHash = await hashPassword(password);
      const user = await storage.createClientUser({
        email: normalizedEmail,
        name: name || null,
        passwordHash
      });
      req.session.clientUserId = user.id;
      req.session.clientEmail = user.email;
      autoConnectScansToUser(user.id, user.email);
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Registration failed" });
        }
        res.json({
          message: "Account created",
          user: { id: user.id, email: user.email, name: user.name }
        });
      });
    } catch (error) {
      console.error("Portal registration error:", error instanceof Error ? error.message : "Unknown");
      res.status(500).json({ message: "Registration failed" });
    }
  });
  app2.post("/api/portal/login", async (req, res) => {
    try {
      const portalEnabled = await isPortalLoginEnabled();
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      const normalizedEmail = email.toLowerCase().trim();
      const isAdmin = await isAdminUser(normalizedEmail);
      if (!portalEnabled && !isAdmin) {
        return res.status(403).json({ message: "Portal login is currently disabled" });
      }
      const user = await storage.getClientUserByEmail(normalizedEmail);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      if (user.isActive !== "true") {
        return res.status(403).json({ message: "Account is disabled" });
      }
      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      await storage.updateClientUser(user.id, { lastLoginAt: /* @__PURE__ */ new Date() });
      req.session.clientUserId = user.id;
      req.session.clientEmail = user.email;
      autoConnectScansToUser(user.id, user.email);
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Login failed" });
        }
        res.json({
          message: "Login successful",
          user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl }
        });
      });
    } catch (error) {
      console.error("Portal login error:", error instanceof Error ? error.message : "Unknown");
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.post("/api/portal/logout", async (req, res) => {
    if (req.session) {
      req.session.clientUserId = void 0;
      req.session.clientEmail = void 0;
    }
    res.json({ message: "Logged out" });
  });
  app2.post("/api/portal/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const normalizedEmail = email.toLowerCase().trim();
      const user = await storage.getClientUserByEmail(normalizedEmail);
      if (!user || !user.passwordHash) {
        return res.json({ message: "If an account exists with that email, a reset link has been sent." });
      }
      const token = randomBytes2(32).toString("hex");
      const expiry = new Date(Date.now() + 60 * 60 * 1e3);
      await storage.updateClientUser(user.id, {
        resetToken: token,
        resetTokenExpiry: expiry
      });
      const baseUrl = getBaseUrl(req);
      const resetUrl = `${baseUrl}/portal/reset-password?token=${token}`;
      await sendPasswordResetEmail(normalizedEmail, resetUrl);
      res.json({ message: "If an account exists with that email, a reset link has been sent." });
    } catch (error) {
      console.error("Forgot password error:", error instanceof Error ? error.message : "Unknown");
      res.json({ message: "If an account exists with that email, a reset link has been sent." });
    }
  });
  app2.post("/api/portal/reset-password", async (req, res) => {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        return res.status(400).json({ message: "Token and new password are required" });
      }
      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }
      const allUsers = await storage.getAllClientUsers();
      const user = allUsers.find((u) => u.resetToken === token);
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired reset link" });
      }
      if (!user.resetTokenExpiry || new Date(user.resetTokenExpiry) < /* @__PURE__ */ new Date()) {
        return res.status(400).json({ message: "Reset link has expired. Please request a new one." });
      }
      const passwordHash = await hashPassword(password);
      await storage.updateClientUser(user.id, {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null
      });
      res.json({ message: "Password has been reset. You can now log in with your new password." });
    } catch (error) {
      console.error("Reset password error:", error instanceof Error ? error.message : "Unknown");
      res.status(500).json({ message: "Password reset failed" });
    }
  });
  app2.get("/api/portal/me", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.json({ authenticated: false });
    }
    try {
      const user = await storage.getClientUserById(req.session.clientUserId);
      if (!user) {
        return res.json({ authenticated: false });
      }
      const subscription = await storage.getClientSubscriptionByUserId(user.id);
      res.json({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          twoFactorEnabled: user.twoFactorEnabled === "true",
          hasLinkedIn: !!user.linkedinSub,
          hasGoogle: !!user.googleId
        },
        subscription: subscription ? {
          plan: subscription.plan,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd
        } : null
      });
    } catch (error) {
      console.error("Portal me error:", error);
      res.json({ authenticated: false });
    }
  });
  app2.post("/api/portal/change-password", requirePortalAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new password are required" });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters" });
      }
      const user = await storage.getClientUserById(req.session.clientUserId);
      if (!user || !user.passwordHash) {
        return res.status(400).json({ message: "No password set on this account. Use Google or LinkedIn login." });
      }
      const valid = await verifyPassword(currentPassword, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      const hash = await hashPassword(newPassword);
      await storage.updateClientUser(user.id, { passwordHash: hash });
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Change password error:", error instanceof Error ? error.message : "Unknown");
      res.status(500).json({ message: "Failed to change password" });
    }
  });
  app2.post("/api/portal/profile/avatar", requirePortalAuth, async (req, res) => {
    try {
      const { avatar } = req.body;
      if (!avatar || typeof avatar !== "string") {
        return res.status(400).json({ message: "Avatar image data is required" });
      }
      if (!avatar.match(/^data:image\/(jpeg|png|webp);base64,/)) {
        return res.status(400).json({ message: "Invalid image format. Only JPEG, PNG, and WebP are allowed." });
      }
      if (avatar.length > 3 * 1024 * 1024) {
        return res.status(400).json({ message: "Image too large (max 2MB)" });
      }
      await storage.updateClientUser(req.session.clientUserId, { avatarUrl: avatar });
      res.json({ message: "Avatar updated" });
    } catch (error) {
      console.error("Avatar upload error:", error instanceof Error ? error.message : "Unknown");
      res.status(500).json({ message: "Failed to update avatar" });
    }
  });
  app2.delete("/api/portal/profile/avatar", requirePortalAuth, async (req, res) => {
    try {
      await storage.updateClientUser(req.session.clientUserId, { avatarUrl: null });
      res.json({ message: "Avatar removed" });
    } catch (error) {
      console.error("Avatar remove error:", error instanceof Error ? error.message : "Unknown");
      res.status(500).json({ message: "Failed to remove avatar" });
    }
  });
  app2.get("/api/portal/auth/google", async (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(503).json({ message: "Google login is not configured yet" });
    }
    const baseUrl = getBaseUrl(req);
    if (baseUrl.includes(".replit.dev")) {
      console.log("Portal Google OAuth: dev domain detected, redirecting to login with dev_google error");
      return res.redirect("/portal/login?error=dev_google");
    }
    const oauthNonce = randomBytes2(24).toString("hex");
    req.session.googleOAuthState = oauthNonce;
    const redirectUri = `${baseUrl}/api/portal/auth/google/callback`;
    const scope = encodeURIComponent("openid email profile");
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=select_account&state=${oauthNonce}`;
    console.log("Portal Google OAuth: redirecting to Google. Redirect URI:", redirectUri);
    req.session.save(() => {
      res.redirect(authUrl);
    });
  });
  app2.get("/api/portal/auth/google/callback", async (req, res) => {
    try {
      const { code, state, error: googleError } = req.query;
      if (googleError) {
        console.error("Google OAuth returned error:", googleError, req.query);
        return res.redirect(`/portal/login?error=google_${googleError}`);
      }
      if (!code) {
        console.warn("Portal Google OAuth callback: no code received. Query:", req.query);
        return res.redirect("/portal/login?error=no_code");
      }
      if (!req.session?.googleOAuthState || req.session.googleOAuthState !== state) {
        console.warn("Portal Google OAuth state mismatch. Session state:", req.session?.googleOAuthState ? "present" : "missing", "Query state:", state ? "present" : "missing");
        return res.redirect("/portal/login?error=invalid_state");
      }
      delete req.session.googleOAuthState;
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        return res.redirect("/portal/login?error=not_configured");
      }
      const redirectUri = `${getBaseUrl(req)}/api/portal/auth/google/callback`;
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code"
        })
      });
      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        return res.redirect("/portal/login?error=token_failed");
      }
      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const googleUser = await userInfoRes.json();
      if (!googleUser.email) {
        return res.redirect("/portal/login?error=no_email");
      }
      const portalEnabled = await isPortalLoginEnabled();
      const adminUser = await isAdminUser(googleUser.email);
      if (!portalEnabled && !adminUser) {
        return res.redirect("/portal/login?error=portal_disabled");
      }
      let user = await storage.getClientUserByGoogleId(googleUser.id);
      if (!user) {
        user = await storage.getClientUserByEmail(googleUser.email.toLowerCase());
        if (user) {
          user = await storage.updateClientUser(user.id, {
            googleId: googleUser.id,
            avatarUrl: googleUser.picture || user.avatarUrl,
            name: user.name || googleUser.name
          }) || user;
        } else {
          user = await storage.createClientUser({
            email: googleUser.email.toLowerCase(),
            name: googleUser.name,
            googleId: googleUser.id,
            avatarUrl: googleUser.picture
          });
        }
      } else {
        await storage.updateClientUser(user.id, { lastLoginAt: /* @__PURE__ */ new Date() });
      }
      req.session.clientUserId = user.id;
      req.session.clientEmail = user.email;
      autoConnectScansToUser(user.id, user.email);
      req.session.save((err) => {
        if (err) {
          console.error("Session save error after Google auth:", err);
          return res.redirect("/portal/login?error=session_failed");
        }
        res.redirect("/portal");
      });
    } catch (error) {
      console.error("Google OAuth callback error:", error instanceof Error ? error.message : "Unknown");
      res.redirect("/portal/login?error=callback_failed");
    }
  });
  app2.get("/api/admin/portal-users", async (req, res) => {
    if (!req.session?.isAdmin) {
      return res.status(401).json({ message: "Admin required" });
    }
    try {
      const users2 = await storage.getAllClientUsers();
      const usersWithSubs = await Promise.all(
        users2.map(async (u) => {
          const sub = await storage.getClientSubscriptionByUserId(u.id);
          return {
            id: u.id,
            email: u.email,
            name: u.name,
            avatarUrl: u.avatarUrl,
            isActive: u.isActive,
            createdAt: u.createdAt,
            lastLoginAt: u.lastLoginAt,
            hasGoogleAuth: !!u.googleId,
            hasLinkedInAuth: !!u.linkedinSub,
            subscription: sub ? { plan: sub.plan, status: sub.status, currentPeriodEnd: sub.currentPeriodEnd } : null
          };
        })
      );
      res.json(usersWithSubs);
    } catch (error) {
      console.error("Admin portal users error:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.get("/api/admin/settings", async (req, res) => {
    if (!req.session?.isAdmin) {
      return res.status(401).json({ message: "Admin required" });
    }
    try {
      const settings = await storage.getAllAdminSettings();
      const result = {};
      settings.forEach((s) => {
        result[s.key] = s.value;
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });
  const PROTECTED_SETTINGS_KEYS = ["admin_password_hash"];
  const SETTINGS_ALLOWLIST = [
    "portal_login_enabled",
    "portal_registration_enabled",
    "portal_tagline",
    "portal_login_subtitle",
    "portal_google_login_enabled",
    "portal_email_login_enabled",
    "linkedin_access_token",
    "linkedin_org_id",
    "linkedin_oauth_enabled",
    "admin_password_hash"
  ];
  app2.post("/api/admin/settings", async (req, res) => {
    if (!req.session?.isAdmin) {
      return res.status(401).json({ message: "Admin required" });
    }
    if (req.session?.adminRole === "viewer") {
      return res.status(403).json({ message: "Viewers have read-only access" });
    }
    try {
      const { key, value } = req.body;
      if (!key || value === void 0) {
        return res.status(400).json({ message: "Key and value required" });
      }
      if (!SETTINGS_ALLOWLIST.includes(key)) {
        return res.status(400).json({ message: `Setting key '${key}' is not allowed` });
      }
      if (PROTECTED_SETTINGS_KEYS.includes(key) && req.session?.adminRole !== "super_admin") {
        return res.status(403).json({ message: "Only super admins can modify this setting" });
      }
      const setting = await storage.setAdminSetting(key, String(value));
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Failed to save setting" });
    }
  });
  app2.get("/api/portal/notion/connect", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    const clientId = process.env.NOTION_OAUTH_CLIENT_ID;
    if (!clientId) {
      return res.status(503).json({ message: "Notion integration is not configured yet" });
    }
    const baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "https://greenelephant.org";
    const redirectUri = `${baseUrl}/api/portal/notion/callback`;
    const oauthNonce = randomBytes2(24).toString("hex");
    req.session.notionOAuthState = oauthNonce;
    const authUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(redirectUri)}&state=${oauthNonce}`;
    res.redirect(authUrl);
  });
  app2.get("/api/portal/notion/callback", async (req, res) => {
    try {
      const { code, state } = req.query;
      if (!code || !state) {
        return res.redirect("/portal/settings?notion=error&reason=no_code");
      }
      if (!req.session?.clientUserId || !req.session.notionOAuthState || req.session.notionOAuthState !== state) {
        return res.redirect("/portal/settings?notion=error&reason=invalid_state");
      }
      delete req.session.notionOAuthState;
      const clientId = process.env.NOTION_OAUTH_CLIENT_ID;
      const clientSecret = process.env.NOTION_OAUTH_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        return res.redirect("/portal/settings?notion=error&reason=not_configured");
      }
      const baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "https://greenelephant.org";
      const redirectUri = `${baseUrl}/api/portal/notion/callback`;
      const tokenRes = await fetch("https://api.notion.com/v1/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`
        },
        body: JSON.stringify({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri
        })
      });
      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        console.error("Notion OAuth token error:", tokenData);
        return res.redirect("/portal/settings?notion=error&reason=token_failed");
      }
      const userId = req.session.clientUserId;
      await storage.updateClientUser(userId, {
        notionAccessToken: tokenData.access_token,
        notionWorkspaceName: tokenData.workspace_name || "Connected Workspace",
        notionWorkspaceId: tokenData.workspace_id || null,
        notionBotId: tokenData.bot_id || null
      });
      res.redirect("/portal/settings?notion=connected");
    } catch (error) {
      console.error("Notion OAuth callback error:", error);
      res.redirect("/portal/settings?notion=error&reason=callback_failed");
    }
  });
  app2.post("/api/portal/notion/disconnect", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    try {
      await storage.updateClientUser(req.session.clientUserId, {
        notionAccessToken: null,
        notionWorkspaceName: null,
        notionWorkspaceId: null,
        notionBotId: null
      });
      res.json({ message: "Notion disconnected" });
    } catch (error) {
      res.status(500).json({ message: "Failed to disconnect" });
    }
  });
  app2.get("/api/portal/notion/status", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    try {
      const user = await storage.getClientUserById(req.session.clientUserId);
      if (!user) return res.json({ connected: false });
      res.json({
        connected: !!user.notionAccessToken,
        workspaceName: user.notionWorkspaceName || null
      });
    } catch {
      res.json({ connected: false });
    }
  });
  app2.post("/api/portal/notion/push-scan", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    try {
      const user = await storage.getClientUserById(req.session.clientUserId);
      if (!user?.notionAccessToken) {
        return res.status(400).json({ message: "Notion not connected" });
      }
      const { title, content, lensData } = req.body;
      const notionRes = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${user.notionAccessToken}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28"
        },
        body: JSON.stringify({
          parent: { type: "workspace", workspace: true },
          properties: {
            title: {
              title: [{ text: { content: title || "Satellite Scan Results" } }]
            }
          },
          children: [
            {
              object: "block",
              type: "heading_2",
              heading_2: { rich_text: [{ text: { content: "Satellite Scan Results" } }] }
            },
            {
              object: "block",
              type: "paragraph",
              paragraph: {
                rich_text: [{ text: { content: content || "Your communication scan data from GreenElephant.org" } }]
              }
            },
            ...lensData ? [{
              object: "block",
              type: "heading_3",
              heading_3: { rich_text: [{ text: { content: "Lens Analysis" } }] }
            }, {
              object: "block",
              type: "paragraph",
              paragraph: {
                rich_text: [{ text: { content: JSON.stringify(lensData, null, 2) } }]
              }
            }] : []
          ]
        })
      });
      const result = await notionRes.json();
      if (result.id) {
        res.json({ message: "Scan data pushed to Notion", pageId: result.id, url: result.url });
      } else {
        console.error("Notion push error:", result);
        res.status(400).json({ message: "Failed to push to Notion. Make sure you've granted page access." });
      }
    } catch (error) {
      console.error("Notion push error:", error);
      res.status(500).json({ message: "Failed to push scan data" });
    }
  });
  app2.get("/api/portal/auth/linkedin", async (req, res) => {
    if (!await isPortalLoginEnabled()) {
      return res.status(403).json({ message: "Portal login is currently disabled" });
    }
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return res.status(503).json({ message: "LinkedIn login is not configured yet" });
    }
    const linkedinEnabled = await storage.getAdminSetting("linkedin_oauth_enabled");
    if (linkedinEnabled === "false") {
      return res.status(503).json({ message: "LinkedIn login is currently disabled" });
    }
    const baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "https://greenelephant.org";
    if (baseUrl.includes(".replit.dev")) {
      return res.redirect("/portal/login?error=dev_linkedin");
    }
    const redirectUri = `${baseUrl}/api/portal/auth/linkedin/callback`;
    const state = randomBytes2(16).toString("hex");
    req.session.linkedinOAuthState = state;
    const scope = encodeURIComponent("openid profile email");
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${scope}`;
    req.session.save(() => {
      res.redirect(authUrl);
    });
  });
  app2.get("/api/portal/auth/linkedin/callback", async (req, res) => {
    try {
      const { code, state } = req.query;
      if (!code || !state) {
        return res.redirect("/portal/login?error=no_code");
      }
      if (state !== req.session.linkedinOAuthState) {
        return res.redirect("/portal/login?error=state_mismatch");
      }
      delete req.session.linkedinOAuthState;
      const clientId = process.env.LINKEDIN_CLIENT_ID;
      const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        return res.redirect("/portal/login?error=not_configured");
      }
      const baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "https://greenelephant.org";
      const redirectUri = `${baseUrl}/api/portal/auth/linkedin/callback`;
      const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri
        })
      });
      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        console.error("LinkedIn token error:", tokenData);
        return res.redirect("/portal/login?error=token_failed");
      }
      const userInfoRes = await fetch("https://api.linkedin.com/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const linkedinUser = await userInfoRes.json();
      if (!linkedinUser.email) {
        return res.redirect("/portal/login?error=no_email");
      }
      const tokenExpiry = tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1e3) : null;
      let user = await storage.getClientUserByLinkedinSub(linkedinUser.sub);
      if (!user) {
        user = await storage.getClientUserByEmail(linkedinUser.email.toLowerCase());
        if (user) {
          user = await storage.updateClientUser(user.id, {
            linkedinSub: linkedinUser.sub,
            linkedinAccessToken: tokenData.access_token,
            linkedinTokenExpiry: tokenExpiry,
            name: user.name || linkedinUser.name,
            avatarUrl: user.avatarUrl || linkedinUser.picture || null
          }) || user;
        } else {
          user = await storage.createClientUser({
            email: linkedinUser.email.toLowerCase(),
            name: linkedinUser.name || linkedinUser.given_name,
            linkedinSub: linkedinUser.sub,
            avatarUrl: linkedinUser.picture || null
          });
          await storage.updateClientUser(user.id, {
            linkedinAccessToken: tokenData.access_token,
            linkedinTokenExpiry: tokenExpiry
          });
        }
      } else {
        await storage.updateClientUser(user.id, {
          lastLoginAt: /* @__PURE__ */ new Date(),
          linkedinAccessToken: tokenData.access_token,
          linkedinTokenExpiry: tokenExpiry
        });
      }
      if (user.isActive !== "true") {
        return res.redirect("/portal/login?error=account_disabled");
      }
      req.session.clientUserId = user.id;
      req.session.clientEmail = user.email;
      autoConnectScansToUser(user.id, user.email);
      req.session.save((err) => {
        if (err) {
          console.error("Session save error after LinkedIn auth:", err);
          return res.redirect("/portal/login?error=session_failed");
        }
        res.redirect("/portal");
      });
    } catch (error) {
      console.error("LinkedIn OAuth callback error:", error instanceof Error ? error.message : "Unknown");
      res.redirect("/portal/login?error=callback_failed");
    }
  });
  app2.get("/api/admin/linkedin/test", async (req, res) => {
    if (!req.session?.isAdmin) {
      return res.status(401).json({ message: "Admin required" });
    }
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "https://greenelephant.org";
    const redirectUri = `${baseUrl}/api/portal/auth/linkedin/callback`;
    res.json({
      configured: !!(clientId && clientSecret),
      clientIdPresent: !!clientId,
      clientSecretPresent: !!clientSecret,
      redirectUri,
      scopes: "openid profile email",
      authEndpoint: "https://www.linkedin.com/oauth/v2/authorization",
      tokenEndpoint: "https://www.linkedin.com/oauth/v2/accessToken",
      userinfoEndpoint: "https://api.linkedin.com/v2/userinfo"
    });
  });
  app2.post("/api/portal/linkedin/disconnect", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    try {
      await storage.updateClientUser(req.session.clientUserId, {
        linkedinSub: null,
        linkedinAccessToken: null,
        linkedinTokenExpiry: null
      });
      res.json({ message: "LinkedIn disconnected" });
    } catch (error) {
      res.status(500).json({ message: "Failed to disconnect" });
    }
  });
  app2.get("/api/portal/spotify/connect", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    if (!clientId) {
      return res.status(503).json({ message: "Spotify integration is not configured yet" });
    }
    const baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "https://greenelephant.org";
    if (baseUrl.includes(".replit.dev")) {
      return res.status(400).json({ message: "Spotify connection only works on the published site (greenelephant.org). Please try again after publishing." });
    }
    const redirectUri = `${baseUrl}/api/portal/spotify/callback`;
    const oauthNonce = randomBytes2(24).toString("hex");
    req.session.spotifyOAuthState = oauthNonce;
    const scopes = "user-read-recently-played user-read-email user-top-read";
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=${oauthNonce}`;
    res.redirect(authUrl);
  });
  app2.get("/api/portal/spotify/callback", async (req, res) => {
    try {
      const { code, state } = req.query;
      if (!code || !state) {
        return res.redirect("/portal/settings?spotify=error&reason=no_code");
      }
      if (!req.session?.clientUserId || !req.session.spotifyOAuthState || req.session.spotifyOAuthState !== state) {
        return res.redirect("/portal/settings?spotify=error&reason=invalid_state");
      }
      delete req.session.spotifyOAuthState;
      const clientId = process.env.SPOTIFY_CLIENT_ID;
      const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        return res.redirect("/portal/settings?spotify=error&reason=not_configured");
      }
      const baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "https://greenelephant.org";
      const redirectUri = `${baseUrl}/api/portal/spotify/callback`;
      const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri
        })
      });
      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        console.error("Spotify OAuth token error:", tokenData);
        return res.redirect("/portal/settings?spotify=error&reason=token_failed");
      }
      const profileRes = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      if (!profileRes.ok) {
        console.error("Spotify profile fetch failed:", profileRes.status);
        return res.redirect("/portal/settings?spotify=error&reason=profile_failed");
      }
      const profile = await profileRes.json();
      if (!profile.id) {
        console.error("Spotify profile missing id:", profile);
        return res.redirect("/portal/settings?spotify=error&reason=no_profile_id");
      }
      const userId = req.session.clientUserId;
      await storage.updateClientUser(userId, {
        spotifyId: profile.id,
        spotifyAccessToken: tokenData.access_token,
        spotifyRefreshToken: tokenData.refresh_token || null,
        spotifyTokenExpiry: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1e3) : null
      });
      res.redirect("/portal/settings?spotify=connected");
    } catch (error) {
      console.error("Spotify OAuth callback error:", error);
      res.redirect("/portal/settings?spotify=error&reason=callback_failed");
    }
  });
  app2.post("/api/portal/spotify/disconnect", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    try {
      await storage.updateClientUser(req.session.clientUserId, {
        spotifyId: null,
        spotifyAccessToken: null,
        spotifyRefreshToken: null,
        spotifyTokenExpiry: null
      });
      res.json({ message: "Spotify disconnected" });
    } catch (error) {
      res.status(500).json({ message: "Failed to disconnect" });
    }
  });
  app2.get("/api/portal/spotify/status", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    try {
      const user = await storage.getClientUserById(req.session.clientUserId);
      if (!user) return res.json({ connected: false });
      res.json({
        connected: !!user.spotifyAccessToken,
        spotifyId: user.spotifyId || null
      });
    } catch {
      res.json({ connected: false });
    }
  });
  app2.get("/api/portal/spotify/recent-tracks", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    try {
      const user = await storage.getClientUserById(req.session.clientUserId);
      if (!user?.spotifyAccessToken) {
        return res.status(400).json({ message: "Spotify not connected" });
      }
      const refreshSpotifyToken = async () => {
        if (!user.spotifyRefreshToken) return null;
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        if (!clientId || !clientSecret) return null;
        const refreshRes = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: user.spotifyRefreshToken
          })
        });
        const refreshData = await refreshRes.json();
        if (!refreshData.access_token) return null;
        const updateFields = {
          spotifyAccessToken: refreshData.access_token,
          spotifyTokenExpiry: refreshData.expires_in ? new Date(Date.now() + refreshData.expires_in * 1e3) : null
        };
        if (refreshData.refresh_token) {
          updateFields.spotifyRefreshToken = refreshData.refresh_token;
        }
        await storage.updateClientUser(req.session.clientUserId, updateFields);
        return refreshData.access_token;
      };
      let accessToken = user.spotifyAccessToken;
      if (user.spotifyTokenExpiry && new Date(user.spotifyTokenExpiry) < /* @__PURE__ */ new Date()) {
        const newToken = await refreshSpotifyToken();
        if (!newToken) {
          return res.status(401).json({ message: "Spotify token expired. Please reconnect.", reconnectRequired: true });
        }
        accessToken = newToken;
      }
      const limit = Math.min(Number(req.query.limit) || 20, 50);
      let recentRes = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (recentRes.status === 401) {
        const newToken = await refreshSpotifyToken();
        if (!newToken) {
          return res.status(401).json({ message: "Spotify session expired. Please reconnect.", reconnectRequired: true });
        }
        accessToken = newToken;
        recentRes = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
      }
      if (!recentRes.ok) {
        return res.status(502).json({ message: "Spotify API error. Try again later." });
      }
      const recentData = await recentRes.json();
      if (!recentData.items || !Array.isArray(recentData.items)) {
        return res.json({ tracks: [] });
      }
      const trackIds = recentData.items.map((item) => item.track?.id).filter(Boolean).filter((id, i, arr) => arr.indexOf(id) === i);
      let audioFeatures = {};
      if (trackIds.length > 0) {
        const featuresRes = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds.join(",")}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const featuresData = await featuresRes.json();
        if (featuresData.audio_features) {
          for (const f of featuresData.audio_features) {
            if (f) audioFeatures[f.id] = f;
          }
        }
      }
      const tracks = recentData.items.map((item) => {
        const track = item.track;
        const features = audioFeatures[track.id] || {};
        return {
          id: track.id,
          name: track.name,
          artist: track.artists?.map((a) => a.name).join(", ") || "Unknown",
          album: track.album?.name || "",
          albumArt: track.album?.images?.[0]?.url || null,
          playedAt: item.played_at,
          previewUrl: track.preview_url,
          spotifyUrl: track.external_urls?.spotify || null,
          valence: features.valence ?? null,
          energy: features.energy ?? null,
          danceability: features.danceability ?? null,
          tempo: features.tempo ?? null,
          mode: features.mode ?? null,
          key: features.key ?? null
        };
      });
      const valences = tracks.filter((t) => t.valence !== null).map((t) => t.valence);
      const energies = tracks.filter((t) => t.energy !== null).map((t) => t.energy);
      const avgValence = valences.length > 0 ? valences.reduce((s, v) => s + v, 0) / valences.length : null;
      const avgEnergy = energies.length > 0 ? energies.reduce((s, v) => s + v, 0) / energies.length : null;
      const moodLabel = avgValence !== null ? avgValence > 0.7 ? "Upbeat & Positive" : avgValence > 0.5 ? "Balanced & Reflective" : avgValence > 0.3 ? "Introspective & Calm" : "Deep & Contemplative" : null;
      res.json({
        tracks,
        emotionalLandscape: {
          avgValence: avgValence !== null ? Math.round(avgValence * 100) / 100 : null,
          avgEnergy: avgEnergy !== null ? Math.round(avgEnergy * 100) / 100 : null,
          moodLabel,
          trackCount: tracks.length
        }
      });
    } catch (error) {
      console.error("Spotify recent tracks error:", error);
      res.status(500).json({ message: "Failed to fetch Spotify data" });
    }
  });
  app2.get("/api/portal/oura/connect", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    const clientId = process.env.OURA_CLIENT_ID;
    if (!clientId) {
      return res.status(503).json({ message: "Oura integration is not configured yet" });
    }
    const baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "https://greenelephant.org";
    const redirectUri = `${baseUrl}/api/portal/auth/oura/callback`;
    const oauthNonce = randomBytes2(24).toString("hex");
    req.session.ouraOAuthState = oauthNonce;
    const scopes = "email personal daily tag workout session spo2 ring_configuration stress heart_health heartrate";
    const authUrl = `https://cloud.ouraring.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=${oauthNonce}`;
    res.redirect(authUrl);
  });
  app2.get("/api/portal/auth/oura/callback", async (req, res) => {
    try {
      const { code, state } = req.query;
      if (!code || !state) {
        return res.redirect("/portal/settings?oura=error&reason=no_code");
      }
      if (!req.session?.clientUserId || !req.session.ouraOAuthState || req.session.ouraOAuthState !== state) {
        return res.redirect("/portal/settings?oura=error&reason=invalid_state");
      }
      delete req.session.ouraOAuthState;
      const clientId = process.env.OURA_CLIENT_ID;
      const clientSecret = process.env.OURA_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        return res.redirect("/portal/settings?oura=error&reason=not_configured");
      }
      const baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "https://greenelephant.org";
      const redirectUri = `${baseUrl}/api/portal/auth/oura/callback`;
      const tokenRes = await fetch("https://api.ouraring.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret
        })
      });
      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        console.error("Oura OAuth token error:", tokenData);
        return res.redirect("/portal/settings?oura=error&reason=token_failed");
      }
      const profileRes = await fetch("https://api.ouraring.com/v2/usercollection/personal_info", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const profile = profileRes.ok ? await profileRes.json() : {};
      const userId = req.session.clientUserId;
      await storage.updateClientUser(userId, {
        ouraId: profile.id || `oura_${userId}`,
        ouraAccessToken: tokenData.access_token,
        ouraRefreshToken: tokenData.refresh_token || null,
        ouraTokenExpiry: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1e3) : null,
        ouraConsentGrantedAt: /* @__PURE__ */ new Date()
      });
      res.redirect("/portal/settings?oura=connected");
    } catch (error) {
      console.error("Oura OAuth callback error:", error);
      res.redirect("/portal/settings?oura=error&reason=callback_failed");
    }
  });
  app2.post("/api/portal/oura/disconnect", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    try {
      await storage.updateClientUser(req.session.clientUserId, {
        ouraId: null,
        ouraAccessToken: null,
        ouraRefreshToken: null,
        ouraTokenExpiry: null,
        ouraConsentGrantedAt: null
      });
      res.json({ message: "Oura disconnected" });
    } catch (error) {
      res.status(500).json({ message: "Failed to disconnect" });
    }
  });
  app2.get("/api/portal/oura/status", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    try {
      const user = await storage.getClientUserById(req.session.clientUserId);
      if (!user) return res.json({ connected: false });
      res.json({
        connected: !!user.ouraAccessToken,
        ouraId: user.ouraId || null,
        consentGrantedAt: user.ouraConsentGrantedAt || null
      });
    } catch {
      res.json({ connected: false });
    }
  });
  app2.get("/api/portal/oura/daily", async (req, res) => {
    if (!req.session?.clientUserId) {
      return res.status(401).json({ message: "Login required" });
    }
    try {
      const user = await storage.getClientUserById(req.session.clientUserId);
      if (!user?.ouraAccessToken) {
        return res.status(400).json({ message: "Oura not connected" });
      }
      const refreshOuraToken = async () => {
        if (!user.ouraRefreshToken) return null;
        const clientId = process.env.OURA_CLIENT_ID;
        const clientSecret = process.env.OURA_CLIENT_SECRET;
        if (!clientId || !clientSecret) return null;
        const refreshRes = await fetch("https://api.ouraring.com/oauth/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: user.ouraRefreshToken,
            client_id: clientId,
            client_secret: clientSecret
          })
        });
        const refreshData = await refreshRes.json();
        if (!refreshData.access_token) return null;
        const updateFields = {
          ouraAccessToken: refreshData.access_token,
          ouraTokenExpiry: refreshData.expires_in ? new Date(Date.now() + refreshData.expires_in * 1e3) : null
        };
        if (refreshData.refresh_token) {
          updateFields.ouraRefreshToken = refreshData.refresh_token;
        }
        await storage.updateClientUser(req.session.clientUserId, updateFields);
        return refreshData.access_token;
      };
      let accessToken = user.ouraAccessToken;
      if (user.ouraTokenExpiry && new Date(user.ouraTokenExpiry) < /* @__PURE__ */ new Date()) {
        const newToken = await refreshOuraToken();
        if (!newToken) {
          return res.status(401).json({ message: "Oura token expired. Please reconnect.", reconnectRequired: true });
        }
        accessToken = newToken;
      }
      const days = Math.min(Number(req.query.days) || 7, 30);
      const endDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const startDate = new Date(Date.now() - days * 864e5).toISOString().split("T")[0];
      const fetchOura = async (endpoint) => {
        let response = await fetch(
          `https://api.ouraring.com/v2/usercollection/${endpoint}?start_date=${startDate}&end_date=${endDate}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (response.status === 401) {
          const newToken = await refreshOuraToken();
          if (!newToken) return null;
          accessToken = newToken;
          response = await fetch(
            `https://api.ouraring.com/v2/usercollection/${endpoint}?start_date=${startDate}&end_date=${endDate}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
        }
        if (!response.ok) return null;
        return response.json();
      };
      const [readinessData, sleepData, activityData] = await Promise.all([
        fetchOura("daily_readiness"),
        fetchOura("daily_sleep"),
        fetchOura("daily_activity")
      ]);
      const readiness = (readinessData?.data || []).map((d) => ({
        day: d.day,
        score: d.score,
        temperatureDeviation: d.temperature_deviation,
        contributors: d.contributors || {}
      }));
      const sleep = (sleepData?.data || []).map((d) => ({
        day: d.day,
        score: d.score,
        totalSleepDuration: d.contributors?.total_sleep,
        deepSleepDuration: d.contributors?.deep_sleep,
        remSleepDuration: d.contributors?.rem_sleep,
        efficiency: d.contributors?.efficiency,
        restfulness: d.contributors?.restfulness
      }));
      const activity = (activityData?.data || []).map((d) => ({
        day: d.day,
        score: d.score,
        activeCalories: d.active_calories,
        steps: d.steps,
        totalCalories: d.total_calories,
        contributors: d.contributors || {}
      }));
      const avgReadiness = readiness.length > 0 ? Math.round(readiness.reduce((s, r) => s + (r.score || 0), 0) / readiness.length) : null;
      const avgSleep = sleep.length > 0 ? Math.round(sleep.reduce((s, r) => s + (r.score || 0), 0) / sleep.length) : null;
      const avgActivity = activity.length > 0 ? Math.round(activity.reduce((s, r) => s + (r.score || 0), 0) / activity.length) : null;
      res.json({
        readiness,
        sleep,
        activity,
        summary: {
          avgReadiness,
          avgSleep,
          avgActivity,
          days,
          startDate,
          endDate
        }
      });
    } catch (error) {
      console.error("Oura daily data error:", error);
      res.status(502).json({ message: "Failed to fetch Oura data. Try again later." });
    }
  });
  app2.get("/api/portal/settings/public", async (_req, res) => {
    try {
      const lifetimeCutoff = await storage.getAdminSetting("lifetime_cutoff_date");
      const subscriptionEnabled = await storage.getAdminSetting("subscription_enabled");
      const subscriptionPrice = await storage.getAdminSetting("subscription_price_monthly");
      const linkedinEnabled = await storage.getAdminSetting("linkedin_oauth_enabled");
      const portalLoginEnabled = await storage.getAdminSetting("portal_login_enabled");
      const saasEnabled = await storage.getAdminSetting("saas_enabled");
      const subFeatures = await storage.getAdminSetting("saas_subscription_features");
      const scanFeatures = await storage.getAdminSetting("saas_scan_features");
      const journeyFeatures = await storage.getAdminSetting("saas_journey_features");
      res.json({
        lifetimeCutoffDate: lifetimeCutoff || "2026-08-31",
        subscriptionEnabled: subscriptionEnabled === "true",
        subscriptionPriceMonthly: subscriptionPrice || "9.95",
        linkedinLoginEnabled: linkedinEnabled !== "false" && !!process.env.LINKEDIN_CLIENT_ID && !!process.env.LINKEDIN_CLIENT_SECRET,
        googleLoginEnabled: !!process.env.GOOGLE_CLIENT_ID,
        portalLoginEnabled: portalLoginEnabled !== "false",
        saasEnabled: saasEnabled === "true",
        subscriptionFeatures: subFeatures ? JSON.parse(subFeatures) : null,
        oneTimeScanFeatures: scanFeatures ? JSON.parse(scanFeatures) : null,
        coachingJourneyFeatures: journeyFeatures ? JSON.parse(journeyFeatures) : null
      });
    } catch {
      res.json({
        lifetimeCutoffDate: "2026-08-31",
        subscriptionEnabled: true,
        subscriptionPriceMonthly: "9.95",
        linkedinLoginEnabled: !!process.env.LINKEDIN_CLIENT_ID && !!process.env.LINKEDIN_CLIENT_SECRET,
        googleLoginEnabled: !!process.env.GOOGLE_CLIENT_ID,
        portalLoginEnabled: true,
        saasEnabled: false,
        subscriptionFeatures: null,
        oneTimeScanFeatures: null,
        coachingJourneyFeatures: null
      });
    }
  });
}
var scryptAsync2;
var init_portal_auth = __esm({
  "server/portal-auth.ts"() {
    "use strict";
    init_storage();
    init_email_notifications();
    scryptAsync2 = promisify2(scrypt2);
  }
});

// server/lib/typeformClient.ts
var typeformClient_exports = {};
__export(typeformClient_exports, {
  getTypeformFormStats: () => getTypeformFormStats,
  listTypeformForms: () => listTypeformForms
});
async function getTypeformToken() {
  const token = process.env.TYPEFORM_PERSONAL_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "TYPEFORM_PERSONAL_ACCESS_TOKEN not set. Add it to Replit Secrets to enable Typeform API queries. Also set TYPEFORM_FORM_ID to the ID of your onboarding form (found in the Typeform URL: https://admin.typeform.com/form/<FORM_ID>)."
    );
  }
  return token;
}
async function getTypeformFormStats(formId) {
  if (!await isConnectorEnabled("typeform")) {
    throw new Error("Typeform connector is disabled. Enable it in Admin > Connected Tools.");
  }
  const token = await getTypeformToken();
  const [formRes, responsesRes, insightsRes] = await Promise.all([
    fetch(`${TYPEFORM_API_BASE}/forms/${formId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
    fetch(`${TYPEFORM_API_BASE}/forms/${formId}/responses?page_size=1&completed=true`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
    fetch(`${TYPEFORM_API_BASE}/insights/${formId}/summary`, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => null)
  ]);
  if (!formRes.ok) {
    throw new Error(`Typeform API error: ${formRes.status} ${formRes.statusText}`);
  }
  const formData = await formRes.json();
  const responsesData = responsesRes.ok ? await responsesRes.json() : null;
  const insightsData = insightsRes && insightsRes.ok ? await insightsRes.json() : null;
  let completionRate = null;
  if (insightsData?.average_percentage_completion != null) {
    completionRate = Math.round(insightsData.average_percentage_completion);
  } else if (insightsData?.completion_rate != null) {
    completionRate = Math.round(insightsData.completion_rate * 100);
  }
  return {
    formId,
    title: formData.title || formId,
    totalResponses: responsesData?.total_items || 0,
    completionRate
  };
}
async function listTypeformForms() {
  if (!await isConnectorEnabled("typeform")) {
    throw new Error("Typeform connector is disabled. Enable it in Admin > Connected Tools.");
  }
  const token = await getTypeformToken();
  const res = await fetch(`${TYPEFORM_API_BASE}/forms?page_size=50`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    throw new Error(`Typeform API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return (data.items || []).map((f) => ({
    id: f.id,
    title: f.title
  }));
}
var TYPEFORM_API_BASE;
var init_typeformClient = __esm({
  "server/lib/typeformClient.ts"() {
    "use strict";
    init_connectorGuard();
    TYPEFORM_API_BASE = "https://api.typeform.com";
  }
});

// server/onboarding-scheduler.ts
var onboarding_scheduler_exports = {};
__export(onboarding_scheduler_exports, {
  processOnboardingEmails: () => processOnboardingEmails,
  startOnboardingScheduler: () => startOnboardingScheduler,
  stopOnboardingScheduler: () => stopOnboardingScheduler,
  triggerOnboardingEmail: () => triggerOnboardingEmail
});
async function getCustomersNeedingEmails() {
  const purchases2 = await storage.getAllSatellitescanPurchases();
  const results = [];
  const customerMap = /* @__PURE__ */ new Map();
  for (const purchase of purchases2) {
    if (purchase.status !== "succeeded") continue;
    const existing = customerMap.get(purchase.customerEmail);
    let scanDate = null;
    if (purchase.typeformCompleted === "true") {
      scanDate = purchase.typeformCompletedAt || null;
    }
    if (!existing) {
      customerMap.set(purchase.customerEmail, {
        customerEmail: purchase.customerEmail,
        customerName: purchase.customerName,
        latestPurchaseDate: purchase.createdAt,
        scanCompletedDate: scanDate
      });
    } else {
      if (purchase.createdAt > existing.latestPurchaseDate) {
        existing.latestPurchaseDate = purchase.createdAt;
        existing.customerName = purchase.customerName || existing.customerName;
      }
      if (scanDate && (!existing.scanCompletedDate || scanDate > existing.scanCompletedDate)) {
        existing.scanCompletedDate = scanDate;
      }
    }
  }
  for (const customer of Array.from(customerMap.values())) {
    const logs = await storage.getOnboardingEmailLogsByCustomer(customer.customerEmail);
    const sentLogs = logs.filter((l) => l.status === "sent");
    let lastSentSequence = -1;
    let lastSentAt = null;
    if (sentLogs.length > 0) {
      const maxLog = sentLogs.reduce(
        (max, log2) => parseInt(log2.sequenceNumber) > parseInt(max.sequenceNumber) ? log2 : max
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
      lastSentAt
    });
  }
  return results;
}
function shouldSendEmail(customer, template, now) {
  const sequenceNum = parseInt(template.sequenceNumber);
  const delayMinutes = parseInt(template.delayMinutes);
  if (customer.lastSentSequence >= sequenceNum) {
    return false;
  }
  if (customer.lastSentSequence + 1 !== sequenceNum) {
    return false;
  }
  if (template.triggerEvent === "purchase") {
    const triggerTime = customer.purchaseDate;
    const dueTime = new Date(triggerTime.getTime() + delayMinutes * 60 * 1e3);
    return now >= dueTime;
  } else if (template.triggerEvent === "scan_completed") {
    if (!customer.scanCompletedDate) {
      return false;
    }
    const triggerTime = customer.scanCompletedDate;
    const dueTime = new Date(triggerTime.getTime() + delayMinutes * 60 * 1e3);
    return now >= dueTime;
  }
  return false;
}
async function processOnboardingEmails() {
  try {
    const templates = await storage.getActiveOnboardingEmailTemplates();
    if (templates.length === 0) {
      return;
    }
    const customers = await getCustomersNeedingEmails();
    const now = /* @__PURE__ */ new Date();
    for (const customer of customers) {
      const sortedTemplates = templates.sort(
        (a, b) => parseInt(a.sequenceNumber) - parseInt(b.sequenceNumber)
      );
      for (const template of sortedTemplates) {
        if (shouldSendEmail(customer, template, now)) {
          try {
            const sent = await sendOnboardingEmail({
              customerEmail: customer.customerEmail,
              customerName: customer.customerName,
              subject: template.subject,
              body: template.body,
              sequenceNumber: template.sequenceNumber
            });
            await storage.createOnboardingEmailLog({
              customerEmail: customer.customerEmail,
              templateId: template.id,
              sequenceNumber: template.sequenceNumber,
              status: sent ? "sent" : "failed",
              errorMessage: sent ? void 0 : "Email send returned false"
            });
            if (sent) {
              console.log(`\u{1F4E7} Onboarding email #${template.sequenceNumber} sent to ${customer.customerEmail}`);
            }
            break;
          } catch (error) {
            console.error(`\u274C Error sending onboarding email #${template.sequenceNumber} to ${customer.customerEmail}:`, error);
            await storage.createOnboardingEmailLog({
              customerEmail: customer.customerEmail,
              templateId: template.id,
              sequenceNumber: template.sequenceNumber,
              status: "failed",
              errorMessage: error.message || "Unknown error"
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("\u274C Error in onboarding email scheduler:", error);
  }
}
async function triggerOnboardingEmail(customerEmail, sequenceNumber) {
  try {
    const template = await storage.getOnboardingEmailTemplateBySequence(sequenceNumber);
    if (!template) {
      return { success: false, message: `Template for sequence ${sequenceNumber} not found` };
    }
    if (template.isActive !== "true") {
      return { success: false, message: `Template for sequence ${sequenceNumber} is not active` };
    }
    const alreadySent = await storage.hasEmailBeenSent(customerEmail, sequenceNumber);
    if (alreadySent) {
      return { success: false, message: `Email #${sequenceNumber} already sent to ${customerEmail}` };
    }
    const purchases2 = await storage.getAllSatellitescanPurchases();
    const purchase = purchases2.find((p) => p.customerEmail === customerEmail);
    const sent = await sendOnboardingEmail({
      customerEmail,
      customerName: purchase?.customerName || null,
      subject: template.subject,
      body: template.body,
      sequenceNumber: template.sequenceNumber
    });
    await storage.createOnboardingEmailLog({
      customerEmail,
      templateId: template.id,
      sequenceNumber: template.sequenceNumber,
      status: sent ? "sent" : "failed",
      errorMessage: sent ? void 0 : "Email send returned false"
    });
    if (sent) {
      return { success: true, message: `Email #${sequenceNumber} sent to ${customerEmail}` };
    } else {
      return { success: false, message: `Failed to send email #${sequenceNumber}` };
    }
  } catch (error) {
    console.error("Error triggering onboarding email:", error);
    return { success: false, message: error.message || "Unknown error" };
  }
}
function startOnboardingScheduler() {
  if (schedulerInterval) {
    console.log("\u26A0\uFE0F Onboarding email scheduler already running");
    return;
  }
  console.log("\u{1F514} Onboarding email scheduler initialized");
  console.log(`\u23F0 Will check for pending onboarding emails every ${SCHEDULER_INTERVAL / 6e4} minutes`);
  processOnboardingEmails();
  schedulerInterval = setInterval(processOnboardingEmails, SCHEDULER_INTERVAL);
}
function stopOnboardingScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log("\u{1F6D1} Onboarding email scheduler stopped");
  }
}
var SCHEDULER_INTERVAL, schedulerInterval;
var init_onboarding_scheduler = __esm({
  "server/onboarding-scheduler.ts"() {
    "use strict";
    init_storage();
    init_email_notifications();
    SCHEDULER_INTERVAL = 5 * 60 * 1e3;
    schedulerInterval = null;
  }
});

// server/daily-pulse.ts
var daily_pulse_exports = {};
__export(daily_pulse_exports, {
  runDailyPulse: () => runDailyPulse,
  startDailyPulseScheduler: () => startDailyPulseScheduler
});
function formatDate(d) {
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  });
}
function isWithin24Hours(timestamp2, windowStart) {
  if (!timestamp2) return false;
  const ts = typeof timestamp2 === "string" ? new Date(timestamp2) : timestamp2;
  return ts >= windowStart;
}
async function runDailyPulse() {
  const now = /* @__PURE__ */ new Date();
  const windowStart = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
  const dateLabel = formatDate(now);
  console.log(`
\u{1F4CA} Running daily pulse for ${dateLabel}...`);
  try {
    const [
      scanPurchases,
      newsletterSubs,
      webinarSignups,
      flowChecks,
      quizResults,
      contactMessages2
    ] = await Promise.all([
      storage.getAllSatellitescanPurchases(),
      storage.getAllNewsletterSubscriptions(),
      storage.getAllWebinarWaitlistEntries(),
      storage.getAllFlowCheckResults(),
      storage.getAllSignalsQuizResults(),
      storage.getAllContactMessages()
    ]);
    const recentScans = scanPurchases.filter((p) => isWithin24Hours(p.createdAt, windowStart));
    const recentNewsletter = newsletterSubs.filter((s) => isWithin24Hours(s.createdAt, windowStart));
    const recentWebinar = webinarSignups.filter((w) => isWithin24Hours(w.createdAt, windowStart));
    const recentFlow = flowChecks.filter((f) => isWithin24Hours(f.createdAt, windowStart));
    const recentQuiz = quizResults.filter((q) => isWithin24Hours(q.createdAt, windowStart));
    const recentContact = contactMessages2.filter((c) => isWithin24Hours(c.createdAt, windowStart));
    const revenue = recentScans.reduce((sum, p) => sum + (parseFloat(p.amount) || 99.95), 0);
    const flowZones = {};
    for (const f of recentFlow) {
      const zone = f.zone ?? "unknown";
      flowZones[zone] = (flowZones[zone] ?? 0) + 1;
    }
    await sendDailyPulseEmail({
      date: dateLabel,
      scanPurchases: recentScans.length,
      revenue,
      newsletterSubs: recentNewsletter.length,
      webinarSignups: recentWebinar.length,
      flowChecks: recentFlow.length,
      flowZones,
      quizCompletions: recentQuiz.length,
      contactMessages: recentContact.length
    });
    console.log("\u2705 Daily pulse email sent.");
    return true;
  } catch (error) {
    console.error("\u274C Daily pulse failed:", error);
    return false;
  }
}
function startDailyPulseScheduler() {
  const now = /* @__PURE__ */ new Date();
  const nextRun = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + (now.getUTCHours() >= 8 ? 1 : 0),
      8,
      0,
      0,
      0
    )
  );
  const msUntilNext = nextRun.getTime() - now.getTime();
  console.log(`\u{1F4CA} Daily pulse scheduler initialized \u2014 first run in ${Math.round(msUntilNext / 6e4)} minutes (${nextRun.toISOString()})`);
  setTimeout(() => {
    runDailyPulse();
    setInterval(runDailyPulse, 24 * 60 * 60 * 1e3);
  }, msUntilNext);
}
var init_daily_pulse = __esm({
  "server/daily-pulse.ts"() {
    "use strict";
    init_storage();
    init_email_notifications();
  }
});

// server/lib/gmailClient.ts
var gmailClient_exports = {};
__export(gmailClient_exports, {
  getGmailClient: () => getGmailClient,
  harvestEmailChains: () => harvestEmailChains
});
import { google as google2 } from "googleapis";
async function getAccessToken4() {
  if (connectionSettings4 && connectionSettings4.settings.expires_at && new Date(connectionSettings4.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings4.settings.access_token;
  }
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY ? "repl " + process.env.REPL_IDENTITY : process.env.WEB_REPL_RENEWAL ? "depl " + process.env.WEB_REPL_RENEWAL : null;
  if (!xReplitToken) {
    throw new Error("X_REPLIT_TOKEN not found for repl/depl");
  }
  const gmailRes = await fetch(
    "https://" + hostname + "/api/v2/connection?include_secrets=true&connector_names=gmail",
    {
      headers: {
        "Accept": "application/json",
        "X_REPLIT_TOKEN": xReplitToken
      }
    }
  ).then((res) => res.json());
  const gmailConnection = gmailRes.items?.[0];
  if (!gmailConnection) {
    throw new Error("Gmail connector not configured. Add the Gmail integration in Admin > Connected Tools before using email harvesting.");
  }
  connectionSettings4 = gmailConnection;
  const accessToken = connectionSettings4?.settings?.access_token || connectionSettings4?.settings?.oauth?.credentials?.access_token;
  if (!accessToken) {
    throw new Error("Gmail OAuth token missing. Re-authenticate the Gmail connector in Admin > Connected Tools.");
  }
  return accessToken;
}
async function getGmailClient() {
  const accessToken = await getAccessToken4();
  const oauth2Client = new google2.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google2.gmail({ version: "v1", auth: oauth2Client });
}
async function harvestEmailChains(query, maxResults = 20) {
  if (!await isConnectorEnabled("gmail")) {
    throw new Error("Gmail connector is currently disabled. Enable it in Admin > Connected Tools.");
  }
  const gmail = await getGmailClient();
  const threads = [];
  const listRes = await gmail.users.threads.list({
    userId: "me",
    q: query,
    maxResults
  });
  if (!listRes.data.threads) return [];
  for (const thread of listRes.data.threads.slice(0, maxResults)) {
    const threadRes = await gmail.users.threads.get({
      userId: "me",
      id: thread.id,
      format: "metadata",
      metadataHeaders: ["From", "To", "Subject", "Date"]
    });
    const messages = (threadRes.data.messages || []).map((msg) => {
      const headers = msg.payload?.headers || [];
      const getHeader = (name) => headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value || "";
      return {
        id: msg.id || "",
        from: getHeader("From"),
        to: getHeader("To"),
        date: getHeader("Date"),
        subject: getHeader("Subject"),
        body: msg.snippet || ""
      };
    });
    if (messages.length > 0) {
      threads.push({
        threadId: thread.id,
        subject: messages[0].subject,
        from: messages[0].from,
        to: messages[0].to,
        date: messages[0].date,
        snippet: threadRes.data.messages?.[0]?.snippet || "",
        messages
      });
    }
  }
  return threads;
}
var connectionSettings4;
var init_gmailClient = __esm({
  "server/lib/gmailClient.ts"() {
    "use strict";
    init_connectorGuard();
  }
});

// server/index.ts
init_db();
import express2 from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

// server/routes.ts
init_db();
init_storage();
import { createServer } from "http";

// server/auth.ts
init_storage();
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
async function hashAdminPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scryptAsync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}
async function verifyHashedPassword(password, hash) {
  const [salt, key] = hash.split(":");
  if (!salt || !key) return false;
  const derivedKey = await scryptAsync(password, salt, 64);
  const storedKey = Buffer.from(key, "hex");
  return timingSafeEqual(derivedKey, storedKey);
}
var lastActivityUpdate = /* @__PURE__ */ new Map();
function requireAdminAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    if (req.session.adminUserId) {
      const now = Date.now();
      const last = lastActivityUpdate.get(req.session.adminUserId) || 0;
      if (now - last > 5 * 60 * 1e3) {
        lastActivityUpdate.set(req.session.adminUserId, now);
        storage.updateAdminUser(req.session.adminUserId, { lastLoginAt: /* @__PURE__ */ new Date() }).catch(() => {
        });
      }
    }
    return next();
  }
  return res.status(401).json({
    message: "Unauthorized. Please log in to access admin dashboard."
  });
}
function requireAdminRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.session?.isAdmin || !req.session?.adminRole) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.session.adminRole === "super_admin") {
      return next();
    }
    if (!allowedRoles.includes(req.session.adminRole)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    return next();
  };
}
function requireWriteAccess(req, res, next) {
  if (!req.session?.isAdmin || !req.session?.adminRole) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.session.adminRole === "viewer") {
    return res.status(403).json({ message: "Viewers have read-only access" });
  }
  return next();
}
async function verifyAdminPassword(password) {
  try {
    const dbHash = await storage.getAdminSetting("admin_password_hash");
    if (dbHash) {
      return verifyHashedPassword(password, dbHash);
    }
  } catch {
  }
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) {
    console.error("ADMIN_PASSWORD not set in environment variables");
    return false;
  }
  return password === ADMIN_PASSWORD;
}
async function logAuditEvent(userEmail, actionType, resource, details, ipAddress) {
  try {
    await storage.createAuditLog({
      userEmail,
      actionType,
      resource: resource || null,
      details: details || null,
      ipAddress: ipAddress || null
    });
  } catch (err) {
    console.error("Audit log write failed:", err);
  }
}
var SENSITIVE_FIELDS = ["password", "currentPassword", "newPassword", "passwordHash", "secret", "token"];
function redactBody(body) {
  if (!body || typeof body !== "object") return body;
  const redacted = {};
  for (const [key, value] of Object.entries(body)) {
    if (SENSITIVE_FIELDS.includes(key)) {
      redacted[key] = "[REDACTED]";
    } else {
      redacted[key] = value;
    }
  }
  return redacted;
}
function auditMiddleware(req, res, next) {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && req.session?.adminEmail) {
    const originalEnd = res.end;
    const email = req.session.adminEmail;
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    res.end = function(...args) {
      const statusCode = res.statusCode;
      if (statusCode < 400) {
        logAuditEvent(
          email,
          `${req.method} ${req.path}`,
          req.path,
          { body: redactBody(req.body), statusCode },
          ip
        );
      }
      return originalEnd.apply(this, args);
    };
  }
  next();
}

// server/lib/ga4Client.ts
init_connectorGuard();
var GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID;
var GOOGLE_SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
function isGA4Configured() {
  return !!GA4_PROPERTY_ID;
}
function isGA4DataApiConfigured() {
  return !!(GA4_PROPERTY_ID && GOOGLE_SERVICE_ACCOUNT_KEY);
}
function getPropertyId() {
  return GA4_PROPERTY_ID || null;
}
function getDateRange(window) {
  const endDate = "today";
  if (window === "7d") return { startDate: "7daysAgo", endDate };
  if (window === "30d") return { startDate: "30daysAgo", endDate };
  return { startDate: "2020-01-01", endDate };
}
async function getAccessToken() {
  if (!GOOGLE_SERVICE_ACCOUNT_KEY) return null;
  try {
    const key = JSON.parse(GOOGLE_SERVICE_ACCOUNT_KEY);
    const jwt = await createJWT(key);
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt
      })
    });
    if (!tokenRes.ok) {
      console.error("GA4 token exchange failed:", await tokenRes.text());
      return null;
    }
    const tokenData = await tokenRes.json();
    return tokenData.access_token;
  } catch (err) {
    console.error("GA4 service account auth failed:", err);
    return null;
  }
}
async function createJWT(key) {
  const crypto2 = await import("crypto");
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const now = Math.floor(Date.now() / 1e3);
  const payload = Buffer.from(JSON.stringify({
    iss: key.client_email,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now
  })).toString("base64url");
  const signInput = `${header}.${payload}`;
  const sign = crypto2.createSign("RSA-SHA256");
  sign.update(signInput);
  const signature = sign.sign(key.private_key, "base64url");
  return `${signInput}.${signature}`;
}
async function runGA4Report(accessToken, dateRange, metrics, dimensions, dimensionFilter) {
  const body = {
    dateRanges: [dateRange],
    metrics
  };
  if (dimensions) body.dimensions = dimensions;
  if (dimensionFilter) body.dimensionFilter = dimensionFilter;
  try {
    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }
    );
    if (!res.ok) {
      console.error("GA4 report failed:", res.status, await res.text());
      return null;
    }
    const data = await res.json();
    return data.rows || [];
  } catch (err) {
    console.error("GA4 report request failed:", err);
    return null;
  }
}
async function fetchGA4Metrics(window) {
  if (!await isConnectorEnabled("google-analytics")) {
    console.log("\u23F8\uFE0F Google Analytics connector disabled \u2014 returning null metrics");
    return {
      sessions: null,
      uniqueUsers: null,
      organicUsers: null,
      topTrafficSources: null,
      scanPageViews: null,
      promptCopyEvents: null,
      coachingCTAClicks: null,
      returnVisitorRate: null,
      promptCopiesPerSession: null,
      directTrafficShare: null
    };
  }
  const nullMetrics = {
    sessions: null,
    uniqueUsers: null,
    organicUsers: null,
    topTrafficSources: null,
    scanPageViews: null,
    promptCopyEvents: null,
    coachingCTAClicks: null,
    returnVisitorRate: null,
    promptCopiesPerSession: null,
    directTrafficShare: null
  };
  if (!isGA4Configured()) {
    return nullMetrics;
  }
  const propertyId = getPropertyId();
  if (!propertyId) {
    console.warn("GA4: GA4_PROPERTY_ID not set (VITE_GA_MEASUREMENT_ID alone cannot be used for Data API \u2014 set GA4_PROPERTY_ID to the numeric property ID)");
    return nullMetrics;
  }
  const accessToken = await getAccessToken();
  if (!accessToken) {
    console.warn("GA4: Could not obtain access token, returning null metrics");
    return nullMetrics;
  }
  const dateRange = getDateRange(window);
  const result = { ...nullMetrics };
  try {
    const [sessionsReport, scanPagesReport, promptEventsReport, coachingEventsReport, trafficReport, organicReport] = await Promise.all([
      runGA4Report(accessToken, dateRange, [
        { name: "sessions" },
        { name: "totalUsers" },
        { name: "newUsers" }
      ]),
      runGA4Report(accessToken, dateRange, [{ name: "screenPageViews" }], void 0, {
        filter: {
          fieldName: "pagePath",
          stringFilter: { matchType: "EXACT", value: "/scan" }
        }
      }),
      runGA4Report(accessToken, dateRange, [{ name: "eventCount" }], [{ name: "eventName" }], {
        filter: {
          fieldName: "eventName",
          stringFilter: { matchType: "EXACT", value: "prompt_copied" }
        }
      }),
      runGA4Report(accessToken, dateRange, [{ name: "eventCount" }], [{ name: "eventName" }], {
        filter: {
          fieldName: "eventName",
          stringFilter: { matchType: "EXACT", value: "coaching_cta_clicked" }
        }
      }),
      runGA4Report(accessToken, dateRange, [{ name: "sessions" }], [{ name: "sessionSource" }]),
      runGA4Report(accessToken, dateRange, [{ name: "totalUsers" }], [{ name: "sessionDefaultChannelGroup" }], {
        filter: {
          fieldName: "sessionDefaultChannelGroup",
          stringFilter: { matchType: "EXACT", value: "Organic Search" }
        }
      })
    ]);
    if (sessionsReport && sessionsReport.length > 0) {
      const row = sessionsReport[0];
      const metricValues = row.metricValues || [];
      result.sessions = parseInt(metricValues[0]?.value || "0");
      result.uniqueUsers = parseInt(metricValues[1]?.value || "0");
      const newUsers = parseInt(metricValues[2]?.value || "0");
      const returningUsers = result.uniqueUsers - newUsers;
      result.returnVisitorRate = result.uniqueUsers > 0 ? Math.round(returningUsers / result.uniqueUsers * 100) : 0;
    }
    if (organicReport && organicReport.length > 0) {
      const row = organicReport[0];
      const metricValues = row.metricValues || [];
      result.organicUsers = parseInt(metricValues[0]?.value || "0");
    }
    if (scanPagesReport && scanPagesReport.length > 0) {
      const row = scanPagesReport[0];
      const metricValues = row.metricValues || [];
      result.scanPageViews = parseInt(metricValues[0]?.value || "0");
    }
    if (promptEventsReport && promptEventsReport.length > 0) {
      const row = promptEventsReport[0];
      const metricValues = row.metricValues || [];
      result.promptCopyEvents = parseInt(metricValues[0]?.value || "0");
      if (result.sessions && result.sessions > 0) {
        result.promptCopiesPerSession = Math.round(result.promptCopyEvents / result.sessions * 100) / 100;
      }
    }
    if (coachingEventsReport && coachingEventsReport.length > 0) {
      const row = coachingEventsReport[0];
      const metricValues = row.metricValues || [];
      result.coachingCTAClicks = parseInt(metricValues[0]?.value || "0");
    }
    if (trafficReport && trafficReport.length > 0) {
      const rows = trafficReport;
      const sources = rows.map((r) => {
        const dims = r.dimensionValues || [];
        const mets = r.metricValues || [];
        return { source: dims[0]?.value || "unknown", sessions: parseInt(mets[0]?.value || "0") };
      }).sort((a, b) => b.sessions - a.sessions);
      const totalSessions = sources.reduce((s, r) => s + r.sessions, 0);
      result.topTrafficSources = sources.slice(0, 3).map((s) => s.source).join(", ");
      const directSessions = sources.find((s) => s.source === "(direct)")?.sessions || 0;
      result.directTrafficShare = totalSessions > 0 ? Math.round(directSessions / totalSessions * 100) : 0;
    }
  } catch (err) {
    console.error("GA4 metrics fetch error:", err);
  }
  return result;
}

// server/routes.ts
init_connectorGuard();
import Stripe from "stripe";

// shared/packages.ts
var COACHING_PACKAGES = {
  "1on1-single": {
    name: "1:1 Single Session",
    price: 295,
    // EUR
    features: [
      "120-minute deep-dive session",
      "Personalized framework analysis",
      "Action plan with 3 micro-habits",
      "Session recording & transcript"
    ]
  },
  "coaching-journey": {
    name: "Coaching Journey - Communication Clarity & Influence Boost",
    price: 2980,
    // EUR
    features: [
      "AI-powered Satellite Scan\u2122 (90 questions, ~120 min)",
      "Clarity & goal-setting session",
      "Biweekly coaching sessions (2 hours each)",
      "Unlimited 20-min check-in calls",
      "Ongoing messaging support",
      "Personalized micro-habit plan",
      "Lens video library access",
      "Support until objectives are reached"
    ]
  },
  "interview-mastery": {
    name: "Interview Mastery Bundle",
    price: 845,
    // EUR
    features: [
      "Full Satellite Scan diagnostic (90 questions)",
      "3 x 1-hour personalized coaching sessions",
      "Interview-specific communication analysis",
      "Mock interview with feedback",
      "Post-interview debrief call"
    ],
    includesSatelliteScan: true,
    calendlyLink: "https://calendly.com/greenelephant/3-session-interview-mastery"
  },
  "team-workshop": {
    name: "Team Workshop",
    price: 1200,
    // EUR
    savings: "\u20AC120/person for 10 participants",
    features: [
      "Half-day intensive for up to 10 people",
      "Live framework mapping exercise",
      "Team communication audit",
      "Custom micro-habit playbook",
      "30-day follow-up session included"
    ]
  }
};

// server/routes.ts
init_schema();
init_email_notifications();
init_googleSheets();
init_thesysApi();
init_notionSync();
import { fromError } from "zod-validation-error";
var STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
var stripe = null;
if (STRIPE_KEY) {
  stripe = new Stripe(STRIPE_KEY, {
    apiVersion: "2023-10-16"
    // Using stable version with type assertion
  });
  console.log("\u2713 Stripe initialized successfully");
} else {
  console.warn("\u26A0 Warning: STRIPE_SECRET_KEY not found. Payment functionality will be disabled.");
  console.warn("  To enable payments, add STRIPE_SECRET_KEY to your deployment secrets.");
}
async function registerRoutes(app2) {
  app2.use("/api/admin", auditMiddleware);
  app2.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({
        message: "Payment processing is currently unavailable. Please contact support."
      });
    }
    if (!await isConnectorEnabled("stripe")) {
      return res.status(503).json({
        message: "Payment processing is currently disabled. Please contact support."
      });
    }
    try {
      const { packageId, customerEmail, customerName } = req.body;
      if (!packageId || !(packageId in COACHING_PACKAGES)) {
        return res.status(400).json({ message: "Invalid package" });
      }
      const packageInfo = COACHING_PACKAGES[packageId];
      const amount = packageInfo.price;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        // Convert to cents
        currency: "eur",
        // GreenElephant pricing is in EUR
        metadata: {
          packageId,
          packageName: packageInfo.name,
          customerEmail: customerEmail || "",
          customerName: customerName || ""
        },
        receipt_email: customerEmail || void 0
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Stripe payment intent error:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });
  app2.post("/api/webhooks/stripe", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Stripe not configured" });
    }
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    try {
      let event;
      if (webhookSecret) {
        const signature = req.headers["stripe-signature"];
        if (!signature) {
          console.error("\u26A0\uFE0F Webhook signature missing");
          return res.status(400).json({ message: "Missing stripe-signature header" });
        }
        try {
          event = stripe.webhooks.constructEvent(
            req.rawBody,
            signature,
            webhookSecret
          );
          console.log("\u2705 Webhook signature verified");
        } catch (err) {
          console.error("\u274C Webhook signature verification failed:", err.message);
          return res.status(400).json({ message: `Webhook signature verification failed: ${err.message}` });
        }
      } else {
        console.warn("\u26A0\uFE0F STRIPE_WEBHOOK_SECRET not set - signature verification disabled (NOT SECURE FOR PRODUCTION)");
        event = req.body;
      }
      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const { packageId, packageName, customerName } = paymentIntent.metadata;
        const customerEmail = paymentIntent.metadata.customerEmail || paymentIntent.receipt_email || "";
        const amount = (paymentIntent.amount / 100).toString();
        console.log("\u{1F4E7} Payment Intent customer email sources:");
        console.log("  - metadata.customerEmail:", paymentIntent.metadata.customerEmail || "NOT SET");
        console.log("  - receipt_email:", paymentIntent.receipt_email || "NOT SET");
        console.log("  - Final customerEmail:", customerEmail || "EMPTY!");
        if (!customerEmail || !packageName) {
          console.error("\u274C CRITICAL: Missing required metadata in payment intent:", paymentIntent.id);
          console.error("\u274C customerEmail:", customerEmail || "MISSING");
          console.error("\u274C packageName:", packageName || "MISSING");
          return res.status(400).json({ message: "Invalid payment intent metadata" });
        }
        const existingPurchase = await storage.getPurchaseByPaymentIntent(paymentIntent.id);
        if (!existingPurchase) {
          const purchase = await storage.createPurchase({
            customerEmail,
            customerName: customerName || void 0,
            packageId: packageId || "unknown",
            packageName,
            amount,
            stripePaymentIntentId: paymentIntent.id,
            status: "succeeded"
          });
          console.log("\u{1F389} NEW PURCHASE! \u{1F389}");
          console.log("\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501");
          console.log(`Customer: ${customerName || "Not provided"}`);
          console.log(`Email: ${customerEmail}`);
          console.log(`Package: ${packageName}`);
          console.log(`Amount: \u20AC${amount}`);
          console.log(`Payment ID: ${paymentIntent.id}`);
          console.log(`Purchase ID: ${purchase.id}`);
          console.log(`Time: ${(/* @__PURE__ */ new Date()).toISOString()}`);
          console.log("\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501");
          const emailSent = await sendPurchaseNotification({
            customerEmail,
            customerName: customerName || null,
            packageName,
            packageId: packageId || "unknown",
            amount,
            paymentIntentId: paymentIntent.id,
            purchaseId: purchase.id
          });
          if (!emailSent) {
            console.log("\u26A0\uFE0F Email notification failed - manual follow-up required");
            console.log("\u{1F449} ACTION REQUIRED: Email customer at:", customerEmail);
            console.log("\u{1F449} Include Calendly link: https://calendly.com/greenelephant/satellite-scan-session");
          }
          if (paymentIntent.metadata.product === "portal_subscription" && paymentIntent.metadata.couponCode) {
            try {
              const coupon = await storage.getCouponByCode(paymentIntent.metadata.couponCode);
              if (coupon) {
                await storage.incrementCouponUsage(coupon.id);
                console.log(`\u2713 Coupon usage incremented for: ${paymentIntent.metadata.couponCode}`);
              }
            } catch (err) {
              console.log("Coupon usage increment error:", err.message);
            }
          }
          try {
            await markContactAsCustomer(customerEmail, {
              productName: packageName,
              amount,
              customerName: customerName || void 0
            });
            await storage.addChannelToContact(customerEmail, "Purchase");
            console.log(`\u2713 Purchase channel added for: ${customerEmail}`);
          } catch (err) {
            console.log("Notion sync for purchase error:", err.message);
          }
        } else {
          console.log("\u2139\uFE0F Duplicate webhook event received for payment:", paymentIntent.id);
        }
      }
      res.json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(400).json({ message: error.message });
    }
  });
  app2.post("/api/typeform-webhook", async (req, res) => {
    try {
      if (!await isConnectorEnabled("typeform")) {
        console.log("\u23F8\uFE0F Typeform connector disabled \u2014 rejecting webhook");
        return res.status(503).json({ message: "Typeform integration is currently disabled" });
      }
      console.log("\u{1F4EC} Typeform webhook received");
      let body;
      try {
        const rawBody = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : req.body;
        body = typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody;
        console.log("\u{1F4E6} Payload size:", Buffer.isBuffer(req.body) ? req.body.length : JSON.stringify(req.body).length, "bytes");
      } catch (parseError) {
        console.error("\u274C Failed to parse Typeform payload:", parseError.message);
        return res.status(400).json({ message: "Invalid JSON payload" });
      }
      const { form_response } = body;
      if (!form_response) {
        console.error("\u274C Invalid Typeform webhook payload - missing form_response");
        return res.status(400).json({ message: "Invalid webhook payload" });
      }
      const { answers, definition, submitted_at } = form_response;
      if (!answers || !definition) {
        console.error("\u274C Invalid Typeform webhook payload - missing answers or definition");
        return res.status(400).json({ message: "Invalid webhook payload structure" });
      }
      const fieldTitles = {};
      if (definition.fields) {
        for (const field of definition.fields) {
          fieldTitles[field.id] = field.title || field.id;
        }
      }
      const rawData = {};
      let customerEmail = "";
      let firstName = "";
      let lastName = "";
      let role = "";
      let jobTitle = "";
      let country = "";
      let education = "";
      let gender = "";
      let birthYear = "";
      let experience = "";
      let communicationSituations = "";
      for (const answer of answers) {
        const fieldId = answer.field?.id;
        const fieldTitle = fieldTitles[fieldId] || fieldId;
        let answerValue = "";
        switch (answer.type) {
          case "text":
          case "short_text":
          case "long_text":
            answerValue = answer.text || "";
            break;
          case "email":
            answerValue = answer.email || "";
            customerEmail = answerValue;
            break;
          case "number":
            answerValue = answer.number?.toString() || "";
            break;
          case "boolean":
            answerValue = answer.boolean ? "Yes" : "No";
            break;
          case "choice":
            answerValue = answer.choice?.label || answer.choice?.other || "";
            break;
          case "choices":
            answerValue = answer.choices?.labels?.join(", ") || answer.choices?.other || "";
            break;
          case "date":
            answerValue = answer.date || "";
            break;
          case "url":
            answerValue = answer.url || "";
            break;
          case "file_url":
            answerValue = answer.file_url || "";
            break;
          case "payment":
            answerValue = `${answer.payment?.amount} ${answer.payment?.currency}`;
            break;
          default:
            answerValue = JSON.stringify(answer) || "";
        }
        rawData[fieldTitle] = answerValue;
        const lowerTitle = fieldTitle.toLowerCase();
        if (lowerTitle.includes("first name")) {
          firstName = answerValue;
        } else if (lowerTitle.includes("last name")) {
          lastName = answerValue;
        } else if (lowerTitle.includes("work role") || lowerTitle.includes("identifies your work")) {
          role = answerValue;
        } else if (lowerTitle.includes("job title")) {
          jobTitle = answerValue;
        } else if (lowerTitle.includes("country") || lowerTitle.includes("nationality")) {
          country = answerValue;
        } else if (lowerTitle.includes("education") || lowerTitle.includes("highest degree") || lowerTitle.includes("school") || lowerTitle.includes("your h")) {
          education = answerValue;
        } else if (lowerTitle.includes("gender")) {
          gender = answerValue;
        } else if (lowerTitle.includes("birth") || lowerTitle.includes("year") && lowerTitle.includes("born")) {
          birthYear = answerValue;
        } else if (lowerTitle.includes("how long") || lowerTitle.includes("experience") || lowerTitle.includes("months")) {
          experience = answerValue;
        } else if (lowerTitle.includes("teamwork") || lowerTitle.includes("communication") && lowerTitle.includes("situation")) {
          communicationSituations = answerValue;
        }
      }
      if (!customerEmail) {
        console.warn("\u26A0\uFE0F No customer email found in Typeform response");
        if (form_response.hidden && form_response.hidden.email) {
          customerEmail = form_response.hidden.email;
        }
      }
      const submittedAt = submitted_at ? new Date(submitted_at).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Europe/Helsinki"
      }) : (/* @__PURE__ */ new Date()).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Europe/Helsinki"
      });
      console.log("\u{1F4CA} Scan data received for:", firstName, lastName);
      console.log("\u{1F4E7} Customer email:", customerEmail || "Not provided");
      console.log("\u{1F4DD} Total answers:", Object.keys(rawData).length);
      if (customerEmail) {
        const emailSent = await sendTypeformScanCompletionEmail({
          customerEmail,
          customerName: firstName ? `${firstName} ${lastName}`.trim() : null,
          formattedSummary: {
            firstName,
            lastName,
            role,
            jobTitle,
            country,
            education,
            gender,
            birthYear,
            experience,
            communicationSituations
          },
          rawData,
          submittedAt
        });
        if (emailSent) {
          console.log("\u2705 Scan completion email sent successfully");
        } else {
          console.error("\u274C Failed to send scan completion email");
        }
        try {
          const updatedCount = await storage.markTypeformCompletedByEmail(customerEmail);
          if (updatedCount > 0) {
            console.log(`\u2705 Marked ${updatedCount} Satellitescan purchase(s) as Typeform completed for:`, customerEmail);
          }
        } catch (purchaseError) {
          console.error("\u26A0\uFE0F Purchase update error (non-blocking):", purchaseError.message);
        }
        if (role) {
          try {
            await storage.updateSatellitescanRole(customerEmail, role);
            console.log(`\u2705 Saved role "${role}" for ${customerEmail}`);
          } catch (roleError) {
            console.error("\u26A0\uFE0F Role update error (non-blocking):", roleError.message);
          }
        }
        try {
          const customerName = firstName ? `${firstName} ${lastName}`.trim() : null;
          const submissionDate = submitted_at ? new Date(submitted_at) : /* @__PURE__ */ new Date();
          let contact = await storage.getContactByEmail(customerEmail);
          if (!contact) {
            contact = await storage.createContact({
              email: customerEmail,
              name: customerName || void 0,
              consentGiven: "true",
              consentText: "Satellite Scan completion via Typeform",
              source: "quiz",
              // Using quiz as source type for scans
              channelsReached: ["Quiz"]
            });
            console.log("\u2705 New contact created for scan submitter:", customerEmail);
          }
          await storage.addChannelToContact(customerEmail, "Quiz");
          await storage.updateScanSubmittedAt(customerEmail, submissionDate);
          console.log("\u2705 Scan submission date recorded:", submissionDate.toISOString());
          contact = await storage.getContactByEmail(customerEmail);
          if (contact) {
            await syncContactWithNotion(contact.id);
            console.log("\u2705 Contact synced to Notion CRM:", customerEmail);
          }
        } catch (notionError) {
          console.error("\u26A0\uFE0F Notion sync error (non-blocking):", notionError.message);
        }
      } else {
        console.warn("\u26A0\uFE0F Skipping customer email - no email address available");
        console.log("\u{1F4CB} Manual follow-up required for:", firstName, lastName);
      }
      res.json({ received: true, message: "Typeform webhook processed" });
    } catch (error) {
      console.error("Typeform webhook error:", error);
      res.json({ received: true, error: error.message });
    }
  });
  app2.post("/api/email/send-verification", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ message: "Valid email address is required" });
      }
      const code = Math.floor(1e5 + Math.random() * 9e5).toString();
      await storage.createEmailVerification(email, code);
      const sent = await sendVerificationEmail({ email, code });
      if (sent) {
        res.json({
          message: "Verification code sent to your email",
          expiresIn: 600
          // 10 minutes in seconds
        });
      } else {
        res.status(500).json({ message: "Failed to send verification email. Please try again." });
      }
    } catch (error) {
      console.error("Email verification send error:", error);
      res.status(500).json({ message: "Failed to send verification code" });
    }
  });
  app2.post("/api/email/verify", async (req, res) => {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({ message: "Email and code are required" });
      }
      const verification = await storage.getEmailVerification(email, code);
      if (!verification) {
        return res.status(400).json({ message: "Invalid or expired verification code" });
      }
      await storage.markEmailVerified(email);
      res.json({
        message: "Email verified successfully",
        verified: true
      });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ message: "Verification failed. Please try again." });
    }
  });
  app2.post("/api/recommendations", async (req, res) => {
    try {
      const validationResult = insertRecommendationSubmissionSchema.safeParse(req.body);
      if (!validationResult.success) {
        const validationError = fromError(validationResult.error);
        return res.status(400).json({
          message: validationError.message
        });
      }
      const submission = await storage.createRecommendationSubmission(validationResult.data);
      res.status(201).json({
        message: "We're honored to guide your journey. You'll hear from us within 24 hours.",
        submission: {
          id: submission.id,
          recommendedPath: submission.recommendedPath
        }
      });
    } catch (error) {
      console.error("Recommendation submission error:", error);
      res.status(500).json({
        message: "We encountered an issue saving your information. Please try again."
      });
    }
  });
  app2.post("/api/waitlist", async (req, res) => {
    try {
      const { email, name, motivation, retreatType, consentText } = req.body;
      const contactValidation = insertContactSchema.safeParse({
        email,
        name,
        consentGiven: "true",
        consentText,
        source: "waitlist"
      });
      if (!contactValidation.success) {
        const validationError = fromError(contactValidation.error);
        return res.status(400).json({ message: validationError.message });
      }
      let contact = await storage.getContactByEmail(email);
      let isNewContact = false;
      if (!contact) {
        contact = await storage.createContact(contactValidation.data);
        isNewContact = true;
      }
      await storage.addChannelToContact(email, "Waitlist");
      syncContactWithNotion(contact.id).catch(
        (err) => console.log("Notion sync deferred:", err.message)
      );
      const entryValidation = insertWaitlistEntrySchema.safeParse({
        contactId: contact.id,
        motivation,
        retreatType
      });
      if (!entryValidation.success) {
        const validationError = fromError(entryValidation.error);
        return res.status(400).json({ message: validationError.message });
      }
      const entry = await storage.createWaitlistEntry(entryValidation.data);
      sendWaitlistConfirmationEmail({
        email,
        name: name || null,
        retreatType: retreatType || "",
        motivation: motivation || ""
      }).catch((err) => console.log("Waitlist confirmation email failed:", err.message));
      res.status(201).json({
        message: "You're on the list! We'll reach out when spots open up.",
        entry: { id: entry.id }
      });
    } catch (error) {
      console.error("Waitlist submission error:", error);
      res.status(500).json({
        message: "We encountered an issue. Please try again."
      });
    }
  });
  app2.post("/api/contacts", async (req, res) => {
    try {
      const { name, email, message, intent } = req.body;
      const validation = insertContactMessageSchema.safeParse({
        name,
        email,
        message,
        intent
      });
      if (!validation.success) {
        const validationError = fromError(validation.error);
        return res.status(400).json({ message: validationError.message });
      }
      const contactMessage = await storage.createContactMessage(validation.data);
      sendContactFormEmails({
        name,
        email,
        message,
        intent: intent || "general"
      }).catch((err) => console.log("Contact form email failed:", err.message));
      res.status(201).json({
        message: "We're grateful for your message. We'll respond with care and attention within 24 hours.",
        contactMessage: { id: contactMessage.id }
      });
    } catch (error) {
      console.error("Contact form submission error:", error);
      res.status(500).json({
        message: "We encountered an issue. Please try again."
      });
    }
  });
  app2.post("/api/newsletter", async (req, res) => {
    try {
      const { email, name, consentText } = req.body;
      const contactValidation = insertContactSchema.safeParse({
        email,
        name,
        consentGiven: "true",
        consentText,
        source: "newsletter"
      });
      if (!contactValidation.success) {
        const validationError = fromError(contactValidation.error);
        return res.status(400).json({ message: validationError.message });
      }
      let contact = await storage.getContactByEmail(email);
      let isNewContact = false;
      if (!contact) {
        contact = await storage.createContact(contactValidation.data);
        isNewContact = true;
      }
      await storage.addChannelToContact(email, "Newsletter");
      syncContactWithNotion(contact.id).catch(
        (err) => console.log("Notion sync deferred:", err.message)
      );
      const subscription = await storage.createNewsletterSubscription({
        contactId: contact.id
      });
      if (contactValidation.data.consentGiven === "true") {
        sendNewsletterConfirmationEmail({
          email,
          name: name || null
        }).catch((err) => console.log("Newsletter confirmation email failed:", err.message));
      }
      res.status(201).json({
        message: "Welcome to the community!",
        subscription: { id: subscription.id }
      });
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      res.status(500).json({
        message: "We encountered an issue. Please try again."
      });
    }
  });
  app2.post("/api/scan-interest", async (req, res) => {
    try {
      const { email, name, consentText } = req.body;
      const contactValidation = insertContactSchema.safeParse({
        email,
        name,
        consentGiven: "true",
        consentText,
        source: "scan_interest"
      });
      if (!contactValidation.success) {
        const validationError = fromError(contactValidation.error);
        return res.status(400).json({ message: validationError.message });
      }
      let contact = await storage.getContactByEmail(email);
      let isNewContact = false;
      if (!contact) {
        contact = await storage.createContact(contactValidation.data);
        isNewContact = true;
      }
      await storage.addChannelToContact(email, "Scan Interest");
      syncContactWithNotion(contact.id).catch(
        (err) => console.log("Notion sync deferred:", err.message)
      );
      const subscription = await storage.createNewsletterSubscription({
        contactId: contact.id
      });
      if (contactValidation.data.consentGiven === "true") {
        sendScanInterestConfirmationEmail({
          email,
          name: name || null
        }).catch((err) => console.log("Scan interest confirmation email failed:", err.message));
      }
      sendScanInterestAdminNotification({
        email,
        name: name || null
      }).catch((err) => console.log("Scan interest admin notification failed:", err.message));
      res.status(201).json({
        message: "Check your inbox for your free prompts!",
        subscription: { id: subscription.id }
      });
    } catch (error) {
      console.error("Scan interest subscription error:", error);
      res.status(500).json({
        message: "We encountered an issue. Please try again."
      });
    }
  });
  app2.post("/api/flow-check", async (req, res) => {
    try {
      const { email, name, consentText, situation, customSituation, role, motivation, challenge, competence } = req.body;
      const m = Math.min(10, Math.max(0, Math.round(Number(motivation))));
      const ch = Math.min(10, Math.max(0, Math.round(Number(challenge))));
      const co = Math.min(10, Math.max(0, Math.round(Number(competence))));
      if (isNaN(m) || isNaN(ch) || isNaN(co)) {
        return res.status(400).json({ message: "motivation, challenge, and competence must be numbers between 0-10" });
      }
      const effCh = Math.min(10, Math.max(0, ch + (m - 5) * 0.8));
      let zone;
      if (effCh >= 5 && co >= 5) {
        zone = "flow";
      } else if (effCh >= 5 && co < 5) {
        zone = "challenge";
      } else if (effCh < 5 && co >= 5) {
        zone = "comfort";
      } else {
        zone = "danger";
      }
      const displaySituation = situation === "other" && customSituation ? customSituation : situation;
      const resultValidation = insertFlowCheckResultSchema.safeParse({
        situation: displaySituation,
        customSituation: customSituation || null,
        role,
        motivation: m,
        challenge: ch,
        competence: co,
        zone,
        contactId: null
      });
      if (!resultValidation.success) {
        const validationError = fromError(resultValidation.error);
        return res.status(400).json({ message: validationError.message });
      }
      const result = await storage.createFlowCheckResult(resultValidation.data);
      if (email && consentText) {
        const contactValidation = insertContactSchema.safeParse({
          email,
          name,
          consentGiven: "true",
          consentText,
          source: "flow_check"
        });
        if (contactValidation.success) {
          let contact = await storage.getContactByEmail(email);
          if (!contact) {
            contact = await storage.createContact(contactValidation.data);
          }
          await storage.addChannelToContact(email, "Flow Check");
          syncContactWithNotion(contact.id).catch(
            (err) => console.log("Notion sync deferred:", err.message)
          );
          sendFlowCheckResultEmail({
            email,
            name: name || null,
            zone,
            situation: displaySituation,
            role,
            motivation: m,
            challenge: ch,
            competence: co
          }).catch((err) => console.log("Flow check result email failed:", err.message));
          sendFlowCheckAdminNotification({
            email,
            name: name || null,
            zone,
            situation: displaySituation,
            role,
            motivation: m,
            challenge: ch,
            competence: co
          }).catch((err) => console.log("Flow check admin notification failed:", err.message));
        }
      }
      const zoneLabels = {
        flow: "Flow Zone",
        challenge: "Challenge / Stress Zone",
        comfort: "Comfort Zone",
        danger: "Danger / Apathy Zone"
      };
      res.status(201).json({
        zone,
        zoneLabel: zoneLabels[zone],
        motivation: m,
        challenge: ch,
        competence: co,
        situation: displaySituation,
        role,
        resultId: result.id
      });
    } catch (error) {
      console.error("Flow check submission error:", error);
      res.status(500).json({
        message: "We encountered an issue processing your flow check. Please try again."
      });
    }
  });
  app2.get("/api/services", (_req, res) => {
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.json({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "GreenElephant Services",
      "description": "Conscious communication coaching, assessments, and retreats by GreenElephant.",
      "url": "https://greenelephant.org",
      "itemListElement": [
        {
          "@type": "Service",
          "position": 1,
          "name": "Satellite Scan \u2014 Communication Diagnostic",
          "description": "AI-powered assessment mapping your communication patterns across 8 lenses (Influence, Attitude, Chaordic, Flow, Alignment, Needs, Ego, Dynamics). 129 questions. Delivered as a visual dashboard. Used as the baseline for all coaching.",
          "url": "https://greenelephant.org/scan",
          "serviceType": "Communication Assessment",
          "audience": "Executive Assistants, Founders, Team Leaders, Virtual Assistants",
          "offers": { "@type": "Offer", "price": "99.95", "priceCurrency": "EUR", "availability": "https://schema.org/InStock" },
          "format": "Online self-assessment + PDF report",
          "duration": "Approximately 45 minutes"
        },
        {
          "@type": "Service",
          "position": 2,
          "name": "Check-my-FLOW \u2014 Free Flow Assessment",
          "description": "Free 5-minute assessment based on Csikszentmihalyi's 1988 flow model. Measures perceived Motivation, Challenge, and Competence in a specific communication situation. Maps you to one of 4 zones: Flow, Challenge/Stress, Comfort, or Danger/Apathy.",
          "url": "https://greenelephant.org/flow-check",
          "serviceType": "Communication Assessment",
          "audience": "Anyone navigating a challenging communication context",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR", "availability": "https://schema.org/InStock" },
          "format": "Online multi-step form with instant results",
          "duration": "Approximately 5 minutes"
        },
        {
          "@type": "Service",
          "position": 3,
          "name": "Coaching Journey",
          "description": "Comprehensive communication coaching program. Includes Satellite Scan as baseline, biweekly 120-minute sessions, unlimited check-in calls, and ongoing messaging support. Continues until your personalised SMART communication goal is reached.",
          "url": "https://greenelephant.org/coaching",
          "serviceType": "Executive Communication Coaching",
          "audience": "Leaders, Executives, Founders seeking deep behavioural change",
          "offers": { "@type": "Offer", "price": "2980", "priceCurrency": "EUR", "availability": "https://schema.org/InStock" },
          "format": "Video call sessions (remote)",
          "duration": "Approximately 6 months"
        },
        {
          "@type": "Service",
          "position": 4,
          "name": "Single Coaching Session",
          "description": "One-off 120-minute deep-dive into your communication patterns. Uses Satellite Scan results to identify triggers, blind spots, and strengths. Co-creates micro-habits for your specific context.",
          "url": "https://greenelephant.org/coaching",
          "serviceType": "Executive Communication Coaching",
          "audience": "Individuals wanting targeted support for a specific communication challenge",
          "offers": { "@type": "Offer", "price": "295", "priceCurrency": "EUR", "availability": "https://schema.org/InStock" },
          "format": "Video call (remote)",
          "duration": "120 minutes"
        },
        {
          "@type": "Service",
          "position": 5,
          "name": "Team Communication Workshop",
          "description": "Interactive half-day or full-day workshop using the Periodic Table of Conscious Communication. Builds shared language, reduces conflict, and installs communication micro-habits across a team.",
          "url": "https://greenelephant.org/coaching",
          "serviceType": "Team Workshop",
          "audience": "Teams of 6\u201330, HR managers, People & Culture leaders",
          "offers": { "@type": "Offer", "price": "1200", "priceCurrency": "EUR", "availability": "https://schema.org/InStock" },
          "format": "In-person or virtual",
          "duration": "Half-day or full-day"
        },
        {
          "@type": "Service",
          "position": 6,
          "name": "Conscious Communication Retreat \u2014 Finland",
          "description": "Multi-day immersive retreat in the Finnish archipelago combining conscious communication practice with nature, movement, and stillness. Limited cohorts. Apply to join the waitlist.",
          "url": "https://greenelephant.org/retreats",
          "serviceType": "Immersive Retreat",
          "audience": "Leaders, coaches, and professionals seeking deep reflection and renewal",
          "offers": { "@type": "Offer", "price": "2800", "priceCurrency": "EUR", "availability": "https://schema.org/LimitedAvailability" },
          "format": "In-person, Finland",
          "duration": "4\u20135 days"
        }
      ]
    });
  });
  app2.get("/api/coaches", (_req, res) => {
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.json({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "GreenElephant Coaches",
      "itemListElement": [
        {
          "@type": "Person",
          "position": 1,
          "name": "Esteve Camprub\xED",
          "jobTitle": "Founder & Lead Communication Coach",
          "description": "Communication strategist and coach. Creator of the Periodic Table of Conscious Communication and the Satellite Scan diagnostic. Works with Executive Assistants, TEAL founders, and innovation leaders across Europe.",
          "url": "https://greenelephant.org/team",
          "email": "esteve@greenelephant.org",
          "knowsAbout": ["Conscious Communication", "Executive Coaching", "Behavioural Change", "TEAL Organisations", "Flow Theory", "Micro-habits"],
          "worksFor": { "@type": "Organization", "name": "GreenElephant", "url": "https://greenelephant.org" },
          "availableLanguage": ["English", "Spanish", "Catalan", "French"]
        },
        {
          "@type": "Person",
          "position": 2,
          "name": "Anu Moisio",
          "jobTitle": "Retreat Host & Movement Coach",
          "description": "Yoga teacher and movement specialist. Co-hosts the GreenElephant retreats in Finland. Integrates somatic practice and conscious presence into communication coaching.",
          "url": "https://greenelephant.org/team",
          "knowsAbout": ["Yoga", "Somatic Practice", "Retreat Facilitation", "Conscious Movement", "Mindfulness"],
          "worksFor": { "@type": "Organization", "name": "GreenElephant", "url": "https://greenelephant.org" },
          "availableLanguage": ["English", "Finnish"]
        }
      ]
    });
  });
  app2.get("/api/admin/flow-checks", requireAdminAuth, async (req, res) => {
    try {
      const results = await storage.getAllFlowCheckResults();
      res.json(results);
    } catch (error) {
      console.error("Error fetching flow check results:", error);
      res.status(500).json({ message: "Failed to load flow check results" });
    }
  });
  app2.post("/api/webinar-waitlist", async (req, res) => {
    try {
      const { email, name, consentText, preferredLens, interests } = req.body;
      const contactValidation = insertContactSchema.safeParse({
        email,
        name,
        consentGiven: "true",
        consentText,
        source: "webinar"
      });
      if (!contactValidation.success) {
        const validationError = fromError(contactValidation.error);
        return res.status(400).json({ message: validationError.message });
      }
      let contact = await storage.getContactByEmail(email);
      let isNewContact = false;
      if (!contact) {
        contact = await storage.createContact(contactValidation.data);
        isNewContact = true;
      }
      await storage.addChannelToContact(email, "Webinar");
      syncContactWithNotion(contact.id).catch(
        (err) => console.log("Notion sync deferred:", err.message)
      );
      const waitlistValidation = insertWebinarWaitlistEntrySchema.safeParse({
        contactId: contact.id,
        preferredLens,
        interests
      });
      if (!waitlistValidation.success) {
        const validationError = fromError(waitlistValidation.error);
        return res.status(400).json({ message: validationError.message });
      }
      const waitlistEntry = await storage.createWebinarWaitlistEntry(waitlistValidation.data);
      sendWebinarWaitlistConfirmation({
        customerEmail: email,
        customerName: name || null,
        preferredLens
      }).catch((err) => console.log("Webinar email notification failed:", err.message));
      res.status(201).json({
        message: "You're on the list! We'll notify you when our next Play Labs session is scheduled.",
        waitlistEntry: { id: waitlistEntry.id }
      });
    } catch (error) {
      console.error("Webinar waitlist error:", error);
      res.status(500).json({
        message: "We encountered an issue. Please try again."
      });
    }
  });
  app2.post("/api/signals-quiz", async (req, res) => {
    try {
      const { score, answers, email, name, consentText } = req.body;
      let contactId = null;
      if (email) {
        const contactValidation = insertContactSchema.safeParse({
          email,
          name,
          consentGiven: "true",
          consentText: consentText || "I consent to receive my quiz results",
          source: "quiz"
        });
        if (contactValidation.success) {
          let contact = await storage.getContactByEmail(email);
          let isNewContact = false;
          if (!contact) {
            contact = await storage.createContact(contactValidation.data);
            isNewContact = true;
          }
          contactId = contact.id;
          await storage.addChannelToContact(email, "Quiz");
          syncContactWithNotion(contact.id).catch(
            (err) => console.log("Notion sync deferred:", err.message)
          );
        }
      }
      const quizValidation = insertSignalsQuizResultSchema.safeParse({
        contactId,
        score,
        // Zod will coerce to number and validate bounds (0-100)
        answers
      });
      if (!quizValidation.success) {
        const validationError = fromError(quizValidation.error);
        return res.status(400).json({ message: validationError.message });
      }
      const result = await storage.createSignalsQuizResult(quizValidation.data);
      const averageScore = await storage.getQuizAverageScore();
      if (email && (consentText || contactId)) {
        sendQuizResultsEmail({
          email,
          name: name || null,
          score: parseInt(result.score),
          averageScore
        }).catch((err) => console.log("Quiz results email failed:", err.message));
      }
      res.status(201).json({
        message: "Quiz complete!",
        result: {
          id: result.id,
          score: parseInt(result.score),
          averageScore
        }
      });
    } catch (error) {
      console.error("Signals quiz submission error:", error);
      res.status(500).json({
        message: "We encountered an issue. Please try again."
      });
    }
  });
  app2.get("/api/signals-quiz/average", async (_req, res) => {
    try {
      const averageScore = await storage.getQuizAverageScore();
      res.json({ averageScore });
    } catch (error) {
      console.error("Quiz average fetch error:", error);
      res.status(500).json({
        message: "Could not fetch average score"
      });
    }
  });
  app2.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ message: "Password required" });
      }
      if (await verifyAdminPassword(password)) {
        const bootstrapEmail = "esteve@greenelephant.org";
        let adminUser = await storage.getAdminUserByEmail(bootstrapEmail);
        if (!adminUser) {
          adminUser = await storage.createAdminUser({
            email: bootstrapEmail,
            name: "Esteve",
            role: "super_admin",
            invitedBy: null,
            isActive: "true",
            avatarUrl: null,
            googleId: null
          });
        }
        if (adminUser.isActive !== "true") {
          return res.status(403).json({ message: "Account is disabled" });
        }
        req.session.isAdmin = true;
        req.session.adminUserId = adminUser.id;
        req.session.adminEmail = adminUser.email;
        req.session.adminRole = adminUser.role;
        await storage.updateAdminUser(adminUser.id, { lastLoginAt: /* @__PURE__ */ new Date() });
        const existingPortalUser = await storage.getClientUserByEmail(adminUser.email);
        if (!existingPortalUser) {
          await storage.createClientUser({
            email: adminUser.email,
            name: adminUser.name || adminUser.email.split("@")[0],
            googleId: null,
            avatarUrl: null
          });
        }
        const existingHash = await storage.getAdminSetting("admin_password_hash");
        if (!existingHash) {
          const hashed = await hashAdminPassword(password);
          await storage.setAdminSetting("admin_password_hash", hashed);
        }
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return res.status(500).json({ message: "Login failed" });
          }
          logAuditEvent(adminUser.email, "admin_login", "/admin/login", { method: "password" });
          res.json({ message: "Login successful" });
        });
      } else {
        res.status(401).json({ message: "Incorrect password" });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.post("/api/admin/change-password", requireAdminAuth, requireAdminRole("super_admin"), async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new password required" });
      }
      if (!await verifyAdminPassword(currentPassword)) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters" });
      }
      const hashed = await hashAdminPassword(newPassword);
      await storage.setAdminSetting("admin_password_hash", hashed);
      logAuditEvent(
        req.session?.adminEmail || "unknown",
        "change_admin_password",
        "admin_settings",
        {},
        req.ip
      );
      res.json({ message: "Password updated. Note: The ADMIN_PASSWORD environment variable should also be updated to match." });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });
  app2.get("/api/admin/auth/google", async (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(503).json({ message: "Google login is not configured" });
    }
    const { getBaseUrl: getBaseUrl2 } = await Promise.resolve().then(() => (init_portal_auth(), portal_auth_exports));
    const baseUrl = getBaseUrl2(req);
    if (baseUrl.includes(".replit.dev")) {
      console.log("Admin Google OAuth: dev domain detected, redirecting to admin login");
      return res.redirect("/admin?error=dev_google");
    }
    const { randomBytes: randomBytes3 } = await import("crypto");
    const state = randomBytes3(16).toString("hex");
    req.session.adminOAuthState = state;
    const redirectUri = `${baseUrl}/api/admin/auth/google/callback`;
    const scope = encodeURIComponent("openid email profile");
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=select_account&state=${state}`;
    console.log("Admin Google OAuth: redirecting to Google. Redirect URI:", redirectUri);
    req.session.save(() => {
      res.redirect(authUrl);
    });
  });
  app2.get("/api/admin/auth/google/callback", async (req, res) => {
    try {
      const { code, state, error: googleError } = req.query;
      if (googleError) {
        console.error("Admin Google OAuth returned error:", googleError, req.query);
        return res.redirect(`/admin/login?error=google_${googleError}`);
      }
      if (!code) {
        console.warn("Admin Google OAuth callback: no code received. Query:", req.query);
        return res.redirect("/admin/login?error=no_code");
      }
      if (state !== req.session.adminOAuthState) {
        console.warn("Admin Google OAuth state mismatch. Session state:", req.session?.adminOAuthState ? "present" : "missing", "Query state:", state ? "present" : "missing");
        return res.redirect("/admin/login?error=state_mismatch");
      }
      delete req.session.adminOAuthState;
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        return res.redirect("/admin/login?error=not_configured");
      }
      const { getBaseUrl: getBase } = await Promise.resolve().then(() => (init_portal_auth(), portal_auth_exports));
      const redirectUri = `${getBase(req)}/api/admin/auth/google/callback`;
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code"
        })
      });
      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        return res.redirect("/admin/login?error=token_failed");
      }
      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const googleUser = await userInfoRes.json();
      if (!googleUser.email) {
        return res.redirect("/admin/login?error=no_email");
      }
      const normalizedEmail = googleUser.email.toLowerCase();
      let adminUser = await storage.getAdminUserByGoogleId(googleUser.id);
      if (!adminUser) {
        adminUser = await storage.getAdminUserByEmail(normalizedEmail);
        if (adminUser) {
          adminUser = await storage.updateAdminUser(adminUser.id, {
            googleId: googleUser.id,
            avatarUrl: googleUser.picture || adminUser.avatarUrl,
            name: adminUser.name || googleUser.name,
            lastLoginAt: /* @__PURE__ */ new Date()
          }) || adminUser;
        }
      } else {
        await storage.updateAdminUser(adminUser.id, { lastLoginAt: /* @__PURE__ */ new Date() });
      }
      if (!adminUser || adminUser.isActive !== "true") {
        return res.redirect("/admin/login?error=not_authorized");
      }
      req.session.isAdmin = true;
      req.session.adminUserId = adminUser.id;
      req.session.adminEmail = adminUser.email;
      req.session.adminRole = adminUser.role;
      let clientUser = await storage.getClientUserByEmail(normalizedEmail);
      if (!clientUser) {
        clientUser = await storage.createClientUser({
          email: normalizedEmail,
          name: googleUser.name || adminUser.name,
          googleId: googleUser.id,
          avatarUrl: googleUser.picture
        });
      } else if (!clientUser.googleId) {
        await storage.updateClientUser(clientUser.id, {
          googleId: googleUser.id,
          avatarUrl: googleUser.picture || clientUser.avatarUrl,
          name: clientUser.name || googleUser.name
        });
      }
      req.session.save((err) => {
        if (err) {
          console.error("Session save error after admin Google auth:", err);
          return res.redirect("/admin/login?error=session_failed");
        }
        logAuditEvent(normalizedEmail, "admin_login", "/admin", { method: "google", role: adminUser.role });
        res.redirect("/admin/submissions");
      });
    } catch (error) {
      console.error("Admin Google OAuth error:", error);
      res.redirect("/admin/login?error=callback_failed");
    }
  });
  app2.get("/api/admin/auth/fathom", requireAdminAuth, async (req, res) => {
    const clientId = process.env.FATHOM_CLIENT_ID;
    if (!clientId) {
      return res.status(503).json({ message: "Fathom integration is not configured \u2014 set FATHOM_CLIENT_ID" });
    }
    const { randomBytes: randomBytes3 } = await import("crypto");
    const state = randomBytes3(16).toString("hex");
    req.session.fathomOAuthState = state;
    const { getBaseUrl: getBaseUrl2 } = await Promise.resolve().then(() => (init_portal_auth(), portal_auth_exports));
    const redirectUri = `${getBaseUrl2(req)}/api/admin/auth/fathom/callback`;
    const scope = "site:read";
    const authUrl = `https://app.usefathom.com/api/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}`;
    console.log("Fathom OAuth: redirecting to Fathom. Redirect URI:", redirectUri);
    req.session.save(() => {
      res.redirect(authUrl);
    });
  });
  app2.get("/api/admin/auth/fathom/callback", async (req, res) => {
    try {
      const { code, state, error: fathomError } = req.query;
      if (fathomError) {
        console.error("Fathom OAuth returned error:", fathomError, req.query);
        return res.redirect("/admin/integrations?fathom_error=auth_denied");
      }
      if (!code) {
        console.warn("Fathom OAuth callback: no code received. Query:", req.query);
        return res.redirect("/admin/integrations?fathom_error=no_code");
      }
      if (state !== req.session.fathomOAuthState) {
        console.warn("Fathom OAuth state mismatch.");
        return res.redirect("/admin/integrations?fathom_error=state_mismatch");
      }
      delete req.session.fathomOAuthState;
      const clientId = process.env.FATHOM_CLIENT_ID;
      const clientSecret = process.env.FATHOM_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        return res.redirect("/admin/integrations?fathom_error=not_configured");
      }
      const { getBaseUrl: getBase } = await Promise.resolve().then(() => (init_portal_auth(), portal_auth_exports));
      const redirectUri = `${getBase(req)}/api/admin/auth/fathom/callback`;
      const tokenRes = await fetch("https://app.usefathom.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code
        })
      });
      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        console.error("Fathom token exchange failed:", tokenData);
        return res.redirect("/admin/integrations?fathom_error=token_failed");
      }
      process.env.FATHOM_ACCESS_TOKEN = tokenData.access_token;
      await storage.upsertConnectorState("fathom", "true");
      await storage.createConnectorToggleLog({
        connectorName: "fathom",
        action: "enabled",
        previousEnabled: "false",
        newEnabled: "true",
        triggeredBy: "oauth",
        performedBy: req.session?.adminEmail || "admin"
      });
      console.log("Fathom OAuth: successfully connected");
      req.session.save(() => {
        res.redirect("/admin/integrations?fathom_connected=true");
      });
    } catch (error) {
      console.error("Fathom OAuth error:", error instanceof Error ? error.message : error);
      res.redirect("/admin/integrations?fathom_error=callback_failed");
    }
  });
  app2.get("/api/admin/fathom/sites", requireAdminAuth, async (_req, res) => {
    try {
      const token = process.env.FATHOM_ACCESS_TOKEN;
      if (!token) {
        return res.status(503).json({ message: "Fathom not connected \u2014 complete OAuth first" });
      }
      const response = await fetch("https://api.usefathom.com/v1/sites?limit=20", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        const text2 = await response.text();
        console.error("Fathom API error:", response.status, text2);
        return res.status(response.status).json({ message: "Fathom API error", detail: text2 });
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Fathom sites fetch error:", error instanceof Error ? error.message : error);
      res.status(500).json({ message: "Error fetching Fathom sites" });
    }
  });
  app2.get("/api/admin/fathom/current-visitors", requireAdminAuth, async (req, res) => {
    try {
      const token = process.env.FATHOM_ACCESS_TOKEN;
      if (!token) {
        return res.status(503).json({ message: "Fathom not connected" });
      }
      let siteId = req.query.site_id;
      if (!siteId) {
        const sitesRes = await fetch("https://api.usefathom.com/v1/sites?limit=1", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (sitesRes.ok) {
          const sitesData = await sitesRes.json();
          const sites = sitesData?.data || sitesData;
          if (Array.isArray(sites) && sites.length > 0) {
            siteId = sites[0].id;
          }
        }
        if (!siteId) {
          return res.status(400).json({ message: "No Fathom site found. Add a site_id query parameter or configure a site in Fathom." });
        }
      }
      const response = await fetch(`https://api.usefathom.com/v1/current_visitors?site_id=${siteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        const text2 = await response.text();
        return res.status(response.status).json({ message: "Fathom API error", detail: text2 });
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Fathom current visitors error:", error instanceof Error ? error.message : error);
      res.status(500).json({ message: "Error fetching current visitors" });
    }
  });
  app2.get("/api/admin/fathom/aggregations", requireAdminAuth, async (req, res) => {
    try {
      const token = process.env.FATHOM_ACCESS_TOKEN;
      if (!token) {
        return res.status(503).json({ message: "Fathom not connected" });
      }
      let siteId = req.query.site_id;
      if (!siteId) {
        const sitesRes = await fetch("https://api.usefathom.com/v1/sites?limit=1", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (sitesRes.ok) {
          const sitesData = await sitesRes.json();
          const sites = sitesData?.data || sitesData;
          if (Array.isArray(sites) && sites.length > 0) {
            siteId = sites[0].id;
          }
        }
        if (!siteId) {
          return res.status(400).json({ message: "No Fathom site found." });
        }
      }
      const now = /* @__PURE__ */ new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
      const dateFrom = sevenDaysAgo.toISOString().slice(0, 10) + " 00:00:00";
      const dateTo = now.toISOString().slice(0, 10) + " 23:59:59";
      const params = new URLSearchParams({
        entity: "pageview",
        entity_id: siteId,
        aggregates: "visits,uniques,pageviews,avg_duration,bounce_rate",
        date_from: dateFrom,
        date_to: dateTo,
        timezone: "Europe/Amsterdam"
      });
      const response = await fetch(`https://api.usefathom.com/v1/aggregations?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        const text2 = await response.text();
        console.error("Fathom aggregations error:", response.status, text2);
        return res.status(response.status).json({ message: "Fathom API error", detail: text2 });
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Fathom aggregations error:", error instanceof Error ? error.message : error);
      res.status(500).json({ message: "Error fetching Fathom aggregations" });
    }
  });
  app2.get("/api/admin/fathom/status", requireAdminAuth, async (_req, res) => {
    const hasClientId = !!process.env.FATHOM_CLIENT_ID;
    const hasClientSecret = !!process.env.FATHOM_CLIENT_SECRET;
    const hasAccessToken = !!process.env.FATHOM_ACCESS_TOKEN;
    res.json({
      configured: hasClientId && hasClientSecret,
      connected: hasAccessToken,
      clientIdPresent: hasClientId,
      clientSecretPresent: hasClientSecret,
      accessTokenPresent: hasAccessToken
    });
  });
  app2.get("/api/admin/calendly/me", requireAdminAuth, async (_req, res) => {
    try {
      const token = process.env.CALENDLY_API_TOKEN;
      if (!token) return res.status(503).json({ message: "Calendly not connected" });
      const response = await fetch("https://api.calendly.com/users/me", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
      if (!response.ok) {
        const text2 = await response.text();
        return res.status(response.status).json({ message: "Calendly API error", detail: text2 });
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Calendly me error:", error instanceof Error ? error.message : error);
      res.status(500).json({ message: "Error fetching Calendly user" });
    }
  });
  app2.get("/api/admin/calendly/event-types", requireAdminAuth, async (_req, res) => {
    try {
      const token = process.env.CALENDLY_API_TOKEN;
      if (!token) return res.status(503).json({ message: "Calendly not connected" });
      const meRes = await fetch("https://api.calendly.com/users/me", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
      if (!meRes.ok) return res.status(meRes.status).json({ message: "Calendly auth error" });
      const meData = await meRes.json();
      const userUri = meData.resource.uri;
      const response = await fetch(`https://api.calendly.com/event_types?user=${encodeURIComponent(userUri)}&active=true`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
      if (!response.ok) {
        const text2 = await response.text();
        return res.status(response.status).json({ message: "Calendly API error", detail: text2 });
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Calendly event types error:", error instanceof Error ? error.message : error);
      res.status(500).json({ message: "Error fetching Calendly event types" });
    }
  });
  app2.get("/api/admin/calendly/scheduled-events", requireAdminAuth, async (req, res) => {
    try {
      const token = process.env.CALENDLY_API_TOKEN;
      if (!token) return res.status(503).json({ message: "Calendly not connected" });
      const meRes = await fetch("https://api.calendly.com/users/me", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
      if (!meRes.ok) return res.status(meRes.status).json({ message: "Calendly auth error" });
      const meData = await meRes.json();
      const userUri = meData.resource.uri;
      const status = req.query.status || "active";
      const minTime = req.query.min_start_time || (/* @__PURE__ */ new Date()).toISOString();
      const count = req.query.count || "20";
      const url = `https://api.calendly.com/scheduled_events?user=${encodeURIComponent(userUri)}&status=${status}&min_start_time=${encodeURIComponent(minTime)}&count=${count}&sort=start_time:asc`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
      if (!response.ok) {
        const text2 = await response.text();
        return res.status(response.status).json({ message: "Calendly API error", detail: text2 });
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Calendly scheduled events error:", error instanceof Error ? error.message : error);
      res.status(500).json({ message: "Error fetching Calendly scheduled events" });
    }
  });
  app2.post("/api/admin/logout", async (req, res) => {
    const email = req.session?.adminEmail;
    if (req.session) {
      req.session.isAdmin = false;
      req.session.adminUserId = void 0;
      req.session.adminEmail = void 0;
      req.session.adminRole = void 0;
    }
    if (email) {
      logAuditEvent(email, "admin_logout", "/admin");
    }
    res.json({ message: "Logged out successfully" });
  });
  app2.get("/api/admin/check", async (req, res) => {
    const isAuthenticated = req.session && req.session.isAdmin === true;
    if (isAuthenticated && req.session?.adminUserId) {
      const adminUser = await storage.getAdminUserById(req.session.adminUserId);
      return res.json({
        isAuthenticated: true,
        user: adminUser ? {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          avatarUrl: adminUser.avatarUrl,
          role: adminUser.role
        } : null,
        role: req.session.adminRole
      });
    }
    res.json({ isAuthenticated: !!isAuthenticated, role: req.session?.adminRole || null });
  });
  app2.get("/api/admin/team", requireAdminAuth, requireAdminRole("super_admin"), async (_req, res) => {
    try {
      const users2 = await storage.getAllAdminUsers();
      res.json(users2.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        avatarUrl: u.avatarUrl,
        role: u.role,
        invitedBy: u.invitedBy,
        isActive: u.isActive,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt
      })));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });
  app2.post("/api/admin/team/invite", requireAdminAuth, requireAdminRole("super_admin"), async (req, res) => {
    try {
      const { email, role, name } = req.body;
      if (!email || !role) {
        return res.status(400).json({ message: "Email and role required" });
      }
      const validRoles = ["super_admin", "admin", "viewer"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role. Must be super_admin, admin, or viewer" });
      }
      const normalizedEmail = email.toLowerCase().trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return res.status(400).json({ message: "Invalid email address" });
      }
      if (!normalizedEmail.endsWith("@greenelephant.org")) {
        return res.status(400).json({ message: "Team members must use a @greenelephant.org email address" });
      }
      const existing = await storage.getAdminUserByEmail(normalizedEmail);
      if (existing) {
        return res.status(409).json({ message: "This user already has admin access" });
      }
      const adminUser = await storage.createAdminUser({
        email: normalizedEmail,
        name: name || null,
        role,
        invitedBy: req.session?.adminEmail || null,
        isActive: "true",
        avatarUrl: null,
        googleId: null
      });
      const existingPortalUser = await storage.getClientUserByEmail(normalizedEmail);
      if (!existingPortalUser) {
        await storage.createClientUser({
          email: normalizedEmail,
          name: name || normalizedEmail.split("@")[0],
          googleId: null,
          avatarUrl: null
        });
      }
      logAuditEvent(
        req.session?.adminEmail || "unknown",
        "invite_team_member",
        "admin_users",
        { invitedEmail: normalizedEmail, role },
        req.ip
      );
      res.json(adminUser);
    } catch (error) {
      console.error("Team invite error:", error);
      res.status(500).json({ message: "Failed to invite team member" });
    }
  });
  app2.patch("/api/admin/team/:id", requireAdminAuth, requireAdminRole("super_admin"), async (req, res) => {
    try {
      const { role, isActive } = req.body;
      const validRoles = ["super_admin", "admin", "viewer"];
      const validActiveValues = ["true", "false"];
      const updates = {};
      if (role) {
        if (!validRoles.includes(role)) {
          return res.status(400).json({ message: "Invalid role" });
        }
        updates.role = role;
      }
      if (isActive !== void 0) {
        if (!validActiveValues.includes(isActive)) {
          return res.status(400).json({ message: "isActive must be 'true' or 'false'" });
        }
        updates.isActive = isActive;
      }
      const updated = await storage.updateAdminUser(req.params.id, updates);
      if (!updated) {
        return res.status(404).json({ message: "User not found" });
      }
      logAuditEvent(
        req.session?.adminEmail || "unknown",
        "update_team_member",
        "admin_users",
        { targetUser: updated.email, changes: updates },
        req.ip
      );
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update team member" });
    }
  });
  app2.delete("/api/admin/team/:id", requireAdminAuth, requireAdminRole("super_admin"), async (req, res) => {
    try {
      const user = await storage.getAdminUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.role === "super_admin") {
        return res.status(403).json({ message: "Cannot remove a super admin" });
      }
      await storage.deleteAdminUser(req.params.id);
      logAuditEvent(
        req.session?.adminEmail || "unknown",
        "remove_team_member",
        "admin_users",
        { removedEmail: user.email },
        req.ip
      );
      res.json({ message: "Team member removed" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove team member" });
    }
  });
  app2.get("/api/admin/audit-logs", requireAdminAuth, requireAdminRole("super_admin"), async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;
      const filters = {};
      if (req.query.userEmail) filters.userEmail = req.query.userEmail;
      if (req.query.actionType) filters.actionType = req.query.actionType;
      const logs = await storage.getAuditLogs(limit, offset, filters);
      const total = await storage.getAuditLogCount(filters);
      res.json({ logs, total });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });
  app2.get("/api/admin/waitlist", requireAdminAuth, async (_req, res) => {
    try {
      const entries = await storage.getAllWaitlistEntries();
      res.json(entries);
    } catch (error) {
      console.error("Admin waitlist fetch error:", error);
      res.status(500).json({ message: "Could not fetch waitlist entries" });
    }
  });
  app2.get("/api/admin/newsletter", requireAdminAuth, async (_req, res) => {
    try {
      const subscriptions = await storage.getAllNewsletterSubscriptions();
      res.json(subscriptions);
    } catch (error) {
      console.error("Admin newsletter fetch error:", error);
      res.status(500).json({ message: "Could not fetch newsletter subscriptions" });
    }
  });
  app2.get("/api/admin/quiz", requireAdminAuth, async (_req, res) => {
    try {
      const results = await storage.getAllSignalsQuizResults();
      res.json(results);
    } catch (error) {
      console.error("Admin quiz fetch error:", error);
      res.status(500).json({ message: "Could not fetch quiz results" });
    }
  });
  app2.get("/api/admin/recommendations", requireAdminAuth, async (_req, res) => {
    try {
      const submissions = await storage.getAllRecommendationSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Admin recommendations fetch error:", error);
      res.status(500).json({ message: "Could not fetch recommendations" });
    }
  });
  app2.post("/api/satellitescan/create-payment-intent", async (req, res) => {
    console.log("\u{1F4E6} Satellite Scan payment intent request received");
    if (!stripe) {
      console.error("\u274C Stripe not configured");
      return res.status(503).json({
        message: "Payment processing is currently unavailable. Please contact support."
      });
    }
    if (!await isConnectorEnabled("stripe")) {
      return res.status(503).json({
        message: "Payment processing is currently disabled. Please contact support."
      });
    }
    try {
      const { customerEmail, customerName } = req.body;
      console.log("\u{1F4E7} Customer:", customerEmail, customerName);
      const SATELLITE_SCAN_PRICE = 99.95;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(SATELLITE_SCAN_PRICE * 100),
        // Convert to cents
        currency: "eur",
        metadata: {
          product: "satellitescan",
          customerEmail: customerEmail || "",
          customerName: customerName || ""
        },
        receipt_email: customerEmail || void 0
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Satellitescan payment intent error:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });
  app2.post("/api/subscription/create-payment-intent", async (req, res) => {
    console.log("\u{1F4E6} Portal subscription payment intent request received");
    if (!stripe) {
      return res.status(503).json({
        message: "Payment processing is currently unavailable. Please contact support."
      });
    }
    if (!await isConnectorEnabled("stripe")) {
      return res.status(503).json({
        message: "Payment processing is currently disabled. Please contact support."
      });
    }
    try {
      const { customerEmail, customerName, couponCode } = req.body;
      const SUBSCRIPTION_PRICE = 9.95;
      let finalAmount = SUBSCRIPTION_PRICE;
      let appliedCoupon = null;
      let couponStatus = null;
      if (couponCode) {
        const coupon = await storage.getCouponByCode(couponCode);
        if (!coupon || coupon.isActive !== "true") {
          couponStatus = "invalid";
        } else {
          const withinUsageLimit = !coupon.maxUses || parseInt(coupon.usedCount) < parseInt(coupon.maxUses);
          if (!withinUsageLimit) {
            couponStatus = "exhausted";
          } else {
            const discount = parseFloat(coupon.discountAmount);
            finalAmount = Math.max(0, SUBSCRIPTION_PRICE - discount);
            appliedCoupon = couponCode;
            couponStatus = "applied";
          }
        }
      }
      if (finalAmount < 0.5) {
        return res.json({ clientSecret: null, freeAccess: true, amount: 0, couponStatus });
      }
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(finalAmount * 100),
        currency: "eur",
        metadata: {
          product: "portal_subscription",
          packageId: "portal_subscription",
          packageName: `Portal Subscription${appliedCoupon ? " (Coupon: " + appliedCoupon + ")" : ""}`,
          customerEmail: customerEmail || "",
          customerName: customerName || "",
          couponCode: appliedCoupon || ""
        },
        receipt_email: customerEmail || void 0
      });
      res.json({ clientSecret: paymentIntent.client_secret, amount: finalAmount, couponStatus });
    } catch (error) {
      console.error("Subscription payment intent error:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });
  app2.post("/api/subscription/free-purchase", async (req, res) => {
    try {
      const { customerEmail, customerName, couponCode } = req.body;
      if (!customerEmail || !couponCode) {
        return res.status(400).json({ success: false, message: "Email and coupon code are required" });
      }
      const coupon = await storage.getCouponByCode(couponCode);
      if (!coupon || coupon.isActive !== "true") {
        return res.status(400).json({ success: false, message: "Invalid or inactive coupon" });
      }
      if (coupon.maxUses && parseInt(coupon.usedCount) >= parseInt(coupon.maxUses)) {
        return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
      }
      const SUBSCRIPTION_PRICE = 9.95;
      const discountedAmount = Math.max(0, SUBSCRIPTION_PRICE - parseFloat(coupon.discountAmount));
      if (discountedAmount >= 0.5) {
        return res.status(400).json({ success: false, message: "Coupon does not cover full subscription price" });
      }
      await storage.incrementCouponUsage(coupon.id);
      const freePurchaseId = `FREE-SUB-${crypto.randomUUID()}`;
      let clientUser = await storage.getClientUserByEmail(customerEmail);
      if (!clientUser) {
        clientUser = await storage.createClientUser({
          email: customerEmail,
          name: customerName || null,
          passwordHash: null,
          googleId: null,
          linkedinSub: null,
          linkedinAccessToken: null,
          avatarUrl: null,
          notionAccessToken: null,
          notionWorkspaceId: null
        });
      }
      const existingSub = await storage.getClientSubscriptionByUserId(clientUser.id);
      if (!existingSub) {
        await storage.createClientSubscription({
          userId: clientUser.id,
          stripeCustomerId: null,
          stripeSubscriptionId: freePurchaseId,
          status: "active",
          plan: "portal_subscription",
          currentPeriodStart: /* @__PURE__ */ new Date(),
          currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3)
        });
      } else {
        await storage.updateClientSubscription(existingSub.id, {
          status: "active",
          stripeSubscriptionId: freePurchaseId,
          currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3)
        });
      }
      try {
        await markContactAsCustomer(customerEmail, {
          productName: "Portal Subscription (Free - " + couponCode + ")",
          amount: "0.00",
          customerName: customerName || void 0
        });
        await storage.addChannelToContact(customerEmail, "Purchase");
      } catch (err) {
        console.log("Notion sync for free subscription error:", err.message);
      }
      console.log(`\u2705 Free subscription activated for ${customerEmail} using coupon ${couponCode}`);
      res.json({ success: true, message: "Free subscription activated!", purchaseId: freePurchaseId });
    } catch (error) {
      console.error("Free subscription error:", error);
      res.status(500).json({ success: false, message: "Error processing free subscription: " + error.message });
    }
  });
  app2.post("/api/satellitescan/free-purchase", async (req, res) => {
    try {
      const { customerEmail, customerName, couponCode } = req.body;
      if (!customerEmail || !couponCode) {
        return res.status(400).json({
          success: false,
          message: "Email and coupon code are required"
        });
      }
      const coupon = await storage.getCouponByCode(couponCode);
      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: "Invalid coupon code"
        });
      }
      if (coupon.isActive !== "true") {
        return res.status(400).json({
          success: false,
          message: "Coupon is inactive"
        });
      }
      if (coupon.maxUses && parseInt(coupon.usedCount) >= parseInt(coupon.maxUses)) {
        return res.status(400).json({
          success: false,
          message: "Coupon usage limit reached"
        });
      }
      const SATELLITE_SCAN_PRICE = 99.95;
      if (parseFloat(coupon.discountAmount) < SATELLITE_SCAN_PRICE) {
        return res.status(400).json({
          success: false,
          message: "Coupon does not cover full purchase price"
        });
      }
      const freePurchaseId = `FREE-${crypto.randomUUID()}`;
      await storage.createSatellitescanPurchase({
        customerEmail,
        customerName: customerName || null,
        amount: "0.00",
        stripePaymentIntentId: freePurchaseId,
        status: "succeeded"
      });
      await storage.incrementCouponUsage(coupon.id);
      console.log("\u{1F4E7} Attempting to send free purchase email to:", customerEmail);
      try {
        const emailSent = await sendSatellitescanPurchaseEmail({
          customerEmail,
          customerName: customerName || "",
          amount: "0.00 (FREE - Coupon: " + couponCode + ")",
          paymentIntentId: freePurchaseId,
          purchaseId: freePurchaseId
        });
        if (emailSent) {
          console.log("\u2705 Free purchase notification emails sent successfully to:", customerEmail);
        } else {
          console.error("\u26A0\uFE0F Free purchase email function returned false - email may not have been sent to:", customerEmail);
        }
      } catch (emailError) {
        console.error("\u274C CRITICAL: Email notification failed for free purchase:", emailError?.message || emailError);
        console.error("\u274C Customer email was:", customerEmail);
      }
      console.log(`\u2705 Free Satellite Scan activated for ${customerEmail} using coupon ${couponCode}`);
      try {
        await markContactAsCustomer(customerEmail, {
          productName: "Satellite Scan (Free - " + couponCode + ")",
          amount: "0.00",
          customerName: customerName || void 0
        });
        await storage.addChannelToContact(customerEmail, "Purchase");
        console.log(`\u2713 Purchase channel added for: ${customerEmail}`);
      } catch (err) {
        console.log("Notion sync for free purchase error:", err.message);
      }
      res.json({
        success: true,
        message: "Free Satellite Scan activated!",
        purchaseId: freePurchaseId
      });
    } catch (error) {
      console.error("Free purchase error:", error);
      res.status(500).json({
        success: false,
        message: "Error processing free purchase: " + error.message
      });
    }
  });
  app2.post("/api/webhooks/stripe-satellitescan", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Stripe not configured" });
    }
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    try {
      let event;
      if (webhookSecret) {
        const signature = req.headers["stripe-signature"];
        if (!signature) {
          console.error("\u26A0\uFE0F Webhook signature missing");
          return res.status(400).json({ message: "Missing stripe-signature header" });
        }
        try {
          event = stripe.webhooks.constructEvent(
            req.rawBody,
            signature,
            webhookSecret
          );
          console.log("\u2705 Webhook signature verified (satellitescan)");
        } catch (err) {
          console.error("\u274C Webhook signature verification failed:", err.message);
          return res.status(400).json({ message: `Webhook signature verification failed: ${err.message}` });
        }
      } else {
        console.warn("\u26A0\uFE0F STRIPE_WEBHOOK_SECRET not set - signature verification disabled");
        event = req.body;
      }
      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const { product, customerName } = paymentIntent.metadata;
        const customerEmail = paymentIntent.metadata.customerEmail || paymentIntent.receipt_email || "";
        const amount = (paymentIntent.amount / 100).toString();
        console.log("\u{1F4E7} Satellitescan Payment Intent customer email sources:");
        console.log("  - metadata.customerEmail:", paymentIntent.metadata.customerEmail || "NOT SET");
        console.log("  - receipt_email:", paymentIntent.receipt_email || "NOT SET");
        console.log("  - Final customerEmail:", customerEmail || "EMPTY!");
        if (product === "satellitescan" && customerEmail) {
          const existingPurchase = await storage.getSatellitescanPurchaseByPaymentIntent(paymentIntent.id);
          if (!existingPurchase) {
            const purchase = await storage.createSatellitescanPurchase({
              customerEmail,
              customerName: customerName || void 0,
              amount,
              stripePaymentIntentId: paymentIntent.id,
              status: "succeeded"
            });
            console.log("\u{1F389} NEW SATELLITESCAN PURCHASE! \u{1F389}");
            console.log("\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501");
            console.log(`Customer: ${customerName || "Not provided"}`);
            console.log(`Email: ${customerEmail}`);
            console.log(`Amount: \u20AC${amount}`);
            console.log(`Payment ID: ${paymentIntent.id}`);
            console.log(`Purchase ID: ${purchase.id}`);
            console.log(`Time: ${(/* @__PURE__ */ new Date()).toISOString()}`);
            console.log("\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501");
            const emailSent = await sendSatellitescanPurchaseEmail({
              customerEmail,
              customerName: customerName || null,
              amount,
              paymentIntentId: paymentIntent.id,
              purchaseId: purchase.id
            });
            if (!emailSent) {
              console.log("\u26A0\uFE0F Email notification failed - manual follow-up required");
              console.log("\u{1F449} ACTION REQUIRED: Email customer at:", customerEmail);
              console.log("\u{1F449} Include Typeform link: https://greenelephantorg.typeform.com/individualscan");
            }
            try {
              await markContactAsCustomer(customerEmail, {
                productName: "Satellite Scan",
                amount,
                customerName: customerName || void 0
              });
              await storage.addChannelToContact(customerEmail, "Purchase");
              console.log(`\u2713 Purchase channel added for: ${customerEmail}`);
            } catch (err) {
              console.log("Notion sync for satellitescan error:", err.message);
            }
          } else {
            console.log("\u2139\uFE0F Duplicate webhook event received for satellitescan payment:", paymentIntent.id);
          }
        } else if (product === "satellitescan" && !customerEmail) {
          console.error("\u274C CRITICAL: Satellitescan payment received WITHOUT customer email!");
          console.error("\u274C Payment Intent ID:", paymentIntent.id);
          console.error("\u274C This purchase cannot be processed - manual intervention required");
        }
      }
      res.json({ received: true });
    } catch (error) {
      console.error("Satellitescan webhook error:", error);
      res.status(400).json({ message: error.message });
    }
  });
  app2.post("/api/webinar/replay-gate", async (req, res) => {
    try {
      const { name, email, consent } = req.body;
      if (!email || !consent) {
        return res.status(400).json({ message: "Email and consent are required" });
      }
      const normalizedEmail = email.toLowerCase().trim();
      const consentText = "Agreed to receive webinar replay link and occasional updates about upcoming Monthly Lens Webinars.";
      let contact = await storage.getContactByEmail(normalizedEmail);
      if (!contact) {
        contact = await storage.createContact({
          email: normalizedEmail,
          name: name?.trim() || void 0,
          consentGiven: "true",
          consentText,
          source: "webinar",
          channelsReached: ["Webinar"]
        });
      }
      await storage.addChannelToContact(normalizedEmail, "Webinar");
      try {
        const { pushContactToNotion: pushContactToNotion2 } = await Promise.resolve().then(() => (init_notionSync(), notionSync_exports));
        const freshContact = await storage.getContactByEmail(normalizedEmail);
        if (freshContact) {
          await pushContactToNotion2(freshContact);
        }
      } catch (notionErr) {
        console.error("\u26A0\uFE0F Notion sync error (webinar replay gate):", notionErr.message);
      }
      try {
        const { sendWebinarReplayConfirmationEmail: sendWebinarReplayConfirmationEmail2 } = await Promise.resolve().then(() => (init_email_notifications(), email_notifications_exports));
        await sendWebinarReplayConfirmationEmail2({ name: name?.trim() || "there", email: normalizedEmail });
      } catch (emailErr) {
        console.error("\u26A0\uFE0F Replay gate email error:", emailErr.message);
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Webinar replay gate error:", error);
      res.status(500).json({ message: "Could not process your request" });
    }
  });
  app2.get("/api/admin/scan-results", requireAdminAuth, async (_req, res) => {
    try {
      const purchases2 = await storage.getAllSatellitescanPurchases();
      res.json(purchases2);
    } catch (error) {
      console.error("Scan results fetch error:", error);
      res.status(500).json({ message: "Could not fetch scan results" });
    }
  });
  app2.get("/api/admin/saas-settings", requireAdminAuth, async (_req, res) => {
    try {
      const saasEnabled = await storage.getAdminSetting("saas_enabled");
      const subscriptionPrice = await storage.getAdminSetting("saas_subscription_price");
      const scanPrice = await storage.getAdminSetting("saas_scan_price");
      const journeyPrice = await storage.getAdminSetting("saas_journey_price");
      const subFeatures = await storage.getAdminSetting("saas_subscription_features");
      const scanFeatures = await storage.getAdminSetting("saas_scan_features");
      const journeyFeatures = await storage.getAdminSetting("saas_journey_features");
      const defaultSubFeatures = [
        "Unlimited Satellite Scans",
        "Prompting Playground",
        "Personal development data dashboard",
        "Calendar event & micro-habit suggestions",
        "Data export to Notion, Google Calendar",
        "Growth tracking over time"
      ];
      const defaultScanFeatures = [
        "1 Satellite Scan (129 questions)",
        "Personalized dashboard within 48-72h",
        "Access to public Prompt Library",
        "No portal access"
      ];
      const defaultJourneyFeatures = [
        "Everything in Subscription",
        "6 months 1:1 coaching sessions",
        "Lifetime portal access (no monthly fee)",
        "Priority dashboard delivery",
        "Direct coach communication channel"
      ];
      res.json({
        saasEnabled: saasEnabled === "true",
        subscriptionPriceMonthly: subscriptionPrice ? parseFloat(subscriptionPrice) : 9.95,
        scanOneTimePrice: scanPrice ? parseFloat(scanPrice) : 99.95,
        coachingJourneyPrice: journeyPrice ? parseFloat(journeyPrice) : 2980,
        subscriptionFeatures: subFeatures ? JSON.parse(subFeatures) : defaultSubFeatures,
        oneTimeScanFeatures: scanFeatures ? JSON.parse(scanFeatures) : defaultScanFeatures,
        coachingJourneyFeatures: journeyFeatures ? JSON.parse(journeyFeatures) : defaultJourneyFeatures
      });
    } catch (error) {
      res.json({
        saasEnabled: false,
        subscriptionPriceMonthly: 9.95,
        scanOneTimePrice: 99.95,
        coachingJourneyPrice: 2980,
        subscriptionFeatures: [],
        oneTimeScanFeatures: [],
        coachingJourneyFeatures: []
      });
    }
  });
  app2.post("/api/admin/saas-settings", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { saasEnabled, subscriptionPriceMonthly, scanOneTimePrice, coachingJourneyPrice, subscriptionFeatures, oneTimeScanFeatures, coachingJourneyFeatures } = req.body;
      await storage.setAdminSetting("saas_enabled", String(!!saasEnabled));
      if (subscriptionPriceMonthly !== void 0) {
        await storage.setAdminSetting("saas_subscription_price", String(subscriptionPriceMonthly));
      }
      if (scanOneTimePrice !== void 0) {
        await storage.setAdminSetting("saas_scan_price", String(scanOneTimePrice));
      }
      if (coachingJourneyPrice !== void 0) {
        await storage.setAdminSetting("saas_journey_price", String(coachingJourneyPrice));
      }
      if (subscriptionFeatures !== void 0) {
        await storage.setAdminSetting("saas_subscription_features", JSON.stringify(subscriptionFeatures));
      }
      if (oneTimeScanFeatures !== void 0) {
        await storage.setAdminSetting("saas_scan_features", JSON.stringify(oneTimeScanFeatures));
      }
      if (coachingJourneyFeatures !== void 0) {
        await storage.setAdminSetting("saas_journey_features", JSON.stringify(coachingJourneyFeatures));
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to save SaaS settings" });
    }
  });
  app2.get("/api/admin/ai-tools/settings", requireAdminAuth, async (_req, res) => {
    try {
      const settings = await storage.getAllAdminSettings();
      const aiSettings = settings.filter((s) => s.key.startsWith("ai_tools_"));
      res.json(aiSettings.map((s) => ({ key: s.key, value: s.value })));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI tools settings" });
    }
  });
  app2.post("/api/admin/ai-tools/settings", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { key, value } = req.body;
      if (!key || typeof key !== "string" || !key.startsWith("ai_tools_")) {
        return res.status(400).json({ message: "Key must start with ai_tools_" });
      }
      await storage.setAdminSetting(key, String(value));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to save AI tools setting" });
    }
  });
  app2.get("/api/admin/ai-tools/usage", requireAdminAuth, async (req, res) => {
    try {
      const range = req.query.range || "week";
      const usageByPeriod = {
        day: [
          { period: "00:00", tokens: 1200, requests: 3, cost: 0.024 },
          { period: "06:00", tokens: 450, requests: 1, cost: 9e-3 },
          { period: "12:00", tokens: 3800, requests: 8, cost: 0.076 },
          { period: "18:00", tokens: 2100, requests: 5, cost: 0.042 }
        ],
        week: [
          { period: "Mon", tokens: 8200, requests: 18, cost: 0.164 },
          { period: "Tue", tokens: 5400, requests: 12, cost: 0.108 },
          { period: "Wed", tokens: 12600, requests: 28, cost: 0.252 },
          { period: "Thu", tokens: 9100, requests: 20, cost: 0.182 },
          { period: "Fri", tokens: 7300, requests: 16, cost: 0.146 },
          { period: "Sat", tokens: 2100, requests: 5, cost: 0.042 },
          { period: "Sun", tokens: 1800, requests: 4, cost: 0.036 }
        ],
        month: [
          { period: "Week 1", tokens: 42e3, requests: 95, cost: 0.84 },
          { period: "Week 2", tokens: 38500, requests: 82, cost: 0.77 },
          { period: "Week 3", tokens: 51200, requests: 110, cost: 1.02 },
          { period: "Week 4", tokens: 46800, requests: 98, cost: 0.94 }
        ]
      };
      const byFeature = [
        { feature: "Prompt Generator", tokens: 12400, pct: 32 },
        { feature: "FlowCheck Analysis", tokens: 9800, pct: 25 },
        { feature: "Content Flywheel", tokens: 8600, pct: 22 },
        { feature: "Debrief Summary", tokens: 4200, pct: 11 },
        { feature: "Case Study Builder", tokens: 3900, pct: 10 }
      ];
      const byModel = [
        { model: "gpt-4o", tokens: 34200, pct: 88 },
        { model: "gpt-4o-mini", tokens: 3600, pct: 9 },
        { model: "gemini-1.5-pro", tokens: 1100, pct: 3 }
      ];
      res.json({
        timeline: usageByPeriod[range] || usageByPeriod.week,
        byFeature,
        byModel,
        runningTotal: 3.57,
        projectedMonthly: 8.92
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI usage data" });
    }
  });
  app2.get("/api/admin/ai-tools/activity", requireAdminAuth, async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const allActivity = [
        { id: "1", timestamp: new Date(Date.now() - 1e3 * 60 * 5).toISOString(), model: "gpt-4o", feature: "Prompt Generator", tokensUsed: 1820, status: "success", durationMs: 4200 },
        { id: "2", timestamp: new Date(Date.now() - 1e3 * 60 * 18).toISOString(), model: "gpt-4o", feature: "FlowCheck Analysis", tokensUsed: 2340, status: "success", durationMs: 5800 },
        { id: "3", timestamp: new Date(Date.now() - 1e3 * 60 * 45).toISOString(), model: "gpt-4o", feature: "Content Flywheel", tokensUsed: 3100, status: "success", durationMs: 7100 },
        { id: "4", timestamp: new Date(Date.now() - 1e3 * 60 * 90).toISOString(), model: "gpt-4o", feature: "Debrief Summary", tokensUsed: 1560, status: "error", durationMs: 12e3 },
        { id: "5", timestamp: new Date(Date.now() - 1e3 * 60 * 150).toISOString(), model: "gpt-4o", feature: "Prompt Generator", tokensUsed: 2080, status: "success", durationMs: 3900 },
        { id: "6", timestamp: new Date(Date.now() - 1e3 * 60 * 200).toISOString(), model: "gpt-4o", feature: "Case Study Builder", tokensUsed: 4200, status: "success", durationMs: 9500 },
        { id: "7", timestamp: new Date(Date.now() - 1e3 * 60 * 300).toISOString(), model: "gpt-4o-mini", feature: "FlowCheck Analysis", tokensUsed: 980, status: "success", durationMs: 2100 },
        { id: "8", timestamp: new Date(Date.now() - 1e3 * 60 * 420).toISOString(), model: "gpt-4o", feature: "Content Flywheel", tokensUsed: 2760, status: "success", durationMs: 6300 },
        { id: "9", timestamp: new Date(Date.now() - 1e3 * 60 * 500).toISOString(), model: "gpt-4o", feature: "Prompt Generator", tokensUsed: 1450, status: "success", durationMs: 3200 },
        { id: "10", timestamp: new Date(Date.now() - 1e3 * 60 * 600).toISOString(), model: "gpt-4o-mini", feature: "Debrief Summary", tokensUsed: 890, status: "success", durationMs: 1800 },
        { id: "11", timestamp: new Date(Date.now() - 1e3 * 60 * 720).toISOString(), model: "gpt-4o", feature: "Content Flywheel", tokensUsed: 3300, status: "error", durationMs: 15e3 },
        { id: "12", timestamp: new Date(Date.now() - 1e3 * 60 * 840).toISOString(), model: "gpt-4o", feature: "Case Study Builder", tokensUsed: 5100, status: "success", durationMs: 11200 }
      ];
      const start = (page - 1) * limit;
      const items = allActivity.slice(start, start + limit);
      res.json({
        items,
        total: allActivity.length,
        page,
        limit,
        totalPages: Math.ceil(allActivity.length / limit)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI activity log" });
    }
  });
  app2.get("/api/admin/analytics-status", requireAdminAuth, async (_req, res) => {
    const measurementId = process.env.VITE_GA_MEASUREMENT_ID || null;
    const ga4PropertyId = process.env.GA4_PROPERTY_ID || null;
    const serviceKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || null;
    res.json({
      clientTrackingConfigured: !!measurementId,
      serverApiConfigured: !!(ga4PropertyId && serviceKey),
      measurementId
    });
  });
  app2.get("/api/admin/funnel-metrics", requireAdminAuth, async (req, res) => {
    try {
      const window = req.query.window || "all";
      const now = /* @__PURE__ */ new Date();
      let windowStart = null;
      if (window === "7d") {
        windowStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
      } else if (window === "30d") {
        windowStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3);
      }
      const inWindow = (dateStr) => {
        if (!windowStart || !dateStr) return !windowStart;
        const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
        return d >= windowStart;
      };
      const [
        allContacts,
        allScanPurchases,
        allPurchases,
        allNewsletterSubs,
        allWebinarSignups,
        allFlowChecks,
        allQuizResults,
        allContactMessages,
        allWaitlist,
        allCoupons,
        allEmailLogs
      ] = await Promise.all([
        storage.getAllContacts(),
        storage.getAllSatellitescanPurchases(),
        storage.getAllPurchases(),
        storage.getAllNewsletterSubscriptions(),
        storage.getAllWebinarWaitlistEntries(),
        storage.getAllFlowCheckResults(),
        storage.getAllSignalsQuizResults(),
        storage.getAllContactMessages(),
        storage.getAllWaitlistEntries(),
        storage.getAllCoupons(),
        storage.getAllOnboardingEmailLogs()
      ]);
      const fContacts = allContacts.filter((c) => inWindow(c.createdAt));
      const fScanPurchases = allScanPurchases.filter((p) => inWindow(p.createdAt));
      const fPurchases = allPurchases.filter((p) => inWindow(p.createdAt));
      const fNewsletter = allNewsletterSubs.filter((s) => inWindow(s.createdAt));
      const fWebinar = allWebinarSignups.filter((w) => inWindow(w.createdAt));
      const fFlowChecks = allFlowChecks.filter((f) => inWindow(f.createdAt));
      const fQuiz = allQuizResults.filter((q) => inWindow(q.createdAt));
      const fMessages = allContactMessages.filter((m) => inWindow(m.createdAt));
      const fWaitlist = allWaitlist.filter((w) => inWindow(w.createdAt));
      const fEmailLogs = allEmailLogs.filter((l) => inWindow(l.createdAt));
      const totalRevenue = fScanPurchases.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0) + fPurchases.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
      const totalPurchaseCount = fScanPurchases.length + fPurchases.length;
      const avgOrderValue = totalPurchaseCount > 0 ? Math.round(totalRevenue / totalPurchaseCount * 100) / 100 : 0;
      const couponsUsed = allCoupons.reduce((sum, c) => sum + parseInt(c.usedCount || "0"), 0);
      const typeformCompleted = fScanPurchases.filter((p) => p.typeformCompleted === "true").length;
      const typeformRate = fScanPurchases.length > 0 ? Math.round(typeformCompleted / fScanPurchases.length * 100) : 0;
      const sentEmails = fEmailLogs.filter((l) => l.status === "sent").length;
      const reminderEmails = fScanPurchases.filter((p) => parseInt(p.remindersCount || "0") > 0).length;
      const notionSynced = allContacts.filter((c) => c.notionSyncedAt && inWindow(c.createdAt)).length;
      const notionSyncRate = fContacts.length > 0 ? Math.round(notionSynced / fContacts.length * 100) : 0;
      const multiFlowMap = /* @__PURE__ */ new Map();
      fFlowChecks.forEach((fc) => {
        const key = fc.contactId || fc.id;
        if (key) {
          multiFlowMap.set(key, (multiFlowMap.get(key) || 0) + 1);
        }
      });
      const repeatFlowUsers = Array.from(multiFlowMap.values()).filter((c) => c > 1).length;
      const contactsWith3PlusChannels = allContacts.filter((c) => {
        const channels = c.channelsReached || [];
        return channels.length >= 3 && inWindow(c.createdAt);
      }).length;
      const scanEmails = new Set(fScanPurchases.map((p) => p.customerEmail.toLowerCase()));
      const newsletterContactIds = new Set(fNewsletter.map((n) => n.contactId));
      const scanAndNewsletter = allContacts.filter((c) => {
        return scanEmails.has(c.email.toLowerCase()) && newsletterContactIds.has(c.id) && inWindow(c.createdAt);
      }).length;
      const referralMessages = fMessages.filter((m) => {
        const text2 = (m.message || "").toLowerCase();
        return text2.includes("recommend") || text2.includes("referred") || text2.includes("colleague");
      }).length;
      const ga4Enabled = await isConnectorEnabled("google-analytics");
      const ga4 = ga4Enabled && isGA4DataApiConfigured() ? await fetchGA4Metrics(window) : null;
      const ga4Connected = ga4Enabled && isGA4Configured();
      let typeformApiRate = null;
      let typeformApiResponses = null;
      const typeformEnabled = await isConnectorEnabled("typeform");
      if (typeformEnabled && process.env.TYPEFORM_PERSONAL_ACCESS_TOKEN && process.env.TYPEFORM_FORM_ID) {
        try {
          const { getTypeformFormStats: getTypeformFormStats2 } = await Promise.resolve().then(() => (init_typeformClient(), typeformClient_exports));
          const stats = await getTypeformFormStats2(process.env.TYPEFORM_FORM_ID);
          typeformApiRate = stats.completionRate;
          typeformApiResponses = stats.totalResponses;
        } catch (err) {
          console.warn("Typeform API enrichment failed (non-blocking):", err.message);
        }
      }
      const referralWaitlist = fWaitlist.filter((w) => {
        const text2 = (w.motivation || "").toLowerCase();
        return text2.includes("referral") || text2.includes("recommend") || text2.includes("colleague") || text2.includes("referred");
      }).length;
      const webinarContactIds = new Set(fWebinar.map((w) => w.contactId));
      const scanContactEmails = new Set(fScanPurchases.map((p) => p.customerEmail.toLowerCase()));
      const webinarScanOverlap = allContacts.filter((c) => {
        return webinarContactIds.has(c.id) && scanContactEmails.has(c.email.toLowerCase()) && inWindow(c.createdAt);
      }).length;
      let prevPeriodStart = null;
      let prevPeriodEnd = null;
      if (window === "7d") {
        prevPeriodEnd = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
        prevPeriodStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1e3);
      } else if (window === "30d") {
        prevPeriodEnd = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3);
        prevPeriodStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1e3);
      }
      const inPrevWindow = (dateStr) => {
        if (!prevPeriodStart || !prevPeriodEnd || !dateStr) return false;
        const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
        return d >= prevPeriodStart && d < prevPeriodEnd;
      };
      const pContacts = allContacts.filter((c) => inPrevWindow(c.createdAt));
      const pScanPurchases = allScanPurchases.filter((p) => inPrevWindow(p.createdAt));
      const pPurchases = allPurchases.filter((p) => inPrevWindow(p.createdAt));
      const pNewsletter = allNewsletterSubs.filter((s) => inPrevWindow(s.createdAt));
      const pWebinar = allWebinarSignups.filter((w) => inPrevWindow(w.createdAt));
      const pFlowChecks = allFlowChecks.filter((f) => inPrevWindow(f.createdAt));
      const pQuiz = allQuizResults.filter((q) => inPrevWindow(q.createdAt));
      const pMessages = allContactMessages.filter((m) => inPrevWindow(m.createdAt));
      const pWaitlist = allWaitlist.filter((w) => inPrevWindow(w.createdAt));
      const pEmailLogs = allEmailLogs.filter((l) => inPrevWindow(l.createdAt));
      const prevRevenue = pScanPurchases.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0) + pPurchases.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
      const prevPurchaseCount = pScanPurchases.length + pPurchases.length;
      const prevAvgOrderValue = prevPurchaseCount > 0 ? Math.round(prevRevenue / prevPurchaseCount * 100) / 100 : 0;
      const prevTypeformCompleted = pScanPurchases.filter((p) => p.typeformCompleted === "true").length;
      const prevTypeformRate = pScanPurchases.length > 0 ? Math.round(prevTypeformCompleted / pScanPurchases.length * 100) : 0;
      const prevSentEmails = pEmailLogs.filter((l) => l.status === "sent").length;
      const prevReminderEmails = pScanPurchases.filter((p) => parseInt(p.remindersCount || "0") > 0).length;
      const prevNotionSynced = allContacts.filter((c) => c.notionSyncedAt && inPrevWindow(c.createdAt)).length;
      const prevNotionSyncRate = pContacts.length > 0 ? Math.round(prevNotionSynced / pContacts.length * 100) : 0;
      const prevMultiFlowMap = /* @__PURE__ */ new Map();
      pFlowChecks.forEach((fc) => {
        const key = fc.contactId || fc.id;
        if (key) prevMultiFlowMap.set(key, (prevMultiFlowMap.get(key) || 0) + 1);
      });
      const prevRepeatFlowUsers = Array.from(prevMultiFlowMap.values()).filter((c) => c > 1).length;
      const prevContactsWith3PlusChannels = allContacts.filter((c) => {
        const channels = c.channelsReached || [];
        return channels.length >= 3 && inPrevWindow(c.createdAt);
      }).length;
      const prevScanEmails = new Set(pScanPurchases.map((p) => p.customerEmail.toLowerCase()));
      const prevNewsletterContactIds = new Set(pNewsletter.map((n) => n.contactId));
      const prevScanAndNewsletter = allContacts.filter((c) => {
        return prevScanEmails.has(c.email.toLowerCase()) && prevNewsletterContactIds.has(c.id) && inPrevWindow(c.createdAt);
      }).length;
      const prevReferralMessages = pMessages.filter((m) => {
        const text2 = (m.message || "").toLowerCase();
        return text2.includes("recommend") || text2.includes("referred") || text2.includes("colleague");
      }).length;
      const prevReferralWaitlist = pWaitlist.filter((w) => {
        const text2 = (w.motivation || "").toLowerCase();
        return text2.includes("referral") || text2.includes("recommend") || text2.includes("colleague") || text2.includes("referred");
      }).length;
      const prevWebinarContactIds = new Set(pWebinar.map((w) => w.contactId));
      const prevScanContactEmails = new Set(pScanPurchases.map((p) => p.customerEmail.toLowerCase()));
      const prevWebinarScanOverlap = allContacts.filter((c) => {
        return prevWebinarContactIds.has(c.id) && prevScanContactEmails.has(c.email.toLowerCase()) && inPrevWindow(c.createdAt);
      }).length;
      const hasPrev = prevPeriodStart !== null;
      const prevOrNull = (n) => hasPrev ? n : null;
      const funnel = {
        AWARENESS: {
          primary: { label: "Sessions", value: ga4.sessions, prev: null },
          secondary: [
            { label: "Unique Users", value: ga4.uniqueUsers, prev: null },
            { label: "Organic Users", value: ga4.organicUsers, prev: null },
            { label: "Top Traffic Sources", value: ga4.topTrafficSources, prev: null },
            { label: "Total Contacts (DB)", value: fContacts.length, prev: prevOrNull(pContacts.length) }
          ],
          source: ga4Connected ? "GA4 + DB" : "Database",
          ...!ga4Connected && { gaNote: "Connect GA4 Data API for sessions, users, organic traffic, and top sources" }
        },
        INTEREST: {
          primary: { label: "Quiz Completions", value: fQuiz.length, prev: prevOrNull(pQuiz.length) },
          secondary: [
            { label: "/scan Page Views", value: ga4.scanPageViews, prev: null },
            { label: "Coaching CTA Clicks", value: ga4.coachingCTAClicks, prev: null },
            { label: "Flow Checks", value: fFlowChecks.length, prev: prevOrNull(pFlowChecks.length) }
          ],
          source: ga4Connected ? "GA4 + DB" : "Database",
          ...!ga4Connected && { gaNote: "Connect GA4 for /scan page views and coaching CTA click tracking" }
        },
        ENGAGEMENT: {
          primary: { label: "Newsletter Signups", value: fNewsletter.length, prev: prevOrNull(pNewsletter.length) },
          secondary: [
            { label: "Webinar Signups", value: fWebinar.length, prev: prevOrNull(pWebinar.length) },
            { label: "Contact Messages", value: fMessages.length, prev: prevOrNull(pMessages.length) },
            { label: "Prompt Copies", value: ga4.promptCopyEvents, prev: null },
            { label: "Waitlist Entries", value: fWaitlist.length, prev: prevOrNull(pWaitlist.length) }
          ],
          source: ga4Connected ? "GA4 + DB" : "Database",
          ...!ga4Connected && { gaNote: "Connect GA4 for prompt copy event tracking" }
        },
        PURCHASE: {
          primary: { label: "Total Revenue", value: `\u20AC${totalRevenue.toFixed(2)}`, prev: prevOrNull(prevRevenue) },
          secondary: [
            { label: "Scan Purchases", value: fScanPurchases.length, prev: prevOrNull(pScanPurchases.length) },
            { label: "Other Purchases", value: fPurchases.length, prev: prevOrNull(pPurchases.length) },
            { label: "Avg Order Value", value: `\u20AC${avgOrderValue.toFixed(2)}`, prev: prevOrNull(prevAvgOrderValue) },
            { label: window === "all" ? "Coupons Used" : "Coupons Used (all-time)", value: couponsUsed }
          ],
          source: "Stripe + DB"
        },
        ONBOARDING: {
          primary: { label: "Typeform Rate", value: `${typeformApiRate !== null ? typeformApiRate : typeformRate}%`, prev: prevOrNull(prevTypeformRate) },
          secondary: [
            { label: "Typeform Completed", value: typeformCompleted, prev: prevOrNull(prevTypeformCompleted) },
            ...typeformApiResponses !== null ? [{ label: "Typeform API Responses", value: typeformApiResponses, prev: null }] : [],
            { label: "Onboarding Emails Sent", value: sentEmails, prev: prevOrNull(prevSentEmails) },
            { label: "Reminders Triggered", value: reminderEmails, prev: prevOrNull(prevReminderEmails) },
            { label: "Notion Sync Rate", value: `${notionSyncRate}%`, prev: prevOrNull(prevNotionSyncRate) }
          ],
          source: typeformEnabled && process.env.TYPEFORM_PERSONAL_ACCESS_TOKEN && process.env.TYPEFORM_FORM_ID ? "Database + Typeform API" : "Database"
        },
        USE: {
          primary: { label: "Repeat Flow Users", value: repeatFlowUsers, prev: prevOrNull(prevRepeatFlowUsers) },
          secondary: [
            { label: "Total Flow Checks", value: fFlowChecks.length, prev: prevOrNull(pFlowChecks.length) },
            { label: "Prompt Copies/Session", value: ga4.promptCopiesPerSession, prev: null },
            { label: "Return Visitor Rate", value: ga4.returnVisitorRate !== null ? `${ga4.returnVisitorRate}%` : null, prev: null }
          ],
          source: ga4Connected ? "GA4 + DB" : "Database",
          ...!ga4Connected && { gaNote: "Connect GA4 for return visitor rate, session frequency, and prompt copies per session" }
        },
        "USE MORE": {
          primary: { label: "3+ Channels", value: contactsWith3PlusChannels, prev: prevOrNull(prevContactsWith3PlusChannels) },
          secondary: [
            { label: "Scan + Newsletter", value: scanAndNewsletter, prev: prevOrNull(prevScanAndNewsletter) },
            { label: "Webinar + Scan", value: webinarScanOverlap, prev: prevOrNull(prevWebinarScanOverlap) }
          ],
          source: "Database"
        },
        ADVOCACY: {
          primary: { label: "Referral Mentions", value: referralMessages, prev: prevOrNull(prevReferralMessages) },
          secondary: [
            { label: "Referral-Sourced Waitlist", value: referralWaitlist, prev: prevOrNull(prevReferralWaitlist) },
            { label: "Direct Traffic Share", value: ga4.directTrafficShare !== null ? `${ga4.directTrafficShare}%` : null, prev: null }
          ],
          source: ga4Connected ? "GA4 + DB" : "Database",
          ...!ga4Connected && { gaNote: "Connect GA4 for direct traffic share and referral source tracking" }
        }
      };
      res.json({ window, funnel });
    } catch (error) {
      console.error("Funnel metrics error:", error);
      res.status(500).json({ message: "Could not compute funnel metrics" });
    }
  });
  app2.get("/api/admin/satellitescan", requireAdminAuth, async (_req, res) => {
    try {
      const purchases2 = await storage.getAllSatellitescanPurchases();
      res.json(purchases2);
    } catch (error) {
      console.error("Admin satellitescan fetch error:", error);
      res.status(500).json({ message: "Could not fetch satellitescan purchases" });
    }
  });
  app2.get("/api/admin/purchases", requireAdminAuth, async (_req, res) => {
    try {
      const purchases2 = await storage.getAllPurchases();
      res.json(purchases2);
    } catch (error) {
      console.error("Admin purchases fetch error:", error);
      res.status(500).json({ message: "Could not fetch purchases" });
    }
  });
  app2.post("/api/admin/satellitescan/send-reminders", requireAdminAuth, requireWriteAccess, async (_req, res) => {
    try {
      const hoursThreshold = 72;
      const overduePurchases = await storage.getOverdueSatellitescanPurchases(hoursThreshold);
      console.log(`\u{1F4E7} Checking for overdue satellitescan purchases (older than ${hoursThreshold}h)...`);
      console.log(`Found ${overduePurchases.length} purchases needing reminders (remindersCount=0)`);
      if (overduePurchases.length === 0) {
        return res.json({
          success: true,
          message: "No overdue purchases found",
          sent: 0,
          failed: 0
        });
      }
      const results = {
        sent: 0,
        failed: 0,
        details: []
      };
      for (const purchase of overduePurchases) {
        try {
          const currentCount = parseInt(purchase.remindersCount);
          await storage.updateSatellitescanReminderCount(purchase.id, currentCount + 1);
          const emailSent = await sendSatellitescanReminderEmail(
            purchase.customerEmail,
            purchase.customerName
          );
          if (emailSent) {
            results.sent++;
            results.details.push({ email: purchase.customerEmail, success: true });
            console.log(`\u2705 Reminder sent to: ${purchase.customerEmail}`);
          } else {
            results.failed++;
            results.details.push({ email: purchase.customerEmail, success: false, error: "Email send failed (count incremented to prevent retry)" });
            console.log(`\u26A0\uFE0F Email failed for ${purchase.customerEmail}, but count incremented to prevent future retries`);
          }
        } catch (error) {
          results.failed++;
          results.details.push({ email: purchase.customerEmail, success: false, error: error.message });
          console.error(`\u274C Failed to process reminder for ${purchase.customerEmail}:`, error);
        }
      }
      console.log(`\u{1F4CA} Reminder summary: ${results.sent} sent, ${results.failed} failed`);
      res.json({
        success: true,
        message: `Processed ${overduePurchases.length} overdue purchases`,
        sent: results.sent,
        failed: results.failed,
        details: results.details
      });
    } catch (error) {
      console.error("Send reminders error:", error);
      res.status(500).json({ message: "Could not send reminder emails", error: error.message });
    }
  });
  app2.post("/api/admin/satellitescan/:purchaseId/resend-emails", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { purchaseId } = req.params;
      const purchases2 = await storage.getAllSatellitescanPurchases();
      const purchase = purchases2.find((p) => p.id === purchaseId);
      if (!purchase) {
        return res.status(404).json({ success: false, message: "Purchase not found" });
      }
      console.log(`\u{1F4E7} Manual email resend triggered for: ${purchase.customerEmail}`);
      const emailSent = await sendSatellitescanPurchaseEmail({
        customerEmail: purchase.customerEmail,
        customerName: purchase.customerName || "Valued Customer",
        amount: purchase.amount,
        paymentIntentId: purchase.stripePaymentIntentId,
        purchaseId: purchase.id
      });
      if (emailSent) {
        console.log(`\u2705 Manual email resend successful: ${purchase.customerEmail}`);
        res.json({
          success: true,
          message: `Emails resent to ${purchase.customerEmail}`
        });
      } else {
        console.error(`\u274C Manual email resend failed: ${purchase.customerEmail}`);
        res.status(500).json({
          success: false,
          message: "Failed to send emails - check server logs"
        });
      }
    } catch (error) {
      console.error("Manual email resend error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
  app2.post("/api/admin/contacts/:email/sync-notion", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { email } = req.params;
      const contact = await storage.getContactByEmail(email);
      if (!contact) {
        return res.status(404).json({ success: false, message: "Contact not found" });
      }
      console.log(`\u{1F504} Manual Notion sync triggered for: ${email}`);
      const { pushContactToNotion: pushContactToNotion2 } = await Promise.resolve().then(() => (init_notionSync(), notionSync_exports));
      await pushContactToNotion2(contact);
      console.log(`\u2705 Notion sync successful: ${email}`);
      res.json({ success: true, message: `Contact synced to Notion: ${email}` });
    } catch (error) {
      console.error("Notion sync error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
  app2.get("/api/admin/contacts/:email/activity", requireAdminAuth, async (req, res) => {
    try {
      const { email } = req.params;
      const decodedEmail = decodeURIComponent(email);
      const contact = await storage.getContactByEmail(decodedEmail);
      if (!contact) {
        return res.status(404).json({ success: false, message: "Contact not found" });
      }
      const timeline = [];
      timeline.push({
        type: "newsletter",
        title: "Contact created",
        description: `Source: ${contact.source}`,
        timestamp: contact.createdAt?.toISOString() || (/* @__PURE__ */ new Date()).toISOString()
      });
      if (contact.scanSubmittedAt) {
        timeline.push({
          type: "scan_submitted",
          title: "Scan submitted via Typeform",
          description: "Completed Satellite Scan questionnaire",
          timestamp: contact.scanSubmittedAt.toISOString()
        });
      }
      if (contact.notionSyncedAt) {
        timeline.push({
          type: "notion_sync",
          title: "Synced to Notion CRM",
          timestamp: contact.notionSyncedAt.toISOString()
        });
      }
      const allQuizResults = await storage.getAllSignalsQuizResults();
      const contactQuizResults = allQuizResults.filter((q) => q.contactId === contact.id);
      contactQuizResults.forEach((quiz) => {
        timeline.push({
          type: "quiz",
          title: "Completed Signals Quiz",
          description: `Score: ${quiz.score}`,
          timestamp: quiz.createdAt?.toISOString() || (/* @__PURE__ */ new Date()).toISOString()
        });
      });
      const allWaitlist = await storage.getAllWaitlistEntries();
      const contactWaitlist = allWaitlist.filter((w) => w.contactId === contact.id);
      contactWaitlist.forEach((entry) => {
        timeline.push({
          type: "waitlist",
          title: "Joined waitlist",
          description: entry.retreatType ? `Retreat: ${entry.retreatType}` : entry.motivation,
          timestamp: entry.createdAt?.toISOString() || (/* @__PURE__ */ new Date()).toISOString()
        });
      });
      const allPurchases = await storage.getAllSatellitescanPurchases();
      const contactPurchases = allPurchases.filter(
        (p) => p.customerEmail.toLowerCase() === decodedEmail.toLowerCase()
      );
      contactPurchases.forEach((purchase) => {
        timeline.push({
          type: "purchase",
          title: "Satellite Scan purchase",
          description: `Amount: \u20AC${purchase.amount} | Status: ${purchase.status}`,
          timestamp: purchase.createdAt?.toISOString() || (/* @__PURE__ */ new Date()).toISOString()
        });
        if (purchase.typeformCompleted === "true" || purchase.typeformCompleted === "yes") {
          timeline.push({
            type: "scan_submitted",
            title: "Typeform questionnaire completed",
            timestamp: purchase.createdAt?.toISOString() || (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      });
      for (const purchase of contactPurchases) {
        const emailLogs = await storage.getOnboardingEmailLogsByCustomer(purchase.id);
        for (const log2 of emailLogs) {
          const template = await storage.getOnboardingEmailTemplateById(log2.templateId);
          timeline.push({
            type: "email",
            title: `Email: ${template?.subject || "Onboarding email"}`,
            description: `Status: ${log2.status}${log2.sentAt ? " | Sent" : ""}`,
            timestamp: log2.sentAt ? log2.sentAt.toISOString() : (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      }
      timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      res.json({
        contact: {
          ...contact,
          createdAt: contact.createdAt?.toISOString(),
          scanSubmittedAt: contact.scanSubmittedAt?.toISOString(),
          notionSyncedAt: contact.notionSyncedAt?.toISOString()
        },
        timeline
      });
    } catch (error) {
      console.error("Contact activity error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
  app2.post("/api/validate-coupon", async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ valid: false, message: "Coupon code required" });
      }
      const coupon = await storage.getCouponByCode(code);
      if (!coupon) {
        return res.status(400).json({ valid: false, message: "Coupon not found" });
      }
      if (coupon.isActive !== "true") {
        return res.status(400).json({ valid: false, message: "Coupon is inactive" });
      }
      if (coupon.maxUses && parseInt(coupon.usedCount) >= parseInt(coupon.maxUses)) {
        return res.status(400).json({ valid: false, message: "Coupon usage limit reached" });
      }
      res.json({
        valid: true,
        discountAmount: parseFloat(coupon.discountAmount),
        category: coupon.category,
        message: `${coupon.category} discount applied!`
      });
    } catch (error) {
      console.error("Coupon validation error:", error);
      res.status(500).json({ valid: false, message: "Error validating coupon" });
    }
  });
  app2.post("/api/admin/coupons", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { code, discountAmount, category, maxUses } = req.body;
      const coupon = await storage.createCoupon({
        code,
        discountAmount,
        category,
        isActive: "true",
        maxUses
      });
      res.status(201).json({ message: "Coupon created", coupon });
    } catch (error) {
      console.error("Create coupon error:", error);
      res.status(500).json({ message: "Error creating coupon", error: error.message });
    }
  });
  app2.get("/api/admin/coupons", requireAdminAuth, async (req, res) => {
    try {
      const coupons2 = await storage.getAllCoupons();
      res.json(coupons2);
    } catch (error) {
      console.error("Get coupons error:", error);
      res.status(500).json({ message: "Error fetching coupons" });
    }
  });
  app2.post("/api/admin/coupons/seed-test", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const testCoupons = [
        {
          code: "TESTSCAN100",
          discountAmount: "99.95",
          category: "startup",
          maxUses: "5",
          isActive: "true"
        },
        {
          code: "TESTINTERVIEW100",
          discountAmount: "845",
          category: "startup",
          maxUses: "5",
          isActive: "true"
        },
        {
          code: "TESTSINGLE100",
          discountAmount: "295",
          category: "startup",
          maxUses: "5",
          isActive: "true"
        },
        {
          code: "TESTJOURNEY100",
          discountAmount: "2980",
          category: "startup",
          maxUses: "5",
          isActive: "true"
        },
        {
          code: "TESTWORKSHOP100",
          discountAmount: "1200",
          category: "startup",
          maxUses: "5",
          isActive: "true"
        }
      ];
      const createdCoupons = [];
      const skippedCoupons = [];
      for (const couponData of testCoupons) {
        const existing = await storage.getCouponByCode(couponData.code);
        if (existing) {
          skippedCoupons.push(couponData.code);
          continue;
        }
        const coupon = await storage.createCoupon(couponData);
        createdCoupons.push(coupon);
      }
      res.status(201).json({
        message: `Created ${createdCoupons.length} test coupons, skipped ${skippedCoupons.length} existing`,
        created: createdCoupons.map((c) => c.code),
        skipped: skippedCoupons
      });
    } catch (error) {
      console.error("Seed test coupons error:", error);
      res.status(500).json({ message: "Error seeding test coupons", error: error.message });
    }
  });
  app2.put("/api/admin/coupons/:code", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { code } = req.params;
      const updates = req.body;
      const coupon = await storage.getCouponByCode(code);
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      const updatedCoupon = await storage.updateCoupon(code, updates);
      res.json({ message: "Coupon updated", coupon: updatedCoupon });
    } catch (error) {
      console.error("Update coupon error:", error);
      res.status(500).json({ message: "Error updating coupon", error: error.message });
    }
  });
  app2.delete("/api/admin/coupons/:code", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { code } = req.params;
      const coupon = await storage.getCouponByCode(code);
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      await storage.deleteCoupon(code);
      res.json({ message: "Coupon deleted" });
    } catch (error) {
      console.error("Delete coupon error:", error);
      res.status(500).json({ message: "Error deleting coupon", error: error.message });
    }
  });
  app2.get("/api/admin/pricing-mode", requireAdminAuth, async (_req, res) => {
    try {
      const mode = await storage.getAdminSetting("pricing_mode") || "single";
      res.json({ mode });
    } catch (error) {
      res.status(500).json({ message: "Error fetching pricing mode", error: error.message });
    }
  });
  app2.put("/api/admin/pricing-mode", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { mode } = req.body;
      if (!["single", "subscription"].includes(mode)) {
        return res.status(400).json({ message: "Invalid mode. Must be 'single' or 'subscription'." });
      }
      await storage.setAdminSetting("pricing_mode", mode);
      res.json({ mode });
    } catch (error) {
      res.status(500).json({ message: "Error updating pricing mode", error: error.message });
    }
  });
  app2.get("/api/pricing-mode", async (_req, res) => {
    try {
      const mode = await storage.getAdminSetting("pricing_mode") || "single";
      res.json({ mode });
    } catch (error) {
      res.status(500).json({ message: "Error fetching pricing mode" });
    }
  });
  app2.get("/api/dashboard/lens-data", async (req, res) => {
    try {
      const spreadsheetId = req.query.spreadsheetId;
      const range = req.query.range || "Sheet1!A1:Z100";
      if (!spreadsheetId) {
        return res.status(400).json({ message: "spreadsheetId is required" });
      }
      const data = await getSheetData(spreadsheetId, range);
      res.json({ data });
    } catch (error) {
      console.error("Dashboard lens data error:", error);
      res.status(500).json({ message: "Error fetching lens data", error: error.message });
    }
  });
  app2.post("/api/dashboard/generate-ui", async (req, res) => {
    try {
      const { prompt, data } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: "prompt is required" });
      }
      const uiContent = await generateDashboardUI(prompt, data);
      res.json({ content: uiContent });
    } catch (error) {
      console.error("Dashboard UI generation error:", error);
      res.status(500).json({ message: "Error generating dashboard UI", error: error.message });
    }
  });
  app2.post("/api/admin/generate-social-copy", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { generateSocialCopy: generateSocialCopy2 } = await Promise.resolve().then(() => (init_thesysApi(), thesysApi_exports));
      const copy = await generateSocialCopy2();
      res.json({ copy });
    } catch (error) {
      console.error("Social copy generation error:", error);
      res.status(500).json({ message: "Error generating social copy", error: error.message });
    }
  });
  app2.post("/api/admin/generate-content", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { generatorType, customPrompt, voice, calibration, callToAction, enrichmentText } = req.body;
      const validTypes = ["headlines", "ai-gap", "workplace", "case-study"];
      if (!generatorType || !validTypes.includes(generatorType)) {
        return res.status(400).json({ message: "generatorType must be one of: headlines, ai-gap, workplace, case-study" });
      }
      if (!customPrompt || typeof customPrompt !== "string" || customPrompt.trim().length === 0) {
        return res.status(400).json({ message: "customPrompt is required and must be a non-empty string" });
      }
      const voiceMode = voice === "I" ? "I" : "we";
      const calibrationLevel = ["low", "medium", "high"].includes(calibration) ? calibration : "medium";
      const aiPrefsRaw = await storage.getAdminSetting("ai_context_enabled_sources");
      const aiContextPrefs = aiPrefsRaw ? JSON.parse(aiPrefsRaw) : { "local-crm": true, "notion": true, "google-sheets": true, "stripe": true, "fathom": true, "typeform": true };
      const { getPipelineOSTasks: getPipelineOSTasks2 } = await Promise.resolve().then(() => (init_notionSync(), notionSync_exports));
      const { generateFlywheelContent: generateFlywheelContent2, generateSeoSuggestions: generateSeoSuggestions2, getCurrentLens: getCurrentLens2 } = await Promise.resolve().then(() => (init_thesysApi(), thesysApi_exports));
      let pipelineContext = "";
      if (aiContextPrefs["notion"] !== false) {
        try {
          pipelineContext = await getPipelineOSTasks2();
        } catch (e) {
          console.warn("Pipeline OS read failed (non-blocking):", e.message);
        }
      }
      let enhancedPrompt = customPrompt;
      if (voiceMode === "I") {
        enhancedPrompt += `

IMPORTANT: Write in first person singular ("I") as if Esteve or Anu is speaking personally. Use personal anecdotes and direct voice.`;
      } else {
        enhancedPrompt += `

IMPORTANT: Write in first person plural ("we") as the GreenElephant team voice. Use collective language.`;
      }
      if (calibrationLevel === "high") {
        enhancedPrompt += `

CALIBRATION: HIGH ACCURACY MODE \u2014 Include specific statistics with sources, exact quotes with attribution, and URLs to reliable sources (academic papers, reputable news outlets, or greenelephant.org internal pages). Favor shorter, precise snippets over long passages.`;
      } else if (calibrationLevel === "low") {
        enhancedPrompt += `

CALIBRATION: CREATIVE MODE \u2014 Prioritize storytelling and engagement over strict accuracy. Longer narrative passages are fine. URLs are optional.`;
      } else {
        enhancedPrompt += `

CALIBRATION: BALANCED MODE \u2014 Include key statistics and references where available, but prioritize readability. Include URLs to greenelephant.org pages where relevant.`;
      }
      if (callToAction && typeof callToAction === "string" && callToAction.trim()) {
        enhancedPrompt += `

CALL TO ACTION: End the article and poll with this CTA: "${callToAction.trim()}"`;
      }
      if (enrichmentText && typeof enrichmentText === "string" && enrichmentText.trim()) {
        enhancedPrompt += `

ADDITIONAL CONTEXT (from uploaded material):
${enrichmentText.trim().substring(0, 3e3)}`;
      }
      const content = await generateFlywheelContent2(generatorType, enhancedPrompt, pipelineContext);
      const lens = getCurrentLens2();
      let seo = { keywords: [], faqItems: [], internalLinks: [], targetPage: "/decode" };
      try {
        seo = await generateSeoSuggestions2(generatorType, content.article.substring(0, 2e3));
      } catch (e) {
        console.warn("SEO suggestions failed (non-blocking):", e.message);
      }
      res.json({
        ...content,
        seo,
        lens: { name: lens.name, hexColor: lens.hexColor, code: lens.code, description: lens.description },
        pipelineContext: pipelineContext ? "loaded" : "unavailable"
      });
    } catch (error) {
      console.error("Content flywheel generation error:", error);
      res.status(500).json({ message: "Error generating content", error: error.message });
    }
  });
  app2.post("/api/admin/send-content-review", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { sendContentFlywheelEmail: sendContentFlywheelEmail2 } = await Promise.resolve().then(() => (init_email_notifications(), email_notifications_exports));
      const { recipients, generatorType, lensName, lensColor, article, poll, artDirection, seoKeywords, seoFaqItems, seoInternalLinks } = req.body;
      if (!Array.isArray(recipients) || recipients.length === 0 || !article || typeof article !== "string") {
        return res.status(400).json({ message: "recipients (array) and article (string) are required" });
      }
      const validTypes = ["headlines", "ai-gap", "workplace", "case-study"];
      const safeType = validTypes.includes(generatorType) ? generatorType : "headlines";
      const sent = await sendContentFlywheelEmail2({
        recipients,
        generatorType: safeType,
        lensName: lensName || "Unknown",
        lensColor: lensColor || "#009999",
        article,
        poll: poll || "",
        artDirection: artDirection || "",
        seoKeywords: Array.isArray(seoKeywords) ? seoKeywords : [],
        seoFaqItems: Array.isArray(seoFaqItems) ? seoFaqItems : [],
        seoInternalLinks: Array.isArray(seoInternalLinks) ? seoInternalLinks : []
      });
      if (!sent) {
        return res.status(502).json({ message: "Email delivery failed \u2014 check Resend connector status", sent: false });
      }
      res.json({ sent: true });
    } catch (error) {
      console.error("Content review email error:", error);
      res.status(500).json({ message: "Error sending content review email", error: error.message });
    }
  });
  app2.get("/api/admin/seo-suggestions", requireAdminAuth, async (_req, res) => {
    try {
      const { seoSuggestions: seoSuggestions2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { desc: desc2 } = await import("drizzle-orm");
      const suggestions = await db.select().from(seoSuggestions2).orderBy(desc2(seoSuggestions2.createdAt)).limit(50);
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/admin/seo-suggestions", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { seoSuggestions: seoSuggestions2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { generatorType, targetPage, suggestionType, content } = req.body;
      const [inserted] = await db.insert(seoSuggestions2).values({
        generatorType,
        targetPage,
        suggestionType,
        content
      }).returning();
      res.json(inserted);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.patch("/api/admin/seo-suggestions/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { seoSuggestions: seoSuggestions2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { eq: eq3 } = await import("drizzle-orm");
      const { status } = req.body;
      const validStatuses = ["pending", "applied", "dismissed"];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ message: "status must be one of: pending, applied, dismissed" });
      }
      const [updated] = await db.update(seoSuggestions2).set({ status }).where(eq3(seoSuggestions2.id, req.params.id)).returning();
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/admin/current-lens", requireAdminAuth, async (_req, res) => {
    try {
      const { getCurrentLens: getCurrentLens2 } = await Promise.resolve().then(() => (init_thesysApi(), thesysApi_exports));
      const lens = getCurrentLens2();
      res.json(lens);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/admin/generate-element-prompt", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { generateElementPrompt: generateElementPrompt2 } = await Promise.resolve().then(() => (init_thesysApi(), thesysApi_exports));
      const validLenses = ["influence", "attitude", "chaordic", "flow", "alignment", "needs", "ego", "dynamics"];
      const validRoles = ["EA", "ACX", "TealLeaders", "all"];
      const elementCode = Number(req.body.elementCode);
      const elementName = String(req.body.elementName || "").trim();
      const elementLens = String(req.body.elementLens || "").trim();
      if (!elementCode || isNaN(elementCode) || !elementName || !elementLens) {
        return res.status(400).json({ message: "Valid elementCode (number), elementName, and elementLens are required" });
      }
      if (!validLenses.includes(elementLens)) {
        return res.status(400).json({ message: `elementLens must be one of: ${validLenses.join(", ")}` });
      }
      const roleCategory = validRoles.includes(req.body.roleCategory) ? req.body.roleCategory : "all";
      const customInstructions = String(req.body.customInstructions || "").trim().slice(0, 2e3);
      const result = await generateElementPrompt2(
        elementCode,
        elementName,
        String(req.body.elementSymbol || "").trim(),
        elementLens,
        String(req.body.elementCategory || "").trim(),
        String(req.body.elementDescription || "").trim(),
        String(req.body.existingPrompt || "").trim(),
        roleCategory,
        customInstructions
      );
      res.json(result);
    } catch (error) {
      console.error("Element prompt generation error:", error);
      res.status(500).json({ message: "Error generating prompt", error: error.message });
    }
  });
  app2.post("/api/admin/save-element-prompt", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const parsed = insertPromptSchema.safeParse({
        lensType: req.body.lensType,
        title: req.body.title,
        description: req.body.description,
        whatItDoes: Array.isArray(req.body.whatItDoes) ? req.body.whatItDoes.filter((s) => typeof s === "string" && s.trim()) : [],
        perfectFor: req.body.perfectFor || "",
        promptContent: req.body.promptContent || "",
        roleCategory: req.body.roleCategory || "all",
        isActive: "true"
      });
      if (!parsed.success) {
        return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten().fieldErrors });
      }
      const prompt = await storage.createPrompt(parsed.data);
      res.json(prompt);
    } catch (error) {
      console.error("Save prompt error:", error);
      res.status(500).json({ message: "Error saving prompt", error: error.message });
    }
  });
  app2.post("/api/admin/generate-poll", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { generateLinkedInPoll: generateLinkedInPoll2 } = await Promise.resolve().then(() => (init_thesysApi(), thesysApi_exports));
      const { topicContext } = req.body;
      if (!topicContext || typeof topicContext !== "string" || topicContext.trim().length === 0) {
        return res.status(400).json({ message: "topicContext is required" });
      }
      const poll = await generateLinkedInPoll2(topicContext.trim());
      res.json(poll);
    } catch (error) {
      console.error("Poll generation error:", error);
      res.status(500).json({ message: "Error generating poll", error: error.message });
    }
  });
  app2.get("/api/admin/notion/schema", requireAdminAuth, async (_req, res) => {
    try {
      const schema = await getNotionDatabaseSchema();
      res.json({
        message: "Notion connection verified",
        databaseId: schema.id,
        title: schema.title?.[0]?.plain_text || "Untitled",
        properties: Object.keys(schema.properties || {})
      });
    } catch (error) {
      console.error("Notion schema error:", error);
      res.status(500).json({
        message: "Failed to connect to Notion",
        error: error.message
      });
    }
  });
  app2.get("/api/admin/notion/unsynced", requireAdminAuth, async (_req, res) => {
    try {
      const unsynced = await getUnsyncedContacts();
      res.json({
        count: unsynced.length,
        contacts: unsynced.map((c) => ({ id: c.id, email: c.email, name: c.name }))
      });
    } catch (error) {
      console.error("Get unsynced error:", error);
      res.status(500).json({ message: "Error fetching unsynced contacts" });
    }
  });
  app2.post("/api/admin/notion/push", requireAdminAuth, requireWriteAccess, async (_req, res) => {
    try {
      console.log("Starting Notion push all...");
      const result = await pushAllContactsToNotion();
      res.json({
        message: `Pushed ${result.pushed} contacts to Notion`,
        ...result
      });
    } catch (error) {
      console.error("Notion push error:", error);
      res.status(500).json({ message: "Error pushing to Notion", error: error.message });
    }
  });
  app2.post("/api/admin/notion/pull", requireAdminAuth, requireWriteAccess, async (_req, res) => {
    try {
      console.log("Starting Notion pull...");
      const result = await pullContactsFromNotion();
      res.json({
        message: `Pulled updates: ${result.updated} updated, ${result.created} created`,
        ...result
      });
    } catch (error) {
      console.error("Notion pull error:", error);
      res.status(500).json({ message: "Error pulling from Notion", error: error.message });
    }
  });
  app2.post("/api/admin/notion/sync", requireAdminAuth, requireWriteAccess, async (_req, res) => {
    try {
      console.log("Starting full Notion sync...");
      const result = await fullSync();
      res.json({
        message: `Sync complete: ${result.pushed} pushed, ${result.pulled} pulled`,
        ...result
      });
    } catch (error) {
      console.error("Notion sync error:", error);
      res.status(500).json({ message: "Error syncing with Notion", error: error.message });
    }
  });
  app2.get("/api/prompts", async (_req, res) => {
    try {
      const promptsList = await storage.getActivePrompts();
      res.json(promptsList);
    } catch (error) {
      console.error("Get prompts error:", error);
      res.status(500).json({ message: "Error fetching prompts" });
    }
  });
  app2.get("/api/prompts/lens/:lensType", async (req, res) => {
    try {
      const { lensType } = req.params;
      const promptsList = await storage.getPromptsByLens(lensType);
      res.json(promptsList);
    } catch (error) {
      console.error("Get prompts by lens error:", error);
      res.status(500).json({ message: "Error fetching prompts" });
    }
  });
  app2.get("/api/prompts/role/:roleCategory", async (req, res) => {
    try {
      const { roleCategory } = req.params;
      const promptsList = await storage.getPromptsByRole(roleCategory);
      res.json(promptsList);
    } catch (error) {
      console.error("Get prompts by role error:", error);
      res.status(500).json({ message: "Error fetching prompts" });
    }
  });
  app2.post("/api/prompts/:id/upvote", async (req, res) => {
    try {
      const { id } = req.params;
      const prompt = await storage.upvotePrompt(id);
      if (!prompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      res.json(prompt);
    } catch (error) {
      console.error("Upvote prompt error:", error);
      res.status(500).json({ message: "Error upvoting prompt" });
    }
  });
  app2.get("/api/admin/prompts", requireAdminAuth, async (_req, res) => {
    try {
      const promptsList = await storage.getAllPrompts();
      res.json(promptsList);
    } catch (error) {
      console.error("Admin get prompts error:", error);
      res.status(500).json({ message: "Error fetching prompts" });
    }
  });
  app2.post("/api/admin/prompts", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { lensType, title, description, whatItDoes, perfectFor, promptContent, roleCategory, isActive } = req.body;
      const whatItDoesArray = Array.isArray(whatItDoes) ? whatItDoes : [];
      const validationResult = insertPromptSchema.safeParse({
        lensType,
        title,
        description,
        whatItDoes: whatItDoesArray,
        perfectFor,
        promptContent,
        roleCategory,
        isActive: isActive || "true"
      });
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: fromError(validationResult.error).toString()
        });
      }
      const prompt = await storage.createPrompt(validationResult.data);
      res.status(201).json({ message: "Prompt created", prompt });
    } catch (error) {
      console.error("Create prompt error:", error);
      res.status(500).json({ message: "Error creating prompt", error: error.message });
    }
  });
  app2.put("/api/admin/prompts/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const existingPrompt = await storage.getPromptById(id);
      if (!existingPrompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      const partialUpdate = {};
      if (updateData.lensType !== void 0) partialUpdate.lensType = updateData.lensType;
      if (updateData.title !== void 0) partialUpdate.title = updateData.title;
      if (updateData.description !== void 0) partialUpdate.description = updateData.description;
      if (updateData.whatItDoes !== void 0) {
        partialUpdate.whatItDoes = Array.isArray(updateData.whatItDoes) ? updateData.whatItDoes : [];
      }
      if (updateData.perfectFor !== void 0) partialUpdate.perfectFor = updateData.perfectFor;
      if (updateData.promptContent !== void 0) partialUpdate.promptContent = updateData.promptContent;
      if (updateData.roleCategory !== void 0) partialUpdate.roleCategory = updateData.roleCategory;
      if (updateData.isActive !== void 0) partialUpdate.isActive = updateData.isActive;
      const prompt = await storage.updatePrompt(id, partialUpdate);
      if (!prompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      res.json({ message: "Prompt updated", prompt });
    } catch (error) {
      console.error("Update prompt error:", error);
      res.status(500).json({ message: "Error updating prompt", error: error.message });
    }
  });
  app2.delete("/api/admin/prompts/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deletePrompt(id);
      if (!deleted) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      res.json({ message: "Prompt deleted" });
    } catch (error) {
      console.error("Delete prompt error:", error);
      res.status(500).json({ message: "Error deleting prompt", error: error.message });
    }
  });
  app2.post("/api/admin/prompts/seed", requireAdminAuth, requireWriteAccess, async (_req, res) => {
    try {
      const existingPrompts = await storage.getAllPrompts();
      if (existingPrompts.length > 0) {
        return res.status(400).json({
          message: `Database already has ${existingPrompts.length} prompts. Clear them first if you want to reseed.`
        });
      }
      const seedPrompts = [
        {
          lensType: "influence",
          title: "Influence Lens \u2014 How You Persuade & Lead",
          description: "Analyse your natural influence style, persuasion strategies, and leadership patterns.",
          whatItDoes: [
            "How you naturally influence and persuade others",
            "Your preferred influence strategies (advising, supporting, ordering, etc.)",
            "Your use of timing, body language, and communication rhythm",
            "Patterns that work well and areas where you might create friction"
          ],
          perfectFor: "Understanding your leadership style, preparing for negotiations, or improving how you guide teams.",
          promptContent: `# \u{1F534} Influence Lens Analysis

## What you'll get
A personalised analysis of how you influence, persuade, and lead others based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **\u{1F534} INFLUENCE LENS** only.

The Influence Lens includes these elements:
- **1101** Influence Strategies
- **1102** Quantum Conversations
- **1103** GreenBlueRed\u2122 (timing, body language, rhythm)
- **1104** Periodic Table
- **1105** Head-Up Display
- **1106** Facilitating & Hosting
- **1201** Advising
- **1202** Red Question
- **1203** Suggesting
- **1204** Supporting
- **1205** Ordering
- **1206** Agreeing

## Your task

1. Read the person's scan data carefully
2. Identify their top 3-5 influence patterns using element codes and names
3. Write in "You..." voice (second person)
4. Include direct quotes or scores as evidence
5. Be specific and actionable

## Output format

### \u{1F534} Your Influence Pattern

**"[One clear sentence describing how this person influences others]"**

### What you do naturally

- **[Element name]** ([code]): [specific behaviour with evidence]

### Where you create impact

[2-3 sentences about when and where their influence works best]

### Watch out for

- [Potential friction point or overuse pattern]

### 3 micro-experiments to try

1. **[Specific action]**: [Why this matters]
2. **[Specific action]**: [Why this matters]
3. **[Specific action]**: [Why this matters]

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
          roleCategory: "all",
          isActive: "true",
          votes: "42"
        },
        {
          lensType: "attitude",
          title: "Attitude Lens \u2014 Your Approach to Change & Learning",
          description: "Explore how you respond to change, learning preferences, and growth patterns.",
          whatItDoes: [
            "How you respond to change and new challenges",
            "Your learning preferences and retention patterns",
            "Your capacity for self-reflection and growth",
            "Which attitudes serve you (and which might limit you)"
          ],
          perfectFor: "Understanding resistance patterns, designing learning plans, or building sustainable habits.",
          promptContent: `# \u{1F7E0} Attitude Lens Analysis

## What you'll get
A personalised analysis of how you approach change, learning, and growth based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **\u{1F7E0} ATTITUDE LENS** only.

The Attitude Lens includes these elements:
- **2101** Attitude to Change
- **2102** Learning Retention
- **2103** Micro-Habits
- **2104** Self-Reflection
- **2401** Attitude 0 (resistance)
- **2402** Attitude I (cautious openness)
- **2403** Attitude II (active engagement)
- **2404** Attitude III (full integration)

## Your task

1. Read the person's scan data carefully
2. Identify their attitude level (0, I, II, or III) and learning patterns
3. Write in "You..." voice (second person)
4. Include direct quotes or scores as evidence
5. Be encouraging and realistic

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
          roleCategory: "all",
          isActive: "true",
          votes: "38"
        },
        {
          lensType: "chaordic",
          title: "Chaordic Lens \u2014 Structure vs. Freedom in Conversation",
          description: "Discover how you balance order and chaos in collaborative settings.",
          whatItDoes: [
            "How you balance structure (order) and flexibility (chaos) in conversations",
            "Which conversational formats you prefer (debate, dialogue, co-creation, etc.)",
            "Your natural role in group settings (Participant, Harvester, Host, Steward)",
            "When structure helps you and when it constrains you"
          ],
          perfectFor: "Designing meetings, facilitation work, or understanding team dynamics.",
          promptContent: `# \u{1F7E1} Chaordic Lens Analysis

## What you'll get
A personalised analysis of how you navigate structure and freedom in conversations based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **\u{1F7E1} CHAORDIC LENS** only.

The Chaordic Lens includes these elements:
- **3101** Chaordic Balance
- **3102** Algorithm Canvas
- **3111** Chaordic Roles
- **3112** Participant
- **3113** Harvester
- **3114** Host
- **3115** Steward

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
          roleCategory: "all",
          isActive: "true",
          votes: "35"
        },
        {
          lensType: "flow",
          title: "Flow Lens \u2014 Challenge, Skill & Motivation Balance",
          description: "Understand your flow state triggers, blockers, and optimal performance conditions.",
          whatItDoes: [
            "How your skills match your challenges",
            "What motivates you (and what drains you)",
            "When you experience flow states",
            "How feedback loops support or disrupt your momentum"
          ],
          perfectFor: "Designing work that energises you, preventing burnout, or optimising productivity.",
          promptContent: `# \u{1F7E2} Flow Lens Analysis

## What you'll get
A personalised analysis of your flow patterns, skill-challenge balance, and motivation drivers based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **\u{1F7E2} FLOW LENS** only.

The Flow Lens includes these elements:
- **4101** Measuring Flow
- **4102** Conscious Feedback
- **4103** Motivation
- **4104** Challenge
- **4105** Skill

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
          roleCategory: "all",
          isActive: "true",
          votes: "41"
        },
        {
          lensType: "alignment",
          title: "Alignment & Empathy Lens \u2014 Trust & Connection",
          description: "Explore how you build trust and create deep connection with others.",
          whatItDoes: [
            "How you build trust and connection with others",
            "Your use of empathic listening techniques (mirroring, summarising, labelling)",
            "Your strengths in kindness, respect, curiosity, and empathy",
            "How timing, silence, and body language support alignment"
          ],
          perfectFor: "Deepening relationships, coaching conversations, or building psychological safety.",
          promptContent: `# \u{1F7E2} Alignment & Empathy Lens Analysis

## What you'll get
A personalised analysis of how you create trust, connection, and empathy based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **\u{1F7E2} ALIGNMENT & EMPATHY LENS** only.

The Alignment & Empathy Lens includes these elements:
- **5101** Alignment
- **5102** Congruence
- **5201** Positive Phrases
- **5202** Green Questions
- **5203** Mirroring
- **5204** Summarising
- **5401-5406** Kindness, Respect, Building Trust, Empathy, Curiosity, Agape

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
          roleCategory: "all",
          isActive: "true",
          votes: "47"
        },
        {
          lensType: "needs",
          title: "Needs Lens \u2014 Understanding What Drives You",
          description: "Discover which needs are met, unmet, and how you express them.",
          whatItDoes: [
            "Which needs are met and which are unmet in your work and relationships",
            "How you express (or don't express) your needs",
            "Your understanding of others' needs",
            "Patterns around psychological safety, respect, autonomy, and belonging"
          ],
          perfectFor: "Conflict resolution, team building, or understanding what's missing in your environment.",
          promptContent: `# \u{1F7E2} Needs Lens Analysis

## What you'll get
A personalised analysis of your needs, how well they're met, and how you express them, based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **\u{1F7E2} NEEDS LENS** only.

The Needs Lens includes these elements:
- **6101** Chakra Needs
- **6102** Hierarchy of Needs
- **6103** Assumptions
- **6104** Functional Conflicts
- **6106** Stages of Team
- **6201** Conscious Request
- **6401** Psychological Safety

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
          roleCategory: "all",
          isActive: "true",
          votes: "39"
        },
        {
          lensType: "ego",
          title: "Ego Lens \u2014 Triggers, Hats & Self-Awareness",
          description: "Understand your ego triggers, protective patterns, and which 'hats' you wear.",
          whatItDoes: [
            "Your ego triggers (what activates defensiveness or reaction)",
            "Which 'ego hats' you wear (Judge, Hero, Narrator, etc.)",
            "How you protect yourself and where you might hide",
            "Patterns of learning, gratitude, and self-love"
          ],
          perfectFor: "Self-awareness work, understanding defensiveness, or recognising protective patterns.",
          promptContent: `# \u{1F535} Ego Lens Analysis

## What you'll get
A personalised analysis of your ego patterns, triggers, and protective strategies based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **\u{1F535} EGO LENS** only.

The Ego Lens includes these elements:
- **7101** Ego Triggers
- **7102** Drama Triangle
- **7109** Ego Hats
- **7110-7117** Interpretor, Interrogator, Judge, Devil's Advocate, Hero, Narrator, Hermit, Artisan
- **7401-7406** Learning, Pragmatism, Philautia (self-love), Ego, Gratitude, Responsibilities

## IMPORTANT: Reversed scale interpretation

**Ego Distance scale interpretation:**
- **LOW scores (1-3/10)** = HIGH ego distance = POSITIVE
- **HIGH scores (8-10/10)** = LOW ego distance = CONCERNING

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
          roleCategory: "all",
          isActive: "true",
          votes: "44"
        },
        {
          lensType: "dynamics",
          title: "Dynamics Lens \u2014 Relationships & Boundaries",
          description: "Explore how you navigate relationships, power dynamics, and boundaries.",
          whatItDoes: [
            "How you navigate relationship dynamics and power",
            "Your ability to say no and set boundaries",
            "How you handle polarity (masculine/feminine, giving/receiving)",
            "Patterns around consent, forgiveness, and relational rituals"
          ],
          perfectFor: "Relationship work, boundary setting, or understanding team dynamics.",
          promptContent: `# \u{1F7E3} Dynamics Lens Analysis

## What you'll get
A personalised analysis of your relationship dynamics, boundaries, and polarity patterns based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **\u{1F7E3} DYNAMICS LENS** only.

The Dynamics Lens includes these elements:
- **8101** Relationship Dynamics
- **8102** Conscious Consent
- **8103** Yin Yang Polarity
- **8201** Saying No
- **8401** Forgiveness

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
          roleCategory: "all",
          isActive: "true",
          votes: "36"
        },
        {
          lensType: "quickwins",
          title: "Quick Wins \u2014 Top 3 Strengths to Leverage Now",
          description: "Get your top 3 communication superpowers across all lenses with a one-week action plan.",
          whatItDoes: [
            "Your top 3 communication superpowers",
            "Exactly where and when to use each one",
            "A one-week action plan to leverage these strengths",
            "Quick, practical micro-experiments"
          ],
          perfectFor: "When you want immediate, actionable insights without reading 8 separate analyses.",
          promptContent: `# \u{1F308} Quick Wins \u2014 Your Top 3 Communication Strengths

## What you'll get
A fast, actionable summary of your top 3 communication superpowers and how to use them this week.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below across ALL 8 lenses, but focus on finding the **top 3 strengths** this person can leverage immediately.

## Your task

1. Read the person's scan data carefully
2. Identify the 3 strongest patterns across all lenses
3. For each strength, provide:
   - The element name and code
   - Why it's a superpower for them
   - Specific situations where they should use it
   - One micro-experiment for this week
4. Write in "You..." voice (second person)
5. Be encouraging and specific

## Output format

### \u{1F308} Your Top 3 Communication Superpowers

**Based on your Satellite Scan, here are your strongest assets:**

---

### Strength #1: [Element Name] ([code])

**Why this is your superpower:**
[2-3 sentences with evidence from their scan]

**When to use it:**
- [Specific situation 1]
- [Specific situation 2]

**This week's experiment:**
[One concrete action they can take in the next 7 days]

---

### Your One-Week Action Plan

**Monday-Tuesday:** [Use strength #1 in this way]
**Wednesday-Thursday:** [Use strength #2 in this way]
**Friday-Weekend:** [Use strength #3 in this way]

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
          roleCategory: "all",
          isActive: "true",
          votes: "58"
        }
      ];
      const createdPrompts = [];
      for (const promptData of seedPrompts) {
        const prompt = await storage.createPrompt(promptData);
        createdPrompts.push(prompt);
      }
      res.status(201).json({
        message: `Successfully seeded ${createdPrompts.length} prompts`,
        prompts: createdPrompts
      });
    } catch (error) {
      console.error("Seed prompts error:", error);
      res.status(500).json({ message: "Error seeding prompts", error: error.message });
    }
  });
  app2.get("/api/admin/onboarding-emails", requireAdminAuth, async (_req, res) => {
    try {
      const templates = await storage.getAllOnboardingEmailTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Get onboarding templates error:", error);
      res.status(500).json({ message: "Error fetching templates", error: error.message });
    }
  });
  app2.get("/api/admin/onboarding-emails/:id", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage.getOnboardingEmailTemplateById(id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Get template error:", error);
      res.status(500).json({ message: "Error fetching template", error: error.message });
    }
  });
  app2.post("/api/admin/onboarding-emails", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { sequenceNumber, delayMinutes, triggerEvent, subject, body, isActive, title } = req.body;
      if (!sequenceNumber || !delayMinutes || !triggerEvent || !subject || !body) {
        return res.status(400).json({ message: "Missing required fields: sequenceNumber, delayMinutes, triggerEvent, subject, body" });
      }
      const template = await storage.createOnboardingEmailTemplate({
        sequenceNumber: String(sequenceNumber),
        delayMinutes: String(delayMinutes),
        triggerEvent,
        subject,
        body,
        isActive: isActive ?? "true",
        title: title || `Email #${sequenceNumber}`
      });
      res.status(201).json(template);
    } catch (error) {
      console.error("Create template error:", error);
      res.status(500).json({ message: "Error creating template", error: error.message });
    }
  });
  app2.put("/api/admin/onboarding-emails/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = {};
      if (req.body.sequenceNumber !== void 0) updates.sequenceNumber = String(req.body.sequenceNumber);
      if (req.body.delayMinutes !== void 0) updates.delayMinutes = String(req.body.delayMinutes);
      if (req.body.triggerEvent !== void 0) updates.triggerEvent = req.body.triggerEvent;
      if (req.body.subject !== void 0) updates.subject = req.body.subject;
      if (req.body.body !== void 0) updates.body = req.body.body;
      if (req.body.isActive !== void 0) updates.isActive = String(req.body.isActive);
      if (req.body.title !== void 0) updates.title = req.body.title;
      const template = await storage.updateOnboardingEmailTemplate(id, updates);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Update template error:", error);
      res.status(500).json({ message: "Error updating template", error: error.message });
    }
  });
  app2.delete("/api/admin/onboarding-emails/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteOnboardingEmailTemplate(id);
      if (!deleted) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json({ message: "Template deleted successfully" });
    } catch (error) {
      console.error("Delete template error:", error);
      res.status(500).json({ message: "Error deleting template", error: error.message });
    }
  });
  app2.get("/api/admin/onboarding-emails/logs/:email", requireAdminAuth, async (req, res) => {
    try {
      const { email } = req.params;
      const logs = await storage.getOnboardingEmailLogsByCustomer(email);
      res.json(logs);
    } catch (error) {
      console.error("Get logs error:", error);
      res.status(500).json({ message: "Error fetching logs", error: error.message });
    }
  });
  app2.post("/api/admin/onboarding-emails/send", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { customerEmail, sequenceNumber } = req.body;
      if (!customerEmail || sequenceNumber === void 0) {
        return res.status(400).json({ message: "Missing required fields: customerEmail, sequenceNumber" });
      }
      const { triggerOnboardingEmail: triggerOnboardingEmail2 } = await Promise.resolve().then(() => (init_onboarding_scheduler(), onboarding_scheduler_exports));
      const result = await triggerOnboardingEmail2(customerEmail, String(sequenceNumber));
      if (result.success) {
        res.json({ message: result.message });
      } else {
        res.status(400).json({ message: result.message });
      }
    } catch (error) {
      console.error("Send email error:", error);
      res.status(500).json({ message: "Error sending email", error: error.message });
    }
  });
  app2.post("/api/admin/onboarding-emails/seed", requireAdminAuth, requireWriteAccess, async (_req, res) => {
    try {
      const existingTemplates = await storage.getAllOnboardingEmailTemplates();
      if (existingTemplates.length > 0) {
        return res.status(400).json({
          message: `Templates already exist (${existingTemplates.length} found). Delete them first to re-seed.`
        });
      }
      const fibonacciTemplates = [
        {
          sequenceNumber: "0",
          delayMinutes: "0",
          triggerEvent: "purchase",
          subject: "Welcome to Your Satellite Scan Journey, {{firstName}}!",
          title: "Immediate welcome after purchase",
          body: `<p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi {{firstName}},</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">Welcome aboard! Your Satellite Scan purchase has been confirmed.</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;"><strong>What happens next:</strong></p>
<ol style="line-height: 1.8;">
<li>Complete your Satellite Scan (90-minute questionnaire)</li>
<li>Receive your raw data immediately after completion</li>
<li>Get your personalized dashboard within 48-72 hours</li>
</ol>
<div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
<p style="margin: 0; color: #15803d;"><strong>Ready to start?</strong></p>
<div style="text-align: center; margin-top: 15px;">
<a href="https://greenelephantorg.typeform.com/individualscan" style="display: inline-block; background-color: #16a34a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">Start Your Satellite Scan</a>
</div>
</div>
<p style="color: #374151; margin-top: 25px;">Warm regards,<br><strong>The GreenElephant Team</strong></p>`,
          isActive: "true"
        },
        {
          sequenceNumber: "1",
          delayMinutes: "60",
          triggerEvent: "scan_completed",
          subject: "Your Data is In, {{firstName}} \u2014 What's Next?",
          title: "1 hour after scan completion",
          body: `<p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi {{firstName}},</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">Congratulations on completing your Satellite Scan! Your raw data has been sent to your inbox.</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;"><strong>While you wait for your dashboard (48-72 hours):</strong></p>
<ul style="line-height: 1.8;">
<li>Explore our <a href="https://greenelephant.org/resources" style="color: #009999;">Resources & Prompts</a></li>
<li>Try the <a href="https://chatgpt.com/g/g-bUJ6dvAHK-conscious-communicator" style="color: #009999;">Conscious Communicator GPT</a></li>
<li>Paste your raw data into any prompt to start discovering patterns</li>
</ul>
<p style="color: #374151; margin-top: 25px;">Your journey of self-discovery begins now!<br><strong>The GreenElephant Team</strong></p>`,
          isActive: "true"
        },
        {
          sequenceNumber: "2",
          delayMinutes: "1440",
          triggerEvent: "scan_completed",
          subject: "Day 1: Start Mining Your Communication Patterns",
          title: "1 day after scan completion",
          body: `<p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi {{firstName}},</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">It's been a day since you completed your Satellite Scan. Have you had a chance to explore your data?</p>
<div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
<p style="margin: 0 0 10px 0; color: #1e40af;"><strong>Today's Suggestion:</strong></p>
<p style="margin: 0; color: #1e3a8a;">Try the "Quick Wins" prompt to discover your top 3 communication strengths. It takes just 5 minutes!</p>
</div>
<p style="color: #374151;">Curious about a specific area? Reply to this email with your question.<br><strong>The GreenElephant Team</strong></p>`,
          isActive: "true"
        },
        {
          sequenceNumber: "3",
          delayMinutes: "2880",
          triggerEvent: "scan_completed",
          subject: "Day 3: Your Dashboard Insights Await",
          title: "2 days after scan completion (cumulative 3 days)",
          body: `<p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi {{firstName}},</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">By now, your personalized dashboard should be ready or arriving shortly. If you haven't received it yet, it's on its way!</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;"><strong>What to look for in your dashboard:</strong></p>
<ul style="line-height: 1.8;">
<li>Your dominant communication lens</li>
<li>Hidden strengths you might not recognize</li>
<li>Areas where small shifts create big impact</li>
</ul>
<p style="color: #374151;">Questions about your dashboard? Just reply to this email.<br><strong>The GreenElephant Team</strong></p>`,
          isActive: "true"
        },
        {
          sequenceNumber: "4",
          delayMinutes: "4320",
          triggerEvent: "scan_completed",
          subject: "Day 6: Deep Dive into Your Influence Patterns",
          title: "3 days after previous (cumulative 6 days)",
          body: `<p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi {{firstName}},</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">This week, let's explore your Influence Lens\u2014how you naturally persuade, inspire, and lead others.</p>
<div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
<p style="margin: 0 0 10px 0; color: #92400e;"><strong>Reflection Question:</strong></p>
<p style="margin: 0; color: #78350f;">Think of a recent conversation where you successfully influenced someone's perspective. What did you do naturally?</p>
</div>
<p style="color: #374151;">Use the Influence Lens prompt with your data to discover more.<br><strong>The GreenElephant Team</strong></p>`,
          isActive: "true"
        },
        {
          sequenceNumber: "5",
          delayMinutes: "7200",
          triggerEvent: "scan_completed",
          subject: "Day 11: Mastering the Chaordic Balance",
          title: "5 days after previous (cumulative 11 days)",
          body: `<p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi {{firstName}},</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">Have you ever noticed how some meetings feel too rigid while others spiral into chaos?</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">Your Chaordic Lens reveals how you naturally balance structure and freedom in conversations.</p>
<div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
<p style="margin: 0 0 10px 0; color: #166534;"><strong>This Week's Experiment:</strong></p>
<p style="margin: 0; color: #15803d;">In your next meeting, notice when the conversation needs more structure vs. more freedom. What role do you naturally take?</p>
</div>
<p style="color: #374151;">Curious about your facilitation style? Try the Chaordic Lens prompt!<br><strong>The GreenElephant Team</strong></p>`,
          isActive: "true"
        },
        {
          sequenceNumber: "6",
          delayMinutes: "11520",
          triggerEvent: "scan_completed",
          subject: "Day 19: Understanding Your Flow States",
          title: "8 days after previous (cumulative 19 days)",
          body: `<p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi {{firstName}},</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">When was the last time you were completely absorbed in a conversation? Time flew by, ideas flowed naturally, and you felt energized afterward?</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">That's your communication flow state.</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">Your Flow Lens data reveals:</p>
<ul style="line-height: 1.8;">
<li>What conditions trigger your best conversations</li>
<li>What drains your communication energy</li>
<li>How to design more flow into your daily interactions</li>
</ul>
<p style="color: #374151;">Explore the Flow Lens prompt with your data!<br><strong>The GreenElephant Team</strong></p>`,
          isActive: "true"
        },
        {
          sequenceNumber: "7",
          delayMinutes: "18720",
          triggerEvent: "scan_completed",
          subject: "Day 32: The Power of Alignment",
          title: "13 days after previous (cumulative 32 days)",
          body: `<p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi {{firstName}},</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">A month into your Satellite Scan journey\u2014how have your conversations changed?</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">Today, let's explore Alignment\u2014the art of ensuring your words match your intentions, and your intentions serve your deeper values.</p>
<div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
<p style="margin: 0 0 10px 0; color: #1e40af;"><strong>Alignment Check:</strong></p>
<p style="margin: 0; color: #1e3a8a;">Think of a conversation that felt "off" recently. Where might there have been a misalignment between what you said, what you meant, and what you truly wanted?</p>
</div>
<p style="color: #374151;">The Alignment Lens prompt can help you discover patterns!<br><strong>The GreenElephant Team</strong></p>`,
          isActive: "true"
        },
        {
          sequenceNumber: "8",
          delayMinutes: "30240",
          triggerEvent: "scan_completed",
          subject: "Day 53: Navigating Needs & Ego",
          title: "21 days after previous (cumulative 53 days)",
          body: `<p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi {{firstName}},</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">Nearly two months into your conscious communication journey. You've explored influence, flow, and alignment.</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">Now let's go deeper\u2014into Needs and Ego.</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">These two lenses reveal:</p>
<ul style="line-height: 1.8;">
<li>The unspoken needs driving your conversations</li>
<li>How ego protection patterns might be limiting connection</li>
<li>Ways to transform conflict into understanding</li>
</ul>
<p style="color: #374151;">Ready for the deeper work? Try the Needs Lens and Ego Lens prompts.<br><strong>The GreenElephant Team</strong></p>`,
          isActive: "true"
        },
        {
          sequenceNumber: "9",
          delayMinutes: "48960",
          triggerEvent: "scan_completed",
          subject: "Day 87: Your Journey So Far & What's Next",
          title: "34 days after previous (cumulative 87 days)",
          body: `<p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi {{firstName}},</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">Three months ago, you took your first step toward conscious communication with your Satellite Scan.</p>
<p style="font-size: 16px; line-height: 1.6; color: #374151;"><strong>Take a moment to reflect:</strong></p>
<ul style="line-height: 1.8;">
<li>What communication patterns have you noticed?</li>
<li>Which insights surprised you most?</li>
<li>What small shifts have made the biggest difference?</li>
</ul>
<div style="background-color: #f3e8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #9333ea;">
<p style="margin: 0 0 10px 0; color: #6b21a8;"><strong>Ready for the Next Level?</strong></p>
<p style="margin: 0; color: #7c3aed;">If you'd like personalized coaching to accelerate your growth, check out our <a href="https://greenelephant.org/coaching" style="color: #9333ea;">Coaching Journey</a> or book a <a href="https://greenelephant.org/programs" style="color: #9333ea;">1:1 Session</a>.</p>
</div>
<p style="color: #374151;">Thank you for being part of the GreenElephant community!<br><strong>The GreenElephant Team</strong></p>`,
          isActive: "true"
        }
      ];
      const createdTemplates = [];
      for (const templateData of fibonacciTemplates) {
        const template = await storage.createOnboardingEmailTemplate(templateData);
        createdTemplates.push(template);
      }
      res.status(201).json({
        message: `Successfully seeded ${createdTemplates.length} Fibonacci-timed onboarding email templates`,
        templates: createdTemplates
      });
    } catch (error) {
      console.error("Seed onboarding templates error:", error);
      res.status(500).json({ message: "Error seeding templates", error: error.message });
    }
  });
  app2.post("/api/admin/batch-email/preview", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { includeChannels, excludeChannels } = req.body;
      const contacts2 = await storage.getContactsWithFilters(
        includeChannels || [],
        excludeChannels || []
      );
      res.json({
        count: contacts2.length,
        contacts: contacts2.map((c) => ({
          id: c.id,
          email: c.email,
          name: c.name,
          channelsReached: c.channelsReached || [],
          source: c.source
        }))
      });
    } catch (error) {
      console.error("Batch email preview error:", error);
      res.status(500).json({ message: "Error previewing recipients", error: error.message });
    }
  });
  app2.post("/api/admin/batch-email/send", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { subject, body, includeChannels, excludeChannels } = req.body;
      if (!subject || !body) {
        return res.status(400).json({ message: "Subject and body are required" });
      }
      const contacts2 = await storage.getContactsWithFilters(
        includeChannels || [],
        excludeChannels || []
      );
      if (contacts2.length === 0) {
        return res.status(400).json({ message: "No contacts match the filter criteria" });
      }
      const batchSend = await storage.createBatchEmailSend({
        subject,
        body,
        filterCriteria: { includeChannels, excludeChannels },
        recipientCount: contacts2.length.toString()
      });
      if (!await isConnectorEnabled("resend")) {
        return res.status(503).json({ message: "Email sending is currently disabled. Enable Resend in Connected Tools." });
      }
      const { Resend: Resend2 } = await import("resend");
      const resend = new Resend2(process.env.RESEND_API_KEY);
      let successCount = 0;
      let failedCount = 0;
      const results = [];
      for (const contact of contacts2) {
        const recipient = await storage.createBatchEmailRecipient({
          batchId: batchSend.id,
          contactId: contact.id,
          email: contact.email,
          status: "pending"
        });
        try {
          let personalizedBody = body.replace(/\{\{firstName\}\}/g, contact.name?.split(" ")[0] || "there").replace(/\{\{name\}\}/g, contact.name || "there").replace(/\{\{email\}\}/g, contact.email);
          await resend.emails.send({
            from: "GreenElephant <hello@greenelephant.org>",
            to: contact.email,
            subject,
            html: `
              <div style="font-family: 'Lato', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
                ${personalizedBody}
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                <p style="font-size: 12px; color: #6b7280; text-align: center;">
                  You received this email because you signed up at GreenElephant.org<br/>
                  <a href="https://greenelephant.org" style="color: #0ea5e9;">Visit GreenElephant.org</a>
                </p>
              </div>
            `
          });
          successCount++;
          await storage.updateBatchEmailRecipient(recipient.id, {
            status: "sent",
            sentAt: /* @__PURE__ */ new Date()
          });
          results.push({ email: contact.email, status: "sent" });
        } catch (emailError) {
          failedCount++;
          await storage.updateBatchEmailRecipient(recipient.id, {
            status: "failed",
            errorMessage: emailError.message
          });
          results.push({ email: contact.email, status: "failed", error: emailError.message });
        }
      }
      await storage.updateBatchEmailSend(batchSend.id, {
        successCount: successCount.toString(),
        failedCount: failedCount.toString(),
        status: "completed",
        sentAt: /* @__PURE__ */ new Date()
      });
      console.log(`\u{1F4E7} Batch email completed: ${successCount} sent, ${failedCount} failed`);
      res.json({
        message: `Batch email completed`,
        batchId: batchSend.id,
        total: contacts2.length,
        successCount,
        failedCount,
        results
      });
    } catch (error) {
      console.error("Batch email send error:", error);
      res.status(500).json({ message: "Error sending batch email", error: error.message });
    }
  });
  app2.get("/api/admin/batch-email/history", requireAdminAuth, async (_req, res) => {
    try {
      const history = await storage.getAllBatchEmailSends();
      res.json(history);
    } catch (error) {
      console.error("Batch email history error:", error);
      res.status(500).json({ message: "Error fetching batch email history" });
    }
  });
  app2.get("/api/admin/batch-email/:id", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const batchSend = await storage.getBatchEmailSendById(id);
      if (!batchSend) {
        return res.status(404).json({ message: "Batch email send not found" });
      }
      const recipients = await storage.getBatchEmailRecipientsByBatchId(id);
      res.json({
        ...batchSend,
        recipients
      });
    } catch (error) {
      console.error("Batch email details error:", error);
      res.status(500).json({ message: "Error fetching batch email details" });
    }
  });
  app2.get("/api/admin/contacts", requireAdminAuth, async (_req, res) => {
    try {
      const contacts2 = await storage.getAllContacts();
      res.json(contacts2.map((c) => ({
        id: c.id,
        email: c.email,
        name: c.name,
        channelsReached: c.channelsReached || [],
        source: c.source,
        createdAt: c.createdAt,
        notionSyncedAt: c.notionSyncedAt,
        scanSubmittedAt: c.scanSubmittedAt
      })));
    } catch (error) {
      console.error("Admin contacts error:", error);
      res.status(500).json({ message: "Error fetching contacts" });
    }
  });
  app2.get("/api/admin/newsletter/campaigns", requireAdminAuth, async (_req, res) => {
    try {
      const campaigns = await storage.getAllNewsletterCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error("Newsletter campaigns list error:", error);
      res.status(500).json({ message: "Error fetching campaigns" });
    }
  });
  app2.post("/api/admin/newsletter/campaigns", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { name, subject, htmlContent } = req.body;
      if (!name || !subject || !htmlContent) {
        return res.status(400).json({ message: "Name, subject, and content are required" });
      }
      const campaign = await storage.createNewsletterCampaign({
        name,
        subject,
        htmlContent,
        status: "draft"
      });
      res.json(campaign);
    } catch (error) {
      console.error("Create campaign error:", error);
      res.status(500).json({ message: "Error creating campaign" });
    }
  });
  app2.get("/api/admin/newsletter/campaigns/:id", requireAdminAuth, async (req, res) => {
    try {
      const campaign = await storage.getNewsletterCampaignById(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      const recipients = await storage.getNewsletterRecipientsByCampaign(req.params.id);
      res.json({ campaign, recipients });
    } catch (error) {
      console.error("Get campaign error:", error);
      res.status(500).json({ message: "Error fetching campaign" });
    }
  });
  app2.patch("/api/admin/newsletter/campaigns/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { name, subject, htmlContent, status } = req.body;
      const campaign = await storage.updateNewsletterCampaign(req.params.id, {
        ...name && { name },
        ...subject && { subject },
        ...htmlContent && { htmlContent },
        ...status && { status }
      });
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      console.error("Update campaign error:", error);
      res.status(500).json({ message: "Error updating campaign" });
    }
  });
  app2.delete("/api/admin/newsletter/campaigns/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      await storage.deleteNewsletterCampaign(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete campaign error:", error);
      res.status(500).json({ message: "Error deleting campaign" });
    }
  });
  app2.post("/api/admin/newsletter/campaigns/:id/populate-recipients", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const campaign = await storage.getNewsletterCampaignById(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      const contacts2 = await storage.getAllContacts();
      const existingRecipients = await storage.getNewsletterRecipientsByCampaign(req.params.id);
      const existingContactIds = new Set(existingRecipients.map((r) => r.contactId));
      let added = 0;
      for (const contact of contacts2) {
        if (!existingContactIds.has(contact.id)) {
          await storage.createNewsletterRecipient({
            campaignId: req.params.id,
            contactId: contact.id,
            email: contact.email,
            excluded: "false",
            status: "pending"
          });
          added++;
        }
      }
      const allRecipients = await storage.getNewsletterRecipientsByCampaign(req.params.id);
      res.json({
        message: `Added ${added} new recipients`,
        totalRecipients: allRecipients.length,
        recipients: allRecipients
      });
    } catch (error) {
      console.error("Populate recipients error:", error);
      res.status(500).json({ message: "Error populating recipients" });
    }
  });
  app2.patch("/api/admin/newsletter/recipients/:id/toggle-exclude", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { excluded } = req.body;
      const recipient = await storage.updateNewsletterRecipient(req.params.id, {
        excluded: excluded ? "true" : "false"
      });
      if (!recipient) {
        return res.status(404).json({ message: "Recipient not found" });
      }
      res.json(recipient);
    } catch (error) {
      console.error("Toggle exclude error:", error);
      res.status(500).json({ message: "Error toggling exclusion" });
    }
  });
  app2.post("/api/admin/newsletter/campaigns/:id/send", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const campaign = await storage.getNewsletterCampaignById(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      if (campaign.status === "sent") {
        return res.status(400).json({ message: "Campaign already sent" });
      }
      await storage.updateNewsletterCampaign(req.params.id, { status: "sending" });
      const recipients = await storage.getNewsletterRecipientsByCampaign(req.params.id);
      const toSend = recipients.filter((r) => r.excluded === "false" && r.status === "pending");
      if (toSend.length === 0) {
        return res.status(400).json({ message: "No recipients to send to" });
      }
      if (!await isConnectorEnabled("resend")) {
        return res.status(503).json({ message: "Email sending is currently disabled. Enable Resend in Connected Tools." });
      }
      const { getUncachableResendClient: getUncachableResendClient2 } = await Promise.resolve().then(() => (init_resend_client(), resend_client_exports));
      const { client: resend, fromEmail } = await getUncachableResendClient2();
      const senderEmail = fromEmail || "hello@greenelephant.org";
      const formattedFrom = `Esteve from GreenElephant <${senderEmail}>`;
      console.log(`\u{1F4E7} Sending campaign "${campaign.name}" from: ${formattedFrom}`);
      let successCount = 0;
      let failedCount = 0;
      for (const recipient of toSend) {
        try {
          const trackingPixel = `<img src="https://greenelephant.org/api/newsletter/track/${campaign.id}/${recipient.contactId}/open.gif" width="1" height="1" style="display:none" alt="" />`;
          const htmlWithTracking = campaign.htmlContent + trackingPixel;
          await resend.emails.send({
            from: formattedFrom,
            to: recipient.email,
            subject: campaign.subject,
            html: htmlWithTracking
          });
          await storage.updateNewsletterRecipient(recipient.id, {
            status: "sent",
            sentAt: /* @__PURE__ */ new Date()
          });
          successCount++;
        } catch (emailError) {
          console.error(`Failed to send to ${recipient.email}:`, emailError.message);
          await storage.updateNewsletterRecipient(recipient.id, {
            status: "failed",
            errorMessage: emailError.message
          });
          failedCount++;
        }
      }
      await storage.updateNewsletterCampaign(req.params.id, {
        status: "sent",
        sentAt: /* @__PURE__ */ new Date()
      });
      await syncNewsletterToNotion(req.params.id);
      res.json({
        success: true,
        sent: successCount,
        failed: failedCount
      });
    } catch (error) {
      console.error("Send campaign error:", error);
      res.status(500).json({ message: "Error sending campaign" });
    }
  });
  app2.post("/api/admin/newsletter/campaigns/:id/reset", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const campaign = await storage.getNewsletterCampaignById(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      await storage.updateNewsletterCampaign(req.params.id, {
        status: "draft",
        sentAt: null
      });
      const recipients = await storage.getNewsletterRecipientsByCampaign(req.params.id);
      let resetCount = 0;
      for (const recipient of recipients) {
        await storage.updateNewsletterRecipient(recipient.id, {
          status: "pending",
          sentAt: null,
          errorMessage: null
        });
        resetCount++;
      }
      res.json({ success: true, resetCount });
    } catch (error) {
      console.error("Reset campaign error:", error);
      res.status(500).json({ message: "Error resetting campaign" });
    }
  });
  app2.post("/api/admin/newsletter/campaigns/:id/test", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { testEmail } = req.body;
      if (!testEmail) {
        return res.status(400).json({ message: "Test email address required" });
      }
      const campaign = await storage.getNewsletterCampaignById(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      if (!await isConnectorEnabled("resend")) {
        return res.status(503).json({ message: "Email sending is currently disabled. Enable Resend in Connected Tools." });
      }
      const { getUncachableResendClient: getUncachableResendClient2 } = await Promise.resolve().then(() => (init_resend_client(), resend_client_exports));
      const { client: resend, fromEmail } = await getUncachableResendClient2();
      const senderEmail = fromEmail || "hello@greenelephant.org";
      const formattedFrom = `Esteve from GreenElephant <${senderEmail}>`;
      console.log(`\u{1F4E7} Sending TEST email to ${testEmail} from: ${formattedFrom}`);
      const testHtml = `<div style="background: #fef3c7; padding: 10px; margin-bottom: 20px; border-radius: 4px;"><strong>\u26A0\uFE0F TEST EMAIL</strong> - This is a test of campaign "${campaign.name}"</div>` + campaign.htmlContent;
      await resend.emails.send({
        from: formattedFrom,
        to: testEmail,
        subject: `[TEST] ${campaign.subject}`,
        html: testHtml
      });
      console.log(`\u2705 Test email sent successfully to ${testEmail}`);
      res.json({ success: true, sentTo: testEmail });
    } catch (error) {
      console.error("Test email error:", error);
      res.status(500).json({ message: error.message || "Error sending test email" });
    }
  });
  app2.get("/api/newsletter/track/:campaignId/:contactId/open.gif", async (req, res) => {
    try {
      const { campaignId, contactId } = req.params;
      await storage.recordNewsletterOpen(campaignId, contactId);
      syncNewsletterToNotion(campaignId, contactId).catch(
        (err) => console.error("Failed to sync open to Notion:", err)
      );
      const gif = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");
      res.setHeader("Content-Type", "image/gif");
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.send(gif);
    } catch (error) {
      console.error("Track open error:", error);
      const gif = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");
      res.setHeader("Content-Type", "image/gif");
      res.send(gif);
    }
  });
  app2.post("/api/admin/test/satellitescan-email", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { customerEmail, customerName } = req.body;
      if (!customerEmail) {
        return res.status(400).json({ message: "Customer email required" });
      }
      const { sendSatellitescanPurchaseEmail: sendSatellitescanPurchaseEmail2 } = await Promise.resolve().then(() => (init_email_notifications(), email_notifications_exports));
      const testData = {
        customerEmail,
        customerName: customerName || "Test User",
        amount: "99.95",
        paymentIntentId: `test_pi_${Date.now()}`,
        purchaseId: `test_purchase_${Date.now()}`
      };
      console.log(`\u{1F9EA} TEST: Sending Satellitescan purchase email to ${customerEmail}`);
      const result = await sendSatellitescanPurchaseEmail2(testData);
      if (result) {
        res.json({ success: true, message: `Test emails sent to ${customerEmail} and admin` });
      } else {
        res.status(500).json({ success: false, message: "Email send returned false" });
      }
    } catch (error) {
      console.error("Test email error:", error);
      res.status(500).json({ message: error.message || "Error sending test email" });
    }
  });
  app2.post("/api/admin/test/onboarding-email", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { customerEmail, sequenceNumber } = req.body;
      if (!customerEmail || !sequenceNumber) {
        return res.status(400).json({ message: "Customer email and sequence number required" });
      }
      const { triggerOnboardingEmail: triggerOnboardingEmail2 } = await Promise.resolve().then(() => (init_onboarding_scheduler(), onboarding_scheduler_exports));
      console.log(`\u{1F9EA} TEST: Sending onboarding email #${sequenceNumber} to ${customerEmail}`);
      const result = await triggerOnboardingEmail2(customerEmail, String(sequenceNumber));
      if (result.success) {
        res.json({ success: true, message: result.message });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error("Test onboarding email error:", error);
      res.status(500).json({ message: error.message || "Error sending test email" });
    }
  });
  app2.get("/api/webinar-settings", async (_req, res) => {
    try {
      const settings = await storage.getWebinarSettings();
      if (!settings) {
        return res.json({
          countdownDeadline: (/* @__PURE__ */ new Date("2026-02-28T23:59:59+02:00")).toISOString(),
          hostNames: "Anu Timmerbacka",
          bonusDescription: "a free 1-on-1 session with a GreenElephant coach",
          sessionTitle: "Communication Clarity for EA's & VA's",
          sessionSubtitle: "Lead with calm influence and conscious impact",
          sessionDuration: "75 minutes",
          ctaButtonText: null,
          ctaButtonTextExpired: null
        });
      }
      res.json(settings);
    } catch (error) {
      console.error("Error fetching webinar settings:", error);
      res.status(500).json({ message: error.message });
    }
  });
  app2.put("/api/admin/webinar-settings", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const result = await storage.upsertWebinarSettings(req.body);
      res.json(result);
    } catch (error) {
      console.error("Error updating webinar settings:", error);
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/admin/webinar-settings", requireAdminAuth, async (_req, res) => {
    try {
      const settings = await storage.getWebinarSettings();
      res.json(settings || null);
    } catch (error) {
      console.error("Error fetching webinar settings:", error);
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/calendar-events", async (_req, res) => {
    try {
      const events = await storage.getAllCalendarEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/admin/calendar-events", requireAdminAuth, async (_req, res) => {
    try {
      res.json(await storage.getAllCalendarEvents());
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/admin/calendar-events", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { insertCalendarEventSchema: insertCalendarEventSchema2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const parsed = insertCalendarEventSchema2.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
      const event = await storage.createCalendarEvent(parsed.data);
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.patch("/api/admin/calendar-events/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const event = await storage.updateCalendarEvent(req.params.id, req.body);
      if (!event) return res.status(404).json({ message: "Event not found" });
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.delete("/api/admin/calendar-events/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const deleted = await storage.deleteCalendarEvent(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Event not found" });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/webinar-sessions", async (_req, res) => {
    try {
      const sessions = await storage.getAllWebinarSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching webinar sessions:", error);
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/admin/webinar-sessions", requireAdminAuth, async (_req, res) => {
    try {
      const sessions = await storage.getAllWebinarSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/admin/webinar-sessions", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { insertWebinarSessionSchema: insertWebinarSessionSchema2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const parsed = insertWebinarSessionSchema2.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
      const session2 = await storage.createWebinarSession(parsed.data);
      res.status(201).json(session2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.patch("/api/admin/webinar-sessions/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { id } = req.params;
      const session2 = await storage.updateWebinarSession(id, req.body);
      if (!session2) return res.status(404).json({ message: "Session not found" });
      res.json(session2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.delete("/api/admin/webinar-sessions/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteWebinarSession(id);
      if (!deleted) return res.status(404).json({ message: "Session not found" });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/admin/trigger-pulse", requireAdminAuth, requireWriteAccess, async (_req, res) => {
    try {
      const { runDailyPulse: runDailyPulse2 } = await Promise.resolve().then(() => (init_daily_pulse(), daily_pulse_exports));
      const success = await runDailyPulse2();
      if (success) {
        res.json({ success: true, message: "Daily pulse email sent to esteve@greenelephant.org" });
      } else {
        res.status(500).json({ success: false, message: "Pulse ran but email failed \u2014 check server logs" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/admin/email-test", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { journeyId } = req.body;
      if (!journeyId) return res.status(400).json({ message: "journeyId is required" });
      const { sendDailyPulseEmail: sendDailyPulseEmail2 } = await Promise.resolve().then(() => (init_email_notifications(), email_notifications_exports));
      const journeyMap = {
        "satellite-scan": "Satellite Scan Purchase",
        "newsletter": "Newsletter Subscription",
        "flow-check": "Check-my-FLOW",
        "signals-quiz": "Signals Quiz",
        "webinar-waitlist": "Webinar Waitlist",
        "contact-form": "Contact Form"
      };
      const journeyName = journeyMap[journeyId];
      if (!journeyName) return res.status(400).json({ message: `Unknown journeyId: ${journeyId}` });
      await sendDailyPulseEmail2({
        date: `TEST \u2014 ${journeyName} journey`,
        scanPurchases: 0,
        revenue: 0,
        newsletterSubs: 0,
        webinarSignups: 0,
        flowChecks: 0,
        flowZones: {},
        quizCompletions: 0,
        contactMessages: 0
      });
      res.json({ success: true, message: `Test email for "${journeyName}" sent to esteve@greenelephant.org` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/admin/connectors", requireAdminAuth, async (_req, res) => {
    try {
      const states = await storage.getAllConnectorStates();
      res.json(states);
    } catch (error) {
      console.error("Get connector states error:", error);
      res.status(500).json({ message: "Error fetching connector states" });
    }
  });
  app2.get("/api/admin/connectors/log", requireAdminAuth, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 50;
      const logs = await storage.getConnectorToggleLogs(limit);
      res.json(logs);
    } catch (error) {
      console.error("Get connector logs error:", error);
      res.status(500).json({ message: "Error fetching connector logs" });
    }
  });
  app2.get("/api/admin/connectors/logs", requireAdminAuth, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 50;
      const logs = await storage.getConnectorToggleLogs(limit);
      res.json(logs);
    } catch (error) {
      console.error("Get connector logs error:", error);
      res.status(500).json({ message: "Error fetching connector logs" });
    }
  });
  app2.get("/api/admin/connectors/status", requireAdminAuth, async (_req, res) => {
    try {
      const connectorNames = [
        "stripe",
        "resend",
        "notion",
        "google-sheets",
        "google-analytics",
        "thesys",
        "typeform",
        "youtube",
        "calendly",
        "github",
        "linkedin",
        "gmail",
        "fathom"
      ];
      const statuses = {};
      const envKeyMap = {
        stripe: "STRIPE_SECRET_KEY",
        resend: "RESEND_API_KEY",
        notion: "NOTION_API_KEY",
        "google-sheets": "GOOGLE_SHEETS_API_KEY",
        "google-analytics": "GA4_PROPERTY_ID",
        thesys: "THESYS_API_KEY",
        typeform: "TYPEFORM_WEBHOOK_SECRET",
        youtube: "YOUTUBE_API_KEY",
        calendly: "CALENDLY_API_TOKEN",
        github: "GITHUB_TOKEN",
        linkedin: "LINKEDIN_CLIENT_ID",
        gmail: "GMAIL_OAUTH_TOKEN",
        fathom: "FATHOM_CLIENT_ID"
      };
      for (const name of connectorNames) {
        const enabled = await storage.isConnectorEnabled(name);
        const envKey = envKeyMap[name];
        const hasEnvKey = envKey ? !!process.env[envKey] : false;
        statuses[name] = { enabled, hasEnvKey };
      }
      res.json(statuses);
    } catch (error) {
      console.error("Get connector status error:", error);
      res.status(500).json({ message: "Error fetching connector status" });
    }
  });
  const VALID_CONNECTOR_NAMES = [
    "stripe",
    "resend",
    "notion",
    "google-sheets",
    "google-analytics",
    "thesys",
    "typeform",
    "youtube",
    "calendly",
    "github",
    "linkedin",
    "gmail",
    "fathom"
  ];
  app2.put("/api/admin/connectors/:name", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { name } = req.params;
      if (!VALID_CONNECTOR_NAMES.includes(name)) {
        return res.status(400).json({ message: `Unknown connector: ${name}` });
      }
      const { enabled } = req.body;
      if (typeof enabled !== "string" || !["true", "false"].includes(enabled)) {
        return res.status(400).json({ message: "enabled must be 'true' or 'false'" });
      }
      const previous = await storage.isConnectorEnabled(name);
      const state = await storage.upsertConnectorState(name, enabled);
      const action = enabled === "true" ? "enabled" : "disabled";
      await storage.createConnectorToggleLog({
        connectorName: name,
        action,
        previousEnabled: previous ? "true" : "false",
        newEnabled: enabled,
        triggeredBy: "individual",
        performedBy: "admin"
      });
      res.json(state);
    } catch (error) {
      console.error("Update connector state error:", error);
      res.status(500).json({ message: "Error updating connector state" });
    }
  });
  app2.post("/api/admin/connectors/kill-switch", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { enabled } = req.body;
      if (typeof enabled !== "string" || !["true", "false"].includes(enabled)) {
        return res.status(400).json({ message: "enabled must be 'true' or 'false'" });
      }
      const action = enabled === "true" ? "enabled" : "disabled";
      const results = {};
      for (const name of VALID_CONNECTOR_NAMES) {
        const previous = await storage.isConnectorEnabled(name);
        const state = await storage.upsertConnectorState(name, enabled);
        await storage.createConnectorToggleLog({
          connectorName: name,
          action,
          previousEnabled: previous ? "true" : "false",
          newEnabled: enabled,
          triggeredBy: "kill-switch",
          performedBy: "admin"
        });
        results[name] = state;
      }
      res.json({ message: `All connectors ${action}`, results });
    } catch (error) {
      console.error("Kill switch error:", error);
      res.status(500).json({ message: "Error executing kill switch" });
    }
  });
  app2.post("/api/admin/connectors/seed", requireAdminAuth, requireWriteAccess, async (_req, res) => {
    try {
      for (const name of VALID_CONNECTOR_NAMES) {
        const existing = await storage.getConnectorState(name);
        if (!existing) {
          await storage.upsertConnectorState(name, "true");
        }
      }
      res.json({ message: "Default connector states seeded" });
    } catch (error) {
      console.error("Seed connectors error:", error);
      res.status(500).json({ message: "Error seeding connectors" });
    }
  });
  app2.get("/api/admin/connector-status", requireAdminAuth, async (_req, res) => {
    try {
      const result = {};
      for (const name of ["notion", "google-sheets", "stripe", "typeform", "fathom"]) {
        result[name] = await isConnectorEnabled(name);
      }
      result["local-crm"] = true;
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error fetching connector status" });
    }
  });
  app2.get("/api/admin/ai-context-prefs", requireAdminAuth, async (_req, res) => {
    try {
      const raw = await storage.getAdminSetting("ai_context_enabled_sources");
      if (raw) {
        res.json({ enabledSources: JSON.parse(raw) });
      } else {
        res.json({
          enabledSources: {
            "local-crm": true,
            "notion": true,
            "google-sheets": true,
            "stripe": true,
            "fathom": true,
            "typeform": true
          }
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching AI context preferences" });
    }
  });
  app2.post("/api/admin/ai-context-prefs", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { enabledSources } = req.body;
      if (!enabledSources || typeof enabledSources !== "object") {
        return res.status(400).json({ message: "enabledSources object is required" });
      }
      await storage.setAdminSetting("ai_context_enabled_sources", JSON.stringify(enabledSources));
      res.json({ message: "AI context preferences saved", enabledSources });
    } catch (error) {
      res.status(500).json({ message: "Error saving AI context preferences" });
    }
  });
  (async () => {
    try {
      for (const name of VALID_CONNECTOR_NAMES) {
        const existing = await storage.getConnectorState(name);
        if (!existing) {
          await storage.upsertConnectorState(name, "true");
        }
      }
      console.log("\u2705 Connector states initialized");
    } catch (err) {
      console.error("\u26A0\uFE0F Failed to seed connector states:", err);
    }
  })();
  app2.get("/api/admin/testimonials", requireAdminAuth, async (_req, res) => {
    try {
      const all = await storage.getAllTestimonials();
      res.json(all);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });
  app2.post("/api/admin/testimonials", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const parsed = insertTestimonialSchema.parse(req.body);
      const record = await storage.createTestimonial(parsed);
      res.json(record);
    } catch (err) {
      if (err?.issues) return res.status(400).json({ error: "Validation failed", details: err.issues });
      res.status(500).json({ error: "Failed to create testimonial" });
    }
  });
  app2.patch("/api/admin/testimonials/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const parsed = insertTestimonialSchema.partial().parse(req.body);
      const record = await storage.updateTestimonial(req.params.id, parsed);
      if (!record) return res.status(404).json({ error: "Not found" });
      res.json(record);
    } catch (err) {
      if (err?.issues) return res.status(400).json({ error: "Validation failed", details: err.issues });
      res.status(500).json({ error: "Failed to update testimonial" });
    }
  });
  app2.delete("/api/admin/testimonials/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const ok = await storage.deleteTestimonial(req.params.id);
      if (!ok) return res.status(404).json({ error: "Not found" });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete testimonial" });
    }
  });
  app2.get("/api/testimonials", async (_req, res) => {
    try {
      const visible = await storage.getVisibleTestimonials();
      res.json(visible);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });
  app2.post("/api/admin/coaching/send-raw-data-email", requireAdminAuth, async (req, res) => {
    try {
      const { coacheeEmail, coacheeName, rawData } = req.body;
      if (!coacheeEmail || !rawData || typeof rawData !== "object") {
        return res.status(400).json({ error: "coacheeEmail and rawData are required" });
      }
      const sent = await sendCoachingRawDataEmail({ coacheeEmail, coacheeName: coacheeName || null, rawData });
      if (sent) {
        res.json({ success: true, message: `Raw data email sent to ${coacheeEmail}` });
      } else {
        res.status(500).json({ error: "Failed to send raw data email" });
      }
    } catch (err) {
      console.error("Error sending coaching raw data email:", err);
      res.status(500).json({ error: err.message || "Failed to send email" });
    }
  });
  app2.post("/api/admin/coaching/send-doc-link-email", requireAdminAuth, async (req, res) => {
    try {
      const { coacheeEmail, coacheeName, docUrl, reportText } = req.body;
      if (!coacheeEmail || !docUrl) {
        return res.status(400).json({ error: "coacheeEmail and docUrl are required" });
      }
      const sent = await sendCoachingDocLinkEmail({ coacheeEmail, coacheeName: coacheeName || null, docUrl, reportText: reportText || "" });
      if (sent) {
        res.json({ success: true, message: `Doc link email sent to ${coacheeEmail}` });
      } else {
        res.status(500).json({ error: "Failed to send doc link email" });
      }
    } catch (err) {
      console.error("Error sending coaching doc link email:", err);
      res.status(500).json({ error: err.message || "Failed to send email" });
    }
  });
  app2.post("/api/admin/coaching/send-coach-only-email", requireAdminAuth, async (req, res) => {
    try {
      const { coacheeName, rawData, notes } = req.body;
      if (!rawData || typeof rawData !== "object") {
        return res.status(400).json({ error: "rawData is required" });
      }
      const sent = await sendCoachOnlyEmail({ coacheeName: coacheeName || null, rawData, notes });
      if (sent) {
        res.json({ success: true, message: "Coach-only email sent" });
      } else {
        res.status(500).json({ error: "Failed to send coach-only email" });
      }
    } catch (err) {
      console.error("Error sending coach-only email:", err);
      res.status(500).json({ error: err.message || "Failed to send email" });
    }
  });
  app2.post("/api/admin/research/pmf-assumptions", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { targetingCategories, customContext } = req.body;
      if (!targetingCategories || typeof targetingCategories !== "object") {
        return res.status(400).json({ message: "targetingCategories object is required" });
      }
      const aiPrefsRaw = await storage.getAdminSetting("ai_context_enabled_sources");
      const aiContextPrefs = aiPrefsRaw ? JSON.parse(aiPrefsRaw) : { "local-crm": true, "notion": true, "google-sheets": true, "stripe": true, "fathom": true, "typeform": true };
      let enrichedContext = customContext || "";
      if (aiContextPrefs["notion"] !== false) {
        try {
          const { getPipelineOSTasks: getPipelineOSTasks2 } = await Promise.resolve().then(() => (init_notionSync(), notionSync_exports));
          const tasks = await getPipelineOSTasks2();
          if (tasks) enrichedContext += `

Pipeline OS context:
${tasks}`;
        } catch (_e) {
        }
      }
      if (aiContextPrefs["local-crm"] !== false) {
        try {
          const contacts2 = await storage.getAllContacts();
          const sources = contacts2.reduce((acc, c) => {
            acc[c.source || "unknown"] = (acc[c.source || "unknown"] || 0) + 1;
            return acc;
          }, {});
          enrichedContext += `

CRM context: ${contacts2.length} total contacts. Sources: ${JSON.stringify(sources)}`;
        } catch (_e) {
        }
      }
      const { generatePMFAssumptions: generatePMFAssumptions2 } = await Promise.resolve().then(() => (init_thesysApi(), thesysApi_exports));
      const result = await generatePMFAssumptions2(targetingCategories, enrichedContext);
      res.json(result);
    } catch (error) {
      console.error("PMF assumptions generation error:", error);
      res.status(500).json({ message: "Error generating PMF assumptions", error: error.message });
    }
  });
  app2.post("/api/admin/research/lead-list", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { calibration, filters } = req.body;
      if (!calibration || !calibration.why || !calibration.what) {
        return res.status(400).json({ message: "calibration (why, what, how) is required" });
      }
      const aiPrefsRaw = await storage.getAdminSetting("ai_context_enabled_sources");
      const aiContextPrefs = aiPrefsRaw ? JSON.parse(aiPrefsRaw) : { "local-crm": true, "notion": true, "google-sheets": true, "stripe": true, "fathom": true, "typeform": true };
      const enrichedFilters = { ...filters };
      if (aiContextPrefs["local-crm"] !== false) {
        try {
          const contacts2 = await storage.getAllContacts();
          enrichedFilters._crmContext = `${contacts2.length} existing contacts in CRM`;
        } catch (_e) {
        }
      }
      const { generateLeadListSuggestions: generateLeadListSuggestions2 } = await Promise.resolve().then(() => (init_thesysApi(), thesysApi_exports));
      const result = await generateLeadListSuggestions2(calibration, enrichedFilters);
      res.json(result);
    } catch (error) {
      console.error("Lead list generation error:", error);
      res.status(500).json({ message: "Error generating lead list", error: error.message });
    }
  });
  app2.post("/api/admin/research/export-sheets", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { leads } = req.body;
      if (!Array.isArray(leads) || leads.length === 0) {
        return res.status(400).json({ message: "leads array is required" });
      }
      const { getUncachableGoogleSheetClient: getUncachableGoogleSheetClient2 } = await Promise.resolve().then(() => (init_googleSheets(), googleSheets_exports));
      const sheets = await getUncachableGoogleSheetClient2();
      const spreadsheet = await sheets.spreadsheets.create({
        requestBody: {
          properties: { title: `GreenElephant Lead List \u2014 ${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}` },
          sheets: [{ properties: { title: "Leads" } }]
        }
      });
      const spreadsheetId = spreadsheet.data.spreadsheetId;
      const headers = ["Name", "Email", "LinkedIn Profile", "Company", "Title", "Source", "Fit Score"];
      const rows = leads.map((l) => [l.name, l.email, l.linkedinProfile, l.company, l.title, l.source, l.fitScore]);
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "Leads!A1",
        valueInputOption: "RAW",
        requestBody: { values: [headers, ...rows] }
      });
      res.json({ message: `Lead list exported to Google Sheets`, spreadsheetId, url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}` });
    } catch (error) {
      console.error("Google Sheets export error:", error);
      res.status(500).json({ message: "Error exporting to Google Sheets", error: error.message });
    }
  });
  app2.post("/api/admin/research/sync-notion", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { assumptions } = req.body;
      if (!Array.isArray(assumptions) || assumptions.length === 0) {
        return res.status(400).json({ message: "assumptions array is required" });
      }
      const { getNotionClient: getNotionClient2 } = await Promise.resolve().then(() => (init_notionClient(), notionClient_exports));
      const notion = await getNotionClient2();
      const searchRes = await notion.search({
        query: "PMF Assumptions",
        filter: { property: "object", value: "database" }
      });
      if (searchRes.results.length === 0) {
        return res.status(400).json({
          message: "No 'PMF Assumptions' database found in Notion. Create a database named 'PMF Assumptions' with a 'Name' title property, then retry."
        });
      }
      const dbId = searchRes.results[0].id;
      let syncCount = 0;
      for (const assumption of assumptions) {
        try {
          const filtersText = assumption.filters ? Object.entries(assumption.filters).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(", ") : "None";
          await notion.pages.create({
            parent: { database_id: dbId },
            properties: {
              "Name": { title: [{ text: { content: `${assumption.id}: ${assumption.hypothesis}` } }] }
            },
            children: [
              {
                object: "block",
                type: "heading_2",
                heading_2: {
                  rich_text: [{ type: "text", text: { content: "Assumption Details" } }]
                }
              },
              {
                object: "block",
                type: "paragraph",
                paragraph: {
                  rich_text: [{ type: "text", text: { content: `Confidence: ${assumption.confidence || "N/A"}
Test Method: ${assumption.testMethod || "N/A"}
Timestamp: ${assumption.timestamp || (/* @__PURE__ */ new Date()).toISOString()}
Filters: ${filtersText}` } }]
                }
              },
              {
                object: "block",
                type: "heading_3",
                heading_3: {
                  rich_text: [{ type: "text", text: { content: "Hypothesis" } }]
                }
              },
              {
                object: "block",
                type: "paragraph",
                paragraph: {
                  rich_text: [{ type: "text", text: { content: assumption.hypothesis || "" } }]
                }
              }
            ]
          });
          syncCount++;
        } catch (e) {
          console.warn(`Notion sync for ${assumption.id} failed:`, e.message);
        }
      }
      res.json({ message: `${syncCount} assumptions synced to Notion`, synced: syncCount });
    } catch (error) {
      console.error("Notion sync error:", error);
      res.status(500).json({ message: "Error syncing to Notion", error: error.message });
    }
  });
  app2.post("/api/admin/research/gmail-sync-notion", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { threads } = req.body;
      if (!Array.isArray(threads) || threads.length === 0) {
        return res.status(400).json({ message: "threads array is required" });
      }
      const { getNotionClient: getNotionClient2 } = await Promise.resolve().then(() => (init_notionClient(), notionClient_exports));
      const notion = await getNotionClient2();
      const searchRes = await notion.search({
        query: "Email Chains",
        filter: { property: "object", value: "database" }
      });
      if (searchRes.results.length === 0) {
        return res.status(400).json({
          message: "No 'Email Chains' database found in Notion. Create a database named 'Email Chains' with a 'Name' title property, then retry."
        });
      }
      const dbId = searchRes.results[0].id;
      let syncCount = 0;
      for (const thread of threads) {
        try {
          const participants = /* @__PURE__ */ new Set();
          if (thread.from) participants.add(thread.from);
          if (thread.to) participants.add(thread.to);
          (thread.messages || []).forEach((m) => {
            if (m.from) participants.add(m.from);
            if (m.to) participants.add(m.to);
          });
          const threadBody = (thread.messages || []).map((m) => `[${m.date}] ${m.from} \u2192 ${m.to}
${m.body || m.snippet || ""}`).join("\n---\n");
          const contentBlocks = [
            {
              object: "block",
              type: "heading_2",
              heading_2: {
                rich_text: [{ type: "text", text: { content: "Thread Details" } }]
              }
            },
            {
              object: "block",
              type: "paragraph",
              paragraph: {
                rich_text: [{ type: "text", text: { content: `From: ${thread.from || "Unknown"}
To: ${thread.to || "Unknown"}
Date: ${thread.date || "Unknown"}
Messages: ${(thread.messages || []).length}
Participants: ${Array.from(participants).join(", ")}` } }]
              }
            },
            {
              object: "block",
              type: "heading_3",
              heading_3: {
                rich_text: [{ type: "text", text: { content: "Email Chain" } }]
              }
            },
            {
              object: "block",
              type: "paragraph",
              paragraph: {
                rich_text: [{ type: "text", text: { content: threadBody.slice(0, 1900) } }]
              }
            }
          ];
          await notion.pages.create({
            parent: { database_id: dbId },
            properties: {
              "Name": { title: [{ text: { content: thread.subject || "(No subject)" } }] }
            },
            children: contentBlocks
          });
          syncCount++;
        } catch (e) {
          console.warn(`Notion sync for thread ${thread.threadId} failed:`, e.message);
        }
      }
      res.json({ message: `${syncCount} email threads synced to Notion`, synced: syncCount });
    } catch (error) {
      console.error("Gmail Notion sync error:", error);
      res.status(500).json({ message: "Error syncing email threads to Notion", error: error.message });
    }
  });
  app2.post("/api/admin/research/gmail-harvest", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { query, maxResults } = req.body;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "query string is required" });
      }
      const { harvestEmailChains: harvestEmailChains2 } = await Promise.resolve().then(() => (init_gmailClient(), gmailClient_exports));
      const threads = await harvestEmailChains2(query, maxResults || 15);
      res.json({ threads });
    } catch (error) {
      console.error("Gmail harvest error:", error);
      res.status(500).json({ message: "Error harvesting Gmail", error: error.message });
    }
  });
  app2.post("/api/portal/timeline", async (req, res) => {
    if (!req.session || !req.session.clientUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const { z: z2 } = await import("zod");
      const schema = z2.object({
        type: z2.string().min(1).max(50),
        title: z2.string().min(1).max(200),
        description: z2.string().max(1e3).optional(),
        details: z2.string().max(5e3).optional(),
        lens: z2.string().max(50).optional(),
        toolId: z2.string().max(50).optional()
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request", errors: parsed.error.flatten().fieldErrors });
      }
      const event = await storage.createPortalTimelineEvent({
        ...parsed.data,
        userId: req.session.clientUserId,
        date: /* @__PURE__ */ new Date()
      });
      res.json(event);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Timeline save error:", errMsg);
      res.status(500).json({ message: "Failed to save timeline event" });
    }
  });
  app2.get("/api/portal/timeline", async (req, res) => {
    if (!req.session || !req.session.clientUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const events = await storage.getPortalTimelineEvents(req.session.clientUserId);
      res.json(events);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Timeline fetch error:", errMsg);
      res.status(500).json({ message: "Failed to fetch timeline events" });
    }
  });
  app2.post("/api/portal/nudge-dev", async (req, res) => {
    if (!req.session || !req.session.clientUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const context = typeof req.body?.context === "string" ? req.body.context.slice(0, 500) : "No context provided";
      const userId = req.session.clientUserId;
      console.log(`[Nudge Dev] User ${userId}: ${context}`);
      const { sendNudgeDevNotification: sendNudgeDevNotification2 } = await Promise.resolve().then(() => (init_email_notifications(), email_notifications_exports));
      sendNudgeDevNotification2(userId, context).catch(
        (err) => console.error("[Nudge Dev] Email send failed:", err)
      );
      res.json({ success: true, message: "Dev team notified" });
    } catch (error) {
      res.status(500).json({ message: "Failed to send nudge" });
    }
  });
  app2.delete("/api/portal/timeline/:id", async (req, res) => {
    if (!req.session || !req.session.clientUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const deleted = await storage.deletePortalTimelineEvent(req.params.id, req.session.clientUserId);
      if (!deleted) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json({ success: true });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Timeline delete error:", errMsg);
      res.status(500).json({ message: "Failed to delete timeline event" });
    }
  });
  app2.delete("/api/portal/timeline", async (req, res) => {
    if (!req.session || !req.session.clientUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const userId = req.session.clientUserId;
      const [timelineCount, contextCount] = await Promise.all([
        storage.deleteAllPortalTimelineEvents(userId),
        storage.deleteAllPortalUserContext(userId)
      ]);
      res.json({ success: true, deleted: timelineCount, contextDeleted: contextCount });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Data delete-all error:", errMsg);
      res.status(500).json({ message: "Failed to delete data" });
    }
  });
  app2.get("/api/portal/data-export", async (req, res) => {
    if (!req.session || !req.session.clientUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const userId = req.session.clientUserId;
      const [timeline, context] = await Promise.all([
        storage.getPortalTimelineEvents(userId),
        storage.getPortalUserContext(userId)
      ]);
      const contextMap = {};
      context.forEach((c) => {
        contextMap[c.key] = c.value;
      });
      res.json({
        exportDate: (/* @__PURE__ */ new Date()).toISOString(),
        userId,
        timeline,
        context: contextMap
      });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Data export error:", errMsg);
      res.status(500).json({ message: "Failed to export data" });
    }
  });
  app2.post("/api/portal/data-export/email", async (req, res) => {
    if (!req.session || !req.session.clientUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const userId = req.session.clientUserId;
      const user = await storage.getClientUser(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      const [timeline, context] = await Promise.all([
        storage.getPortalTimelineEvents(userId),
        storage.getPortalUserContext(userId)
      ]);
      const contextMap = {};
      context.forEach((c) => {
        contextMap[c.key] = c.value;
      });
      const sent = await sendPortalDataExportEmail(user.email, user.name, { timeline, context: contextMap });
      if (sent) {
        res.json({ message: "Export email sent" });
      } else {
        res.status(500).json({ message: "Failed to send export email. Email service may not be configured." });
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Email export error:", errMsg);
      res.status(500).json({ message: "Failed to send export email" });
    }
  });
  app2.get("/api/portal/context", async (req, res) => {
    if (!req.session || !req.session.clientUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const ctx = await storage.getPortalUserContext(req.session.clientUserId);
      const result = {};
      ctx.forEach((c) => {
        result[c.key] = c.value;
      });
      res.json(result);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Portal context fetch error:", errMsg);
      res.status(500).json({ message: "Failed to fetch context" });
    }
  });
  app2.post("/api/portal/context", async (req, res) => {
    if (!req.session || !req.session.clientUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const { z: z2 } = await import("zod");
      const schema = z2.object({
        key: z2.string().min(1).max(100),
        value: z2.string().max(5e3)
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request" });
      }
      const result = await storage.setPortalUserContext(
        req.session.clientUserId,
        parsed.data.key,
        parsed.data.value
      );
      res.json(result);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Portal context save error:", errMsg);
      res.status(500).json({ message: "Failed to save context" });
    }
  });
  app2.post("/api/portal/ai", async (req, res) => {
    if (!req.session || !req.session.clientUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const { z: z2 } = await import("zod");
      const schema = z2.object({
        tool: z2.enum(["debrief", "reflection", "microhabits", "prepare", "flowcheck"]),
        userMessage: z2.string().min(1).max(5e3),
        context: z2.string().max(2e3).optional()
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request", errors: parsed.error.flatten().fieldErrors });
      }
      const { tool, userMessage, context } = parsed.data;
      const enabledCtx = await storage.getPortalUserContextByKey(req.session.clientUserId, "enabled_tools");
      if (enabledCtx) {
        if (enabledCtx.value === "") {
          return res.status(403).json({ message: `All tools are disabled. Enable tools in Settings > Data Privacy.` });
        }
        const enabled = enabledCtx.value.split(",");
        if (!enabled.includes(tool)) {
          return res.status(403).json({ message: `Tool "${tool}" is disabled. Enable it in Settings > Data Privacy.` });
        }
      }
      const aiModelSetting = await storage.getAdminSetting("ai_active_model");
      const activeModel = aiModelSetting || "thesys";
      let aiChatFn;
      if (activeModel === "thesys" || activeModel === "chatgpt" || activeModel === "gemini") {
        const { portalAiChat: portalAiChat2 } = await Promise.resolve().then(() => (init_thesysApi(), thesysApi_exports));
        aiChatFn = portalAiChat2;
      } else {
        const { portalAiChat: portalAiChat2 } = await Promise.resolve().then(() => (init_thesysApi(), thesysApi_exports));
        aiChatFn = portalAiChat2;
      }
      const userCtx = await storage.getPortalUserContext(req.session.clientUserId);
      const ctxMap = {};
      userCtx.forEach((c) => {
        ctxMap[c.key] = c.value;
      });
      const recentEvents = await storage.getPortalTimelineEvents(req.session.clientUserId);
      const timelineSummary = recentEvents.slice(0, 10).map(
        (e) => `[${new Date(e.date).toLocaleDateString("en-GB")}] ${e.title}${e.lens ? ` (${e.lens})` : ""}${e.description ? `: ${e.description}` : ""}`
      ).join("\n");
      const userContextBlock = Object.keys(ctxMap).length > 0 ? `

User profile context:
${Object.entries(ctxMap).map(([k, v]) => `- ${k}: ${v}`).join("\n")}` : "";
      const timelineBlock = timelineSummary ? `

Recent timeline (most recent first):
${timelineSummary}` : "";
      const PORTAL_SYSTEM_PROMPTS = {
        debrief: `You are a conscious communication coach for GreenElephant.org. The user wants to debrief a recent conversation or interaction.

Analyse their description through the GBR framework:
- GREEN = Other-focused (empathy, naming feelings/needs, trust-building)
- BLUE = Self-focused (informing, sharing knowledge/opinions/ideas)
- RED = Shared-focused (influencing, uniting, proposing agreements)

Also consider which of the 8 lenses are most relevant:
1. Influence 2. Attitude 3. Chaordic 4. Flow 5. Alignment 6. Needs 7. Ego 8. Dynamics

Respond with:
1. A brief summary of what happened (2-3 sentences)
2. GBR Breakdown: Which color dominated? What was missing?
3. Key Pattern: What communication pattern do you notice?
4. One Micro-Shift: A small, practical change they could try next time
5. Relevant Lens: Which lens(es) this touches and why

Keep your tone warm, grounded, and non-judgmental. Be specific, not generic.${userContextBlock}${timelineBlock}`,
        reflection: `You are a conscious communication coach for GreenElephant.org. The user wants a deeper reflection on their communication patterns through a specific lens.

The 8 lenses of the Periodic Table of Conscious Communication:
1. Influence (#cc3333) - How you exert influence with integrity
2. Attitude (#ff9933) - Your stance toward change and growth
3. Chaordic (#ffcc00) - Order in creative chaos
4. Flow (#cccc33) - Sensing flow in conversations
5. Alignment (#669966) - Building empathy and shared understanding
6. Needs (#009999) - Honoring your energy and core needs
7. Ego (#3399cc) - Recognizing and loosening ego patterns
8. Dynamics (#663399) - Understanding relationship dynamics

Provide a thoughtful reflection that includes:
1. What their description reveals about their patterns in this lens
2. A strength they're showing (be specific, not flattery)
3. A blind spot or growth edge worth exploring
4. 2-3 reflective questions they can sit with
5. A practical experiment to try this week

Be warm, specific, and grounded. Never preachy.${userContextBlock}${timelineBlock}`,
        microhabits: `You are a conscious communication coach for GreenElephant.org. Generate a practical micro-habit based on the user's chosen lens.

The 8 lenses: Influence, Attitude, Chaordic, Flow, Alignment, Needs, Ego, Dynamics.

Create ONE specific micro-habit that:
1. Takes 2-5 minutes per day
2. Can be done in any conversation
3. Is concrete and observable (not vague like "be more mindful")
4. Connects to the chosen lens
5. Has a clear trigger (when to do it) and action (what to do)
6. If the user shared a core value, connect the habit to that value

Format your response as:
HABIT: [Name of the habit - 3-5 words]
LENS: [Which lens]
VALUE: [Core value this serves, if provided]
TRIGGER: [When to do it - be specific]
ACTION: [What to do - step by step]
WHY IT WORKS: [1-2 sentences connecting it to the lens and value]
DURATION: [How long to practice - suggest 7 or 14 days]
TRACKING: [How to know if they did it - simple yes/no check]${userContextBlock}${timelineBlock}`,
        prepare: `You are a conscious communication coach for GreenElephant.org. The user wants to prepare for an upcoming conversation, meeting, or event.

Analyse their situation through all 8 lenses and the GBR framework:
- GREEN = Other-focused (empathy, naming feelings/needs, trust-building)
- BLUE = Self-focused (informing, sharing knowledge/opinions/ideas)  
- RED = Shared-focused (influencing, uniting, proposing agreements)

Provide preparation notes that include:
1. SITUATION READ: What dynamics are likely at play? (2-3 sentences)
2. YOUR COMMUNICATION GOAL: What would "success" look like communicatively?
3. GBR STRATEGY: Which color should lead? When to shift?
4. KEY PHRASES: 3-4 specific sentences/phrases they could use
5. WATCH OUT FOR: Ego triggers or patterns to be aware of
6. OPENING LINE: A strong, conscious way to begin the conversation
7. IF IT GOES SIDEWAYS: A recovery phrase or technique

Be practical, specific, and actionable. No generic advice.

CRITICAL FORMAT INSTRUCTIONS: Return your response as plain readable text only. Use clear section headers with ALL CAPS followed by a colon (e.g. "SITUATION READ:"). Use bullet points with dashes for lists. Use quotation marks for suggested phrases. Do NOT use any XML, HTML, JSX, component names, or structured markup. Do NOT output tags like Card, Header, MiniCard, DataTile, Icon, SectionBlock, TextContent, CalloutV2, ButtonGroup, or any similar component/element names. Just write natural, readable text that a human can scan quickly.${userContextBlock}${timelineBlock}`,
        flowcheck: `You are a conscious communication coach for GreenElephant.org. The user completed a Flow Check with three slider scores (Motivation, Challenge, Competence each on a 1-10 scale) and landed in a specific zone.

Analyse their scores and provide:
1. ZONE INSIGHT: What this combination tells you about their current state (2-3 sentences)
2. PATTERN: If their recent timeline shows repeated checks, note any trends
3. RECOMMENDATION: One specific, actionable step to improve their flow state
4. LENS CONNECTION: Which of the 8 lenses is most relevant right now and why
5. QUESTION: One reflective question to sit with

Be warm, practical, and specific.${userContextBlock}${timelineBlock}`
      };
      const systemPrompt = PORTAL_SYSTEM_PROMPTS[tool] || PORTAL_SYSTEM_PROMPTS.debrief;
      const fullMessage = context ? `${userMessage}

Additional context: ${context}` : userMessage;
      const result = await aiChatFn(systemPrompt, fullMessage);
      res.json({ result, model: activeModel });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Portal AI error:", errMsg);
      if (errMsg.includes("unavailable") || errMsg.includes("disabled")) {
        return res.status(503).json({ message: errMsg });
      }
      res.status(500).json({ message: "AI processing failed. Please try again." });
    }
  });
  app2.post("/api/admin/journey-ai", requireAdminAuth, async (req, res) => {
    try {
      const { stage, question } = req.body;
      if (!stage || typeof stage !== "string" || !question || typeof question !== "string") {
        return res.status(400).json({ message: "Missing or invalid stage/question" });
      }
      if (question.length > 1e3) {
        return res.status(400).json({ message: "Question too long (max 1000 characters)" });
      }
      const [
        contacts2,
        scanPurchases,
        purchases2,
        newsletterSubs,
        webinarSignups,
        flowChecks,
        quizResults,
        contactMessages2,
        waitlist,
        emailLogs
      ] = await Promise.all([
        storage.getAllContacts(),
        storage.getAllSatellitescanPurchases(),
        storage.getAllPurchases(),
        storage.getAllNewsletterSubscriptions(),
        storage.getAllWebinarWaitlistEntries(),
        storage.getAllFlowCheckResults(),
        storage.getAllSignalsQuizResults(),
        storage.getAllContactMessages(),
        storage.getAllWaitlistEntries(),
        storage.getAllOnboardingEmailLogs()
      ]);
      const aiPrefsRaw = await storage.getAdminSetting("ai_context_enabled_sources");
      const aiContextPrefs = aiPrefsRaw ? JSON.parse(aiPrefsRaw) : { "local-crm": true, "notion": true, "google-sheets": true, "stripe": true, "fathom": true, "typeform": true };
      const connectorStatus = {};
      for (const name of ["notion", "google-sheets", "stripe", "typeform"]) {
        connectorStatus[name] = await isConnectorEnabled(name) && aiContextPrefs[name] !== false;
      }
      let notionContactCount = null;
      let notionPipelineData = null;
      if (connectorStatus["notion"]) {
        const notionSyncedContacts = contacts2.filter((c) => c.notionSyncedAt);
        notionContactCount = notionSyncedContacts.length;
        try {
          const { getPipelineOSTasks: getPipelineOSTasks2 } = await Promise.resolve().then(() => (init_notionSync(), notionSync_exports));
          notionPipelineData = await getPipelineOSTasks2();
        } catch (err) {
          console.warn("Notion Pipeline OS fetch for AI context failed:", err.message);
        }
      }
      let googleSheetsData = null;
      if (connectorStatus["google-sheets"]) {
        try {
          const { getSheetData: getSheetData2 } = await Promise.resolve().then(() => (init_googleSheets(), googleSheets_exports));
          const sheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
          if (sheetId) {
            const rows = await getSheetData2(sheetId, "Sheet1!A1:Z10");
            googleSheetsData = `Google Sheets rows (first 10): ${JSON.stringify(rows).slice(0, 1e3)}`;
          }
        } catch (err) {
          console.warn("Google Sheets fetch for AI context failed:", err.message);
        }
      }
      const totalStripeRevenue = scanPurchases.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0) + purchases2.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
      let stripeRevenueNote = null;
      if (connectorStatus["stripe"] && stripe) {
        stripeRevenueNote = `Total recorded Stripe revenue: \u20AC${totalStripeRevenue.toFixed(2)} from ${scanPurchases.length + purchases2.length} transactions`;
      }
      let typeformNote = null;
      if (connectorStatus["typeform"]) {
        const completed = scanPurchases.filter((p) => p.typeformCompleted === "true").length;
        const rate = scanPurchases.length > 0 ? Math.round(completed / scanPurchases.length * 100) : 0;
        typeformNote = `Typeform completion: ${completed}/${scanPurchases.length} (${rate}%).`;
        if (process.env.TYPEFORM_PERSONAL_ACCESS_TOKEN && process.env.TYPEFORM_FORM_ID) {
          try {
            const { getTypeformFormStats: getTypeformFormStats2 } = await Promise.resolve().then(() => (init_typeformClient(), typeformClient_exports));
            const stats = await getTypeformFormStats2(process.env.TYPEFORM_FORM_ID);
            typeformNote += ` API: ${stats.totalResponses} total responses, completion rate: ${stats.completionRate ?? "unknown"}%.`;
          } catch (err) {
            console.warn("Typeform API enrichment for AI context failed:", err.message);
          }
        } else {
          typeformNote += " Set TYPEFORM_PERSONAL_ACCESS_TOKEN and TYPEFORM_FORM_ID in Secrets to enable API-sourced analytics.";
        }
      }
      const stageContextMap = {
        AWARENESS: {
          totalContacts: contacts2.length,
          recentContacts: contacts2.filter((c) => {
            const d = new Date(c.createdAt);
            return d >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3);
          }).length,
          sources: contacts2.reduce((acc, c) => {
            acc[c.source || "unknown"] = (acc[c.source || "unknown"] || 0) + 1;
            return acc;
          }, {}),
          notionSyncedContacts: notionContactCount
        },
        INTEREST: {
          quizCompletions: quizResults.length,
          flowChecks: flowChecks.length,
          recentQuiz30d: quizResults.filter((q) => new Date(q.createdAt) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3)).length
        },
        ENGAGEMENT: {
          newsletterSignups: newsletterSubs.length,
          webinarSignups: webinarSignups.length,
          contactMessages: contactMessages2.length,
          waitlistEntries: waitlist.length
        },
        PURCHASE: {
          scanPurchases: scanPurchases.length,
          otherPurchases: purchases2.length,
          totalRevenue: scanPurchases.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0) + purchases2.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0),
          recentPurchases30d: [...scanPurchases, ...purchases2].filter((p) => new Date(p.createdAt) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3)).length,
          stripeNote: stripeRevenueNote
        },
        ONBOARDING: {
          totalScanPurchases: scanPurchases.length,
          typeformCompleted: scanPurchases.filter((p) => p.typeformCompleted === "true").length,
          typeformRate: scanPurchases.length > 0 ? Math.round(scanPurchases.filter((p) => p.typeformCompleted === "true").length / scanPurchases.length * 100) : 0,
          onboardingEmailsSent: emailLogs.filter((l) => l.status === "sent").length,
          remindersTriggered: scanPurchases.filter((p) => parseInt(p.remindersCount || "0") > 0).length,
          notionSynced: contacts2.filter((c) => c.notionSyncedAt).length,
          typeformNote
        },
        USE: {
          flowChecks: flowChecks.length,
          uniqueFlowUsers: new Set(flowChecks.map((fc) => fc.contactId || fc.id)).size,
          repeatFlowUsers: (() => {
            const map = /* @__PURE__ */ new Map();
            flowChecks.forEach((fc) => {
              const k = fc.contactId || fc.id;
              if (k) map.set(k, (map.get(k) || 0) + 1);
            });
            return Array.from(map.values()).filter((c) => c > 1).length;
          })()
        },
        "USE MORE": {
          contactsWith3PlusChannels: contacts2.filter((c) => (c.channelsReached || []).length >= 3).length,
          totalContacts: contacts2.length
        },
        ADVOCACY: {
          referralMentions: contactMessages2.filter((m) => {
            const t = (m.message || "").toLowerCase();
            return t.includes("recommend") || t.includes("referred") || t.includes("colleague");
          }).length,
          referralWaitlist: waitlist.filter((w) => {
            const t = (w.motivation || "").toLowerCase();
            return t.includes("referral") || t.includes("recommend") || t.includes("colleague");
          }).length
        }
      };
      const stageData = stageContextMap[stage.toUpperCase()] || stageContextMap[stage] || {};
      const connectedSystems = Object.entries(connectorStatus).filter(([, enabled]) => enabled).map(([name]) => name);
      const enrichedStageData = {
        ...stageData,
        connectedSystems,
        dataSourceInfo: `Data aggregated from: internal database${connectedSystems.length > 0 ? `, ${connectedSystems.join(", ")}` : ""}`,
        ...notionPipelineData && { notionPipelineContext: notionPipelineData },
        ...googleSheetsData && { googleSheetsContext: googleSheetsData },
        ...stripeRevenueNote && { stripeContext: stripeRevenueNote },
        ...typeformNote && { typeformContext: typeformNote }
      };
      const { generateJourneyAIResponse: generateJourneyAIResponse2 } = await Promise.resolve().then(() => (init_thesysApi(), thesysApi_exports));
      const answer = await generateJourneyAIResponse2(stage, enrichedStageData, question);
      res.json({ answer });
    } catch (error) {
      console.error("Journey AI error:", error);
      if (error.message?.includes("disabled")) {
        return res.status(503).json({ message: "Thesys AI connector is disabled. Enable it in Admin > Connected Tools." });
      }
      res.status(500).json({ message: error.message || "AI query failed" });
    }
  });
  app2.get("/qr/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const qrCode = await storage.getQrCodeBySlug(slug);
      if (!qrCode || qrCode.isActive !== "true") {
        return res.redirect("/portal/login");
      }
      const rawIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
      const userAgent = req.headers["user-agent"] || "";
      const referer = req.headers["referer"] || "";
      const { createHash } = await import("crypto");
      const ipHash = rawIp && rawIp !== "unknown" ? createHash("sha256").update(rawIp + "ge-qr-salt-2026").digest("hex").slice(0, 16) : "unknown";
      let deviceType = "desktop";
      if (/mobile|android|iphone|ipad/i.test(userAgent)) deviceType = "mobile";
      else if (/tablet|ipad/i.test(userAgent)) deviceType = "tablet";
      let geoData = {};
      try {
        if (rawIp && rawIp !== "unknown" && rawIp !== "127.0.0.1" && rawIp !== "::1") {
          const geoRes = await fetch(`http://ip-api.com/json/${rawIp}?fields=status,country,regionName`);
          const geo = await geoRes.json();
          if (geo.status === "success") {
            geoData = {
              country: geo.country || null,
              region: geo.regionName || null
            };
          }
        }
      } catch (geoErr) {
        console.error("QR geo lookup error:", geoErr);
      }
      await storage.createQrScan({
        qrCodeId: qrCode.id,
        ipAddress: ipHash,
        userAgent: userAgent.slice(0, 200),
        referer: referer.slice(0, 500),
        deviceType,
        ...geoData
      });
      res.redirect(qrCode.targetUrl);
    } catch (error) {
      console.error("QR redirect error:", error);
      res.redirect("/portal/login");
    }
  });
  app2.get("/api/admin/qr-codes", requireAdminAuth, async (_req, res) => {
    try {
      const codes = await storage.getAllQrCodes();
      const codesWithCounts = await Promise.all(
        codes.map(async (code) => {
          const scanCount = await storage.getQrScanCount(code.id);
          return { ...code, scanCount };
        })
      );
      res.json(codesWithCounts);
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch QR codes" });
    }
  });
  app2.post("/api/admin/qr-codes", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { name, slug, targetUrl, type, description } = req.body;
      if (!name || !slug || !targetUrl) {
        return res.status(400).json({ message: "Name, slug, and target URL are required" });
      }
      const normalizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "");
      if (!normalizedSlug || normalizedSlug.length < 2) {
        return res.status(400).json({ message: "Slug must be at least 2 characters (letters, numbers, hyphens)" });
      }
      const isInternalPath = targetUrl.startsWith("/");
      const isGreenElephantUrl = targetUrl.startsWith("https://greenelephant.org") || targetUrl.startsWith("https://www.greenelephant.org");
      if (!isInternalPath && !isGreenElephantUrl) {
        return res.status(400).json({ message: "Target URL must be an internal path (e.g. /portal/login) or a greenelephant.org URL" });
      }
      const existing = await storage.getQrCodeBySlug(normalizedSlug);
      if (existing) {
        return res.status(409).json({ message: "A QR code with this slug already exists" });
      }
      const created = await storage.createQrCode({
        name: name.slice(0, 200),
        slug: normalizedSlug,
        targetUrl,
        type: type || "campaign",
        description: description ? description.slice(0, 500) : null,
        isActive: "true"
      });
      res.json(created);
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to create QR code" });
    }
  });
  app2.patch("/api/admin/qr-codes/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, targetUrl, description, isActive } = req.body;
      const safeUpdates = {};
      if (name !== void 0) safeUpdates.name = String(name).slice(0, 200);
      if (description !== void 0) safeUpdates.description = description ? String(description).slice(0, 500) : null;
      if (isActive !== void 0) safeUpdates.isActive = isActive === "true" ? "true" : "false";
      if (targetUrl !== void 0) {
        const isInternalPath = targetUrl.startsWith("/");
        const isGreenElephantUrl = targetUrl.startsWith("https://greenelephant.org") || targetUrl.startsWith("https://www.greenelephant.org");
        if (!isInternalPath && !isGreenElephantUrl) {
          return res.status(400).json({ message: "Target URL must be an internal path or greenelephant.org URL" });
        }
        safeUpdates.targetUrl = targetUrl;
      }
      if (Object.keys(safeUpdates).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }
      const updated = await storage.updateQrCode(id, safeUpdates);
      if (!updated) return res.status(404).json({ message: "QR code not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to update QR code" });
    }
  });
  app2.delete("/api/admin/qr-codes/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { id } = req.params;
      const qr = await storage.getQrCodeById(id);
      if (!qr) return res.status(404).json({ message: "QR code not found" });
      if (qr.type === "master") {
        return res.status(403).json({ message: "Cannot delete the master QR code. You can deactivate it instead." });
      }
      await storage.deleteQrScansByCodeId(id);
      await storage.deleteQrCode(id);
      res.json({ message: "QR code and associated scans deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to delete QR code" });
    }
  });
  app2.get("/api/admin/qr-codes/:id/scans", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const limit = Math.min(Number(req.query.limit) || 100, 500);
      const scans = await storage.getQrScansByCodeId(id);
      const count = await storage.getQrScanCount(id);
      const countryCounts = {};
      const cityCounts = {};
      const deviceCounts = {};
      const dailyCounts = {};
      for (const scan of scans) {
        if (scan.country) countryCounts[scan.country] = (countryCounts[scan.country] || 0) + 1;
        if (scan.city) cityCounts[scan.city] = (cityCounts[scan.city] || 0) + 1;
        if (scan.deviceType) deviceCounts[scan.deviceType] = (deviceCounts[scan.deviceType] || 0) + 1;
        const day = new Date(scan.scannedAt).toISOString().slice(0, 10);
        dailyCounts[day] = (dailyCounts[day] || 0) + 1;
      }
      res.json({
        totalScans: count,
        scans: scans.slice(0, limit),
        analytics: {
          byCountry: Object.entries(countryCounts).sort((a, b) => b[1] - a[1]),
          byCity: Object.entries(cityCounts).sort((a, b) => b[1] - a[1]),
          byDevice: Object.entries(deviceCounts).sort((a, b) => b[1] - a[1]),
          byDay: Object.entries(dailyCounts).sort((a, b) => a[0].localeCompare(b[0]))
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch scans" });
    }
  });
  app2.delete("/api/admin/qr-codes/:id/scans", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { id } = req.params;
      const count = await storage.deleteQrScansByCodeId(id);
      res.json({ message: `Deleted ${count} scan records`, count });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to purge scans" });
    }
  });
  app2.get("/api/admin/qr-codes/:id/image", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const qrCode = await storage.getQrCodeById(id);
      if (!qrCode) return res.status(404).json({ message: "QR code not found" });
      const QRCode = (await import("qrcode")).default;
      const baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "https://greenelephant.org";
      const qrUrl = `${baseUrl}/qr/${qrCode.slug}`;
      const format = req.query.format || "png";
      if (format === "svg") {
        const svg = await QRCode.toString(qrUrl, {
          type: "svg",
          margin: 2,
          color: { dark: "#009999", light: "#ffffff" }
        });
        res.setHeader("Content-Type", "image/svg+xml");
        res.send(svg);
      } else {
        const size = Math.min(Number(req.query.size) || 512, 2048);
        const pngBuffer = await QRCode.toBuffer(qrUrl, {
          type: "png",
          width: size,
          margin: 2,
          color: { dark: "#009999", light: "#ffffff" }
        });
        res.setHeader("Content-Type", "image/png");
        res.setHeader("Content-Disposition", `attachment; filename="greenelephant-qr-${qrCode.slug}.png"`);
        res.send(pngBuffer);
      }
    } catch (error) {
      console.error("QR image generation error:", error);
      res.status(500).json({ message: error.message || "Failed to generate QR image" });
    }
  });
  app2.post("/api/admin/qr-codes/seed-master", requireAdminAuth, requireWriteAccess, async (_req, res) => {
    try {
      const existing = await storage.getQrCodeBySlug("main");
      if (existing) return res.json({ message: "Master QR code already exists", qrCode: existing });
      const master = await storage.createQrCode({
        name: "GreenElephant Portal \u2014 Master QR",
        slug: "main",
        targetUrl: "/portal/login",
        type: "master",
        description: "The universal QR code that always redirects to the GreenElephant portal login. Print this everywhere.",
        isActive: "true"
      });
      res.json({ message: "Master QR code created", qrCode: master });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to create master QR" });
    }
  });
  app2.get("/api/admin/debriefs", requireAdminAuth, async (_req, res) => {
    try {
      const debriefs = await storage.getAllCoachingDebriefs();
      res.json(debriefs);
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch debriefs" });
    }
  });
  app2.post("/api/admin/debriefs", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { clientName, sessionNumber, lens, keyInsights, actionItems, coachNotes, progress, status } = req.body;
      if (!clientName || typeof clientName !== "string") return res.status(400).json({ message: "Client name is required" });
      const progressVal = typeof progress === "number" ? Math.min(5, Math.max(1, progress)) : 3;
      const validStatuses = ["draft", "reviewed", "shared"];
      const debrief = await storage.createCoachingDebrief({
        clientName: clientName.trim(),
        sessionNumber: typeof sessionNumber === "number" ? Math.max(1, sessionNumber) : 1,
        lens: typeof lens === "string" ? lens : null,
        keyInsights: typeof keyInsights === "string" ? keyInsights : null,
        actionItems: Array.isArray(actionItems) ? actionItems.filter((a) => typeof a === "string") : null,
        coachNotes: typeof coachNotes === "string" ? coachNotes : null,
        progress: progressVal,
        status: validStatuses.includes(status) ? status : "draft"
      });
      res.json(debrief);
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to create debrief" });
    }
  });
  app2.patch("/api/admin/debriefs/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { id } = req.params;
      const allowedFields = {};
      if (typeof req.body.clientName === "string") allowedFields.clientName = req.body.clientName.trim();
      if (typeof req.body.sessionNumber === "number") allowedFields.sessionNumber = Math.max(1, req.body.sessionNumber);
      if (typeof req.body.lens === "string") allowedFields.lens = req.body.lens;
      if (typeof req.body.keyInsights === "string") allowedFields.keyInsights = req.body.keyInsights;
      if (Array.isArray(req.body.actionItems)) allowedFields.actionItems = req.body.actionItems.filter((a) => typeof a === "string");
      if (typeof req.body.coachNotes === "string") allowedFields.coachNotes = req.body.coachNotes;
      if (typeof req.body.progress === "number") allowedFields.progress = Math.min(5, Math.max(1, req.body.progress));
      const validStatuses = ["draft", "reviewed", "shared"];
      if (validStatuses.includes(req.body.status)) allowedFields.status = req.body.status;
      const updated = await storage.updateCoachingDebrief(id, allowedFields);
      if (!updated) return res.status(404).json({ message: "Debrief not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to update debrief" });
    }
  });
  app2.delete("/api/admin/debriefs/:id", requireAdminAuth, requireWriteAccess, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteCoachingDebrief(id);
      if (!deleted) return res.status(404).json({ message: "Debrief not found" });
      res.json({ message: "Debrief deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to delete debrief" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/index.ts
init_portal_auth();

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
init_onboarding_scheduler();
init_daily_pulse();
var app = express2();
app.set("trust proxy", 1);
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required for secure sessions");
}
var PgSession = connectPgSimple(session);
app.use(session({
  store: new PgSession({
    pool,
    tableName: "session",
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1e3 * 60 * 60 * 24 * 7,
    // 1 week
    sameSite: "lax"
  }
}));
app.use("/api/typeform-webhook", express2.raw({
  type: "application/json",
  limit: "50mb"
}));
app.use(express2.json({
  limit: "10mb",
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false, limit: "10mb" }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  registerPortalRoutes(app);
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
    setupDailyReminderScheduler();
    startOnboardingScheduler();
    startDailyPulseScheduler();
  });
})();
async function setupDailyReminderScheduler() {
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1e3;
  console.log("\u{1F514} Daily reminder scheduler initialized");
  console.log("\u23F0 Will check for overdue Satellitescan purchases every 24 hours");
  setInterval(async () => {
    await checkAndSendReminders();
  }, TWENTY_FOUR_HOURS);
}
async function checkAndSendReminders() {
  try {
    console.log("\n\u{1F4E7} Running scheduled reminder check...");
    const { storage: storage2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
    const { sendSatellitescanReminderEmail: sendSatellitescanReminderEmail2 } = await Promise.resolve().then(() => (init_email_notifications(), email_notifications_exports));
    const hoursThreshold = 72;
    const overduePurchases = await storage2.getOverdueSatellitescanPurchases(hoursThreshold);
    console.log(`Found ${overduePurchases.length} overdue purchases needing reminders`);
    if (overduePurchases.length === 0) {
      console.log("\u2705 No overdue purchases - all customers are up to date!");
      return;
    }
    let sent = 0;
    let failed = 0;
    for (const purchase of overduePurchases) {
      try {
        const currentCount = parseInt(purchase.remindersCount);
        await storage2.updateSatellitescanReminderCount(purchase.id, currentCount + 1);
        const emailSent = await sendSatellitescanReminderEmail2(
          purchase.customerEmail,
          purchase.customerName
        );
        if (emailSent) {
          sent++;
          console.log(`\u2705 Reminder sent to: ${purchase.customerEmail}`);
        } else {
          failed++;
          console.log(`\u26A0\uFE0F Email failed for ${purchase.customerEmail} (count incremented to prevent retry)`);
        }
      } catch (error) {
        failed++;
        console.error(`\u274C Error processing ${purchase.customerEmail}:`, error.message);
      }
    }
    console.log(`\u{1F4CA} Reminder summary: ${sent} sent, ${failed} failed
`);
  } catch (error) {
    console.error("\u274C Scheduled reminder check failed:", error);
  }
}
