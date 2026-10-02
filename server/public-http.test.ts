import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, cpSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { request, type Server } from "node:http";
import express from "express";
import { registerPublicHttp, apiNotFound, servePublicFiles, renderPageMetadata, publicErrorHandler } from "./public-http";
import { REGISTERED_PAGE_PATHS, PAGE_METADATA, SITE_ORIGIN, DEFAULT_SOCIAL_IMAGE, isRegisteredPage, pageMetadata } from "../shared/page-metadata";

let server: Server;
let origin: string;
let fixture: string;
const template = readFileSync("client/index.html", "utf8");
before(async () => {
  fixture = mkdtempSync(path.join(tmpdir(), "ge-public-http-"));
  cpSync("client/public", fixture, { recursive: true });
  writeFileSync(path.join(fixture, "index.html"), template);
  const app = express();
  registerPublicHttp(app);
  app.post('/api/test-bad-json',express.json(),(_req,res)=>res.json({ok:true}));
  app.use(publicErrorHandler);
  // A sentinel proves ping bypasses sessions and provider routes.
  app.use((req, res, next) => {
    if (req.path === "/api/ping") throw new Error("Health reached downstream middleware");
    next();
  });
  app.get("/api/existing", (_req, res) => res.json({ existing: true }));
  app.use("/api", apiNotFound);
  servePublicFiles(app, process.env.PUBLIC_HTTP_DIST ?? fixture);
  server = await new Promise<Server>(resolve => {
    const listening = app.listen(0, "127.0.0.1", () => resolve(listening));
  });
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  origin = `http://127.0.0.1:${address.port}`;
});
after(async () => {
  if (server) await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  if (fixture) rmSync(fixture, { recursive: true, force: true });
});

