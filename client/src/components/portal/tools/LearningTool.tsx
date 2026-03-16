import { useState } from "react";
import { GraduationCap, Save, RotateCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface LearningToolProps {
  onSaveToTimeline?: (event: { type: string; title: string; description: string; details?: string; lens?: string; toolId?: string }) => void;
}

const LENS_OPTIONS = [
  { id: "influence", label: "Influence", color: "#cc3333" },
  { id: "attitude", label: "Attitude", color: "#e8833a" },
  { id: "chaordic", label: "Chaordic", color: "#e8c840" },
  { id: "flow", label: "Flow", color: "#33a854" },
  { id: "alignment", label: "Alignment", color: "#009999" },
  { id: "needs", label: "Needs", color: "#33a854" },
  { id: "ego", label: "Ego", color: "#3b7dd8" },
  { id: "dynamics", label: "Dynamics", color: "#9933cc" },
];

export function LearningTool({ onSaveToTimeline }: LearningToolProps) {
  const [title, setTitle] = useState("");
  const [insight, setInsight] = useState("");
  const [selectedLens, setSelectedLens] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    if (!insight.trim()) {
      toast({ title: "Add an insight", description: "Describe what you learned.", variant: "destructive" });
      return;
    }
    const finalTitle = title.trim() || "Learning Insight";
    if (onSaveToTimeline) {
      onSaveToTimeline({
        type: "learning",
        title: finalTitle,
        description: insight.trim().slice(0, 200),
        details: insight.trim(),
        lens: selectedLens || undefined,
        toolId: "learning",
      });
    }
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center bg-[#3b7dd8]/15 border border-[#3b7dd8]/30">
          <CheckCircle2 className="w-6 h-6 text-[#3b7dd8]" />
        </div>
        <p className="text-sm text-white/70">Learning saved to your timeline</p>
        <Button
          variant="ghost"
          className="text-[#3b7dd8]"
          onClick={() => { setSaved(false); setTitle(""); setInsight(""); setSelectedLens(null); }}
          data-testid="button-add-another-learning"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Add Another
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/50">
        Capture something you learned — from a conversation, a coaching session, a book, or a moment of clarity.
      </p>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (optional)"
        className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-white/80 text-sm placeholder:text-white/20 outline-none focus:border-[#3b7dd8]/30"
        data-testid="input-learning-title"
      />

      <Textarea
        value={insight}
        onChange={(e) => setInsight(e.target.value)}
        placeholder="What did you learn? What shifted for you? What would you tell your past self?"
        className="min-h-[120px] bg-white/[0.03] border-white/10 text-white/80 placeholder:text-white/20 text-sm resize-none"
        data-testid="input-learning-insight"
      />

      <div>
        <p className="text-xs text-white/30 mb-2">Connect to a lens (optional)</p>
        <div className="flex flex-wrap gap-1.5">
          {LENS_OPTIONS.map((lens) => (
            <button
              key={lens.id}
              onClick={() => setSelectedLens(selectedLens === lens.id ? null : lens.id)}
              className="px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
              style={{
                backgroundColor: selectedLens === lens.id ? `${lens.color}20` : "rgba(255,255,255,0.03)",
                border: `1px solid ${selectedLens === lens.id ? `${lens.color}50` : "rgba(255,255,255,0.08)"}`,
                color: selectedLens === lens.id ? lens.color : "rgba(255,255,255,0.4)",
              }}
              data-testid={`button-lens-${lens.id}`}
            >
              {lens.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={!insight.trim()}
        className="w-full bg-[#3b7dd8] text-white border-[#3b7dd8]/30"
        data-testid="button-save-learning"
      >
        <Save className="w-3.5 h-3.5 mr-1.5" />
        Save to Timeline
      </Button>
    </div>
  );
}
