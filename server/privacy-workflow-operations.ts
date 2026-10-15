import { randomUUID } from 'node:crypto';
import { and,eq,sql } from 'drizzle-orm';
import type { db } from './db';
import { privacyWorkflowRecords as records,privacyWorkflowEvents as events,contacts,adminUsers,auditLogs } from '@shared/schema';
import type { PrivacyAdminIdentity } from './privacy-admin-access';
import { PrivacyWorkflowError,privacyHash,confirmationToken } from './privacy-workflow-store';
import { escapeEmailHtml } from './scan-results-email';
export interface PrivacyMailConfiguration {from:string;replyTo:string;aliases:string[];traceCc:string[];origin:string;confirmationKey:Buffer;weeklyRecipients?:Record<string,string|undefined>;}
export interface PrivacyEnvelope {from:string;replyTo:string;to:string[];cc:string[];subject:string;text:string;html:string;}
export function privacyEnvelope(kind:'privacy_attention'|'confirmation'|'weekly_digest',config:PrivacyMailConfiguration,details?:{email?:string;challengeId?:string;counts?:Record<string,number>}):PrivacyEnvelope {
 if(!config.from||/[\r\n]/.test(config.from)||!config.replyTo||!config.traceCc.map(x=>x.toLowerCase()).includes('email@estevepannetier.com')||[...config.aliases,...config.traceCc,config.replyTo].some(s=>!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)))throw new PrivacyWorkflowError('unavailable');
 const origin=new URL(config.origin);if(origin.protocol!=='https:'&&!(origin.protocol==='http:'&&origin.hostname==='127.0.0.1'))throw new PrivacyWorkflowError('unavailable');
 let to:string[],subject:string,text:string;
 if(kind==='confirmation'){
  if(!details?.email||!details.challengeId)throw new PrivacyWorkflowError('invalid');
  const url=new URL('/api/email/confirm-subscription',origin);url.searchParams.set('challenge',details.challengeId);url.searchParams.set('token',confirmationToken(details.challengeId,config.confirmationKey));
  to=[details.email];subject='Confirm Green Elephant updates / Confirmer les actualités';
  text='You asked for optional Green Elephant updates. Confirm only if this was your choice. This does not change your purchased service. / Vous avez demandé les actualités facultatives. Confirmez uniquement si c’est votre choix. Votre achat reste inchangé.\n\n'+url.href+'\n\nIf you did not ask, ignore this message. / Si vous n’avez rien demandé, ignorez ce message.';
 }else{
  if(kind==='privacy_attention'&&(config.aliases.length!==2||new Set(config.aliases).size!==2))throw new PrivacyWorkflowError('unavailable');
  to=config.aliases;subject=kind==='privacy_attention'?'Privacy work needs review / Demande de confidentialité à examiner':'Weekly admin summary / Résumé administratif hebdomadaire';
  text=kind==='privacy_attention'?'A privacy matter needs your review. Sign in with your approved privacy account. This message contains no case details. / Une demande nécessite votre examen. Connectez-vous avec votre compte autorisé. Aucun détail privé ne figure dans ce message.':'Outstanding work / Travail en attente:\n'+Object.entries(details?.counts??{}).sort().map(([k,v])=>k+': '+v).join('\n');
  text+='\n\n'+new URL('/admin/ropa',origin).href;
 }
 return{from:config.from,replyTo:config.replyTo,to,cc:config.traceCc,subject,text,html:'<div lang="en" style="font-family:Arial,sans-serif;line-height:1.7;background:#0a0a0a;color:#eeeeee;padding:24px"><h1>'+escapeEmailHtml(subject)+'</h1><p style="white-space:pre-wrap">'+escapeEmailHtml(text)+'</p></div>'};
}
/** Most recent weekly wall-clock occurrence; one key across restarts and DST. */
export function weeklyOccurrence(now:Date,config:{timeZone:string;weekday:number;hour:number;minute:number}):string {
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:config.timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).map(p=>[p.type,p.value]));
 const date=new Date(Date.UTC(Number(parts.year),Number(parts.month)-1,Number(parts.day)));
 let days=(date.getUTCDay()-config.weekday+7)%7;if(days===0&&(Number(parts.hour)*60+Number(parts.minute))<config.hour*60+config.minute)days=7;
 date.setUTCDate(date.getUTCDate()-days);return date.toISOString().slice(0,10)+':'+config.timeZone+':'+config.hour+':'+config.minute;
}
type Database=Pick<typeof db,'transaction'>;
export function createPrivacyOperations(database:Database,options:{ownerEmail():string|undefined;mailConfiguration():Promise<PrivacyMailConfiguration>;now?():Date}) {
 const now=()=>options.now?.()??new Date();
 type Tx=Parameters<Parameters<Database['transaction']>[0]>[0];
 async function auth(tx:Tx,a:PrivacyAdminIdentity,owner=false){const [u]=await tx.select().from(adminUsers).where(eq(adminUsers.id,a.id)).for('share');if(!u||u.email!==a.email||u.googleId!==a.googleId||u.isActive!=='true'||u.role!==a.role||!['admin','super_admin'].includes(u.role)||(owner&&u.email.toLowerCase()!==options.ownerEmail()?.toLowerCase()))throw new PrivacyWorkflowError('access_required');}
 async function event(tx:Tx,r:typeof records.$inferSelect,action:string,data:Record<string,unknown>,actorId:string,evidence:Record<string,unknown>={}){const version=r.version+1;await tx.update(records).set({data,version,updatedAt:now()}).where(eq(records.id,r.id));await tx.insert(events).values({recordId:r.id,version,action,actorId,mutationId:randomUUID(),requestDigest:privacyHash({id:r.id,version,action}),evidence});}
 async function envelope(tx:Tx,r:typeof records.$inferSelect,config:PrivacyMailConfiguration){
  if(r.kind!=='attention')throw new PrivacyWorkflowError('invalid');
  if(r.data.kind==='confirmation'){
   const [state]=await tx.select().from(records).where(eq(records.id,String(r.data.consentId)));
   const [contact]=state?.subjectId?await tx.select().from(contacts).where(eq(contacts.id,state.subjectId)):[];
   if(!contact||state.data.state!=='pending'||state.data.challengeId!==r.data.challengeId||Number(state.data.expiresAtMs)<=now().getTime())throw new PrivacyWorkflowError('conflict');
   return privacyEnvelope('confirmation',config,{email:contact.email,challengeId:String(r.data.challengeId)});
  }
  if(r.data.kind==='weekly_digest'){const refs=r.data.recipientRefs as string[];const recipients=refs?.map(ref=>config.weeklyRecipients?.[ref]);if(!recipients?.length||recipients.some(x=>!x))throw new PrivacyWorkflowError('unavailable');return privacyEnvelope('weekly_digest',{...config,aliases:recipients as string[]},{counts:r.data.counts as Record<string,number>|undefined});}
  if(r.data.kind!=='privacy_attention')throw new PrivacyWorkflowError('invalid');
  return privacyEnvelope('privacy_attention',config);
 }
 return {
  async preview(a:PrivacyAdminIdentity,id:string){const config=await options.mailConfiguration();return database.transaction(async tx=>{await auth(tx,a);const [r]=await tx.select().from(records).where(eq(records.id,id));if(!r)throw new PrivacyWorkflowError('not_found');const draft=await envelope(tx,r,config);await tx.insert(auditLogs).values({userEmail:a.email,actionType:'privacy_draft_preview',resource:'/admin/ropa',details:{actorId:a.id,returnedRows:1},ipAddress:null});return{recordId:id,version:r.version,envelope:draft,fingerprint:privacyHash(draft),approval:'not_approved',delivery:'not_attempted'};});},
  async approve(a:PrivacyAdminIdentity,id:string,input:{expectedVersion:number;fingerprint:string;reviewRef:string}){const config=await options.mailConfiguration();return database.transaction(async tx=>{await auth(tx,a,true);const [r]=await tx.select().from(records).where(eq(records.id,id)).for('update');if(!r||r.kind!=='attention')throw new PrivacyWorkflowError('not_found');if(r.version!==input.expectedVersion||!['pending_approval','approved'].includes(String(r.data.state)))throw new PrivacyWorkflowError('conflict');const hash=privacyHash(await envelope(tx,r,config));if(hash!==input.fingerprint||input.reviewRef.trim().length<3)throw new PrivacyWorkflowError('conflict');await event(tx,r,'message_approved',{...r.data,state:'approved',approvedFingerprint:hash,approvedBy:a.id,approvedAt:now().toISOString(),reviewRef:input.reviewRef},a.id,{fingerprint:hash,reviewRef:input.reviewRef});return{approved:true};});},
  async dispatch(id:string,send:(draft:PrivacyEnvelope,idempotencyKey:string)=>Promise<{providerId:string}>,enabled:boolean){
   if(!enabled)return{state:'disabled'};const config=await options.mailConfiguration();
   const claim=await database.transaction(async tx=>{const [r]=await tx.select().from(records).where(eq(records.id,id)).for('update');if(!r||r.kind!=='attention')throw new PrivacyWorkflowError('not_found');
    if(['accepted','delivered','bounced','complained','unknown','submitting','cancelled'].includes(String(r.data.state)))return null;
    const draft=await envelope(tx,r,config),fingerprint=privacyHash(draft);
    const approved=r.data.state==='approved'&&r.data.approvedFingerprint===fingerprint;
    const [profile]=await tx.select().from(records).where(and(eq(records.kind,'configuration'),eq(records.scopeKey,'attention_approval')));
    const exactStatic=r.data.kind==='privacy_attention'&&profile?.data.fingerprint===fingerprint;
    if(!approved&&!exactStatic)return null;
    const [hold]=await tx.select().from(records).where(and(eq(records.kind,'recovery'),eq(records.scopeKey,'processing_hold')));if(hold?.data.hold===true&&r.data.kind!=='privacy_attention')return null;
    await event(tx,r,'mail_submission_started',{...r.data,state:'submitting',submittedFingerprint:fingerprint,attempts:Number(r.data.attempts??0)+1,attemptedAt:now().toISOString()},'system:privacy-worker',{fingerprint});return{draft,fingerprint};
   });
   if(!claim)return{state:'held'};
   let providerId:string|null=null;try{const response=await send(claim.draft,'privacy:'+id);if(typeof response.providerId==='string'&&/^[A-Za-z0-9_-]{1,100}$/.test(response.providerId))providerId=response.providerId;}catch{/* Unknown acceptance must be reconciled; never blindly resubmit. */}
   await database.transaction(async tx=>{const [r]=await tx.select().from(records).where(eq(records.id,id)).for('update');if(r.data.state!=='submitting'||r.data.submittedFingerprint!==claim.fingerprint)throw new PrivacyWorkflowError('conflict');await event(tx,r,providerId?'mail_accepted':'mail_acceptance_unknown',{...r.data,state:providerId?'accepted':'unknown',providerId,delivery:'unverified'},'system:privacy-worker',{providerId});});
   return{state:providerId?'accepted':'unknown'};
  },
  async recordDelivery(providerId:string,eventId:string,status:'delivered'|'bounced'|'complained'){return database.transaction(async tx=>{const rows=await tx.select().from(records).where(and(eq(records.kind,'attention'),sql`${records.data}->>'providerId'=${providerId}`)).limit(2);if(rows.length!==1)throw new PrivacyWorkflowError('not_found');const [r]=await tx.select().from(records).where(eq(records.id,rows[0].id)).for('update');const receipt=privacyHash({eventId,providerId});const [prior]=await tx.select().from(records).where(and(eq(records.kind,'connector'),eq(records.scopeKey,'resend:'+receipt)));if(prior)return;
   await tx.insert(records).values({kind:'connector',scopeKey:'resend:'+receipt,data:{status,receivedAt:now().toISOString()}});const previous=String(r.data.state);const severity={accepted:0,delivered:1,bounced:2,complained:3} as Record<string,number>;if((severity[status]??0)>=(severity[previous]??0))await event(tx,r,'mail_delivery_receipt',{...r.data,state:status,delivery:status},'system:verified-resend-webhook',{eventDigest:receipt,status});
  });},
  async tick(){return database.transaction(async tx=>{
   const [config]=await tx.select().from(records).where(and(eq(records.kind,'configuration'),eq(records.scopeKey,'notifications'))).for('share');
   if(config?.data.weeklyEnabled===true){const c=config.data as any,key=weeklyOccurrence(now(),c);const start=weeklyOccurrence(config.updatedAt,c);if(key>start){
    const countRows=await tx.select({kind:records.kind,count:sql<number>`count(*)::int`}).from(records).where(sql`${records.kind} in ('case','attention') and coalesce(${records.data}->>'state','') not in ('resolved','accepted','delivered','cancelled')`).groupBy(records.kind);
    await tx.insert(records).values({kind:'attention',scopeKey:'weekly:'+config.version+':'+key,data:{kind:'weekly_digest',counts:Object.fromEntries(countRows.map(x=>[x.kind,x.count])),recipientRefs:c.recipientRefs,state:'pending_approval',attempts:0,occurrence:key}}).onConflictDoNothing();
   }}
   // A newly urgent case gets one attention job for each changed deadline, not a daily spam loop.
   const hours=Number(config?.data.deadlineHours);
   const due=Number.isInteger(hours)&&hours>0&&hours<=744?await tx.select().from(records).where(and(eq(records.kind,'case'),sql`${records.data}->>'state' <> 'resolved' and (${records.data}->>'reviewTarget')::timestamptz <= ${now()}::timestamptz + ${hours} * interval '1 hour'`)).limit(100):[];
   for(const r of due)await tx.insert(records).values({kind:'attention',scopeKey:'due:'+r.id+':'+String(r.data.reviewTarget),data:{kind:'privacy_attention',caseId:r.id,reason:'deadline_needs_review',state:'pending_approval',attempts:0}}).onConflictDoNothing();
   return{checkedDue:due.length};
  });},
  async attentionProfile(a:PrivacyAdminIdentity,input?:{fingerprint:string;reviewRef:string}){const draft=privacyEnvelope('privacy_attention',await options.mailConfiguration()),fingerprint=privacyHash(draft);return database.transaction(async tx=>{await auth(tx,a,true);if(input){if(input.fingerprint!==fingerprint||input.reviewRef.trim().length<3)throw new PrivacyWorkflowError('conflict');await tx.insert(records).values({kind:'configuration',scopeKey:'attention_approval',data:{fingerprint,reviewRef:input.reviewRef,approvedBy:a.id,approvedAt:now().toISOString()}}).onConflictDoUpdate({target:[records.kind,records.scopeKey],set:{data:{fingerprint,reviewRef:input.reviewRef,approvedBy:a.id,approvedAt:now().toISOString()},updatedAt:now()}});await tx.insert(auditLogs).values({userEmail:a.email,actionType:'privacy_attention_profile_approved',resource:'/admin/ropa',details:{actorId:a.id,fingerprint},ipAddress:null});}return{envelope:draft,fingerprint,approved:!!input};});},
  async retentionPlan(a:PrivacyAdminIdentity,policyId:string){return database.transaction(async tx=>{await auth(tx,a,true);const [policy]=await tx.select().from(records).where(and(eq(records.kind,'retention'),eq(records.id,policyId))).for('share');if(!policy||!policy.data.reviewRef)throw new PrivacyWorkflowError('invalid');const cutoff=new Date(now().getTime()-Number(policy.data.days)*86400000);const scope=String(policy.data.scope);let candidates:typeof records.$inferSelect[]=[];
   if(scope==='closed_case_links')candidates=await tx.select().from(records).where(and(eq(records.kind,'case'),sql`${records.data}->>'state'='resolved' and coalesce((${records.data}->>'hold')::boolean,false)=false and (${records.data}->>'closedAt')::timestamptz < ${cutoff}`)).orderBy(records.id).limit(101);
   else if(scope==='expired_confirmation')candidates=await tx.select().from(records).where(and(eq(records.kind,'consent'),sql`${records.data}->>'state'='pending' and (${records.data}->>'expiresAtMs')::bigint < ${cutoff.getTime()}`)).orderBy(records.id).limit(101);
   else candidates=await tx.select().from(records).where(and(eq(records.kind,'connector'),sql`${records.scopeKey} like 'resend:%' and ${records.data}->>'status' is not null and ${records.updatedAt}<${cutoff}`)).orderBy(records.id).limit(101);
   if(candidates.length>100)throw new PrivacyWorkflowError('conflict');const selected=candidates.map(r=>({id:r.id,version:r.version}));const plan={policyId,policyVersion:policy.version,scope,selected,expiresAtMs:now().getTime()+5*60000};const digest=privacyHash(plan);
   await tx.insert(records).values({kind:'retention',scopeKey:'plan:'+digest,data:{...plan,digest,approvedBy:a.id,state:'dry_run'}}).onConflictDoNothing();await tx.insert(auditLogs).values({userEmail:a.email,actionType:'privacy_retention_dry_run',resource:'/admin/ropa',details:{actorId:a.id,returnedRows:selected.length},ipAddress:null});return{...plan,digest,requiresHumanReview:true,scopeNote:'Only the named workflow metadata. This does not erase contact, order, provider, mailbox or backup data.'};
  });},
  async applyRetention(a:PrivacyAdminIdentity,digest:string,reviewRef:string){return database.transaction(async tx=>{await auth(tx,a,true);if(!/^[a-f0-9]{64}$/.test(digest)||reviewRef.trim().length<3)throw new PrivacyWorkflowError('invalid');const [p]=await tx.select().from(records).where(and(eq(records.kind,'retention'),eq(records.scopeKey,'plan:'+digest))).for('update');if(!p||p.data.state!=='dry_run'||Number(p.data.expiresAtMs)<=now().getTime())throw new PrivacyWorkflowError('conflict');const plan=p.data as any;const [policy]=await tx.select().from(records).where(eq(records.id,String(plan.policyId))).for('share');if(!policy||policy.version!==plan.policyVersion)throw new PrivacyWorkflowError('conflict');
   for(const item of plan.selected as {id:string;version:number}[]){const [r]=await tx.select().from(records).where(eq(records.id,item.id)).for('update');if(!r||r.version!==item.version||r.data.hold===true)throw new PrivacyWorkflowError('conflict');
    const data:Record<string,unknown>=plan.scope==='expired_confirmation'?{purpose:r.data.purpose,state:'expired',noticeId:r.data.noticeId}: {state:'redacted',redactedAt:now().toISOString(),retentionReviewRef:reviewRef};
    if(plan.scope==='closed_case_links')await tx.update(records).set({subjectId:null}).where(eq(records.id,r.id));
    await tx.update(events).set({evidence:{redacted:true,retentionReviewRef:reviewRef}}).where(eq(events.recordId,r.id));
    await event(tx,r,'retention_redaction',data,a.id,{reviewRef});
    if(plan.scope==='expired_confirmation'){const jobs=await tx.select().from(records).where(and(eq(records.kind,'attention'),sql`${records.data}->>'consentId'=${r.id} and ${records.data}->>'state' in ('pending_approval','approved')`)).for('update');for(const j of jobs)await event(tx,j,'expired_confirmation_cancelled',{kind:'confirmation',state:'cancelled'},a.id,{reviewRef});}
   }
   await event(tx,p,'retention_plan_applied',{...p.data,state:'applied',reviewRef,appliedAt:now().toISOString()},a.id,{returnedRows:plan.selected.length,reviewRef});return{applied:plan.selected.length,providers:'not_processed',backups:'not_processed'};
  });},
  async finishRecovery(a:PrivacyAdminIdentity,input:{expectedVersion:number;reviewRef:string}){return database.transaction(async tx=>{await auth(tx,a,true);const [r]=await tx.select().from(records).where(and(eq(records.kind,'recovery'),eq(records.scopeKey,'processing_hold'))).for('update');if(!r||r.version!==input.expectedVersion||input.reviewRef.trim().length<3)throw new PrivacyWorkflowError('conflict');await event(tx,r,'recovery_reconciled',{...r.data,hold:false,reconciliationRef:input.reviewRef,resumedAt:now().toISOString()},a.id,{reviewRef:input.reviewRef});return{hold:false};});},
  async pendingIds(){return database.transaction(async tx=>{const rows=await tx.select({id:records.id}).from(records).where(and(eq(records.kind,'attention'),sql`(${records.data}->>'state'='approved' or (${records.data}->>'kind'='privacy_attention' and ${records.data}->>'state'='pending_approval'))`)).orderBy(sql`case when ${records.data}->>'kind'='privacy_attention' then 0 else 1 end`,records.updatedAt).limit(10);return rows.map(r=>r.id);});},
 };
}
export type PrivacyOperations=ReturnType<typeof createPrivacyOperations>;
