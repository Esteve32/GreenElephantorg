import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { Compass, Users, UserCheck, Plus, Sparkles, Heart, FileText, Settings, Lock } from "lucide-react";
import { GreekLoveFlowProfile } from "@/components/myfive/GreekLoveFlowProfile";
import { apiRequest } from "@/lib/queryClient";

interface ConnectionSlot {
  id: string | null;
  slotIndex: number;
  name: string;
  relation: string;
  status: "active" | "empty" | "siloed";
  lastCheckIn?: string;
  isSelf?: boolean;
}

export default function DashboardPage() {
  const [slots, setSlots] = useState<ConnectionSlot[]>([]);
  const [partnerName, setPartnerName] = useState("");
  const [relationType, setRelationType] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSlots = async () => {
    const response = await apiRequest("GET", "/api/myfive/slots");
    const result = await response.json() as { slots: ConnectionSlot[] };
    setSlots(result.slots);
  };

  useEffect(() => { loadSlots().catch((cause: Error) => setError(cause.message)); }, []);

  const addConnection = async () => {
    setAdding(true); setError(null);
    try {
      await apiRequest("POST", "/api/myfive/slots", { partnerName, relationType });
      setPartnerName(""); setRelationType("");
      await loadSlots();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Connection seat could not be created.");
    } finally { setAdding(false); }
  };

  const activeSeatsCount = slots.filter(s => !s.isSelf && s.status === "active").length;

  return (
    <div className="myfive-theme min-h-screen text-slate-100 flex flex-col">
      {/* HUD Header */}
      <header className="myfive-glass-strong border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/myfive">
              <span className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400 cursor-pointer block">
                <Compass className="w-5 h-5" />
              </span>
            </Link>
            <div>
              <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
                MyFive HUD Orbit
                <span className="px-2 py-0.5 text-xs bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded-full font-mono">
                  {activeSeatsCount}/5 Seats Active
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/myfive/check-in">
              <span className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer">
                <Sparkles className="w-3.5 h-3.5" /> Start Check-In
              </span>
            </Link>
            <Link href="/myfive/settings">
              <span className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-all cursor-pointer block">
                <Settings className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main HUD Body */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="myfive-glass myfive-biolume-edge mb-8 p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" /> Relational Compass
            </h2>
            <p className="text-sm text-slate-400">
              Your 5 active connection seats + 1 dedicated self-care vault. Private reflections stay completely isolated.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-400" /> Dyadic Agreements live inside each active connection
            </span>
          </div>
        </div>

        {activeSeatsCount < 5 && (
          <section className="mb-6 grid gap-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 md:grid-cols-[1fr_1fr_auto]" aria-label="Add a connection seat">
            <input aria-label="Connection name" value={partnerName} onChange={(event) => setPartnerName(event.target.value)} placeholder="Connection name" maxLength={100} className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm" />
            <input aria-label="Relationship type" value={relationType} onChange={(event) => setRelationType(event.target.value)} placeholder="Partner, friend, family…" maxLength={100} className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm" />
            <button disabled={adding || !partnerName.trim() || !relationType.trim()} onClick={addConnection} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-40 flex items-center justify-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> {adding ? "Adding…" : "Add seat"}
            </button>
          </section>
        )}

        {/* Orbit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((slot) => (
            <div
              key={slot.slotIndex}
              className={`myfive-biolume-edge p-6 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                slot.isSelf
                  ? "bg-gradient-to-b from-indigo-950/40 to-slate-900 border-indigo-500/30 hover:border-indigo-500/50"
                  : slot.status === "active"
                  ? "myfive-glass"
                  : "bg-slate-900/20 border-dashed border-slate-800/80 hover:border-slate-700"
              }`}
            >
              {slot.isSelf && (
                <div className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Philautia Vault
                </div>
              )}

              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div
                    className={`p-3 rounded-xl ${
                      slot.isSelf
                        ? "myfive-lens-swatch myfive-lens-dynamics border"
                        : slot.status === "active"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-slate-800 text-slate-600"
                    }`}
                  >
                    {slot.isSelf ? (
                      <Heart className="w-5 h-5" />
                    ) : slot.status === "active" ? (
                      <UserCheck className="w-5 h-5" />
                    ) : (
                      <Users className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{slot.name}</h3>
                    <p className="text-xs text-slate-400">{slot.relation}</p>
                  </div>
                </div>

                {slot.status === "active" ? (
                  <div className="space-y-2 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                    <div className="flex justify-between">
                      <span>Last Check-In:</span>
                      <span className="text-slate-200">{slot.lastCheckIn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Consent Status:</span>
                      <span className="text-emerald-400 font-medium">ValueRules™ Granted</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic py-2">
                    An open seat ready for a conscious relationship.
                  </p>
                )}

                {slot.status === "active" && (
                  <GreekLoveFlowProfile
                    slotId={slot.id!}
                    connectionName={slot.name}
                    isSelf={slot.isSelf}
                  />
                )}
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                {slot.status === "active" ? (
                  <>
                    <Link href={`/myfive/check-in?slot=${encodeURIComponent(slot.id!)}`}>
                      <span className="text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer">
                        Check-In &rarr;
                      </span>
                    </Link>
                    {!slot.isSelf && <Link href={`/myfive/agreements?slot=${encodeURIComponent(slot.id!)}`}>
                      <span className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer">
                        Agreements
                      </span>
                    </Link>}
                  </>
                ) : (
                  <span className="w-full py-2 text-center text-xs text-slate-500">Available connection seat</span>
                )}
              </div>
            </div>
          ))}
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-rose-300">{error}</p>}
      </main>
    </div>
  );
}
