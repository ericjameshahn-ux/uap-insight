interface Affiliation {
  organization: string;
  role: string;
  startYear: number;
  endYear: number | null;
  isGovernment: boolean;
}

interface RevolvingDoorTimelineProps {
  figureName: string;
  affiliations: Affiliation[];
}

export function RevolvingDoorTimeline({ figureName, affiliations }: RevolvingDoorTimelineProps) {
  const sortedAffiliations = [...affiliations].sort((a, b) => a.startYear - b.startYear);

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6">{figureName}</h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500" />

        {/* Affiliations */}
        <div className="space-y-4 sm:space-y-6">
          {sortedAffiliations.map((aff, index) => (
            <div key={index} className="relative pl-8 sm:pl-12">
              {/* Timeline dot */}
              <div
                className={`
                  absolute left-1.5 sm:left-2.5 top-1.5
                  w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2
                  ${aff.isGovernment
                    ? 'bg-blue-500 border-blue-300'
                    : 'bg-purple-500 border-purple-300'
                  }
                `}
              />

              <div
                className={`
                  p-3 sm:p-4 rounded-lg border
                  ${aff.isGovernment
                    ? 'bg-blue-900/20 border-blue-500/30'
                    : 'bg-purple-900/20 border-purple-500/30'
                  }
                `}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
                  <div>
                    <h4 className={`font-semibold text-sm sm:text-base ${aff.isGovernment ? 'text-blue-300' : 'text-purple-300'}`}>
                      {aff.organization}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{aff.role}</p>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                    {aff.startYear} - {aff.endYear || 'Present'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 sm:gap-6 mt-4 sm:mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs text-muted-foreground">Government</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-xs text-muted-foreground">Private Sector</span>
        </div>
      </div>
    </div>
  );
}
