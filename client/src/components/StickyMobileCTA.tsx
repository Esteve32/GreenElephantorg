import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";

interface StickyMobileCTAProps {
  price: string;
  label: string;
  href: string;
  sublabel?: string;
  scrollThreshold?: number;
}

export function StickyMobileCTA({ price, label, href, sublabel, scrollThreshold = 600 }: StickyMobileCTAProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const onScroll = () => {
      setVisible(window.scrollY > scrollThreshold);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollThreshold, dismissed]);

  if (dismissed || !visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden animate-in slide-in-from-bottom-4 duration-300"
      data-testid="sticky-mobile-cta"
    >
      <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-[#009999]/20 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setDismissed(true)}
          className="text-white/30 hover:text-white/50 shrink-0"
          aria-label="Dismiss"
          data-testid="button-dismiss-sticky-cta"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate" style={{ fontFamily: "Poppins, sans-serif" }}>
            {price}
          </p>
          {sublabel && (
            <p className="text-xs text-white/40 truncate">{sublabel}</p>
          )}
        </div>

        <Button
          asChild
          className="bg-[#009999] text-white border border-[#009999]/30 shrink-0"
          data-testid="button-sticky-cta-action"
        >
          <a href={href}>
            {label}
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </a>
        </Button>
      </div>
    </div>
  );
}
