import { useState, useRef, useCallback } from "react";
import { MessageSquare, RotateCcw, Save, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AILoadingOverlay } from "@/components/portal/AILoadingOverlay";

interface DebriefToolProps {
  onSaveToTimeline?: (event: { type: string; title: string; description: string; details?: string; toolId?: string }) => void;
}

export function DebriefTool({ onSaveToTimeline }: DebriefToolProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  const speechSupported = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const toggleSpeech = useCallback(() => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    const baseText = input;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalParts = "";
      let interimParts = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalParts += event.results[i][0].transcript;
        } else {
          interimParts += event.results[i][0].transcript;
        }
      }
      const spokenText = (finalParts + interimParts).trim();
      const prefix = baseText ? baseText.trimEnd() + " " : "";
      setInput(prefix + spokenText);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      toast({ title: "Speech recognition stopped", variant: "destructive" });
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [isRecording, toast]);

  const handleDebrief = async () => {
    if (!input.trim()) return;
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    setLoading(true);
    setResult("");
    try {
      const res = await apiRequest("POST", "/api/portal/ai", {
        tool: "debrief",
        userMessage: input.trim(),
      });
      const data = await res.json();
      setResult(data.result || "No analysis available.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to get AI analysis";
      toast({ title: "Analysis failed", description: msg, variant: "destructive" });
      if (msg.includes("unavailable") || msg.includes("disabled")) {
        setResult("AI features are currently unavailable. You can still save your debrief to your timeline as a personal note.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (onSaveToTimeline) {
      onSaveToTimeline({
        type: "communication",
        title: "Conversation Debrief",
        description: input.trim().slice(0, 200),
        details: result || undefined,
        toolId: "debrief",
      });
    }
  };

  const handleReset = () => {
    setInput("");
    setResult("");
  };

  if (loading) {
    return <AILoadingOverlay toolId="debrief" />;
  }

  if (result) {
    return (
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
          <p className="text-xs text-white/25 font-medium uppercase tracking-wider mb-2">Your description</p>
          <p className="text-xs text-white/50 line-clamp-3">{input}</p>
        </div>

        <div className="p-4 rounded-lg bg-[#009999]/5 border border-[#009999]/10">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-[#009999]" />
            <p className="text-xs font-medium text-[#009999]">GBR Analysis</p>
          </div>
          <div className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed" data-testid="text-debrief-result">
            {result}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleReset} className="flex-1 text-white/40" data-testid="button-debrief-reset">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            New Debrief
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-[#009999] text-white border-[#009999]/30" data-testid="button-debrief-save">
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
        Describe a recent conversation or interaction. What happened? How did it feel? What was the outcome?
      </p>

      <div className="relative">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="I had a meeting today with my team about project priorities. The discussion got heated when..."
          className="min-h-[140px] bg-white/[0.03] border-white/10 text-white/80 placeholder:text-white/20 text-sm resize-none pr-12"
          data-testid="input-debrief"
        />
        {speechSupported && (
          <button
            onClick={toggleSpeech}
            className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isRecording
                ? "bg-red-500/20 border border-red-500/40 text-red-400"
                : "bg-white/5 border border-white/10 text-white/30 hover:text-white/50"
            }`}
            aria-label={isRecording ? "Stop recording" : "Start voice input"}
            data-testid="button-speech-toggle"
          >
            {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {isRecording && (
        <div className="flex items-center gap-2 text-xs text-red-400">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Listening... speak your debrief
        </div>
      )}

      <Button
        onClick={handleDebrief}
        disabled={!input.trim() || loading}
        className="w-full bg-[#009999] text-white border-[#009999]/30"
        data-testid="button-debrief-analyse"
      >
        Analyse with GBR Framework
      </Button>
    </div>
  );
}
