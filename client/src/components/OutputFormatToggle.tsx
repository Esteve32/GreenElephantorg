import { useState } from "react";
import { FileText, Code, Type } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type OutputFormat = "rich" | "plain" | "machine";

interface OutputFormatToggleProps {
  value: OutputFormat;
  onChange: (format: OutputFormat) => void;
}

const formats: { key: OutputFormat; label: string; icon: typeof FileText; desc: string }[] = [
  { key: "rich", label: "Rich Text", icon: FileText, desc: "Formatted with headings, bold, and structure" },
  { key: "plain", label: "Plain Text", icon: Type, desc: "Raw text without formatting — paste anywhere" },
  { key: "machine", label: "Machine", icon: Code, desc: "Structured JSON for automation and APIs" },
];

export function OutputFormatToggle({ value, onChange }: OutputFormatToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-muted/20 p-0.5" data-testid="output-format-toggle">
      {formats.map((f) => {
        const Icon = f.icon;
        const active = value === f.key;
        return (
          <Tooltip key={f.key}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onChange(f.key)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all duration-150 ${
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
                data-testid={`button-format-${f.key}`}
              >
                <Icon className="w-3 h-3" />
                <span>{f.label}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{f.desc}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

export function formatContent(content: string, format: OutputFormat, structuredData?: Record<string, unknown>): string {
  if (format === "machine") {
    if (structuredData) {
      return JSON.stringify(structuredData, null, 2);
    }
    return JSON.stringify({ content, generatedAt: new Date().toISOString() }, null, 2);
  }
  if (format === "plain") {
    return content
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/---/g, "")
      .replace(/\n{3,}/g, "\n\n");
  }
  return content;
}

export function useOutputFormat(defaultFormat: OutputFormat = "rich") {
  const [outputFormat, setOutputFormat] = useState<OutputFormat>(defaultFormat);
  return { outputFormat, setOutputFormat };
}
