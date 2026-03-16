import { useState, useEffect } from "react";
import { Scan, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { AILoadingOverlay } from "@/components/portal/AILoadingOverlay";

interface ReflectionToolProps {
  onSaveToTimeline?: (event: { type: string; title: string; description: string; details?: string; lens?: string; toolId?: string }) => void;
}

interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string | null;
  details: string | null;
  lens: string | null;
  date: string;
}

const LENSES = [
  { id: "influence", name: "Influence", color: "#cc3333", desc: "How you exert influence with integrity" },
  { id: "attitude", name: "Attitude", color: "#ff9933", desc: "Your stance toward change and growth" },
  { id: "chaordic", name: "Chaordic", color: "#ffcc00", desc: "Order in creative chaos — including Human-to-AI dialogue" },
  { id: "flow", name: "Flow", color: "#cccc33", desc: "Sensing flow in conversations" },
  { id: "alignment", name: "Alignment", color: "#669966", desc: "Building empathy and shared understanding" },
  { id: "needs", name: "Needs", color: "#33a854", desc: "Honoring your energy and core needs" },
  { id: "ego", name: "Ego", color: "#3b7dd8", desc: "Recognizing and loosening ego patterns" },
  { id: "dynamics", name: "Dynamics", color: "#9933cc", desc: "Understanding relationship dynamics" },
];

