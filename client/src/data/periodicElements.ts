import type { LensType } from "@/constants/lenses";

export interface PeriodicElement {
  code: number;
  symbol: string;
  name: string;
  lens: LensType;
  category?: string;
  description?: string;
}

// INFLUENCE LENS (🔴 RED #cc3333) - Code 1100
export const influenceElements: PeriodicElement[] = [
  { code: 1101, symbol: "IS", name: "Influence Strategies", lens: "influence" },
  { code: 1102, symbol: "QC", name: "Quantum Conversations", lens: "influence" },
  { code: 1103, symbol: "GBR", name: "GreenBlueRed™", lens: "influence" },
  { code: 1104, symbol: "PT", name: "Periodic Table", lens: "influence" },
  { code: 1105, symbol: "HUD", name: "Head-Up Display", lens: "influence" },
  { code: 1106, symbol: "FH", name: "Facilitating & Hosting", lens: "influence" },
  { code: 1201, symbol: "Ad", name: "Advising", lens: "influence", category: "SAY & WRITE" },
  { code: 1202, symbol: "RQ", name: "Red Question", lens: "influence", category: "SAY & WRITE" },
  { code: 1203, symbol: "Sg", name: "Suggesting", lens: "influence", category: "SAY & WRITE" },
  { code: 1204, symbol: "Sp", name: "Supporting", lens: "influence", category: "SAY & WRITE" },
  { code: 1205, symbol: "Or", name: "Ordering", lens: "influence", category: "SAY & WRITE" },
  { code: 1206, symbol: "Ag", name: "Agreeing", lens: "influence", category: "SAY & WRITE" },
  { code: 1301, symbol: "RS", name: "Red Silence", lens: "influence", category: "DO & MOVE" },
  { code: 1302, symbol: "RI", name: "Red Intonation", lens: "influence", category: "DO & MOVE" },
  { code: 1303, symbol: "RBL", name: "Red Body-Language", lens: "influence", category: "DO & MOVE" },
  { code: 1304, symbol: "RR", name: "Red Rhythm", lens: "influence", category: "DO & MOVE" },
  { code: 1305, symbol: "RT", name: "Red Timing", lens: "influence", category: "DO & MOVE" },
  { code: 1401, symbol: "Un", name: "Uniting", lens: "influence", category: "FEEL & INTEND" },
  { code: 1402, symbol: "Sd", name: "Seducing", lens: "influence", category: "FEEL & INTEND" },
  { code: 1403, symbol: "FP", name: "Fixing Problems", lens: "influence", category: "FEEL & INTEND" },
  { code: 1404, symbol: "CO", name: "Changing Others", lens: "influence", category: "FEEL & INTEND" },
  { code: 1405, symbol: "TO", name: "Taking Over", lens: "influence", category: "FEEL & INTEND" },
  { code: 1406, symbol: "If", name: "Influencing", lens: "influence", category: "FEEL & INTEND" },
];

// ATTITUDE LENS (🟠 ORANGE #ff9933) - Code 2100
export const attitudeElements: PeriodicElement[] = [
  { code: 2101, symbol: "AC", name: "Attitude to Change", lens: "attitude" },
  { code: 2102, symbol: "LR", name: "Learning Retention", lens: "attitude" },
  { code: 2103, symbol: "MH", name: "Micro-Habits", lens: "attitude" },
  { code: 2104, symbol: "SR", name: "Self-Reflection", lens: "attitude" },
  { code: 2401, symbol: "A0", name: "Attitude 0", lens: "attitude", category: "FEEL & INTEND" },
  { code: 2402, symbol: "AI", name: "Attitude I", lens: "attitude", category: "FEEL & INTEND" },
  { code: 2403, symbol: "AII", name: "Attitude II", lens: "attitude", category: "FEEL & INTEND" },
  { code: 2404, symbol: "AIII", name: "Attitude III", lens: "attitude", category: "FEEL & INTEND" },
];

