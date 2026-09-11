import assert from "node:assert/strict";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import type { AddressInfo } from "node:net";
import { test } from "node:test";
import express from "express";
import type { SessionData } from "express-session";
import {
  buildEapVoucherAuditDetails,
  createRequireMyFiveAccount,
  createRequireMyFiveAdminWriter,
  hasMyFiveSlotAccess,
  type MyFiveAccountAuthorizationRecord,
  type MyFiveAdminAuthorizationRecord,
} from "../server/routes/myfive-authorization";

type TestSession = Partial<SessionData>;

test("MyFive account gate distinguishes anonymous, invalid, inactive, and active sessions", async (t) => {
  const accounts = new Map<string, MyFiveAccountAuthorizationRecord>([
    ["client-a", { id: "client-a", email: "a@example.test", isActive: "true" }],
    ["client-b", { id: "client-b", email: "b@example.test", isActive: "true" }],
    ["outsider", { id: "outsider", email: "outsider@example.test", isActive: "true" }],
    ["inactive", { id: "inactive", email: "inactive@example.test", isActive: "false" }],
  ]);
  const admins = new Map<string, MyFiveAdminAuthorizationRecord>([
    ["admin-viewer", { id: "admin-viewer", email: "viewer@example.test", role: "viewer", isActive: "true" }],
    ["admin-writer", { id: "admin-writer", email: "writer@example.test", role: "admin", isActive: "true" }],
  ]);
  const sessions = new Map<string, TestSession>([
    ["anonymous", {}],
    ["client-a", { clientUserId: "client-a", clientEmail: "a@example.test" }],
    ["client-b", { clientUserId: "client-b", clientEmail: "b@example.test" }],
    ["outsider", { clientUserId: "outsider", clientEmail: "outsider@example.test" }],
    ["orphan", { clientUserId: "orphan", clientEmail: "orphan@example.test" }],
    ["mismatched-email", { clientUserId: "client-a", clientEmail: "b@example.test" }],
    ["inactive", { clientUserId: "inactive", clientEmail: "inactive@example.test" }],
    ["admin-viewer", {
      isAdmin: true,
      adminUserId: "admin-viewer",
      adminEmail: "viewer@example.test",
      adminRole: "viewer",
    }],
    ["admin-writer", {
      isAdmin: true,
      adminUserId: "admin-writer",
      adminEmail: "writer@example.test",
      adminRole: "admin",
    }],
  ]);

  const app = express();
  app.use((req, _res, next) => {
    req.session = sessions.get(req.header("x-test-identity") ?? "anonymous") as unknown as typeof req.session;
    next();
  });
  app.get(
    "/account-scoped",
    createRequireMyFiveAccount(async (userId) => accounts.get(userId) ?? null),
    (_req, res) => res.json({ allowed: true }),
  );
  app.post(
    "/admin-write",
    createRequireMyFiveAdminWriter(async (adminUserId) => admins.get(adminUserId) ?? null),
    (_req, res) => res.json({ allowed: true }),
  );

  const server = app.listen(0, "127.0.0.1");
  t.after(() => new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));
  await once(server, "listening");
  const { port } = server.address() as AddressInfo;

  async function request(path: string, identity: string, method = "GET") {
    const response = await fetch(`http://127.0.0.1:${port}${path}`, {
      method,
      headers: { "x-test-identity": identity },
    });
    return { status: response.status, body: await response.json() as Record<string, unknown> };
  }

  assert.deepEqual(await request("/account-scoped", "anonymous"), {
    status: 401,
    body: { error: "authentication_required" },
  });
  assert.deepEqual(await request("/account-scoped", "orphan"), {
    status: 401,
    body: { error: "account_session_invalid" },
  });
  assert.deepEqual(await request("/account-scoped", "mismatched-email"), {
    status: 401,
    body: { error: "account_session_invalid" },
  });
  assert.deepEqual(await request("/account-scoped", "inactive"), {
    status: 403,
    body: { error: "account_inactive" },
  });
  for (const identity of ["client-a", "client-b", "outsider"]) {
    assert.deepEqual(await request("/account-scoped", identity), {
      status: 200,
      body: { allowed: true },
    });
  }

  assert.deepEqual(await request("/admin-write", "anonymous", "POST"), {
    status: 401,
    body: { error: "admin_authentication_required" },
  });
  assert.deepEqual(await request("/admin-write", "admin-viewer", "POST"), {
    status: 403,
    body: { error: "admin_write_access_required" },
  });
  assert.deepEqual(await request("/admin-write", "admin-writer", "POST"), {
    status: 200,
    body: { allowed: true },
  });
});

