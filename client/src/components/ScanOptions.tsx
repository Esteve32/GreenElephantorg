import { useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { localPage, type SiteLanguage } from '@shared/site-language';

// Retain the existing optional email sign-up and server-gated subscription.
// No request is sent until a visitor submits with an explicit agreement.
export function ScanOptions({ language }: { language: SiteLanguage }) {
  const fr = language === 'fr';
  const { data } = useQuery<{ saasEnabled: boolean }>({ queryKey: ['/api/portal/settings/public'] });
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');
  const consentText = fr
    ? 'J’accepte de recevoir des conseils de communication et des nouvelles occasionnelles de GreenElephant. Je peux me désabonner à tout moment.'
    : 'I agree to receive communication insights and occasional updates from GreenElephant. I can unsubscribe at any time.';
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!consent || !email || status === 'sending') return;
    setStatus('sending');
    try {
      await apiRequest('POST', '/api/scan-interest', { email, name: name || undefined, consentText });
      setStatus('sent');
    } catch { setStatus('error'); }
  }
  return <section className="wrap ge-scan-options" aria-label={fr ? 'Autres possibilités' : 'Other options'}>
    {data?.saasEnabled && <div className="ge-cta-group"><a className="button" href={`${localPage('/checkout', language)}?product=subscription&lang=${language}`}>{fr ? 'Ou vous abonner — 9,95 €/mois' : 'Or subscribe — €9.95/month'}</a></div>}
    <details className="ge-questions"><summary>{fr ? 'Recevoir des conseils par e-mail' : 'Get communication insights by email'}</summary>
      <p className="ge-note">{fr ? 'Les e-mails sont actuellement en anglais.' : 'Email updates are currently in English.'}</p>
      {status === 'sent' ? <p role="status">{fr ? 'Votre demande a été reçue. Consultez votre boîte mail.' : 'Your request was received. Check your inbox.'}</p> :
      <form onSubmit={submit} className="ge-scan-form">
        <label htmlFor="scan-updates-name">{fr ? 'Votre nom (facultatif)' : 'Your name (optional)'}<input id="scan-updates-name" autoComplete="name" value={name} onChange={event=>setName(event.target.value)} /></label>
        <label htmlFor="scan-updates-email">{fr ? 'Votre adresse e-mail' : 'Your email address'}<input id="scan-updates-email" type="email" autoComplete="email" required value={email} onChange={event=>setEmail(event.target.value)} /></label>
        <div className="ge-checkbox"><input id="scan-updates-consent" type="checkbox" required checked={consent} onChange={event=>setConsent(event.target.checked)} /><label htmlFor="scan-updates-consent">{consentText} <a href={localPage('/privacy',language)}>{fr ? 'Confidentialité' : 'Privacy policy'}</a></label></div>
        <div className="ge-cta-group"><button className="button" type="submit" disabled={!consent || !email || status==='sending'}>{status==='sending' ? (fr ? 'Envoi en cours…' : 'Sending…') : (fr ? 'Recevoir les nouvelles' : 'Get updates')}</button></div>
        {status === 'error' && <p role="alert">{fr ? 'L’envoi n’a pas abouti. Veuillez réessayer.' : 'Your request could not be sent. Please try again.'}</p>}
      </form>}
    </details>
  </section>;
}
