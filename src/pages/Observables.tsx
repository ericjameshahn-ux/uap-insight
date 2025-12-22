import { Link } from "react-router-dom";
import { 
  Zap, 
  Gauge, 
  Waves, 
  Wind, 
  Eye, 
  Heart, 
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Scale,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FigureTooltip } from "@/components/FigureTooltip";
import { ReferenceTooltip } from "@/components/ReferenceTooltip";

interface Observable {
  id: number;
  title: string;
  icon: React.ElementType;
  definition: string;
  whyItMatters: string;
  keyExample: string;
  implication: string;
  credibility: 'HIGH' | 'MEDIUM';
  color: string;
}

const observables: Observable[] = [
  {
    id: 1,
    title: "Instantaneous Acceleration",
    icon: Zap,
    definition: "Objects reach extreme speeds or make sudden stops/turns without the buildup of speed required by conventional craft. Also described as \"absent apparent inertia.\"",
    whyItMatters: "Such maneuvers would subject any craft and occupants to potentially lethal G-forces under known physics. Human pilots would be killed instantly.",
    keyExample: "During the 2004 USS Nimitz encounter, radar tracked an object dropping from 28,000 feet to sea level in approximately 0.78 seconds—generating G-forces far beyond the structural limits of any known airframe.",
    implication: "Technology capable of neutralizing or manipulating inertia—a fundamental property of matter.",
    credibility: 'HIGH',
    color: "from-yellow-500/20 to-orange-500/20"
  },
  {
    id: 2,
    title: "Hypersonic Velocity",
    icon: Gauge,
    definition: "Travel well above Mach 5 without generating sonic booms or heat signatures from air friction. Also described as \"absent thermal signature and sonic shockwave.\"",
    whyItMatters: "Standard physics requires objects at these speeds to create shockwaves and significant heat plumes. The SR-71 Blackbird glowed red-hot at Mach 3.",
    keyExample: "UAP frequently reported moving silently at hypersonic speeds without infrared exhaust signatures, despite speeds that should cause extreme atmospheric heating.",
    implication: "Unknown propulsion that doesn't interact with atmosphere in expected ways—possibly manipulating space-time rather than pushing through air.",
    credibility: 'HIGH',
    color: "from-red-500/20 to-pink-500/20"
  },
  {
    id: 3,
    title: "Transmedium Travel",
    icon: Waves,
    definition: "Seamless transition between environments—space to atmosphere, atmosphere to ocean—without performance change or apparent aerodynamic drag.",
    whyItMatters: "Conventional craft are designed for ONE medium. Aircraft cannot become submarines; submarines cannot fly. The physics are fundamentally different.",
    keyExample: "During the Nimitz incident, the \"Tic Tac\" was observed interacting with a disturbance in the water and tracked moving from upper atmosphere to sea level with no apparent transition difficulty.",
    implication: "Craft designed for—or capable of dynamically adapting to—multiple physical environments, suggesting propulsion independent of medium.",
    credibility: 'HIGH',
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    id: 4,
    title: "Positive Lift (Anti-Gravity)",
    icon: Wind,
    definition: "Flight, hovering, or remaining stationary in high winds without wings, rotors, or visible propulsion systems.",
    whyItMatters: "Standard aerodynamics requires lift surfaces or thrust to counteract gravity. Helicopters need rotors; planes need wings and forward motion.",
    keyExample: "Witnesses consistently describe simple geometric shapes—spheres, discs, cylinders (like the \"Tic Tac\")—hovering motionlessly against strong winds, which should be aerodynamically impossible.",
    implication: "Anti-gravity or unknown lift mechanism that counteracts Earth's gravitational field directly.",
    credibility: 'HIGH',
    color: "from-green-500/20 to-emerald-500/20"
  },
  {
    id: 5,
    title: "Low Observability",
    icon: Eye,
    definition: "Difficult or impossible to detect across various sensor types—radar, infrared, electro-optical—despite being visible to the naked eye (or vice versa).",
    whyItMatters: "This represents stealth beyond current human capability. Our best stealth technology typically compromises ONE spectrum to hide in another—F-35 is radar-stealthy but visible to infrared.",
    keyExample: "Objects visible to pilots but absent from radar, or tracked on radar but invisible visually. Multiple sensor types showing contradictory data.",
    implication: "Active signature management across the entire electromagnetic spectrum—technology far beyond known capabilities.",
    credibility: 'HIGH',
    color: "from-purple-500/20 to-indigo-500/20"
  },
  {
    id: 6,
    title: "Biological Effects",
    icon: Heart,
    definition: "Physical and physiological effects on witnesses and the surrounding environment during close encounters. Often called \"the Sixth Observable.\"",
    whyItMatters: "Suggests interaction with biological systems that goes beyond visual observation—these objects may emit energy or fields that affect living tissue.",
    keyExample: "Documented effects include radiation-like burns, electromagnetic interference (vehicle shutdowns, phone malfunctions), neurological effects (disorientation, time perception changes), and the \"hitchhiker effect\" (phenomena following witnesses home).",
    implication: "UAP may emit unknown forms of energy or create localized field effects with biological consequences.",
    credibility: 'MEDIUM',
    color: "from-rose-500/20 to-red-500/20"
  }
];

