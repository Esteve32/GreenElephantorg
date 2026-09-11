import { pool } from "./db";

const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;
let cleanupTimer: NodeJS.Timeout | null = null;

export async function purgeExpiredMyFiveProvisionalData(ownerUserId?: string): Promise<void> {
  const ownerPredicate = ownerUserId ? "AND sponsor_user_id = $1" : "";
  const parameters = ownerUserId ? [ownerUserId] : [];
  await pool.query(
    `WITH expired AS (
       DELETE FROM myfive_invitations
       WHERE status = 'pending' AND expires_at <= now() ${ownerPredicate}
       RETURNING slot_id
     )
     UPDATE myfive_connection_slots
     SET partner_name = NULL, relation_type = NULL, status = 'empty'
     WHERE partner_user_id IS NULL
       AND id IN (SELECT slot_id FROM expired)`,
    parameters,
  );
}

export function startMyFiveProvisionalCleanupScheduler(): void {
  if (cleanupTimer) return;
  void purgeExpiredMyFiveProvisionalData().catch(() => {
    console.error("MyFive provisional-data cleanup failed");
  });
  cleanupTimer = setInterval(() => {
    void purgeExpiredMyFiveProvisionalData().catch(() => {
      console.error("MyFive provisional-data cleanup failed");
    });
  }, CLEANUP_INTERVAL_MS);
  cleanupTimer.unref();
}
