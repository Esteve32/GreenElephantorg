import assert from "node:assert/strict";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import type { AddressInfo } from "node:net";
import { test } from "node:test";
import express from "express";
import {
  createMyFiveErrorHandler,
  createMyFiveSecurityHeaders,
  myFiveContentSecurityPolicy,
  writeMyFiveOperationalFailure,
} from "../server/myfive-security";
import {
  EMPTY_LOVE_FLOW_PROFILE,
  FLOW_OCTANT_STATES,
  GREEK_LOVE_TYPES,
  isLoveFlowProfile,
} from "../shared/loveFlowProfile";

test("MyFive CSP, permissions, and error boundary fail closed without serializing private input", async (t) => {
  const logs: string[] = [];
  const app = express();
  app.use(createMyFiveSecurityHeaders(false));
  app.use(express.json());
  app.post("/api/myfive/failure", () => {
    throw new Error("PRIVATE-SENTINEL reflection@example.test cs_secret_fixture");
  });
  app.use(createMyFiveErrorHandler((line) => logs.push(line)));

  const server = app.listen(0, "127.0.0.1");
  t.after(() => new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));
  await once(server, "listening");
  const { port } = server.address() as AddressInfo;

  const failed = await fetch(`http://127.0.0.1:${port}/api/myfive/failure`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ reflection: "PRIVATE-SENTINEL" }),
  });
  assert.equal(failed.status, 500);
  assert.deepEqual(await failed.json(), { error: "internal_error" });
  assert.equal(failed.headers.get("cache-control"), "private, no-store, max-age=0");
  assert.equal(failed.headers.get("permissions-policy"), "camera=(), microphone=(), geolocation=()");
  assert.equal(failed.headers.get("referrer-policy"), "no-referrer");
  assert.equal(failed.headers.get("x-frame-options"), "DENY");
  const policy = failed.headers.get("content-security-policy") ?? "";
  assert.equal(policy, myFiveContentSecurityPolicy(false));
  assert.match(policy, /script-src 'self'/);
  assert.match(policy, /connect-src 'self'/);
  assert.doesNotMatch(policy, /script-src[^;]*(?:unsafe-inline|unsafe-eval)/);
  assert.doesNotMatch(policy, /connect-src[^;]*(?:https:|wss:|\*)/);

  const malformed = await fetch(`http://127.0.0.1:${port}/api/myfive/failure`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{\"reflection\":\"PRIVATE-SENTINEL\"",
  });
  assert.equal(malformed.status, 400);
  assert.deepEqual(await malformed.json(), { error: "invalid_json" });

  assert.equal(logs.length, 2);
  assert.deepEqual(logs.map((line) => JSON.parse(line)), [
    { service: "myfive", severity: "error", event: "unhandled_request_failed" },
    { service: "myfive", severity: "error", event: "unhandled_request_failed" },
  ]);
  assert.equal(logs.join("\n").includes("PRIVATE-SENTINEL"), false);
  assert.equal(logs.join("\n").includes("reflection@example.test"), false);
  assert.equal(logs.join("\n").includes("cs_secret_fixture"), false);
});

