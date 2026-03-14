import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { atmosphericPalette } from "@/constants/atmosphericGradient";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Users, TrendingUp, Target, Sparkles, Brain, Zap, Crown, BarChart3 } from "lucide-react";
import { SEO } from "@/components/SEO";
import earthOrbitUrl from "@assets/generated_images/earth_orbit_aurora_view.png";

const CEO_CHALLENGES = [
  {
    title: "Team Alignment at Scale",
    description: "Ensure your vision translates clearly across every level of the organization. Communication gaps compound as you scale.",
    icon: Users
  },
  {
    title: "Executive Presence Under Pressure",
    description: "Maintain clarity and composure when stakes are highest. Your communication sets the emotional tone for the entire organization.",
    icon: Crown
  },
  {
    title: "Board & Investor Relations",
    description: "Navigate the delicate balance of transparency and confidence. Communicate progress and challenges with strategic precision.",
    icon: TrendingUp
  },
  {
    title: "Leadership Communication Blind Spots",
    description: "The higher you rise, the less honest feedback you receive. Discover the patterns others see but won't tell you about.",
    icon: Target
  }
];

const CEO_BENEFITS = [
  "Map your leadership communication patterns across 8 lenses including Influence, Alignment, and Ego",
  "Identify how stress affects your communication with direct reports",
  "Understand your default conflict resolution patterns",
  "Discover blind spots in how you communicate vision and strategy",
  "Get data-driven insights for executive coaching conversations",
  "Track leadership communication growth over time"
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
        style={{
          background: `linear-gradient(180deg, ${atmosphericPalette.space} 0%, ${atmosphericPalette.highAtmosphere} 50%, ${atmosphericPalette.upperAtmosphere} 100%)`
        }}
        data-testid="section-ceo-hero"
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
            <Badge className="mb-6 bg-influence/20 text-influence border-influence/30">
              For CEOs & Executives
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6" data-testid="text-ceo-title">
              Leadership Communication<br />
              <span className="text-influence">for CEOs</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Your communication shapes company culture. Get data-driven insights into your leadership patterns and blind spots.
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

      <section 
        className="py-24"
        style={{
          background: `linear-gradient(180deg, ${atmosphericPalette.upperAtmosphere} 0%, ${atmosphericPalette.midAtmosphere} 100%)`
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
              The CEO Communication Challenge
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              The higher you climb, the harder it is to get honest feedback. The Satellite Scan reveals what others won't tell you.
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
          background: `linear-gradient(180deg, ${atmosphericPalette.midAtmosphere} 0%, ${atmosphericPalette.lowerAtmosphere} 100%)`
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
                Data-Driven Leadership Insights
              </h2>
              <p className="text-white/70 mb-8">
                The Satellite Scan provides the honest mirror that leadership isolation makes difficult to find elsewhere.
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
                  <p className="text-white/70 mb-6">Satellite Scan Assessment</p>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-white/80">
                      <Brain className="w-4 h-4 text-influence" />
                      129 questions, 8 leadership lenses
                    </li>
                    <li className="flex items-center gap-2 text-white/80">
                      <BarChart3 className="w-4 h-4 text-influence" />
                      Personalized leadership dashboard
                    </li>
                    <li className="flex items-center gap-2 text-white/80">
                      <Zap className="w-4 h-4 text-influence" />
                      Executive prompt library access
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

      <section 
        className="py-24"
        style={{
          background: `linear-gradient(180deg, ${atmosphericPalette.lowerAtmosphere} 0%, #000000 100%)`
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
            className="text-center mt-12 flex flex-col items-center gap-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signals">
                <Button size="lg" className="bg-influence text-white" data-testid="button-ceo-final-cta">
                  Free 2-Min Leadership Check
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/checkout?product=satellitescan">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" data-testid="button-ceo-full-scan">
                  Full Satellite Scan (€99.95)
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <Link href="/signals">
                <Button variant="outline" className="text-white border-white/20 backdrop-blur-sm" data-testid="link-ceo-quiz">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Free 2-Min Quick Check
                </Button>
              </Link>
              <Link href="/webinar">
                <Button variant="outline" className="text-white border-white/20 backdrop-blur-sm" data-testid="link-ceo-webinar">
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
