import { scanLiteracy, type ScanLanguage } from './scan-literacy';
import { localPage } from './site-language';
import { DISCOVERY_URL, escapeCopy as e } from './coaching-pages';
import testimonials from './scan-testimonials.json';
import { restoredScan, renderRestoredScanSections, renderRestoredProcess } from './scan-restored';

// Existing English testimonial wording is retained verbatim. French versions
// are labelled translations, not new testimonials or new outcome evidence.
const frenchTestimonials = [
  ["Gérer les agendas de trois dirigeants signifie jongler chaque jour avec des priorités contradictoires. Le Satellite Scan m’a aidée à voir mes habitudes de communication et, maintenant, j’aborde avec assurance ces conversations où il faut dire non.", 'Assistante de direction auprès de dirigeants', 'Allemagne'],
  ["J’ai toujours pensé que j’étais simplement « mauvaise face à la confrontation ». Le Scan m’a montré que j’avais en réalité de solides compétences d’alignement : il me manquait les mots pour les reconnaître. Mon entretien annuel s’est déroulé tout autrement cette année.", 'Assistante de direction, entreprise technologique', 'Finlande'],
  ["En travaillant à distance pour trois clients dans différents fuseaux horaires, je croulais sous les malentendus. Les huit perspectives m’ont donné un cadre pour nommer ce qui n’allait pas et y remédier sans couper les ponts.", 'Assistante virtuelle', 'Inde'],
  ["Cela fait deux ans que nous évoluons vers une structure autogérée. Ce cadre a enfin donné à notre équipe un langage commun pour les conversations difficiles que cette transformation exige.", 'Responsable des équipes, organisation autogérée', 'Pays-Bas'],
  ["J’ai recommandé le Scan à toute mon équipe. Ce n’est pas un test, c’est un miroir. Et parfois, il faut un bon miroir pour voir clairement ses propres forces.", 'Responsable des opérations', 'Finlande'],
  ["Le cadre des huit perspectives m’a donné des mots pour des habitudes que je ressentais sans pouvoir les exprimer. Maintenant, je prépare chaque conversation difficile autrement.", 'Responsable de l’innovation', 'Suisse'],
  ["Après quinze ans à des postes de direction, je pensais connaître mon style de communication. Le Scan m’a montré trois angles morts que je contournais au lieu de les travailler.", 'Directeur des opérations', 'Royaume-Uni'],
  ["J’ai utilisé les résultats du Scan avec les consignes pour l’IA afin de préparer une présentation au conseil d’administration. Cela a complètement changé la façon dont j’ai structuré mon argumentation.", 'Fondatrice d’une jeune entreprise', 'Émirats arabes unis'],
];

