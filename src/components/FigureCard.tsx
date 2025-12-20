import { Shield, Award } from "lucide-react";
import { TierBadge } from "./TierBadge";
import { Figure } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface FigureCardProps {
  figure: Figure;
  compact?: boolean;
  onClick?: () => void;
}

export function FigureCard({ figure, compact = false, onClick }: FigureCardProps) {
  return (
    <div 
      className={cn(
        "card-elevated p-4 animate-fade-in",
        onClick && "cursor-pointer hover:shadow-md transition-shadow"
      )}
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
          
          <p className="text-sm text-muted-foreground mt-0.5">{figure.role}</p>
          
          {!compact && (
            <>
              <p className={cn("text-sm text-muted-foreground mt-2", compact && "line-clamp-2")}>
                {figure.credentials}
              </p>
              
              {figure.clearances && (
                <div className="flex items-center gap-1.5 mt-2 text-xs">
                  <Shield className="w-3 h-3 text-primary" />
                  <span className="text-primary font-medium">{figure.clearances}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
