import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkoutLanguage, scanCheckoutUrl, scanVoucherDiscount, paymentOutcome, prepareScanPurchase, SCAN_PRICE } from './scan-checkout';

test('purchase links preserve supported languages and reject unknown locale values', () => {
  for (const language of ['en', 'fr'] as const) {
    const url = scanCheckoutUrl(language);
    assert.equal(new URLSearchParams(url.split('?')[1]).get('product'), 'satellitescan');
    assert.equal(checkoutLanguage(url.split('?')[1]), language);
  }
  assert.equal(checkoutLanguage('?lang=de'), 'en');
});
test('Scan cannot display an unsupported partial coupon discount', () => {
  for (const value of [10, '99.94', 'Infinity', Infinity, NaN, undefined, null, {}, '100oops', -100]) {
    assert.equal(scanVoucherDiscount(true, value), 0);
  }
  assert.equal(scanVoucherDiscount(false, 100), 0);
  assert.equal(scanVoucherDiscount(true, '99.95'), SCAN_PRICE);
  assert.equal(scanVoucherDiscount(true, '150'), SCAN_PRICE);
});
test('paid checkout uses server price, preserves locale and never supplies a client-set amount', async () => {
  const result = await prepareScanPurchase({ email: ' person@example.com ', name: ' Person ', language: 'fr' }, async (path, body) => {
    assert.equal(path, '/api/satellitescan/create-payment-intent');
    assert.deepEqual(body, { customerEmail: 'person@example.com', customerName: 'Person', language: 'fr' });
    return { clientSecret: 'test_secret', amount: 99.95, currency: 'eur' };
  });
  assert.deepEqual(result, { kind: 'payment', clientSecret: 'test_secret' });
});
test('missing secret, incorrect price or currency cannot open a misleading payment form', async () => {
  for (const reply of [{ clientSecret: 'test', amount: 50, currency: 'eur' }, { clientSecret: 'test', amount: 99.95, currency: 'usd' }, { amount: 99.95, currency: 'eur' }, { clientSecret: 'test' }]) {
    await assert.rejects(prepareScanPurchase({ email: 'a@b.test', name: '', language: 'en' }, async () => reply));
  }
});
test('free voucher uses server activation and never creates a paid intent', async () => {
  let calls = 0;
  const result = await prepareScanPurchase({ email: 'a@b.test', name: '', language: 'fr', voucher: 'FREE' }, async (path, body) => {
    calls++;
    assert.equal(path, '/api/satellitescan/free-purchase');
    assert.equal(body.couponCode, 'FREE');
    return { success: true };
  });
  assert.equal(calls, 1);
  assert.deepEqual(result, { kind: 'free' });
  await assert.rejects(prepareScanPurchase({ email: 'a@b.test', name: '', language: 'en', voucher: 'BAD' }, async () => ({ success: false })));
});
test('only verified Stripe success becomes a success message', () => {
  assert.equal(paymentOutcome('succeeded'), 'success');
  assert.equal(paymentOutcome('processing'), 'pending');
  assert.equal(paymentOutcome('requires_capture'), 'pending');
  assert.equal(paymentOutcome('requires_payment_method'), 'retry');
  for (const value of [undefined, 'true', 'free=true', 'requires_action']) assert.equal(paymentOutcome(value), 'unknown');
});
