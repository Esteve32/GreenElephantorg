import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { browserMarketingTracker, chooseAnalytics } from '@/lib/marketing-tracker';
import { basePagePath, localPage } from '@shared/site-language';
import { marketingPath } from '@shared/marketing-analytics';
import './analytics-consent.css';

export function AnalyticsConsent() {
  const [path] = useLocation();
  const [open,setOpen] = useState(false);
  const [chosen,setChosen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const fr = path === '/fr' || path.startsWith('/fr/');
  const base = basePagePath(path).replace(/\/+$/, '') || '/';
  const visible = !!marketingPath(path) || base === '/cookies' || base === '/privacy';
  useEffect(()=>{
    const refresh = () => {
      const choice = browserMarketingTracker().choice();
      setChosen(!!choice); if(!choice) setOpen(true);
    };
    const show = () => { setOpen(true); requestAnimationFrame(()=>heading.current?.focus()); };
    refresh();
    window.addEventListener('ge:consent-changed',refresh);
    window.addEventListener('ge:cookie-preferences',show);
    return ()=>{window.removeEventListener('ge:consent-changed',refresh);window.removeEventListener('ge:cookie-preferences',show);};
  },[]);
  if (!visible) return null;
  const choose = (value: 'accepted'|'rejected') => {
    void chooseAnalytics(value); setChosen(true); setOpen(false); button.current?.focus();
  };
  return <div className="ge-consent" lang={fr?'fr':'en'}>
    <div className="ge-cookie-settings"><button ref={button} type="button" onClick={()=>{setOpen(true);requestAnimationFrame(()=>heading.current?.focus());}}>{fr?'Choix des cookies':'Cookie choices'}</button></div>
    {open && <section className="ge-cookie-banner" role="region" aria-labelledby="cookie-choice-title" data-testid="analytics-consent">
      <div><h2 id="cookie-choice-title" ref={heading} tabIndex={-1}>{fr?'Votre choix pour les cookies':'Your cookie choice'}</h2>
        <p>{fr?'Avec votre accord, Google Analytics nous aide à comparer les visites et les clics vers un achat ou une prise de contact sur nos pages publiques. Refuser ne change pas votre accès au site. Aucun suivi publicitaire.':'With your permission, Google Analytics helps us compare visits and purchase or enquiry-link clicks on our public landing pages. Rejecting does not change your access to the site. No advertising tracking.'}</p>
        <p>{fr?'Choix conservé sur cet appareil pendant 180 jours. Vous pouvez le modifier ici à tout moment.':'Choice saved on this device for 180 days. You can change it here at any time.'} <a href={localPage('/cookies',fr?'fr':'en')}>{fr?'Détails sur les cookies':'Cookie details'}</a></p>
      </div>
      <div className="ge-cookie-actions">
        <button type="button" onClick={()=>choose('rejected')} data-testid="reject-analytics">{fr?'Refuser':'Reject'}</button>
        <button type="button" onClick={()=>choose('accepted')} data-testid="accept-analytics">{fr?'Accepter les statistiques':'Accept analytics'}</button>
        {chosen && <button type="button" className="ge-cookie-close" onClick={()=>{setOpen(false);button.current?.focus();}}>{fr?'Fermer sans modifier':'Close without changing'}</button>}
      </div>
    </section>}
  </div>;
}
