import { Shield, FileText, ClipboardCheck } from "lucide-react";
import { TierBadge } from "./TierBadge";
import { Figure, Claim, supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FigureCardProps {
  figure: Figure;
  compact?: boolean;
  onClick?: () => void;
  showFullDetails?: boolean;
}

// Check if figure has verification analysis in credentials
const hasVerificationNotes = (credentials?: string) => {
  if (!credentials) return false;
  const upper = credentials.toUpperCase();
  return upper.includes('VERIFIED') || upper.includes('FALSIFIED') || upper.includes('UNVERIFIED');
};

// Get first 200 chars of credentials for tooltip
const getVerificationPreview = (credentials?: string) => {
  if (!credentials) return '';
  return credentials.length > 200 ? credentials.slice(0, 200) + '...' : credentials;
};

export function FigureCard({ figure, compact = false, onClick, showFullDetails = false }: FigureCardProps) {
  const [figureClaims, setFigureClaims] = useState<Claim[]>([]);
  const [loadingClaims, setLoadingClaims] = useState(false);

  useEffect(() => {
    // Only fetch claims when showing full details (in modal)
    if (showFullDetails && figure.id) {
      const fetchClaims = async () => {
        setLoadingClaims(true);
        const { data } = await supabase
          .from('claims')
          .select('*')
          .eq('figure_id', figure.id)
          .order('id');
        setFigureClaims(data || []);
        setLoadingClaims(false);
      };
      fetchClaims();
    }
  }, [figure.id, showFullDetails]);

  const showVerificationBadge = hasVerificationNotes(figure.credentials);

  // Compact mode for grid display
  if (compact) {
    return (
      <div 
        className="card-elevated p-4 animate-fade-in cursor-pointer hover:shadow-md transition-shadow"
        onClick={onClick}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-muted-foreground">
              {figure.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground">{figure.name}</h3>
              <TierBadge tier={figure.tier} />
            </div>
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{figure.role}</p>
            
            {/* Verification Badge */}
            {showVerificationBadge && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground cursor-help">
                    <ClipboardCheck className="w-3 h-3" />
                    <span>Verified Details</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs text-xs">
                  {getVerificationPreview(figure.credentials)}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Full details mode (for modal)
  return (
    <div className="animate-fade-in">
      {/* Header with avatar */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center shrink-0">
          <span className="text-xl font-semibold text-muted-foreground">
            {figure.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="text-xl font-bold text-foreground">{figure.name}</h2>
            <TierBadge tier={figure.tier} />
          </div>
          <p className="text-muted-foreground font-medium">{figure.role}</p>
        </div>
      </div>

      {/* Full Credentials */}
      {figure.credentials && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-foreground mb-1">Credentials</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{figure.credentials}</p>
        </div>
      )}

      {/* Clearances */}
      {figure.clearances && (
        <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Security Clearances</span>
          </div>
          <p className="text-sm text-foreground mt-1">{figure.clearances}</p>
        </div>
      )}

      {/* Bio */}
      {figure.bio && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-foreground mb-1">Biography</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{figure.bio}</p>
        </div>
      )}

      {/* Claims by this figure */}
      {showFullDetails && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-foreground">
              Claims by {figure.name.split(' ')[0]} ({figureClaims.length})
            </h4>
          </div>
          
          {loadingClaims ? (
            <div className="text-sm text-muted-foreground">Loading claims...</div>
          ) : figureClaims.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {figureClaims.map((claim) => (
                <div key={claim.id} className="p-3 bg-muted/50 rounded-lg text-sm">
                  <p className="text-foreground line-clamp-2">{claim.claim}</p>
                  {claim.date && (
                    <p className="text-xs text-muted-foreground mt-1">{claim.date}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No claims recorded for this figure.</p>
          )}
        </div>
      )}
    </div>
  );
}
