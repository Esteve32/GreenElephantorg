import { db } from './db';
import { createPrivacyWorkflowStore,PrivacyWorkflowError } from './privacy-workflow-store';
import { createPrivacyOperations } from './privacy-workflow-operations';
import { startPrivacyWorker } from './privacy-worker';
import { publicSiteOrigin } from './delivery-security';
export const privacyEnabled=()=>process.env.PRIVACY_WORKFLOWS_ENABLED==='true';
function confirmationKey(){const value=process.env.PRIVACY_CONFIRMATION_KEY;return value&&/^[A-Fa-f0-9]{64}$/.test(value)?Buffer.from(value,'hex'):undefined;}
export const privacyStore=createPrivacyWorkflowStore(db,{ownerEmail:()=>process.env.ADMIN_OWNER_EMAIL,confirmationKey});
export const privacyOperations=createPrivacyOperations(db,{ownerEmail:()=>process.env.ADMIN_OWNER_EMAIL,mailConfiguration:async()=>{
 const key=confirmationKey(),from=process.env.PRIVACY_MAIL_FROM,replyTo=process.env.PRIVACY_MAIL_REPLY_TO;
 const aliases=(process.env.PRIVACY_ATTENTION_ALIASES??'').split(',').map(x=>x.trim()).filter(Boolean);
 if(!key||!from||!replyTo)throw new PrivacyWorkflowError('unavailable');
 return{from,replyTo,aliases,traceCc:['email@estevepannetier.com'],origin:publicSiteOrigin(process.env.PUBLIC_SITE_URL),confirmationKey:key,weeklyRecipients:{owner:process.env.ADMIN_OWNER_EMAIL,daily:process.env.PRIVACY_WEEKLY_DAILY_RECIPIENT}};
}});
// Importing this module neither queries the database nor starts a worker.
export const startConfiguredPrivacyWorker=()=>startPrivacyWorker(privacyOperations,{enabled:()=>privacyEnabled()&&process.env.PRIVACY_WORKER_ENABLED==='true',sendingEnabled:()=>process.env.PRIVACY_MAIL_SENDING_ENABLED==='true'});
