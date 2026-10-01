import { siteLanguage, basePagePath, hasFrenchPage, localPage } from "@shared/site-language";
import { SITE_ORIGIN, DEFAULT_SOCIAL_IMAGE, fullPageTitle, isPrivatePage } from "@shared/page-metadata";
import { useEffect } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  structuredData?: object;
  faqItems?: FAQItem[];
  breadcrumbs?: BreadcrumbItem[];
  noIndex?: boolean;
}

export function SEO({
  title,
  description,
  keywords,
  canonicalPath,
  ogImage = DEFAULT_SOCIAL_IMAGE,
  ogType = 'website',
  structuredData,
  faqItems,
  breadcrumbs,
  noIndex = false,
}: SEOProps) {
  useEffect(() => {
    const fullTitle = fullPageTitle(title);
    document.title = fullTitle;
    document.documentElement.lang = siteLanguage(window.location.pathname, window.location.search);
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(node => node.remove());
    if (canonicalPath && hasFrenchPage(canonicalPath) && !noIndex) {
      for (const language of ['en', 'fr', 'x-default'] as const) {
        const link = document.createElement('link'); link.rel = 'alternate'; link.hreflang = language;
        link.href = SITE_ORIGIN + localPage(basePagePath(canonicalPath), language === 'fr' ? 'fr' : 'en');
        document.head.appendChild(link);
      }
    }

    const updateMeta = (name: string, content: string, isProperty: boolean = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    updateMeta('title', fullTitle);
    updateMeta('description', description);
    updateMeta('keywords', keywords ?? '');

    const baseUrl = SITE_ORIGIN;
    const fullUrl = canonicalPath ? `${baseUrl}${canonicalPath}` : baseUrl;

    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', description, true);
    updateMeta('og:type', ogType, true);
    updateMeta('og:url', fullUrl, true);
    updateMeta('og:image', new URL(ogImage, baseUrl).href, true);

    updateMeta('twitter:card', ogImage === DEFAULT_SOCIAL_IMAGE ? 'summary' : 'summary_large_image');
    updateMeta('twitter:url', fullUrl);
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', new URL(ogImage, baseUrl).href);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonicalPath) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', fullUrl);
    }

    else if (canonical) {
      canonical.remove();
    }

    // noIndex support for admin/private pages
    updateMeta('robots', (noIndex || isPrivatePage(window.location.pathname)) ? 'noindex, nofollow' : 'index, follow');

    // Organisation schema — injected on every page for AI agent discoverability
    if (!document.getElementById('org-structured-data')) {
      const orgScript = document.createElement('script');
      orgScript.setAttribute('type', 'application/ld+json');
      orgScript.setAttribute('id', 'org-structured-data');
      orgScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "GreenElephant",
        "alternateName": "GreenElephant.org",
        "url": "https://greenelephant.org",
        "logo": "https://greenelephant.org/ge-logo-512.png",
        "description": "Conscious communication platform. Tools, coaching, and retreats built around the Periodic Table of Conscious Communication.",
        "email": "esteve@greenelephant.org",
        "areaServed": "Worldwide",
        "knowsAbout": ["Conscious Communication", "Self-Awareness", "Emotional Intelligence", "Personal Development", "Career Transition Coaching", "Executive Coaching", "Communication Diagnostics", "Flow Theory", "Micro-habits", "Behavioural Change", "Leadership Presence", "Future-Proof Career Skills"],
        "sameAs": ["https://www.linkedin.com/company/greenelephant-org"],
        "founder": { "@type": "Person", "name": "Estève Pannetier", "email": "esteve@greenelephant.org" }
      });
      document.head.appendChild(orgScript);
    }

    if (structuredData) {
      let script = document.getElementById('page-structured-data');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('id', 'page-structured-data');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    if (faqItems && faqItems.length > 0) {
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      };
      let faqScript = document.getElementById('faq-structured-data');
      if (!faqScript) {
        faqScript = document.createElement('script');
        faqScript.setAttribute('type', 'application/ld+json');
        faqScript.setAttribute('id', 'faq-structured-data');
        document.head.appendChild(faqScript);
      }
      faqScript.textContent = JSON.stringify(faqSchema);
    }

    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": `${baseUrl}${item.url}`
        }))
      };
      let breadcrumbScript = document.getElementById('breadcrumb-structured-data');
      if (!breadcrumbScript) {
        breadcrumbScript = document.createElement('script');
        breadcrumbScript.setAttribute('type', 'application/ld+json');
        breadcrumbScript.setAttribute('id', 'breadcrumb-structured-data');
        document.head.appendChild(breadcrumbScript);
      }
      breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
    }

    return () => {
      const pageScript = document.getElementById('page-structured-data');
      if (pageScript) pageScript.remove();
      const faqScript = document.getElementById('faq-structured-data');
      if (faqScript) faqScript.remove();
      const breadcrumbScript = document.getElementById('breadcrumb-structured-data');
      if (breadcrumbScript) breadcrumbScript.remove();
    };
  }, [title, description, keywords, canonicalPath, ogImage, ogType, structuredData, faqItems, breadcrumbs, noIndex]);

  return null;
}

