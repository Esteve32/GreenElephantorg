import CoachingPackage from "@/components/CoachingPackage";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import coachImageUrl from "@assets/generated_images/Coach_professional_headshot_authentic_bb42e965.png";

const packages = [
  {
    title: "Single Session",
    type: "1:1" as const,
    sessions: 1,
    duration: "one-time",
    price: "€180",
    packageId: "1on1-single",
    features: [
      "90-minute deep-dive session",
      "Personalized framework analysis",
      "Action plan with 3 micro-habits",
      "Session recording & transcript",
    ],
  },
  {
    title: "Transformation Package",
    type: "1:1" as const,
    sessions: 6,
    duration: "3 months",
    price: "€840",
    packageId: "1on1-package",
    features: [
      "6 x 90-minute sessions",
      "Complete periodic table mastery",
      "Weekly practice assignments",
      "Email support between sessions",
      "Lifetime access to recordings",
      "Save €240 vs. single sessions",
    ],
    highlighted: true,
  },
  {
    title: "Team Workshop",
    type: "Team" as const,
    sessions: 1,
    duration: "half-day",
    price: "€1,200",
    packageId: "team-workshop",
    features: [
      "Half-day intensive (up to 10 people)",
      "Live framework mapping",
      "Team communication audit",
      "Custom micro-habit playbook",
      "30-day follow-up session",
      "Just €120 per person",
    ],
  },
];

export default function CoachingPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-needs text-white">Personal & Team Coaching</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Stop Repeating the Same Communication Patterns
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Personalized coaching transforms your reactive patterns into conscious responses—one conversation at a time
          </p>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
            Whether you're an Executive Assistant navigating power dynamics, a TEAL founder building collaborative culture, or a designer seeking authentic dialogue—you'll gain practical frameworks and compassionate support.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {packages.map((pkg) => (
            <CoachingPackage key={pkg.title} {...pkg} />
          ))}
        </div>

        <div className="backdrop-blur-sm bg-card/50 border border-white/10 rounded-2xl overflow-hidden mb-16">
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
            <div className="flex items-center justify-center">
              <img 
                src={coachImageUrl} 
                alt="Estève Pannetier" 
                className="rounded-2xl w-full max-w-sm"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">Meet Your Coach</h2>
              <h3 className="text-xl text-needs mb-4">Estève Pannetier</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                With over a decade of experience in design thinking, UX research, and conscious communication, 
                Estève brings a unique blend of analytical rigor and compassionate facilitation to every session.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Co-founder of GreenElephant and Head of AI & UX Research at Arbora, Estève has supported 
                hundreds of leaders in transforming their communication patterns through the microhabit methodology.
              </p>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <span className="text-needs">✓</span>
                  <span>Certified in Nonviolent Communication (NVC)</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-needs">✓</span>
                  <span>Design Thinking Strategist</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-needs">✓</span>
                  <span>Human Factors & Ergonomics Expert</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">What to Expect</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Session 1:</strong> We begin with deep listening to understand your communication challenges and aspirations.
                </p>
                <p>
                  <strong className="text-foreground">Sessions 2-3:</strong> Together we design personalized microhabits aligned with your Satellite Scan results.
                </p>
                <p>
                  <strong className="text-foreground">Ongoing:</strong> Practice, reflect, and refine as we witness your transformation unfold.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">Our Approach</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Every coaching relationship is a sacred space for transformation. We approach each session with ACIM-aligned principles of joining, non-judgment, and shared purpose.
                </p>
                <p>
                  Rather than performance pressure, we celebrate willingness and progress. Rather than fixing, we facilitate your innate capacity for conscious communication.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
