import { and, asc, desc, eq, gt } from 'drizzle-orm';
import { z } from 'zod';
import type { db } from './db';
import { adminUsers, auditLogs, satellitescanPurchases as purchases, scanTypeformBindings as bindings,
  scanTypeformEvents as events, scanTypeformServiceTasks as tasks, scanTypeformReviewActions as actions } from '@shared/schema';
import { normalizeAdminEmail } from '@shared/admin-access-policy';
import { scanReviewAction, scanReviewId, ScanReviewError, scanReviewNextAction, type ScanReviewDetail, type ScanReviewRow } from '@shared/scan-service-review';
import type { PrivacyAdminIdentity } from './privacy-admin-access';
import { typeformDigest } from './typeform-intake';

type ScanReviewTransaction=Parameters<Parameters<Pick<typeof db,'transaction'>['transaction']>[0]>[0];
const digest = z.string().regex(/^[a-f0-9]{64}$/);
// Server-owned, immutable recovery evidence. Never populated from the HTTP body.
export const scanAssignmentEvidence = z.object({
  reference: scanReviewId, eventId: scanReviewId, purchaseId: scanReviewId,
  formId: scanReviewId, responseId: scanReviewId, payloadDigest: digest, responseDigest: digest,
  bindingDigest: digest, mappingDigest: digest,
  participantRef: scanReviewId.refine(value => !value.startsWith('unassigned-order:')),
  recipientEmail: z.string().email().max(320), assignmentEvidenceRef: scanReviewId, recipientEvidenceRef: scanReviewId,
  recordedAt: z.string().datetime({ offset: true }),
}).strict();
export type ScanAssignmentEvidence = z.infer<typeof scanAssignmentEvidence>;
type Event = typeof events.$inferSelect;
type Binding = typeof bindings.$inferSelect;
const due = (event: Event) => event.completionVerified === 'true' && event.submittedAt
  ? new Date(event.submittedAt.getTime() + 72 * 3600_000).toISOString() : null;
const rowView = (event: Event): ScanReviewRow => ({ eventId: event.eventId, formId: event.formId, responseId: event.responseId,
  outcome: event.outcome, reason: event.reason, receivedAt: event.receivedAt.toISOString(), submittedAt: event.submittedAt?.toISOString() ?? null,
  state: event.reviewState, version: event.reviewVersion, nextAction: scanReviewNextAction(event.reviewState, event.outcome), dueAt: due(event) });

