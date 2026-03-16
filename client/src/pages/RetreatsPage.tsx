
import RetreatCard from "@/components/RetreatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Users, Video, FlaskConical, BookText } from "lucide-react";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { fadeInUp, fadeIn, staggerContainer, slideInLeft } from "@/lib/motion";
import { atmosphericPalette } from "@/constants/atmosphericGradient";
const laplandImageUrl = "/retreat-finland.jpg";
const provenceImageUrl = "/retreat-provence.png";
const microhabitImageUrl = "/retreat-provence.png";

const retreats = [
  {
    title: "Equinoxe Retreat Provence",
    season: "Autumn Equinox 2028",
    date: "September 20-25, 2028",
    location: "Aix-en-Provence, France",
    capacity: "Limited to 14 participants",
    imageUrl: provenceImageUrl,
    description: "Transform how you see conflict in the lavender fields of Provence. This 5-day immersive experience (approx. 25 hours) focuses on seeing conflicts differently, looking beyond ego and triggers, and building trust regardless of emotional temperature.",
    price: "€2,890",
    priceNote: "Price excludes travel only",
    retreatType: "provence" as const,
  },
  {
    title: "Equinoxe Retreat Lapland",
    season: "Spring Equinox 2028",
    date: "March 18-23, 2028",
    location: "Levi, Finland",
    capacity: "Limited to 12 participants",
    imageUrl: laplandImageUrl,
    description: "Journey to Levi's Arctic serenity for a transformative spring retreat. Experience the peace and quiet of Finnish nature while deepening your conscious communication practice in pristine wilderness.",
    price: "€2,890",
    priceNote: "Price excludes travel only",
    retreatType: "lapland" as const,
  },
];

const heroGradient = `linear-gradient(180deg, 
  ${atmosphericPalette.space} 0%, 
  ${atmosphericPalette.highAtmosphere} 35%, 
  ${atmosphericPalette.upperAtmosphere} 70%, 
  ${atmosphericPalette.midAtmosphere} 100%
)`;

