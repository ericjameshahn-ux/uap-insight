import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Layers, Clock, Globe, Monitor, Brain, 
  CircleDot, GitMerge, ChevronDown, AlertTriangle, ExternalLink
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Proponent {
  name: string;
  credential: string;
  bio: string;
  videoUrl: string | null;
}

interface Hypothesis {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  summary: string;
  coreConcept: string;
  proponent: Proponent;
  evidence: string;
  weakness: string;
}

const hypotheses: Hypothesis[] = [
  {
    id: 'eth',
    name: 'Extraterrestrial (ETH)',
    icon: Rocket,
    color: 'bg-blue-600',
    summary: 'Physical craft from other star systems',
    coreConcept: 'The "nuts and bolts" theory that UAP are spacecraft piloted by biological beings or automated probes from other star systems.',
    proponent: {
      name: 'Col. Karl Nell (Ret.)',
      credential: 'Former Army UAP Task Force Lead',
      bio: 'Career Army intelligence officer who served on the UAP Task Force. Stated there is "zero doubt" non-human intelligence has interacted with humanity at the 2024 SOL Foundation conference.',
      videoUrl: 'https://www.youtube.com/watch?v=aa9Xx5wI8Rw'
    },
    evidence: 'The 2004 Nimitz "Tic Tac" incident: multi-sensor data (radar, FLIR, visual) confirming physical objects with instant acceleration exceeding human technology. Whistleblower David Grusch testified to recovery of "intact vehicles" and "non-human biologics."',
    weakness: 'Interstellar travel is energetically prohibitive. If they are here, why no formal contact? (Fermi Paradox)'
  },
  {
    id: 'idh',
    name: 'Interdimensional (IDH)',
    icon: Layers,
    color: 'bg-purple-600',
    summary: 'Incursions from parallel dimensions or higher spatial dimensions',
    coreConcept: 'UAP utilize "metric engineering" to manipulate spacetime or project into our 3D reality from higher dimensions (4D/5D). Explains craft "popping" in and out of existence.',
    proponent: {
      name: 'Jacques Vallée, PhD',
      credential: 'Astrophysicist, Computer Scientist, Venture Capitalist',
      bio: 'Former astronomer who worked on early ARPANET. Argues UAP are a "control system" that has manifested throughout history as angels, fairies, and now technological craft. Author of "Passport to Magonia."',
      videoUrl: 'https://youtu.be/RqptVKs7bc'
    },
    evidence: '"High Strangeness" reports: craft passing through solid objects, changing shape/size, the "Hitchhiker Effect" where paranormal phenomena follow witnesses home.',
    weakness: 'Scientifically difficult to test or prove. No experimental evidence confirms macroscopic extra dimensions.'
  },
  {
    id: 'extratemporal',
    name: 'Extra-temporal',
    icon: Clock,
    color: 'bg-amber-600',
    summary: 'Future humans traveling backward in time',
    coreConcept: 'UAP occupants (specifically "Greys") are our descendants from the distant future, returning to study the past or retrieve genetic material.',
    proponent: {
      name: 'Dr. Michael Masters',
      credential: 'Professor of Biological Anthropology, Montana Tech',
      bio: 'Argues the "Grey" physiology (large head, small face, gracile body) matches projected long-term trends in human evolution. Author of "Identified Flying Objects."',
      videoUrl: null
    },
    evidence: 'Grey morphology matches human evolutionary trajectory. Reports of genetic harvesting suggest biological compatibility. Nuclear facility interest could be future humans managing their timeline.',
    weakness: 'Time travel remains theoretical. Raises complex causality paradoxes (Grandfather Paradox).'
  },
  {
    id: 'cryptoterrestrial',
    name: 'Cryptoterrestrial',
    icon: Globe,
    color: 'bg-teal-600',
    summary: 'Hidden Earth civilization (underground, undersea, or "breakaway")',
    coreConcept: 'A technologically superior society exists in secret—either an ancient remnant species, or a modern "Breakaway Civilization" of humans with separate infrastructure.',
    proponent: {
      name: 'Catherine Austin Fitts',
      credential: 'Former Asst. Secretary of Housing (HUD)',
      bio: 'Claims trillions in "black budget" money funded a "Breakaway Civilization" with deep underground bases and space-based assets. Investment banker turned government finance whistleblower.',
      videoUrl: 'https://www.youtube.com/watch?v=z8pA2TDXtew'
    },
    evidence: 'Frequent "transmedium" UAP entering/exiting oceans (USS Omaha). Pentagon cannot account for $21+ trillion in adjustments. Antarctica facility claims.',
    weakness: 'Hard to hide massive industrial civilization from satellite surveillance. How would population remain genetically distinct?'
  },
  {
    id: 'simulation',
    name: 'Simulation Theory',
    icon: Monitor,
    color: 'bg-pink-600',
    summary: 'Reality is a construct; UAP are "glitches" or system administrators',
    coreConcept: 'The universe is a digital or consciousness-based simulation. UAP are "admins" or avatars inserting themselves into the code. Physics violations are simply parameter changes.',
    proponent: {
      name: 'Tom Campbell',
      credential: 'NASA Physicist, Missile Defense Analyst',
      bio: 'Former NASA physicist who argues reality is a "data stream" computed by a larger consciousness system. Collaborated with Robert Monroe on out-of-body research. Author of "My Big TOE."',
      videoUrl: 'https://youtu.be/tQR6SFK7lFc'
    },
    evidence: '"Impossible" physics (Mach 20 to zero instantly) resembles video game mechanics. The phenomenon often seems reactive to being observed.',
    weakness: 'Philosophically coherent but unfalsifiable. Cannot be proven or disproven experimentally.'
  },
  {
    id: 'consciousness',
    name: 'Consciousness-Based',
    icon: Brain,
    color: 'bg-indigo-600',
    summary: 'Psychic projections, thought forms, or mind-phenomenon interaction',
    coreConcept: 'UAP are not "craft" but interactions between human consciousness and a quantum field. Could be "tulpas" (thought-forms) or responses to focused intent.',
    proponent: {
      name: 'Dr. Garry Nolan',
      credential: 'Stanford Professor of Pathology, 300+ Publications',
      bio: 'Leading Stanford immunologist who has studied UAP experiencers. Found structural brain anomalies (caudate-putamen density) that may act as an "antenna" for the phenomenon.',
      videoUrl: null
    },
    evidence: 'CE-5 groups claim to successfully "summon" UAP using meditation. Dr. Nolan found physical brain changes in experiencers. "Hitchhiker Effect" suggests cognitive/spiritual contagion.',
    weakness: 'Relies heavily on subjective experience rather than hard sensor data.'
  },
  {
    id: 'prosaic',
    name: 'Prosaic Explanations',
    icon: CircleDot,
    color: 'bg-slate-600',
    summary: 'Drones, balloons, sensor errors, or classified human tech',
    coreConcept: 'All UAP are misidentified mundane objects, sensor artifacts, or classified technology (US or adversary). No exotic explanation required.',
    proponent: {
      name: 'AARO / Mick West',
      credential: 'Pentagon UAP Office / Skeptical Analyst',
      bio: 'AARO (All-domain Anomaly Resolution Office) officially found "no credible evidence" of ET activity. Mick West analyzes videos attributing them to parallax, bokeh, and sensor glare.',
      videoUrl: null
    },
    evidence: 'U-2 and SR-71 caused many 1950s-60s UFO reports. Drone swarms can mimic some behaviors. No public "smoking gun" (craft/body) has been peer-reviewed.',
    weakness: 'Does not explain objects performing 100g maneuvers, transmedium travel, or thousands of trained military observer reports.'
  },
  {
    id: 'hybrid',
    name: 'Hybrid / Multi-Source',
    icon: GitMerge,
    color: 'bg-rose-600',
    summary: 'Multiple phenomena with different origins coexisting',
    coreConcept: 'The phenomenon is not monolithic. Most UAP are prosaic, but subsets may be ETH, IDH, or other origins simultaneously. Requires "methodological pluralism."',
    proponent: {
      name: 'Jacques Vallée & Eric Davis, PhD',
      credential: 'Astrophysicist & Aerospace Physicist',
      bio: 'Proposed a "6-layer model" combining physical, anti-physical, and psychic effects. Davis consulted for AATIP and authored the leaked Wilson-Davis memo.',
      videoUrl: null
    },
    evidence: 'The data includes both "nuts and bolts" (radar tracks) AND "high strangeness" (telepathy), suggesting multiple phenomena.',
    weakness: 'Hard to build predictive scientific models for something that may change rules.'
  }
];

