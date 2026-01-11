import { Film, FileText, Clapperboard } from 'lucide-react';

interface HollywoodEvidence {
  title: string;
  date: string;
  badge: string;
  badgeColor: string;
  content: string;
  source: string;
  icon: React.ElementType;
}

const hollywoodEvidence: HollywoodEvidence[] = [
  {
    title: "Robertson Panel Recommendation",
    date: "January 1953",
    badge: "HIGH - CIA DECLASSIFIED",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    content: "CIA panel explicitly recommended using 'motion pictures' and the 'Walt Disney Company' to strip UFOs of mystery and reduce public interest.",
    source: "CIA declassified documents",
    icon: FileText
  },
  {
    title: "Project DOVE",
    date: "1980s",
    badge: "MEDIUM - REAGAN BRIEFING",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    content: "A briefing to President Reagan described 'Project DOVE' as using movies to 'dis-inform the public' while keeping minds open to the concept.",
    source: "Alleged Reagan briefing transcript",
    icon: Clapperboard
  },
  {
    title: "Close Encounters of the Third Kind",
    date: "1977",
    badge: "HIGH - DOCUMENTED",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    content: "Dr. J. Allen Hynek served as consultant. NASA wrote a 20-page letter warning the film would be 'dangerous to release.' A Reagan briefing stated the government 'provided the basic subject matter.'",
    source: "Multiple documented sources",
    icon: Film
  }
];

export function HollywoodDisclosure() {
  return (
    <section className="bg-slate-800/50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-slate-500 text-xs font-mono tracking-widest mb-2">CONTROLLED DISCLOSURE</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Hollywood as a Policy Tool</h2>
          <p className="text-slate-400 mt-2 text-sm max-w-2xl">
            Evidence suggests entertainment media has been used to manage public perception of UAP—both to debunk and to gradually acclimate.
          </p>
        </div>
        
        {/* Evidence Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {hollywoodEvidence.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="bg-slate-900 border border-slate-700 rounded-lg p-5"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-slate-800 rounded-lg p-2 flex-shrink-0">
                    <Icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                    <p className="text-slate-500 text-xs">{item.date}</p>
                  </div>
                </div>
                
                <span className={`inline-block px-2 py-0.5 text-xs font-mono rounded border mb-3 ${item.badgeColor}`}>
                  {item.badge}
                </span>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-3">
                  {item.content}
                </p>
                
                <p className="text-slate-500 text-xs italic">
                  Source: {item.source}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
