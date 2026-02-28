import { useState, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Sparkles, Users, BookOpen, Heart, PhoneCall, Trophy, Microscope, Target, Building2, Compass, Calendar, Radar, Zap, Grid3X3, Lightbulb, Video, FileText, Image, Play, MessageSquare, Award, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
const logoUrl = "/ge-logo-512.png";

function handleAnchorClick(e: React.MouseEvent, href: string) {
  const hashIndex = href.indexOf('#');
  if (hashIndex === -1) return;
  
  const targetPath = href.substring(0, hashIndex) || '/';
  const hash = href.substring(hashIndex + 1);
  const currentPath = window.location.pathname;
  
  if (currentPath === targetPath) {
    e.preventDefault();
    const element = document.getElementById(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', href);
    }
  }
}

function LogoIcon({ className }: { className?: string }) {
  return <img src={logoUrl} alt="" className={className || "h-4 w-4"} />;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const scanItems = [
    { 
      href: "/scan#benefits", 
      label: "Who Benefits",
      description: "Professionals who transform their communication",
      icon: Users
    },
    { 
      href: "/scan#signals", 
      label: "Signals",
      description: "Pain points the Satellite Scan solves",
      icon: Radar
    },
    { 
      href: "/scan#what-is-it", 
      label: "What Is The Scan",
      description: "A 90-minute behavioral MRI for communication",
      icon: Target
    },
    { 
      href: "/scan#lenses", 
      label: "8 Lenses",
      description: "The communication framework explained",
      icon: Grid3X3
    },
    { 
      href: "/scan#how-it-works", 
      label: "How It Works",
      description: "Your journey from scan to transformation",
      icon: Zap
    },
  ];

  const programsItems = [
    { 
      href: "/programs#ea-coaching", 
      label: "EA Coaching",
      description: "Executive Assistant empowerment and leadership presence",
      icon: Sparkles
    },
    { 
      href: "/programs#interview-coaching", 
      label: "Interview Coaching",
      description: "3-session bundle for confident interview mastery (€795)",
      icon: Trophy
    },
    { 
      href: "/programs#your-path", 
      label: "Your Path",
      description: "Take our diagnostic to find your ideal starting point",
      icon: Compass
    },
  ];

  const resourcesItems = [
    { 
      href: "/resources#dashboard", 
      label: "Dashboard Tutorial",
      description: "Learn how to use your Satellite Scan results",
      icon: Video
    },
    { 
      href: "/resources#prompts", 
      label: "10+ Prompts",
      description: "AI prompts to mine your scan data",
      icon: FileText
    },
    { 
      href: "/resources#science", 
      label: "Science of Communication",
      description: "Videos and infographics covering the foundations",
      icon: Image
    },
    { 
      href: "/resources#calendar", 
      label: "Play Labs",
      description: "Seasonal webinars following the 8 lenses",
      icon: Play
    },
  ];

  const connectItems = [
    { 
      href: "/connect#team", 
      label: "Team",
      description: "Meet the facilitators behind the methodology",
      icon: Users
    },
    { 
      href: "/connect#references", 
      label: "References",
      description: "Testimonials from conscious leaders",
      icon: Award
    },
    { 
      href: "/connect#contact", 
      label: "Contact",
      description: "Start a conversation with us",
      icon: Mail
    },
  ];

  const isMenuActive = (items: typeof programsItems) => {
    const normalizedLocation = location.split('?')[0].split('#')[0].replace(/\/$/, '');
    
    return items.some(item => {
      const normalizedHref = item.href.replace(/\/$/, '');
      if (normalizedLocation === normalizedHref) return true;
      if (normalizedLocation.startsWith(normalizedHref + '/')) return true;
      return false;
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/60 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between" style={{ height: '72px' }}>
          <Link href="/" className="flex items-center gap-3 hover-elevate rounded-md px-2 py-1">
            <img src={logoUrl} alt="Satellite Scan" className="h-10 w-10" />
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight leading-tight">Satellite Scan</span>
              <span className="text-xs text-white/60 leading-tight hidden sm:block">Conscious Communication for a Connected World</span>
            </div>
          </Link>

          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className={`backdrop-blur-sm ${isMenuActive(scanItems) ? 'bg-white/10' : ''}`}
                  data-testid="nav-scan"
                  onClick={(e) => {
                    if (!(e.target as HTMLElement).closest('svg')) {
                      window.location.href = '/scan';
                    }
                  }}
                >
                  <Link href="/scan" className="mr-1" onClick={(e) => e.stopPropagation()}>Scan</Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {scanItems.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link href={item.href} onClick={(e) => handleAnchorClick(e, item.href)}>
                            <div
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover-elevate cursor-pointer"
                              data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              <div className="flex items-center gap-2 text-sm font-medium leading-none mb-2">
                                <item.icon className="h-4 w-4 text-white" />
                                {item.label}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className={`backdrop-blur-sm ${isMenuActive(resourcesItems) ? 'bg-white/10' : ''}`}
                  data-testid="nav-resources"
                  onClick={(e) => {
                    if (!(e.target as HTMLElement).closest('svg')) {
                      window.location.href = '/resources';
                    }
                  }}
                >
                  <Link href="/resources" className="mr-1" onClick={(e) => e.stopPropagation()}>Resources</Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {resourcesItems.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link href={item.href} onClick={(e) => handleAnchorClick(e, item.href)}>
                            <div
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover-elevate cursor-pointer"
                              data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              <div className="flex items-center gap-2 text-sm font-medium leading-none mb-2">
                                <item.icon className="h-4 w-4 text-white" />
                                {item.label}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className={`backdrop-blur-sm ${isMenuActive(programsItems) ? 'bg-white/10' : ''}`}
                  data-testid="nav-programs"
                  onClick={(e) => {
                    if (!(e.target as HTMLElement).closest('svg')) {
                      window.location.href = '/programs';
                    }
                  }}
                >
                  <Link href="/programs" className="mr-1" onClick={(e) => e.stopPropagation()}>Programs</Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {programsItems.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link href={item.href} onClick={(e) => handleAnchorClick(e, item.href)}>
                            <div
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover-elevate cursor-pointer"
                              data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              <div className="flex items-center gap-2 text-sm font-medium leading-none mb-2">
                                <item.icon className="h-4 w-4 text-white" />
                                {item.label}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className={`backdrop-blur-sm ${isMenuActive(connectItems) ? 'bg-white/10' : ''}`}
                  data-testid="nav-connect"
                  onClick={(e) => {
                    if (!(e.target as HTMLElement).closest('svg')) {
                      window.location.href = '/connect';
                    }
                  }}
                >
                  <Link href="/connect" className="mr-1" onClick={(e) => e.stopPropagation()}>Connect</Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {connectItems.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link href={item.href} onClick={(e) => handleAnchorClick(e, item.href)}>
                            <div
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover-elevate cursor-pointer"
                              data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              <div className="flex items-center gap-2 text-sm font-medium leading-none mb-2">
                                <item.icon className="h-4 w-4 text-white" />
                                {item.label}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/programs#your-path">
              <Button 
                variant="outline"
                size="sm"
                className="backdrop-blur-sm bg-white/5 border-white/20 hover:bg-white/10"
                data-testid="button-explore-your-path"
              >
                Find Your Path
              </Button>
            </Link>
            <Link href="/flow-check">
              <Button
                variant="outline"
                size="sm"
                className="backdrop-blur-sm bg-flow/10 border-flow/40 text-flow hover:bg-flow/20"
                data-testid="button-flow-check-nav"
              >
                Flow Check — Free
              </Button>
            </Link>
            <Link href="/scan">
              <Button 
                size="sm"
                className="bg-needs text-white gap-2"
                data-testid="button-take-scan"
              >
                Take the Scan
              </Button>
            </Link>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden backdrop-blur-lg bg-card/95 border-t border-white/10 max-h-[80vh] overflow-y-auto">
          <nav className="px-4 py-4 space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                Scan
              </h3>
              <div className="space-y-1">
                {scanItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={(e) => { handleAnchorClick(e, item.href); setMobileMenuOpen(false); }}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <item.icon className="h-4 w-4 text-white" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                Resources
              </h3>
              <div className="space-y-1">
                {resourcesItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={(e) => { handleAnchorClick(e, item.href); setMobileMenuOpen(false); }}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <item.icon className="h-4 w-4 text-white" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                Programs
              </h3>
              <div className="space-y-1">
                {programsItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={(e) => { handleAnchorClick(e, item.href); setMobileMenuOpen(false); }}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <item.icon className="h-4 w-4 text-white" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                Connect
              </h3>
              <div className="space-y-1">
                {connectItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={(e) => { handleAnchorClick(e, item.href); setMobileMenuOpen(false); }}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <item.icon className="h-4 w-4 text-white" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <Link href="/flow-check">
                <Button
                  variant="outline"
                  className="w-full justify-center bg-flow/10 border-flow/40 text-flow"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="button-mobile-flow-check"
                >
                  Flow Check — Free · 2 min
                </Button>
              </Link>
              <Link href="/programs#your-path">
                <Button 
                  variant="outline" 
                  className="w-full justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="button-mobile-explore-your-path"
                >
                  Explore Your Path
                </Button>
              </Link>
              <Link href="/connect#contact">
                <Button 
                  className="w-full bg-needs hover:bg-needs/90 text-white gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="button-mobile-talk-to-facilitator"
                >
                  <PhoneCall className="h-4 w-4" />
                  Talk to a Facilitator
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
