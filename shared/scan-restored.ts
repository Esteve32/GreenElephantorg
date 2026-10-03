import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BarChart3, Bot, Video, FileText, Smartphone, MessageSquare, Timer, Brain, Sparkles, Target, type LucideIcon } from 'lucide-react';
import { LENSES, type LensType } from '../client/src/constants/lenses';
import en from './scan-restored-en.json';
import fr from './scan-restored-fr.json';
import { escapeCopy as e } from './coaching-pages';
import type { ScanLanguage } from './scan-literacy';

// Recovered from ec09f80d3b122e015f9dd51b01b57edf6191b740, ScanPage.tsx.
// FR is a new translation, not an archived French original. Privacy, unsupported
// measurement claims and AI data-sharing advice retain the current safeguards.
export const restoredScan = { en, fr };
export const scanLensNames = {
  en: ['Influence', 'Attitude', 'Chaordic', 'Flow', 'Alignment', 'Energy & Needs', 'Ego', 'Dynamics'],
  fr: ['Influence', 'Attitude', 'Chaordique', 'Fluidité', 'Alignement', 'Énergie et besoins', 'Ego', 'Dynamiques'],
};
const lensKeys = Object.keys(en.LENS_DETAILS) as (keyof typeof en.LENS_DETAILS)[];
export const scanLabels = {
  en: {
    deliverables: 'What you receive.',
    deliverablesIntro: 'Your dashboard in 48–72 hours. A communication map prepared by a coach, with tools to keep exploring your patterns.',
    items: [
      ['Personalized Dashboard', 'Your self-reported communication patterns visualized across all 8 lenses. Coach-reviewed, delivered within 48–72 hours of completion.'],
      ['10+ AI Coaching Prompts', 'Explore your results with the Conscious Communicator GPT or an AI tool you choose. Prepare for conversations, explore blind spots and build micro-habits. AI use is optional.'],
      ['Video Coaching Library', 'A YouTube playlist organized by your 4-digit lens codes. Watch, learn and practise at your own pace.'],
      ['Downloadable Resources', 'A high-resolution Periodic Table poster, micro-habit templates and worksheets for ongoing development.'],
    ],
    beforeAfter: 'From confusion to clarity.',
    beforeIntro: 'You may feel something is off in your communication but struggle to name it. Use the Scan as a map for reflection and practice, not a promise of automatic change.',
    before: 'Situations you may recognise', after: 'Directions to explore',
    beforeItems: ['Same conflicts keep repeating', 'Guessing why conversations go wrong', 'Generic advice that doesn’t fit', 'Coaching without a shared starting point', 'Reacting instead of responding'],
    afterItems: ['Name a pattern behind a conflict', 'Explore the perspectives involved', 'Adapt prompts to your real situations', 'Bring your own responses into coaching', 'Practise pausing before responding'],
    signals: 'Recognise these patterns?', signalsIntro: 'When you’re close to a difficult situation, it can be hard to see the pattern. Take a step back and explore it from another perspective.',
    mirror: 'A mirror, not a test.', mirrorIntro: 'The Satellite Scan doesn’t measure your intelligence or judge your choices. It surfaces patterns in your own responses so you can choose what to explore. Self-awareness is the starting point.',
    mirrorItems: [
      ['90-minute deep dive', 'A structured questionnaire covering 129 real-life communication scenarios. Take time to reflect honestly on your own experiences.'],
      ['Human-crafted dashboard', 'Our coaches personally review your answers and create a visual map for discussing your patterns and possible areas to practise.'],
      ['Growing prompt library', 'Explore your results with communication prompts. Keep your own judgement in charge and share only what an AI tool needs.'],
    ],
    comparison: 'Not another personality label.',
    comparisonIntro: 'What makes this a reflective coaching tool: a view of your own responses today, rather than an objective assessment or a fixed type.',
    comparisons: ['Context-dependent, self-reported communication patterns', 'A Scan you can revisit to discuss changes in your answers', 'An included library of prompts for optional AI-assisted reflection', 'A personalized dashboard reviewed by a coach', 'Eight communication perspectives', 'For personal development and coaching—not hiring or performance evaluation'],
    people: 'Who benefits.', peopleIntro: 'Explore the situations and communication perspectives relevant to your work. These are reflection prompts, not role suitability scores.',
    keyLenses: 'Perspectives to explore', lenses: '8 lenses. 129 questions.', lensesIntro: 'A framework developed from coaching practice. Open each lens to explore patterns and possible practice directions. These are not guaranteed outcomes or measured abilities.',
    pattern: 'A pattern you may recognise', practice: 'A direction to practise',
    repeat: 'A snapshot you can revisit.', repeatIntro: 'Your communication context changes. Come back to your own responses when something changes in your life or work.',
    repeatItems: [['Before', 'Reflect before a difficult conversation or presentation.'], ['After', 'Revisit your responses after a promotion, a job change or a conflict.'], ['Over time', 'Consider another Scan after 6–12 months. Discuss changes in your responses, not a score of measured growth.']],
    process: 'Your journey to clarity.', processIntro: 'From reflection to practice in four steps. Training and coaching are booked separately.',
  },
  fr: {
    deliverables: 'Ce que vous recevez.',
    deliverablesIntro: 'Votre tableau de bord sous 48 à 72 heures. Une carte de communication préparée par un coach et des outils pour continuer à explorer vos habitudes.',
    items: [
      ['Tableau de bord personnalisé', 'Vos habitudes de communication déclarées, représentées selon les 8 perspectives. Préparé par un coach, sous 48 à 72 heures après le questionnaire.'],
      ['Plus de 10 consignes de coaching avec l’IA', 'Explorez vos résultats avec le GPT Conscious Communicator ou l’outil d’IA de votre choix. Préparez vos conversations, explorez vos angles morts et développez des micro-habitudes. L’IA est facultative.'],
      ['Bibliothèque de guides vidéo', 'Une sélection YouTube organisée par les codes à 4 chiffres de vos perspectives. Regardez, apprenez et pratiquez à votre rythme.'],
      ['Ressources à télécharger', 'Une affiche haute résolution du Tableau périodique, des modèles de micro-habitudes et des fiches pour continuer à pratiquer.'],
    ],
    beforeAfter: 'De la confusion à la clarté.',
    beforeIntro: 'Vous sentez parfois qu’un échange ne fonctionne pas, sans pouvoir nommer ce qui se passe. Utilisez le Scan comme carte de réflexion et de pratique, pas comme promesse de changement automatique.',
    before: 'Des situations familières', after: 'Des pistes à explorer',
    beforeItems: ['Les mêmes conflits se répètent', 'Vous devinez pourquoi les échanges se passent mal', 'Les conseils génériques ne vous correspondent pas', 'Le coaching manque de point de départ partagé', 'Vous réagissez avant de choisir votre réponse'],
    afterItems: ['Nommer une habitude derrière un conflit', 'Explorer les perspectives en jeu', 'Adapter les consignes à vos situations réelles', 'Apporter vos propres réponses dans le coaching', 'Pratiquer une pause avant de répondre'],
    signals: 'Reconnaissez-vous ces habitudes ?', signalsIntro: 'Quand une situation vous touche de près, il est difficile de voir ce qui se répète. Prenez du recul pour l’explorer sous une autre perspective.',
    mirror: 'Un miroir, pas un test.', mirrorIntro: 'Le Satellite Scan ne mesure pas votre intelligence et ne juge pas vos choix. Il fait apparaître des habitudes dans vos propres réponses pour vous permettre de choisir ce que vous voulez explorer. La conscience de soi est le point de départ.',
    mirrorItems: [
      ['90 minutes pour prendre du recul', 'Un questionnaire structuré autour de 129 situations de communication du quotidien. Prenez le temps de réfléchir honnêtement à votre expérience.'],
      ['Un tableau de bord préparé par un humain', 'Nos coachs examinent personnellement vos réponses et créent une carte visuelle pour discuter de vos habitudes et des pistes à pratiquer.'],
      ['Une bibliothèque de consignes évolutive', 'Explorez vos résultats avec des consignes de communication. Gardez votre propre jugement et ne partagez que ce dont l’outil d’IA a besoin.'],
    ],
    comparison: 'Pas une nouvelle étiquette de personnalité.',
    comparisonIntro: 'Un outil de réflexion et de coaching : une représentation de vos propres réponses aujourd’hui, pas une évaluation objective ni un type figé.',
    comparisons: ['Des habitudes de communication déclarées, liées au contexte', 'Un Scan à refaire pour discuter de l’évolution de vos réponses', 'Une bibliothèque de consignes pour une réflexion avec l’IA, facultative', 'Un tableau de bord personnalisé examiné par un coach', 'Huit perspectives de communication', 'Pour le développement personnel et le coaching, pas pour recruter ou évaluer au travail'],
    people: 'À qui s’adresse-t-il ?', peopleIntro: 'Explorez les situations et perspectives de communication liées à votre activité. Ce sont des pistes de réflexion, pas des scores d’aptitude à un métier.',
    keyLenses: 'Perspectives à explorer', lenses: '8 perspectives. 129 questions.', lensesIntro: 'Un cadre issu de la pratique du coaching. Ouvrez chaque perspective pour découvrir des habitudes et des pistes à pratiquer. Il ne s’agit ni de résultats garantis ni de capacités mesurées.',
    pattern: 'Une habitude que vous pouvez reconnaître', practice: 'Une piste à pratiquer',
    repeat: 'Un instantané à revisiter.', repeatIntro: 'Votre contexte de communication évolue. Revenez à vos propres réponses quand quelque chose change dans votre vie ou votre travail.',
    repeatItems: [['Avant', 'Réfléchissez avant une conversation difficile ou une présentation.'], ['Après', 'Revenez sur vos réponses après une promotion, un changement de poste ou un conflit.'], ['Dans le temps', 'Envisagez un nouveau Scan après 6 à 12 mois. Discutez de l’évolution de vos réponses, pas d’un score de progrès mesuré.']],
    process: 'Votre chemin vers plus de clarté.', processIntro: 'De la réflexion à la pratique en quatre étapes. La formation et le coaching se réservent séparément.',
  },
};

