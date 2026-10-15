import { ActionLearning, ContextHelp } from '@/components/admin/ContextHelp';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ScanReviewAction, ScanReviewDetail, ScanReviewRow, ScanCompletionPreview } from '@shared/scan-service-review';

type Page = { receipts: ScanReviewRow[]; nextCursor: string | null; accessExpiresAt: string };
const surface = 'bg-white/5 border-white/10';
const date = (value: string | null) => value ? new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Helsinki',
}).format(new Date(value)) + ' · Helsinki' : 'Not recorded';
const explanations: Record<string, string> = {
  review_configuration_required: 'Order-aware intake is not activated. Ask the operator to complete the reviewed configuration and isolated database checks.',
  review_owner_sign_in_required: 'Sign in again with the designated owner’s Google account to review private service work.',
  review_access_required: 'This service queue is restricted to the designated owner.',
  review_conflict: 'This submission changed or the response is already assigned. Refresh and review the current evidence.',
  review_evidence_required: 'The evidence no longer supports this assignment. Keep the case on hold and review it.',
  review_unavailable: 'The service queue is not connected or could not be checked. No service action is confirmed.',
  recovery_pending: 'The exact response is not available yet. Keep the task pending and try again later.',
  recovery_conflict: 'The order, recipient or recovered response does not match the reviewed evidence. Refresh and reconcile it.',
  recovery_unavailable: 'Response recovery is unavailable or not configured. No draft or send is confirmed.',
};

