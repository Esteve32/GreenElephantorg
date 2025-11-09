import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface CoachingPackageProps {
  title: string;
  type: "1:1" | "Team";
  sessions: number;
  duration: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

export default function CoachingPackage({
  title,
  type,
  sessions,
  duration,
  price,
  features,
  highlighted = false,
}: CoachingPackageProps) {
  return (
    <Card className={`backdrop-blur-sm ${highlighted ? 'bg-needs/10 border-needs/40' : 'bg-card/50 border-white/10'} hover-elevate transition-all`}>
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge className={highlighted ? 'bg-needs text-white' : 'bg-white/10'}>
            {type} Coaching
          </Badge>
          {highlighted && (
            <Badge variant="outline" className="border-needs text-needs">
              Most Popular
            </Badge>
          )}
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <div className="mt-4">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground ml-2">/ {duration}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {sessions} session{sessions > 1 ? 's' : ''} • {duration}
        </p>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-needs shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className={`w-full ${highlighted ? 'bg-needs hover:bg-needs/90 text-white' : ''}`}
          variant={highlighted ? 'default' : 'outline'}
          data-testid={`button-book-${type.toLowerCase()}`}
          onClick={() => console.log('Booking coaching package:', title)}
        >
          Schedule Session
        </Button>
      </CardFooter>
    </Card>
  );
}
