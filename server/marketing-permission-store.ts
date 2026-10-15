import { and,eq } from 'drizzle-orm';
import type { db } from './db';
import { contacts,privacyWorkflowRecords as records,adminSettings } from '@shared/schema';
import { operationKey,normalizeEmail } from './delivery-security';
/** Serialize the final permission check/submission with withdrawal's contact lock.
 * A withdrawal cannot retract a message already submitted to the mail provider.
 * The caller must retain its durable send claim across ambiguous acceptance.
 */
export function createMarketingPermissionGate(database:Pick<typeof db,'transaction'>){
 return async function gate<T>(contactId:string,expectedEmail:string|undefined,send:()=>Promise<T>):Promise<{allowed:false}|{allowed:true;result:T}>{
  return database.transaction(async tx=>{
   const [contact]=await tx.select().from(contacts).where(eq(contacts.id,contactId)).for('share');
   if(!contact||contact.consentGiven!=='true'||(expectedEmail!==undefined&&contact.email!==normalizeEmail(expectedEmail)))return{allowed:false as const};
   const [suppressed]=await tx.select().from(adminSettings).where(eq(adminSettings.key,operationKey('marketing-suppressed',contactId)));if(suppressed)return{allowed:false as const};
   const [hold]=await tx.select().from(records).where(and(eq(records.kind,'recovery'),eq(records.scopeKey,'processing_hold'))).for('share');if(hold?.data.hold===true)return{allowed:false as const};
   const [state]=await tx.select().from(records).where(and(eq(records.kind,'consent'),eq(records.subjectId,contactId))).for('share');
   if(state?.data.state!=='confirmed'||typeof state.data.confirmedAt!=='string'||!Number.isFinite(Date.parse(state.data.confirmedAt)))return{allowed:false as const};
   const [active]=await tx.select().from(records).where(and(eq(records.kind,'configuration'),eq(records.scopeKey,'notice:marketing_updates'))).for('share');
   if(!active||active.data.noticeId!==state.data.noticeId)return{allowed:false as const};
   return{allowed:true as const,result:await send()};
  });
 };
}
