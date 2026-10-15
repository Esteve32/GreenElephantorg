import { hasVerifiedAdminMfa } from './admin-mfa-session';
import type { RequestHandler } from 'express';
import type { SessionData } from 'express-session';
import { adminRoleFor, normalizeAdminEmail } from '@shared/admin-access-policy';
import { PRIVACY_SESSION_MS, type PrivacyAdminIdentity } from './privacy-admin-access';

export interface CurrentAdminDependencies {
  findAdmin: (id: string) => Promise<PrivacyAdminIdentity | undefined>;
  owner: () => string | undefined;
}

export async function currentNamedAdmin(session: Partial<SessionData> | undefined, deps: CurrentAdminDependencies, now = Date.now()) {
  // Old password sessions have no Google provenance. Cookie lifetime remains unchanged.
  if (!hasVerifiedAdminMfa(session, now) || session?.isAdmin !== true || !session.adminUserId
      || typeof session.adminGoogleSubject !== 'string' || !/^[0-9]{1,128}$/.test(session.adminGoogleSubject)
      || !Number.isFinite(session.adminAuthenticatedAt) || session.adminAuthenticatedAt! <= 0
      || session.adminAuthenticatedAt! > now)
    return { allowed: false, status: 401, message: 'Please sign in with your approved Google account.' } as const;
  const actor = await deps.findAdmin(session.adminUserId);
  const role = actor?.isActive === 'true' ? adminRoleFor(actor.email, actor.role, deps.owner()) : null;
  if (!actor || actor.id !== session.adminUserId || !role || actor.googleId !== session.adminGoogleSubject)
    return { allowed: false, status: 403, message: 'Administrator access is disabled or not permitted. Sign in again with Google.' } as const;
  return { allowed: true, actor, role } as const;
}

export function isRecentNamedOwner(session: Partial<SessionData>, actor: PrivacyAdminIdentity, owner: string | undefined, now = Date.now()): boolean {
  return hasVerifiedAdminMfa(session, now) && normalizeAdminEmail(owner) !== null && normalizeAdminEmail(actor.email) === normalizeAdminEmail(owner)
    && actor.role === 'super_admin' && actor.isActive === 'true'
    && !!actor.googleId && session.adminGoogleSubject === actor.googleId
    && session.adminUserId === actor.id && session.isAdmin === true
    && Number.isFinite(session.adminAuthenticatedAt)
    && session.adminAuthenticatedAt! <= now && now - session.adminAuthenticatedAt! < PRIVACY_SESSION_MS;
}

export function createCurrentAdminGuard(deps: CurrentAdminDependencies): RequestHandler {
  return async (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    try {
      const access = await currentNamedAdmin(req.session, deps);
      if (!access.allowed) return res.status(access.status).json({ message: access.message });
      const { actor, role } = access;
      if (role === 'viewer' && !['GET', 'HEAD', 'OPTIONS'].includes(req.method))
        return res.status(403).json({ message: 'Viewers cannot perform administrative writes.' });
      req.session.adminRole = role; req.session.adminEmail = actor.email;
      res.locals.currentAdmin = actor;
      return next();
    } catch { return res.status(503).json({ message: 'Administrator access could not be checked. Please retry.' }); }
  };
}

export function createNamedOwnerGuard(owner: () => string | undefined): RequestHandler {
  return (req, res, next) => {
    if (!req.session || !res.locals.currentAdmin || !isRecentNamedOwner(req.session, res.locals.currentAdmin, owner()))
      return res.status(403).json({ message: "Sign in again with the designated owner's Google account." });
    return next();
  };
}
