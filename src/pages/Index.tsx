import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ExperimentPlan } from "@/components/mondays/ExperimentPlan";
import { LiteratureQC } from "@/components/mondays/LiteratureQC";
import { TrustPanel } from "@/components/mondays/TrustPanel";

const PLACEHOLDER =
  "e.g. Replacing sucrose with trehalose as a cryoprotectant will increase post-thaw viability of HeLa cells by 15 percentage points compared to DMSO.";

const Index = () => {
  const [hypothesis, setHypothesis] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [protocolText, setProtocolText] = useState("");
  const [materialsText, setMaterialsText] = useState("");
  const [budgetText, setBudgetText] = useState("");
  const [timelineText, setTimelineText] = useState("");
  const [validationText, setValidationText] = useState("");
  const [noveltyText, setNoveltyText] = useState("");
  const [sources, setSources] = useState<Array<{ id: number; title: string; url: string }>>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const resultsRef = useRef<HTMLElement | null>(null);

  const buildMarkdown = () => {
    const lines: string[] = [];
    lines.push("# Nexperiment Plan\n");
    lines.push(`## Hypothesis\n${hypothesis}\n`);
    if (noveltyText) lines.push(`## Literature QC — Novelty\n${noveltyText}\n`);
    if (protocolText) lines.push(`## Protocol\n${protocolText}\n`);
    if (materialsText) lines.push(`## Materials\n${materialsText}\n`);
    if (budgetText) lines.push(`## Budget\n${budgetText}\n`);
    if (timelineText) lines.push(`## Timeline\n${timelineText}\n`);
    if (validationText) lines.push(`## Validation & Controls\n${validationText}\n`);
    if (sources.length) {
      lines.push("## Sources");
      sources.forEach((s) => lines.push(`- [${s.id}] ${s.title} — ${s.url}`));
    }
    return lines.join("\n");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async () => {
    if (!hypothesis.trim()) return;

    setShowResults(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    setIsGenerating(true);
    setProtocolText("");
    setMaterialsText("");
    setBudgetText("");
    setTimelineText("");
    setValidationText("");
    setNoveltyText("");
    setSources([]);
    setErrorMessage("");

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hypothesis: hypothesis.trim() }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const rawEvent of events) {
          const lines = rawEvent
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);
          if (lines.length === 0) continue;

          const eventLine = lines.find((line) => line.startsWith("event:"));
          const dataLine = lines.find((line) => line.startsWith("data:"));
          if (!eventLine || !dataLine) continue;

          const eventType = eventLine.slice("event:".length).trim();
          const jsonPayload = dataLine.slice("data:".length).trim();

          try {
            const parsed = JSON.parse(jsonPayload);

            if (eventType === "source") {
              const source = parsed as { id: number; title: string; url: string };
              setSources((prev) => {
                if (prev.some((item) => item.id === source.id || item.url === source.url)) {
                  return prev;
                }
                return [...prev, source];
              });
            }

            if (eventType === "text" && typeof parsed?.chunk === "string") {
              setProtocolText((prev) => prev + parsed.chunk);
            }
            if (eventType === "materials" && typeof parsed?.chunk === "string") {
              setMaterialsText((prev) => prev + parsed.chunk);
            }
            if (eventType === "budget" && typeof parsed?.chunk === "string") {
              setBudgetText((prev) => prev + parsed.chunk);
            }
            if (eventType === "timeline" && typeof parsed?.chunk === "string") {
              setTimelineText((prev) => prev + parsed.chunk);
            }
            if (eventType === "validation" && typeof parsed?.chunk === "string") {
              setValidationText((prev) => prev + parsed.chunk);
            }
            if (eventType === "novelty" && typeof parsed?.chunk === "string") {
              setNoveltyText((prev) => prev + parsed.chunk);
            }
          } catch {
            // Ignore malformed SSE payload chunks and continue streaming.
          }
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate plan";
      console.error(error);
      setErrorMessage(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:px-8">
        {/* Header */}
        <header className="text-center max-w-2xl mx-auto">
          <h1 className="font-serif text-5xl sm:text-6xl font-semibold text-foreground tracking-tight">
            Nexperiment
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            From hypothesis to runnable experiment plan in 90 seconds.
          </p>
        </header>

        {/* Input */}
        <section className="mt-12 max-w-3xl mx-auto">
          <label
            htmlFor="hypothesis"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Your hypothesis
          </label>
          <Textarea
            id="hypothesis"
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={6}
            className="resize-none bg-card border-border/70 text-base leading-relaxed p-5 shadow-sm focus-visible:ring-accent focus-visible:ring-offset-0"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground self-center mr-1">Try:</span>
            {[
              "Replacing sucrose with trehalose as a cryoprotectant in the freezing medium will increase post-thaw viability of HeLa cells by at least 15 percentage points compared to the standard DMSO protocol.",
              "Daily oral administration of 500 mg curcumin will reduce serum CRP levels in adults with mild rheumatoid arthritis by 20% over 8 weeks compared to placebo.",
              "CRISPR-Cas9 knockout of the SIRT3 gene in HEK293 cells will reduce mitochondrial membrane potential by at least 25% under oxidative stress.",
            ].map((h, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setHypothesis(h)}
                disabled={isGenerating}
                className="text-xs px-3 py-1.5 rounded-full border border-border/70 bg-card hover:bg-accent/10 hover:border-accent/50 text-muted-foreground transition-colors disabled:opacity-50"
              >
                Example {i + 1}
              </button>
            ))}
          </div>
          <div className="mt-5 flex justify-end">
            <Button
              onClick={handleGenerate}
              size="lg"
              disabled={isGenerating}
              className="bg-foreground text-background hover:bg-foreground/90 font-medium px-6"
            >
              {isGenerating ? "Generating plan…" : <>Generate plan <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
          </div>
          {errorMessage && (
            <p className="mt-3 text-sm text-destructive">{errorMessage}</p>
          )}
        </section>

        {/* Results */}
        {showResults && (
          <section ref={resultsRef} className="mt-16">
            <div className="mb-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={isGenerating || !protocolText}
              >
                {copied ? "Copied!" : "Copy plan as Markdown"}
              </Button>
            </div>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <LiteratureQC
                loading={isGenerating}
                isGenerating={isGenerating}
                noveltyText={noveltyText}
                sources={sources}
              />
              <ExperimentPlan
                loading={isGenerating}
                isGenerating={isGenerating}
                protocolText={protocolText}
                materialsText={materialsText}
                budgetText={budgetText}
                timelineText={timelineText}
                validationText={validationText}
                sources={sources}
              />
            </div>
            <aside>
              <TrustPanel
                loading={isGenerating}
                sources={sources.map((source) => ({
                  url: source.url,
                  label: source.title,
                }))}
              />
            </aside>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-border/70 text-center">
          <p className="text-xs text-muted-foreground">
            Nexperiment · Designed for working scientists.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Index;
