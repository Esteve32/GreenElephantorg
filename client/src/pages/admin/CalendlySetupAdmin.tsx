import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AdminTooltip } from "@/components/AdminTooltip";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Copy,
  Check,
  Link2,
  Zap,
  Globe,
  Users,
  Clock,
  Loader2,
  AlertCircle,
  Video,
  MapPin,
  RefreshCw,
} from "lucide-react";
import adminHeroBg from "@assets/generated_images/earth_orbit_aurora_view.png";

interface CalendlyUser {
  resource: {
    uri: string;
    name: string;
    email: string;
    scheduling_url: string;
    timezone: string;
    avatar_url?: string;
    slug: string;
  };
}

interface CalendlyEventType {
  uri: string;
  name: string;
  active: boolean;
  slug: string;
  scheduling_url: string;
  duration: number;
  kind: string;
  type: string;
  color: string;
  description_plain?: string;
}

interface CalendlyScheduledEvent {
  uri: string;
  name: string;
  status: string;
  start_time: string;
  end_time: string;
  event_type: string;
  location?: {
    type: string;
    location?: string;
    join_url?: string;
  };
  invitees_counter: {
    total: number;
    active: number;
    limit: number;
  };
}

export default function CalendlySetupAdmin() {
  const [, setLocation] = useLocation();
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const meQuery = useQuery<CalendlyUser>({
    queryKey: ["/api/admin/calendly/me"],
    retry: 1,
  });

  const eventTypesQuery = useQuery<{ collection: CalendlyEventType[] }>({
    queryKey: ["/api/admin/calendly/event-types"],
    retry: 1,
  });

  const scheduledQuery = useQuery<{ collection: CalendlyScheduledEvent[] }>({
    queryKey: ["/api/admin/calendly/scheduled-events"],
    retry: 1,
  });

  const isConnected = !!meQuery.data?.resource;
  const eventTypes = eventTypesQuery.data?.collection || [];
  const scheduledEvents = scheduledQuery.data?.collection || [];
  const user = meQuery.data?.resource;

  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  };

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    }) + " at " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  const isLoading = meQuery.isLoading || eventTypesQuery.isLoading || scheduledQuery.isLoading;

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.06]"
          style={{ backgroundImage: `url(${adminHeroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/admin/submissions")}
                data-testid="button-back-admin"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Back to Admin Hub</TooltipContent>
          </Tooltip>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <Calendar className="h-6 w-6 text-chaordic" />
              <h1 className="text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Calendly
              </h1>
              {isConnected ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Connected</Badge>
              ) : meQuery.isLoading ? (
                <Badge className="bg-white/10 text-white/40 border-white/10 text-xs">Checking...</Badge>
              ) : (
                <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-xs">Not Connected</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1 ml-9">
              {isConnected ? `Signed in as ${user?.name} (${user?.email})` : "Add CALENDLY_API_TOKEN to connect"}
            </p>
          </div>
          {isConnected && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    meQuery.refetch();
                    eventTypesQuery.refetch();
                    scheduledQuery.refetch();
                  }}
                  disabled={isLoading}
                  data-testid="button-refresh-calendly"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh Calendly data</TooltipContent>
            </Tooltip>
          )}
        </div>

        {!isConnected && !meQuery.isLoading && (
          <Card className="mb-8 border-destructive/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">Calendly API token not configured</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    To connect Calendly, generate a Personal Access Token from your Calendly account and add it as the CALENDLY_API_TOKEN secret.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("https://calendly.com/integrations/api_webhooks", "_blank")}
                    className="gap-1.5 text-xs"
                    data-testid="button-get-token"
                  >
                    Get API Token <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading Calendly data...</span>
          </div>
        )}

        {isConnected && !isLoading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <AdminTooltip what="Number of active event types in your Calendly account.">
                <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Event Types</p>
                        <p className="text-2xl font-bold" data-testid="stat-event-types">{eventTypes.length}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-chaordic/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-chaordic" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AdminTooltip>
              <AdminTooltip what="Upcoming scheduled events (bookings) from your Calendly.">
                <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Upcoming Bookings</p>
                        <p className="text-2xl font-bold" data-testid="stat-upcoming-bookings">{scheduledEvents.length}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-needs/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-needs" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AdminTooltip>
              <AdminTooltip what="Your Calendly timezone setting.">
                <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Timezone</p>
                        <p className="text-sm font-medium" data-testid="stat-timezone">{user?.timezone || "—"}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-chaordic/10 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-chaordic" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AdminTooltip>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <AdminTooltip
                what="Your active Calendly event types, pulled live from the API."
                how="Each card shows the event name, duration, and booking link. Click the link icon to open in Calendly, or copy the scheduling URL."
              >
                <Card className="lg:col-span-2 backdrop-blur-sm bg-card/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Link2 className="h-5 w-5 text-chaordic" />
                      Event Types
                      <Badge variant="outline" className="text-xs ml-auto">{eventTypes.length} active</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {eventTypes.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">No active event types found</p>
                    ) : eventTypes.map((et) => (
                      <div
                        key={et.uri}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-md border border-white/10 bg-white/[0.02]"
                        data-testid={`event-type-${et.slug}`}
                      >
                        <div
                          className="w-1 h-10 rounded-full shrink-0 hidden sm:block"
                          style={{ backgroundColor: et.color || "#009999" }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-sm font-semibold">{et.name}</span>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDuration(et.duration)}
                            </Badge>
                            {et.kind === "group" && (
                              <Badge variant="outline" className="text-xs text-needs border-needs/30">
                                <Users className="h-3 w-3 mr-1" /> Group
                              </Badge>
                            )}
                          </div>
                          {et.description_plain && (
                            <p className="text-xs text-muted-foreground mb-1 line-clamp-2">{et.description_plain}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(et.scheduling_url, et.slug)}
                                data-testid={`button-copy-${et.slug}`}
                              >
                                {copied === et.slug ? (
                                  <Check className="h-4 w-4 text-green-400" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy booking link</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.open(et.scheduling_url, '_blank')}
                                data-testid={`button-open-${et.slug}`}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Open booking page</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </AdminTooltip>

              <div className="space-y-6">
                <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Zap className="h-5 w-5 text-chaordic" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 text-sm"
                      onClick={() => window.open("https://calendly.com/event_types", "_blank")}
                      data-testid="button-manage-events"
                    >
                      <Calendar className="h-4 w-4" />
                      Manage Event Types
                      <ExternalLink className="h-3 w-3 ml-auto opacity-40" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 text-sm"
                      onClick={() => window.open("https://calendly.com/scheduled_events", "_blank")}
                      data-testid="button-view-bookings"
                    >
                      <Clock className="h-4 w-4" />
                      View All Bookings
                      <ExternalLink className="h-3 w-3 ml-auto opacity-40" />
                    </Button>
                    {user?.scheduling_url && (
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 text-sm"
                        onClick={() => copyToClipboard(user.scheduling_url, "main-link")}
                        data-testid="button-copy-main-link"
                      >
                        {copied === "main-link" ? <Check className="h-4 w-4 text-green-400" /> : <Link2 className="h-4 w-4" />}
                        Copy Main Booking Link
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <AdminTooltip
              what="Upcoming scheduled events from your Calendly, pulled live from the API."
              how="Shows the next bookings with event name, date/time, and invitee count. Click the video icon to join a meeting link if available."
            >
              <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="h-5 w-5 text-needs" />
                    Upcoming Bookings
                    <Badge variant="outline" className="text-xs ml-auto">{scheduledEvents.length} upcoming</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {scheduledEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8" data-testid="text-no-bookings">
                      No upcoming bookings scheduled
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {scheduledEvents.map((event) => {
                        const startDate = new Date(event.start_time);
                        const endDate = new Date(event.end_time);
                        const durationMins = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
                        const isToday = startDate.toDateString() === new Date().toDateString();
                        const isTomorrow = startDate.toDateString() === new Date(Date.now() + 86400000).toDateString();

                        return (
                          <div
                            key={event.uri}
                            className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-md border bg-white/[0.02] ${
                              isToday ? 'border-chaordic/30 bg-chaordic/[0.03]' : 'border-white/10'
                            }`}
                            data-testid={`scheduled-event-${event.uri.split('/').pop()}`}
                          >
                            <div className="flex items-center gap-3 shrink-0">
                              <div className={`w-12 h-12 rounded-md flex flex-col items-center justify-center text-center ${
                                isToday ? 'bg-chaordic/20 text-chaordic' : 'bg-muted/30 text-muted-foreground'
                              }`}>
                                <span className="text-[10px] uppercase leading-none">
                                  {startDate.toLocaleDateString("en-GB", { month: "short" })}
                                </span>
                                <span className="text-lg font-bold leading-none">
                                  {startDate.getDate()}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-sm font-semibold">{event.name}</span>
                                {isToday && <Badge className="bg-chaordic/20 text-chaordic border-chaordic/30 text-[10px]">Today</Badge>}
                                {isTomorrow && <Badge className="bg-needs/20 text-needs border-needs/30 text-[10px]">Tomorrow</Badge>}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {startDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                                  {" – "}
                                  {endDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                                  {" "}({formatDuration(durationMins)})
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {event.invitees_counter.active} invitee{event.invitees_counter.active !== 1 ? "s" : ""}
                                </span>
                                {event.location?.type && (
                                  <span className="flex items-center gap-1">
                                    {event.location.join_url ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                                    {event.location.type.replace(/_/g, " ")}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {event.location?.join_url && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => window.open(event.location!.join_url!, "_blank")}
                                      className="gap-1.5 text-xs"
                                      data-testid={`button-join-${event.uri.split('/').pop()}`}
                                    >
                                      <Video className="h-3.5 w-3.5" /> Join
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Join video call</TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </AdminTooltip>
          </>
        )}
      </div>
    </div>
  );
}
