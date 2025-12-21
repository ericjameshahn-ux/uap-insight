import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Send, ExternalLink, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";

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
}

// Archetype display names and icons
const archetypeInfo: Record<string, { name: string; icon: string }> = {
  empiricist: { name: "The Empiricist", icon: "🔬" },
  investigator: { name: "The Investigator", icon: "🔍" },
  strategist: { name: "The Strategist", icon: "♟️" },
  technologist: { name: "The Technologist", icon: "⚙️" },
  historian: { name: "The Historian", icon: "📜" },
  meaning_seeker: { name: "The Meaning Seeker", icon: "🌌" },
  debunker: { name: "The Debunker", icon: "🎯" },
  experiencer: { name: "The Experiencer", icon: "✨" },
};

const AI_ASSISTANT_URL = "https://notebooklm.google.com/notebook/66050f25-44cd-4b42-9de0-46ba9979aad7";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [faqResponses, setFaqResponses] = useState<FAQResponse[]>([]);
  const [userArchetype, setUserArchetype] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Get user archetype from localStorage
    const archetype = localStorage.getItem("uap_archetype");
    setUserArchetype(archetype);

    // Fetch FAQ responses
    const fetchFAQs = async () => {
      const { data, error } = await supabase
        .from("faq_responses")
        .select("*");
      
      if (data && !error) {
        setFaqResponses(data);
      }
    };
    fetchFAQs();

    // Add welcome message
    const archetypeDisplay = archetype ? archetypeInfo[archetype] : null;
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: archetypeDisplay 
          ? `Welcome! I'm your research assistant, tailored for ${archetypeDisplay.name} ${archetypeDisplay.icon}. Ask me common skeptical questions about UAP research, and I'll provide evidence-based responses with sources.`
          : `Welcome! Ask me common skeptical questions about UAP research, and I'll provide evidence-based responses with sources. Take the persona quiz to get personalized responses!`,
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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate thinking delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find matching FAQ
    const match = findMatchingFAQ(userMessage.content);

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: match ? "" : "I couldn't find a pre-built response for that specific question.",
      faqMatch: match || undefined,
      isNoMatch: !match,
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

  const archetypeDisplay = userArchetype ? archetypeInfo[userArchetype] : null;

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
        {archetypeDisplay && (
          <Badge variant="secondary" className="gap-1.5">
            <span>{archetypeDisplay.icon}</span>
            <span>Chatting as: {archetypeDisplay.name}</span>
          </Badge>
        )}
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
                        <div className="flex flex-wrap gap-1.5">
                          {message.faqMatch.sources.map((source, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs cursor-pointer hover:bg-primary/10"
                            >
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* No Match Response */}
                {message.isNoMatch && (
                  <div className="space-y-3">
                    <p className="text-sm">{message.content}</p>
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-2">
                        For questions beyond our FAQ, try the AI Research Assistant:
                      </p>
                      <a
                        href={AI_ASSISTANT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                      >
                        <Sparkles className="w-3 h-3" />
                        Open NotebookLM Assistant
                        <ExternalLink className="w-3 h-3" />
                      </a>
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
          <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
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
