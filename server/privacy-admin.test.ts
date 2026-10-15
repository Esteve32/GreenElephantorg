import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import type { SessionData } from 'express-session';
import express from 'express';
import { checkPrivacyAccess, PRIVACY_SESSION_MS, validAdminOAuthState, verifiedAdminGoogleUser, type PrivacyAdminIdentity } from './privacy-admin-access';
import { registerPrivacyAdminRoutes } from './privacy-admin-routes';

const actor: PrivacyAdminIdentity = { id: 'fixture-admin', email: 'privacy@greenelephant.org', googleId: '123456789', role: 'admin', isActive: 'true' };
const config = JSON.stringify({ [actor.id]: actor.googleId });
const now = Date.parse('2026-10-08T08:00:00Z');
const named = (): Partial<SessionData> => ({ isAdmin: true, adminMfaVerified: true, adminGoogleAuthTime: 1000, adminUserId: actor.id, adminGoogleSubject: actor.googleId!, adminAuthenticatedAt: now - 1000, adminRole: 'super_admin' });

test('privacy access is closed for missing, malformed and unassigned configuration, including super admins', async () => {
  for (const raw of [undefined, '', '{}', 'broken', '[]', '{"fixture-admin":true}', '{"someone-else":"123456789"}']) {
    let lookedUp = false;
    const result = await checkPrivacyAccess(named(), raw, async () => { lookedUp = true; return actor; }, now);
    assert.deepEqual(result, { allowed: false, status: 403, code: 'privacy_access_required' });
    assert.equal(lookedUp, false);
  }
  assert.equal((await checkPrivacyAccess(undefined, config, async () => actor, now)).allowed, false);
});

test('shared-password, old, missing, future and expired sessions cannot read privacy history', async () => {
  for (const patch of [
    { adminGoogleSubject: undefined }, { adminGoogleSubject: '999' }, { adminAuthenticatedAt: undefined },
    { adminAuthenticatedAt: NaN }, { adminAuthenticatedAt: now + 1 },
    { adminAuthenticatedAt: now - PRIVACY_SESSION_MS },
  ]) assert.equal((await checkPrivacyAccess({ ...named(), ...patch }, config, async () => actor, now)).allowed, false);
  const result = await checkPrivacyAccess(named(), config, async () => actor, now);
  assert.ok(result.allowed);
  assert.equal(result.expiresAt, now - 1000 + PRIVACY_SESSION_MS);
});

test('access uses current account status, role and pinned Google subject; session role cannot override revocation', async () => {
  for (const current of [undefined, { ...actor, isActive: 'false' }, { ...actor, role: 'viewer' }, { ...actor, googleId: '999' }, { ...actor, id: 'other' }]) {
    assert.equal((await checkPrivacyAccess(named(), config, async () => current, now)).allowed, false);
  }
  await assert.rejects(checkPrivacyAccess(named(), config, async () => { throw new Error('database failure'); }, now));
});

test('Google callback state and v2 identity validation reject absent, duplicate and unverified claims', () => {
  const state = 'a'.repeat(32);
  assert.ok(validAdminOAuthState(state, state));
  for (const [received, expected] of [[undefined, undefined], ['', ''], [[state], state], ['b'.repeat(32), state]])
    assert.equal(validAdminOAuthState(received, expected), false);
  const user = { id: actor.googleId, email: actor.email, verified_email: true };
  assert.ok(verifiedAdminGoogleUser(user));
  for (const invalid of [null, {}, { ...user, id: undefined }, { ...user, id: {} }, { ...user, email: [] }, { ...user, verified_email: 'true' }, { ...user, verified_email: false }])
    assert.equal(verifiedAdminGoogleUser(invalid), false);
});

let server: Server, origin: string;
let session: Partial<SessionData> | undefined;
let liveActor: PrivacyAdminIdentity | undefined = actor;
let rawConfig: string | undefined = config;
let calls = 0, fail = false, hold = false;
let release: (() => void) | undefined;
const eventId = '12345678-1234-1234-1234-123456789abc';
before(async () => {
  const app = express();
  // Test-only session fixture. Production routes use the existing signed server session.
  app.use((req, _res, next) => { req.session = session as typeof req.session; next(); });
  registerPrivacyAdminRoutes(app, {
    bindings: () => rawConfig, findAdmin: async () => liveActor,
    readAudited: async (who, after) => {
      assert.equal(who.id, actor.id); calls++;
      if (after) assert.equal(after, eventId);
      if (hold) await new Promise<void>(resolve => { release = resolve; });
      if (fail) throw new Error('private SQL connection information');
      return { events: [{ id: eventId, recordedAt: new Date(now).toISOString(), contactLinked: true }], nextCursor: null };
    },
  });
  server = await new Promise<Server>(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  const address = server.address(); assert.ok(address && typeof address !== 'string');
  origin = 'http://127.0.0.1:' + address.port;
});
after(async () => { if (server) await new Promise<void>((resolve, reject) => server.close(e => e ? reject(e) : resolve())); });
const request = (suffix = '') => fetch(origin + '/api/admin/privacy/withdrawals' + suffix);
const login = () => { session = { ...named(), adminAuthenticatedAt: Date.now() }; };

test('HTTP requires authentication and explicit permission before touching history', async () => {
  session = undefined; const before = calls;
  let response = await request(); assert.equal(response.status, 401);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  login(); rawConfig = undefined;
  response = await request(); assert.equal(response.status, 403);
  rawConfig = config; liveActor = { ...actor, isActive: 'false' };
  response = await request(); assert.equal(response.status, 403);
  liveActor = actor; assert.equal(calls, before);
});

test('HTTP rejects malformed/duplicate pagination and extra filters before reading data', async () => {
  login(); const before = calls;
  for (const suffix of ['?after=invalid', '?after=' + eventId + '&after=' + eventId, '?email=person@example.invalid', '?limit=10000']) {
    const response = await request(suffix); assert.equal(response.status, 400);
  }
  assert.equal(calls, before);
  const response = await request('?after=' + eventId);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.events.length, 1);
  assert.equal(body.events[0].contactId, undefined);
  assert.equal(body.events[0].email, undefined);
  assert.ok(Date.parse(body.accessExpiresAt) > Date.now());
});

test('HTTP waits for durable audit completion and fails without leaking records or database errors', async () => {
  login(); hold = true; fail = true;
  let responded = false;
  const pending = request().then(r => { responded = true; return r; });
  while (!release) await new Promise(resolve => setImmediate(resolve));
  assert.equal(responded, false);
  hold = false; release(); release = undefined;
  const response = await pending;
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { code: 'privacy_unavailable' });
  fail = false;
  assert.equal((await request()).status, 200);
});

test('HTTP rechecks revocation after a successful read and does not offer mutation routes', async () => {
  login(); assert.equal((await request()).status, 200);
  const before = calls;
  liveActor = { ...actor, role: 'viewer' };
  assert.equal((await request()).status, 403);
  liveActor = actor;
  assert.equal(calls, before);
  assert.equal((await fetch(origin + '/api/admin/privacy/withdrawals', { method: 'POST' })).status, 404);
});
