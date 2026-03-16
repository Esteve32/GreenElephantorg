import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import dashboardMockupUrl from "@assets/generated_images/multi_device_dashboard_mockup.png";

interface DashboardPreviewProps {
  accentColor?: string;
  testIdPrefix?: string;
}

export function DashboardPreview({
  accentColor = "#009999",
  testIdPrefix = "dashboard",
}: DashboardPreviewProps) {
  const stats = [
    { stat: "48-72h", label: "Dashboard delivery" },
    { stat: "129", label: "Communication elements" },
    { stat: "8", label: "Behavioral lenses" },
    { stat: "10+", label: "AI coaching prompts" },
  ];

  return (
    <section
      className="relative py-16 md:py-20"
      style={{ background: "#0a0a0a" }}
      data-testid={`section-${testIdPrefix}-preview`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mb-10"
        >
          <div
            className="absolute -inset-4 md:-inset-8 rounded-3xl opacity-30 blur-3xl pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, ${accentColor}15 0%, transparent 70%)`,
            }}
          />

          <div
            className="relative rounded-xl overflow-hidden"
            style={{
              border: `1px solid ${accentColor}15`,
              boxShadow: `0 0 60px ${accentColor}06, 0 4px 20px rgba(0,0,0,0.4)`,
            }}
          >
            <img
              src={dashboardMockupUrl}
              alt="Satellite Scan dashboard showing communication patterns across multiple devices"
              className="w-full h-auto"
              data-testid={`img-${testIdPrefix}-mockup`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((item) => (
            <Card key={item.label} className="bg-white/5 border-white/10 text-center">
              <CardContent className="p-5">
                <p
                  className="text-2xl font-bold"
                  style={{ color: accentColor }}
                  data-testid={`stat-${testIdPrefix}-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.stat}
                </p>
                <p className="text-xs text-white/50 mt-1">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
