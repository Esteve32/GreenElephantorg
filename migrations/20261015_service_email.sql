-- Additive candidate only. Replit agent owns database validation/application.
-- Jobs can contain encrypted queued purchase/reminder envelopes; include them in retention and key/backup review.
-- No plaintext message body, answer, address or credential is stored in these records.
CREATE TABLE IF NOT EXISTS service_email_control(id text PRIMARY KEY,data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS service_email_jobs(id text PRIMARY KEY,provider_id text UNIQUE,data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS service_email_receipts(id text PRIMARY KEY,data jsonb NOT NULL);
