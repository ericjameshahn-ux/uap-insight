import { useState, useEffect } from "react";
import { Search, Shield, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FigureCard } from "@/components/FigureCard";
import { ClaimCard } from "@/components/ClaimCard";
import { BackButton } from "@/components/BackButton";
import { supabase, Figure, Claim } from "@/lib/supabase";
import { Link } from "react-router-dom";

const tierOptions = ['ALL', 'HIGHEST', 'HIGH', 'MEDIUM', 'LOWER'];

export default function KeyFigures() {
  const [figures, setFigures] = useState<Figure[]>([]);
  const [filteredFigures, setFilteredFigures] = useState<Figure[]>([]);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [clearanceFilter, setClearanceFilter] = useState(false);
  const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null);
  const [figureClaims, setFigureClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

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
    const { data } = await supabase
      .from('claims')
      .select('*')
      .eq('figure_id', figure.id);
    
    setFigureClaims(data || []);
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
              
              {figureClaims.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Claims by this Figure</h3>
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
                  <div className="space-y-3">
                    {figureClaims.slice(0, 5).map((claim) => (
                      <ClaimCard 
                        key={claim.id} 
                        claim={claim} 
                        sectionLetter={claim.section_id.toUpperCase()}
                      />
                    ))}
                    {figureClaims.length > 5 && (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        +{figureClaims.length - 5} more claims
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
