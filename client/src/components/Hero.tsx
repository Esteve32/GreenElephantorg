import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Sparkles } from "lucide-react";
const heroImageUrl = "/spiritual-hero.png";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ paddingTop: '88px', paddingBottom: '128px' }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8">
          <Sparkles className="h-4 w-4 text-needs" />
          <span className="text-sm text-muted-foreground">Conscious Communication for Leaders and Teams</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
          Design the human conversations<br />AI can't.
        </h1>

        <h2 className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed">
          Conscious communication for leaders and teams in a machine-made world.
        </h2>

        <p className="text-lg text-muted-foreground/80 mb-12 max-w-2xl mx-auto">
          AI can automate words, not wisdom. It doesn't sit in the tension of disagreement or rebuild trust after a hard meeting. That's your work. We help you master it.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/choose-your-path">
            <Button 
              size="lg" 
              className="bg-needs hover:bg-needs/90 text-white min-w-[220px]"
              data-testid="button-find-your-path"
            >
              Find Your Path
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/periodic-table">
            <Button 
              size="lg" 
              variant="outline"
              className="backdrop-blur-sm bg-white/5 border-white/20 hover:bg-white/10 min-w-[220px]"
              data-testid="button-explore-framework"
            >
              Explore the Framework
            </Button>
          </Link>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}
