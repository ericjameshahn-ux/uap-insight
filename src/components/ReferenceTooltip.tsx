import { Link } from "react-router-dom";
import { ExternalLink, FileText, ArrowRight } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { references, Reference } from "@/lib/referencesData";

interface ReferenceTooltipProps {
  /** Reference ID from referencesData.ts, OR inline reference data */
  referenceId?: string;
  /** Inline reference data (used if referenceId not provided) */
  reference?: Reference;
  /** The text to display as the trigger */
  children: React.ReactNode;
  /** Additional className for the trigger */
  className?: string;
}

export function ReferenceTooltip({ 
  referenceId, 
  reference: inlineReference,
  children, 
  className = "" 
}: ReferenceTooltipProps) {
  const reference = referenceId ? references[referenceId] : inlineReference;

  if (!reference) {
    // If no reference found, just render the children as plain text
    return <span className={className}>{children}</span>;
  }

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          className={`inline-flex items-center gap-0.5 text-primary/90 hover:text-primary border-b border-dashed border-primary/40 hover:border-primary cursor-help transition-colors ${className}`}
        >
          {children}
          <FileText className="w-3 h-3 ml-0.5 opacity-60" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-80 p-0 overflow-hidden"
        align="start"
        sideOffset={8}
      >
        <div className="divide-y divide-border">
          {/* Header */}
          <div className="p-4 bg-muted/30">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm leading-snug">{reference.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{reference.source}</p>
                {reference.date && (
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">{reference.date}</p>
                )}
              </div>
            </div>
          </div>

          {/* Excerpt */}
          {reference.excerpt && (
            <div className="p-4">
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                "{reference.excerpt}"
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="p-3 bg-muted/20 flex gap-2">
            {reference.url && (
              <a
                href={reference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" size="sm" className="w-full text-xs h-7">
                  View Source
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </a>
            )}
            {reference.internalSection && (
              <Link to={`/section/${reference.internalSection}`} className="flex-1">
                <Button variant="ghost" size="sm" className="w-full text-xs h-7">
                  Section {reference.internalSection.toUpperCase()}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

// Convenience component for inline references without pre-defined data
interface InlineReferenceProps {
  title: string;
  source: string;
  url?: string;
  date?: string;
  excerpt?: string;
  children: React.ReactNode;
  className?: string;
}

export function InlineReference({
  title,
  source,
  url,
  date,
  excerpt,
  children,
  className
}: InlineReferenceProps) {
  return (
    <ReferenceTooltip
      reference={{
        id: 'inline',
        title,
        source,
        url,
        date,
        excerpt
      }}
      className={className}
    >
      {children}
    </ReferenceTooltip>
  );
}
