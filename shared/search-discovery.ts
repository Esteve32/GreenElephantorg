// Green Elephant · AI-LIT: factual search descriptions shared by HTTP and React.
import { COACHING_PAGES, coachingPage, coachingPath, BEGINNER_FAQ } from './coaching-pages';
import { SITE_ORIGIN, pageMetadata } from './page-metadata';
import { learningPage } from './learning-pages';
import { basePagePath, siteLanguage } from './site-language';

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org', '@type': 'Organization',
  '@id': SITE_ORIGIN + '/#organization', name: 'Green Elephant', alternateName: 'GreenElephant',
  url: SITE_ORIGIN + '/', logo: SITE_ORIGIN + '/ge-logo-512.png',
  description: 'Human-centred AI literacy training and communication coaching. Learn through practical tasks while keeping your judgement and voice.',
  email: 'esteve@greenelephant.org',
  knowsAbout: ['AI literacy', 'Human judgement', 'Conscious communication', 'AI prompting', 'Checking AI outputs', 'ACX teaching framework'],
  sameAs: ['https://www.linkedin.com/company/greenelephant-org', 'https://www.youtube.com/@greenelephantorg'],
  founder: { '@type': 'Person', name: 'Estève Pannetier' },
};

export function discoveryBreadcrumbs(pathname: string) {
  const m = pageMetadata(pathname);
  const page = coachingPage(pathname);
  const learning = learningPage(m.canonicalPath ?? pathname);
  if (!page && !learning) return undefined;
  return [{ name: 'AI literacy training', url: '/' }, { name: page?.label ?? learning!.heading, url: m.canonicalPath! }];
}

export function discoveryFaq(pathname: string) {
  const page = coachingPage(pathname);
  return page ? [...page.faq, BEGINNER_FAQ] : learningPage(pageMetadata(pathname).canonicalPath ?? pathname)?.faq;
}

export function discoverySchema(pathname: string): object | undefined {
  const m = pageMetadata(pathname);
  const canonical = m.canonicalPath;
  if (!canonical || m.noIndex) return undefined;
  const base = basePagePath(canonical);
  const page = coachingPage(canonical);
  const learning = learningPage(canonical);
  if (base !== '/' && !page && !learning) return undefined;
  const fr = siteLanguage(canonical) === 'fr';
  const url = SITE_ORIGIN + canonical;
  const provider = { '@id': ORGANIZATION_SCHEMA['@id'] };
  const graph: Record<string, unknown>[] = [{
    '@type': 'WebPage', '@id': url + '#webpage', url,
    name: m.title, description: m.description, inLanguage: fr ? 'fr' : 'en',
    isPartOf: { '@id': SITE_ORIGIN + '/#website' }, publisher: provider,
    about: { '@type': 'Thing', name: fr ? 'Formation à l’IA centrée sur l’humain' : 'Human-centred AI literacy' },
  }];
  if (base === '/') {
    graph.push({ '@type': 'WebSite', '@id': SITE_ORIGIN + '/#website', url: SITE_ORIGIN + '/', name: 'Green Elephant', publisher: provider, inLanguage: ['en', 'fr'] });
    graph.push({ '@type': 'Service', '@id': url + '#ai-literacy-training', url: url + '#training',
      name: fr ? 'Atelier découverte et parcours pratique de l’IA' : 'AI literacy discovery workshop and coaching journey',
      serviceType: fr ? 'Formation à l’IA' : 'AI literacy training', provider,
      description: fr ? 'Un atelier de 3,5 heures pour 6–12 personnes (16 maximum), ou un parcours pratique de quatre jours à temps partiel pour 1–5 personnes. Discutez du projet et des modalités avant de réserver.' : 'A 3.5-hour discovery workshop for 6–12 people (16 maximum), or a four-day part-time coaching journey for 1–5 people. Discuss the project and delivery details before booking.',
      hasOfferCatalog: { '@type': 'OfferCatalog', name: fr ? 'Parcours pratiques' : 'Practical coaching journeys', itemListElement: COACHING_PAGES.map(p => ({ '@type': 'Service', name: p.label, url: SITE_ORIGIN + coachingPath(p.slug), provider })) },
    });
  }
  if (page) graph.push({
    '@type': 'Service', '@id': url + '#ai-coaching', url,
    name: page.title.replace(/ \| GreenElephant$/, ''), serviceType: 'Human-centred AI literacy coaching',
    description: page.description, provider, image: SITE_ORIGIN + page.image,
    audience: { '@type': 'Audience', audienceType: page.audience },
  });
  return { '@context': 'https://schema.org', '@graph': graph };
}
