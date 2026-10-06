import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BarChart3, Bot, Video, FileText, MessageSquare, Timer, Brain, Sparkles, Target, Compass, RefreshCw, History, X, Check, type LucideIcon } from 'lucide-react';
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
  "en": {
    "deliverables": "What you receive.",
    "deliverablesIntro": "A coach-prepared view of your responses, normally in 48–72 hours, plus tools to practise with people or AI.",
    "items": [
      [
        "Personalized Dashboard",
        "Your responses across eight communication perspectives, visualised in a coach-prepared dashboard. Normally delivered within 48–72 hours of completion."
      ],
      [
        "10+ AI Coaching Prompts",
        "Explore your results with the Conscious Communicator GPT or an AI tool you choose. Prepare for conversations, explore blind spots and build micro-habits. AI use is optional."
      ],
      [
        "Video Coaching Library",
        "A YouTube playlist organized by your 4-digit lens codes. Watch, learn and practise at your own pace."
      ],
      [
        "Downloadable Resources",
        "A high-resolution Periodic Table poster, micro-habit templates and worksheets for ongoing development."
      ]
    ],
    "beforeAfter": "From confusion to clarity.",
    "beforeIntro": "Step back from a conversation that feels stuck. Choose one pattern to notice and one small change to try.",
    "before": "Situations you may recognise",
    "after": "Directions to explore",
    "beforeItems": [
      "You hint instead of naming what you need.",
      "The same misunderstanding keeps coming back.",
      "An AI draft doesn’t sound like you.",
      "You don’t know where to start with a coach.",
      "You react before checking the meaning."
    ],
    "afterItems": [
      "State the need in one clear sentence.",
      "Spot an assumption and ask what the other person means.",
      "Describe your tone, then edit the draft.",
      "Bring your dashboard and one real situation.",
      "Pause, check and choose your response."
    ],
    "signals": "Recognise these patterns?",
    "signalsIntro": "When you’re close to a difficult situation, it can be hard to see the pattern. Take a step back and explore it from another perspective.",
    "mirror": "A mirror, not a personality label.",
    "mirrorIntro": "Your answers give you a view of your communication today. Use it to notice a habit and choose what to practise.",
    "mirrorItems": [
      [
        "Your view today",
        "Self-reported patterns across eight perspectives, not a fixed personality type."
      ],
      [
        "A changing context",
        "Revisit your responses when a situation, role or relationship changes."
      ],
      [
        "A tool for learning",
        "Use your dashboard with a coach or adapt a prompt. AI use is optional."
      ]
    ],
    "people": "Who benefits.",
    "peopleIntro": "Explore the situations and communication perspectives relevant to your work. These are reflection prompts, not role suitability scores.",
    "keyLenses": "Perspectives to explore",
    "lenses": "8 lenses. 129 questions.",
    "lensesIntro": "A framework developed from coaching practice. Open each lens to explore patterns and possible practice directions. These are not guaranteed outcomes or measured abilities.",
    "pattern": "A pattern you may recognise",
    "practice": "A direction to practise",
    "repeat": "A snapshot you can revisit.",
    "repeatIntro": "Prepare, try, reflect. Keep what helps when your communication context changes.",
    "repeatItems": [
      [
        "Before · Choose a situation",
        "Pick a conversation or AI task. Name the goal and the tone you want."
      ],
      [
        "After · Review what happened",
        "Compare your intention with the words you used. Choose one adjustment."
      ],
      [
        "Later · Revisit your perspective",
        "Return to your dashboard when your context changes. A new Scan can open a discussion, not prove measured progress."
      ]
    ],
    "process": "Your journey to clarity.",
    "processIntro": "From reflection to practice in four steps. Training and coaching are booked separately.",
    "driftIntro": "Communication drift is the gap between what you mean and how you communicate. Try six questions about everyday conversations, then apply one insight to a conversation or an AI request.",
    "driftLink": "Try the communication drift check",
    "mirrorLimit": "This is structured reflection, not a diagnosis or an objective measure of intelligence, ability or how others see you. It is not for hiring or performance reviews."
  },
  "fr": {
    "deliverables": "Ce que vous recevez.",
    "deliverablesIntro": "Un tableau de bord préparé par un coach, normalement sous 48 à 72 heures après l’envoi du questionnaire, et des outils pour explorer vos habitudes.",
    "items": [
      [
        "Tableau de bord personnalisé",
        "Vos habitudes de communication déclarées, représentées selon les 8 perspectives. Préparé par un coach, sous 48 à 72 heures après le questionnaire."
      ],
      [
        "Plus de 10 exemples de demandes à l’IA",
        "Adaptez ces consignes, aussi appelées prompts, pour préparer une conversation ou choisir une petite habitude à travailler. Utilisez l’outil d’IA de votre choix. L’IA reste facultative."
      ],
      [
        "Bibliothèque de guides vidéo",
        "Une sélection YouTube organisée par les codes à 4 chiffres de vos perspectives. Regardez, apprenez et pratiquez à votre rythme."
      ],
      [
        "Ressources à télécharger",
        "Une affiche haute résolution du Tableau périodique, des modèles de micro-habitudes et des fiches pour continuer à pratiquer."
      ]
    ],
    "beforeAfter": "De la confusion à la clarté.",
    "beforeIntro": "Prenez du recul sur un échange qui bloque. Repérez une habitude et choisissez un petit changement à essayer.",
    "before": "Des situations familières",
    "after": "Des pistes à explorer",
    "beforeItems": [
      "Vous suggérez au lieu de nommer votre besoin.",
      "Le même malentendu revient.",
      "Un texte de l’IA ne vous ressemble pas.",
      "Vous ne savez pas par où commencer avec un coach.",
      "Vous réagissez avant de vérifier le sens."
    ],
    "afterItems": [
      "Exprimez le besoin en une phrase claire.",
      "Repérez une supposition et demandez ce que l’autre veut dire.",
      "Précisez le ton, puis ajustez le brouillon.",
      "Apportez votre tableau de bord et une situation réelle.",
      "Faites une pause, vérifiez et choisissez votre réponse."
    ],
    "signals": "Reconnaissez-vous ces habitudes ?",
    "signalsIntro": "Quand une situation vous touche de près, il est difficile de voir ce qui se répète. Prenez du recul pour l’explorer sous une autre perspective.",
    "mirror": "Un miroir, pas une étiquette de personnalité.",
    "mirrorIntro": "Vos réponses donnent une vue de votre communication aujourd’hui. Repérez une habitude et choisissez ce que vous voulez pratiquer.",
    "mirrorItems": [
      [
        "Votre regard aujourd’hui",
        "Vos habitudes déclarées selon huit perspectives, pas un type de personnalité figé."
      ],
      [
        "Un contexte qui évolue",
        "Revisitez vos réponses quand une situation, un rôle ou une relation change."
      ],
      [
        "Un outil pour apprendre",
        "Utilisez votre tableau de bord avec un coach ou adaptez une consigne. L’IA reste facultative."
      ]
    ],
    "people": "À qui s’adresse-t-il ?",
    "peopleIntro": "Explorez les situations et perspectives de communication liées à votre activité. Ce sont des pistes de réflexion, pas des scores d’aptitude à un métier.",
    "keyLenses": "Perspectives à explorer",
    "lenses": "8 perspectives. 129 questions.",
    "lensesIntro": "Un cadre issu de la pratique du coaching. Ouvrez chaque perspective pour découvrir des habitudes et des pistes à pratiquer. Il ne s’agit ni de résultats garantis ni de capacités mesurées.",
    "pattern": "Une habitude que vous pouvez reconnaître",
    "practice": "Une piste à pratiquer",
    "repeat": "Un instantané à revisiter.",
    "repeatIntro": "Préparez, essayez, faites le point. Gardez ce qui vous aide quand votre contexte change.",
    "repeatItems": [
      [
        "Avant · Choisir une situation",
        "Choisissez un échange ou une tâche avec l’IA. Précisez votre objectif et le ton souhaité."
      ],
      [
        "Après · Faire le point",
        "Comparez votre intention avec les mots employés. Choisissez un ajustement."
      ],
      [
        "Plus tard · Reprendre du recul",
        "Revenez au tableau de bord quand votre contexte change. Un nouveau Scan ouvre une discussion ; il ne prouve pas un progrès mesuré."
      ]
    ],
    "process": "Votre chemin vers plus de clarté.",
    "processIntro": "De la réflexion à la pratique en quatre étapes. La formation et le coaching se réservent séparément.",
    "driftIntro": "La dérive de communication est l’écart entre votre intention et votre façon de communiquer. Essayez six questions sur vos échanges quotidiens, puis appliquez un repère à une conversation ou à une demande à l’IA.",
    "driftLink": "Essayer le bilan de communication (en anglais)",
    "mirrorLimit": "Une réflexion structurée, pas un diagnostic ni une mesure objective de l’intelligence, des capacités ou du regard des autres. Ne sert pas au recrutement ni à l’évaluation au travail."
  }
};

