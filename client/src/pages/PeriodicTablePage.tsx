import { useState } from "react";
import { motion } from "framer-motion";
import PeriodicElement from "@/components/PeriodicElement";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, ChevronDown } from "lucide-react";
import { LENS_ARRAY } from "@/constants/lenses";
import { ALL_ELEMENTS } from "@/data/periodicElements";
import { atmosphericPalette } from "@/constants/atmosphericGradient";
import { fadeInUp, fadeIn, staggerContainer } from "@/lib/motion";
import type { LensType } from "@/constants/lenses";
import montVentouxUrl from "@assets/generated_images/mont_ventoux_provence_lavender_landscape.png";
import periodicTableImageUrl from "@assets/The-Periodic-Table-of-Conscious-Communication@2x_1764712887674.png";

const lensFilters = [
  { value: "all", label: "All Lenses", color: "bg-primary" },
  ...LENS_ARRAY.map(lens => ({
    value: lens.value,
    label: lens.name,
    color: lens.color
  }))
];

const periodicTableBackgroundStyle = {
  background: `linear-gradient(180deg, 
    #030508 0%, 
    #020304 15%,
    #010202 30%,
    #000000 50%,
    #000000 100%
  )`
};

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
      <div className="absolute inset-0 -z-10" style={periodicTableBackgroundStyle} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Badge className="mb-4 bg-white/10 backdrop-blur-sm border-white/20 text-white">The Framework</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            Periodic Table of Conscious Communication
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-4">
            146 micro-habits. 8 lenses. One map of human connection.
          </p>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            The language of human-to-human communication has structure, pattern and geometry. Our Periodic Table gives you a clear map of how you connect—or disconnect—with yourself and others.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <img 
              src={periodicTableImageUrl} 
              alt="The Periodic Table of Conscious Communication - 146 elements across 8 lenses" 
              className="w-full h-auto"
              data-testid="img-periodic-table-full"
            />
          </motion.div>

          <motion.div 
            className="flex flex-wrap items-center justify-center gap-2"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            {lensFilters.map((lens) => (
              <Button
                key={lens.value}
                variant={selectedLens === lens.value ? "default" : "outline"}
                size="sm"
                className={selectedLens === lens.value 
                  ? `${lens.color} text-white hover:opacity-90 border-white/10` 
                  : "backdrop-blur-sm bg-white/5 border-white/10"
                }
                onClick={() => setSelectedLens(lens.value)}
                data-testid={`filter-${lens.value}`}
              >
                {lens.label}
              </Button>
            ))}
          </motion.div>
          
          <motion.div 
            className="mt-12 flex flex-col items-center gap-2 text-white/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <span className="text-sm">Scroll to explore all elements</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </motion.div>
        </motion.div>

        <div className="mb-8 text-center">
          <Badge className="backdrop-blur-sm bg-white/10 border-white/20 text-white">
            Showing {filteredElements.length} of {ALL_ELEMENTS.length} elements
          </Badge>
        </div>

        {sortedCategories.map((category, categoryIndex) => (
          <motion.div 
            key={category} 
            className="mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-white drop-shadow-lg">{category}</h2>
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4"
              variants={staggerContainer}
            >
              {groupedElements[category].map((element) => (
                <motion.div key={element.code} variants={fadeIn}>
                  <PeriodicElement
                    symbol={element.symbol}
                    name={element.name}
                    number={element.code}
                    lens={element.lens}
                    description={element.description}
                    examplePrompt={element.examplePrompt}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}

        <motion.div 
          className="mt-16 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 md:p-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
        >
          <h3 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">How to Apply This Today</h3>
          <p className="text-center text-white/70 mb-8 max-w-2xl mx-auto">
            The Periodic Table isn't meant to be mastered overnight—it's designed for gradual integration into your life.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-needs">1</span>
              </div>
              <p className="font-semibold mb-2 text-lg text-white drop-shadow-lg">Start with One Lens</p>
              <p className="text-sm text-white/70">Choose a lens that resonates with your current challenges. Begin with Needs or Alignment for foundational shifts.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-needs">2</span>
              </div>
              <p className="font-semibold mb-2 text-lg text-white drop-shadow-lg">Practice One Element Daily</p>
              <p className="text-sm text-white/70">Select a single element and practice it for one week. Notice what shifts in your conversations and relationships.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-needs">3</span>
              </div>
              <p className="font-semibold mb-2 text-lg text-white drop-shadow-lg">Track Your Transformation</p>
              <p className="text-sm text-white/70">Journal your observations. Where did you notice more connection? Where did you catch yourself in old patterns?</p>
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
        </motion.div>
      </div>

      {/* Mont Ventoux Footer - Full width image with seamless gradients */}
      <section 
        className="relative mt-16"
        aria-label="Provence landscape"
        data-testid="section-mont-ventoux-footer"
      >
        {/* Top gradient - blends from dark content section */}
        <div 
          className="absolute top-0 left-0 right-0 h-40 z-10 pointer-events-none"
          style={{ 
            background: `linear-gradient(to bottom,
              #030508 0%,
              #030508CC 25%,
              #03050899 45%,
              #03050866 65%,
              #03050833 80%,
              transparent 100%
            )`
          }}
          aria-hidden="true"
        />
        
        {/* Full-width Mont Ventoux image */}
        <div className="w-full">
          <img 
            src={montVentouxUrl} 
            alt="Mont Ventoux, Provence landscape with lavender fields"
            className="w-full h-auto block"
          />
        </div>
        
        {/* Bottom gradient - fades to dark */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none"
          style={{ 
            background: `linear-gradient(to top,
              #000000 0%,
              #000000CC 30%,
              #00000099 50%,
              #00000066 70%,
              #00000033 85%,
              transparent 100%
            )`
          }}
          aria-hidden="true"
        />
        
        {/* Location label */}
        <div className="absolute bottom-6 left-0 right-0 z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-white/80 text-sm">Mont Ventoux, Provence</p>
          </div>
        </div>
      </section>
    </div>
  );
}
