import test, { before, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHmac } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { createScanTypeformReferencePreparer, ScanTypeformReferenceError } from './scan-typeform-reference';
import { operationKey } from './delivery-security';
import { parseTypeformReceipt, typeformDigest } from './typeform-intake';
import { createTypeformIntakeStore } from './typeform-intake-store';
import { scanServiceEmail } from './scan-service-email';
import { scanTypeformLink } from '../shared/scan-typeform-link';

let client: PGlite, database: any;
const now = new Date('2026-10-14T18:00:00Z'), expires = new Date('2026-11-14T18:00:00Z');
const options = { key: Buffer.alloc(32, 7), formId: 'fixture-form', bindingField: 'service_reference', now: () => now };
const rows = async (table: string) => (await client.query(`SELECT * FROM ${table}`)).rows;
const preparer = (changes = {}) => createScanTypeformReferencePreparer(database, { ...options, ...changes });
const reason = (expected: string) => (error: unknown) => error instanceof ScanTypeformReferenceError && error.reason === expected;

before(async () => {
  client = new PGlite(); database = drizzle(client);
  await client.exec(`CREATE TABLE satellitescan_purchases(id varchar PRIMARY KEY,customer_email text NOT NULL,customer_name text,amount text NOT NULL,stripe_payment_intent_id text UNIQUE NOT NULL,status text NOT NULL,typeform_completed text NOT NULL DEFAULT 'false',typeform_completed_at timestamp,dashboard_sent text NOT NULL DEFAULT 'false',reminders_count text NOT NULL DEFAULT '0',role text,created_at timestamp NOT NULL DEFAULT now());
    CREATE TABLE admin_settings(id varchar PRIMARY KEY DEFAULT gen_random_uuid(),key text UNIQUE NOT NULL,value text NOT NULL,updated_at timestamp NOT NULL DEFAULT now());
    CREATE TABLE audit_logs(id varchar PRIMARY KEY DEFAULT gen_random_uuid(),user_email text NOT NULL,action_type text NOT NULL,resource text,details jsonb,ip_address text,created_at timestamp NOT NULL DEFAULT now());`);
  await client.exec(await readFile('migrations/20261014_typeform_service_intake.sql', 'utf8'));
  await client.exec(await readFile('migrations/20261014_scan_service_review.sql', 'utf8'));
  await client.exec(await readFile('migrations/20261014_scan_response_content.sql', 'utf8'));
});
beforeEach(async () => {
  await client.exec(`DROP TRIGGER IF EXISTS fail_audit ON audit_logs;
    TRUNCATE scan_typeform_review_actions,scan_typeform_service_tasks,scan_typeform_events,scan_typeform_bindings,satellitescan_purchases,admin_settings,audit_logs;
    INSERT INTO satellitescan_purchases(id,customer_email,amount,stripe_payment_intent_id,status) VALUES
    ('paid-order','same-payer@example.test','99.95','payment-one','succeeded'),
    ('voucher-order','same-payer@example.test','0.00','FREE-synthetic','succeeded');`);
  for (const id of ['paid-order', 'voucher-order']) await client.query('INSERT INTO admin_settings(key,value) VALUES($1,$2)', [operationKey('purchase-language', id), 'fr']);
});
after(async () => { await client?.close(); });

test('actual SQL prepares distinct opaque references for paid/voucher orders sharing payer email', async () => {
  const prepare = preparer(), first = await prepare('paid-order', expires), second = await prepare('voucher-order', expires);
  assert.notEqual(first.reference.value, second.reference.value);
  for (const result of [first, second]) {
    const url = new URL(result.url), parameters = new URLSearchParams(url.hash.slice(1));
    assert.equal(url.origin + url.pathname, 'https://greenelephantorg.typeform.com/individualscan');
    assert.equal(parameters.get('language'), 'fr');
    assert.equal(parameters.get('service_reference'), result.reference.value);
    assert.match(result.reference.value, /^[A-Za-z0-9_-]{43}$/);
    assert.doesNotMatch(result.url, /paid-order|voucher-order|same-payer|payment-one|FREE-/);
  }
  const saved: any[] = await rows('scan_typeform_bindings');
  assert.equal(saved.length, 2);
  assert.equal(saved.find(x => x.purchase_id === first.purchaseId).reference_digest, typeformDigest(first.reference.value));
  assert.ok(saved.every(x => x.participant_verified_at === null && x.participant_verification_ref === null && x.participant_ref.startsWith('unassigned-order:')));
  assert.doesNotMatch(JSON.stringify(saved) + JSON.stringify(await rows('audit_logs')), new RegExp(first.reference.value + '|same-payer|answers'));
});

