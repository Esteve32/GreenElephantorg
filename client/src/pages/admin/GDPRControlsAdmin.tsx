import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminTooltip } from "@/components/AdminTooltip";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Shield, Database, Mail, Users, Eye, Scale, Cpu, AlertTriangle, RefreshCw, ExternalLink, CheckCircle2 } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function GDPRControlsAdmin() {
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<Record<string, string>>({
    queryKey: ["/api/admin/settings"],
  });

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      await apiRequest("POST", "/api/admin/settings", { key, value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({ title: "Setting saved" });
    },
  });

  const toggleSetting = (key: string) => {
    const current = settings?.[key] === "true";
    updateSetting.mutate({ key, value: String(!current) });
  };

  const isEnabled = (key: string) => settings?.[key] === "true";

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#0a0a0a]">
      <SEO title="GDPR & Data Controls | Admin" canonicalPath="/admin/gdpr-controls" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <Tooltip><TooltipTrigger asChild><a href="/admin/submissions" data-testid="link-admin-back">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </a></TooltipTrigger><TooltipContent>Back to Admin Hub</TooltipContent></Tooltip>
          <div className="flex items-center gap-3 flex-wrap">
            <Shield className="h-8 w-8 text-needs" />
            <h1 className="text-3xl font-bold" data-testid="text-gdpr-controls-title">GDPR & Data Controls</h1>
            <AdminTooltip
              what="Centralised GDPR compliance controls for GreenElephant. Toggle data handling policies, review consent settings, and run the ACX100 self-audit."
              how="Each section has an enable/disable toggle. Changes take effect immediately. Hover the (?) icons for more details."
              debug={[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "AI Policy", href: "/ai-policy" },
                { label: "ACX100 Framework", href: "https://arbora.partners" },
              ]}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-needs border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-6">

            <Card className="bg-card/50 border-needs/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-needs" />
                  Data Collection Controls
                  <AdminTooltip
                    what="Toggle which types of data collection are active on the site."
                    how="Disabling a toggle stops new data from being collected. Existing data is not affected — use the retention controls below for cleanup."
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ToggleRow
                  label="Newsletter Signups"
                  description="Accept new newsletter subscriptions with GDPR consent"
                  enabled={isEnabled("gdpr_newsletter_enabled")}
                  onToggle={() => toggleSetting("gdpr_newsletter_enabled")}
                  isPending={updateSetting.isPending}
                />
                <ToggleRow
                  label="Waitlist Entries"
                  description="Accept retreat and program waitlist registrations"
                  enabled={isEnabled("gdpr_waitlist_enabled")}
                  onToggle={() => toggleSetting("gdpr_waitlist_enabled")}
                  isPending={updateSetting.isPending}
                />
                <ToggleRow
                  label="Assessment Data (Signals Quiz, Flow Check)"
                  description="Collect and store assessment responses"
                  enabled={isEnabled("gdpr_assessments_enabled")}
                  onToggle={() => toggleSetting("gdpr_assessments_enabled")}
                  isPending={updateSetting.isPending}
                />
                <ToggleRow
                  label="Contact Form Submissions"
                  description="Accept new contact form messages"
                  enabled={isEnabled("gdpr_contact_enabled")}
                  onToggle={() => toggleSetting("gdpr_contact_enabled")}
                  isPending={updateSetting.isPending}
                />
                <div className="border-t border-white/10 pt-4">
                  <ToggleRow
                    label="Client Portal Login (Public)"
                    description="Show 'Log in' button in header, footer, and mobile menu. When off, portal access is hidden from public visitors and subscriptions cannot be purchased."
                    enabled={isEnabled("portal_login_enabled")}
                    onToggle={() => toggleSetting("portal_login_enabled")}
                    isPending={updateSetting.isPending}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-needs/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-needs" />
                  OAuth & Third-Party Integrations
                  <AdminTooltip
                    what="Control which third-party login methods are available to portal users."
                    how="Disable a provider to hide its login button. Users already authenticated via that provider can still use email/password."
                    debug={[{ label: "LinkedIn Setup", href: "/admin/linkedin-setup" }]}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ToggleRow
                  label="Google OAuth Login"
                  description="Allow portal users to sign in with their Google account"
                  enabled={isEnabled("gdpr_google_oauth_enabled")}
                  onToggle={() => toggleSetting("gdpr_google_oauth_enabled")}
                  isPending={updateSetting.isPending}
                />
                <ToggleRow
                  label="LinkedIn OAuth Login"
                  description="Allow portal users to sign in with their LinkedIn account (OIDC)"
                  enabled={isEnabled("linkedin_oauth_enabled")}
                  onToggle={() => toggleSetting("linkedin_oauth_enabled")}
                  isPending={updateSetting.isPending}
                />
                <ToggleRow
                  label="Notion Workspace Connection"
                  description="Allow portal users to connect their Notion workspace for scan data"
                  enabled={isEnabled("gdpr_notion_oauth_enabled")}
                  onToggle={() => toggleSetting("gdpr_notion_oauth_enabled")}
                  isPending={updateSetting.isPending}
                />
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-needs/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-needs" />
                  Email & Consent Controls
                  <AdminTooltip
                    what="Control email sending behaviour and consent requirements."
                    how="These settings affect how confirmation emails, onboarding sequences, and admin notifications are sent."
                    debug={[{ label: "Email Control Room", href: "/admin/email-control-room" }]}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ToggleRow
                  label="Confirmation Emails"
                  description="Send GDPR-compliant confirmation emails after form submissions"
                  enabled={isEnabled("gdpr_confirmation_emails")}
                  onToggle={() => toggleSetting("gdpr_confirmation_emails")}
                  isPending={updateSetting.isPending}
                />
                <ToggleRow
                  label="Onboarding Email Sequences"
                  description="Send Fibonacci-timed onboarding emails to new contacts"
                  enabled={isEnabled("gdpr_onboarding_emails")}
                  onToggle={() => toggleSetting("gdpr_onboarding_emails")}
                  isPending={updateSetting.isPending}
                />
                <ToggleRow
                  label="Admin Notifications"
                  description="Notify esteve@greenelephant.org of new signups, purchases, messages"
                  enabled={isEnabled("gdpr_admin_notifications")}
                  onToggle={() => toggleSetting("gdpr_admin_notifications")}
                  isPending={updateSetting.isPending}
                />
                <ToggleRow
                  label="Double Opt-In"
                  description="Require email confirmation before adding to marketing lists (recommended)"
                  enabled={isEnabled("gdpr_double_optin")}
                  onToggle={() => toggleSetting("gdpr_double_optin")}
                  isPending={updateSetting.isPending}
                />
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-needs/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-needs" />
                  Data Retention Policies
                  <AdminTooltip
                    what="Configure how long different types of data are retained before automatic cleanup."
                    how="These define the retention periods shown in the privacy policy. Actual cleanup requires manual action or scheduled tasks (future feature)."
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RetentionRow
                  label="Contact & Marketing Data"
                  current={settings?.gdpr_retention_contact || "24"}
                  unit="months from last interaction"
                  onSave={(val) => updateSetting.mutate({ key: "gdpr_retention_contact", value: val })}
                  isPending={updateSetting.isPending}
                />
                <RetentionRow
                  label="Assessment Results"
                  current={settings?.gdpr_retention_assessments || "12"}
                  unit="months (anonymised after 6)"
                  onSave={(val) => updateSetting.mutate({ key: "gdpr_retention_assessments", value: val })}
                  isPending={updateSetting.isPending}
                />
                <RetentionRow
                  label="Waitlist Entries"
                  current={settings?.gdpr_retention_waitlist || "12"}
                  unit="months after retreat cycle ends"
                  onSave={(val) => updateSetting.mutate({ key: "gdpr_retention_waitlist", value: val })}
                  isPending={updateSetting.isPending}
                />
                <RetentionRow
                  label="Payment/Contract Records"
                  current={settings?.gdpr_retention_payments || "72"}
                  unit="months (EU tax requirement: 6-10 years)"
                  onSave={(val) => updateSetting.mutate({ key: "gdpr_retention_payments", value: val })}
                  isPending={updateSetting.isPending}
                />
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-l-4 border-l-needs/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-needs" />
                  ACX100 Self-Audit Reminder
                  <AdminTooltip
                    what="The ACX100 is an 80-point AI-Human Experience audit framework by Arbora Partners."
                    how="After every publish, rate each of the 8 sections (1-5). Most relevant for GreenElephant: II (Transparency), III (Accountability), V (Fairness), VI (Technical Robustness)."
                    debug={[
                      { label: "ACX100 Framework", href: "https://arbora.partners" },
                      { label: "AI Policy Page", href: "/ai-policy" },
                    ]}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  After every publish, self-audit against these 8 pillars of the ACX100 framework.
                  Rate each 1-5. Sections most relevant to GreenElephant are highlighted.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <AuditPillar icon={Users} label="I. Human Agency & Oversight" highlight={false} description="Human-in-the-loop for AI decisions" />
                  <AuditPillar icon={Eye} label="II. Transparency" highlight description="AI content clearly labelled" />
                  <AuditPillar icon={Shield} label="III. Accountability" highlight description="Clear responsibility for AI outcomes" />
                  <AuditPillar icon={Database} label="IV. Data Governance" highlight={false} description="Formal data framework for AI" />
                  <AuditPillar icon={Scale} label="V. Fairness" highlight description="No bias in assessments" />
                  <AuditPillar icon={Cpu} label="VI. Technical Robustness" highlight description="Graceful AI failure handling" />
                  <AuditPillar icon={AlertTriangle} label="VII. Risk-Based Approach" highlight={false} description="EU AI Act compliance" />
                  <AuditPillar icon={RefreshCw} label="VIII. Continuous Monitoring" highlight={false} description="Post-deploy monitoring" />
                </div>
                <div className="flex gap-3 flex-wrap">
                  <a href="https://arbora.partners" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2" data-testid="button-acx100-framework">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Full ACX100 Framework
                    </Button>
                  </a>
                  <a href="/ai-policy">
                    <Button variant="outline" size="sm" className="gap-2" data-testid="button-ai-policy">
                      <Eye className="h-3.5 w-3.5" />
                      View AI Policy
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Legal Pages Status
                  <AdminTooltip
                    what="Quick status check for all required legal/policy pages."
                    how="All pages should return HTTP 200 and be publicly accessible."
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <LegalPageRow label="Privacy Policy" path="/privacy" />
                  <LegalPageRow label="Terms of Service" path="/terms" />
                  <LegalPageRow label="Cookie Policy" path="/cookies" />
                  <LegalPageRow label="AI Policy" path="/ai-policy" />
                </div>
              </CardContent>
            </Card>

          </div>
        )}
      </div>
    </div>
  );
}

