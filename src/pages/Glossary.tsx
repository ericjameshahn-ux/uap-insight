import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/BackButton";
import { Search, BookOpen, Building2, Shield, FlaskConical, Scale, Sparkles } from "lucide-react";

export interface GlossaryTerm {
  id: string;
  term: string;
  full_name: string | null;
  definition: string;
  context: string | null;
  category: string;
  related_terms: string | null;
  section_ids: string | null;
  sort_order: number;
  created_at?: string;
}

const categoryConfig: Record<string, { icon: React.ElementType; color: string }> = {
  "Government/Military": { icon: Shield, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  "Organizations": { icon: Building2, color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  "Programs": { icon: BookOpen, color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  "Scientific/Technical": { icon: FlaskConical, color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  "Legal": { icon: Scale, color: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
  "Phenomena": { icon: Sparkles, color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
};

const categories = Object.keys(categoryConfig);

export default function Glossary() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTerms() {
      const { data, error } = await supabase
        .from("glossary")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching glossary:", error);
      } else {
        setTerms(data || []);
      }
      setLoading(false);
    }
    fetchTerms();
  }, []);

  const filteredTerms = useMemo(() => {
    return terms.filter((term) => {
      const matchesSearch =
        searchQuery === "" ||
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (term.full_name && term.full_name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = !activeCategory || term.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [terms, searchQuery, activeCategory]);

  const termsByCategory = useMemo(() => {
    const grouped: Record<string, GlossaryTerm[]> = {};
    filteredTerms.forEach((term) => {
      if (!grouped[term.category]) {
        grouped[term.category] = [];
      }
      grouped[term.category].push(term);
    });
    return grouped;
  }, [filteredTerms]);

  const getRelatedTerms = (relatedIds: string | null): GlossaryTerm[] => {
    if (!relatedIds) return [];
    const ids = relatedIds.split(",").map((id) => id.trim());
    return terms.filter((t) => ids.includes(t.id));
  };

  const getSectionLinks = (sectionIds: string | null): string[] => {
    if (!sectionIds) return [];
    return sectionIds.split(",").map((id) => id.trim());
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <BackButton />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Glossary</h1>
        <p className="text-muted-foreground">
          Key terms, acronyms, and concepts used throughout UAP disclosure discussions.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant={activeCategory === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveCategory(null)}
          >
            All ({terms.length})
          </Badge>
          {categories.map((cat) => {
            const count = terms.filter((t) => t.category === cat).length;
            if (count === 0) return null;
            const Icon = categoryConfig[cat]?.icon || BookOpen;
            return (
              <Badge
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                className="cursor-pointer flex items-center gap-1"
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              >
                <Icon className="h-3 w-3" />
                {cat} ({count})
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12 text-muted-foreground">
          Loading glossary...
        </div>
      )}

      {/* No Results */}
      {!loading && filteredTerms.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">No terms found matching your search.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory(null);
              }}
              className="text-primary hover:underline text-sm"
            >
              Clear filters
            </button>
          </CardContent>
        </Card>
      )}

      {/* Terms by Category */}
      {!loading &&
        Object.entries(termsByCategory).map(([category, categoryTerms]) => {
          const config = categoryConfig[category] || { icon: BookOpen, color: "bg-muted text-muted-foreground" };
          const Icon = config.icon;

          return (
            <div key={category} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className={`p-2 rounded-lg ${config.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">{category}</h2>
                <span className="text-muted-foreground text-sm">({categoryTerms.length})</span>
              </div>

              <div className="space-y-4">
                {categoryTerms.map((term) => {
                  const relatedTerms = getRelatedTerms(term.related_terms);
                  const sectionLinks = getSectionLinks(term.section_ids);

                  return (
                    <Card key={term.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <span className="font-mono text-primary">{term.term}</span>
                          {term.full_name && (
                            <span className="text-muted-foreground font-normal text-sm">
                              — {term.full_name}
                            </span>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-foreground">{term.definition}</p>

                        {term.context && (
                          <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                            {term.context}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-4 pt-2 text-sm">
                          {sectionLinks.length > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Sections:</span>
                              <div className="flex gap-1">
                                {sectionLinks.map((s) => (
                                  <Link
                                    key={s}
                                    to={`/section/${s.toLowerCase()}`}
                                    className="w-6 h-6 rounded bg-primary/10 text-primary text-xs font-bold flex items-center justify-center hover:bg-primary/20 transition-colors"
                                  >
                                    {s}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {relatedTerms.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-muted-foreground">See also:</span>
                              {relatedTerms.map((rt) => (
                                <Badge key={rt.id} variant="secondary" className="text-xs">
                                  {rt.term}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
}
