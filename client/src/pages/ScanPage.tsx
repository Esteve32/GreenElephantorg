import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LENSES, type LensType } from "@/constants/lenses";
import { atmosphericPalette } from "@/constants/atmosphericGradient";
import { Link, useLocation } from "wouter";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, CheckCircle2, Sparkles, Brain, Timer, Users, Gift, AlertTriangle, Target, Zap, ArrowDown, HelpCircle, Smartphone, BarChart3, MessageSquare, Bot, Video, FileText, Play, Download, Table, Star, Shield, Award, Quote, ChevronLeft, ChevronRight, BookOpen, Mail, Lock, Repeat } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
const logoUrl = "/ge-logo-512.png";
import earthOrbitUrl from "@assets/generated_images/earth_orbit_aurora_view.png";
import { SEO, PRODUCT_STRUCTURED_DATA } from "@/components/SEO";

interface Persona {
  id: string;
  title: string;
  description: string;
  lenses: LensType[];
}

const PERSONAS: Persona[] = [
  {
    id: "product-leaders",
    title: "Product Leaders & Founders",
    description: "Building and shipping products with teams. Navigate the crucial conversations around strategy, priorities, and vision.",
    lenses: ["influence", "alignment", "flow"]
  },
  {
    id: "executive-assistants",
    title: "Executive Assistants",
    description: "Managing complex stakeholder dynamics and keeping leadership aligned. You're the connective tissue of the organization.",
    lenses: ["dynamics", "alignment", "needs"]
  },
  {
    id: "operations",
    title: "Operations & Ops Leaders",
    description: "Running the systems that make organizations work. You need crystal-clear communication to coordinate across functions.",
    lenses: ["flow", "chaordic", "alignment"]
  },
  {
    id: "innovation",
    title: "Innovation Managers",
    description: "Leading teams through change and uncertainty. Communication is how you build psychological safety for experimentation.",
    lenses: ["attitude", "chaordic", "influence"]
  },
  {
    id: "teal-leaders",
    title: "TEAL Leaders & Self-Organizing Teams",
    description: "Building organizations beyond hierarchy. You communicate through consent-based decisions and distributed authority.",
    lenses: ["dynamics", "chaordic", "ego"]
  },
  {
    id: "educators",
    title: "Educators & Program Directors",
    description: "Teaching and designing learning experiences. Your communication shapes how students show up to learn and grow.",
    lenses: ["attitude", "flow", "needs"]
  },
  {
    id: "coaches",
    title: "Coaches & Facilitators",
    description: "Guiding people through transformation. Your communication is the container where breakthroughs happen.",
    lenses: ["ego", "needs", "alignment"]
  },
  {
    id: "therapists",
    title: "Therapists & Healthcare Professionals",
    description: "Holding sacred space for healing. Communication is your primary tool for building trust and facilitating growth.",
    lenses: ["needs", "ego", "dynamics"]
  },
  {
    id: "consultants",
    title: "Consultants & Change Agents",
    description: "Helping organizations navigate transformation. You need to speak clearly across hierarchies and cultures.",
    lenses: ["influence", "attitude", "dynamics"]
  }
];

const PAIN_SIGNALS = [
  { signal: "Conversations feel like minefields", lens: "needs" as LensType },
  { signal: "The same conflicts repeat endlessly", lens: "dynamics" as LensType },
  { signal: "You react before you understand", lens: "ego" as LensType },
  { signal: "Trust erodes without you knowing why", lens: "alignment" as LensType },
  { signal: "You dominate or withdraw in groups", lens: "influence" as LensType },
  { signal: "Expectations are never aligned", lens: "alignment" as LensType },
  { signal: "Change feels threatening, not exciting", lens: "attitude" as LensType },
  { signal: "You can't find flow in conversations", lens: "flow" as LensType }
];

const STEPS = [
  {
    id: 1,
    title: "1. Take the Scan",
    description: "90 minutes. 129 questions across 8 lenses. Answer honestly—there are no wrong answers.",
    icon: Timer
  },
  {
    id: 2,
    title: "2. Receive Your Dashboard",
    description: "Our coaches personally review your responses and create a custom visual map within 48-72 hours.",
    icon: Brain
  },
  {
    id: 3,
    title: "3. Explore Your Patterns",
    description: "Unlock multiple times the value from your raw data by prompting your results in our custom GPT, the Conscious Communicator.",
    icon: Sparkles
  },
  {
    id: 4,
    title: "4. Transform Your Communication",
    description: "Apply what you learn. Join programs. Connect with facilitators. Build lasting change.",
    icon: Target
  }
];

const LENS_ORDER: LensType[] = ["influence", "attitude", "chaordic", "flow", "alignment", "needs", "ego", "dynamics"];

const LENS_DETAILS: Record<LensType, { painSignal: string; benefit: string }> = {
  influence: {
    painSignal: "Dominating conversations or withdrawing into passive silence, using hints instead of direct requests.",
    benefit: "Balance speaking and listening fluidly, building authentic relationships through honest dialogue."
  },
  attitude: {
    painSignal: "Resisting change, clinging to fixed viewpoints, or dismissing new perspectives before exploring them.",
    benefit: "Embrace growth opportunities with curiosity, adapting your stance while staying grounded."
  },
  chaordic: {
    painSignal: "Forcing rigid order or letting chaos overwhelm, struggling to find creative structure.",
    benefit: "Navigate between order and creative chaos, finding innovation in structured flexibility."
  },
  flow: {
    painSignal: "Feeling overwhelmed by anxiety or disengaged by boredom, unable to match challenge with skill.",
    benefit: "Balance challenge with capability, achieving full engagement and sustained motivation."
  },
  alignment: {
    painSignal: "Mismatched expectations, avoiding difficult conversations, surface agreements without commitment.",
    benefit: "Clarify mutual understanding, prevent disappointment, and ensure reliable follow-through."
  },
  needs: {
    painSignal: "Acting from unacknowledged needs, confusing strategies with needs, overriding self-care.",
    benefit: "Identify underlying needs clearly, explore creative solutions, and practice self-leadership."
  },
  ego: {
    painSignal: "Defensive reactions, needing to be right, quick judgment and labeling of others.",
    benefit: "Build authentic connection, find collaborative solutions, and develop genuine empathy."
  },
  dynamics: {
    painSignal: "Stuck in one mode—always leading or always following—unable to adapt to context.",
    benefit: "Fluidly shift between roles based on what each situation needs for best outcomes."
  }
};

