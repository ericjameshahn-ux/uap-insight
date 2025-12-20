import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, X, Play, Video as VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConvictionBadge } from "@/components/ConvictionBadge";
import { ClaimCard } from "@/components/ClaimCard";
import { VideoCard } from "@/components/VideoCard";
import { FigureCard } from "@/components/FigureCard";
import { supabase, Section, Claim, Video, Figure } from "@/lib/supabase";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

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

const defaultSectionOrder = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'];

// Helper to extract YouTube video ID and create embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  
  // Handle youtube.com/watch?v=XXX
  const watchMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  
  // Handle youtu.be/XXX
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  
  return null;
}

export default function SectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const [section, setSection] = useState<Section | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [sectionVideos, setSectionVideos] = useState<Video[]>([]);
  const [relatedFigures, setRelatedFigures] = useState<Figure[]>([]);
  const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Navigation state
  const [navigationMode, setNavigationMode] = useState<'free' | 'personalized'>('free');
  const [personalizedPath, setPersonalizedPath] = useState<string[]>([]);
  const [pathName, setPathName] = useState<string>('');

  useEffect(() => {
    if (!sectionId) return;

    // Load navigation preferences from localStorage
    const mode = localStorage.getItem('uap_navigation_mode') as 'free' | 'personalized' || 'free';
    setNavigationMode(mode);
    
    if (mode === 'personalized') {
      try {
        const quizData = localStorage.getItem('uap-persona-quiz');
        if (quizData) {
          const parsed = JSON.parse(quizData);
          if (parsed.recommendedPath && Array.isArray(parsed.recommendedPath)) {
            setPersonalizedPath(parsed.recommendedPath.map((s: string) => s.toLowerCase()));
            setPathName(parsed.primaryName || 'Personalized');
          }
        }
      } catch (e) {
        console.error('Error reading personalized path:', e);
      }
    }

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
      
      const { data: claimsData } = await supabase
        .from('claims')
        .select('*')
        .eq('section_id', queryId)
        .order('id');
      
      setClaims(claimsData || []);

      // Fetch ALL videos for this section (ordered by recommended first)
      const { data: videosData } = await supabase
        .from('videos')
        .select('*')
        .eq('section_id', sectionId.toLowerCase())
        .order('recommended', { ascending: false });
      
      setSectionVideos(videosData || []);

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

  const handleExitPersonalizedPath = () => {
    localStorage.setItem('uap_navigation_mode', 'free');
    setNavigationMode('free');
    setPersonalizedPath([]);
    setPathName('');
  };

  // Calculate navigation based on mode
  const activePath = navigationMode === 'personalized' && personalizedPath.length > 0 
    ? personalizedPath 
    : defaultSectionOrder;
  
  const currentIndex = activePath.indexOf(sectionId?.toLowerCase() || '');
  const nextSection = currentIndex >= 0 && currentIndex < activePath.length - 1 
    ? activePath[currentIndex + 1] 
    : null;
  const prevSection = currentIndex > 0 ? activePath[currentIndex - 1] : null;
  
  // Progress calculation for personalized path
  const pathProgress = navigationMode === 'personalized' && personalizedPath.length > 0
    ? ((currentIndex + 1) / personalizedPath.length) * 100
    : 0;

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

  // Helper to render markdown bold text
  const renderBoldText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => 
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Personalized Path Progress Banner */}
      {navigationMode === 'personalized' && personalizedPath.length > 0 && currentIndex >= 0 && (
        <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary">
              Part {currentIndex + 1} of {personalizedPath.length} in your {pathName} path
            </span>
            <button 
              onClick={handleExitPersonalizedPath}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Exit personalized path
            </button>
          </div>
          <Progress value={pathProgress} className="h-2" />
          <div className="flex items-center gap-1 mt-2 flex-wrap">
            {personalizedPath.map((s, i) => (
              <span 
                key={s} 
                className={`px-2 py-0.5 rounded text-xs font-mono ${
                  s === sectionId?.toLowerCase() 
                    ? 'bg-primary text-primary-foreground' 
                    : i < currentIndex 
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {s.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}

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
      </div>

      {/* Intro Content */}
      {(section as any).intro_content && (
        <div className="mb-8 p-6 bg-muted/50 rounded-lg animate-fade-in" style={{ animationDelay: '50ms' }}>
          <div className="prose prose-sm max-w-none text-foreground leading-relaxed space-y-4">
            {((section as any).intro_content as string).split('\n\n').map((paragraph, i) => (
              <p key={i}>{renderBoldText(paragraph)}</p>
            ))}
          </div>
        </div>
      )}

      {/* Section Videos */}
      {sectionVideos.length > 0 && (
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <VideoIcon className="w-5 h-5 text-primary" />
            Section Videos ({sectionVideos.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sectionVideos.map((video) => {
              const embedUrl = getYouTubeEmbedUrl(video.url);
              return (
                <div key={video.id} className="card-elevated overflow-hidden">
                  {embedUrl ? (
                    <div className="aspect-video">
                      <iframe
                        src={embedUrl}
                        title={video.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <a 
                        href={video.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Watch Video
                      </a>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-sm">{video.title}</h3>
                    {video.duration && (
                      <span className="text-xs text-muted-foreground">{video.duration}</span>
                    )}
                    {video.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{video.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Claims Header */}
      <div className="mb-4 text-sm text-muted-foreground">
        <strong>Claims ({claims.length})</strong>
      </div>

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
        
        {nextSection ? (
          <Link to={`/section/${nextSection}`}>
            <Button className="shadow-md">
              Continue to Section {nextSection.toUpperCase()}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        ) : navigationMode === 'personalized' && currentIndex === personalizedPath.length - 1 ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">🎉 Path Complete!</p>
            <Link to="/">
              <Button variant="outline">Return to Home</Button>
            </Link>
          </div>
        ) : null}
      </div>

      {/* Figure Modal */}
      <Dialog open={!!selectedFigure} onOpenChange={() => setSelectedFigure(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedFigure && <FigureCard figure={selectedFigure} showFullDetails />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
