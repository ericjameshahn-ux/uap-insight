import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConvictionBadge } from "@/components/ConvictionBadge";
import { ClaimCard } from "@/components/ClaimCard";
import { VideoCard } from "@/components/VideoCard";
import { FigureCard } from "@/components/FigureCard";
import { supabase, Section, Claim, Video, Figure } from "@/lib/supabase";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Fallback section data
const fallbackSections: Record<string, Section> = {
  a: { id: 'a', letter: 'A', title: 'UAP Exist', conviction: 'HIGH', subtitle: 'Official Acknowledgment', description: 'Government officials and military personnel have acknowledged UAP as real phenomena requiring investigation.', sort_order: 1 },
  b: { id: 'b', letter: 'B', title: 'Real Physical Objects', conviction: 'HIGH', subtitle: 'Material Evidence', description: 'UAP have been detected as physical objects by multiple sensor systems simultaneously.', sort_order: 2 },
  c: { id: 'c', letter: 'C', title: 'Physics-Defying Capabilities', conviction: 'HIGH', subtitle: 'Observable Characteristics', description: 'UAP demonstrate capabilities that appear to exceed known physics and engineering.', sort_order: 3 },
  d: { id: 'd', letter: 'D', title: 'Historical Precedent', conviction: 'HIGH', subtitle: 'Decades of Documentation', description: 'UAP sightings have been documented for decades with consistent patterns.', sort_order: 4 },
  e: { id: 'e', letter: 'E', title: 'Global Phenomena', conviction: 'HIGH', subtitle: 'Worldwide Reports', description: 'UAP are reported globally, not limited to any single country or region.', sort_order: 5 },
  f: { id: 'f', letter: 'F', title: 'USG Has More Data', conviction: 'HIGH', subtitle: 'Classified Information', description: 'The US Government possesses significantly more UAP data than has been publicly released.', sort_order: 6 },
  g: { id: 'g', letter: 'G', title: 'USG May Have Materials', conviction: 'MEDIUM-HIGH', subtitle: 'Crash Retrieval Claims', description: 'Claims suggest the government may possess materials from UAP.', sort_order: 7 },
  h: { id: 'h', letter: 'H', title: 'Breakaway Civilization & Finance', conviction: 'MEDIUM', subtitle: 'Funding & Programs', description: 'Evidence of special access programs and unconventional funding mechanisms.', sort_order: 8 },
  i: { id: 'i', letter: 'I', title: 'Consciousness & Contact', conviction: 'MEDIUM', subtitle: 'Experiencer Phenomena', description: 'Reported connections between consciousness and UAP phenomena.', sort_order: 9 },
  j: { id: 'j', letter: 'J', title: 'Physics R&D', conviction: 'MEDIUM', subtitle: 'Research & Development', description: 'Research into propulsion and physics related to UAP capabilities.', sort_order: 10 },
  k: { id: 'k', letter: 'K', title: 'NHI Biological Encounters', conviction: 'MEDIUM', subtitle: 'Non-Human Intelligence', description: 'Claims of encounters with non-human intelligence.', sort_order: 11 },
  l: { id: 'l', letter: 'L', title: 'Adjacent Tech & Investment', conviction: 'MEDIUM-HIGH', subtitle: 'Related Technologies', description: 'Technologies and investments potentially related to UAP research.', sort_order: 12 },
  m: { id: 'm', letter: 'M', title: 'Other Adjacent Info', conviction: 'INFO', subtitle: 'Additional Context', description: 'Other information relevant to UAP research.', sort_order: 13 },
};

const sectionOrder = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'];