// CHAORDIC LENS (🟡 YELLOW #ffcc00) - Code 3100
export const chaordicElements: PeriodicElement[] = [
  { code: 3101, symbol: "CB", name: "Chaordic Balance", lens: "chaordic" },
  { code: 3102, symbol: "AC", name: "Algorithm Canvas", lens: "chaordic" },
  { code: 3103, symbol: "TC", name: "Types of Conversation", lens: "chaordic" },
  { code: 3104, symbol: "ST", name: "Small Talk", lens: "chaordic" },
  { code: 3105, symbol: "Fr", name: "Framing", lens: "chaordic" },
  { code: 3106, symbol: "CI", name: "Check-In/Out", lens: "chaordic" },
  { code: 3107, symbol: "DD", name: "Debate & Discussion", lens: "chaordic" },
  { code: 3108, symbol: "ND", name: "Negotiation & Dialogue", lens: "chaordic" },
  { code: 3109, symbol: "Cc", name: "Co-creation", lens: "chaordic" },
  { code: 3110, symbol: "Mp", name: "Marketplace", lens: "chaordic" },
  { code: 3111, symbol: "CR", name: "Chaordic Roles", lens: "chaordic", category: "COLLECTIVELY INTELLIGENT ROLES" },
  { code: 3112, symbol: "Pt", name: "Participant", lens: "chaordic", category: "COLLECTIVELY INTELLIGENT ROLES" },
  { code: 3113, symbol: "Hv", name: "Harvester", lens: "chaordic", category: "COLLECTIVELY INTELLIGENT ROLES" },
  { code: 3114, symbol: "Ht", name: "Host", lens: "chaordic", category: "COLLECTIVELY INTELLIGENT ROLES" },
  { code: 3115, symbol: "Sw", name: "Steward", lens: "chaordic", category: "COLLECTIVELY INTELLIGENT ROLES" },
];

// FLOW LENS (🟢 GREEN #cccc33) - Code 4100
export const flowElements: PeriodicElement[] = [
  { code: 4101, symbol: "MF", name: "Measuring Flow", lens: "flow" },
  { code: 4102, symbol: "CF", name: "Conscious Feedback", lens: "flow" },
  { code: 4103, symbol: "Mt", name: "Motivation", lens: "flow" },
  { code: 4104, symbol: "Ch", name: "Challenge", lens: "flow" },
  { code: 4105, symbol: "Sk", name: "Skill", lens: "flow" },
];

// ALIGNMENT LENS (🟢 GREEN #669966) - Code 5100
export const alignmentElements: PeriodicElement[] = [
  { code: 5101, symbol: "Al", name: "Alignment", lens: "alignment" },
  { code: 5102, symbol: "Cg", name: "Congruence", lens: "alignment" },
  { code: 5103, symbol: "Mn", name: "Meaning", lens: "alignment" },
  { code: 5104, symbol: "Ik", name: "Ikigai", lens: "alignment" },
  { code: 5105, symbol: "Pr", name: "Presencing", lens: "alignment" },
  { code: 5201, symbol: "PP", name: "Positive Phrases", lens: "alignment", category: "SAY & WRITE" },
  { code: 5202, symbol: "GQ", name: "Green Questions", lens: "alignment", category: "SAY & WRITE" },
  { code: 5203, symbol: "Mi", name: "Mirroring", lens: "alignment", category: "SAY & WRITE" },
  { code: 5204, symbol: "Su", name: "Summarising", lens: "alignment", category: "SAY & WRITE" },
  { code: 5205, symbol: "AA", name: "Accusation Audit", lens: "alignment", category: "SAY & WRITE" },
  { code: 5206, symbol: "Uk", name: "Unlocking", lens: "alignment", category: "SAY & WRITE" },
  { code: 5207, symbol: "Lb", name: "Labelling", lens: "alignment", category: "SAY & WRITE" },
  { code: 5208, symbol: "El", name: "Elephant", lens: "alignment", category: "SAY & WRITE" },
  { code: 5301, symbol: "GS", name: "Green Silence", lens: "alignment", category: "DO & MOVE" },
  { code: 5302, symbol: "GI", name: "Green Intonation", lens: "alignment", category: "DO & MOVE" },
  { code: 5303, symbol: "GBL", name: "Green Body-Language", lens: "alignment", category: "DO & MOVE" },
  { code: 5304, symbol: "GR", name: "Green Rhythm", lens: "alignment", category: "DO & MOVE" },
  { code: 5305, symbol: "GT", name: "Green Timing", lens: "alignment", category: "DO & MOVE" },
  { code: 5401, symbol: "Kd", name: "Kindness", lens: "alignment", category: "FEEL & INTEND" },
  { code: 5402, symbol: "Rs", name: "Respect", lens: "alignment", category: "FEEL & INTEND" },
  { code: 5403, symbol: "BT", name: "Building Trust", lens: "alignment", category: "FEEL & INTEND" },
  { code: 5404, symbol: "Em", name: "Empathy", lens: "alignment", category: "FEEL & INTEND" },
  { code: 5405, symbol: "Cr", name: "Curiosity", lens: "alignment", category: "FEEL & INTEND" },
  { code: 5406, symbol: "Ap", name: "Agape", lens: "alignment", category: "FEEL & INTEND" },
];