const FAQ_ITEMS = [
  {
    id: "what-is",
    question: "What is the Satellite Scan?",
    answer: "The Satellite Scan is a structured 129-question self-reflection that maps your communication patterns across 8 lenses developed from coaching practice. Think of it as a communication mirror—it surfaces your self-reported tendencies, preferences, and patterns worth exploring in how you connect with others."
  },
  {
    id: "how-long",
    question: "How long does it take?",
    answer: "The questionnaire takes approximately 90 minutes to complete. We recommend finding a quiet space where you can reflect honestly on each scenario. After submission, our coaches personally review your responses and deliver your custom dashboard within 48-72 hours."
  },
  {
    id: "what-get",
    question: "What do I get?",
    answer: "You receive a personalized visual dashboard mapping your patterns across all 8 lenses, crafted by our coaching team. Unlock multiple times the value from your raw data by prompting your results in our custom GPT, the Conscious Communicator."
  },
  {
    id: "how-use",
    question: "How do I use my results?",
    answer: "Your dashboard reveals patterns you can immediately apply in conversations. Use the prompt library to dive deeper into specific lenses, explore challenging relationships, or prepare for important meetings. Many clients also choose to continue with our coaching programs for guided transformation."
  },
  {
    id: "confidential",
    question: "Is it confidential?",
    answer: "Absolutely. Your scan data is encrypted and never shared with third parties. Only you and your assigned coach (if you choose coaching) can access your results. We take privacy seriously—your communication patterns are sacred information."
  },
  {
    id: "refund",
    question: "What if it's not for me?",
    answer: "If after receiving your dashboard you feel the Satellite Scan didn't provide value, contact us within 14 days. We stand behind our work and want every participant to experience genuine insight. Our early adopters have consistently found transformative patterns in their results."
  },
  {
    id: "personality-test-difference",
    question: "How is this different from a personality test?",
    answer: "Unlike personality tests that assign fixed labels (introvert, INTJ, etc.), the Satellite Scan captures your self-reported communication preferences—tendencies that may shift based on context. It surfaces patterns you can reflect on and consciously explore, rather than defining who you are. Note: like other self-report tools, it shows how you perceive your behaviors, not an objective measure of how others experience you."
  },
  {
    id: "conflict-resolution",
    question: "How does this help with conflicts?",
    answer: "The scan surfaces your self-reported conflict tendencies across multiple lenses—how you perceive yourself handling needs, stress responses, and power dynamics. Reflecting on these patterns may help you notice when you're about to react defensively. Many users find that seeing their patterns mapped out prompts useful reflection about difficult conversations—though real behavior change requires ongoing practice and sometimes professional support."
  },
  {
    id: "digital-skills-required",
    question: "How much digital skills and AI literacy does the Satellite Scan require?",
    answer: "Very little. The scan itself is a simple Typeform questionnaire—if you can fill out an online form, you're set. To use the prompts with your data, you just copy and paste your results into any AI tool (ChatGPT, Claude, etc.). We recommend a free ChatGPT account, but it's not required. Our prompt library provides ready-to-use templates—no technical expertise needed."
  },
  {
    id: "multiple-stakeholders",
    question: "How does this help with complex communication involving multiple stakeholders?",
    answer: "The scan maps your patterns across dynamics (how you navigate power structures), alignment (how you build shared understanding), and influence (how you persuade). For multi-stakeholder situations, you'll understand how you adapt—or fail to adapt—when communication contexts shift. The prompts help you prepare for specific stakeholder conversations by analyzing your default patterns against each relationship."
  },
  {
    id: "time-management",
    question: "How does this help with time management and prioritization?",
    answer: "Your communication patterns directly impact productivity. The Flow lens reveals where you lose time in conversations (anxiety, boredom, or over-engagement). The Alignment lens shows where miscommunication creates rework. By understanding how you communicate about priorities and expectations, you can prevent the countless hours lost to misunderstandings, unnecessary meetings, and circular discussions."
  },
  {
    id: "personal-growth",
    question: "What kind of personal growth is this?",
    answer: "This is conscious communication development—growth in how you connect, influence, and understand others. It's not therapy or spiritual bypassing. It's practical self-awareness that improves your professional relationships, leadership presence, and ability to navigate complex human dynamics. The growth is measurable: you can retake the scan to track how your patterns evolve over time."
  },
  {
    id: "under-the-hood",
    question: "Can I see under the hood of what is measured?",
    answer: "Absolutely! The Satellite Scan is built on the Periodic Table of Conscious Communication—a framework of 129 communication elements organized across 8 lenses. Each element represents a specific communication behavior or pattern. You can explore the entire framework on our Periodic Table page to understand exactly what we measure and why.",
    hasLink: true,
    linkText: "Explore the Periodic Table",
    linkUrl: "/periodic-table"
  },
  {
    id: "fractional-roles",
    question: "How can this help fractional roles (part-time coaching, fractional CMOs, etc.)?",
    answer: "Fractional professionals must build trust and create impact quickly across multiple organizations. The scan reveals how you adapt your communication style when context-switching between clients. Understanding your default patterns helps you consciously shift gears, maintain boundaries, and deliver consistent value even when you're splitting attention across different organizational cultures."
  },
  {
    id: "new-skills",
    question: "How does this enable new skills?",
    answer: "Self-awareness is the foundation of skill development. The scan doesn't teach you skills—it shows you which communication skills you've already mastered and which need development. Armed with this map, you can target specific areas: perhaps your influence is strong but your listening needs work, or you're great in one-on-one but struggle in groups. The prompt library then helps you practice specific micro-skills in real conversations."
  },
  {
    id: "tools-automation",
    question: "What are the best tools and AI automation to get the most value from the Satellite Scan?",
    answer: "A free ChatGPT account is recommended but not required—our prompts work with any AI tool (Claude, Gemini, Copilot, etc.). Simply copy your scan data and paste it into any of our 10+ prompts. For advanced users, you can use our Conscious Communicator custom GPT for richer analysis. No special software, subscriptions, or technical setup needed—just copy, paste, and explore."
  },
  {
    id: "retake-scan",
    question: "Can this be done more than once?",
    answer: "Yes! In fact, we encourage it. Each scan is like a snapshot of your communication behaviors in a given time and context. Your patterns shift as you grow, change roles, or face new challenges. Retaking the scan after 6-12 months shows your development trajectory and reveals which patterns have transformed. Many users track their growth by comparing scans over time."
  },
  {
    id: "research-science",
    question: "What is the research and science behind this?",
    answer: "The Satellite Scan is a practitioner-developed coaching tool, not a peer-reviewed psychometric instrument. It's built on the Periodic Table of Conscious Communication—a framework synthesized from 27 years of professional practice across executive coaching, mediation, NVC, and organizational development. The framework draws theoretical inspiration from established fields: attachment theory and emotional intelligence from psychology, speech-act theory and conversational pragmatics from linguistics, systems thinking from sociology, and relational ethics from philosophy. While these theoretical foundations are well-established, the Satellite Scan itself has not undergone independent psychometric validation (test-retest reliability, predictive validity studies, etc.). We're transparent about this: we offer a structured reflective tool for self-discovery and coaching, not a clinically validated diagnostic assessment."
  },
  {
    id: "not-for-hiring",
    question: "Can this be used for hiring or performance reviews?",
    answer: "No—and we strongly advise against it. The Satellite Scan is designed exclusively for personal development, team building, and coaching. It should never be used for hiring decisions, screening applicants, performance evaluations, or any employment selection process. Like the MBTI and similar self-reflection tools, it measures self-reported preferences in a moment, not abilities or job qualifications. Using it for selection decisions would be both ethically inappropriate and potentially legally problematic. If you need validated assessments for hiring, please consult occupational psychologists who specialize in employment selection tools."
  },
  {
    id: "workplace-use-limits",
    question: "What are the limitations for workplace use?",
    answer: "The Satellite Scan is valuable for voluntary personal development, team communication workshops, and coaching conversations—but only when participation is truly voluntary and results remain private to the individual. It should not be used to: label or categorize employees, make promotion decisions, compare team members against each other, or create performance metrics. Organizations using team scans should ensure psychological safety, confidentiality, and that no adverse employment decisions are based on results. The tool reveals patterns for self-reflection, not objective measures of competence."
  },
  {
    id: "ea-crisis-communication",
    question: "How does this help Executive Assistants with crisis communication?",
    answer: "Executive Assistants are often the first point of contact in a crisis and must communicate across multiple stakeholders under pressure. The scan reveals your self-reported patterns in areas like navigating authority (Dynamics lens), managing stress triggers (Ego lens), and advocating for solutions while handling emotions (Needs lens). Understanding these patterns can help you reflect on staying composed, communicating clearly to different audiences, and supporting your executive—though actual crisis performance depends on many factors beyond communication preferences."
  },
  {
    id: "workplace-wellbeing",
    question: "How does this connect with workplace wellbeing?",
    answer: "Communication patterns can contribute to workplace stress. The scan may help you reflect on patterns that create tension—perhaps suppressing needs to please others, getting triggered in meetings, or rarely experiencing flow in conversations. By making these patterns visible, you can explore setting better boundaries and having more authentic conversations. Note that workplace wellbeing involves many systemic factors beyond individual communication; the scan is one reflective tool, not a comprehensive wellbeing solution."
  },
  {
    id: "resilience",
    question: "How does the Satellite Scan help build resilience?",
    answer: "Resilience in communication means recovering from difficult conversations, adapting to conflict, and maintaining emotional balance under pressure. The Scan maps your patterns across lenses like Attitude (how you orient toward challenges), Flow (whether you're overwhelmed or disengaged), and Ego (how you handle criticism and defensiveness). By seeing your stress-response patterns clearly, you can build more resilient communication habits—bouncing back faster and staying grounded when conversations get tough."
  },
  {
    id: "social-intelligence",
    question: "How does this develop social intelligence?",
    answer: "Social intelligence—the ability to read situations, navigate relationships, and influence group dynamics—is exactly what the 8 lenses map. The Dynamics lens shows how you navigate power and role-shifting. The Needs lens reveals whether you recognise what others need (not just what they say). The Influence lens maps your persuasion style. Together, these dimensions give you a data-driven picture of your social intelligence strengths and blind spots, with actionable patterns you can work on."
  },
  {
    id: "ai-assisted-growth",
    question: "How does AI-assisted personal growth work here?",
    answer: "After completing the Scan, you receive your communication data as a structured dashboard. You can then use our AI prompt library to explore your patterns in depth—paste your results into ChatGPT, Claude, or any AI tool to get personalised insights, prepare for specific conversations, or develop targeted micro-habits. The AI amplifies the value of your human-coached baseline—it doesn't replace the coaching relationship. This is ethical AI-assisted personal growth: human insight first, AI as a thinking partner second."
  },
  {
    id: "ethical-hr-alternative",
    question: "How is this different from HRIS personality tests?",
    answer: "Traditional HR Information Systems (HRIS) often include personality assessments used for hiring, screening, or performance management—raising ethical concerns about labelling people and making employment decisions based on personality categories. The Satellite Scan is fundamentally different: it's designed exclusively for personal development and coaching, never for hiring or evaluation. It measures self-reported communication preferences (not fixed personality types), results belong entirely to the individual, and we explicitly prohibit organisational use for selection or performance decisions. It's an ethical alternative for leaders who want self-awareness tools without the ethical baggage of corporate personality classification."
  },
  {
    id: "leadership-development",
    question: "How does this support leadership development?",
    answer: "Leadership is fundamentally about communication—how you influence, align teams, navigate power dynamics, and manage your own ego under pressure. The Scan maps all of these dimensions through the 8 lenses. Leaders typically discover patterns they hadn't named: perhaps they're strong in Influence but weak in listening (Needs), or they default to control (Dynamics) when they could build more trust through vulnerability (Ego). The coaching programs then build on these insights with targeted leadership development exercises."
  },
  {
    id: "what-it-measures",
    question: "What does the Satellite Scan actually measure?",
    answer: "The scan measures your self-reported responses to 129 communication scenarios across 8 lenses. It captures how you say you would behave in various situations—your preferences and tendencies as you perceive them today. It does not measure abilities, predict performance, or assess personality traits in the way validated psychometric instruments do. Think of it as a structured self-reflection that surfaces patterns worth exploring, not as a diagnosis or objective measurement of who you are."
  }
];

