import test, { before, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import express from 'express';
import type { Server } from 'node:http';
import type { SessionData } from 'express-session';
import { scanServiceReviewFixture } from '../scripts/scan-service-review-fixture';
import { registerScanServiceReviewRoutes } from './scan-service-review-routes';
import { ScanReviewError } from '@shared/scan-service-review';

let f: Awaited<ReturnType<typeof scanServiceReviewFixture>>, server: Server, origin: string;
let session: Partial<SessionData> | undefined;
const resolveInput = (eventId = 'synthetic-paid', expectedVersion = 0) => ({ mutationId: randomUUID(), expectedVersion,
  decision: 'resolved', reason: 'service_reviewed', evidenceRef: 'evidence-' + eventId });
const holdInput = () => ({ mutationId: randomUUID(), expectedVersion: 0, decision: 'held', reason: 'awaiting_evidence' });
const errorCode = (code: string) => (e: unknown) => e instanceof ScanReviewError && e.code === code;
const count = async (table: string) => (await f.client.query<{ count: number }>('SELECT count(*)::int AS count FROM ' + table)).rows[0].count;
const purchase = async (id = 'synthetic-order-0') => (await f.client.query<any>('SELECT * FROM satellitescan_purchases WHERE id=$1', [id])).rows[0];
before(async () => {
  f = await scanServiceReviewFixture(); const app = express(); app.use(express.json());
  app.use((req, _res, next) => { req.session = session as typeof req.session; next(); });
  registerScanServiceReviewRoutes(app, { owner: () => f.actor.email, siteUrl: () => origin,
    findAdmin: async id => (await f.client.query<any>('SELECT id,email,google_id AS "googleId",role,is_active AS "isActive" FROM admin_users WHERE id=$1', [id])).rows[0], store: f.store });
  server = await new Promise<Server>((resolve, reject) => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); s.on('error', reject); });
  const address = server.address(); assert.ok(address && typeof address !== 'string'); origin = 'http://127.0.0.1:' + address.port;
});
beforeEach(async () => { await f.reset(); session = { isAdmin: true, adminUserId: f.actor.id, adminGoogleSubject: f.actor.googleId,
  adminMfaVerified: true, adminGoogleAuthTime: Date.now(), adminAuthenticatedAt: Date.now() }; });
after(async () => { if (server) await new Promise<void>(resolve => server.close(() => resolve())); await f?.client.close(); });
const get = (suffix = '') => fetch(origin + '/api/admin/scan-service' + suffix);
const post = (input: unknown = resolveInput(), eventId = 'synthetic-paid', headers: Record<string,string> = { Origin: origin }) =>
  fetch(origin + '/api/admin/scan-service/' + eventId + '/actions', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(input) });

