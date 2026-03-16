import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Play, ArrowRight, Clock, Eye, Pause } from "lucide-react";
import { useState, useRef } from "react";

interface ScanVideoDemoProps {
  accentColor?: string;
  badgeText?: string;
  headline?: string;
  subheadline?: string;
  ctaLink?: string;
  ctaText?: string;
  testIdPrefix?: string;
  videoSrc?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export function ScanVideoDemo({
  accentColor = "#009999",
  badgeText = "See It In Action",
  headline = "Watch the Full Scan Experience",
  subheadline = "A 5-minute walkthrough of the Satellite Scan from start to finish — see exactly what you'll get.",
  ctaLink = "/checkout?product=satellitescan",
  ctaText = "Start Your Scan — €99.95",
  testIdPrefix = "scan",
  videoSrc,
  gradientFrom = "#0a0a0a",
  gradientTo = "#0a0a0a",
}: ScanVideoDemoProps) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayToggle = () => {
    if (!videoSrc) return;
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
      setPlaying(false);
    } else {
      video.play();
      setPlaying(true);
    }
  };

  const handleVideoEnded = () => {
    setPlaying(false);
  };

  return (
    <section
      className="relative"
      data-testid={`section-${testIdPrefix}-video-demo`}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${gradientFrom} 0%, #0a0a0a 30%, #0a0a0a 70%, ${gradientTo} 100%)`,
        }}
      />

      <div className="relative z-10 py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge
              className="mb-4 border"
              style={{
                backgroundColor: `${accentColor}15`,
                color: accentColor,
                borderColor: `${accentColor}25`,
              }}
            >
              <Eye className="w-3 h-3 mr-1" />
              {badgeText}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {headline}
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              {subheadline}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative max-w-4xl mx-auto"
          >
            <div
              className="absolute -inset-6 md:-inset-10 rounded-3xl opacity-40 blur-3xl pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, ${accentColor}25 0%, transparent 70%)`,
              }}
            />

            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                border: `1px solid ${accentColor}20`,
                boxShadow: `0 0 80px ${accentColor}08, 0 4px 30px rgba(0,0,0,0.5)`,
              }}
            >
              <div
                className="flex items-center gap-2 px-4 py-2.5"
                style={{
                  borderBottom: `1px solid ${accentColor}15`,
                  background: `linear-gradient(90deg, ${accentColor}08 0%, rgba(255,255,255,0.02) 50%, ${accentColor}08 100%)`,
                }}
              >
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="flex-1 mx-4">
                  <div
                    className="rounded-md px-3 py-1 text-xs text-center max-w-xs mx-auto"
                    style={{
                      backgroundColor: `${accentColor}08`,
                      color: `${accentColor}80`,
                    }}
                  >
                    greenelephant.org/scan
                  </div>
                </div>
              </div>

              <div
                className="relative aspect-video bg-black flex items-center justify-center cursor-pointer group"
                onClick={handlePlayToggle}
                data-testid={`video-${testIdPrefix}-demo`}
              >
                {videoSrc ? (
                  <>
                    <video
                      ref={videoRef}
                      src={videoSrc}
                      className="absolute inset-0 w-full h-full object-cover"
                      playsInline
                      preload="metadata"
                      onEnded={handleVideoEnded}
                      data-testid={`video-${testIdPrefix}-player`}
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
                      style={{ opacity: playing ? 0 : 1, pointerEvents: playing ? "none" : "auto" }}
                    >
                      <div className="absolute inset-0 bg-black/60" />
                      <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white/50 text-sm z-10">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          5 min
                        </span>
                        <span className="text-white/20">|</span>
                        <span>Silent walkthrough</span>
                      </div>
                      <div className="relative z-10 flex flex-col items-center gap-3">
                        <div
                          className="w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                          style={{
                            backgroundColor: `${accentColor}30`,
                            border: `2px solid ${accentColor}60`,
                            boxShadow: `0 0 40px ${accentColor}20`,
                          }}
                        >
                          <Play
                            className="w-8 h-8 ml-1"
                            style={{ color: "white" }}
                          />
                        </div>
                        <p className="text-white/70 text-sm font-medium">
                          Watch the full walkthrough
                        </p>
                      </div>
                    </div>
                    {playing && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-sm">
                          <Pause className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/60" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white/40 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        5 min
                      </span>
                      <span className="text-white/20">|</span>
                      <span>Full walkthrough</span>
                    </div>
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{
                          backgroundColor: `${accentColor}30`,
                          border: `2px solid ${accentColor}60`,
                        }}
                      >
                        <Play
                          className="w-8 h-8 ml-1"
                          style={{ color: accentColor }}
                        />
                      </div>
                      <p className="text-white/60 text-sm font-medium">
                        Video coming soon
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Link href={ctaLink}>
                <Button
                  size="lg"
                  className="text-white"
                  style={{ backgroundColor: accentColor }}
                  data-testid={`button-${testIdPrefix}-video-cta`}
                >
                  {ctaText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <p className="text-sm text-white/35">
                90-minute assessment, results in 48-72 hours
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