// Thin outline cues match the homepage; lens colours remain part of the framework.
const icon = (Icon: LucideIcon) => renderToStaticMarkup(createElement(Icon, {size:36, strokeWidth:1.5, 'aria-hidden':true, focusable:false}));
const deliverableIcons = [BarChart3, Bot, Video, FileText];
const deliverableColours = ['#009999', '#e8c840', '#cc3333', '#3b7dd8'];
const mirrorIcons = [Compass, RefreshCw, MessageSquare];
const repeatIcons = [Compass, RefreshCw, History];
const processIcons = [Timer, Brain, Sparkles, Target];
const cards = (items: string[][], icons: LucideIcon[] = [], colours: string[] = []) => `<div class="ge-scan-content-grid">${items.map(([title,text],i)=>`<div class="ge-scan-icon-card">${icons[i]?`<span class="ge-scan-icon" style="color:${colours[i]??'var(--teal)'}">${icon(icons[i])}</span>`:''}<div><h3>${e(title)}</h3><p>${e(text)}</p></div></div>`).join('')}</div>`;
const lensBadge = (key: string, name: string) => `<span class="ge-scan-lens-badge" style="--lens-colour:hsl(var(--${key}))">${e(name)}</span>`;
const widget = (name: 'benefits'|'lenses', html: string) => `<!--scan-widget:${name}-->${html}<!--/scan-widget-->`;

