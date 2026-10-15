import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import type { Server } from 'node:http';
import { qrRedirectHandler } from './qr-redirect';
import { BROCHURE_QR, printedQrUrl, safeQrTarget } from '../shared/qr-campaign';
import type { QrCode, InsertQrScan } from '../shared/schema';

const code: QrCode = { id: 'brochure', ...BROCHURE_QR, type: 'campaign', isActive: 'true', createdAt: new Date() };
async function fixture(work: (origin: string, scans: InsertQrScan[]) => Promise<void>, options: { code?: QrCode | null; failRead?: boolean; failWrite?: boolean } = {}) {
  const scans: InsertQrScan[] = [];
  const app = express();
  app.get('/qr/:slug', qrRedirectHandler({
    getQrCodeBySlug: async slug => { if (options.failRead) throw Error('offline'); return slug === BROCHURE_QR.slug ? options.code === null ? undefined : options.code ?? code : undefined; },
    createQrScan: async scan => { if (options.failWrite) throw Error('offline'); scans.push(scan); },
  }, () => {}));
  const server = await new Promise<Server>((resolve, reject) => { const value = app.listen(0, '127.0.0.1', () => resolve(value)); value.on('error', reject); });
  const address = server.address(); assert.ok(address && typeof address !== 'string');
  try { await work(`http://127.0.0.1:${address.port}`, scans); }
  finally { await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())); }
}
const path = '/qr/' + BROCHURE_QR.slug;

test('brochure link records only its campaign reference, redirects without caching or cookies, and counts repeats', async () => {
  await fixture(async (origin, scans) => {
    for (let i = 0; i < 2; i++) {
      const response = await fetch(origin + path, { redirect: 'manual', headers: { 'x-forwarded-for': '198.51.100.3', 'user-agent': 'Private browser', referer: 'https://example.test/private?email=secret', cookie: 'test=value' } });
      assert.equal(response.status, 302); assert.equal(response.headers.get('location'), '/');
      assert.match(response.headers.get('cache-control')!, /no-store/); assert.equal(response.headers.get('set-cookie'), null);
    }
    assert.deepEqual(scans, [{ qrCodeId: code.id }, { qrCodeId: code.id }]);
  });
});
test('HEAD and advertised prefetch/prerender requests redirect without adding opens', async () => {
  await fixture(async (origin, scans) => {
    await fetch(origin + path, { method: 'HEAD', redirect: 'manual' });
    for (const headers of [{ purpose: 'prefetch' }, { 'sec-purpose': 'prefetch;prerender' }]) {
      const response = await fetch(origin + path, { headers, redirect: 'manual' }); assert.equal(response.headers.get('location'), '/');
    }
    assert.equal(scans.length, 0);
  });
});
test('missing, inactive and unsafe campaigns do not add opens', async () => {
  for (const value of [null, { ...code, isActive: 'false' }, { ...code, targetUrl: '//evil.test' }]) {
    await fixture(async (origin, scans) => { const response = await fetch(origin + path, { redirect: 'manual' }); assert.equal(response.headers.get('location'), '/'); assert.equal(scans.length, 0); }, { code: value });
  }
});
test('counter failure preserves the validated destination; read failure uses the brochure homepage fallback', async () => {
  for (const options of [{ failWrite: true, code: { ...code, targetUrl: '/scan?lang=fr' } }, { failRead: true }]) {
    await fixture(async origin => { const response = await fetch(origin + path, { redirect: 'manual' }); assert.equal(response.status, 302); assert.equal(response.headers.get('location'), options.failRead ? '/' : '/scan?lang=fr'); }, options);
  }
});
test('unknown slugs preserve the existing portal fallback', async () => {
  await fixture(async (origin, scans) => { const response = await fetch(origin + '/qr/unknown', { redirect: 'manual' }); assert.equal(response.headers.get('location'), '/portal/login'); assert.equal(scans.length, 0); });
});
test('only actual GreenElephant destinations are allowed, including for legacy rows', () => {
  for (const value of ['//evil.test', '/\\evil.test', 'https://greenelephant.org.evil.test', 'https://www.greenelephant.org@evil.test', 'javascript:alert(1)', 'http://greenelephant.org', 'https://greenelephant.org:444/', '/%2f/evil.test', '/%5cevil.test', '/qr/loop', '/%71r/loop', '/a/../qr/loop', '/x\r\nLocation:evil', undefined, {}, '/%zz']) assert.equal(safeQrTarget(value), null, String(value));
  assert.equal(safeQrTarget('https://www.greenelephant.org/scan?lang=fr#start'), '/scan?lang=fr#start');
  assert.equal(safeQrTarget('/'), '/');
});
test('printed QR always uses the permanent public origin', () => {
  assert.equal(printedQrUrl(BROCHURE_QR.slug), 'https://www.greenelephant.org' + path);
});
