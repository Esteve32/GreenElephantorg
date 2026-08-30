import type { LensType } from "./lenses";

export type MyFiveLoveType =
  | "agape"
  | "mania"
  | "eros"
  | "ludus"
  | "pragma"
  | "storge"
  | "philia"
  | "philautia";

export interface MyFiveLensToken {
  lens: LensType;
  love: MyFiveLoveType;
  label: string;
  loveLabel: string;
  colorName: string;
  hex: `#${string}`;
  cssVariable: `--myfive-lens-${LensType}`;
}

/**
 * DEC-017 synesthetic storytelling map.
 * Lenses remain analytical dimensions; love types remain emotional qualities.
 */
export const MYFIVE_LENS_TOKENS = {
  influence: {
    lens: "influence",
    love: "agape",
    label: "Influence",
    loveLabel: "Agape",
    colorName: "Crimson",
    hex: "#D6133A",
    cssVariable: "--myfive-lens-influence",
  },
  attitude: {
    lens: "attitude",
    love: "mania",
    label: "Attitude",
    loveLabel: "Mania",
    colorName: "Bright Orange",
    hex: "#FF7A30",
    cssVariable: "--myfive-lens-attitude",
  },
  chaordic: {
    lens: "chaordic",
    love: "eros",
    label: "Chaordic",
    loveLabel: "Eros",
    colorName: "Amber",
    hex: "#FFB94F",
    cssVariable: "--myfive-lens-chaordic",
  },
  flow: {
    lens: "flow",
    love: "ludus",
    label: "Flow",
    loveLabel: "Ludus",
    colorName: "Lime Green",
    hex: "#8BB820",
    cssVariable: "--myfive-lens-flow",
  },
  alignment: {
    lens: "alignment",
    love: "pragma",
    label: "Alignment",
    loveLabel: "Pragma",
    colorName: "Forest Green",
    hex: "#17A764",
    cssVariable: "--myfive-lens-alignment",
  },
  needs: {
    lens: "needs",
    love: "storge",
    label: "Needs",
    loveLabel: "Storge",
    colorName: "Blue Teal",
    hex: "#0D8FA3",
    cssVariable: "--myfive-lens-needs",
  },
  ego: {
    lens: "ego",
    love: "philia",
    label: "Ego",
    loveLabel: "Philia",
    colorName: "Sky Blue",
    hex: "#50C0F0",
    cssVariable: "--myfive-lens-ego",
  },
  dynamics: {
    lens: "dynamics",
    love: "philautia",
    label: "Dynamics",
    loveLabel: "Philautia",
    colorName: "Deep Indigo",
    hex: "#3A175B",
    cssVariable: "--myfive-lens-dynamics",
  },
} as const satisfies Record<LensType, MyFiveLensToken>;

export const MYFIVE_LENS_TOKEN_LIST = Object.values(MYFIVE_LENS_TOKENS);
