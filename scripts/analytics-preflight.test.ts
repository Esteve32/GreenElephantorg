import test from 'node:test';
import assert from 'node:assert/strict';
import { analyticsPreflight } from './analytics-preflight';
const id = 'G-SYNTHETIC1';
const env = { NODE_ENV: 'production', VITE_GA_MEASUREMENT_ID: id, GA4_COLLECTION_ENABLED: 'false' };

test('analytics preflight distinguishes destination, production flags and actual receipt', () => {
  const report = analyticsPreflight(env, id, 'disabled');
  assert.equal(report.matchesExpectation, true);
  assert.match(report.eventReceipt, /Unverified/);
  assert.match(report.duplicateSources, /Not observable/);
  assert.equal(analyticsPreflight({ ...env, GA4_COLLECTION_ENABLED: 'true' }, id, 'enabled').matchesExpectation, true);
});
test('analytics preflight rejects mismatched IDs, invalid flags and non-production runtimes', () => {
  for (const changed of [
    { VITE_GA_MEASUREMENT_ID: 'G-OTHER1234' }, { VITE_GA_MEASUREMENT_ID: 'invalid' },
    { VITE_GA_MEASUREMENT_ID: undefined }, { GA4_COLLECTION_ENABLED: 'TRUE' },
    { GA4_COLLECTION_ENABLED: 'true' }, { NODE_ENV: 'development' },
  ]) assert.equal(analyticsPreflight({ ...env, ...changed }, id, 'disabled').matchesExpectation, false);
  assert.equal(analyticsPreflight(env, id, 'enabled').matchesExpectation, false);
  assert.throws(() => analyticsPreflight(env, 'invalid', 'disabled'), /valid expected/);
});
test('analytics preflight never includes configured values or unrelated credentials in its report', () => {
  const report = JSON.stringify(analyticsPreflight({ ...env, VITE_GA_MEASUREMENT_ID: 'malformed-sensitive-value',
    GOOGLE_SERVICE_ACCOUNT_KEY: 'synthetic-private-key', DATABASE_URL: 'synthetic-database-credential' }, id, 'disabled'));
  assert.doesNotMatch(report, /malformed-sensitive-value|synthetic-private-key|synthetic-database-credential|G-SYNTHETIC1/);
});
