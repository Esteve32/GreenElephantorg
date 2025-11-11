// Server-side package catalog for secure price validation
export const COACHING_PACKAGES = {
  '1on1-single': {
    name: "1:1 Single Session",
    price: 295, // EUR
    features: [
      "120-minute deep-dive session",
      "Personalized framework analysis",
      "Action plan with 3 micro-habits",
      "Session recording & transcript"
    ]
  },
  'coaching-journey': {
    name: "Coaching Journey - Communication Clarity & Influence Boost",
    price: 2980, // EUR
    features: [
      "AI-powered Satellite Scan™ (90 questions, ~120 min)",
      "Clarity & goal-setting session",
      "Biweekly coaching sessions (2 hours each)",
      "Unlimited 20-min check-in calls",
      "Ongoing messaging support",
      "Personalized micro-habit plan",
      "Lens video library access",
      "Support until objectives are reached"
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
