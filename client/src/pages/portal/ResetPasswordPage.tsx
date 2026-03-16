import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast({ title: "Too short", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure both passwords are identical.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiRequest("POST", "/api/portal/reset-password", { token, password });
      const data = await res.json();
      setDone(true);
      toast({ title: "Password reset", description: data.message });
    } catch (err: unknown) {
      toast({
        title: "Reset failed",
        description: err instanceof Error ? err.message : "The link may be expired. Please request a new one.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <Card className="bg-white/[0.03] border-white/10 backdrop-blur-xl max-w-md w-full">
          <CardContent className="pt-8 text-center space-y-4">
            <p className="text-white/60">Invalid reset link. Please request a new password reset.</p>
            <Button
              variant="outline"
              className="border-white/15 text-white/70"
              onClick={() => setLocation("/portal/forgot-password")}
              data-testid="button-request-new-reset"
            >
              Request new reset
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/[0.03] border-white/10 backdrop-blur-xl">
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 rounded-full bg-[#009999]/15 border border-[#009999]/30 flex items-center justify-center mx-auto mb-3">
              {done ? <CheckCircle className="w-5 h-5 text-[#009999]" /> : <Lock className="w-5 h-5 text-[#009999]" />}
            </div>
            <CardTitle className="text-white text-xl font-semibold">
              {done ? "Password updated" : "Set a new password"}
            </CardTitle>
            <p className="text-white/40 text-sm mt-1">
              {done
                ? "Your password has been changed. You can now log in."
                : "Choose a strong password with at least 8 characters."}
            </p>
          </CardHeader>
          <CardContent>
            {done ? (
              <Button
                className="w-full bg-[#009999] hover:bg-[#00b3b3] text-white"
                onClick={() => setLocation("/portal/login")}
                data-testid="button-go-login"
              >
                Go to login
              </Button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-white/80">New password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      data-testid="input-new-password"
                      className="pl-10 pr-10 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-[#009999]/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                      data-testid="button-toggle-password-visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-white/80">Confirm password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      data-testid="input-confirm-password"
                      className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-[#009999]/50"
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-red-400 text-xs">Passwords don't match</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || password.length < 8 || password !== confirmPassword}
                  className="w-full bg-[#009999] hover:bg-[#00b3b3] text-white"
                  data-testid="button-reset-password"
                >
                  {isLoading ? "Resetting..." : "Reset password"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
