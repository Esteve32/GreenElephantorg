import { AdminTroubleshooting } from '@/components/admin/AdminTroubleshooting';
import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { SEO } from '@/components/SEO';
import { LearningTopic } from '@/components/admin/AdminLearning';
import { ADMIN_LEARNING, type AdminLearningId } from '@shared/admin-learning';

export default function AdminTrainingPage() {
  const [access, setAccess] = useState<'checking' | 'allowed' | 'denied'>('checking');
  const [helpCode, setHelpCode] = useState('sign_in_required');
  const [scenario, setScenario] = useState<'consent' | 'recovery'>('consent');
  const [step, setStep] = useState(0);
  useEffect(() => {
    let controller: AbortController;
    const check = async () => {
      controller?.abort(); controller = new AbortController(); const signal = controller.signal;
      setAccess('checking'); if (document.hidden) return;
      try {
        // Only authentication status is fetched. No customer, team, consent or settings query.
        const response = await fetch('/api/admin/training/access', { credentials: 'include', cache: 'no-store', signal });
        const body = await response.json();
        if (!signal.aborted) {
          setHelpCode(response.status === 403 ? 'not_authorized' : response.status >= 500 ? 'callback_failed' : 'sign_in_required');
          setAccess(response.ok && body.isAuthenticated === true ? 'allowed' : 'denied');
        }
      } catch { if (!signal.aborted) { setHelpCode('callback_failed'); setAccess('denied'); } }
    };
    void check(); window.addEventListener('focus', check); document.addEventListener('visibilitychange', check);
    return () => { controller?.abort(); window.removeEventListener('focus', check); document.removeEventListener('visibilitychange', check); };
  }, []);
  const steps = scenario === 'consent' ? [
    ['1. Describe the activity', 'Fictional activity: optional workshop invitations. Its RoPA entry describes the purpose, categories, recipients and retention review.'],
    ['2. Record a choice', 'Fictional learner A opts in to those invitations after reading a clear notice. Record the specific choice and notice version separately from the activity register.'],
    ['3. Respect a withdrawal', 'The learner withdraws. Stop marketing based on that consent and record the event. Check downstream providers; do not assume every queued message has stopped.'],
    ['4. Review the evidence', 'An authorised privacy administrator reviews the event. A regular administrator can still run ordinary tools without receiving access to that history.'],
  ] : [
    ['1. Recognise the incident', 'The fictional owner loses their phone. Record the incident and try an independently available Google recovery method.'],
    ['2. Verify and authorise', 'If account repair is needed, an authorised operator verifies the person and obtains approval for a precise, limited repair. No password bypass is enabled.'],
    ['3. Recover and revoke', 'Perform only the approved repair, preserve evidence and revoke affected sessions. This is a tabletop step; the screen changes no account.'],
    ['4. Review and close', 'Verify fresh sign-in and correct permissions, review the incident and improve the recovery drill. Provider outage may still prevent access.'],
  ];
  return <div className="min-h-screen bg-[#0a1018] text-white pt-24 pb-16">
    <SEO title="Admin Learning Lab" description="Fictional examples for AI literacy training." canonicalPath="/admin/training" noIndex />
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <h1 className="text-3xl font-bold font-heading">Admin Learning Lab</h1>
      <p className="text-lg text-white/75 mt-3">Privacy, consent and secure access — explained through a working website project.</p>
      {access === 'checking' ? <p className="py-8" role="status">Checking administrator access…</p> : access === 'denied' ?
        <AdminTroubleshooting code={helpCode} /> : <>
        <div className="rounded-xl border border-teal-300/35 bg-teal-300/10 p-5 my-6" role="note">
          <p className="font-semibold text-teal-100">Training view · fictional examples · no live actions</p>
          <p className="mt-2 text-white/80">This view loads no customer, consent, team or settings records. Steps are illustrations, not completed operations. They do not certify GDPR compliance or confirm MFA setup.</p>
        </div>
        <section className="rounded-xl border border-white/15 p-5 mb-8" aria-label="Teaching scenarios">
          <h2 className="text-xl font-semibold">Walk through an example</h2>
          <div className="flex flex-wrap gap-3 my-4">
            {(['consent', 'recovery'] as const).map(value => <button key={value} type="button" aria-pressed={scenario === value}
              className={`rounded-lg border px-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300 ${scenario === value ? 'bg-teal-700 border-teal-300' : 'border-white/25'}`}
              onClick={() => { setScenario(value); setStep(0); }}>{value === 'consent' ? 'Consent & RoPA' : 'Break Glass Protocol'}</button>)}
          </div>
          <div aria-live="polite" className="rounded-lg bg-white/5 p-5 min-h-36"><h3 className="text-lg font-semibold text-teal-100">{steps[step][0]}</h3><p className="text-base leading-relaxed mt-3 text-white/80">{steps[step][1]}</p></div>
          <div className="flex flex-wrap gap-3 items-center mt-4">
            <button className="rounded border border-white/25 px-4 py-2 disabled:opacity-40" disabled={step === 0} onClick={() => setStep(n => n - 1)}>Previous</button>
            <span>Step {step + 1} of {steps.length}</span>
            <button className="rounded border border-teal-300/40 px-4 py-2 disabled:opacity-40" disabled={step === steps.length - 1} onClick={() => setStep(n => n + 1)}>Next illustration</button>
            <button className="underline px-3 py-2 text-white/70" onClick={() => setStep(0)}>Reset example</button>
          </div>
        </section>
        <h2 className="text-2xl font-semibold mb-3">Explore the terms</h2>
        <p className="text-white/70 mb-5">Hover or use keyboard focus for a definition. Click or tap to expand. Source guidance checked 8 October 2026.</p>
        <div className="grid md:grid-cols-2 gap-4 items-start">{(Object.keys(ADMIN_LEARNING) as AdminLearningId[]).map(topic => <LearningTopic key={topic} topic={topic} />)}</div>
        <details className="rounded-xl border border-amber-200/30 p-5 mt-8"><summary className="cursor-pointer font-semibold text-amber-100">Leave the teaching view</summary>
          <p className="text-white/75 mt-3">Stop sharing your screen before opening operational pages; they may show real records.</p>
          <Link href="/admin/submissions" className="inline-block text-teal-200 underline mt-3">Return to the operational Admin Hub</Link>
        </details>
      </>}
    </div>
  </div>;
}
