const levels = [
  {
    name: "WAIVED SAP",
    subtitle: '"Deep Black" / Unacknowledged',
    width: "w-32 sm:w-40",
    color: "bg-red-600",
    glow: "shadow-[0_0_15px_rgba(220,38,38,0.6)]",
    textColor: "text-red-200",
    description: "Existence denied. Exempt from standard reporting. Only Gang of Eight may be briefed."
  },
  {
    name: "ACKNOWLEDGED SAP",
    subtitle: "Need-to-Know Compartments",
    width: "w-40 sm:w-52",
    color: "bg-orange-600",
    glow: "",
    textColor: "text-orange-200",
    description: "Existence known, details classified. 'Black programs' with public names but secret budgets."
  },
  {
    name: "TOP SECRET / SCI",
    subtitle: "Sensitive Compartmented Info",
    width: "w-48 sm:w-64",
    color: "bg-yellow-600",
    glow: "",
    textColor: "text-yellow-200",
    description: "Information requiring special access controls. Managed by DNI and agency heads."
  },
  {
    name: "SECRET",
    subtitle: "Serious Damage to Nat. Sec.",
    width: "w-56 sm:w-80",
    color: "bg-blue-600",
    glow: "",
    textColor: "text-blue-200",
    description: "Standard classification for sensitive military and intelligence information."
  },
  {
    name: "CONFIDENTIAL",
    subtitle: "Basic Classification",
    width: "w-64 sm:w-96",
    color: "bg-slate-600",
    glow: "",
    textColor: "text-slate-300",
    description: "Lowest classification level. Information that could cause damage if disclosed."
  }
];

export function ClassificationPyramid() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-foreground">
        Clearance Hierarchy
      </h2>

      {/* Pyramid */}
      <div className="flex flex-col items-center space-y-1">
        {levels.map((level, index) => (
          <div
            key={level.name}
            className={`
              ${level.width} 
              ${level.color} 
              ${level.glow}
              py-2 sm:py-3 px-3 sm:px-4 
              text-center 
              rounded-sm
              ${index > 0 ? '-mt-1' : ''}
              relative
              transition-all duration-300
              hover:scale-105 hover:z-10
              cursor-pointer
            `}
            style={{ zIndex: levels.length - index }}
            title={level.description}
          >
            <div className={`text-xs sm:text-sm font-bold ${level.textColor}`}>
              {level.name}
            </div>
            <div className={`text-[10px] sm:text-xs ${level.textColor} opacity-70 mt-0.5`}>
              {level.subtitle}
            </div>
          </div>
        ))}
      </div>

      {/* Annotation */}
      <div className="mt-6 sm:mt-8 text-center">
        <div className="inline-block bg-muted/50 rounded-lg p-3 sm:p-4 max-w-md">
          <p className="text-xs sm:text-sm text-muted-foreground">
            The "Gatekeeper" effect occurs at the TS/SCI to SAP transition,
            where access is controlled by specific program managers rather than general clearance level.
          </p>
        </div>
      </div>
    </div>
  );
}
