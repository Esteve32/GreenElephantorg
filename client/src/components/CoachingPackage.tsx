import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useLocation } from "wouter";

interface CoachingPackageProps {
  title: string;
  subtitle?: string;
  type: "1:1" | "Team";
  sessions: number | string;
  duration: string;
  price: string;
  features: string[];
  highlighted?: boolean;
  packageId: string;
  idealFor?: string;
}

export default function CoachingPackage({
  title,
  subtitle,
  type,
  sessions,
  duration,
  price,
  features,
  highlighted = false,
  packageId,
  idealFor,
}: CoachingPackageProps) {
  const [, setLocation] = useLocation();

  const handleBooking = () => {
    setLocation(`/checkout?package=${packageId}`);
  };

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
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        <div className="mt-4">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground ml-2">/ {duration}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {typeof sessions === 'number' ? `${sessions} session${sessions > 1 ? 's' : ''}` : sessions} • {duration}
        </p>
        {idealFor && (
          <div className="pt-2 border-t border-white/10">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold">Ideal for:</span> {idealFor}
            </p>
          </div>
        )}
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
          className={`w-full ${highlighted ? 'bg-alignment hover:bg-alignment/90 text-white' : ''}`}
          variant={highlighted ? 'default' : 'outline'}
          data-testid={`button-book-${type.toLowerCase()}`}
          onClick={handleBooking}
        >
          Begin Transformation
        </Button>
      </CardFooter>
    </Card>
  );
}
