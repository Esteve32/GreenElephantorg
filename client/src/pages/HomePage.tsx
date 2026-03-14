import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LENSES, type LensType } from "@/constants/lenses";
import { Link } from "wouter";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowDown, ArrowRight, Sparkles, ChevronDown, Smartphone, BarChart3, MessageSquare, Bot, Video, FileText, Play, Download, Briefcase, Users, Compass, Check, Rocket, Target, Zap, ClipboardList } from "lucide-react";
import earthOrbitUrl from "@assets/generated_images/earth_orbit_aurora_view.png";
import logoUrl from "@assets/GE logo 512x512 transparent BG 2023 _1764350733090.png";
import { atmosphericPalette, footerFadeGradient } from "@/constants/atmosphericGradient";
import { SEO } from "@/components/SEO";

function ScrollProgressLine() {
  const { scrollYProgress } = useScroll();
  
  const dotOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0]);
  const lineOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 0.5, 0]);
  
  return (
    <div className="fixed left-8 top-0 bottom-0 w-px z-40 hidden lg:block">
      {/* Background track - fades at bottom */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.2) 80%, transparent 100%)",
          opacity: lineOpacity
        }}
      />
      
      {/* Starting indicator dot at top - always visible */}
      <div 
        className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/40"
        style={{ boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)" }}
      />
      
      {/* Progress fill - fades to transparent at bottom */}
      <motion.div 
        className="absolute top-0 left-0 w-full"
        style={{ 
          height: useTransform(scrollYProgress, [0, 1], ["5%", "100%"]),
          background: "linear-gradient(180deg, hsl(var(--needs)) 0%, hsl(var(--needs)) 70%, transparent 100%)",
          boxShadow: "0 0 20px rgba(0, 153, 153, 0.5)",
          opacity: lineOpacity
        }}
      />
      
      {/* Moving indicator dot - fades out near bottom */}
      <motion.div 
        className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-needs"
        style={{ 
          top: useTransform(scrollYProgress, [0, 1], ["5%", "100%"]),
          boxShadow: "0 0 20px rgba(0, 153, 153, 0.8)",
          opacity: dotOpacity
        }}
      />
    </div>
  );
}

