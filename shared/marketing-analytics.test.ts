import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONSENT_DAYS, consentRecord, readConsent, publicAnalyticsConfig, pageViewEvent, ctaEvent, acquisitionSource } from './marketing-analytics';
import { DISCOVERY_URL } from './coaching-pages';
import { createMarketingTracker, type TrackerDriver } from '../client/src/lib/marketing-tracker';

function setup(overrides: Partial<TrackerDriver> = {}) {
  let raw: string | null = null, path = '/';
  const loaded: string[] = [], sent: unknown[] = []; let requests = 0, stops = 0;
  const driver: TrackerDriver = {
    readChoice:()=>raw,writeChoice:value=>{raw=value;},path:()=>path,referrer:()=>'',productionHost:()=>true,
    config:async()=>{requests++;return {enabled:true,measurementId:'G-TEST12345'};},
    load:id=>{loaded.push(id);},send:event=>{sent.push(event);},stop:()=>{stops++;},...overrides,
  };
  return {driver,tracker:createMarketingTracker(driver),loaded,sent,setPath:(p:string)=>{path=p;},setRaw:(s:string|null)=>{raw=s;},requests:()=>requests,stops:()=>stops};
}

test('no choice or rejection loads no tag, fetches no config and sends nothing', async()=>{
  const t=setup(); await t.tracker.visit(); await t.tracker.choose('rejected'); await t.tracker.visit();
  t.tracker.click(DISCOVERY_URL,'hero');
  assert.equal(t.requests(),0);assert.deepEqual(t.loaded,[]);assert.deepEqual(t.sent,[]);
});
test('acceptance initializes once and sends one initial view plus one per new path',async()=>{
  const t=setup();await t.tracker.choose('accepted');await t.tracker.visit();await t.tracker.visit();
  assert.equal(t.loaded.length,1);assert.equal(t.sent.length,1);
  t.setPath('/scan');await t.tracker.visit();await t.tracker.visit();assert.equal(t.sent.length,2);
  t.setPath('/');await t.tracker.visit();assert.equal(t.sent.length,3);
});
test('saved acceptance works after reload but not on localhost or private routes',async()=>{
  const t=setup();t.setRaw(consentRecord('accepted'));await t.tracker.visit();assert.equal(t.sent.length,1);
  for(const path of ['/admin','/portal','/checkout','/fr/checkout','/payment-success','/dashboard','/scan-results','/signals','/flow-check','/myfive','/unknown']) {
    const privateVisit=setup();privateVisit.setRaw(consentRecord('accepted'));privateVisit.setPath(path);await privateVisit.tracker.visit();assert.equal(privateVisit.requests(),0,path);
  }
  const local=setup({productionHost:()=>false});await local.tracker.choose('accepted');assert.equal(local.requests(),0);
});
test('withdrawal stops events and makes rejection persist',async()=>{
  const t=setup();await t.tracker.choose('accepted');await t.tracker.choose('rejected');
  t.setPath('/scan');await t.tracker.visit();t.tracker.click(DISCOVERY_URL,'hero');
  assert.equal(t.sent.length,1);assert.equal(t.tracker.choice(),'rejected');assert.ok(t.stops()>0);
});
test('reject while configuration is in flight cancels initialization',async()=>{
  let resolve!: (value:{enabled:boolean;measurementId:string})=>void;
  const t=setup({config:()=>new Promise(r=>{resolve=r;})});
  const task=t.tracker.choose('accepted');await t.tracker.choose('rejected');resolve({enabled:true,measurementId:'G-TEST12345'});await task;
  assert.equal(t.loaded.length,0);assert.equal(t.sent.length,0);
});
test('navigation during configuration uses current safe path or cancels for a private one',async()=>{
  for(const path of ['/scan','/portal']) {
    let resolve!: (value:{enabled:boolean;measurementId:string})=>void;
    const t=setup({config:()=>new Promise(r=>{resolve=r;})});const task=t.tracker.choose('accepted');t.setPath(path);
    resolve({enabled:true,measurementId:'G-TEST12345'});await task;
    assert.equal(t.sent.length,path==='/scan'?1:0);
  }
});
test('disabled, malformed or failing configuration fails closed',async()=>{
  for(const config of [async()=>({enabled:false,measurementId:null}),async()=>({enabled:true,measurementId:'bad<script>'}),async()=>{throw new Error('offline');}]) {
    const t=setup({config});await t.tracker.choose('accepted');assert.equal(t.loaded.length,0);assert.equal(t.sent.length,0);
  }
});
test('blocked local storage allows an explicit session choice, never assumes consent',async()=>{
  const t=setup({readChoice:()=>{throw new Error('blocked');},writeChoice:()=>{throw new Error('blocked');}});
  await t.tracker.visit();assert.equal(t.sent.length,0);await t.tracker.choose('accepted');assert.equal(t.sent.length,1);
  await t.tracker.choose('rejected');await t.tracker.visit();assert.equal(t.sent.length,1);
});
test('consent is versioned and expires after 180 days; invalid or future records are ignored',()=>{
  const now=2000000000000;
  assert.equal(readConsent(consentRecord('accepted',now),now),'accepted');
  for(const raw of ['garbage','{}',JSON.stringify({choice:'accepted',version:2,at:now}),consentRecord('accepted',now+1),consentRecord('accepted',now-CONSENT_DAYS*86400000)]) assert.equal(readConsent(raw,now),null);
});
test('public config exposes only a validated measurement ID after the production switch',()=>{
  const env={NODE_ENV:'production',GA4_COLLECTION_ENABLED:'true',VITE_GA_MEASUREMENT_ID:'G-TEST12345',GOOGLE_SERVICE_ACCOUNT_KEY:'synthetic-secret',GA4_PROPERTY_ID:'12345'};
  assert.deepEqual(publicAnalyticsConfig(env),{enabled:true,measurementId:'G-TEST12345'});
  for(const disabled of [{...env,NODE_ENV:'development'},{...env,GA4_COLLECTION_ENABLED:'false'},{...env,VITE_GA_MEASUREMENT_ID:'<script>'}]) assert.deepEqual(publicAnalyticsConfig(disabled),{enabled:false,measurementId:null});
});
test('events have safe fixed values, no queries, emails, fragment or full referrer',()=>{
  const page=pageViewEvent('/scan?email=private@example.test#answer','https://example.test/private?name=private');
  assert.equal(page?.params.page_location,'https://greenelephant.org/scan');assert.equal(page?.params.acquisition_source,'other_referral');
  assert.doesNotMatch(JSON.stringify(page),/private|example\.test|answer|\?/);
  const click=ctaEvent('/ai-coaching/lifetime-archive',DISCOVERY_URL+'?email=private@example.test','private@example.test');
  assert.equal(click?.params.cta_position,'other');assert.equal(click?.params.use_case,'lifetime-archive');assert.doesNotMatch(JSON.stringify(click),/private|@|\?/);
  assert.equal(ctaEvent('/portal',DISCOVERY_URL,'hero'),null);
  assert.equal(ctaEvent('/scan','https://malicious.test/checkout?product=satellitescan','hero'),null);
  assert.equal(ctaEvent('/scan','/checkout?product=satellitescan','hero')?.params.cta_action,'scan_checkout');
  assert.equal(acquisitionSource('https://arbora.partners.evil.test/?email=private'),'other_referral');
});
