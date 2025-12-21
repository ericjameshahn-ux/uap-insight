import { useState, useEffect } from "react";
import { ChevronDown, User, Eye, Bookmark, X } from "lucide-react";
import { TierBadge } from "./TierBadge";
import { cn } from "@/lib/utils";
import { Claim, getUserId, supabase } from "@/lib/supabase";

interface ClaimCardProps {
  claim: Claim;
  sectionLetter?: string;
  onFigureClick?: (figureId: string) => void;
}

type ContentStatus = 'viewed' | 'later' | 'skip' | null;

export function ClaimCard({ claim, sectionLetter, onFigureClick }: ClaimCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<ContentStatus>(null);
  const isLongQuote = claim.quote && claim.quote.length > 300;
  
  // Generate claim ID like "A-01"
  const claimNumber = claim.id ? String(claim.id).padStart(2, '0') : '01';
  const displayId = sectionLetter ? `${sectionLetter}-${claimNumber}` : claimNumber;

  // Load status from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`claim-status-${claim.id}`);
    if (saved) {
      setStatus(saved as ContentStatus);
    }
  }, [claim.id]);

  const handleStatusChange = async (newStatus: ContentStatus) => {
    // Toggle off if clicking same status
    const finalStatus = status === newStatus ? null : newStatus;
    setStatus(finalStatus);

    // Save to localStorage
    if (finalStatus) {
      localStorage.setItem(`claim-status-${claim.id}`, finalStatus);
    } else {
      localStorage.removeItem(`claim-status-${claim.id}`);
    }

    // Save to database
    const userId = getUserId();
    if (finalStatus) {
      await supabase.from('user_progress').upsert({
        user_id: userId,
        content_type: 'claim',
        content_id: claim.id,
        status: finalStatus,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,content_type,content_id' });
    } else {
      await supabase.from('user_progress').delete()
        .eq('user_id', userId)
        .eq('content_type', 'claim')
        .eq('content_id', claim.id);
    }
  };

  return (
    <div className={cn(
      "card-elevated p-5 animate-fade-in transition-all",
      status === 'viewed' && "ring-2 ring-green-500/30",
      status === 'later' && "ring-2 ring-yellow-500/30",
      status === 'skip' && "opacity-50"
    )}>
      <div className="flex items-start gap-4">
        <div className="flex flex-col gap-2 shrink-0">
          <span className="section-id">{displayId}</span>
          <TierBadge tier={claim.tier} />
          {/* Status indicator */}
          {status === 'viewed' && (
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20">
              <Eye className="w-3.5 h-3.5 text-green-600" />
            </span>
          )}
          {status === 'later' && (
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/20">
              <Bookmark className="w-3.5 h-3.5 text-yellow-600 fill-yellow-600" />
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-2 leading-tight">
            {claim.claim}
          </h3>
          
          {claim.quote && (
            <div className="relative">
              <blockquote className={cn(
                "quote-text text-sm border-l-2 border-primary/30 pl-4 my-3",
                !expanded && isLongQuote && "line-clamp-4"
              )}>
                "{claim.quote}"
              </blockquote>
              
              {isLongQuote && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                >
                  {expanded ? "Show less" : "Read full quote"}
                  <ChevronDown className={cn("w-3 h-3 transition-transform", expanded && "rotate-180")} />
                </button>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span className="font-medium">{claim.source}</span>
            {claim.date && (
              <>
                <span>•</span>
                <span>{claim.date}</span>
              </>
            )}
          </div>
          
          {claim.figure_id && onFigureClick && (
            <button
              onClick={() => onFigureClick(claim.figure_id!)}
              className="flex items-center gap-1.5 mt-3 text-xs text-primary hover:underline"
            >
              <User className="w-3 h-3" />
              View source figure
            </button>
          )}

          {/* Bookmark Controls */}
          <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border">
            <button
              onClick={() => handleStatusChange('viewed')}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors",
                status === 'viewed'
                  ? "bg-green-500/20 text-green-600"
                  : "hover:bg-muted text-muted-foreground"
              )}
              title="Mark as reviewed"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reviewed</span>
            </button>
            <button
              onClick={() => handleStatusChange('later')}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors",
                status === 'later'
                  ? "bg-yellow-500/20 text-yellow-600"
                  : "hover:bg-muted text-muted-foreground"
              )}
              title="Save for later"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save</span>
            </button>
            <button
              onClick={() => handleStatusChange('skip')}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors",
                status === 'skip'
                  ? "bg-muted text-foreground"
                  : "hover:bg-muted text-muted-foreground"
              )}
              title="Skip"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Skip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}