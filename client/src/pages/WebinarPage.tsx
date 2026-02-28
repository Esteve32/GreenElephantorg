import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { atmosphericPalette } from "@/constants/atmosphericGradient";
import { LENSES, type LensType } from "@/constants/lenses";
import { Link } from "wouter";
import { ArrowRight, ArrowDown, Clock, Users, MessageSquare, Shield, Target, Sparkles, Brain, Zap, CheckCircle2, Bot, Gift, Timer, ChevronDown, ChevronLeft, ChevronRight, Calendar, Play, ExternalLink } from "lucide-react";
import { SEO } from "@/components/SEO";
import earthOrbitUrl from "@assets/generated_images/earth_orbit_aurora_view.png";

const DEFAULT_CONFIG = {
  hostNames: "Anu Timmerbacka",
  sessionTitle: "Communication Clarity for EA's & VA's",
  sessionSubtitle: "Lead with calm influence and conscious impact",
  sessionDuration: "75 minutes",
  countdownDeadline: new Date("2026-02-28T23:59:59+02:00").toISOString(),
  bonusDescription: "a free 1-on-1 session with a GreenElephant coach",
  ctaButtonText: null as string | null,
  ctaButtonTextExpired: null as string | null,
};

type WebinarConfig = typeof DEFAULT_CONFIG;

const LENS_ORDER: LensType[] = ["influence", "attitude", "chaordic", "flow", "alignment", "needs", "ego", "dynamics"];

const TESTIMONIALS = [
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
    quote: "As a bilingual EA, I switch between cultures ten times a day. The Scan helped me see which lens I default to in each language — and why certain conversations felt harder in English than in French.",
    name: "Camille D.",
    role: "Executive Assistant, International NGO",
    country: "Switzerland",
    lens: "attitude" as LensType,
  },
  {
    quote: "I recommended the Scan to my whole team. It's not a test — it's a mirror. And sometimes you need a good mirror before you can see your superpowers clearly.",
    name: "Mikko H.",
    role: "Operations Manager",
    country: "Finland",
    lens: "ego" as LensType,
  },
];

const EA_VA_CHALLENGES = [
  {
    title: "Managing Up Without Scripts",
    description: "You support leaders daily, but articulating your own needs or pushing back feels risky. The Scan reveals your default influence patterns.",
    icon: Users,
    lens: "influence" as LensType,
  },
  {
    title: "Setting Boundaries Gracefully",
    description: "Saying no without damaging trust. Understanding why certain requests trigger stress while others feel natural.",
    icon: Shield,
    lens: "needs" as LensType,
  },
  {
    title: "Navigating Stakeholder Dynamics",
    description: "Multiple executives, competing priorities. Your communication style determines whether you're caught in the middle or trusted to navigate it.",
    icon: MessageSquare,
    lens: "dynamics" as LensType,
  },
  {
    title: "Building Strategic Confidence",
    description: "Moving from task-taker to trusted advisor. Seeing your strengths clearly so you can name them in reviews, interviews, and tricky moments.",
    icon: Target,
    lens: "alignment" as LensType,
  },
];

const SCAN_JOURNEY_STEPS = [
  {
    step: "1",
    title: "Take the Scan",
    description: "90 minutes. 129 questions across 8 lenses. Self-paced, honest reflection — no right or wrong answers.",
    icon: Timer,
  },
  {
    step: "2",
    title: "Receive Your Dashboard",
    description: "A GreenElephant coach personally reviews your responses and creates a visual map of your communication patterns within 48-72 hours.",
    icon: Brain,
  },
  {
    step: "3",
    title: "Explore with AI",
    description: "Unlock insights from your data using our custom GPT, the Conscious Communicator. Ask it anything about your patterns.",
    icon: Bot,
  },
  {
    step: "4",
    title: "Grow Your Superpowers",
    description: "Apply what you learn. Use the prompt library. Join programs. Transform how you communicate — at your own pace.",
    icon: Sparkles,
  },
];

interface PastWebinarSession {
  title: string;
  date: string;
  summary: string;
  recordingUrl?: string;
  lens?: LensType;
}