export default function Observables() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link to="/intro">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Framework
          </Button>
        </Link>
        
        <h1 className="text-3xl font-bold mb-3">The Five Observables (Plus One)</h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
          These are the distinct performance characteristics used by U.S. government programs 
          (AATIP, UAP Task Force, AARO) to categorize aerial objects that defy known physics.
        </p>
      </div>

      {/* Legislative context */}
      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Legislative Codification</h3>
              <p className="text-sm text-muted-foreground">
                The first five observables were formally defined in the{" "}
                <ReferenceTooltip referenceId="schumer-amendment">
                  UAP Disclosure Act of 2023
                </ReferenceTooltip>
                {" "}as criteria for identifying "Unidentified Anomalous Phenomena" distinct from 
                attributed objects. The sixth—biological effects—was introduced by{" "}
                <FigureTooltip name="Luis Elizondo">Luis Elizondo</FigureTooltip>
                {" "}in his book "Imminent" and is recognized by researchers but not yet codified.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observables Grid */}
      <div className="space-y-6 mb-12">
        {observables.map((observable, index) => {
          const Icon = observable.icon;
          return (
            <Card 
              key={observable.id} 
              className="overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`h-1 bg-gradient-to-r ${observable.color}`} />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${observable.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="text-muted-foreground font-normal">#{observable.id}</span>
                        {observable.title}
                      </CardTitle>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={observable.credibility === 'HIGH' 
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' 
                      : 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                    }
                  >
                    {observable.credibility} CREDIBILITY
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Definition
                  </h4>
                  <p className="text-sm">{observable.definition}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <h4 className="text-sm font-semibold mb-1">Why It Matters</h4>
                    <p className="text-sm text-muted-foreground">{observable.whyItMatters}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <h4 className="text-sm font-semibold mb-1">Implication</h4>
                    <p className="text-sm text-muted-foreground">{observable.implication}</p>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-primary mb-1">Key Example</h4>
                  <p className="text-sm text-muted-foreground">{observable.keyExample}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Key Source */}
      <Card className="mb-8 bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Video className="w-5 h-5" />
            Key Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Primary Documentation</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <ReferenceTooltip referenceId="nimitz-encounter">USS Nimitz Encounter (2004)</ReferenceTooltip> - Multiple observables documented</li>
                <li>• <FigureTooltip name="David Grusch">David Grusch</FigureTooltip> Congressional Testimony (2023)</li>
                <li>• <FigureTooltip name="Luis Elizondo">Luis Elizondo</FigureTooltip> - "Imminent" (2024)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Official Acknowledgment</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Navy confirmed UAP videos are authentic (2020)</li>
                <li>• ODNI UAP Report acknowledges unexplained cases (2021)</li>
                <li>• AARO continues investigation of observables</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Sections */}
      <div className="flex flex-wrap gap-4">
        <Link to="/section/b">
          <Button variant="outline" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Section B: Real Physical Objects
          </Button>
        </Link>
        <Link to="/section/c">
          <Button variant="outline" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Section C: Physics-Defying Capabilities
          </Button>
        </Link>
        <Link to="/section/j">
          <Button variant="outline" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Section J: Physics R&D
          </Button>
        </Link>
      </div>
    </div>
  );
}
