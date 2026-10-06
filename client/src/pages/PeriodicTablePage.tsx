import { PAGE_METADATA } from "@shared/page-metadata";
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
    answer: "The Periodic Table of Conscious Communication is a learning framework with 146 elements organised across eight lenses. Each element offers a prompt to help you reflect on a conversation or practise a communication habit. Start with one element that fits your current task.",
  },
  {
    question: "How do the eight lenses work?",
    answer: "The lenses offer different questions to explore: Influence, Attitude, Chaordic, Flow, Alignment, Energy & Needs, Ego and Dynamics. They help you look at intentions, boundaries, motivation and relationships from several angles. Choose the perspective that helps with your situation; you do not need to work through every lens.",
  },
  {
    question: "How should I use this framework?",
    answer: "Use the table as a learning map for reflection and practice. Its prompts help you ask questions, prepare conversations and try small changes. Its drawn connections suggest ways to explore ideas together. Ask for sources when you need evidence for a particular claim, and check whether they apply to your situation. Try one small practice and review what happened.",
  },
  {
    question: "How can I try it in a real task?",
    answer: "Choose a message you need to send. Pick an element about needs or boundaries. Use its prompt to write your own brief, then ask AI to suggest a draft if useful. Check names, facts, tone and what you agree to before sending. Share only the information needed for the task.",
  },
  {
    question: "What is the difference between the table and the Satellite Scan?",
    answer: "The table is a framework you can explore freely. The Satellite Scan is a 129-question self-reflection questionnaire with a coach-prepared dashboard, prompts and practice materials. It helps you notice reported communication preferences and choose what to practise. You decide which insights to use as instructions for AI; AI training and coaching are booked separately.",
  },
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
            Each coloured line links elements across lenses in the framework. Explore a connection, ask how it might fit your situation and check what happens when you try a related practice. Scroll to zoom. Drag to pan.
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
        {...PAGE_METADATA["/periodic-table"]}
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            Periodic Table of Conscious Communication
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-4">146 elements. Eight lenses. Practical questions for communication.</p>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            Explore how you communicate with yourself and other people. Choose one element and try its prompt in a real task. When working with AI, use a chosen insight to clarify your goal, tone or boundaries, then check the answer.
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
              className="group inline-flex flex-wrap max-w-full items-center gap-2.5 px-5 py-2.5 rounded-lg border border-white/15 bg-white/5 backdrop-blur-sm text-white/70 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-200 text-sm"
              data-testid="button-view-semantic-connections"
            >
              <Network className="w-4 h-4 text-needs group-hover:text-needs" />
              <span>Explore connections between elements</span>
              <span className="text-white/35 text-xs border border-white/15 rounded px-1.5 py-0.5 ml-1">
                Interactive
              </span>
            </button>
            <p className="text-white/65 text-xs mt-2">
              Coloured lines show connections drawn within the framework. Use them to explore how ideas may relate.
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
          <h3 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">Prepare one message</h3>
          <p className="text-center text-white/70 mb-8 max-w-2xl mx-auto">
            Choose a message you need to send. Pick an element about needs or boundaries. Use its prompt to write your own brief, then ask AI to suggest a draft if useful. Check names, facts, tone and what you agree to before sending. Share only the information needed for the task.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-needs">1</span>
              </div>
              <p className="font-semibold mb-2 text-lg text-white drop-shadow-lg">Choose one task</p>
              <p className="text-lg leading-relaxed text-white/70">Start with a conversation or message you need to prepare.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-needs">2</span>
              </div>
              <p className="font-semibold mb-2 text-lg text-white drop-shadow-lg">Try one prompt</p>
              <p className="text-lg leading-relaxed text-white/70">Use an element to clarify what you want to say or ask.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-needs">3</span>
              </div>
              <p className="font-semibold mb-2 text-lg text-white drop-shadow-lg">Review what happened</p>
              <p className="text-lg leading-relaxed text-white/70">Note what helped, what felt unclear and one adjustment for next time.</p>
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

    <div className="photo-boundary w-full">
      <img src={archipelagoUrl} alt="Finnish Archipelago" className="photo-boundary-image" />
      <div className="absolute bottom-4 left-0 right-0 z-20 text-center">
        <p className="text-white/65 text-xs tracking-wide">Finnish Archipelago</p>
      </div>
    </div>

    <Footer />
    </>
  );
}
