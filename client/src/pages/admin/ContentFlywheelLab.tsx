import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AdminTooltip } from "@/components/AdminTooltip";
import { AIContextSelector } from "@/components/AIContextSelector";
import { OutputFormatToggle, formatContent, useOutputFormat, type OutputFormat } from "@/components/OutputFormatToggle";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Newspaper,
  Bot,
  Briefcase,
  Loader2,
  Send,
  ChevronDown,
  ChevronRight,
  Search,
  FileText,
  BarChart3,
  Palette,
  Copy,
  Check,
  Zap,
  ExternalLink,
  BookOpen,
  Upload,
  Sparkles,
  MessageSquare,
  Users,
  User,
  SlidersHorizontal,
  Link2,
  Target,
  X,
  CheckCircle2,
  XCircle,
  GitMerge,
  HelpCircle,
} from "lucide-react";

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const LENS_CALENDAR = [
  { month: 'January', lens: 'Influence', color: '#cc3333' },
  { month: 'February', lens: 'Attitude', color: '#ff9933' },
  { month: 'March', lens: 'Chaordic', color: '#ffcc00' },
  { month: 'April', lens: 'Flow', color: '#cccc33' },
  { month: 'May', lens: 'Alignment', color: '#669966' },
  { month: 'June', lens: 'Energy & Needs', color: '#009999' },
  { month: 'July', lens: 'Ego', color: '#3399cc' },
  { month: 'August', lens: 'Dynamics', color: '#663399' },
  { month: 'September', lens: 'Influence', color: '#cc3333' },
  { month: 'October', lens: 'Attitude', color: '#ff9933' },
  { month: 'November', lens: 'Chaordic', color: '#ffcc00' },
  { month: 'December', lens: 'Flow', color: '#cccc33' },
];

interface GeneratorConfig {
  id: 'headlines' | 'ai-gap' | 'workplace' | 'case-study';
  title: string;
  icon: typeof Newspaper;
  color: string;
  borderColor: string;
  tooltipWhat: string;
  tooltipHow: string;
  tooltipDebug: { label: string; href: string }[];
  defaultPrompt: (lens: string, month: string) => string;
}

const GENERATORS: GeneratorConfig[] = [
  {
    id: 'headlines',
    title: 'Decode the Headlines',
    icon: Newspaper,
    color: 'text-influence',
    borderColor: 'border-influence/30',
    tooltipWhat: 'Finds a trending speech, CEO statement, or political address from current news and decodes it through the GBR (Green-Blue-Red) framework.',
    tooltipHow: 'The AI searches its knowledge for a recent, high-profile public statement, then colour-codes every sentence as Green (empathy), Blue (informing), or Red (influencing). The output is tailored to this month\'s lens from the calendar rotation.',
    tooltipDebug: [
      { label: 'Speech Lab', href: '/decode' },
      { label: 'Calendar', href: '/calendar' },
      { label: 'Thesys API', href: '/admin/integrations' },
    ],
    defaultPrompt: (lens, month) =>
      `Find a trending speech, press conference, or public statement from current ${month} 2026 news. Decode it through the GBR framework with a ${lens} lens angle. Focus on what makes this communication effective (or ineffective) and what our audience (EAs, TEAL founders, Design students) can learn from it.`,
  },
  {
    id: 'ai-gap',
    title: 'The AI Communication Gap',
    icon: Bot,
    color: 'text-ego',
    borderColor: 'border-ego/30',
    tooltipWhat: 'Creates thought-leadership content about human communication skills that AI cannot replace — tied to this month\'s lens.',
    tooltipHow: 'Positions GreenElephant at the intersection of AI and human connection. The AI generates content showing why the current month\'s lens skill matters MORE in an AI world — not less. Output: one LinkedIn article + one poll.',
    tooltipDebug: [
      { label: 'AI Policy', href: '/ai-policy' },
      { label: 'llms.txt', href: '/llms.txt' },
      { label: 'Thesys API', href: '/admin/integrations' },
    ],
    defaultPrompt: (lens, month) =>
      `Write a thought-leadership piece about why the ${lens} communication skill becomes MORE valuable in an AI-saturated world. Use specific examples from ${month} 2026 trends. Show our audience what humans can do in conversation that AI cannot — and tie it to a specific element from our Periodic Table.`,
  },
  {
    id: 'workplace',
    title: 'Workplace Conflict Decoded',
    icon: Briefcase,
    color: 'text-alignment',
    borderColor: 'border-alignment/30',
    tooltipWhat: 'Generates practical workplace scenarios with GBR decodes and conscious rewrites — for EAs, VAs, and team leads.',
    tooltipHow: 'Creates a real-world situation (deadline pushback, Slack miscommunication, feedback gone wrong), decodes the original message using Green-Blue-Red, then provides a conscious rewrite and a micro-habit. Tied to current workplace trends.',
    tooltipDebug: [
      { label: 'Decoding Hub', href: '/decode' },
      { label: 'For EAs', href: '/for-executive-assistants' },
      { label: 'Thesys API', href: '/admin/integrations' },
    ],
    defaultPrompt: (lens, month) =>
      `Create a practical workplace scenario that EAs, VAs, or team leads face in ${month} 2026. Tie it to a current workplace trend (return-to-office, async communication, AI-augmented teams, generational tension). Decode the original message through GBR, provide a conscious rewrite, and suggest a micro-habit — all through the ${lens} lens.`,
  },
  {
    id: 'case-study',
    title: 'Case Study Builder',
    icon: BookOpen,
    color: 'text-needs',
    borderColor: 'border-needs/30',
    tooltipWhat: 'Generates a full client case study from a Satellite Scan journey — before/after analysis, key breakthroughs, and testimonial-ready quotes.',
    tooltipHow: 'The AI constructs a narrative arc from a typical coaching engagement: initial communication patterns (scan results), intervention through the current lens, measurable shifts, and quotable outcomes. All names are anonymised. Output: LinkedIn case study + website copy + pull quotes.',
    tooltipDebug: [
      { label: 'Testimonials', href: '/admin/testimonials' },
      { label: 'Coaching Cockpit', href: '/admin/coaching-cockpit' },
      { label: 'Thesys API', href: '/admin/integrations' },
    ],
    defaultPrompt: (lens, month) =>
      `Build a compelling case study for a fictional (but realistic) Satellite Scan client. Industry: mid-size tech company. Role: senior EA or operations lead. Show: 1) Their communication patterns BEFORE the scan (through the ${lens} lens), 2) Key "aha moment" during the 90-minute assessment, 3) Specific changes they made over 3 months using the coaching journey, 4) Measurable results (team feedback scores, meeting efficiency, conflict reduction). Include 2-3 pull quotes. Write for ${month} 2026 LinkedIn audience. Keep all names fictional.`,
  },
];

