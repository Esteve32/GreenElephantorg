import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { COACHING_PAGES, coachingPath, renderCoachingPage, DISCOVERY_URL, escapeCopy } from './coaching-pages';
import { scanLiteracy } from './scan-literacy';
import { renderScanPage, scanPageCopy } from './scan-page';
import { renderPageMetadata, pageStatus } from '../server/public-http';
import { pageMetadata, isRegisteredPage } from './page-metadata';
import { localPage, hasFrenchPage } from './site-language';
import { homepage, HOMEPAGE_ACX, HOMEPAGE_HERO, HOMEPAGE_METHOD, HOMEPAGE_PATHS, HOMEPAGE_PEOPLE } from './homepage-rendered';
import testimonials from './scan-testimonials.json';
import { restoredScan } from './scan-restored';
import homepageSource from './homepage-content.json';
import { ACX_ARTICLE_HTML } from './acx-article';
import { ACX_ARTICLE_FR_HTML } from './acx-article-fr';

test('bilingual ACX guide puts practical levels first and retains original drawings and source context', () => {
  for (const html of [ACX_ARTICLE_HTML, ACX_ARTICLE_FR_HTML]) {
    assert.equal((html.match(/class="acx-level-section"/g) || []).length, 4);
    assert.equal((html.match(/class="acx-sketch"/g) || []).length, 4);
    assert.match(html, /class="acx-hero-drawing"[^>]*acx-4-background-800.jpg/);
    assert.ok(html.indexOf('id="acx-4"') < html.indexOf('id="acx-human-skills"'));
    assert.doesNotMatch(html, /<table/);
    for (const level of [1, 2, 3, 4]) {
      assert.ok(html.includes(`/images/acx/acx-${level}-original.png`));
      assert.ok(html.includes(`/images/acx/acx-${level}-outline.svg`));
    }
    for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${anchor}"`), anchor);
    assert.match(html, /AI governance/);
    assert.match(html, /https:\/\/www.arbora.partners\/research/);
  }
  assert.match(ACX_ARTICLE_HTML, /without permission/);
  assert.match(ACX_ARTICLE_FR_HTML, /sans permission/);
});

