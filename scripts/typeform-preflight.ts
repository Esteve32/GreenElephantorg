/** Read-only public form inspection. No database, credentials, responses or mail. */
import { INDIVIDUAL_SCAN_MAPPING,inspectIndividualScanDefinition } from '../server/typeform-mapping';
const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),5000);
try{
 const response=await fetch('https://form.typeform.com/forms/'+INDIVIDUAL_SCAN_MAPPING.formId,{headers:{Accept:'application/json'},redirect:'error',cache:'no-store',signal:controller.signal});
 if(!response.ok||!response.body)throw Error();const reader=response.body.getReader(),chunks:Uint8Array[]=[];let size=0;
 try{for(;;){const part=await reader.read();if(part.done)break;size+=part.value.length;if(size>2*1024*1024){await reader.cancel();throw Error();}chunks.push(part.value);}}finally{reader.releaseLock();}
 const definition=JSON.parse(Buffer.concat(chunks).toString('utf8')),inspection=inspectIndividualScanDefinition(definition);
 console.log(JSON.stringify({...inspection,formPublic:definition.settings?.is_public===true,backendConfiguration:'not_checked',submissions:'not_read',mail:'not_attempted'},null,2));
 if(!inspection.mappingVerified||definition.settings?.is_public!==true)process.exitCode=1;
}catch{console.error('Public Typeform preflight unavailable. No runtime or provider settings changed.');process.exitCode=1;}finally{clearTimeout(timer);}
