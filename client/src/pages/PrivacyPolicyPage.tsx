import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-needs text-white">Legal</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-archivo">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: November 21, 2025
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
                <li><strong>Estève Pannetier</strong> (Finland) - Primary operations and coaching services</li>
                <li><strong>Jonas Pannetier</strong> (France) - Research and clinical psychology services</li>
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
                    <li>Coaching package selections and inquiries</li>
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
                <li><strong>Consent:</strong> When you sign up for newsletters, waitlists, or take the Signals quiz</li>
                <li><strong>Contract:</strong> When you purchase coaching, retreats, or consulting services</li>
                <li><strong>Legitimate Interest:</strong> For essential website operations and service delivery</li>
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
                <li>Send retreat availability updates (waitlist only)</li>
                <li>Deliver newsletter content (newsletter subscribers only)</li>
                <li>Process payments securely via Stripe</li>
                <li>Respond to inquiries and support requests</li>
                <li>Improve our services based on quiz data (anonymized)</li>
                <li>Comply with legal obligations (tax, accounting)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>5. Data Sharing & Processors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>We share your data only with trusted service providers:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Stripe:</strong> Payment processing (subject to Stripe's Privacy Policy and Standard Contractual Clauses)</li>
                <li><strong>Replit:</strong> Website hosting (EEA-compliant infrastructure)</li>
                <li><strong>Calendly:</strong> Booking and scheduling (when you book sessions)</li>
              </ul>
              <p className="mt-4">
                We do not sell, rent, or share your data with third parties for marketing purposes.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>6. Cross-Border Data Transfers</CardTitle>
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
              <CardTitle>7. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>We retain your data as follows:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Contact & Marketing Data:</strong> 24 months from last interaction (unless you withdraw consent earlier)</li>
                <li><strong>Retreat Waitlists:</strong> Until retreat cycle ends + 12 months</li>
                <li><strong>Quiz Data:</strong> 12 months for benchmarking (anonymized after 6 months)</li>
                <li><strong>Contracts & Payments:</strong> 6-10 years per EU tax and accounting regulations</li>
              </ul>
              <p className="mt-4">
                After retention periods expire, we securely delete or anonymize your data.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>8. Your GDPR Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Under GDPR, you have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your data (right to be forgotten)</li>
                <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
                <li><strong>Restriction:</strong> Limit how we process your data</li>
                <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                <li><strong>Withdraw Consent:</strong> Unsubscribe from marketing communications at any time</li>
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
              <CardTitle>9. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We implement appropriate technical and organizational measures to protect your data:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encrypted data transmission (HTTPS/TLS)</li>
                <li>Secure password hashing (where applicable)</li>
                <li>Access controls and authentication</li>
                <li>Regular security updates and monitoring</li>
                <li>Data Processing Agreements with all processors</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>10. Children's Privacy</CardTitle>
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
              <CardTitle>11. Changes to This Policy</CardTitle>
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
              <CardTitle>12. Supervisory Authority</CardTitle>
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
            >
              esteve@greenelephant.org
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
