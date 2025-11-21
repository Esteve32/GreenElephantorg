import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

const clientCategories = [
  {
    title: "Tech & Startups",
    clients: [
      { name: "xEdu", url: "https://xedu.fi" },
      { name: "Fuzu", url: "https://fuzu.com" },
      { name: "358", url: "https://358.fi" },
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
      { name: "Credit Suisse", url: "https://credit-suisse.com" },
      { name: "S-Pankki", url: "https://s-pankki.fi" },
    ],
  },
  {
    title: "Industrial & Manufacturing",
    clients: [
      { name: "Metsä", url: "https://metsagroup.com" },
      { name: "Kone", url: "https://kone.com" },
      { name: "Valio", url: "https://valio.com" },
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
      { name: "SNCF", url: "https://sncf.com" },
      { name: "Total", url: "https://totalenergies.com" },
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
    title: "Hospitality & Telecom",
    clients: [
      { name: "Scandic Hotels", url: "https://scandichotels.com" },
      { name: "Orange", url: "https://orange.com" },
    ],
  },
  {
    title: "Innovation Hubs",
    clients: [
      { name: "Maria 01", url: "https://maria.io" },
    ],
  },
];

export default function ReferencesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-needs text-white">Trusted By</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Selected Clients & References
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Organizations worldwide trust GreenElephant for conscious communication transformation
          </p>
        </div>

        <div className="space-y-12">
          {clientCategories.map((category) => (
            <div key={category.title}>
              <h2 className="text-2xl font-bold mb-6 text-center md:text-left">
                {category.title}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {category.clients.map((client) => (
                  <a
                    key={client.name}
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group backdrop-blur-sm bg-card/50 border border-white/10 rounded-lg p-6 flex flex-col items-center justify-center gap-3 hover-elevate active-elevate-2 transition-all duration-200"
                    data-testid={`link-client-${client.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <span className="text-center font-semibold text-sm md:text-base">
                      {client.name}
                    </span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 backdrop-blur-sm bg-needs/10 border border-needs/20 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl font-bold mb-4">Transform Your Organization</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
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
              className="inline-flex items-center gap-2 px-6 py-3 backdrop-blur-sm bg-card/50 border border-white/20 rounded-lg hover-elevate active-elevate-2 font-semibold"
              data-testid="button-contact-cta"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
