import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Euro,
  ArrowUpDown,
  Search,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

type Purchase = {
  id: string;
  customerEmail: string;
  customerName: string | null;
  amount: string;
  status: string;
  typeformCompleted: string;
  typeformCompletedAt: string | null;
  dashboardSent: string;
  remindersCount: string;
  role: string | null;
  createdAt: string;
};

type SortKey = "createdAt" | "customerName" | "amount" | "typeformCompleted" | "dashboardSent";

function daysBetween(a: string | null, b: string = new Date().toISOString()): number | null {
  if (!a) return null;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

export default function ScanResultsDashboard() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortAsc, setSortAsc] = useState(false);

  const { data: session } = useQuery<{ authenticated: boolean }>({
    queryKey: ["/api/admin/session"],
  });

  const { data: purchases, isLoading, refetch } = useQuery<Purchase[]>({
    queryKey: ["/api/admin/scan-results"],
    enabled: session?.authenticated === true,
  });

  if (session && !session.authenticated) {
    navigate("/admin/login");
    return null;
  }

  const succeeded = (purchases ?? []).filter(p => p.status === "succeeded");
  const totalRevenue = succeeded.reduce((sum, p) => sum + parseFloat(p.amount || "0"), 0);
  const completedCount = succeeded.filter(p => p.typeformCompleted === "true").length;
  const completionRate = succeeded.length > 0 ? Math.round((completedCount / succeeded.length) * 100) : 0;
  const dashboardSentCount = succeeded.filter(p => p.dashboardSent === "true").length;
  const typeformPending = succeeded.filter(p => p.typeformCompleted !== "true").length;

  const completionTimes = succeeded
    .filter(p => p.typeformCompleted === "true" && p.typeformCompletedAt)
    .map(p => daysBetween(p.createdAt, p.typeformCompletedAt!))
    .filter((d): d is number => d !== null);
  const avgDays = completionTimes.length > 0
    ? (completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length).toFixed(1)
    : "—";

  const sorted = [...succeeded]
    .filter(p => {
      const q = search.toLowerCase();
      return (
        p.customerEmail.toLowerCase().includes(q) ||
        (p.customerName ?? "").toLowerCase().includes(q) ||
        (p.role ?? "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let va = "";
      let vb = "";
      if (sortKey === "createdAt") { va = a.createdAt; vb = b.createdAt; }
      else if (sortKey === "customerName") { va = a.customerName ?? ""; vb = b.customerName ?? ""; }
      else if (sortKey === "amount") { return sortAsc ? parseFloat(a.amount) - parseFloat(b.amount) : parseFloat(b.amount) - parseFloat(a.amount); }
      else if (sortKey === "typeformCompleted") { va = a.typeformCompleted; vb = b.typeformCompleted; }
      else if (sortKey === "dashboardSent") { va = a.dashboardSent; vb = b.dashboardSent; }
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(s => !s);
    else { setSortKey(key); setSortAsc(false); }
  }

  function SortBtn({ label, k }: { label: string; k: SortKey }) {
    return (
      <button
        onClick={() => toggleSort(k)}
        className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors"
      >
        {label}
        <ArrowUpDown className="h-3 w-3" />
      </button>
    );
  }

  const stats = [
    { label: "Total Scans Sold", value: succeeded.length, icon: Users, color: "text-needs" },
    { label: "Typeform Completion", value: `${completionRate}%`, icon: TrendingUp, color: "text-flow" },
    { label: "Total Revenue", value: `€${totalRevenue.toFixed(2)}`, icon: Euro, color: "text-attitude" },
    { label: "Avg Days to Complete", value: avgDays, icon: Clock, color: "text-ego" },
  ];

  return (
    <>
      <SEO
        title="Scan Results Dashboard | Admin | GreenElephant"
        description="Admin dashboard for Satellite Scan purchases and completion tracking."
        noIndex
      />
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-bold mb-1">Scan Results Dashboard</h1>
              <p className="text-muted-foreground text-sm">Satellite Scan purchase & completion tracking</p>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" onClick={() => refetch()} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Link href="/admin/submissions">
                <Button size="sm" variant="outline" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  All Submissions
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map(s => {
              const Icon = s.icon;
              return (
                <Card key={s.label} className="bg-white/5 border-white/10">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Icon className={`h-5 w-5 ${s.color}`} />
                    </div>
                    <p className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Typeform Complete", count: completedCount, color: "text-needs", icon: CheckCircle2 },
              { label: "Typeform Pending", count: typeformPending, color: "text-attitude", icon: Clock },
              { label: "Dashboard Sent", count: dashboardSentCount, color: "text-flow", icon: AlertCircle },
            ].map(s => {
              const Icon = s.icon;
              return (
                <Card key={s.label} className="bg-white/5 border-white/10">
                  <CardContent className="p-5 flex items-center gap-4">
                    <Icon className={`h-6 w-6 flex-shrink-0 ${s.color}`} />
                    <div>
                      <p className={`text-xl font-bold ${s.color}`}>{s.count}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mb-4 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email, role…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-white/5 border-white/10"
                data-testid="input-search-scans"
              />
            </div>
            <span className="text-sm text-muted-foreground">{sorted.length} of {succeeded.length}</span>
          </div>

          <Card className="bg-white/5 border-white/10 overflow-hidden">
            {isLoading ? (
              <CardContent className="p-8 text-center text-muted-foreground">Loading…</CardContent>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4"><SortBtn label="Name" k="customerName" /></th>
                      <th className="text-left p-4 hidden md:table-cell"><span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</span></th>
                      <th className="text-left p-4 hidden lg:table-cell"><span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Role</span></th>
                      <th className="text-left p-4"><SortBtn label="Amount" k="amount" /></th>
                      <th className="text-left p-4"><SortBtn label="Purchased" k="createdAt" /></th>
                      <th className="text-left p-4"><SortBtn label="Typeform" k="typeformCompleted" /></th>
                      <th className="text-left p-4"><SortBtn label="Dashboard" k="dashboardSent" /></th>
                      <th className="text-left p-4 hidden md:table-cell"><span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reminders</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map(p => (
                      <tr key={p.id} className="border-b border-white/5 hover-elevate" data-testid={`row-scan-${p.id}`}>
                        <td className="p-4 font-medium">{p.customerName ?? <span className="text-muted-foreground italic">—</span>}</td>
                        <td className="p-4 hidden md:table-cell text-muted-foreground text-xs">{p.customerEmail}</td>
                        <td className="p-4 hidden lg:table-cell text-muted-foreground text-xs">{p.role ?? <span className="italic">—</span>}</td>
                        <td className="p-4 text-needs font-medium">€{parseFloat(p.amount).toFixed(2)}</td>
                        <td className="p-4 text-muted-foreground text-xs">{new Date(p.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
                        <td className="p-4">
                          {p.typeformCompleted === "true" ? (
                            <Badge className="bg-needs/20 text-needs border-needs/30 text-xs">Done</Badge>
                          ) : (
                            <Badge variant="outline" className="text-attitude border-attitude/40 text-xs">Pending</Badge>
                          )}
                        </td>
                        <td className="p-4">
                          {p.dashboardSent === "true" ? (
                            <Badge className="bg-flow/20 text-flow border-flow/30 text-xs">Sent</Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground text-xs">Pending</Badge>
                          )}
                        </td>
                        <td className="p-4 hidden md:table-cell text-muted-foreground text-center text-xs">{p.remindersCount}</td>
                      </tr>
                    ))}
                    {sorted.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-muted-foreground">No results found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

        </div>
      </div>
    </>
  );
}
