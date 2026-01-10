import { Link } from "react-router-dom";
import { useEffect } from "react";
import { 
  Zap, 
  Sparkles, 
  AlertTriangle, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Brain,
  Scale,
  Clock,
  Users,
  FileText,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Prerequisite data organized by category
const complexityBarriers = [
  {
    number: "1.1",
    title: "Fusion Physics & Exotic Propulsion",
    description: "Understanding claims requires familiarity with concepts like the Schwinger limit, vacuum polarization, metamaterial waveguides, and why the Pais patents matter (or don't).",
    linkTo: "/physics",
    linkText: "Physics Education"
  },
  {
    number: "1.2",
    title: "Financial Forensics",
    description: "Following the money means understanding FASAB Statement 56, IRAD funding mechanisms, $21+ trillion in 'undocumentable adjustments,' and how black budgets actually work.",
    linkTo: "/section/h",
    linkText: "Section H: Finance"
  },
  {
    number: "1.3",
    title: "Congressional Oversight Mechanisms",
    description: "Grasping the significance of testimony requires understanding Title 10 vs Title 50 jurisdiction, Gang of Eight briefings, waived SAPs, and why AARO's structure matters.",
    linkTo: "/section/f",
    linkText: "Section F: Oversight"
  },
  {
    number: "1.4",
    title: "Classification Law",
    description: "SF-312 forms, Atomic Energy Act carve-outs, NDA limitations on Congressional disclosure—the legal architecture of secrecy is complex and counterintuitive.",
    linkTo: "/how-secrecy-works",
    linkText: "How Secrecy Works"
  },
  {
    number: "1.5",
    title: "Sensor Systems & Data Analysis",
    description: "Evaluating military encounters means understanding radar modes, FLIR limitations, multi-sensor fusion, and why 'parallax error' doesn't explain the Nimitz case.",
    linkTo: "/section/b",
    linkText: "Section B: Sensor Data"
  },
  {
    number: "1.6",
    title: "Intelligence Community Structure",
    description: "Who reports to whom? Why does NRO vs NGA matter? What's the difference between a SAP and a CAP? The org chart is part of the story.",
    linkTo: "/institutional",
    linkText: "Institutional Analysis"
  },
  {
    number: "1.7",
    title: "Historical Pattern Recognition",
    description: "Cases from 1947 to 2024 show consistent patterns. Understanding why this matters requires knowing the history of Blue Book, the Robertson Panel, and the Condon Report.",
    linkTo: "/section/d",
    linkText: "Section D: History"
  },
];

const uncomfortableTerritory = [
  {
    number: "2.1",
    title: "Revisiting Fundamental Assumptions",
    description: "If the evidence is accurate, basic assumptions about physics, biology, and humanity's place in the universe require revision. Not everyone is ready for that.",
  },
  {
    number: "2.2",
    title: "Considering Non-Human Intelligence",
    description: "The hypothesis that some UAP represent non-human intelligence is taken seriously by credentialed officials. Engaging requires treating this as a possibility, not dismissing it a priori.",
  },
  {
    number: "2.3",
    title: "Consciousness-Related Phenomena",
    description: "High-strangeness reports include telepathy, remote viewing programs (Stargate), and the 'Hitchhiker Effect.' These are uncomfortable for materialists.",
    linkTo: "/section/i",
    linkText: "Section I: Consciousness"
  },
  {
    number: "2.4",
    title: "Trusting Institutional Skepticism",
    description: "If credentialed insiders are correct, major institutions have actively suppressed information for decades. This challenges trust in scientific and governmental authority.",
  },
  {
    number: "2.5",
    title: "Having No Final Answers",
    description: "This topic doesn't resolve into a neat conclusion. You'll end with probabilities, not certainties. If you need closure, you'll be frustrated.",
  },
  {
    number: "2.6",
    title: "Ontological Shock",
    description: "Psychologists describe 'ontological shock'—the destabilizing realization that reality is fundamentally different than believed. Some people aren't equipped for that.",
    linkTo: "/section/m",
    linkText: "Section M: Implications"
  },
];

const professionalRisks = [
  {
    number: "3.1",
    title: "Career Stigma",
    description: "Serious UAP research still carries professional risk in many fields. Scientists, journalists, and officials have faced ridicule for engaging publicly.",
  },
  {
    number: "3.2",
    title: "100+ Hours of Homework",
    description: "There's no shortcut. Developing informed opinions requires reading legislation, watching hours of testimony, and cross-referencing multiple sources.",
  },
  {
    number: "3.3",
    title: "Guilt by Association",
    description: "The UFO topic has 75 years of noise, hoaxes, and charlatans. Serious researchers get lumped in with the fringe. You'll need thick skin.",
  },
  {
    number: "3.4",
    title: "No Institutional Support",
    description: "Unlike other research areas, there's no established career path, limited funding, and few peer-reviewed venues. You're largely on your own.",
  },
  {
    number: "3.5",
    title: "Emotional Investment",
    description: "Once you see the pattern, it's hard to unsee. You may find yourself deeply invested in a topic most people dismiss. That's isolating.",
  },
];

const evidenceHighlights = [
  {
    title: "Congressional Testimony Under Oath",
    quote: "We are not alone... The U.S. government has UAP in its possession.",
    source: "David Grusch, Former NGA/NRO Officer, July 2023"
  },
  {
    title: "Multi-Sensor Military Encounters",
    quote: "Radar, FLIR, visual, and weapon systems all tracking the same object—for weeks.",
    source: "2004 Nimitz Carrier Strike Group"
  },
  {
    title: "Inspector General Finding",
    quote: "Grusch's complaint was found 'credible and urgent' by the Intelligence Community Inspector General.",
    source: "ICIG Determination, 2022"
  },
  {
    title: "Bipartisan Legislative Action",
    quote: "The Schumer-Rounds amendment explicitly references 'technologies of unknown origin' and 'non-human intelligence.'",
    source: "NDAA Amendment, 2023"
  },
];

// Reusable component for each prerequisite item
const PrerequisiteCard = ({ 
  number, 
  title, 
  description, 
  linkTo, 
  linkText 
}: { 
  number: string; 
  title: string; 
  description: string; 
  linkTo?: string; 
  linkText?: string;
}) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 hover:border-slate-600 transition-colors">
    <p className="text-slate-500 font-mono text-xs mb-1">{number}</p>
    <h4 className="text-white font-semibold mb-2">{title}</h4>
    <p className="text-slate-400 text-sm leading-relaxed mb-3">{description}</p>
    {linkTo && linkText && (
      <Link 
        to={linkTo} 
        className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
      >
        {linkText} <ArrowRight className="w-3 h-3" />
      </Link>
    )}
  </div>
);

