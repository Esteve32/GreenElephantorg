import { SEO } from '@/components/SEO';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { pageMetadata } from '@shared/page-metadata';
import { homepage as content } from '@shared/homepage-rendered';
import './homepage.css';
import './landing-pages.css';
import { useRef } from 'react';
import { useHomepageCarousel } from '@/hooks/use-homepage-carousel';
export default function HomePage() {
  const language = useSiteLanguage();
  const root = useRef<HTMLDivElement>(null);
  useHomepageCarousel(root, language);
  return <><SEO {...pageMetadata(language === 'fr' ? '/fr' : '/')} />
    <div lang={language} className="ge-site"><div ref={root} className="home-content" dangerouslySetInnerHTML={{ __html: content[language].main }} /></div>
  </>;
}
