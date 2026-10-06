export type SiteLanguage = 'en' | 'fr';
// Only routes with real French content belong here. Never advertise untranslated
// pages to search engines as French merely because their navigation is translated.
export const FRENCH_ROUTES = ['/', '/scan', '/blog/acx-levels-ai-literacy', '/checkout', '/payment-success', '/privacy', '/ai-policy', '/terms', '/cookies'] as const;
export function siteLanguage(path: string, search = ''): SiteLanguage {
  return path === '/fr' || path.startsWith('/fr/') || new URLSearchParams(search).get('lang') === 'fr' ? 'fr' : 'en';
}
export function basePagePath(path: string): string {
  return path === '/fr' || path === '/fr/' ? '/' : path.replace(/^\/fr(?=\/)/, '');
}
export function hasFrenchPage(path: string): boolean {
  return (FRENCH_ROUTES as readonly string[]).includes(basePagePath(path).replace(/\/+$/, '') || '/');
}
export function localPage(path: string, language: SiteLanguage): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const match = path.match(/^([^?#]*)(.*)$/)!;
  const base = basePagePath(match[1]);
  return (language === 'fr' && hasFrenchPage(base) ? '/fr' + (base === '/' ? '' : base) : base) + match[2];
}
export function articleLinks(html: string, language: SiteLanguage): string {
  return html.replace(/href="(\/[^"]*)"/g, (_, href) => `href="${localPage(href, language)}"`);
}
