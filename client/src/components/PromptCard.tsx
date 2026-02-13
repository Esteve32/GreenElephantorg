import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Satellite, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromptCardProps {
  code: string;
  name: string;
  type: "Satellite Scan Analysis" | "Quick Template";
  role: "ACX Prompt Engineer" | "EA Executive Assistant" | "Strategic Innovation Expert";
  lens: "influence" | "attitude" | "chaordic" | "flow" | "alignment" | "needs" | "ego" | "dynamics";
  howToUse: string;
  whatYouLearn?: string;
  template?: string;
}

const lensColors = {
  influence: "bg-influence",
  attitude: "bg-attitude",
  chaordic: "bg-chaordic",
  flow: "bg-flow",
  alignment: "bg-alignment",
  needs: "bg-needs",
  ego: "bg-ego",
  dynamics: "bg-dynamics",
};

const roleAbbreviations: Record<string, string> = {
  "ACX Prompt Engineer": "ACX",
  "EA Executive Assistant": "EA",
  "Strategic Innovation Expert": "Innovation",
};

export default function PromptCard({ code, name, type, role, lens, howToUse, whatYouLearn, template }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    const copyText = template || howToUse;
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    toast({
      title: "Prompt copied",
      description: "We appreciate your willingness to use this prompt for meaningful connection.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const isSatelliteScan = type === "Satellite Scan Analysis";

  return (
    <Card className="backdrop-blur-sm bg-white/5 border-white/10 hover-elevate">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="border-white/20 text-xs font-mono">
                {code}
              </Badge>
              {isSatelliteScan ? (
                <Satellite className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Zap className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <CardTitle className="text-lg mb-3">{name}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge className={`${lensColors[lens]} text-white border-white/20`}>
                {lens}
              </Badge>
              <Badge variant="outline" className="border-white/20">
                {roleAbbreviations[role] || role}
              </Badge>
              <Badge 
                variant="outline" 
                className={`border-white/20 ${isSatelliteScan ? 'bg-dynamics/20' : 'bg-chaordic/20'}`}
              >
                {isSatelliteScan ? 'Satellite Scan' : 'Quick Template'}
              </Badge>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            className="shrink-0"
            data-testid={`button-copy-prompt-${code}`}
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">How to Use</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {howToUse}
          </p>
        </div>
        
        {whatYouLearn && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">What You Learn</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {whatYouLearn}
            </p>
          </div>
        )}
        
        {template && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Template</p>
            <p className="text-sm text-muted-foreground leading-relaxed font-mono bg-black/20 p-4 rounded-md border border-white/5">
              {template}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
