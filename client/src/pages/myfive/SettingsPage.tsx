import React, { useState } from "react";
import { Link } from "wouter";
import { Compass, CreditCard, Shield, Database, Trash2, ArrowLeft, Check, Sparkles } from "lucide-react";

export default function SettingsPage() {
  const [stripeActive, setStripeActive] = useState(true);
  const [sponsoredSeats] = useState(2);
  const [dataWiped, setDataWiped] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/myfive/dashboard">
              <span className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-all cursor-pointer block">
                <ArrowLeft className="w-4 h-4" />
              </span>
            </Link>
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <h1 className="font-bold text-base text-white">Sovereignty & Pay Gates Settings HUD</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Stripe SaaS Pay Gates Section */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-white">B2C Membership & Stripe Pay Gates</h2>
                <p className="text-xs text-slate-400">€4.99/month Primary Subscription includes 5 Partner Seats</p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-xs font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" /> Active Membership
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex justify-between">
              <span>Primary Membership Plan:</span>
              <span className="text-emerald-400 font-semibold">€4.99 / month (Active via Stripe)</span>
            </div>
            <div className="flex justify-between">
              <span>Partner Sponsored Seats Used:</span>
              <span className="text-slate-200">{sponsoredSeats} of 5 Seats Allocated</span>
            </div>
            <div className="flex justify-between">
              <span>Partner Cost:</span>
              <span className="text-emerald-400">€0.00 (Covered by Primary Sponsor)</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">Manage payment method & invoices via Stripe Portal</span>
            <button
              onClick={() => setStripeActive(!stripeActive)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Stripe Portal
            </button>
          </div>
        </div>

        {/* Data Vault & Privacy HUD */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">Local Vault & On-Device Storage</h2>
              <p className="text-xs text-slate-400">IndexedDB local-first cache footprint</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-200">Local Cache Size: 1.4 MB</p>
              <p className="text-slate-500">Private check-ins and agreement drafts stored locally</p>
            </div>
            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all">
              Export Vault JSON
            </button>
          </div>
        </div>

        {/* Absolute GDPR Wipe Switch */}
        <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">GDPR Article 17 Cascade Wipe</h2>
              <p className="text-xs text-slate-400">Permanently delete your account, private check-ins, and agreements</p>
            </div>
          </div>

          {dataWiped ? (
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs font-mono">
              ✓ Account and local cache cascade wipe completed.
            </div>
          ) : (
            <button
              onClick={() => setDataWiped(true)}
              className="w-full py-3 bg-rose-600/80 hover:bg-rose-600 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" /> Trigger Immediate Cascade Account Wipe
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
