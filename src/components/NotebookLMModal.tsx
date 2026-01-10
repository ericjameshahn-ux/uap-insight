import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check, ExternalLink, Sparkles, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotebookLMModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSection?: string;
}

const suggestedPrompts: Record<string, { title: string; prompt: string }[]> = {
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
  sectionA: [
    {
      title: "Official Acknowledgments",
      prompt: "Compile all official US government acknowledgments that UAP are real, including quotes from Presidents, DNIs, and Pentagon officials with dates."
    }
  ],
  sectionF: [
    {
      title: "Classification Barriers",
      prompt: "Explain the legal and institutional barriers to UAP disclosure, including JANAP 146, SAPs, and the role of private contractors."
    },
    {
      title: "Guthrie Legal Analysis",
      prompt: "Summarize Dillon Guthrie's key findings about congressional disclosure rights and why no one has been prosecuted for sharing classified UAP info with Congress."
    }
  ],
  sectionG: [
    {
      title: "Crash Retrieval Claims",
      prompt: "What evidence exists for UAP crash retrieval programs? Include testimony from Grusch, Lacatski, and any corroborating witnesses."
    }
  ],
  sectionH: [
    {
      title: "Secrecy Mechanisms",
      prompt: "How has UAP information been kept secret? Explain the roles of FASAB 56, waived SAPs, and corporate custody in maintaining secrecy."
    }
  ]
};

const NOTEBOOKLM_URL = 'https://notebooklm.google.com/notebook/66050f25-44cd-4b42-9de0-46ba9979aad7';

export function NotebookLMModal({ isOpen, onClose, currentSection }: NotebookLMModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const getPrompts = () => {
    const sectionKey = currentSection ? `section${currentSection.toUpperCase()}` : null;
    const sectionPrompts = sectionKey && suggestedPrompts[sectionKey]
      ? suggestedPrompts[sectionKey]
      : [];
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Query Source Documents with AI
          </DialogTitle>
          <DialogDescription>
            Our NotebookLM knowledge base contains 65+ primary source documents.
            Copy a suggested prompt below, then paste it into NotebookLM to get AI-powered answers with citations.
          </DialogDescription>
        </DialogHeader>

        {/* Suggested Prompts */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            Click to copy a suggested prompt:
          </div>

          <div className="space-y-2">
            {prompts.map((item, index) => (
              <button
                key={index}
                onClick={() => copyToClipboard(item.prompt, index)}
                className="w-full text-left p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {item.prompt}
                    </p>
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    {copiedIndex === index ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Launch Button */}
        <div className="pt-4 border-t border-border">
          <Button onClick={launchNotebookLM} className="w-full" size="lg">
            <ExternalLink className="w-4 h-4 mr-2" />
            Launch NotebookLM Knowledge Base
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Opens in a new tab. Paste your copied prompt in the chat.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
