import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChevronDown, 
  CheckCircle2, 
  Copy, 
  Check, 
  ThumbsUp, 
  Mail, 
  Play, 
  Download,
  ExternalLink,
  Users,
  Sparkles,
  Video,
  Calendar,
  FileText
} from "lucide-react";
import { SiLinkedin, SiOpenai } from "react-icons/si";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { atmosphericPalette } from "@/constants/atmosphericGradient";
import { LENSES, type LensType } from "@/constants/lenses";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import earthImageUrl from "@assets/generated_images/earth_from_space_without_aurora.png";
import provenceImageUrl from "@assets/generated_images/mont_ventoux_provence_lavender_landscape.png";
import logoUrl from "@assets/GE logo 512x512 transparent BG 2023 _1764343412596.png";
import circularCalendarUrl from "@assets/Celestial_calendar🔥2022_extrenal_no_planets_with_legend_no_ik_1764793584893.png";
import periodicTableImageUrl from "@assets/The-Periodic-Table-of-Conscious-Communication@2x_1762813238966.png";
import influenceStrategiesPdfUrl from "@assets/1101 Influence Communication Strategies_1762813220069.pdf";
import greenBlueRedPdfUrl from "@assets/1103 GreenBlueRed™_1762813220070.pdf";
import microHabitPdfUrl from "@assets/2103 Micro-Habit_1762813220070.pdf";
import chaordicRolesPdfUrl from "@assets/3111 Chaordic Roles (5 promises for each level of collective intelligence)_1762813220070.pdf";
import nvcGreenBlueRedPdfUrl from "@assets/6104 NonViolentCommunication + 1103 GreenBlueRed_1762813220070.pdf";
import fiveStagesTeamPdfUrl from "@assets/6106  with the 5 Stages of Team_1762813220070.pdf";
import blueInfographicImageUrl from "@assets/InfographicSummary_BlueBeingUnderstood_slides _vers3.293_1762813339581.jpeg";
import flowMeasuringInfographicUrl from "@assets/4101_Measuring_Flow_1764793076760.png";
import consciousFeedbackInfographicUrl from "@assets/4102_Conscious_Feedback_1764793116577.png";
import relationshipMapInfographicUrl from "@assets/8104_Relationship_Map_How_to_Cultivate_Relations_1764793161248.png";
import greenEmpathyInfographicUrl from "@assets/8104_Relationship_Map_How_to_Cultivate_Relations_1764793449236.png";
import attitudeChangeInfographicUrl from "@assets/2101_Attitude_to_Change_1764793285029.png";
import congruenceInfographicUrl from "@assets/5102_Congruence_of_the_3_Levels_of_Communication_1764793387005.png";

type RoleFilter = "all" | "EA" | "ACX" | "TealLeaders";

interface ApiPrompt {
  id: string;
  lensType: string;
  title: string;
  description: string;
  whatItDoes: string[] | string | null;
  perfectFor: string;
  promptContent: string;
  roleCategory: string;
  votes: string | number;
  isActive: string | boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

function safeParseNumber(value: string | number | null | undefined, fallback = 0): number {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'number') return isNaN(value) ? fallback : value;
  const parsed = parseInt(String(value), 10);
  return isNaN(parsed) ? fallback : parsed;
}

interface LensPrompt {
  id: string;
  lens: string;
  lensColor: string;
  title: string;
  description: string;
  whatItDoes: string[];
  perfectFor: string;
  prompt: string;
  votes: number;
  roleCategory: string;
}

