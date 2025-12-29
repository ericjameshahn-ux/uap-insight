import { Badge } from "@/components/ui/badge";

interface ContractorCardProps {
  name: string;
  tier: "HIGH" | "MEDIUM" | "LOWER";
  description: string;
  uapRelevance: string;
  knownSaps?: string;
  headquarters?: string;
  fraudCases?: number;
  onClick?: () => void;
}

export function ContractorCard({
  name,
  tier,
  description,
  uapRelevance,
  knownSaps,
  headquarters,
  fraudCases,
  onClick
}: ContractorCardProps) {
  const tierColors = {
    HIGH: "bg-blue-600 text-blue-100",
    MEDIUM: "bg-yellow-600 text-yellow-100",
    LOWER: "bg-slate-600 text-slate-100"
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-card border border-border rounded-xl p-4 sm:p-5
        transition-all duration-300
        hover:border-primary/50 hover:shadow-lg
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg sm:text-xl font-bold text-foreground">{name}</h3>
        <Badge className={tierColors[tier]}>{tier}</Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      <div className="space-y-3">
        <div>
          <h4 className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-1">
            UAP Relevance
          </h4>
          <p className="text-sm text-foreground">{uapRelevance}</p>
        </div>

        {knownSaps && (
          <div>
            <h4 className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-1">
              Known SAP Areas
            </h4>
            <p className="text-sm text-muted-foreground">{knownSaps}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border">
        {headquarters && (
          <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
            {headquarters}
          </span>
        )}
        {fraudCases && fraudCases > 0 && (
          <span className="text-xs bg-red-900/30 text-red-400 px-2 py-1 rounded">
            {fraudCases} documented issues
          </span>
        )}
      </div>
    </div>
  );
}
