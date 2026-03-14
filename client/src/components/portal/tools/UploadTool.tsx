import { useState, useRef, useCallback } from "react";
import { Upload, FileText, Image, Mic, Link2, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface UploadToolProps {
  onSaveToTimeline?: (event: { type: string; title: string; description: string; details?: string; toolId?: string }) => void;
}

type InputMode = "file" | "text" | "url";

const FILE_ICONS: Record<string, React.ElementType> = {
  pdf: FileText,
  txt: FileText,
  doc: FileText,
  docx: FileText,
  png: Image,
  jpg: Image,
  jpeg: Image,
  webp: Image,
};

export function UploadTool({ onSaveToTimeline }: UploadToolProps) {
  const [mode, setMode] = useState<InputMode>("file");
  const [files, setFiles] = useState<File[]>([]);
  const [textContent, setTextContent] = useState("");
  const [urlContent, setUrlContent] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const getFileExt = (name: string) => name.split(".").pop()?.toLowerCase() || "";

  const handleUpload = useCallback(() => {
    const hasContent = files.length > 0 || textContent.trim() || urlContent.trim();
    if (!hasContent) {
      toast({ title: "Nothing to upload", description: "Add files, paste text, or enter a URL first.", variant: "destructive" });
      return;
    }

    let title = "Data Upload";
    let description = "";

    if (files.length > 0) {
      title = files.length === 1 ? files[0].name : `${files.length} files uploaded`;
      description = files.map((f) => f.name).join(", ");
    } else if (textContent.trim()) {
      title = "Text Note";
      description = textContent.trim().slice(0, 120);
    } else if (urlContent.trim()) {
      title = "Link Added";
      description = urlContent.trim();
    }

    setUploaded(true);
    toast({ title: "Saved to timeline", description: title });

    if (onSaveToTimeline) {
      const details = textContent.trim() || urlContent.trim() || undefined;
      onSaveToTimeline({ type: "upload", title, description, details, toolId: "upload" });
    }
  }, [files, textContent, urlContent, toast, onSaveToTimeline]);

  if (uploaded) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center bg-[#009999]/15 border border-[#009999]/30">
          <CheckCircle2 className="w-6 h-6 text-[#009999]" />
        </div>
        <p className="text-sm text-white/70">Saved to your timeline</p>
        <Button
          variant="ghost"
          className="text-[#009999]"
          onClick={() => { setUploaded(false); setFiles([]); setTextContent(""); setUrlContent(""); }}
          data-testid="button-upload-another"
        >
          Upload another
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5">
        {(["file", "text", "url"] as InputMode[]).map((m) => {
          const icons = { file: Upload, text: FileText, url: Link2 };
          const labels = { file: "File", text: "Paste Text", url: "URL" };
          const ModeIcon = icons[m];
          return (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                mode === m
                  ? "bg-[#009999]/15 text-[#009999] border border-[#009999]/30"
                  : "bg-white/[0.03] text-white/40 border border-white/5"
              }`}
              data-testid={`button-mode-${m}`}
            >
              <ModeIcon className="w-3.5 h-3.5" />
              {labels[m]}
            </button>
          );
        })}
      </div>

      {mode === "file" && (
        <>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`min-h-[100px] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
              isDragOver
                ? "border-[#009999]/50 bg-[#009999]/10"
                : "border-white/10 bg-white/[0.02] hover:border-white/20"
            }`}
            data-testid="upload-drop-zone"
          >
            <Upload className="w-5 h-5 text-white/30" />
            <p className="text-xs text-white/30">
              {isDragOver ? "Drop files here" : "Drag files here or tap to browse"}
            </p>
            <p className="text-xs text-white/20">PDF, text, images, audio</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg,.webp,.mp3,.wav,.m4a"
            className="hidden"
            onChange={handleFileSelect}
            data-testid="input-file-upload"
          />
          {files.length > 0 && (
            <div className="space-y-1.5">
              {files.map((file, i) => {
                const ext = getFileExt(file.name);
                const IconComp = FILE_ICONS[ext] || FileText;
                return (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/5">
                    <IconComp className="w-4 h-4 text-white/40 shrink-0" />
                    <span className="text-xs text-white/60 truncate flex-1">{file.name}</span>
                    <span className="text-xs text-white/20">{(file.size / 1024).toFixed(0)}KB</span>
                    <button onClick={() => removeFile(i)} className="text-white/20 hover:text-white/40" data-testid={`button-remove-file-${i}`}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {mode === "text" && (
        <Textarea
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="Paste meeting notes, coaching reflections, scan results, or any text..."
          className="min-h-[120px] bg-white/[0.03] border-white/10 text-white/80 placeholder:text-white/20 text-sm resize-none"
          data-testid="input-text-paste"
        />
      )}

      {mode === "url" && (
        <div className="space-y-2">
          <input
            type="url"
            value={urlContent}
            onChange={(e) => setUrlContent(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-white/80 text-sm placeholder:text-white/20 outline-none focus:border-[#009999]/30"
            data-testid="input-url"
          />
          <p className="text-xs text-white/20">Link to a document, recording, or resource</p>
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={files.length === 0 && !textContent.trim() && !urlContent.trim()}
        className="w-full bg-[#009999] text-white border-[#009999]/30"
        data-testid="button-upload-save"
      >
        Save to Timeline
      </Button>
    </div>
  );
}
