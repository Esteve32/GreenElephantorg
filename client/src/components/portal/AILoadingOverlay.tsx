import { useState, useEffect, useRef, useCallback } from "react";

const GENERIC_MESSAGES = [
  "Taking a breath and reading through your context...",
  "Connecting the dots between your inputs...",
  "Not using a template — this is custom-built for you.",
  "Weaving your data into something meaningful...",
  "Almost like thinking, but faster and with fewer snacks.",
  "This isn't a search engine. It's actually reasoning right now.",
  "Your patience is a superpower. Seriously.",
  "No shortcuts — working through your specific situation.",
  "Good things take a moment. Great things take two.",
  "Still here. Still working. Still worth it.",
  "Cross-referencing patterns across your check-ins...",
  "Synthesising — not summarising. There's a difference.",
  "Building something you can actually use, not just read.",
  "The AI is not browsing. It's focused entirely on you.",
  "A few more seconds of depth beats instant shallow answers.",
];

const TOOL_MESSAGES: Record<string, string[]> = {
  debrief: [
    "Reviewing your conversation patterns and themes...",
    "Looking at how your communication style has evolved...",
    "Mapping insights from your recent sessions...",
    "Pulling threads from your timeline entries...",
    "Identifying your recurring growth edges...",
  ],
  flowcheck: [
    "Reading the energy behind your words...",
    "Comparing this check-in with your recent patterns...",
    "Calibrating your communication flow state...",
    "Noticing shifts in your lens balance...",
    "Tuning into what your answers are really saying...",
  ],
  prepare: [
    "Mapping the dynamics of your upcoming situation...",
    "Considering different angles and approaches...",
    "Thinking about what could come up — and how to handle it...",
    "Building a prep sheet that actually fits this context...",
    "Rehearsing scenarios so you don't have to wing it...",
  ],
  reflection: [
    "Holding space for your reflection...",
    "Looking at this through the lens you chose...",
    "Finding the signal beneath the noise...",
    "Connecting this moment to your bigger journey...",
    "Listening between the lines of what you wrote...",
  ],
  microhabits: [
    "Designing habits that fit your life, not a textbook...",
    "Keeping it small — that's the whole point...",
    "Matching habits to your current growth edge...",
    "Making sure these are doable, not aspirational...",
    "Building tiny rituals with real impact...",
  ],
  presencing: [
    "The council is gathering their perspectives...",
    "Each voice is considering your question carefully...",
    "Wisdom doesn't rush — and neither do we...",
    "Listening from multiple angles at once...",
    "Holding your question with the care it deserves...",
  ],
};

interface AILoadingOverlayProps {
  toolId?: string;
  className?: string;
}

export function AILoadingOverlay({ toolId, className = "" }: AILoadingOverlayProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const messagesRef = useRef<string[]>([]);

  useEffect(() => {
    const toolSpecific = toolId && TOOL_MESSAGES[toolId] ? [...TOOL_MESSAGES[toolId]] : [];
    const shuffledGeneric = [...GENERIC_MESSAGES].sort(() => Math.random() - 0.5);
    const interleaved: string[] = [];
    let gi = 0;
    let ti = 0;
    while (gi < shuffledGeneric.length || ti < toolSpecific.length) {
      if (ti < toolSpecific.length) interleaved.push(toolSpecific[ti++]);
      if (gi < shuffledGeneric.length) interleaved.push(shuffledGeneric[gi++]);
      if (ti < toolSpecific.length) interleaved.push(toolSpecific[ti++]);
    }
    messagesRef.current = interleaved;
    setMessageIndex(0);
    setElapsed(0);
  }, [toolId]);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const pendingTimeoutRef = { current: null as ReturnType<typeof setTimeout> | null };
    const interval = setInterval(() => {
      setFadeIn(false);
      pendingTimeoutRef.current = setTimeout(() => {
        setMessageIndex((i) => (i + 1) % (messagesRef.current.length || 1));
        setFadeIn(true);
        pendingTimeoutRef.current = null;
      }, 400);
    }, 4500);
    return () => {
      clearInterval(interval);
      if (pendingTimeoutRef.current) clearTimeout(pendingTimeoutRef.current);
    };
  }, []);

  const currentMessage = messagesRef.current[messageIndex] || GENERIC_MESSAGES[0];
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  return (
    <div className={`flex flex-col items-center justify-center py-8 px-4 ${className}`} data-testid="ai-loading-overlay">
      <div className="ai-flow-orb mb-6" aria-hidden="true">
        <div className="orb-ring orb-ring-1" />
        <div className="orb-ring orb-ring-2" />
        <div className="orb-ring orb-ring-3" />
        <div className="orb-core" />
      </div>

      <p
        className={`text-sm text-white/70 text-center max-w-[280px] leading-relaxed transition-opacity duration-400 ${fadeIn ? "opacity-100" : "opacity-0"}`}
        data-testid="text-ai-loading-message"
      >
        {currentMessage}
      </p>

      <p className="text-xs text-white/25 mt-4 tabular-nums" data-testid="text-ai-loading-elapsed">
        {timeStr}
      </p>

      <style>{`
        .ai-flow-orb {
          position: relative;
          width: 80px;
          height: 80px;
        }
        .orb-core {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: radial-gradient(circle, #009999 0%, #00777780 100%);
          transform: translate(-50%, -50%);
          animation: orb-breathe 3s ease-in-out infinite;
          box-shadow: 0 0 20px #00999960, 0 0 40px #00999930;
        }
        .orb-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
          border: 1px solid;
          transform: translate(-50%, -50%);
        }
        .orb-ring-1 {
          width: 36px;
          height: 36px;
          border-color: #00999940;
          animation: orb-rotate-1 6s linear infinite, orb-breathe 3s ease-in-out infinite;
        }
        .orb-ring-2 {
          width: 56px;
          height: 56px;
          border-color: #00999925;
          border-style: dashed;
          animation: orb-rotate-2 10s linear infinite, orb-breathe 3.5s ease-in-out infinite 0.5s;
        }
        .orb-ring-3 {
          width: 76px;
          height: 76px;
          border-color: #00999915;
          animation: orb-rotate-1 14s linear infinite reverse, orb-breathe 4s ease-in-out infinite 1s;
        }
        @keyframes orb-breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.12); opacity: 0.7; }
        }
        @keyframes orb-rotate-1 {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes orb-rotate-2 {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}
