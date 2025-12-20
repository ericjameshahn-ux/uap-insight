import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, PlayCircle, ChevronDown, Sparkles, Clock, BarChart3, Atom, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PersonaQuiz } from "@/components/PersonaQuiz";
import { supabase, PersonaArchetype } from "@/lib/supabase";

const preconceptions = [
  { expectation: "UAP are a recent phenomenon", reality: "Documented encounters span decades with consistent patterns" },
  { expectation: "Most witnesses are unreliable", reality: "Many key witnesses are trained military pilots, radar operators, intelligence officers" },
  { expectation: "There is no physical evidence", reality: "Multiple sensor systems have simultaneously detected UAP" },
  { expectation: "This is fringe conspiracy", reality: "Congressional hearings, Pentagon programs, and NASA involvement are documented" },
  { expectation: "Scientists don't take this seriously", reality: "Stanford, Harvard, and other institutions have active researchers" },
];

const journeys = [
  { id: "executive", title: "Executive Brief", icon: BarChart3, duration: "45 min", description: "Core evidence for decision-makers" },
  { id: "physics", title: "Physics Deep Dive", icon: Atom, duration: "60 min", description: "Technical propulsion analysis" },
  { id: "retrieval", title: "Crash Retrieval Evidence", icon: BookOpen, duration: "50 min", description: "Craft possession claims" },
  { id: "consciousness", title: "Consciousness Connection", icon: Brain, duration: "55 min", description: "UAP and consciousness research" },
];

export default function Index() {
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);
  const [stats, setStats] = useState({ claims: 100, figures: 55, sections: 13, videos: 38 });
  const [hasSeenQuiz, setHasSeenQuiz] = useState(false);

  useEffect(() => {
    // Check if user has already taken the quiz
    const quizData = localStorage.getItem('uap-persona-quiz');
    if (quizData) {
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

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Churchill Quote */}
      <blockquote className="text-center mb-12 animate-fade-in">
        <p className="font-serif text-xl italic text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          "In wartime, truth is so precious that she should always be attended by a bodyguard of lies."
        </p>
        <footer className="mt-3 text-sm text-muted-foreground">
          — Winston Churchill
        </footer>
      </blockquote>

      {/* Welcome Card */}
      <div className="card-elevated p-8 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
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

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
        {[
          { label: "Claims", value: `${stats.claims}+` },
          { label: "Figures", value: `${stats.figures}+` },
          { label: "Sections", value: stats.sections },
          { label: "Videos", value: `${stats.videos}+` },
        ].map((stat) => (
          <div key={stat.label} className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Primary CTAs */}
      <div className="flex gap-4 mb-12 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <Button 
          size="lg" 
          className="flex-1 h-14 text-base"
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
            href="https://www.amazon.com/Age-Disclosure-Larry-Maguire/dp/B0CL38R56S" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            Start with Age of Disclosure
          </a>
        </Button>
      </div>

      {/* Common Preconceptions */}
      <div className="mb-12 animate-fade-in" style={{ animationDelay: '400ms' }}>
        <Accordion type="single" collapsible>
          <AccordionItem value="preconceptions" className="card-elevated border-0">
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

      {/* Guided Journeys */}
      <div className="animate-fade-in" style={{ animationDelay: '500ms' }}>
        <h2 className="text-lg font-semibold mb-4">Guided Journeys</h2>
        <div className="grid grid-cols-2 gap-4">
          {journeys.map((journey) => (
            <Link
              key={journey.id}
              to={`/journey/${journey.id}`}
              className="card-elevated p-5 hover:shadow-md transition-all group"
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
            </Link>
          ))}
        </div>
      </div>

      {/* Persona Quiz Modal */}
      <PersonaQuiz 
        isOpen={showQuiz} 
        onClose={() => setShowQuiz(false)}
        onComplete={handleQuizComplete}
      />
    </div>
  );
}
