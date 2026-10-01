import { useLocation, useSearch } from 'wouter';
import { GraduationCap, Compass, Users, ArrowUpRight } from 'lucide-react';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { localPage, hasFrenchPage } from '@shared/site-language';
import '@/pages/homepage.css';
export default function Header() {
  const language = useSiteLanguage(), fr = language === 'fr';
  const [path] = useLocation(); const search = useSearch();
  const home = localPage('/', language);
  const other = fr ? 'en' : 'fr';
  const params = new URLSearchParams(search); params.delete('lang');
  const switched = localPage(hasFrenchPage(path) ? path : '/', other) + (params.size ? '?' + params : '');
  return <div className="ge-site"><div className="top"><header className="wrap header">
    <a href={home} className="brand" aria-label={fr ? 'Green Elephant — accueil' : 'Green Elephant home'}><img src="/images/website/logo.png" width="46" height="46" alt="" />Green Elephant</a>
    <nav className="nav" aria-label={fr ? 'Navigation principale' : 'Main navigation'}>
      <a href={switched} lang={other} hrefLang={other}>{fr ? 'English' : 'Français'}</a>
      <a href={home+'#training'}><GraduationCap className="nav-icon" aria-hidden="true" />{fr ? 'Formation IA' : 'AI Literacy Training'}</a>
      <a href={home+'#approach'}><Compass className="nav-icon" aria-hidden="true" />{fr ? 'Notre approche' : 'Our Approach'}</a>
      <a href={home+'#about'}><Users className="nav-icon" aria-hidden="true" />{fr ? 'À propos' : 'About'}</a>
      <a className="button small" href="https://calendly.com/greenelephant/free-ai-literacy-discovery-call" target="_blank" rel="noopener noreferrer">{fr ? 'Parlons de vos besoins' : 'Discuss your training needs'}<ArrowUpRight size={16} aria-hidden="true" /></a>
    </nav></header></div></div>;
}
