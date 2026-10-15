import { randomBytes, createHash } from 'node:crypto';
import type { Express, Request } from 'express';
import type { IStorage } from './storage';
import { adminRoleFor, normalizeAdminEmail } from '@shared/admin-access-policy';
import { validAdminOAuthState } from './privacy-admin-access';
import { AdminMfaError, verifyAdminGoogleMfa } from './admin-google-mfa';

type AdminStore = Pick<IStorage, 'getAdminUserByGoogleId' | 'getAdminUserByEmail' | 'updateAdminUser'
  | 'getClientUserByEmail' | 'createClientUser' | 'updateClientUser'>;
export function registerAdminGoogleRoutes(app: Express, deps: {
  storage: AdminStore;
  config: () => { clientId?: string; clientSecret?: string; owner?: string };
  baseUrl: (req: Request) => string | Promise<string>;
  audit: (email: string, action: string, resource: string, details: object) => Promise<void>;
  verify?: typeof verifyAdminGoogleMfa;
  fetch?: typeof fetch;
}) {
  const save = (req: Request) => new Promise<void>((resolve, reject) => req.session.save(e => e ? reject(e) : resolve()));
  const regenerate = (req: Request) => new Promise<void>((resolve, reject) => req.session.regenerate(e => e ? reject(e) : resolve()));
  const fetchProvider = deps.fetch ?? fetch;
  app.get('/api/admin/auth/google', async (req, res) => {
    res.set({ 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' });
    try {
      const { clientId, clientSecret } = deps.config();
      if (!clientId || !clientSecret) return res.redirect('/admin/login?error=not_configured');
      const base = await deps.baseUrl(req);
      if (new URL(base).hostname.endsWith('.replit.dev')) return res.redirect('/admin/login?error=dev_google');
      // Rotate before starting: discard old admin privileges and obsolete flows.
      await regenerate(req);
      const state = randomBytes(16).toString('hex');
      const nonce = randomBytes(32).toString('hex');
      const verifier = randomBytes(32).toString('base64url');
      req.session.adminOAuthState = state;
      req.session.adminOAuthNonce = nonce;
      req.session.adminOAuthStartedAt = Date.now();
      req.session.adminOAuthVerifier = verifier;
      const params = new URLSearchParams({ client_id: clientId, redirect_uri: `${base}/api/admin/auth/google/callback`,
        response_type: 'code', scope: 'openid email profile', prompt: 'select_account', state, nonce,
        code_challenge: createHash('sha256').update(verifier).digest('base64url'), code_challenge_method: 'S256',
        claims: JSON.stringify({ id_token: { amr: { essential: true }, auth_time: { essential: true } } }),
      });
      await save(req); // Do not send the browser away if cookies/session storage failed.
      return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
    } catch {
      await new Promise<void>(resolve => req.session.destroy(() => resolve()));
      res.clearCookie('connect.sid');
      return res.redirect('/admin/login?error=session_failed');
    }
  });

  app.get('/api/admin/auth/google/callback', async (req, res) => {
    res.set({ 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' });
    const deny = async (code: string) => {
      // A later portal/audit/save failure must never persist partial admin access.
      await new Promise<void>(resolve => req.session.destroy(() => resolve()));
      res.clearCookie('connect.sid');
      return res.redirect(`/admin/login?error=${code}`);
    };
    try {
      const { code, state, error } = req.query;
      const expected = req.session.adminOAuthState;
      const nonce = req.session.adminOAuthNonce;
      const started = req.session.adminOAuthStartedAt;
      const verifier = req.session.adminOAuthVerifier;
      delete req.session.adminOAuthState; delete req.session.adminOAuthNonce;
      delete req.session.adminOAuthStartedAt; delete req.session.adminOAuthVerifier;
      // Persist consumption before any provider request; code and PKCE are also one-use at Google.
      try { await save(req); } catch { return deny('session_failed'); }
      if (!validAdminOAuthState(state, expected) || !nonce || !verifier || !Number.isFinite(started)
          || started! > Date.now() || Date.now() - started! >= 10 * 60_000) return deny('state_mismatch');
      if (error) return deny('google_auth_failed');
      if (typeof code !== 'string' || !code || code.length > 4096) return deny('no_code');
      const { clientId, clientSecret, owner } = deps.config();
      if (!clientId || !clientSecret) return deny('not_configured');
      const tokenRes = await fetchProvider('https://oauth2.googleapis.com/token', {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        signal: AbortSignal.timeout(10_000),
        body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret,
          redirect_uri: `${await deps.baseUrl(req)}/api/admin/auth/google/callback`,
          grant_type: 'authorization_code', code_verifier: verifier }),
      });
      if (!tokenRes.ok) return deny('token_failed');
      const tokens = await tokenRes.json();
      const identity = await (deps.verify ?? verifyAdminGoogleMfa)(tokens.id_token, clientId, nonce);
      if (!adminRoleFor(identity.email, 'admin', owner)) return deny('not_authorized');
      let admin = await deps.storage.getAdminUserByGoogleId(identity.id);
      if (!admin) {
        admin = await deps.storage.getAdminUserByEmail(identity.email);
        if (admin?.isActive === 'true' && (!admin.googleId || admin.googleId === identity.id)
            && adminRoleFor(admin.email, admin.role, owner)) {
          admin = await deps.storage.updateAdminUser(admin.id, { googleId: identity.id,
            avatarUrl: identity.picture || admin.avatarUrl, name: admin.name || identity.name,
            lastLoginAt: new Date() });
        }
      }
      if (!admin || admin.isActive !== 'true' || admin.googleId !== identity.id
          || normalizeAdminEmail(admin.email) !== identity.email) return deny('not_authorized');
      const role = adminRoleFor(admin.email, admin.role, owner);
      if (!role) return deny('not_authorized');
      await deps.storage.updateAdminUser(admin.id, { lastLoginAt: new Date() });
      // Preserve existing portal linking; complete it before granting admin access.
      const client = await deps.storage.getClientUserByEmail(identity.email);
      if (!client) await deps.storage.createClientUser({ email: identity.email, name: identity.name || admin.name || undefined,
        googleId: identity.id, avatarUrl: identity.picture });
      else if (!client.googleId) await deps.storage.updateClientUser(client.id, { googleId: identity.id,
        avatarUrl: identity.picture || client.avatarUrl, name: client.name || identity.name });
      await regenerate(req);
      Object.assign(req.session, { isAdmin: true, adminUserId: admin.id, adminEmail: admin.email, adminRole: role,
        adminGoogleSubject: identity.id, adminAuthenticatedAt: Date.now(),
        adminMfaVerified: true, adminGoogleAuthTime: identity.authTime });
      try { await save(req); } catch { return deny('session_failed'); }
      await deps.audit(identity.email, 'admin_login', '/admin', { method: 'google_mfa', role });
      return res.redirect('/admin/submissions');
    } catch (error) {
      return deny(error instanceof AdminMfaError ? error.code : 'callback_failed');
    }
  });
}
