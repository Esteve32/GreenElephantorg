import homepage from '../shared/homepage-content.json';
import { renderScanPage } from '../shared/scan-page';
import { coachingPage, renderCoachingPage } from '../shared/coaching-pages';
import { ACX_ARTICLE_FR_HTML } from '../shared/acx-article-fr';
import { basePagePath, hasFrenchPage, localPage, articleLinks, siteLanguage } from '../shared/site-language';
import { ACX_ARTICLE, ACX_ARTICLE_HTML, ACX_ARTICLE_SCHEMA } from "../shared/acx-article";
import express, { type Express, type RequestHandler, type ErrorRequestHandler } from "express";
import fs from "node:fs";
import path from "node:path";
import { SITE_ORIGIN, DEFAULT_SOCIAL_IMAGE, pageMetadata, fullPageTitle, isRegisteredPage } from "../shared/page-metadata";

// Register before sessions, parsers and provider routes. This endpoint only
// proves that HTTP handling is alive; it makes no dependency-readiness claim.
export function registerPublicHttp(app: Express) {
  app.get("/api/ping", (_req, res) => {
    res.set("Cache-Control", "no-store").json({ status: "ok", service: "greenelephant", scope: "http" });
  });
  app.use((req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.set('X-Frame-Options', 'SAMEORIGIN');
    if (/^\/(api|admin|portal|dashboard|checkout|payment-success)(\/|$)/.test(basePagePath(req.path))) res.set('Cache-Control', 'no-store');
    // Use the actual Host, not an untrusted forwarded-host value. Preserve
    // provider callbacks, POSTs and platform health/domain verification URLs.
    const host = req.headers.host?.toLowerCase().replace(/:\d+$/, "");
    if (host === "www.greenelephant.org" && ["GET", "HEAD"].includes(req.method)
        && isRegisteredPage(req.path) && !req.path.startsWith("/myfive")) {
      res.redirect(308, SITE_ORIGIN + req.originalUrl);
      return;
    }
    next();
  });
}

export const apiNotFound: RequestHandler = (_req, res) => {
  res.status(404).set("Cache-Control", "no-store").json({ error: "Not found" });
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]!);
}

