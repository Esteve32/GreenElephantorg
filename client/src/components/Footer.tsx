import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Youtube, Heart } from "lucide-react";
import { motion } from "framer-motion";

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

export default function Footer() {
  const footerLinks = {
    scan: [
      { label: "Satellite Scan", href: "/scan" },
      { label: "For Executive Assistants", href: "/for-executive-assistants" },
      { label: "For CEOs", href: "/for-ceos" },
      { label: "For Virtual Assistants", href: "/for-virtual-assistants" },
      { label: "For Coaching", href: "/executive-coaching-assessment" },
    ],
    resources: [
      { label: "Periodic Table", href: "/periodic-table" },
      { label: "Resources & Prompts", href: "/resources" },
      { label: "Play Labs", href: "/resources#calendar" },
    ],
    programs: [
      { label: "EA Coaching", href: "/programs#ea-coaching" },
      { label: "Interview Coaching", href: "/programs#interview-coaching" },
      { label: "Your Path", href: "/programs#your-path" },
    ],
    connect: [
      { label: "References", href: "/connect#references" },
      { label: "Team", href: "/connect#team" },
      { label: "Contact", href: "/connect#contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "AI Policy", href: "/ai-policy" },
    ],
  };

  return (
    <footer className="bg-black" data-testid="footer">
      {/* Footer content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section - Centered branding */}
        <motion.div 
          className="flex flex-col items-center text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-needs mb-6 max-w-xl">
            Conscious Communication for a Connected World
          </h2>
          
          <p className="text-white/70 mb-8 max-w-lg leading-relaxed">
            Transforming conflict into trust through conscious communication. 
            Every conversation is an opportunity for deeper connection and understanding.
          </p>
          
          <div className="flex items-center gap-3">
            <Button 
              size="icon" 
              variant="ghost"
              className="backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-needs/30 text-needs hover:text-needs transition-all duration-300"
              data-testid="button-linkedin"
              asChild
            >
              <a href="https://www.linkedin.com/company/greenelephant-org/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button 
              size="icon" 
              variant="ghost"
              className="backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-needs/30 text-needs hover:text-needs transition-all duration-300"
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
              className="backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-needs/30 text-needs hover:text-needs transition-all duration-300"
              data-testid="button-email"
              asChild
            >
              <a href="mailto:esteve@greenelephant.org">
                <Mail className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Sitemap - 5 columns */}
        <div className="pt-8 border-t border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-semibold mb-4 text-white">Scan</h3>
              <ul className="space-y-2">
                {footerLinks.scan.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={(e) => handleAnchorClick(e, link.href)}>
                      <span className="text-white/70 hover:text-white text-sm transition-colors duration-300 cursor-pointer">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={(e) => handleAnchorClick(e, link.href)}>
                      <span className="text-white/70 hover:text-white text-sm transition-colors duration-300 cursor-pointer">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Programs</h3>
              <ul className="space-y-2">
                {footerLinks.programs.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={(e) => handleAnchorClick(e, link.href)}>
                      <span className="text-white/70 hover:text-white text-sm transition-colors duration-300 cursor-pointer">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Connect</h3>
              <ul className="space-y-2">
                {footerLinks.connect.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={(e) => handleAnchorClick(e, link.href)}>
                      <span className="text-white/70 hover:text-white text-sm transition-colors duration-300 cursor-pointer">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <span className="text-white/70 hover:text-white text-sm transition-colors duration-300 cursor-pointer">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Bottom tagline */}
          <div className="mt-12 pt-6 border-t border-white/5 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-white/65 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-needs fill-needs" />
              <span>for transformation</span>
            </div>
            <p className="text-white/65 text-sm">
              2025 GreenElephant.org
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
