import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Timer, Sparkles, Target, Users, Brain, ArrowRight, Clock, Gift } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";

export default function SatelliteScanPage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // SEO Meta Tags
  useEffect(() => {
    document.title = "Satellitescan Beta - €29.99 | Map Your Communication Patterns | GreenElephant";
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Map your communication patterns in 90 minutes. AI-powered Typeform scan + personalized dashboard by Estève for conscious leaders, coaches, and therapists. Beta: €29.99 (Regular: €697).');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Map your communication patterns in 90 minutes. AI-powered Typeform scan + personalized dashboard by Estève for conscious leaders, coaches, and therapists. Beta: €29.99 (Regular: €697).';
      document.head.appendChild(meta);
    }

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: 'Satellitescan Beta - Map Your Communication Patterns in 90 Minutes' },
      { property: 'og:description', content: 'AI-powered communication scan + manual dashboard creation by Estève. For conscious leaders, coaches & therapists. Christmas Beta: €29.99 (Regular: €697).' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://greenelephant.org/satellitescan' },
      { property: 'og:image', content: 'https://greenelephant.org/satellitescan-og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Satellitescan Beta - €29.99 | Communication Mapping for Conscious Leaders' },
      { name: 'twitter:description', content: '90-min AI scan + personalized dashboard by Estève. For TEAL leaders, coaches, therapists.' },
    ];

    ogTags.forEach(tag => {
      const existing = document.querySelector(`meta[${tag.property ? 'property' : 'name'}="${tag.property || tag.name}"]`);
      if (existing) {
        existing.setAttribute('content', tag.content);
      } else {
        const meta = document.createElement('meta');
        if (tag.property) {
          meta.setAttribute('property', tag.property);
        } else {
          meta.setAttribute('name', tag.name!);
        }
        meta.content = tag.content;
        document.head.appendChild(meta);
      }
    });

    // Cleanup on unmount
    return () => {
      document.title = 'GreenElephant - Conscious Communication';
    };
  }, []);

  return (
    <div className="min-h-screen" role="main" aria-label="Satellitescan landing page">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden" aria-labelledby="hero-heading">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--needs))] via-[hsl(var(--ego))] to-[hsl(var(--flow))] opacity-10" aria-hidden="true"></div>
        
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <Badge className="mb-4" data-testid="badge-beta">
            <Gift className="w-3 h-3 mr-1" />
            Christmas Beta Launch
          </Badge>
          
          <h1 id="hero-heading" className="text-4xl md:text-5xl font-bold tracking-tight" data-testid="heading-hero">
            Map Your Communication Patterns in 90 Minutes
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-testid="text-subtitle">
            The Satellitescan gives conscious leaders, coaches, and therapists a personalized dashboard of their communication strengths and blind spots across 8 research-backed lenses.
          </p>

          {/* Pricing - Transparent AI Split */}
          <div className="flex flex-col items-center gap-4 pt-6">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-primary" data-testid="text-beta-price">€29.99</span>
              <span className="text-2xl text-muted-foreground line-through" data-testid="text-regular-price">€697</span>
            </div>
            
            <div className="max-w-md space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-[hsl(var(--ego))]" />
                <span><strong>€30 value:</strong> AI-powered 90-minute Typeform scan</span>
              </p>
              <p className="flex items-center justify-center gap-2">
                <Brain className="w-4 h-4 text-[hsl(var(--needs))]" />
                <span><strong>€670 value:</strong> Manual dashboard creation by Estève + video guidance</span>
              </p>
            </div>

            <p className="text-sm text-muted-foreground italic" data-testid="text-beta-notice">
              Beta pricing ends when we validate demand. If we get 40+ sign-ups, price returns to €697.
            </p>
          </div>

          <div className="pt-8">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => {
                const checkoutSection = document.getElementById('checkout');
                checkoutSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              data-testid="button-cta-hero"
              aria-label="Scroll to checkout section to purchase Satellitescan beta access for 29.99 euros"
            >
              Get Beta Access - €29.99
              <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 px-4 bg-muted/30" aria-labelledby="what-you-get-heading">
        <div className="max-w-5xl mx-auto">
          <h2 id="what-you-get-heading" className="text-3xl font-bold text-center mb-12" data-testid="heading-what-you-get">
            What's Included in Your Satellitescan
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[hsl(var(--ego))]/10 flex items-center justify-center flex-shrink-0">
                  <Timer className="w-6 h-6 text-[hsl(var(--ego))]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">90-Minute AI-Powered Scan</h3>
                  <p className="text-muted-foreground">
                    Deep-dive Typeform questionnaire analyzing your communication patterns across Influence, Attitude, Chaordic, Flow, Alignment, Needs, Ego, and Dynamics lenses.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[hsl(var(--needs))]/10 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-[hsl(var(--needs))]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Personalized Dashboard by Estève</h3>
                  <p className="text-muted-foreground">
                    I manually review your responses and create a custom visual dashboard highlighting your strengths, blind spots, and growth areas. Delivered within 3-5 business days.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[hsl(var(--flow))]/10 flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-[hsl(var(--flow))]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Actionable Micro-Habits</h3>
                  <p className="text-muted-foreground">
                    3-5 specific communication micro-habits tailored to your profile. Small shifts that create lasting transformation in how you connect with others.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[hsl(var(--alignment))]/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-[hsl(var(--alignment))]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Video Tutorials</h3>
                  <p className="text-muted-foreground">
                    Short videos explaining each lens, how to interpret your dashboard, and practical tips for immediate application in your coaching or leadership work.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" data-testid="heading-who-for">
            Perfect for Conscious Professionals
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "TEAL Leaders",
                description: "Founders building self-organizing teams who communicate beyond hierarchy."
              },
              {
                title: "Coaches & Facilitators",
                description: "Helping clients navigate complex relational dynamics with precision."
              },
              {
                title: "Therapists & Teachers",
                description: "Using communication daily to create trust and foster growth."
              }
            ].map((persona, i) => (
              <Card key={i} className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-primary mx-auto" />
                <h3 className="font-semibold text-lg">{persona.title}</h3>
                <p className="text-sm text-muted-foreground">{persona.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" data-testid="heading-how-works">
            How Satellitescan Works
          </h2>
          
          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Purchase & Receive Link",
                description: "After payment, you'll get an email with the Typeform link and instructions. Set aside 60-90 minutes in a quiet space."
              },
              {
                step: "2",
                title: "Complete the Scan",
                description: "Answer questions about real communication scenarios. The AI structures your responses across 8 lenses, but there's no automated analysis—this is data collection only."
              },
              {
                step: "3",
                title: "Estève Creates Your Dashboard",
                description: "I personally review your answers, identify patterns, and build a custom visual dashboard with specific micro-habits. This takes 3-5 business days."
              },
              {
                step: "4",
                title: "Watch Videos & Apply",
                description: "You'll receive your dashboard with video tutorials explaining each insight. Start practicing your personalized micro-habits immediately."
              }
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Transparency */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 border-[hsl(var(--ego))]">
            <div className="flex items-start gap-4">
              <Sparkles className="w-8 h-8 text-[hsl(var(--ego))] flex-shrink-0 mt-1" />
              <div className="space-y-4">
                <h2 className="text-2xl font-bold" data-testid="heading-ai-transparency">
                  Human-in-the-Loop: What's AI, What's Human
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">AI handles:</strong> The 90-minute Typeform questionnaire uses AI to structure questions and collect data efficiently. This is the €30 component.
                  </p>
                  <p>
                    <strong className="text-foreground">I (Estève) handle:</strong> Dashboard creation, pattern identification, micro-habit recommendations, and video tutorials. This manual work is the €670 value—and why beta pricing is 96% off.
                  </p>
                  <p className="text-sm italic">
                    We're testing whether conscious professionals value AI-assisted reflection paired with human expertise. Your participation shapes the future of this product.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" data-testid="heading-faq">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {[
              {
                q: "How long does the scan take?",
                a: "60-90 minutes. We recommend doing it in one sitting for the most coherent results, but you can pause if needed."
              },
              {
                q: "When will I get my dashboard?",
                a: "Within 3-5 business days after you complete the Typeform. I personally review every submission and create each dashboard manually."
              },
              {
                q: "What if I don't complete the Typeform right away?",
                a: "No problem! You'll receive a friendly reminder email after 3-4 days. The link doesn't expire."
              },
              {
                q: "Can I share my dashboard with my team?",
                a: "Absolutely. Many coaches and leaders use their Satellitescan as a conversation starter with teams or clients."
              },
              {
                q: "Is this different from personality tests like Myers-Briggs?",
                a: "Yes. We don't categorize you into types. Instead, we map your actual communication behaviors across 8 lenses based on real scenarios you've experienced."
              },
              {
                q: "What happens after the beta?",
                a: "If we validate demand (40+ purchases), the price returns to €697. Early adopters get lifetime access to dashboard updates and new video content as we refine the product."
              }
            ].map((faq, i) => (
              <Card key={i} className="p-6">
                <h3 className="font-semibold text-lg mb-3">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Checkout Section */}
      <section id="checkout" className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div>
            <Badge className="mb-4">
              <Clock className="w-3 h-3 mr-1" />
              Limited Beta Spots
            </Badge>
            <h2 className="text-3xl font-bold mb-4" data-testid="heading-checkout">
              Join the Beta - €29.99
            </h2>
            <p className="text-lg text-muted-foreground mb-2">
              Regular price: €697 (96% off during beta)
            </p>
            <p className="text-sm text-muted-foreground italic">
              Price increases after we validate demand with 40+ conscious leaders
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/checkout?product=satellitescan">
              <Button size="lg" className="w-full max-w-md text-lg py-6" data-testid="button-checkout">
                Get Beta Access Now - €29.99
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <p className="text-xs text-muted-foreground">
              Secure payment via Stripe • You'll receive the Typeform link immediately
            </p>
          </div>

          <div className="pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              Questions? <Link href="/contact"><a className="text-primary hover:underline">Contact Estève directly</a></Link>
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-[hsl(var(--needs))]/10 via-[hsl(var(--ego))]/10 to-[hsl(var(--flow))]/10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold">
            Invest 90 Minutes Once. Get Insights Forever.
          </h2>
          <p className="text-lg text-muted-foreground">
            Beta pricing won't last. Be among the first conscious leaders mapping their communication DNA.
          </p>
          <Link href="/checkout?product=satellitescan">
            <Button size="lg" className="text-lg px-8 py-6" data-testid="button-cta-bottom">
              Get Beta Access - €29.99
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