// NEEDS LENS (🟢 GREEN #009999) - Code 6100
export const needsElements: PeriodicElement[] = [
  { code: 6101, symbol: "CN", name: "Chakra Needs", lens: "needs" },
  { code: 6102, symbol: "HN", name: "Hierarchy of Needs", lens: "needs" },
  { code: 6103, symbol: "As", name: "Assumptions", lens: "needs" },
  { code: 6104, symbol: "FC", name: "Functional Conflicts", lens: "needs" },
  { code: 6105, symbol: "TL", name: "Types of Love", lens: "needs" },
  { code: 6106, symbol: "ST", name: "Stages of Team", lens: "needs" },
  { code: 6201, symbol: "CR", name: "Conscious Request", lens: "needs", category: "SAY & WRITE" },
  { code: 6401, symbol: "PS", name: "Psychological Safety", lens: "needs", category: "FEEL & INTEND" },
  { code: 6402, symbol: "St", name: "Storge", lens: "needs", category: "FEEL & INTEND" },
  { code: 6403, symbol: "Ma", name: "Mania", lens: "needs", category: "FEEL & INTEND" },
  { code: 6404, symbol: "Er", name: "Eros", lens: "needs", category: "FEEL & INTEND" },
  { code: 6405, symbol: "Ph", name: "Philia", lens: "needs", category: "FEEL & INTEND" },
  { code: 6406, symbol: "Lu", name: "Ludus", lens: "needs", category: "FEEL & INTEND" },
];

