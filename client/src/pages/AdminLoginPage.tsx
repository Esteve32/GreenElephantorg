import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/admin/login", { password });
      const data = await response.json();

      if (response.ok) {
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

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-needs text-white">Admin Access</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-archivo">
            Admin Login
          </h1>
          <p className="text-muted-foreground">
            Enter admin password to access form submissions
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-card/50 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-admin-password"
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-needs hover:bg-needs/90"
                disabled={isLoading}
                data-testid="button-admin-login"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 p-4 rounded-lg bg-background/50 border border-white/10">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Contact Estève at{" "}
                <a href="mailto:esteve@greenelephant.org" className="text-needs hover:underline">
                  esteve@greenelephant.org
                </a>{" "}
                if you need the admin password.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