function ToggleRow({ label, description, enabled, onToggle, isPending }: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  isPending: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/20">
      <div className="min-w-0">
        <p className="font-medium text-sm" data-testid={`text-toggle-${label.toLowerCase().replace(/\s+/g, '-')}`}>{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Button
        variant={enabled ? "default" : "outline"}
        size="sm"
        onClick={onToggle}
        disabled={isPending}
        data-testid={`button-toggle-${label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {enabled ? "On" : "Off"}
      </Button>
    </div>
  );
}

function RetentionRow({ label, current, unit, onSave, isPending }: {
  label: string;
  current: string;
  unit: string;
  onSave: (val: string) => void;
  isPending: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/20 flex-wrap">
      <div className="min-w-0">
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{unit}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="font-mono">{current} mo</Badge>
      </div>
    </div>
  );
}

function AuditPillar({ icon: Icon, label, highlight, description }: {
  icon: typeof Users;
  label: string;
  highlight: boolean;
  description: string;
}) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${highlight ? 'bg-needs/10 border border-needs/20' : 'bg-muted/20'}`}>
      <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${highlight ? 'text-needs' : 'text-muted-foreground'}`} />
      <div>
        <p className={`text-sm font-medium ${highlight ? 'text-needs' : ''}`}>{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function LegalPageRow({ label, path }: { label: string; path: string }) {
  return (
    <div className="flex items-center justify-between gap-3 p-2 rounded bg-muted/20">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-green-400" />
        <span className="text-sm">{label}</span>
      </div>
      <a href={path} target="_blank" className="text-needs hover:underline text-xs inline-flex items-center gap-1" data-testid={`link-legal-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        {path} <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}
