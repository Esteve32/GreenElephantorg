// Server-side package catalog for secure price validation
export const COACHING_PACKAGES = {
  '1on1-single': {
    name: "1:1 Single Session",
    price: 180, // EUR
    features: [
      "90-minute deep-dive session",
      "Personalized framework analysis",
      "Action plan with 3 micro-habits",
      "Session recording & transcript"
    ]
  },
  '1on1-package': {
    name: "1:1 Transformation Package",
    price: 840, // EUR
    savings: "Save €240 vs. single sessions",
    features: [
      "6 x 90-minute sessions over 3 months",
      "Complete periodic table mastery",
      "Weekly practice assignments",
      "Email support between sessions",
      "Lifetime access to session recordings"
    ]
  },
  'team-workshop': {
    name: "Team Workshop",
    price: 1200, // EUR
    savings: "€120/person for 10 participants",
    features: [
      "Half-day intensive for up to 10 people",
      "Live framework mapping exercise",
      "Team communication audit",
      "Custom micro-habit playbook",
      "30-day follow-up session included"
    ]
  }
} as const;

export type PackageId = keyof typeof COACHING_PACKAGES;
