import { createHmac } from 'node:crypto';
import { eq } from 'drizzle-orm';
import type { db } from './db';
import { adminSettings, auditLogs, satellitescanPurchases as purchases, scanTypeformBindings as bindings } from '@shared/schema';
import { operationKey } from './delivery-security';
import { typeformDigest } from './typeform-intake';
import { scanTypeformLink, validScanReferenceField } from '../shared/scan-typeform-link';

export class ScanTypeformReferenceError extends Error {
  constructor(public readonly reason: 'configuration_required' | 'purchase_ineligible' | 'review_required') {
    super('scan_typeform_reference_unavailable');
  }
}

/**
 * Unconnected candidate: prepare a reference for the EXISTING purchase/reminder link.
 * The injected key has no runtime default and must not reuse a provider signing key.
 * No email, new customer verification, participant identity assertion or provider call.
 */
export function createScanTypeformReferencePreparer(database: Pick<typeof db, 'transaction'>, options: {
  key: Buffer; formId: string; bindingField: string; now?(): Date;
}) {
  if (!Buffer.isBuffer(options.key) || options.key.length < 32 || typeof options.formId !== 'string'
    || !/^[A-Za-z0-9_-]{1,128}$/.test(options.formId) || !validScanReferenceField(options.bindingField)) {
    throw new ScanTypeformReferenceError('configuration_required');
  }
  const key = Buffer.from(options.key), formId = options.formId, field = options.bindingField;
  return async (purchaseId: string, expiresAt: Date) => {
    const now = options.now?.() ?? new Date();
    if (!Number.isFinite(now.getTime()) || !(expiresAt instanceof Date)
      || !Number.isFinite(expiresAt.getTime()) || expiresAt.getTime() <= now.getTime()) {
      throw new ScanTypeformReferenceError('configuration_required');
    }
    if (typeof purchaseId !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(purchaseId)) {
      throw new ScanTypeformReferenceError('purchase_ineligible');
    }
    // Stable across callback/recovery/reminder retries, without storing the bearer value.
    // A key/field change requires reconciliation; it must not silently replace old links.
    const value = createHmac('sha256', key)
      .update(JSON.stringify(['scan-typeform-order-reference', 1, formId, field, purchaseId]))
      .digest('base64url');
    const digest = typeformDigest(value);
    return database.transaction(async tx => {
      // Lock the actual order, never trust a browser-supplied status/email/payment ID.
      const [purchase] = await tx.select().from(purchases).where(eq(purchases.id, purchaseId)).for('update');
      if (!purchase || purchase.status !== 'succeeded' || purchase.typeformCompleted !== 'false'
        || purchase.typeformCompletedAt !== null || purchase.dashboardSent !== 'false') {
        throw new ScanTypeformReferenceError('purchase_ineligible');
      }
      const [locale] = await tx.select().from(adminSettings)
        .where(eq(adminSettings.key, operationKey('purchase-language', purchaseId)));
      // Historical orders without the new-flow marker may already have been fulfilled.
      if (locale?.value !== 'en' && locale?.value !== 'fr') throw new ScanTypeformReferenceError('review_required');
      const existing = await tx.select().from(bindings).where(eq(bindings.purchaseId, purchaseId)).limit(2);
      let binding = existing[0];
      if (existing.length) {
        if (existing.length !== 1 || binding.referenceDigest !== digest || binding.formId !== formId
          || binding.isActive !== 'true' || binding.expiresAt.getTime() <= now.getTime()
          || binding.completedDigest) throw new ScanTypeformReferenceError('review_required');
      } else {
        [binding] = await tx.insert(bindings).values({ referenceDigest: digest, purchaseId, formId, expiresAt,
          // Explicitly unassigned metadata, NOT a verified payer/participant identity.
          participantRef: 'unassigned-order:' + purchaseId,
          participantVerifiedAt: null, participantVerificationRef: null }).returning();
        await tx.insert(auditLogs).values({ userEmail: 'system:scan-purchase',
          actionType: 'scan_typeform_order_reference_prepared', resource: 'scan_service_intake',
          details: { purchaseId, bindingId: binding.id }, ipAddress: null });
      }
      return { purchaseId, bindingId: binding.id, language: locale.value, expiresAt: binding.expiresAt,
        reference: { field, value }, url: scanTypeformLink(locale.value, { field, value }) };
    });
  };
}
