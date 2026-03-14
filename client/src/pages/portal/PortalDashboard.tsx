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
  { name: "Chaordic", color: "#e8c840", icon: Compass, description: "Your balance between chaos and order. How you navigate ambiguity and structure in communication." },
  { name: "Flow", color: "#33a854", icon: Activity, description: "Your capacity for effortless engagement. When conversations energize vs. drain you." },
  { name: "Alignment", color: "#009999", icon: BarChart3, description: "How well your words match your intent. The gap between what you mean and what others hear." },
  { name: "Needs", color: "#3b7dd8", icon: Heart, description: "Your underlying human needs in dialogue. What you seek from every interaction." },
  { name: "Ego", color: "#9933cc", icon: User, description: "Your sense of self in conversation. How identity shapes your communication patterns." },
  { name: "Dynamics", color: "#8899aa", icon: Sparkles, description: "The interplay of forces in your relationships. Patterns that repeat across contexts." },
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

function TimelineEventCard({ event, onDelete }: { event: TimelineEvent; index: number; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const config = getEventConfig(event);
  const Icon = config.icon;
  const lensColor = event.lens
    ? LENS_COLORS.find((l) => l.name.toLowerCase() === event.lens?.toLowerCase())?.color ?? config.color
    : config.color;

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
      className="relative pl-16 md:pl-20 pb-16 group"
      data-testid={`timeline-event-${event.id}`}
    >
      <div
        className="absolute left-6 md:left-8 top-1 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10"
        style={{
          borderColor: lensColor,
          backgroundColor: `${lensColor}20`,
          boxShadow: `0 0 12px ${lensColor}40`,
        }}
      >
        <Icon className="w-4 h-4" style={{ color: lensColor }} />
      </div>

      <div className="text-sm text-white/40 mb-2 font-mono tracking-wider">
        {new Date(event.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </div>

      <Card
        className="bg-white/[0.03] border-white/[0.08] backdrop-blur-sm cursor-pointer transition-all hover:border-white/20"
        onClick={() => setExpanded(!expanded)}
        data-testid={`card-timeline-event-${event.id}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
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
            {event.details && (
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
            )}
          </div>
          {expanded && event.details && (
            <div className="mt-3 pt-3 border-t border-white/[0.06]">
              <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">{event.details}</p>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
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
  const { data: publicSettings } = useQuery<{
    subscriptionFeatures?: string[];
  }>({ queryKey: ["/api/portal/settings/public"] });

  return (
    <div className="relative bg-black">
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-12 pb-16 md:pt-16 md:pb-24" data-tour="orbital-overview">
        <div className="text-center mb-10">
          <h2
            className="text-xl md:text-2xl font-bold text-white/90 mb-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Your Communication Overview
          </h2>
          <p className="text-white/40 text-sm max-w-xl mx-auto">
            Tap a lens to explore, prompt, or visualize. Each lens opens your toolkit.
          </p>
        </div>

        <div className="relative rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8">
          <div className="absolute inset-0 rounded-xl pointer-events-none" style={{ boxShadow: "inset 0 0 80px rgba(0,0,0,0.3)" }} />

          <div className="absolute top-3 left-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#009999]/60" />
            <span className="text-[10px] text-white/20 font-mono tracking-widest uppercase">HUD</span>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-5 mt-4">
            {LENS_COLORS.map((lens) => {
              const isOpen = expandedLens === lens.name;
              const LensIcon = lens.icon;
              return (
                <div key={lens.name} className="relative" data-testid={`lens-overview-${lens.name.toLowerCase()}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setExpandedLens(isOpen ? null : lens.name)}
                        className="w-full flex flex-col items-center gap-2 group cursor-pointer"
                        data-testid={`button-lens-${lens.name.toLowerCase()}`}
                      >
                        <div
                          className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "scale-110" : "group-hover:scale-105"}`}
                          style={{
                            backgroundColor: isOpen ? `${lens.color}30` : `${lens.color}15`,
                            border: `2px solid ${isOpen ? lens.color : `${lens.color}50`}`,
                            boxShadow: isOpen
                              ? `0 0 20px ${lens.color}40, 0 0 40px ${lens.color}15`
                              : "none",
                            transition: "box-shadow 0.3s, transform 0.3s, background-color 0.3s, border-color 0.3s",
                          }}
                          onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.boxShadow = `0 0 18px ${lens.color}30, 0 0 36px ${lens.color}10`; }}
                          onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.boxShadow = "none"; }}
                        >
                          <LensIcon className="w-5 h-5 md:w-6 md:h-6" style={{ color: lens.color }} />
                        </div>
                        <span className={`text-xs transition-colors duration-200 ${isOpen ? "text-white/80" : "text-white/40 group-hover:text-white/60"}`}>
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
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-20 min-w-[140px] animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="bg-black/90 backdrop-blur-xl border border-white/15 rounded-lg p-2 shadow-xl" style={{ boxShadow: `0 0 20px ${lens.color}15` }}>
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
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black/90 border-l border-t border-white/15 rotate-45" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
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

function TimelineConnectors({ onImport }: { onImport: (event: { type: string; title: string; description: string }) => void }) {
  const [confirmingSource, setConfirmingSource] = useState<string | null>(null);

  const connectors = [
    { id: "linkedin", name: "LinkedIn", icon: SiLinkedin, color: "#0a66c2", eventType: "linkedin_import", desc: "Import profile activity to timeline" },
    { id: "calendar", name: "Calendar", icon: Calendar, color: "#3b7dd8", eventType: "calendar_event", desc: "Add calendar events to timeline" },
  ];

  const handleConfirmImport = (connector: typeof connectors[0]) => {
    onImport({
      type: connector.eventType,
      title: `${connector.name} data imported`,
      description: `Data imported from ${connector.name} on ${new Date().toLocaleDateString()}`,
    });
    setConfirmingSource(null);
  };

  return (
    <div className="flex items-center gap-2 mb-6 flex-wrap" data-testid="timeline-connectors">
      <span className="text-xs text-white/25 mr-1">Import:</span>
      {connectors.map((c) => {
        const Icon = c.icon;
        const isConfirming = confirmingSource === c.id;
        return (
          <div key={c.id} className="flex items-center gap-1">
            {isConfirming ? (
              <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-white/5 border border-white/10 animate-in fade-in duration-200">
                <span className="text-xs text-white/50">Import {c.name} data?</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-[#009999] px-2"
                  onClick={() => handleConfirmImport(c)}
                  data-testid={`button-confirm-import-${c.id}`}
                >
                  Confirm
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-white/30 px-2"
                  onClick={() => setConfirmingSource(null)}
                  data-testid={`button-cancel-import-${c.id}`}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-white/30 gap-1 px-2"
                onClick={() => setConfirmingSource(c.id)}
                data-testid={`button-import-${c.id}`}
              >
                <Icon className="w-3 h-3" style={{ color: c.color }} />
                {c.name}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}


export default function PortalDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { data: me, isLoading } = useQuery<PortalMeResponse>({
    queryKey: ["/api/portal/me"],
  });

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

  const handleImportEvent = useCallback(async (event: { type: string; title: string; description: string }) => {
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
      `}</style>

      <div
        className="relative bg-black"
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
                <div className="w-10 h-10 rounded-full bg-[#009999]/20 flex items-center justify-center border border-[#009999]/30">
                  {me?.user?.avatarUrl ? (
                    <img
                      src={me.user.avatarUrl}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5 text-[#009999]" />
                  )}
                </div>
                <div>
                  <h1
                    className="text-xl md:text-2xl font-bold text-white"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {me?.user?.name
                      ? `${me.user.name.split(" ")[0]}'s Journey`
                      : "Your Journey"}
                  </h1>
                  <p className="text-sm text-white/50">{me?.user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative bg-black pb-8" data-tour="timeline-section">
          <div className="max-w-5xl mx-auto px-4">
            <div className="mb-8">
              <div className="flex items-center gap-3 flex-wrap">
                <h3
                  className="text-lg font-semibold text-white mb-1"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Your Timeline
                </h3>
                {eventsLoading && (
                  <Loader2 className="w-4 h-4 text-[#009999] animate-spin" />
                )}
              </div>
              <p className="text-sm text-white/50">
                {timelineEvents.length === 0
                  ? "Use the HUD tools below to start building your timeline."
                  : "Scroll down to revisit past events. Your timeline grows as you add data and complete sessions."}
              </p>
            </div>

            <div className="relative">
              <GlowingCable eventCount={timelineEvents.length} />

              <div className="relative z-10">
                {timelineEvents.length === 0 ? (
                  <div className="text-center py-12 text-white/40">
                    <p className="text-base mb-1" data-testid="text-timeline-empty">Your timeline is empty</p>
                    <p className="text-sm">Use the HUD tools to add your first entry, or take a Satellite Scan to get started.</p>
                  </div>
                ) : timelineEvents.map((event, i) => (
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
              <p className="text-white/30 text-sm max-w-xs">
                This is where your journey began. As you grow, your timeline
                extends upward toward orbital clarity.
              </p>
            </div>
          </div>

          <div className="relative h-[30vh] md:h-[40vh]">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-transparent z-10" />
              <img
                src={earthImageUrl}
                alt="Earth surface"
                className="w-full h-full object-cover object-top opacity-40"
              />
            </div>
          </div>
        </div>

        <FloatingNav />
      </div>
    </PortalLayout>
  );
}