const PROGRESS_STEPS = [
  { label: 'Loading Pipeline OS context from Notion', duration: 3000 },
  { label: 'Detecting current lens and calendar rotation', duration: 1500 },
  { label: 'Generating LinkedIn article through GBR framework', duration: 8000 },
  { label: 'Creating LinkedIn poll with engagement hooks', duration: 4000 },
  { label: 'Writing Canva art direction for Anu & Esteve', duration: 3000 },
  { label: 'Running SEO/GEO enrichment pass', duration: 4000 },
  { label: 'Formatting output for LinkedIn (plain text)', duration: 2000 },
];

const CTA_SUGGESTIONS = [
  "Book a free 15-minute communication audit call",
  "Take the free Satellite Scan quiz at greenelephant.org/signals",
  "Download our Conscious Communication Starter Guide",
  "Join our next monthly Lens Webinar — link in bio",
  "Comment below with your biggest communication challenge",
  "Share this with a colleague who needs to hear it",
  "Try the free Flow Check at greenelephant.org/flow-check",
  "DM me 'SCAN' for a personalized communication pattern analysis",
];

function ProgressOverlay({ generatorTitle }: { generatorTitle: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const e = Date.now() - startTime.current;
      setElapsed(e);
      let acc = 0;
      for (let i = 0; i < PROGRESS_STEPS.length; i++) {
        acc += PROGRESS_STEPS[i].duration;
        if (e < acc) { setCurrentStep(i); return; }
      }
      setCurrentStep(PROGRESS_STEPS.length - 1);
    }, 300);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="border-needs/30">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Loader2 className="h-5 w-5 animate-spin text-needs" />
            <span className="font-semibold font-['Poppins']">Generating: {generatorTitle}</span>
            <Badge variant="outline" className="text-xs text-muted-foreground">{Math.floor(elapsed / 1000)}s</Badge>
          </div>
          <div className="space-y-2">
            {PROGRESS_STEPS.map((step, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                  {i < currentStep ? <Check className="h-3.5 w-3.5 text-green-500" /> :
                   i === currentStep ? <Loader2 className="h-3.5 w-3.5 animate-spin text-needs" /> :
                   <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />}
                </div>
                <span className={`text-sm ${i < currentStep ? 'text-muted-foreground line-through' : i === currentStep ? 'text-foreground font-medium' : 'text-muted-foreground/50'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground pt-2 border-t border-border/30">
            This usually takes 15-30 seconds. Check <a href="/admin/integrations" className="text-needs underline">Connected Tools</a> if this fails.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface ContentResult {
  article: string;
  poll: string;
  artDirection: string;
  seo: {
    keywords: string[];
    faqItems: Array<{ question: string; answer: string }>;
    internalLinks: string[];
    targetPage: string;
  };
  lens: { name: string; hexColor: string; code: number; description: string };
  pipelineContext: string;
}

function parsePollFields(pollText: string): { question: string; options: string[]; context: string } | null {
  const questionMatch = pollText.match(/QUESTION:\s*(.+)/);
  const optionsMatches = pollText.match(/[A-D]\)\s*(.+)/g);
  const contextMatch = pollText.match(/CONTEXT:\s*([\s\S]+)/);
  if (questionMatch && optionsMatches && optionsMatches.length >= 2) {
    return {
      question: questionMatch[1].trim(),
      options: optionsMatches.map(o => o.replace(/^[A-D]\)\s*/, '').trim()),
      context: contextMatch ? contextMatch[1].trim() : '',
    };
  }
  return null;
}

function LinkedInPollPreview({ pollText, onCopy, copied }: { pollText: string; onCopy: () => void; copied: boolean }) {
  const parsed = parsePollFields(pollText);
  if (!parsed) {
    return <div className="text-sm whitespace-pre-wrap leading-relaxed" data-testid="text-poll-preview">{pollText}</div>;
  }
  return (
    <div className="space-y-4" data-testid="text-poll-preview">
      {parsed.context && (
        <div className="text-sm leading-relaxed">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Post text (above poll):</span>
          <p className="mt-1">{parsed.context}</p>
        </div>
      )}
      <div className="rounded-md bg-muted/30 p-4 space-y-3">
        <p className="font-semibold text-sm">{parsed.question}</p>
        <div className="space-y-1.5">
          {parsed.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2 rounded bg-muted/40 px-3 py-2 text-sm">
              <div className="w-4 h-4 rounded-full border border-muted-foreground/30 flex-shrink-0" />
              <span>{opt}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">LinkedIn poll preview — create manually on linkedin.com</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(`${parsed.context}\n\nPoll question: ${parsed.question}\n${parsed.options.map((o, i) => `${String.fromCharCode(65 + i)}) ${o}`).join('\n')}`); onCopy(); }} data-testid="button-copy-poll-all">
          {copied ? <Check className="h-3.5 w-3.5 mr-1.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />} Copy all
        </Button>
        <a href="https://www.linkedin.com/company/greenelephant" target="_blank" rel="noopener noreferrer">
          <Button size="sm" variant="ghost" data-testid="link-linkedin-poll"><ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Open LinkedIn</Button>
        </a>
      </div>
    </div>
  );
}

function AgentHelper() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'agent' | 'user'; text: string }[]>([
    { role: 'agent', text: "Hi! I'm your Content Flywheel assistant. I can help you with:\n\n1. Which generator to use for your goal\n2. How to write better prompts\n3. Tips on calibration settings\n4. When to use \"we\" vs \"I\" voice\n5. How the enrichment loop works\n\nWhat would you like to know?" },
  ]);
  const [input, setInput] = useState('');

  const quickReplies: Record<string, string> = {
    "Which generator should I use?": "It depends on your goal:\n\n- **Decode the Headlines** — Best when there's a trending news story you want to comment on. Great for topical engagement.\n- **AI Communication Gap** — Positions GreenElephant as thought leaders. Use this for evergreen authority content.\n- **Workplace Conflict** — Most practical for your EA/VA audience. Creates relatable scenarios they can use immediately.\n- **Case Study Builder** — Perfect after a coaching engagement ends. Builds social proof.\n\nTip: Start with Workplace Conflict for consistent engagement, then alternate with Headlines for topical relevance.",
    "How do calibration levels work?": "Calibration controls the AI's accuracy vs. creativity balance:\n\n- **Creative** — More storytelling, bigger narrative arcs, fewer citations. Good for personal stories and thought leadership.\n- **Balanced** — Default. Includes stats and references where natural, but keeps the content readable.\n- **Precise** — Maximum accuracy. Shorter, verified quotes with sources. URLs to reliable external and internal pages. Best for data-driven posts.\n\nFor LinkedIn articles, Balanced usually works best. Use Precise for case studies or when citing research.",
    "When to use we vs I?": "**\"We\" (GreenElephant voice)** — Use for the company LinkedIn page, product announcements, team achievements, and methodology explanations.\n\n**\"I\" (Personal voice)** — Use for Esteve or Anu's personal LinkedIn profiles. More authentic, gets better engagement. Share personal anecdotes, client stories, lessons learned.\n\nTip: Personal posts get 3-5x more engagement on LinkedIn than company posts. Default to \"I\" for Esteve's profile.",
    "How does the enrichment loop work?": "The enrichment loop lets you feed the AI extra context:\n\n- **PDF/Documents** — Upload a coaching report, scan results, or research paper. The AI extracts key points.\n- **Raw text/data** — Paste meeting notes, client feedback, or survey results directly.\n- **Spreadsheets** — Upload CSV data for the AI to reference (e.g., team communication scores).\n\nThe uploaded content is added as context to your prompt, making the output more specific and grounded in real data rather than generic advice.",
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    const matched = Object.entries(quickReplies).find(([q]) => userMsg.toLowerCase().includes(q.toLowerCase().slice(0, 15)));
    const reply = matched ? matched[1] : "Great question! For specific prompting help, try describing what outcome you want (e.g., \"I need a post about remote communication challenges\") and I'll suggest which generator, calibration, and voice to use.\n\nYou can also ask about:\n- Which generator to use\n- Calibration levels\n- We vs I voice\n- The enrichment loop";

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'agent', text: reply }]);
    }, 500);
  };

  if (!open) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-needs shadow-lg shadow-needs/20"
              onClick={() => setOpen(true)}
              data-testid="button-agent-helper"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Flywheel Assistant — get help with prompts, generators, and settings</TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 max-h-[480px] flex flex-col rounded-lg border border-white/10 bg-card shadow-xl">
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-needs" />
          <span className="text-sm font-semibold">Flywheel Assistant</span>
        </div>
        <Button size="icon" variant="ghost" onClick={() => setOpen(false)} data-testid="button-close-agent">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px] max-h-[320px]">
        {messages.map((m, i) => (
          <div key={i} className={`text-xs leading-relaxed whitespace-pre-wrap rounded-md p-2.5 ${m.role === 'agent' ? 'bg-muted/30' : 'bg-needs/10 ml-4'}`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="p-2 border-t border-white/10">
        <div className="flex gap-1.5 mb-2 flex-wrap">
          {Object.keys(quickReplies).slice(0, 2).map(q => (
            <button
              key={q}
              onClick={() => { setInput(q); }}
              className="text-xs px-2 py-1 rounded bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-1.5">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the flywheel..."
            className="text-xs h-8"
            data-testid="input-agent-message"
          />
          <Button type="submit" size="icon" className="h-8 w-8 shrink-0" data-testid="button-send-agent">
            <Send className="h-3 w-3" />
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ContentFlywheelLab() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const [activeGenerator, setActiveGenerator] = useState<string | null>(null);
  const [result, setResult] = useState<ContentResult | null>(null);
  const [seoOpen, setSeoOpen] = useState(false);
  const { outputFormat, setOutputFormat } = useOutputFormat("rich");
  const [sendTo, setSendTo] = useState<'both' | 'esteve' | 'anu'>('both');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [voice, setVoice] = useState<'we' | 'I'>('we');
  const [calibration, setCalibration] = useState<'low' | 'medium' | 'high'>('medium');
  const [callToAction, setCallToAction] = useState('');
  const [ctaOpen, setCtaOpen] = useState(false);
  const [enrichmentText, setEnrichmentText] = useState('');
  const [enrichmentOpen, setEnrichmentOpen] = useState(false);
  const [enrichmentFiles, setEnrichmentFiles] = useState<string[]>([]);

  const [reviewStatus, setReviewStatus] = useState<'draft' | 'approved' | 'rejected'>('draft');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const lensQuery = useQuery<{ name: string; hexColor: string; code: number; description: string }>({
    queryKey: ['/api/admin/current-lens'],
  });

  const lens = lensQuery.data;
  const currentMonth = MONTH_NAMES[new Date().getMonth()];
  const currentMonthIndex = new Date().getMonth();

  useEffect(() => {
    if (lens) {
      const defaults: Record<string, string> = {};
      for (const g of GENERATORS) {
        const saved = localStorage.getItem(`flywheel-prompt-${g.id}`);
        defaults[g.id] = saved || g.defaultPrompt(lens.name, currentMonth);
      }
      setPrompts(defaults);
    }
  }, [lens, currentMonth]);

  const updatePrompt = (id: string, value: string) => {
    setPrompts(prev => ({ ...prev, [id]: value }));
    localStorage.setItem(`flywheel-prompt-${id}`, value);
  };

  const resetPrompt = (id: string) => {
    if (!lens) return;
    const gen = GENERATORS.find(g => g.id === id);
    if (!gen) return;
    const def = gen.defaultPrompt(lens.name, currentMonth);
    setPrompts(prev => ({ ...prev, [id]: def }));
    localStorage.removeItem(`flywheel-prompt-${id}`);
  };

  const generateMutation = useMutation({
    mutationFn: async ({ generatorType, customPrompt }: { generatorType: string; customPrompt: string }) => {
      const res = await apiRequest("POST", "/api/admin/generate-content", {
        generatorType,
        customPrompt,
        voice,
        calibration,
        callToAction: callToAction.trim() || undefined,
        enrichmentText: enrichmentText.trim() || undefined,
      });
      return (await res.json()) as ContentResult;
    },
    onSuccess: (data) => {
      setResult(data);
      setReviewStatus('draft');
      toast({ title: "Content ready", description: `${data.lens.name} lens — article + poll + art direction generated. Scroll down to review.` });
    },
    onError: (err: Error) => {
      toast({ title: "Generation failed", description: err.message, variant: "destructive" });
    },
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!result) throw new Error("No content to send");
      const recipientMap: Record<string, string[]> = {
        both: ['esteve@greenelephant.org', 'anu@greenelephant.org'],
        esteve: ['esteve@greenelephant.org'],
        anu: ['anu@greenelephant.org'],
      };
      const res = await apiRequest("POST", "/api/admin/send-content-review", {
        recipients: recipientMap[sendTo],
        generatorType: activeGenerator,
        lensName: result.lens.name,
        lensColor: result.lens.hexColor,
        article: result.article,
        poll: result.poll,
        artDirection: result.artDirection,
        seoKeywords: result.seo.keywords,
        seoFaqItems: result.seo.faqItems,
        seoInternalLinks: result.seo.internalLinks,
      });
      return await res.json();
    },
    onSuccess: (data: { sent?: boolean; message?: string }) => {
      if (data.sent) {
        toast({ title: "Email sent", description: `Content review sent to ${sendTo === 'both' ? 'Esteve & Anu' : sendTo}.` });
      } else {
        toast({ title: "Delivery failed", description: data.message || "Email was not delivered — check Resend connector.", variant: "destructive" });
      }
    },
    onError: (err: Error) => {
      toast({ title: "Send failed", description: err.message, variant: "destructive" });
    },
  });

  const handleGenerate = (generatorType: string) => {
    setActiveGenerator(generatorType);
    setResult(null);
    setSeoOpen(false);
    setReviewStatus('draft');
    generateMutation.mutate({ generatorType, customPrompt: prompts[generatorType] || '' });
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const fileName = file.name;
      if (file.type.startsWith('text/') || file.name.endsWith('.csv') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const text = await file.text();
        setEnrichmentText(prev => prev + `\n\n--- ${fileName} ---\n${text.substring(0, 2000)}`);
        setEnrichmentFiles(prev => [...prev, fileName]);
      } else if (file.type === 'application/pdf') {
        setEnrichmentFiles(prev => [...prev, `${fileName} (PDF — text extraction not available, please paste key content manually)`]);
      } else if (file.type.startsWith('audio/')) {
        setEnrichmentFiles(prev => [...prev, `${fileName} (Audio — please transcribe and paste key points manually)`]);
      } else if (file.type.startsWith('image/')) {
        setEnrichmentFiles(prev => [...prev, `${fileName} (Image attached — describe key visual elements in the text box)`]);
      } else {
        setEnrichmentFiles(prev => [...prev, `${fileName} (Uploaded — paste relevant content in the text box)`]);
      }
    }
    toast({ title: "Files added", description: `${files.length} file(s) added to enrichment context.` });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const suggestCTA = () => {
    const random = CTA_SUGGESTIONS[Math.floor(Math.random() * CTA_SUGGESTIONS.length)];
    setCallToAction(random);
  };

  const activeGen = GENERATORS.find(g => g.id === activeGenerator);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-4 flex-wrap">
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" onClick={() => navigate("/admin/submissions")} data-testid="button-back-admin">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Admin
          </Button></TooltipTrigger><TooltipContent>Back to Admin Hub</TooltipContent></Tooltip>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold font-['Poppins']">Content Flywheel</h1>
              <AdminTooltip
                what="Your AI-powered content engine for LinkedIn authority building."
                how="Each button generates a LinkedIn article + poll draft, art direction for Canva, and SEO suggestions for the website. Content is emailed for human review before posting."
                debug={[
                  { label: 'Thesys API status', href: '/admin/integrations' },
                  { label: 'Email Control Room', href: '/admin/email-control-room' },
                  { label: 'Notion Pipeline', href: 'https://notion.so/6a43844676574202a5a8e30a935c9eaa' },
                ]}
              />
            </div>
            {lens && (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="outline" className="text-xs" style={{ borderColor: lens.hexColor + '66', color: lens.hexColor }}>
                  {currentMonth} Lens: {lens.name}
                </Badge>
                <span className="text-xs text-muted-foreground">{lens.description}</span>
                <AdminTooltip
                  what={`This month's lens is ${lens.name} (code ${lens.code}). All generated content will be angled through this lens.`}
                  how="The lens rotates monthly following the calendar: Jan=Influence, Feb=Attitude, Mar=Chaordic, Apr=Flow, May=Alignment, Jun=Needs, Jul=Ego, Aug=Dynamics, then repeats."
                  debug={[{ label: 'Calendar page', href: '/calendar' }]}
                  side="bottom"
                />
              </div>
            )}
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <button onClick={() => setCalendarOpen(!calendarOpen)} className="flex items-center gap-2 w-full text-left" data-testid="button-toggle-calendar">
              {calendarOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <BarChart3 className="h-4 w-4 text-needs" />
              <CardTitle className="text-base">Lens Calendar — Source of Truth</CardTitle>
              <AdminTooltip what="The 8-month rotating lens calendar. This is the single source of truth for which lens is active each month." how="All generated content is automatically angled through the active month's lens. The cycle repeats after 8 months." />
            </button>
          </CardHeader>
          {calendarOpen && (
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
                {LENS_CALENDAR.map((item, i) => (
                  <div
                    key={i}
                    className={`rounded-md p-2 text-center transition-all ${i === currentMonthIndex ? 'ring-2 ring-white/30 scale-105' : ''}`}
                    style={{ backgroundColor: item.color + '18', borderLeft: `3px solid ${item.color}` }}
                    data-testid={`calendar-month-${i}`}
                  >
                    <div className="text-xs text-muted-foreground">{item.month.slice(0, 3)}</div>
                    <div className="text-xs font-semibold mt-0.5" style={{ color: item.color }}>{item.lens}</div>
                    {i === currentMonthIndex && <Badge className="mt-1 text-xs px-1 py-0" style={{ backgroundColor: item.color + '33', color: item.color }}>NOW</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-needs" />
              Generation Controls
              <AdminTooltip
                what="Configure voice, accuracy, CTA, and enrichment before generating content."
                how="Voice: 'We' for company page, 'I' for personal LinkedIn. Calibration: Creative/Balanced/Precise. CTA: auto-suggested or custom. Enrichment: upload documents to ground the AI in real data."
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1.5">
                  {voice === 'we' ? <Users className="h-3.5 w-3.5 text-needs" /> : <User className="h-3.5 w-3.5 text-influence" />}
                  Voice
                  <AdminTooltip what="'We' = GreenElephant company voice. 'I' = personal voice (Esteve or Anu)." how="Personal posts get 3-5x more LinkedIn engagement. Use 'I' for personal profiles, 'We' for company page." />
                </Label>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium ${voice === 'we' ? 'text-needs' : 'text-muted-foreground'}`}>We</span>
                  <Switch
                    checked={voice === 'I'}
                    onCheckedChange={(checked) => setVoice(checked ? 'I' : 'we')}
                    data-testid="switch-voice"
                  />
                  <span className={`text-xs font-medium ${voice === 'I' ? 'text-influence' : 'text-muted-foreground'}`}>I</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-needs" />
                  Calibration
                  <AdminTooltip what="Controls accuracy vs. creativity balance of AI output." how="Creative: more storytelling. Balanced: default, good mix. Precise: exact quotes, sources, URLs. Use Precise for case studies." />
                </Label>
                <Select value={calibration} onValueChange={(v) => setCalibration(v as 'low' | 'medium' | 'high')}>
                  <SelectTrigger className="h-9 text-xs" data-testid="select-calibration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Creative — storytelling first</SelectItem>
                    <SelectItem value="medium">Balanced — stats + readability</SelectItem>
                    <SelectItem value="high">Precise — quotes, sources, URLs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1.5">
                  <Link2 className="h-3.5 w-3.5 text-needs" />
                  Call to Action
                  <AdminTooltip what="Forces a specific CTA at the end of the article and poll." how="Click 'Suggest' for auto-generated CTAs. Edit to customise. Leave empty for AI to choose its own." />
                </Label>
                <div className="flex gap-1.5">
                  <Input
                    value={callToAction}
                    onChange={(e) => setCallToAction(e.target.value)}
                    placeholder="e.g., Book a free call..."
                    className="text-xs h-9"
                    data-testid="input-cta"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="outline" onClick={suggestCTA} className="shrink-0" data-testid="button-suggest-cta">
                        <Sparkles className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Auto-suggest a CTA</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

            <div>
              <button onClick={() => setEnrichmentOpen(!enrichmentOpen)} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors" data-testid="button-toggle-enrichment">
                {enrichmentOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                <Upload className="h-3.5 w-3.5" />
                Enrichment Loop — add context from documents, data, or notes
              </button>
              {enrichmentOpen && (
                <div className="mt-3 space-y-3 pl-5">
                  <div className="flex gap-2 flex-wrap">
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      multiple
                      accept=".pdf,.txt,.csv,.md,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.mp3,.wav,.m4a"
                      onChange={handleFileUpload}
                    />
                    <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} data-testid="button-upload-files">
                      <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload Files
                    </Button>
                    <span className="text-xs text-muted-foreground self-center">PDF, CSV, TXT, images, audio, spreadsheets</span>
                  </div>
                  {enrichmentFiles.length > 0 && (
                    <div className="space-y-1">
                      {enrichmentFiles.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <FileText className="h-3 w-3" />
                          <span>{f}</span>
                          <button onClick={() => { setEnrichmentFiles(prev => prev.filter((_, j) => j !== i)); }} className="text-destructive/60 hover:text-destructive">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Textarea
                    value={enrichmentText}
                    onChange={(e) => setEnrichmentText(e.target.value)}
                    placeholder="Paste raw data, meeting notes, client feedback, CV content, or any additional context here..."
                    className="text-xs min-h-[80px] resize-y"
                    data-testid="textarea-enrichment"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <AIContextSelector compact />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {GENERATORS.map(gen => {
            const Icon = gen.icon;
            const isActive = activeGenerator === gen.id;
            const isLoading = generateMutation.isPending && isActive;

            return (
              <Card key={gen.id} className={`transition-all ${isActive ? 'ring-1 ring-white/20' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${gen.color}`} />
                      <CardTitle className="text-sm">{gen.title}</CardTitle>
                    </div>
                    <AdminTooltip what={gen.tooltipWhat} how={gen.tooltipHow} debug={gen.tooltipDebug} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="relative">
                    <Textarea
                      value={prompts[gen.id] || ''}
                      onChange={(e) => updatePrompt(gen.id, e.target.value)}
                      className="text-xs min-h-[100px] resize-y"
                      placeholder="Customise your prompt..."
                      data-testid={`textarea-prompt-${gen.id}`}
                    />
                    <button
                      onClick={() => resetPrompt(gen.id)}
                      className="absolute top-2 right-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      data-testid={`button-reset-${gen.id}`}
                    >
                      Reset
                    </button>
                  </div>
                  <Button
                    onClick={() => handleGenerate(gen.id)}
                    disabled={generateMutation.isPending}
                    className="w-full"
                    data-testid={`button-generate-${gen.id}`}
                  >
                    {isLoading ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                    ) : (
                      <><Zap className="h-4 w-4 mr-2" /> Generate</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {generateMutation.isPending && activeGen && (
          <ProgressOverlay generatorTitle={activeGen.title} />
        )}

        {result && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 flex-wrap">
              <GitMerge className="h-5 w-5 text-needs" />
              <h2 className="text-xl font-semibold font-['Poppins']">Review & Accept</h2>
              <Badge style={{ backgroundColor: result.lens.hexColor + '22', color: result.lens.hexColor, borderColor: result.lens.hexColor + '44' }}>
                {result.lens.name} Lens
              </Badge>
              {result.pipelineContext === 'loaded' && (
                <Badge variant="outline" className="text-xs text-needs border-needs/30">Pipeline OS context loaded</Badge>
              )}
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                {reviewStatus === 'draft' && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-500 border-green-500/30"
                          onClick={() => { setReviewStatus('approved'); toast({ title: "Approved", description: "Content marked as approved. Send it for review or copy to publish." }); }}
                          data-testid="button-approve-content"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Approve
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Mark this content as approved for publishing</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive border-destructive/30"
                          onClick={() => { setReviewStatus('rejected'); toast({ title: "Rejected", description: "Content rejected. Adjust your prompt and regenerate." }); }}
                          data-testid="button-reject-content"
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1.5" /> Request Changes
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Reject and regenerate with different settings</TooltipContent>
                    </Tooltip>
                  </>
                )}
                {reviewStatus === 'approved' && (
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Approved</Badge>
                )}
                {reviewStatus === 'rejected' && (
                  <Badge className="bg-destructive/20 text-destructive border-destructive/30">Changes Requested</Badge>
                )}
              </div>
              <AdminTooltip
                what="GitHub-inspired review flow: Review the generated content, then Approve or Request Changes before sending."
                how="Approve marks the content as ready to publish. Request Changes flags it for regeneration. Either way, you can still edit prompts and regenerate."
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-muted-foreground">Output format:</span>
              <OutputFormatToggle value={outputFormat} onChange={setOutputFormat} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className={reviewStatus === 'approved' ? 'border-green-500/20' : reviewStatus === 'rejected' ? 'border-destructive/20' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-influence" />
                      <CardTitle className="text-base">LinkedIn Article</CardTitle>
                      <Badge variant="outline" className="text-xs">{voice === 'I' ? 'Personal voice' : 'Company voice'}</Badge>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => copyToClipboard(result.article, 'article')} data-testid="button-copy-article">
                      {copiedField === 'article' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">For {voice === 'I' ? "Esteve or Anu's personal" : "GreenElephant company"} LinkedIn profile</p>
                </CardHeader>
                <CardContent>
                  <div className={`text-sm whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto pr-2 ${outputFormat === 'machine' ? 'font-mono text-xs bg-muted/30 rounded-md p-3' : ''}`} data-testid="text-article-preview">
                    {formatContent(result.article, outputFormat, outputFormat === 'machine' ? { type: 'linkedin_article', content: result.article, lens: result.lens.name, voice, generatedAt: new Date().toISOString() } : undefined)}
                  </div>
                </CardContent>
              </Card>

              <Card className={reviewStatus === 'approved' ? 'border-green-500/20' : reviewStatus === 'rejected' ? 'border-destructive/20' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-needs" />
                      <CardTitle className="text-base">LinkedIn Poll</CardTitle>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">For GreenElephant company page</p>
                </CardHeader>
                <CardContent>
                  <LinkedInPollPreview pollText={result.poll} onCopy={() => setCopiedField('poll')} copied={copiedField === 'poll'} />
                </CardContent>
              </Card>
            </div>

            <Card className={reviewStatus === 'approved' ? 'border-green-500/20' : reviewStatus === 'rejected' ? 'border-destructive/20' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-dynamics" />
                    <CardTitle className="text-base">Art Direction for Canva</CardTitle>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => copyToClipboard(result.artDirection, 'art')} data-testid="button-copy-art">
                    {copiedField === 'art' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-sm whitespace-pre-wrap leading-relaxed ${outputFormat === 'machine' ? 'font-mono text-xs bg-muted/30 rounded-md p-3' : ''}`} data-testid="text-art-preview">
                  {formatContent(result.artDirection, outputFormat, outputFormat === 'machine' ? { type: 'art_direction', content: result.artDirection, lens: result.lens.name, generatedAt: new Date().toISOString() } : undefined)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <button onClick={() => setSeoOpen(!seoOpen)} className="flex items-center gap-2 w-full text-left" data-testid="button-toggle-seo">
                  {seoOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <Search className="h-4 w-4 text-alignment" />
                  <CardTitle className="text-base">SEO/GEO Enrichment</CardTitle>
                  <Badge variant="outline" className="text-xs ml-2">{result.seo.keywords.length} keywords</Badge>
                  <Badge variant="outline" className="text-xs text-green-500 border-green-500/30 ml-1">Auto-applied</Badge>
                  <AdminTooltip
                    what="SEO/GEO suggestions are automatically generated with every piece of content — even drafts. Keywords, FAQ schema, and internal links are always included."
                    how="When content is published to the website, these SEO elements are embedded by default. The backlink is also auto-added to Admin > Backlinks Tracker."
                  />
                </button>
              </CardHeader>
              {seoOpen && (
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">Suggested Keywords <AdminTooltip what="Long-tail keywords for the target page's meta tags." /></h4>
                    <div className="flex flex-wrap gap-1.5">
                      {result.seo.keywords.map((kw, i) => (
                        <Badge key={i} variant="secondary" className="text-xs" data-testid={`badge-keyword-${i}`}>{kw}</Badge>
                      ))}
                    </div>
                  </div>
                  {result.seo.faqItems.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">FAQ Structured Data</h4>
                      <div className="space-y-3">
                        {result.seo.faqItems.map((faq, i) => (
                          <div key={i} className="rounded-md bg-muted/30 p-3" data-testid={`text-faq-${i}`}>
                            <p className="text-sm font-medium">{faq.question}</p>
                            <p className="text-xs text-muted-foreground mt-1">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.seo.internalLinks.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">Internal Linking + Auto-Backlinks <AdminTooltip what="When published, these links are auto-added to Admin > Backlinks Tracker for SEO tracking." /></h4>
                      <ul className="space-y-1">
                        {result.seo.internalLinks.map((link, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5" data-testid={`text-internal-link-${i}`}>
                            <Link2 className="h-3 w-3 text-needs" />{link}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border/30">
                    Target page: <code className="text-needs">{result.seo.targetPage}</code>
                  </div>
                </CardContent>
              )}
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Send to:</span>
                    <AdminTooltip what="Choose who receives the review email with the full content package." how="The email includes the article, poll, art direction, and SEO summary. Recipients review and approve before anything goes live." />
                  </div>
                  <div className="flex gap-1.5">
                    {(['both', 'esteve', 'anu'] as const).map(opt => (
                      <Button
                        key={opt}
                        variant={sendTo === opt ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSendTo(opt)}
                        className="toggle-elevate"
                        data-testid={`button-sendto-${opt}`}
                      >
                        {opt === 'both' ? 'Both' : opt === 'esteve' ? 'Esteve' : 'Anu'}
                      </Button>
                    ))}
                  </div>
                  <div className="flex-1" />
                  <Button
                    onClick={() => sendMutation.mutate()}
                    disabled={sendMutation.isPending}
                    data-testid="button-send-review"
                  >
                    {sendMutation.isPending ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="h-4 w-4 mr-2" /> Send for Review</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <AgentHelper />
    </div>
  );
}
