import { useState, useMemo } from "react";
import { Music, RefreshCw, Save, ExternalLink, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface EmotionalLandscapeToolProps {
  onSaveToTimeline?: (event: { type: string; title: string; description: string; details?: string; lens?: string; toolId?: string }) => void;
}

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string | null;
  playedAt: string;
  spotifyUrl: string | null;
  valence: number | null;
  energy: number | null;
  danceability: number | null;
  tempo: number | null;
}

interface SpotifyData {
  tracks: Track[];
  emotionalLandscape: {
    avgValence: number | null;
    avgEnergy: number | null;
    moodLabel: string | null;
    trackCount: number;
  };
}

const QUADRANT_CONFIG = {
  "High Energy / Positive": { color: "#33a854", label: "Activated & Upbeat", coaching: "Your music mirrors a state of high engagement and positivity. This energy often correlates with open, confident communication. Great time for bold conversations." },
  "High Energy / Introspective": { color: "#cc3333", label: "Intense & Driven", coaching: "High energy but lower valence suggests determination or processing tension. Channel this into structured communication — prepare talking points before engaging." },
  "Low Energy / Positive": { color: "#3b7dd8", label: "Calm & Content", coaching: "Relaxed and positive — a reflective state ideal for deep listening and empathetic dialogue. Use this window for one-on-one coaching conversations." },
  "Low Energy / Introspective": { color: "#9933cc", label: "Contemplative & Deep", coaching: "Your listening suggests introspection. This is a natural pause for processing. Honor it — journaling or quiet reflection may serve you better than conversation right now." },
} as const;

function getQuadrant(valence: number | null, energy: number | null): keyof typeof QUADRANT_CONFIG {
  if (valence === null || energy === null) return "Low Energy / Positive";
  const highEnergy = energy > 0.5;
  const positive = valence > 0.5;
  if (highEnergy && positive) return "High Energy / Positive";
  if (highEnergy && !positive) return "High Energy / Introspective";
  if (!highEnergy && positive) return "Low Energy / Positive";
  return "Low Energy / Introspective";
}

function MoodDot({ valence, energy, size = 8 }: { valence: number; energy: number; size?: number }) {
  const x = valence * 100;
  const y = (1 - energy) * 100;
  return (
    <circle
      cx={`${x}%`}
      cy={`${y}%`}
      r={size}
      fill="currentColor"
      opacity={0.7}
      className="transition-all duration-300"
    />
  );
}

