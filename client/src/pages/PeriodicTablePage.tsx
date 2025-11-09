import { useState } from "react";
import PeriodicElement from "@/components/PeriodicElement";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

//todo: remove mock functionality
const elements = [
  { symbol: "Li", name: "Listening", number: 1, lens: "needs", description: "The foundation of conscious communication - truly hearing and understanding others without judgment." },
  { symbol: "Em", name: "Empathy", number: 2, lens: "alignment", description: "Connecting with others' emotions and experiences with compassion." },
  { symbol: "Tr", name: "Trust", number: 3, lens: "dynamics", description: "Building reliable relationships through consistent authentic communication." },
  { symbol: "Cu", name: "Curiosity", number: 4, lens: "attitude", description: "Approaching conversations with genuine interest in understanding." },
  { symbol: "Pr", name: "Presence", number: 5, lens: "flow", description: "Being fully engaged in the moment of communication." },
  { symbol: "Cl", name: "Clarity", number: 6, lens: "influence", description: "Expressing thoughts and needs with precision and purpose." },
  { symbol: "Pa", name: "Patience", number: 7, lens: "chaordic", description: "Allowing time and space for authentic dialogue to unfold." },
  { symbol: "Aw", name: "Awareness", number: 8, lens: "ego", description: "Recognizing one's own triggers and patterns in communication." },
  { symbol: "Vn", name: "Vulnerability", number: 9, lens: "needs", description: "Sharing authentically from a place of courage and openness." },
  { symbol: "Bo", name: "Boundaries", number: 10, lens: "alignment", description: "Honoring personal limits while maintaining connection." },
  { symbol: "Re", name: "Respect", number: 11, lens: "dynamics", description: "Valuing others' perspectives and experiences." },
  { symbol: "Co", name: "Compassion", number: 12, lens: "needs", description: "Meeting self and others with kindness and understanding." },
  { symbol: "Au", name: "Authenticity", number: 13, lens: "ego", description: "Communicating from one's true self without pretense." },
  { symbol: "Ac", name: "Accountability", number: 14, lens: "influence", description: "Taking ownership of one's words and their impact." },
  { symbol: "Fl", name: "Flexibility", number: 15, lens: "chaordic", description: "Adapting communication style to serve connection." },
  { symbol: "In", name: "Intention", number: 16, lens: "attitude", description: "Communicating with clear purpose aligned with values." },
] as const;

const lenses = [
  { value: "all", label: "All Lenses", color: "bg-primary" },
  { value: "ego", label: "Ego", color: "bg-ego" },
  { value: "dynamics", label: "Dynamics", color: "bg-dynamics" },
  { value: "influence", label: "Influence", color: "bg-influence" },
  { value: "attitude", label: "Attitude", color: "bg-attitude" },
  { value: "chaordic", label: "Chaordic", color: "bg-chaordic" },
  { value: "flow", label: "Flow", color: "bg-flow" },
  { value: "alignment", label: "Alignment", color: "bg-alignment" },
  { value: "needs", label: "Needs", color: "bg-needs" },
];

export default function PeriodicTablePage() {
  const [selectedLens, setSelectedLens] = useState<string>("all");

  const filteredElements = selectedLens === "all"
    ? elements
    : elements.filter(el => el.lens === selectedLens);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Periodic Table of Conscious Communication
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            An interactive framework organizing communication elements by transformative lenses
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {lenses.map((lens) => (
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
            Showing {filteredElements.length} of {elements.length} elements
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {filteredElements.map((element) => (
            <PeriodicElement
              key={element.number}
              {...element}
            />
          ))}
        </div>

        <div className="mt-16 backdrop-blur-sm bg-white/5 rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold mb-4 text-center">How to Use the Periodic Table</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-semibold mb-2">1. Explore Elements</p>
              <p className="text-muted-foreground">Click any element to learn about its role in conscious communication.</p>
            </div>
            <div>
              <p className="font-semibold mb-2">2. Filter by Lens</p>
              <p className="text-muted-foreground">Use the lens filters to focus on specific aspects of communication.</p>
            </div>
            <div>
              <p className="font-semibold mb-2">3. Apply Microhabits</p>
              <p className="text-muted-foreground">Each element links to practical prompts and learning resources.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
