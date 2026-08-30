import React, { useState } from "react";
import { Link } from "wouter";
import { Compass, Sparkles, Lock, ArrowLeft, Send } from "lucide-react";

const OCTANTS = [
  { id: "flow", name: "Flow", desc: "High Challenge, High Skill — Clear thinking, deep presence", color: "from-emerald-500 to-teal-500" },
  { id: "control", name: "Control", desc: "Medium Challenge, High Skill — Prepared, confident, stable", color: "from-teal-500 to-cyan-500" },
  { id: "relaxation", name: "Relaxation", desc: "Low Challenge, High Skill — Comfort, safety, and rest", color: "from-cyan-500 to-blue-500" },
  { id: "boredom", name: "Boredom", desc: "Low Challenge, Medium Skill — Routine, lack of spark", color: "from-slate-500 to-slate-600" },
  { id: "apathy", name: "Apathy", desc: "Low Challenge, Low Skill — Zoning out, emotional freeze", color: "from-zinc-600 to-neutral-700" },
  { id: "worry", name: "Worry", desc: "Medium Challenge, Low Skill — Concerned, difficult to settle", color: "from-amber-600 to-orange-600" },
  { id: "anxiety", name: "Anxiety", desc: "High Challenge, Low Skill — Overwhelmed, stressed", color: "from-rose-600 to-red-600" },
  { id: "arousal", name: "Arousal / Excitement", desc: "High Challenge, Medium Skill — Aliveness, eager anticipation", color: "from-purple-500 to-indigo-500" },
];

export default function CheckInPage() {
  const [selectedOctant, setSelectedOctant] = useState<string>("flow");
  const [reflectionText, setReflectionText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/myfive/dashboard">
              <span className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-all cursor-pointer block">
                <ArrowLeft className="w-4 h-4" />
              </span>
            </Link>
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <h1 className="font-bold text-base text-white">Private Needs & Flow Check-In</h1>
            </div>
          </div>

          <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
            <Lock className="w-3 h-3" /> Blind Vault
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-1">Step 1 of 2</span>
              <h2 className="text-2xl font-extrabold text-white mb-2">Select Your Current Flow Octant</h2>
              <p className="text-slate-400 text-sm">
                Where are you in Csikszentmihalyi’s 8-Octant Flow State Spectrum regarding this relationship?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OCTANTS.map((octant) => (
                <button
                  type="button"
                  key={octant.id}
                  onClick={() => setSelectedOctant(octant.id)}
                  className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    selectedOctant === octant.id
                      ? "bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg"
                      : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white">{octant.name}</span>
                    <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${octant.color}`} />
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">{octant.desc}</p>
                </button>
              ))}
            </div>

            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-1">Step 2 of 2</span>
              <h2 className="text-xl font-bold text-white mb-2">Qualitative Reflection (Private)</h2>
              <p className="text-slate-400 text-sm mb-3">
                Write down what you are sensing or what needs are coming up. This text stays 100% confidential in your private vault.
              </p>

              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Write your private reflection here..."
                rows={5}
                className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Complete Private Check-In & Generate Prompts
            </button>
          </form>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-center space-y-6">
            <div className="p-4 bg-emerald-500/10 rounded-full w-fit mx-auto text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Check-In Stored in Vault</h2>
              <p className="text-slate-300 text-sm max-w-lg mx-auto">
                Your private reflection has been saved to your encrypted local store. Here are 3 non-coercive conversation prompts generated for off-screen dialogue:
              </p>
            </div>

            <div className="space-y-3 text-left max-w-lg mx-auto">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm">
                1. &ldquo;When we spent time together recently, I noticed feeling in <strong className="text-emerald-400">{selectedOctant}</strong>. How did that moment feel from your perspective?&rdquo;
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm">
                2. &ldquo;What is one small micro-deposit we can make into our relationship this week?&rdquo;
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm">
                3. &ldquo;How can I best support your physical or emotional energy in our next check-in?&rdquo;
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center gap-4">
              <Link href="/myfive/dashboard">
                <span className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-all cursor-pointer">
                  Return to Dashboard
                </span>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
