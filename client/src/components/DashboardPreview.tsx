import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

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
    { stat: "129", label: "Self-reflection questions" },
    { stat: "8", label: "Communication lenses" },
    { stat: "10+", label: "AI coaching prompts" },
  ];

  return (
    <section
      className="relative py-8 md:py-10 overflow-hidden"
      style={{ background: "#0a0a0a" }}
      data-testid={`section-${testIdPrefix}-preview`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
