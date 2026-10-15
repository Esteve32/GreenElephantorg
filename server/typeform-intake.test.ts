import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { parseTypeformReceipt, createTypeformIntakeHandler, TypeformIntakeError } from './typeform-intake';
import { verifyTypeformSignature } from './delivery-security';

const secret = 'synthetic-typeform-test-secret';
const mapping = { formId: 'fixture-form', bindingField: 'service_reference', completionFieldRef: 'fixture_ready' };
const now = new Date('2026-10-14T18:00:00Z');
function payload() { return { event_id: 'fixture-event', event_type: 'form_response', form_response: {
  form_id: 'fixture-form', token: 'fixture-response', submitted_at: '2026-10-14T17:00:00Z',
  hidden: { service_reference: 'A'.repeat(43) }, answers: [{ type: 'boolean', field: { ref: 'fixture_ready' }, boolean: true }],
} }; }
function signed(value: unknown) { const raw = Buffer.from(JSON.stringify(value)); return { raw, signature: 'sha256=' + createHmac('sha256', secret).update(raw).digest('base64') }; }
function parse(value = payload(), config: unknown = mapping) { const { raw, signature } = signed(value); return parseTypeformReceipt(raw, signature, secret, config, now); }

test('verified form/mapping produce minimal receipt, not raw answers, consent or an email', () => {
  const receipt = parse();
  assert.equal(receipt.completionVerified, true); assert.equal(receipt.eventType, 'form_response');
  assert.match(receipt.bindingDigest!, /^[a-f0-9]{64}$/);
  assert.doesNotMatch(JSON.stringify(receipt), /service_reference|fixture_ready|AAAAA|answers|@/);
});
test('signature, configuration, payload limits and unsupported identities fail closed', () => {
  const { raw, signature } = signed(payload());
  for (const value of [undefined, 'invalid']) assert.throws(() => parseTypeformReceipt(raw, value, secret, mapping, now), (e: unknown) => e instanceof TypeformIntakeError && e.status === 401);
  for (const config of [{}, { ...mapping, completionFieldRef: '' }, { ...mapping, bindingField: 'Invalid Field' }]) assert.throws(() => parse(payload(), config));
  assert.throws(() => parse({ ...payload(), event_type: 'unknown' }));
  const wrong = payload(); wrong.form_response.form_id = 'different-form'; assert.throws(() => parse(wrong));
  assert.throws(() => parseTypeformReceipt(Buffer.alloc(2 * 1024 * 1024 + 1), signature, secret, mapping, now));
  const broken = Buffer.from('{');
  assert.throws(() => parseTypeformReceipt(broken, 'sha256=' + createHmac('sha256', secret).update(broken).digest('base64'), secret, mapping, now), (e: unknown) => e instanceof TypeformIntakeError && e.status === 400);
});
test('partial, missing/ambiguous readiness and missing/invalid binding cannot qualify completion', () => {
  const partial = payload(); partial.event_type = 'form_response_partial';
  assert.equal(parse(partial).completionVerified, false);
  for (const answers of [[], [{ ...payload().form_response.answers[0], boolean: false }], [...payload().form_response.answers, ...payload().form_response.answers]]) {
    const value = payload(); value.form_response.answers = answers;
    assert.equal(parse(value).completionVerified, false);
  }
  const missing = payload(); missing.form_response.hidden.service_reference = 'purchase-id';
  assert.equal(parse(missing).bindingDigest, null);
});
test('missing/future final timestamps and contradictory response types are refused', () => {
  const value: any = payload(); delete value.form_response.submitted_at; assert.throws(() => parse(value));
  value.form_response.submitted_at = '2026-10-15T18:00:00Z'; assert.throws(() => parse(value));
  value.form_response.submitted_at = '2026-10-14T17:00:00Z'; value.form_response.response_type = 'partial'; assert.throws(() => parse(value));
});

