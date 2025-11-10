import RetreatCard from "@/components/RetreatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import laplandImageUrl from "@assets/generated_images/Tonttumäki_Finland_northern_lights_retreat_a23361d7.png";
import provenceImageUrl from "@assets/generated_images/Aix-en-Provence_France_lavender_retreat_85bbb302.png";
import microhabitImageUrl from "@assets/2103 Micro-Habit_1762730943460.png";

//todo: remove mock functionality
const retreats = [
  {
    title: "Equinoxe Retreat Lapland",
    season: "Autumn Equinox 2028",
    date: "September 20-25, 2028",
    location: "Tonttumäki, Finland",
    capacity: "Limited to 12 participants",
    imageUrl: laplandImageUrl,
    description: "Journey to the Arctic Circle for a transformative autumn retreat in Tonttumäki. Experience the Northern Lights while deepening your conscious communication practice in pristine wilderness.",
    price: "€2,400",
  },
  {
    title: "Equinoxe Retreat Provence",
    season: "Spring Equinox 2028",
    date: "March 18-23, 2028",
    location: "Aix-en-Provence, France",
    capacity: "Limited to 14 participants",
    imageUrl: provenceImageUrl,
    description: "Immerse yourself in the lavender fields and ancient wisdom of Aix-en-Provence. A transformative spring gathering celebrating renewal and conscious dialogue.",
    price: "€2,200",
  },
];

export default function RetreatsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-needs text-white">Equinoxe Experiences</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Step Away to Transform Everything
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            5-day immersive retreats where nature's rhythms support your journey from reactive communication to conscious connection
          </p>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
            In Tonttumäki's Arctic silence or Provence's lavender fields, you'll practice microhabits in a held space of deep presence—then return home with sustainable transformation, not just inspiration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-24 max-w-5xl mx-auto">
          {retreats.map((retreat) => (
            <RetreatCard key={retreat.title} {...retreat} />
          ))}
        </div>

        <div className="backdrop-blur-sm bg-card/50 border border-white/10 rounded-2xl overflow-hidden mb-16">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6">The Microhabit Methodology</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our retreats are built on the microhabit framework - small, consistent practices that rewire communication patterns over time.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">1. Trigger</h3>
                  <p className="text-sm text-muted-foreground">When a specific communication moment arises...</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">2. Action</h3>
                  <p className="text-sm text-muted-foreground">I will practice this conscious response...</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">3. Reward</h3>
                  <p className="text-sm text-muted-foreground">In order to experience transformation and deeper connection.</p>
                </div>
              </div>
            </div>
            <div className="bg-background/50 p-8 md:p-12 flex items-center justify-center">
              <img 
                src={microhabitImageUrl} 
                alt="Microhabit Framework" 
                className="w-full max-w-md rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-sm bg-needs/10 border border-needs/20 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-6">What You'll Carry Home</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            These retreats don't end when you leave. Here's what supports your continued transformation:
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-needs mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold mb-1">Personalized Microhabit Playbook</p>
                <p className="text-sm text-muted-foreground">Custom-designed practices based on your Satellite Scan and retreat insights</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-needs mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold mb-1">90-Day Integration Support</p>
                <p className="text-sm text-muted-foreground">Weekly group calls and email guidance as you apply what you've learned</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-needs mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold mb-1">Alumni Community Access</p>
                <p className="text-sm text-muted-foreground">Ongoing connection with fellow practitioners for mutual support</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-needs mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold mb-1">Recorded Sessions & Materials</p>
                <p className="text-sm text-muted-foreground">Lifetime access to framework teachings and practice recordings</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>✓ All meals and accommodation</p>
              <p>✓ Daily practice sessions</p>
              <p>✓ Personalized microhabit plans</p>
              <p>✓ Satellite Scan assessment</p>
              <p>✓ Post-retreat support community</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>Who Should Attend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Executive Assistants seeking deeper impact</p>
              <p>• TEAL organization leaders</p>
              <p>• Design & Innovation students</p>
              <p>• Anyone committed to transformation</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>Testimonials</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground italic">
              "This retreat transformed how I navigate difficult conversations. The microhabit approach made sustainable change actually possible."
              <p className="mt-2 not-italic font-medium">- Sarah K., Executive Assistant</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
