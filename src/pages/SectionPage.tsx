import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowRight, X, Play, Video as VideoIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConvictionBadge } from "@/components/ConvictionBadge";
import { ClaimCard } from "@/components/ClaimCard";
import { VideoCard } from "@/components/VideoCard";
import { FigureCard } from "@/components/FigureCard";
import { supabase, Section, Claim, Video, Figure, SectionContentBlock } from "@/lib/supabase";
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
  
  const watchMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  
  return null;
}

export default function SectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [sectionVideos, setSectionVideos] = useState<Video[]>([]);
  const [relatedFigures, setRelatedFigures] = useState<Figure[]>([]);
  const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null);
  const [contentBlocks, setContentBlocks] = useState<SectionContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Path state
  const [userPath, setUserPath] = useState<string[]>([]);
  const [pathIndex, setPathIndex] = useState(0);
  const [archetypeName, setArchetypeName] = useState('');

  useEffect(() => {
    if (!sectionId) return;

    // Load path from localStorage
    const loadPathData = () => {
      try {
        const pathData = localStorage.getItem('uap_path');
        const indexData = localStorage.getItem('uap_path_index');
        const nameData = localStorage.getItem('uap_archetype_name');
        
        console.log('🔍 SectionPage loading path data:');
        console.log('  Raw uap_path:', pathData);
        console.log('  Raw uap_path_index:', indexData);
        console.log('  Raw uap_archetype_name:', nameData);
        
        if (pathData && pathData !== 'null' && pathData !== '[]') {
          const path = JSON.parse(pathData);
          if (Array.isArray(path) && path.length > 0) {
            console.log('  Parsed path:', path);
            setUserPath(path);
            setPathIndex(parseInt(indexData || '0', 10));
            setArchetypeName(nameData || '');
            
            // Update path index if we're on a path section
            const currentPathIndex = path.indexOf(sectionId.toLowerCase());
            if (currentPathIndex !== -1 && currentPathIndex !== parseInt(indexData || '0', 10)) {
              localStorage.setItem('uap_path_index', currentPathIndex.toString());
              setPathIndex(currentPathIndex);
            }
          } else {
            console.log('  Path is empty array, clearing state');
            setUserPath([]);
          }
        } else {
          console.log('  No valid path data found');
          setUserPath([]);
          setPathIndex(0);
          setArchetypeName('');
        }
      } catch (e) {
        console.error('❌ Error loading path:', e);
        setUserPath([]);
      }
    };
    
    loadPathData();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      console.log('📦 Storage event received, reloading path data');
      loadPathData();
    };
    window.addEventListener('storage', handleStorageChange);

    const fetchData = async () => {
      setLoading(true);
      
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

      const queryId = sectionId.toLowerCase();
      
      const { data: claimsData } = await supabase
        .from('claims')
        .select('*')
        .eq('section_id', queryId)
        .order('id');
      
      setClaims(claimsData || []);

      const { data: videosData } = await supabase
        .from('videos')
        .select('*')
        .eq('section_id', sectionId.toLowerCase())
        .order('recommended', { ascending: false });
      
      setSectionVideos(videosData || []);

      const { data: blocksData } = await supabase
        .from('section_content_blocks')
        .select('*')
        .eq('section_id', sectionId.toLowerCase())
        .order('block_order', { ascending: true });
      
      setContentBlocks(blocksData || []);

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

  const handleExitPath = () => {
    localStorage.removeItem('uap_path');
    localStorage.removeItem('uap_path_index');
    localStorage.removeItem('uap_archetype_id');
    localStorage.removeItem('uap_archetype_name');
    setUserPath([]);
    setPathIndex(0);
    setArchetypeName('');
  };

  const handleNextSection = () => {
    if (pathIndex < userPath.length - 1) {
      const nextSection = userPath[pathIndex + 1];
      localStorage.setItem('uap_path_index', (pathIndex + 1).toString());
      navigate(`/section/${nextSection}`);
    }
  };

  // Check if current section is in the path
  const currentSectionLower = sectionId?.toLowerCase() || '';
  const isInPath = userPath.includes(currentSectionLower);
  const currentPathPosition = userPath.indexOf(currentSectionLower);
  const isLastInPath = currentPathPosition === userPath.length - 1;
  const nextSection = !isLastInPath && currentPathPosition >= 0 ? userPath[currentPathPosition + 1] : null;
  
  // Progress calculation
  const pathProgress = userPath.length > 0 && currentPathPosition >= 0
    ? ((currentPathPosition + 1) / userPath.length) * 100
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
      {/* Path Progress Banner */}
      {userPath.length > 0 && isInPath && (
        <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary">
              Part {currentPathPosition + 1} of {userPath.length} in your {archetypeName} path
            </span>
            <button 
              onClick={handleExitPath}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Exit path
            </button>
          </div>
          <Progress value={pathProgress} className="h-2" />
          <div className="flex items-center gap-1 mt-2 flex-wrap">
            {userPath.map((s, i) => (
              <Link
                key={s}
                to={`/section/${s}`}
                className={`px-2 py-0.5 rounded text-xs font-mono uppercase transition-colors ${
                  s === currentSectionLower 
                    ? 'bg-primary text-primary-foreground' 
                    : i < currentPathPosition 
                      ? 'bg-primary/20 text-primary hover:bg-primary/30'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {s}
              </Link>
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

      {/* Content Blocks (Video Context) - Side-by-side layout */}
      {contentBlocks.length > 0 ? (
        <div className="space-y-6 mb-8 animate-fade-in" style={{ animationDelay: '50ms' }}>
          {contentBlocks.map((block, index) => {
            const embedUrl = block.video_url ? getYouTubeEmbedUrl(block.video_url) : null;
            return (
              <div 
                key={block.id} 
                className="bg-card rounded-xl shadow-md overflow-hidden animate-fade-in"
                style={{ animationDelay: `${(index + 1) * 75}ms` }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="aspect-video overflow-hidden">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={block.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : block.video_url ? (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <a 
                          href={block.video_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-2"
                        >
                          <Play className="w-5 h-5" /> Watch Video
                        </a>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col justify-center">
                    <h3 className="text-xl font-bold mb-3">{block.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {renderBoldText(block.content)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (section as any).intro_content ? (
        <div className="mb-8 p-6 bg-muted/50 rounded-lg animate-fade-in" style={{ animationDelay: '50ms' }}>
          <div className="prose prose-sm max-w-none text-foreground leading-relaxed space-y-4">
            {((section as any).intro_content as string).split('\n\n').map((paragraph, i) => (
              <p key={i}>{renderBoldText(paragraph)}</p>
            ))}
          </div>
        </div>
      ) : null}

      {/* Section Videos */}
      {(() => {
        const contentBlockUrls = new Set(
          contentBlocks.map(block => block.video_url).filter(Boolean)
        );
        const filteredVideos = sectionVideos.filter(video => !contentBlockUrls.has(video.url));
        
        if (filteredVideos.length === 0) return null;
        
        return (
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <VideoIcon className="w-5 h-5 text-primary" />
              Additional Videos ({filteredVideos.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        );
      })()}

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
      </div>

      {/* Related Figures */}
      {relatedFigures.length > 0 && (
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '150ms' }}>
          <h2 className="text-lg font-semibold mb-4">Key Figures in this Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedFigures.map((figure) => (
              <FigureCard key={figure.id} figure={figure} />
            ))}
          </div>
        </div>
      )}

      {/* Path Next Button OR Standard Navigation */}
      {userPath.length > 0 && isInPath ? (
        <div className="mt-12 pt-8 border-t border-border">
          {isLastInPath ? (
            <div className="text-center p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="text-3xl mb-2">🎉</div>
              <h3 className="text-xl font-semibold text-green-600 mb-2">Path Complete!</h3>
              <p className="text-muted-foreground mb-4">
                You've completed your {archetypeName} journey through the evidence.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleExitPath}>
                  Explore All Sections
                </Button>
                <Button asChild>
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              onClick={handleNextSection}
              size="lg"
              className="w-full"
            >
              Next: Section {nextSection?.toUpperCase()}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      ) : (
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-border">
          {(() => {
            const currentIndex = defaultSectionOrder.indexOf(sectionId?.toLowerCase() || '');
            const prev = currentIndex > 0 ? defaultSectionOrder[currentIndex - 1] : null;
            const next = currentIndex < defaultSectionOrder.length - 1 ? defaultSectionOrder[currentIndex + 1] : null;
            
            return (
              <>
                {prev ? (
                  <Link to={`/section/${prev}`}>
                    <Button variant="outline">
                      ← Section {prev.toUpperCase()}
                    </Button>
                  </Link>
                ) : <div />}
                {next && (
                  <Link to={`/section/${next}`}>
                    <Button>
                      Section {next.toUpperCase()} →
                    </Button>
                  </Link>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* Figure Modal */}
      <Dialog open={!!selectedFigure} onOpenChange={() => setSelectedFigure(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedFigure && <FigureCard figure={selectedFigure} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}