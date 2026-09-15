import type Stripe from "stripe";
import { deleteMyFiveClassifiedRecords } from "./myfive-ownership-deletion";

export type MyFiveDeletionState = "pending" | "completed" | "action_required";
export type MyFiveDeletionPhase = "intent_committed" | "billing_complete" | "database_complete";

export interface MyFiveDeletionStatus {
  state: MyFiveDeletionState;
  phase: MyFiveDeletionPhase;
  errorCode: string | null;
}

export interface MyFiveDeletionQueryClient {
  query(text: string, values?: unknown[]): Promise<{ rows: any[]; rowCount?: number | null }>;
  release(): void;
}

export interface MyFiveDeletionPool {
  connect(): Promise<MyFiveDeletionQueryClient>;
  query(text: string, values?: unknown[]): Promise<{ rows: any[]; rowCount?: number | null }>;
}

export interface MyFiveBillingDeletionGateway {
  deleteCustomer(customerId: string): Promise<void>;
  cancelSubscription(subscriptionId: string): Promise<void>;
}

type BillingOutcome =
  | { kind: "complete" }
  | { kind: "retry"; code: string }
  | { kind: "action_required"; code: string };

function statusFromRow(row: any): MyFiveDeletionStatus {
  return {
    state: row.state,
    phase: row.phase,
    errorCode: row.last_error_code ?? null,
  };
}

export function classifyStripeDeletionError(error: unknown): Exclude<BillingOutcome, { kind: "complete" }> | { kind: "complete" } {
  const candidate = error as { statusCode?: number; code?: string; type?: string } | null;
  const status = candidate?.statusCode;
  const code = candidate?.code;
  if (status === 404 || code === "resource_missing") return { kind: "complete" };
  if (status === 408 || status === 409 || status === 429 || (status !== undefined && status >= 500)) {
    return { kind: "retry", code: status === 429 ? "stripe_rate_limited" : "stripe_temporarily_unavailable" };
  }
  if (status !== undefined && status >= 400 && status < 500) {
    return { kind: "action_required", code: "stripe_configuration_or_request_rejected" };
  }
  if (candidate?.type === "StripeConnectionError" || candidate?.type === "StripeAPIError") {
    return { kind: "retry", code: "stripe_temporarily_unavailable" };
  }
  return { kind: "retry", code: "billing_outcome_unconfirmed" };
}

export function createStripeDeletionGateway(stripe: Stripe): MyFiveBillingDeletionGateway {
  return {
    async deleteCustomer(customerId) {
      await stripe.customers.del(customerId);
    },
    async cancelSubscription(subscriptionId) {
      await stripe.subscriptions.cancel(subscriptionId);
    },
  };
}

export function isResumableMyFiveDeletionEnabled(): boolean {
  return process.env.MYFIVE_RESUMABLE_DELETION_ENABLED === "true";
}

export async function beginMyFiveAccountDeletion(
  pool: MyFiveDeletionPool,
  userId: string,
): Promise<MyFiveDeletionStatus> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [`myfive-delete:${userId}`]);
    const accountResult = await client.query(
      `SELECT account_state, auth_version FROM client_users WHERE id = $1 FOR UPDATE`,
      [userId],
    );
    const requestResult = await client.query(
      `SELECT state, phase, last_error_code
       FROM myfive_account_deletion_requests WHERE user_id = $1 FOR UPDATE`,
      [userId],
    );

    if (!accountResult.rows[0]) {
      if (!requestResult.rows[0]) throw new Error("deletion_account_not_found");
      await client.query("COMMIT");
      return statusFromRow(requestResult.rows[0]);
    }

    if (!requestResult.rows[0]) {
      await client.query(
        `INSERT INTO myfive_account_deletion_requests (user_id, state, phase)
         VALUES ($1, 'pending', 'intent_committed')`,
        [userId],
      );
    }
    if (accountResult.rows[0].account_state === "active") {
      await client.query(
        `UPDATE client_users
         SET account_state = 'deletion_pending', auth_version = auth_version + 1
         WHERE id = $1`,
        [userId],
      );
    }
    await client.query(
      `DELETE FROM "session" WHERE "sess" ->> 'clientUserId' = $1`,
      [userId],
    );
    const result = await client.query(
      `SELECT state, phase, last_error_code
       FROM myfive_account_deletion_requests WHERE user_id = $1`,
      [userId],
    );
    await client.query("COMMIT");
    return statusFromRow(result.rows[0]);
  } catch (error) {
    try { await client.query("ROLLBACK"); } catch { /* transaction already closed */ }
    throw error;
  } finally {
    client.release();
  }
}

async function recordBillingOutcome(
  pool: MyFiveDeletionPool,
  userId: string,
  outcome: BillingOutcome,
): Promise<MyFiveDeletionStatus> {
  const result = outcome.kind === "complete"
    ? await pool.query(
      `UPDATE myfive_account_deletion_requests
       SET phase = 'billing_complete', state = 'pending', last_error_code = NULL,
           next_attempt_at = NULL, updated_at = now()
       WHERE user_id = $1 AND state = 'pending' AND phase = 'intent_committed'
       RETURNING state, phase, last_error_code`,
      [userId],
    )
    : await pool.query(
      `UPDATE myfive_account_deletion_requests
       SET state = $2, attempt_count = attempt_count + 1, last_error_code = $3,
           next_attempt_at = CASE WHEN $2 = 'pending' THEN now() + interval '5 minutes' ELSE NULL END,
           updated_at = now()
       WHERE user_id = $1 AND state = 'pending' AND phase = 'intent_committed'
       RETURNING state, phase, last_error_code`,
      [userId, outcome.kind === "retry" ? "pending" : "action_required", outcome.code],
    );
  if (result.rows[0]) return statusFromRow(result.rows[0]);
  const current = await pool.query(
    `SELECT state, phase, last_error_code FROM myfive_account_deletion_requests WHERE user_id = $1`,
    [userId],
  );
  if (!current.rows[0]) throw new Error("deletion_request_not_found");
  return statusFromRow(current.rows[0]);
}

