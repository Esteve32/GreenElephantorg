import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  Database,
  Brain,
  LayoutDashboard,
  Mail,
  ExternalLink,
  Send,
  Users,
  User,
  FileText,
  BarChart3,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Copy,
  UserPlus,
  GitCompare,
  Sparkles,
  Info,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SiGooglesheets, SiGoogledocs, SiGoogleslides, SiGmail } from "react-icons/si";
import { AdminTooltip } from "@/components/AdminTooltip";

const RAW_DATA_URL = "https://docs.google.com/spreadsheets/d/15nV63jCMFGsKWZGzKRPT9WEVkY5MI8oDNR74q7u--gs/edit?gid=1074356820#gid=1074356820";
const BRAIN_URL = "https://docs.google.com/spreadsheets/d/11dKNeCJcKizW63dmFxggO1-D5K3wGLKZ8sMKRTZAKVo/edit?gid=1329389948#gid=1329389948";
const COACHING_DRIVE_URL = "https://drive.google.com/drive/folders/1eTwBI3jtGDNNBiaLD5_LOWFUzYghxBJw?usp=drive_link";
const GPT_URL = "https://chatgpt.com/g/g-A2D8HFqGl-conscious-communicator";

interface PipelineStep {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  productIcon?: any;
  color: string;
  borderColor: string;
  bgColor: string;
  description: string;
  sourceUrl?: string;
  sourceLabel?: string;
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: "raw",
    title: "RAW Data",
    subtitle: "Google Sheets",
    icon: Database,
    productIcon: SiGooglesheets,
    color: "text-[#0F9D58]",
    borderColor: "border-[#0F9D58]/30",
    bgColor: "bg-[#0F9D58]/10",
    description: "The source spreadsheet where all Satellite Scan responses land. Each row is one person's 129-question scan.",
    sourceUrl: RAW_DATA_URL,
    sourceLabel: "Open RAW Data Sheet",
  },
  {
    id: "brain",
    title: "BRAIN",
    subtitle: "Google Sheets",
    icon: Brain,
    productIcon: SiGooglesheets,
    color: "text-[#0F9D58]",
    borderColor: "border-[#0F9D58]/30",
    bgColor: "bg-[#0F9D58]/10",
    description: "The analysis spreadsheet that processes raw scan data and generates coaching insights, scores, and lens breakdowns.",
    sourceUrl: BRAIN_URL,
    sourceLabel: "Open BRAIN Sheet",
  },
  {
    id: "dashboard",
    title: "Dashboard",
    subtitle: "Google Slides",
    icon: LayoutDashboard,
    productIcon: SiGoogleslides,
    color: "text-[#F4B400]",
    borderColor: "border-[#F4B400]/30",
    bgColor: "bg-[#F4B400]/10",
    description: "A formatted coaching dashboard in Google Slides — ready to review, export as PDF, or share with the coachee.",
    sourceUrl: COACHING_DRIVE_URL,
    sourceLabel: "Open Coaching Drive",
  },
  {
    id: "deliver",
    title: "Deliver",
    subtitle: "Gmail",
    icon: Mail,
    productIcon: SiGmail,
    color: "text-[#EA4335]",
    borderColor: "border-[#EA4335]/30",
    bgColor: "bg-[#EA4335]/10",
    description: "Send the coaching document by email — raw data, doc link, or internal coach-only summary.",
  },
];

interface MenuAction {
  id: string;
  label: string;
  description: string;
  icon: any;
  pipelineSteps: string[];
  minRows: number;
  maxRows: number;
  color: string;
}

