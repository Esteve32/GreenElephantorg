import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  ArrowLeft,
  Linkedin,
  Sparkles,
  Copy,
  Check,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { AdminTooltip } from "@/components/AdminTooltip";

const STORAGE_KEY = "ge-linkedin-copy";
const CHAR_LIMIT = 2000;

const DEFAULT_COPY = `At GreenElephant, we help leaders, executive assistants, and startup founders communicate with more clarity, empathy, and impact.

We built the Periodic Table of Conscious Communication — a framework of 8 lenses (Influence, Attitude, Chaordic, Flow, Alignment, Needs, Ego, and Dynamics) that maps how teams connect, persuade, and collaborate.

Our tools include the Satellite Scan (a communication profiling assessment), Check-my-FLOW (a quick flow-state diagnostic), and the Speech Lab (a decoding hub for analysing real conversations).

Whether you're an EA managing executive relationships, a TEAL organisation founder building self-managing teams, or a design student exploring human-centred communication — there's a lens for you.

Explore the framework at greenelephant.org`;

export default function SocialMediaAdmin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [copy, setCopy] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setCopy(saved || DEFAULT_COPY);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, copy);
  }, [copy]);

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/generate-social-copy", {});
      const data = await res.json();
      return data.copy as string;
    },
    onSuccess: (newCopy: string) => {
      setCopy(newCopy);
      toast({
        title: "Copy generated",
        description: `${newCopy.length} characters — ready to review and copy.`,
      });
    },
    onError: () => {
      toast({
        title: "Generation failed",
        description: "Could not generate copy. Check that the AI service is available.",
        variant: "destructive",
      });
    },
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copy);
      setCopied(true);
      toast({ title: "Copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Copy failed",
        description: "Could not access clipboard.",
        variant: "destructive",
      });
    }
  };

  const charCount = copy.length;
  const isOverLimit = charCount > CHAR_LIMIT;

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="flex items-center gap-4 mb-10">
          <Tooltip><TooltipTrigger asChild><Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/submissions")}
            data-testid="button-back-to-admin"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Admin
          </Button></TooltipTrigger><TooltipContent>Back to Admin Hub</TooltipContent></Tooltip>
          <div>
            <h1 className="text-2xl font-bold">Social Media</h1>
            <p className="text-sm text-white/50">AI-powered LinkedIn profile copy generator</p>
          </div>
          <AdminTooltip
            what="Generate and refine your LinkedIn company About section using AI, aligned with GreenElephant's positioning."
            how="Click 'Generate with AI' for a fresh draft. Edit the text, then copy to clipboard and paste into LinkedIn. Edits auto-save locally."
            debug={[{ label: "LinkedIn Company Page", href: "https://www.linkedin.com/company/greenelephant" }]}
          />
        </div>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0A66C2]/20 border border-[#0A66C2]/30 flex items-center justify-center">
                  <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                </div>
                <div>
                  <CardTitle className="text-white text-base">LinkedIn About Section</CardTitle>
                  <p className="text-xs text-white/40 mt-0.5">Profile copy aligned with GreenElephant positioning</p>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help">
                    <Badge
                      className={`text-xs font-mono ${
                        isOverLimit
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-white/10 text-white/60 border-white/20"
                      }`}
                      data-testid="badge-char-count"
                    >
                      {charCount} / {CHAR_LIMIT}
                    </Badge>
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">LinkedIn's About section allows up to 2,000 characters. Stay under the limit for clean formatting. Best practice: keep it under 1,500 for mobile readability.</TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Textarea
              value={copy}
              onChange={(e) => setCopy(e.target.value)}
              rows={14}
              className="bg-white/5 border-white/10 text-white text-sm leading-relaxed resize-none focus:ring-1 focus:ring-[#0A66C2]/50"
              placeholder="Your LinkedIn About copy will appear here..."
              data-testid="textarea-linkedin-copy"
            />

            {isOverLimit && (
              <p className="text-xs text-red-400" data-testid="text-over-limit">
                Over the 2000-character LinkedIn limit by {charCount - CHAR_LIMIT} characters. Trim before pasting.
              </p>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => generateMutation.mutate()}
                    disabled={generateMutation.isPending}
                    className="bg-[#0A66C2] text-white border-[#0A66C2]"
                    data-testid="button-generate"
                  >
                    {generateMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    {generateMutation.isPending ? "Generating..." : "Generate with AI"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">Generate a fresh LinkedIn About section using AI, grounded in GreenElephant's current services, audiences, and brand voice. Best practice: review and personalize before pasting into LinkedIn.</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={handleCopy}
                    disabled={!copy}
                    className="border-white/20 text-white/70"
                    data-testid="button-copy-clipboard"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 mr-2 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copied ? "Copied" : "Copy to clipboard"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs">Copy the text above to your clipboard, ready to paste into LinkedIn's About section</TooltipContent>
              </Tooltip>
            </div>

            <p className="text-xs text-white/30 pt-2">
              Edits are auto-saved in your browser. Click "Generate with AI" anytime for a fresh rewrite grounded in GreenElephant's current services, audiences, and voice.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
