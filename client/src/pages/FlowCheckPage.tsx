import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  ArrowRight,
  ArrowLeft,
  Zap,
  Play,
  CheckCircle2,
  Scan,
  BarChart3,
  Sparkles,
  Activity,
  Target,
  TrendingUp,
  Users,
  Briefcase,
  GraduationCap,
  HeartHandshake,
  Megaphone,
  MessageSquare,
  Presentation,
  UserCheck,
  Shield,
  Lightbulb,
  Video,
} from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "What is the Check-my-FLOW assessment?",
    answer: "Check-my-FLOW is a free assessment based on Csikszentmihalyi's flow model. It measures your perceived motivation, challenge, and competence in a specific communication situation and maps you into one of four zones: Flow, Challenge/Stress, Comfort, or Danger/Apathy.",
  },
  {
    question: "How accurate is this assessment?",
    answer: "This is a directional indicator based on one of 8 lenses from the Satellite Scan. It reveals your flow pattern in a single communication situation. For a comprehensive analysis across all 8 lenses with 129 questions, the full Satellite Scan provides a much deeper picture.",
  },
  {
    question: "Is my data private?",
    answer: "Yes. Your assessment is processed locally unless you choose to provide your email. If you do, we store your results securely and never share personal data with third parties. We follow GDPR guidelines.",
  },
];

const SITUATIONS = [
  { id: "team_meeting", label: "Leading or participating in a team meeting", icon: Users },
  { id: "one_on_one", label: "Having a 1:1 conversation with a colleague or manager", icon: MessageSquare },
  { id: "presentation", label: "Giving a presentation or pitch", icon: Presentation },
  { id: "feedback", label: "Giving or receiving feedback", icon: Target },
  { id: "conflict", label: "Navigating a conflict or disagreement", icon: Shield },
  { id: "negotiation", label: "Negotiating terms or resources", icon: Briefcase },
  { id: "brainstorm", label: "Brainstorming or creative collaboration", icon: Lightbulb },
  { id: "stakeholder", label: "Communicating with senior stakeholders", icon: UserCheck },
  { id: "client", label: "Client or customer-facing communication", icon: HeartHandshake },
  { id: "public_speaking", label: "Public speaking or facilitating a workshop", icon: Megaphone },
  { id: "written", label: "Writing an important email, report, or proposal", icon: GraduationCap },
  { id: "other", label: "Other (describe your own)", icon: Activity },
];

const ROLES = [
  { id: "leader", label: "Leader / Manager", description: "You lead teams or projects" },
  { id: "individual_contributor", label: "Individual Contributor", description: "You contribute expertise within a team" },
  { id: "consultant", label: "Consultant / Advisor", description: "You advise organizations externally" },
  { id: "coach_facilitator", label: "Coach / Facilitator", description: "You guide people through growth" },
  { id: "educator", label: "Educator / Trainer", description: "You teach or design learning experiences" },
  { id: "assistant", label: "Executive / Virtual Assistant", description: "You support leaders and coordinate" },
  { id: "entrepreneur", label: "Entrepreneur / Founder", description: "You build and run your own venture" },
];

type Zone = "flow" | "challenge" | "comfort" | "danger";

interface ZoneConfig {
  name: string;
  badgeClass: string;
  textClass: string;
  borderClass: string;
  bgClass: string;
  description: string;
  interpretation: (situation: string, role: string, motivation: number, challenge: number, competence: number) => string;
  recommendations: string[];
}

function aOrAn(word: string): string {
  return /^[aeiou]/i.test(word.trim()) ? "an" : "a";
}

