import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import express from 'express';
import { registerEmailPreferenceRoutes } from './email-preference-routes';
import { verifiedEmailToken } from './delivery-security';

let server: Server;
let origin: string;
let calls = 0;
let fail = false;
let release: (() => void) | undefined;
let hold = false;
const secret = 'fictional-test-secret-that-is-more-than-32-characters';
const contact = 'fixture-contact';
const link = () => origin + '/api/email/unsubscribe?contact=' + contact + '&token=' + verifiedEmailToken(contact, secret);

before(async () => {
  const app = express();
  registerEmailPreferenceRoutes(app, {
    secret: () => secret,
    async withdraw(id) {
      assert.equal(id, contact); calls++;
      if (hold) await new Promise<void>(resolve => { release = resolve; });
      if (fail) throw Error('Synthetic private database detail that must not leak');
    },
  });
  server = await new Promise<Server>(resolve => {
    const running = app.listen(0, '127.0.0.1', () => resolve(running));
  });
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  origin = 'http://127.0.0.1:' + address.port;
});
after(async () => { if (server) await new Promise<void>((resolve,reject) => server.close(err => err ? reject(err) : resolve())); });

test('GET scanner visits never withdraw; signed POST does not require a login', async () => {
  const before = calls;
  const get = await fetch(link());
  assert.equal(get.status, 200); assert.equal(calls, before);
  assert.match(await get.text(), /method="post"/);
  assert.equal(get.headers.get('referrer-policy'), 'no-referrer');
  assert.equal(get.headers.get('cache-control'), 'no-store');
  const post = await fetch(link(), {method:'POST',body:'List-Unsubscribe=One-Click',headers:{'Content-Type':'application/x-www-form-urlencoded'}});
  assert.equal(post.status, 200); assert.equal(calls, before+1);
  assert.match(await post.text(), /Service emails are unchanged/);
});

test('invalid, tampered and duplicate query values never reach persistence', async () => {
  const before = calls;
  for (const suffix of [
    '?contact='+contact+'&token=invalid',
    '?contact=other&token='+verifiedEmailToken(contact, secret),
    '?contact='+contact+'&contact=other&token='+verifiedEmailToken(contact, secret),
    '',
  ]) {
    const response = await fetch(origin+'/api/email/unsubscribe'+suffix, {method:'POST'});
    assert.equal(response.status, 400);
    assert.equal(response.headers.get('cache-control'), 'no-store');
  }
  assert.equal(calls, before);
});

test('response waits for durable completion; persistence error returns retry without leaking details', async () => {
  hold = true; fail = true;
  let responded = false;
  const response = fetch(link(), {method:'POST'}).then(r => { responded=true; return r; });
  // Wait for the injected persistence boundary, not an arbitrary sleep.
  while (!release) await new Promise(resolve => setImmediate(resolve));
  assert.equal(responded, false);
  hold=false; release(); release=undefined;
  const result = await response;
  assert.equal(result.status, 503);
  const text = await result.text();
  assert.match(text, /try again/);
  assert.doesNotMatch(text, /stopped|database|private/);
  fail=false;
});
