import type { ScanLanguage } from './scan-literacy';

export const SCAN_PRICE = 99.95;
export function checkoutLanguage(search: string): ScanLanguage {
  return new URLSearchParams(search).get('lang') === 'fr' ? 'fr' : 'en';
}
export function scanCheckoutUrl(language: ScanLanguage): string {
  return `${language === "fr" ? "/fr" : ""}/checkout?product=satellitescan&lang=${language}`;
}
// The existing Scan payment endpoint charges full price. Only a voucher covering
// the entire Scan can use the separate, server-validated free-purchase endpoint.
export function scanVoucherDiscount(valid: boolean, amount: unknown): number {
  const value = typeof amount === 'string' ? Number(amount) : amount;
  return valid && typeof value === 'number' && Number.isFinite(value) && value >= SCAN_PRICE ? SCAN_PRICE : 0;
}
export function paymentOutcome(status?: string): 'success' | 'pending' | 'retry' | 'unknown' {
  if (status === 'succeeded') return 'success';
  if (status === 'processing' || status === 'requires_capture') return 'pending';
  if (status === 'requires_payment_method' || status === 'canceled') return 'retry';
  return 'unknown';
}

export interface ScanPurchaseDetails {
  email: string;
  name: string;
  language: ScanLanguage;
  voucher?: string;
}
type PaymentReply = { clientSecret?: string; amount?: number; currency?: string; success?: boolean };
export async function prepareScanPurchase(
  details: ScanPurchaseDetails,
  post: (path: string, body: Record<string, string>) => Promise<PaymentReply>,
): Promise<{ kind: 'free' } | { kind: 'payment'; clientSecret: string }> {
  const customer = { customerEmail: details.email.trim(), customerName: details.name.trim() };
  if (details.voucher) {
    const result = await post('/api/satellitescan/free-purchase', { ...customer, couponCode: details.voucher, language: details.language });
    if (!result.success) throw new Error('Scan activation was not confirmed');
    return { kind: 'free' };
  }
  const result = await post('/api/satellitescan/create-payment-intent', { ...customer, language: details.language });
  if (!result.clientSecret || result.amount !== SCAN_PRICE || result.currency !== 'eur') {
    throw new Error('The payment price could not be confirmed');
  }
  return { kind: 'payment', clientSecret: result.clientSecret };
}
