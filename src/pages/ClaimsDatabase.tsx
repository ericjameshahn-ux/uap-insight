import { useState, useEffect } from "react";
import { Search, Grid, List, X, Scale } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClaimCard } from "@/components/ClaimCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FigureCard } from "@/components/FigureCard";
import { BackButton } from "@/components/BackButton";
import { supabase, Claim, Figure } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";

const tierOptions = ['ALL', 'HIGHEST', 'HIGH', 'MEDIUM', 'LOWER'];
const sectionOptions = ['ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];

export default function ClaimsDatabase() {
  const [searchParams, setSearchParams] = useSearchParams();
  const figureFilter = searchParams.get('figure');
  
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [sectionFilter, setSectionFilter] = useState("ALL");
  const [contestedFilter, setContestedFilter] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null);
  const [loading, setLoading] = useState(true);

  const clearFigureFilter = () => {
    searchParams.delete('figure');
    setSearchParams(searchParams);
  };

  useEffect(() => {
    const fetchClaims = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('claims')
        .select('*');
      
      if (data) {
        setClaims(data);
        setFilteredClaims(data);
      }
      setLoading(false);
    };

    fetchClaims();
  }, []);

  useEffect(() => {
    let filtered = claims;

    // Figure filter from URL
    if (figureFilter) {
      const figureLower = figureFilter.toLowerCase();
      filtered = filtered.filter(claim => 
        claim.source.toLowerCase().includes(figureLower)
      );
    }

    // Contested/Analyzed filter
    if (contestedFilter) {
      filtered = filtered.filter(claim => 
        claim.tier === 'LOWER' && claim.figure_id
      );
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(claim => 
        claim.claim.toLowerCase().includes(searchLower) ||
        claim.quote?.toLowerCase().includes(searchLower) ||
        claim.source.toLowerCase().includes(searchLower)
      );
    }

    // Tier filter
    if (tierFilter !== "ALL") {
      filtered = filtered.filter(claim => claim.tier === tierFilter);
    }

    // Section filter
    if (sectionFilter !== "ALL") {
      filtered = filtered.filter(claim => claim.section_id.toUpperCase() === sectionFilter);
    }

    setFilteredClaims(filtered);
  }, [search, tierFilter, sectionFilter, claims, figureFilter, contestedFilter]);

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <BackButton />
      
      <div className="mb-6 sm:mb-8 animate-fade-in">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Claims Database</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Search and explore all documented claims across research sections.
        </p>
      </div>

      {/* Figure Filter Banner */}
      {figureFilter && (
        <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg mb-6 animate-fade-in">
          <span className="text-sm text-foreground">
            Showing claims by <strong className="text-primary">{figureFilter}</strong>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFigureFilter}
            className="ml-auto gap-1.5 text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px]"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Clear filter</span>
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="relative flex-1 min-w-0 sm:min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search claims, quotes, sources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={sectionFilter} onValueChange={setSectionFilter}>
          <SelectTrigger className="w-full sm:w-32 min-h-[44px]">
            <SelectValue placeholder="Section" />
          </SelectTrigger>
          <SelectContent>
            {sectionOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option === 'ALL' ? 'All Sections' : `Section ${option}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-1 p-1 bg-muted rounded-md overflow-x-auto">
          {tierOptions.map((tier) => (
            <Button
              key={tier}
              variant={tierFilter === tier ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTierFilter(tier)}
              className="text-xs min-h-[36px] min-w-[44px] whitespace-nowrap"
            >
              {tier}
            </Button>
          ))}
        </div>

        <Button
          variant={contestedFilter ? "secondary" : "outline"}
          size="sm"
          onClick={() => setContestedFilter(!contestedFilter)}
          className="gap-2 min-h-[44px]"
        >
          <Scale className="w-4 h-4" />
          <span className="hidden sm:inline">Contested/Analyzed</span>
          <span className="sm:hidden">Contested</span>
        </Button>

        <div className="flex gap-1 p-1 bg-muted rounded-md">
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
            className="min-h-[44px] min-w-[44px]"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className="min-h-[44px] min-w-[44px]"
          >
            <Grid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground mb-4">
        Showing {filteredClaims.length} of {claims.length} claims
      </div>

      {/* Claims List/Grid */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-elevated p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/4 mb-3" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className={cn(
          viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"
        )}>
          {filteredClaims.map((claim, i) => (
            <div key={claim.id} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
              <ClaimCard 
                claim={claim}
                sectionLetter={claim.section_id.toUpperCase()}
                onFigureClick={handleFigureClick}
              />
            </div>
          ))}

          {filteredClaims.length === 0 && (
            <div className="card-elevated p-12 text-center text-muted-foreground col-span-2">
              {claims.length === 0 
                ? "No claims available. Connect your Supabase database to load data."
                : "No claims match your filters."}
            </div>
          )}
        </div>
      )}

      {/* Figure Modal */}
      <Dialog open={!!selectedFigure} onOpenChange={() => setSelectedFigure(null)}>
        <DialogContent className="max-w-lg">
          {selectedFigure && <FigureCard figure={selectedFigure} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
