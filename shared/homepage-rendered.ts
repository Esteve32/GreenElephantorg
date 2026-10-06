import source from './homepage-content.json';
import { renderCommunicationConnections } from './communication-connections';
import { localPage } from './site-language';
import { COACHING_PAGES, escapeCopy } from './coaching-pages';

export type HomepageLanguage = 'en' | 'fr';

export const HOMEPAGE_HERO = {
  en: {
    eyebrow: 'AI training built for beginners',
    headline: 'Start using AI without becoming an AI expert.',
    promise: 'AI literacy means knowing when to use AI, how to check its answers, and when not to use it. Practise chats and workflows. Explore agents and teamwork.',
    cta: 'Discuss your training needs',
    ctaNote: 'A discovery call with Estève.',
    explore: 'Explore the four ACX levels',
    stages: 'Chat · Workflow · Agent · Teamwork',
  },
  fr: {
    eyebrow: 'Une formation à l’IA conçue pour les débutants',
    headline: 'Utilisez l’IA sans devoir devenir expert.',
    promise: 'Comprendre l’IA, c’est savoir quand l’utiliser, comment vérifier ses réponses et quand s’en passer. Exercez-vous à dialoguer avec l’IA et à relier des tâches. Découvrez les agents IA et le travail en équipe.',
    cta: 'Parlons de votre formation',
    ctaNote: 'Un appel découverte avec Estève.',
    explore: 'Découvrir les quatre niveaux ACX',
    stages: 'Dialoguer · Relier les étapes · Guider un agent · Travailler en équipe',
  },
} as const;

export const HOMEPAGE_ACX = {
  en: {
    eyebrow: 'Your AI starting point',
    title: 'Four ways to work with AI.',
    intro: 'Start with Chat. Add complexity only when your task needs it.',
    humanCheck: 'Human check',
    scope: 'Beginners practise ACX 1–2 first. The four-day journey adds guided ACX 3 practice and an ACX 4 overview.',
    guide: 'Read the four-level ACX guide',
    guidePath: '/blog/acx-levels-ai-literacy',
    levels: [
      { level: 'ACX 1', title: 'Chat', action: 'Ask for help, improve the request and check the answer.', check: 'You decide what is useful.' },
      { level: 'ACX 2', title: 'Workflow', action: 'Connect repeatable steps and pass work between tools.', check: 'You approve every handoff.' },
      { level: 'ACX 3', title: 'Agent', action: 'Give an AI agent a goal, limits and check-in points.', check: 'You review its progress and decisions.' },
      { level: 'ACX 4', title: 'Teamwork', action: 'Use AI across a team with clear roles and shared rules.', check: 'People own the final decisions.' },
    ],
  },
  fr: {
    eyebrow: 'Votre point de départ avec l’IA',
    title: 'Quatre façons de travailler avec l’IA.',
    intro: 'Commencez par dialoguer avec l’IA. Passez aux autres niveaux seulement si votre tâche le demande.',
    humanCheck: 'Vérification humaine',
    scope: 'Les débutants pratiquent d’abord les niveaux ACX 1 et 2. Le parcours de quatre jours ajoute une pratique guidée au niveau 3 et un aperçu du niveau 4.',
    guide: 'Lire le guide des quatre niveaux ACX',
    guidePath: '/fr/blog/acx-levels-ai-literacy',
    levels: [
      { level: 'ACX 1', title: 'Dialoguer avec l’IA', action: 'Demandez de l’aide, précisez votre demande et vérifiez la réponse.', check: 'Vous décidez de ce qui est utile.' },
      { level: 'ACX 2', title: 'Relier les étapes', action: 'Enchaînez des tâches et faites passer le travail d’un outil à l’autre.', check: 'Vous validez ce qui est transmis à chaque étape.' },
      { level: 'ACX 3', title: 'Guider un agent IA', action: 'Un agent IA peut enchaîner des tâches pour atteindre un objectif. Fixez ses limites et les moments de vérification.', check: 'Vous vérifiez son travail et ses décisions.' },
      { level: 'ACX 4', title: 'Travailler en équipe', action: 'Utilisez l’IA en équipe avec des rôles et des règles clairs.', check: 'Les décisions finales restent humaines.' },
    ],
  },
} as const;

