import type { Express, Request, Response } from 'express';
import { z } from 'zod';
import { currentNamedAdmin, isRecentNamedOwner } from './admin-current-access';
import { scanReviewId, scanReviewAction, ScanReviewError } from '@shared/scan-service-review';
import type { PrivacyAdminIdentity } from './privacy-admin-access';
import type { ScanServiceReviewStore } from './scan-service-review-store';
import type { ScanCompletionPreview } from '@shared/scan-service-review';
import { TypeformRecoveryError } from './typeform-content';

/** Staged registration only: not mounted in server/routes.ts. No default evidence reader. */
export function registerScanServiceReviewRoutes(app: Express, deps: {
  owner(): string | undefined; siteUrl(): string;
  findAdmin(id: string): Promise<PrivacyAdminIdentity | undefined>; store: ScanServiceReviewStore;
  preview?(actor: PrivacyAdminIdentity,eventId: string,expectedVersion: number): Promise<ScanCompletionPreview>;
}) {
  const base = '/api/admin/scan-service';
  async function run(req: Request, res: Response, work: (actor: PrivacyAdminIdentity, expiresAt: number) => Promise<void>) {
    res.set({ 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex, nofollow' });
    try {
      const access = await currentNamedAdmin(req.session, { findAdmin: deps.findAdmin, owner: deps.owner });
      if (!access.allowed) return res.status(access.status).json({ code: 'review_access_required' });
      if (!req.session || !isRecentNamedOwner(req.session, access.actor, deps.owner())) return res.status(403).json({ code: 'review_owner_sign_in_required' });
      if (req.method !== 'GET' && (req.get('origin') !== new URL(deps.siteUrl()).origin || !req.is('application/json')))
        return res.status(403).json({ code: 'review_origin_required' });
      if (req.method !== 'GET' && Buffer.byteLength(JSON.stringify(req.body ?? {})) > 4096) return res.status(413).json({ code: 'review_invalid' });
      await work(access.actor, req.session.adminAuthenticatedAt! + 30 * 60_000);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ code: 'review_invalid' });
      if (error instanceof TypeformRecoveryError) return res.status(error.code === 'recovery_unavailable' ? 503 : 409).json({code:error.code});
      if (error instanceof ScanReviewError) return res.status(error.code === 'review_not_found' ? 404
        : error.code === 'review_access_required' ? 403 : 409).json({ code: error.code });
      if (error && typeof error === 'object' && 'code' in error && error.code === '23505') return res.status(409).json({ code: 'review_conflict' });
      return res.status(503).json({ code: 'review_unavailable' });
    }
  }
  app.get(base, (req, res) => run(req, res, async (actor, expiresAt) => {
    const query = z.object({ after: scanReviewId.optional() }).strict().parse(req.query);
    res.json({ ...await deps.store.list(actor, query.after), accessExpiresAt: new Date(expiresAt).toISOString() });
  }));
  app.get(base + '/:eventId', (req, res) => run(req, res, async (actor, expiresAt) => {
    z.object({}).strict().parse(req.query);
    res.json({ ...await deps.store.detail(actor, scanReviewId.parse(req.params.eventId)), accessExpiresAt: new Date(expiresAt).toISOString() });
  }));
  app.post(base + '/:eventId/actions', (req, res) => run(req, res, async (actor) => {
    z.object({}).strict().parse(req.query);
    res.json(await deps.store.act(actor, scanReviewId.parse(req.params.eventId), scanReviewAction.parse(req.body)));
  }));
  app.post(base + '/:eventId/preview', (req,res) => run(req,res,async (actor) => {
    z.object({}).strict().parse(req.query);
    const input = z.object({expectedVersion:z.number().int().min(0).max(1_000_000)}).strict().parse(req.body);
    if (!deps.preview) throw new TypeformRecoveryError('recovery_unavailable');
    res.json(await deps.preview(actor,scanReviewId.parse(req.params.eventId),input.expectedVersion));
  }));
}
