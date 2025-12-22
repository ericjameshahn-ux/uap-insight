import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Assumption {
  id: string;
  assumption: string;
  counter: string;
  parallel?: string;
  evidence?: string[];
  quote?: { text: string; source: string };
}

const assumptions: Assumption[] = [
  {
    id: "know",
    assumption: "If it were real, we'd know by now",
    counter: "70+ years of documented suppression mechanisms",
    parallel: "Manhattan Project kept secret 3+ years with 120,000 workers",
    evidence: [
      "Robertson Panel (1953) explicitly recommended public debunking",
      "Condon Report (1969) created academic stigma",
      "FASAB Statement 56 enables financial obfuscation",
    ],
  },
  {
    id: "secrets",
    assumption: "Government can't keep secrets that long",
    counter: "NSA secret 23 years, NRO secret 31 years, stealth programs decades",
    parallel: "Cold War secrets still emerging today",
    evidence: [
      "NSA existence classified 1952-1975 (23 years)",
      "NRO existence classified 1961-1992 (31 years)",
      "F-117 Nighthawk secret for over a decade",
    ],
  },
  {
    id: "scientists",
    assumption: "Scientists would have proven it",
    counter: "Condon Report explicitly discouraged research for 50+ years",
    parallel: "Academic topics can be systematically suppressed",
    evidence: [
      'Condon recommended no credit for UFO "science fair projects"',
      "No federal research funding since 1969",
      "Career consequences for academics who engage",
    ],
  },
  {
    id: "credible",
    assumption: "Credible people don't believe this",
    counter: "DNIs, Presidents, Senators, NASA Administrator on record",
    quote: {
      text: "Hair stood up on the back of my neck",
      source: "NASA Administrator Bill Nelson, on pilot encounters",
    },
    evidence: [
      "Former DNI John Ratcliffe confirmed unexplained cases",
      "Presidents Carter, Reagan, Clinton expressed interest",
      "Senators Rubio, Gillibrand, Schumer championing disclosure",
    ],
  },
  {
    id: "threats",
    assumption: "We'd respond to threats differently",
    counter: "AARO mandate unfulfilled despite 11 documented near-misses with aircraft",
    parallel: "Institutional inertia documented in multiple oversight reports",
    evidence: [
      "50 USC 3373(c)(5) requires threat evaluation—not produced",
      "DoD IG found cooperation concerns",
      "Near-misses with military aircraft documented but not investigated",
    ],
  },
  {
    id: "apex",
    assumption: "We are the apex intelligence on Earth",
    counter: "This is an assumption, not a proven fact",
    parallel: "Every civilization has believed this about itself",
    evidence: [
      "Most fundamental assumption shaping all analysis",
      "If wrong, reframes every other conclusion",
      "Worth examining rather than assuming",
    ],
  },
];

export function AssumptionAudit() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold mb-2 text-center">Observer Assumptions Audit</h2>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        Challenge your interpretive lens. What do you believe that may not be true?
      </p>

      <div className="space-y-3 max-w-3xl mx-auto">
        {assumptions.map((item) => {
          const isExpanded = expanded === item.id;

          return (
            <div key={item.id} className="card-elevated overflow-hidden">
              <button
                onClick={() => setExpanded(isExpanded ? null : item.id)}
                className="w-full text-left p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-foreground mb-1">"{item.assumption}"</p>
                    <p className="text-sm text-muted-foreground">{item.counter}</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-border space-y-4">
                  {item.parallel && (
                    <div className="flex items-start gap-2">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground shrink-0 mt-0.5">Parallel:</span>
                      <span className="text-sm">{item.parallel}</span>
                    </div>
                  )}

                  {item.quote && (
                    <blockquote className="border-l-2 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
                      <p className="text-sm italic">"{item.quote.text}"</p>
                      <footer className="text-xs text-muted-foreground mt-1">— {item.quote.source}</footer>
                    </blockquote>
                  )}

                  {item.evidence && (
                    <div>
                      <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">Evidence:</span>
                      <ul className="space-y-1.5">
                        {item.evidence.map((e, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                            <span className="text-muted-foreground">{e}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
