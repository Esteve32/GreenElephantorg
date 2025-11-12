import { AlertTriangle, Brain, Heart, TrendingDown, Users, Zap, Target } from "lucide-react";

export interface QuizQuestion {
  id: string;
  lens: string;
  lensColor: string;
  icon: typeof Brain;
  question: string;
  context: string;
  options: {
    label: string;
    value: number;
  }[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "ego_defensive",
    lens: "Ego",
    lensColor: "ego",
    icon: Brain,
    question: "When someone gives you critical feedback, how do you typically respond?",
    context: "Notice your first instinct—before you have time to think about it.",
    options: [
      { label: "I pause and genuinely listen before responding", value: 0 },
      { label: "I mostly listen, though I notice some defensiveness", value: 25 },
      { label: "I sometimes justify or explain before fully hearing them", value: 50 },
      { label: "I often interrupt to correct or defend my position", value: 75 },
      { label: "I immediately justify, explain, or counter-argue", value: 100 },
    ],
  },
  {
    id: "influence_space",
    lens: "Influence",
    lensColor: "influence",
    icon: Users,
    question: "In group conversations, how much space do you take versus give?",
    context: "Consider your natural pattern in meetings or team discussions.",
    options: [
      { label: "I balance speaking and listening fluidly", value: 0 },
      { label: "I'm mostly balanced, with occasional imbalances", value: 25 },
      { label: "I notice I either dominate or stay silent", value: 50 },
      { label: "I frequently interrupt or rarely speak up", value: 75 },
      { label: "I consistently dominate or completely withdraw", value: 100 },
    ],
  },
  {
    id: "alignment_expectations",
    lens: "Alignment",
    lensColor: "alignment",
    icon: Target,
    question: "How often do you explicitly check if you and others are aligned on expectations?",
    context: "Think about projects, commitments, or collaborative work.",
    options: [
      { label: "I always clarify and confirm mutual understanding", value: 0 },
      { label: "I usually check, with rare assumptions", value: 25 },
      { label: "I sometimes assume we're aligned without checking", value: 50 },
      { label: "I often assume shared understanding", value: 75 },
      { label: "I rarely check—I assume we're on the same page", value: 100 },
    ],
  },
  {
    id: "needs_awareness",
    lens: "Needs",
    lensColor: "needs",
    icon: Heart,
    question: "How aware are you of the needs driving your reactions in difficult moments?",
    context: "When you feel triggered, frustrated, or defensive.",
    options: [
      { label: "I can usually identify my underlying needs in the moment", value: 0 },
      { label: "I often recognize them shortly after", value: 25 },
      { label: "I sometimes identify them later through reflection", value: 50 },
      { label: "I rarely connect my reactions to underlying needs", value: 75 },
      { label: "I'm unaware—I just react automatically", value: 100 },
    ],
  },
  {
    id: "dynamics_conflict",
    lens: "Dynamics",
    lensColor: "dynamics",
    icon: TrendingDown,
    question: "When conflict arises, what's your instinctive pattern?",
    context: "Notice what happens before you have a conscious strategy.",
    options: [
      { label: "I stay present and engage with curiosity", value: 0 },
      { label: "I mostly engage, though I notice some avoidance", value: 25 },
      { label: "I sometimes avoid or postpone addressing it", value: 50 },
      { label: "I often avoid until it becomes unavoidable", value: 75 },
      { label: "I consistently avoid or escalate defensively", value: 100 },
    ],
  },
  {
    id: "flow_honesty",
    lens: "Flow",
    lensColor: "flow",
    icon: Zap,
    question: "How directly do you express what you truly need or want?",
    context: "Consider whether you hint, manage, or state clearly.",
    options: [
      { label: "I state my needs and wants directly and clearly", value: 0 },
      { label: "I'm mostly direct, with occasional indirectness", value: 25 },
      { label: "I sometimes hint or suggest rather than ask directly", value: 50 },
      { label: "I often manage or hint instead of stating clearly", value: 75 },
      { label: "I rarely express directly—I hint, manage, or stay silent", value: 100 },
    ],
  },
];

export interface ScoreTier {
  range: [number, number];
  label: string;
  color: string;
  icon: typeof AlertTriangle;
  title: string;
  description: string;
  guidance: string[];
}

export const SCORE_TIERS: ScoreTier[] = [
  {
    range: [0, 35],
    label: "Grounded",
    color: "alignment",
    icon: Heart,
    title: "You're Grounded in Conscious Communication",
    description: "Your awareness and practices are creating genuine connection. You've developed strong communication foundations.",
    guidance: [
      "Continue practicing presence and self-awareness",
      "Share your practices with others to deepen your mastery",
      "Consider joining our retreats to support others on this path",
      "Explore the Periodic Table for micro-habits to refine your practice",
    ],
  },
  {
    range: [36, 70],
    label: "Drifting",
    color: "chaordic",
    icon: AlertTriangle,
    title: "You're Drifting—Catching It Now Prevents Bigger Breakdowns",
    description: "You have some awareness, but unconscious patterns are creeping in. This is the perfect time to course-correct before trust erodes.",
    guidance: [
      "Notice your top risk patterns and experiment with alternatives",
      "Practice pausing before reacting in triggering moments",
      "Consider coaching to transform specific patterns",
      "Join a retreat to deepen your awareness in a supportive container",
    ],
  },
  {
    range: [71, 100],
    label: "Red Alert",
    color: "destructive",
    icon: AlertTriangle,
    title: "Red Alert—Unconscious Patterns Are Driving Your Communication",
    description: "These patterns are likely creating significant relationship and collaboration challenges. The good news: awareness is the first step to transformation.",
    guidance: [
      "Prioritize this work—the cost of inaction is high",
      "Book a coaching session to identify your most critical leverage point",
      "Consider consulting if these patterns affect your team or organization",
      "Practice one micro-habit from the Periodic Table daily",
    ],
  },
];

export function calculateScore(answers: Record<string, number>): number {
  const values = Object.values(answers);
  if (values.length === 0) return 0;
  
  const baseScore = values.reduce((sum, val) => sum + val, 0) / values.length;
  
  // Apply modifiers: +5 if two or more answers >= 75 (indicating drift)
  const highRiskCount = values.filter(v => v >= 75).length;
  const modifier = highRiskCount >= 2 ? 5 : 0;
  
  // Clamp to 0-100
  return Math.max(0, Math.min(100, Math.round(baseScore + modifier)));
}

export function getScoreTier(score: number): ScoreTier {
  return SCORE_TIERS.find(tier => score >= tier.range[0] && score <= tier.range[1]) || SCORE_TIERS[1];
}

export function getTopRiskLenses(answers: Record<string, number>): { lens: string; score: number; color: string }[] {
  return Object.entries(answers)
    .map(([id, score]) => {
      const question = QUIZ_QUESTIONS.find(q => q.id === id);
      return {
        lens: question?.lens || id,
        score,
        color: question?.lensColor || "muted",
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);
}
