import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminTooltip } from "@/components/AdminTooltip";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle2, XCircle, Copy, ExternalLink, Shield, Linkedin, AlertTriangle } from "lucide-react";
import { SEO } from "@/components/SEO";

function CopyBlock({ label, value }: { label: string; value: string }) {
  const { toast } = useToast();
  return (
    <div className="flex items-center gap-2 bg-muted/30 rounded-md p-3">
      <code className="text-xs text-needs flex-1 break-all" data-testid={`text-copy-${label.toLowerCase().replace(/\s+/g, '-')}`}>{value}</code>
      <Tooltip><TooltipTrigger asChild><Button
        size="icon"
        variant="ghost"
        onClick={() => { navigator.clipboard.writeText(value); toast({ title: "Copied!", description: label }); }}
        data-testid={`button-copy-${label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <Copy className="h-4 w-4" />
      </Button></TooltipTrigger><TooltipContent>Copy {label} to clipboard</TooltipContent></Tooltip>
    </div>
  );
}

export default function LinkedInSetupAdmin() {
  const { toast } = useToast();

  const { data: testResult, isLoading } = useQuery<{
    configured: boolean;
    clientIdPresent: boolean;
    clientSecretPresent: boolean;
    redirectUri: string;
    scopes: string;
  }>({
    queryKey: ["/api/admin/linkedin/test"],
  });

  const { data: settings } = useQuery<Record<string, string>>({
    queryKey: ["/api/admin/settings"],
  });

  const toggleMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      await apiRequest("POST", "/api/admin/settings", {
        key: "linkedin_oauth_enabled",
        value: String(enabled),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({ title: "Setting saved" });
    },
  });

  const linkedinEnabled = settings?.linkedin_oauth_enabled !== "false";
  const isConfigured = testResult?.configured ?? false;

  const devRedirectUri = testResult?.redirectUri || "Loading...";
  const prodRedirectUri = `https://greenelephant.org/api/portal/auth/linkedin/callback`;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#0a0a0a]">
      <SEO title="LinkedIn OAuth Setup | Admin" description="Configure LinkedIn OAuth integration and OIDC login for the GreenElephant portal." canonicalPath="/admin/linkedin-setup" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <Tooltip><TooltipTrigger asChild><a href="/admin/submissions" data-testid="link-admin-back">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </a></TooltipTrigger><TooltipContent>Back to Admin Hub</TooltipContent></Tooltip>
          <div className="flex items-center gap-3 flex-wrap">
            <Linkedin className="h-8 w-8 text-[#0A66C2]" />
            <h1 className="text-3xl font-bold" data-testid="text-linkedin-setup-title">LinkedIn OAuth Setup</h1>
            <AdminTooltip
              what="Step-by-step guide to connect LinkedIn sign-in to GreenElephant's client portal."
              how="Follow each numbered step. Green checks mean done, red X means action needed."
              debug={[
                { label: "LinkedIn Developer Portal", href: "https://www.linkedin.com/developers/" },
                { label: "Privacy Policy", href: "/privacy" },
              ]}
            />
          </div>
        </div>

        <div className="space-y-6">

          <Card className="border-needs/30 bg-card/50">
            <CardHeader>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <CardTitle className="flex items-center gap-2">
                  Status
                  {isConfigured ? (
                    <Badge className="bg-green-500/20 text-green-400">Configured</Badge>
                  ) : (
                    <Badge className="bg-yellow-500/20 text-yellow-400">Setup Required</Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">LinkedIn Login</span>
                  <Tooltip><TooltipTrigger asChild><Button
                    variant={linkedinEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleMutation.mutate(!linkedinEnabled)}
                    disabled={toggleMutation.isPending}
                    data-testid="button-toggle-linkedin"
                  >
                    {linkedinEnabled ? "Enabled" : "Disabled"}
                  </Button></TooltipTrigger><TooltipContent>{linkedinEnabled ? "Disable" : "Enable"} LinkedIn OAuth login for the portal</TooltipContent></Tooltip>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  {testResult?.clientIdPresent ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <XCircle className="h-4 w-4 text-red-400" />}
                  <span>LINKEDIN_CLIENT_ID</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {testResult?.clientSecretPresent ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <XCircle className="h-4 w-4 text-red-400" />}
                  <span>LINKEDIN_CLIENT_SECRET</span>
                </div>
              </div>
              {isLoading && <p className="text-sm text-muted-foreground">Checking configuration...</p>}
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Step 0: Privacy Policy
                <AdminTooltip
                  what="LinkedIn requires a public privacy policy URL before approving your app."
                  how="Your privacy policy at /privacy is already updated with LinkedIn OAuth data disclosure, GDPR rights, and ACX100 AI ethics."
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Your privacy policy must be publicly accessible and mention LinkedIn data usage.
                The policy has already been updated with OAuth, GDPR, and ACX100 sections.
              </p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-400">Privacy policy is live and LinkedIn-ready</span>
              </div>
              <CopyBlock label="Privacy Policy URL (prod)" value="https://greenelephant.org/privacy" />
              <a href="/privacy" target="_blank" className="text-needs hover:underline text-sm inline-flex items-center gap-1" data-testid="link-preview-privacy">
                Preview privacy policy <ExternalLink className="h-3 w-3" />
              </a>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Step 1: Create LinkedIn Developer App
                <AdminTooltip
                  what="Create a new app in the LinkedIn Developer portal to get Client ID and Secret."
                  how="Sign in with Steve's LinkedIn admin account (the one that manages the GreenElephant page). Click 'Create app' and fill in the details below."
                  debug={[{ label: "LinkedIn Developers", href: "https://www.linkedin.com/developers/" }]}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">App Details to Enter:</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="text-needs font-mono shrink-0">App name:</span>
                    <span>GreenElephant — LinkedIn Data Bridge (OIDC + Analytics)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-needs font-mono shrink-0">Company:</span>
                    <span>Select the GreenElephant LinkedIn company page</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-needs font-mono shrink-0">Privacy URL:</span>
                    <span>https://greenelephant.org/privacy</span>
                  </div>
                </div>
              </div>
              <a
                href="https://www.linkedin.com/developers/"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-linkedin-developers"
              >
                <Tooltip><TooltipTrigger asChild><Button variant="outline" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Open LinkedIn Developer Portal
                </Button></TooltipTrigger><TooltipContent>Open LinkedIn Developer Portal to create or manage your app</TooltipContent></Tooltip>
              </a>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Step 2: Request API Products
                <AdminTooltip
                  what="You need to request specific LinkedIn API products for your app."
                  how="Go to the Products tab in your LinkedIn app. Request 'Sign In with LinkedIn using OpenID Connect' first (MVP). Then optionally request 'Share on LinkedIn' and analytics products."
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-400 border-green-400/30">Required</Badge>
                  <span>Sign In with LinkedIn using OpenID Connect</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">Optional</Badge>
                  <span>Share on LinkedIn</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">Optional</Badge>
                  <span>Community Management API / Marketing Analytics (may need approval)</span>
                </div>
              </div>
              <div className="bg-muted/20 rounded-md p-3 text-xs text-muted-foreground">
                <AlertTriangle className="h-3.5 w-3.5 text-yellow-400 inline mr-1" />
                Analytics products may require LinkedIn partner approval — submit the request and continue with OIDC login in the meantime.
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Step 3: Set Redirect URIs
                <AdminTooltip
                  what="LinkedIn must know exactly where to send users back after login."
                  how="Go to Auth tab → OAuth 2.0 settings → add both redirect URIs below. They must match EXACTLY (no trailing slash)."
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <h4 className="font-semibold text-sm">Development (Replit):</h4>
              <CopyBlock label="Dev Redirect URI" value={devRedirectUri} />
              <h4 className="font-semibold text-sm mt-4">Production:</h4>
              <CopyBlock label="Prod Redirect URI" value={prodRedirectUri} />
              <div className="bg-muted/20 rounded-md p-3 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5 text-needs inline mr-1" />
                The redirect URI must match byte-for-byte. No trailing slashes, correct protocol (https), exact path.
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Step 4: Copy Credentials
                <AdminTooltip
                  what="Copy Client ID and Client Secret from the Auth tab of your LinkedIn app."
                  how="Never paste these in Notion or any public document. Store only in Replit Secrets."
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                From the <strong>Auth</strong> tab, copy both values and add them as Replit Secrets:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 p-2 rounded bg-muted/20">
                  <code className="text-needs">LINKEDIN_CLIENT_ID</code>
                  <span className="text-muted-foreground">→ Your app's Client ID</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted/20">
                  <code className="text-needs">LINKEDIN_CLIENT_SECRET</code>
                  <span className="text-muted-foreground">→ Your app's Client Secret</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                In Replit: Click the lock icon (Secrets) → Add each key-value pair → Restart the app.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Step 5: Test the Connection
                <AdminTooltip
                  what="After adding secrets, verify the OAuth flow works end-to-end."
                  how="The status card at the top should show green checks for both secrets. Then try signing in from the portal login page."
                  debug={[
                    { label: "Portal Login", href: "/portal/login" },
                    { label: "Test API", href: "/api/admin/linkedin/test" },
                  ]}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-needs font-mono shrink-0">1.</span>
                  <span>Check the Status card above — both secrets should show green checks</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-needs font-mono shrink-0">2.</span>
                  <span>Enable the "LinkedIn Login" toggle at the top</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-needs font-mono shrink-0">3.</span>
                  <span>Open the <a href="/portal/login" className="text-needs hover:underline">Portal Login page</a> in an incognito window</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-needs font-mono shrink-0">4.</span>
                  <span>Click "Continue with LinkedIn" and complete the flow</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-needs font-mono shrink-0">5.</span>
                  <span>You should land on the Portal Dashboard with your LinkedIn name/email</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Future: Analytics & Community APIs
                <AdminTooltip
                  what="These APIs require partner approval and are not needed for login."
                  how="Submit product requests in the LinkedIn Developer portal. Once approved, additional endpoints will be available for team outreach metrics and page analytics."
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Once LinkedIn approves analytics products, you can track:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Page follower growth and engagement</li>
                <li>Post performance analytics</li>
                <li>Team outreach funnel (invitations sent → accepted → replied)</li>
              </ul>
              <p className="text-xs">
                The backend is ready for these features. When approved, the data model already supports
                storing LinkedIn access tokens with expiry tracking.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Common Errors
                <AdminTooltip
                  what="Quick reference for debugging LinkedIn OAuth issues."
                  how="Check these if the login flow fails."
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="p-2 rounded bg-muted/20">
                  <code className="text-red-400">redirect_uri_mismatch</code>
                  <p className="text-muted-foreground text-xs mt-1">The redirect URI in your app settings doesn't match exactly. Check for trailing slashes or protocol differences.</p>
                </div>
                <div className="p-2 rounded bg-muted/20">
                  <code className="text-red-400">403 on analytics endpoints</code>
                  <p className="text-muted-foreground text-xs mt-1">Product not approved yet, or account is not an org/page admin.</p>
                </div>
                <div className="p-2 rounded bg-muted/20">
                  <code className="text-red-400">No refresh token</code>
                  <p className="text-muted-foreground text-xs mt-1">LinkedIn access tokens expire. Users will need to re-authenticate when the token expires.</p>
                </div>
                <div className="p-2 rounded bg-muted/20">
                  <code className="text-red-400">state_mismatch</code>
                  <p className="text-muted-foreground text-xs mt-1">Session expired between starting and completing login. Try again in a fresh browser tab.</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
