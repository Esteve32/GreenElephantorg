import { useEffect, useRef, useCallback } from "react";
import { X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToolWindowProps {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
  actionLoading?: boolean;
}

export function ToolWindow({
  title,
  subtitle,
  icon: Icon,
  isOpen,
  onClose,
  children,
  actionLabel,
  onAction,
  actionDisabled,
  actionLoading,
}: ToolWindowProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      data-testid={`tool-window-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      <div
        ref={dialogRef}
        className="relative w-full h-full sm:h-auto sm:max-w-lg sm:mx-4 sm:max-h-[80vh] bg-[#0a0a0a] border-0 sm:border border-white/10 sm:rounded-xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300"
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#009999]/15 border border-[#009999]/30 flex items-center justify-center">
              <Icon className="w-4 h-4 text-[#009999]" />
            </div>
            <div>
              <h2
                className="text-base font-semibold text-white"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white/40 shrink-0"
            aria-label="Close"
            data-testid="button-close-tool"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {children}
        </div>

        <div className="px-5 pb-5 pt-3 border-t border-white/5 space-y-3">
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
            <Shield className="w-3.5 h-3.5 text-[#009999] mt-0.5 shrink-0" />
            <p className="text-xs text-white/30 leading-relaxed">
              Your data stays private. Nothing is used for AI training. You can
              delete all your data anytime from Settings.
            </p>
          </div>

          {actionLabel && (
            <Button
              onClick={onAction}
              disabled={actionDisabled || actionLoading || !onAction}
              className="w-full bg-[#009999] text-white border-[#009999]/30"
              data-testid="button-tool-action"
            >
              {actionLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                actionLabel
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
