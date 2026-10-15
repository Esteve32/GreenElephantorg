-- AI-LIT REQ-096: additive, withdrawal-only evidence slice.
-- PREPARED ONLY. No automatic startup migration and no drizzle-kit push.
-- Apply to a reviewed test database first; back up and inspect production schema
-- before a separately authorised production migration and application release.
-- This is not the complete RoPA schema or a retention/erasure implementation.
BEGIN;

CREATE TABLE "privacy_preference_events" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "contact_id" varchar REFERENCES "contacts"("id") ON DELETE SET NULL,
  "subject_key" text NOT NULL CONSTRAINT "privacy_preference_events_subject_key_unique" UNIQUE,
  "purpose" text NOT NULL CHECK ("purpose" = 'marketing_updates'),
  "action" text NOT NULL CHECK ("action" = 'withdrawn'),
  "source" text NOT NULL CHECK ("source" = 'email_preferences'),
  "interface_version" text NOT NULL CHECK ("interface_version" = 'email-unsubscribe-v1'),
  "recorded_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "privacy_preference_events_contact_idx"
  ON "privacy_preference_events" ("contact_id", "recorded_at");

-- subject_key is a linkable pseudonymous identifier, NOT anonymous data.
-- This first slice has no grant path. Future re-subscription needs versioned
-- transitions and a reviewed change to this one-withdrawal-per-subject constraint.
-- Do not silently delete this table on application rollback. Preserve evidence
-- and suppression; apply the reviewed personal-data retention policy separately.
COMMIT;
