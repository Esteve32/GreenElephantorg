/**
 * GreenElephant.org — Canonical Brand Kit
 *
 * Source of truth for colours, typography, and brand values.
 * Derived from the official colour palette swatch and HUD dashboard assets.
 *
 * Two distinct colour systems exist:
 *   A) 8 LENS COLOURS  — used to identify each communication lens
 *   B) FLOW ZONE COLOURS — used in the Check-my-FLOW / Csikszentmihalyi model
 *
 * These are intentionally different. Do not conflate them.
 */

// ─── A) 8 LENS COLOURS ───────────────────────────────────────────────────────
// Mapped from the official palette swatch (🔥_no_stars_transparent_background...)
// These match the --lens CSS custom properties in index.css (H S% L% format)

export const LENS_HEX = {
  influence:  "#CC3333",  // Red        — hsl(0,   70%, 55%)
  attitude:   "#E8792A",  // Orange     — hsl(30,  100%, 60%)  [brand slightly more muted than CSS]
  chaordic:   "#E8C52A",  // Amber      — hsl(48,  100%, 55%)  [brand slightly more muted than CSS]
  flow:       "#8BB820",  // Lime green — hsl(85,  55%, 50%)   [brand: yellow-green, NOT teal]
  alignment:  "#4F9940",  // Forest grn — hsl(100, 40%, 45%)
  needs:      "#0D8FA3",  // Blue-teal  — hsl(184, 88%, 35%)   [brand is blue-shifted vs pure teal]
  ego:        "#3380CC",  // Sky blue   — hsl(210, 60%, 50%)
  dynamics:   "#5C4E99",  // Indigo     — hsl(260, 35%, 50%)   [brand is darker/richer]
} as const;

// Ordered array — matches the lens order in the Periodic Table
export const LENS_ORDER = [
  "influence", "attitude", "chaordic", "flow",
  "alignment", "needs", "ego", "dynamics"
] as const;

// ─── B) FLOW ZONE COLOURS (Check-my-FLOW / 4-quadrant model) ─────────────────
// These are distinct from lens colours. They map Csikszentmihalyi's 4 zones.

export const ZONE_HEX = {
  flow:      "#009999",  // Teal    — balanced high challenge + competence + motivation
  challenge: "#E67E22",  // Orange  — high challenge, low perceived competence
  comfort:   "#2980B9",  // Blue    — low challenge, high competence (coasting)
  danger:    "#C0392B",  // Red     — low challenge, low competence, low motivation
} as const;

// ─── BACKGROUND / GREYS ──────────────────────────────────────────────────────
// From the HUD dashboard assets — deep navy-black, NOT pure black
// The dashboard assets use navy-tinted darks for a "space/HUD" feel

export const BRAND_BG = {
  deepNavy:   "#0A0C14",  // Primary background (deep space)
  darkNavy:   "#121624",  // Card background
  midNavy:    "#1A2035",  // Elevated surfaces
  panelNavy:  "#2A3355",  // Panel borders / separators
  utilityGrey:"#6E7490",  // Secondary text / muted elements
  nearWhite:  "#E8EAF0",  // Body text on dark backgrounds
} as const;

// ─── BRAND ACCENT ────────────────────────────────────────────────────────────
export const BRAND_ACCENT = {
  highlight:   "#D4AF37",  // Gold/amber — used for "highlight" badges and awards
  white:       "#FFFFFF",
  hudWhite:    "rgba(255,255,255,0.85)",  // Slightly translucent white for HUD text
  hudDim:      "rgba(255,255,255,0.45)",  // Dimmed secondary HUD text
} as const;

// ─── TYPOGRAPHY ──────────────────────────────────────────────────────────────
export const BRAND_FONTS = {
  heading: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
  body:    "'Lato', -apple-system, BlinkMacSystemFont, sans-serif",
} as const;

// ─── EMAIL TEMPLATE ──────────────────────────────────────────────────────────
// For all client-facing branded emails (dark HUD template)
export const BRAND_EMAIL = {
  bgOuter:     "#0a0a0a",
  bgInner:     "#111111",
  bgCard:      "#1a1a1a",
  accent:      "#009999",  // Needs/teal as primary email accent
  textPrimary: "#f0f0f0",
  textMuted:   "#888888",
  borderColor: "#333333",
  footerText:  "#555555",
} as const;

// ─── NOTES & RATIONALE ───────────────────────────────────────────────────────
/**
 * KEY INSIGHT: The brand background should be deep navy (#0A0C14),
 * not pure black (#000000). The HUD dashboard assets consistently use
 * a blue-tinted near-black that reads as "space" rather than void.
 * Current web uses #030508 which is close but could be warmer.
 *
 * FLOW LENS vs FLOW ZONE:
 * - Flow LENS color = lime/yellow-green (#8BB820) — the 4th of 8 communication lenses
 * - Flow ZONE color = teal (#009999) — the optimal state in Csikszentmihalyi's model
 * These will co-exist in the UI and must remain visually distinct.
 *
 * NEEDS lens = blue-teal (#0D8FA3) — the brand swatch shows a distinctly
 * blue-shifted teal, not the pure cyan (#009999) currently in CSS.
 * The current --needs: 180 100% 35% is pure cyan and should migrate toward
 * hsl(184, 88%, 35%) for a closer match.
 */
