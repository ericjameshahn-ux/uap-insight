import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network } from "lucide-react";

interface NetworkNode {
  id: string;
  name: string;
  role: string;
  category: "core" | "government" | "corroborator" | "witness";
}

interface NetworkConnection {
  from: string;
  to: string;
  label: string;
}

const nodes: NetworkNode[] = [
  { id: "eric-davis", name: "Eric Davis", role: "Author", category: "core" },
  { id: "thomas-wilson", name: "Thomas Wilson", role: "Subject", category: "core" },
  { id: "hal-puthoff", name: "Hal Puthoff", role: "NIDS Colleague", category: "corroborator" },
  { id: "christopher-mellon", name: "Christopher Mellon", role: "DoD Official", category: "corroborator" },
  { id: "david-grusch", name: "David Grusch", role: "Whistleblower", category: "witness" },
  { id: "lue-elizondo", name: "Lue Elizondo", role: "AATIP Director", category: "corroborator" },
  { id: "edgar-mitchell", name: "Edgar Mitchell", role: "Provenance Source", category: "witness" },
];

const connections: NetworkConnection[] = [
  { from: "eric-davis", to: "hal-puthoff", label: "NIDS colleagues" },
  { from: "eric-davis", to: "christopher-mellon", label: "Congressional briefings" },
  { from: "eric-davis", to: "david-grusch", label: "ICIG witness" },
  { from: "eric-davis", to: "lue-elizondo", label: "AATIP consultants" },
  { from: "eric-davis", to: "thomas-wilson", label: "Meeting subject" },
  { from: "edgar-mitchell", to: "hal-puthoff", label: "Consciousness research" },
  { from: "christopher-mellon", to: "david-grusch", label: "Disclosure support" },
];

const categoryStyles = {
  core: "bg-indigo-600 text-white border-indigo-500",
  government: "bg-blue-600 text-white border-blue-500",
  corroborator: "bg-green-600 text-white border-green-500",
  witness: "bg-amber-600 text-white border-amber-500",
};

const categoryLabels = {
  core: "Core Figures",
  government: "Government Officials",
  corroborator: "Corroborators",
  witness: "Witnesses",
};

export function WilsonDavisNetwork() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Figure Network
        </CardTitle>
        <CardDescription>
          Connections between key individuals in the Wilson-Davis memo story
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <Badge key={key} className={categoryStyles[key as keyof typeof categoryStyles]}>
              {label}
            </Badge>
          ))}
        </div>

        {/* Network Visualization */}
        <div className="relative">
          {/* SVG Connection Lines - Desktop */}
          <svg className="hidden md:block absolute inset-0 w-full h-full pointer-events-none" style={{ height: 280 }}>
            {/* Central hub lines from Davis */}
            <line x1="50%" y1="60" x2="20%" y2="140" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="4" />
            <line x1="50%" y1="60" x2="35%" y2="200" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="4" />
            <line x1="50%" y1="60" x2="50%" y2="200" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="4" />
            <line x1="50%" y1="60" x2="65%" y2="200" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="4" />
            <line x1="50%" y1="60" x2="80%" y2="140" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="4" />
            {/* Cross connections */}
            <line x1="20%" y1="140" x2="35%" y2="200" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="2" opacity="0.5" />
            <line x1="65%" y1="200" x2="80%" y2="140" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="2" opacity="0.5" />
          </svg>

          {/* Nodes Grid */}
          <div className="relative z-10">
            {/* Top Row - Core */}
            <div className="flex justify-center gap-8 mb-8">
              <Link
                to="/figures?search=davis"
                className="flex flex-col items-center p-3 rounded-lg border-2 border-indigo-500 bg-indigo-600/10 hover:bg-indigo-600/20 transition-colors min-w-[100px]"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  ED
                </div>
                <span className="text-sm font-medium mt-2 text-center">Eric Davis</span>
                <span className="text-xs text-muted-foreground">Author</span>
              </Link>
            </div>

            {/* Middle Row - Corroborators */}
            <div className="flex justify-center gap-4 md:gap-8 mb-8 flex-wrap">
              {[
                { id: "hal-puthoff", initials: "HP", name: "Hal Puthoff", role: "Corroborated 2018", category: "corroborator" as const },
                { id: "thomas-wilson", initials: "TW", name: "Thomas Wilson", role: "Subject (Denies)", category: "core" as const },
              ].map((node) => (
                <Link
                  key={node.id}
                  to={`/figures?search=${node.name.split(' ')[1].toLowerCase()}`}
                  className={`flex flex-col items-center p-3 rounded-lg border-2 hover:opacity-80 transition-opacity min-w-[90px] ${
                    node.category === "core" 
                      ? "border-indigo-500 bg-indigo-600/10" 
                      : "border-green-500 bg-green-600/10"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    node.category === "core" ? "bg-indigo-600" : "bg-green-600"
                  }`}>
                    {node.initials}
                  </div>
                  <span className="text-sm font-medium mt-2 text-center">{node.name}</span>
                  <span className="text-xs text-muted-foreground text-center">{node.role}</span>
                </Link>
              ))}
            </div>

            {/* Bottom Row - Witnesses & Additional Corroborators */}
            <div className="flex justify-center gap-3 md:gap-6 flex-wrap">
              {[
                { id: "edgar-mitchell", initials: "EM", name: "Edgar Mitchell", role: "Provenance", category: "witness" as const },
                { id: "christopher-mellon", initials: "CM", name: "Chris Mellon", role: "Confirmed Author", category: "corroborator" as const },
                { id: "david-grusch", initials: "DG", name: "David Grusch", role: "Parallel Claims", category: "witness" as const },
                { id: "lue-elizondo", initials: "LE", name: "Lue Elizondo", role: "Confirmed in Book", category: "corroborator" as const },
              ].map((node) => (
                <Link
                  key={node.id}
                  to={`/figures?search=${node.name.split(' ')[1].toLowerCase()}`}
                  className={`flex flex-col items-center p-2 rounded-lg border-2 hover:opacity-80 transition-opacity min-w-[80px] ${
                    node.category === "witness" 
                      ? "border-amber-500 bg-amber-600/10" 
                      : "border-green-500 bg-green-600/10"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    node.category === "witness" ? "bg-amber-600" : "bg-green-600"
                  }`}>
                    {node.initials}
                  </div>
                  <span className="text-xs font-medium mt-1 text-center">{node.name}</span>
                  <span className="text-xs text-muted-foreground text-center">{node.role}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Connection Legend */}
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-2">Key Connections</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div>• Davis & Puthoff: NIDS colleagues, Puthoff verified Jan 2018</div>
            <div>• Davis & Mellon: Mellon arranged congressional briefings</div>
            <div>• Davis & Grusch: Davis was among Grusch's ICIG witnesses</div>
            <div>• Davis & Elizondo: Both AATIP consultants</div>
            <div>• Mitchell estate: Document provenance source</div>
            <div>• Mellon & Grusch: Disclosure coordination</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
