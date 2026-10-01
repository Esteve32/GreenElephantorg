import { SEO } from '@/components/SEO';
import { pageMetadata } from '@shared/page-metadata';
import content from '@shared/scan-page-fr.json';
import './scan-fr.css';
export default function FrenchScanPage() {
  return <><SEO {...pageMetadata('/fr/scan')} /><div lang="fr" className="ge-scan-fr"><div className="scan-elevator" aria-hidden="true"><span /></div><div className="scan-content" dangerouslySetInnerHTML={{ __html: content.html }} /></div></>;
}
