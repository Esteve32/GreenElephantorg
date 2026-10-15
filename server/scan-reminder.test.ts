import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isScanReminderDue } from '../shared/scan-reminder';

const now = new Date('2026-10-14T12:00:00Z');
const hour = 3_600_000;
const base = {
  id: 'synthetic-purchase', status: 'succeeded', customerEmail: 'current@example.test', customerName: 'Current',
  stripePaymentIntentId: 'synthetic-payment', amount: '0.00', role: null,
  typeformCompleted: 'false', typeformCompletedAt: null, dashboardSent: 'false', remindersCount: '0',
  createdAt: new Date(now.getTime() - 72 * hour),
};

test('reminder starts at the 72-hour boundary, including valid free purchases', () => {
  assert.equal(isScanReminderDue(base, now), true);
  assert.equal(isScanReminderDue({ ...base, createdAt: new Date(base.createdAt.getTime() + 1) }, now), false);
  assert.equal(isScanReminderDue({ ...base, createdAt: new Date(now.getTime() + hour) }, now), false);
});

test('ineligible, fulfilled and inconsistent records are excluded conservatively', () => {
  for (const change of [
    ...['pending', 'failed', 'refunded', 'cancelled', ''].map(status => ({ status })),
    { typeformCompleted: 'true' }, { typeformCompleted: 'unknown' }, { typeformCompletedAt: new Date() },
    { dashboardSent: 'true' }, { remindersCount: '1' }, { remindersCount: '0garbage' }, { remindersCount: '' },
    { createdAt: new Date('invalid') },
  ]) assert.equal(isScanReminderDue({ ...base, ...change }, now), false, JSON.stringify(change));
  assert.equal(isScanReminderDue(base, new Date('invalid')), false);
  for (const threshold of [-1, NaN, Infinity]) assert.equal(isScanReminderDue(base, now, threshold), false);
});

let fixture: any;
before(async () => {
  const root = dirname(fileURLToPath(import.meta.url));
  const mocks: Record<string, string> = {
    './db': `export let current,failRead=false,failUpdate=false;export const updates=[];
      export function resetDb(value,readFailure=false,updateFailure=false){current=value;failRead=readFailure;failUpdate=updateFailure;updates.length=0;}
      export const db={select(){return {from(){return {where(){return {async limit(){if(failRead)throw Error('synthetic read failure');return current?[structuredClone(current)]:[];}};}};}};},
        update(){return {set(value){return {async where(){if(failUpdate)throw Error('synthetic count failure');updates.push(value);}};}};}};`,
    './email-operations': `export let state='claimed',claims=0,finishes=0,language='fr',failLanguage=false;
      export function resetOperations(value='claimed',locale='fr',fail=false){state=value;claims=0;finishes=0;language=locale;failLanguage=fail;}
      export async function claimEmailOperation(kind,id){if(kind!=='scan-reminder'||id!=='synthetic-purchase')throw Error('wrong claim');claims++;const result=state;if(state==='claimed')state='pending';return result;}
      export async function finishEmailOperation(kind,id,accepted){finishes++;state=accepted?'accepted':'unknown';}
      export async function purchaseLanguage(){if(failLanguage)throw Error('synthetic locale failure');return language;}`,
    './email-notifications': `export const messages=[];let result=true;
      export function resetSender(value=true){messages.length=0;result=value;}
      export async function sendSatellitescanReminderEmail(...data){messages.push(data);if(result==='throw')throw Error('synthetic provider timeout');return result;}
      export async function sendSatellitescanPurchaseEmail(){throw Error('purchase send forbidden');}`,
  };
  const bundle = await build({
    stdin: { contents: 'export {remindScanOnce} from "./scan-purchase-service";export {MemStorage} from "./storage";export * from "./db";export * from "./email-operations";export * from "./email-notifications";', resolveDir: root },
    bundle: true, write: false, platform: 'node', format: 'esm',
    plugins: [{ name: 'isolated-reminder', setup(b) {
      b.onResolve({ filter: /.*/ }, args => Object.hasOwn(mocks, args.path) ? { path: args.path, namespace: 'fixture' } : undefined);
      b.onLoad({ filter: /.*/, namespace: 'fixture' }, args => ({ contents: mocks[args.path], loader: 'js', resolveDir: root }));
    } }],
  });
  fixture = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
});

