import { escapeEmailHtml, type ScanEmailLanguage } from './scan-results-email';

export function renderDataExportEmail(
  name: string | null,
  exportData: { timeline: unknown[]; context: Record<string, string> },
  language: ScanEmailLanguage = 'en',
) {
  const fr = language === 'fr';
  const serialized = JSON.stringify(exportData, null, 2);
  const preview = serialized.slice(0, 3000);
  const clipped = preview.length < serialized.length;
  const title = fr ? 'Votre export de données Green Elephant' : 'Your Green Elephant data export';
  const intro = fr
    ? `Bonjour${name ? ` ${name}` : ''}, le fichier JSON joint contient votre historique de communication (${exportData.timeline.length} événements) et vos préférences enregistrées.`
    : `Hello${name ? ` ${name}` : ''}, the attached JSON file contains your communication history (${exportData.timeline.length} events) and your saved preferences.`;
  const explanation = fr
    ? 'Le bloc ci-dessous est un aperçu. Ouvrez le fichier greenelephant-data-export.json joint pour consulter toutes les données de cet export. Conservez-le dans un endroit privé.'
    : 'The box below is a preview. Open the attached greenelephant-data-export.json file to read all the data in this export. Keep it somewhere private.';
  const truncation = clipped ? (fr ? '\n… Aperçu abrégé. Le fichier joint contient toutes les données.' : '\n… Preview shortened. The attachment contains all the data.') : '';
  const support = fr ? 'Si vous n’avez pas demandé cet export, contactez esteve@greenelephant.org.' : 'If you did not request this export, contact esteve@greenelephant.org.';
  const footer = fr ? 'Vous recevez cet e-mail à la suite d’une demande d’export dans votre compte Green Elephant.' : 'You received this email following an export request in your Green Elephant account.';
  return {
    subject: title,
    title,
    subtitle: fr ? 'Un fichier complet à télécharger' : 'A complete file to download',
    bodyHtml: `<p style="color:#ccc;font:15px/1.7 sans-serif;">${escapeEmailHtml(intro)}</p><p style="color:#ccc;font:14px/1.7 sans-serif;">${explanation}</p><pre style="white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;background:#111;color:#ddd;border:1px solid #333;padding:18px;">${escapeEmailHtml(preview + truncation)}</pre><p style="color:#ccc;">${support}</p>`,
    text: [intro, explanation, preview + truncation, support, footer].join('\n\n'),
    footer,
    filename: 'greenelephant-data-export.json',
    attachment: serialized,
  };
}
