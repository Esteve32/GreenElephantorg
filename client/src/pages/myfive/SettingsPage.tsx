import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { Compass, CreditCard, Shield, Database, Trash2, ArrowLeft, Check, Sparkles, FileJson, FileText } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { exportPrivateVault, wipePrivateVault } from "@/lib/myfiveVault";
import { renderMyFiveExportMarkdown } from "@shared/myfiveDataExport";
import type { MyFiveDataExport } from "@shared/myfiveDataExport";

export default function SettingsPage() {
  const [subscription, setSubscription] = useState<{ status: string; sponsoredSeatsAllocated: number; stripeConnected: boolean } | null>(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<"json" | "markdown" | null>(null);
  const [vaultOwnershipConfirmed, setVaultOwnershipConfirmed] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [dataWiped, setDataWiped] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    apiRequest("GET", "/api/myfive/subscription")
      .then((response) => response.json())
      .then(setSubscription)
      .catch((error: Error) => setCheckoutError(error.message));
  }, []);

  const startCheckout = async () => {
    setCheckoutLoading(true); setCheckoutError(null);
    try {
      const response = await apiRequest("POST", "/api/myfive/subscription/checkout", { customerEmail });
      const { checkoutUrl } = await response.json() as { checkoutUrl: string };
      window.location.assign(checkoutUrl);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Checkout could not be started.");
      setCheckoutLoading(false);
    }
  };

  const isActive = subscription?.status === "active";
  const isEntitled = ["active", "sponsored", "eap"].includes(subscription?.status ?? "");

  const redeemVoucher = async () => {
    setVoucherLoading(true); setCheckoutError(null);
    try {
      const response = await apiRequest("POST", "/api/myfive/eap-vouchers/redeem", { code: voucherCode });
      const result = await response.json() as { status: string; message?: string };
      setSubscription((current) => current ? { ...current, status: result.status } : { status: result.status, sponsoredSeatsAllocated: 0, stripeConnected: false });
      setVoucherCode("");
    } catch (error) { setCheckoutError(error instanceof Error ? error.message : "Voucher could not be redeemed."); }
    finally { setVoucherLoading(false); }
  };

  const deleteAccount = async () => {
    setDeleting(true); setDeleteError(null);
    try {
      await apiRequest("DELETE", "/api/myfive/account", { confirmation: deleteConfirmation });
      await wipePrivateVault();
      setDataWiped(true);
      setDeleteConfirmation("");
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Account deletion could not be completed.");
    } finally { setDeleting(false); }
  };

  const downloadDataExport = async (format: "json" | "markdown") => {
    if (!vaultOwnershipConfirmed) {
      setExportError("Confirm that this browser profile's local MyFive vault belongs to you before exporting it.");
      return;
    }
    setExportingFormat(format);
    setExportError(null);
    setExportNotice(null);
    try {
      const response = await apiRequest("GET", "/api/myfive/data-export?format=json");
      const serverExport = await response.json() as MyFiveDataExport;
      const combinedAt = new Date().toISOString();
      let combinedExport: MyFiveDataExport;
      try {
        const localCheckIns = await exportPrivateVault();
        combinedExport = {
          ...serverExport,
          metadata: {
            ...serverExport.metadata,
            provenance: {
              ...serverExport.metadata.provenance,
              localBrowserVault: "After explicit user confirmation that this browser profile's vault belongs to the signed-in data subject, records were decrypted and combined locally. Plaintext was not uploaded to the server.",
            },
          },
          localBrowserVault: {
            status: "included_by_browser",
            description: "After your explicit ownership confirmation, records readable in this browser profile were decrypted locally and included in this download. Legacy local records have no server account identifier; the server did not receive their plaintext.",
            combinedAt,
            recordCount: localCheckIns.length,
            checkIns: localCheckIns,
          },
        };
        setExportNotice(`Export ready with ${localCheckIns.length} encrypted local-vault check-in${localCheckIns.length === 1 ? "" : "s"} combined on this device.`);
      } catch (vaultError) {
        combinedExport = {
          ...serverExport,
          localBrowserVault: {
            status: "unavailable_in_browser",
            description: "The server export succeeded, but this browser could not decrypt its local vault. No local-vault plaintext was uploaded or included. Retry from the browser profile where the records were created.",
            combinedAt,
          },
        };
        setExportNotice(vaultError instanceof Error
          ? `Server data exported without the local vault: ${vaultError.message}`
          : "Server data exported without the local vault because this browser could not read it.");
      }

      const contents = format === "json"
        ? JSON.stringify(combinedExport, null, 2)
        : renderMyFiveExportMarkdown(combinedExport);
      const blob = new Blob([contents], { type: format === "json" ? "application/json;charset=utf-8" : "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `myfive-data-export-${combinedExport.metadata.exportedAt.slice(0, 10)}.${format === "json" ? "json" : "md"}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "Your data export could not be created.");
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <div className="myfive-theme min-h-screen text-slate-100 flex flex-col">
      <header className="myfive-glass-strong border-b sticky top-0 z-50">
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
        <div className="myfive-glass myfive-biolume-edge p-6 rounded-2xl border space-y-4">
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
            <span className={`px-2.5 py-1 text-xs font-mono font-semibold border rounded-full flex items-center gap-1 ${isActive ? "bg-emerald-950 text-emerald-300 border-emerald-500/30" : "bg-slate-900 text-slate-400 border-slate-700"}`}>
              <Check className="w-3 h-3" /> {isEntitled ? `${subscription?.status === "eap" ? "Private EAP" : subscription?.status === "sponsored" ? "Sponsored" : "Active"} Access` : "Membership Inactive"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex justify-between">
              <span>Primary Membership Plan:</span>
              <span className="text-emerald-400 font-semibold">€4.99 / month {isActive ? "(Active via Stripe)" : ""}</span>
            </div>
            <div className="flex justify-between">
              <span>Partner Sponsored Seats Used:</span>
              <span className="text-slate-200">{subscription?.sponsoredSeatsAllocated ?? 0} of 5 Seats Allocated</span>
            </div>
            <div className="flex justify-between">
              <span>Partner Cost:</span>
              <span className="text-emerald-400">€0.00 (Covered by Primary Sponsor)</span>
            </div>
          </div>

          {!isEntitled && <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <input type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} placeholder="Email for Stripe receipt" className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            <button disabled={checkoutLoading || !subscription?.stripeConnected} onClick={startCheckout} className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-sm font-medium text-white rounded-lg flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> {checkoutLoading ? "Opening Stripe…" : "Subscribe securely"}
            </button>
          </div>}
          {!isEntitled && <div className="border-t border-slate-800 pt-4">
            <p className="mb-2 text-xs text-slate-400">Employee Assistance Programme vouchers activate private access. Your employer receives aggregate usage only.</p>
            <div className="flex flex-col gap-3 sm:flex-row"><input value={voucherCode} onChange={(event) => setVoucherCode(event.target.value)} placeholder="EAP voucher code" className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" /><button disabled={voucherLoading || !voucherCode.trim()} onClick={redeemVoucher} className="rounded-lg bg-cyan-900 px-4 py-2 text-sm text-cyan-100 disabled:opacity-40">{voucherLoading ? "Redeeming…" : "Redeem privately"}</button></div>
          </div>}
          {checkoutError && <p role="alert" className="text-xs text-rose-300">{checkoutError}</p>}
        </div>

        {/* GDPR Article 20 export and local-vault boundary */}
        <div className="myfive-glass myfive-biolume-edge p-6 rounded-2xl border space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">GDPR Article 20 Data Export</h2>
              <p className="text-xs text-slate-400">Portable account data plus this browser's encrypted local vault</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-4">
            <div className="space-y-1">
              <p className="font-semibold text-slate-200">Private data-subject copy</p>
              <p className="text-slate-500 leading-relaxed">The server exports only records scoped to your signed-in account. This browser then decrypts and combines its origin-bound check-ins locally; vault plaintext is never uploaded. Repeat on other browsers or devices that contain vault records.</p>
              <p className="text-amber-200/80 leading-relaxed">Downloaded files contain readable relationship and reflection data. Store them securely.</p>
            </div>
            <label className="flex items-start gap-2 rounded-lg border border-indigo-800/60 bg-indigo-950/30 p-3 text-xs leading-relaxed text-indigo-100">
              <input type="checkbox" checked={vaultOwnershipConfirmed} onChange={(event) => setVaultOwnershipConfirmed(event.target.checked)} className="mt-0.5" />
              <span>I confirm this browser profile's local MyFive vault belongs to me and may be decrypted into this private download. Legacy local records are browser-profile scoped and are not linked to my server account.</span>
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button disabled={exportingFormat !== null || !vaultOwnershipConfirmed} onClick={() => downloadDataExport("json")} className="flex-1 px-3 py-2 bg-indigo-900/70 hover:bg-indigo-800 disabled:opacity-40 text-indigo-100 rounded-lg transition-all flex items-center justify-center gap-2">
                <FileJson className="w-4 h-4" /> {exportingFormat === "json" ? "Preparing JSON…" : "Download portable JSON"}
              </button>
              <button disabled={exportingFormat !== null || !vaultOwnershipConfirmed} onClick={() => downloadDataExport("markdown")} className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg transition-all flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" /> {exportingFormat === "markdown" ? "Preparing Markdown…" : "Download readable Markdown"}
              </button>
            </div>
            {exportNotice && <p role="status" className="text-xs text-emerald-300">{exportNotice}</p>}
            {exportError && <p role="alert" className="text-xs text-rose-300">{exportError}</p>}
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
            <div className="space-y-3">
              <p className="text-xs leading-relaxed text-rose-200/80">This permanently deletes your account, billing identity, private records, and every shared workspace you own. Other users’ accounts remain intact, but agreements in your owned connections are removed. This cannot be undone.</p>
              <label className="block text-xs text-slate-300">Type <strong>DELETE MYFIVE</strong> to confirm
                <input value={deleteConfirmation} onChange={(event) => setDeleteConfirmation(event.target.value)} autoComplete="off" className="mt-2 w-full rounded-lg border border-rose-700/60 bg-slate-950 px-3 py-2 font-mono text-sm" />
              </label>
              <button
                disabled={deleting || deleteConfirmation !== "DELETE MYFIVE"}
                onClick={deleteAccount}
                className="w-full py-3 bg-rose-600/80 hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-40 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" /> {deleting ? "Permanently deleting…" : "Permanently delete MyFive account"}
              </button>
              {deleteError && <p role="alert" className="text-xs text-rose-300">{deleteError}</p>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
