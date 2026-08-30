-- Deliberately scoped migration for the brownfield Replit database.
-- Do not replace this with `drizzle-kit push`: the live database contains
-- tables that are not represented in the repository's partial Drizzle schema.

CREATE TABLE IF NOT EXISTS "myfive_connection_slots" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar NOT NULL,
  "slot_index" integer NOT NULL,
  "partner_name" text,
  "relation_type" text,
  "status" text DEFAULT 'empty' NOT NULL,
  "is_self_vault" text DEFAULT 'false' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "myfive_check_ins" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar NOT NULL,
  "slot_id" varchar NOT NULL,
  "flow_octant" text NOT NULL,
  "private_reflection" text,
  "is_vault_encrypted" text DEFAULT 'true' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "myfive_agreements" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slot_id" varchar NOT NULL,
  "creator_user_id" varchar NOT NULL,
  "partner_user_id" varchar,
  "agreement_text" text NOT NULL,
  "value_rules_consented" text DEFAULT 'true' NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "myfive_consent_ledger" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "actor_user_id" varchar NOT NULL,
  "slot_id" varchar NOT NULL,
  "consent_type" text NOT NULL,
  "rules_version" text NOT NULL,
  "accepted_rule_ids" text[] NOT NULL,
  "accepted_at" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "myfive_agreement_slot_creator_version_idx"
  ON "myfive_agreements" ("slot_id", "creator_user_id", "version");

CREATE TABLE IF NOT EXISTS "myfive_subscriptions" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar NOT NULL UNIQUE,
  "stripe_customer_id" text,
  "stripe_subscription_id" text,
  "plan_status" text DEFAULT 'active' NOT NULL,
  "sponsor_user_id" text,
  "sponsored_seats_allocated" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
