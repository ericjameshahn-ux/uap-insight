import { useState } from "react";
import { ChevronDown, User } from "lucide-react";
import { TierBadge } from "./TierBadge";
import { cn } from "@/lib/utils";
import { Claim } from "@/lib/supabase";

interface ClaimCardProps {
  claim: Claim;
  sectionLetter?: string;
  onFigureClick?: (figureId: string) => void;
}

export function ClaimCard({ claim, sectionLetter, onFigureClick }: ClaimCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isLongQuote = claim.quote && claim.quote.length > 300;
  
  // Generate claim ID like "A-01"
  const claimNumber = claim.id?.slice(-2) || '01';
  const displayId = sectionLetter ? `${sectionLetter}-${claimNumber}` : claimNumber;

  return (
    <div className="card-elevated p-5 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="flex flex-col gap-2 shrink-0">
          <span className="section-id">{displayId}</span>
          <TierBadge tier={claim.tier} />
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
        </div>
      </div>
    </div>
  );
}
