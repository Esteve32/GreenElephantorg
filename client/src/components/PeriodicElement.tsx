import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Video, Copy, Check, Share2 } from "lucide-react";
import { getLensMetadata, type LensType } from "@/constants/lenses";
import { useToast } from "@/hooks/use-toast";
import { getGBRColor, GBR_COLOR_HEX, GBR_COLOR_LABELS } from "@/constants/gbrTaxonomy";

interface PeriodicElementProps {
  symbol: string;
  name: string;
  number: number;
  lens: LensType;
  description?: string;
  examplePrompt?: string;
  learningUrl?: string;
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

const lensLabels = {
  influence: "Influence",
  attitude: "Attitude",
  chaordic: "Chaordic",
  flow: "Flow",
  alignment: "Alignment",
  needs: "Needs",
  ego: "Ego",
  dynamics: "Dynamics",
};

export default function PeriodicElement({ symbol, name, number, lens, description, examplePrompt, learningUrl }: PeriodicElementProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const { toast } = useToast();
  const lensMetadata = getLensMetadata(lens);
  const Icon = lensMetadata.icon;

  const gbrColor = getGBRColor(number);

  const handleCopyPrompt = () => {
    if (examplePrompt) {
      navigator.clipboard.writeText(examplePrompt);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Prompt copied — paste it into ChatGPT or Claude",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareElement = () => {
    const url = `https://greenelephant.org/periodic-table?element=${symbol}`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    toast({
      title: "Link copied — share this element",
      description: url,
    });
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hover-elevate active-elevate-2 rounded-sm transition-all duration-200 hover:scale-105 group w-full aspect-square"
        style={{ backgroundColor: lensMetadata.hexColor }}
        data-testid={`element-${symbol.toLowerCase()}`}
      >
        <div className="flex flex-col h-full p-2 text-white">
          <div className="text-[10px] font-medium opacity-80 text-left leading-none">{number}</div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-2xl md:text-3xl font-bold leading-none">{symbol}</div>
          </div>
          <div className="text-[9px] md:text-[10px] font-medium text-center leading-tight opacity-90 line-clamp-2">{name}</div>
        </div>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="backdrop-blur-xl bg-card/95 border-white/20 max-w-2xl" aria-describedby="element-description">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-3xl font-bold mb-2">{name}</DialogTitle>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={`${lensColors[lens]} text-white border-white/20`}>
                    {lensLabels[lens]}
                  </Badge>
                  <span className="text-sm text-muted-foreground">Element #{number}</span>
                  {gbrColor && (
                    <div className="flex items-center gap-1.5" data-testid={`badge-gbr-${symbol.toLowerCase()}`}>
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: GBR_COLOR_HEX[gbrColor] }}
                      />
                      <span className="text-xs text-muted-foreground">{GBR_COLOR_LABELS[gbrColor]}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className={`${lensColors[lens]} rounded-lg p-4 border border-white/20 flex flex-col items-center gap-2 flex-shrink-0`} style={{ backgroundColor: `${lensMetadata.hexColor}aa` }}>
                <div className="h-8 w-8 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-[hsl(var(--lens-icon))]" />
                </div>
                <div className="text-3xl font-bold text-[hsl(var(--lens-icon))]">{symbol}</div>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-6" id="element-description">
            {description && (
              <div>
                <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">Official Definition</h3>
                <p className="text-foreground leading-relaxed">{description}</p>
              </div>
            )}

            {examplePrompt && (
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-1">Reflect or Prompt</h3>
                  <p className="text-xs text-muted-foreground">Use this quietly for self-reflection, or paste it into ChatGPT / Claude for a guided response.</p>
                </div>
                <p className="text-foreground leading-relaxed italic mb-4">&ldquo;{examplePrompt}&rdquo;</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-2"
                    onClick={handleCopyPrompt}
                    data-testid="button-copy-prompt"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-needs" />
                        <span className="text-xs">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span className="text-xs">Copy for AI</span>
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-2"
                    onClick={handleShareElement}
                    data-testid="button-share-element"
                  >
                    {linkCopied ? (
                      <>
                        <Check className="h-4 w-4 text-needs" />
                        <span className="text-xs">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4" />
                        <span className="text-xs">Share element</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {learningUrl && (
                <Button 
                  variant="outline" 
                  className="backdrop-blur-sm bg-white/5"
                  data-testid="button-learn-more"
                  onClick={() => console.log('Open learning video:', learningUrl)}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Watch Learning Video
                </Button>
              )}
              <Button 
                variant="outline"
                className="backdrop-blur-sm bg-white/5"
                data-testid="button-view-prompts"
                onClick={() => console.log('View related prompts for:', name)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Related Prompts
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
