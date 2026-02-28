import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, ExternalLink, Shield, Scale, Users, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, fadeIn } from "@/lib/motion";
import { SEO } from "@/components/SEO";
import earthWithAuroraUrl from "@assets/upscaled Jal-ai earth from space with northern lights_1764356069634.jpeg";

const invertedEarthToSpaceGradient = {
  background: `linear-gradient(180deg, 
    #0a2a48 0%,
    #0a1628 30%, 
    #050a14 60%, 
    #000000 100%
  )`
};

export default function AIPolicyPage() {
  return (
    <div className="min-h-screen relative">
      <SEO
        title="AI Ethics & Transparency Policy | GreenElephant"
        description="GreenElephant's AI ethics and transparency policy. Learn how we use AI to augment human connection while maintaining data privacy, consent, and ethical standards."
        canonicalPath="/ai-policy"
        keywords="AI policy, AI ethics, AI transparency, responsible AI, GreenElephant AI policy"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "AI Policy", url: "/ai-policy" }
        ]}
      />
      <section 
        className="relative min-h-[50vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${earthWithAuroraUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top center'
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, #0a2a48 100%)'
          }}
        />
        <motion.div 
          className="relative z-10 text-center px-4"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Badge className="mb-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white">Legal</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg" style={{ fontFamily: 'Archivo, sans-serif' }}>
            AI Policy
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto italic">
            Transparent AI use in service of human connection. We believe technology should amplify, not replace, the irreplaceable art of conscious communication.
          </p>
        </motion.div>
      </section>

      <div style={invertedEarthToSpaceGradient} className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <p className="text-sm text-white/60 text-center mb-12">
            Last updated: November 28, 2025
          </p>

          <div className="space-y-8">
            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Card className="backdrop-blur-sm bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Shield className="h-5 w-5 text-needs" />
                    Our Commitment to Human-Centered AI
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-white/70">
                  <p>
                    At GreenElephant.org, we believe that AI should serve human connection, not substitute for it. 
                    Our use of AI technology is guided by principles of transparency, human oversight, and ethical responsibility.
                  </p>
                  <p>
                    We are committed to full compliance with the EU AI Act (Regulation 2024/1689) and align our practices 
                    with the highest standards of responsible AI development and deployment.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Card className="backdrop-blur-sm bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Bot className="h-5 w-5 text-alignment" />
                    How We Use AI
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-white/70">
                  <p>We use AI in the following transparent ways:</p>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-white mb-2">1. Satellite Scan Questionnaire</h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>AI is used only to summarise your data, and is systematically checked by Human Coaches</li>
                        <li>All analysis and dashboard creation is performed by human coaches</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2">2. Prompt Library & Resources</h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>AI-assisted prompts help you explore your communication patterns</li>
                        <li>Prompts are designed by humans and reviewed for ethical alignment</li>
                        <li>You remain in full control of how you use and interpret AI outputs</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2">3. Communication Tools</h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Thesys.dev API provides AI-powered lens visualization</li>
                        <li>All AI-generated content is clearly labeled as such</li>
                        <li>Human coaches validate and contextualize AI outputs</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Card className="backdrop-blur-sm bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Scale className="h-5 w-5 text-chaordic" />
                    EU AI Act Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-white/70">
                  <p>
                    In accordance with the EU AI Act, we classify our AI applications as minimal or limited risk. 
                    We implement the following safeguards:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong className="text-white">Transparency:</strong> Clear disclosure when AI is involved in any process</li>
                    <li><strong className="text-white">Human Oversight:</strong> All significant decisions involve human review</li>
                    <li><strong className="text-white">Data Protection:</strong> Full GDPR compliance for all data processing</li>
                    <li><strong className="text-white">No Profiling:</strong> We do not use AI for automated decision-making that affects your rights</li>
                    <li><strong className="text-white">No Manipulation:</strong> AI is never used for subliminal techniques or exploitation of vulnerabilities</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Card className="backdrop-blur-sm bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="h-5 w-5 text-flow" />
                    Human Primacy Principle
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-white/70">
                  <p>
                    We believe that human-to-human communication is irreplaceable. Our core philosophy:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>AI augments human coaches—it never replaces them</li>
                    <li>Your personalized dashboard is created by human hands, not algorithms</li>
                    <li>Every coaching session involves genuine human presence and attention</li>
                    <li>Retreats and workshops are fundamentally human experiences</li>
                    <li>AI is a tool in service of deeper human connection, not a substitute for it</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Card className="backdrop-blur-sm bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Brain className="h-5 w-5 text-ego" />
                    Your Rights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-white/70">
                  <p>
                    Regarding AI processing of your data, you have the right to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Know when AI is being used in any interaction with our services</li>
                    <li>Request human-only processing of your information</li>
                    <li>Access explanations of how AI contributes to any outputs</li>
                    <li>Object to AI processing where technically feasible</li>
                    <li>Lodge complaints with relevant supervisory authorities</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              variants={fadeIn} 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }}
              className="backdrop-blur-sm bg-needs/10 border border-needs/20 rounded-2xl p-8 text-center"
            >
              <Bot className="h-12 w-12 text-needs mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-white">Partnership with Arbora</h3>
              <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                Our AI ethics framework is developed in partnership with Arbora.partners, specialists in 
                responsible innovation and conscious technology design.
              </p>
              <a 
                href="https://arbora.partners"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-needs hover:underline text-lg font-semibold"
                data-testid="link-arbora"
              >
                Visit Arbora.partners
                <ExternalLink className="h-4 w-4" />
              </a>
            </motion.div>

            <motion.div 
              variants={fadeIn} 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }}
              className="text-center pt-8"
            >
              <p className="text-white/60 text-sm">
                Questions about our AI practices? Contact us at{" "}
                <a href="mailto:esteve@greenelephant.org" className="text-needs hover:underline">
                  esteve@greenelephant.org
                </a>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
