import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AdminTooltip } from "@/components/AdminTooltip";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Loader2,
  Zap,
  Download,
  Target,
  Users,
  FileSpreadsheet,
  Check,
  Copy,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Mail,
  Search,
} from "lucide-react";

type TabId = "pmf" | "leads" | "gmail";

const LINKEDIN_FREE_FILTERS = [
  { key: "location", label: "Location", placeholder: "e.g. Netherlands, Finland, DACH region" },
  { key: "industry", label: "Industry", placeholder: "e.g. Professional Training & Coaching" },
  { key: "companySize", label: "Company Size", placeholder: "e.g. 11-50, 51-200" },
  { key: "jobTitle", label: "Job Title", placeholder: "e.g. Executive Assistant, Chief of Staff" },
  { key: "school", label: "School", placeholder: "e.g. Aalto University, TU Delft" },
];

const SALES_NAV_FILTERS = [
  { key: "seniorityLevel", label: "Seniority Level", placeholder: "e.g. Director, VP, C-Suite" },
  { key: "yearsInPosition", label: "Years in Position", placeholder: "e.g. 1-3 years" },
  { key: "function", label: "Function", placeholder: "e.g. Operations, Human Resources" },
  { key: "companyHeadcount", label: "Company Headcount", placeholder: "e.g. 51-200" },
  { key: "revenue", label: "Revenue", placeholder: "e.g. $1M-$10M" },
];

interface PMFAssumption {
  id: string;
  hypothesis: string;
  targetSegment: string;
  painPoint: string;
  linkedinFilters: Record<string, string>;
  confidence: string;
  testMethod: string;
  createdAt: string;
}

interface PMFResult {
  assumptions: PMFAssumption[];
  pmfIndicators: {
    painsWorthSolving: string[];
    tensionsUnresolved: string[];
    trends: string[];
  };
}

interface Lead {
  name: string;
  title: string;
  company: string;
  linkedinProfile: string;
  email: string;
  source: string;
  fitScore: string;
}

interface LeadResult {
  leads: Lead[];
  dataSources: string[];
  refinementTips: string[];
}

interface EmailThread {
  threadId: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  snippet: string;
  messages: Array<{
    id: string;
    from: string;
    to: string;
    date: string;
    subject: string;
    body: string;
  }>;
}

const PMF_PROGRESS_STEPS = [
  { label: "Loading GreenElephant context", duration: 2000 },
  { label: "Analysing LinkedIn targeting categories", duration: 3000 },
  { label: "Generating PMF hypotheses via Thesys", duration: 8000 },
  { label: "Mapping assumptions to LinkedIn filters", duration: 3000 },
  { label: "Identifying PMF indicators and trends", duration: 3000 },
  { label: "Formatting assumption cards", duration: 1500 },
];

const LEAD_PROGRESS_STEPS = [
  { label: "Processing calibration inputs", duration: 2000 },
  { label: "Matching LinkedIn targeting criteria", duration: 3000 },
  { label: "Generating sample lead profiles", duration: 8000 },
  { label: "Recommending data sources", duration: 3000 },
  { label: "Scoring lead-fit alignment", duration: 2000 },
];

