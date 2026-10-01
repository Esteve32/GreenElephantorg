import { SEO } from '@/components/SEO';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { pageMetadata } from '@shared/page-metadata';
import content from '@shared/homepage-content.json';
import './homepage.css';
export default function HomePage() {
  const language = useSiteLanguage();
  return <><SEO {...pageMetadata(language === 'fr' ? '/fr' : '/')} />
    <div lang={language} className="ge-site"><div className="home-content" dangerouslySetInnerHTML={{ __html: content[language].main }} /></div>
  </>;
}
