import { useState } from "react";
import { Layers, Filter, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
  {
    id: "ground-truth",
    label: "Ground Truth",
    description: "What actually exists or happened",
    question: "What is the underlying reality?",
    icon: Layers,
    color: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/50",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "filter",
    label: "The Filter",
    description: "What gets projected, disclosed, or suppressed",
    question: "What mechanisms shape what we see?",
    icon: Filter,
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/50",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "observer",
    label: "Observer Assumptions",
    description: "The interpretive lens that shapes conclusions",
    question: "What do we believe that may not be true?",
    icon: Eye,
    color: "from-indigo-500/20 to-purple-500/20",
    borderColor: "border-indigo-500/50",
    iconBg: "bg-indigo-500/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
];

export function ThreeTierFramework() {
  const [expandedTier, setExpandedTier] = useState<string | null>(null);

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold mb-6 text-center">The 3-Tier Analytical Model</h2>
      
      <div className="relative max-w-2xl mx-auto">
        {/* Stack from top (observer) to bottom (ground truth) */}
        <div className="space-y-4">
          {[...tiers].reverse().map((tier, index) => {
            const Icon = tier.icon;
            const isExpanded = expandedTier === tier.id;
            
            return (
              <div
                key={tier.id}
                className={cn(
                  "relative rounded-xl border-2 p-6 transition-all duration-300 cursor-pointer",
                  `bg-gradient-to-r ${tier.color}`,
                  tier.borderColor,
                  isExpanded && "scale-105 shadow-lg z-10",
                  !isExpanded && "hover:scale-[1.02]"
                )}
                onClick={() => setExpandedTier(isExpanded ? null : tier.id)}
                style={{ 
                  marginLeft: `${(2 - index) * 12}px`,
                  marginRight: `${(2 - index) * 12}px`
                }}
              >
                <div className="flex items-start gap-4">
                  <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center shrink-0", tier.iconBg)}>
                    <Icon className={cn("w-6 h-6", tier.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1">{tier.label}</h3>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <p className="text-sm font-medium text-foreground">Key Question:</p>
                        <p className="text-sm italic text-muted-foreground mt-1">{tier.question}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Connecting lines */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500/30 via-amber-500/30 to-emerald-500/30 -translate-x-1/2 -z-10" />
      </div>

      {/* Key Insight */}
      <div className="mt-8 max-w-2xl mx-auto bg-primary/5 border border-primary/20 rounded-xl p-6">
        <p className="text-sm leading-relaxed text-center">
          <span className="font-semibold text-primary">The analyst's challenge:</span>{" "}
          <span className="text-muted-foreground">
            Work backward from observable information, through the filter, to approximate ground truth—while questioning your own assumptions.
          </span>
        </p>
      </div>
    </section>
  );
}
