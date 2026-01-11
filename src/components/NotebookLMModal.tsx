import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy, Check, ExternalLink, Keyboard, Info, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SuggestedPrompt {
  title: string;
  prompt: string;
}

interface NotebookLMModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSection?: string;
}

// Persona lenses for AI prompt personalization - 6 research-focused personas only
const personaLenses: Record<string, { name: string; icon: string; description: string; lens: string }> = {
  empiricist: {
    name: "The Empiricist",
    icon: "🔬",
    description: "Evidence-first, data-driven analysis",
    lens: "Please prioritize hard sensor data (radar/FLIR), physical material analyses (isotopic ratios/metamaterials), and quantifiable performance metrics (g-forces/velocities) over anecdotal accounts."
  },
  historian: {
    name: "The Historian",
    icon: "📚",
    description: "Patterns across time and policy",
    lens: "Frame the answer within the chronological evolution of government programs (from Blue Book to AARO), tracing the legislative paper trail and historical precedents for secrecy mechanisms."
  },
  strategist: {
    name: "The Strategist",
    icon: "♟️",
    description: "National security implications",
    lens: "Analyze the geopolitical implications, national security risks, and the bureaucratic power struggles (e.g., Title 10 vs. Title 50 jurisdiction) driving the containment or disclosure of this information."
  },
  investigator: {
    name: "The Investigator",
    icon: "🔍",
    description: "Forensic case examination",
    lens: "Focus on cross-referencing specific witness credibility, corroborating testimonies (e.g., Varginha, Nimitz), and identifying concrete chains of custody for alleged evidence."
  },
  technologist: {
    name: "The Technologist",
    icon: "⚡",
    description: "Physics and engineering focus",
    lens: "Detail the proposed engineering mechanisms—specifically metric engineering, vacuum polarization, and terahertz waveguides—and how they align with or challenge known physics (e.g., the Schwinger limit)."
  },
  debunker: {
    name: "The Skeptical Analyst",
    icon: "⚖️",
    description: "Rigorous counter-arguments",
    lens: "Critically evaluate the evidence by highlighting potential prosaic explanations, instances of circular reporting, and the possibility of disinformation or psychological operations (psyops)."
  }
};

// Available personas for dropdown selection (6 research-focused personas)
const availablePersonas = Object.entries(personaLenses).map(([id, data]) => ({
  id,
  icon: data.icon,
  name: data.name,
  description: data.description,
}));

// Section-aware suggested prompts
const suggestedPrompts: Record<string, SuggestedPrompt[]> = {
  general: [
    {
      title: "Executive Summary",
      prompt: "Give me a 3-paragraph executive summary of the strongest evidence for UAP being real physical objects, citing specific sources and dates."
    },
    {
      title: "Key Whistleblowers",
      prompt: "Who are the most credible UAP whistleblowers, what are their credentials, and what specific claims have they made under oath?"
    },
    {
      title: "Government Programs",
      prompt: "List all known US government UAP investigation programs chronologically, including AAWSAP, AATIP, UAPTF, and AARO, with their funding and findings."
    },
    {
      title: "Physics Implications",
      prompt: "What physics-defying capabilities have been documented in UAP encounters, and what do scientists like Hal Puthoff and Eric Davis say about potential propulsion mechanisms?"
    }
  ],
  a: [
    {
      title: "Official Acknowledgments",
      prompt: "Compile all official US government acknowledgments that UAP are real, including quotes from Presidents, DNIs, and Pentagon officials with dates."
    },
    {
      title: "Key Quotes Timeline",
      prompt: "Create a timeline of the most significant official statements about UAP from 2017 to present, noting the speaker's position and credibility tier."
    }
  ],
  b: [
    {
      title: "Multi-Sensor Evidence",
      prompt: "What multi-sensor evidence exists for UAP being real physical objects? Include radar, infrared, and visual confirmation cases."
    },
    {
      title: "Nimitz Encounter Details",
      prompt: "Provide a comprehensive breakdown of the 2004 Nimitz USS Princeton encounter, including all witness testimonies and sensor data."
    }
  ],
  c: [
    {
      title: "Five Observables",
      prompt: "Explain each of the 'Five Observables' that characterize UAP performance, with specific documented examples of each."
    },
    {
      title: "Physics Analysis",
      prompt: "What would be required from a physics standpoint to achieve the documented UAP maneuvers? Include expert analysis from credentialed scientists."
    }
  ],
  f: [
    {
      title: "Classification Barriers",
      prompt: "Explain the legal and institutional barriers to UAP disclosure, including SAPs, JANAP 146, and the role of private contractors."
    },
    {
      title: "Guthrie Legal Analysis",
      prompt: "Summarize Dillon Guthrie's key findings about congressional disclosure rights and why no one has been prosecuted for sharing classified UAP info with Congress."
    },
    {
      title: "Congressional Oversight",
      prompt: "What legal authority does Congress have over classified UAP programs? Cite specific laws and constitutional provisions."
    }
  ],
  g: [
    {
      title: "Crash Retrieval Claims",
      prompt: "What evidence exists for UAP crash retrieval programs? Include testimony from Grusch, Lacatski, and any corroborating witnesses."
    },
    {
      title: "Reverse Engineering",
      prompt: "Summarize all claims about reverse engineering programs for recovered UAP materials, including who has made these claims and their credentials."
    }
  ],
  h: [
    {
      title: "Secrecy Mechanisms",
      prompt: "How has UAP information been kept secret? Explain the roles of FASAB 56, waived SAPs, and corporate custody in maintaining secrecy."
    },
    {
      title: "Breakaway Civilization",
      prompt: "What is the 'breakaway civilization' hypothesis and what evidence supports or contradicts it?"
    }
  ],
  i: [
    {
      title: "Consciousness Connection",
      prompt: "What evidence connects UAP phenomena to consciousness research? Include testimony from credentialed researchers and experiencers."
    },
    {
      title: "Remote Viewing Programs",
      prompt: "Summarize the government's remote viewing programs (Stargate, etc.) and any connections to UAP research."
    }
  ]
};

