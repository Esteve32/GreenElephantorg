import type { Express } from 'express';
import { currentNamedAdmin, createCurrentAdminGuard, isRecentNamedOwner, type CurrentAdminDependencies } from './admin-current-access';

export function registerAdminSessionRoutes(app: Express, deps: CurrentAdminDependencies) {
  // Retired endpoints intentionally ignore credentials and never create accounts or sessions.
  for (const path of ['/api/admin/login', '/api/admin/change-password']) {
    app.post(path, (_req, res) => {
      res.set('Cache-Control', 'no-store');
      res.status(410).json({ message: 'Admin password access has been removed. Sign in with your approved Google account.' });
    });
  }

  // Minimal teaching-view gate: no profile, team list or operational records returned.
  app.get('/api/admin/training/access', createCurrentAdminGuard(deps), (_req, res) => {
    res.json({ isAuthenticated: true });
  });

  app.get('/api/admin/check', async (req, res) => {
    res.set('Cache-Control', 'no-store');
    try {
      const access = await currentNamedAdmin(req.session, deps);
      if (!access.allowed) return res.json({ isAuthenticated: false, role: null, canManageTeam: false });
      const { actor, role } = access;
      req.session.adminRole = role;
      req.session.adminEmail = actor.email;
      res.json({ isAuthenticated: true, role,
        canManageTeam: isRecentNamedOwner(req.session, actor, deps.owner()),
        user: { id: actor.id, email: actor.email, name: 'name' in actor ? actor.name : null,
          avatarUrl: 'avatarUrl' in actor ? actor.avatarUrl : null, role } });
    } catch {
      res.status(503).json({ message: 'Administrator access could not be checked.' });
    }
  });
}
