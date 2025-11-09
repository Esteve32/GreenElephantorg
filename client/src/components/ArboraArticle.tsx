import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User } from "lucide-react";

interface ArboraArticleProps {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  featured?: boolean;
}

export default function ArboraArticle({
  title,
  excerpt,
  author,
  date,
  readTime,
  category,
  featured = false,
}: ArboraArticleProps) {
  return (
    <Card className={`backdrop-blur-sm bg-card/50 border-white/10 hover-elevate transition-all ${featured ? 'md:col-span-2' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4 mb-3">
          <Badge className="bg-alignment text-white">{category}</Badge>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readTime}
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {author}
            </div>
          </div>
        </div>
        <h3 className={`font-bold ${featured ? 'text-2xl' : 'text-xl'} leading-tight`}>
          {title}
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          {excerpt}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{date}</span>
          <Button 
            variant="ghost" 
            size="sm"
            data-testid="button-read-article"
            onClick={() => console.log('Reading article:', title)}
          >
            Continue Reading →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
