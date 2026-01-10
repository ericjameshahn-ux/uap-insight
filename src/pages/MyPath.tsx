import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, RefreshCw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase, Section, PersonaArchetype } from "@/lib/supabase";
import { BackButton } from "@/components/BackButton";

// Archetype display info (6 consolidated personas)
const archetypeIcons: Record<string, string> = {
  empiricist: "🔬",
  historian: "📚",
  strategist: "♟️",
  investigator: "🔍",
  skeptic: "⚖️",
  technologist: "⚡",
  // Legacy mappings for backwards compatibility
  debunker: "⚖️",
  scientist: "🔬",
  executive: "📊",
  physics: "⚡",
  retrieval: "🔍",
  consciousness: "📚",
};

// Path rationales for each archetype
const pathRationales: Record<string, Record<string, string>> = {
  empiricist: {
    a: "Begin with official acknowledgments - verified statements from credible sources",
    b: "Examine multi-sensor physical evidence that can be scientifically evaluated",
    c: "Analyze the Five Observables with technical rigor",
    f: "Understand the data classification barriers preventing full analysis",
  },
  investigator: {
    b: "Start with physical evidence - sensor data you can evaluate",
    g: "Examine crash retrieval claims with forensic rigor",
    k: "Assess biological encounter testimony critically",
    f: "Understand what data the government is withholding",
  },
  scientist: {
    c: "Begin with physics-defying capabilities that challenge current models",
    j: "Explore advanced propulsion R&D and theoretical frameworks",
    l: "Review adjacent technologies and investment patterns",
    b: "Ground theories in multi-sensor physical evidence",
  },
  strategist: {
    f: "Start with classification barriers and institutional dynamics",
    h: "Examine financial structures and parallel governance",
    g: "Assess crash retrieval programs as strategic assets",
    a: "Review official acknowledgments for policy implications",
  },
  technologist: {
    c: "Focus on observable capabilities and engineering implications",
    j: "Deep dive into propulsion patents and R&D programs",
    l: "Explore investment opportunities in adjacent tech",
    g: "Examine reverse engineering claims and materials",
  },
  historian: {
    d: "Begin with historical precedent spanning decades",
    a: "Review the evolution of official acknowledgments",
    e: "Examine global patterns across nations and cultures",
    f: "Understand how information has been managed over time",
  },
  skeptic: {
    a: "Begin with the most verified official acknowledgments",
    b: "Evaluate multi-sensor evidence for consistency",
    c: "Critically assess claims against known physics",
    d: "Understand information gaps before drawing conclusions",
  },
  // Legacy mappings
  debunker: {
    a: "Start with official claims that can be verified or falsified",
    b: "Examine physical evidence with skeptical rigor",
    c: "Challenge physics-defying claims with technical analysis",
    f: "Investigate what's being hidden and why",
  },
};

// Fallback archetypes (6 consolidated personas)
const fallbackArchetypes: PersonaArchetype[] = [
  { id: 'empiricist', name: "The Empiricist", description: "You prioritize hard sensor data, physical material analyses, and quantifiable performance metrics over anecdotal accounts.", primary_interests: "Sensor data, radar evidence, official reports", recommended_sections: ["a", "b", "c", "f"], recommended_journey: "executive", icon: "🔬" },
  { id: 'historian', name: "The Historian", description: "You trace the chronological evolution of government programs, legislative paper trails, and historical precedents for secrecy mechanisms.", primary_interests: "Historical cases, policy evolution, pattern analysis", recommended_sections: ["d", "e", "f", "h"], recommended_journey: "executive", icon: "📚" },
  { id: 'strategist', name: "The Strategist", description: "You analyze geopolitical implications, national security risks, and bureaucratic power struggles driving containment or disclosure.", primary_interests: "Policy impact, institutional dynamics, strategic implications", recommended_sections: ["f", "h", "l", "e"], recommended_journey: "executive", icon: "♟️" },
  { id: 'investigator', name: "The Investigator", description: "You focus on cross-referencing witness credibility, corroborating testimonies, and identifying concrete chains of custody for alleged evidence.", primary_interests: "Case analysis, witness credibility, forensic evidence", recommended_sections: ["b", "g", "k", "f"], recommended_journey: "retrieval", icon: "🔍" },
  { id: 'skeptic', name: "The Skeptic", description: "You critically evaluate evidence by highlighting prosaic explanations, circular reporting, and the possibility of disinformation. Also suits the curious and agnostic.", primary_interests: "Critical analysis, alternative explanations, evidence quality", recommended_sections: ["a", "b", "d", "c"], recommended_journey: "executive", icon: "⚖️" },
  { id: 'technologist', name: "The Technologist", description: "You want detailed proposed engineering mechanisms—metric engineering, vacuum polarization, terahertz waveguides—and how they align with or challenge known physics.", primary_interests: "Propulsion physics, materials science, R&D", recommended_sections: ["c", "j", "l", "g"], recommended_journey: "physics", icon: "⚡" },
];

