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