function MoodScatter({ tracks }: { tracks: Track[] }) {
  const validTracks = tracks.filter(t => t.valence !== null && t.energy !== null);

  return (
    <div className="relative w-full aspect-square max-w-[280px] mx-auto">
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 rounded-md overflow-hidden">
        <div className="bg-[#cc3333]/10 border-r border-b border-white/10" />
        <div className="bg-[#33a854]/10 border-b border-white/10" />
        <div className="bg-[#9933cc]/10 border-r border-white/10" />
        <div className="bg-[#3b7dd8]/10" />
      </div>
      <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] text-white/40">High Energy</div>
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-white/40">Low Energy</div>
      <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] text-white/40 -rotate-90">Introspective</div>
      <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-white/40 rotate-90">Positive</div>
      <svg className="absolute inset-0 w-full h-full text-[#009999]">
        {validTracks.map((track, i) => (
          <MoodDot
            key={`${track.id}-${i}`}
            valence={track.valence!}
            energy={track.energy!}
            size={i === 0 ? 10 : 6}
          />
        ))}
      </svg>
    </div>
  );
}

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-white/60">{label}</span>
        <span className="text-xs font-mono text-white/80">{Math.round(value * 100)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value * 100}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function EmotionalLandscapeTool({ onSaveToTimeline }: EmotionalLandscapeToolProps) {
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  const { data: statusData } = useQuery<{ connected: boolean }>({
    queryKey: ["/api/portal/spotify/status"],
  });

  const { data, isLoading, error, refetch } = useQuery<SpotifyData>({
    queryKey: ["/api/portal/spotify/recent-tracks"],
    enabled: statusData?.connected === true,
  });

  const avgDanceability = useMemo(() => {
    if (!data?.tracks) return null;
    const vals = data.tracks.filter(t => t.danceability !== null).map(t => t.danceability!);
    return vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : null;
  }, [data?.tracks]);

  const avgTempo = useMemo(() => {
    if (!data?.tracks) return null;
    const vals = data.tracks.filter(t => t.tempo !== null).map(t => t.tempo!);
    return vals.length > 0 ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length) : null;
  }, [data?.tracks]);

  if (!statusData?.connected) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#1DB954]/20 flex items-center justify-center">
          <Headphones className="w-8 h-8 text-[#1DB954]" />
        </div>
        <div>
          <p className="text-white/80 font-medium">Spotify Not Connected</p>
          <p className="text-white/50 text-sm mt-1">
            Connect your Spotify account in Settings to unlock your Emotional Landscape — 
            a coaching mirror that reflects your inner state through your listening patterns.
          </p>
        </div>
        <Button
          variant="outline"
          className="border-[#1DB954]/30 text-[#1DB954]"
          onClick={() => window.location.href = "/portal/settings"}
          data-testid="button-goto-settings-spotify"
        >
          Go to Settings
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3">
        <div className="w-10 h-10 rounded-full border-2 border-[#1DB954]/30 border-t-[#1DB954] animate-spin" />
        <p className="text-white/50 text-sm">Reading your sonic landscape...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
        <p className="text-white/60">Could not load Spotify data. Your session may have expired.</p>
        <Button variant="outline" onClick={() => refetch()} data-testid="button-retry-spotify">
          Try Again
        </Button>
      </div>
    );
  }

  const { emotionalLandscape, tracks } = data;
  const quadrant = getQuadrant(emotionalLandscape.avgValence, emotionalLandscape.avgEnergy);
  const config = QUADRANT_CONFIG[quadrant];

  const handleSave = () => {
    if (!onSaveToTimeline) return;
    const details = [
      `Mood: ${emotionalLandscape.moodLabel || "Unknown"}`,
      `Quadrant: ${quadrant} (${config.label})`,
      `Valence: ${emotionalLandscape.avgValence ?? "N/A"}`,
      `Energy: ${emotionalLandscape.avgEnergy ?? "N/A"}`,
      avgDanceability !== null ? `Danceability: ${Math.round(avgDanceability * 100)}%` : null,
      avgTempo !== null ? `Avg Tempo: ${avgTempo} BPM` : null,
      `Tracks analyzed: ${emotionalLandscape.trackCount}`,
      "",
      "Coaching insight:",
      config.coaching,
    ].filter(Boolean).join("\n");

    onSaveToTimeline({
      type: "emotional-landscape",
      title: `Emotional Landscape: ${config.label}`,
      description: `${emotionalLandscape.moodLabel} — ${emotionalLandscape.trackCount} recent tracks analyzed`,
      details,
      lens: "alignment",
      toolId: "emotional-landscape",
    });
    setSaved(true);
    toast({ title: "Saved to timeline", description: "Your emotional landscape snapshot has been recorded." });
  };

  return (
    <div className="space-y-5 pb-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: config.color }}
          />
          <span className="text-sm font-medium text-white/80">{config.label}</span>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => refetch()}
                data-testid="button-refresh-landscape"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh data</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSave}
                disabled={saved}
                data-testid="button-save-landscape"
              >
                <Save className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save to timeline</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4 space-y-4">
          <div className="text-center space-y-1">
            <p className="text-lg font-semibold" style={{ color: config.color }}>
              {emotionalLandscape.moodLabel}
            </p>
            <p className="text-xs text-white/40">
              Based on {emotionalLandscape.trackCount} recently played tracks
            </p>
          </div>

          <MoodScatter tracks={tracks} />

          <div className="grid grid-cols-2 gap-3">
            <MetricBar
              label="Valence (Positivity)"
              value={emotionalLandscape.avgValence ?? 0}
              color="#33a854"
            />
            <MetricBar
              label="Energy"
              value={emotionalLandscape.avgEnergy ?? 0}
              color="#cc3333"
            />
            {avgDanceability !== null && (
              <MetricBar
                label="Danceability"
                value={avgDanceability}
                color="#e8c840"
              />
            )}
            {avgTempo !== null && (
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-white/60">Avg Tempo</span>
                  <span className="text-xs font-mono text-white/80">{avgTempo} BPM</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 bg-[#e8833a]"
                    style={{ width: `${Math.min(avgTempo / 200, 1) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Coaching Insight</p>
          <p className="text-sm text-white/80 leading-relaxed">{config.coaching}</p>
        </CardContent>
      </Card>

      {tracks.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-white/40 uppercase tracking-wider">Recent Tracks</p>
          <div className="space-y-1 max-h-[200px] overflow-y-auto">
            {tracks.slice(0, 10).map((track, i) => (
              <div
                key={`${track.id}-${i}`}
                className="flex items-center gap-2 p-2 rounded-md bg-white/5 hover-elevate"
                data-testid={`track-item-${i}`}
              >
                {track.albumArt ? (
                  <img
                    src={track.albumArt}
                    alt={track.album}
                    className="w-8 h-8 rounded-sm flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-sm bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Music className="w-4 h-4 text-white/30" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/80 truncate">{track.name}</p>
                  <p className="text-[10px] text-white/40 truncate">{track.artist}</p>
                </div>
                {track.valence !== null && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: track.valence > 0.6 ? "#33a854"
                            : track.valence > 0.4 ? "#e8c840"
                            : "#9933cc",
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      Valence: {Math.round(track.valence * 100)}% | Energy: {Math.round((track.energy ?? 0) * 100)}%
                    </TooltipContent>
                  </Tooltip>
                )}
                {track.spotifyUrl && (
                  <a
                    href={track.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-white/30 hover:text-[#1DB954] transition-colors"
                    data-testid={`link-spotify-track-${i}`}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}