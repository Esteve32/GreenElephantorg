import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Users, TrendingUp, Target, Sparkles, Brain, Zap, Crown, BarChart3, Shield, Lock } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ScanVideoDemo } from "@/components/ScanVideoDemo";
import { DashboardPreview } from "@/components/DashboardPreview";
import earthOrbitUrl from "@assets/generated_images/earth_orbit_aurora_view.png";
import scanWalkthroughUrl from "@assets/VIdeo_walkthrough_Satellite_Scan_1773664135382.mp4";

const CEO_CHALLENGES = [
  {
    title: "Your Team Agrees — Then Nothing Changes",
    description: "Everyone nods in the meeting, but execution stalls. The Scan reveals whether your Alignment score drops under pressure — the gap between what you think you communicated and what actually landed.",
    icon: Users
  },
  {
    title: "High-Stakes Moments Flip Your Style",
    description: "A board member challenges your forecast. Do you dominate, deflect, or shut down? The Scan measures how stress shifts your Influence and Ego patterns — so you can lead the room instead of reacting to it.",
    icon: Crown
  },
  {
    title: "Investor Conversations Feel Like Tightropes",
    description: "Too transparent and you spook them. Too confident and you lose credibility. The Scan maps your balance between Chaordic flexibility and structured Influence — the exact skill that separates good CEOs from great ones.",
    icon: TrendingUp
  },
  {
    title: "Nobody Tells You the Truth Anymore",
    description: "Your COO won't say your town halls feel scripted. Your VP won't mention you talk over people. The Scan is the honest mirror your position makes impossible to find — 129 questions that surface what others won't.",
    icon: Target
  }
];

const CEO_BENEFITS = [
  "See why your direct reports agree in meetings but don't follow through — your Alignment score reveals the gap",
  "Know exactly which patterns fire when a board member challenges you — Influence, Ego, or withdrawal",
  "Understand why some 1:1s energize your team and others drain them — your Flow pattern holds the answer",
  "Spot the moment your communication shifts from inspiring to controlling — it happens under stress, and now you'll see it",
  "Walk into your next executive coaching session with a clear map, not vague feelings about 'needing to improve'",
  "Retake in 6 months and see exactly where your leadership communication has shifted"
];

const FAQ_ITEMS = [
  {
    question: "What is the Satellite Scan for CEOs?",
    answer: "The Satellite Scan is a 90-minute self-assessment that maps your leadership communication patterns across 8 lenses. It reveals how you influence, build alignment, and navigate high-stakes conversations. You'll receive a personalized dashboard within 48-72 hours."
  },
  {
    question: "How much does it cost?",
    answer: "The Satellite Scan costs €99.95 as an early adopter price. Many CEOs combine this with our Coaching Journey (€2,980) for ongoing leadership communication development."
  },
  {
    question: "How does this help with team alignment?",
    answer: "The Alignment and Influence lenses reveal how you communicate expectations, handle disagreement, and build shared understanding. You'll see where miscommunication patterns create organizational friction."
  },
  {
    question: "Is this confidential?",
    answer: "Absolutely. Your data is encrypted and never shared. Only you and your coach (if you choose coaching) can access your results. Many CEOs use this as a private development tool."
  }
];

