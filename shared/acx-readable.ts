// One bilingual presentation layer for server HTML and the React article.
// The earlier authored sections remain the source for optional background.
import { escapeCopy as e } from './coaching-pages';
import { COMMUNICATION_CONNECTIONS, CONNECTION_CODES } from './communication-connections';

const copy = {
  en: {
    kicker: 'AI for beginners · A coffee-break guide',
    intro: 'Start with one useful conversation. Add tools or teamwork only when your task needs them.',
    byline: 'By Estève Pannetier · AI communication coach',
    start: 'Start with the four levels', enlarge: 'View the complete colour drawing',
    map: 'The four levels, at a glance',
    meaning: 'ACX is Estève’s map of four ways to work with AI. It is not a test or a ladder you must climb. You choose the goal, check the work and decide when to stop.',
    note: 'The original drawing uses “AI governance” for level 4. This guide focuses on people working together in a team—not building AI systems for an entire organisation.',
    nav: 'Choose what to read', practice: 'Try one task', more: 'Explore the background', training: 'Find training',
    example: 'A real task', check: 'Your check', sketch: 'See the original sketch', back: 'Back to the four levels',
    levels: [
      { name: 'Chat', title: 'Ask, then check.', body: 'You ask AI for help with one task. A prompt is simply the request you give it.', example: 'Draft a message about a delay. Use made-up names. Tell AI what happened and what you want to explain.', check: 'Check the facts, tone and promises. Keep only words you would be happy to say yourself.' },
      { name: 'Workflow', title: 'Link the steps.', body: 'A workflow is a set of tasks in order. Some use AI; others need a person.', example: 'Turn approved meeting notes into an action list. Use another tool to compare the list with the notes. Ask a colleague to review it.', check: 'Keep the source notes. Check what moves between tools and who owns the result.' },
      { name: 'Agent', title: 'Give a goal and clear limits.', body: 'An agent is an AI tool that can take several steps towards a goal. You set what it may do and when it must ask.', example: 'Ask an agent to draft a briefing from approved documents. Let it flag gaps. Do not let it send messages or make promises without permission.', check: 'Verify the sources. Review progress. Know how to stop the agent and see what it has done.' },
      { name: 'Teamwork', title: 'Agree who does what.', body: 'Team members use AI in shared work. People still make the final decisions.', example: 'Prepare a proposal together. One person checks research, another drafts the plan and a third checks the promises.', check: 'Agree what may be shared, who checks each part and who signs off. Keep private information private.' },
    ],
    background: 'More time? Go a little deeper.',
    backgroundIntro: 'You can start practising without learning these extra labels. Return when they help you.',
    human: 'Think, say, do and feel', connections: 'Who communicates with whom?', origin: 'Where ACX comes from',
    source: 'ACX grew from Estève’s AI and communication research with',
    sourceEnd: 'It is a teaching guide, not a validated test of ability.',
    scan: 'Where the Satellite Scan fits',
    scanText: 'The Scan offers personal reflection on your communication, a coach-prepared dashboard, prompts and practice materials. You do not need it to use this guide.',
    scanLimit: 'Share only what an AI tool needs. Personal Scan results are not team data by default. The Scan does not install agents or include training. Coaching and training are booked separately.',
    scanLink: 'Explore the Satellite Scan',
  },
  fr: {
    kicker: 'L’IA pour débutants · Un guide pour la pause café',
    intro: 'Commencez par un échange utile. Ajoutez des outils ou du travail en équipe seulement si votre tâche le demande.',
    byline: 'Par Estève Pannetier · Coach en communication avec l’IA',
    start: 'Découvrir les quatre niveaux', enlarge: 'Voir le dessin complet en couleur',
    map: 'Les quatre niveaux en bref',
    meaning: 'ACX est la carte d’Estève pour travailler avec l’IA de quatre façons. Ce n’est ni un test ni une échelle à gravir. Vous fixez le but, vérifiez le travail et décidez quand arrêter.',
    note: 'Le dessin original nomme le niveau 4 « AI governance ». Ce guide se concentre sur le travail entre membres d’une équipe, pas sur la création de systèmes d’IA pour toute une organisation.',
    nav: 'Choisir quoi lire', practice: 'Essayer une tâche', more: 'Approfondir', training: 'Trouver une formation',
    example: 'Une tâche concrète', check: 'Votre vérification', sketch: 'Voir le dessin original', back: 'Retour aux quatre niveaux',
    levels: [
      { name: 'Dialoguer avec l’IA', title: 'Demander, puis vérifier.', body: 'Vous demandez de l’aide à l’IA pour une tâche. Un prompt, c’est simplement la demande que vous lui donnez.', example: 'Préparez un message pour expliquer un retard. Utilisez des noms inventés. Précisez ce qui s’est passé et ce que vous voulez expliquer.', check: 'Vérifiez les faits, le ton et les promesses. Gardez seulement les mots que vous pourriez dire vous-même.' },
      { name: 'Relier les étapes', title: 'Faire suivre les tâches.', body: 'Un flux de travail est une suite de tâches. Certaines utilisent l’IA ; d’autres demandent une personne.', example: 'Transformez des notes de réunion approuvées en liste d’actions. Un autre outil compare la liste aux notes. Un collègue la relit.', check: 'Gardez les notes d’origine. Vérifiez ce qui passe entre les outils et qui est responsable du résultat.' },
      { name: 'Guider un agent IA', title: 'Fixer un but et des limites.', body: 'Un agent IA peut enchaîner plusieurs étapes vers un but. Vous décidez ce qu’il peut faire et quand il doit demander votre accord.', example: 'Demandez une note à partir de documents approuvés. L’agent peut signaler les manques. Il ne doit ni envoyer de messages ni prendre d’engagements sans permission.', check: 'Vérifiez les sources et suivez le travail. Sachez comment arrêter l’agent et revoir ce qu’il a fait.' },
      { name: 'Travailler en équipe', title: 'Décider qui fait quoi.', body: 'Plusieurs personnes utilisent l’IA dans un travail commun. Les décisions finales restent humaines.', example: 'Préparez une proposition ensemble. Une personne vérifie les recherches, une autre rédige le plan et une troisième vérifie les promesses.', check: 'Décidez ce qui peut être partagé, qui vérifie chaque partie et qui valide. Gardez les informations privées confidentielles.' },
    ],
    background: 'Un peu plus de temps ? Approfondissez.',
    backgroundIntro: 'Vous pouvez commencer sans apprendre ces sigles. Revenez à ces repères quand ils vous sont utiles.',
    human: 'Penser, dire, agir et ressentir', connections: 'Qui communique avec qui ?', origin: 'D’où vient ACX ?',
    source: 'ACX est issu des recherches d’Estève sur l’IA et la communication avec',
    sourceEnd: 'C’est un guide pour apprendre, pas un test validé des capacités.',
    scan: 'La place du Satellite Scan',
    scanText: 'Le Scan propose une réflexion sur votre communication, un tableau de bord préparé par un coach, des consignes et des exercices. Il n’est pas nécessaire pour utiliser ce guide.',
    scanLimit: 'Ne partagez que les informations nécessaires avec l’IA. Les résultats personnels du Scan ne sont pas partagés avec l’équipe par défaut. Le Scan n’installe pas d’agents et n’inclut pas de formation. Formation et coaching se réservent séparément.',
    scanLink: 'Découvrir le Satellite Scan',
  },
};

