import { Brain, Users, Target, Lightbulb, Sparkles, Compass, Shield, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type LensType = "ego" | "dynamics" | "influence" | "attitude" | "chaordic" | "flow" | "alignment" | "needs";

export interface LensMetadata {
  value: LensType;
  name: string;
  color: string;
  hexColor: string;
  icon: LucideIcon;
  description: string;
  code: number;
}

export const LENSES: Record<LensType, LensMetadata> = {
  influence: {
    value: "influence",
    name: "Influence",
    color: "bg-influence",
    hexColor: "#cc3333",
    icon: Target,
    description: "Influence Strategies",
    code: 1100
  },
  attitude: {
    value: "attitude",
    name: "Attitude",
    color: "bg-attitude",
    hexColor: "#ff9933",
    icon: Lightbulb,
    description: "Attitude to Change",
    code: 2100
  },
  chaordic: {
    value: "chaordic",
    name: "Chaordic",
    color: "bg-chaordic",
    hexColor: "#ffcc00",
    icon: Sparkles,
    description: "Chaordic Balance",
    code: 3100
  },
  flow: {
    value: "flow",
    name: "Flow",
    color: "bg-flow",
    hexColor: "#cccc33",
    icon: Compass,
    description: "Measuring Flow",
    code: 4100
  },
  alignment: {
    value: "alignment",
    name: "Alignment",
    color: "bg-alignment",
    hexColor: "#669966",
    icon: Shield,
    description: "Alignment & Empathy",
    code: 5100
  },
  needs: {
    value: "needs",
    name: "Needs",
    color: "bg-needs",
    hexColor: "#009999",
    icon: Heart,
    description: "Chakra Needs",
    code: 6100
  },
  ego: {
    value: "ego",
    name: "Ego",
    color: "bg-ego",
    hexColor: "#3399cc",
    icon: Brain,
    description: "Ego Triggers",
    code: 7100
  },
  dynamics: {
    value: "dynamics",
    name: "Dynamics",
    color: "bg-dynamics",
    hexColor: "#666699",
    icon: Users,
    description: "Relationship Dynamics",
    code: 8100
  }
};

export const LENS_ARRAY = Object.values(LENSES);

export const getLensMetadata = (lens: LensType): LensMetadata => LENSES[lens];