export const HOMEPAGE_PATHS = {
  en: {
    eyebrow: 'Begin with something useful',
    title: 'Choose your starting point.',
    intro: 'Choose a task that matters to your work or life.',
    action: 'Explore this coaching path',
    items: [
      { audience: 'For researchers, educators and makers', title: 'An archive worth sharing', text: 'Make a start on a book or learning material from work you have collected.', path: '/ai-coaching/lifetime-archive' },
      { audience: 'For career changers and entrepreneurs', title: 'A new business idea', text: 'Explore an idea and choose a practical next test.', path: '/ai-coaching/next-chapter-business' },
      { audience: 'For adults starting with AI', title: 'Everyday AI confidence', text: 'Learn through useful tasks from your own life.', path: '/ai-coaching/everyday-confidence' },
      { audience: 'For facilitators, coaches and learning designers', title: 'Facilitation and coaching', text: 'Prepare and follow through while keeping your attention on people.', path: '/ai-coaching/facilitators-and-coaches' },
      { audience: 'For experienced specialists and workplace teams', title: 'AI in your professional work', text: 'Practise with tasks you understand and tools your workplace allows.', path: '/ai-coaching/experienced-specialists' },
    ],
  },
  fr: {
    eyebrow: 'Commencez par quelque chose d’utile',
    title: 'Choisissez votre point de départ.',
    intro: 'Choisissez une tâche qui compte pour vous. Les pages détaillées en français sont en préparation.',
    action: 'Découvrir ce parcours · Page en anglais',
    items: [
      { audience: 'Pour les chercheurs, pédagogues et créateurs', title: 'Des archives à transmettre', text: 'Commencez un livre ou un support pédagogique à partir de travaux déjà rassemblés.' },
      { audience: 'Pour les personnes en transition et les entrepreneurs', title: 'Une nouvelle idée d’activité', text: 'Explorez une idée et choisissez un prochain test concret.' },
      { audience: 'Pour les adultes qui débutent avec l’IA', title: 'Plus d’aisance avec l’IA au quotidien', text: 'Apprenez avec des tâches utiles tirées de votre quotidien.' },
      { audience: 'Pour les facilitateurs, coachs et concepteurs pédagogiques', title: 'Facilitation et coaching', text: 'Préparez et assurez le suivi tout en gardant votre attention sur les personnes.' },
      { audience: 'Pour les spécialistes expérimentés et les équipes', title: 'L’IA dans votre travail', text: 'Exercez-vous avec des tâches que vous maîtrisez et les outils autorisés au travail.' },
    ],
  },
} as const;

export const HOMEPAGE_METHOD = {
  en: {
    eyebrow: 'The People-and-AI method',
    title: 'Four human actions keep AI useful.',
    intro: 'Use these four checks at every ACX level.',
    actions: [
      { title: 'Clarify your goal', text: 'Name the task, the audience and the useful result before you ask AI.', example: 'Draft a clear email to explain a delay.' },
      { title: 'Set the boundaries', text: 'Give relevant context. Decide what information and tools AI may use.', example: 'Use made-up names. Ask for a draft, not a sent email.' },
      { title: 'Check the work', text: 'Verify important claims, meaning and tone. Ask what may be missing.', example: 'Check the dates, the explanation and any promises.' },
      { title: 'Make the decision', text: 'Choose what to keep, who sees it and what happens next.', example: 'Edit it, choose the recipients and send it yourself.' },
    ],
    exampleLabel: 'For an email',
    linksLabel: 'Explore the supporting tools',
    links: [
      { title: 'Periodic Table of Conscious Communication', text: 'Explore the human communication skills behind the method.', path: '/periodic-table' },
      { title: 'Satellite Scan', text: 'Reflect on your communication patterns before you practise.', path: '/scan' },
    ],
  },
  fr: {
    eyebrow: 'La méthode Personnes et IA',
    title: 'Quatre réflexes pour bien utiliser l’IA.',
    intro: 'Gardez ces quatre repères à chaque niveau ACX.',
    actions: [
      { title: 'Clarifiez votre objectif', text: 'Nommez la tâche, le public et le résultat utile avant de solliciter l’IA.', example: 'Préparez un courriel clair pour expliquer un retard.' },
      { title: 'Fixez les limites', text: 'Donnez le contexte utile. Décidez quelles informations et quels outils l’IA peut utiliser.', example: 'Utilisez des noms fictifs. Demandez un brouillon, pas un envoi.' },
      { title: 'Vérifiez le travail', text: 'Contrôlez les affirmations importantes, le sens et le ton. Cherchez ce qui pourrait manquer.', example: 'Vérifiez les dates, l’explication et les engagements.' },
      { title: 'Prenez la décision', text: 'Choisissez ce que vous gardez, qui peut le voir et ce qui se passe ensuite.', example: 'Corrigez le texte, choisissez les destinataires et envoyez-le vous-même.' },
    ],
    exampleLabel: 'Pour un courriel',
    linksLabel: 'Découvrir les outils complémentaires',
    links: [
      { title: 'Tableau périodique de la communication consciente (en anglais)', text: 'Explorez les compétences humaines qui soutiennent la méthode.', path: '/periodic-table' },
      { title: 'Satellite Scan', text: 'Observez vos habitudes de communication avant de vous exercer.', path: '/fr/scan' },
    ],
  },
} as const;

