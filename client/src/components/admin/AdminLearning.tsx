import { useId, useState } from 'react';
import { BookOpen, ChevronDown, CircleHelp } from 'lucide-react';
import { Link } from 'wouter';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ADMIN_LEARNING, type AdminLearningId } from '@shared/admin-learning';

export function LearningTopic({ topic }: { topic: AdminLearningId }) {
  const item = ADMIN_LEARNING[topic];
  const [open, setOpen] = useState(false);
  const id = useId();
  return <section className="rounded-xl border border-teal-300/20 bg-white/5 p-4" data-learning-topic={topic}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={id}
          className="flex w-full items-center gap-3 text-left text-base font-semibold text-teal-100 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300 focus-visible:outline-offset-4">
          <CircleHelp className="w-5 h-5 shrink-0" aria-hidden="true" /><span className="flex-1">{item.title}</span>
          <ChevronDown className={`w-5 h-5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-[min(22rem,calc(100vw-2rem))] text-sm leading-relaxed p-3">{item.short}</TooltipContent>
    </Tooltip>
    <div id={id} hidden={!open} className="space-y-3 pt-4 text-base text-white/80 leading-relaxed">
      <p>{item.short}</p><p>{item.detail}</p>
      <p className="border-l-2 border-teal-300/50 pl-3">{item.example}</p>
      <p><strong className="text-amber-200">Here, today: </strong>{item.status}</p>
      <a href={item.source} target="_blank" rel="noopener noreferrer" className="inline-block text-teal-200 underline underline-offset-4">{item.sourceLabel} ↗</a>
    </div>
  </section>;
}

export function AdminLearningPanel({ topics }: { topics: AdminLearningId[] }) {
  return <details className="rounded-xl border border-teal-300/25 bg-[#0d2228] text-white p-5 my-6">
    <summary className="cursor-pointer text-lg font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300">
      Learning toolbox — learn one step at a time
    </summary>
    <p className="text-white/70 my-4">Choose one term. Hover or use the Tab key for a short meaning. Click or tap for an example, then try it in your work. “Here, today” tells you what has actually been built.</p>
    <div className="grid md:grid-cols-2 gap-3">{topics.map(topic => <LearningTopic key={topic} topic={topic} />)}</div>
    <TrainingLink />
  </details>;
}

export function TrainingLink() {
  return <Link href="/admin/training" className="inline-flex items-center gap-2 rounded border border-teal-300/30 px-4 py-3 mt-4 text-teal-100 hover:bg-teal-300/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300">
    <BookOpen className="h-5 w-5" aria-hidden="true" /> Open the training view — fictional examples
  </Link>;
}
