import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SEO } from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { WebinarSession } from "@shared/schema";
import {
  Radio,
  ArrowRight,
  Video,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Users,
  Lock,
  Mic,
  Monitor,
} from "lucide-react";
import { motion } from "framer-motion";
import archipelagoUrl from "@assets/finnish_archipelago_landscape_aerial_view_1764797904449.png";
import Footer from "@/components/Footer";

const LENS_COLORS: Record<string, string> = {
  influence: "#cc3333",
  attitude: "#ff9933",
  chaordic: "#cccc33",
  flow: "#99cc33",
  alignment: "#669966",
  needs: "#009999",
  ego: "#3399cc",
  dynamics: "#666699",
};


const FAQ_ITEMS = [
  {
    question: "Who can attend?",
    answer: "Anyone is welcome as a guest (chat-only). Satellite Scan holders get full mic and camera access and a reserved seat.",
  },
  {
    question: "Are sessions recorded?",
    answer: "Yes. Replays are available for 30 days. Access the replay by registering below — we'll email you the link.",
  },
  {
    question: "How many sessions per year?",
    answer: "One per month, following the 8 communication lenses. Each session is 60 minutes: 20 min theory, 30 min live practice, 10 min Q&A.",
  },
];

export default function WebinarsPage() {
  useEffect(() => { document.title = "Webinars — Upcoming Sessions | GreenElephant"; }, []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery<WebinarSession[]>({
    queryKey: ["/api/webinar-sessions"],
  });

  const handleReplayGate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      toast({ title: "Consent required", description: "Please tick the consent box to continue.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/webinar/replay-gate", { name, email, consent });
      setSubmitted(true);
    } catch (err: any) {
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Monthly Lens Webinars | GreenElephant"
        description="One lens. One hour. Real conversations. Join our monthly live webinars on conscious communication. Free guest access. Mic-and-camera access for Satellite Scan holders."
        canonicalPath="/webinars"
        keywords="conscious communication webinar, GreenBlueRed webinar, communication training online, live communication coaching"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Live Webinars", url: "/webinars" },
        ]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map(f => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }}
      />

      <div className="min-h-screen bg-background text-white">

        {/* Hero */}
        <section className="relative pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-needs/10 via-background to-background pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Badge className="mb-6 bg-needs/20 text-needs border-needs/30">
                <Radio className="w-3 h-3 mr-1.5 animate-pulse" />
                Live, not recorded — real conversations
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Monthly Lens Webinars
              </h1>
              <p className="text-xl md:text-2xl text-white/70 mb-4 font-light">
                One lens. One hour. Real conversations.
              </p>
              <p className="text-base text-white/50 max-w-2xl mx-auto">
                Each month we go deep on one lens from the Periodic Table of Conscious Communication — live theory, live practice, live Q&A.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Two-tier access */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-3">Two ways to join</h2>
              <p className="text-white/60">Choose the level that suits where you are.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-white/5 border-white/10 h-full">
                  <CardContent className="p-7">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-white/60" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Guest access</p>
                        <Badge variant="outline" className="text-xs border-white/20 text-white/50">Free</Badge>
                      </div>
                    </div>
                    <ul className="space-y-3 text-sm text-white/70">
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-white/40 flex-shrink-0 mt-0.5" />Chat participation only</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-white/40 flex-shrink-0 mt-0.5" />Watch live theory and demos</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-white/40 flex-shrink-0 mt-0.5" />Access replay for 30 days</li>
                    </ul>
                    <p className="mt-5 text-xs text-white/65">Register via the replay gate below to receive the link.</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-needs/10 border-needs/30 h-full">
                  <CardContent className="p-7">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-md bg-needs/20 flex items-center justify-center">
                        <Mic className="h-5 w-5 text-needs" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Satellite Scan holder</p>
                        <Badge className="bg-needs/20 text-needs border-needs/30 text-xs">Included</Badge>
                      </div>
                    </div>
                    <ul className="space-y-3 text-sm text-white/80">
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-needs flex-shrink-0 mt-0.5" />Mic + camera active — real practice</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-needs flex-shrink-0 mt-0.5" />Reserved seat (limited to 8)</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-needs flex-shrink-0 mt-0.5" />Live feedback from coaches</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-needs flex-shrink-0 mt-0.5" />Post-session written notes</li>
                    </ul>
                    <Link href="/scan" className="block mt-5">
                      <Button size="sm" className="bg-needs text-white gap-2 w-full">
                        Get the Satellite Scan first
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Upcoming sessions */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-3">Upcoming sessions</h2>
              <p className="text-white/60">Register below to receive the link for any session.</p>
            </motion.div>
            <div className="space-y-5">
              {sessionsLoading ? (
                <div className="text-center py-12 text-white/65">Loading sessions…</div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-12 text-white/65">No upcoming sessions scheduled yet. Check back soon.</div>
              ) : sessions.map((session, i) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="bg-white/5 border-white/10" data-testid={`card-webinar-session-${session.id}`}>
                    <CardContent className="p-6">
                      <div className="flex flex-wrap items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-md flex-shrink-0"
                          style={{ backgroundColor: `${LENS_COLORS[session.lens]}33`, border: `1px solid ${LENS_COLORS[session.lens]}66` }}
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: LENS_COLORS[session.lens] }} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-lg mb-1">{session.topic}</p>
                          <p className="text-sm text-white/60 mb-3">{session.description}</p>
                          <div className="flex flex-wrap gap-3 text-xs text-white/50">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{session.date}</span>
                            <span className="flex items-center gap-1"><Monitor className="h-3 w-3" />{session.time}</span>
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{session.spotsLeft} mic spots left</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <Badge
                            variant="outline"
                            className="capitalize text-xs"
                            style={{ color: LENS_COLORS[session.lens], borderColor: `${LENS_COLORS[session.lens]}66` }}
                          >
                            {session.lens}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Replay gate */}
        <section className="py-20">
          <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Lock className="h-5 w-5 text-needs" />
                    <h2 className="text-xl font-bold">Get the replay link</h2>
                  </div>

                  {submitted ? (
                    <div className="text-center py-6">
                      <CheckCircle2 className="h-10 w-10 text-needs mx-auto mb-4" />
                      <h3 className="font-semibold text-lg mb-2">Check your inbox</h3>
                      <p className="text-white/60 text-sm">We've sent the replay link to <strong>{email}</strong>. Check your spam folder if it doesn't arrive within a few minutes.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleReplayGate} className="space-y-5">
                      <div>
                        <Label htmlFor="webinar-name" className="text-sm text-white/70 mb-1.5 block">Your name</Label>
                        <Input
                          id="webinar-name"
                          type="text"
                          placeholder="First name"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          required
                          className="bg-white/5 border-white/10"
                          data-testid="input-webinar-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="webinar-email" className="text-sm text-white/70 mb-1.5 block">Email address</Label>
                        <Input
                          id="webinar-email"
                          type="email"
                          placeholder="you@email.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                          className="bg-white/5 border-white/10"
                          data-testid="input-webinar-email"
                        />
                      </div>
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="webinar-consent"
                          checked={consent}
                          onCheckedChange={v => setConsent(v === true)}
                          className="mt-0.5"
                          data-testid="checkbox-webinar-consent"
                        />
                        <Label htmlFor="webinar-consent" className="text-xs text-white/50 leading-relaxed cursor-pointer">
                          I agree to receive the replay link and occasional updates about upcoming webinars. I can unsubscribe at any time by replying to any email.
                        </Label>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-needs text-white gap-2"
                        disabled={isSubmitting}
                        data-testid="button-webinar-replay-submit"
                      >
                        {isSubmitting ? "Sending…" : "Send me the replay link"}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <p className="text-xs text-white/60 text-center">
                        We store your email and consent date as required by GDPR. We never share your data. You received this email because you requested the replay.
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8 text-center">Frequently asked questions</h2>
            <div className="space-y-4">
              {FAQ_ITEMS.map((item, i) => (
                <Card key={i} className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <p className="font-semibold mb-2">{item.question}</p>
                    <p className="text-white/60 text-sm">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#0a0a0a]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-white/60 mb-3 text-sm uppercase tracking-wider">Want the full experience?</p>
              <h2 className="text-3xl font-bold mb-4">Get the Satellite Scan first</h2>
              <p className="text-white/60 mb-8">Know your patterns across all 8 lenses before you practise live. Scan holders get reserved mic access to every session.</p>
              <Link href="/scan">
                <Button size="lg" className="bg-needs text-white gap-2 px-8">
                  Get the Satellite Scan — €99.95
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

      </div>

      {/* Nature image — fully visible with gentle top and bottom fades */}
      <div className="relative w-full bg-[#0a0a0a]">
        {/* Top fade: very gentle, leaves most of image exposed */}
        <div
          className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
          style={{
            height: '160px',
            background: `linear-gradient(to bottom,
              #0a0a0a        0%,
              rgba(10,10,10,0.88)  22%,
              rgba(10,10,10,0.60)  46%,
              rgba(10,10,10,0.24)  72%,
              transparent   100%
            )`,
          }}
        />

        <img
          src={archipelagoUrl}
          alt="Finnish Archipelago"
          className="w-full h-auto block"
        />

        {/* Bottom fade: gentle dissolve into the footer */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
          style={{
            height: '160px',
            background: `linear-gradient(to top,
              #000000        0%,
              rgba(0,0,0,0.88)    22%,
              rgba(0,0,0,0.60)    46%,
              rgba(0,0,0,0.24)    72%,
              transparent   100%
            )`,
          }}
        />

        <div className="absolute bottom-4 left-0 right-0 z-20 text-center">
          <p className="text-white/65 text-xs tracking-wide">Finnish Archipelago</p>
        </div>
      </div>

      <Footer />
    </>
  );
}
