import { homepage as content } from '@shared/homepage-rendered';
import { useSiteLanguage } from '@/hooks/use-site-language';
import '@/pages/homepage.css';
export default function Footer() {
  const language = useSiteLanguage();
  return <div lang={language} className="ge-site" dangerouslySetInnerHTML={{ __html: content[language].footer }} />;
}
