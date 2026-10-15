import { google } from 'googleapis';

const verifier = new google.auth.OAuth2({ transporterOptions: { timeout: 10_000, retry: false } });
export class AdminMfaError extends Error {
  constructor(public readonly code: 'mfa_unverified' | 'invalid_identity') { super(code); }
}

// The injected verifier is for isolated tests; production always uses Google's
// signature verifier and its fixed Google certificate endpoint/cache.
export async function verifyAdminGoogleMfa(
  token: unknown, clientId: string, nonce: string,
  client: Pick<typeof verifier, 'verifyIdToken'> = verifier,
  now = Math.floor(Date.now() / 1000),
) {
  if (typeof token !== 'string' || !token || token.length > 16384 || !clientId
      || !/^[a-f0-9]{64}$/.test(nonce)) throw new AdminMfaError('invalid_identity');
  let claims: Record<string, unknown>;
  try {
    const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString());
    if (header.alg !== 'RS256' || typeof header.kid !== 'string' || !header.kid) throw Error();
    const ticket = await client.verifyIdToken({ idToken: token, audience: clientId });
    claims = ticket.getPayload() as unknown as Record<string, unknown>;
  } catch { throw new AdminMfaError('invalid_identity'); }
  // Check exact types and expiry as well as the library's signature/issuer/audience
  // checks (which allow clock skew). Never log tokens or library error payloads.
  if (!claims || !['https://accounts.google.com', 'accounts.google.com'].includes(String(claims.iss))
      || claims.aud !== clientId || (claims.azp !== undefined && claims.azp !== clientId)
      || claims.nonce !== nonce
      || typeof claims.sub !== 'string' || !/^[0-9]{1,128}$/.test(claims.sub)
      || typeof claims.email !== 'string' || claims.email.length > 320
      || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(claims.email) || claims.email_verified !== true
      || !Number.isInteger(claims.exp) || (claims.exp as number) <= now
      || !Number.isInteger(claims.iat) || (claims.iat as number) <= 0
      || (claims.iat as number) > now + 60 || (claims.iat as number) >= (claims.exp as number)
      || (claims.nbf !== undefined && (!Number.isInteger(claims.nbf) || (claims.nbf as number) > now + 60)))
    throw new AdminMfaError('invalid_identity');
  if (!Array.isArray(claims.amr) || !claims.amr.every(v => typeof v === 'string') || !claims.amr.includes('mfa')
      || !Number.isInteger(claims.auth_time) || (claims.auth_time as number) <= 0
      || (claims.auth_time as number) > now + 60
      || (claims.auth_time as number) > (claims.iat as number) + 60)
    throw new AdminMfaError('mfa_unverified');
  return {
    id: claims.sub, email: claims.email.toLowerCase(), authTime: (claims.auth_time as number) * 1000,
    name: typeof claims.name === 'string' ? claims.name : undefined,
    picture: typeof claims.picture === 'string' ? claims.picture : undefined,
  };
}
