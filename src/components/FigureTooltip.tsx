import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, User, Video, ArrowRight } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase, Figure } from "@/lib/supabase";
import { staticFigures, findFigureByName, StaticFigure } from "@/lib/figuresData";

interface FigureTooltipProps {
  name: string;
  children?: React.ReactNode;
  className?: string;
}

export function FigureTooltip({ name, children, className = "" }: FigureTooltipProps) {
  const [figure, setFigure] = useState<Figure | StaticFigure | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFigure = async () => {
      setLoading(true);
      
      // First try Supabase
      const { data } = await supabase
        .from('figures')
        .select('*')
        .ilike('name', `%${name}%`)
        .limit(1)
        .maybeSingle();
      
      if (data) {
        setFigure(data);
      } else {
        // Fall back to static data
        const staticFigure = findFigureByName(name);
        if (staticFigure) {
          setFigure(staticFigure);
        }
      }
      
      setLoading(false);
    };

    fetchFigure();
  }, [name]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'HIGHEST':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
      case 'HIGH':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      case 'HISTORICAL':
        return 'bg-slate-500/10 text-slate-600 border-slate-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Check if this is a StaticFigure (has videoUrls array) or a Figure from DB
  const isStaticFigure = (f: Figure | StaticFigure): f is StaticFigure => {
    return 'videoUrls' in f;
  };

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          className={`inline-flex items-center gap-1 text-primary hover:text-primary/80 underline decoration-dotted underline-offset-2 cursor-pointer transition-colors ${className}`}
        >
          {children || name}
        </button>
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-80 p-0 overflow-hidden"
        align="start"
        sideOffset={8}
      >
        {loading ? (
          <div className="p-4 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
          </div>
        ) : figure ? (
          <div className="divide-y divide-border">
            {/* Header */}
            <div className="p-4 bg-muted/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{figure.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">{figure.role}</p>
                  {figure.tier && (
                    <Badge variant="outline" className={`mt-1 text-[10px] ${getTierColor(figure.tier)}`}>
                      {figure.tier} CREDIBILITY
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Credentials */}
            {figure.credentials && (
              <div className="px-4 py-2 bg-muted/10">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Credentials:</span> {figure.credentials}
                </p>
                {figure.clearances && (
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="font-medium">Clearances:</span> {figure.clearances}
                  </p>
                )}
              </div>
            )}

            {/* Bio excerpt */}
            {figure.bio && (
              <div className="p-4">
                <p className="text-xs text-muted-foreground line-clamp-4">
                  {figure.bio}
                </p>
              </div>
            )}

            {/* Video links (for static figures) */}
            {isStaticFigure(figure) && figure.videoUrls && figure.videoUrls.length > 0 && (
              <div className="px-4 py-2 bg-muted/10">
                <p className="text-[10px] font-medium text-muted-foreground uppercase mb-1">
                  Related Videos
                </p>
                <div className="space-y-1">
                  {figure.videoUrls.slice(0, 2).map((video, i) => (
                    <a
                      key={i}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Video className="w-3 h-3" />
                      {video.title}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Footer with link to full profile */}
            <div className="p-3 bg-muted/20">
              <Link to="/figures">
                <Button variant="ghost" size="sm" className="w-full text-xs h-7">
                  View Full Profile
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center">
            <User className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No profile found for {name}
            </p>
            <Link to="/figures" className="text-xs text-primary hover:underline mt-1 inline-block">
              Browse all figures →
            </Link>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