test("record-level slot policy allows A and linked B while denying an unrelated account", () => {
  const linkedSlot = {
    userId: "client-a",
    partnerUserId: "client-b",
    status: "active",
    isSelfVault: "false",
  };

  assert.equal(hasMyFiveSlotAccess("client-a", linkedSlot, "owner"), true);
  assert.equal(hasMyFiveSlotAccess("client-b", linkedSlot, "owner"), false);
  assert.equal(hasMyFiveSlotAccess("client-a", linkedSlot, "participant"), true);
  assert.equal(hasMyFiveSlotAccess("client-b", linkedSlot, "participant"), true);
  assert.equal(hasMyFiveSlotAccess("outsider", linkedSlot, "participant"), false);
  assert.equal(hasMyFiveSlotAccess("client-a", { ...linkedSlot, status: "revoked" }, "participant"), false);
  assert.equal(hasMyFiveSlotAccess("client-a", { ...linkedSlot, isSelfVault: "true" }, "participant", false), false);
});

test("all MyFive server-data routes use the account gate and no session actor fallback remains", async () => {
  const source = await readFile("server/routes/myfive.ts", "utf8");
  const protectedRouteSignatures = [
    'myfiveRouter.get("/slots", requireMyFiveAccount,',
    'myfiveRouter.post("/slots", requireMyFiveAccount,',
    'myfiveRouter.post("/slots/:slotId/invitations", requireMyFiveAccount,',
    'myfiveRouter.post("/invitations/:token/accept", requireMyFiveAccount,',
    'myfiveRouter.post("/consent", requireMyFiveAccount,',
    'myfiveRouter.post("/consent/withdraw", requireMyFiveAccount,',
    'myfiveRouter.get("/agreements/:slotId", requireMyFiveAccount,',
    'myfiveRouter.post("/agreements", requireMyFiveAccount,',
    'myfiveRouter.get("/love-profiles/:slotId", requireMyFiveAccount,',
    'myfiveRouter.post("/love-profiles", requireMyFiveAccount,',
    'myfiveRouter.get("/data-export", setDataExportPrivacyHeaders, requireMyFiveAccount,',
    'myfiveRouter.delete("/account", requireMyFiveAccount,',
    'myfiveRouter.post("/eap-vouchers/redeem", requireMyFiveAccount,',
    'myfiveRouter.post("/subscription/checkout", requireMyFiveAccount,',
    'myfiveRouter.post("/subscription/confirm", requireMyFiveAccount,',
    'myfiveRouter.get("/subscription", requireMyFiveAccount,',
  ];

  for (const signature of protectedRouteSignatures) {
    assert.equal(source.includes(signature), true, `missing account gate: ${signature}`);
  }
  assert.match(source, /myfiveRouter\.post\("\/admin\/eap-vouchers", requireMyFiveAdminWriter,/);
  assert.doesNotMatch(source, /myfiveActorId|session:\$\{|randomUUID/);
  assert.match(source, /Verified Stripe signature required for MyFive subscription persistence/);
  assert.match(source, /Active MyFive account required for subscription persistence/);
});

test("MyFive subscription webhooks are downstream of Stripe signature verification", async () => {
  const source = await readFile("server/routes.ts", "utf8");
  const verificationIndex = source.indexOf("stripe.webhooks.constructEvent(");
  const myFiveHandlerIndex = source.indexOf("await handleMyFiveStripeEvent(event)");
  assert.notEqual(verificationIndex, -1);
  assert.notEqual(myFiveHandlerIndex, -1);
  assert.equal(verificationIndex < myFiveHandlerIndex, true);
});

test("voucher audit details are allowlisted and exclude the code and hash", () => {
  const rawCode = "EAP-PRIVATE-CODE";
  const codeHash = "private-code-hash";
  const details = buildEapVoucherAuditDetails({
    voucherId: "voucher-1",
    organizationLabel: "Example Organization",
    maxRedemptions: 25,
    expiresAt: new Date("2030-01-02T03:04:05.000Z"),
  });

  assert.deepEqual(details, {
    voucherId: "voucher-1",
    organizationLabel: "Example Organization",
    maxRedemptions: 25,
    expiresAt: "2030-01-02T03:04:05.000Z",
  });
  assert.equal(JSON.stringify(details).includes(rawCode), false);
  assert.equal(JSON.stringify(details).includes(codeHash), false);
  assert.equal("code" in details, false);
  assert.equal("codeHash" in details, false);
});

test("voucher creation persists its allowlisted audit record in the voucher transaction", async () => {
  const source = await readFile("server/routes/myfive.ts", "utf8");
  assert.match(source, /db\.transaction\([\s\S]*transaction\.insert\(myfiveEapVouchers\)[\s\S]*transaction\.insert\(auditLogs\)/);
  assert.match(source, /actionType: "CREATE_MYFIVE_EAP_VOUCHER"/);
  assert.match(source, /details: buildEapVoucherAuditDetails/);
  assert.match(source, /userEmail: `admin-account:\$\{req\.session\.adminUserId!\}`/);
});
