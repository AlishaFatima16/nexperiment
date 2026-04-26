import { useState } from "react";
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

  const handleGenerate = () => {
    if (!hypothesis.trim()) return;
    setShowResults(true);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:px-8">
        {/* Header */}
        <header className="text-center max-w-2xl mx-auto">
          <h1 className="font-serif text-5xl sm:text-6xl font-semibold text-foreground tracking-tight">
            Mondays
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
          <div className="mt-5 flex justify-end">
            <Button
              onClick={handleGenerate}
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 font-medium px-6"
            >
              Generate plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Results */}
        {showResults && (
          <section className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <LiteratureQC loading={true} />
              <ExperimentPlan loading={true} />
            </div>
            <aside>
              <TrustPanel loading={true} />
            </aside>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-border/70 text-center">
          <p className="text-xs text-muted-foreground">
            Mondays · Designed for working scientists.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Index;
