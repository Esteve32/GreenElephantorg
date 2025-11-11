import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, FileText } from "lucide-react";

interface ResourceCardProps {
  title: string;
  description: string;
  type: "Ebook" | "Notion Kit" | "GPT Assistant" | "Learning Path";
  format?: string;
  audience?: string;
}

const typeIcons = {
  "Ebook": FileText,
  "Notion Kit": ExternalLink,
  "GPT Assistant": ExternalLink,
  "Learning Path": FileText,
};

const typeColors = {
  "Ebook": "bg-attitude",
  "Notion Kit": "bg-chaordic",
  "GPT Assistant": "bg-ego",
  "Learning Path": "bg-alignment",
};

export default function ResourceCard({
  title,
  description,
  type,
  format,
  audience,
}: ResourceCardProps) {
  const Icon = typeIcons[type];

  return (
    <Card className="backdrop-blur-sm bg-card/50 border-white/10 hover-elevate transition-all">
      <CardHeader>
        <div className="flex items-start gap-3 mb-3">
          <div className={`${typeColors[type]} p-2 rounded-lg`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <Badge className={`${typeColors[type]} text-white mb-2`}>{type}</Badge>
            {audience && (
              <Badge variant="outline" className="ml-2 border-white/20">
                {audience}
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-lg leading-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed mb-2">
          {description}
        </p>
        {format && (
          <p className="text-xs text-muted-foreground">Format: {format}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          variant="outline"
          data-testid={`button-download-${type.toLowerCase().replace(/\s+/g, '-')}`}
          onClick={() => console.log('Accessing resource:', title)}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Access Resource
        </Button>
      </CardFooter>
    </Card>
  );
}