export const HOMEPAGE_PEOPLE = {
  en: {
    title: 'People you can learn with.',
    intro: 'Three coaches bring AI, communication and conflict expertise for independent professionals, coaches, facilitators, experienced specialists and teams.',
  },
  fr: {
    title: 'Des personnes pour vous accompagner.',
    intro: 'Trois coachs réunissent des compétences en IA, en communication et en gestion des conflits pour les professionnels indépendants, les coachs, les facilitateurs, les spécialistes expérimentés et les équipes.',
  },
} as const;

const DISCOVERY_URL = 'https://calendly.com/greenelephant/free-ai-literacy-discovery-call';

function renderHero(language: HomepageLanguage): string {
  const copy = HOMEPAGE_HERO[language];
  const headlineBreak = language === 'en'
    ? 'Start using AI<br><em>without becoming an AI expert.</em>'
    : 'Utilisez l’IA<br><em>sans devoir devenir expert.</em>';
  const captions = HOMEPAGE_PATHS[language].items;
  const slides = COACHING_PAGES.map((page, i) => `<img class="home-slide${i === 0 ? ' is-active' : ''}" ${i === 0 ? 'src' : 'data-src'}="/images/coaching/${page.slug}-hero-1280.jpg" ${i === 0 ? 'srcset' : 'data-srcset'}="/images/coaching/${page.slug}-hero-640.jpg 640w, /images/coaching/${page.slug}-hero-1280.jpg 1280w" sizes="100vw" width="1536" height="1024" alt="" aria-hidden="true" decoding="async" ${i === 0 ? 'fetchpriority="high"' : ''} data-caption="${escapeCopy(captions[i].title)}">`).join('');
  return `<section class="home-photo-hero" aria-labelledby="hero-title"><div class="home-carousel" role="region" aria-label="${language === 'fr' ? 'Cinq façons de commencer' : 'Five ways to begin'}">${slides}<div class="home-photo-heading wrap"><p class="eyebrow">${copy.eyebrow}</p><h1 id="hero-title">${headlineBreak}</h1></div></div><div class="wrap home-carousel-toolbar"><p class="home-scene-caption">01 / 05 · ${captions[0].title}</p><div class="home-carousel-controls" hidden><button type="button" data-carousel="previous" aria-label="${language === 'fr' ? 'Image précédente' : 'Previous image'}">←</button><button type="button" data-carousel="pause">${language === 'fr' ? 'Pause' : 'Pause'}</button><button type="button" data-carousel="next" aria-label="${language === 'fr' ? 'Image suivante' : 'Next image'}">→</button></div></div><div class="wrap hero home-hero-details"><div><p class="intro">${copy.promise}</p><a class="button" href="${DISCOVERY_URL}" target="_blank" rel="noopener">${copy.cta} <span aria-hidden="true">↗</span></a><p class="sub">${copy.ctaNote}</p><a class="descend" href="#acx-levels"><strong>${copy.explore}</strong><small>${copy.stages}</small><span aria-hidden="true">↓</span></a></div></div></section>`;
}

function renderAcx(language: HomepageLanguage): string {
  const copy = HOMEPAGE_ACX[language];
  const cards = copy.levels.map((level, index) => `<li class="acx-card"><a href="${copy.guidePath}#acx-${index + 1}"><span class="acx-card-icon"><img src="/images/acx/acx-${index + 1}-outline.svg" width="96" height="96" alt="" aria-hidden="true"></span><span class="acx-card-level">${level.level}</span><h3>${level.title}</h3><p>${level.action}</p><p class="acx-human-check"><strong>${copy.humanCheck}:</strong> ${level.check}</p></a></li>`).join('');
  return `<section class="acx-overview section" id="acx-levels" aria-labelledby="acx-title"><div class="wrap"><div class="acx-overview-intro"><p class="eyebrow">${copy.eyebrow}</p><h2 id="acx-title">${copy.title}</h2><p>${copy.intro}</p></div><ol class="acx-card-grid">${cards}</ol><div class="acx-overview-foot"><p>${copy.scope}</p><a class="text-link" href="${copy.guidePath}">${copy.guide} →</a></div></div></section>`;
}

