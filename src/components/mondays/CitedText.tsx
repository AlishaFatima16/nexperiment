import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ExternalLink } from "lucide-react";

type Source = { id: number; title: string; url: string };

type CitedTextProps = {
  text: string;
  sources: Source[];
  className?: string;
};

export function CitedText({ text, sources, className }: CitedTextProps) {
  if (!text) return null;
  const sourceById = new Map(sources.map((s) => [s.id, s]));
  const parts = text.split(/(\[\d+(?:\s*,\s*\d+)*\])/g);
  return (
    <div className={className}>
      {parts.map((part, idx) => {
        const match = part.match(/^\[(\d+(?:\s*,\s*\d+)*)\]$/);
        if (!match) return <span key={idx}>{part}</span>;
        const ids = match[1].split(",").map((s) => parseInt(s.trim(), 10));
        return (
          <span key={idx} className="inline-flex flex-wrap gap-0.5">
            [
            {ids.map((id, i) => {
              const src = sourceById.get(id);
              const inner = (
                <span className="inline-flex items-center justify-center min-w-[1.5em] px-1 text-[0.7em] font-semibold rounded-sm bg-accent/15 text-accent-foreground hover:bg-accent/30 cursor-pointer transition-colors">
                  {id}
                </span>
              );
              return (
                <span key={i}>
                  {i > 0 && <span className="mx-0.5">,</span>}
                  {src ? (
                    <HoverCard openDelay={120} closeDelay={80}>
                      <HoverCardTrigger asChild>{inner}</HoverCardTrigger>
                      <HoverCardContent side="top" className="w-80 text-xs">
                        <p className="font-medium leading-snug mb-2">
                          {src.title}
                        </p>
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-accent hover:underline"
                        >
                          Open paper <ExternalLink className="h-3 w-3" />
                        </a>
                      </HoverCardContent>
                    </HoverCard>
                  ) : (
                    inner
                  )}
                </span>
              );
            })}
            ]
          </span>
        );
      })}
    </div>
  );
}
