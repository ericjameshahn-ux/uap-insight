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
            <h1 className="font-semibold">UAP Research Assistant</h1>
            <p className="text-xs text-muted-foreground">AI-powered responses with sources</p>
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