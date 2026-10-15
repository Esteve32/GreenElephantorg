import type { Express,Request,Response } from 'express';
import { timingSafeEqual,createHash } from 'node:crypto';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { adminSettings,satellitescanPurchases,scanTypeformBindings } from '@shared/schema';
import { operationKey } from './delivery-security';
import { isScanReminderDue } from '../shared/scan-reminder';
import { createConfiguredScanReference,hasScanSubmissionAwaitingReview } from './scan-order-link-runtime';
import { scanTypeformLink } from '../shared/scan-typeform-link';
import type { db } from './db';
import type { PrivacyAdminIdentity } from './privacy-admin-access';
import { checkPrivacyAccess } from './privacy-admin-access';
import { currentNamedAdmin,isRecentNamedOwner } from './admin-current-access';
import type { ScanCompletionPreview } from '@shared/scan-service-review';
import { getUncachableResendClient } from './resend-client';
import { publicSiteOrigin } from './delivery-security';
import { createServiceEmailOperations,serviceMessageCodec,serviceHash,messageRecipients,serviceApproval,ServiceEmailError,deliveryTypes,
 type ServiceMessage,type ServiceKind,type ServiceReceipt,type ServiceEmailRepository,type DeliveryType } from './service-email';
import { createServiceEmailRepository } from './service-email-store';

