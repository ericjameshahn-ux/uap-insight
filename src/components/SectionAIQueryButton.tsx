import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy, Check, ExternalLink, ChevronDown, ChevronUp, Info, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SectionAIQueryButtonProps {
  sectionId: string;
  sectionTitle?: string;
  variant?: "inline" | "card" | "floating";
}

// Persona lenses for AI prompt personalization
const personaLenses: Record<string, string> = {
  empiricist: "Please prioritize hard sensor data (radar/FLIR), physical material analyses (isotopic ratios/metamaterials), and quantifiable performance metrics (g-forces/velocities) over anecdotal accounts.",
  historian: "Frame the answer within the chronological evolution of government programs (from Blue Book to AARO), tracing the legislative paper trail and historical precedents for secrecy mechanisms.",
  strategist: "Analyze the geopolitical implications, national security risks, and the bureaucratic power struggles (e.g., Title 10 vs. Title 50 jurisdiction) driving the containment or disclosure of this information.",
  investigator: "Focus on cross-referencing specific witness credibility, corroborating testimonies (e.g., Varginha, Nimitz), and identifying concrete chains of custody for alleged evidence.",
  experiencer: "Include the 'high strangeness' aspects often filtered out of official reports, such as consciousness interfaces, telepathy, the 'Hitchhiker Effect,' and physiological after-effects.",
  technologist: "Detail the proposed engineering mechanisms—specifically metric engineering, vacuum polarization, and terahertz waveguides—and how they align with or challenge known physics (e.g., the Schwinger limit).",
  skeptic: "Critically evaluate the evidence by highlighting potential prosaic explanations, instances of circular reporting, and the possibility of disinformation or psychological operations (psyops).",
  debunker: "Critically evaluate the evidence by highlighting potential prosaic explanations, instances of circular reporting, and the possibility of disinformation or psychological operations (psyops).",
  meaning_seeker: "Explore the 'ontological shock,' theological reframing, and the profound paradigm shift in the human worldview that these disclosures imply."
};

// Display names for personas
const personaDisplayNames: Record<string, string> = {
  empiricist: "Empiricist",
  historian: "Historian",
  strategist: "Strategist",
  investigator: "Investigator",
  experiencer: "Experiencer",
  technologist: "Technologist",
  skeptic: "Skeptic",
  debunker: "Skeptic",
  meaning_seeker: "Meaning-Seeker"
};

// Available personas for dropdown selection
const availablePersonas = [
  { id: "empiricist", name: "Empiricist" },
  { id: "historian", name: "Historian" },
  { id: "strategist", name: "Strategist" },
  { id: "investigator", name: "Investigator" },
  { id: "skeptic", name: "Skeptic" },
  { id: "technologist", name: "Technologist" },
  { id: "experiencer", name: "Experiencer" },
  { id: "meaning_seeker", name: "Meaning-Seeker" },
];

