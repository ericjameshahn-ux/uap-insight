import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface Lens {
  id: string;
  tabLabel: string;
  heading: string;
  body: string;
  buttonLabel: string;
  personaName: string;
  path: string[];
}

const lenses: Lens[] = [
  {
    id: "skeptic",
    tabLabel: "Skeptic's Gate",
    heading: "The Disarming Question",
    body: "Decades of cultural stigma have relegated unidentified phenomena to the fringe. However, when the Intelligence Community Inspector General validates whistleblower claims of unacknowledged programs as 'credible and urgent,' serious analysts must prioritize the underlying data over the surrounding mythology.",
    buttonLabel: "Begin as Skeptic",
    personaName: "Skeptical Analyst",
    path: ["a", "b", "d", "c"],
  },
  {
    id: "risk",
    tabLabel: "Risk Analyst",
    heading: "The Information Asymmetry Frame",
    body: "Waived Special Access Programs have created a significant information gap between the defense sector and capital markets. We synthesize the testimonies of high-ranking insiders to map the fiscal and technological assets currently sequestered from public oversight and standard market valuation.",
    buttonLabel: "Begin as Strategist",
    personaName: "The Strategist",
    path: ["f", "h", "l", "e"],
  },
  {
    id: "historical",
    tabLabel: "Historical Lens",
    heading: "The Historical Parallel",
    body: "Just as the Manhattan Project once operated as a state-within-a-state, evidence suggests a parallel lineage of aerospace development has remained classified for decades. Understanding this bifurcation is essential for assessing the imminent transition of disruptive propulsion and energy technologies into the commercial sector.",
    buttonLabel: "Begin as Historian",
    personaName: "The Historian",
    path: ["d", "e", "f", "h"],
  },
  {
    id: "policy",
    tabLabel: "Policy Tracker",
    heading: "The Congressional Reality Check",
    body: "The UAP Disclosure Act and recent sworn testimony have moved this subject into the legislative mainstream. With federal law now defining 'non-human intelligence' and 'technologies of unknown origin,' these phenomena represent a documented regulatory and national security priority rather than a speculative interest.",
    buttonLabel: "Begin as Investigator",
    personaName: "The Investigator",
    path: ["b", "g", "k", "f"],
  },
  {
    id: "edge",
    tabLabel: "Information Edge",
    heading: "The Analyst's Dilemma",
    body: "Evaluating unidentified phenomena is no longer a matter of personal belief but of institutional risk management. For leaders in AI and finance, the primary concern is the asymmetrical advantage held by those who control the derivative technologies and their associated intellectual property.",
    buttonLabel: "Begin as Empiricist",
    personaName: "The Empiricist",
    path: ["a", "b", "c", "f"],
  },
  {
    id: "engineering",
    tabLabel: "Engineering Edge",
    heading: "The R&D Frontier",
    body: "Observed flight performance exceeding known aerodynamic limits, alongside verified Navy patent filings and peer-reviewed materials analysis from Stanford and Harvard, points to a sophisticated R&D frontier. Investors are noting the '5 Observables' as evidence that new physics and capabilities exist—regardless of origin story. Evaluating these anomalies in metric engineering and non-conventional propulsion is now a prerequisite for assessing future aerospace and energy disruption.",
    buttonLabel: "Begin as Technologist",
    personaName: "The Technologist",
    path: ["c", "j", "l", "g"],
  },
];

export function LensSelector() {
  const navigate = useNavigate();
  // Default to "policy" (Policy Tracker - The Congressional Reality Check)
  const [selectedLens, setSelectedLens] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("uap_selected_lens");
      return saved || "policy";
    }
    return "policy";
  });

  const currentLens = lenses.find((l) => l.id === selectedLens) || lenses[3];

  useEffect(() => {
    sessionStorage.setItem("uap_selected_lens", selectedLens);
  }, [selectedLens]);

  return (
    <div className="max-w-2xl mx-auto mb-10 animate-fade-in">
      {/* Label */}
      <p className="text-center text-sm font-medium text-muted-foreground mb-3">
        Select Your Perspective:
      </p>

      {/* File Folder Tabs - 2 rows of 3 on mobile */}
      <div className="flex flex-wrap justify-center gap-1 relative z-10">
        {lenses.map((lens) => (
          <button
            key={lens.id}
            onClick={() => setSelectedLens(lens.id)}
            className={cn(
              "px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-200",
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
            <p className="text-muted-foreground leading-relaxed mb-4">
              {currentLens.body}
            </p>
            
            {/* Understated navigation button */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  localStorage.setItem("uap_path", JSON.stringify(currentLens.path));
                  localStorage.setItem("uap_path_index", "0");
                  localStorage.setItem("uap_archetype_name", currentLens.personaName);
                  localStorage.setItem("uap_archetype_id", currentLens.id);
                  window.dispatchEvent(new StorageEvent("storage", { key: "uap_path" }));
                  navigate(`/section/${currentLens.path[0]}`);
                }}
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors group"
              >
                {currentLens.buttonLabel}
                <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
