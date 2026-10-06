import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { POLICY_PAGES, renderPolicyPage, type PolicyPath } from './policy-pages';
import { localPage, hasFrenchPage, basePagePath } from './site-language';
import { isRegisteredPage, pageMetadata } from './page-metadata';
import { renderPageMetadata, pageStatus } from '../server/public-http';
import { homepage } from './homepage-rendered';

test('all policy disclosures are visible in EN/FR initial HTML with correct destinations and SEO', () => {
  const template = readFileSync('client/index.html', 'utf8');
  const sitemap = readFileSync('client/public/sitemap.xml', 'utf8');
  for (const base of Object.keys(POLICY_PAGES.en) as PolicyPath[]) {
    assert.equal(hasFrenchPage(base), true);
    assert.deepEqual(POLICY_PAGES.en[base].sections.map(s=>s.id), POLICY_PAGES.fr[base].sections.map(s=>s.id));
    for (const language of ['en','fr'] as const) {
      const path = localPage(base, language);
      const copy = POLICY_PAGES[language][base];
      const content = renderPolicyPage(base, language);
      assert.equal((content.match(/<h1(?:\s[^>]*)?>/g) || []).length, 1);
      assert.equal((content.match(/class="policy-section"/g) || []).length, copy.sections.length);
      assert.doesNotMatch(content, /<details|<img|<form|\shidden(?:[\s=>])/);
      for (const [,href] of content.matchAll(/href="([^"]+)"/g)) {
        if (href.startsWith('#')) assert.ok(content.includes(`id="${href.slice(1)}"`), href);
        else if (href.startsWith('/')) assert.ok(isRegisteredPage(href.split('#')[0]), href);
      }
      for (const suffix of ['', '/']) {
        const html = renderPageMetadata(template,path+suffix);
        assert.equal(pageStatus(path+suffix),200);
        assert.ok(html.includes(content));
        assert.ok(html.includes(`<html lang="${language}"`));
        assert.ok(html.includes(`rel="canonical" href="https://greenelephant.org${path}"`));
        assert.ok(html.includes(`hreflang="en" href="https://greenelephant.org${base}"`));
        assert.ok(html.includes(`hreflang="fr" href="https://greenelephant.org/fr${base}"`));
        assert.equal(pageMetadata(path+suffix).description,copy.description);
      }
      assert.ok(homepage[language].footer.includes(`href="${path}"`));
      if (language === 'fr') assert.doesNotMatch(homepage.fr.footer, new RegExp(`<a[^>]*href="${path}"[^>]*hreflang="en"|href="${path}"[^>]*>[^<]*<span aria-label="en anglais"`));
      assert.ok(sitemap.includes(`<loc>https://greenelephant.org${path}</loc>`));
      assert.equal(basePagePath(path),base);
    }
  }
});

test('the policy rewrite keeps service prices, cancellation windows, providers and rights', () => {
  for (const language of ['en','fr'] as const) {
    const privacy=renderPolicyPage('/privacy',language);
    const ai=renderPolicyPage('/ai-policy',language);
    const terms=renderPolicyPage('/terms',language);
    const cookies=renderPolicyPage('/cookies',language);
    for (const recipient of ['Estève','Anu','Stripe','Replit','Resend','Typeform','Cloudflare','Calendly','Google','LinkedIn','Notion','Thesys','Fathom']) assert.ok(privacy.includes(recipient),recipient);
    for (const section of ['bases','retention','transfers','rights','deletion','complaints']) assert.ok(privacy.includes(`id="${section}"`));
    for (const price of ['295','845','890','980','200','18','28','12']) assert.ok(terms.includes(price));
    for (const window of ['48','60','90','14']) assert.ok(terms.includes(window));
    assert.match(ai,/Anthropic Claude/);
    assert.match(ai,/Arbora/);
    assert.match(cookies,/data-cookie-preferences/);
    assert.match(cookies,/ge\.analytics-consent\.v1/);
    assert.match(cookies,/180/);
    assert.match(cookies,/connect\.sid/);
    assert.match(cookies,/_ga_\*/);
  }
  assert.doesNotMatch(renderPolicyPage('/ai-policy','en'), /EU AI Act Compliance|classify our AI applications|all analysis.*performed by human coaches/i);
  assert.match(renderPolicyPage('/privacy','en'), /normally within one month/);
  assert.match(renderPolicyPage('/terms','en'), /mandatory consumer rights/);
});
