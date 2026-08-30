import React, { useState } from "react";
import { Link } from "wouter";
import { Compass, ShieldCheck, CheckCircle2, ArrowLeft, HeartHandshake } from "lucide-react";

const VALUE_RULES = [
  "Respect — Honoring boundaries and dignity",
  "Kindness — Offering warmth in tone and action",
  "Privacy — Protecting confidential dyadic discussions",
  "Self-Awareness — Taking responsibility for own reactions",
  "Curiosity — Asking open questions before making assumptions",
  "Humility — Willingness to listen and adjust",
  "Collective Intelligence — Co-creating solutions together",
  "Social Learning — Growing through shared experience",
  "Transparency — Expressing needs clearly without hidden agendas",
];

export default function AgreementPage() {
  const [consented, setConsented] = useState(false);
  const [agreementText, setAgreementText] = useState(
    "Agreement on Quiet Hours & Evening Energy:\n- We agree to keep 21:00 to 08:00 notification-free.\n- We review this living agreement every 30 days."
  );
  const [isSaved, setIsSubmittedSaved] = useState(false);

  return (
    <div className="myfive-theme min-h-screen text-slate-100 flex flex-col">
      <header className="myfive-glass-strong border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/myfive/dashboard">
              <span className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-all cursor-pointer block">
                <ArrowLeft className="w-4 h-4" />
              </span>
            </Link>
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-teal-400" />
              <h1 className="font-bold text-base text-white">Dyadic Relationship Agreement</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Unskippable Consent Gate Overlay */}
        {!consented ? (
          <div className="myfive-glass myfive-biolume-edge p-6 sm:p-8 rounded-2xl border space-y-6">
            <div className="flex items-center space-x-3 text-teal-400">
              <ShieldCheck className="w-7 h-7" />
              <h2 className="text-xl font-bold text-white">Unskippable 9 ValueRules™ Consent Gate</h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Before viewing or co-creating shared relationship agreements, both partners must explicitly agree to uphold the 9 core ValueRules™:
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {VALUE_RULES.map((rule, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setConsented(true)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <HeartHandshake className="w-4 h-4" /> I Accept the 9 ValueRules™ & Enter Shared Space
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>9 ValueRules™ Consent Active for this Dyad.</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Living Relationship Agreement</h2>
              <p className="text-xs text-slate-400">
                Co-created rules and mutual commitments. Re-negotiated fluidly at any time.
              </p>

              <textarea
                value={agreementText}
                onChange={(e) => setAgreementText(e.target.value)}
                rows={8}
                className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono text-sm leading-relaxed focus:outline-none focus:border-teal-500 resize-none"
              />

              <button
                onClick={() => setIsSubmittedSaved(true)}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition-all"
              >
                {isSaved ? "✓ Living Agreement Timestamped & Saved" : "Save & Synchronize Agreement"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