test("registered SPA routes match the real client router and retain direct navigation", async () => {
  const source = readFileSync("client/src/App.tsx", "utf8");
  const actual = [...source.matchAll(/<Route path="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual([...REGISTERED_PAGE_PATHS], actual);
  for (const route of REGISTERED_PAGE_PATHS) {
    const response = await fetch(origin + route.replace(":token", "test-token"));
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get("content-type")!, /text\/html/, route);
  }
});

test("unknown pages/assets/API are real 404s; ping is side-effect-free JSON", async () => {
  const expected: Array<[string, number, RegExp]> = [
    ["/", 200, /text\/html/], ["/scan", 200, /text\/html/],
    ["/resources", 200, /text\/html/], ["/flow-check", 200, /text\/html/],
    ["/flowcheck", 404, /text\/html/], ["/resources/prompts", 404, /text\/html/],
    ["/signals/quiz", 404, /text\/html/], ["/unknown-page", 404, /text\/html/],
    ["/missing.png", 404, /text\/plain/], ["/assets/missing.js", 404, /text\/plain/],
    ["/api/unknown", 404, /application\/json/], ["/api", 404, /application\/json/],
    ["/api/ping", 200, /application\/json/], ["/api/existing", 200, /application\/json/],
    [DEFAULT_SOCIAL_IMAGE, 200, /image\/png/],
  ];
  for (const [route, status, type] of expected) {
    const response = await fetch(origin + route);
    assert.equal(response.status, status, route);
    assert.match(response.headers.get("content-type")!, type, route);
    const text = await response.text();
    if (route === "/api/ping") {
      assert.deepEqual(JSON.parse(text), { status: "ok", service: "greenelephant", scope: "http" });
      assert.equal(response.headers.get("cache-control"), "no-store");
    }
    if (status === 404 && type.source.includes("html")) {
      assert.match(text, /noindex, nofollow/);
      assert.doesNotMatch(text, /rel="canonical"/);
    }
    console.log(`${route}: ${status} ${response.headers.get("content-type")}`);
  }
  for (const method of ["HEAD", "POST"]) {
    const response = await fetch(origin + "/api/unknown", { method });
    assert.equal(response.status, 404);
    assert.match(response.headers.get("content-type")!, /application\/json/);
  }
  assert.equal((await fetch(origin + "/unknown", { method: "POST" })).status, 404);
});

test("initial HTML has a single set of route-specific metadata", async () => {
  for (const route of ["/", "/scan", "/resources", "/flow-check", "/signals", "/prompts"]) {
    const html = await (await fetch(origin + route + "?utm_source=test")).text();
    const canonicalPath = route === "/prompts" ? "/resources" : route;
    const expected = PAGE_METADATA[canonicalPath];
    assert.equal((html.match(/<title>/g) ?? []).length, 1);
    assert.ok(html.includes(expected.title.replaceAll("&", "&amp;")), route);
    assert.ok(html.includes(`href="${SITE_ORIGIN}${canonicalPath}"`), route);
    for (const key of ["description", "robots", "og:title", "og:description", "og:url", "og:image", "twitter:title", "twitter:url", "twitter:image"]) {
      assert.equal((html.match(new RegExp(`(?:name|property)="${key}"`, "g")) ?? []).length, 1, route + " " + key);
    }
    assert.ok(html.includes(SITE_ORIGIN + DEFAULT_SOCIAL_IMAGE));
    assert.doesNotMatch(html, /og-image\.png/);
    console.log(`${route}: ${html.match(/<title>(.*?)<\/title>/)?.[1]} | ${SITE_ORIGIN}${canonicalPath}`);
  }
  const privatePage = await (await fetch(origin + "/portal/login")).text();
  assert.match(privatePage, /noindex, nofollow/);
  assert.doesNotMatch(privatePage, /"serviceType"/);
  assert.equal(renderPageMetadata(template, "/myfive"), template, "paused MyFive template remains unchanged");
});

// Node fetch does not reliably permit overriding Host. Use the HTTP client
// directly to exercise the actual incoming Host header.
async function hostResponse(route: string, host: string, method = "GET", forwardedHost?: string) {
  return new Promise<{ status: number; location?: string }>((resolve, reject) => {
    const req = request(origin + route, { method, headers: { host,
      ...(forwardedHost ? { "x-forwarded-host": forwardedHost } : {}) } }, res => {
      res.resume();
      res.on("end", () => resolve({ status: res.statusCode!, location: res.headers.location }));
    });
    req.on("error", reject);
    req.end();
  });
}

test("only alternate public hostname redirects; platforms, ping and POST stay usable", async () => {
  for (const host of ["greenelephant.org", "example.replit.app", "localhost"]) {
    assert.equal((await hostResponse("/scan", host)).status, 200);
  }
  const redirect = await hostResponse("/scan?source=test", "www.greenelephant.org");
  assert.equal(redirect.status, 308);
  assert.equal(redirect.location, SITE_ORIGIN + "/scan?source=test");
  assert.equal((await hostResponse("/api/ping", "www.greenelephant.org")).status, 200);
  assert.equal((await hostResponse("/api/unknown", "www.greenelephant.org", "POST")).status, 404);
  assert.equal((await hostResponse("/scan", "example.replit.app", "GET", "www.greenelephant.org")).status, 200);
});

test("robots groups share exclusions; sitemap only contains existing same-origin public pages", () => {
  const robots = readFileSync("client/public/robots.txt", "utf8");
  const groups = robots.split(/User-agent: /).slice(1);
  assert.equal(groups.length, 7);
  for (const group of groups) for (const route of ["/admin", "/admin/", "/api/", "/checkout", "/payment-success", "/portal", "/portal/", "/dashboard"]) {
    assert.ok(group.split("\n").includes("Disallow: " + route));
  }
  const sitemap = readFileSync("client/public/sitemap.xml", "utf8");
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]));
  const paths = urls.map(url => url.pathname);
  assert.equal(new Set(paths).size, paths.length, "No duplicate sitemap pages");
  for (const required of ["/", "/scan", "/signals", "/resources", "/decode", "/ai-policy", "/privacy", "/terms", "/cookies"]) {
    assert.ok(paths.includes(required), `Retained public page missing: ${required}`);
  }
  for (const url of urls) {
    assert.equal(url.origin, SITE_ORIGIN);
    assert.ok(isRegisteredPage(url.pathname), url.pathname);
    assert.ok(!pageMetadata(url.pathname).noIndex, "No draft, parked or private pages");
    assert.equal(pageMetadata(url.pathname).canonicalPath, url.pathname, "Only canonical pages");
    assert.doesNotMatch(url.pathname, /^\/(admin|api|portal|checkout|payment-success|dashboard)(\/|$)/);
  }
});

