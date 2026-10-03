import { PAGE_METADATA } from "@shared/page-metadata";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Shield, Eye, Users, Scale, Cpu, AlertTriangle, RefreshCw } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function PrivacyPolicyPage() {
  useEffect(() => { document.title = "Privacy Policy | GreenElephant"; }, []);
  return (
    <div className="min-h-screen pt-24 pb-16">
      <SEO
        {...PAGE_METADATA["/privacy"]}
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
            Last updated: October 3, 2026
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
                    <li>Optional Google Analytics, only after acceptance: public home, Scan and coaching-page visits, broad referral categories and selected enquiry/checkout-link clicks; no assessment answers, scores, form contents or private routes. Google also processes technical request information and cookie identifiers. Manage or withdraw your choice using “Cookie choices”; see the <a href="/cookies" className="text-needs underline">cookie policy</a>.</li>
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
                <li>Maintain the service and investigate technical problems using only the information needed</li>
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
                <li><strong>Replit:</strong> Website hosting. Replit documents US hosting by default; EU hosting requires an agreed Enterprise arrangement.</li>
                <li><strong>Resend:</strong> Purchase, assessment-results and dashboard email delivery. Results emails include your answers and copy Estève and Anu as the coaches supporting the service.</li>
                <li><strong>Typeform:</strong> Hosts the Scan questionnaire and passes submitted answers to our service.</li>
                <li><strong>Cloudflare:</strong> Delivers and protects the website; technical request data may be processed for security.</li>
                <li><strong>Calendly:</strong> Booking and scheduling (when you book sessions)</li>
                <li><strong>Google:</strong> OAuth authentication (when you choose Google sign-in), and optional GA4 website measurement after analytics consent. Cookie expiry does not determine account-side retention or erase historical analytics data.</li>
                <li><strong>LinkedIn:</strong> OpenID Connect authentication (when you choose LinkedIn sign-in)</li>
                <li><strong>Notion:</strong> Contact and service records in our team workspace where the relevant integration is enabled; optional exports to a workspace you connect</li>
                <li><strong>Thesys.dev:</strong> AI-powered communication visualisations; the prompt and data supplied for a visualisation are processed by this provider</li>
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
                Our providers may process data outside the European Economic Area, including in the United States.
                The safeguards depend on the provider and service agreement. Contact us for details about
                the providers, transfer safeguards and service settings used for your data.
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
                <li><strong>Assessment Data:</strong> Contact us about the retention period for your assessment and to request deletion. Automatic anonymisation is not currently provided by this application.</li>
                <li><strong>OAuth Tokens:</strong> Until you disconnect the service or delete your account</li>
                <li><strong>Portal Account Data:</strong> Until you request deletion</li>
                <li><strong>Contracts & Payments:</strong> 6–10 years per EU tax and accounting regulations</li>
              </ul>
              <p className="mt-4">
                Retention and deletion requests are handled by the team. Contact us to confirm the schedule that applies to your service and any records we must retain by law.
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
                <li>Contact us for details of the processor agreements and safeguards that apply to your service</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader><CardTitle>12. Human-centred AI use</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>AI supports the work of our coaches. People remain responsible for the service
                and for decisions about their own communication. Our ACX teaching map draws on
                Estève’s AI and communication research with <a href="https://www.arbora.partners/research"
                  target="_blank" rel="noopener noreferrer" className="text-needs hover:underline">Arbora</a>.</p>
              <p>The teaching map is not a certification, a clinical diagnosis or a legal compliance
                assessment. Read our <a href="/ai-policy" className="text-needs hover:underline">AI Policy</a>
                {' '}for more about how we use AI, or contact Estève to discuss a concern.</p>
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
                We will notify you of significant changes via email or website notice. Where consent is required,
                we will ask for it separately; continuing to browse does not provide that consent.
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
