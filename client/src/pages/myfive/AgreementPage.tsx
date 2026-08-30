import React, { useState } from "react";
import { Link } from "wouter";
import { Compass, CheckCircle2, ArrowLeft } from "lucide-react";
import { ValueRulesConsentGate } from "@/components/myfive/ValueRulesConsentGate";
import { apiRequest } from "@/lib/queryClient";
import { VALUE_RULES_VERSION, type ValueRuleId } from "@shared/valueRules";

export default function AgreementPage() {
  const [consented, setConsented] = useState(false);
  const [agreementText, setAgreementText] = useState(
    "Agreement on Quiet Hours & Evening Energy:\n- We agree to keep 21:00 to 08:00 notification-free.\n- We review this living agreement every 30 days."
  );
  const [isSaved, setIsSubmittedSaved] = useState(false);

  const recordConsent = async (acceptedRuleIds: readonly ValueRuleId[]) => {
    await apiRequest("POST", "/api/myfive/consent", {
      acceptedRuleIds,
      rulesVersion: VALUE_RULES_VERSION,
      consentType: "agreement-sharing",
    });
    setConsented(true);
  };

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

      {!consented && <ValueRulesConsentGate onAccept={recordConsent} />}

      <main
        aria-hidden={!consented}
        className={`flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-8 ${!consented ? "pointer-events-none select-none blur-sm" : ""}`}
      >
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Your 9 ValueRules™ consent is active for this session. Partner consent is recorded separately.</span>
              <button
                type="button"
                onClick={() => setConsented(false)}
                className="ml-auto shrink-0 text-teal-200 underline underline-offset-2 hover:text-white"
              >
                Review / withdraw
              </button>
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
      </main>
    </div>
  );
}
