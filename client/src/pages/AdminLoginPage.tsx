import { useEffect, useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ChevronDown, Eye, EyeOff } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import earthImageUrl from "@assets/generated_images/earth_from_space_without_aurora.png";

export default function AdminLoginPage() {
  useEffect(() => { document.title = "Admin Login | GreenElephant OS"; }, []);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordFallback, setShowPasswordFallback] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/admin/login", { password });
      const data = await response.json();

      if (response.ok) {
        await queryClient.invalidateQueries({ queryKey: ['/api/admin/check'] });
        
        toast({
          title: "Login successful",
          description: "Redirecting to admin dashboard...",
        });
        setTimeout(() => {
          setLocation("/admin/submissions");
        }, 500);
      } else {
        toast({
          title: "Login failed",
          description: data.message || "Incorrect password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not connect to server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const errorMessages: Record<string, string> = {
    not_authorized: "Your Google account is not authorized for admin access. Ask a Super Admin to invite you.",
    no_code: "Google login failed. Please try again.",
    state_mismatch: "Security check failed. Please try again.",
    not_configured: "Google login is not configured yet.",
    token_failed: "Google authentication failed. Please try again.",
    session_failed: "Session error. Please try again.",
    callback_failed: "Login error. Please try again.",
    no_email: "Could not retrieve your email from Google.",
    dev_google: "Google login only works on the published site. Use password login in dev mode.",
  };

  return (
    <div className="min-h-screen bg-black">
      <section
        className="relative min-h-screen overflow-hidden"
        style={{
          background: `linear-gradient(180deg,
            #000000 0%,
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
            maskImage: 'linear-gradient(to bottom, black 0%, black 15%, rgba(0,0,0,0.65) 35%, rgba(0,0,0,0.2) 55%, transparent 70%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 15%, rgba(0,0,0,0.65) 35%, rgba(0,0,0,0.2) 55%, transparent 70%)'
          }}
        />

        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: '200px',
            background: `linear-gradient(180deg, 
              #000000 0%,
              rgba(0, 0, 0, 0.85) 50%,
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
              #000000 100%
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
              Sign in with your GreenElephant Google account to access the admin dashboard
            </p>
          </div>

          {errorParam && (
            <div className="w-full max-w-md mb-4 p-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center" data-testid="text-login-error">
              {errorMessages[errorParam] || "Login failed. Please try again."}
            </div>
          )}

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

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-transparent px-2 text-white/40">or</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-1 text-xs text-white/40 hover:text-white/60 transition-colors py-1"
                onClick={() => setShowPasswordFallback(!showPasswordFallback)}
                data-testid="button-toggle-password"
              >
                Use admin password
                <ChevronDown className={`w-3 h-3 transition-transform ${showPasswordFallback ? 'rotate-180' : ''}`} />
              </button>

              {showPasswordFallback && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/80">Admin Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your admin password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        data-testid="input-admin-password"
                        autoComplete="current-password"
                        className="bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-needs/50 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                        data-testid="button-toggle-password-visibility"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-needs text-white"
                    disabled={isLoading}
                    data-testid="button-admin-login"
                  >
                    {isLoading ? "Logging in..." : "Login with Password"}
                  </Button>
                </form>
              )}

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
