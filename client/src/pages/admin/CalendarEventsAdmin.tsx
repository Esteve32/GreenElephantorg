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
import { ArrowLeft, Plus, Pencil, Trash2, X, Check, HelpCircle } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { CalendarEvent } from "@shared/schema";

const LENS_OPTIONS = [
  { value: "influence", label: "Influence", color: "#cc3333" },
  { value: "attitude", label: "Attitude", color: "#ff9933" },
  { value: "chaordic", label: "Chaordic", color: "#cccc33" },
  { value: "flow", label: "Flow", color: "#99cc33" },
  { value: "alignment", label: "Alignment", color: "#669966" },
  { value: "needs", label: "Needs", color: "#009999" },
  { value: "ego", label: "Ego", color: "#3399cc" },
  { value: "dynamics", label: "Dynamics", color: "#666699" },
];

const MONTH_OPTIONS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const EMPTY_FORM = {
  month: "January",
  lens: "Needs",
  color: "needs",
  description: "",
  sortOrder: 0,
};

type FormState = typeof EMPTY_FORM;

export default function CalendarEventsAdmin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const { data: events = [], isLoading } = useQuery<CalendarEvent[]>({
    queryKey: ["/api/admin/calendar-events"],
  });

  const createMutation = useMutation({
    mutationFn: (data: FormState) => apiRequest("POST", "/api/admin/calendar-events", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/calendar-events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/calendar-events"] });
      setShowAddForm(false);
      setForm(EMPTY_FORM);
      toast({ title: "Month added" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FormState> }) =>
      apiRequest("PATCH", `/api/admin/calendar-events/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/calendar-events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/calendar-events"] });
      setEditingId(null);
      toast({ title: "Month updated" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/calendar-events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/calendar-events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/calendar-events"] });
      toast({ title: "Month deleted" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const handleLensChange = (lensValue: string) => {
    const lensOption = LENS_OPTIONS.find(l => l.value === lensValue);
    const lensLabel = lensOption ? lensOption.label : lensValue;
    setForm(f => ({ ...f, lens: lensLabel, color: lensValue }));
  };

  const startEdit = (event: CalendarEvent) => {
    setEditingId(event.id);
    setForm({
      month: event.month,
      lens: event.lens,
      color: event.color,
      description: event.description,
      sortOrder: event.sortOrder,
    });
    setShowAddForm(false);
  };

  const EventForm = ({ onSave, onCancel, saving }: { onSave: () => void; onCancel: () => void; saving: boolean }) => {
    const lensColor = LENS_OPTIONS.find(l => l.value === form.color)?.color || "#009999";
    return (
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-white/70 text-xs flex items-center gap-1">Month (date) <Tooltip><TooltipTrigger asChild><HelpCircle className="h-3 w-3 text-white/30 cursor-help" /></TooltipTrigger><TooltipContent className="max-w-xs text-xs">Which calendar month this lens focus applies to. The rotation follows the Periodic Table sequence.</TooltipContent></Tooltip></Label>
            <select
              value={form.month}
              onChange={e => setForm(f => ({ ...f, month: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-md px-3 h-9 text-sm text-white focus:outline-none focus:ring-1 focus:ring-needs/50"
              data-testid="select-month"
            >
              {MONTH_OPTIONS.map(m => (
                <option key={m} value={m} className="bg-[#0a0f1a]">{m}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-white/70 text-xs flex items-center gap-1">Lens (title) <Tooltip><TooltipTrigger asChild><HelpCircle className="h-3 w-3 text-white/30 cursor-help" /></TooltipTrigger><TooltipContent className="max-w-xs text-xs">The communication lens featured this month. Best practice: align webinars, social posts, and coaching themes with the active lens.</TooltipContent></Tooltip></Label>
            <select
              value={form.color}
              onChange={e => handleLensChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-md px-3 h-9 text-sm text-white focus:outline-none focus:ring-1 focus:ring-needs/50"
              data-testid="select-lens"
            >
              {LENS_OPTIONS.map(l => (
                <option key={l.value} value={l.value} className="bg-[#0a0f1a]">{l.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-white/70 text-xs flex items-center gap-1">Sort order <Tooltip><TooltipTrigger asChild><HelpCircle className="h-3 w-3 text-white/30 cursor-help" /></TooltipTrigger><TooltipContent className="max-w-xs text-xs">Controls the display sequence on the calendar page. Use 1-12 to match month order.</TooltipContent></Tooltip></Label>
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
          <Label className="text-white/70 text-xs flex items-center gap-1">Description (subtext) <Tooltip><TooltipTrigger asChild><HelpCircle className="h-3 w-3 text-white/30 cursor-help" /></TooltipTrigger><TooltipContent className="max-w-xs text-xs">A brief description of the communication theme for this month. Appears under the lens name on the public Calendar page.</TooltipContent></Tooltip></Label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Describe what communication theme this month focuses on…"
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-needs/50 resize-none"
            data-testid="textarea-description"
          />
        </div>
        <div className="flex items-center gap-3 pt-1">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs"
            style={{ backgroundColor: `${lensColor}22`, border: `1px solid ${lensColor}55`, color: lensColor }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lensColor }} />
            Preview: {form.month} — {form.lens}
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
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="sm" onClick={() => navigate("/admin/submissions")} data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-1" /> Admin
          </Button></TooltipTrigger><TooltipContent>Back to Admin Hub</TooltipContent></Tooltip>
          <div>
            <h1 className="text-2xl font-bold">Calendar Events</h1>
            <p className="text-white/50 text-sm mt-0.5">Edit the 12-month lens calendar shown on the Calendar page</p>
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="bg-needs text-white gap-2"
                onClick={() => { setShowAddForm(true); setEditingId(null); setForm(EMPTY_FORM); }}
                disabled={showAddForm}
                data-testid="button-add-event"
              >
                <Plus className="h-4 w-4" /> Add month
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">Add a new month to the 12-month lens rotation calendar. Each month is tied to one communication lens — visitors see this on the Calendar page.</TooltipContent>
          </Tooltip>
        </div>

        {showAddForm && (
          <Card className="bg-white/5 border-white/10 mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">New calendar month</CardTitle>
            </CardHeader>
            <CardContent>
              <EventForm
                onSave={() => createMutation.mutate(form)}
                onCancel={() => { setShowAddForm(false); setForm(EMPTY_FORM); }}
                saving={createMutation.isPending}
              />
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center py-20 text-white/40">Loading…</div>
        ) : events.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-16 text-center text-white/40">
              No months yet. Add your first one above.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {events.map(event => {
              const lensOpt = LENS_OPTIONS.find(l => l.value === event.color);
              const lensColor = lensOpt?.color || "#009999";
              return (
                <Card key={event.id} className="bg-white/5 border-white/10" data-testid={`card-event-${event.id}`}>
                  <CardContent className="p-5">
                    {editingId === event.id ? (
                      <>
                        <p className="text-xs text-white/50 mb-3">Editing: {event.month}</p>
                        <EventForm
                          onSave={() => updateMutation.mutate({ id: event.id, data: form })}
                          onCancel={() => setEditingId(null)}
                          saving={updateMutation.isPending}
                        />
                      </>
                    ) : (
                      <div className="flex items-start gap-4">
                        <div
                          className="w-10 h-10 rounded-md flex-shrink-0 flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: `${lensColor}22`, border: `1px solid ${lensColor}44`, color: lensColor }}
                        >
                          {event.month.slice(0, 3).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{event.month}</span>
                            <Badge
                              variant="outline"
                              className="text-xs capitalize"
                              style={{ color: lensColor, borderColor: `${lensColor}55` }}
                            >
                              {event.lens}
                            </Badge>
                            <span className="text-xs text-white/30">order: {event.sortOrder}</span>
                          </div>
                          <p className="text-xs text-white/50 line-clamp-2">{event.description}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="ghost" onClick={() => startEdit(event)} data-testid={`button-edit-${event.id}`}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="text-xs">Edit this month's lens, description, or sort order</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => deleteMutation.mutate(event.id)}
                                disabled={deleteMutation.isPending}
                                data-testid={`button-delete-${event.id}`}
                              >
                                <Trash2 className="h-4 w-4 text-red-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="text-xs">Remove this month from the calendar. The public page will update immediately.</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
