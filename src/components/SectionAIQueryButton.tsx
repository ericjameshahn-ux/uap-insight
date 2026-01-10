import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy, Check, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SectionAIQueryButtonProps {
  sectionId: string;
  sectionTitle?: string;
  variant?: "inline" | "card" | "floating";
}

// Quick prompts tailored to each section
const sectionQuickPrompts: Record<string, { title: string; prompt: string }[]> = {
  a: [
    { title: "Official statements", prompt: "List all official US government statements acknowledging UAP are real, with dates and speaker credentials." },
    { title: "Presidential quotes", prompt: "What have US Presidents said about UFOs/UAP? Include direct quotes with dates." },
  ],
  b: [
    { title: "Sensor evidence", prompt: "What multi-sensor evidence confirms UAP are physical objects? Include radar, IR, and visual data." },
    { title: "Nimitz details", prompt: "Give me a complete breakdown of the 2004 Nimitz encounter with all witness testimonies." },
  ],
  c: [
    { title: "Five Observables", prompt: "Explain the Five Observables of UAP with documented examples of each capability." },
    { title: "Acceleration data", prompt: "What acceleration and velocity data has been recorded for UAP? Include specific measurements." },
  ],
  d: [
    { title: "Historical cases", prompt: "What are the most well-documented UAP cases from before 2000? Include Roswell, Belgian Wave, etc." },
    { title: "Pattern analysis", prompt: "Are there consistent patterns in UAP reports across decades? What characteristics persist?" },
  ],
  e: [
    { title: "International incidents", prompt: "List documented UAP encounters from non-US military sources with details." },
    { title: "Global patterns", prompt: "How do UAP encounters compare across different countries? Are there regional differences?" },
  ],
  f: [
    { title: "Legal framework", prompt: "What legal protections exist for UAP whistleblowers? Summarize Guthrie's analysis." },
    { title: "Classification barriers", prompt: "How is UAP information classified and what prevents disclosure?" },
  ],
  g: [
    { title: "Retrieval claims", prompt: "Summarize all crash retrieval program claims with witness credentials and corroboration." },
    { title: "Material evidence", prompt: "What physical evidence allegedly exists from recovered UAP? Who has testified about it?" },
  ],
  h: [
    { title: "Secrecy mechanisms", prompt: "How has secrecy around UAP programs been maintained? Explain SAPs, FASAB 56, etc." },
    { title: "Financial trails", prompt: "What financial irregularities have been linked to UAP programs?" },
  ],
  i: [
    { title: "Consciousness research", prompt: "What connections exist between UAP research and consciousness studies?" },
    { title: "Contact claims", prompt: "Summarize credentialed witness testimony about direct contact or communication with UAP." },
  ],
  j: [
    { title: "Physics research", prompt: "What physics theories could explain UAP capabilities? Include Pais patents and Puthoff research." },
    { title: "Propulsion concepts", prompt: "What propulsion mechanisms have been proposed for UAP? Include scientific assessments." },
  ],
  k: [
    { title: "Biological claims", prompt: "What testimony exists about non-human biologics? Include credentials of witnesses." },
  ],
  l: [
    { title: "Tech development", prompt: "What technology developments may be related to UAP research? Include defense contractor connections." },
  ],
  m: [
    { title: "Implications", prompt: "What are the potential implications of UAP being real? Cover scientific, religious, and societal impacts." },
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
  const { toast } = useToast();

  const prompts = sectionQuickPrompts[sectionId.toLowerCase()] || [];

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast({
        title: "Copied!",
        description: "Now open NotebookLM and paste your prompt.",
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
          <CollapsibleContent className="mt-4 space-y-2">
            <p className="text-xs text-muted-foreground mb-2">
              Click to copy, then paste in NotebookLM:
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {prompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => copyToClipboard(prompt.prompt, index)}
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
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
}

export default SectionAIQueryButton;
