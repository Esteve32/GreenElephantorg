import { useId, useState } from 'react';
import { CircleHelp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

/** The short meaning works on hover/focus; the full lesson stays open on click/tap. */
export function ContextHelp({ label, meaning, example, action }: {
  label: string; meaning: string; example: string; action: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return <div className="my-2 text-base leading-relaxed">
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" aria-label={`Explain ${label}`} aria-expanded={open} aria-controls={id}
          onClick={() => setOpen(value => !value)}
          className="inline-flex min-h-11 items-center gap-2 rounded px-2 text-teal-200 hover:bg-teal-300/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300">
          <CircleHelp className="h-5 w-5 shrink-0" aria-hidden="true" /> What does this mean?
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-[min(24rem,calc(100vw-2rem))] p-3 text-base leading-relaxed">{meaning}</TooltipContent>
    </Tooltip>
    <div id={id} hidden={!open} className="mt-2 space-y-2 rounded-lg border border-teal-300/30 bg-[#0d2228] p-4 text-white/90">
      <p><strong>Meaning: </strong>{meaning}</p>
      <p><strong>Example: </strong>{example}</p>
      <p><strong>Try this: </strong>{action}</p>
    </div>
  </div>;
}

export function ActionLearning({ task, check }: { task: string; check: string }) {
  return <aside className="my-4 rounded-xl border border-teal-300/30 bg-[#0d2228] p-4 text-base leading-relaxed">
    <p className="font-semibold text-teal-100">Learn by doing — one small task</p>
    <p className="mt-2 text-white/90">{task}</p>
    <details className="mt-3"><summary className="cursor-pointer text-teal-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300">How can I check my work?</summary>
      <p className="mt-2 text-white/80">{check}</p>
    </details>
  </aside>;
}
