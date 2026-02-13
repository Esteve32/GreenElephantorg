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

export const PRODUCT_STRUCTURED_DATA = {
  satelliteScan: {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Satellite Scan - Communication Diagnostic",
    "description": "AI-powered communication behavior analysis mapping your patterns across 8 lenses. Discover your communication strengths and growth opportunities.",
    "brand": {
      "@type": "Brand",
      "name": "GreenElephant"
    },
    "offers": {
      "@type": "Offer",
      "price": "99.95",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    }
  },
  interviewMastery: {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Interview Mastery Bundle",
    "description": "3-session coaching program combining Satellite Scan diagnostics with personalized interview coaching for career advancement.",
    "brand": {
      "@type": "Brand",
      "name": "GreenElephant"
    },
    "offers": {
      "@type": "Offer",
      "price": "845",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    }
  },
  singleSession: {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "1:1 Single Session",
    "description": "One-on-one coaching session for targeted communication breakthroughs.",
    "brand": {
      "@type": "Brand",
      "name": "GreenElephant"
    },
    "offers": {
      "@type": "Offer",
      "price": "295",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    }
  },
  coachingJourney: {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Coaching Journey",
    "description": "Comprehensive multi-session coaching program for deep transformation in communication patterns and leadership presence.",
    "brand": {
      "@type": "Brand",
      "name": "GreenElephant"
    },
    "offers": {
      "@type": "Offer",
      "price": "2980",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    }
  },
  teamWorkshop: {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Team Workshop",
    "description": "Interactive team workshop to improve workplace communication culture and reduce conflict.",
    "brand": {
      "@type": "Brand",
      "name": "GreenElephant"
    },
    "offers": {
      "@type": "Offer",
      "price": "1200",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    }
  }
};
