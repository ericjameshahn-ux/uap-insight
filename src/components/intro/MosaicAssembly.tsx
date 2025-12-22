import { useState } from "react";
import { Calendar, Lock, Rocket, Zap, Globe, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MosaicClaim {
  text: string;
  tier: "HIGH" | "MEDIUM" | "LOWER";
}

interface MosaicCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  claims: MosaicClaim[];
}

const categories: MosaicCategory[] = [
  {
    id: "timeline",
    title: "Timeline & Origin",
    icon: Calendar,
    color: "text-blue-500",
    claims: [
      { text: "Discovered as early as 1933 (Magenta, Italy)", tier: "MEDIUM" },
      { text: "Studied since at least 1947 (Roswell era)", tier: "HIGH" },
      { text: 'Characterized as "real and not visionary" (Twining memo)', tier: "HIGH" },
    ],
  },
  {
    id: "secrecy",
    title: "Secrecy Structure",
    icon: Lock,
    color: "text-amber-500",
    claims: [
      { text: '"Manhattan Project 2.0 on steroids" treatment', tier: "MEDIUM" },
      { text: "Compartmentalized beyond presidential knowledge", tier: "MEDIUM" },
      { text: "Hidden from Congress using SAP structures", tier: "HIGH" },
      { text: "Split between government and private contractors", tier: "HIGH" },
    ],
  },
  {
    id: "retrieval",
    title: "Retrieval & Possession",
    icon: Rocket,
    color: "text-emerald-500",
    claims: [
      { text: "Crash retrieval programs exist (ICIG-validated)", tier: "HIGH" },
      { text: '"Craft of unknown origin" in possession (DOPSR-cleared)', tier: "HIGH" },
      { text: '"Non-human biologics" recovered', tier: "MEDIUM" },
      { text: "Reverse engineering ongoing", tier: "MEDIUM" },
    ],
  },
  {
    id: "physics",
    title: "Physics & Capabilities",
    icon: Zap,
    color: "text-purple-500",
    claims: [
      { text: '"Five Observables" documented (anti-gravity, instant accel, etc.)', tier: "HIGH" },
      { text: "Speeds exceeding 24,000 mph (Nimitz radar)", tier: "HIGH" },
      { text: "No visible propulsion or control surfaces", tier: "HIGH" },
      { text: "Power source as critical technology", tier: "MEDIUM" },
    ],
  },
  {
    id: "international",
    title: "International Dimensions",
    icon: Globe,
    color: "text-teal-500",
    claims: [
      { text: "All major powers maintain identical secrecy", tier: "HIGH" },
      { text: "No nation claims first-mover advantage", tier: "HIGH" },
      { text: 'Game theory equilibrium at "don\'t disclose"', tier: "MEDIUM" },
    ],
  },
];

const tierColors = {
  HIGH: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  MEDIUM: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  LOWER: "bg-slate-500/10 text-slate-600 border-slate-500/20",
};

export function MosaicAssembly() {
  const [expanded, setExpanded] = useState<string[]>(["timeline"]);

  const toggleCategory = (id: string) => {
    setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold mb-2 text-center">The UAP Mosaic: All Pieces on the Table</h2>
      <p className="text-muted-foreground text-center mb-4 max-w-2xl mx-auto">
        When you lay all the pieces on the table, what picture emerges?
      </p>
      <p className="text-sm text-muted-foreground text-center mb-8 max-w-2xl mx-auto italic">
        We're not asking you to accept any single claim. We're asking: What would it look like if a program existed that was...
      </p>

      <div className="space-y-3 max-w-3xl mx-auto">
        {categories.map((category) => {
          const Icon = category.icon;
          const isExpanded = expanded.includes(category.id);

          return (
            <div key={category.id} className="card-elevated overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("w-5 h-5", category.color)} />
                  <span className="font-medium">{category.title}</span>
                  <span className="text-xs text-muted-foreground">({category.claims.length} claims)</span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-border">
                  <div className="grid gap-2">
                    {category.claims.map((claim, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                      >
                        <span className="flex-1 text-sm">{claim.text}</span>
                        <Badge variant="outline" className={cn("text-[10px] shrink-0", tierColors[claim.tier])}>
                          {claim.tier}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
