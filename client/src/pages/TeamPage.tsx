import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import jonasPhoto from "@assets/Jonas Pannetier Best Photo_1762898039160.jpeg";
import estevePhoto from "@assets/Esteve Pannetier photo_1762897955119.jpg";
import anuPhoto from "@assets/Anu Timmerbacka Photo_1762897955119.jpeg";

const coaches = [
  {
    name: "Jonas Pannetier",
    title: "Clinical Psychologist, Trainer & Communication Coach",
    location: "Marseille, France",
    photo: jonasPhoto,
    linkedin: "https://www.linkedin.com/in/jonas-pannetier-6a7728134",
    email: "jonaspannetier@hotmail.co.uk",
    bio: "Jonas brings therapeutic depth to conscious communication. As Head of Research at GreenElephant, he bridges clinical psychology with corporate training, helping individuals reduce anxiety and teams navigate conflict with evidence-based approaches.",
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
    title: "COO at Arbora | TEDx Speaker | UX Ethnographer",
    location: "Helsinki, Finland",
    photo: estevePhoto,
    linkedin: "https://www.linkedin.com/in/estève-pannetier-3a883217",
    email: "esteve@greenelephant.org",
    bio: "With 15+ years across innovation ecosystems, Estève supports product managers, faculty, and founders in growing their voice and building cultures where collective intelligence flows naturally. His approach blends structure with softness—rooted in research, always human.",
    specialties: [
      "Collective Intelligence Cultivation",
      "AI-Powered Communication Tools",
      "Design Thinking & UX Ethnography",
      "Faculty & Founder Coaching",
      "Innovation Ecosystem Building"
    ],
    experience: "15+ years",
    languages: ["English", "French", "Finnish", "Polish", "German"],
    approach: "Estève believes true leadership is participatory—that we grow through dialogue and the most powerful questions are the ones we ask each other. As a Guest Lecturer at Aalto Design Factory and former trainer at Futurice across 6 European offices, he's helped thousands discover their authentic communication voice."
  },
  {
    name: "Anu Timmerbacka",
    title: "Executive Assistant Coach | EA Empowerment Specialist",
    location: "Helsinki, Finland",
    photo: anuPhoto,
    linkedin: "https://www.linkedin.com/in/anutimmerbacka",
    email: "anu@greenelephant.org",
    bio: "Anu turns quiet competence into visible leadership. Specializing in Executive Assistants and Admin Professionals, she helps exceptional support staff gain the confidence and presence to influence strategic decisions and lead with calm clarity.",
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
  }
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Meet Your Guides</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-['Archivo']">
              The Team Behind Your Transformation
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three voices. One mission. Helping you turn every conversation into sacred practice through conscious communication.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coaches Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          {coaches.map((coach, index) => (
            <motion.div
              key={coach.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="backdrop-blur-sm bg-card/50 hover-elevate">
                <div className="grid md:grid-cols-[220px,1fr] gap-6">
                  {/* Photo Section */}
                  <div className="flex items-start justify-center p-6 md:p-8">
                    <div className="w-48 h-48 flex-shrink-0">
                      <img
                        src={coach.photo}
                        alt={coach.name}
                        className="w-full h-full object-cover rounded-lg"
                        data-testid={`img-coach-${coach.name.toLowerCase().replace(/\s+/g, '-')}`}
                      />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 md:pr-8 md:py-8 space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold mb-2 font-['Archivo']" data-testid={`text-coach-name-${coach.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        {coach.name}
                      </h2>
                      <p className="text-lg text-muted-foreground mb-1">{coach.title}</p>
                      <p className="text-sm text-muted-foreground">{coach.location}</p>
                    </div>

                    <p className="text-base leading-relaxed">
                      {coach.bio}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                          Specialties
                        </h3>
                        <ul className="space-y-2">
                          {coach.specialties.map((specialty) => (
                            <li key={specialty} className="flex items-start gap-2 text-sm">
                              <span className="text-primary mt-1">•</span>
                              <span>{specialty}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
                            Experience
                          </h3>
                          <p className="text-sm">{coach.experience}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
                            Languages
                          </h3>
                          <p className="text-sm">{coach.languages.join(", ")}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                        Approach
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
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
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-['Archivo']">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're seeking therapeutic support, organizational transformation, or executive presence—our team is here to guide you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild data-testid="button-book-session">
                <a href="https://calendly.com/anu-greenelephant/call-with-anu" target="_blank" rel="noopener noreferrer">
                  Book a Session
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-explore-coaching">
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
