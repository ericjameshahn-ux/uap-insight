import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Sparkles,
  Clock,
  BarChart3,
  Atom,
  Brain,
  MessageSquare,
  Compass,
  Calendar,
  HelpCircle,
  Lightbulb,
  Users,
  Layers,
  Zap,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PersonaQuiz } from "@/components/PersonaQuiz";
import { supabase, PersonaArchetype } from "@/lib/supabase";
import { LensSelector } from "@/components/LensSelector";

const preconceptions = [
  {
    expectation: "UAP are a recent phenomenon",
    reality: "Documented encounters span decades with consistent patterns",
  },
  {
    expectation: "Most witnesses are unreliable",
    reality: "Many key witnesses are trained military pilots, radar operators, intelligence officers",
  },
  { expectation: "There is no physical evidence", reality: "Multiple sensor systems have simultaneously detected UAP" },
  {
    expectation: "This is fringe conspiracy",
    reality: "Congressional hearings, Pentagon programs, and NASA involvement are documented",
  },
  {
    expectation: "Scientists don't take this seriously",
    reality: "Stanford, Harvard, and other institutions have active researchers",
  },
];

// Journey definitions with paths
const journeyPaths: Record<string, { path: string[]; name: string }> = {
  executive: { path: ["a", "b", "c", "f"], name: "Executive Brief" },
  physics: { path: ["c", "j", "l", "g"], name: "Physics Deep Dive" },
  retrieval: { path: ["b", "g", "k", "f"], name: "Crash Retrieval" },
  consciousness: { path: ["i", "k", "m"], name: "Consciousness Connection" },
};

// UPDATED: Added personas array to each journey
const journeys = [
  {
    id: "executive",
    title: "Executive Brief",
    icon: BarChart3,
    duration: "45 min",
    description: "Core evidence for decision-makers",
    gradient: "from-blue-500/10 to-indigo-500/10",
    personas: ["Empiricist", "Strategist", "Skeptical Analyst"],
  },
  {
    id: "physics",
    title: "Physics Deep Dive",
    icon: Atom,
    duration: "60 min",
    description: "Technical propulsion analysis",
    gradient: "from-purple-500/10 to-pink-500/10",
    personas: ["Technologist", "Empiricist"],
  },
  {
    id: "retrieval",
    title: "Crash Retrieval Evidence",
    icon: BookOpen,
    duration: "50 min",
    description: "Craft possession claims",
    gradient: "from-amber-500/10 to-orange-500/10",
    personas: ["Investigator", "Historian"],
  },
  {
    id: "consciousness",
    title: "Consciousness Connection",
    icon: Brain,
    duration: "55 min",
    description: "UAP and consciousness research",
    gradient: "from-emerald-500/10 to-teal-500/10",
    personas: ["Empiricist", "Historian"],
  },
];

const explorePlatformCards = [
  {
    id: "start",
    icon: BookOpen,
    title: "Start Here",
    description: "Learn the Mosaic Theory framework—how to evaluate evidence in environments of deliberate information suppression.",
    buttonText: "Start Here",
    link: "/framework",
    priority: true,
  },
  {
    id: "quiz",
    icon: Compass,
    title: "Find Your Path",
    description: "Take a short quiz to discover your research style. Get a curated journey through chapters tailored to your interests.",
    buttonText: "Find Your Path",
    link: "/quiz",
    priority: true,
  },
  {
    id: "timeline",
    icon: Calendar,
    title: "Evidence Timeline",
    description: "Explore key events from 1933 to present in chronological order. See official statements, congressional hearings, and documented encounters.",
    buttonText: "View Timeline",
    link: "/timeline",
    priority: false,
  },
  {
    id: "faq",
    icon: HelpCircle,
    title: "Common Questions",
    description: "Browse 110+ frequently asked questions and see where each is answered across our source materials.",
    buttonText: "Browse FAQs",
    link: "/faq",
    priority: false,
  },
  {
    id: "figures",
    icon: Users,
    title: "Key Figures Directory",
    description: "Meet the whistleblowers, officials, and researchers. Filter by credibility tier, see their credentials, and watch their most important interviews.",
    buttonText: "View Figures",
    link: "/figures",
    priority: false,
  },
  {
    id: "claims",
    icon: Layers,
    title: "Claims Database",
    description: "Browse 180+ falsifiable claims with credibility tiers and source attribution. Track what's been verified vs. alleged.",
    buttonText: "Browse Claims",
    link: "/claims",
    priority: false,
  },
];