const NOTEBOOKLM_URL = 'https://notebooklm.google.com/notebook/66050f25-44cd-4b42-9de0-46ba9979aad7';

export function NotebookLMModal({ isOpen, onClose, currentSection }: NotebookLMModalProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [includePersona, setIncludePersona] = useState(true);
  const [selectedPersona, setSelectedPersona] = useState<string>("debunker"); // Default to Skeptic
  const [lastCopiedPrompt, setLastCopiedPrompt] = useState<string | null>(null);
  const { toast } = useToast();

  // Get user's persona from localStorage on mount (default to debunker/Skeptic if none)
  useEffect(() => {
    const storedPersona = localStorage.getItem('uap_primary_archetype');
    const personaMap: Record<string, string> = {
      'skeptic': 'debunker',
      'experiencer': 'empiricist',
      'meaning_seeker': 'historian',
    };
    const mappedPersona = personaMap[storedPersona || ''] || storedPersona;
    
    if (mappedPersona && personaLenses[mappedPersona]) {
      setSelectedPersona(mappedPersona);
    }
    // If no stored persona, keep default "debunker" (Skeptic)
  }, []);

  // Reset expanded state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsExpanded(false);
      setLastCopiedPrompt(null);
    }
  }, [isOpen]);

  // Get prompts based on current section
  const getPrompts = (): SuggestedPrompt[] => {
    const sectionKey = currentSection?.toLowerCase() || '';
    const sectionPrompts = suggestedPrompts[sectionKey] || [];
    return [...sectionPrompts, ...suggestedPrompts.general];
  };

  const prompts = getPrompts();
  const suggestedPrompt = prompts[0]; // First prompt is the "suggested" one

  // Get display name for current persona
  const currentPersona = personaLenses[selectedPersona];
  const personaDisplayName = currentPersona?.name || "Skeptical Analyst";

  // Build the full prompt with structured persona lens
  const buildFullPrompt = (basePrompt: string): string => {
    if (includePersona && selectedPersona && personaLenses[selectedPersona]) {
      const persona = personaLenses[selectedPersona];
      return `**Research Persona:** ${persona.lens}\n\n**Research Focus:** ${basePrompt}`;
    }
    return `**Research Focus:** ${basePrompt}`;
  };

  const copyToClipboard = async (text: string, index: number, isInitialCopy = false) => {
    try {
      const fullPrompt = buildFullPrompt(text);
      await navigator.clipboard.writeText(fullPrompt);
      setCopiedIndex(index);
      setLastCopiedPrompt(fullPrompt);
      
      toast({
        title: "Prompt copied!",
        description: `Copied with your ${personaDisplayName} lens!`,
      });

      // Expand after first copy
      if (isInitialCopy && !isExpanded) {
        setIsExpanded(true);
      }

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

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Query Source Documents with AI
          </DialogTitle>
          <DialogDescription>
            Our NotebookLM knowledge base contains 100+ primary source documents.
          </DialogDescription>
        </DialogHeader>

        {/* Initial View: Two buttons side by side */}
        <div className="flex flex-col sm:flex-row gap-3">
          {suggestedPrompt && (
            <Button
              variant="default"
              className="flex-1 gap-2"
              onClick={() => copyToClipboard(suggestedPrompt.prompt, 0, true)}
            >
              {copiedIndex === 0 ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              📋 Copy Suggested Prompt
            </Button>
          )}
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={launchNotebookLM}
          >
            🚀 Open NotebookLM
          </Button>
        </div>

        {/* Expanded View: Shows after first copy */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            {/* What was just copied */}
            {lastCopiedPrompt && (
              <div className="p-3 bg-muted/50 rounded-md border border-border text-xs">
                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                  <Eye className="h-3.5 w-3.5" />
                  <span className="font-medium">What was just copied:</span>
                </div>
                <div className="text-foreground/80 whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {lastCopiedPrompt}
                </div>
              </div>
            )}

            {/* Persona selection */}
            <div className="flex flex-col gap-3 p-3 bg-muted/50 rounded-md border border-border/50">
              <div className="flex items-center gap-2">
                <Switch
                  id="modal-persona-toggle"
                  checked={includePersona}
                  onCheckedChange={setIncludePersona}
                />
                <Label htmlFor="modal-persona-toggle" className="text-sm font-medium cursor-pointer">
                  Include persona lens
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-xs">
                        When enabled, a persona-specific instruction guides the AI to tailor responses to your research style.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {includePersona && (
                <Select value={selectedPersona} onValueChange={setSelectedPersona}>
                  <SelectTrigger className="w-full h-auto py-2 text-sm">
                    <SelectValue placeholder="Select research persona...">
                      {selectedPersona && personaLenses[selectedPersona] && (
                        <span className="flex items-center gap-2">
                          <span>{personaLenses[selectedPersona].icon}</span>
                          <span>{personaLenses[selectedPersona].name}</span>
                          <span className="text-muted-foreground hidden sm:inline">—</span>
                          <span className="text-muted-foreground text-xs hidden sm:inline">{personaLenses[selectedPersona].description}</span>
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="w-[400px] bg-popover">
                    {availablePersonas.map((persona) => (
                      <SelectItem key={persona.id} value={persona.id} className="py-3">
                        <div className="flex items-start gap-2">
                          <span className="text-lg">{persona.icon}</span>
                          <div className="flex flex-col">
                            <span className="font-medium">{persona.name}</span>
                            <span className="text-xs text-muted-foreground">— {persona.description}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Keyboard Shortcut Hint */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
              <Keyboard className="h-3 w-3" />
              <span>Tip: Press <kbd className="px-1.5 py-0.5 bg-background rounded border text-[10px] font-mono">Ctrl/⌘ + K</kbd> anywhere to open this dialog</span>
            </div>

            {/* Section Context */}
            {currentSection && (
              <div className="text-sm text-primary bg-primary/10 px-3 py-2 rounded-md">
                Showing prompts relevant to Section {currentSection.toUpperCase()}
              </div>
            )}

            {/* Additional Prompts */}
            {prompts.length > 1 && (
              <div className="space-y-3">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  More prompts to try:
                </p>

                <div className="space-y-2">
                  {prompts.slice(1).map((item, index) => (
                    <button
                      key={index + 1}
                      onClick={() => copyToClipboard(item.prompt, index + 1)}
                      className="w-full text-left p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm group-hover:text-primary transition-colors">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {item.prompt}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-muted-foreground group-hover:text-primary">
                          {copiedIndex === index + 1 ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Launch Button */}
            <div className="pt-4 border-t">
              <Button onClick={launchNotebookLM} className="w-full" size="lg">
                <ExternalLink className="h-4 w-4 mr-2" />
                Launch NotebookLM — Query 100+ Research Documents
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Opens in a new tab. Paste your copied prompt in the chat.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default NotebookLMModal;
