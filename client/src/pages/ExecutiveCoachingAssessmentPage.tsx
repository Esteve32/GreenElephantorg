import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Brain, Target, Sparkles, Zap, BarChart3, Users, Heart, Compass, Shield, Lock } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ScanVideoDemo } from "@/components/ScanVideoDemo";
import { DashboardPreview } from "@/components/DashboardPreview";
import earthOrbitUrl from "@assets/generated_images/earth_orbit_aurora_view.png";
import scanWalkthroughUrl from "@assets/VIdeo_walkthrough_Satellite_Scan_1773664135382.mp4";

const ASSESSMENT_USES = [
  {
    title: "Stop Spending Session 1-3 Just Figuring Out What to Work On",
    description: "Most coaching starts with 'tell me about yourself.' The Scan gives your coach a complete communication map before you even meet — so session one is about solving, not discovering.",
    icon: BarChart3
  },
  {
    title: "Your Coach Sees What You Can't Describe",
    description: "You know something's off in your leadership communication, but you can't quite name it. Your dashboard shows your coach the exact lens where your pattern breaks down — Ego under pressure, Alignment in conflict, Flow in groups.",
    icon: Target
  },
  {
    title: "Measure Whether Coaching Is Actually Working",
    description: "Retake the Scan after 6 months. If your Influence score went from 4.2 to 7.1, that's not a feeling — it's proof. Your coach can show concrete ROI to whoever's funding your development.",
    icon: Compass
  },
  {
    title: "Keep Growing Between Sessions",
    description: "Your next tough conversation is Tuesday, not your next coaching session. The AI prompt library lets you rehearse using your specific patterns — so you're prepared for the real moment, not just the coaching moment.",
    icon: Brain
  }
];

const COACHING_BENEFITS = [
  "Walk into session one with a map, not a monologue — your coach sees your patterns before you explain them",
  "Stop circling the same issues for months — your dashboard pinpoints the 2-3 lenses where change will compound fastest",
  "Show your sponsor concrete ROI — retake in 6 months and compare scores lens by lens",
  "Prepare for Tuesday's difficult conversation, not just Thursday's coaching session — 10+ AI prompts built from your data",
  "Know whether you dominate or withdraw in conflict before it costs you a relationship or a deal",
  "Works alongside any coaching methodology — ICF, systemic, psychodynamic — the data adds precision, not conflict"
];

const FAQ_ITEMS = [
  {
    question: "What is the Satellite Scan for executive coaching?",
    answer: "The Satellite Scan is a 90-minute self-assessment that maps your communication patterns across 8 lenses. It provides a data-driven baseline that coaches can use to accelerate their work with you. You'll receive a personalized dashboard within 48-72 hours."
  },
  {
    question: "How much does it cost?",
    answer: "The Satellite Scan costs €99.95. If you're also looking for coaching, our Coaching Journey (€2,980) includes the Satellite Scan plus ongoing 1:1 coaching sessions over 6 months."
  },
  {
    question: "Can I share results with my existing coach?",
    answer: "Absolutely. Your dashboard is designed to be shared. Many clients use the Satellite Scan with their current executive coach, therapist, or mentor to provide objective baseline data."
  },
  {
    question: "How is this different from 360 feedback?",
    answer: "The Satellite Scan is self-report only—it captures how you perceive your own patterns. This complements 360 feedback by revealing the gap between self-perception and external perception."
  }
];

