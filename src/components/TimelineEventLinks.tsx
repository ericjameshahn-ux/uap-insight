import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, FileText } from "lucide-react";

interface TimelineEventLinksProps {
  relatedSections?: string[];
  relatedFigures?: string[];
  relatedClaims?: string[];
}

// Map section IDs to readable names and routes
const sectionMapping: Record<string, { name: string; route: string }> = {
  A: { name: "Whistleblower Testimony", route: "/sections/a" },
  B: { name: "Legislation & Oversight", route: "/sections/b" },
  C: { name: "Aerospace Evidence", route: "/sections/c" },
  D: { name: "Scientific Analysis", route: "/sections/d" },
  E: { name: "Historical Context", route: "/sections/e" },
  F: { name: "International Cases", route: "/sections/f" },
  G: { name: "Government Documents", route: "/sections/g" },
  H: { name: "Military Encounters", route: "/sections/h" },
  I: { name: "Radar & Sensor Data", route: "/sections/i" },
  J: { name: "Crash Retrieval", route: "/sections/j" },
  K: { name: "Reverse Engineering", route: "/sections/k" },
  L: { name: "Disclosure Timeline", route: "/sections/l" },
  M: { name: "Media Coverage", route: "/sections/m" },
  N: { name: "Origin Hypotheses", route: "/section/n" },
};

export function TimelineEventLinks({
  relatedSections = [],
  relatedFigures = [],
  relatedClaims = [],
}: TimelineEventLinksProps) {
  const hasLinks =
    relatedSections.length > 0 ||
    relatedFigures.length > 0 ||
    relatedClaims.length > 0;

  if (!hasLinks) return null;

  return (
    <div className="mt-4 pt-4 border-t border-border space-y-3">
      {/* Related Sections */}
      {relatedSections.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Sections:</span>
          </div>
          {relatedSections.map((sectionId) => {
            const section = sectionMapping[sectionId.toUpperCase()];
            if (!section) return null;
            return (
              <Link key={sectionId} to={section.route}>
                <Badge
                  variant="outline"
                  className="hover:bg-primary/10 hover:border-primary/50 transition-colors cursor-pointer text-xs"
                >
                  {sectionId.toUpperCase()}: {section.name}
                </Badge>
              </Link>
            );
          })}
        </div>
      )}

      {/* Related Figures */}
      {relatedFigures.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>Figures:</span>
          </div>
          {relatedFigures.map((figure) => (
            <Link key={figure} to={`/figures?search=${encodeURIComponent(figure)}`}>
              <Badge
                variant="secondary"
                className="hover:bg-secondary/80 transition-colors cursor-pointer text-xs"
              >
                {figure}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {/* Related Claims */}
      {relatedClaims.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            <span>Claims:</span>
          </div>
          {relatedClaims.map((claimId) => (
            <Link key={claimId} to={`/claims?id=${claimId}`}>
              <Badge
                variant="outline"
                className="hover:bg-accent transition-colors cursor-pointer text-xs border-accent"
              >
                Claim #{claimId}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
