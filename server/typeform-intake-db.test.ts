import test, { before, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHmac } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { build } from 'esbuild';
import { parseTypeformReceipt, typeformDigest } from './typeform-intake';
import { createTypeformIntakeStore } from './typeform-intake-store';

let client: PGlite, store: ReturnType<typeof createTypeformIntakeStore>, fixture: any;
const now = new Date('2026-10-14T18:00:00Z'), secret = 'synthetic-secret', proof = 'A'.repeat(43);
const mapping = { formId: 'fixture-form', bindingField: 'service_reference', completionFieldRef: 'fixture_ready' };
function event(id = 'fixture-event', type = 'form_response', responseId = 'fixture-response', ready = true) {
  const raw = Buffer.from(JSON.stringify({ event_id: id, event_type: type, form_response: {
    form_id: 'fixture-form', token: responseId, submitted_at: '2026-10-14T17:00:00Z',
    hidden: { service_reference: proof }, answers: [{ type: 'boolean', field: { ref: 'fixture_ready' }, boolean: ready }, { type: 'text', field: { ref: 'private_answer' }, text: 'private synthetic answer' }],
  } }));
  return parseTypeformReceipt(raw, 'sha256=' + createHmac('sha256', secret).update(raw).digest('base64'), secret, mapping, now);
}
const count = async (table: string) => Number((await client.query<{ count: number }>(`SELECT count(*)::int AS count FROM ${table}`)).rows[0].count);
const purchase = async (id = 'order-one') => (await client.query<{ typeform_completed: string; reminders_count: string }>('SELECT typeform_completed,reminders_count FROM satellitescan_purchases WHERE id=$1', [id])).rows[0];

before(async () => {
  client = new PGlite();
  await client.exec(`CREATE TABLE satellitescan_purchases(id varchar PRIMARY KEY,customer_email text NOT NULL,customer_name text,amount text NOT NULL,stripe_payment_intent_id text NOT NULL UNIQUE,status text NOT NULL,typeform_completed text NOT NULL DEFAULT 'false',typeform_completed_at timestamp,dashboard_sent text NOT NULL DEFAULT 'false',reminders_count text NOT NULL DEFAULT '0',role text,created_at timestamp NOT NULL DEFAULT now());
    CREATE TABLE audit_logs(id varchar PRIMARY KEY DEFAULT gen_random_uuid(),user_email text NOT NULL,action_type text NOT NULL,resource text,details jsonb,ip_address text,created_at timestamp NOT NULL DEFAULT now());
    CREATE TABLE admin_settings(id varchar PRIMARY KEY DEFAULT gen_random_uuid(),key text UNIQUE NOT NULL,value text NOT NULL,updated_at timestamp NOT NULL DEFAULT now());`);
  await client.exec(await readFile('migrations/20261014_typeform_service_intake.sql', 'utf8'));
  await client.exec(await readFile('migrations/20261014_scan_service_review.sql', 'utf8'));
  await client.exec(await readFile('migrations/20261014_scan_response_content.sql', 'utf8'));
  const database = drizzle(client); store = createTypeformIntakeStore(database as any);
  (globalThis as any).__geTypeformTestDb = database;
  const mocks: Record<string,string> = {
    './db': 'export const db=globalThis.__geTypeformTestDb;',
    './email-notifications': `export const messages=[];export async function sendSatellitescanReminderEmail(...args){messages.push(args);return true;}export async function sendSatellitescanPurchaseEmail(){throw Error('forbidden');}`,
  };
  const result = await build({ stdin: { contents: 'export {DatabaseStorage} from "./storage";export {remindScanOnce} from "./scan-purchase-service";export {claimEmailOperation,finishEmailOperation} from "./email-operations";export {messages} from "./email-notifications";', resolveDir: process.cwd() + '/server' }, bundle: true, write: false, platform: 'node', format: 'esm', plugins: [{ name: 'isolated-database', setup(b) {
    b.onResolve({ filter: /.*/ }, args => Object.hasOwn(mocks,args.path) ? { path: args.path, namespace: 'fixture' } : undefined);
    b.onLoad({ filter: /.*/, namespace: 'fixture' }, args => ({ contents: mocks[args.path], loader: 'js' }));
  } }] });
  fixture = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
});
beforeEach(async () => {
  await client.exec(`DROP TRIGGER IF EXISTS fail_audit ON audit_logs; DROP TRIGGER IF EXISTS fail_task ON scan_typeform_service_tasks;
    TRUNCATE scan_typeform_review_actions,scan_typeform_service_tasks,scan_typeform_events,scan_typeform_bindings,satellitescan_purchases,audit_logs,admin_settings;
    INSERT INTO satellitescan_purchases(id,customer_email,customer_name,amount,stripe_payment_intent_id,status,created_at) VALUES
    ('order-one','same-payer@example.test','Synthetic','0.00','payment-one','succeeded',now()-interval '80 hours'),
    ('order-two','same-payer@example.test','Other','99.95','payment-two','succeeded',now()-interval '80 hours');`);
  await client.query(`INSERT INTO scan_typeform_bindings(id,reference_digest,purchase_id,participant_ref,form_id,expires_at,participant_verified_at,participant_verification_ref) VALUES('binding-one',$1,'order-one','participant-distinct-from-payer','fixture-form',$2,$3,'synthetic-verification')`, [typeformDigest(proof), new Date(now.getTime()+86400000),new Date(now.getTime()-3600000)]);
  fixture.messages.length = 0;
});
after(async () => { delete (globalThis as any).__geTypeformTestDb; await client?.close(); });

