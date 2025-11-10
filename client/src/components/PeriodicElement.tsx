import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Video } from "lucide-react";
import { getLensMetadata, type LensType } from "@/constants/lenses";

interface PeriodicElementProps {
  symbol: string;
  name: string;
  number: number;
  lens: LensType;
  description?: string;
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

export default function PeriodicElement({ symbol, name, number, lens, description, learningUrl }: PeriodicElementProps) {
  const [isOpen, setIsOpen] = useState(false);
  const lensMetadata = getLensMetadata(lens);
  const Icon = lensMetadata.icon;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`${lensColors[lens]} hover-elevate active-elevate-2 rounded-md p-3 text-white border border-white/20 transition-all duration-200 hover:scale-105 group bg-opacity-66`}
        style={{ backgroundColor: `${lensMetadata.hexColor}aa` }}
        data-testid={`element-${symbol.toLowerCase()}`}
      >
        <div className="flex flex-col items-center gap-1">
          <Icon className="h-6 w-6 mb-1 text-[hsl(var(--lens-icon))]" />
          <div className="text-xs opacity-80">{number}</div>
          <div className="text-2xl font-bold">{symbol}</div>
          <div className="text-xs opacity-90 text-center line-clamp-1">{name}</div>
        </div>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="backdrop-blur-xl bg-card/95 border-white/20 max-w-2xl" aria-describedby="element-description">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-3xl font-bold mb-2">{name}</DialogTitle>
                <div className="flex items-center gap-3">
                  <Badge className={`${lensColors[lens]} text-white border-white/20`}>
                    {lensLabels[lens]}
                  </Badge>
                  <span className="text-sm text-muted-foreground">Element #{number}</span>
                </div>
              </div>
              <div className={`${lensColors[lens]} rounded-lg p-4 border border-white/20 flex flex-col items-center gap-2`} style={{ backgroundColor: `${lensMetadata.hexColor}aa` }}>
                <Icon className="h-8 w-8 text-[hsl(var(--lens-icon))]" />
                <div className="text-3xl font-bold text-[hsl(var(--lens-icon))]">{symbol}</div>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-6" id="element-description">
            {description && (
              <div>
                <h3 className="font-semibold mb-2">About this element</h3>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
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
