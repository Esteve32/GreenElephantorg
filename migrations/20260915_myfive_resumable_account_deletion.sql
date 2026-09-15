-- Stage 4.3-E additive migration plan only.
-- Do not run against production until the separately recorded privacy,
-- deployment, backup, Stripe, and migration gates are approved.

ALTER TABLE "client_users"
  ADD COLUMN IF NOT EXISTS "account_state" text DEFAULT 'active' NOT NULL,
  ADD COLUMN IF NOT EXISTS "auth_version" integer DEFAULT 1 NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_user_account_state_check') THEN
    ALTER TABLE "client_users" ADD CONSTRAINT "client_user_account_state_check"
      CHECK ("account_state" IN ('active', 'deletion_pending'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_user_auth_version_check') THEN
    ALTER TABLE "client_users" ADD CONSTRAINT "client_user_auth_version_check"
      CHECK ("auth_version" > 0);
  END IF;
END $$;

-- This matches connect-pg-simple's standard table so revocation is available
-- before the application query switch. It contains encrypted/signed session
-- payloads managed by express-session; deletion evidence never copies payloads.
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

CREATE TABLE IF NOT EXISTS "myfive_account_deletion_requests" (
  "user_id" varchar PRIMARY KEY NOT NULL,
  "state" text DEFAULT 'pending' NOT NULL,
  "phase" text DEFAULT 'intent_committed' NOT NULL,
  "attempt_count" integer DEFAULT 0 NOT NULL,
  "last_error_code" text,
  "next_attempt_at" timestamp,
  "requested_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  "completed_at" timestamp,
  CONSTRAINT "myfive_account_deletion_state_check"
    CHECK ("state" IN ('pending', 'completed', 'action_required')),
  CONSTRAINT "myfive_account_deletion_phase_check"
    CHECK ("phase" IN ('intent_committed', 'billing_complete', 'database_complete')),
  CONSTRAINT "myfive_account_deletion_attempt_count_check"
    CHECK ("attempt_count" >= 0),
  CONSTRAINT "myfive_account_deletion_completion_check"
    CHECK (
      ("state" = 'completed' AND "phase" = 'database_complete' AND "completed_at" IS NOT NULL)
      OR ("state" <> 'completed' AND "phase" <> 'database_complete' AND "completed_at" IS NULL)
    )
);

CREATE INDEX IF NOT EXISTS "myfive_account_deletion_retry_idx"
  ON "myfive_account_deletion_requests" ("state", "next_attempt_at", "requested_at");

-- Reversible query-switch plan:
-- 1. Apply these additive objects while the deletion feature flag is disabled.
-- 2. Verify session JSON shape and active-account/auth-version defaults.
-- 3. Enable MYFIVE_RESUMABLE_DELETION_ENABLED only after mocked Stripe and
--    disposable-PostgreSQL evidence passes for the deployed build.
-- 4. Disabling the flag stops new deletion requests and workers while every
--    already-pending account remains fail closed for operator-led recovery.
-- 5. Do not drop the request ledger or reactivate pending accounts on rollback.
