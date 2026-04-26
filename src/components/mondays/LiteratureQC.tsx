import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type QCStatus = "green" | "yellow" | "red";

export interface Paper {
  title: string;
  url: string;
  source?: string;
}

interface LiteratureQCProps {
  loading: boolean;
  status?: QCStatus;
  summary?: string;
  papers?: Paper[];
}

const statusConfig: Record<
  QCStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  green: {
    label: "Well-supported",
    dot: "bg-status-green",
    bg: "bg-status-green-soft",
    text: "text-status-green",
  },
  yellow: {
    label: "Mixed evidence",
    dot: "bg-status-yellow",
    bg: "bg-status-yellow-soft",
    text: "text-status-yellow",
  },
  red: {
    label: "Contradicted",
    dot: "bg-status-red",
    bg: "bg-status-red-soft",
    text: "text-status-red",
  },
};

export function LiteratureQC({ loading, status, summary, papers }: LiteratureQCProps) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="font-serif text-xl">Literature QC</CardTitle>
          {!loading && status && (
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${statusConfig[status].bg} ${statusConfig[status].text}`}
            >
              <span className={`h-2 w-2 rounded-full ${statusConfig[status].dot}`} />
              {statusConfig[status].label}
            </span>
          )}
          {loading && <Skeleton className="h-6 w-32 rounded-full" />}
        </div>
        {loading ? (
          <div className="space-y-2 pt-1">
            <Skeleton className="h-3 w-full skeleton-shimmer" />
            <Skeleton className="h-3 w-4/5 skeleton-shimmer" />
          </div>
        ) : (
          summary && (
            <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
          )
        )}
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-border/70">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="py-3 first:pt-0 last:pb-0 space-y-2">
                  <Skeleton className="h-4 w-3/4 skeleton-shimmer" />
                  <Skeleton className="h-3 w-1/3 skeleton-shimmer" />
                </li>
              ))
            : papers?.map((p) => (
                <li key={p.url} className="py-3 first:pt-0 last:pb-0">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                        {p.title}
                      </p>
                      {p.source && (
                        <p className="text-xs text-muted-foreground">{p.source}</p>
                      )}
                    </div>
                    <ExternalLink className="h-4 w-4 mt-1 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                  </a>
                </li>
              ))}
        </ul>
      </CardContent>
    </Card>
  );
}
