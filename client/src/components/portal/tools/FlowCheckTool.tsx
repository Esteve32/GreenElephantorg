import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Activity, RotateCcw, Save, Mic, MicOff, Loader2, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface FlowCheckToolProps {
  onSaveToTimeline?: (event: { type: string; title: string; description: string; details?: string; lens?: string; toolId?: string }) => void;
}

type Zone = "flow" | "challenge" | "comfort" | "danger";

const ZONE_CONFIG: Record<Zone, { name: string; color: string; description: string; tip: string }> = {
  flow: {
    name: "Flow Zone",
    color: "#a3cc33",
    description: "High motivation meets matched challenge and competence. You're in the zone.",
    tip: "Lean in. This is your sweet spot. Take on that stretch conversation you've been avoiding.",
  },
  challenge: {
    name: "Challenge / Stress Zone",
    color: "#e85d75",
    description: "High challenge but your competence or motivation isn't keeping up. Stress territory.",
    tip: "Pause before responding. Ask yourself: what do I need right now to stay grounded?",
  },
  comfort: {
    name: "Comfort Zone",
    color: "#3b7dd8",
    description: "You're capable but not challenged. Coasting. Growth is stalling.",
    tip: "Volunteer for a harder conversation. Ask the question you've been avoiding.",
  },
  danger: {
    name: "Danger / Apathy Zone",
    color: "#e8833a",
    description: "Low motivation, low challenge, low competence. Disengagement territory.",
    tip: "This is a signal. Something needs to change. Talk to someone you trust about what's draining you.",
  },
};

