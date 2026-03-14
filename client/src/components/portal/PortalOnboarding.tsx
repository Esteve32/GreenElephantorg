import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  MessageSquare,
  Activity,
  Scan,
  Download,
  Zap,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Shield,
  CheckCircle2,
  Link2,
  Eye,
  Pencil,
} from "lucide-react";
import { SiNotion, SiLinkedin, SiGmail, SiGoogledocs } from "react-icons/si";
import { apiRequest } from "@/lib/queryClient";

interface PortalOnboardingProps {
  userName?: string;
  onComplete: () => void;
}

interface ToolToggle {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
  permRead: string;
  permWrite: string;
  enabled: boolean;
  remindLater: boolean;
}

interface IntegrationOption {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
  permissions: { read: string; write: string };
  comingSoon?: boolean;
}

const INITIAL_TOOLS: ToolToggle[] = [
  { id: "upload", name: "Upload", icon: Upload, color: "#009999", description: "Add files, text, or URLs to your timeline", permRead: "Timeline", permWrite: "Timeline", enabled: true, remindLater: false },
  { id: "debrief", name: "Debrief", icon: MessageSquare, color: "#33b864", description: "AI-powered conversation analysis", permRead: "Timeline, AI", permWrite: "Timeline", enabled: true, remindLater: false },
  { id: "flowcheck", name: "Flow Check", icon: Activity, color: "#a3cc33", description: "Quick communication pulse check", permRead: "None", permWrite: "Timeline", enabled: true, remindLater: false },
  { id: "reflection", name: "Reflection", icon: Scan, color: "#e8833a", description: "Deep lens-based reflection with AI", permRead: "Timeline, AI", permWrite: "Timeline", enabled: true, remindLater: false },
  { id: "export", name: "Export", icon: Download, color: "#3b7dd8", description: "Download your data in any format", permRead: "Timeline, Context", permWrite: "None", enabled: true, remindLater: false },
  { id: "microhabits", name: "Micro Habits", icon: Zap, color: "#e8c840", description: "AI-generated daily habits", permRead: "Context, AI", permWrite: "Timeline", enabled: true, remindLater: false },
  { id: "prepare", name: "Prepare", icon: BookOpen, color: "#9933cc", description: "Communication preparation with AI", permRead: "AI", permWrite: "Timeline", enabled: true, remindLater: false },
];

const INTEGRATIONS: IntegrationOption[] = [
  { id: "linkedin", name: "LinkedIn", icon: SiLinkedin, color: "#0a66c2", description: "Import profile data and connections", permissions: { read: "Read profile info", write: "None" } },
  { id: "notion", name: "Notion", icon: SiNotion, color: "#ffffff", description: "Sync your coaching data to Notion", permissions: { read: "Read workspace pages", write: "Create/update pages" } },
  { id: "gmail", name: "Google Mail", icon: SiGmail, color: "#ea4335", description: "Import email threads for communication analysis", permissions: { read: "Read email metadata", write: "None" }, comingSoon: true },
  { id: "gdocs", name: "Google Docs", icon: SiGoogledocs, color: "#4285f4", description: "Sync coaching documents and reports", permissions: { read: "Read documents", write: "Create/update docs" }, comingSoon: true },
];

const TOUR_HIGHLIGHTS = [
  {
    target: "orbital-overview",
    title: "Orbital Overview",
    desc: "Your communication profile at a glance — see how you score across all 8 lenses of conscious communication.",
    color: "#009999",
  },
  {
    target: "hud-toggle",
    title: "HUD Command Center",
    desc: "Tap this button to open your floating toolbar with all 7 tools.",
    color: "#a3cc33",
  },
  {
    target: "hud-button-upload",
    title: "Upload Tool",
    desc: "Add files, text, or URLs to your timeline. Everything you upload feeds into your communication profile.",
    color: "#009999",
  },
  {
    target: "hud-button-debrief",
    title: "Debrief Tool",
    desc: "Paste a conversation and get AI-powered analysis across the 8 communication lenses.",
    color: "#33b864",
  },
  {
    target: "hud-button-flowcheck",
    title: "Flow Check Tool",
    desc: "Quick 3-slider pulse check: motivation, challenge, and competence. Track how you feel over time.",
    color: "#a3cc33",
  },
  {
    target: "hud-button-reflection",
    title: "Reflection Tool",
    desc: "Deep lens-based reflection with AI coaching. Uses your timeline history for personalized insights.",
    color: "#e8833a",
  },
  {
    target: "hud-button-export",
    title: "Export Tool",
    desc: "Download your data in CSV, JSON, or share a summary. Your data portability right under GDPR.",
    color: "#3b7dd8",
  },
  {
    target: "hud-button-microhabits",
    title: "Micro Habits Tool",
    desc: "AI-generated daily habits based on your core values. Export to calendar with .ics files.",
    color: "#e8c840",
  },
  {
    target: "hud-button-prepare",
    title: "Prepare Tool",
    desc: "Get AI coaching tips for an upcoming meeting, talk, or difficult conversation.",
    color: "#9933cc",
  },
  {
    target: "timeline-section",
    title: "Your Timeline",
    desc: "Every scan, coaching session, reflection, and habit shows up here. Scroll to revisit your growth journey.",
    color: "#3b7dd8",
  },
  {
    target: "portal-settings-link",
    title: "Settings",
    desc: "Control your data privacy, connect services, and manage your account preferences.",
    color: "#9933cc",
  },
];

