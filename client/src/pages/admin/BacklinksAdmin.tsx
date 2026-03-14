import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AdminTooltip } from "@/components/AdminTooltip";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ArrowLeft, Link2, Plus, Trash2, ExternalLink, Loader2, Globe } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useLocation } from "wouter";
import { useState } from "react";

interface Backlink {
  id: string;
  url: string;
  domain: string;
  status: "live" | "pending" | "broken";
  addedAt: string;
}

export default function BacklinksAdmin() {
  const [, setLocation] = useLocation();
  const [links, setLinks] = useState<Backlink[]>([
    { id: "1", url: "https://arbora.partners/acx100", domain: "arbora.partners", status: "live", addedAt: "2025-12-01" },
    { id: "2", url: "https://csikszentmihalyi.com/flow-resources", domain: "csikszentmihalyi.com", status: "pending", addedAt: "2026-01-15" },
  ]);
  const [newUrl, setNewUrl] = useState("");

  const addLink = () => {
    if (!newUrl) return;
    try {
      const domain = new URL(newUrl).hostname;
      setLinks([...links, {
        id: String(Date.now()),
        url: newUrl,
        domain,
        status: "pending",
        addedAt: new Date().toISOString().split("T")[0],
      }]);
      setNewUrl("");
    } catch {
      // invalid URL
    }
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const statusColor = (s: string) => {
    if (s === "live") return "bg-green-500/10 text-green-400 border-green-500/30";
    if (s === "broken") return "bg-red-500/10 text-red-400 border-red-500/30";
    return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
  };

  return (
    <>
      <SEO title="Backlinks Tracker | GreenElephant Admin" />
      <div className="min-h-screen bg-background p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => setLocation("/admin/submissions")} data-testid="button-back-admin">
            <ArrowLeft className="h-4 w-4" />
          </Button></TooltipTrigger><TooltipContent>Back to Admin Hub</TooltipContent></Tooltip>
          <h1 className="text-2xl font-bold font-heading">Backlinks Tracker</h1>
          <AdminTooltip
            what="Track external websites that link back to GreenElephant.org. Backlinks boost SEO authority."
            how="Add URLs of pages that link to us. Monitor status — 'live' means confirmed, 'pending' means not yet verified, 'broken' means the link no longer works."
          />
        </div>

        <Card className="bg-card/50 border-influence/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-influence" />
              Add Backlink
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 flex-wrap">
              <Input
                placeholder="https://example.com/page-linking-to-us"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="flex-1 min-w-[250px]"
                data-testid="input-backlink-url"
              />
              <Button onClick={addLink} disabled={!newUrl} data-testid="button-add-backlink">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-influence/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-influence" />
              Tracked Backlinks ({links.length})
              <AdminTooltip
                what="All known external pages linking to GreenElephant.org."
                how="Click the external link icon to verify the backlink is still live. Delete broken or irrelevant links."
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {links.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">No backlinks tracked yet.</p>
            ) : (
              <div className="space-y-3">
                {links.map((link) => (
                  <div key={link.id} className="flex items-center justify-between gap-3 rounded-md border border-white/10 p-3 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{link.domain}</p>
                        <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={statusColor(link.status)}>
                        {link.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{link.addedAt}</span>
                      <Button variant="ghost" size="icon" onClick={() => window.open(link.url, "_blank")} data-testid={`button-open-${link.id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeLink(link.id)} data-testid={`button-delete-${link.id}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-influence/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-influence" />
              Outreach Targets
              <AdminTooltip
                what="Websites to approach for guest posts or backlink partnerships."
                how="List target domains where a GreenElephant link would add value. Use the Content Flywheel Lab to generate outreach content."
                debug={[{ label: "Content Lab", href: "/admin/content-lab" }]}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Coming soon: AI-assisted outreach suggestions based on your content topics and the GBR taxonomy.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