const PAST_WEBINAR_SESSIONS: PastWebinarSession[] = [
  {
    title: "Communication Clarity for EA's & VA's",
    date: "2026-02-28",
    summary: "Explored how Executive and Virtual Assistants can identify their communication superpowers using the 8 Lenses framework. Featured live demonstrations of the Satellite Scan dashboard.",
    lens: "alignment",
  },
];

function formatMonthYear(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function formatSessionDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function buildEventStructuredData(config: WebinarConfig): object {
  const deadline = new Date(config.countdownDeadline);
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": config.sessionTitle,
    "description": `A free ${config.sessionDuration} live session. ${config.sessionSubtitle}`,
    "startDate": deadline.toISOString(),
    "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "VirtualLocation",
      "url": "https://greenelephant.org/webinar"
    },
    "organizer": {
      "@type": "Organization",
      "name": "GreenElephant",
      "url": "https://greenelephant.org"
    },
    "performer": {
      "@type": "Person",
      "name": config.hostNames
    },
    "isAccessibleForFree": true,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "url": "https://greenelephant.org/webinar"
    },
    "image": "https://greenelephant.org/og-image.png"
  };
}

function buildVideoStructuredData(sessions: PastWebinarSession[]): object[] {
  return sessions
    .filter(s => s.recordingUrl)
    .map(s => ({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": s.title,
      "description": s.summary,
      "uploadDate": s.date,
      "contentUrl": s.recordingUrl,
      "thumbnailUrl": "https://greenelephant.org/og-image.png",
      "publisher": {
        "@type": "Organization",
        "name": "GreenElephant",
        "url": "https://greenelephant.org"
      }
    }));
}

function ToggleDetail({ children, label }: { children: React.ReactNode; label?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-white/50 hover:text-white/70 transition-colors mx-auto"
        data-testid={`toggle-detail-${label || 'default'}`}
      >
        <span className="text-sm">{open ? "Hide details" : "Show details"}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function useCountdown(deadline: Date) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(deadline));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(deadline));
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  return timeLeft;
}

