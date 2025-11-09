import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";

export default function ConsultingPage() {
  const services = [
    {
      title: "TEAL Organization Transformation",
      price: "Starting at €50,000",
      duration: "6-12 months",
      description: "Complete organizational transformation to conscious communication culture",
      features: [
        "Organization-wide communication audit",
        "Custom Periodic Table implementation",
        "Executive team intensive coaching",
        "Department-level microhabit design",
        "Quarterly transformation reviews",
        "Ongoing strategic advisory",
        "Access to proprietary assessment tools",
        "Lab research collaboration",
      ],
    },
    {
      title: "Executive Leadership Intensive",
      price: "€25,000",
      duration: "3 months",
      description: "High-touch coaching for C-suite leaders navigating complex communication challenges",
      features: [
        "Weekly 1:1 strategic sessions",
        "24/7 messaging support",
        "Crisis communication guidance",
        "Board presentation coaching",
        "Stakeholder relationship mapping",
        "Personal microhabit development",
        "Executive retreat inclusion",
      ],
    },
    {
      title: "Innovation Team Design Sprint",
      price: "€15,000",
      duration: "2 weeks",
      description: "Intensive workshop series for design and innovation teams",
      features: [
        "5-day on-site facilitation",
        "Custom communication frameworks",
        "Team dynamics assessment",
        "Conflict resolution protocols",
        "Collaborative decision-making tools",
        "Post-sprint integration support",
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-needs text-white">High-Ticket Services</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Archivo, sans-serif' }}>
            Enterprise Consulting
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your organization's communication culture with strategic, high-touch consulting for TEAL leaders and innovation teams
          </p>
        </div>

        <div className="backdrop-blur-sm bg-gradient-to-br from-needs/20 to-alignment/20 border border-white/20 rounded-2xl p-8 md:p-12 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              When Standard Coaching Isn't Enough
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              You're navigating complex organizational transformation. Your team faces unprecedented communication challenges. 
              Standard programs don't address the unique dynamics of TEAL organizations, executive leadership, or innovation teams. 
              You need deep expertise, strategic guidance, and sustained partnership.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="backdrop-blur-sm bg-white/5 rounded-lg p-6">
                <h3 className="font-bold mb-2">Organizational Scale</h3>
                <p className="text-sm text-muted-foreground">Enterprise-wide transformation requiring coordinated change across multiple departments and leadership levels.</p>
              </div>
              <div className="backdrop-blur-sm bg-white/5 rounded-lg p-6">
                <h3 className="font-bold mb-2">Strategic Complexity</h3>
                <p className="text-sm text-muted-foreground">High-stakes communication challenges involving boards, investors, or complex stakeholder ecosystems.</p>
              </div>
              <div className="backdrop-blur-sm bg-white/5 rounded-lg p-6">
                <h3 className="font-bold mb-2">Innovation Urgency</h3>
                <p className="text-sm text-muted-foreground">Time-sensitive transformation needs for product launches, pivots, or critical team dynamics.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 mb-16">
          {services.map((service, index) => (
            <Card key={service.title} className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-needs text-white">Premium</Badge>
                      <span className="text-sm text-muted-foreground">{service.duration}</span>
                    </div>
                    <CardTitle className="text-3xl mb-3">{service.title}</CardTitle>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-needs mb-2">{service.price}</div>
                    <Button 
                      className="bg-needs hover:bg-needs/90"
                      data-testid={`button-inquire-${index}`}
                      onClick={() => console.log('Inquiring about:', service.title)}
                    >
                      Request Consultation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-needs shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>The Consulting Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Discovery Call (Complimentary)</h3>
                <p className="text-sm text-muted-foreground">
                  We explore your organizational challenges, transformation goals, and whether our approach aligns with your needs.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Comprehensive Assessment</h3>
                <p className="text-sm text-muted-foreground">
                  Deep dive into your organization's communication patterns, dynamics, and strategic context.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. Custom Proposal</h3>
                <p className="text-sm text-muted-foreground">
                  Tailored engagement plan with clear milestones, deliverables, and success metrics.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">4. Strategic Partnership</h3>
                <p className="text-sm text-muted-foreground">
                  Sustained collaboration with regular check-ins, adjustments, and celebration of transformation.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>Who We Work With</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Our consulting engagements are reserved for organizations and leaders demonstrating:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-needs mt-1">•</span>
                  <span>Genuine commitment to TEAL principles and conscious evolution</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-needs mt-1">•</span>
                  <span>Willingness to invest time and resources in deep transformation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-needs mt-1">•</span>
                  <span>Openness to challenging existing communication patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-needs mt-1">•</span>
                  <span>Alignment with our values of compassion, integrity, and growth</span>
                </li>
              </ul>
              <p className="text-sm pt-4">
                We limit consulting engagements to ensure each partnership receives the depth of attention it deserves.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="backdrop-blur-sm bg-needs/10 border border-needs/20 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Organization?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Schedule a complimentary discovery call to explore how conscious communication can elevate your organizational culture.
          </p>
          <Button 
            size="lg"
            className="bg-needs hover:bg-needs/90 text-white"
            data-testid="button-schedule-call"
            onClick={() => console.log('Schedule discovery call')}
          >
            Schedule Discovery Call
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
