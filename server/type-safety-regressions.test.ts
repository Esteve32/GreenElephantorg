// Green Elephant: execute repaired handlers with synthetic storage and no providers.
import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { EventEmitter } from 'node:events';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import ts from 'typescript';

let fixture: any;
before(async () => {
  const root = dirname(fileURLToPath(import.meta.url));
  const mocks: Record<string, string> = {
    './db': 'export const db = new Proxy({}, {get(){throw Error("Database access forbidden in this fixture");}});',
    './connectorGuard': 'export async function isConnectorEnabled(){return false;}',
  };
  const result = await build({
    stdin: { contents: 'export {MemStorage,storage} from "./storage"; export {auditMiddleware} from "./auth"; export {emptyGA4Metrics} from "./lib/ga4Client";', resolveDir: root },
    bundle: true, write: false, platform: 'node', format: 'esm',
    plugins: [{ name: 'isolated-services', setup(b) {
      b.onResolve({ filter: /.*/ }, args => Object.hasOwn(mocks, args.path) ? { path: args.path, namespace: 'fixture' } : undefined);
      b.onLoad({ filter: /.*/, namespace: 'fixture' }, args => ({ contents: mocks[args.path], loader: 'js' }));
    } }],
  });
  fixture = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
});

// Extract the actual route callback, preserving its body and branches. Loading
// routes.ts itself would initialize live providers, unrelated to these checks.
function handlerFor(path: string, bindings: Record<string, unknown>) {
  const file = ts.createSourceFile('routes.ts', readFileSync('server/routes.ts', 'utf8'), ts.ScriptTarget.Latest, true);
  let handler: ts.Node | undefined;
  function visit(node: ts.Node) {
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)
      && node.expression.expression.getText(file) === 'app'
      && ts.isStringLiteral(node.arguments[0]) && node.arguments[0].text === path) {
      handler = node.arguments[node.arguments.length - 1];
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  assert.ok(handler, `Missing route ${path}`);
  const code = ts.transpileModule(`const handler = ${handler.getText(file)};`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  return new Function(...Object.keys(bindings), `${code}; return handler;`)(...Object.values(bindings));
}

function response() {
  return { statusCode: 200, body: undefined as any,
    status(code: number) { this.statusCode = code; return this; },
    json(body: unknown) { this.body = body; return this; },
  };
}

test('funnel works with GA4 disabled and filters email logs by their actual sentAt timestamp', async () => {
  const now = Date.now(), day = 86400000;
  const emailLogs = [
    { sentAt: new Date(now - day), status: 'sent' },
    { sentAt: new Date(now - 9 * day), status: 'sent' },
    { sentAt: new Date(now - 20 * day), status: 'sent' },
    { sentAt: new Date(now - day), status: 'failed' },
  ];
  const storage = new Proxy({}, { get: (_target, key) => key === 'getAllOnboardingEmailLogs' ? async () => emailLogs : async () => [] });
  const handler = handlerFor('/api/admin/funnel-metrics', {
    storage, isConnectorEnabled: async () => false,
    isGA4DataApiConfigured: () => false, isGA4Configured: () => false,
    fetchGA4Metrics: () => { throw Error('Must not fetch disabled GA4'); },
    emptyGA4Metrics: fixture.emptyGA4Metrics,
  });
  const res = response();
  await handler({ query: { window: '7d' } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.funnel.AWARENESS.primary.value, null);
  assert.equal(res.body.funnel.AWARENESS.source, 'Database');
  const emails = res.body.funnel.ONBOARDING.secondary.find((row: any) => row.label === 'Onboarding Emails Sent');
  assert.equal(emails.value, 1);
  assert.equal(emails.prev, 1);
  assert.equal(res.body.funnel.USE.secondary.find((row: any) => row.label === 'Return Visitor Rate').value, null);
});

test('funnel preserves measured zero values when synthetic GA4 data is available', async () => {
  const handler = handlerFor('/api/admin/funnel-metrics', {
    storage: new Proxy({}, { get: () => async () => [] }),
    isConnectorEnabled: async (name: string) => name === 'google-analytics',
    isGA4DataApiConfigured: () => true, isGA4Configured: () => true,
    fetchGA4Metrics: async () => ({ ...fixture.emptyGA4Metrics(), sessions: 0, returnVisitorRate: 0, directTrafficShare: 0 }),
    emptyGA4Metrics: fixture.emptyGA4Metrics,
  });
  const res = response();
  await handler({ query: { window: 'all' } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.funnel.AWARENESS.primary.value, 0);
  assert.equal(res.body.funnel.USE.secondary.find((row: any) => row.label === 'Return Visitor Rate').value, '0%');
});

test('disabled Notion reports unavailable; only a retrieved schema reports a connection', async () => {
  for (const schema of [null, { id: 'synthetic-db', title: [{ plain_text: 'Fixture' }], properties: { Name: {} } }]) {
    const handler = handlerFor('/api/admin/notion/schema', { getNotionDatabaseSchema: async () => schema });
    const res = response(); await handler({}, res);
    assert.equal(res.statusCode, schema ? 200 : 503);
    if (schema) assert.equal(res.body.databaseId, 'synthetic-db');
    else assert.equal(res.body.message, 'Notion connector is disabled or unavailable');
  }
});

test('audit observes finish once without replacing response.end; failed and read-only requests are excluded', async () => {
  const logs: any[] = [];
  const original = fixture.storage.createAuditLog;
  fixture.storage.createAuditLog = async (record: unknown) => { logs.push(record); };
  try {
    for (const [method, status, admin] of [['POST', 200, true], ['POST', 400, true], ['GET', 200, true], ['POST', 200, false]] as const) {
      const end = () => {};
      const res = Object.assign(new EventEmitter(), { statusCode: status, end });
      let continued = false;
      fixture.auditMiddleware({ method, path: '/synthetic', session: admin ? { adminEmail: 'admin@example.test' } : {},
        socket: { remoteAddress: '127.0.0.1' }, body: { password: 'synthetic-secret', note: 'fixture' } }, res, () => { continued = true; });
      assert.equal(continued, true); assert.equal(res.end, end);
      res.emit('finish'); res.emit('finish');
    }
    assert.equal(logs.length, 1);
    assert.equal(logs[0].details.body.password, '[REDACTED]');
    assert.equal(logs[0].details.body.note, 'fixture');
  } finally { fixture.storage.createAuditLog = original; }
});

test('memory records use schema defaults without granting provider connections or consent', async () => {
  const store = new fixture.MemStorage();
  const webinar = await store.createWebinarSession({ lens: 'needs', topic: 'Fixture', description: 'Synthetic', date: '2026-10-07', time: '12:00' });
  assert.equal(webinar.spotsLeft, 12); assert.equal(webinar.sortOrder, 0);
  const full = await store.createWebinarSession({ lens: 'needs', topic: 'Full', description: 'Synthetic', date: '2026-10-07', time: '13:00', spotsLeft: 0, sortOrder: 2 });
  assert.equal(full.spotsLeft, 0); assert.equal(full.sortOrder, 2);
  const calendar = await store.createCalendarEvent({ month: 'October', lens: 'needs', color: 'teal', description: 'Synthetic' });
  assert.equal(calendar.sortOrder, 0);
  const log = await store.createConnectorToggleLog({ connectorName: 'fixture', action: 'disable', previousEnabled: 'true', newEnabled: 'false' });
  assert.equal(log.previousEnabled, 'true'); assert.equal(log.newEnabled, 'false'); assert.equal(log.triggeredBy, 'individual');
  const user = await store.createClientUser({ email: 'synthetic@example.test', linkedinSub: 'synthetic-subject' });
  assert.equal(user.linkedinSub, 'synthetic-subject');
  for (const key of ['notionAccessToken', 'linkedinAccessToken', 'spotifyAccessToken', 'ouraAccessToken', 'ouraConsentGrantedAt']) assert.equal(user[key], null);
  await assert.rejects(store.getCouponByCode('synthetic'), /MemStorage does not support getCouponByCode/);
  await assert.rejects(store.createOnboardingEmailLog({}), /MemStorage does not support createOnboardingEmailLog/);
});

test('memory deletion iterates all matching records while preserving other users', async () => {
  const store = new fixture.MemStorage();
  for (const userId of ['owner-a', 'owner-b']) for (const key of ['one', 'two']) {
    await store.setPortalUserContext(userId, key, 'synthetic');
    await store.createPortalTimelineEvent({ userId, type: 'fixture', title: key });
  }
  assert.equal(await store.deleteAllPortalUserContext('owner-a'), 2);
  assert.equal((await store.getPortalUserContext('owner-b')).length, 2);
  assert.equal(await store.deleteAllPortalTimelineEvents('owner-a'), 2);
  assert.equal((await store.getPortalTimelineEvents('owner-b')).length, 2);
  for (const qrCodeId of ['code-a', 'code-a', 'code-b']) await store.createQrScan({ qrCodeId });
  assert.equal(await store.deleteQrScansByCodeId('code-a'), 2);
  assert.equal(await store.getQrScanCount('code-b'), 1);
});
