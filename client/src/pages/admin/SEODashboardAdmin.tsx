import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminTooltip } from "@/components/AdminTooltip";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search, TrendingUp, Globe, FileText, CheckCircle2, AlertTriangle, ExternalLink, Loader2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useLocation } from "wouter";

interface SEOSuggestion {
  id: string;
  generatorType: string;
  targetPage: string;
  suggestionType: string;
  content: Record<string, unknown>;
  status: string;
  createdAt: string;
}

export default function SEODashboardAdmin() {
  const [, setLocation] = useLocation();

  const { data: suggestions, isLoading } = useQuery<SEOSuggestion[]>({
    queryKey: ["/api/admin/seo-suggestions"],
  });

  const seoChecklist = [
    { label: "Sitemap.xml", status: "ok", href: "/sitemap.xml" },
    { label: "Robots.txt", status: "ok", href: "/robots.txt" },
    { label: "llms.txt (AI readability)", status: "ok", href: "/llms.txt" },
    { label: "Schema.org structured data", status: "ok", href: null },
    { label: "Open Graph meta tags", status: "ok", href: null },
    { label: "Page titles unique", status: "ok", href: null },
    { label: "Meta descriptions on all pages", status: "ok", href: null },
    { label: "Internal linking strategy", status: "partial", href: null },
    { label: "Alt text on images", status: "partial", href: null },
    { label: "Core Web Vitals check", status: "todo", href: "https://pagespeed.web.dev/" },
  ];

  const statusIcon = (s: string) => {
    if (s === "ok") return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (s === "partial") return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
  };

  const keyPages = [
    { path: "/", label: "Homepage" },
    { path: "/scan", label: "Satellite Scan" },
    { path: "/flow-check", label: "FlowCheck" },
    { path: "/connect", label: "Connect / Coaching" },
    { path: "/retreats", label: "Retreats" },
    { path: "/prompts", label: "Prompt Library" },
    { path: "/privacy", label: "Privacy Policy" },
  ];

  return (
    <>
      <SEO title="SEO / GEO Dashboard | GreenElephant Admin" description="Monitor SEO health and Generative Engine Optimization readiness for GreenElephant." />
      <div className="min-h-screen bg-background p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => setLocation("/admin/submissions")} data-testid="button-back-admin">
            <ArrowLeft className="h-4 w-4" />
          </Button></TooltipTrigger><TooltipContent>Back to Admin Hub</TooltipContent></Tooltip>
          <h1 className="text-2xl font-bold font-heading">SEO / GEO Dashboard</h1>
          <AdminTooltip
            what="Search Engine Optimization + Generative Engine Optimization. SEO gets you found on Google; GEO gets you cited by AI assistants (ChatGPT, Gemini, etc.)."
            how="Green checks = done. Yellow triangles = partially done. Review the checklist and AI suggestions below. The Content Flywheel Lab generates SEO/GEO enrichment automatically after each content generation."
            debug={[
              { label: "Content Lab (SEO loop)", href: "/admin/content-lab" },
              { label: "Backlinks Tracker", href: "/admin/backlinks" },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-card/50 border-influence/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-influence" />
                SEO Health Checklist
                <AdminTooltip
                  what="Technical SEO fundamentals for GreenElephant.org."
                  how="Green = implemented. Yellow = needs attention. Click external links to run live checks."
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {seoChecklist.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {statusIcon(item.status)}
                      <span className="text-sm">{item.label}</span>
                    </div>
                    {item.href && (
                      <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => window.open(item.href!, "_blank")} data-testid={`button-check-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                        <ExternalLink className="h-3 w-3" />
                      </Button></TooltipTrigger><TooltipContent>Open {item.label} in a new tab</TooltipContent></Tooltip>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-influence/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-influence" />
                GEO Readiness
                <AdminTooltip
                  what="Generative Engine Optimization — how well AI assistants can understand and cite GreenElephant content."
                  how="llms.txt tells AI bots about your site. /api/services and /api/coaches provide structured machine-readable data. FAQ schema helps AI answer questions about your services."
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { label: "llms.txt published", status: "ok", href: "/llms.txt" },
                  { label: "/api/services endpoint", status: "ok", href: "/api/services" },
                  { label: "/api/coaches endpoint", status: "ok", href: "/api/coaches" },
                  { label: "FAQ structured data", status: "ok", href: null },
                  { label: "BreadcrumbList schema", status: "ok", href: null },
                  { label: "Event schema (webinars)", status: "ok", href: null },
                  { label: "Product/Service schema", status: "ok", href: null },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {statusIcon(item.status)}
                      <span className="text-sm">{item.label}</span>
                    </div>
                    {item.href && (
                      <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => window.open(item.href!, "_blank")} data-testid={`button-geo-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                        <ExternalLink className="h-3 w-3" />
                      </Button></TooltipTrigger><TooltipContent>Open {item.label} in a new tab</TooltipContent></Tooltip>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/50 border-influence/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-influence" />
              Key Pages
              <AdminTooltip
                what="Most important pages to monitor for SEO performance."
                how="Click to preview each page. Use the W3C validator and PageSpeed Insights to audit them."
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {keyPages.map((page) => (
                <button
                  key={page.path}
                  onClick={() => setLocation(page.path)}
                  className="flex items-center gap-2 rounded-md border border-white/10 p-3 text-sm hover-elevate active-elevate-2"
                  data-testid={`button-page-${page.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <FileText className="h-3 w-3 text-muted-foreground" />
                  {page.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-influence/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-influence" />
              AI-Generated SEO Suggestions
              <AdminTooltip
                what="SEO/GEO improvement ideas generated by the Content Flywheel Lab's enrichment loop."
                how="After generating content in the Content Lab, the system automatically suggests keywords, FAQ schemas, and internal linking improvements. Review and apply them here."
                debug={[{ label: "Content Lab", href: "/admin/content-lab" }]}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !suggestions?.length ? (
              <p className="text-sm text-muted-foreground py-4">
                No suggestions yet. Generate content in the Content Flywheel Lab to trigger the SEO enrichment loop.
              </p>
            ) : (
              <div className="space-y-3">
                {suggestions.map((s) => (
                  <div key={s.id} className="flex items-start justify-between gap-3 rounded-md border border-white/10 p-3">
                    <div>
                      <Badge variant="outline" className="mb-1">{s.suggestionType}</Badge>
                      <p className="text-sm">{typeof s.content === "object" ? JSON.stringify(s.content) : String(s.content)}</p>
                      <p className="text-xs text-muted-foreground mt-1">Page: {s.targetPage}</p>
                    </div>
                    <Badge variant="outline" className={s.status === "applied" ? "text-green-400" : s.status === "dismissed" ? "text-muted-foreground" : "text-yellow-400"}>
                      {s.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
