import test from 'node:test';
import assert from 'node:assert/strict';
import {sendClaimedEmail,type ClaimState} from './claimed-email';
test('parallel workers share a claim and only one invokes the provider',async()=>{
 let state:ClaimState='claimed',calls=0;
 const deps={claim:async()=>{const result=state;if(state==='claimed')state='pending';return result;},send:async()=>{calls++;return true;},finish:async(accepted:boolean)=>{state=accepted?'accepted':'unknown';}};
 await Promise.all([sendClaimedEmail(deps),sendClaimedEmail(deps)]);
 assert.equal(calls,1);assert.equal(state,'accepted');
 assert.equal(await sendClaimedEmail(deps),true);assert.equal(calls,1);
});
test('provider exception persists unknown and does not trigger a blind retry',async()=>{
 let state:ClaimState='claimed',calls=0;
 const deps={claim:async()=>state,send:async()=>{calls++;throw new Error('ambiguous timeout');},finish:async(accepted:boolean)=>{state=accepted?'accepted':'unknown';}};
 await assert.rejects(sendClaimedEmail(deps));assert.equal(state,'unknown');
 assert.equal(await sendClaimedEmail(deps),false);assert.equal(calls,1);
});
test('persisted pending after a crash is never mistaken for acceptance',async()=>{
 assert.equal(await sendClaimedEmail({claim:async()=> 'pending',send:async()=>{throw Error('must not send');},finish:async()=>{throw Error('must not finish');}}),false);
});
