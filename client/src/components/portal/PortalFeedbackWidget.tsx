import { useState, useEffect } from "react";
import { MessageCircle, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const CALENDLY_FEEDBACK_URL = "https://calendly.com/greenelephant/green-elephant-feedback-session-with-esteve";

export function PortalFeedbackWidget() {
  const [dismissed, setDismissed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem("ge_feedback_dismissed");
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 60000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setShowPrompt(false);
    sessionStorage.setItem("ge_feedback_dismissed", "1");
  };

  const handleOpen = () => {
    window.open(CALENDLY_FEEDBACK_URL, "_blank", "noopener,noreferrer");
    setShowPrompt(false);
  };

  if (dismissed) return null;

  return (
    <>
      {showPrompt && (
        <div
          className="fixed bottom-24 right-4 z-50 max-w-[260px] animate-in fade-in slide-in-from-bottom-2 duration-300"
          data-testid="feedback-prompt"
        >
          <div className="relative bg-black/90 backdrop-blur-xl border border-white/15 rounded-xl p-4 shadow-2xl">
            <button
              onClick={() => setShowPrompt(false)}
              className="absolute top-2 right-2 text-white/30 hover:text-white/60 transition-colors"
              aria-label="Close feedback prompt"
              data-testid="button-close-feedback-prompt"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <p className="text-sm text-white/80 mb-3 pr-4 leading-relaxed" style={{ fontFamily: "Poppins, sans-serif" }}>
              How's your experience so far?
            </p>
            <p className="text-xs text-white/40 mb-3 leading-relaxed">
              We're in beta and your feedback shapes the portal. Book a quick session with Esteve.
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="text-xs bg-[#009999] text-white border-[#009999]/50"
                onClick={handleOpen}
                data-testid="button-book-feedback"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Book session
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-white/30"
                onClick={handleDismiss}
                data-testid="button-dismiss-feedback"
              >
                Not now
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-24 right-4 z-40" data-testid="feedback-widget">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleOpen}
              className="w-10 h-10 rounded-full bg-[#009999]/15 border border-[#009999]/25 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#009999]/25 active:scale-95"
              aria-label="Give feedback"
              data-testid="button-feedback-trigger"
            >
              <MessageCircle className="w-4 h-4 text-[#009999]/70" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="font-semibold text-sm">Beta Feedback</p>
            <p className="text-xs text-muted-foreground">Book a feedback session with Esteve</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  );
}
