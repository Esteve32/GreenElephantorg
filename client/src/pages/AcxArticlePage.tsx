import { useSiteLanguage } from '@/hooks/use-site-language';
import { ACX_ARTICLE_FR_HTML } from '@shared/acx-article-fr';
import { articleLinks } from '@shared/site-language';
import { pageMetadata } from '@shared/page-metadata';
import { SEO } from "@/components/SEO";
import { ACX_ARTICLE, ACX_ARTICLE_HTML, ACX_ARTICLE_SCHEMA } from "@shared/acx-article";
import { PAGE_METADATA } from "@shared/page-metadata";
import "./acx-article.css";

export default function AcxArticlePage() {
  const language = useSiteLanguage();
  const metadata = pageMetadata(`${language === "fr" ? "/fr" : ""}${ACX_ARTICLE.path}`);
  const url = `https://greenelephant.org${metadata.canonicalPath}`;
  const schema = { ...ACX_ARTICLE_SCHEMA, headline: metadata.title, description: metadata.description, inLanguage: language, url, mainEntityOfPage: url };
  return <>
    <SEO {...pageMetadata(`${language === "fr" ? "/fr" : ""}${ACX_ARTICLE.path}`)} structuredData={schema} />
    {/* This is repository-authored static HTML, never user input. */}
    <article className="acx-article" dangerouslySetInnerHTML={{ __html: articleLinks(language === "fr" ? ACX_ARTICLE_FR_HTML : ACX_ARTICLE_HTML, language) }} />
  </>;
}
