import { useEffect, useMemo, useState } from "react";
import { Save, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { MYFIVE_LENS_TOKEN_LIST } from "@/constants/myfiveDesignTokens";
import {
  EMPTY_LOVE_FLOW_PROFILE,
  FLOW_OCTANT_STATES,
  FLOW_STATE_CONTEXT,
  GREEK_LOVE_TYPES,
  type FlowOctantState,
  type GreekLoveType,
  type LoveFlowProfile,
} from "@shared/loveFlowProfile";

interface GreekLoveFlowProfileProps {
  slotId: string | number;
  connectionName: string;
  isSelf?: boolean;
}

const STATE_LABELS: Record<FlowOctantState, string> = {
  arousal: "Arousal",
  flow: "Flow",
  control: "Control",
  relaxation: "Relaxation",
  boredom: "Boredom",
  apathy: "Apathy",
  worry: "Worry",
  anxiety: "Anxiety",
};

const OCTANTS: Array<{ state: FlowOctantState; path: string; x: number; y: number }> = [
  { state: "arousal", path: "M200 200 L0 0 L200 0 Z", x: 132, y: 42 },
  { state: "flow", path: "M200 200 L200 0 L400 0 Z", x: 275, y: 42 },
  { state: "control", path: "M200 200 L400 0 L400 200 Z", x: 332, y: 132 },
  { state: "relaxation", path: "M200 200 L400 200 L400 400 Z", x: 312, y: 278 },
  { state: "boredom", path: "M200 200 L400 400 L200 400 Z", x: 260, y: 362 },
  { state: "apathy", path: "M200 200 L200 400 L0 400 Z", x: 82, y: 362 },
  { state: "worry", path: "M200 200 L0 400 L0 200 Z", x: 28, y: 278 },
  { state: "anxiety", path: "M200 200 L0 200 L0 0 Z", x: 24, y: 132 },
];

function lovePresentation(love: GreekLoveType) {
  const token = MYFIVE_LENS_TOKEN_LIST.find((candidate) => candidate.love === love);
  if (!token) throw new Error(`Missing visual token for ${love}`);
  return { label: token.loveLabel, color: token.hex };
}

async function readMyFiveJson<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error("The MyFive API returned the app page instead of data. Restart the Replit workflow so the updated server routes are active.");
  }
  return response.json() as Promise<T>;
}

