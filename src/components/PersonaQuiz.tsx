import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, Sparkles, Play, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase, PersonaQuestion, PersonaArchetype, getUserId } from "@/lib/supabase";
import { cn } from "@/lib/utils";

// Journey path mappings
const journeyPaths: Record<string, { path: string[], name: string }> = {
  executive: { path: ["a", "b", "c", "f"], name: "Executive Brief" },
  physics: { path: ["c", "j", "l", "g"], name: "Physics Deep Dive" },
  retrieval: { path: ["b", "g", "k", "f"], name: "Crash Retrieval" },
  consciousness: { path: ["i", "k", "m"], name: "Consciousness Connection" },
};

// CONDENSED QUIZ: Only use these 5 high-signal questions
// Q1: Why exploring (motivation)
// Q2: Evidence type (learning style)
// Q3: Current stance (belief spectrum)
// Q7: STEM comfort (technical routing)
// Q10: What you want (outcome)
const CONDENSED_QUESTION_NUMBERS = [1, 2, 3, 7, 10];

interface PersonaQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (primary: PersonaArchetype, secondary: PersonaArchetype, path: string[]) => void;
  onExploreFreelyClick?: () => void;
  selectedJourney?: string | null;
  onSkipQuizAndStartJourney?: () => void;
}

// Fallback questions for condensed quiz (5 questions)
const fallbackQuestions: PersonaQuestion[] = [
  {
    id: '1',
    question_number: 1,
    question_text: "Why are you exploring UAP?",
    options: [
      { label: "Curiosity / I heard something interesting", value: "curiosity" },
      { label: "Personal experience I want to understand", value: "experience" },
      { label: "National security & policy implications", value: "security" },
      { label: "Science/physics interest", value: "science" },
      { label: "Investment/tech scouting", value: "investment" },
      { label: "Spiritual/metaphysical questions", value: "spiritual" }
    ],
    scoring_map: {
      curiosity: ["empiricist", "historian"],
      experience: ["investigator"],
      security: ["strategist"],
      science: ["empiricist", "technologist"],
      investment: ["technologist"],
      spiritual: ["historian", "investigator"]
    }
  },
  {
    id: '2',
    question_number: 2,
    question_text: "What type of evidence moves you most?",
    options: [
      { label: "Sensor/instrument data (radar, infrared, etc.)", value: "sensor" },
      { label: "Official documents and reports", value: "documents" },
      { label: "Multiple independent witnesses", value: "witnesses" },
      { label: "Patterns across history and cultures", value: "patterns" },
      { label: "First-person experiencer accounts", value: "experiencer" },
      { label: "Big picture plausibility arguments", value: "bigpicture" }
    ],
    scoring_map: {
      sensor: ["empiricist"],
      documents: ["empiricist", "strategist"],
      witnesses: ["investigator"],
      patterns: ["historian"],
      experiencer: ["investigator"],
      bigpicture: ["strategist", "historian"]
    }
  },
  {
    id: '3',
    question_number: 3,
    question_text: "Your current stance on UAP:",
    options: [
      { label: "Strong skeptic - probably all misidentification", value: "strong_skeptic" },
      { label: "Skeptical but genuinely open", value: "open_skeptic" },
      { label: "Agnostic - truly uncertain", value: "agnostic" },
      { label: "Leaning toward something real and anomalous", value: "leaning_real" },
      { label: "Convinced non-human intelligence is involved", value: "convinced" }
    ],
    scoring_map: {
      strong_skeptic: ["skeptic"],
      open_skeptic: ["skeptic", "empiricist"],
      agnostic: ["empiricist", "investigator"],
      leaning_real: ["investigator", "technologist"],
      convinced: ["historian", "technologist"]
    }
  },
  {
    id: '7',
    question_number: 7,
    question_text: "Your physics/STEM comfort level:",
    options: [
      { label: "Minimal - keep it simple", value: "minimal" },
      { label: "Basic - I understand fundamentals", value: "basic" },
      { label: "Strong STEM background", value: "strong" },
      { label: "Expert-level technical capability", value: "expert" }
    ],
    scoring_map: {
      minimal: ["historian", "investigator"],
      basic: ["strategist", "investigator"],
      strong: ["technologist", "empiricist"],
      expert: ["technologist", "empiricist"]
    }
  },
  {
    id: '10',
    question_number: 10,
    question_text: "What do you actually want from this?",
    options: [
      { label: "A balanced mental model I can defend", value: "balanced" },
      { label: "A strong conclusion one way or another", value: "conclusion" },
      { label: "A short briefing I can share with others", value: "briefing" },
      { label: "A research plan for deeper investigation", value: "research" },
      { label: "A personal meaning-making framework", value: "meaning" }
    ],
    scoring_map: {
      balanced: ["empiricist", "investigator"],
      conclusion: ["skeptic", "empiricist"],
      briefing: ["strategist"],
      research: ["investigator", "technologist"],
      meaning: ["historian", "strategist"]
    }
  }
];

