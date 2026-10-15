import type { Express } from 'express';
import { checkPrivacyAccess, type PrivacyAdminIdentity } from './privacy-admin-access';
import type { PrivacyWithdrawalPage } from '@shared/privacy-admin';

export function registerPrivacyAdminRoutes(app: Express, deps: {
  bindings: () => string | undefined;
  owner?: () => string | undefined;
  findAdmin: (id: string) => Promise<PrivacyAdminIdentity | undefined>;
  readAudited: (actor: PrivacyAdminIdentity, after?: string) => Promise<Omit<PrivacyWithdrawalPage, 'accessExpiresAt'>>;
}) {
  app.get('/api/admin/privacy/withdrawals', async (req, res) => {
    res.set({ 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex, nofollow' });
    try {
      const access = await checkPrivacyAccess(req.session, deps.bindings(), deps.findAdmin, Date.now(), deps.owner?.());
      if (!access.allowed) return res.status(access.status).json({ code: access.code });
      const after = req.query.after;
      if (Object.keys(req.query).some(key => key !== 'after') ||
          (after !== undefined && (typeof after !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(after))))
        return res.status(400).json({ code: 'invalid_page' });
      // No data leaves the server until the access-audit transaction commits.
      const page = await deps.readAudited(access.actor, after as string | undefined);
      return res.json({ ...page, accessExpiresAt: new Date(access.expiresAt).toISOString() });
    } catch {
      return res.status(503).json({ code: 'privacy_unavailable' });
    }
  });
}
