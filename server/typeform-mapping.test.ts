import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { INDIVIDUAL_SCAN_MAPPING,inspectIndividualScanDefinition,successfulTypeformCompletion } from './typeform-mapping';
import { normalizeTypeformContent } from './typeform-content';
import { parseTypeformReceipt } from './typeform-intake';
const mapping=INDIVIDUAL_SCAN_MAPPING as Extract<typeof INDIVIDUAL_SCAN_MAPPING,{version:2}>;
const response=()=>({form_id:mapping.formId,token:'fictional-response',submitted_at:'2026-10-15T10:00:00Z',hidden:{service_reference:'A'.repeat(43)},ending:{id:mapping.completion.acceptedEndingIds[0]},answers:[{type:'boolean',field:{id:mapping.completion.readyFieldId,ref:'volatile-readiness'},boolean:true},...mapping.completion.requiredAnswerIds.map((id,i)=>i<2?{type:'number',field:{id,ref:'volatile-'+i},number:5}:{type:'choice',field:{id,ref:'volatile-'+i},choice:{id:'choice-'+i,ref:'unstable-choice',label:'Synthetic answer'}})]});
test('actual form uses stable answer and ending IDs; wording is not a consent or identity rule',()=>{
 const r=response();assert.equal(successfulTypeformCompletion(r,mapping),true);assert.equal(successfulTypeformCompletion({...r,ending:{id:mapping.completion.refusedEndingIds[0]}},mapping),false);assert.equal(successfulTypeformCompletion({...r,answers:r.answers.slice(0,-1)},mapping),false);assert.equal(successfulTypeformCompletion({...r,answers:[...r.answers,r.answers[1]]},mapping),false);assert.equal(successfulTypeformCompletion({...r,ending:undefined},mapping),false);assert.equal(successfulTypeformCompletion({...r,ending:undefined},mapping,false),true);
});
test('v2 recovery tolerates regenerated field and choice refs but refuses changed answers or missing stable IDs',()=>{
 const first=response(),second=response();second.answers=second.answers.map((a,i)=>({...a,field:{...a.field,ref:'new-'+i},...('choice' in a?{choice:{...a.choice,ref:'new-choice-ref'}}:{})}));assert.equal(normalizeTypeformContent(first,mapping).digest,normalizeTypeformContent(second,mapping).digest);
 (second.answers[1] as any).number=6;assert.notEqual(normalizeTypeformContent(first,mapping).digest,normalizeTypeformContent(second,mapping).digest);delete (second.answers[1].field as any).id;assert.throws(()=>normalizeTypeformContent(second,mapping));
});
test('v2 intake requires the signed successful ending even when readiness is yes',()=>{
 for(const ending of [mapping.completion.acceptedEndingIds[0],mapping.completion.refusedEndingIds[0],undefined]){const r=response();(r as any).ending=ending?{id:ending}:undefined;const raw=Buffer.from(JSON.stringify({event_id:'fictional-event',event_type:'form_response',form_response:r})),secret='synthetic-provider-secret';const parsed=parseTypeformReceipt(raw,'sha256='+createHmac('sha256',secret).update(raw).digest('base64'),secret,mapping,new Date('2026-10-15T11:00:00Z'));assert.equal(parsed.completionVerified,ending===mapping.completion.acceptedEndingIds[0]);}
});
test('definition inspection reports undeclared order parameter and no marketing mapping honestly',()=>{
 const d={id:mapping.formId,settings:{language:'en'},fields:[{id:mapping.completion.readyFieldId,type:'yes_no'},...mapping.completion.requiredAnswerIds.map(id=>({id,validations:{required:true}}))],thankyou_screens:[...mapping.completion.acceptedEndingIds,...mapping.completion.refusedEndingIds.filter(x=>x!=='DefaultTyScreen')].map(id=>({id}))};
 assert.deepEqual(inspectIndividualScanDefinition(d).errors,['order_parameter_not_declared']);assert.equal(inspectIndividualScanDefinition(d).optionalMarketingMapping,'not_present');assert.equal(inspectIndividualScanDefinition(d).rawDataEmailIsIdentityProof,false);assert.equal(inspectIndividualScanDefinition({...d,hidden:['service_reference']}).mappingVerified,true);
});