// Reusable component for evidence summary
const EvidenceCard = ({ 
  title, 
  quote, 
  source 
}: { 
  title: string; 
  quote: string; 
  source: string;
}) => (
  <div className="bg-slate-800/70 border border-green-500/30 rounded-lg p-5">
    <h4 className="text-green-400 font-semibold mb-2">{title}</h4>
    <p className="text-slate-300 text-sm italic mb-2">"{quote}"</p>
    <p className="text-slate-500 text-xs">— {source}</p>
  </div>
);

export default function BeforeYouBegin() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Back Link */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Hero */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Before You Begin
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            Intellectual Prerequisites for Serious UAP Research
          </p>
          
          <div className="text-left bg-slate-900/50 border border-slate-800 rounded-xl p-8 space-y-4">
            <p className="text-slate-300 leading-relaxed">
              <span className="text-white font-semibold">Most people dismiss this topic within 30 seconds.</span>
            </p>
            <p className="text-slate-400 leading-relaxed">
              They've heard "UFOs" and already decided it's nonsense, hoaxes, or 
              entertainment for the credulous. That's a reasonable heuristic—it's 
              been correct for most of the last 75 years of noise.
            </p>
            <p className="text-slate-400 leading-relaxed">
              But you're here, which means you've noticed something has changed. 
              Congressional hearings. Pentagon programs. NASA involvement. Former 
              intelligence officials testifying under oath. The landscape shifted 
              around 2017, and especially after 2023.
            </p>
            <p className="text-slate-400 leading-relaxed">
              This page exists because serious engagement with this topic is 
              <span className="text-amber-400"> not for everyone</span>. Not because 
              it's secret or exclusive, but because it requires specific intellectual 
              commitments that most people aren't willing to make.
            </p>
          </div>
        </div>
      </section>

      {/* Category 1: Complexity Barriers */}
      <section className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start gap-4 mb-8">
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <Zap className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Complexity Barriers</h2>
              <p className="text-amber-400 text-sm mt-1">
                "Don't look if you're not willing to learn about..."
              </p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {complexityBarriers.map((item) => (
              <PrerequisiteCard key={item.number} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Category 2: Uncomfortable Territory */}
      <section className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start gap-4 mb-8">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Uncomfortable Territory</h2>
              <p className="text-purple-400 text-sm mt-1">
                "Don't look if you're uncomfortable with..."
              </p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {uncomfortableTerritory.map((item) => (
              <PrerequisiteCard key={item.number} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Category 3: Professional Risks */}
      <section className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start gap-4 mb-8">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Professional & Time Risks</h2>
              <p className="text-red-400 text-sm mt-1">
                "Don't look if you can't afford..."
              </p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {professionalRisks.map((item) => (
              <PrerequisiteCard key={item.number} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* The Pivot: Still Here? */}
      <section className="py-16 px-6 border-t border-green-500/30 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-green-400 mb-4">
              <Check className="w-6 h-6" />
              <span className="text-xl font-semibold">Still Here?</span>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">Good.</h2>
            
            <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
              If none of the above scared you off, you're probably the kind of person 
              this platform was built for. Here's why serious people engage anyway—the 
              HIGH-tier evidence that can't be easily dismissed:
            </p>
          </div>
          
          {/* HIGH-tier evidence summary cards */}
          <div className="grid gap-4 md:grid-cols-2 mb-12">
            {evidenceHighlights.map((item) => (
              <EvidenceCard key={item.title} {...item} />
            ))}
          </div>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="gap-2">
              <Link to="/quiz">
                <Sparkles className="w-5 h-5" />
                Take the Persona Quiz
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 border-slate-600 text-white hover:bg-slate-800">
              <Link to="/sections">
                <FileText className="w-5 h-5" />
                Explore the Evidence
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild className="gap-2">
              <Link to="/framework">
                <Scale className="w-5 h-5" />
                Start with Mosaic Theory
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
