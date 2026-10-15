/** LOCAL SYNTHETIC HARNESS ONLY. In-memory database and fictional owner; never deploy. */
import express from 'express';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createServer as createViteServer } from 'vite';
import { scanServiceReviewFixture } from './scan-service-review-fixture';
import { registerScanServiceReviewRoutes } from '../server/scan-service-review-routes';

const port = Number(process.argv[2] ?? 5182);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw Error('Use a local port between 1024 and 65535.');
const origin = 'http://127.0.0.1:' + port, fixture = await scanServiceReviewFixture();
const app = express(), server = createServer(app);
const vite = await createViteServer({ server: { middlewareMode: true, hmr: { server } }, appType: 'custom' });
const authenticatedAt = Date.now();
app.use((_req, res, next) => { res.set({ 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' }); next(); });
app.use(express.json({ limit: '8kb' }));
app.use((req, _res, next) => { req.session = { isAdmin: true, adminUserId: fixture.actor.id,
  adminGoogleSubject: fixture.actor.googleId, adminMfaVerified: true, adminGoogleAuthTime: authenticatedAt,
  adminAuthenticatedAt: authenticatedAt } as typeof req.session; next(); });
registerScanServiceReviewRoutes(app, { owner: () => fixture.actor.email, siteUrl: () => origin,
  findAdmin: async id => (await fixture.client.query<any>('SELECT id,email,google_id AS "googleId",role,is_active AS "isActive" FROM admin_users WHERE id=$1', [id])).rows[0], store: fixture.store,preview:fixture.preview });
app.use('/api', (_req,res) => res.status(503).json({ code: 'synthetic_preview_only', message: 'Only synthetic service-review actions are enabled.' }));
app.use(vite.middlewares);
app.get('*', async (req, res) => {
  const template = await readFile('client/index.html', 'utf8');
  const banner = '<div style="position:fixed;bottom:0;left:0;right:0;z-index:9999;padding:10px;background:#713f12;color:white;text-align:center">Synthetic local review · fictional data and owner · resets on restart · no live sends</div>';
  res.type('html').send(await vite.transformIndexHtml(req.originalUrl, template.replace('</body>',banner + '</body>')));
});
server.on('error', async () => { await vite.close(); await fixture.client.close(); process.exit(1); });
server.listen(port, '127.0.0.1', () => console.log('Synthetic service review: ' + origin + '/admin/scan-service (no real accounts/providers)'));
let closing = false;
async function shutdown() { if (closing) return; closing = true; await vite.close(); await fixture.client.close(); server.close(() => process.exit(0)); }
process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);
