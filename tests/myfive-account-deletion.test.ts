import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { classifyStripeDeletionError } from "../server/myfive-account-deletion";

test("Stripe deletion outcomes are redacted and split into idempotent, retry, and operator paths", () => {
  assert.deepEqual(classifyStripeDeletionError({ statusCode: 404, code: "resource_missing" }), { kind: "complete" });
  assert.deepEqual(classifyStripeDeletionError({ statusCode: 429 }), { kind: "retry", code: "stripe_rate_limited" });
  assert.deepEqual(classifyStripeDeletionError({ statusCode: 500 }), { kind: "retry", code: "stripe_temporarily_unavailable" });
  assert.deepEqual(classifyStripeDeletionError({ type: "StripeConnectionError" }), { kind: "retry", code: "stripe_temporarily_unavailable" });
  assert.deepEqual(classifyStripeDeletionError({ statusCode: 400, code: "secret-provider-detail" }), {
    kind: "action_required",
    code: "stripe_configuration_or_request_rejected",
  });
  assert.equal(JSON.stringify(classifyStripeDeletionError({ statusCode: 400, code: "secret-provider-detail" })).includes("secret-provider-detail"), false);
});

test("Stage 4.3-E query switches deny stale sessions and webhook re-entitlement", async () => {
  const authorization = await readFile("server/routes/myfive-authorization.ts", "utf8");
  const portalAuth = await readFile("server/portal-auth.ts", "utf8");
  const stripeRoutes = await readFile("server/routes/myfive.ts", "utf8");
  const migration = await readFile("migrations/20260915_myfive_resumable_account_deletion.sql", "utf8");

  assert.match(authorization, /clientAuthVersion !== account\.authVersion/);
  assert.match(authorization, /account\.accountState !== "active"/);
  assert.match(portalAuth, /clientAuthVersion !== user\.authVersion/);
  assert.match(portalAuth, /user\.accountState !== "active"/);
  assert.match(stripeRoutes, /accounts\.account_state = 'active'/);
  assert.match(migration, /DELETE FROM "session"|CREATE TABLE IF NOT EXISTS "session"/);
  assert.doesNotMatch(stripeRoutes, /await stripe\.customers\.del[\s\S]*DELETE FROM client_users/);
});
