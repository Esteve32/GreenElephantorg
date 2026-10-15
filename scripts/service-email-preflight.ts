/** Read-only configuration/DNS check. Never starts the app, connects to DB, reads email content or sends mail. */
import {resolveTxt,resolveMx,resolveNs} from 'node:dns/promises';
import {pathToFileURL} from 'node:url';
export function serviceEmailConfiguration(env:NodeJS.ProcessEnv){
 const validKey=!!env.SERVICE_EMAIL_ENCRYPTION_KEY&&/^[a-fA-F0-9]{64}$/.test(env.SERVICE_EMAIL_ENCRYPTION_KEY);
 const separate=validKey&&![env.TYPEFORM_EVIDENCE_KEY,env.TYPEFORM_ORDER_REFERENCE_KEY,env.RESEND_API_KEY,env.RESEND_SERVICE_WEBHOOK_SECRET].some(k=>k?.toLowerCase()===env.SERVICE_EMAIL_ENCRYPTION_KEY!.toLowerCase());
 return{controlEnabled:env.SERVICE_EMAIL_CONTROL_ENABLED==='true',sendingEnabled:env.SERVICE_EMAIL_SENDING_ENABLED==='true',
  evidenceKeyConfigured:validKey&&separate,deliverySecretConfigured:!!env.RESEND_SERVICE_WEBHOOK_SECRET,
  cronSecretConfigured:(env.SERVICE_EMAIL_CRON_SECRET?.length??0)>=32,orderIntakeEnabled:env.TYPEFORM_ORDER_INTAKE_ENABLED==='true',orderLinksEnabled:env.TYPEFORM_ORDER_LINKS_ENABLED==='true',
  credentialSource:env.RESEND_API_KEY?'deployment secret':env.REPLIT_CONNECTORS_HOSTNAME&&(env.REPL_IDENTITY||env.WEB_REPL_RENEWAL)?'Replit connector (not queried)':'not available here',
  liveProviderVerified:false,liveDeploymentVerified:false,databaseChecked:false,emailsSent:0};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const result:Record<string,unknown>={configuration:serviceEmailConfiguration(process.env)};
 if(process.argv.includes('--dns')){
  const domain=process.argv[process.argv.indexOf('--dns')+1];if(!domain||!/^(?:[a-z0-9-]+\.)+[a-z]{2,}$/i.test(domain))throw Error('Supply a public domain after --dns.');
  const inspect=async<T>(read:()=>Promise<T>)=>{try{return await read();}catch{return'Unavailable or absent';}};
  result.publicDns={domain,nameservers:await inspect(()=>resolveNs(domain)),mx:await inspect(()=>resolveMx(domain)),
   spf:await inspect(async()=>(await resolveTxt(domain)).map(p=>p.join('')).filter(v=>v.startsWith('v=spf1'))),
   dmarc:await inspect(async()=>(await resolveTxt('_dmarc.'+domain)).map(p=>p.join(''))),
   resendDkimAndReturnPath:'Not inferred. Compare the exact hostnames shown by Resend with Cloudflare.',inboxPlacement:'Not established by DNS'};
 }
 console.log(JSON.stringify(result,null,2));
}
