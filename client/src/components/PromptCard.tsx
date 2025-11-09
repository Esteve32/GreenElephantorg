import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromptCardProps {
  title: string;
  prompt: string;
  lens: "influence" | "attitude" | "chaordic" | "flow" | "alignment" | "needs" | "ego" | "dynamics";
  role?: string;
  scenario?: string;
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

export default function PromptCard({ title, prompt, lens, role, scenario }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast({
      title: "Prompt copied",
      description: "We appreciate your willingness to use this prompt for meaningful connection.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="backdrop-blur-sm bg-white/5 border-white/10 hover-elevate">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg mb-3">{title}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge className={`${lensColors[lens]} text-white border-white/20`}>
                {lens}
              </Badge>
              {role && <Badge variant="outline" className="border-white/20">{role}</Badge>}
              {scenario && <Badge variant="outline" className="border-white/20">{scenario}</Badge>}
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            className="shrink-0"
            data-testid="button-copy-prompt"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed font-mono bg-black/20 p-4 rounded-md border border-white/5">
          {prompt}
        </p>
      </CardContent>
    </Card>
  );
}
