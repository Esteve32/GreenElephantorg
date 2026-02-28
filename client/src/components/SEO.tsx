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
}

export function SEO({
  title,
  description,
  keywords,
  canonicalPath,
  ogImage = '/og-image.png',
  ogType = 'website',
  structuredData,
  faqItems,
  breadcrumbs
}: SEOProps) {
  useEffect(() => {
    const fullTitle = title.includes('GreenElephant') ? title : `${title} | GreenElephant`;
    document.title = fullTitle;

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

    updateMeta('description', description);
    if (keywords) {
      updateMeta('keywords', keywords);
    }

    const baseUrl = 'https://greenelephant.org';
    const fullUrl = canonicalPath ? `${baseUrl}${canonicalPath}` : baseUrl;

    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', description, true);
    updateMeta('og:type', ogType, true);
    updateMeta('og:url', fullUrl, true);
    updateMeta('og:image', `${baseUrl}${ogImage}`, true);

    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', `${baseUrl}${ogImage}`);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonicalPath) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', fullUrl);
    }

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
        "knowsAbout": ["Conscious Communication", "Executive Coaching", "Flow Theory", "Micro-habits", "Behavioural Change"],
        "sameAs": ["https://www.linkedin.com/company/greenelephant-org"],
        "founder": { "@type": "Person", "name": "Esteve Camprubí", "email": "esteve@greenelephant.org" }
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
  }, [title, description, keywords, canonicalPath, ogImage, ogType, structuredData, faqItems, breadcrumbs]);

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
  "description": "Conscious communication platform. Tools, coaching, and retreats built around the Periodic Table of Conscious Communication — 146 micro-habits across 8 behavioural lenses.",
  "email": "esteve@greenelephant.org",
  "areaServed": "Worldwide",
  "foundingDate": "2022",
  "knowsAbout": [
    "Conscious Communication",
    "Executive Coaching",
    "Communication Diagnostics",
    "Flow Theory",
    "Micro-habits",
    "TEAL Organisations",
    "Behavioural Change",
    "Leadership Presence"
  ],
  "sameAs": [
    "https://www.linkedin.com/company/greenelephant-org"
  ],
  "founder": {
    "@type": "Person",
    "name": "Esteve Camprubí",
    "jobTitle": "Founder & Lead Communication Coach",
    "email": "esteve@greenelephant.org"
  }
};

export const PRODUCT_STRUCTURED_DATA = {
  satelliteScan: {
    "@context": "https://schema.org",
    "@type": ["Product", "Service"],
    "name": "Satellite Scan — Communication Diagnostic",
    "description": "AI-powered communication assessment mapping your patterns across 8 lenses (Influence, Attitude, Chaordic, Flow, Alignment, Needs, Ego, Dynamics). 129 questions. Delivered as a visual dashboard. Used as the baseline for all coaching.",
    "url": "https://greenelephant.org/scan",
    "serviceType": "Communication Assessment",
    "audience": { "@type": "Audience", "audienceType": "Executive Assistants, Founders, Team Leaders, Virtual Assistants" },
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
