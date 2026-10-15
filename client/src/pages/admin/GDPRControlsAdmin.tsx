import { AdminLearningPanel } from "@/components/admin/AdminLearning";
import { AdminTroubleshooting } from "@/components/admin/AdminTroubleshooting";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminTooltip } from "@/components/AdminTooltip";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Shield, Database, Mail, Users, Eye, Scale, Cpu, AlertTriangle, RefreshCw, ExternalLink } from "lucide-react";
import { SEO } from "@/components/SEO";

class SettingsError extends Error {
  constructor(readonly status: number) { super('Settings request failed'); }
}

function settingsHelp(error: unknown, saving = false) {
  if (error instanceof SettingsError && error.status === 401) return 'sign_in_required';
  if (error instanceof SettingsError && error.status === 403) return 'settings_access_required';
  return saving ? 'settings_save_unconfirmed' : 'settings_unavailable';
}

export default function GDPRControlsAdmin() {
  const { toast } = useToast();

  const { data: settings, isPending, isFetching, error, refetch } = useQuery<Record<string, string>>({
    queryKey: ["/api/admin/settings", "gdpr-controls"],
    queryFn: async ({ signal }) => {
      const response = await fetch('/api/admin/settings', { credentials: 'include', signal });
      if (!response.ok) throw new SettingsError(response.status);
      const data: unknown = await response.json();
      if (!data || typeof data !== 'object' || Array.isArray(data) ||
        !Object.values(data).every(value => typeof value === 'string')) throw new SettingsError(502);
      const values = data as Record<string, string>;
      for (const key of ['portal_login_enabled', 'linkedin_oauth_enabled']) {
        if (values[key] !== undefined && !['true', 'false'].includes(values[key])) throw new SettingsError(502);
      }
      return values;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    retry: false,
  });

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const response = await fetch('/api/admin/settings', {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      if (!response.ok) throw new SettingsError(response.status);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      toast({ title: "Setting saved" });
    },
  });

  // Both connected switches default to allowed on the server unless explicitly false.
  // This describes the saved permission, not provider configuration/readiness.
  const isEnabled = (key: string) => ['portal_login_enabled', 'linkedin_oauth_enabled'].includes(key)
    ? settings?.[key] !== 'false' : settings?.[key] === 'true';
  const toggleSetting = (key: string) => {
    if (!settings || error || isFetching || updateSetting.isPending || updateSetting.error) return;
    const current = isEnabled(key);
    updateSetting.mutate({ key, value: String(!current) });
  };

  const problem = error ? settingsHelp(error) : updateSetting.error ? settingsHelp(updateSetting.error, true) : null;
  const checkSettings = () => { updateSetting.reset(); void refetch(); };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#0a0a0a]">
      <SEO title="GDPR & Data Controls | Admin" description="Review privacy-control implementation and learn data-protection concepts." canonicalPath="/admin/gdpr-controls" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <Tooltip><TooltipTrigger asChild><a href="/admin/submissions" data-testid="link-admin-back">
            <Button variant="ghost" size="icon" aria-label="Back to Admin Hub"><ArrowLeft className="h-4 w-4" /></Button>
          </a></TooltipTrigger><TooltipContent>Back to Admin Hub</TooltipContent></Tooltip>
          <div className="flex items-center gap-3 flex-wrap">
            <Shield className="h-8 w-8 text-needs" />
            <h1 className="text-3xl font-bold" data-testid="text-gdpr-controls-title">GDPR & Data Controls</h1>
            <AdminTooltip
              what="Implementation overview and privacy learning tools. This page does not certify GDPR compliance."
              how="Only connected settings can be changed. Unconnected controls are labelled and disabled; learning explanations are available by hover, focus or tap."
              debug={[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "AI Policy", href: "/ai-policy" },
                { label: "ACX100 Framework", href: "https://arbora.partners" },
              ]}
            />
          </div>
        </div>

        <AdminLearningPanel topics={["gdpr", "basis", "consent", "retention", "rights", "breach"]} />
        <p className="rounded-lg border border-amber-300/30 bg-amber-300/10 p-4 mb-6 text-base">Implementation review: most switches below are not connected to server controls. They do not stop collection or sending. Use the fictional training view for demonstrations.</p>

        {isPending || isFetching ? (
          <div className="h-32 flex items-center justify-center gap-3" role="status">
            <div aria-hidden="true" className="animate-spin h-6 w-6 border-2 border-needs border-t-transparent rounded-full" />
            <span>Checking current settings…</span>
          </div>
        ) : problem ? (
          <AdminTroubleshooting code={problem} onCheckSettings={problem.startsWith('settings_') && problem !== 'settings_access_required' ? checkSettings : undefined} />
        ) : (
          <div className="space-y-6">

            <Card className="bg-card/50 border-needs/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-needs" />
                  Data Collection Controls
                  <AdminTooltip
                    what="Review proposed controls for collection and the connected portal setting."
                    how="Unconnected switches do not control collection. Retention and cleanup require a separate implemented process."
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
                    connected
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
                    how="Only settings marked connected can be changed here. Website administrator Google login is separate from customer portal login."
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
                  connected
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
                    how="These proposed switches are not connected to email sending. The current sender behaviour is unchanged."
                    debug={[{ label: "Email Control Room", href: "/admin/email-control-room" }]}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ToggleRow
                  label="Confirmation Emails"
                  description="Proposed confirmation-email control; delivery alone is not consent evidence"
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
                    how="No approved schedule or automated cleanup is established by this display. Review each category and its lawful purpose before setting a period."
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RetentionRow
                  label="Contact & Marketing Data"
                  current="Not verified"
                  unit="Retention decision and cleanup pending"
                  onSave={(val) => updateSetting.mutate({ key: "gdpr_retention_contact", value: val })}
                  isPending={updateSetting.isPending}
                />
                <RetentionRow
                  label="Assessment Results"
                  current="Not verified"
                  unit="Retention and anonymisation are not verified"
                  onSave={(val) => updateSetting.mutate({ key: "gdpr_retention_assessments", value: val })}
                  isPending={updateSetting.isPending}
                />
                <RetentionRow
                  label="Waitlist Entries"
                  current="Not verified"
                  unit="Retention decision and cleanup pending"
                  onSave={(val) => updateSetting.mutate({ key: "gdpr_retention_waitlist", value: val })}
                  isPending={updateSetting.isPending}
                />
                <RetentionRow
                  label="Payment/Contract Records"
                  current="Not verified"
                  unit="Assess applicable accounting obligations before approving a period"
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
                  Use these reflection prompts as discussion material, not a legal audit or certification.
                  Rate each 1-5. Sections most relevant to GreenElephant are highlighted.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <AuditPillar icon={Users} label="I. Human Agency & Oversight" highlight={false} description="Human-in-the-loop for AI decisions" />
                  <AuditPillar icon={Eye} label="II. Transparency" highlight description="AI content clearly labelled" />
                  <AuditPillar icon={Shield} label="III. Accountability" highlight description="Clear responsibility for AI outcomes" />
                  <AuditPillar icon={Database} label="IV. Data Governance" highlight={false} description="Formal data framework for AI" />
                  <AuditPillar icon={Scale} label="V. Fairness" highlight description="Review potential bias in assessments" />
                  <AuditPillar icon={Cpu} label="VI. Technical Robustness" highlight description="Graceful AI failure handling" />
                  <AuditPillar icon={AlertTriangle} label="VII. Risk-Based Approach" highlight={false} description="Assess applicable AI obligations" />
                  <AuditPillar icon={RefreshCw} label="VIII. Continuous Monitoring" highlight={false} description="Post-deploy monitoring" />
                </div>
                <div className="flex gap-3 flex-wrap">
                  <a href="https://arbora.partners" target="_blank" rel="noopener noreferrer">
                    <Tooltip><TooltipTrigger asChild><Button variant="outline" size="sm" className="gap-2" data-testid="button-acx100-framework">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Full ACX100 Framework
                    </Button></TooltipTrigger><TooltipContent>Open the ACX100 AI-Human Experience audit framework</TooltipContent></Tooltip>
                  </a>
                  <a href="/ai-policy">
                    <Tooltip><TooltipTrigger asChild><Button variant="outline" size="sm" className="gap-2" data-testid="button-ai-policy">
                      <Eye className="h-3.5 w-3.5" />
                      View AI Policy
                    </Button></TooltipTrigger><TooltipContent>View GreenElephant's public AI policy page</TooltipContent></Tooltip>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Policy pages — review links
                  <AdminTooltip
                    what="Links to policy pages for human review."
                    how="A link does not verify its contents, legal adequacy or current HTTP status."
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

function ToggleRow({ label, description, enabled, onToggle, isPending, connected = false }: {
  label: string;
  description: string;
  connected?: boolean;
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
      <Tooltip><TooltipTrigger asChild><Button
        variant={connected && enabled ? "default" : "outline"}
        size="sm"
        onClick={onToggle}
        disabled={isPending || !connected}
        aria-label={`${label}: ${connected ? (enabled ? 'On' : 'Off') : 'Not connected'}`}
        aria-pressed={connected ? enabled : undefined}
        data-testid={`button-toggle-${label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {connected ? (enabled ? "On" : "Off") : "Not connected"}
      </Button></TooltipTrigger><TooltipContent>{connected ? (enabled ? "Click to disable" : "Click to enable") : "No server control is connected for"} {label.toLowerCase()}</TooltipContent></Tooltip>
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
        <Badge variant="outline" className="font-mono">{current}</Badge>
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
        <ExternalLink className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{label}</span>
      </div>
      <a href={path} target="_blank" className="text-needs hover:underline text-xs inline-flex items-center gap-1" data-testid={`link-legal-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        {path} <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}