function response() { return { statusCode: 200, body: undefined as any, headers: {} as Record<string,string>,
  setHeader(key: string, value: string) { this.headers[key] = value; }, status(code: number) { this.statusCode = code; return this; }, json(body: unknown) { this.body = body; return this; } }; }
test('unconnected HTTP handler acknowledges durable receipt without requiring Resend', async () => {
  let received = false;
  const handler = createTypeformIntakeHandler({ secret: () => secret, mapping: () => mapping, enabled: async () => true, now: () => now,
    store: { async receive(input) { assert.equal(input.completionVerified, true); received = true; return { outcome: 'recorded', replayed: false }; } } });
  const { raw, signature } = signed(payload()), res = response();
  await handler({ body: raw, headers: { 'typeform-signature': signature } } as any, res as any);
  assert.equal(received, true); assert.equal(res.statusCode, 200); assert.equal(res.body.emailDelivery, 'not_attempted'); assert.equal(res.headers['Cache-Control'], 'no-store');
});
test('storage failure cannot acknowledge success or leak payload/provider text; review remains distinct', async () => {
  for (const failure of [true, false]) {
    const handler = createTypeformIntakeHandler({ secret: () => secret, mapping: () => mapping, enabled: async () => true, now: () => now,
      store: { async receive() { if (failure) throw Error('private token and email@example.test'); return { outcome: 'review', replayed: false }; } } });
    const { raw, signature } = signed(payload()), res = response();
    await handler({ body: raw, headers: { 'typeform-signature': signature } } as any, res as any);
    assert.equal(res.statusCode, failure ? 503 : 202); assert.equal(res.body.received, !failure);
    assert.doesNotMatch(JSON.stringify(res.body), /private|token|@/);
  }
});
test('disabled/unconfigured/invalid-signature handler never reaches storage', async () => {
  for (const mode of ['disabled', 'unconfigured', 'signature']) {
    const handler = createTypeformIntakeHandler({ secret: () => secret, mapping: () => mode === 'unconfigured' ? {} : mapping,
      enabled: async () => mode !== 'disabled', now: () => now, store: { async receive() { throw Error('must not reach store'); } } });
    const { raw, signature } = signed(payload()), res = response();
    await handler({ body: raw, headers: { 'typeform-signature': mode === 'signature' ? 'invalid' : signature } } as any, res as any);
    assert.equal(res.statusCode, mode === 'signature' ? 401 : 503); assert.equal(res.body.received, false);
  }
});
test('actual legacy route refuses partial/unknown events before email claim or completion', async () => {
  const source = ts.createSourceFile('routes.ts', readFileSync('server/routes.ts', 'utf8'), ts.ScriptTarget.Latest, true);
  let callback: ts.Node | undefined;
  function visit(node: ts.Node) {
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.expression.getText(source) === 'app'
      && ts.isStringLiteral(node.arguments[0]) && node.arguments[0].text === '/api/typeform-webhook') callback = node.arguments.at(-1);
    ts.forEachChild(node, visit);
  }
  visit(source); assert.ok(callback);
  const code = ts.transpileModule(`const handler=${callback.getText(source)};`, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
  const handler = new Function('verifyTypeformSignature', 'isConnectorEnabled', 'claimEmailOperation', 'storage', `${code};return handler;`)(
    verifyTypeformSignature, async () => true, () => { throw Error('must not claim'); }, new Proxy({}, { get() { throw Error('must not complete'); } }));
  const prior = process.env.TYPEFORM_WEBHOOK_SECRET; process.env.TYPEFORM_WEBHOOK_SECRET = secret;
  try {
    for (const event_type of ['form_response_partial', 'unknown']) {
      const { raw, signature } = signed({ ...payload(), event_type }), res = response();
      await handler({ body: raw, headers: { 'typeform-signature': signature } }, res);
      assert.equal(res.statusCode, 422); assert.equal(res.body.received, false);
    }
  } finally { if (prior === undefined) delete process.env.TYPEFORM_WEBHOOK_SECRET; else process.env.TYPEFORM_WEBHOOK_SECRET = prior; }
});
