import { QR_PUBLIC_ORIGIN } from '@shared/qr-campaign';
import { ContextHelp, ActionLearning } from '@/components/admin/ContextHelp';
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AdminTooltip } from "@/components/AdminTooltip";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Loader2,
  QrCode,
  Plus,
  Trash2,
  Download,
  Eye,
  EyeOff,
  Globe,
  Smartphone,
  Monitor,
  MapPin,
  BarChart3,
  Copy,
  ExternalLink,
  Shield,
  Zap,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QrCodeEntry {
  id: string;
  name: string;
  slug: string;
  targetUrl: string;
  type: string;
  description: string | null;
  isActive: string;
  createdAt: string;
  scanCount: number;
}

interface ScanEntry {
  id: string;
  qrCodeId: string;
  ipAddress: string | null;
  userAgent: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  latitude: string | null;
  longitude: string | null;
  isp: string | null;
  deviceType: string | null;
  scannedAt: string;
}

interface ScanAnalytics {
  totalScans: number;
  scans: ScanEntry[];
  analytics: {
    byCountry: [string, number][];
    byCity: [string, number][];
    byDevice: [string, number][];
    byDay: [string, number][];
  };
}

export default function QRCommandCenter() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedQr, setSelectedQr] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<QrCodeEntry | null>(null);
  const [purgeConfirm, setPurgeConfirm] = useState<QrCodeEntry | null>(null);

  const { data: qrCodes, isLoading } = useQuery<QrCodeEntry[]>({
    queryKey: ["/api/admin/qr-codes"],
  });

  const { data: scanData, isLoading: scansLoading } = useQuery<ScanAnalytics>({
    queryKey: ["/api/admin/qr-codes", selectedQr, "scans"],
    enabled: !!selectedQr,
  });

  const seedMasterMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/qr-codes/seed-master", {}),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/qr-codes"] });
      toast({ title: "Master QR Created", description: "Your permanent universal QR code is ready. Print it everywhere." });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not create master QR", variant: "destructive" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: string }) =>
      apiRequest("PATCH", `/api/admin/qr-codes/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/qr-codes"] });
      toast({ title: "Updated", description: "QR code status changed." });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/qr-codes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/qr-codes"] });
      setDeleteConfirm(null);
      if (selectedQr === deleteConfirm?.id) setSelectedQr(null);
      toast({ title: "Deleted", description: "QR code and all scan data removed." });
    },
  });

  const purgeScansMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/qr-codes/${id}/scans`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/qr-codes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/qr-codes", purgeConfirm?.id, "scans"] });
      setPurgeConfirm(null);
      toast({ title: "Scans Purged", description: "The stored scan rows for this QR have been deleted. Hosting logs and backups are separate." });
    },
  });

  const handleCreateQr = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const slug = (form.elements.namedItem("slug") as HTMLInputElement).value;
    const targetUrl = (form.elements.namedItem("targetUrl") as HTMLInputElement).value;
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value;

    try {
      await apiRequest("POST", "/api/admin/qr-codes", {
        name,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, ""),
        targetUrl,
        type: "campaign",
        description: description || null,
      });
      toast({ title: "Campaign QR Created", description: `${name} is ready to use.` });
      form.reset();
      setShowCreateForm(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/qr-codes"] });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Could not create QR code", variant: "destructive" });
    }
  };

  const getBaseUrl = () => {
    return QR_PUBLIC_ORIGIN;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "URL copied to clipboard." });
  };

  const downloadQrImage = async (id: string, slug: string, format: string = "png") => {
    try {
      const response = await fetch(`/api/admin/qr-codes/${id}/image?format=${format}&size=1024`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `greenelephant-qr-${slug}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast({ title: "Error", description: "Could not download QR image", variant: "destructive" });
    }
  };

  const masterQr = qrCodes?.find((q) => q.type === "master");
  const campaignQrs = qrCodes?.filter((q) => q.type !== "master") || [];
  const totalScans = qrCodes?.reduce((sum, q) => sum + q.scanCount, 0) || 0;

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return d;
    }
  };

  const formatDateTime = (d: string) => {
    try {
      return new Date(d).toLocaleString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
    } catch {
      return d;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex items-center gap-3 flex-wrap">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/admin/submissions")}
                data-testid="button-back-admin"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Back to Admin Dashboard</TooltipContent>
          </Tooltip>
          <QrCode className="w-6 h-6 text-[#009999]" />
          <h1 className="text-2xl font-bold font-[Poppins] tracking-tight">QR Command Center</h1>
          <AdminTooltip
            what="QR Code Command Center"
            how="Generate, control, and track QR codes that point to the GreenElephant portal. New link-open records contain only the QR reference and time. No visitor IP, browser, referrer or location is saved by the counter. Older records may contain earlier tracking data; purge them separately when appropriate."
          />
        </div>

        <Card className="bg-black/40 border-white/10"><CardHeader><CardTitle>Purple Kauniainen brochure — keep the printed QR</CardTitle></CardHeader><CardContent className="space-y-3 text-base">
          <Badge variant="outline" className="text-teal-200 border-teal-300/30">Existing QR retained</Badge>
          <p>Keep using the QR already on your brochures. It opens <span className="break-all">https://www.greenelephant.org/</span>.</p>
          <p><strong>Available measure: homepage visits from mixed sources.</strong> A separate brochure-scan count is unavailable because this address has no brochure marker.</p>
          <p>Optional analytics can record homepage visits when collection is enabled and the visitor accepts. It does not count every scan. The campaign counts below cover separate /qr/ links, not this printed QR.</p>
          <ContextHelp label="Homepage visits and brochure scans" meaning="The website sees the same homepage address whether someone scans this QR, types the address or opens a bookmark. It cannot tell those visits apart reliably." example="One brochure reader and one person using a bookmark can both appear as direct or unknown traffic. That label does not prove a brochure scan." action="Check the homepage page views in your existing analytics. Keep them labelled homepage visits. Do not relabel them as brochure scans or create a replacement campaign for this brochure." />
          <Button variant="outline" onClick={() => setLocation('/admin/analytics')}>Open analytics setup and status</Button>
        </CardContent></Card>
        <ActionLearning task="For a separate campaign QR, open its Analytics view and compare its count before and after one test open. Your own test adds to the total." check="A separate /qr/ link can count opens of that link. The homepage QR on the current brochure does not use that counter. Shared links and repeat visits can add more opens; camera previews that never open the page cannot be counted." />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="bg-black/40 border-white/10 backdrop-blur-md">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#009999]/10 flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-[#009999]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-total-qr-codes">{qrCodes?.length || 0}</p>
                    <p className="text-xs text-white/50">Total QR Codes</p>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>Number of QR codes in the system (master + campaigns)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="bg-black/40 border-white/10 backdrop-blur-md">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#009999]/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-[#009999]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-total-scans">{totalScans}</p>
                    <p className="text-xs text-white/50">Link opens</p>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>Counted link requests. Repeats, shared links and bots can be included; this is not a count of unique people or proven camera scans.</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="bg-black/40 border-white/10 backdrop-blur-md">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#009999]/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#009999]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-gdpr-status">No visitor profile</p>
                    <p className="text-xs text-white/50">New counter records</p>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>New records keep the QR reference and time only. Hosting logs and older records are separate. This screen does not certify legal compliance.</TooltipContent>
          </Tooltip>
        </div>

        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
          <CardHeader>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#009999]/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#009999]" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg">Master QR Code</CardTitle>
                  <p className="text-sm text-white/50 mt-0.5">One QR to rule them all — always points to the portal login</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#009999]" />
              </div>
            ) : masterQr ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white/80" data-testid="text-master-qr-name">{masterQr.name}</p>
                    <p className="text-xs text-white/40">{masterQr.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={masterQr.isActive === "true" ? "default" : "destructive"}>
                        {masterQr.isActive === "true" ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline" className="border-[#009999]/30 text-[#009999]">
                        {masterQr.scanCount} link opens
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(`${getBaseUrl()}/qr/${masterQr.slug}`)}
                          data-testid="button-copy-master-url"
                        >
                          <Copy className="w-3.5 h-3.5 mr-1" /> Copy URL
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy the redirect URL to clipboard</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadQrImage(masterQr.id, masterQr.slug, "png")}
                          data-testid="button-download-master-png"
                        >
                          <Download className="w-3.5 h-3.5 mr-1" /> PNG
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download QR code as high-res PNG image</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadQrImage(masterQr.id, masterQr.slug, "svg")}
                          data-testid="button-download-master-svg"
                        >
                          <Download className="w-3.5 h-3.5 mr-1" /> SVG
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download QR code as SVG (scalable for print)</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedQr(selectedQr === masterQr.id ? null : masterQr.id)}
                          data-testid="button-view-master-scans"
                        >
                          <BarChart3 className="w-3.5 h-3.5 mr-1" /> Analytics
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View scan analytics for this QR code</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-white/50 font-mono break-all" data-testid="text-master-qr-url">
                    {getBaseUrl()}/qr/{masterQr.slug}
                  </p>
                  <p className="text-xs text-white/30 mt-1">
                    Redirects to: <span className="text-white/50">{masterQr.targetUrl}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={masterQr.isActive === "true"}
                    onCheckedChange={(checked) =>
                      toggleActiveMutation.mutate({ id: masterQr.id, isActive: checked ? "true" : "false" })
                    }
                    data-testid="switch-master-active"
                  />
                  <span className="text-sm text-white/60">
                    {masterQr.isActive === "true" ? "QR is active and tracking scans" : "QR is paused — scans redirect to login without tracking"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <QrCode className="w-12 h-12 text-white/20 mx-auto" />
                <p className="text-sm text-white/50">No master QR code exists yet.</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => seedMasterMutation.mutate()}
                      disabled={seedMasterMutation.isPending}
                      data-testid="button-create-master-qr"
                    >
                      {seedMasterMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
                      Create Master QR Code
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Creates the permanent universal QR code pointing to /portal/login</TooltipContent>
                </Tooltip>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedQr && (
          <Card className="bg-black/40 border-white/10 backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#009999]/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-[#009999]" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">Scan Analytics</CardTitle>
                    <p className="text-sm text-white/50 mt-0.5">
                      {qrCodes?.find((q) => q.id === selectedQr)?.name || "Selected QR"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400/80"
                        onClick={() => setPurgeConfirm(qrCodes?.find((q) => q.id === selectedQr) || null)}
                        data-testid="button-purge-scans"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Purge Data
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete the stored scan rows for this QR. Hosting logs and backups are separate.</TooltipContent>
                  </Tooltip>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedQr(null)} data-testid="button-close-analytics">
                    Close
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {scansLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#009999]" />
                </div>
              ) : scanData ? (
                <div className="space-y-4">
                  <p className="text-base text-white/80">These are link opens, not unique people, proven camera scans or purchases. Repeat opens, shared links and bots can add to the count. Location and device details below, if any, come from older records.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                      <p className="text-xl font-bold text-[#009999]" data-testid="text-analytics-total">{scanData.totalScans}</p>
                      <p className="text-xs text-white/40">Link opens</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                      <p className="text-xl font-bold text-white/80" data-testid="text-analytics-countries">{scanData.analytics.byCountry.length}</p>
                      <p className="text-xs text-white/40">Legacy countries</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                      <p className="text-xl font-bold text-white/80" data-testid="text-analytics-cities">{scanData.analytics.byCity.length}</p>
                      <p className="text-xs text-white/40">Legacy cities</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                      <p className="text-xl font-bold text-white/80" data-testid="text-analytics-devices">
                        {scanData.analytics.byDevice.length}
                      </p>
                      <p className="text-xs text-white/40">Legacy device types</p>
                    </div>
                  </div>

                  {scanData.analytics.byCountry.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-white/70 flex items-center gap-2">
                        <Globe className="w-4 h-4" /> Top Countries
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {scanData.analytics.byCountry.slice(0, 10).map(([country, count]) => (
                          <Badge key={country} variant="outline" className="border-white/20">
                            {country}: {count}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {scanData.analytics.byCity.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-white/70 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Top Cities
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {scanData.analytics.byCity.slice(0, 10).map(([city, count]) => (
                          <Badge key={city} variant="outline" className="border-white/20">
                            {city}: {count}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {scanData.analytics.byDevice.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-white/70 flex items-center gap-2">
                        <Smartphone className="w-4 h-4" /> Devices
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {scanData.analytics.byDevice.map(([device, count]) => (
                          <Badge key={device} variant="outline" className="border-white/20">
                            {device === "mobile" ? <Smartphone className="w-3 h-3 mr-1" /> : <Monitor className="w-3 h-3 mr-1" />}
                            {device}: {count}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {scanData.analytics.byDay.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-white/70">Daily link opens (UTC)</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                        {scanData.analytics.byDay.slice(-14).map(([day, count]) => (
                          <div key={day} className="p-2 rounded bg-white/5 border border-white/10 text-center">
                            <p className="text-xs text-white/40">{day.slice(5)}</p>
                            <p className="text-sm font-bold text-white/80">{count}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {scanData.scans.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-white/70">Recent link opens — older rows may include visitor details</p>
                      <div className="rounded-lg border border-white/10 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-white/10 bg-white/5">
                                <th className="p-2 text-left text-white/50">Time</th>
                                <th className="p-2 text-left text-white/50">Legacy IP hash</th>
                                <th className="p-2 text-left text-white/50">Legacy location</th>
                                <th className="p-2 text-left text-white/50">Legacy device</th>
                                <th className="p-2 text-left text-white/50">Legacy ISP</th>
                              </tr>
                            </thead>
                            <tbody>
                              {scanData.scans.slice(0, 25).map((scan) => (
                                <tr key={scan.id} className="border-b border-white/5">
                                  <td className="p-2 text-white/60">{formatDateTime(scan.scannedAt)}</td>
                                  <td className="p-2 text-white/60 font-mono">{scan.ipAddress || "—"}</td>
                                  <td className="p-2 text-white/60">
                                    {[scan.city, scan.region, scan.country].filter(Boolean).join(", ") || "—"}
                                  </td>
                                  <td className="p-2 text-white/60">{scan.deviceType || "—"}</td>
                                  <td className="p-2 text-white/60">{scan.isp || "—"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {scanData.totalScans === 0 && (
                    <div className="text-center py-6">
                      <BarChart3 className="w-10 h-10 text-white/20 mx-auto mb-2" />
                      <p className="text-sm text-white/40">No link opens recorded yet. Test the published QR address before sharing it.</p>
                    </div>
                  )}
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}

        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
          <CardHeader>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg">Campaign QR Codes</CardTitle>
                  <p className="text-sm text-white/50 mt-0.5">Create targeted QR codes for specific campaigns, events, or channels</p>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    data-testid="button-toggle-create-form"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    New Campaign QR
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Create a new campaign-specific QR code</TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showCreateForm && (
              <form onSubmit={handleCreateQr} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="qr-name" className="text-base text-white/80 mb-1 block">Campaign Name</label>
                    <Input
                      id="qr-name" name="name"
                      placeholder="e.g. Barcelona Retreat Jan 2027"
                      required
                      className="bg-white/5 border-white/20 text-white"
                      data-testid="input-campaign-name"
                    />
                  </div>
                  <div>
                    <label htmlFor="qr-slug" className="text-base text-white/80 mb-1 block">Slug (URL-safe identifier)</label>
                    <Input
                      id="qr-slug" name="slug"
                      placeholder="e.g. barcelona-retreat-2027"
                      required
                      pattern="[a-z0-9-]+"
                      className="bg-white/5 border-white/20 text-white"
                      data-testid="input-campaign-slug"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="qr-targetUrl" className="text-base text-white/80 mb-1 block">Target URL (where the QR redirects to)</label>
                  <Input
                    id="qr-targetUrl" name="targetUrl"
                    placeholder="/portal/login or https://greenelephant.org/scan"
                    required
                    className="bg-white/5 border-white/20 text-white"
                    data-testid="input-campaign-target"
                  />
                </div>
                <div>
                  <label htmlFor="qr-description" className="text-base text-white/80 mb-1 block">Description (optional)</label>
                  <Textarea
                    id="qr-description" name="description"
                    placeholder="What is this QR code for?"
                    className="bg-white/5 border-white/20 text-white resize-none"
                    rows={2}
                    data-testid="input-campaign-description"
                  />
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreateForm(false)} data-testid="button-cancel-create">
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" data-testid="button-submit-create">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Create QR Code
                  </Button>
                </div>
              </form>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#009999]" />
              </div>
            ) : campaignQrs.length === 0 ? (
              <div className="text-center py-8">
                <Globe className="w-10 h-10 text-white/20 mx-auto mb-2" />
                <p className="text-sm text-white/40">No campaign QR codes yet. Create one for a specific event or channel.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {campaignQrs.map((qr) => (
                  <div
                    key={qr.id}
                    className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2"
                    data-testid={`card-qr-campaign-${qr.id}`}
                  >
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <p className="text-sm font-medium text-white/80">{qr.name}</p>
                        {qr.description && <p className="text-xs text-white/40 mt-0.5">{qr.description}</p>}
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant={qr.isActive === "true" ? "default" : "destructive"}>
                            {qr.isActive === "true" ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline" className="border-white/20">
                            {qr.scanCount} link opens
                          </Badge>
                          <span className="text-xs text-white/30">{formatDate(qr.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(`${getBaseUrl()}/qr/${qr.slug}`)}>
                              <Copy className="w-3.5 h-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy QR URL</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => downloadQrImage(qr.id, qr.slug, "png")}>
                              <Download className="w-3.5 h-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Download PNG</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedQr(selectedQr === qr.id ? null : qr.id)}
                            >
                              <BarChart3 className="w-3.5 h-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View scan analytics</TooltipContent>
                        </Tooltip>
                        <Switch
                          checked={qr.isActive === "true"}
                          onCheckedChange={(checked) =>
                            toggleActiveMutation.mutate({ id: qr.id, isActive: checked ? "true" : "false" })
                          }
                        />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-400/80"
                              onClick={() => setDeleteConfirm(qr)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete this QR code and all its scan data</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="text-xs font-mono text-white/30 break-all">
                      {getBaseUrl()}/qr/{qr.slug} → {qr.targetUrl}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white/60" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">GDPR & Data Ethics</CardTitle>
                <p className="text-sm text-white/50 mt-0.5">How QR scan data is handled</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-base text-white/80">
            <p>New counter records contain the campaign’s QR reference and the time of the link open. The counter does not save visitor IPs, IP hashes, browser details, referrers or location, and does not contact a location service.</p>
            <p>The counter sets no cookies. Hosting/security logs and the site’s separate optional analytics have their own controls. Existing scan rows can still contain data collected by the earlier implementation.</p>
            <p>Use Purge Data to remove stored scan rows for a campaign. This does not erase hosting logs or backups, or certify legal compliance. Review the notice and retention arrangements before release.</p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-gray-950 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Delete QR Code?
            </DialogTitle>
            <DialogDescription className="text-white/60">
              This will permanently delete <strong className="text-white/80">{deleteConfirm?.name}</strong> and all {deleteConfirm?.scanCount || 0} scan records. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)} data-testid="button-cancel-delete">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm.id)}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Trash2 className="w-4 h-4 mr-1" />}
              Delete Forever
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!purgeConfirm} onOpenChange={() => setPurgeConfirm(null)}>
        <DialogContent className="bg-gray-950 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#009999]" />
              Purge Scan Data?
            </DialogTitle>
            <DialogDescription className="text-white/60">
              This will permanently delete all scan records for <strong className="text-white/80">{purgeConfirm?.name}</strong>.
              The QR code itself will remain active. Hosting logs and backups are separate from these rows.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setPurgeConfirm(null)} data-testid="button-cancel-purge">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => purgeConfirm && purgeScansMutation.mutate(purgeConfirm.id)}
              disabled={purgeScansMutation.isPending}
              data-testid="button-confirm-purge"
            >
              {purgeScansMutation.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Trash2 className="w-4 h-4 mr-1" />}
              Purge All Scan Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
