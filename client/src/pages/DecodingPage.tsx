import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { ArrowRight, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

const GBR_COLORS = {
  red: { hex: "#cc3333", label: "Red", desc: "Shared focus — drives agreement" },
  green: { hex: "#339966", label: "Green", desc: "Other focus — builds connection" },
  blue: { hex: "#3399cc", label: "Blue", desc: "Self focus — expresses internally" },
};

type GBRColor = "red" | "green" | "blue";

interface DecodeSegment {
  text: string;
  color: GBRColor;
  element: string;
  elementCode: number;
}

interface DecodeCard {
  id: string;
  situation: string;
  original: string;
  segments: DecodeSegment[];
  lenses: string[];
  rewrite: string;
  microhabit: string;
  microhabitElement: string;
  microhabitCode: number;
}

const DECODE_CARDS: DecodeCard[] = [
  {
    id: "1",
    situation: "EA to manager — pushing back on an unrealistic deadline",
    original: "I'm not sure I can get this done by Friday.",
    segments: [
      { text: "I'm not sure I can get this done", color: "blue", element: "Informing", elementCode: 7201 },
      { text: "by Friday", color: "blue", element: "Blue Timing", elementCode: 7305 },
    ],
    lenses: ["ego", "influence"],
    rewrite: "I want to make sure this lands well. Given what's on my plate this week, could we look at what's realistic together? I can have a solid draft by Monday if that works.",
    microhabit: "Before giving a time estimate, pause and state your competing priorities out loud. This reframes constraint as information, not resistance.",
    microhabitElement: "Framing",
    microhabitCode: 3105,
  },
  {
    id: "2",
    situation: "VA in a client check-in — detecting frustration",
    original: "No problem, I'll fix it.",
    segments: [
      { text: "No problem", color: "red", element: "Agreeing", elementCode: 1206 },
      { text: ", I'll fix it.", color: "blue", element: "Informing", elementCode: 7201 },
    ],
    lenses: ["influence", "alignment"],
    rewrite: "I can hear this was frustrating — let me make sure I understand exactly what happened so we solve the right thing. What would 'fixed' look like for you?",
    microhabit: "When you feel pressure to say 'no problem', try Green Questions first: 'What would good look like for you here?'",
    microhabitElement: "Green Questions",
    microhabitCode: 5202,
  },
  {
    id: "3",
    situation: "EA in a tense team meeting — someone interrupts them",
    original: "Sorry — I was just saying that the report is ready.",
    segments: [
      { text: "Sorry", color: "blue", element: "Apologising", elementCode: 7205 },
      { text: " — I was just saying", color: "blue", element: "Blue Silence", elementCode: 7301 },
      { text: " that the report is ready", color: "red", element: "Supporting", elementCode: 1204 },
    ],
    lenses: ["ego", "influence"],
    rewrite: "I'd like to finish my thought — the report is ready, and I want to walk you through what it shows.",
    microhabit: "Replace the reflex apology with a calm reframe: 'I'd like to finish my thought.' Practise it once a day in low-stakes conversations.",
    microhabitElement: "Permission Barrier",
    microhabitCode: 7105,
  },
  {
    id: "4",
    situation: "VA handling a client complaint about a missed task",
    original: "That shouldn't have happened. I don't know how it was missed.",
    segments: [
      { text: "That shouldn't have happened.", color: "blue", element: "Judging", elementCode: 7203 },
      { text: " I don't know how it was missed.", color: "blue", element: "Projecting", elementCode: 7204 },
    ],
    lenses: ["ego", "dynamics"],
    rewrite: "I hear you — this slipped through and that's on me. Here's what I'm doing to make it right: [action]. What would help you feel confident this won't happen again?",
    microhabit: "Own your part explicitly before offering the fix. Try the formula: 'This is what happened, this is my part, here's what I'm doing.' Map it to Responsibilities (7406).",
    microhabitElement: "Responsibilities",
    microhabitCode: 7406,
  },
  {
    id: "5",
    situation: "EA in a strategy meeting — voicing a concern everyone is thinking",
    original: "[Says nothing. Waits for someone else to raise it.]",
    segments: [
      { text: "[Says nothing. Waits for someone else to raise it.]", color: "blue", element: "Blue Silence", elementCode: 7301 },
    ],
    lenses: ["ego", "alignment"],
    rewrite: "I want to name something I think is in the room — we're discussing Plan A, but what about the budget risk that came up last week? I don't think we've resolved it.",
    microhabit: "When you notice yourself waiting for someone else to speak, count to three and say: 'I want to name something.' Use Elephant (5208) as your trigger.",
    microhabitElement: "Elephant",
    microhabitCode: 5208,
  },
  {
    id: "6",
    situation: "VA closing a recurring update call with a key stakeholder",
    original: "Okay, sounds good. Talk soon.",
    segments: [
      { text: "Okay, sounds good.", color: "red", element: "Agreeing", elementCode: 1206 },
      { text: " Talk soon.", color: "blue", element: "Blue Timing", elementCode: 7305 },
    ],
    lenses: ["influence", "needs"],
    rewrite: "Before we close — let me summarise what we decided: [1, 2, 3]. Does that match what you're taking away? And is there anything you need from me before our next call?",
    microhabit: "End every recurring call with a 90-second summary and a Conscious Request. It takes 30 days to make it automatic — start today.",
    microhabitElement: "Summarising",
    microhabitCode: 5204,
  },
];

const LENS_LABELS: Record<string, string> = {
  influence: "Influence",
  attitude: "Attitude",
  chaordic: "Chaordic",
  flow: "Flow",
  alignment: "Alignment",
  needs: "Needs",
  ego: "Ego",
  dynamics: "Dynamics",
};

const LENS_COLORS_HEX: Record<string, string> = {
  influence: "#cc3333",
  attitude: "#ff9933",
  chaordic: "#cccc33",
  flow: "#99cc33",
  alignment: "#669966",
  needs: "#009999",
  ego: "#3399cc",
  dynamics: "#666699",
};

function GBRPip({ color }: { color: GBRColor }) {
  const c = GBR_COLORS[color];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium"
      style={{ backgroundColor: `${c.hex}22`, color: c.hex, border: `1px solid ${c.hex}44` }}
    >
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.hex }} />
      {c.label}
    </span>
  );
}

