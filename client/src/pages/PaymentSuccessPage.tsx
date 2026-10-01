import { useSiteLanguage } from "@/hooks/use-site-language";
import { useEffect, useState } from 'react';
import { Link, useSearch } from 'wouter';
import { SEO } from '@/components/SEO';
import { stripePromise } from '@/lib/stripe-client';
import { checkoutLanguage, paymentOutcome, scanCheckoutUrl } from '@shared/scan-checkout';

export default function PaymentSuccessPage() {
  const search = useSearch();
  const language = useSiteLanguage();
  const fr = language === 'fr';
  const [outcome, setOutcome] = useState<ReturnType<typeof paymentOutcome>>('unknown');
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    let active = true;
    setChecking(true); setOutcome('unknown');
    const secret = new URLSearchParams(search).get('payment_intent_client_secret');
    (async () => {
      try {
        const stripe = await stripePromise;
        if (stripe && secret) {
          const result = await stripe.retrievePaymentIntent(secret);
          if (active) setOutcome(paymentOutcome(result.paymentIntent?.status));
        }
      } catch { /* Keep the honest unknown state if status cannot be checked. */ }
      finally { if (active) setChecking(false); }
    })();
    return () => { active = false; };
  }, [search]);
  const title = checking ? (fr ? 'Vérification du paiement…' : 'Checking your payment…')
    : outcome === 'success' ? (fr ? 'Paiement confirmé' : 'Payment confirmed')
    : outcome === 'pending' ? (fr ? 'Paiement en cours' : 'Payment processing')
    : outcome === 'retry' ? (fr ? 'Le paiement n’a pas abouti' : 'Payment was not completed')
    : (fr ? 'Consultez votre boîte mail' : 'Check your email');
  return <div lang={language} className="min-h-screen pt-32 pb-20 px-4 bg-background">
    <SEO title={`${title} | Green Elephant`} description={fr ? 'Les prochaines étapes de votre achat.' : 'Next steps for your purchase.'} noIndex />
    <section className="max-w-xl mx-auto space-y-6" aria-live="polite">
      <h1 className="text-3xl font-bold">{title}</h1>
      {!checking && <p>{outcome === 'unknown'
        ? (fr ? 'Cette page ne permet pas de confirmer votre achat. Si votre commande ou votre bon a été accepté, le message de confirmation vous indiquera la suite. Contactez-nous si vous ne le trouvez pas.' : 'This page cannot confirm your purchase. If your order or voucher was accepted, your confirmation message will explain the next steps. Contact us if you cannot find it.')
        : outcome === 'pending' ? (fr ? 'Attendez la confirmation avant de réessayer. Certains moyens de paiement prennent plus de temps.' : 'Wait for confirmation before trying again. Some payment methods take longer.')
        : outcome === 'retry' ? (fr ? 'Vous pouvez revenir à votre commande pour réessayer.' : 'You can return to your order to try again.')
        : (fr ? 'Merci. Consultez votre boîte mail pour le reçu et les prochaines étapes. Pensez aussi au dossier des courriers indésirables.' : 'Thank you. Check your email for the receipt and next steps, including your spam folder.')}</p>}
      {outcome === 'retry' && <Link href={new URLSearchParams(search).get('product') === 'satellitescan' ? scanCheckoutUrl(language) : '/checkout'} className="block underline">{fr ? 'Revenir à la commande' : 'Return to checkout'}</Link>}
      <p>{fr ? 'Besoin d’aide ?' : 'Need help?'} <a className="underline" href="mailto:esteve@greenelephant.org">esteve@greenelephant.org</a></p>
      <Link href={fr ? "/fr/scan" : "/scan"} className="block underline">{fr ? 'Retour au Satellite Scan' : 'Back to Satellite Scan'}</Link>
    </section>
  </div>;
}
