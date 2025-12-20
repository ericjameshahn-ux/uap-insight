import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, X, BookOpen, User, Atom, Video as VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ClaimCard } from "@/components/ClaimCard";
import { FigureCard } from "@/components/FigureCard";
import { VideoCard } from "@/components/VideoCard";
import { supabase, Journey, Claim, Figure, Video, Observable } from "@/lib/supabase";

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
      { type: 'claim', claim_id: 'a-01' },
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
      { type: 'narrative', title: 'The Physics Challenge', content: 'UAP demonstrate capabilities that appear to violate our current understanding of physics.' },
      { type: 'observable', observable_id: '1' }
    ]
  }
};

interface Step {
  type: 'narrative' | 'claim' | 'figure' | 'observable' | 'video';
  title?: string;
  content?: string;
  claim_id?: string;
  figure_id?: string;
  observable_id?: string;
  video_id?: string;
}

export default function JourneyPage() {
  const { journeyId } = useParams<{ journeyId: string }>();
  const [journey, setJourney] = useState<Journey | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        setJourney(data);
      } else {
        setJourney(fallbackJourneys[journeyId] || null);
      }
      setLoading(false);
    };

    fetchJourney();
  }, [journeyId]);

  useEffect(() => {
    const fetchStepData = async () => {
      if (!journey || !journey.steps[currentStep]) return;

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
    }
  }, [journeyId, currentStep]);

  // Load progress on mount
  useEffect(() => {
    if (journeyId) {
      const saved = localStorage.getItem(`journey-${journeyId}-progress`);
      if (saved) {
        setCurrentStep(parseInt(saved, 10));
      }
    }
  }, [journeyId]);

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

  const steps = journey.steps as Step[];
  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

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
          <VideoCard video={stepData} showEmbed />
        ) : (
          <div className="card-elevated p-8 text-center text-muted-foreground">
            Loading video...
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
            <p className="text-sm text-muted-foreground">Step {currentStep + 1} of {steps.length}</p>
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
      <Progress value={progress} className="h-1 mb-8" />

      {/* Step Content */}
      <div className="mb-8">
        {renderStep()}
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

        {/* Step indicators */}
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentStep ? 'bg-primary' : i < currentStep ? 'bg-primary/40' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
