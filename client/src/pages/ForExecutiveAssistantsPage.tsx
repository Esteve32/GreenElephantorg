import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Users, MessageSquare, Shield, Sparkles, Brain, Target, Zap, Lock } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ScanVideoDemo } from "@/components/ScanVideoDemo";
import { DashboardPreview } from "@/components/DashboardPreview";
import earthOrbitUrl from "@assets/generated_images/earth_orbit_aurora_view.png";
import scanWalkthroughUrl from "@assets/VIdeo_walkthrough_Satellite_Scan_1773664135382.mp4";

const EA_CHALLENGES = [
  {
    title: "Your Executive Changes the Plan — Again",
    description: "It's 4pm and the schedule just flipped. Your Needs score reveals whether you absorb the chaos silently or push back — and why you default to one over the other every time.",
    icon: Users
  },
  {
    title: "Two Executives Want Opposite Things",
    description: "The CEO wants you to prioritize the board deck. The CFO needs travel booked now. The Scan maps your Dynamics pattern — how you navigate competing authority without burning either relationship.",
    icon: MessageSquare
  },
  {
    title: "You Said Yes When You Meant No",
    description: "Another weekend commitment you didn't want. Your Alignment and Needs lenses show exactly where your boundary-setting breaks down — and it's not about willpower, it's about communication patterns.",
    icon: Shield
  },
  {
    title: "You're Trusted — But Not Heard",
    description: "You see the problem before anyone else does, but struggle to say it in a way that lands. Your Influence score reveals why your strategic thinking isn't translating into strategic authority.",
    icon: Target
  }
];

const EA_BENEFITS = [
  "See your exact pattern when your executive makes a last-minute demand — do you absorb, push back, or freeze?",
  "Know why that one VP always triggers your stress response — your Dynamics lens shows the power pattern at play",
  "Understand why you're great at logistics but struggle to speak up in leadership meetings — your Influence gap is measurable",
  "Get AI prompts to rehearse tomorrow's difficult conversation — not generic advice, but prompts based on your specific patterns",
  "Discover whether you're a natural boundary-setter who over-compensates, or a people-pleaser who burns out — the Needs lens tells you",
  "Retake in 6 months and see concrete growth in the areas that matter most to your career"
];

const FAQ_ITEMS = [
  {
    question: "What is the Satellite Scan for Executive Assistants?",
    answer: "The Satellite Scan is a 90-minute self-reflection tool that maps your communication patterns across 8 lenses. For EAs, it reveals how you navigate executive relationships, manage stakeholder dynamics, and handle high-pressure situations. You'll receive a personalized dashboard within 48-72 hours."
  },
  {
    question: "How much does it cost?",
    answer: "The Satellite Scan costs €99.95 as an early adopter price. This includes the 129-question assessment, personalized dashboard, and access to our prompt library for ongoing development."
  },
  {
    question: "How is this different from personality tests?",
    answer: "Unlike MBTI or DiSC that assign fixed labels, the Satellite Scan captures your communication preferences in context. Your patterns can shift based on who you're talking to and what's at stake—this tool reveals those nuances."
  },
  {
    question: "Can this help with my relationship with a difficult executive?",
    answer: "Yes. The Dynamics and Needs lenses specifically reveal how you navigate power dynamics and unmet needs in relationships. Combined with our prompt library, you can prepare for specific stakeholder conversations."
  }
];