// Detailed prompts tailored to each section
const sectionQuickPrompts: Record<string, { title: string; prompt: string }[]> = {
  a: [
    { title: "Official acknowledgments timeline", prompt: "Create a comprehensive timeline of official US government acknowledgments that UAP are real, including quotes from Presidents (Obama, Clinton), DNIs (Ratcliffe, Haines, Brennan), and Pentagon officials. Note each speaker's clearance level and the specific claims they made." },
    { title: "Multi-source corroboration", prompt: "Which UAP claims have been independently corroborated by multiple credentialed sources? Map the overlapping testimonies between Grusch, Elizondo, Mellon, and Congressional witnesses." },
  ],
  b: [
    { title: "Sensor data analysis", prompt: "Detail all known multi-sensor UAP encounters where radar, FLIR/infrared, and visual observation occurred simultaneously. For each case, explain what makes sensor artifacts or spoofing an insufficient explanation." },
    { title: "Nimitz encounter breakdown", prompt: "Provide a minute-by-minute reconstruction of the 2004 Nimitz/Tic Tac encounter including: Kevin Day's radar observations, Fravor's visual engagement, the CAP point pre-positioning anomaly, and the subsequent data seizure allegations." },
    { title: "Counter-argument: Sensor glitches", prompt: "What is the strongest skeptical explanation for the Five Observables (parallax error, radar spoofing, electronic warfare)? Then explain what evidence contradicts these explanations." },
  ],
  c: [
    { title: "Five Observables with data", prompt: "For each of the Five Observables (instant acceleration, hypersonic velocity, low observability, transmedium travel, positive lift with no visible propulsion), provide the specific measured values from documented encounters and explain why conventional physics cannot account for them." },
    { title: "Pais Effect analysis", prompt: "Explain the Pais Effect (Inertial Mass Reduction) theory, the Navy's $508K HEEMFG experiment results, the Schwinger Limit constraint, and why proponents argue the experiment's failure was due to material limitations rather than flawed physics." },
    { title: "Metamaterials evidence", prompt: "Summarize what we know about alleged UAP metamaterials (Bismuth/Magnesium layers, 'Art's Parts'), including AARO/ORNL analysis results, the isotopic ratio debate, and the terahertz waveguide hypothesis." },
  ],
  d: [
    { title: "Pre-2000 case patterns", prompt: "Analyze the most well-documented UAP cases before 2000 (Roswell 1947, Belgian Wave 1989-90, Rendlesham Forest 1980, Tehran 1976). What characteristics persist across decades and what does this pattern suggest?" },
    { title: "Government program evolution", prompt: "Trace the evolution of US government UAP programs chronologically: Sign → Grudge → Blue Book → Robertson Panel → Condon Report → AAWSAP → AATIP → UAPTF → AARO. What changed and what stayed the same?" },
  ],
  e: [
    { title: "International military encounters", prompt: "List documented UAP encounters from non-US military sources (Belgian Air Force, Peruvian Air Force, Brazilian military at Varginha, French GEIPAN). How do international accounts corroborate or differ from US reports?" },
    { title: "Nuclear correlation evidence", prompt: "What evidence supports the claim that UAP activity correlates with nuclear facilities? Include Malmstrom AFB 1967 ICBM shutdowns, and explain why the 'coincidence/technical malfunction' counter-argument may be insufficient." },
  ],
  f: [
    { title: "Guthrie legal framework", prompt: "Summarize Dillon Guthrie's key findings from his Yale presentation and Harvard National Security Journal article: Why has no one been prosecuted for disclosing classified info to Congress? What do SF-312 and SAP NDAs actually say about Congressional disclosure?" },
    { title: "Classification mechanisms", prompt: "Explain the specific mechanisms used to hide UAP programs: Title 10 vs Title 50 jurisdiction, waived/unacknowledged SAPs, IRAD loopholes, Atomic Energy Act exploitation, and FASAB Statement 56. How do these create legal 'black holes'?" },
    { title: "AARO statutory failures", prompt: "What is AARO's statutory mandate under 50 U.S.C. § 3373(c)(5) regarding threat assessment? What evidence suggests they have not fulfilled this mandate?" },
  ],
  g: [
    { title: "Crash retrieval testimony", prompt: "Compile all crash retrieval program claims with witness credentials: Grusch (NGA/NRO), Lacatski (AAWSAP), Elizondo (AATIP), Eric Davis. What specific programs or locations have been named? What did the ICIG conclude about Grusch's complaint?" },
    { title: "Circular reporting counter", prompt: "What is the 'circular reporting' criticism of crash retrieval claims (Kirkpatrick's argument)? Then explain what evidence contradicts this—specifically the ICIG finding and the Schumer/Rounds legislation basis." },
    { title: "1933 Magenta Italy claim", prompt: "What is the evidence for the 1933 Magenta, Italy recovery claim? Include Grusch's testimony, the alleged Vatican/OSS connection, and the strongest counter-arguments (forgery, lack of documentation)." },
  ],
  h: [
    { title: "Breakaway civilization thesis", prompt: "Explain the 'Breakaway Civilization' hypothesis as articulated by Catherine Austin Fitts and Jason Jorjani. What is the evidence (missing trillions, FASAB 56, deep underground bases)? What are the strongest counter-arguments?" },
    { title: "Private contractor custody", prompt: "What evidence suggests private aerospace companies (Lockheed, contractors) possess UAP technology? Explain the IRAD loophole, the 'corporate risk/shareholder duty' counter-argument, and why some argue the technology may be 'too dangerous to monetize.'" },
  ],
  i: [
    { title: "Consciousness interface evidence", prompt: "What evidence connects UAP phenomena to consciousness? Include: Stargate/remote viewing programs, Dr. Garry Nolan's caudate-putamen research, the 'Hitchhiker Effect,' and credentialed experiencer testimony (Bledsoe, Ilyumzhinov)." },
    { title: "Telepathy claims analysis", prompt: "Summarize testimony about telepathic communication with UAP/entities. Include Dr. Venturelli (Varginha), Kirsan Ilyumzhinov, and the strongest counter-argument (psychological projection/hallucination). What makes the 'anthropomorphism' criticism potentially insufficient?" },
  ],
  j: [
    { title: "Propulsion physics theories", prompt: "Compare the leading theoretical frameworks for UAP propulsion: Pais Effect (vacuum polarization), Alcubierre metric (warp drive), Puthoff's polarizable vacuum, and metamaterial waveguides. Which has the most experimental support? Which faces the biggest physics constraints?" },
    { title: "Bob Lazar assessment", prompt: "Provide a balanced analysis of Bob Lazar's claims: Element 115 prediction (confirmed), S-4 facility details, biometric scanner verification, versus credential gaps (MIT/Caltech), Moscovium instability problem, and 'Gravity A' physics issues." },
  ],
  k: [
    { title: "Non-human biologics testimony", prompt: "Compile all testimony regarding 'non-human biologics': Grusch's Congressional statement, Varginha medical reports, the officer death from 'novel pathogen.' What is the 'Mudinho' counter-explanation and why do critics find it insufficient?" },
  ],
  l: [
    { title: "Defense contractor connections", prompt: "Map the connections between UAP research and defense contractors: Which companies have been named in testimony? What is the IRAD funding mechanism? How does Skywatcher.AI represent a new model of private UAP research?" },
  ],
  m: [
    { title: "Ontological implications", prompt: "What are the profound implications if UAP represent non-human intelligence? Cover: scientific paradigm shifts, religious/theological reframing, the 'dual reality' of public vs classified physics, and what 'ontological shock' means for society." },
  ],
};

