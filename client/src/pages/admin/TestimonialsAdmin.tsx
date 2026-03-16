import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AdminTooltip } from "@/components/AdminTooltip";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Quote, Plus, Trash2, Save, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useLocation } from "wouter";
import { useState } from "react";
import type { Testimonial } from "@shared/schema";

export default function TestimonialsAdmin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [editId, setEditId] = useState<string | null>(null);
  const [newForm, setNewForm] = useState({ name: "", role: "", company: "", quote: "" });
  const [editForm, setEditForm] = useState<Partial<Testimonial>>({});

  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/admin/testimonials"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof newForm) => {
      await apiRequest("POST", "/api/admin/testimonials", {
        ...data,
        consentGiven: "false",
        visible: "false",
        sortOrder: (testimonials?.length || 0),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      setNewForm({ name: "", role: "", company: "", quote: "" });
      toast({ title: "Testimonial added" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Testimonial> }) => {
      await apiRequest("PATCH", `/api/admin/testimonials/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      setEditId(null);
      toast({ title: "Testimonial updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/testimonials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      toast({ title: "Testimonial deleted" });
    },
  });

  const toggleField = (id: string, field: "visible" | "consentGiven", current: string) => {
    updateMutation.mutate({ id, data: { [field]: current === "true" ? "false" : "true" } });
  };

  return (
    <>
      <SEO title="Testimonials Admin | GreenElephant" description="Manage customer testimonials, consent status, and public visibility settings." />
      <div className="min-h-screen bg-background p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => setLocation("/admin/submissions")} data-testid="button-back-admin">
            <ArrowLeft className="h-4 w-4" />
          </Button></TooltipTrigger><TooltipContent>Back to Admin Hub</TooltipContent></Tooltip>
          <h1 className="text-2xl font-bold font-heading">Testimonials</h1>
          <AdminTooltip
            what="Manage customer testimonials displayed on the public site."
            how="Add testimonials manually. Toggle 'Consent' once the client has given written permission. Toggle 'Visible' to show on the public site. Both must be on for public display."
            debug={[{ label: "API endpoint", href: "/api/testimonials" }]}
          />
        </div>

        <Card className="bg-card/50 border-dynamics/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-dynamics" />
              Add Testimonial
              <AdminTooltip
                what="Add a new client testimonial. Both Consent and Visible must be enabled for it to appear publicly."
                how="Fill in name, role, company, and the quote. After adding, toggle Consent once the client has given written permission, then toggle Visible to display on the website."
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                placeholder="Name"
                value={newForm.name}
                onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                data-testid="input-testimonial-name"
              />
              <Input
                placeholder="Role / Title"
                value={newForm.role}
                onChange={(e) => setNewForm({ ...newForm, role: e.target.value })}
                data-testid="input-testimonial-role"
              />
              <Input
                placeholder="Company"
                value={newForm.company}
                onChange={(e) => setNewForm({ ...newForm, company: e.target.value })}
                data-testid="input-testimonial-company"
              />
            </div>
            <Textarea
              placeholder="Quote / testimonial text..."
              value={newForm.quote}
              onChange={(e) => setNewForm({ ...newForm, quote: e.target.value })}
              className="min-h-[80px]"
              data-testid="input-testimonial-quote"
            />
            <Tooltip><TooltipTrigger asChild><Button
              onClick={() => createMutation.mutate(newForm)}
              disabled={!newForm.name || !newForm.quote || createMutation.isPending}
              data-testid="button-add-testimonial"
            >
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Add
            </Button></TooltipTrigger><TooltipContent>Add this testimonial (it will be hidden until you toggle Consent and Visible)</TooltipContent></Tooltip>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-dynamics/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Quote className="h-5 w-5 text-dynamics" />
              All Testimonials ({testimonials?.length || 0})
              <AdminTooltip
                what="List of all testimonials. Both Consent and Visible must be ON for public display."
                how="Click edit to modify. Toggle Consent after getting client permission. Toggle Visible to show publicly."
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !testimonials?.length ? (
              <p className="text-muted-foreground text-sm py-4">No testimonials yet. Add one above.</p>
            ) : (
              <div className="space-y-4">
                {testimonials.map((t) => (
                  <div key={t.id} className="rounded-md border border-white/10 p-4 space-y-3">
                    {editId === t.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <Input
                            value={editForm.name || ""}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            data-testid={`input-edit-name-${t.id}`}
                          />
                          <Input
                            value={editForm.role || ""}
                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                            data-testid={`input-edit-role-${t.id}`}
                          />
                          <Input
                            value={editForm.company || ""}
                            onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                            data-testid={`input-edit-company-${t.id}`}
                          />
                        </div>
                        <Textarea
                          value={editForm.quote || ""}
                          onChange={(e) => setEditForm({ ...editForm, quote: e.target.value })}
                          className="min-h-[80px]"
                          data-testid={`input-edit-quote-${t.id}`}
                        />
                        <div className="flex items-center gap-2 flex-wrap">
                          <Tooltip><TooltipTrigger asChild><Button
                            onClick={() => updateMutation.mutate({ id: t.id, data: editForm })}
                            disabled={updateMutation.isPending}
                            data-testid={`button-save-${t.id}`}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button></TooltipTrigger><TooltipContent>Save changes to this testimonial</TooltipContent></Tooltip>
                          <Tooltip><TooltipTrigger asChild><Button variant="ghost" onClick={() => setEditId(null)} data-testid={`button-cancel-${t.id}`}>
                            Cancel
                          </Button></TooltipTrigger><TooltipContent>Discard changes and stop editing</TooltipContent></Tooltip>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{t.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {[t.role, t.company].filter(Boolean).join(" — ") || "No role/company"}
                            </p>
                            <p className="text-sm mt-2 italic text-muted-foreground">"{t.quote}"</p>
                          </div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className={`h-4 w-4 ${t.consentGiven === "true" ? "text-green-500" : "text-muted-foreground"}`} />
                              <span className="text-xs text-muted-foreground">Consent</span>
                              <Switch
                                checked={t.consentGiven === "true"}
                                onCheckedChange={() => toggleField(t.id, "consentGiven", t.consentGiven)}
                                data-testid={`switch-consent-${t.id}`}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              {t.visible === "true" ? <Eye className="h-4 w-4 text-green-500" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                              <span className="text-xs text-muted-foreground">Visible</span>
                              <Switch
                                checked={t.visible === "true"}
                                onCheckedChange={() => toggleField(t.id, "visible", t.visible)}
                                data-testid={`switch-visible-${t.id}`}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Tooltip><TooltipTrigger asChild><Button
                            variant="ghost"
                            onClick={() => { setEditId(t.id); setEditForm({ name: t.name, role: t.role || "", company: t.company || "", quote: t.quote }); }}
                            data-testid={`button-edit-${t.id}`}
                          >
                            Edit
                          </Button></TooltipTrigger><TooltipContent>Edit this testimonial's details</TooltipContent></Tooltip>
                          <Tooltip><TooltipTrigger asChild><Button
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => { if (confirm("Delete this testimonial?")) deleteMutation.mutate(t.id); }}
                            data-testid={`button-delete-${t.id}`}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button></TooltipTrigger><TooltipContent>Permanently delete this testimonial</TooltipContent></Tooltip>
                        </div>
                      </>
                    )}
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
