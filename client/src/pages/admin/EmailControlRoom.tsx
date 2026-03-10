import { useState } from "react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Target, Mail, Zap, Brain, Radio, MessageSquare,
  CheckCircle2, AlertCircle, Clock, ShieldCheck, ArrowRight,
  ChevronDown, ChevronUp, FlaskConical, BarChart3
} from "lucide-react";

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
  icon: React.ComponentType<{ className?: string }>;
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

export default function EmailControlRoom() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [testingId, setTestingId] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Email Control Room</h1>
              <p className="text-sm text-white/50">All automated customer journeys — GreenElephant.org</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: "Total email functions", value: ALL_EMAILS.length, color: "text-white" },
              { label: "Customer journeys", value: JOURNEYS.length, color: "text-teal-400" },
              { label: "Dark HUD template", value: `${darkHudCount}/${ALL_EMAILS.length}`, color: "text-teal-400" },
              { label: "GDPR compliant", value: `${gdprCompliant}/${ALL_EMAILS.length}`, color: "text-green-400" },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 rounded-md p-4 border border-white/10">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-white/40 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

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
          >
            Back to Admin
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
