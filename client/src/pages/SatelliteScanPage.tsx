import { SEO } from '@/components/SEO';
import { ScanOptions } from '@/components/ScanOptions';
import { pageMetadata } from '@shared/page-metadata';
import { scanPageCopy, renderScanPage } from '@shared/scan-page';
import type { SiteLanguage } from '@shared/site-language';
import './homepage.css';
import './landing-pages.css';

export default function SatelliteScanPage({ language }: { language: SiteLanguage }) {
  return <><SEO {...pageMetadata(language === 'fr' ? '/fr/scan' : '/scan')} faqItems={scanPageCopy[language].faq} />
    <div className="ge-site" lang={language}>
      <div dangerouslySetInnerHTML={{ __html: renderScanPage(language) }} />
      <ScanOptions key={language} language={language} />
    </div>
  </>;
}
