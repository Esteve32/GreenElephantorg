import test,{before,beforeEach,after} from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { createPrivacyWorkflowStore,recordWorkflowWithdrawal,confirmationToken } from './privacy-workflow-store';
import { createPrivacyOperations,weeklyOccurrence } from './privacy-workflow-operations';
import { createMarketingPermissionGate } from './marketing-permission-store';
import { monthReviewTarget } from '../shared/privacy-workflows';
let client:PGlite,store:ReturnType<typeof createPrivacyWorkflowStore>,ops:ReturnType<typeof createPrivacyOperations>,database:any;
const actor={id:'owner',email:'owner@example.test',googleId:'123',isActive:'true',role:'super_admin'};
const key=Buffer.alloc(32,7);let clock=new Date('2026-10-15T10:00:00Z');
const mail={from:'Green Elephant <privacy@example.test>',replyTo:'reply@example.test',aliases:['privacy@example.test','owner@example.test'],traceCc:['email@estevepannetier.com'],origin:'https://example.test',confirmationKey:key,weeklyRecipients:{owner:'owner@example.test',daily:'daily@example.test'}};
const query=async(sql:string,args:any[]=[])=> (await client.query<any>(sql,args)).rows;
const row=async(id:string)=>(await query('SELECT * FROM privacy_workflow_records WHERE id=$1',[id]))[0];
const consent=async()=>(await query("SELECT * FROM privacy_workflow_records WHERE kind='consent'"))[0];
const jobs=async() => query("SELECT * FROM privacy_workflow_records WHERE kind='attention' ORDER BY scope_key");
async function notice(version='1'){const r=await store.publishNotice(actor,{mutationId:randomUUID(),purpose:'marketing_updates',noticeVersion:version,english:'Receive optional Green Elephant learning updates. Unsubscribe at any time.',french:'Recevez les actualités facultatives de Green Elephant. Désinscription à tout moment.',reviewRef:'synthetic-owner-review'});return r.record.id;}
async function pending(){const noticeId=await notice(),mutationId=randomUUID();await store.requestSubscription({email:'person@example.test',noticeId,mutationId});return{noticeId,challenge:mutationId,token:confirmationToken(mutationId,key)};}
async function intake(sourceId='request-one'){return store.intakeCase({mutationId:randomUUID(),source:'operator',sourceId,receivedAt:clock.toISOString(),kind:'access'},actor);}
async function action(id:string,name:string,extra:Record<string,unknown>={}){const r=await row(id);return store.caseAction(actor,id,{mutationId:randomUUID(),expectedVersion:r.version,action:name,reason:'synthetic operator review',...extra});}
before(async()=>{
 client=new PGlite();
 await client.exec(`CREATE TABLE contacts(id varchar PRIMARY KEY DEFAULT gen_random_uuid(),email text UNIQUE NOT NULL,name text,consent_given text NOT NULL,consent_text text NOT NULL,consented_at timestamp NOT NULL DEFAULT now(),source text NOT NULL,channels_reached text[],created_at timestamp NOT NULL DEFAULT now(),notion_page_id text,notion_synced_at timestamp,scan_submitted_at timestamp);
 CREATE TABLE admin_settings(key varchar PRIMARY KEY,value text NOT NULL,updated_at timestamp NOT NULL DEFAULT now());
 CREATE TABLE admin_users(id varchar PRIMARY KEY,email text UNIQUE NOT NULL,name text,avatar_url text,google_id text UNIQUE,role text NOT NULL,is_active text NOT NULL,invited_by text,created_at timestamp NOT NULL DEFAULT now(),last_login_at timestamp);
 CREATE TABLE audit_logs(id varchar PRIMARY KEY DEFAULT gen_random_uuid(),user_email text NOT NULL,action_type text NOT NULL,resource text,details jsonb,ip_address text,created_at timestamp NOT NULL DEFAULT now());`);
 await client.exec(await readFile('migrations/20261015_privacy_workflows.sql','utf8'));
 database=drizzle(client);store=createPrivacyWorkflowStore(database,{ownerEmail:()=>actor.email,confirmationKey:()=>key,now:()=>clock});
 ops=createPrivacyOperations(database,{ownerEmail:()=>actor.email,mailConfiguration:async()=>structuredClone(mail),now:()=>clock});
});
beforeEach(async()=>{clock=new Date('2026-10-15T10:00:00Z');await client.exec(`DROP TRIGGER IF EXISTS reject_history ON privacy_workflow_events;TRUNCATE privacy_workflow_events,privacy_workflow_records,contacts,admin_settings,admin_users,audit_logs CASCADE;INSERT INTO admin_users(id,email,google_id,role,is_active) VALUES('owner','owner@example.test','123','super_admin','true');`);});
after(async()=>{await client?.close();});
test('new request is pending; a legacy flag and readiness never create a confirmed choice',async()=>{
 await pending();const c=await consent();assert.equal(c.data.state,'pending');assert.equal((await query('SELECT consent_given FROM contacts'))[0].consent_given,'false');assert.equal((await jobs()).length,1);assert.equal((await jobs())[0].data.state,'pending_approval');
});
test('current notice, fresh confirmation and withdrawal are ordered; an old link cannot revive a choice',async()=>{
 const p=await pending();assert.equal((await store.confirm(p.challenge,p.token)).confirmed,true);assert.equal((await store.confirm(p.challenge,p.token)).replayed,true);
 const c=await consent();await database.transaction(async(tx:any)=>{await recordWorkflowWithdrawal(tx,c.subject_id,clock);await tx.execute("UPDATE contacts SET consent_given='false'");});
 await assert.rejects(store.confirm(p.challenge,p.token));assert.equal((await consent()).data.state,'withdrawn');
 const next=randomUUID();await store.requestSubscription({email:'person@example.test',noticeId:p.noticeId,mutationId:next});await assert.rejects(store.confirm(p.challenge,p.token));await store.confirm(next,confirmationToken(next,key));
 assert.equal((await consent()).data.state,'confirmed');assert.deepEqual((await query("SELECT action FROM privacy_workflow_events WHERE record_id=$1 ORDER BY version",[c.id])).map(x=>x.action),['pending','confirmed','withdrawn','pending','confirmed']);
});
test('expired, incorrect and superseded-notice proofs never grant marketing',async()=>{
 const p=await pending();await assert.rejects(store.confirm(p.challenge,'A'.repeat(43)));await notice('2');await assert.rejects(store.confirm(p.challenge,p.token));clock=new Date(clock.getTime()+25*3600000);await assert.rejects(store.confirm(p.challenge,p.token));assert.equal((await consent()).data.state,'pending');
});
test('duplicate signup is not duplicate email work and changed mutation identity is refused',async()=>{
 const p=await pending();await store.requestSubscription({email:'person@example.test',noticeId:p.noticeId,mutationId:p.challenge});await store.requestSubscription({email:'person@example.test',noticeId:p.noticeId,mutationId:randomUUID()});assert.equal((await jobs()).length,1);
 await assert.rejects(store.requestSubscription({email:'another@example.test',noticeId:p.noticeId,mutationId:p.challenge}));assert.equal((await query('SELECT count(*)::int AS n FROM contacts'))[0].n,1);
});
test('notice versions are immutable and repeated publish cannot restore an old active notice',async()=>{
 const request={mutationId:randomUUID(),purpose:'marketing_updates',noticeVersion:'1',english:'Optional updates. You can leave at any time.',french:'Actualités facultatives. Désinscription à tout moment.',reviewRef:'review-one'};
 const first=await store.publishNotice(actor,request);await notice('2');assert.equal((await store.publishNotice(actor,request)).replayed,true);assert.notEqual((await store.publicNotice()).id,first.record.id);
 await assert.rejects(store.publishNotice(actor,{...request,mutationId:randomUUID(),english:'Changed wording cannot replace the preserved notice.'}));
});
test('history failure rolls back consent and queued mail together',async()=>{
 const id=await notice();await client.exec(`CREATE FUNCTION reject_test_history() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic'; END $$;CREATE TRIGGER reject_history BEFORE INSERT ON privacy_workflow_events FOR EACH ROW EXECUTE FUNCTION reject_test_history();`);
 await assert.rejects(store.requestSubscription({email:'person@example.test',noticeId:id,mutationId:randomUUID()}));assert.equal((await jobs()).length,0);assert.equal((await query('SELECT count(*)::int n FROM contacts'))[0].n,0);
});
test('case identity is source-scoped, not email-scoped; changed intake metadata is a conflict',async()=>{
 const first=await intake();assert.equal((await intake()).replayed,true);const second=await intake('request-two');assert.notEqual(first.caseId,second.caseId);await assert.rejects(store.intakeCase({mutationId:randomUUID(),source:'operator',sourceId:'request-one',receivedAt:clock.toISOString(),kind:'erasure'},actor));assert.equal((await row(first.caseId)).data.ownerId,'owner');assert.equal((await jobs()).length,2);
});
test('case resolution needs reviewed identity, outcome evidence and no hold',async()=>{
 const c=await intake();await assert.rejects(action(c.caseId,'resolve'));await action(c.caseId,'verify_identity',{receiptRef:'identity-receipt'});await action(c.caseId,'record_outcome',{receiptRef:'outcome-receipt'});await action(c.caseId,'hold');await assert.rejects(action(c.caseId,'resolve'));await action(c.caseId,'reopen');await action(c.caseId,'resolve');assert.equal((await row(c.caseId)).data.state,'resolved');
});
test('stale versions and inactive administrators cannot change cases or read records',async()=>{
 const c=await intake();await assert.rejects(store.caseAction(actor,c.caseId,{mutationId:randomUUID(),expectedVersion:0,action:'hold',reason:'stale request'}));await client.exec("UPDATE admin_users SET is_active='false'");await assert.rejects(store.detail(actor,c.caseId));await assert.rejects(store.list(actor,'case'));await assert.rejects(action(c.caseId,'hold'));
});
test('mail is a reviewable draft with trace CC; approval binds all envelope fields',async()=>{
 await pending();const [job]=await jobs(),preview=await ops.preview(actor,job.id);assert.deepEqual(preview.envelope.cc,['email@estevepannetier.com']);assert.equal(preview.delivery,'not_attempted');assert.equal(preview.approval,'not_approved');let sends=0;
 assert.equal((await ops.dispatch(job.id,async()=>{sends++;return{providerId:'receipt-one'};},true)).state,'held');
 await assert.rejects(ops.approve(actor,job.id,{expectedVersion:job.version,fingerprint:'0'.repeat(64),reviewRef:'review'}));
 await ops.approve(actor,job.id,{expectedVersion:job.version,fingerprint:preview.fingerprint,reviewRef:'exact-draft-review'});
 assert.equal((await ops.dispatch(job.id,async(draft,id)=>{sends++;assert.equal(id,'privacy:'+job.id);assert.deepEqual(draft,preview.envelope);return{providerId:'receipt-one'};},true)).state,'accepted');assert.equal(sends,1);assert.equal((await row(job.id)).data.delivery,'unverified');
 assert.equal((await ops.dispatch(job.id,async()=>{sends++;return{providerId:'duplicate'};},true)).state,'held');assert.equal(sends,1);
});
test('unknown provider acceptance is retained and never blindly resubmitted',async()=>{
 await pending();const [job]=await jobs(),p=await ops.preview(actor,job.id);await ops.approve(actor,job.id,{expectedVersion:0,fingerprint:p.fingerprint,reviewRef:'review'});let calls=0;
 assert.equal((await ops.dispatch(job.id,async()=>{calls++;throw Error('timeout');},true)).state,'unknown');await ops.dispatch(job.id,async()=>{calls++;return{providerId:'unsafe-retry'};},true);assert.equal(calls,1);
});
test('provider receipt deduplication cannot downgrade a bounce to delivered',async()=>{
 await pending();const [job]=await jobs(),p=await ops.preview(actor,job.id);await ops.approve(actor,job.id,{expectedVersion:0,fingerprint:p.fingerprint,reviewRef:'review'});await ops.dispatch(job.id,async()=>({providerId:'receipt-one'}),true);
 await ops.recordDelivery('receipt-one','event-bounce','bounced');await ops.recordDelivery('receipt-one','event-bounce','bounced');await ops.recordDelivery('receipt-one','event-late','delivered');assert.equal((await row(job.id)).data.state,'bounced');assert.equal((await query("SELECT count(*)::int n FROM privacy_workflow_records WHERE kind='connector'"))[0].n,2);
});
test('processing recovery blocks optional sends and needs an explicit reviewed resume',async()=>{
 await pending();const [job]=await jobs(),p=await ops.preview(actor,job.id);await ops.approve(actor,job.id,{expectedVersion:0,fingerprint:p.fingerprint,reviewRef:'review'});await store.beginRecovery(actor,{mutationId:randomUUID(),reason:'restore rehearsal'});assert.equal((await ops.dispatch(job.id,async()=>{throw Error('must not call');},true)).state,'held');
 await assert.rejects(ops.finishRecovery(actor,{expectedVersion:0,reviewRef:'review'}));await ops.finishRecovery(actor,{expectedVersion:1,reviewRef:'reconciled against withdrawal receipts'});assert.equal((await ops.dispatch(job.id,async()=>({providerId:'after-reconciliation'}),true)).state,'accepted');
});
test('weekly digest is off by default; enabling it waits for the next weekly occurrence and deduplicates ticks',async()=>{
 await ops.tick();assert.equal((await jobs()).length,0);await store.saveNotifications(actor,{mutationId:randomUUID(),expectedVersion:0,weeklyEnabled:true,timeZone:'Europe/Helsinki',weekday:4,hour:8,minute:0,recipientRefs:['owner'],reviewRef:'reviewed weekly schedule'});await ops.tick();assert.equal((await jobs()).length,0);
 clock=new Date('2026-10-22T10:00:00Z');await ops.tick();await ops.tick();const all=await jobs();assert.equal(all.length,1);assert.equal(all[0].data.kind,'weekly_digest');assert.equal(all[0].data.state,'pending_approval');
});
test('retention dry run has no side effects and a changed record or hold invalidates the reviewed plan',async()=>{
 const c=await intake();await action(c.caseId,'verify_identity',{receiptRef:'identity'});await action(c.caseId,'record_outcome',{receiptRef:'fulfilled'});await action(c.caseId,'resolve');const policy=await store.saveRetention(actor,{mutationId:randomUUID(),expectedVersion:0,scope:'closed_case_links',days:5,purpose:'synthetic metadata cleanup',reviewRef:'synthetic owner policy'});clock=new Date('2026-10-25T10:00:00Z');const plan=await ops.retentionPlan(actor,policy.record.id);assert.equal(plan.selected.length,1);assert.equal((await row(c.caseId)).data.state,'resolved');await action(c.caseId,'hold');await assert.rejects(ops.applyRetention(actor,plan.digest,'reviewed dry run'));assert.equal((await row(c.caseId)).data.hold,true);
});
test('approved retention only redacts its named metadata; providers and backups remain explicit outstanding work',async()=>{
 const c=await intake();await action(c.caseId,'verify_identity',{receiptRef:'identity'});await action(c.caseId,'record_outcome',{receiptRef:'fulfilled'});await action(c.caseId,'resolve');const policy=await store.saveRetention(actor,{mutationId:randomUUID(),expectedVersion:0,scope:'closed_case_links',days:5,purpose:'synthetic metadata cleanup',reviewRef:'synthetic owner policy'});clock=new Date('2026-10-25T10:00:00Z');const plan=await ops.retentionPlan(actor,policy.record.id);assert.deepEqual(await ops.applyRetention(actor,plan.digest,'reviewed dry run'),{applied:1,providers:'not_processed',backups:'not_processed'});assert.equal((await row(c.caseId)).subject_id,null);assert.equal((await row(c.caseId)).data.state,'redacted');await assert.rejects(ops.applyRetention(actor,plan.digest,'same plan cannot repeat'));
});
test('calendar review targets clamp month ends without claiming a legal deadline',()=>{
 assert.equal(monthReviewTarget(new Date('2026-01-31T12:00:00Z')).toISOString(),'2026-02-28T12:00:00.000Z');
 const c={timeZone:'Europe/Helsinki',weekday:0,hour:3,minute:30};assert.equal(weeklyOccurrence(new Date('2026-10-25T00:45:00Z'),c),weeklyOccurrence(new Date('2026-10-25T01:45:00Z'),c));
});

test('permission gate checks current notice, withdrawal and exact recipient immediately before submission',async()=>{
 const p=await pending(),gate=createMarketingPermissionGate(database);let sent=0;const send=async()=>{sent++;return'receipt';};const c=await consent();assert.equal((await gate(c.subject_id,'person@example.test',send)).allowed,false);await store.confirm(p.challenge,p.token);assert.equal((await gate(c.subject_id,'other@example.test',send)).allowed,false);assert.equal((await gate(c.subject_id,'person@example.test',send)).allowed,true);await database.transaction((tx:any)=>recordWorkflowWithdrawal(tx,c.subject_id,clock));assert.equal((await gate(c.subject_id,'person@example.test',send)).allowed,false);assert.equal(sent,1);
});
test('signed negative choice records refusal without creating a grant or letting the old positive link replay',async()=>{const p=await pending();await store.refuse(p.challenge,p.token);assert.equal((await consent()).data.state,'refused');await assert.rejects(store.confirm(p.challenge,p.token));assert.equal((await query('SELECT consent_given FROM contacts'))[0].consent_given,'false');});
