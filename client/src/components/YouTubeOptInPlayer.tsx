import { useId, useState } from "react";
import { Play, X } from "lucide-react";

interface YouTubeOptInPlayerProps {
  title: string;
  youtubeId: string;
  className?: string;
  testId?: string;
}

export function YouTubeOptInPlayer({
  title,
  youtubeId,
  className = "",
  testId,
}: YouTubeOptInPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const disclosureId = useId();

  return (
    <div
      className={`relative aspect-video overflow-hidden rounded-lg bg-black ${className}`}
      role="group"
      aria-label={`${title} video player`}
    >
      {isLoaded ? (
        <>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
            data-testid={testId}
          />
          <button
            type="button"
            onClick={() => setIsLoaded(false)}
            aria-label={`Close and unload ${title} video`}
            className="absolute right-2 top-2 z-10 inline-flex min-h-9 items-center gap-1.5 rounded-md bg-black/85 px-3 text-sm font-medium text-white underline-offset-4 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X aria-hidden="true" className="h-4 w-4" />
            Close video
          </button>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center text-white">
          <p id={disclosureId} className="max-w-sm text-sm leading-relaxed text-white/80">
            Playing loads YouTube and may set cookies.
          </p>
          <button
            type="button"
            onClick={() => setIsLoaded(true)}
            aria-describedby={disclosureId}
            className="inline-flex min-h-10 items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <Play aria-hidden="true" className="h-4 w-4 fill-current" />
            Load and play video
          </button>
        </div>
      )}
    </div>
  );
}