export default function ExecutiveCoachingAssessmentPage() {
  return (
    <div className="min-h-screen">
      <SEO 
        title="Executive Coaching Assessment | Communication Diagnostic for Leaders"
        description="Data-driven communication assessment for executive coaching. Establish a baseline, track progress, and accelerate your coaching journey. 8 lenses, 129 questions. €99.95."
        keywords="executive coaching assessment, leadership coaching tool, communication diagnostic for coaches, executive development assessment, coaching baseline assessment, leadership communication evaluation"
        canonicalPath="/executive-coaching-assessment"
        faqItems={FAQ_ITEMS}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Executive Coaching Assessment", url: "/executive-coaching-assessment" }
        ]}
      />
      
      <section 
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        style={{ background: "#0a0a0a" }}
        data-testid="section-coaching-assessment-hero"
      >
        <motion.div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${earthOrbitUrl})` }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(59,125,216,0.05) 50%, #0a0a0a 100%)" }} />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-ego/20 text-ego border-ego/30">
              Executive Coaching Tool
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6" data-testid="text-coaching-assessment-title">
              Stop Guessing.<br />
              <span className="text-ego">Start Coaching with Data.</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Most coaching starts with three sessions of 'tell me about yourself.' The Satellite Scan gives your coach a complete communication map before you even meet — so every hour counts from day one.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signals">
                <Button size="lg" className="bg-ego text-white" data-testid="button-assessment-start">
                  Free 2-Min Quick Check
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/checkout?product=satellitescan">
                <Button size="lg" variant="outline" className="border-white/30 text-white" data-testid="button-assessment-full-scan">
                  Full Satellite Scan (€99.95)
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/coaching">
                <Button size="lg" variant="outline" className="border-white/30 text-white" data-testid="button-assessment-coaching">
                  Explore Coaching Programs
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <DashboardPreview accentColor="#3b7dd8" testIdPrefix="coaching" />

      <section 
        className="py-24"
        style={{
          background: "linear-gradient(180deg, #0a0a0a 0%, #0a0c10 50%, #0a0a0a 100%)"
        }}
        data-testid="section-assessment-uses"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Coaches Want You to Take This First
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Coaching without a baseline is like navigating without a map. Here's how the Scan changes the game.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {ASSESSMENT_USES.map((use, index) => (
              <motion.div
                key={use.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-ego">
                        <use.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{use.title}</h3>
                        <p className="text-white/70">{use.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section 
        className="py-24"
        style={{
          background: "linear-gradient(180deg, #0a0a0a 0%, #0a0b0f 50%, #0a0a0a 100%)"
        }}
        data-testid="section-assessment-benefits"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-flow/20 text-flow border-flow/30">
                <Sparkles className="w-3 h-3 mr-1" />
                Coaching Accelerator
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                What Changes When You Have the Data
              </h2>
              <p className="text-white/70 mb-8">
                Coaching is €295 per session. Every hour you spend discovering instead of developing is money left on the table. The Scan front-loads the discovery.
              </p>
              <ul className="space-y-4">
                {COACHING_BENEFITS.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-flow mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Card className="bg-gradient-to-br from-ego/20 to-flow/20 border-white/10">
                <CardContent className="p-8">
                  <div className="text-6xl font-bold text-white mb-2">€99.95</div>
                  <p className="text-white/70 mb-6">Your Coaching Baseline</p>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-white/80">
                      <Brain className="w-4 h-4 text-ego" />
                      129 questions across Influence, Ego, Flow + 5 more lenses
                    </li>
                    <li className="flex items-center gap-2 text-white/80">
                      <BarChart3 className="w-4 h-4 text-ego" />
                      Dashboard you can share with your coach immediately
                    </li>
                    <li className="flex items-center gap-2 text-white/80">
                      <Zap className="w-4 h-4 text-ego" />
                      10+ AI prompts to practice between sessions
                    </li>
                  </ul>
                  <Link href="/signals">
                    <Button size="lg" className="w-full bg-ego text-white" data-testid="button-assessment-cta">
                      Take the Free Quick Check
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <p className="text-white/50 text-sm mt-4">
                    Or explore our <Link href="/coaching" className="text-ego underline">Coaching Journey</Link> (€2,980)
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <ScanVideoDemo
        accentColor="#3b7dd8"
        badgeText="See It In Action"
        headline="Watch the Full Scan Experience"
        subheadline="A 5-minute silent walkthrough — see exactly what the coaching assessment looks like and how your results are presented."
        ctaLink="/checkout?product=satellitescan"
        ctaText="Start Your Scan — €99.95"
        testIdPrefix="coaching"
        videoSrc={scanWalkthroughUrl}
        gradientFrom="#0a0a0a"
        gradientTo="#0a0a0a"
      />

      <section
        className="py-20"
        style={{
          background: "#0a0a0a"
        }}
        data-testid="section-assessment-value-ladder"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-flow/20 text-flow border-flow/30">Next Steps</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" data-testid="text-assessment-value-ladder-title">
              Your Coaching Journey Starts Here
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              The Satellite Scan is the foundation. Use it alone for self-coaching, or pair it with professional coaching for deeper transformation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Self-Guided",
                price: "€99.95",
                desc: "Scan + AI prompts. Perfect for self-coaching between sessions.",
                items: ["Personalized dashboard", "10+ AI coaching prompts", "Video coaching library"],
                link: "/checkout?product=satellitescan",
                color: "#009999",
                cta: "Get Your Scan",
              },
              {
                title: "Single Deep-Dive",
                price: "€295",
                desc: "One 120-min session to unpack your scan results with a coach.",
                items: ["Everything in Self-Guided", "120-min 1:1 coaching", "3 micro-habits action plan"],
                link: "/coaching",
                color: "#33a854",
                cta: "Book a Session",
              },
              {
                title: "Full Journey",
                price: "€2,980",
                desc: "6 months of biweekly coaching. Includes Satellite Scan.",
                items: ["Everything in Deep-Dive", "Biweekly sessions", "Unlimited check-ins", "Coaching until goals met"],
                link: "/coaching",
                color: "#e8c840",
                cta: "Start the Journey",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 h-full flex flex-col" data-testid={`card-assessment-path-${i}`}>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="w-3 h-3 rounded-full mb-3" style={{ backgroundColor: item.color }} />
                    <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-2xl font-bold text-white mb-2">{item.price}</p>
                    <p className="text-sm text-white/60 mb-4">{item.desc}</p>
                    <ul className="space-y-2 mb-6 flex-1">
                      {item.items.map((li, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-white/70">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: item.color }} />
                          <span>{li}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={item.link}>
                      <Button className="w-full text-white" style={{ backgroundColor: item.color }} data-testid={`button-assessment-path-${i}`}>
                        {item.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section 
        className="py-24"
        style={{
          background: "linear-gradient(180deg, #0a0a0a 0%, #000000 100%)"
        }}
        data-testid="section-assessment-faq"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-6">
            {FAQ_ITEMS.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{item.question}</h3>
                    <p className="text-white/70">{item.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signals">
                <Button size="lg" className="bg-ego text-white" data-testid="button-assessment-final-cta">
                  Take the Free Quick Check
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/checkout?product=satellitescan">
                <Button size="lg" variant="outline" className="border-white/30 text-white" data-testid="button-assessment-final-scan">
                  Get the Full Satellite Scan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-16" data-testid="section-assessment-trust">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-white/10 p-8 md:p-12"
            style={{ background: "linear-gradient(135deg, rgba(59,125,216,0.08) 0%, rgba(0,153,153,0.08) 100%)" }}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-needs/15 border border-needs/30 mb-6">
                <Shield className="w-7 h-7 text-needs" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" data-testid="text-assessment-guarantee-title">
                14-Day Satisfaction Guarantee
              </h2>
              <p className="text-white/60 max-w-xl mx-auto mb-6">
                If the Satellite Scan doesn't give your coaching a measurable head start, receive a full refund within 14 days. Your data stays private and deleted on request.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <Link href="/checkout?product=satellitescan">
                  <Button size="lg" className="bg-needs text-white" data-testid="button-assessment-guarantee-cta">
                    Start Risk-Free — €99.95
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
                <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Secure checkout</span>
                <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> GDPR compliant</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Coach-ready reports</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <StickyMobileCTA
        price="Free Assessment"
        label="Start Now"
        href="/flowcheck"
        sublabel="Check your communication flow"
      />
    </div>
  );
}
