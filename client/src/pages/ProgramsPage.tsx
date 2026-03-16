import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { atmosphericPalette } from "@/constants/atmosphericGradient";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import archipelagoUrl from "@assets/finnish_archipelago_landscape_aerial_view_1764797904449.png";
import Footer from "@/components/Footer";
import { ArrowRight, Sparkles, Trophy, Compass, CheckCircle2, Calendar, Users, Target, Brain, Heart, MessageSquare, Zap, BarChart3, Shield, Lock } from "lucide-react";
import { SEO } from "@/components/SEO";
import programPathsUrl from "@assets/generated_images/program_comparison_paths.png";

const EA_BENEFITS = [
  "Master the art of managing up with confidence",
  "Navigate complex stakeholder dynamics",
  "Develop your leadership presence",
  "Build strategic communication skills",
  "Create psychological safety in teams"
];

const INTERVIEW_BENEFITS = [
  "Prepare as a candidate to ace any interview format",
  "Develop authentic storytelling skills",
  "Handle high-pressure questions with ease",
  "Project confidence without arrogance",
  "Close interviews with impact"
];

const PATH_QUESTIONS = [
  {
    id: "goal",
    question: "What's your primary goal?",
    options: [
      { value: "self-awareness", label: "Understanding my communication patterns", icon: Brain },
      { value: "leadership", label: "Becoming a better leader", icon: Users },
      { value: "career", label: "Advancing my career", icon: Trophy },
      { value: "relationships", label: "Improving relationships", icon: Heart }
    ]
  },
  {
    id: "urgency",
    question: "How urgent is your need?",
    options: [
      { value: "immediate", label: "I need help right now", icon: Zap },
      { value: "upcoming", label: "I have something coming up", icon: Calendar },
      { value: "general", label: "General improvement over time", icon: Target },
      { value: "exploring", label: "Just exploring options", icon: Compass }
    ]
  }
];

