import { useState } from "react";
import ResourceCard from "@/components/ResourceCard";
import PromptCard from "@/components/PromptCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Sparkles, Download } from "lucide-react";
import periodicTableImageUrl from "@assets/The-Periodic-Table-of-Conscious-Communication@2x_1762813238966.png";
import influenceStrategiesPdfUrl from "@assets/1101 Influence Communication Strategies_1762813220069.pdf";
import greenBlueRedPdfUrl from "@assets/1103 GreenBlueRed™_1762813220070.pdf";
import microHabitPdfUrl from "@assets/2103 Micro-Habit_1762813220070.pdf";
import chaordicRolesPdfUrl from "@assets/3111 Chaordic Roles (5 promises for each level of collective intelligence)_1762813220070.pdf";
import nvcGreenBlueRedPdfUrl from "@assets/6104 NonViolentCommunication + 1103 GreenBlueRed_1762813220070.pdf";
import fiveStagesTeamPdfUrl from "@assets/6106  with the 5 Stages of Team_1762813220070.pdf";
import blueInfographicImageUrl from "@assets/InfographicSummary_BlueBeingUnderstood_slides _vers3.293_1762813339581.jpeg";

//todo: remove mock functionality
const prompts = [
  {
    title: "Empathetic Listening Check-in",
    prompt: "Before I respond, I want to make sure I understand your perspective. What I'm hearing is... Is that accurate?",
    lens: "needs" as const,
    role: "Executive Assistant",
    scenario: "Conflict Resolution",
  },
  {
    title: "Trust Building in Teams",
    prompt: "I appreciate your willingness to share this challenge. What support would be most helpful to you right now?",
    lens: "dynamics" as const,
    role: "Startup Founder",
    scenario: "Team Meeting",
  },
  {
    title: "Boundary Setting with Compassion",
    prompt: "I value our connection and need to share that this doesn't work for me. Would you be open to exploring alternatives together?",
    lens: "alignment" as const,
    role: "Executive Assistant",
    scenario: "Workload Management",
  },
  {
    title: "Curiosity in Disagreement",
    prompt: "I notice we see this differently. I'm curious - what's most important to you in this situation?",
    lens: "attitude" as const,
    role: "Design Student",
    scenario: "Collaboration",
  },
  {
    title: "Presence in Difficult Conversations",
    prompt: "I'm feeling [emotion] about this. Can we pause for a moment before continuing?",
    lens: "flow" as const,
    role: "Startup Founder",
    scenario: "Feedback Session",
  },
  {
    title: "Clarity in Requests",
    prompt: "To ensure we're aligned, I'd like to be specific about what I'm requesting: [specific ask]. Does this feel doable?",
    lens: "influence" as const,
    role: "Executive Assistant",
    scenario: "Delegation",
  },
];

const resources = [
  {
    title: "The Conscious Communication Handbook",
    description: "A comprehensive guide to transforming conflicts into trust using the Periodic Table framework. Includes 50+ practical exercises.",
    type: "Ebook" as const,
    format: "PDF, 120 pages",
    audience: "All Levels",
  },
  {
    title: "TEAL Team Communication Template",
    description: "Ready-to-use Notion workspace for implementing microhabits in your organization with templates for 1:1s, retrospectives, and more.",
    type: "Notion Kit" as const,
    audience: "Startup Founders",
  },
  {
    title: "Compassionate Dialogue GPT",
    description: "AI assistant trained on NVC principles to help you craft empathetic responses in challenging communication situations.",
    type: "GPT Assistant" as const,
    audience: "Executive Assistants",
  },
  {
    title: "Executive Assistant Mastery Path",
    description: "6-week guided learning journey through the 8 lenses with weekly prompts, reflections, and community support.",
    type: "Learning Path" as const,
    format: "Online, self-paced",
    audience: "Executive Assistants",
  },
  {
    title: "Microhabit Design Toolkit",
    description: "Interactive Notion template for designing and tracking your personal communication microhabits with the trigger-action-reward framework.",
    type: "Notion Kit" as const,
    audience: "All Levels",
  },
  {
    title: "Conflict Transformation Ebook",
    description: "Deep dive into the Ego and Dynamics lenses with real case studies from TEAL organizations.",
    type: "Ebook" as const,
    format: "PDF, 80 pages",
    audience: "Startup Founders",
  },
];

const lenses = ["all", "influence", "attitude", "chaordic", "flow", "alignment", "needs", "ego", "dynamics"];
const roles = ["all", "Executive Assistant", "Startup Founder", "Design Student"];
const scenarios = ["all", "Conflict Resolution", "Team Meeting", "Workload Management", "Collaboration", "Feedback Session", "Delegation"];