test('both footers expose five coaching paths and preserve every existing destination', () => {
  for (const language of ['en', 'fr'] as const) {
    const html = homepage[language].footer;
    const before = [...homepageSource[language].footer.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
    const after = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
    for (const href of before) assert.ok(after.includes(localPage(href, language)), `Retained ${language} footer link: ${href}`);
    assert.equal(after.length, before.length + 5);
    assert.equal((html.match(/class="footer-node-icon"/g) || []).length, 9);
    assert.match(html, /aria-labelledby="footer-map-title"/);
    assert.match(html, /aria-labelledby="footer-coaching-title"/);
    assert.doesNotMatch(html, /<details|\shidden(?:[\s=>])|display:\s*none/);
    for (const page of COACHING_PAGES) {
      assert.ok(after.includes(coachingPath(page.slug)));
      assert.ok(isRegisteredPage(coachingPath(page.slug)));
    }
    for (const item of HOMEPAGE_PATHS[language].items) assert.ok(html.includes(escapeCopy(item.title)));
  }
  assert.equal((homepage.fr.footer.match(/Page en anglais/g) || []).length, 5);
  assert.doesNotMatch(homepage.fr.footer, / lang="en"/);
  assert.match(homepage.fr.footer, /href="\/ai-coaching\/lifetime-archive" hreflang="en"/);
});

test('French beginner copy explains actions and preserves the Scan language and coaching limits', () => {
  assert.match(homepage.fr.main, /Relier les étapes/);
  assert.match(homepage.fr.main, /Un agent IA peut enchaîner des tâches/);
  assert.match(homepage.fr.main, /Les pages détaillées en français sont en préparation/);
  const scan = renderScanPage('fr');
  assert.match(scan, /consignes, aussi appelées prompts/);
  assert.match(scan, /normalement sous 48 à 72 heures après l’envoi du questionnaire/);
  assert.match(scan, /Questionnaire et guides vidéo actuellement en anglais/);
  assert.match(scan, /La formation et le coaching se réservent séparément/);
  assert.match(scan, /99,95 €/);
  assert.match(scan, /sous 14 jours pour un remboursement intégral/);
});

const template = readFileSync('client/index.html', 'utf8');

test('five distinct coaching pages have complete authored content and initial HTML', () => {
  assert.equal(COACHING_PAGES.length, 5);
  assert.equal(new Set(COACHING_PAGES.map(page=>page.title)).size, 5);
  for (const page of COACHING_PAGES) {
    const path = coachingPath(page.slug);
    assert.equal(page.practice.length, 3);
    assert.equal(page.faq.length, 2);
    assert.equal(page.acx.length, 4);
    const content = renderCoachingPage(page);
    for (const code of ['H2S','H2H','HAI','A2A']) assert.ok(content.includes(code));
    assert.equal((content.match(/<h1>/g)||[]).length, 1);
    assert.match(content, /class="wrap ge-hero-title"><h1>/);
    assert.ok(content.indexOf('<h1>') < content.indexOf('class="wrap ge-hero-copy"'));
    assert.match(content, /practise Chat and Workflow, try a guided Agent task/);
    assert.equal((content.match(/<details>/g)||[]).length, 3);
    assert.equal((content.match(new RegExp(DISCOVERY_URL, 'g'))||[]).length, 2);
    assert.match(content, /1–5 people/);
    assert.match(content, /Four days\. Part-time/);
    assert.match(content, /What to bring/);
    assert.match(content, /Discuss the project, schedule, delivery format and fee/);
    assert.equal((content.match(/class="ge-acx-level"/g)||[]).length, 4);
    assert.equal((content.match(/class="ge-acx-icon"/g)||[]).length, 4);
    for (const level of [1, 2, 3, 4]) assert.ok(content.includes(`/images/acx/acx-${level}-outline.svg`));
    assert.ok(content.includes(escapeCopy(page.acxHeading)));
    for (const level of page.acx) {
      assert.ok(content.includes(escapeCopy(level.action)));
      assert.ok(content.includes(escapeCopy(level.detail)));
      assert.ok(content.includes(escapeCopy(level.control)));
    }
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

test('homepages keep five starting points before the method and place Maeva after the method tools and before the three coaches', () => {
  for (const language of ['en','fr'] as const) {
    const html = homepage[language].main;
    assert.equal((html.match(/<article class="testimonial"/g)||[]).length, 1);
    assert.equal((html.match(/class="starting-path"/g)||[]).length, 5);
    assert.ok(html.indexOf('id="acx-levels"') < html.indexOf('id="coaching-paths"'));
    assert.ok(html.indexOf('id="coaching-paths"') < html.indexOf('id="approach"'));
    assert.ok(html.indexOf('id="approach"') < html.indexOf('id="about"'));
    assert.ok(html.indexOf('class="method-resource-links"') < html.indexOf('id="maeva"'));
    assert.ok(html.indexOf('<article class="testimonial"') < html.indexOf('id="about"'));
    assert.ok(html.indexOf('<article class="testimonial"') < html.indexOf('id="training"'));
    assert.ok(html.indexOf('id="training"') < html.indexOf('class="faq section"'));
    assert.match(html, /maeva-portrait.png/);
    assert.match(html, /id="about"/);
    assert.ok(html.includes(HOMEPAGE_PEOPLE[language].intro));
    assert.ok(html.includes(HOMEPAGE_PATHS[language].title));
    for (const item of HOMEPAGE_PATHS[language].items) {
      assert.ok(html.includes(item.audience));
      assert.ok(html.includes(item.text));
    }
  }
  assert.match(homepage.en.main, /Although I had felt apprehensive about artificial intelligence, this understanding now helps me work with greater independence, efficiency and mental clarity\./);
  assert.doesNotMatch(homepage.en.main, /class="wrap audience"/);
  assert.doesNotMatch(homepage.en.main, /four professionals|4 professionals/i);
  assert.doesNotMatch(homepage.fr.main, /class="wrap audience"/);
  for (const page of COACHING_PAGES) assert.ok(homepage.en.main.includes(coachingPath(page.slug)));
  for (const page of COACHING_PAGES) assert.ok(homepage.fr.main.includes(coachingPath(page.slug)));
});

test('five homepage project links preview the matching hero with lazy images in both languages', () => {
  for (const language of ['en', 'fr'] as const) {
    const html = homepage[language].main;
    const cards = [...html.matchAll(/<li class="starting-path">([\s\S]*?)<\/li>/g)];
    assert.equal(cards.length, 5);
    cards.forEach(([, card], index) => {
      const page = COACHING_PAGES[index];
      assert.ok(card.includes(`href="${coachingPath(page.slug)}"`));
      assert.ok(card.includes(`src="/images/coaching/${page.slug}-hero-640.jpg"`));
      assert.match(card, /loading="lazy" decoding="async" alt=""/);
      if (language === 'fr') {
        assert.match(card, /hreflang="en"/);
        assert.match(card, /Page en anglais/);
      }
    });
    assert.ok(html.indexOf('id="acx-levels"') < html.indexOf('id="coaching-paths"'));
    assert.ok(html.indexOf('id="coaching-paths"') < html.indexOf('id="training"'));
    const initial = renderPageMetadata(template, language === 'fr' ? '/fr' : '/');
    assert.ok(initial.indexOf('id="acx-levels"') < initial.indexOf('id="training"'));
  }
});

test('footer purpose-first labels distinguish learning, tools and other services', () => {
  for (const label of ['Explore AI training', 'Example requests for AI — Prompt Library', 'Your personal reflection — Satellite Scan', 'Interview programme details', 'Interview coaching page']) assert.ok(homepage.en.footer.includes(label));
  for (const label of ['Découvrir les formations', 'Exemples de demandes à l’IA', 'Questionnaire en anglais']) assert.ok(homepage.fr.footer.includes(label));
  assert.match(homepage.en.footer, /Explore other coaching/);
});

test('homepages render the approved beginner hero and tangible ACX path', () => {
  for (const language of ['en', 'fr'] as const) {
    const html = homepage[language].main;
    const copy = HOMEPAGE_HERO[language];
    assert.ok(html.includes(copy.eyebrow));
    assert.ok(html.includes(copy.promise));
    assert.ok(html.includes(copy.explore));
    assert.ok(html.includes(copy.stages));
    assert.match(html, /href="#acx-levels"/);
    const opening = html.slice(0, html.indexOf('id="acx-levels"'));
    assert.ok(opening.includes(copy.promise));
    assert.doesNotMatch(opening, /<details|class="wrap audience"/);
  }
  assert.doesNotMatch(homepage.en.main, /AI training built around people|Learn to use AI with confidence/);
  assert.doesNotMatch(homepage.fr.main, /Des formations à l’IA pensées pour vous|Apprenez à utiliser l’IA avec confiance/);
  assert.match(HOMEPAGE_HERO.en.promise, /^AI literacy means knowing when to use AI/);
  assert.match(HOMEPAGE_HERO.fr.promise, /^Comprendre l’IA, c’est savoir quand l’utiliser/);
});

test('homepages place four visible ACX cards directly after the hero', () => {
  for (const language of ['en', 'fr'] as const) {
    const html = homepage[language].main;
    const copy = HOMEPAGE_ACX[language];
    assert.equal((html.match(/class="acx-card"/g) || []).length, 4);
    assert.ok(html.indexOf('id="hero-title"') < html.indexOf('id="acx-levels"'));
    assert.ok(html.indexOf('id="acx-levels"') < html.indexOf('id="training"'));
    assert.doesNotMatch(html, /<details class="explain" id="acx-levels">/);
    for (const level of copy.levels) {
      assert.ok(html.includes(level.action));
      assert.ok(html.includes(level.check));
    }
    const path = language === 'fr' ? '/fr' : '/';
    assert.ok(renderPageMetadata(template, path).includes(copy.title));
  }
});

test('homepages use a compact four-action People-and-AI method with secondary tool links', () => {
  for (const language of ['en', 'fr'] as const) {
    const html = homepage[language].main;
    for (const code of ['H2S','H2H','HAI','A2A']) assert.ok(html.includes(code));
    const copy = HOMEPAGE_METHOD[language];
    assert.equal((html.match(/class="method-action-number"/g) || []).length, 4);
    assert.ok(html.includes(copy.eyebrow));
    assert.ok(html.includes(copy.title));
    assert.ok(html.includes(copy.intro));
    for (const action of copy.actions) {
      assert.ok(html.includes(action.title));
      assert.ok(html.includes(action.text));
      assert.ok(html.includes(action.example));
    }
    for (const link of copy.links) assert.match(html, new RegExp(`href="${link.path}"`));
    assert.doesNotMatch(html, /periodic-table\.png|class="connections"|class="scan-support"/);
    const path = language === 'fr' ? '/fr' : '/';
    assert.ok(renderPageMetadata(template, path).includes(copy.title));
  }
});

test('Scan languages share sections, included materials, and unboxed notices directly after both CTAs', () => {
  const sectionCounts: number[] = [];
  for (const language of ['en','fr'] as const) {
    const html = renderScanPage(language), c = scanPageCopy[language];
    sectionCounts.push((html.match(/<section\b/g)||[]).length);
    assert.equal((html.match(/<h1>/g)||[]).length, 1);
    assert.equal((html.match(/scan-language-notice/g)||[]).length, 2);
    assert.ok(html.includes(`</a><p class="scan-brand-promise">${escapeCopy(scanLiteracy[language].promise)}<span class="scan-language-notice">${escapeCopy(c.notice)}</span></p>`));
    assert.match(html, /48[– ]/);
    assert.doesNotMatch(html, /<video|<iframe|mockup|walkthrough|scan-language-notice[^>]*>.*<aside/);
    assert.equal((html.match(/class="ge-acx-link"/g)||[]).length, 4);
    assert.equal((html.match(/<figure>/g)||[]).length, 8);
    assert.ok(html.includes(`href="${localPage('/terms',language)}"`));
    assert.ok(html.includes(`href="${localPage('/privacy',language)}"`));
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
  for (const page of COACHING_PAGES) {
    const html = renderCoachingPage(page);
    assert.ok(readFileSync('client/public/sitemap.xml','utf8').includes(coachingPath(page.slug)));
    assert.ok(existsSync('client/public'+page.image), page.image);
    assert.match(page.image, /-overhead-v3\.jpg$/);
    assert.equal((html.match(/class="ge-hero-photo"/g)||[]).length, 1);
    assert.ok(html.includes(`src="${page.image}"`));
    assert.ok(html.includes(`alt="${escapeCopy(page.imageAlt)}"`));
  }
});

test('styles reuse the brand fonts and contain narrow-screen layouts and explicit CTA breathing room', () => {
  const base = readFileSync('client/src/pages/homepage.css','utf8');
  const css = readFileSync('client/src/pages/landing-pages.css','utf8');
  assert.match(base, /--sans:'Lato'/);
  assert.match(base, /--heading:'Poppins'/);
  assert.match(css, /ge-cta-group[^}]+gap: 18px; margin: 36px 0/);
  assert.match(css, /min-height: 54px/);
  assert.match(css, /@media \(max-width: 700px\)/);
  assert.match(css, /\.scan-sky/);
  assert.match(css, /\.ge-site \.ge-hero-visual::after[^}]+linear-gradient\(180deg, #0a0a0a 0%[^}]+#080b11 100%\)/);
  assert.match(css, /\.ge-site \.ge-band \{[^}]+linear-gradient\(180deg, #080b11 0%[^}]+#080b11 100%\)/);
  assert.match(css, /\.ge-site \.ge-acx-usecase \{[^}]+linear-gradient\(180deg, #080b11 0%[^}]+#080b11 100%\)/);
  assert.match(css, /\.ge-site \.ge-acx-usecase-grid li \{[^}]+border-top: 3px solid #b7a6e8[^}]+linear-gradient\(165deg, #191526 0%, #11101a 48%, #0d1721 100%\)/);
  assert.doesNotMatch(css, /animation:|scroll-behavior:\s*smooth/);
});

test('homepage carousel defers four images and Scan reuses the sky in both languages', () => {
  for (const language of ['en', 'fr'] as const) {
    const html = homepage[language].main;
    const slides = html.match(/<img class="home-slide[^>]+>/g) || [];
    assert.equal(slides.length, 5);
    assert.equal(slides.filter(img => / src=/.test(img)).length, 1);
    assert.equal(slides.filter(img => / data-src=/.test(img)).length, 4);
    assert.match(slides[0], /srcset=.*640w.*1280w/);
    assert.match(slides[0], /fetchpriority="high"/);
    assert.match(html, /home-carousel-controls" hidden/);
    assert.doesNotMatch(html, /journey-line/);
    const scan = renderScanPage(language);
    assert.match(scan, /earth-orbit-1600.jpg/);
    assert.match(scan, /earth-orbit-640.jpg 640w/);
    assert.match(scan, /scan-elevator/);
  }
  for (const page of COACHING_PAGES) for (const size of [640, 1280]) {
    const asset = `client/public/images/coaching/${page.slug}-hero-${size}.jpg`;
    assert.ok(existsSync(asset));
    assert.ok(readFileSync(asset).byteLength < (size === 640 ? 65000 : 230000));
  }
});

test('reading floors are scoped to homepage and coaching content', () => {
  const home = readFileSync('client/src/pages/homepage.css', 'utf8');
  const niche = readFileSync('client/src/pages/landing-pages.css', 'utf8');
  assert.match(home, /\.home-content \.acx-card p,[^}]+font-size: 1\.125rem/);
  assert.match(home, /\.home-content \.person \.coach-bio,[^}]+font-size: 1\.125rem/);
  assert.match(home, /\.home-content \.acx-card-level,[^}]+font-size: 1rem/);
  assert.match(niche, /\.ge-landing\[data-use-case\] \.ge-acx-usecase-grid p,[^}]+font-size: 1\.125rem/);
  assert.match(niche, /\.ge-landing\[data-use-case\] \.ge-acx-usecase-grid \.ge-acx-level \{ font-size: 1rem; color: #b7a6e8/);
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
    assert.equal((html.match(/<section id="comparison"/g)||[]).length,0);
    assert.match(html,/href="\/signals"/);
    for (const code of ['H2S','H2H','HAI','A2A']) assert.ok(html.includes(code));
  }
  assert.deepEqual(restoredScan.en.FAQ_ITEMS.map(x=>x.id),restoredScan.fr.FAQ_ITEMS.map(x=>x.id));
  assert.doesNotMatch(renderScanPage('en'),/never shared with third parties|growth is measurable|exact balance of difficulty|<table/);
  const css=readFileSync('client/src/pages/landing-pages.css','utf8');
  assert.match(css,/\.ge-site \.ge-scan \.ge-band \{ background: radial-gradient\(ellipse 50% 50% at center[^}]+transparent 100%\)/);
  assert.match(css,/\.ge-scan-hero::before[^}]+linear-gradient\(180deg, #0a0a0a 0%[^}]+#080b11 100%\)/);
});

test('fallback homepage title and descriptions match current route metadata',()=>{
  const metadata=pageMetadata('/');
  assert.ok(template.includes(`<title>${metadata.title}</title>`));
  for(const name of ['description','og:description','twitter:description']) {
    assert.ok(template.includes(`${name}" content="${metadata.description}"`));
  }
  assert.doesNotMatch(template,/Communication Coaching for Self-Awareness &amp; Career Growth|Communication Coaching for Self-Awareness & Career Growth/);
});

test('local visual-style workshop compares three treatments without external assets', () => {
  const html = readFileSync('client/public/visual-style-workshop.html', 'utf8');
  assert.match(html, /Local visual workshop · not a public page/);
  assert.match(html, /A · Line-art icons/);
  assert.match(html, /B · Photography/);
  assert.match(html, /C · Atmospheric illustrations/);
  assert.match(html, /name="robots" content="noindex,nofollow"/);
  assert.match(html, /experienced-specialists-overhead-v3\.jpg/);
  assert.equal((html.match(/<article class="option/g) || []).length, 3);
  assert.doesNotMatch(html, /https?:\/\//);
});


test('public practice sample is explicitly fictional and excludes identity and submission fields', async () => {
  const { FICTIONAL_SCAN_SAMPLE } = await import('./fictional-scan-sample');
  assert.match(FICTIONAL_SCAN_SAMPLE, /FICTIONAL PRACTICE DATA/);
  assert.match(FICTIONAL_SCAN_SAMPLE, /partial example, not a complete Scan/);
  for (const lens of ['Influence', 'Attitude', 'Chaordic', 'Flow', 'Alignment', 'Energy & Needs', 'Ego', 'Dynamics']) {
    assert.ok(FICTIONAL_SCAN_SAMPLE.includes(`## ${lens}`));
  }
  assert.doesNotMatch(FICTIONAL_SCAN_SAMPLE, /<<(?:FNAME|LNAME|EMAIL|END_TOKEN|DATE_TIME_SUBMITTED|GDPR_%CONSENT|LEARNING_DISABILITY)>>/);
  assert.doesNotMatch(FICTIONAL_SCAN_SAMPLE, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const resources = readFileSync('client/src/pages/ResourcesPromptsPage.tsx', 'utf8');
  assert.match(resources, /FICTIONAL_SCAN_SAMPLE as sampleScanData/);
  assert.doesNotMatch(resources, /const sampleScanData =/);
  assert.match(resources, /navigator.clipboard.writeText\(sampleScanData\)/);
});
