import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy, Check, ExternalLink, Keyboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SuggestedPrompt {
  title: string;
  prompt: string;
}

interface NotebookLMModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSection?: string;
}

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
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  // Get prompts based on current section
  const getPrompts = (): SuggestedPrompt[] => {
    const sectionKey = currentSection?.toLowerCase() || '';
    const sectionPrompts = suggestedPrompts[sectionKey] || [];
    // Return section-specific prompts first, then general prompts
    return [...sectionPrompts, ...suggestedPrompts.general];
  };

  const prompts = getPrompts();

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard. Now paste it in NotebookLM.",
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

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on Escape
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
            Our NotebookLM knowledge base contains 65+ primary source documents.
            Copy a suggested prompt below, then paste it into NotebookLM to get AI-powered answers with citations.
          </DialogDescription>
        </DialogHeader>

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

        {/* Suggested Prompts */}
        <div className="space-y-3">
          <p className="text-sm font-medium flex items-center gap-2">
            <Copy className="h-4 w-4" />
            Click to copy a suggested prompt:
          </p>

          <div className="space-y-2">
            {prompts.map((item, index) => (
              <button
                key={index}
                onClick={() => copyToClipboard(item.prompt, index)}
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
                    {copiedIndex === index ? (
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

        {/* Launch Button */}
        <div className="pt-4 border-t">
          <Button onClick={launchNotebookLM} className="w-full" size="lg">
            <ExternalLink className="h-4 w-4 mr-2" />
            Launch NotebookLM Knowledge Base
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Opens in a new tab. Paste your copied prompt in the chat.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NotebookLMModal;
