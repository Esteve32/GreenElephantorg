import { createHash,createCipheriv,createDecipheriv,randomBytes } from 'node:crypto';
import { z } from 'zod';

export const serviceKinds = ['completion','purchase_customer','purchase_admin','reminder'] as const;
export type ServiceKind = typeof serviceKinds[number];
export type ServiceMessage = { from:string; to:string|string[]; cc?:string[]; replyTo?:string; subject:string; html?:string; text:string;
  attachments?:{filename:string;content?:string;contentType?:string}[] };
export const serviceHash = (value:unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
export const recipientHash = (email:string) => serviceHash(email.trim().toLowerCase());
export type ServiceJob = { id:string; kind:ServiceKind; eventId?:string; reviewVersion?:number; fingerprint:string; messageDigest:string;
  sealed?:{nonce:string;tag:string;ciphertext:string}; sourceId?:string; legacyKey?:string; reviewRef?:string;lastActor?:string;
  state:'approved'|'held'|'submitting'|'unknown'|'accepted'|'cancelled'; version:number; approvedBy:string;
  approvedAt:string; attemptedAt?:string; providerId?:string; recipients:string[]; reason:string;
  reports:Partial<Record<DeliveryType,string>> };
export type ServiceControls = { paused:boolean; version:number; dailyCap:number; monthlyCap:number; nextRequestAt:number; lastTickAt?:string;
 day?:string;month?:string;dailyReserved?:number;monthlyReserved?:number;updatedBy?:string;updatedAt?:string };
export const initialServiceControls = ():ServiceControls => ({paused:true,version:0,dailyCap:100,monthlyCap:3000,nextRequestAt:0});
export const deliveryTypes=['email.sent','email.delivered','email.delivery_delayed','email.bounced','email.complained','email.failed','email.suppressed'] as const;
export type DeliveryType=typeof deliveryTypes[number]|'api.accepted';
export type ServiceReceipt = { id:string; digest:string; jobId:string; fingerprint:string; providerId:string; type:DeliveryType; occurredAt:string;source?:'signed_webhook'|'resend_api_readback';actorRef?:string };
export interface ServiceTransaction {
  controls:ServiceControls; jobs:ServiceJob[]; receipts:ServiceReceipt[];
  recoveryHeld?:boolean;
}
/** The implementation must serialize across processes and commit all three collections atomically. */
export interface ServiceEmailRepository { atomic<T>(work:(state:ServiceTransaction)=>Promise<T>|T,scope?:{jobId?:string;receiptId?:string;providerId?:string}):Promise<T> }
export class ServiceEmailError extends Error {
  constructor(public code:'service_conflict'|'service_unavailable'|'service_approval_required'|'service_held'){super(code);}
}
const id=z.string().regex(/^[A-Za-z0-9_:-]{1,200}$/), hash=z.string().regex(/^[a-f0-9]{64}$/);
export const serviceApproval=z.object({expectedVersion:z.number().int().nonnegative(),fingerprint:hash,reviewRef:z.string().trim().min(3).max(160)}).strict();
export const serviceControlInput=z.object({expectedVersion:z.number().int().nonnegative(),paused:z.boolean(),dailyCap:z.number().int().min(1).max(100),monthlyCap:z.number().int().min(1).max(3000)}).strict();
export function serviceMessageCodec(key:string){
 if(!/^[a-fA-F0-9]{64}$/.test(key))throw new ServiceEmailError('service_unavailable');
 const bytes=Buffer.from(key,'hex');
 return{
  seal(jobId:string,fingerprint:string,message:ServiceMessage){
   const nonce=randomBytes(12),cipher=createCipheriv('aes-256-gcm',bytes,nonce);cipher.setAAD(Buffer.from(jobId+':'+fingerprint));
   const ciphertext=Buffer.concat([cipher.update(JSON.stringify(message),'utf8'),cipher.final()]);
   return{nonce:nonce.toString('base64'),tag:cipher.getAuthTag().toString('base64'),ciphertext:ciphertext.toString('base64')};
  },
  open(job:ServiceJob):ServiceMessage{
   if(!job.sealed)throw new ServiceEmailError('service_unavailable');
   const decipher=createDecipheriv('aes-256-gcm',bytes,Buffer.from(job.sealed.nonce,'base64'));decipher.setAAD(Buffer.from(job.id+':'+job.fingerprint));decipher.setAuthTag(Buffer.from(job.sealed.tag,'base64'));
   return JSON.parse(Buffer.concat([decipher.update(Buffer.from(job.sealed.ciphertext,'base64')),decipher.final()]).toString('utf8'));
  },
 };
}
export function messageRecipients(message:ServiceMessage){
 const emails=[...(Array.isArray(message.to)?message.to:[message.to]),...(message.cc??[])].map(e=>z.string().email().max(320).parse(e).trim().toLowerCase());
 if(!emails.length||emails.length>50||new Set(emails).size!==emails.length)throw new ServiceEmailError('service_conflict');
 return emails.map(recipientHash);
}
export function createServiceEmailOperations(repository:ServiceEmailRepository,options:{now?():Date}){
 const now=()=>options.now?.()??new Date();
 async function read(jobId?:string){return repository.atomic(s=>({controls:structuredClone(s.controls),jobs:s.jobs.filter(j=>!jobId||j.id===jobId).map(j=>{const {sealed,...safe}=j;return structuredClone(safe);})}),{jobId});}
 return {
  read,
  async job(jobId:string){return repository.atomic(s=>structuredClone(s.jobs.find(j=>j.id===jobId)),{jobId});},
  async controls(value:unknown,actorId='owner'){const input=serviceControlInput.parse(value);return repository.atomic(s=>{
   if(s.controls.version!==input.expectedVersion)throw new ServiceEmailError('service_conflict');
   Object.assign(s.controls,{paused:input.paused,dailyCap:input.dailyCap,monthlyCap:input.monthlyCap,version:s.controls.version+1,updatedBy:actorId,updatedAt:now().toISOString()});return structuredClone(s.controls);
  });},
  async approve(job:Omit<ServiceJob,'state'|'version'|'reason'|'reports'|'approvedAt'|'attemptedAt'|'providerId'>,expectedVersion:number){
   id.parse(job.id);hash.parse(job.fingerprint);hash.parse(job.messageDigest);if(job.recipients.length<1||job.recipients.length>50)throw new ServiceEmailError('service_conflict');job.recipients.forEach(v=>hash.parse(v));
   return repository.atomic(s=>{
    const old=s.jobs.find(j=>j.id===job.id);
    if(old?.fingerprint===job.fingerprint&&old.messageDigest===job.messageDigest&&old.approvedBy===job.approvedBy&&old.state==='approved')return structuredClone(old);
    if((old?.version??0)!==expectedVersion||old?.attemptedAt||old?.state==='cancelled')throw new ServiceEmailError('service_conflict');
    const next:ServiceJob={...structuredClone(job),lastActor:job.approvedBy,state:'approved',version:(old?.version??0)+1,reason:job.kind==='completion'?'human_reviewed':'existing_service_trigger',reports:{},approvedAt:now().toISOString()};
    if(old)Object.assign(old,next);else s.jobs.push(next);return structuredClone(next);
   },{jobId:job.id});
  },
  async hold(jobId:string,expectedVersion:number,reason='operator_hold',actorId='service-worker'){return repository.atomic(s=>{
   const job=s.jobs.find(j=>j.id===jobId);if(!job||job.version!==expectedVersion||job.attemptedAt)throw new ServiceEmailError('service_conflict');
   job.state='held';job.reason=reason;job.lastActor=actorId;job.version++;return structuredClone(job);
  },{jobId});},
  async dispatch(jobId:string,message:ServiceMessage,fingerprint:string,send:(message:ServiceMessage,key:string,tags:{name:string;value:string}[])=>Promise<string>,enabled:boolean){
   if(!enabled)throw new ServiceEmailError('service_unavailable');
   const envelope=structuredClone(message),recipients=messageRecipients(envelope), time=now();
   const claimed=await repository.atomic(s=>{
    const j=s.jobs.find(j=>j.id===jobId);if(!j)throw new ServiceEmailError('service_approval_required');
    if(j.state!=='approved'||j.attemptedAt)return null;
    if(j.fingerprint!==fingerprint||j.messageDigest!==serviceHash(envelope)||JSON.stringify(j.recipients)!==JSON.stringify(recipients)){j.state='held';j.reason='draft_changed';j.version++;return null;}
    if(s.recoveryHeld){j.reason='privacy_recovery_hold';return null;}
    if(s.controls.paused){j.reason='sending_paused';return null;}
    const day=time.toISOString().slice(0,10),month=day.slice(0,7);
    const daily=s.controls.day===day?(s.controls.dailyReserved??0):0,monthly=s.controls.month===month?(s.controls.monthlyReserved??0):0;
    if(daily+recipients.length>s.controls.dailyCap||monthly+recipients.length>s.controls.monthlyCap){j.reason='local_quota_hold';return null;}
    if(s.controls.nextRequestAt>time.getTime()){j.reason='rate_limit_wait';return null;}
    j.state='submitting';j.attemptedAt=time.toISOString();j.reason='provider_acceptance_pending';j.lastActor='service-dispatch';j.version++;
    Object.assign(s.controls,{day,month,dailyReserved:daily+recipients.length,monthlyReserved:monthly+recipients.length});
    s.controls.nextRequestAt=time.getTime()+1000;return structuredClone(j);
   },{jobId});
   if(!claimed)return{attempted:false};
   let providerId:string|undefined;
   try{providerId=id.parse(await send(envelope,'service:'+claimed.id,[{name:'service_job',value:claimed.id},{name:'service_fingerprint',value:claimed.fingerprint}]));}catch{/* Unknown or rejected: never blind retry. */}
   await repository.atomic(s=>{
    const j=s.jobs.find(j=>j.id===jobId)!;
    if(j.providerId&&providerId&&j.providerId!==providerId){j.state='unknown';j.reason='provider_identity_conflict';}
    else if(providerId){j.providerId=providerId;j.state='accepted';j.reason='provider_accepted';}
    else if(!j.providerId){j.state='unknown';j.reason='acceptance_unknown_no_retry';}
    j.version++;
   },{jobId});
   return{attempted:true,accepted:!!providerId};
  },
  async receipt(receipt:ServiceReceipt){
   id.parse(receipt.id);id.parse(receipt.providerId);hash.parse(receipt.digest);hash.parse(receipt.fingerprint);id.parse(receipt.jobId);
   if(![...deliveryTypes,'api.accepted'].includes(receipt.type)||!Number.isFinite(Date.parse(receipt.occurredAt))||Date.parse(receipt.occurredAt)>now().getTime()+300_000)throw new ServiceEmailError('service_conflict');
   return repository.atomic(s=>{
    const old=s.receipts.find(r=>r.id===receipt.id);if(old){if(old.digest!==receipt.digest)throw new ServiceEmailError('service_conflict');return{replayed:true};}
    const j=s.jobs.find(j=>j.id===receipt.jobId);
    if(!j||!j.attemptedAt||j.fingerprint!==receipt.fingerprint||Date.parse(receipt.occurredAt)<Date.parse(j.attemptedAt)-300_000||j.providerId&&j.providerId!==receipt.providerId)throw new ServiceEmailError('service_conflict');
    if(s.jobs.some(x=>x.id!==j.id&&x.providerId===receipt.providerId))throw new ServiceEmailError('service_conflict');
    s.receipts.push(structuredClone(receipt));j.providerId=receipt.providerId;j.state='accepted';j.lastActor=receipt.actorRef??receipt.source??'authenticated-provider';
    // Keep each fact. A late 'sent' or 'delivered' event cannot erase a bounce/complaint.
    const prior=j.reports[receipt.type];if(!prior||Date.parse(prior)<Date.parse(receipt.occurredAt))j.reports[receipt.type]=receipt.occurredAt;
    j.reason='provider_reported';j.version++;
    if(['email.bounced','email.complained','email.failed','email.suppressed'].includes(receipt.type)){s.controls.paused=true;s.controls.version++;s.controls.updatedBy='resend-webhook';s.controls.updatedAt=now().toISOString();}
    return{replayed:false};
   },{jobId:receipt.jobId,receiptId:receipt.id,providerId:receipt.providerId});
  },
  async tick(){return repository.atomic(s=>{s.controls.lastTickAt=now().toISOString();return s.controls.paused||s.recoveryHeld?[]:s.jobs.filter(j=>j.state==='approved').slice(0,5).map(j=>structuredClone(j));});},
 };
}
export type ServiceEmailOperations=ReturnType<typeof createServiceEmailOperations>;
