import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy, Check, ExternalLink, Info, Eye, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
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
import { Skeleton } from "@/components/ui/skeleton";

interface SectionAIQueryButtonProps {
  sectionId: string;
  sectionTitle?: string;
  variant?: "inline" | "card" | "floating";
}

interface SectionPrompt {
  id: string;
  section_id: string;
  title: string;
  prompt: string;
  is_primary: boolean;
  sort_order: number;
}

interface PersonaLens {
  id: string;
  name: string;
  short_desc: string;
  icon: string;
  lens: string;
  sort_order: number;
}

// Hook to fetch section prompts from Supabase
const useSectionPrompts = (sectionId: string) => {
  return useQuery({
    queryKey: ['section-prompts', sectionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('section_prompts')
        .select('*')
        .eq('section_id', sectionId.toLowerCase())
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as SectionPrompt[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// Hook to fetch persona lenses from Supabase
const usePersonaLenses = () => {
  return useQuery({
    queryKey: ['persona-lenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('persona_lenses')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as PersonaLens[];
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour - personas don't change often
  });
};

const NOTEBOOKLM_URL = 'https://notebooklm.google.com/notebook/66050f25-44cd-4b42-9de0-46ba9979aad7';

export function SectionAIQueryButton({ 
  sectionId, 
  sectionTitle,
  variant = "card" 
}: SectionAIQueryButtonProps) {
  const { toast } = useToast();
  
  // Fetch data from Supabase
  const { data: prompts, isLoading: promptsLoading } = useSectionPrompts(sectionId);
  const { data: personas, isLoading: personasLoading } = usePersonaLenses();
  
  // State for selections
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [includePersonaLens, setIncludePersonaLens] = useState(true);
  const [copied, setCopied] = useState(false);

  // Initialize default prompt when data loads
  useEffect(() => {
    if (prompts && prompts.length > 0 && !selectedPromptId) {
      const primary = prompts.find(p => p.is_primary);
      setSelectedPromptId(primary?.id || prompts[0].id);
    }
  }, [prompts, selectedPromptId]);

  // Load user's persona preference from localStorage
  useEffect(() => {
    const storedPersona = localStorage.getItem('uap_primary_archetype');
    // Map old persona keys to new ones if needed
    const personaMap: Record<string, string> = {
      'skeptic': 'debunker',
      'experiencer': 'empiricist',
      'meaning_seeker': 'historian',
    };
    const mappedPersona = personaMap[storedPersona || ''] || storedPersona;
    
    if (mappedPersona) {
      setSelectedPersonaId(mappedPersona);
    }
  }, []);

  // Set default persona from Supabase data if none stored
  useEffect(() => {
    if (personas && personas.length > 0 && !selectedPersonaId) {
      // Default to 'debunker' if exists, otherwise first persona
      const defaultPersona = personas.find(p => p.id === 'debunker') || personas[0];
      setSelectedPersonaId(defaultPersona.id);
    }
  }, [personas, selectedPersonaId]);

  // Get currently selected objects
  const selectedPrompt = prompts?.find(p => p.id === selectedPromptId);
  const selectedPersona = personas?.find(p => p.id === selectedPersonaId);

  // Compute the full prompt preview
  const fullPromptPreview = useMemo(() => {
    if (!selectedPrompt) return '';
    
    const basePrompt = selectedPrompt.prompt;
    
    if (selectedPersona && includePersonaLens) {
      return `**Research Persona:** ${selectedPersona.lens}\n\n**Research Focus:** ${basePrompt}`;
    }
    return `**Research Focus:** ${basePrompt}`;
  }, [selectedPrompt, selectedPersona, includePersonaLens]);

  const copyToClipboard = async () => {
    if (!fullPromptPreview) return;
    
    try {
      await navigator.clipboard.writeText(fullPromptPreview);
      setCopied(true);
      
      toast({
        title: "Prompt copied!",
        description: selectedPersona && includePersonaLens 
          ? `Copied with your ${selectedPersona.name} lens!`
          : "Prompt copied to clipboard!",
      });

      setTimeout(() => setCopied(false), 2000);
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

  const isLoading = promptsLoading || personasLoading;

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

  // Card variant - unified prompt selector (default)
  return (
    <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-sm">
            Query Section {sectionId.toUpperCase()} with AI
          </h3>
          <p className="text-xs text-muted-foreground">
            Get AI-powered answers from 100+ source documents
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Persona Toggle + Selector */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Switch
                id="persona-toggle"
                checked={includePersonaLens}
                onCheckedChange={setIncludePersonaLens}
              />
              <Label htmlFor="persona-toggle" className="text-sm font-medium cursor-pointer">
                Include persona lens
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-xs">
                      Adds research perspective based on your archetype
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Persona Dropdown - only show if toggle is ON */}
            {includePersonaLens && personas && personas.length > 0 && (
              <Select value={selectedPersonaId || ''} onValueChange={setSelectedPersonaId}>
                <SelectTrigger className="w-full h-auto py-2 text-sm">
                  <SelectValue placeholder="Select research persona...">
                    {selectedPersona && (
                      <span className="flex items-center gap-2">
                        <span>{selectedPersona.icon}</span>
                        <span>{selectedPersona.name}</span>
                        <span className="text-muted-foreground hidden sm:inline">—</span>
                        <span className="text-muted-foreground text-xs hidden sm:inline">{selectedPersona.short_desc}</span>
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-[400px] bg-popover">
                  {personas.map((persona) => (
                    <SelectItem key={persona.id} value={persona.id} className="py-3">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{persona.icon}</span>
                        <div className="flex flex-col">
                          <span className="font-medium">{persona.name}</span>
                          <span className="text-xs text-muted-foreground">— {persona.short_desc}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Prompt Selector */}
          {prompts && prompts.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground font-medium">
                Research prompt:
              </Label>
              <Select value={selectedPromptId || ''} onValueChange={setSelectedPromptId}>
                <SelectTrigger className="w-full h-auto py-2 text-sm">
                  <SelectValue placeholder="Select a prompt...">
                    {selectedPrompt && (
                      <span className="flex items-center gap-2">
                        {selectedPrompt.is_primary && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
                        <span>{selectedPrompt.title}</span>
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {prompts.map((prompt) => (
                    <SelectItem key={prompt.id} value={prompt.id} className="py-2">
                      <span className="flex items-center gap-2">
                        {prompt.is_primary && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
                        <span>{prompt.title}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* No prompts fallback */}
          {prompts && prompts.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              No prompts available for this section yet.
            </p>
          )}

          {/* LIVE PREVIEW - Always visible, updates dynamically */}
          {fullPromptPreview && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Eye className="h-3.5 w-3.5" />
                <span className="font-medium">Prompt Preview</span>
              </div>
              <div className="p-3 bg-background/50 rounded-md border border-border text-xs text-foreground/80 whitespace-pre-wrap max-h-40 overflow-y-auto">
                {fullPromptPreview}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="default"
              className="flex-1 gap-2"
              onClick={copyToClipboard}
              disabled={!fullPromptPreview}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy Prompt"}
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={launchNotebookLM}
            >
              <ExternalLink className="h-4 w-4" />
              Open NotebookLM
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            Opens in a new tab. Paste your copied prompt in the chat.
          </p>
        </div>
      )}
    </div>
  );
}
