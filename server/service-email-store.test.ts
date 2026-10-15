/** Database validation companion for the Replit agent. Deliberately not executed on the local Mac. */
import test,{before,beforeEach,after} from 'node:test';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {drizzle} from 'drizzle-orm/pglite';
import {readFile} from 'node:fs/promises';
import {createServiceEmailRepository} from './service-email-store';
import {createServiceEmailOperations,serviceHash,messageRecipients,type ServiceMessage} from './service-email';
let client:PGlite,ops:ReturnType<typeof createServiceEmailOperations>,calls=0;
const now=new Date('2026-10-15T12:00:00Z'),message:ServiceMessage={from:'service@example.test',to:'fictional@example.test',subject:'Fictional',text:'Fictional body'};
const fingerprint=serviceHash(message),send=async()=>{calls++;return 'provider-one';};
before(async()=>{
 client=new PGlite();await client.exec(`CREATE TABLE audit_logs(id varchar PRIMARY KEY DEFAULT gen_random_uuid(),user_email text NOT NULL,action_type text NOT NULL,resource text,details jsonb,ip_address text,created_at timestamp NOT NULL DEFAULT now());
 CREATE TABLE privacy_workflow_records(id varchar PRIMARY KEY DEFAULT gen_random_uuid(),kind text NOT NULL,scope_key text NOT NULL,subject_id varchar,version integer NOT NULL DEFAULT 0,data jsonb NOT NULL,updated_at timestamp NOT NULL DEFAULT now());`);
 await client.exec(await readFile('migrations/20261015_service_email.sql','utf8'));
 ops=createServiceEmailOperations(createServiceEmailRepository(drizzle(client) as any),{now:()=>now});
});
beforeEach(async()=>{calls=0;await client.exec('DROP TRIGGER IF EXISTS fail_service_audit ON audit_logs;TRUNCATE service_email_control,service_email_jobs,service_email_receipts,audit_logs,privacy_workflow_records;');});
after(async()=>{await client.close();});
async function ready(){await ops.approve({id:'job-one',kind:'completion',fingerprint,messageDigest:serviceHash(message),approvedBy:'fictional-owner',recipients:messageRecipients(message)},0);await ops.controls({expectedVersion:0,paused:false,dailyCap:100,monthlyCap:3000},'fictional-owner');}
async function failAudit(action:string){await client.exec(`CREATE OR REPLACE FUNCTION fail_service_audit_fn() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW.action_type='${action}' THEN RAISE EXCEPTION 'fictional audit failure'; END IF; RETURN NEW; END $$; CREATE TRIGGER fail_service_audit BEFORE INSERT ON audit_logs FOR EACH ROW EXECUTE FUNCTION fail_service_audit_fn();`);}
test('real SQL migration persists claims and preserves duplicate protection after repository reconstruction',async()=>{
 await ready();await ops.dispatch('job-one',message,fingerprint,send,true);
 const restarted=createServiceEmailOperations(createServiceEmailRepository(drizzle(client) as any),{now:()=>new Date(now.getTime()+48*3600_000)});
 await restarted.dispatch('job-one',message,fingerprint,send,true);assert.equal(calls,1);assert.equal((await restarted.read()).jobs[0].providerId,'provider-one');
});
test('audit failure rolls back claim/quota before any provider call',async()=>{
 await ready();await failAudit('service_email_submitting');await assert.rejects(ops.dispatch('job-one',message,fingerprint,send,true));assert.equal(calls,0);
 const state=await ops.read();assert.equal(state.jobs[0].state,'approved');assert.equal(state.controls.dailyReserved,undefined);
});
test('lost post-send commit stays submitting and cannot send twice; a matching receipt reconciles it',async()=>{
 await ready();await failAudit('service_email_accepted');await assert.rejects(ops.dispatch('job-one',message,fingerprint,send,true));assert.equal(calls,1);
 await ops.dispatch('job-one',message,fingerprint,send,true);assert.equal(calls,1);assert.equal((await ops.read()).jobs[0].state,'submitting');
 await client.exec('DROP TRIGGER fail_service_audit ON audit_logs');await ops.receipt({id:'receipt-one',digest:serviceHash('signed-fixture'),jobId:'job-one',fingerprint,providerId:'provider-one',type:'email.delivered',occurredAt:now.toISOString(),source:'signed_webhook'});
 assert.equal((await ops.read()).jobs[0].state,'accepted');
});
test('persisted privacy recovery hold blocks the shared service dispatcher',async()=>{
 await ready();await client.exec(`INSERT INTO privacy_workflow_records(kind,scope_key,data) VALUES('recovery','processing_hold','{"hold":true}');`);
 await ops.dispatch('job-one',message,fingerprint,send,true);assert.equal(calls,0);assert.equal((await ops.read()).jobs[0].reason,'privacy_recovery_hold');
});
