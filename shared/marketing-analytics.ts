import { COACHING_PAGES, coachingPath, DISCOVERY_URL } from './coaching-pages';

export const CONSENT_KEY = 'ge.analytics-consent.v1';
export const CONSENT_DAYS = 180;
export type AnalyticsChoice = 'accepted' | 'rejected';
export const MARKETING_PATHS = new Set(['/', '/fr', '/scan', '/fr/scan', ...COACHING_PAGES.map(p=>coachingPath(p.slug))]);
export const validMeasurementId = (value: unknown): value is string => typeof value === 'string' && /^G-[A-Z0-9]{6,20}$/.test(value);

export function marketingPath(value: string): string | null {
  // Do not accept arbitrary URLs, query values, assessment routes or identifiers.
  const path = value.split(/[?#]/,1)[0].replace(/\/+$/, '') || '/';
  return MARKETING_PATHS.has(path) ? path : null;
}

export function readConsent(raw: string | null, now = Date.now()): AnalyticsChoice | null {
  try {
    const value = JSON.parse(raw ?? 'null');
    return value?.version === 1 && ['accepted','rejected'].includes(value.choice)
      && Number.isFinite(value.at) && value.at <= now && now - value.at < CONSENT_DAYS * 86400000 ? value.choice : null;
  } catch { return null; }
}

export function consentRecord(choice: AnalyticsChoice, now = Date.now()): string {
  return JSON.stringify({version:1,choice,at:now});
}

export function publicAnalyticsConfig(env: Record<string, string | undefined>) {
  const id = env.VITE_GA_MEASUREMENT_ID;
  const enabled = env.NODE_ENV === 'production' && env.GA4_COLLECTION_ENABLED === 'true' && validMeasurementId(id);
  return { enabled, measurementId: enabled ? id : null };
}

// No arbitrary UTM strings or full referrer URLs: they may contain personal data.
// Broader campaign taxonomy is a separate owner-reviewed reporting decision.
export function acquisitionSource(referrer: string): string {
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (/^(www\.)?greenelephant\.org$/.test(host)) return 'internal';
    if (/^(www\.)?arbora\.partners$/.test(host)) return 'arbora';
    if (/^(www\.)?estevepannetier\.com$/.test(host)) return 'estevepannetier';
    if (/(^|\.)google\.[a-z.]+$/.test(host)) return 'google';
    if (/(^|\.)bing\.com$/.test(host)) return 'bing';
    if (/(^|\.)linkedin\.com$/.test(host)) return 'linkedin';
    return 'other_referral';
  } catch { return 'direct_or_unknown'; }
}

export type MarketingEvent = { name: 'page_view' | 'marketing_cta'; params: Record<string,string> };
export function pageViewEvent(path: string, referrer: string): MarketingEvent | null {
  const safe = marketingPath(path);
  if (!safe) return null;
  return { name:'page_view', params:{ page_location:'https://greenelephant.org'+safe, page_path:safe,
    page_title: safe === '/' || safe === '/fr' ? 'GreenElephant home' : safe.includes('/scan') ? 'Satellite Scan' : 'AI coaching',
    page_referrer:'', acquisition_source:acquisitionSource(referrer), language:safe.startsWith('/fr')?'fr':'en' } };
}

export function ctaEvent(path: string, href: string, position: string | null): MarketingEvent | null {
  const page = pageViewEvent(path, '');
  if (!page) return null;
  let url: URL;
  try { url = new URL(href, 'https://greenelephant.org'); } catch { return null; }
  const scan = url.origin === 'https://greenelephant.org' && ['/checkout','/fr/checkout'].includes(url.pathname) && url.searchParams.get('product') === 'satellitescan';
  const discovery = new URL(DISCOVERY_URL);
  const booking = url.origin === discovery.origin && url.pathname === discovery.pathname;
  if (!scan && !booking) return null;
  return {name:'marketing_cta', params:{...page.params, cta_action:scan?'scan_checkout':'discovery_link',
    cta_position: position === 'hero' || position === 'closing' ? position : 'other',
    use_case:page.params.page_path.startsWith('/ai-coaching/') ? page.params.page_path.slice('/ai-coaching/'.length) : 'general'}};
}
