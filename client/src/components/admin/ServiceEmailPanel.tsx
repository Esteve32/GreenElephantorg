import {useEffect,useState} from 'react';
import {Button} from '@/components/ui/button';
import {ContextHelp,ActionLearning} from '@/components/admin/ContextHelp';
import type {ScanCompletionPreview} from '@shared/scan-service-review';
import type {ServiceControls,ServiceJob} from '../../../../server/service-email';
type Status={controls:ServiceControls;jobs:ServiceJob[];sendingEnabled:boolean;webhookConfigured:boolean;cronConfigured:boolean;quotaScope:string};
export function ServiceEmailPanel({preview}:{preview:ScanCompletionPreview|null}){
 const [status,setStatus]=useState<Status|null>(null),[error,setError]=useState(''),[busy,setBusy]=useState(false),[revision,setRevision]=useState(0);
 const [reviewed,setReviewed]=useState(false),[daily,setDaily]=useState(100),[monthly,setMonthly]=useState(3000);
 const [providerIds,setProviderIds]=useState<Record<string,string>>({});
 useEffect(()=>{const controller=new AbortController();setReviewed(false);setError('');setStatus(null);
  void fetch('/api/admin/scan-service/mail/status',{credentials:'include',cache:'no-store',signal:controller.signal}).then(async r=>{if(!r.ok)throw Error('Service email controls are not activated, or your owner sign-in needs refreshing.');return r.json();}).then((s:Status)=>{if(!controller.signal.aborted){setStatus(s);setDaily(s.controls.dailyCap);setMonthly(s.controls.monthlyCap);}}).catch(e=>{if(!controller.signal.aborted)setError(e.message);});return()=>controller.abort();
 },[revision,preview?.fingerprint]);
 async function act(path:string,body:unknown){setBusy(true);setError('');try{
  const r=await fetch('/api/admin/scan-service/'+path,{method:'POST',credentials:'include',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!r.ok)throw Error('The action was not confirmed. Refresh and check its saved status. Do not repeat a send.');
  setReviewed(false);setRevision(n=>n+1);
 }catch(e){setError(e instanceof Error?e.message:'Refresh and review the saved status.');}finally{setBusy(false);}}
 const job=status?.jobs.find(j=>j.eventId===preview?.eventId);
 const delivery=(j:ServiceJob)=>j.reports['email.complained']?'Spam complaint reported':j.reports['email.bounced']?'Bounce reported':j.reports['email.failed']?'Failure reported':j.reports['email.suppressed']?'Suppression reported':j.reports['email.delivered']?'Delivery to a mail server reported':j.reports['email.delivery_delayed']?'Delivery delay reported':'Delivery unverified';
 return <section aria-label="Service email controls" className="my-6 rounded-xl border border-teal-300/30 bg-[#0d2228] p-4 space-y-4 text-base leading-relaxed">
  <h2 className="text-xl font-semibold">Service email controls</h2>
  <p>Replit runs the website and approved triggers. Resend sends the messages. Google handles your mailbox. Cloudflare protects the website.</p>
  <ContextHelp label="delivery" meaning="Accepted means Resend took the message. Delivered means it reports reaching a mail server. Neither proves the person read it."
   example="A message can reach Gmail and still land in Spam. A coach copy may need its own check." action="Check the saved provider report and the receiving mailbox before calling delivery complete." />
  {error&&<p role="alert" className="text-amber-200">{error}</p>}
  {!status&&<p>Sending stays gated until the Replit operator verifies the configuration. No message is sent by opening this panel.</p>}
  {status&&<>
   <p className="font-semibold">Queue: {status.controls.paused?'Paused':'Running'} · Sending switch: {status.sendingEnabled?'Enabled by operator':'Disabled by operator'}</p>
   <p>Signed delivery endpoint: {status.webhookConfigured?'Secret configured; live receipt still needs verification':'Not configured'} · Scheduled trigger: {status.cronConfigured?'Secret configured; actual Replit schedule unverified':'Not configured'}</p>
   <p>Last scheduled check: {status.controls.lastTickAt||'No check recorded'}</p>
   <ActionLearning task="Find one service message below. Compare its acceptance state with its delivery report."
    check="If it says unknown or submitting, stop and reconcile it in Resend. Do not create another send or clear its saved claim." />
   <ContextHelp label="quota" meaning="A quota is a sending limit. Each To and CC address uses one place, including the trace copy."
    example="CC means a copy of the same message. One participant plus three CC addresses uses four places." action="Use a lower local cap if other apps or inbound mail share this Resend account. Check the Resend Usage page for the account total." />
   <p>{status.quotaScope}</p>
   <p>Reserved today (UTC · {status.controls.day||'no attempts'}): {status.controls.dailyReserved??0} · this month (UTC · {status.controls.month||'no attempts'}): {status.controls.monthlyReserved??0}. Unknown attempts stay counted.</p>
   <div className="flex flex-wrap gap-4"><label>Daily recipient cap<input className="block w-28 rounded bg-black/30 p-2" type="number" min="1" max="100" value={daily} onChange={e=>setDaily(Number(e.target.value))}/></label>
    <label>Monthly recipient cap<input className="block w-28 rounded bg-black/30 p-2" type="number" min="1" max="3000" value={monthly} onChange={e=>setMonthly(Number(e.target.value))}/></label></div>
   <div className="flex flex-wrap gap-3"><Button disabled={busy} onClick={()=>void act('mail/controls',{expectedVersion:status.controls.version,paused:true,dailyCap:daily,monthlyCap:monthly})}>Pause queue and save caps</Button>
    <Button variant="outline" disabled={busy||!status.sendingEnabled} onClick={()=>void act('mail/controls',{expectedVersion:status.controls.version,paused:false,dailyCap:daily,monthlyCap:monthly})}>Resume approved queue with these caps</Button>
    <Button variant="outline" disabled={busy} onClick={()=>setRevision(n=>n+1)}>Refresh saved status</Button></div>
   <p className="text-white/70">Resume allows queued purchase/reminder messages and separately approved completion drafts to run. It cannot enable the operator’s transport switch. An attempt already submitted cannot be recalled by Pause.</p>
   {preview&&<div className="rounded border border-amber-200/30 p-4 space-y-3"><h3 className="font-semibold">Approve the exact completion preview above</h3>
    <label className="flex items-start gap-3"><input className="mt-1 min-h-5 min-w-5" type="checkbox" checked={reviewed} onChange={e=>setReviewed(e.target.checked)}/><span>I checked the From, To, all CC addresses, reply address, subject, body and attachment in this preview.</span></label>
    <Button disabled={busy||!reviewed||!!job?.attemptedAt} onClick={()=>void act(encodeURIComponent(preview.eventId)+'/mail/approve',{expectedVersion:preview.reviewVersion,fingerprint:preview.fingerprint,reviewRef:'owner-reviewed-exact-preview'})}>Record approval for this exact draft</Button>
    <p>Approval is separate from submission. A changed draft needs a new review. This is the raw-answer completion email; it is not a dashboard-ready notice.</p>
   </div>}
   <div className="space-y-3">{status.jobs.map(j=><article key={j.id} className="rounded border border-white/20 p-3 space-y-2 break-words"><h3 className="font-semibold">{j.kind.replaceAll('_',' ')} · {j.state}</h3>
    <p>{delivery(j)} · {j.recipients.length} recipient places</p><p>Queue note: {j.reason.replaceAll('_',' ')}</p>
    <details><summary className="cursor-pointer text-teal-200">Message reference and reports</summary><p className="break-all">{j.id}</p><p>Resend ID: {j.providerId||'Not confirmed'}</p><p>Order reference: {j.sourceId||'See the reviewed submission'}</p>{j.eventId&&<p>Submission reference: {j.eventId}</p>}
     <p>Approved: {j.approvedAt} · attempted: {j.attemptedAt||'No attempt'}</p>{Object.entries(j.reports).map(([name,time])=><p key={name}>{name}: {time}</p>)}</details>
    <p className="text-white/70">These are reports about the provider message. Inbox placement and delivery to each CC remain unverified. A failure or complaint pauses the tracked queue.</p>
    {j.attemptedAt&&<div><label>Resend message ID to check<input className="block w-full rounded bg-black/30 p-2" value={providerIds[j.id]??j.providerId??''} onChange={e=>setProviderIds({...providerIds,[j.id]:e.target.value})}/></label>
     <Button variant="outline" disabled={busy||!(providerIds[j.id]??j.providerId)} onClick={()=>void act('mail/'+j.id+'/reconcile',{expectedVersion:j.version,providerId:providerIds[j.id]??j.providerId})}>Check Resend record · sends nothing</Button>
     <p className="text-white/70">Use the exact ID from Resend Logs. The backend checks the saved job and draft tags. API readbacks show when we checked, not the original delivery-event time.</p></div>}
    {!j.attemptedAt&&<Button variant="outline" disabled={busy||j.state!=='approved'} onClick={()=>void act('mail/'+j.id+'/hold',{expectedVersion:j.version})}>Hold this message</Button>}
    {j.kind==='completion'&&<Button className="ml-3" disabled={busy||j.state!=='approved'||!!j.attemptedAt||!status.sendingEnabled||status.controls.paused} onClick={()=>void act('mail/'+j.id+'/dispatch',{})}>Submit approved message once</Button>}
   </article>)}</div>
  </>}
 </section>;
}