const lensPrompts: LensPrompt[] = [
  {
    id: "influence",
    lens: "Influence",
    lensColor: "#cc3333",
    title: "Influence Lens — How You Persuade & Lead",
    description: "Analyse your natural influence style, persuasion strategies, and leadership patterns.",
    whatItDoes: [
      "How you naturally influence and persuade others",
      "Your preferred influence strategies (advising, supporting, ordering, etc.)",
      "Your use of timing, body language, and communication rhythm",
      "Patterns that work well and areas where you might create friction"
    ],
    perfectFor: "Understanding your leadership style, preparing for negotiations, or improving how you guide teams.",
    prompt: `# 🔴 Influence Lens Analysis

## What you'll get
A personalised analysis of how you influence, persuade, and lead others based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **🔴 INFLUENCE LENS** only.

The Influence Lens includes these elements:
- **1101** Influence Strategies
- **1102** Quantum Conversations
- **1103** GreenBlueRed™ (timing, body language, rhythm)
- **1104** Periodic Table
- **1105** Head-Up Display
- **1106** Facilitating & Hosting
- **1201** Advising
- **1202** Red Question
- **1203** Suggesting
- **1204** Supporting
- **1205** Ordering
- **1206** Agreeing
- **1301-1305** Red Silence, Intonation, Body-Language, Rhythm, Timing
- **1401-1406** Uniting, Seducing, Fixing Problems, Changing Others, Taking Over, Influencing

## Your task

1. Read the person's scan data carefully
2. Identify their top 3-5 influence patterns using element codes and names
3. Write in "You..." voice (second person)
4. Include direct quotes or scores as evidence
5. Be specific and actionable

## Output format

### 🔴 Your Influence Pattern

**"[One clear sentence describing how this person influences others]"**

### What you do naturally

- **[Element name]** ([code]): [specific behaviour with evidence]
- **[Element name]** ([code]): [specific behaviour with evidence]
- **[Element name]** ([code]): [specific behaviour with evidence]

### Where you create impact

[2-3 sentences about when and where their influence works best]

### Watch out for

- [Potential friction point or overuse pattern]
- [Blind spot or area of tension]

### 3 micro-experiments to try

1. **[Specific action]**: [Why this matters]
2. **[Specific action]**: [Why this matters]
3. **[Specific action]**: [Why this matters]

### Your influence style in one line

**Codes:** [list codes] | **Colour:** 🔴 Red | **Core strength:** [key phrase]

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
    votes: 247,
    roleCategory: "all"
  },
  {
    id: "attitude",
    lens: "Attitude",
    lensColor: "#ff9933",
    title: "Attitude Lens — Your Approach to Change & Learning",
    description: "Explore how you respond to change, learning preferences, and growth patterns.",
    whatItDoes: [
      "How you respond to change and new challenges",
      "Your learning preferences and retention patterns",
      "Your capacity for self-reflection and growth",
      "Which attitudes serve you (and which might limit you)"
    ],
    perfectFor: "Understanding resistance patterns, designing learning plans, or building sustainable habits.",
    prompt: `# 🟠 Attitude Lens Analysis

## What you'll get
A personalised analysis of how you approach change, learning, and growth based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **🟠 ATTITUDE LENS** only.

The Attitude Lens includes these elements:
- **2101** Attitude to Change
- **2102** Learning Retention
- **2103** Micro-Habits
- **2104** Self-Reflection
- **2401** Attitude 0 (resistance)
- **2402** Attitude I (cautious openness)
- **2403** Attitude II (active engagement)
- **2404** Attitude III (full integration)

## Your task

1. Read the person's scan data carefully
2. Identify their attitude level (0, I, II, or III) and learning patterns
3. Write in "You..." voice (second person)
4. Include direct quotes or scores as evidence
5. Be encouraging and realistic

## Output format

### 🟠 Your Attitude to Growth

**"[One clear sentence describing their relationship with change and learning]"**

### How you approach learning

- **[Element name]** ([code]): [specific pattern with evidence]
- **[Element name]** ([code]): [specific pattern with evidence]
- **[Element name]** ([code]): [specific pattern with evidence]

### Your attitude level

**Current level:** Attitude [0/I/II/III]

[2-3 sentences explaining what this means for them]

### What supports your growth

- [Environmental or relational factor]
- [Practice or mindset that helps]

### What might be holding you back

- [Internal barrier or limiting belief]
- [External constraint or pattern]

### 3 micro-habits to try this week

1. **[Tiny action]**: [What to do and when]
2. **[Tiny action]**: [What to do and when]
3. **[Tiny action]**: [What to do and when]

### Your learning style in one line

**Codes:** [list codes] | **Colour:** 🟠 Orange | **Core pattern:** [key phrase]

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
    votes: 189,
    roleCategory: "all"
  },
  {
    id: "chaordic",
    lens: "Chaordic",
    lensColor: "#ffcc00",
    title: "Chaordic Lens — Structure vs. Freedom in Conversation",
    description: "Discover how you balance order and chaos in collaborative settings.",
    whatItDoes: [
      "How you balance structure (order) and flexibility (chaos) in conversations",
      "Which conversational formats you prefer (debate, dialogue, co-creation, etc.)",
      "Your natural role in group settings (Participant, Harvester, Host, Steward)",
      "When structure helps you and when it constrains you"
    ],
    perfectFor: "Designing meetings, facilitation work, or understanding team dynamics.",
    prompt: `# 🟡 Chaordic Lens Analysis

## What you'll get
A personalised analysis of how you navigate structure and freedom in conversations based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **🟡 CHAORDIC LENS** only.

The Chaordic Lens includes these elements:
- **3101** Chaordic Balance
- **3102** Algorithm Canvas
- **3103** Types of Conversation
- **3104** Small Talk
- **3105** Framing
- **3106** Check-In/Out
- **3107** Debate & Discussion
- **3108** Negotiation & Dialogue
- **3109** Co-creation
- **3110** Marketplace
- **3111** Chaordic Roles
- **3112** Participant
- **3113** Harvester
- **3114** Host
- **3115** Steward

## Your task

1. Read the person's scan data carefully
2. Identify their preferred balance point and conversational roles
3. Write in "You..." voice (second person)
4. Include direct quotes or scores as evidence
5. Help them see the trade-offs

## Output format

### 🟡 Your Chaordic Pattern

**"[One clear sentence describing how they balance structure and freedom]"**

### Where you sit on the spectrum

CHAOS ←―――●―――→ ORDER

[Mark their position]

[2-3 sentences explaining what this means]

### Your natural roles

- **[Role name]** ([code]): [how this shows up with evidence]
- **[Role name]** ([code]): [how this shows up with evidence]

### Conversation types you prefer

1. **[Type]** ([code]): [why this works for you]
2. **[Type]** ([code]): [why this works for you]
3. **[Type]** ([code]): [why this works for you]

### When structure helps you

[Specific situations where you need clear frames]

### When structure constrains you

[Specific situations where you need more freedom]

### 3 experiments to try

1. **[Action for more structure]**: [When to use this]
2. **[Action for more freedom]**: [When to use this]
3. **[Action for different role]**: [Why try this]

### Your chaordic style in one line

**Codes:** [list codes] | **Colour:** 🟡 Yellow | **Natural role:** [primary role]

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
    votes: 156,
    roleCategory: "all"
  },
  {
    id: "flow",
    lens: "Flow",
    lensColor: "#cccc33",
    title: "Flow Lens — Challenge, Skill & Motivation Balance",
    description: "Understand your flow state triggers, blockers, and optimal performance conditions.",
    whatItDoes: [
      "How your skills match your challenges",
      "What motivates you (and what drains you)",
      "When you experience flow states",
      "How feedback loops support or disrupt your momentum"
    ],
    perfectFor: "Designing work that energises you, preventing burnout, or optimising productivity.",
    prompt: `# 🟢 Flow Lens Analysis

## What you'll get
A personalised analysis of your flow patterns, skill-challenge balance, and motivation drivers based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **🟢 FLOW LENS** only.

The Flow Lens includes these elements:
- **4101** Measuring Flow
- **4102** Conscious Feedback
- **4103** Motivation
- **4104** Challenge
- **4105** Skill

## Your task

1. Read the person's scan data carefully
2. Map their position in the flow model (anxiety, flow, boredom, apathy)
3. Write in "You..." voice (second person)
4. Include direct quotes or scores as evidence
5. Give practical calibration advice

## Output format

### 🟢 Your Flow State

**"[One clear sentence describing their current challenge-skill balance]"**

### Where you are in the flow model

         High Challenge
              |
    ANXIETY   |   FLOW
              |
    ――――――――――+――――――――――
              |
    APATHY    |   BOREDOM
              |
         Low Challenge

**Your position:** [zone name]

[2-3 sentences explaining what this means]

### Your flow drivers

- **Motivation** ([4103]): [what drives you with evidence]
- **Skill level** ([4105]): [your competence with evidence]
- **Challenge level** ([4104]): [what you're facing with evidence]

### When you experience flow

[Describe the conditions, tasks, or environments where flow happens]

### What disrupts your flow

- [Internal disruptor]
- [External disruptor]

### Feedback patterns

**Conscious Feedback** ([4102]): [how you give and receive feedback]

### 3 ways to optimise your flow

1. **[Calibration action]**: [Why this helps]
2. **[Calibration action]**: [Why this helps]
3. **[Calibration action]**: [Why this helps]

### Your flow pattern in one line

**Codes:** [list codes] | **Colour:** 🟢 Green (Flow) | **Current state:** [zone name]

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
    votes: 203,
    roleCategory: "all"
  },
  {
    id: "alignment",
    lens: "Alignment",
    lensColor: "#669966",
    title: "Alignment & Empathy Lens — Trust & Connection",
    description: "Explore how you build trust and create deep connection with others.",
    whatItDoes: [
      "How you build trust and connection with others",
      "Your use of empathic listening techniques (mirroring, summarising, labelling)",
      "Your strengths in kindness, respect, curiosity, and empathy",
      "How timing, silence, and body language support alignment"
    ],
    perfectFor: "Deepening relationships, coaching conversations, or building psychological safety.",
    prompt: `# 🟢 Alignment & Empathy Lens Analysis

## What you'll get
A personalised analysis of how you create trust, connection, and empathy based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **🟢 ALIGNMENT & EMPATHY LENS** only.

The Alignment & Empathy Lens includes these elements:
- **5101** Alignment
- **5102** Congruence
- **5103** Meaning
- **5104** Ikigai
- **5105** Presencing
- **5201** Positive Phrases
- **5202** Green Questions
- **5203** Mirroring
- **5204** Summarising
- **5205** Accusation Audit
- **5206** Unlocking
- **5207** Labelling
- **5208** Elephant (naming what's unspoken)
- **5301-5305** Green Silence, Intonation, Body-Language, Rhythm, Timing
- **5401-5406** Kindness, Respect, Building Trust, Empathy, Curiosity, Agape

## Your task

1. Read the person's scan data carefully
2. Identify their empathy strengths and listening patterns
3. Write in "You..." voice (second person)
4. Include direct quotes or scores as evidence
5. Celebrate strengths and gently note edges

## Output format

### 🟢 Your Empathy & Alignment Pattern

**"[One clear sentence describing how they create connection and trust]"**

### Your core empathy strengths

- **[Element name]** ([code]): [specific behaviour with evidence]
- **[Element name]** ([code]): [specific behaviour with evidence]
- **[Element name]** ([code]): [specific behaviour with evidence]

### Listening techniques you use

- **[Technique]** ([code]): [how you use this]
- **[Technique]** ([code]): [how you use this]

### How you build trust

[2-3 sentences about their trust-building approach]

### Your empathy scores

- **Kindness** ([5401]): [score/evidence]
- **Respect** ([5402]): [score/evidence]
- **Empathy** ([5404]): [score/evidence]
- **Curiosity** ([5405]): [score/evidence]

### Watch out for

- [Potential empathy fatigue or over-giving pattern]
- [Area where boundaries might support connection]

### 3 experiments to deepen alignment

1. **[Practice]**: [Why this matters]
2. **[Practice]**: [Why this matters]
3. **[Practice]**: [Why this matters]

### Your alignment style in one line

**Codes:** [list codes] | **Colour:** 🟢 Green (Alignment) | **Superpower:** [key strength]

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
    votes: 178,
    roleCategory: "all"
  },
  {
    id: "needs",
    lens: "Needs",
    lensColor: "#009999",
    title: "Needs Lens — Understanding What Drives You",
    description: "Discover which needs are met, unmet, and how you express them.",
    whatItDoes: [
      "Which needs are met and which are unmet in your work and relationships",
      "How you express (or don't express) your needs",
      "Your understanding of others' needs",
      "Patterns around psychological safety, respect, autonomy, and belonging"
    ],
    perfectFor: "Conflict resolution, team building, or understanding what's missing in your environment.",
    prompt: `# 🟢 Needs Lens Analysis

## What you'll get
A personalised analysis of your needs, how well they're met, and how you express them, based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **🟢 NEEDS LENS** only.

The Needs Lens includes these elements:
- **6101** Chakra Needs
- **6102** Hierarchy of Needs
- **6103** Assumptions
- **6104** Functional Conflicts
- **6105** Types of Love
- **6106** Stages of Team
- **6201** Conscious Request
- **6401** Psychological Safety
- **6402** Storge (family love)
- **6403** Mania (obsessive love)
- **6404** Eros (romantic love)
- **6405** Philia (friendship love)
- **6406** Ludus (playful love)

## Your task

1. Read the person's scan data carefully
2. Identify which needs are met, unmet, or in tension
3. Write in "You..." voice (second person)
4. Include direct quotes or scores as evidence
5. Help them articulate hidden needs

## Output format

### 🟢 Your Needs Pattern

**"[One clear sentence describing their relationship with needs]"**

### Your core needs right now

**Met needs:**
- **[Need name]** ([code]): [how this shows up with evidence]
- **[Need name]** ([code]): [how this shows up with evidence]

**Unmet needs:**
- **[Need name]** ([code]): [how this shows up with evidence]
- **[Need name]** ([code]): [how this shows up with evidence]

### How you express needs

**Conscious Request** ([6201]): [how well you articulate what you need]

[2-3 sentences about their pattern of asking vs. not asking]

### Psychological safety

**Safety score** ([6401]): [score/evidence]

[What this means for you]

### Team stage awareness

**Stages of Team** ([6106]): [how aware you are of team development]

### What's missing

[1-3 needs that aren't being met and might be causing friction]

### 3 experiments to meet your needs

1. **[Specific request or boundary]**: [Why this matters]
2. **[Environmental change]**: [Why this matters]
3. **[Relational practice]**: [Why this matters]

### Your needs pattern in one line

**Codes:** [list codes] | **Colour:** 🟢 Green (Needs) | **Key insight:** [phrase]

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
    votes: 145,
    roleCategory: "all"
  },
  {
    id: "ego",
    lens: "Ego",
    lensColor: "#3399cc",
    title: "Ego Lens — Triggers, Hats & Self-Awareness",
    description: "Understand your ego triggers, protective patterns, and which 'hats' you wear.",
    whatItDoes: [
      "Your ego triggers (what activates defensiveness or reaction)",
      "Which 'ego hats' you wear (Judge, Hero, Narrator, etc.)",
      "How you protect yourself and where you might hide",
      "Patterns of learning, gratitude, and self-love"
    ],
    perfectFor: "Self-awareness work, understanding defensiveness, or recognising protective patterns.",
    prompt: `# 🔵 Ego Lens Analysis

## What you'll get
A personalised analysis of your ego patterns, triggers, and protective strategies based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **🔵 EGO LENS** only.

The Ego Lens includes these elements:
- **7101** Ego Triggers
- **7102** Drama Triangle (Victim, Rescuer, Persecutor)
- **7103** Expressing
- **7104** Consciousness Barrier
- **7105** Permission Barrier
- **7106** Sensorial Barrier
- **7107** Language Barrier
- **7108** Tangibility Barrier
- **7109** Ego Hats
- **7110** Interpretor
- **7111** Interrogator
- **7112** Judge
- **7113** Devil's Advocate
- **7114** Hero
- **7115** Narrator
- **7116** Hermit
- **7117** Artisan
- **7201** Informing
- **7202** Blue Question
- **7203** Judging
- **7204** Projecting
- **7205** Apologising
- **7206** Storytelling
- **7301-7305** Blue Silence, Intonation, Body-Language, Rhythm, Timing
- **7401-7406** Learning, Pragmatism, Philautia (self-love), Ego, Gratitude, Responsibilities

## Your task

1. Read the person's scan data carefully
2. Identify their primary triggers and ego hats
3. Write in "You..." voice (second person)
4. Include direct quotes or scores as evidence
5. Be compassionate about defences

## ⚠️ IMPORTANT: Reversed scale interpretation

**Ego Distance scale interpretation:**
- **LOW scores (1-3/10)** = HIGH ego distance = POSITIVE = Person does NOT compare themselves much to others, NOT easily triggered, has healthy distance from ego reactions
- **HIGH scores (8-10/10)** = LOW ego distance = CONCERNING = Person IS very triggerable, compares themselves frequently to others, lacks healthy ego distance

When analysing triggers and ego patterns, remember that a LOW numerical score on ego distance means the person has GOOD ego management.

## Output format

### 🔵 Your Ego Pattern

**"[One clear sentence describing how their ego shows up]"**

### Your ego triggers

**Top triggers** ([7101]):
- [Trigger 1 with evidence]
- [Trigger 2 with evidence]
- [Trigger 3 with evidence]

[2-3 sentences about what happens when triggered]

### Your ego hats

**Primary hats you wear:**
- **[Hat name]** ([code]): [when and how you wear this]
- **[Hat name]** ([code]): [when and how you wear this]
- **[Hat name]** ([code]): [when and how you wear this]

### Drama triangle patterns

**Drama Triangle** ([7102]): [which roles you play: Victim, Rescuer, or Persecutor]

### Communication barriers

[Which barriers (consciousness, permission, sensorial, language, tangibility) affect you most]

### Healthy ego expressions

- **Learning** ([7401]): [how you approach learning]
- **Gratitude** ([7405]): [how gratitude shows up]
- **Philautia/Self-love** ([7403]): [your relationship with yourself]

### Watch out for

- [Over-identification with a particular hat]
- [Recurring drama pattern]

### 3 experiments to work with ego consciously

1. **[Practice to notice triggers]**: [Why this helps]
2. **[Hat-switching exercise]**: [Why this helps]
3. **[Self-compassion practice]**: [Why this helps]

### Your ego style in one line

**Codes:** [list codes] | **Colour:** 🔵 Blue | **Primary hat:** [main hat]

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
    votes: 167,
    roleCategory: "all"
  },
  {
    id: "dynamics",
    lens: "Dynamics",
    lensColor: "#666699",
    title: "Dynamics Lens — Relationships & Boundaries",
    description: "Explore how you navigate relationships, power dynamics, and boundaries.",
    whatItDoes: [
      "How you navigate relationship dynamics and power",
      "Your ability to say no and set boundaries",
      "How you handle polarity (masculine/feminine, giving/receiving)",
      "Patterns around consent, forgiveness, and relational rituals"
    ],
    perfectFor: "Relationship work, boundary setting, or understanding team dynamics.",
    prompt: `# 🟣 Dynamics Lens Analysis

## What you'll get
A personalised analysis of your relationship dynamics, boundaries, and polarity patterns based on your Satellite Scan data.

## Instructions for the AI

You are an expert coach using the **Green Elephant Periodic Table of Conscious Communication**.

Analyse the scan data below through the **🟣 DYNAMICS LENS** only.

The Dynamics Lens includes these elements:
- **8101** Relationship Dynamics
- **8102** Conscious Consent
- **8103** Yin Yang Polarity
- **8104** Relationship Map
- **8105** Relationship Ritual
- **8201** Saying No
- **8401** Forgiveness

## Your task

1. Read the person's scan data carefully
2. Identify their relational patterns and boundary capacity
3. Write in "You..." voice (second person)
4. Include direct quotes or scores as evidence
5. Honour the complexity of relationships

## Output format

### 🟣 Your Relational Pattern

**"[One clear sentence describing how they move in relationships]"**

### How you navigate relationships

**Relationship Dynamics** ([8101]): [your pattern with evidence]

[2-3 sentences about how you show up in relationships]

### Saying no

**Saying No** ([8201]): [how easy or hard this is for you]

[When you can say no, when you can't, and what happens]

### Polarity awareness

**Yin Yang Polarity** ([8103]): [your relationship with masculine/feminine, giving/receiving]

[How balanced or imbalanced this feels]

### Consent patterns

**Conscious Consent** ([8102]): [how you navigate agreements and permissions]

### Forgiveness capacity

**Forgiveness** ([8401]): [your relationship with letting go]

### Relationship rituals

**Rituals** ([8105]): [whether you have regular practices to maintain connection]

### Where you might lose yourself

- [Pattern of over-giving or under-receiving]
- [Difficulty with boundaries in specific contexts]

### 3 experiments to balance dynamics

1. **[Boundary practice]**: [Why this matters]
2. **[Polarity experiment]**: [Why this matters]
3. **[Ritual or reset practice]**: [Why this matters]

### Your relational style in one line

**Codes:** [list codes] | **Colour:** 🟣 Purple | **Key pattern:** [phrase]

---

## Paste your Satellite Scan data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
    votes: 134,
    roleCategory: "all"
  }
];

const quickWinsPrompt: LensPrompt = {
  id: "quick-wins",
  lens: "All Lenses",
  lensColor: "#009999",
  title: "Your Communication Style at a Glance",
  description: "A clear, visual summary of your unique communication profile — designed for ADHD-friendly reading with visual structure and key takeaways.",
  whatItDoes: [
    "Quick visual overview of your 8-lens profile",
    "Your top 3 strengths highlighted clearly",
    "3 simple experiments to try this week",
    "Clear formatting that's easy to scan"
  ],
  perfectFor: "Getting a fast, clear picture of your communication style without information overload.",
  prompt: `# Your Communication Profile at a Glance

You are a communication coach analyzing Satellite Scan data. Create a **clear, ADHD-friendly summary** that's easy to scan and understand.

**Key principles:**
- Use short sentences
- Lots of white space
- Visual structure (headers, bullets, tables)
- Strategic use of emojis as visual anchors (not overwhelming)
- Direct "you" language
- Focus on actionable insights

---

# OUTPUT FORMAT

---

# 🛰️ [Name]'s Communication Profile
**[Job Title]** | **[Nationality]** | **Scan #[sequence]**

---

## At a Glance

| You're Great At | Watch Out For |
|-----------------|---------------|
| [Strength 1] | [Challenge 1] |
| [Strength 2] | [Challenge 2] |
| [Strength 3] | [Challenge 3] |

---

## Your 8 Lenses — Quick View

Use visual bars and one-line summaries:

**🔴 INFLUENCE** ████████░░ 8/10
You lead through [specific pattern]. Strong at [element].

**🟠 ATTITUDE** █████████░ 9/10  
You balance [learning/doing pattern]. Growth mindset score: [X].

**🟡 CHAORDIC** █████████░ 9/10
You navigate [chaos/order preference]. Team role: [HOST/STEWARD/etc].

**🟢 FLOW** █████████░ 9/10
Your flow state: "[quote from their data]". Motivation: [score]/10.

**🌿 ALIGNMENT** █████████░ 9/10
You [conflict behavior pattern]. Empathy: [score]/10.

**💎 NEEDS** ████████░░ 8/10
You need most: [top needs]. Safety: [score]/10.

**🔵 EGO** ███████░░░ 7/10
Triggers: [top 3 triggers]. Self-awareness: [score]/10.

**🟣 DYNAMICS** ████████░░ 8/10
Lead/Follow: [score]/[score]. You adapt [how].

---

## 💪 Your Top 3 Superpowers

### 1. [Element Name] ([code])
**What it means:** [One clear sentence]
**Use it when:** [Specific situation]

### 2. [Element Name] ([code])  
**What it means:** [One clear sentence]
**Use it when:** [Specific situation]

### 3. [Element Name] ([code])
**What it means:** [One clear sentence]
**Use it when:** [Specific situation]

---

## 🔬 3 Experiments for This Week

**Monday-Tuesday:**
Try [specific action] in your next [situation].

**Wednesday-Thursday:**
When you feel [trigger], pause and [alternative action].

**Friday:**
Ask someone for feedback on [specific behavior].

---

## 🎯 Your Style in One Sentence

> "[A memorable, insightful sentence that captures their unique communication fingerprint]"

---

## Paste your data below:

<<<DATA_START>>>

[PASTE YOUR RAW SCAN DATA HERE]

<<<DATA_END>>>`,
  votes: 312,
  roleCategory: "all"
};

const sampleScanData = `# Coaching Data Summary for Esteve Pannetier
Date generated: Thursday, 30 October 2025
Data submitted via Typeform on Thursday, 30 October 2025 at 16:35

---

## Qualitative Responses

### <GENDER>
Non-binary/third gender

### <COMS_QUALIFICATIONS>
Ergonomics, NVC, Mediation, Negotiation, Interviewing and AoH (art of hosting and harvesting meaningful conversations)

### <ALL_SITUATIONS> 
TEAMBUILDING (Team loyalty, on-boarding and culture), TEAMWORK (Problem-solving and planning), CO-CREATION (Creativity, brainstorms and collaborative sessions), TRAINING (Teaching, training and learning), RESEARCH (Expert interviews and qualitative research), CONFLICTS (Conflict prevention, handling, mediating and resolution), SALES (Cold calls, customer and public relations), WORKSHOPS (Kick-offs, strategic planning and process development), WRITING (Emails, chats, reports and content production), NEGOTIATION (Proposals, agreements and contracts), NETWORKING (Social media groups, meet-ups and get-togethers), CUSTOMER SERVICE (Reclamations, service and maintenance), LEADERSHIP (Managing, mentoring and coaching), GOVERNANCE (Board, politics and investor relations), FEEDBACK (Supervisor reviews, career discussions and peer feedback), PRESENTATIONS (Face-to-face live slides or hand-drawing doodles), MEETINGS (Project reviews, weekly updates and retros)

### <COMMON_SITUATIONS>
TEAMWORK (Problem-solving and planning), LEADERSHIP (Managing, mentoring and coaching), MEETINGS (Project reviews, weekly updates and retros), WRITING (Emails, chats, reports and content production), TRAINING (Teaching, training and learning)

### <CHALLENGING_SITUATIONS>
NETWORKING (Social media groups, meet-ups and get-togethers)

### <WHY_CHALLENGING_SITUATION>
I procrastinate writing, i find the SoMedia LI conventions tedious. I want to have fun with content creation.

### <%GBRFOCUS_CHALLENGING_SITUATION>
I focus on the other person

### <COLLECTIVE_INTELLIGENCE> 
STEWARD (to structure communication over time), HOST (to structure, facilitate and lead the conversation), HARVESTER (to coordinate and structure outputs from others), EXPERT (to present, coach or consult)

### <GBR_TIMING>
I communicate when it best suits others.

### <GBR_BODYLANGUAGE>
I adapt and mirror other people's body language.

### <GBR_SILENCE>
Others need me to pause and listen.

### <GBR_INTONATION>
I adapt my way of speaking to people's needs.

### <GBR_RHYTHM>
I adapt to the others' needs - if they want me to slow down, I slow down.

### <BENCHMARKS>
IDEO, Ubisoft, Buurtzog

### <ATTITUDE_SCORE>
both learning while getting things done.

### <CHALLENGE_QUALIFICATION>
Lack of alignment on purpose, roles, commit, responsibilities and accountabilities

### <FLOW_FEELING>
I feel flow, my thinking is clear and I'm completely present to myself and others.

### <CONFLICT_BEHAVIOUR>
I usually hear the other persons' needs

### <GROUP_NEEDS> (stages of team)
I need more direction, inclusion and acceptance from others, I need more autonomy, productivity and results, I need more trust, structure and processes

### <EGO_TRIGGERS>
Age, Gender, Disability or Illness, Appearance or Clothing, Family or Childcare, Countries Travelled to or Lived in, Fitness or Posture, Influence or Charisma, Behaviour, Social Status, Power or Reputation, Personality, Certificates, Awards or Qualifications, Job Title or Position, Philosophy or Values, Personal Growth and Development, Secularism (indifference to, or rejection or exclusion of religion and religious considerations), Individualism (focus on individual over the state or a social group)

### <CONVERSATION_POLARITY>
I lead or follow differently with each person

### <GIVE_FEEDBACK>
Positive phrases or compliments, My advice, My opinion

### <RECEIVE_FEEDBACK>
Positive phrases or compliments, Their opinion

### <LEARNING_DISABILITY>
ADHD, Dyslexia (reading difficulties), Dyscalculia (calculating difficulties), Other

### <EMAIL>
esteve@arbora.partners

### <END_TOKEN>
jh6q9rdituox55h7xymkzjh6q9rdutzf

---

## Full Raw Data with Labels

<<GDPR_%CONSENT>>: true
<<REASON>>: 
<<FNAME>>: Esteve
<<LNAME>>: Pannetier
<<SEQUENCE OF SCAN>>: This is my 5th scan
<<JOB_TITLE>>: CTO
<<NATIONALITY>>: France
<<EDUCATION>>: Bachelor's degree
<<GENDER>>: Non-binary/third gender
<<YOB>>: 1980
<<TIME_IN_ORG>>: More than 24 months
<<LEARNING_DISABILITY>>: 
<<COMS_QUALIFICATIONS>>: Ergonomics, NVC, Mediation, Negotiation, Interviewing and AoH (art of hosting and harvesting meaningful conversations)
<<LEARNING_HOURS>>: 10
<<EMAIL>>: 
<PRACTICAL_EXPERIENCE_GE>: 
<<THEORY_WATCHED_GE>>: 
<<QUALITY_DIGITAL_GE>>: 
<<QUALITY_TEACHING_COACHING_GE>>: 
<<QUALITY_PRINT_GE>>: 
<<ACTIVATION_LEARNING>>: 
<<ACTIVATION_LEARNING_NEEDS>>: 
<<ALL_SITUATIONS>>: TEAMBUILDING (Team loyalty, on-boarding and culture), TEAMWORK (Problem-solving and planning), CO-CREATION (Creativity, brainstorms and collaborative sessions), TRAINING (Teaching, training and learning), RESEARCH (Expert interviews and qualitative research), CONFLICTS (Conflict prevention, handling, mediating and resolution), SALES (Cold calls, customer and public relations), WORKSHOPS (Kick-offs, strategic planning and process development), WRITING (Emails, chats, reports and content production), NEGOTIATION (Proposals, agreements and contracts), NETWORKING (Social media groups, meet-ups and get-togethers), CUSTOMER SERVICE (Reclamations, service and maintenance), LEADERSHIP (Managing, mentoring and coaching), GOVERNANCE (Board, politics and investor relations), FEEDBACK (Supervisor reviews, career discussions and peer feedback), PRESENTATIONS (Face-to-face live slides or hand-drawing doodles), MEETINGS (Project reviews, weekly updates and retros)
<<COMMON_SITUATIONS>>: TEAMWORK (Problem-solving and planning), LEADERSHIP (Managing, mentoring and coaching), MEETINGS (Project reviews, weekly updates and retros), WRITING (Emails, chats, reports and content production), TRAINING (Teaching, training and learning)
<<CHALLENGING_SITUATIONS>>: NETWORKING (Social media groups, meet-ups and get-togethers)
<<WHY_CHALLENGING_SITUATION>>: I procrastinate writing, i find the SoMedia LI conventions tedious. I want to have fun with content creation.
<<%GBRFOCUS_CHALLENGING_SITUATION>>: I focus on the other person
<<EFFICACY_COMMUNICATION>>: 7
<<QUALITY_CONVERSATION>>: 6
<<QUALITY_CONVERSATION>>: 5
<<QUALITY_CONVERSATION>>: 8
<<QUALITY_CONVERSATION>>: 9
<<COLLECTIVE_INTELLIGENCE>>: STEWARD (to structure communication over time), HOST (to structure, facilitate and lead the conversation), HARVESTER (to coordinate and structure outputs from others), EXPERT (to present, coach or consult)
<<SELF_AWARENESS_COMPETENCE>>: 8
<<CHECKING_ASSUMPTIONS_COMPETENCE>>: 7
<<EXTERNAL_AUTHORITY_COMPETENCE>>: 6
<<ELEPHANT_COMPETENCE>>: 9
<<ADAPTING_COMPETENCE>>: 9
<<LABELLING_COMPETENCE>>: 8
<<INFORMING_COMPETENCE>>: 8
<<BLUEQUESTION_COMPETENCE>>: 8
<<JUDGING_COMPETENCE>>: 7
<<PROJECTING_COMPETENCE>>: 7
<<APOLOGISING_COMPETENCE>>: 6
<<STORYTELLING_COMPETENCE>>: 7
<<POSITIVEPHRASES_COMPETENCE>>: 8
<<GREENQUESTION_COMPETENCE>>: 8
<<MIRRORING_COMPETENCE>>: 8
<<SUMMARISING_COMPETENCE>>: 9
<<ACCUSATIONAUDIT_COMPETENCE>>: 9
<<UNLOCKING_COMPETENCE>>: 7
<<ADVISING_COMPETENCE>>: 8
<<REDQUESTION_COMPETENCE>>: 9
<<SUGGESTING_COMPETENCE>>: 8
<<SUPPORTING_COMPETENCE>>: 9
<<ORDERING_COMPETENCE>>: 8
<<AGREEING_COMPETENCE>>: 9
<<HOSTING_COMPETENCE>>: 9
<<EXPRESSING_COMPETENCE>>: 8
<<PRESENCING_COMPETENCE>>: 9
<<GBR_TIMING>>: I communicate when it best suits others.
<<GBR_BODYLANGUAGE>>: I adapt and mirror other people's body language.
<<GBR_SILENCE>>: Others need me to pause and listen.
<<GBR_INTONATION>>: I adapt my way of speaking to people's needs.
<<GBR_RHYTHM>>: I adapt to the others' needs - if they want me to slow down, I slow down.
<<INTENTION_LEARNING>>: 9
<<INTENTION_PRAGMATISM>>: 9
<<INTENTION_PHILAUTIA>>: 4
<<INTENTION_EGO>>: 4
<<INTENTION_GRATITUDE>>: 7
<<INTENTION_RESPONSIBILITIES>>: 9
<<INTENTION_UNITING>>: 9
<<INTENTION_SEDUCING>>: 7
<<INTENTION_FIXINGPROBLEMS>>: 9
<<INTENTION_CHANGINGOTHERS>>: 5
<<INTENTION_TAKINGOVER>>: 2
<<INTENTION_INFLUENCING>>: 4
<<INTENTION_KINDNESS>>: 9
<<INTENTION_RESPECT>>: 9
<<INTENTION_BUILDINGTRUST>>: 8
<<INTENTION_EMPATHY>>: 9
<<INTENTION_CURIOSITY>>: 8
<<INTENTION_AGAPE>>: 9
<<BENCHMARKS>>: IDEO, Ubisoft, Buurtzog
<<GROWTH_FOCUS>>: 10
<<ATTITUDE_SCORE>>: both learning while getting things done.
<<CHAORDIC_SCORE>>: 9
<<WASTED_TIME>>: Way too much time
<<SCHEDULING_ORDER>>: 5
<<CONVERSATIONS_ORDER>>: 3
<<WRITTEN_ORDER>>: 8
<<MEETINGS_ORDER>>: 7
<<ONLINE_ORDER>>: 6
<<LEARNING_ORDER>>: 5
<<PRESENTING_ORDER>>: 6
<<HARVESTING_ORDER>>: 6
<<RULES_ORDER>>: 3
<<DIRECTION_ORDER>>: 2
<<ROLES_ORDER>>: 1
<<CHALLENGE>>: 7
<<CHALLENGE_QUALIFICATION>>: Lack of alignment on purpose, roles, commit, responsibilities and accountabilities
<<MOTIVATION>>: 9
<<MOTIVATION_QUALIFICATION>>: People. Belonging
<<COMPETENCE>>: 9
<<FLOW_FEELING>>: I feel flow, my thinking is clear and I'm completely present to myself and others.
<<COMPETENCE_QUALIFICATION>>: 
<<CONFLICT_BEHAVIOUR>>: I usually hear the other persons' needs
<<GROUP_NEEDS (stages of team)>>: I need more direction, inclusion and acceptance from others, I need more autonomy, productivity and results, I need more trust, structure and processes
<<NEED_STRATEGY>>: 3
<<NEED_GOALS>>: 3
<<NEED_HONESTY>>: 7
<<NEED_RESPECT>>: 9
<<NEED_AUTONOMY>>: 9
<<NEED_RESOURCES>>: 2
<<NEED_SAFETY>>: 5
<<EGO_DISTANCE>>: 2
<<EGO_VICTIM>>: 6
<<EGO_VAMPIRE>>: 7
<<EGO_DRAGON>>: 7
<<EGO_HOST>>: 9
<<EGO_HARVESTER>>: 8
<<EGO_DEVIL>>: 8
<<EGO_HERO>>: 7
<<EGO_JOKER>>: 7
<<EGO_MONK>>: 4
<<EGO_ARTISAN>>: 8
<<EGO_TRIGGERS>>: Age, Gender, Disability or Illness, Appearance or Clothing, Family or Childcare, Countries Travelled to or Lived in, Fitness or Posture, Influence or Charisma, Behaviour, Social Status, Power or Reputation, Personality, Certificates, Awards or Qualifications, Job Title or Position, Philosophy or Values, Personal Growth and Development, Secularism (indifference to, or rejection or exclusion of religion and religious considerations), Individualism (focus on individual over the state or a social group)
<<LEAD_COMPETENCE>>: 9
<<FOLLOW_COMPETENCE>>: 6
<<CONVERSATION_POLARITY>>: I lead or follow differently with each person
<<RELATIONSHIP_BUILDING>>: 8
<<FEEDBACK_QLTY>>: 5
<<GIVE_FEEDBACK>>: Positive phrases or compliments, My advice, My opinion
<<RECEIVE_FEEDBACK>>: Positive phrases or compliments, Their opinion
<<LEARNING_DISABILITY>>: ADHD, Dyslexia (reading difficulties), Dyscalculia (calculating difficulties), Other
<<EMAIL>>: esteve@arbora.partners
<<DATE_TIME_SUBMITTED>>: Thu Oct 30 2025 18:43:34 GMT+0200 (Eastern European Standard Time)
<<END_TOKEN>>: jh6q9rdituox55h7xymkzjh6q9rdutzf`;

interface VideoData {
  id: string;
  title: string;
  lensType: LensType | null;
  youtubeId: string;
  infographic?: string;
  duration: string;
}

const understandingYourDataVideos: VideoData[] = [
  {
    id: "ego",
    title: "EGO: Satellite Scan Video Coaching",
    lensType: "ego",
    youtubeId: "Bxjk4rxJnkE",
    duration: "43:36"
  },
  {
    id: "dynamics",
    title: "DYNAMICS: Satellite Scan Video Coaching",
    lensType: "dynamics",
    youtubeId: "DL3hhDqbfgU",
    infographic: greenEmpathyInfographicUrl,
    duration: "9:45"
  },
  {
    id: "influence",
    title: "INFLUENCE: Satellite Scan Video Coaching",
    lensType: "influence",
    youtubeId: "rVJvDT-9n5k",
    duration: "37:42"
  },
  {
    id: "attitude",
    title: "ATTITUDE: Satellite Scan Video Coaching",
    lensType: "attitude",
    youtubeId: "xrkeazuA-Ck",
    duration: "7:59"
  },
  {
    id: "chaordic",
    title: "CHAORDIC: Satellite Scan Video Coaching",
    lensType: "chaordic",
    youtubeId: "F8pLhU5Dc7s",
    duration: "24:24"
  },
  {
    id: "flow",
    title: "FLOW: Satellite Scan Video Coaching",
    lensType: "flow",
    youtubeId: "mYavMqD1Tm0",
    duration: "26:42"
  },
  {
    id: "alignment",
    title: "ALIGNMENT: Satellite Scan Video Coaching",
    lensType: "alignment",
    youtubeId: "vXc5OAJAQHM",
    duration: "32:37"
  },
  {
    id: "needs",
    title: "NEEDS: Satellite Scan Video Coaching",
    lensType: "needs",
    youtubeId: "7CLTewj4W4g",
    duration: "26:23"
  }
];

const scienceOfCommunicationVideos: VideoData[] = [
  {
    id: "tedx",
    title: "The green blue red movement: Esteve Pannetier at TEDxTurku",
    lensType: null,
    youtubeId: "mbdzgJHXb3Y",
    duration: "20:37"
  },
  {
    id: "attitude-change",
    title: "2101 Attitude to Change: Balance learning with doing to embrace personal change",
    lensType: "attitude",
    youtubeId: "uM0Rf8bvYRA",
    infographic: attitudeChangeInfographicUrl,
    duration: "11:10"
  },
  {
    id: "influence-strategies",
    title: "1101 Influence Strategies: 3 Strategies of Communication to Lead with Respect",
    lensType: "influence",
    youtubeId: "-c3X1A3pOVI",
    infographic: influenceStrategiesPdfUrl,
    duration: "8:31"
  },
  {
    id: "gbr-basics",
    title: "1103 GreenBlueRed™ Basics: Upgrade your interactions by understanding the colours",
    lensType: "influence",
    youtubeId: "W7dzDkCUsgk",
    infographic: greenBlueRedPdfUrl,
    duration: "11:23"
  },
  {
    id: "congruence",
    title: "5102 Congruence: 3 Levels of Communication is a new way to understand conversations",
    lensType: "alignment",
    youtubeId: "2KUgC9rNS5k",
    infographic: congruenceInfographicUrl,
    duration: "28:24"
  },
  {
    id: "green-empathy",
    title: "Green Communication - The Power of Empathy",
    lensType: "alignment",
    youtubeId: "4UrH1lIqy-4",
    infographic: greenEmpathyInfographicUrl,
    duration: "31:52"
  },
  {
    id: "blue-barriers",
    title: "Blue Communication - The 5 Barriers of Communication",
    lensType: "ego",
    youtubeId: "YL8S0qn10aE",
    infographic: blueInfographicImageUrl,
    duration: "52:46"
  },
  {
    id: "conscious-feedback",
    title: "4102 Conscious Feedback: How to give and receive conscious feedback at work",
    lensType: "flow",
    youtubeId: "ixwmT_avY3I",
    infographic: consciousFeedbackInfographicUrl,
    duration: "18:35"
  },
  {
    id: "measuring-flow",
    title: "4101 Measuring Flow: How to measure communication flow in your work and with your team",
    lensType: "flow",
    youtubeId: "EZBP2FByWBg",
    infographic: flowMeasuringInfographicUrl,
    duration: "13:07"
  },
  {
    id: "chaordic-balance",
    title: "Chaordic Balance: What does 'chaordic' balance mean? 3101",
    lensType: "chaordic",
    youtubeId: "omq_x_mtqDE",
    infographic: chaordicRolesPdfUrl,
    duration: "8:58"
  },
  {
    id: "ego-triggers",
    title: "Ego Triggers 7101 doodled live to Futuriceans in Berlin",
    lensType: "ego",
    youtubeId: "p-LhY1uPgMg",
    infographic: blueInfographicImageUrl,
    duration: "10:43"
  },
  {
    id: "chaordic-doodle",
    title: "Chaordic Balance 3101 doodle live to Futuriceans in Berlin",
    lensType: "chaordic",
    youtubeId: "HFhzuFgdxjk",
    infographic: chaordicRolesPdfUrl,
    duration: "12:57"
  },
  {
    id: "alignment-conflicts",
    title: "Alignment in Conflicts 5101 doodled live to Futuriceans in Berlin",
    lensType: "alignment",
    youtubeId: "kk6zfMZrZ8A",
    infographic: nvcGreenBlueRedPdfUrl,
    duration: "6:21"
  },
  {
    id: "functional-conflicts",
    title: "Functional Conflicts 6104 doodled live to Futuriceans in Berlin",
    lensType: "needs",
    youtubeId: "tPZDOBHnziI",
    infographic: nvcGreenBlueRedPdfUrl,
    duration: "5:18"
  },
  {
    id: "end-boring-meetings",
    title: "3201 The Secret to End Boring and Inefficient Meetings: how to invite meetings consciously",
    lensType: "chaordic",
    youtubeId: "Q0yNbBNx-HY",
    infographic: chaordicRolesPdfUrl,
    duration: "35:34"
  }
];

function PromptCard({ prompt, onVote }: { prompt: LensPrompt; onVote: (id: string) => void }) {
  const [copied, setCopied] = useState(false);
  const [voted, setVoted] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      toast({
        title: "Prompt copied!",
        description: "Now paste it into your AI assistant and add your scan data.",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please select and copy the prompt manually.",
        variant: "destructive"
      });
    }
  };

  const handleVote = () => {
    if (!voted) {
      setVoted(true);
      onVote(prompt.id);
      toast({
        title: "Thanks for the feedback!",
        description: "Your vote helps us improve.",
      });
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-card/30 border-white/10 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                style={{ backgroundColor: prompt.lensColor + '30', color: prompt.lensColor, borderColor: prompt.lensColor + '50' }}
                className="border"
              >
                {prompt.lens}
              </Badge>
            </div>
            <CardTitle className="text-lg text-white">{prompt.title}</CardTitle>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="shrink-0"
            data-testid={`copy-prompt-${prompt.id}`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span className="ml-2">{copied ? "Copied!" : "Copy"}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-white/70">{prompt.description}</p>
        
        <div>
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-2">What you'll learn:</p>
          <ul className="text-sm text-white/60 space-y-1">
            {prompt.whatItDoes.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 mt-1 text-needs shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <p className="text-xs text-white/50">
          <strong>Perfect for:</strong> {prompt.perfectFor}
        </p>
        
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleVote}
            className={voted ? "text-needs" : "text-white/50"}
            data-testid={`vote-prompt-${prompt.id}`}
          >
            <ThumbsUp className={`w-4 h-4 mr-1 ${voted ? "fill-current" : ""}`} />
            <span>{prompt.votes + (voted ? 1 : 0)}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ScrollProgressLine() {
  const { scrollYProgress } = useScroll();
  
  const dotOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0]);
  const lineOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 0.5, 0]);
  
  return (
    <div className="fixed left-8 top-0 bottom-0 w-px z-40 hidden lg:block">
      {/* Background track - fades at bottom */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.2) 80%, transparent 100%)",
          opacity: lineOpacity
        }}
      />
      
      {/* Starting indicator dot at top - always visible */}
      <div 
        className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/40"
        style={{ boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)" }}
      />
      
      {/* Progress fill - fades to transparent at bottom */}
      <motion.div 
        className="absolute top-0 left-0 w-full"
        style={{ 
          height: useTransform(scrollYProgress, [0, 1], ["5%", "100%"]),
          background: "linear-gradient(180deg, hsl(var(--needs)) 0%, hsl(var(--needs)) 70%, transparent 100%)",
          boxShadow: "0 0 20px rgba(0, 153, 153, 0.5)",
          opacity: lineOpacity
        }}
      />
      
      {/* Moving indicator dot - fades out near bottom */}
      <motion.div 
        className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-needs"
        style={{ 
          top: useTransform(scrollYProgress, [0, 1], ["5%", "100%"]),
          boxShadow: "0 0 20px rgba(0, 153, 153, 0.8)",
          opacity: dotOpacity
        }}
      />
    </div>
  );
}