export function GreekLoveFlowProfile({ slotId, connectionName, isSelf = false }: GreekLoveFlowProfileProps) {
  const normalizedSlotId = String(slotId);
  const [selectedLove, setSelectedLove] = useState<GreekLoveType>(isSelf ? "philautia" : "philia");
  const [profile, setProfile] = useState<LoveFlowProfile>({ ...EMPTY_LOVE_FLOW_PROFILE });
  const [calibratedAt, setCalibratedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selectedPresentation = useMemo(() => lovePresentation(selectedLove), [selectedLove]);
  const selectedState = profile[selectedLove];
  const profileTitle = isSelf
    ? "Your Self-Connection Profile"
    : `Your Connection Profile with ${connectionName}`;

  useEffect(() => {
    let active = true;
    fetch(`/api/myfive/love-profiles/${encodeURIComponent(normalizedSlotId)}`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) throw new Error("This private love profile could not be loaded.");
        return readMyFiveJson<{ profile: LoveFlowProfile; calibratedAt: string | null }>(response);
      })
      .then((result) => {
        if (!active) return;
        setProfile(result.profile);
        setCalibratedAt(result.calibratedAt);
      })
      .catch((loadError: Error) => active && setError(loadError.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [normalizedSlotId]);

  const chooseState = (state: FlowOctantState | null) => {
    setProfile((current) => ({ ...current, [selectedLove]: state }));
    setDirty(true);
    setError(null);
  };

  const saveSnapshot = async () => {
    setSaving(true);
    setError(null);
    try {
      const response = await apiRequest("POST", "/api/myfive/love-profiles", {
        slotId: normalizedSlotId,
        profile,
      });
      const result = await readMyFiveJson<{ calibratedAt: string }>(response);
      setCalibratedAt(result.calibratedAt);
      setDirty(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "This profile could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section
      className="relative mt-4 overflow-hidden rounded-[2rem_1.25rem_2.5rem_1.5rem] border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.07] via-slate-950/35 to-indigo-400/[0.08] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
      aria-labelledby={`love-profile-${normalizedSlotId}`}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-indigo-400/10 blur-3xl" aria-hidden="true" />
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h4 id={`love-profile-${normalizedSlotId}`} className="flex items-center gap-1.5 text-sm font-semibold text-white">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" /> {profileTitle}
          </h4>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
            Explore eight forms of love through your private need/challenge and capacity/skill compass.
          </p>
        </div>
        <span className="shrink-0 text-[10px] text-slate-500">
          {calibratedAt ? new Date(calibratedAt).toLocaleDateString() : "Not saved"}
        </span>
      </div>

      <div className="mb-3 flex flex-wrap justify-center gap-2" aria-label="Choose a Greek-love dimension">
        {GREEK_LOVE_TYPES.map((love) => {
          const presentation = lovePresentation(love);
          const state = profile[love];
          const selected = love === selectedLove;
          return (
            <button
              key={love}
              type="button"
              onClick={() => setSelectedLove(love)}
              aria-pressed={selected}
              title={`${presentation.label}: ${state ? STATE_LABELS[state] : "Not assessed"}`}
              className={`flex h-12 w-12 flex-col items-center justify-center rounded-full border text-[9px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${selected ? "scale-110 text-white" : "text-slate-300 opacity-75 hover:opacity-100"}`}
              style={{
                borderColor: presentation.color,
                backgroundColor: selected ? `${presentation.color}38` : `${presentation.color}14`,
                boxShadow: selected ? `0 0 18px ${presentation.color}55` : undefined,
              }}
            >
              <span className="font-semibold">{presentation.label}</span>
              <span aria-hidden="true">{state ? STATE_LABELS[state].slice(0, 3) : "—"}</span>
            </button>
          );
        })}
      </div>

      <div className="mx-auto max-w-[25rem]">
        <div className="mb-2 text-center text-xs text-slate-300" aria-live="polite">
          <strong style={{ color: selectedPresentation.color }}>{selectedPresentation.label}</strong>
          {selectedState ? ` · ${STATE_LABELS[selectedState]}` : " · Not assessed"}
        </div>

        <svg
          viewBox="-34 -34 468 468"
          className="aspect-square w-full drop-shadow-[0_0_20px_rgba(34,211,238,0.12)]"
          role="radiogroup"
          aria-label={`${selectedPresentation.label} Flow octant for ${connectionName}`}
        >
          <defs>
            <linearGradient id={`octant-bg-${normalizedSlotId}`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#0B0F19" />
              <stop offset="1" stopColor="#172033" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" rx="24" fill={`url(#octant-bg-${normalizedSlotId})`} stroke="#334155" strokeWidth="2" />
          {OCTANTS.map(({ state, path, x, y }) => {
            const active = selectedState === state;
            return (
              <g key={state}>
                <path
                  d={path}
                  role="radio"
                  aria-label={`${STATE_LABELS[state]}: ${FLOW_STATE_CONTEXT[state].challenge} challenge, ${FLOW_STATE_CONTEXT[state].capacity} capacity`}
                  aria-checked={active}
                  tabIndex={0}
                  onClick={() => chooseState(state)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      chooseState(state);
                    }
                  }}
                  fill={active ? selectedPresentation.color : "rgba(30, 41, 59, 0.28)"}
                  fillOpacity={active ? 0.72 : 1}
                  stroke={active ? "white" : "#475569"}
                  strokeWidth={active ? 3 : 1.25}
                  className="cursor-pointer transition-all hover:fill-slate-700 focus:outline-none"
                />
                <text x={x} y={y} fill={active ? "white" : "#cbd5e1"} fontSize="14" fontWeight={active ? "700" : "500"} pointerEvents="none">
                  {STATE_LABELS[state]}
                </text>
              </g>
            );
          })}
          <circle cx="200" cy="200" r="28" fill="#0B0F19" stroke={selectedPresentation.color} strokeWidth="2" pointerEvents="none" />
          <text x="200" y="197" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" pointerEvents="none">{selectedPresentation.label}</text>
          <text x="200" y="212" textAnchor="middle" fill="#94a3b8" fontSize="9" pointerEvents="none">SELECT STATE</text>
          <text x="200" y="435" textAnchor="middle" fill="#94a3b8" fontSize="11">CAPACITY / SKILL →</text>
          <text x="-200" y="-16" transform="rotate(-90)" textAnchor="middle" fill="#94a3b8" fontSize="11">NEED / CHALLENGE →</text>
        </svg>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <button type="button" onClick={() => chooseState(null)} className="text-[11px] text-slate-400 underline underline-offset-2 hover:text-white">
          Mark {selectedPresentation.label} not assessed
        </button>
        <button
          type="button"
          onClick={saveSnapshot}
          disabled={loading || saving || !dirty}
          className="flex items-center gap-1.5 rounded-full bg-cyan-600 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Save className="h-3 w-3" /> {saving ? "Saving…" : "Save private snapshot"}
        </button>
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-red-300">{error}</p>}
    </section>
  );
}
