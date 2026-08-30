export const VALUE_RULES_VERSION = "1.0" as const;

export const VALUE_RULES = [
  { id: "respect", name: "Respect", description: "Honor each person’s boundaries and dignity." },
  { id: "kindness", name: "Kindness", description: "Offer warmth in tone and action." },
  { id: "privacy", name: "Privacy", description: "Protect confidential dyadic discussions." },
  { id: "self-awareness", name: "Self-Awareness", description: "Take responsibility for your own reactions." },
  { id: "curiosity", name: "Curiosity", description: "Ask open questions before making assumptions." },
  { id: "humility", name: "Humility", description: "Stay willing to listen, learn, and adjust." },
  { id: "collective-intelligence", name: "Collective Intelligence", description: "Co-create understanding and solutions together." },
  { id: "social-learning", name: "Social Learning", description: "Grow through shared experience and reflection." },
  { id: "transparency", name: "Transparency", description: "Express needs clearly without hidden agendas." },
] as const;

export type ValueRuleId = (typeof VALUE_RULES)[number]["id"];

export const VALUE_RULE_IDS: readonly ValueRuleId[] = VALUE_RULES.map((rule) => rule.id);

export function includesEveryValueRule(candidate: unknown): candidate is ValueRuleId[] {
  if (!Array.isArray(candidate) || candidate.length !== VALUE_RULE_IDS.length) return false;
  const uniqueRules = new Set(candidate);
  return uniqueRules.size === VALUE_RULE_IDS.length
    && VALUE_RULE_IDS.every((ruleId) => uniqueRules.has(ruleId));
}
