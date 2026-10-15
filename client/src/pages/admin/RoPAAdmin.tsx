import PrivacyWorkflows from '@/components/admin/PrivacyWorkflows';
import RopaRegister from '@/components/admin/RopaRegister';
import { AdminTroubleshooting } from '@/components/admin/AdminTroubleshooting';
import { AdminLearningPanel } from '@/components/admin/AdminLearning';
import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Shield, RefreshCw, LockKeyhole, History, Inbox, Activity, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SEO } from '@/components/SEO';
import type { PrivacyWithdrawalPage } from '@shared/privacy-admin';

type State = { kind: 'loading' } | { kind: 'error'; code: string } | { kind: 'ready'; page: PrivacyWithdrawalPage };
const tabs = [
  ['overview', 'Overview', BookOpen], ['consent', 'Consent history', History],
  ['notices', 'Notice wording', BookOpen], ['outbox', 'Email review', Inbox], ['retention', 'Retention', History], ['inbox', 'Privacy inbox', Inbox], ['health', 'Troubleshooting', Activity],
  ['recovery', 'Recovery & audit', LockKeyhole],
] as const;
const surface = 'bg-white/5 border-white/10';

export default function RoPAAdmin() {
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [cursor, setCursor] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const [tab, setTab] = useState('overview');
  const refresh = () => { setState({ kind: 'loading' }); setRevision(n => n + 1); };

  // Private results stay in component memory, never in the shared query cache.
  // Hide on tab switching, clear on failure/unmount, and recheck access on return.
  useEffect(() => {
    let controller: AbortController;
    let expiry: ReturnType<typeof setTimeout> | undefined;
    async function load() {
      controller?.abort(); clearTimeout(expiry);
      controller = new AbortController();
      const signal = controller.signal;
      setState({ kind: 'loading' });
      if (document.hidden) return;
      try {
        const response = await fetch('/api/admin/privacy/withdrawals' + (cursor ? '?after=' + encodeURIComponent(cursor) : ''), {
          credentials: 'include', cache: 'no-store', signal,
        });
        const body = await response.json();
        if (signal.aborted) return;
        if (!response.ok) { setState({ kind: 'error', code: body.code || 'privacy_unavailable' }); return; }
        const remaining = Date.parse(body.accessExpiresAt) - Date.now();
        if (!Number.isFinite(remaining) || remaining <= 0) {
          setState({ kind: 'error', code: 'google_sign_in_required' }); return;
        }
        setState({ kind: 'ready', page: body });
        expiry = setTimeout(() => setState({ kind: 'error', code: 'google_sign_in_required' }), remaining);
      } catch {
        if (!signal.aborted) setState({ kind: 'error', code: 'privacy_unavailable' });
      }
    }
    void load();
    const onVisibility = () => { void load(); };
    window.addEventListener('focus', onVisibility);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      controller?.abort(); clearTimeout(expiry);
      window.removeEventListener('focus', onVisibility);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [cursor, revision]);

  const page = state.kind === 'ready' ? state.page : null;
  return <main className="min-h-screen pt-24 pb-16 bg-[#0a0a0a] text-white">
    <SEO title="RoPA & Privacy | Admin" description="Restricted privacy administration." canonicalPath="/admin/ropa" />
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link href="/admin/submissions" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6"><ArrowLeft className="h-4 w-4" /> Admin Hub</Link>
      <div className="flex flex-wrap gap-4 items-start justify-between mb-6">
        <div><div className="flex items-center gap-3 mb-2"><Shield className="w-8 h-8 text-[#009999] shrink-0" /><h1 className="text-3xl font-bold font-heading">RoPA & Privacy</h1></div>
          <p className="text-white/70 max-w-2xl">Processing activities, consent evidence and privacy requests. Separate records, connected responsibilities.</p></div>
        <Badge variant="outline" className="border-teal-400/30 text-teal-200">Restricted privacy access</Badge>
      </div>
      <AdminLearningPanel topics={['ropa', 'consent', 'rights', 'audit', 'retention', 'breakglass']} />
      {state.kind === 'loading' && <Card className={surface}><CardContent className="p-6" role="status">Checking privacy access…</CardContent></Card>}
      {state.kind === 'error' && <AdminTroubleshooting code={state.code} />}
      {page && <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-white/5 p-1">
          {tabs.map(([value, label, Icon]) => <TabsTrigger key={value} value={value} className="gap-2 data-[state=active]:bg-[#009999] data-[state=active]:text-white"><Icon className="w-4 h-4" />{label}</TabsTrigger>)}
        </TabsList>
        <TabsContent value="overview" className="space-y-5">
          <RopaRegister />
          <Card className={surface}><CardHeader><CardTitle>Start with consent evidence</CardTitle></CardHeader><CardContent className="space-y-4">
            <p className="text-white/70">Review recorded marketing withdrawals and their event references. Earlier consents and other channels have not been imported. An empty history does not mean that nobody has withdrawn.</p>
            <Button className="bg-[#009999] hover:bg-[#007f7f]" onClick={() => setTab('consent')}>Open consent history</Button>
          </CardContent></Card>
          <p className="text-sm text-white/60">This workspace is being built in stages. Its availability does not certify GDPR compliance. HR and employer payers have no access here.</p>
        </TabsContent>
        <TabsContent value="consent" className="space-y-4">
          <PrivacyWorkflows kind="consent" accessExpiresAt={page.accessExpiresAt}/>
          <Card className={surface}><CardHeader className="gap-3"><div className="flex justify-between gap-3 flex-wrap"><CardTitle>Marketing withdrawals</CardTitle><Button variant="outline" onClick={refresh}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button></div>
            <p className="text-white/70">Newest first · up to 25 records per page · times shown in Helsinki. Each page read is audited before records are returned.</p></CardHeader>
            <CardContent>
              {page.events.length === 0 ? <p className="py-6 text-white/70" role="status">No withdrawal events on this page. This ledger does not include earlier preferences, website checkboxes or Typeform consent.</p>
                : <ol className="space-y-3">{page.events.map(event => <li key={event.id} className="rounded-lg border border-white/10 p-4">
                  <div className="flex gap-3 flex-wrap justify-between"><span className="font-semibold text-teal-200">Marketing consent withdrawn</span><time dateTime={event.recordedAt} className="text-white/70">{new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Helsinki' }).format(new Date(event.recordedAt))} · Helsinki</time></div>
                  <p className="text-white/70 mt-2">Email preference link · {event.contactLinked ? 'Contact link retained' : 'No contact linked'}</p>
                  <p className="text-sm text-white/50 break-all mt-2">Event reference: {event.id}</p>
                </li>)}</ol>}
              <div className="flex gap-3 mt-5 flex-wrap">
                {cursor && <Button variant="outline" onClick={() => { setState({ kind: 'loading' }); setCursor(null); }}>Newest records</Button>}
                {page.nextCursor && <Button variant="outline" onClick={() => { setState({ kind: 'loading' }); setCursor(page.nextCursor); }}>Older records</Button>}
              </div>
            </CardContent>
          </Card>
          <p className="text-sm text-white/60">Event evidence records the withdrawal when received. It does not confirm every provider's current state. Service email preferences are separate.</p>
        </TabsContent>
        <TabsContent value="inbox"><PrivacyWorkflows kind="case" accessExpiresAt={page.accessExpiresAt}/><p className="text-white/60 mt-4">Mailbox import is not connected. Record received requests using their existing references.</p></TabsContent>
        <TabsContent value="notices"><PrivacyWorkflows kind="notice" accessExpiresAt={page.accessExpiresAt}/></TabsContent>
        <TabsContent value="outbox"><PrivacyWorkflows kind="attention" accessExpiresAt={page.accessExpiresAt}/></TabsContent>
        <TabsContent value="retention"><PrivacyWorkflows kind="retention" accessExpiresAt={page.accessExpiresAt}/></TabsContent>
        <TabsContent value="health"><Card className={surface}><CardHeader><CardTitle>What this read confirms</CardTitle></CardHeader><CardContent className="space-y-4 text-white/70">
          <p>The privacy access check, withdrawal-history query and access-audit write succeeded for this request.</p>
          <p>Typeform intake, website consent, provider delivery status, Notion acknowledgement, retention and the weekly admin digest are not checked here.</p>
          <Button variant="outline" onClick={refresh}><RefreshCw className="w-4 h-4 mr-2" />Check again</Button>
        </CardContent></Card></TabsContent>
        <TabsContent value="recovery"><PrivacyWorkflows kind="recovery" accessExpiresAt={page.accessExpiresAt}/></TabsContent>
      </Tabs>}
    </div>
  </main>;
}
