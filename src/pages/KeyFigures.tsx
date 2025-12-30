import { useState, useEffect } from "react";
import { Search, Shield, ExternalLink, Video, BookOpen, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FigureCard } from "@/components/FigureCard";
import { TierBadge } from "@/components/TierBadge";
import { BackButton } from "@/components/BackButton";
import { supabase, Figure, Claim, Video as VideoType } from "@/lib/supabase";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const tierOptions = ['ALL', 'HIGHEST', 'HIGH', 'MEDIUM', 'LOWER'];

export default function KeyFigures() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  
  const [figures, setFigures] = useState<Figure[]>([]);
  const [filteredFigures, setFilteredFigures] = useState<Figure[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [tierFilter, setTierFilter] = useState("ALL");
  const [clearanceFilter, setClearanceFilter] = useState(false);
  const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null);
  const [figureClaims, setFigureClaims] = useState<Claim[]>([]);
  const [figureVideos, setFigureVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);

  // Update search when URL changes
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearch(urlSearch);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchFigures = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('figures')
        .select('*')
        .order('name');
      
      if (data) {
        setFigures(data);
        setFilteredFigures(data);
      }
      setLoading(false);
    };

    fetchFigures();
  }, []);

  useEffect(() => {
    let filtered = figures;

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(figure => 
        figure.name.toLowerCase().includes(searchLower) ||
        figure.role.toLowerCase().includes(searchLower) ||
        figure.credentials?.toLowerCase().includes(searchLower)
      );
    }

    if (tierFilter !== "ALL") {
      filtered = filtered.filter(figure => figure.tier === tierFilter);
    }

    if (clearanceFilter) {
      filtered = filtered.filter(figure => figure.clearances);
    }

    setFilteredFigures(filtered);
  }, [search, tierFilter, clearanceFilter, figures]);

  const handleFigureClick = async (figure: Figure) => {
    setSelectedFigure(figure);
    
    // Fetch claims by this figure
    const { data: claimsData } = await supabase
      .from('claims')
      .select('*')
      .eq('figure_id', figure.id);
    
    setFigureClaims(claimsData || []);

    // Fetch videos related to this figure - try figure_id first, then name match
    const { data: videosById } = await supabase
      .from('videos')
      .select('*')
      .eq('figure_id', figure.id);
    
    if (videosById && videosById.length > 0) {
      setFigureVideos(videosById);
    } else {
      // Fallback: search by name in title/description
      const { data: allVideos } = await supabase
        .from('videos')
        .select('*');
      
      const figureName = figure.name.toLowerCase();
      const relatedVideos = (allVideos || []).filter(video => 
        video.title?.toLowerCase().includes(figureName) ||
        video.description?.toLowerCase().includes(figureName)
      );
      setFigureVideos(relatedVideos);
    }
  };

  // Get unique sections from claims
  const getFeaturedSections = () => {
    const sections = [...new Set(figureClaims.map(c => c.section_id.toUpperCase()))];
    return sections.sort();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <BackButton />
      
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold mb-2">Key Figures</h1>
        <p className="text-muted-foreground">
          Explore the credentialed witnesses and researchers in UAP research.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, role, credentials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-1 p-1 bg-muted rounded-md">
          {tierOptions.map((tier) => (
            <Button
              key={tier}
              variant={tierFilter === tier ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTierFilter(tier)}
              className="text-xs"
            >
              {tier}
            </Button>
          ))}
        </div>

        <Button
          variant={clearanceFilter ? "secondary" : "outline"}
          size="sm"
          onClick={() => setClearanceFilter(!clearanceFilter)}
          className="gap-2"
        >
          <Shield className="w-4 h-4" />
          Has Clearances
        </Button>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground mb-4">
        Showing {filteredFigures.length} of {figures.length} figures
      </div>

      {/* Figures Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card-elevated p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFigures.map((figure, i) => (
            <div key={figure.id} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
              <FigureCard 
                figure={figure} 
                compact
                onClick={() => handleFigureClick(figure)}
              />
            </div>
          ))}

          {filteredFigures.length === 0 && (
            <div className="card-elevated p-12 text-center text-muted-foreground col-span-3">
              {figures.length === 0 
                ? "No figures available. Connect your Supabase database to load data."
                : "No figures match your filters."}
            </div>
          )}
        </div>
      )}

      {/* Figure Detail Modal */}
      <Dialog open={!!selectedFigure} onOpenChange={() => setSelectedFigure(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedFigure && (
            <div className="space-y-6">
              <FigureCard figure={selectedFigure} />
              
              {/* Featured In Sections */}
              {figureClaims.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">Featured In Sections</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getFeaturedSections().map(section => (
                      <Link
                        key={section}
                        to={`/section/${section.toLowerCase()}`}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-md text-sm font-medium hover:bg-primary/20 transition-colors"
                        onClick={() => setSelectedFigure(null)}
                      >
                        Section {section}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Claims by this Figure */}
              {figureClaims.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Claims by this Figure ({figureClaims.length})</h3>
                    <Button variant="ghost" size="sm" asChild>
                      <Link 
                        to={`/claims?figure=${encodeURIComponent(selectedFigure.name)}`}
                        className="flex items-center gap-1 text-xs"
                      >
                        View All Claims
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {figureClaims.slice(0, 5).map((claim) => {
                      const claimNumber = String(claim.id).padStart(2, '0');
                      const displayId = `${claim.section_id.toUpperCase()}-${claimNumber}`;
                      
                      return (
                        <button
                          key={claim.id}
                          onClick={() => {
                            setSelectedFigure(null);
                            navigate(`/section/${claim.section_id}?claim=${claim.id}`);
                          }}
                          className="w-full text-left p-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex flex-col gap-1 shrink-0">
                              <span className="text-xs font-mono font-semibold text-primary">{displayId}</span>
                              <TierBadge tier={claim.tier} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                {claim.claim}
                              </p>
                              {claim.date && (
                                <p className="text-xs text-muted-foreground mt-1">{claim.date}</p>
                              )}
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 mt-1" />
                          </div>
                        </button>
                      );
                    })}
                    {figureClaims.length > 5 && (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        +{figureClaims.length - 5} more claims
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Related Videos */}
              {figureVideos.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">Related Videos ({figureVideos.length})</h3>
                  </div>
                  <div className="grid gap-3">
                    {figureVideos.slice(0, 3).map((video) => {
                      // Extract YouTube thumbnail
                      const videoId = video.url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/)?.[1];
                      const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
                      
                      return (
                        <a
                          key={video.id}
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-2 bg-muted/50 hover:bg-muted rounded-lg transition-colors group"
                        >
                          {thumbnail ? (
                            <img 
                              src={thumbnail} 
                              alt={video.title}
                              className="w-24 h-14 object-cover rounded shrink-0"
                            />
                          ) : (
                            <div className="w-24 h-14 bg-muted rounded flex items-center justify-center shrink-0">
                              <Video className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-foreground group-hover:text-primary line-clamp-2">
                              {video.title}
                            </span>
                            {video.duration && (
                              <span className="text-xs text-muted-foreground">{video.duration}</span>
                            )}
                          </div>
                          <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* View Full Profile Button */}
              <div className="pt-4 border-t border-border">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSelectedFigure(null);
                    navigate(`/figures/${selectedFigure.id}`);
                  }}
                >
                  View Full Profile
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