const ZONE_CONFIG: Record<Zone, ZoneConfig> = {
  flow: {
    name: "Flow Zone",
    badgeClass: "bg-flow text-white",
    textClass: "text-flow",
    borderClass: "border-flow/30",
    bgClass: "bg-flow/10",
    description: "High perceived challenge matched with high perceived competence. You are fully engaged.",
    interpretation: (situation, role, motivation, challenge, competence) =>
      `As ${aOrAn(role)} ${role} in "${situation}", you perceive both high challenge (${challenge}/10) and high competence (${competence}/10), with strong motivation (${motivation}/10). This is the optimal state—you're stretched just enough to stay engaged without feeling overwhelmed. Your skills match the demands of this situation, creating deep involvement and satisfaction.`,
    recommendations: [
      "Protect this state — notice what conditions create it so you can replicate them",
      "Talk to a colleague about what is working — it can help them find their rhythm too",
      "Consider increasing complexity gradually to keep growing",
    ],
  },
  challenge: {
    name: "Challenge / Stress Zone",
    badgeClass: "bg-attitude text-white",
    textClass: "text-attitude",
    borderClass: "border-attitude/30",
    bgClass: "bg-attitude/10",
    description: "High perceived challenge with lower perceived competence. You may feel anxious or stressed.",
    interpretation: (situation, role, motivation, challenge, competence) =>
      `As ${aOrAn(role)} ${role} in "${situation}", you perceive high challenge (${challenge}/10) but lower competence (${competence}/10). With motivation at ${motivation}/10, this creates a stress pattern. The situation demands more than you currently feel equipped to handle. This isn't about actual ability — it's about perception. Targeted support can shift this rapidly.`,
    recommendations: [
      "Ask trusted colleagues to share what they notice you doing well",
      "Break the challenge into smaller, manageable sub-tasks",
      "Request mentoring or pair up with someone experienced in this area",
      "Bring more structure to the situation — a clear agenda, a time limit, written preparation",
    ],
  },
  comfort: {
    name: "Comfort Zone",
    badgeClass: "bg-primary text-white",
    textClass: "text-primary",
    borderClass: "border-primary/30",
    bgClass: "bg-primary/10",
    description: "Low perceived challenge with high perceived competence. You feel safe but may be coasting.",
    interpretation: (situation, role, motivation, challenge, competence) =>
      `As ${aOrAn(role)} ${role} in "${situation}", you perceive low challenge (${challenge}/10) but high competence (${competence}/10). With motivation at ${motivation}/10, you're in your comfort zone. While this feels safe, sustained comfort leads to stagnation. Your skills exceed the demands — which means you have capacity for growth.`,
    recommendations: [
      "Volunteer for a stretch role — host a session, mentor someone, take notes for the group",
      "Set a personal challenge within the situation (e.g., ask a provocative question)",
      "Explore adjacent skills that would raise the challenge level",
      "Reflect on whether staying comfortable is holding you back from a more meaningful challenge",
    ],
  },
  danger: {
    name: "Danger / Apathy Zone",
    badgeClass: "bg-destructive text-white",
    textClass: "text-destructive",
    borderClass: "border-destructive/30",
    bgClass: "bg-destructive/10",
    description: "Low perceived challenge and low perceived competence. Disengagement risk is high.",
    interpretation: (situation, role, motivation, challenge, competence) =>
      `As ${aOrAn(role)} ${role} in "${situation}", you perceive both low challenge (${challenge}/10) and low competence (${competence}/10), with motivation at ${motivation}/10. This is the danger zone — neither the situation nor your skills feel adequate. This creates apathy and disengagement, which compounds over time. Urgent attention is needed.`,
    recommendations: [
      "Reconnect with your purpose — why does this situation matter to you?",
      "Ask for honest perspective from a trusted peer or coach",
      "Ask yourself honestly whether this situation is the right fit for your energy right now",
      "Start small — identify one specific communication habit to practise today",
    ],
  },
};

// Motivation modifies perceived challenge: low motivation = disengagement = challenges feel
// less demanding; high motivation = heightened engagement = challenges feel more demanding.
// Scale 0.8 means motivation can shift effective challenge by up to ±4 points (over 0–10 range).
function effectiveChallengeLevel(motivation: number, challenge: number): number {
  return Math.min(10, Math.max(0, challenge + (motivation - 5) * 0.8));
}

function computeZone(motivation: number, challenge: number, competence: number): Zone {
  // Use motivation-adjusted effective challenge so zone and dot position are always consistent.
  const effCh = effectiveChallengeLevel(motivation, challenge);
  const highChallenge = effCh >= 5;
  const highCompetence = competence >= 5;

  if (highChallenge && highCompetence) return "flow";
  if (highChallenge && !highCompetence) return "challenge";
  if (!highChallenge && highCompetence) return "comfort";
  return "danger";
}

const ZONE_COLORS = {
  flow: "#009999",
  challenge: "#e67e22",
  comfort: "#2980b9",
  danger: "#c0392b",
};

