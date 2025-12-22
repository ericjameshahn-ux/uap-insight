import { useState } from "react";
import { Lock, GraduationCap, Scale, Building, Briefcase, DollarSign, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FilterMechanism {
  id: string;
  title: string;
  year: string;
  badge: "HIGH" | "MEDIUM" | "LOWER";
  icon: React.ElementType;
  summary: string;
  details: string[];
}

const mechanisms: FilterMechanism[] = [
  {
    id: "robertson",
    title: "Robertson Panel",
    year: "1953",
    badge: "HIGH",
    icon: Lock,
    summary: 'CIA recommended "public education campaign to reduce interest"',
    details: [
      '"Debunking" using Disney, celebrities, mass media',
      'Monitor civilian groups for "subversive purposes"',
      "Led to AFR 200-2, JANAP 146 penalties",
      "Declassified 1975—culture of ridicule already established",
    ],
  },
  {
    id: "condon",
    title: "Condon Report",
    year: "1969",
    badge: "HIGH",
    icon: GraduationCap,
    summary: 'Recommended teachers "refrain from giving students credit" for UFO work',
    details: [
      "Created 50+ years of academic stigma",
      "Ended federal research funding",
      'Self-fulfilling prophecy: "not scientific" → no study → no data',
    ],
  },
  {
    id: "legal",
    title: "Legal Barriers (Perceived vs. Real)",
    year: "2025",
    badge: "HIGH",
    icon: Scale,
    summary: '"No person has ever been prosecuted for disclosing to Congress in private"',
    details: [
      "SF-312 NDAs explicitly preserve Congressional disclosure rights",
      "Classification not binding on Congress (50 USC 3161(a))",
      "Constitutional immunity exists (Gravel v. United States)",
      "Fear persists despite legal protections—perception-based control",
    ],
  },
  {
    id: "aaro",
    title: "Institutional Non-Compliance",
    year: "Ongoing",
    badge: "HIGH",
    icon: Building,
    summary: 'AARO mandate to "evaluate threat" unfulfilled',
    details: [
      "50 USC 3373(c)(5) requires threat evaluation",
      "No public assessment produced",
      "DoD IG concerns about cooperation",
      "Pattern of slow-rolling disclosure",
    ],
  },
  {
    id: "privatization",
    title: "Privatization Shield",
    year: "2023",
    badge: "MEDIUM",
    icon: Briefcase,
    summary: "Schumer Amendment included eminent domain over private materials",
    details: [
      "Language confirms belief materials are in private hands",
      "Aerospace lobby killed provisions",
      '"Waived" SAP structures bypass oversight',
      'Government claims "no evidence" while contractors claim "proprietary"',
    ],
  },
  {
    id: "fiscal",
    title: "Fiscal Opacity",
    year: "2018",
    badge: "MEDIUM",
    icon: DollarSign,
    summary: 'FASAB Statement 56 allows agencies to "misrepresent" financials',
    details: [
      'Approved obfuscation for "national security"',
      "$21 trillion in unsupported adjustments documented",
      "Makes programs effectively unauditable",
    ],
  },
];

const badgeColors = {
  HIGH: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  MEDIUM: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  LOWER: "bg-slate-500/10 text-slate-600 border-slate-500/20",
};

export function FilterMechanismCards() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold mb-2 text-center">The UAP Filter: Documented Mechanisms</h2>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        These aren't theories—they're documented policies and patterns that have shaped what information reaches the public.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mechanisms.map((mechanism) => {
          const Icon = mechanism.icon;
          const isExpanded = expanded === mechanism.id;

          return (
            <div
              key={mechanism.id}
              className={cn(
                "card-elevated overflow-hidden transition-all duration-200",
                isExpanded && "ring-2 ring-primary/50"
              )}
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : mechanism.id)}
                className="w-full text-left"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm">{mechanism.title}</h3>
                        <Badge variant="outline" className={cn("text-[10px]", badgeColors[mechanism.badge])}>
                          {mechanism.badge}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{mechanism.year}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{mechanism.summary}</p>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-border">
                  <ul className="space-y-2">
                    {mechanism.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
