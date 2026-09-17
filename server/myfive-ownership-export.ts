export interface MyFiveExportQueryClient {
  query(text: string, values?: unknown[]): Promise<{ rows: unknown[] }>;
}

interface ExportableAgreementRow {
  id: string;
  slot_id: string;
  agreement_text: string;
  agreement_lifecycle: "active" | "frozen";
  value_rules_version: string | null;
  version: number;
  created_at: Date;
  updated_at: Date;
  participant_lifecycle: "active" | "survivor";
}

export const SELECT_EXPORTABLE_MYFIVE_AGREEMENTS_SQL = `
  SELECT agreements.id,
         agreements.slot_id,
         agreements.agreement_text,
         agreements.lifecycle_state AS agreement_lifecycle,
         agreements.value_rules_version,
         agreements.version,
         agreements.created_at,
         agreements.updated_at,
         participants.lifecycle_state AS participant_lifecycle
  FROM myfive_connection_participants AS participants
  INNER JOIN myfive_agreements AS agreements
    ON participants.connection_id = agreements.slot_id
  INNER JOIN myfive_connection_slots AS slots
    ON participants.connection_id = slots.id
  WHERE participants.user_id = $1
    AND (
      (
        participants.lifecycle_state = 'active'
        AND agreements.lifecycle_state = 'active'
        AND slots.lifecycle_state = 'active'
        AND slots.status = 'active'
      )
      OR (
        participants.lifecycle_state = 'survivor'
        AND agreements.lifecycle_state = 'frozen'
        AND agreements.survivor_user_id = $1
        AND slots.lifecycle_state = 'locked'
        AND slots.status = 'siloed'
      )
    )
  ORDER BY agreements.created_at ASC
`;

export async function readExportableMyFiveAgreements(
  client: MyFiveExportQueryClient,
  userId: string,
) {
  const result = await client.query(SELECT_EXPORTABLE_MYFIVE_AGREEMENTS_SQL, [userId]);
  return (result.rows as ExportableAgreementRow[]).map((agreement) => ({
    id: agreement.id,
    slotId: agreement.slot_id,
    agreementText: agreement.agreement_text,
    lifecycleState: agreement.agreement_lifecycle,
    valueRulesVersion: agreement.value_rules_version,
    version: agreement.version,
    createdAt: agreement.created_at,
    updatedAt: agreement.updated_at,
    participantLifecycle: agreement.participant_lifecycle,
  }));
}
