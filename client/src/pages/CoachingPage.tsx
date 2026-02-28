import { useEffect } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import CoachingPackage from "@/components/CoachingPackage";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { atmosphericPalette } from "@/constants/atmosphericGradient";
import { fadeInUp, fadeIn, staggerContainer } from "@/lib/motion";
import zurichUrl from "@assets/stock_images/zurich_switzerland_l_1db6a83f.jpg";
import { SEO, PRODUCT_STRUCTURED_DATA } from "@/components/SEO";

const COACHING_FAQ_ITEMS = [
  {
    question: "What happens in a coaching session?",
    answer: "Each session is a 120-minute deep-dive into your communication patterns. We use your Satellite Scan results to identify specific triggers, blind spots, and strengths. Together, we co-create micro-habits tailored to your daily context—whether that's managing up, navigating conflict, or building executive presence."
  },
  {
    question: "How much does coaching cost?",
    answer: "Single sessions start at €295 for a 120-minute deep-dive. The Coaching Journey (our most popular option) is €2,980 for approximately 6 months of biweekly sessions, unlimited check-in calls, and ongoing messaging support. Team workshops are priced on request depending on duration and group size."
  },
  {
    question: "What's the difference between coaching and therapy?",
    answer: "Coaching focuses on developing conscious communication skills and building new patterns for professional and personal growth. It is not a substitute for mental health treatment. If you're experiencing severe anxiety, depression, trauma, or crisis, we recommend working with a licensed therapist first. Coaching can complement ongoing therapy."
  },
  {
    question: "Do I need to take the Satellite Scan before coaching?",
    answer: "The Coaching Journey includes a Satellite Scan as the first step—it gives us a data-driven baseline of your communication patterns across 8 lenses. For single sessions, it's recommended but not required. The Scan helps us focus coaching time on what matters most for you."
  },
  {
    question: "How long does it take to see results?",
    answer: "Most clients notice shifts within the first 2-3 weeks of practicing micro-habits. Significant behavioral change typically takes 3-6 months of consistent practice. The Coaching Journey continues until your personalized SMART goal is reached—not for a fixed duration."
  },
  {
    question: "What if I'm not sure coaching is right for me?",
    answer: "Start with the Satellite Scan (€99.95) to get a clear picture of your communication patterns. You can also take our free 2-minute Communication Pattern Quick Check to identify your drift signals. Both will help you decide if deeper coaching work would benefit you."
  },
  {
    question: "Is coaching available remotely?",
    answer: "Yes, all coaching sessions are conducted via video call. This allows us to work with clients across time zones. Session recordings and transcripts are provided so you can revisit key insights."
  },
  {
    question: "Who is coaching for?",
    answer: "Our coaching is designed for professionals who want to transform how they communicate—Executive Assistants navigating power dynamics, CEOs building team alignment, founders creating collaborative culture, and anyone seeking more conscious, effective communication in their work and relationships."
  }
];

const packages = [
  {
    title: "Single Session",
    type: "1:1" as const,
    sessions: 1,
    duration: "one-time",
    price: "€295",
    packageId: "1on1-single",
    features: [
      "120-minute deep-dive session",
      "Personalized framework analysis",
      "Action plan with 3 micro-habits",
      "Session recording & transcript",
    ],
  },
  {
    title: "Coaching Journey",
    subtitle: "Communication Clarity & Influence Boost",
    type: "1:1" as const,
    sessions: "Unlimited",
    duration: "~6 months",
    price: "€2,980",
    packageId: "coaching-journey",
    features: [
      "AI-powered Satellite Scan™ (90 questions, ~120 min)",
      "Clarity & goal-setting session",
      "Biweekly coaching sessions (2 hours each)",
      "Unlimited 20-min check-in calls",
      "Ongoing messaging support",
      "Personalized micro-habit plan",
      "Lens video library access",
      "Support until objectives are reached",
    ],
    highlighted: true,
    idealFor: "Executive Assistants, Office Managers, Admin Professionals & Team Enablers",
  },
  {
    title: "Half-day to 3-Day Intensive Workshop (up to 12 people)",
    type: "Team" as const,
    sessions: 1,
    duration: "On Demand",
    price: "Get a Quote",
    packageId: "team-workshop",
    features: [
      "Flexible duration: half-day to 3-day intensive",
      "Up to 12 participants per workshop",
      "Collectively intelligent micro-habits",
    ],
    buttonText: "Get a Quote",
    buttonLink: "/connect#contact",
  },
];

