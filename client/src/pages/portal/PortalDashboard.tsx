import { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  User,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Radar,
  Database,
  Users,
  Video,
  Briefcase,
  Heart,
  MessageCircle,
  Upload,
  ChevronDown,
  ChevronUp,
  Eye,
  BarChart3,
  Compass,
  FileText,
  Calendar,
  Plus,
  Zap,
  BookOpen,
  Activity,
  Scan,
  Loader2,
  Trash2,
  Flag,
  Search,
  ChevronRight,
  Globe,
  Satellite,
  Mail,
  ExternalLink,
  AlertCircle,
  Play,
  Link2,
  UserCircle,
  Network,
  ListChecks,
  X,
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SiNotion, SiLinkedin } from "react-icons/si";
import earthImageUrl from "@assets/generated_images/earth_from_space_without_aurora.png";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { PortalOnboarding } from "@/components/portal/PortalOnboarding";
import type { PortalMeResponse } from "@/lib/portal-types";

const LENS_COLORS = [
  { name: "Influence", color: "#cc3333", icon: Eye, description: "How you shape and are shaped by others. Your power dynamics, persuasion style, and leadership presence." },
  { name: "Attitude", color: "#e8833a", icon: Zap, description: "Your default emotional stance. How you frame situations and whether your energy invites or repels collaboration." },
  { name: "Chaordic", color: "#e8c840", icon: Compass, description: "Your balance between chaos and order — including Human-to-AI communication. How you navigate ambiguity, structure, and the creative tension between human intent and AI output." },
  { name: "Flow", color: "#33a854", icon: Activity, description: "Your capacity for effortless engagement. When conversations energize vs. drain you." },
  { name: "Alignment", color: "#009999", icon: BarChart3, description: "How well your words match your intent. The gap between what you mean and what others hear." },
  { name: "Needs", color: "#33a854", icon: Heart, description: "Your underlying human needs in dialogue. What you seek from every interaction." },
  { name: "Ego", color: "#3b7dd8", icon: User, description: "Your sense of self in conversation. How identity shapes your communication patterns." },
  { name: "Dynamics", color: "#9933cc", icon: Sparkles, description: "The interplay of forces in your relationships. Patterns that repeat across contexts." },
];

const LENS_ACTIONS = [
  { key: "prompt", label: "Prompt", path: "/portal/playground" },
  { key: "explore", label: "Explore", path: "/portal/playground" },
  { key: "visualize", label: "Visualize", path: "/portal/playground" },
  { key: "integrate", label: "Integrate", path: "/portal/playground" },
];

const EVENT_TYPES: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  scan: { icon: Radar, label: "Satellite Scan", color: "#009999" },
  raw_data: { icon: Database, label: "Raw Data", color: "#3b7dd8" },
  coaching: { icon: Users, label: "Coaching Session", color: "#33b864" },
  webinar: { icon: Video, label: "Webinar", color: "#9933cc" },
  work: { icon: Briefcase, label: "Work Event", color: "#e8833a" },
  life: { icon: Heart, label: "Life Event", color: "#e85d75" },
  communication: { icon: MessageCircle, label: "Communication", color: "#a3cc33" },
  upload: { icon: Upload, label: "Upload", color: "#e8c840" },
  flowcheck: { icon: Activity, label: "Flow Check", color: "#a3cc33" },
  reflection: { icon: Scan, label: "Reflection", color: "#e8833a" },
  microhabits: { icon: Zap, label: "Micro Habit", color: "#e8c840" },
  debrief: { icon: MessageCircle, label: "Debrief", color: "#33b864" },
  prepare: { icon: BookOpen, label: "Preparation", color: "#9933cc" },
  linkedin_import: { icon: SiLinkedin, label: "LinkedIn Import", color: "#0a66c2" },
  calendar_event: { icon: Calendar, label: "Calendar Event", color: "#3b7dd8" },
  milestone: { icon: Flag, label: "Milestone", color: "#3b7dd8" },
};

interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string | null;
  date: string;
  details?: string | null;
  lens?: string | null;
  toolId?: string | null;
}

function getEventConfig(event: TimelineEvent) {
  const toolType = event.toolId && EVENT_TYPES[event.toolId] ? event.toolId : null;
  return EVENT_TYPES[toolType || event.type] || EVENT_TYPES.communication;
}

type TimelineViewMode = "all" | "milestones" | "learning";

const LEARNING_TYPES = ["coaching", "webinar", "upload", "flowcheck", "reflection", "microhabits", "debrief", "prepare"];

function extractYouTubeId(text: string): string | null {
  try {
    const parsed = JSON.parse(text);
    if (parsed?.videoId && typeof parsed.videoId === "string") return parsed.videoId;
  } catch {}
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[1];
  }
  return null;
}

function extractUrls(text: string): string[] {
  const urlPattern = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
  return text.match(urlPattern) || [];
}

function isFileEntry(event: TimelineEvent): boolean {
  return (event.type === "upload" || event.toolId === "upload") &&
    !!(event.title?.match(/\.(pdf|doc|docx|txt|csv|xlsx|png|jpg|jpeg|webp)$/i) ||
       event.description?.match(/\.(pdf|doc|docx|txt|csv|xlsx|png|jpg|jpeg|webp)/i));
}

