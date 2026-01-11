import { Quote } from 'lucide-react';

interface ClassificationQuote {
  quote: string;
  attribution: string;
  role: string;
  context: string;
  date: string;
  tier: 'HIGH' | 'MEDIUM';
}

const classificationQuotes: ClassificationQuote[] = [
  {
    quote: "The matter is the most highly classified subject in the United States Government, rating higher even than the H-bomb.",
    attribution: "Wilbert Smith",
    role: "Canadian Dept. of Transport Engineer",
    context: "Memo summarizing conversation with US scientist Dr. Robert Sarbacher",
    date: "November 21, 1950",
    tier: "HIGH"
  },
  {
    quote: "[The extraterrestrial issue] was bigger than the Manhattan Project and required that it be managed on a larger scale and obviously for a longer period... They would form nothing less than a government within the government.",
    attribution: "Gen. Nathan Twining",
    role: "Commanding General, Air Materiel Command (later Chairman, Joint Chiefs)",
    context: "Alleged statement to President Truman regarding creation of MJ-12",
    date: "September 24, 1947",
    tier: "MEDIUM"
  },
  {
    quote: "Sarah, there's a secret government inside the government, and I don't control it.",
    attribution: "President Bill Clinton",
    role: "42nd President of the United States",
    context: "Reply to White House reporter Sarah McClendon asking about UFO disclosure",
    date: "1990s",
    tier: "HIGH"
  },
  {
    quote: "What the hell is the Executive Branch doing? Have they been running this for 60 years without congressional oversight?",
    attribution: "Senator Marco Rubio",
    role: "Vice Chair, Senate Intelligence Committee",
    context: "Classified briefing on 'Immaculate Constellation' program (transcript read by whistleblower)",
    date: "2024",
    tier: "HIGH"
  }
];

export function ClassificationQuotes() {
  return (
    <section className="bg-slate-800 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-slate-500 text-xs font-mono tracking-widest mb-2">THE SCALE OF SECRECY</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Classified Higher Than the Atomic Bomb</h2>
        </div>
        
        {/* Quote Cards - Horizontal scroll on mobile, grid on desktop */}
        <div className="flex md:grid md:grid-cols-2 gap-4 overflow-x-auto pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0">
          {classificationQuotes.map((item, index) => (
            <div 
              key={index}
              className="flex-shrink-0 w-[85vw] md:w-auto bg-slate-900 border border-slate-700 rounded-lg p-5 relative"
            >
              {/* Tier Badge */}
              <span className={`absolute top-4 right-4 px-2 py-0.5 text-xs font-mono rounded ${
                item.tier === 'HIGH' 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {item.tier}
              </span>
              
              <Quote className="w-8 h-8 text-slate-600 mb-3" />
              
              <blockquote className="text-slate-200 text-sm leading-relaxed mb-4 pr-12">
                "{item.quote}"
              </blockquote>
              
              <div className="border-t border-slate-700 pt-3 mt-auto">
                <p className="font-semibold text-white text-sm">{item.attribution}</p>
                <p className="text-slate-400 text-xs">{item.role}</p>
                <p className="text-slate-500 text-xs mt-1 italic">{item.context}</p>
                <p className="text-slate-600 text-xs mt-1">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
