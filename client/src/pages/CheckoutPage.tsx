import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ArrowLeft } from "lucide-react";

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
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const urlParams = new URLSearchParams(window.location.search);
  const productType = urlParams.get('product');
  const packageType = urlParams.get('package') || '1on1-single';
  
  // Detect if this is a Satellite Scan purchase
  const isSatellitescan = productType === 'satellitescan';
  
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
        "AI-powered Satellite Scan (90 questions, ~120 min)",
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
    },
    'satellitescan': {
      name: "Satellitescan Beta",
      price: 29.99,
      features: [
        "90-minute AI-powered Typeform scan",
        "Personalized dashboard by Estève (manual creation)",
        "3-5 actionable micro-habits",
        "Video tutorials for each lens",
        "Dashboard delivered in 3-5 business days"
      ]
    }
  };

  const selectedPackage = isSatellitescan ? packages['satellitescan'] : packages[packageType];
  const finalPrice = Math.max(0, selectedPackage.price - discountAmount);

  useEffect(() => {
    if (!selectedPackage) {
      setLocation(isSatellitescan ? '/satellitescan' : '/coaching');
    }
  }, [packageType, selectedPackage, setLocation, isSatellitescan]);

  const validateCoupon = async () => {
    if (!couponCode) {
      toast({ title: "Enter a coupon code", variant: "destructive" });
      return;
    }
    
    try {
      const response = await fetch("/api/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode })
      });
      const data = await response.json();
      
      if (data.valid) {
        setDiscountAmount(data.discountAmount);
        toast({ title: "Coupon Applied!", description: data.message });
      } else {
        toast({ title: "Invalid Coupon", description: data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Could not validate coupon", variant: "destructive" });
    }
  };

  const handleCustomerInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingIntent(true);

    try {
      const endpoint = isSatellitescan 
        ? "/api/satellitescan/create-payment-intent" 
        : "/api/create-payment-intent";
      
      const payload = isSatellitescan
        ? { customerEmail, customerName }
        : { packageId: packageType, customerEmail, customerName };
      
      const response = await apiRequest("POST", endpoint, payload);
      const data = await response.json();
      setClientSecret(data.clientSecret);
      setShowPaymentForm(true);
    } catch (error) {
      console.error('Payment intent error:', error);
      toast({
        title: "Error",
        description: "Unable to prepare payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingIntent(false);
    }
  };

  if (!selectedPackage) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card/30 -z-10" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => setLocation(isSatellitescan ? '/satellitescan' : '/coaching')}
          className="mb-6"
          data-testid="button-back-to-coaching"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {isSatellitescan ? 'Back to Satellitescan' : 'Back to Coaching'}
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Package Summary */}
          <Card className="backdrop-blur-sm bg-card/95 h-fit sticky top-24">
            <CardHeader>
              <Badge className="w-fit mb-2 bg-alignment text-white">
                {isSatellitescan ? 'Satellitescan Beta' : 'Conscious Communication Coaching'}
              </Badge>
              <CardTitle className="text-2xl">{selectedPackage.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-4xl font-bold mb-1">€{finalPrice.toFixed(2)}</div>
                {discountAmount > 0 && (
                  <div className="text-sm text-green-500">Discount: -€{discountAmount.toFixed(2)}</div>
                )}
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

          {/* Customer Info & Payment Form */}
          <Card className="backdrop-blur-sm bg-card/95">
            <CardHeader>
              <CardTitle>{showPaymentForm ? "Complete Your Payment" : "Your Information"}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {showPaymentForm 
                  ? "Secure payment powered by Stripe. All transactions encrypted and PCI-DSS compliant."
                  : "We collect your email to deliver your service and send receipts. Your data stays private (GDPR protected)."
                }
              </p>
            </CardHeader>
            <CardContent>
              {!showPaymentForm ? (
                <form onSubmit={handleCustomerInfoSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      className="backdrop-blur-sm bg-white/5"
                      data-testid="input-customer-email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name (Optional)
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="backdrop-blur-sm bg-white/5"
                      data-testid="input-customer-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="coupon" className="text-sm font-medium">
                      Coupon Code (Optional)
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="coupon"
                        type="text"
                        placeholder="e.g., STUDENT50"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="backdrop-blur-sm bg-white/5"
                        data-testid="input-coupon-code"
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={validateCoupon}
                        data-testid="button-apply-coupon"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-alignment text-white hover:opacity-90"
                    disabled={isCreatingIntent}
                    data-testid="button-continue-to-payment"
                  >
                    {isCreatingIntent ? "Loading..." : `Continue to Payment - €${finalPrice.toFixed(2)}`}
                  </Button>
                </form>
              ) : (
                clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm packageInfo={selectedPackage} />
                  </Elements>
                )
              )}
            </CardContent>
          </Card>
        </div>

        {/* GDPR & Trust Signals */}
        <div className="mt-12 space-y-6">
          <Card className="bg-ego/5 border-ego/20 p-4">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Your Privacy Matters:</strong> We collect your email and name to send your receipt, deliver your service, and follow up on your transformation. We'll never share your data. Learn more in our <Link href="/privacy" className="text-primary hover:underline">privacy policy</Link>.
            </p>
          </Card>
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p><strong className="text-foreground">After Payment:</strong> You'll receive a confirmation email within seconds with next steps</p>
            <p className="text-xs">Secure payment by Stripe · EU AI Act compliant · GDPR protected</p>
            <p>Questions? Email esteve@greenelephant.org</p>
          </div>
        </div>
      </div>
    </div>
  );
}
