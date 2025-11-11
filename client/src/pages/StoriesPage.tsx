import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Quote, ArrowRight, Sparkles } from "lucide-react";

const stories = [
  {
    name: "Sarah K.",
    role: "Executive Assistant, Tech Startup",
    transformation: "From Reactivity to Conscious Response",
    quote: "Before Equinoxe, I'd tense up whenever my CEO was frustrated. I'd either shut down or become defensive. The microhabit framework taught me to pause, acknowledge my needs, and respond from clarity instead of fear. Our relationship has completely transformed.",
    outcome: "3-month follow-up: Sarah reports 80% reduction in workplace anxiety and received promotion to Chief of Staff",
    lens: "Needs",
  },
  {
    name: "Marcus T.",
    role: "TEAL Organization Founder",
    transformation: "From Command-and-Control to Collaborative Leadership",
    quote: "I thought I was building a TEAL company, but I was still micromanaging every decision. The Provence retreat helped me see how my communication patterns were blocking self-organization. Now I ask questions instead of giving answers.",
    outcome: "Team velocity increased 40% in first quarter after implementing conscious dialogue practices",
    lens: "Self-Organization",
  },
  {
    name: "Elisa R.",
    role: "Design Innovation Student",
    transformation: "From Conflict Avoidance to Authentic Connection",
    quote: "I used to agree with everyone to keep the peace, then resent them later. The Lapland retreat taught me that honoring my truth is an act of love, not selfishness. My design critiques are now honest AND compassionate.",
    outcome: "Portfolio project selected for international exhibition; classmates describe her feedback as 'transformative'",
    lens: "Authenticity",
  },
  {
    name: "David & Ana L.",
    role: "Partners in Business & Life",
    transformation: "From Blame Cycles to Sacred Dialogue",
    quote: "We'd built a successful consulting firm but our marriage was fracturing. Every disagreement became a power struggle. Equinoxe showed us how to hold conflict as sacred - a chance to deepen understanding, not win arguments.",
    outcome: "Renewed marriage vows after Provence retreat; business revenue up 60% through aligned communication",
    lens: "Flow",
  },
];

export default function StoriesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-flow text-white">
            <Sparkles className="h-3 w-3 mr-1 inline" />
            Transformation Journeys
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            See Yourself in These Stories
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Real people facing the same communication challenges you face—and discovering a path from reactive patterns to conscious connection
          </p>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
            These aren't overnight miracles. They're the result of sustained practice, compassionate self-awareness, and the willingness to choose differently—one conversation at a time.
          </p>
        </div>

        <div className="space-y-12 mb-16">
          {stories.map((story, index) => (
            <Card key={index} className="backdrop-blur-sm bg-card/50 border-white/10 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{story.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-3">{story.role}</p>
                    <Badge variant="outline" className="text-xs">
                      {story.transformation}
                    </Badge>
                  </div>
                  <Badge className="text-xs" style={{ backgroundColor: `hsl(var(--${story.lens.toLowerCase()}))` }}>
                    {story.lens} Lens
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative pl-6 border-l-4 border-white/10">
                  <Quote className="absolute left-[-14px] top-0 h-6 w-6 text-muted-foreground/40" />
                  <p className="text-lg italic text-muted-foreground leading-relaxed">
                    {story.quote}
                  </p>
                </div>
                
                <div className="bg-background/50 rounded-lg p-6">
                  <h4 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                    Sustained Impact
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {story.outcome}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="backdrop-blur-sm bg-card/50 border border-white/10 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Write Your Story?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            These transformations happened because real people chose to practice differently. Your story of conscious communication starts with a single step.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/choose-your-path">
              <Button 
                size="lg" 
                className="bg-needs hover:bg-needs/90 text-white min-w-[220px]"
                data-testid="button-find-your-path"
              >
                Find Your Path
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline"
                className="backdrop-blur-sm bg-white/5 border-white/20 hover:bg-white/10 min-w-[220px]"
                data-testid="button-talk-to-facilitator"
              >
                Talk to a Facilitator
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground italic">
            Names and identifying details have been changed to honor participant privacy. Impact metrics are based on self-reported assessments and third-party feedback collected 3-6 months post-engagement.
          </p>
        </div>
      </div>
    </div>
  );
}
