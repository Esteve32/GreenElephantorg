import { FRENCH_ROUTES, basePagePath, localPage, hasFrenchPage } from "./site-language";
import { POLICY_PAGES, isPolicyPath } from './policy-pages';
import { ACX_ARTICLE_FR } from "./acx-article-fr";
import { ACX_ARTICLE } from "./acx-article";
import { isParkedWebinar } from "./site-features";
import { COACHING_PAGES, coachingPath } from './coaching-pages';
// Existing public copy moved here unchanged, except invalid canonical paths.
// This is HTTP metadata for current routes, not the future AI-literacy sitemap.
export const SITE_ORIGIN = "https://greenelephant.org";
export const DEFAULT_SOCIAL_IMAGE = "/ge-logo-512.png";
export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  ogType?: "website" | "article" | "product";
  ogImage?: string;
  noIndex?: boolean;
}
export const PAGE_METADATA: Record<string, PageMetadata> = {
  ...Object.fromEntries(COACHING_PAGES.map(page => [coachingPath(page.slug), { title: page.title, description: page.description, canonicalPath: coachingPath(page.slug), ogImage: page.image }])),
  [ACX_ARTICLE.path]: { title: ACX_ARTICLE.title, description: ACX_ARTICLE.description, canonicalPath: ACX_ARTICLE.path, ogType: "article" },
  "/": {
    "title": "Human-centred AI Literacy Training | GreenElephant",
    "description": "Hands-on AI literacy training for independent professionals and teams. Build human skills, practise with AI and stay in charge. Workshops and small-group coaching.",
    "keywords": "AI literacy training, human-centred AI, AI training for beginners, practical AI coaching, AI workshops, conscious communication",
    "canonicalPath": "/"
  },
  "/scan": {
    "title": "Satellite Scan | Help AI Communicate More Like You",
    "description": "Understand your communication habits. Use your personal Scan dashboard, prompts and practice materials to guide AI in your own voice. €99.95. Coaching booked separately.",
    "keywords": "Satellite Scan, AI literacy, communication habits, personal communication, AI prompts, conscious communication",
    "canonicalPath": "/scan"
  },
  "/programs": {
    "title": "Coaching Programs for EAs, CEOs & Leaders | GreenElephant",
    "description": "Executive communication programs for Executive Assistants, CEOs, and leaders. EA coaching, interview preparation, and leadership development. Find your path to communication mastery.",
    "keywords": "personal development coaching, career change coaching, career transition program, emotional intelligence training, self-awareness coaching, executive assistant coaching program, CEO leadership program, EA training, interview coaching, executive presence training, leadership communication development, future-proof career skills",
    "canonicalPath": "/programs"
  },
  "/signals": {
    "title": "Communication Drift Check | Everyday Conversations",
    "description": "Reflect on six everyday communication situations. Notice drift between intention and words, with practical links to self-reflection, people and AI requests.",
    "keywords": "communication quiz, communication assessment, communication drift, blind spots, ego patterns, conflict patterns, self-awareness quiz",
    "canonicalPath": "/signals"
  },
  "/periodic-table": {
    "title": "Periodic Table of Conscious Communication | 146 Elements | GreenElephant",
    "description": "Explore 146 communication elements across eight lenses. Choose a practical prompt to prepare a conversation, clarify an AI request and review the result.",
    "canonicalPath": "/periodic-table",
    "keywords": "periodic table of communication, conscious communication framework, emotional intelligence framework, personal development tools, self-awareness micro-habits, 146 communication elements, 8 lenses, communication micro-habits, NVC, nonviolent communication, behavioural change tools, communication self-improvement"
  },
  "/retreats": {
    "title": "Equinoxe Communication Retreats | Finland & Provence | GreenElephant",
    "description": "Transform how you see conflict in 5-day immersive retreats in Levi, Finland or Provence, France. Practice microhabits, build trust, and return home with a personalized playbook. Limited to 12-14 participants.",
    "canonicalPath": "/retreats",
    "keywords": "communication retreat, equinoxe retreat, Finland retreat, Provence retreat, conflict resolution retreat, conscious communication immersive, microhabit retreat"
  },
  "/coaching": {
    "title": "Executive Coaching & Leadership Communication | 1:1 & Team Sessions",
    "description": "Executive coaching for CEOs, Executive Assistants, and leaders. From €295 single sessions to 6-month Coaching Journeys. Build executive presence, team alignment, and conscious communication habits.",
    "keywords": "emotional intelligence coaching, self-awareness coaching, personal development coach, career change coaching, career transition support, CEO executive coaching, executive assistant coaching, leadership coaching, executive presence communication, team alignment coaching, communication habit coaching, conflict resolution for leaders, EQ coach, future-proof career, resilience coaching, social intelligence development, personal growth coaching, leadership development, ethical personal development, AI-assisted communication coaching",
    "canonicalPath": "/coaching"
  },
  "/resources": {
      "title": "AI Practice Resources | Communication Prompts & Videos | GreenElephant",
      "description": "Explore communication prompts, teaching videos and infographics. Prepare a real task, give AI clearer instructions and check the result. Start without a Scan.",
      "canonicalPath": "/resources",
      "keywords": "AI literacy resources, communication prompts, AI practice, conscious communication videos"
  },
  "/connect": {
    "title": "Contact & Connect | GreenElephant",
    "description": "Connect with the GreenElephant team for coaching, consulting, or collaboration. Meet our coaches, explore client references, and send us a message. We respond within 24 hours with genuine human presence.",
    "canonicalPath": "/connect",
    "keywords": "contact GreenElephant, communication coaching contact, consulting inquiry, connect with coaches, client references"
  },
  "/calendar": {
    "title": "Events & Calendar | GreenElephant",
    "description": "Explore the GreenElephant online coaching calendar with monthly and seasonal themed webinars following the 8 lenses of conscious communication. Join live practice sessions and community events.",
    "canonicalPath": "/calendar",
    "keywords": "communication webinars, online coaching calendar, seasonal practice, 8 lenses calendar, communication events, live practice sessions"
  },
  "/interview-coaching": {
    "title": "Interview Mastery Bundle | Data-Driven Interview Coaching",
    "description": "Ace your next interview with personalized coaching combining Satellite Scan diagnostics and expert guidance. For professionals 40+ seeking to communicate confidence in high-stakes career conversations.",
    "keywords": "career change interview coaching, career pivot communication, career transition preparation, interview coaching, career coaching, communication skills, executive interview preparation, job interview confidence, communication patterns, self-awareness for interviews, emotional intelligence in interviews, career reinvention",
    "canonicalPath": "/interview-coaching"
  },
  "/privacy": {
    "title": "Privacy Policy | GreenElephant",
    "description": "GreenElephant's privacy policy. Learn how we collect and use your personal data, which providers support the service, and how to contact us about your rights.",
    "canonicalPath": "/privacy",
    "keywords": "privacy policy, GDPR, data protection, GreenElephant privacy, ACX100, AI ethics"
  },
  "/terms": {
    "title": "Terms of Service | GreenElephant",
    "description": "GreenElephant's terms of service covering coaching, retreats, and consulting agreements. Clear terms for conscious relationships.",
    "canonicalPath": "/terms",
    "keywords": "terms of service, GreenElephant terms, coaching terms, retreat terms"
  },
  "/cookies": {
    "title": "Cookie Policy | GreenElephant",
    "description": "GreenElephant's cookie policy. Learn which cookies we use and how to manage your preferences. Only essential cookies by default.",
    "canonicalPath": "/cookies",
    "keywords": "cookie policy, cookies, GreenElephant cookies, cookie management"
  },
  "/ai-policy": {
    "title": "AI Ethics & Transparency Policy | GreenElephant",
    "description": "GreenElephant's AI ethics and transparency policy. Learn how we use AI to augment human connection while maintaining data privacy, consent, and ethical standards.",
    "canonicalPath": "/ai-policy",
    "keywords": "AI policy, AI ethics, AI transparency, responsible AI, GreenElephant AI policy"
  },
  "/for-executive-assistants": {
    "title": "Communication Training for Executive Assistants | Satellite Scan",
    "description": "Communication assessment designed for Executive Assistants. Map your managing up patterns, stakeholder dynamics, and boundary-setting across 8 lenses. €99.95 with personalized insights.",
    "keywords": "executive assistant communication training, EA professional development, managing up communication, assistant leadership communication, executive assistant coaching, EA training program, virtual assistant skills",
    "canonicalPath": "/for-executive-assistants"
  },
  "/for-ceos": {
    "title": "CEO Communication Coaching | Leadership Communication Assessment",
    "description": "Communication diagnostic for CEOs and executives. Map your leadership patterns across Influence, Alignment, and team dynamics. Data-driven insights for executive presence. €99.95.",
    "keywords": "CEO communication coaching, executive communication assessment, leadership communication, executive presence training, CEO leadership development, team alignment diagnostic, executive coaching tools",
    "canonicalPath": "/for-ceos"
  },
  "/for-virtual-assistants": {
    "title": "Communication Training for Virtual Assistants | Satellite Scan",
    "description": "Communication assessment designed for Virtual Assistants. Map your async communication patterns, client boundary-setting, and remote relationship building across 8 lenses. €99.95 with personalized insights.",
    "keywords": "virtual assistant communication training, VA professional development, remote communication skills, virtual assistant coaching, freelance VA training, online assistant skills, async communication mastery",
    "canonicalPath": "/for-virtual-assistants"
  },
  "/executive-coaching-assessment": {
    "title": "Executive Coaching Assessment | Communication Diagnostic for Leaders",
    "description": "Data-driven communication assessment for executive coaching. Establish a baseline, track progress, and accelerate your coaching journey. 8 lenses, 129 questions. €99.95.",
    "keywords": "executive coaching assessment, leadership coaching tool, communication diagnostic for coaches, executive development assessment, coaching baseline assessment, leadership communication evaluation",
    "canonicalPath": "/executive-coaching-assessment"
  },
  "/webinars": {
    "title": "Monthly Lens Webinars | GreenElephant",
    "description": "One lens. One hour. Real conversations. Join our monthly live webinars on conscious communication. Free guest access. Mic-and-camera access for Satellite Scan holders.",
    "canonicalPath": "/webinars",
    "keywords": "conscious communication webinar, GreenBlueRed webinar, communication training online, live communication coaching"
  },
  "/flow-check": {
    "title": "Flow Check | Communication Reflection | Green Elephant",
    "description": "Reflect on motivation, challenge and competence in one communication situation. Use three ratings to choose a practical next step.",
    "canonicalPath": "/flow-check",
    "keywords": "communication reflection, Flow Check, motivation, perceived challenge, perceived competence, conscious communication"
  },
  "/decode": {
      "title": "Speech Lab | Communication Practice for AI Writing | GreenElephant",
      "description": "Explore colour-annotated speeches by Mandela, JFK and Obama. Practise audience, context and action, then use those habits to brief AI and check a draft.",
      "canonicalPath": "/decode",
      "keywords": "Speech Lab, GreenBlueRed, communication practice, AI writing, AI literacy"
  }
};

