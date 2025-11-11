import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, Heart, Brain, Users, Sparkles, Eye, MessageCircle } from "lucide-react";

export default function WhatIsPage() {
  const principles = [
    {
      title: "Presence Over Performance",
      description: "Being fully present in conversation, rather than planning your next response or defending your position.",
      icon: Eye,
    },
    {
      title: "Needs Over Strategies",
      description: "Recognizing the universal human needs beneath specific requests or behaviors.",
      icon: Heart,
    },
    {
      title: "Curiosity Over Judgment",
      description: "Approaching differences with genuine interest rather than categorizing as right or wrong.",
      icon: Brain,
    },
    {
      title: "Connection Over Correction",
      description: "Prioritizing relationship and understanding over being right or fixing others.",
      icon: Users,
    },
  ];

  const transformation = [
    {
      before: "I can't believe you're late again. You never respect my time!",
      after: "When you arrive later than we agreed, I feel frustrated because I value reliability and mutual respect. Could we explore what's making it hard to arrive on time?",
      lens: "Needs & Feelings",
    },
    {
      before: "This idea won't work. We tried something similar last year.",
      after: "I notice some hesitation in me. I'm curious—what need does this approach meet that our previous attempt didn't?",
      lens: "Ego Awareness",
    },
    {
      before: "Just do it this way. Trust me, I know what works.",
      after: "I have a strong sense that this approach could work well. I'm also aware my confidence might be overshadowing other perspectives. What do others see that I might be missing?",
      lens: "Influence Dynamics",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-needs text-white">Understanding the Foundation</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Archivo, sans-serif' }}>
            Stop Letting Words Create Distance
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Learn how conscious communication transforms everyday conversations into moments of genuine connection, mutual understanding, and spiritual growth
          </p>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
            This isn't about perfect words or techniques. It's about presence, authenticity, and recognizing our shared humanity beneath every interaction.
          </p>
        </div>

        <div className="backdrop-blur-sm bg-gradient-to-br from-needs/20 to-alignment/20 border border-white/20 rounded-2xl p-8 md:p-12 mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              Communication That Builds Bridges, Not Walls
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Conscious communication is the art of engaging with others from a place of presence, authenticity, 
              and compassion. It's grounded in the recognition that beneath every action, every word, every conflict, 
              are universal human needs seeking to be met.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Drawing from Nonviolent Communication (NVC), TEAL organizational principles, and contemplative wisdom traditions 
              emphasizing compassion and interconnection, conscious communication transforms how we relate—to ourselves, to others, and 
              to the systems we create together.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              It's not about perfection. It's about awareness. It's not about never making mistakes. It's about 
              noticing when we drift into unconscious patterns and choosing, with compassion, to return to connection.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Core Principles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {principles.map((principle) => {
              const Icon = principle.icon;
              return (
                <Card key={principle.title} className="backdrop-blur-sm bg-card/50 border-white/10">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 rounded-lg bg-needs/20">
                        <Icon className="h-6 w-6 text-needs" />
                      </div>
                      <CardTitle>{principle.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{principle.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">How It Sounds in Practice</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            See the difference between unconscious reaction and conscious response
          </p>
          <div className="space-y-6">
            {transformation.map((example, idx) => (
              <Card key={idx} className="backdrop-blur-sm bg-card/50 border-white/10">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-destructive"></div>
                        <span className="text-sm font-semibold text-destructive">Unconscious Pattern</span>
                      </div>
                      <p className="text-muted-foreground italic">"{example.before}"</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-needs"></div>
                        <span className="text-sm font-semibold text-needs">Conscious Response</span>
                      </div>
                      <p className="text-muted-foreground italic">"{example.after}"</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <Badge variant="outline" className="text-xs">
                      {example.lens}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <MessageCircle className="h-8 w-8 text-alignment mb-3" />
              <CardTitle>The Periodic Table Framework</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>
                Our unique contribution is the Periodic Table of Conscious Communication—a comprehensive 
                framework organizing 8 lenses (Ego, Dynamics, Influence, Attitude, Chaordic, Flow, Alignment, Needs) 
                into actionable microhabits.
              </p>
              <p>
                Each element represents a specific communication pattern or skill, making the vast territory 
                of conscious communication approachable and practical.
              </p>
              <Link href="/periodic-table">
                <Button variant="outline" className="mt-4" data-testid="button-explore-table">
                  Explore the Periodic Table
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <Sparkles className="h-8 w-8 text-needs mb-3" />
              <CardTitle>Who Benefits?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>
                Conscious communication serves anyone navigating complex human dynamics:
              </p>
              <ul className="space-y-2 text-sm">
                <li>• TEAL organization leaders transforming workplace culture</li>
                <li>• Executive Assistants managing stakeholder relationships</li>
                <li>• Design & innovation teams collaborating under pressure</li>
                <li>• Coaches and facilitators deepening their practice</li>
                <li>• Anyone committed to authentic connection and meaningful relationships</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="backdrop-blur-sm bg-needs/10 border border-needs/20 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Practice?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover which path—retreats, coaching, or consulting—aligns with your journey toward conscious communication.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/choose-your-path">
              <Button 
                size="lg"
                className="bg-needs hover:bg-needs/90 text-white min-w-[200px]"
                data-testid="button-choose-path"
              >
                Choose Your Path
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/signals">
              <Button 
                size="lg"
                variant="outline"
                className="min-w-[200px]"
                data-testid="button-recognize-signals"
              >
                Recognize Warning Signals
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
