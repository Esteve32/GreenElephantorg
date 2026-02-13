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
import { ArrowRight, CheckCircle2, Sparkles, Brain, Timer, Users, Gift, AlertTriangle, Target, Zap, ArrowDown, HelpCircle, Smartphone, BarChart3, MessageSquare, Bot, Video, FileText, Play, Download, Table } from "lucide-react";
import logoUrl from "@assets/GE logo 512x512 transparent BG 2023 _1762732324529.png";
import earthOrbitUrl from "@assets/generated_images/earth_orbit_aurora_view.png";
import archipelagoUrl from "@assets/finnish_archipelago_landscape_aerial_view_1764797904449.png";
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

function HeroSection() {
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
      
      {/* Bottom fade overlay - bridges hero to content section smoothly */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[40vh] pointer-events-none z-[1]"
        style={{
          background: `linear-gradient(to top,
            #0a1628 0%,
            #0a1628 20%,
            rgba(10, 22, 40, 0.85) 40%,
            rgba(10, 22, 40, 0.5) 60%,
            rgba(10, 22, 40, 0.2) 80%,
            transparent 100%
          )`
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
            Map your communication patterns in 90 minutes with a structured self-reflection that surfaces your tendencies and blind spots across 8 coaching-developed lenses.
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
            What Is The Satellite Scan?
          </h2>
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
            <div className="space-y-4">
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
              <p className="text-xs text-white/40 max-w-xs text-center">
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
                    <span className="absolute bottom-1 right-1 text-[8px] text-white/40">{v.lens}</span>
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
                              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-foreground mt-1 whitespace-nowrap">{lens.name}</span>
                              <span className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground">{lens.code}</span>
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
                                    <p className="text-[10px] sm:text-xs text-destructive font-semibold mb-1 uppercase tracking-wider">Pain Signal</p>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">{details.painSignal}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] sm:text-xs text-needs font-semibold mb-1 uppercase tracking-wider">Benefit</p>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">{details.benefit}</p>
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
                                <Badge variant="outline" className="text-[10px] border-white/20 text-white/60">
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
            <p className="text-sm text-white/50">48-72 hour dashboard delivery</p>
            <p className="text-xs text-white/40">For personal development and coaching only. Not for hiring or selection.</p>
          </div>
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
        title="Satellite Scan | Communication Assessment for Executive Assistants & Leaders"
        description="90-minute communication diagnostic for EAs, CEOs, and executives. Map your patterns across 8 lenses including Influence, Dynamics, and Alignment. €99.95 with personalized insights in 48-72 hours."
        keywords="executive assistant communication assessment, CEO communication diagnostic, leadership communication tool, executive coaching assessment, communication patterns analysis, EA training, managing up communication"
        canonicalPath="/scan"
        structuredData={PRODUCT_STRUCTURED_DATA.satelliteScan}
        faqItems={FAQ_ITEMS.map(item => ({ question: item.question, answer: item.answer }))}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Satellite Scan", url: "/scan" }
        ]}
      />
      {/* Page content with gradient background */}
      <div 
        style={{
          background: `linear-gradient(180deg, 
            #030508 0%,
            #050810 3%,
            #080c16 6%,
            #0a1020 9%,
            #0c1428 12%,
            #0e1830 15%,
            #101c38 18%,
            #122040 21%,
            #142448 24%,
            #162850 27%,
            #182c58 30%,
            #1a3060 35%,
            #1e3468 40%,
            #223a72 45%,
            #26407c 50%,
            #2a4684 55%,
            #2e4c8c 60%,
            #325292 65%,
            #385896 70%,
            #3a5690 75%,
            #344e82 80%,
            #2e4674 85%,
            #1a3654 90%,
            #102840 93%,
            #0c2238 96%,
            #071c30 100%
          )`
        }}
      >
        <HeroSection />
        
        {/* Content sections with vertical teal train track line */}
        <div className="relative">
          {/* Vertical teal line - the train track */}
          <div 
            className="absolute left-4 md:left-8 lg:left-12 top-0 w-[2px] bg-needs/60 z-10"
            style={{ bottom: 'calc(20vh + 60px)' }}
            aria-hidden="true"
          />
          {/* Metro terminus station */}
          <div 
            className="absolute left-4 md:left-8 lg:left-12 w-6 h-6 rounded-full bg-needs border-2 border-needs/40 z-20 -translate-x-1/2"
            style={{ bottom: 'calc(20vh + 48px)' }}
            aria-hidden="true"
          />
          
          <BenefitsSection />
          <SignalsSection />
          <WhatIsItSection />
          <LensesSection />
          <FAQSection />
          <HowItWorksSection />
        </div>
      </div>
      
      {/* Finnish Archipelago section - OUTSIDE the page gradient */}
      <section 
        className="relative min-h-[80vh]"
        aria-label="Finnish Archipelago landscape" 
        data-testid="section-cityscape"
      >
        {/* Base background - matches the dark sky of the archipelago image */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: `linear-gradient(to bottom,
              #071c30 0%,
              #061828 20%,
              #051420 40%,
              #040f18 60%,
              #030a10 80%,
              #000000 100%
            )`
          }}
        />
        
        {/* Finnish archipelago image - with top mask to fade into background */}
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: `url(${archipelagoUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 5%, rgba(0,0,0,0.1) 10%, rgba(0,0,0,0.3) 15%, rgba(0,0,0,0.5) 20%, rgba(0,0,0,0.7) 25%, rgba(0,0,0,0.85) 30%, black 40%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 5%, rgba(0,0,0,0.1) 10%, rgba(0,0,0,0.3) 15%, rgba(0,0,0,0.5) 20%, rgba(0,0,0,0.7) 25%, rgba(0,0,0,0.85) 30%, black 40%, black 100%)'
          }}
        />
        
        {/* Bottom gradient overlay to fade tree line to black */}
        <div 
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ 
            height: '35%',
            background: `linear-gradient(to top,
              #000000 0%,
              rgba(0, 0, 0, 0.95) 20%,
              rgba(0, 0, 0, 0.8) 40%,
              rgba(0, 0, 0, 0.5) 60%,
              rgba(0, 0, 0, 0.2) 80%,
              transparent 100%
            )`
          }}
        />
        
        <div className="absolute bottom-8 left-0 right-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-white/80 text-sm">Finnish Archipelago</p>
          </div>
        </div>
      </section>
    </div>
  );
}