// Animated counter component
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function Index() {
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<string | null>(null);
  const [stats, setStats] = useState({ claims: 100, figures: 55, sections: 13, videos: 38 });
  const [hasSeenQuiz, setHasSeenQuiz] = useState(false);

  useEffect(() => {
    // Check if user has already taken the quiz
    const pathData = localStorage.getItem("uap_path");
    if (pathData) {
      setHasSeenQuiz(true);
    }
    // REMOVED: Quiz no longer auto-pops - user must click the button

    // Fetch actual stats from database
    const fetchStats = async () => {
      const [claims, figures, sections, videos] = await Promise.all([
        supabase.from("claims").select("id", { count: "exact", head: true }),
        supabase.from("figures").select("id", { count: "exact", head: true }),
        supabase.from("sections").select("id", { count: "exact", head: true }),
        supabase.from("videos").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        claims: claims.count || 100,
        figures: figures.count || 55,
        sections: sections.count || 13,
        videos: videos.count || 38,
      });
    };

    fetchStats();
  }, []);

  const handleQuizComplete = (primary: PersonaArchetype, secondary: PersonaArchetype, path: string[]) => {
    setHasSeenQuiz(true);
    setSelectedJourney(null);
    if (path.length > 0) {
      navigate(`/section/${path[0].toLowerCase()}`);
    }
  };

  const handleExploreFreelyFromQuiz = () => {
    setShowQuiz(false);
    setSelectedJourney(null);
  };

  const startJourneyDirectly = (journeyId: string) => {
    const journey = journeyPaths[journeyId];

    if (!journey) {
      return;
    }

    try {
      localStorage.setItem("uap_path", JSON.stringify(journey.path));
      localStorage.setItem("uap_path_index", "0");
      localStorage.setItem("uap_archetype_name", journey.name);
      localStorage.setItem("uap_archetype_id", journeyId);
    } catch (e) {
      // Silent fail for localStorage errors
    }

    window.dispatchEvent(new StorageEvent("storage", { key: "uap_path" }));
    navigate(`/section/${journey.path[0]}`);
  };

  const handleJourneyClick = (journeyId: string) => {
    // Check if user already has an archetype
    const existingArchetype = localStorage.getItem("uap_archetype_id");

    if (existingArchetype) {
      // User has taken quiz - start journey directly
      startJourneyDirectly(journeyId);
    } else {
      // No archetype - show quiz with skip option
      setSelectedJourney(journeyId);
      setShowQuiz(true);
    }
  };

  const handleSkipQuizAndStartJourney = () => {
    if (selectedJourney) {
      setShowQuiz(false);
      startJourneyDirectly(selectedJourney);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto px-6 py-12">
      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10">
        {/* Hero Section with Gradient Background */}
        <div className="bg-gradient-to-b from-primary/5 to-transparent -mx-6 px-6 pt-8 pb-12 mb-8 rounded-b-3xl">
          {/* Lens Selector - Interactive analytical frame chooser */}
          <LensSelector />

          {/* Churchill Quote - Enhanced */}
          {/* Quotes Section */}
          <div className="max-w-2xl mx-auto mb-12 animate-fade-in">
            <blockquote className="text-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-l-4 border-indigo-500 pl-6 pr-6 py-6 rounded-r-xl shadow-md">
              <p className="font-serif text-2xl md:text-3xl italic text-gray-800 dark:text-gray-100 leading-relaxed">
                "In wartime, truth is so precious that she should always be attended by a bodyguard of lies."
              </p>
              <footer className="mt-4 text-sm text-gray-600 dark:text-gray-300 font-semibold tracking-wide">
                — Winston Churchill
              </footer>
            </blockquote>
            
            <blockquote className="text-center mt-4 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 border-l-4 border-indigo-400/60 pl-5 pr-5 py-4 rounded-r-lg shadow-sm">
              <p className="font-serif text-lg md:text-xl italic text-gray-600 dark:text-gray-300 leading-relaxed">
                "It's easier to fool people than to convince them that they have been fooled"
              </p>
              <footer className="mt-3 text-xs text-gray-500 dark:text-gray-400 tracking-wide">
                — likely not Mark Twain
              </footer>
            </blockquote>
          </div>

          {/* Welcome Card - Enhanced */}
          <div
            className="bg-card p-8 mb-8 animate-fade-in shadow-xl rounded-xl border border-gray-200 dark:border-gray-800"
            style={{ animationDelay: "100ms" }}
          >
            <h1 className="text-2xl font-bold mb-4">Welcome to the UAP Research Navigator</h1>
            <p className="text-muted-foreground leading-relaxed">
              This is a research tool designed for institutional professionals exploring Unidentified Anomalous
              Phenomena (UAP). We focus on <strong className="text-foreground">falsifiable claims</strong> and{" "}
              <strong className="text-foreground">prioritized sources</strong> — evidence that can be evaluated,
              witnesses whose credentials can be verified, and data that has been officially acknowledged.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Each claim is rated by evidence tier, each source by credibility level. Our goal is not to convince, but
              to present the most rigorous available evidence in a structured, navigable format.
            </p>
          </div>
        </div>

        {/* Stats Bar - Enhanced with gradient */}
        <div
          className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 dark:from-indigo-950/30 dark:via-background dark:to-purple-950/30 rounded-xl p-2 mb-8 animate-fade-in shadow-sm"
          style={{ animationDelay: "200ms" }}
        >
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Claims", value: stats.claims, suffix: "+" },
              { label: "Figures", value: stats.figures, suffix: "+" },
              { label: "Sections", value: stats.sections, suffix: "" },
              { label: "Videos", value: stats.videos, suffix: "+" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4 bg-white/60 dark:bg-background/60 rounded-lg backdrop-blur-sm"
              >
                <div className="text-3xl font-bold text-foreground">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* About This Platform Section */}
        <div
          className="bg-card border-l-4 border-indigo-400 rounded-r-xl p-6 mb-8 shadow-md animate-fade-in"
          style={{ animationDelay: "250ms" }}
        >
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="text-lg">🔬</span> About This Research Platform
          </h2>
          
          <p className="text-muted-foreground mb-4 leading-relaxed">
            This site represents an experiment in AI-assisted research infrastructure, built to test whether modern AI tools can create functional, cross-domain research platforms—and to provide professionals with an accessible, structured entry point into UAP disclosure developments.
          </p>
          
          <p className="font-medium text-foreground mb-3">What powers this platform:</p>
          <ul className="text-muted-foreground space-y-2 mb-4 ml-1">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span><strong className="text-foreground">Personal Research</strong> — ~1.5 years of systematic investigation into UAP disclosure</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span><strong className="text-foreground">AI Document Analysis</strong> — Analyses of interviews, documentaries, Congressional hearings, and public records</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span><strong className="text-foreground">NotebookLM Integration</strong> — Library of 100+ source document analyses available for deep-dive queries</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span><strong className="text-foreground">Custom AI Chatbot</strong> — Real-time Q&A powered by Claude API with topic-specific context</span>
            </li>
          </ul>
          
          <p className="font-medium text-foreground mb-2">What you'll find:</p>
          <p className="text-muted-foreground text-sm mb-4">
            <Link to="/quiz" className="text-primary hover:underline">Personalized learning paths</Link> based on your interests and background, <Link to="/timeline" className="text-primary hover:underline">timeline views</Link> tracing events from 1933 to present, <Link to="/claims" className="text-primary hover:underline">falsifiable claims database</Link> with credibility tiers and source attribution, <Link to="/faq" className="text-primary hover:underline">FAQ exploration</Link> for common questions, and <Link to="/framework" className="text-primary hover:underline">Mosaic Theory framework</Link> for evaluating information in environments of deliberate suppression.
          </p>
          
          <p className="text-sm text-muted-foreground/80 italic border-t border-border pt-4 mt-4">
            Each claim is rated by evidence tier. Each source by credibility level. Our goal is not to convince, but to present the most rigorous available evidence in a structured, navigable format.
          </p>
        </div>

        {/* Before You Begin Accordion */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "280ms" }}>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="before-you-begin" className="border border-slate-700 rounded-lg bg-slate-900/50 overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-800/50 [&[data-state=open]>div]:text-amber-400">
                <div className="flex items-center gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span className="font-semibold text-foreground">Before You Begin: Why Most People Don't Go Here</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <p className="text-slate-300 mb-6 leading-relaxed">
                  This topic requires intellectual prerequisites most people aren't willing to meet.
                </p>
                
                {/* Three category summaries */}
                <div className="space-y-4 mb-6">
                  {/* Complexity Barriers */}
                  <div className="flex items-start gap-3 p-4 bg-slate-800/70 rounded-lg border border-slate-600">
                    <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-400 text-sm mb-1">Complexity Barriers</p>
                      <p className="text-slate-200 text-sm">
                        "Don't look if you're not willing to learn about..." fusion physics, 
                        financial forensics, congressional oversight mechanisms
                      </p>
                    </div>
                  </div>
                  
                  {/* Uncomfortable Territory */}
                  <div className="flex items-start gap-3 p-4 bg-slate-800/70 rounded-lg border border-slate-600">
                    <Brain className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-purple-400 text-sm mb-1">Uncomfortable Territory</p>
                      <p className="text-slate-200 text-sm">
                        "Don't look if you're uncomfortable with..." revisiting fundamental beliefs,
                        considering non-human intelligence, having no final answers
                      </p>
                    </div>
                  </div>
                  
                  {/* Professional Risks */}
                  <div className="flex items-start gap-3 p-4 bg-slate-800/70 rounded-lg border border-slate-600">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-400 text-sm mb-1">Professional Risks</p>
                      <p className="text-slate-200 text-sm">
                        "Don't look if you can't afford..." career stigma, 100+ hours of 
                        interdisciplinary homework, guilt by association
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Link to full page */}
                <Link 
                  to="/before-you-begin" 
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors underline underline-offset-2"
                >
                  See the full list of prerequisites
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Primary CTAs - Stack on mobile */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <Button
            size="lg"
            className="flex-1 min-h-[44px] h-14 text-base animate-pulse hover:animate-none shadow-lg shadow-primary/25"
            asChild
          >
            <Link to="/framework">
              <BookOpen className="w-5 h-5 mr-2" />
              Start Here: Learn the Framework
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="flex-1 min-h-[44px] h-14 text-base border-2"
            asChild
          >
            <Link to="/quiz">
              <Sparkles className="w-5 h-5 mr-2" />
              Find Your Path
            </Link>
          </Button>
        </div>
        
        {/* Subtle hint message */}
        <p className="text-center text-sm text-muted-foreground mb-12 animate-fade-in" style={{ animationDelay: "320ms" }}>
          Not sure where to start? Take the quiz to find your personalized research path →
        </p>

        {/* Explore the Platform Section - Reorganized */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: "350ms" }}>
          {/* Priority Cards - Start Here & Find Your Path */}
          <h2 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Recommended Starting Points</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {explorePlatformCards.filter(card => card.priority).map((card) => (
              <div 
                key={card.id} 
                className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-xl p-6 flex flex-col hover:shadow-lg hover:border-primary/40 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{card.description}</p>
                <Button 
                  className="w-full min-h-[44px]"
                  asChild
                >
                  <Link to={card.link}>{card.buttonText}</Link>
                </Button>
              </div>
            ))}
          </div>
          
          {/* Secondary Cards - Explore by Format */}
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Explore by Format</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {explorePlatformCards.filter(card => !card.priority).map((card) => (
              <div 
                key={card.id} 
                className="bg-card border border-border rounded-xl p-6 flex flex-col hover:shadow-lg transition-shadow"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{card.description}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full min-h-[44px]"
                  asChild
                >
                  <Link to={card.link}>{card.buttonText}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Common Preconceptions */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <Accordion type="single" collapsible>
            <AccordionItem value="preconceptions" className="card-elevated border-0 shadow-sm">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <span className="font-semibold">Common Preconceptions</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4">
                  {preconceptions.map((item, i) => (
                    <div key={i} className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Expectation</div>
                        <p className="text-sm">{item.expectation}</p>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-primary mb-1">Reality</div>
                        <p className="text-sm">{item.reality}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* CTA Buttons above Guided Journeys */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-fade-in" style={{ animationDelay: "450ms" }}>
          <button
            onClick={() => {
              setSelectedJourney(null);
              setShowQuiz(true);
            }}
            className="flex items-center gap-4 p-6 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-lg"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-lg">Find Your Path</div>
              <div className="text-sm opacity-80">Take the quiz for a personalized journey</div>
            </div>
          </button>
          <Link
            to="/chat"
            className="flex items-center gap-4 p-6 bg-background border-2 border-primary/20 rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-lg text-foreground">Chat with UAP Navigator AI</div>
              <div className="text-sm text-muted-foreground">Powered by Claude • Personalized to your profile</div>
            </div>
          </Link>
        </div>

        {/* Guided Journeys - Enhanced with Persona Labels */}
        <div className="animate-fade-in" style={{ animationDelay: "500ms" }}>
          <h2 className="text-lg font-semibold mb-4">Guided Journeys</h2>
          <div className="grid grid-cols-2 gap-4">
            {journeys.map((journey) => (
              <button
                key={journey.id}
                onClick={() => handleJourneyClick(journey.id)}
                className={`relative overflow-hidden bg-gradient-to-br ${journey.gradient} p-5 rounded-xl border border-gray-200/50 dark:border-gray-800/50 hover:shadow-xl hover:scale-105 transition-all duration-300 group text-left`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/80 dark:bg-background/80 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <journey.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {journey.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{journey.description}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {journey.duration}
                    </div>
                    {/* NEW: Persona labels */}
                    <div className="mt-2 text-xs text-primary/70">Best for: {journey.personas.join(", ")}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Persona Quiz Modal */}
      <PersonaQuiz
        isOpen={showQuiz}
        onClose={() => {
          setShowQuiz(false);
          setSelectedJourney(null);
        }}
        onComplete={handleQuizComplete}
        onExploreFreelyClick={handleExploreFreelyFromQuiz}
        selectedJourney={selectedJourney}
        onSkipQuizAndStartJourney={handleSkipQuizAndStartJourney}
      />
    </div>
  );
}
