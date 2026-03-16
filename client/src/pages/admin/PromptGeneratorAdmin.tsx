import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AdminTooltip } from "@/components/AdminTooltip";
import { AIContextSelector } from "@/components/AIContextSelector";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Loader2,
  Check,
  Copy,
  Sparkles,
  Atom,
  Save,
  Trash2,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  ExternalLink,
  Plus,
  X,
} from "lucide-react";
import { ALL_ELEMENTS, getElementsByLens, type PeriodicElement } from "@/data/periodicElements";

const LENS_OPTIONS = [
  { value: "influence", label: "Influence", color: "#E63946" },
  { value: "attitude", label: "Attitude", color: "#F4A261" },
  { value: "chaordic", label: "Chaordic", color: "#E9C46A" },
  { value: "flow", label: "Flow", color: "#2A9D8F" },
  { value: "alignment", label: "Alignment", color: "#264653" },
  { value: "needs", label: "Needs", color: "#6A0572" },
  { value: "ego", label: "Ego", color: "#1D3557" },
  { value: "dynamics", label: "Dynamics", color: "#457B9D" },
];

const ROLE_OPTIONS = [
  { value: "all", label: "All audiences" },
  { value: "EA", label: "Executive Assistants" },
  { value: "ACX", label: "ACX Prompt Engineers" },
  { value: "TealLeaders", label: "Teal Leaders" },
];

const PROGRESS_STEPS = [
  { label: "Loading element context from Periodic Table", duration: 2000 },
  { label: "Detecting current lens and calendar rotation", duration: 1500 },
  { label: "Generating prompt title and description", duration: 4000 },
  { label: "Crafting whatItDoes analysis points", duration: 3000 },
  { label: "Writing full prompt template with data markers", duration: 6000 },
  { label: "Tailoring for target audience", duration: 2500 },
  { label: "Formatting output for Prompt Library", duration: 1500 },
];