test("MyFive operational failures are allowlisted and never accept exception payloads at call sites", async () => {
  const output: string[] = [];
  writeMyFiveOperationalFailure("data_export_failed", (line) => output.push(line));
  assert.deepEqual(output.map((line) => JSON.parse(line)), [
    { service: "myfive", severity: "error", event: "data_export_failed" },
  ]);

  const files = await Promise.all([
    "server/routes/myfive.ts",
    "server/routes/myfive-authorization.ts",
    "server/myfive-deletion-scheduler.ts",
    "server/myfive-provisional-cleanup.ts",
  ].map((path) => readFile(path, "utf8")));
  const source = files.join("\n");
  assert.doesNotMatch(source, /console\.error\s*\(/);
  assert.doesNotMatch(source, /writeMyFiveOperationalFailure\s*\(\s*[^,)]+\s*,/);

  const clientFiles = await Promise.all([
    "client/src/pages/myfive/CheckInPage.tsx",
    "client/src/components/myfive/ValueRulesConsentGate.tsx",
  ].map((path) => readFile(path, "utf8")));
  assert.doesNotMatch(clientFiles.join("\n"), /console\.error\s*\([^)]*,/);
});

test("browser-vault check-in and local export preparation have no private-payload network path", async () => {
  const [checkInPage, vault, settings, serverBoundary, serverRoutes] = await Promise.all([
    readFile("client/src/pages/myfive/CheckInPage.tsx", "utf8"),
    readFile("client/src/lib/myfiveVault.ts", "utf8"),
    readFile("client/src/pages/myfive/SettingsPage.tsx", "utf8"),
    readFile("server/routes/myfive-private-check-in.ts", "utf8"),
    readFile("server/routes/myfive.ts", "utf8"),
  ]);
  const networkPrimitive = /\b(?:fetch|apiRequest|XMLHttpRequest|WebSocket|sendBeacon)\s*\(/;
  assert.match(checkInPage, /savePrivateCheckIn\s*\(/);
  assert.doesNotMatch(checkInPage, networkPrimitive);
  assert.match(vault, /indexedDB\.open/);
  assert.match(vault, /crypto\.subtle\.encrypt/);
  assert.doesNotMatch(vault, networkPrimitive);

  const localExportPreparation = settings.slice(
    settings.indexOf("const localCheckIns = await exportPrivateVault()"),
    settings.indexOf("const blob = new Blob"),
  );
  assert.match(localExportPreparation, /localBrowserVault:[\s\S]*checkIns: localCheckIns/);
  assert.doesNotMatch(localExportPreparation, networkPrimitive);
  assert.match(serverBoundary, /res\.status\(410\)/);
  assert.doesNotMatch(serverBoundary, /(?:db|pool)\./);
  assert.doesNotMatch(serverRoutes, /\.from\(myfiveCheckIns\)|insert\(myfiveCheckIns\)|privateReflection\s*:/);
});

test("Connection Profiles accept only the explicit eight-octant vocabulary and remain author-scoped", async () => {
  assert.deepEqual([...FLOW_OCTANT_STATES], [
    "arousal", "flow", "control", "relaxation", "boredom", "apathy", "worry", "anxiety",
  ]);
  assert.equal(GREEK_LOVE_TYPES.length, 8);
  assert.equal(Object.values(EMPTY_LOVE_FLOW_PROFILE).every((value) => value === null), true);
  const explicit = Object.fromEntries(GREEK_LOVE_TYPES.map((love, index) => [
    love,
    index === 0 ? null : FLOW_OCTANT_STATES[index],
  ]));
  assert.equal(isLoveFlowProfile(explicit), true);
  assert.equal(isLoveFlowProfile({ ...explicit, philia: "diagnosed" }), false);
  assert.equal(isLoveFlowProfile({ ...explicit, inferredScore: 0.92 }), false);
  const { [GREEK_LOVE_TYPES[0]]: _removed, ...missingDimension } = explicit;
  assert.equal(isLoveFlowProfile(missingDimension), false);

  const source = await readFile("server/routes/myfive.ts", "utf8");
  const profileRead = source.slice(
    source.indexOf('myfiveRouter.get("/love-profiles/:slotId"'),
    source.indexOf("// Append a complete snapshot"),
  );
  assert.match(profileRead, /requireMyFiveAccount/);
  assert.match(profileRead, /findReadableConnection\(actorUserId, slotId\)/);
  assert.match(profileRead, /myfiveLoveProfileSnapshots\.actorUserId, actorUserId/);
  assert.match(profileRead, /myfiveLoveProfileSnapshots\.slotId, slotId/);

  const dataExport = source.slice(
    source.indexOf('myfiveRouter.get("/data-export"'),
    source.indexOf('myfiveRouter.delete("/account"'),
  );
  assert.match(dataExport, /myfiveLoveProfileSnapshots\.actorUserId, userId/);
  assert.doesNotMatch(dataExport, /myfiveLoveProfileSnapshots\.slotId[\s\S]*myfiveConnectionParticipants/);
});
