import { useState } from "react";
import { Link } from "wouter";
import { HeartHandshake } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function InvitationPage() {
  const token = window.location.pathname.split("/").pop() ?? "";
  const [status, setStatus] = useState<"ready" | "accepting" | "accepted" | "error">("ready");
  const [slotId, setSlotId] = useState<string | null>(null);
  const [message, setMessage] = useState("Sign in with the invited email address, then accept your sponsored MyFive seat.");
  const accept = async () => {
    setStatus("accepting");
    try {
      const response = await apiRequest("POST", `/api/myfive/invitations/${encodeURIComponent(token)}/accept`);
      const result = await response.json() as { slotId: string };
      setSlotId(result.slotId);
      setStatus("accepted"); setMessage("Your sponsored connection seat is active. You will not be charged.");
    } catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "The invitation could not be accepted."); }
  };
  return <main className="myfive-theme min-h-screen px-4 py-24 text-slate-100"><section className="myfive-glass mx-auto max-w-lg rounded-3xl border p-8 text-center">
    <HeartHandshake className="mx-auto mb-4 h-12 w-12 text-cyan-300" />
    <h1 className="text-2xl font-bold">A MyFive connection awaits</h1><p className="mt-3 text-sm text-slate-400">{message}</p>
    {status === "ready" && <div className="mt-6 flex justify-center gap-3"><Link href="/portal/login"><span className="cursor-pointer rounded-xl border border-slate-700 px-4 py-2 text-sm">Sign in first</span></Link><button onClick={accept} className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold">Accept invitation</button></div>}
    {status === "error" && <button onClick={accept} className="mt-6 rounded-xl bg-slate-800 px-4 py-2 text-sm">Try again</button>}
    {status === "accepted" && <Link href={`/myfive/agreements?slot=${encodeURIComponent(slotId ?? "")}`}><span className="mt-6 inline-block cursor-pointer rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold">Open shared connection</span></Link>}
  </section></main>;
}
