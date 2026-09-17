import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import pg from "pg";
import {
  deleteMyFiveClassifiedRecords,
  type MyFiveDeletionQueryClient,
} from "../server/myfive-ownership-deletion";
import {
  readExportableMyFiveAgreements,
  type MyFiveExportQueryClient,
} from "../server/myfive-ownership-export";
import {
  beginMyFiveAccountDeletion,
  resumeMyFiveAccountDeletion,
  type MyFiveBillingDeletionGateway,
  type MyFiveDeletionPool,
} from "../server/myfive-account-deletion";

const databaseUrl = process.env.TEST_DATABASE_URL;

function assertDisposableDatabaseUrl(value: string): void {
  const url = new URL(value);
  assert.ok(["localhost", "127.0.0.1"].includes(url.hostname), "fixture database must be local");
  assert.equal(url.pathname, "/myfive_test", "fixture database must use the dedicated myfive_test database");
}

async function applyMigration(client: pg.Client, path: string): Promise<void> {
  await client.query(await readFile(path, "utf8"));
}

async function seedPair(client: pg.Client, prefix: string, agreementCreator: "owner" | "partner" = "owner") {
  const owner = `${prefix}-owner`;
  const partner = `${prefix}-partner`;
  const slot = `${prefix}-slot`;
  const ownerReceipt = `${prefix}-owner-receipt`;
  const partnerReceipt = `${prefix}-partner-receipt`;
  await client.query(
    `INSERT INTO myfive_connection_slots
      (id, user_id, slot_index, partner_name, partner_user_id, relation_type, status, is_self_vault)
     VALUES ($1, $2, 1, 'Provisional label', $3, 'Friend', 'active', 'false')`,
    [slot, owner, partner],
  );
  await client.query(
    `INSERT INTO myfive_connection_participants (id, connection_id, user_id, role)
     VALUES ($1, $2, $3, 'owner'), ($4, $2, $5, 'partner')`,
    [`${prefix}-owner-participant`, slot, owner, `${prefix}-partner-participant`, partner],
  );
  await client.query(
    `INSERT INTO myfive_love_profile_snapshots (id, actor_user_id, slot_id, profile)
     VALUES ($1, $2, $3, '{"owner":"private"}'::jsonb),
            ($4, $5, $3, '{"partner":"private"}'::jsonb)`,
    [`${prefix}-owner-profile`, owner, slot, `${prefix}-partner-profile`, partner],
  );
  await client.query(
    `INSERT INTO myfive_consent_ledger
      (id, actor_user_id, slot_id, consent_type, event_type, rules_version, accepted_rule_ids)
     VALUES ($1, $2, $3, 'agreement-sharing', 'accepted', 'v1', ARRAY['rule-1']),
            ($4, $5, $3, 'agreement-sharing', 'accepted', 'v1', ARRAY['rule-1'])`,
    [ownerReceipt, owner, slot, partnerReceipt, partner],
  );
  const creator = agreementCreator === "owner" ? owner : partner;
  const other = agreementCreator === "owner" ? partner : owner;
  await client.query(
    `INSERT INTO myfive_agreements
      (id, slot_id, creator_user_id, partner_user_id, slot_owner_user_id, slot_partner_user_id,
       agreement_text, value_rules_version, owner_consent_receipt_id, partner_consent_receipt_id,
       value_rules_consented, version)
     VALUES ($1, $2, $3, $4, $5, $6, 'Joint fixture text', 'v1', $7, $8, 'bilateral:fixture', 1)`,
    [`${prefix}-agreement`, slot, creator, other, owner, partner, ownerReceipt, partnerReceipt],
  );
  await client.query(
    `INSERT INTO myfive_agreement_denied_events
      (id, actor_user_id, slot_id, slot_owner_user_id, slot_partner_user_id, reason_code, rules_version)
     VALUES ($1, $2, $3, $2, $4, 'fixture', 'v1'),
            ($5, $4, $3, $2, $4, 'fixture', 'v1')`,
    [`${prefix}-owner-denied`, owner, slot, partner, `${prefix}-partner-denied`],
  );
  await client.query(
    `INSERT INTO myfive_subscriptions (id, user_id, plan_status, sponsor_user_id, sponsored_seats_allocated)
     VALUES ($1, $2, 'active', NULL, 1), ($3, $4, 'sponsored', $2, 0)`,
    [`${prefix}-owner-subscription`, owner, `${prefix}-partner-subscription`, partner],
  );
  return { owner, partner, slot };
}

