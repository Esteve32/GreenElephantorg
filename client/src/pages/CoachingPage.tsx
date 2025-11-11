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
            Whether you're an Executive Assistant navigating power dynamics, a <a href="https://en.wikipedia.org/wiki/Teal_organisation" target="_blank" rel="noopener noreferrer" className="text-needs hover:underline">TEAL</a> founder building collaborative culture, or a designer seeking authentic dialogue—you'll gain practical frameworks and compassionate support.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {packages.map((pkg) => (
            <CoachingPackage key={pkg.title} {...pkg} />
          ))}
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

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">Your Personalized SMART Goal</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Every coaching journey begins with co-creating your unique transformation goal using the SMART framework:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-needs font-semibold mt-0.5">S</span>
                    <span><strong className="text-foreground">Specific:</strong> Crystal-clear communication outcomes tailored to your context</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-needs font-semibold mt-0.5">M</span>
                    <span><strong className="text-foreground">Measurable:</strong> Concrete indicators you can track and celebrate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-needs font-semibold mt-0.5">A</span>
                    <span><strong className="text-foreground">Achievable:</strong> Ambitious yet realistic within your current life</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-needs font-semibold mt-0.5">R</span>
                    <span><strong className="text-foreground">Relevant:</strong> Aligned with your deepest values and aspirations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-needs font-semibold mt-0.5">T</span>
                    <span><strong className="text-foreground">Time-bound:</strong> Clear milestones with realistic timeframes</span>
                  </li>
                </ul>
                <p className="pt-2 text-foreground font-medium">
                  We continue coaching until you reach your goal—not for a fixed duration.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">Total Communication Transformation</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  This isn't just coaching—it's personal transformation that ripples through every aspect of your life:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-needs mt-1">•</span>
                    <span><strong className="text-foreground">Human Conversations:</strong> Navigate difficult dialogues with colleagues, partners, family with confidence and clarity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-needs mt-1">•</span>
                    <span><strong className="text-foreground">AI Prompting:</strong> Learn to communicate with AI tools in ways that unlock deeper insights and better outcomes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-needs mt-1">•</span>
                    <span><strong className="text-foreground">Self-Talk:</strong> Transform your inner dialogue from criticism to compassionate self-leadership</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-needs mt-1">•</span>
                    <span><strong className="text-foreground">Written Communication:</strong> Craft emails, messages, and documents that land with impact and empathy</span>
                  </li>
                </ul>
                <p className="pt-2">
                  Whether you're prompting ChatGPT or presenting to your board, the same conscious communication principles apply—and transform everything.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="backdrop-blur-sm bg-card/50 border border-white/10 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl font-bold mb-4">Limited Availability</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We limit coaching engagements to ensure each partnership receives the depth of attention it deserves. 
            Our commitment is to your transformation, not volume—which means working with a select number of 
            clients who are ready for meaningful change.
          </p>
        </div>
      </div>
    </div>
  );
}
