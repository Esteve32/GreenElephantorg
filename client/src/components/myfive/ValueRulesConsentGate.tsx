import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { CheckCircle2, HeartHandshake, ShieldCheck } from "lucide-react";
import { VALUE_RULES, VALUE_RULES_VERSION, type ValueRuleId } from "@shared/valueRules";

interface ValueRulesConsentGateProps {
  onAccept: (acceptedRuleIds: readonly ValueRuleId[]) => Promise<void>;
}

export function ValueRulesConsentGate({ onAccept }: ValueRulesConsentGateProps) {
  const [acceptedRules, setAcceptedRules] = useState<Set<ValueRuleId>>(() => new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const allRulesAccepted = acceptedRules.size === VALUE_RULES.length;

  useEffect(() => {
    dialogRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const keepFocusInsideDialog = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (focusable.length === 0) {
      event.preventDefault();
      dialogRef.current.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const submitConsent = async () => {
    if (!allRulesAccepted || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onAccept(VALUE_RULES.map((rule) => rule.id));
    } catch (error) {
      console.error("ValueRules consent failed", error);
      setSubmitError("Consent was not recorded. The shared space remains locked; please try again.");
      setIsSubmitting(false);
    }
  };

  const toggleRule = (ruleId: ValueRuleId) => {
    setAcceptedRules((current) => {
      const next = new Set(current);
      if (next.has(ruleId)) next.delete(ruleId);
      else next.add(ruleId);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-[#070a12]/90 p-4 backdrop-blur-md">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        onKeyDown={keepFocusInsideDialog}
        className="myfive-glass-strong myfive-biolume-edge my-4 w-full max-w-2xl rounded-2xl border p-5 outline-none sm:p-8"
      >
        <div className="mb-4 flex items-start gap-3 text-teal-300">
          <ShieldCheck className="mt-0.5 h-7 w-7 shrink-0" />
          <div>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-teal-400/80">
              Consent boundary · Version {VALUE_RULES_VERSION}
            </p>
            <h2 id={titleId} className="text-xl font-bold text-white sm:text-2xl">
              Agree to each ValueRule™ to enter
            </h2>
          </div>
        </div>

        <p id={descriptionId} className="mb-5 text-sm leading-relaxed text-slate-300">
          This shared relationship space stays locked until you explicitly accept all nine rules. Your partner must provide their own consent separately.
        </p>

        <fieldset className="space-y-2">
          <legend className="sr-only">Nine ValueRules consent choices</legend>
          {VALUE_RULES.map((rule, index) => {
            const checked = acceptedRules.has(rule.id);
            return (
              <label
                key={rule.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                  checked
                    ? "border-teal-400/50 bg-teal-400/10"
                    : "border-slate-700/80 bg-slate-950/55 hover:border-slate-600"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleRule(rule.id)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-600 accent-teal-500"
                />
                <span className="min-w-0 text-sm">
                  <strong className="text-slate-100">{index + 1}. {rule.name}</strong>
                  <span className="block text-xs leading-relaxed text-slate-400">{rule.description}</span>
                </span>
                {checked && <CheckCircle2 aria-hidden="true" className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-teal-400" />}
              </label>
            );
          })}
        </fieldset>

        <div className="mt-5" aria-live="polite">
          <p className="mb-2 text-center font-mono text-xs text-slate-400">
            {acceptedRules.size} of {VALUE_RULES.length} individually accepted
          </p>
          <button
            type="button"
            disabled={!allRulesAccepted || isSubmitting}
            onClick={submitConsent}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-teal-500 hover:to-emerald-500 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400"
          >
            <HeartHandshake className="h-4 w-4" />
            {isSubmitting ? "Recording consent…" : "Accept all nine and enter shared space"}
          </button>
          {submitError && <p role="alert" className="mt-3 text-center text-sm text-rose-300">{submitError}</p>}
        </div>
      </div>
    </div>
  );
}
