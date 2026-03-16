import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AdminTooltip } from "@/components/AdminTooltip";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  CreditCard,
  ExternalLink,
  HelpCircle,
  Globe,
  Users,
  Zap,
  ShoppingCart,
  Eye,
  ToggleLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Repeat,
  DollarSign,
  Rocket,
  Shield,
  Laptop,
  Database,
  Calendar,
  Plus,
  Trash2,
  FileText,
  Loader2,
  AlertTriangle,
  Pencil,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import adminHeroBg from "@assets/generated_images/earth_orbit_aurora_view.png";

interface SaaSSettings {
  saasEnabled: boolean;
  subscriptionPriceMonthly: number;
  scanOneTimePrice: number;
  coachingJourneyPrice: number;
  subscriptionFeatures: string[];
  oneTimeScanFeatures: string[];
  coachingJourneyFeatures: string[];
}

const DEFAULT_SETTINGS: SaaSSettings = {
  saasEnabled: false,
  subscriptionPriceMonthly: 9.95,
  scanOneTimePrice: 99.95,
  coachingJourneyPrice: 2980,
  subscriptionFeatures: [
    "Unlimited Satellite Scans",
    "Prompting Playground",
    "Personal development data dashboard",
    "Calendar event & micro-habit suggestions",
    "Data export to Notion, Google Calendar",
    "Growth tracking over time",
  ],
  oneTimeScanFeatures: [
    "1 Satellite Scan (129 questions)",
    "Personalized dashboard within 48-72h",
    "Access to public Prompt Library",
    "No portal access",
  ],
  coachingJourneyFeatures: [
    "Everything in Subscription",
    "6 months 1:1 coaching sessions",
    "Lifetime portal access (no monthly fee)",
    "Priority dashboard delivery",
    "Direct coach communication channel",
  ],
};

const FEATURE_CHAR_LIMIT = 120;

const AFFECTED_AREAS = [
  { area: "Checkout Page", description: "Feature bullet lists shown during purchase flow" },
  { area: "Scan Landing Page", description: "CTA sections referencing scan/subscription benefits" },
  { area: "Portal Login/Welcome", description: "Welcome content shown after login" },
  { area: "Transactional Emails", description: "Purchase confirmation and follow-up emails listing features" },
  { area: "Terms & Conditions", description: "Product descriptions referenced in legal copy (manual review)" },
];

const PATHWAY_DESCRIPTIONS = [
  {
    id: "coach-pro",
    title: "Coach / Pro",
    subtitle: "For coaches and consultants using the Satellite Scan with their clients",
    icon: Users,
    color: "text-influence",
    bgColor: "bg-influence/10 border-influence/20",
    features: [
      "Multi-client scanning & dashboard management",
      "White-label dashboard delivery",
      "Coaching session notes linked to scan data",
      "Client progress tracking over time",
      "Bulk scan pricing for client cohorts",
    ],
    priceNote: "Future tier: ~€29.95/month per coach seat",
  },
  {
    id: "ea-va-leader",
    title: "EA / VA / Leader",
    subtitle: "Elite self-development data-as-a-service with a playground to grow",
    icon: Rocket,
    color: "text-chaordic",
    bgColor: "bg-chaordic/10 border-chaordic/20",
    features: [
      "Unlimited personal scans for continuous growth tracking",
      "Prompting Playground with AI-powered conversation tools",
      "Quarterly progress reports for performance reviews",
      "Growth data to share with managers or clients",
      "Micro-habit calendar integration",
    ],
    priceNote: "Current tier: €9.95/month",
  },
  {
    id: "data-api",
    title: "Data Export / API",
    subtitle: "Push and pull personal development data to your entire tech stack",
    icon: Database,
    color: "text-alignment",
    bgColor: "bg-alignment/10 border-alignment/20",
    features: [
      "API access for scan data, calendar events, micro-habits",
      "Push to Notion databases automatically",
      "Google Calendar integration for coaching reminders",
      "Webhook notifications for scan completions",
      "Export scan history as CSV/JSON",
    ],
    priceNote: "Included in subscription (€9.95/month)",
  },
];