function oldPurchase() { return { ...base, createdAt: new Date(Date.now() - 73 * hour) }; }
function reset(current: unknown = oldPurchase(), state = 'claimed', result: boolean | string = true, language = 'fr') {
  fixture.resetDb(current); fixture.resetOperations(state, language); fixture.resetSender(result);
}

test('real memory selector excludes unsuccessful/fulfilled orders and malformed counts', async () => {
  const store = new fixture.MemStorage();
  for (const [index, change] of [{}, { status: 'failed' }, { status: 'pending' }, { status: 'refunded' }, { dashboardSent: 'true' }, { typeformCompleted: 'true' }, { typeformCompletedAt: new Date() }, { remindersCount: '0bad' }, { createdAt: new Date() }].entries()) {
    const row = await store.createSatellitescanPurchase({ customerEmail: 'synthetic@example.test', stripePaymentIntentId: `synthetic-${index}`, amount: '0.00', status: 'succeeded' });
    Object.assign(row, oldPurchase(), { id: row.id }, change);
  }
  const rows = await store.getOverdueSatellitescanPurchases(72);
  assert.equal(rows.length, 1); assert.equal(rows[0].status, 'succeeded');
});

test('stale candidate is reloaded: completed, refunded, already reminded, recent or missing orders never claim/send', async () => {
  const candidate = oldPurchase();
  for (const current of [undefined, { ...candidate, typeformCompleted: 'true' }, { ...candidate, status: 'refunded' }, { ...candidate, remindersCount: '1' }, { ...candidate, createdAt: new Date() }]) {
    reset(); fixture.resetDb(current);
    assert.equal(await fixture.remindScanOnce(candidate), false);
    assert.equal(fixture.claims, 0); assert.equal(fixture.messages.length, 0); assert.equal(fixture.updates.length, 0);
  }
});

test('current recipient and EN/FR locale are used, accepted reminders update count once', async () => {
  for (const language of ['en', 'fr']) {
    reset(oldPurchase(), 'claimed', true, language);
    assert.equal(await fixture.remindScanOnce({ ...oldPurchase(), customerEmail: 'stale@example.test' }), true);
    assert.deepEqual(fixture.messages[0].slice(0, 3), ['current@example.test', 'Current', language]);
    assert.match(fixture.messages[0][3], /^email_ops:v1:scan-reminder:/);
    assert.deepEqual(fixture.updates, [{ remindersCount: '1' }]);
    assert.equal(fixture.state, 'accepted');
  }
});

test('concurrent manual/scheduled attempts and later replays submit at most one reminder', async () => {
  reset();
  await Promise.all([fixture.remindScanOnce(oldPurchase()), fixture.remindScanOnce(oldPurchase())]);
  assert.equal(fixture.messages.length, 1); assert.equal(fixture.updates.length, 1);
  assert.equal(await fixture.remindScanOnce(oldPurchase()), false);
  assert.equal(fixture.messages.length, 1);
});

test('disabled/rejected/ambiguous sends never advance count or blindly resend', async () => {
  for (const result of [false, 'throw']) {
    reset(oldPurchase(), 'claimed', result);
    if (result === 'throw') await assert.rejects(fixture.remindScanOnce(oldPurchase()));
    else assert.equal(await fixture.remindScanOnce(oldPurchase()), false);
    assert.equal(fixture.updates.length, 0); assert.equal(fixture.state, 'unknown');
    assert.equal(await fixture.remindScanOnce(oldPurchase()), false); assert.equal(fixture.messages.length, 1);
  }
  for (const state of ['accepted', 'pending', 'unknown']) {
    reset(oldPurchase(), state);
    assert.equal(await fixture.remindScanOnce(oldPurchase()), false); assert.equal(fixture.messages.length, 0);
  }
});

test('unavailable state prevents sending; count-write failure preserves acceptance against duplicate retries', async () => {
  reset(); fixture.resetDb(oldPurchase(), true);
  await assert.rejects(fixture.remindScanOnce(oldPurchase())); assert.equal(fixture.claims, 0);
  reset(); fixture.resetOperations('claimed', 'fr', true);
  await assert.rejects(fixture.remindScanOnce(oldPurchase())); assert.equal(fixture.claims, 0);
  reset(); fixture.resetDb(oldPurchase(), false, true);
  await assert.rejects(fixture.remindScanOnce(oldPurchase()));
  assert.equal(fixture.messages.length, 1); assert.equal(fixture.state, 'accepted');
  assert.equal(await fixture.remindScanOnce(oldPurchase()), false); assert.equal(fixture.messages.length, 1);
});
