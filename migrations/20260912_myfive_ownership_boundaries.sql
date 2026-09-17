-- Stage 4.3-D additive migration plan only.
-- Do not run against production until the separately recorded legal/privacy,
-- deployment, backup, and migration gates are approved. This plan does not read,
-- reclassify, update, or delete quarantined legacy myfive_check_ins rows.

ALTER TABLE "myfive_connection_slots"
  ALTER COLUMN "user_id" DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS "lifecycle_state" text DEFAULT 'active' NOT NULL,
  ADD COLUMN IF NOT EXISTS "locked_at" timestamp;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "myfive_connection_slots"
    WHERE "user_id" IS NOT NULL AND "partner_user_id" = "user_id"
  ) THEN
    RAISE EXCEPTION 'A MyFive connection cannot link the same account as both participants';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'myfive_connection_slot_lifecycle_check') THEN
    ALTER TABLE "myfive_connection_slots" ADD CONSTRAINT "myfive_connection_slot_lifecycle_check"
      CHECK ("lifecycle_state" IN ('active', 'locked', 'erased'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'myfive_connection_slot_distinct_participants_check') THEN
    ALTER TABLE "myfive_connection_slots" ADD CONSTRAINT "myfive_connection_slot_distinct_participants_check"
      CHECK ("user_id" IS NULL OR "partner_user_id" IS NULL OR "user_id" <> "partner_user_id");
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'myfive_connection_slot_lifecycle_timestamp_check') THEN
    ALTER TABLE "myfive_connection_slots" ADD CONSTRAINT "myfive_connection_slot_lifecycle_timestamp_check"
      CHECK (
        ("lifecycle_state" = 'active' AND "locked_at" IS NULL)
        OR ("lifecycle_state" IN ('locked', 'erased') AND "locked_at" IS NOT NULL)
      );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "myfive_connection_participants" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "connection_id" varchar NOT NULL,
  "user_id" varchar NOT NULL,
  "role" text NOT NULL,
  "lifecycle_state" text DEFAULT 'active' NOT NULL,
  "joined_at" timestamp DEFAULT now() NOT NULL,
  "revoked_at" timestamp,
  CONSTRAINT "myfive_connection_participant_connection_user_idx"
    UNIQUE ("connection_id", "user_id"),
  CONSTRAINT "myfive_connection_participant_role_check"
    CHECK ("role" IN ('owner', 'partner')),
  CONSTRAINT "myfive_connection_participant_lifecycle_check"
    CHECK ("lifecycle_state" IN ('active', 'survivor', 'revoked'))
);

CREATE INDEX IF NOT EXISTS "myfive_connection_participant_user_lifecycle_idx"
  ON "myfive_connection_participants" ("user_id", "lifecycle_state");

-- These are existing explicit account identifiers, not typed labels or email
-- guesses. Collision handling is deterministic and does not fabricate authorship.
INSERT INTO "myfive_connection_participants" ("connection_id", "user_id", "role")
SELECT "id", "user_id", 'owner'
FROM "myfive_connection_slots"
WHERE "user_id" IS NOT NULL
ON CONFLICT ("connection_id", "user_id") DO NOTHING;

INSERT INTO "myfive_connection_participants" ("connection_id", "user_id", "role")
SELECT "id", "partner_user_id", 'partner'
FROM "myfive_connection_slots"
WHERE "partner_user_id" IS NOT NULL
ON CONFLICT ("connection_id", "user_id") DO NOTHING;

ALTER TABLE "myfive_agreements"
  ALTER COLUMN "creator_user_id" DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS "lifecycle_state" text DEFAULT 'active' NOT NULL,
  ADD COLUMN IF NOT EXISTS "frozen_at" timestamp,
  ADD COLUMN IF NOT EXISTS "survivor_user_id" varchar;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'myfive_agreement_lifecycle_check') THEN
    ALTER TABLE "myfive_agreements" ADD CONSTRAINT "myfive_agreement_lifecycle_check"
      CHECK ("lifecycle_state" IN ('active', 'frozen'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'myfive_agreement_lifecycle_custody_check') THEN
    ALTER TABLE "myfive_agreements" ADD CONSTRAINT "myfive_agreement_lifecycle_custody_check"
      CHECK (
        ("lifecycle_state" = 'active' AND "frozen_at" IS NULL AND "survivor_user_id" IS NULL)
        OR ("lifecycle_state" = 'frozen' AND "frozen_at" IS NOT NULL AND "survivor_user_id" IS NOT NULL)
      );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "myfive_agreement_survivor_lifecycle_idx"
  ON "myfive_agreements" ("survivor_user_id", "lifecycle_state", "created_at" DESC);

-- Data-minimized access evidence for frozen survivor copies. No agreement
-- content, account contact data, consent receipt, or other participant ID is
-- stored in this ledger. Rows belong to the acting account and are erased when
-- that actor deletes their account.
CREATE TABLE IF NOT EXISTS "myfive_agreement_custody_events" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "actor_user_id" varchar NOT NULL,
  "connection_id" varchar NOT NULL,
  "event_type" text NOT NULL,
  "outcome" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "myfive_agreement_custody_event_type_check"
    CHECK ("event_type" IN ('read', 'export', 'delete')),
  CONSTRAINT "myfive_agreement_custody_outcome_check"
    CHECK ("outcome" IN ('success', 'not_found'))
);

CREATE INDEX IF NOT EXISTS "myfive_agreement_custody_actor_created_idx"
  ON "myfive_agreement_custody_events" ("actor_user_id", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "myfive_agreement_custody_connection_created_idx"
  ON "myfive_agreement_custody_events" ("connection_id", "created_at" DESC);

-- Acceptance, revocation, and expiry purge contact and token data. Nullable
-- columns allow a lifecycle row to be minimized if a separately justified audit
-- record is retained; the current implementation deletes completed rows.
ALTER TABLE "myfive_invitations"
  ALTER COLUMN "invitee_email" DROP NOT NULL,
  ALTER COLUMN "token_hash" DROP NOT NULL;

-- Reversible query-switch plan:
-- 1. Deploy these additive columns/table with old reads still active.
-- 2. Compare explicit-participant counts against non-null slot account IDs.
-- 3. Switch reads/deletion to participant relations only after collision review.
-- 4. Roll back application queries without dropping columns or data if proof fails.
-- Destructive rollback (dropping the participant table or lifecycle columns) is
-- intentionally excluded until the new model has passed its retention window.
