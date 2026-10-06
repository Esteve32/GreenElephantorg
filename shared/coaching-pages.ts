import pages from './coaching-pages.json';
import { renderCommunicationConnections, COACHING_CONNECTION_EXAMPLES } from './communication-connections';

export const COACHING_PAGES = pages;
export const DISCOVERY_URL = 'https://calendly.com/greenelephant/free-ai-literacy-discovery-call';
export const coachingPath = (slug: string) => `/ai-coaching/${slug}`;
export const coachingPage = (path: string) => pages.find(page => coachingPath(page.slug) === path.replace(/\/+$/, ''));
export function escapeCopy(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
}
export const BEGINNER_FAQ = {
  question: 'Do I need to know how to use AI already?',
  answer: 'The journey is designed for beginners. We start with your goal and what you already know, then agree a manageable task.',
};

// One authored source serves React navigation and initial HTTP content.
// Values are editorial content, never visitor input; escape them nonetheless.
export function renderCoachingPage(page: typeof pages[number]): string {
  const e = escapeCopy;
  const cta = (position: 'hero' | 'closing') => `<div class="ge-cta-group"><a class="button" href="${DISCOVERY_URL}" target="_blank" rel="noopener noreferrer" data-coaching-use-case="${e(page.slug)}" data-cta-position="${position}">Discuss your training needs <span aria-hidden="true">↗</span></a><p class="ge-note">Bring one task or idea you would like to explore.</p></div>`;
  return `<article class="ge-landing" data-use-case="${e(page.slug)}">
    <section class="ge-landing-hero"><div class="ge-hero-visual"><img class="ge-hero-photo" src="${e(page.image)}" srcset="/images/coaching/${e(page.slug)}-hero-640.jpg 640w, /images/coaching/${e(page.slug)}-hero-1280.jpg 1280w, ${e(page.image)} 1536w" sizes="100vw" width="1536" height="1024" alt="${e(page.imageAlt)}" fetchpriority="high" decoding="async"><div class="wrap ge-hero-title"><h1>${e(page.headline)}</h1></div></div><div class="wrap ge-hero-copy">
      <a class="ge-back" href="/#training">← AI literacy training</a>
      <p class="eyebrow">AI literacy training · Personal coaching · ${e(page.label)}</p>
      <div class="ge-hero-story"><p class="ge-lead">${e(page.intro)}</p><div>${cta('hero')}
      <a class="ge-scroll" href="#your-start">Explore the journey <span aria-hidden="true">↓</span></a></div></div>
    </div></section>
    <section class="section wrap ge-split" id="your-start" aria-labelledby="who-title">
      <div><p class="eyebrow">Your starting point</p><h2 id="who-title">Who this is for.</h2><p>${e(page.audience)}</p></div>
      <div class="ge-example"><p class="eyebrow">What to bring</p><p>${e(page.example)}</p></div>
    </section>
    <section class="ge-acx-usecase" aria-labelledby="acx-${e(page.slug)}"><div class="section wrap">
      <p class="eyebrow">Chat · Workflow · Agent · Teamwork</p><h2 id="acx-${e(page.slug)}">${e(page.acxHeading)}</h2><p class="ge-acx-intro">${e(page.acxIntro)}</p>
      <ol class="ge-acx-usecase-grid">${page.acx.map((item, index) => `<li><span class="ge-acx-icon"><img src="/images/acx/acx-${index + 1}-outline.svg" width="88" height="88" alt="" aria-hidden="true"></span><p class="ge-acx-level">${e(item.level)} <span>${e(item.name)}</span></p><h3>${e(item.action)}</h3><p>${e(item.detail)}</p><p class="ge-acx-control"><strong>Human check:</strong> ${e(item.control)}</p></li>`).join('')}</ol>
      <p class="ge-acx-scope">In your coaching journey: practise Chat and Workflow, try a guided Agent task, and explore how Teamwork could fit your needs.</p>
    </div></section>
    <section class="ge-band"><div class="section wrap"><p class="eyebrow">Small steps. Real practice.</p><h2>What you can practise.</h2>
      <ol class="ge-practice">${page.practice.map((item, i) => `<li><span class="ge-step" aria-hidden="true">0${i+1}</span><p>${e(item)}</p></li>`).join('')}</ol>
      <div class="ge-takeaway"><h3>A useful next step.</h3><p>${e(page.takeaway)}</p></div>${renderCommunicationConnections('en', 'project-connections', COACHING_CONNECTION_EXAMPLES[page.slug])}
    </div></section>
    <section class="section wrap ge-split" aria-labelledby="journey-title"><div><p class="eyebrow">The coaching journey</p><h2 id="journey-title">Four days. Part-time.<br>Built around a real task.</h2><ul class="ge-facts"><li>1–5 people</li><li>Solo learners welcome</li><li>Designed for beginners</li></ul></div>
      <div><p>Agree a goal with your coach, try a manageable task and review the results together. There is time for questions and practice.</p><p class="ge-note">Discuss the project, schedule, delivery format and fee with Estève before booking.</p></div>
    </section>
    <section class="ge-band"><div class="section wrap ge-split"><h2>Your questions.</h2><div class="ge-questions">${[...page.faq, BEGINNER_FAQ].map(item=>`<details><summary>${e(item.question)}</summary><p>${e(item.answer)}</p></details>`).join('')}</div></div></section>
    <section class="section wrap ge-landing-close"><p class="eyebrow">Start with a conversation</p><h2>${e(page.invitation)}</h2>${cta('closing')}<a class="text-link" href="/#coaching-paths">Explore the other coaching journeys →</a></section>
  </article>`;
}
