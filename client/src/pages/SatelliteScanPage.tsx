import { SEO } from '@/components/SEO';
import { ScanOptions } from '@/components/ScanOptions';
import { pageMetadata } from '@shared/page-metadata';
import { scanPageCopy, renderScanPage } from '@shared/scan-page';
import { restoredScan } from '@shared/scan-restored';
import type { SiteLanguage } from '@shared/site-language';
import './homepage.css';
import './landing-pages.css';

export default function SatelliteScanPage({ language }: { language: SiteLanguage }) {
  return <><SEO {...pageMetadata(language === 'fr' ? '/fr/scan' : '/scan')} faqItems={[...restoredScan[language].FAQ_ITEMS, ...scanPageCopy[language].faq.filter((_,i)=>i===0||i===2)]} />
    <div className="ge-site" lang={language}>
      <div dangerouslySetInnerHTML={{ __html: renderScanPage(language) }} />
      <ScanOptions key={language} language={language} />
    </div>
  </>;
}
