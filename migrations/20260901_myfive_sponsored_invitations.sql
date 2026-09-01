-- Stage 3.2: private, single-use partner invitations and sponsorship mapping.
ALTER TABLE "myfive_connection_slots" ADD COLUMN IF NOT EXISTS "partner_user_id" varchar;

CREATE TABLE IF NOT EXISTS "myfive_invitations" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "sponsor_user_id" varchar NOT NULL,
  "slot_id" varchar NOT NULL,
  "invitee_email" text NOT NULL,
  "token_hash" text NOT NULL UNIQUE,
  "status" text DEFAULT 'pending' NOT NULL,
  "accepted_by_user_id" varchar,
  "expires_at" timestamp NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "accepted_at" timestamp
);

CREATE INDEX IF NOT EXISTS "myfive_invitation_sponsor_status_idx"
  ON "myfive_invitations" ("sponsor_user_id", "status");
CREATE INDEX IF NOT EXISTS "myfive_invitation_slot_status_idx"
  ON "myfive_invitations" ("slot_id", "status");
