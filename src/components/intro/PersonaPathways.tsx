import { Link } from "react-router-dom";
import { Microscope, Swords, BookOpen, Search, Scale, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

interface Persona {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  startSection: string;
  color: string;
}

const personas: Persona[] = [
  {
    id: "empiricist",
    name: "The Empiricist",
    icon: Microscope,
    description: "Start with declassified documents and sensor data only.",
    startSection: "a",
    color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
  },
  {
    id: "strategist",
    name: "The Strategist",
    icon: Swords,
    description: "Start with game theory and national security implications.",
    startSection: "f",
    color: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
  },
  {
    id: "historian",
    name: "The Historian",
    icon: BookOpen,
    description: "Start with the 80-year pattern from 1940s to today.",
    startSection: "d",
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
  },
  {
    id: "investigator",
    name: "The Investigator",
    icon: Search,
    description: "Start with specific falsifiable claims and source evaluation.",
    startSection: "b",
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
  },
  {
    id: "skeptical",
    name: "The Skeptical Analyst",
    icon: Scale,
    description: "Start by stress-testing each assumption systematically.",
    startSection: "a",
    color: "from-slate-500/20 to-gray-500/20 border-slate-500/30",
  },
  {
    id: "meaning",
    name: "The Meaning-Seeker",
    icon: Compass,
    description: "Start with ontological and philosophical implications.",
    startSection: "i",
    color: "from-rose-500/20 to-red-500/20 border-rose-500/30",
  },
];

export function PersonaPathways() {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold mb-2 text-center">Choose Your Analytical Lens</h2>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        Different perspectives reveal different patterns. Select the approach that matches your analytical style.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {personas.map((persona) => {
          const Icon = persona.icon;

          return (
            <Link
              key={persona.id}
              to={`/section/${persona.startSection}`}
              className={cn(
                "block p-6 rounded-xl border-2 transition-all duration-200",
                "bg-gradient-to-br hover:scale-[1.02] hover:shadow-lg",
                persona.color
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="font-semibold">{persona.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{persona.description}</p>
              <span className="text-xs font-medium text-primary">
                Begin with Section {persona.startSection.toUpperCase()} →
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