export function ReflectionTool({ onSaveToTimeline }: ReflectionToolProps) {
  const [selectedLens, setSelectedLens] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const { toast } = useToast();

  const { data: timelineEvents = [] } = useQuery<TimelineEvent[]>({
    queryKey: ["/api/portal/timeline"],
  });

  const lensHistory = selectedLens
    ? timelineEvents.filter((e) => e.lens === selectedLens).slice(0, 5)
    : [];

  useEffect(() => {
    setAutoSaved(false);
  }, [selectedLens, input]);

  const handleReflect = async () => {
    if (!selectedLens || !input.trim()) return;
    const lens = LENSES.find((l) => l.id === selectedLens);
    setLoading(true);
    setResult("");
    setAutoSaved(false);
    try {
      const historyContext = lensHistory.length > 0
        ? `\n\nPrevious ${lens?.name} entries from timeline:\n${lensHistory.map((e) => `- [${new Date(e.date).toLocaleDateString("en-GB")}] ${e.title}: ${e.description || ""}`).join("\n")}`
        : "";

      const res = await apiRequest("POST", "/api/portal/ai", {
        tool: "reflection",
        userMessage: `I want to reflect on the ${lens?.name} lens: "${lens?.desc}"\n\nHere's what I'm noticing:\n${input.trim()}${historyContext}`,
      });
      const data = await res.json();
      const reflectionResult = data.result || "No reflection available.";
      setResult(reflectionResult);

      if (onSaveToTimeline) {
        onSaveToTimeline({
          type: "communication",
          title: `Reflection: ${lens?.name || "General"}`,
          description: input.trim().slice(0, 200),
          details: reflectionResult,
          lens: lens?.id,
          toolId: "reflection",
        });
        setAutoSaved(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to get reflection";
      toast({ title: "Reflection failed", description: msg, variant: "destructive" });
      if (msg.includes("unavailable") || msg.includes("disabled")) {
        setResult("AI features are currently unavailable. Try writing your own reflection below and saving it to your timeline.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (autoSaved) {
      toast({ title: "Already saved", description: "This reflection was auto-saved to your timeline." });
      return;
    }
    const lens = LENSES.find((l) => l.id === selectedLens);
    if (onSaveToTimeline) {
      onSaveToTimeline({
        type: "communication",
        title: `Reflection: ${lens?.name || "General"}`,
        description: input.trim().slice(0, 200),
        details: result || undefined,
        lens: lens?.id,
        toolId: "reflection",
      });
      setAutoSaved(true);
    }
  };

  const handleReset = () => {
    setSelectedLens(null);
    setInput("");
    setResult("");
    setAutoSaved(false);
  };

  if (loading) {
    return <AILoadingOverlay toolId="reflection" />;
  }

  if (result) {
    const lens = LENSES.find((l) => l.id === selectedLens);
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: lens?.color }}
          />
          <p className="text-xs text-white/50">
            <span className="font-medium text-white/70">{lens?.name}</span> — {lens?.desc}
          </p>
        </div>

        <div className="p-4 rounded-lg border" style={{ backgroundColor: `${lens?.color}08`, borderColor: `${lens?.color}20` }}>
          <div className="flex items-center gap-2 mb-3">
            <Scan className="w-4 h-4" style={{ color: lens?.color }} />
            <p className="text-xs font-medium" style={{ color: lens?.color }}>Reflection</p>
          </div>
          <div className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed" data-testid="text-reflection-result">
            {result}
          </div>
        </div>

        {autoSaved && (
          <p className="text-xs text-[#009999]/60 text-center">Auto-saved to your timeline</p>
        )}

        {lensHistory.length > 0 && (
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <p className="text-xs text-white/30 mb-2">Previous {lens?.name} reflections ({lensHistory.length})</p>
            {lensHistory.map((e) => (
              <p key={e.id} className="text-xs text-white/20 truncate">
                {new Date(e.date).toLocaleDateString("en-GB")} — {e.title}
              </p>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleReset} className="flex-1 text-white/40" data-testid="button-reflection-reset">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            New Reflection
          </Button>
          <Button
            onClick={handleSave}
            disabled={autoSaved}
            className="flex-1 bg-[#009999] text-white border-[#009999]/30"
            data-testid="button-reflection-save"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {autoSaved ? "Saved" : "Save to Timeline"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/50">Choose a lens to reflect through, then describe what you're noticing in your communication.</p>

      <div className="grid grid-cols-2 gap-1.5">
        {LENSES.map((lens) => {
          const count = timelineEvents.filter((e) => e.lens === lens.id).length;
          return (
            <button
              key={lens.id}
              onClick={() => setSelectedLens(lens.id)}
              className={`flex items-center gap-2 p-2.5 rounded-lg text-left transition-colors ${
                selectedLens === lens.id
                  ? "border"
                  : "bg-white/[0.03] border border-white/5"
              }`}
              style={
                selectedLens === lens.id
                  ? { backgroundColor: `${lens.color}12`, borderColor: `${lens.color}30` }
                  : undefined
              }
              data-testid={`button-lens-${lens.id}`}
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: lens.color }}
              />
              <span
                className={`text-xs flex-1 ${selectedLens === lens.id ? "font-medium" : ""}`}
                style={{ color: selectedLens === lens.id ? lens.color : "rgba(255,255,255,0.5)" }}
              >
                {lens.name}
              </span>
              {count > 0 && (
                <span className="text-xs text-white/20">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {selectedLens && (
        <>
          {lensHistory.length > 0 && (
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
              <p className="text-xs text-white/30 mb-1">Your recent {LENSES.find((l) => l.id === selectedLens)?.name} entries:</p>
              {lensHistory.slice(0, 3).map((e) => (
                <p key={e.id} className="text-xs text-white/20 truncate">
                  {new Date(e.date).toLocaleDateString("en-GB")} — {e.description || e.title}
                </p>
              ))}
            </div>
          )}

          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What patterns are you noticing? What situation brings this lens to mind?"
            className="min-h-[100px] bg-white/[0.03] border-white/10 text-white/80 placeholder:text-white/20 text-sm resize-none"
            data-testid="input-reflection"
          />

          <Button
            onClick={handleReflect}
            disabled={!input.trim() || loading}
            className="w-full bg-[#009999] text-white border-[#009999]/30"
            data-testid="button-reflect"
          >
            Get Reflection
          </Button>
        </>
      )}
    </div>
  );
}
