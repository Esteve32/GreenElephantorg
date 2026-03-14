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
} from "lucide-react";
import adminHeroBg from "@assets/generated_images/earth_orbit_aurora_view.png";

export default function AnalyticsAdmin() {
  const [, setLocation] = useLocation();
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  const { data: envCheck } = useQuery<{ clientTrackingConfigured: boolean; serverApiConfigured: boolean; measurementId: string | null }>({
    queryKey: ['/api/admin/analytics-status'],
  });

  const clientTracking = envCheck?.clientTrackingConfigured ?? false;
  const serverApi = envCheck?.serverApiConfigured ?? false;
  const measurementId = envCheck?.measurementId ?? null;

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
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-chaordic" />
              <h1 className="text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Analytics
              </h1>
              <Badge className="bg-chaordic/20 text-chaordic border-chaordic/30 text-xs">
                Engagement
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1 ml-9">
              Google Analytics setup, status, and key metrics
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <AdminTooltip
            what="Shows whether Google Analytics 4 is connected and sending data."
            how="Add your GA4 Measurement ID (G-XXXXXXX) as the VITE_GA_MEASUREMENT_ID secret in Replit. No code changes needed."
          >
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
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
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
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
            how="Requires GA4_PROPERTY_ID and GOOGLE_SERVICE_ACCOUNT_KEY secrets. See Step 3 below."
          >
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Page Views (7d)", value: "—", icon: Eye, note: "From GA4 API" },
              { label: "Unique Visitors (7d)", value: "—", icon: Users, note: "From GA4 API" },
              { label: "Avg. Session (7d)", value: "—", icon: Clock, note: "From GA4 API" },
              { label: "Top Page", value: "—", icon: Globe, note: "From GA4 API" },
            ].map((metric) => (
              <Card key={metric.label} className="backdrop-blur-sm bg-card/50 border-white/10">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-center gap-2 mb-2">
                    <metric.icon className="h-4 w-4 text-white/30" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{metric.label}</span>
                  </div>
                  <div className="text-xl font-bold text-white/30 italic">{metric.value}</div>
                  <p className="text-xs text-white/20 mt-1">{metric.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="backdrop-blur-sm bg-card/50 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <HelpCircle className="h-5 w-5 text-chaordic" />
              Setup Guide
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(s.link!, "_blank")}
                            className="gap-1.5 text-xs mt-3"
                            data-testid={`button-analytics-step-${s.step}`}
                          >
                            {s.linkLabel}
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={() => window.open("https://analytics.google.com", "_blank")}
            className="gap-2"
            data-testid="button-open-ga4"
          >
            <BarChart3 className="h-4 w-4" />
            Open Google Analytics
            <ExternalLink className="h-3 w-3 opacity-40" />
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open("https://search.google.com/search-console", "_blank")}
            className="gap-2"
            data-testid="button-open-search-console"
          >
            <Globe className="h-4 w-4" />
            Google Search Console
            <ExternalLink className="h-3 w-3 opacity-40" />
          </Button>
        </div>
      </div>
    </div>
  );
}
