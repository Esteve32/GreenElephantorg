import { createHash,createHmac,randomUUID,timingSafeEqual } from 'node:crypto';
import { and,asc,desc,eq,sql } from 'drizzle-orm';
import type { db } from './db';
import { privacyWorkflowRecords as records,privacyWorkflowEvents as events,contacts,adminSettings,adminUsers,auditLogs } from '@shared/schema';
import { caseIntake,caseAction,noticeInput,notificationSettings,retentionInput,monthReviewTarget,type PrivacyKind } from '@shared/privacy-workflows';
import type { PrivacyAdminIdentity } from './privacy-admin-access';
import { operationKey,normalizeEmail } from './delivery-security';
import { canonicalJson } from './typeform-content';
export class PrivacyWorkflowError extends Error {constructor(public code:'conflict'|'not_found'|'invalid'|'unavailable'|'access_required'){super('privacy_'+code);}}
export const privacyHash=(x:unknown)=>createHash('sha256').update(canonicalJson(x)).digest('hex');
type Database=Pick<typeof db,'transaction'>;
type Tx=Parameters<Parameters<Database['transaction']>[0]>[0];
type Row=typeof records.$inferSelect;
const view=(r:Row)=>({...r,updatedAt:r.updatedAt.toISOString()});
const requireKey=(key:Buffer|undefined)=>{if(!key||key.length<32)throw new PrivacyWorkflowError('unavailable');return key;};
export const confirmationToken=(challenge:string,key:Buffer)=>createHmac('sha256',requireKey(key)).update('privacy-confirmation-v1:'+challenge).digest('base64url');
const same=(a:string,b:string)=>a.length===b.length&&timingSafeEqual(Buffer.from(a),Buffer.from(b));
export async function recordWorkflowWithdrawal(tx:Tx,contactId:string,now:Date) {
 const scope=operationKey('privacy-consent',contactId);
 await tx.insert(records).values({kind:'consent',scopeKey:scope,subjectId:contactId,data:{},version:0}).onConflictDoNothing();
 const [row]=await tx.select().from(records).where(and(eq(records.kind,'consent'),eq(records.scopeKey,scope))).for('update');
 if(row.data.state==='withdrawn')return;
 const version=row.version+1;
 await tx.update(records).set({version,data:{state:'withdrawn',purpose:'marketing_updates',noticeId:row.data.noticeId??null,withdrawnAt:now.toISOString()},updatedAt:now}).where(eq(records.id,row.id));
 await tx.insert(events).values({recordId:row.id,mutationId:randomUUID(),requestDigest:privacyHash({id:row.id,version,action:'withdrawn'}),version,action:'withdrawn',actorId:'subject:preference-link',evidence:{purpose:'marketing_updates',noticeId:row.data.noticeId??null,source:'signed_preference_link'}});
}
export function createPrivacyWorkflowStore(database:Database,options:{ownerEmail():string|undefined;confirmationKey?():Buffer|undefined;now?():Date}) {
 const now=()=>options.now?.()??new Date();
 async function actor(tx:Tx,a:PrivacyAdminIdentity) {
  const [u]=await tx.select().from(adminUsers).where(eq(adminUsers.id,a.id)).for('share');
  if(!u||u.isActive!=='true'||u.googleId!==a.googleId||u.email!==a.email||u.role!==a.role||!['admin','super_admin'].includes(u.role))throw new PrivacyWorkflowError('access_required');
 }
 async function audit(tx:Tx,a:PrivacyAdminIdentity,action:string,count:number){await tx.insert(auditLogs).values({userEmail:a.email,actionType:'privacy_'+action,resource:'/admin/ropa',details:{actorId:a.id,returnedRows:count},ipAddress:null});}
 async function lock(tx:Tx,kind:PrivacyKind,scopeKey:string,subjectId?:string):Promise<Row>{
  await tx.insert(records).values({kind,scopeKey,subjectId:subjectId??null,data:{},version:0}).onConflictDoNothing();
  const [r]=await tx.select().from(records).where(and(eq(records.kind,kind),eq(records.scopeKey,scopeKey))).for('update');return r;
 }
 async function write(tx:Tx,row:Row,action:string,input:Record<string,any>,actorId:string,data:Record<string,unknown>,evidence:Record<string,unknown>={}){
  const digest=privacyHash({recordId:row.id,action,input,actorId});
  const [prior]=await tx.select().from(events).where(eq(events.mutationId,input.mutationId));
  if(prior){if(prior.recordId!==row.id||prior.requestDigest!==digest||prior.actorId!==actorId)throw new PrivacyWorkflowError('conflict');return{record:view(row),version:prior.version,replayed:true};}
  if(input.expectedVersion!==undefined&&input.expectedVersion!==row.version)throw new PrivacyWorkflowError('conflict');
  const version=row.version+1;
  const [saved]=await tx.update(records).set({data,version,updatedAt:now()}).where(eq(records.id,row.id)).returning();
  await tx.insert(events).values({recordId:row.id,mutationId:input.mutationId,requestDigest:digest,version,action,actorId,evidence});
  return{record:view(saved),version,replayed:false};
 }
 async function notice(tx:Tx,id:string){const [n]=await tx.select().from(records).where(and(eq(records.id,id),eq(records.kind,'notice')));if(!n||n.data.published!==true)throw new PrivacyWorkflowError('invalid');return n;}
 async function activeNotice(tx:Tx,id:string){const n=await notice(tx,id);const [p]=await tx.select().from(records).where(and(eq(records.kind,'configuration'),eq(records.scopeKey,'notice:marketing_updates'))).for('share');if(p?.data.noticeId!==n.id)throw new PrivacyWorkflowError('conflict');return n;}
 async function queue(tx:Tx,key:string,data:Record<string,unknown>){await tx.insert(records).values({kind:'attention',scopeKey:key,data:{...data,state:'pending_approval',attempts:0}}).onConflictDoNothing();}
 async function ownerId(tx:Tx){const email=options.ownerEmail()?.trim().toLowerCase();if(!email)return null;const [u]=await tx.select().from(adminUsers).where(eq(adminUsers.email,email));return u?.isActive==='true'&&u.googleId&&u.role==='super_admin'?u.id:null;}
 return {
  async list(a:PrivacyAdminIdentity,kind:PrivacyKind,after?:string){return database.transaction(async tx=>{await actor(tx,a);const rows=await tx.select().from(records).where(and(eq(records.kind,kind),after?sql`${records.id}>${after}`:undefined)).orderBy(asc(records.id)).limit(26);await audit(tx,a,'list_'+kind,Math.min(rows.length,25));return{records:rows.slice(0,25).map(view),nextCursor:rows.length>25?rows[24].id:null};});},
  async detail(a:PrivacyAdminIdentity,id:string){return database.transaction(async tx=>{await actor(tx,a);const [r]=await tx.select().from(records).where(eq(records.id,id));if(!r)throw new PrivacyWorkflowError('not_found');const history=await tx.select().from(events).where(eq(events.recordId,id)).orderBy(desc(events.version)).limit(100);await audit(tx,a,'detail',1);return{record:view(r),history:history.map(h=>({...h,recordedAt:h.recordedAt.toISOString()})),historyTruncated:history.length===100};});},
  async lookup(a:PrivacyAdminIdentity,email:string){return database.transaction(async tx=>{await actor(tx,a);const [c]=await tx.select({id:contacts.id}).from(contacts).where(eq(contacts.email,normalizeEmail(email)));const rows=c?await tx.select().from(records).where(eq(records.subjectId,c.id)).orderBy(desc(records.updatedAt)).limit(100):[];await audit(tx,a,'subject_lookup',rows.length);return{subjectId:c?.id??null,records:rows.map(view),truncated:rows.length===100};});},
  async publishNotice(a:PrivacyAdminIdentity,value:unknown){const input=noticeInput.parse(value);return database.transaction(async tx=>{await actor(tx,a);if(a.email.toLowerCase()!==options.ownerEmail()?.toLowerCase())throw new PrivacyWorkflowError('access_required');const ptr=await lock(tx,'configuration','notice:marketing_updates');const r=await lock(tx,'notice',input.purpose+':'+input.noticeVersion);if(r.version>0){const [prior]=await tx.select().from(events).where(eq(events.mutationId,input.mutationId));if(!prior)throw new PrivacyWorkflowError('conflict');}
   const result=await write(tx,r,'notice_published',input,a.id,{purpose:input.purpose,noticeVersion:input.noticeVersion,english:input.english,french:input.french,reviewRef:input.reviewRef,published:true,publishedAt:now().toISOString()},{purpose:input.purpose,noticeVersion:input.noticeVersion,reviewRef:input.reviewRef});
   if(!result.replayed)await tx.update(records).set({data:{noticeId:r.id},version:ptr.version+1,updatedAt:now()}).where(eq(records.id,ptr.id));await audit(tx,a,'notice_publish',1);return result;
  });},
  async publicNotice(){return database.transaction(async tx=>{const [p]=await tx.select().from(records).where(and(eq(records.kind,'configuration'),eq(records.scopeKey,'notice:marketing_updates')));if(!p?.data.noticeId)throw new PrivacyWorkflowError('unavailable');const n=await notice(tx,String(p.data.noticeId));return{id:n.id,purpose:n.data.purpose,version:n.data.noticeVersion,english:n.data.english,french:n.data.french};});},
  async requestSubscription(value:{email:string;name?:string;noticeId:string;mutationId:string}){
   const key=requireKey(options.confirmationKey?.());const email=normalizeEmail(value.email);
   return database.transaction(async tx=>{const n=await activeNotice(tx,value.noticeId);await tx.insert(contacts).values({email,name:value.name??null,consentGiven:'false',consentText:String(n.data.english),source:'newsletter'}).onConflictDoNothing();const [c]=await tx.select().from(contacts).where(eq(contacts.email,email)).for('update');
    const r=await lock(tx,'consent',operationKey('privacy-consent',c.id),c.id);const priorId=r.data.challengeId;
    const [prior]=await tx.select().from(events).where(eq(events.mutationId,value.mutationId));
    if(prior){if(prior.recordId!==r.id||prior.requestDigest!==privacyHash({recordId:r.id,action:'pending',input:{noticeId:value.noticeId,mutationId:value.mutationId},actorId:'subject:request'}))throw new PrivacyWorkflowError('conflict');return;}
    if(r.data.state==='confirmed'&&r.data.noticeId===n.id)return;
    // Repeated signup while the same fresh challenge is pending cannot spam mail.
    if(r.data.state==='pending'&&r.data.noticeId===n.id&&Number(r.data.expiresAtMs)>now().getTime())return;
    const challenge=value.mutationId,token=confirmationToken(challenge,key);
    const data={state:'pending',purpose:'marketing_updates',noticeId:n.id,challengeId:challenge,challengeHash:privacyHash(token),requestedAt:now().toISOString(),expiresAtMs:now().getTime()+24*3600000,previousChallenge:typeof priorId==='string'?privacyHash(priorId):null};
    await write(tx,r,'pending',{noticeId:value.noticeId,mutationId:value.mutationId},'subject:request',data,{noticeId:n.id,source:'website',state:'pending'});
    await queue(tx,'confirm:'+challenge,{kind:'confirmation',consentId:r.id,challengeId:challenge,subjectId:c.id,noticeId:n.id});
   });
  },
  async confirm(challenge:string,token:string){return database.transaction(async tx=>{
   const hint=await tx.select().from(records).where(and(eq(records.kind,'consent'),sql`${records.data}->>'challengeId'=${challenge}`)).limit(2);if(hint.length!==1||!hint[0].subjectId)throw new PrivacyWorkflowError('invalid');
   const [c]=await tx.select().from(contacts).where(eq(contacts.id,hint[0].subjectId)).for('update');if(!c)throw new PrivacyWorkflowError('invalid');
   const r=await lock(tx,'consent',hint[0].scopeKey,c.id);
   if(r.data.challengeId!==challenge||typeof r.data.challengeHash!=='string'||!same(privacyHash(token),r.data.challengeHash)||Number(r.data.expiresAtMs)<=now().getTime())throw new PrivacyWorkflowError('invalid');
   await activeNotice(tx,String(r.data.noticeId));
   if(r.data.state==='confirmed')return{confirmed:true,replayed:true};if(r.data.state!=='pending')throw new PrivacyWorkflowError('conflict');
   await write(tx,r,'confirmed',{mutationId:randomUUID()},'subject:confirmation',{...r.data,state:'confirmed',confirmedAt:now().toISOString()},{noticeId:r.data.noticeId,source:'email_address_confirmation',state:'confirmed'});
   await tx.delete(adminSettings).where(eq(adminSettings.key,operationKey('marketing-suppressed',c.id)));
   await tx.update(contacts).set({consentGiven:'true',consentText:String((await notice(tx,String(r.data.noticeId))).data.english),consentedAt:now()}).where(eq(contacts.id,c.id));return{confirmed:true,replayed:false};
  });},
  async refuse(challenge:string,token:string){return database.transaction(async tx=>{
   const hint=await tx.select().from(records).where(and(eq(records.kind,'consent'),sql`${records.data}->>'challengeId'=${challenge}`)).limit(2);if(hint.length!==1||!hint[0].subjectId)throw new PrivacyWorkflowError('invalid');
   const [contact]=await tx.select().from(contacts).where(eq(contacts.id,hint[0].subjectId)).for('update');if(!contact)throw new PrivacyWorkflowError('invalid');const r=await lock(tx,'consent',hint[0].scopeKey,contact.id);
   if(r.data.state!=='pending'||r.data.challengeId!==challenge||typeof r.data.challengeHash!=='string'||!same(privacyHash(token),r.data.challengeHash)||Number(r.data.expiresAtMs)<=now().getTime())throw new PrivacyWorkflowError('conflict');
   await write(tx,r,'refused',{mutationId:randomUUID()},'subject:confirmation',{state:'refused',purpose:'marketing_updates',noticeId:r.data.noticeId,refusedAt:now().toISOString()},{noticeId:r.data.noticeId,source:'signed_confirmation_choice',state:'refused'});await tx.update(contacts).set({consentGiven:'false'}).where(eq(contacts.id,contact.id));return{refused:true};
  });},
  async intakeCase(value:unknown,operator?:PrivacyAdminIdentity){const input=caseIntake.parse(value);const received=new Date(input.receivedAt);if(received.getTime()>now().getTime()+300000)throw new PrivacyWorkflowError('invalid');return database.transaction(async tx=>{
   if(input.source==='operator'){if(!operator)throw new PrivacyWorkflowError('access_required');await actor(tx,operator);}
   const scope=privacyHash({source:input.source,id:input.sourceId}),r=await lock(tx,'case',scope,input.subjectId);
   if(r.version>0){if(r.data.intakeDigest!==privacyHash({...input,mutationId:null}))throw new PrivacyWorkflowError('conflict');return{caseId:r.id,replayed:true};}
   const responsible=await ownerId(tx);const data={intakeDigest:privacyHash({...input,mutationId:null}),source:input.source,sourceDigest:scope,receivedAt:received.toISOString(),reviewTarget:monthReviewTarget(received).toISOString(),ownerId:responsible,kind:input.kind,state:'open',identity:'not_verified',hold:false,correspondenceRef:input.correspondenceRef??null,outcomes:[]};
   await write(tx,r,'case_received',input,operator?.id??'system:'+input.source,data,{source:input.source,kind:input.kind});await queue(tx,'case:'+r.id+':1',{kind:'privacy_attention',caseId:r.id,caseVersion:1,reason:'new_case'});if(operator)await audit(tx,operator,'case_intake',1);return{caseId:r.id,replayed:false};
  });},
  async caseAction(a:PrivacyAdminIdentity,id:string,value:unknown){const input=caseAction.parse(value);return database.transaction(async tx=>{await actor(tx,a);const [r]=await tx.select().from(records).where(and(eq(records.id,id),eq(records.kind,'case'))).for('update');if(!r)throw new PrivacyWorkflowError('not_found');const d={...r.data};
   const prior=await tx.select().from(events).where(eq(events.mutationId,input.mutationId));if(!prior.length){
    if(input.action==='verify_identity'){if(!input.receiptRef)throw new PrivacyWorkflowError('invalid');d.identity='reviewed';d.identityEvidenceRef=input.receiptRef;}
    else if(input.action==='hold'){d.hold=true;d.state='held';}
    else if(input.action==='start_review'){d.state='reviewing';}
    else if(input.action==='await_information'){d.state='awaiting_information';}
    else if(input.action==='extend_deadline'){if(!input.deadline||!input.receiptRef||Date.parse(input.deadline)<=Date.parse(String(d.reviewTarget)))throw new PrivacyWorkflowError('invalid');d.reviewTarget=input.deadline;d.extensionNoticeRef=input.receiptRef;}
    else if(input.action==='record_outcome'){if(!input.receiptRef||d.identity!=='reviewed')throw new PrivacyWorkflowError('invalid');d.outcomes=[...(Array.isArray(d.outcomes)?d.outcomes:[]),input.receiptRef].slice(-100);}
    else if(input.action==='resolve'){if(d.hold===true||d.identity!=='reviewed'||!Array.isArray(d.outcomes)||!d.outcomes.length)throw new PrivacyWorkflowError('conflict');d.state='resolved';d.closedAt=now().toISOString();}
    else {d.state='open';d.hold=false;}
   }
   const result=await write(tx,r,input.action,input,a.id,d,{reason:input.reason,receiptRef:input.receiptRef??null});
   if(!result.replayed&&input.action==='reopen')await queue(tx,'case:'+id+':'+result.version,{kind:'privacy_attention',caseId:id,caseVersion:result.version,reason:'needs_review'});await audit(tx,a,'case_action',1);return result;
  });},
  async saveNotifications(a:PrivacyAdminIdentity,value:unknown){const input=notificationSettings.parse(value);return database.transaction(async tx=>{await actor(tx,a);if(a.email.toLowerCase()!==options.ownerEmail()?.toLowerCase())throw new PrivacyWorkflowError('access_required');const r=await lock(tx,'configuration','notifications');const result=await write(tx,r,'notification_settings',input,a.id,{...input,individualRoutineEnabled:false},{reviewRef:input.reviewRef});await audit(tx,a,'notification_settings',1);return result;});},
  async saveRetention(a:PrivacyAdminIdentity,value:unknown){const input=retentionInput.parse(value);return database.transaction(async tx=>{await actor(tx,a);if(a.email.toLowerCase()!==options.ownerEmail()?.toLowerCase())throw new PrivacyWorkflowError('access_required');const r=await lock(tx,'retention',input.scope);const result=await write(tx,r,'retention_rule',input,a.id,{scope:input.scope,days:input.days,purpose:input.purpose,reviewRef:input.reviewRef},{reviewRef:input.reviewRef});await audit(tx,a,'retention_rule',1);return result;});},
  async beginRecovery(a:PrivacyAdminIdentity,input:{mutationId:string;reason:string}){return database.transaction(async tx=>{await actor(tx,a);if(a.email.toLowerCase()!==options.ownerEmail()?.toLowerCase())throw new PrivacyWorkflowError('access_required');const r=await lock(tx,'recovery','processing_hold');const result=await write(tx,r,'recovery_hold',input,a.id,{hold:true,startedAt:now().toISOString(),reason:input.reason},{reason:input.reason});await audit(tx,a,'recovery_hold',1);return result;});},
 };
}
export type PrivacyWorkflowStore=ReturnType<typeof createPrivacyWorkflowStore>;
