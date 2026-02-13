import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { fadeInUp, fadeIn, staggerContainer } from "@/lib/motion";
import { atmosphericPalette } from "@/constants/atmosphericGradient";

export default function ContactPage() {
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const intents = [
    { id: "coaching", label: "EA Coaching", icon: MessageCircle, color: "bg-alignment" },
    { id: "interview", label: "Interview Coaching", icon: Calendar, color: "bg-needs" },
    { id: "consulting", label: "Consulting", icon: Mail, color: "bg-attitude" },
  ];

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

  const gradientStyle = {
    background: `linear-gradient(180deg, 
      #000000 0%, 
      ${atmosphericPalette.space} 30%, 
      ${atmosphericPalette.highAtmosphere} 60%, 
      ${atmosphericPalette.upperAtmosphere} 100%
    )`,
  };

  return (
    <div className="min-h-screen pt-24 pb-16" style={gradientStyle}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          data-testid="section-hero"
        >
          <Badge className="mb-4 bg-white/10 text-white border border-white/20" data-testid="badge-contact">
            Get in Touch
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg" data-testid="heading-main">
            Your Message Receives Our Full Presence
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-4" data-testid="text-intro">
            Every inquiry is treated as a holy encounter. When you reach out, you'll receive a personalized response within 24 hours—not automation, but genuine human presence.
          </p>
          <p className="text-lg text-white/70 max-w-2xl mx-auto" data-testid="text-sub-intro">
            Whether exploring retreats, coaching, or research collaboration, we'll help you discern which path aligns with your journey.
          </p>
        </motion.div>

        <motion.div
          className="mb-12"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          data-testid="section-intents"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-white drop-shadow-lg" data-testid="heading-intents">
            What brings you here today?
          </h2>
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
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
          data-testid="section-form"
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-white drop-shadow-lg" data-testid="heading-form">
                {selectedIntent === "retreats" && "Express Interest in Retreats"}
                {selectedIntent === "coaching" && "Schedule a Coaching Session"}
                {selectedIntent === "research" && "Collaborate on Research"}
                {!selectedIntent && "Send Us a Message"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-contact">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80" data-testid="label-name">Name *</label>
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
                    <label className="text-sm font-medium text-white/80" data-testid="label-email">Email *</label>
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

                {selectedIntent === "coaching" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80" data-testid="label-package">Preferred Package</label>
                    <select
                      className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white"
                      data-testid="select-package"
                    >
                      <option value="" className="bg-gray-900">Select a package</option>
                      <option value="foundation" className="bg-gray-900">Foundation (1:1)</option>
                      <option value="transformation" className="bg-gray-900">Transformation (1:1)</option>
                      <option value="team" className="bg-gray-900">Team Transformation</option>
                    </select>
                  </div>
                )}

                {selectedIntent === "retreats" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80" data-testid="label-season">Preferred Season</label>
                    <select
                      className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white"
                      data-testid="select-season"
                    >
                      <option value="" className="bg-gray-900">Select a season</option>
                      <option value="spring" className="bg-gray-900">Spring 2024</option>
                      <option value="summer" className="bg-gray-900">Summer 2024</option>
                      <option value="autumn" className="bg-gray-900">Autumn 2024</option>
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80" data-testid="label-message">Message *</label>
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
                  <p className="text-xs text-white/60" data-testid="text-message-hint">
                    Minimum 10 characters - help us understand how we can serve you
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-needs hover:bg-needs/90"
                  disabled={mutation.isPending}
                  data-testid="button-submit"
                >
                  {mutation.isPending ? "Sending..." : "Send with Gratitude"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <Card className="bg-white/5 backdrop-blur-md border border-white/10" data-testid="card-booking">
              <CardHeader>
                <CardTitle className="text-white drop-shadow-lg" data-testid="heading-booking">Direct Booking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-white/70" data-testid="text-booking">
                  Prefer to book directly? Use our calendar system to find a time that works for both of us.
                </p>
                <Button
                  variant="outline"
                  className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10"
                  data-testid="button-calendar"
                  asChild
                >
                  <a href="https://calendly.com/anu-greenelephant/call-with-anu" target="_blank" rel="noopener noreferrer">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book a Call with Anu
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <Card className="bg-white/5 backdrop-blur-md border border-white/10" data-testid="card-response">
              <CardHeader>
                <CardTitle className="text-white drop-shadow-lg" data-testid="heading-response">Response Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-white/70" data-testid="text-response-1">
                  We honor each inquiry with care and attention. You can expect a personal response within 24 hours during weekdays.
                </p>
                <p className="text-sm text-white/70" data-testid="text-response-2">
                  For urgent matters, please indicate so in your message subject.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
