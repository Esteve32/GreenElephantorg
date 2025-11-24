import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Mail } from "lucide-react";

export default function PaymentSuccessPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Could track conversion here
    console.log('Payment successful - conversion tracked');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
      <Card className="max-w-2xl w-full backdrop-blur-sm bg-card/95 text-center">
        <CardHeader>
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-alignment/20 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-alignment" />
          </div>
          <CardTitle className="text-3xl mb-2">Payment Successful!</CardTitle>
          <p className="text-muted-foreground">
            Welcome to your conscious communication transformation journey
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 text-left max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-needs shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold mb-1">Check your email</div>
                <p className="text-sm text-muted-foreground">
                  You'll receive a confirmation email with next steps and scheduling details within 5 minutes.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-alignment shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold mb-1">Schedule your Satellite Scan</div>
                <p className="text-sm text-muted-foreground mb-3">
                  Book your discovery call with Estève now to begin your AI-powered assessment. Choose a time that works best for you.
                </p>
                <Button
                  asChild
                  size="sm"
                  className="bg-alignment hover:bg-alignment/90 text-white"
                  data-testid="button-book-session"
                >
                  <a 
                    href="https://calendly.com/greenelephant/satellite-scan-session" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Book Satellite Scan
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <Button
              onClick={() => setLocation('/')}
              className="w-full bg-alignment text-white hover:opacity-90"
              data-testid="button-return-home"
            >
              Return to Home
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation('/periodic-table')}
              className="w-full"
              data-testid="button-explore-framework"
            >
              Explore the Framework
            </Button>
          </div>

          <p className="text-sm text-muted-foreground pt-4">
            Questions? We're here to help at esteve@greenelephant.org
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
