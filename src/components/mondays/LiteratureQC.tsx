import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CitedText } from "./CitedText";

interface LiteratureQCProps {
  loading: boolean;
  isGenerating: boolean;
  noveltyText: string;
  sources: Array<{ id: number; title: string; url: string }>;
}

export function LiteratureQC({
  loading,
  isGenerating,
  noveltyText,
  sources,
}: LiteratureQCProps) {
  const trimmedText = noveltyText.trim();
  const isNovel = trimmedText.startsWith("NOVEL:");
  const isPartiallyNovel = trimmedText.startsWith("PARTIALLY NOVEL:");
  const isEstablished = trimmedText.startsWith("ESTABLISHED:");
  const body = trimmedText
    .replace(/^NOVEL:\s*/i, "")
    .replace(/^PARTIALLY NOVEL:\s*/i, "")
    .replace(/^ESTABLISHED:\s*/i, "");

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="font-serif text-xl">Literature QC</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isNovel ? (
          <Badge className="bg-status-green-soft text-status-green border-status-green/20">
            Novel
          </Badge>
        ) : isPartiallyNovel ? (
          <Badge className="bg-status-yellow-soft text-status-yellow border-status-yellow/20">
            Partially novel
          </Badge>
        ) : isEstablished ? (
          <Badge variant="secondary">Already established</Badge>
        ) : isGenerating ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
            Assessing novelty…
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Novelty assessment will appear here.
          </p>
        )}
        <CitedText
          text={body}
          sources={sources}
          className="whitespace-pre-wrap text-sm leading-relaxed text-foreground mt-2"
        />
      </CardContent>
    </Card>
  );
}
