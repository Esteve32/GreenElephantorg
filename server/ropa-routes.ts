import type { Express, Request, Response } from 'express';
import { z } from 'zod';
import { checkPrivacyAccess, type PrivacyAdminIdentity } from './privacy-admin-access';
import { ropaSaveSchema, ropaStatus, RopaConflict, RopaNotFound, RopaAccessDenied } from '@shared/ropa';
import type { RopaStore } from './ropa-store';

const idSchema = z.string().uuid();
const listSchema = z.object({ after: idSchema.optional(), search: z.string().trim().max(100).optional(), status: ropaStatus.optional() }).strict();
export function registerRopaRoutes(app: Express, deps: {
  bindings: () => string | undefined; owner: () => string | undefined; siteUrl: () => string;
  findAdmin: (id: string) => Promise<PrivacyAdminIdentity | undefined>; store: RopaStore;
}) {
  const base = '/api/admin/privacy/activities';
  async function run(req: Request, res: Response, work: (actor: PrivacyAdminIdentity, expiresAt: number) => Promise<void>) {
    res.set({ 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex, nofollow' });
    try {
      const access = await checkPrivacyAccess(req.session, deps.bindings(), deps.findAdmin, Date.now(), deps.owner());
      if (!access.allowed) { res.status(access.status).json({ code: access.code }); return; }
      if (req.method !== 'GET') {
        // Match the configured public origin, not attacker-controlled Host/forwarded headers.
        if (req.get('origin') !== new URL(deps.siteUrl()).origin || !req.is('application/json')) {
          res.status(403).json({ code: 'ropa_origin_required' }); return;
        }
        if (JSON.stringify(req.body ?? {}).length > 200000) { res.status(413).json({ code: 'ropa_invalid' }); return; }
      }
      await work(access.actor, access.expiresAt);
    } catch (error) {
      if (error instanceof z.ZodError) { res.status(400).json({ code: 'ropa_invalid' }); return; }
      if (error instanceof RopaConflict || (error && typeof error === 'object' && 'code' in error && error.code === '23505')) {
        res.status(409).json({ code: 'ropa_conflict' }); return;
      }
      if (error instanceof RopaAccessDenied) { res.status(403).json({ code: 'privacy_access_required' }); return; }
      if (error instanceof RopaNotFound) { res.status(404).json({ code: 'ropa_not_found' }); return; }
      res.status(503).json({ code: 'ropa_unavailable' });
    }
  }
  app.get(base, (req, res) => run(req, res, async (actor, expiresAt) => {
    const page = await deps.store.list(actor, listSchema.parse(req.query));
    res.json({ ...page, accessExpiresAt: new Date(expiresAt).toISOString() });
  }));
  app.get(base + '/export', (req, res) => run(req, res, async (actor) => {
    z.object({}).strict().parse(req.query);
    const page = await deps.store.list(actor, {}, true);
    res.set('Content-Disposition', 'attachment; filename="ropa-activities.json"').json({
      schemaVersion: 1, exportedAt: new Date().toISOString(), scope: 'activity_register_only',
      note: 'Human-maintained metadata; statuses are recorded assessments, not compliance certification. Individual consent and privacy cases are excluded.',
      activities: page.activities,
    });
  }));
  app.get(base + '/:id', (req, res) => run(req, res, async (actor, expiresAt) => {
    const id = idSchema.parse(req.params.id);
    const query = z.object({ before: z.string().regex(/^[1-9][0-9]{0,6}$/).transform(Number).optional() }).strict().parse(req.query);
    const detail = await deps.store.detail(actor, id, query.before);
    res.json({ ...detail, accessExpiresAt: new Date(expiresAt).toISOString() });
  }));
  for (const method of ['post', 'put'] as const) app[method](base + (method === 'put' ? '/:id' : ''), (req, res) => run(req, res, async (actor) => {
    z.object({}).strict().parse(req.query);
    const input = ropaSaveSchema.parse(req.body);
    const result = await deps.store.save(actor, input, method === 'put' ? idSchema.parse(req.params.id) : undefined);
    res.status(method === 'post' && !result.replayed ? 201 : 200).json(result);
  }));
}
