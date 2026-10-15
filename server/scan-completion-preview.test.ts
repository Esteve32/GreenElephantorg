import test, { before, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import express from 'express';
import type { Server } from 'node:http';
import type { SessionData } from 'express-session';
import { eq } from 'drizzle-orm';
import { scanTypeformEvents } from '@shared/schema';
import { scanServiceReviewFixture } from '../scripts/scan-service-review-fixture';
import { createTypeformResponseReader } from './typeform-response-reader';
import { normalizeTypeformContent, contentHash, canonicalJson, TypeformRecoveryError } from './typeform-content';
import { createScanCompletionPreview } from './scan-completion-preview';
import { registerScanServiceReviewRoutes } from './scan-service-review-routes';
import { typeformDigest } from './typeform-intake';

let f: Awaited<ReturnType<typeof scanServiceReviewFixture>>, server:Server, origin:string, session:Partial<SessionData>|undefined;
const action=(eventId='synthetic-paid')=>({mutationId:randomUUID(),expectedVersion:0,decision:'resolved',reason:'service_reviewed',evidenceRef:'evidence-'+eventId});
const resolve=async(eventId='synthetic-paid')=>f.store.act(f.actor,eventId,action(eventId));
const receipt=async(eventId='synthetic-paid')=>(await f.database.select().from(scanTypeformEvents).where(eq(scanTypeformEvents.eventId,eventId)))[0];
const code=(expected:string)=>(error:unknown)=>error instanceof TypeformRecoveryError && error.code===expected;
const api=()=>structuredClone(f.apiItems.get('synthetic-response-0')) as any;
const reader=(request:(url:string,init:RequestInit)=>Promise<Response>,extra={})=>createTypeformResponseReader({mapping:f.mapping,token:'synthetic-test-token',
  signedDefinition:async eventId=>f.definitions.get(eventId),now:()=>f.now,request,...extra});
before(async()=>{
  f=await scanServiceReviewFixture();const app=express();app.use(express.json());app.use((req,_res,next)=>{req.session=session as typeof req.session;next();});
  registerScanServiceReviewRoutes(app,{owner:()=>f.actor.email,siteUrl:()=>origin,
    findAdmin:async id=>(await f.client.query<any>('SELECT id,email,google_id AS "googleId",role,is_active AS "isActive" FROM admin_users WHERE id=$1',[id])).rows[0],
    store:f.store,preview:f.preview});
  server=await new Promise<Server>((resolve,reject)=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));s.on('error',reject);});
  const address=server.address();assert.ok(address&&typeof address!=='string');origin='http://127.0.0.1:'+address.port;
});
beforeEach(async()=>{await f.reset();session={isAdmin:true,adminUserId:f.actor.id,adminGoogleSubject:f.actor.googleId,
  adminMfaVerified:true,adminGoogleAuthTime:Date.now(),adminAuthenticatedAt:Date.now()};});
after(async()=>{if(server)await new Promise<void>(resolve=>server.close(()=>resolve()));await f?.client.close();});
const post=(body:unknown={expectedVersion:1},headers:Record<string,string>={Origin:origin})=>fetch(origin+'/api/admin/scan-service/synthetic-paid/preview',{
  method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body)});

