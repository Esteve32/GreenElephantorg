import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import PeriodicElement from "@/components/PeriodicElement";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, ChevronDown, Network, X, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LENS_ARRAY } from "@/constants/lenses";
import { ALL_ELEMENTS } from "@/data/periodicElements";
import { atmosphericPalette } from "@/constants/atmosphericGradient";
import { fadeInUp, fadeIn, staggerContainer } from "@/lib/motion";
import type { LensType } from "@/constants/lenses";
import periodicTableImageUrl from "@assets/The-Periodic-Table-of-Conscious-Communication@2x_1764712887674.png";
import archipelagoUrl from "@assets/finnish_archipelago_landscape_aerial_view_1764797904449.png";
import Footer from "@/components/Footer";
import semanticConnectionsUrl from "@assets/🔥2022_full_transparent_BG_with_interconnexion_linesFull_Resea_1772234144810.png";

const PERIODIC_TABLE_FAQ_ITEMS = [
  {
    question: "What is the Periodic Table of Conscious Communication?",
    answer: "The Periodic Table of Conscious Communication is a framework of 146 micro-habits organized across 8 lenses. Inspired by chemistry's periodic table, it maps the building blocks of human communication—from how you express needs and set boundaries to how you influence, lead, and build trust. Each element includes a practical prompt you can use in real conversations."
  },
  {
    question: "How do the 8 lenses work?",
    answer: "Each lens represents a different dimension of communication: Influence (how you persuade), Attitude (your openness to change), Chaordic (structure vs. freedom), Flow (engagement and motivation), Alignment (empathy and trust), Needs (what drives you), Ego (self-awareness and triggers), and Dynamics (relationship patterns). Together, they provide a complete map of how you connect—or disconnect—with others."
  },
  {
    question: "Is the Periodic Table based on research?",
    answer: "Yes. The framework draws on 27 years of coaching practice and integrates concepts from established fields including Nonviolent Communication (Marshall Rosenberg), Flow theory (Mihaly Csikszentmihalyi), Transactional Analysis, systems thinking, and neuroscience of communication. Each element has been refined through real-world coaching application."
  },
  {
    question: "How do I use the Periodic Table in my daily life?",
    answer: "Start with one lens that resonates with your current challenges. Pick a single element and practice it for one week—notice what shifts in your conversations. The table is designed for gradual integration, not overnight mastery. Many people begin with the Needs or Alignment lens for foundational shifts."
  },
  {
    question: "What's the difference between the Periodic Table and the Satellite Scan?",
    answer: "The Periodic Table is the framework—it shows all 146 communication elements across 8 lenses. The Satellite Scan is the diagnostic tool—a 129-question assessment that maps YOUR specific patterns against this framework and generates a personalized dashboard. Think of the table as the map and the Scan as your GPS location on that map."
  }
];

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

function SemanticConnectionsViewer({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const clampScale = (s: number) => Math.min(Math.max(s, 0.5), 5);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.12 : 0.12;
    setScale(prev => clampScale(prev + delta));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastPos.current.x;
    const dy = e.touches[0].clientY - lastPos.current.y;
    lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const reset = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex flex-col"
      data-testid="modal-semantic-connections"
    >
      <div className="flex items-start justify-between px-4 py-3 border-b border-white/10 shrink-0">
        <div className="max-w-xl">
          <h2 className="text-white font-bold text-lg leading-tight">Semantic Connections</h2>
          <p className="text-white/50 text-sm mt-0.5">
            Each coloured line shows a research-backed relationship between elements across lenses.
            These connections were mapped during the initial framework build from 27 years of coaching
            practice, NVC, flow theory, Transactional Analysis and systems thinking.
            Scroll to zoom · Drag to pan.
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setScale(prev => clampScale(prev + 0.3))}
            className="text-white/60 hover:text-white"
            data-testid="button-zoom-in"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setScale(prev => clampScale(prev - 0.3))}
            className="text-white/60 hover:text-white"
            data-testid="button-zoom-out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={reset}
            className="text-white/60 hover:text-white"
            data-testid="button-zoom-reset"
            aria-label="Reset view"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="text-white/60 hover:text-white"
            data-testid="button-close-semantic-modal"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-hidden relative"
        style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        data-testid="canvas-semantic-connections"
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={semanticConnectionsUrl}
            alt="Periodic Table of Conscious Communication — semantic connections between elements across all 8 lenses"
            draggable={false}
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transformOrigin: "center center",
              transition: isDragging.current ? "none" : "transform 0.05s ease-out",
              maxWidth: "none",
              width: "90vw",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      <div className="px-4 py-2 border-t border-white/10 shrink-0 flex items-center justify-between">
        <span className="text-white/60 text-xs">Zoom: {Math.round(scale * 100)}%</span>
        <span className="text-white/60 text-xs hidden sm:block">
          Press Esc to close
        </span>
      </div>
    </div>
  );
}

