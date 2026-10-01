import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export function publicSiteOrigin(configured?: string): string {
  const raw = configured || 'https://www.greenelephant.org';
  const url = new URL(raw);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error('invalid_public_site_origin');
  return url.origin;
}
export function verifyTypeformSignature(body: Buffer, header: unknown, secret: string): boolean {
  if (!secret || typeof header !== 'string') return false;
  const expected = Buffer.from('sha256=' + createHmac('sha256', secret).update(body).digest('base64'));
  const actual = Buffer.from(header);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export const OPERATION_PREFIX = 'email_ops:v1:';
export function operationKey(kind: string, id: string): string {
  return OPERATION_PREFIX + kind + ':' + createHash('sha256').update(id).digest('hex');
}
export function normalizeEmail(value: unknown): string {
  if (typeof value !== 'string') throw new Error('invalid_email');
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(email)) throw new Error('invalid_email');
  return email;
}
export function emailLanguage(value: unknown): 'en' | 'fr' {
  if (value === undefined || value === null || value === '') return 'en';
  if (value !== 'en' && value !== 'fr') throw new Error('invalid_language');
  return value;
}
export function verifiedEmailToken(contactId: string, secret: string): string {
  if (!secret || secret.length < 32) throw new Error('email_unsubscribe_not_configured');
  return createHmac('sha256', secret).update('unsubscribe:'+contactId).digest('hex');
}
export function verifyEmailToken(contactId: unknown, token: unknown, secret: string): contactId is string {
  if (typeof contactId !== 'string' || !/^[a-zA-Z0-9-]{1,100}$/.test(contactId) || typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return false;
  try { const expected=Buffer.from(verifiedEmailToken(contactId,secret));const actual=Buffer.from(token);return timingSafeEqual(expected,actual); } catch { return false; }
}