function HeroSection() {
  return (
    <section 
      className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center px-4 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, 
          ${atmosphericPalette.space} 0%, 
          ${atmosphericPalette.highAtmosphere} 50%, 
          ${atmosphericPalette.upperAtmosphere} 100%
        )`
      }}
      data-testid="section-programs-hero"
    >
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-needs/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-ego/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <motion.div 
        className="relative max-w-5xl mx-auto text-center pt-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Badge className="mb-6 bg-white/10 border-white/20 text-white backdrop-blur-sm">
          Coaching Programs
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg mb-6" data-testid="text-programs-title">
          Transform Your Communication
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
          Whether you're leading teams, navigating interviews, or seeking clarity on your path—we have a program for you.
        </p>
      </motion.div>
    </section>
  );
}

function CompareAllSection() {
  const programs = [
    {
      name: "Satellite Scan",
      price: "€99.95",
      priceNote: "one-time",
      description: "Your communication baseline",
      idealFor: "Anyone starting their journey",
      includes: ["129-question self-assessment", "Personalized dashboard (48-72h)", "10+ AI coaching prompts", "Video coaching library", "Downloadable resources"],
      cta: "Get Your Scan",
      link: "/scan",
      color: "#009999",
      highlighted: false,
    },
    {
      name: "Single Session",
      price: "€295",
      priceNote: "120 min",
      description: "Deep-dive coaching session",
      idealFor: "Specific challenge or decision",
      includes: ["120-minute 1:1 session", "Personalized framework analysis", "3 micro-habits action plan", "Session recording & transcript"],
      cta: "Book a Session",
      link: "/coaching",
      color: "#33a854",
      highlighted: false,
    },
    {
      name: "Interview Bundle",
      price: "€845",
      priceNote: "3 sessions",
      description: "Data-driven interview mastery",
      idealFor: "Professionals 40+ in career transition",
      includes: ["Satellite Scan included", "3 coaching sessions (90-120 min)", "Mock interview practice", "Post-interview debrief", "Personalized language coaching"],
      cta: "Get the Bundle",
      link: "/interview-coaching",
      color: "#9933cc",
      highlighted: false,
    },
    {
      name: "Coaching Journey",
      price: "€2,980",
      priceNote: "~6 months",
      description: "Full transformation",
      idealFor: "EAs, leaders, founders seeking deep change",
      includes: ["Satellite Scan included", "Biweekly coaching sessions", "Unlimited check-in calls", "Ongoing messaging support", "Personalized micro-habit plan", "Lens video library access", "Support until goals reached"],
      cta: "Start Your Journey",
      link: "/coaching",
      color: "#e8c840",
      highlighted: true,
    },
  ];

  return (
    <section
      id="compare"
      className="relative py-24 md:py-32"
      style={{
        background: `linear-gradient(180deg, 
          ${atmosphericPalette.upperAtmosphere} 0%, 
          ${atmosphericPalette.midAtmosphere} 100%
        )`
      }}
      data-testid="section-compare-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge className="mb-6 bg-needs/20 text-needs border-needs/30">
            <BarChart3 className="w-3 h-3 mr-1" />
            Compare Programs
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white" data-testid="text-compare-title">
            Choose Your Path
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Every journey starts with self-awareness. Pick the depth that matches your goal.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {programs.map((prog, i) => (
            <motion.div
              key={prog.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex"
            >
              <Card
                className={`w-full flex flex-col bg-white/5 backdrop-blur-sm border-white/10 ${
                  prog.highlighted ? 'ring-2' : ''
                }`}
                style={prog.highlighted ? { borderColor: `${prog.color}60`, boxShadow: `0 0 24px ${prog.color}15` } : {}}
                data-testid={`card-program-${prog.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {prog.highlighted && (
                  <div className="text-center py-1.5 text-xs font-semibold tracking-wider uppercase" style={{ backgroundColor: `${prog.color}20`, color: prog.color }}>
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="mb-4">
                    <div className="w-3 h-3 rounded-full mb-3" style={{ backgroundColor: prog.color }} />
                    <h3 className="text-xl font-bold text-white mb-1">{prog.name}</h3>
                    <p className="text-sm text-white/50">{prog.description}</p>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-white">{prog.price}</span>
                    <span className="text-sm text-white/40 ml-2">{prog.priceNote}</span>
                  </div>

                  <p className="text-xs text-white/40 mb-4">
                    <span className="font-medium text-white/60">Ideal for:</span> {prog.idealFor}
                  </p>

                  <ul className="space-y-2 mb-6 flex-1">
                    {prog.includes.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-white/70">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: prog.color }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={prog.link}>
                    <Button
                      className="w-full text-white"
                      style={{ backgroundColor: prog.color }}
                      data-testid={`button-program-${prog.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {prog.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-6">
            <span className="flex items-center gap-2 text-sm text-white/50">
              <Shield className="w-4 h-4" /> 14-day satisfaction guarantee
            </span>
            <span className="flex items-center gap-2 text-sm text-white/50">
              <Calendar className="w-4 h-4" /> Flexible scheduling
            </span>
            <span className="flex items-center gap-2 text-sm text-white/50">
              <Users className="w-4 h-4" /> Team workshops available
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function EACoachingSection() {
  return (
    <section 
      id="ea-coaching" 
      className="relative py-24 md:py-32"
      style={{
        background: `linear-gradient(180deg, 
          ${atmosphericPalette.upperAtmosphere} 0%, 
          ${atmosphericPalette.midAtmosphere} 100%
        )`
      }}
      data-testid="section-ea-coaching"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-sparkles/20 text-sparkles border-sparkles/30">
              <Sparkles className="w-3 h-3 mr-1" />
              EA Coaching
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white" data-testid="text-ea-title">
              Executive Assistant Empowerment
            </h2>
            <p className="text-lg text-white/70 mb-8">
              You're the connective tissue of your organization. Learn to leverage that position with confidence, strategic thinking, and leadership presence.
            </p>
            
            <ul className="space-y-4 mb-8">
              {EA_BENEFITS.map((benefit, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-needs flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <Link href="/coaching">
              <Button className="bg-sparkles hover:bg-sparkles/90 text-white" data-testid="button-ea-learn-more">
                Learn More About EA Coaching
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Program Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-needs/20 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-needs" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">1-on-1 Coaching</p>
                    <p className="text-sm text-white/60">Personalized sessions tailored to your challenges</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-alignment/20 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-alignment" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Stakeholder Navigation</p>
                    <p className="text-sm text-white/60">Master the dynamics of managing up and across</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-flow/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-flow" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Leadership Presence</p>
                    <p className="text-sm text-white/60">Build confidence and authority in any room</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function InterviewCoachingSection() {
  return (
    <section 
      id="interview-coaching" 
      className="relative py-24 md:py-32"
      style={{
        background: `linear-gradient(180deg, 
          ${atmosphericPalette.midAtmosphere} 0%, 
          ${atmosphericPalette.lowerAtmosphere} 30%,
          ${atmosphericPalette.skyHorizon} 60%,
          ${atmosphericPalette.upperAtmosphere} 80%,
          ${atmosphericPalette.space} 95%,
          ${atmosphericPalette.abyss} 100%
        )`
      }}
      data-testid="section-interview-coaching"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-1"
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-chaordic" />
                  3-Session Bundle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-4xl font-bold text-white">€845</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-needs" />
                    <span>Session 1: Discovery & Foundations</span>
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-needs" />
                    <span>Session 2: Practice & Feedback</span>
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-needs" />
                    <span>Session 3: Refinement & Confidence</span>
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-needs" />
                    <span>Post-interview debrief included</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 md:order-2"
          >
            <Badge className="mb-6 bg-chaordic/20 text-chaordic border-chaordic/30">
              <Trophy className="w-3 h-3 mr-1" />
              Interview Coaching
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white" data-testid="text-interview-title">
              Master High-Stakes Interviews
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Designed for job candidates preparing for their next opportunity. Learn to show up with confidence, authenticity, and impact in any interview setting.
            </p>
            
            <ul className="space-y-4 mb-8">
              {INTERVIEW_BENEFITS.map((benefit, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-chaordic flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <Link href="/interview-coaching">
              <Button className="bg-chaordic hover:bg-chaordic/90 text-black" data-testid="button-interview-learn-more">
                Book Interview Coaching
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function YourPathSection() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const getRecommendation = () => {
    const goal = answers.goal;
    const urgency = answers.urgency;

    if (urgency === "immediate" && goal === "career") {
      return {
        program: "Interview Coaching",
        description: "With an immediate career need, our 3-session Interview Coaching bundle will prepare you for success.",
        link: "/interview-coaching",
        color: "bg-chaordic"
      };
    } else if (goal === "leadership" || goal === "relationships") {
      return {
        program: "EA Coaching",
        description: "For leadership and relationship focus, our EA Coaching program develops your strategic communication skills.",
        link: "/coaching",
        color: "bg-sparkles"
      };
    } else {
      return {
        program: "Satellite Scan",
        description: "Start with a Satellite Scan to map your communication patterns. It's the foundation for any transformation.",
        link: "/scan",
        color: "bg-needs"
      };
    }
  };

  const recommendation = getRecommendation();
  const allAnswered = Object.keys(answers).length === PATH_QUESTIONS.length;

  return (
    <section 
      id="your-path" 
      className="relative py-24 md:py-32"
      style={{
        background: atmosphericPalette.abyss
      }}
      data-testid="section-your-path"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge className="mb-6 bg-alignment/20 text-alignment border-alignment/30">
            <Compass className="w-3 h-3 mr-1" />
            Find Your Path
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white" data-testid="text-path-title">
            Not Sure Where to Start?
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Answer two quick questions and we'll recommend the best program for your needs.
          </p>
        </motion.div>

        {!showResult ? (
          <div className="space-y-8">
            {PATH_QUESTIONS.map((q, qIndex) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: qIndex * 0.1 }}
              >
                <h3 className="text-xl font-semibold text-white mb-4">{q.question}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {q.options.map((option) => {
                    const Icon = option.icon;
                    const isSelected = answers[q.id] === option.value;
                    return (
                      <Card
                        key={option.value}
                        className={`cursor-pointer transition-all bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 ${isSelected ? 'ring-2 ring-needs' : ''}`}
                        onClick={() => setAnswers({ ...answers, [q.id]: option.value })}
                        data-testid={`option-${q.id}-${option.value}`}
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-needs/40' : 'bg-white/15'}`}>
                            <Icon className={`w-5 h-5 ${isSelected ? 'text-needs' : 'text-white'}`} />
                          </div>
                          <span className="text-white">{option.label}</span>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            ))}

            {allAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center pt-8"
              >
                <Button
                  size="lg"
                  className="bg-needs hover:bg-needs/90 text-white"
                  onClick={() => setShowResult(true)}
                  data-testid="button-get-recommendation"
                >
                  Get My Recommendation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-lg mx-auto">
              <CardContent className="p-8">
                <div className={`w-16 h-16 rounded-full ${recommendation.color} flex items-center justify-center mx-auto mb-6`}>
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">We Recommend</h3>
                <p className="text-3xl font-bold text-white mb-4">{recommendation.program}</p>
                <p className="text-white/70 mb-6">{recommendation.description}</p>
                <div className="flex flex-col gap-3">
                  <Link href={recommendation.link}>
                    <Button className={`${recommendation.color} text-white w-full`} data-testid="button-go-to-program">
                      Explore {recommendation.program}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => {
                      setShowResult(false);
                      setAnswers({});
                    }}
                    data-testid="button-start-over"
                  >
                    Start Over
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default function ProgramsPage() {
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
    <>
    <div className="min-h-screen" data-testid="page-programs">
      <SEO 
        title="Coaching Programs for EAs, CEOs & Leaders | GreenElephant"
        description="Executive communication programs for Executive Assistants, CEOs, and leaders. EA coaching, interview preparation, and leadership development. Find your path to communication mastery."
        keywords="personal development coaching, career change coaching, career transition program, emotional intelligence training, self-awareness coaching, executive assistant coaching program, CEO leadership program, EA training, interview coaching, executive presence training, leadership communication development, future-proof career skills"
        canonicalPath="/programs"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Programs", url: "/programs" }
        ]}
        faqItems={[
          { question: "What coaching programs does GreenElephant offer?", answer: "GreenElephant offers EA Communication Coaching (tailored for Executive Assistants), the Interview Mastery Bundle (3-session career interview preparation), single 1:1 coaching sessions (€295, 120 minutes), the full Coaching Journey (6 months, €2,980), and team workshops from €1,200." },
          { question: "How do I know which program is right for me?", answer: "The Satellite Scan assessment (€99.95) is the baseline for all coaching — it maps your communication patterns across 8 lenses and is used to personalise every session. If you are preparing for an interview or career change, the Interview Mastery Bundle is a focused 3-session path. For deep transformation, the Coaching Journey provides 6 months of biweekly sessions." },
          { question: "What is included in the EA Coaching Programme?", answer: "The Executive Assistant coaching programme combines the Satellite Scan diagnostic with personalised coaching sessions focused on managing up, stakeholder communication, executive presence, and navigating complex workplace dynamics. It is designed specifically for the unique communication challenges EA roles present." },
          { question: "Are coaching sessions online or in person?", answer: "All coaching sessions are conducted online via video call, allowing GreenElephant to work with clients across Europe and globally. Retreats are in-person events held in Finland and Provence." },
          { question: "What languages are coaching sessions available in?", answer: "Estève Pannetier coaches in English, Spanish, Catalan, and French. Anu Moisio hosts retreats in English and Finnish." }
        ]}
      />
      <HeroSection />
      <CompareAllSection />
      <EACoachingSection />
      <InterviewCoachingSection />
      <YourPathSection />
    </div>

    <div className="relative w-full bg-[#0a0a0a]">
      <div
        className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: '160px',
          background: `linear-gradient(to bottom,
            #0a0a0a                  0%,
            rgba(10,10,10,0.88)     22%,
            rgba(10,10,10,0.60)     46%,
            rgba(10,10,10,0.24)     72%,
            transparent            100%
          )`,
        }}
      />
      <img
        src={archipelagoUrl}
        alt="Finnish Archipelago"
        className="w-full h-auto block"
      />
      <div
        className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: '160px',
          background: `linear-gradient(to top,
            #000000                  0%,
            rgba(0,0,0,0.88)        22%,
            rgba(0,0,0,0.60)        46%,
            rgba(0,0,0,0.24)        72%,
            transparent            100%
          )`,
        }}
      />
      <div className="absolute bottom-4 left-0 right-0 z-20 text-center">
        <p className="text-white/65 text-xs tracking-wide">Finnish Archipelago</p>
      </div>
    </div>

    <section className="relative py-16" data-testid="section-programs-trust">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-white/10 p-8 md:p-12"
          style={{ background: "linear-gradient(135deg, rgba(0,153,153,0.08) 0%, rgba(232,200,64,0.08) 100%)" }}
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-needs/15 border border-needs/30 mb-6">
              <Shield className="w-7 h-7 text-needs" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" data-testid="text-programs-guarantee-title">
              14-Day Satisfaction Guarantee
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-6">
              Every program comes with our 14-day money-back guarantee. If you don't find actionable value in your first 14 days, get a full refund. No questions asked.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link href="/checkout?product=satellitescan">
                <Button size="lg" className="bg-needs text-white" data-testid="button-programs-guarantee-cta">
                  Start Risk-Free — €99.95
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
              <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Secure checkout</span>
              <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> GDPR compliant</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> All programs included</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    <Footer />

    <StickyMobileCTA
      price="From €99.95"
      label="Compare Programs"
      href="/programs#compare"
      sublabel="Find your perfect starting point"
    />
    </>
  );
}