const NOTEBOOKLM_URL = 'https://notebooklm.google.com/notebook/66050f25-44cd-4b42-9de0-46ba9979aad7';

export function SectionAIQueryButton({ 
  sectionId, 
  sectionTitle,
  variant = "card" 
}: SectionAIQueryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [includePersona, setIncludePersona] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<string>("");
  const [previewPromptIndex, setPreviewPromptIndex] = useState<number | null>(null);
  const { toast } = useToast();

  // Get user's persona from localStorage on mount
  useEffect(() => {
    const storedPersona = localStorage.getItem('uap_primary_archetype');
    if (storedPersona && personaLenses[storedPersona]) {
      setSelectedPersona(storedPersona);
    }
  }, []);

  const prompts = sectionQuickPrompts[sectionId.toLowerCase()] || [];

  // Build the full prompt with persona lens prepended (if enabled)
  const buildFullPrompt = (basePrompt: string): string => {
    if (includePersona && selectedPersona && personaLenses[selectedPersona]) {
      return `${personaLenses[selectedPersona]}\n\n${basePrompt}`;
    }
    return basePrompt;
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      const fullPrompt = buildFullPrompt(text);
      await navigator.clipboard.writeText(fullPrompt);
      setCopiedIndex(index);
      toast({
        title: "Copied!",
        description: includePersona && selectedPersona
          ? `Prompt copied with your ${personaDisplayNames[selectedPersona]} lens applied.`
          : "Now open NotebookLM and paste your prompt.",
      });
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please select and copy the text manually.",
        variant: "destructive"
      });
    }
  };

  const launchNotebookLM = () => {
    window.open(NOTEBOOKLM_URL, '_blank');
  };

  // Inline variant - just a button
  if (variant === "inline") {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={launchNotebookLM}
        className="gap-2"
      >
        <Sparkles className="h-4 w-4" />
        Ask AI About Section {sectionId.toUpperCase()}
      </Button>
    );
  }

  // Floating variant - fixed position button
  if (variant === "floating") {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={launchNotebookLM}
          size="lg"
          className="rounded-full shadow-lg gap-2 pr-6"
        >
          <Sparkles className="h-5 w-5" />
          Ask AI
        </Button>
      </div>
    );
  }

  // Card variant - expandable card with prompts (default)
  return (
    <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm">
                Query Section {sectionId.toUpperCase()} with AI
              </h3>
              <p className="text-xs text-muted-foreground">
                Get AI-powered answers from 65+ source documents
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={launchNotebookLM}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Open NotebookLM</span>
              <span className="sm:hidden">Open</span>
            </Button>
            
            {prompts.length > 0 && (
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  {isOpen ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      <span className="hidden sm:inline">Hide prompts</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      <span className="hidden sm:inline">Quick prompts</span>
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            )}
          </div>
        </div>

        {prompts.length > 0 && (
          <CollapsibleContent className="mt-4 space-y-3">
            {/* Persona toggle and dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-background/50 rounded-md border border-border/50">
              <div className="flex items-center gap-2">
                <Switch
                  id="persona-toggle"
                  checked={includePersona}
                  onCheckedChange={setIncludePersona}
                />
                <Label htmlFor="persona-toggle" className="text-sm font-medium cursor-pointer">
                  Include persona context
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-xs">
                        When enabled, a persona-specific instruction will be prepended to your prompt,
                        guiding the AI to tailor its response to your research style.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {includePersona && (
                <Select value={selectedPersona} onValueChange={setSelectedPersona}>
                  <SelectTrigger className="w-[180px] h-8 text-sm">
                    <SelectValue placeholder="Select persona..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePersonas.map((persona) => (
                      <SelectItem key={persona.id} value={persona.id}>
                        {persona.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground">
              Click to copy, then paste in NotebookLM:
            </p>
            
            <div className="grid gap-2 sm:grid-cols-2">
              {prompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => copyToClipboard(prompt.prompt, index)}
                  onMouseEnter={() => setPreviewPromptIndex(index)}
                  onMouseLeave={() => setPreviewPromptIndex(null)}
                  className="flex items-center justify-between gap-2 p-3 text-left rounded-md border border-border hover:border-primary/50 hover:bg-background transition-all text-sm group"
                >
                  <span className="font-medium group-hover:text-primary transition-colors">
                    {prompt.title}
                  </span>
                  {copiedIndex === index ? (
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <Copy className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Prompt preview */}
            {previewPromptIndex !== null && prompts[previewPromptIndex] && (
              <div className="mt-3 p-3 bg-muted/50 rounded-md border border-border text-xs">
                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                  <Eye className="h-3.5 w-3.5" />
                  <span className="font-medium">Preview (what will be copied):</span>
                </div>
                <div className="text-foreground/80 whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {buildFullPrompt(prompts[previewPromptIndex].prompt)}
                </div>
              </div>
            )}
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
}
