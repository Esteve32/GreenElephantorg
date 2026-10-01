// Estève approved parking all three surfaces on 2026-10-01 (DEC-AIL-021).
// Keep source components and data; restoration requires a reviewed decision.
export const WEBINARS_PARKED = true;
export const PARKED_WEBINAR_PATHS = ["/webinar", "/webinars", "/calendar"] as const;
export function isParkedWebinar(path: string): boolean {
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, "");
  return WEBINARS_PARKED && PARKED_WEBINAR_PATHS.some(route => route === clean);
}