// EGO LENS (🔵 BLUE #3399cc) - Code 7100
export const egoElements: PeriodicElement[] = [
  { code: 7101, symbol: "ET", name: "Ego Triggers", lens: "ego" },
  { code: 7102, symbol: "DT", name: "Drama Triangle", lens: "ego" },
  { code: 7103, symbol: "Ex", name: "Expressing", lens: "ego" },
  { code: 7104, symbol: "CB", name: "Consciousness Barrier", lens: "ego" },
  { code: 7105, symbol: "PB", name: "Permission Barrier", lens: "ego" },
  { code: 7106, symbol: "SB", name: "Sensorial Barrier", lens: "ego" },
  { code: 7107, symbol: "LB", name: "Language Barrier", lens: "ego" },
  { code: 7108, symbol: "TB", name: "Tangibility Barrier", lens: "ego" },
  { code: 7109, symbol: "EH", name: "Ego Hats", lens: "ego", category: "EGO ROLES" },
  { code: 7110, symbol: "Ip", name: "Interpretor", lens: "ego", category: "EGO ROLES" },
  { code: 7111, symbol: "Ig", name: "Interrogator", lens: "ego", category: "EGO ROLES" },
  { code: 7112, symbol: "Jd", name: "Judge", lens: "ego", category: "EGO ROLES" },
  { code: 7113, symbol: "DA", name: "Devil's Advocate", lens: "ego", category: "EGO ROLES" },
  { code: 7114, symbol: "Hr", name: "Hero", lens: "ego", category: "EGO ROLES" },
  { code: 7115, symbol: "Nr", name: "Narrator", lens: "ego", category: "EGO ROLES" },
  { code: 7116, symbol: "Hm", name: "Hermit", lens: "ego", category: "EGO ROLES" },
  { code: 7117, symbol: "At", name: "Artisan", lens: "ego", category: "EGO ROLES" },
  { code: 7201, symbol: "In", name: "Informing", lens: "ego", category: "SAY & WRITE" },
  { code: 7202, symbol: "BQ", name: "Blue Question", lens: "ego", category: "SAY & WRITE" },
  { code: 7203, symbol: "Jg", name: "Judging", lens: "ego", category: "SAY & WRITE" },
  { code: 7204, symbol: "Pj", name: "Projecting", lens: "ego", category: "SAY & WRITE" },
  { code: 7205, symbol: "Ap", name: "Apologising", lens: "ego", category: "SAY & WRITE" },
  { code: 7206, symbol: "Sy", name: "Storytelling", lens: "ego", category: "SAY & WRITE" },
  { code: 7301, symbol: "BS", name: "Blue Silence", lens: "ego", category: "DO & MOVE" },
  { code: 7302, symbol: "BI", name: "Blue Intonation", lens: "ego", category: "DO & MOVE" },
  { code: 7303, symbol: "BBL", name: "Blue Body-Language", lens: "ego", category: "DO & MOVE" },
  { code: 7304, symbol: "BR", name: "Blue Rhythm", lens: "ego", category: "DO & MOVE" },
  { code: 7305, symbol: "BT", name: "Blue Timing", lens: "ego", category: "DO & MOVE" },
  { code: 7401, symbol: "Ln", name: "Learning", lens: "ego", category: "THINK & UNDERSTAND" },
  { code: 7402, symbol: "Pg", name: "Pragmatism", lens: "ego", category: "THINK & UNDERSTAND" },
  { code: 7403, symbol: "Pl", name: "Philautia", lens: "ego", category: "THINK & UNDERSTAND" },
  { code: 7404, symbol: "Eg", name: "Ego", lens: "ego", category: "THINK & UNDERSTAND" },
  { code: 7405, symbol: "Gt", name: "Gratitude", lens: "ego", category: "THINK & UNDERSTAND" },
  { code: 7406, symbol: "Rb", name: "Responsibilities", lens: "ego", category: "THINK & UNDERSTAND" },
];

// DYNAMICS LENS (🟣 PURPLE #666699) - Code 8100
export const dynamicsElements: PeriodicElement[] = [
  { code: 8101, symbol: "RD", name: "Relationship Dynamics", lens: "dynamics" },
  { code: 8102, symbol: "CC", name: "Conscious Consent", lens: "dynamics" },
  { code: 8103, symbol: "YYP", name: "Yin Yang Polarity", lens: "dynamics" },
  { code: 8104, symbol: "RM", name: "Relationship Map", lens: "dynamics" },
  { code: 8105, symbol: "RR", name: "Relationship Ritual", lens: "dynamics" },
  { code: 8201, symbol: "SN", name: "Saying No", lens: "dynamics", category: "SAY & WRITE" },
  { code: 8401, symbol: "Fg", name: "Forgiveness", lens: "dynamics", category: "FEEL & INTEND" },
];

export const ALL_ELEMENTS: PeriodicElement[] = [
  ...influenceElements,
  ...attitudeElements,
  ...chaordicElements,
  ...flowElements,
  ...alignmentElements,
  ...needsElements,
  ...egoElements,
  ...dynamicsElements,
].sort((a, b) => a.code - b.code);

export const getElementByCode = (code: number): PeriodicElement | undefined => 
  ALL_ELEMENTS.find(el => el.code === code);

export const getElementsByLens = (lens: LensType): PeriodicElement[] => 
  ALL_ELEMENTS.filter(el => el.lens === lens);

export const getElementsByCategory = (category: string): PeriodicElement[] => 
  ALL_ELEMENTS.filter(el => el.category === category);
