import { pageMetadata } from '@shared/page-metadata';
import { localPage } from '@shared/site-language';
import { POLICY_PAGES, renderPolicyPage, type PolicyPath } from '@shared/policy-pages';
import { SEO } from '@/components/SEO';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { openCookiePreferences } from '@/lib/marketing-tracker';
import '@/pages/policy-pages.css';

export default function PolicyPage({ path }: { path: PolicyPath }) {
  const language = useSiteLanguage();
  const canonicalPath = localPage(path, language);
  return <>
    <SEO {...pageMetadata(canonicalPath)} breadcrumbs={[
      { name: language === 'fr' ? 'Accueil' : 'Home', url: localPage('/', language) },
      { name: POLICY_PAGES[language][path].title, url: canonicalPath },
    ]} />
    <div onClick={event => {
      if (event.target instanceof Element && event.target.closest('[data-cookie-preferences]')) openCookiePreferences();
    }} dangerouslySetInnerHTML={{ __html: renderPolicyPage(path, language) }} />
  </>;
}
