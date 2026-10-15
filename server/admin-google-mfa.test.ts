import { hasVerifiedAdminMfa } from './admin-mfa-session';
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, sign } from 'node:crypto';
import { google } from 'googleapis';
import { verifyAdminGoogleMfa } from './admin-google-mfa';

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const client = new google.auth.OAuth2();
// Keep the real Google library signature verifier; replace only certificate transport.
client.getFederatedSignonCertsAsync = async () => ({ certs: { fixture: publicKey.export({ type: 'spki', format: 'pem' }).toString() } } as any);
export const fixtureNonce = 'a'.repeat(64);
const now = Math.floor(Date.now() / 1000);
function token(patch: Record<string, unknown> = {}, headerPatch = {}) {
  const encode = (v: unknown) => Buffer.from(JSON.stringify(v)).toString('base64url');
  const body = encode({ alg: 'RS256', kid: 'fixture', ...headerPatch }) + '.' + encode({
    iss: 'https://accounts.google.com', aud: 'fixture-client', azp: 'fixture-client',
    sub: '12345', email: 'owner@example.invalid', email_verified: true, nonce: fixtureNonce,
    iat: now - 2, exp: now + 3600, auth_time: now - 86400, amr: ['pwd', 'mfa'], ...patch,
  });
  return body + '.' + sign('RSA-SHA256', Buffer.from(body), privateKey).toString('base64url');
}
test('real RSA signature verification accepts explicit MFA with an older Google authentication time', async () => {
  const result = await verifyAdminGoogleMfa(token(), 'fixture-client', fixtureNonce, client, now);
  assert.equal(result.id, '12345'); assert.equal(result.authTime, (now - 86400) * 1000);
  // Neither passkey nor SMS needs to be the chosen factor, but explicit mfa is mandatory.
  for (const amr of [['mfa', 'swk'], ['mfa', 'pwd', 'sms']])
    assert.ok(await verifyAdminGoogleMfa(token({ amr }), 'fixture-client', fixtureNonce, client, now));
});
test('invalid identity, signature, audience, issuer, time and nonce fail closed without token leakage', async () => {
  const invalid = [token({ iss: 'https://attacker.invalid' }), token({ aud: 'other' }), token({ azp: 'other' }),
    token({ exp: now }), token({ exp: String(now + 3600) }), token({ iat: now + 1000 }), token({ nbf: now + 1000 }),
    token({ nonce: 'b'.repeat(64) }), token({ sub: '' }), token({ email_verified: 'true' }), token({ email: 'bad' }),
    token({}, { alg: 'none' }), token({}, { kid: 'unknown' }), 'malformed', token().slice(0, -12) + 'tampered'];
  for (const value of invalid) await assert.rejects(verifyAdminGoogleMfa(value, 'fixture-client', fixtureNonce, client, now),
    e => e instanceof Error && e.message === 'invalid_identity');
});
test('missing, malformed and implied MFA evidence is refused', async () => {
  for (const patch of [{ amr: undefined }, { amr: 'mfa' }, { amr: [] }, { amr: ['swk'] }, { amr: ['hwk'] },
    { amr: ['pwd', 'sms'] }, { amr: ['mfa', 7] }, { auth_time: undefined }, { auth_time: '1234' },
    { auth_time: 0 }, { auth_time: now + 1000 }])
    await assert.rejects(verifyAdminGoogleMfa(token(patch), 'fixture-client', fixtureNonce, client, now), /mfa_unverified/);
});
test('a token from a different attempt and sessions lacking MFA provenance cannot be reused', async () => {
  await assert.rejects(verifyAdminGoogleMfa(token(), 'fixture-client', 'b'.repeat(64), client, now), /invalid_identity/);
  for (const session of [undefined, {}, { adminMfaVerified: true }, { adminMfaVerified: true, adminGoogleAuthTime: NaN },
    { adminMfaVerified: true, adminGoogleAuthTime: Date.now() + 120_000 }]) assert.equal(hasVerifiedAdminMfa(session), false);
});
