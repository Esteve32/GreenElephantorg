import RetreatCard from "@/components/RetreatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import retreatImageUrl from "@assets/generated_images/Retreat_venue_meditation_space_c8b2bd31.png";
import microhabitImageUrl from "@assets/2103 Micro-Habit_1762730943460.png";

//todo: remove mock functionality
const retreats = [
  {
    title: "Equinoxe Retreat Lapland",
    season: "Winter Solstice 2024",
    date: "December 20-25, 2024",
    location: "Lapland, Finland",
    capacity: "Limited to 12 participants",
    imageUrl: retreatImageUrl,
    description: "Journey to the Arctic Circle for a transformative winter retreat. Experience the Northern Lights while deepening your conscious communication practice in pristine wilderness.",
    price: "€2,400",
  },
  {
    title: "Equinoxe Retreat Provence",
    season: "Spring Equinox 2025",
    date: "March 18-23, 2025",
    location: "Provence, France",
    capacity: "Limited to 14 participants",
    imageUrl: retreatImageUrl,
    description: "Immerse yourself in the lavender fields and ancient wisdom of Provence. A transformative spring gathering celebrating renewal and conscious dialogue.",
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
            Equinoxe Retreats
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Two sacred locations - Lapland and Provence - where the rhythms of nature align with the journey of conscious transformation
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
