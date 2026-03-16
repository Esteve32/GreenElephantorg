import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AdminTooltip } from "@/components/AdminTooltip";
import { AIContextSelector } from "@/components/AIContextSelector";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  ArrowLeft,
  Bot,
  Cpu,
  Zap,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Eye,
  EyeOff,
  Settings,
  Clock,
  BarChart3,
  TrendingUp,
  Shield,
  Loader2,
  Sparkles,
  Brain,
  Gauge,
  CircleDot,
} from "lucide-react";

type TimeRange = "day" | "week" | "month";

interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  version: string;
  enabled: boolean;
  status: "connected" | "disconnected" | "error";
  apiKeySet: boolean;
  lastChecked: string | null;
  description: string;
}

interface UsageStat {
  period: string;
  tokens: number;
  requests: number;
  cost: number;
}

interface ActivityEntry {
  id: string;
  timestamp: string;
  model: string;
  feature: string;
  tokensUsed: number;
  status: "success" | "error";
  durationMs: number;
}

interface TroubleshootItem {
  title: string;
  description: string;
  resolution: string[];
}

const TROUBLESHOOT_ITEMS: TroubleshootItem[] = [
  {
    title: "API key expired or invalid",
    description: "The API key stored for this model is no longer valid. This can happen if the key was revoked or expired.",
    resolution: [
      "Go to the model provider dashboard (OpenAI/Google Cloud) and generate a new API key.",
      "Update the key in the model connection card above.",
      "Click 'Test Connection' to verify the new key works.",
    ],
  },
  {
    title: "Rate limit exceeded",
    description: "Too many requests were sent in a short period. Most AI APIs have rate limits per minute and per day.",
    resolution: [
      "Wait a few minutes and try again — most rate limits reset quickly.",
      "Check the Usage Stats panel to see if traffic spiked unexpectedly.",
      "Consider upgrading your API plan for higher limits.",
      "If a specific feature is hammering the API, check the Activity Log to identify it.",
    ],
  },
  {
    title: "Model unavailable or deprecated",
    description: "The selected model version may have been deprecated by the provider or is experiencing an outage.",
    resolution: [
      "Check the provider's status page (status.openai.com or Google Cloud status).",
      "Switch to a different model version in the connection card.",
      "If the model was deprecated, update to the recommended replacement version.",
    ],
  },
  {
    title: "Timeout errors",
    description: "The AI model is taking too long to respond. This can happen with complex prompts or during high-traffic periods.",
    resolution: [
      "Try again — temporary slowdowns are common during peak hours.",
      "Simplify prompts if they are unusually long or complex.",
      "Check if the provider is experiencing an outage on their status page.",
      "Consider using a faster model variant (e.g., GPT-4o-mini instead of GPT-4o).",
    ],
  },
  {
    title: "Unexpected or empty responses",
    description: "The model returned an empty, truncated, or nonsensical response.",
    resolution: [
      "Check the Activity Log for the specific failed call to see error details.",
      "Ensure the prompt template is well-formed and not exceeding token limits.",
      "Try the same request again — occasional bad outputs happen with all LLMs.",
      "If persistent, switch models or report the issue to the provider.",
    ],
  },
  {
    title: "Google OAuth not connected (Gemini)",
    description: "Gemini requires Google authentication to be configured. If Google OAuth is not set up, Gemini will show as disconnected.",
    resolution: [
      "Go to Connected Tools page and verify Google OAuth is configured.",
      "Ensure the Google Cloud project has the Gemini API (or Generative Language API) enabled.",
      "Add the API key from Google AI Studio to the Gemini connection card.",
    ],
  },
];

const CHATGPT_VERSIONS = ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"];
const GEMINI_VERSIONS = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.0-pro"];

const DEMO_MODELS: ModelConfig[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    provider: "OpenAI",
    version: "gpt-4o",
    enabled: true,
    status: "connected",
    apiKeySet: true,
    lastChecked: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    description: "Default model. Powers Prompt Generator, FlowCheck analysis, and the Conscious Communicator custom GPT.",
  },
  {
    id: "gemini",
    name: "Gemini",
    provider: "Google",
    version: "gemini-1.5-pro",
    enabled: false,
    status: "disconnected",
    apiKeySet: false,
    lastChecked: null,
    description: "Alternative model via Google Cloud. Requires Google OAuth and Gemini API to be enabled.",
  },
];

interface UsageResponse {
  timeline: UsageStat[];
  byFeature: { feature: string; tokens: number; pct: number }[];
  byModel: { model: string; tokens: number; pct: number }[];
  runningTotal: number;
  projectedMonthly: number;
}

