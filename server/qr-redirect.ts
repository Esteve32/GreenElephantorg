import type { RequestHandler } from 'express';
import type { QrCode, InsertQrScan } from '../shared/schema';
import { BROCHURE_QR, safeQrTarget } from '../shared/qr-campaign';

export function qrRedirectHandler(store: {
  getQrCodeBySlug(slug: string): Promise<QrCode | undefined>;
  createQrScan(scan: InsertQrScan): Promise<unknown>;
}, onFailure: () => void = () => console.error('QR counter unavailable')): RequestHandler {
  return async (req, res) => {
    // A cached permanent redirect would skip the counter on later opens.
    res.set({ 'Cache-Control': 'no-store, max-age=0', Pragma: 'no-cache', 'X-Robots-Tag': 'noindex, nofollow' });
    const fallback = req.params.slug === BROCHURE_QR.slug ? '/' : '/portal/login';
    let target = fallback;
    try {
      const code = await store.getQrCodeBySlug(req.params.slug);
      if (!code || code.isActive !== 'true') { res.redirect(302, fallback); return; }
      const safe = safeQrTarget(code.targetUrl);
      if (!safe) { res.redirect(302, fallback); return; }
      target = safe;
      // HEAD previews and advertised prefetches are not counted as opens.
      const prefetch = `${req.get('purpose') ?? ''} ${req.get('sec-purpose') ?? ''}`;
      if (req.method === 'GET' && !/prefetch|prerender/i.test(prefetch)) {
        // No IP/hash, browser fingerprint, referrer, location service, cookie or identity.
        await store.createQrScan({ qrCodeId: code.id });
      }
    } catch { onFailure(); }
    // Counter failure must not prevent a visitor reaching the known destination.
    res.redirect(302, target);
  };
}