export function FlowCheckTool({ onSaveToTimeline }: FlowCheckToolProps) {
  const [motivation, setMotivation] = useState(5);
  const [challenge, setChallenge] = useState(5);
  const [competence, setCompetence] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [situationNote, setSituationNote] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const baseTextRef = useRef("");
  const { toast } = useToast();

  const zone = useMemo((): Zone => {
    const highMotivation = motivation >= 6;
    const highChallenge = challenge >= 6;
    const highCompetence = competence >= 6;

    if (highMotivation && highChallenge && highCompetence) return "flow";
    if (highChallenge && (!highCompetence || !highMotivation)) return "challenge";
    if (highCompetence && !highChallenge) return "comfort";
    return "danger";
  }, [motivation, challenge, competence]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleVoice = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      toast({ title: "Voice not supported", description: "Your browser doesn't support voice input.", variant: "destructive" });
      return;
    }

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;
    baseTextRef.current = situationNote;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      if (finalTranscript) {
        baseTextRef.current = baseTextRef.current + (baseTextRef.current ? " " : "") + finalTranscript;
      }
      setSituationNote(baseTextRef.current + (interimTranscript ? " " + interimTranscript : ""));
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    setIsRecording(true);
  }, [isRecording, situationNote, toast]);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
  }, []);

  const fetchAiRecommendation = useCallback(async () => {
    const cfg = ZONE_CONFIG[zone];
    setAiLoading(true);
    try {
      const res = await apiRequest("POST", "/api/portal/ai", {
        tool: "flowcheck",
        userMessage: `Flow Check Results:\n- Motivation: ${motivation}/10\n- Challenge: ${challenge}/10\n- Competence: ${competence}/10\n- Zone: ${cfg.name}\n${situationNote ? `\nSituation context: ${situationNote}` : ""}`,
      });
      const data = await res.json();
      setAiRecommendation(data.result || "No recommendation available.");
    } catch (err: unknown) {
      console.error("AI recommendation error:", err instanceof Error ? err.message : "Unknown error");
      setAiRecommendation("AI recommendations are currently unavailable. Use the tip above as your guide.");
    } finally {
      setAiLoading(false);
    }
  }, [zone, motivation, challenge, competence, situationNote]);

  const handleSave = useCallback(() => {
    const cfg = ZONE_CONFIG[zone];
    if (onSaveToTimeline) {
      onSaveToTimeline({
        type: "communication",
        title: `Flow Check: ${cfg.name}`,
        description: `Motivation: ${motivation}/10, Challenge: ${challenge}/10, Competence: ${competence}/10`,
        details: `Zone: ${cfg.name}\n${cfg.description}\n\nTip: ${cfg.tip}${situationNote ? `\n\nSituation: ${situationNote}` : ""}${aiRecommendation ? `\n\nAI Recommendation:\n${aiRecommendation}` : ""}`,
        lens: "flow",
        toolId: "flowcheck",
      });
    }
    toast({ title: "Saved to timeline" });
  }, [zone, motivation, challenge, competence, onSaveToTimeline, toast, situationNote, aiRecommendation]);

  const handleReset = useCallback(() => {
    setMotivation(5);
    setChallenge(5);
    setCompetence(5);
    setSubmitted(false);
    setSituationNote("");
    setAiRecommendation("");
  }, []);

  if (submitted) {
    const cfg = ZONE_CONFIG[zone];
    return (
      <div className="space-y-4">
        <div className="text-center py-3">
          <div
            className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3"
            style={{ backgroundColor: `${cfg.color}20`, border: `2px solid ${cfg.color}40` }}
          >
            <Activity className="w-6 h-6" style={{ color: cfg.color }} />
          </div>
          <h3
            className="text-lg font-semibold text-white"
            style={{ fontFamily: "Poppins, sans-serif", color: cfg.color }}
            data-testid="text-flow-zone"
          >
            {cfg.name}
          </h3>
          <p className="text-sm text-white/50 mt-1 max-w-sm mx-auto">{cfg.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Motivation", value: motivation, color: "#009999" },
            { label: "Challenge", value: challenge, color: "#e85d75" },
            { label: "Competence", value: competence, color: "#3b7dd8" },
          ].map((item) => (
            <div key={item.label} className="text-center p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
              <p className="text-xs text-white/30 mb-1">{item.label}</p>
              <p className="text-lg font-semibold" style={{ color: item.color }} data-testid={`text-${item.label.toLowerCase()}-score`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-lg border" style={{ backgroundColor: `${cfg.color}08`, borderColor: `${cfg.color}20` }}>
          <p className="text-xs font-medium mb-1" style={{ color: cfg.color }}>Quick Tip</p>
          <p className="text-sm text-white/60">{cfg.tip}</p>
        </div>

        {!aiRecommendation && (
          <Button
            variant="ghost"
            onClick={fetchAiRecommendation}
            disabled={aiLoading}
            className="w-full text-white/50 border border-white/10"
            data-testid="button-flow-ai"
          >
            {aiLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Analysing...
              </>
            ) : (
              <>
                <Brain className="w-3.5 h-3.5 mr-1.5" />
                Get AI Recommendation
              </>
            )}
          </Button>
        )}

        {aiRecommendation && (
          <div className="p-3 rounded-lg border border-[#009999]/20 bg-[#009999]/5">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-3.5 h-3.5 text-[#009999]" />
              <p className="text-xs font-medium text-[#009999]">AI Recommendation</p>
            </div>
            <div className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed" data-testid="text-flow-ai-result">
              {aiRecommendation}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleReset} className="flex-1 text-white/40" data-testid="button-flow-reset">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Check Again
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-[#009999] text-white border-[#009999]/30" data-testid="button-flow-save">
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Save to Timeline
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-white/50">
        Rate your current state in a communication situation you're thinking about.
      </p>

      {[
        { label: "Motivation", desc: "How driven do you feel?", value: motivation, onChange: setMotivation, color: "#009999" },
        { label: "Challenge", desc: "How demanding is the situation?", value: challenge, onChange: setChallenge, color: "#e85d75" },
        { label: "Competence", desc: "How skilled do you feel?", value: competence, onChange: setCompetence, color: "#3b7dd8" },
      ].map((slider) => (
        <div key={slider.label} className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">{slider.label}</p>
              <p className="text-xs text-white/30">{slider.desc}</p>
            </div>
            <span className="text-lg font-semibold min-w-[2rem] text-right" style={{ color: slider.color }} data-testid={`text-slider-${slider.label.toLowerCase()}`}>
              {slider.value}
            </span>
          </div>
          <Slider
            value={[slider.value]}
            onValueChange={([v]) => slider.onChange(v)}
            min={1}
            max={10}
            step={1}
            className="[&_[role=slider]]:bg-[#009999]"
            data-testid={`slider-${slider.label.toLowerCase()}`}
          />
          <div className="flex justify-between text-xs text-white/15">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      ))}

      <div className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <p className="text-xs text-white/40">Optional: describe the situation</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleVoice}
            className={`text-white/40 ${isRecording ? "text-red-400" : ""}`}
            data-testid="button-flow-voice"
          >
            {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </Button>
        </div>
        <Textarea
          value={situationNote}
          onChange={(e) => setSituationNote(e.target.value)}
          placeholder="What communication situation is on your mind?"
          className="min-h-[60px] bg-white/[0.03] border-white/10 text-white/80 placeholder:text-white/20 text-sm resize-none"
          data-testid="input-flow-situation"
        />
      </div>

      <Button onClick={handleSubmit} className="w-full bg-[#009999] text-white border-[#009999]/30" data-testid="button-flow-check">
        Check My Flow
      </Button>
    </div>
  );
}