export default function ResourcesPromptsPage() {
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [copiedSample, setCopiedSample] = useState(false);
  const { toast } = useToast();
  
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  // Fetch prompts from API
  const { data: apiPrompts, isLoading: promptsLoading, error: promptsError } = useQuery<ApiPrompt[]>({
    queryKey: ['/api/prompts'],
  });

  // Show error toast when API fetch fails
  useEffect(() => {
    if (promptsError) {
      toast({
        title: "Could not load prompts",
        description: "Using default prompts. Some features may be limited.",
        variant: "destructive"
      });
    }
  }, [promptsError, toast]);

  // Track if we're using fallback data (only after loading completes)
  const isUsingFallback = !promptsLoading && (!apiPrompts || apiPrompts.length === 0);
  // Track if there was an API error
  const hadFetchError = !!promptsError;

  // Transform API prompts to LensPrompt format, or use hardcoded fallback
  // Return empty array during loading so skeleton renders exclusively
  const allPrompts = useMemo(() => {
    // While loading, return empty to let skeleton render
    if (promptsLoading) {
      return [];
    }
    if (apiPrompts && apiPrompts.length > 0) {
      // Map API prompts to LensPrompt format with safe type conversions
      return apiPrompts.map((p): LensPrompt => {
        const lens = LENSES[p.lensType as LensType];
        // Normalize whatItDoes to array (handle string or null)
        let whatItDoesArray: string[] = [];
        if (Array.isArray(p.whatItDoes)) {
          whatItDoesArray = p.whatItDoes;
        } else if (typeof p.whatItDoes === 'string' && p.whatItDoes) {
          whatItDoesArray = p.whatItDoes.split('\n').filter(Boolean);
        }
        return {
          id: p.id,
          lens: lens?.name || p.lensType,
          lensColor: lens?.hexColor || '#666666',
          title: p.title,
          description: p.description,
          whatItDoes: whatItDoesArray,
          perfectFor: p.perfectFor,
          prompt: p.promptContent,
          votes: safeParseNumber(p.votes, 0),
          roleCategory: p.roleCategory || "all"
        };
      });
    }
    // Fallback to hardcoded prompts if API returns empty
    return [quickWinsPrompt, ...lensPrompts];
  }, [apiPrompts, promptsLoading]);

  // Filter prompts by selected role
  const filteredPrompts = useMemo(() => {
    if (roleFilter === "all") {
      return allPrompts;
    }
    return allPrompts.filter(p => p.roleCategory === roleFilter || p.roleCategory === "all");
  }, [allPrompts, roleFilter]);

  // Handle vote - call API and refetch to sync vote counts
  // Disable voting when using fallback data (prompts don't exist in DB)
  const handleVote = async (promptId: string) => {
    if (isUsingFallback) {
      toast({
        title: "Voting unavailable",
        description: "Voting is disabled when using default prompts.",
        variant: "destructive"
      });
      return;
    }
    try {
      await apiRequest("POST", `/api/prompts/${promptId}/upvote`, {});
      // Await refetch to sync vote counts immediately
      await queryClient.invalidateQueries({ queryKey: ['/api/prompts'] });
    } catch (error) {
      toast({
        title: "Vote not saved",
        description: "Your vote could not be saved to the server.",
        variant: "destructive"
      });
    }
  };

  const handleCopySampleData = async () => {
    try {
      await navigator.clipboard.writeText(sampleScanData);
      setCopiedSample(true);
      toast({
        title: "Sample data copied!",
        description: "Paste this after the prompt to try it out.",
      });
      setTimeout(() => setCopiedSample(false), 3000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please select and copy the data manually.",
        variant: "destructive"
      });
    }
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:esteve@greenelephant.org?subject=Missing%20Satellite%20Scan%20Data&body=Hi%20Esteve%2C%0A%0AI%20haven't%20received%20my%20Satellite%20Scan%20data%20yet.%20My%20details%3A%0A%0AName%3A%20%0AEmail%3A%20%0ADate%20of%20purchase%3A%20%0A%0ACould%20you%20please%20help%20me%20access%20my%20results%3F%0A%0AThank%20you!";
  };

  return (
    <div className="min-h-screen bg-black">
      <ScrollProgressLine />
      <section 
        className="relative min-h-[90vh] overflow-hidden"
        style={{
          background: `linear-gradient(180deg,
            #000000 0%,
            #020204 5%,
            #030308 10%,
            #040410 15%,
            #050515 20%,
            #060618 25%,
            #07071a 30%,
            #08081c 35%,
            #090920 40%,
            #0a0a22 45%,
            #0a0a18 55%,
            #080814 65%,
            #060610 75%,
            #04040c 85%,
            #030308 100%
          )`
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(200)].map((_, i) => (
            <div
              key={i}
              className="absolute w-px h-px bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${40 + Math.random() * 55}%`,
                opacity: Math.random() * 0.8 + 0.1,
                animation: `pulse ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
        
        {/* Earth image container with background-color fallback to prevent seams */}
        <div 
          className="absolute left-0 right-0"
          style={{
            top: '0',
            height: '65vh',
            minHeight: '400px',
            backgroundColor: '#050510',
            backgroundImage: `url(${earthImageUrl})`,
            backgroundSize: '100% auto',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
            transform: 'scaleY(-1)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 10%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.3) 50%, transparent 65%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 10%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.3) 50%, transparent 65%)'
          }}
        />
        
        {/* Unified overlay: dark at top for header, transparent mid for earth, dark at bottom for blend */}
        <div 
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: '180px',
            background: `linear-gradient(180deg, 
              #000000 0%,
              rgba(0, 0, 0, 0.9) 40%,
              rgba(0, 0, 0, 0.5) 70%,
              transparent 100%
            )`
          }}
        />
        {/* Bottom blend overlay - extends beyond earth for seamless transition */}
        <div 
          className="absolute left-0 right-0 bottom-0 pointer-events-none"
          style={{
            top: '35vh',
            background: `linear-gradient(180deg, 
              transparent 0%,
              rgba(5, 5, 16, 0.2) 20%,
              rgba(5, 5, 16, 0.5) 40%,
              #050510 70%,
              #050510 100%
            )`
          }}
        />
        
        <div className="relative z-10 h-full flex flex-col justify-end items-center px-4 pb-16" style={{ paddingTop: 'calc(50vh + 20px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Badge className="mb-6 bg-needs/20 text-needs border-needs/30">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Your Scan is Complete
              </Badge>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white" style={{ fontFamily: 'Archivo, sans-serif' }}>
              Congratulations, Explorer
            </h1>
            
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              You've completed your Satellite Scan. Now it's time to deepen your journey with videos, prompts, infographics, and live workshops to help you apply your insights.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 flex flex-col items-center gap-2 text-white/60"
          >
            <span className="text-sm">Scroll to explore</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </motion.div>
        </div>
      </section>
      
      <div 
        className="relative"
        style={{
          background: `linear-gradient(180deg,
            #050510 0%,
            #040410 10%,
            #030308 25%,
            #020205 50%,
            #010103 75%,
            #000000 100%
          )`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative py-20">
          
          <div className="space-y-24">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              id="dashboard"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-needs flex items-center justify-center shadow-lg shadow-needs/40">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  How to Use Your Dashboard
                </h2>
              </div>
              <p className="text-white/70 mb-8 max-w-2xl">
                Watch this introduction to understand what your Satellite Scan results mean and how to interpret your communication profile.
              </p>
              
              <div className="aspect-video max-w-4xl bg-black rounded-lg overflow-hidden border border-white/10">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/videoseries?list=PLYvfWnYASrYcADsrLB75TRKtcYx7BUdxB"
                  title="How to Use Your Satellite Scan Dashboard"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="border-0"
                  data-testid="youtube-dashboard"
                />
              </div>
              
              <div className="mt-6">
                <a 
                  href="https://www.youtube.com/playlist?list=PLYvfWnYASrYcADsrLB75TRKtcYx7BUdxB" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button 
                    className="bg-needs hover:bg-needs/90 text-white" 
                    data-testid="button-view-playlist"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    View Full Playlist on YouTube
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              id="prompts"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-needs flex items-center justify-center shadow-lg shadow-needs/40">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Prompts Library
                </h2>
              </div>
              <p className="text-white/70 mb-4 max-w-2xl">
                Unlock multiple times the value from your raw data by using these prompts with our custom GPT, the Conscious Communicator.
              </p>
              
              <div className="mb-12" data-testid="section-how-to-use-prompts">
                <div className="flex items-center gap-3 mb-6">
                  <SiOpenai className="w-5 h-5 text-needs" />
                  <h3 className="text-lg font-semibold text-white" data-testid="text-steps-title">3 Simple Steps</h3>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10" data-testid="card-step-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-7 h-7 rounded-full bg-influence/20 text-influence flex items-center justify-center font-bold text-sm">1</div>
                      <p className="font-medium text-white" data-testid="text-step-title-1">Copy a Prompt</p>
                    </div>
                    <p className="text-sm text-white/50" data-testid="text-step-desc-1">Pick any card below and click "Copy"</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10" data-testid="card-step-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-7 h-7 rounded-full bg-needs/20 text-needs flex items-center justify-center font-bold text-sm">2</div>
                      <p className="font-medium text-white" data-testid="text-step-title-2">Open the GPT</p>
                    </div>
                    <p className="text-sm text-white/50" data-testid="text-step-desc-2">Paste it in our Conscious Communicator</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10" data-testid="card-step-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-7 h-7 rounded-full bg-flow/20 text-flow flex items-center justify-center font-bold text-sm">3</div>
                      <p className="font-medium text-white" data-testid="text-step-title-3">Add Your Data</p>
                    </div>
                    <p className="text-sm text-white/50" data-testid="text-step-desc-3">Paste your scan data and send</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <a 
                    href="https://chatgpt.com/g/g-bUJ6dvAHK-conscious-communicator"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-needs text-white" data-testid="button-open-gpt">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Open Conscious Communicator
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                  <span className="text-xs text-white/40" data-testid="text-chatgpt-note">
                    Free ChatGPT account required · <a href="https://chat.openai.com/auth/login" target="_blank" rel="noopener noreferrer" className="text-needs hover:underline" data-testid="link-chatgpt-signup">Sign up</a>
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleContactSupport}
                    className="text-xs text-white/40 h-auto py-1 px-2"
                    data-testid="button-contact-support"
                  >
                    Can't find your data? Contact Estève
                  </Button>
                </div>
              </div>
              
              <Card className="backdrop-blur-sm bg-gradient-to-r from-needs/10 to-flow/10 border-needs/30 mb-8">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Play className="w-5 h-5 text-flow" />
                    Try It Out — Sample Scan Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-white/70">
                    New to two-step prompts? Practice with this sample Satellite Scan data from Estève before using your own.
                  </p>
                  
                  <div className="bg-black/30 rounded-xl p-5 border border-white/10">
                    <div className="flex flex-col md:flex-row items-start gap-4">
                      <div className="w-20 h-20 shrink-0 rounded-lg bg-gradient-to-br from-needs/30 to-flow/30 border border-needs/40 flex items-center justify-center">
                        <div className="text-center">
                          <FileText className="w-6 h-6 text-needs mx-auto mb-1" />
                          <span className="text-[10px] text-white/60 font-medium">SAMPLE</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div>
                          <h4 className="font-semibold text-white text-sm mb-1">Estève's Satellite Scan Results</h4>
                          <p className="text-xs text-white/50">Complete coaching data across all 8 lenses with situation analysis</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {["influence", "attitude", "chaordic", "flow", "alignment", "needs", "ego", "dynamics"].slice(0, 4).map((lens) => (
                            <Badge 
                              key={lens}
                              variant="outline" 
                              className="text-[10px] px-2 py-0.5 border-white/20 text-white/60"
                            >
                              {lens.charAt(0).toUpperCase() + lens.slice(1)}
                            </Badge>
                          ))}
                          <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-white/20 text-white/60">
                            +4 more
                          </Badge>
                        </div>
                        
                        <Button
                          size="sm"
                          className="bg-needs hover:bg-needs/90 text-white"
                          onClick={handleCopySampleData}
                          data-testid="copy-sample-data"
                        >
                          {copiedSample ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                          {copiedSample ? "Copied to Clipboard!" : "Copy Sample Data"}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                </CardContent>
              </Card>
              
              {!promptsLoading && isUsingFallback && (
                <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${hadFetchError ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'}`}>
                  <span className="font-medium">{hadFetchError ? 'API Error — Using default prompts' : 'Using default prompts'}</span>
                  <span className={hadFetchError ? 'text-red-400/70' : 'text-yellow-400/70'}>
                    — {hadFetchError ? 'Could not load prompts from server. Voting is disabled.' : 'Prompts database may be empty. Voting is disabled.'}
                  </span>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promptsLoading ? (
                  [...Array(6)].map((_, i) => (
                    <Card key={i} className="bg-black/40 backdrop-blur-sm border-white/10 animate-pulse">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-4">
                          <div className="h-6 w-20 bg-white/10 rounded" />
                          <div className="h-8 w-16 bg-white/10 rounded" />
                        </div>
                        <div className="h-5 w-full bg-white/10 rounded mt-2" />
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="h-12 bg-white/10 rounded" />
                        <div className="space-y-2">
                          <div className="h-3 w-24 bg-white/10 rounded" />
                          <div className="h-3 w-full bg-white/10 rounded" />
                          <div className="h-3 w-3/4 bg-white/10 rounded" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  filteredPrompts.map((prompt) => (
                    <PromptCard 
                      key={prompt.id} 
                      prompt={prompt} 
                      onVote={handleVote}
                    />
                  ))
                )}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              id="understanding-data"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-needs flex items-center justify-center shadow-lg shadow-needs/40">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Understanding Your Data
                </h2>
              </div>
              <p className="text-white/70 mb-8 max-w-2xl">
                Video coaching for each lens of your Satellite Scan results. Watch to understand what your data means for your communication style.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {understandingYourDataVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-black/20 rounded-xl border border-white/10 overflow-hidden"
                  >
                    <div className="aspect-video bg-black">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${video.youtubeId}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="border-0"
                        data-testid={`video-understanding-${video.id}`}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        {video.lensType && (
                          <Badge 
                            style={{ 
                              backgroundColor: LENSES[video.lensType].hexColor + '30', 
                              color: LENSES[video.lensType].hexColor, 
                              borderColor: LENSES[video.lensType].hexColor + '50' 
                            }}
                            className="border text-xs"
                          >
                            {LENSES[video.lensType].name}
                          </Badge>
                        )}
                        <span className="text-xs text-white/50">{video.duration}</span>
                      </div>
                      <h3 className="font-semibold text-white text-sm leading-tight">{video.title}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              id="science"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-needs flex items-center justify-center shadow-lg shadow-needs/40">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Science of Communication
                </h2>
              </div>
              <p className="text-white/70 mb-8 max-w-2xl">
                Go deeper into the foundations. 15 videos covering TEDx talks, GreenBlueRed basics, and advanced concepts — each with downloadable infographics.
              </p>
              
              <div className="space-y-6">
                {scienceOfCommunicationVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="flex flex-col md:flex-row gap-6 p-4 bg-black/20 rounded-xl border border-white/10"
                  >
                    <div className="flex-1 aspect-video bg-black rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${video.youtubeId}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="border-0"
                        data-testid={`video-science-${video.id}`}
                      />
                    </div>
                    <div className="md:w-72 flex flex-col gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {video.lensType && (
                          <Badge 
                            style={{ 
                              backgroundColor: LENSES[video.lensType].hexColor + '30', 
                              color: LENSES[video.lensType].hexColor, 
                              borderColor: LENSES[video.lensType].hexColor + '50' 
                            }}
                            className="border"
                          >
                            {LENSES[video.lensType].name}
                          </Badge>
                        )}
                        <span className="text-xs text-white/50">{video.duration}</span>
                      </div>
                      <h3 className="font-semibold text-white text-sm leading-tight">{video.title}</h3>
                      {video.infographic && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          asChild
                          data-testid={`download-science-${video.id}`}
                        >
                          <a href={video.infographic} download>
                            <Download className="w-4 h-4 mr-2" />
                            Download Infographic
                          </a>
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              id="calendar"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-needs flex items-center justify-center shadow-lg shadow-needs/40">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Community Calendar
                </h2>
              </div>
              <p className="text-white/70 mb-8 max-w-2xl">
                Align your growth with nature's rhythms. Our seasonal Play Labs offer live sessions where you practice conscious communication in community—building skills that transform both your work relationships and personal connections.
              </p>
              
              <div className="max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <img 
                    src={circularCalendarUrl} 
                    alt="Online Coaching Calendar - 8 Lenses aligned with months" 
                    className="w-full h-auto"
                    style={{
                      maskImage: 'radial-gradient(ellipse 70% 70% at center, black 50%, transparent 100%)',
                      WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at center, black 50%, transparent 100%)'
                    }}
                  />
                </motion.div>
                
                <div className="mt-6 text-center">
                  <Link href="/calendar">
                    <Button className="bg-needs hover:bg-needs/90 text-white" data-testid="button-view-calendar">
                      View Play Labs Schedule
                      <ChevronDown className="w-4 h-4 ml-2 rotate-[-90deg]" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              id="community"
              className="pb-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-needs flex items-center justify-center shadow-lg shadow-needs/40">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Continue the Conversation
                </h2>
              </div>
              <p className="text-white/70 mb-8 max-w-2xl">
                Your learning doesn't stop here. Join fellow explorers in the GreenElephant Insiders community to share insights, ask questions, and grow together.
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#0A66C2] flex items-center justify-center shadow-lg">
                  <SiLinkedin className="w-5 h-5 text-white" />
                </div>
                <Button 
                  size="lg"
                  className="bg-needs hover:bg-needs/90 text-white"
                  data-testid="button-join-linkedin"
                  asChild
                >
                  <a 
                    href="https://www.linkedin.com/groups/9263616/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join GreenElephant Insiders
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </motion.div>
            
          </div>
        </div>
      </div>
      
      <section 
        className="relative min-h-[80vh]"
        aria-label="Mont Ventoux landscape"
      >
        {/* Base background - starting from page black going to black */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: `linear-gradient(to bottom,
              #000000 0%,
              #050a14 15%,
              #0a1424 30%,
              #081020 50%,
              #050a14 70%,
              #020408 85%,
              #000000 100%
            )`
          }}
        />
        
        {/* Mont Ventoux image - with gentle top mask to show mountain and sky */}
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: `url(${provenceImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            backgroundRepeat: 'no-repeat',
            maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 8%, rgba(0,0,0,0.6) 15%, rgba(0,0,0,0.85) 22%, black 30%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 8%, rgba(0,0,0,0.6) 15%, rgba(0,0,0,0.85) 22%, black 30%, black 100%)'
          }}
        />
        
        {/* Bottom gradient overlay to fade to black */}
        <div 
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ 
            height: '25%',
            background: `linear-gradient(to top,
              #000000 0%,
              rgba(0, 0, 0, 0.9) 30%,
              rgba(0, 0, 0, 0.6) 60%,
              rgba(0, 0, 0, 0.2) 85%,
              transparent 100%
            )`
          }}
        />
        
        <div className="absolute bottom-8 left-0 right-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <p className="text-white/60 text-sm mb-4">Mont Ventoux, Provence</p>
              <img 
                src={logoUrl} 
                alt="GreenElephant logo" 
                className="w-16 h-16 mx-auto mb-4 opacity-90"
              />
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                GreenElephant.org
              </h3>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
