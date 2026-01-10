import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  TrendingUp, 
  ExternalLink,
  ChevronsUpDown,
  Sparkles,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { hypotheses, comparisonMatrix, getYouTubeEmbedUrl } from "@/lib/hypothesesData";
import type { Hypothesis, HypothesisClaim } from "@/lib/hypothesesData";
import { cn } from "@/lib/utils";
import { SectionAIQueryButton } from "@/components/SectionAIQueryButton";

// Color scheme for each hypothesis
const hypothesisColors = [
  { border: "border-l-blue-500", bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50 dark:bg-blue-950/30" },
  { border: "border-l-emerald-500", bg: "bg-emerald-500", text: "text-emerald-600", light: "bg-emerald-50 dark:bg-emerald-950/30" },
  { border: "border-l-amber-500", bg: "bg-amber-500", text: "text-amber-600", light: "bg-amber-50 dark:bg-amber-950/30" },
  { border: "border-l-violet-500", bg: "bg-violet-500", text: "text-violet-600", light: "bg-violet-50 dark:bg-violet-950/30" },
  { border: "border-l-pink-500", bg: "bg-pink-500", text: "text-pink-600", light: "bg-pink-50 dark:bg-pink-950/30" },
];

// Reorder hypotheses to match the user's requested order
const reorderedHypotheses = [
  hypotheses[0], // Ancient/Remnant Technology
  hypotheses[2], // Orbital Monitoring System
  hypotheses[3], // Multiple Species
  hypotheses[4], // Historical/Religious Continuity
  hypotheses[1], // Extratemporal (Time Travel)
];

const getTierVariant = (tier: HypothesisClaim['tier']) => {
  switch (tier) {
    case 'HIGH': return 'default';
    case 'MEDIUM': return 'secondary';
    case 'LOWER': return 'outline';
    default: return 'outline';
  }
};

function getYouTubeThumbnail(url: string): string | null {
  const watchMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (watchMatch) return `https://img.youtube.com/vi/${watchMatch[1]}/mqdefault.jpg`;
  
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) return `https://img.youtube.com/vi/${shortMatch[1]}/mqdefault.jpg`;
  
  return null;
}

function ResearcherBioCard({ figure }: { figure: Hypothesis['figures'][0] }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-muted/50 rounded-lg p-4 flex gap-3 mb-3">
      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-xl shrink-0">
        {figure.icon || <User className="w-6 h-6 text-muted-foreground" />}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-semibold text-foreground">{figure.name}</h4>
        <p className="text-sm text-muted-foreground">{figure.role}</p>
        <p className={cn(
          "text-sm text-muted-foreground mt-1",
          !expanded && "line-clamp-2"
        )}>
          {figure.credentials}
        </p>
        {figure.credentials.length > 80 && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-primary hover:underline mt-1"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
    </div>
  );
}

