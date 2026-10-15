-- Prepared additive migration. No automatic execution or schema-wide db:push.
-- Review against the actual target; test on a positively isolated database first.
BEGIN;
CREATE TABLE privacy_workflow_records (
 id varchar PRIMARY KEY DEFAULT gen_random_uuid(), kind text NOT NULL,
 scope_key text NOT NULL, subject_id varchar REFERENCES contacts(id) ON DELETE SET NULL,
 version integer NOT NULL DEFAULT 0 CHECK(version >= 0),
 data jsonb NOT NULL CHECK(jsonb_typeof(data)='object'), updated_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT privacy_workflow_scope_unique UNIQUE(kind,scope_key),
 CONSTRAINT privacy_workflow_kind_check CHECK(kind IN ('notice','consent','case','attention','connector','retention','digest','recovery','configuration'))
);
CREATE INDEX privacy_workflow_subject_idx ON privacy_workflow_records(subject_id,kind);
CREATE TABLE privacy_workflow_events (
 id varchar PRIMARY KEY DEFAULT gen_random_uuid(), record_id varchar NOT NULL REFERENCES privacy_workflow_records(id) ON DELETE RESTRICT,
 mutation_id varchar NOT NULL UNIQUE, request_digest text NOT NULL, version integer NOT NULL CHECK(version>0),
 action text NOT NULL, actor_id varchar NOT NULL, evidence jsonb NOT NULL CHECK(jsonb_typeof(evidence)='object'),
 recorded_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT privacy_workflow_event_version_unique UNIQUE(record_id,version)
);
CREATE INDEX privacy_workflow_history_idx ON privacy_workflow_events(record_id,version);
-- No legacy grants, notice versions, retention periods, recipients or policies seeded.
COMMIT;
