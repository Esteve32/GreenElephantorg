import { useState, useEffect } from "react";
import { Zap, Loader2, RotateCcw, Save, Calendar, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

interface MicroHabitsToolProps {
  onSaveToTimeline?: (event: { type: string; title: string; description: string; details?: string; lens?: string; toolId?: string }) => void;
}

const LENSES = [
  { id: "influence", name: "Influence", color: "#cc3333", desc: "Exert influence with integrity" },
  { id: "attitude", name: "Attitude", color: "#ff9933", desc: "Stance toward change and growth" },
  { id: "chaordic", name: "Chaordic", color: "#ffcc00", desc: "Order in creative chaos" },
  { id: "flow", name: "Flow", color: "#cccc33", desc: "Sensing flow in conversations" },
  { id: "alignment", name: "Alignment", color: "#669966", desc: "Building shared understanding" },
  { id: "needs", name: "Needs", color: "#009999", desc: "Honoring energy and core needs" },
  { id: "ego", name: "Ego", color: "#3399cc", desc: "Recognizing ego patterns" },
  { id: "dynamics", name: "Dynamics", color: "#663399", desc: "Understanding relationship dynamics" },
];

const CORE_VALUES = [
  "Authenticity", "Courage", "Empathy", "Integrity", "Growth",
  "Connection", "Clarity", "Creativity", "Service", "Balance",
];

function generateIcsContent(habitName: string, duration: number): string {
  const now = new Date();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GreenElephant//HabitTracker//EN",
  ];

  for (let day = 0; day < duration; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() + day);
    const dateStr = date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const endDate = new Date(date);
    endDate.setMinutes(endDate.getMinutes() + 5);
    const endStr = endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    lines.push(
      "BEGIN:VEVENT",
      `DTSTART:${dateStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:${habitName} (GreenElephant Micro Habit)`,
      "DESCRIPTION:Track your conscious communication micro-habit. Did you practice today?",
      `UID:ge-habit-${day}-${Date.now()}@greenelephant.org`,
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function MicroHabitsTool({ onSaveToTimeline }: MicroHabitsToolProps) {
  const [selectedLens, setSelectedLens] = useState<string | null>(null);
  const [coreValue, setCoreValue] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { data: userContext } = useQuery<Record<string, string>>({
    queryKey: ["/api/portal/context"],
  });

  useEffect(() => {
    if (userContext?.core_value && !coreValue) {
      setCoreValue(userContext.core_value);
    }
  }, [userContext, coreValue]);

  const activeValue = customValue || coreValue;

  const handleGenerate = async () => {
    if (!selectedLens) return;
    const lens = LENSES.find((l) => l.id === selectedLens);
    setLoading(true);
    setResult("");
    try {
      const valueContext = activeValue ? ` My core value is "${activeValue}" — connect the habit to this value.` : "";
      const res = await apiRequest("POST", "/api/portal/ai", {
        tool: "microhabits",
        userMessage: `Generate a micro-habit for the ${lens?.name} lens: "${lens?.desc}". Make it practical and specific.${valueContext}`,
      });
      const data = await res.json();
      setResult(data.result || "No habit generated.");

      if (activeValue) {
        apiRequest("POST", "/api/portal/context", {
          key: "core_value",
          value: activeValue,
        }).catch(() => {});
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to generate habit";
      toast({ title: "Generation failed", description: msg, variant: "destructive" });
      if (msg.includes("unavailable") || msg.includes("disabled")) {
        setResult(`AI is currently unavailable. Here's a default habit for ${lens?.name}:\n\nHABIT: Conscious Pause\nTRIGGER: Before any important conversation\nACTION: Take 3 breaths and name what you're feeling\nDURATION: 7 days`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleIcsExport = () => {
    const habitMatch = result.match(/HABIT:\s*(.+)/);
    const durationMatch = result.match(/DURATION:\s*(\d+)/);
    const habitName = habitMatch?.[1]?.trim() || "Micro Habit";
    const duration = parseInt(durationMatch?.[1] || "7");

    const ics = generateIcsContent(habitName, duration);
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `greenelephant-habit-${selectedLens}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Calendar file downloaded" });
  };

  const handleSave = () => {
    const lens = LENSES.find((l) => l.id === selectedLens);
    const habitMatch = result.match(/HABIT:\s*(.+)/);
    if (onSaveToTimeline) {
      onSaveToTimeline({
        type: "communication",
        title: `Micro Habit: ${habitMatch?.[1]?.trim() || lens?.name || "Habit"}`,
        description: `${lens?.name} lens habit${activeValue ? ` (value: ${activeValue})` : ""} started`,
        details: result || undefined,
        lens: lens?.id,
        toolId: "microhabits",
      });
    }
  };

  const handleReset = () => {
    setSelectedLens(null);
    setResult("");
    setCustomValue("");
  };

  if (result) {
    const lens = LENSES.find((l) => l.id === selectedLens);
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: lens?.color }} />
          <p className="text-xs text-white/50">
            <span className="font-medium text-white/70">{lens?.name}</span> lens
            {activeValue && <span className="text-white/30"> / {activeValue}</span>}
          </p>
        </div>

        <div className="p-4 rounded-lg border" style={{ backgroundColor: `${lens?.color}08`, borderColor: `${lens?.color}20` }}>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4" style={{ color: lens?.color }} />
            <p className="text-xs font-medium" style={{ color: lens?.color }}>Your Micro Habit</p>
          </div>
          <div className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed" data-testid="text-habit-result">
            {result}
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={handleIcsExport}
          className="w-full text-white/50 border border-white/10"
          data-testid="button-habit-calendar"
        >
          <Calendar className="w-3.5 h-3.5 mr-1.5" />
          Add to Calendar (.ics)
        </Button>

        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleReset} className="flex-1 text-white/40" data-testid="button-habit-reset">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Try Another
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-[#009999] text-white border-[#009999]/30" data-testid="button-habit-save">
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
        Pick a lens you want to strengthen. Optionally choose a core value to connect the habit to.
      </p>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Heart className="w-3.5 h-3.5 text-[#e85d75]" />
          <p className="text-xs text-white/40">Core value (optional)</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CORE_VALUES.map((v) => (
            <button
              key={v}
              onClick={() => { setCoreValue(v); setCustomValue(""); }}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                coreValue === v && !customValue
                  ? "bg-[#e85d75]/15 text-[#e85d75] border border-[#e85d75]/30"
                  : "bg-white/[0.03] text-white/40 border border-white/5"
              }`}
              data-testid={`button-value-${v.toLowerCase()}`}
            >
              {v}
            </button>
          ))}
        </div>
        <Input
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          placeholder="Or type your own value..."
          className="bg-white/[0.03] border-white/10 text-white/80 placeholder:text-white/20 text-xs"
          data-testid="input-custom-value"
        />
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {LENSES.map((lens) => (
          <button
            key={lens.id}
            onClick={() => setSelectedLens(lens.id)}
            className={`flex items-center gap-2 p-2.5 rounded-lg text-left transition-colors ${
              selectedLens === lens.id ? "border" : "bg-white/[0.03] border border-white/5"
            }`}
            style={
              selectedLens === lens.id
                ? { backgroundColor: `${lens.color}12`, borderColor: `${lens.color}30` }
                : undefined
            }
            data-testid={`button-habit-lens-${lens.id}`}
          >
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: lens.color }} />
            <span
              className={`text-xs ${selectedLens === lens.id ? "font-medium" : ""}`}
              style={{ color: selectedLens === lens.id ? lens.color : "rgba(255,255,255,0.5)" }}
            >
              {lens.name}
            </span>
          </button>
        ))}
      </div>

      {selectedLens && (
        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-[#009999] text-white border-[#009999]/30"
          data-testid="button-generate-habit"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            `Generate Micro Habit${activeValue ? ` for ${activeValue}` : ""}`
          )}
        </Button>
      )}
    </div>
  );
}
