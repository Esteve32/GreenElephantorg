import type { Express, RequestHandler } from 'express';
import type { AdminUser } from '@shared/schema';
import { adminRoleFor, isTeamEmail, normalizeAdminEmail } from '@shared/admin-access-policy';
import type { PrivacyAdminIdentity } from './privacy-admin-access';

export type TeamChange =
  | { kind: 'invite'; email: string; name: string | null; role: 'admin' | 'viewer' }
  | { kind: 'update'; id: string; role?: 'admin' | 'viewer'; isActive?: 'true' | 'false' }
  | { kind: 'deactivate'; id: string };
export class TeamChangeError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function teamView(user: AdminUser, owner: string | undefined) {
  return { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl,
    role: adminRoleFor(user.email, user.role, owner) || 'blocked', invitedBy: user.invitedBy,
    isActive: user.isActive, createdAt: user.createdAt, lastLoginAt: user.lastLoginAt,
    isOwner: normalizeAdminEmail(user.email) === normalizeAdminEmail(owner) };
}
export function registerAdminTeamRoutes(app: Express, deps: {
  guards: RequestHandler[]; owner: () => string | undefined;
  list: () => Promise<AdminUser[]>;
  change: (actor: PrivacyAdminIdentity, change: TeamChange, owner: string | undefined) => Promise<AdminUser>;
}) {
  app.get('/api/admin/team', ...deps.guards, async (_req, res) => {
    try { res.json((await deps.list()).map(user => teamView(user, deps.owner()))); }
    catch { res.status(503).json({ message: 'Team records are unavailable.' }); }
  });
  const change: RequestHandler = async (req, res) => {
    try {
      let command: TeamChange;
      if (req.method === 'POST') {
        const body = req.body || {};
        const email = normalizeAdminEmail(body.email);
        if (!req.is('application/json') || !email || !isTeamEmail(email) || !['admin','viewer'].includes(body.role)
            || (body.name !== undefined && (typeof body.name !== 'string' || body.name.length > 120))
            || Object.keys(body).some(key => !['email','name','role'].includes(key)))
          return res.status(400).json({ message: 'Use a @greenelephant.org address and an Admin or Viewer role.' });
        command = { kind:'invite', email, name: body.name?.trim() || null, role:body.role };
      } else {
        const id = req.params.id;
        if (!/^[a-zA-Z0-9_-]{1,128}$/.test(id)) return res.status(400).json({message:'Invalid account reference.'});
        if (req.method === 'DELETE') command = {kind:'deactivate',id};
        else {
          const body = req.body || {};
          if (!req.is('application/json') || Object.keys(body).length === 0
              || Object.keys(body).some(key=>!['role','isActive'].includes(key))
              || (body.role !== undefined && !['admin','viewer'].includes(body.role))
              || (body.isActive !== undefined && !['true','false'].includes(body.isActive)))
            return res.status(400).json({message:'Choose Admin/Viewer or an active status.'});
          command = {kind:'update',id,...body};
        }
      }
      const result = await deps.change(res.locals.currentAdmin, command, deps.owner());
      res.json(teamView(result, deps.owner()));
    } catch (error) {
      if (error instanceof TeamChangeError) return res.status(error.status).json({message:error.message});
      res.status(503).json({message:'The access change was not confirmed. Refresh the team list before retrying.'});
    }
  };
  app.post('/api/admin/team/invite', ...deps.guards, change);
  app.patch('/api/admin/team/:id', ...deps.guards, change);
  // Compatibility route now deactivates: administrative history is preserved.
  app.delete('/api/admin/team/:id', ...deps.guards, change);
}
