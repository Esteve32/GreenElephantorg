import assert from "node:assert/strict";
import { once } from "node:events";
import { afterEach, test } from "node:test";
import type { AddressInfo } from "node:net";
import express from "express";
import type { Server } from "node:http";
import { createApiRequestLogger } from "../server/api-request-logger";

const servers: Server[] = [];

afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  })));
});

test("API logs contain only the route pattern and operational metadata", async () => {
  const lines: string[] = [];
  const app = express();
  app.use(createApiRequestLogger((line) => lines.push(line)));
  const router = express.Router();
  router.get("/invitations/:token/accept", (_req, res) => {
    res.json({
      invitationUrl: "https://example.test/invite/sensitive-invite-token",
      voucherCode: "EAP-SENSITIVE-CODE",
      email: "private@example.test",
      reflection: "private free text",
    });
  });
  app.use("/api/myfive", router);

  const server = app.listen(0, "127.0.0.1");
  servers.push(server);
  await once(server, "listening");
  const { port } = server.address() as AddressInfo;
  const response = await fetch(
    `http://127.0.0.1:${port}/api/myfive/invitations/sensitive-invite-token/accept?authorization=sensitive-query-token`,
    { headers: { authorization: "Bearer sensitive-header-token", cookie: "session=sensitive-cookie" } },
  );
  assert.equal(response.status, 200);
  await response.text();
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(lines.length, 1);
  assert.match(lines[0], /^GET \/api\/myfive\/invitations\/:token\/accept 200 in \d+ms$/);
  for (const forbidden of [
    "sensitive-invite-token",
    "sensitive-query-token",
    "sensitive-header-token",
    "sensitive-cookie",
    "EAP-SENSITIVE-CODE",
    "private@example.test",
    "private free text",
    "invitationUrl",
  ]) {
    assert.equal(lines[0].includes(forbidden), false, `log exposed ${forbidden}`);
  }
});

test("unmatched API paths do not echo attacker-controlled path segments", async () => {
  const lines: string[] = [];
  const app = express();
  app.use(createApiRequestLogger((line) => lines.push(line)));
  app.use((_req, res) => res.status(404).json({ error: "not found" }));

  const server = app.listen(0, "127.0.0.1");
  servers.push(server);
  await once(server, "listening");
  const { port } = server.address() as AddressInfo;
  const response = await fetch(`http://127.0.0.1:${port}/api/sensitive-unmatched-token`);
  assert.equal(response.status, 404);
  await response.text();
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(lines.length, 1);
  assert.match(lines[0], /^GET \/api\/<unmatched> 404 in \d+ms$/);
  assert.equal(lines[0].includes("sensitive-unmatched-token"), false);
});
