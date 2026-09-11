-- Stage 4.3-C additive migration plan only.
-- Do not run against production until the reviewed deployment/migration step is
-- separately approved. Existing records are preserved for audit.

ALTER TABLE "myfive_consent_ledger"
  ADD COLUMN IF NOT EXISTS "event_type" text DEFAULT 'accepted' NOT NULL;

ALTER TABLE "myfive_agreements"
  ADD COLUMN IF NOT EXISTS "slot_owner_user_id" varchar,
  ADD COLUMN IF NOT EXISTS "slot_partner_user_id" varchar,
  ADD COLUMN IF NOT EXISTS "value_rules_version" text,
  ADD COLUMN IF NOT EXISTS "owner_consent_receipt_id" varchar,
  ADD COLUMN IF NOT EXISTS "partner_consent_receipt_id" varchar;

-- The historical 'true' value is not bilateral evidence. Preserve existing
-- rows, but require every future writer to supply an explicit reference.
ALTER TABLE "myfive_agreements"
  ALTER COLUMN "value_rules_consented" DROP DEFAULT;

CREATE TABLE IF NOT EXISTS "myfive_agreement_denied_events" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "actor_user_id" varchar NOT NULL,
  "slot_id" varchar NOT NULL,
  "slot_owner_user_id" varchar,
  "slot_partner_user_id" varchar,
  "reason_code" text NOT NULL,
  "rules_version" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "myfive_agreement_denied_slot_created_idx"
  ON "myfive_agreement_denied_events" ("slot_id", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "myfive_consent_ledger_subject_slot_version_idx"
  ON "myfive_consent_ledger" ("actor_user_id", "slot_id", "consent_type", "rules_version", "accepted_at" DESC);

-- Legacy rows where value_rules_consented = 'true' remain historical only. They
-- are intentionally not promoted to receipt evidence because #11 requires
-- independently attributable current receipts for both linked account IDs.
