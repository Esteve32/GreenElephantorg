import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Database,
  Globe,
  CreditCard,
  FileText,
  BarChart3,
  Layers,
  Wifi,
  WifiOff,
} from "lucide-react";

export interface AIContextSource {
  id: string;
  label: string;
  description: string;
  icon: typeof Database;
  connectorKey?: string;
}

const ALL_SOURCES: AIContextSource[] = [
  {
    id: "local-crm",
    label: "Local CRM",
    description: "Contacts, purchases, quiz results, waitlist entries",
    icon: Database,
  },
  {
    id: "notion",
    label: "Notion Brain",
    description: "Pipeline OS tasks, workspace pages, databases",
    icon: Layers,
    connectorKey: "notion",
  },
  {
    id: "google-sheets",
    label: "Google Sheets",
    description: "Spreadsheet data and exports",
    icon: FileText,
    connectorKey: "google-sheets",
  },
  {
    id: "stripe",
    label: "Stripe",
    description: "Revenue, transactions, subscription data",
    icon: CreditCard,
    connectorKey: "stripe",
  },
  {
    id: "fathom",
    label: "Fathom Analytics",
    description: "Visitor counts, pageviews, traffic patterns",
    icon: BarChart3,
    connectorKey: "fathom",
  },
  {
    id: "typeform",
    label: "Typeform",
    description: "Form responses, completion rates",
    icon: Globe,
    connectorKey: "typeform",
  },
];

interface ConnectorStatus {
  [key: string]: boolean;
}

interface AIContextSelectorProps {
  onSelectionChange?: (enabledSources: string[]) => void;
  compact?: boolean;
}

export function AIContextSelector({ onSelectionChange, compact = false }: AIContextSelectorProps) {
  const [expanded, setExpanded] = useState(false);
  const [enabledSources, setEnabledSources] = useState<Record<string, boolean>>({
    "local-crm": true,
    "notion": true,
    "google-sheets": true,
    "stripe": true,
    "fathom": true,
    "typeform": true,
  });

  const { data: connectorStatus } = useQuery<ConnectorStatus>({
    queryKey: ["/api/admin/connector-status"],
  });

  const { data: savedPrefs } = useQuery<{ enabledSources: Record<string, boolean> }>({
    queryKey: ["/api/admin/ai-context-prefs"],
  });

  useEffect(() => {
    if (savedPrefs?.enabledSources) {
      setEnabledSources(prev => ({ ...prev, ...savedPrefs.enabledSources }));
    }
  }, [savedPrefs]);

  const savePrefsMutation = useMutation({
    mutationFn: async (prefs: Record<string, boolean>) => {
      return apiRequest("POST", "/api/admin/ai-context-prefs", { enabledSources: prefs });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ai-context-prefs"] });
    },
  });

  const toggleSource = (sourceId: string) => {
    const updated = { ...enabledSources, [sourceId]: !enabledSources[sourceId] };
    setEnabledSources(updated);
    savePrefsMutation.mutate(updated);
    onSelectionChange?.(Object.entries(updated).filter(([, v]) => v).map(([k]) => k));
  };

  const isConnected = (source: AIContextSource): boolean => {
    if (!source.connectorKey) return true;
    return connectorStatus?.[source.connectorKey] ?? false;
  };

  const enabledCount = Object.values(enabledSources).filter(Boolean).length;
  const connectedCount = ALL_SOURCES.filter(s => isConnected(s)).length;

  const activeSources = ALL_SOURCES.filter(s => isConnected(s) && enabledSources[s.id]);

  if (compact && !expanded) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(true)}
          className="gap-1.5 text-xs text-muted-foreground"
          data-testid="button-ai-context-expand"
        >
          <Wifi className="h-3.5 w-3.5 text-flow" />
          {activeSources.length} source{activeSources.length !== 1 ? "s" : ""} active
          <ChevronDown className="h-3 w-3" />
        </Button>
        {activeSources.map(s => (
          <Tooltip key={s.id}>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1" data-testid={`badge-context-${s.id}`}>
                <div className="h-1.5 w-1.5 rounded-full bg-flow animate-pulse" />
                <span className="text-[10px] text-flow/70">{s.label}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <p>{s.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-white/10 p-4" data-testid="panel-ai-context-selector">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wifi className="h-4 w-4 text-flow" />
          <span className="text-sm font-medium">AI Context Sources</span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-flow/30 text-flow">
            {connectedCount} connected
          </Badge>
        </div>
        {compact && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(false)}
            data-testid="button-ai-context-collapse"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        These sources feed context into your AI queries. Toggle to focus the AI on specific data.
      </p>

      <div className="space-y-2">
        {ALL_SOURCES.map(source => {
          const connected = isConnected(source);
          const enabled = enabledSources[source.id] && connected;
          const Icon = source.icon;

          return (
            <div
              key={source.id}
              className={`flex items-center justify-between p-2.5 rounded-md border transition-colors ${
                enabled
                  ? "bg-flow/5 border-flow/20"
                  : connected
                    ? "bg-white/[0.02] border-white/5"
                    : "bg-white/[0.01] border-white/5 opacity-50"
              }`}
              data-testid={`row-context-source-${source.id}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded ${enabled ? "bg-flow/20" : "bg-white/5"}`}>
                  <Icon className={`h-3.5 w-3.5 ${enabled ? "text-flow" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium">{source.label}</span>
                    {connected ? (
                      <Check className="h-3 w-3 text-flow" />
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <WifiOff className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-xs">
                          Not connected. Enable in Admin &gt; Connected Tools.
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{source.description}</p>
                </div>
              </div>

              <Switch
                checked={enabled}
                disabled={!connected}
                onCheckedChange={() => toggleSource(source.id)}
                className="data-[state=checked]:!bg-flow scale-90"
                data-testid={`switch-context-${source.id}`}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Check className="h-3 w-3 text-flow" />
          <span>{enabledCount} of {ALL_SOURCES.length} sources active — AI will use these for your next query</span>
        </div>
      </div>
    </Card>
  );
}

export function useAIContextSources(): string[] {
  const { data: savedPrefs } = useQuery<{ enabledSources: Record<string, boolean> }>({
    queryKey: ["/api/admin/ai-context-prefs"],
  });

  if (!savedPrefs?.enabledSources) {
    return ALL_SOURCES.map(s => s.id);
  }

  return Object.entries(savedPrefs.enabledSources)
    .filter(([, enabled]) => enabled)
    .map(([id]) => id);
}
