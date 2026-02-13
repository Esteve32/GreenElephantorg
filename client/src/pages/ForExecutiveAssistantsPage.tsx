import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { atmosphericPalette } from "@/constants/atmosphericGradient";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Users, MessageSquare, Shield, Sparkles, Brain, Target, Zap } from "lucide-react";
import { SEO } from "@/components/SEO";
import earthOrbitUrl from "@assets/generated_images/earth_orbit_aurora_view.png";

const EA_CHALLENGES = [
  {
    title: "Managing Up with Confidence",
    description: "Navigate conversations with executives without second-guessing yourself. Learn to communicate your needs while supporting theirs.",
    icon: Users
  },
  {
    title: "Complex Stakeholder Dynamics",
    description: "Balance competing priorities from multiple executives. Understand the unwritten rules of organizational communication.",
    icon: MessageSquare
  },
  {
    title: "Setting Boundaries Professionally",
    description: "Say no without damaging relationships. Protect your time while maintaining your reputation as reliable and supportive.",
    icon: Shield
  },
  {
    title: "Building Strategic Influence",
    description: "Move from task-taker to trusted advisor. Develop the communication patterns that earn you a seat at the table.",
    icon: Target
  }
];

const EA_BENEFITS = [
  "Map your communication patterns across 8 lenses including Dynamics, Alignment, and Needs",
  "Understand your default responses when executives make last-minute requests",
  "Identify why certain stakeholders trigger your stress response",
  "Discover your strengths in managing up and areas for growth",
  "Get personalized prompts for preparing for difficult conversations",
  "Track your growth over time with retake assessments"
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
        style={{
          background: `linear-gradient(180deg, ${atmosphericPalette.space} 0%, ${atmosphericPalette.highAtmosphere} 50%, ${atmosphericPalette.upperAtmosphere} 100%)`
        }}
        data-testid="section-ea-hero"
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
            <Badge className="mb-6 bg-dynamics/20 text-dynamics border-dynamics/30">
              For Executive Assistants
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6" data-testid="text-ea-title">
              Communication Training for<br />
              <span className="text-dynamics">Executive Assistants</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              You're the connective tissue of your organization. Master the communication patterns that transform you from task-taker to trusted strategic partner.
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

      <section 
        className="py-24"
        style={{
          background: `linear-gradient(180deg, ${atmosphericPalette.upperAtmosphere} 0%, ${atmosphericPalette.midAtmosphere} 100%)`
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
              The EA Communication Challenges
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Sound familiar? These are the patterns the Satellite Scan reveals.
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
          background: `linear-gradient(180deg, ${atmosphericPalette.midAtmosphere} 0%, ${atmosphericPalette.lowerAtmosphere} 100%)`
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
                Map Your Communication Patterns
              </h2>
              <p className="text-white/70 mb-8">
                The Satellite Scan reveals the unconscious patterns that shape every interaction with executives, colleagues, and stakeholders.
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
                  <p className="text-white/70 mb-6">Early Adopter Price</p>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-white/80">
                      <Brain className="w-4 h-4 text-dynamics" />
                      129 questions, 8 communication lenses
                    </li>
                    <li className="flex items-center gap-2 text-white/80">
                      <Target className="w-4 h-4 text-dynamics" />
                      Personalized dashboard in 48-72 hours
                    </li>
                    <li className="flex items-center gap-2 text-white/80">
                      <Zap className="w-4 h-4 text-dynamics" />
                      Access to prompt library
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

      <section 
        className="py-24"
        style={{
          background: `linear-gradient(180deg, ${atmosphericPalette.lowerAtmosphere} 0%, #000000 100%)`
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
            className="text-center mt-12"
          >
            <Link href="/scan">
              <Button size="lg" className="bg-dynamics text-white" data-testid="button-ea-final-cta">
                Start Your Satellite Scan Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
