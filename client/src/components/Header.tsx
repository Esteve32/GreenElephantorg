import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Sparkles, Users, BookOpen, Heart, PhoneCall, Trophy, Microscope, Target, Building2, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import logoUrl from "@assets/GE logo 512x512 transparent BG 2023 _1762732324529.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const whyItMattersItems = [
    { 
      href: "/what-is-conscious-communication", 
      label: "What is Conscious Communication?",
      description: "Discover the transformative power of conscious dialogue",
      icon: Sparkles
    },
    { 
      href: "/signals", 
      label: "Signals You're Drifting",
      description: "Recognize patterns that fracture trust and connection",
      icon: Target
    },
    { 
      href: "/stories", 
      label: "Stories of Transformation",
      description: "Real journeys from conflict to connection",
      icon: Heart
    },
  ];

  const programsItems = [
    { 
      href: "/satellitescan", 
      label: "Satellite Scan",
      description: "Light-touch assessment, insights you act on (€29.99)",
      icon: Compass
    },
    { 
      href: "/coaching", 
      label: "Micro-Habit Coaching",
      description: "Tiny changes. Big shift. One-to-one or micro-group",
      icon: Sparkles
    },
    { 
      href: "/interview-coaching", 
      label: "Interview Coaching",
      description: "3-session bundle for confident interview mastery (€795)",
      icon: Trophy
    },
    { 
      href: "/retreats", 
      label: "Retreats & Bootcamps",
      description: "Immersive experiences in Lapland and Provence",
      icon: Heart
    },
    { 
      href: "/consulting", 
      label: "Consulting",
      description: "Co-create your communication-centric strategy",
      icon: Building2
    },
  ];

  const aboutItems = [
    { 
      href: "/team", 
      label: "Meet the Team",
      description: "The curious minds guiding your transformation",
      icon: Users
    },
    { 
      href: "/references", 
      label: "Client References",
      description: "35+ organizations we've partnered with",
      icon: Heart
    },
    {
      href: "/contact",
      label: "Get in Touch",
      description: "Start your conscious communication journey",
      icon: PhoneCall
    },
  ];

  const resourcesItems = [
    { 
      href: "/resources", 
      label: "Resources & Prompts",
      description: "Tools and prompts structured by the 8 lenses",
      icon: BookOpen
    },
    { 
      href: "/choose-your-path", 
      label: "Find Your Path",
      description: "Take our diagnostic to find your ideal starting point",
      icon: Compass
    },
  ];

  const isMenuActive = (items: typeof whyItMattersItems) => {
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
            <img src={logoUrl} alt="GreenElephant" className="h-10 w-10" />
            <span className="text-lg font-semibold tracking-tight">GreenElephant</span>
          </Link>

          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className={`backdrop-blur-sm ${isMenuActive(whyItMattersItems) ? 'bg-white/10' : ''}`}
                  data-testid="nav-why-it-matters"
                >
                  Why It Matters
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {whyItMattersItems.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link href={item.href}>
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
                <NavigationMenuLink asChild>
                  <Link href="/periodic-table">
                    <div
                      className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md backdrop-blur-sm cursor-pointer hover-elevate ${location === '/periodic-table' ? 'bg-white/10' : ''}`}
                      data-testid="nav-framework"
                    >
                      Framework
                    </div>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className={`backdrop-blur-sm ${isMenuActive(programsItems) ? 'bg-white/10' : ''}`}
                  data-testid="nav-programs"
                >
                  Programs
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {programsItems.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link href={item.href}>
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
                >
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {resourcesItems.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link href={item.href}>
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
                  className={`backdrop-blur-sm ${isMenuActive(aboutItems) ? 'bg-white/10' : ''}`}
                  data-testid="nav-about"
                >
                  About
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {aboutItems.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link href={item.href}>
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
            <Link href="/choose-your-path">
              <Button 
                variant="outline"
                size="sm"
                className="backdrop-blur-sm bg-white/5 border-white/20 hover:bg-white/10"
                data-testid="button-explore-your-path"
              >
                Explore Your Path
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="sm"
                className="bg-needs hover:bg-needs/90 text-white gap-2"
                data-testid="button-talk-to-facilitator"
              >
                <PhoneCall className="h-4 w-4" />
                Talk to a Facilitator
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
                Why It Matters
              </h3>
              <div className="space-y-1">
                {whyItMattersItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      onClick={() => setMobileMenuOpen(false)}
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
                Framework
              </h3>
              <div className="space-y-1">
                <Link href="/periodic-table">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="link-mobile-periodic-table"
                  >
                    <Microscope className="h-4 w-4 text-white" />
                    Periodic Table
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                Programs
              </h3>
              <div className="space-y-1">
                {programsItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      onClick={() => setMobileMenuOpen(false)}
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
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      onClick={() => setMobileMenuOpen(false)}
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
                About
              </h3>
              <div className="space-y-1">
                {aboutItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      onClick={() => setMobileMenuOpen(false)}
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
              <Link href="/choose-your-path">
                <Button 
                  variant="outline" 
                  className="w-full justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="button-mobile-explore-your-path"
                >
                  Explore Your Path
                </Button>
              </Link>
              <Link href="/contact">
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
