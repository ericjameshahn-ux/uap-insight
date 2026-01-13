import { useState } from "react";
import { Sparkles, ExternalLink, ArrowLeft, FlaskConical, History, Target, Search, Zap, Scale, Microscope, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { PersonaQuiz } from "@/components/PersonaQuiz";
import { PersonaArchetype } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const archetypes = [
  {
    id: "empiricist",
    icon: Microscope,
    emoji: "🔬",
    name: "The Empiricist",
    description: "Sensor data and multi-source confirmation first",
  },
  {
    id: "historian",
    icon: History,
    emoji: "📚",
    name: "The Historian",
    description: "Patterns across decades and policy evolution",
  },
  {
    id: "strategist",
    icon: Target,
    emoji: "♟️",
    name: "The Strategist",
    description: "National security and institutional behavior",
  },
  {
    id: "investigator",
    icon: Search,
    emoji: "🔍",
    name: "The Investigator",
    description: "Case forensics and witness credibility",
  },
  {
    id: "debunker", // Database ID - displays as "The Skeptic"
    icon: Scale,
    emoji: "⚖️",
    name: "The Skeptic",
    description: "Falsification and prosaic explanations first",
  },
  {
    id: "technologist",
    icon: Zap,
    emoji: "⚡",
    name: "The Technologist",
    description: "Physics, propulsion, and materials science",
  },
];

export default function AboutQuiz() {
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);
  const { toast } = useToast();

  const handleSelectProfile = (archetype: typeof archetypes[0]) => {
    // Save persona to localStorage
    localStorage.setItem('uap_primary_archetype', archetype.id);
    localStorage.setItem('uap_archetype_name', archetype.name);
    
    // Show confirmation
    toast({
      title: `Research profile set to ${archetype.name}`,
      description: "Your personalized path is now active.",
    });
    
    // Navigate to Start Here (framework page)
    navigate('/framework');
  };
  const handleQuizComplete = (primary: PersonaArchetype, secondary: PersonaArchetype, path: string[]) => {
    if (path.length > 0) {
      navigate(`/section/${path[0].toLowerCase()}`);
    }
  };

  return (
    <>
      <PersonaQuiz 
        isOpen={showQuiz} 
        onClose={() => setShowQuiz(false)} 
        onComplete={handleQuizComplete}
        onExploreFreelyClick={() => setShowQuiz(false)}
      />
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Back Link */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8 animate-fade-in">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Research Lens Quiz</h1>
          <p className="text-muted-foreground">Discover your analytical approach to evaluating UAP evidence</p>
        </div>
      </div>

      {/* Introduction */}
      <div className="card-elevated p-6 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <p className="text-muted-foreground leading-relaxed">
          The Research Profile Quiz helps personalize your journey through UAP evidence. Based on your 
          background, interests, and approach to evidence, we recommend a tailored path through the 
          13 evidence sections.
        </p>
      </div>

      {/* Archetypes Grid */}
      <div className="mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <h2 className="text-lg font-semibold mb-4">The 6 Research Profiles</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Each research profile offers a curated path through the UAP Navigator's evidence sections. 
          Select your profile below to see content prioritized for your analytical approach.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {archetypes.map((archetype) => (
            <button
              key={archetype.id}
              onClick={() => handleSelectProfile(archetype)}
              className="w-full text-left p-4 rounded-lg border border-border/50 bg-card/30 
                         hover:bg-card/60 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10
                         transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{archetype.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {archetype.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{archetype.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Why Personalization Matters */}
      <div className="mb-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <h2 className="text-lg font-semibold mb-4">Why Personalization Matters</h2>
        <div className="card-elevated p-6">
          <p className="text-muted-foreground leading-relaxed">
            Psychologists recognize that how we approach complex, paradigm-challenging information 
            varies significantly based on our backgrounds and cognitive styles. Some prefer hard data 
            and sensor readings; others are drawn to historical patterns or personal testimonies. 
            By understanding your natural approach, we can present evidence in the order most likely 
            to resonate with your existing frameworks.
          </p>
        </div>
      </div>

      {/* Psychology Today Callout */}
      <div className="card-elevated p-6 border-l-4 border-primary animate-fade-in" style={{ animationDelay: '400ms' }}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <ExternalLink className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">The Psychology of UAP Engagement</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Recent research highlights the psychological dimensions of engaging with UAP evidence 
              and why this topic can be challenging to process.
            </p>
            <Button variant="outline" asChild>
              <a 
                href="https://www.psychologytoday.com/us/blog/living-forward/202512/why-is-no-one-talking-about-the-aliens" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Read Psychology Today Article
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Take Quiz CTA */}
      <div className="mt-12 bg-primary text-primary-foreground rounded-xl p-8 text-center animate-fade-in" style={{ animationDelay: '500ms' }}>
        <h3 className="text-2xl font-bold mb-2">Ready to find your research profile?</h3>
        <p className="text-primary-foreground/80 mb-6">
          Answer 5 quick questions to get your personalized learning path.
        </p>
        <Button 
          size="lg" 
          variant="secondary" 
          className="shadow-lg"
          onClick={() => setShowQuiz(true)}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Start the Quiz
        </Button>
      </div>
    </div>
    </>
  );
}
