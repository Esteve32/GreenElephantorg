import { and,eq } from 'drizzle-orm';
import { z } from 'zod';
import type { db } from './db';
import { adminUsers,auditLogs,scanTypeformEvents as events,scanTypeformOriginals as originals,scanTypeformBindings as bindings,satellitescanPurchases as purchases,scanTypeformAssignmentEvidence as assignments } from '@shared/schema';
import { TypeformRecoveryError,canonicalJson,contentHash } from './typeform-content';
import { scanAssignmentEvidence } from './scan-service-review-store';
import { ScanReviewError,scanReviewId } from '@shared/scan-service-review';
import type { PrivacyAdminIdentity } from './privacy-admin-access';
import type { TypeformOriginalCodec } from './typeform-originals';
export const assignmentAttestation=z.object({mutationId:z.string().uuid(),expectedVersion:z.number().int().min(0),participantRef:scanReviewId.refine(x=>!x.startsWith('unassigned-order:')),recipientEmail:z.string().email().max(320),assignmentEvidenceRef:scanReviewId,recipientEvidenceRef:scanReviewId,identityReviewed:z.literal(true),recipientReviewed:z.literal(true),payerPermissionsReviewed:z.literal(true)}).strict();
/** No raw original/answer HTTP endpoint. Reads are internal to reviewed recovery. */
export function createTypeformEvidenceStore(database:Pick<typeof db,'transaction'>,options:{codec:TypeformOriginalCodec;owner():string|undefined;now?():Date}){
 const now=()=>options.now?.()??new Date();
 async function original(eventId:string){
  const pair=await database.transaction(async tx=>{const [event]=await tx.select().from(events).where(eq(events.eventId,eventId));const [source]=await tx.select().from(originals).where(eq(originals.eventId,eventId));if(!event||!source)throw new TypeformRecoveryError('recovery_unavailable');return{event,source};});
  const opened=options.codec.open(pair.source,pair.event),r=opened.receipt,e=pair.event;
  if(r.formId!==e.formId||r.responseId!==e.responseId||r.responseDigest!==e.responseDigest||r.mappingDigest!==e.mappingDigest||r.contentDigest!==e.contentDigest||r.labelsDigest!==e.labelsDigest||r.completionVerified!==(e.completionVerified==='true'))throw new TypeformRecoveryError('recovery_conflict');
  return{...pair,opened};
 }
 return {
  async signedDefinition(eventId:string){return (await original(eventId)).opened.body.form_response.definition;},
  async evidence(eventId:string,transaction?:Parameters<Parameters<typeof database.transaction>[0]>[0]){const read=async(tx:Parameters<Parameters<typeof database.transaction>[0]>[0])=>(await tx.select({evidence:assignments.evidence}).from(assignments).where(eq(assignments.eventId,eventId)).limit(26)).map(x=>x.evidence);return transaction?read(transaction):database.transaction(read);},
  async attest(actor:PrivacyAdminIdentity,eventId:string,value:unknown){
   const input=assignmentAttestation.parse(value),before=await original(eventId);
   const requestDigest=contentHash({actorId:actor.id,eventId,input:{...input,mutationId:null}});
   return database.transaction(async tx=>{
    const [owner]=await tx.select().from(adminUsers).where(eq(adminUsers.id,actor.id)).for('share');
    if(!owner||owner.googleId!==actor.googleId||owner.email!==actor.email||owner.isActive!=='true'||owner.role!=='super_admin'||!options.owner()||owner.email.toLowerCase()!==options.owner()?.toLowerCase())throw new ScanReviewError('review_access_required');
    const [hint]=before.event.bindingDigest?await tx.select().from(bindings).where(eq(bindings.referenceDigest,before.event.bindingDigest)):[];
    if(!hint)throw new ScanReviewError('review_evidence_required');
    // Shared purchase -> binding -> receipt lock order. Attestation never completes an order.
    const [purchase]=await tx.select().from(purchases).where(eq(purchases.id,hint.purchaseId)).for('update');
    const [binding]=await tx.select().from(bindings).where(eq(bindings.id,hint.id)).for('update');
    const [event]=await tx.select().from(events).where(eq(events.eventId,eventId)).for('update');
    const [prior]=await tx.select().from(assignments).where(eq(assignments.reference,input.mutationId));
    if(prior){if(prior.requestDigest!==requestDigest||prior.actorId!==actor.id||prior.eventId!==eventId)throw new ScanReviewError('review_conflict');return{reference:prior.reference,replayed:true};}
    const duplicates=await tx.select().from(assignments).where(and(eq(assignments.eventId,eventId),eq(assignments.requestDigest,requestDigest))).limit(1);
    if(duplicates.length)return{reference:duplicates[0].reference,replayed:true};
    if(!event||canonicalJson(event)!==canonicalJson(before.event)||event.reviewVersion!==input.expectedVersion||event.eventType!=='form_response'||event.completionVerified!=='true'||event.contentVersion!==1||!event.contentDigest||!event.labelsDigest||!event.mappingDigest||!event.bindingDigest||!event.submittedAt||event.outcome!=='review'||!['open','held'].includes(event.reviewState))throw new ScanReviewError('review_conflict');
    if(!purchase||!binding||purchase.status!=='succeeded'||purchase.typeformCompleted!=='false'||purchase.typeformCompletedAt||purchase.dashboardSent!=='false'||binding.isActive!=='true'||binding.expiresAt<=now()||binding.formId!==event.formId||binding.referenceDigest!==event.bindingDigest||binding.completedDigest||(binding.responseId&&binding.responseId!==event.responseId))throw new ScanReviewError('review_evidence_required');
    const evidence=scanAssignmentEvidence.parse({reference:input.mutationId,eventId,purchaseId:purchase.id,formId:event.formId,responseId:event.responseId,payloadDigest:event.payloadDigest,responseDigest:event.responseDigest,bindingDigest:event.bindingDigest,mappingDigest:event.mappingDigest,participantRef:input.participantRef,recipientEmail:input.recipientEmail.toLowerCase(),assignmentEvidenceRef:input.assignmentEvidenceRef,recipientEvidenceRef:input.recipientEvidenceRef,recordedAt:now().toISOString()});
    await tx.insert(assignments).values({reference:input.mutationId,eventId,actorId:actor.id,evidence,requestDigest});
    await tx.insert(auditLogs).values({userEmail:actor.email,actionType:'scan_assignment_attested',resource:'scan_service_review',details:{actorId:actor.id,returnedRows:1},ipAddress:null});
    return{reference:input.mutationId,replayed:false,completion:'not_applied',identity:'human_attestation_only'};
   });
  },
 };
}
