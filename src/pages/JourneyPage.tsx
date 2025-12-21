import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, X, BookOpen, User, Atom, Video as VideoIcon, Check, Bookmark, SkipForward, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ClaimCard } from "@/components/ClaimCard";
import { FigureCard } from "@/components/FigureCard";
import { supabase, Journey, getUserId } from "@/lib/supabase";
import { cn } from "@/lib/utils";

// Fallback journey data
const fallbackJourneys: Record<string, Journey> = {
  executive: {
    id: 'executive',
    title: 'Executive Brief',
    duration: '45 min',
    icon: '📊',
    description: 'Core evidence for decision-makers',
    audience: 'Executives, policymakers, and institutional leaders',
    steps: [
      { type: 'narrative', title: 'Introduction', content: 'This journey presents the most credible evidence for UAP reality, curated for institutional professionals.' },
      { type: 'narrative', title: 'Key Takeaway', content: 'The evidence base has reached a threshold that warrants serious institutional attention.' }
    ]
  },
  physics: {
    id: 'physics',
    title: 'Physics Deep Dive',
    duration: '60 min',
    icon: '⚛️',
    description: 'Technical propulsion analysis',
    audience: 'Scientists, engineers, and technical analysts',
    steps: [
      { type: 'narrative', title: 'The Physics Challenge', content: 'UAP demonstrate capabilities that appear to violate our current understanding of physics.' }
    ]
  }
};

interface Step {
  type: 'narrative' | 'claim' | 'figure' | 'observable' | 'video' | 'section';
  title?: string;
  content?: string;
  claim_id?: string;
  figure_id?: string;
  observable_id?: string;
  video_id?: string;
  section_id?: string;
}

type StepStatus = 'viewed' | 'saved' | 'skipped' | null;

