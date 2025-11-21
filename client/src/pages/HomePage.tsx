import Hero from "@/components/Hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LENS_ARRAY } from "@/constants/lenses";
import { Brain, Shield, Users, HandHeart, ShieldCheck, Repeat, Scale, Target, Anchor, Feather } from "lucide-react";
import networkImageUrl from "@assets/generated_images/Communication_network_sacred_geometry_e5b4bd8a.png";

const benefits = [
  { text: "Boost Emotional Intelligence", icon: Brain },
  { text: "Clarify Boundaries", icon: Shield },
  { text: "Solve Problems Collectively", icon: Users },
  { text: "Turn Conflicts Into Trust", icon: HandHeart },
  { text: "Prevent Unnecessary Drama", icon: ShieldCheck },
  { text: "Create Healthy Habits", icon: Repeat },
  { text: "Balance Empathy With Self-Respect", icon: Scale },
  { text: "Identify Critical Needs", icon: Target },
  { text: "Increase Self-Reliance", icon: Anchor },
  { text: "Detach From Ego", icon: Feather },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-b border-white/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            From Pain to Peace: Your Path
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Understanding the problem, discovering the promise, and applying the practice
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-destructive">1</span>
              </div>
              <CardTitle className="text-2xl text-center">The Problem</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Miscommunication costs you trust, time, and peace. Every misunderstanding compounds, creating cycles of defensiveness, resentment, and disconnection.
              </p>
              <p className="text-sm text-foreground font-medium">
                The average workplace loses <span className="text-destructive">30% productivity</span> to communication breakdowns.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-needs/10 border-needs/30 ring-2 ring-needs/20">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-needs/30 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-needs">2</span>
              </div>
              <CardTitle className="text-2xl text-center">The Promise</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Conscious communication transforms conflict into connection. You'll navigate difficult conversations with clarity, set boundaries with compassion, and build relationships on genuine understanding.
              </p>
              <p className="text-sm text-foreground font-medium">
                Peace isn't the absence of conflict—it's the presence of wisdom.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-alignment/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-alignment">3</span>
              </div>
              <CardTitle className="text-2xl text-center">The Practice</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our Periodic Table framework gives you 129 practical elements organized into 8 transformative lenses. Each element is a microhabit you can apply immediately.
              </p>
              <p className="text-sm text-foreground font-medium">
                Small shifts, sustained over time, create lasting transformation.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-needs text-white">The Framework</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            8 Lenses of Conscious Communication
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Each lens reveals a different dimension of how we connect—or disconnect—from ourselves and others
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {LENS_ARRAY.map((lens) => {
            const Icon = lens.icon;
            return (
              <Card key={lens.name} className="backdrop-blur-sm bg-card/50 border-white/10 hover-elevate transition-all">
                <CardHeader>
                  <div className={`${lens.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className="h-6 w-6 text-[hsl(var(--lens-icon))]" />
                  </div>
                  <CardTitle className="text-lg">{lens.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{lens.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div 
          className="relative rounded-2xl overflow-hidden p-12 md:p-20 text-center"
          style={{
            backgroundImage: `url(${networkImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-background/85 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              What You'll Experience
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Practical skills, emotional relief, and spiritual awakening—all from transforming how you communicate
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.text}
                    className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10 hover-elevate"
                  >
                    <Icon className="h-5 w-5 mb-2 mx-auto text-needs" />
                    <p className="text-sm font-medium">{benefit.text}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground/80 mt-8 max-w-3xl mx-auto italic">
              These aren't just skills to learn—they're invitations to experience peace, connection, and wholeness in every interaction.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Who We Serve with Gratitude
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We support transformational leaders who value authentic connection
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="backdrop-blur-sm bg-card/50 border-white/10 hover-elevate">
            <CardHeader>
              <CardTitle className="text-xl">Executive Assistants</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Master the art of bridging communication gaps between leaders and teams with empathy and clarity.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10 hover-elevate">
            <CardHeader>
              <CardTitle className="text-xl">TEAL Startup Founders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Build organizations where conscious communication is the foundation of collective intelligence.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10 hover-elevate">
            <CardHeader>
              <CardTitle className="text-xl">Design & Innovation Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Learn communication frameworks that enhance collaboration and unlock creative potential.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
