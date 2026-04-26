import { useState } from "react";
import { ChevronDown, Link2, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export interface Source {
  url: string;
  label?: string;
}

interface TrustPanelProps {
  loading: boolean;
  sources?: Source[];
}

export function TrustPanel({ loading, sources = [] }: TrustPanelProps) {
  const [open, setOpen] = useState(true);

  return (
    <Card className="border-border/70 shadow-sm lg:sticky lg:top-8">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif text-lg flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent" />
            Trust panel
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden h-8 px-2"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${open ? "" : "-rotate-90"}`}
            />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Sources cited as the plan is built.
        </p>
      </CardHeader>
      <CardContent className={`${open ? "block" : "hidden"} lg:block`}>
        {loading && sources.length === 0 ? (
          <ul className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="flex items-center gap-2">
                <Skeleton className="h-3.5 w-3.5 rounded-sm skeleton-shimmer" />
                <Skeleton className="h-3 flex-1 skeleton-shimmer" />
              </li>
            ))}
          </ul>
        ) : sources.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No sources yet. Generate a plan to start citing.
          </p>
        ) : (
          <ul className="space-y-3">
            {sources.map((s) => (
              <li key={s.url} className="flex items-start gap-2">
                <Link2 className="h-3.5 w-3.5 mt-1 text-accent shrink-0" />
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-foreground hover:text-accent transition-colors break-all leading-snug"
                >
                  {s.label ?? s.url}
                </a>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
