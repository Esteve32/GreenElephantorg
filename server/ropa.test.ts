import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import express from 'express';
import type { Server } from 'node:http';
import type { SessionData } from 'express-session';
import { registerRopaRoutes } from './ropa-routes';
import { emptyRopaRecord, ropaSaveSchema, RopaConflict, RopaNotFound } from '@shared/ropa';

const actor = { id: 'privacy-fixture', email: 'privacy@greenelephant.org', googleId: '12345', role: 'admin', isActive: 'true' };
const activityId = randomUUID();
const record = { ...emptyRopaRecord(), title: 'Fictional course registration' };
const input = () => ({ record, reason: 'Initial fictional entry', expectedVersion: 0, mutationId: randomUUID(), attestReview: false });
let session: Partial<SessionData> | undefined, server: Server, origin: string;
let calls = 0, fail = false, denied = false;
let saveError: Error | undefined;
before(async () => {
  const app = express(); app.use(express.json()); app.use((req, _res, next) => { req.session = session as typeof req.session; next(); });
  const counted = () => { calls++; if (fail) throw Error('private database secret'); };
  registerRopaRoutes(app, { owner: () => 'owner@example.invalid', bindings: () => JSON.stringify({ [actor.id]: actor.googleId }), siteUrl: () => origin,
    findAdmin: async () => denied ? { ...actor, isActive:'false' } : actor,
    store: {
      list: async (_actor, query, exporting) => { counted(); assert.equal(_actor.id,actor.id); return { activities:[{id:activityId,version:1,record,updatedAt:new Date().toISOString()}],nextCursor:null }; },
      detail: async (_actor,id) => { counted(); if (id !== activityId) throw new RopaNotFound(); return { activity:{id,version:1,record,updatedAt:new Date().toISOString()},revisions:[],nextBefore:null }; },
      save: async (_actor, body,id) => { counted(); if(saveError)throw saveError; return {id:id||activityId,version:body.expectedVersion+1,replayed:false}; },
    } });
  server=await new Promise<Server>(resolve=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));});const address=server.address();assert.ok(address&&typeof address!=='string');origin=`http://127.0.0.1:${address.port}`;
});
after(async()=>{await new Promise<void>(resolve=>server.close(()=>resolve()));});
function login(){session={isAdmin:true,adminUserId:actor.id,adminGoogleSubject:actor.googleId,adminMfaVerified:true,adminGoogleAuthTime:1000,adminAuthenticatedAt:Date.now()};}
const base='/api/admin/privacy/activities';
const get=(suffix='')=>fetch(origin+base+suffix);
const post=(body:unknown=input(),headers:Record<string,string>={'Origin':origin},suffix='',method='POST')=>fetch(origin+base+suffix,{method,headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body)});

test('register routes require named privacy access for list, detail, export and writes', async()=>{
  session=undefined;const start=calls;
  for(const suffix of ['', '/export','/'+activityId])assert.equal((await get(suffix)).status,401);
  assert.equal((await post()).status,401);
  login();session!.adminUserId='ordinary-admin';assert.equal((await get()).status,403);
  login();session!.adminMfaVerified=false;assert.equal((await post()).status,403);
  login();session!.adminAuthenticatedAt=Date.now()-31*60*1000;assert.equal((await post()).status,403);
  login();denied=true;assert.equal((await get('/export')).status,403);denied=false;assert.equal(calls,start);
});
test('register writes require configured origin and strict payload; no audit-store call on invalid input',async()=>{
  login();const start=calls;
  for(const headers of [{}, {Origin:'https://untrusted.invalid'}, {Origin:'null'}])assert.equal((await post(input(),headers)).status,403);
  assert.equal((await post({...input(),unexpected:'private field'})).status,400);
  assert.equal((await post({...input(),record:{...record,links:[{kind:'notice',reference:'n1',version:'1',url:'javascript:alert(1)'}]}})).status,400);
  assert.equal((await get('?after=nope')).status,400);assert.equal((await get('?search=x&search=y')).status,400);assert.equal((await get('/export?after='+activityId)).status,400);
  assert.equal(calls,start);
});
test('register responses are no-store, exports exclude consent/case data, and valid versions reach the store',async()=>{
  login();let response=await get();assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');assert.ok(Date.parse((await response.json()).accessExpiresAt)>Date.now());
  response=await get('/export');const body=await response.json();assert.equal(body.scope,'activity_register_only');assert.equal(body.consent,undefined);assert.match(response.headers.get('content-disposition')!,/ropa-activities.json/);
  assert.equal((await post()).status,201);assert.equal((await post({...input(),expectedVersion:1},undefined,'/'+activityId,'PUT')).status,200);
  assert.equal((await get('/'+randomUUID())).status,404);
});
test('store failures and conflicts fail without leaking raw errors or reporting successful saves',async()=>{
  login();fail=true;for(const response of [await get(),await get('/export'),await post()]) {assert.equal(response.status,503);assert.deepEqual(await response.json(),{code:'ropa_unavailable'});}fail=false;
  saveError=new RopaConflict();assert.equal((await post()).status,409);saveError=undefined;
});
test('review labels require complete fields, human evidence and explicit confirmation',()=>{
  assert.equal(ropaSaveSchema.safeParse(input()).success,true);
  const reviewed={...record,status:'reviewed',reviewEvidence:'Fictional human review'};
  assert.equal(ropaSaveSchema.safeParse({...input(),record:reviewed,attestReview:true}).success,false);
  reviewed.fields=Object.fromEntries(Object.keys(record.fields).map(k=>[k,'Fictional assessed value'])) as typeof record.fields;
  assert.equal(ropaSaveSchema.safeParse({...input(),record:reviewed}).success,false);
  assert.equal(ropaSaveSchema.safeParse({...input(),record:reviewed,attestReview:true}).success,true);
  assert.equal(ropaSaveSchema.safeParse({...input(),record:{...reviewed,status:'live_verified'},attestReview:true}).success,false);
});
test('register registration precedes the legacy request-body audit middleware',()=>{
  const source=readFileSync('server/routes.ts','utf8');const start=source.indexOf('export async function registerRoutes');
  assert.ok(source.indexOf('registerRopaRoutes(app,',start)<source.indexOf('app.use("/api/admin", auditMiddleware)',start));
});