const eventId=z.string().regex(/^[A-Za-z0-9_-]{1,128}$/);
const secretEqual=(a:string,b:string)=>timingSafeEqual(createHash('sha256').update(a).digest(),createHash('sha256').update(b).digest());
export async function sendServiceTransport(message:ServiceMessage,key:string,tags:{name:string;value:string}[]){
 const {isConnectorEnabled}=await import('./lib/connectorGuard');
 if(!(await isConnectorEnabled('resend')))throw new ServiceEmailError('service_unavailable');
 const {client}=await getUncachableResendClient();
 const result=await client.emails.send({...message,tags},{idempotencyKey:key});
 if(!result.data?.id)throw new ServiceEmailError('service_unavailable');return result.data.id;
}
/** Disabled mode preserves the existing purchase/reminder flow. Never reset its durable claim. */
function codec(env:NodeJS.ProcessEnv){
 const key=env.SERVICE_EMAIL_ENCRYPTION_KEY;
 if(!key||[env.TYPEFORM_EVIDENCE_KEY,env.TYPEFORM_ORDER_REFERENCE_KEY,env.RESEND_SERVICE_WEBHOOK_SECRET,env.RESEND_API_KEY].some(v=>v?.toLowerCase()===key.toLowerCase()))throw new ServiceEmailError('service_unavailable');
 return serviceMessageCodec(key);
}
async function verifyQueuedLink(database:Pick<typeof db,'transaction'>,env:NodeJS.ProcessEnv,purchase:typeof satellitescanPurchases.$inferSelect,message:ServiceMessage,kind:ServiceKind){
 if(kind==='purchase_admin')return;
 if(env.TYPEFORM_ORDER_LINKS_ENABLED!=='true'||env.TYPEFORM_ORDER_INTAKE_ENABLED!=='true')throw new ServiceEmailError('service_held');
 const stored=await database.transaction(async tx=>({bindings:await tx.select().from(scanTypeformBindings).where(eq(scanTypeformBindings.purchaseId,purchase.id)),
  locale:(await tx.select().from(adminSettings).where(eq(adminSettings.key,operationKey('purchase-language',purchase.id))))[0]}));
 if(stored.bindings.length!==1||stored.bindings[0].isActive!=='true'||stored.bindings[0].expiresAt.getTime()<=Date.now()||!['en','fr'].includes(stored.locale?.value))throw new ServiceEmailError('service_held');
 const reference=await createConfiguredScanReference(database,()=>env)(purchase);
 if(!reference||!message.text.includes(scanTypeformLink(stored.locale.value as 'en'|'fr',reference)))throw new ServiceEmailError('service_held');
}
async function syncLegacyClaim(database:Pick<typeof db,'transaction'>,ops:ReturnType<typeof createServiceEmailOperations>,jobId:string){
 const job=await ops.job(jobId);if(!job?.sourceId||!job.legacyKey||job.state!=='accepted')return;
 if(job.kind==='reminder'){
  await database.transaction(async tx=>{
   await tx.update(satellitescanPurchases).set({remindersCount:'1'}).where(eq(satellitescanPurchases.id,job.sourceId!));
   await tx.update(adminSettings).set({value:JSON.stringify({status:'accepted',updatedAt:new Date().toISOString()}),updatedAt:new Date()}).where(eq(adminSettings.key,job.legacyKey!));
  });return;
 }
 const base=operationKey('scan-purchase',job.sourceId),admin=await ops.job(serviceHash(base+':admin')),customer=await ops.job(serviceHash(base+':customer'));
 if(admin?.state==='accepted'&&customer?.state==='accepted')await database.transaction(async tx=>{
  await tx.update(adminSettings).set({value:JSON.stringify({status:'accepted',updatedAt:new Date().toISOString()}),updatedAt:new Date()}).where(eq(adminSettings.key,base));
 });
}
export async function trackedServiceSend(kind:ServiceKind,message:ServiceMessage,key:string|undefined,sourceId:string|undefined,legacy:()=>Promise<unknown>){
 if(process.env.SERVICE_EMAIL_CONTROL_ENABLED!=='true')return legacy();
 if(!key||!sourceId)throw new ServiceEmailError('service_unavailable');
 const encrypt=codec(process.env);
 const {db:database}=await import('./db');
 const expectedKey=operationKey(kind==='reminder'?'scan-reminder':'scan-purchase',sourceId)+(kind==='purchase_admin'?':admin':kind==='purchase_customer'?':customer':'');
 if(!['purchase_customer','purchase_admin','reminder'].includes(kind)||key!==expectedKey)throw new ServiceEmailError('service_conflict');
 const purchase=await database.transaction(async tx=>(await tx.select().from(satellitescanPurchases).where(eq(satellitescanPurchases.id,sourceId)))[0]);
 if(!purchase||purchase.status!=='succeeded'||kind!=='purchase_admin'&&message.to!==purchase.customerEmail||kind==='reminder'&&(!isScanReminderDue(purchase)||await hasScanSubmissionAwaitingReview(database,sourceId)))throw new ServiceEmailError('service_held');
 await verifyQueuedLink(database,process.env,purchase,message,kind);
 const ops=createServiceEmailOperations(createServiceEmailRepository(database),{}),jobId=serviceHash(key),fingerprint=serviceHash(message);
 const current=await ops.job(jobId);
 if(!current)await ops.approve({id:jobId,kind,fingerprint,messageDigest:serviceHash(message),sourceId,legacyKey:kind==='reminder'?key:operationKey('scan-purchase',sourceId),
  sealed:encrypt.seal(jobId,fingerprint,message),approvedBy:'existing-service-trigger',recipients:messageRecipients(message)},0);
 await ops.dispatch(jobId,message,fingerprint,sendServiceTransport,process.env.SERVICE_EMAIL_SENDING_ENABLED==='true');
 const job=await ops.job(jobId);if(job?.state!=='accepted'||!job.providerId)throw new ServiceEmailError('service_held');
 await syncLegacyClaim(database,ops,jobId);
 return{data:{id:job.providerId},error:null};
}
export function createServiceEmailRuntime(database:Pick<typeof db,'transaction'>,options:{
 env():NodeJS.ProcessEnv;findAdmin(id:string):Promise<PrivacyAdminIdentity|undefined>;
 preview(actor:PrivacyAdminIdentity,id:string,version:number):Promise<ScanCompletionPreview>;
 send?:(message:ServiceMessage,key:string,tags:{name:string;value:string}[])=>Promise<string>;
 repository?:ServiceEmailRepository;
 readEmail?:(id:string)=>Promise<{id:string;created_at:string;last_event:string;tags?:{name:string;value:string}[]}>;
}){
 const operations=createServiceEmailOperations(options.repository??createServiceEmailRepository(database),{});
 const enabled=()=>options.env().SERVICE_EMAIL_CONTROL_ENABLED==='true';
 const sending=()=>enabled()&&options.env().SERVICE_EMAIL_SENDING_ENABLED==='true';
 const message=(p:ScanCompletionPreview):ServiceMessage=>({...p.message,attachments:p.message.attachments.map(a=>({filename:a.filename,contentType:a.contentType,content:Buffer.from(a.contentUtf8,'utf8').toString('base64')}))});
 async function dispatch(jobId:string){
  if(!sending())throw new ServiceEmailError('service_unavailable');
  const job=await operations.job(jobId);
  if(!job)throw new ServiceEmailError('service_conflict');
  if(job.state!=='approved'||job.attemptedAt)return{attempted:false};
  const controls=(await operations.read(jobId)).controls,now=new Date(),day=now.toISOString().slice(0,10),month=day.slice(0,7);
  // Avoid repeated Typeform recovery reads while paused, rate-held or out of budget.
  // The same limits are checked again atomically when claiming the actual send.
  if(controls.paused||controls.nextRequestAt>now.getTime()||(controls.day===day?controls.dailyReserved??0:0)+job.recipients.length>controls.dailyCap||(controls.month===month?controls.monthlyReserved??0:0)+job.recipients.length>controls.monthlyCap)return{attempted:false};
  if(job.kind!=='completion'){
   if(!job.sourceId)throw new ServiceEmailError('service_conflict');
   // Recheck the paid/voucher order before any queued purchase or reminder can run.
   const purchase=await database.transaction(async tx=>(await tx.select().from(satellitescanPurchases).where(eq(satellitescanPurchases.id,job.sourceId!)))[0]);
   if(!purchase||purchase.status!=='succeeded'||job.kind==='reminder'&&(!isScanReminderDue(purchase)||await hasScanSubmissionAwaitingReview(database,job.sourceId))){
    await operations.hold(job.id,job.version,'order_no_longer_eligible');throw new ServiceEmailError('service_held');
   }
   const original=codec(options.env()).open(job);
   if(job.kind!=='purchase_admin'&&original.to!==purchase.customerEmail){await operations.hold(job.id,job.version,'recipient_changed');throw new ServiceEmailError('service_held');}
   try{await verifyQueuedLink(database,options.env(),purchase,original,job.kind);}catch{await operations.hold(job.id,job.version,'order_link_or_key_changed');throw new ServiceEmailError('service_held');}
   const result=await operations.dispatch(jobId,original,serviceHash(original),options.send??sendServiceTransport,true);
   await syncLegacyClaim(database,operations,jobId);return result;
  }
  if(!job.eventId||job.reviewVersion===undefined)throw new ServiceEmailError('service_conflict');
  const actor=await options.findAdmin(job.approvedBy);if(!actor){await operations.hold(job.id,job.version,'owner_access_changed');throw new ServiceEmailError('service_held');}
  let p:ScanCompletionPreview;
  try{p=await options.preview(actor,job.eventId,job.reviewVersion);}catch{
   await operations.hold(job.id,job.version,'evidence_or_recovery_changed');throw new ServiceEmailError('service_held');
  }
  return operations.dispatch(jobId,message(p),p.fingerprint,options.send??sendServiceTransport,true);
 }
 function register(app:Express){
  async function owner(req:Request,res:Response,work:(actor:PrivacyAdminIdentity)=>Promise<unknown>){
   res.set({'Cache-Control':'no-store','Referrer-Policy':'no-referrer'});
   try{
    if(!enabled())return res.status(503).json({code:'service_unavailable'});
    const env=options.env(),privacy=await checkPrivacyAccess(req.session,env.PRIVACY_ADMIN_GOOGLE_BINDINGS,options.findAdmin,Date.now(),env.ADMIN_OWNER_EMAIL);
    if(!privacy.allowed)return res.status(privacy.status).json({code:privacy.code});
    const access=await currentNamedAdmin(req.session,{findAdmin:options.findAdmin,owner:()=>env.ADMIN_OWNER_EMAIL});
    if(!access.allowed||!req.session||!isRecentNamedOwner(req.session,access.actor,env.ADMIN_OWNER_EMAIL))return res.status(403).json({code:'review_owner_sign_in_required'});
    if(req.method!=='GET'&&(req.get('origin')!==publicSiteOrigin(env.PUBLIC_SITE_URL)||!req.is('application/json')))return res.status(403).json({code:'review_origin_required'});
    if(req.method!=='GET'&&Buffer.byteLength(JSON.stringify(req.body??{}))>4096)return res.status(413).json({code:'service_conflict'});
    return res.json(await work(access.actor));
   }catch(error){return res.status(error instanceof ServiceEmailError&&error.code==='service_conflict'?409:503).json({code:error instanceof ServiceEmailError?error.code:'service_unavailable'});}
  }
  app.get('/api/admin/scan-service/mail/status',(req,res)=>owner(req,res,async()=>({...(await operations.read()),sendingEnabled:sending(),
   provider:'Resend',deploymentHost:'Replit',quotaScope:'Tracked service messages only. Other app, account and inbound usage is not included.',
   webhookConfigured:!!options.env().RESEND_SERVICE_WEBHOOK_SECRET,cronConfigured:(options.env().SERVICE_EMAIL_CRON_SECRET?.length??0)>=32,
   liveProviderVerified:false,recipientDelivery:'Provider message reports do not prove inbox placement or delivery to every CC.'})));
  app.post('/api/admin/scan-service/mail/controls',(req,res)=>owner(req,res,async actor=>operations.controls(req.body,actor.id)));
  app.post('/api/admin/scan-service/:eventId/mail/approve',(req,res)=>owner(req,res,async actor=>{
   const input=serviceApproval.parse(req.body),eid=eventId.parse(req.params.eventId),p=await options.preview(actor,eid,input.expectedVersion);
   if(input.fingerprint!==p.fingerprint)throw new ServiceEmailError('service_conflict');
   const jobId=serviceHash('completion:'+p.taskId),old=(await operations.read(jobId)).jobs[0];
   return operations.approve({id:jobId,kind:'completion',eventId:eid,reviewVersion:p.reviewVersion,fingerprint:p.fingerprint,messageDigest:serviceHash(message(p)),reviewRef:input.reviewRef,
    approvedBy:actor.id,recipients:messageRecipients(message(p))},old?.version??0);
  }));
  app.post('/api/admin/scan-service/mail/:jobId/hold',(req,res)=>owner(req,res,async actor=>operations.hold(eventId.parse(req.params.jobId),z.object({expectedVersion:z.number().int().nonnegative()}).strict().parse(req.body).expectedVersion,'operator_hold',actor.id)));
  app.post('/api/admin/scan-service/mail/:jobId/dispatch',(req,res)=>owner(req,res,async()=>{z.object({}).strict().parse(req.body);return dispatch(eventId.parse(req.params.jobId));}));
  app.post('/api/admin/scan-service/mail/:jobId/reconcile',(req,res)=>owner(req,res,async actor=>{
   const input=z.object({providerId:eventId,expectedVersion:z.number().int().nonnegative()}).strict().parse(req.body),job=await operations.job(eventId.parse(req.params.jobId));
   if(!job?.attemptedAt||job.version!==input.expectedVersion||job.providerId&&job.providerId!==input.providerId)throw new ServiceEmailError('service_conflict');
   const read=options.readEmail??(async(id:string)=>{const {isConnectorEnabled}=await import('./lib/connectorGuard');if(!(await isConnectorEnabled('resend')))throw new ServiceEmailError('service_unavailable');
    const {client}=await getUncachableResendClient(),result=await client.emails.get(id);if(result.error||!result.data)throw new ServiceEmailError('service_unavailable');return result.data;});
   const observed=await read(input.providerId),tags=Object.fromEntries((observed.tags??[]).map(t=>[t.name,t.value]));
   if(observed.id!==input.providerId||tags.service_job!==job.id||tags.service_fingerprint!==job.fingerprint||!Number.isFinite(Date.parse(observed.created_at))||Date.parse(observed.created_at)<Date.parse(job.attemptedAt)-300_000)throw new ServiceEmailError('service_conflict');
   const reported='email.'+observed.last_event,type:DeliveryType=deliveryTypes.includes(reported as typeof deliveryTypes[number])?reported as typeof deliveryTypes[number]:'api.accepted';
   // API exposes last_event, not that event's time. Record observation time honestly.
   const digest=serviceHash({providerId:observed.id,tags,type,createdAt:observed.created_at});
   const result=await operations.receipt({id:'api_'+digest,digest,jobId:job.id,fingerprint:job.fingerprint,providerId:observed.id,type,occurredAt:new Date().toISOString(),source:'resend_api_readback',actorRef:actor.id});
   await syncLegacyClaim(database,operations,job.id);return{...result,readOnlyProviderCheck:true,noEmailSent:true};
  }));
  app.post('/api/internal/service-email-tick',async(req,res)=>{
   res.set('Cache-Control','no-store');const secret=options.env().SERVICE_EMAIL_CRON_SECRET;
   if(!sending()||!secret||secret.length<32)return res.status(503).json({code:'service_unavailable'});
   const header=req.get('authorization');if(!header||!secretEqual(header,'Bearer '+secret))return res.status(401).json({code:'service_unavailable'});
   try{const jobs=await operations.tick();for(const job of jobs){try{await dispatch(job.id);}catch{/* Held until owner reviews; never reset or notify from failure. */}}return res.json({checked:jobs.length});}
   catch{return res.status(503).json({code:'service_unavailable'});}
  });
  app.post('/api/webhooks/resend-service',async(req,res)=>{
   res.set('Cache-Control','no-store');const secret=options.env().RESEND_SERVICE_WEBHOOK_SECRET;
   if(!enabled()||!secret)return res.status(503).json({received:false});
   // Signature is checked against original bytes; Cloudflare is not webhook authentication.
   let verified:any;
   try{
    if(!Buffer.isBuffer(req.rawBody)||req.rawBody.length>128*1024)throw Error('invalid');
    const {Resend}=await import('resend');verified=new Resend('verification-only').webhooks.verify({payload:req.rawBody.toString('utf8'),headers:{
     id:req.get('svix-id')??'',timestamp:req.get('svix-timestamp')??'',signature:req.get('svix-signature')??''},webhookSecret:secret});
   }catch{return res.status(401).json({received:false});}
   if(!deliveryTypes.includes(verified.type)||!verified.data?.tags?.service_job)return res.status(200).json({received:true,ignored:true});
   try{const receipt:ServiceReceipt={id:req.get('svix-id')!,digest:serviceHash(req.rawBody.toString('utf8')),jobId:verified.data.tags.service_job,
    fingerprint:verified.data.tags.service_fingerprint,providerId:verified.data.email_id,type:verified.type,occurredAt:verified.created_at,source:'signed_webhook'};
    return res.json({received:true,...await operations.receipt(receipt)});
   }catch{return res.status(409).json({received:false});}
  });
 }
 return{register,operations,dispatch};
}
