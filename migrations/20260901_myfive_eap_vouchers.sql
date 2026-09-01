-- Stage 3.3: aggregate-only EAP voucher capacity.
-- Employee identity is intentionally absent from this table.
CREATE TABLE IF NOT EXISTS "myfive_eap_vouchers" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organization_label" text NOT NULL,
  "code_hash" text NOT NULL UNIQUE,
  "max_redemptions" integer NOT NULL,
  "redeemed_count" integer DEFAULT 0 NOT NULL,
  "status" text DEFAULT 'active' NOT NULL,
  "expires_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "myfive_eap_voucher_capacity_check" CHECK ("max_redemptions" > 0),
  CONSTRAINT "myfive_eap_voucher_count_check" CHECK ("redeemed_count" BETWEEN 0 AND "max_redemptions")
);

CREATE INDEX IF NOT EXISTS "myfive_eap_voucher_status_expiry_idx"
  ON "myfive_eap_vouchers" ("status", "expires_at");
