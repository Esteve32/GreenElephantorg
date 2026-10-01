/** Preserve answers before they reach email rendering; no scoring or interpretation. */
export function appendScanAnswer(target: Record<string, string>, title: string, value: string): void {
  let key = title;
  let index = 2;
  while (Object.hasOwn(target, key)) key = `${title} (${index++})`;
  Object.defineProperty(target, key, { value, enumerable: true, writable: true, configurable: true });
}
export function typeformAnswerValue(answer: Record<string, any>): string {
  const scalar = (value: unknown) => value == null ? "" : String(value);
  switch (answer.type) {
    case "text": case "short_text": case "long_text": return scalar(answer.text);
    case "email": return scalar(answer.email);
    case "number": return scalar(answer.number);
    case "boolean": return typeof answer.boolean === "boolean" ? (answer.boolean ? "Yes" : "No") : "";
    case "choice": return [answer.choice?.label, answer.choice?.other].filter(value => value != null && value !== "").map(scalar).join(", ");
    case "choices": return [...(Array.isArray(answer.choices?.labels) ? answer.choices.labels : []), answer.choices?.other].filter(value => value != null && value !== "").map(scalar).join(", ");
    case "date": return scalar(answer.date);
    case "url": return scalar(answer.url);
    case "file_url": return scalar(answer.file_url);
    case "payment": return [answer.payment?.amount, answer.payment?.currency].filter(value => value != null).map(scalar).join(" ");
    // Preserve unfamiliar response types without interpreting them.
    default: return JSON.stringify(answer) ?? "";
  }
}
