import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, Mail, MessageSquare, Sparkles, Users, FileText, LogOut, Ticket, Plus, CheckCircle2, HelpCircle, Info, ShoppingCart, Trash2, ToggleLeft, Download, Send, Clock, Edit2, Save, X, Eye, RefreshCw, Database, Radio, Loader2, BarChart3, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LENSES, type LensType } from "@/constants/lenses";

const getLensColor = (lensType: string): string => {
  const lens = LENSES[lensType as LensType];
  return lens?.hexColor || '#666666';
};

const getLensName = (lensType: string): string => {
  const lens = LENSES[lensType as LensType];
  return lens?.name || lensType;
};

const LENS_OPTIONS = [
  { value: 'influence', tooltip: 'How you exert influence with integrity - red/coral color' },
  { value: 'attitude', tooltip: 'Your stance toward change and growth - orange color' },
  { value: 'chaordic', tooltip: 'Order in creative chaos - yellow color' },
  { value: 'flow', tooltip: 'Sensing flow in conversations - lime/yellow-green color' },
  { value: 'alignment', tooltip: 'Building empathy and shared understanding - green color' },
  { value: 'needs', tooltip: 'Honoring your energy and core needs - teal color' },
  { value: 'ego', tooltip: 'Recognizing and loosening ego patterns - sky blue color' },
  { value: 'dynamics', tooltip: 'Understanding relationship dynamics - purple color' }
];

const ROLE_OPTIONS = [
  { value: 'EA', label: 'Executive Assistants', tooltip: 'Prompts tailored for Executive Assistants managing communication for executives' },
  { value: 'ACX', label: 'ACX Prompt Engineers', tooltip: 'Deep analysis prompts for advanced users who explore communication patterns' },
  { value: 'TealLeaders', label: 'Teal Organization Leaders', tooltip: 'Prompts for self-managing teams and purpose-driven organizations' },
  { value: 'all', label: 'All Categories', tooltip: 'Universal prompts that work for everyone' }
];

const FIELD_TOOLTIPS = {
  lensType: 'Which of the 8 communication lenses does this prompt focus on? Each lens has a color that will be shown on the website.',
  roleCategory: 'Who is this prompt designed for? Different audiences need different levels of depth and focus.',
  title: 'A clear, compelling title that tells users what they\'ll get. Keep it under 60 characters.',
  description: 'A brief summary (2-3 sentences) explaining what insight or outcome users will gain.',
  whatItDoes: 'List 3-5 specific things this prompt will analyze or help with. Each line becomes a bullet point.',
  perfectFor: 'Describe the ideal user scenario. When would someone reach for this prompt?',
  promptContent: 'The full AI prompt template. Use [[DATA_START]] and [[DATA_END]] to mark where scan data gets inserted.'
};

interface Contact {
  id: string;
  email: string;
  name: string | null;
  consentGiven: string;
  consentText: string;
  consentedAt: string;
  source: string;
  createdAt: string;
  channelsReached?: string[];
  scanSubmittedAt?: string;
  notionSyncedAt?: string;
}

interface WaitlistEntry {
  id: string;
  contactId: string;
  motivation: string;
  retreatType: string | null;
  createdAt: string;
}

interface NewsletterSubscription {
  id: string;
  contactId: string;
  createdAt: string;
}

interface SignalsQuizResult {
  id: string;
  contactId: string | null;
  score: string;
  answers: Record<string, any>;
  createdAt: string;
}

interface RecommendationSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  preferredContactTime: string | null;
  recommendedPath: string;
  answers: Record<string, any>;
  createdAt: string;
}

interface SatellitescanPurchase {
  id: string;
  customerEmail: string;
  customerName: string | null;
  amount: string;
  stripePaymentIntentId: string;
  status: string;
  typeformCompleted: string;
  dashboardSent: string;
  remindersCount: string;
  createdAt: string;
}

interface Coupon {
  id: string;
  code: string;
  discountAmount: string;
  category: string;
  isActive: string;
  maxUses: string | null;
  usedCount: string;
  createdAt: string;
}

interface Purchase {
  id: string;
  customerEmail: string;
  customerName: string | null;
  packageId: string;
  amount: string;
  stripePaymentIntentId: string;
  status: string;
  createdAt: string;
}

interface Prompt {
  id: string;
  lensType: string;
  title: string;
  description: string;
  whatItDoes: string[];
  perfectFor: string;
  promptContent: string;
  roleCategory: string;
  votes: string;
  isActive: string;
  createdAt: string;
  updatedAt: string;
}

interface OnboardingEmailTemplate {
  id: string;
  sequenceNumber: string;
  triggerEvent: string;
  delayMinutes: string;
  subject: string;
  title: string;
  body: string;
  isActive: string;
  createdAt: string;
  updatedAt: string;
}

interface OnboardingEmailLog {
  id: string;
  customerId: string;
  templateId: string;
  status: string;
  scheduledAt: string;
  sentAt: string | null;
  errorMessage: string | null;
  createdAt: string;
}

