import { Building2, Eye, FlaskConical, Factory, Shield } from "lucide-react";

const tiers = [
  {
    level: 1,
    name: "Oversight Bodies",
    examples: "Gang of Eight • SSCI • HPSCI • GAO • IGs",
    color: "bg-purple-900/40 border-purple-500/50",
    textColor: "text-purple-300",
    icon: Eye,
    description: "Congressional and executive oversight with varying access levels"
  },
  {
    level: 2,
    name: "Executive Agencies",
    examples: "DoD • ODNI • CIA • NSA • DOE/NNSA",
    color: "bg-blue-900/40 border-blue-500/50",
    textColor: "text-blue-300",
    icon: Building2,
    description: "Government entities that sponsor and manage classified programs"
  },
  {
    level: 3,
    name: "FFRDCs & National Labs",
    examples: "Aerospace Corp • MITRE • Los Alamos • Sandia",
    color: "bg-cyan-900/40 border-cyan-500/50",
    textColor: "text-cyan-300",
    icon: FlaskConical,
    description: "Research centers bridging government needs and private innovation"
  },
  {
    level: 4,
    name: "Prime Contractors",
    examples: "Lockheed • Northrop • Raytheon • Boeing • SAIC",
    color: "bg-slate-700/40 border-slate-500/50",
    textColor: "text-slate-300",
    icon: Factory,
    description: "Private corporations executing classified programs and holding SAPs"
  },
  {
    level: 5,
    name: "Security Apparatus",
    examples: "SAPs • Clearances • Compartmentalization • NDAs",
    color: "bg-red-900/20 border-red-500/50",
    textColor: "text-red-300",
    icon: Shield,
    description: "The classification system that controls information flow"
  }
];

export function InstitutionalHierarchy() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-foreground tracking-wide">
        THE 5-TIER HIERARCHY
      </h2>

      <div className="space-y-3 sm:space-y-4">
        {tiers.map((tier, index) => {
          const Icon = tier.icon;
          return (
            <div key={tier.level} className="relative">
              <div
                className={`
                  ${tier.color} 
                  border rounded-lg p-3 sm:p-4 
                  transition-all duration-300 
                  hover:scale-[1.02] hover:shadow-lg
                  cursor-pointer
                `}
                title={tier.description}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`p-2 sm:p-3 rounded-full bg-background/20`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${tier.textColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs font-mono ${tier.textColor} opacity-70`}>
                      Tier {tier.level}
                    </span>
                    <h3 className={`text-base sm:text-lg font-semibold ${tier.textColor}`}>
                      {tier.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                      {tier.examples}
                    </p>
                  </div>
                </div>
              </div>

              {index < tiers.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className="w-px h-4 bg-gradient-to-b from-muted-foreground/50 to-transparent" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
