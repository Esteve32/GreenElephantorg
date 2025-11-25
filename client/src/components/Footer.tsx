import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Heart, Youtube } from "lucide-react";
import logoUrl from "@assets/GE logo 512x512 transparent BG 2023 _1762732324529.png";

export default function Footer() {
  const footerLinks = {
    explore: [
      { label: "Periodic Table", href: "/periodic-table" },
      { label: "Satellite Scan", href: "/satellitescan" },
      { label: "Interview Coaching", href: "/interview-coaching" },
      { label: "Coaching", href: "/coaching" },
      { label: "Retreats", href: "/retreats" },
    ],
    learn: [
      { label: "Lab", href: "/lab" },
      { label: "Resources", href: "/resources" },
      { label: "Consulting", href: "/consulting" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  };

  return (
    <footer className="border-t border-white/10 bg-background/80 backdrop-blur-sm mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logoUrl} alt="GreenElephant" className="h-10 w-10" />
              <span className="text-xl font-bold">GreenElephant</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              Transforming conflicts into trust through conscious communication. 
              Every conversation is an opportunity for deeper connection and understanding.
            </p>
            <div className="flex items-center gap-3">
              <Button 
                size="icon" 
                variant="ghost"
                data-testid="button-linkedin"
                asChild
              >
                <a href="https://www.linkedin.com/company/greenelephant-org/?viewAsMember=true" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                size="icon" 
                variant="ghost"
                data-testid="button-youtube"
                asChild
              >
                <a href="https://www.youtube.com/playlist?list=PLYvfWnYASrYd73lpzWsFnTSLa2K2lTN9d" target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                size="icon" 
                variant="ghost"
                data-testid="button-email"
                asChild
              >
                <a href="mailto:anu@greenelephant.org">
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <Button variant="ghost" className="h-auto p-0 text-muted-foreground hover:text-foreground hover:bg-transparent">
                      {link.label}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Learn</h3>
            <ul className="space-y-3">
              {footerLinks.learn.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <Button variant="ghost" className="h-auto p-0 text-muted-foreground hover:text-foreground hover:bg-transparent">
                      {link.label}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <Button variant="ghost" className="h-auto p-0 text-muted-foreground hover:text-foreground hover:bg-transparent">
                      {link.label}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2025 GreenElephant.org. Crafted with conscious intention.</p>
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-needs fill-needs" />
            <span>for transformation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
