import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Target, Mail, Zap, Brain, Radio, MessageSquare,
  CheckCircle2, AlertCircle, Clock, ShieldCheck, ArrowRight, ArrowLeft,
  ChevronDown, ChevronUp, FlaskConical, BarChart3, Send, Info,
  Shield, Globe, Lock, BookOpen, AlertTriangle, Users, ExternalLink,
  Lightbulb, Calendar
} from "lucide-react";
import { format } from "date-fns";

type EmailType = "transactional" | "marketing" | "admin" | "onboarding";
type TemplateType = "dark-hud" | "plain";

interface JourneyEmail {
  name: string;
  fn: string;
  subject: string;
  type: EmailType;
  delay: string;
  gdpr: boolean;
  template: TemplateType;
}

interface Journey {
  id: string;
  name: string;
  triggerEvent: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  emails: JourneyEmail[];
}

const TYPE_COLORS: Record<EmailType, string> = {
  transactional: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  marketing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  admin: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  onboarding: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const JOURNEYS: Journey[] = [
  {
    id: "satellite-scan",
    name: "Satellite Scan Purchase",
    triggerEvent: "User submits email + Stripe payment confirmed",
    icon: Target,
    color: "#009999",
    emails: [
      { name: "Email verification", fn: "sendVerificationEmail", subject: "Your verification code — GreenElephant", type: "transactional", delay: "Immediate", gdpr: true, template: "dark-hud" },
      { name: "Purchase confirmation", fn: "sendSatellitescanPurchaseEmail", subject: "Your Satellite Scan is confirmed — GreenElephant", type: "transactional", delay: "Immediate", gdpr: true, template: "dark-hud" },
      { name: "Admin notification", fn: "sendPurchaseNotification", subject: "[GE Admin] New Scan Purchase", type: "admin", delay: "Immediate", gdpr: false, template: "plain" },
      { name: "72h scan reminder", fn: "sendSatellitescanReminderEmail", subject: "Your Satellite Scan is still waiting for you", type: "transactional", delay: "72h if no Typeform", gdpr: true, template: "dark-hud" },
      { name: "Typeform completion", fn: "sendTypeformScanCompletionEmail", subject: "Your Satellite Scan Data is Ready", type: "transactional", delay: "On Typeform webhook", gdpr: true, template: "dark-hud" },
      { name: "Onboarding emails 1–12", fn: "sendOnboardingEmail", subject: "12-part Fibonacci sequence", type: "onboarding", delay: "1, 1, 2, 3, 5, 8, 13… days post-purchase", gdpr: true, template: "dark-hud" },
    ],
  },
  {
    id: "newsletter",
    name: "Newsletter Subscription",
    triggerEvent: "User submits newsletter sign-up form with opt-in consent",
    icon: Mail,
    color: "#8b5cf6",
    emails: [
      { name: "Newsletter welcome", fn: "sendNewsletterConfirmationEmail", subject: "Welcome to the GreenElephant community", type: "marketing", delay: "Immediate", gdpr: true, template: "dark-hud" },
    ],
  },
  {
    id: "flow-check",
    name: "Check-my-FLOW",
    triggerEvent: "User completes the 3-question flow assessment on /flow-check",
    icon: Zap,
    color: "#f59e0b",
    emails: [
      { name: "Flow zone results", fn: "sendFlowCheckResultEmail", subject: "Your Flow Zone Results — GreenElephant", type: "transactional", delay: "Immediate", gdpr: true, template: "dark-hud" },
      { name: "Admin notification", fn: "sendFlowCheckAdminNotification", subject: "[GE Admin] New Flow Check Submission", type: "admin", delay: "Immediate", gdpr: false, template: "plain" },
    ],
  },
  {
    id: "signals-quiz",
    name: "Signals Quiz",
    triggerEvent: "User completes the Drift Signals quiz on /signals",
    icon: Brain,
    color: "#10b981",
    emails: [
      { name: "Quiz results", fn: "sendQuizResultsEmail", subject: "Your Communication Drift Signals — GreenElephant", type: "transactional", delay: "Immediate", gdpr: true, template: "dark-hud" },
    ],
  },
  {
    id: "webinar-waitlist",
    name: "Webinar Waitlist",
    triggerEvent: "User joins webinar waitlist or requests replay access",
    icon: Radio,
    color: "#3b82f6",
    emails: [
      { name: "Waitlist confirmation", fn: "sendWebinarWaitlistConfirmation", subject: "You're on the list — GreenElephant Lens Webinar", type: "transactional", delay: "Immediate", gdpr: true, template: "dark-hud" },
      { name: "Replay access", fn: "sendWebinarReplayConfirmationEmail", subject: "Your webinar replay is ready — GreenElephant", type: "transactional", delay: "On request", gdpr: true, template: "dark-hud" },
    ],
  },
  {
    id: "contact-form",
    name: "Contact Form",
    triggerEvent: "User submits the contact/connect form on /connect",
    icon: MessageSquare,
    color: "#ef4444",
    emails: [
      { name: "Auto-reply + admin notification", fn: "sendContactFormEmails", subject: "Thanks for reaching out — GreenElephant", type: "transactional", delay: "Immediate", gdpr: true, template: "dark-hud" },
    ],
  },
];

const ALL_EMAILS = [
  { fn: "sendVerificationEmail", journey: "Satellite Scan", type: "transactional" as EmailType, audience: "Customer", template: "dark-hud" as TemplateType, gdpr: true },
  { fn: "sendSatellitescanPurchaseEmail", journey: "Satellite Scan", type: "transactional" as EmailType, audience: "Customer", template: "dark-hud" as TemplateType, gdpr: true },
  { fn: "sendPurchaseNotification", journey: "Satellite Scan", type: "admin" as EmailType, audience: "esteve@", template: "plain" as TemplateType, gdpr: false },
  { fn: "sendSatellitescanReminderEmail", journey: "Satellite Scan", type: "transactional" as EmailType, audience: "Customer", template: "dark-hud" as TemplateType, gdpr: true },
  { fn: "sendTypeformScanCompletionEmail", journey: "Satellite Scan", type: "transactional" as EmailType, audience: "Customer", template: "dark-hud" as TemplateType, gdpr: true },
  { fn: "sendOnboardingEmail", journey: "Satellite Scan", type: "onboarding" as EmailType, audience: "Customer", template: "dark-hud" as TemplateType, gdpr: true },
  { fn: "sendNewsletterConfirmationEmail", journey: "Newsletter", type: "marketing" as EmailType, audience: "Subscriber", template: "dark-hud" as TemplateType, gdpr: true },
  { fn: "sendFlowCheckResultEmail", journey: "Flow Check", type: "transactional" as EmailType, audience: "User", template: "dark-hud" as TemplateType, gdpr: true },
  { fn: "sendFlowCheckAdminNotification", journey: "Flow Check", type: "admin" as EmailType, audience: "esteve@", template: "plain" as TemplateType, gdpr: false },
  { fn: "sendQuizResultsEmail", journey: "Signals Quiz", type: "transactional" as EmailType, audience: "User", template: "dark-hud" as TemplateType, gdpr: true },
  { fn: "sendWebinarWaitlistConfirmation", journey: "Webinar", type: "transactional" as EmailType, audience: "Registrant", template: "dark-hud" as TemplateType, gdpr: true },
  { fn: "sendWebinarReplayConfirmationEmail", journey: "Webinar", type: "transactional" as EmailType, audience: "Registrant", template: "dark-hud" as TemplateType, gdpr: true },
  { fn: "sendContactFormEmails", journey: "Contact Form", type: "transactional" as EmailType, audience: "Visitor + esteve@", template: "dark-hud" as TemplateType, gdpr: true },
  { fn: "sendScanInterestConfirmationEmail", journey: "Scan Interest", type: "transactional" as EmailType, audience: "Prospect", template: "dark-hud" as TemplateType, gdpr: true },
  { fn: "sendScanInterestAdminNotification", journey: "Scan Interest", type: "admin" as EmailType, audience: "esteve@", template: "plain" as TemplateType, gdpr: false },
  { fn: "sendWaitlistConfirmationEmail", journey: "Waitlist", type: "transactional" as EmailType, audience: "Prospect", template: "dark-hud" as TemplateType, gdpr: true },
];

const CHANNEL_OPTIONS = ['Newsletter', 'Purchase', 'Quiz', 'Webinar', 'Waitlist'];

const DELIVERABILITY_TOPICS = [
  {
    id: "spf",
    title: "SPF (Sender Policy Framework)",
    icon: Shield,
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bgColor: "bg-blue-500/10",
    summary: "SPF tells receiving mail servers which IP addresses are authorized to send email on behalf of your domain.",
    details: [
      "SPF is a DNS TXT record that lists all servers/IPs allowed to send email for your domain.",
      "Without SPF, any server can claim to send from your domain — which spam filters punish.",
      "Resend automatically handles SPF when you verify your domain with them.",
      "To check: run 'dig TXT yourdomain.com' and look for 'v=spf1 include:...' entries.",
      "Keep your SPF record under 10 DNS lookups — exceeding this causes SPF to fail silently.",
    ],
    action: "Check your SPF record at mxtoolbox.com/spf.aspx",
    actionUrl: "https://mxtoolbox.com/spf.aspx",
  },
  {
    id: "dkim",
    title: "DKIM (DomainKeys Identified Mail)",
    icon: Lock,
    color: "text-green-400",
    borderColor: "border-green-500/30",
    bgColor: "bg-green-500/10",
    summary: "DKIM adds a digital signature to your emails proving they haven't been tampered with in transit.",
    details: [
      "DKIM uses public-key cryptography: you publish a public key in DNS, and your mail server signs messages with the private key.",
      "Receiving servers verify the signature — if it matches, the email is trusted.",
      "Resend provides DKIM keys when you set up your sending domain. You add CNAME records to your DNS.",
      "DKIM alignment matters: the 'd=' domain in the signature must match your From address domain.",
      "Without DKIM, your emails are more likely to land in spam — especially for Gmail and Outlook recipients.",
    ],
    action: "Verify your DKIM at mail-tester.com",
    actionUrl: "https://www.mail-tester.com/",
  },
  {
    id: "dmarc",
    title: "DMARC (Domain-based Message Authentication)",
    icon: ShieldCheck,
    color: "text-purple-400",
    borderColor: "border-purple-500/30",
    bgColor: "bg-purple-500/10",
    summary: "DMARC ties SPF and DKIM together, telling receivers what to do when authentication fails.",
    details: [
      "DMARC is a DNS TXT record at _dmarc.yourdomain.com that defines your email authentication policy.",
      "Policies: 'none' (monitor only), 'quarantine' (send to spam), 'reject' (block entirely).",
      "Start with p=none to monitor, then move to p=quarantine, and eventually p=reject.",
      "DMARC requires either SPF or DKIM to pass AND align with your From domain.",
      "Add 'rua=mailto:...' to get aggregate reports showing who is sending email as your domain.",
      "Example record: v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@yourdomain.com",
    ],
    action: "Check your DMARC at dmarcian.com/dmarc-inspector",
    actionUrl: "https://dmarcian.com/dmarc-inspector/",
  },
  {
    id: "warmup",
    title: "Domain & IP Warm-up",
    icon: Zap,
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-500/10",
    summary: "New sending domains need to build reputation gradually — blasting 500 emails on day one triggers spam filters.",
    details: [
      "Week 1: Send 10-20 emails/day to your most engaged contacts (people who reply to you).",
      "Week 2: Increase to 50-100/day. Monitor bounce rates and spam complaints.",
      "Week 3-4: Gradually increase to your target volume. Watch for deliverability dips.",
      "Resend has built-in sending limits — respect them. They protect your reputation.",
      "Replies and engagement boost your sender reputation. Encourage recipients to reply.",
      "If you see bounce rates above 5% or spam complaints above 0.1%, slow down immediately.",
    ],
  },
  {
    id: "content",
    title: "Content Best Practices",
    icon: Lightbulb,
    color: "text-teal-400",
    borderColor: "border-teal-500/30",
    bgColor: "bg-teal-500/10",
    summary: "What you say and how you format it directly impacts whether your email reaches the inbox or spam folder.",
    details: [
      "Avoid spam trigger words: 'FREE!!!', 'Act now', 'Limited time', 'Click here', excessive caps/exclamation marks.",
      "Keep your text-to-HTML ratio balanced — don't send image-only emails with no text.",
      "Always include a plain-text version alongside HTML (Resend handles this).",
      "Personalize emails with the recipient's name — it improves engagement and deliverability.",
      "Include a clear unsubscribe link in every marketing email (GDPR and CAN-SPAM requirement).",
      "Keep subject lines under 60 characters. Avoid RE: or FW: tricks.",
      "Test your email content at mail-tester.com before sending to your full list.",
    ],
    action: "Test your email score at mail-tester.com",
    actionUrl: "https://www.mail-tester.com/",
  },
  {
    id: "testing",
    title: "Testing Your Deliverability",
    icon: FlaskConical,
    color: "text-rose-400",
    borderColor: "border-rose-500/30",
    bgColor: "bg-rose-500/10",
    summary: "Always test before sending to your full list. A single batch send to a dirty list can damage your reputation for weeks.",
    details: [
      "Step 1: Send a test email to yourself first (Gmail, Outlook, Yahoo — test all three).",
      "Step 2: Check mail-tester.com — aim for a score of 9/10 or higher.",
      "Step 3: Send to a small segment (5-10 contacts) and verify delivery.",
      "Step 4: Check your Resend dashboard for bounce rates and delivery status.",
      "Step 5: Only after successful small-batch testing, send to your full list.",
      "If emails land in spam: check SPF/DKIM/DMARC, review content for spam triggers, and slow your sending rate.",
      "Keep a clean list: remove bounced emails promptly. Hard bounces damage your sender score.",
    ],
  },
];

function TypeBadge({ type }: { type: EmailType }) {
  return (
    <Badge className={`text-xs ${TYPE_COLORS[type]}`}>
      {type}
    </Badge>
  );
}

function TemplateBadge({ template }: { template: TemplateType }) {
  if (template === "dark-hud") {
    return <Badge className="text-xs bg-teal-900/40 text-teal-400 border-teal-700/40">dark HUD</Badge>;
  }
  return <Badge className="text-xs bg-white/10 text-white/50 border-white/20">plain</Badge>;
}

function JourneyCard({ journey, onTest }: { journey: Journey; onTest: (journeyId: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${journey.color}20`, border: `1px solid ${journey.color}40` }}
            >
              <journey.icon className="w-5 h-5" style={{ color: journey.color }} />
            </div>
            <div>
              <CardTitle className="text-white text-base">{journey.name}</CardTitle>
              <p className="text-xs text-white/50 mt-0.5">{journey.emails.length} email{journey.emails.length !== 1 ? "s" : ""} in sequence</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onTest(journey.id)}
              className="border-white/20 text-white/70 text-xs"
              data-testid={`button-test-journey-${journey.id}`}
            >
              <FlaskConical className="w-3 h-3 mr-1" />
              Send test
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setOpen(!open)}
              data-testid={`button-toggle-journey-${journey.id}`}
            >
              {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: journey.color }} />
          <p className="text-xs text-white/40">Trigger: {journey.triggerEvent}</p>
        </div>
      </CardHeader>

      {open && (
        <CardContent className="pt-0">
          <div className="border-t border-white/10 pt-4 space-y-3">
            {journey.emails.map((email, i) => (
              <div key={email.fn} className="flex items-start gap-3">
                <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/50 font-mono">
                    {i + 1}
                  </div>
                  {i < journey.emails.length - 1 && (
                    <div className="w-px h-6 bg-white/10 absolute mt-6" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm text-white font-medium">{email.name}</span>
                    <TypeBadge type={email.type} />
                    <TemplateBadge template={email.template} />
                    {email.gdpr && (
                      <Badge className="text-xs bg-green-900/30 text-green-400 border-green-700/30">
                        <ShieldCheck className="w-2.5 h-2.5 mr-1" />
                        GDPR
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-white/50 font-mono truncate">{email.subject}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-white/30" />
                    <span className="text-xs text-white/30">{email.delay}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function DeliverabilityCard({ topic }: { topic: typeof DELIVERABILITY_TOPICS[number] }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = topic.icon;

  return (
    <Card className={`${topic.bgColor} ${topic.borderColor} border`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <Icon className={`w-5 h-5 ${topic.color} shrink-0`} />
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p className="text-xs">{topic.summary}</p>
              </TooltipContent>
            </Tooltip>
            <div>
              <CardTitle className="text-white text-sm">{topic.title}</CardTitle>
              <p className="text-xs text-white/60 mt-1">{topic.summary}</p>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setExpanded(!expanded)}
            data-testid={`button-expand-${topic.id}`}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0">
          <div className="border-t border-white/10 pt-3 space-y-2">
            {topic.details.map((detail, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-1.5 shrink-0" />
                <p className="text-xs text-white/70 leading-relaxed">{detail}</p>
              </div>
            ))}
            {topic.action && topic.actionUrl && (
              <a
                href={topic.actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-teal-400 hover:text-teal-300"
                data-testid={`link-${topic.id}-action`}
              >
                <ExternalLink className="w-3 h-3" />
                {topic.action}
              </a>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function BatchEmailSection() {
  const { toast } = useToast();
  const [batchIncludeChannels, setBatchIncludeChannels] = useState<string[]>([]);
  const [batchExcludeChannels, setBatchExcludeChannels] = useState<string[]>([]);
  const [batchPreview, setBatchPreview] = useState<{ count: number; contacts: any[] } | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchSending, setBatchSending] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<{ subject: string; body: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { data: authStatus } = useQuery<{ isAuthenticated: boolean }>({
    queryKey: ['/api/admin/check'],
  });
  const isAuthenticated = authStatus?.isAuthenticated ?? false;

  const { data: batchHistoryData, refetch: refetchBatchHistory } = useQuery<any[]>({
    queryKey: ['/api/admin/batch-email/history'],
    enabled: isAuthenticated,
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' HH:mm");
    } catch {
      return dateString;
    }
  };

  const handleBatchPreview = async () => {
    setBatchLoading(true);
    try {
      const response = await apiRequest("POST", "/api/admin/batch-email/preview", {
        includeChannels: batchIncludeChannels,
        excludeChannels: batchExcludeChannels,
      });
      const data = await response.json();
      setBatchPreview(data);
      toast({ title: `Found ${data.count} matching contacts` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Could not preview recipients", variant: "destructive" });
    } finally {
      setBatchLoading(false);
    }
  };

  const handleBatchSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const subject = (form.elements.namedItem('batchSubject') as HTMLInputElement)?.value;
    const body = (form.elements.namedItem('batchBody') as HTMLTextAreaElement)?.value;

    if (!batchPreview || batchPreview.count === 0) {
      toast({ title: "Error", description: "Please preview recipients first", variant: "destructive" });
      return;
    }

    setPendingFormData({ subject, body });
    setShowConfirmDialog(true);
  };

  const confirmSend = async () => {
    if (!pendingFormData || !batchPreview) return;
    setShowConfirmDialog(false);
    setBatchSending(true);
    try {
      const response = await apiRequest("POST", "/api/admin/batch-email/send", {
        subject: pendingFormData.subject,
        body: pendingFormData.body,
        includeChannels: batchIncludeChannels,
        excludeChannels: batchExcludeChannels,
      });
      const data = await response.json();
      toast({
        title: "Batch email sent!",
        description: `${data.successCount} sent, ${data.failedCount} failed`
      });
      formRef.current?.reset();
      setBatchPreview(null);
      setBatchIncludeChannels([]);
      setBatchExcludeChannels([]);
      setPendingFormData(null);
      refetchBatchHistory();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/batch-email/history'] });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Could not send batch email", variant: "destructive" });
    } finally {
      setBatchSending(false);
    }
  };

  const toggleBatchChannel = (channel: string, type: 'include' | 'exclude') => {
    if (type === 'include') {
      if (batchIncludeChannels.includes(channel)) {
        setBatchIncludeChannels(batchIncludeChannels.filter(c => c !== channel));
      } else {
        setBatchIncludeChannels([...batchIncludeChannels, channel]);
        setBatchExcludeChannels(batchExcludeChannels.filter(c => c !== channel));
      }
    } else {
      if (batchExcludeChannels.includes(channel)) {
        setBatchExcludeChannels(batchExcludeChannels.filter(c => c !== channel));
      } else {
        setBatchExcludeChannels([...batchExcludeChannels, channel]);
        setBatchIncludeChannels(batchIncludeChannels.filter(c => c !== channel));
      }
    }
    setBatchPreview(null);
  };

  const recipientWarning = batchPreview && batchPreview.count >= 50;
  const largeBatchWarning = batchPreview && batchPreview.count >= 100;

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Send className="h-5 w-5 text-teal-400" />
            Send Batch Email
          </CardTitle>
          <p className="text-sm text-white/50 mt-2">
            Filter contacts by channel and send personalized emails. Use variables: {`{{firstName}}`}, {`{{name}}`}, {`{{email}}`}
          </p>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleBatchSend} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-3 block text-green-400">Include channels (has any of these)</label>
                <div className="flex flex-wrap gap-2">
                  {CHANNEL_OPTIONS.map(channel => (
                    <Button
                      key={`include-${channel}`}
                      type="button"
                      size="sm"
                      variant={batchIncludeChannels.includes(channel) ? "default" : "outline"}
                      className={`${batchIncludeChannels.includes(channel) ? "bg-green-600 border-green-600" : "border-white/20 text-white/70"} toggle-elevate ${batchIncludeChannels.includes(channel) ? "toggle-elevated" : ""}`}
                      onClick={() => toggleBatchChannel(channel, 'include')}
                      data-testid={`button-include-${channel.toLowerCase()}`}
                    >
                      {channel}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-3 block text-red-400">Exclude channels (has any of these)</label>
                <div className="flex flex-wrap gap-2">
                  {CHANNEL_OPTIONS.map(channel => (
                    <Button
                      key={`exclude-${channel}`}
                      type="button"
                      size="sm"
                      variant={batchExcludeChannels.includes(channel) ? "default" : "outline"}
                      className={`${batchExcludeChannels.includes(channel) ? "bg-red-600 border-red-600" : "border-white/20 text-white/70"} toggle-elevate ${batchExcludeChannels.includes(channel) ? "toggle-elevated" : ""}`}
                      onClick={() => toggleBatchChannel(channel, 'exclude')}
                      data-testid={`button-exclude-${channel.toLowerCase()}`}
                    >
                      {channel}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <Button
                type="button"
                variant="outline"
                onClick={handleBatchPreview}
                disabled={batchLoading}
                className="border-white/20 text-white/70"
                data-testid="button-batch-preview"
              >
                <Users className="w-4 h-4 mr-2" />
                {batchLoading ? "Loading..." : "Preview Recipients"}
              </Button>
              {batchPreview && (
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {batchPreview.count} contacts match
                </Badge>
              )}
            </div>

            {batchPreview && batchPreview.contacts.length > 0 && (
              <div className="max-h-40 overflow-y-auto border border-white/10 rounded-md p-3 bg-white/5">
                <div className="flex flex-wrap gap-2">
                  {batchPreview.contacts.slice(0, 20).map((contact: any) => (
                    <Badge key={contact.id} variant="secondary" className="text-xs">
                      {contact.email} {contact.channelsReached?.length > 0 && `(${contact.channelsReached.join(', ')})`}
                    </Badge>
                  ))}
                  {batchPreview.contacts.length > 20 && (
                    <Badge variant="outline" className="text-xs">
                      +{batchPreview.contacts.length - 20} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {recipientWarning && (
              <div className={`flex items-start gap-3 p-4 rounded-md border ${largeBatchWarning ? "bg-red-500/10 border-red-500/30" : "bg-amber-500/10 border-amber-500/30"}`}>
                <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${largeBatchWarning ? "text-red-400" : "text-amber-400"}`} />
                <div>
                  <p className={`text-sm font-medium ${largeBatchWarning ? "text-red-400" : "text-amber-400"}`}>
                    {largeBatchWarning
                      ? `Large batch: ${batchPreview!.count} recipients`
                      : `Moderate batch: ${batchPreview!.count} recipients`}
                  </p>
                  <p className="text-xs text-white/60 mt-1">
                    {largeBatchWarning
                      ? "Sending to 100+ recipients at once can trigger spam filters and damage your sender reputation. Consider splitting into smaller batches of 25-50 and sending over multiple days."
                      : "Consider sending a test email to yourself first to verify formatting and deliverability before sending to all recipients."}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center gap-1 text-xs text-teal-400 cursor-help">
                          <Info className="w-3 h-3" />
                          Why does batch size matter?
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs">
                        <p className="text-xs">Email providers like Gmail and Outlook track how many emails you send per hour. Sudden spikes in volume from a domain that normally sends few emails get flagged as potential spam. Building volume gradually (warm-up) protects your sender reputation.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block text-white/80">Subject</label>
                <Input
                  name="batchSubject"
                  placeholder="Email subject line"
                  required
                  className="bg-white/5 border-white/10"
                  data-testid="input-batch-subject"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block text-white/80">Body (HTML)</label>
                <textarea
                  name="batchBody"
                  className="w-full min-h-[200px] px-3 py-2 rounded-md bg-white/5 border border-white/10 resize-y font-mono text-sm text-white"
                  placeholder="<p>Hi {{firstName}},</p><p>Your message here...</p>"
                  required
                  data-testid="textarea-batch-body"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Button
                type="submit"
                disabled={batchSending || !batchPreview || batchPreview.count === 0}
                data-testid="button-batch-send"
              >
                <Send className="h-4 w-4 mr-2" />
                {batchSending ? "Sending..." : `Send to ${batchPreview?.count || 0} Recipients`}
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1 text-xs text-white/40 cursor-help">
                    <Info className="w-3 h-3" />
                    Pre-send checklist
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-sm">
                  <div className="space-y-1 text-xs">
                    <p className="font-medium mb-1">Before hitting send:</p>
                    <p>1. Send a test to yourself first</p>
                    <p>2. Check mail-tester.com score (aim for 9+)</p>
                    <p>3. Verify SPF/DKIM/DMARC are passing</p>
                    <p>4. Review subject line for spam triggers</p>
                    <p>5. Confirm unsubscribe link is present</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </form>

          {showConfirmDialog && batchPreview && pendingFormData && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <Card className="max-w-md w-full bg-[#0A0C14] border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    Confirm Batch Send
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-white/70">
                    <p>You are about to send an email to <span className="font-bold text-white">{batchPreview.count} recipients</span>.</p>
                    <p>Subject: <span className="font-medium text-white">{pendingFormData.subject}</span></p>
                    {batchPreview.count >= 50 && (
                      <div className="flex items-start gap-2 p-3 rounded-md bg-amber-500/10 border border-amber-500/30 mt-3">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-300">
                          This is a large batch. Have you tested deliverability with a small group first?
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-white/40">This action cannot be undone.</p>
                  <div className="flex items-center gap-3 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowConfirmDialog(false)}
                      className="border-white/20 text-white/70"
                      data-testid="button-cancel-batch-send"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={confirmSend}
                      data-testid="button-confirm-batch-send"
                    >
                      <Send className="w-3 h-3 mr-1" />
                      Confirm Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Clock className="h-5 w-5 text-white/60" />
            Batch Email History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(!batchHistoryData || batchHistoryData.length === 0) && (
            <p className="text-white/40">No batch emails sent yet.</p>
          )}
          {batchHistoryData && batchHistoryData.length > 0 && (
            <div className="space-y-3">
              {batchHistoryData.map((batch: any) => (
                <div key={batch.id} className="p-4 rounded-md bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                    <div>
                      <p className="font-semibold text-white">{batch.subject}</p>
                      <p className="text-sm text-white/50">
                        {batch.successCount} sent, {batch.failedCount} failed of {batch.recipientCount} total
                      </p>
                    </div>
                    <Badge variant={batch.status === 'completed' ? 'default' : 'outline'}>
                      {batch.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Calendar className="h-3 w-3" />
                    {batch.sentAt ? formatDate(batch.sentAt) : formatDate(batch.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function EmailControlRoom() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [testingId, setTestingId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"journeys" | "batch" | "deliverability" | "inventory">("journeys");

  const handleTestSend = async (journeyId: string) => {
    setTestingId(journeyId);
    try {
      await apiRequest("POST", "/api/admin/email-test", { journeyId });
      toast({
        title: "Test email sent",
        description: `Sample emails for "${JOURNEYS.find(j => j.id === journeyId)?.name}" dispatched to esteve@greenelephant.org`,
      });
    } catch {
      toast({
        title: "Send failed",
        description: "Could not send test email. Check server logs.",
        variant: "destructive",
      });
    } finally {
      setTestingId(null);
    }
  };

  const gdprCompliant = ALL_EMAILS.filter(e => e.gdpr || e.type === "admin").length;
  const darkHudCount = ALL_EMAILS.filter(e => e.template === "dark-hud").length;

  const sections = [
    { id: "journeys" as const, label: "Customer Journeys", icon: Target },
    { id: "batch" as const, label: "Batch Email", icon: Send },
    { id: "deliverability" as const, label: "Deliverability", icon: ShieldCheck },
    { id: "inventory" as const, label: "Email Inventory", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/submissions")} data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-1" /> Admin
            </Button>
            <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-page-title">Email Control Room</h1>
              <p className="text-sm text-white/50">All automated customer journeys — GreenElephant.org</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: "Total email functions", value: ALL_EMAILS.length, color: "text-white", tip: "Number of distinct email-sending functions in the codebase. Each handles a specific trigger (purchase confirmation, onboarding step, admin alert, etc.)." },
              { label: "Customer journeys", value: JOURNEYS.length, color: "text-teal-400", tip: "Automated email sequences triggered by user actions. Each journey maps the full sequence from trigger to final email." },
              { label: "Dark HUD template", value: `${darkHudCount}/${ALL_EMAILS.length}`, color: "text-teal-400", tip: "How many emails use the branded dark HUD template (dark bg, teal accents, Poppins headings). Best practice: all client-facing emails should use it." },
              { label: "GDPR compliant", value: `${gdprCompliant}/${ALL_EMAILS.length}`, color: "text-green-400", tip: "Emails with proper GDPR footer explaining why the recipient received it and how to unsubscribe. Target: 100% compliance." },
            ].map(stat => (
              <Tooltip key={stat.label}>
                <TooltipTrigger asChild>
                  <div className="bg-white/5 rounded-md p-4 border border-white/10 cursor-help" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-white/40 mt-1">{stat.label}</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">{stat.tip}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
          {sections.map(section => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection(section.id)}
              className={activeSection === section.id ? "" : "text-white/50"}
              data-testid={`button-section-${section.id}`}
            >
              <section.icon className="w-4 h-4 mr-1.5" />
              {section.label}
            </Button>
          ))}
        </div>

        {activeSection === "journeys" && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-1">Customer Journeys</h2>
            <p className="text-sm text-white/50 mb-5">Each journey maps the full email sequence triggered by a user action. Click any card to expand the sequence, then send a test to esteve@greenelephant.org.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {JOURNEYS.map(journey => (
                <JourneyCard
                  key={journey.id}
                  journey={journey}
                  onTest={handleTestSend}
                />
              ))}
            </div>
          </div>
        )}

        {activeSection === "batch" && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-1">Batch Email</h2>
            <p className="text-sm text-white/50 mb-5">Send targeted emails to groups of contacts filtered by channel. Includes pre-send guardrails and delivery warnings.</p>
            <BatchEmailSection />
          </div>
        )}

        {activeSection === "deliverability" && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-400" />
              Deliverability & Best Practices
            </h2>
            <p className="text-sm text-white/50 mb-5">
              Learn how to protect your sender reputation and ensure your emails reach the inbox. Click any card to expand for deeper guidance.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <Card className="bg-teal-500/10 border-teal-500/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-sm font-medium text-teal-400 cursor-help">Quick Deliverability Checklist</p>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-xs">Verify each item before sending batch emails. These settings protect your sender reputation and keep emails out of spam folders.</p>
                    </TooltipContent>
                  </Tooltip>
                      <div className="space-y-1.5 mt-2">
                        {[
                          "SPF record published and passing",
                          "DKIM signatures verified by Resend",
                          "DMARC policy set (at least p=none)",
                          "Domain warmed up before large sends",
                          "Unsubscribe link in all marketing emails",
                          "Test email sent to personal inbox first",
                          "mail-tester.com score 9/10 or higher",
                          "Bounce rate under 5%, complaints under 0.1%",
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full border border-teal-500/50 shrink-0" />
                            <p className="text-xs text-white/60">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-500/10 border-amber-500/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-400">Common Mistakes to Avoid</p>
                      <div className="space-y-1.5 mt-2">
                        {[
                          "Sending 100+ emails without warming up your domain",
                          "Using ALL CAPS or excessive exclamation marks!!!",
                          "Not checking bounce rates after sends",
                          "Sending image-heavy emails with little text",
                          "Ignoring spam complaints or unsubscribe requests",
                          "Using purchased or scraped email lists",
                          "Skipping test sends before batch sends",
                          "Not removing hard-bounced addresses",
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3 text-amber-500/50 shrink-0" />
                            <p className="text-xs text-white/60">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              {DELIVERABILITY_TOPICS.map(topic => (
                <DeliverabilityCard key={topic.id} topic={topic} />
              ))}
            </div>

            <div className="mt-6 p-4 rounded-md bg-white/5 border border-white/10">
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Useful Tools</p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {[
                      { name: "mail-tester.com", url: "https://www.mail-tester.com/", desc: "Test your email score" },
                      { name: "MXToolbox", url: "https://mxtoolbox.com/", desc: "Check DNS records" },
                      { name: "DMARC Analyzer", url: "https://dmarcian.com/dmarc-inspector/", desc: "Inspect DMARC" },
                      { name: "Resend Dashboard", url: "https://resend.com/emails", desc: "Monitor sends" },
                    ].map(tool => (
                      <a
                        key={tool.name}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 border border-teal-500/20 rounded-md px-3 py-1.5"
                        data-testid={`link-tool-${tool.name.toLowerCase().replace(/[.\s]/g, '-')}`}
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{tool.name}</span>
                        <span className="text-white/30">— {tool.desc}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "inventory" && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Full Email Inventory</h2>
            <p className="text-sm text-white/50 mb-5">All 16 email functions in <code className="text-teal-400">server/email-notifications.ts</code> — with template, GDPR status, and audience.</p>
            <div className="overflow-x-auto rounded-md border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                    <th className="text-left px-4 py-3">Function</th>
                    <th className="text-left px-4 py-3">Journey</th>
                    <th className="text-left px-4 py-3">Type</th>
                    <th className="text-left px-4 py-3">Template</th>
                    <th className="text-left px-4 py-3">Audience</th>
                    <th className="text-left px-4 py-3">GDPR</th>
                  </tr>
                </thead>
                <tbody>
                  {ALL_EMAILS.map((email, i) => (
                    <tr key={email.fn} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}>
                      <td className="px-4 py-3 font-mono text-xs text-teal-400 whitespace-nowrap">{email.fn}</td>
                      <td className="px-4 py-3 text-white/60 whitespace-nowrap">{email.journey}</td>
                      <td className="px-4 py-3"><TypeBadge type={email.type} /></td>
                      <td className="px-4 py-3"><TemplateBadge template={email.template} /></td>
                      <td className="px-4 py-3 text-white/60 whitespace-nowrap">{email.audience}</td>
                      <td className="px-4 py-3">
                        {email.gdpr ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <span className="text-white/30 text-xs">Admin only</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-white/30">
            <ShieldCheck className="w-4 h-4" />
            <span>All client-facing emails include GDPR unsubscribe footer. Admin-only emails stay plain by design.</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/submissions")}
            className="border-white/20 text-white/60"
            data-testid="button-back-bottom"
          >
            Back to Admin
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