test("Stage 4.3-D migration and both deletion orders preserve authorship and survivor custody", {
  skip: databaseUrl ? false : "TEST_DATABASE_URL is not configured; disposable PostgreSQL evidence runs in CI",
  timeout: 30_000,
}, async () => {
  assertDisposableDatabaseUrl(databaseUrl!);
  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    await client.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public");
    for (const migration of [
      "migrations/20260831_myfive_agreement_history.sql",
      "migrations/20260831_myfive_connection_seat_cap.sql",
      "migrations/20260831_myfive_love_flow_profiles.sql",
      "migrations/20260901_myfive_sponsored_invitations.sql",
      "migrations/20260911_myfive_bilateral_value_rules_consent.sql",
    ]) {
      await applyMigration(client, migration);
    }
    await client.query(
      `INSERT INTO myfive_check_ins
        (id, user_id, slot_id, flow_octant, private_reflection)
       VALUES ('legacy-check', 'legacy-user', 'legacy-slot', 'flow', 'quarantined fixture')`,
    );
    await applyMigration(client, "migrations/20260912_myfive_ownership_boundaries.sql");
    const legacyBefore = await client.query("SELECT * FROM myfive_check_ins WHERE id = 'legacy-check'");
    assert.equal(legacyBefore.rowCount, 1, "the migration must preserve quarantined check-ins");

    const first = await seedPair(client, "first", "owner");
    assert.equal((await readExportableMyFiveAgreements(client as MyFiveExportQueryClient, first.owner)).length, 1);
    assert.equal((await readExportableMyFiveAgreements(client as MyFiveExportQueryClient, first.partner)).length, 1);
    assert.equal((await readExportableMyFiveAgreements(client as MyFiveExportQueryClient, "unrelated-user")).length, 0);
    assert.equal((await readExportableMyFiveAgreements(client as MyFiveExportQueryClient, "admin-user")).length, 0);
    assert.equal((await readExportableMyFiveAgreements(client as MyFiveExportQueryClient, "break-glass-user")).length, 0);

    const profileVisibility = await Promise.all([
      first.owner,
      first.partner,
      "unrelated-user",
      "admin-user",
      "break-glass-user",
    ].map(async (actorUserId) => ({
      actorUserId,
      rows: (await client.query(
        `SELECT actor_user_id, profile
         FROM myfive_love_profile_snapshots
         WHERE actor_user_id = $1 AND slot_id = $2
         ORDER BY created_at DESC`,
        [actorUserId, first.slot],
      )).rows,
    })));
    assert.deepEqual(profileVisibility, [
      { actorUserId: first.owner, rows: [{ actor_user_id: first.owner, profile: { owner: "private" } }] },
      { actorUserId: first.partner, rows: [{ actor_user_id: first.partner, profile: { partner: "private" } }] },
      { actorUserId: "unrelated-user", rows: [] },
      { actorUserId: "admin-user", rows: [] },
      { actorUserId: "break-glass-user", rows: [] },
    ]);

    const lockHolder = new pg.Client({ connectionString: databaseUrl });
    const lockWaiter = new pg.Client({ connectionString: databaseUrl });
    await Promise.all([lockHolder.connect(), lockWaiter.connect()]);
    try {
      const lockKey = `myfive-agreement:${first.slot}`;
      await lockHolder.query("BEGIN");
      await lockHolder.query("SELECT pg_advisory_xact_lock(hashtext($1))", [lockKey]);
      await lockWaiter.query("BEGIN");
      const waiterLock = lockWaiter.query("SELECT pg_advisory_xact_lock(hashtext($1))", [lockKey]);
      const preCommit = await Promise.race([
        waiterLock.then(() => "acquired" as const),
        new Promise<"waiting">((resolve) => setTimeout(() => resolve("waiting"), 50)),
      ]);
      assert.equal(preCommit, "waiting", "a concurrent agreement mutation must wait for the slot lock");
      await lockHolder.query(
        `INSERT INTO myfive_consent_ledger
          (id, actor_user_id, slot_id, consent_type, event_type, rules_version, accepted_rule_ids, accepted_at)
         VALUES ($1, $2, $3, 'agreement-sharing', 'withdrawn', 'v1', ARRAY[]::text[], clock_timestamp())`,
        ["first-owner-withdrawal", first.owner, first.slot],
      );
      await lockHolder.query("COMMIT");
      await waiterLock;
      const latestOwnerConsent = await lockWaiter.query(
        `SELECT event_type
         FROM myfive_consent_ledger
         WHERE actor_user_id = $1 AND slot_id = $2 AND rules_version = 'v1'
         ORDER BY accepted_at DESC LIMIT 1`,
        [first.owner, first.slot],
      );
      assert.deepEqual(latestOwnerConsent.rows, [{ event_type: "withdrawn" }]);
      await lockWaiter.query("ROLLBACK");
    } finally {
      await Promise.all([lockHolder.end(), lockWaiter.end()]);
    }

    await client.query("BEGIN");
    await deleteMyFiveClassifiedRecords(client as MyFiveDeletionQueryClient, first.owner, "first-owner@example.test");
    await client.query("COMMIT");

    const frozenForPartner = await client.query(
      `SELECT creator_user_id, partner_user_id, slot_owner_user_id, slot_partner_user_id,
              owner_consent_receipt_id, partner_consent_receipt_id, lifecycle_state,
              frozen_at, survivor_user_id
       FROM myfive_agreements WHERE slot_id = $1`,
      [first.slot],
    );
    assert.deepEqual(frozenForPartner.rows.map((row) => ({
      creator: row.creator_user_id,
      partner: row.partner_user_id,
      owner: row.slot_owner_user_id,
      slotPartner: row.slot_partner_user_id,
      ownerReceipt: row.owner_consent_receipt_id,
      partnerReceipt: row.partner_consent_receipt_id,
      lifecycle: row.lifecycle_state,
      survivor: row.survivor_user_id,
      frozen: row.frozen_at instanceof Date,
    })), [{
      creator: null,
      partner: first.partner,
      owner: null,
      slotPartner: first.partner,
      ownerReceipt: null,
      partnerReceipt: null,
      lifecycle: "frozen",
      survivor: first.partner,
      frozen: true,
    }]);
    assert.equal((await client.query("SELECT 1 FROM myfive_love_profile_snapshots WHERE actor_user_id = $1", [first.owner])).rowCount, 0);
    assert.equal((await client.query("SELECT 1 FROM myfive_love_profile_snapshots WHERE actor_user_id = $1", [first.partner])).rowCount, 1);
    assert.equal((await client.query("SELECT 1 FROM myfive_consent_ledger WHERE actor_user_id = $1", [first.owner])).rowCount, 0);
    assert.equal((await client.query("SELECT 1 FROM myfive_consent_ledger WHERE actor_user_id = $1", [first.partner])).rowCount, 1);
    const partnerDenied = await client.query(
      "SELECT slot_owner_user_id, slot_partner_user_id FROM myfive_agreement_denied_events WHERE actor_user_id = $1",
      [first.partner],
    );
    assert.deepEqual(partnerDenied.rows, [{ slot_owner_user_id: null, slot_partner_user_id: first.partner }]);
    assert.equal((await readExportableMyFiveAgreements(client as MyFiveExportQueryClient, first.owner)).length, 0);
    const survivorExport = await readExportableMyFiveAgreements(client as MyFiveExportQueryClient, first.partner);
    assert.equal(survivorExport.length, 1);
    assert.equal(survivorExport[0].participantLifecycle, "survivor");
    assert.equal(survivorExport[0].lifecycleState, "frozen");
    assert.equal((await client.query("SELECT 1 FROM myfive_subscriptions WHERE user_id = $1", [first.owner])).rowCount, 0);
    assert.deepEqual(
      (await client.query("SELECT plan_status, sponsor_user_id FROM myfive_subscriptions WHERE user_id = $1", [first.partner])).rows,
      [{ plan_status: "canceled", sponsor_user_id: null }],
    );

    await client.query(
      `INSERT INTO myfive_agreement_custody_events
        (actor_user_id, connection_id, event_type, outcome)
       VALUES ($1, $2, 'export', 'success')`,
      [first.partner, first.slot],
    );
    await client.query("BEGIN");
    await deleteMyFiveClassifiedRecords(client as MyFiveDeletionQueryClient, first.partner, "first-partner@example.test");
    await client.query("COMMIT");
    assert.equal((await client.query("SELECT 1 FROM myfive_agreements WHERE slot_id = $1", [first.slot])).rowCount, 0);
    assert.equal((await client.query("SELECT 1 FROM myfive_connection_slots WHERE id = $1", [first.slot])).rowCount, 0);
    assert.equal((await client.query("SELECT 1 FROM myfive_connection_participants WHERE connection_id = $1", [first.slot])).rowCount, 0);
    assert.equal((await client.query("SELECT 1 FROM myfive_agreement_custody_events WHERE connection_id = $1", [first.slot])).rowCount, 0);

    const second = await seedPair(client, "second", "partner");
    await client.query(
      `INSERT INTO myfive_connection_participants (id, connection_id, user_id, role)
       VALUES ('collision-participant', $1, 'unexpected-third', 'partner')`,
      [second.slot],
    );
    await client.query("BEGIN");
    await assert.rejects(
      deleteMyFiveClassifiedRecords(client as MyFiveDeletionQueryClient, second.owner, "second-owner@example.test"),
      /cannot have more than one surviving participant/,
    );
    await client.query("ROLLBACK");
    assert.equal((await client.query("SELECT 1 FROM myfive_love_profile_snapshots WHERE actor_user_id = $1", [second.owner])).rowCount, 1);
    await client.query("DELETE FROM myfive_connection_participants WHERE user_id = 'unexpected-third'");

    await client.query("BEGIN");
    await deleteMyFiveClassifiedRecords(client as MyFiveDeletionQueryClient, second.partner, "second-partner@example.test");
    await client.query("COMMIT");
    const frozenForOwner = await client.query(
      `SELECT creator_user_id, partner_user_id, slot_owner_user_id, slot_partner_user_id,
              lifecycle_state, survivor_user_id
       FROM myfive_agreements WHERE slot_id = $1`,
      [second.slot],
    );
    assert.deepEqual(frozenForOwner.rows, [{
      creator_user_id: null,
      partner_user_id: second.owner,
      slot_owner_user_id: second.owner,
      slot_partner_user_id: null,
      lifecycle_state: "frozen",
      survivor_user_id: second.owner,
    }]);
    assert.equal((await readExportableMyFiveAgreements(client as MyFiveExportQueryClient, second.partner)).length, 0);
    assert.equal((await readExportableMyFiveAgreements(client as MyFiveExportQueryClient, second.owner)).length, 1);
    assert.deepEqual(
      (await client.query("SELECT partner_name, relation_type FROM myfive_connection_slots WHERE id = $1", [second.slot])).rows,
      [{ partner_name: null, relation_type: null }],
    );

    await client.query("BEGIN");
    await deleteMyFiveClassifiedRecords(client as MyFiveDeletionQueryClient, second.owner, "second-owner@example.test");
    await client.query("COMMIT");
    assert.equal((await client.query("SELECT 1 FROM myfive_agreements WHERE slot_id = $1", [second.slot])).rowCount, 0);
    assert.equal((await client.query("SELECT 1 FROM myfive_connection_slots WHERE id = $1", [second.slot])).rowCount, 0);
    assert.equal((await client.query("SELECT 1 FROM myfive_check_ins WHERE id = 'legacy-check'")).rowCount, 1);
  } finally {
    await client.end();
  }
});

