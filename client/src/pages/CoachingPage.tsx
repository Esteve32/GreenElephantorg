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
    price: "€295",
    packageId: "1on1-single",
    features: [
      "120-minute deep-dive session",
      "Personalized framework analysis",
      "Action plan with 3 micro-habits",
      "Session recording & transcript",
    ],
  },
  {
    title: "Coaching Journey",
    subtitle: "Communication Clarity & Influence Boost",
    type: "1:1" as const,
    sessions: "Unlimited",
    duration: "~6 months",
    price: "€2,980",
    packageId: "coaching-journey",
    features: [
      "AI-powered Satellite Scan™ (90 questions, ~120 min)",
      "Clarity & goal-setting session",
      "Biweekly coaching sessions (2 hours each)",
      "Unlimited 20-min check-in calls",
      "Ongoing messaging support",
      "Personalized micro-habit plan",
      "Lens video library access",
      "Support until objectives are reached",
    ],
    highlighted: true,
    idealFor: "Executive Assistants, Office Managers, Admin Professionals & Team Enablers",
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

        <div className="backdrop-blur-sm bg-needs/10 border border-needs/20 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-6">The Coaching Process</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            A systematic journey from awareness to transformation, supported every step of the way
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-needs/30 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-needs">1</span>
              </div>
              <h3 className="font-semibold mb-2 text-lg">Discovery</h3>
              <p className="text-sm text-muted-foreground">AI-powered Satellite Scan™ reveals your unique communication patterns and blindspots</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-needs/30 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-needs">2</span>
              </div>
              <h3 className="font-semibold mb-2 text-lg">Design</h3>
              <p className="text-sm text-muted-foreground">Together we create personalized microhabits aligned with your goals and context</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-needs/30 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-needs">3</span>
              </div>
              <h3 className="font-semibold mb-2 text-lg">Practice</h3>
              <p className="text-sm text-muted-foreground">Biweekly sessions and ongoing support as you integrate new patterns into daily life</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-needs/30 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-needs">4</span>
              </div>
              <h3 className="font-semibold mb-2 text-lg">Mastery</h3>
              <p className="text-sm text-muted-foreground">Sustained transformation with video library access and integration until objectives are met</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">What to Expect</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Clarity Session:</strong> We begin with deep listening to understand your communication challenges and aspirations.
                </p>
                <p>
                  <strong className="text-foreground">Ongoing Sessions:</strong> Biweekly 2-hour deep dives with practice assignments between sessions.
                </p>
                <p>
                  <strong className="text-foreground">Support:</strong> Unlimited 20-minute check-ins and messaging support when you need guidance.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">Our Approach</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Every coaching relationship is a sacred space for transformation. We approach each session with principles of deep listening, non-judgment, compassionate presence, and shared commitment to growth.
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