test('signed new receipt commits selected content and original labels; raw API JSON can differ',async()=>{
  const event=await receipt();assert.equal(event.contentVersion,1);assert.match(event.contentDigest!,/^[a-f0-9]{64}$/);
  const recovered=await f.recover(event);assert.equal(recovered.contentDigest,event.contentDigest);
  assert.ok(Object.isFrozen(recovered.content.answers[0]));assert.ok(Object.isFrozen(recovered.labels));
  assert.notEqual(recovered.provenance.apiBodyDigest,event.responseDigest);assert.notEqual(recovered.provenance.apiBodyDigest,event.payloadDigest);
  const stored=JSON.stringify((await f.client.query('SELECT * FROM scan_typeform_events')).rows);
  assert.doesNotMatch(stored,/Fictional reflection|service_reference|AAAAA|answers|@example/);
});
test('projection ignores answer/object order and transport metadata, but preserves choice order and typed values',async()=>{
  const original=api(), reordered={...original,metadata:{different:true},answers:[...original.answers].reverse()};
  const a=normalizeTypeformContent({...original,token:original.response_id},f.mapping),b=normalizeTypeformContent({...reordered,token:reordered.response_id},f.mapping);
  assert.equal(a.digest,b.digest);assert.notEqual(contentHash({when:new Date(1)}),contentHash({when:new Date(2)}));
  const ranked={...original,answers:[...original.answers,{type:'choices',field:{id:'rank',ref:'ranking',type:'ranking'},choices:{labels:['First','Second']}}]};
  const reverse=structuredClone(ranked);reverse.answers[2].choices.labels.reverse();
  assert.notEqual(normalizeTypeformContent(ranked,f.mapping).digest,normalizeTypeformContent(reverse,f.mapping).digest);
  assert.throws(()=>normalizeTypeformContent({...original,answers:[...original.answers,original.answers[0]]},f.mapping));
  assert.throws(()=>normalizeTypeformContent({...original,answers:[...original.answers,{type:'file_url',field:{id:'file'},file_url:'https://example.test/private'}]},f.mapping));
});
test('reader requests only the exact ID through injected authenticated transport without browser redirects',async()=>{
  let calls=0;
  const read=reader(async(url,init)=>{calls++;const target=new URL(url);assert.equal(target.origin,'https://api.typeform.com');
    assert.equal(target.pathname,'/forms/synthetic-form/responses');assert.equal(target.searchParams.get('included_response_ids'),'synthetic-response-0');
    assert.equal(target.searchParams.get('response_type'),'completed');assert.equal(target.searchParams.get('page_size'),'2');
    assert.equal(target.searchParams.get('query'),null);assert.equal(init.redirect,'error');assert.equal(init.cache,'no-store');
    assert.equal((init.headers as any).Authorization,'Bearer synthetic-test-token');return Response.json({total_items:1,items:[api()]});});
  await read(await receipt());assert.equal(calls,1);
});
test('missing recent response remains pending; duplicates and conflicting IDs stay held',async()=>{
  const event=await receipt();await assert.rejects(reader(async()=>Response.json({total_items:0,items:[]}))(event),code('recovery_pending'));
  for(const collection of [{total_items:2,items:[api(),api()]},{total_items:1,items:[{...api(),response_id:'wrong'}]},
    {total_items:1,items:[{...api(),token:'ambiguous-token'}]},{total_items:1,items:[{...api(),form_id:'wrong'}]}])
    await assert.rejects(reader(async()=>Response.json(collection))(event),code('recovery_conflict'));
});
test('changed answers, reference, completion, mapping or original labels cannot produce recovered content',async()=>{
  const event=await receipt();
  for(const mutate of [(v:any)=>v.answers[1].text='Changed private content',(v:any)=>v.hidden.service_reference='B'.repeat(43),
    (v:any)=>v.answers[0].boolean=false,(v:any)=>v.submitted_at='2026-10-14T16:00:00Z']) {
    const changed=api();mutate(changed);await assert.rejects(reader(async()=>Response.json({total_items:1,items:[changed]}))(event),code('recovery_conflict'));
  }
  const labels=structuredClone(f.definitions.get('synthetic-paid')) as any;labels.fields[1].title='Changed question';f.definitions.set('synthetic-paid',labels);
  await assert.rejects(f.recover(event),code('recovery_conflict'));
});
test('historical/unsupported commitments cannot trigger provider retrieval or a guessed label fallback',async()=>{
  let calls=0;const read=reader(async()=>{calls++;throw Error('forbidden');});
  await assert.rejects(read({...await receipt(),contentDigest:null}),code('recovery_conflict'));assert.equal(calls,0);
  const item=api();item.answers[1].type='unknown';await assert.rejects(reader(async()=>Response.json({total_items:1,items:[item]}))(await receipt()),code('recovery_unavailable'));
  f.definitions.delete('synthetic-paid');await assert.rejects(f.recover(await receipt()),code('recovery_unavailable'));
});
test('transport errors, oversized bodies, redirects and timeouts fail without echoing private/provider values',async()=>{
  const event=await receipt();
  for(const request of [async()=>{throw Error('synthetic-token PRIVATE ANSWER');},async()=>new Response('private',{status:401}),
    async()=>new Response('{}',{headers:{'Content-Type':'text/html'}}),async()=>new Response('{}',{headers:{'Content-Type':'application/json','Content-Length':'99999999'}}),
    async()=>new Response('x'.repeat(2*1024*1024+1),{headers:{'Content-Type':'application/json'}})]) {
    await assert.rejects(reader(request)(event),e=>code('recovery_unavailable')(e)&&!String(e).includes('PRIVATE'));
  }
  await assert.rejects(reader(async()=>new Promise<Response>(()=>{}),{timeoutMs:15})(event),code('recovery_unavailable'));
  assert.throws(()=>reader(async()=>Response.json({}),{timeoutMs:6000}),code('recovery_unavailable'));
});
test('bound preview uses participant recipient, original EN/FR and complete text attachment; it never sends or advances task',async()=>{
  for(const eventId of ['synthetic-paid','synthetic-voucher']) {
    await resolve(eventId);const preview=await f.preview(f.actor,eventId,1);
    assert.equal(preview.message.to,eventId==='synthetic-paid'?'participant-0@example.test':'participant-1@example.test');
    assert.deepEqual(preview.message.cc,['esteve@greenelephant.org','anu@greenelephant.org']);assert.equal(preview.message.from,'service@example.test');
    assert.equal(preview.approvalStatus,'not_approved');assert.equal(preview.emailDelivery,'not_attempted');
    assert.match(preview.message.text,/Fictional reflection for local review only/);assert.match(preview.message.attachments[0].contentUtf8,/Your fictional reflection/);
    assert.ok(preview.message.text.includes(preview.message.attachments[0].contentUtf8));
    assert.match(preview.message.subject,eventId==='synthetic-paid'?/Your Satellite Scan responses/:/Vos réponses au Satellite Scan/);
    assert.match(preview.message.html,/<!DOCTYPE html>/);assert.doesNotMatch(preview.message.text,/same-payer@example/);
  }
  assert.ok((await f.client.query<any>('SELECT state FROM scan_typeform_service_tasks')).rows.every(r=>r.state==='pending_retrieval'));
  assert.ok((await f.client.query<any>('SELECT dashboard_sent FROM satellitescan_purchases')).rows.every(r=>r.dashboard_sent==='false'));
  assert.doesNotMatch(JSON.stringify((await f.client.query('SELECT details FROM audit_logs')).rows),/Fictional reflection|participant-0@|subject|body|AAAAA/);
});
test('unresolved, rejected, old-version and missing locale/recipient evidence cannot reach preview recovery',async()=>{
  await assert.rejects(f.preview(f.actor,'synthetic-paid',0),code('recovery_conflict'));await resolve();
  await assert.rejects(f.preview(f.actor,'synthetic-paid',0),code('recovery_conflict'));
  await f.client.exec('DELETE FROM admin_settings');await assert.rejects(f.preview(f.actor,'synthetic-paid',1),code('recovery_conflict'));
  await f.reset();await resolve();await f.client.exec('UPDATE scan_typeform_service_tasks SET recipient_evidence_ref=null');
  await assert.rejects(f.preview(f.actor,'synthetic-paid',1),code('recovery_conflict'));
});
test('recovery runs outside SQL locks; a changed recipient, refund, version or deactivated owner invalidates the result',async()=>{
  for(const change of ["UPDATE scan_typeform_service_tasks SET recipient_email='changed@example.test'",
    "UPDATE satellitescan_purchases SET status='refunded' WHERE id='synthetic-order-0'",
    "UPDATE scan_typeform_events SET review_version=2 WHERE event_id='synthetic-paid'",
    "UPDATE admin_users SET is_active='false'"]) {
    await f.reset();await resolve();const preview=createScanCompletionPreview(f.database as any,{owner:()=>f.actor.email,sender:'service@example.test',now:()=>f.now,
      recover:async r=>{const result=await f.recover(r);await f.client.exec(change);return result;}});
    await assert.rejects(preview(f.actor,'synthetic-paid',1));
  }
});
test('mutated recovered content or provenance cannot bypass original signed commitments',async()=>{
  await resolve();
  for(const mutate of [(v:any)=>v.content.answers[1].text='tampered',(v:any)=>v.labels[1].title='tampered',
    (v:any)=>v.provenance.responseId='wrong']) {
    const preview=createScanCompletionPreview(f.database as any,{owner:()=>f.actor.email,sender:'service@example.test',now:()=>f.now,
      recover:async r=>{const value=structuredClone(await f.recover(r));mutate(value);return value;}});
    await assert.rejects(preview(f.actor,'synthetic-paid',1),code('recovery_conflict'));
  }
});
test('fingerprint binds sender, full message/attachment and task context; no approval is manufactured',async()=>{
  await resolve();const first=await f.preview(f.actor,'synthetic-paid',1),again=await f.preview(f.actor,'synthetic-paid',1);
  assert.equal(first.fingerprint,again.fingerprint);
  const alternate=createScanCompletionPreview(f.database as any,{owner:()=>f.actor.email,sender:'other@example.test',recover:f.recover,now:()=>f.now});
  assert.notEqual((await alternate(f.actor,'synthetic-paid',1)).fingerprint,first.fingerprint);
  assert.equal(first.approvalStatus,'not_approved');assert.match(first.fingerprint,/^[a-f0-9]{64}$/);
});
test('HTTP preview enforces owner/origin/version and rejects typed content or recipient overrides',async()=>{
  session=undefined;assert.equal((await post()).status,401);
  session={isAdmin:true,adminUserId:f.actor.id,adminGoogleSubject:f.actor.googleId,adminMfaVerified:true,adminGoogleAuthTime:Date.now(),adminAuthenticatedAt:Date.now()};
  await resolve();assert.equal((await post(undefined,{})).status,403);
  assert.equal((await post({expectedVersion:1,to:'payer@example.test'})).status,400);
  assert.equal((await post({expectedVersion:0})).status,409);
  const response=await post();assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');
  assert.equal((await response.json()).approvalStatus,'not_approved');
});
test('failed final audit cannot disclose preview content and does not create a send operation',async()=>{
  await resolve();await f.client.exec(`CREATE OR REPLACE FUNCTION reject_preview_read() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN
    IF NEW.action_type='scan_completion_preview_read' THEN RAISE EXCEPTION 'private content'; END IF; RETURN NEW; END $$;
    CREATE TRIGGER fail_review_audit BEFORE INSERT ON audit_logs FOR EACH ROW EXECUTE FUNCTION reject_preview_read();`);
  const response=await post();assert.equal(response.status,503);assert.deepEqual(await response.json(),{code:'review_unavailable'});
});
test('preview rendering shares the unchanged existing wrapper and cannot initialize providers',async()=>{
  const notification=await readFile('server/email-notifications.ts','utf8');assert.match(notification,/from '\.\/branded-email'/);
  for(const file of ['server/typeform-response-reader.ts','server/scan-completion-preview.ts','server/branded-email.ts']) {
    const source=await readFile(file,'utf8');assert.doesNotMatch(source,/process\.env|from ['"].*(?:resend-client|email-notifications|scheduler)['"]|\bfetch\(/);
  }
  const ui=await readFile('client/src/pages/admin/ScanServiceReview.tsx','utf8');assert.match(ui,/sandbox=""/);assert.match(ui,/default-src \\'none\\'/);
  assert.match(ui,/not approved or sent/);assert.match(ui,/setPreview\(null\)/);
});
