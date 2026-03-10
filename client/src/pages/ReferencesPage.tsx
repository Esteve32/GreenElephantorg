import { Badge } from "@/components/ui/badge";
import { ExternalLink, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, fadeIn } from "@/lib/motion";
import { atmosphericPalette, imageMaskStyles } from "@/constants/atmosphericGradient";
import helsinkiUrl from "@assets/stock_images/helsinki_finland_aer_3c2036cc.jpg";

const heroGradient = {
  background: `linear-gradient(180deg, 
    #000000 0%, 
    ${atmosphericPalette.space} 30%, 
    ${atmosphericPalette.highAtmosphere} 100%
  )`
};

const clientSectionGradient = {
  background: `linear-gradient(180deg, 
    ${atmosphericPalette.highAtmosphere} 0%, 
    ${atmosphericPalette.upperAtmosphere} 50%, 
    ${atmosphericPalette.midAtmosphere} 100%
  )`
};

const clientCategories = [
  {
    title: "Tech & Startups",
    clients: [
      { name: "xEdu", url: "https://www.xedu.co" },
      { name: "Fuzu", url: "https://fuzu.com" },
      { name: "Naava", url: "https://naava.io" },
      { name: "Psyon Games", url: "https://psyon.co" },
      { name: "Ubisoft", url: "https://ubisoft.com" },
      { name: "Supercell", url: "https://supercell.com" },
      { name: "Musopia", url: "https://musopia.net" },
      { name: "Hyperion Robotics", url: "https://hyperionrobotics.com" },
    ],
  },
  {
    title: "Financial Services",
    clients: [
      { name: "Allianz", url: "https://allianz.com" },
      { name: "iptiQ", url: "https://iptiq.com" },
      { name: "SwissRE", url: "https://swissre.com" },
      { name: "UBS", url: "https://www.ubs.com/ch/en.html" },
    ],
  },
  {
    title: "Industrial & Manufacturing",
    clients: [
      { name: "Metsä", url: "https://metsagroup.com" },
      { name: "Vinci Construction", url: "https://vinci-construction.com" },
    ],
  },
  {
    title: "Government & Public Sector",
    clients: [
      { name: "CERN Geneva", url: "https://home.cern" },
    ],
  },
  {
    title: "Transportation & Logistics",
    clients: [
      { name: "Finnair", url: "https://finnair.com" },
    ],
  },
  {
    title: "Education & Research",
    clients: [
      { name: "Aalto University", url: "https://aalto.fi" },
      { name: "Aalto Design Factory", url: "https://designfactory.aalto.fi" },
      { name: "Aalto Global Impact", url: "https://agi.aalto.fi" },
      { name: "University of Helsinki", url: "https://helsinki.fi" },
      { name: "Vaasa University", url: "https://uwasa.fi" },
      { name: "Hanken School of Economics", url: "https://hanken.fi" },
    ],
  },
  {
    title: "Consulting & Design",
    clients: [
      { name: "Trainers' House", url: "https://trainershouse.fi" },
      { name: "arbora.partners", url: "https://arbora.partners" },
      { name: "Futurice", url: "https://futurice.com" },
      { name: "Vincit", url: "https://vincit.com" },
    ],
  },
  {
    title: "Innovation Hubs",
    clients: [
      { name: "Maria 01", url: "https://maria.io" },
    ],
  },
];

