import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
  BookOpen,
  Target,
  HelpCircle,
  Info,
  FileSpreadsheet,
  Wrench
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import geLogo from "@assets/GE logo 512x512 transparent BG 2023 _1764343412596.png";

const SPREADSHEET_ID = "15nV63jCMFGsKWZGzKRPT9WEVkY5MI8oDNR74q7u--gs";
const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`;
const RANGE = "A:Z";

interface AggregatedInsights {
  totalParticipants: number;
  totalRawRows: number;
  totalSituationTypes: number;
  totalSituationMentions: number;
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
    totalSituationTypes: 0,
    totalSituationMentions: 0,
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
  let totalMentions = 0;

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

    if (allSituations.trim()) {
      const parts = allSituations.split(/\),\s*/);
      parts.forEach(sit => {
        const trimmed = sit.trim().replace(/\)$/, '');
        if (!trimmed) return;
        const match = trimmed.match(/^([A-Z][A-Z\s&/'-]+)/);
        if (match) {
          const sitName = match[1].trim();
          if (sitName.length > 1) {
            situationCounts[sitName] = (situationCounts[sitName] || 0) + 1;
            totalMentions++;
          }
        }
      });
    }

    if (challengingSituation) {
      const trimmedChallenge = challengingSituation.trim();
      const match = trimmedChallenge.match(/^([A-Z][A-Z\s&/'-]+)/);
      if (match) {
        const sitName = match[1].trim();
        if (sitName.length > 1) {
          challengingCounts[sitName] = (challengingCounts[sitName] || 0) + 1;
        }
      }
    }

    learningNeeds.split(", ").forEach(need => {
      if (need.trim()) {
        needsCounts[need.trim()] = (needsCounts[need.trim()] || 0) + 1;
      }
    });
  });

  insights.avgLearningHours = hoursCount > 0 ? Math.round(totalHours / hoursCount * 10) / 10 : 0;

  const allSituationEntries = Object.entries(situationCounts).sort((a, b) => b[1] - a[1]);
  insights.totalSituationTypes = allSituationEntries.length;
  insights.totalSituationMentions = totalMentions;
  insights.topCommunicationSituations = allSituationEntries
    .slice(0, 10)
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
    <div className="min-h-screen bg-[#0A0C14] text-white">

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <img 
          src="/retreat-finland.jpg" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0C14]/60 via-[#0A0C14]/80 to-[#0A0C14]" />
        <div className="absolute inset-0 bg-gradient-to-br from-needs/10 via-transparent to-ego/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="flex flex-col items-center text-center">
            <img src={geLogo} alt="GreenElephant" className="w-16 h-16 rounded-full mb-4" />
            <Badge className="mb-4 bg-needs/20 text-needs border-needs/30">Live Research Dashboard</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-['Poppins']" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Conscious Communication Insights
            </h1>
            <p className="text-lg text-white/60 max-w-3xl mx-auto mb-6">
              Aggregated macro insights from our participant research — no individual data shown.
              Powered by the GreenElephant 8-Lens Periodic Table.
            </p>

            {/* Info bar with data source + help */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={SPREADSHEET_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 text-white/70 text-xs hover-elevate"
                    data-testid="link-google-sheet"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    Google Sheet Source
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs text-xs">
                  Opens the Google Sheet aggregator that feeds this dashboard. Rows are pulled from columns A-Z. Only rows with consent=TRUE in column A are counted.
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 text-white/70 text-xs cursor-help">
                    <Wrench className="h-3.5 w-3.5" />
                    How It Works
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-sm text-xs leading-relaxed">
                  <p className="font-semibold mb-1">Dashboard Data Flow</p>
                  <ul className="space-y-0.5 list-disc pl-3">
                    <li>Data is fetched from Google Sheets via the Sheets API</li>
                    <li>First 3 rows are headers — data starts at row 4</li>
                    <li>Only rows with consent=TRUE (col A) are processed</li>
                    <li>Situations are parsed from col W (index 22), split on commas</li>
                    <li>Challenging situations from col Y (index 24)</li>
                    <li>Nationality col G, Education col H, Gender col I</li>
                    <li>Learning hours col N, GE experience col P</li>
                  </ul>
                  <p className="mt-1.5 text-white/50">If counts look wrong, check that the Google Sheet column order hasn't changed.</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 text-white/70 text-xs cursor-help">
                    <HelpCircle className="h-3.5 w-3.5" />
                    Troubleshooting
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-sm text-xs leading-relaxed">
                  <p className="font-semibold mb-1">Common Issues</p>
                  <ul className="space-y-0.5 list-disc pl-3">
                    <li><strong>0 participants:</strong> Google Sheets API key may have expired — check server logs</li>
                    <li><strong>Wrong counts:</strong> Column positions may have shifted in the Sheet</li>
                    <li><strong>Situations missing:</strong> Situations are parsed via regex from comma-separated text. Entries without parenthetical descriptions or with unexpected formatting are now included as fallback.</li>
                    <li><strong>Stale data:</strong> Click "Refresh Data" — dashboard caches for 5 minutes</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-sm cursor-help">
                      <span className="text-white/40">Raw rows in sheet:</span>
                      <span className="ml-2 font-bold">{insights.totalRawRows}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">Total rows in the Google Sheet including headers and empty rows</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-sm cursor-help">
                      <span className="text-white/40">Valid consented entries:</span>
                      <span className="ml-2 font-bold text-needs">{insights.totalParticipants}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">Rows where column A (consent) = TRUE, starting from row 4</TooltipContent>
                </Tooltip>
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
                  <div className="text-4xl font-bold text-needs" data-testid="text-total-participants">{insights.totalParticipants}</div>
                  <p className="text-sm text-white/50 mt-1">Consented Participants</p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-gradient-to-br from-alignment/20 to-alignment/5 border-alignment/20">
                <CardContent className="pt-6 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-alignment" />
                  <div className="text-4xl font-bold text-alignment" data-testid="text-avg-hours">{insights.avgLearningHours}</div>
                  <p className="text-sm text-white/50 mt-1">Avg. Learning Hours/Week</p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-gradient-to-br from-chaordic/20 to-chaordic/5 border-chaordic/20">
                <CardContent className="pt-6 text-center">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-chaordic" />
                  <div className="text-4xl font-bold text-chaordic" data-testid="text-total-countries">{Object.keys(insights.nationalityBreakdown).length}</div>
                  <p className="text-sm text-white/50 mt-1">Countries Represented</p>
                </CardContent>
              </Card>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="backdrop-blur-sm bg-gradient-to-br from-ego/20 to-ego/5 border-ego/20 cursor-help">
                    <CardContent className="pt-6 text-center">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 text-ego" />
                      <div className="text-4xl font-bold text-ego" data-testid="text-total-situations">{insights.totalSituationTypes}</div>
                      <p className="text-sm text-white/50 mt-1">Situation Types Tracked</p>
                      <p className="text-xs text-white/30 mt-0.5">{insights.totalSituationMentions} total mentions</p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  Unique communication situation types identified across all participants (parsed from col W). Each participant can report multiple situations. Total mentions = sum of all situation selections across all participants.
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-needs" />
                    Top Communication Situations
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="shrink-0"><Info className="h-3.5 w-3.5 text-white/30" /></span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-xs">
                        Showing top 10 of {insights.totalSituationTypes} unique situation types. Parsed from col W of the Google Sheet. Bar width = percentage of all participants who mentioned this situation.
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {insights.topCommunicationSituations.map((item) => (
                      <div key={item.situation} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{item.situation.toLowerCase()}</span>
                          <span className="font-medium text-white/50">{item.count} responses</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-needs transition-all duration-500"
                            style={{ width: `${Math.min((item.count / insights.totalParticipants) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    {insights.totalSituationTypes > 10 && (
                      <p className="text-xs text-white/30 text-center pt-2">
                        + {insights.totalSituationTypes - 10} more situation types not shown
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-influence" />
                    Most Challenging Situations
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="shrink-0"><Info className="h-3.5 w-3.5 text-white/30" /></span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-xs">
                        Single most challenging situation selected by each participant (col Y). Ranked by how many participants chose this situation.
                      </TooltipContent>
                    </Tooltip>
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
                            <p className="text-xs text-white/50">{item.count} participants find this challenging</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/50 text-center py-4">No challenging situations reported yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              <Card className="backdrop-blur-sm bg-card/50 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-chaordic" />
                    Education Levels
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="shrink-0"><Info className="h-3.5 w-3.5 text-white/30" /></span>
                      </TooltipTrigger>
                      <TooltipContent className="text-xs">From col H of the Google Sheet</TooltipContent>
                    </Tooltip>
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="shrink-0"><Info className="h-3.5 w-3.5 text-white/30" /></span>
                      </TooltipTrigger>
                      <TooltipContent className="text-xs">From col G of the Google Sheet</TooltipContent>
                    </Tooltip>
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="shrink-0"><Info className="h-3.5 w-3.5 text-white/30" /></span>
                      </TooltipTrigger>
                      <TooltipContent className="text-xs">From col V of the Google Sheet — comma-separated learning needs</TooltipContent>
                    </Tooltip>
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="shrink-0"><Info className="h-3.5 w-3.5 text-white/30" /></span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs">
                      Uses the Thesys AI API to analyze the aggregated (non-personal) research data. Enter a question and click Generate to get strategic recommendations.
                    </TooltipContent>
                  </Tooltip>
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
                      <pre className="whitespace-pre-wrap text-white/50 text-sm">
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
          <p className="text-white/50 mb-6 max-w-2xl mx-auto">
            Get your own Satellite Scan with detailed lens analysis, micro-habit recommendations, and personalized coaching insights.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              className="bg-needs hover:bg-needs/90"
              onClick={() => window.location.href = '/checkout?product=satellitescan'}
              data-testid="button-get-satellite-scan"
            >
              Get Your Scan
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
