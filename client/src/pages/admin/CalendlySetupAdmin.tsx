import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AdminTooltip } from "@/components/AdminTooltip";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Copy,
  Check,
  Link2,
  HelpCircle,
  Zap,
  Globe,
  Users,
  Clock,
} from "lucide-react";
import adminHeroBg from "@assets/generated_images/earth_orbit_aurora_view.png";

export default function CalendlySetupAdmin() {
  const [, setLocation] = useLocation();
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const calendlyLinks = [
    {
      label: "Discovery Call (30 min)",
      url: "https://calendly.com/greenelephant/discovery",
      description: "Initial exploration call for prospective coaching clients",
      where: "Connect page, Homepage CTA",
    },
    {
      label: "Satellite Scan Debrief (60 min)",
      url: "https://calendly.com/greenelephant/scan-debrief",
      description: "Post-scan coaching debrief session",
      where: "Portal dashboard, post-purchase email",
    },
    {
      label: "Coaching Session (90 min)",
      url: "https://calendly.com/greenelephant/coaching",
      description: "Full coaching session for active clients",
      where: "Portal dashboard",
    },
  ];

  const setupSteps = [
    {
      step: 1,
      title: "Create your Calendly account",
      description: "Sign up at calendly.com with your GreenElephant email. The free plan works for one event type; Pro unlocks custom branding and multiple event types.",
      link: "https://calendly.com/signup",
      linkLabel: "Go to Calendly",
    },
    {
      step: 2,
      title: "Create your event types",
      description: "Set up Discovery Call (30 min), Scan Debrief (60 min), and Coaching Session (90 min). Add buffer time between sessions and set your availability windows.",
      link: "https://calendly.com/event_types",
      linkLabel: "Manage Events",
    },
    {
      step: 3,
      title: "Brand your booking page",
      description: "Upload the GreenElephant logo, set brand colors (#009999 teal), and customize confirmation messages. This is what clients see when they book.",
      link: "https://calendly.com/account/branding",
      linkLabel: "Branding Settings",
    },
    {
      step: 4,
      title: "Set up email notifications",
      description: "Configure reminder emails (24h and 1h before), follow-up emails, and cancellation policies. Use the GreenElephant tone — warm and professional.",
      link: "https://calendly.com/account/admin/notifications",
      linkLabel: "Notification Settings",
    },
    {
      step: 5,
      title: "Embed on the website",
      description: "Copy your Calendly link and paste it into the Connect page embed or use the inline widget. The link format is: calendly.com/greenelephant/[event-type]",
      link: null,
      linkLabel: null,
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
              <Calendar className="h-6 w-6 text-chaordic" />
              <h1 className="text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Calendly Setup
              </h1>
              <Badge className="bg-chaordic/20 text-chaordic border-chaordic/30 text-xs">
                Engagement
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1 ml-9">
              Configure your booking links and embed Calendly across the site
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <AdminTooltip
            what="Active booking links used across the GreenElephant website. Each link maps to a Calendly event type."
            how="Copy these links for use in emails, social media, or manual sharing. The 'Where used' shows where each link appears on the site."
          >
            <Card className="lg:col-span-2 backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Link2 className="h-5 w-5 text-chaordic" />
                  Booking Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {calendlyLinks.map((link) => (
                  <div
                    key={link.label}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-md border border-white/10 bg-white/[0.02]"
                    data-testid={`calendly-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-chaordic/60" />
                        <span className="text-sm font-semibold">{link.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{link.description}</p>
                      <div className="flex items-center gap-1.5">
                        <Globe className="h-3 w-3 text-white/30" />
                        <span className="text-xs text-white/30">Used on: {link.where}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <code className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded max-w-[200px] truncate">
                        {link.url}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(link.url, link.label)}
                        data-testid={`button-copy-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {copied === link.label ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(link.url, '_blank')}
                        data-testid={`button-open-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </AdminTooltip>

          <div className="space-y-6">
            <AdminTooltip
              what="Quick summary of your Calendly integration status."
              how="These numbers update when you configure Calendly event types. Green = active, amber = needs setup."
            >
              <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Zap className="h-5 w-5 text-chaordic" />
                    Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Event Types</span>
                    <Badge className="bg-chaordic/20 text-chaordic border-chaordic/30">3 configured</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Website Embed</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Manual links</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Email Integration</span>
                    <Badge className="bg-chaordic/20 text-chaordic border-chaordic/30">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            </AdminTooltip>

            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-5 w-5 text-chaordic" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-sm"
                  onClick={() => window.open("https://calendly.com/event_types", "_blank")}
                  data-testid="button-manage-events"
                >
                  <Calendar className="h-4 w-4" />
                  Manage Event Types
                  <ExternalLink className="h-3 w-3 ml-auto opacity-40" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-sm"
                  onClick={() => window.open("https://calendly.com/scheduled_events", "_blank")}
                  data-testid="button-view-bookings"
                >
                  <Clock className="h-4 w-4" />
                  View Upcoming Bookings
                  <ExternalLink className="h-3 w-3 ml-auto opacity-40" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="backdrop-blur-sm bg-card/50 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <HelpCircle className="h-5 w-5 text-chaordic" />
              Setup Guide
              <Badge className="bg-white/10 text-white/50 border-white/10 text-xs">5 steps</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {setupSteps.map((s) => (
                <div
                  key={s.step}
                  className="flex gap-4 items-start"
                  data-testid={`setup-step-${s.step}`}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-chaordic/20 text-chaordic font-bold text-sm shrink-0">
                    {s.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold mb-1">{s.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">{s.description}</p>
                    {s.link && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(s.link!, "_blank")}
                        className="gap-1.5 text-xs"
                        data-testid={`button-setup-step-${s.step}`}
                      >
                        {s.linkLabel}
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