export default function DecodingPage() {
  return (
    <>
      <SEO
        title="Decoding Communication — GreenBlueRed Examples | GreenElephant"
        description="Real communication examples decoded through the GreenBlueRed™ lens. See how Executive Assistants and Virtual Assistants can rewrite common patterns for more conscious conversations."
        canonicalPath="/decoding"
        keywords="GreenBlueRed decode, communication analysis, EA communication, conscious communication examples, GBR framework"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Decoding", url: "/decoding" },
        ]}
      />

      <div className="min-h-screen bg-background text-white">

        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-ego/10 via-background to-background pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Badge className="mb-6 bg-ego/20 text-ego border-ego/30">
                GreenBlueRed™ Analysis
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Decode what's really being said
              </h1>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Real communication examples analysed through the GreenBlueRed™ lens.
              </p>
            </motion.div>
          </div>
        </section>

        {/* GBR Explainer */}
        <section className="py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-7">
                  <div className="flex items-start gap-4">
                    <Lightbulb className="h-5 w-5 text-chaordic flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">About GreenBlueRed™ (Element 1103)</p>
                      <p className="text-white/80 leading-relaxed">
                        GreenBlueRed™ is a behavioral communication framework and coding language. <span style={{ color: GBR_COLORS.blue.hex }}>Blue</span> focuses on informing — a self-directed focus. <span style={{ color: GBR_COLORS.green.hex }}>Green</span> focuses on connecting and empathy — directed toward the other person. <span style={{ color: GBR_COLORS.red.hex }}>Red</span> focuses on agreeing or driving common action — a shared focus. Most moments in conversation contain a mix of all three.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-5">
                    {Object.entries(GBR_COLORS).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: val.hex }} />
                        <span className="text-white/70"><strong style={{ color: val.hex }}>{val.label}</strong> — {val.desc}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Decode cards */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {DECODE_CARDS.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              >
                <Card className="bg-white/5 border-white/10 overflow-hidden" data-testid={`card-decode-${card.id}`}>
                  <div className="px-6 pt-6 pb-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Situation</p>
                    <p className="text-sm text-white/80 italic mb-4">{card.situation}</p>
                  </div>

                  {/* Original */}
                  <div className="px-6 pb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Original</p>
                    <div className="bg-white/5 rounded-md p-4 border border-white/10 text-white/80 leading-relaxed">
                      &ldquo;{card.original}&rdquo;
                    </div>
                  </div>

                  {/* GBR Decode */}
                  <div className="px-6 pb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">GBR Decode</p>
                    <div className="bg-black/20 rounded-md p-4 border border-white/10 flex flex-wrap gap-3">
                      {card.segments.map((seg, j) => {
                        const c = GBR_COLORS[seg.color];
                        return (
                          <div key={j} className="flex flex-col gap-1">
                            <span
                              className="text-sm px-2 py-1 rounded"
                              style={{ backgroundColor: `${c.hex}22`, color: c.hex, border: `1px solid ${c.hex}44` }}
                            >
                              {seg.text}
                            </span>
                            <span className="text-xs text-muted-foreground px-1">
                              <GBRPip color={seg.color} /> · {seg.element} ({seg.elementCode})
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Lens */}
                  <div className="px-6 pb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Lens</p>
                    <div className="flex flex-wrap gap-2">
                      {card.lenses.map(lens => (
                        <Badge
                          key={lens}
                          variant="outline"
                          className="text-xs capitalize"
                          style={{ color: LENS_COLORS_HEX[lens], borderColor: `${LENS_COLORS_HEX[lens]}55` }}
                        >
                          {LENS_LABELS[lens]}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Rewrite */}
                  <div className="px-6 pb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Conscious Rewrite</p>
                    <div
                      className="rounded-md p-4 border text-sm leading-relaxed text-white/90"
                      style={{ backgroundColor: "#00999920", borderColor: "#00999944" }}
                    >
                      &ldquo;{card.rewrite}&rdquo;
                    </div>
                  </div>

                  {/* Micro-habit */}
                  <div className="px-6 pb-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Micro-habit — {card.microhabitElement} ({card.microhabitCode})
                    </p>
                    <p className="text-sm text-white/70 leading-relaxed">{card.microhabit}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 pb-32">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4">Want your own decode?</h2>
              <p className="text-white/60 mb-8">The Satellite Scan maps your communication patterns across all 8 lenses with 129 questions — then gives you a personalized GBR breakdown, your biggest blind spots, and 3 micro-habits to practise.</p>
              <Link href="/scan">
                <Button size="lg" className="bg-needs text-white gap-2 px-8" data-testid="button-decoding-cta-scan">
                  Do the Satellite Scan — €99.95
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
}
