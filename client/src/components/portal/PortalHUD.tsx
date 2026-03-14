import { useState, useCallback } from "react";
import {
  Upload,
  MessageSquare,
  Activity,
  Scan,
  Download,
  Zap,
  BookOpen,
  Layers,
  X,
  Settings,
  LogOut,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ToolWindow } from "./ToolWindow";
import { UploadTool } from "./tools/UploadTool";
import { DebriefTool } from "./tools/DebriefTool";
import { FlowCheckTool } from "./tools/FlowCheckTool";
import { ReflectionTool } from "./tools/ReflectionTool";
import { ExportTool } from "./tools/ExportTool";
import { MicroHabitsTool } from "./tools/MicroHabitsTool";
import { PrepareTool } from "./tools/PrepareTool";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { PortalMeResponse } from "@/lib/portal-types";

interface HudTool {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  question: string;
  subtitle: string;
}

const HUD_TOOLS: HudTool[] = [
  {
    id: "upload",
    label: "Upload",
    icon: Upload,
    color: "#009999",
    question: "What data would you like to add to your timeline?",
    subtitle: "Add scan results, meeting notes, or coaching documents",
  },
  {
    id: "debrief",
    label: "Debrief",
    icon: MessageSquare,
    color: "#33b864",
    question: "What conversation would you like to debrief?",
    subtitle: "Reflect on a recent interaction and capture key insights",
  },
  {
    id: "flowcheck",
    label: "Flow Check",
    icon: Activity,
    color: "#a3cc33",
    question: "How are you communicating right now?",
    subtitle: "Quick 2-minute pulse check on your current communication state",
  },
  {
    id: "reflection",
    label: "Reflection",
    icon: Scan,
    color: "#e8833a",
    question: "Ready for a deeper look at your patterns?",
    subtitle: "Full reflection across all 8 lenses based on your data",
  },
  {
    id: "export",
    label: "Export",
    icon: Download,
    color: "#3b7dd8",
    question: "What would you like to export or share?",
    subtitle: "Download your data, timeline, or share a summary",
  },
  {
    id: "microhabits",
    label: "Micro Habits",
    icon: Zap,
    color: "#e8c840",
    question: "Which lens would you like to strengthen today?",
    subtitle: "Get a personalized micro-habit based on your communication data",
  },
  {
    id: "prepare",
    label: "Prepare",
    icon: BookOpen,
    color: "#9933cc",
    question: "What are you preparing for?",
    subtitle: "Get communication tips for an upcoming meeting, talk, or event",
  },
];

