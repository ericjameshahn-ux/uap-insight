import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export interface HistoricalExample {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  groundTruth: string[];
  filter: string[];
  assumptions: { assumption: string; reality: string }[];
  immersionScenarios: ImmersionScenario[];
  keyInsight?: string;
}

export interface ImmersionScenario {
  title: string;
  icon: string;
  content: string;
  keyQuestion: string;
}

interface Props {
  example: HistoricalExample;
}

export function HistoricalExampleCard({ example }: Props) {
  const [expandedScenario, setExpandedScenario] = useState<number | null>(null);

  return (
    <div className="card-elevated overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold mb-1">{example.title}</h3>
            <p className="text-sm text-muted-foreground">{example.subtitle}</p>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 shrink-0">
            {example.badge}
          </Badge>
        </div>
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="ground-truth" className="p-6">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="ground-truth" className="text-xs sm:text-sm">Ground Truth</TabsTrigger>
          <TabsTrigger value="filter" className="text-xs sm:text-sm">The Filter</TabsTrigger>
          <TabsTrigger value="assumptions" className="text-xs sm:text-sm">Assumptions</TabsTrigger>
        </TabsList>

        <TabsContent value="ground-truth" className="mt-0">
          <ul className="space-y-2">
            {example.groundTruth.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="filter" className="mt-0">
          <ul className="space-y-2">
            {example.filter.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="assumptions" className="mt-0">
          <div className="space-y-3">
            {example.assumptions.map((item, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-lg text-sm">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Assumption</span>
                  <span className="line-through text-muted-foreground">{item.assumption}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-primary block mb-1">Reality</span>
                  <span>{item.reality}</span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Key Insight */}
      {example.keyInsight && (
        <div className="px-6 pb-6">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">{example.keyInsight}</p>
          </div>
        </div>
      )}

      {/* Immersion Scenarios */}
      {example.immersionScenarios.length > 0 && (
        <div className="border-t border-border p-6 space-y-4">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Immersion Scenarios</h4>
          {example.immersionScenarios.map((scenario, i) => (
            <div
              key={i}
              className={cn(
                "border rounded-lg overflow-hidden transition-all",
                "bg-gradient-to-r from-slate-900/5 to-slate-800/5 dark:from-slate-100/5 dark:to-slate-200/5",
                "border-slate-300 dark:border-slate-700"
              )}
            >
              <button
                onClick={() => setExpandedScenario(expandedScenario === i ? null : i)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{scenario.icon}</span>
                  <span className="font-medium text-sm">{scenario.title}</span>
                </div>
                {expandedScenario === i ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              
              {expandedScenario === i && (
                <div className="px-4 pb-4 space-y-4">
                  <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                    {scenario.content}
                  </p>
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                    <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">The Key Question</p>
                    <p className="text-sm font-medium">{scenario.keyQuestion}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
