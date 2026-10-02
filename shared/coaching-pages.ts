import pages from './coaching-pages.json';

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
    <section class="ge-landing-hero"><div class="wrap">
      <a class="ge-back" href="/#training">← AI literacy training</a>
      <p class="eyebrow">Personal AI coaching · ${e(page.label)}</p>
      <h1>${e(page.headline)}</h1><p class="ge-lead">${e(page.intro)}</p>${cta('hero')}
      <a class="ge-scroll" href="#your-start">Explore the journey <span aria-hidden="true">↓</span></a>
    </div></section>
    <section class="section wrap ge-split" id="your-start" aria-labelledby="who-title">
      <div><p class="eyebrow">Your starting point</p><h2 id="who-title">Who this is for.</h2><p>${e(page.audience)}</p></div>
      <div class="ge-example"><p class="eyebrow">A place to begin</p><p>${e(page.example)}</p></div>
    </section>
    <section class="ge-band"><div class="section wrap"><p class="eyebrow">Small steps. Real practice.</p><h2>What you can practise.</h2>
      <ol class="ge-practice">${page.practice.map((item, i) => `<li><span class="ge-step" aria-hidden="true">0${i+1}</span><p>${e(item)}</p></li>`).join('')}</ol>
      <div class="ge-takeaway"><h3>A useful next step.</h3><p>${e(page.takeaway)}</p></div>
    </div></section>
    <section class="section wrap ge-split" aria-labelledby="journey-title"><div><p class="eyebrow">The coaching journey</p><h2 id="journey-title">Four days. Part-time.<br>Built around a real task.</h2><ul class="ge-facts"><li>1–5 people</li><li>Solo learners welcome</li><li>Designed for beginners</li></ul></div>
      <div><p>A coaching journey for 1–5 people, including solo learners. Designed for beginners, with time to practise, ask questions and review what AI produces. You choose a goal with your coach, try a manageable piece of work and build habits you can keep using.</p><p class="ge-note">Discuss the project, schedule, delivery format and fee with Estève before booking.</p></div>
    </section>
    <section class="ge-band"><div class="section wrap ge-split"><h2>Your questions.</h2><div class="ge-questions">${[...page.faq, BEGINNER_FAQ].map(item=>`<details><summary>${e(item.question)}</summary><p>${e(item.answer)}</p></details>`).join('')}</div></div></section>
    <section class="section wrap ge-landing-close"><p class="eyebrow">Start with a conversation</p><h2>${e(page.invitation)}</h2>${cta('closing')}<a class="text-link" href="/#coaching-paths">Explore the other coaching journeys →</a></section>
  </article>`;
}
