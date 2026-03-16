import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  CreditCard,
  Mail,
  Database,
  BarChart3,
  Bot,
  FileText,
  Youtube,
  Calendar,
  Github,
  Table2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  Clock,
  AlertTriangle,
  Loader2,
  Power,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Linkedin,
  Activity,
} from "lucide-react";
import { format } from "date-fns";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { AdminTooltip } from "@/components/AdminTooltip";
import geLogo from "@assets/GE logo 512x512 transparent BG 2023 _1764343412596.png";

type ConnectorTier = "critical" | "important" | "standard";

interface ConnectorConfig {
  name: string;
  label: string;
  description: string;
  icon: typeof CreditCard;
  tier: ConnectorTier;
  envKey: string;
  color: string;
}

const CONNECTORS: ConnectorConfig[] = [
  {
    name: "stripe",
    label: "Stripe",
    description: "Payment processing for Satellite Scan and coaching packages",
    icon: CreditCard,
    tier: "critical",
    envKey: "STRIPE_SECRET_KEY",
    color: "#635bff",
  },
  {
    name: "resend",
    label: "Resend",
    description: "Transactional and onboarding emails, purchase confirmations",
    icon: Mail,
    tier: "critical",
    envKey: "RESEND_API_KEY",
    color: "#000000",
  },
  {
    name: "notion",
    label: "Notion CRM",
    description: "Two-way contact sync, channels tracking, and CRM updates",
    icon: Database,
    tier: "critical",
    envKey: "NOTION_API_KEY",
    color: "#000000",
  },
  {
    name: "thesys",
    label: "Thesys / Claude",
    description: "AI-powered social copy generator and dashboard UI",
    icon: Bot,
    tier: "important",
    envKey: "THESYS_API_KEY",
    color: "#009999",
  },
  {
    name: "google-analytics",
    label: "Google Analytics",
    description: "GA4 tracking (frontend) + Data API (server-side metrics)",
    icon: BarChart3,
    tier: "standard",
    envKey: "GA4_PROPERTY_ID",
    color: "#e37400",
  },
  {
    name: "google-sheets",
    label: "Google Sheets",
    description: "Spreadsheet data imports and exports",
    icon: Table2,
    tier: "standard",
    envKey: "GOOGLE_SHEETS_API_KEY",
    color: "#0f9d58",
  },
  {
    name: "typeform",
    label: "Typeform",
    description: "Satellite Scan questionnaire webhook receiver",
    icon: FileText,
    tier: "standard",
    envKey: "TYPEFORM_WEBHOOK_SECRET",
    color: "#262627",
  },
  {
    name: "youtube",
    label: "YouTube",
    description: "Embedded tutorial playlist and webinar replays",
    icon: Youtube,
    tier: "standard",
    envKey: "YOUTUBE_API_KEY",
    color: "#ff0000",
  },
  {
    name: "calendly",
    label: "Calendly",
    description: "Coaching session booking links",
    icon: Calendar,
    tier: "standard",
    envKey: "CALENDLY_API_TOKEN",
    color: "#006bff",
  },
  {
    name: "github",
    label: "GitHub",
    description: "Codebase backup push to Esteve32/GreenElephantorg",
    icon: Github,
    tier: "standard",
    envKey: "GITHUB_TOKEN",
    color: "#333333",
  },
  {
    name: "linkedin",
    label: "LinkedIn",
    description: "OpenID Connect login for client portal and company page integration",
    icon: Linkedin,
    tier: "important",
    envKey: "LINKEDIN_CLIENT_ID",
    color: "#0A66C2",
  },
  {
    name: "gmail",
    label: "Gmail",
    description: "Email chain harvesting for lead research and CRM enrichment via Google OAuth",
    icon: Mail,
    tier: "standard",
    envKey: "GMAIL_OAUTH_TOKEN",
    color: "#EA4335",
  },
  {
    name: "fathom",
    label: "Fathom Analytics",
    description: "Privacy-first website analytics — real-time visitors, pageviews, and referrers via OAuth",
    icon: Activity,
    tier: "important",
    envKey: "FATHOM_CLIENT_ID",
    color: "#8B5CF6",
  },
];

const TIER_CONFIG: Record<ConnectorTier, { label: string; color: string; icon: typeof Shield }> = {
  critical: { label: "Critical", color: "text-red-400", icon: ShieldAlert },
  important: { label: "Important", color: "text-amber-400", icon: Shield },
  standard: { label: "Standard", color: "text-white/40", icon: ShieldCheck },
};

interface ConnectorStatus {
  enabled: boolean;
  hasEnvKey: boolean;
}

