import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { Server } from 'node:http';
import express from 'express';
import session from 'express-session';
import ts from 'typescript';
import { createNamedOwnerGuard, createCurrentAdminGuard } from './admin-current-access';
import { registerPrivacyAdminRoutes } from './privacy-admin-routes';
import { registerAdminSessionRoutes } from './admin-session-routes';
import type { PrivacyAdminIdentity } from './privacy-admin-access';

const ownerEmail = 'owner@example.invalid';
const owner: PrivacyAdminIdentity = { id: 'owner-fixture', email: ownerEmail, googleId: '12345', role: 'super_admin', isActive: 'true' };
const member: PrivacyAdminIdentity = { ...owner, id: 'member-fixture', email: 'member@greenelephant.org', googleId: '67890', role: 'admin' };
let actor: PrivacyAdminIdentity | undefined = member;
let failLookup = false, reads = 0, writes = 0;
let server: Server, origin: string;
before(async () => {
  const app = express();
  app.use(express.json());
  // Only this isolated test app has a fixture-login route and a memory session store.
  app.use(session({ secret: 'synthetic-test-secret-not-a-runtime-credential', resave: false, saveUninitialized: false }));
  app.post('/fixture/session', (req, res) => {
    Object.assign(req.session, req.body);
    res.json({ ok: true });
  });
  const deps = { owner: () => ownerEmail, findAdmin: async () => { reads++; if (failLookup) throw Error('private DB detail'); return actor; } };
  registerAdminSessionRoutes(app, deps);
  const guard = createCurrentAdminGuard(deps);
  app.get('/fixture/owner', guard, createNamedOwnerGuard(() => ownerEmail), (_req, res) => res.json({ ok: true }));
  registerPrivacyAdminRoutes(app, { ...deps, bindings: () => JSON.stringify({ [owner.id]: owner.googleId, 'daily-fixture': '24680' }),
    readAudited: async () => { throw Error('Secondary admin must never read privacy history'); } });
  app.get('/fixture/read', guard, (_req, res) => res.json({ ok: true }));
  app.post('/fixture/write', guard, (_req, res) => { writes++; res.json({ ok: true }); });
  server = await new Promise<Server>(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  const address = server.address(); assert.ok(address && typeof address !== 'string'); origin = `http://127.0.0.1:${address.port}`;
});
after(async () => { if (server) await new Promise<void>((resolve, reject) => server.close(e => e ? reject(e) : resolve())); });
async function request(path: string, cookie = '', method = 'GET', body?: unknown) {
  return fetch(origin + path, { method, headers: { Cookie: cookie, 'Content-Type': 'application/json' }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
}
async function login(patch: object = {}) {
  const response = await request('/fixture/session', '', 'POST', {
    isAdmin: true, adminMfaVerified: true, adminGoogleAuthTime: 1000, adminUserId: member.id, adminEmail: member.email, adminRole: 'admin',
    adminGoogleSubject: member.googleId, adminAuthenticatedAt: Date.now(), ...patch,
  });
  return response.headers.get('set-cookie')!.split(';')[0];
}

test('retired password endpoints neither read credentials nor establish a session', async () => {
  const beforeReads = reads;
  for (const path of ['/api/admin/login', '/api/admin/change-password']) {
    for (const body of [{}, { password: 'synthetic-only', currentPassword: 'synthetic-only', newPassword: 'synthetic-only' }]) {
      const response = await request(path, '', 'POST', body);
      assert.equal(response.status, 410);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.equal(response.headers.get('set-cookie'), null);
      assert.match((await response.json()).message, /Google/);
    }
  }
  assert.equal(reads, beforeReads);
});

test('signed legacy password cookies are rejected by status, reads and writes', async () => {
  const cookie = await login({ adminGoogleSubject: null, adminAuthenticatedAt: null, adminRole: 'super_admin' });
  const beforeReads = reads, beforeWrites = writes;
  const status = await request('/api/admin/check', cookie);
  assert.deepEqual(await status.json(), { isAuthenticated: false, role: null, canManageTeam: false });
  assert.equal((await request('/fixture/read', cookie)).status, 401);
  assert.equal((await request('/fixture/write', cookie, 'POST', {})).status, 401);
  assert.equal(reads, beforeReads); assert.equal(writes, beforeWrites);
});

test('missing or invalid Google provenance is rejected before database access', async () => {
  const beforeReads = reads;
  for (const patch of [{ adminMfaVerified: undefined }, { adminMfaVerified: false }, { adminGoogleAuthTime: undefined }, { isAdmin: false }, { adminGoogleSubject: '' }, { adminGoogleSubject: 'not-a-subject' },
    { adminAuthenticatedAt: null }, { adminAuthenticatedAt: 0 }, { adminAuthenticatedAt: '123' }, { adminAuthenticatedAt: Date.now() + 60_000 }]) {
    const cookie = await login(patch);
    assert.equal((await request('/fixture/read', cookie)).status, 401);
    assert.equal((await (await request('/api/admin/check', cookie)).json()).isAuthenticated, false);
  }
  assert.equal(reads, beforeReads);
});

test('named sessions work; current account changes revoke access without trusting cookie roles', async () => {
  const cookie = await login({ adminRole: 'super_admin' });
  actor = member;
  let status = await (await request('/api/admin/check', cookie)).json();
  assert.equal(status.isAuthenticated, true); assert.equal(status.role, 'admin'); assert.equal(status.canManageTeam, false);
  assert.equal(status.user.googleId, undefined);
  assert.equal((await request('/fixture/write', cookie, 'POST', {})).status, 200);
  for (const current of [undefined, { ...member, isActive: 'false' }, { ...member, googleId: null },
    { ...member, googleId: '999' }, { ...member, id: 'other-id' }, { ...member, email: 'other@example.invalid' }]) {
    actor = current;
    assert.equal((await request('/fixture/read', cookie)).status, 403);
    status = await (await request('/api/admin/check', cookie)).json();
    assert.equal(status.isAuthenticated, false);
  }
  actor = { ...member, role: 'viewer' };
  assert.equal((await request('/fixture/read', cookie)).status, 200);
  assert.equal((await request('/fixture/write', cookie, 'POST', {})).status, 403);
  actor = member;
});

test('secondary administrator retains ordinary read/write tools without owner or privacy permission', async () => {
  actor = member;
  const cookie = await login();
  assert.equal((await request('/fixture/read', cookie)).status, 200);
  assert.equal((await request('/fixture/write', cookie, 'POST', {})).status, 200);
  assert.equal((await request('/fixture/owner', cookie)).status, 403);
  const privacy = await request('/api/admin/privacy/withdrawals', cookie);
  assert.equal(privacy.status, 403);
  assert.equal((await privacy.json()).code, 'privacy_access_required');
  // A privacy denial must not disable regular administrator access.
  assert.equal((await request('/fixture/write', cookie, 'POST', {})).status, 200);
});

test('owner status requires recent Google login while ordinary access retains its existing session lifetime', async () => {
  actor = owner;
  const cookie = await login({ adminUserId: owner.id, adminGoogleSubject: owner.googleId });
  assert.equal((await (await request('/api/admin/check', cookie)).json()).canManageTeam, true);
  const older = await login({ adminUserId: owner.id, adminGoogleSubject: owner.googleId, adminAuthenticatedAt: Date.now() - 1_800_001 });
  const status = await (await request('/api/admin/check', older)).json();
  assert.equal(status.isAuthenticated, true); assert.equal(status.canManageTeam, false);
  actor = member;
});

test('database failures fail closed in both status and protected requests', async () => {
  const cookie = await login(); failLookup = true;
  for (const path of ['/api/admin/check', '/fixture/read']) {
    const response = await request(path, cookie);
    assert.equal(response.status, 503); assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.doesNotMatch(await response.text(), /private|DB/);
  }
  failLookup = false;
});

test('legacy admin routes are wired to the common guard; only sign-in and logout bypass it', () => {
  // Registration coverage complements runtime guard tests without starting providers/schedulers.
  const exempt = new Set(['/api/admin/auth/google', '/api/admin/auth/google/callback', '/api/admin/logout']);
  const seen = new Set<string>();
  for (const file of ['server/routes.ts', 'server/portal-auth.ts']) {
    const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
    function visit(node: ts.Node) {
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)
          && node.expression.expression.getText(source) === 'app') {
        const [path, ...handlers] = node.arguments;
        if (path && ts.isStringLiteral(path) && path.text.startsWith('/api/admin/') && !exempt.has(path.text)) {
          assert.ok(handlers.some(h => ts.isIdentifier(h) && h.text === 'requireAdminAuth'), `${file}: ${path.text} has no current Google identity guard`);
          seen.add(path.text);
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  for (const path of ['/api/admin/portal-users', '/api/admin/settings', '/api/admin/linkedin/test', '/api/admin/auth/fathom/callback']) assert.ok(seen.has(path));
});

test('teaching-view gate exposes only access status and preserves ordinary-admin/privacy separation', async () => {
  actor = member;
  const cookie = await login();
  const response = await request('/api/admin/training/access', cookie);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await response.json(), { isAuthenticated: true });
  const legacy = await login({ adminGoogleSubject: null, adminAuthenticatedAt: null });
  assert.equal((await request('/api/admin/training/access', legacy)).status, 401);
  actor = { ...member, isActive: 'false' };
  assert.equal((await request('/api/admin/training/access', cookie)).status, 403);
  actor = member;
});
