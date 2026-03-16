import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AdminTooltip } from "@/components/AdminTooltip";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Loader2,
  Save,
  CheckCircle2,
  Radio,
  Clock,
  Sparkles,
  Eye,
} from "lucide-react";

export default function WebinarSettingsAdmin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: webinarSettingsData, isLoading: webinarSettingsLoading, refetch: refetchWebinarSettings } = useQuery<any>({
    queryKey: ['/api/admin/webinar-settings'],
  });

  const [webinarForm, setWebinarForm] = useState<{
    countdownDate: string;
    countdownTime: string;
    hostNames: string;
    bonusDescription: string;
    sessionTitle: string;
    sessionSubtitle: string;
    sessionDuration: string;
    ctaButtonText: string;
    ctaButtonTextExpired: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (webinarSettingsLoading) return;
    if (webinarForm) return;

    const data = webinarSettingsData || {};
    let deadline: Date;
    try {
      deadline = data.countdownDeadline ? new Date(data.countdownDeadline) : new Date("2026-02-28T23:59:59+02:00");
      if (isNaN(deadline.getTime())) deadline = new Date("2026-02-28T23:59:59+02:00");
    } catch {
      deadline = new Date("2026-02-28T23:59:59+02:00");
    }

    const dateStr = deadline.toISOString().split("T")[0];
    const timeStr = deadline.toISOString().split("T")[1].substring(0, 5);

    setWebinarForm({
      countdownDate: dateStr,
      countdownTime: timeStr,
      hostNames: data.hostNames || "Anu Timmerbacka",
      bonusDescription: data.bonusDescription || "a free 1-on-1 session with a GreenElephant coach",
      sessionTitle: data.sessionTitle || "Communication Clarity for EA's & VA's",
      sessionSubtitle: data.sessionSubtitle || "Lead with calm influence and conscious impact",
      sessionDuration: data.sessionDuration || "75 minutes",
      ctaButtonText: data.ctaButtonText || "Claim Your Scan + Bonus Session",
      ctaButtonTextExpired: data.ctaButtonTextExpired || "Get Your Satellite Scan",
    });
  }, [webinarSettingsData, webinarSettingsLoading, webinarForm]);

  const handleSave = async () => {
    if (!webinarForm) return;
    setSaving(true);
    setSaved(false);
    try {
      const finlandTimeISO = `${webinarForm.countdownDate}T${webinarForm.countdownTime}:00+02:00`;
      await apiRequest("PUT", "/api/admin/webinar-settings", {
        countdownDeadline: finlandTimeISO,
        hostNames: webinarForm.hostNames,
        bonusDescription: webinarForm.bonusDescription,
        sessionTitle: webinarForm.sessionTitle,
        sessionSubtitle: webinarForm.sessionSubtitle,
        sessionDuration: webinarForm.sessionDuration,
        ctaButtonText: webinarForm.ctaButtonText || null,
        ctaButtonTextExpired: webinarForm.ctaButtonTextExpired || null,
      });
      await refetchWebinarSettings();
      setSaved(true);
      toast({ title: "Saved", description: "Webinar settings updated. Changes are live now." });
      setTimeout(() => setSaved(false), 3000);
    } catch (error: any) {
      toast({ title: "Error saving", description: error.message || "Could not save settings", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => setLocation("/admin/submissions")} data-testid="button-back">
            <ArrowLeft className="h-5 w-5" />
          </Button></TooltipTrigger><TooltipContent>Back to Admin Hub</TooltipContent></Tooltip>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Radio className="h-6 w-6 text-chaordic" />
              Webinar Page Settings
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Change your /webinar page instantly. Edit, hit Save, done.</p>
          </div>
          <AdminTooltip
            what="Controls what visitors see on the /webinar landing page — title, host, countdown timer, and bonus CTA."
            how="Edit the fields below and click Save. Changes are live immediately."
            debug={[
              { label: "PUT /api/admin/webinar-settings", href: "/api/admin/webinar-settings" },
              { label: "Preview /webinar", href: "/webinar" },
            ]}
          />
        </div>

        {webinarSettingsLoading || !webinarForm ? (
          <div className="flex items-center gap-2 text-muted-foreground py-16 justify-center">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading settings...
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-chaordic">
                  <Clock className="h-5 w-5" />
                  Countdown Timer (Finland Time)
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  When should the bonus offer expire? After this time, the page shows a normal "Get Your Satellite Scan" button instead.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-end gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input
                      type="date"
                      value={webinarForm.countdownDate}
                      onChange={(e) => setWebinarForm({ ...webinarForm, countdownDate: e.target.value })}
                      data-testid="input-webinar-date"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time (24h)</label>
                    <Input
                      type="time"
                      value={webinarForm.countdownTime}
                      onChange={(e) => setWebinarForm({ ...webinarForm, countdownTime: e.target.value })}
                      data-testid="input-webinar-time"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle>Host & Session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Host name(s)</label>
                  <p className="text-xs text-muted-foreground">Who is presenting? e.g. "Anu Timmerbacka" or "Anu & Esteve"</p>
                  <Input
                    value={webinarForm.hostNames}
                    onChange={(e) => setWebinarForm({ ...webinarForm, hostNames: e.target.value })}
                    data-testid="input-webinar-host"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Page title</label>
                  <p className="text-xs text-muted-foreground">The big headline visitors see first</p>
                  <Input
                    value={webinarForm.sessionTitle}
                    onChange={(e) => setWebinarForm({ ...webinarForm, sessionTitle: e.target.value })}
                    data-testid="input-webinar-title"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subtitle</label>
                  <p className="text-xs text-muted-foreground">The smaller text just below the title</p>
                  <Input
                    value={webinarForm.sessionSubtitle}
                    onChange={(e) => setWebinarForm({ ...webinarForm, sessionSubtitle: e.target.value })}
                    data-testid="input-webinar-subtitle"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Session duration</label>
                  <p className="text-xs text-muted-foreground">e.g. "75 minutes" or "90 minutes"</p>
                  <Input
                    value={webinarForm.sessionDuration}
                    onChange={(e) => setWebinarForm({ ...webinarForm, sessionDuration: e.target.value })}
                    data-testid="input-webinar-duration"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-attitude">
                  <Sparkles className="h-5 w-5" />
                  Bonus Offer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bonus description</label>
                  <p className="text-xs text-muted-foreground">What do they get as a bonus? Shown as: "...and receive [your text]"</p>
                  <Input
                    value={webinarForm.bonusDescription}
                    onChange={(e) => setWebinarForm({ ...webinarForm, bonusDescription: e.target.value })}
                    data-testid="input-webinar-bonus"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CTA button text (during countdown)</label>
                  <p className="text-xs text-muted-foreground">The main purchase button text while the timer is running</p>
                  <Input
                    value={webinarForm.ctaButtonText}
                    placeholder="Claim Your Scan + Bonus Session"
                    onChange={(e) => setWebinarForm({ ...webinarForm, ctaButtonText: e.target.value })}
                    data-testid="input-webinar-cta"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CTA button text (after countdown expires)</label>
                  <p className="text-xs text-muted-foreground">The button text after the bonus expires</p>
                  <Input
                    value={webinarForm.ctaButtonTextExpired}
                    placeholder="Get Your Satellite Scan"
                    onChange={(e) => setWebinarForm({ ...webinarForm, ctaButtonTextExpired: e.target.value })}
                    data-testid="input-webinar-cta-expired"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-4">
              <Tooltip><TooltipTrigger asChild><Button onClick={handleSave} disabled={saving} data-testid="button-webinar-save">
                {saving ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                ) : saved ? (
                  <><CheckCircle2 className="h-4 w-4 mr-2" />Saved!</>
                ) : (
                  <><Save className="h-4 w-4 mr-2" />Save Changes</>
                )}
              </Button></TooltipTrigger><TooltipContent>Save all webinar settings — changes go live immediately</TooltipContent></Tooltip>
              <a href="/webinar" target="_blank" rel="noopener noreferrer">
                <Tooltip><TooltipTrigger asChild><Button variant="outline" data-testid="button-webinar-preview">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Page
                </Button></TooltipTrigger><TooltipContent>Open the public /webinar page in a new tab</TooltipContent></Tooltip>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