const MENU_ACTIONS: MenuAction[] = [
  {
    id: "create_raw_doc",
    label: "Create RAW DATA Google Doc",
    description: "Select a scan row and generate a formatted coaching document with AI analysis in Google Docs.",
    icon: FileText,
    pipelineSteps: ["raw", "dashboard"],
    minRows: 1,
    maxRows: 0,
    color: "text-[#0F9D58]",
  },
  {
    id: "send_to_brain",
    label: "Send to BRAIN",
    description: "Copy the selected row from RAW Data to the BRAIN sheet (MainData row 5) for analysis.",
    icon: Send,
    pipelineSteps: ["raw", "brain"],
    minRows: 1,
    maxRows: 1,
    color: "text-[#0F9D58]",
  },
  {
    id: "generate_dashboard",
    label: "Generate Dashboard",
    description: "Trigger the BRAIN to generate a full visual coaching dashboard in Google Slides.",
    icon: LayoutDashboard,
    pipelineSteps: ["brain", "dashboard"],
    minRows: 0,
    maxRows: 0,
    color: "text-[#F4B400]",
  },
  {
    id: "send_raw_data_email",
    label: "Send Raw Data Email",
    description: "Send the coachee an email with their raw scan data in a copy-paste-friendly HTML format — ready to drop into the GPT.",
    icon: FileText,
    pipelineSteps: ["raw", "deliver"],
    minRows: 1,
    maxRows: 0,
    color: "text-[#EA4335]",
  },
  {
    id: "send_doc_link_email",
    label: "Send Doc Link Email",
    description: "Send the coachee the Google Doc link with the report text embedded in the email body for easy reading and copy-paste.",
    icon: SiGoogledocs,
    pipelineSteps: ["dashboard", "deliver"],
    minRows: 0,
    maxRows: 0,
    color: "text-[#EA4335]",
  },
  {
    id: "coach_only_email",
    label: "Coach-Only Email",
    description: "Send an internal email to coaches (esteve@ and anu@) with scan data for review — the coachee is NOT notified.",
    icon: Users,
    pipelineSteps: ["raw", "deliver"],
    minRows: 1,
    maxRows: 0,
    color: "text-[#EA4335]",
  },
  {
    id: "compare_time",
    label: "Compare Over Time",
    description: "Select 2+ rows from the same person to track changes across multiple scans.",
    icon: GitCompare,
    pipelineSteps: ["raw", "brain", "dashboard"],
    minRows: 2,
    maxRows: 0,
    color: "text-[#3b7dd8]",
  },
  {
    id: "compare_partner",
    label: "Compare Partners",
    description: "Select exactly 2 rows from different people to analyze collaboration dynamics.",
    icon: Users,
    pipelineSteps: ["raw", "brain", "dashboard"],
    minRows: 2,
    maxRows: 2,
    color: "text-[#e85d75]",
  },
  {
    id: "compare_team",
    label: "Compare Team",
    description: "Select 3+ rows to analyze team dynamics, shared values, and communication patterns.",
    icon: Users,
    pipelineSteps: ["raw", "brain", "dashboard"],
    minRows: 3,
    maxRows: 0,
    color: "text-[#a3cc33]",
  },
];

function PipelineVisual() {
  return (
    <div className="relative mb-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {PIPELINE_STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="relative">
              <Card
                className={`${step.borderColor} bg-black/30 backdrop-blur-sm h-full`}
                data-testid={`card-pipeline-${step.id}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${step.bgColor} relative`}
                    >
                      <Icon className={`w-5 h-5 ${step.color}`} />
                      {step.productIcon && (
                        <step.productIcon className={`w-3 h-3 ${step.color} absolute -bottom-0.5 -right-0.5`} />
                      )}
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold ${step.color}`}>{step.title}</h3>
                      <p className="text-xs text-white/40">{step.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed mb-3">
                    {step.description}
                  </p>
                  {step.sourceUrl && (
                    <a
                      href={step.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
                      data-testid={`link-source-${step.id}`}
                    >
                      {step.productIcon ? <step.productIcon className="w-3 h-3" /> : <SiGooglesheets className="w-3 h-3" />}
                      {step.sourceLabel}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </CardContent>
              </Card>

              {i < PIPELINE_STEPS.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-5 h-5 text-white/20" />
                </div>
              )}
              {i < PIPELINE_STEPS.length - 1 && (
                <div className="flex md:hidden justify-center py-1">
                  <ChevronDown className="w-4 h-4 text-white/20" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActionCard({ action, onRun }: { action: MenuAction; onRun: (id: string) => void }) {
  const Icon = action.icon;
  const rowReq =
    action.minRows === 0
      ? "No selection needed"
      : action.maxRows === action.minRows && action.maxRows > 0
      ? `Exactly ${action.minRows} row${action.minRows > 1 ? "s" : ""}`
      : action.maxRows === 0
      ? `${action.minRows}+ rows`
      : `${action.minRows}-${action.maxRows} rows`;

  return (
    <Card
      className="bg-white/[0.03] border-white/[0.08] hover:border-white/20 transition-all"
      data-testid={`card-action-${action.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
            <Icon className={`w-4 h-4 ${action.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="text-sm font-semibold text-white">{action.label}</h4>
              <Badge className="text-xs bg-white/5 text-white/30 border-white/10">
                {rowReq}
              </Badge>
            </div>
            <p className="text-xs text-white/40 leading-relaxed mb-3">
              {action.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                {action.pipelineSteps.map((stepId, i) => {
                  const step = PIPELINE_STEPS.find((s) => s.id === stepId);
                  if (!step) return null;
                  return (
                    <span key={stepId} className="flex items-center gap-0.5">
                      <span
                        className={`text-xs font-medium px-1.5 py-0.5 rounded ${step.bgColor} ${step.color}`}
                      >
                        {step.title}
                      </span>
                      {i < action.pipelineSteps.length - 1 && (
                        <ArrowRight className="w-2.5 h-2.5 text-white/20" />
                      )}
                    </span>
                  );
                })}
              </div>
              {DELIVER_ACTION_IDS.includes(action.id) ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-auto text-xs border-[#EA4335]/30 text-[#EA4335]/80"
                  onClick={() => onRun(action.id)}
                  data-testid={`button-run-${action.id}`}
                >
                  <SiGmail className="w-3 h-3 mr-1" />
                  Send Email
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-auto text-xs border-white/10 text-white/50"
                  onClick={() => onRun(action.id)}
                  data-testid={`button-run-${action.id}`}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Run in Sheet
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickLinks() {
  const links = [
    {
      label: "RAW Data Sheet",
      url: RAW_DATA_URL,
      icon: SiGooglesheets,
      color: "text-[#0F9D58]",
    },
    {
      label: "BRAIN Sheet",
      url: BRAIN_URL,
      icon: SiGooglesheets,
      color: "text-[#0F9D58]",
    },
    {
      label: "Coaching Drive",
      url: COACHING_DRIVE_URL,
      icon: SiGoogleslides,
      color: "text-[#F4B400]",
    },
    {
      label: "Conscious Communicator GPT",
      url: GPT_URL,
      icon: Sparkles,
      color: "text-[#0F9D58]",
    },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.08] text-xs text-white/50 hover:text-white/80 hover:border-white/20 transition-all"
            data-testid={`link-quick-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <Icon className={`w-3.5 h-3.5 ${link.color}`} />
            {link.label}
            <ExternalLink className="w-2.5 h-2.5 text-white/20" />
          </a>
        );
      })}
    </div>
  );
}