function YouTubeEmbed({ videoId }: { videoId: string }) {
  const [watchProgress, setWatchProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(`yt-progress-${videoId}`);
      return saved ? parseInt(saved, 10) : 0;
    } catch { return 0; }
  });

  const handleProgressUpdate = useCallback((percent: number) => {
    setWatchProgress(percent);
    try { localStorage.setItem(`yt-progress-${videoId}`, String(percent)); } catch {}
  }, [videoId]);

  return (
    <div className="mt-3 space-y-2">
      <div className="relative w-full rounded-lg overflow-hidden border border-white/10" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video"
          data-testid={`iframe-youtube-${videoId}`}
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#009999] rounded-full transition-all duration-300"
            style={{ width: `${watchProgress}%` }}
          />
        </div>
        <span className="text-[10px] text-white/30 shrink-0">{watchProgress}% watched</span>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {[25, 50, 75, 100].map((p) => (
          <button
            key={p}
            onClick={(e) => { e.stopPropagation(); handleProgressUpdate(p); }}
            className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
              watchProgress >= p
                ? "bg-[#009999]/20 border-[#009999]/30 text-[#009999]"
                : "bg-white/5 border-white/10 text-white/30 hover:text-white/50"
            }`}
            data-testid={`button-progress-${p}`}
          >
            {p}%
          </button>
        ))}
      </div>
    </div>
  );
}

function NudgeDevTeam({ context }: { context: string }) {
  const [nudged, setNudged] = useState(false);
  const { toast } = useToast();

  const handleNudge = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await apiRequest("POST", "/api/portal/nudge-dev", { context });
      setNudged(true);
      toast({ title: "Team notified", description: "GreenElephant's dev team has been nudged. They'll look into it." });
    } catch {
      toast({ title: "Couldn't reach team", description: "Please try again in a moment.", variant: "destructive" });
    }
  };

  if (nudged) {
    return (
      <span className="text-[10px] text-[#009999]/60 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> Team notified
      </span>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="text-xs text-[#e8c840]/60 border-[#e8c840]/20"
      onClick={handleNudge}
      data-testid="button-nudge-dev"
    >
      <AlertCircle className="w-3 h-3 mr-1" /> Nudge dev team
    </Button>
  );
}

function TimelineEventCard({ event, onDelete }: { event: TimelineEvent; index: number; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const config = getEventConfig(event);
  const Icon = config.icon;
  const isMilestone = event.type === "milestone" || event.toolId === "milestone";
  const lensColor = event.lens
    ? LENS_COLORS.find((l) => l.name.toLowerCase() === event.lens?.toLowerCase())?.color ?? config.color
    : config.color;

  const allText = `${event.title || ""} ${event.description || ""} ${event.details || ""}`;
  const youtubeId = extractYouTubeId(allText);
  const urls = extractUrls(allText);
  const isFile = isFileEntry(event);

  const handleCopy = useCallback(async () => {
    const text = `${event.title}\n${event.description || ""}\n${event.details || ""}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch (err: unknown) {
      console.error("Copy failed:", err instanceof Error ? err.message : "Unknown");
    }
  }, [event]);

  return (
    <div
      className="relative pl-16 md:pl-20 pb-28 group"
      data-testid={`timeline-event-${event.id}`}
    >
      <div
        className="absolute left-6 md:left-8 top-1 w-9 h-9 rounded-full flex items-center justify-center border-2 z-10"
        style={{
          borderColor: lensColor,
          backgroundColor: `${lensColor}20`,
          boxShadow: `0 0 16px ${lensColor}40`,
        }}
      >
        <Icon className="w-4 h-4" style={{ color: lensColor }} />
      </div>

      <div className="text-sm text-white/40 mb-3 font-mono tracking-wider">
        {new Date(event.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </div>

      <Card
        className={`backdrop-blur-sm cursor-pointer transition-all duration-300 hover:bg-white/[0.06] ${
          isMilestone
            ? "bg-[#3b7dd8]/[0.06] border-[#3b7dd8]/25 hover:border-[#3b7dd8]/40"
            : "bg-white/[0.04] border-white/[0.12] hover:border-white/25"
        }`}
        onClick={() => setExpanded(!expanded)}
        data-testid={`card-timeline-event-${event.id}`}
        style={{
          boxShadow: isMilestone
            ? `0 0 24px rgba(59,125,216,0.15), 0 4px 16px rgba(0,0,0,0.3)`
            : expanded ? `0 0 24px ${lensColor}10, 0 4px 16px rgba(0,0,0,0.3)` : "none",
        }}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="text-base font-semibold text-white">{event.title}</h3>
                <Badge
                  className="text-xs border-0"
                  style={{
                    backgroundColor: `${lensColor}20`,
                    color: lensColor,
                  }}
                >
                  {config.label}
                </Badge>
                {event.lens && (
                  <Badge
                    className="text-xs border-0"
                    style={{
                      backgroundColor: `${lensColor}10`,
                      color: `${lensColor}cc`,
                    }}
                  >
                    {event.lens}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-white/50 leading-relaxed">{event.description}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="text-white/30 shrink-0"
              data-testid={`button-expand-event-${event.id}`}
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
          {expanded && (
            <div className="mt-4 pt-4 border-t border-white/[0.08]">
              {event.details && (() => {
                try {
                  const parsed = JSON.parse(event.details);
                  if (parsed.visual && parsed.visualLabel) {
                    return (
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className="text-xs border-0" style={{ backgroundColor: `${lensColor}20`, color: lensColor }}>
                          {parsed.visualLabel}
                        </Badge>
                      </div>
                    );
                  }
                  if (typeof parsed === "object" && parsed !== null) {
                    const entries = Object.entries(parsed).filter(([, v]) => v !== null && v !== undefined && v !== "");
                    if (entries.length > 0) {
                      return (
                        <div className="space-y-2 mb-4">
                          {entries.map(([key, value]) => {
                            const label = key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/[_-]/g, " ")
                              .replace(/^\w/, (c) => c.toUpperCase())
                              .trim();
                            const displayValue = typeof value === "object" 
                              ? (Array.isArray(value) ? (value as string[]).join(", ") : JSON.stringify(value))
                              : String(value);
                            if (!displayValue || displayValue === "{}") return null;
                            return (
                              <div key={key} className="flex items-start gap-2">
                                <span className="text-xs font-medium text-white/40 min-w-[100px] shrink-0">{label}</span>
                                <span className="text-sm text-white/60">{displayValue}</span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                  }
                  return <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap mb-4">{event.details}</p>;
                } catch {
                  return <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap mb-4">{event.details}</p>;
                }
              })()}

              {youtubeId && <YouTubeEmbed videoId={youtubeId} />}

              {isFile && (
                <div className="mt-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.08] space-y-2">
                  <p className="text-xs text-white/40 mb-2">Dashboard / File Access</p>
                  {urls.length > 0 ? urls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[#009999] hover:text-[#009999]/80 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      data-testid={`link-file-open-${i}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Open file</span>
                    </a>
                  )) : (
                    <div className="space-y-2">
                      <p className="text-xs text-white/30">
                        This file was saved to your timeline but the original link isn't available yet.
                        Your coach will share your dashboard link directly — check your email.
                      </p>
                      <NudgeDevTeam context={`File access request: ${event.title} (event ${event.id})`} />
                    </div>
                  )}
                </div>
              )}

              {!youtubeId && !isFile && urls.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {urls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-[#009999] hover:text-[#009999]/80 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      data-testid={`link-url-${i}`}
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">{url.length > 60 ? url.slice(0, 60) + "..." : url}</span>
                    </a>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 flex-wrap mt-3">
                <Button size="sm" variant="outline" className="text-xs text-white/50 border-white/10" onClick={(e) => { e.stopPropagation(); handleCopy(); }} data-testid={`button-copy-event-${event.id}`}>
                  <FileText className="w-3 h-3 mr-1" /> Copy
                </Button>
                <Button size="sm" variant="outline" className="text-xs text-[#e85d75]/60 border-[#e85d75]/20" onClick={(e) => { e.stopPropagation(); onDelete(event.id); }} data-testid={`button-delete-event-${event.id}`}>
                  <Trash2 className="w-3 h-3 mr-1" /> Delete
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function GlowingCable({ eventCount }: { eventCount: number }) {
  const dots = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        delay: i * 1.5,
        duration: 6 + Math.random() * 4,
        direction: i % 2 === 0 ? "normal" : "reverse",
      })),
    []
  );

  return (
    <div className="absolute left-[2.4rem] md:left-[2.9rem] top-0 bottom-0 w-px z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-[#009999]/40 via-[#009999]/20 to-transparent" />
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#009999]"
          style={{
            animation: `cableDot ${dot.duration}s linear infinite ${dot.direction}`,
            animationDelay: `${dot.delay}s`,
            boxShadow: "0 0 6px #009999, 0 0 12px #00999980",
          }}
        />
      ))}
    </div>
  );
}

function LensHUD({ me }: { me: PortalMeResponse }) {
  const [, setLocation] = useLocation();
  const [expandedLens, setExpandedLens] = useState<string | null>(null);
  const [hudReady, setHudReady] = useState(false);
  const { data: publicSettings } = useQuery<{
    subscriptionFeatures?: string[];
  }>({ queryKey: ["/api/portal/settings/public"] });

  useEffect(() => {
    const timer = setTimeout(() => setHudReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative bg-black overflow-hidden">
      <div
        className="relative z-10 max-w-5xl mx-auto px-4 pt-12 pb-16 md:pt-16 md:pb-24"
        data-tour="orbital-overview"
        style={{
          opacity: hudReady ? 1 : 0,
          transform: hudReady ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div className="text-center mb-10">
          <h2
            className="text-2xl md:text-3xl font-bold text-white/90 mb-3"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Your Communication Overview
          </h2>
          <p className="text-white/40 text-base max-w-xl mx-auto leading-relaxed">
            Tap a lens to explore, prompt, or visualize. Each lens opens your toolkit.
          </p>
        </div>

        <div
          className="relative rounded-xl p-6 md:p-8"
          style={{
            border: "1px solid rgba(0,153,153,0.25)",
            background: "linear-gradient(135deg, rgba(0,153,153,0.04) 0%, rgba(0,0,0,0.6) 40%, rgba(59,125,216,0.03) 100%)",
            boxShadow: "0 0 60px rgba(0,153,153,0.08), inset 0 0 60px rgba(0,0,0,0.4), 0 1px 0 rgba(0,153,153,0.12)",
          }}
        >
          <div
            className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,153,153,0.02) 3px, rgba(0,153,153,0.02) 4px)",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
            }}
          />

          <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden">
            <div
              className="absolute w-full h-[1px]"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(0,153,153,0.3) 30%, rgba(0,153,153,0.5) 50%, rgba(0,153,153,0.3) 70%, transparent 100%)",
                animation: "hudScanLine 4s ease-in-out infinite",
              }}
            />
          </div>

          <div className="absolute top-3 left-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#009999] animate-pulse" />
            <span className="text-[10px] text-[#009999]/50 font-mono tracking-widest uppercase">HUD</span>
          </div>

          <div className="absolute top-3 right-4 flex items-center gap-1.5">
            <span className="text-[10px] text-white/15 font-mono">SYS.OK</span>
            <div className="w-1 h-1 rounded-full bg-[#33a854]/50" />
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-5 mt-4">
            {LENS_COLORS.map((lens, idx) => {
              const isOpen = expandedLens === lens.name;
              const LensIcon = lens.icon;
              return (
                <div
                  key={lens.name}
                  className="relative"
                  data-testid={`lens-overview-${lens.name.toLowerCase()}`}
                  style={{
                    opacity: hudReady ? 1 : 0,
                    transform: hudReady ? "translateY(0) scale(1)" : "translateY(12px) scale(0.9)",
                    transition: `opacity 0.5s ease ${0.4 + idx * 0.07}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${0.4 + idx * 0.07}s`,
                  }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setExpandedLens(isOpen ? null : lens.name)}
                        className="w-full flex flex-col items-center gap-2 group cursor-pointer"
                        data-testid={`button-lens-${lens.name.toLowerCase()}`}
                      >
                        <div
                          className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "scale-110" : "group-hover:scale-105"}`}
                          style={{
                            backgroundColor: isOpen ? `${lens.color}25` : `${lens.color}12`,
                            border: `2px solid ${isOpen ? lens.color : `${lens.color}40`}`,
                            boxShadow: isOpen
                              ? `0 0 24px ${lens.color}50, 0 0 48px ${lens.color}20, inset 0 0 12px ${lens.color}15`
                              : `0 0 8px ${lens.color}10`,
                            transition: "box-shadow 0.3s, transform 0.3s, background-color 0.3s, border-color 0.3s",
                          }}
                          onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.boxShadow = `0 0 20px ${lens.color}35, 0 0 40px ${lens.color}15, inset 0 0 8px ${lens.color}10`; }}
                          onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.boxShadow = `0 0 8px ${lens.color}10`; }}
                        >
                          <LensIcon className="w-6 h-6 md:w-7 md:h-7" style={{ color: lens.color, filter: `drop-shadow(0 0 4px ${lens.color}40)` }} />
                        </div>
                        <span className={`text-sm transition-colors duration-200 ${isOpen ? "text-white/80" : "text-white/50 group-hover:text-white/70"}`}>
                          {lens.name}
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[220px] bg-black/95 border-white/10 text-white/80 text-xs">
                      <p className="font-semibold mb-1" style={{ color: lens.color }}>{lens.name}</p>
                      <p>{lens.description}</p>
                    </TooltipContent>
                  </Tooltip>

                  {isOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-20 min-w-[180px] max-w-[220px] animate-in fade-in slide-in-from-top-1 duration-200">
                      <div
                        className="bg-black/95 backdrop-blur-xl border rounded-lg shadow-xl overflow-hidden"
                        style={{ borderColor: `${lens.color}30`, boxShadow: `0 0 30px ${lens.color}15, 0 4px 20px rgba(0,0,0,0.5)` }}
                      >
                        <div className="px-3 py-2.5 border-b" style={{ borderColor: `${lens.color}15` }}>
                          <p className="text-xs text-white/60 leading-relaxed">{lens.description}</p>
                        </div>
                        <div className="p-2">
                          {LENS_ACTIONS.map((action) => (
                            <button
                              key={action.key}
                              onClick={(e) => {
                                e.stopPropagation();
                                setLocation(action.path);
                              }}
                              className="w-full text-left px-3 py-2 rounded-md text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                              data-testid={`button-lens-action-${lens.name.toLowerCase()}-${action.key}`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div
                        className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black/95 border-l border-t rotate-45"
                        style={{ borderColor: `${lens.color}30` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes hudScanLine {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}


function FloatingNav() {
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowNav(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!showNav) return null;

  return (
    <div className="fixed right-4 md:right-8 bottom-8 z-50 flex flex-col gap-2" data-testid="floating-nav">
      <Button
        size="icon"
        variant="outline"
        className="bg-black/80 border-white/10 text-white/60 backdrop-blur-sm"
        onClick={() =>
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
        data-testid="button-scroll-top"
      >
        <ArrowUp className="w-4 h-4" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        className="bg-black/80 border-white/10 text-white/60 backdrop-blur-sm"
        onClick={() =>
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
          })
        }
        data-testid="button-scroll-bottom"
      >
        <ArrowDown className="w-4 h-4" />
      </Button>
    </div>
  );
}

function LinkedInImportModal({ onImport, onClose }: { onImport: (event: { type: string; title: string; description: string; details?: string }) => void; onClose: () => void }) {
  const [mode, setMode] = useState<"url" | "profile" | "onr">("url");
  const [urlValue, setUrlValue] = useState("");
  const { toast } = useToast();

  const handleImport = () => {
    if (mode === "url") {
      if (!urlValue.trim()) {
        toast({ title: "Enter a URL", description: "Paste a LinkedIn article or post URL.", variant: "destructive" });
        return;
      }
      onImport({
        type: "linkedin_import",
        title: "LinkedIn content imported",
        description: urlValue.trim(),
        details: JSON.stringify({ source: "linkedin_url", url: urlValue.trim() }),
      });
    } else if (mode === "profile") {
      onImport({
        type: "linkedin_import",
        title: "LinkedIn profile imported",
        description: "Full profile description, posts, and articles imported",
        details: JSON.stringify({ source: "linkedin_full_profile", scope: ["description", "posts", "articles"] }),
      });
    } else {
      onImport({
        type: "linkedin_import",
        title: "LinkedIn network analysis (ONR)",
        description: "Open Network Research analysis of LinkedIn connections",
        details: JSON.stringify({ source: "linkedin_onr", scope: ["connections", "network_analysis"] }),
      });
    }
    onClose();
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200" data-testid="modal-linkedin-import">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SiLinkedin className="w-5 h-5 text-[#0a66c2]" />
          <h3 className="text-sm font-semibold text-white">Import from LinkedIn</h3>
        </div>
        <button onClick={onClose} className="text-white/30 hover:text-white/50" data-testid="button-close-linkedin-modal">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1.5">
        {[
          { id: "url" as const, label: "Single Article or Post", desc: "Paste a URL to one article or post", icon: Link2 },
          { id: "profile" as const, label: "Full Profile", desc: "Description + all posts & articles", icon: UserCircle },
          { id: "onr" as const, label: "Network Analysis (ONR)", desc: "Open Network Research of your connections", icon: Network },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => setMode(opt.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
              mode === opt.id
                ? "bg-[#0a66c2]/10 border border-[#0a66c2]/30"
                : "bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04]"
            }`}
            data-testid={`button-linkedin-mode-${opt.id}`}
          >
            <opt.icon className="w-4 h-4 shrink-0" style={{ color: mode === opt.id ? "#0a66c2" : "rgba(255,255,255,0.3)" }} />
            <div className="min-w-0">
              <span className={`text-xs block ${mode === opt.id ? "text-[#0a66c2]" : "text-white/50"}`}>{opt.label}</span>
              <span className="text-[10px] text-white/25 block">{opt.desc}</span>
            </div>
          </button>
        ))}
      </div>

      {mode === "url" && (
        <input
          type="url"
          value={urlValue}
          onChange={(e) => setUrlValue(e.target.value)}
          placeholder="https://linkedin.com/posts/..."
          className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-white/80 text-sm placeholder:text-white/20 outline-none focus:border-[#0a66c2]/30"
          data-testid="input-linkedin-url"
        />
      )}

      {mode === "profile" && (
        <div className="p-3 rounded-lg bg-[#0a66c2]/5 border border-[#0a66c2]/15">
          <p className="text-xs text-white/40">This will import your current LinkedIn profile description along with all your published posts and articles.</p>
        </div>
      )}

      {mode === "onr" && (
        <div className="p-3 rounded-lg bg-[#0a66c2]/5 border border-[#0a66c2]/15">
          <p className="text-xs text-white/40">Open Network Research (ONR) analyzes your LinkedIn connection patterns, industries, and relationship strengths.</p>
        </div>
      )}

      <Button
        className="w-full bg-[#0a66c2] text-white"
        onClick={handleImport}
        data-testid="button-linkedin-import-confirm"
      >
        Import from LinkedIn
      </Button>
    </div>
  );
}

function CalendarImportModal({ onImport, onClose }: { onImport: (event: { type: string; title: string; description: string; details?: string }) => void; onClose: () => void }) {
  const [mode, setMode] = useState<"google" | "url" | "listen">("google");
  const [urlValue, setUrlValue] = useState("");
  const { toast } = useToast();

  const handleImport = () => {
    if (mode === "google") {
      onImport({
        type: "calendar_event",
        title: "Google Calendar connected",
        description: "Calendar events synced via Google account",
        details: JSON.stringify({ source: "google_calendar", scope: ["events", "availability"] }),
      });
    } else if (mode === "url") {
      if (!urlValue.trim()) {
        toast({ title: "Enter a URL", description: "Paste an event URL or calendar link.", variant: "destructive" });
        return;
      }
      onImport({
        type: "calendar_event",
        title: "Calendar event added",
        description: urlValue.trim(),
        details: JSON.stringify({ source: "calendar_url", url: urlValue.trim() }),
      });
    } else {
      onImport({
        type: "calendar_event",
        title: "Calendar listening enabled",
        description: "Read-only sync from selected calendars",
        details: JSON.stringify({ source: "calendar_listen", mode: "read_only" }),
      });
    }
    onClose();
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200" data-testid="modal-calendar-import">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#3b7dd8]" />
          <h3 className="text-sm font-semibold text-white">Import from Calendar</h3>
        </div>
        <button onClick={onClose} className="text-white/30 hover:text-white/50" data-testid="button-close-calendar-modal">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1.5">
        {[
          { id: "google" as const, label: "Google Calendar", desc: "Choose calendars via Google Auth", icon: Calendar },
          { id: "url" as const, label: "Event URL", desc: "Add a link to a specific event", icon: Link2 },
          { id: "listen" as const, label: "Listen (Read-Only)", desc: "Sync one or more calendars without editing", icon: ListChecks },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => setMode(opt.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
              mode === opt.id
                ? "bg-[#3b7dd8]/10 border border-[#3b7dd8]/30"
                : "bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04]"
            }`}
            data-testid={`button-calendar-mode-${opt.id}`}
          >
            <opt.icon className="w-4 h-4 shrink-0" style={{ color: mode === opt.id ? "#3b7dd8" : "rgba(255,255,255,0.3)" }} />
            <div className="min-w-0">
              <span className={`text-xs block ${mode === opt.id ? "text-[#3b7dd8]" : "text-white/50"}`}>{opt.label}</span>
              <span className="text-[10px] text-white/25 block">{opt.desc}</span>
            </div>
          </button>
        ))}
      </div>

      {mode === "google" && (
        <div className="p-3 rounded-lg bg-[#3b7dd8]/5 border border-[#3b7dd8]/15">
          <p className="text-xs text-white/40 mb-2">Connects via Google OAuth (already linked in onboarding). Choose which calendar(s) to import events from.</p>
          <p className="text-[10px] text-white/25">Uses read-only scopes from your existing Google connection.</p>
        </div>
      )}

      {mode === "url" && (
        <input
          type="url"
          value={urlValue}
          onChange={(e) => setUrlValue(e.target.value)}
          placeholder="https://calendar.google.com/event?eid=... or any event link"
          className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-white/80 text-sm placeholder:text-white/20 outline-none focus:border-[#3b7dd8]/30"
          data-testid="input-calendar-url"
        />
      )}

      {mode === "listen" && (
        <div className="p-3 rounded-lg bg-[#3b7dd8]/5 border border-[#3b7dd8]/15">
          <p className="text-xs text-white/40">Read-only listening mode syncs upcoming events without any write access. You'll see events appear on your timeline automatically.</p>
        </div>
      )}

      <Button
        className="w-full bg-[#3b7dd8] text-white"
        onClick={handleImport}
        data-testid="button-calendar-import-confirm"
      >
        {mode === "google" ? "Connect Google Calendar" : mode === "url" ? "Add Event" : "Enable Listening"}
      </Button>
    </div>
  );
}

function TimelineConnectors({ onImport }: { onImport: (event: { type: string; title: string; description: string; details?: string }) => void }) {
  const [confirmingSource, setConfirmingSource] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const connectors = [
    { id: "linkedin", name: "LinkedIn", icon: SiLinkedin, color: "#0a66c2", eventType: "linkedin_import", desc: "Import profile activity to timeline", hasModal: true },
    { id: "calendar", name: "Calendar", icon: Calendar, color: "#3b7dd8", eventType: "calendar_event", desc: "Import calendar events", hasModal: true },
    { id: "fathom", name: "Fathom", icon: Activity, color: "#8B5CF6", eventType: "fathom_import", desc: "Import meeting transcripts", hasModal: false },
    { id: "email", name: "Email", icon: Mail, color: "#ea4335", eventType: "email_import", desc: "Import email exchanges", hasModal: false },
    { id: "upload", name: "File Upload", icon: Upload, color: "#009999", eventType: "upload", desc: "Upload documents or data", hasModal: false },
    { id: "url", name: "URL", icon: Globe, color: "#33a854", eventType: "url_import", desc: "Import from a web URL", hasModal: false },
    { id: "scan", name: "Previous Scans", icon: Satellite, color: "#e8c840", eventType: "scan_import", desc: "Bring in past scan dashboards", hasModal: false },
  ];

  const handleConfirmImport = (connector: typeof connectors[0]) => {
    onImport({
      type: connector.eventType,
      title: `${connector.name} data imported`,
      description: `Data imported from ${connector.name} on ${new Date().toLocaleDateString()}`,
    });
    setConfirmingSource(null);
  };

  const handleConnectorClick = (connector: typeof connectors[0]) => {
    if (connector.hasModal) {
      setActiveModal(connector.id);
      setConfirmingSource(null);
    } else {
      setActiveModal(null);
      setConfirmingSource(connector.id);
    }
  };

  return (
    <div data-testid="timeline-connectors">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-xs text-white/30 hover:text-white/50 transition-colors mb-4"
        data-testid="button-toggle-imports"
      >
        {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        <span>Import data sources</span>
        <Badge className="text-[10px] px-1.5 py-0 bg-white/5 text-white/25 border-white/10">{connectors.length}</Badge>
      </button>
      {expanded && (
        <>
          {activeModal === "linkedin" && (
            <div className="mb-4 p-4 rounded-xl bg-white/[0.03] border border-[#0a66c2]/20">
              <LinkedInImportModal onImport={onImport} onClose={() => setActiveModal(null)} />
            </div>
          )}
          {activeModal === "calendar" && (
            <div className="mb-4 p-4 rounded-xl bg-white/[0.03] border border-[#3b7dd8]/20">
              <CalendarImportModal onImport={onImport} onClose={() => setActiveModal(null)} />
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
      {connectors.map((c) => {
        const ConnIcon = c.icon;
        const isConfirming = confirmingSource === c.id;
        const isModalActive = activeModal === c.id;
        return (
          <div key={c.id}>
            {isConfirming ? (
              <div className="flex items-center gap-1.5 p-2 rounded-md bg-white/5 border border-white/10 animate-in fade-in duration-200">
                <span className="text-xs text-white/50">Import {c.name}?</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-[#009999] px-2"
                  onClick={() => handleConfirmImport(c)}
                  data-testid={`button-confirm-import-${c.id}`}
                >
                  Yes
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-white/30 px-2"
                  onClick={() => setConfirmingSource(null)}
                  data-testid={`button-cancel-import-${c.id}`}
                >
                  No
                </Button>
              </div>
            ) : (
              <button
                onClick={() => handleConnectorClick(c)}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-md border transition-all text-left ${
                  isModalActive
                    ? `bg-white/[0.06] border-white/[0.15]`
                    : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12]"
                }`}
                data-testid={`button-import-${c.id}`}
              >
                <ConnIcon className="w-4 h-4 flex-shrink-0" style={{ color: c.color }} />
                <div className="min-w-0">
                  <span className="text-xs text-white/60 block">{c.name}</span>
                  <span className="text-[10px] text-white/25 block truncate">{c.desc}</span>
                </div>
              </button>
            )}
          </div>
        );
      })}
          </div>
        </>
      )}
    </div>
  );
}


