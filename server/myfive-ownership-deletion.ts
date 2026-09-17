import { planJointAgreementDeletion } from "../shared/myfiveSurvivorCustody";

export interface MyFiveDeletionQueryClient {
  query(text: string, values?: unknown[]): Promise<{ rows: unknown[]; rowCount?: number | null }>;
}

interface ConnectionForDeletion {
  connection_id: string;
  remaining_user_ids: string[];
}

/**
 * Delete or de-identify classified MyFive records inside the caller's open
 * database transaction. External billing work, global portal records, the
 * account row, and transaction commit/rollback stay with the route orchestrator.
 */
export async function deleteMyFiveClassifiedRecords(
  client: MyFiveDeletionQueryClient,
  userId: string,
  userEmail: string,
): Promise<void> {
  await client.query(
    `INSERT INTO myfive_connection_participants (connection_id, user_id, role)
     SELECT id, $1::varchar, CASE WHEN user_id = $1::varchar THEN 'owner' ELSE 'partner' END
     FROM myfive_connection_slots
     WHERE user_id = $1::varchar OR partner_user_id = $1::varchar
     ON CONFLICT (connection_id, user_id) DO NOTHING`,
    [userId],
  );
  const connectionResult = await client.query(
    `SELECT subject.connection_id,
            ARRAY(
              SELECT remaining.user_id
              FROM myfive_connection_participants AS remaining
              WHERE remaining.connection_id = subject.connection_id
                AND remaining.user_id <> $1
                AND remaining.lifecycle_state IN ('active', 'survivor')
              ORDER BY remaining.joined_at
            ) AS remaining_user_ids
     FROM myfive_connection_participants AS subject
     INNER JOIN myfive_connection_slots AS slots ON slots.id = subject.connection_id
     WHERE subject.user_id = $1
       AND subject.lifecycle_state IN ('active', 'survivor')
     ORDER BY subject.connection_id
     FOR UPDATE OF subject, slots`,
    [userId],
  );
  const connections = connectionResult.rows as ConnectionForDeletion[];

  await client.query("DELETE FROM myfive_love_profile_snapshots WHERE actor_user_id = $1", [userId]);
  await client.query("DELETE FROM myfive_consent_ledger WHERE actor_user_id = $1", [userId]);
  await client.query("DELETE FROM myfive_agreement_denied_events WHERE actor_user_id = $1", [userId]);
  await client.query("DELETE FROM myfive_agreement_custody_events WHERE actor_user_id = $1", [userId]);
  await client.query(
    `UPDATE myfive_agreement_denied_events
     SET slot_owner_user_id = CASE WHEN slot_owner_user_id = $1 THEN NULL ELSE slot_owner_user_id END,
         slot_partner_user_id = CASE WHEN slot_partner_user_id = $1 THEN NULL ELSE slot_partner_user_id END
     WHERE slot_owner_user_id = $1 OR slot_partner_user_id = $1`,
    [userId],
  );
  await client.query(
    `DELETE FROM myfive_invitations
     WHERE sponsor_user_id = $1 OR accepted_by_user_id = $1 OR lower(invitee_email) = $2`,
    [userId, userEmail],
  );

  for (const connection of connections) {
    const deletionPlan = planJointAgreementDeletion(userId, connection.remaining_user_ids);
    if (deletionPlan.action === "freeze_for_survivor") {
      await client.query(
        `UPDATE myfive_agreements
         SET creator_user_id = CASE WHEN creator_user_id = $1 THEN NULL ELSE creator_user_id END,
             partner_user_id = CASE WHEN partner_user_id = $1 THEN NULL ELSE partner_user_id END,
             slot_owner_user_id = CASE WHEN slot_owner_user_id = $1 THEN NULL ELSE slot_owner_user_id END,
             slot_partner_user_id = CASE WHEN slot_partner_user_id = $1 THEN NULL ELSE slot_partner_user_id END,
             owner_consent_receipt_id = NULL,
             partner_consent_receipt_id = NULL,
             value_rules_consented = 'frozen-survivor-custody',
             lifecycle_state = 'frozen',
             frozen_at = COALESCE(frozen_at, now()),
             survivor_user_id = $2
         WHERE slot_id = $3`,
        [userId, deletionPlan.survivorUserId, connection.connection_id],
      );
      await client.query(
        `UPDATE myfive_connection_slots
         SET user_id = CASE WHEN user_id = $1 THEN NULL ELSE user_id END,
             partner_user_id = CASE WHEN partner_user_id = $1 THEN NULL ELSE partner_user_id END,
             partner_name = NULL,
             relation_type = NULL,
             status = 'siloed',
             lifecycle_state = 'locked',
             locked_at = COALESCE(locked_at, now())
         WHERE id = $2`,
        [userId, connection.connection_id],
      );
      await client.query(
        `UPDATE myfive_connection_participants
         SET lifecycle_state = 'survivor'
         WHERE connection_id = $1 AND user_id = $2`,
        [connection.connection_id, deletionPlan.survivorUserId],
      );
    } else {
      await client.query("DELETE FROM myfive_agreements WHERE slot_id = $1", [connection.connection_id]);
      await client.query(
        `UPDATE myfive_connection_slots
         SET user_id = CASE WHEN user_id = $1 THEN NULL ELSE user_id END,
             partner_user_id = CASE WHEN partner_user_id = $1 THEN NULL ELSE partner_user_id END,
             partner_name = NULL,
             relation_type = NULL,
             status = 'siloed', lifecycle_state = 'locked', locked_at = COALESCE(locked_at, now())
         WHERE id = $2`,
        [userId, connection.connection_id],
      );
    }
    await client.query(
      "DELETE FROM myfive_connection_participants WHERE connection_id = $1 AND user_id = $2",
      [connection.connection_id, userId],
    );
    if (deletionPlan.action === "erase_final_copy") {
      await client.query(
        `DELETE FROM myfive_connection_slots AS slots
         WHERE slots.id = $1
           AND NOT EXISTS (SELECT 1 FROM myfive_connection_participants WHERE connection_id = slots.id)
           AND NOT EXISTS (SELECT 1 FROM myfive_love_profile_snapshots WHERE slot_id = slots.id)
           AND NOT EXISTS (SELECT 1 FROM myfive_consent_ledger WHERE slot_id = slots.id)
           AND NOT EXISTS (SELECT 1 FROM myfive_agreement_denied_events WHERE slot_id = slots.id)
           AND NOT EXISTS (SELECT 1 FROM myfive_agreement_custody_events WHERE connection_id = slots.id)
           AND NOT EXISTS (SELECT 1 FROM myfive_check_ins WHERE slot_id = slots.id)`,
        [connection.connection_id],
      );
    }
  }
  await client.query("DELETE FROM myfive_connection_participants WHERE user_id = $1", [userId]);

  await client.query(
    "UPDATE myfive_subscriptions SET plan_status = 'canceled', sponsor_user_id = NULL WHERE sponsor_user_id = $1",
    [userId],
  );
  await client.query("DELETE FROM myfive_subscriptions WHERE user_id = $1", [userId]);
  await client.query(
    `UPDATE myfive_subscriptions AS subscriptions SET sponsored_seats_allocated = (
      SELECT count(*)::integer FROM myfive_subscriptions AS sponsored
      WHERE sponsored.sponsor_user_id = subscriptions.user_id AND sponsored.plan_status = 'sponsored'
    ) WHERE subscriptions.plan_status = 'active'`,
  );
}
