import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import express from "express";
import type { AddressInfo } from "node:net";
import { once } from "node:events";
import { rejectServerPrivateCheckIn } from "../server/routes/myfive-private-check-in";

test("server check-in endpoint is fail-closed and never echoes private input", async (t) => {
  const app = express();
  app.use(express.json());
  app.post("/api/myfive/check-in", rejectServerPrivateCheckIn);
  const server = app.listen(0, "127.0.0.1");
  t.after(() => new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));
  await once(server, "listening");
  const { port } = server.address() as AddressInfo;

  const response = await fetch(`http://127.0.0.1:${port}/api/myfive/check-in`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ octant: "flow", reflectionText: "sensitive reflection" }),
  });
  const body = await response.json() as Record<string, unknown>;

  assert.equal(response.status, 410);
  assert.equal(body.error, "server_private_check_in_disabled");
  assert.equal(JSON.stringify(body).includes("sensitive reflection"), false);
  assert.equal("octant" in body, false);
  assert.equal("savedAt" in body, false);
});

test("active check-in UI writes only to the browser vault", async () => {
  const source = await readFile("client/src/pages/myfive/CheckInPage.tsx", "utf8");
  assert.match(source, /savePrivateCheckIn\s*\(/);
  assert.doesNotMatch(source, /fetch\s*\(/);
  assert.doesNotMatch(source, /\/api\/myfive\/check-in/);
});

test("server export cannot serialize quarantined private reflections", async () => {
  const routeSource = await readFile("server/routes/myfive.ts", "utf8");
  const exportSource = await readFile("shared/myfiveDataExport.ts", "utf8");
  assert.doesNotMatch(routeSource, /\.from\(myfiveCheckIns\)/);
  assert.doesNotMatch(routeSource, /privateReflection\s*:/);
  assert.doesNotMatch(exportSource, /privateServerCheckIns/);
});
