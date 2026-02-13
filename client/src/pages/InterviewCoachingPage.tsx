import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Target, 
  Users, 
  Trophy, 
  Calendar,
  ArrowRight,
  Video,
  MessageCircle,
  BarChart3,
  Sparkles,
  Brain,
  Handshake
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { fadeInUp, staggerContainer, fadeIn, scaleIn } from "@/lib/motion";
import { atmosphericPalette } from "@/constants/atmosphericGradient";
import montVentouxLavenderUrl from "@assets/mont_ventoux_provence_lavender_landscape_1764783871280.png";
import { SEO, PRODUCT_STRUCTURED_DATA } from "@/components/SEO";

const heroGradient = `linear-gradient(180deg, 
  ${atmosphericPalette.space} 0%, 
  ${atmosphericPalette.highAtmosphere} 40%, 
  ${atmosphericPalette.upperAtmosphere} 100%
)`;

const sectionGradientMid = `linear-gradient(180deg, 
  ${atmosphericPalette.upperAtmosphere} 0%, 
  ${atmosphericPalette.midAtmosphere} 50%, 
  ${atmosphericPalette.lowerAtmosphere} 100%
)`;

const sectionGradientLower = `linear-gradient(180deg, 
  ${atmosphericPalette.lowerAtmosphere} 0%, 
  ${atmosphericPalette.skyHorizon} 50%, 
  ${atmosphericPalette.horizonWater} 100%
)`;

const sectionGradientDeep = `linear-gradient(180deg, 
  ${atmosphericPalette.horizonWater} 0%, 
  ${atmosphericPalette.deepWater} 50%, 
  ${atmosphericPalette.abyss} 100%
)`;

