import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cookie } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-needs text-white">Legal</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-archivo">
            Cookie Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4 italic">
            We keep things simple. Thank you for reviewing how we use cookies—only what's essential for your experience.
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: November 26, 2025
          </p>
        </div>

        <div className="space-y-8">
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>What Are Cookies?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Cookies are small text files stored on your device when you visit a website. They help websites 
                remember your preferences, maintain your session, and improve your browsing experience.
              </p>
              <p>
                At GreenElephant.org, we believe in transparency and minimal data collection. We only use cookies 
                that are essential for the website to function properly.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-needs"></span>
                  Essential Cookies (Strictly Necessary)
                </h3>
                <p className="mb-3">
                  These cookies are required for the website to function and cannot be disabled:
                </p>
                <div className="bg-background/50 rounded-lg p-4 border border-white/10">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 font-semibold text-foreground">Cookie Name</th>
                        <th className="text-left py-2 font-semibold text-foreground">Purpose</th>
                        <th className="text-left py-2 font-semibold text-foreground">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 font-mono text-xs">connect.sid</td>
                        <td className="py-2">Session management (keeps you logged in)</td>
                        <td className="py-2">Session (deleted when browser closes)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-muted"></span>
                  Analytics Cookies (Currently Not Used)
                </h3>
                <p>
                  We do not currently use analytics or tracking cookies. If we decide to implement analytics in the 
                  future, we will:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li>Request your explicit consent before placing any analytics cookies</li>
                  <li>Provide clear information about what data is collected</li>
                  <li>Allow you to opt-out at any time</li>
                  <li>Use privacy-respecting analytics tools that anonymize your data</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-muted"></span>
                  Marketing Cookies (Not Used)
                </h3>
                <p>
                  We do not use marketing, advertising, or social media tracking cookies. We respect your privacy and 
                  do not track your behavior across other websites.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Some third-party services we use may set their own cookies:</p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Stripe (Payment Processing):</h3>
                  <p>
                    When you make a payment, Stripe may set cookies for fraud prevention and security. These cookies 
                    are governed by{" "}
                    <a 
                      href="https://stripe.com/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-needs hover:underline"
                    >
                      Stripe's Privacy Policy
                    </a>
                    .
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Calendly (Booking):</h3>
                  <p>
                    When you book a session via Calendly, their platform may use cookies. See{" "}
                    <a 
                      href="https://calendly.com/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-needs hover:underline"
                    >
                      Calendly's Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>How to Manage Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                You can control and manage cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>View what cookies are stored and delete them individually</li>
                <li>Block third-party cookies</li>
                <li>Block all cookies from specific websites</li>
                <li>Delete all cookies when you close your browser</li>
                <li>Browse in "incognito" or "private" mode (cookies deleted when you close the window)</li>
              </ul>

              <div className="mt-6 bg-background/50 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-foreground mb-3">Browser-Specific Instructions:</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a 
                      href="https://support.google.com/chrome/answer/95647" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-needs hover:underline"
                    >
                      Google Chrome
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-needs hover:underline"
                    >
                      Mozilla Firefox
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-needs hover:underline"
                    >
                      Safari
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-needs hover:underline"
                    >
                      Microsoft Edge
                    </a>
                  </li>
                </ul>
              </div>

              <p className="mt-4 text-sm">
                <strong>Note:</strong> Blocking essential cookies may prevent the website from functioning properly. 
                You may not be able to use certain features like maintaining your session.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>Your Rights Under GDPR</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Under the General Data Protection Regulation (GDPR), you have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Know what cookies are being used and why</li>
                <li>Refuse non-essential cookies</li>
                <li>Withdraw your consent for cookies at any time</li>
                <li>Request deletion of data collected via cookies</li>
              </ul>
              <p className="mt-4">
                For more information about your privacy rights, see our{" "}
                <a href="/privacy" className="text-needs hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>Changes to This Cookie Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We may update this Cookie Policy to reflect changes in our use of cookies or legal requirements. 
                Any changes will be posted on this page with an updated "Last updated" date.
              </p>
              <p className="mt-4">
                If we start using new types of cookies (such as analytics), we will notify you and request your 
                consent where required by law.
              </p>
            </CardContent>
          </Card>

          <div className="backdrop-blur-sm bg-needs/10 border border-needs/20 rounded-2xl p-8 text-center">
            <Cookie className="h-12 w-12 text-needs mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Questions About Cookies?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We're committed to transparency. If you have questions about our use of cookies, contact us.
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
