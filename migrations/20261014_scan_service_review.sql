-- PREPARED ONLY. Apply after 20261014_typeform_service_intake.sql on an isolated target first.
BEGIN;
ALTER TABLE scan_typeform_events
  ADD COLUMN binding_digest varchar(64),
  ADD COLUMN completion_verified text,
  ADD COLUMN mapping_digest varchar(64),
  ADD COLUMN review_version integer NOT NULL DEFAULT 0,
  ADD COLUMN review_state text NOT NULL DEFAULT 'open',
  ADD CONSTRAINT scan_review_version CHECK(review_version >= 0),
  ADD CONSTRAINT scan_review_state CHECK(review_state IN ('open','held','rejected','resolved')),
  ADD CONSTRAINT scan_completion_evidence CHECK(completion_verified IN ('true','false'));
-- Historical rows stay null: no inferred completion/reference/mapping evidence.
ALTER TABLE scan_typeform_service_tasks
  ADD COLUMN owner_id varchar,
  ADD COLUMN due_at timestamptz,
  ADD COLUMN participant_ref varchar,
  ADD COLUMN recipient_email text,
  ADD COLUMN assignment_evidence_ref varchar,
  ADD COLUMN recipient_evidence_ref varchar,
  ADD COLUMN assignment_reviewed_at timestamptz;
-- Existing conflicts must be reconciled before this index can be applied.
CREATE UNIQUE INDEX scan_typeform_response_once ON scan_typeform_service_tasks(form_id,response_id);
CREATE TABLE scan_typeform_review_actions (
  mutation_id varchar PRIMARY KEY,
  event_id varchar NOT NULL REFERENCES scan_typeform_events(event_id) ON DELETE RESTRICT,
  version integer NOT NULL, actor_id varchar NOT NULL,
  request_digest varchar(64) NOT NULL,
  decision text NOT NULL, reason text NOT NULL, evidence_ref varchar,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT scan_review_action_version CHECK(version > 0),
  CONSTRAINT scan_review_action_decision CHECK(decision IN ('held','rejected','resolved'))
);
CREATE UNIQUE INDEX scan_typeform_review_actions_event_version ON scan_typeform_review_actions(event_id,version);
-- Protected service metadata, including the reviewed recipient in restricted task detail.
-- No raw answers, bearer reference, marketing grant or identity-verification assertion.
COMMIT;
