import { useState, useMemo, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Search,
  ArrowLeft,
  Copy,
  Check,
  Download,
  FileText,
  Sparkles,
  Users,
  Target,
  Heart,
  Zap,
  BarChart3,
  Compass,
  Brain,
  Layers,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SiGoogle } from "react-icons/si";

const LENSES = [
  { key: "all", label: "All Lenses", color: "#009999", icon: Layers },
  { key: "influence", label: "Influence", color: "#cc3333", icon: Target },
  { key: "attitude", label: "Attitude", color: "#cc6633", icon: Compass },
  { key: "chaordic", label: "Chaordic", color: "#cc9933", icon: Zap },
  { key: "flow", label: "Flow", color: "#cccc33", icon: Sparkles },
  { key: "alignment", label: "Alignment", color: "#33cc33", icon: Users },
  { key: "needs", label: "Needs", color: "#009999", icon: Heart },
  { key: "ego", label: "Ego", color: "#3366cc", icon: Brain },
  { key: "dynamics", label: "Dynamics", color: "#9933cc", icon: BarChart3 },
] as const;

const EXPLORATION_DIMENSIONS = [
  { key: "partners", label: "Partner Dynamics", description: "How you communicate with business partners and collaborators", icon: Users },
  { key: "teams", label: "Team Leadership", description: "Communication patterns in leading and managing teams", icon: Target },
  { key: "values", label: "Value Rules", description: "Core principles that guide your communication decisions", icon: Heart },
  { key: "habits", label: "Micro-Habits", description: "Small daily practices that improve communication quality", icon: Zap },
  { key: "roadmap", label: "Development Roadmap", description: "Long-term personal growth trajectory for communication mastery", icon: Compass },
] as const;

function InfoTip({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="inline-flex text-white/30 hover:text-white/60 transition-colors" type="button">
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-sm bg-gray-900 border-white/10 text-white/80">
        {children}
      </TooltipContent>
    </Tooltip>
  );
}

interface Prompt {
  id: string;
  title: string;
  description: string;
  lensType: string;
  promptContent: string;
  whatItDoes: string[];
  perfectFor: string;
  roleCategory: string;
  votes: string;
}

