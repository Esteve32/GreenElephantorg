import { useState, useCallback, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Menu, X, Brain, Users, Zap, BarChart3, Grid3X3, ActivitySquare, MessageSquare, Radio, CalendarDays, BookOpen, Mic, PhoneCall, Mail, Award, LogIn, GraduationCap, Compass, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

  const { data: publicSettings } = useQuery<{
    portalLoginEnabled: boolean;
    saasEnabled: boolean;
  }>({ queryKey: ["/api/portal/settings/public"] });

  const showLogin = publicSettings?.portalLoginEnabled ?? true;
  const saasEnabled = publicSettings?.saasEnabled ?? false;

  const [isReturningUser, setIsReturningUser] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('ge_portal_visited')) {
      setIsReturningUser(true);
    }
  }, []);

  const { data: portalMe } = useQuery<{ authenticated: boolean; user?: { id: number } }>({
    queryKey: ["/api/portal/me"],
    retry: false,
  });
  const portalUser = portalMe?.authenticated ? portalMe.user : undefined;

  useEffect(() => {
    if (portalUser?.id) {
      localStorage.setItem('ge_portal_visited', '1');
      setIsReturningUser(true);
    }
  }, [portalUser]);

  const discoverItems = [
    {
      href: "/flow-check",
      label: "Flow Check — Free",
      description: "2-minute self-check: where are you right now?",
      icon: ActivitySquare
    },
    {
      href: "/periodic-table",
      label: "Periodic Table",
      description: "127 communication elements organized across 8 lenses",
      icon: Grid3X3
    },
    {
      href: "/decode",
      label: "Speech Lab",
      description: "Decode any conversation through the 8-lens framework",
      icon: Mic
    },
    {
      href: "/resources#prompts",
      label: "Prompt Library",
      description: "AI prompts to mine your scan data and deepen your practice",
      icon: MessageSquare
    },
  ];

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
      description: "90 min, 129 questions, your personal map delivered in 48-72 h",
      icon: Zap
    },
    {
      href: "/scan#lenses",
      label: "The 8 Dimensions",
      description: "Influence, Attitude, Flow, Ego, Needs, Dynamics, Alignment, Chaordic",
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

  const learnItems = [
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
      href: "/resources",
      label: "Resources & Prompts",
      description: "Guides, articles, and tools to deepen your practice",
      icon: BookOpen
    },
  ];

  const programsItems = [
    {
      href: "/programs#ea-coaching",
      label: "EA Coaching",
      description: "Tailored communication coaching for Executive Assistants",
      icon: GraduationCap
    },
    {
      href: "/programs#interview-coaching",
      label: "Interview Coaching",
      description: "Prepare for high-stakes conversations with confidence",
      icon: Mic
    },
    {
      href: "/programs#your-path",
      label: "Your Path",
      description: "A personalized coaching journey built around your scan results",
      icon: Compass
    },
    {
      href: "/for-executive-assistants",
      label: "For Executive Assistants",
      description: "How the Scan helps EAs master stakeholder communication",
      icon: Users
    },
    {
      href: "/for-ceos",
      label: "For CEOs",
      description: "Self-awareness tools for leaders who shape culture",
      icon: Award
    },
    {
      href: "/portal/login",
      label: "Client Portal",
      description: "Log in to your dashboard, prompts, and coaching tools",
      icon: LogIn
    },
  ];

  const connectItems = [
    {
      href: "/connect#references",
      label: "References",
      description: "Testimonials and results from coaching clients and collaborators",
      icon: Award
    },
    {
      href: "/connect#team",
      label: "Team",
      description: "Meet the people behind GreenElephant",
      icon: Users
    },
    {
      href: "/connect#contact",
      label: "Contact",
      description: "Get in touch — we'd love to hear from you",
      icon: Mail
    },
  ];

  const navSections = [
    {
      key: "discover",
      label: "Discover",
      tooltip: "Free tools to explore conscious communication — start here, no commitment needed",
      items: discoverItems,
      defaultHref: "/flow-check",
      iconColor: "text-flow",
      activePaths: ['/flow-check', '/periodic-table', '/resources', '/prompts', '/decode'],
    },
    {
      key: "scan",
      label: "Scan",
      tooltip: "Your personal communication assessment — 129 questions, 8 dimensions, results in 48-72 h",
      items: scanItems,
      defaultHref: "/scan",
      iconColor: "text-needs",
      activePaths: ['/scan'],
      cta: { href: "/checkout?product=satellitescan", title: "Get the Scan — €99.95", subtitle: "90 minutes · results in 48–72 h" },
    },
    {
      key: "learn",
      label: "Learn",
      tooltip: "Webinars, calendar, and resources — stay engaged and keep growing with the community",
      items: learnItems,
      defaultHref: "/webinars",
      iconColor: "text-ego",
      activePaths: ['/webinars', '/calendar'],
    },
    {
      key: "programs",
      label: "Programs",
      tooltip: "Coaching and training programs — go deeper after your Scan with guided support",
      items: programsItems,
      defaultHref: "/programs",
      iconColor: "text-chaordic",
      activePaths: ['/programs', '/for-executive-assistants', '/for-ceos', '/for-virtual-assistants', '/executive-coaching-assessment'],
    },
    {
      key: "connect",
      label: "Connect",
      tooltip: "References, team, and contact — see who we've worked with and reach out",
      items: connectItems,
      defaultHref: "/connect",
      iconColor: "text-dynamics",
      activePaths: ['/connect'],
    },
  ];

  const isActive = (paths: string[]) => {
    const base = location.split('?')[0].split('#')[0].replace(/\/$/, '');
    return paths.some(p => base === p || base.startsWith(p + '/'));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/60 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between" style={{ height: '72px' }}>
          <Link href="/" className="flex items-center gap-3 hover-elevate rounded-md px-2 py-1">
            <img src={logoUrl} alt="GreenElephant" className="h-10 w-10" />
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight leading-tight">Satellite Scan</span>
              <span className="text-xs text-white/60 leading-tight hidden sm:block">Self-awareness · Conscious Communication</span>
            </div>
          </Link>

          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navSections.map((section) => (
                <NavigationMenuItem key={section.key}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavigationMenuTrigger
                        className={`backdrop-blur-sm ${isActive(section.activePaths) ? 'bg-white/10' : ''}`}
                        data-testid={`nav-${section.key}`}
                        onClick={(e) => {
                          if (!(e.target as HTMLElement).closest('svg')) {
                            window.location.href = section.defaultHref;
                          }
                        }}
                      >
                        <Link href={section.defaultHref} className="mr-1" onClick={(e) => e.stopPropagation()}>{section.label}</Link>
                      </NavigationMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-[260px] text-center">
                      <p className="text-xs">{section.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                  <NavigationMenuContent>
                    <ul className="grid w-[420px] gap-3 p-4">
                      {section.items.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link href={item.href} onClick={(e) => handleAnchorClick(e, item.href)}>
                              <div
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover-elevate cursor-pointer"
                                data-testid={`link-${item.label.toLowerCase().replace(/[\s—]+/g, '-')}`}
                              >
                                <div className="flex items-center gap-2 text-sm font-medium leading-none mb-1">
                                  <item.icon className={`h-4 w-4 ${section.iconColor}`} />
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
                      {section.cta && (
                        <li>
                          <Link href={section.cta.href}>
                            <div className="rounded-md p-3 bg-needs/10 border border-needs/30 hover-elevate cursor-pointer">
                              <p className="text-sm font-semibold text-needs">{section.cta.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{section.cta.subtitle}</p>
                            </div>
                          </Link>
                        </li>
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}

            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden lg:flex items-center gap-3">
            {saasEnabled && portalUser?.id ? (
              <Link href="/scan">
                <Button
                  size="sm"
                  className="bg-needs text-white gap-2 bioelectric-cta"
                  data-testid="button-header-cta"
                >
                  Take the Scan
                </Button>
              </Link>
            ) : saasEnabled || (showLogin && isReturningUser) ? (
              <Link href="/portal/login">
                <Button
                  size="sm"
                  className="bg-needs text-white gap-2 bioelectric-cta"
                  data-testid="button-header-cta"
                >
                  <LogIn className="h-4 w-4" />
                  Log in
                </Button>
              </Link>
            ) : (
              <Link href="/scan">
                <Button
                  size="sm"
                  className="bg-needs text-white gap-2 bioelectric-cta"
                  data-testid="button-header-cta"
                >
                  Take the Scan
                </Button>
              </Link>
            )}
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
          <nav className="px-4 py-4 space-y-5">

            {navSections.map((section) => (
              <div key={section.key}>
                <div className="mb-2 px-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{section.label}</h3>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">{section.tooltip}</p>
                </div>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Link key={item.href} href={item.href} onClick={(e) => { handleAnchorClick(e, item.href); setMobileMenuOpen(false); }}>
                      <Button variant="ghost" className="w-full justify-start gap-2" data-testid={`link-mobile-${item.label.toLowerCase().replace(/[\s—]+/g, '-')}`}>
                        <item.icon className={`h-4 w-4 ${section.iconColor}`} />
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-white/10 space-y-2">
              {saasEnabled && portalUser?.id ? (
                <Link href="/scan">
                  <Button
                    className="w-full bg-needs text-white gap-2 bioelectric-cta"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="button-mobile-cta"
                  >
                    Take the Scan
                  </Button>
                </Link>
              ) : saasEnabled || (showLogin && isReturningUser) ? (
                <Link href="/portal/login">
                  <Button
                    className="w-full bg-needs text-white gap-2 bioelectric-cta"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="button-mobile-cta"
                  >
                    <LogIn className="h-4 w-4" />
                    Log in
                  </Button>
                </Link>
              ) : (
                <Link href="/scan">
                  <Button
                    className="w-full bg-needs text-white gap-2 bioelectric-cta"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="button-mobile-cta"
                  >
                    Take the Scan — €99.95
                  </Button>
                </Link>
              )}
            </div>

          </nav>
        </div>
      )}
    </header>
  );
}
