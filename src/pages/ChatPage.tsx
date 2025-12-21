import { useState, useEffect, useRef } from "react";
import { Send, ExternalLink, Bot, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface FAQResponse {
  id: string;
  question: string;
  acknowledgment: string;
  evidence: string;
  sources: string[];
  persona_tags: string[];
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  faqMatch?: FAQResponse;
  isNoMatch?: boolean;
  generatedPrompt?: string;
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
  executive: { name: "Executive Brief", icon: "📊", description: "high-level summaries and key takeaways" },
  physics: { name: "Physics Deep Dive", icon: "⚛️", description: "theoretical physics implications" },
  retrieval: { name: "Crash Retrieval", icon: "🛸", description: "crash retrieval program claims" },
  consciousness: { name: "Consciousness Connection", icon: "🧠", description: "consciousness and non-human intelligence connections" },
};

const suggestedQuestions = [
  "Isn't this all misidentified aircraft?",
  "Why hasn't evidence leaked?",
  "What physical evidence exists?",
  "How can craft violate physics?",
];

const AI_ASSISTANT_URL = "https://notebooklm.google.com/notebook/66050f25-44cd-4b42-9de0-46ba9979aad7";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [faqResponses, setFaqResponses] = useState<FAQResponse[]>([]);
  const [userArchetype, setUserArchetype] = useState<string>("empiricist");
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate a research prompt for unmatched questions
  const generatePrompt = (userQuestion: string, archetypeName: string, description: string) => {
    return `I'm researching UAP/UFO phenomena as someone with a ${archetypeName} approach (focused on ${description}).

My question: ${userQuestion}

Please provide:
1. A balanced assessment acknowledging both skeptical and supportive perspectives
2. The strongest publicly available evidence relevant to this question
3. Key credentialed sources I should investigate
4. What would change your assessment (falsifiability)

Be specific about evidence tiers: distinguish between official government acknowledgment, credentialed witness testimony, and unverified claims.`;
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPromptId(messageId);
      toast.success("Prompt copied to clipboard!");
      setTimeout(() => setCopiedPromptId(null), 2000);
    } catch (err) {
      toast.error("Failed to copy prompt");
    }
  };

  useEffect(() => {
    // Get user archetype from localStorage (use uap_archetype_id)
    const archetype = localStorage.getItem("uap_archetype_id") || "empiricist";
    setUserArchetype(archetype);

    // Fetch FAQ responses
    const fetchFAQs = async () => {
      const { data, error } = await supabase
        .from("faq_responses")
        .select("*");
      
      if (data && !error) {
        // Parse sources if stored as JSON string
        const parsed = data.map((faq: any) => ({
          ...faq,
          sources: typeof faq.sources === 'string' ? JSON.parse(faq.sources) : faq.sources || [],
          persona_tags: typeof faq.persona_tags === 'string' ? JSON.parse(faq.persona_tags) : faq.persona_tags || [],
        }));
        setFaqResponses(parsed);
      }
    };
    fetchFAQs();

    // Add welcome message
    const archetypeDisplay = archetypeInfo[archetype] || archetypeInfo.empiricist;
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `Welcome! I'm your research assistant, tailored for ${archetypeDisplay.name} ${archetypeDisplay.icon}. Ask me common skeptical questions about UAP research, and I'll provide evidence-based responses with sources.`,
      },
    ]);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Find matching FAQ using keyword similarity
  const findMatchingFAQ = (query: string): FAQResponse | null => {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 3);

    let bestMatch: FAQResponse | null = null;
    let bestScore = 0;

    for (const faq of faqResponses) {
      const questionLower = faq.question.toLowerCase();
      
      // Check for direct substring match
      if (questionLower.includes(queryLower) || queryLower.includes(questionLower.slice(0, 30))) {
        return faq;
      }

      // Count matching keywords
      let score = 0;
      for (const word of queryWords) {
        if (questionLower.includes(word)) {
          score += 1;
        }
      }

      // Prioritize FAQs matching user's archetype
      if (userArchetype && faq.persona_tags?.includes(userArchetype)) {
        score += 0.5;
      }

      if (score > bestScore && score >= 2) {
        bestScore = score;
        bestMatch = faq;
      }
    }

    return bestMatch;
  };

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

    // Simulate thinking delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find matching FAQ
    const match = findMatchingFAQ(userMessage.content);

    const archetypeData = archetypeInfo[userArchetype] || archetypeInfo.empiricist;
    const generatedPrompt = !match 
      ? generatePrompt(userMessage.content, archetypeData.name, archetypeData.description)
      : undefined;

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: match ? "" : "I don't have a pre-researched answer for that specific question.",
      faqMatch: match || undefined,
      isNoMatch: !match,
      generatedPrompt,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
    inputRef.current?.focus();
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
            <h1 className="font-semibold">Research Assistant</h1>
            <p className="text-xs text-muted-foreground">FAQ-based responses with sources</p>
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
                {/* Simple text message */}
                {message.content && !message.faqMatch && !message.isNoMatch && (
                  <p className="text-sm">{message.content}</p>
                )}

                {/* FAQ Match Response */}
                {message.faqMatch && (
                  <div className="space-y-3">
                    {/* Acknowledgment */}
                    <p className="text-sm italic text-muted-foreground">
                      {message.faqMatch.acknowledgment}
                    </p>
                    
                    {/* Evidence */}
                    <p className="text-sm">{message.faqMatch.evidence}</p>
                    
                    {/* Sources */}
                    {message.faqMatch.sources && message.faqMatch.sources.length > 0 && (
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-xs font-medium text-muted-foreground mb-1.5">
                          Explore Further:
                        </p>
                        <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                          {message.faqMatch.sources.map((source, idx) => (
                            <li key={idx}>{source}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* No Match Response with Generated Prompt */}
                {message.isNoMatch && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{message.content}</p>
                    
                    {message.generatedPrompt && (
                      <div className="bg-background/50 p-4 rounded-lg border border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Ready-to-use prompt:</span>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => copyToClipboard(message.generatedPrompt!, message.id)}
                            className="gap-1.5 h-7"
                          >
                            {copiedPromptId === message.id ? (
                              <>
                                <Check className="w-3 h-3" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                        <pre className="text-xs whitespace-pre-wrap bg-muted p-3 rounded border border-border/30 max-h-40 overflow-y-auto">
                          {message.generatedPrompt}
                        </pre>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                      <Button variant="outline" size="sm" asChild className="gap-1.5">
                        <a href={AI_ASSISTANT_URL} target="_blank" rel="noopener noreferrer">
                          NotebookLM
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="gap-1.5">
                        <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">
                          Claude
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="gap-1.5">
                        <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer">
                          ChatGPT
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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
            placeholder="Ask a skeptical question about UAP research..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Responses are matched from our FAQ database. For deeper research, use the{" "}
          <a
            href={AI_ASSISTANT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            AI Research Assistant
          </a>
          .
        </p>
      </div>
    </div>
  );
}