export function renderPageMetadata(template: string, pathname: string): string {
  // The paused MyFive surface is outside this repair.
  if (pathname === "/myfive" || pathname.startsWith("/myfive/")) return template;
  const m = pageMetadata(pathname);
  const language = siteLanguage(pathname);
  const base = basePagePath(pathname);
  const title = fullPageTitle(m.title);
  const url = m.canonicalPath ? SITE_ORIGIN + m.canonicalPath : undefined;
  const image = new URL(m.ogImage ?? DEFAULT_SOCIAL_IMAGE, SITE_ORIGIN).href;
  const meta = (key: string, value: string, property = false) =>
    `<meta ${property ? "property" : "name"}="${key}" content="${escapeHtml(value)}" />`;
  const tags = [
    `<title>${escapeHtml(title)}</title>`, meta("title", title),
    meta("description", m.description), meta("keywords", m.keywords ?? ""),
    meta("robots", m.noIndex ? "noindex, nofollow" : "index, follow"),
    meta("og:type", m.ogType ?? "website", true), meta("og:title", title, true),
    meta("og:description", m.description, true), meta("og:image", image, true),
    meta("twitter:card", "summary"), meta("twitter:title", title),
    meta("twitter:description", m.description), meta("twitter:image", image),
  ];
  if (url) tags.push(`<link rel="canonical" href="${escapeHtml(url)}" />`,
    meta("og:url", url, true), meta("twitter:url", url));
  if (hasFrenchPage(pathname) && !m.noIndex) {
    for (const lang of ['en', 'fr', 'x-default'] as const) tags.push(`<link rel="alternate" hreflang="${lang}" href="${SITE_ORIGIN}${localPage(base, lang === 'fr' ? 'fr' : 'en')}" />`);
  }
  const names = new Set(["title", "description", "keywords", "robots", "og:type", "og:url", "og:title", "og:description", "og:image", "twitter:card", "twitter:url", "twitter:title", "twitter:description", "twitter:image"]);
  let html = template.replace(/<html\b[^>]*>/i, `<html lang="${language}" class="dark">`).replace(/<title>[^<]*<\/title>/gi, "")
    .replace(/<meta\b[^>]*>/gi, tag => {
      const key = tag.match(/(?:name|property)=["']([^"']+)["']/i)?.[1];
      return key && names.has(key) ? "" : tag;
    }).replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi, "");
  // The template's unscoped service schema must not describe every route as
  // the Scan product. Page-specific schemas remain owned by the SEO component.
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, block => {
    return block.includes('"serviceType"') && pathname !== "/" && pathname !== "/scan" ? "" : block;
  });
  // The authored article is readable before JavaScript runs. React uses the
  // same source on navigation; no provider calls or new rendering framework.
  if (base.replace(/\/+$/, "") === ACX_ARTICLE.path) {
    html = html.replace('<div id="root"></div>', `<div id="root"><main><article class="acx-article">${articleLinks(language === "fr" ? ACX_ARTICLE_FR_HTML : ACX_ARTICLE_HTML, language)}</article></main></div>`);
    tags.push(`<script type="application/ld+json" id="page-structured-data">${JSON.stringify({ ...ACX_ARTICLE_SCHEMA, headline: m.title, description: m.description, inLanguage: language, url, mainEntityOfPage: url }).replaceAll("<", "\\u003c")}</script>`);
  }
  if (base === '/') html = html.replace('<div id="root"></div>', `<div id="root"><div class="ge-site"><main class="home-content">${homepage[language].main}</main>${homepage[language].footer}</div></div>`);
  if (base.replace(/\/+$/, '') === '/scan') html = html.replace('<div id="root"></div>', `<div id="root"><main class="ge-site" lang="${language}">${renderScanPage(language)}</main></div>`);
  const coaching = coachingPage(pathname);
  if (coaching) html = html.replace('<div id="root"></div>', `<div id="root"><main class="ge-site" lang="en">${renderCoachingPage(coaching)}</main></div>`);
  return html.replace("</head>", tags.join("\n    ") + "\n  </head>");
}

export function pageStatus(pathname: string): number {
  return isRegisteredPage(pathname) ? 200 : 404;
}

export const rejectMissingAsset: RequestHandler = (req, res, next) => {
  if (!isRegisteredPage(req.path) && (path.extname(req.path) || /^\/(assets|images|src)\//.test(req.path))) {
    res.status(404).type("text/plain").send("Not found");
    return;
  }
  next();
};

export function servePublicFiles(app: Express, distPath: string) {
  const template = fs.readFileSync(path.join(distPath, "index.html"), "utf8");
  // index.html must go through the same metadata/status logic as every page.
  app.get("/index.html", (_req, res) => res.redirect(308, "/"));
  app.use(express.static(distPath, { index: false, redirect: false }));
  app.use(rejectMissingAsset);
  app.get("*", (req, res) => {
    res.status(pageStatus(req.path)).set("Cache-Control", /\/(admin|portal|checkout|payment-success|dashboard)(\/|$)/.test(req.path) ? "no-store" : "no-cache")
      .type("html").send(renderPageMetadata(template, req.path));
  });
  app.use((_req, res) => res.status(404).type("text/plain").send("Not found"));
}

// Do not expose provider/database errors or crash the process on malformed JSON.
export const publicErrorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) return next(error);
  const candidate = Number(error.status || error.statusCode);
  const status = Number.isInteger(candidate) && candidate >= 400 && candidate < 600 ? candidate : 500;
  res.status(status).set('Cache-Control', 'no-store').json({ message: status < 500 ? 'Invalid request' : 'Internal server error' });
};
