import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase, PersonaQuestion, PersonaArchetype, getUserId } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface PersonaQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (primary: PersonaArchetype, secondary: PersonaArchetype, path: string[]) => void;
  onExploreFreelyClick?: () => void;
}

// Fallback data when database isn't connected
const fallbackQuestions: PersonaQuestion[] = [
  {
    id: '1',
    question_number: 1,
    question_text: "What's your primary interest in the UAP topic?",
    options: [
      { label: "Hard evidence and data", value: "evidence" },
      { label: "Policy implications", value: "policy" },
      { label: "Scientific explanations", value: "science" },
      { label: "Personal experiences", value: "experience" }
    ],
    scoring_map: {
      evidence: ["empiricist", "investigator"],
      policy: ["policymaker", "skeptic"],
      science: ["scientist", "empiricist"],
      experience: ["experiencer", "philosopher"]
    }
  },
  {
    id: '2',
    question_number: 2,
    question_text: "How would you describe your current stance on UAP?",
    options: [
      { label: "Need more evidence", value: "skeptical" },
      { label: "Convinced by existing data", value: "convinced" },
      { label: "Focused on implications", value: "implications" },
      { label: "Open but cautious", value: "open" }
    ],
    scoring_map: {
      skeptical: ["skeptic", "empiricist"],
      convinced: ["investigator", "experiencer"],
      implications: ["policymaker", "scientist"],
      open: ["philosopher", "empiricist"]
    }
  }
];

const fallbackArchetypes: PersonaArchetype[] = [
  {
    id: 'empiricist',
    name: "The Empiricist",
    description: "You value hard evidence above all else. You want data, measurements, and verifiable facts.",
    primary_interests: "Sensor data, radar evidence, official reports",
    recommended_sections: ["a", "b", "c", "f"],
    recommended_journey: "executive",
    icon: "📊"
  },
  {
    id: 'scientist',
    name: "The Scientist",
    description: "You're fascinated by the physics and technology implications.",
    primary_interests: "Propulsion theories, physics analysis, R&D",
    recommended_sections: ["c", "j", "l", "b"],
    recommended_journey: "physics",
    icon: "⚛️"
  }
];

export function PersonaQuiz({ isOpen, onClose, onComplete, onExploreFreelyClick }: PersonaQuizProps) {
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
        const parsedQuestions = questionsRes.data.map((q: any) => {
          let options = q.options;
          let scoring_map = q.scoring_map;
          
          if (typeof options === 'string') {
            try {
              options = JSON.parse(options);
            } catch (e) {
              console.error('Error parsing options:', e);
              options = [];
            }
          }
          
          if (typeof scoring_map === 'string') {
            try {
              scoring_map = JSON.parse(scoring_map);
            } catch (e) {
              console.error('Error parsing scoring_map:', e);
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
        setQuestions(parsedQuestions);
      }
      
      if (archetypesRes.data && archetypesRes.data.length > 0) {
        const parsedArchetypes = archetypesRes.data.map((a: any) => {
          let recommended_sections = a.recommended_sections;
          
          if (typeof recommended_sections === 'string') {
            try {
              recommended_sections = JSON.parse(recommended_sections);
            } catch (e) {
              console.error('Error parsing recommended_sections:', e);
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
    const recommendedPath = primaryArchetype?.recommended_sections || [];
    
    // Get or create user ID
    const userId = getUserId();
    
    // Store SIMPLIFIED path data in localStorage
    localStorage.setItem('uap_user_id', userId);
    localStorage.setItem('uap_archetype_id', primaryId || '');
    localStorage.setItem('uap_archetype_name', primaryArchetype?.name || '');
    localStorage.setItem('uap_path', JSON.stringify(recommendedPath));
    localStorage.setItem('uap_path_index', '0');
    
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold">Research Profile Quiz</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <Progress value={progress} className="h-1" />
        
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!showResults ? (
            <div className="animate-fade-in">
              <div className="text-sm text-muted-foreground mb-2">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              
              <h2 className="text-xl font-semibold mb-6">
                {question?.question_text || "Loading question..."}
              </h2>
              
              <div className="space-y-3">
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
                  <div className="text-center text-muted-foreground py-8">
                    <p>No options available for this question.</p>
                    <p className="text-sm mt-2">Please check if persona_questions table has valid options data.</p>
                  </div>
                )}
              </div>
              
              {currentQuestion > 0 && (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  className="flex items-center gap-1 mt-6 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous question
                </button>
              )}
            </div>
          ) : (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6 text-center">Your Research Profile</h2>
              
              <div className="space-y-4 mb-8">
                {getPrimaryArchetype() && (
                  <div className="p-5 rounded-lg bg-accent border border-primary/20">
                    <div className="text-sm text-muted-foreground mb-1">Your Profile</div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getPrimaryArchetype()?.icon}</span>
                      <span className="text-xl font-semibold">{getPrimaryArchetype()?.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {getPrimaryArchetype()?.description}
                    </p>
                  </div>
                )}
                
                {getSecondaryArchetype() && (
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="text-sm text-muted-foreground mb-1">Secondary Archetype</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getSecondaryArchetype()?.icon}</span>
                      <span className="font-semibold">{getSecondaryArchetype()?.name}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Recommended Path with Visual Badges */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Your Recommended Path</h3>
                <div className="flex items-center gap-2 flex-wrap p-4 bg-muted/50 rounded-lg">
                  {getPrimaryArchetype()?.recommended_sections && getPrimaryArchetype()!.recommended_sections.length > 0 ? (
                    getPrimaryArchetype()!.recommended_sections.map((section, i, arr) => (
                      <div key={section} className="flex items-center gap-2">
                        <span className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md font-mono font-bold text-sm uppercase">
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
              
              <div className="flex flex-col gap-3">
                <Button onClick={handleStartPath} className="w-full" size="lg">
                  <Play className="w-4 h-4 mr-2" />
                  Start Your Path
                </Button>
                <Button variant="ghost" onClick={handleExploreFreelyInternal}>
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
  );
}