export default function ForExecutiveAssistantsPage() {
  return (
    <div className="min-h-screen">
      <SEO 
        title="Communication Training for Executive Assistants | Satellite Scan"
        description="Communication assessment designed for Executive Assistants. Map your managing up patterns, stakeholder dynamics, and boundary-setting across 8 lenses. €99.95 with personalized insights."
        keywords="executive assistant communication training, EA professional development, managing up communication, assistant leadership communication, executive assistant coaching, EA training program, virtual assistant skills"
        canonicalPath="/for-executive-assistants"
        faqItems={FAQ_ITEMS}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "For Executive Assistants", url: "/for-executive-assistants" }
        ]}
      />
      
      <section 
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        style={{ background: "#0a0a0a" }}
        data-testid="section-ea-hero"
      >
        <motion.div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${earthOrbitUrl})` }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(153,51,204,0.05) 50%, #0a0a0a 100%)" }} />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-dynamics/20 text-dynamics border-dynamics/30">
              For Executive Assistants
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6" data-testid="text-ea-title">
              Stop Being the One Who<br />
              <span className="text-dynamics">Always Says Yes</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              You keep the wheels turning for everyone else — but who's looking out for your communication patterns? The Satellite Scan shows you exactly where you lose your voice, your boundaries, and your strategic edge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/scan">
                <Button size="lg" className="bg-dynamics text-white" data-testid="button-ea-start-scan">
                  Start Your Satellite Scan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/programs#ea-coaching">
                <Button size="lg" variant="outline" className="border-white/30 text-white" data-testid="button-ea-coaching">
                  Explore EA Coaching
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <DashboardPreview accentColor="#9933cc" testIdPrefix="ea" />

      <section 
        className="py-24"
        style={{
          background: "linear-gradient(180deg, #0a0a0a 0%, #0c0a0e 50%, #0a0a0a 100%)"
        }}
        data-testid="section-ea-challenges"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              This Happens Every Week
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              You know these moments. The Scan shows you why they keep happening — and what to do differently.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {EA_CHALLENGES.map((challenge, index) => (
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
                      <div className="p-3 rounded-lg bg-dynamics">
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
          background: "linear-gradient(180deg, #0a0a0a 0%, #0b0a0d 50%, #0a0a0a 100%)"
        }}
        data-testid="section-ea-benefits"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-needs/20 text-needs border-needs/30">
                <Sparkles className="w-3 h-3 mr-1" />
                What You'll Discover
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                What Your Dashboard Reveals
              </h2>
              <p className="text-white/70 mb-8">
                In 48-72 hours, you get a personalized map of your communication patterns — not theory, but specific insights you can use in your next executive conversation.
              </p>
              <ul className="space-y-4">
                {EA_BENEFITS.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-needs mt-0.5 flex-shrink-0" />
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
              <Card className="bg-gradient-to-br from-dynamics/20 to-needs/20 border-white/10">
                <CardContent className="p-8">
                  <div className="text-6xl font-bold text-white mb-2">€99.95</div>
                  <p className="text-white/70 mb-6">Your Communication Map</p>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-white/80">
                      <Brain className="w-4 h-4 text-dynamics" />
                      129 questions across Dynamics, Needs, Alignment + 5 more
                    </li>
                    <li className="flex items-center gap-2 text-white/80">
                      <Target className="w-4 h-4 text-dynamics" />
                      Visual dashboard delivered in 48-72 hours
                    </li>
                    <li className="flex items-center gap-2 text-white/80">
                      <Zap className="w-4 h-4 text-dynamics" />
                      AI prompts for managing up and setting boundaries
                    </li>
                  </ul>
                  <Link href="/scan">
                    <Button size="lg" className="w-full bg-dynamics text-white" data-testid="button-ea-cta">
                      Start Your Assessment
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
        accentColor="#9933cc"
        badgeText="See It In Action"
        headline="Watch the Full Scan Experience"
        subheadline="A 5-minute silent walkthrough — see how the Satellite Scan maps your communication patterns and what your personalized dashboard looks like."
        ctaLink="/checkout?product=satellitescan"
        ctaText="Start Your Scan — €99.95"
        testIdPrefix="ea"
        videoSrc={scanWalkthroughUrl}
        gradientFrom="#0a0a0a"
        gradientTo="#0a0a0a"
      />

      <section
        className="py-20"
        style={{
          background: "#0a0a0a"
        }}
        data-testid="section-ea-value-ladder"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-dynamics/20 text-dynamics border-dynamics/30">Your Path</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" data-testid="text-ea-value-ladder-title">
              Start Here, Grow from Here
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Every EA's journey is different. Choose the depth that matches where you are right now.
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Free 2-Min Quick Check",
                desc: "See if communication patterns resonate with your experience. No sign-up needed.",
                price: "Free",
                link: "/signals",
                color: "#8899aa",
              },
              {
                step: "2",
                title: "Satellite Scan",
                desc: "Full 129-question assessment with personalized dashboard. Your communication map across 8 lenses.",
                price: "€99.95",
                link: "/checkout?product=satellitescan",
                color: "#009999",
              },
              {
                step: "3",
                title: "Coaching Journey",
                desc: "Biweekly sessions, ongoing messaging support, and micro-habit coaching. Includes Satellite Scan.",
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
                  <Card className="bg-white/5 border-white/10 hover-elevate cursor-pointer" data-testid={`card-ea-step-${item.step}`}>
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
        data-testid="section-ea-faq"
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
            className="text-center mt-12 flex flex-col items-center gap-4"
          >
            <Link href="/scan">
              <Button size="lg" className="bg-dynamics text-white" data-testid="button-ea-final-cta">
                Start Your Satellite Scan Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <Link href="/signals">
                <Button variant="outline" className="text-white border-white/20 backdrop-blur-sm" data-testid="link-ea-quiz">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Free 2-Min Quick Check
                </Button>
              </Link>
              <Link href="/webinar">
                <Button variant="outline" className="text-white border-white/20 backdrop-blur-sm" data-testid="link-ea-webinar">
                  <Zap className="mr-2 h-4 w-4" />
                  Join Free Monthly Webinar
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-16" data-testid="section-ea-trust">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-white/10 p-8 md:p-12"
            style={{ background: "linear-gradient(135deg, rgba(0,153,153,0.08) 0%, rgba(51,168,84,0.08) 100%)" }}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-needs/15 border border-needs/30 mb-6">
                <Shield className="w-7 h-7 text-needs" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" data-testid="text-ea-guarantee-title">
                14-Day Satisfaction Guarantee
              </h2>
              <p className="text-white/60 max-w-xl mx-auto mb-6">
                If the Satellite Scan doesn't reveal actionable communication insights for your EA role, get a full refund within 14 days. Your investment is protected.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <Link href="/checkout?product=satellitescan">
                  <Button size="lg" className="bg-needs text-white" data-testid="button-ea-guarantee-cta">
                    Start Risk-Free — €99.95
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
                <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Secure checkout</span>
                <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> GDPR compliant</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Role-specific insights</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <StickyMobileCTA
        price="€99.95"
        label="Start with a Scan"
        href="/checkout?product=satellitescan"
        sublabel="Communication diagnostic for EAs"
      />
    </div>
  );
}
