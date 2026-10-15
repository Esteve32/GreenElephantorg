import { z } from 'zod';
import { validScanReferenceField } from '../shared/scan-typeform-link';
const id = z.string().regex(/^[A-Za-z0-9_-]{1,128}$/);
const base = { formId:id, bindingField:z.string().refine(validScanReferenceField) };
export const typeformMappingSchema = z.union([
  z.object({...base,completionFieldRef:id}).strip(),
  z.object({...base,version:z.literal(2),languageSource:z.literal('purchase'),
    completion:z.object({readyFieldId:id,requiredAnswerIds:z.array(id).min(1).max(1000),acceptedEndingIds:z.array(id).min(1).max(20),refusedEndingIds:z.array(id).min(1).max(20)}).strict(),
  }).strict().refine(m => new Set(m.completion.requiredAnswerIds).size===m.completion.requiredAnswerIds.length
    && !m.completion.acceptedEndingIds.some(x=>m.completion.refusedEndingIds.includes(x))),
]);
export type TypeformMapping = z.infer<typeof typeformMappingSchema>;
/** Stable provider IDs, never editor/generated refs or displayed question wording. */
export function successfulTypeformCompletion(response: Record<string,unknown>, mapping:TypeformMapping, requireEnding=true): boolean {
  const answers=Array.isArray(response.answers)?response.answers:[];
  const matches=(key:string,by:'id'|'ref')=>answers.filter((a:any)=>a?.field?.[by]===key) as Record<string,any>[];
  if (!('version' in mapping)) {const a=matches(mapping.completionFieldRef,'ref');return a.length===1&&a[0].type==='boolean'&&a[0].boolean===true;}
  const c=mapping.completion, ready=matches(c.readyFieldId,'id');
  if(ready.length!==1||ready[0].type!=='boolean'||ready[0].boolean!==true)return false;
  for(const key of c.requiredAnswerIds) {const a=matches(key,'id');if(a.length!==1||!['number','choice','choices','boolean','text','email','date'].includes(a[0].type))return false;}
  const ending=response.ending as {id?:unknown}|undefined;
  // Responses API may omit the ending. Intake always requires the signed ending;
  // recovery can compare answer content against an already verified signed receipt.
  if(!ending)return !requireEnding;
  return typeof ending.id==='string'&&c.acceptedEndingIds.includes(ending.id)&&!c.refusedEndingIds.includes(ending.id);
}
export const INDIVIDUAL_SCAN_MAPPING:TypeformMapping={version:2,formId:'ploJm1N3',bindingField:'service_reference',languageSource:'purchase',completion:{
  readyFieldId:'kyfdA3IJdQ6u',requiredAnswerIds:['RjSDdrXhpbCN','6aXPuevSxJbb','T2OKSn1RluXE','JaJIueUhqXuz'],
  acceptedEndingIds:['RUMxHLfMdC8s','fZqN481GLtOr'],refusedEndingIds:['Ad0t5ZXDRDIB','DefaultTyScreen'],
}};
/** Inspect form configuration only; never infer consent from readiness or email. */
export function inspectIndividualScanDefinition(value:unknown) {
  const d=z.object({id:id,fields:z.array(z.any()),hidden:z.array(z.string()).optional(),settings:z.object({language:z.string().optional()}).passthrough().optional(),thankyou_screens:z.array(z.object({id:id}).passthrough())}).passthrough().parse(value);
  const m=INDIVIDUAL_SCAN_MAPPING as Extract<TypeformMapping,{version:2}>;
  const flatten=(fs:any[]):any[]=>fs.flatMap(f=>[f,...flatten(f.properties?.fields??f.fields??[])]);
  const fields=flatten(d.fields),find=(key:string)=>fields.filter(f=>f.id===key);
  const errors:string[]=[];
  if(d.id!==m.formId)errors.push('wrong_form');
  if(!d.hidden?.includes(m.bindingField))errors.push('order_parameter_not_declared');
  if(find(m.completion.readyFieldId).length!==1||find(m.completion.readyFieldId)[0]?.type!=='yes_no')errors.push('readiness_field_changed');
  for(const key of m.completion.requiredAnswerIds)if(find(key).length!==1||find(key)[0]?.validations?.required!==true)errors.push('completion_field_changed');
  for(const key of [...m.completion.acceptedEndingIds,...m.completion.refusedEndingIds].filter(x=>x!=='DefaultTyScreen'))if(d.thankyou_screens.filter(e=>e.id===key).length!==1)errors.push('ending_changed');
  return {formId:d.id,fieldCount:fields.length,language:d.settings?.language??null,declaredParameters:d.hidden??[],mappingVerified:errors.length===0,errors,
    optionalMarketingMapping:'not_present' as const,rawDataEmailIsIdentityProof:false};
}
