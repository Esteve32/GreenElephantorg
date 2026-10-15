import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import ts from 'typescript';

let fixture: any;
before(async () => {
  const root = dirname(fileURLToPath(import.meta.url));
  const mocks: Record<string, string> = {
    // These tests isolate the legacy-disabled link path; real activation SQL is covered separately.
    './scan-order-link-runtime': 'export const createConfiguredScanReference=()=>async()=>undefined;export const hasScanSubmissionAwaitingReview=async()=>false;',
    './db': `export let locale='fr',fail=false;
      export function resetDb(value,unavailable=false){locale=value;fail=unavailable;}
      export const db={select(){return {from(){return {async where(){if(fail)throw Error('private database failure');return locale===undefined?[]:[{value:locale}];}};}};}};`,
    '@shared/schema': `export const satellitescanPurchases={};export const adminSettings={key:'key'};export const coupons={};`,
    'drizzle-orm': `export const eq=(column,value)=>({column,value});`,
    './email-operations': `import {locale} from './db';export let state='claimed',claims=0,finishes=0,failFinish=false;
      export function resetOperations(value='claimed',fail=false){state=value;claims=0;finishes=0;failFinish=fail;}
      export async function claimEmailOperation(kind,id){if(kind!=='scan-purchase'||id!=='synthetic-purchase')throw Error('wrong claim');claims++;const result=state;if(state==='claimed')state='pending';return result;}
      export async function finishEmailOperation(kind,id,accepted){finishes++;if(failFinish)throw Error('private storage failure');state=accepted?'accepted':'unknown';}
      export async function purchaseLanguage(){return locale==='fr'?'fr':'en';}`,
    './email-notifications': `export const messages=[];let result=true;
      export function resetSender(value=true){messages.length=0;result=value;}
      export async function sendSatellitescanPurchaseEmail(data){messages.push(data);if(result==='throw')throw Error('private provider failure');return result;}
      export async function sendSatellitescanReminderEmail(){throw Error('reminders forbidden');}`,
    './storage': 'export const storage={};',
  };
  const bundle = await build({
    stdin: { contents: 'export {recoverScanPurchaseEmail,notifyScanPurchase} from "./scan-purchase-service";export * from "./db";export * from "./email-operations";export * from "./email-notifications";', resolveDir: root },
    bundle: true, write: false, platform: 'node', format: 'esm',
    plugins: [{ name: 'isolated-recovery', setup(b) {
      b.onResolve({ filter: /.*/ }, args => Object.hasOwn(mocks, args.path) ? { path: args.path, namespace: 'fixture' } : undefined);
      b.onLoad({ filter: /.*/, namespace: 'fixture' }, args => ({ contents: mocks[args.path], loader: 'js', resolveDir: root }));
    } }],
  });
  fixture = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
});

const purchase = { id: 'synthetic-purchase', status: 'succeeded', customerEmail: 'synthetic@example.test', customerName: 'Alex', amount: '0.00', stripePaymentIntentId: 'synthetic-payment' };
function reset(locale: unknown = 'fr', state = 'claimed', result: boolean | string = true) {
  fixture.resetDb(locale); fixture.resetOperations(state); fixture.resetSender(result);
}

test('manual recovery and automatic callbacks share one operation, preserving locale, zero price and idempotency', async () => {
  reset();
  assert.equal(await fixture.recoverScanPurchaseEmail(purchase), 'accepted');
  assert.equal(await fixture.notifyScanPurchase(purchase), true);
  assert.equal(await fixture.recoverScanPurchaseEmail(purchase), 'accepted');
  assert.equal(fixture.messages.length, 1);
  assert.equal(fixture.messages[0].language, 'fr');
  assert.equal(fixture.messages[0].amount, '0.00');
  assert.match(fixture.messages[0].idempotencyKey, /^email_ops:v1:scan-purchase:/);
  reset('en');
  assert.equal(await fixture.recoverScanPurchaseEmail(purchase), 'accepted');
  assert.equal(fixture.messages[0].language, 'en');
});

test('concurrent recovery and callback cannot submit twice', async () => {
  reset();
  await Promise.all([fixture.recoverScanPurchaseEmail(purchase), fixture.notifyScanPurchase(purchase), fixture.recoverScanPurchaseEmail(purchase)]);
  assert.equal(fixture.messages.length, 1);
});

test('accepted, pending and ambiguous attempts never submit another message', async () => {
  for (const state of ['accepted', 'pending', 'unknown']) {
    reset('fr', state);
    assert.equal(await fixture.recoverScanPurchaseEmail(purchase), state === 'accepted' ? 'accepted' : 'reconciliation_required');
    assert.equal(fixture.messages.length, 0);
    assert.equal(fixture.finishes, 0);
  }
});

