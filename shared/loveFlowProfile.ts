export const GREEK_LOVE_TYPES = [
  "agape",
  "mania",
  "eros",
  "ludus",
  "pragma",
  "storge",
  "philia",
  "philautia",
] as const;

export type GreekLoveType = (typeof GREEK_LOVE_TYPES)[number];

export const FLOW_OCTANT_STATES = [
  "arousal",
  "flow",
  "control",
  "relaxation",
  "boredom",
  "apathy",
  "worry",
  "anxiety",
] as const;

export type FlowOctantState = (typeof FLOW_OCTANT_STATES)[number];
export type LoveFlowProfile = Record<GreekLoveType, FlowOctantState | null>;

export const EMPTY_LOVE_FLOW_PROFILE: LoveFlowProfile = {
  agape: null,
  mania: null,
  eros: null,
  ludus: null,
  pragma: null,
  storge: null,
  philia: null,
  philautia: null,
};

export const FLOW_STATE_CONTEXT: Record<FlowOctantState, {
  challenge: "low" | "moderate" | "high";
  capacity: "low" | "moderate" | "high";
  proximity: 1 | 2 | 3 | 4 | 5;
}> = {
  flow: { challenge: "high", capacity: "high", proximity: 5 },
  arousal: { challenge: "high", capacity: "moderate", proximity: 4 },
  control: { challenge: "moderate", capacity: "high", proximity: 4 },
  anxiety: { challenge: "high", capacity: "low", proximity: 3 },
  relaxation: { challenge: "low", capacity: "high", proximity: 3 },
  worry: { challenge: "moderate", capacity: "low", proximity: 2 },
  boredom: { challenge: "low", capacity: "moderate", proximity: 2 },
  apathy: { challenge: "low", capacity: "low", proximity: 1 },
};

export function isLoveFlowProfile(candidate: unknown): candidate is LoveFlowProfile {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return false;
  const profile = candidate as Record<string, unknown>;
  if (Object.keys(profile).length !== GREEK_LOVE_TYPES.length) return false;
  return GREEK_LOVE_TYPES.every((love) => {
    const state = profile[love];
    return state === null || FLOW_OCTANT_STATES.includes(state as FlowOctantState);
  });
}