function PromptCard({ prompt, lensColor }: { prompt: Prompt; lensColor: string }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied!", description: `${label} copied to clipboard. Paste into ChatGPT, Claude, or any AI tool.` });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportGoogleDocs = () => {
    const content = encodeURIComponent(`${prompt.title}\n\n${prompt.description}\n\n---\n\n${prompt.promptContent}`);
    window.open(`https://docs.google.com/document/create?title=${encodeURIComponent(prompt.title)}&body=${content}`, "_blank");
  };

  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html><head><title>${prompt.title}</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; padding: 40px; max-width: 700px; margin: auto; color: #222; }
          h1 { color: ${lensColor}; font-size: 24px; border-bottom: 2px solid ${lensColor}; padding-bottom: 8px; }
          h2 { font-size: 16px; color: #555; margin-top: 24px; }
          pre { background: #f5f5f5; padding: 16px; border-radius: 8px; white-space: pre-wrap; font-size: 13px; line-height: 1.6; }
          .badge { display: inline-block; background: ${lensColor}20; color: ${lensColor}; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
          .meta { color: #888; font-size: 13px; margin-top: 8px; }
          ul { padding-left: 20px; }
          li { margin-bottom: 4px; color: #444; }
          footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 11px; color: #aaa; }
        </style></head><body>
        <span class="badge">${prompt.lensType}</span>
        <h1>${prompt.title}</h1>
        <p class="meta">${prompt.description}</p>
        ${prompt.whatItDoes?.length ? `<h2>What you'll learn</h2><ul>${prompt.whatItDoes.map((w: string) => `<li>${w}</li>`).join("")}</ul>` : ""}
        ${prompt.perfectFor ? `<h2>Perfect for</h2><p>${prompt.perfectFor}</p>` : ""}
        <h2>Prompt</h2><pre>${prompt.promptContent}</pre>
        <footer>Generated from GreenElephant.org Prompting Playground</footer>
        </body></html>
      `);
      printWindow.document.close();
      setTimeout(() => { printWindow.print(); }, 300);
    }
  };

  return (
    <Card className="bg-black/30 border-white/10 backdrop-blur-sm hover-elevate transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Badge style={{ backgroundColor: `${lensColor}20`, color: lensColor, borderColor: `${lensColor}40` }}>
                {prompt.lensType}
              </Badge>
              {prompt.roleCategory && prompt.roleCategory !== "all" && (
                <Badge className="bg-white/10 text-white/60 border-white/10">{prompt.roleCategory}</Badge>
              )}
            </div>
            <h3 className="text-base font-semibold text-white leading-tight">{prompt.title}</h3>
            <p className="text-sm text-white/50 mt-1 line-clamp-2">{prompt.description}</p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-white/40 hover:text-white/70 flex items-center gap-1 mb-3"
          data-testid={`button-expand-prompt-${prompt.id}`}
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? "Hide details" : "Show details"}
        </button>

        {expanded && (
          <div className="space-y-3 mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {prompt.whatItDoes?.length > 0 && (
              <div>
                <p className="text-xs text-white/40 font-medium mb-1">What you'll learn:</p>
                <ul className="space-y-1">
                  {prompt.whatItDoes.map((item, i) => (
                    <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ backgroundColor: lensColor }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {prompt.perfectFor && (
              <div>
                <p className="text-xs text-white/40 font-medium mb-1">Perfect for:</p>
                <p className="text-sm text-white/60">{prompt.perfectFor}</p>
              </div>
            )}
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-white/40 mb-2 font-medium">Full Prompt:</p>
              <pre className="text-xs text-white/60 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">{prompt.promptContent}</pre>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            className="text-white"
            style={{ backgroundColor: lensColor }}
            onClick={() => handleCopy(prompt.promptContent, prompt.title)}
            data-testid={`button-copy-prompt-${prompt.id}`}
          >
            {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
            {copied ? "Copied!" : "Copy for AI"}
          </Button>
          <Button variant="outline" className="border-white/10 text-white/70" onClick={handleExportGoogleDocs} data-testid={`button-gdocs-${prompt.id}`}>
            <SiGoogle className="w-3 h-3 mr-1" />
            Google Docs
          </Button>
          <Button variant="outline" className="border-white/10 text-white/70" onClick={handleExportPDF} data-testid={`button-pdf-${prompt.id}`}>
            <Download className="w-3 h-3 mr-1" />
            PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ExplorationSliders({
  values,
  onChange,
}: {
  values: Record<string, number>;
  onChange: (key: string, val: number) => void;
}) {
  return (
    <div className="space-y-4">
      {EXPLORATION_DIMENSIONS.map((dim) => {
        const Icon = dim.icon;
        return (
          <div key={dim.key} className="space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-[#009999]" />
                <span className="text-sm text-white/80 font-medium">{dim.label}</span>
                <InfoTip><p>{dim.description}</p></InfoTip>
              </div>
              <span className="text-xs text-white/40 tabular-nums">{values[dim.key] || 50}%</span>
            </div>
            <Slider
              value={[values[dim.key] || 50]}
              onValueChange={([v]) => onChange(dim.key, v)}
              min={0}
              max={100}
              step={5}
              className="w-full"
              data-testid={`slider-${dim.key}`}
            />
            <div className="flex justify-between text-xs text-white/25">
              <span>Exploring</span>
              <span>Mastering</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function PlaygroundPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLens, setSelectedLens] = useState("all");
  const [activeTab, setActiveTab] = useState("prompts");
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({
    partners: 50,
    teams: 50,
    values: 50,
    habits: 50,
    roadmap: 50,
  });
  const [vizQuery, setVizQuery] = useState("");
  const [vizHtml, setVizHtml] = useState<string | null>(null);
  const vizFrameRef = useRef<HTMLIFrameElement>(null);

  const { data: promptsData, isLoading: promptsLoading } = useQuery<Prompt[]>({
    queryKey: ["/api/prompts"],
  });

  const vizMutation = useMutation({
    mutationFn: async (query: string) => {
      const res = await apiRequest("POST", "/api/dashboard/generate-ui", {
        prompt: query,
        data: {
          explorationProfile: sliderValues,
          selectedLens,
        },
      });
      const data = await res.json();
      return data.html || data.content || data;
    },
    onSuccess: (html: string) => {
      setVizHtml(typeof html === "string" ? html : JSON.stringify(html));
    },
    onError: () => {
      toast({ title: "Visualization failed", description: "Could not generate dashboard. Try a different query.", variant: "destructive" });
    },
  });

  const filteredPrompts = useMemo(() => {
    if (!promptsData) return [];
    return promptsData.filter((p) => {
      if (selectedLens !== "all" && p.lensType !== selectedLens) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.lensType.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [promptsData, selectedLens, searchQuery]);

  const getLensColor = (lens: string) => LENSES.find((l) => l.key === lens)?.color || "#009999";

  const handleGenerateRoadmap = () => {
    const focusAreas = EXPLORATION_DIMENSIONS.filter((d) => (sliderValues[d.key] || 50) >= 70).map((d) => d.label);
    const growthAreas = EXPLORATION_DIMENSIONS.filter((d) => (sliderValues[d.key] || 50) < 40).map((d) => d.label);

    const roadmapPrompt = `Create a personal development roadmap for conscious communication:

STRENGTHS (scored 70%+): ${focusAreas.length ? focusAreas.join(", ") : "None identified yet"}
GROWTH AREAS (scored below 40%): ${growthAreas.length ? growthAreas.join(", ") : "None — well balanced!"}

Slider Profile:
${EXPLORATION_DIMENSIONS.map((d) => `- ${d.label}: ${sliderValues[d.key] || 50}%`).join("\n")}

${selectedLens !== "all" ? `Focus Lens: ${selectedLens}` : "All lenses"}

Please generate:
1. A 90-day development roadmap with weekly micro-habits
2. Three value-rules based on my profile
3. Key communication patterns to watch for
4. Suggested exercises for partner and team dynamics
5. Metrics to track progress`;

    navigator.clipboard.writeText(roadmapPrompt);
    toast({
      title: "Roadmap Prompt Copied!",
      description: "Paste into ChatGPT, Claude, or any AI to generate your personal development plan.",
    });
  };

  const handleExportProfile = () => {
    const profile = {
      explorationProfile: sliderValues,
      selectedLens,
      timestamp: new Date().toISOString(),
      strengths: EXPLORATION_DIMENSIONS.filter((d) => (sliderValues[d.key] || 50) >= 70).map((d) => d.label),
      growthAreas: EXPLORATION_DIMENSIONS.filter((d) => (sliderValues[d.key] || 50) < 40).map((d) => d.label),
    };

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html><head><title>Communication Profile - GreenElephant</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; padding: 40px; max-width: 700px; margin: auto; color: #222; }
          h1 { color: #009999; font-size: 24px; }
          h2 { font-size: 16px; color: #555; margin-top: 24px; }
          .bar-container { margin: 8px 0; }
          .bar-label { font-size: 13px; color: #555; margin-bottom: 4px; }
          .bar-bg { background: #eee; border-radius: 4px; height: 20px; position: relative; }
          .bar-fill { background: #009999; border-radius: 4px; height: 20px; display: flex; align-items: center; justify-content: flex-end; padding-right: 6px; color: white; font-size: 11px; font-weight: 600; }
          .section { margin-top: 20px; padding: 16px; background: #f8f8f8; border-radius: 8px; }
          footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 11px; color: #aaa; }
        </style></head><body>
        <h1>Communication Exploration Profile</h1>
        <p style="color: #888;">Generated on ${new Date().toLocaleDateString()} from GreenElephant.org</p>
        <h2>Exploration Dimensions</h2>
        ${EXPLORATION_DIMENSIONS.map((d) => `
          <div class="bar-container">
            <div class="bar-label">${d.label}</div>
            <div class="bar-bg"><div class="bar-fill" style="width: ${sliderValues[d.key] || 50}%">${sliderValues[d.key] || 50}%</div></div>
          </div>
        `).join("")}
        ${profile.strengths.length ? `<div class="section"><h2>Strengths</h2><p>${profile.strengths.join(", ")}</p></div>` : ""}
        ${profile.growthAreas.length ? `<div class="section"><h2>Growth Areas</h2><p>${profile.growthAreas.join(", ")}</p></div>` : ""}
        <footer>GreenElephant.org — Conscious Communication Platform</footer>
        </body></html>
      `);
      printWindow.document.close();
      setTimeout(() => { printWindow.print(); }, 300);
    }
  };

  return (
    <PortalLayout>
    <div className="min-h-screen bg-gradient-to-b from-transparent via-[#040410]/50 to-transparent">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-white/60" onClick={() => setLocation("/portal")} data-testid="button-back-portal">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
                Prompting Playground
              </h1>
              <p className="text-sm text-white/50">Explore, customize, and export communication prompts</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#009999]/20 text-[#009999] border-[#009999]/30">
              <Sparkles className="w-3 h-3 mr-1" />
              {promptsData?.length || 0} Prompts Available
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {LENSES.map((lens) => {
            const Icon = lens.icon;
            const isActive = selectedLens === lens.key;
            return (
              <Button
                key={lens.key}
                variant="outline"
                className={`border-white/10 transition-all ${isActive ? "text-white" : "text-white/50"}`}
                style={isActive ? { backgroundColor: `${lens.color}20`, borderColor: `${lens.color}50`, color: lens.color } : {}}
                onClick={() => setSelectedLens(lens.key)}
                data-testid={`button-lens-${lens.key}`}
              >
                <Icon className="w-3.5 h-3.5 mr-1.5" />
                {lens.label}
              </Button>
            );
          })}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white/5 mb-6">
            <TabsTrigger value="prompts" className="data-[state=active]:bg-[#009999]/20 data-[state=active]:text-[#009999]" data-testid="tab-prompts">
              <FileText className="w-4 h-4 mr-1.5" />
              Prompt Library
            </TabsTrigger>
            <TabsTrigger value="explore" className="data-[state=active]:bg-[#009999]/20 data-[state=active]:text-[#009999]" data-testid="tab-explore">
              <Compass className="w-4 h-4 mr-1.5" />
              Explore & Build
            </TabsTrigger>
            <TabsTrigger value="visualize" className="data-[state=active]:bg-[#009999]/20 data-[state=active]:text-[#009999]" data-testid="tab-visualize">
              <BarChart3 className="w-4 h-4 mr-1.5" />
              Visualize
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prompts">
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  placeholder="Search prompts by title, description, or lens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#009999]/50"
                  data-testid="input-search-prompts"
                />
              </div>
            </div>

            {promptsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="bg-black/30 border-white/10 animate-pulse">
                    <CardContent className="p-5 space-y-3">
                      <div className="h-4 bg-white/10 rounded w-1/3" />
                      <div className="h-5 bg-white/10 rounded w-2/3" />
                      <div className="h-3 bg-white/5 rounded w-full" />
                      <div className="h-3 bg-white/5 rounded w-4/5" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredPrompts.length === 0 ? (
              <Card className="bg-black/30 border-white/10">
                <CardContent className="p-12 text-center">
                  <Search className="w-8 h-8 text-white/20 mx-auto mb-3" />
                  <p className="text-white/50">No prompts found matching your filters.</p>
                  <p className="text-sm text-white/30 mt-1">Try a different lens or search term.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPrompts.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} lensColor={getLensColor(prompt.lensType)} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="explore">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-white text-lg">Your Exploration Profile</CardTitle>
                    <InfoTip>
                      <p>Move the sliders to tell us where you are on each dimension. This shapes the roadmaps and micro-habits we generate for you. No wrong answers — just honest self-assessment.</p>
                    </InfoTip>
                  </div>
                  <p className="text-sm text-white/50">Adjust sliders to reflect your current communication journey</p>
                </CardHeader>
                <CardContent>
                  <ExplorationSliders
                    values={sliderValues}
                    onChange={(key, val) => setSliderValues((prev) => ({ ...prev, [key]: val }))}
                  />
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Generate Your Roadmap</CardTitle>
                    <p className="text-sm text-white/50">Based on your exploration profile above</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-sm text-white/60 mb-3">
                        Your profile generates a personalized prompt including 90-day roadmap, value-rules, micro-habits, and progress metrics. Copy it into any AI tool to get your plan.
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {(() => {
                          const strengths = EXPLORATION_DIMENSIONS.filter((d) => (sliderValues[d.key] || 50) >= 70);
                          const growth = EXPLORATION_DIMENSIONS.filter((d) => (sliderValues[d.key] || 50) < 40);
                          return (
                            <>
                              {strengths.map((s) => (
                                <Badge key={s.key} className="bg-green-500/20 text-green-400 border-green-500/30">{s.label}</Badge>
                              ))}
                              {growth.map((g) => (
                                <Badge key={g.key} className="bg-orange-500/20 text-orange-400 border-orange-500/30">{g.label}</Badge>
                              ))}
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Button className="bg-[#009999] text-white" onClick={handleGenerateRoadmap} data-testid="button-generate-roadmap">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Roadmap Prompt for AI
                      </Button>
                      <Button variant="outline" className="border-white/10 text-white/70" onClick={handleExportProfile} data-testid="button-export-profile-pdf">
                        <Download className="w-4 h-4 mr-2" />
                        Export Profile PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { label: "Generate Value-Rules for My Team", prompt: `Based on my communication profile (${EXPLORATION_DIMENSIONS.map((d) => `${d.label}: ${sliderValues[d.key]}%`).join(", ")}), generate 5 concrete value-rules my team can adopt for better conscious communication. Each rule should be actionable, measurable, and tied to the GreenElephant 8-lens framework.` },
                      { label: "Create Micro-Habits (Daily 5-min)", prompt: `Create 7 daily micro-habits (each under 5 minutes) for improving conscious communication. Profile: ${EXPLORATION_DIMENSIONS.map((d) => `${d.label}: ${sliderValues[d.key]}%`).join(", ")}. Each habit should target a specific lens and be easy enough for someone with ADHD to maintain.` },
                      { label: "Partner Communication Blueprint", prompt: `Design a communication blueprint for working with business partners based on my profile: ${EXPLORATION_DIMENSIONS.map((d) => `${d.label}: ${sliderValues[d.key]}%`).join(", ")}. Include: meeting formats, feedback protocols, conflict resolution approaches, and alignment check-ins. Framework: GreenElephant's 8 communication lenses.` },
                      { label: "HR Presentation Summary", prompt: `Create a professional summary suitable for sharing with HR or team leaders about my conscious communication development journey. Profile: ${EXPLORATION_DIMENSIONS.map((d) => `${d.label}: ${sliderValues[d.key]}%`).join(", ")}. Include: current state assessment, key growth areas, proposed actions, expected outcomes, and timeline. Format for a 1-page executive summary.` },
                    ].map((action, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="w-full justify-start border-white/10 text-white/70 text-left"
                        onClick={() => {
                          navigator.clipboard.writeText(action.prompt);
                          toast({ title: "Prompt Copied!", description: `"${action.label}" prompt ready for your AI tool.` });
                        }}
                        data-testid={`button-quick-action-${i}`}
                      >
                        <Copy className="w-3.5 h-3.5 mr-2 shrink-0" />
                        <span className="truncate">{action.label}</span>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="visualize">
            <div className="space-y-6">
              <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-white text-lg">Interactive Data Visualization</CardTitle>
                    <InfoTip>
                      <p>Ask a question about communication patterns, lens data, or your profile — and get a live interactive chart. Try things like "Show me a radar chart of my exploration profile" or "Compare all 8 lenses as a bar chart".</p>
                    </InfoTip>
                  </div>
                  <p className="text-sm text-white/50">Powered by Thesys — ask anything about your communication data</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. Show a radar chart of my exploration profile..."
                      value={vizQuery}
                      onChange={(e) => setVizQuery(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#009999]/50"
                      data-testid="input-viz-query"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && vizQuery.trim()) vizMutation.mutate(vizQuery);
                      }}
                    />
                    <Button
                      className="bg-[#009999] text-white shrink-0"
                      onClick={() => vizQuery.trim() && vizMutation.mutate(vizQuery)}
                      disabled={vizMutation.isPending || !vizQuery.trim()}
                      data-testid="button-generate-viz"
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      {vizMutation.isPending ? "Generating..." : "Generate"}
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      "Radar chart of my exploration profile",
                      "Bar chart comparing all 8 lenses",
                      "Growth areas as a priority matrix",
                      "Team dynamics heatmap",
                    ].map((suggestion, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="border-white/10 text-white/50 text-xs"
                        onClick={() => { setVizQuery(suggestion); vizMutation.mutate(suggestion); }}
                        data-testid={`button-viz-suggestion-${i}`}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {vizMutation.isPending && (
                <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <div className="w-8 h-8 border-2 border-[#009999] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/50">Generating your visualization...</p>
                    <p className="text-sm text-white/30 mt-1">This may take a few seconds</p>
                  </CardContent>
                </Card>
              )}

              {vizHtml && !vizMutation.isPending && (
                <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between gap-2 flex-wrap">
                    <CardTitle className="text-white text-lg">Your Visualization</CardTitle>
                    <Button
                      variant="outline"
                      className="border-white/10 text-white/60"
                      onClick={() => {
                        const printWindow = window.open("", "_blank");
                        if (printWindow) {
                          printWindow.document.write(`<html><head><title>Visualization - GreenElephant</title></head><body>${vizHtml}</body></html>`);
                          printWindow.document.close();
                        }
                      }}
                      data-testid="button-export-viz"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1" />
                      Open Full Screen
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg overflow-hidden border border-white/10 bg-white">
                      <iframe
                        ref={vizFrameRef}
                        srcDoc={vizHtml}
                        className="w-full border-0"
                        style={{ minHeight: "400px" }}
                        title="Communication Visualization"
                        sandbox="allow-scripts"
                        data-testid="iframe-visualization"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {!vizHtml && !vizMutation.isPending && (
                <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <BarChart3 className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <p className="text-white/40 text-lg font-medium">No visualization yet</p>
                    <p className="text-sm text-white/30 mt-1">Type a query above or click a suggestion to generate an interactive chart</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </PortalLayout>
  );
}
