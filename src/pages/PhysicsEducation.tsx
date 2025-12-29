import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Zap,
  Brain,
  Compass,
  Cpu,
  Battery,
  Layers,
  Atom,
  ExternalLink,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Users,
  Target,
  Scale,
  FlaskConical,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { supabase, Figure, Claim } from "@/lib/supabase";

// Physics Stack Layer Data
const physicsLayers = [
  {
    layer: 6,
    name: "Pilot Interface",
    category: "Consciousness",
    summary: "No visible controls—pilot controls craft by thought",
    science: "Orch-OR theory proposes consciousness uses quantum processes in microtubules. If proven, could enable direct mind-machine interfaces.",
    keyFigures: ["Roger Penrose (Nobel)", "Stuart Hameroff", "Federico Faggin"],
    tier: "LOWER",
    tierLabel: "Theoretical",
    icon: Brain,
    color: "violet",
  },
  {
    layer: 5,
    name: "Control System",
    category: "Metric Engineering",
    summary: "Craft warps space around itself, 'surfing' on spacetime distortion",
    science: "Puthoff's 'Polarizable Vacuum' model treats gravity as vacuum refractive index. Craft would exhibit blue glow forward, red/orange aft—matching witness reports.",
    keyFigures: ["Hal Puthoff", "Eric Davis", "Miguel Alcubierre"],
    tier: "MEDIUM",
    tierLabel: "Medium",
    icon: Compass,
    color: "amber",
  },
  {
    layer: 4,
    name: "Propulsion",
    category: "Inertial Mass Reduction",
    summary: "EM fields 'polarize' quantum vacuum, creating bubble where inertia is reduced",
    science: "Navy patents (Pais Effect) describe mechanism; tests failed due to materials. Need 1.32 × 10^18 V/m (Schwinger Limit)—we achieved 10^-8 of that.",
    keyFigures: ["Salvatore Pais", "Jack Sarfatti"],
    tier: "MEDIUM",
    tierLabel: "Patented, tested, failed on materials",
    icon: Zap,
    color: "amber",
  },
  {
    layer: 3,
    name: "Energy Source",
    category: "ZPE / Fusion / Antimatter",
    summary: "Gigawatts of power in something the size of a car",
    science: "Candidates: Zero-Point Energy | Compact Fusion | Antimatter. Current Status: Fusion closest (Helion, Commonwealth); ZPE theoretical; Antimatter impractical.",
    keyFigures: ["Hal Puthoff (ZPE)", "Bob Lazar (antimatter claims)"],
    tier: "MEDIUM",
    tierLabel: "Fusion: Medium | ZPE/Antimatter: Lower",
    icon: Battery,
    color: "amber",
  },
  {
    layer: 2,
    name: "Materials",
    category: "Metamaterials / Fröhlich Condensates",
    summary: "Craft skin is layered bismuth/magnesium acting as Terahertz waveguide",
    science: "Fröhlich Condensate = all atoms vibrating in sync, enabling macro quantum effects. 'Art's Parts' studied by Stanford, US Army—structure anomalous.",
    keyFigures: ["Garry Nolan", "Jack Sarfatti", "Hal Puthoff"],
    tier: "MEDIUM",
    tierLabel: "Samples exist, function unknown",
    icon: Layers,
    color: "amber",
  },
  {
    layer: 1,
    name: "Fuel",
    category: "Element 115 / Island of Stability",
    summary: "Stable superheavy element releases strong nuclear force for gravity manipulation",
    science: "Element 115 synthesized 2003 (14 years after Lazar claimed it); current isotopes unstable. Stable Moscovium-299 would prove non-terrestrial origin.",
    keyFigures: ["Bob Lazar"],
    tier: "LOWER",
    tierLabel: "Unverified claims",
    icon: Atom,
    color: "slate",
  },
];

