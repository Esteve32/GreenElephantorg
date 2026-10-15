import { hasVerifiedAdminMfa } from './admin-mfa-session';
import { adminRoleFor } from '@shared/admin-access-policy';
import type { SessionData } from 'express-session';

export const PRIVACY_SESSION_MS = 30 * 60 * 1000;
export interface PrivacyAdminIdentity {
  id: string; email: string; googleId: string | null; role: string; isActive: string;
}
export type PrivacyAccess =
  | { allowed: true; actor: PrivacyAdminIdentity; expiresAt: number }
  | { allowed: false; status: 401 | 403; code: 'sign_in_required' | 'privacy_access_required' | 'google_sign_in_required' };

export function validAdminOAuthState(received: unknown, expected: unknown): boolean {
  return typeof received === 'string' && typeof expected === 'string'
    && /^[a-f0-9]{32}$/.test(expected) && received === expected;
}

export function verifiedAdminGoogleUser(value: any): boolean {
  return !!value && typeof value.id === 'string' && /^[0-9]{1,128}$/.test(value.id)
    && typeof value.email === 'string' && value.email.length <= 320
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email) && value.verified_email === true;
}

// Deployment-managed bindings, never a mutable public/admin setting.
// An explicit admin ID AND Google subject must match. No implicit super-admin bypass.
function bindings(raw: string | undefined): Record<string, string> {
  try {
    const parsed = JSON.parse(raw || '{}');
    if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') return {};
    const entries = Object.entries(parsed);
    if (entries.length > 20 || entries.some(([id, subject]) =>
      !/^[a-zA-Z0-9_-]{1,128}$/.test(id) || typeof subject !== 'string' || !/^[0-9]{1,128}$/.test(subject))) return {};
    return Object.fromEntries(entries) as Record<string, string>;
  } catch { return {}; }
}

export async function checkPrivacyAccess(
  session: Partial<SessionData> | undefined,
  rawBindings: string | undefined,
  findAdmin: (id: string) => Promise<PrivacyAdminIdentity | undefined>,
  now = Date.now(),
  owner?: string,
): Promise<PrivacyAccess> {
  if (!session?.isAdmin || !session.adminUserId)
    return { allowed: false, status: 401, code: 'sign_in_required' };
  const configured = bindings(rawBindings);
  const expected = Object.hasOwn(configured, session.adminUserId) ? configured[session.adminUserId] : undefined;
  if (!expected) return { allowed: false, status: 403, code: 'privacy_access_required' };
  if (!hasVerifiedAdminMfa(session, now) || session.adminGoogleSubject !== expected || !Number.isFinite(session.adminAuthenticatedAt)
      || session.adminAuthenticatedAt! > now || now - session.adminAuthenticatedAt! >= PRIVACY_SESSION_MS)
    return { allowed: false, status: 403, code: 'google_sign_in_required' };
  const actor = await findAdmin(session.adminUserId);
  if (!actor || actor.id !== session.adminUserId || actor.isActive !== 'true'
      || !['admin', 'super_admin'].includes(adminRoleFor(actor.email, actor.role, owner) || '') || actor.googleId !== expected)
    return { allowed: false, status: 403, code: 'privacy_access_required' };
  return { allowed: true, actor, expiresAt: session.adminAuthenticatedAt! + PRIVACY_SESSION_MS };
}