// Csikszentmihalyi's 8 emotional states, placed at the centroid of their sector.
// Sectors are defined by 8 half-lines from center to 3/10 and 7/10 of each outer side.
// Zone color assignment is semantic (Arousal = teal because it's a positive state).
const EMOTION_LABELS: { label: string; x: number; y: number; zone: Zone }[] = [
  { label: "Flow",        x: 50,  y: 21,  zone: "flow" },       // top vertex sector
  { label: "Arousal",     x: 34,  y: 34,  zone: "flow" },       // NW sector (high ch, sufficient skill)
  { label: "Control",     x: 66,  y: 34,  zone: "comfort" },    // NE sector (skill > challenge)
  { label: "Relaxation",  x: 79,  y: 50,  zone: "comfort" },    // right vertex sector
  { label: "Boredom",     x: 66,  y: 66,  zone: "danger" },     // SE sector (both dropping)
  { label: "Apathy",      x: 50,  y: 79,  zone: "danger" },     // bottom vertex sector
  { label: "Worry",       x: 34,  y: 66,  zone: "challenge" },  // SW sector
  { label: "Anxiety",     x: 21,  y: 50,  zone: "challenge" },  // left vertex sector
];

function FlowDiamond({
  challenge,
  competence,
  motivation,
  zone,
  size = "md",
  showDot = true,
  highlightZone,
}: {
  challenge?: number;
  competence?: number;
  motivation?: number;
  zone: Zone;
  size?: "sm" | "md" | "lg";
  showDot?: boolean;
  highlightZone?: Zone;
}) {
  // Raw dot: position based purely on ch/comp (what you actually rated)
  const rawCh = challenge ?? 5;
  const rawComp = competence ?? 5;
  const baseDotX = 50 + 5 * (rawComp - rawCh);
  const baseDotY = 100 - 5 * (rawCh + rawComp);

  // Motivation-adjusted dot: motivation shifts effective challenge → dot moves
  const effCh = motivation !== undefined
    ? effectiveChallengeLevel(motivation, rawCh)
    : rawCh;
  const dotX = 50 + 5 * (rawComp - effCh);
  const dotY = 100 - 5 * (effCh + rawComp);

  // Show ghost only when motivation meaningfully shifts the dot position
  const hasMotiShift = showDot
    && challenge !== undefined
    && motivation !== undefined
    && (Math.abs(dotX - baseDotX) > 2 || Math.abs(dotY - baseDotY) > 2);

  const zoneFills: Record<Zone, string> = {
    flow: ZONE_COLORS.flow,
    challenge: ZONE_COLORS.challenge,
    comfort: ZONE_COLORS.comfort,
    danger: ZONE_COLORS.danger,
  };

  const getOpacity = (z: Zone) =>
    highlightZone ? (z === highlightZone ? 0.75 : 0.12) : 0.35;

  const sizeClass =
    size === "sm" ? "w-24 h-24" : size === "lg" ? "w-full max-w-xs" : "w-48 h-48";

  const showEmotions = size !== "sm";

  // 8 half-line endpoints: 3/10 and 7/10 of each outer side, clockwise from top vertex
  // Top-right (top→right): 3/10=(65,15), 7/10=(85,35)
  // Bottom-right (right→bottom): 3/10=(85,65), 7/10=(65,85)
  // Bottom-left (bottom→left): 3/10=(35,85), 7/10=(15,65)
  // Top-left (left→top): 3/10=(15,35), 7/10=(35,15)
  const sectorPts = [
    [65,15],[85,35],[85,65],[65,85],[35,85],[15,65],[15,35],[35,15]
  ];

  return (
    <div className={`relative mx-auto aspect-square ${sizeClass}`} data-testid="flow-grid">
      <svg viewBox="-10 -10 120 120" className="w-full h-full overflow-visible">
        <defs>
          <clipPath id={`diamond-clip-${size}`}>
            <polygon points="50,0 100,50 50,100 0,50" />
          </clipPath>
          <marker id={`arrow-up-${size}`} markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
            <path d="M0,4 L2,0 L4,4" fill="none" stroke="white" strokeWidth="0.8" opacity="0.7" />
          </marker>
          <marker id={`arrow-dn-${size}`} markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
            <path d="M0,0 L2,4 L4,0" fill="none" stroke="white" strokeWidth="0.8" opacity="0.7" />
          </marker>
        </defs>

        {/* Outer diamond border */}
        <polygon points="50,0 100,50 50,100 0,50" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />

        {/* ── CORRECT ZONE FILLS: 4 rhombuses bounded by the ch=5 and comp=5 diagonals ── */}
        {/* ch=5 boundary: (75,25)→(25,75)  |  comp=5 boundary: (25,25)→(75,75)         */}
        {/* Flow zone (ch≥5 AND comp≥5): top rhombus  */}
        <polygon
          points="50,0 75,25 50,50 25,25"
          fill={zoneFills.flow}
          opacity={getOpacity("flow")}
          clipPath={`url(#diamond-clip-${size})`}
        />
        {/* Comfort zone (ch<5 AND comp≥5): right rhombus */}
        <polygon
          points="75,25 100,50 75,75 50,50"
          fill={zoneFills.comfort}
          opacity={getOpacity("comfort")}
          clipPath={`url(#diamond-clip-${size})`}
        />
        {/* Danger zone (ch<5 AND comp<5): bottom rhombus */}
        <polygon
          points="50,50 75,75 50,100 25,75"
          fill={zoneFills.danger}
          opacity={getOpacity("danger")}
          clipPath={`url(#diamond-clip-${size})`}
        />
        {/* Challenge zone (ch≥5 AND comp<5): left rhombus */}
        <polygon
          points="25,25 50,50 25,75 0,50"
          fill={zoneFills.challenge}
          opacity={getOpacity("challenge")}
          clipPath={`url(#diamond-clip-${size})`}
        />

        {/* ── ZONE BOUNDARY LINES: the two diagonals that separate the 4 zones ── */}
        <line x1="25" y1="25" x2="75" y2="75" stroke="rgba(255,255,255,0.22)" strokeWidth="0.5" />
        <line x1="75" y1="25" x2="25" y2="75" stroke="rgba(255,255,255,0.22)" strokeWidth="0.5" />

        {/* ── 8 SECTOR LINES: from center to 3/10 and 7/10 of each outer side ── */}
        {sectorPts.map(([px, py], i) => (
          <line
            key={i}
            x1="50" y1="50"
            x2={px} y2={py}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.4"
          />
        ))}

        {/* Zone corner labels */}
        {size !== "sm" && (
          <>
            <text x="50"  y="-3"  textAnchor="middle" fontSize="4"   fill={zoneFills.flow}      opacity="0.9" fontWeight="bold">FLOW</text>
            <text x="108" y="52"  textAnchor="start"  fontSize="3.5" fill={zoneFills.comfort}   opacity="0.8">COMFORT</text>
            <text x="50"  y="108" textAnchor="middle" fontSize="3.5" fill={zoneFills.danger}    opacity="0.8">DANGER</text>
            <text x="-8"  y="52"  textAnchor="end"    fontSize="3.5" fill={zoneFills.challenge} opacity="0.8">STRESS</text>
          </>
        )}

        {/* Csikszentmihalyi's 8 emotion labels at sector centroids */}
        {showEmotions && EMOTION_LABELS.map((e) => {
          const isActive = !highlightZone || highlightZone === e.zone;
          return (
            <text
              key={e.label}
              x={e.x} y={e.y}
              textAnchor="middle"
              fontSize="3.2"
              fontStyle="italic"
              fill={zoneFills[e.zone]}
              opacity={isActive ? (highlightZone ? 0.9 : 0.6) : 0.15}
              clipPath={`url(#diamond-clip-${size})`}
            >
              {e.label}
            </text>
          );
        })}

        {/* Ghost dot at raw ch/comp position + dashed arrow to motivation-adjusted position */}
        {hasMotiShift && (
          <>
            <circle cx={baseDotX} cy={baseDotY} r="3" fill="white" opacity="0.2" />
            <circle cx={baseDotX} cy={baseDotY} r="1.5" fill="white" opacity="0.35" />
            <line
              x1={baseDotX} y1={baseDotY}
              x2={dotX} y2={dotY}
              stroke="white" strokeWidth="0.9" opacity="0.35" strokeDasharray="2 2"
            />
          </>
        )}

        {/* Main dot at motivation-adjusted (effective) position */}
        {showDot && challenge !== undefined && competence !== undefined && (
          <>
            <circle cx={dotX} cy={dotY} r="6"   fill={zoneFills[zone]} opacity="0.25" />
            <circle cx={dotX} cy={dotY} r="3.5" fill={zoneFills[zone]} stroke="white" strokeWidth="1" />
            <circle cx={dotX} cy={dotY} r="1.5" fill="white" />
          </>
        )}
      </svg>
    </div>
  );
}