// Historical Timeline Data
const historicalTimeline = [
  {
    year: "1948",
    event: "Roger Babson founds Gravity Research Foundation",
    detail: "Funded anti-gravity monuments at 13+ universities",
  },
  {
    year: "1953",
    event: "Bryce DeWitt wins GRF essay by proving gravity shielding impossible",
    detail: "His honesty impresses patron Agnew Bahnson",
  },
  {
    year: "1955",
    event: "NY Herald Tribune runs 'Conquest of Gravity' series",
    detail: "Martin, Bell, Convair, Lear, Sikorsky all had gravity programs. RIAS founded, contracts German physicist Burkhard Heim.",
  },
  {
    year: "1956",
    event: "USAF hires Joshua Goldberg after colonel believes anti-gravity imminent",
    detail: "Creates primary global funding source for General Relativity",
  },
  {
    year: "1957",
    event: "Chapel Hill Conference (GR1) launches 'Golden Age' of gravity research",
    detail: "Funded by anti-gravity money, produced modern gravitational physics. Feynman's 'sticky bead' argument proves gravitational waves carry energy.",
  },
  {
    year: "1963",
    event: "Roy Kerr discovers rotating black hole mathematics at USAF ARL",
    detail: "'The Air Force didn't get a flying saucer, but they got black holes'",
  },
  {
    year: "1969",
    event: "Mansfield Amendment requires DoD research have 'direct military function'",
    detail: "Open gravity research ends. Promising work potentially moves to classified IRAD programs.",
  },
];

// Strategic Value Table Data
const strategicBreakthroughs = [
  {
    breakthrough: "Room-Temp Superconductors",
    technology: "Lossless power grids, portable MRI",
    impact: "Energy revolution",
  },
  {
    breakthrough: "Compact Fusion",
    technology: "Unlimited clean energy",
    impact: "Climate solution",
  },
  {
    breakthrough: "Vacuum Energy",
    technology: "Grid-free power anywhere",
    impact: "Geopolitical shift",
  },
  {
    breakthrough: "Gravity Control",
    technology: "Flying vehicles, space elevators",
    impact: "Transportation revolution",
  },
  {
    breakthrough: "Warp Metric Engineering",
    technology: "Interstellar probes in decades",
    impact: "Humanity becomes spacefaring",
  },
];

// Physics-related figure IDs for querying
const physicsFigureIds = [
  'karl-svozil', 'hal-puthoff', 'salvatore-pais', 'miguel-alcubierre',
  'roy-kerr', 'joshua-goldberg', 'bryce-dewitt', 'garry-nolan',
  'jack-sarfatti', 'federico-faggin'
];

