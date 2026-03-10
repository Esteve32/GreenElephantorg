import { Button } from "@/components/ui/button";
import { Linkedin, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { atmosphericPalette } from "@/constants/atmosphericGradient";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { SEO } from "@/components/SEO";
import jonasPhoto from "@assets/Jonas purple upscaled with Jal-ai topaz._1764338940533.jpeg";
import estevePhoto from "@assets/Esteve profile fal-ai-topaz upscaled_1764338940532.jpeg";
import anuPhoto from "@assets/Anu upscaled with pruple fal-ai topaz_1764339012644.jpeg";

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
    howToTalkGreen: "Direct and measurable. Anu values concrete outcomes and visible transformation. Speak in terms of specific results, executive presence, and the courage to lead from where you are.",
    specialties: [
      "Executive Assistant Leadership",
      "Communication Confidence Building",
      "Strategic Presence Development",
      "Difficult Conversation Navigation",
      "Workplace Influence & Recognition"
    ],
    experience: "15+ years",
    languages: ["Finnish", "English", "Swedish"],
    approach: "Anu's work delivers measurable results: a guaranteed 50% boost in communication confidence and executive presence. Born and raised in Finland with a deep love for nature and Afrobeat, she brings structure, clarity, warmth, and deep respect for the often-invisible emotional labor that support professionals carry."
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
    howToTalkGreen: "Thoughtful and evidence-based. Jonas appreciates depth, research, and holistic connection. Speak with intellectual curiosity, respect for the therapeutic process, and an openness to nature's wisdom.",
    specialties: [
      "Clinical Psychology & Psychotherapy",
      "Expat & Cross-Cultural Support",
      "Nature-Based Healing Practices",
      "Rap & Slam Poetry Therapy",
      "Conflict Resolution in Teams"
    ],
    experience: "8+ years",
    languages: ["French", "English", "Italian", "Dutch"],
    approach: "Jonas specializes in helping people tackle depression, improve relationships, and achieve greater life balance. His unique therapeutic approach integrates nature, writing, and music—particularly Rap and Slam poetry—to create pathways for healing and self-expression."
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
    howToTalkGreen: "Participatory and systems-aware. Estève values co-creation and emergent possibilities. Speak in terms of collective intelligence, design thinking, and the balance between structure and flow.",
    specialties: [
      "Collective Intelligence Cultivation",
      "AI-Powered Communication Tools",
      "Design Thinking & UX Ethnography",
      "Faculty & Founder Coaching",
      "Innovation Ecosystem Building"
    ],
    experience: "15+ years",
    languages: "English and French with basic Finnish, Polish and German",
    approach: "Estève believes true leadership is participatory—that we grow through dialogue and the most powerful questions are the ones we ask each other. As a Guest Lecturer at Aalto Design Factory and former trainer at Futurice across 6 European offices, he's helped thousands discover their authentic communication voice."
  }
];

const heroGradient = `linear-gradient(180deg, 
  #000000 0%, 
  ${atmosphericPalette.space} 40%, 
  ${atmosphericPalette.highAtmosphere} 100%
)`;

const coachesSectionGradient = `linear-gradient(180deg, 
  ${atmosphericPalette.highAtmosphere} 0%, 
  ${atmosphericPalette.upperAtmosphere} 50%, 
  ${atmosphericPalette.midAtmosphere} 100%
)`;

const ctaSectionGradient = `linear-gradient(180deg, 
  ${atmosphericPalette.midAtmosphere} 0%, 
  ${atmosphericPalette.upperAtmosphere} 50%, 
  ${atmosphericPalette.highAtmosphere} 100%
)`;

