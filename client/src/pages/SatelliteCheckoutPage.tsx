import { useSiteLanguage } from "@/hooks/use-site-language";
import { useState } from 'react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Link, useSearch } from 'wouter';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiRequest } from '@/lib/queryClient';
import { stripePromise } from '@/lib/stripe-client';
import { scanLiteracy } from '@shared/scan-literacy';
import { checkoutLanguage, scanCheckoutUrl, scanVoucherDiscount, prepareScanPurchase, SCAN_PRICE } from '@shared/scan-checkout';

function ScanPayment({ language, amount }: { language: 'en' | 'fr'; amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fr = language === 'fr';
  return <form className="space-y-5" onSubmit={async event => {
    event.preventDefault();
    if (!stripe || !elements || busy) return;
    setBusy(true); setError('');
    try {
      const result = await stripe.confirmPayment({ elements, confirmParams: {
        return_url: `${window.location.origin}/payment-success?product=satellitescan&lang=${language}`,
      }});
      if (result.error) setError(result.error.message || (fr ? 'Le paiement a échoué. Réessayez.' : 'Payment failed. Please try again.'));
    } catch {
      setError(fr ? 'Connexion interrompue. Vérifiez votre paiement avant de réessayer.' : 'Connection lost. Check your payment before trying again.');
    } finally { setBusy(false); }
  }}>
    <PaymentElement options={{ layout: 'tabs' }} />
    {error && <p role="alert">{error}</p>}
    <Button type="submit" disabled={!stripe || !elements || busy} className="w-full bg-needs text-white">
      {busy ? (fr ? 'Paiement en cours…' : 'Processing…') : `${fr ? 'Payer' : 'Pay'} ${new Intl.NumberFormat(fr ? 'fr-FR' : 'en-IE', { style: 'currency', currency: 'EUR' }).format(amount)}`}
    </Button>
  </form>;
}

export default function SatelliteCheckoutPage() {
  const search = useSearch();
  const language = useSiteLanguage();
  const fr = language === 'fr';
  const c = scanLiteracy[language];
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [voucher, setVoucher] = useState('');
  const [approvedVoucher, setApprovedVoucher] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const price = approvedVoucher && approvedVoucher === voucher.trim() ? 0 : SCAN_PRICE;
  const money = new Intl.NumberFormat(fr ? 'fr-FR' : 'en-IE', { style: 'currency', currency: 'EUR' }).format(price);

  async function checkVoucher() {
    setBusy(true); setError(''); setNotice(''); setApprovedVoucher('');
    try {
      const response = await apiRequest('POST', '/api/validate-coupon', { code: voucher.trim() });
      const data = await response.json();
      if (scanVoucherDiscount(data.valid === true, data.discountAmount) === SCAN_PRICE) {
        setApprovedVoucher(voucher.trim());
        setNotice(fr ? 'Bon appliqué : il couvre le Scan complet. Il sera vérifié à nouveau lors de la validation.' : 'Voucher applied: it covers the full Scan. It will be checked again when you confirm.');
      } else {
        setError(fr ? 'Ce bon ne couvre pas le Scan complet. Le prix reste 99,95 €. Contactez-nous si une autre réduction vous a été proposée.' : 'This voucher does not cover the full Scan. The price remains €99.95. Contact us if you were offered another discount.');
      }
    } catch { setError(fr ? 'Impossible de vérifier ce bon. Réessayez.' : 'Could not check this voucher. Please try again.'); }
    finally { setBusy(false); }
  }

  return <div lang={language} className="min-h-screen pt-28 pb-20 px-4" style={{ background: 'linear-gradient(#0a0a0a,#0a1628 45%,#0a0a0a)' }}>
    <SEO title={fr ? 'Acheter le Satellite Scan | Green Elephant' : 'Buy Satellite Scan | Green Elephant'} description={c.intro} noIndex />
    <div className="max-w-4xl mx-auto">
      <nav className="flex flex-wrap justify-between gap-4 mb-8" aria-label={fr ? 'Achat' : 'Purchase'}>
        <Link href={fr ? "/fr/scan" : "/scan"}>← {fr ? 'Satellite Scan' : 'Satellite Scan'}</Link>
        <a href={scanCheckoutUrl(fr ? 'en' : 'fr')} lang={fr ? 'en' : 'fr'}>{fr ? 'English' : 'Français'}</a>
      </nav>
      <h1 className="text-3xl font-bold mb-8">{fr ? 'Votre Satellite Scan' : 'Your Satellite Scan'}</h1>
      <aside className="mb-8 border-l-4 border-needs bg-needs/10 p-4" aria-label={fr ? "Langue du Scan" : "Scan language"}><strong>{fr ? "Le Scan est en anglais" : "The Scan is in English"}</strong><p className="mt-2">{c.languageNotice}</p></aside>
      <div className="grid md:grid-cols-2 gap-10">
        <section aria-labelledby="scan-order-title">
          <h2 id="scan-order-title" className="text-2xl font-semibold mb-4">{c.includedTitle}</h2>
          <p className="text-3xl font-bold mb-6" aria-live="polite">{money}</p>
          <ul className="space-y-4 list-disc pl-5">{c.included.map(item => <li key={item}>{item}</li>)}</ul>
          <p className="text-sm text-muted-foreground mt-6">{c.small}</p>
          <p className="text-sm text-muted-foreground mt-4">{c.boundary}</p>
        </section>
        <section aria-labelledby="scan-payment-title" className="space-y-5">
          <h2 id="scan-payment-title" className="text-2xl font-semibold">{clientSecret ? (fr ? 'Paiement sécurisé' : 'Secure payment') : (fr ? 'Vos coordonnées' : 'Your details')}</h2>
          {error && <p role="alert" className="text-red-300">{error}</p>}
          {notice && <p role="status">{notice}</p>}
          {!clientSecret ? <form className="space-y-5" onSubmit={async event => {
            event.preventDefault();
            if (busy) return;
            setBusy(true); setError('');
            try {
              if (price > 0 && !stripePromise) throw new Error('Payments unavailable');
              const result = await prepareScanPurchase({ email, name, language, voucher: price === 0 ? approvedVoucher : undefined }, async (path, body) => {
                const response = await apiRequest('POST', path, body);
                return response.json();
              });
              if (result.kind === 'free') window.location.assign(`/payment-success?free=true&product=satellitescan&lang=${language}`);
              else setClientSecret(result.clientSecret);
            } catch { setError(fr ? 'Impossible de préparer votre achat. Réessayez ou contactez esteve@greenelephant.org.' : 'Could not prepare your purchase. Try again or contact esteve@greenelephant.org.'); }
            finally { setBusy(false); }
          }}>
            <label className="block">{fr ? 'Adresse e-mail' : 'Email address'}<Input className="mt-2" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} disabled={busy} /></label>
            <label className="block">{fr ? 'Nom (facultatif)' : 'Name (optional)'}<Input className="mt-2" autoComplete="name" value={name} onChange={e => setName(e.target.value)} disabled={busy} /></label>
            <details><summary className="cursor-pointer">{fr ? 'Vous avez un bon pour un Scan offert ?' : 'Have a voucher for a free Scan?'}</summary>
              <label className="block mt-3">{fr ? 'Code du bon' : 'Voucher code'}<Input className="mt-2" value={voucher} disabled={busy} onChange={e => { setVoucher(e.target.value.toUpperCase()); setApprovedVoucher(''); setNotice(''); }} /></label>
              <Button className="mt-3" type="button" variant="outline" disabled={busy || !voucher.trim()} onClick={checkVoucher}>{fr ? 'Vérifier le bon' : 'Check voucher'}</Button>
            </details>
            {!stripePromise && price > 0 && <p role="status">{fr ? 'Le paiement en ligne est indisponible. Contactez-nous pour commander.' : 'Online payment is unavailable. Please contact us to order.'}</p>}
            <Button type="submit" className="w-full bg-needs text-white" disabled={busy || (!stripePromise && price > 0)}>{busy ? (fr ? 'Préparation…' : 'Preparing…') : price === 0 ? (fr ? 'Valider mon Scan offert' : 'Claim my free Scan') : `${fr ? 'Continuer vers le paiement' : 'Continue to payment'} — ${money}`}</Button>
          </form> : <Elements stripe={stripePromise} options={{ clientSecret, locale: language, appearance: { theme: 'night', variables: { colorPrimary: '#009999', colorBackground: '#0a1628' } } }}><ScanPayment language={language} amount={SCAN_PRICE} /></Elements>}
          <p className="text-sm text-muted-foreground">{fr ? 'Votre e-mail sert au reçu et au suivi de votre achat. Vos réponses au Scan et vos résultats sont aussi envoyés à Estève et Anu pour vous accompagner. Cet achat ne vous inscrit pas à une newsletter.' : 'We use your email for your receipt and service updates. Your Scan answers and results are also sent to Estève and Anu to support your coaching. Buying does not subscribe you to a newsletter.'} <Link href="/privacy" className="underline">{fr ? 'Confidentialité (en anglais)' : 'Privacy policy'}</Link>.</p>
          <a href="mailto:esteve@greenelephant.org" className="block underline">esteve@greenelephant.org</a>
        </section>
      </div>
    </div>
  </div>;
}
