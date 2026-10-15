export const QR_PUBLIC_ORIGIN = 'https://www.greenelephant.org';
export const BROCHURE_QR = {
  name: 'Kauniainen — 4 Days to Make AI Work for You — purple brochure',
  slug: 'kauniainen-four-days-purple-2026',
  targetUrl: '/',
  description: 'October 2026 purple brochure. Link opens, not unique people or confirmed camera scans. The original brochure QR points directly to the homepage and cannot be counted separately.',
} as const;
export function printedQrUrl(slug: string) { return `${QR_PUBLIC_ORIGIN}/qr/${encodeURIComponent(slug)}`; }

/** Both saved targets and legacy records must be checked before redirecting. */
export function safeQrTarget(value: unknown): string | null {
  if (typeof value !== 'string' || !value || /[\s\\\u0000-\u001f\u007f]/.test(value)) return null;
  if (value.startsWith('//')) return null;
  try {
    const url = new URL(value, QR_PUBLIC_ORIGIN);
    if (!value.startsWith('/') && !value.startsWith('https://')) return null;
    if (url.protocol !== 'https:' || !['greenelephant.org', 'www.greenelephant.org'].includes(url.hostname) || url.port || url.username || url.password) return null;
    const decodedPath = decodeURIComponent(url.pathname);
    if (decodedPath.startsWith('//') || decodedPath.includes('\\') || /[\u0000-\u001f\u007f]/.test(decodedPath) || /^\/qr(?:\/|$)/i.test(decodedPath)) return null;
    return url.pathname + url.search + url.hash;
  } catch { return null; }
}