function WorkflowDiagram() {
  return (
    <Card className="bg-white/[0.02] border-white/[0.06] mb-8" data-testid="card-workflow-diagram">
      <CardContent className="p-6">
        <h3
          className="text-base font-semibold text-white mb-4"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          How It Works
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#0F9D58]/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-[#0F9D58]">1</span>
            </div>
            <div>
              <p className="text-sm text-white/70 font-medium">Coachee completes Satellite Scan</p>
              <p className="text-xs text-white/30">
                129 questions land in the RAW Data spreadsheet as a new row.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#0F9D58]/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-[#0F9D58]">2</span>
            </div>
            <div>
              <p className="text-sm text-white/70 font-medium">Select row and send to BRAIN</p>
              <p className="text-xs text-white/30">
                The selected row is copied to MainData row 5 in the BRAIN sheet for processing.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#F4B400]/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-[#F4B400]">3</span>
            </div>
            <div>
              <p className="text-sm text-white/70 font-medium">Generate dashboard in Google Slides</p>
              <p className="text-xs text-white/30">
                The BRAIN processes the data and creates a formatted coaching dashboard in Google Slides.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#EA4335]/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-[#EA4335]">4</span>
            </div>
            <div>
              <p className="text-sm text-white/70 font-medium">Review and deliver via Gmail</p>
              <p className="text-xs text-white/30">
                Coach reviews the dashboard, then delivers by email: raw data, doc link, or coach-only internal.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const DELIVER_ACTION_IDS = ["send_raw_data_email", "send_doc_link_email", "coach_only_email"];

type DeliverMode = "send_raw_data_email" | "send_doc_link_email" | "coach_only_email";

const DELIVER_CONFIG: Record<DeliverMode, { endpoint: string; title: string; description: string; fields: string[] }> = {
  send_raw_data_email: {
    endpoint: "/api/admin/coaching/send-raw-data-email",
    title: "Send Raw Data Email",
    description: "Sends the coachee their raw scan data in a copy-paste-friendly HTML table. Paste the raw data from the Google Sheet below.",
    fields: ["coacheeEmail", "coacheeName", "rawData"],
  },
  send_doc_link_email: {
    endpoint: "/api/admin/coaching/send-doc-link-email",
    title: "Send Doc Link Email",
    description: "Sends the coachee the Google Doc/Slides link with the report text embedded in the email body.",
    fields: ["coacheeEmail", "coacheeName", "docUrl", "reportText"],
  },
  coach_only_email: {
    endpoint: "/api/admin/coaching/send-coach-only-email",
    title: "Coach-Only Internal Email",
    description: "Sends an internal email to esteve@ and anu@ with the scan data. The coachee is NOT notified.",
    fields: ["coacheeName", "rawData", "notes"],
  },
};

function DeliverDialog({ mode, open, onOpenChange }: { mode: DeliverMode | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const [coacheeEmail, setCoacheeEmail] = useState("");
  const [coacheeName, setCoacheeName] = useState("");
  const [rawData, setRawData] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [reportText, setReportText] = useState("");
  const [notes, setNotes] = useState("");

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!mode) return;
      const config = DELIVER_CONFIG[mode];

      let body: Record<string, any> = {};
      if (mode === "send_raw_data_email") {
        const parsed = parseRawDataText(rawData);
        body = { coacheeEmail, coacheeName: coacheeName || null, rawData: parsed };
      } else if (mode === "send_doc_link_email") {
        body = { coacheeEmail, coacheeName: coacheeName || null, docUrl, reportText };
      } else if (mode === "coach_only_email") {
        const parsed = parseRawDataText(rawData);
        body = { coacheeName: coacheeName || null, rawData: parsed, notes };
      }

      const res = await apiRequest("POST", config.endpoint, body);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Email sent", description: DELIVER_CONFIG[mode!].title + " was sent successfully." });
      onOpenChange(false);
      setCoacheeEmail(""); setCoacheeName(""); setRawData(""); setDocUrl(""); setReportText(""); setNotes("");
    },
    onError: (err: any) => {
      toast({ title: "Failed to send", description: err.message || "Something went wrong.", variant: "destructive" });
    },
  });

  if (!mode) return null;
  const config = DELIVER_CONFIG[mode];
  const needsCoacheeEmail = config.fields.includes("coacheeEmail");
  const needsRawData = config.fields.includes("rawData");
  const needsDocUrl = config.fields.includes("docUrl");
  const needsReportText = config.fields.includes("reportText");
  const needsNotes = config.fields.includes("notes");

  const canSend = mode === "coach_only_email"
    ? rawData.trim().length > 0
    : coacheeEmail.includes("@") && (needsRawData ? rawData.trim().length > 0 : docUrl.trim().length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-[#0a0a14] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <SiGmail className="w-4 h-4 text-[#EA4335]" />
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-white/50 text-xs">
            {config.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {needsCoacheeEmail && (
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Coachee Email *</Label>
              <Input
                value={coacheeEmail}
                onChange={(e) => setCoacheeEmail(e.target.value)}
                placeholder="coachee@example.com"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                data-testid="input-coachee-email"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-white/60 text-xs">Coachee Name</Label>
            <Input
              value={coacheeName}
              onChange={(e) => setCoacheeName(e.target.value)}
              placeholder="First Last"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
              data-testid="input-coachee-name"
            />
          </div>
          {needsRawData && (
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Raw Data (paste from sheet — one "Question: Answer" per line) *</Label>
              <textarea
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
                rows={6}
                placeholder={"Question 1: Answer 1\nQuestion 2: Answer 2\n..."}
                className="w-full rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-xs font-mono p-3 resize-y focus:outline-none focus:ring-1 focus:ring-[#EA4335]/50"
                data-testid="input-raw-data"
              />
            </div>
          )}
          {needsDocUrl && (
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Google Doc/Slides URL *</Label>
              <Input
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
                placeholder="https://docs.google.com/..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                data-testid="input-doc-url"
              />
            </div>
          )}
          {needsReportText && (
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Report Text (embedded in email body)</Label>
              <textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                rows={4}
                placeholder="Paste the report summary text here..."
                className="w-full rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-xs p-3 resize-y focus:outline-none focus:ring-1 focus:ring-[#EA4335]/50"
                data-testid="input-report-text"
              />
            </div>
          )}
          {needsNotes && (
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Coach Notes (optional)</Label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Internal notes for the coaching team..."
                className="w-full rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-xs p-3 resize-y focus:outline-none focus:ring-1 focus:ring-[#EA4335]/50"
                data-testid="input-notes"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="border-white/10 text-white/50" data-testid="button-cancel-deliver">
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!canSend || sendMutation.isPending}
            onClick={() => sendMutation.mutate()}
            className="bg-[#EA4335] text-white border-[#EA4335]"
            data-testid="button-send-deliver"
          >
            {sendMutation.isPending && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
            <SiGmail className="w-3 h-3 mr-1" />
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function parseRawDataText(text: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = text.split("\n").filter((l) => l.trim());
  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.substring(0, colonIdx).trim();
      const value = line.substring(colonIdx + 1).trim();
      if (key) result[key] = value;
    } else {
      result[line.trim()] = "";
    }
  }
  return result;
}

export default function CoachingCockpit() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [deliverDialogMode, setDeliverDialogMode] = useState<DeliverMode | null>(null);
  const [deliverDialogOpen, setDeliverDialogOpen] = useState(false);

  const { data: adminCheck } = useQuery<{ isAuthenticated: boolean }>({
    queryKey: ["/api/admin/check"],
  });

  if (adminCheck && !adminCheck.isAuthenticated) {
    setLocation("/admin/login");
    return null;
  }

  const handleRunAction = (actionId: string) => {
    if (DELIVER_ACTION_IDS.includes(actionId)) {
      setDeliverDialogMode(actionId as DeliverMode);
      setDeliverDialogOpen(true);
      return;
    }

    const action = MENU_ACTIONS.find((a) => a.id === actionId);
    if (!action) return;

    let targetUrl = RAW_DATA_URL;
    if (actionId === "generate_dashboard") {
      targetUrl = BRAIN_URL;
    }

    toast({
      title: `Opening ${action.label}`,
      description: "The Google Sheet will open. Use the Green Elephant menu to run this action.",
    });

    window.open(targetUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#040410] to-black">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/40"
                onClick={() => setLocation("/admin/submissions")}
                data-testid="button-back-admin"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Admin
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Back to Admin OS dashboard</TooltipContent>
          </Tooltip>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1
                className="text-2xl md:text-3xl font-bold text-white"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Coaching Cockpit
              </h1>
              <AdminTooltip
                what="Visual control panel for the Satellite Scan coaching workflow. Each button mirrors an action from the Google Sheets menu system — no need to hunt through spreadsheets."
                how="Best practice: Follow the pipeline left to right. First create a RAW DATA doc, then Send to BRAIN, then Generate Dashboard, then Deliver via Gmail. Always review the dashboard before sending to the client."
                debug={[
                  { label: "RAW Data Sheet", href: RAW_DATA_URL },
                  { label: "BRAIN Sheet", href: BRAIN_URL },
                  { label: "Coaching Drive", href: COACHING_DRIVE_URL },
                ]}
              />
            </div>
            <p className="text-sm text-white/40 mt-1">
              Your visual pipeline for coaching data — from scan to delivery
            </p>
          </div>
        </div>

        <PipelineVisual />

        <WorkflowDiagram />

        <div className="mb-6">
          <h2
            className="text-lg font-semibold text-white mb-1"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Actions
          </h2>
          <p className="text-xs text-white/40 mb-4">
            Sheet actions open Google Sheets where you run them via the{" "}
            <span className="text-[#0F9D58]">Green Elephant Coaching</span> menu.
            Deliver actions send emails directly from here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {MENU_ACTIONS.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              onRun={handleRunAction}
            />
          ))}
        </div>

        <div className="mb-6">
          <h2
            className="text-lg font-semibold text-white mb-3"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Quick Links
          </h2>
          <QuickLinks />
        </div>

        <Card className="bg-white/[0.02] border-white/[0.06] mt-10" data-testid="card-menu-reference">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-white/30" />
              <h3 className="text-sm font-medium text-white/60">
                Google Sheets Menu Reference
              </h3>
            </div>
            <p className="text-xs text-white/30 leading-relaxed mb-3">
              All these actions are also available directly inside the RAW Data
              spreadsheet under the{" "}
              <span className="text-[#0F9D58] font-medium">
                Green Elephant Coaching
              </span>{" "}
              custom menu. The buttons above are shortcuts that open the
              correct sheet for each action.
            </p>
            <div className="text-xs text-white/20 font-mono">
              Menu: Create RAW DATA Doc / Send to Brain / Send Raw Data Email /
              Send Doc Link Email / Coach-Only Email / Compare Time / Compare Partners / Compare Team
            </div>
          </CardContent>
        </Card>
      </div>

      <DeliverDialog
        mode={deliverDialogMode}
        open={deliverDialogOpen}
        onOpenChange={setDeliverDialogOpen}
      />
    </div>
  );
}
