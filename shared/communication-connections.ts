import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Compass, UsersRound, MessageSquare, Workflow } from 'lucide-react';

// Teaching connections across ACX levels, not four levels or personality types.
export const COMMUNICATION_CONNECTIONS = {
  en: {
    title: 'Who is communicating?',
    intro: 'The same clear intention helps in four kinds of connection.',
    labels: ['With yourself', 'With people', 'With AI', 'Between AI tools'],
    meanings: ['Human to Self', 'Human to Human', 'Human to AI', 'AI to AI'],
    examples: ['Name what you need before you reply.', 'Check that you mean the same thing.', 'Give a goal and tone; review the answer.', 'Approve what one tool passes to another.'],
    note: 'These connections can appear at several ACX levels. Start with one useful conversation.',
  },
  fr: {
    title: 'Qui communique avec qui ?',
    intro: 'Une intention claire aide dans quatre types de liens.',
    labels: ['Avec vous-même', 'Avec les autres', 'Avec l’IA', 'Entre outils d’IA'],
    meanings: ['Human to Self · De soi à soi', 'Human to Human · Entre personnes', 'Human to AI · De l’humain à l’IA', 'AI to AI · D’une IA à une autre'],
    examples: ['Nommez votre besoin avant de répondre.', 'Vérifiez que vous vous comprenez.', 'Précisez le but et le ton ; relisez la réponse.', 'Validez ce qui passe d’un outil à l’autre.'],
    note: 'Ces liens existent à plusieurs niveaux ACX. Commencez par un échange utile.',
  },
} as const;

export const CONNECTION_CODES = ['H2S', 'H2H', 'HAI', 'A2A'] as const;
const icons = [Compass, UsersRound, MessageSquare, Workflow];
export function renderCommunicationConnections(language: 'en' | 'fr', id: string, examples?: readonly string[]): string {
  const c = COMMUNICATION_CONNECTIONS[language];
  return renderToStaticMarkup(h('div', { className: 'communication-connections', id },
    h('h3', null, c.title), h('p', null, c.intro),
    h('ul', { className: 'communication-connection-grid', role: 'list' }, ...c.labels.map((label, i) =>
      h('li', { key: CONNECTION_CODES[i] },
        h('span', { className: 'connection-icon' }, h(icons[i], { size: 32, strokeWidth: 1.5, 'aria-hidden': true, focusable: false })),
        h('span', { className: 'connection-code' }, CONNECTION_CODES[i]),
        h('span', { className: 'connection-expansion' }, c.meanings[i]),
        h('h4', null, label), h('p', null, examples?.[i] ?? c.examples[i])))),
    h('p', { className: 'connection-note' }, c.note)));
}

// Candidate tasks reuse each existing coaching page’s subject and human checks.
export const COACHING_CONNECTION_EXAMPLES: Record<string, readonly string[]> = {
  'lifetime-archive': ['Choose what your archive should pass on.', 'Ask a reader which parts need context.', 'Ask AI for a draft outline from approved extracts.', 'Check source references before passing a draft to a second tool.'],
  'next-chapter-business': ['Name the idea you want to test.', 'Ask someone what problem they need solved.', 'Ask AI to help draft questions for a first conversation.', 'Approve the notes before another tool drafts a next-step plan.'],
  'everyday-confidence': ['Choose one everyday task that matters.', 'Check a message with the person it is for.', 'Ask AI for a short draft, then adjust the tone.', 'Check a draft before moving it to another tool.'],
  'facilitators-and-coaches': ['Name the purpose of your session.', 'Check what participants need from it.', 'Ask AI to help draft a session plan from a fictional brief.', 'Review approved notes before another tool prepares follow-up actions.'],
  'experienced-specialists': ['Define what a useful result looks like in your work.', 'Agree the review criteria with a colleague.', 'Ask AI for a summary of a public or approved sample report.', 'Check the sources before passing a summary to the next tool.'],
};
