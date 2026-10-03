import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { COACHING_PAGES, coachingPath, renderCoachingPage, DISCOVERY_URL, escapeCopy } from './coaching-pages';
import { renderScanPage, scanPageCopy } from './scan-page';
import { renderPageMetadata, pageStatus } from '../server/public-http';
import { pageMetadata, isRegisteredPage } from './page-metadata';
import { hasFrenchPage } from './site-language';
import homepage from './homepage-content.json';
import testimonials from './scan-testimonials.json';
import { restoredScan } from './scan-restored';

const template = readFileSync('client/index.html', 'utf8');

test('five distinct coaching pages have complete authored content and initial HTML', () => {
  assert.equal(COACHING_PAGES.length, 5);
  assert.equal(new Set(COACHING_PAGES.map(page=>page.title)).size, 5);
  for (const page of COACHING_PAGES) {
    const path = coachingPath(page.slug);
    assert.equal(page.practice.length, 3);
    assert.equal(page.faq.length, 2);
    const content = renderCoachingPage(page);
    assert.equal((content.match(/<h1>/g)||[]).length, 1);
    assert.equal((content.match(/<details>/g)||[]).length, 3);
    assert.equal((content.match(new RegExp(DISCOVERY_URL, 'g'))||[]).length, 2);
    assert.match(content, /1–5 people/);
    assert.match(content, /Four days\. Part-time/);
    assert.doesNotMatch(content, /€2,400|€2400|guaranteed|<form/);
    for (const suffix of ['', '/']) {
      const html = renderPageMetadata(template, path+suffix);
      assert.equal(pageStatus(path+suffix), 200);
      assert.ok(html.includes(`<h1>${escapeCopy(page.headline)}</h1>`));
      assert.ok(html.includes(escapeCopy(page.description)));
      assert.ok(html.includes(`rel="canonical" href="https://greenelephant.org${path}"`));
      assert.doesNotMatch(html, /hreflang="fr"/);
    }
    assert.equal(hasFrenchPage(path), false);
    assert.equal(isRegisteredPage('/fr'+path), false);
    assert.equal(pageMetadata(path).title, page.title);
  }
});