function renderPaths(language: HomepageLanguage): string {
  const copy = HOMEPAGE_PATHS[language];
  const cards = copy.items.map((item, index) => {
    const page = COACHING_PAGES[index];
    const photo = `<img class="path-photo" src="/images/coaching/${page.slug}-hero-640.jpg" width="640" height="427" loading="lazy" decoding="async" alt="" aria-hidden="true">`;
    const content = `${photo}<span class="path-number" aria-hidden="true">0${index + 1}</span><div class="path-copy"><p class="path-audience">${item.audience}</p><h3>${item.title}</h3><p class="path-description">${item.text}</p><span class="path-action">${copy.action} <span aria-hidden="true">→</span></span></div>`;
    return `<li class="starting-path"><a href="/ai-coaching/${page.slug}"${language === 'fr' ? ' hreflang="en"' : ''}>${content}</a></li>`;
  }).join('');
  return `<section class="starting-points section" id="coaching-paths" aria-labelledby="starting-points-title"><div class="wrap"><div class="starting-points-intro"><p class="eyebrow">${copy.eyebrow}</p><h2 id="starting-points-title">${copy.title}</h2><p>${copy.intro}</p></div><ol class="starting-path-grid">${cards}</ol></div></section>`;
}

function renderMethod(language: HomepageLanguage): string {
  const copy = HOMEPAGE_METHOD[language];
  // These cues describe human checks at every ACX level, not ACX levels 1–4.
  const symbols = [
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    '<rect x="3" y="3" width="18" height="18" rx="3" stroke-dasharray="3 3"/><path d="M8 12h8m-4-4v8"/>',
    '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5m-14-10 2 2 4-4"/>',
    '<circle cx="12" cy="12" r="9"/><path d="m7.5 12 3 3 6-6"/>',
  ];
  const actions = copy.actions.map((action, index) => `<li><div class="method-action-cue"><span class="method-action-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${symbols[index]}</svg></span><span class="method-action-number" aria-hidden="true">0${index + 1}</span></div><h3>${action.title}</h3><p>${action.text}</p><div class="method-action-example"><span>${copy.exampleLabel}</span><p>${action.example}</p></div></li>`).join('');
  const links = copy.links.map(link => `<a href="${link.path}"><strong>${link.title}</strong><span>${link.text}</span><span class="method-link-arrow" aria-hidden="true">→</span></a>`).join('');
  return `<section id="approach" class="method method-practical section" aria-labelledby="method-title"><div class="wrap"><div class="method-practical-intro"><p class="eyebrow">${copy.eyebrow}</p><h2 id="method-title">${copy.title}</h2><p>${copy.intro}</p></div><ol class="method-action-grid">${actions}</ol>${renderCommunicationConnections(language, 'home-connections')}<nav class="method-resource-links" aria-label="${copy.linksLabel}">${links}</nav></div></section>`;
}

function renderPeopleIntro(language: HomepageLanguage): string {
  const copy = HOMEPAGE_PEOPLE[language];
  return `<div class="people-intro"><h2 id="about-title">${copy.title}</h2><p>${copy.intro}</p></div>`;
}

function section(sourceHtml: string, pattern: RegExp, label: string): string {
  const match = sourceHtml.match(pattern);
  if (!match) throw new Error(`Homepage ${label} section missing`);
  return match[0];
}

