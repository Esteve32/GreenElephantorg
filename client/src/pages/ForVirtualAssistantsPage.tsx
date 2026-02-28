import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { atmosphericPalette } from "@/constants/atmosphericGradient";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Globe, Clock, MessageSquare, Shield, Sparkles, Brain, Target, Zap, Users } from "lucide-react";
import { SEO } from "@/components/SEO";
import earthOrbitUrl from "@assets/generated_images/earth_orbit_aurora_view.png";

const VA_CHALLENGES = [
  {
    title: "Async Communication Mastery",
    description: "Bridge time zones and communication gaps. Learn to convey tone, urgency, and context when you can't rely on real-time conversations.",
    icon: Clock
  },
  {
    title: "Client Boundary Setting",
    description: "Manage multiple clients without burning out. Develop clear communication patterns that protect your time while exceeding expectations.",
    icon: Shield
  },
  {
    title: "Building Trust Remotely",
    description: "Create the same level of trust and rapport you'd build in person. Master the subtle cues that make clients feel truly supported.",
    icon: Users
  },
  {
    title: "Context Switching",
    description: "Move between different clients, industries, and communication styles without dropping the ball. Stay mentally agile and present.",
    icon: Globe
  }
];

const VA_BENEFITS = [
  "Map your communication patterns across 8 lenses including Dynamics, Needs, and Flow",
  "Understand how you adapt your style for different client personalities",
  "Identify your default patterns when handling urgent async requests",
  "Discover your strengths in remote relationship building",
  "Get personalized prompts for difficult client conversations",
  "Track your growth over time with retake assessments"
];

const FAQ_ITEMS = [
  {
    question: "What is the Satellite Scan for Virtual Assistants?",
    answer: "The Satellite Scan is a 90-minute self-reflection tool that maps your communication patterns across 8 lenses. For VAs, it reveals how you navigate remote client relationships, handle async communication, and manage multiple stakeholder needs. You'll receive a personalized dashboard within 48-72 hours."
  },
  {
    question: "How much does the assessment cost?",
    answer: "The Satellite Scan costs €99.95 as an early adopter price. This includes the 129-question assessment, personalized dashboard, and access to our prompt library for ongoing professional development."
  },
  {
    question: "How is this different from standard VA training?",
    answer: "Most VA training focuses on tools and processes. The Satellite Scan goes deeper—it reveals your unconscious communication patterns, helping you understand why some client relationships flow naturally while others feel like constant friction."
  },
  {
    question: "Can this help me raise my rates?",
    answer: "Absolutely. VAs who understand their communication style can articulate their value more clearly, set better boundaries, and build the kind of client relationships that lead to referrals and rate increases. Self-awareness is the foundation of professional growth."
  },
  {
    question: "I work with clients in different time zones. Is this relevant?",
    answer: "Yes. The Flow and Dynamics lenses specifically address how you handle async communication, context switching, and building rapport without real-time interaction—the exact challenges of remote VA work."
  }
];

export default function ForVirtualAssistantsPage() {
  return (
    <div className="min-h-screen">
      <SEO 
        title="Communication Training for Virtual Assistants | Satellite Scan"
        description="Communication assessment designed for Virtual Assistants. Map your async communication patterns, client boundary-setting, and remote relationship building across 8 lenses. €99.95 with personalized insights."
        keywords="virtual assistant communication training, VA professional development, remote communication skills, virtual assistant coaching, freelance VA training, online assistant skills, async communication mastery"
        canonicalPath="/for-virtual-assistants"
        faqItems={FAQ_ITEMS}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "For Virtual Assistants", url: "/for-virtual-assistants" }
        ]}
      />
      
      <section 
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${atmosphericPalette.space} 0%, ${atmosphericPalette.highAtmosphere} 50%, ${atmosphericPalette.upperAtmosphere} 100%)`
        }}
        data-testid="section-va-hero"
      >
        <motion.div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${earthOrbitUrl})` }}
        />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-flow/20 text-flow border-flow/30">
              For Virtual Assistants
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6" data-testid="text-va-title">
              Communication Training for<br />
              <span className="text-flow">Virtual Assistants</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              You bridge time zones, manage multiple clients, and build trust without ever meeting in person. Master the communication patterns that make remote relationships thrive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/scan">
                <Button size="lg" className="bg-flow text-white" data-testid="button-va-start-scan">
                  Start Your Satellite Scan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/coaching">
                <Button size="lg" variant="outline" className="border-white/30 text-white" data-testid="button-va-coaching">
                  Explore VA Coaching
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section 
        className="py-24"
        style={{
          background: `linear-gradient(180deg, ${atmosphericPalette.upperAtmosphere} 0%, ${atmosphericPalette.midAtmosphere} 100%)`
        }}
        data-testid="section-va-challenges"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The VA Communication Challenges
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Sound familiar? These are the patterns the Satellite Scan reveals.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {VA_CHALLENGES.map((challenge, index) => (
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
                      <div className="p-3 rounded-lg bg-flow">
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
          background: `linear-gradient(180deg, ${atmosphericPalette.midAtmosphere} 0%, ${atmosphericPalette.lowerAtmosphere} 100%)`
        }}
        data-testid="section-va-benefits"
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
                Map Your Communication Patterns
              </h2>
              <p className="text-white/70 mb-8">
                The Satellite Scan reveals the unconscious patterns that shape every client interaction, every Slack message, and every boundary conversation.
              </p>
              <ul className="space-y-4">
                {VA_BENEFITS.map((benefit, index) => (
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
              <Card className="bg-gradient-to-br from-flow/20 to-needs/20 border-white/10">
                <CardContent className="p-8">
                  <div className="text-6xl font-bold text-white mb-2">€99.95</div>
                  <p className="text-white/70 mb-6">Early Adopter Price</p>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-white/80">
                      <Brain className="w-4 h-4 text-flow" />
                      129 questions, 8 communication lenses
                    </li>
                    <li className="flex items-center gap-2 text-white/80">
                      <Target className="w-4 h-4 text-flow" />
                      Personalized dashboard in 48-72 hours
                    </li>
                    <li className="flex items-center gap-2 text-white/80">
                      <Zap className="w-4 h-4 text-flow" />
                      Access to prompt library
                    </li>
                  </ul>
                  <Link href="/scan">
                    <Button size="lg" className="w-full bg-flow text-white" data-testid="button-va-cta">
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

      <section 
        className="py-24"
        style={{
          background: `linear-gradient(180deg, ${atmosphericPalette.lowerAtmosphere} 0%, #000000 100%)`
        }}
        data-testid="section-va-faq"
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
              <Button size="lg" className="bg-flow text-white" data-testid="button-va-final-cta">
                Start Your Satellite Scan Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <Link href="/signals">
                <Button variant="outline" className="text-white border-white/20 backdrop-blur-sm" data-testid="link-va-quiz">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Free 2-Min Quick Check
                </Button>
              </Link>
              <Link href="/webinar">
                <Button variant="outline" className="text-white border-white/20 backdrop-blur-sm" data-testid="link-va-webinar">
                  <Zap className="mr-2 h-4 w-4" />
                  Join Free Monthly Webinar
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