test('homepages retain Maeva once, before the approach, and keep coaching links English-first', () => {
  for (const language of ['en','fr'] as const) {
    const html = homepage[language].main;
    assert.equal((html.match(/<article class="testimonial"/g)||[]).length, 1);
    assert.ok(html.indexOf('id="training"') < html.indexOf('<article class="testimonial"'));
    assert.ok(html.indexOf('<article class="testimonial"') < html.indexOf('id="approach"'));
    assert.match(html, /maeva-portrait.png/);
    assert.match(html, /id="about"/);
  }
  assert.match(homepage.en.main, /Although I had felt apprehensive about artificial intelligence, this understanding now helps me work with greater independence, efficiency and mental clarity\./);
  assert.match(homepage.en.main, /For independent professionals, coaches and facilitators\./);
  assert.match(homepage.fr.main, /Pour les professionnels indépendants, les coachs et les facilitateurs\./);
  for (const page of COACHING_PAGES) assert.ok(homepage.en.main.includes(coachingPath(page.slug)));
  assert.doesNotMatch(homepage.fr.main, /ai-coaching\//);
});

test('Scan languages share sections, included materials, and unboxed notices directly after both CTAs', () => {
  const sectionCounts: number[] = [];
  for (const language of ['en','fr'] as const) {
    const html = renderScanPage(language), c = scanPageCopy[language];
    sectionCounts.push((html.match(/<section\b/g)||[]).length);
    assert.equal((html.match(/<h1>/g)||[]).length, 1);
    assert.equal((html.match(/scan-language-notice/g)||[]).length, 2);
    assert.ok(html.includes(`</a><p class="ge-note scan-language-notice">${escapeCopy(c.notice)}</p>`));
    assert.match(html, /48[– ]/);
    assert.doesNotMatch(html, /<video|<iframe|mockup|walkthrough|scan-language-notice[^>]*>.*<aside/);
    assert.equal((html.match(/class="ge-acx-link"/g)||[]).length, 4);
    assert.equal((html.match(/<figure>/g)||[]).length, 8);
    assert.match(html, /href="\/terms"/);
    assert.match(html, /href="\/privacy"/);
    assert.match(html, new RegExp(`href="${language==='fr'?'/fr':''}/checkout\\?product=satellitescan&amp;lang=${language}"`));
    const path = language === 'fr' ? '/fr/scan' : '/scan';
    for (const suffix of ['', '/']) assert.ok(renderPageMetadata(template, path+suffix).includes(html));
  }
  assert.equal(sectionCounts[0], sectionCounts[1]);
  assert.doesNotMatch(renderScanPage('en'), /Acheter|Questionnaire et guides|Parlons/);
  assert.doesNotMatch(renderScanPage('fr'), /Get your|Your questions|Discuss your|What is included/);
});

test('existing Scan testimonials and refund promise remain intact in English', () => {
  const html = renderScanPage('en');
  for (const item of testimonials) {
    assert.ok(html.includes(escapeCopy(item.quote)));
    assert.ok(html.includes(escapeCopy(item.name)));
  }
  assert.match(html, /contact us within 14 days for a full refund\. No questions asked\./);
  assert.match(renderScanPage('fr'), /Traductions des témoignages en anglais/);
});

test('authored internal links and assets exist; no invented French destinations', () => {
  const pages = [...COACHING_PAGES.map(renderCoachingPage), renderScanPage('en'),renderScanPage('fr')];
  for (const html of pages) {
    for (const [, href] of html.matchAll(/href="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) assert.ok(isRegisteredPage(href), href);
    for (const [, src] of html.matchAll(/src="(\/[^"]+)"/g)) assert.ok(existsSync('client/public'+src), src);
  }
  for (const page of COACHING_PAGES) assert.ok(readFileSync('client/public/sitemap.xml','utf8').includes(coachingPath(page.slug)));
});

test('styles reuse the brand fonts and contain narrow-screen layouts and explicit CTA breathing room', () => {
  const base = readFileSync('client/src/pages/homepage.css','utf8');
  const css = readFileSync('client/src/pages/landing-pages.css','utf8');
  assert.match(base, /--sans:'Lato'/);
  assert.match(base, /--heading:'Poppins'/);
  assert.match(css, /ge-cta-group[^}]+gap: 18px; margin: 36px 0/);
  assert.match(css, /min-height: 54px/);
  assert.match(css, /@media \(max-width: 700px\)/);
  assert.match(css, /scan-earth-original.png/);
  assert.doesNotMatch(css, /animation:|scroll-behavior:\s*smooth/);
});

test('rendered copy escapes markup', () => {
  assert.equal(escapeCopy('<script>"&'), '&lt;script&gt;&quot;&amp;');
});

test('restored Scan retains full topic coverage and bilingual parity without old unsafe claims',()=>{
  for (const language of ['en','fr'] as const) {
    const content=restoredScan[language],html=renderScanPage(language);
    assert.equal(content.PERSONAS.length,9);assert.equal(content.PAIN_SIGNALS.length,8);
    assert.equal(content.FAQ_ITEMS.length,28);assert.equal(content.STEPS.length,4);
    for(const [key,benefits] of Object.entries(content.LENS_BENEFITS)) {
      assert.equal(benefits.length,3);assert.match(html,new RegExp(`data-testid="lens-${key}"`));
      for(const item of benefits)assert.ok(html.includes(escapeCopy(item.insight)));
    }
    for(const item of content.FAQ_ITEMS)assert.ok(html.includes(escapeCopy(item.answer)));
    for(const id of ['scan-more','before-after','signals','what-is-it','comparison','benefits','lenses','repeatable-reflection','scan-testimonials','how-it-works'])assert.ok(html.includes(`id="${id}"`));
  }
  assert.deepEqual(restoredScan.en.FAQ_ITEMS.map(x=>x.id),restoredScan.fr.FAQ_ITEMS.map(x=>x.id));
  assert.doesNotMatch(renderScanPage('en'),/never shared with third parties|growth is measurable|exact balance of difficulty|<table/);
  const css=readFileSync('client/src/pages/landing-pages.css','utf8');
  assert.match(css,/\.ge-site \.ge-scan \.ge-band \{ background: radial-gradient\(ellipse 50% 50% at center[^}]+transparent 100%\)/);
  assert.match(css,/mask-image: radial-gradient\(ellipse 50% 50% at center, #000 25%, transparent 100%\)/);
});

test('fallback homepage title and descriptions match current route metadata',()=>{
  const metadata=pageMetadata('/');
  assert.ok(template.includes(`<title>${metadata.title}</title>`));
  for(const name of ['description','og:description','twitter:description']) {
    assert.ok(template.includes(`${name}" content="${metadata.description}"`));
  }
  assert.doesNotMatch(template,/Communication Coaching for Self-Awareness &amp; Career Growth|Communication Coaching for Self-Awareness & Career Growth/);
});