export function renderReadableAcx(original: string, language: 'en' | 'fr'): string {
  const c = copy[language], fr = language === 'fr';
  const take = (pattern: RegExp) => {
    const value = original.match(pattern)?.[0];
    if (!value) throw new Error(`ACX source section missing: ${pattern}`);
    return value;
  };
  const section = (id: string) => take(new RegExp(`<section id="${id}">[\\s\\S]*?<\\/section>`));
  const title = take(/<h1>[\s\S]*?<\/h1>/);
  const icon = (i: number) => `<img src="/images/acx/acx-${i}-outline.svg" width="56" height="56" alt="" aria-hidden="true">`;
  const overview = c.levels.map((level, i) => `<li><a href="#acx-${i + 1}">${icon(i + 1)}<span><span class="acx-meta">ACX ${i + 1}</span><strong>${e(level.name)}</strong><span>${e(level.title)}</span></span></a></li>`).join('');
  const levels = c.levels.map((level, i) => {
    const drawing = section(`acx-${i + 1}`).match(/<figure[\s\S]*?<\/figure>/)?.[0];
    if (!drawing) throw new Error('Original ACX drawing missing');
    return `<section id="acx-${i + 1}" class="acx-level-section"><div class="acx-guide-level-title">${icon(i + 1)}<div><p class="acx-meta">ACX ${i + 1} · ${e(level.name)}</p><h2>${e(level.title)}</h2></div></div><p>${e(level.body)}</p><h3>${e(c.example)}</h3><p>${e(level.example)}</p><aside class="acx-practice"><h3>${e(c.check)}</h3><p>${e(level.check)}</p></aside><details class="acx-sketch"><summary>${e(c.sketch)}</summary>${drawing}</details><a class="acx-back" href="#acx-overview">↑ ${e(c.back)}</a></section>`;
  }).join('');
  // Keep all four human layers and connection labels, but after the useful examples.
  const optional = (id: string, label: string) => {
    let body = section(id).replace(/^<section[^>]*><h2>[\s\S]*?<\/h2>/, '').replace(/<\/section>$/, '');
    if (id === 'acx-connections') {
      body = body.replace(/(<dt>[\s\S]*?<\/svg>)\s*(H2S|H2H|HAI|A2A)\s*·\s*[^<]+<\/dt>/g, (_match, icon, code) => {
        const index = CONNECTION_CODES.indexOf(code);
        return `${icon}<span class="connection-heading">${e(code)}<span class="connection-expansion">${e(COMMUNICATION_CONNECTIONS[language].meanings[index])}</span></span></dt>`;
      });
    }
    return `<section id="${id}"><details class="acx-deeper"><summary>${e(label)}</summary>${body}</details></section>`;
  };
  const training = section('acx-training').replace(/<aside class="acx-position">[\s\S]*?<\/aside>/, '');
  const origin = section('acx-meaning').match(/<details class="acx-origin">[\s\S]*?<\/details>/)?.[0] || '';
  return `<header class="acx-article-header acx-guide-hero"><img class="acx-hero-drawing" src="/images/acx/acx-4-background-800.jpg" srcset="/images/acx/acx-4-background-800.jpg 800w, /images/acx/acx-4-background-1600.jpg 1600w" sizes="(max-width: 700px) 150vw, 100vw" width="1600" height="900" alt="" aria-hidden="true" decoding="async" fetchpriority="high"><div class="acx-hero-copy"><p class="acx-kicker">${e(c.kicker)}</p>${title}<p class="acx-deck">${e(c.intro)}</p><p class="acx-byline">${e(c.byline)}</p><a class="acx-cta" href="#acx-overview">${e(c.start)} ↓</a></div></header>
  <div class="acx-reading-layout"><div class="acx-reading-body">
  <section id="acx-meaning"><h2>${e(c.map)}</h2><p>${e(c.meaning)}</p><ol id="acx-overview" class="acx-quick-map">${overview}</ol><nav class="acx-quick-links" aria-label="${e(c.nav)}"><a href="#acx-practice">${e(c.practice)} ↓</a><a href="#acx-background">${e(c.more)} ↓</a><a href="#acx-training">${e(c.training)} ↓</a></nav><p class="acx-source-note">${e(c.note)} <a href="/images/acx/acx-4-original.png" target="_blank" rel="noopener noreferrer">${e(c.enlarge)} ↗</a></p></section>
  ${levels}${section('acx-practice')}
  <section id="acx-background"><h2>${e(c.background)}</h2><p>${e(c.backgroundIntro)}</p></section>
  ${optional('acx-human-skills', c.human)}${optional('acx-connections', c.connections)}
  <section id="acx-origin"><details class="acx-deeper"><summary>${e(c.origin)}</summary><p>${e(c.source)} <a href="https://www.arbora.partners/research" target="_blank" rel="noopener noreferrer">Arbora</a>. ${e(c.sourceEnd)}</p>${origin}<p>${fr ? 'Les dessins utilisent H2A là où le guide dit HAI : les échanges entre une personne et l’IA.' : 'The drawings use H2A where this guide says HAI: exchanges between a person and AI.'}</p></details></section>
  <section id="acx-scan"><h2>${e(c.scan)}</h2><p>${e(c.scanText)}</p><p>${e(c.scanLimit)}</p><a class="acx-back" href="${fr ? '/fr/scan' : '/scan'}">${e(c.scanLink)} →</a></section>
  ${training}${section('acx-questions')}${take(/<footer class="acx-source">[\s\S]*?<\/footer>/)}
  </div></div>`;
}
