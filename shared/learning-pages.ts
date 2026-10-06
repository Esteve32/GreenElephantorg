// Green Elephant · AI-LIT: shared public learning copy for HTTP and React.
export const LEARNING_PAGES = {
  '/decode': {
    label: 'Speech Lab · Communication practice',
    heading: 'Explore communication in real speeches',
    intro: 'Read colour-annotated speeches by Mandela, JFK and Obama. Explore how a passage connects with people, shares information or proposes action. These annotations are one interpretation of the words, not proof of a speaker’s intentions or personality.',
    practiceHeading: 'Try it in one AI writing task',
    practice: [
      'Choose a short passage and consider another way to interpret it.',
      'Write your own brief for a message: who it is for, what they need to know and what you want to ask.',
      'If useful, ask AI for a draft. Check its facts, tone and proposed action before sharing it. Use only information you have permission to share.',
    ],
    faq: [
      { question: 'What do Green, Blue and Red mean here?', answer: 'Green highlights connection with other people. Blue highlights information and expression. Red highlights proposals and shared action. These are ways to discuss communication behaviour; they are not personality labels or validated measurements.' },
      { question: 'Does the colour analysis prove why a speech worked?', answer: 'No. The annotations offer a reading of selected passages. Context and other interpretations matter. Compare the explanation with the words and consider what you would read differently.' },
      { question: 'How does this support AI literacy?', answer: 'Practise defining an audience, giving useful context and checking a draft. Apply those habits when asking AI to help with a message. The lab is a practice resource; guided AI training is booked separately.' },
    ],
  },
  '/resources': {
    label: 'Learning resources · Prompts, videos and downloads',
    heading: 'Communication resources for your AI practice',
    intro: 'Explore communication prompts, teaching videos and available infographics. You can start without completing a Satellite Scan. Use one resource to prepare a real conversation or give AI clearer instructions, then check the result.',
    practiceHeading: 'Start with one useful task',
    practice: [
      'Choose a message or conversation you need to prepare. Find one prompt or video that fits.',
      'Write your own goal, context and boundaries before asking AI for help. Keep names and confidential details out when they are not needed.',
      'Check facts, tone and commitments in the answer. Decide what to keep and what to change. Resources support practice; AI training and coaching are booked separately.',
    ],
    faq: [
      { question: 'Do I need a Satellite Scan to use these resources?', answer: 'No. You can explore the public resources without a Scan. If you have Scan materials, choose the reflections that fit your current task. The Scan questionnaire and videos are in English.' },
      { question: 'Can I paste a whole communication profile into AI?', answer: 'Choose only the preferences needed for the task. Check permissions and the AI tool’s settings before sharing personal or confidential information. A prompt template does not establish permission to share someone else’s data.' },
      { question: 'Where can I get guided AI literacy training?', answer: 'Explore the discovery workshop and four-day coaching journey on the AI literacy training homepage. Discuss the task, schedule, delivery format and fee with Estève before booking.' },
    ],
  },
} as const;

export type LearningPath = keyof typeof LEARNING_PAGES;
export function learningPage(path: string) {
  return LEARNING_PAGES[path.replace(/\/+$/, '') as LearningPath];
}
function escape(value: string): string {
  return value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
export function renderLearningHero(path: LearningPath): string {
  const p = LEARNING_PAGES[path];
  return `<p class="ge-learning-label">${escape(p.label)}</p><h1>${escape(p.heading)}</h1><p>${escape(p.intro)}</p>`;
}
export function renderLearningPractice(path: LearningPath): string {
  const p = LEARNING_PAGES[path];
  return `<section class="ge-learning-practice" aria-label="${escape(p.practiceHeading)}"><h2>${escape(p.practiceHeading)}</h2><ol>${p.practice.map(item => `<li>${escape(item)}</li>`).join('')}</ol><nav aria-label="Continue learning"><a href="/#training">Explore AI literacy training</a><a href="/blog/acx-levels-ai-literacy">Learn the four ACX levels</a><a href="${path === '/decode' ? '/resources#prompts' : '/decode'}">${path === '/decode' ? 'Try a communication prompt' : 'Explore the Speech Lab'}</a></nav></section>`;
}
export function renderLearningQuestions(path: LearningPath): string {
  return `<section class="ge-learning-questions"><h2>Your questions</h2>${LEARNING_PAGES[path].faq.map(item => `<details><summary>${escape(item.question)}</summary><p>${escape(item.answer)}</p></details>`).join('')}</section>`;
}
export function renderLearningLanding(path: LearningPath): string {
  return `<article class="ge-learning-copy"><header>${renderLearningHero(path)}</header>${renderLearningPractice(path)}${renderLearningQuestions(path)}</article>`;
}