export default function ScanServiceReview() {
  const [page, setPage] = useState<Page | null>(null), [detail, setDetail] = useState<ScanReviewDetail | null>(null);
  const [selected, setSelected] = useState<string | null>(null), [cursor, setCursor] = useState<string | null>(null);
  const [revision, setRevision] = useState(0), [loading, setLoading] = useState(true), [error, setError] = useState('');
  const [evidence, setEvidence] = useState(''), [reason, setReason] = useState<'awaiting_evidence' | 'assignment_unclear' | 'not_qualifying' | 'duplicate_or_conflict'>('awaiting_evidence');
  const [attempt, setAttempt] = useState<{ eventId: string; input: ScanReviewAction } | null>(null), [saving, setSaving] = useState(false);
  const [attestationAttempt,setAttestationAttempt]=useState<{eventId:string;input:Record<string,unknown>}|null>(null);
  const [preview,setPreview] = useState<ScanCompletionPreview | null>(null);
  const actionController = useRef<AbortController | null>(null), generation = useRef(0);
  useEffect(() => {
    let controller: AbortController, expiry: ReturnType<typeof setTimeout> | undefined;
    async function load() {
      controller?.abort(); clearTimeout(expiry);
      generation.current++; actionController.current?.abort(); setSaving(false);
      controller = new AbortController(); const { signal } = controller;
      setPage(null); setDetail(null); setPreview(null); setEvidence(''); setAttempt(null); setAttestationAttempt(null); setError(''); setLoading(true);
      if (document.hidden) return;
      try {
        const fetchData = async (url: string) => {
          const res = await fetch(url, { credentials: 'include', cache: 'no-store', signal });
          let body; try { body = await res.json(); } catch { throw Error('review_unavailable'); }
          if (!res.ok) throw Error(body.code || 'review_unavailable'); return body;
        };
        const base = '/api/admin/scan-service';
        const [rows, current] = await Promise.all([fetchData(base + (cursor ? '?after=' + encodeURIComponent(cursor) : '')),
          selected ? fetchData(base + '/' + encodeURIComponent(selected)) : Promise.resolve(null)]);
        if (signal.aborted) return;
        const remaining = Math.min(Date.parse(rows.accessExpiresAt), current ? Date.parse(current.accessExpiresAt) : Infinity) - Date.now();
        if (!Number.isFinite(remaining) || remaining <= 0) throw Error('review_owner_sign_in_required');
        setPage(rows); setDetail(current); setLoading(false);
        expiry = setTimeout(() => { generation.current++; actionController.current?.abort(); controller.abort(); setPage(null); setDetail(null); setPreview(null); setEvidence(''); setAttempt(null); setAttestationAttempt(null); setError('review_owner_sign_in_required'); }, remaining);
      } catch (e) { if (!signal.aborted) { setPage(null); setDetail(null); setLoading(false); setError(e instanceof Error ? e.message : 'review_unavailable'); } }
    }
    void load(); const refresh = () => { void load(); };
    window.addEventListener('focus', refresh); document.addEventListener('visibilitychange', refresh);
    return () => { generation.current++; controller?.abort(); actionController.current?.abort(); clearTimeout(expiry); window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh); };
  }, [selected, cursor, revision]);

  async function submit(action: { eventId: string; input: ScanReviewAction }) {
    actionController.current?.abort(); const controller = new AbortController(); actionController.current = controller;
    const currentGeneration = generation.current;
    setSaving(true); setError(''); setAttempt(action);
    try {
      const response = await fetch('/api/admin/scan-service/' + encodeURIComponent(action.eventId) + '/actions', {
        method: 'POST', credentials: 'include', cache: 'no-store', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(action.input), signal: controller.signal,
      });
      const body = await response.json();
      if (controller.signal.aborted || generation.current !== currentGeneration) return;
      if (!response.ok) throw Error(body.code || 'review_unavailable');
      setAttempt(null); setDetail(null); setRevision(n => n + 1);
    } catch (e) { if (!controller.signal.aborted && generation.current === currentGeneration) setError(e instanceof Error ? e.message : 'review_unavailable'); }
    finally { if (generation.current === currentGeneration) setSaving(false); }
  }
  const act = (decision: ScanReviewAction['decision']) => {
    if (!detail || saving || attempt) return;
    void submit({ eventId: detail.receipt.eventId, input: { mutationId: crypto.randomUUID(), expectedVersion: detail.receipt.version,
      decision, reason: decision === 'resolved' ? 'service_reviewed' : reason, ...(decision === 'resolved' ? { evidenceRef: evidence } : {}) } });
  };
  const editable = detail?.receipt.outcome === 'review' && ['open','held'].includes(detail.receipt.state);
  async function loadPreview() {
    if (!detail || saving) return;
    actionController.current?.abort(); const controller = new AbortController(); actionController.current=controller;
    const currentGeneration=generation.current;
    setPreview(null); setError(''); setSaving(true);
    try {
      const response=await fetch('/api/admin/scan-service/'+encodeURIComponent(detail.receipt.eventId)+'/preview',{
        method:'POST',credentials:'include',cache:'no-store',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({expectedVersion:detail.receipt.version}),signal:controller.signal });
      const body=await response.json();
      if (controller.signal.aborted || generation.current!==currentGeneration) return;
      if (!response.ok) throw Error(body.code || 'recovery_unavailable');
      setPreview(body);
    } catch(e) { if (!controller.signal.aborted && generation.current===currentGeneration) setError(e instanceof Error ? e.message:'recovery_unavailable'); }
    finally { if (generation.current===currentGeneration) setSaving(false); }
  }
  async function saveAttestation(action:{eventId:string;input:Record<string,unknown>}){
    if(saving)return;actionController.current?.abort();const controller=new AbortController();actionController.current=controller;const active=generation.current;
    setSaving(true);setError('');setAttestationAttempt(action);
    try{const res=await fetch('/api/admin/scan-service/'+encodeURIComponent(action.eventId)+'/evidence',{method:'POST',credentials:'include',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify(action.input),signal:controller.signal});const body=await res.json();if(controller.signal.aborted||generation.current!==active)return;if(!res.ok)throw Error(body.code||'review_evidence_required');setAttestationAttempt(null);setDetail(null);setRevision(x=>x+1);}
    catch(e){if(!controller.signal.aborted&&generation.current===active)setError(e instanceof Error?e.message:'review_unavailable');}
    finally{if(generation.current===active)setSaving(false);}
  }
  return <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-16"><SEO title="Scan service queue | Admin" description="Owner-reviewed Scan service work." canonicalPath="/admin/scan-service" />
    <div className="max-w-6xl mx-auto px-4 space-y-6">
      <Link href="/admin/submissions" className="text-teal-200 underline">Back to Admin Hub</Link>
      <div className="flex justify-between items-start gap-4 flex-wrap"><div><h1 className="text-3xl font-bold">Scan service queue</h1>
        <p className="text-white/70 mt-2">Owner review · exact-order assignment · coach handoff</p></div>
        <Button variant="outline" disabled={saving} onClick={() => { setPage(null); setDetail(null); setRevision(n => n + 1); }}>Refresh evidence</Button></div>
      <ActionLearning task="Open one submission. Compare its order reference with the recorded participant and recipient before choosing an action." check="If evidence is missing or conflicts, keep it on hold. A paid order or forwarded link does not prove who answered. Resolving the review does not send a message." />
      <ContextHelp label="Order assignment and coach handoff" meaning="Assignment records which order a response belongs to and who should receive the result. A handoff gives a coach the next task and deadline." example="Two orders can share a payer’s email. Each still needs its own order and participant evidence." action="Read the recorded evidence. Hold unclear cases; do not use the payer’s address as a shortcut." />
      <ContextHelp label="Receipt, digest and preview fingerprint" meaning="A receipt records an incoming event. A digest is a short value calculated from content, used to check whether it changed. A preview fingerprint binds a draft to its checked content and recipients." example="Changing the recipient or answers changes the fingerprint, so an older draft cannot stand in for the new one." action="Check the full recipient list and message. A fingerprint does not prove someone’s identity or approve sending." />
      <p className="text-white/70">Resolving a submission records a reviewed assignment and creates coach work. It does not verify identity or send an email. Message approval and delivery are separate.</p>
      {loading && <p role="status">Checking owner access and outstanding work…</p>}
      {error && <div role="alert" className="border border-amber-300/40 rounded p-4"><p>{explanations[error] || explanations.review_unavailable}</p>
        {attestationAttempt&&<Button variant="outline" className="mt-3" disabled={saving} onClick={()=>void saveAttestation(attestationAttempt)}>Retry the same evidence save</Button>}
        {attempt && <Button variant="outline" className="mt-3" disabled={saving} onClick={() => void submit(attempt)}>Retry the same action</Button>}</div>}
      {page && <Card className={surface}><CardHeader><CardTitle>Submission receipts</CardTitle><p className="text-white/60">Up to 25 records per page. Each read is audited. Dates use Helsinki time.</p></CardHeader><CardContent>
        {!page.receipts.length ? <p>No receipts on this page. This does not confirm that provider intake is connected.</p> : <ol className="space-y-3">{page.receipts.map(row => <li key={row.eventId} className="border border-white/15 rounded p-4">
          <div className="flex justify-between flex-wrap gap-3"><div><p className="font-semibold">{row.state === 'open' ? row.outcome : row.state}</p>
            <p className="text-white/70">Original intake: {row.outcome} · {row.reason.replaceAll('_', ' ')}</p>
            <p className="text-sm text-white/60 break-all">Receipt {row.eventId} · version {row.version}</p></div>
            <Button variant="outline" disabled={saving} onClick={() => setSelected(row.eventId)}>Review submission</Button></div>
          <p className="mt-2 text-white/70">{row.nextAction}</p><p className="text-sm text-white/60 mt-2">Received {date(row.receivedAt)}{row.dueAt ? ' · Coach target ' + date(row.dueAt) : ''}</p>
        </li>)}</ol>}
        <div className="flex gap-3 mt-4">{cursor && <Button variant="outline" onClick={() => { setSelected(null); setCursor(null); }}>First page</Button>}
          {page.nextCursor && <Button variant="outline" onClick={() => { setSelected(null); setCursor(page.nextCursor); }}>Next page</Button>}</div>
      </CardContent></Card>}
      {detail && <Card className={surface}><CardHeader><CardTitle>Review this submission</CardTitle></CardHeader><CardContent className="space-y-4">
        <p className="break-all">Receipt: {detail.receipt.eventId} · Order: {detail.purchaseId || 'Not established'}</p>
        <p className="text-white/70">{detail.receipt.nextAction}</p>
        {editable && <><label className="block">Reason for hold or rejection<select value={reason} onChange={e => setReason(e.target.value as typeof reason)} className="block bg-zinc-900 border border-white/30 rounded p-2 mt-2 w-full">
          <option value="awaiting_evidence">Waiting for evidence</option><option value="assignment_unclear">Assignment or recipient unclear</option>
          <option value="not_qualifying">Not a qualifying completed response</option><option value="duplicate_or_conflict">Duplicate or conflicting service record</option>
        </select></label><div className="flex gap-3"><Button variant="outline" disabled={saving || !!attempt} onClick={() => act('held')}>Keep on hold</Button>
          <Button variant="outline" disabled={saving || !!attempt} onClick={() => act('rejected')}>Reject this assignment</Button></div>
          {detail.purchaseId&&<details className="border border-teal-300/25 rounded p-4"><summary className="cursor-pointer font-semibold text-teal-200">Record evidence you have already reviewed</summary>
            <ContextHelp label="Human attestation" meaning="You record what you checked and where its evidence is kept. The website cannot know who answered from a link or email address alone." example="A coach may already have checked a participant during the agreed service. Record that existing evidence; do not ask for another questionnaire step." action="Use the existing participant and restricted evidence references. Stop if identity, recipient or payer access is unclear."/>
            <form className="space-y-4 mt-4" onSubmit={e=>{e.preventDefault();if(saving||attestationAttempt)return;const data=new FormData(e.currentTarget),get=(k:string)=>String(data.get(k)??'').trim();void saveAttestation({eventId:detail.receipt.eventId,input:{mutationId:crypto.randomUUID(),expectedVersion:detail.receipt.version,participantRef:get('participantRef'),recipientEmail:get('recipientEmail'),assignmentEvidenceRef:get('assignmentEvidenceRef'),recipientEvidenceRef:get('recipientEvidenceRef'),identityReviewed:data.get('identityReviewed')==='on',recipientReviewed:data.get('recipientReviewed')==='on',payerPermissionsReviewed:data.get('payerPermissionsReviewed')==='on'}});}}>
              {([['participantRef','Existing participant reference','text'],['recipientEmail','Reviewed result recipient','email'],['assignmentEvidenceRef','Restricted assignment evidence reference','text'],['recipientEvidenceRef','Restricted recipient evidence reference','text']] as const).map(([name,label,type])=><label key={name} className="block">{label}<input required autoComplete="off" name={name} type={type} className="block w-full bg-zinc-900 border border-white/30 rounded p-3 mt-2"/></label>)}
              <p className="text-white/70">Use references to existing restricted evidence. Do not paste private answers, identity documents or messages into these fields.</p>
              {([['identityReviewed','I reviewed who the participant is using separate evidence.'],['recipientReviewed','I reviewed who may receive the results at this address.'],['payerPermissionsReviewed','I checked that payment does not give a payer or employer access to private results.']] as const).map(([name,label])=><label key={name} className="flex gap-3 items-start"><input name={name} type="checkbox" required className="mt-1"/><span>{label}</span></label>)}
              <Button disabled={saving||!!attestationAttempt}>Save reviewed evidence · no completion or email</Button>
            </form></details>}
          <label className="block">Existing assignment and recipient evidence<select value={evidence} onChange={e => setEvidence(e.target.value)} className="block bg-zinc-900 border border-white/30 rounded p-2 mt-2 w-full">
            <option value="">Select existing reviewed evidence</option>{detail.evidenceOptions.map(e => <option key={e.reference} value={e.reference}>{e.reference} · {e.participantRef} · {e.recipientEmail}</option>)}
          </select></label>
          {!detail.canResolve && <p className="text-amber-200">Resolution needs a qualifying final response, one eligible order and matching assignment/recipient evidence. Keep unclear cases on hold.</p>}
          <Button disabled={saving || !!attempt || !detail.canResolve || !evidence} onClick={() => act('resolved')}>Record assignment and create coach task</Button>
        </>}
        {detail.task && <section className="border border-teal-300/30 rounded p-4 space-y-2"><h2 className="text-xl font-semibold">Coach handoff — retrieval pending</h2>
          <p>Owner reference: {detail.task.ownerId || 'Needs assignment'}</p><p>Target: {date(detail.task.dueAt)}</p>
          <p className="break-all">Reviewed participant: {detail.task.participantRef || 'Not recorded'} · recipient: {detail.task.recipientEmail || 'Needs review'}</p>
          <p className="text-white/70">{detail.task.nextAction}</p><p>Signed originals use separate encrypted evidence storage. A finished report is not stored by this queue. This review action did not send a message.</p>
          <Button variant="outline" disabled={saving || !!attempt} onClick={() => void loadPreview()}>Recover response and preview completion email</Button></section>}
        {preview && <section className="border border-amber-200/40 rounded p-4 space-y-4"><h2 className="text-xl font-semibold">Completion email preview — not approved or sent</h2>
          <dl className="space-y-2 break-words"><div><dt className="font-semibold">From</dt><dd>{preview.message.from}</dd></div>
            <div><dt className="font-semibold">To · reviewed participant</dt><dd>{preview.message.to}</dd></div>
            <div><dt className="font-semibold">Coach copies</dt><dd>{preview.message.cc.join(', ')}</dd></div>
            <div><dt className="font-semibold">Reply to</dt><dd>{preview.message.replyTo}</dd></div>
            <div><dt className="font-semibold">Subject</dt><dd>{preview.message.subject}</dd></div></dl>
          <p className="text-white/70">This draft is bound to the reviewed order, recipient and recovered content. A changed draft needs a new review. There is no send action here.</p>
          <details><summary className="cursor-pointer text-teal-200">Message fingerprint and source</summary><p className="break-all text-sm mt-2">{preview.fingerprint}</p>
            <p className="text-sm">Exact response {preview.provenance.responseId} · recovered {date(preview.provenance.retrievedAt)}</p></details>
          <h3 className="font-semibold">Plain text</h3><pre className="whitespace-pre-wrap break-words bg-black/30 p-3 rounded text-sm">{preview.message.text}</pre>
          <details><summary className="cursor-pointer text-teal-200">HTML preview · external assets blocked</summary>
            <p className="text-sm text-white/60 mt-2">Links are disabled in this view. The original message HTML remains part of the draft.</p>
            <iframe title="Completion email HTML preview" sandbox="" referrerPolicy="no-referrer" className="w-full h-[560px] rounded border border-white/20 mt-3"
              srcDoc={'<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; img-src data:">' + preview.message.html.replace(/<a\b[^>]*>/gi,'<span>').replace(/<\/a\s*>/gi,'</span>')} /></details>
          {preview.message.attachments.map(attachment => <details key={attachment.filename}><summary className="cursor-pointer text-teal-200">Attachment: {attachment.filename}</summary>
            <pre className="whitespace-pre-wrap break-words bg-black/30 p-3 rounded text-sm mt-2">{attachment.contentUtf8}</pre></details>)}
        </section>}
        <section><h2 className="font-semibold">Latest review actions</h2>{detail.history.length ? <ol className="mt-2 space-y-2">{detail.history.map(h => <li key={h.version} className="text-white/70">v{h.version} · {h.decision} · {h.reason.replaceAll('_', ' ')} · {date(h.recordedAt)}</li>)}</ol> : <p className="text-white/60">No operator decision recorded.</p>}</section>
      </CardContent></Card>}
    </div></main>;
}
