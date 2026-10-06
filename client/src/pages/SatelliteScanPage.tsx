import { Fragment, useEffect, useRef } from 'react';
import { RecoveredScanBenefits, RecoveredScanLenses } from '@/components/RecoveredScanSections';
import { SEO } from '@/components/SEO';
import { ScanOptions } from '@/components/ScanOptions';
import { pageMetadata } from '@shared/page-metadata';
import { scanPageCopy, renderScanPageBody } from '@shared/scan-page';
import { restoredScan } from '@shared/scan-restored';
import type { SiteLanguage } from '@shared/site-language';
import './homepage.css';
import './landing-pages.css';

export default function SatelliteScanPage({ language }: { language: SiteLanguage }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const marker = root.current?.querySelector<HTMLElement>('.scan-elevator span');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const extent = document.documentElement.scrollHeight - innerHeight;
      const progress = extent > 0 ? Math.min(1, Math.max(0, scrollY / extent)) : 0;
      if (marker) marker.style.transform = `translateY(${motion.matches ? 0 : progress * (innerHeight - 180)}px)`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule); motion.addEventListener('change', schedule); update();
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll', schedule); removeEventListener('resize', schedule); motion.removeEventListener('change', schedule); };
  }, [language]);
  // Replace only the two recovered interactive sections; all other authored HTML
  // and the server-rendered fallback stay sourced from the same bilingual copy.
  const parts = renderScanPageBody(language).split(/<!--scan-widget:(benefits|lenses)-->[\s\S]*?<!--\/scan-widget-->/);
  return <><SEO {...pageMetadata(language === 'fr' ? '/fr/scan' : '/scan')} faqItems={[...restoredScan[language].FAQ_ITEMS, ...scanPageCopy[language].faq.filter((_,i)=>i===0||i===2)]} />
    <div ref={root} className="ge-site" lang={language}>
      <article className="ge-landing ge-scan" data-testid="page-scan">
        {parts.map((part,index)=><Fragment key={`${language}-${index}`}>
          {index % 2 === 0 ? <div className="ge-scan-fragment" dangerouslySetInnerHTML={{__html:part}} />
            : part === 'benefits' ? <RecoveredScanBenefits language={language} /> : <RecoveredScanLenses language={language} />}
        </Fragment>)}
      </article>
      <ScanOptions key={language} language={language} />
    </div>
  </>;
}
