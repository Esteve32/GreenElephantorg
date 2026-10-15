import test,{before,after,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import type {Server} from 'node:http';
import {createHmac} from 'node:crypto';
import {createServiceEmailRuntime} from './service-email-runtime';
import {initialServiceControls,serviceHash,messageRecipients,type ServiceTransaction,type ServiceEmailRepository} from './service-email';
import type {ScanCompletionPreview} from '@shared/scan-service-review';
let state:ServiceTransaction,tail=Promise.resolve(),server:Server,origin:string,env:NodeJS.ProcessEnv,session:any,calls=0,previewFails=false,apiMatches=true;
const actor={id:'owner-one',email:'owner@greenelephant.org',googleId:'12345',role:'super_admin',isActive:'true'};
const message={from:'service@example.test',to:'participant@example.test',cc:['coach@example.test','email@estevepannetier.com'],replyTo:'service@example.test',subject:'Fictional completion',text:'Fictional answer',html:'<p>Fictional answer</p>',attachments:[]};
const preview:ScanCompletionPreview={previewVersion:1,taskId:'task-one',eventId:'event-one',reviewVersion:1,fingerprint:serviceHash('context-message'),contentDigest:serviceHash('answers'),provenance:{version:1,source:'typeform-responses-api',formId:'synthetic-form',responseId:'response-one',retrievedAt:new Date().toISOString(),apiBodyDigest:serviceHash('synthetic-api')},message,approvalStatus:'not_approved',emailDelivery:'not_attempted'};
const repository:ServiceEmailRepository={atomic(work){const task=tail.then(async()=>{const next=structuredClone(state),result=await work(next);state=next;return result;});tail=task.then(()=>{},()=>{});return task;}};
const webhookKey=Buffer.alloc(32,7),webhookSecret='whsec_'+webhookKey.toString('base64');
before(async()=>{
 const app=express();app.use(express.json({verify:(req,_res,buffer)=>{req.rawBody=buffer;}}));app.use((req,_res,next)=>{req.session=session;next();});
 const runtime=createServiceEmailRuntime({transaction:()=>{throw Error('Database validation belongs to Replit');}} as any,{env:()=>env,findAdmin:async()=>actor,repository,
 preview:async()=>{if(previewFails)throw Error('Evidence changed');return structuredClone(preview);},send:async()=>{calls++;return 'provider-one';},
 readEmail:async id=>({id,created_at:new Date().toISOString(),last_event:'delivered',tags:[{name:'service_job',value:apiMatches?serviceHash('completion:task-one'):'wrong-job'},{name:'service_fingerprint',value:preview.fingerprint}]})});runtime.register(app);
 server=await new Promise<Server>(resolve=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));});const address=server.address();assert.ok(address&&typeof address!=='string');origin='http://127.0.0.1:'+address.port;
});
beforeEach(()=>{state={controls:initialServiceControls(),jobs:[],receipts:[]};tail=Promise.resolve();calls=0;previewFails=false;apiMatches=true;
 env={SERVICE_EMAIL_CONTROL_ENABLED:'true',SERVICE_EMAIL_SENDING_ENABLED:'true',SERVICE_EMAIL_CRON_SECRET:'fictional-cron-secret-that-is-longer-than-32',RESEND_SERVICE_WEBHOOK_SECRET:webhookSecret,ADMIN_OWNER_EMAIL:actor.email,PUBLIC_SITE_URL:'https://website.example.test',PRIVACY_ADMIN_GOOGLE_BINDINGS:JSON.stringify({[actor.id]:actor.googleId})};
 session={isAdmin:true,adminUserId:actor.id,adminGoogleSubject:actor.googleId,adminMfaVerified:true,adminGoogleAuthTime:Date.now(),adminAuthenticatedAt:Date.now()};
});
after(async()=>{await new Promise<void>(r=>server.close(()=>r()));});
const post=(path:string,body:unknown,headers:Record<string,string>={Origin:'https://website.example.test'})=>fetch(origin+path,{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body)});
const approve=()=>post('/api/admin/scan-service/event-one/mail/approve',{expectedVersion:1,fingerprint:preview.fingerprint,reviewRef:'exact-human-review'});
const resume=()=>post('/api/admin/scan-service/mail/controls',{expectedVersion:0,paused:false,dailyCap:100,monthlyCap:3000});
test('disabled, missing binding, stale MFA and cross-origin requests cannot change controls',async()=>{
 env.SERVICE_EMAIL_CONTROL_ENABLED='false';assert.equal((await approve()).status,503);env.SERVICE_EMAIL_CONTROL_ENABLED='true';
 delete env.PRIVACY_ADMIN_GOOGLE_BINDINGS;assert.equal((await approve()).status,403);env.PRIVACY_ADMIN_GOOGLE_BINDINGS=JSON.stringify({[actor.id]:actor.googleId});
 session.adminMfaVerified=false;assert.equal((await approve()).status,403);session.adminMfaVerified=true;
 assert.equal((await post('/api/admin/scan-service/mail/controls',{}, {Origin:'https://other.example.test'})).status,403);assert.equal(state.jobs.length,0);assert.equal(calls,0);
});
test('exact approval is distinct from dispatch; cron and manual click cannot duplicate it',async()=>{
 assert.equal((await approve()).status,200);assert.equal(calls,0);assert.equal((await resume()).status,200);
 const id=serviceHash('completion:task-one');const responses=await Promise.all([
 post('/api/admin/scan-service/mail/'+id+'/dispatch',{}),post('/api/internal/service-email-tick',{}, {Authorization:'Bearer '+env.SERVICE_EMAIL_CRON_SECRET})]);
 assert.ok(responses.every(r=>r.status===200));assert.equal(calls,1);assert.equal(state.jobs[0].state,'accepted');
 assert.equal((await approve()).status,409);
});
test('draft change and invalid cron token cause no provider call',async()=>{
 assert.equal((await post('/api/admin/scan-service/event-one/mail/approve',{expectedVersion:1,fingerprint:'f'.repeat(64),reviewRef:'reviewed'})).status,409);
 await approve();await resume();assert.equal((await post('/api/internal/service-email-tick',{}, {Authorization:'Bearer wrong'})).status,401);
 previewFails=true;await post('/api/internal/service-email-tick',{}, {Authorization:'Bearer '+env.SERVICE_EMAIL_CRON_SECRET});assert.equal(calls,0);
});
test('actual HTTP webhook verifies original bytes, deduplicates and pauses on complaint without sending',async()=>{
 await approve();await resume();const jobId=serviceHash('completion:task-one');await post('/api/admin/scan-service/mail/'+jobId+'/dispatch',{});
 const body={type:'email.complained',created_at:new Date().toISOString(),data:{email_id:'provider-one',to:['participant@example.test'],subject:'Must not be retained',tags:{service_job:jobId,service_fingerprint:preview.fingerprint}}};
 const raw=JSON.stringify(body),id='msg_signed-one',timestamp=String(Math.floor(Date.now()/1000)),signature='v1,'+createHmac('sha256',webhookKey).update(id+'.'+timestamp+'.'+raw).digest('base64');
 const send=(payload=raw)=>fetch(origin+'/api/webhooks/resend-service',{method:'POST',headers:{'Content-Type':'application/json','svix-id':id,'svix-timestamp':timestamp,'svix-signature':signature},body:payload});
 assert.equal((await send(raw+' ')).status,401);assert.equal(state.receipts.length,0);
 assert.equal((await send()).status,200);assert.equal((await (await send()).json()).replayed,true);assert.equal(state.controls.paused,true);assert.equal(state.receipts.length,1);assert.equal(calls,1);
 assert.doesNotMatch(JSON.stringify(state.receipts),/participant|retained|subject/);
 const status=await fetch(origin+'/api/admin/scan-service/mail/status');assert.equal(status.headers.get('cache-control'),'no-store');assert.equal((await status.json()).liveProviderVerified,false);
});
test('read-only Resend reconciliation checks exact job/draft tags and never sends again',async()=>{
 await approve();await resume();const jobId=serviceHash('completion:task-one');await post('/api/admin/scan-service/mail/'+jobId+'/dispatch',{});
 apiMatches=false;let response=await post('/api/admin/scan-service/mail/'+jobId+'/reconcile',{expectedVersion:state.jobs[0].version,providerId:'provider-one'});assert.equal(response.status,409);assert.equal(state.receipts.length,0);
 apiMatches=true;response=await post('/api/admin/scan-service/mail/'+jobId+'/reconcile',{expectedVersion:state.jobs[0].version,providerId:'provider-one'});assert.equal(response.status,200);assert.equal((await response.json()).noEmailSent,true);
 assert.equal(state.receipts[0].source,'resend_api_readback');assert.equal(calls,1);assert.ok(state.jobs[0].reports['email.delivered']);
});