function HudRing({ color = "#009999", className = "" }: { color?: string; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="w-full h-full" overflow="visible">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
          <line
            key={i}
            x1={60 + 44 * Math.cos((angle * Math.PI) / 180)}
            y1={60 + 44 * Math.sin((angle * Math.PI) / 180)}
            x2={60 + 54 * Math.cos((angle * Math.PI) / 180)}
            y2={60 + 54 * Math.sin((angle * Math.PI) / 180)}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />
        ))}
        <path d="M 60 6 A 54 54 0 0 1 113 60" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        <path d="M 7 60 A 54 54 0 0 1 60 114" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.4" />
        <path d="M 93 12 A 54 54 0 0 1 113 40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 7 80 A 54 54 0 0 1 27 108" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />
        <text x="60" y="56" textAnchor="middle" fontSize="7" fill="white" opacity="0.9" fontWeight="bold" fontFamily="monospace">FLOW</text>
        <text x="60" y="66" textAnchor="middle" fontSize="4" fill={color} opacity="0.8" fontFamily="monospace">CHECK</text>
      </svg>
    </div>
  );
}

export default function FlowCheckPage() {
  const [step, setStep] = useState(0);
  const [situation, setSituation] = useState("");
  const [customSituation, setCustomSituation] = useState("");
  const [role, setRole] = useState("");
  const [motivation, setMotivation] = useState(5);
  const [challenge, setChallenge] = useState(5);
  const [competence, setCompetence] = useState(5);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [zone, setZone] = useState<Zone>("flow");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const situationLabel = situation === "other"
    ? customSituation || "your situation"
    : SITUATIONS.find((s) => s.id === situation)?.label || "your situation";

  const roleLabel = ROLES.find((r) => r.id === role)?.label || "your role";

  const canProceed = () => {
    switch (step) {
      case 0: return true;
      case 1: return situation !== "" && (situation !== "other" || customSituation.trim().length > 0);
      case 2: return role !== "";
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const computedZone = computeZone(motivation, challenge, competence);
    setZone(computedZone);

    try {
      const body: Record<string, unknown> = {
        situation,
        customSituation: situation === "other" ? customSituation : undefined,
        role,
        motivation,
        challenge,
        competence,
      };

      if (email && consent) {
        body.email = email;
        body.name = name || undefined;
        body.consentText = "I agree to receive my Flow Check results and related communication insights from GreenElephant.org. I can unsubscribe at any time.";
      }

      await apiRequest("POST", "/api/flow-check", body);
    } catch {
      // silently continue — results are computed client-side
    }

    setShowResults(true);
    setIsSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (step === 4) {
      handleSubmit();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  const handleReset = () => {
    setStep(0);
    setSituation("");
    setCustomSituation("");
    setRole("");
    setMotivation(5);
    setChallenge(5);
    setCompetence(5);
    setEmail("");
    setName("");
    setConsent(false);
    setShowResults(false);
  };

  const zoneConfig = ZONE_CONFIG[zone];

  if (showResults) {
    return (
      <div className="min-h-screen pb-16" style={{ background: "linear-gradient(180deg, #000000 0%, #030308 100%)" }}>
        <SEO
          title="Your Flow Check Results | GreenElephant"
          description="See your communication flow zone based on Csikszentmihalyi's flow model. Understand your motivation, challenge, and competence balance."
          canonicalPath="/flow-check"
          keywords="flow state, communication flow, Csikszentmihalyi, flow assessment, communication zones"
          breadcrumbs={[
            { name: "Home", url: "/" },
            { name: "Flow Check", url: "/flow-check" },
          ]}
          faqItems={FAQ_ITEMS}
        />

        <div
          className="relative py-16 overflow-hidden"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${ZONE_COLORS[zone]}22 0%, transparent 65%)`,
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 text-center md:text-left">
                <Badge
                  className="mb-4 text-white border-0"
                  style={{ backgroundColor: ZONE_COLORS[zone] + "33", color: ZONE_COLORS[zone] }}
                  data-testid="badge-zone"
                >
                  {zoneConfig.name}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">
                  Your Flow Zone
                </h1>
                <p
                  className="text-2xl font-bold mb-4"
                  style={{ color: ZONE_COLORS[zone] }}
                  data-testid="text-zone-name"
                >
                  {zoneConfig.name}
                </p>
                <p className="text-white/60 max-w-xl mb-6">
                  {zoneConfig.description}
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {(["Motivation", "Challenge", "Competence"] as const).map((label, idx) => {
                    const val = [motivation, challenge, competence][idx];
                    return (
                      <div
                        key={label}
                        className="flex flex-col items-center px-4 py-2 rounded-md"
                        style={{ background: ZONE_COLORS[zone] + "18", border: `1px solid ${ZONE_COLORS[zone]}40` }}
                      >
                        <span
                          className="text-2xl font-bold"
                          style={{ color: ZONE_COLORS[zone] }}
                          data-testid={`text-${label.toLowerCase()}-score`}
                        >
                          {val}
                        </span>
                        <span className="text-xs text-white/50">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative flex-shrink-0 w-56 md:w-64 flex flex-col items-center">
                <div className="p-4">
                  <FlowDiamond
                    challenge={challenge}
                    competence={competence}
                    motivation={motivation}
                    zone={zone}
                    size="lg"
                    showDot={true}
                  />
                </div>
                {motivation !== undefined && (() => {
                  const effCh = effectiveChallengeLevel(motivation, challenge);
                  const shifted = Math.abs(effCh - challenge) >= 0.5;
                  const dir = motivation < 5 ? "reduced" : motivation > 5 ? "amplified" : null;
                  return (
                    <div className="mt-3 text-xs text-white/65 text-center leading-snug space-y-0.5">
                      {shifted && dir ? (
                        <>
                          <div>
                            <span className="text-white/60">Motivation {motivation}/10</span>
                            {" "}{dir} perceived engagement:
                          </div>
                          <div>
                            effective challenge{" "}
                            <span className="text-white/60">{challenge}</span>
                            {" "}→{" "}
                            <span className="text-white/60">{effCh.toFixed(1)}</span>
                            {" "}· dot shifted from raw position ○
                          </div>
                        </>
                      ) : (
                        <div>Motivation {motivation}/10 · no significant zone shift</div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="grid grid-cols-4 gap-3 mb-8">
            {(["flow", "challenge", "comfort", "danger"] as Zone[]).map((z) => (
              <div
                key={z}
                className="flex flex-col items-center gap-2 p-3 rounded-md"
                style={{
                  background: zone === z ? ZONE_COLORS[z] + "18" : "rgba(255,255,255,0.03)",
                  border: zone === z ? `1px solid ${ZONE_COLORS[z]}50` : "1px solid rgba(255,255,255,0.08)",
                }}
                data-testid={`card-zone-${z}`}
              >
                <FlowDiamond
                  zone={z}
                  size="sm"
                  showDot={false}
                  highlightZone={z}
                />
                <span
                  className="text-xs font-medium text-center leading-tight"
                  style={{ color: zone === z ? ZONE_COLORS[z] : "rgba(255,255,255,0.4)" }}
                >
                  {ZONE_CONFIG[z].name}
                </span>
                {zone === z && (
                  <span className="text-xs font-bold text-white/60 uppercase tracking-wide">You</span>
                )}
              </div>
            ))}
          </div>

          <Card className="mb-8 border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-3 text-white">Your Interpretation</h2>
              <p className="text-sm leading-relaxed text-white/70" data-testid="text-interpretation">
                {zoneConfig.interpretation(situationLabel, roleLabel, motivation, challenge, competence)}
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold mb-4 text-white">What To Do Next</h3>
              <ul className="space-y-3">
                {zoneConfig.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: ZONE_COLORS[zone] }} />
                    <span className="text-sm text-white/70">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8 border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <Video className="h-5 w-5 text-flow" />
                <h3 className="text-lg font-bold text-white">Learn More About Flow</h3>
              </div>
              <p className="text-sm text-white/60 mb-4">
                Watch "Measuring Flow" (4101) to understand how to measure and hack communication flow in your work and team.
              </p>
              <a
                href="https://youtu.be/EZBP2FByWBg"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-flow-video"
              >
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Play className="mr-2 h-4 w-4" />
                  Watch: 4101 Measuring Flow
                </Button>
              </a>
            </CardContent>
          </Card>

          <Card className="mb-8 border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Scan className="h-6 w-6 text-flow" />
                  <h3 className="text-xl font-bold text-white">See the Full Picture</h3>
                </div>
                <p className="text-white/60 max-w-2xl mx-auto">
                  You measured <strong>1 of 8 lenses</strong>. The full Satellite Scan maps all 8 with 129 questions and delivers a personalized AI-powered dashboard.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <BarChart3 className="h-4 w-4" />
                    <span>This Flow Check</span>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
                      3 sliders, 1 lens (Flow)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
                      Directional indicator
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
                      Single situation snapshot
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Sparkles className="h-4 w-4" />
                    <span>Full Satellite Scan</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      129 calibrated questions across all 8 lenses
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      Personalized AI-powered dashboard
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      Actionable coaching prompts for each lens
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      27 years of research-backed methodology
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/checkout?product=satellitescan">
                  <Button size="lg" data-testid="button-get-full-scan">
                    Get Your Full Satellite Scan — €99.95
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/signals">
                  <Button variant="outline" data-testid="button-signals-quiz">
                    Take the 6-Question Signals Quiz
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button onClick={handleReset} variant="ghost" data-testid="button-retake">
              Retake Flow Check
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <SEO
        title="Check Your Communication Flow | Free Assessment | GreenElephant"
        description="Measure your communication flow state using Csikszentmihalyi's model. Discover if you're in the Flow, Challenge, Comfort, or Danger zone in your key communication situations."
        canonicalPath="/flow-check"
        keywords="flow state assessment, self-awareness tool, free emotional intelligence test, personal development check, communication self-reflection, Csikszentmihalyi flow model, flow zone, motivation challenge competence, free communication assessment, free EQ check, conscious communication test, resilience check, personal growth tool, self-assessment, AI personal growth"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Flow Check", url: "/flow-check" },
        ]}
        faqItems={FAQ_ITEMS}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            {[0, 1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-flow" : "bg-muted"
                }`}
                data-testid={`progress-step-${s}`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-right">
            Step {step + 1} of 5
          </p>
        </div>

        {step === 0 && (
          <div data-testid="step-welcome">
            <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
              <div className="flex-1">
                <Badge className="mb-4 bg-flow/20 text-flow border-flow/30">Free Assessment · 2 minutes</Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Check Your Communication Flow
                </h1>
                <p className="text-muted-foreground mb-6">
                  Based on Mihaly Csikszentmihalyi's flow research, this assessment maps your
                  <strong> perceived motivation, challenge, and competence</strong> in a specific
                  communication situation — and places you in one of 4 zones.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-flow flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">What is Flow?</p>
                      <p className="text-sm text-muted-foreground">
                        Flow is when perceived challenge matches perceived competence — you're fully immersed and energized. Performers call it "being in the zone."
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-attitude flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">It's All About Perception</p>
                      <p className="text-sm text-muted-foreground">
                        Flow is based on your individual perception, not objective reality. You can hack your flow by shifting how you perceive situations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 w-64 md:w-72">
                <p className="text-xs text-muted-foreground text-center mb-3 uppercase tracking-wide">The 4 Zones</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["flow", "challenge", "comfort", "danger"] as Zone[]).map((z) => (
                    <div
                      key={z}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-md"
                      style={{ background: ZONE_COLORS[z] + "12", border: `1px solid ${ZONE_COLORS[z]}30` }}
                    >
                      <FlowDiamond zone={z} size="sm" showDot={false} highlightZone={z} />
                      <span className="text-xs font-medium text-center" style={{ color: ZONE_COLORS[z] }}>
                        {ZONE_CONFIG[z].name}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  You'll discover which zone you're in
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div data-testid="step-situation">
            <h2 className="text-2xl font-bold mb-2">Choose a Communication Situation</h2>
            <p className="text-muted-foreground mb-6">
              Think of a specific situation you want to assess your flow in.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {SITUATIONS.map((sit) => {
                const Icon = sit.icon;
                const isSelected = situation === sit.id;
                return (
                  <button
                    key={sit.id}
                    onClick={() => setSituation(sit.id)}
                    className={`flex items-center gap-3 p-4 rounded-md border text-left transition-all hover-elevate ${
                      isSelected ? "border-flow bg-flow/10" : "border-border"
                    }`}
                    data-testid={`button-situation-${sit.id}`}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 ${isSelected ? "text-flow" : "text-muted-foreground"}`} />
                    <span className="text-sm">{sit.label}</span>
                  </button>
                );
              })}
            </div>
            {situation === "other" && (
              <div className="mt-4">
                <Label htmlFor="custom-situation">Describe your situation</Label>
                <Input
                  id="custom-situation"
                  value={customSituation}
                  onChange={(e) => setCustomSituation(e.target.value)}
                  placeholder="e.g., Onboarding a new team member..."
                  className="mt-2"
                  data-testid="input-custom-situation"
                />
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div data-testid="step-role">
            <h2 className="text-2xl font-bold mb-2">What's Your Role?</h2>
            <p className="text-muted-foreground mb-6">
              Select the role that best describes you in this context.
            </p>
            <div className="space-y-3">
              {ROLES.map((r) => {
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-md border text-left transition-all hover-elevate ${
                      isSelected ? "border-flow bg-flow/10" : "border-border"
                    }`}
                    data-testid={`button-role-${r.id}`}
                  >
                    <div>
                      <p className="font-medium text-sm">{r.label}</p>
                      <p className="text-xs text-muted-foreground">{r.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div data-testid="step-sliders">
            <h2 className="text-2xl font-bold mb-2">Rate Your Perception</h2>
            <p className="text-muted-foreground mb-8">
              Think about <strong>"{situationLabel}"</strong> as {aOrAn(roleLabel)} <strong>{roleLabel}</strong>. Rate how you{" "}<em>perceive</em>{" "}each dimension right now.
            </p>

            <div className="space-y-10">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Label className="text-base font-semibold">Motivation</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      How motivated and driven do you feel in this situation?
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-flow" data-testid="text-motivation-value">{motivation}</span>
                </div>
                <Slider
                  value={[motivation]}
                  onValueChange={([v]) => setMotivation(v)}
                  min={0}
                  max={10}
                  step={1}
                  data-testid="slider-motivation"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0 — No motivation</span>
                  <span>10 — Fully driven</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Label className="text-base font-semibold">Perceived Challenge</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      How challenging does this situation feel to you?
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-attitude" data-testid="text-challenge-value">{challenge}</span>
                </div>
                <Slider
                  value={[challenge]}
                  onValueChange={([v]) => setChallenge(v)}
                  min={0}
                  max={10}
                  step={1}
                  data-testid="slider-challenge"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0 — No challenge</span>
                  <span>10 — Extremely challenging</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Label className="text-base font-semibold">Perceived Competence</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      How competent do you feel handling this situation?
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-primary" data-testid="text-competence-value">{competence}</span>
                </div>
                <Slider
                  value={[competence]}
                  onValueChange={([v]) => setCompetence(v)}
                  min={0}
                  max={10}
                  step={1}
                  data-testid="slider-competence"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0 — Not competent</span>
                  <span>10 — Fully competent</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div data-testid="step-email">
            <h2 className="text-2xl font-bold mb-2">Get Your Results via Email (Optional)</h2>
            <p className="text-muted-foreground mb-6">
              Leave your email to receive a copy of your results with personalized recommendations.
              You can skip this step—your results will still be shown.
            </p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="flow-name">Name</Label>
                <Input
                  id="flow-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="mt-2"
                  data-testid="input-name"
                />
              </div>
              <div>
                <Label htmlFor="flow-email">Email</Label>
                <Input
                  id="flow-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="mt-2"
                  data-testid="input-email"
                />
              </div>
              {email && (
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="flow-consent"
                    checked={consent}
                    onCheckedChange={(checked) => setConsent(checked === true)}
                    data-testid="checkbox-consent"
                  />
                  <Label htmlFor="flow-consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                    I agree to receive my Flow Check results and related communication insights from GreenElephant.org. I can unsubscribe at any time.
                  </Label>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 gap-4">
          {step > 0 ? (
            <Button variant="ghost" onClick={handleBack} data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <div />
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting || (step === 4 && email !== "" && !consent)}
            data-testid="button-next"
          >
            {isSubmitting ? (
              "Calculating..."
            ) : step === 4 ? (
              <>
                See My Results
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