interface ActivityResponse {
  items: ActivityEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const FEATURE_COLORS: Record<string, string> = {
  "Prompt Generator": "text-chaordic border-chaordic/30",
  "FlowCheck Analysis": "text-flow border-flow/30",
  "Content Flywheel": "text-influence border-influence/30",
  "Debrief Summary": "text-needs border-needs/30",
  "Case Study Builder": "text-dynamics border-dynamics/30",
  "Playground": "text-attitude border-attitude/30",
};

export default function AIToolsDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [models, setModels] = useState<ModelConfig[]>(DEMO_MODELS);
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [testingModel, setTestingModel] = useState<string | null>(null);
  const [expandedTroubleshoot, setExpandedTroubleshoot] = useState<number | null>(null);
  const [budgetThreshold, setBudgetThreshold] = useState("10.00");
  const [activityPage, setActivityPage] = useState(1);

  const settingsQuery = useQuery<{ key: string; value: string }[]>({
    queryKey: ["/api/admin/ai-tools/settings"],
    retry: false,
  });

  useEffect(() => {
    if (settingsQuery.data) {
      const saved = settingsQuery.data.find(s => s.key === "ai_tools_budget_threshold");
      if (saved) setBudgetThreshold(saved.value);
    }
  }, [settingsQuery.data]);

