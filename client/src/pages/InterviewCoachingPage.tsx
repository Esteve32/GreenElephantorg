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

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function InterviewCoachingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-ego/5 via-background to-needs/5" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Badge className="mb-6 text-sm px-4 py-1.5" data-testid="badge-40plus">
              For Professionals 40+
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-archivo">
              Ace Your Next Interview
              <span className="block text-ego mt-2">With Confidence & Clarity</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
              Navigate modern interviews with proven techniques. Stand out as an experienced professional. 
              Land the role you deserve.
            </p>
            
            <p className="text-lg text-muted-foreground/80 mb-8">
              Simple language. Real practice. Immediate results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8"
                data-testid="button-book-bundle"
                asChild
              >
                <a href="#booking">
                  Book Your 3-Session Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8"
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
      <section className="py-16 border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 font-archivo">
              Interviews Have Changed — Have You?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Modern interviews require new skills. Your experience is valuable — you just need to communicate it effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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
              <Card key={idx} className="border-border/60 hover-elevate" data-testid={`card-problem-${idx}`}>
                <CardContent className="p-6">
                  <item.icon className="h-10 w-10 text-ego mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3-Step Process Section */}
      <section id="process" className="py-20 bg-card/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">The Journey</Badge>
            <h2 className="text-4xl font-bold mb-4 font-archivo">
              Your 3-Session Interview Mastery Path
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Clear steps. Real practice. Confidence that lasts.
            </p>
          </div>

          <div className="space-y-12">
            {/* Session 1 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Card className="border-2 border-ego/40" data-testid="card-session-1">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">
                    <div className="text-center lg:text-left">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ego/20 text-ego mb-4">
                        <span className="text-2xl font-bold">1</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 font-archivo">Calibration Session</h3>
                      <Badge variant="outline" className="mb-4">90 minutes</Badge>
                    </div>
                    
                    <div>
                      <div className="flex items-start gap-3 mb-6">
                        <Brain className="h-6 w-6 text-ego mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-lg mb-2">Understand Your Starting Point</h4>
                          <p className="text-muted-foreground mb-4">
                            We map your strengths, identify blind spots, and create your personal interview strategy.
                          </p>
                        </div>
                      </div>

                      <div className="bg-background/60 rounded-lg p-6 space-y-3">
                        <p className="font-semibold mb-3">What We Do:</p>
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
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 p-4 border border-ego/30 rounded-lg bg-ego/5">
                        <div className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-ego flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold mb-1">You'll Leave With:</p>
                            <p className="text-sm text-muted-foreground">
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
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-2 border-needs/40" data-testid="card-session-2">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">
                    <div className="text-center lg:text-left">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-needs/20 text-needs mb-4">
                        <span className="text-2xl font-bold">2</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 font-archivo">Live Roleplay Practice</h3>
                      <Badge variant="outline" className="mb-4">120 minutes</Badge>
                    </div>
                    
                    <div>
                      <div className="flex items-start gap-3 mb-6">
                        <Video className="h-6 w-6 text-needs mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-lg mb-2">Real Interview Simulation</h4>
                          <p className="text-muted-foreground mb-4">
                            Experience a full mock interview. Get instant feedback. Build muscle memory for success.
                          </p>
                        </div>
                      </div>

                      <div className="bg-background/60 rounded-lg p-6 space-y-3">
                        <p className="font-semibold mb-3">What We Practice:</p>
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
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 p-4 border border-needs/30 rounded-lg bg-needs/5">
                        <div className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-needs flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold mb-1">You'll Leave With:</p>
                            <p className="text-sm text-muted-foreground">
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
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-2 border-flow/40" data-testid="card-session-3">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">
                    <div className="text-center lg:text-left">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-flow/20 text-flow mb-4">
                        <span className="text-2xl font-bold">3</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 font-archivo">Final Polish & Launch</h3>
                      <Badge variant="outline" className="mb-4">90 minutes</Badge>
                    </div>
                    
                    <div>
                      <div className="flex items-start gap-3 mb-6">
                        <Trophy className="h-6 w-6 text-flow mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-lg mb-2">Ready to Succeed</h4>
                          <p className="text-muted-foreground mb-4">
                            Fine-tune your approach. Practice your stories. Walk into interviews with total confidence.
                          </p>
                        </div>
                      </div>

                      <div className="bg-background/60 rounded-lg p-6 space-y-3">
                        <p className="font-semibold mb-3">What We Finalize:</p>
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
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 p-4 border border-flow/30 rounded-lg bg-flow/5">
                        <div className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-flow flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold mb-1">You'll Leave With:</p>
                            <p className="text-sm text-muted-foreground">
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
          </div>
        </div>
      </section>

      {/* Why This Works Section */}
      <section className="py-20 border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 font-archivo">
              Why This Approach Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built on research. Proven in practice. Designed for real results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
              <Card key={idx} className="text-center hover-elevate" data-testid={`card-method-${idx}`}>
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ego/10 mb-4">
                    <item.icon className="h-8 w-8 text-ego" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Coach Section */}
      <section className="py-20 bg-card/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_300px] gap-12 items-start">
            <div>
              <Badge className="mb-4">Your Coach</Badge>
              <h2 className="text-3xl font-bold mb-4 font-archivo">Estève Pannetier</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Communication Coach, UX Ethnographer & TEDx Speaker
              </p>

              <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
                <p>
                  With 15+ years helping professionals communicate with clarity and confidence, I specialize in transforming how experienced professionals present themselves in high-stakes situations.
                </p>
                
                <p>
                  I've coached executives, founders, and career changers across Europe — helping them navigate interviews, 
                  salary negotiations, and career transitions with authenticity and impact.
                </p>

                <div className="bg-background/60 rounded-lg p-6 my-6">
                  <p className="font-semibold mb-3">What Makes My Approach Different:</p>
                  <ul className="space-y-2">
                    {[
                      "Research-based micro-habits (not generic advice)",
                      "Live practice with real-time feedback",
                      "Focus on emotional intelligence & presence",
                      "Cultural awareness for international professionals",
                      "Simple language for non-native English speakers"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-ego flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-sm">
                  <strong>Background:</strong> Guest lecturer at Aalto University School of Business, Former Head of Human Factors at 358, 
                  Co-founder of GreenElephant.org (conscious communication training), Certified in Conflict Transformation™.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Card className="border-ego/40">
                <CardContent className="p-6">
                  <div className="text-center space-y-3">
                    <div className="text-4xl font-bold text-ego">15+</div>
                    <p className="text-sm text-muted-foreground">Years of Experience</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-needs/40">
                <CardContent className="p-6">
                  <div className="text-center space-y-3">
                    <div className="text-4xl font-bold text-needs">200+</div>
                    <p className="text-sm text-muted-foreground">Professionals Coached</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-flow/40">
                <CardContent className="p-6">
                  <div className="text-center space-y-3">
                    <div className="text-4xl font-bold text-flow">TEDx</div>
                    <p className="text-sm text-muted-foreground">Speaker</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Booking Section */}
      <section id="booking" className="py-20 border-b border-border/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 font-archivo">
              Ready to Transform Your Interviews?
            </h2>
            <p className="text-lg text-muted-foreground">
              Invest in your career success. Book your 3-session journey today.
            </p>
          </div>

          <Card className="border-2 border-ego/40 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-ego/20 text-ego">Popular Choice</Badge>
            </div>
            
            <CardContent className="p-8 sm:p-12">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-2 font-archivo">3-Session Interview Mastery</h3>
                <p className="text-muted-foreground mb-6">Complete preparation from calibration to confidence</p>
                
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-5xl font-bold text-ego">€795</span>
                  <span className="text-muted-foreground line-through">€885</span>
                </div>
                <p className="text-sm text-muted-foreground">Save €90 vs individual sessions</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "3 personalized coaching sessions",
                    "300 minutes total (5 hours)",
                    "Video recordings & transcripts",
                    "Live interview roleplay",
                    "Personalized micro-habits plan",
                    "30-day email follow-up support",
                    "Session notes & feedback reports",
                    "Flexible scheduling"
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-ego flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full text-lg"
                  data-testid="button-calendly-session-1"
                  asChild
                >
                  <a 
                    href="https://calendly.com/PLACEHOLDER-SESSION-1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Session 1: Calibration
                  </a>
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Book your first session now. Sessions 2 & 3 scheduled during Session 1.
                </p>

                <div className="bg-background/60 rounded-lg p-4 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-ego flex-shrink-0 mt-0.5" />
                    <p className="font-semibold">Flexible & Secure:</p>
                  </div>
                  <ul className="space-y-1 ml-4 list-disc">
                    <li>Payment after first session (if satisfied)</li>
                    <li>Virtual sessions via Zoom/Google Meet</li>
                    <li>Reschedule up to 24h before session</li>
                    <li>All materials provided digitally</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Questions about the program?
            </p>
            <Button variant="outline" asChild data-testid="button-contact">
              <Link href="/contact">
                Contact Estève Directly
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 font-archivo">
              Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is this suitable for non-native English speakers?",
                a: "Absolutely! I work with international professionals regularly and use clear, simple language. We'll practice in a supportive environment where language barriers are addressed directly."
              },
              {
                q: "What if I haven't interviewed in 10+ years?",
                a: "Perfect! That's exactly who this program helps. We start from where you are and build modern interview skills step by step."
              },
              {
                q: "Do I need to prepare anything before Session 1?",
                a: "Just bring your current resume/CV and 2-3 job descriptions you're interested in. Everything else we'll work on together."
              },
              {
                q: "Can sessions be done online?",
                a: "Yes! All sessions are conducted via video call (Zoom/Google Meet), making it convenient and flexible."
              },
              {
                q: "What if I need to reschedule?",
                a: "Life happens! You can reschedule any session with 24 hours notice. Flexibility is built into the program."
              },
              {
                q: "How is this different from generic interview prep?",
                a: "Generic advice doesn't work for experienced professionals. This is personalized coaching using proven micro-habits, live practice, and emotional intelligence — not just memorizing answers."
              }
            ].map((faq, idx) => (
              <Card key={idx} className="hover-elevate" data-testid={`card-faq-${idx}`}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 border-t border-border/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4 font-archivo">
            Your Next Career Move Starts Here
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stop feeling anxious about interviews. Start feeling confident, prepared, and ready to succeed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8"
              data-testid="button-book-now"
              asChild
            >
              <a href="#booking">
                <Calendar className="mr-2 h-5 w-5" />
                Book Your First Session
              </a>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8"
              data-testid="button-explore-greenelephant"
              asChild
            >
              <Link href="/">
                Explore GreenElephant
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            Part of <Link href="/" className="text-ego hover:underline">GreenElephant.org</Link> — 
            Transforming communication since 2010
          </p>
        </div>
      </section>
    </div>
  );
}
