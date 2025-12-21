import { useState, useEffect, useRef } from "react";
import { Send, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// Archetype display names, icons, and descriptions
const archetypeInfo: Record<string, { name: string; icon: string; description: string }> = {
  empiricist: { name: "The Empiricist", icon: "🔬", description: "rigorous scientific methodology and measurable data" },
  investigator: { name: "The Investigator", icon: "🔍", description: "detailed forensic analysis and evidence chains" },
  strategist: { name: "The Strategist", icon: "♟️", description: "geopolitical implications and institutional dynamics" },
  technologist: { name: "The Technologist", icon: "⚙️", description: "engineering analysis and propulsion systems" },
  historian: { name: "The Historian", icon: "📜", description: "historical patterns and documented cases over time" },
  meaning_seeker: { name: "The Meaning Seeker", icon: "🌌", description: "deeper implications for humanity and consciousness" },
  debunker: { name: "The Debunker", icon: "🎯", description: "critical evaluation and identifying conventional explanations" },
  experiencer: { name: "The Experiencer", icon: "✨", description: "firsthand accounts and phenomenological evidence" },
  scientist: { name: "The Scientist", icon: "⚛️", description: "theoretical physics and scientific anomalies" },
  policymaker: { name: "The Policymaker", icon: "🏛️", description: "policy implications and government accountability" },
  philosopher: { name: "The Philosopher", icon: "💭", description: "epistemological questions and paradigm implications" },
  skeptic: { name: "The Skeptic", icon: "🤔", description: "demanding extraordinary evidence for extraordinary claims" },
};

const formatArchetype = (archetype: string): string => {
  const names: Record<string, string> = {
    empiricist: "The Empiricist 🔬",
    historian: "The Historian 📚",
    strategist: "The Strategist ♟️",
    investigator: "The Investigator 🔍",
    experiencer: "The Experiencer ✨",
    technologist: "The Technologist ⚡",
    debunker: "The Skeptical Analyst ⚖️",
    meaning_seeker: "The Meaning-Seeker 🌌"
  };
  return names[archetype] || archetype;
};

const getPersonaEmphasis = (archetype: string): string => {
  const emphases: Record<string, string> = {
    empiricist: "sensor data, official documents, and reproducible evidence",
    historian: "historical context, timelines, and pattern recognition",
    strategist: "national security implications and policy dynamics",
    investigator: "case details, witness credibility, and forensic analysis",
    experiencer: "first-person accounts and consciousness research",
    technologist: "propulsion physics, engineering specs, and technical analysis",
    debunker: "prosaic explanations and methodological rigor",
    meaning_seeker: "philosophical implications and existential questions"
  };
  return emphases[archetype] || "balanced analysis";
};

const getImplications = (responseText: string): string => {
  const text = responseText.toLowerCase();
  
  if (text.includes('retrieval') || text.includes('craft') || text.includes('material') || text.includes('reverse engineer')) {
    return "claims in this area have implications for advanced materials science, aerospace engineering, and energy technology sectors. Early positioning in metamaterials, novel propulsion, and energy storage could prove strategically significant.";
  }
  
  if (text.includes('consciousness') || text.includes('telepathic') || text.includes('experiencer') || text.includes('remote viewing')) {
    return "these phenomena have implications for neuroscience, consciousness research, and human-machine interfaces. Understanding non-local consciousness could reshape AI development, medical diagnostics, and communication technologies.";
  }
  
  if (text.includes('congress') || text.includes('legislation') || text.includes('oversight') || text.includes('disclosure')) {
    return "legislative developments have implications for government contracting, defense procurement, and regulatory frameworks. Increased transparency requirements may trigger reallocation of classified program funding and new oversight mechanisms.";
  }
  
  if (text.includes('physics') || text.includes('propulsion') || text.includes('energy') || text.includes('antigravity')) {
    return "breakthrough physics claims have implications for energy systems, propulsion technology, and fundamental science. Validated exotic physics would disrupt energy markets, transportation, and space exploration economics.";
  }
  
  if (text.includes('biological') || text.includes('non-human') || text.includes('intelligence') || text.includes('nhi')) {
    return "evidence of non-human intelligence would be the most significant scientific discovery in human history, with implications for biotechnology, xenobiology, and every sector of human knowledge and commerce.";
  }
  
  if (text.includes('witness') || text.includes('testimony') || text.includes('whistleblower')) {
    return "credentialed witness testimony shapes the evidentiary foundation for policy action. The credibility and consistency of these accounts influences legislative momentum and public awareness trajectories.";
  }
  
  return "this research area carries implications for aerospace, defense, energy, and emerging technology sectors. Information asymmetry creates both risks and opportunities for stakeholders tracking these developments.";
};

const suggestedQuestions = [
  "What physical evidence exists for UAPs?",
  "Who are the key whistleblowers?",
  "What did Congress learn in 2023?",
  "How credible is David Grusch?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userArchetype, setUserArchetype] = useState<string>("empiricist");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Get user archetype from localStorage
    const archetype = localStorage.getItem("uap_archetype_id") || "empiricist";
    setUserArchetype(archetype);

    // Add welcome message
    const archetypeDisplay = archetypeInfo[archetype] || archetypeInfo.empiricist;
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `Welcome! I'm your UAP research assistant, tailored for ${archetypeDisplay.name} ${archetypeDisplay.icon}. Ask me anything about UAP phenomena, evidence, key figures, or recent developments.`,
      },
    ]);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          message: text,
          archetype: userArchetype,
          conversationHistory,
        },
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Failed to get response");
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data?.response || data?.message || "I couldn't generate a response. Please try again.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get AI response. Please try again.");
      
      // Remove the user message if the request failed
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSend(question);
  };

  const archetypeDisplay = archetypeInfo[userArchetype] || archetypeInfo.empiricist;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold">UAP Navigator AI</h1>
            <p className="text-xs text-muted-foreground">Powered by Claude • Personalized for {archetypeDisplay.name}</p>
          </div>
        </div>
        <Badge variant="secondary" className="gap-1.5">
          <span>{archetypeDisplay.icon}</span>
          <span>{archetypeDisplay.name}</span>
        </Badge>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {/* Footer for assistant messages (excluding welcome) */}
                {message.role === "assistant" && message.id !== "welcome" && (
                  <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                    {/* Implications Note */}
                    <div className="bg-slate-100 dark:bg-slate-800/50 rounded-md p-3 text-sm text-slate-600 dark:text-slate-300">
                      <p className="font-medium text-slate-700 dark:text-slate-200 mb-1">💡 Why This Matters:</p>
                      <p>If validated, {getImplications(message.content)}</p>
                    </div>
                    
                    {/* Model & Persona Info */}
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Model:</span> Claude Sonnet 4 | 
                      <span className="font-medium ml-2">Tailored for:</span> {userArchetype ? `${formatArchetype(userArchetype)} - emphasizing ${getPersonaEmphasis(userArchetype)}` : 'General balanced analysis'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Suggested Questions */}
      <div className="px-4 py-2 border-t border-border">
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((question, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestedQuestion(question)}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-full transition-colors disabled:opacity-50"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about UAP evidence, key figures, or recent developments..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}