interface ToggleLog {
  id: string;
  connectorName: string;
  action: string;
  previousEnabled: string | null;
  newEnabled: string | null;
  triggeredBy: string;
  performedBy: string;
  createdAt: string;
}

function getConnectorStatusBadge(status: ConnectorStatus | undefined) {
  if (!status) return null;
  if (!status.hasEnvKey) {
    return (
      <Badge variant="outline" className="text-xs text-amber-400 border-amber-400/20">
        <MinusCircle className="h-3 w-3 mr-1" />
        Not configured
      </Badge>
    );
  }
  if (status.enabled) {
    return (
      <Badge variant="outline" className="text-xs text-green-400 border-green-400/20">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Active
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-xs text-red-400 border-red-400/20">
      <XCircle className="h-3 w-3 mr-1" />
      Disabled
    </Badge>
  );
}

export default function IntegrationsAdmin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    connector: ConnectorConfig | null;
    newEnabled: boolean;
    confirmText: string;
  }>({ open: false, connector: null, newEnabled: false, confirmText: "" });
  const [killSwitchDialog, setKillSwitchDialog] = useState<{
    open: boolean;
    confirmText: string;
  }>({ open: false, confirmText: "" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("fathom_connected") === "true") {
      toast({ title: "Fathom connected", description: "Fathom Analytics is now linked to your account." });
      window.history.replaceState({}, "", window.location.pathname);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/connectors/status"] });
    }
    const fathomErr = params.get("fathom_error");
    if (fathomErr) {
      toast({ title: "Fathom connection failed", description: `OAuth error: ${fathomErr}. Check that FATHOM_CLIENT_ID and FATHOM_CLIENT_SECRET are set.`, variant: "destructive" });
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const { data: statuses, isLoading: statusLoading } = useQuery<Record<string, ConnectorStatus>>({
    queryKey: ["/api/admin/connectors/status"],
  });

  const { data: logs, isLoading: logsLoading } = useQuery<ToggleLog[]>({
    queryKey: ["/api/admin/connectors/logs"],
  });

  const toggleMutation = useMutation({
    mutationFn: ({ name, enabled }: { name: string; enabled: string }) =>
      apiRequest("PUT", `/api/admin/connectors/${name}`, { enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/connectors/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/connectors/logs"] });
    },
  });

  const killSwitchMutation = useMutation({
    mutationFn: ({ enabled }: { enabled: string }) =>
      apiRequest("POST", "/api/admin/connectors/kill-switch", { enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/connectors/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/connectors/logs"] });
    },
  });

  const handleToggle = (connector: ConnectorConfig, newEnabled: boolean) => {
    if ((connector.tier === "critical" || connector.tier === "important") && !newEnabled) {
      setConfirmDialog({ open: true, connector, newEnabled, confirmText: "" });
      return;
    }
    executeToggle(connector, newEnabled);
  };

  const executeToggle = (connector: ConnectorConfig, newEnabled: boolean) => {
    toggleMutation.mutate(
      { name: connector.name, enabled: newEnabled ? "true" : "false" },
      {
        onSuccess: () => {
          toast({
            title: `${connector.label} ${newEnabled ? "enabled" : "disabled"}`,
            description: newEnabled
              ? `${connector.label} is now active`
              : `${connector.label} has been turned off`,
          });
          setConfirmDialog({ open: false, connector: null, newEnabled: false, confirmText: "" });
        },
        onError: () => {
          toast({
            title: "Error",
            description: `Could not update ${connector.label}`,
            variant: "destructive",
          });
        },
      }
    );
  };

  const confirmDisable = () => {
    if (!confirmDialog.connector) return;
    const c = confirmDialog.connector;
    if (c.tier === "critical" && confirmDialog.confirmText !== "CONFIRM") return;
    executeToggle(c, confirmDialog.newEnabled);
  };

  const handleKillSwitch = () => {
    if (killSwitchDialog.confirmText !== "CONFIRM") return;
    killSwitchMutation.mutate(
      { enabled: "false" },
      {
        onSuccess: () => {
          toast({
            title: "All connectors disabled",
            description: "Every integration has been turned off via kill switch",
            variant: "destructive",
          });
          setKillSwitchDialog({ open: false, confirmText: "" });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Kill switch failed",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleReenableAll = () => {
    killSwitchMutation.mutate(
      { enabled: "true" },
      {
        onSuccess: () => {
          toast({
            title: "All connectors re-enabled",
            description: "Every integration has been turned back on",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Could not re-enable connectors",
            variant: "destructive",
          });
        },
      }
    );
  };

  const paymentsConnectors = CONNECTORS.filter((c) => c.name === "stripe");
  const commsConnectors = CONNECTORS.filter((c) => c.name === "resend");
  const crmConnectors = CONNECTORS.filter((c) => c.name === "notion");
  const aiConnectors = CONNECTORS.filter((c) => c.name === "thesys");
  const dataConnectors = CONNECTORS.filter((c) => ["google-analytics", "google-sheets", "fathom"].includes(c.name));
  const formsConnectors = CONNECTORS.filter((c) => c.name === "typeform");
  const contentConnectors = CONNECTORS.filter((c) => ["youtube", "calendly"].includes(c.name));
  const codeConnectors = CONNECTORS.filter((c) => c.name === "github");
  const authConnectors = CONNECTORS.filter((c) => c.name === "linkedin");
  const researchConnectors = CONNECTORS.filter((c) => c.name === "gmail");

  const enabledCount = statuses
    ? Object.values(statuses).filter((s) => s.enabled).length
    : 0;
  const totalCount = statuses ? Object.keys(statuses).length : 0;
  const allActive = enabledCount === totalCount && totalCount > 0;
  const someDisabled = enabledCount < totalCount && totalCount > 0;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, HH:mm");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Tooltip><TooltipTrigger asChild><Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/submissions")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Admin Hub
          </Button></TooltipTrigger><TooltipContent>Back to Admin Hub</TooltipContent></Tooltip>
          <div className="flex items-center gap-3">
            <img src={geLogo} alt="GreenElephant" className="h-8 w-8 rounded-md" />
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold font-[Poppins]" data-testid="text-page-title">
                Connected Tools
              </h1>
              <AdminTooltip
                what="Monitor and control all third-party service connections — Stripe, Resend, Notion, LinkedIn, Google Sheets, YouTube, Thesys, GitHub, and more."
                how="Toggle individual connectors on/off, or use the Master Kill Switch for emergencies. Green = active, red = disabled. Audit log tracks all changes."
                debug={[
                  { label: "GET /api/admin/connector-status", href: "/api/admin/connector-status" },
                  { label: "GDPR Controls", href: "/admin/gdpr-controls" },
                ]}
              />
              {!statusLoading && statuses && (
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    allActive
                      ? "text-green-400 border-green-400/30"
                      : someDisabled
                      ? "text-amber-400 border-amber-400/30"
                      : "text-white/40 border-white/10"
                  }`}
                  data-testid="badge-global-status"
                >
                  {allActive ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      All systems active
                    </>
                  ) : someDisabled ? (
                    <>
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {totalCount - enabledCount} disabled
                    </>
                  ) : (
                    "Loading"
                  )}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {statusLoading ? (
          <div className="flex items-center justify-center py-20 text-white/40 gap-3">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading connector status...
          </div>
        ) : (
          <div className="space-y-8">
            <Card
              className="bg-red-950/20 border-red-500/20"
              data-testid="card-kill-switch"
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 bg-red-500/10 border border-red-500/20">
                    <ShieldOff className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-base text-red-300">Master Kill Switch</h2>
                    <p className="text-xs text-white/40 mt-0.5">
                      Immediately disable all 11 connectors at once. Requires typed confirmation.
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {someDisabled && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-green-600 text-white"
                            onClick={handleReenableAll}
                            disabled={killSwitchMutation.isPending}
                            data-testid="button-reenable-all"
                          >
                            {killSwitchMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <Power className="h-4 w-4 mr-1" />
                            )}
                            Re-enable All
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-xs">Turn all disabled connectors back on at once. Safe to use — individual toggles still work independently.</TooltipContent>
                      </Tooltip>
                    )}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setKillSwitchDialog({ open: true, confirmText: "" })}
                          disabled={killSwitchMutation.isPending}
                          data-testid="button-kill-switch"
                        >
                          <ShieldOff className="h-4 w-4 mr-1" />
                          Disable All
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-xs">Emergency kill switch: immediately disables all 11 integrations (Stripe, Resend, Notion, etc.). Requires typed confirmation. Use only if you suspect a security breach or need to stop all outbound traffic.</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ConnectorGroup
                title="Payments"
                subtitle="Transaction processing"
                connectors={paymentsConnectors}
                statuses={statuses || {}}
                onToggle={handleToggle}
                isPending={toggleMutation.isPending}
              />
              <ConnectorGroup
                title="Communications"
                subtitle="Email delivery"
                connectors={commsConnectors}
                statuses={statuses || {}}
                onToggle={handleToggle}
                isPending={toggleMutation.isPending}
              />
              <ConnectorGroup
                title="CRM"
                subtitle="Contact sync"
                connectors={crmConnectors}
                statuses={statuses || {}}
                onToggle={handleToggle}
                isPending={toggleMutation.isPending}
              />
              <ConnectorGroup
                title="AI"
                subtitle="Copy generation & dashboard"
                connectors={aiConnectors}
                statuses={statuses || {}}
                onToggle={handleToggle}
                isPending={toggleMutation.isPending}
              />
              <ConnectorGroup
                title="Data & Analytics"
                subtitle="Metrics and spreadsheets"
                connectors={dataConnectors}
                statuses={statuses || {}}
                onToggle={handleToggle}
                isPending={toggleMutation.isPending}
              />
              <ConnectorGroup
                title="Forms"
                subtitle="Questionnaire webhooks"
                connectors={formsConnectors}
                statuses={statuses || {}}
                onToggle={handleToggle}
                isPending={toggleMutation.isPending}
              />
              <ConnectorGroup
                title="Content"
                subtitle="Video embeds & booking"
                connectors={contentConnectors}
                statuses={statuses || {}}
                onToggle={handleToggle}
                isPending={toggleMutation.isPending}
              />
              <ConnectorGroup
                title="Authentication"
                subtitle="OAuth & login providers"
                connectors={authConnectors}
                statuses={statuses || {}}
                onToggle={handleToggle}
                isPending={toggleMutation.isPending}
              />
              <ConnectorGroup
                title="Code"
                subtitle="Codebase backup"
                connectors={codeConnectors}
                statuses={statuses || {}}
                onToggle={handleToggle}
                isPending={toggleMutation.isPending}
              />
              <ConnectorGroup
                title="Research"
                subtitle="Lead gen & email harvesting"
                connectors={researchConnectors}
                statuses={statuses || {}}
                onToggle={handleToggle}
                isPending={toggleMutation.isPending}
              />
            </div>
          </div>
        )}

        <Card className="bg-white/5 border-white/10 mt-10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-white/40" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <p className="text-white/30 text-sm">Loading...</p>
            ) : !logs || logs.length === 0 ? (
              <p className="text-white/30 text-sm">No toggle activity yet</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {logs.slice(0, 20).map((log) => {
                  const connector = CONNECTORS.find((c) => c.name === log.connectorName);
                  const isEnable = log.action === "enabled";
                  const isKillSwitch = log.triggeredBy === "kill-switch";
                  return (
                    <div
                      key={log.id}
                      className="flex items-center gap-3 text-sm py-1.5 border-b border-white/5 last:border-0"
                      data-testid={`log-entry-${log.id}`}
                    >
                      <span className="text-white/30 text-xs w-28 flex-shrink-0">
                        {formatDate(log.createdAt)}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          isEnable
                            ? "text-green-400 border-green-400/30"
                            : "text-red-400 border-red-400/30"
                        }`}
                      >
                        {log.action}
                      </Badge>
                      <span className="text-white/70">
                        {connector?.label || log.connectorName}
                      </span>
                      {log.previousEnabled && log.newEnabled && (
                        <span className="text-white/20 text-xs">
                          {log.previousEnabled === "true" ? "on" : "off"}
                          {" -> "}
                          {log.newEnabled === "true" ? "on" : "off"}
                        </span>
                      )}
                      {isKillSwitch && (
                        <Badge variant="outline" className="text-xs text-red-300 border-red-300/20">
                          kill-switch
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => {
          if (!open) setConfirmDialog({ open: false, connector: null, newEnabled: false, confirmText: "" });
        }}
      >
        <DialogContent className="bg-[#0f1420] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Disable {confirmDialog.connector?.label}?
            </DialogTitle>
            <DialogDescription className="text-white/50 pt-2">
              {confirmDialog.connector?.tier === "critical" ? (
                <>
                  This is a <span className="text-red-400 font-semibold">critical</span> service.
                  Disabling it will immediately stop{" "}
                  {confirmDialog.connector?.name === "stripe"
                    ? "all payment processing"
                    : confirmDialog.connector?.name === "resend"
                    ? "all outgoing emails"
                    : "CRM synchronization"}
                  . Type <span className="text-white font-mono font-semibold">CONFIRM</span> below
                  to proceed.
                </>
              ) : (
                <>
                  Disabling {confirmDialog.connector?.label} will stop its functionality. You can
                  re-enable it at any time.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {confirmDialog.connector?.tier === "critical" && (
            <Input
              value={confirmDialog.confirmText}
              onChange={(e) =>
                setConfirmDialog((prev) => ({ ...prev, confirmText: e.target.value }))
              }
              placeholder='Type "CONFIRM" to proceed'
              className="bg-white/5 border-white/10 text-white font-mono"
              data-testid="input-confirm-text"
            />
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() =>
                setConfirmDialog({ open: false, connector: null, newEnabled: false, confirmText: "" })
              }
              data-testid="button-cancel-disable"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDisable}
              disabled={
                toggleMutation.isPending ||
                (confirmDialog.connector?.tier === "critical" &&
                  confirmDialog.confirmText !== "CONFIRM")
              }
              data-testid="button-confirm-disable"
            >
              {toggleMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : null}
              Disable {confirmDialog.connector?.label}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={killSwitchDialog.open}
        onOpenChange={(open) => {
          if (!open) setKillSwitchDialog({ open: false, confirmText: "" });
        }}
      >
        <DialogContent className="bg-[#0f1420] border-red-500/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg text-red-400">
              <ShieldOff className="h-5 w-5" />
              Disable ALL Connectors?
            </DialogTitle>
            <DialogDescription className="text-white/50 pt-2">
              This will immediately shut down <span className="text-red-400 font-semibold">all 11 integrations</span> including
              payments (Stripe), emails (Resend), and CRM (Notion). The site will still load but
              no external services will function. Type{" "}
              <span className="text-white font-mono font-semibold">CONFIRM</span> to proceed.
            </DialogDescription>
          </DialogHeader>

          <Input
            value={killSwitchDialog.confirmText}
            onChange={(e) =>
              setKillSwitchDialog((prev) => ({ ...prev, confirmText: e.target.value }))
            }
            placeholder='Type "CONFIRM" to disable everything'
            className="bg-white/5 border-red-500/20 text-white font-mono"
            data-testid="input-kill-switch-confirm"
          />

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setKillSwitchDialog({ open: false, confirmText: "" })}
              data-testid="button-cancel-kill-switch"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleKillSwitch}
              disabled={killSwitchMutation.isPending || killSwitchDialog.confirmText !== "CONFIRM"}
              data-testid="button-confirm-kill-switch"
            >
              {killSwitchMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <ShieldOff className="h-4 w-4 mr-1" />
              )}
              Disable All Connectors
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ConnectorGroup({
  title,
  subtitle,
  connectors,
  statuses,
  onToggle,
  isPending,
}: {
  title: string;
  subtitle: string;
  connectors: ConnectorConfig[];
  statuses: Record<string, ConnectorStatus>;
  onToggle: (connector: ConnectorConfig, enabled: boolean) => void;
  isPending: boolean;
}) {
  return (
    <div>
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
          {title}
        </h2>
        <p className="text-xs text-white/30 mt-0.5">{subtitle}</p>
      </div>
      <div className="space-y-3">
        {connectors.map((connector) => {
          const status = statuses[connector.name];
          const isEnabled = status?.enabled ?? true;
          const Icon = connector.icon;
          const tierCfg = TIER_CONFIG[connector.tier];
          const TierIcon = tierCfg.icon;

          return (
            <Card
              key={connector.name}
              className={`bg-white/5 border-white/10 transition-colors ${
                !isEnabled ? "opacity-60" : ""
              }`}
              data-testid={`card-connector-${connector.name}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${connector.color}15`,
                      border: `1px solid ${connector.color}30`,
                    }}
                  >
                    <Icon className="h-5 w-5" style={{ color: connector.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm">{connector.label}</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${tierCfg.color} border-current/20`}
                      >
                        <TierIcon className="h-3 w-3 mr-1" />
                        {tierCfg.label}
                      </Badge>
                      {getConnectorStatusBadge(status)}
                    </div>
                    <p className="text-xs text-white/40 line-clamp-1">{connector.description}</p>
                  </div>

                  {connector.name === "fathom" && !status?.hasEnvKey ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-400/30 text-purple-400 flex-shrink-0"
                          onClick={() => window.location.href = "/api/admin/auth/fathom"}
                          data-testid="button-connect-fathom"
                        >
                          <Activity className="h-3.5 w-3.5 mr-1.5" />
                          Connect
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-xs">Start Fathom OAuth flow — you'll be redirected to Fathom to authorize access to your analytics data.</TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="flex-shrink-0 cursor-help">
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={(checked) => onToggle(connector, checked)}
                            disabled={isPending}
                            className="data-[state=checked]:!bg-needs"
                            data-testid={`switch-connector-${connector.name}`}
                          />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-xs">
                        {isEnabled
                          ? `${connector.label} is active. Toggle off to disable this integration. ${connector.tier === "critical" ? "Warning: this is a critical service — disabling it requires typed confirmation." : ""}`
                          : `${connector.label} is disabled. Toggle on to re-enable this integration.`}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