// Organisation schema — injected on every page that uses SEO for agent discoverability
export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "GreenElephant",
  "alternateName": "GreenElephant.org",
  "url": "https://greenelephant.org",
  "logo": "https://greenelephant.org/ge-logo-512.png",
  "description": "Human-centred AI literacy and communication coaching. Workshops, practical learning journeys and the Satellite Scan help people use AI while keeping their judgement and voice.",
  "email": "esteve@greenelephant.org",
  "areaServed": "Worldwide",
  "foundingDate": "2022",
  "knowsAbout": [
    "Conscious Communication",
    "Self-Awareness",
    "Emotional Intelligence",
    "Personal Development",
    "Personal Growth",
    "Resilience",
    "Social Intelligence",
    "Career Transition Coaching",
    "Future-Proof Career Skills",
    "Executive Coaching",
    "Leadership Development",
    "Communication Diagnostics",
    "Flow Theory",
    "Micro-habits",
    "TEAL Organisations",
    "Behavioural Change",
    "Leadership Presence",
    "AI-Assisted Communication",
    "Ethical Personal Development",
    "Ethical HR Tools"
  ],
  "sameAs": [
    "https://www.linkedin.com/company/greenelephant-org"
  ],
  "founder": {
    "@type": "Person",
    "name": "Estève Pannetier",
    "jobTitle": "Founder & Lead Communication Coach",
    "email": "esteve@greenelephant.org"
  }
};

export const PRODUCT_STRUCTURED_DATA = {
  satelliteScan: {
    "@context": "https://schema.org",
    "@type": ["Product", "Service"],
    "name": "Satellite Scan — Personal Communication Assessment",
    "description": "A personal communication assessment with a coach-prepared dashboard, prompts and practice materials. Use your results to guide AI in your own voice. Training and coaching are booked separately.",
    "url": "https://greenelephant.org/scan",
    "serviceType": "Personal Communication Assessment",
    "keywords": "AI literacy, personal communication, conscious communication, AI prompts",
    "audience": { "@type": "Audience", "audienceType": "Independent professionals and team members" },
    "areaServed": "Worldwide",
    "provider": { "@type": "Organization", "name": "GreenElephant", "url": "https://greenelephant.org" },
    "brand": { "@type": "Brand", "name": "GreenElephant" },
    "offers": {
      "@type": "Offer",
      "price": "99.95",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    }
  },
  interviewMastery: {
    "@context": "https://schema.org",
    "@type": ["Product", "Service"],
    "name": "Interview Mastery Bundle",
    "description": "3-session coaching program combining Satellite Scan diagnostics with personalised interview coaching for career advancement.",
    "serviceType": "Career Coaching",
    "provider": { "@type": "Organization", "name": "GreenElephant", "url": "https://greenelephant.org" },
    "brand": { "@type": "Brand", "name": "GreenElephant" },
    "offers": {
      "@type": "Offer",
      "price": "845",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    }
  },
  singleSession: {
    "@context": "https://schema.org",
    "@type": ["Product", "Service"],
    "name": "1:1 Single Coaching Session",
    "description": "One 120-minute coaching session for targeted communication breakthroughs. Uses Satellite Scan results to identify triggers, blind spots, and strengths.",
    "serviceType": "Executive Communication Coaching",
    "provider": { "@type": "Organization", "name": "GreenElephant", "url": "https://greenelephant.org" },
    "brand": { "@type": "Brand", "name": "GreenElephant" },
    "offers": {
      "@type": "Offer",
      "price": "295",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    }
  },
  coachingJourney: {
    "@context": "https://schema.org",
    "@type": ["Product", "Service"],
    "name": "Coaching Journey",
    "description": "Comprehensive multi-session coaching program for deep transformation in communication patterns and leadership presence. Includes Satellite Scan baseline, biweekly 120-minute sessions, and unlimited check-in support.",
    "url": "https://greenelephant.org/coaching",
    "serviceType": "Executive Communication Coaching",
    "audience": { "@type": "Audience", "audienceType": "Leaders, Executives, Founders seeking deep behavioural change" },
    "areaServed": "Worldwide",
    "provider": { "@type": "Organization", "name": "GreenElephant", "url": "https://greenelephant.org" },
    "brand": { "@type": "Brand", "name": "GreenElephant" },
    "offers": {
      "@type": "Offer",
      "price": "2980",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    }
  },
  teamWorkshop: {
    "@context": "https://schema.org",
    "@type": ["Product", "Service"],
    "name": "Team Communication Workshop",
    "description": "Interactive team workshop to improve workplace communication culture and reduce conflict. Uses the Periodic Table of Conscious Communication framework.",
    "serviceType": "Team Workshop",
    "provider": { "@type": "Organization", "name": "GreenElephant", "url": "https://greenelephant.org" },
    "brand": { "@type": "Brand", "name": "GreenElephant" },
    "offers": {
      "@type": "Offer",
      "price": "1200",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    }
  },
  flowCheck: {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "Service"],
    "name": "Check-my-FLOW — Free Flow Assessment",
    "description": "Free 5-minute assessment based on Csikszentmihalyi's 1988 flow model. Measures perceived Motivation, Challenge, and Competence in a communication situation. Maps you to Flow, Challenge/Stress, Comfort, or Danger/Apathy zones.",
    "url": "https://greenelephant.org/flow-check",
    "applicationCategory": "Assessment Tool",
    "serviceType": "Communication Assessment",
    "audience": { "@type": "Audience", "audienceType": "Anyone navigating a challenging communication context" },
    "provider": { "@type": "Organization", "name": "GreenElephant", "url": "https://greenelephant.org" },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    }
  }
};
