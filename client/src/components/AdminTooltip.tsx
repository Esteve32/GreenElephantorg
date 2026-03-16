import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface AdminTooltipProps {
  what: string;
  how?: string;
  debug?: { label: string; href: string }[];
  side?: "top" | "bottom" | "left" | "right";
  iconSize?: string;
  children?: React.ReactNode;
}

export function AdminTooltip({ what, how, debug, side = "top", iconSize = "h-3.5 w-3.5", children }: AdminTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children ? (
          <div className="cursor-help">{children}</div>
        ) : (
          <button type="button" className="inline-flex items-center text-white/30 hover:text-white/60 transition-colors ml-1.5 align-middle" data-testid="button-admin-tooltip">
            <HelpCircle className={iconSize} />
          </button>
        )}
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-sm text-xs space-y-2 p-3">
        <p className="text-foreground font-medium">{what}</p>
        {how && (
          <p className="text-muted-foreground">{how}</p>
        )}
        {debug && debug.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 border-t border-border/50">
            {debug.map((d, i) => (
              <a
                key={i}
                href={d.href}
                target={d.href.startsWith('http') ? '_blank' : undefined}
                rel={d.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-needs hover:text-needs/80 underline underline-offset-2 text-xs"
                data-testid={`link-debug-${d.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {d.label}
              </a>
            ))}
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