export default function MyPath() {
  const navigate = useNavigate();
  const [userPath, setUserPath] = useState<string[]>([]);
  const [pathIndex, setPathIndex] = useState(0);
  const [archetypeId, setArchetypeId] = useState<string>("");
  const [archetypeName, setArchetypeName] = useState<string>("");
  const [sections, setSections] = useState<Section[]>([]);
  const [archetypes, setArchetypes] = useState<PersonaArchetype[]>(fallbackArchetypes);
  const [currentArchetype, setCurrentArchetype] = useState<PersonaArchetype | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load path data from localStorage
    const pathData = localStorage.getItem('uap_path');
    const indexData = localStorage.getItem('uap_path_index');
    const idData = localStorage.getItem('uap_archetype_id');
    const nameData = localStorage.getItem('uap_archetype_name');

    if (pathData) {
      try {
        setUserPath(JSON.parse(pathData));
      } catch (e) {
        console.error('Error parsing path:', e);
      }
    }
    setPathIndex(parseInt(indexData || '0', 10));
    setArchetypeId(idData || '');
    setArchetypeName(nameData || '');

    // Fetch data
    const fetchData = async () => {
      setLoading(true);

      // Fetch sections
      const { data: sectionsData } = await supabase
        .from('sections')
        .select('*')
        .order('sort_order');
      
      if (sectionsData) {
        setSections(sectionsData);
      }

      // Fetch archetypes
      const { data: archetypesData } = await supabase
        .from('persona_archetypes')
        .select('*');
      
      if (archetypesData && archetypesData.length > 0) {
        const parsed = archetypesData.map((a: any) => ({
          ...a,
          recommended_sections: typeof a.recommended_sections === 'string' 
            ? JSON.parse(a.recommended_sections) 
            : a.recommended_sections || [],
        }));
        setArchetypes(parsed);
        
        // Find current archetype
        const current = parsed.find((a: PersonaArchetype) => a.id === idData);
        if (current) {
          setCurrentArchetype(current);
        }
      } else {
        // Use fallback and find current
        const current = fallbackArchetypes.find(a => a.id === idData);
        if (current) {
          setCurrentArchetype(current);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const getSectionById = (id: string): Section | undefined => {
    return sections.find(s => s.id === id || s.letter?.toLowerCase() === id.toLowerCase());
  };

  const getRationale = (sectionId: string): string => {
    const rationales = pathRationales[archetypeId] || pathRationales.empiricist;
    return rationales[sectionId.toLowerCase()] || "Recommended based on your research profile.";
  };

  const handleRetakeQuiz = () => {
    localStorage.removeItem('uap_path');
    localStorage.removeItem('uap_path_index');
    localStorage.removeItem('uap_archetype_id');
    localStorage.removeItem('uap_archetype_name');
    localStorage.removeItem('uap-persona-quiz');
    navigate('/');
    // Trigger quiz on landing page
    window.dispatchEvent(new StorageEvent('storage', { key: 'uap_path' }));
  };

  const progressPercent = userPath.length > 0 
    ? ((pathIndex + 1) / userPath.length) * 100 
    : 0;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-32 bg-muted rounded" />
          <div className="h-48 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!userPath.length) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <div className="text-6xl mb-4">🧭</div>
        <h1 className="text-2xl font-bold mb-4">No Path Set</h1>
        <p className="text-muted-foreground mb-6">
          Take the research profile quiz to get a personalized path through the evidence.
        </p>
        <Button asChild>
          <Link to="/">Take the Quiz</Link>
        </Button>
      </div>
    );
  }

  const icon = archetypeIcons[archetypeId] || "🔬";

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <BackButton />
      {/* Section 1: Your Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Research Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{icon}</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{archetypeName || currentArchetype?.name || "Researcher"}</h2>
              <p className="text-muted-foreground mt-1">
                {currentArchetype?.description || "Your personalized research profile guides your path through the evidence."}
              </p>
            </div>
          </div>
          
          {currentArchetype?.primary_interests && (
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Primary interests:</span> {currentArchetype.primary_interests}
              </p>
            </div>
          )}

          <div className="pt-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Path Progress</span>
                <span className="font-medium">{pathIndex + 1} of {userPath.length} sections</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
            <Button variant="outline" size="sm" onClick={handleRetakeQuiz}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Your Path Sequence */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Path Sequence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userPath.map((sectionId, index) => {
              const section = getSectionById(sectionId);
              const isCompleted = index < pathIndex;
              const isCurrent = index === pathIndex;

              return (
                <Link
                  key={sectionId}
                  to={`/section/${sectionId}`}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
                    isCurrent ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{sectionId.toUpperCase()}</span>
                      <h3 className="font-semibold">{section?.title || `Section ${sectionId.toUpperCase()}`}</h3>
                      {isCurrent && <Badge variant="secondary" className="text-xs">Current</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {section?.description}
                    </p>
                    <p className="text-xs text-primary mt-1.5 italic">
                      {getRationale(sectionId)}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: All Archetypes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Research Archetypes</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {archetypes.map((archetype) => {
              const isCurrentUser = archetype.id === archetypeId;
              const arcIcon = archetypeIcons[archetype.id] || archetype.icon || "🔬";

              return (
                <AccordionItem key={archetype.id} value={archetype.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <span className="text-2xl">{arcIcon}</span>
                      <span className="font-medium">{archetype.name}</span>
                      {isCurrentUser && (
                        <Badge variant="default" className="ml-2">Your Profile</Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-10 space-y-3">
                      <p className="text-muted-foreground">{archetype.description}</p>
                      {archetype.primary_interests && (
                        <p className="text-sm">
                          <span className="font-medium">Interests:</span> {archetype.primary_interests}
                        </p>
                      )}
                      {archetype.recommended_sections && archetype.recommended_sections.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">Path:</span>
                          {archetype.recommended_sections.map((s: string, i: number) => (
                            <span key={s} className="flex items-center gap-1">
                              <Badge variant="outline" className="font-mono">
                                {s.toUpperCase()}
                              </Badge>
                              {i < archetype.recommended_sections.length - 1 && (
                                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                              )}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      {/* Section 4: How Scoring Works */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How Scoring Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Your archetype was determined by your answers to the research profile quiz. 
            Each answer added points to different archetypes based on the research approach it reflects.
          </p>
          <p>
            Your highest-scoring archetype (<span className="font-medium text-foreground">{archetypeName}</span>) 
            shapes your recommended research path, prioritizing evidence types that match your analytical style 
            and interests.
          </p>
          <p>
            This isn't about right or wrong approaches—different researchers naturally gravitate toward 
            different types of evidence. The path helps you engage with the material in a way that 
            resonates with how you think.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}