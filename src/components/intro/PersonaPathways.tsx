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
    description: "Sensor data and multi-source confirmation first.",
    startSection: "a",
    color: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
  },
  {
    id: "historian",
    name: "The Historian",
    icon: BookOpen,
    description: "Patterns across decades and policy evolution.",
    startSection: "d",
    color: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
  },
  {
    id: "strategist",
    name: "The Strategist",
    icon: Swords,
    description: "National security and institutional behavior.",
    startSection: "f",
    color: "from-green-500/20 to-green-600/20 border-green-500/30",
  },
  {
    id: "investigator",
    name: "The Investigator",
    icon: Search,
    description: "Case forensics and witness credibility.",
    startSection: "b",
    color: "from-orange-500/20 to-orange-600/20 border-orange-500/30",
  },
  {
    id: "skeptic",
    name: "The Skeptic",
    icon: Scale,
    description: "Falsification and prosaic explanations first.",
    startSection: "a",
    color: "from-red-500/20 to-red-600/20 border-red-500/30",
  },
  {
    id: "technologist",
    name: "The Technologist",
    icon: Compass,
    description: "Physics, propulsion, and materials science.",
    startSection: "c",
    color: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30",
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