test('owner queue is audited, paginated and redacted; private evidence is only in restricted detail', async () => {
  const response = await get(); assert.equal(response.status,200); assert.equal(response.headers.get('cache-control'),'no-store');
  const list = await response.json(); assert.equal(list.receipts.length,4); assert.doesNotMatch(JSON.stringify(list), /@|payloadDigest|bindingDigest|mappingDigest|evidence-synthetic/);
  const detail = await (await get('/synthetic-paid')).json(); assert.equal(detail.canResolve,true);
  assert.equal(detail.evidenceOptions[0].recipientEmail,'participant-0@example.test');
  assert.equal(await count('audit_logs'),6); // four original intake audits, list and detail
  for (let n = 0; n < 27; n++) await f.intake.receive({ ...f.receipt('page-' + String(n).padStart(2,'0')), bindingDigest: null });
  const first = await f.store.list(f.actor), second = await f.store.list(f.actor,first.nextCursor!);
  assert.equal(first.receipts.length,25); assert.ok(first.nextCursor); assert.equal(new Set([...first.receipts,...second.receipts].map(r => r.eventId)).size,31);
});
test('HTTP rejects missing/wrong owner, stale or unverified MFA, inactive account and future authentication', async () => {
  const valid = { ...session };
  for (const changed of [undefined, { ...valid, adminMfaVerified:false }, { ...valid, adminGoogleSubject:'99999' },
    { ...valid, adminAuthenticatedAt:Date.now()-31*60_000 }, { ...valid, adminAuthenticatedAt:Date.now()+60_000 }]) {
    session = changed; assert.ok([401,403].includes((await get()).status)); assert.ok([401,403].includes((await post()).status));
  }
  session = valid; await f.client.exec("UPDATE admin_users SET role='viewer'"); assert.equal((await get()).status,403);
  await f.client.exec("UPDATE admin_users SET role='admin'"); assert.equal((await post()).status,403);
  await f.client.exec("UPDATE admin_users SET role='super_admin',is_active='false'"); assert.equal((await get()).status,403);
  assert.equal(await count('scan_typeform_review_actions'),0);
});
test('writes require configured origin, strict bounded input and server-held evidence, never typed recipients', async () => {
  for (const headers of [{},{Origin:'https://untrusted.invalid'},{Origin:'null'}]) assert.equal((await post(resolveInput(),undefined,headers)).status,403);
  assert.equal((await post({...resolveInput(),recipientEmail:'payer@example.test'})).status,400);
  assert.equal((await post({...resolveInput(),evidenceRef:undefined})).status,400);
  assert.equal((await get('?after=x&after=y')).status,400);
  assert.equal((await post({...holdInput(),extra:'x'.repeat(5000)})).status,413);
  assert.equal(await count('scan_typeform_review_actions'),0);
});
test('hold then explicit resolution commits one exact order/task without identity claims or rewriting original receipt', async () => {
  const hold = holdInput(); assert.equal((await f.store.act(f.actor,'synthetic-paid',hold)).version,1);
  const input = resolveInput('synthetic-paid',1); assert.deepEqual(await f.store.act(f.actor,'synthetic-paid',input),{version:2,decision:'resolved',replayed:false});
  assert.equal((await purchase()).typeform_completed,'true'); assert.equal((await purchase('synthetic-order-1')).typeform_completed,'false');
  const detail = await f.store.detail(f.actor,'synthetic-paid'); assert.equal(detail.receipt.outcome,'review'); assert.equal(detail.receipt.reason,'participant_unverified');
  assert.equal(detail.receipt.state,'resolved'); assert.equal(detail.task?.recipientEmail,'participant-0@example.test');
  assert.equal(detail.task?.ownerId,f.actor.id); assert.equal(detail.task?.dueAt,'2026-10-17T17:00:00.000Z'); assert.equal(detail.task?.state,'pending_retrieval');
  const binding = (await f.client.query<any>("SELECT * FROM scan_typeform_bindings WHERE id='synthetic-binding-0'")).rows[0];
  assert.equal(binding.participant_verified_at,null); assert.equal(binding.participant_verification_ref,null); assert.match(binding.participant_ref,/unassigned-order:/);
  assert.equal((await purchase()).dashboard_sent,'false'); assert.equal(await count('scan_typeform_service_tasks'),1);
  assert.equal((await f.intake.receive(f.receipt('synthetic-paid'))).outcome,'review'); // original replay is still immutable
  assert.doesNotMatch(JSON.stringify((await f.client.query('SELECT details FROM audit_logs')).rows),/@|participant-|answers/);
});
test('same action replays once; changed payload and stale revisions conflict', async () => {
  const input=resolveInput(); await f.store.act(f.actor,'synthetic-paid',input);
  assert.equal((await f.store.act(f.actor,'synthetic-paid',input)).replayed,true);
  await assert.rejects(f.store.act(f.actor,'synthetic-paid',{...input,evidenceRef:'different'}),errorCode('review_conflict'));
  await assert.rejects(f.store.act(f.actor,'synthetic-paid',holdInput()),errorCode('review_conflict'));
  assert.equal(await count('scan_typeform_review_actions'),1); assert.equal(await count('scan_typeform_service_tasks'),1);
});
test('simultaneous review attempts with one version have one effect', async () => {
  const results=await Promise.allSettled([f.store.act(f.actor,'synthetic-paid',resolveInput()),f.store.act(f.actor,'synthetic-paid',resolveInput())]);
  assert.equal(results.filter(r=>r.status==='fulfilled').length,1); assert.equal(await count('scan_typeform_service_tasks'),1);
});
test('one form/response cannot satisfy two orders even through different event envelopes', async () => {
  await f.seedEvent('same-response-a',0,true,'shared-response'); await f.seedEvent('same-response-b',1,true,'shared-response');
  await f.store.act(f.actor,'same-response-a',resolveInput('same-response-a'));
  await assert.rejects(f.store.act(f.actor,'same-response-b',resolveInput('same-response-b')),errorCode('review_conflict'));
  assert.equal((await purchase('synthetic-order-1')).typeform_completed,'false'); assert.equal(await count('scan_typeform_service_tasks'),1);
});
test('automatic intake also refuses a response already reserved for another eligible order', async () => {
  await f.client.exec("UPDATE scan_typeform_bindings SET participant_verified_at='2026-10-14T16:00:00Z',participant_verification_ref='synthetic-independent-proof'");
  assert.equal((await f.intake.receive(f.receipt('auto-a',0,true,'shared-response'))).outcome,'recorded');
  assert.equal((await f.intake.receive(f.receipt('auto-b',1,true,'shared-response'))).outcome,'review');
  assert.equal((await purchase('synthetic-order-1')).typeform_completed,'false'); assert.equal(await count('scan_typeform_service_tasks'),1);
});
test('early refusal, legacy evidence gaps, partial and missing mapping cannot be overridden', async () => {
  for (const eventId of ['synthetic-refusal','synthetic-legacy']) {
    await assert.rejects(f.store.act(f.actor,eventId,resolveInput(eventId)),errorCode('review_evidence_required'));
    assert.equal((await f.store.detail(f.actor,eventId)).canResolve,false);
  }
  await f.client.exec("UPDATE scan_typeform_events SET mapping_digest=null WHERE event_id='synthetic-paid'");
  await assert.rejects(f.store.act(f.actor,'synthetic-paid',resolveInput()),errorCode('review_evidence_required'));
  await f.client.exec("UPDATE scan_typeform_events SET event_type='form_response_partial' WHERE event_id='synthetic-voucher'");
  await assert.rejects(f.store.act(f.actor,'synthetic-voucher',resolveInput('synthetic-voucher')),errorCode('review_evidence_required'));
  assert.equal(await count('scan_typeform_service_tasks'),0);
});
test('changed upstream evidence, unknown reference and duplicate evidence identity cannot resolve', async () => {
  const original={...f.evidence.get('synthetic-paid')![0]};
  for (const changed of [{...original,responseDigest:'f'.repeat(64)},{...original,recipientEvidenceRef:''},{...original,formId:'other'},
    {...original,recordedAt:'2099-01-01T00:00:00Z'}]) {
    f.evidence.set('synthetic-paid',[changed]); await assert.rejects(f.store.act(f.actor,'synthetic-paid',resolveInput()),errorCode('review_evidence_required'));
  }
  f.evidence.set('synthetic-paid',[original,original]); assert.equal((await f.store.detail(f.actor,'synthetic-paid')).canResolve,false);
});
test('review evidence cannot overwrite or contradict existing independent participant verification', async () => {
  await f.client.exec("UPDATE scan_typeform_bindings SET participant_ref='different-person',participant_verified_at='2026-10-14T16:00:00Z',participant_verification_ref='independent-proof' WHERE id='synthetic-binding-0'");
  await assert.rejects(f.store.act(f.actor,'synthetic-paid',resolveInput()),errorCode('review_evidence_required'));
  assert.equal((await f.store.detail(f.actor,'synthetic-paid')).canResolve,false);
  assert.equal(await count('scan_typeform_service_tasks'),0);
});
test('refund, revocation, expiry, fulfilment and response conflicts block stale assignments', async () => {
  for (const change of ["UPDATE satellitescan_purchases SET status='refunded' WHERE id='synthetic-order-0'",
    "UPDATE scan_typeform_bindings SET is_active='false' WHERE id='synthetic-binding-0'",
    "UPDATE scan_typeform_bindings SET expires_at='2026-10-14T18:00:00Z' WHERE id='synthetic-binding-0'",
    "UPDATE satellitescan_purchases SET dashboard_sent='true' WHERE id='synthetic-order-0'",
    "UPDATE scan_typeform_bindings SET response_id='different-response' WHERE id='synthetic-binding-0'"]) {
    await f.reset(); await f.client.exec(change); await assert.rejects(f.store.act(f.actor,'synthetic-paid',resolveInput()),errorCode('review_evidence_required'));
    assert.equal(await count('scan_typeform_service_tasks'),0);
  }
});
test('zero-price voucher resolves; rejection is an explicit terminal decision without service effects', async () => {
  await f.store.act(f.actor,'synthetic-voucher',resolveInput('synthetic-voucher')); assert.equal((await purchase('synthetic-order-1')).typeform_completed,'true');
  const reject={...holdInput(),decision:'rejected',reason:'not_qualifying'}; await f.store.act(f.actor,'synthetic-refusal',reject);
  assert.equal((await f.store.act(f.actor,'synthetic-refusal',reject)).replayed,true);
  await assert.rejects(f.store.act(f.actor,'synthetic-refusal',holdInput()),errorCode('review_conflict'));
  assert.equal((await purchase()).typeform_completed,'false');
});
test('failed audit and failed task creation roll back resolution, completion and reservation together', async () => {
  for (const [table,trigger] of [['audit_logs','fail_review_audit'],['scan_typeform_service_tasks','fail_review_task']]) {
    await f.reset(); await f.client.exec(`CREATE OR REPLACE FUNCTION reject_review_write() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic write failure'; END $$;
      CREATE TRIGGER ${trigger} BEFORE INSERT ON ${table} FOR EACH ROW EXECUTE FUNCTION reject_review_write();`);
    const input=resolveInput(); await assert.rejects(f.store.act(f.actor,'synthetic-paid',input));
    assert.equal((await purchase()).typeform_completed,'false'); assert.equal(await count('scan_typeform_review_actions'),0); assert.equal(await count('scan_typeform_service_tasks'),0);
    await f.client.exec(`DROP TRIGGER ${trigger} ON ${table}`); assert.equal((await f.store.act(f.actor,'synthetic-paid',input)).version,1);
  }
});
test('failed read audit returns no private detail; account changes are rechecked in the transaction', async () => {
  await f.client.exec(`CREATE OR REPLACE FUNCTION reject_review_write() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'private database payload'; END $$;
    CREATE TRIGGER fail_review_audit BEFORE INSERT ON audit_logs FOR EACH ROW EXECUTE FUNCTION reject_review_write();`);
  const response=await get('/synthetic-paid'); assert.equal(response.status,503); assert.deepEqual(await response.json(),{code:'review_unavailable'});
  await f.client.exec("DROP TRIGGER fail_review_audit ON audit_logs; UPDATE admin_users SET is_active='false'");
  await assert.rejects(f.store.act(f.actor,'synthetic-paid',resolveInput()),errorCode('review_access_required'));
});
test('review registration stays unmounted and has no live DB, provider, email or scheduler import', async () => {
  const routes=await readFile('server/routes.ts','utf8'); assert.doesNotMatch(routes,/registerScanServiceReviewRoutes\(/);
  for (const path of ['server/scan-service-review-store.ts','server/scan-service-review-routes.ts']) {
    const source=await readFile(path,'utf8'); assert.doesNotMatch(source,/from ['"].*(?:email-notifications|scheduler|connectorGuard)['"]|process\.env|fetch\(/);
  }
});
