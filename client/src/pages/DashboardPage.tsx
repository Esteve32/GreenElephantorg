import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  BarChart3, 
  Users, 
  Sparkles, 
  RefreshCw, 
  ExternalLink, 
  GraduationCap,
  Globe,
  MessageSquare,
  AlertTriangle,
  Clock,
  TrendingUp,
  BookOpen,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SPREADSHEET_ID = "15nV63jCMFGsKWZGzKRPT9WEVkY5MI8oDNR74q7u--gs";
const RANGE = "A:Z";

interface AggregatedInsights {
  totalParticipants: number;
  totalRawRows: number;
  educationBreakdown: Record<string, number>;
  genderBreakdown: Record<string, number>;
  nationalityBreakdown: Record<string, number>;
  avgLearningHours: number;
  topCommunicationSituations: Array<{ situation: string; count: number }>;
  topChallengingSituations: Array<{ situation: string; count: number }>;
  geExperienceLevels: Record<string, number>;
  activationLevels: Record<string, number>;
  learningNeeds: Array<{ need: string; count: number }>;
}

function parseData(rawData: string[][]): AggregatedInsights {
  const allDataRows = rawData.slice(3).filter(row => row && row.length > 0 && row[0]);
  const dataRows = allDataRows.filter(row => {
    const consent = (row[0] || "").toString().trim().toUpperCase();
    return consent === "TRUE";
  });
  
  const insights: AggregatedInsights = {
    totalParticipants: dataRows.length,
    totalRawRows: rawData.length,
    educationBreakdown: {},
    genderBreakdown: {},
    nationalityBreakdown: {},
    avgLearningHours: 0,
    topCommunicationSituations: [],
    topChallengingSituations: [],
    geExperienceLevels: {},
    activationLevels: {},
    learningNeeds: []
  };

  const situationCounts: Record<string, number> = {};
  const challengingCounts: Record<string, number> = {};
  const needsCounts: Record<string, number> = {};
  let totalHours = 0;
  let hoursCount = 0;

  dataRows.forEach(row => {
    const education = row[7] || "Unknown";
    const gender = row[8] || "Unknown";
    const nationality = row[6] || "Unknown";
    const hours = parseFloat(row[13]) || 0;
    const geExperience = row[15] || "No experience";
    const activation = row[20] || "Not specified";
    const allSituations = row[22] || "";
    const challengingSituation = row[24] || "";
    const learningNeeds = row[21] || "";

    insights.educationBreakdown[education] = (insights.educationBreakdown[education] || 0) + 1;
    insights.genderBreakdown[gender] = (insights.genderBreakdown[gender] || 0) + 1;
    insights.nationalityBreakdown[nationality] = (insights.nationalityBreakdown[nationality] || 0) + 1;
    
    if (hours > 0) {
      totalHours += hours;
      hoursCount++;
    }

    if (geExperience) {
      const expKey = geExperience.includes("never") ? "No GE Experience" : "Has GE Experience";
      insights.geExperienceLevels[expKey] = (insights.geExperienceLevels[expKey] || 0) + 1;
    }

    if (activation) {
      insights.activationLevels[activation] = (insights.activationLevels[activation] || 0) + 1;
    }

    allSituations.split(", ").forEach(sit => {
      const match = sit.match(/^([A-Z\s]+)\s*\(/);
      if (match) {
        const sitName = match[1].trim();
        situationCounts[sitName] = (situationCounts[sitName] || 0) + 1;
      }
    });

    if (challengingSituation) {
      const match = challengingSituation.match(/^([A-Z\s]+)\s*\(/);
      if (match) {
        const sitName = match[1].trim();
        challengingCounts[sitName] = (challengingCounts[sitName] || 0) + 1;
      }
    }

    learningNeeds.split(", ").forEach(need => {
      if (need.trim()) {
        needsCounts[need.trim()] = (needsCounts[need.trim()] || 0) + 1;
      }
    });
  });

  insights.avgLearningHours = hoursCount > 0 ? Math.round(totalHours / hoursCount * 10) / 10 : 0;

  insights.topCommunicationSituations = Object.entries(situationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([situation, count]) => ({ situation, count }));

  insights.topChallengingSituations = Object.entries(challengingCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([situation, count]) => ({ situation, count }));

  insights.learningNeeds = Object.entries(needsCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([need, count]) => ({ need, count }));

  return insights;
}

export default function DashboardPage() {
  const [prompt, setPrompt] = useState("Analyze these communication patterns and provide strategic recommendations");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: sheetData, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/dashboard/lens-data', SPREADSHEET_ID],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/lens-data?spreadsheetId=${encodeURIComponent(SPREADSHEET_ID)}&range=${encodeURIComponent(RANGE)}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch data");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const insights = useMemo(() => {
    if (!sheetData?.data) return null;
    return parseData(sheetData.data);
  }, [sheetData]);

  const generateUIMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/dashboard/generate-ui", {
        prompt,
        data: insights,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate insights");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setAiResponse(data.content);
      toast({
        title: "Insights generated",
        description: "AI has analyzed your communication data",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error generating insights",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getTopItems = (obj: Record<string, number>, limit = 3) => {
    return Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-needs text-white">Live Research Dashboard</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Conscious Communication Insights
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Aggregated macro insights from our participant research - no individual data shown
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-needs" />
            <span className="ml-3 text-lg">Loading research data...</span>
          </div>
        )}

        {error && (
          <Card className="mb-8 border-destructive/50 bg-destructive/10">
            <CardContent className="py-6 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-destructive" />
              <p className="text-destructive">Error loading data. Please try again.</p>
              <Button onClick={() => refetch()} variant="outline" className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {insights && (
          <>
            <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="text-sm">
                  <span className="text-muted-foreground">Raw rows in sheet:</span>
                  <span className="ml-2 font-bold">{insights.totalRawRows}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Valid consented entries:</span>
                  <span className="ml-2 font-bold text-needs">{insights.totalParticipants}</span>
                </div>
              </div>
              <Button 
                onClick={() => refetch()} 
                variant="outline" 
                size="sm"
                className="bg-white/5"
                data-testid="button-refresh-data"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="backdrop-blur-sm bg-gradient-to-br from-needs/20 to-needs/5 border-needs/20">
                <CardContent className="pt-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-needs" />
                  <div className="text-4xl font-bold text-needs">{insights.totalParticipants}</div>
                  <p className="text-sm text-muted-foreground mt-1">Consented Participants</p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-gradient-to-br from-alignment/20 to-alignment/5 border-alignment/20">
                <CardContent className="pt-6 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-alignment" />
                  <div className="text-4xl font-bold text-alignment">{insights.avgLearningHours}</div>
                  <p className="text-sm text-muted-foreground mt-1">Avg. Learning Hours/Week</p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-gradient-to-br from-chaordic/20 to-chaordic/5 border-chaordic/20">
                <CardContent className="pt-6 text-center">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-chaordic" />
                  <div className="text-4xl font-bold text-chaordic">{Object.keys(insights.nationalityBreakdown).length}</div>
                  <p className="text-sm text-muted-foreground mt-1">Countries Represented</p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-gradient-to-br from-ego/20 to-ego/5 border-ego/20">
                <CardContent className="pt-6 text-center">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-ego" />
                  <div className="text-4xl font-bold text-ego">{insights.topCommunicationSituations.length}</div>
                  <p className="text-sm text-muted-foreground mt-1">Situation Types Tracked</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-needs" />
                    Most Common Communication Situations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {insights.topCommunicationSituations.map((item, i) => (
                      <div key={item.situation} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{item.situation.toLowerCase()}</span>
                          <span className="font-medium text-muted-foreground">{item.count} responses</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-needs transition-all duration-500"
                            style={{ width: `${(item.count / insights.totalParticipants) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-influence" />
                    Most Challenging Situations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {insights.topChallengingSituations.length > 0 ? (
                      insights.topChallengingSituations.map((item, i) => (
                        <div key={item.situation} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-influence/20 flex items-center justify-center text-influence font-bold">
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <span className="capitalize font-medium">{item.situation.toLowerCase()}</span>
                            <p className="text-xs text-muted-foreground">{item.count} participants find this challenging</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No challenging situations reported yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-wisdom" />
                    Education Levels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getTopItems(insights.educationBreakdown, 5).map(([level, count]) => (
                      <div key={level} className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                        <span className="text-sm truncate flex-1">{level}</span>
                        <Badge variant="secondary" className="ml-2">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-chaordic" />
                    Top Nationalities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getTopItems(insights.nationalityBreakdown, 5).map(([nation, count]) => (
                      <div key={nation} className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                        <span className="text-sm truncate flex-1">{nation}</span>
                        <Badge variant="secondary" className="ml-2">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-alignment" />
                    Learning Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {insights.learningNeeds.slice(0, 5).map((item) => (
                      <div key={item.need} className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                        <span className="text-sm truncate flex-1">{item.need}</span>
                        <Badge variant="secondary" className="ml-2">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="backdrop-blur-sm bg-card/50 border-white/10 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-needs" />
                  AI-Powered Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ask a question about this data</label>
                  <Textarea
                    placeholder="e.g., What patterns do you see in the challenging situations?"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={2}
                    data-testid="input-prompt"
                  />
                </div>
                <Button 
                  onClick={() => generateUIMutation.mutate()}
                  disabled={generateUIMutation.isPending}
                  className="bg-needs hover:bg-needs/90"
                  data-testid="button-generate-ui"
                >
                  {generateUIMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate AI Insights
                    </>
                  )}
                </Button>

                {aiResponse && (
                  <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-needs" />
                      AI Analysis
                    </h4>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-muted-foreground text-sm">
                        {aiResponse}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        <Card className="backdrop-blur-sm bg-needs/10 border-needs/20 p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Want Your Personal Communication Profile?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get your own Satellite Scan™ with detailed lens analysis, micro-habit recommendations, and personalized coaching insights.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              className="bg-needs hover:bg-needs/90"
              onClick={() => window.location.href = '/checkout?product=satellitescan'}
              data-testid="button-get-satellite-scan"
            >
              Get Your Scan - €99.95
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline"
              className="backdrop-blur-sm bg-white/5"
              onClick={() => window.location.href = '/coaching'}
              data-testid="button-explore-coaching"
            >
              Explore Coaching
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
