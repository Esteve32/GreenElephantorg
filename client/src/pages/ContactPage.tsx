import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const { toast } = useToast();

  const intents = [
    { id: "retreats", label: "Retreats", icon: Calendar, color: "bg-needs" },
    { id: "coaching", label: "Coaching", icon: MessageCircle, color: "bg-alignment" },
    { id: "research", label: "Research Collaboration", icon: Mail, color: "bg-attitude" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "We're grateful for your message",
      description: "We'll respond with care and attention within 24 hours.",
    });
    console.log('Contact form submitted for:', selectedIntent);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-needs text-white">Get in Touch</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every conversation is a holy encounter. We're here to support your journey toward conscious communication.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">What brings you here today?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {intents.map((intent) => {
              const Icon = intent.icon;
              return (
                <button
                  key={intent.id}
                  onClick={() => setSelectedIntent(intent.id)}
                  className={`p-6 rounded-lg border transition-all ${
                    selectedIntent === intent.id
                      ? `${intent.color} text-white border-white/20`
                      : 'backdrop-blur-sm bg-card/50 border-white/10 hover-elevate'
                  }`}
                  data-testid={`button-intent-${intent.id}`}
                >
                  <Icon className={`h-8 w-8 mb-3 mx-auto ${selectedIntent === intent.id ? 'text-white' : 'text-needs'}`} />
                  <p className="font-semibold">{intent.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        <Card className="backdrop-blur-sm bg-card/50 border-white/10">
          <CardHeader>
            <CardTitle>
              {selectedIntent === "retreats" && "Express Interest in Retreats"}
              {selectedIntent === "coaching" && "Schedule a Coaching Session"}
              {selectedIntent === "research" && "Collaborate on Research"}
              {!selectedIntent && "Send Us a Message"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    placeholder="Your name"
                    required
                    className="backdrop-blur-sm bg-white/5"
                    data-testid="input-name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="backdrop-blur-sm bg-white/5"
                    data-testid="input-email"
                  />
                </div>
              </div>

              {selectedIntent === "coaching" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Package</label>
                  <select
                    className="w-full rounded-md bg-background/50 backdrop-blur-sm border-white/10 px-3 py-2"
                    data-testid="select-package"
                  >
                    <option value="">Select a package</option>
                    <option value="foundation">Foundation (1:1)</option>
                    <option value="transformation">Transformation (1:1)</option>
                    <option value="team">Team Transformation</option>
                  </select>
                </div>
              )}

              {selectedIntent === "retreats" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Season</label>
                  <select
                    className="w-full rounded-md bg-background/50 backdrop-blur-sm border-white/10 px-3 py-2"
                    data-testid="select-season"
                  >
                    <option value="">Select a season</option>
                    <option value="spring">Spring 2024</option>
                    <option value="summer">Summer 2024</option>
                    <option value="autumn">Autumn 2024</option>
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Share what's alive for you..."
                  rows={6}
                  required
                  className="backdrop-blur-sm bg-white/5"
                  data-testid="input-message"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-needs hover:bg-needs/90"
                data-testid="button-submit"
              >
                Send with Gratitude
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>Direct Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="text-sm">
                Prefer to book directly? Use our calendar system to find a time that works for both of us.
              </p>
              <Button
                variant="outline"
                className="w-full backdrop-blur-sm bg-white/5"
                data-testid="button-calendar"
                onClick={() => console.log('Opening calendar')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Calendar
              </Button>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>Response Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We honor each inquiry with care and attention. You can expect a personal response within 24 hours during weekdays.
              </p>
              <p className="text-sm text-muted-foreground">
                For urgent matters, please indicate so in your message subject.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
