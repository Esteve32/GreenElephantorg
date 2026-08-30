import React, { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Compass, CheckCircle2, ArrowLeft } from "lucide-react";
import { ValueRulesConsentGate } from "@/components/myfive/ValueRulesConsentGate";
import { apiRequest } from "@/lib/queryClient";
import { VALUE_RULES_VERSION, type ValueRuleId } from "@shared/valueRules";

export default function AgreementPage() {
  const slotId = useMemo(() => new URLSearchParams(window.location.search).get("slot") || "primary", []);
  const [consented, setConsented] = useState(false);
  const [consentReceiptId, setConsentReceiptId] = useState<string | null>(null);
  const [agreementText, setAgreementText] = useState("");
  const [version, setVersion] = useState(0);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/myfive/agreements/${encodeURIComponent(slotId)}`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) throw new Error("The living agreement could not be loaded.");
        return response.json() as Promise<{ agreementText: string; version: number; savedAt: string | null }>;
      })
      .then((agreement) => {
        if (!active) return;
        setAgreementText(agreement.agreementText);
        setVersion(agreement.version);
        setSavedAt(agreement.savedAt);
      })
      .catch((loadError: Error) => active && setError(loadError.message))
      .finally(() => active && setIsLoading(false));
    return () => { active = false; };
  }, [slotId]);

  const recordConsent = async (acceptedRuleIds: readonly ValueRuleId[]) => {
    const response = await apiRequest("POST", "/api/myfive/consent", {
      acceptedRuleIds,
      rulesVersion: VALUE_RULES_VERSION,
      consentType: "agreement-sharing",
      slotId,
    });
    const receipt = await response.json() as { receiptId: string };
    setConsentReceiptId(receipt.receiptId);
    setConsented(true);
  };

  const saveAgreement = async () => {
    if (!consentReceiptId) return;
    setIsSaving(true);
    setError(null);
    try {
      const response = await apiRequest("POST", "/api/myfive/agreements", {
        slotId,
        agreementText,
        consentReceiptId,
        expectedVersion: version,
      });
      const saved = await response.json() as { version: number; savedAt: string };
      setVersion(saved.version);
      setSavedAt(saved.savedAt);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "The agreement could not be saved.");
    } finally {
      setIsSaving(false);
    }
  };

  const reviewConsent = () => {
    setConsented(false);
    setConsentReceiptId(null);
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
                onClick={reviewConsent}
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

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400" aria-live="polite">
                <span>Version {version}</span>
                <span>{savedAt ? `Timestamped ${new Date(savedAt).toLocaleString()}` : "Not yet saved"}</span>
                <span>Connection slot: {slotId}</span>
              </div>

              {error && (
                <div role="alert" className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <textarea
                value={agreementText}
                onChange={(e) => setAgreementText(e.target.value)}
                disabled={isLoading || isSaving}
                rows={8}
                className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono text-sm leading-relaxed focus:outline-none focus:border-teal-500 resize-none"
              />

              <button
                onClick={saveAgreement}
                disabled={isLoading || isSaving || !agreementText.trim()}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50 text-white font-semibold text-sm transition-all"
              >
                {isLoading ? "Loading agreement…" : isSaving ? "Saving new version…" : `Save as version ${version + 1}`}
              </button>
            </div>
          </div>
      </main>
    </div>
  );
}