// 6 consolidated personas
const fallbackArchetypes: PersonaArchetype[] = [
  {
    id: 'empiricist',
    name: "The Empiricist",
    description: "You prioritize hard sensor data, physical material analyses, and quantifiable performance metrics over anecdotal accounts.",
    primary_interests: "Sensor data, radar evidence, official reports",
    recommended_sections: ["a", "b", "c", "f"],
    recommended_journey: "executive",
    icon: "🔬"
  },
  {
    id: 'historian',
    name: "The Historian",
    description: "You trace the chronological evolution of government programs, legislative paper trails, and historical precedents.",
    primary_interests: "Historical cases, policy evolution, cultural patterns",
    recommended_sections: ["d", "e", "f", "h"],
    recommended_journey: "executive",
    icon: "📚"
  },
  {
    id: 'strategist',
    name: "The Strategist",
    description: "You analyze geopolitical implications, national security risks, and bureaucratic power struggles.",
    primary_interests: "Policy, geopolitics, institutional behavior",
    recommended_sections: ["f", "h", "l", "e"],
    recommended_journey: "executive",
    icon: "♟️"
  },
  {
    id: 'investigator',
    name: "The Investigator",
    description: "You focus on cross-referencing witness credibility, corroborating testimonies, and chains of custody.",
    primary_interests: "Case analysis, witness credibility, forensic evidence",
    recommended_sections: ["b", "g", "k", "f"],
    recommended_journey: "retrieval",
    icon: "🔍"
  },
  {
    id: 'skeptic',
    name: "The Skeptic",
    description: "You critically evaluate evidence by highlighting prosaic explanations, circular reporting, and disinformation. Also suits the curious and agnostic.",
    primary_interests: "Falsification, error analysis, methodological rigor",
    recommended_sections: ["a", "b", "d", "c"],
    recommended_journey: "executive",
    icon: "⚖️"
  },
  {
    id: 'technologist',
    name: "The Technologist",
    description: "You want detailed proposed engineering mechanisms and how they align with or challenge known physics.",
    primary_interests: "Propulsion physics, materials science, R&D",
    recommended_sections: ["c", "j", "l", "g"],
    recommended_journey: "physics",
    icon: "⚡"
  }
];

