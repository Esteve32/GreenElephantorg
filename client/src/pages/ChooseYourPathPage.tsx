import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, Users, Briefcase, Globe, CheckCircle2, Sparkles, Brain, Target, Zap } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { atmosphericPalette } from "@/constants/atmosphericGradient";
import { SEO } from "@/components/SEO";

const pageGradient = {
  background: `linear-gradient(180deg, 
    #000000 0%, 
    ${atmosphericPalette.space} 20%, 
    ${atmosphericPalette.highAtmosphere} 50%, 
    ${atmosphericPalette.upperAtmosphere} 100%
  )`
};

const colorStyles = {
  influence: {
    iconBg: "bg-influence",
    badge: "border-influence/50 text-influence",
    check: "text-influence",
    button: "bg-influence text-white"
  },
  dynamics: {
    iconBg: "bg-dynamics",
    badge: "border-dynamics/50 text-dynamics",
    check: "text-dynamics",
    button: "bg-dynamics text-white"
  },
  flow: {
    iconBg: "bg-flow",
    badge: "border-flow/50 text-flow",
    check: "text-flow",
    button: "bg-flow text-white"
  }
} as const;

type ColorKey = keyof typeof colorStyles;

const AUDIENCE_PATHS: Array<{
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: typeof Briefcase;
  colorKey: ColorKey;
  benefits: string[];
}> = [
  {
    id: "ceo",
    title: "For CEOs & Executives",
    subtitle: "Leadership Communication",
    description: "See what your team won't tell you. Discover your blind spots, align your leadership presence, and communicate with the clarity your role demands.",
    href: "/for-ceos",
    icon: Briefcase,
    colorKey: "influence",
    benefits: [
      "Reveal communication blind spots your team won't surface",
      "Align your leadership presence with your intentions",
      "Understand how your style impacts team dynamics",
      "Get actionable insights to elevate executive communication"
    ]
  },
  {
    id: "ea",
    title: "For Executive Assistants",
    subtitle: "Managing Up & Stakeholder Dynamics",
    description: "Navigate complex executive relationships with confidence. Master the art of managing up, setting boundaries, and becoming a trusted strategic partner.",
    href: "/for-executive-assistants",
    icon: Users,
    colorKey: "dynamics",
    benefits: [
      "Map your managing up patterns across different executives",
      "Understand your default responses under pressure",
      "Identify strengths in stakeholder navigation",
      "Get prompts for difficult executive conversations"
    ]
  },
  {
    id: "va",
    title: "For Virtual Assistants",
    subtitle: "Remote Communication Mastery",
    description: "Bridge time zones and build trust without meeting in person. Master async communication, client boundaries, and the patterns that make remote work thrive.",
    href: "/for-virtual-assistants",
    icon: Globe,
    colorKey: "flow",
    benefits: [
      "Understand your async communication style",
      "Identify patterns in client boundary-setting",
      "Discover strengths in remote relationship building",
      "Get prompts for difficult client conversations"
    ]
  }
];

const SATELLITE_SCAN_FEATURES = [
  { icon: Brain, text: "129 questions across 8 communication lenses" },
  { icon: Target, text: "Personalized dashboard delivered in 48-72 hours" },
  { icon: Zap, text: "Access to our curated prompt library" },
  { icon: Sparkles, text: "Retake assessments to track your growth" }
];

export default function ChooseYourPathPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16" style={pageGradient}>
      <SEO 
        title="Choose Your Path | Communication Assessment by Role | GreenElephant"
        description="Find the right communication assessment for your role. Tailored Satellite Scan insights for CEOs, Executive Assistants, and Virtual Assistants. €99.95 to map your patterns across 8 lenses."
        keywords="self-awareness assessment, personal development path, emotional intelligence assessment, career change guidance, communication assessment, executive coaching, EA training, virtual assistant development, leadership communication, professional development, future-proof career, self-reflection quiz"
        canonicalPath="/choose-your-path"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Choose Your Path", url: "/choose-your-path" }
        ]}
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 bg-needs text-white">Your Communication Journey</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg" style={{ fontFamily: 'Archivo, sans-serif' }}>
            Choose Your Path
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
            Every role has unique communication challenges. Select your path to discover how the Satellite Scan reveals your patterns and unlocks your potential.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {AUDIENCE_PATHS.map((path, index) => {
            const Icon = path.icon;
            const styles = colorStyles[path.colorKey];
            return (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <Card className="h-full backdrop-blur-sm bg-card/50 border-white/10 hover-elevate">
                  <CardHeader className="pb-4">
                    <div className={`p-3 rounded-lg ${styles.iconBg} w-fit mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline" className={`w-fit mb-2 ${styles.badge}`}>
                      {path.subtitle}
                    </Badge>
                    <CardTitle className="text-2xl text-white">{path.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-white/70">{path.description}</p>
                    
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-white/90">What you'll discover:</p>
                      <ul className="space-y-2">
                        {path.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                            <CheckCircle2 className={`w-4 h-4 ${styles.check} mt-0.5 flex-shrink-0`} />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 space-y-3">
                      <Link href={path.href}>
                        <Button 
                          className={`w-full ${styles.button}`}
                          data-testid={`button-path-${path.id}`}
                        >
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href="/scan">
                        <Button 
                          variant="outline" 
                          className="w-full border-white/20 text-white/80"
                          data-testid={`button-scan-${path.id}`}
                        >
                          Start Satellite Scan
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="backdrop-blur-sm bg-gradient-to-br from-needs/20 to-alignment/20 border-white/20">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="mb-4 bg-needs/20 text-needs border-needs/30">
                    <Sparkles className="w-3 h-3 mr-1" />
                    The Satellite Scan
                  </Badge>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    €99.95 to Map Your Communication DNA
                  </h2>
                  <p className="text-white/70 mb-6">
                    No matter your role, the Satellite Scan gives you a complete picture of your communication patterns across 8 lenses. Stop guessing why some conversations flow and others create friction.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {SATELLITE_SCAN_FEATURES.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-white/80">
                        <feature.icon className="w-5 h-5 text-needs flex-shrink-0" />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/scan">
                    <Button size="lg" className="bg-needs text-white" data-testid="button-start-scan-cta">
                      Start Your Satellite Scan
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <div className="text-center">
                  <div className="text-7xl font-bold text-white mb-2">8</div>
                  <p className="text-xl text-white/70 mb-4">Communication Lenses</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["Influence", "Attitude", "Chaordic", "Flow", "Alignment", "Needs", "Ego", "Dynamics"].map((lens) => (
                      <Badge key={lens} variant="outline" className="border-white/30 text-white/70">
                        {lens}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mt-12"
        >
          <p className="text-white/50 mb-4">Not sure which path is right for you?</p>
          <Link href="/connect">
            <Button variant="ghost" className="text-white/70" data-testid="button-contact-us">
              Talk to Us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
