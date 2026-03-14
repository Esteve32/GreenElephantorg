import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Shield,
  Users,
  ScrollText,
  UserPlus,
  Trash2,
  Clock,
  Mail,
  Activity,
  KeyRound,
  Circle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: string;
  invitedBy: string | null;
  isActive: string;
  createdAt: string;
  lastLoginAt: string | null;
}

interface AuditLogEntry {
  id: string;
  userEmail: string;
  actionType: string;
  resource: string | null;
  details: any;
  ipAddress: string | null;
  createdAt: string;
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  viewer: "Viewer",
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-needs/20 text-needs border-needs/30",
  admin: "bg-influence/20 text-influence border-influence/30",
  viewer: "bg-flow/20 text-flow border-flow/30",
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "Never";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatActionType(action: string) {
  return action
    .replace(/^(POST|PUT|PATCH|DELETE)\s/, "")
    .replace(/^\/api\/admin\//, "")
    .replace(/\//g, " › ")
    .replace(/_/g, " ");
}

export default function AccessControlAdmin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [logPage, setLogPage] = useState(0);
  const LOG_PAGE_SIZE = 50;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [auditFilterUser, setAuditFilterUser] = useState("");
  const [auditFilterAction, setAuditFilterAction] = useState("");

  const { data: checkData } = useQuery<{ isAuthenticated: boolean; role: string | null }>({
    queryKey: ["/api/admin/check"],
  });

  const isSuperAdmin = checkData?.role === "super_admin";

  const { data: teamMembers, isLoading: teamLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/team"],
    enabled: isSuperAdmin,
  });

  const { data: auditData, isLoading: auditLoading } = useQuery<{ logs: AuditLogEntry[]; total: number }>({
    queryKey: ["/api/admin/audit-logs", logPage, auditFilterUser, auditFilterAction],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: String(LOG_PAGE_SIZE),
        offset: String(logPage * LOG_PAGE_SIZE),
      });
      if (auditFilterUser) params.set("userEmail", auditFilterUser);
      if (auditFilterAction) params.set("actionType", auditFilterAction);
      const res = await fetch(`/api/admin/audit-logs?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: isSuperAdmin,
  });

  const inviteMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/team/invite", {
        email: inviteEmail,
        name: inviteName || undefined,
        role: inviteRole,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to invite");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Team member invited", description: `${inviteEmail} has been added as ${ROLE_LABELS[inviteRole]}` });
      setInviteEmail("");
      setInviteName("");
      setInviteRole("viewer");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to invite", description: err.message, variant: "destructive" });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/team/${id}`, { role });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Role updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/team/${id}`, { isActive });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Status updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/admin/team/${id}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed");
      }
    },
    onSuccess: () => {
      toast({ title: "Team member removed" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
    },
    onError: (err: Error) => {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      if (newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }
      const res = await apiRequest("POST", "/api/admin/change-password", {
        currentPassword,
        newPassword,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to change password");
      }
      return res.json();
    },
    onSuccess: (data: any) => {
      toast({ title: "Password changed", description: data.message });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err: Error) => {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    },
  });

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-[#0A0C14] text-white flex items-center justify-center">
        <Card className="bg-white/5 border-white/10 max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 text-needs mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
            <p className="text-white/60 mb-4">
              Only Super Admins can access the Access Control page.
            </p>
            <Button variant="outline" onClick={() => setLocation("/admin/submissions")} data-testid="button-back-admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPages = auditData ? Math.ceil(auditData.total / LOG_PAGE_SIZE) : 0;

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Tooltip><TooltipTrigger asChild><Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/admin/submissions")}
            className="text-white/60"
            data-testid="button-back-dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button></TooltipTrigger><TooltipContent>Back to Admin Hub</TooltipContent></Tooltip>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-needs" />
              Access & Security
            </h1>
            <p className="text-sm text-white/50 mt-1">
              Manage team access, roles, and view admin activity
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-8">
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="bg-white/5 border-white/10 cursor-help">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-md bg-needs/20">
                    <Users className="w-5 h-5 text-needs" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{teamMembers?.length || 0}</p>
                    <p className="text-xs text-white/50">Team Members</p>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">Total admin users with access to the GreenElephant OS. Each member has a role (Super Admin, Admin, or Viewer) controlling what they can see and change.</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="bg-white/5 border-white/10 cursor-help">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-md bg-influence/20">
                    <Activity className="w-5 h-5 text-influence" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {teamMembers?.filter(m => {
                        if (!m.lastLoginAt) return false;
                        const diff = Date.now() - new Date(m.lastLoginAt).getTime();
                        return diff < 24 * 60 * 60 * 1000;
                      }).length || 0}
                    </p>
                    <p className="text-xs text-white/50">Active Today</p>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">Team members who logged into the admin within the last 24 hours. Helps you see who is actively working in the system.</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="bg-white/5 border-white/10 cursor-help">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-md bg-flow/20">
                    <ScrollText className="w-5 h-5 text-flow" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{auditData?.total || 0}</p>
                    <p className="text-xs text-white/50">Audit Events</p>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">Total logged admin actions (settings changes, email sends, data updates). Every write operation is recorded for accountability and GDPR compliance.</TooltipContent>
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-lg">
                <UserPlus className="w-5 h-5 text-needs" />
                Invite Team Member
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/70">Email</Label>
                <Input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="anu@greenelephant.org"
                  className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
                  data-testid="input-invite-email"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Name (optional)</Label>
                <Input
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Team member name"
                  className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
                  data-testid="input-invite-name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="bg-white/5 border-white/15 text-white" data-testid="select-invite-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin — Full access</SelectItem>
                    <SelectItem value="admin">Admin — All except Access Control</SelectItem>
                    <SelectItem value="viewer">Viewer — Read-only access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => inviteMutation.mutate()}
                disabled={!inviteEmail || inviteMutation.isPending}
                className="w-full bg-needs text-white"
                data-testid="button-invite"
              >
                {inviteMutation.isPending ? "Inviting..." : "Invite Member"}
              </Button>
              <p className="text-xs text-white/40">
                Only @greenelephant.org emails allowed. The invited user can log in using Google Auth.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-lg">
                <Shield className="w-5 h-5 text-influence" />
                Role Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 rounded-md bg-needs/10 border border-needs/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={ROLE_COLORS.super_admin}>Super Admin</Badge>
                  </div>
                  <p className="text-xs text-white/60">Full access to everything including Access Control, password changes, and team management.</p>
                </div>
                <div className="p-3 rounded-md bg-influence/10 border border-influence/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={ROLE_COLORS.admin}>Admin</Badge>
                  </div>
                  <p className="text-xs text-white/60">Access to all admin pages except Access Control. Can modify settings, send emails, manage content.</p>
                </div>
                <div className="p-3 rounded-md bg-flow/10 border border-flow/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={ROLE_COLORS.viewer}>Viewer</Badge>
                  </div>
                  <p className="text-xs text-white/60">Read-only access to admin dashboards. Cannot modify settings, send emails, or delete records.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/5 border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-lg">
              <Activity className="w-5 h-5 text-influence" />
              Active Sessions
              <span className="text-xs text-white/40 font-normal ml-2">
                Users active in the last 15 minutes
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teamLoading ? (
              <p className="text-white/50 text-sm">Loading...</p>
            ) : (() => {
              const activeSessions = (teamMembers || []).filter((m) => {
                if (!m.lastLoginAt) return false;
                return Date.now() - new Date(m.lastLoginAt).getTime() < 15 * 60 * 1000;
              });
              return activeSessions.length === 0 ? (
                <div className="text-center py-6">
                  <Activity className="w-6 h-6 text-white/20 mx-auto mb-2" />
                  <p className="text-white/50 text-sm">No admin users currently active.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeSessions.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-md bg-white/[0.03]"
                      data-testid={`active-session-${member.id}`}
                    >
                      <Circle className="w-2.5 h-2.5 text-green-400 fill-green-400 shrink-0" />
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={member.avatarUrl || undefined} />
                        <AvatarFallback className="bg-white/10 text-white text-xs">
                          {(member.name || member.email).slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <span className="text-sm text-white">{member.name || member.email}</span>
                        <Badge className={`ml-2 ${ROLE_COLORS[member.role] || "bg-white/10 text-white/60"}`}>
                          {ROLE_LABELS[member.role] || member.role}
                        </Badge>
                      </div>
                      <span className="text-xs text-white/40 shrink-0">
                        Last seen {formatDate(member.lastLoginAt)}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-lg">
              <Users className="w-5 h-5 text-needs" />
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teamLoading ? (
              <p className="text-white/50 text-sm">Loading...</p>
            ) : !teamMembers?.length ? (
              <div className="text-center py-8">
                <Users className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p className="text-white/50 text-sm">No team members yet. Invite your first team member above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-md bg-white/[0.03] border border-white/10"
                    data-testid={`team-member-${member.id}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={member.avatarUrl || undefined} />
                        <AvatarFallback className="bg-white/10 text-white text-xs">
                          {(member.name || member.email).slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-white truncate">{member.name || member.email}</span>
                          <Badge className={ROLE_COLORS[member.role] || "bg-white/10 text-white/60"}>
                            {ROLE_LABELS[member.role] || member.role}
                          </Badge>
                          {member.isActive !== "true" && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Disabled</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-white/40 mt-0.5 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {member.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Last login: {formatDate(member.lastLoginAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {member.role !== "super_admin" && (
                        <>
                          <Select
                            value={member.role}
                            onValueChange={(role) => updateRoleMutation.mutate({ id: member.id, role })}
                          >
                            <SelectTrigger className="w-[120px] bg-white/5 border-white/15 text-white text-xs" data-testid={`select-role-${member.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => toggleActiveMutation.mutate({
                              id: member.id,
                              isActive: member.isActive === "true" ? "false" : "true",
                            })}
                            className={member.isActive === "true" ? "text-white/40" : "text-green-400"}
                            data-testid={`button-toggle-${member.id}`}
                          >
                            <Activity className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              if (confirm(`Remove ${member.email} from admin access?`)) {
                                removeMutation.mutate(member.id);
                              }
                            }}
                            className="text-red-400/60"
                            data-testid={`button-remove-${member.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-lg">
              <KeyRound className="w-5 h-5 text-needs" />
              Change Admin Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/70">Current Password</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
                data-testid="input-current-password"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
                data-testid="input-new-password"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Confirm New Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
                data-testid="input-confirm-password"
              />
            </div>
            <Button
              onClick={() => changePasswordMutation.mutate()}
              disabled={!currentPassword || !newPassword || !confirmPassword || changePasswordMutation.isPending}
              className="w-full bg-needs text-white"
              data-testid="button-change-password"
            >
              {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
            </Button>
            <p className="text-xs text-white/40">
              After changing, also update the ADMIN_PASSWORD environment variable to keep password login in sync.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-lg flex-wrap">
              <ScrollText className="w-5 h-5 text-flow" />
              Audit Log
              {auditData && (
                <span className="text-xs text-white/40 font-normal ml-2">
                  {auditData.total} events{(auditFilterUser || auditFilterAction) ? " (filtered)" : " total"}
                </span>
              )}
            </CardTitle>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <div className="flex-1 min-w-[180px]">
                <Input
                  value={auditFilterUser}
                  onChange={(e) => { setAuditFilterUser(e.target.value); setLogPage(0); }}
                  placeholder="Filter by user email"
                  className="bg-white/5 border-white/15 text-white placeholder:text-white/30 text-sm"
                  data-testid="input-audit-filter-user"
                />
              </div>
              <div className="flex-1 min-w-[180px]">
                <Input
                  value={auditFilterAction}
                  onChange={(e) => { setAuditFilterAction(e.target.value); setLogPage(0); }}
                  placeholder="Filter by action (e.g. login, invite)"
                  className="bg-white/5 border-white/15 text-white placeholder:text-white/30 text-sm"
                  data-testid="input-audit-filter-action"
                />
              </div>
              {(auditFilterUser || auditFilterAction) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setAuditFilterUser(""); setAuditFilterAction(""); setLogPage(0); }}
                  className="text-white/50"
                  data-testid="button-audit-clear-filters"
                >
                  Clear filters
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {auditLoading ? (
              <p className="text-white/50 text-sm">Loading audit logs...</p>
            ) : !auditData?.logs?.length ? (
              <div className="text-center py-8">
                <ScrollText className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p className="text-white/50 text-sm">No audit events recorded yet.</p>
              </div>
            ) : (
              <>
                <div className="space-y-1 max-h-[500px] overflow-y-auto">
                  {auditData.logs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-2 rounded-md hover-elevate text-sm"
                      data-testid={`audit-log-${log.id}`}
                    >
                      <div className="w-2 h-2 rounded-full bg-flow/60 mt-1.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-white/80">{log.userEmail}</span>
                          <span className="text-white/40">{formatActionType(log.actionType)}</span>
                        </div>
                        <div className="text-xs text-white/30 mt-0.5">
                          {formatDate(log.createdAt)}
                          {log.ipAddress && ` · ${log.ipAddress}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-white/10">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={logPage === 0}
                      onClick={() => setLogPage((p) => Math.max(0, p - 1))}
                      data-testid="button-audit-prev"
                    >
                      Previous
                    </Button>
                    <span className="text-xs text-white/50">
                      Page {logPage + 1} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={logPage >= totalPages - 1}
                      onClick={() => setLogPage((p) => p + 1)}
                      data-testid="button-audit-next"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
