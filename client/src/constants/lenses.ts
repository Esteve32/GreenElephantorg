import { Brain, Users, Target, Lightbulb, Sparkles, Compass, Shield, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type LensType = "ego" | "dynamics" | "influence" | "attitude" | "chaordic" | "flow" | "alignment" | "needs";

export interface LensMetadata {
  value: LensType;
  name: string;
  color: string;
  icon: LucideIcon;
  description: string;
}

export const LENSES: Record<LensType, LensMetadata> = {
  ego: {
    value: "ego",
    name: "Ego",
    color: "bg-ego",
    icon: Brain,
    description: "Understanding conflict triggers"
  },
  dynamics: {
    value: "dynamics",
    name: "Dynamics",
    color: "bg-dynamics",
    icon: Users,
    description: "Relationships & feedback"
  },
  influence: {
    value: "influence",
    name: "Influence",
    color: "bg-influence",
    icon: Target,
    description: "Actions & decisions"
  },
  attitude: {
    value: "attitude",
    name: "Attitude",
    color: "bg-attitude",
    icon: Lightbulb,
    description: "Openness & curiosity"
  },
  chaordic: {
    value: "chaordic",
    name: "Chaordic",
    color: "bg-chaordic",
    icon: Sparkles,
    description: "Balance order & chaos"
  },
  flow: {
    value: "flow",
    name: "Flow",
    color: "bg-flow",
    icon: Compass,
    description: "Natural rhythm & timing"
  },
  alignment: {
    value: "alignment",
    name: "Alignment",
    color: "bg-alignment",
    icon: Shield,
    description: "Values & boundaries"
  },
  needs: {
    value: "needs",
    name: "Needs",
    color: "bg-needs",
    icon: Heart,
    description: "Core human needs"
  }
};

export const LENS_ARRAY = Object.values(LENSES);

export const getLensMetadata = (lens: LensType): LensMetadata => LENSES[lens];