const processSteps = [
  {
    number: 1,
    title: "Discovery",
    description: "AI-powered Satellite Scan™ reveals your unique communication patterns and blindspots"
  },
  {
    number: 2,
    title: "Design",
    description: "Together we create personalized microhabits aligned with your goals and context"
  },
  {
    number: 3,
    title: "Practice",
    description: "Biweekly sessions and ongoing support as you integrate new patterns into daily life"
  },
  {
    number: 4,
    title: "Mastery",
    description: "Sustained transformation with video library access and integration until objectives are met"
  }
];

const testimonials = [
  {
    name: "Sarah",
    role: "Executive Assistant",
    quote: "Before coaching, I would freeze in high-stakes conversations with executives. Now I navigate power dynamics with clarity and confidence. The micro-habit approach made lasting change feel achievable—one small shift at a time.",
  },
  {
    name: "Marcus",
    role: "Startup Founder",
    quote: "I used to bulldoze through conversations, missing the signals that my team was disengaging. The Satellite Scan revealed patterns I was blind to. Six months later, my co-founders say I'm a completely different leader.",
  },
  {
    name: "Elena",
    role: "Design Director",
    quote: "The transformation wasn't just professional—it changed how I communicate with my partner and children. Understanding my reactive patterns through the lens framework gave me the awareness to choose differently in every relationship.",
  },
];

