import { createCipheriv,createDecipheriv,randomBytes } from 'node:crypto';
import { z } from 'zod';
import { parseTypeformReceipt,typeformDigest,TypeformIntakeError,type TypeformReceipt } from './typeform-intake';
import { canonicalJson,TypeformRecoveryError } from './typeform-content';
export type SignedTypeformOriginal={raw:Buffer;signature:string};
export type SealedTypeformOriginal={eventId:string;formatVersion:number;keyId:string;payloadDigest:string;nonce:string;tag:string;ciphertext:string};
const sealed=z.object({eventId:z.string(),formatVersion:z.literal(1),keyId:z.string(),payloadDigest:z.string().regex(/^[a-f0-9]{64}$/),nonce:z.string().regex(/^[A-Za-z0-9+/]{16}$/),tag:z.string().regex(/^[A-Za-z0-9+/]{22}==$/),ciphertext:z.string().max(4000000)}).strip();
/** Encryption does not make the database immutable. On-conflict digest checks,
 * signature verification and append-only application writes preserve originals.
 * Key/signing-secret rotation requires reconciliation; a missing old key holds recovery.
 */
export function createTypeformOriginalCodec(options:{key:Buffer;keyId:string;secret:string;mapping:unknown}){
 if(!Buffer.isBuffer(options.key)||options.key.length!==32||!/^[A-Za-z0-9_-]{1,64}$/.test(options.keyId)||!options.secret)throw new TypeformIntakeError(503);
 const key=Buffer.from(options.key),keyId=options.keyId;
 const aad=(eventId:string,payloadDigest:string)=>Buffer.from(canonicalJson({formatVersion:1,keyId,eventId,payloadDigest}));
 return {
  seal(receipt:TypeformReceipt,source:SignedTypeformOriginal):SealedTypeformOriginal{
   const verified=parseTypeformReceipt(source.raw,source.signature,options.secret,options.mapping,receipt.receivedAt);
   if(canonicalJson(verified)!==canonicalJson(receipt))throw new TypeformIntakeError(409);
   const nonce=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,nonce);cipher.setAAD(aad(receipt.eventId,receipt.payloadDigest));
   const plain=Buffer.from(JSON.stringify({raw:source.raw.toString('base64'),signature:source.signature,receiptDigest:typeformDigest(canonicalJson(receipt))}));
   const ciphertext=Buffer.concat([cipher.update(plain),cipher.final()]);
   return {eventId:receipt.eventId,formatVersion:1,keyId,payloadDigest:receipt.payloadDigest,nonce:nonce.toString('base64'),tag:cipher.getAuthTag().toString('base64'),ciphertext:ciphertext.toString('base64')};
  },
  open(value:unknown,expected:{eventId:string;payloadDigest:string;receivedAt:Date}){
   try{
    const r=sealed.parse(value);if(r.keyId!==keyId||r.eventId!==expected.eventId||r.payloadDigest!==expected.payloadDigest)throw Error();
    const decipher=createDecipheriv('aes-256-gcm',key,Buffer.from(r.nonce,'base64'));decipher.setAAD(aad(r.eventId,r.payloadDigest));decipher.setAuthTag(Buffer.from(r.tag,'base64'));
    const data=JSON.parse(Buffer.concat([decipher.update(Buffer.from(r.ciphertext,'base64')),decipher.final()]).toString('utf8'));
    if(typeof data.raw!=='string'||typeof data.signature!=='string')throw Error();const raw=Buffer.from(data.raw,'base64');if(raw.length>2*1024*1024||typeformDigest(raw)!==expected.payloadDigest)throw Error();
    const receipt=parseTypeformReceipt(raw,data.signature,options.secret,options.mapping,expected.receivedAt);if(receipt.eventId!==expected.eventId||data.receiptDigest!==typeformDigest(canonicalJson(receipt)))throw Error();
    return {receipt,body:JSON.parse(raw.toString('utf8')) as {form_response:Record<string,unknown>}};
   }catch{throw new TypeformRecoveryError('recovery_conflict');}
  },
 };
}
export type TypeformOriginalCodec=ReturnType<typeof createTypeformOriginalCodec>;