export default function ForCEOsPage() {
  return (
    <div className="min-h-screen">
      <SEO 
        title="CEO Communication Coaching | Leadership Communication Assessment"
        description="Communication diagnostic for CEOs and executives. Map your leadership patterns across Influence, Alignment, and team dynamics. Data-driven insights for executive presence. €99.95."
        keywords="CEO communication coaching, executive communication assessment, leadership communication, executive presence training, CEO leadership development, team alignment diagnostic, executive coaching tools"
        canonicalPath="/for-ceos"
        faqItems={FAQ_ITEMS}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "For CEOs", url: "/for-ceos" }
        ]}
      />
      
      <section 
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        style={{ background: "#0a0a0a" }}
        data-testid="section-ceo-hero"
      >
        <motion.div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${earthOrbitUrl})` }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(204,51,51,0.06) 50%, #0a0a0a 100%)" }} />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-influence/20 text-influence border-influence/30">
              For CEOs & Executives
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6" data-testid="text-ceo-title">
              Know Why Your Message<br />
              <span className="text-influence">Isn't Landing</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Your team says yes but nothing changes. Your board pushes back and you're not sure why. The Satellite Scan shows you exactly which communication patterns fire under pressure — and what to do about them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signals">
                <Button size="lg" className="bg-influence text-white" data-testid="button-ceo-start-scan">
                  Free 2-Min Leadership Check
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/checkout?product=satellitescan">
                <Button size="lg" variant="outline" className="border-white/30 text-white" data-testid="button-ceo-full-scan">
                  Full Satellite Scan (€99.95)
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/coaching">
                <Button size="lg" variant="outline" className="border-white/30 text-white" data-testid="button-ceo-coaching">
                  Executive Coaching
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <DashboardPreview accentColor="#cc3333" testIdPrefix="ceo" />

      <section 
        className="py-24"
        style={{
          background: "linear-gradient(180deg, #0a0a0a 0%, #0d0b0b 50%, #0a0a0a 100%)"
        }}
        data-testid="section-ceo-challenges"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Sound Familiar?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              These are the moments where communication patterns quietly cost you trust, alignment, and execution speed.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {CEO_CHALLENGES.map((challenge, index) => (
              <motion.div
                key={challenge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-influence">
                        <challenge.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{challenge.title}</h3>
                        <p className="text-white/70">{challenge.description}</p>
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
          background: "linear-gradient(180deg, #0a0a0a 0%, #0c0909 50%, #0a0a0a 100%)"
        }}
        data-testid="section-ceo-benefits"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-alignment/20 text-alignment border-alignment/30">
                <Sparkles className="w-3 h-3 mr-1" />
                What You'll Discover
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                What Your Dashboard Reveals
              </h2>
              <p className="text-white/70 mb-8">
                In 48-72 hours, you'll have a personalized leadership communication map. Not abstract theory — concrete patterns you can act on Monday morning.
              </p>
              <ul className="space-y-4">
                {CEO_BENEFITS.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-alignment mt-0.5 flex-shrink-0" />
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
              <Card className="bg-gradient-to-br from-influence/20 to-alignment/20 border-white/10">
                <CardContent className="p-8">
                  <div className="text-6xl font-bold text-white mb-2">€99.95</div>
                  <p className="text-white/70 mb-6">Your Leadership Communication Map</p>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-white/80">
                      <Brain className="w-4 h-4 text-influence" />
                      129 questions across Influence, Ego, Alignment + 5 more
                    </li>
                    <li className="flex items-center gap-2 text-white/80">
                      <BarChart3 className="w-4 h-4 text-influence" />
                      Visual dashboard delivered in 48-72 hours
                    </li>
                    <li className="flex items-center gap-2 text-white/80">
                      <Zap className="w-4 h-4 text-influence" />
                      AI prompts to prepare for specific tough conversations
                    </li>
                  </ul>
                  <Link href="/signals">
                    <Button size="lg" className="w-full bg-influence text-white" data-testid="button-ceo-cta">
                      Take the Free Quick Check
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <ScanVideoDemo
        accentColor="#cc3333"
        badgeText="See It In Action"
        headline="Watch the Full Scan Experience"
        subheadline="A 5-minute silent walkthrough — see exactly how the Satellite Scan works and what your leadership dashboard looks like."
        ctaLink="/checkout?product=satellitescan"
        ctaText="Start Your Scan — €99.95"
        testIdPrefix="ceo"
        videoSrc={scanWalkthroughUrl}
        gradientFrom="#0a0a0a"
        gradientTo="#0a0a0a"
      />

      <section
        className="py-20"
        style={{
          background: "#0a0a0a"
        }}
        data-testid="section-ceo-value-ladder"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-influence/20 text-influence border-influence/30">Your Path</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" data-testid="text-ceo-value-ladder-title">
              Start Here, Lead from Here
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Choose the depth that matches your leadership development goal.
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Free Leadership Quick Check",
                desc: "2 minutes. See which communication patterns shape your leadership style.",
                price: "Free",
                link: "/signals",
                color: "#8899aa",
              },
              {
                step: "2",
                title: "Satellite Scan",
                desc: "Full 129-question assessment. The honest mirror that leadership isolation makes difficult to find elsewhere.",
                price: "€99.95",
                link: "/checkout?product=satellitescan",
                color: "#009999",
              },
              {
                step: "3",
                title: "Executive Coaching Journey",
                desc: "Biweekly sessions. Ongoing support. Includes Satellite Scan. Coaching until your leadership goals are met.",
                price: "€2,980",
                link: "/coaching",
                color: "#e8c840",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={item.link}>
                  <Card className="bg-white/5 border-white/10 hover-elevate cursor-pointer" data-testid={`card-ceo-step-${item.step}`}>
                    <CardContent className="p-5 flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold"
                        style={{ backgroundColor: `${item.color}30`, border: `1px solid ${item.color}50` }}
                      >
                        {item.step}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white">{item.title}</p>
                        <p className="text-sm text-white/60">{item.desc}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="font-bold text-white">{item.price}</span>
                        <ArrowRight className="w-4 h-4 text-white/40" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
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
        data-testid="section-ceo-faq"
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
                <Button size="lg" className="bg-influence text-white" data-testid="button-ceo-final-cta">
                  Free 2-Min Leadership Check
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/checkout?product=satellitescan">
                <Button size="lg" variant="outline" className="border-white/30 text-white" data-testid="button-ceo-full-scan-bottom">
                  Full Satellite Scan (€99.95)
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-16" data-testid="section-ceo-trust">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-white/10 p-8 md:p-12"
            style={{ background: "linear-gradient(135deg, rgba(204,51,51,0.08) 0%, rgba(0,153,153,0.08) 100%)" }}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-needs/15 border border-needs/30 mb-6">
                <Shield className="w-7 h-7 text-needs" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" data-testid="text-ceo-guarantee-title">
                14-Day Satisfaction Guarantee
              </h2>
              <p className="text-white/60 max-w-xl mx-auto mb-6">
                If the Satellite Scan doesn't deliver actionable insight for your leadership communication, receive a full refund within 14 days. No questions asked.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <Link href="/checkout?product=satellitescan">
                  <Button size="lg" className="bg-needs text-white" data-testid="button-ceo-guarantee-cta">
                    Start Risk-Free — €99.95
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
                <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Secure checkout</span>
                <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> GDPR compliant</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Executive-level privacy</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <StickyMobileCTA
        price="€99.95"
        label="Start with a Scan"
        href="/checkout?product=satellitescan"
        sublabel="Leadership communication diagnostic"
      />
    </div>
  );
}
