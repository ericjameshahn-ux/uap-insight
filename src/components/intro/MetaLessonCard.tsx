import { AlertTriangle } from "lucide-react";

export function MetaLessonCard() {
  const comparisons = [
    {
      element: "Smart people",
      examples: ["Vice President", "German Intel", "Graduate Students", "Senators"],
    },
    {
      element: "Doing their job",
      examples: ["Leading country", "Analyzing threats", "Pursuing science", "Overseeing spending"],
    },
    {
      element: "Using good methods",
      examples: ["Briefings", "Recon, intercepts", "Peer review, data", "Investigations"],
    },
    {
      element: "Still missed it",
      examples: ["Didn't know about bomb", "Fooled for 7 weeks", "Avoided topic for decades", "Stopped investigating"],
    },
    {
      element: "Because filter was invisible",
      examples: ["Compartmentalization", "Deliberate deception", "Coordinated stigma", '"National security"'],
    },
  ];

  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto">
        {/* Main Insight Card */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-xl font-bold">Intelligence Is Not Protection Against Deception</h2>
          </div>
          
          <p className="text-muted-foreground leading-relaxed mb-6">
            The people who missed these things weren't stupid. They weren't careless. They were operating in 
            information environments specifically designed to mislead them—and they didn't know it.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-background/50 rounded-lg p-4 text-center">
              <p className="font-semibold text-emerald-600 dark:text-emerald-400">Manhattan Project</p>
              <p className="text-sm text-muted-foreground mt-1">Large-scale secrets CAN be kept</p>
            </div>
            <div className="bg-background/50 rounded-lg p-4 text-center">
              <p className="font-semibold text-amber-600 dark:text-amber-400">Operation Fortitude</p>
              <p className="text-sm text-muted-foreground mt-1">Trained analysts CAN be deceived</p>
            </div>
            <div className="bg-background/50 rounded-lg p-4 text-center">
              <p className="font-semibold text-indigo-600 dark:text-indigo-400">Condon Report</p>
              <p className="text-sm text-muted-foreground mt-1">Academic inquiry CAN be suppressed</p>
            </div>
          </div>

          <p className="text-center font-medium">
            The question isn't whether this is possible—it's whether it's happening now.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Element</th>
                <th className="text-left py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">Manhattan</th>
                <th className="text-left py-3 px-4 font-semibold text-amber-600 dark:text-amber-400">Ghost Army</th>
                <th className="text-left py-3 px-4 font-semibold text-indigo-600 dark:text-indigo-400">Condon</th>
                <th className="text-left py-3 px-4 font-semibold text-purple-600 dark:text-purple-400">Congress</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium">{row.element}</td>
                  {row.examples.map((ex, j) => (
                    <td key={j} className="py-3 px-4 text-muted-foreground">{ex}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key Takeaway */}
        <div className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-6">
          <p className="text-sm uppercase tracking-wider text-primary font-semibold mb-3">Key Takeaway</p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Before proceeding into the UAP evidence, internalize this:
          </p>
          <blockquote className="border-l-4 border-primary pl-4 py-2 italic">
            "I might be wrong about this topic—not because I'm stupid or careless, but because smart, 
            careful people have been systematically deceived before. The filter is often invisible 
            to those operating within it."
          </blockquote>
          <p className="text-sm text-muted-foreground mt-4">
            This is not an argument that any particular UAP claim is true. It's an argument that our 
            default assumptions deserve scrutiny—and that the absence of proof is not proof of absence 
            when information environments have been deliberately manipulated.
          </p>
        </div>
      </div>
    </section>
  );
}
