import { useState, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Brain, Users, Zap, BarChart3, Grid3X3, ActivitySquare, MessageSquare, Radio, CalendarDays, BookOpen, Mic, PhoneCall, Mail, Award } from "lucide-react";
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

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const scanItems = [
    {
      href: "/scan#what-is-it",
      label: "What It Reveals",
      description: "A behavioral mirror across 8 dimensions of self-awareness",
      icon: Brain
    },
    {
      href: "/scan#how-it-works",
      label: "How It Works",
      description: "90 min · 129 questions · your personal map, delivered in 48–72 h",
      icon: Zap
    },
    {
      href: "/scan#lenses",
      label: "The 8 Dimensions",
      description: "Influence · Attitude · Flow · Ego · Needs · Dynamics · Alignment · Chaordic",
      icon: Grid3X3
    },
    {
      href: "/scan#benefits",
      label: "Who Uses It",
      description: "EAs, founders, leaders, and anyone ready to see themselves clearly",
      icon: Users
    },
    {
      href: "/scan#results",
      label: "Your Results",
      description: "Dashboard, AI prompts, and coaching videos built around your data",
      icon: BarChart3
    },
  ];

  const exploreItems = [
    {
      href: "/periodic-table",
      label: "Periodic Table",
      description: "127 communication elements organized across 8 lenses",
      icon: Grid3X3
    },
    {
      href: "/flow-check",
      label: "Flow Check — Free",
      description: "2-minute self-check: where are you right now?",
      icon: ActivitySquare
    },
    {
      href: "/resources#prompts",
      label: "Prompt Library",
      description: "AI prompts to mine your scan data and deepen your practice",
      icon: MessageSquare
    },
    {
      href: "/decode",
      label: "Speech Lab",
      description: "Decode any conversation through the 8-lens framework",
      icon: Mic
    },
  ];

  const communityItems = [
    {
      href: "/webinars",
      label: "Monthly Webinars",
      description: "Live sessions exploring one lens per month",
      icon: Radio
    },
    {
      href: "/calendar",
      label: "Lens Calendar",
      description: "What the community is exploring this season",
      icon: CalendarDays
    },
    {
      href: "/connect#references",
      label: "References",
      description: "Testimonials and results from coaching clients and collaborators",
      icon: BookOpen
    },
  ];

  const isActive = (paths: string[]) => {
    const base = location.split('?')[0].split('#')[0].replace(/\/$/, '');
    return paths.some(p => base === p || base.startsWith(p + '/'));
  };

  const isScanActive = isActive(['/scan']);
  const isExploreActive = isActive(['/periodic-table', '/flow-check', '/resources', '/prompts', '/decode']);
  const isCommunityActive = isActive(['/webinars', '/calendar', '/stories']);
  const isConnectActive = isActive(['/connect']);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/60 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between" style={{ height: '72px' }}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover-elevate rounded-md px-2 py-1">
            <img src={logoUrl} alt="GreenElephant" className="h-10 w-10" />
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight leading-tight">Satellite Scan</span>
              <span className="text-xs text-white/60 leading-tight hidden sm:block">Self-awareness · Conscious Communication</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>

              {/* Scan */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={`backdrop-blur-sm ${isScanActive ? 'bg-white/10' : ''}`}
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
                  <ul className="grid w-[420px] gap-3 p-4">
                    {scanItems.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link href={item.href} onClick={(e) => handleAnchorClick(e, item.href)}>
                            <div
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover-elevate cursor-pointer"
                              data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              <div className="flex items-center gap-2 text-sm font-medium leading-none mb-1">
                                <item.icon className="h-4 w-4 text-needs" />
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
                    <li>
                      <Link href="/checkout?product=satellitescan">
                        <div className="rounded-md p-3 bg-needs/10 border border-needs/30 hover-elevate cursor-pointer">
                          <p className="text-sm font-semibold text-needs">Get the Scan — €99.95</p>
                          <p className="text-xs text-muted-foreground mt-0.5">90 minutes · results in 48–72 h</p>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Explore */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={`backdrop-blur-sm ${isExploreActive ? 'bg-white/10' : ''}`}
                  data-testid="nav-explore"
                  onClick={(e) => {
                    if (!(e.target as HTMLElement).closest('svg')) {
                      window.location.href = '/periodic-table';
                    }
                  }}
                >
                  <Link href="/periodic-table" className="mr-1" onClick={(e) => e.stopPropagation()}>Explore Resources</Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {exploreItems.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link href={item.href} onClick={(e) => handleAnchorClick(e, item.href)}>
                            <div
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover-elevate cursor-pointer"
                              data-testid={`link-${item.label.toLowerCase().replace(/[\s—]+/g, '-')}`}
                            >
                              <div className="flex items-center gap-2 text-sm font-medium leading-none mb-1">
                                <item.icon className="h-4 w-4 text-flow" />
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

              {/* Community */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={`backdrop-blur-sm ${isCommunityActive ? 'bg-white/10' : ''}`}
                  data-testid="nav-community"
                  onClick={(e) => {
                    if (!(e.target as HTMLElement).closest('svg')) {
                      window.location.href = '/webinars';
                    }
                  }}
                >
                  <Link href="/webinars" className="mr-1" onClick={(e) => e.stopPropagation()}>Community</Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[380px] gap-3 p-4">
                    {communityItems.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link href={item.href} onClick={(e) => handleAnchorClick(e, item.href)}>
                            <div
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover-elevate cursor-pointer"
                              data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              <div className="flex items-center gap-2 text-sm font-medium leading-none mb-1">
                                <item.icon className="h-4 w-4 text-ego" />
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

              {/* Flow Check — standalone, visually distinct */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/flow-check"
                    className={`group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors backdrop-blur-sm hover-elevate text-flow ${location === '/flow-check' ? 'bg-flow/10' : ''}`}
                    data-testid="nav-flow-check"
                  >
                    <ActivitySquare className="h-4 w-4 mr-1.5" />
                    Flow Check
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Connect — direct link */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/connect"
                    className={`group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors backdrop-blur-sm hover-elevate ${isConnectActive ? 'bg-white/10' : ''}`}
                    data-testid="nav-connect"
                  >
                    Connect
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
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

          {/* Mobile hamburger */}
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

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden backdrop-blur-lg bg-card/95 border-t border-white/10 max-h-[80vh] overflow-y-auto">
          <nav className="px-4 py-4 space-y-5">

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Scan</h3>
              <div className="space-y-1">
                {scanItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={(e) => { handleAnchorClick(e, item.href); setMobileMenuOpen(false); }}>
                    <Button variant="ghost" className="w-full justify-start gap-2" data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="h-4 w-4 text-needs" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Explore Resources</h3>
              <div className="space-y-1">
                {exploreItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={(e) => { handleAnchorClick(e, item.href); setMobileMenuOpen(false); }}>
                    <Button variant="ghost" className="w-full justify-start gap-2" data-testid={`link-mobile-${item.label.toLowerCase().replace(/[\s—]+/g, '-')}`}>
                      <item.icon className="h-4 w-4 text-flow" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Community</h3>
              <div className="space-y-1">
                {communityItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={(e) => { handleAnchorClick(e, item.href); setMobileMenuOpen(false); }}>
                    <Button variant="ghost" className="w-full justify-start gap-2" data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="h-4 w-4 text-ego" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Connect</h3>
              <div className="space-y-1">
                <Link href="/connect" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2" data-testid="link-mobile-connect">
                    <Mail className="h-4 w-4 text-white" />
                    Team & Contact
                  </Button>
                </Link>
                <Link href="/connect#references" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2" data-testid="link-mobile-references">
                    <Award className="h-4 w-4 text-white" />
                    References
                  </Button>
                </Link>
                <Link href="/programs" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2" data-testid="link-mobile-programs">
                    <PhoneCall className="h-4 w-4 text-white" />
                    Coaching Programs
                  </Button>
                </Link>
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
              <Link href="/scan">
                <Button
                  className="w-full bg-needs text-white gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="button-mobile-take-scan"
                >
                  Take the Scan — €99.95
                </Button>
              </Link>
            </div>

          </nav>
        </div>
      )}
    </header>
  );
}
