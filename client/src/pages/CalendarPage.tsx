import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, Video, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { fadeInUp, fadeIn, staggerContainer } from "@/lib/motion";
import { atmosphericPalette } from "@/constants/atmosphericGradient";
import { LENSES } from "@/constants/lenses";
import celestialCalendarUrl from "@assets/Celestial_calendar🔥2022_extrenal_no_planets_with_legend_no_ik_1764793584893.png";

const lensCalendar = [
  { month: "January", lens: "Influence", color: "influence", description: "Begin the year by examining how you take up space in conversations and balance power dynamics." },
  { month: "February", lens: "Dynamics", color: "dynamics", description: "Explore the dance of leading and following, and how to shift fluidly between roles." },
  { month: "March", lens: "Ego", color: "ego", description: "March towards self-awareness by understanding your ego's role in communication patterns." },
  { month: "April", lens: "Needs", color: "needs", description: "Spring into deeper connection by identifying and expressing universal human needs." },
  { month: "May", lens: "Needs", color: "needs", description: "Continue the journey of needs literacy and compassionate self-expression." },
  { month: "June", lens: "Alignment", color: "alignment", description: "Summer solstice brings focus on creating shared understanding and mutual agreements." },
  { month: "July", lens: "Alignment", color: "alignment", description: "Deepen practices for confirming expectations and closing communication loops." },
  { month: "August", lens: "Flow", color: "flow", description: "Explore the psychology of optimal engagement and balanced challenge." },
  { month: "September", lens: "Chaordic", color: "chaordic", description: "Autumn equinox embraces the dance between structure and emergence." },
  { month: "October", lens: "Chaordic", color: "chaordic", description: "Navigate complexity with grace, finding order in apparent chaos." },
  { month: "November", lens: "Attitude", color: "attitude", description: "Cultivate stance and presence as the year winds down." },
  { month: "December", lens: "Influence", color: "influence", description: "Winter reflection on how you've grown in taking conscious space." },
];

const heroGradient = {
  background: `linear-gradient(180deg, 
    #000000 0%, 
    ${atmosphericPalette.space} 30%, 
    ${atmosphericPalette.highAtmosphere} 100%
  )`
};

const calendarSectionGradient = {
  background: `linear-gradient(180deg, 
    ${atmosphericPalette.highAtmosphere} 0%, 
    #061828 20%,
    #040f18 40%,
    #030a10 60%,
    ${atmosphericPalette.upperAtmosphere} 80%, 
    ${atmosphericPalette.midAtmosphere} 100%
  )`
};

const waitlistSectionGradient = {
  background: `linear-gradient(180deg, 
    ${atmosphericPalette.midAtmosphere} 0%, 
    ${atmosphericPalette.upperAtmosphere} 50%, 
    ${atmosphericPalette.highAtmosphere} 100%
  )`
};

