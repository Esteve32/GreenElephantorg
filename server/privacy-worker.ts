import type { PrivacyOperations } from './privacy-workflow-operations';
import { getUncachableResendClient } from './resend-client';
import { isConnectorEnabled } from './lib/connectorGuard';
/** Startup does nothing unless explicitly enabled after migrations/config review. */
export function startPrivacyWorker(operations:PrivacyOperations,options:{enabled():boolean;sendingEnabled():boolean}) {
 if(!options.enabled())return()=>{};let running=false;
 const tick=async()=>{if(running)return;running=true;try{
  await operations.tick();
  if(!options.sendingEnabled()||!(await isConnectorEnabled('resend')))return;
  for(const id of await operations.pendingIds())await operations.dispatch(id,async(envelope,key)=>{const {client}=await getUncachableResendClient();const result=await client.emails.send({...envelope,tags:[{name:'privacy_job',value:id}]},{idempotencyKey:key});if(!result.data?.id)throw Error('provider_acceptance_unknown');return{providerId:result.data.id};},true);
 }catch{console.error('Privacy background work needs operator review');}finally{running=false;}};
 const timer=setInterval(()=>void tick(),60000);timer.unref();void tick();return()=>clearInterval(timer);
}
