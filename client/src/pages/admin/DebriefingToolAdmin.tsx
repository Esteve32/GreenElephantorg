import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AdminTooltip } from "@/components/AdminTooltip";
import {
  ArrowLeft,
  ClipboardCheck,
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Download,
  Send,
  BarChart3,
  Target,
  Clock,
  Star,
  Info,
  Loader2,
} from "lucide-react";

interface DebriefEntry {
  id: string;
  clientName: string;
  sessionNumber: number;
  lens: string | null;
  keyInsights: string | null;
  actionItems: string[] | null;
  coachNotes: string | null;
  progress: number | null;
  status: string | null;
  createdAt: string;
  updatedAt: string;
}

const LENS_COLORS: Record<string, string> = {
  Influence: "text-influence bg-influence/10 border-influence/30",
  Attitude: "text-attitude bg-attitude/10 border-attitude/30",
  Chaordic: "text-chaordic bg-chaordic/10 border-chaordic/30",
  Flow: "text-flow bg-flow/10 border-flow/30",
  Alignment: "text-alignment bg-alignment/10 border-alignment/30",
  Needs: "text-needs bg-needs/10 border-needs/30",
  Ego: "text-ego bg-ego/10 border-ego/30",
  Dynamics: "text-dynamics bg-dynamics/10 border-dynamics/30",
};

const STATUS_STYLES: Record<string, string> = {
  draft: "text-muted-foreground bg-muted/20 border-muted/30",
  reviewed: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  shared: "text-green-400 bg-green-500/10 border-green-500/30",
};

