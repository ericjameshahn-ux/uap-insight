import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, Play, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { hypotheses, comparisonMatrix, getYouTubeEmbedUrl } from "@/lib/hypothesesData";
import type { Hypothesis, HypothesisClaim } from "@/lib/hypothesesData";

const getTierVariant = (tier: HypothesisClaim['tier']) => {
  switch (tier) {
    case 'HIGH': return 'default';
    case 'MEDIUM': return 'secondary';
    case 'LOWER': return 'outline';
    default: return 'outline';
  }
};

function HypothesisCard({ hypothesis, index }: { hypothesis: Hypothesis; index: number }) {
  const embedUrl = getYouTubeEmbedUrl(hypothesis.featuredVideo.url);
  
  return (
    <Card className="mb-8 overflow-hidden border-border/50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${hypothesis.gradient} text-white p-4 md:p-6`}>
        <div className="flex justify-between items-start gap-4">
          <div>
            <span className="text-sm font-medium opacity-80">HYPOTHESIS {index + 1}</span>
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 mt-1">
              <span className="text-2xl">{hypothesis.icon}</span>
              {hypothesis.title}
            </h2>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            {hypothesis.figures[0]?.credentials.split(';')[0]}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4 md:p-6">
        {/* Summary */}
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {hypothesis.summary}
        </p>
        
        {/* Key Figures */}
        <div className="space-y-3 mb-6">
          {hypothesis.figures.map((figure, i) => (
            <div key={i} className="bg-muted/50 rounded-lg p-4 flex gap-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-2xl shrink-0">
                {figure.icon || "👤"}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-foreground">{figure.name}</h3>
                <p className="text-sm text-muted-foreground">{figure.role}</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{figure.credentials}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Core Claims */}
        <div className="mb-6">
          <h4 className="font-semibold text-foreground mb-3">Core Claims</h4>
          <ul className="space-y-2">
            {hypothesis.claims.map((claim, i) => (
              <li key={i} className="flex gap-2 items-start">
                <Badge variant={getTierVariant(claim.tier)} className="shrink-0 mt-0.5 text-xs">
                  {claim.tier}
                </Badge>
                <span className="text-muted-foreground text-sm">{claim.text}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Featured Video */}
        {embedUrl && (
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-3">Featured Video</h4>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title={hypothesis.featuredVideo.title}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {hypothesis.featuredVideo.description}
            </p>
          </div>
        )}
        
        {/* Additional Videos */}
        {hypothesis.additionalVideos.length > 0 && (
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <ChevronDown className="w-4 h-4" />
              <span className="text-sm font-medium">More Videos ({hypothesis.additionalVideos.length})</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-2">
              {hypothesis.additionalVideos.map((video, i) => (
                <a
                  key={i}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <Play className="w-5 h-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{video.title}</p>
                    {video.description && (
                      <p className="text-xs text-muted-foreground truncate">{video.description}</p>
                    )}
                  </div>
                </a>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
        
        {/* Investment Implications */}
        <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <h4 className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Investment Implications
          </h4>
          <p className="text-sm text-amber-800 dark:text-amber-300 mt-2">
            {hypothesis.investmentImplications}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ComparisonMatrix() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <h2 className="text-lg sm:text-xl font-bold text-foreground">Hypothesis Comparison Matrix</h2>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full text-xs sm:text-sm min-w-[600px]">
            <thead className="bg-muted">
              <tr>
                {comparisonMatrix.headers.map((header, i) => (
                  <th key={i} className={`p-2 sm:p-3 ${i === 0 ? 'text-left' : 'text-center'} font-semibold text-foreground`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonMatrix.rows.map((row, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="p-2 sm:p-3 font-medium text-foreground">{row.feature}</td>
                  {row.values.map((value, j) => (
                    <td key={j} className="p-2 sm:p-3 text-center text-muted-foreground text-xs">
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

export default function Hypotheses() {
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
          
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-amber-400" />
            <h1 className="text-2xl md:text-3xl font-bold">Emerging Hypotheses</h1>
          </div>
          
          <p className="text-lg md:text-xl text-slate-300 mb-6">
            Competing Theories from Credentialed Sources
          </p>
          
          <div className="bg-slate-700/50 border-l-4 border-amber-400 p-4 rounded-r">
            <p className="text-sm text-slate-200">
              <strong className="text-amber-400">Investment Context:</strong> The following hypotheses represent publicly discussed frameworks from credentialed researchers. Their inclusion signals investment-relevant asymmetry in public dialogue, not endorsement of any particular theory. Regardless of ultimate origins or intent, the technological and policy implications merit serious analysis.
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {/* Hypothesis Cards */}
        {hypotheses.map((hypothesis, index) => (
          <HypothesisCard key={hypothesis.id} hypothesis={hypothesis} index={index} />
        ))}
        
        {/* Comparison Matrix */}
        <ComparisonMatrix />
        
        {/* Related Sections */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-foreground">Related Sections</h2>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              to="/section/b"
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <span className="text-lg">🛸</span>
              <div>
                <p className="font-medium text-foreground">Section B: Real Physical Objects</p>
                <p className="text-sm text-muted-foreground">Verified sensor data and physical evidence</p>
              </div>
            </Link>
            <Link
              to="/section/c"
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <span className="text-lg">⚡</span>
              <div>
                <p className="font-medium text-foreground">Section C: Physics-Defying Capabilities</p>
                <p className="text-sm text-muted-foreground">The Six Observables and performance characteristics</p>
              </div>
            </Link>
            <Link
              to="/observables"
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <span className="text-lg">📊</span>
              <div>
                <p className="font-medium text-foreground">The Six Observables</p>
                <p className="text-sm text-muted-foreground">Performance characteristics codified in law</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