function ProgressOverlay({ steps, title }: { steps: Array<{ label: string; duration: number }>; title: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const e = Date.now() - startTime.current;
      setElapsed(e);
      let acc = 0;
      for (let i = 0; i < steps.length; i++) {
        acc += steps[i].duration;
        if (e < acc) { setCurrentStep(i); return; }
      }
      setCurrentStep(steps.length - 1);
    }, 300);
    return () => clearInterval(timer);
  }, [steps]);

  return (
    <Card className="border-attitude/30">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Loader2 className="h-5 w-5 animate-spin text-attitude" />
            <span className="font-semibold font-['Poppins']">{title}</span>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {Math.floor(elapsed / 1000)}s
            </Badge>
          </div>
          <div className="space-y-2">
            {steps.map((step, i) => {
              const isActive = i === currentStep;
              const isDone = i < currentStep;
              return (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                    {isDone ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : isActive ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-attitude" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                    )}
                  </div>
                  <span className={`text-sm ${isDone ? 'text-muted-foreground line-through' : isActive ? 'text-foreground font-medium' : 'text-muted-foreground/50'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground pt-2 border-t border-border/30">
            This usually takes 15-30 seconds. Powered by Thesys.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function downloadXLS(data: Record<string, string>[], filename: string) {
  const headers = Object.keys(data[0] || {});
  const rows = data.map(row => headers.map(h => `"${(row[h] || '').replace(/"/g, '""')}"`).join('\t'));
  const content = [headers.join('\t'), ...rows].join('\n');
  const blob = new Blob([content], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ResearchFlywheelLab() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>("pmf");

  const [linkedinFilters, setLinkedinFilters] = useState<Record<string, string>>({});
  const [salesNavFilters, setSalesNavFilters] = useState<Record<string, string>>({});
  const [pmfContext, setPmfContext] = useState("");
  const [pmfResult, setPmfResult] = useState<PMFResult | null>(null);
  const [savedAssumptions, setSavedAssumptions] = useState<PMFAssumption[]>(() => {
    try {
      const saved = localStorage.getItem('research-flywheel-assumptions');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [calibration, setCalibration] = useState({ why: '', what: '', how: '' });
  const [leadFilters, setLeadFilters] = useState<Record<string, string>>({});
  const [leadResult, setLeadResult] = useState<LeadResult | null>(null);

  const [gmailQuery, setGmailQuery] = useState("from:esteve@greenelephant.org OR to:esteve@greenelephant.org");
  const [gmailThreads, setGmailThreads] = useState<EmailThread[]>([]);
  const [expandedThread, setExpandedThread] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [syncingThreads, setSyncingThreads] = useState<Set<string>>(new Set());

  const lensQuery = useQuery<{ name: string; hexColor: string; code: number; description: string }>({
    queryKey: ['/api/admin/current-lens'],
  });
  const lens = lensQuery.data;

  useEffect(() => {
    localStorage.setItem('research-flywheel-assumptions', JSON.stringify(savedAssumptions));
  }, [savedAssumptions]);

  const pmfMutation = useMutation({
    mutationFn: async () => {
      const allFilters = { ...linkedinFilters, ...salesNavFilters };
      const res = await apiRequest("POST", "/api/admin/research/pmf-assumptions", {
        targetingCategories: allFilters,
        customContext: pmfContext,
      });
      return (await res.json()) as PMFResult;
    },
    onSuccess: (data) => {
      setPmfResult(data);
      toast({ title: "PMF assumptions generated", description: `${data.assumptions.length} hypotheses created with PMF indicators.` });
    },
    onError: (err: any) => {
      toast({ title: "Generation failed", description: err.message, variant: "destructive" });
    },
  });

  const leadMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/research/lead-list", {
        calibration,
        filters: leadFilters,
      });
      return (await res.json()) as LeadResult;
    },
    onSuccess: (data) => {
      setLeadResult(data);
      toast({ title: "Lead list generated", description: `${data.leads.length} sample leads with ${data.dataSources.length} data sources.` });
    },
    onError: (err: any) => {
      toast({ title: "Generation failed", description: err.message, variant: "destructive" });
    },
  });

  const gmailMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/research/gmail-harvest", {
        query: gmailQuery,
        maxResults: 15,
      });
      return (await res.json()) as { threads: EmailThread[] };
    },
    onSuccess: (data) => {
      setGmailThreads(data.threads || []);
      toast({ title: "Email chains harvested", description: `${data.threads?.length || 0} threads found.` });
    },
    onError: (err: any) => {
      toast({ title: "Gmail harvest failed", description: err.message, variant: "destructive" });
    },
  });

  const gmailNotionSyncMutation = useMutation({
    mutationFn: async (threads: EmailThread[]) => {
      const res = await apiRequest("POST", "/api/admin/research/gmail-sync-notion", { threads });
      return await res.json();
    },
    onSuccess: (data: any) => {
      toast({ title: "Synced to Notion", description: data.message || "Email threads saved to Notion." });
    },
    onError: (err: any) => {
      toast({ title: "Notion sync failed", description: err.message, variant: "destructive" });
    },
  });

  const sheetsExportMutation = useMutation({
    mutationFn: async (leads: Lead[]) => {
      const res = await apiRequest("POST", "/api/admin/research/export-sheets", { leads });
      return await res.json();
    },
    onSuccess: (data: any) => {
      toast({ title: "Exported to Google Sheets", description: data.message || "Lead list saved to Google Sheets." });
    },
    onError: (err: any) => {
      toast({ title: "Export failed", description: err.message, variant: "destructive" });
    },
  });

  const notionSyncMutation = useMutation({
    mutationFn: async (assumptions: PMFAssumption[]) => {
      const res = await apiRequest("POST", "/api/admin/research/sync-notion", { assumptions });
      return await res.json();
    },
    onSuccess: (data: any) => {
      toast({ title: "Synced to Notion", description: data.message || "Assumptions saved to Notion." });
    },
    onError: (err: any) => {
      toast({ title: "Sync failed", description: err.message, variant: "destructive" });
    },
  });

  const saveAssumption = (assumption: PMFAssumption) => {
    const stamped = { ...assumption, createdAt: new Date().toISOString() };
    setSavedAssumptions(prev => [...prev, stamped]);
    toast({ title: "Assumption saved", description: `${assumption.id} added to your saved list.` });
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const tabs: Array<{ id: TabId; label: string; icon: typeof Target }> = [
    { id: "pmf", label: "PMF Assumptions", icon: Target },
    { id: "leads", label: "Lead List Generator", icon: Users },
    { id: "gmail", label: "Gmail Harvester", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-4 flex-wrap">
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" onClick={() => navigate("/admin/submissions")} data-testid="button-back-admin">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Admin
          </Button></TooltipTrigger><TooltipContent>Back to Admin Hub</TooltipContent></Tooltip>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold font-['Poppins']" data-testid="text-page-title">Research Flywheel</h1>
              <AdminTooltip
                what="Your AI-powered research engine for PMF testing and qualified lead generation."
                how="Generate PMF hypotheses mapped to LinkedIn targeting filters, build lead lists from calibration questions, and harvest Gmail chains for CRM enrichment. All AI powered by Thesys."
                debug={[
                  { label: 'Thesys API status', href: '/admin/integrations' },
                  { label: 'Content Flywheel', href: '/admin/content-lab' },
                  { label: 'Google Sheets', href: '/admin/integrations' },
                ]}
              />
            </div>
            {lens && (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="outline" className="text-xs" style={{ borderColor: lens.hexColor + '66', color: lens.hexColor }}>
                  Current Lens: {lens.name}
                </Badge>
                <span className="text-xs text-muted-foreground">{lens.description}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                data-testid={`button-tab-${tab.id}`}
              >
                <Icon className="h-4 w-4 mr-1.5" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {activeTab === "pmf" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-attitude" />
                  <CardTitle className="text-lg">PMF Assumption Generator</CardTitle>
                  <AdminTooltip
                    what="Generates Product-Market Fit hypotheses using LinkedIn targeting categories."
                    how="Select LinkedIn free-plan and Sales Navigator filters, add context about your target market, and the AI formulates testable PMF assumptions. Export as XLS for LinkedHelper campaigns."
                    debug={[{ label: 'Thesys API', href: '/admin/integrations' }]}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">LinkedIn Free Plan Filters</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {LINKEDIN_FREE_FILTERS.map(f => (
                      <div key={f.key}>
                        <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                        <Input
                          value={linkedinFilters[f.key] || ''}
                          onChange={(e) => setLinkedinFilters(prev => ({ ...prev, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          data-testid={`input-li-${f.key}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">Sales Navigator Filters (optional)</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {SALES_NAV_FILTERS.map(f => (
                      <div key={f.key}>
                        <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                        <Input
                          value={salesNavFilters[f.key] || ''}
                          onChange={(e) => setSalesNavFilters(prev => ({ ...prev, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          data-testid={`input-sn-${f.key}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Additional Context</label>
                  <Textarea
                    value={pmfContext}
                    onChange={(e) => setPmfContext(e.target.value)}
                    placeholder="Describe your target market hypothesis, specific pain points you're testing, or market trends you've observed..."
                    className="min-h-[80px]"
                    data-testid="textarea-pmf-context"
                  />
                </div>

                <Button
                  onClick={() => pmfMutation.mutate()}
                  disabled={pmfMutation.isPending}
                  className="w-full"
                  data-testid="button-generate-pmf"
                >
                  {pmfMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating PMF Assumptions...</>
                  ) : (
                    <><Zap className="h-4 w-4 mr-2" /> Generate PMF Assumptions</>
                  )}
                </Button>
              </CardContent>
            </Card>

            {pmfMutation.isPending && (
              <ProgressOverlay steps={PMF_PROGRESS_STEPS} title="Generating PMF Assumptions" />
            )}

            {pmfResult && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h2 className="text-lg font-semibold font-['Poppins']">Generated Assumptions</h2>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const xlsData = pmfResult.assumptions.map(a => ({
                          ID: a.id,
                          Hypothesis: a.hypothesis,
                          'Target Segment': a.targetSegment,
                          'Pain Point': a.painPoint,
                          Confidence: a.confidence,
                          'Test Method': a.testMethod,
                          ...a.linkedinFilters,
                        }));
                        downloadXLS(xlsData, `pmf-assumptions-${new Date().toISOString().split('T')[0]}.xls`);
                      }}
                      data-testid="button-export-pmf-xls"
                    >
                      <Download className="h-3.5 w-3.5 mr-1.5" /> Export XLS
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => notionSyncMutation.mutate(pmfResult.assumptions.map(a => ({ ...a, createdAt: new Date().toISOString() })))}
                      disabled={notionSyncMutation.isPending}
                      data-testid="button-sync-notion"
                    >
                      {notionSyncMutation.isPending ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />}
                      Sync to Notion
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {pmfResult.assumptions.map((assumption, idx) => (
                    <Card key={idx}>
                      <CardContent className="pt-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <Badge variant="outline" className="text-xs">{assumption.id}</Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              assumption.confidence === 'High' ? 'text-green-500 border-green-500/30' :
                              assumption.confidence === 'Medium' ? 'text-amber-500 border-amber-500/30' :
                              'text-red-400 border-red-400/30'
                            }`}
                          >
                            {assumption.confidence}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium">{assumption.hypothesis}</p>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground"><span className="font-medium">Segment:</span> {assumption.targetSegment}</p>
                          <p className="text-xs text-muted-foreground"><span className="font-medium">Pain:</span> {assumption.painPoint}</p>
                          <p className="text-xs text-muted-foreground"><span className="font-medium">Test:</span> {assumption.testMethod}</p>
                        </div>
                        {Object.keys(assumption.linkedinFilters).length > 0 && (
                          <div className="flex gap-1.5 flex-wrap">
                            {Object.entries(assumption.linkedinFilters).map(([k, v]) => (
                              <Badge key={k} variant="secondary" className="text-xs">{k}: {v}</Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => saveAssumption(assumption)}
                            data-testid={`button-save-assumption-${idx}`}
                          >
                            <Check className="h-3.5 w-3.5 mr-1" /> Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(assumption.hypothesis, `hyp-${idx}`)}
                            data-testid={`button-copy-assumption-${idx}`}
                          >
                            {copiedField === `hyp-${idx}` ? <Check className="h-3.5 w-3.5 mr-1 text-green-500" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                            Copy
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {pmfResult.pmfIndicators && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-attitude" />
                        <CardTitle className="text-base">PMF Indicators</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                            <h4 className="text-sm font-medium">Pains Worth Solving</h4>
                          </div>
                          <ul className="space-y-1">
                            {pmfResult.pmfIndicators.painsWorthSolving.map((p, i) => (
                              <li key={i} className="text-xs text-muted-foreground">- {p}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5">
                            <Lightbulb className="h-4 w-4 text-amber-400" />
                            <h4 className="text-sm font-medium">Tensions Unresolved</h4>
                          </div>
                          <ul className="space-y-1">
                            {pmfResult.pmfIndicators.tensionsUnresolved.map((t, i) => (
                              <li key={i} className="text-xs text-muted-foreground">- {t}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <h4 className="text-sm font-medium">Market Trends</h4>
                          </div>
                          <ul className="space-y-1">
                            {pmfResult.pmfIndicators.trends.map((t, i) => (
                              <li key={i} className="text-xs text-muted-foreground">- {t}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {savedAssumptions.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <CardTitle className="text-base">Saved Assumptions ({savedAssumptions.length})</CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const xlsData = savedAssumptions.map(a => ({
                            ID: a.id,
                            Hypothesis: a.hypothesis,
                            'Target Segment': a.targetSegment,
                            'Pain Point': a.painPoint,
                            Confidence: a.confidence,
                            'Test Method': a.testMethod,
                            'Created At': a.createdAt,
                          }));
                          downloadXLS(xlsData, `saved-assumptions-${new Date().toISOString().split('T')[0]}.xls`);
                        }}
                        data-testid="button-export-saved-xls"
                      >
                        <Download className="h-3.5 w-3.5 mr-1.5" /> Export Saved XLS
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setSavedAssumptions([]); toast({ title: "Cleared", description: "Saved assumptions cleared." }); }}
                        data-testid="button-clear-saved"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {savedAssumptions.map((a, i) => (
                      <div key={i} className="flex items-center justify-between gap-3 text-sm py-2 border-b border-border/30 last:border-0">
                        <div className="flex-1 min-w-0">
                          <span className="font-medium">{a.id}</span>
                          <span className="text-muted-foreground ml-2">{a.hypothesis}</span>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {new Date(a.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "leads" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-attitude" />
                  <CardTitle className="text-lg">Lead List Generator</CardTitle>
                  <AdminTooltip
                    what="Generates qualified lead lists using calibration questions and LinkedIn targeting."
                    how="Answer why/what/how calibration questions, set LinkedIn filters, and the AI generates sample leads with contact data. Export to Google Sheets or download as XLS."
                    debug={[
                      { label: 'Google Sheets', href: '/admin/integrations' },
                      { label: 'Thesys API', href: '/admin/integrations' },
                    ]}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Calibration Questions</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">WHY — Purpose of this outreach</label>
                      <Textarea
                        value={calibration.why}
                        onChange={(e) => setCalibration(prev => ({ ...prev, why: e.target.value }))}
                        placeholder="e.g. We want to reach Executive Assistants who manage C-suite calendars and could benefit from conscious communication training to handle conflicts..."
                        className="min-h-[60px]"
                        data-testid="textarea-cal-why"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">WHAT — What you're offering</label>
                      <Textarea
                        value={calibration.what}
                        onChange={(e) => setCalibration(prev => ({ ...prev, what: e.target.value }))}
                        placeholder="e.g. Satellite Scan communication profiling + 3-month coaching journey with the Periodic Table framework..."
                        className="min-h-[60px]"
                        data-testid="textarea-cal-what"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">HOW — Outreach method</label>
                      <Select value={calibration.how || 'linkedin'} onValueChange={(v) => setCalibration(prev => ({ ...prev, how: v }))}>
                        <SelectTrigger data-testid="select-cal-how">
                          <SelectValue placeholder="Select outreach method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="linkedin">LinkedIn (LinkedHelper)</SelectItem>
                          <SelectItem value="email">Email Campaign</SelectItem>
                          <SelectItem value="phone">Phone Outreach</SelectItem>
                          <SelectItem value="multi">Multi-channel (LinkedIn + Email + Phone)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">LinkedIn Targeting Filters</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {[...LINKEDIN_FREE_FILTERS, ...SALES_NAV_FILTERS].map(f => (
                      <div key={f.key}>
                        <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                        <Input
                          value={leadFilters[f.key] || ''}
                          onChange={(e) => setLeadFilters(prev => ({ ...prev, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          data-testid={`input-lead-${f.key}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => leadMutation.mutate()}
                  disabled={leadMutation.isPending}
                  className="w-full"
                  data-testid="button-generate-leads"
                >
                  {leadMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating Lead List...</>
                  ) : (
                    <><Zap className="h-4 w-4 mr-2" /> Generate Lead List</>
                  )}
                </Button>
              </CardContent>
            </Card>

            {leadMutation.isPending && (
              <ProgressOverlay steps={LEAD_PROGRESS_STEPS} title="Generating Lead List" />
            )}

            {leadResult && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h2 className="text-lg font-semibold font-['Poppins']">Lead List ({leadResult.leads.length} contacts)</h2>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const xlsData = leadResult.leads.map(l => ({
                          Name: l.name,
                          Title: l.title,
                          Company: l.company,
                          Email: l.email,
                          'LinkedIn Profile': l.linkedinProfile,
                          Source: l.source,
                          'Fit Score': l.fitScore,
                        }));
                        downloadXLS(xlsData, `lead-list-${new Date().toISOString().split('T')[0]}.xls`);
                      }}
                      data-testid="button-export-leads-xls"
                    >
                      <Download className="h-3.5 w-3.5 mr-1.5" /> XLS Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sheetsExportMutation.mutate(leadResult.leads)}
                      disabled={sheetsExportMutation.isPending}
                      data-testid="button-export-sheets"
                    >
                      {sheetsExportMutation.isPending ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />}
                      Google Sheets
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="pt-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/50">
                            <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Name</th>
                            <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Title</th>
                            <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Company</th>
                            <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Email</th>
                            <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Source</th>
                            <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Fit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leadResult.leads.map((lead, i) => (
                            <tr key={i} className="border-b border-border/20 last:border-0">
                              <td className="py-2 px-2">
                                {lead.linkedinProfile && lead.linkedinProfile !== 'https://linkedin.com/in/example' ? (
                                  <a href={lead.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-attitude underline">{lead.name}</a>
                                ) : (
                                  lead.name
                                )}
                              </td>
                              <td className="py-2 px-2 text-muted-foreground">{lead.title}</td>
                              <td className="py-2 px-2 text-muted-foreground">{lead.company}</td>
                              <td className="py-2 px-2 text-muted-foreground text-xs">{lead.email}</td>
                              <td className="py-2 px-2"><Badge variant="secondary" className="text-xs">{lead.source}</Badge></td>
                              <td className="py-2 px-2">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    lead.fitScore === 'High' ? 'text-green-500 border-green-500/30' :
                                    lead.fitScore === 'Medium' ? 'text-amber-500 border-amber-500/30' :
                                    'text-muted-foreground'
                                  }`}
                                >
                                  {lead.fitScore}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {leadResult.dataSources.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recommended Data Sources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {leadResult.dataSources.map((s, i) => (
                          <li key={i} className="text-sm text-muted-foreground">- {s}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {leadResult.refinementTips.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Refinement Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {leadResult.refinementTips.map((t, i) => (
                          <li key={i} className="text-sm text-muted-foreground">- {t}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "gmail" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-attitude" />
                  <CardTitle className="text-lg">Gmail Email Chain Harvester</CardTitle>
                  <AdminTooltip
                    what="Harvests email chains from Gmail for lead research and CRM enrichment."
                    how="Uses Google OAuth to access Gmail API. Search for email threads by query, preview conversations, and sync thread data to Notion databases. Requires the Gmail connector to be enabled."
                    debug={[
                      { label: 'Gmail connector', href: '/admin/integrations' },
                      { label: 'Notion CRM', href: '/admin/integrations' },
                    ]}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Gmail Search Query</label>
                  <div className="flex gap-2 flex-wrap">
                    <Input
                      value={gmailQuery}
                      onChange={(e) => setGmailQuery(e.target.value)}
                      placeholder="e.g. from:client@company.com subject:coaching"
                      className="flex-1 min-w-[200px]"
                      data-testid="input-gmail-query"
                    />
                    <Button
                      onClick={() => gmailMutation.mutate()}
                      disabled={gmailMutation.isPending}
                      data-testid="button-harvest-gmail"
                    >
                      {gmailMutation.isPending ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Harvesting...</>
                      ) : (
                        <><Search className="h-4 w-4 mr-2" /> Harvest</>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Uses Gmail API search syntax. Examples: "from:name@company.com", "subject:satellite scan", "after:2026/01/01 label:inbox"
                  </p>
                </div>
              </CardContent>
            </Card>

            {gmailThreads.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h2 className="text-lg font-semibold font-['Poppins']">Email Threads ({gmailThreads.length})</h2>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => gmailNotionSyncMutation.mutate(gmailThreads)}
                    disabled={gmailNotionSyncMutation.isPending}
                    data-testid="button-sync-gmail-notion"
                  >
                    {gmailNotionSyncMutation.isPending ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />}
                    Sync All to Notion
                  </Button>
                </div>
                {gmailThreads.map((thread, i) => (
                  <Card key={thread.threadId}>
                    <CardContent className="pt-4">
                      <button
                        onClick={() => setExpandedThread(expandedThread === thread.threadId ? null : thread.threadId)}
                        className="w-full text-left"
                        data-testid={`button-thread-${i}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              {expandedThread === thread.threadId ? <ChevronDown className="h-4 w-4 flex-shrink-0" /> : <ChevronRight className="h-4 w-4 flex-shrink-0" />}
                              <span className="text-sm font-medium truncate">{thread.subject || '(No subject)'}</span>
                              <Badge variant="secondary" className="text-xs">{thread.messages.length} msgs</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate pl-6">{thread.from}</p>
                            <p className="text-xs text-muted-foreground/60 truncate pl-6">{thread.snippet}</p>
                          </div>
                          <span className="text-xs text-muted-foreground flex-shrink-0">{thread.date}</span>
                        </div>
                      </button>

                      {expandedThread === thread.threadId && (
                        <div className="mt-4 pl-6 space-y-3 border-t border-border/30 pt-3">
                          {thread.messages.map((msg, mi) => (
                            <div key={msg.id} className="space-y-1">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="text-xs font-medium">{msg.from}</span>
                                <span className="text-xs text-muted-foreground">{msg.date}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{msg.body}</p>
                            </div>
                          ))}
                          <div className="flex gap-2 pt-2 flex-wrap">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const text = thread.messages.map(m => `From: ${m.from}\nDate: ${m.date}\n${m.body}`).join('\n\n---\n\n');
                                copyToClipboard(text, `thread-${thread.threadId}`);
                              }}
                              data-testid={`button-copy-thread-${i}`}
                            >
                              {copiedField === `thread-${thread.threadId}` ? <Check className="h-3.5 w-3.5 mr-1 text-green-500" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                              Copy Thread
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