export default function JourneyPage() {
  const { journeyId } = useParams<{ journeyId: string }>();
  const [journey, setJourney] = useState<Journey | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stepStatuses, setStepStatuses] = useState<Record<number, StepStatus>>({});

  // Load journey
  useEffect(() => {
    const fetchJourney = async () => {
      if (!journeyId) return;
      setLoading(true);

      const { data } = await supabase
        .from('journeys')
        .select('*')
        .eq('id', journeyId)
        .maybeSingle();

      if (data) {
        // Parse steps if it's a string
        let parsedSteps = data.steps;
        if (typeof parsedSteps === 'string') {
          try {
            parsedSteps = JSON.parse(parsedSteps);
          } catch (e) {
            console.error('Error parsing journey steps:', e);
            parsedSteps = [];
          }
        }
        setJourney({ ...data, steps: parsedSteps || [] });
      } else {
        setJourney(fallbackJourneys[journeyId] || null);
      }
      setLoading(false);
    };

    fetchJourney();
  }, [journeyId]);

  // Load step statuses from localStorage
  useEffect(() => {
    if (journeyId) {
      const saved = localStorage.getItem(`journey-${journeyId}-statuses`);
      if (saved) {
        try {
          setStepStatuses(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing step statuses:', e);
        }
      }
      
      // Load current step
      const savedStep = localStorage.getItem(`journey-${journeyId}-progress`);
      if (savedStep) {
        setCurrentStep(parseInt(savedStep, 10));
      }
    }
  }, [journeyId]);

  // Fetch step data when step changes
  useEffect(() => {
    const fetchStepData = async () => {
      if (!journey || !journey.steps || !journey.steps[currentStep]) {
        setStepData(null);
        return;
      }

      const step = journey.steps[currentStep] as Step;
      
      switch (step.type) {
        case 'claim':
          if (step.claim_id) {
            const { data } = await supabase
              .from('claims')
              .select('*')
              .eq('id', step.claim_id)
              .maybeSingle();
            setStepData(data);
          }
          break;
        case 'figure':
          if (step.figure_id) {
            const { data } = await supabase
              .from('figures')
              .select('*')
              .eq('id', step.figure_id)
              .maybeSingle();
            setStepData(data);
          }
          break;
        case 'observable':
          if (step.observable_id) {
            const { data } = await supabase
              .from('observables')
              .select('*')
              .eq('id', step.observable_id)
              .maybeSingle();
            setStepData(data);
          }
          break;
        case 'video':
          if (step.video_id) {
            const { data } = await supabase
              .from('videos')
              .select('*')
              .eq('id', step.video_id)
              .maybeSingle();
            setStepData(data);
          }
          break;
        case 'section':
          if (step.section_id) {
            const { data } = await supabase
              .from('sections')
              .select('*')
              .eq('id', step.section_id)
              .maybeSingle();
            setStepData(data);
          }
          break;
        default:
          setStepData(null);
      }
    };

    fetchStepData();
  }, [journey, currentStep]);

  // Save progress to localStorage
  useEffect(() => {
    if (journeyId) {
      localStorage.setItem(`journey-${journeyId}-progress`, currentStep.toString());
      localStorage.setItem('uap_journey_step', currentStep.toString());
    }
  }, [journeyId, currentStep]);

  const setStepStatus = (index: number, status: StepStatus) => {
    const newStatuses = { ...stepStatuses, [index]: status };
    setStepStatuses(newStatuses);
    
    // Save to localStorage
    if (journeyId) {
      localStorage.setItem(`journey-${journeyId}-statuses`, JSON.stringify(newStatuses));
    }

    // Also save to user_progress table
    const userId = getUserId();
    supabase.from('user_progress').upsert({
      user_id: userId,
      journey_id: journeyId,
      step_index: index,
      status: status,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,journey_id,step_index' }).then(() => {
      // Silent save
    });
  };

  const getCompletedCount = () => {
    return Object.values(stepStatuses).filter(s => s === 'viewed').length;
  };

  const findNextUnviewedStep = () => {
    if (!journey?.steps) return 0;
    for (let i = 0; i < journey.steps.length; i++) {
      if (stepStatuses[i] !== 'viewed' && stepStatuses[i] !== 'skipped') {
        return i;
      }
    }
    return journey.steps.length - 1;
  };

  const getStatusIcon = (status: StepStatus) => {
    switch (status) {
      case 'viewed':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'saved':
        return <Bookmark className="w-4 h-4 text-yellow-500 fill-yellow-500" />;
      case 'skipped':
        return <SkipForward className="w-4 h-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-2 bg-muted rounded w-full" />
          <div className="h-48 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Journey not found</h1>
        <Link to="/" className="text-primary hover:underline">Return to home</Link>
      </div>
    );
  }

  const steps = (journey.steps || []) as Step[];
  const step = steps[currentStep];
  const progress = steps.length > 0 ? ((getCompletedCount()) / steps.length) * 100 : 0;

  const renderStep = () => {
    if (!step) return null;

    switch (step.type) {
      case 'narrative':
        return (
          <div className="card-elevated p-8 border-l-4 border-l-primary animate-fade-in">
            {step.title && <h2 className="text-xl font-semibold mb-4">{step.title}</h2>}
            <p className="text-muted-foreground leading-relaxed">{step.content}</p>
          </div>
        );

      case 'claim':
        return stepData ? (
          <ClaimCard claim={stepData} sectionLetter={stepData.section_id?.toUpperCase()} />
        ) : (
          <div className="card-elevated p-8 text-center text-muted-foreground">
            Loading claim...
          </div>
        );

      case 'figure':
        return stepData ? (
          <FigureCard figure={stepData} />
        ) : (
          <div className="card-elevated p-8 text-center text-muted-foreground">
            Loading figure...
          </div>
        );

      case 'observable':
        return stepData ? (
          <div className="card-elevated p-8 bg-gradient-to-br from-primary/5 to-accent animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Atom className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">{stepData.name}</h2>
            </div>
            <div className="grid gap-4 text-sm">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Measurement</div>
                <p>{stepData.measurement}</p>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Mechanism</div>
                <p>{stepData.mechanism}</p>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Physics Gap</div>
                <p className="italic">{stepData.gap}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="card-elevated p-8 text-center text-muted-foreground">
            Loading observable...
          </div>
        );

      case 'video':
        return stepData ? (
          <div className="card-elevated overflow-hidden animate-fade-in">
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(stepData.url)}`}
                title={stepData.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{stepData.title}</h3>
              {stepData.description && (
                <p className="text-sm text-muted-foreground mt-2">{stepData.description}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="card-elevated p-8 text-center text-muted-foreground">
            Loading video...
          </div>
        );

      case 'section':
        return stepData ? (
          <Link to={`/section/${stepData.letter?.toLowerCase()}`} className="block">
            <div className="card-elevated p-8 hover:shadow-lg transition-shadow animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-mono font-bold text-primary">{stepData.letter}</span>
                <h2 className="text-xl font-semibold">{stepData.title}</h2>
              </div>
              {stepData.description && (
                <p className="text-muted-foreground">{stepData.description}</p>
              )}
              <p className="text-sm text-primary mt-4">Click to explore this section →</p>
            </div>
          </Link>
        ) : (
          <div className="card-elevated p-8 text-center text-muted-foreground">
            Loading section...
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{journey.icon}</span>
          <div>
            <h1 className="font-semibold">{journey.title}</h1>
            <p className="text-sm text-muted-foreground">
              {getCompletedCount()} of {steps.length} steps completed
            </p>
          </div>
        </div>
        <Link to="/">
          <Button variant="ghost" size="sm">
            <X className="w-4 h-4 mr-1" />
            Exit
          </Button>
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2 text-right">{Math.round(progress)}% complete</p>
      </div>

      {/* Current Step Indicator */}
      <div className="text-sm text-muted-foreground mb-4">
        Step {currentStep + 1} of {steps.length}
        {step?.title && <span className="ml-2 font-medium text-foreground">• {step.title}</span>}
      </div>

      {/* Step Content */}
      <div className="mb-6">
        {renderStep()}
      </div>

      {/* Status Buttons */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <Button
          variant={stepStatuses[currentStep] === 'viewed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStepStatus(currentStep, 'viewed')}
          className={cn(stepStatuses[currentStep] === 'viewed' && 'bg-green-600 hover:bg-green-700')}
        >
          <Check className="w-4 h-4 mr-1" />
          Viewed
        </Button>
        <Button
          variant={stepStatuses[currentStep] === 'saved' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStepStatus(currentStep, 'saved')}
          className={cn(stepStatuses[currentStep] === 'saved' && 'bg-yellow-600 hover:bg-yellow-700')}
        >
          <Bookmark className="w-4 h-4 mr-1" />
          Save for Later
        </Button>
        <Button
          variant={stepStatuses[currentStep] === 'skipped' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setStepStatus(currentStep, 'skipped')}
        >
          <SkipForward className="w-4 h-4 mr-1" />
          Skip
        </Button>
      </div>

      {/* Step Overview (clickable step dots with status) */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
              i === currentStep 
                ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2" 
                : stepStatuses[i] === 'viewed'
                  ? "bg-green-500/20 text-green-600 border border-green-500/50"
                  : stepStatuses[i] === 'saved'
                    ? "bg-yellow-500/20 text-yellow-600 border border-yellow-500/50"
                    : stepStatuses[i] === 'skipped'
                      ? "bg-muted text-muted-foreground"
                      : "bg-muted/50 hover:bg-muted"
            )}
            title={`Step ${i + 1}: ${(s as Step).title || (s as Step).type}`}
          >
            {getStatusIcon(stepStatuses[i]) || (i + 1)}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <Button
          onClick={() => {
            if (currentStep === steps.length - 1) {
              // Journey complete
            } else {
              setCurrentStep(currentStep + 1);
            }
          }}
          disabled={currentStep === steps.length - 1}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Continue to next unviewed */}
      {getCompletedCount() > 0 && getCompletedCount() < steps.length && (
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep(findNextUnviewedStep())}
          >
            <Play className="w-4 h-4 mr-1" />
            Continue to next unviewed step
          </Button>
        </div>
      )}
    </div>
  );
}

// Helper to extract YouTube ID from URL
function getYouTubeId(url: string): string {
  if (!url) return '';
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/);
  return match?.[1] || '';
}