export default function AdminSubmissionsPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check authentication status on mount - refetch on every mount
  const { data: authStatus, isLoading: authLoading } = useQuery<{ isAuthenticated: boolean }>({
    queryKey: ['/api/admin/check'],
    staleTime: 0,
    refetchOnMount: 'always',
  });

  // All hooks must be called before any conditional returns (React Rules of Hooks)
  const isAuthenticated = authStatus?.isAuthenticated === true;

  const { data: waitlistData, isLoading: waitlistLoading } = useQuery<WaitlistEntry[]>({
    queryKey: ['/api/admin/waitlist'],
    enabled: isAuthenticated,
  });

  const { data: newsletterData, isLoading: newsletterLoading } = useQuery<NewsletterSubscription[]>({
    queryKey: ['/api/admin/newsletter'],
    enabled: isAuthenticated,
  });

  const { data: quizData, isLoading: quizLoading } = useQuery<SignalsQuizResult[]>({
    queryKey: ['/api/admin/quiz'],
    enabled: isAuthenticated,
  });

  const { data: recommendationData, isLoading: recommendationLoading } = useQuery<RecommendationSubmission[]>({
    queryKey: ['/api/admin/recommendations'],
    enabled: isAuthenticated,
  });

  const { data: contactsData, isLoading: contactsLoading } = useQuery<Contact[]>({
    queryKey: ['/api/admin/contacts'],
    enabled: isAuthenticated,
  });

  const { data: satellitescanData, isLoading: satellitescanLoading } = useQuery<SatellitescanPurchase[]>({
    queryKey: ['/api/admin/satellitescan'],
    enabled: isAuthenticated,
  });

  const { data: couponsData, isLoading: couponsLoading, refetch: refetchCoupons } = useQuery<Coupon[]>({
    queryKey: ['/api/admin/coupons'],
    enabled: isAuthenticated,
  });

  const { data: purchasesData, isLoading: purchasesLoading } = useQuery<Purchase[]>({
    queryKey: ['/api/admin/purchases'],
    enabled: isAuthenticated,
  });

  const { data: promptsData, isLoading: promptsLoading, refetch: refetchPrompts } = useQuery<Prompt[]>({
    queryKey: ['/api/admin/prompts'],
    enabled: isAuthenticated,
  });

  const { data: emailTemplatesData, isLoading: emailTemplatesLoading, refetch: refetchEmailTemplates } = useQuery<OnboardingEmailTemplate[]>({
    queryKey: ['/api/admin/onboarding-emails'],
    enabled: isAuthenticated,
  });

  const { data: webinarSettingsData, isLoading: webinarSettingsLoading, refetch: refetchWebinarSettings } = useQuery<any>({
    queryKey: ['/api/admin/webinar-settings'],
    enabled: isAuthenticated,
  });

  const [webinarForm, setWebinarForm] = useState<{
    countdownDate: string;
    countdownTime: string;
    hostNames: string;
    bonusDescription: string;
    sessionTitle: string;
    sessionSubtitle: string;
    sessionDuration: string;
    ctaButtonText: string;
    ctaButtonTextExpired: string;
  } | null>(null);
  const [webinarSaving, setWebinarSaving] = useState(false);
  const [webinarSaved, setWebinarSaved] = useState(false);

  useEffect(() => {
    if (webinarSettingsLoading) return;
    if (webinarForm) return;
    
    const data = webinarSettingsData || {};
    let deadline: Date;
    try {
      deadline = data.countdownDeadline ? new Date(data.countdownDeadline) : new Date("2026-02-28T23:59:59+02:00");
      if (isNaN(deadline.getTime())) deadline = new Date("2026-02-28T23:59:59+02:00");
    } catch {
      deadline = new Date("2026-02-28T23:59:59+02:00");
    }
    
    const dateStr = deadline.toISOString().split("T")[0];
    const timeStr = deadline.toISOString().split("T")[1].substring(0, 5);
    
    setWebinarForm({
      countdownDate: dateStr,
      countdownTime: timeStr,
      hostNames: data.hostNames || "Anu Timmerbacka",
      bonusDescription: data.bonusDescription || "a free 1-on-1 session with a GreenElephant coach",
      sessionTitle: data.sessionTitle || "Communication Clarity for EA's & VA's",
      sessionSubtitle: data.sessionSubtitle || "Lead with calm influence and conscious impact",
      sessionDuration: data.sessionDuration || "75 minutes",
      ctaButtonText: data.ctaButtonText || "Claim Your Scan + Bonus Session",
      ctaButtonTextExpired: data.ctaButtonTextExpired || "Get Your Satellite Scan",
    });
  }, [webinarSettingsData, webinarSettingsLoading, webinarForm]);

  const handleWebinarSave = async () => {
    if (!webinarForm) return;
    setWebinarSaving(true);
    setWebinarSaved(false);
    try {
      const finlandTimeISO = `${webinarForm.countdownDate}T${webinarForm.countdownTime}:00+02:00`;
      
      await apiRequest("PUT", "/api/admin/webinar-settings", {
        countdownDeadline: finlandTimeISO,
        hostNames: webinarForm.hostNames,
        bonusDescription: webinarForm.bonusDescription,
        sessionTitle: webinarForm.sessionTitle,
        sessionSubtitle: webinarForm.sessionSubtitle,
        sessionDuration: webinarForm.sessionDuration,
        ctaButtonText: webinarForm.ctaButtonText || null,
        ctaButtonTextExpired: webinarForm.ctaButtonTextExpired || null,
      });
      
      await refetchWebinarSettings();
      setWebinarSaved(true);
      toast({
        title: "Saved",
        description: "Webinar settings updated. Changes are live now.",
      });
      setTimeout(() => setWebinarSaved(false), 3000);
    } catch (error: any) {
      toast({
        title: "Error saving",
        description: error.message || "Could not save settings",
        variant: "destructive",
      });
    } finally {
      setWebinarSaving(false);
    }
  };

  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<OnboardingEmailTemplate>>({});
  const [previewTemplate, setPreviewTemplate] = useState<OnboardingEmailTemplate | null>(null);
  const [showScanCompletionPreview, setShowScanCompletionPreview] = useState(false);

  useEffect(() => {
    // Only redirect if auth check is complete and user is explicitly not authenticated
    if (!authLoading && authStatus !== undefined && authStatus.isAuthenticated === false) {
      setLocation("/admin/login");
    }
  }, [authLoading, authStatus, setLocation]);

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/admin/logout", {});
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      setLocation("/admin/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not log out",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' HH:mm");
    } catch {
      return dateString;
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const code = (form.elements.namedItem('code') as HTMLInputElement)?.value;
    const discountAmount = (form.elements.namedItem('discountAmount') as HTMLInputElement)?.value;
    const category = (form.elements.namedItem('category') as HTMLSelectElement)?.value;
    const maxUses = (form.elements.namedItem('maxUses') as HTMLInputElement)?.value;

    try {
      await apiRequest("POST", "/api/admin/coupons", {
        code: code.toUpperCase(),
        discountAmount: parseFloat(discountAmount),
        category,
        maxUses: maxUses ? parseInt(maxUses) : null
      });
      toast({ title: "Coupon created!", description: `${code.toUpperCase()} saved` });
      form.reset();
      refetchCoupons();
    } catch (error) {
      toast({ title: "Error", description: "Could not create coupon", variant: "destructive" });
    }
  };

  const handleSeedTestCoupons = async () => {
    if (!confirm("This will create 5 test coupons for each product (100% off). Continue?")) return;
    
    try {
      const response = await apiRequest("POST", "/api/admin/coupons/seed-test", {});
      const data = await response.json();
      toast({ 
        title: "Test coupons seeded!", 
        description: data.message 
      });
      refetchCoupons();
    } catch (error: any) {
      toast({ title: "Error", description: "Could not seed test coupons", variant: "destructive" });
    }
  };

  const handleToggleCouponActive = async (coupon: Coupon) => {
    try {
      await apiRequest("PUT", `/api/admin/coupons/${coupon.code}`, {
        isActive: coupon.isActive === "true" ? "false" : "true"
      });
      toast({ title: coupon.isActive === "true" ? "Coupon deactivated" : "Coupon activated" });
      refetchCoupons();
    } catch (error) {
      toast({ title: "Error", description: "Could not update coupon", variant: "destructive" });
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    if (!confirm(`Are you sure you want to delete coupon ${code}?`)) return;
    
    try {
      await apiRequest("DELETE", `/api/admin/coupons/${code}`, {});
      toast({ title: "Coupon deleted" });
      refetchCoupons();
    } catch (error) {
      toast({ title: "Error", description: "Could not delete coupon", variant: "destructive" });
    }
  };

  const handleCreatePrompt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const lensType = (form.elements.namedItem('lensType') as HTMLSelectElement)?.value;
    const title = (form.elements.namedItem('title') as HTMLInputElement)?.value;
    const description = (form.elements.namedItem('description') as HTMLTextAreaElement)?.value;
    const whatItDoesRaw = (form.elements.namedItem('whatItDoes') as HTMLTextAreaElement)?.value;
    const perfectFor = (form.elements.namedItem('perfectFor') as HTMLInputElement)?.value;
    const promptContent = (form.elements.namedItem('promptContent') as HTMLTextAreaElement)?.value;
    const roleCategory = (form.elements.namedItem('roleCategory') as HTMLSelectElement)?.value;

    const whatItDoes = whatItDoesRaw.split('\n').filter(line => line.trim().length > 0);

    try {
      await apiRequest("POST", "/api/admin/prompts", {
        lensType,
        title,
        description,
        whatItDoes,
        perfectFor,
        promptContent,
        roleCategory,
        isActive: "true"
      });
      toast({ title: "Prompt created!", description: `${title} saved` });
      form.reset();
      refetchPrompts();
    } catch (error) {
      toast({ title: "Error", description: "Could not create prompt", variant: "destructive" });
    }
  };

  const handleDeletePrompt = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prompt?")) return;
    
    try {
      await apiRequest("DELETE", `/api/admin/prompts/${id}`, {});
      toast({ title: "Prompt deleted" });
      refetchPrompts();
    } catch (error) {
      toast({ title: "Error", description: "Could not delete prompt", variant: "destructive" });
    }
  };

  const handleTogglePromptActive = async (prompt: Prompt) => {
    try {
      await apiRequest("PUT", `/api/admin/prompts/${prompt.id}`, {
        isActive: prompt.isActive === "true" ? "false" : "true"
      });
      toast({ title: prompt.isActive === "true" ? "Prompt deactivated" : "Prompt activated" });
      refetchPrompts();
    } catch (error) {
      toast({ title: "Error", description: "Could not update prompt", variant: "destructive" });
    }
  };

  const handleSeedPrompts = async () => {
    if (!confirm("This will add 9 default prompts (8 lenses + Quick Wins) to the database. Continue?")) return;
    
    try {
      const response = await apiRequest("POST", "/api/admin/prompts/seed", {});
      const data = await response.json();
      toast({ 
        title: "Prompts seeded!", 
        description: data.message 
      });
      refetchPrompts();
    } catch (error: any) {
      const errorMessage = error?.message || "Could not seed prompts";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

  const handleCreateEmailTemplate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const sequenceNumber = (form.elements.namedItem('sequenceNumber') as HTMLInputElement)?.value;
    const triggerEvent = (form.elements.namedItem('triggerEvent') as HTMLSelectElement)?.value;
    const delayMinutes = (form.elements.namedItem('delayMinutes') as HTMLInputElement)?.value;
    const subject = (form.elements.namedItem('emailSubject') as HTMLInputElement)?.value;
    const title = (form.elements.namedItem('emailTitle') as HTMLInputElement)?.value;
    const body = (form.elements.namedItem('emailBody') as HTMLTextAreaElement)?.value;

    try {
      await apiRequest("POST", "/api/admin/onboarding-emails", {
        sequenceNumber,
        triggerEvent,
        delayMinutes,
        subject,
        title,
        body,
        isActive: "true"
      });
      toast({ title: "Email template created!", description: `Template "${title}" saved` });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/onboarding-emails'] });
    } catch (error) {
      toast({ title: "Error", description: "Could not create email template", variant: "destructive" });
    }
  };

  const handleUpdateEmailTemplate = async (template: OnboardingEmailTemplate) => {
    try {
      await apiRequest("PUT", `/api/admin/onboarding-emails/${template.id}`, editFormData);
      toast({ title: "Template updated!", description: `"${editFormData.subject || template.subject}" saved` });
      setEditingTemplateId(null);
      setEditFormData({});
      queryClient.invalidateQueries({ queryKey: ['/api/admin/onboarding-emails'] });
    } catch (error) {
      toast({ title: "Error", description: "Could not update template", variant: "destructive" });
    }
  };

  const handleDeleteEmailTemplate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this email template?")) return;
    
    try {
      await apiRequest("DELETE", `/api/admin/onboarding-emails/${id}`, {});
      toast({ title: "Template deleted" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/onboarding-emails'] });
    } catch (error) {
      toast({ title: "Error", description: "Could not delete template", variant: "destructive" });
    }
  };

  const handleToggleEmailTemplateActive = async (template: OnboardingEmailTemplate) => {
    try {
      await apiRequest("PUT", `/api/admin/onboarding-emails/${template.id}`, {
        isActive: template.isActive === "true" ? "false" : "true"
      });
      toast({ title: template.isActive === "true" ? "Template deactivated" : "Template activated" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/onboarding-emails'] });
    } catch (error) {
      toast({ title: "Error", description: "Could not update template", variant: "destructive" });
    }
  };

  const handleSeedEmailTemplates = async () => {
    if (!confirm("This will add 10 Fibonacci-timed onboarding email templates to the database. Continue?")) return;
    
    try {
      const response = await apiRequest("POST", "/api/admin/onboarding-emails/seed", {});
      const data = await response.json();
      toast({ 
        title: "Email templates seeded!", 
        description: data.message 
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/onboarding-emails'] });
    } catch (error: any) {
      const errorMessage = error?.message || "Could not seed email templates";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

  const startEditingTemplate = (template: OnboardingEmailTemplate) => {
    setEditingTemplateId(template.id);
    setEditFormData({
      sequenceNumber: template.sequenceNumber,
      triggerEvent: template.triggerEvent,
      delayMinutes: template.delayMinutes,
      subject: template.subject,
      title: template.title,
      body: template.body,
      isActive: template.isActive
    });
  };

  const cancelEditingTemplate = () => {
    setEditingTemplateId(null);
    setEditFormData({});
  };

  const formatMinutesToReadable = (minutes: string): string => {
    const mins = parseInt(minutes);
    if (mins < 60) return `${mins} mins`;
    if (mins < 1440) return `${Math.round(mins / 60)} hrs`;
    return `${Math.round(mins / 1440)} days`;
  };

  // Batch email state
  const CHANNEL_OPTIONS = ['Newsletter', 'Purchase', 'Quiz', 'Webinar', 'Waitlist'];
  const [batchIncludeChannels, setBatchIncludeChannels] = useState<string[]>([]);
  const [batchExcludeChannels, setBatchExcludeChannels] = useState<string[]>([]);
  const [batchPreview, setBatchPreview] = useState<{ count: number; contacts: any[] } | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchSending, setBatchSending] = useState(false);

  const { data: batchHistoryData, refetch: refetchBatchHistory } = useQuery<any[]>({
    queryKey: ['/api/admin/batch-email/history'],
    enabled: isAuthenticated,
  });

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

    if (!confirm(`Send email to ${batchPreview.count} recipients? This action cannot be undone.`)) return;

    setBatchSending(true);
    try {
      const response = await apiRequest("POST", "/api/admin/batch-email/send", {
        subject,
        body,
        includeChannels: batchIncludeChannels,
        excludeChannels: batchExcludeChannels,
      });
      const data = await response.json();
      toast({ 
        title: "Batch email sent!", 
        description: `${data.successCount} sent, ${data.failedCount} failed` 
      });
      form.reset();
      setBatchPreview(null);
      setBatchIncludeChannels([]);
      setBatchExcludeChannels([]);
      refetchBatchHistory();
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

  // Email resend and Notion sync state
  const [resendingEmail, setResendingEmail] = useState<string | null>(null);
  const [syncingContact, setSyncingContact] = useState<string | null>(null);
  const [notionSyncStatus, setNotionSyncStatus] = useState<{ message: string; success: boolean } | null>(null);
  
  // Contact search and detail view state
  const [contactSearchQuery, setContactSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactActivityData, setContactActivityData] = useState<any>(null);
  const [loadingContactActivity, setLoadingContactActivity] = useState(false);
  
  // Newsletter campaign state
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [campaignRecipients, setCampaignRecipients] = useState<any[]>([]);
  const [newCampaignName, setNewCampaignName] = useState("");
  const [newCampaignSubject, setNewCampaignSubject] = useState("");
  const [newCampaignContent, setNewCampaignContent] = useState(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; }
    .content { padding: 20px 0; }
    .footer { text-align: center; padding: 20px 0; font-size: 12px; color: #666; }
    a { color: #10b981; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐘 GreenElephant Newsletter</h1>
    </div>
    <div class="content">
      <p>Dear friend,</p>
      
      <p><!-- YOUR CONTENT HERE --></p>
      
      <p>Warm regards,<br>Esteve</p>
    </div>
    <div class="footer">
      <p>GreenElephant.org - Conscious Communication</p>
      <p><a href="https://greenelephant.org">Visit our website</a></p>
    </div>
  </div>
</body>
</html>`);
  const [editingCampaign, setEditingCampaign] = useState(false);
  const [sendingCampaign, setSendingCampaign] = useState(false);
  const [populatingRecipients, setPopulatingRecipients] = useState(false);

  const handleResendEmails = async (purchaseId: string, customerEmail: string) => {
    if (!confirm(`Resend welcome and receipt emails to ${customerEmail}?`)) return;
    
    setResendingEmail(purchaseId);
    try {
      const response = await apiRequest("POST", `/api/admin/satellitescan/${purchaseId}/resend-emails`, {});
      const data = await response.json();
      toast({ title: "Emails sent!", description: data.message });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Could not resend emails", variant: "destructive" });
    } finally {
      setResendingEmail(null);
    }
  };

  const handleSyncContactToNotion = async (email: string) => {
    setSyncingContact(email);
    try {
      const response = await apiRequest("POST", `/api/admin/contacts/${encodeURIComponent(email)}/sync-notion`, {});
      const data = await response.json();
      toast({ title: "Synced!", description: data.message });
      setNotionSyncStatus({ message: data.message, success: true });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Could not sync to Notion", variant: "destructive" });
      setNotionSyncStatus({ message: error.message, success: false });
    } finally {
      setSyncingContact(null);
    }
  };

  const handleBulkNotionSync = async () => {
    if (!confirm("Sync all contacts to Notion? This may take a while for large contact lists.")) return;
    
    setNotionSyncStatus({ message: "Starting sync...", success: true });
    try {
      const response = await apiRequest("POST", "/api/admin/notion/sync", {});
      const data = await response.json();
      toast({ 
        title: "Notion sync complete!", 
        description: `${data.synced || 0} contacts synced` 
      });
      setNotionSyncStatus({ message: `Synced ${data.synced || 0} contacts`, success: true });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contacts'] });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Sync failed", variant: "destructive" });
      setNotionSyncStatus({ message: error.message, success: false });
    }
  };

  // Filter contacts by search query
  const filteredContacts = (contactsData || []).filter(contact => {
    if (!contactSearchQuery.trim()) return true;
    const query = contactSearchQuery.toLowerCase();
    return (
      contact.email.toLowerCase().includes(query) ||
      (contact.name && contact.name.toLowerCase().includes(query))
    );
  });

  // Fetch contact activity timeline
  const handleViewContactActivity = async (contact: Contact) => {
    setSelectedContact(contact);
    setLoadingContactActivity(true);
    setContactActivityData(null);
    
    try {
      const response = await fetch(`/api/admin/contacts/${encodeURIComponent(contact.email)}/activity`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to load activity");
      }
      const data = await response.json();
      setContactActivityData(data);
    } catch (error: any) {
      toast({ title: "Error", description: "Could not load activity", variant: "destructive" });
    } finally {
      setLoadingContactActivity(false);
    }
  };

  // Campaign handlers
  const loadCampaigns = async () => {
    setCampaignsLoading(true);
    try {
      const response = await fetch("/api/admin/newsletter/campaigns", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to load campaigns");
      const data = await response.json();
      setCampaigns(data);
    } catch (error: any) {
      toast({ title: "Error", description: "Could not load campaigns", variant: "destructive" });
    } finally {
      setCampaignsLoading(false);
    }
  };

  const loadCampaignDetails = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/admin/newsletter/campaigns/${campaignId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to load campaign");
      const data = await response.json();
      setSelectedCampaign(data.campaign);
      setCampaignRecipients(data.recipients);
      setNewCampaignName(data.campaign.name);
      setNewCampaignSubject(data.campaign.subject);
      setNewCampaignContent(data.campaign.htmlContent);
    } catch (error: any) {
      toast({ title: "Error", description: "Could not load campaign details", variant: "destructive" });
    }
  };

  const handleCreateCampaign = async () => {
    if (!newCampaignName.trim() || !newCampaignSubject.trim()) {
      toast({ title: "Error", description: "Name and subject are required", variant: "destructive" });
      return;
    }
    
    try {
      const response = await apiRequest("POST", "/api/admin/newsletter/campaigns", {
        name: newCampaignName,
        subject: newCampaignSubject,
        htmlContent: newCampaignContent,
      });
      const campaign = await response.json();
      toast({ title: "Success", description: "Campaign created!" });
      await loadCampaigns();
      await loadCampaignDetails(campaign.id);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create campaign", variant: "destructive" });
    }
  };

  const handleUpdateCampaign = async () => {
    if (!selectedCampaign) return;
    
    try {
      await apiRequest("PATCH", `/api/admin/newsletter/campaigns/${selectedCampaign.id}`, {
        name: newCampaignName,
        subject: newCampaignSubject,
        htmlContent: newCampaignContent,
      });
      toast({ title: "Success", description: "Campaign updated!" });
      setEditingCampaign(false);
      await loadCampaigns();
      await loadCampaignDetails(selectedCampaign.id);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update campaign", variant: "destructive" });
    }
  };

  const handlePopulateRecipients = async () => {
    if (!selectedCampaign) return;
    
    setPopulatingRecipients(true);
    try {
      const response = await apiRequest("POST", `/api/admin/newsletter/campaigns/${selectedCampaign.id}/populate-recipients`, {});
      const data = await response.json();
      toast({ title: "Success", description: data.message });
      await loadCampaignDetails(selectedCampaign.id);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to add recipients", variant: "destructive" });
    } finally {
      setPopulatingRecipients(false);
    }
  };

  const handleToggleRecipientExclusion = async (recipientId: string, currentExcluded: boolean) => {
    try {
      await apiRequest("PATCH", `/api/admin/newsletter/recipients/${recipientId}/toggle-exclude`, {
        excluded: !currentExcluded,
      });
      await loadCampaignDetails(selectedCampaign.id);
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to update recipient", variant: "destructive" });
    }
  };

  const handleSendCampaign = async () => {
    if (!selectedCampaign) return;
    
    const activeRecipients = campaignRecipients.filter(r => r.excluded === "false" && r.status === "pending");
    if (activeRecipients.length === 0) {
      toast({ title: "Error", description: "No recipients to send to", variant: "destructive" });
      return;
    }
    
    if (!confirm(`Send this newsletter to ${activeRecipients.length} recipients? This cannot be undone.`)) return;
    
    setSendingCampaign(true);
    try {
      const response = await apiRequest("POST", `/api/admin/newsletter/campaigns/${selectedCampaign.id}/send`, {});
      const data = await response.json();
      toast({ 
        title: "Sent!", 
        description: `${data.sent} emails sent, ${data.failed} failed` 
      });
      await loadCampaigns();
      await loadCampaignDetails(selectedCampaign.id);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to send campaign", variant: "destructive" });
    } finally {
      setSendingCampaign(false);
    }
  };

  const handleResetCampaign = async () => {
    if (!selectedCampaign) return;
    if (!confirm("Reset this campaign? All recipient statuses will be set back to 'pending' so you can resend.")) return;
    
    try {
      const response = await apiRequest("POST", `/api/admin/newsletter/campaigns/${selectedCampaign.id}/reset`, {});
      const data = await response.json();
      toast({ title: "Reset!", description: `${data.resetCount} recipients reset to pending` });
      await loadCampaigns();
      await loadCampaignDetails(selectedCampaign.id);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to reset campaign", variant: "destructive" });
    }
  };

  const handleSendTestEmail = async () => {
    if (!selectedCampaign) return;
    const testEmail = prompt("Enter email address for test:", "email@estevepannetier.com");
    if (!testEmail) return;
    
    try {
      const response = await apiRequest("POST", `/api/admin/newsletter/campaigns/${selectedCampaign.id}/test`, { testEmail });
      const data = await response.json();
      toast({ title: "Test Sent!", description: `Test email sent to ${data.sentTo}` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to send test email", variant: "destructive" });
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm("Delete this campaign? This cannot be undone.")) return;
    
    try {
      await apiRequest("DELETE", `/api/admin/newsletter/campaigns/${campaignId}`, {});
      toast({ title: "Deleted", description: "Campaign removed" });
      setSelectedCampaign(null);
      await loadCampaigns();
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to delete campaign", variant: "destructive" });
    }
  };

  // Show loading state while checking authentication
  if (authLoading || authStatus === undefined) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin">
            <Sparkles className="h-8 w-8 mx-auto" />
          </div>
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto mb-6">
            <div className="flex-1" />
            <Badge className="bg-needs text-white">Admin Dashboard</Badge>
            <div className="flex-1 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                data-testid="button-admin-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-archivo">
            Admin Hub
          </h1>
          <p className="text-muted-foreground">
            GreenElephant backend — data, content, and email controls
          </p>
        </div>

        {/* Admin tools quick-access */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { label: "Email Control Room", icon: Mail, href: "/admin/email-control-room", color: "text-needs border-needs/30 bg-needs/5" },
            { label: "Webinar Sessions", icon: Radio, href: "/admin/webinar-sessions", color: "text-ego border-ego/30 bg-ego/5" },
            { label: "Calendar Events", icon: Calendar, href: "/admin/calendar-events", color: "text-alignment border-alignment/30 bg-alignment/5" },
            { label: "Scan Results", icon: BarChart3, href: "/admin/scan-results", color: "text-attitude border-attitude/30 bg-attitude/5" },
          ].map(tool => (
            <button
              key={tool.href}
              onClick={() => setLocation(tool.href)}
              className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center hover-elevate active-elevate-2 ${tool.color}`}
              data-testid={`button-tool-${tool.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <tool.icon className="h-5 w-5" />
              <span className="text-xs font-medium leading-tight">{tool.label}</span>
            </button>
          ))}
        </div>

        <Tabs defaultValue="prompts" className="space-y-8">
          <TabsList className="flex flex-wrap gap-1 w-full mb-8">
            <TabsTrigger value="webinar" data-testid="tab-webinar">
              <Radio className="h-4 w-4 mr-2" />
              Webinar
            </TabsTrigger>
            <TabsTrigger value="batch" data-testid="tab-batch">
              <Mail className="h-4 w-4 mr-2" />
              Batch
            </TabsTrigger>
            <TabsTrigger value="emails" data-testid="tab-emails">
              <Send className="h-4 w-4 mr-2" />
              Emails ({emailTemplatesData?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="prompts" data-testid="tab-prompts">
              <FileText className="h-4 w-4 mr-2" />
              Prompts ({promptsData?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="coupons" data-testid="tab-coupons">
              <Ticket className="h-4 w-4 mr-2" />
              Coupons ({couponsData?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="purchases" data-testid="tab-purchases">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Purchases ({purchasesData?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="notion" data-testid="tab-notion">
              <Database className="h-4 w-4 mr-2" />
              Notion
            </TabsTrigger>
            <TabsTrigger value="satellitescan" data-testid="tab-satellitescan">
              <Sparkles className="h-4 w-4 mr-2" />
              Scans ({satellitescanData?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="waitlist" data-testid="tab-waitlist">
              <Users className="h-4 w-4 mr-2" />
              Waitlist ({waitlistData?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="newsletter" data-testid="tab-newsletter">
              <Mail className="h-4 w-4 mr-2" />
              Subs ({newsletterData?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="campaigns" data-testid="tab-campaigns">
              <Send className="h-4 w-4 mr-2" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="quiz" data-testid="tab-quiz">
              <Sparkles className="h-4 w-4 mr-2" />
              Quiz ({quizData?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="recommendations" data-testid="tab-recommendations">
              <FileText className="h-4 w-4 mr-2" />
              Recs ({recommendationData?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="contacts" data-testid="tab-contacts">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contacts ({contactsData?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="webinar" className="space-y-6">
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5" />
                  Webinar Page Settings
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Change your /webinar page instantly. Edit, hit Save, done.
                </p>
              </CardHeader>
              <CardContent>
                {webinarSettingsLoading || !webinarForm ? (
                  <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading settings...
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="rounded-md border border-needs/30 bg-needs/5 p-6 space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-needs" />
                        Countdown Timer (Finland Time)
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        When should the bonus offer expire? After this time, the page shows a normal "Get Your Satellite Scan" button instead.
                      </p>
                      <div className="flex flex-wrap items-end gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Date</label>
                          <Input
                            type="date"
                            value={webinarForm.countdownDate}
                            onChange={(e) => setWebinarForm({ ...webinarForm, countdownDate: e.target.value })}
                            data-testid="input-webinar-date"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Time (24h)</label>
                          <Input
                            type="time"
                            value={webinarForm.countdownTime}
                            onChange={(e) => setWebinarForm({ ...webinarForm, countdownTime: e.target.value })}
                            data-testid="input-webinar-time"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md border border-white/10 p-6 space-y-4">
                      <h3 className="text-lg font-semibold">Host & Session</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Host name(s)</label>
                          <p className="text-xs text-muted-foreground">Who is presenting? e.g. "Anu Timmerbacka" or "Anu & Esteve"</p>
                          <Input
                            value={webinarForm.hostNames}
                            onChange={(e) => setWebinarForm({ ...webinarForm, hostNames: e.target.value })}
                            data-testid="input-webinar-host"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Page title</label>
                          <p className="text-xs text-muted-foreground">The big headline visitors see first</p>
                          <Input
                            value={webinarForm.sessionTitle}
                            onChange={(e) => setWebinarForm({ ...webinarForm, sessionTitle: e.target.value })}
                            data-testid="input-webinar-title"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Subtitle</label>
                          <p className="text-xs text-muted-foreground">The smaller text just below the title</p>
                          <Input
                            value={webinarForm.sessionSubtitle}
                            onChange={(e) => setWebinarForm({ ...webinarForm, sessionSubtitle: e.target.value })}
                            data-testid="input-webinar-subtitle"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Session duration</label>
                          <p className="text-xs text-muted-foreground">e.g. "75 minutes" or "90 minutes"</p>
                          <Input
                            value={webinarForm.sessionDuration}
                            onChange={(e) => setWebinarForm({ ...webinarForm, sessionDuration: e.target.value })}
                            data-testid="input-webinar-duration"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md border border-attitude/30 bg-attitude/5 p-6 space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-attitude" />
                        Bonus Offer
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Bonus description</label>
                          <p className="text-xs text-muted-foreground">What do they get as a bonus? Shown as: "...and receive [your text]"</p>
                          <Input
                            value={webinarForm.bonusDescription}
                            onChange={(e) => setWebinarForm({ ...webinarForm, bonusDescription: e.target.value })}
                            data-testid="input-webinar-bonus"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">CTA button text (during countdown)</label>
                          <p className="text-xs text-muted-foreground">The main purchase button text while the timer is running</p>
                          <Input
                            value={webinarForm.ctaButtonText}
                            placeholder="Claim Your Scan + Bonus Session"
                            onChange={(e) => setWebinarForm({ ...webinarForm, ctaButtonText: e.target.value })}
                            data-testid="input-webinar-cta"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">CTA button text (after countdown expires)</label>
                          <p className="text-xs text-muted-foreground">The button text after the bonus expires</p>
                          <Input
                            value={webinarForm.ctaButtonTextExpired}
                            placeholder="Get Your Satellite Scan"
                            onChange={(e) => setWebinarForm({ ...webinarForm, ctaButtonTextExpired: e.target.value })}
                            data-testid="input-webinar-cta-expired"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Button
                        onClick={handleWebinarSave}
                        disabled={webinarSaving}
                        data-testid="button-webinar-save"
                      >
                        {webinarSaving ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                        ) : webinarSaved ? (
                          <><CheckCircle2 className="h-4 w-4 mr-2" />Saved!</>
                        ) : (
                          <><Save className="h-4 w-4 mr-2" />Save Changes</>
                        )}
                      </Button>
                      <a href="/webinar" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" data-testid="button-webinar-preview">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview Page
                        </Button>
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="batch" className="space-y-6">
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Send Batch Email
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Filter contacts by channel and send personalized emails. Use variables: {`{{firstName}}`}, {`{{name}}`}, {`{{email}}`}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBatchSend} className="space-y-6">
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
                            className={batchIncludeChannels.includes(channel) ? "bg-green-600 hover:bg-green-700" : ""}
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
                            className={batchExcludeChannels.includes(channel) ? "bg-red-600 hover:bg-red-700" : ""}
                            onClick={() => toggleBatchChannel(channel, 'exclude')}
                            data-testid={`button-exclude-${channel.toLowerCase()}`}
                          >
                            {channel}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleBatchPreview}
                      disabled={batchLoading}
                      data-testid="button-batch-preview"
                    >
                      {batchLoading ? "Loading..." : "Preview Recipients"}
                    </Button>
                    {batchPreview && (
                      <Badge variant="outline" className="text-lg px-4 py-2">
                        {batchPreview.count} contacts match
                      </Badge>
                    )}
                  </div>

                  {batchPreview && batchPreview.contacts.length > 0 && (
                    <div className="max-h-40 overflow-y-auto border border-white/10 rounded-lg p-3 bg-background/50">
                      <div className="flex flex-wrap gap-2">
                        {batchPreview.contacts.slice(0, 20).map(contact => (
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

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Subject</label>
                      <Input 
                        name="batchSubject" 
                        placeholder="Email subject line" 
                        required 
                        data-testid="input-batch-subject"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Body (HTML)</label>
                      <textarea 
                        name="batchBody" 
                        className="w-full min-h-[200px] px-3 py-2 rounded-md bg-background/50 border border-white/10 resize-y font-mono text-sm"
                        placeholder="<p>Hi {{firstName}},</p><p>Your message here...</p>"
                        required
                        data-testid="textarea-batch-body"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="bg-needs text-white"
                    disabled={batchSending || !batchPreview || batchPreview.count === 0}
                    data-testid="button-batch-send"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {batchSending ? "Sending..." : `Send to ${batchPreview?.count || 0} Recipients`}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Batch Email History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(!batchHistoryData || batchHistoryData.length === 0) && (
                  <p className="text-muted-foreground">No batch emails sent yet.</p>
                )}
                {batchHistoryData && batchHistoryData.length > 0 && (
                  <div className="space-y-3">
                    {batchHistoryData.map((batch: any) => (
                      <div key={batch.id} className="p-4 rounded-lg bg-background/50 border border-white/10">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{batch.subject}</p>
                            <p className="text-sm text-muted-foreground">
                              {batch.successCount} sent, {batch.failedCount} failed of {batch.recipientCount} total
                            </p>
                          </div>
                          <Badge variant={batch.status === 'completed' ? 'default' : 'outline'}>
                            {batch.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {batch.sentAt ? formatDate(batch.sentAt) : formatDate(batch.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prompts" className="space-y-6">
            {/* Quick Start Card - Only show if no prompts exist */}
            {(!promptsData || promptsData.length === 0) && (
              <Card className="backdrop-blur-sm bg-needs/10 border-needs/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-needs">
                    <Sparkles className="h-5 w-5" />
                    Quick Start: Seed Default Prompts
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Get started quickly by loading 9 pre-built prompts covering all 8 communication lenses plus Quick Wins.
                  </p>
                </CardHeader>
                <CardContent>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={handleSeedPrompts}
                        className="bg-needs text-white"
                        data-testid="button-seed-prompts"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Seed 9 Default Prompts
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>One-click setup: Adds prompts for Influence, Attitude, Chaordic, Flow, Alignment, Needs, Ego, Dynamics, and Quick Wins.</p>
                    </TooltipContent>
                  </Tooltip>
                </CardContent>
              </Card>
            )}

            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Create New Prompt
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Add a new prompt to the library. Hover over the <Info className="inline h-4 w-4 text-needs" /> icons for guidance on each field.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreatePrompt} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 flex items-center gap-2">
                        Lens Type
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground hover:text-needs cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{FIELD_TOOLTIPS.lensType}</p>
                          </TooltipContent>
                        </Tooltip>
                      </label>
                      <select name="lensType" className="w-full px-3 py-2 rounded-md bg-background/50 border border-white/10" required data-testid="select-lens-type">
                        {LENS_OPTIONS.map((lens) => (
                          <option 
                            key={lens.value} 
                            value={lens.value}
                            style={{ color: getLensColor(lens.value) }}
                          >
                            {getLensName(lens.value)}
                          </option>
                        ))}
                      </select>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {LENS_OPTIONS.map((lens) => (
                          <Tooltip key={lens.value}>
                            <TooltipTrigger asChild>
                              <span 
                                className="inline-block w-4 h-4 rounded-full cursor-help border border-white/20"
                                style={{ backgroundColor: getLensColor(lens.value) }}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-medium">{getLensName(lens.value)}</p>
                              <p className="text-xs text-muted-foreground">{lens.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 flex items-center gap-2">
                        Role Category
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground hover:text-needs cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{FIELD_TOOLTIPS.roleCategory}</p>
                          </TooltipContent>
                        </Tooltip>
                      </label>
                      <select name="roleCategory" className="w-full px-3 py-2 rounded-md bg-background/50 border border-white/10" required data-testid="select-role-category">
                        {ROLE_OPTIONS.map((role) => (
                          <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                      </select>
                      <div className="mt-2 text-xs text-muted-foreground space-y-1">
                        {ROLE_OPTIONS.map((role) => (
                          <Tooltip key={role.value}>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center gap-1 cursor-help mr-2">
                                <Badge variant="outline" className="text-xs">{role.value}</Badge>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="font-medium">{role.label}</p>
                              <p className="text-xs text-muted-foreground">{role.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 flex items-center gap-2">
                      Title
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground hover:text-needs cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>{FIELD_TOOLTIPS.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </label>
                    <Input name="title" placeholder="e.g., Deep Ego State Analysis" required data-testid="input-prompt-title" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 flex items-center gap-2">
                      Description
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground hover:text-needs cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>{FIELD_TOOLTIPS.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </label>
                    <textarea 
                      name="description" 
                      className="w-full px-3 py-2 rounded-md bg-background/50 border border-white/10 min-h-[80px]" 
                      placeholder="Brief description of what the prompt helps with..."
                      required
                      data-testid="textarea-description"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 flex items-center gap-2">
                      What It Does (one item per line)
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground hover:text-needs cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>{FIELD_TOOLTIPS.whatItDoes}</p>
                        </TooltipContent>
                      </Tooltip>
                    </label>
                    <textarea 
                      name="whatItDoes" 
                      className="w-full px-3 py-2 rounded-md bg-background/50 border border-white/10 min-h-[100px]" 
                      placeholder="Maps your protective patterns&#10;Identifies triggers&#10;Suggests integration paths"
                      required
                      data-testid="textarea-what-it-does"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 flex items-center gap-2">
                      Perfect For
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground hover:text-needs cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>{FIELD_TOOLTIPS.perfectFor}</p>
                        </TooltipContent>
                      </Tooltip>
                    </label>
                    <Input name="perfectFor" placeholder="e.g., Leaders ready to explore their inner landscape" required data-testid="input-perfect-for" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 flex items-center gap-2">
                      Prompt Content
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground hover:text-needs cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>{FIELD_TOOLTIPS.promptContent}</p>
                        </TooltipContent>
                      </Tooltip>
                    </label>
                    <textarea 
                      name="promptContent" 
                      className="w-full px-3 py-2 rounded-md bg-background/50 border border-white/10 min-h-[200px] font-mono text-sm" 
                      placeholder="The full prompt template with [[DATA_START]] and [[DATA_END]] markers..."
                      required
                      data-testid="textarea-prompt-content"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-needs text-white" data-testid="button-create-prompt">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Prompt
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  All Prompts
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground hover:text-needs cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Manage your prompt library here. Toggle active status to show/hide prompts on the website. Lens colors match the website design.</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {promptsData?.filter(p => p.isActive === 'true').length || 0} active prompts shown on website
                </p>
              </CardHeader>
              <CardContent>
                {promptsLoading && <p className="text-muted-foreground">Loading...</p>}
                {!promptsLoading && (!promptsData || promptsData.length === 0) && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">No prompts yet.</p>
                    <p className="text-sm text-muted-foreground">Create your first prompt using the form above!</p>
                  </div>
                )}
                {!promptsLoading && promptsData && promptsData.length > 0 && (
                  <div className="space-y-3">
                    {promptsData.map((prompt) => (
                      <div 
                        key={prompt.id} 
                        className="p-4 rounded-lg bg-background/50 border border-white/10"
                        style={{ 
                          borderLeftWidth: '4px', 
                          borderLeftColor: getLensColor(prompt.lensType) 
                        }}
                      >
                        <div className="flex items-start justify-between mb-2 gap-4 flex-wrap">
                          <div className="space-y-1 flex-1 min-w-0">
                            <p className="font-semibold text-lg">{prompt.title}</p>
                            <div className="flex gap-2 flex-wrap">
                              <Badge 
                                style={{ 
                                  backgroundColor: getLensColor(prompt.lensType),
                                  color: ['chaordic', 'flow'].includes(prompt.lensType) ? '#000' : '#fff'
                                }}
                              >
                                {getLensName(prompt.lensType)}
                              </Badge>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className="cursor-help">{prompt.roleCategory}</Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {ROLE_OPTIONS.find(r => r.value === prompt.roleCategory)?.tooltip || 'Target audience for this prompt'}
                                </TooltipContent>
                              </Tooltip>
                              <Badge variant="secondary">{prompt.votes} votes</Badge>
                              <Badge variant={prompt.isActive === 'true' ? 'default' : 'outline'}>
                                {prompt.isActive === 'true' ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant={prompt.isActive === 'true' ? 'default' : 'secondary'}
                                  onClick={() => handleTogglePromptActive(prompt)}
                                  data-testid={`button-toggle-prompt-${prompt.id}`}
                                >
                                  {prompt.isActive === 'true' ? <CheckCircle2 className="h-4 w-4" /> : 'Activate'}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {prompt.isActive === 'true' 
                                  ? 'Click to hide this prompt from the website' 
                                  : 'Click to show this prompt on the website'}
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeletePrompt(prompt.id)}
                                  data-testid={`button-delete-prompt-${prompt.id}`}
                                >
                                  Delete
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Permanently remove this prompt
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{prompt.description}</p>
                        <details className="text-xs">
                          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">View prompt content</summary>
                          <pre className="mt-2 p-2 bg-black/30 rounded text-xs overflow-auto max-h-40">
                            {prompt.promptContent}
                          </pre>
                        </details>
                        <p className="text-xs text-muted-foreground mt-2">{formatDate(prompt.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coupons" className="space-y-6">
            <Card className="backdrop-blur-sm bg-alignment/10 border-alignment/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-alignment">
                  <Download className="h-5 w-5" />
                  Quick Start: Seed Test Coupons
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Create 100% off coupons for testing each product payment flow.
                </p>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleSeedTestCoupons}
                  className="bg-alignment text-white"
                  data-testid="button-seed-test-coupons"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Seed 5 Test Coupons
                </Button>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  Create New Coupon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCoupon} className="space-y-4 max-w-md">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Coupon Code</label>
                    <Input name="code" placeholder="e.g., STUDENT50" required data-testid="input-coupon-code" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Discount Amount (€)</label>
                    <Input name="discountAmount" type="number" placeholder="29.99" step="0.01" required data-testid="input-discount-amount" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <select name="category" className="w-full px-3 py-2 rounded-md bg-background/50 border border-white/10" required data-testid="select-category">
                      <option value="student">Student</option>
                      <option value="startup">Startup</option>
                      <option value="social_enterprise">Social Enterprise</option>
                      <option value="unemployed">Unemployed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Max Uses (Leave blank for unlimited)</label>
                    <Input name="maxUses" type="number" placeholder="100" data-testid="input-max-uses" />
                  </div>
                  <Button type="submit" className="w-full bg-alignment text-white" data-testid="button-create-coupon">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Coupon
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle>All Coupons</CardTitle>
              </CardHeader>
              <CardContent>
                {couponsLoading && <p className="text-muted-foreground">Loading...</p>}
                {!couponsLoading && (!couponsData || couponsData.length === 0) && (
                  <p className="text-muted-foreground">No coupons yet. Create one or seed test coupons to get started!</p>
                )}
                {!couponsLoading && couponsData && couponsData.length > 0 && (
                  <div className="space-y-3">
                    {couponsData.map((coupon) => (
                      <div key={coupon.id} className="p-4 rounded-lg bg-background/50 border border-white/10 flex items-start justify-between gap-4 flex-wrap">
                        <div className="space-y-1 flex-1 min-w-0">
                          <p className="font-semibold text-lg">{coupon.code}</p>
                          <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
                            <span>€{coupon.discountAmount} discount</span>
                            <span className="capitalize">{coupon.category}</span>
                            <span>{coupon.usedCount} of {coupon.maxUses || '∞'} uses</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{formatDate(coupon.createdAt)}</p>
                        </div>
                        <div className="flex gap-2 items-center flex-shrink-0">
                          <Button
                            size="sm"
                            variant={coupon.isActive === 'true' ? 'default' : 'secondary'}
                            onClick={() => handleToggleCouponActive(coupon)}
                            data-testid={`button-toggle-coupon-${coupon.code}`}
                          >
                            <ToggleLeft className="h-4 w-4 mr-1" />
                            {coupon.isActive === 'true' ? 'Active' : 'Inactive'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteCoupon(coupon.code)}
                            data-testid={`button-delete-coupon-${coupon.code}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchases" className="space-y-6">
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  All Product Purchases
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Coaching Journey, Interview Mastery, Team Workshop, and Single Session purchases
                </p>
              </CardHeader>
              <CardContent>
                {purchasesLoading && <p className="text-muted-foreground">Loading...</p>}
                {!purchasesLoading && (!purchasesData || purchasesData.length === 0) && (
                  <p className="text-muted-foreground">No purchases yet. When customers buy coaching packages, they will appear here.</p>
                )}
                {!purchasesLoading && purchasesData && purchasesData.length > 0 && (
                  <div className="space-y-4">
                    {purchasesData.map((purchase) => (
                      <div key={purchase.id} className="p-6 rounded-lg bg-background/50 border border-white/10 space-y-3">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="space-y-1">
                            <p className="font-semibold text-lg">{purchase.customerName || "No name provided"}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              <a href={`mailto:${purchase.customerEmail}`} className="hover:underline">
                                {purchase.customerEmail}
                              </a>
                            </p>
                          </div>
                          <div className="flex gap-2 items-center">
                            <Badge className="bg-needs text-white">
                              €{purchase.amount}
                            </Badge>
                            <Badge variant="outline">
                              {purchase.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <Badge 
                            variant="secondary"
                            className="capitalize"
                          >
                            {purchase.packageId.replace(/-/g, ' ')}
                          </Badge>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(purchase.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="satellitescan" className="space-y-6">
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle>Satellitescan Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                {satellitescanLoading && <p className="text-muted-foreground">Loading...</p>}
                {!satellitescanLoading && (!satellitescanData || satellitescanData.length === 0) && (
                  <p className="text-muted-foreground">No satellitescan purchases yet.</p>
                )}
                {!satellitescanLoading && satellitescanData && satellitescanData.length > 0 && (
                  <div className="space-y-4">
                    {satellitescanData.map((purchase) => (
                      <div key={purchase.id} className="p-6 rounded-lg bg-background/50 border border-white/10 space-y-3">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="space-y-1">
                            <p className="font-semibold text-lg">{purchase.customerName || "No name provided"}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              <a href={`mailto:${purchase.customerEmail}`} className="hover:underline">
                                {purchase.customerEmail}
                              </a>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-alignment text-white">
                              €{purchase.amount}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className={`h-4 w-4 ${purchase.typeformCompleted === 'true' ? 'text-green-500' : 'text-muted-foreground'}`} />
                            <span className="text-sm">
                              Typeform: {purchase.typeformCompleted === 'true' ? 'Done' : 'Pending'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className={`h-4 w-4 ${purchase.dashboardSent === 'true' ? 'text-green-500' : 'text-muted-foreground'}`} />
                            <span className="text-sm">
                              Dashboard: {purchase.dashboardSent === 'true' ? 'Sent' : 'Pending'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              Reminders: {purchase.remindersCount}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {purchase.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/10 gap-4 flex-wrap">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(purchase.createdAt)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleResendEmails(purchase.id, purchase.customerEmail)}
                                  disabled={resendingEmail === purchase.id}
                                  data-testid={`button-resend-emails-${purchase.id}`}
                                >
                                  {resendingEmail === purchase.id ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Mail className="h-4 w-4" />
                                  )}
                                  <span className="ml-1">Resend Emails</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Resend welcome and receipt emails to this customer
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleSyncContactToNotion(purchase.customerEmail)}
                                  disabled={syncingContact === purchase.customerEmail}
                                  data-testid={`button-sync-notion-${purchase.id}`}
                                >
                                  {syncingContact === purchase.customerEmail ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Database className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Sync this contact to Notion CRM
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="waitlist" className="space-y-6">
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle>Retreat Waitlist Entries</CardTitle>
              </CardHeader>
              <CardContent>
                {waitlistLoading && <p className="text-muted-foreground">Loading...</p>}
                {!waitlistLoading && (!waitlistData || waitlistData.length === 0) && (
                  <p className="text-muted-foreground">No waitlist entries yet.</p>
                )}
                {!waitlistLoading && waitlistData && waitlistData.length > 0 && (
                  <div className="space-y-4">
                    {waitlistData.map((entry) => {
                      const contact = contactsData?.find(c => c.id === entry.contactId);
                      return (
                        <div key={entry.id} className="p-4 rounded-lg bg-background/50 border border-white/10">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold">{contact?.name || "No name"}</p>
                              <p className="text-sm text-muted-foreground">{contact?.email || "No email"}</p>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              {entry.retreatType || "Any retreat"}
                            </Badge>
                          </div>
                          <p className="text-sm mb-2">{entry.motivation}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(entry.createdAt)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="newsletter" className="space-y-6">
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle>Newsletter Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                {newsletterLoading && <p className="text-muted-foreground">Loading...</p>}
                {!newsletterLoading && (!newsletterData || newsletterData.length === 0) && (
                  <p className="text-muted-foreground">No newsletter subscribers yet.</p>
                )}
                {!newsletterLoading && newsletterData && newsletterData.length > 0 && (
                  <div className="space-y-4">
                    {newsletterData.map((subscription) => {
                      const contact = contactsData?.find(c => c.id === subscription.contactId);
                      return (
                        <div key={subscription.id} className="p-4 rounded-lg bg-background/50 border border-white/10">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold">{contact?.name || "No name"}</p>
                              <p className="text-sm text-muted-foreground">{contact?.email || "No email"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                            <Calendar className="h-3 w-3" />
                            {formatDate(subscription.createdAt)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz" className="space-y-6">
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle>Signals Quiz Results</CardTitle>
              </CardHeader>
              <CardContent>
                {quizLoading && <p className="text-muted-foreground">Loading...</p>}
                {!quizLoading && (!quizData || quizData.length === 0) && (
                  <p className="text-muted-foreground">No quiz results yet.</p>
                )}
                {!quizLoading && quizData && quizData.length > 0 && (
                  <div className="space-y-4">
                    {quizData.map((result) => {
                      const contact = result.contactId ? contactsData?.find(c => c.id === result.contactId) : null;
                      return (
                        <div key={result.id} className="p-4 rounded-lg bg-background/50 border border-white/10">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold">{contact?.name || "Anonymous"}</p>
                              {contact && <p className="text-sm text-muted-foreground">{contact.email}</p>}
                            </div>
                            <Badge className="ml-2 bg-needs text-white">
                              Score: {result.score}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(result.createdAt)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle>Path Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                {recommendationLoading && <p className="text-muted-foreground">Loading...</p>}
                {!recommendationLoading && (!recommendationData || recommendationData.length === 0) && (
                  <p className="text-muted-foreground">No recommendations yet.</p>
                )}
                {!recommendationLoading && recommendationData && recommendationData.length > 0 && (
                  <div className="space-y-4">
                    {recommendationData.map((rec) => (
                      <div key={rec.id} className="p-4 rounded-lg bg-background/50 border border-white/10">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{rec.name}</p>
                            <p className="text-sm text-muted-foreground">{rec.email}</p>
                            {rec.phone && <p className="text-sm text-muted-foreground">{rec.phone}</p>}
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {rec.recommendedPath}
                          </Badge>
                        </div>
                        {rec.preferredContactTime && (
                          <p className="text-sm mb-2">Preferred time: {rec.preferredContactTime}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(rec.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-4">
                  <span>Newsletter Campaigns</span>
                  <Button onClick={loadCampaigns} variant="outline" size="sm" data-testid="button-load-campaigns">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Create and send newsletters to your contact list. Track opens and sync status to Notion.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Create new campaign */}
                <div className="p-4 border border-white/10 rounded-lg space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create New Campaign
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Campaign Name</label>
                      <Input
                        placeholder="e.g., Q1 2026 Newsletter"
                        value={newCampaignName}
                        onChange={(e) => setNewCampaignName(e.target.value)}
                        data-testid="input-campaign-name"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Email Subject</label>
                      <Input
                        placeholder="Subject line for the email"
                        value={newCampaignSubject}
                        onChange={(e) => setNewCampaignSubject(e.target.value)}
                        data-testid="input-campaign-subject"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">HTML Content (replace placeholder with your message)</label>
                    <textarea
                      className="w-full h-64 p-3 bg-background border border-white/10 rounded-lg font-mono text-sm"
                      value={newCampaignContent}
                      onChange={(e) => setNewCampaignContent(e.target.value)}
                      data-testid="input-campaign-content"
                    />
                  </div>
                  <Button onClick={handleCreateCampaign} disabled={!newCampaignName.trim() || !newCampaignSubject.trim()} data-testid="button-create-campaign">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                </div>

                {/* Existing campaigns list */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Existing Campaigns</h3>
                  {campaignsLoading && <p className="text-muted-foreground">Loading campaigns...</p>}
                  {!campaignsLoading && campaigns.length === 0 && (
                    <p className="text-muted-foreground">No campaigns yet. Create one above or click Refresh.</p>
                  )}
                  <div className="grid gap-3">
                    {campaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedCampaign?.id === campaign.id 
                            ? 'border-primary bg-primary/10' 
                            : 'border-white/10 hover-elevate'
                        }`}
                        onClick={() => loadCampaignDetails(campaign.id)}
                        data-testid={`campaign-card-${campaign.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{campaign.name}</p>
                            <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={campaign.status === 'sent' ? 'default' : campaign.status === 'draft' ? 'secondary' : 'outline'}>
                              {campaign.status}
                            </Badge>
                            {campaign.sentAt && (
                              <span className="text-xs text-muted-foreground">
                                Sent {format(new Date(campaign.sentAt), 'MMM d, yyyy')}
                              </span>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => { e.stopPropagation(); handleDeleteCampaign(campaign.id); }}
                              data-testid={`button-delete-campaign-${campaign.id}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected campaign details */}
                {selectedCampaign && (
                  <div className="p-4 border border-primary/50 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{selectedCampaign.name}</h3>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingCampaign(!editingCampaign)}
                          disabled={selectedCampaign.status === 'sent'}
                          data-testid="button-edit-campaign"
                        >
                          {editingCampaign ? <X className="h-4 w-4 mr-1" /> : <Edit2 className="h-4 w-4 mr-1" />}
                          {editingCampaign ? 'Cancel' : 'Edit'}
                        </Button>
                        {editingCampaign && (
                          <Button size="sm" onClick={handleUpdateCampaign} data-testid="button-save-campaign">
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        )}
                      </div>
                    </div>

                    {editingCampaign && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            value={newCampaignName}
                            onChange={(e) => setNewCampaignName(e.target.value)}
                            placeholder="Campaign name"
                          />
                          <Input
                            value={newCampaignSubject}
                            onChange={(e) => setNewCampaignSubject(e.target.value)}
                            placeholder="Email subject"
                          />
                        </div>
                        <textarea
                          className="w-full h-64 p-3 bg-background border border-white/10 rounded-lg font-mono text-sm"
                          value={newCampaignContent}
                          onChange={(e) => setNewCampaignContent(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Recipients section */}
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <h4 className="font-semibold">Recipients ({campaignRecipients.length})</h4>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleSendTestEmail}
                            data-testid="button-test-email"
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Test Email
                          </Button>
                          {selectedCampaign.status === 'sent' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleResetCampaign}
                              data-testid="button-reset-campaign"
                            >
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Reset to Resend
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handlePopulateRecipients}
                            disabled={populatingRecipients || selectedCampaign.status === 'sent'}
                            data-testid="button-populate-recipients"
                          >
                            <Users className="h-4 w-4 mr-1" />
                            {populatingRecipients ? 'Adding...' : 'Add All Contacts'}
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSendCampaign}
                            disabled={sendingCampaign || selectedCampaign.status === 'sent' || campaignRecipients.filter(r => r.excluded === 'false' && r.status === 'pending').length === 0}
                            data-testid="button-send-campaign"
                          >
                            <Send className="h-4 w-4 mr-1" />
                            {sendingCampaign ? 'Sending...' : `Send to ${campaignRecipients.filter(r => r.excluded === 'false' && r.status === 'pending').length} recipients`}
                          </Button>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="p-3 bg-background/50 rounded-lg text-center">
                          <p className="text-2xl font-bold">{campaignRecipients.length}</p>
                          <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                        <div className="p-3 bg-background/50 rounded-lg text-center">
                          <p className="text-2xl font-bold text-green-500">{campaignRecipients.filter(r => r.status === 'sent').length}</p>
                          <p className="text-xs text-muted-foreground">Sent</p>
                        </div>
                        <div className="p-3 bg-background/50 rounded-lg text-center">
                          <p className="text-2xl font-bold text-blue-500">{campaignRecipients.filter(r => r.openedAt).length}</p>
                          <p className="text-xs text-muted-foreground">Opened</p>
                        </div>
                        <div className="p-3 bg-background/50 rounded-lg text-center">
                          <p className="text-2xl font-bold text-yellow-500">{campaignRecipients.filter(r => r.excluded === 'true').length}</p>
                          <p className="text-xs text-muted-foreground">Excluded</p>
                        </div>
                      </div>

                      {/* Recipient list */}
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {campaignRecipients.map((recipient) => (
                          <div
                            key={recipient.id}
                            className={`flex items-center justify-between p-2 rounded-lg ${
                              recipient.excluded === 'true' ? 'bg-yellow-500/10' : 
                              recipient.status === 'sent' ? 'bg-green-500/10' : 'bg-background/50'
                            }`}
                            data-testid={`recipient-${recipient.email}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-sm">{recipient.email}</span>
                              <Badge variant="outline" className="text-xs">
                                {recipient.status}
                              </Badge>
                              {recipient.openedAt && (
                                <Badge variant="secondary" className="text-xs">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Opened ({recipient.openCount}x)
                                </Badge>
                              )}
                              {recipient.notionSynced === 'true' && (
                                <Badge variant="secondary" className="text-xs">
                                  <Database className="h-3 w-3 mr-1" />
                                  Synced
                                </Badge>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant={recipient.excluded === 'true' ? 'default' : 'ghost'}
                              onClick={() => handleToggleRecipientExclusion(recipient.id, recipient.excluded === 'true')}
                              disabled={recipient.status === 'sent'}
                              data-testid={`button-toggle-exclude-${recipient.id}`}
                            >
                              {recipient.excluded === 'true' ? 'Include' : 'Exclude'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-4">
                  <span>All Contacts (GDPR-Compliant)</span>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search by email or name..."
                      value={contactSearchQuery}
                      onChange={(e) => setContactSearchQuery(e.target.value)}
                      className="w-64"
                      data-testid="input-contact-search"
                    />
                    <Badge variant="secondary">
                      {filteredContacts.length} / {contactsData?.length || 0}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contactsLoading && <p className="text-muted-foreground">Loading...</p>}
                {!contactsLoading && filteredContacts.length === 0 && (
                  <p className="text-muted-foreground">
                    {contactSearchQuery ? "No contacts match your search." : "No contacts yet."}
                  </p>
                )}
                {!contactsLoading && filteredContacts.length > 0 && (
                  <div className="space-y-4">
                    {filteredContacts.map((contact) => (
                      <div 
                        key={contact.id} 
                        className="p-4 rounded-lg bg-background/50 border border-white/10 hover-elevate cursor-pointer"
                        onClick={() => handleViewContactActivity(contact)}
                        data-testid={`contact-card-${contact.email}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{contact.name || "No name"}</p>
                            <p className="text-sm text-muted-foreground">{contact.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="ml-2">
                              {contact.source}
                            </Badge>
                            <Button 
                              size="icon" 
                              variant="ghost"
                              onClick={(e) => { e.stopPropagation(); handleViewContactActivity(contact); }}
                              data-testid={`button-view-activity-${contact.email}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {contact.channelsReached && contact.channelsReached.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {contact.channelsReached.map(ch => (
                              <Badge key={ch} variant="secondary" className="text-xs">{ch}</Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Created: {formatDate(contact.createdAt)}
                          </span>
                          {contact.scanSubmittedAt && (
                            <span className="flex items-center gap-1 text-green-400">
                              <CheckCircle2 className="h-3 w-3" />
                              Scan: {formatDate(contact.scanSubmittedAt)}
                            </span>
                          )}
                          {contact.notionSyncedAt && (
                            <span className="flex items-center gap-1 text-dynamics">
                              <Database className="h-3 w-3" />
                              Notion: {formatDate(contact.notionSyncedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Activity Detail Dialog */}
            <Dialog open={selectedContact !== null} onOpenChange={(open) => !open && setSelectedContact(null)}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Contact Activity: {selectedContact?.email}
                  </DialogTitle>
                </DialogHeader>
                
                {selectedContact && (
                  <div className="space-y-6">
                    {/* Contact Info Panel */}
                    <div className="p-4 rounded-lg bg-background/50 border border-white/10">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Name</p>
                          <p className="font-medium">{selectedContact.name || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="font-medium">{selectedContact.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Source</p>
                          <Badge variant="outline">{selectedContact.source}</Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Created</p>
                          <p className="text-sm">{formatDate(selectedContact.createdAt)}</p>
                        </div>
                      </div>
                      
                      {selectedContact.channelsReached && selectedContact.channelsReached.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs text-muted-foreground mb-2">Channels Reached</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedContact.channelsReached.map(ch => (
                              <Badge key={ch} variant="secondary">{ch}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notion CRM Link */}
                      {contactActivityData?.contact?.notionPageId && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <a 
                            href={`https://notion.so/${contactActivityData.contact.notionPageId.replace(/-/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-dynamics hover:underline"
                            data-testid="link-notion-crm"
                          >
                            <Database className="h-4 w-4" />
                            Open in Notion CRM
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Activity Timeline */}
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Activity Timeline
                      </h3>
                      
                      {loadingContactActivity && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Loading activity...
                        </div>
                      )}
                      
                      {!loadingContactActivity && contactActivityData?.timeline && (
                        <div className="space-y-3">
                          {contactActivityData.timeline.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No activity recorded yet.</p>
                          ) : (
                            contactActivityData.timeline.map((event: any, idx: number) => (
                              <div 
                                key={idx} 
                                className="flex items-start gap-3 p-3 rounded-lg bg-background/30 border border-white/5"
                                data-testid={`activity-event-${idx}`}
                              >
                                <div className="mt-0.5">
                                  {event.type === 'purchase' && <ShoppingCart className="h-4 w-4 text-green-400" />}
                                  {event.type === 'email' && <Mail className="h-4 w-4 text-blue-400" />}
                                  {event.type === 'quiz' && <FileText className="h-4 w-4 text-yellow-400" />}
                                  {event.type === 'waitlist' && <Users className="h-4 w-4 text-purple-400" />}
                                  {event.type === 'newsletter' && <MessageSquare className="h-4 w-4 text-teal-400" />}
                                  {event.type === 'scan_submitted' && <Sparkles className="h-4 w-4 text-orange-400" />}
                                  {event.type === 'notion_sync' && <Database className="h-4 w-4 text-dynamics" />}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{event.title}</p>
                                  {event.description && (
                                    <p className="text-xs text-muted-foreground">{event.description}</p>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {formatDate(event.timestamp)}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSyncContactToNotion(selectedContact.email)}
                        disabled={syncingContact === selectedContact.email}
                        data-testid="button-sync-notion-dialog"
                      >
                        {syncingContact === selectedContact.email ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Database className="h-4 w-4 mr-2" />
                        )}
                        Sync to Notion
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="notion" className="space-y-6">
            <Card className="backdrop-blur-sm bg-dynamics/10 border-dynamics/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-dynamics">
                  <Database className="h-5 w-5" />
                  Notion CRM Integration
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Sync contacts with your Notion CRM database. All contacts are automatically synced when they make purchases or submit forms.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={handleBulkNotionSync}
                    className="bg-dynamics text-white"
                    data-testid="button-bulk-notion-sync"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync All Contacts to Notion
                  </Button>
                  {notionSyncStatus && (
                    <Badge variant={notionSyncStatus.success ? "default" : "destructive"}>
                      {notionSyncStatus.message}
                    </Badge>
                  )}
                </div>
                
                <div className="p-4 rounded-lg bg-background/50 border border-white/10">
                  <h3 className="font-semibold mb-3">How Notion Sync Works</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Automatic:</strong> Contacts sync to Notion when they purchase, sign up for newsletter, or submit forms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Channels Tracked:</strong> Newsletter, Purchase, Quiz, Webinar, Waitlist</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Manual Sync:</strong> Use the "Sync All" button above or sync individual contacts from the Satellitescan tab</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-background/50 border border-white/10">
                  <h3 className="font-semibold mb-3">Notion Database Setup</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your Notion CRM database needs these properties for full sync:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-2">Required Properties:</p>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• <code className="text-xs bg-black/30 px-1 rounded">Email</code> (Email type)</li>
                        <li>• <code className="text-xs bg-black/30 px-1 rounded">Name</code> (Title type)</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-2">Optional Properties:</p>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• <code className="text-xs bg-black/30 px-1 rounded">Channels Reached</code> (Multi-select)</li>
                        <li>• <code className="text-xs bg-black/30 px-1 rounded">Scan Submitted</code> (Date)</li>
                        <li>• <code className="text-xs bg-black/30 px-1 rounded">Consent Given</code> (Checkbox)</li>
                        <li>• <code className="text-xs bg-black/30 px-1 rounded">Source</code> (Select)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <h3 className="font-semibold mb-2 text-green-500">Scan Date Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Scan submission dates sync to the <code className="text-xs bg-black/30 px-1 rounded">label_🛰️ SatelliteScanDone_added_at</code> date field in your Notion CRM.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emails" className="space-y-6">
            {(!emailTemplatesData || emailTemplatesData.length === 0) && (
              <Card className="backdrop-blur-sm bg-needs/10 border-needs/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-needs">
                    <Send className="h-5 w-5" />
                    Quick Start: Seed Onboarding Emails
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Load 10 pre-built Fibonacci-timed onboarding email templates that automatically nurture customers over 87 days.
                  </p>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleSeedEmailTemplates}
                    className="bg-needs text-white"
                    data-testid="button-seed-email-templates"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Seed 10 Fibonacci Templates
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Create Email Template
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Add a new email to the onboarding sequence. Use variables: {`{{customerName}}`}, {`{{firstName}}`}, {`{{productName}}`}, {`{{purchaseDate}}`}, {`{{typeformLink}}`}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateEmailTemplate} className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Sequence #</label>
                      <Input 
                        name="sequenceNumber" 
                        type="number" 
                        placeholder="0" 
                        required 
                        data-testid="input-sequence-number"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Trigger Event</label>
                      <select 
                        name="triggerEvent" 
                        className="w-full px-3 py-2 rounded-md bg-background/50 border border-white/10" 
                        required 
                        data-testid="select-trigger-event"
                      >
                        <option value="purchase">Purchase</option>
                        <option value="scan_completed">Scan Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Delay (minutes)</label>
                      <Input 
                        name="delayMinutes" 
                        type="number" 
                        placeholder="0" 
                        required 
                        data-testid="input-delay-minutes"
                      />
                      <p className="text-xs text-muted-foreground mt-1">0=immediate, 60=1hr, 1440=1day</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Subject Line</label>
                    <Input 
                      name="emailSubject" 
                      placeholder="Welcome to Your Conscious Communication Journey!" 
                      required 
                      data-testid="input-email-subject"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Title (internal reference)</label>
                    <Input 
                      name="emailTitle" 
                      placeholder="Day 0: Welcome Email" 
                      required 
                      data-testid="input-email-title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email Body (HTML)</label>
                    <textarea 
                      name="emailBody" 
                      className="w-full px-3 py-2 rounded-md bg-background/50 border border-white/10 min-h-[200px] font-mono text-sm" 
                      placeholder="<p>Hi {{firstName}},</p><p>Welcome to GreenElephant...</p>"
                      required
                      data-testid="textarea-email-body"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-needs text-white" data-testid="button-create-email-template">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Email Template
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-card/50 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Onboarding Email Sequence
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowScanCompletionPreview(true)}
                    data-testid="button-preview-scan-completion"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Scan Completion Email
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {emailTemplatesData?.filter(t => t.isActive === 'true').length || 0} active templates in sequence
                </p>
              </CardHeader>
              <CardContent>
                {emailTemplatesLoading && <p className="text-muted-foreground">Loading...</p>}
                {!emailTemplatesLoading && (!emailTemplatesData || emailTemplatesData.length === 0) && (
                  <div className="text-center py-8">
                    <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">No email templates yet.</p>
                    <p className="text-sm text-muted-foreground">Create your first template or seed the default sequence!</p>
                  </div>
                )}
                {!emailTemplatesLoading && emailTemplatesData && emailTemplatesData.length > 0 && (
                  <div className="space-y-3">
                    {emailTemplatesData
                      .sort((a, b) => parseInt(a.sequenceNumber) - parseInt(b.sequenceNumber))
                      .map((template) => (
                        <div 
                          key={template.id} 
                          className={`p-4 rounded-lg bg-background/50 border ${template.isActive === 'true' ? 'border-needs/30' : 'border-white/10 opacity-60'}`}
                        >
                          {editingTemplateId === template.id ? (
                            <div className="space-y-3">
                              <div className="grid md:grid-cols-3 gap-3">
                                <Input
                                  type="number"
                                  value={editFormData.sequenceNumber || ''}
                                  onChange={(e) => setEditFormData({...editFormData, sequenceNumber: e.target.value})}
                                  placeholder="Sequence #"
                                  data-testid="input-edit-sequence"
                                />
                                <select
                                  value={editFormData.triggerEvent || ''}
                                  onChange={(e) => setEditFormData({...editFormData, triggerEvent: e.target.value})}
                                  className="px-3 py-2 rounded-md bg-background/50 border border-white/10"
                                  data-testid="select-edit-trigger"
                                >
                                  <option value="purchase">Purchase</option>
                                  <option value="scan_completed">Scan Completed</option>
                                </select>
                                <Input
                                  type="number"
                                  value={editFormData.delayMinutes || ''}
                                  onChange={(e) => setEditFormData({...editFormData, delayMinutes: e.target.value})}
                                  placeholder="Delay (minutes)"
                                  data-testid="input-edit-delay"
                                />
                              </div>
                              <Input
                                value={editFormData.subject || ''}
                                onChange={(e) => setEditFormData({...editFormData, subject: e.target.value})}
                                placeholder="Subject Line"
                                data-testid="input-edit-subject"
                              />
                              <Input
                                value={editFormData.title || ''}
                                onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                                placeholder="Internal Title"
                                data-testid="input-edit-title"
                              />
                              <textarea
                                value={editFormData.body || ''}
                                onChange={(e) => setEditFormData({...editFormData, body: e.target.value})}
                                className="w-full px-3 py-2 rounded-md bg-background/50 border border-white/10 min-h-[150px] font-mono text-sm"
                                placeholder="Email body HTML"
                                data-testid="textarea-edit-body"
                              />
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => handleUpdateEmailTemplate(template)}
                                  className="bg-needs text-white"
                                  data-testid="button-save-template"
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                                <Button 
                                  variant="outline"
                                  onClick={cancelEditingTemplate}
                                  data-testid="button-cancel-edit"
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-start justify-between mb-2 gap-4 flex-wrap">
                                <div className="space-y-1 flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge className="bg-needs/20 text-needs border-needs/30">
                                      #{template.sequenceNumber}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {template.triggerEvent === 'scan_completed' ? 'After Scan' : 'After Purchase'}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      <Clock className="h-3 w-3 mr-1" />
                                      +{formatMinutesToReadable(template.delayMinutes)}
                                    </Badge>
                                    {template.isActive === 'false' && (
                                      <Badge variant="secondary" className="text-xs">Inactive</Badge>
                                    )}
                                  </div>
                                  <h3 className="font-semibold text-lg">{template.subject}</h3>
                                  <p className="text-sm text-muted-foreground">{template.title}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button 
                                    size="icon" 
                                    variant="ghost"
                                    onClick={() => setPreviewTemplate(template)}
                                    data-testid={`button-preview-template-${template.id}`}
                                    title="Preview email"
                                  >
                                    <Eye className="h-4 w-4 text-needs" />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="ghost"
                                    onClick={() => startEditingTemplate(template)}
                                    data-testid={`button-edit-template-${template.id}`}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="ghost"
                                    onClick={() => handleToggleEmailTemplateActive(template)}
                                    data-testid={`button-toggle-template-${template.id}`}
                                  >
                                    <ToggleLeft className={`h-4 w-4 ${template.isActive === 'true' ? 'text-needs' : ''}`} />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="ghost"
                                    onClick={() => handleDeleteEmailTemplate(template.id)}
                                    data-testid={`button-delete-template-${template.id}`}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                              <div className="mt-3 p-3 rounded bg-background/30 border border-white/5">
                                <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                                <div 
                                  className="text-sm prose prose-sm max-w-none dark:prose-invert"
                                  dangerouslySetInnerHTML={{ __html: template.body.substring(0, 300) + (template.body.length > 300 ? '...' : '') }}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Email Preview Dialog */}
      <Dialog open={previewTemplate !== null} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-needs" />
              Email Preview: {previewTemplate?.title}
            </DialogTitle>
          </DialogHeader>
          {previewTemplate && (
            <div className="mt-4">
              <div className="mb-4 p-3 bg-muted rounded-lg text-sm">
                <p><strong>Subject:</strong> {previewTemplate.subject.replace(/\{\{firstName\}\}/g, 'John')}</p>
                <p><strong>Trigger:</strong> {previewTemplate.triggerEvent === 'scan_completed' ? 'After Scan Completion' : 'After Purchase'}</p>
                <p><strong>Delay:</strong> {formatMinutesToReadable(previewTemplate.delayMinutes)} after trigger</p>
                <p><strong>Sequence #:</strong> {previewTemplate.sequenceNumber} of 9</p>
              </div>
              
              {/* Rendered email preview */}
              <div className="border rounded-lg overflow-hidden bg-white">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: `
                      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                        <div style="background: linear-gradient(135deg, #0a1628 0%, #1a6180 100%); padding: 40px 30px; text-align: center;">
                          <img src="https://greenelephant.org/favicon.png" alt="GreenElephant" style="width: 48px; height: 48px; margin-bottom: 15px;">
                          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">GreenElephant</h1>
                          <p style="color: #87CEEB; margin-top: 8px; font-size: 14px;">Conscious Communication</p>
                        </div>
                        <div style="padding: 30px;">
                          ${previewTemplate.body
                            .replace(/\{\{firstName\}\}/g, 'John')
                            .replace(/\{\{customerName\}\}/g, 'John Doe')
                            .replace(/\{\{email\}\}/g, 'john@example.com')}
                        </div>
                        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                          <p style="color: #6b7280; font-size: 12px; margin: 0;">
                            You're receiving this as part of your Satellite Scan onboarding journey.<br>
                            <a href="https://greenelephant.org" style="color: #009999;">GreenElephant.org</a> - Conscious Communication
                          </p>
                          <p style="color: #9ca3af; font-size: 11px; margin-top: 10px;">
                            Email ${previewTemplate.sequenceNumber} of 9 in your onboarding sequence
                          </p>
                        </div>
                      </div>
                    `
                  }} 
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Scan Completion Email Preview Dialog */}
      <Dialog open={showScanCompletionPreview} onOpenChange={setShowScanCompletionPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-needs" />
              Scan Completion Email Preview
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="mb-4 p-3 bg-muted rounded-lg text-sm">
              <p><strong>Subject:</strong> Your Satellite Scan Data is Ready, John!</p>
              <p><strong>Sent:</strong> Immediately after Typeform submission</p>
              <p><strong>CC:</strong> esteve@greenelephant.org, anu@greenelephant.org</p>
            </div>
            
            {/* Rendered scan completion email preview */}
            <div className="border rounded-lg overflow-hidden bg-white">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: `
                    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #ffffff;">
                      <div style="background: linear-gradient(135deg, #0a1628 0%, #1a6180 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome, John!</h1>
                        <p style="color: #87CEEB; margin-top: 10px; font-size: 16px;">Your Satellite Scan is Complete</p>
                      </div>
                      
                      <div style="padding: 30px;">
                        <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                          Congratulations on completing your 90-minute Satellite Scan! Your responses are now safely stored, and we're excited to share them with you immediately.
                        </p>
                        
                        <div style="background-color: #dbeafe; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2563eb;">
                          <h2 style="margin-top: 0; color: #1e40af; font-size: 18px;">What Happens Next?</h2>
                          <p style="margin-bottom: 0; color: #1e3a8a; line-height: 1.6;">
                            <strong>Your personalized dashboard</strong> is being crafted by our human coaches. This isn't automated—we carefully review each response to create a visual map that truly reflects your communication patterns. <strong>Please allow 48-72 hours</strong> for delivery.
                          </p>
                        </div>
                        
                        <div style="background-color: #dcfce7; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #16a34a;">
                          <h2 style="margin-top: 0; color: #166534; font-size: 18px;">Start Exploring Now</h2>
                          <p style="color: #15803d; line-height: 1.6;">
                            While you wait, you can already begin mining your data! Use the prompts on our Resources page:
                          </p>
                          <div style="text-align: center; margin-top: 15px;">
                            <a href="https://greenelephant.org/resources" style="display: inline-block; background-color: #16a34a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Explore Resources & Prompts</a>
                          </div>
                          <p style="color: #15803d; font-size: 14px; margin-top: 15px; margin-bottom: 0;">
                            Copy your data from below and paste it into any of our prompts to unlock insights about your communication style.
                          </p>
                        </div>
                        
                        <div style="background-color: #f3f4f6; padding: 25px; border-radius: 8px; margin: 25px 0;">
                          <h2 style="margin-top: 0; color: #1f2937; font-size: 18px;">Your Quick Summary</h2>
                          <ul style="line-height: 1.8; margin: 0; padding-left: 20px;">
                            <li><strong>Role:</strong> Executive Assistant</li>
                            <li><strong>Job Title:</strong> Senior EA</li>
                            <li><strong>Country:</strong> Germany</li>
                            <li><strong>Education:</strong> Master's Degree</li>
                          </ul>
                        </div>
                        
                        <div style="margin: 30px 0;">
                          <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 15px;">Your Complete Scan Data</h2>
                          <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">
                            This is your raw data—copy and paste it into our prompts or your favorite AI assistant to start discovering patterns.
                          </p>
                          <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                              <thead>
                                <tr style="background-color: #0a1628;">
                                  <th style="padding: 12px; text-align: left; color: #ffffff; font-weight: 600;">Question</th>
                                  <th style="padding: 12px; text-align: left; color: #ffffff; font-weight: 600;">Your Response</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 500; color: #374151;">What is your role?</td>
                                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">Executive Assistant</td>
                                </tr>
                                <tr>
                                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 500; color: #374151;">What communication challenges do you face?</td>
                                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">Managing multiple stakeholders, navigating difficult conversations...</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        
                        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
                          <h3 style="margin-top: 0; color: #92400e; font-size: 16px;">Pro Tip</h3>
                          <p style="margin-bottom: 0; color: #78350f; line-height: 1.6;">
                            Use our <a href="https://chatgpt.com/g/g-bUJ6dvAHK-conscious-communicator" style="color: #2563eb; font-weight: 500;">Conscious Communicator GPT</a> for the best results when exploring your data with prompts from our library.
                          </p>
                        </div>
                        
                        <p style="color: #374151; line-height: 1.6;">
                          Questions about your data or next steps? Just reply to this email—we're here to help.
                        </p>
                        
                        <p style="color: #374151; margin-top: 25px;">
                          Looking forward to your transformation journey,<br>
                          <strong>The GreenElephant Team</strong>
                        </p>
                      </div>
                      
                      <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="color: #6b7280; font-size: 12px; margin: 0;">
                          You're receiving this because you completed the Satellite Scan at GreenElephant.org.<br>
                          Submitted: December 4, 2025 at 7:00 PM
                        </p>
                      </div>
                    </div>
                  `
                }} 
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
