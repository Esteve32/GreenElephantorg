import { SCAN_PRICE } from '../shared/scan-checkout';
export function couponCanCoverScan(coupon:{isActive:string;discountAmount:string;usedCount:string;maxUses:string|null}) {
 const amount=Number(coupon.discountAmount),used=Number(coupon.usedCount),limit=coupon.maxUses===null?Infinity:Number(coupon.maxUses);
 return coupon.isActive==='true' && Number.isFinite(amount) && amount>=SCAN_PRICE && /^\d+$/.test(coupon.usedCount) && Number.isSafeInteger(used) && used>=0 && (coupon.maxUses===null || /^\d+$/.test(coupon.maxUses)&&Number.isSafeInteger(limit)&&limit>0) && used<limit;
}
export function validScanPayment(amount:number,currency:string) {return amount===Math.round(SCAN_PRICE*100)&&currency==='eur';}
