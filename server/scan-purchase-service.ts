import { sendClaimedEmail } from './claimed-email';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { coupons, satellitescanPurchases, adminSettings } from '@shared/schema';
import { operationKey } from './delivery-security';
import { SCAN_PRICE } from '../shared/scan-checkout';
import { claimEmailOperation, finishEmailOperation, purchaseLanguage } from './email-operations';
import { sendSatellitescanPurchaseEmail, sendSatellitescanReminderEmail } from './email-notifications';
import { storage } from './storage';
import { couponCanCoverScan } from './scan-purchase-validation';
import type { SatellitescanPurchase } from '@shared/schema';

export async function redeemFreeScan(email:string,name:string|null,code:string,language:'en'|'fr') {
 return db.transaction(async tx=>{
  const [coupon]=await tx.select().from(coupons).where(eq(coupons.code,code)).for('update');
  if(!coupon) throw new Error('invalid_coupon');
  // One activation per voucher and address. A repeated browser request returns it.
  const paymentId='FREE-'+operationKey('coupon-activation',coupon.id+':'+email).split(':').pop();
  const [existing]=await tx.select().from(satellitescanPurchases).where(eq(satellitescanPurchases.stripePaymentIntentId,paymentId));
  if(existing) return existing;
  if(!couponCanCoverScan(coupon)) throw new Error('invalid_coupon');
  const [purchase]=await tx.insert(satellitescanPurchases).values({customerEmail:email,customerName:name,amount:'0.00',stripePaymentIntentId:paymentId,status:'succeeded'}).returning();
  await tx.update(coupons).set({usedCount:String(Number(coupon.usedCount)+1)}).where(eq(coupons.id,coupon.id));
  await tx.insert(adminSettings).values({key:operationKey('purchase-language',purchase.id),value:language});
  return purchase;
 });
}
export async function recordPaidScan(id:string,email:string,name:string|null,language:'en'|'fr') {
 return db.transaction(async tx => {
  const rows = await tx.insert(satellitescanPurchases).values({customerEmail:email,customerName:name,amount:SCAN_PRICE.toFixed(2),stripePaymentIntentId:id,status:'succeeded'}).onConflictDoNothing().returning();
  const purchase = rows[0] || (await tx.select().from(satellitescanPurchases).where(eq(satellitescanPurchases.stripePaymentIntentId,id)))[0];
  if (!purchase) throw new Error('purchase_unavailable');
  const localeKey = operationKey('purchase-language',purchase.id);
  if (rows.length) {
   // The marker and purchase commit together; no new-flow record can lose its locale.
   await tx.insert(adminSettings).values({key:localeKey,value:language});
   return {purchase,notifyAllowed:true};
  }
  const [marker] = await tx.select().from(adminSettings).where(eq(adminSettings.key,localeKey));
  // Historical purchases may already have received email before claims existed.
  // A webhook replay must never create fresh notifications for those records.
  return {purchase,notifyAllowed:marker?.value==='en'||marker?.value==='fr'};
 });
}
export async function notifyScanPurchase(purchase:SatellitescanPurchase) {
 const kind='scan-purchase',id=purchase.id;
 return sendClaimedEmail({claim:()=>claimEmailOperation(kind,id),finish:accepted=>finishEmailOperation(kind,id,accepted),send:async()=>sendSatellitescanPurchaseEmail({customerEmail:purchase.customerEmail,customerName:purchase.customerName,amount:purchase.amount,paymentIntentId:purchase.stripePaymentIntentId,purchaseId:id,language:await purchaseLanguage(id),idempotencyKey:operationKey(kind,id)})});
}
export async function remindScanOnce(purchase:SatellitescanPurchase) {
 const kind='scan-reminder',id=purchase.id,state=await claimEmailOperation(kind,id);
 if(state!=='claimed') return false;
 let accepted=false;
 try {
  accepted=await sendSatellitescanReminderEmail(purchase.customerEmail,purchase.customerName,await purchaseLanguage(id),operationKey(kind,id));
  if(accepted) await storage.updateSatellitescanReminderCount(id,Number(purchase.remindersCount)+1);
  return accepted;
 } finally {await finishEmailOperation(kind,id,accepted);}
}
