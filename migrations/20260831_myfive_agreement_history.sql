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