test('recovery/reminder retries reuse one binding, original expiry and original locale', async () => {
  const prepare = preparer();
  const results = await Promise.all([prepare('paid-order', expires), prepare('paid-order', new Date(expires.getTime() + 86400000))]);
  assert.deepEqual(results[0], results[1]);
  assert.equal(results[0].expiresAt.getTime(), expires.getTime());
  assert.equal((await rows('scan_typeform_bindings')).length, 1);
  assert.equal((await rows('audit_logs')).length, 1);
});

test('existing purchase/reminder copy can carry the same reference in English/French without another email', async () => {
  const prepared = await preparer()('paid-order', expires);
  for (const language of ['en', 'fr'] as const) for (const kind of ['purchase', 'reminder'] as const) {
    const original = scanServiceEmail(kind, 'Synthetic <name>', language);
    const candidate = scanServiceEmail(kind, 'Synthetic <name>', language, prepared.reference);
    const link = scanTypeformLink(language, prepared.reference), plain = scanTypeformLink(language);
    assert.equal(candidate.subject, original.subject);
    assert.equal(candidate.text, original.text.replace(plain, link));
    assert.equal(candidate.html, original.html.replace(plain, link.replaceAll('&', '&amp;')));
    assert.match(candidate.html, /Synthetic &lt;name&gt;/);
    assert.equal(plain, 'https://greenelephantorg.typeform.com/individualscan#language=' + language);
  }
});

test('missing, unsuccessful and already fulfilled actual orders cannot prepare a link', async () => {
  await assert.rejects(preparer()('missing', expires), reason('purchase_ineligible'));
  for (const status of ['pending', 'failed', 'refunded']) {
    await client.query('UPDATE satellitescan_purchases SET status=$1 WHERE id=$2', [status, 'paid-order']);
    await assert.rejects(preparer()('paid-order', expires), reason('purchase_ineligible'));
  }
  await client.exec("UPDATE satellitescan_purchases SET status='succeeded',typeform_completed_at=now() WHERE id='paid-order'");
  await assert.rejects(preparer()('paid-order', expires), reason('purchase_ineligible'));
  await client.exec("UPDATE satellitescan_purchases SET typeform_completed_at=null,dashboard_sent='true' WHERE id='paid-order'");
  await assert.rejects(preparer()('paid-order', expires), reason('purchase_ineligible'));
  assert.equal((await rows('scan_typeform_bindings')).length, 0);
});

test('missing or invalid historical locale markers require review, with no default-language send', async () => {
  await client.exec('DELETE FROM admin_settings');
  await assert.rejects(preparer()('paid-order', expires), reason('review_required'));
  await client.query('INSERT INTO admin_settings(key,value) VALUES($1,$2)', [operationKey('purchase-language', 'paid-order'), 'unknown']);
  await assert.rejects(preparer()('paid-order', expires), reason('review_required'));
  assert.equal((await rows('scan_typeform_bindings')).length, 0);
});

