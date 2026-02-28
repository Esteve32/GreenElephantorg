import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <SEO
        title="Terms of Service | GreenElephant"
        description="GreenElephant's terms of service covering coaching, retreats, and consulting agreements. Clear terms for conscious relationships."
        canonicalPath="/terms"
        keywords="terms of service, GreenElephant terms, coaching terms, retreat terms"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Terms of Service", url: "/terms" }
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-needs text-white">Legal</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-archivo">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4 italic">
            Clear agreements create conscious relationships. Thank you for reviewing our terms—we believe in transparency, kindness and mutual respect.
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: January 30, 2026
          </p>
        </div>

        <div className="space-y-8">
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>1. Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                By accessing and using GreenElephant.org ("the Platform"), you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>
              <p>
                GreenElephant.org is operated by{" "}
                <a href="https://www.linkedin.com/in/estève-pannetier-3a883217" target="_blank" rel="noopener noreferrer" className="text-needs hover:underline">
                  Estève Pannetier
                </a>{" "}
                (Finland),{" "}
                <a href="https://www.linkedin.com/in/jonas-pannetier-6a7728134" target="_blank" rel="noopener noreferrer" className="text-needs hover:underline">
                  Jonas Pannetier
                </a>{" "}
                (France), and{" "}
                <a href="https://www.linkedin.com/in/anutimmerbacka" target="_blank" rel="noopener noreferrer" className="text-needs hover:underline">
                  Anu Timmerbacka
                </a>{" "}
                (Finland), offering coaching, retreats, and consulting services centered on conscious communication.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>2. Services Offered</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>GreenElephant provides:</p>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Coaching Services:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Single sessions (€295)</li>
                    <li>Coaching Journey packages (~6 months, €2,980)</li>
                    <li>Team workshops (€1,200 for up to 10 people)</li>
                    <li>Interview coaching (€795 for 3-session bundle)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Retreats:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Equinoxe Retreats in Provence, France and Levi, Finland (€2,890)</li>
                    <li>5-day immersive experiences with personalized microhabit playbooks</li>
                    <li>90-day post-retreat integration support</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Enterprise Consulting:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Executive Leadership Intensive (€18,000)</li>
                    <li>TEAL Organization Transformation (€28,000)</li>
                    <li>Innovation Team Design Sprint (€12,000)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>3. Booking & Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <h3 className="font-semibold text-foreground">Pricing & Currency:</h3>
              <p>All prices are listed in Euros (EUR) and are subject to change with notice.</p>
              
              <h3 className="font-semibold text-foreground mt-4">Payment Processing:</h3>
              <p>
                Payments are processed securely through Stripe. By providing payment information, you authorize us to 
                charge the full amount for your selected service.
              </p>

              <h3 className="font-semibold text-foreground mt-4">Payment Terms:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Coaching packages: Payment due in full at booking</li>
                <li>Retreats: Payment due upon registration (excludes food, accommodation, and travel)</li>
                <li>Consulting: 50% deposit required, balance due before project completion</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>4. Cancellation & Refund Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Coaching Sessions:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Cancellations must be made at least 48 hours in advance for a full refund</li>
                    <li>Late cancellations (less than 48 hours) are non-refundable but may be rescheduled once</li>
                    <li>No-shows are non-refundable and non-transferable</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Retreats:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Cancellations more than 90 days before retreat: 90% refund</li>
                    <li>Cancellations 60-90 days before: 50% refund</li>
                    <li>Cancellations less than 60 days before: No refund (you may transfer your spot to another person)</li>
                    <li>Retreat cancellation by organizers: Full refund guaranteed</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Consulting Projects:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Cancellation terms are defined in individual consulting agreements</li>
                    <li>Deposits are generally non-refundable once work has commenced</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>5. Service Delivery & Expectations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <h3 className="font-semibold text-foreground">Session Scheduling:</h3>
              <p>
                Coaching and consulting sessions are scheduled via Calendly or mutual agreement. We will make reasonable 
                efforts to accommodate your preferences.
              </p>

              <h3 className="font-semibold text-foreground mt-4">Client Responsibilities:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate information during intake and assessments</li>
                <li>Attend scheduled sessions on time</li>
                <li>Engage actively in the coaching/learning process</li>
                <li>Communicate respectfully with coaches and fellow participants</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>6. Disclaimers & Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Not Medical or Psychological Treatment:</h3>
                  <p>
                    Our coaching and communication services are educational and developmental in nature. They are not a 
                    substitute for professional medical, psychological, or therapeutic treatment. If you are experiencing 
                    mental health challenges, please consult a licensed healthcare provider.
                  </p>
                  <p className="mt-2 text-sm">
                    Note: Jonas Pannetier is a licensed clinical psychologist and may provide therapeutic services 
                    separately under appropriate clinical frameworks. Such services are governed by separate agreements.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Results Not Guaranteed:</h3>
                  <p>
                    While we are committed to your growth and transformation, individual results vary. We cannot guarantee 
                    specific outcomes, career advancement, or relationship improvements. Your progress depends on your 
                    engagement, practice, and unique circumstances.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Limitation of Liability:</h3>
                  <p>
                    To the fullest extent permitted by law, GreenElephant.org and its operators are not liable for 
                    indirect, incidental, or consequential damages arising from the use of our services. Our total 
                    liability shall not exceed the amount you paid for the specific service.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>7. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                All content on GreenElephant.org, including the Periodic Table of Conscious Communication framework, 
                course materials, prompts, infographics, and proprietary methodologies, are owned by Estève Pannetier, 
                Jonas Pannetier, and Anu Timmerbacka.
              </p>
              <p className="mt-4">
                <strong>Personal Use License:</strong> You may download and use our resources for personal, 
                non-commercial purposes. You may not reproduce, distribute, or create derivative works for commercial 
                use without written permission.
              </p>
              <p className="mt-4">
                <strong>Session Recordings:</strong> Coaching session recordings are provided for your personal review 
                only and may not be shared publicly or commercially.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>8. Confidentiality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We maintain strict confidentiality regarding your coaching conversations, assessments, and personal 
                information. We will not disclose your information except:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>With your explicit consent</li>
                <li>As required by law or legal process</li>
                <li>To protect safety in cases of imminent harm</li>
                <li>Anonymized for research or testimonial purposes (with permission)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>9. Code of Conduct</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>We are committed to creating a respectful, inclusive environment. We do not tolerate:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Harassment, discrimination, or hate speech</li>
                <li>Disruptive or disrespectful behavior toward coaches or participants</li>
                <li>Violation of others' confidentiality</li>
                <li>Use of services for unlawful purposes</li>
              </ul>
              <p className="mt-4">
                We reserve the right to terminate services and deny refunds for violations of this code.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>10. Governing Law & Jurisdiction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                These Terms are governed by the laws of <strong>Finland</strong>, where primary operations are based. 
                Any disputes will be resolved in the courts of Helsinki, Finland, or through mediation if mutually agreed.
              </p>
              <p className="mt-4">
                For services delivered in France, French consumer protection laws apply where applicable.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>11. Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                If you have concerns about our services, please contact us first at{" "}
                <a href="mailto:esteve@greenelephant.org" className="text-needs hover:underline">
                  esteve@greenelephant.org
                </a>
                . We are committed to resolving issues amicably.
              </p>
              <p className="mt-4">
                If informal resolution is not possible, we encourage mediation before pursuing legal action.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>12. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We may update these Terms of Service to reflect changes in our services or legal requirements. 
                Significant changes will be communicated via email or website notice. Continued use of our services 
                after changes constitutes acceptance of the updated terms.
              </p>
            </CardContent>
          </Card>

          <div className="backdrop-blur-sm bg-needs/10 border border-needs/20 rounded-2xl p-8 text-center">
            <Scale className="h-12 w-12 text-needs mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Questions About These Terms?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We're here to clarify any questions you have about our terms and your rights.
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