export default function InterviewCoachingPage() {
  return (
    <div className="min-h-screen">
      <SEO 
        title="Interview Mastery Bundle | Data-Driven Interview Coaching"
        description="Ace your next interview with personalized coaching combining Satellite Scan diagnostics and expert guidance. For professionals 40+ seeking to communicate confidence in high-stakes career conversations."
        keywords="interview coaching, career coaching, communication skills, executive interview preparation, job interview confidence, communication patterns"
        canonicalPath="/interview-coaching"
        structuredData={PRODUCT_STRUCTURED_DATA.interviewMastery}
      />
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden"
        style={{ background: heroGradient }}
      >
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Badge 
              className="mb-6 text-sm px-4 py-1.5 bg-white/10 border border-white/20 text-white" 
              data-testid="badge-40plus"
            >
              For Professionals 40+
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-archivo text-white">
              Ace Your Next Interview
              <span className="block text-ego mt-2">With Data-Driven Confidence</span>
            </h1>
            
            <p className="text-xl text-white/70 mb-4 max-w-3xl mx-auto">
              Start with your Satellite Scan to map your communication strengths. Then master interviews 
              with personalized coaching focused on your verbal, nonverbal, and linguistic patterns.
            </p>
            
            <p className="text-lg text-white/60 mb-8">
              Your communication data + hands-on practice = interview confidence that lasts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8"
                data-testid="button-book-bundle"
                asChild
              >
                <Link href="/checkout?package=interview-mastery-bundle">
                  Get Scan + 3 Sessions - €845
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-white/10"
                data-testid="button-learn-process"
                asChild
              >
                <a href="#process">
                  See How It Works
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section 
        className="py-16"
        style={{ background: sectionGradientMid }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-4 font-archivo text-white">
              Interviews Have Changed — Have You?
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Modern interviews require new skills. Your experience is valuable — you just need to communicate it effectively.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                icon: Target,
                title: "New Interview Formats",
                description: "Video calls, behavioral questions, competency frameworks — the rules have changed."
              },
              {
                icon: MessageCircle,
                title: "Communication Gaps",
                description: "Struggling to explain your value in 2 minutes? Finding it hard to connect with younger interviewers?"
              },
              {
                icon: BarChart3,
                title: "Competing Confidently",
                description: "Your experience is an asset, not a liability. Learn to position it as strength."
              }
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card 
                  className="bg-white/5 backdrop-blur-sm border border-white/10 hover-elevate h-full" 
                  data-testid={`card-problem-${idx}`}
                >
                  <CardContent className="p-6">
                    <item.icon className="h-10 w-10 text-ego mb-4" />
                    <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                    <p className="text-white/70">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3-Step Process Section */}
      <section 
        id="process" 
        className="py-20"
        style={{ background: sectionGradientLower }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Badge className="mb-4 bg-white/10 border border-white/20 text-white" variant="outline">
              The Journey
            </Badge>
            <h2 className="text-4xl font-bold mb-4 font-archivo text-white">
              Your 3-Session Interview Mastery Path
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Clear steps. Real practice. Confidence that lasts.
            </p>
          </motion.div>

          <motion.div 
            className="space-y-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Session 1 */}
            <motion.div variants={fadeInUp}>
              <Card 
                className="bg-white/5 backdrop-blur-sm border-2 border-ego/40" 
                data-testid="card-session-1"
              >
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">
                    <div className="text-center lg:text-left">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ego/20 text-ego mb-4">
                        <span className="text-2xl font-bold">1</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 font-archivo text-white">Calibration Session</h3>
                      <Badge className="mb-4 bg-white/10 border border-white/20 text-white">90 minutes</Badge>
                    </div>
                    
                    <div>
                      <div className="flex items-start gap-3 mb-6">
                        <Brain className="h-6 w-6 text-ego mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-lg mb-2 text-white">Understand Your Starting Point</h4>
                          <p className="text-white/70 mb-4">
                            We map your strengths, identify blind spots, and create your personal interview strategy.
                          </p>
                        </div>
                      </div>

                      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 space-y-3 border border-white/10">
                        <p className="font-semibold mb-3 text-white">What We Do:</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {[
                            "Quick skills assessment",
                            "Review your background",
                            "Identify your unique value",
                            "Set clear goals",
                            "Practice answering 3 key questions",
                            "Get your first micro-habits"
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-ego flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-white/80">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 p-4 border border-ego/30 rounded-lg bg-ego/10">
                        <div className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-ego flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold mb-1 text-white">You'll Leave With:</p>
                            <p className="text-sm text-white/70">
                              3 personalized micro-habits to practice + recording of your first practice answers
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Session 2 */}
            <motion.div variants={fadeInUp}>
              <Card 
                className="bg-white/5 backdrop-blur-sm border-2 border-needs/40" 
                data-testid="card-session-2"
              >
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">
                    <div className="text-center lg:text-left">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-needs/20 text-needs mb-4">
                        <span className="text-2xl font-bold">2</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 font-archivo text-white">Live Roleplay Practice</h3>
                      <Badge className="mb-4 bg-white/10 border border-white/20 text-white">120 minutes</Badge>
                    </div>
                    
                    <div>
                      <div className="flex items-start gap-3 mb-6">
                        <Video className="h-6 w-6 text-needs mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-lg mb-2 text-white">Real Interview Simulation</h4>
                          <p className="text-white/70 mb-4">
                            Experience a full mock interview. Get instant feedback. Build muscle memory for success.
                          </p>
                        </div>
                      </div>

                      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 space-y-3 border border-white/10">
                        <p className="font-semibold mb-3 text-white">What We Practice:</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {[
                            "Common interview questions",
                            "Behavioral STAR method",
                            "Handling age-related concerns",
                            "Your 2-minute introduction",
                            "Difficult questions practice",
                            "Body language & presence"
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-needs flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-white/80">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 p-4 border border-needs/30 rounded-lg bg-needs/10">
                        <div className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-needs flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold mb-1 text-white">You'll Leave With:</p>
                            <p className="text-sm text-white/70">
                              Video recording of your practice + detailed feedback report + new micro-habits to refine
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Session 3 */}
            <motion.div variants={fadeInUp}>
              <Card 
                className="bg-white/5 backdrop-blur-sm border-2 border-flow/40" 
                data-testid="card-session-3"
              >
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">
                    <div className="text-center lg:text-left">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-flow/20 text-flow mb-4">
                        <span className="text-2xl font-bold">3</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 font-archivo text-white">Final Polish & Launch</h3>
                      <Badge className="mb-4 bg-white/10 border border-white/20 text-white">90 minutes</Badge>
                    </div>
                    
                    <div>
                      <div className="flex items-start gap-3 mb-6">
                        <Trophy className="h-6 w-6 text-flow mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-lg mb-2 text-white">Ready to Succeed</h4>
                          <p className="text-white/70 mb-4">
                            Fine-tune your approach. Practice your stories. Walk into interviews with total confidence.
                          </p>
                        </div>
                      </div>

                      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 space-y-3 border border-white/10">
                        <p className="font-semibold mb-3 text-white">What We Finalize:</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {[
                            "Perfect your key stories",
                            "Handle tough scenarios",
                            "Salary negotiation basics",
                            "Questions to ask interviewers",
                            "Follow-up strategies",
                            "Your personal action plan"
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-flow flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-white/80">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 p-4 border border-flow/30 rounded-lg bg-flow/10">
                        <div className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-flow flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold mb-1 text-white">You'll Leave With:</p>
                            <p className="text-sm text-white/70">
                              Complete interview toolkit + 30-day follow-up support via email
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why This Works Section */}
      <section 
        className="py-20"
        style={{ background: sectionGradientDeep }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-4 font-archivo text-white">
              Why This Approach Works
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Built on research. Proven in practice. Designed for real results.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                icon: Sparkles,
                title: "Micro-Habits Method",
                description: "Small, daily practices create lasting change. No overwhelming theory — just actionable steps you can use immediately."
              },
              {
                icon: Video,
                title: "Live Practice",
                description: "Learning by doing. Real interview scenarios. Immediate feedback. Build confidence through repetition."
              },
              {
                icon: Handshake,
                title: "Personalized to You",
                description: "Your industry. Your experience level. Your goals. Every session adapts to your unique situation."
              }
            ].map((item, idx) => (
              <motion.div key={idx} variants={scaleIn}>
                <Card 
                  className="text-center bg-white/5 backdrop-blur-sm border border-white/10 hover-elevate h-full" 
                  data-testid={`card-method-${idx}`}
                >
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ego/20 mb-4">
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                    <p className="text-white/70">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Coach Section */}
      <section 
        className="py-20"
        style={{ background: atmosphericPalette.abyss }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid lg:grid-cols-[1fr_300px] gap-12 items-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div>
              <Badge className="mb-4 bg-white/10 border border-white/20 text-white">Your Coach</Badge>
              <h2 className="text-3xl font-bold mb-4 font-archivo text-white">Estève Pannetier</h2>
              <p className="text-lg text-ego mb-6 font-semibold">
                The Science of The Interview
              </p>

              <div className="prose prose-invert max-w-none space-y-4 text-white/70">
                <p>
                  Estève brings a rare dual perspective to high-stakes interview coaching. He hasn't just sat in the chair—he has designed the process.
                </p>
                
                <p>
                  With 15+ years of experience in Human Factors and Qualitative Research (IDEO, ReD Associates, HVL360), Estève has conducted thousands of deep-dive interviews across 10+ countries, mastering the psychology of questioning and non-verbal analysis.
                </p>

                <p>
                  As a former Head of Human Factors and Interim Head of People & Culture (358), he has managed the entire hiring lifecycle—from recruiting and interviewing to onboarding. He knows exactly what decision-makers are looking for on the other side of the table.
                </p>

                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 my-6 border border-white/10">
                  <p className="font-semibold mb-3 text-white">Credentials:</p>
                  <ul className="space-y-2">
                    {[
                      "Conflict Transformation™ Certified Facilitator",
                      "Aalto University Guest Lecturer",
                      "15+ years Human Factors & Qualitative Research",
                      "Former Head of Human Factors (358)",
                      "Conducted 1000s of interviews across 10+ countries"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-ego flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-white/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-sm text-white/60">
                  Combined with his background as a Conflict Transformation™ Certified facilitator and Aalto University guest lecturer, Estève offers a data-backed approach to mastering your presence, narrative, and nerves when it matters most.
                </p>
              </div>
            </div>

            <motion.div 
              className="space-y-4"
              variants={staggerContainer}
            >
              <motion.div variants={scaleIn}>
                <Card className="bg-white/5 backdrop-blur-sm border border-ego/40">
                  <CardContent className="p-6">
                    <div className="text-center space-y-3">
                      <div className="text-4xl font-bold text-ego">15+</div>
                      <p className="text-sm text-white/70">Years of Experience</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={scaleIn}>
                <Card className="bg-white/5 backdrop-blur-sm border border-needs/40">
                  <CardContent className="p-6">
                    <div className="text-center space-y-3">
                      <div className="text-4xl font-bold text-needs">200+</div>
                      <p className="text-sm text-white/70">Professionals Coached</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={scaleIn}>
                <Card className="bg-white/5 backdrop-blur-sm border border-flow/40">
                  <CardContent className="p-6">
                    <div className="text-center space-y-3">
                      <div className="text-4xl font-bold text-flow">TEDx</div>
                      <p className="text-sm text-white/70">Speaker</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Dark gradient wrapper for Pricing, FAQ, and Final CTA sections */}
      <div 
        style={{ 
          background: `linear-gradient(180deg, 
            ${atmosphericPalette.abyss} 0%, 
            #050d18 20%, 
            ${atmosphericPalette.space} 40%, 
            ${atmosphericPalette.space} 60%, 
            #050d18 80%, 
            ${atmosphericPalette.abyss} 100%
          )` 
        }}
      >
        {/* Pricing & Booking Section */}
        <section 
          id="booking" 
          className="py-20"
        >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-4xl font-bold mb-4 font-archivo text-white">
              Ready to Transform Your Interviews?
            </h2>
            <p className="text-lg text-white/70">
              Get your communication data first, then practice with personalized coaching.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-2 border-ego/40 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-ego/20 text-ego border border-ego/30">Best Value</Badge>
              </div>
              
              <CardContent className="p-8 sm:p-12">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-2 font-archivo text-white">Interview Mastery Bundle</h3>
                  <p className="text-white/70 mb-2">Satellite Scan + 3 Coaching Sessions</p>
                  <p className="text-sm text-alignment mb-6">Your data-driven path to interview confidence</p>
                  
                  <div className="flex items-baseline justify-center gap-2 mb-4">
                    <span className="text-5xl font-bold text-ego">€845</span>
                    <span className="text-white/50 line-through">€894.95</span>
                  </div>
                  <p className="text-sm text-white/60">Save €49.95 — Satellite Scan (€99.95) included free</p>
                </div>

                {/* Satellite Scan Section */}
                <div className="bg-white/5 rounded-lg p-4 mb-6 border border-alignment/30">
                  <h4 className="font-semibold text-alignment mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Phase 1: Your Satellite Scan
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      "90-minute AI-powered assessment",
                      "Personalized communication dashboard",
                      "10+ prompts to mine your data",
                      "8-lens behavioral insights"
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-alignment flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-white/70">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coaching Sessions Section */}
                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-ego flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Phase 2: 3 Personalized Coaching Sessions
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      "300 minutes total coaching (5 hours)",
                      "Verbal & nonverbal feedback",
                      "Linguistic pattern analysis",
                      "Live interview roleplay practice",
                      "Conscious communication insights",
                      "Video recordings & transcripts",
                      "Personalized micro-habits plan",
                      "30-day email follow-up support"
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-ego flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-white/80">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Self-paced Learning Section */}
                <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Video className="h-4 w-4 text-flow" />
                    Ongoing Self-Paced Learning
                  </h4>
                  <p className="text-sm text-white/60">
                    Use your scan data with the prompt library to continue practicing during and after your sessions. 
                    Access video tutorials for each communication lens.
                  </p>
                </div>

                <div className="space-y-4">
                  <Button 
                    size="lg" 
                    className="w-full text-lg"
                    data-testid="button-get-bundle"
                    asChild
                  >
                    <Link href="/checkout?package=interview-mastery-bundle">
                      <Calendar className="mr-2 h-5 w-5" />
                      Get the Interview Mastery Bundle
                    </Link>
                  </Button>

                  <p className="text-center text-sm text-white/60">
                    Start with your Satellite Scan. Coaching sessions scheduled after your dashboard is ready.
                  </p>

                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-sm text-white/70 border border-white/10">
                    <div className="flex items-start gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-ego flex-shrink-0 mt-0.5" />
                      <p className="font-semibold text-white">How It Works:</p>
                    </div>
                    <ul className="space-y-1 ml-4 list-disc text-white/60">
                      <li>Complete your Satellite Scan (90 mins, at your pace)</li>
                      <li>Receive your personalized dashboard (48-72 hours)</li>
                      <li>Schedule coaching sessions with your data insights</li>
                      <li>Practice interviews with feedback on your patterns</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="mt-8 text-center">
            <p className="text-sm text-white/60 mb-4">
              Questions about the program?
            </p>
            <Button 
              variant="outline" 
              className="bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-white/10"
              asChild 
              data-testid="button-contact"
            >
              <Link href="/contact">
                Contact Estève Directly
              </Link>
            </Button>
          </div>
        </div>
      </section>

        {/* FAQ Section */}
        <section 
          className="py-20"
        >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-4 font-archivo text-white">
              Common Questions
            </h2>
          </motion.div>

          <motion.div 
            className="space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                q: "What is the Satellite Scan and why is it included?",
                a: "The Satellite Scan is a 90-minute AI-powered assessment that maps your communication patterns across 8 lenses. It gives us concrete data about your verbal, nonverbal, and linguistic strengths before coaching begins — so sessions are personalized to you, not generic advice."
              },
              {
                q: "How do I use the scan data during coaching?",
                a: "Your personalized dashboard reveals your communication patterns. We use these insights during 1:1 sessions to focus on specific interview scenarios. Plus, you get 10+ prompts to continue mining your data between and after sessions."
              },
              {
                q: "Is this suitable for non-native English speakers?",
                a: "Absolutely! I work with international professionals regularly and use clear, simple language. Your Satellite Scan data also shows linguistic patterns we can work on together."
              },
              {
                q: "What if I haven't interviewed in 10+ years?",
                a: "Perfect! That's exactly who this program helps. The scan establishes your baseline, then we build modern interview skills step by step with personalized feedback."
              },
              {
                q: "Can I continue learning after the 3 sessions?",
                a: "Yes! Your scan data is yours forever. Use the prompt library to practice anytime. Access video tutorials for each communication lens. Your insights compound over time."
              },
              {
                q: "How is this different from generic interview prep?",
                a: "Generic advice doesn't work for experienced professionals. Starting with your scan data means every recommendation is based on YOUR patterns — verbal, nonverbal, and linguistic — not textbook answers."
              }
            ].map((faq, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card 
                  className="bg-white/5 backdrop-blur-sm border border-white/10 hover-elevate" 
                  data-testid={`card-faq-${idx}`}
                >
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-white">{faq.q}</h3>
                    <p className="text-white/70">{faq.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

        {/* Final CTA */}
        <section 
          className="py-20"
        >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-4 font-archivo text-white">
              Your Next Career Move Starts With Data
            </h2>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Get your Satellite Scan, discover your communication patterns, then master interviews 
              with personalized coaching. Your confidence will be built on evidence, not guesswork.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8"
                data-testid="button-get-bundle-final"
                asChild
              >
                <Link href="/checkout?package=interview-mastery-bundle">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get the Interview Mastery Bundle - €845
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-white/10"
                data-testid="button-learn-more-scan"
                asChild
              >
                <Link href="/scan">
                  Learn About the Scan
                </Link>
              </Button>
            </div>

            <p className="text-sm text-white/60 mt-8">
              Part of <Link href="/" className="text-ego hover:underline">GreenElephant.org</Link> — 
              Transforming communication since 2010
            </p>
          </motion.div>
        </div>
        </section>
      </div>

      {/* Mont Ventoux Landscape Footer - full-width image that never crops */}
      <section 
        className="relative"
        aria-label="Mont Ventoux landscape"
        style={{ background: atmosphericPalette.abyss }}
      >
        {/* Top gradient overlay that bridges from dark gradient above */}
        <div 
          className="absolute top-0 left-0 right-0 h-48 z-10 pointer-events-none"
          style={{ 
            background: `linear-gradient(to bottom,
              ${atmosphericPalette.abyss} 0%,
              ${atmosphericPalette.abyss} 20%,
              rgba(0,0,0,0.85) 40%,
              rgba(0,0,0,0.5) 65%,
              rgba(0,0,0,0.2) 85%,
              transparent 100%
            )`
          }}
        />
        
        {/* Full-width image that never crops at top */}
        <img 
          src={montVentouxLavenderUrl}
          alt="Mont Ventoux lavender landscape, Provence"
          className="w-full h-auto block"
          style={{
            maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)"
          }}
        />
        
        {/* Bottom gradient overlay for smooth fade out */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none"
          style={{ 
            background: `linear-gradient(to top,
              ${atmosphericPalette.abyss} 0%,
              ${atmosphericPalette.abyss} 30%,
              rgba(0,0,0,0.6) 60%,
              transparent 100%
            )`
          }}
        />
        
        <div className="absolute bottom-8 left-0 right-0 z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-white/80 text-sm">Mont Ventoux, Provence</p>
          </div>
        </div>
      </section>
    </div>
  );
}