// Tier badge styling
const getTierStyles = (tier: string) => {
  switch (tier) {
    case "HIGH":
      return "bg-conviction-high-bg text-conviction-high-text";
    case "MEDIUM":
      return "bg-conviction-medium-bg text-conviction-medium-text";
    case "LOWER":
      return "bg-conviction-lower-bg text-conviction-lower-text";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const PhysicsEducation = () => {
  const [showCalculation, setShowCalculation] = useState(false);
  const [figures, setFigures] = useState<Figure[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch physics-related figures
      const { data: figuresData } = await supabase
        .from('figures')
        .select('*')
        .or(`role.ilike.%physicist%,role.ilike.%physics%,id.in.(${physicsFigureIds.join(',')})`)
        .order('tier', { ascending: true })
        .limit(10);

      if (figuresData) {
        setFigures(figuresData);
      }

      // Fetch Section J claims for preview
      const { data: claimsData } = await supabase
        .from('claims')
        .select('*')
        .eq('section_id', 'j')
        .order('id')
        .limit(5);

      if (claimsData) {
        setClaims(claimsData);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          {/* Persona Relevance Banner */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="outline" className="text-xs">
              <Zap className="w-3 h-3 mr-1" /> Technologists
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Scale className="w-3 h-3 mr-1" /> Skeptical Analysts
            </Badge>
            <Badge variant="outline" className="text-xs">
              <FlaskConical className="w-3 h-3 mr-1" /> Empiricists
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Shield className="w-3 h-3 mr-1" /> Strategists
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            The Physics of UAP
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl">
            A Non-Physicist's Guide to the Science Behind the Claims
          </p>
          
          <p className="text-base sm:text-lg text-foreground/80 mb-8 max-w-3xl leading-relaxed">
            The reported capabilities of UAP—instantaneous acceleration, silent hypersonic flight, 
            trans-medium travel—appear to violate known physics. But a growing body of theoretical 
            work and government patents suggests these capabilities could be achieved through 
            specific physics breakthroughs. Even if UAP claims prove prosaic, solving these 
            physics problems would unlock transformative technologies.
          </p>

          {/* Key Insight Card */}
          <Card className="bg-primary/5 border-primary/20 max-w-3xl">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-primary mb-2">Key Insight</p>
                  <p className="text-sm sm:text-base text-foreground/90 italic">
                    "Even if every UAP claim is misidentification, these physics frontiers represent 
                    humanity's most important unsolved problems. The nation that masters vacuum 
                    engineering and compact fusion will possess advantages equivalent to sole 
                    nuclear capability in 1945."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 1: The Core Problem */}
      <section className="py-12 sm:py-16 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-foreground">
            Why UAP Seem Impossible
          </h2>

          <Card 
            className={cn(
              "overflow-hidden transition-all duration-500 cursor-pointer",
              showCalculation ? "ring-2 ring-primary/50" : "hover:shadow-lg"
            )}
            onClick={() => setShowCalculation(!showCalculation)}
          >
            <CardHeader className="bg-gradient-to-r from-destructive/10 to-destructive/5 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-xl">The Tic Tac Calculation</CardTitle>
                    <CardDescription>Click to reveal the physics solution</CardDescription>
                  </div>
                </div>
                {showCalculation ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="font-mono text-sm space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-destructive font-semibold mb-2">OBSERVED:</p>
                  <p className="text-foreground">
                    Object dropped 28,000 ft to sea level in 0.78 seconds (~24,000 mph)
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground font-semibold mb-2">
                    For a conventional 10,000 kg craft, this would require:
                  </p>
                  <ul className="space-y-1 text-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">├──</span>
                      <span><strong>738 Gigawatts</strong> of power (60% of entire US electrical grid)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">├──</span>
                      <span><strong>1,400 Gs</strong> of acceleration (instantly lethal)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">└──</span>
                      <span><strong>Nuclear explosion</strong> energy release (no thermal bloom observed)</span>
                    </li>
                  </ul>
                </div>

                {showCalculation && (
                  <div className="animate-fade-in p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-primary font-semibold mb-2">THE SOLUTION: Make the craft effectively massless.</p>
                    <ul className="space-y-1 text-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">├──</span>
                        <span>Reduce inertial mass by factor of <strong>1,000,000</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">├──</span>
                        <span>Power requirement drops to <strong>738 Kilowatts</strong> (large generator)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">└──</span>
                        <span>G-forces <strong>eliminated</strong> (no inertia = no crushing)</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 2: The Physics Stack */}
      <section className="py-12 sm:py-16 border-b border-border bg-muted/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
            Six Layers of UAP Technology
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Like building blocks, each layer depends on the ones below it. Solving lower layers 
            enables the capabilities above.
          </p>

          <div className="space-y-3">
            {physicsLayers.map((layer) => {
              const IconComponent = layer.icon;
              return (
                <Accordion key={layer.layer} type="single" collapsible>
                  <AccordionItem value={`layer-${layer.layer}`} className="border-0">
                    <Card className="overflow-hidden">
                      <AccordionTrigger className="hover:no-underline p-0">
                        <CardHeader className="w-full p-4 sm:p-6">
                          <div className="flex items-center gap-4 text-left">
                            <div className={cn(
                              "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
                              layer.tier === "LOWER" ? "bg-muted" : "bg-primary/10"
                            )}>
                              <span className="text-lg font-bold text-foreground">{layer.layer}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="font-semibold text-foreground">{layer.name}</span>
                                <span className="text-xs text-muted-foreground">({layer.category})</span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate sm:whitespace-normal">
                                {layer.summary}
                              </p>
                            </div>
                            <Badge className={cn("shrink-0 hidden sm:inline-flex", getTierStyles(layer.tier))}>
                              {layer.tier}
                            </Badge>
                          </div>
                        </CardHeader>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardContent className="pt-0 px-4 sm:px-6 pb-6 space-y-4">
                          <div className="pl-16">
                            <Badge className={cn("mb-3 sm:hidden", getTierStyles(layer.tier))}>
                              {layer.tierLabel}
                            </Badge>
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                  The Science
                                </p>
                                <p className="text-sm text-foreground leading-relaxed">
                                  {layer.science}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                  Key Figures
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {layer.keyFigures.map((figure) => (
                                    <Badge key={figure} variant="outline" className="text-xs">
                                      {figure}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </AccordionContent>
                    </Card>
                  </AccordionItem>
                </Accordion>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: Historical Legitimacy */}
      <section className="py-12 sm:py-16 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
            When Anti-Gravity Was Mainstream
          </h2>
          <p className="text-muted-foreground mb-8">1948–1969</p>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-6">
              {historicalTimeline.map((item, index) => (
                <div key={index} className="relative pl-12 sm:pl-20">
                  {/* Year bubble */}
                  <div className="absolute left-0 sm:left-4 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border-2 border-background">
                    <span className="text-[10px] font-bold text-primary">{item.year.slice(2)}</span>
                  </div>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                        <Badge variant="outline" className="self-start font-mono text-xs shrink-0">
                          {item.year}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-medium text-foreground mb-1">{item.event}</p>
                          <p className="text-sm text-muted-foreground">{item.detail}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Key Quote */}
          <Card className="mt-10 bg-accent/50 border-accent">
            <CardContent className="p-6">
              <blockquote className="italic text-foreground/90">
                "It is a profound historical irony that the modern scientific understanding of 
                gravity was funded by 'anti-gravity money.'"
              </blockquote>
              <p className="text-sm text-muted-foreground mt-3">
                — Historical analysis of Chapel Hill Conference
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 4: The Bottleneck */}
      <section className="py-12 sm:py-16 border-b border-border bg-muted/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-foreground">
            Why We Can't Build One (Yet)
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* What We Need */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  What We Need
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-sm">Room-temperature superconductors</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-sm">Super-dielectrics that withstand extreme EM fields</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-sm">Compact power sources (GW scale)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-sm">Metamaterials with precise isotope placement</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Where We Are */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-muted-foreground" />
                  Where We Are
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2 shrink-0" />
                    <span className="text-sm">Best superconductors: -70°C (LK-99 controversy unresolved)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2 shrink-0" />
                    <span className="text-sm">Navy Pais tests: 10⁻⁸ of required charge</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2 shrink-0" />
                    <span className="text-sm">Fusion: Still years from net positive</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2 shrink-0" />
                    <span className="text-sm">Metamaterials: Can analyze, can't replicate</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <p className="text-sm sm:text-base text-foreground/90 italic text-center">
                "The Navy's failed experiments prove not that the physics is wrong, 
                but that we lack the materials to test it properly."
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 5: Why It Matters */}
      <section className="py-12 sm:py-16 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
            The Strategic Value—Even for Skeptics
          </h2>
          <p className="text-muted-foreground mb-8">
            Whether UAP are real technology or not, these physics breakthroughs would transform civilization.
          </p>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-[500px] px-4 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Physics Breakthrough</TableHead>
                    <TableHead className="font-semibold">Technology Unlocked</TableHead>
                    <TableHead className="font-semibold">Strategic Impact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {strategicBreakthroughs.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.breakthrough}</TableCell>
                      <TableCell className="text-muted-foreground">{row.technology}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {row.impact}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <Card className="mt-8 bg-accent/50 border-accent">
            <CardContent className="p-6">
              <p className="text-sm sm:text-base text-foreground/90 italic text-center">
                "These are the same capabilities the 'Five Observables' describe. Whether UAP 
                are real technology or not, the physics that would enable them is worth pursuing."
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 6: Key Figures */}
      <section className="py-12 sm:py-16 border-b border-border bg-muted/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                The Scientists Behind the Research
              </h2>
              <p className="text-muted-foreground mt-2">
                Physicists and researchers advancing our understanding
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link to="/figures">
                View All Figures <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : figures.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {figures.slice(0, 6).map((figure) => (
                <Card key={figure.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-foreground truncate">{figure.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">{figure.role}</p>
                        {figure.tier && (
                          <Badge className={cn("mt-2 text-[10px]", getTierStyles(figure.tier))}>
                            {figure.tier}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Connect to the database to view physics researchers
                </p>
              </CardContent>
            </Card>
          )}

          <Button variant="outline" asChild className="w-full mt-6 sm:hidden min-h-[44px]">
            <Link to="/figures">
              View All Figures <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Section 7: Go Deeper */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-foreground">
            Continue Your Research
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Section J */}
            <Card className="group hover:shadow-lg transition-all hover:border-primary/30">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Atom className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Section J: Physics R&D</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Explore all 12 physics claims with full sourcing and evidence ratings.
                </p>
                <Button asChild className="w-full min-h-[44px]">
                  <Link to="/section/j">
                    Explore Section <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Section C */}
            <Card className="group hover:shadow-lg transition-all hover:border-primary/30">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Section C: Physics-Defying Capabilities</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The Five Observables and sensor data from military encounters.
                </p>
                <Button asChild className="w-full min-h-[44px]">
                  <Link to="/section/c">
                    Explore Section <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* AI Assistant */}
            <Card className="group hover:shadow-lg transition-all hover:border-primary/30">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <ExternalLink className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">AI Research Assistant</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Query our physics source documents with NotebookLM.
                </p>
                <Button variant="outline" asChild className="w-full min-h-[44px]">
                  <a
                    href="https://notebooklm.google.com/notebook/66050f25-44cd-4b42-9de0-46ba9979aad7"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open NotebookLM <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PhysicsEducation;