const list = (items: string[]) => `<ul class="ge-scan-list">${items.map(x=>`<li>${e(x)}</li>`).join('')}</ul>`;
// Same Lucide assets and colour assignments as the original Scan sections.
const icon = (Icon: LucideIcon) => renderToStaticMarkup(createElement(Icon, {size:24, 'aria-hidden':true}));
const deliverableIcons = [BarChart3, Bot, Video, FileText];
const deliverableColours = ['#009999', '#e8c840', '#cc3333', '#3b7dd8'];
const mirrorIcons = [Smartphone, BarChart3, MessageSquare];
const processIcons = [Timer, Brain, Sparkles, Target];
const cards = (items: string[][], icons: LucideIcon[] = [], colours: string[] = []) => `<div class="ge-scan-content-grid">${items.map(([title,text],i)=>`<div class="ge-scan-icon-card">${icons[i]?`<span class="ge-scan-icon" style="color:${colours[i]??'var(--teal)'}">${icon(icons[i])}</span>`:''}<div><h3>${e(title)}</h3><p>${e(text)}</p></div></div>`).join('')}</div>`;
const lensBadge = (key: string, name: string) => `<span class="ge-scan-lens-badge" style="--lens-colour:hsl(var(--${key}))">${e(name)}</span>`;
const widget = (name: 'benefits'|'lenses', html: string) => `<!--scan-widget:${name}-->${html}<!--/scan-widget-->`;