function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const earthY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="section-hero">
      <motion.div 
        className="absolute inset-0 bg-cover bg-top"
        style={{ 
          backgroundImage: `url(${earthOrbitUrl})`,
          y: earthY
        }}
      >
        {/* Northern Lights gradient: aurora green → purple → teal (needs) */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, 
              rgba(34, 197, 94, 0.15) 0%,
              rgba(139, 92, 246, 0.25) 30%,
              rgba(0, 153, 153, 0.35) 60%,
              hsl(var(--background)) 100%
            )`
          }}
        />
        {/* Animated aurora ribbon — slow horizontal drift */}
        <div
          className="absolute pointer-events-none animate-aurora-drift"
          style={{
            top: '25%',
            left: '-10%',
            right: '-10%',
            height: '180px',
            background: `linear-gradient(90deg,
              transparent 0%,
              rgba(0, 153, 153, 0.18) 30%,
              rgba(139, 92, 246, 0.22) 60%,
              transparent 100%
            )`,
            filter: 'blur(40px)',
            borderRadius: '50%'
          }}
        />
      </motion.div>

      {/* Static bottom-fade — outside parallax so it never shifts with the image */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "35%",
          background: "linear-gradient(to bottom, transparent 0%, #0a0a0a 100%)"
        }}
      />
      
      <motion.div 
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24"
        style={{ y: textY, opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8">
            <Sparkles className="h-4 w-4 text-needs" />
            <span className="text-sm text-muted-foreground">The Satellite Scan™</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-lg" data-testid="text-hero-title">
            Gain Altitude.<br />
            Transform Your Communication.
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md" data-testid="text-hero-subtitle">
            Your communication patterns, mapped in 90 minutes. Deep self-awareness you can act on immediately — and a personal dataset you can run through AI prompts, agents, and coaching tools for years to come.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/checkout?product=satellitescan">
              <Button 
                size="lg" 
                className="bg-needs text-white min-w-[280px]"
                data-testid="button-take-scan"
              >
                Get Your Scan - €99.95
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              className="backdrop-blur-sm bg-white/10 border-white/30 text-white min-w-[200px]"
              onClick={() => document.getElementById('problem-section')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-explore-journey"
            >
              Explore the Journey
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
        
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-white/60"
        >
          <p className="text-sm mb-2">Descend to learn more</p>
          <ArrowDown className="h-6 w-6 mx-auto" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function IsThisForYouSection() {
  return (
    <section 
      className="relative py-20"
      style={{
        background: "#0a0a0a"
      }}
      data-testid="section-is-this-for-you"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-is-this-for-you-title">
            Is This For You?
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover how the Satellite Scan helps professionals like you
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0 }}
          >
            <Link href="/for-executive-assistants">
              <Card className="h-full hover-elevate cursor-pointer border-white/10 bg-white/5 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-dynamics/20 mb-4">
                    <Briefcase className="h-6 w-6 text-dynamics" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Executive Assistants</h3>
                  <p className="text-sm text-muted-foreground mb-2">Communication training for EAs</p>
                  <span className="text-sm text-dynamics flex items-center justify-center gap-1">
                    EA communication training <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link href="/for-ceos">
              <Card className="h-full hover-elevate cursor-pointer border-white/10 bg-white/5 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-influence/20 mb-4">
                    <Target className="h-6 w-6 text-influence" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">CEOs & Executives</h3>
                  <p className="text-sm text-muted-foreground mb-2">Leadership communication coaching</p>
                  <span className="text-sm text-influence flex items-center justify-center gap-1">
                    CEO communication coaching <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/executive-coaching-assessment">
              <Card className="h-full hover-elevate cursor-pointer border-white/10 bg-white/5 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ego/20 mb-4">
                    <Users className="h-6 w-6 text-ego" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Executive Coaching</h3>
                  <p className="text-sm text-muted-foreground mb-2">Data-driven coaching assessment</p>
                  <span className="text-sm text-ego flex items-center justify-center gap-1">
                    Executive coaching assessment <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Link href="/scan">
            <Button variant="outline" className="gap-2" data-testid="button-explore-path">
              Explore Your Path <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

const lensColorClasses = {
  alignment: { bg: "bg-alignment", text: "text-alignment", bgLight: "bg-alignment/20" },
  attitude: { bg: "bg-attitude", text: "text-attitude", bgLight: "bg-attitude/20" },
  chaordic: { bg: "bg-chaordic", text: "text-chaordic", bgLight: "bg-chaordic/20" },
  needs: { bg: "bg-needs", text: "text-needs", bgLight: "bg-needs/20" },
  influence: { bg: "bg-influence", text: "text-influence", bgLight: "bg-influence/20" },
  flow: { bg: "bg-flow", text: "text-flow", bgLight: "bg-flow/20" },
  ego: { bg: "bg-ego", text: "text-ego", bgLight: "bg-ego/20" },
  dynamics: { bg: "bg-dynamics", text: "text-dynamics", bgLight: "bg-dynamics/20" },
} as const;

function PeriodicPreviewSection() {
  const sampleElements = [
    {
      symbol: "GR",
      name: "GreenBlueRed™",
      lens: "influence" as const,
      prompt: "Code every message: Blue = inform · Green = connect · Red = align. Notice what's missing."
    },
    {
      symbol: "Et",
      name: "Ego Triggers",
      lens: "ego" as const,
      prompt: "Notice the comparison: 'Am I reacting to what was said — or to what it implies about me?'"
    },
    {
      symbol: "Rq",
      name: "Conscious Request",
      lens: "needs" as const,
      prompt: "State what you need + 'Would you be willing to [action] by [date]?'"
    },
    {
      symbol: "Mi",
      name: "Mirroring",
      lens: "alignment" as const,
      prompt: "Reflect their words back: 'So what I'm hearing is…' — the fastest way to make someone feel truly heard."
    }
  ];

  return (
    <section 
      className="relative py-24"
      style={{
        background: "#0a0a0a"
      }}
      data-testid="section-periodic-preview"
    >
      {/* Vertical glow — fades in from top, peaks at centre, fades out at bottom */}
      <div className="absolute inset-0 opacity-25 pointer-events-none" 
           style={{ background: "linear-gradient(180deg, transparent 0%, #102952 40%, #102952 60%, transparent 100%)" }} />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-periodic-preview-title">
            What You'll Discover
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            127 communication elements across 8 lenses—each with ready-to-use prompts for real conversations
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {sampleElements.map((element, index) => (
            <motion.div
              key={element.symbol}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full border-white/10 bg-white/5 hover-elevate">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-md ${lensColorClasses[element.lens].bg} flex items-center justify-center text-white font-bold text-sm`}>
                      {element.symbol}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{element.name}</div>
                      <div className={`text-xs ${lensColorClasses[element.lens].text} capitalize`}>{element.lens}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    "{element.prompt}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link href="/periodic-table">
            <Button variant="outline" className="gap-2" data-testid="button-explore-periodic-table">
              Explore the Full Periodic Table <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ProductLadderSection() {
  type LensColorKey = keyof typeof lensColorClasses;
  const products: Array<{
    name: string;
    tagline: string;
    price: string;
    icon: typeof Target;
    color: LensColorKey;
    features: string[];
    cta: string;
    href: string;
    featured: boolean;
  }> = [
    {
      name: "Satellite Scan",
      tagline: "Get Your Orbit View",
      price: "€99.95",
      icon: Target,
      color: "needs",
      features: [
        "90-question diagnostic (~2 hours)",
        "8-lens communication profile",
        "Personalized 10-page PDF report",
        "Top 3 micro-habits to start"
      ],
      cta: "Get Your Scan",
      href: "/checkout?product=satellitescan",
      featured: true
    },
    {
      name: "1:1 Coaching",
      tagline: "Go Deeper",
      price: "From €295",
      icon: Rocket,
      color: "alignment",
      features: [
        "120-minute deep-dive session",
        "Framework analysis with Esteve",
        "Custom action plan",
        "Session recording included"
      ],
      cta: "Explore Coaching",
      href: "/coaching",
      featured: false
    },
    {
      name: "Coaching Journey",
      tagline: "Full Transformation",
      price: "€2,980",
      icon: Zap,
      color: "influence",
      features: [
        "~6 months of dedicated support",
        "Biweekly 2-hour coaching sessions",
        "Unlimited check-in calls",
        "Ongoing messaging support"
      ],
      cta: "Learn More",
      href: "/coaching",
      featured: false
    }
  ];

  return (
    <section 
      className="relative py-20"
      style={{
        background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--background)) 100%)"
      }}
      data-testid="section-product-ladder"
    >
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-product-ladder-title">
            Start Where You Are
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're exploring solo or going deeper with coaching, there's a path for you
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {product.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-needs text-white border-needs shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card className={`h-full flex flex-col ${product.featured ? 'border-needs/50 bg-needs/5' : 'border-white/10 bg-white/5'}`}>
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="text-center mb-6">
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${lensColorClasses[product.color].bgLight} mb-4`}>
                        <Icon className={`h-7 w-7 ${lensColorClasses[product.color].text}`} />
                      </div>
                      <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{product.tagline}</p>
                      <div className="text-2xl font-bold">{product.price}</div>
                    </div>
                    
                    <ul className="space-y-3 mb-6 flex-grow">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className={`h-4 w-4 mt-0.5 ${lensColorClasses[product.color].text} shrink-0`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link href={product.href}>
                      <Button 
                        className={`w-full ${product.featured ? 'bg-needs text-white' : ''}`}
                        variant={product.featured ? "default" : "outline"}
                        data-testid={`button-product-${product.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {product.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Not sure where to start? <Link href="/signals" className="text-needs hover:underline">Take our free 2-minute quiz</Link> to find your path.
        </motion.p>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section 
      id="problem-section" 
      className="relative min-h-[120vh] flex items-center py-32"
      style={{
        background: "#0a0a0a"
      }}
      data-testid="section-problem"
    >
      {/* High-altitude horizon glow effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ background: "linear-gradient(180deg, transparent 0%, #0a2a48 50%, transparent 100%)" }} />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-8" data-testid="text-problem-title">
            Most communication problems<br />
            come from <span className="text-influence">lack of altitude</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            When you're too close, you can't see the patterns. The triggers. The habits you repeat without realizing. 
            That's why we built a tool to give you perspective.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full bg-destructive/5 border-destructive/20">
              <CardContent className="p-8">
                <div className="text-destructive text-sm font-medium mb-4 uppercase tracking-wider">Ground Level View</div>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-destructive mt-1">✕</span>
                    <span>Conversations feel like minefields</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-destructive mt-1">✕</span>
                    <span>The same conflicts repeat endlessly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-destructive mt-1">✕</span>
                    <span>You react before you understand</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-destructive mt-1">✕</span>
                    <span>Trust erodes without you knowing why</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="h-full bg-needs/5 border-needs/20">
              <CardContent className="p-8">
                <div className="text-needs text-sm font-medium mb-4 uppercase tracking-wider">Orbital View</div>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-needs mt-1">✓</span>
                    <span>See your patterns from above</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-needs mt-1">✓</span>
                    <span>Understand your triggers before reacting</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-needs mt-1">✓</span>
                    <span>Break cycles with conscious choice</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-needs mt-1">✓</span>
                    <span>Build trust through practiced wisdom</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const LENS_ORDER: LensType[] = ["influence", "attitude", "chaordic", "flow", "alignment", "needs", "ego", "dynamics"];

const LENS_DETAILS: Record<LensType, { painSignal: string; benefit: string }> = {
  influence: {
    painSignal: "Dominating conversations or withdrawing into passive silence, using hints instead of direct requests.",
    benefit: "Balance speaking and listening fluidly, building authentic relationships through honest dialogue."
  },
  attitude: {
    painSignal: "Resisting change, clinging to fixed viewpoints, or dismissing new perspectives before exploring them.",
    benefit: "Embrace growth opportunities with curiosity, adapting your stance while staying grounded."
  },
  chaordic: {
    painSignal: "Forcing rigid order or letting chaos overwhelm, struggling to find creative structure.",
    benefit: "Navigate between order and creative chaos, finding innovation in structured flexibility."
  },
  flow: {
    painSignal: "Feeling overwhelmed by anxiety or disengaged by boredom, unable to match challenge with skill.",
    benefit: "Balance challenge with capability, achieving full engagement and sustained motivation."
  },
  alignment: {
    painSignal: "Mismatched expectations, avoiding difficult conversations, surface agreements without commitment.",
    benefit: "Clarify mutual understanding, prevent disappointment, and ensure reliable follow-through."
  },
  needs: {
    painSignal: "Acting from unacknowledged needs, confusing strategies with needs, overriding self-care.",
    benefit: "Identify underlying needs clearly, explore creative solutions, and practice self-leadership."
  },
  ego: {
    painSignal: "Defensive reactions, needing to be right, quick judgment and labeling of others.",
    benefit: "Build authentic connection, find collaborative solutions, and develop genuine empathy."
  },
  dynamics: {
    painSignal: "Stuck in one mode—always leading or always following—unable to adapt to context.",
    benefit: "Fluidly shift between roles based on what each situation needs for best outcomes."
  }
};

function FrameworkSection() {
  const [openLens, setOpenLens] = useState<LensType | null>(null);
  
  const getCirclePosition = (index: number, total: number, radius: number) => {
    const angle = (index * 360 / total) - 90;
    const radian = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius,
    };
  };

  return (
    <section 
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background: "#0a0a0a"
      }}
      data-testid="section-framework"
    >
      {/* Deep blue glow behind the wheel */}
      <div className="absolute inset-0 opacity-40 pointer-events-none" 
           style={{ background: "radial-gradient(circle at 50% 50%, #102952 0%, transparent 60%)" }} />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6" data-testid="text-framework-title">
            8 Lenses. 127 Elements.<br />
            One Complete Picture.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Built on 27 years of communication research and the Periodic Table of Conscious Communication.
          </p>
        </motion.div>

        {/* Circular lens wheel */}
        <div className="relative flex items-center justify-center" style={{ zIndex: 1 }}>
          {/* Circle container */}
          <div className="relative w-[360px] h-[360px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px]">
            {/* Decorative ring */}
            <div className="absolute inset-4 sm:inset-6 md:inset-8 rounded-full border border-white/10" />
            <div className="absolute inset-8 sm:inset-12 md:inset-16 rounded-full border border-white/5" />

            {/* Animated SVG spokes + traveling dot */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 500 500"
              preserveAspectRatio="xMidYMid meet"
              style={{ zIndex: 0 }}
              aria-hidden="true"
            >
              {/* Slowly rotating dashed orbit ring */}
              <circle
                cx="250" cy="250" r="190"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
                strokeDasharray="6 10"
                style={{ animation: 'svg-spin 40s linear infinite', transformOrigin: '250px 250px' }}
              />
              {/* Spokes — one per lens, each color-coded and stagger-pulsing */}
              {([
                [250, 60,  "#cc3333"],
                [384, 116, "#ff9933"],
                [440, 250, "#cccc33"],
                [384, 384, "#99cc33"],
                [250, 440, "#669966"],
                [116, 384, "#009999"],
                [60,  250, "#3399cc"],
                [116, 116, "#666699"],
              ] as [number, number, string][]).map(([x, y, color], i) => (
                <line
                  key={i}
                  x1="250" y1="250"
                  x2={x} y2={y}
                  stroke={color}
                  strokeWidth="1"
                  style={{
                    animation: `spoke-pulse 3s ease-in-out infinite`,
                    animationDelay: `${i * 0.38}s`,
                  }}
                />
              ))}
              {/* Teal glow dot that travels the outer ring */}
              <circle
                cx="250" cy="60" r="3.5"
                fill="rgba(0,153,153,0.75)"
                style={{ animation: 'svg-spin 8s linear infinite', transformOrigin: '250px 250px', filter: 'blur(0.5px)' }}
              />
            </svg>

            {/* Center content - Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <img 
                  src={logoUrl} 
                  alt="GreenElephant logo" 
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto opacity-80"
                />
              </div>
            </div>
            
            {/* Lens items positioned in a circle */}
            {LENS_ORDER.map((lensKey, index) => {
              const lens = LENSES[lensKey];
              const Icon = lens.icon;
              const isOpen = openLens === lensKey;
              const details = LENS_DETAILS[lensKey];
              
              const mobileRadius = 120;
              const smRadius = 160;
              const mdRadius = 190;
              
              const mobilePos = getCirclePosition(index, 8, mobileRadius);
              const smPos = getCirclePosition(index, 8, smRadius);
              const mdPos = getCirclePosition(index, 8, mdRadius);
              
              return (
                <motion.div
                  key={lens.value}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `translate(calc(-50% + ${mobilePos.x}px), calc(-50% + ${mobilePos.y}px))`,
                    zIndex: isOpen ? 100 : 10,
                  }}
                  data-testid={`lens-station-${lens.value}`}
                >
                  <style>
                    {`
                      @media (min-width: 640px) {
                        [data-testid="lens-station-${lens.value}"] {
                          transform: translate(calc(-50% + ${smPos.x}px), calc(-50% + ${smPos.y}px)) !important;
                        }
                      }
                      @media (min-width: 768px) {
                        [data-testid="lens-station-${lens.value}"] {
                          transform: translate(calc(-50% + ${mdPos.x}px), calc(-50% + ${mdPos.y}px)) !important;
                        }
                      }
                    `}
                  </style>
                  
                  <Collapsible open={isOpen} onOpenChange={(open) => setOpenLens(open ? lensKey : null)}>
                    <CollapsibleTrigger asChild>
                      <button 
                        className="group flex flex-col items-center focus:outline-none"
                        data-testid={`button-lens-${lens.value}`}
                      >
                        <div className={`${lens.color} w-8 h-8 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg ${isOpen ? 'ring-2 ring-white/40 scale-110' : ''}`}>
                          <Icon className="h-3.5 w-3.5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
                        </div>
                        <span className="text-xs sm:text-sm md:text-base font-medium text-foreground mt-0.5 whitespace-nowrap">{lens.name}</span>
                        <span className="hidden sm:block text-xs md:text-sm text-muted-foreground">{lens.code}</span>
                      </button>
                    </CollapsibleTrigger>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <CollapsibleContent forceMount>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-1/2 -translate-x-1/2 mt-2 p-3 sm:p-4 rounded-xl bg-background/95 border border-white/20 backdrop-blur-md w-[200px] sm:w-[240px] md:w-[280px] text-left shadow-xl"
                            style={{ zIndex: 200 }}
                          >
                            <p className="text-xs sm:text-sm text-white/90 mb-3 italic leading-relaxed">{lens.description}</p>
                            <div className="mb-2">
                              <p className="text-xs sm:text-sm text-destructive font-semibold mb-1 uppercase tracking-wider">Pain Signal</p>
                              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{details.painSignal}</p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-needs font-semibold mb-1 uppercase tracking-wider">Benefit</p>
                              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{details.benefit}</p>
                            </div>
                          </motion.div>
                        </CollapsibleContent>
                      )}
                    </AnimatePresence>
                  </Collapsible>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-8 md:mt-12"
        >
          <Link href="/periodic-table">
            <Button variant="outline" className="border-needs/50 text-needs hover:bg-needs/10" data-testid="button-explore-table">
              Explore the Periodic Table
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function JourneySection() {
  const steps = [
    {
      number: 1,
      title: "Take the Scan",
      description: "90 minutes. 129 questions across 8 lenses. Answer honestly—there are no wrong answers.",
      icon: Smartphone,
      details: "Complete via Typeform on any device"
    },
    {
      number: 2,
      title: "Receive Your Data",
      description: "Raw data arrives in 20-30 minutes. Your personalized dashboard is reviewed by a coach within 48-72 hours.",
      icon: BarChart3,
      details: "Queryable, actionable, yours forever"
    },
    {
      number: 3,
      title: "Unlock Value",
      description: "Access the Prompt Library, coaching videos, and downloadable resources to apply your insights immediately.",
      icon: MessageSquare,
      details: "Self-paced learning journey"
    }
  ];

  const valueItems = [
    { icon: Bot, title: "10+ AI Prompts", description: "Query your data with the Conscious Communicator GPT" },
    { icon: Video, title: "Video Coaching", description: "YouTube playlist organized by your 4-digit lens codes" },
    { icon: FileText, title: "Resources", description: "High-res visuals, worksheets, micro-habit templates" }
  ];

  return (
    <section 
      className="relative py-32"
      style={{
        background: "#0a0a0a"
      }}
      data-testid="section-journey"
    >
      {/* Atmospheric transition to deeper space */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ background: "linear-gradient(180deg, transparent 0%, #102952 50%, transparent 100%)" }} />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-journey-title">
            Your Three-Step Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From scan to insight in less than two hours. Transformation unfolds from there.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                {/* Transparent white vector icon */}
                <motion.div 
                  className="relative mb-8"
                  whileHover={{ y: -8, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-20 h-20 mx-auto flex items-center justify-center">
                    <Icon className="w-16 h-16 text-white/80" strokeWidth={1} />
                  </div>
                </motion.div>
                <div className="text-sm text-muted-foreground mb-2">Step {step.number}</div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground mb-4">{step.description}</p>
                <p className="text-sm text-needs">{step.details}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-center mb-12">What's Included</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* AI Prompts Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="flex flex-col items-center text-center"
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className="w-16 h-16 mb-4 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Bot className="w-12 h-12 text-white/80" strokeWidth={1} />
              </motion.div>
              <h4 className="font-semibold mb-1">10+ AI Prompts</h4>
              <p className="text-sm text-muted-foreground mb-4">Query your data with the Conscious Communicator GPT</p>
              
              {/* Visual preview - mini prompt cards */}
              <div className="w-full max-w-[200px] space-y-2">
                {[
                  { lens: "Needs", color: "#e74c3c" },
                  { lens: "Alignment", color: "#3498db" },
                  { lens: "Quick Wins", color: "#2ecc71" }
                ].map((p) => (
                  <div 
                    key={p.lens}
                    className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10 flex items-center gap-2"
                  >
                    <div 
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-xs text-white/70 truncate">{p.lens} Prompt</span>
                    <Sparkles className="w-3 h-3 text-white/40 ml-auto shrink-0" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Video Coaching Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col items-center text-center"
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className="w-16 h-16 mb-4 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Video className="w-12 h-12 text-white/80" strokeWidth={1} />
              </motion.div>
              <h4 className="font-semibold mb-1">Video Coaching</h4>
              <p className="text-sm text-muted-foreground mb-4">YouTube playlist organized by your 4-digit lens codes</p>
              
              {/* Visual preview - mini video thumbnails */}
              <div className="w-full max-w-[200px] grid grid-cols-2 gap-2">
                {[
                  { lens: "1100", color: "#9b59b6" },
                  { lens: "2200", color: "#f39c12" },
                  { lens: "3300", color: "#1abc9c" },
                  { lens: "4400", color: "#e91e63" }
                ].map((v) => (
                  <div 
                    key={v.lens}
                    className="aspect-video bg-white/5 backdrop-blur-sm rounded border border-white/10 flex items-center justify-center relative overflow-hidden"
                  >
                    <div 
                      className="absolute inset-0 opacity-20"
                      style={{ background: `linear-gradient(135deg, ${v.color}40, transparent)` }}
                    />
                    <Play className="w-4 h-4 text-white/50" />
                    <span className="absolute bottom-1 right-1 text-xs text-white/65">{v.lens}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Resources Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center text-center"
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className="w-16 h-16 mb-4 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <FileText className="w-12 h-12 text-white/80" strokeWidth={1} />
              </motion.div>
              <h4 className="font-semibold mb-1">Resources</h4>
              <p className="text-sm text-muted-foreground mb-4">High-res visuals, worksheets, micro-habit templates</p>
              
              {/* Visual preview - mini resource cards */}
              <div className="w-full max-w-[200px] space-y-2">
                {[
                  { title: "Periodic Table", Icon: BarChart3 },
                  { title: "Micro-habits", Icon: Sparkles },
                  { title: "Worksheet", Icon: ClipboardList }
                ].map((r) => (
                  <div 
                    key={r.title}
                    className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10 flex items-center gap-2"
                  >
                    <r.Icon className="w-3.5 h-3.5 text-white/60 shrink-0" />
                    <span className="text-xs text-white/70 truncate">{r.title}</span>
                    <Download className="w-3 h-3 text-white/40 ml-auto shrink-0" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Begin Your Ascent CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-32 pt-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6" data-testid="text-landing-title">
            Begin Your Ascent
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            The Satellite Scan reveals your unique communication patterns—the unconscious habits that shape every relationship, every conflict, every connection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/checkout?product=satellitescan">
              <Button 
                size="lg" 
                className="bg-needs hover:bg-needs/90 text-white min-w-[280px] h-14 text-lg shadow-lg"
                data-testid="button-take-scan-cta"
              >
                Get Your Scan - €99.95
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-needs font-bold">✓</span>
              <span>127 communication elements</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-needs font-bold">✓</span>
              <span>Coach-reviewed dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-needs font-bold">✓</span>
              <span>Lifetime library access</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 pt-8"
          >
            <p className="text-sm text-muted-foreground mb-4">Also explore</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/coaching">
                <Button variant="outline" className="border-white/20" data-testid="link-ea-coaching">
                  EA Coaching
                </Button>
              </Link>
              <Link href="/coaching">
                <Button variant="outline" className="border-white/20" data-testid="link-coaching">
                  Interview Coaching
                </Button>
              </Link>
              <Link href="/connect">
                <Button variant="outline" className="border-white/20" data-testid="link-team">
                  Meet the Team
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function TrustSignalsSection() {
  const stats = [
    { value: "27+", label: "Years of Research", icon: FileText },
    { value: "127", label: "Communication Elements", icon: Target },
    { value: "8", label: "Behavioral Lenses", icon: Compass },
  ];

  const trustedBy = [
    "Aalto University",
    "Reaktor",
    "Vincit",
    "Futurice",
    "Supercell",
    "Wolt",
    "Fazer",
    "Nokia",
  ];

  return (
    <section 
      className="relative py-16"
      style={{
        background: "#0a0a0a"
      }}
      data-testid="section-trust-signals"
    >
      <div className="absolute inset-0 opacity-35 pointer-events-none"
           style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, #0e3358 0%, transparent 70%)" }} />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-needs/20 mb-2 animate-float-slow"
                    style={{ animationDelay: `${index * 1.5}s` }}
                  >
                    <Icon className="h-5 w-5 text-needs" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1" data-testid={`stat-value-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>{stat.value}</div>
                  <div className="text-sm text-muted-foreground" data-testid={`stat-label-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>{stat.label}</div>
                </motion.div>
              );
            })}
          </div>

          <div className="pt-10">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-6">
              Trusted by professionals from
            </p>
            <div className="relative overflow-hidden">
              <motion.div
                className="flex gap-8 items-center"
                animate={{
                  x: ["0%", "-50%"],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 20,
                    ease: "linear",
                  },
                }}
              >
                {[...trustedBy, ...trustedBy].map((company, index) => (
                  <div 
                    key={`${company}-${index}`}
                    className="flex-shrink-0 px-6 py-3 bg-white/5 rounded-lg border border-white/10"
                    data-testid={`trust-company-${company.toLowerCase().replace(/\s+/g, '-')}-${index}`}
                  >
                    <span className="text-sm font-medium text-white/70 whitespace-nowrap">{company}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const stats = [
    {
      number: "+41%",
      title: "Self-reported improvement across 127 metrics",
      color: "#009999",
      detail: "Business owner. 12 coaching sessions over 6 months. Average score across all 127 Satellite Scan™ metrics moved from 5.7 → 8.0 out of 10. Top gains: learning intent (+7), communication efficacy (+6), storytelling (+6). Self-reported data via Typeform self-assessment. Not independently verified."
    },
    {
      number: "×2",
      title: "Communication effectiveness score doubled",
      color: "#009999",
      detail: "Senior Executive Assistant. 13 coaching sessions over 6 months. Overall self-assessment rose from 4 → 8 out of 10. Scheduling organisation: 5 → 9. Wasted communication time: 'A lot' → 'Not much'. Self-reported data via Typeform self-assessment. Not independently verified."
    },
    {
      number: "+9/10",
      title: "Biggest single-metric gain — 9 points on the 1–10 scale",
      color: "#009999",
      detail: "One coachee's score for 'Hosting — holding space for conversations' moved from 1 → 10 within 6 months. This metric sits in the Alignment lens of the Satellite Scan™. Ego withdrawal (disappearing under pressure) also dropped from 10 → 5 in the same period."
    },
    {
      number: "127",
      title: "Communication behaviours tracked in one Satellite Scan",
      color: "#009999",
      detail: "The Satellite Scan™ self-assessment covers 127 individual communication behaviours across 8 lenses: Influence, Attitude, Chaordic, Flow, Alignment, Needs, Ego, and Dynamics. Each behaviour is scored 1–10, giving a precise before-and-after picture of a coaching journey."
    },
  ];

  return (
    <section 
      className="relative py-24 md:py-32"
      style={{
        background: "#0a0a0a"
      }}
      data-testid="section-testimonials"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4" data-testid="text-testimonials-title">
            What Structured Coaching Moves
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Two coaching journeys, measured before and after with the Satellite Scan™.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Collapsible
                open={openIndex === index}
                onOpenChange={(open) => setOpenIndex(open ? index : null)}
              >
                <Card className="bg-white/5 border-white/10 transition-colors duration-200">
                  <CardContent className="p-7">
                    <div
                      className="text-6xl md:text-7xl font-bold mb-3 leading-none"
                      style={{ color: stat.color, fontFamily: 'Poppins, sans-serif' }}
                      data-testid={`stat-number-${index}`}
                    >
                      {stat.number}
                    </div>
                    <p className="text-white font-semibold text-lg leading-snug mb-4" data-testid={`stat-title-${index}`}>
                      {stat.title}
                    </p>
                    <CollapsibleTrigger asChild>
                      <button
                        className="flex items-center gap-1.5 text-xs text-white/65 hover:text-white transition-colors"
                        data-testid={`button-stat-toggle-${index}`}
                      >
                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`} />
                        {openIndex === index ? 'Less detail' : 'Detail'}
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <p className="text-xs text-white/65 leading-relaxed mt-3 pt-3">
                        {stat.detail}
                      </p>
                    </CollapsibleContent>
                  </CardContent>
                </Card>
              </Collapsible>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

function LandingSection() {
  return (
    <section 
      className="relative min-h-[80vh] overflow-hidden"
      style={{
        background: "#0a0a0a"
      }}
      data-testid="section-landing"
    >
      {/* Subtle horizon glow at the top to transition from testimonials */}
      <div className="absolute top-0 left-0 right-0 h-[30vh] opacity-20 pointer-events-none" 
           style={{ background: "linear-gradient(to bottom, #102952 0%, transparent 100%)" }} />

      {/* Base background - starts black to match TestimonialsSection, then deepens into the archipelago sky */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: `linear-gradient(to bottom,
            #0a0a0a 0%,
            #071c30 18%,
            #061828 35%,
            #051420 55%,
            #040f18 75%,
            #000000 100%
          )`
        }}
      />
      
      {/* Footer content positioned at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <img 
              src={logoUrl} 
              alt="GreenElephant logo" 
              className="w-16 h-16 mx-auto mb-4 opacity-90"
            />
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              GreenElephant.org
            </h3>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SEO 
        title="Communication Coaching for EAs, CEOs & Leaders | GreenElephant"
        description="Satellite Scan communication assessment for Executive Assistants, CEOs, and leaders. Data-driven diagnostic mapping your patterns across 8 lenses. Executive coaching and team workshops for conscious communication."
        keywords="self-awareness assessment, communication self-assessment, emotional intelligence coaching, personal development tools, career change assessment, future-proof career skills, executive assistant communication training, CEO communication coaching, executive coaching assessment, leadership communication, communication diagnostic, team alignment, EA professional development, managing up skills, conscious communication, self-reflection tools, resilience assessment, social intelligence, personal growth, ethical personal development, AI personal growth, AI-assisted communication, leadership development, ethical HR tools, HRIS alternative, self-assessment tool"
        canonicalPath="/"
        faqItems={[
          {
            question: "What is GreenElephant?",
            answer: "GreenElephant is a communication coaching practice founded on 27 years of research into conscious communication. We help professionals—especially Executive Assistants, CEOs, and leaders—understand and transform their communication patterns using our proprietary 8-lens framework and AI-powered Satellite Scan diagnostic."
          },
          {
            question: "Who is GreenElephant for?",
            answer: "GreenElephant serves professionals who want to communicate more consciously and effectively. Our primary audiences include Executive Assistants navigating complex stakeholder dynamics, CEOs and executives seeking leadership communication clarity, and teams looking to build collaborative communication culture. Anyone interested in personal growth through conscious communication can benefit."
          },
          {
            question: "How do I get started with GreenElephant?",
            answer: "The easiest way to start is with our free 2-minute Communication Pattern Quick Check, which identifies your drift signals across 6 lenses. For a deeper picture, the Satellite Scan (€99.95) maps your communication patterns across all 8 lenses with 129 questions and delivers a personalized AI-powered dashboard within 48-72 hours."
          },
          {
            question: "What is the Satellite Scan?",
            answer: "The Satellite Scan is our flagship diagnostic tool—a 129-question self-reflection assessment that maps your communication patterns across 8 lenses: Influence, Attitude, Chaordic, Flow, Alignment, Needs, Ego, and Dynamics. You receive a personalized dashboard with insights and AI-powered prompts for ongoing development. It costs €99.95."
          },
          {
            question: "What are the 8 lenses of conscious communication?",
            answer: "The 8 lenses are Influence (how you persuade and lead), Attitude (your approach to change and learning), Chaordic (structure vs. freedom in conversation), Flow (challenge-skill balance), Alignment (empathy and trust), Needs (understanding what drives you), Ego (triggers and self-awareness), and Dynamics (relationships and boundaries). Together they form a complete map of communication behavior."
          }
        ]}
      />
      <ScrollProgressLine />
      <HeroSection />
      <ProblemSection />
      <FrameworkSection />
      <PeriodicPreviewSection />
      <JourneySection />
      <IsThisForYouSection />
      <ProductLadderSection />
      <TrustSignalsSection />
      <TestimonialsSection />
      <LandingSection />
    </div>
  );
}
