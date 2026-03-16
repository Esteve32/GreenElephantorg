import { useState, useRef, useEffect } from "react";
import { Users, Send, RotateCcw, Save, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { AILoadingOverlay } from "@/components/portal/AILoadingOverlay";

interface PresencingToolProps {
  onSaveToTimeline?: (event: { type: string; title: string; description: string; details?: string; lens?: string; toolId?: string }) => void;
}

interface Mentor {
  id: string;
  name: string;
  title: string;
  color: string;
  lens: string;
  style: string;
  systemPrompt: string;
}

const MENTORS: Mentor[] = [
  {
    id: "seneca",
    name: "Seneca",
    title: "Stoic Philosopher",
    color: "#9933cc",
    lens: "ego",
    style: "Direct, philosophical. Uses metaphors from nature. Asks questions that reveal assumptions.",
    systemPrompt: "You are Seneca, the Stoic philosopher. You help people examine their inner landscape through calm, direct questions. You focus on what is within their control and gently reveal blind spots in their thinking. Keep responses under 120 words. End with a single reflective question.",
  },
  {
    id: "rogers",
    name: "Carl Rogers",
    title: "Humanistic Psychologist",
    color: "#33a854",
    lens: "needs",
    style: "Warm, non-directive. Reflects feelings. Creates unconditional positive regard.",
    systemPrompt: "You are Carl Rogers, the humanistic psychologist. You practice unconditional positive regard. You reflect back what the person is feeling, help them access their own wisdom, and never judge. You believe people have the answers within them. Keep responses under 120 words. End with a gentle invitation to explore deeper.",
  },
  {
    id: "arendt",
    name: "Hannah Arendt",
    title: "Political Thinker",
    color: "#3b7dd8",
    lens: "dynamics",
    style: "Analytical, challenges power structures. Connects personal to systemic.",
    systemPrompt: "You are Hannah Arendt, the political thinker. You help people see how their communication challenges connect to larger systems of power, plurality, and public space. You challenge them to think about the difference between labor, work, and action. Keep responses under 120 words. End with a thought-provoking observation.",
  },
  {
    id: "rumi",
    name: "Rumi",
    title: "Sufi Poet & Mystic",
    color: "#e8c840",
    lens: "flow",
    style: "Poetic, paradoxical. Uses images of love, water, and light. Points beyond words.",
    systemPrompt: "You are Rumi, the Sufi poet and mystic. You respond with poetic wisdom, using metaphors of the heart, water, light, and love. You help people see that their struggles are doorways. You point to what is beyond words. Keep responses under 100 words. Mix brief prose with a short poetic line.",
  },
  {
    id: "satir",
    name: "Virginia Satir",
    title: "Family Therapist",
    color: "#cc3333",
    lens: "influence",
    style: "Warm, embodied. Focuses on congruence between words and feelings.",
    systemPrompt: "You are Virginia Satir, the family therapist. You help people become congruent — aligning what they feel inside with what they communicate outside. You notice body language cues in what people describe and ask about the gap between their words and their feelings. Keep responses under 120 words. End with a practical experiment to try.",
  },
  {
    id: "bohm",
    name: "David Bohm",
    title: "Physicist & Dialogue Pioneer",
    color: "#009999",
    lens: "alignment",
    style: "Calm, systemic. Sees thought as a system. Champions suspension of assumptions.",
    systemPrompt: "You are David Bohm, the physicist and dialogue pioneer. You help people see that thought itself is a participatory process — not just individual but collective. You invite them to suspend their assumptions and notice the 'movement of thought.' Keep responses under 120 words. End with an invitation to notice something they take for granted.",
  },
];

interface Message {
  role: "user" | "mentor";
  content: string;
  mentorId?: string;
}

export function PresencingTool({ onSaveToTimeline }: PresencingToolProps) {
  const [selectedMentor, setSelectedMentor] = useState<Mentor>(MENTORS[0]);
  const [showMentorPicker, setShowMentorPicker] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [saved, setSaved] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateResponse = (userMessage: string, mentor: Mentor): string => {
    const reflections: Record<string, string[]> = {
      seneca: [
        `You speak of "${userMessage.split(" ").slice(0, 4).join(" ")}..." — but let us pause. What is truly within your control here, and what belongs to fortune?`,
        `Consider this: the obstacle you describe may itself be the way forward. What would it mean to welcome this difficulty as a teacher rather than an enemy?`,
        `I notice you are carrying something heavy. But remember — we suffer more in imagination than in reality. What is the actual situation, stripped of the story you are telling yourself about it?`,
        `The wise person acts; the fool reacts. In this situation you describe, where do you find yourself acting from genuine intention, and where are you merely reacting to another's energy?`,
      ],
      rogers: [
        `I hear something important in what you're sharing. It sounds like there's a feeling of ${userMessage.length > 50 ? "being pulled in different directions" : "something unresolved"} underneath your words. Can you stay with that feeling for a moment?`,
        `What I'm sensing is that you already know something about what you need here. You don't need me to tell you — you need space to hear your own knowing. What comes up when you sit quietly with this?`,
        `You're describing a real tension. And the fact that you're bringing it here tells me you care deeply about getting this right. What would it feel like to trust yourself a little more in this situation?`,
        `I want to reflect back something: you used the word "${userMessage.split(" ").find(w => w.length > 4) || "this"}" — and I wonder if that word carries more weight than you realize. What does it really mean to you?`,
      ],
      arendt: [
        `What you're describing is not just a personal challenge — it's a question about how we appear to each other in shared space. Who are you when you step into this conversation? Not who you think you should be, but who you actually become?`,
        `Consider this: every communication is an act of beginning. You cannot predict what the other person will do with your words. That uncertainty is not a bug — it is the essence of human plurality. How might you speak if you truly accepted that?`,
        `The danger in what you describe is not conflict itself, but the temptation to retreat into a role. Roles are safe but they are not free. What would authentic speech look like here?`,
      ],
      rumi: [
        `The wound is where the light enters.\nWhat you call difficulty,\nthe heart calls invitation.\nListen not to the story —\nlisten to what hums beneath it.`,
        `You are not a drop in the ocean.\nYou are the entire ocean in a drop.\nThis conversation you describe?\nIt is the universe talking to itself through you.\nWhat does it want to say?`,
        `Stop searching outside.\nThe answer is already arriving.\nBe still enough to let it land.\n\nWhat would happen if you stopped trying to fix this and simply... witnessed it?`,
        `Let the beauty of what you love\nbe what you do.\nYour words carry more truth than you know.\nSpeak not from the mind's rehearsal —\nspeak from the place where love and fear meet.`,
      ],
      satir: [
        `I'm curious — as you describe this situation, what's happening in your body right now? Our bodies often know what our words haven't caught up to yet. Where do you feel the tension?`,
        `It sounds like there might be a gap between what you're saying and what you're feeling. That gap is called incongruence, and it's one of the most human things there is. What would it look like to close that gap, even a little?`,
        `Here's an experiment: the next time you're in this situation, try saying exactly what you feel — not what you think you should say. Just one sentence of pure honesty. What would that sentence be?`,
      ],
      bohm: [
        `What if the difficulty you're experiencing is not between you and the other person, but within the movement of thought itself? Our thoughts think us more than we think them. Can you notice the assumption that is operating here without trying to change it?`,
        `In genuine dialogue, we don't try to win or convince. We try to see the whole together. What would this conversation look like if neither of you needed to be right?`,
        `I invite you to suspend — not suppress — your reaction to what happened. Hold it gently, look at it from all sides. What do you notice when you stop defending your position and simply observe it?`,
      ],
    };

    const mentorResponses = reflections[mentor.id] || reflections.seneca;
    const idx = Math.floor(Math.random() * mentorResponses.length);
    return mentorResponses[idx];
  };

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsThinking(true);
    setSaved(false);

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 1500));

    const response = generateResponse(userMessage, selectedMentor);
    setMessages((prev) => [...prev, { role: "mentor", content: response, mentorId: selectedMentor.id }]);
    setIsThinking(false);
  };

  const handleReset = () => {
    setMessages([]);
    setInput("");
    setSaved(false);
  };

  const handleSave = () => {
    if (!onSaveToTimeline || messages.length === 0) return;
    const conversation = messages
      .map((m) => m.role === "user" ? `You: ${m.content}` : `${selectedMentor.name}: ${m.content}`)
      .join("\n\n");

    onSaveToTimeline({
      type: "presencing",
      title: `Wisdom Council: ${selectedMentor.name}`,
      description: `Presencing session with ${selectedMentor.name} (${selectedMentor.title}) — ${messages.filter(m => m.role === "user").length} exchanges`,
      details: conversation,
      lens: selectedMentor.lens,
      toolId: "presencing",
    });
    setSaved(true);
    toast({ title: "Saved to timeline", description: `Your session with ${selectedMentor.name} has been recorded.` });
  };

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="relative">
          <button
            onClick={() => setShowMentorPicker(!showMentorPicker)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm transition-colors hover-elevate"
            data-testid="button-mentor-picker"
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedMentor.color }} />
            <span className="text-white/80">{selectedMentor.name}</span>
            <ChevronDown className="w-3 h-3 text-white/30" />
          </button>

          {showMentorPicker && (
            <div className="absolute top-full left-0 mt-1 z-50 w-64 rounded-lg bg-black/95 border border-white/10 shadow-2xl backdrop-blur-xl p-1 animate-in fade-in slide-in-from-top-1 duration-150">
              {MENTORS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setSelectedMentor(m); setShowMentorPicker(false); }}
                  className={`w-full flex items-start gap-2 p-2 rounded-md text-left transition-colors ${
                    m.id === selectedMentor.id ? "bg-white/10" : "hover-elevate"
                  }`}
                  data-testid={`mentor-${m.id}`}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: `${m.color}20`, border: `1px solid ${m.color}40` }}>
                    <Users className="w-3 h-3" style={{ color: m.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white/90">{m.name}</p>
                    <p className="text-[10px] text-white/40">{m.title}</p>
                    <p className="text-[10px] text-white/25 mt-0.5">{m.style.split(".")[0]}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" onClick={handleReset} disabled={messages.length === 0}
                data-testid="button-reset-presencing">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Start over</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" onClick={handleSave} disabled={messages.length === 0 || saved}
                data-testid="button-save-presencing">
                <Save className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save to timeline</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {messages.length === 0 ? (
        <Card className="bg-white/5 border-white/10 mb-3">
          <CardContent className="p-4 text-center space-y-3">
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center"
              style={{ backgroundColor: `${selectedMentor.color}15`, border: `1.5px solid ${selectedMentor.color}30` }}>
              <Users className="w-6 h-6" style={{ color: selectedMentor.color }} />
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">{selectedMentor.name}</p>
              <p className="text-xs text-white/40">{selectedMentor.title}</p>
            </div>
            <p className="text-xs text-white/50 leading-relaxed italic">
              "{selectedMentor.style}"
            </p>
            <div className="flex items-center justify-center gap-1.5">
              <Badge variant="outline" className="text-[10px] border-transparent px-1.5 py-0"
                style={{ color: selectedMentor.color, backgroundColor: `${selectedMentor.color}10` }}>
                {selectedMentor.lens} lens
              </Badge>
            </div>
            <p className="text-xs text-white/30">
              Share a communication challenge, relationship dynamic, or inner tension. {selectedMentor.name} will mirror it back to you.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1 min-h-0">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#009999]/20 text-white/80 rounded-br-sm"
                    : "bg-white/5 text-white/70 rounded-bl-sm border border-white/5"
                }`}
                style={msg.role === "mentor" ? { borderLeftColor: `${selectedMentor.color}30`, borderLeftWidth: "2px" } : undefined}
              >
                {msg.role === "mentor" && (
                  <p className="text-[10px] font-medium mb-1" style={{ color: selectedMentor.color }}>
                    {selectedMentor.name}
                  </p>
                )}
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isThinking && messages.length <= 1 && (
            <AILoadingOverlay toolId="presencing" />
          )}
          {isThinking && messages.length > 1 && (
            <div className="flex justify-start">
              <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 rounded-bl-sm"
                style={{ borderLeftColor: `${selectedMentor.color}30`, borderLeftWidth: "2px" }}>
                <p className="text-[10px] font-medium mb-1" style={{ color: selectedMentor.color }}>
                  {selectedMentor.name}
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: "200ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: "400ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="flex items-end gap-2 mt-auto">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={messages.length === 0 ? "What's on your mind?" : "Continue the conversation..."}
          className="flex-1 min-h-[60px] max-h-[100px] resize-none bg-white/5 border-white/10 text-white/80 text-xs"
          disabled={isThinking}
          data-testid="input-presencing-message"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isThinking}
              className="bg-[#009999] text-white shrink-0"
              data-testid="button-send-presencing"
            >
              <Send className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Send</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}