const section = (id: string, title: string, intro: string, body: string, glow = false) => `<section id="${id}" data-testid="section-${id}"${glow?' class="ge-band"':''}><div class="section wrap"><h2>${e(title)}</h2><p>${e(intro)}</p>${body}</div></section>`;

export function renderRestoredScanSections(language: ScanLanguage): string {
  const c = scanLabels[language], data = restoredScan[language];
  const lensName = (key: string) => scanLensNames[language][lensKeys.indexOf(key as typeof lensKeys[number])];
  return section('scan-more', c.deliverables, c.deliverablesIntro, cards(c.items, deliverableIcons, deliverableColours))
    + section('before-after', c.beforeAfter, c.beforeIntro, `<div class="ge-scan-content-grid"><div><h3>${e(c.before)}</h3>${list(c.beforeItems)}</div><div><h3>${e(c.after)}</h3>${list(c.afterItems)}</div></div>`, true)
    + section('signals', c.signals, c.signalsIntro, `<div class="ge-scan-content-grid">${data.PAIN_SIGNALS.map(x=>`<div><p>${e(x.signal)}</p>${lensBadge(x.lens,lensName(x.lens))}</div>`).join('')}</div>`)
    + section('what-is-it', c.mirror, c.mirrorIntro, cards(c.mirrorItems, mirrorIcons), true)
    + section('comparison', c.comparison, c.comparisonIntro, list(c.comparisons))
    + widget('benefits', section('benefits', c.people, c.peopleIntro, `<div class="ge-scan-content-grid">${data.PERSONAS.map(x=>`<div data-testid="persona-${x.id}"><h3>${e(x.title)}</h3><p>${e(x.description)}</p><p class="ge-note">${e(c.keyLenses)} : ${x.lenses.map(key=>lensBadge(key,lensName(key))).join(' ')}</p></div>`).join('')}</div>`, true))
    + widget('lenses', section('lenses', c.lenses, c.lensesIntro, `<div class="ge-questions">${lensKeys.map(key=>`<details class="ge-scan-lens" data-testid="lens-${key}"><summary><span class="ge-scan-lens-icon" style="background:hsl(var(--${key}))">${icon(LENSES[key as LensType].icon)}</span>${e(lensName(key))}<span class="ge-note">${LENSES[key as LensType].code}</span></summary><h4>${e(c.pattern)}</h4><p>${e(data.LENS_DETAILS[key].painSignal)}</p><h4>${e(c.practice)}</h4><p>${e(data.LENS_DETAILS[key].benefit)}</p>${data.LENS_BENEFITS[key].map(x=>`<h4>${e(x.benefit)}</h4><p>${e(x.insight)}</p>`).join('')}</details>`).join('')}</div>`))
    + section('repeatable-reflection', c.repeat, c.repeatIntro, `<div class="ge-scan-repeat-grid">${c.repeatItems.map(([title,text])=>`<div class="ge-scan-repeat-card"><span class="ge-scan-timing">${e(title)}</span><p>${e(text)}</p></div>`).join('')}</div><div class="ge-scan-timeline" aria-hidden="true"><span></span><i></i><span></span><i></i><span></span></div>`, true);
}

export function renderRestoredProcess(language: ScanLanguage): string {
  const c = scanLabels[language];
  return section('how-it-works', c.process, c.processIntro, `<ol class="ge-scan-steps">${restoredScan[language].STEPS.map((x,i)=>`<li class="ge-scan-process-card"><span class="ge-scan-icon">${icon(processIcons[i])}</span><div><h3>${e(x.title.replace(/^\d\. /,''))}</h3><p>${e(x.description)}</p></div></li>`).join('')}</ol>`);
}
