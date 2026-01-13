import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Claim {
  id?: string;
  claim_text?: string;
  source_name?: string;
  date_stated?: string;
  tier?: string;
  falsifiable?: boolean;
  category?: string;
}

interface MobileClaimCardProps {
  claim: Claim;
  onClick?: () => void;
}

const tierColors: Record<string, string> = {
  HIGH: "bg-conviction-high/20 text-conviction-high border-conviction-high/30",
  MEDIUM: "bg-conviction-medium/20 text-conviction-medium border-conviction-medium/30",
  LOWER: "bg-conviction-lower/20 text-conviction-lower border-conviction-lower/30",
};

export function MobileClaimCard({ claim, onClick }: MobileClaimCardProps) {
  return (
    <Card
      className={cn(
        "p-4 space-y-3 cursor-pointer hover:bg-muted/50 transition-colors",
        onClick && "hover:border-primary/50"
      )}
      onClick={onClick}
    >
      {/* Claim Text */}
      <p className="text-sm text-foreground leading-relaxed break-words">
        {claim.claim_text}
      </p>

      {/* Metadata Row */}
      <div className="flex flex-wrap gap-2 items-center">
        {claim.tier && (
          <Badge
            variant="outline"
            className={cn("text-xs", tierColors[claim.tier] || "")}
          >
            {claim.tier}
          </Badge>
        )}
        {claim.category && (
          <Badge variant="secondary" className="text-xs">
            {claim.category}
          </Badge>
        )}
        {claim.falsifiable && (
          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
            Falsifiable
          </Badge>
        )}
      </div>

      {/* Source & Date */}
      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
        {claim.source_name && (
          <span className="break-words">Source: {claim.source_name}</span>
        )}
        {claim.date_stated && (
          <span>Date: {claim.date_stated}</span>
        )}
      </div>
    </Card>
  );
}
