-- Additive guardrails for Stage 2.4: one self-vault plus at most five partner seats.
-- Existing duplicates must be resolved deliberately rather than silently deleted.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM myfive_connection_slots GROUP BY user_id, slot_index HAVING count(*) > 1) THEN
    RAISE EXCEPTION 'Duplicate MyFive user/slot indexes must be resolved before Stage 2.4 migration';
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "myfive_connection_slot_user_index_idx"
  ON "myfive_connection_slots" ("user_id", "slot_index");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'myfive_connection_slot_index_check') THEN
    ALTER TABLE "myfive_connection_slots" ADD CONSTRAINT "myfive_connection_slot_index_check"
      CHECK ("slot_index" BETWEEN 0 AND 5);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'myfive_connection_slot_self_check') THEN
    ALTER TABLE "myfive_connection_slots" ADD CONSTRAINT "myfive_connection_slot_self_check" CHECK (
      ("slot_index" = 0 AND "is_self_vault" = 'true') OR
      ("slot_index" BETWEEN 1 AND 5 AND "is_self_vault" = 'false')
    );
  END IF;
END $$;
