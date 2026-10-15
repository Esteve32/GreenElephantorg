import type { TypeformOriginalCodec,SignedTypeformOriginal } from './typeform-originals';
import { and, eq } from 'drizzle-orm';
import type { db } from './db';
import { auditLogs, satellitescanPurchases as purchases, scanTypeformBindings as bindings,
  scanTypeformEvents as events, scanTypeformServiceTasks as tasks,scanTypeformOriginals as originals } from '@shared/schema';
import { TypeformIntakeError, type TypeformIntakeOutcome, type TypeformReceipt } from './typeform-intake';

/** Injected database; no runtime DB import, provider, mail send or scheduler. */
export function createTypeformIntakeStore(database: Pick<typeof db, 'transaction'>,options?:{originals:TypeformOriginalCodec}) {
  return {
    async receive(input: TypeformReceipt,source?:SignedTypeformOriginal) {
      const protectedOriginal=options&&input.eventType==='form_response'?source?options.originals.seal(input,source):(()=>{throw new TypeformIntakeError(503);})():undefined;
      return database.transaction(async tx => {
        const audit = async (action: string) => {
          await tx.insert(auditLogs).values({ userEmail: 'system:typeform', actionType: action,
            resource: 'scan_service_intake', details: { eventId: input.eventId }, ipAddress: null });
        };
        const { completionVerified, ...record } = input;
        const inserted = await tx.insert(events).values({ ...record,
          completionVerified: completionVerified ? 'true' : 'false',
          outcome: 'review', reason: 'unmatched' }).onConflictDoNothing({ target: events.eventId }).returning();
        const captureOriginal=async()=>{
          if(!protectedOriginal)return;
          const saved=await tx.insert(originals).values(protectedOriginal).onConflictDoNothing().returning({id:originals.eventId});
          if(!saved.length){const [prior]=await tx.select().from(originals).where(eq(originals.eventId,input.eventId));if(!prior||prior.payloadDigest!==protectedOriginal.payloadDigest)throw new TypeformIntakeError(409);}
        };
        if (!inserted.length) {
          const [prior] = await tx.select().from(events).where(eq(events.eventId, input.eventId));
          if (!prior || prior.payloadDigest !== input.payloadDigest || prior.formId !== input.formId
            || prior.responseId !== input.responseId || prior.eventType !== input.eventType) throw new TypeformIntakeError(409);
          await captureOriginal();
          await audit('typeform_intake_replay');
          return { outcome: prior.outcome, replayed: true };
        }
        await captureOriginal();
        let bindingId: string | undefined;
        const finish = async (outcome: TypeformIntakeOutcome, reason: string) => {
          await tx.update(events).set({ outcome, reason, bindingId }).where(eq(events.eventId, input.eventId));
          await audit('typeform_intake_' + outcome);
          return { outcome, replayed: false };
        };
        if (!input.bindingDigest) return finish('review', 'unmatched');
        if (input.eventType === 'form_response' && !input.completionVerified) return finish('review', 'completion_unverified');
        const [hint] = await tx.select().from(bindings).where(eq(bindings.referenceDigest, input.bindingDigest));
        if (!hint) return finish('review', 'unmatched');
        // Shared purchase -> binding lock order with reference preparation/review.
        const [purchase] = await tx.select().from(purchases).where(eq(purchases.id, hint.purchaseId)).for('update');
        const [binding] = await tx.select().from(bindings).where(eq(bindings.id, hint.id)).for('update');
        if (!binding || binding.referenceDigest !== input.bindingDigest || binding.purchaseId !== hint.purchaseId
          || binding.formId !== input.formId) return finish('review', 'unmatched');
        bindingId = binding.id;
        if (binding.isActive !== 'true' || binding.expiresAt.getTime() <= input.receivedAt.getTime()) return finish('review', 'binding_unavailable');
        // Possession of a forwarded invitation alone does not verify a person.
        // The separately reviewed assignment/identity workflow must supply evidence.
        if (!binding.participantVerifiedAt || !binding.participantVerificationRef
          || binding.participantVerifiedAt.getTime() > input.receivedAt.getTime()) return finish('review', 'participant_unverified');
        if (binding.responseId && binding.responseId !== input.responseId) return finish('review', 'response_mismatch');
        if (!purchase || purchase.status !== 'succeeded') return finish('review', 'purchase_ineligible');
        if (binding.completedDigest) {
          if (input.eventType === 'form_response_partial') return finish('partial', 'late_partial');
          const same = binding.completedDigest === input.responseDigest;
          return finish(same ? 'duplicate' : 'review', same ? 'same_response' : 'response_changed');
        }
        if (purchase.typeformCompleted !== 'false' || purchase.typeformCompletedAt !== null || purchase.dashboardSent !== 'false') return finish('review', 'already_complete');
        if (input.eventType === 'form_response_partial') {
          await tx.update(bindings).set({ responseId: input.responseId }).where(eq(bindings.id, binding.id));
          return finish('partial', 'not_completed');
        }
        if (!input.submittedAt) throw new TypeformIntakeError(400);
        const [reserved] = await tx.select().from(tasks).where(and(eq(tasks.formId, input.formId), eq(tasks.responseId, input.responseId)));
        if (reserved) return finish('review', 'response_already_assigned');
        await tx.update(purchases).set({ typeformCompleted: 'true', typeformCompletedAt: input.submittedAt }).where(eq(purchases.id, purchase.id));
        await tx.update(bindings).set({ responseId: input.responseId, completedDigest: input.responseDigest }).where(eq(bindings.id, binding.id));
        // Durable retrieval/review work, not a ready-to-send mail payload.
        await tx.insert(tasks).values({ bindingId: binding.id, purchaseId: purchase.id, eventId: input.eventId,
          formId: input.formId, responseId: input.responseId, responseDigest: input.responseDigest });
        return finish('recorded', 'service_task_pending');
      });
    },
  };
}