export default function CoachingPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen">
      <SEO 
        title="Executive Coaching & Leadership Communication | 1:1 & Team Sessions"
        description="Executive coaching for CEOs, Executive Assistants, and leaders. From €295 single sessions to 6-month Coaching Journeys. Build executive presence, team alignment, and conscious communication habits."
        keywords="CEO executive coaching, executive assistant coaching, leadership coaching, executive presence communication, team alignment coaching, communication habit coaching, conflict resolution for leaders"
        canonicalPath="/coaching"
        structuredData={PRODUCT_STRUCTURED_DATA.coachingJourney}
        faqItems={COACHING_FAQ_ITEMS}
      />
      <section 
        className="relative pt-24 pb-16"
        style={{
          background: `linear-gradient(180deg, ${atmosphericPalette.space} 0%, ${atmosphericPalette.highAtmosphere} 40%, ${atmosphericPalette.upperAtmosphere} 100%)`
        }}
        data-testid="section-coaching-hero"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Badge 
              className="mb-4 bg-white/10 text-white border-white/20"
              data-testid="badge-coaching-type"
            >
              Personal & Team Coaching
            </Badge>
            <h1 
              className="text-5xl md:text-6xl font-bold mb-6 text-white"
              data-testid="text-coaching-title"
            >
              Stop Repeating the Same Communication Patterns
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-4">
              Personalized coaching transforms your reactive patterns into conscious responses—one conversation at a time
            </p>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Whether you're an Executive Assistant navigating power dynamics, a <a href="https://en.wikipedia.org/wiki/Teal_organisation" target="_blank" rel="noopener noreferrer" className="text-needs hover:underline" data-testid="link-teal-org">TEAL</a> founder building collaborative culture, or a designer seeking authentic dialogue—you'll gain practical frameworks and compassionate support.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8 mb-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            data-testid="grid-coaching-packages"
          >
            {packages.map((pkg, index) => (
              <motion.div 
                key={pkg.title} 
                variants={fadeInUp}
                data-testid={`card-package-${pkg.packageId}`}
              >
                <CoachingPackage {...pkg} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        className="relative py-16"
        style={{
          background: `linear-gradient(180deg, ${atmosphericPalette.upperAtmosphere} 0%, ${atmosphericPalette.midAtmosphere} 100%)`
        }}
        data-testid="section-coaching-process"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-center mb-6 text-white" data-testid="text-process-title">
              The Coaching Process
            </h2>
            <p className="text-center text-white/70 mb-12 max-w-2xl mx-auto">
              A systematic journey from awareness to transformation, supported every step of the way
            </p>
            <motion.div 
              className="grid md:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {processSteps.map((step) => (
                <motion.div 
                  key={step.number} 
                  className="text-center"
                  variants={fadeInUp}
                  data-testid={`step-process-${step.number}`}
                >
                  <div className="w-12 h-12 rounded-full bg-needs/30 flex items-center justify-center mb-4 mx-auto">
                    <span className="text-2xl font-bold text-needs">{step.number}</span>
                  </div>
                  <h3 className="font-semibold mb-2 text-lg text-white">{step.title}</h3>
                  <p className="text-sm text-white/70">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section
        className="relative py-16"
        style={{
          background: `linear-gradient(180deg, ${atmosphericPalette.midAtmosphere} 0%, ${atmosphericPalette.lowerAtmosphere} 100%)`
        }}
        data-testid="section-smart-transformation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeIn}
            >
              <Card className="bg-white/5 backdrop-blur-md border border-white/10 h-full" data-testid="card-smart-goal">
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-4 text-white">Your Personalized SMART Goal</h3>
                  <div className="space-y-4 text-white/70">
                    <p>
                      Every coaching journey begins with co-creating your unique transformation goal using the SMART framework:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-needs font-semibold mt-0.5">S</span>
                        <span><strong className="text-white">Specific:</strong> Crystal-clear communication outcomes tailored to your context</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-needs font-semibold mt-0.5">M</span>
                        <span><strong className="text-white">Measurable:</strong> Concrete indicators you can track and celebrate</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-needs font-semibold mt-0.5">A</span>
                        <span><strong className="text-white">Achievable:</strong> Ambitious yet realistic within your current life</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-needs font-semibold mt-0.5">R</span>
                        <span><strong className="text-white">Relevant:</strong> Aligned with your deepest values and aspirations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-needs font-semibold mt-0.5">T</span>
                        <span><strong className="text-white">Time-bound:</strong> Clear milestones with realistic timeframes</span>
                      </li>
                    </ul>
                    <p className="pt-2 text-white font-medium">
                      We continue coaching until you reach your goal—not for a fixed duration.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeIn}
            >
              <Card className="bg-white/5 backdrop-blur-md border border-white/10 h-full" data-testid="card-transformation">
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-4 text-white">Total Communication Transformation</h3>
                  <div className="space-y-4 text-white/70">
                    <p>
                      This isn't just coaching—it's personal transformation that ripples through every aspect of your life:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-needs mt-1">•</span>
                        <span><strong className="text-white">Human Conversations:</strong> Navigate difficult dialogues with colleagues, partners, family with confidence and clarity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-needs mt-1">•</span>
                        <span><strong className="text-white">AI Prompting:</strong> Learn to communicate with AI tools in ways that unlock deeper insights and better outcomes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-needs mt-1">•</span>
                        <span><strong className="text-white">Self-Talk:</strong> Transform your inner dialogue from criticism to compassionate self-leadership</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-needs mt-1">•</span>
                        <span><strong className="text-white">Written Communication:</strong> Craft emails, messages, and documents that land with impact and empathy</span>
                      </li>
                    </ul>
                    <p className="pt-2">
                      Whether you're prompting ChatGPT or presenting to your board, the same conscious communication principles apply—and transform everything.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        className="relative py-16"
        style={{
          background: `linear-gradient(180deg, ${atmosphericPalette.lowerAtmosphere} 0%, ${atmosphericPalette.skyHorizon} 100%)`
        }}
        data-testid="section-disclaimer"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeIn}
            data-testid="card-disclaimer"
          >
            <h3 className="text-2xl font-bold mb-4 text-center text-white">Important: Coaching Is Not Therapy</h3>
            <div className="max-w-3xl mx-auto space-y-4 text-sm">
              <p className="leading-relaxed text-white/70">
                Our coaching supports personal and professional growth through conscious communication practice. 
                However, it is <strong className="text-white">not a substitute for mental health treatment</strong>.
              </p>
              <p className="leading-relaxed text-white/70">
                <strong className="text-white">If you're experiencing:</strong>
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span className="text-white/70">Severe depression, anxiety, or persistent emotional distress</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span className="text-white/70">Thoughts of self-harm or suicide</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span className="text-white/70">Trauma that requires clinical intervention</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span className="text-white/70">Substance abuse or addiction challenges</span>
                </li>
              </ul>
              <p className="leading-relaxed text-white/70">
                <strong className="text-white">Please contact a licensed mental health professional first.</strong> Our coaching can 
                complement ongoing therapy, but we recommend discussing this with your therapist.
              </p>
              <p className="text-xs text-white/50 mt-4">
                <strong className="text-white/70">Crisis Resources:</strong> If you're in crisis, contact your local emergency services, 
                call a suicide prevention hotline, or visit your nearest emergency room. EU Helpline: 116 123
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeIn}
            data-testid="card-availability"
          >
            <h3 className="text-2xl font-bold mb-4 text-white">Limited Availability</h3>
            <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
              We limit coaching engagements to ensure each partnership receives the depth of attention it deserves. 
              Our commitment is to your transformation, not volume—which means working with a select number of 
              clients who are ready for meaningful change.
            </p>
          </motion.div>
        </div>
      </section>

      <section
        className="relative py-16"
        style={{
          background: atmosphericPalette.skyHorizon
        }}
        data-testid="section-testimonials"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-4 text-white" data-testid="text-testimonials-title">
              Voices of Transformation
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Real stories from clients who've experienced the shift from reactive patterns to conscious communication
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.name} 
                variants={fadeInUp}
                data-testid={`card-testimonial-${index}`}
              >
                <Card className="bg-white/10 backdrop-blur-md border border-white/15 h-full">
                  <CardContent className="pt-6">
                    <Quote className="w-8 h-8 text-needs/60 mb-4" aria-hidden="true" />
                    <blockquote className="text-white/80 leading-relaxed mb-6 italic">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="border-t border-white/10 pt-4">
                      <p className="font-semibold text-white" data-testid={`text-testimonial-name-${index}`}>
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-white/60" data-testid={`text-testimonial-role-${index}`}>
                        {testimonial.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Zurich Footer - Full width image with seamless gradients */}
      <section 
        className="relative"
        aria-label="Zurich landscape"
        data-testid="section-zurich-footer"
      >
        {/* Top gradient - blends from skyHorizon testimonials section */}
        <div 
          className="absolute top-0 left-0 right-0 h-32 z-10 pointer-events-none"
          style={{ 
            background: `linear-gradient(to bottom,
              ${atmosphericPalette.skyHorizon} 0%,
              ${atmosphericPalette.skyHorizon}CC 30%,
              ${atmosphericPalette.skyHorizon}66 60%,
              transparent 100%
            )`
          }}
          aria-hidden="true"
        />
        
        {/* Full-width Zurich image container */}
        <div className="w-full">
          <img 
            src={zurichUrl} 
            alt="Zurich, Switzerland skyline"
            className="w-full h-auto object-contain"
            style={{ display: 'block' }}
          />
        </div>
        
        {/* Bottom gradient - fades to dark */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-40 z-10 pointer-events-none"
          style={{ 
            background: `linear-gradient(to top,
              #000000 0%,
              #000000CC 20%,
              #00000099 40%,
              #00000066 60%,
              #00000033 80%,
              transparent 100%
            )`
          }}
          aria-hidden="true"
        />
        
        {/* Location label */}
        <div className="absolute bottom-8 left-0 right-0 z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-white/80 text-sm">Zurich, Switzerland</p>
          </div>
        </div>
      </section>
    </div>
  );
}