export default function TeamPage() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Our Team | GreenElephant"
        description="Meet the GreenElephant team: Anu Timmerbacka (EA Coach), Jonas Pannetier (Clinical Psychologist), and Estève Pannetier (Coach & UX Ethnographer). Three voices, one mission — conscious communication."
        canonicalPath="/team"
        keywords="GreenElephant team, communication coaches, Anu Timmerbacka, Jonas Pannetier, Estève Pannetier, executive assistant coach, clinical psychologist"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Team", url: "/team" }
        ]}
      />
      <section 
        className="relative py-20 px-6"
        style={{ background: heroGradient }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">Meet Your Guides</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-['Archivo'] text-white drop-shadow-lg">
              The Team Behind Your Transformation
            </h1>
            
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Three voices. One mission. Helping you turn every conversation into intentional practice through conscious communication.
            </p>
          </motion.div>
        </div>
      </section>

      <section 
        className="py-16 px-6"
        style={{ background: coachesSectionGradient }}
      >
        <motion.div 
          className="max-w-7xl mx-auto space-y-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {coaches.map((coach) => (
            <motion.div
              key={coach.name}
              variants={fadeInUp}
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden hover-elevate">
                <div className="grid md:grid-cols-[180px,1fr] gap-6">
                  <div className="flex items-start justify-center p-6 md:p-6">
                    <div className="w-36 h-36 flex-shrink-0 relative rounded-lg overflow-hidden ring-1 ring-[#009999]/30">
                      <img
                        src={coach.photo}
                        alt={coach.name}
                        className="w-full h-full object-cover"
                        style={{ filter: "brightness(0.88) contrast(1.08) saturate(0.85)" }}
                        data-testid={`img-coach-${coach.name.toLowerCase().replace(/\s+/g, '-')}`}
                      />
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(135deg, rgba(0,153,153,0.08) 0%, transparent 60%)" }}
                      />
                    </div>
                  </div>

                  <div className="p-6 md:pr-8 md:py-8 space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold mb-2 font-['Archivo'] text-white drop-shadow-lg" data-testid={`text-coach-name-${coach.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        {coach.name}
                      </h2>
                      <p className="text-lg text-white/70 mb-1">{coach.title}</p>
                      <p className="text-sm text-white/60">{coach.location}</p>
                    </div>

                    <p className="text-base leading-relaxed text-white/70">
                      {coach.bio}
                    </p>

                    <div className="bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-semibold mb-1 text-primary">
                            Unique Superpower: {coach.superpower}
                          </h3>
                          <p className="text-sm text-white/70">
                            {coach.superpowerDescription}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-needs/20 backdrop-blur-sm border border-needs/30 rounded-lg p-4">
                      <h3 className="text-sm font-semibold mb-2 text-needs">
                        How to Talk "Green" to {coach.name.split(' ')[0]}
                      </h3>
                      <p className="text-sm text-white/70 leading-relaxed">
                        {coach.howToTalkGreen}
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-semibold mb-3 text-white/60 uppercase tracking-wide">
                          Specialties
                        </h3>
                        <ul className="space-y-2">
                          {coach.specialties.map((specialty) => (
                            <li key={specialty} className="flex items-start gap-2 text-sm text-white/70">
                              <span className="text-primary mt-1">•</span>
                              <span>{specialty}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-semibold mb-2 text-white/60 uppercase tracking-wide">
                            Experience
                          </h3>
                          <p className="text-sm text-white/70">{coach.experience}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold mb-2 text-white/60 uppercase tracking-wide">
                            Languages
                          </h3>
                          <p className="text-sm text-white/70">
                            {Array.isArray(coach.languages) 
                              ? coach.languages.join(", ") 
                              : coach.languages}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                      <h3 className="text-sm font-semibold mb-3 text-white/60 uppercase tracking-wide">
                        Approach
                      </h3>
                      <p className="text-sm leading-relaxed text-white/70">
                        {coach.approach}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4">
                      <Button
                        variant="default"
                        size="sm"
                        asChild
                        data-testid={`button-linkedin-${coach.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <a href={coach.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="mr-2 h-4 w-4" />
                          LinkedIn
                        </a>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                        asChild
                        data-testid={`button-email-${coach.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <a href={`mailto:${coach.email}`}>
                          <Mail className="mr-2 h-4 w-4" />
                          Get in Touch
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section 
        className="py-20 px-6"
        style={{ background: ctaSectionGradient }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-['Archivo'] text-white drop-shadow-lg">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Whether you're seeking therapeutic support, organizational transformation, or executive presence—our team is here to guide you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild data-testid="button-talk-to-facilitator">
                <a href="/contact">
                  Talk to a Facilitator
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10"
                asChild 
                data-testid="button-explore-coaching"
              >
                <a href="/coaching">
                  Explore Coaching
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
