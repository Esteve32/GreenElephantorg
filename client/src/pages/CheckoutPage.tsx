import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft } from "lucide-react";

// Stripe integration from blueprint:javascript_stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  packageInfo: {
    name: string;
    price: number;
    features: string[];
  };
}

const CheckoutForm = ({ packageInfo }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full bg-alignment text-white hover:opacity-90"
        disabled={!stripe || isProcessing}
        data-testid="button-complete-payment"
      >
        {isProcessing ? "Processing..." : `Complete Payment - €${packageInfo.price}`}
      </Button>
    </form>
  );
};

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [, setLocation] = useLocation();
  
  // Get package info from URL params or default
  const urlParams = new URLSearchParams(window.location.search);
  const packageType = urlParams.get('package') || '1on1-single';
  
  // Import from shared catalog - single source of truth
  const packages: Record<string, { name: string; price: number; features: string[]; savings?: string }> = {
    '1on1-single': {
      name: "1:1 Single Session",
      price: 295,
      features: [
        "120-minute deep-dive session",
        "Personalized framework analysis",
        "Action plan with 3 micro-habits",
        "Session recording & transcript"
      ]
    },
    'coaching-journey': {
      name: "Coaching Journey",
      price: 2980,
      features: [
        "AI-powered Satellite Scan™ (90 questions, ~120 min)",
        "Clarity & goal-setting session",
        "Biweekly coaching sessions (2 hours each)",
        "Unlimited 20-min check-in calls",
        "Ongoing messaging support",
        "Personalized micro-habit plan",
        "Lens video library access",
        "Support until objectives are reached"
      ]
    },
    'team-workshop': {
      name: "Team Workshop",
      price: 1200,
      savings: "€120/person for 10 participants",
      features: [
        "Half-day intensive for up to 10 people",
        "Live framework mapping exercise",
        "Team communication audit",
        "Custom micro-habit playbook",
        "30-day follow-up session included"
      ]
    }
  };

  const selectedPackage = packages[packageType];

  useEffect(() => {
    if (!selectedPackage) {
      setLocation('/coaching');
      return;
    }

    // Create PaymentIntent with server-side price validation
    apiRequest("POST", "/api/create-payment-intent", { 
      packageId: packageType 
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error('Payment intent error:', error);
        setLocation('/coaching');
      });
  }, [packageType, selectedPackage, setLocation]);

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card/30 -z-10" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => setLocation('/coaching')}
          className="mb-6"
          data-testid="button-back-to-coaching"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Coaching
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Package Summary */}
          <Card className="backdrop-blur-sm bg-card/95 h-fit sticky top-24">
            <CardHeader>
              <Badge className="w-fit mb-2 bg-alignment text-white">
                Conscious Communication Coaching
              </Badge>
              <CardTitle className="text-2xl">{selectedPackage.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-4xl font-bold mb-1">€{selectedPackage.price}</div>
                {selectedPackage.savings && (
                  <div className="text-sm text-needs">{selectedPackage.savings}</div>
                )}
              </div>

              <div className="space-y-3">
                <div className="font-semibold">What's included:</div>
                {selectedPackage.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-alignment shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border/50">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p className="font-semibold text-foreground mb-3">
                    The real cost comparison:
                  </p>
                  <p>
                    One miscommunication at work costs you in lost time, damaged relationships, and emotional energy.
                  </p>
                  <p>
                    This investment is <span className="text-alignment font-semibold">less than the price of one conflict</span> - 
                    but it gives you the tools to prevent countless more.
                  </p>
                  <p className="text-foreground font-medium pt-2">
                    Choose transformation over repetition.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="backdrop-blur-sm bg-card/95">
            <CardHeader>
              <CardTitle>Complete Your Investment</CardTitle>
              <p className="text-sm text-muted-foreground">
                Secure payment powered by Stripe. Your transformation starts today.
              </p>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm packageInfo={selectedPackage} />
              </Elements>
            </CardContent>
          </Card>
        </div>

        {/* Trust signals */}
        <div className="mt-12 text-center text-sm text-muted-foreground space-y-2">
          <p>Secure payment processing · 100% satisfaction guarantee</p>
          <p>Questions? Email hello@greenelephant.org</p>
        </div>
      </div>
    </div>
  );
}
