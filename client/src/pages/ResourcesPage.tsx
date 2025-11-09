import ResourceCard from "@/components/ResourceCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
          <Badge className="mb-4 bg-chaordic text-white">Learning Resources</Badge>
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
    </div>
  );
}
