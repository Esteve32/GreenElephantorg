import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, ArrowLeft, Link2, Unlink, CheckCircle2, AlertCircle, HelpCircle, ExternalLink, Send, Linkedin, Shield, Download, Trash2, MapPin, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { SiNotion, SiLinkedin } from "react-icons/si";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { PortalMeResponse, NotionStatusResponse } from "@/lib/portal-types";
import { SCAN_LOCATIONS } from "@/components/portal/ScanLocationCarousel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function GdprDataButtons() {
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const res = await apiRequest("GET", "/api/portal/data-export");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `greenelephant-data-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "Data exported", description: "Your data has been downloaded." });
    } catch (err: unknown) {
      toast({ title: "Export failed", description: err instanceof Error ? err.message : "Could not export.", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  }, [toast]);

  const handleDelete = useCallback(async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      await apiRequest("DELETE", "/api/portal/timeline");
      queryClient.invalidateQueries({ queryKey: ["/api/portal/timeline"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portal/context"] });
      toast({ title: "Data deleted", description: "All your timeline data, preferences, and tool context have been removed." });
      setConfirmDelete(false);
    } catch (err: unknown) {
      toast({ title: "Delete failed", description: err instanceof Error ? err.message : "Could not delete.", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  }, [confirmDelete, toast]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Button
        variant="outline"
        className="text-white/60 border-white/10 justify-start gap-2"
        onClick={handleExport}
        disabled={exporting}
        data-testid="button-gdpr-export"
      >
        {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        Export All My Data
      </Button>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className={`flex-1 justify-start gap-2 ${confirmDelete ? "text-[#e85d75] border-[#e85d75]/40 bg-[#e85d75]/10" : "text-[#e85d75]/70 border-[#e85d75]/20"}`}
          onClick={handleDelete}
          disabled={deleting}
          data-testid="button-gdpr-delete"
        >
          {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          {confirmDelete ? "Confirm Delete" : "Delete All My Data"}
        </Button>
        {confirmDelete && (
          <Button variant="ghost" size="sm" className="text-white/30" onClick={() => setConfirmDelete(false)} data-testid="button-cancel-gdpr-delete">
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}

const TOOL_CONSENT_OPTIONS = [
  { id: "upload", name: "Upload", desc: "Add files and text to timeline" },
  { id: "debrief", name: "Debrief", desc: "AI conversation analysis" },
  { id: "flowcheck", name: "Flow Check", desc: "Communication pulse check" },
  { id: "reflection", name: "Reflection", desc: "Lens-based AI reflection" },
  { id: "export", name: "Export", desc: "Download and share your data" },
  { id: "microhabits", name: "Micro Habits", desc: "AI habit generation" },
  { id: "prepare", name: "Prepare", desc: "AI communication prep" },
];

function ToolConsentToggles() {
  const { toast } = useToast();
  const { data: ctx } = useQuery<Record<string, string>>({
    queryKey: ["/api/portal/context"],
  });
  const enabledToolsRaw = ctx?.enabled_tools;
  const enabledTools = enabledToolsRaw === undefined || enabledToolsRaw === null
    ? TOOL_CONSENT_OPTIONS.map((t) => t.id)
    : enabledToolsRaw === "" ? [] : enabledToolsRaw.split(",");

  const handleToggle = useCallback(async (toolId: string) => {
    const current = new Set(enabledTools);
    if (current.has(toolId)) {
      current.delete(toolId);
    } else {
      current.add(toolId);
    }
    try {
      await apiRequest("POST", "/api/portal/context", {
        key: "enabled_tools",
        value: Array.from(current).join(","),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/portal/context"] });
    } catch (err: unknown) {
      toast({ title: "Failed to update", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    }
  }, [enabledTools, toast]);

  return (
    <div className="pt-3 border-t border-white/5 space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-xs font-medium text-white/70">Tool Consent</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-white/30" type="button"><HelpCircle className="w-3.5 h-3.5" /></button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs text-xs bg-gray-900 border-white/10 text-white/70">
            Control which tools have access to your data. Disabled tools will still appear in the HUD but won't process your data.
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="space-y-1.5">
        {TOOL_CONSENT_OPTIONS.map((tool) => (
          <div key={tool.id} className="flex items-center justify-between gap-3 py-1.5" data-testid={`consent-toggle-${tool.id}`}>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/60">{tool.name}</p>
              <p className="text-xs text-white/25">{tool.desc}</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${enabledTools.includes(tool.id) ? "bg-[#009999]" : "bg-white/10"}`}
                  onClick={() => handleToggle(tool.id)}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${enabledTools.includes(tool.id) ? "left-[1.1rem]" : "left-0.5"}`} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-xs bg-gray-900 border-white/10 text-white/60">
                {enabledTools.includes(tool.id) ? `${tool.name} can access your data` : `${tool.name} data access disabled`}
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  );
}

function DisconnectAllButton() {
  const { toast } = useToast();
  const [confirming, setConfirming] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const handleDisconnect = useCallback(async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setDisconnecting(true);
    try {
      let exportOk = false;
      try {
        const exportRes = await fetch("/api/portal/data-export", { credentials: "include" });
        if (exportRes.ok) {
          const blob = await exportRes.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `greenelephant-data-export-${new Date().toISOString().slice(0, 10)}.json`;
          a.click();
          URL.revokeObjectURL(url);
          exportOk = true;
        }
      } catch {
        exportOk = false;
      }

      const results = await Promise.allSettled([
        apiRequest("POST", "/api/portal/notion/disconnect"),
        apiRequest("POST", "/api/portal/linkedin/disconnect"),
      ]);
      await apiRequest("POST", "/api/portal/context", { key: "enabled_tools", value: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/portal/context"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portal/notion-status"] });
      const disconnectFailures = results.filter((r) => r.status === "rejected");
      const allDisconnected = disconnectFailures.length === 0;

      if (exportOk && allDisconnected) {
        toast({ title: "Data exported & all services disconnected", description: "Your data has been downloaded. Access tokens revoked and all tools disabled." });
      } else if (exportOk && !allDisconnected) {
        toast({ title: "Data exported, partial disconnect", description: `Data downloaded. ${results.length - disconnectFailures.length} of ${results.length} services disconnected.` });
      } else if (!exportOk && allDisconnected) {
        toast({ title: "Services disconnected", description: "All tools disabled but data export failed. Try exporting separately.", variant: "destructive" });
      } else {
        toast({ title: "Partial failure", description: "Data export and some disconnections failed. Try again.", variant: "destructive" });
      }
      setConfirming(false);
    } catch (err: unknown) {
      toast({ title: "Failed", description: err instanceof Error ? err.message : "Could not complete operation.", variant: "destructive" });
    } finally {
      setDisconnecting(false);
    }
  }, [confirming, toast]);

  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        className={`text-xs ${confirming ? "text-[#e85d75] border-[#e85d75]/40 bg-[#e85d75]/10" : "text-[#e85d75]/60 border-[#e85d75]/20"}`}
        onClick={handleDisconnect}
        disabled={disconnecting}
        data-testid="button-disconnect-all"
      >
        {disconnecting ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Unlink className="w-3 h-3 mr-1" />}
        {confirming ? "Confirm: Export & Disconnect All" : "Export Data & Disconnect All"}
      </Button>
      {confirming && (
        <Button variant="ghost" size="sm" className="text-xs text-white/30" onClick={() => setConfirming(false)}>Cancel</Button>
      )}
    </div>
  );
}

function InfoTip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="inline-flex items-center gap-1 text-white/40 hover:text-white/70 transition-colors" type="button">
          <HelpCircle className="w-4 h-4" />
          <span className="text-xs">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs text-sm bg-gray-900 border-white/10 text-white/80">
        {children}
      </TooltipContent>
    </Tooltip>
  );
}

export default function PortalSettingsPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [notionStatus, setNotionStatus] = useState<string | null>(null);
  const [preferredCountry, setPreferredCountry] = useState(() => localStorage.getItem("ge_preferred_country") || "");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const notionParam = params.get("notion");
    if (notionParam === "connected") {
      setNotionStatus("connected");
      toast({ title: "Notion Connected!", description: "Your workspace is now linked to GreenElephant." });
      window.history.replaceState({}, "", "/portal/settings");
    } else if (notionParam === "error") {
      setNotionStatus("error");
      toast({ title: "Connection Failed", description: `Reason: ${params.get("reason") || "unknown"}`, variant: "destructive" });
      window.history.replaceState({}, "", "/portal/settings");
    }
  }, [toast]);

  const { data: me } = useQuery<PortalMeResponse>({ queryKey: ["/api/portal/me"] });

  const { data: notionData, isLoading: notionLoading } = useQuery<NotionStatusResponse>({
    queryKey: ["/api/portal/notion/status"],
    enabled: !!me?.authenticated,
  });

  const disconnectMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/portal/notion/disconnect"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portal/notion/status"] });
      toast({ title: "Disconnected", description: "Notion workspace has been unlinked." });
    },
  });

  const linkedinDisconnectMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/portal/linkedin/disconnect"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portal/me"] });
      toast({ title: "Disconnected", description: "LinkedIn account has been unlinked." });
    },
  });

  const pushScanMutation = useMutation({
    mutationFn: () =>
      apiRequest("POST", "/api/portal/notion/push-scan", {
        title: "My Satellite Scan Results",
        content: "Communication analysis data from GreenElephant Satellite Scan",
        lensData: {
          influence: "Sample analysis data",
          attitude: "Sample analysis data",
          flow: "Sample analysis data",
        },
      }),
    onSuccess: async (res) => {
      const data = await res.json();
      toast({
        title: "Scan Data Pushed!",
        description: data.url ? "Page created in your Notion workspace." : "Data sent to Notion.",
      });
    },
    onError: () => {
      toast({ title: "Push Failed", description: "Could not send data to Notion. Check your connection.", variant: "destructive" });
    },
  });

  if (!me?.authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
          <CardContent className="p-8 text-center">
            <p className="text-white/70 mb-4">Please log in to access settings</p>
            <Button onClick={() => setLocation("/portal/login")} className="bg-[#009999]" data-testid="button-go-login">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isNotionConnected = notionData?.connected;

  return (
    <PortalLayout>
    <div className="min-h-screen bg-gradient-to-b from-transparent via-[#040410]/50 to-transparent">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" className="text-white/60" onClick={() => setLocation("/portal")} data-testid="button-back-portal">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
              Portal Settings
            </h1>
            <p className="text-sm text-white/50">Manage your integrations and preferences</p>
          </div>
        </div>

        <Card className="bg-black/40 border-white/10 backdrop-blur-md mb-6">
          <CardHeader className="flex flex-row items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <SiNotion className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">Notion Workspace</CardTitle>
                <p className="text-sm text-white/50 mt-0.5">Connect your Notion to receive scan data</p>
              </div>
            </div>
            <Badge className={isNotionConnected ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-white/10 text-white/50 border-white/10"}>
              {isNotionConnected ? (
                <><CheckCircle2 className="w-3 h-3 mr-1" /> Connected</>
              ) : (
                <><AlertCircle className="w-3 h-3 mr-1" /> Not Connected</>
              )}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#009999]/20 text-[#009999] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <div>
                  <p className="text-sm text-white/80 font-medium">What does this do?</p>
                  <p className="text-sm text-white/50 mt-1">
                    Links your personal Notion workspace to GreenElephant. Your Satellite Scan results, coaching insights, and communication roadmaps get pushed directly into Notion pages you can use with your team.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#009999]/20 text-[#009999] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <div>
                  <p className="text-sm text-white/80 font-medium">How to connect</p>
                  <p className="text-sm text-white/50 mt-1">
                    Click "Connect Notion" below. You'll be taken to Notion to approve access. Pick which pages GreenElephant can write to, then you're done. Takes about 30 seconds.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#009999]/20 text-[#009999] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                <div>
                  <p className="text-sm text-white/80 font-medium">What gets shared?</p>
                  <p className="text-sm text-white/50 mt-1">
                    Only data you explicitly push — scan results, prompts, and roadmaps. We never read your existing Notion content. You can disconnect anytime.
                  </p>
                </div>
              </div>
            </div>

            {isNotionConnected ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-white/80">
                      Connected to: <strong className="text-white">{notionData?.workspaceName || "Your Workspace"}</strong>
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-red-400/80"
                    onClick={() => disconnectMutation.mutate()}
                    disabled={disconnectMutation.isPending}
                    data-testid="button-notion-disconnect"
                  >
                    <Unlink className="w-4 h-4 mr-1" />
                    {disconnectMutation.isPending ? "Disconnecting..." : "Disconnect"}
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-white/80">Push Data to Notion</h3>
                    <InfoTip label="How?">
                      <p>Click the button to create a new page in your Notion workspace with your latest scan data. You can then share this page with your team or use it as input for AI agents.</p>
                    </InfoTip>
                  </div>
                  <Button
                    className="bg-[#009999] text-white"
                    onClick={() => pushScanMutation.mutate()}
                    disabled={pushScanMutation.isPending}
                    data-testid="button-notion-push-scan"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {pushScanMutation.isPending ? "Sending..." : "Push Scan Data to Notion"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  className="bg-white text-gray-900"
                  onClick={() => { window.location.href = "/api/portal/notion/connect"; }}
                  disabled={notionLoading}
                  data-testid="button-notion-connect"
                >
                  <SiNotion className="w-4 h-4 mr-2" />
                  Connect Notion Workspace
                </Button>
                <p className="text-xs text-white/40">
                  You'll be redirected to Notion to grant permission. No existing data is read.
                </p>
              </div>
            )}

            {notionStatus === "error" && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-300">
                Connection failed. Please try again or contact support at{" "}
                <a href="mailto:esteve@greenelephant.org" className="underline">esteve@greenelephant.org</a>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10 backdrop-blur-md mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <Settings className="w-5 h-5 text-white/60" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">Account</CardTitle>
                <p className="text-sm text-white/50 mt-0.5">Your portal account details</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-white/40 mb-1">Email</p>
                <p className="text-sm text-white/80">{me?.user?.email || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">Name</p>
                <p className="text-sm text-white/80">{me?.user?.name || "—"}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-white/5">
              <p className="text-xs text-white/40 mb-1">Subscription</p>
              <p className="text-sm text-white/70">{me?.subscription ? `${me.subscription.plan} — ${me.subscription.status}` : "No active subscription"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10 backdrop-blur-md mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#009999]" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">Login Scene Preference</CardTitle>
                <p className="text-sm text-white/50 mt-0.5">Choose which European scan location greets you at login</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Select
                value={preferredCountry}
                onValueChange={(val) => {
                  setPreferredCountry(val);
                  if (val) {
                    localStorage.setItem("ge_preferred_country", val);
                  } else {
                    localStorage.removeItem("ge_preferred_country");
                  }
                  toast({ title: "Login scene updated", description: `Your login page will start from ${SCAN_LOCATIONS.find(l => l.id === val)?.country || "the default"}.` });
                }}
              >
                <SelectTrigger className="bg-white/5 border-white/15 text-white/80" data-testid="select-preferred-country">
                  <SelectValue placeholder="Auto-rotate (default)" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  {SCAN_LOCATIONS.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id} className="text-white/80 focus:bg-white/10 focus:text-white" data-testid={`option-country-${loc.id}`}>
                      {loc.country} — {loc.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-white/30">
                When set, your login page carousel will start from this scene. Leave unset for automatic rotation.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10 backdrop-blur-md mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-white/60" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">Connected Services</CardTitle>
                <p className="text-sm text-white/50 mt-0.5">Manage your linked third-party accounts</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {me?.user?.hasLinkedIn && (
              <div className="flex items-center justify-between flex-wrap gap-2 p-3 rounded-lg bg-[#0A66C2]/5 border border-[#0A66C2]/20">
                <div className="flex items-center gap-2">
                  <SiLinkedin className="w-4 h-4 text-[#0A66C2]" />
                  <span className="text-sm text-white/80">LinkedIn — Connected</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400/80"
                  onClick={() => linkedinDisconnectMutation.mutate()}
                  disabled={linkedinDisconnectMutation.isPending}
                  data-testid="button-linkedin-disconnect"
                >
                  <Unlink className="w-3.5 h-3.5 mr-1" />
                  {linkedinDisconnectMutation.isPending ? "Disconnecting..." : "Disconnect"}
                </Button>
              </div>
            )}
            {me?.user?.hasGoogle && (
              <div className="flex items-center justify-between flex-wrap gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white/80">Google — Connected</span>
                </div>
              </div>
            )}
            {!me?.user?.hasLinkedIn && !me?.user?.hasGoogle && (
              <p className="text-sm text-white/50">No third-party accounts connected. You can link Google or LinkedIn from the login page.</p>
            )}
            <p className="text-xs text-white/40">
              Disconnecting a service removes stored access tokens immediately. You can reconnect at any time from the login page.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10 backdrop-blur-md mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white/60" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">Data & Privacy (GDPR)</CardTitle>
                <p className="text-sm text-white/50 mt-0.5">Control your personal data — export or delete anytime</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-[#009999] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-white/80 font-medium">Your rights under GDPR</p>
                  <p className="text-sm text-white/50 mt-1">
                    You have the right to access, export, and delete all personal data we hold about you.
                    Your data is never used for AI training. We store only what you explicitly provide.
                  </p>
                </div>
              </div>
            </div>

            <GdprDataButtons />

            <ToolConsentToggles />

            <div className="pt-3 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs font-medium text-white/70">Disconnect All Services</p>
                  <p className="text-xs text-white/30">Revoke all connected service access tokens immediately</p>
                </div>
                <DisconnectAllButton />
              </div>
            </div>

            <div className="pt-3 border-t border-white/5">
              <Button
                variant="outline"
                className="text-white/50 border-white/10 justify-start gap-2"
                onClick={async () => {
                  try {
                    await apiRequest("POST", "/api/portal/context", { key: "onboarding_complete", value: "" });
                    queryClient.invalidateQueries({ queryKey: ["/api/portal/context"] });
                    window.location.href = "/portal";
                  } catch (err: unknown) {
                    console.error("Reset tour error:", err instanceof Error ? err.message : "Unknown");
                  }
                }}
                data-testid="button-replay-tour"
              >
                <Sparkles className="w-4 h-4" />
                Replay Guided Tour
              </Button>
            </div>

            <p className="text-xs text-white/30 leading-relaxed">
              Export creates a downloadable file with all server-side data. Delete permanently removes all timeline events and tool context stored on our servers. Browser-stored preferences (e.g. location) are managed locally and can be cleared via your browser settings.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <ExternalLink className="w-5 h-5 text-white/60" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">Use Your Data with AI Agents</CardTitle>
                <p className="text-sm text-white/50 mt-0.5">Tips for getting the most from your scan data</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-start gap-3">
                <Badge className="bg-[#009999]/20 text-[#009999] border-[#009999]/30 shrink-0">Tip</Badge>
                <p className="text-sm text-white/60">
                  Once your scan data is in Notion, you can use AI agents (like ChatGPT, Claude, or custom GPTs) to analyze patterns, create team workshops, or build personal development plans. Just share the Notion page link with your AI tool.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-[#cc9933]/20 text-[#cc9933] border-[#cc9933]/30 shrink-0">Pro</Badge>
                <p className="text-sm text-white/60">
                  Try our Prompting Playground to generate ready-made development roadmaps, value-rules, and micro-habits based on your communication profile.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </PortalLayout>
  );
}
