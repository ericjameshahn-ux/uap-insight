import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
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
  Clock
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
}

interface Proponent {
  id: string;
  name: string;
  credential: string;
  video_url: string | null;
  video_title: string | null;
  sort_order: number;
}

export default function HypothesisExplorer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [subcategoriesMap, setSubcategoriesMap] = useState<Record<string, Subcategory[]>>({});
  const [proponentsMap, setProponentsMap] = useState<Record<string, Proponent[]>>({});
  const [loading, setLoading] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('uap_hypotheses')
        .select('*')
        .eq('level', 1)
        .order('sort_order');

      if (data && !error) {
        setCategories(data);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  // Fetch subcategories and proponents when a card is expanded
  const fetchCardData = async (categoryCode: string) => {
    // Fetch subcategories if not already loaded
    if (!subcategoriesMap[categoryCode]) {
      const { data: subs } = await supabase
        .from('uap_hypotheses')
        .select('*')
        .eq('parent_code', categoryCode)
        .order('sort_order');

      if (subs) {
        setSubcategoriesMap(prev => ({ ...prev, [categoryCode]: subs }));
      }
    }

    // Fetch proponents if not already loaded
    if (!proponentsMap[categoryCode]) {
      const { data: props } = await supabase
        .from('hypothesis_proponents')
        .select('*')
        .eq('hypothesis_code', categoryCode)
        .order('sort_order');

      if (props) {
        setProponentsMap(prev => ({ ...prev, [categoryCode]: props }));
      }
    }
  };

  const toggleCard = (code: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
        fetchCardData(code);
      }
      return next;
    });
  };

  const allExpanded = categories.length > 0 && expandedCards.size === categories.length;

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedCards(new Set());
    } else {
      const allCodes = new Set(categories.map(c => c.code));
      setExpandedCards(allCodes);
      // Fetch data for all categories
      categories.forEach(c => fetchCardData(c.code));
    }
  };

  // Get text color from bg color
  const getTextColor = (bgColor: string) => {
    return bgColor?.replace('bg-', 'text-') || 'text-primary';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button */}
      <Link to="/framework" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Framework
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-2">
              MAPPING THE POSSIBILITIES
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">UAP Hypothesis Explorer</h1>
            <p className="text-muted-foreground max-w-2xl">
              What could UAP actually be? A MECE taxonomy of 7 categories—from conventional to exotic—each with key proponents and evidence.
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

        {/* Attribution Box */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/50 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Taxonomy synthesized from:</span>{" "}
          Karl Nell (SOL Foundation 2024), Alex Gomez-Marin & Curt Jaimungal (Theories of Everything), Bill Lamprey (@btlamprey.bsky.social)
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => {
          const isOpen = expandedCards.has(category.code);
          const Icon = iconMap[category.icon] || HelpCircle;
          const subcategories = subcategoriesMap[category.code] || [];
          const proponents = proponentsMap[category.code] || [];

          return (
            <div
              key={category.id}
              className={cn(
                "rounded-lg border border-border/50 bg-card overflow-hidden transition-all duration-200",
                `border-l-4`,
                isOpen && "shadow-lg"
              )}
              style={{ borderLeftColor: category.color ? `var(--${category.color.replace('bg-', '')})` : undefined }}
            >
              {/* Collapsed Header - Always Visible */}
              <button
                onClick={() => toggleCard(category.code)}
                className="w-full text-left p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors"
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                  category.color || "bg-primary"
                )}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{category.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{category.subtitle}</p>
                </div>
                <ChevronDown className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform shrink-0",
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
                            <p className="font-medium text-sm">{sub.name}</p>
                            {sub.items && sub.items.length > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {sub.items.join(' • ')}
                              </p>
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
                          <div key={p.id} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                              <User className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm">{p.name}</p>
                              <p className="text-xs text-muted-foreground">{p.credential}</p>
                              {p.video_url && (
                                <a 
                                  href={p.video_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                                >
                                  <Play className="w-3 h-3" />
                                  Watch: {p.video_title || 'Video'}
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Evidence & Counter */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-md p-3">
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">Best Evidence</p>
                      <p className="text-xs text-muted-foreground">{category.best_evidence || 'No evidence documented'}</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3">
                      <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">Strongest Counter</p>
                      <p className="text-xs text-muted-foreground">{category.counter_argument || 'No counter-argument documented'}</p>
                    </div>
                  </div>

                  {/* Conviction Tier Badge */}
                  <div className="flex justify-end">
                    <span className={cn(
                      "text-xs font-semibold px-3 py-1 rounded-full",
                      category.conviction_tier === 'HIGH' && "bg-green-500/20 text-green-600 dark:text-green-400",
                      category.conviction_tier === 'MEDIUM' && "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
                      category.conviction_tier === 'LOW' && "bg-red-500/20 text-red-600 dark:text-red-400",
                      !category.conviction_tier && "bg-muted text-muted-foreground"
                    )}>
                      {category.conviction_tier || 'N/A'} CONVICTION
                    </span>
                  </div>
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

      {/* Related Links */}
      <div className="mt-12 p-6 bg-muted/30 rounded-lg border border-border/50">
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
    </div>
  );
}
