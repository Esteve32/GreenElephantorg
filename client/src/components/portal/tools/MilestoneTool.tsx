import { useState } from "react";
import { Flag, Star, Sparkles, Rocket, Mountain, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface MilestoneToolProps {
  onSaveToTimeline?: (event: {
    type: string;
    title: string;
    description: string;
    details?: string;
    toolId?: string;
  }) => void;
}

const MILESTONE_VISUALS = [
  { id: "star-cluster", label: "Star Cluster", icon: Sparkles, color: "#e8c840" },
  { id: "summit", label: "Summit", icon: Mountain, color: "#33a854" },
  { id: "launch", label: "Launch", icon: Rocket, color: "#3b7dd8" },
  { id: "breakthrough", label: "Breakthrough", icon: Star, color: "#cc3333" },
  { id: "achievement", label: "Achievement", icon: Trophy, color: "#e8833a" },
  { id: "checkpoint", label: "Checkpoint", icon: Flag, color: "#009999" },
];

export function MilestoneTool({ onSaveToTimeline }: MilestoneToolProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedVisual, setSelectedVisual] = useState("star-cluster");
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!title.trim()) {
      toast({ title: "Title required", description: "Give your milestone a name.", variant: "destructive" });
      return;
    }

    const visual = MILESTONE_VISUALS.find(v => v.id === selectedVisual);

    try {
      await onSaveToTimeline?.({
        type: "milestone",
        title: title.trim(),
        description: description.trim() || `Milestone: ${title.trim()}`,
        details: JSON.stringify({ visual: selectedVisual, visualLabel: visual?.label }),
        toolId: "milestone",
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setTitle("");
      setDescription("");
    } catch (err: unknown) {
      toast({ title: "Could not save milestone", description: err instanceof Error ? err.message : "Please try again.", variant: "destructive" });
    }
  };

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-[#3b7dd8]/20 border-2 border-[#3b7dd8]/40 flex items-center justify-center mb-4">
          <Flag className="w-7 h-7 text-[#3b7dd8]" />
        </div>
        <p className="text-lg font-semibold text-white mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>
          Milestone saved!
        </p>
        <p className="text-sm text-white/50">It's now part of your journey timeline.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="milestone-title" className="text-sm font-medium text-white/70 mb-2 block">What did you achieve?</label>
        <Input
          id="milestone-title"
          placeholder="e.g. First coaching session completed"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-[#3b7dd8]/50"
          data-testid="input-milestone-title"
        />
      </div>

      <div>
        <label htmlFor="milestone-description" className="text-sm font-medium text-white/70 mb-2 block">Reflection (optional)</label>
        <Textarea
          id="milestone-description"
          placeholder="How does this milestone feel? What have you learned?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-[#3b7dd8]/50 resize-none min-h-[80px]"
          data-testid="input-milestone-description"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-white/70 mb-2 block">Choose a visual</label>
        <div className="grid grid-cols-3 gap-2">
          {MILESTONE_VISUALS.map((visual) => {
            const Icon = visual.icon;
            const isSelected = selectedVisual === visual.id;
            return (
              <button
                key={visual.id}
                onClick={() => setSelectedVisual(visual.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg transition-all duration-200 ${
                  isSelected
                    ? "bg-white/10 border-white/25"
                    : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]"
                } border`}
                data-testid={`button-milestone-visual-${visual.id}`}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: isSelected ? visual.color : `${visual.color}80` }}
                />
                <span className={`text-xs ${isSelected ? "text-white/80" : "text-white/40"}`}>
                  {visual.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Button
        onClick={handleSave}
        className="w-full bg-[#3b7dd8] text-white border-[#3b7dd8]/50"
        disabled={!title.trim()}
        data-testid="button-save-milestone"
      >
        <Flag className="w-4 h-4 mr-2" />
        Save Milestone
      </Button>
    </div>
  );
}