function calculateTimeLeft(deadline: Date) {
  const now = new Date().getTime();
  const diff = deadline.getTime() - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

function CountdownTimer({ deadline }: { deadline: Date }) {
  const { days, hours, minutes, seconds, expired } = useCountdown(deadline);

  if (expired) return null;

  const units = [
    { value: days, label: "Days" },
    { value: hours, label: "Hours" },
    { value: minutes, label: "Min" },
    { value: seconds, label: "Sec" },
  ];

  return (
    <div className="flex items-center justify-center gap-3" data-testid="countdown-timer">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-md w-16 h-16 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{String(unit.value).padStart(2, "0")}</span>
          </div>
          <span className="text-xs text-white/60 mt-1">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoPlay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
  };

  useEffect(() => {
    startAutoPlay();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const goTo = (index: number) => {
    setCurrent(index);
    startAutoPlay();
  };

  const prev = () => goTo((current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => goTo((current + 1) % TESTIMONIALS.length);

  const testimonial = TESTIMONIALS[current];
  const lens = LENSES[testimonial.lens];

  return (
    <div className="relative" data-testid="testimonial-carousel">
      <div className="flex items-center gap-4">
        <Button
          size="icon"
          variant="ghost"
          className="text-white/60 flex-shrink-0"
          onClick={prev}
          data-testid="button-testimonial-prev"
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
                  <blockquote className="text-lg md:text-xl text-white/90 leading-relaxed italic mb-6" data-testid={`text-testimonial-${current}`}>
                    "{testimonial.quote}"
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
          data-testid="button-testimonial-next"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        {TESTIMONIALS.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === current ? "bg-white" : "bg-white/30"
            }`}
            data-testid={`button-testimonial-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function WebinarPage() {
  const { data: fetchedConfig } = useQuery<WebinarConfig>({
    queryKey: ['/api/webinar-settings'],
    staleTime: 60000,
  });
  
  const config = fetchedConfig || DEFAULT_CONFIG;
  const deadline = new Date(config.countdownDeadline);
  const { expired } = useCountdown(deadline);

  const nextSessionMonth = formatMonthYear(config.countdownDeadline);
  const seoTitle = expired
    ? `Free Communication Webinar for EAs & Leaders | GreenElephant`
    : `Free Communication Webinar for EAs & Leaders | ${nextSessionMonth} | GreenElephant`;

  const eventSchema = !expired ? buildEventStructuredData(config) : undefined;
  const videoSchemas = buildVideoStructuredData(PAST_WEBINAR_SESSIONS);

  const combinedStructuredData = eventSchema
    ? videoSchemas.length > 0
      ? [eventSchema, ...videoSchemas]
      : eventSchema
    : videoSchemas.length > 0
      ? videoSchemas.length === 1 ? videoSchemas[0] : videoSchemas
      : undefined;

  return (
    <div className="min-h-screen bg-black">
      <SEO
        title={seoTitle}
        description={`A free ${config.sessionDuration} live session for Executive and Virtual Assistants. Learn to see, name and grow your communication superpowers with the Satellite Scan framework. ${!expired ? `Next session: ${nextSessionMonth}.` : 'Monthly recurring sessions.'}`}
        canonicalPath="/webinar"
        keywords="free communication webinar, executive assistant training, virtual assistant communication, conscious communication, leadership webinar, EA communication skills"
        structuredData={combinedStructuredData}
        faqItems={[
          {
            question: "What is the GreenElephant webinar about?",
            answer: "Our free monthly webinar introduces the 8 lenses of conscious communication and the Satellite Scan framework. You'll learn to identify your communication superpowers and blind spots, with practical tools you can apply immediately in your work as an Executive or Virtual Assistant."
          },
          {
            question: "Who is the webinar for?",
            answer: "The webinar is designed for Executive Assistants, Virtual Assistants, Office Managers, and admin professionals who want to strengthen their communication skills. Leaders and anyone interested in conscious communication are also welcome."
          },
          {
            question: "How long is the webinar and is it free?",
            answer: `The webinar is a free ${config.sessionDuration} live session. There's no cost and no obligation. Early registrants may receive a bonus: ${config.bonusDescription}.`
          },
          {
            question: "Will there be a recording available?",
            answer: "Past webinar recordings are made available on our webinar page after the live session. If you can't attend live, register anyway and we'll send you the recording link."
          },
          {
            question: "What happens after the webinar?",
            answer: "After the webinar, you can take the free 2-minute Communication Pattern Quick Check or invest in the full Satellite Scan (€99.95) for a comprehensive 8-lens communication profile. Coaching options are also available for those who want deeper transformation."
          }
        ]}
      />

      <HeroSection config={config} expired={expired} deadline={deadline} />
      <ChallengesSection />
      <TestimonialsSection />
      <FrameworkSection />
      <ScanJourneySection />
      <AITeaserSection />
      <SpecialOfferSection config={config} expired={expired} deadline={deadline} />
      <PastSessionsSection />
    </div>
  );
}

function HeroSection({ config, expired, deadline }: { config: WebinarConfig; expired: boolean; deadline: Date }) {
  const nextSessionDate = deadline.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-testid="section-webinar-hero"
    >
      <div
        className="absolute inset-0 bg-cover bg-top"
        style={{ backgroundImage: `url(${earthOrbitUrl})` }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, 
              rgba(34, 197, 94, 0.15) 0%,
              rgba(139, 92, 246, 0.20) 25%,
              rgba(0, 153, 153, 0.25) 50%,
              transparent 75%
            )`,
          }}
        />
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-[40vh] pointer-events-none z-[1]"
        style={{
          background: `linear-gradient(to top,
            ${atmosphericPalette.space} 0%,
            ${atmosphericPalette.space} 20%,
            rgba(10, 22, 40, 0.85) 40%,
            rgba(10, 22, 40, 0.5) 60%,
            rgba(10, 22, 40, 0.2) 80%,
            transparent 100%
          )`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
            <Badge className="bg-white/10 border-white/20 text-white backdrop-blur-sm text-base px-4 py-1.5" data-testid="badge-webinar-free">
              <Gift className="w-4 h-4 mr-2" />
              Free Live Session
            </Badge>
            {!expired && (
              <Badge className="bg-needs/20 border-needs/30 text-white backdrop-blur-sm text-base px-4 py-1.5" data-testid="badge-webinar-next-session">
                <Calendar className="w-4 h-4 mr-2" />
                Next: {nextSessionDate}
              </Badge>
            )}
            <Badge className="bg-white/5 border-white/15 text-white/70 backdrop-blur-sm text-sm px-3 py-1" data-testid="badge-webinar-recurring">
              Monthly Sessions
            </Badge>
          </div>

          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-white drop-shadow-lg"
            data-testid="text-webinar-title"
          >
            {config.sessionTitle}
          </h1>
          <p
            className="text-2xl md:text-3xl lg:text-4xl text-white/90 font-medium mb-6 max-w-4xl mx-auto leading-snug"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
            data-testid="text-webinar-subtitle"
          >
            {config.sessionSubtitle}
          </p>

          <div className="mt-8">
            <ToggleDetail label="hero">
              <p
                className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
              >
                A free {config.sessionDuration} session for Executive and Virtual Assistants
                who are brilliant at supporting others — and now want a clearer picture of their own
                communication superpowers.
              </p>
            </ToggleDetail>
          </div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-white/60 mt-12"
          >
            <p className="text-lg mb-2">Scroll to explore</p>
            <ArrowDown className="h-8 w-8 mx-auto" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ChallengesSection() {
  return (
    <section
      className="py-24"
      style={{
        background: `linear-gradient(180deg, ${atmosphericPalette.space} 0%, ${atmosphericPalette.highAtmosphere} 100%)`,
      }}
      data-testid="section-webinar-challenges"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            The Communication Challenges You Know Too Well
          </h2>
          <ToggleDetail label="challenges-intro">
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              You handle complex conversations daily for others. But when it comes to your own communication patterns, the picture isn't always clear.
            </p>
          </ToggleDetail>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {EA_VA_CHALLENGES.map((challenge, index) => {
            const lens = LENSES[challenge.lens];
            return (
              <motion.div
                key={challenge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${lens.hexColor}20` }}
                      >
                        <challenge.icon className="w-5 h-5" style={{ color: lens.hexColor }} />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{challenge.title}</h3>
                    </div>
                    <ToggleDetail label={`challenge-${index}`}>
                      <p className="text-white/70 leading-relaxed">{challenge.description}</p>
                    </ToggleDetail>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section
      className="py-16"
      style={{
        background: atmosphericPalette.highAtmosphere,
      }}
      data-testid="section-webinar-testimonials"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            What Professionals Are Saying
          </h2>
        </motion.div>
        <TestimonialCarousel />
      </div>
    </section>
  );
}

function FrameworkSection() {
  return (
    <section
      className="py-24"
      style={{
        background: `linear-gradient(180deg, ${atmosphericPalette.highAtmosphere} 0%, ${atmosphericPalette.upperAtmosphere} 100%)`,
      }}
      data-testid="section-webinar-framework"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            The 8 Lenses of Conscious Communication
          </h2>
          <ToggleDetail label="framework-intro">
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              A framework developed through years of coaching. Each lens reveals a different dimension of how you communicate — and where your superpowers live.
            </p>
          </ToggleDetail>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {LENS_ORDER.map((lensKey, index) => {
            const lens = LENSES[lensKey];
            const LensIcon = lens.icon;
            return (
              <motion.div
                key={lensKey}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-white/5 border-white/10 hover-elevate">
                  <CardContent className="p-4 text-center">
                    <div
                      className="w-12 h-12 rounded-md mx-auto mb-3 flex items-center justify-center"
                      style={{ backgroundColor: `${lens.hexColor}25` }}
                    >
                      <LensIcon className="w-6 h-6" style={{ color: lens.hexColor }} />
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-1">{lens.name}</h3>
                    <p className="text-white/50 text-xs">{lens.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/periodic-table">
            <Button size="lg" variant="outline" className="border-white/30 text-white" data-testid="button-webinar-explore-table">
              Explore the Full Periodic Table
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ScanJourneySection() {
  return (
    <section
      className="py-24"
      style={{
        background: `linear-gradient(180deg, ${atmosphericPalette.upperAtmosphere} 0%, ${atmosphericPalette.midAtmosphere} 100%)`,
      }}
      data-testid="section-webinar-journey"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Your Satellite Scan Journey
          </h2>
          <ToggleDetail label="journey-intro">
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              A self-paced learning journey designed for assistants. No rush, no judgment — just clarity about how you communicate.
            </p>
          </ToggleDetail>
        </motion.div>

        <div className="space-y-6">
          {SCAN_JOURNEY_STEPS.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-5 mb-2">
                      <div className="w-12 h-12 rounded-md bg-needs/20 flex items-center justify-center flex-shrink-0">
                        <StepIcon className="w-6 h-6 text-needs" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    </div>
                    <div className="pl-17">
                      <ToggleDetail label={`step-${index}`}>
                        <p className="text-white/70 leading-relaxed">{step.description}</p>
                      </ToggleDetail>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/scan">
            <Button size="lg" variant="outline" className="border-white/30 text-white" data-testid="button-webinar-learn-scan">
              Learn More About the Scan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function AITeaserSection() {
  return (
    <section
      className="py-24"
      style={{
        background: `linear-gradient(180deg, ${atmosphericPalette.midAtmosphere} 0%, ${atmosphericPalette.lowerAtmosphere} 100%)`,
      }}
      data-testid="section-webinar-ai"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-6 bg-ego/20 border-ego/30 text-white">
            <Bot className="w-3 h-3 mr-1" />
            AI-Powered Exploration
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Your Data + AI = Deeper Insights
          </h2>
          <ToggleDetail label="ai-intro">
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              After your Scan, explore your results using the Conscious Communicator — a custom GPT trained on the framework. Ask it anything about your patterns, strengths, and growth areas.
            </p>
          </ToggleDetail>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-8">
              <ToggleDetail label="ai-examples">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-md bg-ego/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-ego" />
                    </div>
                    <div className="bg-white/5 rounded-md p-4 flex-1">
                      <p className="text-white/80 italic">
                        "Based on your Satellite Scan results, your strongest lens is Alignment — you naturally build shared understanding. Your growth edge is in Influence, where you tend to hold back your perspective to keep harmony..."
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-md bg-needs/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-needs" />
                    </div>
                    <div className="bg-white/5 rounded-md p-4 flex-1">
                      <p className="text-white/80 italic">
                        "For your upcoming performance review, try leading with your Alignment strength: 'I've noticed that when we align on priorities early, the whole team moves faster. Here's what I'd like us to align on for Q3...'"
                      </p>
                    </div>
                  </div>
                </div>
              </ToggleDetail>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <Link href="/resources">
                  <Button size="lg" variant="outline" className="border-white/30 text-white" data-testid="button-webinar-resources">
                    Explore the Prompt Library
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function SpecialOfferSection({ config, expired, deadline }: { config: WebinarConfig; expired: boolean; deadline: Date }) {
  return (
    <section
      className="py-24"
      style={{
        background: `linear-gradient(180deg, ${atmosphericPalette.lowerAtmosphere} 0%, #000000 100%)`,
      }}
      data-testid="section-webinar-offer"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {expired ? "Start Your Satellite Scan" : "Special Webinar Offer"}
          </h2>

          {!expired && (
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
              Purchase your Satellite Scan before the timer runs out and receive {config.bonusDescription} — included at no extra cost.
            </p>
          )}

          {expired && (
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
              Map your communication patterns across 8 lenses. 90 minutes. 129 questions. Your personalised dashboard within 48-72 hours.
            </p>
          )}

          <Card className="bg-white/5 border-white/10 mb-8">
            <CardContent className="p-8">
              <div className="mb-6">
                <span className="text-5xl font-bold text-white" data-testid="text-webinar-price">€99.95</span>
                <p className="text-white/50 mt-2">Satellite Scan — Early Adopter Price</p>
              </div>

              <ToggleDetail label="offer-details">
                <ul className="space-y-3 text-left max-w-md mx-auto mb-4">
                  <li className="flex items-center gap-3 text-white/80">
                    <CheckCircle2 className="w-5 h-5 text-needs flex-shrink-0" />
                    <span>129-question self-reflection across 8 lenses</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <CheckCircle2 className="w-5 h-5 text-needs flex-shrink-0" />
                    <span>Personalised dashboard reviewed by a coach</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <CheckCircle2 className="w-5 h-5 text-needs flex-shrink-0" />
                    <span>AI-powered exploration with the Conscious Communicator</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <CheckCircle2 className="w-5 h-5 text-needs flex-shrink-0" />
                    <span>Access to the full prompt library</span>
                  </li>
                  {!expired && (
                    <li className="flex items-center gap-3 text-white">
                      <Gift className="w-5 h-5 text-attitude flex-shrink-0" />
                      <span className="font-semibold">
                        BONUS: {config.bonusDescription}
                      </span>
                    </li>
                  )}
                </ul>
              </ToggleDetail>

              {!expired && (
                <div className="my-8">
                  <p className="text-white/60 mb-4 flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    Offer expires in:
                  </p>
                  <CountdownTimer deadline={deadline} />
                </div>
              )}

              <div className="mt-6">
                <Link href="/checkout?product=satellitescan">
                  <Button
                    size="lg"
                    className="bg-needs text-white min-w-[280px]"
                    data-testid="button-webinar-get-scan"
                  >
                    {expired 
                      ? (config.ctaButtonTextExpired || "Get Your Satellite Scan") 
                      : (config.ctaButtonText || "Claim Your Scan + Bonus Session")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              {!expired && (
                <ToggleDetail label="offer-fine-print">
                  <p className="text-white/40 text-sm">
                    Same Scan, same price — the bonus coaching session is our gift to webinar participants.
                  </p>
                </ToggleDetail>
              )}
            </CardContent>
          </Card>

          <p className="text-white/40 text-xs">
            For personal development and coaching only. Not for hiring, selection, or performance evaluation.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function PastSessionsSection() {
  if (PAST_WEBINAR_SESSIONS.length === 0) return null;

  return (
    <section
      className="py-24"
      style={{
        background: `linear-gradient(180deg, #000000 0%, ${atmosphericPalette.space} 50%, #000000 100%)`,
      }}
      data-testid="section-webinar-past-sessions"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-6 bg-white/5 border-white/15 text-white/70">
            <Clock className="w-3 h-3 mr-1" />
            Archive
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Past Sessions
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Missed a session? Catch up on previous webinars and explore recordings when available.
          </p>
        </motion.div>

        <div className="space-y-4">
          {PAST_WEBINAR_SESSIONS.map((session, index) => {
            const lens = session.lens ? LENSES[session.lens] : null;
            return (
              <motion.div
                key={`${session.date}-${index}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="bg-white/5 border-white/10" data-testid={`card-past-session-${index}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          backgroundColor: lens ? `${lens.hexColor}20` : 'rgba(255,255,255,0.1)',
                        }}
                      >
                        {session.recordingUrl ? (
                          <Play className="w-5 h-5" style={{ color: lens?.hexColor || 'white' }} />
                        ) : (
                          <Calendar className="w-5 h-5" style={{ color: lens?.hexColor || 'white' }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-1">
                          <h3 className="text-lg font-semibold text-white" data-testid={`text-past-session-title-${index}`}>
                            {session.title}
                          </h3>
                          {lens && (
                            <Badge
                              className="text-xs"
                              style={{
                                backgroundColor: `${lens.hexColor}20`,
                                borderColor: `${lens.hexColor}40`,
                                color: lens.hexColor,
                              }}
                            >
                              {lens.name}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-white/40 mb-2" data-testid={`text-past-session-date-${index}`}>
                          {formatSessionDate(session.date)}
                        </p>
                        <p className="text-white/60 leading-relaxed text-sm" data-testid={`text-past-session-summary-${index}`}>
                          {session.summary}
                        </p>
                        {session.recordingUrl && (
                          <a
                            href={session.recordingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-3 text-sm text-needs hover:text-needs/80 transition-colors"
                            data-testid={`link-past-session-recording-${index}`}
                          >
                            <Play className="w-4 h-4" />
                            Watch Recording
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
