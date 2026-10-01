import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
let fixture:any;
before(async()=>{
 const root=dirname(fileURLToPath(import.meta.url));
 const mocks:Record<string,string>={
  './db': `let state={purchases:[],settings:[]},failLocale=false,tail=Promise.resolve();
   export function reset(purchases=[],settings=[],fail=false){state={purchases,settings};failLocale=fail;tail=Promise.resolve();}
   export function snapshot(){return structuredClone(state);}
   export const db={transaction(fn){const task=tail.then(async()=>{
    const next=structuredClone(state);
    const tx={insert(table){return {values(value){let done=false,rows=[];function run(){if(done)return rows;done=true;
     if(table.table==='purchases'){if(next.purchases.some(row=>row.stripePaymentIntentId===value.stripePaymentIntentId))return rows;rows=[{id:'new-purchase',...value}];next.purchases.push(...rows);}
     else {next.settings.push(value);if(failLocale)throw Error('synthetic locale write failure');}
     return rows;}
     const query={onConflictDoNothing(){return query;},async returning(){return run();},then(resolve,reject){return Promise.resolve().then(run).then(resolve,reject);}};return query;}}},
     select(){return {from(table){return {async where(condition){return next[table.table].filter(row=>row[condition.column]===condition.value);}}}}}};
    const result=await fn(tx);state=next;return result;
   });tail=task.catch(()=>{});return task;}};`,
  '@shared/schema': `export const satellitescanPurchases={table:'purchases',stripePaymentIntentId:'stripePaymentIntentId'};export const adminSettings={table:'settings',key:'key'};export const coupons={table:'coupons'};`,
  'drizzle-orm': `export const eq=(column,value)=>({column,value});`,
  './email-operations': `export const claimEmailOperation=async()=>{throw Error('provider path forbidden')};export const finishEmailOperation=claimEmailOperation;export const purchaseLanguage=claimEmailOperation;`,
  './email-notifications': `export const sendSatellitescanPurchaseEmail=async()=>{throw Error('provider forbidden')};export const sendSatellitescanReminderEmail=sendSatellitescanPurchaseEmail;`,
  './storage': `export const storage={};`,
 };
 const bundle=await build({stdin:{contents:'export {recordPaidScan} from "./scan-purchase-service";export {reset,snapshot} from "./db";export {operationKey} from "./delivery-security";',resolveDir:root},bundle:true,write:false,platform:'node',format:'esm',plugins:[{name:'no-runtime-services',setup(b){
  b.onResolve({filter:/.*/},args=>Object.hasOwn(mocks,args.path)?{path:args.path,namespace:'fixture'}:undefined);
  b.onLoad({filter:/.*/,namespace:'fixture'},args=>({contents:mocks[args.path],loader:'js'}));
 }}]});
 fixture=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
});
test('historical paid purchase without locale marker is reconciliation-only',async()=>{
 fixture.reset([{id:'old',stripePaymentIntentId:'pi_old',customerEmail:'synthetic@example.test'}]);
 const result=await fixture.recordPaidScan('pi_old','synthetic@example.test','Synthetic','fr');
 assert.equal(result.notifyAllowed,false);assert.equal(result.purchase.id,'old');
 assert.equal(fixture.snapshot().settings.length,0);
});
test('new purchase and French marker commit atomically; replay preserves original locale',async()=>{
 fixture.reset();
 const first=await fixture.recordPaidScan('pi_new','synthetic@example.test','Synthetic','fr');
 assert.equal(first.notifyAllowed,true);
 const second=await fixture.recordPaidScan('pi_new','synthetic@example.test','Synthetic','en');
 assert.equal(second.notifyAllowed,true);
 const state=fixture.snapshot();assert.equal(state.purchases.length,1);assert.equal(state.settings.length,1);assert.equal(state.settings[0].value,'fr');
});
test('failed locale persistence rolls back purchase so retry can finish safely',async()=>{
 fixture.reset([],[],true);
 await assert.rejects(fixture.recordPaidScan('pi_new','synthetic@example.test','Synthetic','fr'),/locale write failure/);
 assert.deepEqual(fixture.snapshot(),{purchases:[],settings:[]});
});
test('concurrent duplicate paid callbacks create only one purchase and marker',async()=>{
 fixture.reset();
 const results=await Promise.all([fixture.recordPaidScan('pi_same','synthetic@example.test','Synthetic','fr'),fixture.recordPaidScan('pi_same','synthetic@example.test','Synthetic','fr')]);
 assert.ok(results.every(result=>result.notifyAllowed));
 assert.equal(fixture.snapshot().purchases.length,1);assert.equal(fixture.snapshot().settings.length,1);
});
test('existing unexpected marker never enables historical sends',async()=>{
 const key=fixture.operationKey('purchase-language','old');
 fixture.reset([{id:'old',stripePaymentIntentId:'pi_old'}],[{key,value:'unknown'}]);
 assert.equal((await fixture.recordPaidScan('pi_old','synthetic@example.test','Synthetic','fr')).notifyAllowed,false);
});
