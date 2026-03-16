import { useMemo } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PortalHUD } from "./PortalHUD";
import { PortalFeedbackWidget } from "./PortalFeedbackWidget";
import earthOrbitUrl from "@assets/generated_images/earth_orbit_aurora_view.png";

type StarStyle = React.CSSProperties & { "--ps-opacity": number };

interface PortalLayoutProps {
  children: React.ReactNode;
  showHUD?: boolean;
}

export function PortalLayout({ children, showHUD = true }: PortalLayoutProps) {
  const [, setLocation] = useLocation();

  const { data: me } = useQuery<{
    authenticated: boolean;
    user?: { name: string; email: string; avatarUrl?: string };
  }>({
    queryKey: ["/api/portal/me"],
  });

  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.4 + 0.05,
        duration: `${Math.random() * 4 + 3}s`,
        delay: `${Math.random() * 6}s`,
      })),
    []
  );

  const handleLogout = async () => {
    await apiRequest("POST", "/api/portal/logout");
    queryClient.invalidateQueries({ queryKey: ["/api/portal/me"] });
    setLocation("/portal/login");
  };

  return (
    <div className="relative min-h-screen bg-black text-white" data-testid="portal-layout">
      <style>{`
        @keyframes portalStarPulse {
          0%, 100% { opacity: var(--ps-opacity); }
          50% { opacity: 0; }
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {stars.map((star) => {
          const starStyle: StarStyle = {
            left: star.left,
            top: star.top,
            "--ps-opacity": star.opacity,
            opacity: star.opacity,
            animation: `portalStarPulse ${star.duration} ease-in-out infinite`,
            animationDelay: star.delay,
          };
          return (
            <div
              key={star.id}
              className="absolute w-px h-px bg-white rounded-full"
              style={starStyle}
            />
          );
        })}
      </div>

      <div className="absolute top-0 left-0 right-0 h-[40vh] pointer-events-none z-0 overflow-hidden">
        <img
          src={earthOrbitUrl}
          alt=""
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>

        <footer
          className="relative mt-auto"
          data-testid="portal-footer"
        >
          <div className="h-16 bg-gradient-to-b from-transparent to-[#050505]" />

          <div className="bg-[#050505] border-t border-white/[0.03] px-4 py-6">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-wrap justify-center">
                <Link href="/privacy">
                  <span className="text-xs text-white/20 hover:text-white/40 transition-colors cursor-pointer">
                    Privacy Policy
                  </span>
                </Link>
                <span className="text-white/10">|</span>
                <Link href="/terms">
                  <span className="text-xs text-white/20 hover:text-white/40 transition-colors cursor-pointer">
                    Terms & Conditions
                  </span>
                </Link>
                <span className="text-white/10">|</span>
                {me?.authenticated ? (
                  <button
                    onClick={handleLogout}
                    className="text-xs text-white/20 hover:text-white/40 transition-colors flex items-center gap-1"
                    data-testid="button-portal-logout"
                  >
                    <LogOut className="w-2.5 h-2.5" />
                    Log out
                  </button>
                ) : (
                  <Link href="/portal/login">
                    <span className="text-xs text-white/20 hover:text-white/40 transition-colors cursor-pointer">
                      Log in
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </footer>
      </div>

      {showHUD && me?.authenticated && (
        <>
          <PortalHUD />
          <PortalFeedbackWidget />
        </>
      )}
    </div>
  );
}
