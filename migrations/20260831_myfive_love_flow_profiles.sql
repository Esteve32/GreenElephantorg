-- Additive-only migration for private, append-only Greek-love Flow profiles.
CREATE TABLE IF NOT EXISTS "myfive_love_profile_snapshots" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "actor_user_id" varchar NOT NULL,
  "slot_id" varchar NOT NULL,
  "profile" jsonb NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "myfive_love_profile_actor_slot_created_idx"
  ON "myfive_love_profile_snapshots" ("actor_user_id", "slot_id", "created_at" DESC);
