-- PREPARED ONLY: apply after the intake/review/content migrations on an isolated target first.
-- Private encrypted originals; keys belong outside the database. No startup execution.
BEGIN;
CREATE TABLE scan_typeform_originals (
 event_id varchar PRIMARY KEY REFERENCES scan_typeform_events(event_id) ON DELETE RESTRICT,
 format_version integer NOT NULL CHECK(format_version=1), key_id varchar NOT NULL,
 payload_digest varchar(64) NOT NULL, nonce text NOT NULL, tag text NOT NULL,
 ciphertext text NOT NULL CHECK(length(ciphertext)<=4000000),
 captured_at timestamptz NOT NULL DEFAULT now()
);

-- Owner-reviewed assignment attestations, separate from order possession/identity.
CREATE TABLE scan_typeform_assignment_evidence (
 reference varchar PRIMARY KEY, event_id varchar NOT NULL REFERENCES scan_typeform_events(event_id) ON DELETE RESTRICT,
 actor_id varchar NOT NULL, evidence jsonb NOT NULL CHECK(jsonb_typeof(evidence)='object'),
 request_digest varchar(64) NOT NULL, recorded_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX scan_assignment_event_idx ON scan_typeform_assignment_evidence(event_id);
COMMIT;
