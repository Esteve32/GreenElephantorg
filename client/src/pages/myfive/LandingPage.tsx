import React from "react";
import { Link } from "wouter";
import { Compass, ShieldCheck, Users, Sparkles, ArrowRight, HeartHandshake } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="myfive-theme min-h-screen text-slate-100 flex flex-col">
      {/* Hero Header */}
      <header className="myfive-glass-strong border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                MyFive
              </span>
              <span className="text-xs text-slate-400 ml-2 font-mono">by Green Elephant</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/myfive/dashboard">
              <span className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-emerald-900/20 flex items-center gap-2 cursor-pointer">
                Enter Compass HUD <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Banner */}
      <main className="flex-1">
        <section className="py-20 px-4 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Calm Technology for Deep Human Connections</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Illumination, Not Judgment.<br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Tend Your 5 Core Relationships.
            </span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            An intentional digital compass designed for your inner circle. Grounded in clinical Gottman models, Wheel of Consent, and strict data sovereignty.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/myfive/dashboard">
              <span className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-base transition-all shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer">
                Open MyFive Dashboard <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
            <Link href="/myfive/settings">
              <span className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-base transition-all flex items-center justify-center gap-2 cursor-pointer">
                Sovereignty & Pay Gates
              </span>
            </Link>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="py-16 bg-slate-900/40 border-y border-slate-800/80">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="myfive-glass myfive-biolume-edge p-6 rounded-2xl border">
              <div className="p-3 bg-emerald-500/10 rounded-xl w-fit text-emerald-400 mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Hard 5-Dunbar Limit</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Anthropologically capped to 5 active partner connection seats plus 1 self-reflection slot (Philautia). Zero algorithmic feed bloat.
              </p>
            </div>

            <div className="myfive-glass myfive-biolume-edge p-6 rounded-2xl border">
              <div className="p-3 bg-teal-500/10 rounded-xl w-fit text-teal-400 mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">9 ValueRules™ Consent</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Unskippable threshold consent gate. Dyadic agreements built on Respect, Kindness, Privacy, Curiosity, and Transparency.
              </p>
            </div>

            <div className="myfive-glass myfive-biolume-edge p-6 rounded-2xl border">
              <div className="p-3 bg-cyan-500/10 rounded-xl w-fit text-cyan-400 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Data Sovereignty</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Private check-ins remain 100% blind to partners and admins. Absolute GDPR Article 17 cascade wipe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-slate-500 text-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} Green Elephant. All rights reserved.</span>
          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <Link href="/myfive/check-in"><span className="hover:text-emerald-400 cursor-pointer">Private Check-in</span></Link>
            <Link href="/myfive/agreements"><span className="hover:text-emerald-400 cursor-pointer">Dyadic Agreements</span></Link>
            <Link href="/myfive/settings"><span className="hover:text-emerald-400 cursor-pointer">Settings & Pay Gates</span></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