export default function PeriodicTablePage() {
  useEffect(() => { document.title = "Periodic Table of Conscious Communication | GreenElephant"; }, []);
  const [selectedLens, setSelectedLens] = useState<string>("all");
  const [showSemanticViewer, setShowSemanticViewer] = useState(false);

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
    <>
    <div className="min-h-screen pt-24 pb-16 relative">
      <SEO
        title="Periodic Table of Conscious Communication | 146 Elements | GreenElephant"
        description="Explore the Periodic Table of Conscious Communication — 146 micro-habits across 8 lenses mapping the full spectrum of human connection. A research-backed framework for transforming how you communicate."
        canonicalPath="/periodic-table"
        keywords="periodic table of communication, conscious communication framework, emotional intelligence framework, personal development tools, self-awareness micro-habits, 146 communication elements, 8 lenses, communication micro-habits, NVC, nonviolent communication, behavioural change tools, communication self-improvement"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Periodic Table", url: "/periodic-table" }
        ]}
        faqItems={PERIODIC_TABLE_FAQ_ITEMS}
      />
      <div className="absolute inset-0 -z-10" style={periodicTableBackgroundStyle} />
      {showSemanticViewer && (
        <SemanticConnectionsViewer onClose={() => setShowSemanticViewer(false)} />
      )}
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
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-4">146 elements. 8 lenses. One map of human connection.</p>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            The language of human-to-human communication has structure, pattern and geometry. Our Periodic Table gives you a clear map of how you connect—or disconnect—with yourself and others.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <img 
              src={periodicTableImageUrl} 
              alt="The Periodic Table of Conscious Communication - 146 elements across 8 lenses" 
              className="w-full h-auto"
              data-testid="img-periodic-table-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-10"
          >
            <button
              onClick={() => setShowSemanticViewer(true)}
              className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg border border-white/15 bg-white/5 backdrop-blur-sm text-white/70 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-200 text-sm"
              data-testid="button-view-semantic-connections"
            >
              <Network className="w-4 h-4 text-needs group-hover:text-needs" />
              <span>View research connections between elements</span>
              <span className="text-white/35 text-xs border border-white/15 rounded px-1.5 py-0.5 ml-1">
                Interactive
              </span>
            </button>
            <p className="text-white/65 text-xs mt-2">
              Each coloured line is a semantic link drawn from 27 years of research across NVC, flow theory, TA and systems thinking.
            </p>
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
    </div>

    <div className="relative w-full bg-[#0a0a0a]">
      <div
        className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: '160px',
          background: `linear-gradient(to bottom,
            #0a0a0a                  0%,
            rgba(10,10,10,0.88)     22%,
            rgba(10,10,10,0.60)     46%,
            rgba(10,10,10,0.24)     72%,
            transparent            100%
          )`,
        }}
      />
      <img
        src={archipelagoUrl}
        alt="Finnish Archipelago"
        className="w-full h-auto block"
      />
      <div
        className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: '160px',
          background: `linear-gradient(to top,
            #000000                  0%,
            rgba(0,0,0,0.88)        22%,
            rgba(0,0,0,0.60)        46%,
            rgba(0,0,0,0.24)        72%,
            transparent            100%
          )`,
        }}
      />
      <div className="absolute bottom-4 left-0 right-0 z-20 text-center">
        <p className="text-white/65 text-xs tracking-wide">Finnish Archipelago</p>
      </div>
    </div>

    <Footer />
    </>
  );
}
