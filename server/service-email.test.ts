import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {Resend} from 'resend';
import {createServiceEmailOperations,initialServiceControls,serviceHash,messageRecipients,serviceMessageCodec,
 type ServiceEmailRepository,type ServiceTransaction,type ServiceMessage,type ServiceReceipt} from './service-email';

// Serialized memory repository only. No database, credentials, sockets or provider calls.
function fixture(){
 let state:ServiceTransaction={controls:initialServiceControls(),jobs:[],receipts:[]},tail=Promise.resolve(),time=new Date('2026-10-15T12:00:00Z');
 const repo:ServiceEmailRepository={atomic(work){const task=tail.then(async()=>{const next=structuredClone(state),result=await work(next);state=next;return result;});tail=task.then(()=>{},()=>{});return task;}};
 const ops=createServiceEmailOperations(repo,{now:()=>time}),message:ServiceMessage={from:'service@example.test',to:'participant@example.test',cc:['coach@example.test','trace@example.test'],subject:'Fictional service draft',text:'Fictional answers only'};
 const fingerprint=serviceHash(message);let calls=0;
 const send=async(_m:ServiceMessage,key:string,tags:{name:string;value:string}[])=>{calls++;assert.equal(key,'service:job-one');assert.equal(tags[1].value,fingerprint);return'resend-one';};
 const approve=(jobId='job-one',fp=fingerprint)=>ops.approve({id:jobId,kind:'completion',eventId:'event-one',fingerprint:fp,messageDigest:serviceHash(message),recipients:messageRecipients(message),approvedBy:'owner-one'},0);
 const resume=async(cap=100)=>{const c=(await ops.read()).controls;await ops.controls({expectedVersion:c.version,paused:false,dailyCap:cap,monthlyCap:3000});};
 const receipt=(type:ServiceReceipt['type']='email.delivered',rid='receipt-one'):ServiceReceipt=>({id:rid,digest:serviceHash({rid,type}),jobId:'job-one',fingerprint,providerId:'resend-one',type,occurredAt:time.toISOString()});
 return{ops,message,fingerprint,send,approve,resume,receipt,calls:()=>calls,snapshot:()=>structuredClone(state),advance:(ms:number)=>{time=new Date(time.getTime()+ms);}};
}
test('default gates and pause never call a provider; refresh never submits',async()=>{
 const f=fixture();await f.approve();await f.ops.read();assert.deepEqual(await f.ops.tick(),[]);assert.equal((await f.ops.dispatch('job-one',f.message,f.fingerprint,f.send,true)).attempted,false);
 await assert.rejects(f.ops.dispatch('job-one',f.message,f.fingerprint,f.send,false));assert.equal(f.calls(),0);assert.equal(f.snapshot().jobs[0].attemptedAt,undefined);
});
test('parallel cron/manual clicks submit once and stay deduplicated after 24 hours',async()=>{
 const f=fixture();await f.approve();await f.resume();await Promise.all(Array.from({length:12},()=>f.ops.dispatch('job-one',f.message,f.fingerprint,f.send,true)));
 f.advance(48*3600_000);await f.ops.dispatch('job-one',f.message,f.fingerprint,f.send,true);assert.equal(f.calls(),1);assert.equal(f.snapshot().jobs[0].state,'accepted');
});
test('timeout, rejected quota response and missing IDs remain unknown with no retry',async()=>{
 for(const send of [async()=>{throw Error('429 synthetic quota');},async()=>{throw Error('timeout');},async()=> '']){
  const f=fixture();await f.approve();await f.resume();let calls=0;const uncertain=async()=>{calls++;return send();};
  await f.ops.dispatch('job-one',f.message,f.fingerprint,uncertain,true);await f.ops.dispatch('job-one',f.message,f.fingerprint,uncertain,true);
  assert.equal(calls,1);assert.equal(f.snapshot().jobs[0].state,'unknown');await assert.rejects(f.approve());
 }
});
test('changed content, recipient or CC cannot use an earlier approval',async()=>{
 for(const change of [{to:'other@example.test'},{text:'Changed answer content'},{subject:'Changed subject'},{cc:['another@example.test']}]){
 const f=fixture();await f.approve();await f.resume();await f.ops.dispatch('job-one',{...f.message,...change},f.fingerprint,f.send,true);assert.equal(f.calls(),0);assert.equal(f.snapshot().jobs[0].state,'held');}
});
test('all recipient copies count toward UTC daily/monthly budget; no blind release',async()=>{
 const f=fixture();await f.approve();await f.resume(2);await f.ops.dispatch('job-one',f.message,f.fingerprint,f.send,true);assert.equal(f.calls(),0);assert.equal(f.snapshot().jobs[0].reason,'local_quota_hold');
 await f.resume(3);await f.ops.dispatch('job-one',f.message,f.fingerprint,f.send,true);assert.equal(f.snapshot().controls.dailyReserved,3);
 await f.approve('job-two');f.advance(2000);await f.ops.dispatch('job-two',f.message,f.fingerprint,async()=>{throw Error('Must not send');},true);assert.equal(f.snapshot().jobs[1].reason,'local_quota_hold');
 f.advance(24*3600_000);await f.ops.dispatch('job-two',f.message,f.fingerprint,async()=> 'resend-two',true);assert.equal(f.snapshot().controls.dailyReserved,3);assert.equal(f.snapshot().controls.monthlyReserved,6);
});
test('cross-job rate reservation works across simultaneous worker calls',async()=>{
 const f=fixture();await f.approve();await f.approve('job-two');await f.resume();let calls=0;
 await Promise.all(['job-one','job-two'].map(j=>f.ops.dispatch(j,f.message,f.fingerprint,async()=>{calls++;return 'provider-'+j;},true)));
 assert.equal(calls,1);assert.equal(f.snapshot().jobs[1].reason,'rate_limit_wait');
});
test('hold and stale settings updates cannot silently resume or send',async()=>{
 const f=fixture();await f.approve();await f.resume();await f.ops.hold('job-one',1);await f.ops.dispatch('job-one',f.message,f.fingerprint,f.send,true);assert.equal(f.calls(),0);
 await assert.rejects(f.ops.controls({expectedVersion:0,paused:false,dailyCap:100,monthlyCap:3000}));
 await assert.rejects(f.ops.controls({expectedVersion:1,paused:false,dailyCap:101,monthlyCap:3000}));
});
test('signed delivery facts deduplicate; old sent/delivered never erase failures',async()=>{
 const f=fixture();await f.approve();await f.resume();await f.ops.dispatch('job-one',f.message,f.fingerprint,f.send,true);
 await f.ops.receipt(f.receipt('email.bounced'));assert.equal(f.snapshot().controls.paused,true);
 assert.equal((await f.ops.receipt(f.receipt('email.bounced'))).replayed,true);
 await f.ops.receipt(f.receipt('email.sent','receipt-two'));await f.ops.receipt(f.receipt('email.delivered','receipt-three'));
 assert.ok(f.snapshot().jobs[0].reports['email.bounced']);assert.equal(f.calls(),1);
 await assert.rejects(f.ops.receipt({...f.receipt('email.bounced'),digest:'a'.repeat(64)}));
});
test('a delivery receipt arriving before API acknowledgement reconciles an uncertain send',async()=>{
 const f=fixture();await f.approve();await f.resume();await f.ops.dispatch('job-one',f.message,f.fingerprint,async()=>{
  await f.ops.receipt(f.receipt());throw Error('API acknowledgement lost');
 },true);assert.equal(f.snapshot().jobs[0].state,'accepted');assert.equal(f.snapshot().jobs[0].providerId,'resend-one');
});
test('wrong provider, draft tag, job, timestamp or never-attempted event is rejected',async()=>{
 const f=fixture();await f.approve();await assert.rejects(f.ops.receipt(f.receipt()));await f.resume();await f.ops.dispatch('job-one',f.message,f.fingerprint,f.send,true);
 for(const change of [{providerId:'wrong'},{fingerprint:'a'.repeat(64)},{jobId:'wrong'},{occurredAt:'invalid'}])await assert.rejects(f.ops.receipt({...f.receipt(),...change}));
 assert.equal(f.snapshot().receipts.length,0);
});
test('encrypted pending purchase snapshot binds exact job and fingerprint; never exposed by status',async()=>{
 const f=fixture(),codec=serviceMessageCodec('09'.repeat(32)),sealed=codec.seal('job-one',f.fingerprint,f.message);
 const job=await f.ops.approve({id:'job-one',kind:'purchase_customer',fingerprint:f.fingerprint,messageDigest:serviceHash(f.message),recipients:messageRecipients(f.message),approvedBy:'existing-trigger',sealed},0);
 assert.doesNotMatch(JSON.stringify(sealed),/Fictional|participant/);assert.deepEqual(codec.open(job),f.message);
 assert.throws(()=>codec.open({...job,id:'another-job'}));assert.throws(()=>serviceMessageCodec('08'.repeat(32)).open(job));
 assert.equal((await f.ops.read()).jobs[0].sealed,undefined);assert.throws(()=>serviceMessageCodec('missing'));
});
test('SDK signature verification rejects altered bytes, missing proof and old signed requests',()=>{
 const key=Buffer.alloc(32,9),secret='whsec_'+key.toString('base64'),payload=JSON.stringify({type:'email.delivered',created_at:new Date().toISOString(),data:{email_id:'provider-one'}}),id='msg_synthetic',timestamp=String(Math.floor(Date.now()/1000));
 const signature='v1,'+createHmac('sha256',key).update(id+'.'+timestamp+'.'+payload).digest('base64');
 const sdk=new Resend('fictional-no-network-key');
 assert.equal(sdk.webhooks.verify({payload,headers:{id,timestamp,signature},webhookSecret:secret}).type,'email.delivered');
 assert.throws(()=>sdk.webhooks.verify({payload:payload+' ',headers:{id,timestamp,signature},webhookSecret:secret}));
 assert.throws(()=>sdk.webhooks.verify({payload,headers:{id,timestamp:'1',signature},webhookSecret:secret}));
});
