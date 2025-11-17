import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, ArrowRight, CheckCircle2, XCircle, Brain, Heart, Users, Target, TrendingDown, Zap } from "lucide-react";
import { Link } from "wouter";

interface SignalCheck {
  id: string;
  lens: string;
  lensColor: string;
  lensColorClass: string;
  icon: typeof Brain;
  question: string;
  greenBehavior: string;
  redBehavior: string;
}

const SIGNAL_CHECKS: SignalCheck[] = [
  {
    id: "ego_expression",
    lens: "Ego",
    lensColor: "ego",
    lensColorClass: "text-ego",
    icon: Brain,
    question: "Expressing what I need",
    greenBehavior: "I state my needs and wants directly and clearly",
    redBehavior: "I rarely express directly—I hint, manage, or stay silent",
  },
  {
    id: "dynamics_leadership",
    lens: "Dynamics",
    lensColor: "dynamics",
    lensColorClass: "text-dynamics",
    icon: TrendingDown,
    question: "Leading and following in conversations",
    greenBehavior: "I fluidly shift between leading and following based on context",
    redBehavior: "I only lead or only follow—I'm stuck in one mode",
  },
  {
    id: "influence_space",
    lens: "Influence",
    lensColor: "influence",
    lensColorClass: "text-influence",
    icon: Users,
    question: "In group conversations",
    greenBehavior: "I balance speaking and listening fluidly",
    redBehavior: "I consistently dominate or completely withdraw",
  },
  {
    id: "flow_engagement",
    lens: "Flow",
    lensColor: "flow",
    lensColorClass: "text-flow",
    icon: Zap,
    question: "When engaged in challenging work",
    greenBehavior: "I balance challenge with my skills—fully engaged and motivated",
    redBehavior: "I'm either overwhelmed (anxiety) or bored (disengaged)",
  },
  {
    id: "alignment_expectations",
    lens: "Alignment",
    lensColor: "alignment",
    lensColorClass: "text-alignment",
    icon: Target,
    question: "When working on projects",
    greenBehavior: "I always clarify and confirm mutual understanding",
    redBehavior: "I rarely check—I assume we're on the same page",
  },
  {
    id: "needs_awareness",
    lens: "Needs",
    lensColor: "needs",
    lensColorClass: "text-needs",
    icon: Heart,
    question: "In difficult moments",
    greenBehavior: "I can identify my underlying needs in the moment",
    redBehavior: "I'm unaware—I just react automatically",
  },
];

// Static border and background classes for each lens
const getLensBorderClasses = (lensColor: string, isSelected: boolean) => {
  if (!isSelected) return "border-white/10";
  
  switch (lensColor) {
    case "ego": return "border-ego bg-ego/10";
    case "dynamics": return "border-dynamics bg-dynamics/10";
    case "influence": return "border-influence bg-influence/10";
    case "flow": return "border-flow bg-flow/10";
    case "alignment": return "border-alignment bg-alignment/10";
    case "needs": return "border-needs bg-needs/10";
    default: return "border-white/10";
  }
};

