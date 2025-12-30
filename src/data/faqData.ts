import { ReactNode } from "react";

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  theme: string;
  relatedFigures?: string[];
  relatedSections?: string[];
}

export interface Theme {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const themes: Theme[] = [
  { id: "existence", label: "Existence & Nature", icon: "🌌", color: "bg-purple-500/20 text-purple-300 border-purple-500/50" },
  { id: "government", label: "Government & Programs", icon: "🏛️", color: "bg-blue-500/20 text-blue-300 border-blue-500/50" },
  { id: "secrecy", label: "Secrecy & Cover-Up", icon: "🔒", color: "bg-amber-500/20 text-amber-300 border-amber-500/50" },
  { id: "evidence", label: "Evidence & Science", icon: "🔬", color: "bg-green-500/20 text-green-300 border-green-500/50" },
  { id: "implications", label: "Implications & Future", icon: "🚀", color: "bg-rose-500/20 text-rose-300 border-rose-500/50" },
];

// Starter questions - more will be added in Part 2
export const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Are we alone in the universe?",
    answer: "Multiple credentialed officials have stated they believe the answer is 'no.' Col. Karl Nell (Ret.), former Army UAP Task Force lead, stated there is 'zero doubt' that non-human intelligence is interacting with humanity.",
    theme: "existence",
    relatedFigures: ["Karl Nell", "John Brennan"],
    relatedSections: ["A"],
  },
  {
    id: 21,
    question: "Does the US government possess crashed alien craft?",
    answer: "Dr. James Lacatski, who managed the $22M AAWSAP program, confirmed with Pentagon clearance that the US 'possesses a craft of unknown origin and successfully gained access to its interior.'",
    theme: "government",
    relatedFigures: ["James Lacatski", "David Grusch"],
    relatedSections: ["G"],
  },
  {
    id: 41,
    question: "Why is the government keeping this secret?",
    answer: "Multiple reasons are cited: preventing 'ontological shock' to society, maintaining technological advantage over adversaries, avoiding panic about biological threats, and shielding illegal programs from accountability.",
    theme: "secrecy",
    relatedSections: ["F", "H"],
  },
  {
    id: 61,
    question: "Is there any 'hard' evidence?",
    answer: "Yes. Recovered materials with anomalous isotopic ratios have been studied. The Ubatuba magnesium sample and other alleged crash debris show manufacturing processes unlike any known Earth technology.",
    theme: "evidence",
    relatedSections: ["G"],
  },
  {
    id: 81,
    question: "What is 'Ontological Shock'?",
    answer: "The psychological trauma of realizing humanity is not the apex intelligence. Studies suggest many people would struggle to integrate this knowledge, potentially causing mental health crises or existential despair.",
    theme: "implications",
    relatedSections: ["M"],
  },
];
