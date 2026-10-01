/** Pure rendering for review/testing; no provider, database or application startup. */
export type ScanEmailLanguage = "en" | "fr";
export interface ScanResultDraft {
  kind: "completion" | "raw-data" | "dashboard";
  language?: ScanEmailLanguage;
  name?: string | null;
  rawData?: Record<string, unknown>;
  submittedAt?: string;
  docUrl?: string;
  reportText?: string;
}
export function escapeEmailHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]!));
}
export function dashboardHttpsUrl(value: string): string {
  if (typeof value !== "string" || /[\u0000-\u0020]/.test(value)) throw new Error("invalid_dashboard_url");
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password) throw new Error("invalid_dashboard_url");
  return url.href;
}
export function serializeScanAnswers(data: Record<string, unknown>): string {
  return Object.entries(data).map(([question, answer]) => `${question}\n${typeof answer === "string" ? answer : JSON.stringify(answer) ?? ""}`).join("\n\n");
}
export function renderScanResultDraft(data: ScanResultDraft) {
  const fr = data.language === "fr";
  const dashboard = data.kind === "dashboard";
  const completion = data.kind === "completion";
  const title = dashboard ? (fr ? "Votre tableau de bord est prêt" : "Your dashboard is ready") : (fr ? "Vos réponses au Satellite Scan" : "Your Satellite Scan responses");
  const subject = `${title} — GreenElephant`;
  const subtitle = dashboard ? (fr ? "Vos pistes de réflexion et de pratique" : "Your reflection and practice guide") : (fr ? "Une copie à lire et à conserver" : "A copy to read and keep");
  const greeting = fr ? `Bonjour${data.name ? ` ${data.name}` : ""},` : `Hello${data.name ? ` ${data.name}` : ""},`;
  const intro = dashboard
    ? (fr ? "Votre coach a préparé votre tableau de bord. Ouvrez le lien ci-dessous pour le consulter. Le résumé est aussi disponible dans cet e-mail." : "Your coach has prepared your dashboard. Open the link below to view it. You can also read the summary in this email.")
    : (fr ? "Voici une copie de vos réponses. Elles décrivent votre point de vue au moment du questionnaire. Ce ne sont pas des résultats de diagnostic." : "Here is a copy of your responses. They describe your view when you filled in the Scan. They are not diagnostic results.");
  const timeline = completion ? (fr ? "La prochaine étape est la préparation de votre tableau de bord par un coach. Le délai prévu est de 48 à 72 heures après le questionnaire." : "The next step is for a coach to prepare your dashboard. The expected time is 48–72 hours after you complete the Scan.") : "";
  const copyHelp = fr ? "Pour copier vos réponses, sélectionnez le texte du bloc ci-dessous, puis choisissez Copier. Sur mobile, un appui long peut ouvrir cette option. Une copie complète au format texte est aussi jointe à cet e-mail. Ce bloc est du texte simple, sans bouton interactif." : "To copy your responses, select the text in the box below, then choose Copy. On a phone, press and hold to find this option. A complete text copy is also attached to this email. This is a plain text box, without an interactive button.";
  const privacy = fr ? "Avant de partager des réponses avec un outil d’IA, retirez les noms et les détails privés. Vérifiez ses règles de confidentialité et ne partagez que ce qui est utile. Vous choisissez ce que vous partagez et vérifiez les réponses de l’IA." : "Before sharing responses with an AI tool, remove names and private details. Check its privacy settings and share only what is needed. You choose what to share and check the AI’s answers.";
  const heading = dashboard ? (fr ? "Résumé de votre coach" : "Your coach’s summary") : (fr ? "Vos réponses à copier" : "Your responses to copy");
  const content = dashboard ? (data.reportText || (fr ? "Consultez votre tableau de bord pour lire votre rapport." : "Open your dashboard to read your report.")) : serializeScanAnswers(data.rawData ?? {});
  const url = dashboard ? dashboardHttpsUrl(data.docUrl ?? "") : "https://greenelephant.org/resources";
  const linkLabel = dashboard ? (fr ? "Ouvrir mon tableau de bord" : "Open my dashboard") : (fr ? "Voir les ressources et les prompts (en anglais)" : "Explore resources and prompts");
  const support = fr ? "Une question ? Répondez à cet e-mail pour contacter votre coach." : "Have a question? Reply to this email to contact your coach.";
  const footer = fr ? "Cet e-mail concerne votre Satellite Scan ou le tableau de bord préparé par votre coach." : "This email relates to your Satellite Scan or the dashboard prepared by your coach.";
  const submitted = data.submittedAt ? `${fr ? "Questionnaire envoyé le" : "Submitted"}: ${data.submittedAt}` : "";
  const paragraphs = [greeting, intro, timeline, dashboard ? "" : copyHelp].filter(Boolean);
  const bodyHtml = paragraphs.map(text => `<p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 16px;">${escapeEmailHtml(text)}</p>`).join("")
    + `<h2 style="color:#e0e0e0;font-size:18px;">${heading}</h2><pre style="white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;font:14px/1.7 monospace;background:#111;color:#e0e0e0;border:1px solid #333;border-radius:8px;padding:18px;">${escapeEmailHtml(content)}</pre>`
    + `<p style="color:#cccccc;font-size:14px;line-height:1.7;">${escapeEmailHtml(privacy)}</p><p><a href="${escapeEmailHtml(url)}" style="color:#009999;font-weight:bold;">${linkLabel}</a></p><p style="color:#cccccc;font-size:14px;line-height:1.7;">${support}</p>`
    + (submitted ? `<p style="color:#aaa;font-size:12px;">${escapeEmailHtml(submitted)}</p>` : "");
  const text = [...paragraphs, heading, content, privacy, `${linkLabel}: ${url}`, support, submitted, footer].filter(Boolean).join("\n\n");
  return { subject, title, subtitle, bodyHtml, text, footer, downloadText: content, filename: dashboard ? "satellite-scan-dashboard-summary.txt" : "satellite-scan-responses.txt" };
}

/** Acceptance is not delivery. Never include provider payloads in logs. */
export async function acceptScanResultEmail(send: () => Promise<{ data?: { id?: string } | null; error?: unknown }>): Promise<{ accepted: boolean; messageId?: string; errorType?: string }> {
  try {
    const response = await send();
    if (response?.error) return { accepted: false, errorType: "provider_rejected" };
    const id = response?.data?.id;
    if (typeof id !== "string" || !/^[A-Za-z0-9_-]{1,100}$/.test(id)) return { accepted: false, errorType: "invalid_response" };
    return { accepted: true, messageId: id };
  } catch {
    return { accepted: false, errorType: "provider_exception" };
  }
}