function GuidedTourStep() {
  const [tourIndex, setTourIndex] = useState(0);
  const current = TOUR_HIGHLIGHTS[tourIndex];
  const isLast = tourIndex === TOUR_HIGHLIGHTS.length - 1;

  useEffect(() => {
    const isHudButton = current.target.startsWith("hud-button-");
    const isHudToggle = current.target === "hud-toggle";
    if (isHudButton || isHudToggle) {
      const toggle = document.querySelector('[data-tour="hud-toggle"]') as HTMLButtonElement | null;
      if (toggle) {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        if (isHudButton && !expanded) {
          toggle.click();
        }
        if (isHudToggle && expanded) {
          toggle.click();
        }
      }
    }
    const findEl = () =>
      document.querySelector(`[data-testid="${current.target}"]`) ||
      document.querySelector(`[data-tour="${current.target}"]`);
    const timer = setTimeout(() => {
      const el = findEl();
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("tour-highlight");
      }
    }, isHudButton ? 350 : 50);
    return () => {
      clearTimeout(timer);
      const el = findEl();
      if (el) el.classList.remove("tour-highlight");
    };
  }, [current.target]);

  return (
    <div className="space-y-5">
      <div className="text-center mb-4">
        <Sparkles className="w-8 h-8 text-[#e8c840] mx-auto mb-2" />
        <h2 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "Poppins, sans-serif" }} data-testid="text-onboarding-title">
          Quick Tour
        </h2>
        <p className="text-xs text-white/40">
          Highlight {tourIndex + 1} of {TOUR_HIGHLIGHTS.length}
        </p>
      </div>

      <div className="relative">
        <div
          className="p-5 rounded-xl border-2 animate-in fade-in duration-300"
          style={{
            borderColor: `${current.color}60`,
            backgroundColor: `${current.color}08`,
            boxShadow: `0 0 30px ${current.color}15, inset 0 0 20px ${current.color}05`,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ backgroundColor: `${current.color}25`, color: current.color }}
            >
              {tourIndex + 1}
            </div>
            <div>
              <p className="text-sm font-semibold text-white mb-1">{current.title}</p>
              <p className="text-xs text-white/50 leading-relaxed">{current.desc}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-4">
          <div className="flex gap-1">
            {TOUR_HIGHLIGHTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setTourIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  i === tourIndex ? "w-5" : "opacity-30"
                }`}
                style={{ backgroundColor: i === tourIndex ? current.color : "#fff" }}
                data-testid={`tour-dot-${i}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {tourIndex > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-white/30"
                onClick={() => setTourIndex(tourIndex - 1)}
                data-testid="button-tour-prev"
              >
                <ChevronLeft className="w-3 h-3 mr-1" />
                Back
              </Button>
            )}
            {!isLast && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-white/10"
                onClick={() => setTourIndex(tourIndex + 1)}
                data-testid="button-tour-next"
              >
                Next
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const STEP_IDS = ["welcome", "consent", "tools", "integrations", "tour", "ready"] as const;

export function PortalOnboarding({ userName, onComplete }: PortalOnboardingProps) {
  const [step, setStep] = useState(0);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [toolToggles, setToolToggles] = useState<ToolToggle[]>(INITIAL_TOOLS);
  const stepId = STEP_IDS[step];
  const isLast = step === STEP_IDS.length - 1;

  const canProceed = () => {
    if (stepId === "consent") return consentAccepted;
    return true;
  };

  const handleComplete = useCallback(async () => {
    const enabledTools = toolToggles.filter((t) => t.enabled && !t.remindLater).map((t) => t.id);
    const remindLaterTools = toolToggles.filter((t) => t.remindLater).map((t) => t.id);
    try {
      const requests = [
        apiRequest("POST", "/api/portal/context", {
          key: "onboarding_complete",
          value: new Date().toISOString(),
        }),
        apiRequest("POST", "/api/portal/context", {
          key: "onboarding_consent_date",
          value: new Date().toISOString(),
        }),
        apiRequest("POST", "/api/portal/context", {
          key: "enabled_tools",
          value: enabledTools.join(","),
        }),
      ];
      if (remindLaterTools.length > 0) {
        requests.push(
          apiRequest("POST", "/api/portal/context", {
            key: "remind_later_tools",
            value: remindLaterTools.join(","),
          })
        );
      }
      await Promise.all(requests);
    } catch (err: unknown) {
      console.error("Failed to save onboarding state:", err instanceof Error ? err.message : "Unknown");
    }
    onComplete();
  }, [onComplete, toolToggles]);

  const handleSkip = useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  const toggleTool = (toolId: string) => {
    setToolToggles((prev) =>
      prev.map((t) => (t.id === toolId ? { ...t, enabled: !t.enabled, remindLater: false } : t))
    );
  };

  const setRemindLater = (toolId: string) => {
    setToolToggles((prev) =>
      prev.map((t) => (t.id === toolId ? { ...t, enabled: false, remindLater: !t.remindLater } : t))
    );
  };

  const renderStepContent = () => {
    switch (stepId) {
      case "welcome":
        return (
          <div className="text-center mb-6">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{
                backgroundColor: "#00999915",
                border: "2px solid #00999940",
                boxShadow: "0 0 24px #00999920",
              }}
            >
              <Sparkles className="w-7 h-7 text-[#009999]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }} data-testid="text-onboarding-title">
              {userName ? `Welcome, ${userName.split(" ")[0]}` : "Welcome to Your Portal"}
            </h2>
            <p className="text-sm text-white/50 leading-relaxed" data-testid="text-onboarding-desc">
              This is your personal communication coaching space. Everything here is private, GDPR-compliant, and designed to help you grow through the 8 Lenses of Conscious Communication.
            </p>
          </div>
        );

      case "consent":
        return (
          <div className="space-y-5">
            <div className="text-center mb-4">
              <Shield className="w-10 h-10 text-[#e85d75] mx-auto mb-3" />
              <h2 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "Poppins, sans-serif" }} data-testid="text-onboarding-title">
                Terms & Privacy
              </h2>
              <p className="text-xs text-white/40">Please review and accept before continuing</p>
            </div>

            <div className="p-4 rounded-lg bg-white/[0.03] border border-white/10 space-y-3 max-h-40 overflow-y-auto text-xs text-white/50 leading-relaxed">
              <p>By using the GreenElephant Portal, you agree to our Terms of Service and Privacy Policy.</p>
              <p>Your data is processed under GDPR. We collect only what you explicitly provide (scan results, coaching notes, reflections). Your data is never sold or used for AI model training.</p>
              <p>You can export or delete all your data at any time from Settings. AI-powered tools use your data only to generate personalized coaching insights within your session.</p>
              <p>For full details, see our <a href="/privacy" className="text-[#009999] underline" target="_blank" rel="noopener">Privacy Policy</a>.</p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group" data-testid="checkbox-consent">
              <div
                className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                  consentAccepted ? "bg-[#009999] border-[#009999]" : "border-white/20 bg-transparent"
                }`}
                onClick={() => setConsentAccepted(!consentAccepted)}
              >
                {consentAccepted && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className="text-xs text-white/60 leading-relaxed" onClick={() => setConsentAccepted(!consentAccepted)}>
                I accept the Terms of Service and Privacy Policy. I understand my data is processed under GDPR and I can withdraw consent at any time.
              </span>
            </label>
          </div>
        );

      case "tools":
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Activity className="w-8 h-8 text-[#a3cc33] mx-auto mb-2" />
              <h2 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "Poppins, sans-serif" }} data-testid="text-onboarding-title">
                Choose Your Tools
              </h2>
              <p className="text-xs text-white/40">Enable the tools you want. You can change this later in Settings.</p>
            </div>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {toolToggles.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={tool.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      tool.remindLater ? "bg-[#e8c840]/5 border-[#e8c840]/20 opacity-70" :
                      tool.enabled ? "bg-white/[0.03] border-white/10" : "bg-transparent border-white/5 opacity-50"
                    }`}
                    data-testid={`toggle-tool-${tool.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${tool.color}15`, border: `1.5px solid ${tool.color}30` }}
                      >
                        <Icon className="w-3.5 h-3.5" style={{ color: tool.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white">{tool.name}</p>
                        <p className="text-xs text-white/30">{tool.description}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1 text-xs text-white/20">
                            <Eye className="w-2.5 h-2.5" /> Read: {tool.permRead}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-white/20">
                            <Pencil className="w-2.5 h-2.5" /> Write: {tool.permWrite}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!tool.remindLater && (
                          <button
                            className={`w-9 h-5 rounded-full transition-colors relative ${
                              tool.enabled ? "bg-[#009999]" : "bg-white/10"
                            }`}
                            onClick={() => toggleTool(tool.id)}
                          >
                            <div
                              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                                tool.enabled ? "left-[1.1rem]" : "left-0.5"
                              }`}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end mt-1.5">
                      <button
                        className={`text-xs transition-colors ${
                          tool.remindLater ? "text-[#e8c840]/60" : "text-white/15 hover:text-white/30"
                        }`}
                        onClick={() => setRemindLater(tool.id)}
                        data-testid={`remind-later-${tool.id}`}
                      >
                        {tool.remindLater ? "Undo remind me later" : "Remind me later"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "integrations":
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Link2 className="w-8 h-8 text-[#3b7dd8] mx-auto mb-2" />
              <h2 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "Poppins, sans-serif" }} data-testid="text-onboarding-title">
                Connect Services
              </h2>
              <p className="text-xs text-white/40">Optional. Connect external services to enrich your timeline.</p>
            </div>

            <div className="space-y-3">
              {INTEGRATIONS.map((integration) => {
                const Icon = integration.icon;
                return (
                  <div key={integration.id} className="p-4 rounded-lg bg-white/[0.03] border border-white/10" data-testid={`integration-${integration.id}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
                        <Icon className="w-4 h-4" style={{ color: integration.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{integration.name}</p>
                        <p className="text-xs text-white/30">{integration.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/25 mb-3">
                      <span className="flex items-center gap-1"><Eye className="w-2.5 h-2.5" /> {integration.permissions.read}</span>
                      <span className="flex items-center gap-1"><Pencil className="w-2.5 h-2.5" /> {integration.permissions.write}</span>
                    </div>
                    {integration.comingSoon ? (
                      <Badge variant="outline" className="text-xs border-white/10 text-white/25 w-full justify-center py-1">
                        Coming Soon
                      </Badge>
                    ) : (
                      <Button variant="outline" size="sm" className="text-xs border-white/10 text-white/40 w-full" onClick={() => window.location.href = "/portal/settings"} data-testid={`button-connect-${integration.id}`}>
                        Connect in Settings
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-white/20 text-center">You can connect these anytime from Settings</p>
          </div>
        );

      case "tour":
        return <GuidedTourStep />;

      case "ready":
        return (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center bg-[#009999]/15 border-2 border-[#009999]/40" style={{ boxShadow: "0 0 30px #00999930" }}>
              <CheckCircle2 className="w-8 h-8 text-[#009999]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }} data-testid="text-onboarding-title">
              You're All Set
            </h2>
            <p className="text-sm text-white/50 leading-relaxed mb-2">
              {toolToggles.filter((t) => t.enabled).length} tools enabled. Start by opening the HUD and trying a Flow Check or uploading your first scan results.
            </p>
            <p className="text-xs text-white/30">
              You can replay this tour anytime from Settings
            </p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4" data-testid="portal-onboarding">
      <div className="max-w-md w-full">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleSkip}
            className="text-white/30 hover:text-white/60 transition-colors text-xs flex items-center gap-1"
            data-testid="button-onboarding-skip"
          >
            Skip <X className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
          <div className="flex justify-center mb-6">
            <div className="flex gap-1.5">
              {STEP_IDS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all ${
                    i === step ? "w-8 bg-[#009999]" : i < step ? "w-4 bg-[#009999]/40" : "w-4 bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>

          {renderStepContent()}

          <div className="flex items-center justify-between gap-3 mt-6">
            {step > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-white/40"
                onClick={() => setStep((s) => s - 1)}
                data-testid="button-onboarding-back"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            ) : (
              <div />
            )}

            <Button
              size="sm"
              className="bg-[#009999] text-white border-[#009999]/30"
              disabled={!canProceed()}
              onClick={() => {
                if (isLast) {
                  handleComplete();
                } else {
                  setStep((s) => s + 1);
                }
              }}
              data-testid="button-onboarding-next"
            >
              {isLast ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Launch Portal
                </>
              ) : (
                <>
                  {stepId === "consent" ? "Accept & Continue" : "Next"} <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