export default function ResourcesPromptsPage() {
  const [selectedLens, setSelectedLens] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedScenario, setSelectedScenario] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPrompts = prompts.filter((prompt) => {
    const lensMatch = selectedLens === "all" || prompt.lens === selectedLens;
    const roleMatch = selectedRole === "all" || prompt.role === selectedRole;
    const scenarioMatch = selectedScenario === "all" || prompt.scenario === selectedScenario;
    const searchMatch = searchQuery === "" || 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return lensMatch && roleMatch && scenarioMatch && searchMatch;
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-alignment text-white">Practical Tools</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Archivo, sans-serif' }}>
            Resources &amp; Prompts
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Infographics, downloads, and conversation prompts—all structured by the 8 lenses of the Periodic Table.
          </p>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
            Filter by your role, scenario, or communication lens to find the exact words that transform conflict into connection.
          </p>
        </div>

        <Tabs defaultValue="prompts" className="mb-16">
          <TabsList className="grid w-full md:w-[400px] mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="prompts" data-testid="tab-prompts">
              <Sparkles className="h-4 w-4 mr-2 text-foreground" />
              Prompts
            </TabsTrigger>
            <TabsTrigger value="resources" data-testid="tab-resources">
              <BookOpen className="h-4 w-4 mr-2 text-foreground" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prompts" className="space-y-8">
            <div className="backdrop-blur-sm bg-card/50 border border-white/10 rounded-2xl p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search prompts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 backdrop-blur-sm bg-white/5"
                    data-testid="input-search"
                  />
                </div>

                <select
                  value={selectedLens}
                  onChange={(e) => setSelectedLens(e.target.value)}
                  className="rounded-md bg-background/50 backdrop-blur-sm border-white/10 px-3 py-2 text-sm"
                  data-testid="select-lens"
                >
                  <option value="all">All Lenses</option>
                  {lenses.slice(1).map((lens) => (
                    <option key={lens} value={lens}>{lens.charAt(0).toUpperCase() + lens.slice(1)}</option>
                  ))}
                </select>

                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="rounded-md bg-background/50 backdrop-blur-sm border-white/10 px-3 py-2 text-sm"
                  data-testid="select-role"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>{role === "all" ? "All Roles" : role}</option>
                  ))}
                </select>

                <select
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value)}
                  className="rounded-md bg-background/50 backdrop-blur-sm border-white/10 px-3 py-2 text-sm"
                  data-testid="select-scenario"
                >
                  {scenarios.map((scenario) => (
                    <option key={scenario} value={scenario}>{scenario === "all" ? "All Scenarios" : scenario}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((prompt) => (
                <PromptCard key={prompt.title} {...prompt} />
              ))}
            </div>

            {filteredPrompts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No prompts found. Try adjusting your filters.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="resources" className="space-y-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Downloadable Infographics & Frameworks</h2>
              <p className="text-muted-foreground mb-6">
                Visual guides and frameworks to deepen your practice. Download, print, and reference these tools as you develop your conscious communication skills.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Periodic Table of Conscious Communication</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Complete visual reference of all 129 elements organized by the 8 communication lenses.
                    </p>
                    <Button className="w-full" variant="outline" data-testid="download-periodic-table" asChild>
                      <a href={periodicTableImageUrl} download="Periodic-Table-Conscious-Communication.png">
                        <Download className="h-4 w-4 mr-2" />
                        Download PNG
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Influence Communication Strategies</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Master the Influence lens with strategic approaches to authentic persuasion and clear requests.
                    </p>
                    <Button className="w-full" variant="outline" data-testid="download-influence" asChild>
                      <a href={influenceStrategiesPdfUrl} download="Influence-Communication-Strategies.pdf">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">GreenBlueRed™ Framework</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Three-color system for understanding communication intentions, behaviors, and techniques.
                    </p>
                    <Button className="w-full" variant="outline" data-testid="download-greenblue" asChild>
                      <a href={greenBlueRedPdfUrl} download="GreenBlueRed-Framework.pdf">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Microhabit Design Framework</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Step-by-step guide to creating sustainable communication microhabits with trigger-action-reward loops.
                    </p>
                    <Button className="w-full" variant="outline" data-testid="download-microhabit" asChild>
                      <a href={microHabitPdfUrl} download="Microhabit-Framework.pdf">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Chaordic Roles & Collective Intelligence</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Five promises for each level of collective intelligence in self-organizing systems.
                    </p>
                    <Button className="w-full" variant="outline" data-testid="download-chaordic" asChild>
                      <a href={chaordicRolesPdfUrl} download="Chaordic-Roles-Collective-Intelligence.pdf">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">NVC + GreenBlueRed Integration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Combining Nonviolent Communication principles with the GreenBlueRed framework.
                    </p>
                    <Button className="w-full" variant="outline" data-testid="download-nvc" asChild>
                      <a href={nvcGreenBlueRedPdfUrl} download="NVC-GreenBlueRed-Integration.pdf">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">5 Stages of Team Development</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Understanding team dynamics through the lens of developmental stages and communication needs.
                    </p>
                    <Button className="w-full" variant="outline" data-testid="download-team-stages" asChild>
                      <a href={fiveStagesTeamPdfUrl} download="5-Stages-Team-Development.pdf">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Blue Communication: Being Understood</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Deep dive into Blue (Ego lens) communication patterns, barriers, and breakthrough techniques.
                    </p>
                    <Button className="w-full" variant="outline" data-testid="download-blue" asChild>
                      <a href={blueInfographicImageUrl} download="Blue-Communication-Being-Understood.jpg">
                        <Download className="h-4 w-4 mr-2" />
                        Download JPG
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="border-t border-white/10 pt-12">
              <h2 className="text-3xl font-bold mb-6">Learning Resources</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                  <ResourceCard key={resource.title} {...resource} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>Personalized Learning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Not sure where to start? Take our diagnostic assessment to receive personalized recommendations based on your communication patterns and goals.
              </p>
              <Button 
                className="w-full bg-needs hover:bg-needs/90"
                data-testid="button-take-assessment"
                asChild
              >
                <a href="/signals">
                  Take Assessment
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>Community Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                All resources and prompts are enriched through our LinkedIn community where practitioners share experiences and insights.
              </p>
              <Button 
                variant="outline"
                className="w-full backdrop-blur-sm bg-white/5"
                data-testid="button-join-community"
                asChild
              >
                <a href="https://www.linkedin.com/groups/9263616/" target="_blank" rel="noopener noreferrer">
                  Join LinkedIn Community
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
