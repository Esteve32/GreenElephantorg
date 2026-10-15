-- PREPARED ONLY: isolated validation first; no startup/production migration.
-- No raw answers, emails, bearer invitation references or consent grants stored.
BEGIN;
CREATE TABLE scan_typeform_bindings (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  reference_digest varchar(64) NOT NULL UNIQUE,
  purchase_id varchar NOT NULL REFERENCES satellitescan_purchases(id) ON DELETE RESTRICT,
  participant_ref varchar NOT NULL, form_id varchar NOT NULL,
  participant_verified_at timestamptz, participant_verification_ref varchar,
  expires_at timestamptz NOT NULL, is_active text NOT NULL DEFAULT 'true',
  response_id varchar, completed_digest varchar(64),
  CONSTRAINT scan_typeform_binding_active CHECK(is_active IN ('true','false'))
);
CREATE TABLE scan_typeform_events (
  event_id varchar PRIMARY KEY, event_type text NOT NULL,
  form_id varchar NOT NULL, response_id varchar NOT NULL,
  payload_digest varchar(64) NOT NULL, response_digest varchar(64) NOT NULL,
  outcome text NOT NULL, reason text NOT NULL,
  binding_id varchar REFERENCES scan_typeform_bindings(id) ON DELETE RESTRICT,
  submitted_at timestamptz, received_at timestamptz NOT NULL,
  CONSTRAINT scan_typeform_event_type CHECK(event_type IN ('form_response','form_response_partial')),
  CONSTRAINT scan_typeform_event_outcome CHECK(outcome IN ('recorded','partial','review','duplicate'))
);
CREATE TABLE scan_typeform_service_tasks (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  binding_id varchar NOT NULL UNIQUE REFERENCES scan_typeform_bindings(id) ON DELETE RESTRICT,
  purchase_id varchar NOT NULL UNIQUE REFERENCES satellitescan_purchases(id) ON DELETE RESTRICT,
  event_id varchar NOT NULL REFERENCES scan_typeform_events(event_id) ON DELETE RESTRICT,
  form_id varchar NOT NULL, response_id varchar NOT NULL, response_digest varchar(64) NOT NULL,
  state text NOT NULL DEFAULT 'pending_retrieval', created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT scan_typeform_task_state CHECK(state = 'pending_retrieval')
);
-- Protected personal metadata; no immutable-storage or indefinite-retention claim.
-- No automatic deletion, invitations or live dispatch enabled.
COMMIT;
