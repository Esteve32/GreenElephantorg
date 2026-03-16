import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/portal/forgot-password", { email: email.trim() });
      setSent(true);
    } catch (err: unknown) {
      toast({
        title: "Something went wrong",
        description: err instanceof Error ? err.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => setLocation("/portal/login")}
          className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors mb-6 text-sm"
          data-testid="link-back-login"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </button>

        <Card className="bg-white/[0.03] border-white/10 backdrop-blur-xl">
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 rounded-full bg-[#009999]/15 border border-[#009999]/30 flex items-center justify-center mx-auto mb-3">
              <Mail className="w-5 h-5 text-[#009999]" />
            </div>
            <CardTitle className="text-white text-xl font-semibold">
              {sent ? "Check your email" : "Forgot your password?"}
            </CardTitle>
            <p className="text-white/40 text-sm mt-1">
              {sent
                ? "If an account exists with that email, we've sent a reset link."
                : "Enter your email and we'll send you a link to reset it."}
            </p>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-[#009999]/10 border border-[#009999]/20">
                  <CheckCircle className="w-5 h-5 text-[#009999] flex-shrink-0" />
                  <div>
                    <p className="text-white/80 text-sm">Reset link sent to <strong className="text-white">{email}</strong></p>
                    <p className="text-white/40 text-xs mt-1">The link expires in 1 hour. Check your spam folder if you don't see it.</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-white/15 text-white/70 hover:text-white"
                  onClick={() => setLocation("/portal/login")}
                  data-testid="button-back-to-login"
                >
                  Return to login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-white/80">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      data-testid="input-reset-email"
                      className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-[#009999]/50"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full bg-[#009999] hover:bg-[#00b3b3] text-white"
                  data-testid="button-send-reset"
                >
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
