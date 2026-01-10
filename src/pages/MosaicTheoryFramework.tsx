// Master Mosaic Theory Framework Page v2
// Updated with NotebookLM research - Jan 2026
// 6 Personas, 9 Filters, 6 Mosaic Categories

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { 
  Eye, Filter, Layers, ChevronDown, ChevronUp, ChevronsDown, ChevronsUp, ExternalLink, 
  AlertTriangle, Lock, Radio, Users, FileText, Building2, 
  Glasses, Check, Square, BookOpen, Search, Shield, Scale,
  TrendingUp, Microscope, History, Target, Brain, Globe,
  Banknote, GraduationCap, MessageCircle, Zap
} from 'lucide-react';
import { PageStatusBanner } from '@/components/PageStatusBanner';

// Image paths - Supabase Storage
const GHOST_ARMY_IMAGE = 'https://tlfnowncwmvcupghitak.supabase.co/storage/v1/object/public/images/ghost-army.jpg';
const GERMAN_RECON_IMAGE = 'https://tlfnowncwmvcupghitak.supabase.co/storage/v1/object/public/images/german-recon-fusag.jpg';
const MANHATTAN_IMAGE = 'https://tlfnowncwmvcupghitak.supabase.co/storage/v1/object/public/images/manhattan-project.jpg';

// ==========================================
// PART 1: THE CONCEPT
// ==========================================

// --- 1. HERO: FINANCIAL AUTHORITY ---
const FinancialFramework = () => {
  return (
    <section className="bg-slate-950 text-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Terminal Header */}
        <div className="bg-slate-900 rounded-t-lg border border-slate-700 px-4 py-2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-4 text-slate-400 text-xs font-mono">ANALYTICAL_FRAMEWORK.md</span>
        </div>
        
        {/* Content */}
        <div className="bg-slate-900/50 border-x border-b border-slate-700 rounded-b-lg p-8">
          <p className="text-amber-500 font-mono text-sm mb-2 tracking-widest">THE ANALYTICAL STANDARD</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Mosaic Theory</h1>
          <p className="text-slate-300 text-lg mb-8">
            Assembling non-material data into material conclusions.
          </p>
          
          {/* SEC Definition Box */}
          <div className="bg-slate-800 rounded-lg p-6 border-l-4 border-amber-500 mb-8">
            <p className="text-slate-400 text-sm mb-2">
              <span className="text-amber-500">SEC Regulation FD</span> | CFA Institute Standard
            </p>
            <p className="text-slate-200">
              "The practice of gathering disparate pieces of public, non-material information 
              which, when assembled together, may lead to material conclusions about a company's 
              prospects or an investment decision."
            </p>
          </div>
          
          {/* Optical Bench Diagram */}
          <div className="flex items-center justify-between gap-4 py-8 overflow-x-auto">
            <div className="flex-1 text-center min-w-[100px]">
              <div className="bg-green-500/20 rounded-lg p-4 mb-2 border border-green-500/30">
                <Eye className="w-8 h-8 mx-auto text-green-400" />
              </div>
              <p className="text-green-400 font-mono text-xs">GROUND TRUTH</p>
              <p className="text-slate-500 text-xs">What exists</p>
            </div>
            
            <ChevronDown className="w-6 h-6 text-slate-600 rotate-[-90deg] flex-shrink-0" />
            
            <div className="flex-1 text-center min-w-[100px]">
              <div className="bg-red-500/20 rounded-lg p-4 mb-2 border border-red-500/30">
                <Filter className="w-8 h-8 mx-auto text-red-400" />
              </div>
              <p className="text-red-400 font-mono text-xs">THE FILTER</p>
              <p className="text-slate-500 text-xs">What gets through</p>
            </div>
            
            <ChevronDown className="w-6 h-6 text-slate-600 rotate-[-90deg] flex-shrink-0" />
            
            <div className="flex-1 text-center min-w-[100px]">
              <div className="bg-amber-500/20 rounded-lg p-4 mb-2 border border-amber-500/30">
                <Layers className="w-8 h-8 mx-auto text-amber-400" />
              </div>
              <p className="text-amber-400 font-mono text-xs">THE MOSAIC</p>
              <p className="text-slate-500 text-xs">What we see</p>
            </div>
            
            <ChevronDown className="w-6 h-6 text-slate-600 rotate-[-90deg] flex-shrink-0" />
            
            <div className="flex-1 text-center min-w-[100px]">
              <div className="bg-blue-500/20 rounded-lg p-4 mb-2 border border-blue-500/30">
                <Glasses className="w-8 h-8 mx-auto text-blue-400" />
              </div>
              <p className="text-blue-400 font-mono text-xs">OBSERVER LENS</p>
              <p className="text-slate-500 text-xs">What we conclude</p>
            </div>
          </div>
          
          <p className="text-slate-400 text-center text-sm mt-4">
            Before applying this to UAP, let's prove it works with verified historical cases.
          </p>
        </div>
      </div>
    </section>
  );
};

