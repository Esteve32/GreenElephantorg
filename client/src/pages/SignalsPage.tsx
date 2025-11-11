import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, AlertTriangle, MessageSquareX, Users, Brain, Heart, TrendingDown } from "lucide-react";

export default function SignalsPage() {
  const signals = [
    {
      category: "Ego Patterns",
      icon: Brain,
      color: "ego",
      patterns: [
        {
          title: "Defensive Reactions",
          description: "You immediately justify or explain when receiving feedback, before truly listening.",
          impact: "Creates walls instead of bridges, preventing genuine understanding.",
        },
        {
          title: "Need to Be Right",
          description: "Conversations become debates where winning matters more than connection.",
          impact: "Damages relationships and closes pathways to collaborative solutions.",
        },
        {
          title: "Judgment & Labeling",
          description: "You quickly categorize people or their ideas as 'good/bad', 'right/wrong'.",
          impact: "Blocks empathy and prevents seeing the full complexity of situations.",
        },
      ],
    },
    {
      category: "Influence Dynamics",
      icon: Users,
      color: "influence",
      patterns: [
        {
          title: "Dominating Conversations",
          description: "You frequently interrupt or don't leave space for others to contribute.",
          impact: "Silences valuable perspectives and creates resentment.",
        },
        {
          title: "Passive Silence",
          description: "You withhold your truth to avoid conflict or judgment.",
          impact: "Builds unexpressed tension and prevents authentic relationship.",
        },
        {
          title: "Manipulation Over Honesty",
          description: "You hint, suggest, or 'manage' rather than state needs directly.",
          impact: "Creates confusion and erodes trust over time.",
        },
      ],
    },
    {
      category: "Alignment Breakdown",
      icon: TrendingDown,
      color: "alignment",
      patterns: [
        {
          title: "Mismatched Expectations",
          description: "You assume others share your understanding without checking.",
          impact: "Leads to disappointment, frustration, and project failures.",
        },
        {
          title: "Avoiding Difficult Conversations",
          description: "You postpone addressing issues, hoping they'll resolve themselves.",
          impact: "Problems compound, relationships deteriorate, trust erodes.",
        },
        {
          title: "Surface Agreement",
          description: "Everyone nods but no one commits; consensus without genuine alignment.",
          impact: "Decisions collapse during implementation, wasting time and energy.",
        },
      ],
    },
    {
      category: "Needs Disconnection",
      icon: Heart,
      color: "needs",
      patterns: [
        {
          title: "Unmet Needs Driving Behavior",
          description: "You act from unacknowledged needs for recognition, control, or belonging.",
          impact: "Creates reactive patterns that sabotage what you truly want.",
        },
        {
          title: "Confusing Strategies with Needs",
          description: "You insist on a specific solution rather than exploring the underlying need.",
          impact: "Limits creative possibilities and creates unnecessary conflict.",
        },
        {
          title: "Neglecting Self-Care",
          description: "You override your needs to meet others' expectations or demands.",
          impact: "Leads to burnout, resentment, and deteriorating relationships.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-destructive text-white">Early Warning System</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Archivo, sans-serif' }}>
            Spot the Disconnection Before It Hardens
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Learn to recognize the subtle signals when your communication is creating distance instead of connection—before trust erodes beyond repair
          </p>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
            Awareness is the first step to transformation. When you can name the pattern, you can choose differently.
          </p>
        </div>

        <div className="backdrop-blur-sm bg-destructive/10 border border-destructive/20 rounded-2xl p-8 md:p-12 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">The Cost of Unconscious Communication</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Every conversation either builds trust or erodes it. When these patterns go unnoticed, 
              they compound exponentially—damaging relationships, blocking innovation, and creating 
              organizational dysfunction that costs time, energy, and opportunities.
            </p>
            <p className="text-muted-foreground">
              <strong>Good news:</strong> Simply recognizing these signals is already transforming your awareness.
            </p>
          </div>
        </div>

        <div className="space-y-12 mb-16">
          {signals.map((signalCategory) => {
            const Icon = signalCategory.icon;
            return (
              <div key={signalCategory.category}>
                <div className="flex items-center gap-3 mb-6">
                  <Icon className={`h-8 w-8 text-${signalCategory.color}`} />
                  <h2 className="text-3xl font-bold">{signalCategory.category}</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {signalCategory.patterns.map((pattern, idx) => (
                    <Card key={idx} className="backdrop-blur-sm bg-card/50 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-lg">{pattern.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{pattern.description}</p>
                        <div className="pt-3 border-t border-white/10">
                          <p className="text-xs text-destructive font-semibold mb-1">Impact:</p>
                          <p className="text-xs text-muted-foreground">{pattern.impact}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <MessageSquareX className="h-8 w-8 text-needs mb-3" />
              <CardTitle>What Happens When Ignored</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• Teams fracture into silos of misunderstanding</p>
              <p>• Innovation dies as psychological safety evaporates</p>
              <p>• Talented people leave, citing "cultural fit" issues</p>
              <p>• Projects fail not from lack of skill, but communication breakdown</p>
              <p>• Leaders burn out trying to manage symptoms instead of root causes</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <Heart className="h-8 w-8 text-alignment mb-3" />
              <CardTitle>The Path Forward</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Conscious communication isn't about perfection—it's about awareness and practice.</p>
              <p>Our Periodic Table framework gives you concrete microhabits to replace these patterns with connection-building alternatives.</p>
              <p>Through retreats, coaching, and consulting, we guide you from recognition to transformation.</p>
            </CardContent>
          </Card>
        </div>

        <div className="backdrop-blur-sm bg-needs/10 border border-needs/20 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform These Patterns?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Take our diagnostic to discover which path—retreats, coaching, or consulting—best supports your journey.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/choose-your-path">
              <Button 
                size="lg"
                className="bg-needs hover:bg-needs/90 text-white min-w-[200px]"
                data-testid="button-choose-path"
              >
                Choose Your Path
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/periodic-table">
              <Button 
                size="lg"
                variant="outline"
                className="min-w-[200px]"
                data-testid="button-explore-framework"
              >
                Explore the Framework
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