export function PortalHUD() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: meData } = useQuery<PortalMeResponse>({
    queryKey: ["/api/portal/me"],
  });

  const { data: ctx } = useQuery<Record<string, string>>({
    queryKey: ["/api/portal/context"],
  });

  const enabledToolsRaw = ctx?.enabled_tools;
  const enabledTools = enabledToolsRaw === undefined || enabledToolsRaw === null
    ? HUD_TOOLS.map((t) => t.id)
    : enabledToolsRaw === "" ? [] : enabledToolsRaw.split(",");

  const openTool = useCallback((toolId: string) => {
    if (toolId !== "export" && !enabledTools.includes(toolId)) {
      toast({ title: "Tool disabled", description: "Enable this tool in Settings > Data Privacy to use it.", variant: "destructive" });
      return;
    }
    setActiveTool(toolId);
    setIsExpanded(false);
  }, [enabledTools, toast]);

  const closeTool = useCallback(() => {
    setActiveTool(null);
  }, []);

  const handleSaveToTimeline = useCallback(
    async (event: { type: string; title: string; description: string; details?: string; lens?: string; toolId?: string }) => {
      try {
        await apiRequest("POST", "/api/portal/timeline", {
          type: event.type,
          title: event.title,
          description: event.description,
          details: event.details,
          lens: event.lens,
          toolId: event.toolId || activeTool || undefined,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/portal/timeline"] });
        toast({ title: "Saved to timeline", description: event.title });
      } catch (err: unknown) {
        console.error("Timeline save error:", err instanceof Error ? err.message : "Unknown error");
        toast({ title: "Could not save", description: "Timeline save failed. Please try again.", variant: "destructive" });
      }
    },
    [toast, activeTool]
  );

  const activeToolData = HUD_TOOLS.find((t) => t.id === activeTool);

  const renderToolContent = () => {
    switch (activeTool) {
      case "upload":
        return <UploadTool onSaveToTimeline={handleSaveToTimeline} />;
      case "debrief":
        return <DebriefTool onSaveToTimeline={handleSaveToTimeline} />;
      case "flowcheck":
        return <FlowCheckTool onSaveToTimeline={handleSaveToTimeline} />;
      case "reflection":
        return <ReflectionTool onSaveToTimeline={handleSaveToTimeline} />;
      case "export":
        return <ExportTool userEmail={meData?.user?.email} />;
      case "microhabits":
        return <MicroHabitsTool onSaveToTimeline={handleSaveToTimeline} />;
      case "prepare":
        return <PrepareTool onSaveToTimeline={handleSaveToTimeline} />;
      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        @keyframes hudPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.08); }
        }
      `}</style>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50" data-testid="portal-hud">
        <div className="relative">
          {isExpanded && (
            <div
              className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2 p-2 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-[calc(100vw-2rem)]"
              data-testid="hud-toolbar"
            >
              {HUD_TOOLS.map((tool) => {
                const Icon = tool.icon;
                const isDisabled = tool.id !== "export" && !enabledTools.includes(tool.id);
                return (
                  <Tooltip key={tool.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => openTool(tool.id)}
                        aria-label={tool.label}
                        className={`group relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${isDisabled ? "opacity-30 cursor-not-allowed" : "hover:scale-110 active:scale-95"}`}
                        style={{
                          backgroundColor: `${tool.color}15`,
                          border: `1.5px solid ${tool.color}40`,
                        }}
                        data-testid={`hud-button-${tool.id}`}
                        data-tour={`hud-button-${tool.id}`}
                      >
                        <Icon
                          className="w-[18px] h-[18px] transition-colors duration-200"
                          style={{ color: tool.color }}
                        />
                        {!isDisabled && (
                          <span
                            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            style={{
                              boxShadow: `0 0 16px ${tool.color}30, inset 0 0 12px ${tool.color}10`,
                            }}
                          />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[200px]">
                      <p className="font-semibold text-sm">{tool.label}</p>
                      <p className="text-xs text-muted-foreground">{isDisabled ? "Enable in Settings > Data Privacy" : tool.subtitle}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}

              <div className="w-px h-8 bg-white/10 mx-1" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => { setIsExpanded(false); setLocation("/portal/settings"); }}
                    aria-label="Settings"
                    className="group relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 bg-white/5 border border-white/15"
                    data-testid="hud-button-settings"
                  >
                    <Settings className="w-[18px] h-[18px] text-white/50 group-hover:text-white/80 transition-colors" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-semibold text-sm">Settings</p>
                  <p className="text-xs text-muted-foreground">Preferences, connectors, data & privacy</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={async () => {
                      setIsExpanded(false);
                      await apiRequest("POST", "/api/portal/logout");
                      await queryClient.invalidateQueries({ queryKey: ["/api/portal/me"] });
                      toast({ title: "Logged out", description: "See you next time!" });
                      setLocation("/portal/login");
                    }}
                    aria-label="Log Out"
                    className="group relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 bg-white/5 border border-white/15"
                    data-testid="hud-button-logout"
                  >
                    <LogOut className="w-[18px] h-[18px] text-white/50 group-hover:text-white/80 transition-colors" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-semibold text-sm">Log Out</p>
                  <p className="text-xs text-muted-foreground">Sign out of your portal</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Close tools" : "Open tools"}
            aria-expanded={isExpanded}
            className="relative w-14 h-14 rounded-full bg-[#009999]/20 border-2 border-[#009999]/40 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 group"
            style={{
              boxShadow: isExpanded
                ? "0 0 30px rgba(0,153,153,0.3), 0 4px 20px rgba(0,0,0,0.4)"
                : "0 0 15px rgba(0,153,153,0.15), 0 4px 12px rgba(0,0,0,0.3)",
            }}
            data-testid="hud-toggle"
            data-tour="hud-toggle"
          >
            {!isExpanded && (
              <>
                <span className="absolute inset-[-4px] rounded-full border border-[#009999]/30 animate-[hudPulse_3s_ease-in-out_infinite]" />
                <span className="absolute inset-[-10px] rounded-full border border-[#009999]/15 animate-[hudPulse_3s_ease-in-out_infinite_0.5s]" />
                <span className="absolute inset-[-16px] rounded-full border border-[#009999]/8 animate-[hudPulse_3s_ease-in-out_infinite_1s]" />
              </>
            )}
            {isExpanded ? (
              <X className="w-5 h-5 text-[#009999] transition-transform duration-200" />
            ) : (
              <Layers className="w-5 h-5 text-[#009999] transition-transform duration-200" />
            )}
          </button>
        </div>
      </div>

      {activeToolData && (
        <ToolWindow
          title={activeToolData.label}
          subtitle={activeToolData.subtitle}
          icon={activeToolData.icon}
          isOpen={!!activeTool}
          onClose={closeTool}
        >
          {renderToolContent()}
        </ToolWindow>
      )}
    </>
  );
}