const LENS_BENEFITS: Record<LensType, { benefit: string; insight: string }[]> = {
  influence: [
    { benefit: "Discover your natural persuasion style", insight: "See whether you lead through logic, emotion, or credibility—and learn when each approach serves you best." },
    { benefit: "Identify your blind spots in advocacy", insight: "Understand why some messages land while others fall flat, based on your unique influence patterns." },
    { benefit: "Build authentic authority", insight: "Learn to influence without manipulation by aligning your communication with your core values." }
  ],
  attitude: [
    { benefit: "Map your relationship with change", insight: "Discover whether you're a pioneer or a stabilizer—and how that shapes your conversations." },
    { benefit: "Unlock your growth mindset triggers", insight: "Identify the specific situations that activate your curiosity vs. your resistance." },
    { benefit: "Transform limiting beliefs", insight: "Recognize the internal narratives that hold you back and rewrite them consciously." }
  ],
  chaordic: [
    { benefit: "Find your structure-freedom sweet spot", insight: "Learn whether you thrive in chaos or order—and how to flex between both." },
    { benefit: "Navigate ambiguity with confidence", insight: "Develop the ability to hold multiple possibilities without needing premature closure." },
    { benefit: "Design better collaborative spaces", insight: "Create environments where creativity and focus can coexist productively." }
  ],
  flow: [
    { benefit: "Identify your optimal challenge level", insight: "Discover the exact balance of difficulty that puts you in flow state during conversations." },
    { benefit: "Remove your conversation blockers", insight: "Pinpoint what interrupts your flow and design strategies to maintain momentum." },
    { benefit: "Sustain high-quality engagement", insight: "Learn to recognize when you're fully present and how to return there when distracted." }
  ],
  alignment: [
    { benefit: "Deepen your empathy capacity", insight: "Understand your natural empathy style and expand your range of connection." },
    { benefit: "Build trust systematically", insight: "Discover the specific behaviors that create trust in your relationships." },
    { benefit: "Repair connections faster", insight: "Learn to recognize misalignment early and address it before it becomes a rupture." }
  ],
  needs: [
    { benefit: "Clarify your core motivations", insight: "Uncover the fundamental needs driving your decisions and communication patterns." },
    { benefit: "Express needs without demands", insight: "Learn to articulate what you want in ways that invite collaboration rather than resistance." },
    { benefit: "Recognize needs in others", insight: "Develop the ability to hear the needs beneath the words, even in conflict." }
  ],
  ego: [
    { benefit: "Map your trigger patterns", insight: "Identify the specific situations that activate your defensive responses." },
    { benefit: "Shift between roles consciously", insight: "Recognize the different 'hats' you wear and choose which one serves each moment." },
    { benefit: "Respond rather than react", insight: "Create space between stimulus and response to choose your communication consciously." }
  ],
  dynamics: [
    { benefit: "Understand relationship patterns", insight: "See the recurring dynamics in your professional and personal relationships." },
    { benefit: "Navigate power structures skillfully", insight: "Learn to work within hierarchies while maintaining your authentic voice." },
    { benefit: "Set healthy boundaries", insight: "Discover your boundary style and develop the skills to communicate limits clearly." }
  ]
};

interface PublicSettings {
  saasEnabled: boolean;
  oneTimeScanFeatures?: string[];
  subscriptionFeatures?: string[];
  coachingJourneyFeatures?: string[];
}

function usePublicSettings() {
  const { data } = useQuery<PublicSettings>({
    queryKey: ["/api/portal/settings/public"],
  });
  return data;
}

function useSaasEnabled() {
  const settings = usePublicSettings();
  return settings?.saasEnabled ?? false;
}

