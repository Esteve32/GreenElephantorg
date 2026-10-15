export const ADMIN_TEAM_DOMAIN = 'greenelephant.org';
export function normalizeAdminEmail(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 320) return null;
  const email = value.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}
export function isTeamEmail(value: unknown): boolean {
  return normalizeAdminEmail(value)?.split('@')[1] === ADMIN_TEAM_DOMAIN;
}
export function adminRoleFor(email: string, storedRole: string, configuredOwner: string | undefined): 'super_admin' | 'admin' | 'viewer' | null {
  const address = normalizeAdminEmail(email);
  const owner = normalizeAdminEmail(configuredOwner);
  if (!address || (!isTeamEmail(address) && address !== owner)) return null;
  // Legacy staff super-admin rows lose owner privileges without rewriting history.
  if (storedRole === 'super_admin') return address === owner ? 'super_admin' : 'admin';
  return storedRole === 'admin' || storedRole === 'viewer' ? storedRole : null;
}