function renderMain(language: HomepageLanguage): string {
  const main = source[language].main.replace('<div class="journey-line" aria-hidden="true"></div>', '');
  const withHero = main.replace(/<section class="wrap hero"[\s\S]*?<\/section>/, renderHero(language));
  if (withHero === main) throw new Error(`Homepage hero marker missing for ${language}`);
  const withoutOldAcx = withHero.replace(/\n?<details class="explain" id="acx-levels">[\s\S]*?<\/details>/, '');
  if (withoutOldAcx === withHero) throw new Error(`Old homepage ACX marker missing for ${language}`);
  const trainingSource = section(withoutOldAcx, /<section id="training"[\s\S]*?<\/section>/, 'training');
  section(withoutOldAcx, /<section id="approach"[\s\S]*?<\/section>/, 'approach');
  const aboutSource = section(withoutOldAcx, /<section id="about"[\s\S]*?<\/section>/, 'about');
  const faq = section(withoutOldAcx, /<section class="faq section"[\s\S]*?<\/section>/, 'FAQ');
  const testimonial = section(trainingSource, /<article class="testimonial"[\s\S]*?<\/article>/, 'testimonial');
  const training = trainingSource
    .replace(/\n?<div class="coaching-paths"[\s\S]*?<\/div>/, '')
    .replace(testimonial, '');
  const aboutWithIntro = aboutSource.replace(/<div class="people-intro">[\s\S]*?<\/div>/, renderPeopleIntro(language));
  if (aboutWithIntro === aboutSource) throw new Error(`Homepage people intro marker missing for ${language}`);
  const proof = `<section id="maeva" class="home-proof section" aria-label="${language === 'fr' ? 'Le témoignage de Maeva' : 'Maeva’s experience'}"><div class="wrap">${testimonial}</div></section>`;
  const about = aboutWithIntro;
  const trainingStart = withoutOldAcx.indexOf(trainingSource);
  if (trainingStart < 0) throw new Error(`Homepage training position missing for ${language}`);
  const opening = withoutOldAcx.slice(0, trainingStart)
    .replace(/<div class="wrap audience">[\s\S]*?<\/div>/, '');
  return `${opening}${renderAcx(language)}\n${renderPaths(language)}\n${renderMethod(language)}\n${proof}\n${about}\n${training}\n${faq}`;
}

