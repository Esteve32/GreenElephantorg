// Green Elephant · AI-LIT: public search content and privacy boundaries.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { renderPageMetadata } from './public-http';
import { COACHING_PAGES, coachingPath, BEGINNER_FAQ } from '../shared/coaching-pages';
import { LEARNING_PAGES } from '../shared/learning-pages';
import { RESOURCE_VIDEOS } from '../shared/resource-videos';
import { pageMetadata, SITE_ORIGIN, isRegisteredPage } from '../shared/page-metadata';
import { discoverySchema } from '../shared/search-discovery';

const template = readFileSync('client/index.html', 'utf8');
function schemas(html: string) {
  return [...html.matchAll(/<script type="application\/ld\+json" id="([^"]+)">([^<]+)<\/script>/g)]
    .map(m => ({ id: m[1], data: JSON.parse(m[2]) }));
}
const escape = (s: string) => s.replaceAll('&', '&amp;').replaceAll('’', '’').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

test('all five AI coaching pages expose factual service data, FAQs and their actual image before JavaScript', () => {
  for (const page of COACHING_PAGES) {
    const route = coachingPath(page.slug), html = renderPageMetadata(template, route);
    const blocks = schemas(html);
    assert.equal(new Set(blocks.map(b => b.id)).size, blocks.length, route);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    const service = blocks.find(b => b.id === 'page-structured-data')!.data['@graph'].find((n: any) => n['@type'] === 'Service');
    assert.equal(service.url, SITE_ORIGIN + route);
    assert.equal(service.description, page.description);
    assert.equal(service.image, SITE_ORIGIN + page.image);
    assert.ok(html.includes(`property="og:image" content="${service.image}"`));
    assert.ok(html.includes('AI literacy training · Personal coaching'));
    assert.match(html, /srcset="[^"]+640w[^"]+1280w/);
    for (const size of [640, 1280]) assert.ok(existsSync(`client/public/images/coaching/${page.slug}-hero-${size}.jpg`), 'Responsive variant must exist');
    assert.equal(service.offers, undefined, 'No invented coaching fee');
    const faq = blocks.find(b => b.id === 'faq-structured-data')!.data;
    for (const item of [...page.faq, BEGINNER_FAQ]) {
      assert.ok(html.includes(escape(item.question)), route + ' visible question');
      assert.ok(html.includes(escape(item.answer)), route + ' visible answer');
      assert.ok(faq.mainEntity.some((q: any) => q.name === item.question && q.acceptedAnswer.text === item.answer));
    }
  }
});

test('both learning pages have useful initial content, real training links and matching visible FAQs', () => {
  for (const [route, copy] of Object.entries(LEARNING_PAGES)) {
    const html = renderPageMetadata(template, route), blocks = schemas(html);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.ok(html.includes(escape(copy.heading)));
    assert.ok(html.includes(escape(copy.intro)));
    assert.match(html, /href="\/#training"/);
    assert.match(html, /href="\/blog\/acx-levels-ai-literacy"/);
    assert.doesNotMatch(html, /Your Scan is Complete|Congratulations, Explorer|This proves the model/);
    const faq = blocks.find(b => b.id === 'faq-structured-data')!.data;
    for (const item of copy.faq) {
      assert.ok(html.includes(escape(item.answer)));
      assert.ok(faq.mainEntity.some((q: any) => q.acceptedAnswer.text === item.answer));
    }
    for (const match of html.matchAll(/<a[^>]*href="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) assert.ok(isRegisteredPage(match[1]), match[1]);
  }
});

test('YouTube discovery uses all 23 existing video IDs without inventing video dates or structured data', () => {
  const html = renderPageMetadata(template, '/resources');
  const videos = [...RESOURCE_VIDEOS.understandingYourDataVideos, ...RESOURCE_VIDEOS.scienceOfCommunicationVideos];
  assert.equal(videos.length, 23);
  for (const video of videos) {
    assert.match(video.youtubeId, /^[A-Za-z0-9_-]{11}$/);
    assert.ok(html.includes(`https://www.youtube.com/watch?v=${video.youtubeId}`));
    assert.ok(html.includes(escape(video.title)));
  }
  assert.doesNotMatch(JSON.stringify(schemas(html)), /VideoObject|uploadDate|interactionCount/);
});

test('English and French training pages describe their own language and retain only real alternates', () => {
  for (const route of ['/', '/fr']) {
    const html = renderPageMetadata(template, route);
    const schema = schemas(html).find(b => b.id === 'page-structured-data')!.data;
    const page = schema['@graph'].find((n: any) => n['@type'] === 'WebPage');
    assert.equal(page.inLanguage, route === '/fr' ? 'fr' : 'en');
    assert.equal(page.url, SITE_ORIGIN + route);
    assert.equal(page.description, pageMetadata(route).description);
    assert.match(html, /hreflang="fr"/);
    assert.ok(html.includes(`property="og:locale" content="${route === '/fr' ? 'fr_FR' : 'en_US'}"`));
  }
  for (const route of ['/resources', '/decode', '/ai-coaching/everyday-confidence']) {
    assert.doesNotMatch(renderPageMetadata(template, route), /hreflang="fr"/);
    assert.equal(pageMetadata('/fr' + route).noIndex, true);
  }
});

test('private, unknown and paused destinations receive no training discovery schema', () => {
  for (const route of ['/portal/login', '/admin/login', '/checkout', '/fr/checkout', '/webinars', '/fr/decode', '/not-a-page']) {
    assert.equal(discoverySchema(route), undefined, route);
    assert.doesNotMatch(renderPageMetadata(template, route), /id="(?:page|faq|breadcrumb|org)-structured-data"/);
  }
  assert.equal(renderPageMetadata(template, '/myfive'), template);
});
