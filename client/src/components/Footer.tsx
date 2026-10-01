import content from '@shared/homepage-content.json';
import { useSiteLanguage } from '@/hooks/use-site-language';
import '@/pages/homepage.css';
export default function Footer() {
  const language = useSiteLanguage();
  return <div lang={language} className="ge-site" dangerouslySetInnerHTML={{ __html: content[language].footer }} />;
}
