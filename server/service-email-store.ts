import { and,eq,or,desc,sql } from 'drizzle-orm';
import type { db } from './db';
import { serviceEmailControl,serviceEmailJobs,serviceEmailReceipts,privacyWorkflowRecords,auditLogs } from '@shared/schema';
import { initialServiceControls,type ServiceEmailRepository,type ServiceTransaction } from './service-email';
/** One short global row lock serializes claims, quotas and receipt reconciliation across Replit instances. */
export function createServiceEmailRepository(database:Pick<typeof db,'transaction'>):ServiceEmailRepository{
 return {atomic:(work,scope)=>database.transaction(async tx=>{
  await tx.insert(serviceEmailControl).values({id:'service',data:initialServiceControls()}).onConflictDoNothing();
  const [control]=await tx.select().from(serviceEmailControl).where(eq(serviceEmailControl.id,'service')).for('update');
  const jobs=scope?.jobId?await tx.select().from(serviceEmailJobs).where(scope.providerId?or(eq(serviceEmailJobs.id,scope.jobId),eq(serviceEmailJobs.providerId,scope.providerId)):eq(serviceEmailJobs.id,scope.jobId)):
   await tx.select().from(serviceEmailJobs).orderBy(sql`case when ${serviceEmailJobs.data}->>'state'='approved' then 0 else 1 end`,desc(serviceEmailJobs.data)).limit(100);
  const receipts=scope?.receiptId?await tx.select().from(serviceEmailReceipts).where(eq(serviceEmailReceipts.id,scope.receiptId)):[];
  const beforeControl=control.data.version,beforeJobs=new Map(jobs.map(r=>[r.id,JSON.stringify(r.data)])),beforeReceipts=new Map(receipts.map(r=>[r.id,JSON.stringify(r.data)]));
  const [recovery]=await tx.select().from(privacyWorkflowRecords).where(and(eq(privacyWorkflowRecords.kind,'recovery'),eq(privacyWorkflowRecords.scopeKey,'processing_hold'))).for('share');
  const state:ServiceTransaction={controls:control.data,jobs:jobs.map(r=>r.data),receipts:receipts.map(r=>r.data),recoveryHeld:recovery?.data.hold===true};
  const result=await work(state);
  for(const j of state.jobs)if(JSON.stringify(j)!==beforeJobs.get(j.id)){
   await tx.insert(serviceEmailJobs).values({id:j.id,providerId:j.providerId??null,data:j}).onConflictDoUpdate({target:serviceEmailJobs.id,set:{data:j,providerId:j.providerId??null}});
   await tx.insert(auditLogs).values({userEmail:'service-email-system',actionType:'service_email_'+j.state,resource:'service_email',details:{actorRef:j.lastActor,approvalRef:j.approvedBy,jobId:j.id,version:j.version,reason:j.reason},ipAddress:null});
  }
  for(const r of state.receipts)if(!beforeReceipts.has(r.id))await tx.insert(serviceEmailReceipts).values({id:r.id,data:r});
  await tx.update(serviceEmailControl).set({data:state.controls}).where(eq(serviceEmailControl.id,'service'));
  if(state.controls.version!==beforeControl)await tx.insert(auditLogs).values({userEmail:'service-email-system',actionType:'service_email_controls',resource:'service_email',details:{actorRef:state.controls.updatedBy,version:state.controls.version,paused:state.controls.paused},ipAddress:null});
  return result;
 })};
}