test('actual migration/store complete only the bound order and commit receipt/task/audit without mail', async () => {
  assert.deepEqual(await store.receive(event()), { outcome: 'recorded', replayed: false });
  assert.equal((await purchase()).typeform_completed, 'true'); assert.equal((await purchase('order-two')).typeform_completed, 'false');
  assert.equal(await count('scan_typeform_events'), 1); assert.equal(await count('scan_typeform_service_tasks'), 1); assert.equal(await count('audit_logs'), 1);
  assert.equal(fixture.messages.length, 0);
  const evidence = JSON.stringify((await client.query('SELECT * FROM scan_typeform_events')).rows)
    + JSON.stringify((await client.query('SELECT * FROM scan_typeform_service_tasks')).rows)
    + JSON.stringify((await client.query('SELECT * FROM audit_logs')).rows);
  assert.doesNotMatch(evidence, /private synthetic|same-payer|AAAAA|service_reference|answers/);
});
test('partial before final and late partial never create extra completion or service tasks', async () => {
  assert.equal((await store.receive(event('partial', 'form_response_partial'))).outcome, 'partial');
  assert.equal((await purchase()).typeform_completed, 'false'); assert.equal(await count('scan_typeform_service_tasks'), 0);
  assert.equal((await store.receive(event())).outcome, 'recorded');
  assert.equal((await store.receive(event('late-partial', 'form_response_partial'))).outcome, 'partial');
  assert.equal(await count('scan_typeform_service_tasks'), 1);
});
test('same-event replay, concurrent duplicate receipts and new-envelope replay have one business effect', async () => {
  const results = await Promise.all([store.receive(event()),store.receive(event())]);
  assert.equal(results.filter(x=>x.replayed).length, 1);
  assert.equal((await store.receive(event('new-envelope'))).outcome, 'duplicate');
  assert.equal(await count('scan_typeform_service_tasks'), 1); assert.equal(await count('scan_typeform_events'), 2);
});
test('event identity collision is refused; changed response/cross-response reference enters review', async () => {
  await store.receive(event());
  await assert.rejects(store.receive({ ...event(), payloadDigest: '0'.repeat(64) }));
  assert.equal((await store.receive({ ...event('changed'), responseDigest: '0'.repeat(64) })).outcome, 'review');
  assert.equal((await store.receive(event('other-response', 'form_response', 'different-response'))).outcome, 'review');
  assert.equal(await count('scan_typeform_service_tasks'), 1);
});
test('unknown proof, expired/revoked binding and unverified readiness cannot complete', async () => {
  assert.equal((await store.receive({ ...event('missing'), bindingDigest: null })).outcome, 'review');
  assert.equal((await store.receive(event('refusal', 'form_response', 'fixture-response', false))).outcome, 'review');
  await client.exec("UPDATE scan_typeform_bindings SET participant_verification_ref=null");
  assert.equal((await store.receive(event('unverified-subject'))).outcome, 'review');
  await client.exec("UPDATE scan_typeform_bindings SET participant_verification_ref='synthetic-verification'");
  await client.exec("UPDATE scan_typeform_bindings SET is_active='false'");
  assert.equal((await store.receive(event('revoked'))).outcome, 'review');
  await client.query("UPDATE scan_typeform_bindings SET is_active='true',expires_at=$1", [now]);
  assert.equal((await store.receive(event('expired'))).outcome, 'review');
  assert.equal((await purchase()).typeform_completed, 'false'); assert.equal(await count('scan_typeform_service_tasks'), 0);
});
test('failed/refunded/historically complete purchases enter review without new tasks', async () => {
  for (const status of ['failed','pending','refunded']) {
    await client.query('UPDATE satellitescan_purchases SET status=$1 WHERE id=$2',[status,'order-one']);
    assert.equal((await store.receive(event(status))).outcome, 'review');
  }
  await client.exec("UPDATE satellitescan_purchases SET status='succeeded',typeform_completed='true' WHERE id='order-one'");
  assert.equal((await store.receive(event('historical'))).outcome, 'review'); assert.equal(await count('scan_typeform_service_tasks'), 0);
});
test('failed audit rolls back receipt, exact purchase completion, binding and task together', async () => {
  await client.exec(`CREATE OR REPLACE FUNCTION reject_test_write() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic write failure'; END $$;
    CREATE TRIGGER fail_audit BEFORE INSERT ON audit_logs FOR EACH ROW EXECUTE FUNCTION reject_test_write();`);
  await assert.rejects(store.receive(event()));
  assert.equal(await count('scan_typeform_events'), 0); assert.equal(await count('scan_typeform_service_tasks'), 0); assert.equal((await purchase()).typeform_completed, 'false');
  assert.equal((await client.query('SELECT completed_digest FROM scan_typeform_bindings')).rows[0].completed_digest, null);
  await client.exec('DROP TRIGGER fail_audit ON audit_logs');
  assert.equal((await store.receive(event())).outcome, 'recorded');
});
test('failed task creation also rolls back earlier completion and permits safe fresh retry', async () => {
  await client.exec(`CREATE OR REPLACE FUNCTION reject_test_write() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic write failure'; END $$;
    CREATE TRIGGER fail_task BEFORE INSERT ON scan_typeform_service_tasks FOR EACH ROW EXECUTE FUNCTION reject_test_write();`);
  await assert.rejects(store.receive(event())); assert.equal((await purchase()).typeform_completed, 'false'); assert.equal(await count('scan_typeform_events'), 0);
  await client.exec('DROP TRIGGER fail_task ON scan_typeform_service_tasks');
  assert.equal((await store.receive(event())).outcome, 'recorded');
});
test('actual database reminder selector excludes unsuccessful, fulfilled, malformed and recent orders', async () => {
  await client.exec("DELETE FROM scan_typeform_bindings; DELETE FROM satellitescan_purchases WHERE id='order-two'");
  for (const [id, status, completed, completedAt, dashboard, reminders, hours] of [
    ['failed','failed','false',null,'false','0',80],['refunded','refunded','false',null,'false','0',80],
    ['complete','succeeded','true',new Date(),'false','0',80],['inconsistent','succeeded','false',new Date(),'false','0',80],
    ['dashboard','succeeded','false',null,'true','0',80],['sent','succeeded','false',null,'false','1',80],
    ['malformed','succeeded','false',null,'false','0bad',80],['recent','succeeded','false',null,'false','0',71],
  ] as const) await client.query(`INSERT INTO satellitescan_purchases(id,customer_email,amount,stripe_payment_intent_id,status,typeform_completed,typeform_completed_at,dashboard_sent,reminders_count,created_at) VALUES($1::text,'synthetic@example.test','0.00',$1::text,$2,$3,$4,$5,$6,$7)`,[id,status,completed,completedAt,dashboard,reminders,new Date(Date.now()-hours*3600000)]);
  const storage = new fixture.DatabaseStorage(), rows = await storage.getOverdueSatellitescanPurchases(72);
  assert.deepEqual(rows.map((r:any)=>r.id), ['order-one']);
  for (const hours of [NaN, -1, Infinity, 1e300]) assert.equal((await storage.getOverdueSatellitescanPurchases(hours)).length,0);
});
test('real database reminder reload and durable claims prevent stale/duplicate submission', async () => {
  const storage = new fixture.DatabaseStorage(), [candidate] = (await storage.getOverdueSatellitescanPurchases(72)).filter((r:any)=>r.id==='order-one');
  await client.exec("UPDATE satellitescan_purchases SET typeform_completed='true',typeform_completed_at=now() WHERE id='order-one'");
  assert.equal(await fixture.remindScanOnce(candidate),false); assert.equal(fixture.messages.length,0);
  await client.exec("UPDATE satellitescan_purchases SET typeform_completed='false',typeform_completed_at=null,customer_email='current@example.test' WHERE id='order-one'");
  await Promise.all([fixture.remindScanOnce(candidate),fixture.remindScanOnce(candidate)]);
  assert.equal(fixture.messages.length,1); assert.equal(fixture.messages[0][0],'current@example.test');
  assert.equal((await purchase()).reminders_count,'1'); assert.equal(await fixture.remindScanOnce(candidate),false);
});
