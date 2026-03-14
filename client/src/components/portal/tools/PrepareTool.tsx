import { useState } from "react";
import { BookOpen, Loader2, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PrepareToolProps {
  onSaveToTimeline?: (event: { type: string; title: string; description: string; details?: string; toolId?: string }) => void;
}

const SITUATION_TYPES = [
  { id: "meeting", label: "Meeting / Presentation" },
  { id: "conflict", label: "Difficult Conversation" },
  { id: "feedback", label: "Giving / Receiving Feedback" },
  { id: "negotiation", label: "Negotiation" },
  { id: "email", label: "Important Email / Message" },
  { id: "other", label: "Other" },
];

export function PrepareTool({ onSaveToTimeline }: PrepareToolProps) {
  const [situationType, setSituationType] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePrepare = async () => {
    if (!input.trim()) return;
    const sitLabel = SITUATION_TYPES.find((s) => s.id === situationType)?.label || "Conversation";
    setLoading(true);
    setResult("");
    try {
      const res = await apiRequest("POST", "/api/portal/ai", {
        tool: "prepare",
        userMessage: `I'm preparing for: ${sitLabel}\n\nHere's the situation:\n${input.trim()}`,
      });
      const data = await res.json();
      setResult(data.result || "No preparation notes available.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to get preparation notes";
      toast({ title: "Preparation failed", description: msg, variant: "destructive" });
      if (msg.includes("unavailable") || msg.includes("disabled")) {
        setResult("AI features are currently unavailable. Try journaling your preparation notes and saving them to your timeline.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    const sitLabel = SITUATION_TYPES.find((s) => s.id === situationType)?.label || "Conversation";
    if (onSaveToTimeline) {
      onSaveToTimeline({
        type: "communication",
        title: `Prep: ${sitLabel}`,
        description: input.trim().slice(0, 200),
        details: result || undefined,
        toolId: "prepare",
      });
    }
  };

  const handleReset = () => {
    setSituationType(null);
    setInput("");
    setResult("");
  };

  if (result) {
    return (
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
          <p className="text-xs text-white/25 font-medium uppercase tracking-wider mb-1">Preparing for</p>
          <p className="text-xs text-white/50 line-clamp-2">{input}</p>
        </div>

        <div className="p-4 rounded-lg bg-[#9933cc]/5 border border-[#9933cc]/10">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-[#9933cc]" />
            <p className="text-xs font-medium text-[#9933cc]">Preparation Notes</p>
          </div>
          <div className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed" data-testid="text-prepare-result">
            {result}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleReset} className="flex-1 text-white/40" data-testid="button-prepare-reset">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Prepare Another
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-[#009999] text-white border-[#009999]/30" data-testid="button-prepare-save">
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Save to Timeline
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/50">
        What are you preparing for? Select a type and describe the situation.
      </p>

      <div className="grid grid-cols-2 gap-1.5">
        {SITUATION_TYPES.map((sit) => (
          <button
            key={sit.id}
            onClick={() => setSituationType(sit.id)}
            className={`p-2.5 rounded-lg text-xs text-left transition-colors ${
              situationType === sit.id
                ? "bg-[#9933cc]/12 border border-[#9933cc]/30 text-[#9933cc] font-medium"
                : "bg-white/[0.03] border border-white/5 text-white/50"
            }`}
            data-testid={`button-situation-${sit.id}`}
          >
            {sit.label}
          </button>
        ))}
      </div>

      {situationType && (
        <>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the situation. Who's involved? What's at stake? What outcome do you want?"
            className="min-h-[120px] bg-white/[0.03] border-white/10 text-white/80 placeholder:text-white/20 text-sm resize-none"
            data-testid="input-prepare"
          />

          <Button
            onClick={handlePrepare}
            disabled={!input.trim() || loading}
            className="w-full bg-[#009999] text-white border-[#009999]/30"
            data-testid="button-prepare-go"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Preparing...
              </>
            ) : (
              "Get Communication Prep"
            )}
          </Button>
        </>
      )}
    </div>
  );
}