function renderFooter(language: HomepageLanguage): string {
  const fr = language === 'fr';
  const headings = fr
    ? ['Découvrir les formations', 'Essayer les outils', 'Comprendre votre communication', 'Explorer les autres accompagnements', 'Rencontrer l’équipe', 'Consulter nos engagements']
    : ['Explore AI training', 'Try the tools', 'Understand your communication', 'Explore other coaching', 'Meet the people', 'Read our policies'];
  const labels: Record<string, string> = fr ? {
    '/fr#training': 'Apprendre l’IA · les deux formats',
    '/periodic-table': 'Explorer les compétences de communication — Tableau périodique',
    '/flow-check': 'Faire le point sur une situation — Flow Check',
    '/signals': 'Repérer les habitudes de communication — Signals',
    '/decode': 'Explorer des exemples de discours — Speech Lab',
    '/resources#prompts': 'Exemples de demandes à l’IA — Bibliothèque de prompts',
    '/resources': 'Toutes les ressources de communication',
    '/fr/scan': 'Votre bilan personnel — Satellite Scan',
    '/programs': 'Tous les programmes de communication',
    '/programs#interview-coaching': 'Détails du programme de préparation aux entretiens',
    '/interview-coaching': 'Page du coaching pour les entretiens',
    '/connect#references': 'Témoignages et références',
    '/connect#team': 'Rencontrer l’équipe',
    '/connect': 'Présentation et contact',
  } : {
    '/#training': 'Learn AI · compare the two formats',
    '/periodic-table': 'Explore communication skills — Periodic Table',
    '/flow-check': 'Reflect on a situation — Flow Check',
    '/signals': 'Recognise communication patterns — Signals',
    '/decode': 'Explore speech examples — Speech Lab',
    '/resources#prompts': 'Example requests for AI — Prompt Library',
    '/resources': 'All communication resources',
    '/scan': 'Your personal reflection — Satellite Scan',
    '/programs': 'All communication programmes',
    '/programs#interview-coaching': 'Interview programme details',
    '/interview-coaching': 'Interview coaching page',
    '/connect#references': 'Testimonials & references',
    '/connect#team': 'Meet the team',
    '/connect': 'About us & contact',
  };
  // Lucide BookOpen / Lightbulb / MessageSquare / Users / Briefcase geometry.
  // Static markup avoids shipping React's server renderer in the shared footer.
  const icons = [
    '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6M10 22h4"/>',
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
  ];
  const links = HOMEPAGE_PATHS[language].items.map((item, index) => {
    return `<li><a href="/ai-coaching/${COACHING_PAGES[index].slug}"${fr ? ' hreflang="en"' : ''}>${escapeCopy(item.title)}${fr ? '<span class="footer-language">Page en anglais</span>' : ''}</a></li>`;
  }).join('');
  const group = `<div class="footer-group footer-coaching"><h3 id="footer-coaching-title">${fr ? 'Choisir votre projet IA' : 'Choose your AI project'}</h3><p>${fr ? 'Cinq façons d’apprendre par la pratique.' : 'Five ways to learn through practice.'}</p><ul aria-labelledby="footer-coaching-title">${links}</ul></div>`;
  // Keep every existing destination. The new group stays open at every width.
  const prepared = source[language].footer
    .replace(/<h3 id="footer-group-(\d)">[^<]*<\/h3>/g, (_, index) => `<h3 id="footer-group-${index}">${escapeCopy(headings[Number(index)])}</h3>`)
    .replace(/<a([^>]*href="([^"]+)"[^>]*)>([\s\S]*?)<\/a>/g, (link, attrs, href, oldLabel) => {
      if (!labels[href]) return link;
      const languageBadge = oldLabel.match(/<span aria-label="en anglais">[\s\S]*?<\/span>/)?.[0];
      return `<a${attrs}>${escapeCopy(labels[href])}${languageBadge ? ` ${languageBadge}` : ''}</a>`;
    })
    .replace(/(<h3 id="footer-group-2">[^<]*<\/h3>)/, `$1<p class="footer-group-note">${fr ? 'Une réflexion personnelle et un tableau de bord préparé par un coach. Questionnaire en anglais.' : 'Personal reflection with a coach-prepared dashboard. Questionnaire in English.'}</p>`)
    .replaceAll(' lang="en"', ' hreflang="en"')
    .replace(/<a([^>]*href="(\/(?:privacy|ai-policy|terms|cookies))"[^>]*)>([\s\S]*?)<\/a>/g, (link, attrs, path, label) => {
      if (!fr) return link;
      return `<a${attrs.replace(`href="${path}"`, `href="${localPage(path, language)}"`).replace(' hreflang="en"', '')}>${label.replace(/\s*<span aria-label="en anglais">[\s\S]*?<\/span>/, '')}</a>`;
    });
  const groups = Array.from(prepared.matchAll(/<div class="footer-group">[\s\S]*?<\/div>/g)).map(match => match[0]);
  if (groups.length !== 6) throw new Error('Expected six retained footer groups');
  groups.splice(1, 0, group);
  const bottom = prepared.match(/<div class="footer-bottom">([\s\S]*?)<\/div>/)?.[1];
  if (!bottom) throw new Error('Footer account and social links missing');
  Array.from(bottom.matchAll(/<nav[^>]*>([\s\S]*?)<\/nav>/g)).forEach((match, i) => {
    const title = fr ? ['Suivre et échanger', 'Accéder à votre compte'][i] : ['Follow & connect', 'Access your account'][i];
    const items = Array.from(match[1].matchAll(/<a\b[\s\S]*?<\/a>/g)).map(a => {
      if (a[0].includes('commission.europa.eu/')) {
        groups[6] = groups[6].replace('</ul>', `<li>${a[0]}</li></ul>`);
        return '';
      }
      return `<li>${a[0]}</li>`;
    }).join('');
    groups.push(`<div class="footer-group"><h3 id="footer-extra-${i}">${title}</h3><ul aria-labelledby="footer-extra-${i}">${items}</ul></div>`);
  });
  const mapPaths = [icons[0], icons[1], '<path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="9"/>', '<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6z"/>', icons[4], icons[3], '<path d="m12 3 8 4v5c0 5-8 9-8 9s-8-4-8-9V7z"/><path d="m8 12 3 3 5-6"/>', icons[2], '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'];
  const nodes = groups.map((html, i) => html.replace(/(<h3[^>]*>)/, `$1<span class="footer-node-icon" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" focusable="false">${mapPaths[i]}</svg></span>`)).join('');
  return `<footer id="site-footer" class="footer-map"><div class="wrap"><div class="footer-map-root"><p>Green Elephant</p><h2 id="footer-map-title">${fr ? 'Plan du site' : 'Sitemap'}</h2><p>${fr ? 'La carte des pages du site. Choisissez une branche pour trouver ce qui vous aide.' : 'A map of the website. Choose a branch to find what you need.'}</p></div><nav class="footer-sitemap" aria-labelledby="footer-map-title">${nodes}</nav><p class="footer-copyright">© 2026 Green Elephant</p></div></footer>`;
}

export const homepage = {
  en: { ...source.en, main: renderMain('en'), footer: renderFooter('en') },
  fr: { ...source.fr, main: renderMain('fr'), footer: renderFooter('fr') },
};
