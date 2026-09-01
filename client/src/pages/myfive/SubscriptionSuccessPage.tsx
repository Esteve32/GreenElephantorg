import { useEffect, useState } from "react";
import { Link } from "wouter";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function SubscriptionSuccessPage() {
  const [status, setStatus] = useState<"loading" | "active" | "error">("loading");
  const [message, setMessage] = useState("Confirming your membership with Stripe…");

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) { setStatus("error"); setMessage("The Checkout Session reference is missing."); return; }
    apiRequest("POST", "/api/myfive/subscription/confirm", { sessionId })
      .then(() => { setStatus("active"); setMessage("Your MyFive membership is active."); })
      .catch((error: Error) => { setStatus("error"); setMessage(error.message); });
  }, []);

  return <main className="myfive-theme min-h-screen px-4 py-24 text-slate-100">
    <section className="myfive-glass mx-auto max-w-lg rounded-3xl border p-8 text-center">
      {status === "loading" ? <LoaderCircle className="mx-auto mb-4 h-12 w-12 animate-spin text-cyan-300" /> : <CheckCircle2 className={`mx-auto mb-4 h-12 w-12 ${status === "active" ? "text-emerald-400" : "text-rose-400"}`} />}
      <h1 className="text-2xl font-bold">{status === "active" ? "Welcome to MyFive" : status === "error" ? "Confirmation needs attention" : "Confirming membership"}</h1>
      <p className="mt-3 text-sm text-slate-400">{message}</p>
      <Link href={status === "active" ? "/myfive/dashboard" : "/myfive/settings"}><span className="mt-6 inline-block cursor-pointer rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white">{status === "active" ? "Open MyFive" : "Return to settings"}</span></Link>
    </section>
  </main>;
}