test('failed or partially accepted sends require review and cannot be retried blindly', async () => {
  reset('fr', 'claimed', false);
  assert.equal(await fixture.recoverScanPurchaseEmail(purchase), 'reconciliation_required');
  assert.equal(await fixture.recoverScanPurchaseEmail(purchase), 'reconciliation_required');
  assert.equal(fixture.messages.length, 1);
  assert.equal(fixture.state, 'unknown');
});

test('legacy/invalid language and unsuccessful purchases cannot start email operations', async () => {
  for (const locale of [null, '', 'unknown', 'de']) {
    reset(locale);
    assert.equal(await fixture.recoverScanPurchaseEmail(purchase), 'historical_review_required');
    assert.equal(fixture.claims, 0); assert.equal(fixture.messages.length, 0);
  }
  reset(); fixture.resetDb(undefined);
  assert.equal(await fixture.recoverScanPurchaseEmail(purchase), 'historical_review_required');
  for (const status of ['pending', 'failed', 'refunded']) {
    reset();
    assert.equal(await fixture.recoverScanPurchaseEmail({ ...purchase, status }), 'ineligible');
    assert.equal(fixture.claims, 0); assert.equal(fixture.messages.length, 0);
  }
});

test('database failure before claim and failed receipt after submission never permit blind retries', async () => {
  reset(); fixture.resetDb('fr', true);
  await assert.rejects(fixture.recoverScanPurchaseEmail(purchase));
  assert.equal(fixture.messages.length, 0);
  reset(); fixture.resetOperations('claimed', true);
  await assert.rejects(fixture.recoverScanPurchaseEmail(purchase));
  fixture.resetOperations('pending');
  assert.equal(await fixture.recoverScanPurchaseEmail(purchase), 'reconciliation_required');
  assert.equal(fixture.messages.length, 1);
  reset('fr', 'claimed', 'throw');
  await assert.rejects(fixture.recoverScanPurchaseEmail(purchase));
  assert.equal(await fixture.recoverScanPurchaseEmail(purchase), 'reconciliation_required');
  assert.equal(fixture.messages.length, 1);
});

// Execute the actual route callback without importing provider-initializing routes.ts.
function recoveryHandler(bindings: Record<string, unknown>) {
  const source = ts.createSourceFile('routes.ts', readFileSync('server/routes.ts', 'utf8'), ts.ScriptTarget.Latest, true);
  let handler: ts.Node | undefined;
  function visit(node: ts.Node) {
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)
      && node.expression.expression.getText(source) === 'app' && ts.isStringLiteral(node.arguments[0])
      && node.arguments[0].text === '/api/admin/satellitescan/:purchaseId/resend-emails') {
      assert.equal(node.arguments[1].getText(source), 'requireAdminAuth');
      assert.equal(node.arguments[2].getText(source), 'requireWriteAccess');
      handler = node.arguments[node.arguments.length - 1];
    }
    ts.forEachChild(node, visit);
  }
  visit(source); assert.ok(handler);
  const code = ts.transpileModule(`const handler=${handler.getText(source)};`, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
  return new Function(...Object.keys(bindings), `${code};return handler;`)(...Object.values(bindings));
}
function response() {
  return { statusCode: 200, body: undefined as any, status(code: number) { this.statusCode = code; return this; }, json(body: unknown) { this.body = body; return this; } };
}

test('actual admin callback distinguishes acceptance from delivery and returns actionable review states', async () => {
  for (const outcome of ['accepted', 'reconciliation_required', 'historical_review_required', 'ineligible']) {
    const handler = recoveryHandler({ storage: { getAllSatellitescanPurchases: async () => [purchase] }, recoverScanPurchaseEmail: async (value: unknown) => { assert.equal(value, purchase); return outcome; } });
    const res = response(); await handler({ params: { purchaseId: purchase.id } }, res);
    assert.equal(res.statusCode, outcome === 'accepted' ? 200 : 409);
    assert.equal(res.body.outcome, outcome); assert.equal(res.body.delivery, 'unverified');
    assert.doesNotMatch(JSON.stringify(res.body), /synthetic@example/);
  }
});

test('missing purchases and exceptions cannot report success or leak errors', async () => {
  for (const missing of [true, false]) {
    const handler = recoveryHandler({ storage: { getAllSatellitescanPurchases: async () => missing ? [] : [purchase] }, recoverScanPurchaseEmail: async () => { throw Error('private token and payload'); } });
    const res = response(); await handler({ params: { purchaseId: purchase.id } }, res);
    assert.equal(res.statusCode, missing ? 404 : 503); assert.equal(res.body.success, false);
    assert.doesNotMatch(JSON.stringify(res.body), /private|token|payload/);
  }
});
