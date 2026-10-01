export type ClaimState='claimed'|'accepted'|'pending'|'unknown';
/** Unknown acceptance is deliberately not retried: an operator must reconcile it. */
export async function sendClaimedEmail(deps:{claim:()=>Promise<ClaimState>;send:()=>Promise<boolean>;finish:(accepted:boolean)=>Promise<void>}) {
 const state=await deps.claim();
 if(state!=='claimed') return state==='accepted';
 let accepted=false;
 try { accepted=await deps.send(); return accepted; }
 finally {await deps.finish(accepted);}
}
