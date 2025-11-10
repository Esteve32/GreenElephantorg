import { useState } from "react";
import PeriodicElement from "@/components/PeriodicElement";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {filteredElements.map((element) => (
            <PeriodicElement
              key={element.code}
              symbol={element.symbol}
              name={element.name}
              number={element.code}
              lens={element.lens}
              description={element.description}
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
