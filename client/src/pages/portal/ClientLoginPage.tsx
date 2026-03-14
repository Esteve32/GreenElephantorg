import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Mail, Lock, User, ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { SiGoogle, SiLinkedin } from "react-icons/si";
import { useQuery } from "@tanstack/react-query";
import { ScanLocationCarousel, SCAN_LOCATIONS } from "@/components/portal/ScanLocationCarousel";

export default function ClientLoginPage() {
  const [tab, setTab] = useState<string>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTakingOff, setIsTakingOff] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('ge_portal_visited', '1');
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    if (error) {
      const errorMessages: Record<string, string> = {
        google_403: "Google login is temporarily unavailable. Please use email/password instead.",
        google_access_denied: "Google login was denied. Please use email/password instead.",
        no_code: "Login was cancelled. Please try again.",
        invalid_state: "Session expired. Please try logging in again.",
        not_configured: "This login method is not configured yet.",
        token_failed: "Could not complete login. Please try again.",
        no_email: "No email found on your account. Please use email/password.",
        portal_disabled: "Portal login is currently disabled.",
        session_failed: "Session error. Please try again.",
        callback_failed: "Login failed. Please try again.",
        state_mismatch: "Session expired. Please try logging in again.",
      };
      const message = errorMessages[error] || `Login failed (${error}). Please try email/password.`;
      toast({
        title: "Login issue",
        description: message,
        variant: "destructive",
      });
      window.history.replaceState({}, '', '/portal/login');
    }
  }, []);

  const { data: publicSettings } = useQuery<{
    lifetimeCutoffDate: string;
    subscriptionEnabled: boolean;
    subscriptionPriceMonthly: string;
    linkedinLoginEnabled: boolean;
    googleLoginEnabled: boolean;
    subscriptionFeatures?: string[];
  }>({ queryKey: ["/api/portal/settings/public"] });

  const showLinkedIn = publicSettings?.linkedinLoginEnabled ?? false;

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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/portal/login", { email, password });
      const data = await response.json();

      if (response.ok) {
        await queryClient.invalidateQueries({ queryKey: ["/api/portal/me"] });
        toast({
          title: "Welcome back!",
          description: "Launching your portal...",
        });
        setIsTakingOff(true);
        setTimeout(() => setLocation("/portal"), 1800);
      } else {
        toast({
          title: "Login failed",
          description: data.message || "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Could not connect to server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/portal/register", { email, password, name });
      const data = await response.json();

      if (response.ok) {
        await queryClient.invalidateQueries({ queryKey: ["/api/portal/me"] });
        toast({
          title: "Account created!",
          description: "Launching your portal...",
        });
        setIsTakingOff(true);
        setTimeout(() => setLocation("/portal"), 1800);
      } else {
        toast({
          title: "Registration failed",
          description: data.message || "Could not create account",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Could not connect to server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/portal/auth/google";
  };

  const handleLinkedInLogin = () => {
    window.location.href = "/api/portal/auth/linkedin";
  };

  return (
    <PortalLayout showHUD={false}>
    <style>{`
      @keyframes takeoffSlide {
        0% { transform: translateY(0) scale(1); opacity: 1; filter: blur(0px); }
        40% { transform: translateY(-5vh) scale(1.02); opacity: 1; filter: blur(0px); }
        100% { transform: translateY(-100vh) scale(1.08); opacity: 0; filter: blur(6px); }
      }
      @keyframes takeoffStars {
        0% { transform: translateY(0); }
        100% { transform: translateY(80vh); }
      }
    `}</style>
    <div className="min-h-screen bg-transparent">
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
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <ScanLocationCarousel fullScreen startIndex={(() => {
            const saved = localStorage.getItem("ge_preferred_country");
            if (!saved) return 0;
            const idx = SCAN_LOCATIONS.findIndex((l) => l.id === saved);
            return idx >= 0 ? idx : 0;
          })()} />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div
          className="absolute inset-0 overflow-hidden"
          style={isTakingOff ? { animation: "takeoffStars 1.8s ease-in forwards" } : undefined}
        >
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
          className="relative z-10 min-h-screen flex flex-col items-center px-4"
          style={{
            paddingTop: '10vh',
            ...(isTakingOff ? { animation: "takeoffSlide 1.8s ease-in forwards" } : {}),
          }}
        >
          <div className="w-full flex items-center justify-between mb-12 max-w-md mx-auto">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/50 text-xs"
              onClick={() => setLocation("/")}
              data-testid="button-back-home"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Back to site
            </Button>
            <Badge className="bg-[#009999]/20 text-[#009999] border-[#009999]/30">
              <Globe className="w-3 h-3 mr-1" />
              Client Portal
            </Badge>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Your Communication Hub
            </h1>
            <p className="text-base text-white/60 max-w-md mx-auto">
              Access your Satellite Scan results, coaching resources, and subscription tools
            </p>
            {publicSettings?.subscriptionFeatures && publicSettings.subscriptionFeatures.length > 0 && (
              <div className="mt-6 flex flex-wrap justify-center gap-3 max-w-lg mx-auto" data-testid="portal-login-features">
                {publicSettings.subscriptionFeatures.slice(0, 4).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-white/60">
                    <CheckCircle className="w-3 h-3 text-[#009999] shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Card className="w-full max-w-md backdrop-blur-md bg-black/40 border-white/10">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-5 w-5 text-[#009999]" />
                Welcome
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full bg-white text-gray-900 border-white/20"
                onClick={handleGoogleLogin}
                data-testid="button-google-login"
              >
                <SiGoogle className="w-4 h-4 mr-2" />
                Continue with Google
              </Button>

              {showLinkedIn && (
                <Button
                  className="w-full bg-[#0A66C2] text-white border-[#0A66C2]/20 hover:bg-[#004182]"
                  onClick={handleLinkedInLogin}
                  data-testid="button-linkedin-login"
                >
                  <SiLinkedin className="w-4 h-4 mr-2" />
                  Continue with LinkedIn
                </Button>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black/40 px-2 text-white/40">or use email</span>
                </div>
              </div>

              <Tabs value={tab} onValueChange={setTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/5">
                  <TabsTrigger value="login" data-testid="tab-login" className="data-[state=active]:bg-[#009999]/20 data-[state=active]:text-[#009999]">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="register" data-testid="tab-register" className="data-[state=active]:bg-[#009999]/20 data-[state=active]:text-[#009999]">
                    Create Account
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleEmailLogin} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-white/80">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          data-testid="input-login-email"
                          className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-[#009999]/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <Label htmlFor="login-password" className="text-white/80">Password</Label>
                        <button
                          type="button"
                          className="text-xs text-[#009999] hover:underline"
                          onClick={() => toast({ title: "Coming soon", description: "Password reset will be available shortly." })}
                          data-testid="link-forgot-password"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          data-testid="input-login-password"
                          className="pl-10 pr-10 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-[#009999]/50"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                          onClick={() => setShowPassword(!showPassword)}
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#009999] text-white border-[#009999]/50"
                      disabled={isLoading}
                      data-testid="button-email-login"
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name" className="text-white/80">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          data-testid="input-register-name"
                          className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-[#009999]/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-white/80">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          data-testid="input-register-email"
                          className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-[#009999]/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-white/80">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password (min 8 chars)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={8}
                          data-testid="input-register-password"
                          className="pl-10 pr-10 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-[#009999]/50"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                          onClick={() => setShowPassword(!showPassword)}
                          data-testid="button-toggle-password-register"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#009999] text-white border-[#009999]/50"
                      disabled={isLoading}
                      data-testid="button-register"
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-white/50 text-center">
                  By signing in, you agree to our terms of service and privacy policy. Your data is protected under GDPR.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

      </section>
    </div>
    </PortalLayout>
  );
}
