import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

import parisImg from "@assets/TakeOff_Paris_France_HUD_HkBjwridBx9t7stFtmDTv_6em6lPeD_1773364160225.png";
import luzernImg from "@assets/TakeOff_Luzern_Switzerland_HUD_k11A0FIvbOh1bwRNhCHJF_7WYK5Wtj_1773364160225.png";
import espooImg from "@assets/TakeOff_Espoo_Forest_Finland_HUD_Did03uX38tkWRogHdq3XM_Hhp78OH_1773364160225.png";
import athensImg from "@assets/TakeOff_Athens_Greece_HUD_oidhLnW8K6kzdXSJsHvAC_OWG31uWM_1773364160224.png";
import norwayImg from "@assets/TakeOff_Seaview_cave_Norway_HUD_AmZ-kuERQSTfRUo6YchFA_BFPSbonF_1773364160226.jpg";
import sohoImg from "@assets/TakeOff_Soho_England_HUD_cAG65eRWqXj1D2DB-9Z5G_JlyQmSJu_1773364160226.jpg";
import hagueImg from "@assets/TakeOff_The_Hague_Netherlands_HUD_v3ADuk1nw0_mNqzEXHGlF_ZonOp1_1773364160226.png";

export interface ScanLocation {
  id: string;
  country: string;
  location: string;
  image: string;
}

export const SCAN_LOCATIONS: ScanLocation[] = [
  { id: "france", country: "France", location: "Paris", image: parisImg },
  { id: "switzerland", country: "Switzerland", location: "Luzern", image: luzernImg },
  { id: "finland", country: "Finland", location: "Espoo Forest", image: espooImg },
  { id: "greece", country: "Greece", location: "Athens", image: athensImg },
  { id: "norway", country: "Norway", location: "Fjord Coast", image: norwayImg },
  { id: "england", country: "England", location: "Soho, London", image: sohoImg },
  { id: "netherlands", country: "Netherlands", location: "The Hague", image: hagueImg },
];

interface ScanLocationCarouselProps {
  startIndex?: number;
  fullScreen?: boolean;
}

export function ScanLocationCarousel({ startIndex = 0, fullScreen = false }: ScanLocationCarouselProps) {
  const [current, setCurrent] = useState(startIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const clampedIdx = Math.max(0, Math.min(startIndex, SCAN_LOCATIONS.length - 1));
    setCurrent(clampedIdx);
  }, [startIndex]);

  const goTo = useCallback(
    (idx: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(idx);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning]
  );

  const prev = useCallback(() => {
    goTo(current === 0 ? SCAN_LOCATIONS.length - 1 : current - 1);
  }, [current, goTo]);

  const next = useCallback(() => {
    goTo(current === SCAN_LOCATIONS.length - 1 ? 0 : current + 1);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c === SCAN_LOCATIONS.length - 1 ? 0 : c + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const loc = SCAN_LOCATIONS[current];

  return (
    <div className="relative w-full overflow-hidden" data-testid="scan-location-carousel">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          height: "80px",
          background: "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, transparent 100%)",
          zIndex: 2,
        }}
      />

      <div className="relative w-full" style={fullScreen ? { height: "100vh" } : { aspectRatio: "21/9", maxHeight: "420px" }}>
        {SCAN_LOCATIONS.map((item, idx) => (
          <div
            key={item.id}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: idx === current ? 1 : 0 }}
          >
            <img
              src={item.image}
              alt={`Self-reflection scan in ${item.location}, ${item.country}`}
              className="w-full h-full object-cover"
              loading={idx === 0 ? "eager" : "lazy"}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 30%, transparent 60%, rgba(0,0,0,0.4) 100%)",
              }}
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-5 pt-10">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#009999]" />
              <span className="text-xs text-white/50 tracking-wider uppercase">
                {loc.location}
              </span>
              <span className="text-xs text-white/30">—</span>
              <span className="text-sm font-medium text-white/80" data-testid="text-carousel-country">
                {loc.country}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"
                aria-label="Previous location"
                data-testid="button-carousel-prev"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className="flex gap-1.5">
                {SCAN_LOCATIONS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      idx === current ? "bg-[#009999] w-4" : "bg-white/20 hover:bg-white/40"
                    }`}
                    aria-label={`Go to ${SCAN_LOCATIONS[idx].country}`}
                    data-testid={`button-carousel-dot-${idx}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"
                aria-label="Next location"
                data-testid="button-carousel-next"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-xs text-white/25 mt-3 text-center">
            Conscious communication scans — wherever you are in Europe
          </p>
        </div>
      </div>
    </div>
  );
}
