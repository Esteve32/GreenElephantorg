import Hero from "@/components/Hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Users, Lightbulb, Target, Shield, Sparkles, Compass } from "lucide-react";
import networkImageUrl from "@assets/generated_images/Communication_network_sacred_geometry_e5b4bd8a.png";

//todo: remove mock functionality
const lenses = [
  { icon: Brain, name: "Ego", color: "bg-ego", description: "Understanding conflict triggers" },
  { icon: Users, name: "Dynamics", color: "bg-dynamics", description: "Relationships & feedback" },
  { icon: Target, name: "Influence", color: "bg-influence", description: "Actions & decisions" },
  { icon: Lightbulb, name: "Attitude", color: "bg-attitude", description: "Growth mindset" },
  { icon: Sparkles, name: "Chaordic", color: "bg-chaordic", description: "Time use balance" },
  { icon: Compass, name: "Flow", color: "bg-flow", description: "Motivation radar" },
  { icon: Shield, name: "Alignment", color: "bg-alignment", description: "Empathy & integrity" },
  { icon: Heart, name: "Needs", color: "bg-needs", description: "Unlocking factors" },
];

const benefits = [
  "Boost Emotional Intelligence",
  "Clarify Boundaries",
  "Solve Problems Collectively",
  "Turn Conflicts Into Trust",
  "Prevent Unnecessary Drama",
  "Create Healthy Habits",
  "Balance Empathy With Self-Respect",
  "Identify Critical Needs",
  "Increase Self-Reliance",
  "Detach From Ego",
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-needs text-white">Our Framework</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            8 Lenses of Conscious Communication
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our Periodic Table organizes communication elements into eight transformative lenses
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {lenses.map((lens) => {
            const Icon = lens.icon;
            return (
              <Card key={lens.name} className="backdrop-blur-sm bg-card/50 border-white/10 hover-elevate transition-all">
                <CardHeader>
                  <div className={`${lens.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className="h-6 w-6 text-white" />
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
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              10 Benefits of Conscious Communication
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10 hover-elevate"
                >
                  <p className="text-sm font-medium">{benefit}</p>
                </div>
              ))}
            </div>
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

        <div className="grid md:grid-cols-3 gap-8">
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