export default function SectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const [section, setSection] = useState<Section | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [recommendedVideo, setRecommendedVideo] = useState<Video | null>(null);
  const [relatedFigures, setRelatedFigures] = useState<Figure[]>([]);
  const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sectionId) return;

    const fetchData = async () => {
      setLoading(true);
      
      // Fetch section
      const { data: sectionData } = await supabase
        .from('sections')
        .select('*')
        .eq('letter', sectionId.toUpperCase())
        .maybeSingle();
      
      if (sectionData) {
        setSection(sectionData);
      } else {
        setSection(fallbackSections[sectionId.toLowerCase()] || null);
      }

      // Fetch ALL claims for this section (no limit!)
      const queryId = sectionId.toLowerCase();
      console.log('Fetching claims for section_id:', queryId);
      
      const { data: claimsData, error: claimsError } = await supabase
        .from('claims')
        .select('*')
        .eq('section_id', queryId);
      
      console.log('Claims response:', { data: claimsData, error: claimsError, count: claimsData?.length });
      
      setClaims(claimsData || []);

      // Fetch recommended video for this section
      const { data: videoData } = await supabase
        .from('videos')
        .select('*')
        .eq('section_id', sectionId.toLowerCase())
        .eq('recommended', true)
        .maybeSingle();
      
      setRecommendedVideo(videoData);

      // Fetch related figures (from claims with figure_ids)
      if (claimsData && claimsData.length > 0) {
        const figureIds = [...new Set(claimsData.filter(c => c.figure_id).map(c => c.figure_id))];
        if (figureIds.length > 0) {
          const { data: figuresData } = await supabase
            .from('figures')
            .select('*')
            .in('id', figureIds);
          
          setRelatedFigures(figuresData || []);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [sectionId]);

  const handleFigureClick = async (figureId: string) => {
    const { data } = await supabase
      .from('figures')
      .select('*')
      .eq('id', figureId)
      .maybeSingle();
    
    if (data) {
      setSelectedFigure(data);
    }
  };

  // Get personalized path from localStorage or use default order
  const getPersonalizedPath = (): string[] => {
    try {
      const quizData = localStorage.getItem('uap-persona-quiz');
      if (quizData) {
        const parsed = JSON.parse(quizData);
        if (parsed.recommendedPath && Array.isArray(parsed.recommendedPath)) {
          return parsed.recommendedPath.map((s: string) => s.toLowerCase());
        }
      }
    } catch (e) {
      console.error('Error reading personalized path:', e);
    }
    return sectionOrder;
  };

  const personalizedPath = getPersonalizedPath();
  const currentIndex = personalizedPath.indexOf(sectionId?.toLowerCase() || '');
  const nextSection = currentIndex >= 0 && currentIndex < personalizedPath.length - 1 
    ? personalizedPath[currentIndex + 1] 
    : null;
  const prevSection = currentIndex > 0 ? personalizedPath[currentIndex - 1] : null;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-48 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Section not found</h1>
        <Link to="/" className="text-primary hover:underline">Return to home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Section Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-4 mb-4">
          <span className="font-mono text-4xl font-bold text-foreground">
            {section.letter}.
          </span>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{section.title}</h1>
            {section.subtitle && (
              <p className="text-muted-foreground">{section.subtitle}</p>
            )}
          </div>
          <ConvictionBadge conviction={section.conviction} />
        </div>
        <p className="text-muted-foreground leading-relaxed">{section.description}</p>
        <div className="mt-4 text-sm text-muted-foreground">
          <strong>Claims ({claims.length})</strong>
        </div>
      </div>

      {/* Recommended Video */}
      {recommendedVideo && (
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h2 className="text-lg font-semibold mb-4">Recommended Video</h2>
          <VideoCard video={recommendedVideo} showEmbed />
        </div>
      )}

      {/* All Claims */}
      <div className="space-y-4 mb-8">
        {claims.map((claim, i) => (
          <div key={claim.id} className="animate-fade-in" style={{ animationDelay: `${(i + 2) * 50}ms` }}>
            <ClaimCard 
              claim={claim} 
              sectionLetter={section.letter}
              onFigureClick={handleFigureClick}
            />
          </div>
        ))}
        
        {claims.length === 0 && (
          <div className="card-elevated p-8 text-center text-muted-foreground">
            No claims available for this section yet. Connect your Supabase database to load data.
          </div>
        )}
      </div>

      {/* Related Figures */}
      {relatedFigures.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Related Figures</h2>
          <div className="grid grid-cols-2 gap-4">
            {relatedFigures.map((figure) => (
              <FigureCard 
                key={figure.id} 
                figure={figure} 
                compact
                onClick={() => setSelectedFigure(figure)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Section Navigation */}
      <div className="flex items-center justify-between pt-8 border-t border-border">
        {prevSection ? (
          <Link to={`/section/${prevSection}`}>
            <Button variant="ghost">← Previous Section</Button>
          </Link>
        ) : <div />}
        
        {nextSection && (
          <Link to={`/section/${nextSection}`}>
            <Button>
              Continue to Section {nextSection.toUpperCase()}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        )}
      </div>

      {/* Figure Modal */}
      <Dialog open={!!selectedFigure} onOpenChange={() => setSelectedFigure(null)}>
        <DialogContent className="max-w-lg">
          {selectedFigure && <FigureCard figure={selectedFigure} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
