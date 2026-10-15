import test,{before,beforeEach,after} from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import type { Server } from 'node:http';
import { createHmac,randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { scanServiceReviewFixture } from '../scripts/scan-service-review-fixture';
import { INDIVIDUAL_SCAN_MAPPING } from './typeform-mapping';
import { createTypeformOriginalCodec } from './typeform-originals';
import { createTypeformIntakeStore } from './typeform-intake-store';
import { parseTypeformReceipt } from './typeform-intake';
import { createTypeformEvidenceStore } from './typeform-evidence-store';
import { createScanServiceReviewStore } from './scan-service-review-store';
import { createTypeformRuntime } from './typeform-runtime';
import { createConfiguredScanReference,hasScanSubmissionAwaitingReview } from './scan-order-link-runtime';
import { satellitescanPurchases } from '@shared/schema';
let f:Awaited<ReturnType<typeof scanServiceReviewFixture>>,codec:ReturnType<typeof createTypeformOriginalCodec>,intake:ReturnType<typeof createTypeformIntakeStore>,evidence:ReturnType<typeof createTypeformEvidenceStore>,review:ReturnType<typeof createScanServiceReviewStore>,server:Server,origin:string,session:any,env:NodeJS.ProcessEnv,connector=true,legacy=0;
const map=INDIVIDUAL_SCAN_MAPPING as Extract<typeof INDIVIDUAL_SCAN_MAPPING,{version:2}>,key=Buffer.alloc(32,9),secret='synthetic-typeform-signing-secret';
const sql=async(s:string,args:any[]=[]) => (await f.client.query<any>(s,args)).rows;
function source(id='runtime-event',proof='A'.repeat(43),ending=map.completion.acceptedEndingIds[0]){
 const answers=[{type:'boolean',field:{id:map.completion.readyFieldId,ref:'unstable-ready',type:'yes_no'},boolean:true},...map.completion.requiredAnswerIds.map((id,i)=>i<2?{type:'number',field:{id,ref:'unstable-'+i,type:'opinion_scale'},number:5}:{type:'choice',field:{id,ref:'unstable-'+i,type:'multiple_choice'},choice:{id:'option-'+i,label:'Private fictional answer'}})];
 const response={form_id:map.formId,token:'runtime-response',submitted_at:new Date(Date.now()-60000).toISOString(),hidden:{service_reference:proof},ending:{id:ending},answers,definition:{fields:answers.map(a=>({...a.field,title:'Fictional question '+a.field.id}))}};
 const raw=Buffer.from(JSON.stringify({event_id:id,event_type:'form_response',form_response:response})),signature='sha256='+createHmac('sha256',secret).update(raw).digest('base64');
 return{raw,signature,receipt:parseTypeformReceipt(raw,signature,secret,map),response};
}
const attest=()=>({mutationId:randomUUID(),expectedVersion:0,participantRef:'verified-participant',recipientEmail:'participant@example.test',assignmentEvidenceRef:'restricted-identity-receipt',recipientEvidenceRef:'restricted-recipient-receipt',identityReviewed:true,recipientReviewed:true,payerPermissionsReviewed:true});
const count=async(table:string)=>(await sql(`SELECT count(*)::int n FROM ${table}`))[0].n;
before(async()=>{
 f=await scanServiceReviewFixture();await f.client.exec(await readFile('migrations/20261015_typeform_originals.sql','utf8'));
 codec=createTypeformOriginalCodec({key,keyId:'synthetic-key-v1',secret,mapping:map});intake=createTypeformIntakeStore(f.database as any,{originals:codec});evidence=createTypeformEvidenceStore(f.database as any,{codec,owner:()=>f.actor.email});review=createScanServiceReviewStore(f.database as any,{owner:()=>f.actor.email,evidence:evidence.evidence});
 const app=express();app.use('/api/typeform-webhook',express.raw({type:'application/json',limit:'2mb'}));app.use(express.json());app.use((req,_res,next)=>{req.session=session;next();});
 createTypeformRuntime(f.database as any,{env:()=>env,connectorEnabled:async()=>connector,findAdmin:async()=>f.actor,request:async()=>{throw Error('No real provider calls allowed');}}).register(app);
 app.post('/api/typeform-webhook',(_req,res)=>{legacy++;res.json({legacy:true});});server=await new Promise<Server>(resolve=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));});const a=server.address();assert.ok(a&&typeof a!=='string');origin='http://127.0.0.1:'+a.port;
});
beforeEach(async()=>{
 await f.reset();await f.client.exec('DROP TRIGGER IF EXISTS fail_original ON scan_typeform_originals;TRUNCATE scan_typeform_review_actions,scan_typeform_service_tasks,scan_typeform_events CASCADE;');await f.client.query('UPDATE scan_typeform_bindings SET form_id=$1',[map.formId]);
 connector=true;legacy=0;session=undefined;env={TYPEFORM_ORDER_INTAKE_ENABLED:'true',TYPEFORM_FORM_ID:map.formId,TYPEFORM_EVIDENCE_KEY:key.toString('hex'),TYPEFORM_EVIDENCE_KEY_ID:'synthetic-key-v1',TYPEFORM_WEBHOOK_SECRET:secret,ADMIN_OWNER_EMAIL:f.actor.email,PRIVACY_ADMIN_GOOGLE_BINDINGS:JSON.stringify({[f.actor.id]:f.actor.googleId}),PUBLIC_SITE_URL:'https://website.example.test'};
});
after(async()=>{if(server)await new Promise<void>(r=>server.close(()=>r()));await f?.client.close();});
const receive=async(s=source())=>intake.receive(s.receipt,s);
const post=async(s=source())=>fetch(origin+'/api/typeform-webhook',{method:'POST',headers:{'Content-Type':'application/json','Typeform-Signature':s.signature},body:s.raw});
test('sealed original is encrypted, retains exact signed bytes and is not replaced by replay',async()=>{
 const s=source();await receive(s);const [saved]=await sql('SELECT event_id AS "eventId",format_version AS "formatVersion",key_id AS "keyId",payload_digest AS "payloadDigest",nonce,tag,ciphertext FROM scan_typeform_originals');assert.doesNotMatch(JSON.stringify(saved),/Private fictional answer|service_reference|AAAAA/);const opened=codec.open(saved,s.receipt);assert.deepEqual(opened.body.form_response,s.response);assert.throws(()=>codec.open(saved,{...s.receipt,receivedAt:new Date(s.receipt.receivedAt.getTime()+1)}));const cipher=saved.ciphertext;assert.equal((await receive(s)).replayed,true);assert.equal((await sql('SELECT ciphertext FROM scan_typeform_originals'))[0].ciphertext,cipher);assert.equal(await count('scan_typeform_service_tasks'),0);
});
test('tampering, wrong event, wrong key and changed original cannot pass recovery',async()=>{
 const s=source();const saved=codec.seal(s.receipt,s);assert.throws(()=>codec.open({...saved,ciphertext:'AAAA'+saved.ciphertext.slice(4)},s.receipt));assert.throws(()=>codec.open({...saved,eventId:'another-event'},s.receipt));const other=createTypeformOriginalCodec({key:Buffer.alloc(32,8),keyId:'synthetic-key-v1',secret,mapping:map});assert.throws(()=>other.open(saved,s.receipt));await assert.rejects(intake.receive(s.receipt,{raw:Buffer.from('{}'),signature:s.signature}));assert.equal(await count('scan_typeform_events'),0);
});
test('original storage failure rolls back receipt and audit in the same transaction',async()=>{
 await f.client.exec(`CREATE OR REPLACE FUNCTION fail_original_test() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic'; END $$;CREATE TRIGGER fail_original BEFORE INSERT ON scan_typeform_originals FOR EACH ROW EXECUTE FUNCTION fail_original_test();`);const s=source();await assert.rejects(receive(s));assert.equal(await count('scan_typeform_events'),0);assert.equal(await count('scan_typeform_originals'),0);await f.client.exec('DROP TRIGGER fail_original ON scan_typeform_originals');await receive(s);assert.equal(await count('scan_typeform_originals'),1);
});
test('owner attestation binds the receipt/order and preserves the distinction from verified identity or completion',async()=>{
 const s=source();await receive(s);assert.deepEqual(await evidence.signedDefinition(s.receipt.eventId),s.response.definition);const input=attest(),saved=await evidence.attest(f.actor,s.receipt.eventId,input);assert.equal(saved.completion,'not_applied');assert.equal((await sql('SELECT typeform_completed FROM satellitescan_purchases WHERE id=$1',['synthetic-order-0']))[0].typeform_completed,'false');assert.equal(await count('scan_typeform_service_tasks'),0);
 assert.equal((await evidence.attest(f.actor,s.receipt.eventId,input)).replayed,true);assert.equal((await evidence.attest(f.actor,s.receipt.eventId,{...input,mutationId:randomUUID()})).reference,saved.reference);
 const current=await review.detail(f.actor,s.receipt.eventId);assert.equal(current.canResolve,true);assert.equal(current.evidenceOptions[0].recipientEmail,input.recipientEmail);
 await review.act(f.actor,s.receipt.eventId,{mutationId:randomUUID(),expectedVersion:0,decision:'resolved',reason:'service_reviewed',evidenceRef:saved.reference});assert.equal(await count('scan_typeform_service_tasks'),1);const rows=await sql('SELECT typeform_completed FROM satellitescan_purchases ORDER BY id');assert.deepEqual(rows.map(x=>x.typeform_completed),['true','false']);const b=(await sql('SELECT participant_verified_at FROM scan_typeform_bindings WHERE id=$1',['synthetic-binding-0']))[0];assert.equal(b.participant_verified_at,null);
});
test('attestation rejects absent original, false review, non-owner, stale version and unknown reference',async()=>{
 await assert.rejects(evidence.attest(f.actor,'missing',attest()));const s=source();await receive(s);await assert.rejects(evidence.attest(f.actor,s.receipt.eventId,{...attest(),identityReviewed:false}));await assert.rejects(evidence.attest({...f.actor,email:'other@example.test'},s.receipt.eventId,attest()));await assert.rejects(evidence.attest(f.actor,s.receipt.eventId,{...attest(),expectedVersion:1}));assert.equal(await count('scan_typeform_assignment_evidence'),0);
});
test('a forwarded order reference cannot complete, while missing or refusal references cannot create assignment evidence',async()=>{
 const s=source();assert.equal((await receive(s)).outcome,'review');assert.equal((await sql('SELECT reason FROM scan_typeform_events'))[0].reason,'participant_unverified');assert.equal(await hasScanSubmissionAwaitingReview(f.database as any,'synthetic-order-0'),true);assert.equal(await hasScanSubmissionAwaitingReview(f.database as any,'synthetic-order-1'),false);
 const refused=source('refusal','B'.repeat(43),map.completion.refusedEndingIds[0]);await receive(refused);assert.equal(await hasScanSubmissionAwaitingReview(f.database as any,'synthetic-order-1'),false);await assert.rejects(evidence.attest(f.actor,refused.receipt.eventId,attest()));
});
test('enabled existing webhook durably captures without mail; disabled mode alone may use the legacy handler',async()=>{
 const s=source();let r=await post(s);assert.equal(r.status,202);assert.equal((await r.json()).emailDelivery,'not_attempted');assert.equal(legacy,0);assert.equal(await count('scan_typeform_originals'),1);r=await post(s);assert.equal((await r.json()).replayed,true);env.TYPEFORM_ORDER_INTAKE_ENABLED='false';r=await post(s);assert.equal((await r.json()).legacy,true);assert.equal(legacy,1);
});
test('bad configuration, unavailable connector and invalid signatures never fall through to email matching',async()=>{
 delete env.TYPEFORM_EVIDENCE_KEY;assert.equal((await post()).status,503);env.TYPEFORM_EVIDENCE_KEY=key.toString('hex');connector=false;assert.equal((await post()).status,503);connector=true;const s=source();assert.equal((await post({...s,signature:'invalid'})).status,401);assert.equal(legacy,0);assert.equal(await count('scan_typeform_events'),0);
});
test('runtime owner routes require configured privacy bindings and fresh MFA before reading original-linked evidence',async()=>{
 assert.equal((await fetch(origin+'/api/admin/scan-service')).status,401);session={isAdmin:true,adminUserId:f.actor.id,adminGoogleSubject:f.actor.googleId,adminMfaVerified:true,adminGoogleAuthTime:Date.now(),adminAuthenticatedAt:Date.now()};delete env.PRIVACY_ADMIN_GOOGLE_BINDINGS;assert.equal((await fetch(origin+'/api/admin/scan-service')).status,403);env.PRIVACY_ADMIN_GOOGLE_BINDINGS=JSON.stringify({[f.actor.id]:f.actor.googleId});assert.equal((await fetch(origin+'/api/admin/scan-service')).status,200);
});
test('same-link activation has no policy default and never extends the original reference on retries',async()=>{
 const [purchase]=await f.database.select().from(satellitescanPurchases);await f.client.exec('TRUNCATE scan_typeform_bindings CASCADE');env.TYPEFORM_ORDER_LINKS_ENABLED='true';const prepare=createConfiguredScanReference(f.database as any,()=>env);await assert.rejects(prepare(purchase));env.TYPEFORM_ORDER_REFERENCE_KEY=Buffer.alloc(32,2).toString('hex');env.TYPEFORM_ORDER_REFERENCE_TTL_HOURS='240';const first=await prepare(purchase),second=await prepare(purchase);assert.deepEqual(second,first);assert.equal((await sql('SELECT count(*)::int n FROM scan_typeform_bindings'))[0].n,1);env.TYPEFORM_ORDER_REFERENCE_KEY=key.toString('hex');await assert.rejects(prepare(purchase));
});

test('runtime evidence POST checks the approved HTTPS origin and persists only reviewed evidence',async()=>{
 const s=source();await post(s);session={isAdmin:true,adminUserId:f.actor.id,adminGoogleSubject:f.actor.googleId,adminMfaVerified:true,adminGoogleAuthTime:Date.now(),adminAuthenticatedAt:Date.now()};
 const endpoint=origin+'/api/admin/scan-service/'+s.receipt.eventId+'/evidence',input=attest();
 let response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://wrong.example.test'},body:JSON.stringify(input)});assert.equal(response.status,403);assert.equal(await count('scan_typeform_assignment_evidence'),0);
 response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Origin:env.PUBLIC_SITE_URL!},body:JSON.stringify(input)});assert.equal(response.status,200);assert.equal((await response.json()).completion,'not_applied');assert.equal(await count('scan_typeform_assignment_evidence'),1);assert.equal(await count('scan_typeform_service_tasks'),0);
});
