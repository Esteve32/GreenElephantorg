import { useState } from "react";
import PeriodicElement from "@/components/PeriodicElement";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { LENS_ARRAY } from "@/constants/lenses";
import { ALL_ELEMENTS } from "@/data/periodicElements";
import type { LensType } from "@/constants/lenses";

const lensFilters = [
  { value: "all", label: "All Lenses", color: "bg-primary" },
  ...LENS_ARRAY.map(lens => ({
    value: lens.value,
    label: lens.name,
    color: lens.color
  }))
];

export default function PeriodicTablePage() {
  const [selectedLens, setSelectedLens] = useState<string>("all");

  const filteredElements = selectedLens === "all"
    ? ALL_ELEMENTS
    : ALL_ELEMENTS.filter(el => el.lens === selectedLens);

  const groupedElements = filteredElements.reduce((acc, element) => {
    const category = element.category || "Core Concepts";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(element);
    return acc;
  }, {} as Record<string, typeof ALL_ELEMENTS>);

  const categoryOrder = [
    "Core Concepts",
    "SAY & WRITE",
    "DO & MOVE",
    "FEEL & INTEND",
    "THINK & UNDERSTAND",
    "EGO ROLES",
    "COLLECTIVELY INTELLIGENT ROLES"
  ];

  const sortedCategories = categoryOrder.filter(cat => groupedElements[cat]);

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card/30 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,179,179,0.05),transparent_50%)] -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(51,153,204,0.05),transparent_50%)] -z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-needs text-white">The Framework</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Periodic Table of Conscious Communication
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            129 micro-habits. 8 lenses. One map of human connection.
          </p>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-8">
            The language of human-to-human communication has structure, pattern and geometry. Our Periodic Table gives you a clear map of how you connect—or disconnect—with yourself and others.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {lensFilters.map((lens) => (
              <Button
                key={lens.value}
                variant={selectedLens === lens.value ? "default" : "outline"}
                size="sm"
                className={selectedLens === lens.value ? `${lens.color} text-white hover:opacity-90` : "backdrop-blur-sm bg-white/5"}
                onClick={() => setSelectedLens(lens.value)}
                data-testid={`filter-${lens.value}`}
              >
                {lens.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-8 text-center">
          <Badge className="backdrop-blur-sm bg-white/10">
            Showing {filteredElements.length} of {ALL_ELEMENTS.length} elements
          </Badge>
        </div>

        {sortedCategories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-center">{category}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {groupedElements[category].map((element) => (
                <PeriodicElement
                  key={element.code}
                  symbol={element.symbol}
                  name={element.name}
                  number={element.code}
                  lens={element.lens}
                  description={element.description}
                  examplePrompt={element.examplePrompt}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="mt-16 backdrop-blur-sm bg-needs/10 border border-needs/20 rounded-2xl p-8 md:p-12">
          <h3 className="text-3xl font-bold mb-6 text-center">How to Apply This Today</h3>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            The Periodic Table isn't meant to be mastered overnight—it's designed for gradual integration into your life.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-needs/30 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-needs">1</span>
              </div>
              <p className="font-semibold mb-2 text-lg">Start with One Lens</p>
              <p className="text-sm text-muted-foreground">Choose a lens that resonates with your current challenges. Begin with Needs or Alignment for foundational shifts.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-needs/30 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-needs">2</span>
              </div>
              <p className="font-semibold mb-2 text-lg">Practice One Element Daily</p>
              <p className="text-sm text-muted-foreground">Select a single element and practice it for one week. Notice what shifts in your conversations and relationships.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-needs/30 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-needs">3</span>
              </div>
              <p className="font-semibold mb-2 text-lg">Track Your Transformation</p>
              <p className="text-sm text-muted-foreground">Journal your observations. Where did you notice more connection? Where did you catch yourself in old patterns?</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <Link href="/choose-your-path">
              <Button className="bg-needs hover:bg-needs/90 text-white" data-testid="button-start-journey">
                Start your journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