function HeroSection() {
  const saasEnabled = useSaasEnabled();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const earthY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="section-scan-hero">
      <motion.div 
        className="absolute inset-0 bg-cover bg-top"
        style={{ 
          backgroundImage: `url(${earthOrbitUrl})`,
          y: earthY
        }}
      >
        {/* Aurora color overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, 
              rgba(34, 197, 94, 0.15) 0%,
              rgba(139, 92, 246, 0.20) 25%,
              rgba(0, 153, 153, 0.25) 50%,
              transparent 75%
            )`
          }}
        />
      </motion.div>
      
      {/* Static bottom-fade — outside parallax so it never shifts with the image */}
      <div 
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-[1]"
        style={{
          height: "35%",
          background: "linear-gradient(to bottom, transparent 0%, #0a0a0a 100%)"
        }}
        aria-hidden="true"
      />
      
      <motion.div 
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24"
        style={{ y: textY, opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-6 bg-white/10 border-white/20 text-white backdrop-blur-sm">
            <Gift className="w-3 h-3 mr-1" />
            Trusted by 500+ Early Adopters
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-white drop-shadow-lg" data-testid="text-scan-hero-title">
            The Satellite Scan
          </h1>
          <p className="text-xl md:text-2xl text-white font-medium mb-8 max-w-4xl mx-auto leading-relaxed" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            You can't change what you can't see. In 90 minutes, the Satellite Scan maps your behavioral patterns across 8 dimensions — surfacing the tendencies, blind spots, and strengths that shape how you show up in every conversation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-bold text-white drop-shadow-lg" data-testid="text-beta-price">€99.95</span>
            </div>
          </div>

          <Link href="/checkout?product=satellitescan">
            <Button 
              size="lg" 
              className="bg-needs hover:bg-needs/90 text-white min-w-[280px]"
              data-testid="button-get-scan-hero"
            >
              Get Your Scan - €99.95
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          {saasEnabled && (
            <Link href="/checkout?product=subscription">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white backdrop-blur-sm min-w-[280px] mt-3 gap-2"
                data-testid="button-subscribe-hero"
              >
                <Repeat className="h-4 w-4" />
                Or Subscribe — €9.95/month
              </Button>
            </Link>
          )}
          <p className="text-xs text-white/50 mt-4 max-w-md mx-auto">
            For personal development and coaching only. Not for hiring, selection, or performance evaluation.
          </p>
        </motion.div>
        
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-white/60 mt-16"
        >
          <p className="text-sm mb-2">Scroll to explore</p>
          <ArrowDown className="h-6 w-6 mx-auto" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function TestimonialMarquee() {
  return (
    <section className="relative py-12 overflow-hidden" data-testid="section-scan-testimonial-marquee">
      <style>{`
        @keyframes scan-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .scan-marquee-track {
          display: flex;
          width: max-content;
          animation: scan-marquee 90s linear infinite;
        }
        .scan-marquee-track:hover,
        .scan-marquee-track:focus-within {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .scan-marquee-track {
            animation: none;
            flex-wrap: wrap;
            width: auto;
            justify-content: center;
          }
        }
      `}</style>
      <div className="scan-marquee-track">
        {[...MARQUEE_TESTIMONIALS, ...MARQUEE_TESTIMONIALS].map((t, i) => {
          const lens = LENSES[t.lens];
          return (
            <div
              key={i}
              className="flex-shrink-0 w-80 mx-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6"
              data-testid={`marquee-testimonial-${i}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Quote className="w-4 h-4 text-white/30" />
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: lens.hexColor }}
                />
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-5">
                "{t.quote}"
              </p>
              <div>
                <p className="text-white font-semibold text-sm">{t.name}</p>
                <p className="text-white/50 text-xs mt-0.5">
                  {t.role}{t.country ? ` · ${t.country}` : ""}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function BenefitsSection() {
  const [expandedPersona, setExpandedPersona] = useState<string | null>(null);

  return (
    <section 
      id="benefits" 
      className="relative py-24 md:py-32"
      data-testid="section-benefits"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge className="mb-6 bg-needs/20 text-needs border-needs/30">Who Benefits</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white" data-testid="text-benefits-title">
            Perfect for Conscious Professionals
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Click any role to see which communication lenses matter most for you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PERSONAS.map((persona, i) => (
            <motion.div
              key={persona.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 ${expandedPersona === persona.id ? 'ring-2 ring-needs' : ''}`}
                onClick={() => setExpandedPersona(expandedPersona === persona.id ? null : persona.id)}
                data-testid={`card-persona-${persona.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-needs flex-shrink-0" />
                      <h3 className="font-semibold text-lg text-white">{persona.title}</h3>
                    </div>
                    <Switch 
                      checked={expandedPersona === persona.id}
                      onCheckedChange={() => setExpandedPersona(expandedPersona === persona.id ? null : persona.id)}
                      className="data-[state=checked]:!bg-needs data-[state=unchecked]:!bg-white/20"
                      data-testid={`switch-persona-${persona.id}`}
                    />
                  </div>
                  
                  {expandedPersona === persona.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-4 border-t border-white/10"
                    >
                      <p className="text-sm text-white/70 mb-4">{persona.description}</p>
                      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Key Lenses</p>
                      <div className="flex flex-wrap gap-2">
                        {persona.lenses.map(lens => (
                          <Badge 
                            key={lens} 
                            className={`${LENSES[lens].color} text-white`}
                          >
                            {LENSES[lens].name}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SignalsSection() {
  return (
    <section 
      id="signals" 
      className="relative py-24 md:py-32"
      data-testid="section-signals"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white" data-testid="text-signals-title">
            Recognize These Patterns?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Most communication problems come from lack of altitude. When you're too close, you can't see the patterns.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PAIN_SIGNALS.map((signal, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card className="h-full bg-needs/5 backdrop-blur-sm border-needs/20 hover:bg-needs/10 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <span className="text-needs mt-1 text-lg">✕</span>
                    <div>
                      <p className="text-white/90">{signal.signal}</p>
                      <Badge className={`mt-2 ${LENSES[signal.lens].color} text-white text-xs`}>
                        {LENSES[signal.lens].name}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-white/70 mb-4">The Satellite Scan gives you the altitude to see—and change—these patterns.</p>
          <Button 
            variant="outline" 
            className="border-needs/50 text-needs hover:bg-needs/10"
            onClick={() => document.getElementById('what-is-it')?.scrollIntoView({ behavior: 'smooth' })}
            data-testid="button-learn-more-signals"
          >
            See How It Works
            <ArrowDown className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function WhatIsItSection() {
  const publicSettings = usePublicSettings();
  const saasEnabled = publicSettings?.saasEnabled ?? false;
  const dynamicScanFeatures = publicSettings?.oneTimeScanFeatures;
  const steps = [
    {
      number: 1,
      title: "Take the Scan",
      description: "90 minutes. 129 questions across 8 lenses. Answer honestly—there are no wrong answers.",
      icon: Smartphone,
      details: "Complete via Typeform on any device"
    },
    {
      number: 2,
      title: "Receive Your Data",
      description: "Raw data arrives in 20-30 minutes. Your personalized dashboard is reviewed by a coach within 48-72 hours.",
      icon: BarChart3,
      details: "Queryable, actionable, yours forever"
    },
    {
      number: 3,
      title: "Unlock Value",
      description: "Access the Prompt Library, coaching videos, and downloadable resources to apply your insights immediately.",
      icon: MessageSquare,
      details: "Self-paced learning journey"
    }
  ];

  return (
    <section 
      id="what-is-it" 
      className="relative py-24 md:py-32"
      data-testid="section-what-is-it"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white" data-testid="text-what-title">
            A Mirror, Not a Test
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            The Satellite Scan doesn't measure your intelligence or judge your choices. It reveals the behavioral patterns you already have — so you can choose what to do with them. Self-awareness is the foundation. Everything else follows.
          </p>
        </motion.div>

        {/* Original 2-column section */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-needs/30 via-ego/20 to-dynamics/30 animate-pulse" />
              <img src={logoUrl} alt="Satellite Scan" className="relative z-10 w-full h-full object-contain" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-4" data-testid="scan-features-list">
              {dynamicScanFeatures && dynamicScanFeatures.length > 0 ? (
                dynamicScanFeatures.map((feature, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-flow flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-white/80">{feature}</p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex items-start gap-3">
                      <Timer className="w-5 h-5 text-ego flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-white">90-Minute Deep Dive</p>
                        <p className="text-sm text-white/70">Thoughtfully designed questionnaire covering 129 real-life communication scenarios to reveal your unique patterns</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex items-start gap-3">
                      <Brain className="w-5 h-5 text-needs flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-white">Human-Crafted Dashboard</p>
                        <p className="text-sm text-white/70">Our coaches personally review your answers and create a custom visual map showing your strengths and growth areas</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-flow flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-white">Growing Prompt Library</p>
                        <p className="text-sm text-white/70">Unlock multiple times the value from your raw data by prompting your results in our custom GPT, the Conscious Communicator</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col items-center gap-4 pt-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-white">€99.95</span>
              </div>
              <p className="text-sm text-white/50 italic">Early adopter pricing</p>
              <Link href="/checkout?product=satellitescan">
                <Button className="bg-needs text-white hover:bg-needs/90" data-testid="button-get-scan-what">
                  Get Your Scan - €99.95
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {saasEnabled && (
                <Link href="/checkout?product=subscription">
                  <Button variant="outline" className="border-white/30 text-white backdrop-blur-sm gap-2" data-testid="button-subscribe-what">
                    <Repeat className="h-3.5 w-3.5" />
                    Subscribe — €9.95/month
                  </Button>
                </Link>
              )}
              <p className="text-xs text-white/65 max-w-xs text-center">
                For personal development only
              </p>
            </div>
          </motion.div>
        </div>

        {/* Your Three-Step Journey Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <Badge className="mb-6 bg-white/10 text-white border-white/20">Your Journey</Badge>
          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white" data-testid="text-journey-title">
            Your Three-Step Journey
          </h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From scan to insight in less than two hours. Transformation unfolds from there.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
                data-testid={`card-journey-step-${step.number}`}
              >
                <motion.div 
                  className="relative mb-8"
                  whileHover={{ y: -8, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-20 h-20 mx-auto flex items-center justify-center">
                    <Icon className="w-16 h-16 text-white/80" strokeWidth={1} />
                  </div>
                </motion.div>
                <div className="text-sm text-muted-foreground mb-2">Step {step.number}</div>
                <h4 className="text-2xl font-bold mb-4 text-white">{step.title}</h4>
                <p className="text-muted-foreground mb-4">{step.description}</p>
                <p className="text-sm text-needs">{step.details}</p>
              </motion.div>
            );
          })}
        </div>

        {/* What's Included Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-center mb-12 text-white">What's Included</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* AI Prompts Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="flex flex-col items-center text-center"
              whileHover={{ y: -5 }}
              data-testid="card-included-prompts"
            >
              <motion.div 
                className="w-16 h-16 mb-4 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Bot className="w-12 h-12 text-white/80" strokeWidth={1} />
              </motion.div>
              <h4 className="font-semibold mb-1 text-white">10+ AI Prompts</h4>
              <p className="text-sm text-muted-foreground mb-4">Query your data with the Conscious Communicator GPT</p>
              
              <div className="w-full max-w-[200px] space-y-2">
                {[
                  { lens: "Needs", color: "#e74c3c" },
                  { lens: "Alignment", color: "#3498db" },
                  { lens: "Quick Wins", color: "#2ecc71" }
                ].map((p) => (
                  <div 
                    key={p.lens}
                    className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10 flex items-center gap-2"
                  >
                    <div 
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-xs text-white/70 truncate">{p.lens} Prompt</span>
                    <Sparkles className="w-3 h-3 text-white/40 ml-auto shrink-0" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Video Coaching Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col items-center text-center"
              whileHover={{ y: -5 }}
              data-testid="card-included-videos"
            >
              <motion.div 
                className="w-16 h-16 mb-4 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Video className="w-12 h-12 text-white/80" strokeWidth={1} />
              </motion.div>
              <h4 className="font-semibold mb-1 text-white">Video Coaching</h4>
              <p className="text-sm text-muted-foreground mb-4">YouTube playlist organized by your 4-digit lens codes</p>
              
              <div className="w-full max-w-[200px] grid grid-cols-2 gap-2">
                {[
                  { lens: "1100", color: "#9b59b6" },
                  { lens: "2200", color: "#f39c12" },
                  { lens: "3300", color: "#1abc9c" },
                  { lens: "4400", color: "#e91e63" }
                ].map((v) => (
                  <div 
                    key={v.lens}
                    className="aspect-video bg-white/5 backdrop-blur-sm rounded border border-white/10 flex items-center justify-center relative overflow-hidden"
                  >
                    <div 
                      className="absolute inset-0 opacity-20"
                      style={{ background: `linear-gradient(135deg, ${v.color}40, transparent)` }}
                    />
                    <Play className="w-4 h-4 text-white/50" />
                    <span className="absolute bottom-1 right-1 text-xs text-white/65">{v.lens}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Resources Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center text-center"
              whileHover={{ y: -5 }}
              data-testid="card-included-resources"
            >
              <motion.div 
                className="w-16 h-16 mb-4 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <FileText className="w-12 h-12 text-white/80" strokeWidth={1} />
              </motion.div>
              <h4 className="font-semibold mb-1 text-white">Resources</h4>
              <p className="text-sm text-muted-foreground mb-4">High-res visuals, worksheets, micro-habit templates</p>
              
              <div className="w-full max-w-[200px] space-y-2">
                {[
                  { title: "Periodic Table", icon: Table },
                  { title: "Micro-habits", icon: Sparkles },
                  { title: "Worksheet", icon: FileText }
                ].map((r) => {
                  const RIcon = r.icon;
                  return (
                    <div 
                      key={r.title}
                      className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10 flex items-center gap-2"
                    >
                      <RIcon className="w-4 h-4 text-white/60 shrink-0" />
                      <span className="text-xs text-white/70 truncate">{r.title}</span>
                      <Download className="w-3 h-3 text-white/40 ml-auto shrink-0" />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const SCAN_TESTIMONIALS = [
  {
    quote: "Managing calendars for three executives means navigating conflicting priorities daily. The Satellite Scan helped me see my communication patterns and now I handle those tough 'no' conversations with confidence.",
    name: "Sophie M.",
    role: "Executive Assistant to C-Suite",
    country: "Germany",
    lens: "alignment" as LensType,
  },
  {
    quote: "I always thought I was just 'bad at confrontation.' The Scan showed me I actually have strong Alignment skills — I just needed the language to own them. My annual review went completely differently this year.",
    name: "Katariina L.",
    role: "Executive Assistant, Tech Company",
    country: "Finland",
    lens: "influence" as LensType,
  },
  {
    quote: "Working remotely for three clients across time zones, I was drowning in miscommunication. The 8 lenses gave me a framework to name what was going wrong — and fix it without burning bridges.",
    name: "Priya S.",
    role: "Virtual Assistant",
    country: "India",
    lens: "dynamics" as LensType,
  },
  {
    quote: "We've been transitioning to a self-managing structure for two years. The framework finally gave our team a common language for the difficult conversations that transformation requires.",
    name: "Elena R.",
    role: "People Lead, TEAL Organization",
    country: "Netherlands",
    lens: "needs" as LensType,
  },
  {
    quote: "I recommended the Scan to my whole team. It's not a test — it's a mirror. And sometimes you need a good mirror before you can see your superpowers clearly.",
    name: "Mikko H.",
    role: "Operations Manager",
    country: "Finland",
    lens: "ego" as LensType,
  },
];

const MARQUEE_TESTIMONIALS = [
  ...SCAN_TESTIMONIALS,
  {
    quote: "The 8 lenses framework gave me language for patterns I'd been feeling but couldn't articulate. Now I prepare differently for every difficult conversation.",
    name: "Daniela F.",
    role: "Innovation Manager",
    country: "Switzerland",
    lens: "chaordic" as LensType,
  },
  {
    quote: "After 15 years in leadership, I thought I knew my communication style. The Scan showed me three blind spots I'd been working around instead of through.",
    name: "James W.",
    role: "VP of Operations",
    country: "UK",
    lens: "flow" as LensType,
  },
  {
    quote: "I used the Scan results with the AI prompt library to prepare for a board presentation. It completely changed how I structured my argument.",
    name: "Aisha K.",
    role: "Startup Founder",
    country: "UAE",
    lens: "influence" as LensType,
  },
];

const TRUST_SIGNALS = [
  { icon: BookOpen, label: "27 years of practice" },
  { icon: Award, label: "Based on peer-reviewed research" },
  { icon: Shield, label: "GDPR compliant" },
];

function SocialProofSection() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoPlay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SCAN_TESTIMONIALS.length);
    }, 10000);
  };

  useEffect(() => {
    startAutoPlay();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const goTo = (index: number) => {
    setCurrent(index);
    startAutoPlay();
  };

  const prev = () => goTo((current - 1 + SCAN_TESTIMONIALS.length) % SCAN_TESTIMONIALS.length);
  const next = () => goTo((current + 1) % SCAN_TESTIMONIALS.length);

  const testimonial = SCAN_TESTIMONIALS[current];
  const lens = LENSES[testimonial.lens];

  return (
    <section
      className="relative py-24 md:py-32"
      data-testid="section-social-proof"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge className="mb-6 bg-needs/20 text-needs border-needs/30">
            <Users className="w-3 h-3 mr-1" />
            Trusted by Professionals
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white" data-testid="text-social-proof-title">
            What Professionals Are Saying
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Professionals across industries trust the Satellite Scan to transform their communication.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          <Card className="bg-white/5 border-white/10 text-center">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-3xl font-bold text-white mb-1" data-testid="text-nps-score">9.2/10</p>
              <p className="text-sm text-white/60">Average satisfaction score</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-center">
            <CardContent className="p-8">
              <p className="text-3xl font-bold text-white mb-1" data-testid="text-client-count">200+</p>
              <p className="text-sm text-white/60">Professionals scanned</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-center">
            <CardContent className="p-8">
              <p className="text-3xl font-bold text-white mb-1" data-testid="text-elements-count">129</p>
              <p className="text-sm text-white/60">Communication elements mapped</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
          data-testid="scan-testimonial-carousel"
        >
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              className="text-white/60 flex-shrink-0"
              onClick={prev}
              data-testid="button-scan-testimonial-prev"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <div className="flex-1 min-h-[180px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                  className="w-full"
                >
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-8">
                      <div
                        className="w-3 h-3 rounded-full mb-4"
                        style={{ backgroundColor: lens.hexColor }}
                      />
                      <blockquote className="text-lg md:text-xl text-white/90 leading-relaxed italic mb-6" data-testid={`text-scan-testimonial-${current}`}>
                        "
                        {testimonial.quote.split(". ").map((sentence, i, arr) => (
                          <span key={i}>
                            {sentence}{i < arr.length - 1 ? "." : ""}
                            {i < arr.length - 1 && <><br /><br /></>}
                          </span>
                        ))}
                        "
                      </blockquote>
                      <div className="border-t border-white/10 pt-4">
                        <p className="font-semibold text-white">{testimonial.name}</p>
                        <p className="text-white/50 text-sm">{testimonial.role}, {testimonial.country}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="text-white/60 flex-shrink-0"
              onClick={next}
              data-testid="button-scan-testimonial-next"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            {SCAN_TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === current ? "bg-white" : "bg-white/30"
                }`}
                data-testid={`button-scan-testimonial-dot-${index}`}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-8"
        >
          {TRUST_SIGNALS.map((signal) => {
            const SignalIcon = signal.icon;
            return (
              <div key={signal.label} className="flex items-center gap-3" data-testid={`trust-signal-${signal.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="w-10 h-10 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
                  <SignalIcon className="w-5 h-5 text-needs" />
                </div>
                <span className="text-sm text-white/70 font-medium">{signal.label}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function LensesSection() {
  const [openLens, setOpenLens] = useState<LensType | null>(null);
  const [viewMode, setViewMode] = useState<"circular" | "stacked">("circular");
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  // Lock to stacked view on small phones where circular view bunches up
  // Restore circular view when screen gets larger
  useEffect(() => {
    const checkScreenSize = () => {
      const isSmall = window.innerWidth < 480;
      setIsSmallScreen(isSmall);
      // Force stacked on small screens, restore circular on larger screens
      setViewMode(isSmall ? "stacked" : "circular");
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  const getCirclePosition = (index: number, total: number, radius: number) => {
    const angle = (index * 360 / total) - 90;
    const radian = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius,
    };
  };

  return (
    <section 
      id="lenses" 
      className="relative py-24 md:py-32"
      data-testid="section-lenses"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-12"
        >
          <Badge className="mb-6 bg-needs/20 text-needs border-needs/30">The Framework</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white" data-testid="text-lenses-title">
            8 Lenses. 129 Elements.<br />
            One Complete Picture.
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-6">
            Built on 27 years of coaching practice. Click any lens to discover patterns worth exploring.
          </p>
          
          {/* View toggle - hidden on small phones where circular view doesn't work well */}
          {!isSmallScreen && (
            <div className="flex items-center justify-center gap-3">
              <Label htmlFor="view-toggle" className="text-white/70 text-sm">Circular</Label>
              <Switch
                id="view-toggle"
                checked={viewMode === "stacked"}
                onCheckedChange={(checked) => setViewMode(checked ? "stacked" : "circular")}
                className="data-[state=checked]:bg-white/30 data-[state=unchecked]:bg-white/20"
                data-testid="switch-view-mode"
              />
              <Label htmlFor="view-toggle" className="text-white/70 text-sm">Stacked</Label>
            </div>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {viewMode === "circular" ? (
            <motion.div
              key="circular"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* Circular lens wheel */}
              <div className="relative flex items-center justify-center" style={{ zIndex: 1 }}>
                {/* Circle container */}
                <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px]">
                  {/* Decorative ring */}
                  <div className="absolute inset-4 sm:inset-6 md:inset-8 rounded-full border border-white/10" />
                  <div className="absolute inset-8 sm:inset-12 md:inset-16 rounded-full border border-white/5" />
                  
                  {/* Center content - Logo */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <img 
                        src={logoUrl} 
                        alt="GreenElephant logo" 
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto opacity-80"
                      />
                    </div>
                  </div>
                  
                  {/* Lens items positioned in a circle */}
                  {LENS_ORDER.map((lensKey, index) => {
                    const lens = LENSES[lensKey];
                    const Icon = lens.icon;
                    const isOpen = openLens === lensKey;
                    const details = LENS_DETAILS[lensKey];
                    
                    const mobileRadius = 120;
                    const smRadius = 150;
                    const mdRadius = 190;
                    
                    const mobilePos = getCirclePosition(index, 8, mobileRadius);
                    const smPos = getCirclePosition(index, 8, smRadius);
                    const mdPos = getCirclePosition(index, 8, mdRadius);
                    
                    return (
                      <motion.div
                        key={lens.value}
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.08 }}
                        className="absolute left-1/2 top-1/2"
                        style={{
                          transform: `translate(calc(-50% + ${mobilePos.x}px), calc(-50% + ${mobilePos.y}px))`,
                          zIndex: isOpen ? 100 : 10,
                        }}
                        data-testid={`lens-station-${lens.value}`}
                      >
                        <style>
                          {`
                            @media (min-width: 640px) {
                              [data-testid="lens-station-${lens.value}"] {
                                transform: translate(calc(-50% + ${smPos.x}px), calc(-50% + ${smPos.y}px)) !important;
                              }
                            }
                            @media (min-width: 768px) {
                              [data-testid="lens-station-${lens.value}"] {
                                transform: translate(calc(-50% + ${mdPos.x}px), calc(-50% + ${mdPos.y}px)) !important;
                              }
                            }
                          `}
                        </style>
                        
                        <Collapsible open={isOpen} onOpenChange={(open) => setOpenLens(open ? lensKey : null)}>
                          <CollapsibleTrigger asChild>
                            <button 
                              className="group flex flex-col items-center focus:outline-none"
                              data-testid={`button-lens-${lens.value}`}
                            >
                              <div className={`${lens.color} w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg ${isOpen ? 'ring-2 ring-white/40 scale-110' : ''}`}>
                                <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
                              </div>
                              <span className="text-xs sm:text-xs md:text-sm font-medium text-foreground mt-1 whitespace-nowrap">{lens.name}</span>
                              <span className="text-xs sm:text-xs md:text-xs text-muted-foreground">{lens.code}</span>
                            </button>
                          </CollapsibleTrigger>
                          
                          <AnimatePresence>
                            {isOpen && (
                              <CollapsibleContent forceMount>
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute left-1/2 -translate-x-1/2 mt-2 p-3 sm:p-4 rounded-xl bg-background/95 border border-white/20 backdrop-blur-md w-[200px] sm:w-[240px] md:w-[280px] text-left shadow-xl"
                                  style={{ zIndex: 200 }}
                                >
                                  <p className="text-xs sm:text-sm text-white/90 mb-3 italic leading-relaxed">{lens.description}</p>
                                  <div className="mb-2">
                                    <p className="text-xs sm:text-xs text-destructive font-semibold mb-1 uppercase tracking-wider">Pain Signal</p>
                                    <p className="text-xs sm:text-xs text-muted-foreground leading-relaxed">{details.painSignal}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs sm:text-xs text-needs font-semibold mb-1 uppercase tracking-wider">Benefit</p>
                                    <p className="text-xs sm:text-xs text-muted-foreground leading-relaxed">{details.benefit}</p>
                                  </div>
                                </motion.div>
                              </CollapsibleContent>
                            )}
                          </AnimatePresence>
                        </Collapsible>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="stacked"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              {/* Stacked lens list with accordions */}
              <div className="space-y-3">
                {LENS_ORDER.map((lensKey, index) => {
                  const lens = LENSES[lensKey];
                  const Icon = lens.icon;
                  const isOpen = openLens === lensKey;
                  const details = LENS_DETAILS[lensKey];
                  
                  return (
                    <motion.div
                      key={lens.value}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Collapsible 
                        open={isOpen} 
                        onOpenChange={(open) => setOpenLens(open ? lensKey : null)}
                      >
                        <CollapsibleTrigger asChild>
                          <button 
                            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 border ${
                              isOpen 
                                ? 'bg-white/10 border-white/20' 
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                            data-testid={`button-lens-stacked-${lens.value}`}
                          >
                            <div 
                              className={`${lens.color} w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0`}
                            >
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">{lens.name}</span>
                                <Badge variant="outline" className="text-xs border-white/20 text-white/60">
                                  {lens.code}
                                </Badge>
                              </div>
                              <p className="text-sm text-white/60 mt-0.5 line-clamp-1">{lens.description}</p>
                            </div>
                            <ArrowDown className={`h-5 w-5 text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                          </button>
                        </CollapsibleTrigger>
                        
                        <AnimatePresence>
                          {isOpen && (
                            <CollapsibleContent forceMount>
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 pb-4 pt-2 ml-16 border-l-2 border-white/10">
                                  <div className="grid gap-3">
                                    {LENS_BENEFITS[lensKey].map((item, idx) => (
                                      <div 
                                        key={idx}
                                        className="rounded-lg p-3 border"
                                        style={{ 
                                          backgroundColor: `${lens.hexColor}15`,
                                          borderColor: `${lens.hexColor}30`
                                        }}
                                      >
                                        <p 
                                          className="text-xs font-semibold mb-1 uppercase tracking-wider flex items-center gap-2"
                                          style={{ color: lens.hexColor }}
                                        >
                                          <CheckCircle2 className="w-3 h-3" />
                                          {item.benefit}
                                        </p>
                                        <p className="text-sm text-white/70">{item.insight}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            </CollapsibleContent>
                          )}
                        </AnimatePresence>
                      </Collapsible>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-8 md:mt-12"
        >
          <Link href="/periodic-table">
            <Button variant="outline" className="border-needs/50 text-needs hover:bg-needs/10" data-testid="button-explore-table">
              Explore the Periodic Table
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section 
      id="faq" 
      className="relative py-24 md:py-32"
      data-testid="section-faq"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Badge className="mb-6 bg-needs/20 text-needs border-needs/30">
            <HelpCircle className="w-3 h-3 mr-1" />
            Common Questions
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white" data-testid="text-faq-title">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Everything you need to know about your Satellite Scan journey.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem 
                key={item.id} 
                value={item.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-6 data-[state=open]:ring-2 data-[state=open]:ring-needs/30"
                data-testid={`faq-item-${item.id}`}
              >
                <AccordionTrigger className="text-white hover:no-underline py-5">
                  <span className="text-left font-semibold">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-white/70 leading-relaxed pb-5">
                  {item.answer}
                  {(item as any).hasLink && (
                    <Link href={(item as any).linkUrl}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4 border-needs/50 text-needs hover:bg-needs/10"
                        data-testid={`button-faq-link-${item.id}`}
                      >
                        <Table className="w-4 h-4 mr-2" />
                        {(item as any).linkText}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-white/60 mb-4">Still have questions?</p>
          <Link href="/connect">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" data-testid="button-contact-faq">
              Get in Touch
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const saasEnabled = useSaasEnabled();
  return (
    <section 
      id="how-it-works" 
      className="relative py-24 md:py-40"
      data-testid="section-how-it-works"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <Badge className="mb-6 bg-alignment/20 text-alignment border-alignment/30">The Process</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white" data-testid="text-how-title">
            Your Journey to Clarity
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            From scan to transformation in four steps.
          </p>
        </motion.div>

        <div className="relative">
          <div className="space-y-12 pl-16 md:pl-24">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="relative"
                  data-testid={`step-${step.id}`}
                >
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-5">
                        <div className="w-14 h-14 rounded-xl bg-needs/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-7 h-7 text-needs" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-white mb-3">{step.title}</h3>
                          <p className="text-white/70 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-20"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-white">€99.95</span>
            </div>
            <Link href="/checkout?product=satellitescan">
              <Button size="lg" className="bg-needs hover:bg-needs/90 text-white px-8" data-testid="button-get-scan-bottom">
                Get Your Scan - €99.95
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {saasEnabled && (
              <Link href="/checkout?product=subscription">
                <Button size="lg" variant="outline" className="border-white/30 text-white backdrop-blur-sm gap-2" data-testid="button-subscribe-bottom">
                  <Repeat className="h-4 w-4" />
                  Or Subscribe — €9.95/month
                </Button>
              </Link>
            )}
            <p className="text-sm text-white/50">48-72 hour dashboard delivery</p>
            <p className="text-xs text-white/65">For personal development and coaching only. Not for hiring or selection.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function RepeatableMeasurementSection() {
  return (
    <section className="relative py-20 md:py-24" data-testid="section-repeatable-measurement">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <Badge className="mb-6 bg-white/10 text-white/80 border-white/20">
            Not a personality test
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Not a personality test.<br />A repeatable measurement.
          </h2>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            Your communication patterns change. Your scan should keep up.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              label: "Use it before a difficult conversation or presentation",
              icon: "01",
              timing: "Before",
            },
            {
              label: "Use it after a promotion, a job change, or a conflict",
              icon: "02",
              timing: "After",
            },
            {
              label: "Re-scan every 6–12 months to measure your growth",
              icon: "03",
              timing: "Ongoing",
            },
          ].map((item, i) => (
            <motion.div
              key={item.icon}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <Card className="bg-white/5 border-white/10 h-full text-center" data-testid={`card-measurement-${item.icon}`}>
                <CardContent className="p-7 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-needs/20 border border-needs/30 flex items-center justify-center mb-4">
                    <span className="text-needs font-bold text-sm">{item.timing}</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{item.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center"
        >
          <div className="flex items-center gap-0">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-needs" />
                {i < 2 && <div className="w-16 md:w-24 h-0.5 bg-needs/30" />}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LeadMagnetSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !consent) {
      toast({
        title: "Please fill in all required fields",
        description: "Email and consent are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/scan-interest", {
        email,
        name: name || undefined,
        consentText: "I agree to receive communication insights and occasional updates from GreenElephant. I can unsubscribe at any time.",
      });
      setIsSubmitted(true);
      toast({
        title: "Check your inbox!",
        description: "We've sent you communication insights and a link to the Flow Check.",
      });
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="relative py-24 md:py-32"
      data-testid="section-lead-magnet"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <Badge className="mb-6 bg-flow/20 text-flow border-flow/30">
            <Zap className="w-3 h-3 mr-1" />
            Free Assessment
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white" data-testid="text-lead-magnet-title">
            Check Your Communication Flow — Free
          </h2>
          <p className="text-lg text-white/70 max-w-xl mx-auto">
            Measure your motivation, perceived challenge, and perceived competence in a specific communication situation. Discover which zone you're in — Flow, Challenge, Comfort, or Danger — based on Csikszentmihalyi's flow model.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { title: "Pick Your Situation", desc: "Choose a communication context that matters to you" },
                  { title: "Rate 3 Dimensions", desc: "Motivation, perceived challenge, and perceived competence" },
                  { title: "Get Your Zone", desc: "See where you land on the Flow model with personalized insights" },
                ].map((step, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="w-7 h-7 rounded-full bg-flow/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-flow text-xs font-bold">{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{step.title}</p>
                      <p className="text-xs text-white/60">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-4">
                <Link href="/flow-check">
                  <Button className="bg-flow text-white" data-testid="button-take-flow-check">
                    <Zap className="mr-2 h-4 w-4" />
                    Take the Free Flow Check
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-sm text-white/50">
                  Takes about 2 minutes. No email required.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                {isSubmitted ? (
                  <div className="text-center py-4" data-testid="text-lead-magnet-success">
                    <div className="w-12 h-12 rounded-full bg-needs/20 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-6 h-6 text-needs" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">Check Your Inbox</h3>
                    <p className="text-sm text-white/70">
                      We've sent you communication insights and a direct link to the Flow Check.
                    </p>
                  </div>
                ) : showEmailForm ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-sm text-white/60 text-center mb-2">
                      Get communication insights and updates delivered to your inbox.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        type="text"
                        placeholder="Your name (optional)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        data-testid="input-lead-name"
                      />
                      <Input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        data-testid="input-lead-email"
                      />
                    </div>

                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="lead-consent"
                        checked={consent}
                        onCheckedChange={(checked) => setConsent(checked === true)}
                        className="mt-1 border-white/30 data-[state=checked]:bg-needs data-[state=checked]:border-needs"
                        data-testid="checkbox-lead-consent"
                      />
                      <label htmlFor="lead-consent" className="text-xs text-white/60 leading-relaxed cursor-pointer">
                        I agree to receive communication insights and occasional updates from GreenElephant. I can unsubscribe at any time. See our{" "}
                        <Link href="/privacy" className="text-needs underline">Privacy Policy</Link>.
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <Button
                        type="submit"
                        disabled={isSubmitting || !consent || !email}
                        className="bg-needs text-white w-full sm:w-auto"
                        data-testid="button-get-updates"
                      >
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <>
                            <Mail className="mr-2 h-4 w-4" />
                            Get Updates
                          </>
                        )}
                      </Button>
                      <span className="flex items-center gap-1 text-xs text-white/65">
                        <Lock className="w-3 h-3" />
                        GDPR compliant. No spam.
                      </span>
                    </div>
                  </form>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-white/50">
                      Prefer to get updates by email?{" "}
                      <button
                        onClick={() => setShowEmailForm(true)}
                        className="text-needs underline cursor-pointer bg-transparent border-none"
                        data-testid="button-show-email-form"
                      >
                        Sign up for communication insights
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

export default function ScanPage() {
  const [location] = useLocation();
  
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen" data-testid="page-scan">
      <SEO 
        title="Satellite Scan | Self-Awareness & Resilience Assessment for Leaders & EAs"
        description="90-minute self-assessment mapping your communication, resilience, and social intelligence across 8 lenses. AI-assisted personal growth tool for EAs, leaders, and career changers. Ethical alternative to HRIS personality tests. €99.95 with personalized insights in 48-72 hours."
        keywords="self-awareness assessment, communication self-assessment, emotional intelligence test, personal development diagnostic, career change assessment, future-proof career skills, executive assistant communication assessment, CEO communication diagnostic, leadership communication tool, executive coaching assessment, communication patterns analysis, EA training, managing up communication, self-reflection tool, EQ assessment, behavioral assessment, resilience assessment, social intelligence tool, personal growth assessment, ethical personal development, AI personal growth, AI-assisted communication, ethical HR tool alternative, HRIS alternative self-awareness, leadership development assessment, self-assessment tool"
        canonicalPath="/scan"
        structuredData={PRODUCT_STRUCTURED_DATA.satelliteScan}
        faqItems={FAQ_ITEMS.map(item => ({ question: item.question, answer: item.answer }))}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Satellite Scan", url: "/scan" }
        ]}
      />
      {/* Page content */}
      <div style={{ background: "#0a0a0a" }}>
        <HeroSection />
        <TestimonialMarquee />
        
        {/* Content sections with vertical teal train track line */}
        <div className="relative">
          {/* Ghost track + traveling light beacon — hidden on small screens, gutter-safe at md+ */}
          <div
            className="hidden md:block absolute left-20 lg:left-24 top-0 w-[2px] bg-needs/[0.08] z-10 overflow-hidden"
            style={{ bottom: 'calc(20vh + 60px)' }}
            aria-hidden="true"
          >
            {/* Animated pulse that travels downward — scroll direction signal */}
            <div className="absolute inset-x-0 top-0 h-[90px] bg-gradient-to-b from-transparent via-needs/70 to-transparent animate-beacon" />
          </div>
          {/* Hollow terminus ring */}
          <div
            className="hidden md:block absolute left-20 lg:left-24 w-5 h-5 rounded-full bg-transparent border-2 border-needs/40 z-20 -translate-x-1/2"
            style={{ bottom: 'calc(20vh + 50px)' }}
            aria-hidden="true"
          />
          
          <BenefitsSection />
          <SignalsSection />
          <WhatIsItSection />
          <SocialProofSection />
          <RepeatableMeasurementSection />
          <LensesSection />
          <FAQSection />
          <LeadMagnetSection />
          <HowItWorksSection />
        </div>
      </div>
      
    </div>
  );
}
