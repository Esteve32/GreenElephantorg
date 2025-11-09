import RetreatCard from "@/components/RetreatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import retreatImageUrl from "@assets/generated_images/Retreat_venue_meditation_space_c8b2bd31.png";
import microhabitImageUrl from "@assets/2103 Micro-Habit_1762730943460.png";

//todo: remove mock functionality
const retreats = [
  {
    title: "Spring Awakening Retreat",
    season: "Spring 2024",
    date: "April 15-17, 2024",
    location: "Lake Como, Italy",
    capacity: "Limited to 12 participants",
    imageUrl: retreatImageUrl,
    description: "A transformative weekend exploring conscious communication in a serene lakeside setting.",
    price: "€1,200",
  },
  {
    title: "Summer Intensive: TEAL Leadership",
    season: "Summer 2024",
    date: "July 8-14, 2024",
    location: "Finnish Archipelago",
    capacity: "Limited to 16 participants",
    imageUrl: retreatImageUrl,
    description: "Week-long deep dive into building TEAL organizations through conscious dialogue.",
    price: "€2,800",
  },
  {
    title: "Autumn Reflection Retreat",
    season: "Autumn 2024",
    date: "September 20-22, 2024",
    location: "Provence, France",
    capacity: "Limited to 10 participants",
    imageUrl: retreatImageUrl,
    description: "Intimate gathering focused on integrating microhabits for sustained transformation.",
    price: "€1,400",
  },
];

export default function RetreatsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-needs text-white">Seasonal Events</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Premium Retreats
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your communication patterns in serene, intentional spaces designed for deep learning and connection
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
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
