import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, PlayCircle, ChevronDown, Sparkles, Clock, BarChart3, Atom, Brain, ExternalLink, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PersonaQuiz } from "@/components/PersonaQuiz";
import { supabase, PersonaArchetype } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";

const preconceptions = [
  { expectation: "UAP are a recent phenomenon", reality: "Documented encounters span decades with consistent patterns" },
  { expectation: "Most witnesses are unreliable", reality: "Many key witnesses are trained military pilots, radar operators, intelligence officers" },
  { expectation: "There is no physical evidence", reality: "Multiple sensor systems have simultaneously detected UAP" },
  { expectation: "This is fringe conspiracy", reality: "Congressional hearings, Pentagon programs, and NASA involvement are documented" },
  { expectation: "Scientists don't take this seriously", reality: "Stanford, Harvard, and other institutions have active researchers" },
];

const journeys = [
  { id: "executive", title: "Executive Brief", icon: BarChart3, duration: "45 min", description: "Core evidence for decision-makers", suggestedArchetype: "empiricist" },
  { id: "physics", title: "Physics Deep Dive", icon: Atom, duration: "60 min", description: "Technical propulsion analysis", suggestedArchetype: "scientist" },
  { id: "retrieval", title: "Crash Retrieval Evidence", icon: BookOpen, duration: "50 min", description: "Craft possession claims", suggestedArchetype: "investigator" },
  { id: "consciousness", title: "Consciousness Connection", icon: Brain, duration: "55 min", description: "UAP and consciousness research", suggestedArchetype: "experiencer" },
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
    id: "guthrie",
    title: "Legal Framework for Disclosure",
    subtitle: "Former Counsel, Federal Reserve Bank of NY; Former Senate Foreign Relations Committee",
    name: "Dillon Guthrie",
    text: "Presented 'Five Challenges and Opportunities in Disclosure' at Yale University (Nov 2025). Key finding: No legal barrier prevents sharing classified UAP info with Congress. No person has ever been prosecuted for disclosing classified information to Congress in private.",
    badge: "HIGH",
    buttonText: "Explore Section F",
    buttonUrl: "/section/f",
    isInternal: true,
    icon: FileText,
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
  
  return <span>{count}{suffix}</span>;
}

export default function Index() {
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);
  const [stats, setStats] = useState({ claims: 100, figures: 55, sections: 13, videos: 38 });
  const [hasSeenQuiz, setHasSeenQuiz] = useState(false);

  useEffect(() => {
    // Check if user has already taken the quiz
    const pathData = localStorage.getItem('uap_path');
    if (pathData) {
      setHasSeenQuiz(true);
    } else {
      // Show quiz on first visit after a short delay
      const timer = setTimeout(() => setShowQuiz(true), 1500);
      return () => clearTimeout(timer);
    }

    // Fetch actual stats from database
    const fetchStats = async () => {
      const [claims, figures, sections, videos] = await Promise.all([
        supabase.from('claims').select('id', { count: 'exact', head: true }),
        supabase.from('figures').select('id', { count: 'exact', head: true }),
        supabase.from('sections').select('id', { count: 'exact', head: true }),
        supabase.from('videos').select('id', { count: 'exact', head: true }),
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
    if (path.length > 0) {
      navigate(`/section/${path[0].toLowerCase()}`);
    }
  };

  const handleExploreFreelyFromQuiz = () => {
    setShowQuiz(false);
  };

  const handleJourneyClick = (journeyId: string) => {
    // Open quiz - the journey cards now suggest taking the quiz
    setShowQuiz(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-b from-primary/5 to-transparent -mx-6 px-6 pt-8 pb-12 mb-8 rounded-b-3xl">
        {/* Churchill Quote */}
        <blockquote className="text-center mb-12 animate-fade-in border-l-4 border-primary/40 pl-6 py-4 bg-card/50 rounded-r-lg max-w-2xl mx-auto">
          <p className="font-serif text-xl italic text-muted-foreground leading-relaxed">
            "In wartime, truth is so precious that she should always be attended by a bodyguard of lies."
          </p>
          <footer className="mt-3 text-sm text-muted-foreground font-medium">
            — Winston Churchill
          </footer>
        </blockquote>

        {/* Welcome Card */}
        <div className="card-elevated p-8 mb-8 animate-fade-in shadow-lg" style={{ animationDelay: '100ms' }}>
          <h1 className="text-2xl font-bold mb-4">Welcome to the UAP Research Navigator</h1>
          <p className="text-muted-foreground leading-relaxed">
            This is a research tool designed for institutional professionals exploring Unidentified Anomalous Phenomena (UAP). 
            We focus on <strong>falsifiable claims</strong> and <strong>prioritized sources</strong> — evidence that can be evaluated, 
            witnesses whose credentials can be verified, and data that has been officially acknowledged.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Each claim is rated by evidence tier, each source by credibility level. Our goal is not to convince, 
            but to present the most rigorous available evidence in a structured, navigable format.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
        {[
          { label: "Claims", value: stats.claims, suffix: "+" },
          { label: "Figures", value: stats.figures, suffix: "+" },
          { label: "Sections", value: stats.sections, suffix: "" },
          { label: "Videos", value: stats.videos, suffix: "+" },
        ].map((stat) => (
          <div key={stat.label} className="text-center p-4 bg-muted/50 rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-foreground">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Primary CTAs */}
      <div className="flex gap-4 mb-12 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <Button 
          size="lg" 
          className="flex-1 h-14 text-base animate-pulse hover:animate-none shadow-lg shadow-primary/25"
          onClick={() => setShowQuiz(true)}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Take the Persona Quiz
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="flex-1 h-14 text-base"
          asChild
        >
          <a 
            href="https://www.amazon.com/Age-Disclosure-Dan-Farah/dp/B0FMF6VFCT" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            Start with Age of Disclosure
          </a>
        </Button>
      </div>

      {/* Featured Analysis Section */}
      <div className="mb-12 animate-fade-in" style={{ animationDelay: '350ms' }}>
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
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {item.text}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                asChild
              >
                {(item as any).isInternal ? (
                  <Link to={item.buttonUrl}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {item.buttonText}
                  </Link>
                ) : (
                  <a href={item.buttonUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {item.buttonText}
                  </a>
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Common Preconceptions */}
      <div className="mb-12 animate-fade-in" style={{ animationDelay: '400ms' }}>
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

      {/* Guided Journeys - Now link to quiz */}
      <div className="animate-fade-in" style={{ animationDelay: '500ms' }}>
        <h2 className="text-lg font-semibold mb-4">Guided Journeys</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Take the quiz to get a personalized path through the evidence based on your research style.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {journeys.map((journey) => (
            <button
              key={journey.id}
              onClick={() => handleJourneyClick(journey.id)}
              className="card-elevated p-5 hover:shadow-md transition-all group text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <journey.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {journey.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{journey.description}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {journey.duration}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Persona Quiz Modal */}
      <PersonaQuiz 
        isOpen={showQuiz} 
        onClose={() => setShowQuiz(false)}
        onComplete={handleQuizComplete}
        onExploreFreelyClick={handleExploreFreelyFromQuiz}
      />
    </div>
  );
}