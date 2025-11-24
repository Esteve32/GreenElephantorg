import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Timer, Sparkles, Target, Users, Brain, ArrowRight, Clock, Gift, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";

export default function SatelliteScanPage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [, navigate] = useLocation();

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
      <section className="relative py-32 px-4 overflow-hidden" aria-labelledby="hero-heading">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--needs))]/5 via-[hsl(var(--ego))]/5 to-[hsl(var(--flow))]/5" aria-hidden="true"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(var(--needs-rgb,120,81,169),.15),rgba(255,255,255,0))]" aria-hidden="true"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[hsl(var(--ego))]/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" aria-hidden="true"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-[hsl(var(--needs))]/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} aria-hidden="true"></div>
        
        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <Badge className="mb-4" data-testid="badge-beta">
            <Gift className="w-3 h-3 mr-1" />
            Trusted by 500+ Early Adopters
          </Badge>
          
          <h1 id="hero-heading" className="text-4xl md:text-5xl font-bold tracking-tight" data-testid="heading-hero">
            🛰️ The Satellite Scan
          </h1>
          <p className="text-2xl font-semibold text-muted-foreground">
            Map Your Communication Patterns in 90 Minutes
          </p>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-testid="text-subtitle">
            The Satellitescan gives conscious leaders, coaches, and therapists a personalized dashboard of their communication strengths and blind spots across 8 research-backed lenses.
          </p>

          {/* Pricing - Transparent AI Split */}
          <div className="flex flex-col items-center gap-6 pt-8">
            <div className="flex items-baseline gap-4">
              <span className="text-6xl font-bold text-primary" data-testid="text-beta-price">€29.99</span>
              <span className="text-3xl text-muted-foreground line-through" data-testid="text-regular-price">€697</span>
            </div>
            
            <div className="max-w-lg space-y-4 text-sm">
              <div className="bg-[hsl(var(--ego))]/5 rounded-lg p-4 border border-[hsl(var(--ego))]/20 hover-elevate transition-all">
                <p className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[hsl(var(--ego))] flex-shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">Smart Questionnaire (€30):</strong> <span className="text-muted-foreground">AI helps you answer 40 real-life communication questions in about 90 minutes</span></span>
                </p>
              </div>
              <div className="bg-[hsl(var(--needs))]/5 rounded-lg p-4 border border-[hsl(var(--needs))]/20 hover-elevate transition-all">
                <p className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-[hsl(var(--needs))] flex-shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">Your Personal Dashboard (€670):</strong> <span className="text-muted-foreground">Estève reviews your answers and creates a custom visual map of your communication style, plus video tutorials you can watch right away</span></span>
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground italic max-w-md" data-testid="text-beta-notice">
              This pricing reflects 3 years of development and refinement with our early adopter community. The regular price will be €697.
            </p>
          </div>

          <div className="pt-12">
            <Button 
              size="lg" 
              className="text-lg font-bold px-10 py-7"
              onClick={() => {
                const checkoutSection = document.getElementById('checkout');
                checkoutSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              data-testid="button-cta-hero"
              aria-label="Scroll to checkout section to purchase Satellite Scan access for 29.99 euros"
            >
              Get Access Now - €29.99
              <ArrowRight className="ml-3 w-5 h-5" aria-hidden="true" />
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
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 space-y-4">
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

            <Card className="p-8 space-y-4">
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

            <Card className="p-8 space-y-4">
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

            <Card className="p-8 space-y-4">
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Executive Assistants",
                description: "Managing complex team dynamics and keeping everyone aligned. You hold the threads together."
              },
              {
                title: "Operational Leaders",
                description: "Running the systems that make organizations work. You need crystal-clear communication to be effective."
              },
              {
                title: "Innovation Managers",
                description: "Leading teams through change and uncertainty. Strong communication is your superpower."
              },
              {
                title: "TEAL Leaders & Founders",
                description: "Building teams that self-organize. You communicate beyond hierarchy and power."
              },
              {
                title: "Coaches & Facilitators",
                description: "Helping people navigate their toughest conversations and relational moments."
              },
              {
                title: "Therapists & Teachers",
                description: "Using communication daily to build trust and help people grow and heal."
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
                q: "How long does it take to complete the Satellite Scan?",
                a: "Plan for about 60-90 minutes. It's best to do it all at once in a quiet space where you can think clearly, but you can save your progress and come back if you need to."
              },
              {
                q: "When will I get my dashboard?",
                a: "Within 3-5 business days. Estève personally reads every single response and creates your custom dashboard by hand—it's not automated."
              },
              {
                q: "What if I don't complete the scan right away?",
                a: "No problem! After a few days you'll get a friendly reminder email. Your link never expires, so finish it whenever you're ready."
              },
              {
                q: "What exactly is this? Is it a personality test like Myers-Briggs?",
                a: "No. This is NOT a personality test. It's a behavior snapshot self-assessment for self-aware people who want to calibrate their communication style. Instead of putting you in a box (like \"You're an introvert\"), we map out your actual communication patterns based on real situations you've been in."
              },
              {
                q: "Who should actually do this Satellite Scan?",
                a: "If you're already self-aware and curious about how you show up in conversations—and you're willing to be honest about it—this is for you. It's not for people looking for a quick personality label. It's for people who want real insights to improve."
              },
              {
                q: "Can I share my dashboard with my team or my clients?",
                a: "Absolutely. Many coaches and leaders use their Satellite Scan dashboard as a starting point for conversations with their teams or clients."
              },
              {
                q: "What makes this different from regular communication coaching?",
                a: "You get a personalized visual map of your communication patterns, specific micro-habits you can practice right away, and videos explaining everything. It's like having a communication mirror held up by an expert."
              },
              {
                q: "What happens after the beta period?",
                a: "The Satellite Scan is now in version 12, refined over 3 years with hundreds of early adopters. We're offering special pricing to recognize everyone who helped shape this. The regular price will be €697. You get lifetime access to all future updates, video content, and improvements as we continue developing the tool based on what we learn from you."
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
      <section id="checkout" className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-10">
          <div className="space-y-4">
            <Badge className="mb-4">
              <Clock className="w-3 h-3 mr-1" />
              3 Years. 500+ Users. Version 12.
            </Badge>
            <h2 className="text-3xl font-bold mb-4" data-testid="heading-checkout">
              Get Access Now - €29.99
            </h2>
            <p className="text-lg text-muted-foreground mb-2">
              Regular price: €697 (96% off)
            </p>
            <p className="text-sm text-muted-foreground italic">
              Special pricing for early supporters
            </p>
          </div>

          <div className="space-y-5 flex flex-col items-center pt-4">
            <Button 
              size="lg" 
              className="w-full max-w-md text-lg font-bold py-7" 
              data-testid="button-checkout"
              onClick={() => navigate("/checkout?product=satellitescan")}
            >
              Get Access Now - €29.99
              <ArrowRight className="ml-3 w-5 h-5" />
            </Button>
            
            <p className="text-xs text-muted-foreground max-w-sm">
              Secure payment via Stripe • You'll receive the Typeform link immediately • Full refund policy
            </p>
          </div>

          <div className="pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              Questions? <Link href="/contact" className="text-primary hover:underline">Contact Estève directly</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Real People, Real Changes</h2>
          
          <TestimonialCarousel />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-[hsl(var(--needs))]/10 via-[hsl(var(--ego))]/10 to-[hsl(var(--flow))]/10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              Invest 90 Minutes Once. Get Insights Forever.
            </h2>
            <p className="text-lg text-muted-foreground">
              Join 500+ early adopters using version 12 to transform their communication. Real insights from 3 years of real-world testing.
            </p>
          </div>
          <Button 
            size="lg" 
            className="text-lg font-bold px-10 py-7" 
            data-testid="button-cta-bottom"
            onClick={() => navigate("/checkout?product=satellitescan")}
          >
            Get Access Now - €29.99
            <ArrowRight className="ml-3 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}

function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      name: "Sarah M.",
      role: "Executive Assistant, Tech Company",
      quote: "I used the micro-habits from my Satellite Scan to redesign our morning team rituals. Now everyone shows up more present. The dashboard was like finally understanding why certain conversations felt stuck.",
      habit: "Morning Ritual Redesign"
    },
    {
      name: "James L.",
      role: "Operations Director, Startup",
      quote: "The communication check-in ritual we implemented after seeing my dashboard changed everything. My team went from avoiding difficult conversations to naming them directly. That's worth way more than €29.99.",
      habit: "Weekly Communication Check-ins"
    },
    {
      name: "Elena K.",
      role: "Coach & Facilitator",
      quote: "I introduced the thumbs voting ritual for team decision-making. Instead of the loudest voice winning, now every perspective gets heard. My clients say it's the simplest thing that shifted everything.",
      habit: "Thumbs Voting Decisions"
    }
  ];
  
  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  
  return (
    <div className="space-y-8">
      <Card className="p-10 min-h-64 flex flex-col justify-center">
        <div className="space-y-6">
          <p className="text-lg leading-relaxed">
            "{testimonials[currentIndex].quote}"
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-base">{testimonials[currentIndex].name}</p>
              <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</p>
              <Badge className="mt-3 bg-primary/10 text-primary border-primary/20">
                {testimonials[currentIndex].habit}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="flex items-center justify-center gap-6">
        <Button 
          size="icon" 
          variant="outline" 
          onClick={prev}
          data-testid="button-testimonial-prev"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex gap-3">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
              data-testid={`button-testimonial-dot-${i}`}
            />
          ))}
        </div>
        
        <Button 
          size="icon" 
          variant="outline" 
          onClick={next}
          data-testid="button-testimonial-next"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