export default function SignalsQuizPage() {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleResponseChange = (id: string, value: string) => {
    setResponses(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setResponses({});
    setNotes("");
    setShowResults(false);
  };

  const greenCount = Object.values(responses).filter(r => r === "green").length;
  const redCount = Object.values(responses).filter(r => r === "red").length;
  const answeredCount = Object.keys(responses).length;
  const allAnswered = answeredCount === SIGNAL_CHECKS.length;

  if (showResults) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-needs text-white">Your Results</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Archivo, sans-serif' }}>
              Communication Pattern Assessment
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="backdrop-blur-sm bg-alignment/10 border border-alignment/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-alignment" />
                  <CardTitle>Conscious Patterns</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-6xl font-bold text-alignment mb-2">{greenCount}</div>
                <p className="text-muted-foreground">
                  Areas where you're grounded in conscious communication
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-destructive/10 border border-destructive/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <XCircle className="h-8 w-8 text-destructive" />
                  <CardTitle>Drift Signals</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-6xl font-bold text-destructive mb-2">{redCount}</div>
                <p className="text-muted-foreground">
                  Areas showing unconscious patterns
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10 mb-8">
            <CardHeader>
              <CardTitle>Your Pattern Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SIGNAL_CHECKS.map((check) => {
                  const Icon = check.icon;
                  const response = responses[check.id];
                  if (!response) return null;

                  return (
                    <div key={check.id} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${check.lensColorClass}`} />
                        <div>
                          <p className="font-medium">{check.lens} Lens</p>
                          <p className="text-sm text-muted-foreground">{check.question}</p>
                        </div>
                      </div>
                      {response === "green" ? (
                        <CheckCircle2 className={`h-6 w-6 ${check.lensColorClass} flex-shrink-0`} />
                      ) : (
                        <XCircle className="h-6 w-6 text-destructive flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {notes && (
            <Card className="backdrop-blur-sm bg-card/50 border-white/10 mb-8">
              <CardHeader>
                <CardTitle>Your Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{notes}</p>
              </CardContent>
            </Card>
          )}

          <Card className="backdrop-blur-sm bg-needs/10 border border-needs/20 mb-8">
            <CardHeader>
              <CardTitle>What This Means</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {redCount === 0 && (
                <div>
                  <p className="text-lg mb-3">
                    <strong>You're grounded in conscious communication.</strong>
                  </p>
                  <p className="text-muted-foreground">
                    Your awareness and practices are creating genuine connection. Continue deepening your practice and consider sharing these skills with others.
                  </p>
                </div>
              )}
              {redCount > 0 && redCount <= 2 && (
                <div>
                  <p className="text-lg mb-3">
                    <strong>You have strong foundations with some drift signals.</strong>
                  </p>
                  <p className="text-muted-foreground">
                    You have awareness in most areas, but a few unconscious patterns are present. This is the perfect time to address them before they compound.
                  </p>
                </div>
              )}
              {redCount > 2 && redCount <= 4 && (
                <div>
                  <p className="text-lg mb-3">
                    <strong>Significant drift patterns are present.</strong>
                  </p>
                  <p className="text-muted-foreground">
                    Unconscious patterns are affecting multiple areas of your communication. Addressing these now will prevent larger trust breakdowns.
                  </p>
                </div>
              )}
              {redCount > 4 && (
                <div>
                  <p className="text-lg mb-3">
                    <strong className="text-destructive">Red Alert: Unconscious patterns are driving most interactions.</strong>
                  </p>
                  <p className="text-muted-foreground">
                    These patterns are likely creating significant challenges in relationships and collaboration. The good news: awareness is the first step to transformation.
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-white/10">
                <p className="font-semibold mb-3">Recommended Next Steps:</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {redCount === 0 && (
                    <>
                      <li>• Share your practices to deepen mastery</li>
                      <li>• Join our retreats to support others on this path</li>
                      <li>• Explore the Periodic Table for advanced micro-habits</li>
                    </>
                  )}
                  {redCount > 0 && redCount <= 2 && (
                    <>
                      <li>• Practice pausing before reacting in triggering moments</li>
                      <li>• Explore micro-habits from the Periodic Table</li>
                      <li>• Consider coaching for personalized pattern transformation</li>
                    </>
                  )}
                  {redCount > 2 && (
                    <>
                      <li>• Book a coaching session to identify your critical leverage points</li>
                      <li>• Practice one micro-habit from the Periodic Table daily</li>
                      <li>• Join a retreat for deep transformation in a supportive container</li>
                      {redCount > 4 && <li>• Prioritize this work—the cost of inaction compounds quickly</li>}
                    </>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleReset}
              variant="outline"
              data-testid="button-retake-assessment"
            >
              Retake Assessment
            </Button>
            <Link href="/choose-your-path">
              <Button
                className="bg-needs hover:bg-needs/90"
                data-testid="button-choose-path"
              >
                Explore Coaching & Retreats
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-destructive text-white">Early Warning System</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Archivo, sans-serif' }}>
            Communication Pattern Quick Check
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Compare your current patterns against conscious communication practices. 
            Which side describes you more honestly?
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {SIGNAL_CHECKS.map((check, index) => {
            const Icon = check.icon;
            const selected = responses[check.id];

            return (
              <Card key={check.id} className="backdrop-blur-sm bg-card/50 border-white/10">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={`h-6 w-6 ${check.lensColorClass}`} />
                    <Badge variant="outline">{check.lens} Lens</Badge>
                  </div>
                  <CardTitle className="text-xl">{check.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleResponseChange(check.id, "green")}
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all hover-elevate ${getLensBorderClasses(check.lensColor, selected === "green")}`}
                      data-testid={`button-green-${check.id}`}
                    >
                      <CheckCircle2 
                        className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                          selected === "green" ? check.lensColorClass : "text-muted-foreground"
                        }`} 
                      />
                      <div>
                        <p className="font-medium text-sm mb-1">Conscious Pattern</p>
                        <p className="text-sm text-muted-foreground">{check.greenBehavior}</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleResponseChange(check.id, "red")}
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all hover-elevate ${
                        selected === "red"
                          ? "border-destructive bg-destructive/10"
                          : "border-white/10"
                      }`}
                      data-testid={`button-red-${check.id}`}
                    >
                      <XCircle 
                        className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                          selected === "red" ? "text-destructive" : "text-muted-foreground"
                        }`} 
                      />
                      <div>
                        <p className="font-medium text-sm mb-1">Drift Signal</p>
                        <p className="text-sm text-muted-foreground">{check.redBehavior}</p>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="backdrop-blur-sm bg-card/50 border-white/10 mb-8">
          <CardHeader>
            <CardTitle>Notes & Reflections (Optional)</CardTitle>
            <p className="text-sm text-muted-foreground">
              What patterns did you notice? Any insights or questions?
            </p>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your thoughts here..."
              className="min-h-[120px]"
              data-testid="textarea-notes"
            />
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
            size="lg"
            className="bg-needs hover:bg-needs/90 min-w-[200px]"
            data-testid="button-submit-assessment"
          >
            {allAnswered ? "See Your Results" : `Answer All (${answeredCount}/${SIGNAL_CHECKS.length})`}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {!allAnswered && answeredCount > 0 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            {SIGNAL_CHECKS.length - answeredCount} question{SIGNAL_CHECKS.length - answeredCount !== 1 ? 's' : ''} remaining
          </p>
        )}
      </div>
    </div>
  );
}
