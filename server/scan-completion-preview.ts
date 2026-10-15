import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import type { db } from './db';
import { adminUsers, adminSettings, auditLogs, satellitescanPurchases as purchases, scanTypeformBindings as bindings,
  scanTypeformEvents as events, scanTypeformServiceTasks as tasks } from '@shared/schema';
import type { PrivacyAdminIdentity } from './privacy-admin-access';
import { normalizeAdminEmail } from '@shared/admin-access-policy';
import { ScanReviewError, type ScanCompletionPreview } from '@shared/scan-service-review';
import { contentHash, TypeformRecoveryError } from './typeform-content';
import type { RecoveryReceipt, RecoveredTypeformResponse } from './typeform-response-reader';
import { renderScanResultDraft } from './scan-results-email';
import { brandedEmailWrapper } from './branded-email';
import { operationKey } from './delivery-security';
import { appendScanAnswer, typeformAnswerValue } from '../shared/scan-answers';

/** Read-only no-send operation. Recovery happens outside transactions/locks. No runtime defaults. */
export function createScanCompletionPreview(database: Pick<typeof db,'transaction'>, options: {
  owner(): string | undefined; sender: string;
  recover(receipt: RecoveryReceipt): Promise<RecoveredTypeformResponse>; now?(): Date;
}) {
  const sender = z.string().email().max(320).parse(options.sender);
  const now = () => options.now?.() ?? new Date();
  async function capture(actor: PrivacyAdminIdentity, eventId: string, expectedVersion: number, expected?: string) {
    return database.transaction(async tx => {
      const [owner] = await tx.select().from(adminUsers).where(eq(adminUsers.id,actor.id)).for('share');
      if (!owner || owner.isActive !== 'true' || owner.role !== 'super_admin' || !owner.googleId
        || owner.googleId !== actor.googleId || owner.email !== actor.email || !normalizeAdminEmail(options.owner())
        || normalizeAdminEmail(owner.email) !== normalizeAdminEmail(options.owner())) throw new ScanReviewError('review_access_required');
      const [hint] = await tx.select().from(tasks).where(eq(tasks.eventId,eventId));
      if (!hint) throw new TypeformRecoveryError('recovery_conflict');
      // Same lock order as resolution, but release every lock before the recovery read.
      const [purchase] = await tx.select().from(purchases).where(eq(purchases.id,hint.purchaseId)).for('share');
      const [binding] = await tx.select().from(bindings).where(eq(bindings.id,hint.bindingId)).for('share');
      const [event] = await tx.select().from(events).where(eq(events.eventId,eventId)).for('share');
      const [task] = await tx.select().from(tasks).where(and(eq(tasks.id,hint.id),eq(tasks.eventId,eventId))).for('share');
      const [locale] = await tx.select().from(adminSettings).where(eq(adminSettings.key,operationKey('purchase-language',hint.purchaseId))).for('share');
      if (!event || !task || !purchase || !binding || event.reviewVersion !== expectedVersion || event.reviewState !== 'resolved'
        || event.eventType !== 'form_response' || event.completionVerified !== 'true' || !event.submittedAt
        || event.contentVersion !== 1 || !event.contentDigest || !event.labelsDigest || !event.mappingDigest
        || task.ownerId !== actor.id || !task.participantRef || !task.recipientEmail || !task.assignmentEvidenceRef || !task.recipientEvidenceRef
        || !task.assignmentReviewedAt || task.state !== 'pending_retrieval' || task.responseDigest !== event.responseDigest
        || task.formId !== event.formId || task.responseId !== event.responseId || binding.purchaseId !== purchase.id
        || binding.formId !== event.formId || binding.responseId !== event.responseId || binding.completedDigest !== event.responseDigest
        || binding.referenceDigest !== event.bindingDigest || binding.isActive !== 'true' || binding.expiresAt.getTime() <= now().getTime()
        || purchase.status !== 'succeeded' || purchase.typeformCompleted !== 'true' || purchase.dashboardSent !== 'false'
        || purchase.typeformCompletedAt?.getTime() !== event.submittedAt.getTime()
        || (locale?.value !== 'en' && locale?.value !== 'fr')) throw new TypeformRecoveryError('recovery_conflict');
      const fingerprint = contentHash({ event,task,binding,purchase,locale:locale.value,sender });
      if (expected && fingerprint !== expected) throw new TypeformRecoveryError('recovery_conflict');
      await tx.insert(auditLogs).values({ userEmail:actor.email,actionType:expected ? 'scan_completion_preview_read' : 'scan_completion_preview_started',
        resource:'scan_service_review',details:{actorId:actor.id,returnedRows:expected ? 1 : 0},ipAddress:null });
      return { event,task,language:locale.value as 'en'|'fr',fingerprint };
    });
  }
  return async (actor: PrivacyAdminIdentity,eventId: string,expectedVersion: number): Promise<ScanCompletionPreview> => {
    const before = await capture(actor,eventId,expectedVersion);
    const recovered = await options.recover(before.event);
    // Revalidate injected/cached content too; a mutable object is never trusted solely for its provenance label.
    if (contentHash(recovered.content) !== before.event.contentDigest || recovered.contentDigest !== before.event.contentDigest
      || contentHash(recovered.labels) !== before.event.labelsDigest || recovered.labelsDigest !== before.event.labelsDigest
      || recovered.content.formId !== before.event.formId || recovered.content.responseId !== before.event.responseId
      || recovered.content.bindingDigest !== before.event.bindingDigest || recovered.content.mappingDigest !== before.event.mappingDigest
      || recovered.provenance.source !== 'typeform-responses-api' || recovered.provenance.version !== 1
      || recovered.provenance.formId !== before.event.formId || recovered.provenance.responseId !== before.event.responseId
      || !/^[a-f0-9]{64}$/.test(recovered.provenance.apiBodyDigest)
      || !Number.isFinite(Date.parse(recovered.provenance.retrievedAt)) || Date.parse(recovered.provenance.retrievedAt) > now().getTime())
      throw new TypeformRecoveryError('recovery_conflict');
    const answers = new Map(recovered.content.answers.map(a => [a.field.ref ?? a.field.id!,a])), rawData: Record<string,string> = Object.create(null);
    for (const label of recovered.labels) {
      const answer = answers.get(label.field);
      if (!answer) throw new TypeformRecoveryError('recovery_conflict');
      appendScanAnswer(rawData,label.title,typeformAnswerValue(answer));
    }
    const submitted = new Intl.DateTimeFormat(before.language === 'fr' ? 'fr-FR':'en-GB',{
      dateStyle:'medium',timeStyle:'short',timeZone:'Europe/Helsinki' }).format(before.event.submittedAt!);
    const draft = renderScanResultDraft({kind:'completion',language:before.language,name:null,rawData,submittedAt:submitted});
    const message = { from:sender,to:before.task.recipientEmail!,cc:['esteve@greenelephant.org','anu@greenelephant.org','email@estevepannetier.com'],replyTo:'esteve@greenelephant.org',
      subject:draft.subject,html:brandedEmailWrapper(draft.title,draft.subtitle,draft.bodyHtml,draft.footer),text:draft.text,
      attachments:[{filename:draft.filename,contentType:'text/plain; charset=utf-8',contentUtf8:draft.downloadText}] };
    const fingerprint = contentHash({version:1,context:before.fingerprint,message});
    await capture(actor,eventId,expectedVersion,before.fingerprint);
    return { previewVersion:1,taskId:before.task.id,eventId,reviewVersion:expectedVersion,fingerprint,
      contentDigest:before.event.contentDigest!,provenance:recovered.provenance,message,
      approvalStatus:'not_approved',emailDelivery:'not_attempted' };
  };
}