const section = (id: string, title: string, intro: string, body: string, glow = false) => `<section id="${id}" data-testid="section-${id}"${glow?' class="ge-band"':''}><div class="section wrap"><h2>${e(title)}</h2><p>${e(intro)}</p>${body}</div></section>`;

export function renderRestoredScanSections(language: ScanLanguage): string {
  const c = scanLabels[language], data = restoredScan[language];
  const lensName = (key: string) => scanLensNames[language][lensKeys.indexOf(key as typeof lensKeys[number])];
  return section('scan-more', c.deliverables, c.deliverablesIntro, cards(c.items, deliverableIcons, deliverableColours))
    + section('before-after', c.beforeAfter, c.beforeIntro, `<div class="ge-scan-change-headings" aria-hidden="true"><h3>${e(c.before)}</h3><h3>${e(c.after)}</h3></div><ol class="ge-scan-change-list" role="list">${c.beforeItems.map((text,i)=>`<li><div class="ge-scan-before"><span class="ge-scan-change-icon">${icon(X)}</span><p><span class="ge-change-label">${e(c.before)}</span>${e(text)}</p></div><div class="ge-scan-after"><span class="ge-scan-change-icon">${icon(Check)}</span><p><span class="ge-change-label">${e(c.after)}</span>${e(c.afterItems[i])}</p></div></li>`).join('')}</ol><div class="ge-scan-drift-invitation"><p>${e(c.driftIntro)}</p><a class="button" href="/signals">${e(c.driftLink)} <span aria-hidden="true">→</span></a></div>`, true)
    + section('signals', c.signals, c.signalsIntro, `<div class="ge-scan-content-grid">${data.PAIN_SIGNALS.map(x=>`<div><p>${e(x.signal)}</p>${lensBadge(x.lens,lensName(x.lens))}</div>`).join('')}</div>`)
    + section('what-is-it', c.mirror, c.mirrorIntro, `<span id="comparison" class="ge-section-anchor" aria-hidden="true"></span>${cards(c.mirrorItems, mirrorIcons)}<p class="ge-note ge-scan-limit">${e(c.mirrorLimit)}</p>`, true)
    + widget('benefits', section('benefits', c.people, c.peopleIntro, `<div class="ge-scan-content-grid">${data.PERSONAS.map(x=>`<div data-testid="persona-${x.id}"><h3>${e(x.title)}</h3><p>${e(x.description)}</p><p class="ge-note">${e(c.keyLenses)} : ${x.lenses.map(key=>lensBadge(key,lensName(key))).join(' ')}</p></div>`).join('')}</div>`, true))
    + widget('lenses', section('lenses', c.lenses, c.lensesIntro, `<div class="ge-questions">${lensKeys.map(key=>`<details class="ge-scan-lens" data-testid="lens-${key}"><summary><span class="ge-scan-lens-icon" style="background:hsl(var(--${key}))">${icon(LENSES[key as LensType].icon)}</span>${e(lensName(key))}<span class="ge-note">${LENSES[key as LensType].code}</span></summary><h4>${e(c.pattern)}</h4><p>${e(data.LENS_DETAILS[key].painSignal)}</p><h4>${e(c.practice)}</h4><p>${e(data.LENS_DETAILS[key].benefit)}</p>${data.LENS_BENEFITS[key].map(x=>`<h4>${e(x.benefit)}</h4><p>${e(x.insight)}</p>`).join('')}</details>`).join('')}</div>`))
    + section('repeatable-reflection', c.repeat, c.repeatIntro, `<div class="ge-scan-repeat-grid">${c.repeatItems.map(([title,text],i)=>`<div class="ge-scan-repeat-card"><span class="ge-scan-icon">${icon(repeatIcons[i])}</span><h3>${e(title)}</h3><p>${e(text)}</p></div>`).join('')}</div><div class="ge-scan-timeline" aria-hidden="true"><span></span><i></i><span></span><i></i><span></span></div>`, true);
}

export function renderRestoredProcess(language: ScanLanguage): string {
  const c = scanLabels[language];
  return section('how-it-works', c.process, c.processIntro, `<ol class="ge-scan-steps">${restoredScan[language].STEPS.map((x,i)=>`<li class="ge-scan-process-card"><span class="ge-scan-icon">${icon(processIcons[i])}</span><div><h3>${e(x.title.replace(/^\d\. /,''))}</h3><p>${e(x.description)}</p></div></li>`).join('')}</ol>`);
}
