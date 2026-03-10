import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Clock,
  Users,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  ArrowLeft,
} from "lucide-react";
import type { WebinarSession } from "@shared/schema";

const LENS_OPTIONS = [
  "influence",
  "attitude",
  "chaordic",
  "flow",
  "alignment",
  "needs",
  "ego",
  "dynamics",
];

const LENS_COLORS: Record<string, string> = {
  influence: "#cc3333",
  attitude: "#ff9933",
  chaordic: "#cccc33",
  flow: "#99cc33",
  alignment: "#669966",
  needs: "#009999",
  ego: "#3399cc",
  dynamics: "#666699",
};

const EMPTY_FORM = {
  lens: "needs",
  topic: "",
  description: "",
  date: "",
  time: "18:00–19:00 EEST",
  spotsLeft: 12,
  sortOrder: 0,
};

type FormState = typeof EMPTY_FORM;

export default function WebinarSessionsAdmin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const { data: sessions = [], isLoading } = useQuery<WebinarSession[]>({
    queryKey: ["/api/admin/webinar-sessions"],
  });

  const createMutation = useMutation({
    mutationFn: (data: FormState) => apiRequest("POST", "/api/admin/webinar-sessions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/webinar-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/webinar-sessions"] });
      setShowAddForm(false);
      setForm(EMPTY_FORM);
      toast({ title: "Session created", description: "The webinar session has been added." });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FormState> }) =>
      apiRequest("PATCH", `/api/admin/webinar-sessions/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/webinar-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/webinar-sessions"] });
      setEditingId(null);
      toast({ title: "Session updated" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/webinar-sessions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/webinar-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/webinar-sessions"] });
      toast({ title: "Session deleted" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const startEdit = (session: WebinarSession) => {
    setEditingId(session.id);
    setForm({
      lens: session.lens,
      topic: session.topic,
      description: session.description,
      date: session.date,
      time: session.time,
      spotsLeft: session.spotsLeft,
      sortOrder: session.sortOrder,
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleUpdate = (id: string) => {
    if (!form.topic || !form.date) {
      toast({ title: "Required fields", description: "Topic and date are required.", variant: "destructive" });
      return;
    }
    updateMutation.mutate({ id, data: form });
  };

  const handleCreate = () => {
    if (!form.topic || !form.date) {
      toast({ title: "Required fields", description: "Topic and date are required.", variant: "destructive" });
      return;
    }
    createMutation.mutate(form);
  };

  const SessionForm = ({ onSave, onCancel, saving }: { onSave: () => void; onCancel: () => void; saving: boolean }) => (
    <div className="space-y-4 pt-4 border-t border-white/10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-white/70 text-xs">Lens</Label>
          <select
            value={form.lens}
            onChange={e => setForm(f => ({ ...f, lens: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 h-9 text-sm text-white focus:outline-none focus:ring-1 focus:ring-needs/50"
            data-testid="select-lens"
          >
            {LENS_OPTIONS.map(l => (
              <option key={l} value={l} className="bg-[#0a0f1a]">{l.charAt(0).toUpperCase() + l.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-white/70 text-xs">Sort order</Label>
          <Input
            type="number"
            value={form.sortOrder}
            onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
            className="bg-white/5 border-white/10 text-white"
            data-testid="input-sort-order"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-white/70 text-xs">Topic</Label>
        <Input
          value={form.topic}
          onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
          placeholder="Needs — Making conscious requests"
          className="bg-white/5 border-white/10 text-white"
          data-testid="input-topic"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-white/70 text-xs">Description</Label>
        <textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Short description of what participants will practise…"
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-needs/50 resize-none"
          data-testid="textarea-description"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-white/70 text-xs">Date</Label>
          <Input
            value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            placeholder="April 10, 2026"
            className="bg-white/5 border-white/10 text-white"
            data-testid="input-date"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-white/70 text-xs">Time</Label>
          <Input
            value={form.time}
            onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
            placeholder="18:00–19:00 EEST"
            className="bg-white/5 border-white/10 text-white"
            data-testid="input-time"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-white/70 text-xs">Spots left</Label>
          <Input
            type="number"
            value={form.spotsLeft}
            onChange={e => setForm(f => ({ ...f, spotsLeft: parseInt(e.target.value) || 0 }))}
            className="bg-white/5 border-white/10 text-white"
            data-testid="input-spots-left"
          />
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="ghost" size="sm" onClick={onCancel} data-testid="button-cancel">
          <X className="h-4 w-4 mr-1" /> Cancel
        </Button>
        <Button
          size="sm"
          className="bg-needs text-white"
          onClick={onSave}
          disabled={saving}
          data-testid="button-save"
        >
          <Check className="h-4 w-4 mr-1" />
          {saving ? "Saving…" : "Save session"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/email-control-room")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Admin
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Webinar Sessions</h1>
            <p className="text-white/50 text-sm mt-0.5">Manage upcoming sessions shown on the webinars page</p>
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <Button
            className="bg-needs text-white gap-2"
            onClick={() => { setShowAddForm(true); setEditingId(null); setForm(EMPTY_FORM); }}
            disabled={showAddForm}
            data-testid="button-add-session"
          >
            <Plus className="h-4 w-4" /> Add session
          </Button>
        </div>

        {showAddForm && (
          <Card className="bg-white/5 border-white/10 mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">New session</CardTitle>
            </CardHeader>
            <CardContent>
              <SessionForm
                onSave={handleCreate}
                onCancel={() => { setShowAddForm(false); setForm(EMPTY_FORM); }}
                saving={createMutation.isPending}
              />
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center py-20 text-white/40">Loading sessions…</div>
        ) : sessions.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-16 text-center text-white/40">
              No sessions yet. Add your first one above.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sessions.map(session => (
              <Card
                key={session.id}
                className="bg-white/5 border-white/10"
                data-testid={`card-session-${session.id}`}
              >
                <CardContent className="p-5">
                  {editingId === session.id ? (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: LENS_COLORS[form.lens] || "#009999" }}
                        />
                        <span className="font-semibold text-sm text-white/70">Editing session</span>
                      </div>
                      <SessionForm
                        onSave={() => handleUpdate(session.id)}
                        onCancel={cancelEdit}
                        saving={updateMutation.isPending}
                      />
                    </>
                  ) : (
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-md flex-shrink-0 flex items-center justify-center"
                        style={{
                          backgroundColor: `${LENS_COLORS[session.lens]}22`,
                          border: `1px solid ${LENS_COLORS[session.lens]}55`,
                        }}
                      >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: LENS_COLORS[session.lens] }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start gap-2 mb-1">
                          <p className="font-semibold text-sm">{session.topic}</p>
                          <Badge
                            variant="outline"
                            className="capitalize text-xs"
                            style={{ color: LENS_COLORS[session.lens], borderColor: `${LENS_COLORS[session.lens]}55` }}
                          >
                            {session.lens}
                          </Badge>
                          <Badge variant="outline" className="text-xs text-white/40 border-white/10">
                            order: {session.sortOrder}
                          </Badge>
                        </div>
                        <p className="text-xs text-white/50 mb-3 line-clamp-2">{session.description}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-white/40">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{session.date}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{session.time}</span>
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{session.spotsLeft} mic spots</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startEdit(session)}
                          data-testid={`button-edit-${session.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteMutation.mutate(session.id)}
                          disabled={deleteMutation.isPending}
                          data-testid={`button-delete-${session.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
