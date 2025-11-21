import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, AlertCircle, Sparkles, Users, BookOpen, Microscope, Heart, PhoneCall } from "lucide-react";
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

  const awakenItems = [
    { 
      href: "/what-is-conscious-communication", 
      label: "What is Conscious Communication?",
      description: "Discover the transformative power of conscious dialogue",
      icon: Sparkles
    },
    { 
      href: "/signals", 
      label: "Signals You're Drifting",
      description: "Recognize the patterns that fracture trust and connection",
      icon: AlertCircle
    },
    { 
      href: "/periodic-table", 
      label: "Science & Proof",
      description: "Our Periodic Table framework backed by research",
      icon: Microscope
    },
  ];

  const practiceItems = [
    { 
      href: "/coaching", 
      label: "Coaching",
      description: "1:1 and group guidance for sustainable change",
      icon: Users
    },
    { 
      href: "/consulting", 
      label: "Consulting",
      description: "High-touch transformation for TEAL organizations",
      icon: Sparkles
    },
    { 
      href: "/retreats", 
      label: "Equinoxe Retreats",
      description: "Sacred gatherings in Lapland and Provence",
      icon: Heart
    },
    { 
      href: "/team", 
      label: "Meet the Team",
      description: "The coaches guiding your transformation",
      icon: Users
    },
  ];

  const integrateItems = [
    { 
      href: "/choose-your-path", 
      label: "Choose Your Path",
      description: "Take our diagnostic to find your ideal starting point",
      icon: Sparkles
    },
    { 
      href: "/stories", 
      label: "Stories of Transformation",
      description: "Real journeys from conflict to connection",
      icon: Heart
    },
    { 
      href: "/resources", 
      label: "Resources & Prompts",
      description: "Microhabits and tools structured by the 8 lenses",
      icon: BookOpen
    },
    { 
      href: "/lab", 
      label: "Collaborate",
      description: "LinkedIn community and research partnerships",
      icon: Microscope
    },
  ];

  // Helper to check if menu section is active (supports nested routes, query params, hashes, trailing slashes)
  const isMenuActive = (items: typeof awakenItems) => {
    // Normalize current location (remove trailing slash, hash, query params for comparison)
    const normalizedLocation = location.split('?')[0].split('#')[0].replace(/\/$/, '');
    
    return items.some(item => {
      const normalizedHref = item.href.replace(/\/$/, '');
      // Exact match
      if (normalizedLocation === normalizedHref) return true;
      // Prefix match for nested routes (e.g., /coaching/bundle matches /coaching)
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
                  className={`backdrop-blur-sm ${isMenuActive(awakenItems) ? 'bg-white/10' : ''}`}
                  data-testid="nav-awaken"
                >
                  Why It Matters
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {awakenItems.map((item) => (
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
                  className={`backdrop-blur-sm ${isMenuActive(practiceItems) ? 'bg-white/10' : ''}`}
                  data-testid="nav-practice"
                >
                  How We Guide You
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {practiceItems.map((item) => (
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
                  className={`backdrop-blur-sm ${isMenuActive(integrateItems) ? 'bg-white/10' : ''}`}
                  data-testid="nav-integrate"
                >
                  Start Your Ritual
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {integrateItems.map((item) => (
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
            <Link href="/contact">
              <Button 
                variant="ghost" 
                size="sm"
                data-testid="button-talk-to-facilitator"
                className="gap-2"
              >
                <PhoneCall className="h-4 w-4" />
                Talk to a Facilitator
              </Button>
            </Link>
            <Link href="/choose-your-path">
              <Button 
                size="sm"
                className="bg-needs hover:bg-needs/90 text-white"
                data-testid="button-find-your-path"
              >
                Find Your Path
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
        <div className="lg:hidden backdrop-blur-lg bg-card/95 border-t border-white/10">
          <nav className="px-4 py-4 space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                Why It Matters
              </h3>
              <div className="space-y-1">
                {awakenItems.map((item) => (
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
                How We Guide You
              </h3>
              <div className="space-y-1">
                {practiceItems.map((item) => (
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
                Start Your Ritual
              </h3>
              <div className="space-y-1">
                {integrateItems.map((item) => (
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
              <Link href="/contact">
                <Button 
                  variant="outline" 
                  className="w-full justify-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="button-mobile-talk-to-facilitator"
                >
                  <PhoneCall className="h-4 w-4" />
                  Talk to a Facilitator
                </Button>
              </Link>
              <Link href="/choose-your-path">
                <Button 
                  className="w-full bg-needs hover:bg-needs/90 text-white"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="button-mobile-find-your-path"
                >
                  Find Your Path
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
