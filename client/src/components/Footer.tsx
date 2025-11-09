import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Heart } from "lucide-react";
import logoUrl from "@assets/generated_images/GreenElephant_logo_icon_white_d5712486.png";

export default function Footer() {
  const footerLinks = {
    explore: [
      { label: "Periodic Table", href: "/periodic-table" },
      { label: "Prompt Library", href: "/prompts" },
      { label: "Retreats", href: "/retreats" },
      { label: "Coaching", href: "/coaching" },
    ],
    learn: [
      { label: "Arbora Research Lab", href: "/arbora" },
      { label: "Resources", href: "/resources" },
      { label: "About Us", href: "/about" },
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
              Every conversation is a holy encounter.
            </p>
            <div className="flex items-center gap-3">
              <Button 
                size="icon" 
                variant="ghost"
                data-testid="button-linkedin"
                onClick={() => console.log('Open LinkedIn')}
              >
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost"
                data-testid="button-email"
                onClick={() => console.log('Open email')}
              >
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground">
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
                    <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground">
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
                    <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2024 GreenElephant.org. Crafted with conscious intention.</p>
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