export const scanPageCopy = {
  en: {
    eyebrow: 'Satellite Scan · AI literacy',
    intro: 'Notice your communication habits. Use what you learn to give AI clearer instructions, keep your own voice and check its answers.',
    offer: 'A personal communication assessment, a dashboard prepared by a coach, and prompts and exercises to help you practise.',
    buy: 'Get your Satellite Scan — €99.95',
    notice: 'Questionnaire and video guides currently in English. Automatic translations may be inaccurate.',
    includedTitle: 'What is included.',
    included: ['A self-reflection questionnaire: allow about 90 minutes.', 'A dashboard prepared by a coach, normally within 48–72 hours of completion.', 'More than 10 communication prompts, video guides and practice materials.'],
    how: 'How it works.',
    steps: ['Buy your Scan and check your email for the next steps.', 'Complete the questionnaire at your own pace.', 'Use your dashboard and prompts to explore a real task and review what you learn.'],
    voiceTitle: 'Bring your own voice to AI.',
    voice: 'Start with your goal, your preferred tone and what matters to you. Practise turning those choices into a clear request. Read the answer, check it and change what doesn’t fit.',
    privacy: 'Share only what an AI tool needs. Leave out private client or workplace information.',
    faqTitle: 'Your questions.',
    faq: [
      { question: 'Is coaching included?', answer: 'Training and coaching are booked separately. The Scan supports personal reflection and practice; it does not train an AI model for you.' },
      { question: 'What do the results tell me?', answer: 'They describe patterns in your own responses. Use them for reflection and coaching, rather than hiring or performance reviews.' },
      { question: 'Can I use this without AI?', answer: 'Yes. Use your dashboard and practice materials to reflect on communication with people. AI prompts are another way to explore, not a requirement.' },
      { question: 'Can I repeat the Scan?', answer: 'You can take the Scan again to reflect on how your own responses change. Differences are prompts for discussion, not proof of measured ability or improvement.' },
    ],
    framework: 'Explore the communication framework',
    frameworkText: 'The Scan explores self-reported communication patterns across eight lenses: Influence, Attitude, Chaordic, Flow, Alignment, Needs, Ego and Dynamics. Use these perspectives to notice habits, prepare conversations and choose something to practise.',
    frameworkLink: 'Explore the Periodic Table',
    situations: 'Start with a situation you recognise',
    situationsText: 'A difficult “no”, a misunderstood message, conflicting priorities or a conversation you keep putting off. Notice what happens now, choose a small change and reflect on what happens next. Practice and coaching—not a score alone—support change.',
    compare: 'How is this different from a personality test?',
    compareText: 'The Scan is structured self-reflection, not a diagnosis or a fixed personality label. It describes how you see your communication today. It does not predict job performance or objectively measure how others experience you.',
    resources: 'Keep practising',
    resourcesText: 'Use the communication prompts, video guides, Periodic Table poster, micro-habit templates and worksheets with your dashboard. Choose what helps your current task.',
    resourcesLink: 'Explore communication resources',
    testimonials: 'Experiences shared by participants',
    translation: '',
    guaranteeTitle: '14-Day Satisfaction Guarantee',
    guarantee: "If after receiving your personalized dashboard you feel the Satellite Scan didn't provide valuable insight, contact us within 14 days for a full refund. No questions asked.",
    terms: 'Terms of service', privacyLink: 'Privacy policy',
    training: 'Discuss your training needs', more: 'Explore your Scan',
    freeTitle: 'Try a small first step.',
    freeText: 'Reflect on motivation, perceived challenge and confidence in a situation you choose. No email is required.',
    freeLink: 'Take the free Flow Check',
  },
  fr: {
    eyebrow: 'Satellite Scan · Apprendre à utiliser l’IA',
    intro: 'Repérez vos habitudes de communication. Appuyez-vous sur ce que vous découvrez pour donner des consignes plus claires à l’IA, garder votre propre voix et vérifier ses réponses.',
    offer: 'Un bilan personnel de communication, un tableau de bord préparé par un coach, et des consignes et exercices pour pratiquer.',
    buy: 'Acheter votre Satellite Scan — 99,95 €',
    notice: 'Questionnaire et guides vidéo actuellement en anglais. Les traductions automatiques peuvent être inexactes.',
    includedTitle: 'Ce qui est inclus.',
    included: ['Un questionnaire de réflexion personnelle : prévoyez environ 90 minutes.', 'Un tableau de bord préparé par un coach, normalement sous 48 à 72 heures après le questionnaire.', 'Plus de 10 consignes pour l’IA, des guides vidéo et des exercices de communication.'],
    how: 'Comment ça marche.',
    steps: ['Achetez votre Scan, puis consultez les prochaines étapes dans votre boîte mail.', 'Répondez au questionnaire à votre rythme.', 'Utilisez votre tableau de bord et les consignes pour essayer une tâche réelle et faire le point.'],
    voiceTitle: 'Gardez votre voix dans vos échanges avec l’IA.',
    voice: 'Partez de votre objectif, du ton souhaité et de ce qui compte pour vous. Entraînez-vous à transformer ces repères en une demande claire. Lisez la réponse, vérifiez-la et changez ce qui ne vous convient pas.',
    privacy: 'Ne partagez avec un outil d’IA que les informations nécessaires. Écartez les données privées de vos clients ou de votre travail.',
    faqTitle: 'Vos questions.',
    faq: [
      { question: 'Le coaching est-il inclus ?', answer: 'La formation et le coaching se réservent séparément. Le Scan vous aide à réfléchir et à pratiquer ; il n’entraîne pas de modèle d’IA pour vous.' },
      { question: 'Que m’apprennent les résultats ?', answer: 'Ils décrivent des tendances dans vos propres réponses. Utilisez-les pour la réflexion personnelle et le coaching, plutôt que pour le recrutement ou l’évaluation au travail.' },
      { question: 'Puis-je l’utiliser sans IA ?', answer: 'Oui. Utilisez votre tableau de bord et vos exercices pour réfléchir à vos échanges avec les autres. Les consignes pour l’IA sont une autre piste, pas une obligation.' },
      { question: 'Puis-je refaire le Scan ?', answer: 'Vous pouvez refaire le Scan pour réfléchir à l’évolution de vos propres réponses. Les différences ouvrent une discussion ; elles ne prouvent pas une capacité mesurée ni un progrès.' },
    ],
    framework: 'Explorer le cadre de communication',
    frameworkText: 'Le Scan explore vos habitudes de communication déclarées selon huit perspectives : Influence, Attitude, Chaordique, Fluidité, Alignement, Besoins, Ego et Dynamiques. Utilisez-les pour repérer vos habitudes, préparer des conversations et choisir un point à travailler.',
    frameworkLink: 'Explorer le Tableau périodique (en anglais)',
    situations: 'Partez d’une situation que vous reconnaissez',
    situationsText: 'Un « non » difficile, un message mal compris, des priorités contradictoires ou une conversation sans cesse repoussée. Observez ce qui se passe, essayez un petit changement et faites le point. La pratique et le coaching, plutôt qu’un score seul, soutiennent le changement.',
    compare: 'En quoi est-ce différent d’un test de personnalité ?',
    compareText: 'Le Scan est une réflexion personnelle structurée, pas un diagnostic ni une étiquette de personnalité. Il décrit votre perception actuelle de votre communication. Il ne prédit pas la performance au travail et ne mesure pas objectivement la façon dont les autres vous perçoivent.',
    resources: 'Continuer à pratiquer',
    resourcesText: 'Utilisez les consignes de communication, les guides vidéo, l’affiche du Tableau périodique, les modèles de micro-habitudes et les fiches d’exercices avec votre tableau de bord. Choisissez ce qui vous aide pour votre tâche actuelle.',
    resourcesLink: 'Explorer les ressources de communication (en anglais)',
    testimonials: 'Expériences partagées par des participants',
    translation: 'Traductions des témoignages en anglais.',
    guaranteeTitle: 'Garantie de satisfaction de 14 jours',
    guarantee: 'Si, après avoir reçu votre tableau de bord personnalisé, vous estimez que le Satellite Scan ne vous a pas apporté d’éclairage utile, contactez-nous sous 14 jours pour un remboursement intégral. Sans justification à fournir.',
    terms: 'Conditions de service (en anglais)', privacyLink: 'Politique de confidentialité (en anglais)',
    training: 'Parlons de vos besoins de formation', more: 'Découvrir votre Scan',
    freeTitle: 'Essayez un premier petit pas.',
    freeText: 'Faites le point sur votre motivation, le défi perçu et votre confiance dans une situation de votre choix. Aucune adresse e-mail n’est nécessaire.',
    freeLink: 'Faire le bilan de fluidité gratuit (en anglais)',
  },
};