/** Inject local immutable evidence only; no runtime DB/provider/sender initialization. */
export function createScanServiceReviewStore(database: Pick<typeof db, 'transaction'>, options: {
  owner(): string | undefined;
  evidence(eventId: string,transaction?:ScanReviewTransaction): Promise<readonly unknown[]>;
  now?(): Date;
}) {
  type Tx = Parameters<Parameters<typeof database.transaction>[0]>[0];
  const now = () => options.now?.() ?? new Date();
  async function owner(tx: Tx, actor: PrivacyAdminIdentity) {
    const [current] = await tx.select().from(adminUsers).where(eq(adminUsers.id, actor.id)).for('share');
    const configured = normalizeAdminEmail(options.owner());
    if (!configured || !current || !current.googleId || current.googleId !== actor.googleId || current.email !== actor.email
      || normalizeAdminEmail(current.email) !== configured || current.role !== 'super_admin' || current.isActive !== 'true')
      throw new ScanReviewError('review_access_required');
  }
  async function audit(tx: Tx, actor: PrivacyAdminIdentity, action: string, count: number) {
    await tx.insert(auditLogs).values({ userEmail: actor.email, actionType: action, resource: 'scan_service_review',
      details: { actorId: actor.id, returnedRows: count }, ipAddress: null });
  }
  const qualifies = (event: Event) => event.eventType === 'form_response' && event.completionVerified === 'true'
    && !!event.mappingDigest && !!event.bindingDigest && !!event.submittedAt;
  async function evidenceFor(tx:Tx,event: Event, binding?: Binding) {
    if (!qualifies(event) || !binding) return [];
    const candidates = await options.evidence(event.eventId,tx);
    if (!Array.isArray(candidates) || candidates.length > 25) throw new ScanReviewError('review_evidence_required');
    const valid: ScanAssignmentEvidence[] = [];
    for (const candidate of candidates) {
      const parsed = scanAssignmentEvidence.safeParse(candidate);
      if (!parsed.success) continue;
      const e = parsed.data;
      if (e.eventId === event.eventId && e.formId === event.formId && e.responseId === event.responseId
        && e.payloadDigest === event.payloadDigest && e.responseDigest === event.responseDigest
        && e.bindingDigest === event.bindingDigest && e.mappingDigest === event.mappingDigest
        && e.purchaseId === binding.purchaseId && binding.formId === event.formId
        && binding.referenceDigest === event.bindingDigest && Date.parse(e.recordedAt) <= now().getTime()
        && (!(binding.participantVerifiedAt || binding.participantVerificationRef)
          || (!!binding.participantVerifiedAt && !!binding.participantVerificationRef
            && binding.participantVerifiedAt.getTime() <= event.receivedAt.getTime()
            && e.participantRef === binding.participantRef))) valid.push(e);
    }
    // Ambiguous evidence identities cannot authorize selection.
    if (new Set(valid.map(e => e.reference)).size !== valid.length) return [];
    return valid;
  }
  async function bindingFor(tx: Tx, event: Event) {
    if (!event.bindingDigest) return undefined;
    const [binding] = await tx.select().from(bindings).where(eq(bindings.referenceDigest, event.bindingDigest));
    return binding;
  }
  return {
    async list(actor: PrivacyAdminIdentity, after?: string) {
      return database.transaction(async tx => {
        await owner(tx, actor);
        const rows = await tx.select().from(events).where(after ? gt(events.eventId, after) : undefined).orderBy(asc(events.eventId)).limit(26);
        await audit(tx, actor, 'scan_review_list', Math.min(rows.length, 25));
        return { receipts: rows.slice(0,25).map(rowView), nextCursor: rows.length > 25 ? rows[24].eventId : null };
      });
    },
    async detail(actor: PrivacyAdminIdentity, eventId: string): Promise<ScanReviewDetail> {
      return database.transaction(async tx => {
        await owner(tx, actor);
        const [event] = await tx.select().from(events).where(eq(events.eventId, eventId));
        if (!event) throw new ScanReviewError('review_not_found');
        const binding = await bindingFor(tx, event);
        const evidence = await evidenceFor(tx,event, binding);
        const [task] = await tx.select().from(tasks).where(eq(tasks.eventId, eventId));
        const history = await tx.select().from(actions).where(eq(actions.eventId, eventId)).orderBy(desc(actions.version)).limit(25);
        const [purchase] = binding ? await tx.select().from(purchases).where(eq(purchases.id, binding.purchaseId)) : [];
        const eligible = binding?.isActive === 'true' && binding.expiresAt.getTime() > now().getTime()
          && purchase?.status === 'succeeded' && purchase.typeformCompleted === 'false' && purchase.typeformCompletedAt === null
          && purchase.dashboardSent === 'false' && !binding.completedDigest
          && (!binding.responseId || binding.responseId === event.responseId);
        await audit(tx, actor, 'scan_review_detail', 1);
        return { receipt: rowView(event), purchaseId: binding?.purchaseId ?? null,
          evidenceOptions: evidence.map(e => ({ reference: e.reference, participantRef: e.participantRef, recipientEmail: e.recipientEmail })),
          canResolve: !!eligible && evidence.length > 0 && event.outcome === 'review' && ['open','held'].includes(event.reviewState),
          task: task ? { id: task.id, purchaseId: task.purchaseId, state: task.state, ownerId: task.ownerId,
            dueAt: task.dueAt?.toISOString() ?? null, participantRef: task.participantRef, recipientEmail: task.recipientEmail,
            assignmentEvidenceRef: task.assignmentEvidenceRef, recipientEvidenceRef: task.recipientEvidenceRef,
            nextAction: scanReviewNextAction('resolved', 'recorded') } : null,
          history: history.map(h => ({ version: h.version, decision: h.decision, reason: h.reason, actorId: h.actorId, recordedAt: h.recordedAt.toISOString() })) };
      });
    },
    async act(actor: PrivacyAdminIdentity, eventId: string, value: unknown) {
      const input = scanReviewAction.parse(value), requestDigest = typeformDigest(JSON.stringify({ eventId, ...input }));
      return database.transaction(async tx => {
        await owner(tx, actor);
        const [hint] = await tx.select().from(events).where(eq(events.eventId, eventId));
        if (!hint) throw new ScanReviewError('review_not_found');
        const bindingHint = input.decision === 'resolved' ? await bindingFor(tx, hint) : undefined;
        // All assignment/completion writers use purchase -> binding -> existing receipt.
        const [purchase] = bindingHint ? await tx.select().from(purchases).where(eq(purchases.id, bindingHint.purchaseId)).for('update') : [];
        const [binding] = bindingHint ? await tx.select().from(bindings).where(eq(bindings.id, bindingHint.id)).for('update') : [];
        const [event] = await tx.select().from(events).where(eq(events.eventId, eventId)).for('update');
        const [prior] = await tx.select().from(actions).where(eq(actions.mutationId, input.mutationId));
        if (prior) {
          if (prior.actorId !== actor.id || prior.requestDigest !== requestDigest || prior.eventId !== eventId) throw new ScanReviewError('review_conflict');
          await audit(tx, actor, 'scan_review_action_replay', 0);
          return { version: prior.version, decision: prior.decision, replayed: true };
        }
        if (event.reviewVersion !== input.expectedVersion || event.outcome !== 'review' || !['open','held'].includes(event.reviewState))
          throw new ScanReviewError('review_conflict');
        let evidence: ScanAssignmentEvidence | undefined;
        if (input.decision === 'resolved') {
          if (!qualifies(event) || !binding || !purchase || binding.purchaseId !== purchase.id
            || binding.referenceDigest !== event.bindingDigest || binding.formId !== event.formId
            || binding.isActive !== 'true' || binding.expiresAt.getTime() <= now().getTime()
            || binding.completedDigest || (binding.responseId && binding.responseId !== event.responseId)
            || purchase.status !== 'succeeded' || purchase.typeformCompleted !== 'false'
            || purchase.typeformCompletedAt !== null || purchase.dashboardSent !== 'false') throw new ScanReviewError('review_evidence_required');
          evidence = (await evidenceFor(tx,event, binding)).find(e => e.reference === input.evidenceRef);
          if (!evidence) throw new ScanReviewError('review_evidence_required');
          const [reserved] = await tx.select().from(tasks).where(and(eq(tasks.formId, event.formId), eq(tasks.responseId, event.responseId)));
          if (reserved) throw new ScanReviewError('review_conflict');
          await tx.update(purchases).set({ typeformCompleted: 'true', typeformCompletedAt: event.submittedAt }).where(eq(purchases.id, purchase.id));
          await tx.update(bindings).set({ responseId: event.responseId, completedDigest: event.responseDigest }).where(eq(bindings.id, binding.id));
          // Reviewed assignment is separate from identity verification. Leave both verification fields intact.
          await tx.insert(tasks).values({ bindingId: binding.id, purchaseId: purchase.id, eventId, formId: event.formId,
            responseId: event.responseId, responseDigest: event.responseDigest, ownerId: actor.id, dueAt: new Date(due(event)!),
            participantRef: evidence.participantRef, recipientEmail: evidence.recipientEmail,
            assignmentEvidenceRef: evidence.assignmentEvidenceRef, recipientEvidenceRef: evidence.recipientEvidenceRef, assignmentReviewedAt: now() });
        }
        const version = event.reviewVersion + 1;
        await tx.insert(actions).values({ mutationId: input.mutationId, eventId, version, actorId: actor.id,
          requestDigest, decision: input.decision, reason: input.reason, evidenceRef: evidence?.reference ?? null });
        await tx.update(events).set({ reviewVersion: version, reviewState: input.decision }).where(eq(events.eventId, eventId));
        await audit(tx, actor, 'scan_review_' + input.decision, 1);
        return { version, decision: input.decision, replayed: false };
      });
    },
  };
}
export type ScanServiceReviewStore = ReturnType<typeof createScanServiceReviewStore>;