function ProgressOverlay({ elementName }: { elementName: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const e = Date.now() - startTime.current;
      setElapsed(e);
      let acc = 0;
      for (let i = 0; i < PROGRESS_STEPS.length; i++) {
        acc += PROGRESS_STEPS[i].duration;
        if (e < acc) {
          setCurrentStep(i);
          return;
        }
      }
      setCurrentStep(PROGRESS_STEPS.length - 1);
    }, 300);
    return () => clearInterval(timer);
  }, []);

  const elapsedSeconds = Math.floor(elapsed / 1000);

  return (
    <Card className="border-chaordic/30">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Loader2 className="h-5 w-5 animate-spin text-chaordic" />
            <span className="font-semibold font-['Poppins']">Generating prompt for: {elementName}</span>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {elapsedSeconds}s
            </Badge>
          </div>

          <div className="space-y-2">
            {PROGRESS_STEPS.map((step, i) => {
              const isActive = i === currentStep;
              const isDone = i < currentStep;
              return (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                    {isDone ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : isActive ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-chaordic" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                    )}
                  </div>
                  <span className={`text-sm ${isDone ? "text-muted-foreground line-through" : isActive ? "text-foreground font-medium" : "text-muted-foreground/50"}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-border/30 space-y-1">
            <p className="text-xs text-muted-foreground">
              This usually takes 15-25 seconds. The AI is crafting a custom prompt.
            </p>
            <p className="text-xs text-muted-foreground/70">
              Check{" "}
              <a href="/admin/integrations" className="text-chaordic underline">Connected Tools</a>{" "}
              if this fails.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface GeneratedPrompt {
  title: string;
  description: string;
  whatItDoes: string[];
  perfectFor: string;
  promptContent: string;
}

export default function PromptGeneratorAdmin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [selectedLens, setSelectedLens] = useState<string>("influence");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedElement, setSelectedElement] = useState<PeriodicElement | null>(null);
  const [roleCategory, setRoleCategory] = useState("all");
  const [customInstructions, setCustomInstructions] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt | null>(null);
  const [editedPrompt, setEditedPrompt] = useState<GeneratedPrompt | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [elementsOpen, setElementsOpen] = useState(true);

  const lensQuery = useQuery<{ name: string; hexColor: string; code: number; description: string }>({
    queryKey: ["/api/admin/current-lens"],
  });

  const existingPromptsQuery = useQuery<Array<{ id: string; lensType: string; title: string }>>({
    queryKey: ["/api/prompts"],
  });

  const lens = lensQuery.data;

  const lensElements = getElementsByLens(selectedLens as any);
  const filteredElements = searchQuery
    ? lensElements.filter(
        (el) =>
          el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(el.code).includes(searchQuery)
      )
    : lensElements;

  const existingLensPromptTitles = (existingPromptsQuery.data || [])
    .filter((p) => p.lensType === selectedLens)
    .map((p) => p.title.toLowerCase());

  const generateMutation = useMutation({
    mutationFn: async (element: PeriodicElement) => {
      const res = await apiRequest("POST", "/api/admin/generate-element-prompt", {
        elementCode: element.code,
        elementName: element.name,
        elementSymbol: element.symbol,
        elementLens: element.lens,
        elementCategory: element.category || "",
        elementDescription: element.description || "",
        existingPrompt: element.examplePrompt || "",
        roleCategory,
        customInstructions,
      });
      return res.json();
    },
    onSuccess: (data: GeneratedPrompt) => {
      setGeneratedPrompt(data);
      setEditedPrompt({ ...data });
      toast({ title: "Prompt generated", description: "Review and edit below before saving." });
    },
    onError: (error: Error) => {
      toast({ title: "Generation failed", description: error.message, variant: "destructive" });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!editedPrompt || !selectedElement) return;
      const res = await apiRequest("POST", "/api/admin/save-element-prompt", {
        lensType: selectedLens,
        title: editedPrompt.title,
        description: editedPrompt.description,
        whatItDoes: editedPrompt.whatItDoes,
        perfectFor: editedPrompt.perfectFor,
        promptContent: editedPrompt.promptContent,
        roleCategory,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Prompt saved", description: "Added to the Prompt Library. Visible on /resources/prompts." });
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      setGeneratedPrompt(null);
      setEditedPrompt(null);
      setSelectedElement(null);
    },
    onError: (error: Error) => {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    },
  });

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const updateEditedField = <K extends keyof GeneratedPrompt>(key: K, value: GeneratedPrompt[K]) => {
    if (!editedPrompt) return;
    setEditedPrompt({ ...editedPrompt, [key]: value });
  };

  const lensColor = LENS_OPTIONS.find((l) => l.value === selectedLens)?.color || "#999";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-3 flex-wrap">
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="sm" onClick={() => navigate("/admin/submissions")} data-testid="button-back-admin">
            <ArrowLeft className="h-4 w-4 mr-1" /> Admin
          </Button></TooltipTrigger><TooltipContent>Back to Admin Hub</TooltipContent></Tooltip>
          <div className="flex-1">
            <h1 className="text-2xl font-['Poppins'] font-bold flex items-center gap-2">
              <Atom className="h-6 w-6 text-chaordic" />
              Prompt Generator
              <AdminTooltip
                what="AI-powered generator that creates Prompt Library entries from Periodic Table elements. Pick an element, let AI craft a full prompt, review and edit, then save to the library."
                how="Select a lens to browse elements, pick one, optionally set audience and custom instructions, then hit Generate. The AI uses the element's name, description, and example prompt as context. You review everything before it goes live."
                debug={[
                  { label: "Prompt Library", href: "/resources/prompts" },
                  { label: "Periodic Table", href: "/periodic-table" },
                  { label: "Thesys API", href: "/admin/integrations" },
                ]}
              />
            </h1>
            {lens && (
              <p className="text-sm text-muted-foreground mt-1">
                Current month lens: <span className="font-medium" style={{ color: lens.hexColor }}>{lens.name}</span>
              </p>
            )}
          </div>
        </div>

        <AIContextSelector compact />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-['Poppins'] flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Select Lens
                  <AdminTooltip
                    what="Each of the 8 communication lenses contains a set of elements from the Periodic Table. Pick a lens to see its elements."
                    how="Click a lens to filter elements. Elements with existing prompts are marked."
                    debug={[{ label: "Periodic Table", href: "/periodic-table" }]}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {LENS_OPTIONS.map((l) => {
                    const count = getElementsByLens(l.value as any).length;
                    return (
                      <button
                        key={l.value}
                        onClick={() => {
                          setSelectedLens(l.value);
                          setSelectedElement(null);
                          setSearchQuery("");
                        }}
                        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          selectedLens === l.value
                            ? "ring-2 ring-offset-1 ring-offset-background"
                            : "hover-elevate"
                        }`}
                        style={{
                          backgroundColor: selectedLens === l.value ? l.color + "20" : "transparent",
                          color: l.color,
                          borderColor: l.color,
                          border: "1px solid",
                        }}
                        data-testid={`button-lens-${l.value}`}
                      >
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: l.color }} />
                        <span className="truncate">{l.label}</span>
                        <Badge variant="outline" className="ml-auto text-xs px-1.5 py-0">{count}</Badge>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-sm font-['Poppins'] flex items-center gap-2">
                    <Atom className="h-4 w-4" style={{ color: lensColor }} />
                    {LENS_OPTIONS.find((l) => l.value === selectedLens)?.label} Elements ({filteredElements.length})
                  </CardTitle>
                  <Tooltip><TooltipTrigger asChild><Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setElementsOpen(!elementsOpen)}
                    data-testid="button-toggle-elements"
                  >
                    {elementsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button></TooltipTrigger><TooltipContent>{elementsOpen ? "Collapse" : "Expand"} element list</TooltipContent></Tooltip>
                </div>
              </CardHeader>
              {elementsOpen && (
                <CardContent className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search elements..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 text-sm"
                      data-testid="input-search-elements"
                    />
                  </div>
                  <div className="max-h-[400px] overflow-y-auto space-y-1 pr-1">
                    {filteredElements.map((el) => {
                      const isSelected = selectedElement?.code === el.code;
                      const elNameLower = el.name.toLowerCase();
                      const hasPrompt = existingLensPromptTitles.some(
                        (t) => t.includes(elNameLower) || elNameLower.includes(t.split(' ').slice(0, 2).join(' '))
                      );
                      return (
                        <button
                          key={el.code}
                          onClick={() => setSelectedElement(el)}
                          className={`w-full text-left flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                            isSelected ? "ring-1" : "hover-elevate"
                          }`}
                          style={{
                            backgroundColor: isSelected ? lensColor + "15" : "transparent",
                            borderColor: lensColor,
                          }}
                          data-testid={`button-element-${el.code}`}
                        >
                          <span
                            className="font-mono text-xs font-bold w-8 text-center flex-shrink-0"
                            style={{ color: lensColor }}
                          >
                            {el.symbol}
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="block truncate">{el.name}</span>
                            <span className="block text-xs text-muted-foreground truncate">
                              #{el.code} {el.category ? `· ${el.category}` : ""}
                            </span>
                          </div>
                          {hasPrompt && (
                            <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                    {filteredElements.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No elements found</p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {selectedElement ? (
              <>
                <Card className="border-white/10" style={{ borderColor: lensColor + "30" }}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-['Poppins'] flex items-center gap-3 flex-wrap">
                      <span
                        className="font-mono text-lg font-bold px-2 py-0.5 rounded"
                        style={{ backgroundColor: lensColor + "20", color: lensColor }}
                      >
                        {selectedElement.symbol}
                      </span>
                      <span>{selectedElement.name}</span>
                      <Badge variant="outline" className="text-xs">#{selectedElement.code}</Badge>
                      {selectedElement.category && (
                        <Badge variant="outline" className="text-xs">{selectedElement.category}</Badge>
                      )}
                      <AdminTooltip
                        what="This is the selected element from the Periodic Table. Its name, description, and example prompt are sent to the AI as context for generating a library prompt."
                        how="The AI reads the element data and crafts a full Prompt Library entry with title, description, what-it-does bullets, perfect-for scenario, and a copy-paste prompt template."
                        debug={[
                          { label: "View on table", href: "/periodic-table" },
                          { label: "Prompt Library", href: "/resources/prompts" },
                        ]}
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedElement.examplePrompt && (
                      <div className="text-sm">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Example prompt from table:</span>
                        <p className="mt-1 text-muted-foreground italic">"{selectedElement.examplePrompt}"</p>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Target Audience</label>
                        <select
                          value={roleCategory}
                          onChange={(e) => setRoleCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-md bg-background/50 border border-white/10 text-sm"
                          data-testid="select-role-category"
                        >
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => generateMutation.mutate(selectedElement)}
                              disabled={generateMutation.isPending}
                              className="w-full"
                              style={{ backgroundColor: lensColor, color: "white" }}
                              data-testid="button-generate-prompt"
                            >
                              {generateMutation.isPending ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Sparkles className="h-4 w-4 mr-2" />
                              )}
                              Generate Prompt
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Use AI to generate a prompt entry for this element</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-2">
                        Custom Instructions (optional)
                        <AdminTooltip
                          what="Extra instructions for the AI. Use this to steer the output towards a specific angle, tone, or focus area."
                          how="Whatever you type here is appended to the AI system prompt. Leave empty for default behaviour."
                          debug={[]}
                        />
                      </label>
                      <Textarea
                        value={customInstructions}
                        onChange={(e) => setCustomInstructions(e.target.value)}
                        placeholder="e.g., Focus on remote teams, make it more actionable, add a journaling exercise..."
                        className="text-sm min-h-[60px]"
                        data-testid="textarea-custom-instructions"
                      />
                    </div>
                  </CardContent>
                </Card>

                {generateMutation.isPending && (
                  <ProgressOverlay elementName={selectedElement.name} />
                )}

                {editedPrompt && !generateMutation.isPending && (
                  <Card className="border-green-500/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <CardTitle className="text-sm font-['Poppins'] flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Review & Edit Generated Prompt
                          <AdminTooltip
                            what="Human-in-the-loop: Review what the AI generated, edit any field, then save to the Prompt Library or discard."
                            how="Every field is editable. The whatItDoes bullets can be added or removed. Nothing goes live until you click Save."
                            debug={[
                              { label: "Prompt Library", href: "/resources/prompts" },
                            ]}
                          />
                        </CardTitle>
                        <div className="flex gap-2 flex-wrap">
                          <Tooltip><TooltipTrigger asChild><Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setGeneratedPrompt(null);
                              setEditedPrompt(null);
                            }}
                            data-testid="button-discard-prompt"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Discard
                          </Button></TooltipTrigger><TooltipContent>Discard this generated prompt without saving</TooltipContent></Tooltip>
                          <Tooltip><TooltipTrigger asChild><Button
                            size="sm"
                            onClick={() => saveMutation.mutate()}
                            disabled={saveMutation.isPending}
                            className="bg-green-600 text-white"
                            data-testid="button-save-prompt"
                          >
                            {saveMutation.isPending ? (
                              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                            ) : (
                              <Save className="h-3.5 w-3.5 mr-1.5" />
                            )}
                            Save to Library
                          </Button></TooltipTrigger><TooltipContent>Save this prompt to the public Prompt Library</TooltipContent></Tooltip>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label>
                        <Input
                          value={editedPrompt.title}
                          onChange={(e) => updateEditedField("title", e.target.value)}
                          className="text-sm"
                          data-testid="input-edit-title"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
                        <Textarea
                          value={editedPrompt.description}
                          onChange={(e) => updateEditedField("description", e.target.value)}
                          className="text-sm min-h-[60px]"
                          data-testid="textarea-edit-description"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-2">
                          What It Does
                          <Tooltip><TooltipTrigger asChild><Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateEditedField("whatItDoes", [...editedPrompt.whatItDoes, ""])}
                            data-testid="button-add-bullet"
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add
                          </Button></TooltipTrigger><TooltipContent>Add a new bullet point</TooltipContent></Tooltip>
                        </label>
                        <div className="space-y-2">
                          {editedPrompt.whatItDoes.map((item, i) => (
                            <div key={i} className="flex gap-2">
                              <Input
                                value={item}
                                onChange={(e) => {
                                  const updated = [...editedPrompt.whatItDoes];
                                  updated[i] = e.target.value;
                                  updateEditedField("whatItDoes", updated);
                                }}
                                className="text-sm flex-1"
                                placeholder={`Bullet point ${i + 1}`}
                                data-testid={`input-edit-whatitdoes-${i}`}
                              />
                              {editedPrompt.whatItDoes.length > 1 && (
                                <Tooltip><TooltipTrigger asChild><Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    const updated = editedPrompt.whatItDoes.filter((_, idx) => idx !== i);
                                    updateEditedField("whatItDoes", updated);
                                  }}
                                  data-testid={`button-remove-bullet-${i}`}
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button></TooltipTrigger><TooltipContent>Remove this bullet point</TooltipContent></Tooltip>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Perfect For</label>
                        <Input
                          value={editedPrompt.perfectFor}
                          onChange={(e) => updateEditedField("perfectFor", e.target.value)}
                          className="text-sm"
                          data-testid="input-edit-perfect-for"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                          <label className="text-xs font-medium text-muted-foreground">Prompt Content</label>
                          <Tooltip><TooltipTrigger asChild><Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(editedPrompt.promptContent, "promptContent")}
                            data-testid="button-copy-prompt-content"
                          >
                            {copiedField === "promptContent" ? (
                              <Check className="h-3 w-3 mr-1 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3 mr-1" />
                            )}
                            Copy
                          </Button></TooltipTrigger><TooltipContent>Copy prompt content to clipboard</TooltipContent></Tooltip>
                        </div>
                        <Textarea
                          value={editedPrompt.promptContent}
                          onChange={(e) => updateEditedField("promptContent", e.target.value)}
                          className="text-sm font-mono min-h-[200px]"
                          data-testid="textarea-edit-prompt-content"
                        />
                      </div>

                      <div className="flex items-center gap-4 pt-2 border-t border-border/30 flex-wrap">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Lens:</span>
                          <Badge variant="outline" style={{ borderColor: lensColor, color: lensColor }}>
                            {LENS_OPTIONS.find((l) => l.value === selectedLens)?.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Audience:</span>
                          <Badge variant="outline">
                            {ROLE_OPTIONS.find((r) => r.value === roleCategory)?.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Element:</span>
                          <Badge variant="outline" style={{ borderColor: lensColor }}>
                            {selectedElement.symbol} — {selectedElement.name}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end flex-wrap">
                        <Tooltip><TooltipTrigger asChild><Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setGeneratedPrompt(null);
                            setEditedPrompt(null);
                          }}
                          data-testid="button-discard-bottom"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Discard
                        </Button></TooltipTrigger><TooltipContent>Discard this generated prompt without saving</TooltipContent></Tooltip>
                        <Tooltip><TooltipTrigger asChild><Button
                          size="sm"
                          onClick={() => saveMutation.mutate()}
                          disabled={saveMutation.isPending}
                          className="bg-green-600 text-white"
                          data-testid="button-save-bottom"
                        >
                          {saveMutation.isPending ? (
                            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                          ) : (
                            <Save className="h-3.5 w-3.5 mr-1.5" />
                          )}
                          Save to Prompt Library
                        </Button></TooltipTrigger><TooltipContent>Save this prompt to the public Prompt Library</TooltipContent></Tooltip>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {!selectedElement && !generateMutation.isPending && !editedPrompt && (
                  <Card className="border-white/10">
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      <Atom className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">Select an element from the left panel to start generating a prompt.</p>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="border-white/10">
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <Atom className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select an element from the left panel to start generating a prompt.</p>
                  <p className="text-xs mt-2 text-muted-foreground/60">
                    Browse {ALL_ELEMENTS.length} elements across 8 communication lenses
                  </p>
                </CardContent>
              </Card>
            )}

            <Card className="border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-['Poppins'] flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  <a href="/resources/prompts" target="_blank" rel="noopener noreferrer">
                    <Tooltip><TooltipTrigger asChild><Button variant="outline" size="sm" data-testid="link-prompt-library">
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> View Prompt Library
                    </Button></TooltipTrigger><TooltipContent>Open the public Prompt Library page</TooltipContent></Tooltip>
                  </a>
                  <a href="/periodic-table" target="_blank" rel="noopener noreferrer">
                    <Tooltip><TooltipTrigger asChild><Button variant="outline" size="sm" data-testid="link-periodic-table">
                      <Atom className="h-3.5 w-3.5 mr-1.5" /> Periodic Table
                    </Button></TooltipTrigger><TooltipContent>Open the Periodic Table of Conscious Communication</TooltipContent></Tooltip>
                  </a>
                  <Tooltip><TooltipTrigger asChild><Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/admin/submissions")}
                    data-testid="link-admin-hub"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Admin Hub
                  </Button></TooltipTrigger><TooltipContent>Navigate back to Admin Hub</TooltipContent></Tooltip>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