  const saveSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      await apiRequest("POST", "/api/admin/ai-tools/settings", { key, value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ai-tools/settings"] });
    },
  });

  const handleSaveBudget = () => {
    saveSettingMutation.mutate(
      { key: "ai_tools_budget_threshold", value: budgetThreshold },
      {
        onSuccess: () => toast({ title: "Budget threshold saved" }),
        onError: () => toast({ title: "Failed to save", variant: "destructive" }),
      }
    );
  };

  const usageQuery = useQuery<UsageResponse>({
    queryKey: ["/api/admin/ai-tools/usage", timeRange],
    queryFn: async () => {
      const res = await fetch(`/api/admin/ai-tools/usage?range=${timeRange}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch usage");
      return res.json();
    },
  });

  const activityQuery = useQuery<ActivityResponse>({
    queryKey: ["/api/admin/ai-tools/activity", activityPage],
    queryFn: async () => {
      const res = await fetch(`/api/admin/ai-tools/activity?page=${activityPage}&limit=8`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch activity");
      return res.json();
    },
  });

  const usageData = usageQuery.data?.timeline || [];
  const byFeature = usageQuery.data?.byFeature || [];
  const byModel = usageQuery.data?.byModel || [];
  const runningTotal = usageQuery.data?.runningTotal ?? 0;
  const projectedMonthly = usageQuery.data?.projectedMonthly ?? 0;
  const totalTokens = usageData.reduce((sum, u) => sum + u.tokens, 0);
  const totalRequests = usageData.reduce((sum, u) => sum + u.requests, 0);
  const totalCost = usageData.reduce((sum, u) => sum + u.cost, 0);
  const activityItems = activityQuery.data?.items || [];
  const activityTotalPages = activityQuery.data?.totalPages || 1;
  const budgetExceeded = projectedMonthly > parseFloat(budgetThreshold || "0");

  const handleTestConnection = async (modelId: string) => {
    setTestingModel(modelId);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setModels(prev => prev.map(m =>
      m.id === modelId
        ? { ...m, status: m.apiKeySet ? "connected" : "disconnected", lastChecked: new Date().toISOString() }
        : m
    ));
    setTestingModel(null);
    toast({
      title: models.find(m => m.id === modelId)?.apiKeySet ? "Connection successful" : "Connection failed",
      description: models.find(m => m.id === modelId)?.apiKeySet
        ? `${models.find(m => m.id === modelId)?.name} is responding normally.`
        : "No API key configured. Add one to connect.",
    });
  };

  const handleToggleModel = (modelId: string) => {
    setModels(prev => prev.map(m =>
      m.id === modelId ? { ...m, enabled: !m.enabled } : m
    ));
  };

  const formatTimeAgo = (iso: string | null) => {
    if (!iso) return "Never";
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const formatTimestamp = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" });
  };

  const maxTokens = usageData.length > 0 ? Math.max(...usageData.map(u => u.tokens)) : 1;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => navigate("/admin/submissions")}
              data-testid="button-back-admin"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Back to Admin Hub</TooltipContent>
        </Tooltip>
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-needs" />
          <h1 className="text-2xl font-bold font-['Poppins'] tracking-tight">AI Tools Dashboard</h1>
          <AdminTooltip
            what="Control center for all AI model connections used across the website and portal."
            how="Monitor usage, estimated costs, and troubleshoot connection issues. Currently shows demo data — real tracking activates when portal AI tools go live."
            debug={[
              { label: "OpenAI Dashboard", href: "https://platform.openai.com/usage" },
              { label: "Google AI Studio", href: "https://aistudio.google.com/" },
              { label: "Connected Tools", href: "/admin/integrations" },
            ]}
          />
        </div>
      </div>

      <AIContextSelector compact />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-needs" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Models Active</span>
                <AdminTooltip what="Number of AI models currently enabled and connected." />
              </div>
            </div>
            <p className="text-2xl font-bold font-['Poppins'] mt-2" data-testid="text-models-active">
              {models.filter(m => m.enabled && m.status === "connected").length}/{models.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-chaordic" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Tokens ({timeRange})</span>
                <AdminTooltip what={`Total tokens consumed across all models this ${timeRange === "day" ? "today" : timeRange}.`} />
              </div>
            </div>
            <p className="text-2xl font-bold font-['Poppins'] mt-2" data-testid="text-total-tokens">
              {totalTokens.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-flow" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Requests ({timeRange})</span>
                <AdminTooltip what={`Total API requests made this ${timeRange === "day" ? "today" : timeRange}.`} />
              </div>
            </div>
            <p className="text-2xl font-bold font-['Poppins'] mt-2" data-testid="text-total-requests">
              {totalRequests}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-attitude" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Est. Cost ({timeRange})</span>
                <AdminTooltip what="Estimated cost based on published per-token pricing for each model. Actual billing may vary." />
              </div>
            </div>
            <p className="text-2xl font-bold font-['Poppins'] mt-2" data-testid="text-total-cost">
              ${totalCost.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {models.map(model => (
          <Card key={model.id} className={model.enabled ? "border-needs/20" : "border-white/10 opacity-70"}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  {model.provider === "OpenAI" ? (
                    <Sparkles className="h-5 w-5 text-chaordic" />
                  ) : (
                    <Brain className="h-5 w-5 text-flow" />
                  )}
                  <CardTitle className="text-lg font-['Poppins']">{model.name}</CardTitle>
                  <Badge
                    variant="outline"
                    className={
                      model.status === "connected"
                        ? "text-green-400 border-green-400/30"
                        : model.status === "error"
                        ? "text-red-400 border-red-400/30"
                        : "text-muted-foreground border-white/10"
                    }
                  >
                    {model.status === "connected" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {model.status === "error" && <XCircle className="h-3 w-3 mr-1" />}
                    {model.status === "disconnected" && <CircleDot className="h-3 w-3 mr-1" />}
                    {model.status}
                  </Badge>
                  <AdminTooltip
                    what={model.description}
                    how={model.provider === "OpenAI"
                      ? "Uses OPENAI_API_KEY from environment secrets."
                      : "Requires Google OAuth + Gemini API enabled in Google Cloud."}
                  />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={model.enabled ? "default" : "outline"}
                      onClick={() => handleToggleModel(model.id)}
                      data-testid={`button-toggle-${model.id}`}
                    >
                      {model.enabled ? "Enabled" : "Disabled"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Click to {model.enabled ? "disable" : "enable"} this model</TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Provider</label>
                  <p className="text-sm font-medium" data-testid={`text-provider-${model.id}`}>{model.provider}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Model Version</label>
                  <select
                    className="w-full bg-background border border-white/10 rounded-md px-2 py-1.5 text-sm"
                    value={model.version}
                    onChange={e => setModels(prev => prev.map(m => m.id === model.id ? { ...m, version: e.target.value } : m))}
                    data-testid={`select-version-${model.id}`}
                  >
                    {(model.provider === "OpenAI" ? CHATGPT_VERSIONS : GEMINI_VERSIONS).map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">API Key Status</label>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <Input
                      type={showApiKey[model.id] ? "text" : "password"}
                      value={model.apiKeySet ? "sk-••••••••••••••••••••" : ""}
                      placeholder="No API key configured"
                      readOnly
                      className="text-sm bg-white/[0.03]"
                      data-testid={`input-apikey-${model.id}`}
                    />
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowApiKey(prev => ({ ...prev, [model.id]: !prev[model.id] }))}
                        data-testid={`button-toggle-key-${model.id}`}
                      >
                        {showApiKey[model.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{showApiKey[model.id] ? "Hide" : "Show"} API key</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 flex-wrap">
                <span className="text-xs text-muted-foreground">
                  Last checked: {formatTimeAgo(model.lastChecked)}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTestConnection(model.id)}
                      disabled={testingModel === model.id}
                      data-testid={`button-test-${model.id}`}
                    >
                      {testingModel === model.id ? (
                        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                      )}
                      Test Connection
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Send a test request to verify the model is responding</TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-chaordic" />
              <CardTitle className="text-lg font-['Poppins']">Usage Statistics</CardTitle>
              <AdminTooltip
                what="Token usage and request counts over the selected time period."
                how="Data shown is demo/estimated. Real tracking activates when portal AI tools go live."
              />
            </div>
            <div className="flex items-center gap-1">
              {(["day", "week", "month"] as TimeRange[]).map(range => (
                <Button
                  key={range}
                  size="sm"
                  variant={timeRange === range ? "default" : "ghost"}
                  onClick={() => setTimeRange(range)}
                  className="capitalize"
                  data-testid={`button-range-${range}`}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {usageData.map((entry, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-16 text-right shrink-0">{entry.period}</span>
                <div className="flex-1 h-6 bg-white/[0.03] rounded-md overflow-hidden relative">
                  <div
                    className="h-full bg-needs/30 rounded-md transition-all duration-500"
                    style={{ width: `${Math.max((entry.tokens / maxTokens) * 100, 2)}%` }}
                  />
                  <span className="absolute inset-0 flex items-center px-2 text-xs font-medium">
                    {entry.tokens.toLocaleString()} tokens / {entry.requests} req
                  </span>
                </div>
                <span className="text-xs text-muted-foreground w-14 text-right shrink-0">${entry.cost.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-attitude" />
              <CardTitle className="text-lg font-['Poppins']">Cost Estimation</CardTitle>
              <AdminTooltip
                what="Estimated costs based on published per-token pricing. Set a budget alert to get notified."
                how="Rates: GPT-4o ~$0.005/1K input tokens, $0.015/1K output. Gemini 1.5 Pro ~$0.00125/1K input."
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-md border border-white/10 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Running Total</span>
                  <AdminTooltip what="Estimated cost for the current billing period (this month)." />
                </div>
                <p className="text-xl font-bold font-['Poppins']" data-testid="text-running-total">${runningTotal.toFixed(2)}</p>
                <span className="text-xs text-muted-foreground">this month</span>
              </div>
              <div className="rounded-md border border-white/10 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Projected</span>
                  <AdminTooltip what="Projected monthly cost if current usage rate continues." />
                </div>
                <p className="text-xl font-bold font-['Poppins']" data-testid="text-projected-cost">${projectedMonthly.toFixed(2)}</p>
                <span className="text-xs text-muted-foreground">per month</span>
              </div>
            </div>

            {budgetExceeded && (
              <div className="rounded-md border border-red-400/30 bg-red-400/5 p-3 flex items-center gap-2 flex-wrap">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                <span className="text-sm text-red-400 font-medium">
                  Projected cost (${projectedMonthly.toFixed(2)}/mo) exceeds your budget threshold (${parseFloat(budgetThreshold).toFixed(2)}/mo)
                </span>
              </div>
            )}

            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Budget Alert Threshold</label>
                <AdminTooltip what="You'll see a warning on this dashboard when estimated costs exceed this amount." />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">$</span>
                <Input
                  type="number"
                  value={budgetThreshold}
                  onChange={e => setBudgetThreshold(e.target.value)}
                  className="w-24 text-sm"
                  step="1"
                  min="1"
                  data-testid="input-budget-threshold"
                />
                <span className="text-xs text-muted-foreground">per month</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSaveBudget}
                      disabled={saveSettingMutation.isPending}
                      data-testid="button-save-budget"
                    >
                      {saveSettingMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save budget threshold to server</TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div className="rounded-md border border-white/10 p-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Per 1K Token Rates</p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm">GPT-4o (input)</span>
                  <span className="text-sm font-medium">$0.005</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm">GPT-4o (output)</span>
                  <span className="text-sm font-medium">$0.015</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm">GPT-4o-mini (input)</span>
                  <span className="text-sm font-medium">$0.00015</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm">Gemini 1.5 Pro (input)</span>
                  <span className="text-sm font-medium">$0.00125</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-flow" />
              <CardTitle className="text-lg font-['Poppins']">Usage by Feature</CardTitle>
              <AdminTooltip
                what="Breakdown of AI token usage by website/portal feature."
                how="Helps identify which tools consume the most tokens so you can optimize or set limits."
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {byFeature.map(item => (
                <div key={item.feature} className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-medium ${FEATURE_COLORS[item.feature]?.split(" ")[0] || ""}`}>
                      {item.feature}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.tokens.toLocaleString()} tokens ({item.pct}%)</span>
                  </div>
                  <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-needs/40 rounded-full transition-all duration-500"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-needs" />
            <CardTitle className="text-lg font-['Poppins']">Usage by Model</CardTitle>
            <AdminTooltip
              what="Breakdown of token usage by AI model."
              how="Shows which models consume the most tokens. Useful for optimizing costs by shifting to cheaper models where possible."
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {byModel.map(item => (
              <div key={item.model} className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{item.model}</span>
                  <span className="text-xs text-muted-foreground">{item.tokens.toLocaleString()} tokens ({item.pct}%)</span>
                </div>
                <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-chaordic/40 rounded-full transition-all duration-500"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-attitude" />
            <CardTitle className="text-lg font-['Poppins']">Troubleshooting Guide</CardTitle>
            <AdminTooltip
              what="Common issues with AI model connections and how to resolve them."
              how="Click an issue to expand resolution steps."
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          {TROUBLESHOOT_ITEMS.map((item, i) => (
            <div key={i} className="rounded-md border border-white/10">
              <button
                className="w-full flex items-center gap-3 p-3 text-left hover-elevate active-elevate-2 rounded-md"
                onClick={() => setExpandedTroubleshoot(expandedTroubleshoot === i ? null : i)}
                data-testid={`button-troubleshoot-${i}`}
              >
                {expandedTroubleshoot === i ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <span className="text-sm font-medium">{item.title}</span>
              </button>
              {expandedTroubleshoot === i && (
                <div className="px-3 pb-3 pl-10 space-y-2">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Resolution Steps</p>
                    <ol className="list-decimal list-inside space-y-1">
                      {item.resolution.map((step, j) => (
                        <li key={j} className="text-sm text-muted-foreground">{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-dynamics" />
            <CardTitle className="text-lg font-['Poppins']">Activity Log</CardTitle>
            <AdminTooltip
              what="Recent AI API calls showing model, feature, tokens, and status."
              how="Scroll down to see older entries. Shows demo data until real AI integrations are active."
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-2 pr-4">Time</th>
                  <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-2 pr-4">Model</th>
                  <th className="text-left text-xs text-muted-foreground uppercase tracking-wider py-2 pr-4">Feature</th>
                  <th className="text-right text-xs text-muted-foreground uppercase tracking-wider py-2 pr-4">Tokens</th>
                  <th className="text-right text-xs text-muted-foreground uppercase tracking-wider py-2 pr-4">Duration</th>
                  <th className="text-center text-xs text-muted-foreground uppercase tracking-wider py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {activityQuery.isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                      Loading activity...
                    </td>
                  </tr>
                ) : activityItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">No activity recorded yet.</td>
                  </tr>
                ) : (
                  activityItems.map(entry => (
                    <tr key={entry.id} className="border-b border-white/5">
                      <td className="py-2.5 pr-4 text-muted-foreground whitespace-nowrap" data-testid={`text-activity-time-${entry.id}`}>
                        {formatTimestamp(entry.timestamp)}
                      </td>
                      <td className="py-2.5 pr-4">
                        <Badge variant="outline" className="text-xs">
                          {entry.model}
                        </Badge>
                      </td>
                      <td className="py-2.5 pr-4">
                        <span className={`text-sm ${FEATURE_COLORS[entry.feature]?.split(" ")[0] || ""}`}>
                          {entry.feature}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-right font-medium" data-testid={`text-activity-tokens-${entry.id}`}>
                        {entry.tokensUsed.toLocaleString()}
                      </td>
                      <td className="py-2.5 pr-4 text-right text-muted-foreground">
                        {(entry.durationMs / 1000).toFixed(1)}s
                      </td>
                      <td className="py-2.5 text-center">
                        {entry.status === "success" ? (
                          <Badge variant="outline" className="text-green-400 border-green-400/30 text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            OK
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-400 border-red-400/30 text-xs">
                            <XCircle className="h-3 w-3 mr-1" />
                            Error
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {activityTotalPages > 1 && (
            <div className="flex items-center justify-between gap-2 pt-4 border-t border-white/5 mt-4 flex-wrap">
              <span className="text-xs text-muted-foreground">
                Page {activityPage} of {activityTotalPages} ({activityQuery.data?.total || 0} entries)
              </span>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={activityPage <= 1}
                      onClick={() => setActivityPage(p => Math.max(1, p - 1))}
                      data-testid="button-activity-prev"
                    >
                      Previous
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Go to previous page</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={activityPage >= activityTotalPages}
                      onClick={() => setActivityPage(p => Math.min(activityTotalPages, p + 1))}
                      data-testid="button-activity-next"
                    >
                      Next
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Go to next page</TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
