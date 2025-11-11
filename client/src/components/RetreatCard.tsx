import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";

interface RetreatCardProps {
  title: string;
  season: string;
  date: string;
  location: string;
  capacity: string;
  imageUrl: string;
  description: string;
  price: string;
  priceNote?: string;
}

export default function RetreatCard({
  title,
  season,
  date,
  location,
  capacity,
  imageUrl,
  description,
  price,
  priceNote,
}: RetreatCardProps) {
  return (
    <Card className="overflow-hidden backdrop-blur-sm bg-card/50 border-white/10 hover-elevate transition-all">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge className="bg-needs text-white">{season}</Badge>
          <div className="text-right">
            <div className="text-sm font-semibold text-needs">{price}</div>
            {priceNote && <div className="text-xs text-muted-foreground">{priceNote}</div>}
          </div>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 text-needs" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-needs" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4 text-needs" />
            <span>{capacity}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button 
          className="flex-1 bg-needs hover:bg-needs/90"
          data-testid="button-book-retreat"
          onClick={() => console.log('Booking retreat:', title)}
        >
          Express Interest
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 backdrop-blur-sm bg-white/5"
          data-testid="button-learn-more"
          onClick={() => console.log('Learn more about:', title)}
        >
          Learn More
        </Button>
      </CardFooter>
    </Card>
  );
}
