import type { Express,Request,Response } from 'express';
import { z } from 'zod';
import { privacyId,privacyKind,mutationId,caseIntake } from '@shared/privacy-workflows';
import { checkPrivacyAccess,type PrivacyAdminIdentity } from './privacy-admin-access';
import type { PrivacyOperations } from './privacy-workflow-operations';
import { PrivacyWorkflowError,type PrivacyWorkflowStore } from './privacy-workflow-store';
const headers=(res:Response)=>res.set({'Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow'});
export function registerPrivacyWorkflowRoutes(app:Express,deps:{store:PrivacyWorkflowStore;operations?:PrivacyOperations;enabled():boolean;owner():string|undefined;bindings():string|undefined;siteUrl():string;findAdmin(id:string):Promise<PrivacyAdminIdentity|undefined>}) {
 const base='/api/admin/privacy/workflows';
 async function run(req:Request,res:Response,work:(a:PrivacyAdminIdentity)=>Promise<unknown>){
  headers(res);try{if(!deps.enabled())return res.status(503).json({code:'privacy_configuration_required'});
   const access=await checkPrivacyAccess(req.session,deps.bindings(),deps.findAdmin,Date.now(),deps.owner());if(!access.allowed)return res.status(access.status).json({code:access.code});
   if(req.method!=='GET'&&(req.get('origin')!==new URL(deps.siteUrl()).origin||!req.is('application/json')))return res.status(403).json({code:'privacy_origin_required'});
   if(Buffer.byteLength(JSON.stringify(req.body??{}))>16000)return res.status(413).json({code:'privacy_invalid'});
   const result=await work(access.actor);return res.json({...result as object,accessExpiresAt:new Date(access.expiresAt).toISOString()});
  }catch(e){const status=e instanceof z.ZodError?400:e instanceof PrivacyWorkflowError?({conflict:409,not_found:404,invalid:400,unavailable:503,access_required:403} as const)[e.code]:503;return res.status(status).json({code:status===503?'privacy_unavailable':'privacy_request_not_applied'});}
 }
 app.get(base,(req,res)=>run(req,res,a=>{const q=z.object({kind:privacyKind,after:privacyId.optional()}).strict().parse(req.query);return deps.store.list(a,q.kind,q.after);}));
 app.post(base+'/lookup',(req,res)=>run(req,res,a=>deps.store.lookup(a,z.object({email:z.string().email().max(320)}).strict().parse(req.body).email)));
 app.get(base+'/:id',(req,res)=>run(req,res,a=>deps.store.detail(a,privacyId.parse(req.params.id))));
 app.post(base+'/notices',(req,res)=>run(req,res,a=>deps.store.publishNotice(a,req.body)));
 app.post(base+'/cases',(req,res)=>run(req,res,async a=>{const input=caseIntake.parse(req.body);if(input.source!=='operator')throw new PrivacyWorkflowError('invalid');return deps.store.intakeCase(input,a);}));
 app.post(base+'/cases/:id/actions',(req,res)=>run(req,res,a=>deps.store.caseAction(a,privacyId.parse(req.params.id),req.body)));
 app.post(base+'/notifications',(req,res)=>run(req,res,a=>deps.store.saveNotifications(a,req.body)));
 app.post(base+'/retention',(req,res)=>run(req,res,a=>deps.store.saveRetention(a,req.body)));
 app.post(base+'/recovery',(req,res)=>run(req,res,a=>deps.store.beginRecovery(a,z.object({mutationId,reason:z.string().trim().min(3).max(1000)}).strict().parse(req.body))));
 const operations=()=>{if(!deps.operations)throw new PrivacyWorkflowError('unavailable');return deps.operations;};
 const reviewRef=z.string().trim().min(3).max(200),fingerprint=z.string().regex(/^[a-f0-9]{64}$/),expectedVersion=z.number().int().nonnegative();
 app.get(base+'/:id/draft',(req,res)=>run(req,res,a=>operations().preview(a,privacyId.parse(req.params.id))));
 app.post(base+'/:id/approve',(req,res)=>run(req,res,a=>operations().approve(a,privacyId.parse(req.params.id),z.object({expectedVersion,fingerprint,reviewRef}).strict().parse(req.body))));
 app.post(base+'/retention/:id/plan',(req,res)=>run(req,res,a=>operations().retentionPlan(a,privacyId.parse(req.params.id))));
 app.post(base+'/retention/apply',(req,res)=>run(req,res,a=>{const input=z.object({digest:fingerprint,reviewRef}).strict().parse(req.body);return operations().applyRetention(a,input.digest,input.reviewRef);}));
 app.post(base+'/recovery/finish',(req,res)=>run(req,res,a=>operations().finishRecovery(a,z.object({expectedVersion,reviewRef}).strict().parse(req.body))));

}
export function registerPublicConsentRoutes(app:Express,deps:{store:PrivacyWorkflowStore;enabled():boolean;siteUrl():string}) {
 const secure=(res:Response)=>headers(res).set({'Content-Security-Policy':"default-src 'none'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'"});
 const handleError=(res:Response,e:unknown)=>secure(res).status(e instanceof z.ZodError?400:503).type('text').send('Preference could not be saved. Please retry. / Préférence non enregistrée. Veuillez réessayer.');
 app.get('/api/email/notice',async(_req,res)=>{try{headers(res);if(!deps.enabled())throw Error();res.json(await deps.store.publicNotice());}catch(e){handleError(res,e);}});
 const attempts=new Map<string,{start:number;count:number}>();
 const subscribe=async(req:Request,res:Response)=>{try{
  secure(res);if(!deps.enabled())throw Error();if(!req.is('application/json')||Buffer.byteLength(JSON.stringify(req.body??{}))>2000)return res.status(400).end();const time=Date.now();attempts.forEach((v,k)=>{if(time-v.start>600000)attempts.delete(k);});const address=req.ip??'unknown';const recent=attempts.get(address);if((recent?.count??0)>=20||(!recent&&attempts.size>=10000))return res.status(429).end();attempts.set(address,{start:recent?.start??time,count:(recent?.count??0)+1});if(req.get('origin')!==new URL(deps.siteUrl()).origin)return res.status(403).end();
  const input=z.object({email:z.string().email().max(320),name:z.string().trim().min(1).max(100).optional(),noticeId:z.string().uuid(),mutationId,positiveChoice:z.literal(true)}).strict().parse(req.body);
  await deps.store.requestSubscription(input);res.status(202).json({status:'pending',message:'Your subscription is pending. Confirm your email when the confirmation message arrives. / Votre inscription est en attente. Confirmez votre adresse lorsque le message arrive.'});
 }catch(e){handleError(res,e);}};
 app.post('/api/newsletter',subscribe);
 app.post('/api/email/subscribe',subscribe);
 app.get('/api/email/confirm-subscription',(req,res)=>{secure(res);const q=z.object({challenge:mutationId,token:z.string().regex(/^[A-Za-z0-9_-]{43}$/)}).strict().safeParse(req.query);if(!q.success)return res.status(400).type('text').send('Invalid link / Lien invalide');
  res.type('html').send('<!doctype html><html lang="en"><meta charset="utf-8"><title>Confirm subscription / Confirmer l’inscription</title><body><h1>Confirm optional updates / Confirmer les actualités facultatives</h1><p>This choice is separate from your purchased service. / Ce choix est distinct de votre achat.</p><form method="post"><button type="submit" name="choice" value="confirm">Confirm my subscription / Confirmer mon inscription</button><button type="submit" name="choice" value="refuse">No updates / Aucune actualité</button></form></body></html>');
 });
 app.post('/api/email/confirm-subscription',async(req,res)=>{try{secure(res);if(!deps.enabled())throw Error();const q=z.object({challenge:mutationId,token:z.string().regex(/^[A-Za-z0-9_-]{43}$/)}).strict().parse(req.query);if(req.body?.choice==='refuse'){await deps.store.refuse(q.challenge,q.token);return res.type('text').send('Optional updates refused. / Actualités facultatives refusées.');}await deps.store.confirm(q.challenge,q.token);res.type('text').send('Subscription confirmed. You can unsubscribe at any time. / Inscription confirmée. Vous pouvez vous désinscrire à tout moment.');}catch(e){secure(res).status(e instanceof PrivacyWorkflowError?409:503).type('text').send('This link cannot confirm a subscription. Please make a fresh request. / Ce lien ne peut pas confirmer l’inscription. Faites une nouvelle demande.');}});
}
