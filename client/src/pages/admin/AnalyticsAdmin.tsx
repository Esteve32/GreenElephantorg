import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AdminTooltip } from "@/components/AdminTooltip";
import {
  ArrowLeft,
  BarChart3,
  ExternalLink,
  HelpCircle,
  Globe,
  Users,
  Clock,
  TrendingUp,
  Eye,
  MousePointerClick,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Activity,
  Zap,
  RefreshCw,
} from "lucide-react";
import adminHeroBg from "@assets/generated_images/earth_orbit_aurora_view.png";

interface FathomStatus {
  configured: boolean;
  connected: boolean;
  clientIdPresent: boolean;
  clientSecretPresent: boolean;
  accessTokenPresent: boolean;
}

interface FathomSite {
  id: string;
  name: string;
  sharing: string;
  created_at: string;
}

interface FathomSitesResponse {
  data: FathomSite[];
  has_more: boolean;
}

export default function AnalyticsAdmin() {
  const [, setLocation] = useLocation();
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  const { data: envCheck } = useQuery<{ clientTrackingConfigured: boolean; serverApiConfigured: boolean; measurementId: string | null }>({
    queryKey: ['/api/admin/analytics-status'],
  });

  const { data: fathomStatus } = useQuery<FathomStatus>({
    queryKey: ["/api/admin/fathom/status"],
  });

  const { data: fathomSites, isLoading: sitesLoading } = useQuery<FathomSitesResponse>({
    queryKey: ["/api/admin/fathom/sites"],
    enabled: !!fathomStatus?.connected,
  });

  const activeSiteId = selectedSiteId || fathomSites?.data?.[0]?.id || null;
  const activeSiteName = fathomSites?.data?.find(s => s.id === activeSiteId)?.name || null;

  const { data: currentVisitors, isLoading: visitorsLoading } = useQuery<{ total: number }>({
    queryKey: ["/api/admin/fathom/current-visitors", activeSiteId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/fathom/current-visitors?site_id=${activeSiteId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!activeSiteId,
    refetchInterval: 30000,
  });

  const { data: aggregations, isLoading: aggLoading } = useQuery<Array<{
    visits: string;
    uniques: string;
    pageviews: string;
    avg_duration: string;
    bounce_rate: string;
  }>>({
    queryKey: ["/api/admin/fathom/aggregations", activeSiteId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/fathom/aggregations?site_id=${activeSiteId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!activeSiteId,
    refetchInterval: 60000,
  });

  const agg = aggregations?.[0];

  const clientTracking = envCheck?.clientTrackingConfigured ?? false;
  const serverApi = envCheck?.serverApiConfigured ?? false;
  const measurementId = envCheck?.measurementId ?? null;
  const fathomConnected = fathomStatus?.connected ?? false;

  const formatDuration = (seconds: string | undefined) => {
    if (!seconds) return "—";
    const s = parseFloat(seconds);
    if (isNaN(s)) return "—";
    const m = Math.floor(s / 60);
    const rem = Math.round(s % 60);
    return m > 0 ? `${m}m ${rem}s` : `${rem}s`;
  };

  const formatBounceRate = (rate: string | undefined) => {
    if (!rate) return "—";
    const r = parseFloat(rate);
    if (isNaN(r)) return "—";
    return `${(r * 100).toFixed(1)}%`;
  };

  const formatNumber = (val: string | undefined) => {
    if (!val) return "—";
    const n = parseInt(val);
    if (isNaN(n)) return "—";
    return n.toLocaleString();
  };

  const setupSteps = [
    {
      step: 1,
      title: "Create a Google Analytics 4 property",
      time: "5 min",
      content: [
        "1. Go to analytics.google.com and sign in with your Google account",
        "2. Click Admin (gear icon, bottom left)",
        "3. Click '+ Create Property'",
        "4. Name it 'GreenElephant.org', set timezone and currency",
        "5. Choose 'Web' as the platform",
        "6. Enter your domain: greenelephant.org",
        "7. Copy the Measurement ID (starts with G-...)",
      ],
      link: "https://analytics.google.com/analytics/web/#/a/p/admin/streams",
      linkLabel: "Open GA4 Admin",
    },
    {
      step: 2,
      title: "Add the Measurement ID to GreenElephant",
      time: "2 min",
      content: [
        "1. In your Replit project, go to Secrets (lock icon in left sidebar)",
        "2. Add a new secret: VITE_GA_MEASUREMENT_ID",
        "3. Paste your G-XXXXXXX Measurement ID as the value",
        "4. The site will automatically start sending page views",
        "5. No code changes needed — it's already wired up!",
      ],
      link: null,
      linkLabel: null,
    },
    {
      step: 3,
      title: "Enable server-side analytics (optional)",
      time: "10 min",
      content: [
        "For the funnel dashboard to pull real traffic numbers, you also need:",
        "1. Create a Google Cloud service account at console.cloud.google.com",
        "2. Grant it 'Viewer' role on your GA4 property",
        "3. Download the JSON key file",
        "4. In Replit Secrets, add GA4_PROPERTY_ID (just the number, e.g. 12345678)",
        "5. Add GOOGLE_SERVICE_ACCOUNT_KEY (paste the entire JSON key content)",
        "6. This enables server-side queries for the funnel dashboard",
      ],
      link: "https://console.cloud.google.com/iam-admin/serviceaccounts",
      linkLabel: "Google Cloud Console",
    },
    {
      step: 4,
      title: "Set up conversion events",
      time: "5 min",
      content: [
        "GreenElephant already sends these events (when GA4 is connected):",
        "",
        "  scan_purchase — When someone buys a Satellite Scan",
        "  coaching_inquiry — Contact form submissions",
        "  newsletter_signup — Email list opt-ins",
        "  webinar_registration — Webinar signups",
        "  portal_login — Client portal access",
        "",
        "To mark them as conversions in GA4:",
        "1. Go to GA4 > Admin > Events",
        "2. Find each event above and toggle 'Mark as conversion'",
        "3. This enables conversion tracking in your reports",
      ],
      link: "https://analytics.google.com/analytics/web/#/events",
      linkLabel: "GA4 Events",
    },
    {
      step: 5,
      title: "Verify everything works",
      time: "3 min",
      content: [
        "1. Open your site in a new tab",
        "2. In GA4, go to Reports > Realtime",
        "3. You should see your visit appear within 30 seconds",
        "4. Navigate around the site — each page should register",
        "5. If nothing shows: check that your ad blocker isn't blocking GA",
        "6. Check the browser console for 'GA initialized' message",
      ],
      link: "https://analytics.google.com/analytics/web/#/realtime",
      linkLabel: "GA4 Realtime",
    },
  ];

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
        <div className="flex items-center gap-4 mb-8">
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
            <div className="flex items-center gap-3 flex-wrap">
              <BarChart3 className="h-6 w-6 text-chaordic" />
              <h1 className="text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }} data-testid="text-analytics-title">
                Analytics
              </h1>
              <Badge className="bg-chaordic/20 text-chaordic border-chaordic/30 text-xs">
                Engagement
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1 ml-9">
              Fathom Analytics (privacy-first) and Google Analytics setup
            </p>
          </div>
        </div>

        <div className="space-y-10">

          <section>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Activity className="h-5 w-5 text-[#8B5CF6]" />
              <h2 className="text-lg font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }} data-testid="text-fathom-section">
                Fathom Analytics
              </h2>
              <AdminTooltip
                what="Privacy-first analytics that complies with GDPR, CCPA, and PECR — no cookie banners needed."
                how="Connect via OAuth on the Integrations page. Once connected, live visitor counts and 7-day metrics appear here automatically."
                debug={[
                  { label: "Fathom Dashboard", href: "https://app.usefathom.com" },
                  { label: "GET /api/admin/fathom/status", href: "/api/admin/fathom/status" },
                ]}
              />
              {fathomConnected ? (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400/30">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Connected
                </Badge>
              ) : fathomStatus?.configured ? (
                <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400/30">
                  <AlertTriangle className="h-3 w-3 mr-1" /> OAuth Required
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-muted-foreground border-white/10">
                  Not Configured
                </Badge>
              )}
            </div>

            {!fathomConnected ? (
              <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                <CardContent className="pt-5 pb-4 px-5">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {fathomStatus?.configured
                        ? "Fathom OAuth credentials are set. Complete the OAuth flow to connect."
                        : "Set FATHOM_CLIENT_ID and FATHOM_CLIENT_SECRET in Replit Secrets, then complete OAuth."}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="flex items-center gap-2 text-sm">
                        {fathomStatus?.clientIdPresent ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <AlertTriangle className="h-4 w-4 text-yellow-400" />}
                        <span>FATHOM_CLIENT_ID</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {fathomStatus?.clientSecretPresent ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <AlertTriangle className="h-4 w-4 text-yellow-400" />}
                        <span>FATHOM_CLIENT_SECRET</span>
                      </div>
                    </div>
                    {fathomStatus?.configured && (
                      <Tooltip><TooltipTrigger asChild><Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = "/api/admin/auth/fathom"}
                        className="gap-2"
                        data-testid="button-connect-fathom"
                      >
                        <Zap className="h-4 w-4" />
                        Connect Fathom
                      </Button></TooltipTrigger><TooltipContent>Start the Fathom OAuth flow to connect analytics</TooltipContent></Tooltip>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {fathomSites && fathomSites.data.length > 1 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">Site:</span>
                    {fathomSites.data.map(site => (
                      <Tooltip key={site.id}><TooltipTrigger asChild><Button
                        variant={activeSiteId === site.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSiteId(site.id)}
                        data-testid={`button-site-${site.id}`}
                      >
                        {site.name}
                      </Button></TooltipTrigger><TooltipContent>View analytics for {site.name}</TooltipContent></Tooltip>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <AdminTooltip
                    what="People on your site right now. Updates every 30 seconds."
                    how="Powered by Fathom's real-time API. No cookies needed — privacy compliant."
                  >
                    <Card className="backdrop-blur-sm bg-card/50 border-[#8B5CF6]/20" data-testid="card-current-visitors">
                      <CardContent className="pt-5 pb-4 px-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Live Now</span>
                          <div className="flex items-center gap-1">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                            </span>
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-[#8B5CF6] mb-1" data-testid="text-current-visitors">
                          {visitorsLoading ? "..." : currentVisitors?.total ?? "—"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {activeSiteName || "visitors"}
                        </p>
                      </CardContent>
                    </Card>
                  </AdminTooltip>

                  <AdminTooltip
                    what="Total page loads across all pages in the last 7 days."
                    how="Includes repeat views. One person visiting 3 pages = 3 pageviews."
                  >
                    <Card className="backdrop-blur-sm bg-card/50 border-white/10" data-testid="card-pageviews">
                      <CardContent className="pt-5 pb-4 px-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Pageviews</span>
                          <Eye className="h-4 w-4 text-muted-foreground/40" />
                        </div>
                        <div className="text-2xl font-bold mb-1" data-testid="text-pageviews">
                          {aggLoading ? "..." : formatNumber(agg?.pageviews)}
                        </div>
                        <p className="text-xs text-muted-foreground">Last 7 days</p>
                      </CardContent>
                    </Card>
                  </AdminTooltip>

                  <AdminTooltip
                    what="Unique people who visited your site in the last 7 days."
                    how="Fathom counts unique visitors without cookies, using privacy-safe hashing."
                  >
                    <Card className="backdrop-blur-sm bg-card/50 border-white/10" data-testid="card-uniques">
                      <CardContent className="pt-5 pb-4 px-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Unique Visitors</span>
                          <Users className="h-4 w-4 text-muted-foreground/40" />
                        </div>
                        <div className="text-2xl font-bold mb-1" data-testid="text-uniques">
                          {aggLoading ? "..." : formatNumber(agg?.uniques)}
                        </div>
                        <p className="text-xs text-muted-foreground">Last 7 days</p>
                      </CardContent>
                    </Card>
                  </AdminTooltip>

                  <AdminTooltip
                    what="Average time a visitor spends on your site per session."
                    how="Longer sessions typically mean more engaged visitors exploring your content."
                  >
                    <Card className="backdrop-blur-sm bg-card/50 border-white/10" data-testid="card-avg-duration">
                      <CardContent className="pt-5 pb-4 px-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Avg. Session</span>
                          <Clock className="h-4 w-4 text-muted-foreground/40" />
                        </div>
                        <div className="text-2xl font-bold mb-1" data-testid="text-avg-duration">
                          {aggLoading ? "..." : formatDuration(agg?.avg_duration)}
                        </div>
                        <p className="text-xs text-muted-foreground">Last 7 days</p>
                      </CardContent>
                    </Card>
                  </AdminTooltip>

                  <AdminTooltip
                    what="Percentage of visitors who leave after viewing only one page."
                    how="Lower is generally better — it means visitors are exploring more of your content."
                  >
                    <Card className="backdrop-blur-sm bg-card/50 border-white/10" data-testid="card-bounce-rate">
                      <CardContent className="pt-5 pb-4 px-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Bounce Rate</span>
                          <TrendingUp className="h-4 w-4 text-muted-foreground/40" />
                        </div>
                        <div className="text-2xl font-bold mb-1" data-testid="text-bounce-rate">
                          {aggLoading ? "..." : formatBounceRate(agg?.bounce_rate)}
                        </div>
                        <p className="text-xs text-muted-foreground">Last 7 days</p>
                      </CardContent>
                    </Card>
                  </AdminTooltip>
                </div>

                {sitesLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Loading Fathom data...
                  </div>
                )}

                <div className="flex items-center gap-3 flex-wrap">
                  <Tooltip><TooltipTrigger asChild><Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("https://app.usefathom.com", "_blank")}
                    className="gap-2"
                    data-testid="button-open-fathom"
                  >
                    <Activity className="h-4 w-4" />
                    Open Fathom Dashboard
                    <ExternalLink className="h-3 w-3 opacity-40" />
                  </Button></TooltipTrigger><TooltipContent>Open Fathom Analytics dashboard in a new tab</TooltipContent></Tooltip>
                </div>
              </div>
            )}
          </section>

          <div className="border-t border-white/5" />

          <section>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <BarChart3 className="h-5 w-5 text-chaordic" />
              <h2 className="text-lg font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }} data-testid="text-ga4-section">
                Google Analytics 4
              </h2>
              <AdminTooltip
                what="Google's analytics platform for page tracking, conversion events, and funnel analysis."
                how="Add your GA4 Measurement ID as a Replit Secret. Optionally enable server-side API access for the funnel dashboard."
              />
              {clientTracking ? (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400/30">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Tracking Active
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-muted-foreground border-white/10">
                  Not Connected
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <AdminTooltip
                what="Shows whether Google Analytics 4 is connected and sending data."
                how="Add your GA4 Measurement ID (G-XXXXXXX) as the VITE_GA_MEASUREMENT_ID secret in Replit. No code changes needed."
              >
                <Card className="backdrop-blur-sm bg-card/50 border-white/10" data-testid="card-ga4-tracking">
                  <CardContent className="pt-5 pb-4 px-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Client Tracking</span>
                      {clientTracking ? (
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      )}
                    </div>
                    <div className={`text-2xl font-bold mb-1 ${clientTracking ? "text-green-400" : "text-yellow-400"}`}>
                      {clientTracking ? "Connected" : "Not Connected"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {clientTracking
                        ? `Measurement ID: ${measurementId}`
                        : "Add VITE_GA_MEASUREMENT_ID to Secrets"}
                    </p>
                  </CardContent>
                </Card>
              </AdminTooltip>

              <AdminTooltip
                what="Number of custom events GreenElephant sends to GA4 automatically."
                how="These fire on key user actions (purchase, signup, etc.). Mark them as conversions in GA4 for tracking."
              >
                <Card className="backdrop-blur-sm bg-card/50 border-white/10" data-testid="card-custom-events">
                  <CardContent className="pt-5 pb-4 px-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Custom Events</span>
                      <MousePointerClick className="h-5 w-5 text-chaordic/60" />
                    </div>
                    <div className="text-2xl font-bold text-chaordic mb-1">5</div>
                    <p className="text-xs text-muted-foreground">Pre-configured conversion events</p>
                  </CardContent>
                </Card>
              </AdminTooltip>

              <AdminTooltip
                what="Server-side GA4 access for pulling data into the funnel dashboard."
                how="Requires GA4_PROPERTY_ID and GOOGLE_SERVICE_ACCOUNT_KEY secrets. See the setup guide below."
              >
                <Card className="backdrop-blur-sm bg-card/50 border-white/10" data-testid="card-server-api">
                  <CardContent className="pt-5 pb-4 px-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Server API</span>
                      <TrendingUp className="h-5 w-5 text-chaordic/60" />
                    </div>
                    <div className={`text-2xl font-bold mb-1 ${serverApi ? "text-green-400" : "text-white/30"}`}>
                      {serverApi ? "Active" : "Inactive"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {serverApi ? "Funnel pulls real traffic data" : "Funnel uses estimates"}
                    </p>
                  </CardContent>
                </Card>
              </AdminTooltip>
            </div>

            {serverApi && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Page Views (7d)", value: "—", icon: Eye, note: "From GA4 API", tip: "Total page loads from the GA4 server-side API over the last 7 days" },
                  { label: "Unique Visitors (7d)", value: "—", icon: Users, note: "From GA4 API", tip: "Distinct visitors from the GA4 server-side API over the last 7 days" },
                  { label: "Avg. Session (7d)", value: "—", icon: Clock, note: "From GA4 API", tip: "Average time visitors spend on your site per session from GA4" },
                  { label: "Top Page", value: "—", icon: Globe, note: "From GA4 API", tip: "The most-visited page on your site according to GA4 data" },
                ].map((metric) => (
                  <Tooltip key={metric.label}><TooltipTrigger asChild>
                  <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                    <CardContent className="pt-4 pb-3 px-4">
                      <div className="flex items-center gap-2 mb-2">
                        <metric.icon className="h-4 w-4 text-white/30" />
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">{metric.label}</span>
                      </div>
                      <div className="text-xl font-bold text-white/30 italic">{metric.value}</div>
                      <p className="text-xs text-white/20 mt-1">{metric.note}</p>
                    </CardContent>
                  </Card>
                  </TooltipTrigger><TooltipContent>{metric.tip}</TooltipContent></Tooltip>
                ))}
              </div>
            )}

            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <HelpCircle className="h-5 w-5 text-chaordic" />
                  GA4 Setup Guide
                  <Badge className="bg-white/10 text-white/50 border-white/10 text-xs">
                    ~25 min total
                  </Badge>
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Step-by-step instructions to connect Google Analytics 4. Each step has a time estimate and a direct link.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {setupSteps.map((s) => (
                    <div
                      key={s.step}
                      className="rounded-md border border-white/10 overflow-hidden"
                      data-testid={`analytics-step-${s.step}`}
                    >
                      <button
                        onClick={() => setExpandedStep(expandedStep === s.step ? null : s.step)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover-elevate active-elevate-2 text-left"
                        data-testid={`button-expand-step-${s.step}`}
                      >
                        {expandedStep === s.step ? (
                          <ChevronDown className="h-4 w-4 text-chaordic shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-white/40 shrink-0" />
                        )}
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-chaordic/20 text-chaordic font-bold text-xs shrink-0">
                          {s.step}
                        </div>
                        <span className="text-sm font-semibold flex-1">{s.title}</span>
                        <Badge className="bg-white/5 text-white/30 border-white/10 text-xs shrink-0">
                          {s.time}
                        </Badge>
                      </button>

                      {expandedStep === s.step && (
                        <div className="px-4 pb-4 pt-1 border-t border-white/5 bg-white/[0.01]">
                          <div className="ml-14 space-y-1">
                            {s.content.map((line, i) => (
                              <p
                                key={i}
                                className={`text-xs leading-relaxed ${
                                  line === "" ? "h-2" : line.startsWith("  ") ? "text-chaordic/70 font-mono" : "text-muted-foreground"
                                }`}
                              >
                                {line}
                              </p>
                            ))}
                            {s.link && (
                              <Tooltip><TooltipTrigger asChild><Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(s.link!, "_blank")}
                                className="gap-1.5 text-xs mt-3"
                                data-testid={`button-analytics-step-${s.step}`}
                              >
                                {s.linkLabel}
                                <ExternalLink className="h-3 w-3" />
                              </Button></TooltipTrigger><TooltipContent>Open {s.linkLabel} in a new tab</TooltipContent></Tooltip>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <div className="flex flex-wrap items-center gap-3">
            <Tooltip><TooltipTrigger asChild><Button
              variant="outline"
              onClick={() => window.open("https://app.usefathom.com", "_blank")}
              className="gap-2"
              data-testid="button-open-fathom-bottom"
            >
              <Activity className="h-4 w-4" />
              Fathom Analytics
              <ExternalLink className="h-3 w-3 opacity-40" />
            </Button></TooltipTrigger><TooltipContent>Open Fathom Analytics dashboard</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button
              variant="outline"
              onClick={() => window.open("https://analytics.google.com", "_blank")}
              className="gap-2"
              data-testid="button-open-ga4"
            >
              <BarChart3 className="h-4 w-4" />
              Google Analytics
              <ExternalLink className="h-3 w-3 opacity-40" />
            </Button></TooltipTrigger><TooltipContent>Open Google Analytics 4 dashboard</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button
              variant="outline"
              onClick={() => window.open("https://search.google.com/search-console", "_blank")}
              className="gap-2"
              data-testid="button-open-search-console"
            >
              <Globe className="h-4 w-4" />
              Search Console
              <ExternalLink className="h-3 w-3 opacity-40" />
            </Button></TooltipTrigger><TooltipContent>Open Google Search Console for SEO insights</TooltipContent></Tooltip>
          </div>

        </div>
      </div>
    </div>
  );
}
