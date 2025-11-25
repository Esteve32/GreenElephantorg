import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { LENS_ARRAY } from "@/constants/lenses";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { BarChart3, Database, Sparkles, RefreshCw, ExternalLink, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LensScore {
  lens: string;
  score: number;
  color: string;
}

const sampleLensScores: LensScore[] = [
  { lens: "Influence", score: 72, color: "bg-[#cc3333]" },
  { lens: "Attitude", score: 65, color: "bg-[#ff9933]" },
  { lens: "Chaordic", score: 88, color: "bg-[#ffcc00]" },
  { lens: "Flow", score: 45, color: "bg-[#cccc33]" },
  { lens: "Alignment", score: 91, color: "bg-[#669966]" },
  { lens: "Needs", score: 78, color: "bg-[#009999]" },
  { lens: "Ego", score: 34, color: "bg-[#3399cc]" },
  { lens: "Wisdom", score: 82, color: "bg-[#663399]" },
];

export default function DashboardPage() {
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [sheetRange, setSheetRange] = useState("Sheet1!A1:Z100");
  const [prompt, setPrompt] = useState("Show a summary dashboard with key communication metrics");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [sheetData, setSheetData] = useState<any[] | null>(null);
  const { toast } = useToast();

  const fetchSheetDataMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/dashboard/lens-data?spreadsheetId=${encodeURIComponent(spreadsheetId)}&range=${encodeURIComponent(sheetRange)}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch sheet data");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setSheetData(data.data);
      toast({
        title: "Data loaded",
        description: `Fetched ${data.data?.length || 0} rows from Google Sheets`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateUIMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/dashboard/generate-ui", {
        prompt,
        data: sheetData || sampleLensScores,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate UI");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setAiResponse(data.content);
      toast({
        title: "Dashboard generated",
        description: "AI has created your visualization",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error generating dashboard",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-needs text-white">Live Dashboard</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Communication Lens Visualization
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Connect your Google Sheets data to visualize communication patterns powered by AI
          </p>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
            This dashboard uses Thesys.dev to transform your raw data into interactive visualizations
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-needs" />
                Data Source
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Google Sheet ID</label>
                <Input
                  placeholder="Enter spreadsheet ID..."
                  value={spreadsheetId}
                  onChange={(e) => setSpreadsheetId(e.target.value)}
                  data-testid="input-spreadsheet-id"
                />
                <p className="text-xs text-muted-foreground">
                  Find this in your Google Sheets URL after /d/
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Range</label>
                <Input
                  placeholder="Sheet1!A1:Z100"
                  value={sheetRange}
                  onChange={(e) => setSheetRange(e.target.value)}
                  data-testid="input-sheet-range"
                />
              </div>
              <Button 
                onClick={() => fetchSheetDataMutation.mutate()}
                disabled={!spreadsheetId || fetchSheetDataMutation.isPending}
                className="w-full bg-needs hover:bg-needs/90"
                data-testid="button-fetch-data"
              >
                {fetchSheetDataMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Fetch Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-alignment" />
                AI Visualization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Visualization Prompt</label>
                <Textarea
                  placeholder="Describe what you want to see..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  data-testid="input-prompt"
                />
              </div>
              <Button 
                onClick={() => generateUIMutation.mutate()}
                disabled={generateUIMutation.isPending}
                className="w-full bg-alignment hover:bg-alignment/90"
                data-testid="button-generate-ui"
              >
                {generateUIMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Dashboard
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-chaordic" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sheetData ? (
                  <>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                      <span className="text-sm text-muted-foreground">Rows</span>
                      <span className="font-bold">{sheetData.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                      <span className="text-sm text-muted-foreground">Columns</span>
                      <span className="font-bold">{sheetData[0]?.length || 0}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground p-4 text-center">
                    <AlertCircle className="h-4 w-4" />
                    No data loaded yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="backdrop-blur-sm bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>8 Lenses Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sampleLensScores.map((lens) => (
                  <div key={lens.lens} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{lens.lens}</span>
                      <span className="font-medium">{lens.score}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${lens.color} transition-all duration-500`}
                        style={{ width: `${lens.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Sample data shown. Connect your Google Sheet to visualize your actual scores.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50 border-white/10 min-h-[400px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-needs" />
                AI-Generated Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {aiResponse ? (
                <div className="prose prose-invert max-w-none text-sm">
                  <pre className="whitespace-pre-wrap bg-white/5 p-4 rounded-lg text-muted-foreground overflow-auto max-h-[300px]">
                    {aiResponse}
                  </pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[280px] text-center text-muted-foreground">
                  <Sparkles className="h-12 w-12 mb-4 opacity-50" />
                  <p>Click "Generate Dashboard" to create AI-powered insights</p>
                  <p className="text-xs mt-2">Powered by Thesys.dev</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="backdrop-blur-sm bg-needs/10 border-needs/20 p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Want a Personalized Dashboard?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get your own Satellite Scan™ dashboard with detailed lens analysis, micro-habit recommendations, and video tutorials.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              className="bg-needs hover:bg-needs/90"
              onClick={() => window.location.href = '/satellitescan'}
              data-testid="button-get-satellite-scan"
            >
              Get Your Satellite Scan
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