test('revocation, expiry, completed response, mapping/key rotation and multiple bindings never silently replace a link', async () => {
  const first = await preparer()('paid-order', expires);
  await assert.rejects(preparer({ key: Buffer.alloc(32, 8) })('paid-order', expires), reason('review_required'));
  await assert.rejects(preparer({ bindingField: 'another_reference' })('paid-order', expires), reason('review_required'));
  await assert.rejects(preparer({ formId: 'another-form' })('paid-order', expires), reason('review_required'));
  await client.exec("UPDATE scan_typeform_bindings SET is_active='false'");
  await assert.rejects(preparer()('paid-order', expires), reason('review_required'));
  await client.query("UPDATE scan_typeform_bindings SET is_active='true',expires_at=$1", [now]);
  await assert.rejects(preparer()('paid-order', expires), reason('review_required'));
  await client.query('UPDATE scan_typeform_bindings SET expires_at=$1,completed_digest=$2', [expires, '0'.repeat(64)]);
  await assert.rejects(preparer()('paid-order', expires), reason('review_required'));
  await client.exec('UPDATE scan_typeform_bindings SET completed_digest=null');
  await client.query("INSERT INTO scan_typeform_bindings(reference_digest,purchase_id,participant_ref,form_id,expires_at) VALUES($1,'paid-order','unassigned-order:paid-order','fixture-form',$2)", ['1'.repeat(64), expires]);
  await assert.rejects(preparer()('paid-order', expires), reason('review_required'));
  assert.equal((await rows('scan_typeform_bindings'))[0].id, first.bindingId);
});

test('audit failure rolls back binding; retry after repair can prepare exactly once', async () => {
  await client.exec(`CREATE OR REPLACE FUNCTION reject_reference_test_write() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic write failure'; END $$;
    CREATE TRIGGER fail_audit BEFORE INSERT ON audit_logs FOR EACH ROW EXECUTE FUNCTION reject_reference_test_write();`);
  await assert.rejects(preparer()('paid-order', expires));
  assert.equal((await rows('scan_typeform_bindings')).length, 0);
  await client.exec('DROP TRIGGER fail_audit ON audit_logs');
  await preparer()('paid-order', expires);
  assert.equal((await rows('scan_typeform_bindings')).length, 1);
});

test('same-link reference reaches signed parser but never asserts participant identity or completes an order', async () => {
  const prepared = await preparer()('paid-order', expires), secret = 'synthetic-provider-secret';
  const raw = Buffer.from(JSON.stringify({ event_id: 'fixture-event', event_type: 'form_response', form_response: {
    form_id: options.formId, token: 'fixture-response', submitted_at: now.toISOString(),
    hidden: { [prepared.reference.field]: prepared.reference.value }, answers: [{ type: 'boolean', field: { ref: 'fixture_ready' }, boolean: true }],
  } }));
  const receipt = parseTypeformReceipt(raw, 'sha256=' + createHmac('sha256', secret).update(raw).digest('base64'), secret,
    { ...options, completionFieldRef: 'fixture_ready' }, now);
  assert.equal(receipt.bindingDigest, typeformDigest(prepared.reference.value));
  assert.equal((await createTypeformIntakeStore(database).receive(receipt)).outcome, 'review');
  assert.equal((await rows('scan_typeform_events'))[0].reason, 'participant_unverified');
  assert.ok((await rows('satellitescan_purchases')).every((x: any) => x.typeform_completed === 'false'));
  assert.equal((await rows('scan_typeform_service_tasks')).length, 0);
});

test('invalid configuration and link injection are rejected before writes', async () => {
  for (const changes of [{ key: Buffer.alloc(31) }, { formId: '' }, { formId: undefined }, { bindingField: 'language' }, { bindingField: 'lang' }, { bindingField: 'bad&field' }]) {
    assert.throws(() => preparer(changes), reason('configuration_required'));
  }
  await assert.rejects(preparer()('paid-order', now), reason('configuration_required'));
  await assert.rejects(preparer()('paid-order', new Date('invalid')), reason('configuration_required'));
  assert.throws(() => scanTypeformLink('en', { field: 'service_reference', value: '"><script>' }));
  assert.throws(() => scanTypeformLink('en', { field: 'language', value: 'A'.repeat(43) }));
  assert.equal((await rows('scan_typeform_bindings')).length, 0);
});