const testimonials = [
  {
    quote: "Managing calendars for three executives means navigating conflicting priorities daily. The Satellite Scan helped me see my communication patterns and now I handle those tough 'no' conversations with confidence.",
    name: "Sophie M.",
    role: "Executive Assistant to C-Suite",
    country: "Germany",
  },
  {
    quote: "I always thought I was just 'bad at confrontation.' The Scan showed me I actually have strong Alignment skills — I just needed the language to own them. My annual review went completely differently this year.",
    name: "Katariina L.",
    role: "Executive Assistant, Tech Company",
    country: "Finland",
  },
  {
    quote: "Working remotely for three clients across time zones, I was drowning in miscommunication. The 8 lenses gave me a framework to name what was going wrong — and fix it without burning bridges.",
    name: "Priya S.",
    role: "Virtual Assistant",
    country: "India",
  },
  {
    quote: "We've been transitioning to a self-managing structure for two years. The framework finally gave our team a common language for the difficult conversations that transformation requires.",
    name: "Elena R.",
    role: "People Lead, TEAL Organization",
    country: "Netherlands",
  },
  {
    quote: "I recommended the Scan to my whole team. It's not a test — it's a mirror. And sometimes you need a good mirror before you can see your superpowers clearly.",
    name: "Mikko H.",
    role: "Operations Manager",
    country: "Finland",
  },
  {
    quote: "Before Equinoxe, I'd tense up whenever my CEO was frustrated. I'd either shut down or become defensive. The microhabit framework taught me to pause, acknowledge my needs, and respond from clarity instead of fear. Our relationship has completely transformed.",
    name: "Sarah K.",
    role: "Executive Assistant, Tech Startup",
    country: "",
  },
  {
    quote: "I thought I was building a TEAL company, but I was still micromanaging every decision. The Provence retreat helped me see how my communication patterns were blocking self-organization. Now I ask questions instead of giving answers.",
    name: "Marcus T.",
    role: "TEAL Organization Founder",
    country: "",
  },
  {
    quote: "I used to agree with everyone to keep the peace, then resent them later. The Lapland retreat taught me that honoring my truth is an act of love, not selfishness. My design critiques are now honest AND compassionate.",
    name: "Elisa R.",
    role: "Design Innovation Student",
    country: "",
  },
  {
    quote: "We'd built a successful consulting firm but our marriage was fracturing. Every disagreement became a power struggle. Equinoxe showed us how to hold conflict as sacred — a chance to deepen understanding, not win arguments.",
    name: "David & Ana L.",
    role: "Partners in Business & Life",
    country: "",
  },
];

export default function ReferencesPage() {
  return (
    <div className="min-h-screen relative">
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 80s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <section className="relative pt-24 pb-16" style={heroGradient}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white">Trusted By</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg" style={{ fontFamily: 'Archivo, sans-serif' }}>
              Selected Clients & References
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Organizations worldwide trust GreenElephant for conscious communication transformation
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative pb-16" style={clientSectionGradient}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="space-y-12"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            {clientCategories.map((category) => (
              <div key={category.title}>
                <h2 className="text-2xl font-bold mb-6 text-center md:text-left text-white">
                  {category.title}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {category.clients.map((client) => (
                    <a
                      key={client.name}
                      href={client.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6 flex flex-col items-center justify-center gap-3 hover-elevate active-elevate-2 transition-all duration-200"
                      data-testid={`link-client-${client.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <span className="text-center font-semibold text-sm md:text-base text-white">
                        {client.name}
                      </span>
                      <ExternalLink className="h-4 w-4 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Testimonial carousel */}
          <div className="mt-20 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                References &amp; Testimonials
              </h2>
              <p className="text-white/60 text-sm">
                What practitioners say after working with us
              </p>
            </motion.div>

            <div className="overflow-hidden" data-testid="section-testimonial-carousel">
              <div className="marquee-track">
                {[...testimonials, ...testimonials].map((t, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-80 mx-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6"
                  >
                    <Quote className="w-5 h-5 text-teal-400/60 mb-3" />
                    <p className="text-white/80 text-sm leading-relaxed mb-5">
                      "{t.quote}"
                    </p>
                    <div>
                      <p className="text-white font-semibold text-sm">{t.name}</p>
                      <p className="text-white/50 text-xs mt-0.5">
                        {t.role}{t.country ? ` · ${t.country}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 backdrop-blur-sm bg-needs/10 border border-needs/20 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">Transform Your Organization</h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Join these leading organizations in their conscious communication journey. From startups to Fortune 500 companies, we've helped teams worldwide transform conflict into trust.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/consulting"
                className="inline-flex items-center gap-2 px-6 py-3 bg-needs text-white rounded-lg hover-elevate active-elevate-2 font-semibold"
                data-testid="button-consulting-cta"
              >
                Explore Consulting
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 backdrop-blur-sm bg-white/5 border border-white/20 rounded-lg hover-elevate active-elevate-2 font-semibold text-white"
                data-testid="button-contact-cta"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative h-64 overflow-hidden" aria-label="Helsinki cityscape">
        <img 
          src={helsinkiUrl}
          alt="Aerial view of Helsinki, Finland"
          className="absolute inset-0 w-full h-full object-cover"
          style={imageMaskStyles.topFade}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-white/80 text-sm">Kauniainen, Greater Helsinki</p>
        </div>
      </section>
    </div>
  );
}