// --- 2. OPERATION FORTITUDE (Scroll-Triggered) ---
const GhostArmySection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const [activeStage, setActiveStage] = useState(0);
  
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      if (v < 0.25) setActiveStage(0);
      else if (v < 0.45) setActiveStage(1);
      else if (v < 0.65) setActiveStage(2);
      else setActiveStage(3);
    });
  }, [scrollYProgress]);
  
  const stages = [
    { 
      title: "GROUND TRUTH", 
      subtitle: "Full Context Available",
      description: "Four American soldiers easily carry a 'tank.' The 93-lb rubber decoy is part of the 23rd Headquarters Special Troops—the Ghost Army.",
      image: GHOST_ARMY_IMAGE,
      filter: "none", 
      transform: "scale(1)", 
      showRedaction: false, 
      showHUD: false 
    },
    { 
      title: "THE FILTER", 
      subtitle: "Classification Applied",
      description: "The image is marked classified. A redaction bar obscures the soldiers. Grain and age effects suggest archival reconnaissance footage.",
      image: GHOST_ARMY_IMAGE,
      filter: "grayscale(100%) contrast(120%) sepia(20%)", 
      transform: "scale(1)", 
      showRedaction: true, 
      showHUD: false 
    },
    { 
      title: "THE MOSAIC", 
      subtitle: "Context Lost",
      description: "Cropped to just the tank. Without the soldiers for scale, this appears to be genuine heavy armor—exactly what the deception intended.",
      image: GHOST_ARMY_IMAGE,
      filter: "grayscale(100%) contrast(150%) brightness(90%)", 
      transform: "scale(2.5) translate(-10%, -25%)", 
      showRedaction: false, 
      showHUD: false 
    },
    { 
      title: "OBSERVER LENS", 
      subtitle: "False Conclusion",
      description: "German aerial reconnaissance confirms: FUSAG staging area with armored divisions at Calais. The assessment is methodologically sound—built entirely on controlled information.",
      image: GERMAN_RECON_IMAGE,
      filter: "grayscale(100%) contrast(110%)", 
      transform: "scale(1)", 
      showRedaction: false, 
      showHUD: true 
    },
  ];
  
  const currentStage = stages[activeStage];
  
  return (
    <section ref={containerRef} className="min-h-[200vh] bg-stone-100 relative">
      <div className="sticky top-0 min-h-screen py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-stone-500 text-xs font-mono tracking-widest mb-2">HISTORICAL PRECEDENT #1</p>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-1">Operation Fortitude</h2>
            <p className="text-stone-600 text-sm">The Ghost Army, 1944</p>
          </div>
          
          {/* Context Introduction */}
          <div className="bg-stone-200/70 border border-stone-300 rounded-lg p-4 mb-6 max-w-3xl mx-auto">
            <p className="text-stone-600 text-sm italic leading-relaxed">
              In 1944, the Allies created a fictitious "First United States Army Group" (FUSAG) to convince Hitler that the D-Day invasion would target Calais, not Normandy. The 23rd Headquarters Special Troops—the "Ghost Army"—deployed inflatable tanks, fake radio traffic, and sound trucks to simulate an entire armored division. German intelligence took the bait.
            </p>
          </div>
          
          <div className="flex justify-center gap-2 mb-4 flex-wrap">
            {stages.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStage(idx)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-all ${
                  activeStage === idx 
                    ? 'bg-stone-800 text-white' 
                    : 'bg-stone-200 text-stone-500 hover:bg-stone-300'
                }`}
              >
                {idx + 1}. {s.title}
              </button>
            ))}
          </div>
          
          <div className="bg-amber-50 rounded-lg shadow-xl overflow-hidden border border-amber-200">
            <div className="bg-amber-100 px-4 py-2 flex justify-between items-center">
              <span className="font-mono text-xs text-amber-800">FILE: FUSAG_RECON_044</span>
              <span className={`px-2 py-0.5 text-xs font-mono rounded ${
                activeStage === 0 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}>
                {activeStage === 0 ? 'DECLASSIFIED' : 'TOP SECRET'}
              </span>
            </div>
            
            <div className="relative aspect-video bg-stone-200 overflow-hidden">
              <img
                src={currentStage.image}
                alt="Ghost Army operation"
                className="w-full h-full object-cover transition-all duration-700"
                style={{
                  filter: currentStage.filter,
                  transform: currentStage.transform,
                  transformOrigin: 'center 40%'
                }}
              />
              
              {currentStage.showRedaction && (
                <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-black"></div>
              )}
              
              {currentStage.showHUD && (
                <div className="absolute inset-0 bg-green-900/40 border-4 border-green-500/60">
                  <div className="absolute top-3 left-3 text-green-400 font-mono text-xs space-y-1">
                    <p className="font-bold">LUFTWAFFE AUFKLÄRUNG</p>
                    <p>SECTOR: PAS-DE-CALAIS</p>
                    <p>DATE: 1944.06.02</p>
                  </div>
                  <div className="absolute top-3 right-3 text-green-400 font-mono text-xs text-right space-y-1">
                    <p>ENEMY: FUSAG</p>
                    <p>TANKS: 40+ CONFIRMED</p>
                    <p>THREAT: MAXIMUM</p>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 bg-green-900/90 p-3 rounded border border-green-500/50">
                    <p className="text-green-300 font-mono text-xs mb-1">INTELLIGENCE ASSESSMENT</p>
                    <p className="text-green-400 font-mono text-sm font-bold">
                      FUSAG INVASION FORCE CONFIRMED — RECOMMEND RESERVE PANZERS FOR CALAIS DEFENSE
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-amber-50 border-t border-amber-200">
              <span className={`inline-block px-2 py-0.5 text-xs font-mono rounded mb-2 ${
                activeStage === 0 ? 'bg-green-100 text-green-700' :
                activeStage === 1 ? 'bg-red-100 text-red-700' :
                activeStage === 2 ? 'bg-amber-100 text-amber-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {currentStage.subtitle}
              </span>
              <p className="text-stone-700 text-sm leading-relaxed">{currentStage.description}</p>
            </div>
          </div>
          
          {/* Immersion Scenario */}
          <div className="mt-8 bg-slate-900 rounded-lg p-6 text-white">
            <div className="flex items-start gap-3">
              <Radio className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-amber-500 font-semibold mb-2">Immersion Scenario: German Intelligence Officer, June 1944</p>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">
                  You're analyzing Allied troop positions. Your reconnaissance photos show armored divisions. 
                  Radio intercepts confirm heavy traffic from "FUSAG" headquarters. 
                  General Patton—their best commander—is in charge.
                </p>
                <p className="text-slate-400 text-sm italic">
                  You're doing excellent analysis. Your methodology is sound. 
                  <span className="text-amber-400"> But you never questioned what information you weren't receiving.</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-semibold text-sm">The Outcome</p>
                <p className="text-red-700 text-sm">
                  German High Command held reserves at Calais for <strong>seven weeks</strong> after D-Day, 
                  convinced Normandy was a feint.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- 3. MANHATTAN PROJECT (Scroll-Triggered) ---
const ManhattanProjectSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const [activeStage, setActiveStage] = useState(0);
  
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      if (v < 0.3) setActiveStage(0);
      else if (v < 0.55) setActiveStage(1);
      else setActiveStage(2);
    });
  }, [scrollYProgress]);
  
  const stages = [
    { 
      title: "GROUND TRUTH", 
      subtitle: "Unfiltered Reality",
      description: "Workers pose with 'The Gadget'—the first atomic bomb, July 1945. The Manhattan Project employed 125,000 people across 30+ sites.",
      filter: "none", 
      blur: 0, 
      showStamp: false, 
      showHUD: false 
    },
    { 
      title: "THE FILTER", 
      subtitle: "Atomic Energy Act Classification",
      description: "Under the 1946 Atomic Energy Act, all nuclear weapons information is 'born classified.' The DOE—not DoD—controls access. Even the Vice President was excluded.",
      filter: "grayscale(100%) contrast(80%)", 
      blur: 8, 
      showStamp: true, 
      showHUD: false 
    },
    { 
      title: "THE MOSAIC", 
      subtitle: "What Analysts Actually Saw",
      description: "To outside observers: a large industrial facility, possibly a boiler or chemical processing unit. No military significance detected.",
      filter: "grayscale(100%) contrast(200%) brightness(70%)", 
      blur: 15, 
      showStamp: false, 
      showHUD: true 
    },
  ];
  
  const currentStage = stages[activeStage];
  
  return (
    <section ref={containerRef} className="min-h-[180vh] bg-slate-900 relative">
      <div className="sticky top-0 min-h-screen py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-slate-500 text-xs font-mono tracking-widest mb-2">HISTORICAL PRECEDENT #2</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">The Manhattan Project</h2>
            <p className="text-slate-400 text-sm">Oak Ridge, Los Alamos, Hanford — 1942-1945</p>
          </div>
          
          {/* Context Introduction */}
          <div className="bg-slate-800/70 border border-slate-600 rounded-lg p-4 mb-6 max-w-3xl mx-auto">
            <p className="text-slate-400 text-sm italic leading-relaxed">
              The Manhattan Project employed 125,000 workers across 30+ sites to build the atomic bomb. Compartmentalization was so extreme that Vice President Truman didn't learn of its existence until after FDR's death. This demonstrates that large-scale secrecy is not only possible—it has historical precedent.
            </p>
          </div>
          
          <div className="flex justify-center gap-2 mb-4 flex-wrap">
            {stages.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStage(idx)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-all ${
                  activeStage === idx 
                    ? 'bg-amber-500 text-slate-900' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {idx + 1}. {s.title}
              </button>
            ))}
          </div>
          
          <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700">
            <div className="bg-slate-700 px-4 py-2 flex justify-between items-center">
              <span className="font-mono text-xs text-slate-300">FILE: DOE_ARCHIVE_1945</span>
              <span className={`px-2 py-0.5 text-xs font-mono rounded ${
                activeStage === 0 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}>
                {activeStage === 0 ? 'DECLASSIFIED 1996' : 'RESTRICTED DATA'}
              </span>
            </div>
            
            <div className="relative aspect-video bg-slate-900 overflow-hidden">
              <img
                src={MANHATTAN_IMAGE}
                alt="The Gadget - first atomic bomb"
                className="w-full h-full object-cover transition-all duration-700"
                style={{
                  filter: activeStage === 0 ? 'none' : `${currentStage.filter} blur(${currentStage.blur}px)`,
                }}
              />
              
              {currentStage.showStamp && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-4 border-red-600 px-8 py-4 bg-black/70 rotate-[-10deg]">
                    <p className="text-red-500 font-bold text-xl tracking-widest">RESTRICTED DATA</p>
                    <p className="text-red-400 text-xs text-center mt-1">ATOMIC ENERGY ACT 1946</p>
                  </div>
                </div>
              )}
              
              {currentStage.showHUD && (
                <div className="absolute bottom-4 left-4 right-4 bg-amber-900/90 border-2 border-amber-500 p-4 rounded">
                  <p className="text-amber-300 font-mono text-xs mb-1">INDUSTRIAL SURVEY ASSESSMENT</p>
                  <p className="text-amber-100 font-mono text-sm">
                    "Large cylindrical structure. No military significance detected."
                  </p>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-slate-800 border-t border-slate-700">
              <span className={`inline-block px-2 py-0.5 text-xs font-mono rounded mb-2 ${
                activeStage === 0 ? 'bg-green-900/50 text-green-400' :
                activeStage === 1 ? 'bg-red-900/50 text-red-400' :
                'bg-amber-900/50 text-amber-400'
              }`}>
                {currentStage.subtitle}
              </span>
              <p className="text-slate-300 text-sm leading-relaxed">{currentStage.description}</p>
            </div>
          </div>
          
          {/* Immersion Scenario */}
          <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-amber-500 font-semibold mb-2">Immersion Scenario: VP Harry Truman, April 1945</p>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">
                  You're the Vice President of the United States. You've served 82 days. 
                  FDR dies. You become President. Only then are you briefed on Los Alamos.
                </p>
                <p className="text-slate-400 text-sm italic">
                  If 125,000 workers could keep the atomic bomb secret from the Vice President, 
                  <span className="text-amber-400"> what else might be compartmentalized?</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- TRANSITION SECTION ---
const TransitionSection = () => (
  <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-zinc-100 py-24 px-6 text-center">
    <div className="max-w-2xl mx-auto">
      <p className="text-slate-400 font-mono text-sm mb-4 tracking-widest">NOW CONSIDER...</p>
      <h2 className="text-2xl md:text-3xl text-white mb-6 leading-relaxed">
        What if similar information control existed for 
        <span className="text-amber-500"> 80 years </span>
        around a different topic?
      </h2>
      <p className="text-slate-300 mb-8">
        You've seen how filters work. Now apply this framework to UAP.
      </p>
    </div>
  </section>
);

// ==========================================
// PART 2: THE APPLICATION
// ==========================================

interface FilterMechanism {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  summary: string;
  details: string[];
}

// --- 4. UAP FILTER MECHANISMS (9 Cards) ---
const UAPFilterSection = () => {
  const [openCards, setOpenCards] = useState<Set<string>>(new Set());
  
  const toggleCard = (id: string) => {
    const newOpenCards = new Set(openCards);
    if (newOpenCards.has(id)) {
      newOpenCards.delete(id);
    } else {
      newOpenCards.add(id);
    }
    setOpenCards(newOpenCards);
  };
  
  const filterMechanisms: FilterMechanism[] = [
    {
      id: 'robertson',
      title: 'Robertson Panel (1953)',
      badge: 'HIGH',
      badgeColor: 'bg-blue-100 text-blue-700',
      icon: Lock,
      summary: 'CIA recommended systematic "debunking" to reduce public interest',
      details: [
        'Use mass media, Disney, celebrities to ridicule UFOs',
        'Monitor civilian groups for "subversive purposes"',
        'Led to AFR 200-2 and JANAP 146 penalties',
        'Declassified 1975—culture of ridicule already established'
      ]
    },
    {
      id: 'janap',
      title: 'JANAP 146 (1954)',
      badge: 'HIGH',
      badgeColor: 'bg-blue-100 text-blue-700',
      icon: AlertTriangle,
      summary: 'Made unauthorized UAP disclosure a criminal offense (up to 10 years prison)',
      details: [
        'Applied to military AND commercial pilots',
        'Potential Espionage Act violations',
        '$10,000 fine or imprisonment',
        'Created chilling effect on pilot reporting'
      ]
    },
    {
      id: 'bluebook',
      title: 'Project Blue Book (1952-1969)',
      badge: 'HIGH',
      badgeColor: 'bg-blue-100 text-blue-700',
      icon: FileText,
      summary: 'Public relations front—real cases went through classified channels',
      details: [
        'Bolender Memo: "Reports affecting national security" handled separately',
        'Goal: "Reduce percentage of unidentifieds to minimum"',
        'Swamp gas, balloons, stars used as catch-all explanations',
        'Proved to be PR, not investigation'
      ]
    },
    {
      id: 'condon',
      title: 'Condon Report (1969)',
      badge: 'HIGH',
      badgeColor: 'bg-blue-100 text-blue-700',
      icon: GraduationCap,
      summary: 'Recommended teachers "refrain from giving students credit" for UFO work',
      details: [
        '"Trick Memo" revealed predetermined negative conclusion',
        'Created 50+ years of academic stigma',
        'Ended federal research funding',
        'Self-fulfilling: "not scientific" → no study → no data'
      ]
    },
    {
      id: 'stigma',
      title: 'The "Giggle Factor" (1953-Present)',
      badge: 'HIGH',
      badgeColor: 'bg-blue-100 text-blue-700',
      icon: MessageCircle,
      summary: 'Engineered cultural stigma causing scientists and pilots to self-censor',
      details: [
        'Conflates UAP interest with mental instability',
        'Ryan Graves: Pilots fear career consequences',
        'Garry Nolan: Scientists avoid topic for tenure',
        'NASA acknowledges stigma as data barrier'
      ]
    },
    {
      id: 'legal',
      title: 'Legal Barriers (Perceived vs. Real)',
      badge: 'HIGH',
      badgeColor: 'bg-blue-100 text-blue-700',
      icon: Scale,
      summary: '"No person has ever been prosecuted for disclosing to Congress in private" — Guthrie',
      details: [
        'SF-312 NDAs explicitly preserve Congressional rights',
        'Classification not binding on Congress (50 USC 3161)',
        'Constitutional immunity exists (Gravel v. United States)',
        'Fear persists despite legal protections'
      ]
    },
    {
      id: 'wsap',
      title: 'Waived SAPs & Title 50',
      badge: 'HIGH',
      badgeColor: 'bg-blue-100 text-blue-700',
      icon: Shield,
      summary: 'Programs exist in legal "black hole" with no external oversight',
      details: [
        'Gang of Eight reporting requirements waived',
        'Atomic Energy Act moves tech under DOE, not DoD',
        'Grusch: Crash retrievals hidden here',
        '"Born classified" data never needs declassification'
      ]
    },
    {
      id: 'fiscal',
      title: 'FASAB 56 & IRAD Abuse',
      badge: 'MEDIUM',
      badgeColor: 'bg-amber-100 text-amber-700',
      icon: Banknote,
      summary: 'Allows agencies to "misrepresent" financials; contractors hide costs in overhead',
      details: [
        'FASAB 56: Legal to modify statements for "national security"',
        '$21+ trillion in unsupported adjustments documented',
        'IRAD launders funding without Congressional line items',
        'Programs effectively unauditable'
      ]
    },
    {
      id: 'privatization',
      title: 'Corporate Custody Shield',
      badge: 'MEDIUM',
      badgeColor: 'bg-amber-100 text-amber-700',
      icon: Building2,
      summary: 'Materials moved to contractors—not subject to FOIA, claimed as "proprietary"',
      details: [
        'Schumer Amendment included eminent domain language',
        '"Bigot Lists" control access even from cleared officials',
        'Admiral Wilson denied access by contractor',
        'Government can truthfully say "no records found"'
      ]
    }
  ];
  
  const expandAll = () => {
    setOpenCards(new Set(filterMechanisms.map(m => m.id)));
  };
  
  const collapseAll = () => {
    setOpenCards(new Set());
  };
  
  return (
    <section className="bg-zinc-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <p className="text-zinc-500 text-xs font-mono tracking-widest mb-2">APPLYING THE FRAMEWORK</p>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900">The UAP Filter: Documented Mechanisms</h2>
            <p className="text-zinc-600 mt-1">9 verified mechanisms that shape what information reaches the public.</p>
          </div>
          <button
            onClick={openCards.size === filterMechanisms.length ? collapseAll : expandAll}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            {openCards.size === filterMechanisms.length ? (
              <>
                <ChevronsUp className="w-4 h-4" />
                COLLAPSE ALL
              </>
            ) : (
              <>
                <ChevronsDown className="w-4 h-4" />
                EXPAND ALL
              </>
            )}
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filterMechanisms.map((mechanism) => {
            const Icon = mechanism.icon;
            const isOpen = openCards.has(mechanism.id);
            
            return (
              <div 
                key={mechanism.id}
                className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleCard(mechanism.id)}
                  className="w-full p-4 text-left hover:bg-zinc-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-zinc-100 rounded-lg p-2 flex-shrink-0">
                      <Icon className="w-5 h-5 text-zinc-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-zinc-900 text-sm">{mechanism.title}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded ${mechanism.badgeColor}`}>
                          {mechanism.badge}
                        </span>
                      </div>
                      <p className="text-zinc-600 text-sm">{mechanism.summary}</p>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                
                {isOpen && (
                  <div className="px-4 pb-4 border-t border-zinc-100 bg-zinc-50">
                    <ul className="mt-3 space-y-2">
                      {mechanism.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-zinc-700">
                          <span className="text-indigo-500 mt-1">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

interface MosaicClaim {
  text: string;
  source: string;
}

interface MosaicCategory {
  id: string;
  title: string;
  tier: string;
  leadClaim: string;
  claims: MosaicClaim[];
}

// --- 5. UAP MOSAIC CATEGORIES (6 Categories) ---
const UAPMosaicSection = () => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  
  const categories: MosaicCategory[] = [
    {
      id: 'physical',
      title: 'Physical Reality & Capabilities',
      tier: 'HIGH',
      leadClaim: 'UAP are real physical objects exhibiting sensor-verified "Five Observables"',
      claims: [
        { text: 'Multi-sensor confirmation (radar + IR + visual) on 143+ cases', source: 'ODNI 2021' },
        { text: 'Instantaneous acceleration exceeding 100g (Nimitz Tic Tac)', source: 'Fravor testimony' },
        { text: 'Transmedium travel without hydrodynamic disruption', source: 'USS Omaha footage' },
        { text: 'Objects lack visible propulsion, wings, or control surfaces', source: 'Multiple pilot accounts' }
      ]
    },
    {
      id: 'government',
      title: 'Government Knowledge & Programs',
      tier: 'HIGH',
      leadClaim: 'A "Legacy Program" for crash retrieval exists, hidden via IRAD and Title 50',
      claims: [
        { text: 'ICIG deemed Grusch complaint "credible and urgent"', source: 'ICIG finding 2023' },
        { text: '"Immaculate Constellation" consolidates UAP imagery using AI', source: 'Brown report 2024' },
        { text: '"Kona Blue" may be active despite AARO denial', source: 'Lacatski 2025' },
        { text: 'Programs nested in Waived SAPs, evading Gang of Eight', source: 'Grusch testimony' }
      ]
    },
    {
      id: 'retrieval',
      title: 'Retrieval & Possession',
      tier: 'MEDIUM',
      leadClaim: 'U.S. possesses craft with "no intakes, exhaust, wings, or fuel tanks"',
      claims: [
        { text: 'Craft interior accessed per DOPSR-cleared publication', source: 'Lacatski book' },
        { text: '1933 Magenta, Italy recovery transferred to US 1944-45', source: 'Grusch testimony' },
        { text: 'Metamaterials (Bi/Mg layers) with anomalous isotopic ratios', source: 'Nolan analysis' },
        { text: '"Over 10" craft in custody per insider claims', source: 'Puthoff 2025' }
      ]
    },
    {
      id: 'biologics',
      title: 'Non-Human Biologics & Intelligence',
      tier: 'MEDIUM',
      leadClaim: '"Non-human biologics" recovered alongside crashed craft',
      claims: [
        { text: 'Bodies/pilots recovered per sworn Congressional testimony', source: 'Grusch 2023' },
        { text: 'Telepathic communication reported by neurosurgeon (Varginha)', source: 'Venturelli testimony' },
        { text: 'Brain anomalies (caudate-putamen) in experiencers', source: 'Nolan research' },
        { text: '"Non-human intelligence exists" per Army Task Force lead', source: 'Karl Nell' }
      ]
    },
    {
      id: 'physics',
      title: 'Physics & Technology',
      tier: 'MEDIUM',
      leadClaim: 'Sensor data confirms Mach 30+ movement with no sonic boom',
      claims: [
        { text: 'Pais Effect: Inertial mass reduction via vacuum polarization', source: 'Navy patents' },
        { text: 'Metamaterials as terahertz waveguides for propulsion', source: 'Puthoff/Nolan' },
        { text: 'Low Power Warp via Fröhlich condensates (theoretical)', source: 'Sarfatti papers' },
        { text: 'Nuclear correlation: UAP activity at weapons facilities', source: 'Salas testimony' }
      ]
    },
    {
      id: 'geopolitical',
      title: 'Geopolitical Arms Race',
      tier: 'MEDIUM',
      leadClaim: 'US, China, and Russia racing to reverse-engineer UAP technology',
      claims: [
        { text: 'US "absolutely" racing adversaries on reverse engineering', source: 'Lacatski 2025' },
        { text: 'Disclosure framed as strategic necessity vs. China', source: 'Burchett/Luna' },
        { text: 'Game theory equilibrium at mutual non-disclosure', source: 'Guthrie analysis' },
        { text: 'Aerospace lobby killed Schumer disclosure provisions', source: 'Legislative record' }
      ]
    }
  ];
  
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-zinc-500 text-xs font-mono tracking-widest mb-2">THE AVAILABLE PIECES</p>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900">The UAP Mosaic</h2>
          <p className="text-zinc-600 mt-2">When you lay all fragments on the table, what picture emerges?</p>
        </div>
        
        <div className="space-y-3">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="border border-zinc-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenCategory(openCategory === category.id ? null : category.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className={`px-2 py-1 text-xs font-mono rounded ${
                      category.tier === 'HIGH' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {category.tier}
                    </span>
                    <h3 className="font-semibold text-zinc-900">{category.title}</h3>
                  </div>
                  <p className="text-zinc-600 text-sm">{category.leadClaim}</p>
                </div>
                <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform flex-shrink-0 ml-4 ${
                  openCategory === category.id ? 'rotate-180' : ''
                }`} />
              </button>
              
              {openCategory === category.id && (
                <div className="px-4 pb-4 border-t border-zinc-100 bg-zinc-50">
                  <ul className="mt-3 space-y-3">
                    {category.claims.map((claim, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-zinc-700">{claim.text}</span>
                          <span className="text-zinc-400 ml-1">— {claim.source}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- 6. OBSERVER ASSUMPTIONS AUDIT ---
const AssumptionsAuditSection = () => {
  const [checkedAssumptions, setCheckedAssumptions] = useState<Set<string>>(new Set());
  
  const toggleAssumption = (id: string) => {
    const newChecked = new Set(checkedAssumptions);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedAssumptions(newChecked);
  };
  
  const assumptions = [
    {
      id: 'sensors',
      assumption: '"It\'s just sensor glitches or optical illusions"',
      counter: 'The ODNI found multi-sensor corroboration (radar + IR + visual) occurring simultaneously. Cmdr. Fravor observed the Tic Tac with human eyes while radar confirmed it. Parallax doesn\'t explain active engagement/mirroring behaviors.'
    },
    {
      id: 'know',
      assumption: '"If it were real, we\'d know by now"',
      counter: 'VP Truman learned about the atomic bomb after 82 days in office. The Manhattan Project employed 125,000 people successfully compartmentalized. The ICIG found Grusch\'s complaint "credible and urgent" based on classified evidence.'
    },
    {
      id: 'leak',
      assumption: '"Someone would have leaked it"',
      counter: 'People have. Grusch testified under oath. Lacatski\'s book passed DOPSR review. The assumption is that leaks would be believed—the Robertson Panel\'s "giggle factor" ensures they aren\'t.'
    },
    {
      id: 'congress',
      assumption: '"Congress would know"',
      counter: 'Congress didn\'t know about warrantless wiretapping for years. The Iran-Contra affair. The torture program. The Bolender Memo proved Blue Book was PR while real cases went through classified channels Congress never saw.'
    },
    {
      id: 'circular',
      assumption: '"It\'s just circular reporting by true believers"',
      counter: 'The ICIG independently evaluated Grusch\'s complaint using classified evidence, not rumors. Senior Senators (Schumer/Rounds) wrote legislation based on "credible evidence." Multiple sources with different access points converge on the same claims.'
    },
    {
      id: 'physics',
      assumption: '"It violates known physics"',
      counter: 'Known physics ≠ all physics. We discovered gravitational waves in 2015. Dark matter/energy are 95% of the universe. Anna Brady-Estevez notes the government has classified entire areas of math and physics from academia.'
    },
    {
      id: 'corporations',
      assumption: '"Public companies couldn\'t hide world-changing tech"',
      counter: 'The IRAD (Independent R&D) loophole allows costs to be buried in overhead. Materials may be too dangerous or legally compromising to monetize. The "Bigot List" system blocked even Admiral Wilson from accessing programs at Lockheed.'
    },
    {
      id: 'audit',
      assumption: '"We\'d see it in budget audits"',
      counter: 'FASAB Statement 56 legally permits agencies to "modify" financial statements for national security. $21+ trillion in unsupported adjustments have been documented. DoD has never passed a clean audit.'
    }
  ];
  
  return (
    <section className="bg-slate-900 py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-slate-500 text-xs font-mono tracking-widest mb-2">SELF-CHECK</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Observer Assumptions Audit</h2>
          <p className="text-slate-400 mt-2">
            Click each assumption to examine the counter-evidence. How many did you hold?
          </p>
        </div>
        
        <div className="space-y-3">
          {assumptions.map((item) => {
            const isChecked = checkedAssumptions.has(item.id);
            
            return (
              <button
                key={item.id}
                onClick={() => toggleAssumption(item.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  isChecked 
                    ? 'bg-amber-500/10 border-amber-500/50' 
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors mt-0.5 ${
                    isChecked ? 'bg-amber-500 border-amber-500' : 'border-slate-500'
                  }`}>
                    {isChecked && <Check className="w-3 h-3 text-slate-900" />}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isChecked ? 'text-amber-400' : 'text-slate-200'}`}>
                      {item.assumption}
                    </p>
                    {isChecked && (
                      <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                        {item.counter}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        {checkedAssumptions.size > 0 && (
          <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
            <p className="text-amber-400 text-sm">
              You've examined {checkedAssumptions.size} of {assumptions.length} common assumptions.
              Each has documented counter-evidence—not proof of UAP, but evidence the assumptions aren't self-evident.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

// --- 7. PERSONA FOOTER (6 Personas) ---
const PersonaFooter = () => {
  const personas = [
    { 
      id: 'empiricist', 
      name: 'Empiricist', 
      icon: Microscope, 
      color: 'bg-blue-600', 
      sections: 'A, B, C, F',
      description: 'Sensor data and multi-source confirmation first'
    },
    { 
      id: 'historian', 
      name: 'Historian', 
      icon: History, 
      color: 'bg-purple-600', 
      sections: 'D, E, F, H',
      description: 'Patterns across decades and policy evolution'
    },
    { 
      id: 'strategist', 
      name: 'Strategist', 
      icon: Target, 
      color: 'bg-green-600', 
      sections: 'F, H, L, E',
      description: 'National security and institutional behavior'
    },
    { 
      id: 'investigator', 
      name: 'Investigator', 
      icon: Search, 
      color: 'bg-amber-600', 
      sections: 'B, G, K, F',
      description: 'Case forensics and witness credibility'
    },
    { 
      id: 'skeptic', 
      name: 'Skeptic', 
      icon: Scale, 
      color: 'bg-red-600', 
      sections: 'A, B, D, C',
      description: 'Falsification and prosaic explanations first'
    },
    { 
      id: 'technologist', 
      name: 'Technologist', 
      icon: Zap, 
      color: 'bg-cyan-600', 
      sections: 'C, J, L, G',
      description: 'Physics, propulsion, and materials science'
    }
  ];
  
  return (
    <section className="bg-slate-950 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-slate-500 text-xs font-mono tracking-widest mb-2">CHOOSE YOUR LENS</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Begin Your Investigation</h2>
          <p className="text-slate-400 mt-2">Select an approach that matches how you evaluate evidence.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {personas.map((persona) => {
            const Icon = persona.icon;
            return (
              <Link
                key={persona.id}
                to={`/sections?persona=${persona.id}`}
                className={`${persona.color} hover:opacity-90 rounded-lg p-4 text-white transition-all hover:scale-[1.02]`}
              >
                <Icon className="w-8 h-8 mb-2" />
                <h3 className="font-bold text-lg">{persona.name}</h3>
                <p className="text-white/80 text-sm mb-2">{persona.description}</p>
                <p className="text-white/60 text-xs font-mono">Sections: {persona.sections}</p>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-8 text-center">
          <Link
            to="/quiz"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Not Sure? Take the Persona Quiz
          </Link>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export default function MosaicTheoryFramework() {
  return (
    <div className="min-h-screen">
      {/* Page Status Banner */}
      <div className="px-6 pt-6">
        <div className="max-w-4xl mx-auto">
          <PageStatusBanner
            lastUpdated="January 10, 2026"
            status="under-construction"
            statusNote="Restructuring Ground Truth → Filter → Mosaic flow"
          />
        </div>
      </div>
      
      {/* PART 1: THE CONCEPT */}
      <FinancialFramework />
      <GhostArmySection />
      <ManhattanProjectSection />
      <TransitionSection />
      
      {/* PART 2: THE APPLICATION */}
      <UAPFilterSection />
      <UAPMosaicSection />
      <AssumptionsAuditSection />
      <PersonaFooter />
    </div>
  );
}