function VideoCard({ video, compact = false }: { video: { title: string; url: string; description?: string }, compact?: boolean }) {
  const thumbnail = getYouTubeThumbnail(video.url);
  
  if (compact) {
    return (
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg hover:bg-muted/50 transition-colors"
      >
        <Play className="w-5 h-5 text-primary shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm text-foreground truncate">{video.title}</p>
          {video.description && (
            <p className="text-xs text-muted-foreground truncate">{video.description}</p>
          )}
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
      </a>
    );
  }
  
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-background border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-video bg-slate-900 relative">
        {thumbnail ? (
          <img src={thumbnail} alt={video.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-10 h-10 text-white/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-5 h-5 text-slate-900 ml-0.5" />
          </div>
        </div>
      </div>
      <div className="p-3">
        <p className="font-medium text-sm text-foreground line-clamp-2">{video.title}</p>
      </div>
    </a>
  );
}

function HypothesisCard({ 
  hypothesis, 
  index, 
  isExpanded, 
  onToggle,
  colorScheme 
}: { 
  hypothesis: Hypothesis; 
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  colorScheme: typeof hypothesisColors[0];
}) {
  const allVideos = [hypothesis.featuredVideo, ...hypothesis.additionalVideos];
  
  // Core ideas for each hypothesis
  const coreIdeas: Record<number, string> = {
    1: "UAP are dormant automated systems from the distant past, not recent interstellar arrivals",
    2: "UAP occupants are future human descendants using time-travel technology",
    3: "Earth is surrounded by an automated surveillance network predating the Space Age",
    4: "UAP involve distinct biological species with different characteristics and intentions",
    5: "UAP represent persistent NHI interacting with humanity throughout history",
  };
  
  return (
    <Card className={cn(
      "mb-6 overflow-hidden border-l-4 transition-shadow",
      colorScheme.border,
      isExpanded && "shadow-lg"
    )}>
      {/* Header - Always visible */}
      <button 
        onClick={onToggle}
        className="w-full text-left p-4 md:p-5 flex items-start gap-4 hover:bg-muted/30 transition-colors cursor-pointer"
      >
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0",
          colorScheme.bg
        )}>
          {index + 1}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span>{hypothesis.icon}</span>
              {hypothesis.title}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {coreIdeas[hypothesis.id] || hypothesis.summary.split('.')[0]}
          </p>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="secondary" className="hidden sm:inline-flex">
            {hypothesis.figures.length} researcher{hypothesis.figures.length > 1 ? 's' : ''}
          </Badge>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>
      
      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 pb-5 md:px-5 border-t border-border pt-4">
          {/* Researchers */}
          <div className="mb-5">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Key Researchers
            </h4>
            {hypothesis.figures.map((figure, i) => (
              <ResearcherBioCard key={i} figure={figure} />
            ))}
          </div>
          
          {/* Theory Synopsis */}
          <div className="mb-5">
            <h4 className="font-semibold text-foreground mb-3">Theory Synopsis</h4>
            <ul className="space-y-2">
              {hypothesis.claims.map((claim, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <Badge variant={getTierVariant(claim.tier)} className="shrink-0 mt-0.5 text-xs">
                    {claim.tier}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{claim.text}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Video Grid */}
          {allVideos.length > 0 && (
            <div className="mb-5">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Play className="w-4 h-4" />
                Videos ({allVideos.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allVideos.slice(0, 4).map((video, i) => (
                  <VideoCard key={i} video={video} />
                ))}
              </div>
              {allVideos.length > 4 && (
                <div className="mt-3 space-y-2">
                  {allVideos.slice(4).map((video, i) => (
                    <VideoCard key={i} video={video} compact />
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Investment Implications */}
          <div className={cn("p-4 rounded-lg", colorScheme.light)}>
            <h4 className={cn("font-semibold flex items-center gap-2 mb-2", colorScheme.text)}>
              <TrendingUp className="w-4 h-4" />
              Investment Implications
            </h4>
            <p className="text-sm text-muted-foreground">
              {hypothesis.investmentImplications}
            </p>
          </div>
          
          {/* View Claims Link */}
          <div className="mt-4 pt-4 border-t border-border">
            <Link 
              to={`/claims?section=n`}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all claims for this hypothesis →
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}

function ComparisonMatrix() {
  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <h2 className="text-lg font-bold text-foreground">Hypothesis Comparison</h2>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-muted">
              <tr>
                {comparisonMatrix.headers.map((header, i) => (
                  <th key={i} className={cn(
                    "p-3 font-semibold text-foreground",
                    i === 0 ? "text-left" : "text-center"
                  )}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonMatrix.rows.map((row, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="p-3 font-medium text-foreground">{row.feature}</td>
                  {row.values.map((value, j) => (
                    <td key={j} className="p-3 text-center text-muted-foreground text-xs md:text-sm">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function SynthesisCard() {
  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Synthesis
        </h2>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          These frameworks aren't mutually exclusive. The strongest evidence supports:
        </p>
        <ul className="space-y-2 mb-4">
          <li className="flex gap-2 items-start">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
            <span className="text-sm">
              <strong className="text-foreground">Orbital Monitoring (Villarroel)</strong>
              <span className="text-muted-foreground"> — Peer-reviewed statistical data on pre-Sputnik anomalies</span>
            </span>
          </li>
          <li className="flex gap-2 items-start">
            <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
            <span className="text-sm">
              <strong className="text-foreground">Multiple Species (Davis/Ramirez)</strong>
              <span className="text-muted-foreground"> — Insider testimony under oath with materials evidence</span>
            </span>
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Each hypothesis has different implications for technology, policy, and investment strategy.
        </p>
      </CardContent>
    </Card>
  );
}

export default function SectionN() {
  const [expandedHypotheses, setExpandedHypotheses] = useState<number[]>([]);
  
  // Load expansion state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sectionN_expanded');
    if (saved) {
      try {
        setExpandedHypotheses(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved expansion state');
      }
    }
  }, []);
  
  // Save expansion state
  useEffect(() => {
    localStorage.setItem('sectionN_expanded', JSON.stringify(expandedHypotheses));
  }, [expandedHypotheses]);
  
  const toggleHypothesis = (id: number) => {
    setExpandedHypotheses(prev => 
      prev.includes(id) 
        ? prev.filter(h => h !== id)
        : [...prev, id]
    );
  };
  
  const expandAll = () => setExpandedHypotheses(reorderedHypotheses.map(h => h.id));
  const collapseAll = () => setExpandedHypotheses([]);
  const allExpanded = expandedHypotheses.length === reorderedHypotheses.length;
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/">
            <Button variant="ghost" className="mb-4 text-slate-300 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className="border-slate-500 text-slate-300">
              Section N
            </Badge>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            Hypotheses & Interpretations
          </h1>
          
          <p className="text-lg text-slate-300 mb-4">
            Five competing frameworks for understanding UAP phenomena
          </p>
          
          <div className="bg-slate-700/50 border-l-4 border-primary p-4 rounded-r">
            <p className="text-sm text-slate-200">
              These represent different interpretive lenses—not mutually exclusive explanations. 
              Each hypothesis is championed by credentialed researchers with specific evidence bases. 
              The goal is to understand which framework best explains the totality of available data.
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="sticky top-0 z-20 bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {reorderedHypotheses.map((h, i) => (
              <button
                key={h.id}
                onClick={() => {
                  if (!expandedHypotheses.includes(h.id)) {
                    toggleHypothesis(h.id);
                  }
                  // Scroll to the hypothesis
                  document.getElementById(`hypothesis-${h.id}`)?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  hypothesisColors[i].light,
                  hypothesisColors[i].text,
                  "hover:opacity-80"
                )}
              >
                <span className={cn(
                  "w-5 h-5 rounded-full text-white text-xs flex items-center justify-center",
                  hypothesisColors[i].bg
                )}>
                  {i + 1}
                </span>
                <span className="hidden sm:inline">{h.title.split('/')[0].trim()}</span>
              </button>
            ))}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={allExpanded ? collapseAll : expandAll}
            className="shrink-0"
          >
            <ChevronsUpDown className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">{allExpanded ? 'Collapse' : 'Expand'} All</span>
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {/* AI Query Button */}
        <SectionAIQueryButton sectionId="n" sectionTitle="Hypotheses & Interpretations" />
        
        {/* Hypothesis Cards */}
        {reorderedHypotheses.map((hypothesis, index) => (
          <div key={hypothesis.id} id={`hypothesis-${hypothesis.id}`} className="scroll-mt-20">
            <HypothesisCard
              hypothesis={hypothesis}
              index={index}
              isExpanded={expandedHypotheses.includes(hypothesis.id)}
              onToggle={() => toggleHypothesis(hypothesis.id)}
              colorScheme={hypothesisColors[index]}
            />
          </div>
        ))}
        
        {/* Comparison Matrix */}
        <ComparisonMatrix />
        
        {/* Synthesis Card */}
        <SynthesisCard />
      </div>
    </div>
  );
}
