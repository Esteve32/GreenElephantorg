export const atmosphericPalette = {
  space: "#0a1628",
  highAtmosphere: "#0a2a48",
  upperAtmosphere: "#0e3d5c",
  midAtmosphere: "#1a6180",
  lowerAtmosphere: "#2784a8",
  skyHorizon: "#3ba4c0",
  horizonWater: "#3d9eb8",
  deepWater: "#2a7a9a",
  abyss: "#000000",
} as const;

export const sectionGradients = {
  whatsIncludedBottom: atmosphericPalette.highAtmosphere,
  landingTop: atmosphericPalette.highAtmosphere,
  landingMid: atmosphericPalette.lowerAtmosphere,
  landingSkyHorizon: atmosphericPalette.skyHorizon,
  footerBlack: atmosphericPalette.abyss,
} as const;

export const landingSectionGradient = `linear-gradient(180deg, 
  ${atmosphericPalette.highAtmosphere} 0%, 
  ${atmosphericPalette.upperAtmosphere} 15%, 
  ${atmosphericPalette.midAtmosphere} 30%, 
  ${atmosphericPalette.lowerAtmosphere} 45%, 
  ${atmosphericPalette.skyHorizon} 60%, 
  transparent 75%
)`;

export const footerFadeGradient = `linear-gradient(to top, 
  ${atmosphericPalette.abyss} 0%, 
  ${atmosphericPalette.abyss}99 40%, 
  transparent 100%
)`;

export const imageMaskStyles = {
  topFade: {
    maskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)",
    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)"
  },
  bottomFade: {
    maskImage: "linear-gradient(to top, transparent 0%, black 25%, black 100%)",
    WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 25%, black 100%)"
  },
  bothFades: {
    maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)"
  }
} as const;
