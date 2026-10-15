import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import type { Server } from 'node:http';
import type { SessionData } from 'express-session';
import { adminRoleFor, isTeamEmail, normalizeAdminEmail } from '@shared/admin-access-policy';
import { createCurrentAdminGuard, createNamedOwnerGuard, isRecentNamedOwner } from './admin-current-access';
import { registerAdminTeamRoutes, type TeamChange, TeamChangeError } from './admin-team-routes';
import type { AdminUser } from '@shared/schema';

const ownerEmail='owner@example.invalid';
const owner: AdminUser={id:'owner-fixture',email:ownerEmail,name:null,avatarUrl:null,googleId:'12345',role:'super_admin',invitedBy:null,isActive:'true',createdAt:new Date(),lastLoginAt:null};
const member: AdminUser={...owner,id:'staff-fixture',email:'staff@greenelephant.org',googleId:'67890',role:'admin'};
const named=():Partial<SessionData>=>({isAdmin:true,adminMfaVerified:true,adminGoogleAuthTime:1000,adminUserId:owner.id,adminRole:'super_admin',adminGoogleSubject:owner.googleId!,adminAuthenticatedAt:Date.now()});

test('only the exact team domain or configured owner is allowed; staff cannot inherit owner power',()=>{
 assert.equal(normalizeAdminEmail(42),null);
 assert.equal(isTeamEmail('Staff@GreenElephant.org'),true);
 for(const email of ['staff@greenelephant.org.evil.invalid','staff@sub.greenelephant.org','staff@estevepannetier.com','a@@greenelephant.org'])
   assert.equal(isTeamEmail(email),false);
 assert.equal(adminRoleFor(ownerEmail,'super_admin',ownerEmail),'super_admin');
 assert.equal(adminRoleFor('other@example.invalid','super_admin',ownerEmail),null);
 assert.equal(adminRoleFor(member.email,'super_admin',ownerEmail),'admin');
 assert.equal(adminRoleFor(member.email,'super_admin',undefined),'admin');
 assert.equal(adminRoleFor(ownerEmail,'super_admin',undefined),null);
});

test('owner controls require current active owner identity and fresh Google provenance',()=>{
 assert.ok(isRecentNamedOwner(named(),owner,ownerEmail));
 for(const [session,actor,config] of [
   [{...named(),adminGoogleSubject:undefined},owner,ownerEmail],
   [{...named(),adminAuthenticatedAt:Date.now()-1800000},owner,ownerEmail],
   [{...named(),adminAuthenticatedAt:Date.now()+5000},owner,ownerEmail],
   [named(),{...owner,isActive:'false'},ownerEmail],
   [named(),{...owner,googleId:'000'},ownerEmail],
   [named(),{...owner,role:'admin'},ownerEmail],
   [named(),member,ownerEmail],
   [named(),owner,undefined],
 ] as const) assert.equal(isRecentNamedOwner(session,actor,config),false);
});

