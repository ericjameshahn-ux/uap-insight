import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  PlayCircle,
  Sparkles,
  Clock,
  BarChart3,
  Atom,
  Brain,
  ExternalLink,
  Video,
  Target,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PersonaQuiz } from "@/components/PersonaQuiz";
import { supabase, PersonaArchetype } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";

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
    personas: ["Experiencer", "Meaning-Seeker"],
  },
];

const featuredAnalysis = [
  {
    id: "mellon",
    title: "USAF UAP Suppression",
    subtitle: "Former Deputy Assistant Secretary of Defense for Intelligence",
    name: "Chris Mellon",
    text: "Christopher Mellon alleges the US Air Force is actively suppressing UAP data, citing General James Clapper's admission of a secret 1990s monitoring program. Details include seizing USS Princeton radar data, enforcing NDAs on pilots, and withholding NORAD data from Congress.",
    badge: "HIGH",
    buttonText: "Watch Interview",
    buttonUrl: "https://youtu.be/kBFgexrONyA",
    icon: Video,
  },
  {
    id: "mellon2",
    title: "Pentagon UAP Secrecy",
    subtitle: "Christopher Mellon, Former Deputy Assistant Secretary of Defense",
    name: "Chris Mellon",
    text: "Mellon details how UAP information is being withheld from Congress, the history of government UAP programs, and why disclosure is a national security imperative.",
    badge: "HIGH",
    buttonText: "Watch Interview",
    buttonUrl: "https://youtu.be/FuyVlw4EOWs",
    icon: Target,
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

    console.log("🔵 Starting journey directly:");
    console.log("  Journey ID:", journeyId);
    console.log("  Journey object:", journey);

    if (!journey) {
      console.error("❌ Journey not found for ID:", journeyId);
      console.log("  Available journeys:", Object.keys(journeyPaths));
      return;
    }

    console.log("  Path:", journey.path);
    console.log("  Name:", journey.name);

    try {
      // Store path in localStorage
      localStorage.setItem("uap_path", JSON.stringify(journey.path));
      localStorage.setItem("uap_path_index", "0");
      localStorage.setItem("uap_archetype_name", journey.name);
      localStorage.setItem("uap_archetype_id", journeyId);

      // Verify saved data
      console.log("✅ Verify saved - uap_path:", localStorage.getItem("uap_path"));
      console.log("✅ Verify saved - uap_archetype_name:", localStorage.getItem("uap_archetype_name"));
    } catch (e) {
      console.error("❌ Error saving to localStorage:", e);
    }

    // Dispatch storage event to notify other components
    window.dispatchEvent(new StorageEvent("storage", { key: "uap_path" }));

    // Navigate to first section
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
          {/* Churchill Quote - Enhanced */}
          <blockquote className="text-center mb-12 animate-fade-in bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-l-4 border-indigo-500 pl-6 pr-6 py-6 rounded-r-xl max-w-2xl mx-auto shadow-md">
            <p className="font-serif text-2xl md:text-3xl italic text-gray-800 dark:text-gray-100 leading-relaxed">
              "In wartime, truth is so precious that she should always be attended by a bodyguard of lies."
            </p>
            <footer className="mt-4 text-sm text-gray-600 dark:text-gray-300 font-semibold tracking-wide">
              — Winston Churchill
            </footer>
          </blockquote>

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

        {/* Primary CTAs */}
        <div className="flex gap-4 mb-12 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <Button
            size="lg"
            className="flex-1 h-14 text-base animate-pulse hover:animate-none shadow-lg shadow-primary/25"
            onClick={() => {
              setSelectedJourney(null);
              setShowQuiz(true);
            }}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Take the Persona Quiz
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="flex-1 h-14 text-base"
            onClick={() => window.open('https://www.amazon.com/Age-Disclosure-Dan-Farah/dp/B0FMF6VFCT', '_blank', 'noopener,noreferrer')}
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            Start with Age of Disclosure
          </Button>
        </div>

        {/* Featured Analysis Section */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: "350ms" }}>
          <h2 className="text-lg font-semibold mb-4">Featured Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredAnalysis.map((item) => (
              <div key={item.id} className="card-elevated p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{item.title}</h3>
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20 shrink-0">
                        {item.badge}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.text}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.open(item.buttonUrl, '_blank', 'noopener,noreferrer')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {item.buttonText}
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
              <div className="font-semibold text-lg">Take the Persona Quiz</div>
              <div className="text-sm opacity-80">Get your personalized research path</div>
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