export function renderScanPage(language: ScanLanguage): string {
  const c = scanPageCopy[language], acx = scanLiteracy[language];
  const checkout = `${localPage('/checkout', language)}?product=satellitescan&lang=${language}`;
  const buy = (position: string) => `<div class="ge-cta-group"><a class="button" href="${e(checkout)}" data-testid="button-get-scan-${position}">${e(c.buy)} <span aria-hidden="true">↗</span></a><p class="ge-note scan-language-notice">${e(c.notice)}</p></div>`;
  const detail = (title: string, text: string, link?: [string,string]) => `<details><summary>${e(title)}</summary><p>${e(text)}</p>${link ? `<p><a class="text-link" href="${link[0]}">${e(link[1])} →</a></p>` : ''}</details>`;
  return `<article class="ge-landing ge-scan" data-testid="page-scan">
    <section class="ge-landing-hero ge-scan-hero"><div class="wrap"><p class="eyebrow">${e(c.eyebrow)}</p><h1>${e(acx.title)}</h1><p class="ge-lead">${e(c.intro)}</p>${buy('hero')}<p class="ge-note">${e(c.offer)}</p><a class="ge-scroll" href="#scan-more">${e(c.more)} <span aria-hidden="true">↓</span></a></div></section>
    ${renderRestoredScanSections(language)}
    <section class="ge-band"><div class="section wrap ge-split"><div><h2>${e(c.voiceTitle)}</h2><p>${e(c.voice)}</p><p class="ge-note">${e(c.privacy)}</p></div><div><h2>${e(c.how)}</h2><ol class="ge-scan-steps">${c.steps.map(item=>`<li>${e(item)}</li>`).join('')}</ol></div></div></section>
    <section class="section wrap"><h2>${e(acx.levelsTitle)}</h2><p>${e(acx.levelsIntro)}</p><div class="ge-acx-links">${acx.levels.map(([title,text],i)=>`<div><a class="ge-acx-link" href="${localPage(`/blog/acx-levels-ai-literacy#acx-${i+1}`,language)}"><img src="/images/acx/acx-${i+1}-outline.svg" width="44" height="44" alt=""><span>ACX ${i+1}<strong>${e(title)}</strong></span></a><p>${e(text)}</p></div>`).join('')}</div><a class="text-link" href="${localPage('/blog/acx-levels-ai-literacy',language)}">${e(acx.guide)} →</a></section>
    <section class="ge-band"><div class="section wrap ge-split"><h2>${e(c.faqTitle)}</h2><div class="ge-questions">
      ${restoredScan[language].FAQ_ITEMS.map(item=>detail(item.question,item.answer,'linkUrl' in item && item.linkUrl ? [item.linkUrl,item.linkText!] : undefined)).join('')}
      ${c.faq.filter((_,i)=>i===0||i===2).map(item=>detail(item.question,item.answer)).join('')}
      ${detail(c.framework,c.frameworkText,['/periodic-table',c.frameworkLink])}
      ${detail(c.situations,c.situationsText)}${detail(c.compare,c.compareText)}
      ${detail(c.resources,c.resourcesText,['/resources',c.resourcesLink])}
    </div></div></section>
    <section class="section wrap" id="scan-testimonials"><h2>${e(c.testimonials)}</h2>${c.translation ? `<p class="ge-note">${e(c.translation)}</p>` : ''}<div class="ge-scan-quotes">${testimonials.map((t,i)=>`<figure><blockquote>${e(language==='fr'?frenchTestimonials[i][0]:t.quote)}</blockquote><figcaption>${e(t.name)} · ${e(language==='fr'?frenchTestimonials[i][1]:t.role)}, ${e(language==='fr'?frenchTestimonials[i][2]:t.country)}</figcaption></figure>`).join('')}</div></section>
    ${renderRestoredProcess(language)}
    <section class="section wrap ge-landing-close"><h2>${e(c.guaranteeTitle)}</h2><p>${e(c.guarantee)}</p>${buy('closing')}<p class="ge-note ge-terms"><a href="/terms">${e(c.terms)}</a><a href="/privacy">${e(c.privacyLink)}</a></p><a class="text-link" href="${DISCOVERY_URL}" target="_blank" rel="noopener noreferrer">${e(c.training)} ↗</a></section>
    <section class="ge-band"><div class="section wrap"><h2>${e(c.freeTitle)}</h2><p>${e(c.freeText)}</p><div class="ge-cta-group"><a class="text-link" href="/flow-check">${e(c.freeLink)} →</a></div></div></section>
  </article>`;
}