export const REGISTERED_PAGE_PATHS = [
  "/",
  "/fr",
  "/fr/scan",
  "/fr/blog/acx-levels-ai-literacy",
  "/fr/checkout",
  "/fr/payment-success",
  "/scan",
  "/ai-coaching/lifetime-archive",
  "/ai-coaching/next-chapter-business",
  "/ai-coaching/everyday-confidence",
  "/ai-coaching/facilitators-and-coaches",
  "/ai-coaching/experienced-specialists",
  "/programs",
  "/blog/acx-levels-ai-literacy",
  "/myfive",
  "/myfive/dashboard",
  "/myfive/check-in",
  "/myfive/agreements",
  "/myfive/settings",
  "/myfive/subscription/success",
  "/myfive/invite/:token",
  "/what-is-conscious-communication",
  "/signals",
  "/choose-your-path",
  "/periodic-table",
  "/retreats",
  "/coaching",
  "/consulting",
  "/resources",
  "/prompts",
  "/stories",
  "/connect",
  "/team",
  "/references",
  "/contact",
  "/calendar",
  "/interview-coaching",
  "/satellitescan",
  "/checkout",
  "/payment-success",
  "/fr/privacy",
  "/fr/ai-policy",
  "/fr/terms",
  "/fr/cookies",
  "/privacy",
  "/terms",
  "/cookies",
  "/ai-policy",
  "/admin/login",
  "/admin/submissions",
  "/admin",
  "/dashboard",
  "/for-executive-assistants",
  "/for-ceos",
  "/for-virtual-assistants",
  "/executive-coaching-assessment",
  "/webinar",
  "/webinars",
  "/flow-check",
  "/decode",
  "/decoding",
  "/admin/scan-results",
  "/admin/email-control-room",
  "/admin/webinar-sessions",
  "/admin/calendar-events",
  "/admin/social-media",
  "/admin/integrations",
  "/admin/content-lab",
  "/admin/prompt-generator",
  "/admin/linkedin-setup",
  "/admin/gdpr-controls",
  "/admin/testimonials",
  "/admin/backlinks",
  "/admin/seo",
  "/admin/webinar-settings",
  "/admin/coupons",
  "/admin/access-control",
  "/admin/coaching-cockpit",
  "/admin/debriefing",
  "/admin/calendly-setup",
  "/admin/analytics",
  "/admin/saas-settings",
  "/admin/ai-tools",
  "/admin/research-flywheel",
  "/admin/qr-command-center",
  "/portal/login",
  "/portal/forgot-password",
  "/portal/reset-password",
  "/portal/settings",
  "/portal/playground",
  "/portal"
] as const;

