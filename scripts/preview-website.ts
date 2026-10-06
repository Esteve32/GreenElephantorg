/** Website-only preview for local development and Replit. No database, schedulers, email or payment routes. */
import express from 'express';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer as createViteServer } from 'vite';

import { previewNetwork } from './preview-hosts';

const network = previewNetwork();
const port = Number(process.argv[2] ?? (network.remote ? 5000 : 5180));
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Use a port from 1024 to 65535');
const app = express();
const server = createServer(app);
const vite = await createViteServer({ server: { middlewareMode: true, hmr: { server } }, appType: 'custom' });
app.use((_req, res, next) => {
  res.set('X-Robots-Tag', 'noindex, nofollow');
  res.set('Cache-Control', 'no-store');
  next();
});
app.use('/api', (_req, res) => res.status(503).json({ message: 'Website-only local preview: backend services are not connected.' }));
app.use(vite.middlewares);
app.get('*', async (req, res, next) => {
  try {
    const { renderPageMetadata, pageStatus, rejectMissingAsset } = await vite.ssrLoadModule(resolve('server/public-http.ts'));
    rejectMissingAsset(req, res, async () => {
      try {
        const template = await vite.transformIndexHtml(req.originalUrl, await readFile('client/index.html', 'utf8'));
        res.status(pageStatus(req.path)).type('html').send(renderPageMetadata(template, req.path));
      } catch (error) { next(error); }
    });
  } catch (error) { next(error); }
});
app.use((_error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(500).type('text').send('Local preview could not render this page. Check the terminal.');
});
server.listen(port, network.host, () => console.log(`Website-only preview listening on ${network.host}:${port} (backend actions unavailable)`));
async function shutdown() { await vite.close(); server.close(()=>process.exit(0)); }
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
