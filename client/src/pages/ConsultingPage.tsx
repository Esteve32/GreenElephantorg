import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight, TrendingDown, Sparkles, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function ConsultingPage() {
  const services = [
    {
      title: "Executive Leadership Intensive",
      price: "€18,000",
      comparisonPrice: "€30,000+/month",
      comparisonLabel: "Individual consultant retainer",
      duration: "3 months",
      icon: Sparkles,
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
      highlighted: true,
    },
    {
      title: "TEAL Organization Transformation",
      price: "€28,000",
      comparisonPrice: "€120,000+",
      comparisonLabel: "Traditional change management consulting",
      duration: "6-12 months",
      icon: Users,
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
      title: "Innovation Team Design Sprint",
      price: "€12,000",
      comparisonPrice: "€25,000+",
      comparisonLabel: "Traditional 2-week consulting engagement",
      duration: "2 weeks",
      icon: TrendingDown,
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
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 bg-needs text-white">Enterprise Consulting</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Archivo, sans-serif' }}>
            Strategic Communication Consulting
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your organization's communication culture with strategic, high-touch consulting for <a href="https://en.wikipedia.org/wiki/Teal_organisation" target="_blank" rel="noopener noreferrer" className="text-needs hover:underline">TEAL</a> leaders and innovation teams
          </p>
        </motion.div>

        <motion.div 
          className="backdrop-blur-sm bg-gradient-to-br from-needs/20 to-alignment/20 border border-white/20 rounded-2xl p-8 md:p-12 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                The Hidden Cost of Communication Breakdown
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                For CEOs, CFOs, and <a href="https://en.wikipedia.org/wiki/Teal_organisation" target="_blank" rel="noopener noreferrer" className="text-needs hover:underline">TEAL</a> organizations, poor communication isn't just frustrating—it's expensive.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="backdrop-blur-sm bg-destructive/10 border border-destructive/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold mb-4 text-destructive">The Problem</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">×</span>
                    <span>Traditional change management: <strong>€120,000+</strong> with 70% failure rate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">×</span>
                    <span>Individual consultant retainers: <strong>€30,000/month</strong> with limited scope</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">×</span>
                    <span>Lost productivity from miscommunication: <strong>€500k-2M annually</strong> in mid-size orgs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">×</span>
                    <span>Executive turnover from culture mismatch: <strong>€150k+</strong> per replacement</span>
                  </li>
                </ul>
              </div>
              
              <div className="backdrop-blur-sm bg-needs/10 border border-needs/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold mb-4 text-needs">The Solution</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-needs shrink-0 mt-0.5" />
                    <span><strong>€12,000-€28,000</strong> total investment with measurable ROI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-needs shrink-0 mt-0.5" />
                    <span>Proven framework: 129-element Periodic Table of Conscious Communication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-needs shrink-0 mt-0.5" />
                    <span>Sustainable change through microhabits—not disruptive overhauls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-needs shrink-0 mt-0.5" />
                    <span>Aligned with <a href="https://en.wikipedia.org/wiki/Teal_organisation" target="_blank" rel="noopener noreferrer" className="text-needs hover:underline">TEAL</a> principles: participatory, human-centered, data-informed</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.div 
                className="backdrop-blur-sm bg-white/5 rounded-lg p-6 hover-elevate"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 rounded-full bg-needs/20 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-needs" />
                </div>
                <h3 className="font-bold mb-2">Organizational Scale</h3>
                <p className="text-sm text-muted-foreground">Enterprise-wide transformation that respects complexity while creating measurable impact</p>
              </motion.div>
              <motion.div 
                className="backdrop-blur-sm bg-white/5 rounded-lg p-6 hover-elevate"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 rounded-full bg-needs/20 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-needs" />
                </div>
                <h3 className="font-bold mb-2">Strategic Precision</h3>
                <p className="text-sm text-muted-foreground">High-stakes communication for boards, investors, and complex stakeholder ecosystems</p>
              </motion.div>
              <motion.div 
                className="backdrop-blur-sm bg-white/5 rounded-lg p-6 hover-elevate"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 rounded-full bg-needs/20 flex items-center justify-center mb-4">
                  <TrendingDown className="h-6 w-6 text-needs" />
                </div>
                <h3 className="font-bold mb-2">Efficiency Focus</h3>
                <p className="text-sm text-muted-foreground">Time-efficient interventions designed for innovation teams and fast-moving organizations</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`backdrop-blur-sm bg-card/50 hover-elevate ${service.highlighted ? 'border-needs/50 ring-2 ring-needs/20' : 'border-white/10'}`}>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-needs/20 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-needs" />
                          </div>
                          {service.highlighted && (
                            <Badge className="bg-needs text-white">Most Popular</Badge>
                          )}
                          <span className="text-sm text-muted-foreground">{service.duration}</span>
                        </div>
                        <CardTitle className="text-3xl mb-3">{service.title}</CardTitle>
                        <p className="text-muted-foreground leading-relaxed mb-4">{service.description}</p>
                      </div>
                      <div className="md:text-right space-y-3">
                        <div className="backdrop-blur-sm bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-2">
                          <p className="text-xs text-muted-foreground line-through mb-1">{service.comparisonLabel}</p>
                          <p className="text-lg text-destructive/80 line-through font-semibold">{service.comparisonPrice}</p>
                        </div>
                        <div className="backdrop-blur-sm bg-needs/10 border border-needs/30 rounded-lg p-4">
                          <p className="text-xs text-muted-foreground mb-1">Your Investment</p>
                          <div className="text-4xl font-bold text-needs mb-3">{service.price}</div>
                        </div>
                        <Button 
                          className="bg-needs hover:bg-needs/90 w-full"
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
              </motion.div>
            );
          })}
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
                  <span>Genuine commitment to <a href="https://en.wikipedia.org/wiki/Teal_organisation" target="_blank" rel="noopener noreferrer" className="text-needs hover:underline">TEAL</a> principles and conscious evolution</span>
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
            asChild
          >
            <a href="/contact">
              Schedule Discovery Call
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
