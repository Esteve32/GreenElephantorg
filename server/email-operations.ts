import { eq } from 'drizzle-orm';
import { db } from './db';
import { adminSettings } from '@shared/schema';
import { operationKey } from './delivery-security';

export type OperationState = { status: 'pending' | 'accepted' | 'unknown'; updatedAt: string };
/** Reserved settings contain operational metadata only; no payloads or addresses. */
export async function claimEmailOperation(kind: string, id: string): Promise<'claimed' | OperationState['status']> {
  const key = operationKey(kind,id);
  const state: OperationState = {status:'pending',updatedAt:new Date().toISOString()};
  const rows = await db.insert(adminSettings).values({key,value:JSON.stringify(state)}).onConflictDoNothing().returning({key:adminSettings.key});
  if (rows.length) return 'claimed';
  const [existing] = await db.select().from(adminSettings).where(eq(adminSettings.key,key)).limit(1);
  try { const parsed=JSON.parse(existing.value); return parsed.status === 'accepted' ? 'accepted' : parsed.status === 'pending' ? 'pending' : 'unknown'; } catch { return 'unknown'; }
}
export async function finishEmailOperation(kind: string, id: string, accepted: boolean): Promise<void> {
  await db.update(adminSettings).set({value:JSON.stringify({status:accepted?'accepted':'unknown',updatedAt:new Date().toISOString()}),updatedAt:new Date()}).where(eq(adminSettings.key,operationKey(kind,id)));
}
export async function savePurchaseLanguage(purchaseId: string, language: 'en'|'fr'): Promise<void> {
  await db.insert(adminSettings).values({key:operationKey('purchase-language',purchaseId),value:language}).onConflictDoUpdate({target:adminSettings.key,set:{value:language,updatedAt:new Date()}});
}
export async function purchaseLanguage(purchaseId: string): Promise<'en'|'fr'> {
  const [row]=await db.select().from(adminSettings).where(eq(adminSettings.key,operationKey('purchase-language',purchaseId))).limit(1);
  return row?.value === 'fr'?'fr':'en';
}
export async function isMarketingSuppressed(contactId:string):Promise<boolean> {
  const [row]=await db.select().from(adminSettings).where(eq(adminSettings.key,operationKey('marketing-suppressed',contactId))).limit(1);
  return !!row;
}
export async function suppressMarketing(contactId:string):Promise<void> {
  await db.insert(adminSettings).values({key:operationKey('marketing-suppressed',contactId),value:JSON.stringify({suppressed:true,updatedAt:new Date().toISOString()})}).onConflictDoNothing();
}
