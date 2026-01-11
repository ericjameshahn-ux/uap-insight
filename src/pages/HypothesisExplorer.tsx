import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp,
  Play,
  HelpCircle,
  Rocket,
  Orbit,
  Brain,
  Sparkles,
  Network,
  User,
  AlertCircle,
  Zap,
  Globe,
  Clock,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

// Icon mapping for database icon names
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'HelpCircle': HelpCircle,
  'Rocket': Rocket,
  'Orbit': Orbit,
  'Brain': Brain,
  'Sparkles': Sparkles,
  'Network': Network,
  'User': User,
  'AlertCircle': AlertCircle,
  'Zap': Zap,
  'Globe': Globe,
  'Clock': Clock,
};

// Color scheme per category code
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  '1': { bg: 'bg-gray-600', text: 'text-gray-600', border: 'border-gray-600' },
  '2': { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600' },
  '3': { bg: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-600' },
  '4': { bg: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-600' },
  '5': { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500' },
  '6': { bg: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-500' },
  '7': { bg: 'bg-slate-800', text: 'text-slate-800', border: 'border-slate-800' },
};

// Conviction tier badge styles
const tierBadges: Record<string, { bg: string; text: string }> = {
  'HIGH': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
  'MEDIUM': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' },
  'LOWER': { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400' },
  'BASELINE': { bg: 'bg-gray-200 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-300' },
  'N/A': { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500 dark:text-slate-400' },
};

interface Category {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  best_evidence: string;
  counter_argument: string;
  conviction_tier: string;
  sort_order: number;
  level: number;
  parent_code: string | null;
}

interface Subcategory {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  items: string[] | null;
  sort_order: number;
  parent_code: string | null;
}

interface Proponent {
  id: string;
  name: string;
  credential: string;
  video_url: string | null;
  video_title: string | null;
  sort_order: number;
  hypothesis_code: string;
  is_primary: boolean;
}

export default function HypothesisExplorer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allSubcategories, setAllSubcategories] = useState<Subcategory[]>([]);
  const [allProponents, setAllProponents] = useState<Proponent[]>([]);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      const [categoriesRes, subcategoriesRes, proponentsRes] = await Promise.all([
        supabase.from('uap_hypotheses').select('*').eq('level', 1).order('sort_order'),
        supabase.from('uap_hypotheses').select('*').eq('level', 2).order('sort_order'),
        supabase.from('hypothesis_proponents').select('*').order('sort_order'),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (subcategoriesRes.data) setAllSubcategories(subcategoriesRes.data);
      if (proponentsRes.data) setAllProponents(proponentsRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const toggleCard = (code: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const allExpanded = categories.length > 0 && expandedCards.size === categories.length;

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedCards(new Set());
    } else {
      setExpandedCards(new Set(categories.map(c => c.code)));
    }
  };

  const getColorForCategory = (code: string) => {
    return categoryColors[code] || categoryColors['7'];
  };

  const getTierBadge = (tier: string | null) => {
    const key = tier?.toUpperCase() || 'N/A';
    return tierBadges[key] || tierBadges['N/A'];
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-slate-900 to-background">
        <div className="container mx-auto max-w-6xl">
          <Link to="/framework" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Framework
          </Link>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-2">
                MAPPING THE POSSIBILITIES
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                UAP Hypothesis Explorer
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                A comprehensive taxonomy of 7 categories explaining what UAP could be—from conventional to exotic.
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleAll}
              className="shrink-0"
            >
              {allExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  COLLAPSE ALL
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  EXPAND ALL
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Controls Bar */}
      <section className="px-4 py-4 border-b border-border/50">
        <div className="container mx-auto max-w-6xl flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {categories.length} categories, {allSubcategories.length} subcategories
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="px-4 py-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => {
              const isOpen = expandedCards.has(category.code);
              const Icon = iconMap[category.icon] || HelpCircle;
              const colors = getColorForCategory(category.code);
              const tierStyle = getTierBadge(category.conviction_tier);
              const subcategories = allSubcategories.filter(s => s.parent_code === category.code);
              const proponents = allProponents
                .filter(p => p.hypothesis_code === category.code)
                .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));

              return (
                <div
                  key={category.id}
                  className={cn(
                    "rounded-lg border bg-card overflow-hidden transition-all duration-200",
                    `border-l-4 ${colors.border}`,
                    isOpen && "shadow-lg"
                  )}
                >
                  {/* Card Header - Always Visible */}
                  <button
                    onClick={() => toggleCard(category.code)}
                    className="w-full text-left p-4 flex items-start gap-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      colors.bg
                    )}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.subtitle}</p>
                      <span className={cn(
                        "inline-block text-xs font-semibold px-2 py-0.5 rounded mt-2",
                        tierStyle.bg, tierStyle.text
                      )}>
                        {category.conviction_tier || 'N/A'}
                      </span>
                    </div>
                    <ChevronDown className={cn(
                      "w-5 h-5 text-muted-foreground transition-transform shrink-0 mt-2",
                      isOpen && "rotate-180"
                    )} />
                  </button>

                  {/* Expanded Content */}
                  {isOpen && (
                    <div className="px-4 pb-4 border-t border-border/30">
                      {/* Description */}
                      <p className="text-sm text-muted-foreground mt-4 mb-5 leading-relaxed">
                        {category.description}
                      </p>

                      {/* Subcategories */}
                      {subcategories.length > 0 && (
                        <div className="mb-5">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                            Subcategories
                          </h4>
                          <div className="space-y-2">
                            {subcategories.map(sub => (
                              <div key={sub.id} className="bg-muted/30 rounded-md p-3">
                                <p className="font-medium text-sm">
                                  <span className="text-muted-foreground">{sub.code}</span> {sub.name}
                                </p>
                                {sub.items && sub.items.length > 0 && (
                                  <ul className="mt-2 space-y-1">
                                    {sub.items.map((item, idx) => (
                                      <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                        <span className="text-muted-foreground/50">•</span>
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Proponents */}
                      {proponents.length > 0 && (
                        <div className="mb-5">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                            Key Proponents
                          </h4>
                          <div className="space-y-3">
                            {proponents.map(p => (
                              <div key={p.id} className="bg-muted/20 rounded-md p-3 flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                  <User className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-sm">{p.name}</p>
                                  <p className="text-xs text-muted-foreground">{p.credential}</p>
                                  {p.video_url && (
                                    <a 
                                      href={p.video_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-2 py-1"
                                    >
                                      <Play className="w-3 h-3" />
                                      Watch Interview
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Evidence & Counter */}
                      {category.best_evidence && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-md p-3 mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">
                              Best Evidence
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">{category.best_evidence}</p>
                        </div>
                      )}

                      {category.counter_argument && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                              Strongest Counter-Argument
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">{category.counter_argument}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {categories.length === 0 && !loading && (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No Hypotheses Found</h3>
              <p className="text-muted-foreground">The hypothesis data hasn't been loaded yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Attribution Footer */}
      <section className="px-4 py-8 bg-muted/30 border-t border-border/50">
        <div className="container mx-auto max-w-6xl">
          <p className="text-sm text-muted-foreground font-medium mb-3">
            Hypothesis taxonomy synthesized from:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Karl Nell - "Proposed Taxonomy of UAP Origin Hypotheses" (SOL Foundation 2024)</li>
            <li>• Alex Gomez-Marin & Curt Jaimungal - "A Taxonomy of Possible Origins" (Theories of Everything)</li>
            <li>• Bill Lamprey - "The Origins of UAP" (©2024 @btlamprey.bsky.social)</li>
          </ul>
        </div>
      </section>

      {/* Continue Exploring */}
      <section className="px-4 py-8 border-t border-border/50">
        <div className="container mx-auto max-w-6xl">
          <h3 className="font-semibold mb-4">Continue Exploring</h3>
          <div className="flex flex-wrap gap-3">
            <Link to="/observables">
              <Button variant="outline" size="sm">
                The Six Observables
              </Button>
            </Link>
            <Link to="/claims">
              <Button variant="outline" size="sm">
                Claims Database
              </Button>
            </Link>
            <Link to="/figures">
              <Button variant="outline" size="sm">
                Key Figures
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}