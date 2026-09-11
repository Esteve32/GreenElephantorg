import React, { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Compass, CheckCircle2, ArrowLeft } from "lucide-react";
import { ValueRulesConsentGate } from "@/components/myfive/ValueRulesConsentGate";
import { apiRequest } from "@/lib/queryClient";
import { VALUE_RULES_VERSION, type ValueRuleId } from "@shared/valueRules";

type AgreementConsentState =
  | "own_consent_required"
  | "partner_consent_pending"
  | "eligible"
  | "version_refresh_required"
  | "partner_not_linked"
  | "not_participant";

interface AgreementResponse {
  agreementText: string;
  version: number;
  savedAt: string | null;
  valueRulesVersion: string | null;
  consentState: AgreementConsentState;
}

export default function AgreementPage() {
  const slotId = useMemo(() => new URLSearchParams(window.location.search).get("slot") || "primary", []);
  const [consentState, setConsentState] = useState<AgreementConsentState>("own_consent_required");
  const [agreementText, setAgreementText] = useState("");
  const [version, setVersion] = useState(0);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAgreement = async (active = true) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/myfive/agreements/${encodeURIComponent(slotId)}`, { credentials: "include" });
      if (!response.ok) throw new Error("The living agreement could not be loaded.");
      const agreement = await response.json() as AgreementResponse;
      if (!active) return;
      setAgreementText(agreement.agreementText);
      setVersion(agreement.version);
      setSavedAt(agreement.savedAt);
      setConsentState(agreement.consentState);
    } catch (loadError) {
      if (active) setError(loadError instanceof Error ? loadError.message : "The living agreement could not be loaded.");
    } finally {
      if (active) setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    loadAgreement(active);
    return () => { active = false; };
  }, [slotId]);

  const recordConsent = async (acceptedRuleIds: readonly ValueRuleId[]) => {
    await apiRequest("POST", "/api/myfive/consent", {
      acceptedRuleIds,
      rulesVersion: VALUE_RULES_VERSION,
      consentType: "agreement-sharing",
      slotId,
    });
    await loadAgreement();
  };

  const withdrawConsent = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await apiRequest("POST", "/api/myfive/consent/withdraw", {
        consentType: "agreement-sharing",
        slotId,
      });
      await loadAgreement();
    } catch (withdrawError) {
      setError(withdrawError instanceof Error ? withdrawError.message : "Consent withdrawal could not be recorded.");
    } finally {
      setIsSaving(false);
    }
  };

  const saveAgreement = async () => {
    if (consentState !== "eligible") return;
    setIsSaving(true);
    setError(null);
    try {
      const response = await apiRequest("POST", "/api/myfive/agreements", {
        slotId,
        agreementText,
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

  const consentMessage = () => {
    if (consentState === "partner_consent_pending") return "Your current ValueRules™ consent is recorded. The shared agreement unlocks after your linked partner independently accepts the current version.";
    if (consentState === "version_refresh_required") return "The ValueRules™ material version has changed. Please review and accept the current version before editing shared agreements.";
    if (consentState === "partner_not_linked") return "This agreement unlocks after the partner seat is linked to a verified account and both participants consent.";
    if (consentState === "not_participant") return "This account is not linked to this shared agreement.";
    return "Your and your partner's current ValueRules™ consent are recorded for this connection.";
  };

  const agreementUnlocked = consentState === "eligible";
  const showConsentGate = consentState === "own_consent_required" || consentState === "version_refresh_required";

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

      {showConsentGate && <ValueRulesConsentGate onAccept={recordConsent} />}

      <main
        aria-hidden={showConsentGate}
        className={`flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-8 ${showConsentGate ? "pointer-events-none select-none blur-sm" : ""}`}
      >
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>{consentMessage()}</span>
              <button
                type="button"
                onClick={withdrawConsent}
                disabled={isSaving || consentState === "own_consent_required" || consentState === "version_refresh_required"}
                className="ml-auto shrink-0 text-teal-200 underline underline-offset-2 hover:text-white"
              >
                Withdraw
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
                disabled={isLoading || isSaving || !agreementUnlocked}
                rows={8}
                className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono text-sm leading-relaxed focus:outline-none focus:border-teal-500 resize-none"
              />

              <button
                onClick={saveAgreement}
                disabled={isLoading || isSaving || !agreementUnlocked || !agreementText.trim()}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50 text-white font-semibold text-sm transition-all"
              >
                {isLoading ? "Loading agreement…" : isSaving ? "Saving…" : agreementUnlocked ? `Save as version ${version + 1}` : "Waiting for bilateral consent"}
              </button>
            </div>
          </div>
      </main>
    </div>
  );
}