export function PersonaQuiz({ 
  isOpen, 
  onClose, 
  onComplete, 
  onExploreFreelyClick,
  selectedJourney,
  onSkipQuizAndStartJourney
}: PersonaQuizProps) {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<PersonaQuestion[]>(fallbackQuestions);
  const [archetypes, setArchetypes] = useState<PersonaArchetype[]>(fallbackArchetypes);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      const [questionsRes, archetypesRes] = await Promise.all([
        supabase.from('persona_questions').select('*').order('question_number'),
        supabase.from('persona_archetypes').select('*')
      ]);
      
      if (questionsRes.data && questionsRes.data.length > 0) {
        const parsedQuestions = questionsRes.data
          // FILTER: Only keep the 5 condensed questions
          .filter((q: any) => CONDENSED_QUESTION_NUMBERS.includes(q.question_number))
          .map((q: any) => {
            let options = q.options;
            let scoring_map = q.scoring_map;
            
            if (typeof options === 'string') {
            try {
              options = JSON.parse(options);
            } catch (e) {
              options = [];
            }
            }
            
            if (typeof scoring_map === 'string') {
            try {
              scoring_map = JSON.parse(scoring_map);
            } catch (e) {
              scoring_map = {};
            }
            }
            
            if (!Array.isArray(options)) {
              options = [];
            }
            
            return {
              ...q,
              options,
              scoring_map: scoring_map || {}
            };
          });
        
        // Only use if we got all 5 questions, otherwise use fallback
        if (parsedQuestions.length >= 5) {
          setQuestions(parsedQuestions);
        }
      }
      
      if (archetypesRes.data && archetypesRes.data.length > 0) {
        const parsedArchetypes = archetypesRes.data.map((a: any) => {
          let recommended_sections = a.recommended_sections;
          
          if (typeof recommended_sections === 'string') {
            try {
              recommended_sections = JSON.parse(recommended_sections);
            } catch (e) {
              recommended_sections = [];
            }
          }
          
          if (!Array.isArray(recommended_sections)) {
            recommended_sections = [];
          }
          
          return {
            ...a,
            recommended_sections: recommended_sections.map((s: string) => s.toLowerCase())
          };
        });
        setArchetypes(parsedArchetypes);
      }
    };
    
    if (isOpen) fetchData();
  }, [isOpen]);

  const handleAnswer = (value: string) => {
    const question = questions[currentQuestion];
    if (!question) return;
    
    const newAnswers = { ...answers, [question.question_number]: value };
    setAnswers(newAnswers);
    
    const archetypesToAdd = question.scoring_map?.[value] || [];
    const newScores = { ...scores };
    if (Array.isArray(archetypesToAdd)) {
      archetypesToAdd.forEach((archetype: string) => {
        newScores[archetype] = (newScores[archetype] || 0) + 1;
      });
    }
    setScores(newScores);
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setTimeout(() => calculateResults(newScores), 300);
    }
  };

  const calculateResults = (finalScores: Record<string, number>) => {
    const sorted = Object.entries(finalScores).sort(([, a], [, b]) => b - a);
    setShowResults(true);
    
    const primaryId = sorted[0]?.[0];
    const primaryArchetype = archetypes.find(a => a.id === primaryId);
    
    // Use archetype's recommended sections, or fallback to executive brief path
    let recommendedPath = primaryArchetype?.recommended_sections || [];
    if (!recommendedPath || recommendedPath.length === 0) {
      recommendedPath = ["a", "b", "c", "f"]; // Fallback to executive brief
    }
    
    // Get or create user ID
    const userId = getUserId();
    
    // Store path data in localStorage
    try {
      localStorage.setItem('uap_user_id', userId);
      localStorage.setItem('uap_archetype_id', primaryId || 'unknown');
      localStorage.setItem('uap_archetype_name', primaryArchetype?.name || 'Researcher');
      localStorage.setItem('uap_path', JSON.stringify(recommendedPath));
      localStorage.setItem('uap_path_index', '0');
    } catch (e) {
      // Silent fail for localStorage errors
    }
    
    // Dispatch storage event to notify other components
    window.dispatchEvent(new StorageEvent('storage', { key: 'uap_path' }));
    
    // Legacy storage for quiz data
    localStorage.setItem('uap-persona-quiz', JSON.stringify({
      answers,
      scores: finalScores,
      primary: primaryId,
      secondary: sorted[1]?.[0],
      recommendedPath,
      primaryName: primaryArchetype?.name || 'Researcher',
      completedAt: new Date().toISOString()
    }));
  };

  const getPrimaryArchetype = (): PersonaArchetype | undefined => {
    const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
    return archetypes.find(a => a.id === sorted[0]?.[0]) || archetypes[0];
  };

  const getSecondaryArchetype = (): PersonaArchetype | undefined => {
    const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
    return archetypes.find(a => a.id === sorted[1]?.[0]) || archetypes[1];
  };

  const handleComplete = () => {
    const primary = getPrimaryArchetype();
    const secondary = getSecondaryArchetype();
    if (primary && secondary) {
      onComplete(primary, secondary, primary.recommended_sections);
    }
    onClose();
  };

  const handleStartPath = () => {
    const path = getPrimaryArchetype()?.recommended_sections || [];
    onClose();
    if (path.length > 0) {
      navigate(`/section/${path[0].toLowerCase()}`);
    }
  };

  const handleExploreFreelyInternal = () => {
    localStorage.removeItem('uap_path');
    localStorage.removeItem('uap_path_index');
    localStorage.removeItem('uap_archetype_id');
    localStorage.removeItem('uap_archetype_name');
    localStorage.removeItem('uap-persona-quiz');
    if (onExploreFreelyClick) {
      onExploreFreelyClick();
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  const progress = showResults ? 100 : ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];
  const selectedJourneyInfo = selectedJourney ? journeyPaths[selectedJourney] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4">
        {/* Card */}
        <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-semibold">Quick Research Profile</span>
              <span className="text-xs text-muted-foreground">5 questions</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress */}
          <Progress value={progress} className="h-1 rounded-none" />

          {/* Content */}
          <div className="p-6 min-h-[400px] flex flex-col">
            {!showResults ? (
              <div className="flex-1 flex flex-col">
                {/* Question Number */}
                <div className="text-sm text-muted-foreground mb-2">
                  Question {currentQuestion + 1} of {questions.length}
                </div>
                
                {/* Question */}
                <h2 className="text-xl font-semibold mb-6">
                  {question?.question_text || "Loading question..."}
                </h2>
                
                {/* Options */}
                <div className="space-y-3 flex-1">
                  {question?.options && Array.isArray(question.options) && question.options.length > 0 ? (
                    question.options.map((option: string | { label: string; value: string }, index: number) => {
                      const isString = typeof option === 'string';
                      const label = isString ? option : option.label;
                      const value = isString ? option : option.value;
                      
                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswer(value)}
                          className={cn(
                            "w-full p-4 text-left rounded-lg border-2 transition-all",
                            answers[question.question_number] === value
                              ? "border-primary bg-accent"
                              : "border-border hover:border-primary/50 hover:bg-muted/50"
                          )}
                        >
                          {label}
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No options available for this question.</p>
                      <p className="text-sm mt-2">Please check if persona_questions table has valid options data.</p>
                    </div>
                  )}
                </div>
                
                {/* Navigation */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
                  {currentQuestion > 0 ? (
                    <button
                      onClick={() => setCurrentQuestion(currentQuestion - 1)}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous question
                    </button>
                  ) : <div />}
                  
                  {/* Skip quiz and start journey option */}
                  {selectedJourney && selectedJourneyInfo && onSkipQuizAndStartJourney && (
                    <button
                      onClick={onSkipQuizAndStartJourney}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <SkipForward className="w-4 h-4" />
                      Skip quiz & start {selectedJourneyInfo.name}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <h2 className="text-2xl font-bold mb-6 text-center">Your Research Profile</h2>
                
                <div className="space-y-4 mb-6">
                  {getPrimaryArchetype() && (
                    <div className="bg-accent/50 border border-primary/20 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Your Profile</p>
                      <div className="flex items-center gap-2 text-xl font-semibold">
                        <span>{getPrimaryArchetype()?.icon}</span>
                        <span>{getPrimaryArchetype()?.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {getPrimaryArchetype()?.description}
                      </p>
                    </div>
                  )}
                  
                  {getSecondaryArchetype() && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Secondary Archetype</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span>{getSecondaryArchetype()?.icon}</span>
                        <span>{getSecondaryArchetype()?.name}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recommended Path with Visual Badges */}
                <div className="bg-muted/30 rounded-lg p-4 mb-6">
                  <p className="text-sm font-medium mb-3">Your Recommended Path</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {getPrimaryArchetype()?.recommended_sections && getPrimaryArchetype()!.recommended_sections.length > 0 ? (
                      getPrimaryArchetype()!.recommended_sections.map((section, i, arr) => (
                        <div key={section} className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold uppercase">
                            {section}
                          </span>
                          {i < arr.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      ))
                    ) : (
                      <span className="text-muted-foreground">A → B → C → D → E → F</span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3 mt-auto">
                  <Button onClick={handleStartPath} className="flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    Start Your Path
                  </Button>
                  <Button variant="outline" onClick={handleExploreFreelyInternal} className="flex-1">
                    Explore Freely
                  </Button>
                </div>
                
                <button
                  onClick={() => {
                    setShowResults(false);
                    setCurrentQuestion(0);
                    setAnswers({});
                    setScores({});
                  }}
                  className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground"
                >
                  Retake Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
