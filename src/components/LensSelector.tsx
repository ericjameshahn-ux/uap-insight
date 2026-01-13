import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Lens {
  id: string;
  tabLabel: string;
  heading: string;
  body: string;
}

const lenses: Lens[] = [
  {
    id: "skeptic",
    tabLabel: "Skeptic's Gate",
    heading: "The Disarming Question",
    body: "Decades of cultural stigma have relegated unidentified phenomena to the fringe. However, when the Intelligence Community Inspector General validates whistleblower claims of unacknowledged programs as 'credible and urgent,' serious analysts must prioritize the underlying data over the surrounding mythology.",
  },
  {
    id: "risk",
    tabLabel: "Risk Analyst",
    heading: "The Information Asymmetry Frame",
    body: "Waived Special Access Programs have created a significant information gap between the defense sector and capital markets. We synthesize the testimonies of high-ranking insiders to map the fiscal and technological assets currently sequestered from public oversight and standard market valuation.",
  },
  {
    id: "historical",
    tabLabel: "Historical Lens",
    heading: "The Historical Parallel",
    body: "Just as the Manhattan Project once operated as a state-within-a-state, evidence suggests a parallel lineage of aerospace development has remained classified for decades. Understanding this bifurcation is essential for assessing the imminent transition of disruptive propulsion and energy technologies into the commercial sector.",
  },
  {
    id: "policy",
    tabLabel: "Policy Tracker",
    heading: "The Congressional Reality Check",
    body: "The UAP Disclosure Act and recent sworn testimony have moved this subject into the legislative mainstream. With federal law now defining 'non-human intelligence' and 'technologies of unknown origin,' these phenomena represent a documented regulatory and national security priority rather than a speculative interest.",
  },
  {
    id: "edge",
    tabLabel: "Information Edge",
    heading: "The Analyst's Dilemma",
    body: "Evaluating unidentified phenomena is no longer a matter of personal belief but of institutional risk management. For leaders in AI and finance, the primary concern is the asymmetrical advantage held by those who control the derivative technologies and their associated intellectual property.",
  },
];

export function LensSelector() {
  // Default to "policy" (Policy Tracker - The Congressional Reality Check)
  const [selectedLens, setSelectedLens] = useState<string>(() => {
    // Try to restore from session storage
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("uap_selected_lens");
      return saved || "policy";
    }
    return "policy";
  });

  const currentLens = lenses.find((l) => l.id === selectedLens) || lenses[3];

  // Save selection to session storage
  useEffect(() => {
    sessionStorage.setItem("uap_selected_lens", selectedLens);
  }, [selectedLens]);

  return (
    <div className="max-w-2xl mx-auto mb-10 animate-fade-in">
      {/* Label */}
      <p className="text-center text-sm font-medium text-muted-foreground mb-3">
        Select Your Perspective:
      </p>

      {/* File Folder Tabs */}
      <div className="flex flex-wrap justify-center gap-1 relative z-10">
        {lenses.map((lens) => (
          <button
            key={lens.id}
            onClick={() => setSelectedLens(lens.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-all duration-200",
              "rounded-t-lg border-t border-l border-r focus:outline-none focus:ring-2 focus:ring-primary/50",
              selectedLens === lens.id
                ? "bg-card border-border text-foreground relative z-20 -mb-px shadow-sm"
                : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground -mb-px"
            )}
          >
            {lens.tabLabel}
          </button>
        ))}
      </div>

      {/* Content Area - Connected to active tab */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedLens}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-card border border-border rounded-b-xl rounded-tr-xl p-6 shadow-md"
          >
            <h3 className="text-lg font-semibold text-foreground mb-3">
              {currentLens.heading}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {currentLens.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
