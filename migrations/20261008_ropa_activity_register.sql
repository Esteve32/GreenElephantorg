-- AI-LIT: local RoPA register candidate. PREPARED ONLY.
-- Apply only to an isolated test database until separately reviewed migration approval.
-- No startup migration, production data import or schema-wide db:push.
BEGIN;
CREATE TABLE ropa_activities (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  version integer NOT NULL CHECK (version > 0),
  record jsonb NOT NULL CHECK (jsonb_typeof(record) = 'object'),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE ropa_activity_versions (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  activity_id varchar NOT NULL REFERENCES ropa_activities(id) ON DELETE RESTRICT,
  version integer NOT NULL CHECK (version > 0),
  record jsonb NOT NULL CHECK (jsonb_typeof(record) = 'object'),
  reason text NOT NULL,
  actor_id varchar NOT NULL,
  mutation_id varchar NOT NULL UNIQUE,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ropa_activity_version_unique UNIQUE(activity_id, version)
);
CREATE INDEX ropa_activity_versions_activity_idx ON ropa_activity_versions(activity_id, version);
-- No automatic delete/rollback: preserve versions and audit. Version history is
-- not a claim of immutable storage or an indefinite personal-data retention rule.
COMMIT;