function ProponentTooltip({ proponent }: { proponent: Proponent }) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <span className="text-blue-400 hover:text-blue-300 cursor-help underline decoration-dotted underline-offset-2">
            {proponent.name}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs bg-slate-800 border-slate-700 p-4">
          <div className="space-y-2">
            <div>
              <p className="font-semibold text-white">{proponent.name}</p>
              <p className="text-xs text-slate-400">{proponent.credential}</p>
            </div>
            <p className="text-sm text-slate-300">{proponent.bio}</p>
            {proponent.videoUrl && (
              <a 
                href={proponent.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
              >
                <ExternalLink className="w-3 h-3" />
                Watch Interview
              </a>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function HypothesisCard({ hypothesis }: { hypothesis: Hypothesis }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = hypothesis.icon;
  
  return (
    <div 
      className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden transition-all"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className={`${hypothesis.color} rounded-lg p-2 flex-shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm mb-1">{hypothesis.name}</h3>
            <p className="text-slate-400 text-sm">{hypothesis.summary}</p>
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-slate-700 bg-slate-800/50">
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-mono text-slate-500 mb-1">CORE CONCEPT</p>
                  <p className="text-sm text-slate-300">{hypothesis.coreConcept}</p>
                </div>
                
                <div>
                  <p className="text-xs font-mono text-slate-500 mb-1">KEY PROPONENT</p>
                  <p className="text-sm text-slate-300">
                    <ProponentTooltip proponent={hypothesis.proponent} />
                    <span className="text-slate-500"> — {hypothesis.proponent.credential}</span>
                  </p>
                </div>
                
                <div>
                  <p className="text-xs font-mono text-slate-500 mb-1">BEST EVIDENCE</p>
                  <p className="text-sm text-slate-300">{hypothesis.evidence}</p>
                </div>
                
                <div>
                  <p className="text-xs font-mono text-red-400/70 mb-1">MAIN WEAKNESS</p>
                  <p className="text-sm text-slate-400">{hypothesis.weakness}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function GroundTruthHypotheses() {
  return (
    <section className="bg-slate-900 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-slate-500 text-xs font-mono tracking-widest mb-2">APPLYING THE FRAMEWORK</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ground Truth: The Space of Possibilities</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            By definition, we're working with incomplete information. The "ground truth" is unknown. 
            What we CAN do is map the space of what COULD be happening.
          </p>
        </div>
        
        {/* Hypothesis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {hypotheses.map((hypothesis) => (
            <HypothesisCard key={hypothesis.id} hypothesis={hypothesis} />
          ))}
        </div>
        
        {/* AARO Semantics Callout */}
        <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-amber-400 font-semibold mb-2">Critical Semantic Note: "ET" vs "NHI"</h4>
              <p className="text-slate-300 text-sm mb-3">
                AARO has repeatedly denied finding evidence of <strong className="text-white">"extraterrestrial"</strong> activity. 
                However, they carefully <strong className="text-white">avoid</strong> using the term <strong className="text-white">"Non-Human Intelligence" (NHI)</strong>—the 
                term Congress uses in legislation.
              </p>
              <p className="text-slate-400 text-sm italic">
                If the phenomenon is interdimensional, cryptoterrestrial, or extra-temporal, it is technically 
                NOT "extraterrestrial." This allows truthful denial while avoiding the broader question.
              </p>
              <p className="text-amber-400 text-sm mt-3 font-medium">
                — Dr. James Lacatski (DIA) confirmed the US has a "craft of unknown origin" but carefully 
                avoided the word "extraterrestrial," saying only: "We can be pretty well sure we're not dealing with humans."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
