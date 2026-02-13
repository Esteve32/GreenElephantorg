import ResourceCard from "@/components/ResourceCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import montVentouxUrl from "@assets/generated_images/mont_ventoux_provence_lavender_landscape.png";
import logoUrl from "@assets/GE logo 512x512 transparent BG 2023 _1762732324529.png";

//todo: remove mock functionality
const resources = [
  {
    title: "The Conscious Communication Handbook",
    description: "A comprehensive guide to transforming conflicts into trust using the Periodic Table framework. Includes 50+ practical exercises.",
    type: "Ebook" as const,
    format: "PDF, 120 pages",
    audience: "All Levels",
  },
  {
    title: "TEAL Team Communication Template",
    description: "Ready-to-use Notion workspace for implementing microhabits in your organization with templates for 1:1s, retrospectives, and more.",
    type: "Notion Kit" as const,
    audience: "Startup Founders",
  },
  {
    title: "Compassionate Dialogue GPT",
    description: "AI assistant trained on NVC principles to help you craft empathetic responses in challenging communication situations.",
    type: "GPT Assistant" as const,
    audience: "Executive Assistants",
  },
  {
    title: "Executive Assistant Mastery Path",
    description: "6-week guided learning journey through the 8 lenses with weekly prompts, reflections, and community support.",
    type: "Learning Path" as const,
    format: "Online, self-paced",
    audience: "Executive Assistants",
  },
  {
    title: "Microhabit Design Toolkit",
    description: "Interactive Notion template for designing and tracking your personal communication microhabits with the trigger-action-reward framework.",
    type: "Notion Kit" as const,
    audience: "All Levels",
  },
  {
    title: "Conflict Transformation Ebook",
    description: "Deep dive into the Ego and Dynamics lenses with real case studies from TEAL organizations.",
    type: "Ebook" as const,
    format: "PDF, 80 pages",
    audience: "Startup Founders",
  },
];

const learningPaths = [
  {
    title: "Beginner: Communication Foundations",
    weeks: 4,
    focus: "Needs & Alignment lenses",
  },
  {
    title: "Intermediate: Leadership Communication",
    weeks: 6,
    focus: "Influence & Dynamics lenses",
  },
  {
    title: "Advanced: Collective Intelligence",
    weeks: 8,
    focus: "All 8 lenses integration",
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-chaordic text-black">Learning Resources</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Resources Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ebooks, Notion kits, GPT assistants, and learning paths to support your conscious communication journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {resources.map((resource) => (
            <ResourceCard key={resource.title} {...resource} />
          ))}
        </div>

        <div className="backdrop-blur-sm bg-card/50 border border-white/10 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Structured Learning Paths</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <Card key={path.title} className="backdrop-blur-sm bg-background/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <Badge variant="outline" className="border-white/20">{path.weeks} weeks</Badge>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground block mb-1">Focus:</span>
                    <span>{path.focus}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full backdrop-blur-sm bg-white/5"
                    data-testid={`button-start-${path.title.split(':')[0].toLowerCase()}`}
                    onClick={() => console.log('Starting learning path:', path.title)}
                  >
                    Start Path
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>Personalized Learning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Not sure where to start? Take the Satellite Scan™ assessment to receive personalized resource recommendations based on your communication patterns.
              </p>
              <Button 
                className="w-full bg-needs hover:bg-needs/90"
                data-testid="button-take-assessment"
                onClick={() => console.log('Taking assessment')}
              >
                Take Assessment
              </Button>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>Community Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                All resource downloads include access to our community forum where you can connect with others practicing conscious communication.
              </p>
              <Button 
                variant="outline"
                className="w-full backdrop-blur-sm bg-white/5"
                data-testid="button-join-community"
                onClick={() => console.log('Joining community')}
              >
                Join Community
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Mont Ventoux Landscape Footer */}
      <section 
        className="relative min-h-[70vh]"
        aria-label="Mont Ventoux landscape"
      >
        {/* Base background gradient */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: `linear-gradient(to bottom,
              #000000 0%,
              #050a14 15%,
              #0a1424 30%,
              #081020 50%,
              #050a14 70%,
              #020408 85%,
              #000000 100%
            )`
          }}
        />
        
        {/* Mont Ventoux image with gentle top gradient showing sky */}
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: `url(${montVentouxUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            backgroundRepeat: 'no-repeat',
            maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 8%, rgba(0,0,0,0.6) 15%, rgba(0,0,0,0.85) 22%, black 30%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 8%, rgba(0,0,0,0.6) 15%, rgba(0,0,0,0.85) 22%, black 30%, black 100%)'
          }}
        />
        
        {/* Bottom gradient overlay to fade to black */}
        <div 
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ 
            height: '25%',
            background: `linear-gradient(to top,
              #000000 0%,
              rgba(0, 0, 0, 0.9) 30%,
              rgba(0, 0, 0, 0.6) 60%,
              rgba(0, 0, 0, 0.2) 85%,
              transparent 100%
            )`
          }}
        />
        
        <div className="absolute bottom-8 left-0 right-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <p className="text-white/60 text-sm mb-4">Mont Ventoux, Provence</p>
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
    </div>
  );
}
