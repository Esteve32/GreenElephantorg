import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Youtube, Heart, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const footerColumns = [
  {
    title: "Discover",
    tooltip: "Free tools to try — no sign-up, no commitment",
    links: [
      { label: "Flow Check", href: "/flow-check" },
      { label: "Periodic Table", href: "/periodic-table" },
      { label: "Speech Lab", href: "/decode" },
      { label: "Prompt Library", href: "/resources#prompts" },
    ],
  },
  {
    title: "Scan",
    tooltip: "Your personal communication assessment — the core product",
    links: [
      { label: "Satellite Scan", href: "/scan" },
      { label: "For Executive Assistants", href: "/for-executive-assistants" },
      { label: "For CEOs", href: "/for-ceos" },
      { label: "For Coaching", href: "/executive-coaching-assessment" },
    ],
  },
  {
    title: "Programs",
    tooltip: "Coaching, webinars, and your personal portal",
    links: [
      { label: "EA Coaching", href: "/programs#ea-coaching" },
      { label: "Interview Coaching", href: "/programs#interview-coaching" },
      { label: "Monthly Webinars", href: "/webinars" },
      { label: "Resources", href: "/resources" },
      { label: "Portal Login", href: "/portal/login" },
    ],
  },
  {
    title: "Connect",
    tooltip: "See who we've helped and get in touch",
    links: [
      { label: "References", href: "/connect#references" },
      { label: "Team", href: "/connect#team" },
      { label: "Contact", href: "/connect#contact" },
    ],
  },
  {
    title: "Legal",
    tooltip: "Privacy, terms, and compliance — we take data protection seriously",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "AI Policy", href: "/ai-policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-black" data-testid="footer">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
              className="backdrop-blur-sm bg-white/5 border border-needs/30 text-needs transition-all duration-300"
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
              className="backdrop-blur-sm bg-white/5 border border-needs/30 text-needs transition-all duration-300"
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
              className="backdrop-blur-sm bg-white/5 border border-needs/30 text-needs transition-all duration-300"
              data-testid="button-email"
              asChild
            >
              <a href="mailto:esteve@greenelephant.org">
                <Mail className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </motion.div>

        <div className="pt-8 border-t border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-center md:text-left">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h3 className="font-semibold mb-4 text-white cursor-default inline-block border-b border-dashed border-white/20" data-testid={`footer-heading-${col.title.toLowerCase()}`}>
                      {col.title}
                    </h3>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[220px] text-center">
                    <p className="text-xs">{col.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} onClick={(e) => handleAnchorClick(e, link.href)}>
                        <span className="text-white/70 hover:text-white text-sm transition-colors duration-300 cursor-pointer">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                  {col.title === "Legal" && (
                    <li>
                      <Link href="/admin/login">
                        <span className="text-white/40 hover:text-white/60 text-sm transition-colors duration-300 cursor-pointer" data-testid="link-admin-login">
                          Admin
                        </span>
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-12 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
            <a
              href="https://commission.europa.eu/law/law-topic/data-protection_en"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors duration-300 group"
              data-testid="link-gdpr-compliance"
            >
              <img
                src="https://commission.europa.eu/themes/contrib/oe_theme/dist/ec/images/logo/negative/logo-ec--en.svg"
                alt="European Commission"
                className="h-4 opacity-40 group-hover:opacity-60 transition-opacity duration-300"
              />
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="text-xs">GDPR compliant by design</span>
            </a>
            <div className="flex items-center gap-2 text-white/65 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-needs fill-needs" />
              <span>for human transformation</span>
            </div>
            <p className="text-white/65 text-sm">
              2026 GreenElephant.org
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