async function eraseDatabaseRecords(pool: MyFiveDeletionPool, userId: string): Promise<MyFiveDeletionStatus> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [`myfive-delete:${userId}`]);
    const request = await client.query(
      `SELECT state, phase, last_error_code
       FROM myfive_account_deletion_requests WHERE user_id = $1 FOR UPDATE`,
      [userId],
    );
    if (!request.rows[0]) throw new Error("deletion_request_not_found");
    if (request.rows[0].state === "completed") {
      await client.query("COMMIT");
      return statusFromRow(request.rows[0]);
    }
    if (request.rows[0].state !== "pending" || request.rows[0].phase !== "billing_complete") {
      await client.query("COMMIT");
      return statusFromRow(request.rows[0]);
    }
    const account = await client.query(
      `SELECT email FROM client_users WHERE id = $1 AND account_state = 'deletion_pending' FOR UPDATE`,
      [userId],
    );
    if (account.rows[0]) {
      const userEmail = String(account.rows[0].email).toLowerCase();
      await deleteMyFiveClassifiedRecords(client, userId, userEmail);
      await client.query("DELETE FROM portal_timeline_events WHERE user_id = $1", [userId]);
      await client.query("DELETE FROM portal_user_context WHERE user_id = $1", [userId]);
      await client.query("DELETE FROM client_subscriptions WHERE user_id = $1", [userId]);
      await client.query("DELETE FROM audit_logs WHERE lower(user_email) = $1", [userEmail]);
      await client.query("DELETE FROM client_users WHERE id = $1", [userId]);
    }
    const completed = await client.query(
      `UPDATE myfive_account_deletion_requests
       SET state = 'completed', phase = 'database_complete', last_error_code = NULL,
           next_attempt_at = NULL, completed_at = now(), updated_at = now()
       WHERE user_id = $1
       RETURNING state, phase, last_error_code`,
      [userId],
    );
    await client.query("COMMIT");
    return statusFromRow(completed.rows[0]);
  } catch (error) {
    try { await client.query("ROLLBACK"); } catch { /* transaction already closed */ }
    await pool.query(
      `UPDATE myfive_account_deletion_requests
       SET state = 'pending', attempt_count = attempt_count + 1,
           last_error_code = 'database_temporarily_unavailable',
           next_attempt_at = now() + interval '5 minutes', updated_at = now()
       WHERE user_id = $1 AND state = 'pending'`,
      [userId],
    );
    throw error;
  } finally {
    client.release();
  }
}

export async function resumeMyFiveAccountDeletion(
  pool: MyFiveDeletionPool,
  gateway: MyFiveBillingDeletionGateway | null,
  userId: string,
): Promise<MyFiveDeletionStatus> {
  const requestResult = await pool.query(
    `SELECT state, phase, last_error_code
     FROM myfive_account_deletion_requests WHERE user_id = $1`,
    [userId],
  );
  if (!requestResult.rows[0]) throw new Error("deletion_request_not_found");
  let status = statusFromRow(requestResult.rows[0]);
  if (status.state !== "pending") return status;

  if (status.phase === "intent_committed") {
    const membership = await pool.query(
      `SELECT stripe_customer_id, stripe_subscription_id
       FROM myfive_subscriptions WHERE user_id = $1`,
      [userId],
    );
    const customerId = membership.rows[0]?.stripe_customer_id as string | null | undefined;
    const subscriptionId = membership.rows[0]?.stripe_subscription_id as string | null | undefined;
    let outcome: BillingOutcome = { kind: "complete" };
    if (customerId || subscriptionId) {
      if (!gateway) {
        outcome = { kind: "action_required", code: "stripe_not_configured" };
      } else {
        try {
          if (customerId) await gateway.deleteCustomer(customerId);
          else if (subscriptionId) await gateway.cancelSubscription(subscriptionId);
        } catch (error) {
          outcome = classifyStripeDeletionError(error);
        }
      }
    }
    status = await recordBillingOutcome(pool, userId, outcome);
    if (status.state !== "pending" || status.phase !== "billing_complete") return status;
  }

  return eraseDatabaseRecords(pool, userId);
}

export async function resumeDueMyFiveAccountDeletions(
  pool: MyFiveDeletionPool,
  gateway: MyFiveBillingDeletionGateway | null,
  limit = 20,
): Promise<{ attempted: number; completed: number }> {
  const due = await pool.query(
    `SELECT user_id FROM myfive_account_deletion_requests
     WHERE state = 'pending' AND (next_attempt_at IS NULL OR next_attempt_at <= now())
     ORDER BY requested_at LIMIT $1`,
    [limit],
  );
  let completed = 0;
  for (const row of due.rows) {
    try {
      const result = await resumeMyFiveAccountDeletion(pool, gateway, row.user_id);
      if (result.state === "completed") completed += 1;
    } catch {
      // The durable request contains a redacted error code and remains retryable.
    }
  }
  return { attempted: due.rows.length, completed };
}