export default function DebriefingToolAdmin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    clientName: "",
    sessionNumber: 1,
    lens: "Flow",
    keyInsights: "",
    actionItems: [""],
    progress: 3,
    coachNotes: "",
  });

  const { data: debriefs = [], isLoading } = useQuery<DebriefEntry[]>({
    queryKey: ["/api/admin/debriefs"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/debriefs", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/debriefs"] });
      setShowNewForm(false);
      setNewEntry({ clientName: "", sessionNumber: 1, lens: "Flow", keyInsights: "", actionItems: [""], progress: 3, coachNotes: "" });
      toast({ title: "Debrief saved", description: "Session debrief has been recorded." });
    },
    onError: (error: any) => {
      toast({ title: "Failed to save debrief", description: error.message || "Please try again.", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const res = await apiRequest("PATCH", `/api/admin/debriefs/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/debriefs"] });
      toast({ title: "Debrief updated" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update debrief", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/debriefs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/debriefs"] });
      toast({ title: "Debrief deleted" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete debrief", description: error.message, variant: "destructive" });
    },
  });

  const handleAddActionItem = () => {
    setNewEntry(prev => ({ ...prev, actionItems: [...prev.actionItems, ""] }));
  };

  const handleRemoveActionItem = (index: number) => {
    setNewEntry(prev => ({
      ...prev,
      actionItems: prev.actionItems.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateActionItem = (index: number, value: string) => {
    setNewEntry(prev => ({
      ...prev,
      actionItems: prev.actionItems.map((item, i) => i === index ? value : item),
    }));
  };

  const handleSubmitDebrief = () => {
    if (!newEntry.clientName || !newEntry.keyInsights) return;
    createMutation.mutate({
      clientName: newEntry.clientName,
      sessionNumber: newEntry.sessionNumber,
      lens: newEntry.lens,
      keyInsights: newEntry.keyInsights,
      actionItems: newEntry.actionItems.filter(a => a.trim()),
      coachNotes: newEntry.coachNotes,
      progress: newEntry.progress,
      status: "draft",
    });
  };

  const totalSessions = debriefs.length;
  const avgProgress = debriefs.length > 0
    ? (debriefs.reduce((sum, d) => sum + (d.progress || 3), 0) / debriefs.length).toFixed(1)
    : "0";
  const uniqueClients = new Set(debriefs.map(d => d.clientName)).size;

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center gap-3 flex-wrap">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setLocation("/admin/submissions")} data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Back to Admin OS dashboard</TooltipContent>
          </Tooltip>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold font-['Poppins'] flex items-center gap-2">
              <ClipboardCheck className="h-6 w-6 text-needs" />
              Debriefing Tool
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track coaching session debriefs, action items, and client progress across the journey.
            </p>
          </div>
          <AdminTooltip
            what="Record post-session notes, track action items, and monitor client progress across their coaching journey."
            how="Best practice: Create a debrief within 24 hours of each coaching session while insights are fresh. Rate progress honestly (1-5) to spot trends. Move status from Draft to Reviewed after self-check, then to Shared once emailed to the client."
            debug={[
              { label: "Coaching Cockpit", href: "/admin/coaching-cockpit" },
              { label: "Testimonials", href: "/admin/testimonials" },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-2 rounded-md bg-needs/10 cursor-help">
                      <Users className="h-5 w-5 text-needs" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Number of unique clients with at least one debrief on file</TooltipContent>
                </Tooltip>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-unique-clients">{uniqueClients}</p>
                  <p className="text-xs text-muted-foreground">Active Clients</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-2 rounded-md bg-flow/10 cursor-help">
                      <MessageSquare className="h-5 w-5 text-flow" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Total number of coaching sessions debriefed so far</TooltipContent>
                </Tooltip>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-sessions">{totalSessions}</p>
                  <p className="text-xs text-muted-foreground">Session Debriefs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-2 rounded-md bg-alignment/10 cursor-help">
                      <TrendingUp className="h-5 w-5 text-alignment" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Average progress rating across all debriefs. Aim for 3.5+ over time — steady growth matters more than perfection.</TooltipContent>
                </Tooltip>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-avg-progress">{avgProgress}/5</p>
                  <p className="text-xs text-muted-foreground">Avg Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-lg font-semibold font-['Poppins']">Session Debriefs</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => setShowNewForm(!showNewForm)} data-testid="button-new-debrief">
                <Plus className="h-4 w-4 mr-2" />
                New Debrief
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Create a new post-session debrief. Best practice: do this within 24 hours of the session.</TooltipContent>
          </Tooltip>
        </div>

        {showNewForm && (
          <Card className="border-needs/30 backdrop-blur-sm bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5 text-needs" />
                New Session Debrief
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <label className="text-sm text-muted-foreground">Client Name</label>
                    <AdminTooltip
                      what="Use the format: First name + last initial + company. E.g. 'Sarah M. (TechCorp)'"
                      how="Best practice: Keep names consistent across debriefs so you can track the same client over multiple sessions."
                      side="right"
                      iconSize="h-3 w-3"
                    />
                  </div>
                  <Input
                    value={newEntry.clientName}
                    onChange={(e: any) => setNewEntry(prev => ({ ...prev, clientName: e.target.value }))}
                    placeholder="e.g. Sarah M. (TechCorp)"
                    data-testid="input-client-name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <label className="text-sm text-muted-foreground">Session #</label>
                      <AdminTooltip
                        what="Which session number is this in the client's coaching journey?"
                        how="Session 1 = initial scan debrief. Sessions 2-5 = mid-journey. Session 6+ = journey completion or follow-up."
                        side="right"
                        iconSize="h-3 w-3"
                      />
                    </div>
                    <Input
                      type="number"
                      min={1}
                      value={newEntry.sessionNumber}
                      onChange={e => setNewEntry(prev => ({ ...prev, sessionNumber: parseInt(e.target.value) || 1 }))}
                      data-testid="input-session-number"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <label className="text-sm text-muted-foreground">Lens</label>
                      <AdminTooltip
                        what="Which of the 8 communication lenses was the focus of this session?"
                        how="Best practice: Match the lens to the client's primary growth area from their Satellite Scan results."
                        side="right"
                        iconSize="h-3 w-3"
                      />
                    </div>
                    <select
                      className="w-full rounded-md bg-background border border-border px-3 py-2 text-sm"
                      value={newEntry.lens}
                      onChange={e => setNewEntry(prev => ({ ...prev, lens: e.target.value }))}
                      data-testid="select-lens"
                    >
                      {Object.keys(LENS_COLORS).map(lens => (
                        <option key={lens} value={lens}>{lens}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <label className="text-sm text-muted-foreground">Key Insight</label>
                  <AdminTooltip
                    what="The single most important discovery or breakthrough from this session."
                    how="Best practice: Write one sentence about what the client realized, then one sentence about the root cause. Example: 'Discovered pattern of interrupting. Root cause: anxiety about being perceived as uninformed.'"
                    side="right"
                    iconSize="h-3 w-3"
                  />
                </div>
                <Textarea
                  value={newEntry.keyInsights}
                  onChange={(e: any) => setNewEntry(prev => ({ ...prev, keyInsights: e.target.value }))}
                  placeholder="What was the main breakthrough or discovery this session?"
                  data-testid="input-key-insight"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <label className="text-sm text-muted-foreground">Action Items</label>
                  <AdminTooltip
                    what="Concrete next steps the client committed to before the next session."
                    how="Best practice: Keep to 2-4 items max. Each should be specific, measurable, and achievable within 1-2 weeks. Start with a verb (Practice, Record, Read, Write)."
                    side="right"
                    iconSize="h-3 w-3"
                  />
                </div>
                {newEntry.actionItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={item}
                      onChange={e => handleUpdateActionItem(i, e.target.value)}
                      placeholder={`Action item ${i + 1}`}
                      data-testid={`input-action-item-${i}`}
                    />
                    {newEntry.actionItems.length > 1 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveActionItem(i)} data-testid={`button-remove-action-${i}`}>
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Remove this action item</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                ))}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={handleAddActionItem} data-testid="button-add-action-item">
                      <Plus className="h-3.5 w-3.5 mr-1.5" /> Add action item
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add another action item. Keep to 2-4 items per session for best results.</TooltipContent>
                </Tooltip>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <label className="text-sm text-muted-foreground">Progress Rating (1-5)</label>
                  <AdminTooltip
                    what="Rate the client's overall progress this session on a 1-5 scale."
                    how="1 = No change or regression. 2 = Awareness but no action yet. 3 = Starting to apply changes. 4 = Consistent improvement visible. 5 = Breakthrough / mastery."
                    side="right"
                    iconSize="h-3 w-3"
                  />
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <Tooltip key={rating}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setNewEntry(prev => ({ ...prev, progress: rating }))}
                          data-testid={`button-rating-${rating}`}
                        >
                          <Star
                            className={`h-5 w-5 ${rating <= newEntry.progress ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {rating === 1 && "No change or regression"}
                        {rating === 2 && "Awareness, no action yet"}
                        {rating === 3 && "Starting to apply changes"}
                        {rating === 4 && "Consistent improvement"}
                        {rating === 5 && "Breakthrough / mastery"}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">{newEntry.progress}/5</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <label className="text-sm text-muted-foreground">Coach Notes</label>
                  <AdminTooltip
                    what="Private notes for the coach — not shared with the client unless you choose to."
                    how="Best practice: Note patterns you're observing across sessions, anything to revisit next time, and potential testimonial-worthy quotes from the client."
                    side="right"
                    iconSize="h-3 w-3"
                  />
                </div>
                <Textarea
                  value={newEntry.coachNotes}
                  onChange={(e: any) => setNewEntry(prev => ({ ...prev, coachNotes: e.target.value }))}
                  placeholder="Additional observations, patterns, or follow-up items..."
                  data-testid="input-notes"
                />
              </div>

              <div className="flex items-center gap-3 pt-2 flex-wrap">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleSubmitDebrief} disabled={createMutation.isPending} data-testid="button-save-debrief">
                      {createMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ClipboardCheck className="h-4 w-4 mr-2" />}
                      {createMutation.isPending ? "Saving..." : "Save Debrief"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save this debrief as a draft. You can review and share it later.</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" onClick={() => setShowNewForm(false)} data-testid="button-cancel-debrief">
                      Cancel
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Discard this debrief and close the form</TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        <div className="space-y-3">
          {debriefs.map(debrief => {
            const isExpanded = expandedId === debrief.id;
            const lensColor = LENS_COLORS[debrief.lens || "Flow"] || LENS_COLORS.Flow;
            const statusStyle = STATUS_STYLES[debrief.status || "draft"] || STATUS_STYLES.draft;
            const progressVal = debrief.progress || 3;
            const dateStr = debrief.createdAt ? new Date(debrief.createdAt).toISOString().slice(0, 10) : "";

            return (
              <Card
                key={debrief.id}
                className="backdrop-blur-sm bg-card/50 border-white/10 hover-elevate cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : debrief.id)}
                data-testid={`card-debrief-${debrief.id}`}
              >
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="font-medium truncate" data-testid={`text-client-${debrief.id}`}>{debrief.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span><Badge variant="outline" className={lensColor} data-testid={`badge-lens-${debrief.id}`}>
                            {debrief.lens || "Flow"}
                          </Badge></span>
                        </TooltipTrigger>
                        <TooltipContent>Communication lens focus for this session</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span><Badge variant="outline" className={statusStyle}>
                            {debrief.status}
                          </Badge></span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {debrief.status === 'draft' && "Draft — not yet reviewed by coach"}
                          {debrief.status === 'reviewed' && "Reviewed — coach has checked notes, ready to share"}
                          {debrief.status === 'shared' && "Shared — summary sent to client or team"}
                        </TooltipContent>
                      </Tooltip>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Session {debrief.sessionNumber}
                      </span>
                      <span className="text-xs text-muted-foreground">{dateStr}</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-0.5 cursor-help">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star
                                key={s}
                                className={`h-3 w-3 ${s <= progressVal ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/20'}`}
                              />
                            ))}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Progress rating: {progressVal}/5</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-4" onClick={e => e.stopPropagation()}>
                      <div className="space-y-1.5">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                          <Target className="h-3 w-3" /> Key Insight
                        </p>
                        <p className="text-sm leading-relaxed">{debrief.keyInsights}</p>
                      </div>

                      {debrief.actionItems && debrief.actionItems.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                            <ClipboardCheck className="h-3 w-3" /> Action Items
                          </p>
                          <ul className="space-y-1">
                            {debrief.actionItems.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-needs mt-1.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {debrief.coachNotes && (
                        <div className="space-y-1.5">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                            <MessageSquare className="h-3 w-3" /> Coach Notes
                          </p>
                          <p className="text-sm leading-relaxed text-muted-foreground">{debrief.coachNotes}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2 flex-wrap">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const nextStatus = debrief.status === 'draft' ? 'reviewed' : debrief.status === 'reviewed' ? 'shared' : 'draft';
                                updateMutation.mutate({ id: debrief.id, status: nextStatus });
                              }}
                              data-testid={`button-status-${debrief.id}`}
                            >
                              {debrief.status === 'draft' ? 'Mark Reviewed' : debrief.status === 'reviewed' ? 'Mark Shared' : 'Reset to Draft'}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {debrief.status === 'draft' && "Mark as reviewed — confirms you've checked all notes and action items are accurate"}
                            {debrief.status === 'reviewed' && "Mark as shared — use after emailing the summary to the client"}
                            {debrief.status === 'shared' && "Reset to draft — use if you need to make corrections"}
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant="ghost" data-testid={`button-export-${debrief.id}`}>
                              <Download className="h-3.5 w-3.5 mr-1.5" /> Export
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Download this debrief as a PDF — useful for client records or coaching portfolio</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant="ghost" data-testid={`button-email-${debrief.id}`}>
                              <Send className="h-3.5 w-3.5 mr-1.5" /> Email Summary
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Send a formatted summary email to the client with key insight and action items</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => {
                                if (confirm("Delete this debrief? This cannot be undone.")) {
                                  deleteMutation.mutate(debrief.id);
                                }
                              }}
                              data-testid={`button-delete-${debrief.id}`}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Permanently delete this debrief record</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {debriefs.length === 0 && (
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardContent className="py-12 text-center">
              <ClipboardCheck className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No debriefs yet. Create your first one after a coaching session.</p>
            </CardContent>
          </Card>
        )}

        <Card className="backdrop-blur-sm bg-needs/5 border-needs/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-needs" />
                Debriefing Workflow
              </CardTitle>
              <AdminTooltip
                what="The recommended 4-step workflow for processing each coaching session."
                how="Best practice: Complete all 4 steps within 48 hours of the session. The 'Share' step is especially important — clients who receive a written summary retain 3x more from the session."
                side="right"
                iconSize="h-3 w-3"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                { step: "1", title: "Session Complete", desc: "Coaching session wraps up", icon: Calendar, tip: "Immediately after the session, jot down 2-3 raw impressions before they fade" },
                { step: "2", title: "Record Debrief", desc: "Capture insights and action items", icon: ClipboardCheck, tip: "Write the Key Insight first, then list action items. Aim for 2-4 concrete next steps." },
                { step: "3", title: "Review & Rate", desc: "Assess progress against goals", icon: Star, tip: "Compare with previous sessions. Look for patterns in the progress rating over time." },
                { step: "4", title: "Share & Follow Up", desc: "Email summary, schedule next", icon: Send, tip: "Send the summary within 24 hours. Include a reminder of the next session date." },
              ].map(({ step, title, desc, icon: Icon, tip }) => (
                <Tooltip key={step}>
                  <TooltipTrigger asChild>
                    <div className="text-center space-y-2 cursor-help">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-needs/10 border border-needs/30 mx-auto">
                        <span className="text-sm font-bold text-needs">{step}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 text-needs" />
                        <p className="text-sm font-medium">{title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">{tip}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
