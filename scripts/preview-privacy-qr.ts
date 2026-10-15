/** LOOPBACK SYNTHETIC HARNESS ONLY. Fictional owner/data; never deploy. */
import express from 'express';
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createServer as createViteServer } from 'vite';
import { scanServiceReviewFixture } from './scan-service-review-fixture';
import { registerRopaRoutes } from '../server/ropa-routes';
import { createRopaStore } from '../server/ropa-store';
import { qrRedirectHandler } from '../server/qr-redirect';
import { BROCHURE_QR } from '../shared/qr-campaign';
import type { QrScan } from '../shared/schema';

const port = Number(process.argv[2] ?? 5184);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw Error('Use a local port between 1024 and 65535.');
const origin = 'http://127.0.0.1:' + port, fixture = await scanServiceReviewFixture();
await fixture.client.exec(await readFile('migrations/20261008_ropa_activity_register.sql', 'utf8'));
const app = express(), server = createServer(app), authenticatedAt = Date.now();
const vite = await createViteServer({ server: { middlewareMode: true, hmr: { server } }, appType: 'custom' });
app.use((_req, res, next) => { res.set({ 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' }); next(); });
app.use(express.json({ limit: '200kb' }));
app.use((req, _res, next) => { req.session = { isAdmin: true, adminUserId: fixture.actor.id,
  adminGoogleSubject: fixture.actor.googleId, adminMfaVerified: true, adminGoogleAuthTime: authenticatedAt,
  adminAuthenticatedAt: authenticatedAt } as typeof req.session; next(); });
const accessExpiresAt = new Date(authenticatedAt + 30 * 60_000).toISOString();
app.get('/api/admin/privacy/withdrawals', (_req, res) => res.json({ events: [], nextCursor: null, accessExpiresAt }));
app.get('/api/admin/training/access', (_req, res) => res.json({ isAuthenticated: true }));
registerRopaRoutes(app, { owner: () => fixture.actor.email, bindings: () => JSON.stringify({ [fixture.actor.id]: fixture.actor.googleId }), siteUrl: () => origin,
  findAdmin: async () => fixture.actor, store: createRopaStore(fixture.database as any) });
const code = { ...BROCHURE_QR, name: 'Fictional future campaign — separate /qr/ link', description: 'Example only. This is not the QR printed on the current brochure.', id: 'fictional-brochure', type: 'campaign', isActive: 'true', createdAt: new Date() };
const scans: QrScan[] = [];
app.get('/qr/:slug', qrRedirectHandler({ getQrCodeBySlug: async slug => slug === code.slug ? code : undefined,
  createQrScan: async input => { scans.push({ ...input, id: randomUUID(), ipAddress: null, userAgent: null, referer: null,
    country: null, city: null, region: null, latitude: null, longitude: null, isp: null, deviceType: null, consentAcknowledged: 'false', scannedAt: new Date() }); } }));
app.get('/api/admin/qr-codes', (_req, res) => res.json([{ ...code, scanCount: scans.length }]));
app.get('/api/admin/qr-codes/:id/scans', (_req, res) => {
  const byDay: Record<string, number> = {};
  for (const scan of scans) { const day = scan.scannedAt.toISOString().slice(0, 10); byDay[day] = (byDay[day] ?? 0) + 1; }
  res.json({ totalScans: scans.length, scans, analytics: { byCountry: [], byCity: [], byDevice: [], byDay: Object.entries(byDay) } });
});
app.use('/api', (_req, res) => res.status(503).json({ code: 'synthetic_preview_only', message: 'Only synthetic RoPA drafts and QR counts are enabled.' }));
app.use(vite.middlewares);
app.get('*', async (req, res) => {
  const template = await readFile('client/index.html', 'utf8');
  const banner = '<div style="position:fixed;bottom:0;left:0;right:0;z-index:9999;padding:10px;background:#713f12;color:white;text-align:center">Synthetic local preview · fictional owner, records and counts · resets on restart · no providers</div>';
  res.type('html').send(await vite.transformIndexHtml(req.originalUrl, template.replace('</body>', banner + '</body>')));
});
server.on('error', async () => { await vite.close(); await fixture.client.close(); process.exit(1); });
server.listen(port, '127.0.0.1', () => console.log('Synthetic learning/QR preview: ' + origin + '/admin/ropa'));
let closing = false;
async function shutdown() { if (closing) return; closing = true; await vite.close(); await fixture.client.close(); server.close(() => process.exit(0)); }
process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);