// Only aliases already registered by the client router; no new destinations.
export const EXISTING_REDIRECTS: Record<string, string> = {
  "/what-is-conscious-communication": "/scan",
  "/choose-your-path": "/scan",
  "/consulting": "/programs",
  "/stories": "/connect",
  "/team": "/connect",
  "/references": "/connect",
  "/contact": "/connect",
  "/satellitescan": "/scan",
  "/admin": "/admin/login",
  "/decoding": "/decode"
};

export function normalizePagePath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

export function isRegisteredPage(pathname: string): boolean {
  const path = normalizePagePath(pathname);
  return REGISTERED_PAGE_PATHS.some(pattern => {
    const a = pattern.split("/");
    const b = path.split("/");
    return a.length === b.length && a.every((part, i) =>
      part.startsWith(":") ? b[i].length > 0 : part === b[i]);
  });
}

export function isPrivatePage(path: string): boolean {
  path = basePagePath(path);
  return ["/admin", "/portal", "/checkout", "/payment-success", "/dashboard"]
    .some(prefix => path === prefix || path.startsWith(prefix + "/"));
}

export function pageMetadata(pathname: string): PageMetadata {
  const path = normalizePagePath(pathname);
  const base = basePagePath(path);
  if (isPolicyPath(base) && (!path.startsWith('/fr/') || hasFrenchPage(path))) {
    const language = path.startsWith('/fr/') ? 'fr' : 'en';
    const copy = POLICY_PAGES[language][base];
    return { title: copy.title + ' | GreenElephant', description: copy.description, canonicalPath: localPage(base, language) };
  }
  if ((path === '/fr' || path.startsWith('/fr/')) && hasFrenchPage(path)) {
    const base = basePagePath(path);
    const copy = base === '/' ? {
      title: 'Formation IA centrée sur l’humain | GreenElephant',
      description: 'Apprenez à utiliser l’IA tout en gardant votre jugement. Ateliers et parcours pratiques pour les indépendants et les équipes.'
    } : base === '/scan' ? {
      title: 'Satellite Scan : aidez l’IA à communiquer à votre manière',
      description: 'Un bilan personnel, des consignes pour l’IA et un tableau de bord préparé par un coach. 99,95 €. Questionnaire et vidéos en anglais.'
    } : base === ACX_ARTICLE.path ? {
      title: ACX_ARTICLE_FR.title, description: ACX_ARTICLE_FR.description, ogType: 'article' as const
    } : { title: 'Votre commande | GreenElephant', description: 'Achat et prochaines étapes du Satellite Scan.', noIndex: true };
    return { ...copy, canonicalPath: localPage(base, 'fr') };
  }
  if (isParkedWebinar(path)) return {
    title: "Webinars are currently paused | GreenElephant",
    description: "Webinars and the events calendar are currently paused.",
    canonicalPath: path, noIndex: true,
  };
  const target = path === "/prompts" ? "/resources" : EXISTING_REDIRECTS[path] ?? path;
  if (PAGE_METADATA[target]) return PAGE_METADATA[target];
  if (isPrivatePage(path)) return {
    title: "GreenElephant", description: "GreenElephant account access.",
    canonicalPath: path, noIndex: true,
  };
  // The webinar's dated metadata depends on client-fetched settings. Preserve
  // its existing evergreen title, without inventing an event date or duration.
  if (path === "/webinar") return {
    title: "Free Communication Webinar for EAs & Leaders | GreenElephant",
    description: "Learn to see, name and grow your communication superpowers with the Satellite Scan framework.",
    canonicalPath: path,
  };
  return { title: "Page Not Found | GreenElephant",
    description: "This page does not exist. Return to GreenElephant to explore conscious communication tools, coaching, and assessments.",
    noIndex: true };
}

export function fullPageTitle(title: string): string {
  return /Green\s?Elephant/.test(title) ? title : `${title} | GreenElephant`;
}
