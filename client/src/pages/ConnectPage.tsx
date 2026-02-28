import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Linkedin, Mail, Sparkles, Calendar, MessageCircle, Users, Heart, PhoneCall, ArrowDown } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { fadeInUp, fadeIn, staggerContainer } from "@/lib/motion";
import { atmosphericPalette } from "@/constants/atmosphericGradient";
import archipelagoUrl from "@assets/finnish_archipelago_landscape_aerial_view_1764797904449.png";
import earthOrbitUrl from "@assets/generated_images/earth_orbit_aurora_view.png";
import jonasPhoto from "@assets/Jonas purple upscaled with Jal-ai topaz._1764338940533.jpeg";
import estevePhoto from "@assets/Esteve profile fal-ai-topaz upscaled_1764338940532.jpeg";
import anuPhoto from "@assets/Anu upscaled with pruple fal-ai topaz_1764339012644.jpeg";
import logoUrl from "@assets/GE logo 512x512 transparent BG 2023 _1764350733090.png";

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
    title: "Education & Research",
    clients: [
      { name: "Aalto University", url: "https://aalto.fi" },
      { name: "Aalto Design Factory", url: "https://designfactory.aalto.fi" },
      { name: "Aalto Global Impact", url: "https://agi.aalto.fi" },
      { name: "University of Helsinki", url: "https://helsinki.fi" },
      { name: "Vaasa University", url: "https://uwasa.fi" },
      { name: "Hanken School of Economics", url: "https://hanken.fi" },
      { name: "Arcada", url: "https://www.arcada.fi/en" },
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

const coaches = [
  {
    name: "Anu Timmerbacka",
    title: "Executive Assistant Coach | EA Empowerment Specialist",
    location: "Helsinki, Finland",
    photo: anuPhoto,
    linkedin: "https://www.linkedin.com/in/anutimmerbacka",
    email: "anu@greenelephant.org",
    bio: "Anu turns quiet competence into visible leadership. Specializing in Executive Assistants and Admin Professionals, she helps exceptional support staff gain the confidence and presence to influence strategic decisions and lead with calm clarity.",
    superpower: "Invisible Leadership Architect",
    superpowerDescription: "She transforms overlooked competence into visible executive presence—making the brilliant work of support professionals finally seen, heard, and valued.",
    specialties: [
      "Executive Assistant Leadership",
      "Communication Confidence Building",
      "Strategic Presence Development",
      "Difficult Conversation Navigation",
      "Workplace Influence & Recognition"
    ],
    experience: "15+ years",
    languages: ["Finnish", "English"],
  },
  {
    name: "Jonas Pannetier",
    title: "Clinical Psychologist, Trainer & Communication Coach",
    location: "Marseille, France",
    photo: jonasPhoto,
    linkedin: "https://www.linkedin.com/in/jonas-pannetier-6a7728134",
    email: "jonaspannetier@hotmail.co.uk",
    bio: "Jonas brings therapeutic depth to conscious communication. As Head of Research at GreenElephant, he bridges clinical psychology with corporate training, helping individuals reduce anxiety and teams navigate conflict with evidence-based approaches.",
    superpower: "Scientific Translator",
    superpowerDescription: "He bridges academic research with lived human experience—giving scientific validity to the conscious communication methodology while keeping it deeply practical and soulful.",
    specialties: [
      "Clinical Psychology & Psychotherapy",
      "Expat & Cross-Cultural Support",
      "Nature-Based Healing Practices",
      "Rap & Slam Poetry Therapy",
      "Conflict Resolution in Teams"
    ],
    experience: "8+ years",
    languages: ["French", "English"],
  },
  {
    name: "Estève Pannetier",
    title: "Coach | TEDx Speaker | UX Ethnographer",
    location: "Helsinki, Finland",
    photo: estevePhoto,
    linkedin: "https://www.linkedin.com/in/estève-pannetier-3a883217",
    email: "esteve@greenelephant.org",
    bio: "With 15+ years across innovation ecosystems, Estève supports product managers, faculty, and founders in growing their voice and building cultures where collective intelligence flows naturally. His approach blends structure with softness—rooted in research, always human.",
    superpower: "Collective Intelligence Designer",
    superpowerDescription: "He creates the conditions where collaboration flows naturally—blending participatory leadership, design thinking, and UX ethnography to help teams discover emergent possibilities together.",
    specialties: [
      "Collective Intelligence Cultivation",
      "AI-Powered Communication Tools",
      "Design Thinking & UX Ethnography",
      "Faculty & Founder Coaching",
      "Innovation Ecosystem Building"
    ],
    experience: "15+ years",
    languages: ["English", "French"],
  }
];

const intents = [
  { id: "coaching", label: "EA Coaching", icon: MessageCircle, color: "bg-alignment" },
  { id: "interview", label: "Interview Coaching", icon: Calendar, color: "bg-needs" },
  { id: "consulting", label: "Consulting", icon: Mail, color: "bg-attitude" },
];

const contentGradient = {
  background: `linear-gradient(180deg, 
    #0a1628 0%,
    #0c1a2e 5%,
    #0e1e34 10%,
    #10223a 15%,
    #122640 20%,
    #142a46 25%,
    #162e4c 30%,
    #183252 35%,
    #1a3658 40%,
    #1c3a5e 45%,
    #1e3e64 50%,
    #20426a 55%,
    #224670 60%,
    #244a76 65%,
    #264e7c 70%,
    #285282 75%,
    #2a5688 80%,
    #2c5a8e 85%,
    #2e5e94 90%,
    #306296 95%,
    #273d5f 100%
  )`
};

export default function ConnectPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const earthY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [location] = useLocation();
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Connect - Team, References & Contact | GreenElephant";
    
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  const mutation = useMutation({
    mutationFn: async (data: { name: string; email: string; message: string; intent: string }) => {
      const result = await apiRequest("POST", "/api/contacts", data);
      if (!result.ok) {
        const errorData = await result.json();
        throw new Error(errorData.message || "Failed to submit contact form");
      }
      return await result.json();
    },
    onSuccess: () => {
      toast({
        title: "We're grateful for your message",
        description: "We'll respond with care and attention within 24 hours.",
        duration: 6000,
      });
      setName("");
      setEmail("");
      setMessage("");
      setSelectedIntent(null);
    },
    onError: (error: any) => {
      toast({
        title: "Unable to send message",
        description: error.message ? `${error.message}. Please try again or email esteve@greenelephant.org directly.` : "Network error. Please try again in a moment or contact us directly at esteve@greenelephant.org",
        variant: "destructive",
        duration: 10000,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || name.length < 2) {
      toast({
        title: "Name required",
        description: "Please enter your name (at least 2 characters)",
        variant: "destructive",
      });
      return;
    }
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Valid email required",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    if (!message || message.length < 10) {
      toast({
        title: "Message too short",
        description: "Please share a bit more detail (at least 10 characters)",
        variant: "destructive",
      });
      return;
    }
    
    mutation.mutate({
      name,
      email,
      message,
      intent: selectedIntent || "general",
    });
  };

  return (
    <div className="min-h-screen" data-testid="page-connect">
      <SEO
        title="Contact & Connect | GreenElephant"
        description="Connect with the GreenElephant team for coaching, consulting, or collaboration. Meet our coaches, explore client references, and send us a message. We respond within 24 hours with genuine human presence."
        canonicalPath="/connect"
        keywords="contact GreenElephant, communication coaching contact, consulting inquiry, connect with coaches, client references"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Connect", url: "/connect" }
        ]}
      />
      {/* Hero Section - matching ScanPage */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="section-hero">
        <motion.div 
          className="absolute inset-0 bg-cover bg-top"
          style={{ 
            backgroundImage: `url(${earthOrbitUrl})`,
            y: earthY
          }}
        >
          {/* Aurora color overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, 
                rgba(34, 197, 94, 0.15) 0%,
                rgba(139, 92, 246, 0.20) 25%,
                rgba(0, 153, 153, 0.25) 50%,
                transparent 75%
              )`
            }}
          />
        </motion.div>
        
        {/* Bottom fade overlay - bridges hero to content section smoothly */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[40vh] pointer-events-none z-[1]"
          style={{
            background: `linear-gradient(to top,
              #0a1628 0%,
              #0a1628 20%,
              rgba(10, 22, 40, 0.85) 40%,
              rgba(10, 22, 40, 0.5) 60%,
              rgba(10, 22, 40, 0.2) 80%,
              transparent 100%
            )`
          }}
          aria-hidden="true"
        />
        
        <motion.div 
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24"
          style={{ y: textY, opacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-white/10 border-white/20 text-white backdrop-blur-sm" data-testid="badge-consulting">
              <Users className="w-3 h-3 mr-1" />
              Enterprise Solutions
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-lg" data-testid="heading-consulting">
              Connect With Us
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Strategic Communication Consulting
            </p>
            <p className="text-lg text-white font-medium mb-8 max-w-2xl mx-auto leading-relaxed" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
              Co-create your organization's communication-centric strategy. From team alignment workshops to executive coaching programs, we design bespoke solutions for conscious organizations.
            </p>

            <Button 
              className="bg-needs hover:bg-needs/90 text-white"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              data-testid="button-consulting-contact"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Discuss Your Needs
            </Button>
          </motion.div>
          
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-white/60 mt-16"
          >
            <p className="text-sm mb-2">Scroll to explore</p>
            <ArrowDown className="h-6 w-6 mx-auto" />
          </motion.div>
        </motion.div>
      </section>

      {/* Content sections with gradient background matching ScanPage */}
      <div className="relative" style={contentGradient}>
        {/* Team Section - First, on darker background */}
        <section id="team" className="relative pt-16 pb-20 px-6 scroll-mt-24" aria-label="Meet the Team" data-testid="section-team">
          <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">Meet Your Guides</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg" style={{ fontFamily: 'Archivo, sans-serif' }} data-testid="heading-team">
              The Team Behind Your Transformation
            </h2>
            
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Three voices. One mission. Helping you turn every conversation into sacred practice through conscious communication.
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="max-w-7xl mx-auto space-y-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {coaches.map((coach, index) => (
            <motion.div
              key={coach.name}
              variants={fadeInUp}
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                  <div className="relative">
                    <img
                      src={coach.photo}
                      alt={`${coach.name} - ${coach.title}`}
                      className="rounded-xl w-full aspect-square object-cover border border-white/20"
                      loading="lazy"
                      data-testid={`img-coach-${coach.name.toLowerCase().split(' ')[0]}`}
                    />
                    <div className="absolute -bottom-4 -right-4 bg-needs/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-2 rounded-lg border border-needs/50">
                      {coach.superpower}
                    </div>
                  </div>
                  <div className="mt-8 flex gap-3">
                    <a
                      href={coach.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                      data-testid={`link-linkedin-${coach.name.toLowerCase().split(' ')[0]}`}
                    >
                      <Button variant="outline" size="sm" className="w-full border-white/20 text-white hover:bg-white/10">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                    </a>
                    <a
                      href={`mailto:${coach.email}`}
                      className="flex-1"
                      data-testid={`link-email-${coach.name.toLowerCase().split(' ')[0]}`}
                    >
                      <Button variant="outline" size="sm" className="w-full border-white/20 text-white hover:bg-white/10">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                    </a>
                  </div>
                </div>
                
                <div className="lg:w-2/3 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{coach.name}</h3>
                    <p className="text-white/60">{coach.title}</p>
                    <p className="text-white/40 text-sm mt-1">{coach.location}</p>
                  </div>
                  
                  <p className="text-white/80 leading-relaxed">{coach.bio}</p>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-white/60 mb-1">Superpower</p>
                    <p className="text-white/90">{coach.superpowerDescription}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-white/60 mb-3">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {coach.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-white/80 border-white/20">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 text-sm text-white/60">
                    <span><strong className="text-white/80">Experience:</strong> {coach.experience}</span>
                    <span><strong className="text-white/80">Languages:</strong> {Array.isArray(coach.languages) ? coach.languages.join(", ") : coach.languages}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        </section>

        {/* References Section - After Team */}
        <section id="references" className="relative pt-16 pb-8 scroll-mt-24" aria-label="Client References" data-testid="section-references">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Badge className="mb-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white" data-testid="badge-references">Trusted By</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg" style={{ fontFamily: 'Archivo, sans-serif' }} data-testid="heading-references">
                Selected Clients & References
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Organizations worldwide trust GreenElephant for conscious communication transformation
              </p>
            </motion.div>
          </div>
        </section>

        <section className="relative pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="space-y-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              {clientCategories.map((category) => (
                <div key={category.title}>
                  <h3 className="text-xl font-semibold mb-4 text-white/80">{category.title}</h3>
                  <div className="flex flex-wrap gap-3">
                    {category.clients.map((client) => (
                      <a
                        key={client.name}
                        href={client.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                        data-testid={`link-client-${client.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <span className="text-white/80 group-hover:text-white transition-colors">{client.name}</span>
                        <ExternalLink className="h-3 w-3 text-white/40 group-hover:text-white/60 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="relative py-20 scroll-mt-24" aria-label="Get in Touch" data-testid="section-contact">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-white/10 text-white border border-white/20" data-testid="badge-contact">
              Get in Touch
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg" style={{ fontFamily: 'Archivo, sans-serif' }} data-testid="heading-contact">
              Your Message Receives Our Full Presence
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Every inquiry is treated as a holy encounter. When you reach out, you'll receive a personalized response within 24 hours—not automation, but genuine human presence.
            </p>
          </motion.div>

          <motion.div
            className="mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <h3 className="text-2xl font-bold mb-6 text-center text-white drop-shadow-lg">
              What brings you here today?
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {intents.map((intent) => {
                const Icon = intent.icon;
                return (
                  <motion.button
                    key={intent.id}
                    variants={fadeIn}
                    onClick={() => setSelectedIntent(intent.id)}
                    className={`p-6 rounded-lg border transition-all ${
                      selectedIntent === intent.id
                        ? `${intent.color} text-white border-white/20`
                        : 'bg-white/5 backdrop-blur-md border-white/10 hover-elevate'
                    }`}
                    data-testid={`button-intent-${intent.id}`}
                  >
                    <Icon className={`h-8 w-8 mb-3 mx-auto ${selectedIntent === intent.id ? 'text-white' : 'text-needs'}`} />
                    <p className={`font-semibold ${selectedIntent === intent.id ? 'text-white' : 'text-white/90'}`}>
                      {intent.label}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Card className="bg-white/5 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-white drop-shadow-lg" data-testid="heading-form">
                  {selectedIntent === "coaching" && "Express Interest in EA Coaching"}
                  {selectedIntent === "interview" && "Express Interest in Interview Coaching"}
                  {selectedIntent === "consulting" && "Discuss Consulting Needs"}
                  {!selectedIntent && "Send Us a Message"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-contact">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80">Name *</label>
                      <Input
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        minLength={2}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                        data-testid="input-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80">Email *</label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                        data-testid="input-email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Message *</label>
                    <Textarea
                      placeholder="Share what's alive for you..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      required
                      minLength={10}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                      data-testid="input-message"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-needs hover:bg-needs/90 text-white"
                    disabled={mutation.isPending}
                    data-testid="button-submit"
                  >
                    {mutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        </section>
      </div>
      
      {/* Footer Section - matching ScanPage */}
      <section 
        className="relative h-screen"
        aria-label="Finnish Archipelago landscape" 
        data-testid="section-cityscape"
      >
        {/* Base background matching page gradient */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: `linear-gradient(to bottom,
              #273d5f 0%,
              #1e3050 12%,
              #152545 25%,
              #0d1a38 40%,
              #080f20 55%,
              #040810 70%,
              #000000 100%
            )`
          }}
        />
        
        {/* Archipelago image - with top mask to fade into background */}
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: `url(${archipelagoUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 5%, rgba(0,0,0,0.1) 10%, rgba(0,0,0,0.3) 15%, rgba(0,0,0,0.5) 20%, rgba(0,0,0,0.7) 25%, rgba(0,0,0,0.85) 30%, black 40%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 5%, rgba(0,0,0,0.1) 10%, rgba(0,0,0,0.3) 15%, rgba(0,0,0,0.5) 20%, rgba(0,0,0,0.7) 25%, rgba(0,0,0,0.85) 30%, black 40%, black 100%)'
          }}
        />
        
        {/* Bottom gradient overlay to fade tree line to black */}
        <div 
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ 
            height: '35%',
            background: `linear-gradient(to top,
              #000000 0%,
              rgba(0, 0, 0, 0.95) 20%,
              rgba(0, 0, 0, 0.8) 40%,
              rgba(0, 0, 0, 0.5) 60%,
              rgba(0, 0, 0, 0.2) 80%,
              transparent 100%
            )`
          }}
        />
        
        <div className="absolute bottom-8 left-0 right-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-white/80 text-sm">Finnish Archipelago</p>
          </div>
        </div>
      </section>
    </div>
  );
}