let server:Server,origin:string,session:Partial<SessionData>|undefined;
let current:AdminUser|undefined=owner;
let failLookup=false,failChange=false;let commands:TeamChange[]=[];
before(async()=>{
 const app=express();app.use(express.json());
 app.use((req,_res,next)=>{req.session=session as typeof req.session;next();});
 const guard=createCurrentAdminGuard({owner:()=>ownerEmail,findAdmin:async()=>{if(failLookup)throw Error('private DB detail');return current;}});
 app.get('/fixture/current',guard,(req,res)=>res.json({role:req.session.adminRole}));
 app.post('/fixture/write',guard,(_req,res)=>res.json({ok:true}));
 registerAdminTeamRoutes(app,{
  guards:[guard,createNamedOwnerGuard(()=>ownerEmail)],owner:()=>ownerEmail,list:async()=>[owner,member],
  change:async(actor,command)=>{
   assert.equal(actor.id,owner.id);commands.push(command);
   if(failChange)throw Error('private SQL detail');
   if(command.kind!=='invite' && command.id===owner.id)throw new TeamChangeError(403,'The sole owner cannot be changed.');
   return {...member,isActive:command.kind==='deactivate'?'false':'true'};
  },
 });
 server=await new Promise<Server>(resolve=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));});
 const address=server.address();assert.ok(address&&typeof address!=='string');origin='http://127.0.0.1:'+address.port;
});
after(async()=>{if(server)await new Promise<void>((resolve,reject)=>server.close(e=>e?reject(e):resolve()));});
const req=(path:string,method='GET',body?:unknown)=>fetch(origin+path,{method,...(body?{headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{})});

test('current authorization rejects anonymous, deleted, inactive and foreign accounts, and fails closed on database failure',async()=>{
 session=undefined;assert.equal((await req('/fixture/current')).status,401);session=named();
 for(const actor of [undefined,{...owner,isActive:'false'},{...owner,email:'stranger@example.invalid'}]){
  current=actor;assert.equal((await req('/fixture/current')).status,403);
 }
 current=owner;failLookup=true;const response=await req('/fixture/current');
 assert.equal(response.status,503);assert.doesNotMatch(await response.text(),/private|SQL/);failLookup=false;
});

test('stale session roles are refreshed; revoked owner and shared-password identity cannot manage the team',async()=>{
 session=named();current={...member,role:'super_admin'};
 // Session ID is resolved by the real database; the fixture returns the selected current row.
 session.adminUserId=member.id;session.adminGoogleSubject=member.googleId!;
 let response=await req('/fixture/current');assert.deepEqual(await response.json(),{role:'admin'});
 assert.equal((await req('/api/admin/team')).status,403);
 current=owner;session={...named(),adminGoogleSubject:undefined};
 assert.equal((await req('/api/admin/team')).status,401);
 session=named();response=await req('/api/admin/team');assert.equal(response.status,200);
 const rows=await response.json();assert.equal(rows[0].isOwner,true);assert.equal(rows[0].googleId,undefined);
});

test('team invitation validates exact domain and ordinary roles; never accepts injected privileged fields',async()=>{
 session=named();current=owner;const before=commands.length;
 for(const body of [
  {email:'x@outside.invalid',role:'admin'},
  {email:'x@greenelephant.org.evil.invalid',role:'admin'},
  {email:'x@greenelephant.org',role:'super_admin'},
  {email:'x@greenelephant.org',role:'admin',googleId:'attacker'},
  {email:['x@greenelephant.org'],role:'admin'},
 ])assert.equal((await req('/api/admin/team/invite','POST',body)).status,400);
 assert.equal(commands.length,before);
 assert.equal((await req('/api/admin/team/invite','POST',{email:'New@GreenElephant.org',role:'admin'})).status,200);
 assert.deepEqual(commands.at(-1),{kind:'invite',email:'new@greenelephant.org',name:null,role:'admin'});
});

test('team changes permit only role/status; legacy DELETE becomes reversible deactivation',async()=>{
 session=named();current=owner;
 for(const body of [{role:'super_admin'},{googleId:'attacker'},{email:'attacker@greenelephant.org'},{isActive:true},{}])
  assert.equal((await req('/api/admin/team/staff-fixture','PATCH',body)).status,400);
 let response=await req('/api/admin/team/staff-fixture','DELETE');assert.equal(response.status,200);
 assert.equal((await response.json()).isActive,'false');assert.deepEqual(commands.at(-1),{kind:'deactivate',id:member.id});
 assert.equal((await req('/api/admin/team/owner-fixture','DELETE')).status,403);
 assert.equal((await req('/api/admin/team/staff-fixture','PATCH',{isActive:'true'})).status,200);
});

test('failed audited access change does not report success or expose internal errors',async()=>{
 session=named();current=owner;failChange=true;
 const response=await req('/api/admin/team/staff-fixture','PATCH',{role:'viewer'});
 assert.equal(response.status,503);assert.doesNotMatch(await response.text(),/private|SQL/);
 failChange=false;
});

test('current authorization blocks viewer writes even if a legacy route omits its own write-role middleware',async()=>{
 session={...named(),adminUserId:member.id,adminGoogleSubject:member.googleId!};current={...member,role:'viewer'};
 assert.equal((await req('/fixture/current')).status,200);
 assert.equal((await req('/fixture/write','POST',{})).status,403);
 current=member;assert.equal((await req('/fixture/write','POST',{})).status,200);
 current=owner;session=named();
});
