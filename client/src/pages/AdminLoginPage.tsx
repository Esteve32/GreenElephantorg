import { AdminLoginHelp, AdminTroubleshooting } from '@/components/admin/AdminTroubleshooting';
import { AdminLearningPanel } from "@/components/admin/AdminLearning";
import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import earthImageUrl from "@assets/generated_images/earth_from_space_without_aurora.png";

export default function AdminLoginPage() {
  useEffect(() => { document.title = "Admin Login | GreenElephant OS"; }, []);
  const searchParams = new URLSearchParams(window.location.search);
  const errorParam = searchParams.get("error");

  const stars = useMemo(
    () =>
      Array.from({ length: 150 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${30 + Math.random() * 65}%`,
        opacity: Math.random() * 0.8 + 0.1,
        duration: `${Math.random() * 3 + 2}s`,
        delay: `${Math.random() * 5}s`,
      })),
    []
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <section
        className="relative min-h-screen overflow-hidden"
        style={{
          background: `linear-gradient(180deg,
            #0a0a0a 0%,
            #020204 5%,
            #030308 10%,
            #040410 15%,
            #050515 20%,
            #060618 25%,
            #07071a 30%,
            #08081c 35%,
            #090920 40%,
            #0a0a22 45%,
            #0a0a18 55%,
            #080814 65%,
            #060610 75%,
            #04040c 85%,
            #030308 100%
          )`
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute w-px h-px bg-white rounded-full"
              style={{
                left: star.left,
                top: star.top,
                opacity: star.opacity,
                animation: `pulse ${star.duration} ease-in-out infinite`,
                animationDelay: star.delay,
              }}
            />
          ))}
        </div>

        <div
          className="absolute left-0 right-0"
          style={{
            top: '0',
            height: '70vh',
            minHeight: '360px',
            backgroundImage: `url(${earthImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            backgroundRepeat: 'no-repeat',
            transform: 'scaleY(-1)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 24%, black 72%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 24%, black 72%, transparent 100%)'
          }}
        />

        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: '200px',
            background: `linear-gradient(180deg, 
              #0a0a0a 0%,
              rgba(10, 10, 10, 0.85) 50%,
              transparent 100%
            )`
          }}
        />

        <div
          className="absolute left-0 right-0 bottom-0 pointer-events-none"
          style={{
            top: '20vh',
            background: `linear-gradient(180deg, 
              transparent 0%,
              rgba(4, 4, 12, 0.15) 15%,
              rgba(4, 4, 12, 0.45) 35%,
              #040410 60%,
              #030308 80%,
              #0a0a0a 100%
            )`
          }}
        />

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4" style={{ paddingTop: '80px' }}>
          <div className="text-center mb-8">
            <Badge className="mb-6 bg-needs/20 text-needs border-needs/30">
              <Lock className="w-3 h-3 mr-1" />
              Admin Access
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white" style={{ fontFamily: 'Archivo, sans-serif' }}>
              Mission Control
            </h1>
            <p className="text-lg text-white/70 max-w-md mx-auto">
              Sign in with your individually approved Google account to access the admin dashboard
            </p>
          </div>

          {errorParam && <div className="w-full max-w-xl" data-testid="text-login-error"><AdminTroubleshooting code={errorParam} /></div>}

          <Card className="w-full max-w-md backdrop-blur-md bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Lock className="h-5 w-5 text-needs" />
                Authentication Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full bg-white text-black gap-2"
                onClick={() => {
                  window.location.href = "/api/admin/auth/google";
                }}
                data-testid="button-admin-google-login"
              >
                <SiGoogle className="w-4 h-4" />
                Sign in with Google
              </Button>

              <p className="text-sm text-white/60">
                Google sign-in is required. Shared admin passwords are no longer supported.
                Open the help below if you cannot sign in.
              </p>

              <AdminLoginHelp />

              <AdminLearningPanel topics={["mfa", "breakglass"]} />

              <div className="mt-4 p-4 rounded-md bg-white/5 border border-white/10">
                <p className="text-sm text-white/50">
                  <strong className="text-white/70">Need access?</strong> Contact Esteve at{" "}
                  <a href="mailto:esteve@greenelephant.org" className="text-needs hover:underline">
                    esteve@greenelephant.org
                  </a>{" "}
                  to be invited as a team member.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
