import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HelpCircle } from 'lucide-react';

interface AdminTooltipProps {
  what: string;
  how?: string;
  debug?: { label: string; href: string }[];
  side?: 'top' | 'bottom' | 'left' | 'right';
  iconSize?: string;
  children?: React.ReactNode;
}

export function AdminTooltip({ what, how, debug, side = 'top', iconSize = 'h-5 w-5', children }: AdminTooltipProps) {
  return <Popover>
    {children}
    <Tooltip>
      <TooltipTrigger asChild><PopoverTrigger asChild>
        <button type="button" aria-label={`Explain: ${what}`} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded text-teal-200 hover:bg-teal-300/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300 ml-1 align-middle" data-testid="button-admin-tooltip">
          <HelpCircle className={iconSize} aria-hidden="true" />
        </button>
      </PopoverTrigger></TooltipTrigger>
      <TooltipContent side={side} className="max-w-[min(24rem,calc(100vw-2rem))] p-3 text-base leading-relaxed">{what}</TooltipContent>
    </Tooltip>
    <PopoverContent side={side} className="max-w-[calc(100vw-2rem)] w-96 p-4 text-base leading-relaxed space-y-3 border-teal-300/30 bg-[#0d2228] text-white">
      <p className="font-semibold">{what}</p>
      {how && <p>{how}</p>}
      {debug && debug.length > 0 && <div className="flex flex-wrap gap-3 pt-2 border-t border-white/20">
        {debug.map(link => <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="text-teal-200 underline underline-offset-2" data-testid={`link-debug-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>{link.label}</a>)}
      </div>}
      <p className="text-white/70">Click outside or press Escape to close.</p>
    </PopoverContent>
  </Popover>;
}
