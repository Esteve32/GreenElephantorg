import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Shield, Eye, Users, Scale, Cpu, AlertTriangle, RefreshCw } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <SEO
        title="Privacy Policy | GreenElephant"
        description="GreenElephant's privacy policy. Learn how we collect, use, and protect your personal data in compliance with GDPR. Guided by ACX100 AI-Human Experience principles."
        canonicalPath="/privacy"
        keywords="privacy policy, GDPR, data protection, GreenElephant privacy, ACX100, AI ethics"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Privacy Policy", url: "/privacy" }
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-needs text-white">Legal</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-archivo" data-testid="text-privacy-title">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4 italic">
            Thank you for taking this moment to review our privacy practices. We believe in transparency, kindness and mutual respect — in data handling as in dialogue.
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: March 12, 2026
          </p>
        </div>

        <div className="space-y-8">
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>1. Data Controllers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                GreenElephant.org is operated by:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Estève Pannetier</strong> (Finland) — Primary operations, coaching services, and platform administration</li>
                <li><strong>Jonas Pannetier</strong> (France) — Research and clinical psychology services</li>
              </ul>
              <p>
                For privacy inquiries, contact us at:{" "}
                <a href="mailto:esteve@greenelephant.org" className="text-needs hover:underline">
                  esteve@greenelephant.org
                </a>
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>2. What Data We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>We collect the following personal information:</p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Contact Information:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Name and email address (provided voluntarily)</li>
                    <li>Communication preferences</li>
                    <li>GDPR consent records with timestamps</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Service-Related Data:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Retreat waitlist entries (motivation, retreat type preference)</li>
                    <li>Newsletter subscriptions</li>
                    <li>Signals quiz responses (6 communication pattern questions)</li>
                    <li>Check-my-FLOW assessment results</li>
                    <li>Coaching package selections and inquiries</li>
                    <li>Satellite Scan communication analysis results</li>
                    <li>Prompting Playground usage and generated content</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Payment Information:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Payment details processed securely by Stripe (we do not store card information)</li>
                    <li>Transaction records for coaching, retreats, and consulting services</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Authentication & OAuth Data:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Google account data (name, email, profile picture) when you sign in via Google OAuth</li>
                    <li>LinkedIn profile data (name, email, profile identifier) when you sign in via LinkedIn OpenID Connect</li>
                    <li>Notion workspace connection tokens (when you voluntarily connect your Notion workspace)</li>
                    <li>Session identifiers for authentication purposes</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Technical Data:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Session cookies (essential for website functionality)</li>
                    <li>No tracking or analytics cookies without your consent</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>3. Legal Basis for Processing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>We process your data based on:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Consent:</strong> When you sign up for newsletters, waitlists, take the Signals quiz, or connect third-party accounts (Google, LinkedIn, Notion)</li>
                <li><strong>Contract:</strong> When you purchase coaching, retreats, or consulting services</li>
                <li><strong>Legitimate Interest:</strong> For essential website operations, service delivery, and one-time transactional confirmations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>4. How We Use Your Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide coaching, retreat, and consulting services</li>
                <li>Authenticate your identity via email/password, Google, or LinkedIn sign-in</li>
                <li>Deliver personalised communication assessments (Satellite Scan, Check-my-FLOW)</li>
                <li>Send retreat availability updates (waitlist only)</li>
                <li>Deliver newsletter content (newsletter subscribers only)</li>
                <li>Process payments securely via Stripe</li>
                <li>Respond to inquiries and support requests</li>
                <li>Improve our services based on anonymised assessment data</li>
                <li>Push data to your connected Notion workspace (only when you initiate it)</li>
                <li>Comply with legal obligations (tax, accounting)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>5. Data Sharing & Third-Party Processors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>We share your data only with trusted service providers:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Stripe:</strong> Payment processing (subject to Stripe's Privacy Policy and Standard Contractual Clauses)</li>
                <li><strong>Replit:</strong> Website hosting (EEA-compliant infrastructure)</li>
                <li><strong>Resend:</strong> Transactional and onboarding email delivery</li>
                <li><strong>Calendly:</strong> Booking and scheduling (when you book sessions)</li>
                <li><strong>Google:</strong> OAuth authentication (when you choose Google sign-in)</li>
                <li><strong>LinkedIn:</strong> OpenID Connect authentication (when you choose LinkedIn sign-in)</li>
                <li><strong>Notion:</strong> Workspace integration (only when you voluntarily connect your workspace)</li>
                <li><strong>Thesys.dev:</strong> AI-powered communication visualisations (no personal data shared — only anonymised queries)</li>
              </ul>
              <p className="mt-4">
                We do not sell, rent, or share your data with third parties for marketing purposes.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>6. OAuth & Third-Party Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                When you choose to sign in using Google or LinkedIn, we receive limited profile information
                from these providers. Here is exactly what we access and store:
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Google Sign-In:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Name, email address, and profile picture</li>
                    <li>Google account identifier (for login purposes only)</li>
                    <li>We do not access your Google contacts, calendar, or drive</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">LinkedIn Sign-In (OpenID Connect):</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Name, email address, and LinkedIn profile identifier</li>
                    <li>We request only <code className="text-xs bg-muted px-1 py-0.5 rounded">openid</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">profile</code>, and <code className="text-xs bg-muted px-1 py-0.5 rounded">email</code> scopes</li>
                    <li>We do not access your LinkedIn connections, posts, or company page data</li>
                    <li>We do not post to LinkedIn on your behalf</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Notion Workspace Connection:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Workspace name and bot access token (to push data you request)</li>
                    <li>We only write to pages you explicitly grant access to</li>
                    <li>We never read your existing Notion data</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4">
                You can disconnect any third-party service at any time from your{" "}
                <a href="/portal/settings" className="text-needs hover:underline">Portal Settings</a>.
                When you disconnect, we delete the stored access tokens immediately.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>7. Cross-Border Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Your data is stored within the European Economic Area (EEA). If we use processors outside the EEA,
                we ensure adequate protection through Standard Contractual Clauses (SCCs) or other approved mechanisms
                under GDPR Article 46.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>8. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>We retain your data as follows:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Contact & Marketing Data:</strong> 24 months from last interaction (unless you withdraw consent earlier)</li>
                <li><strong>Retreat Waitlists:</strong> Until retreat cycle ends + 12 months</li>
                <li><strong>Assessment Data:</strong> 12 months for benchmarking (anonymised after 6 months)</li>
                <li><strong>OAuth Tokens:</strong> Until you disconnect the service or delete your account</li>
                <li><strong>Portal Account Data:</strong> Until you request deletion</li>
                <li><strong>Contracts & Payments:</strong> 6–10 years per EU tax and accounting regulations</li>
              </ul>
              <p className="mt-4">
                After retention periods expire, we securely delete or anonymise your data.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>9. Your GDPR Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Under GDPR (Regulation 2016/679), you have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your data (right to be forgotten)</li>
                <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
                <li><strong>Restriction:</strong> Limit how we process your data</li>
                <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                <li><strong>Withdraw Consent:</strong> Unsubscribe from marketing communications at any time</li>
                <li><strong>Automated Decisions:</strong> Not be subject to decisions based solely on automated processing</li>
              </ul>
              <p className="mt-4">
                To exercise your rights, email us at{" "}
                <a href="mailto:esteve@greenelephant.org" className="text-needs hover:underline">
                  esteve@greenelephant.org
                </a>
                . We will respond within 30 days.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>10. How to Request Data Deletion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>You can request deletion of your data at any time by:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Emailing <a href="mailto:esteve@greenelephant.org" className="text-needs hover:underline">esteve@greenelephant.org</a> with the subject "Data Deletion Request"</li>
                <li>Disconnecting OAuth services from your <a href="/portal/settings" className="text-needs hover:underline">Portal Settings</a></li>
                <li>Requesting account deletion from within your portal dashboard</li>
              </ul>
              <p className="mt-4">
                Upon receiving your request, we will delete your personal data within 30 days,
                except where we are legally required to retain it (e.g., tax records).
                We will confirm deletion by email.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>11. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We implement appropriate technical and organisational measures to protect your data:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encrypted data transmission (HTTPS/TLS)</li>
                <li>Secure password hashing with per-user salts (scrypt)</li>
                <li>OAuth tokens stored server-side only (never exposed to the browser)</li>
                <li>Access controls and session-based authentication</li>
                <li>Regular security updates and monitoring</li>
                <li>Data Processing Agreements with all processors</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10 border-l-4 border-l-needs/50">
            <CardHeader>
              <div className="flex items-center gap-3 flex-wrap">
                <CardTitle>12. AI Ethics & the ACX100 Framework</CardTitle>
                <Badge variant="outline" className="text-xs border-needs/30 text-needs">Care by Design</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
              <p>
                GreenElephant.org uses AI-powered tools to enhance communication coaching and assessments.
                We are committed to responsible AI use, guided by the{" "}
                <a href="https://arbora.partners" target="_blank" rel="noopener noreferrer" className="text-needs hover:underline font-semibold">
                  ACX100 AI-Human Experience Framework
                </a>{" "}
                developed by Arbora Partners — an 8-pillar framework for ethical AI deployment.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Users className="h-5 w-5 text-needs mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">I. Human Agency & Oversight</h4>
                    <p className="text-xs">Every AI-generated insight includes human-in-the-loop review. You always see when AI is involved, and a human coach validates all assessment outcomes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Eye className="h-5 w-5 text-needs mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">II. Transparency & Explainability</h4>
                    <p className="text-xs">AI-generated content is clearly labelled. Our Satellite Scan and Flow assessments explain how results are derived. See our <a href="/ai-policy" className="text-needs hover:underline">AI Policy</a> for details.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Shield className="h-5 w-5 text-needs mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">III. Accountability</h4>
                    <p className="text-xs">Clear responsibility is assigned for all AI outputs. Estève Pannetier is accountable for AI system decisions, with defined incident response procedures.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Scale className="h-5 w-5 text-needs mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">IV. Data Governance</h4>
                    <p className="text-xs">Formal data governance for all AI training data. Access is role-based, processing complies with GDPR, and data lineage is documented.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Users className="h-5 w-5 text-needs mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">V. Fairness & Non-Discrimination</h4>
                    <p className="text-xs">Our assessments are designed to respect all communication styles equally. We actively test for bias and welcome feedback on perceived unfairness.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Cpu className="h-5 w-5 text-needs mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">VI. Technical Robustness</h4>
                    <p className="text-xs">Safety-by-design principles with graceful fallbacks when AI services are unavailable. Regular monitoring for drift and emerging risks.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <AlertTriangle className="h-5 w-5 text-needs mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">VII. Risk-Based Approach</h4>
                    <p className="text-xs">Our AI systems are classified as minimal/limited risk under the EU AI Act. We maintain a risk register and "red line" policy for unacceptable AI applications.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <RefreshCw className="h-5 w-5 text-needs mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">VIII. Continuous Monitoring</h4>
                    <p className="text-xs">Post-deployment monitoring of all AI systems. We track regulatory changes (EU AI Act, OECD guidelines) and adapt our practices accordingly.</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground/70 mt-4">
                The ACX100 framework comprises 80 evaluation criteria across 8 sections, rated on a 1–5 scale.
                We conduct self-audits after every major platform update. Full framework details at{" "}
                <a href="https://arbora.partners" target="_blank" rel="noopener noreferrer" className="text-needs hover:underline">
                  arbora.partners
                </a>.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>13. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Our services are intended for adults (18+). We do not knowingly collect data from children under 16.
                If you believe we have collected data from a child, please contact us immediately.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>14. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We may update this Privacy Policy to reflect changes in our practices or legal requirements.
                We will notify you of significant changes via email or website notice. Continued use of our
                services constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>15. Supervisory Authority</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                If you have concerns about how we handle your data, you have the right to lodge a complaint with
                your local data protection authority:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Finland:</strong> Tietosuojavaltuutetun toimisto (Office of the Data Protection Ombudsman)</li>
                <li><strong>France:</strong> Commission Nationale de l'Informatique et des Libertés (CNIL)</li>
              </ul>
            </CardContent>
          </Card>

          <div className="backdrop-blur-sm bg-needs/10 border border-needs/20 rounded-2xl p-8 text-center">
            <Mail className="h-12 w-12 text-needs mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We're committed to transparency and protecting your rights. Contact us anytime.
            </p>
            <a
              href="mailto:esteve@greenelephant.org"
              className="text-needs hover:underline text-lg font-semibold"
              data-testid="link-privacy-email"
            >
              esteve@greenelephant.org
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
