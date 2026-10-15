import type { SessionData } from 'express-session';

export function hasVerifiedAdminMfa(session: Partial<SessionData> | undefined, now = Date.now()): boolean {
  return session?.adminMfaVerified === true && Number.isFinite(session.adminGoogleAuthTime)
    && session.adminGoogleAuthTime! > 0 && session.adminGoogleAuthTime! <= now + 60_000;
}
