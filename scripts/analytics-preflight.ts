/** Green Elephant: inspect only effective analytics flags; never load .env or print values. */
import { pathToFileURL } from 'node:url';
import { publicAnalyticsConfig, validMeasurementId } from '../shared/marketing-analytics';

export function analyticsPreflight(
  env: Record<string, string | undefined>, expectedId: string, expect: 'enabled' | 'disabled',
) {
  if (!validMeasurementId(expectedId)) throw new Error('A valid expected public measurement ID is required');
  const configuredId = env.VITE_GA_MEASUREMENT_ID;
  const collectionFlagValid = env.GA4_COLLECTION_ENABLED === undefined || ['true', 'false'].includes(env.GA4_COLLECTION_ENABLED);
  const configuration = {
    productionRuntime: env.NODE_ENV === 'production',
    measurementIdPresent: !!configuredId,
    measurementIdValid: validMeasurementId(configuredId),
    measurementIdMatchesExpected: configuredId === expectedId,
    collectionFlagValid,
    collectionEnabled: publicAnalyticsConfig(env).enabled,
  };
  return {
    configuration,
    matchesExpectation: configuration.productionRuntime && configuration.measurementIdMatchesExpected && collectionFlagValid
      && configuration.collectionEnabled === (expect === 'enabled')
      && (expect === 'enabled' || env.GA4_COLLECTION_ENABLED !== 'true'),
    scope: 'This process only; workspace variables do not establish published deployment settings.',
    duplicateSources: 'Not observable from a process environment; inspect Project and linked Account sources in Replit.',
    eventReceipt: 'Unverified; check consented events in the existing GA4 Realtime report after publication.',
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const value = (flag: string) => args[args.indexOf(flag) + 1];
  const expect = value('--expect');
  if (args.length !== 4 || !args.includes('--expected-id') || !args.includes('--expect')
    || !validMeasurementId(value('--expected-id')) || !['enabled', 'disabled'].includes(expect)) {
    console.error('Usage: npm run analytics:preflight -- --expected-id G-EXISTINGSTREAM --expect enabled|disabled');
    process.exitCode = 1;
  } else {
    const report = analyticsPreflight(process.env, value('--expected-id'), expect as 'enabled' | 'disabled');
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.matchesExpectation ? 0 : 1;
  }
}
