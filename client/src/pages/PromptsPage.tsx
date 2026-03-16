import { useState } from "react";
import { SEO } from "@/components/SEO";
import PromptCard from "@/components/PromptCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

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

const lenses = ["all", "influence", "attitude", "chaordic", "flow", "alignment", "needs", "ego", "dynamics"];
const roles = ["all", "Executive Assistant", "Startup Founder", "Design Student"];
const scenarios = ["all", "Conflict Resolution", "Team Meeting", "Workload Management", "Collaboration", "Feedback Session", "Delegation"];

export default function PromptsPage() {
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
      <SEO
        title="Prompt Library — AI Communication Tools"
        description="Explore ready-to-use AI prompts for conscious communication. Filter by lens, role, and scenario — empathetic listening, trust building, boundary setting, and more."
        keywords="AI communication prompts, conscious communication tools, empathetic listening, trust building, conflict resolution prompts, executive assistant communication, team meeting prompts"
        canonicalPath="/prompts"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-alignment text-white">Practical Tools</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Never Be Stuck in Difficult Conversations Again
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Ready-to-use prompts that help you respond with clarity and compassion—even when emotions run high
          </p>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
            Filter by your role, scenario, or communication lens to find the exact words that transform conflict into connection.
          </p>
        </div>

        <div className="backdrop-blur-sm bg-card/50 border border-white/10 rounded-2xl p-6 mb-12">
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

        <div className="mb-6 text-sm text-muted-foreground">
          Showing {filteredPrompts.length} of {prompts.length} prompts
        </div>

        <div className="grid gap-6">
          {filteredPrompts.map((prompt, index) => (
            <PromptCard key={index} {...prompt} />
          ))}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              We're grateful for your search. Please try adjusting your filters to find prompts.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSelectedLens("all");
                setSelectedRole("all");
                setSelectedScenario("all");
                setSearchQuery("");
              }}
              data-testid="button-reset-filters"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
