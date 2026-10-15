-- PREPARED ONLY, after both intake and service-review migrations. No raw content storage.
BEGIN;
ALTER TABLE scan_typeform_events ADD COLUMN content_version integer,
  ADD COLUMN content_digest varchar(64), ADD COLUMN labels_digest varchar(64),
  ADD CONSTRAINT scan_content_version CHECK(content_version IS NULL OR content_version = 1);
-- Historical gaps remain null; recovery/preview must hold rather than infer evidence.
COMMIT;