export default function SaaSSettingsAdmin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSaasToggleConfirm, setShowSaasToggleConfirm] = useState(false);
  const [pendingSaasState, setPendingSaasState] = useState<boolean | null>(null);

  const { data: settings, isLoading } = useQuery<SaaSSettings>({
    queryKey: ['/api/admin/saas-settings'],
  });

  const [localSettings, setLocalSettings] = useState<SaaSSettings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settings) {
      setLocalSettings({
        ...DEFAULT_SETTINGS,
        ...settings,
        coachingJourneyFeatures: settings.coachingJourneyFeatures || DEFAULT_SETTINGS.coachingJourneyFeatures,
      });
      setHasChanges(false);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (newSettings: SaaSSettings) => {
      return apiRequest("POST", "/api/admin/saas-settings", newSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/saas-settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/portal/settings/public'] });
      setHasChanges(false);
      setShowConfirm(false);
      toast({ title: "Settings saved", description: "SaaS settings updated. Changes are live immediately — no republish needed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    },
  });

  const updateSetting = <K extends keyof SaaSSettings>(key: K, value: SaaSSettings[K]) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateFeature = (tier: 'subscriptionFeatures' | 'oneTimeScanFeatures' | 'coachingJourneyFeatures', index: number, value: string) => {
    const limited = value.slice(0, FEATURE_CHAR_LIMIT);
    const updated = [...localSettings[tier]];
    updated[index] = limited;
    updateSetting(tier, updated);
  };

  const addFeature = (tier: 'subscriptionFeatures' | 'oneTimeScanFeatures' | 'coachingJourneyFeatures') => {
    updateSetting(tier, [...localSettings[tier], ""]);
  };

  const removeFeature = (tier: 'subscriptionFeatures' | 'oneTimeScanFeatures' | 'coachingJourneyFeatures', index: number) => {
    const updated = localSettings[tier].filter((_, i) => i !== index);
    updateSetting(tier, updated);
  };

  const moveFeature = (tier: 'subscriptionFeatures' | 'oneTimeScanFeatures' | 'coachingJourneyFeatures', index: number, direction: 'up' | 'down') => {
    const updated = [...localSettings[tier]];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= updated.length) return;
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updateSetting(tier, updated);
  };

  const revertChanges = () => {
    if (settings) {
      setLocalSettings({
        ...DEFAULT_SETTINGS,
        ...settings,
        coachingJourneyFeatures: settings.coachingJourneyFeatures || DEFAULT_SETTINGS.coachingJourneyFeatures,
      });
      setHasChanges(false);
      toast({ title: "Reverted", description: "All unsaved changes have been undone." });
    }
  };

  const getFeatureChanges = () => {
    if (!settings) return [];
    const changes: { tier: string; type: string; oldValue?: string; newValue?: string }[] = [];
    const tiers: { key: keyof SaaSSettings; label: string }[] = [
      { key: 'oneTimeScanFeatures', label: 'One-Time Scan' },
      { key: 'subscriptionFeatures', label: 'Subscription' },
      { key: 'coachingJourneyFeatures', label: 'Coaching Journey' },
    ];
    for (const tier of tiers) {
      const oldFeatures = (settings[tier.key] as string[]) || [];
      const newFeatures = (localSettings[tier.key] as string[]) || [];
      const maxLen = Math.max(oldFeatures.length, newFeatures.length);
      for (let i = 0; i < maxLen; i++) {
        const oldF = oldFeatures[i];
        const newF = newFeatures[i];
        if (oldF !== newF) {
          if (!oldF) changes.push({ tier: tier.label, type: 'added', newValue: newF });
          else if (!newF) changes.push({ tier: tier.label, type: 'removed', oldValue: oldF });
          else changes.push({ tier: tier.label, type: 'changed', oldValue: oldF, newValue: newF });
        }
      }
    }
    return changes;
  };

  const hasFeatureChanges = getFeatureChanges().length > 0;

  const currentMRR = localSettings.subscriptionPriceMonthly;
  const projectedARR = currentMRR * 12;

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.06]"
          style={{ backgroundImage: `url(${adminHeroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLocation("/admin/submissions")}
                  data-testid="button-back-admin"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Back to Admin Hub</TooltipContent>
            </Tooltip>
            <div>
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-flow" />
                <h1 className="text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Scan-as-a-Service (SaaS)
                </h1>
                <Badge className="bg-flow/20 text-flow border-flow/30 text-xs">
                  Purchase
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1 ml-9">
                Subscription model, pricing tiers, and portal access controls
              </p>
            </div>
          </div>

          {hasChanges && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={revertChanges}
                className="gap-1.5 text-sm"
                data-testid="button-revert-changes"
              >
                <XCircle className="h-4 w-4" />
                Undo Changes
              </Button>
              <Button
                onClick={() => hasFeatureChanges ? setShowPreview(true) : saveMutation.mutate(localSettings)}
                disabled={saveMutation.isPending}
                className="gap-1.5 bg-flow hover:bg-flow/90"
                data-testid="button-save-saas"
              >
                <CheckCircle2 className="h-4 w-4" />
                {saveMutation.isPending ? "Saving..." : hasFeatureChanges ? "Preview & Apply" : "Save & Apply"}
              </Button>
            </div>
          )}
        </div>

        <Card className="backdrop-blur-sm bg-card/50 border-white/10 mb-8">
            <CardContent className="pt-6 pb-6 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${localSettings.saasEnabled ? "bg-flow/20" : "bg-white/5"}`}>
                    <ToggleLeft className={`h-6 w-6 ${localSettings.saasEnabled ? "text-flow" : "text-white/30"}`} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">SaaS Mode
                      <AdminTooltip what="Master toggle for Scan-as-a-Service mode. When ON, the site offers a monthly subscription alongside the one-time scan. When OFF, only the one-time €99.95 scan is available." how="Toggle this ON to enable the subscription model. Changes take effect immediately on the live site without republishing. Toggle OFF to revert to one-time scan only." />
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {localSettings.saasEnabled
                        ? "Subscription model is ACTIVE. Users can subscribe for portal access with unlimited scans."
                        : "Subscription model is OFF. Only one-time Satellite Scan (€99.95) is available."}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={localSettings.saasEnabled}
                  onCheckedChange={(checked) => {
                    setPendingSaasState(checked);
                    setShowSaasToggleConfirm(true);
                  }}
                  className="data-[state=checked]:!bg-flow scale-110"
                  data-testid="switch-saas-enabled"
                />
              </div>

              {localSettings.saasEnabled && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">What changes when SaaS is ON:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 rounded-md bg-white/[0.02] border border-white/5">
                      <Globe className="h-5 w-5 text-flow shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Header Scan Button</p>
                        <p className="text-xs text-muted-foreground">If logged in: "Take the Scan" (direct). If not: "Login" which leads to webshop if no account.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-md bg-white/[0.02] border border-white/5">
                      <ShoppingCart className="h-5 w-5 text-flow shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Checkout Page</p>
                        <p className="text-xs text-muted-foreground">Shows subscription option (€{localSettings.subscriptionPriceMonthly}/mo) alongside one-time scan (€{localSettings.scanOneTimePrice}).</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-md bg-white/[0.02] border border-white/5">
                      <Laptop className="h-5 w-5 text-flow shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Portal Access</p>
                        <p className="text-xs text-muted-foreground">Subscribers get full portal: Playground, data dashboard, unlimited scans, calendar integration.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-md bg-white/[0.02] border border-white/5">
                      <Shield className="h-5 w-5 text-flow shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">One-Time Scan</p>
                        <p className="text-xs text-muted-foreground">Still available at €{localSettings.scanOneTimePrice}. Gets 1 scan + dashboard. No portal access.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardContent className="pt-5 pb-4 px-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">One-Time Scan
                    <AdminTooltip what="One-time Satellite Scan purchase. Customer gets 1 scan, dashboard delivered within 48-72h, and access to the public Prompt Library. No portal access." how="This is the entry-level product. Best for people who want a baseline assessment without committing to a subscription." />
                  </span>
                  <Eye className="h-5 w-5 text-flow/60" />
                </div>
                <div className="text-3xl font-bold text-flow mb-1" data-testid="text-scan-price">
                  €{localSettings.scanOneTimePrice}
                </div>
                <p className="text-xs text-muted-foreground mb-3">Single purchase, no recurring</p>
                <div className="space-y-1.5 border-t border-white/10 pt-2">
                  {localSettings.oneTimeScanFeatures.map(f => (
                    <div key={f} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="h-3 w-3 text-flow/60 mt-0.5 shrink-0" />
                      <span className="text-white/60">{f}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={`backdrop-blur-sm border-white/10 ${localSettings.saasEnabled ? "bg-flow/10 border-flow/20" : "bg-card/50"}`}>
              <CardContent className="pt-5 pb-4 px-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Subscription
                    <AdminTooltip what="Monthly subscription giving full portal access, unlimited scans, the Prompting Playground, data export, and calendar integrations. This is the recurring revenue engine." how="Subscribers log in and use the portal freely. Their data builds over time, making it stickier. Cancel anytime. MRR = subscribers x price." />
                  </span>
                  <div className="flex items-center gap-1">
                    <Repeat className="h-4 w-4 text-flow/60" />
                    {localSettings.saasEnabled ? (
                      <Badge className="bg-flow/20 text-flow border-flow/30 text-xs">ACTIVE</Badge>
                    ) : (
                      <Badge className="bg-white/10 text-white/40 border-white/10 text-xs">OFF</Badge>
                    )}
                  </div>
                </div>
                <div className="text-3xl font-bold text-flow mb-1" data-testid="text-subscription-price">
                  €{localSettings.subscriptionPriceMonthly}<span className="text-lg text-white/40">/mo</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Monthly, cancel anytime</p>
                <div className="space-y-1.5 border-t border-white/10 pt-2">
                  {localSettings.subscriptionFeatures.map(f => (
                    <div key={f} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="h-3 w-3 text-flow/60 mt-0.5 shrink-0" />
                      <span className="text-white/60">{f}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardContent className="pt-5 pb-4 px-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Coaching Journey
                    <AdminTooltip what="The full Coaching Journey includes lifetime portal access + unlimited scans + 6 months of 1:1 coaching. This is the premium offer." how="Lifetime access means the customer never pays the subscription fee. Their portal access is permanent after the coaching package." />
                  </span>
                  <Zap className="h-5 w-5 text-flow/60" />
                </div>
                <div className="text-3xl font-bold text-flow mb-1" data-testid="text-journey-price">
                  €{localSettings.coachingJourneyPrice.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mb-3">One-time, lifetime portal access</p>
                <div className="space-y-1.5 border-t border-white/10 pt-2">
                  {localSettings.coachingJourneyFeatures.map(f => (
                    <div key={f} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="h-3 w-3 text-flow/60 mt-0.5 shrink-0" />
                      <span className="text-white/60">{f}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
        </div>

        <Card className="backdrop-blur-sm bg-card/50 border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Pencil className="h-5 w-5 text-flow" />
              Value Proposition Editor
              <AdminTooltip
                what="Edit the feature/benefit lists shown to customers on the checkout page, scan page, and in emails. Each feature has a 120-character limit."
                how="Edit features inline, add or remove bullets, then click 'Preview Changes' to see exactly what will change across the site before confirming."
              />
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Changes propagate to: checkout page, scan page CTAs, portal welcome, and transactional emails.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {([
              { key: 'oneTimeScanFeatures' as const, label: 'One-Time Scan Features', icon: Eye, color: 'text-flow' },
              { key: 'subscriptionFeatures' as const, label: 'Subscription Features', icon: Repeat, color: 'text-flow' },
              { key: 'coachingJourneyFeatures' as const, label: 'Coaching Journey Features', icon: Zap, color: 'text-flow' },
            ]).map(tier => (
              <div key={tier.key} className="space-y-3">
                <div className="flex items-center gap-2">
                  <tier.icon className={`h-4 w-4 ${tier.color}`} />
                  <h3 className="text-sm font-semibold">{tier.label}</h3>
                  <Badge className="bg-white/10 text-white/50 border-white/10 text-xs">
                    {localSettings[tier.key].length} items
                  </Badge>
                </div>
                <div className="space-y-2">
                  {localSettings[tier.key].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 shrink-0 text-muted-foreground"
                              onClick={() => moveFeature(tier.key, idx, 'up')}
                              disabled={idx === 0}
                              data-testid={`button-move-up-${tier.key}-${idx}`}
                            >
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Move up</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 shrink-0 text-muted-foreground"
                              onClick={() => moveFeature(tier.key, idx, 'down')}
                              disabled={idx === localSettings[tier.key].length - 1}
                              data-testid={`button-move-down-${tier.key}-${idx}`}
                            >
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Move down</TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="flex-1 relative">
                        <Input
                          value={feature}
                          onChange={(e) => updateFeature(tier.key, idx, e.target.value)}
                          className="bg-white/5 text-sm pr-14"
                          placeholder="Feature description..."
                          maxLength={FEATURE_CHAR_LIMIT}
                          data-testid={`input-feature-${tier.key}-${idx}`}
                        />
                        <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs ${feature.length >= FEATURE_CHAR_LIMIT ? 'text-red-400' : 'text-muted-foreground'}`}>
                          {feature.length}/{FEATURE_CHAR_LIMIT}
                        </span>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFeature(tier.key, idx)}
                            className="shrink-0 text-muted-foreground"
                            data-testid={`button-remove-feature-${tier.key}-${idx}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Remove this feature</TooltipContent>
                      </Tooltip>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addFeature(tier.key)}
                    className="gap-1.5 text-xs text-muted-foreground"
                    data-testid={`button-add-feature-${tier.key}`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Feature
                  </Button>
                </div>
              </div>
            ))}

            {hasFeatureChanges && (
              <div className="pt-4 border-t border-white/10 flex items-center gap-3 flex-wrap">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setShowPreview(true)}
                      className="gap-1.5"
                      data-testid="button-preview-changes"
                    >
                      <FileText className="h-4 w-4" />
                      Preview Changes
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>See what will change across the site</TooltipContent>
                </Tooltip>
                <span className="text-xs text-muted-foreground">
                  {getFeatureChanges().length} feature change{getFeatureChanges().length !== 1 ? 's' : ''} pending
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" data-testid="modal-preview-changes">
            <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto bg-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-5 w-5 text-flow" />
                  Preview: Value Prop Changes
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Review what will change across the site before confirming.
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  <h4 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Feature Changes</h4>
                  {getFeatureChanges().length === 0 ? (
                    <p className="text-sm text-muted-foreground">No feature changes detected.</p>
                  ) : (
                    getFeatureChanges().map((change, i) => (
                      <div key={i} className="p-3 rounded-md bg-white/[0.02] border border-white/5 text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${change.type === 'added' ? 'bg-green-500/20 text-green-400 border-green-500/30' : change.type === 'removed' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                            {change.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{change.tier}</span>
                        </div>
                        {change.oldValue && (
                          <p className="text-xs text-red-400/70 line-through">{change.oldValue}</p>
                        )}
                        {change.newValue && (
                          <p className="text-xs text-green-400/70">{change.newValue}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Surface Previews</h4>
                  {(() => {
                    const surfaces = [
                      {
                        area: "Checkout Page",
                        description: "Feature bullet lists during purchase flow",
                        tiers: ['oneTimeScanFeatures', 'subscriptionFeatures', 'coachingJourneyFeatures'] as const,
                        auto: true,
                      },
                      {
                        area: "Scan Landing Page",
                        description: "CTA feature section on /scan",
                        tiers: ['oneTimeScanFeatures'] as const,
                        auto: true,
                      },
                      {
                        area: "Portal Login/Welcome",
                        description: "Subscription features on /portal/login and dashboard",
                        tiers: ['subscriptionFeatures'] as const,
                        auto: true,
                      },
                      {
                        area: "Transactional Emails",
                        description: "Feature lists in purchase confirmation emails",
                        tiers: [] as const,
                        auto: false,
                      },
                      {
                        area: "Terms & Conditions",
                        description: "Product descriptions in legal copy",
                        tiers: [] as const,
                        auto: false,
                      },
                    ];
                    return surfaces.map(surface => {
                      const changedTiers = surface.tiers.filter(t => {
                        const old = (settings?.[t] as string[]) || [];
                        const curr = (localSettings[t] as string[]) || [];
                        return JSON.stringify(old) !== JSON.stringify(curr);
                      });
                      const hasChanges = changedTiers.length > 0;
                      return (
                        <div key={surface.area} className="p-3 rounded-md bg-white/[0.02] border border-white/5 space-y-2">
                          <div className="flex items-center gap-2">
                            {surface.auto ? (
                              <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ${hasChanges ? 'text-green-400' : 'text-muted-foreground'}`} />
                            ) : (
                              <AlertTriangle className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
                            )}
                            <p className="text-xs font-medium">{surface.area}</p>
                            {surface.auto && hasChanges && (
                              <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30">auto-updated</Badge>
                            )}
                            {!surface.auto && (
                              <Badge className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">manual review</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{surface.description}</p>
                          {hasChanges && changedTiers.map(t => {
                            const tierLabel = t === 'oneTimeScanFeatures' ? 'Scan' : t === 'subscriptionFeatures' ? 'Subscription' : 'Coaching';
                            const oldList = (settings?.[t] as string[]) || [];
                            const newList = (localSettings[t] as string[]) || [];
                            return (
                              <div key={t} className="ml-5 space-y-1">
                                <p className="text-xs text-muted-foreground font-medium">{tierLabel}:</p>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-0.5">
                                    <p className="text-xs text-red-400/60 uppercase">Before</p>
                                    {oldList.map((f, i) => (
                                      <p key={i} className="text-xs text-red-400/50 truncate">{f}</p>
                                    ))}
                                    {oldList.length === 0 && <p className="text-xs text-muted-foreground italic">defaults</p>}
                                  </div>
                                  <div className="space-y-0.5">
                                    <p className="text-xs text-green-400/60 uppercase">After</p>
                                    {newList.map((f, i) => (
                                      <p key={i} className="text-xs text-green-400/50 truncate">{f}</p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    });
                  })()}
                </div>

                <div className="flex items-center gap-2 pt-2 flex-wrap">
                  <Button
                    onClick={() => { setShowPreview(false); setShowConfirm(true); }}
                    className="gap-1.5 bg-flow"
                    data-testid="button-proceed-to-confirm"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Proceed to Confirm
                  </Button>
                  <Button variant="ghost" onClick={() => setShowPreview(false)} data-testid="button-close-preview">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" data-testid="modal-confirm-apply">
            <Card className="max-w-md w-full bg-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  Confirm & Apply Changes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You are about to update {getFeatureChanges().length} feature{getFeatureChanges().length !== 1 ? 's' : ''} across the live site.
                  This takes effect immediately — no republish needed.
                </p>
                <div className="p-3 rounded-md bg-yellow-500/5 border border-yellow-500/20">
                  <p className="text-xs text-yellow-400">
                    Changes will appear on: checkout page, scan page CTAs, and portal welcome.
                    Email templates and T&C may need manual review.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    onClick={() => saveMutation.mutate(localSettings)}
                    disabled={saveMutation.isPending}
                    className="gap-1.5 bg-flow"
                    data-testid="button-confirm-apply"
                  >
                    {saveMutation.isPending ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                    ) : (
                      <><CheckCircle2 className="h-4 w-4" /> Confirm & Apply</>
                    )}
                  </Button>
                  <Button variant="ghost" onClick={() => setShowConfirm(false)} data-testid="button-cancel-confirm">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showSaasToggleConfirm && pendingSaasState !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" data-testid="modal-saas-toggle-confirm">
            <Card className="max-w-lg w-full bg-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  {pendingSaasState ? (
                    <><Rocket className="h-5 w-5 text-flow" /> Activate SaaS Subscription Mode</>
                  ) : (
                    <><AlertTriangle className="h-5 w-5 text-yellow-400" /> Deactivate SaaS Subscription Mode</>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingSaasState ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      You are about to enable the subscription model. This changes how the site works for all visitors.
                    </p>
                    <div className="space-y-2">
                      <div className="p-3 rounded-md bg-flow/5 border border-flow/20">
                        <p className="text-xs font-semibold text-flow mb-1.5">What turns ON:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li className="flex items-start gap-1.5"><CheckCircle2 className="h-3 w-3 text-flow shrink-0 mt-0.5" /> Monthly subscription option (€{localSettings.subscriptionPriceMonthly}/mo) appears on checkout</li>
                          <li className="flex items-start gap-1.5"><CheckCircle2 className="h-3 w-3 text-flow shrink-0 mt-0.5" /> Portal access unlocks for subscribers (Playground, Dashboard, unlimited scans)</li>
                          <li className="flex items-start gap-1.5"><CheckCircle2 className="h-3 w-3 text-flow shrink-0 mt-0.5" /> Header CTA changes: logged-in users see "Take the Scan", others see "Log in"</li>
                          <li className="flex items-start gap-1.5"><CheckCircle2 className="h-3 w-3 text-flow shrink-0 mt-0.5" /> Coaching Journey tier (€{localSettings.coachingJourneyPrice}) becomes visible</li>
                        </ul>
                      </div>
                      <div className="p-3 rounded-md bg-white/[0.02] border border-white/10">
                        <p className="text-xs font-semibold text-white/70 mb-1.5">Still available:</p>
                        <p className="text-xs text-muted-foreground">One-time Satellite Scan (€{localSettings.scanOneTimePrice}) remains as an option alongside subscriptions.</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-md bg-blue-500/5 border border-blue-500/20">
                      <p className="text-xs text-blue-400">
                        <strong>Note:</strong> Changes take effect after you click "Save & Apply" on the main settings. This toggle stages the change — it does not go live until saved.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      You are about to disable the subscription model and revert to one-time purchase only.
                    </p>
                    <div className="space-y-2">
                      <div className="p-3 rounded-md bg-red-500/5 border border-red-500/20">
                        <p className="text-xs font-semibold text-red-400 mb-1.5">Impact on existing subscribers:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li className="flex items-start gap-1.5"><AlertTriangle className="h-3 w-3 text-yellow-400 shrink-0 mt-0.5" /> Active Stripe subscriptions will NOT be automatically cancelled — manage them in Stripe Dashboard</li>
                          <li className="flex items-start gap-1.5"><AlertTriangle className="h-3 w-3 text-yellow-400 shrink-0 mt-0.5" /> Portal access for existing subscribers continues until their subscription expires or is manually cancelled</li>
                          <li className="flex items-start gap-1.5"><XCircle className="h-3 w-3 text-red-400 shrink-0 mt-0.5" /> New visitors will only see the one-time scan option (€{localSettings.scanOneTimePrice})</li>
                        </ul>
                      </div>
                      <div className="p-3 rounded-md bg-white/[0.02] border border-white/10">
                        <p className="text-xs font-semibold text-white/70 mb-1.5">What changes:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li className="flex items-start gap-1.5"><XCircle className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" /> Subscription option removed from checkout</li>
                          <li className="flex items-start gap-1.5"><XCircle className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" /> Coaching Journey tier hidden from new visitors</li>
                          <li className="flex items-start gap-1.5"><XCircle className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" /> Header CTA reverts to "Take the Scan — €{localSettings.scanOneTimePrice}"</li>
                        </ul>
                      </div>
                    </div>
                    <div className="p-3 rounded-md bg-yellow-500/5 border border-yellow-500/20">
                      <p className="text-xs text-yellow-400">
                        <strong>Recommended:</strong> Before turning OFF, review active subscriptions in Stripe and communicate changes to affected customers.
                      </p>
                    </div>
                  </>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    onClick={() => {
                      updateSetting("saasEnabled", pendingSaasState);
                      setShowSaasToggleConfirm(false);
                      setPendingSaasState(null);
                      toast({
                        title: pendingSaasState ? "SaaS mode staged ON" : "SaaS mode staged OFF",
                        description: "Click 'Save & Apply' to make this change live.",
                      });
                    }}
                    className={`gap-1.5 ${pendingSaasState ? "bg-flow" : "bg-red-600"}`}
                    data-testid="button-confirm-saas-toggle"
                  >
                    {pendingSaasState ? (
                      <><Rocket className="h-4 w-4" /> Yes, Enable SaaS Mode</>
                    ) : (
                      <><AlertTriangle className="h-4 w-4" /> Yes, Disable SaaS Mode</>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowSaasToggleConfirm(false);
                      setPendingSaasState(null);
                    }}
                    data-testid="button-cancel-saas-toggle"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {localSettings.saasEnabled && (
          <>
              <Card className="backdrop-blur-sm bg-card/50 border-white/10 mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <DollarSign className="h-5 w-5 text-flow" />
                    Revenue Model
                    <AdminTooltip what="Revenue projections based on current pricing. ARR = Annual Recurring Revenue from subscriptions only. One-time sales are not included." how="Enter expected subscriber count to see MRR and ARR. Actual numbers will come from Stripe when subscriptions are live." />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-md bg-white/[0.02] border border-white/5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Price/Month</p>
                      <p className="text-2xl font-bold text-flow">€{localSettings.subscriptionPriceMonthly}</p>
                    </div>
                    <div className="p-4 rounded-md bg-white/[0.02] border border-white/5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Per Subscriber ARR</p>
                      <p className="text-2xl font-bold text-flow">€{projectedARR.toFixed(2)}</p>
                    </div>
                    <div className="p-4 rounded-md bg-white/[0.02] border border-white/5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">50 Subscribers MRR</p>
                      <p className="text-2xl font-bold text-white/70">€{(50 * currentMRR).toFixed(2)}</p>
                    </div>
                    <div className="p-4 rounded-md bg-white/[0.02] border border-white/5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">100 Subscribers ARR</p>
                      <p className="text-2xl font-bold text-white/70">€{(100 * projectedARR).toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

            <Card className="backdrop-blur-sm bg-card/50 border-white/10 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-5 w-5 text-flow" />
                  Three Subscriber Pathways
                  <Badge className="bg-white/10 text-white/50 border-white/10 text-xs">Future Roadmap</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {PATHWAY_DESCRIPTIONS.map(pathway => (
                    <div
                      key={pathway.id}
                      className={`p-4 rounded-md border ${pathway.bgColor}`}
                      data-testid={`pathway-${pathway.id}`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <pathway.icon className={`h-5 w-5 ${pathway.color}`} />
                        <h3 className="text-sm font-bold">{pathway.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{pathway.subtitle}</p>
                      <div className="space-y-2 mb-3">
                        {pathway.features.map(f => (
                          <div key={f} className="flex items-start gap-2 text-xs">
                            <CheckCircle2 className={`h-3 w-3 ${pathway.color} opacity-60 mt-0.5 shrink-0`} />
                            <span className="text-white/60">{f}</span>
                          </div>
                        ))}
                      </div>
                      <p className={`text-xs font-medium ${pathway.color} opacity-70`}>{pathway.priceNote}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Card className="backdrop-blur-sm bg-card/50 border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ArrowRight className="h-5 w-5 text-flow" />
              User Flow When SaaS Is {localSettings.saasEnabled ? "ON" : "OFF"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(localSettings.saasEnabled ? [
                { step: "1", label: "Visitor clicks 'Take the Scan' in header", detail: "If logged in → goes directly to scan. If not → login page." },
                { step: "2", label: "Login page", detail: "If they have an account → log in → portal dashboard → take scan. If no account → 'Get Access' link to webshop." },
                { step: "3", label: "Webshop / Checkout", detail: "Two options: Monthly subscription (€9.95/mo, unlimited scans + portal) or One-time scan (€99.95, single scan, no portal)." },
                { step: "4", label: "After purchase", detail: "Subscriber → portal with playground, scans, data. One-time → Typeform scan link via email, dashboard delivered in 48-72h." },
                { step: "5", label: "Portal subscriber experience", detail: "Onboarding: connect calendar, LinkedIn, set consent. Then: dashboard, scan history, AI playground, micro-habit suggestions." },
              ] : [
                { step: "1", label: "Visitor clicks 'Get Your Scan' in header", detail: "Goes to /scan landing page with information about the Satellite Scan." },
                { step: "2", label: "Clicks 'Get Your Scan' CTA", detail: "Goes to checkout at €99.95." },
                { step: "3", label: "Completes payment", detail: "Receives Typeform link via email. Completes 129-question scan." },
                { step: "4", label: "Dashboard delivery", detail: "Personalized dashboard delivered within 48-72 hours by a coach." },
              ]).map(item => (
                <div key={item.step} className="flex items-start gap-3 p-3 rounded-md bg-white/[0.02] border border-white/5" data-testid={`flow-step-${item.step}`}>
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-flow/20 text-flow font-bold text-xs shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-card/50 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <HelpCircle className="h-5 w-5 text-flow" />
              How It Works (No Republish Needed)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                The SaaS toggle is a <strong className="text-white">server-side feature flag</strong>. When you flip it,
                the change takes effect immediately on the live site. The public pages check the setting on each page load.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-md bg-white/[0.02] border border-white/5">
                  <p className="text-sm font-medium text-white mb-1">To test without risk:</p>
                  <ol className="space-y-1 text-xs list-decimal list-inside">
                    <li>Turn SaaS ON and click Save</li>
                    <li>Open the site in a private/incognito window</li>
                    <li>Check the header button behavior</li>
                    <li>Try the checkout flow</li>
                    <li>If anything looks wrong, come back and flip it OFF</li>
                  </ol>
                </div>
                <div className="p-3 rounded-md bg-white/[0.02] border border-white/5">
                  <p className="text-sm font-medium text-white mb-1">Undo at any time:</p>
                  <ol className="space-y-1 text-xs list-decimal list-inside">
                    <li>Click the SaaS toggle to OFF</li>
                    <li>Click "Save & Apply"</li>
                    <li>The site reverts to one-time scan mode instantly</li>
                    <li>Existing subscribers keep their access</li>
                    <li>No code changes or republish required</li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