export default function RetreatsPage() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Equinoxe Communication Retreats | Finland & Provence | GreenElephant"
        description="Transform how you see conflict in 5-day immersive retreats in Levi, Finland or Provence, France. Practice microhabits, build trust, and return home with a personalized playbook. Limited to 12-14 participants."
        canonicalPath="/retreats"
        keywords="communication retreat, equinoxe retreat, Finland retreat, Provence retreat, conflict resolution retreat, conscious communication immersive, microhabit retreat"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Retreats", url: "/retreats" }
        ]}
        faqItems={[
          { question: "Where are the GreenElephant retreats held?", answer: "GreenElephant Equinoxe retreats are held in two locations: Levi, Finnish Lapland in winter/spring, and Provence, France in summer/autumn. Both locations are chosen for their natural setting, stillness, and distance from daily pressures — essential conditions for deep communication work." },
          { question: "How many people attend a retreat?", answer: "Retreats are limited to 12–14 participants to ensure deep personal attention and genuine group cohesion. This intimate scale allows for meaningful practice, honest conversation, and lasting connections." },
          { question: "What happens during a GreenElephant retreat?", answer: "Each 5-day Equinoxe retreat combines conscious communication sessions using the Periodic Table framework, micro-habit practice, conflict transformation exercises, nature immersion, movement, and personal reflection time. Participants leave with a personalised communication playbook." },
          { question: "Do I need to have done the Satellite Scan before attending a retreat?", answer: "The Satellite Scan is strongly recommended before attending — it gives you a personal diagnostic baseline that deepens your experience and allows facilitators to tailor sessions to your communication profile." },
          { question: "What is the price of a retreat?", answer: "Retreats start from €2,800 per participant. This includes accommodation, all meals, facilitation, and materials. Travel to the retreat location is not included. Early-bird and group pricing may be available — contact esteve@greenelephant.org for details." }
        ]}
      />
      <section 
        className="relative min-h-[70vh] flex items-center justify-center pt-24 pb-16"
        style={{ background: heroGradient }}
        data-testid="section-retreats-hero"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50 pointer-events-none" />
        
        <motion.div 
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Badge className="mb-4 bg-needs text-white" data-testid="badge-equinoxe">Equinoxe Experiences</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white" data-testid="text-retreats-title">
            Transform How You See Conflict
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-4" data-testid="text-retreats-subtitle">
            5-day immersive retreats (approx. 25 hours) focusing on seeing conflicts differently, looking beyond ego and triggers, and building trust regardless of emotional temperature
          </p>
          <p className="text-lg text-white/60 max-w-2xl mx-auto" data-testid="text-retreats-description">
            In Levi's Arctic serenity or Provence's lavender fields, you'll practice microhabits in a held space of deep presence—then return home with your personalized playbook and sustainable transformation, not just inspiration.
          </p>
        </motion.div>
      </section>

      <div 
        className="pb-16"
        style={{
          background: `linear-gradient(180deg, 
            ${atmosphericPalette.midAtmosphere} 0%, 
            ${atmosphericPalette.lowerAtmosphere} 20%, 
            hsl(var(--background)) 40%
          )`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto pt-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {retreats.map((retreat, index) => (
              <motion.div key={retreat.title} variants={fadeIn} data-testid={`card-retreat-${index}`}>
                <RetreatCard {...retreat} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 mb-24 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeIn}
            data-testid="section-pricing"
          >
            <h2 className="text-3xl font-bold mb-6 text-center text-white" data-testid="text-pricing-title">Pricing Transparency</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-needs">What's Included in €2,890</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-needs mt-1">✓</span>
                    <span className="text-white/70">5 nights accommodation (shared room)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-needs mt-1">✓</span>
                    <span className="text-white/70">All meals (breakfast, lunch, dinner)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-needs mt-1">✓</span>
                    <span className="text-white/70">25 hours of facilitated sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-needs mt-1">✓</span>
                    <span className="text-white/70">Retreat materials & personalized playbook</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-needs mt-1">✓</span>
                    <span className="text-white/70">90-day integration support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-needs mt-1">✓</span>
                    <span className="text-white/70">Alumni community access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-needs mt-1">✓</span>
                    <span className="text-white/70">Recorded sessions & lifetime materials access</span>
                  </li>
                </ul>
                <p className="text-sm text-white/50 mt-4">
                  <strong className="text-white/70">Not included:</strong> Travel to/from location. Single room upgrade available for +€400.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-destructive">Cancellation & Refund Policy</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px] text-white/80">60+ days:</span>
                    <span className="text-white/70">Full refund minus €100 admin fee</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px] text-white/80">30-59 days:</span>
                    <span className="text-white/70">50% refund</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px] text-white/80">&lt;30 days:</span>
                    <span className="text-white/70">No refund (credit toward future retreat)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px] text-white/80">Emergency:</span>
                    <span className="text-white/70">Medical/family emergencies reviewed case-by-case with documentation</span>
                  </li>
                </ul>
                <p className="text-sm text-white/50 mt-4">
                  We hold your spot with care. If you need to cancel, we'll work with you to find the best solution.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeIn}
            data-testid="section-methodology"
          >
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-6 text-white" data-testid="text-methodology-title">The Microhabit Methodology</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  Our retreats are built on the microhabit framework - small, consistent practices that rewire communication patterns over time.
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-white">1. Trigger</h3>
                    <p className="text-sm text-white/70">When a specific communication moment arises...</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-white">2. Action</h3>
                    <p className="text-sm text-white/70">I will practice this conscious response...</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-white">3. Reward</h3>
                    <p className="text-sm text-white/70">In order to experience transformation and deeper connection.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 p-8 md:p-12 flex items-center justify-center">
                <img 
                  src={microhabitImageUrl} 
                  alt="Microhabit Framework" 
                  className="w-full max-w-md rounded-lg"
                  data-testid="img-microhabit"
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="backdrop-blur-md bg-needs/10 border border-needs/20 rounded-2xl p-8 md:p-12 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            data-testid="section-carry-home"
          >
            <motion.h2 variants={fadeIn} className="text-3xl font-bold text-center mb-6 text-white" data-testid="text-carry-home-title">What You'll Carry Home</motion.h2>
            <motion.p variants={fadeIn} className="text-center text-white/70 mb-8 max-w-2xl mx-auto">
              These retreats don't end when you leave. Here's what supports your continued transformation:
            </motion.p>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <motion.div variants={fadeIn} className="flex gap-4" data-testid="item-playbook">
                <div className="w-12 h-12 rounded-full bg-needs/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-needs" />
                </div>
                <div>
                  <p className="font-semibold mb-1 text-white">Personalized Microhabit Playbook</p>
                  <p className="text-sm text-white/70">Custom-designed practices based on your Satellite Scan and retreat insights</p>
                </div>
              </motion.div>
              <motion.div variants={fadeIn} className="flex gap-4" data-testid="item-integration">
                <div className="w-12 h-12 rounded-full bg-needs/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6 text-needs" />
                </div>
                <div>
                  <p className="font-semibold mb-1 text-white">90-Day Integration Support</p>
                  <p className="text-sm text-white/70">Weekly group calls and email guidance as you apply what you've learned</p>
                </div>
              </motion.div>
              <motion.div variants={fadeIn} className="flex gap-4" data-testid="item-community">
                <div className="w-12 h-12 rounded-full bg-needs/20 flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-needs" />
                </div>
                <div>
                  <p className="font-semibold mb-1 text-white">Alumni Community Access</p>
                  <p className="text-sm text-white/70">Ongoing connection with fellow practitioners for mutual support</p>
                </div>
              </motion.div>
              <motion.div variants={fadeIn} className="flex gap-4" data-testid="item-recordings">
                <div className="w-12 h-12 rounded-full bg-needs/20 flex items-center justify-center flex-shrink-0">
                  <Video className="h-6 w-6 text-needs" />
                </div>
                <div>
                  <p className="font-semibold mb-1 text-white">Recorded Sessions & Materials</p>
                  <p className="text-sm text-white/70">Lifetime access to framework teachings and practice recordings</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={slideInLeft}
            data-testid="section-research-partners"
          >
            <h2 className="text-3xl font-bold text-center mb-4 text-white" data-testid="text-partners-title">Research Partners</h2>
            <p className="text-center text-white/70 mb-8 max-w-2xl mx-auto">
              Our methodology is developed in collaboration with leading institutions
            </p>
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
              <Badge variant="outline" className="px-6 py-3 text-base border-white/20 bg-white/5 text-white/80" data-testid="badge-aalto">
                Aalto Design Factory
              </Badge>
              <Badge variant="outline" className="px-6 py-3 text-base border-white/20 bg-white/5 text-white/80" data-testid="badge-teal">
                TEAL Organizations
              </Badge>
              <Badge variant="outline" className="px-6 py-3 text-base border-white/20 bg-white/5 text-white/80" data-testid="badge-cnvc">
                Center for Nonviolent Communication
              </Badge>
            </div>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            data-testid="section-related-links"
          >
            <motion.div variants={fadeIn}>
              <Card className="backdrop-blur-md bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="h-5 w-5" />
                    Agent Bios
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-white/70">
                    Meet Anu and Jonas, your guides through this transformative journey. Each brings unique expertise in conscious communication.
                  </p>
                  <Link href="/connect" data-testid="link-team">
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" data-testid="button-agent-bios">
                      Meet the Team
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="backdrop-blur-md bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BookText className="h-5 w-5" />
                    Methodology
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-white/70">
                    Our framework is research-backed and proven. The Periodic Table maps 129 elements across 8 communication lenses.
                  </p>
                  <Link href="/periodic-table" data-testid="link-periodic-table">
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" data-testid="button-methodology">
                      Explore the Framework
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="backdrop-blur-md bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <FlaskConical className="h-5 w-5" />
                    Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-white/70">
                    Access prompts, tools, and practical resources structured by the 8 communication lenses.
                  </p>
                  <Link href="/resources" data-testid="link-resources">
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" data-testid="button-resources">
                      Explore Resources
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