export default function CalendarPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [preferredLens, setPreferredLens] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: { name: string; email: string; consentText: string; preferredLens?: string }) => {
      const result = await apiRequest("POST", "/api/webinar-waitlist", data);
      if (!result.ok) {
        const errorData = await result.json();
        throw new Error(errorData.message || "Failed to join waitlist");
      }
      return await result.json();
    },
    onSuccess: () => {
      toast({
        title: "You're on the list!",
        description: "We'll notify you when webinars launch. Check your email for confirmation.",
        duration: 6000,
      });
      setSubmitted(true);
      setName("");
      setEmail("");
      setPreferredLens("");
      setGdprConsent(false);
    },
    onError: (error: any) => {
      toast({
        title: "Unable to join waitlist",
        description: error.message || "Please try again in a moment.",
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
    
    if (!gdprConsent) {
      toast({
        title: "Consent required",
        description: "Please agree to receive webinar notifications",
        variant: "destructive",
      });
      return;
    }
    
    mutation.mutate({
      name,
      email,
      consentText: "I agree to receive email notifications about upcoming webinars and practice sessions. I understand I can unsubscribe at any time. My data will be processed in accordance with GDPR regulations.",
      preferredLens: preferredLens || undefined,
    });
  };

  const getLensColor = (lens: string) => {
    const lensData = Object.values(LENSES).find(l => l.name.toLowerCase() === lens.toLowerCase());
    return lensData?.color || "needs";
  };

  return (
    <div className="min-h-screen">
      <section className="relative pt-24 pb-16" style={heroGradient}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white" data-testid="badge-calendar">
              <Calendar className="w-3 h-3 mr-1" />
              Seasonal Practice
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg" style={{ fontFamily: 'Archivo, sans-serif' }} data-testid="heading-calendar">
              Online Coaching Calendar
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-6">
              Monthly and seasonal themed webinars following the rhythm of the 8 lenses. 
              Join coaches and participants for live practice sessions.
            </p>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Coaches and Executive Assistants in deep journeys participate actively. 
              Everyone else is welcome to observe and engage through comments.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-16" style={calendarSectionGradient}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-lg">
              The Annual Rhythm
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Each month focuses on a specific lens from the Periodic Table of Conscious Communication, 
              following the natural rhythm of the seasons.
            </p>
          </motion.div>

          <div className="relative mb-16">
            <motion.div 
              className="flex justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="relative max-w-2xl mx-auto">
                {/* Radial glow background for seamless blending - very dark */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(ellipse 60% 60% at center, rgba(4, 15, 24, 0.9) 0%, transparent 70%)',
                    transform: 'scale(1.3)'
                  }}
                />
                <img 
                  src={celestialCalendarUrl} 
                  alt="Celestial Calendar - 8 Lenses aligned with months and seasons" 
                  className="relative w-full h-auto"
                  style={{
                    maskImage: 'radial-gradient(ellipse 65% 65% at center, black 30%, transparent 80%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 65% 65% at center, black 30%, transparent 80%)'
                  }}
                />
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {lensCalendar.map((item) => {
              const lensColors: Record<string, string> = {
                influence: "bg-influence/20 border-influence/40",
                dynamics: "bg-dynamics/20 border-dynamics/40",
                ego: "bg-ego/20 border-ego/40",
                needs: "bg-needs/20 border-needs/40",
                alignment: "bg-alignment/20 border-alignment/40",
                flow: "bg-flow/20 border-flow/40",
                chaordic: "bg-chaordic/20 border-chaordic/40",
                attitude: "bg-attitude/20 border-attitude/40",
              };
              
              const textColors: Record<string, string> = {
                influence: "text-influence",
                dynamics: "text-dynamics",
                ego: "text-ego",
                needs: "text-needs",
                alignment: "text-alignment",
                flow: "text-flow",
                chaordic: "text-chaordic",
                attitude: "text-attitude",
              };
              
              return (
                <motion.div
                  key={item.month}
                  variants={fadeInUp}
                  className={`backdrop-blur-sm ${lensColors[item.color]} border rounded-xl p-4`}
                  data-testid={`card-month-${item.month.toLowerCase()}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white">{item.month}</span>
                    <Badge variant="outline" className={`${textColors[item.color]} border-current`}>
                      {item.lens}
                    </Badge>
                  </div>
                  <p className="text-white/70 text-sm">{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="relative py-20" style={waitlistSectionGradient}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            {!submitted ? (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-needs/20 border border-needs/30 mb-6">
                    <Video className="h-4 w-4 text-needs" />
                    <span className="text-sm font-medium text-needs">Coming Soon</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-white drop-shadow-lg" data-testid="heading-waitlist">
                    Join the Waitlist
                  </h2>
                  <p className="text-white/70 max-w-xl mx-auto mb-2">
                    Be the first to know when our seasonal webinars launch. 
                    You'll receive email notifications about upcoming sessions.
                  </p>
                  <p className="text-white/60 text-sm max-w-xl mx-auto">
                    <strong>Coaches & EAs in deep journeys:</strong> Active participation with video and voice<br/>
                    <strong>Everyone else:</strong> Observe and engage through comments and chat
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-waitlist">
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
                    <label className="text-sm font-medium text-white/80">Preferred Lens Focus (optional)</label>
                    <Select value={preferredLens} onValueChange={setPreferredLens}>
                      <SelectTrigger 
                        className="bg-white/5 border-white/10 text-white [&>span]:text-white/50 [&>span[data-placeholder]]:text-white/50"
                        data-testid="select-lens"
                      >
                        <SelectValue placeholder="Select a lens you're most interested in" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="influence">Influence</SelectItem>
                        <SelectItem value="attitude">Attitude</SelectItem>
                        <SelectItem value="chaordic">Chaordic</SelectItem>
                        <SelectItem value="flow">Flow</SelectItem>
                        <SelectItem value="alignment">Alignment</SelectItem>
                        <SelectItem value="needs">Energy & Needs</SelectItem>
                        <SelectItem value="ego">Ego</SelectItem>
                        <SelectItem value="dynamics">Dynamics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="gdpr-consent"
                      checked={gdprConsent}
                      onCheckedChange={(checked) => setGdprConsent(checked === true)}
                      className="mt-1 border-white/30 data-[state=checked]:bg-needs data-[state=checked]:border-needs"
                      data-testid="checkbox-consent"
                    />
                    <label htmlFor="gdpr-consent" className="text-sm text-white/70 leading-relaxed cursor-pointer">
                      I agree to receive email notifications about upcoming webinars and practice sessions. 
                      I understand I can unsubscribe at any time. My data will be processed in accordance 
                      with <a href="/privacy" className="text-needs hover:underline">GDPR regulations</a> and 
                      the <a href="/terms" className="text-needs hover:underline">Terms of Service</a>.
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-needs hover:bg-needs/90 text-white"
                    disabled={mutation.isPending}
                    data-testid="button-submit"
                  >
                    {mutation.isPending ? "Joining..." : (
                      <>
                        Join the Waitlist
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-needs mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4 text-white drop-shadow-lg">
                  You're on the List!
                </h2>
                <p className="text-white/70 max-w-xl mx-auto mb-6">
                  Thank you for joining! We'll send you an email when our seasonal webinars are ready to launch. 
                  In the meantime, explore the Periodic Table to start your conscious communication journey.
                </p>
                <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <a href="/periodic-table">
                    Explore the Periodic Table
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="relative py-16" style={{ background: `linear-gradient(180deg, ${atmosphericPalette.highAtmosphere} 0%, ${atmosphericPalette.space} 100%)` }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 rounded-full bg-needs/20 border border-needs/30 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-needs" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Monthly Themes</h3>
              <p className="text-white/60 text-sm">Each month explores a different lens from the Periodic Table, following the natural rhythm of the seasons.</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 rounded-full bg-alignment/20 border border-alignment/30 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-alignment" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Community Practice</h3>
              <p className="text-white/60 text-sm">Join coaches and EAs for live practice. Observe, learn, and engage through comments even if you're new.</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 rounded-full bg-ego/20 border border-ego/30 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-ego" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Deep Integration</h3>
              <p className="text-white/60 text-sm">Transform theory into practice through seasonal immersion in each communication lens.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
