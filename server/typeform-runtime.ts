import { createServiceEmailRuntime } from './service-email-runtime';
import type { Express,Request,Response,NextFunction } from 'express';
import type { db } from './db';
import { createTypeformOriginalCodec } from './typeform-originals';
import { createTypeformIntakeHandler,TypeformIntakeError } from './typeform-intake';
import { createTypeformIntakeStore } from './typeform-intake-store';
import { createTypeformEvidenceStore } from './typeform-evidence-store';
import { createScanServiceReviewStore } from './scan-service-review-store';
import { createTypeformResponseReader } from './typeform-response-reader';
import { createScanCompletionPreview } from './scan-completion-preview';
import { registerScanServiceReviewRoutes } from './scan-service-review-routes';
import { INDIVIDUAL_SCAN_MAPPING } from './typeform-mapping';
import { checkPrivacyAccess,type PrivacyAdminIdentity } from './privacy-admin-access';
import { publicSiteOrigin } from './delivery-security';
/** All dependencies injected. Construction never reads provider data or starts work. */
export function createTypeformRuntime(database:Pick<typeof db,'transaction'>,options:{env():NodeJS.ProcessEnv;connectorEnabled():Promise<boolean>;findAdmin(id:string):Promise<PrivacyAdminIdentity|undefined>;request(url:string,init:RequestInit):Promise<globalThis.Response>}){
 const enabled=()=>options.env().TYPEFORM_ORDER_INTAKE_ENABLED==='true';
 function core(){
  const env=options.env(),key=env.TYPEFORM_EVIDENCE_KEY;
  if(!enabled()||env.TYPEFORM_FORM_ID!==INDIVIDUAL_SCAN_MAPPING.formId||!key||!/^[a-fA-F0-9]{64}$/.test(key)||!env.TYPEFORM_EVIDENCE_KEY_ID||!env.TYPEFORM_WEBHOOK_SECRET||key===env.TYPEFORM_WEBHOOK_SECRET)throw new TypeformIntakeError(503);
  const codec=createTypeformOriginalCodec({key:Buffer.from(key,'hex'),keyId:env.TYPEFORM_EVIDENCE_KEY_ID,secret:env.TYPEFORM_WEBHOOK_SECRET,mapping:INDIVIDUAL_SCAN_MAPPING});
  const evidence=createTypeformEvidenceStore(database,{codec,owner:()=>options.env().ADMIN_OWNER_EMAIL});
  const intake=createTypeformIntakeStore(database,{originals:codec});
  const review=createScanServiceReviewStore(database,{owner:()=>options.env().ADMIN_OWNER_EMAIL,evidence:evidence.evidence});
  return{evidence,intake,review};
 }
 const handler=async(req:Request,res:Response,next:NextFunction)=>{
  const mode=options.env().TYPEFORM_ORDER_INTAKE_ENABLED;
  if(mode===undefined||mode==='false')return next();
  try{const c=core();return await createTypeformIntakeHandler({secret:()=>options.env().TYPEFORM_WEBHOOK_SECRET!,mapping:()=>INDIVIDUAL_SCAN_MAPPING,enabled:options.connectorEnabled,store:c.intake})(req,res);}catch{return res.status(503).set('Cache-Control','no-store').json({received:false,message:'Typeform intake needs configuration review.'});}
 };
 async function preview(actor:PrivacyAdminIdentity,eventId:string,expectedVersion:number){
  if(!(await options.connectorEnabled()))throw new TypeformIntakeError(503);const c=core(),env=options.env();
  if(!env.TYPEFORM_PERSONAL_ACCESS_TOKEN||!env.TYPEFORM_SERVICE_PREVIEW_FROM)throw new TypeformIntakeError(503);
  const recover=createTypeformResponseReader({mapping:INDIVIDUAL_SCAN_MAPPING,token:env.TYPEFORM_PERSONAL_ACCESS_TOKEN,request:options.request,signedDefinition:c.evidence.signedDefinition});
  return createScanCompletionPreview(database,{owner:()=>options.env().ADMIN_OWNER_EMAIL,sender:env.TYPEFORM_SERVICE_PREVIEW_FROM,recover})(actor,eventId,expectedVersion);
 }
 const mail=createServiceEmailRuntime(database,{env:options.env,findAdmin:options.findAdmin,preview});
 function register(app:Express){
  // Existing provider URL; enabled-mode failures never fall through to email matching.
  app.post('/api/typeform-webhook',handler);
  // Stricter privacy binding/MFA gate precedes the older general admin audit helper.
  app.use('/api/admin/scan-service',async(req,res,next)=>{res.set({'Cache-Control':'no-store','Referrer-Policy':'no-referrer'});try{
   if(!enabled())return res.status(503).json({code:'review_configuration_required'});
   const e=options.env(),access=await checkPrivacyAccess(req.session,e.PRIVACY_ADMIN_GOOGLE_BINDINGS,options.findAdmin,Date.now(),e.ADMIN_OWNER_EMAIL);
   if(!access.allowed)return res.status(access.status).json({code:access.code});return next();
  }catch{return res.status(503).json({code:'review_unavailable'});}});
  mail.register(app);
  registerScanServiceReviewRoutes(app,{owner:()=>options.env().ADMIN_OWNER_EMAIL,siteUrl:()=>publicSiteOrigin(options.env().PUBLIC_SITE_URL),findAdmin:options.findAdmin,
   store:{list:(...args)=>core().review.list(...args),detail:(...args)=>core().review.detail(...args),act:(...args)=>core().review.act(...args)},preview,
   attest:(actor,eventId,input)=>core().evidence.attest(actor,eventId,input)});
 }
 return{handler,register};
}