test("Stage 4.3-E durable deletion revokes every session and resumes across Stripe and database failures", {
  skip: databaseUrl ? false : "TEST_DATABASE_URL is not configured; disposable PostgreSQL evidence runs in CI",
  timeout: 30_000,
}, async () => {
  assertDisposableDatabaseUrl(databaseUrl!);
  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    await client.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public");
    await client.query(`
      CREATE TABLE client_users (
        id varchar PRIMARY KEY,
        email text NOT NULL UNIQUE,
        is_active text DEFAULT 'true' NOT NULL
      );
      CREATE TABLE portal_timeline_events (id varchar PRIMARY KEY, user_id varchar NOT NULL);
      CREATE TABLE portal_user_context (id varchar PRIMARY KEY, user_id varchar NOT NULL);
      CREATE TABLE client_subscriptions (id varchar PRIMARY KEY, user_id varchar NOT NULL);
      CREATE TABLE audit_logs (id varchar PRIMARY KEY, user_email text NOT NULL);
    `);
    for (const migration of [
      "migrations/20260831_myfive_agreement_history.sql",
      "migrations/20260831_myfive_connection_seat_cap.sql",
      "migrations/20260831_myfive_love_flow_profiles.sql",
      "migrations/20260901_myfive_sponsored_invitations.sql",
      "migrations/20260911_myfive_bilateral_value_rules_consent.sql",
      "migrations/20260912_myfive_ownership_boundaries.sql",
      "migrations/20260915_myfive_resumable_account_deletion.sql",
    ]) {
      await applyMigration(client, migration);
    }

    const pooled = new pg.Pool({ connectionString: databaseUrl });
    try {
      await client.query(
        `INSERT INTO client_users (id, email) VALUES ('retry-user', 'retry@example.test');
         INSERT INTO myfive_subscriptions (id, user_id, stripe_customer_id) VALUES ('retry-sub', 'retry-user', 'cus_fixture');
         INSERT INTO "session" (sid, sess, expire) VALUES
           ('retry-session-1', '{"clientUserId":"retry-user","clientEmail":"retry@example.test","clientAuthVersion":1}', now() + interval '1 day'),
           ('retry-session-2', '{"clientUserId":"retry-user","clientEmail":"retry@example.test","clientAuthVersion":1}', now() + interval '1 day'),
           ('other-session', '{"clientUserId":"other-user"}', now() + interval '1 day');`,
      );

      await client.query(`
        CREATE FUNCTION reject_first_deletion_intent() RETURNS trigger AS $$
        BEGIN RAISE EXCEPTION 'fixture database unavailable'; END; $$ LANGUAGE plpgsql;
        CREATE TRIGGER reject_first_deletion_intent
        BEFORE UPDATE OF account_state ON client_users
        FOR EACH ROW WHEN (NEW.id = 'retry-user') EXECUTE FUNCTION reject_first_deletion_intent();
      `);
      await assert.rejects(beginMyFiveAccountDeletion(pooled as unknown as MyFiveDeletionPool, "retry-user"));
      assert.equal((await client.query("SELECT 1 FROM myfive_account_deletion_requests WHERE user_id = 'retry-user'")).rowCount, 0);
      assert.equal((await client.query("SELECT 1 FROM \"session\" WHERE sess ->> 'clientUserId' = 'retry-user'")).rowCount, 2);
      await client.query("DROP TRIGGER reject_first_deletion_intent ON client_users; DROP FUNCTION reject_first_deletion_intent()");

      assert.deepEqual(
        await beginMyFiveAccountDeletion(pooled as unknown as MyFiveDeletionPool, "retry-user"),
        { state: "pending", phase: "intent_committed", errorCode: null },
      );
      assert.deepEqual(
        (await client.query("SELECT account_state, auth_version FROM client_users WHERE id = 'retry-user'")).rows,
        [{ account_state: "deletion_pending", auth_version: 2 }],
      );
      assert.equal((await client.query("SELECT 1 FROM \"session\" WHERE sess ->> 'clientUserId' = 'retry-user'")).rowCount, 0);
      assert.equal((await client.query("SELECT 1 FROM \"session\" WHERE sid = 'other-session'")).rowCount, 1);

      let customerDeletes = 0;
      const transientGateway: MyFiveBillingDeletionGateway = {
        async deleteCustomer() {
          customerDeletes += 1;
          throw { type: "StripeConnectionError" };
        },
        async cancelSubscription() { throw new Error("unexpected subscription cancellation"); },
      };
      assert.deepEqual(
        await resumeMyFiveAccountDeletion(pooled as unknown as MyFiveDeletionPool, transientGateway, "retry-user"),
        { state: "pending", phase: "intent_committed", errorCode: "stripe_temporarily_unavailable" },
      );
      assert.equal(customerDeletes, 1);
      assert.equal((await client.query("SELECT 1 FROM client_users WHERE id = 'retry-user' AND account_state = 'active'")).rowCount, 0);

      const successGateway: MyFiveBillingDeletionGateway = {
        async deleteCustomer() { customerDeletes += 1; },
        async cancelSubscription() { throw new Error("unexpected subscription cancellation"); },
      };
      assert.deepEqual(
        await resumeMyFiveAccountDeletion(pooled as unknown as MyFiveDeletionPool, successGateway, "retry-user"),
        { state: "completed", phase: "database_complete", errorCode: null },
      );
      assert.equal(customerDeletes, 2);
      assert.equal((await client.query("SELECT 1 FROM client_users WHERE id = 'retry-user'")).rowCount, 0);
      assert.equal((await client.query("SELECT 1 FROM myfive_subscriptions WHERE user_id = 'retry-user'")).rowCount, 0);
      assert.deepEqual(
        await resumeMyFiveAccountDeletion(pooled as unknown as MyFiveDeletionPool, successGateway, "retry-user"),
        { state: "completed", phase: "database_complete", errorCode: null },
      );
      assert.equal(customerDeletes, 2, "completed replay must not repeat Stripe work");

      await client.query("INSERT INTO client_users (id, email) VALUES ('missing-user', 'missing@example.test')");
      await beginMyFiveAccountDeletion(pooled as unknown as MyFiveDeletionPool, "missing-user");
      const noBillingCalls: MyFiveBillingDeletionGateway = {
        async deleteCustomer() { throw new Error("billing must be skipped"); },
        async cancelSubscription() { throw new Error("billing must be skipped"); },
      };
      assert.equal((await resumeMyFiveAccountDeletion(pooled as unknown as MyFiveDeletionPool, noBillingCalls, "missing-user")).state, "completed");

      const pair = await seedPair(client, "db-retry");
      await client.query(
        `INSERT INTO client_users (id, email)
         VALUES ($1, 'db-retry-owner@example.test'), ($2, 'db-retry-partner@example.test')`,
        [pair.owner, pair.partner],
      );
      await client.query(
        `INSERT INTO myfive_connection_participants (id, connection_id, user_id, role)
         VALUES ('db-retry-collision', $1, 'unexpected-third', 'partner')`,
        [pair.slot],
      );
      await beginMyFiveAccountDeletion(pooled as unknown as MyFiveDeletionPool, pair.owner);
      let databaseRetryBillingCalls = 0;
      const databaseRetryGateway: MyFiveBillingDeletionGateway = {
        async deleteCustomer() { databaseRetryBillingCalls += 1; },
        async cancelSubscription() { databaseRetryBillingCalls += 1; },
      };
      await assert.rejects(resumeMyFiveAccountDeletion(pooled as unknown as MyFiveDeletionPool, databaseRetryGateway, pair.owner));
      assert.deepEqual(
        (await client.query("SELECT state, phase, last_error_code FROM myfive_account_deletion_requests WHERE user_id = $1", [pair.owner])).rows,
        [{ state: "pending", phase: "billing_complete", last_error_code: "database_temporarily_unavailable" }],
      );
      await client.query("DELETE FROM myfive_connection_participants WHERE id = 'db-retry-collision'");
      assert.equal((await resumeMyFiveAccountDeletion(pooled as unknown as MyFiveDeletionPool, databaseRetryGateway, pair.owner)).state, "completed");
      assert.equal(databaseRetryBillingCalls, 0, "database-phase retry must not repeat already-completed billing work");

      await client.query(`
        INSERT INTO client_users (id, email) VALUES ('action-user', 'action@example.test');
        INSERT INTO myfive_subscriptions (id, user_id, stripe_subscription_id)
        VALUES ('action-sub', 'action-user', 'sub_fixture');
      `);
      await beginMyFiveAccountDeletion(pooled as unknown as MyFiveDeletionPool, "action-user");
      const rejectedGateway: MyFiveBillingDeletionGateway = {
        async deleteCustomer() { throw new Error("unexpected customer deletion"); },
        async cancelSubscription() { throw { statusCode: 400, code: "provider-private-code" }; },
      };
      assert.deepEqual(
        await resumeMyFiveAccountDeletion(pooled as unknown as MyFiveDeletionPool, rejectedGateway, "action-user"),
        { state: "action_required", phase: "intent_committed", errorCode: "stripe_configuration_or_request_rejected" },
      );
      assert.equal((await client.query("SELECT 1 FROM client_users WHERE id = 'action-user' AND account_state = 'deletion_pending'")).rowCount, 1);
      assert.equal(JSON.stringify((await client.query("SELECT * FROM myfive_account_deletion_requests WHERE user_id = 'action-user'")).rows).includes("provider-private-code"), false);
    } finally {
      await pooled.end();
    }
  } finally {
    await client.end();
  }
});
