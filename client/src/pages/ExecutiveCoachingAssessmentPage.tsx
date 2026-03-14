import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { atmosphericPalette } from "@/constants/atmosphericGradient";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Brain, Target, Sparkles, Zap, BarChart3, Users, Heart, Compass } from "lucide-react";
import { SEO } from "@/components/SEO";
import earthOrbitUrl from "@assets/generated_images/earth_orbit_aurora_view.png";

const ASSESSMENT_USES = [
  {
    title: "Pre-Coaching Baseline",
    description: "Give your coach a complete picture of your communication patterns before your first session. Start with data, not guesswork.",
    icon: BarChart3
  },
  {
    title: "Targeted Development",
    description: "Focus coaching sessions on the specific lenses where you need the most growth. Make every hour count.",
    icon: Target
  },
  {
    title: "Progress Tracking",
    description: "Retake the assessment after 6 months of coaching to measure growth and identify new development areas.",
    icon: Compass
  },
  {
    title: "Self-Coaching Tool",
    description: "Use the prompt library between sessions to prepare for challenging conversations and reinforce learning.",
    icon: Brain
  }
];

const COACHING_BENEFITS = [
  "Arrive at coaching with clear data about your communication patterns",
  "Identify specific focus areas for coaching conversations",
  "Track measurable progress over your coaching journey",
  "Access 10+ prompts designed for self-coaching between sessions",
  "Understand your conflict patterns before they show up in real situations",
  "Complement any coaching methodology with objective self-insight"
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
        style={{
          background: `linear-gradient(180deg, ${atmosphericPalette.space} 0%, ${atmosphericPalette.highAtmosphere} 50%, ${atmosphericPalette.upperAtmosphere} 100%)`
        }}
        data-testid="section-coaching-assessment-hero"
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
            <Badge className="mb-6 bg-ego/20 text-ego border-ego/30">
              Executive Coaching Tool
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6" data-testid="text-coaching-assessment-title">
              Executive Coaching<br />
              <span className="text-ego">Assessment</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Start your coaching journey with data, not guesswork. The Satellite Scan provides the baseline that makes coaching more effective from day one.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signals">
                <Button size="lg" className="bg-ego hover:bg-ego/90 text-white" data-testid="button-assessment-start">
                  Free 2-Min Quick Check
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/checkout?product=satellitescan">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" data-testid="button-assessment-full-scan">
                  Full Satellite Scan (€99.95)
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/coaching">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" data-testid="button-assessment-coaching">
                  Explore Coaching Programs
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
              How Coaches Use the Satellite Scan
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Whether you're starting coaching or already working with a coach, the Satellite Scan accelerates your development.
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
          background: `linear-gradient(180deg, ${atmosphericPalette.midAtmosphere} 0%, ${atmosphericPalette.lowerAtmosphere} 100%)`
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
                Make Every Coaching Hour Count
              </h2>
              <p className="text-white/70 mb-8">
                Executive coaching is an investment. The Satellite Scan ensures you spend that investment on the patterns that matter most.
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
                  <p className="text-white/70 mb-6">Satellite Scan Assessment</p>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-white/80">
                      <Brain className="w-4 h-4 text-ego" />
                      129 questions across 8 lenses
                    </li>
                    <li className="flex items-center gap-2 text-white/80">
                      <BarChart3 className="w-4 h-4 text-ego" />
                      Shareable coaching dashboard
                    </li>
                    <li className="flex items-center gap-2 text-white/80">
                      <Zap className="w-4 h-4 text-ego" />
                      10+ self-coaching prompts
                    </li>
                  </ul>
                  <Link href="/signals">
                    <Button size="lg" className="w-full bg-ego hover:bg-ego/90" data-testid="button-assessment-cta">
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

      <section 
        className="py-24"
        style={{
          background: `linear-gradient(180deg, ${atmosphericPalette.lowerAtmosphere} 0%, #000000 100%)`
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
                <Button size="lg" className="bg-ego hover:bg-ego/90" data-testid="button-assessment-final-cta">
                  Take the Free Quick Check
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/checkout?product=satellitescan">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" data-testid="button-assessment-final-scan">
                  Get the Full Satellite Scan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
