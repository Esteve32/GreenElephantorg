import { useState } from "react";
import { Copy, FileText, Mail, Printer, CheckCircle2, Loader2, Table, Braces } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface ExportToolProps {
  userEmail?: string;
}

interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string | null;
  details: string | null;
  lens: string | null;
  date: string;
}

const EXPORT_OPTIONS = [
  { id: "clipboard", icon: Copy, label: "Copy to Clipboard", desc: "Copy your timeline summary as plain text" },
  { id: "text", icon: FileText, label: "Download as Text", desc: "Save a .txt file of your journey data" },
  { id: "csv", icon: Table, label: "Download as CSV", desc: "Spreadsheet-ready CSV with all event fields" },
  { id: "json", icon: Braces, label: "Download as JSON", desc: "Raw structured data for analysis" },
  { id: "print", icon: Printer, label: "Print / Save as PDF", desc: "Open print dialog for PDF export" },
  { id: "email", icon: Mail, label: "Email Backup", desc: "Send your data to your email address" },
];

function formatExportContent(events: TimelineEvent[]): string {
  const now = new Date().toLocaleDateString("en-GB", { dateStyle: "long" });
  const lines = [
    "GreenElephant.org — Communication Journey Export",
    `Generated: ${now}`,
    "=".repeat(50),
    "",
  ];

  if (events.length === 0) {
    lines.push(
      "No timeline events yet.",
      "",
      "As you use the portal tools (Debrief, Flow Check, Reflection, etc.),",
      "each interaction you save will appear here.",
    );
  } else {
    lines.push(`Total Events: ${events.length}`, "");
    events.forEach((ev, i) => {
      const date = new Date(ev.date).toLocaleDateString("en-GB", { dateStyle: "medium" });
      lines.push(`${i + 1}. [${date}] ${ev.title}`);
      if (ev.description) lines.push(`   ${ev.description}`);
      if (ev.lens) lines.push(`   Lens: ${ev.lens}`);
      if (ev.details) {
        lines.push(`   ---`);
        ev.details.split("\n").forEach((l) => lines.push(`   ${l}`));
      }
      lines.push("");
    });
  }

  lines.push("=".repeat(50));
  lines.push("Powered by GreenElephant.org — Conscious Communication");
  return lines.join("\n");
}

function formatCsv(events: TimelineEvent[]): string {
  const escape = (s: string | null) => {
    if (!s) return "";
    const escaped = s.replace(/"/g, '""').replace(/\n/g, " ");
    return `"${escaped}"`;
  };
  const header = "Date,Type,Title,Description,Lens,Details";
  const rows = events.map((ev) => {
    const date = new Date(ev.date).toISOString().slice(0, 10);
    return [date, escape(ev.type), escape(ev.title), escape(ev.description), escape(ev.lens), escape(ev.details)].join(",");
  });
  return [header, ...rows].join("\n");
}

function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ExportTool({ userEmail }: ExportToolProps) {
  const [completed, setCompleted] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: events = [], isLoading } = useQuery<TimelineEvent[]>({
    queryKey: ["/api/portal/timeline"],
  });

  const handleExport = async (optionId: string) => {
    if (optionId === "clipboard") {
      const content = formatExportContent(events);
      try {
        await navigator.clipboard.writeText(content);
        toast({ title: "Copied to clipboard" });
        setCompleted("clipboard");
      } catch (err: unknown) {
        console.error("Clipboard error:", err instanceof Error ? err.message : "Unknown error");
        toast({ title: "Copy failed", description: "Your browser blocked clipboard access.", variant: "destructive" });
      }
    } else if (optionId === "text") {
      const content = formatExportContent(events);
      downloadBlob(content, `greenelephant-journey-${new Date().toISOString().slice(0, 10)}.txt`, "text/plain");
      toast({ title: "File downloaded" });
      setCompleted("text");
    } else if (optionId === "csv") {
      const csv = formatCsv(events);
      downloadBlob(csv, `greenelephant-journey-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv");
      toast({ title: "CSV downloaded" });
      setCompleted("csv");
    } else if (optionId === "json") {
      const json = JSON.stringify(events, null, 2);
      downloadBlob(json, `greenelephant-journey-${new Date().toISOString().slice(0, 10)}.json`, "application/json");
      toast({ title: "JSON downloaded" });
      setCompleted("json");
    } else if (optionId === "print") {
      const content = formatExportContent(events);
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`<html><head><title>GreenElephant Journey Export</title><style>body{font-family:'Lato',sans-serif;max-width:700px;margin:40px auto;padding:20px;color:#222}h1{font-family:'Poppins',sans-serif;color:#009999}pre{white-space:pre-wrap;font-size:13px;line-height:1.6}</style></head><body><h1>Communication Journey</h1><pre>${content.replace(/</g, "&lt;")}</pre></body></html>`);
        printWindow.document.close();
        printWindow.print();
      }
      toast({ title: "Print dialog opened" });
      setCompleted("print");
    } else if (optionId === "email") {
      if (userEmail) {
        try {
          const res = await fetch("/api/portal/data-export/email", { method: "POST", credentials: "include" });
          if (res.ok) {
            toast({ title: "Export email sent", description: `Check your inbox at ${userEmail}` });
            setCompleted("email");
          } else {
            const data = await res.json().catch(() => ({ message: "Email service unavailable" }));
            toast({ title: "Email failed", description: data.message, variant: "destructive" });
          }
        } catch {
          toast({ title: "Email failed", description: "Could not reach the server.", variant: "destructive" });
        }
      } else {
        toast({ title: "No email found", description: "Log in to use email export.", variant: "destructive" });
      }
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-white/50">
        Export your communication journey data. {events.length > 0 ? `You have ${events.length} timeline event${events.length !== 1 ? "s" : ""}.` : "Start using tools to build your timeline."}
      </p>

      {isLoading && (
        <div className="flex items-center justify-center py-4 gap-2 text-white/30">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs">Loading timeline...</span>
        </div>
      )}

      {EXPORT_OPTIONS.map((option) => {
        const IconComp = option.icon;
        const isDone = completed === option.id;
        return (
          <button
            key={option.id}
            onClick={() => handleExport(option.id)}
            disabled={isLoading}
            className="w-full flex items-center gap-3 p-3.5 rounded-lg bg-white/[0.03] border border-white/5 text-left transition-colors hover:bg-white/[0.05] disabled:opacity-50"
            data-testid={`button-export-${option.id}`}
          >
            <div className="w-9 h-9 rounded-full bg-[#3b7dd8]/10 border border-[#3b7dd8]/20 flex items-center justify-center shrink-0">
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-[#33b864]" />
              ) : (
                <IconComp className="w-4 h-4 text-[#3b7dd8]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/70">{option.label}</p>
              <p className="text-xs text-white/30">{option.desc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
