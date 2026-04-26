import { Beaker, Boxes, Calendar, ClipboardCheck, Coins, Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ExperimentPlanProps {
  loading: boolean;
}

const sections = [
  { id: "protocol", label: "Protocol", icon: Beaker },
  { id: "materials", label: "Materials", icon: Boxes },
  { id: "budget", label: "Budget", icon: Coins },
  { id: "timeline", label: "Timeline", icon: Calendar },
  { id: "validation", label: "Validation", icon: ClipboardCheck },
];

function GeneratingState() {
  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
        Generating…
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full skeleton-shimmer" />
        <Skeleton className="h-3 w-11/12 skeleton-shimmer" />
        <Skeleton className="h-3 w-4/5 skeleton-shimmer" />
        <Skeleton className="h-3 w-2/3 skeleton-shimmer" />
      </div>
    </div>
  );
}

export function ExperimentPlan({ loading }: ExperimentPlanProps) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-serif text-xl">Experiment Plan</CardTitle>
        <p className="text-sm text-muted-foreground">
          A runnable plan, broken into the parts a bench scientist actually needs.
        </p>
      </CardHeader>
      <CardContent>
        <Accordion
          type="multiple"
          defaultValue={loading ? ["protocol"] : sections.map((s) => s.id)}
          className="w-full"
        >
          {sections.map(({ id, label, icon: Icon }) => (
            <AccordionItem key={id} value={id} className="border-border/70">
              <AccordionTrigger className="hover:no-underline group py-4">
                <span className="flex items-center gap-3 text-left">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-soft text-accent">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-medium text-foreground">{label}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-11 pr-2">
                {loading ? (
                  <GeneratingState />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {label} details will appear here once a hypothesis is processed.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
