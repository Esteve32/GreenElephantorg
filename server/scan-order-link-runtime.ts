import type { db } from './db';
import type { SatellitescanPurchase } from '@shared/schema';
import { scanTypeformBindings as bindings,scanTypeformEvents as events } from '@shared/schema';
import { and,eq,ne } from 'drizzle-orm';
import { INDIVIDUAL_SCAN_MAPPING } from './typeform-mapping';
import { createScanTypeformReferencePreparer,ScanTypeformReferenceError } from './scan-typeform-reference';
/** No policy duration, key or activation default. Retries use original purchase time. */
export function createConfiguredScanReference(database:Pick<typeof db,'transaction'>,env:()=>NodeJS.ProcessEnv){
 return async(purchase:SatellitescanPurchase)=>{
  const e=env();if(e.TYPEFORM_ORDER_LINKS_ENABLED===undefined||e.TYPEFORM_ORDER_LINKS_ENABLED==='false')return undefined;
  const key=e.TYPEFORM_ORDER_REFERENCE_KEY,hours=e.TYPEFORM_ORDER_REFERENCE_TTL_HOURS;
  if(e.TYPEFORM_ORDER_LINKS_ENABLED!=='true'||e.TYPEFORM_ORDER_INTAKE_ENABLED!=='true'||e.TYPEFORM_FORM_ID!==INDIVIDUAL_SCAN_MAPPING.formId||!key||!/^[a-fA-F0-9]{64}$/.test(key)||!e.TYPEFORM_EVIDENCE_KEY||!/^[a-fA-F0-9]{64}$/.test(e.TYPEFORM_EVIDENCE_KEY)||key.toLowerCase()===e.TYPEFORM_EVIDENCE_KEY.toLowerCase()||!e.TYPEFORM_EVIDENCE_KEY_ID||!/^[A-Za-z0-9_-]{1,64}$/.test(e.TYPEFORM_EVIDENCE_KEY_ID)||!e.TYPEFORM_WEBHOOK_SECRET||key===e.TYPEFORM_WEBHOOK_SECRET||!hours||!/^\d+$/.test(hours)||Number(hours)<1||Number(hours)>87600)throw new ScanTypeformReferenceError('configuration_required');
  const expiresAt=new Date(purchase.createdAt.getTime()+Number(hours)*3600000);
  const prepared=await createScanTypeformReferencePreparer(database,{key:Buffer.from(key,'hex'),formId:INDIVIDUAL_SCAN_MAPPING.formId,bindingField:INDIVIDUAL_SCAN_MAPPING.bindingField})(purchase.id,expiresAt);
  return prepared.reference;
 };
}
/** A qualifying final receipt awaiting assignment pauses its reminder, not identity review. */
export async function hasScanSubmissionAwaitingReview(database:Pick<typeof db,'transaction'>,purchaseId:string){
 return database.transaction(async tx=>{
  const rows=await tx.select({id:events.eventId}).from(events).innerJoin(bindings,and(eq(events.bindingDigest,bindings.referenceDigest),eq(events.formId,bindings.formId))).where(and(eq(bindings.purchaseId,purchaseId),eq(events.eventType,'form_response'),eq(events.completionVerified,'true'),ne(events.reviewState,'rejected'))).limit(1);
  return rows.length>0;
 });
}
