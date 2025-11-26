import RetreatCard from "@/components/RetreatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Users, Video, FlaskConical, BookText } from "lucide-react";
import { Link } from "wouter";
import laplandImageUrl from "@assets/generated_images/Tonttumäki_Finland_northern_lights_retreat_a23361d7.png";
import provenceImageUrl from "@assets/generated_images/Aix-en-Provence_France_lavender_retreat_85bbb302.png";
import microhabitImageUrl from "@assets/2103 Micro-Habit_1762730943460.png";

const retreats = [
  {
    title: "Equinoxe Retreat Provence",
    season: "Autumn Equinox 2028",
    date: "September 20-25, 2028",
    location: "Aix-en-Provence, France",
    capacity: "Limited to 14 participants",
    imageUrl: provenceImageUrl,
    description: "Transform how you see conflict in the lavender fields of Provence. This 5-day immersive experience (approx. 25 hours) focuses on seeing conflicts differently, looking beyond ego and triggers, and building trust regardless of emotional temperature.",
    price: "€2,890",
    priceNote: "Price excludes travel only",
    retreatType: "provence" as const,
  },
  {
    title: "Equinoxe Retreat Lapland",
    season: "Spring Equinox 2028",
    date: "March 18-23, 2028",
    location: "Levi, Finland",
    capacity: "Limited to 12 participants",
    imageUrl: laplandImageUrl,
    description: "Journey to Levi's Arctic serenity for a transformative spring retreat. Experience the peace and quiet of Finnish nature while deepening your conscious communication practice in pristine wilderness.",
    price: "€2,890",
    priceNote: "Price excludes travel only",
    retreatType: "lapland" as const,
  },
];

export default function RetreatsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-needs text-white">Equinoxe Experiences</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Transform How You See Conflict
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            5-day immersive retreats (approx. 25 hours) focusing on seeing conflicts differently, looking beyond ego and triggers, and building trust regardless of emotional temperature
          </p>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
            In Levi's Arctic serenity or Provence's lavender fields, you'll practice microhabits in a held space of deep presence—then return home with your personalized playbook and sustainable transformation, not just inspiration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
          {retreats.map((retreat) => (
            <RetreatCard key={retreat.title} {...retreat} />
          ))}
        </div>

        <div className="backdrop-blur-sm bg-card/50 border border-white/10 rounded-2xl p-8 md:p-12 mb-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Pricing Transparency</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-needs">What's Included in €2,890</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-needs mt-1">✓</span>
                  <span>5 nights accommodation (shared room)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-needs mt-1">✓</span>
                  <span>All meals (breakfast, lunch, dinner)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-needs mt-1">✓</span>
                  <span>25 hours of facilitated sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-needs mt-1">✓</span>
                  <span>Retreat materials & personalized playbook</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-needs mt-1">✓</span>
                  <span>90-day integration support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-needs mt-1">✓</span>
                  <span>Alumni community access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-needs mt-1">✓</span>
                  <span>Recorded sessions & lifetime materials access</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                <strong>Not included:</strong> Travel to/from location. Single room upgrade available for +€400.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-destructive">Cancellation & Refund Policy</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[80px]">60+ days:</span>
                  <span>Full refund minus €100 admin fee</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[80px]">30-59 days:</span>
                  <span>50% refund</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[80px]">&lt;30 days:</span>
                  <span>No refund (credit toward future retreat)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[80px]">Emergency:</span>
                  <span>Medical/family emergencies reviewed case-by-case with documentation</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                We hold your spot with care. If you need to cancel, we'll work with you to find the best solution.
              </p>
            </div>
          </div>
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
              <div className="w-12 h-12 rounded-full bg-needs/20 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-6 w-6 text-needs" />
              </div>
              <div>
                <p className="font-semibold mb-1">Personalized Microhabit Playbook</p>
                <p className="text-sm text-muted-foreground">Custom-designed practices based on your Satellite Scan and retreat insights</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-needs/20 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-6 w-6 text-needs" />
              </div>
              <div>
                <p className="font-semibold mb-1">90-Day Integration Support</p>
                <p className="text-sm text-muted-foreground">Weekly group calls and email guidance as you apply what you've learned</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-needs/20 flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-needs" />
              </div>
              <div>
                <p className="font-semibold mb-1">Alumni Community Access</p>
                <p className="text-sm text-muted-foreground">Ongoing connection with fellow practitioners for mutual support</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-needs/20 flex items-center justify-center flex-shrink-0">
                <Video className="h-6 w-6 text-needs" />
              </div>
              <div>
                <p className="font-semibold mb-1">Recorded Sessions & Materials</p>
                <p className="text-sm text-muted-foreground">Lifetime access to framework teachings and practice recordings</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Research Partners</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our methodology is developed in collaboration with leading institutions
          </p>
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            <Badge variant="outline" className="px-6 py-3 text-base border-white/20 bg-card/30">
              Aalto Design Factory
            </Badge>
            <Badge variant="outline" className="px-6 py-3 text-base border-white/20 bg-card/30">
              TEAL Organizations
            </Badge>
            <Badge variant="outline" className="px-6 py-3 text-base border-white/20 bg-card/30">
              Center for Nonviolent Communication
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Agent Bios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Meet Anu and Jonas, your guides through this transformative journey. Each brings unique expertise in conscious communication.
              </p>
              <Link href="/team" data-testid="link-team">
                <Button variant="outline" className="w-full" data-testid="button-agent-bios">
                  Meet the Team
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookText className="h-5 w-5" />
                Methodology
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Our framework is research-backed and proven. The Periodic Table maps 129 elements across 8 communication lenses.
              </p>
              <Link href="/periodic-table" data-testid="link-periodic-table">
                <Button variant="outline" className="w-full" data-testid="button-methodology">
                  Explore the Framework
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Access prompts, tools, and practical resources structured by the 8 communication lenses.
              </p>
              <Link href="/resources" data-testid="link-resources">
                <Button variant="outline" className="w-full" data-testid="button-resources">
                  Explore Resources
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
