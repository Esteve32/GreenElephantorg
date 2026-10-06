// Green Elephant: exercise the installed Google client with synthetic transports only.
import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { google } from 'googleapis';

async function fixture(enabled = true, connected = true) {
  const result = await build({
    stdin: { contents: 'export * from "./server/lib/googleSheets"; export * from "./server/lib/gmailClient";', resolveDir: process.cwd() },
    bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external',
    define: { 'process.env.REPLIT_CONNECTORS_HOSTNAME': '"connector.example.test"', 'process.env.REPL_IDENTITY': '"synthetic-identity"' },
    plugins: [{ name: 'no-live-connectors', setup(b) {
      b.onResolve({ filter: /^\.\/connectorGuard$/ }, () => ({ path: 'guard', namespace: 'fixture' }));
      b.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({ contents: `export async function isConnectorEnabled(){return ${enabled};}` }));
    } }],
  });
  const calls: any[] = [];
  const originalRequest = google.auth.OAuth2.prototype.request;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, options) => {
    const url = new URL(String(input));
    assert.equal(url.hostname, 'connector.example.test');
    assert.equal((options?.headers as Record<string, string>).X_REPLIT_TOKEN, 'repl synthetic-identity');
    calls.push({ connector: url.searchParams.get('connector_names') });
    return new Response(JSON.stringify({ items: connected ? [{ settings: { access_token: 'synthetic-access', expires_at: '2099-01-01' } }] : [] }));
  };
  google.auth.OAuth2.prototype.request = async function(options: any) {
    assert.equal(this.credentials.access_token, 'synthetic-access');
    assert.equal(options.method, 'GET');
    const url = String(options.url); calls.push({ url, params: options.params });
    if (url.startsWith('https://sheets.googleapis.com/v4/spreadsheets/')) return { data: { values: [['Synthetic cell']] } } as any;
    if (url === 'https://gmail.googleapis.com/gmail/v1/users/me/threads') return { data: { threads: [{ id: 'synthetic-thread' }, { id: 'unused' }] } } as any;
    assert.equal(url, 'https://gmail.googleapis.com/gmail/v1/users/me/threads/synthetic-thread');
    return { data: { messages: [{ id: 'synthetic-message', snippet: 'Synthetic snippet', payload: { headers: [{ name: 'Subject', value: 'Synthetic subject' }, { name: 'From', value: 'sender@example.test' }] } }] } } as any;
  } as any;
  const module = { exports: {} as any };
  new Function('require', 'module', 'exports', result.outputFiles[0].text)(createRequire(import.meta.url), module, module.exports);
  return { ...module.exports, calls, restore() { globalThis.fetch = originalFetch; google.auth.OAuth2.prototype.request = originalRequest; } };
}

test('Google v183 clients preserve Sheets values and Gmail metadata requests without live traffic', async () => {
  const f = await fixture();
  try {
    assert.deepEqual(await f.getSheetData('synthetic-sheet', 'A1:B2'), [['Synthetic cell']]);
    const threads = await f.harvestEmailChains('subject:synthetic', 1);
    assert.equal(threads.length, 1); assert.equal(threads[0].subject, 'Synthetic subject');
    assert.equal(threads[0].messages[0].body, 'Synthetic snippet');
    assert.match(f.calls[1].url, /\/synthetic-sheet\/values\/A1%3AB2$/);
    const list = f.calls.find((c: any) => c.params?.q);
    assert.equal(list.params.q, 'subject:synthetic'); assert.equal(list.params.maxResults, 1);
    const detail = f.calls.at(-1);
    assert.equal(detail.params.format, 'metadata');
    assert.deepEqual(detail.params.metadataHeaders, ['From', 'To', 'Subject', 'Date']);
  } finally { f.restore(); }
});
test('disabled connectors never request credentials or Google APIs', async () => {
  const f = await fixture(false);
  try {
    assert.deepEqual(await f.getSheetData('synthetic', 'A1'), []);
    await assert.rejects(f.harvestEmailChains('synthetic'), /disabled/);
    assert.deepEqual(f.calls, []);
  } finally { f.restore(); }
});
test('missing connector configuration returns useful errors and never reaches Google', async () => {
  const f = await fixture(true, false);
  try {
    await assert.rejects(f.getSheetData('synthetic', 'A1'), /Google Sheet not connected/);
    await assert.rejects(f.harvestEmailChains('synthetic'), /Gmail connector not configured/);
    assert.ok(f.calls.every((c: any) => c.connector && !c.url));
  } finally { f.restore(); }
});