test("repaired internal links and metadata use registered destinations", () => {
  for (const file of ["client/src/pages/ExecutiveCoachingAssessmentPage.tsx", "client/src/pages/ResourcesPromptsPage.tsx", "client/src/pages/SignalsQuizPage.tsx", "client/src/pages/admin/PromptGeneratorAdmin.tsx"]) {
    assert.doesNotMatch(readFileSync(file, "utf8"), /["']\/(flowcheck|resources\/prompts|signals\/quiz)["']/);
  }
  for (const m of Object.values(PAGE_METADATA)) assert.ok(m.canonicalPath && isRegisteredPage(m.canonicalPath));
});

test("parked webinar routes are noindex with no active registration metadata", async () => {
  for (const route of ["/webinar", "/webinars", "/calendar"]) {
    const response = await fetch(origin + route);
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.match(html, /<title>Webinars are currently paused/);
    assert.match(html, /noindex, nofollow/);
    assert.ok(!readFileSync("client/public/sitemap.xml", "utf8").includes(`<loc>${SITE_ORIGIN}${route}</loc>`));
  }
  const notice = readFileSync("client/src/pages/ParkedWebinarsPage.tsx", "utf8");
  assert.doesNotMatch(notice, /useQuery|apiRequest|<form/);
  for (const file of ["WebinarPage.tsx", "WebinarsPage.tsx", "CalendarPage.tsx"]) {
    assert.ok(readFileSync("client/src/pages/" + file, "utf8").length > 1000, "Original content preserved");
  }
});


test("Approved ACX guide is readable without JavaScript and metadata matches the article", async () => {
  for (const route of ["/blog/acx-levels-ai-literacy", "/blog/acx-levels-ai-literacy/"]) {
    const response = await fetch(origin + route);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /<article class="acx-article">/);
    assert.match(html, /ACX level 4: work with AI across team members/);
    assert.match(html, /name="robots" content="index, follow"/);
    const block = html.match(/<script type="application\/ld\+json" id="page-structured-data">([^<]+)<\/script>/);
    assert.ok(block);
    const schema = JSON.parse(block[1]);
    assert.equal(schema["@type"], "BlogPosting");
    assert.equal(schema.author.name, "Estève Pannetier");
    assert.ok(html.includes(`<h1>${schema.headline}</h1>`));
    assert.equal(schema.datePublished, undefined);
    assert.ok(schema.citation.includes("linkedin.com/pulse/"));
    assert.equal((html.match(/id="page-structured-data"/g) ?? []).length, 1);
  }
  const home = await (await fetch(origin + "/")).text();
  assert.doesNotMatch(home, /<article class="acx-article">/);
  const sitemap = await (await fetch(origin + "/sitemap.xml")).text();
  assert.match(sitemap, /blog\/acx-levels-ai-literacy/);
});


test('French landing pages have real French content and reciprocal language links', async () => {
  for (const route of ['/fr','/fr/scan','/fr/blog/acx-levels-ai-literacy']) {
    const response = await fetch(origin + route); const html = await response.text();
    assert.equal(response.status,200); assert.match(html, /<html lang="fr"/);
    assert.match(html, /hreflang="fr"/); assert.match(html, /hreflang="en"/);
    assert.match(html, /hreflang="x-default"/);
    assert.match(html, new RegExp('rel="canonical" href="'+SITE_ORIGIN+route+'"'));
    assert.doesNotMatch(html, /APERÇU PRIVÉ|DESIGN CANDIDATE|client-stories/);
  }
  const home = await (await fetch(origin + '/fr')).text();
  assert.match(home,/Travaillez avec l’IA/); assert.match(home,/maeva-portrait/);
  const scan = await (await fetch(origin + '/fr/scan')).text();
  assert.match(scan,/Questionnaire et guides vidéo actuellement en anglais/);
  assert.match(scan,/href="\/fr\/checkout\?product=satellitescan&amp;lang=fr"|href="\/fr\/checkout\?product=satellitescan&lang=fr"/);
  const article=await (await fetch(origin+'/fr/blog/acx-levels-ai-literacy')).text();
  const schema=JSON.parse(article.match(/id="page-structured-data">([^<]+)<\/script>/)![1]);
  assert.equal(schema.inLanguage,'fr'); assert.match(schema.headline,/Les quatre niveaux ACX/);
  assert.equal(schema.url,SITE_ORIGIN+'/fr/blog/acx-levels-ai-literacy');
});

test('private English and French HTML cannot enter a shared cache', async () => {
  for(const route of ['/checkout','/fr/checkout','/payment-success','/fr/payment-success','/portal/login','/admin/login']) {
    const response=await fetch(origin+route); assert.equal(response.headers.get('cache-control'),'no-store');
    assert.equal(response.headers.get('x-content-type-options'),'nosniff');
    assert.match(await response.text(),/noindex, nofollow/);
  }
});

test('malformed JSON returns a redacted error and leaves HTTP running', async () => {
  const response=await fetch(origin+'/api/test-bad-json',{method:'POST',headers:{'Content-Type':'application/json'},body:'{"secret":not-json}'});
  assert.equal(response.status,400);assert.deepEqual(await response.json(),{message:'Invalid request'});
  assert.equal((await fetch(origin+'/api/ping')).status,200);
});
