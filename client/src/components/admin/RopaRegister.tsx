import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminTroubleshooting } from './AdminTroubleshooting';
import { ActionLearning, ContextHelp } from './ContextHelp';
import { ROPA_HELP, ROPA_FIELD_GROUPS } from '@shared/ropa-learning';
import { ROPA_FIELDS, emptyRopaRecord, ropaRecordSchema, type RopaActivity, type RopaRecord, type RopaRevision, type RopaPage, type RopaSave } from '@shared/ropa';

const base = '/api/admin/privacy/activities';
const surface = 'bg-white/5 border-white/10';
const textArea = 'w-full min-h-24 rounded border border-white/20 bg-[#182326] p-3 text-base';
class RegisterError extends Error { constructor(readonly code: string) { super('Register request failed'); } }
async function request(path: string, init: RequestInit = {}) {
  const response = await fetch(path, { credentials: 'include', cache: 'no-store', ...init });
  const body = await response.json();
  if (!response.ok) throw new RegisterError(body.code || 'ropa_unavailable');
  return body;
}
export default function RopaRegister() {
  const [page, setPage] = useState<RopaPage | null>(null);
  const [selected, setSelected] = useState<RopaActivity | null>(null);
  const [history, setHistory] = useState<RopaRevision[]>([]);
  const [nextBefore, setNextBefore] = useState<number | null>(null);
  const [edit, setEdit] = useState<RopaRecord | null>(null);
  const [reason, setReason] = useState('');
  const [attest, setAttest] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [query, setQuery] = useState({ search: '', status: '' });
  const pendingSave = useRef<{ id?: string; input: RopaSave } | null>(null);
  const active = useRef<AbortController | null>(null);
  const expiry = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const begin = () => { active.current?.abort(); active.current = new AbortController(); setBusy(true); setError(null); return active.current.signal; };
  const fail = (e: unknown, signal: AbortSignal) => { if (!signal.aborted) setError(e instanceof RegisterError ? e.code : 'ropa_unavailable'); };
  const bindExpiry = (date: string) => {
    clearTimeout(expiry.current); const remaining = Date.parse(date) - Date.now();
    if (!Number.isFinite(remaining) || remaining <= 0) throw new RegisterError('google_sign_in_required');
    expiry.current = setTimeout(() => {
      active.current?.abort(); setPage(null); setSelected(null); setHistory([]); setEdit(null); pendingSave.current = null; setError('google_sign_in_required'); setBusy(false);
    }, remaining);
  };
  async function load(after?: string, applied = query) {
    const signal = begin(); setPage(null); setSelected(null); setHistory([]); setEdit(null); setValidation([]);
    try {
      const params = new URLSearchParams();
      if (after) params.set('after', after); if (applied.search) params.set('search', applied.search); if (applied.status) params.set('status', applied.status);
      const result = await request(base + (params.size ? '?' + params : ''), { signal });
      if (signal.aborted) return;
      if (!Array.isArray(result.activities)) throw new RegisterError('ropa_unavailable');
      result.activities.forEach((a: RopaActivity) => ropaRecordSchema.parse(a.record));
      bindExpiry(result.accessExpiresAt); setPage(result);
    } catch (e) { fail(e, signal); } finally { if (!signal.aborted) setBusy(false); }
  }
  async function open(id: string, before?: number) {
    const signal = begin(); setSelected(null); setHistory([]); setEdit(null); setValidation([]);
    try {
      const result = await request(base + '/' + id + (before ? '?before=' + before : ''), { signal });
      if (signal.aborted) return;
      ropaRecordSchema.parse(result.activity.record);
      if (!Array.isArray(result.revisions)) throw new RegisterError('ropa_unavailable');
      result.revisions.forEach((r: RopaRevision) => ropaRecordSchema.parse(r.record));
      bindExpiry(result.accessExpiresAt); setSelected(result.activity); setHistory(result.revisions); setNextBefore(result.nextBefore);
    } catch (e) { fail(e, signal); } finally { if (!signal.aborted) setBusy(false); }
  }
  useEffect(() => {
    void load();
    return () => { active.current?.abort(); clearTimeout(expiry.current); };
  }, []);
  async function save(retry = false) {
    if (!retry) {
      const parsed = ropaRecordSchema.safeParse(edit); const messages = parsed.success ? [] : parsed.error.issues.map(i => `${i.path.join(' / ')}: ${i.message}`);
      if (reason.trim().length < 3) messages.push('Explain the reason for this version (at least 3 characters).');
      if (edit && ['reviewed','live_verified'].includes(edit.status) && !attest) messages.push('Confirm that you performed the recorded review.');
      setValidation(messages); if (!parsed.success || messages.length) return;
      pendingSave.current = { id: selected?.id, input: { record: parsed.data, reason: reason.trim(), mutationId: crypto.randomUUID(), expectedVersion: selected?.version ?? 0, attestReview: attest } };
    }
    const pending = pendingSave.current; if (!pending) return;
    const signal = begin();
    try {
      const result = await request(base + (pending.id ? '/' + pending.id : ''), {
        method: pending.id ? 'PUT' : 'POST', signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pending.input),
      });
      if (signal.aborted) return;
      pendingSave.current = null; setEdit(null); setReason(''); setAttest(false);
      await open(result.id);
    } catch (e) { fail(e, signal); } finally { if (!signal.aborted) setBusy(false); }
  }
  async function exportRegister() {
    const signal = begin();
    try {
      const result = await request(base + '/export', { signal });
      if (signal.aborted) return;
      const url = URL.createObjectURL(new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a'); link.href = url; link.download = 'ropa-activities.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) { fail(e, signal); } finally { if (!signal.aborted) setBusy(false); }
  }
  const discardPending = () => { pendingSave.current = null; void load(); };
  return <Card className={surface} data-testid="ropa-register"><CardHeader><CardTitle>Processing activity register</CardTitle>
    <ActionLearning task="Choose one real activity, such as sending course joining instructions. Add its name and purpose, then save a draft. Use the help beside each field as you go." check="Can a colleague explain why the data is needed from your description? Leave unknowns blank. Saving a draft does not approve the activity or connect a provider." />
    <p className="text-white/70">Describe each activity, its purpose and responsibilities. Keep individual consent records and private case messages out of this register. Blank fields mean unknown.</p>
    <p className="text-sm text-white/60">Each read, export and saved version is audited. Review labels record a human assessment; they do not certify compliance.</p>
  </CardHeader><CardContent className="space-y-5">
    {busy && <p role="status">Checking and loading the register…</p>}
    {error && <AdminTroubleshooting code={error} onRetry={!pendingSave.current && error === 'ropa_unavailable' ? () => { void load(); } : undefined} retryLabel="Read register again" />}
    {!busy && pendingSave.current && error && <div className="space-y-3 rounded border border-amber-200/30 p-4">
      <p>A save may have reached the server. Retry the same saved request to avoid a duplicate. For a conflict, read the current record before editing again.</p>
      {error === 'ropa_unavailable' && <Button onClick={() => void save(true)}>Retry the same save</Button>}
      <Button variant="outline" onClick={discardPending}>Read saved activities</Button>
    </div>}
    {!busy && !error && !edit && <div className="flex flex-wrap gap-3">
      <Button onClick={() => { setSelected(null); setEdit(emptyRopaRecord()); setReason(''); setAttest(false); }}>Add processing activity</Button>
      <Button variant="outline" onClick={() => void load()}>Refresh register</Button>
      <Button variant="outline" onClick={() => void exportRegister()}>Export complete register (JSON)</Button>
    </div>}
    {!busy && !error && !edit && !selected && page && <>
      <form onSubmit={e => { e.preventDefault(); const next = { search: search.trim(), status: filter }; setQuery(next); void load(undefined,next); }} className="flex flex-wrap items-end gap-3">
        <label className="flex-1 min-w-48">Search register<Input value={search} maxLength={100} onChange={e => setSearch(e.target.value)} placeholder="Purpose, owner or provider" /></label>
        <label>Status<select className="block rounded bg-[#182326] border border-white/20 p-2" value={filter} onChange={e => setFilter(e.target.value)}><option value="">All statuses</option>{['draft','review_required','reviewed','live_verified','archived'].map(s => <option key={s} value={s}>{s.replaceAll('_',' ')}</option>)}</select></label>
        <Button type="submit">Search</Button>
      </form>
      {page.activities.length === 0 ? <p role="status">No activities match this view. This does not establish that no processing takes place.</p> : <ul className="space-y-3">{page.activities.map(a => <li key={a.id} className="border border-white/10 rounded p-4 flex flex-wrap justify-between gap-3">
        <div className="min-w-0 break-words"><h3 className="font-semibold">{a.record.title}</h3><p className="text-white/60">{a.record.status.replaceAll('_',' ')} · version {a.version}</p></div><Button variant="outline" className="max-w-full h-auto whitespace-normal break-all text-left" onClick={() => void open(a.id)}>Open {a.record.title}</Button>
      </li>)}</ul>}
      <div className="flex gap-3"><Button variant="outline" onClick={() => void load()}>First page</Button>{page.nextCursor && <Button onClick={() => void load(page.nextCursor!)}>Next page</Button>}</div>
    </>}
    {!busy && !error && selected && !edit && <section className="space-y-4">
      <h3 className="text-xl font-semibold break-words">{selected.record.title} · version {selected.version}</h3>
      <p>{selected.record.status.replaceAll('_',' ')} · next review: {selected.record.reviewDue || 'Not set'}</p>
      <div className="flex gap-3 flex-wrap"><Button onClick={() => { setEdit({ ...selected.record, status: 'draft', reviewEvidence: '', liveEvidence: '' }); setAttest(false); setReason(''); }}>Edit as new draft version</Button><Button variant="outline" onClick={() => void load()}>Back to activities</Button></div>
      <RecordDetails record={selected.record} />
      <h4 className="text-lg font-semibold">Version history</h4><p className="text-white/60">Latest versions first. Open a version to inspect its recorded content and change reason.</p>
      {history.map(r => <details key={r.version} className="border border-white/10 rounded p-3"><summary className="cursor-pointer">Version {r.version} · {new Date(r.recordedAt).toLocaleString('en-GB', { timeZone: 'Europe/Helsinki' })} Helsinki</summary><p className="mt-3 break-words">Reason: {r.reason}</p><p className="text-sm break-all">Recorded by admin reference: {r.actorId}</p><RecordDetails record={r.record} /></details>)}
      {nextBefore && <Button variant="outline" onClick={() => void open(selected.id,nextBefore)}>Older versions</Button>}
    </section>}
    {!busy && edit && !pendingSave.current && <form className="space-y-5" onSubmit={e => { e.preventDefault(); void save(); }}>
      <h3 className="text-xl font-semibold">{selected ? 'New version' : 'New activity'}</h3>
      {validation.length > 0 && <ul role="alert" className="list-disc pl-6 text-amber-200">{validation.map(m => <li key={m}>{m}</li>)}</ul>}
      <label className="block">Activity name<Input required maxLength={160} value={edit.title} onChange={e => setEdit({ ...edit,title:e.target.value })} /></label>
      <p className="text-white/70">Work through one section at a time. Hover or focus on help for a short meaning; click or tap for an example and a small action.</p>
      {ROPA_FIELD_GROUPS.map((group,index) => <details key={group.title} open={index === 0} className="border border-white/10 rounded p-4">
        <summary className="cursor-pointer font-semibold">{group.title} · {group.fields.filter(key => edit.fields[key]).length}/{group.fields.length} recorded</summary>
        <div className="space-y-5 mt-4">{group.fields.map(key => <div key={key}>
          <label htmlFor={`ropa-${key}`} className="block font-semibold">{ROPA_FIELDS[key]}</label>
          <ContextHelp label={ROPA_FIELDS[key]} {...ROPA_HELP[key]} />
          <textarea id={`ropa-${key}`} className={textArea} maxLength={4000} value={edit.fields[key]} onChange={e => setEdit({ ...edit, fields: { ...edit.fields, [key]: e.target.value } })} />
        </div>)}</div>
      </details>)}
      <details className="border border-white/10 rounded p-4"><summary className="cursor-pointer font-semibold">Linked purposes, notices, surfaces, providers and evidence</summary>
        <ContextHelp label="Metadata links" meaning="A reference points to supporting information. It does not copy that information into this register." example="Notice: the privacy information shown to a person. Surface: the page or form where it appears. Provider: the service handling data. Assessment: a recorded check. Evidence: what supports a claim." action="Choose the kind, add a stable document or record reference, and include its exact version and HTTPS address when available." />
        <p className="my-3 text-white/70">Use stable references and exact notice versions. These are metadata links; saving one does not connect a provider or grant anyone consent.</p>
        {edit.links.map((link,i) => <div key={i} className="my-4 space-y-2 border border-white/10 p-3 rounded">
          <label className="block">Link {i+1} type<select className="block bg-[#182326] border p-2 rounded" value={link.kind} onChange={e => setEdit({...edit,links:edit.links.map((v,n) => n===i?{...v,kind:e.target.value as typeof link.kind}:v)})}>{['purpose','notice','surface','provider','assessment','evidence'].map(k=><option key={k}>{k}</option>)}</select></label>
          {(['reference','version','url'] as const).map(key => <label key={key} className="block">Link {i+1} {key}<Input value={link[key]} onChange={e=>setEdit({...edit,links:edit.links.map((v,n)=>n===i?{...v,[key]:e.target.value}:v)})} /></label>)}
          <Button type="button" variant="outline" onClick={()=>setEdit({...edit,links:edit.links.filter((_,n)=>n!==i)})}>Remove link {i+1}</Button>
        </div>)}<Button type="button" variant="outline" disabled={edit.links.length>=100} onClick={()=>setEdit({...edit,links:[...edit.links,{kind:'purpose',reference:'',version:'',url:''}]})}>Add metadata link</Button>
      </details>
      <ContextHelp label="Review status" meaning="A status tells others how far a record has been checked. It does not certify legal compliance." example="Draft: still being written. Review required: needs a check. Reviewed: a person recorded a review. Live verified: live checks are also recorded. Archived: kept as history." action="Start with draft. Only choose reviewed or live verified after doing and recording those checks." />
      <label className="block">Status<select className="block bg-[#182326] border p-2 rounded" value={edit.status} onChange={e=>setEdit({...edit,status:e.target.value as RopaRecord['status']})}>{['draft','review_required','reviewed','live_verified','archived'].map(s=><option key={s} value={s}>{s.replaceAll('_',' ')}</option>)}</select></label>
      <label className="block">Next review date<Input type="date" value={edit.reviewDue} onChange={e=>setEdit({...edit,reviewDue:e.target.value})} /></label>
      <ContextHelp label="Review evidence and version reason" meaning="Evidence explains what was checked, by whom and when. A version is a saved snapshot of the record." example="Human review checks the record. Live verification checks what the running service actually does. The version reason explains what changed." action="Record what you observed and link supporting evidence. Keep passwords and individual private records out. Set a date to check this record again." />
      <label className="block">Human review evidence<textarea className={textArea} maxLength={4000} value={edit.reviewEvidence} onChange={e=>setEdit({...edit,reviewEvidence:e.target.value})}/></label>
      <label className="block">Live verification evidence (if performed)<textarea className={textArea} maxLength={4000} value={edit.liveEvidence} onChange={e=>setEdit({...edit,liveEvidence:e.target.value})}/></label>
      {['reviewed','live_verified'].includes(edit.status) && <label className="flex gap-3"><input type="checkbox" checked={attest} onChange={e=>setAttest(e.target.checked)}/>I performed the review described above; this is not an automatic certification.</label>}
      <label className="block">Reason for this version<textarea required minLength={3} maxLength={1000} className={textArea} value={reason} onChange={e=>setReason(e.target.value)}/></label>
      <div className="flex flex-wrap gap-3"><Button type="submit">Save activity version</Button><Button type="button" variant="outline" onClick={()=>{setEdit(null);setValidation([]);}}>Cancel edit</Button></div>
    </form>}
  </CardContent></Card>;
}
function RecordDetails({ record }: { record: RopaRecord }) {
  return <div className="space-y-3 break-words"><dl className="space-y-3">{Object.entries(ROPA_FIELDS).map(([key,label])=><div key={key}><dt className="font-semibold">{label}</dt><dd><ContextHelp label={label} {...ROPA_HELP[key as keyof typeof ROPA_FIELDS]} /></dd><dd className="whitespace-pre-wrap text-white/70">{record.fields[key as keyof typeof ROPA_FIELDS] || 'Unknown / not recorded'}</dd></div>)}</dl>
    <ul className="space-y-2">{record.links.map((link,i)=><li key={i} className="break-all">{link.kind}: {link.reference} {link.version && `(version ${link.version})`} {link.url && <a href={link.url} target="_blank" rel="noreferrer" className="underline text-teal-200">Open reference</a>}</li>)}</ul>
    <p>Human review: {record.reviewEvidence || 'Not recorded'}</p><p>Live verification: {record.liveEvidence || 'Not recorded'}</p>
  </div>;
}
