import { useState } from "react";
import { Radar, ChevronRight, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TimelineEvent {
  id: number;
  type: string;
  title: string;
  description: string;
  details?: string;
  date: string;
  lens?: string;
  toolId?: string;
}

const LENS_COLORS: Record<string, string> = {
  influence: "#cc3333",
  attitude: "#e8833a",
  chaordic: "#e8c840",
  flow: "#33a854",
  alignment: "#009999",
  needs: "#3b7dd8",
  ego: "#9933cc",
  dynamics: "#8899aa",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function timeSince(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

export function ScanHistoryTool() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: timeline, isLoading } = useQuery<TimelineEvent[]>({
    queryKey: ["/api/portal/timeline"],
  });

  const scanEvents = (timeline || []).filter(
    (e) => e.type === "scan" || e.type === "scan-purchase" || e.type === "satellite-scan" ||
           e.title?.toLowerCase().includes("scan") || e.toolId === "scan"
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3">
        <div className="w-10 h-10 rounded-full border-2 border-[#e8c840]/30 border-t-[#e8c840] animate-spin" />
        <p className="text-white/50 text-sm">Loading scan history...</p>
      </div>
    );
  }

  if (scanEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#e8c840]/15 flex items-center justify-center">
          <Radar className="w-8 h-8 text-[#e8c840]" />
        </div>
        <div>
          <p className="text-white/80 font-medium">No Scans Yet</p>
          <p className="text-white/50 text-sm mt-1">
            Your Satellite Scan results will appear here once completed.
            Each scan maps your communication patterns across all 8 lenses.
          </p>
        </div>
        <Button
          variant="outline"
          className="border-[#e8c840]/30 text-[#e8c840]"
          onClick={() => window.location.href = "/scan"}
          data-testid="button-get-scan"
        >
          Learn About Satellite Scan
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Radar className="w-4 h-4 text-[#e8c840]" />
          <span className="text-sm font-medium text-white/80">
            {scanEvents.length} scan{scanEvents.length !== 1 ? "s" : ""} recorded
          </span>
        </div>
        <Badge variant="outline" className="text-xs border-white/10 text-white/40">
          {timeSince(scanEvents[0].date)}
        </Badge>
      </div>

      <div className="space-y-2">
        {scanEvents.map((event) => {
          const isExpanded = expandedId === event.id;
          const lensColor = event.lens ? LENS_COLORS[event.lens.toLowerCase()] : "#e8c840";
          const isCompleted = event.title?.toLowerCase().includes("completed") ||
                             event.description?.toLowerCase().includes("completed");

          return (
            <Card
              key={event.id}
              className="bg-white/5 border-white/10 cursor-pointer transition-all duration-200"
              onClick={() => setExpandedId(isExpanded ? null : event.id)}
              data-testid={`scan-event-${event.id}`}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: `${lensColor}15`, border: `1.5px solid ${lensColor}30` }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" style={{ color: lensColor }} />
                    ) : (
                      <Clock className="w-4 h-4" style={{ color: lensColor }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-white/90 truncate">{event.title}</p>
                      <ChevronRight
                        className={`w-3.5 h-3.5 text-white/30 shrink-0 transition-transform duration-200 ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="flex items-center gap-1 text-xs text-white/40">
                            <Calendar className="w-2.5 h-2.5" />
                            {formatDate(event.date)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>{timeSince(event.date)}</TooltipContent>
                      </Tooltip>
                      {event.lens && (
                        <Badge
                          variant="outline"
                          className="text-[10px] border-transparent px-1.5 py-0"
                          style={{ color: lensColor, backgroundColor: `${lensColor}10` }}
                        >
                          {event.lens}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-white/5 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    {event.description && (
                      <p className="text-xs text-white/60 leading-relaxed">{event.description}</p>
                    )}
                    {event.details && (
                      <div className="p-2 rounded-md bg-white/[0.03] border border-white/5">
                        <pre className="text-xs text-white/40 whitespace-pre-wrap font-sans leading-relaxed">
                          {event.details}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-white/20 mt-0.5 shrink-0" />
          <p className="text-xs text-white/30 leading-relaxed">
            Each Satellite Scan maps your unique communication fingerprint across the 8 Lenses of Conscious Communication.
            Comparing scans over time reveals your growth trajectory.
          </p>
        </div>
      </div>
    </div>
  );
}