export default function PortalDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [viewMode, setViewMode] = useState<TimelineViewMode>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: me, isLoading } = useQuery<PortalMeResponse>({
    queryKey: ["/api/portal/me"],
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: liveEvents, isLoading: eventsLoading } = useQuery<TimelineEvent[]>({
    queryKey: ["/api/portal/timeline"],
    enabled: !!me?.authenticated,
  });

  const { data: userContext } = useQuery<Record<string, string>>({
    queryKey: ["/api/portal/context"],
    enabled: !!me?.authenticated,
  });

  useEffect(() => {
    if (me?.authenticated && userContext && !userContext.onboarding_complete) {
      setShowOnboarding(true);
    }
  }, [me, userContext]);

  const timelineEvents = useMemo(() => {
    const events = liveEvents ? [...liveEvents] : [];
    const firstScanIdx = events.findIndex((e) => e.type === "scan");
    if (firstScanIdx > 0) {
      const [firstScan] = events.splice(firstScanIdx, 1);
      events.push(firstScan);
    }
    return events;
  }, [liveEvents]);

  const filteredEvents = useMemo(() => {
    let filtered = timelineEvents;

    if (viewMode === "milestones") {
      filtered = filtered.filter((e) => e.type === "milestone" || e.toolId === "milestone");
    } else if (viewMode === "learning") {
      filtered = filtered.filter((e) => LEARNING_TYPES.includes(e.type) || (e.toolId && LEARNING_TYPES.includes(e.toolId)));
    }

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.description && e.description.toLowerCase().includes(q))
      );
    }

    return filtered;
  }, [timelineEvents, viewMode, debouncedSearch]);

  const handleImportEvent = useCallback(async (event: { type: string; title: string; description: string; details?: string }) => {
    try {
      await apiRequest("POST", "/api/portal/timeline", event);
      queryClient.invalidateQueries({ queryKey: ["/api/portal/timeline"] });
      toast({ title: "Imported to timeline", description: event.title });
    } catch (err: unknown) {
      toast({ title: "Import failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    }
  }, [toast]);

  const handleDeleteEvent = useCallback(async (eventId: string) => {
    try {
      await apiRequest("DELETE", `/api/portal/timeline/${eventId}`);
      queryClient.invalidateQueries({ queryKey: ["/api/portal/timeline"] });
      toast({ title: "Event deleted" });
    } catch (err: unknown) {
      toast({ title: "Delete failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    }
  }, [toast]);

  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.6 + 0.1,
        duration: `${Math.random() * 4 + 2}s`,
        delay: `${Math.random() * 5}s`,
      })),
    []
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#009999] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!me?.authenticated) {
    setLocation("/portal/login");
    return null;
  }

  return (
    <PortalLayout>
      {showOnboarding && (
        <PortalOnboarding
          userName={me?.user?.name || undefined}
          onComplete={() => {
            setShowOnboarding(false);
            queryClient.invalidateQueries({ queryKey: ["/api/portal/context"] });
          }}
        />
      )}
      <style>{`
        @keyframes cableDot {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes starPulse {
          0%, 100% { opacity: var(--star-opacity); }
          50% { opacity: 0; }
        }
        @keyframes dashboardArrival {
          0% { opacity: 0; transform: scale(0.92) translateY(40px); filter: blur(4px); }
          40% { opacity: 0.6; transform: scale(0.97) translateY(15px); filter: blur(1px); }
          70% { opacity: 0.9; transform: scale(1.01) translateY(-3px); filter: blur(0px); }
          85% { transform: scale(0.998) translateY(1px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
        }
      `}</style>

      <div
        className="relative bg-black"
        style={{ animation: "dashboardArrival 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
        data-testid="portal-dashboard-scroll"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {stars.map((star) => {
            const style: React.CSSProperties & { "--star-opacity": number } = {
              left: star.left,
              top: star.top,
              "--star-opacity": star.opacity,
              opacity: star.opacity,
              animation: `starPulse ${star.duration} ease-in-out infinite`,
              animationDelay: star.delay,
            };
            return (
              <div
                key={star.id}
                className="absolute w-px h-px bg-white rounded-full"
                style={style}
              />
            );
          })}
        </div>

        <div className="relative z-10">
          <LensHUD me={me} />
        </div>

        <div className="relative z-10 min-h-[200px]">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between gap-4 py-8 flex-wrap">
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => setLocation("/portal/settings")}
                  className="w-10 h-10 rounded-full bg-[#009999]/20 flex items-center justify-center border border-[#009999]/30 cursor-pointer hover:bg-[#009999]/30 transition-colors"
                  title={me?.user?.avatarUrl ? "View settings" : "Upload profile photo in Settings"}
                  data-testid="button-avatar-settings"
                >
                  {me?.user?.avatarUrl ? (
                    <img
                      src={me.user.avatarUrl}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5 text-[#009999]" />
                  )}
                </button>
                <div>
                  <h1
                    className="text-2xl md:text-3xl font-bold text-white"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {me?.user?.name
                      ? `${me.user.name.split(" ")[0]}'s Journey`
                      : "Your Journey"}
                  </h1>
                  <p className="text-base text-white/50">{me?.user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative bg-black pb-8" data-tour="timeline-section">
          <div className="max-w-5xl mx-auto px-4">
            <div className="mb-6">
              <div className="flex items-center gap-3 flex-wrap">
                <h3
                  className="text-xl md:text-2xl font-semibold text-white mb-1"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Your Timeline
                </h3>
                {eventsLoading && (
                  <Loader2 className="w-4 h-4 text-[#009999] animate-spin" />
                )}
              </div>
              <p className="text-base text-white/50 leading-relaxed">
                {timelineEvents.length === 0
                  ? "Use the HUD tools below to start building your timeline."
                  : "Scroll down to revisit past events. Your timeline grows as you add data and complete sessions."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
              <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] p-1" data-testid="timeline-view-tabs">
                {([
                  { key: "all" as const, label: "All", count: timelineEvents.length },
                  { key: "milestones" as const, label: "Milestones", count: timelineEvents.filter(e => e.type === "milestone" || e.toolId === "milestone").length },
                  { key: "learning" as const, label: "Learning", count: timelineEvents.filter(e => LEARNING_TYPES.includes(e.type) || (e.toolId && LEARNING_TYPES.includes(e.toolId))).length },
                ]).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setViewMode(tab.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
                      viewMode === tab.key
                        ? "bg-white/10 text-white"
                        : "text-white/40 hover:text-white/60 hover:bg-white/[0.04]"
                    }`}
                    data-testid={`button-view-${tab.key}`}
                  >
                    {tab.key === "milestones" && <Flag className="w-3.5 h-3.5" />}
                    {tab.key === "learning" && <BookOpen className="w-3.5 h-3.5" />}
                    <span>{tab.label}</span>
                    <span className={`text-xs ${viewMode === tab.key ? "text-white/60" : "text-white/25"}`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="relative flex-1 sm:max-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
                <input
                  type="text"
                  placeholder="Search timeline..."
                  aria-label="Search timeline events"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-colors"
                  data-testid="input-timeline-search"
                />
              </div>
            </div>

            <div className="relative">
              <GlowingCable eventCount={filteredEvents.length} />

              <div className="relative z-10">
                {timelineEvents.length === 0 ? (
                  <div className="text-center py-16 text-white/40">
                    <p className="text-lg mb-2" data-testid="text-timeline-empty">Your timeline is empty</p>
                    <p className="text-base">Use the HUD tools to add your first entry, or take a Satellite Scan to get started.</p>
                  </div>
                ) : filteredEvents.length === 0 ? (
                  <div className="text-center py-16 text-white/40">
                    <p className="text-lg mb-2" data-testid="text-timeline-no-results">
                      {debouncedSearch ? `No results for "${debouncedSearch}"` : `No ${viewMode === "milestones" ? "milestones" : "learning events"} yet`}
                    </p>
                    <p className="text-base">
                      {viewMode === "milestones"
                        ? "Use the Milestone button in the HUD toolbar to mark achievements in your journey."
                        : viewMode === "learning"
                        ? "Complete coaching sessions, reflections, or flow checks to build your learning log."
                        : "Try a different search term."}
                    </p>
                  </div>
                ) : filteredEvents.map((event, i) => (
                  <TimelineEventCard key={event.id} event={event} index={i} onDelete={handleDeleteEvent} />
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.06]">
              <TimelineConnectors onImport={handleImportEvent} />
            </div>
          </div>
        </div>

        <div className="relative bg-black">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-px h-16 bg-gradient-to-b from-[#009999]/40 to-transparent mb-4" />
              <Badge className="bg-[#009999]/10 text-[#009999]/60 border-[#009999]/20 text-xs mb-2">
                Ground Level
              </Badge>
              <p className="text-white/30 text-base max-w-xs leading-relaxed">
                This is where your journey began. As you grow, your timeline
                extends upward toward orbital clarity.
              </p>
            </div>
          </div>

          <div className="relative w-full" style={{ minHeight: "120px", height: "clamp(120px, 30vh, 400px)" }}>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-transparent z-10" />
              <img
                src={earthImageUrl}
                alt="Earth surface"
                className="w-full h-full object-cover object-center opacity-40"
                style={{ objectPosition: "center 30%" }}
              />
            </div>
          </div>
        </div>

        <FloatingNav />
      </div>
    </PortalLayout>
  );
}
