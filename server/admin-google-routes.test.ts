import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import express from 'express';
import session from 'express-session';
import { registerAdminGoogleRoutes } from './admin-google-routes';
import { AdminMfaError } from './admin-google-mfa';
import { registerAdminSessionRoutes } from './admin-session-routes';
import { registerPrivacyAdminRoutes } from './privacy-admin-routes';
import { createCurrentAdminGuard, createNamedOwnerGuard } from './admin-current-access';

const owner = { id: 'owner', email: 'owner@example.invalid', googleId: '12345', role: 'super_admin', isActive: 'true', name: 'Fixture', avatarUrl: null };
const daily = { ...owner, id: 'daily', email: 'daily@greenelephant.org', googleId: '24680', role: 'admin' };
const ordinary = { ...owner, id: 'ordinary', email: 'ordinary@greenelephant.org', googleId: '67890', role: 'admin' };
let actor = owner, configured = true, failure = '', providerCalls = 0, writes = 0, expectedNonce = '';
let server: Server, origin: string;
const store = new session.MemoryStore();
const storeSet = store.set.bind(store);
store.set = (sid, value, cb) => {
  if (failure === 'session' || (failure === 'final-save' && value.isAdmin)) return cb?.(Error('synthetic private store error'));
  storeSet(sid, value, cb);
};
before(async () => {
  const app = express();
  app.use(session({ store, secret: 'synthetic-test-secret-not-runtime', resave: false, saveUninitialized: false }));
  registerAdminGoogleRoutes(app, {
    config: () => configured ? { clientId: 'fixture-client', clientSecret: 'fixture-secret', owner: owner.email } : {},
    baseUrl: () => 'https://website.example.invalid',
    storage: {
      getAdminUserByGoogleId: async () => failure === 'unknown' ? undefined : actor,
      getAdminUserByEmail: async () => undefined,
      updateAdminUser: async () => { writes++; return actor; },
      getClientUserByEmail: async () => { if (failure === 'portal') throw Error('private provider detail'); return { googleId: actor.googleId }; },
    } as any,
    audit: async () => { if (failure === 'audit') throw Error('private audit detail'); },
    fetch: async (_url, opts) => {
      providerCalls++;
      assert.equal(opts?.method, 'POST');
      assert.equal(new URLSearchParams(opts?.body as URLSearchParams).get('code_verifier')?.length, 43);
      if (failure === 'network') throw Error('private token detail');
      return new Response(JSON.stringify({ id_token: 'synthetic-token' }), { status: failure === 'provider' ? 503 : 200 });
    },
    verify: async (_token, client, nonce) => {
      assert.equal(client, 'fixture-client'); assert.equal(nonce, expectedNonce);
      if (failure === 'mfa') throw new AdminMfaError('mfa_unverified');
      if (failure === 'identity') throw new AdminMfaError('invalid_identity');
      return { id: actor.googleId, email: actor.email, authTime: Date.now() - 86400_000, name: actor.name, picture: undefined };
    },
  });
  const deps = { owner: () => owner.email, findAdmin: async () => actor };
  registerAdminSessionRoutes(app, deps);
  app.get('/owner', createCurrentAdminGuard(deps), createNamedOwnerGuard(deps.owner), (_req, res) => res.json({ ok: true }));
  registerPrivacyAdminRoutes(app, { ...deps, bindings: () => JSON.stringify({ owner: owner.googleId, daily: daily.googleId }),
    readAudited: async () => ({ events: [], nextCursor: null }) as any });
  server = await new Promise<Server>(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  const addr = server.address(); assert.ok(addr && typeof addr !== 'string'); origin = `http://127.0.0.1:${addr.port}`;
});
after(async () => { if (server) await new Promise<void>(resolve => server.close(() => resolve())); });
const request = (path: string, cookie = '') => fetch(origin + path, { redirect: 'manual', headers: { Cookie: cookie } });
const cookieOf = (res: Response) => res.headers.get('set-cookie')?.split(';')[0] || '';
async function start() {
  const res = await request('/api/admin/auth/google');
  const url = new URL(res.headers.get('location')!);
  expectedNonce = url.searchParams.get('nonce')!;
  return { res, url, cookie: cookieOf(res), callback: '/api/admin/auth/google/callback?code=fixture&state=' + url.searchParams.get('state') };
}
test('start requests MFA/time claims, nonce and PKCE without offline access or unsupported reauthentication', async () => {
  const { url, res } = await start();
  assert.equal(url.hostname, 'accounts.google.com');
  assert.equal(url.searchParams.get('prompt'), 'select_account');
  assert.equal(url.searchParams.has('access_type'), false);
  assert.equal(url.searchParams.has('max_age'), false);
  assert.deepEqual(JSON.parse(url.searchParams.get('claims')!), { id_token: { amr: { essential: true }, auth_time: { essential: true } } });
  assert.match(expectedNonce, /^[a-f0-9]{64}$/);
  assert.equal(url.searchParams.get('code_challenge_method'), 'S256');
  assert.equal(res.headers.get('cache-control'), 'no-store');
});
test('owner, privacy delegate and ordinary administrator keep separate rights after MFA login', async () => {
  for (const person of [owner, daily, ordinary]) {
    actor = person; const flow = await start(); const res = await request(flow.callback, flow.cookie);
    assert.equal(res.headers.get('location'), '/admin/submissions');
    const cookie = cookieOf(res); assert.notEqual(cookie, flow.cookie);
    assert.equal((await request('/api/admin/training/access', cookie)).status, 200);
    assert.equal((await request('/owner', cookie)).status, person === owner ? 200 : 403);
    assert.equal((await request('/api/admin/privacy/withdrawals', cookie)).status, person === ordinary ? 403 : 200);
    const check = await (await request('/api/admin/check', cookie)).json(); assert.equal(check.isAuthenticated, true);
    assert.equal(check.canManageTeam, person === owner);
  }
  actor = owner;
});
test('configuration and session failures return login help instead of raw JSON or provider redirects', async () => {
  configured = false;
  assert.equal((await request('/api/admin/auth/google')).headers.get('location'), '/admin/login?error=not_configured');
  configured = true; failure = 'session';
  assert.equal((await request('/api/admin/auth/google')).headers.get('location'), '/admin/login?error=session_failed');
  failure = '';
});
test('callback failures never grant access or expose provider/store details', async () => {
  for (const [cause, code] of [['mfa', 'mfa_unverified'], ['identity', 'invalid_identity'], ['unknown', 'not_authorized'],
    ['provider', 'token_failed'], ['network', 'callback_failed'], ['portal', 'callback_failed'],
    ['audit', 'callback_failed'], ['final-save', 'session_failed'], ['session', 'session_failed']]) {
    const flow = await start(); const beforeWrites = writes; failure = cause;
    const res = await request(flow.callback, flow.cookie); failure = '';
    assert.equal(res.headers.get('location'), '/admin/login?error=' + code, cause);
    assert.doesNotMatch(await res.text(), /synthetic-token|private|fixture-secret/);
    assert.equal((await (await request('/api/admin/check', flow.cookie)).json()).isAuthenticated, false);
    if (['mfa', 'identity', 'unknown', 'provider', 'network', 'session'].includes(cause)) assert.equal(writes, beforeWrites);
  }
});
test('missing/mismatched state, cancelled flow, missing code, expired flow and replay are rejected', async () => {
  for (const suffix of ['?code=fixture&state=bad', '?state=STATE&error=access_denied', '?state=STATE']) {
    const flow = await start(); const before = providerCalls;
    const res = await request('/api/admin/auth/google/callback' + suffix.replace('STATE', flow.url.searchParams.get('state')!), flow.cookie);
    assert.match(res.headers.get('location')!, /error=(state_mismatch|google_auth_failed|no_code)$/);
    assert.equal(providerCalls, before);
  }
  const expired = await start();
  const sessions = await new Promise<Record<string, session.SessionData>>(resolve => store.all((_e, values) => resolve(values as any)));
  for (const [sid, value] of Object.entries(sessions)) if (value.adminOAuthNonce === expectedNonce) {
    value.adminOAuthStartedAt = Date.now() - 600_001; await new Promise<void>(resolve => store.set(sid, value, () => resolve()));
  }
  assert.equal((await request(expired.callback, expired.cookie)).headers.get('location'), '/admin/login?error=state_mismatch');
  const flow = await start(); await request(flow.callback, flow.cookie); const before = providerCalls;
  assert.equal((await request(flow.callback, flow.cookie)).headers.get('location'), '/admin/login?error=state_mismatch');
  assert.equal(providerCalls, before);
});
