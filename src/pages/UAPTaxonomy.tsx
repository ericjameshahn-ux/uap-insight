import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft,
  Globe, 
  Rocket, 
  Atom, 
  Brain, 
  Sparkles, 
  Network, 
  HelpCircle,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Subcategory {
  name: string;
  examples: string;
}

interface Proponent {
  name: string;
  credential: string;
  detail: string;
}

interface Video {
  title: string;
  url: string;
  platform: string;
}

interface Category {
  id: number;
  name: string;
  subtitle: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textAccent: string;
  Icon: React.ComponentType<{ className?: string }>;
  coreConcept: string;
  subcategories: Subcategory[];
  proponents: Proponent[];
  evidence: string[];
  weaknesses: string[];
  videos: Video[];
}

const UAP_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Prosaic",
    subtitle: "Conventional Explanations",
    color: "from-slate-500 to-slate-600",
    bgColor: "bg-slate-50 dark:bg-slate-900/50",
    borderColor: "border-slate-400 dark:border-slate-600",
    textAccent: "text-slate-700 dark:text-slate-300",
    Icon: Globe,
    coreConcept: "All UAP sightings can be fully explained by known science, human technology, natural phenomena, sensor errors, or deliberate deception. This is the null hypothesis against which all other theories must be measured.",
    subcategories: [
      { name: "Natural Phenomena", examples: "Celestial bodies (Venus), plasma balls, atmospheric mirages, ice crystals, ball lightning" },
      { name: "Human Technology", examples: "Military aircraft, drones, satellites (Starlink), experimental craft, foreign adversary tech" },
      { name: "Human Error/Misperception", examples: "Parallax effects, bokeh, sensor glare, radar ghosts, compression artifacts" },
      { name: "Deliberate Deception", examples: "Hoaxes, disinformation campaigns, psy-ops, misattributed footage" }
    ],
    proponents: [
      { name: "Mick West", credential: "Skeptical analyst, former game developer", detail: "Attributes videos to parallax, bokeh, and sensor artifacts" },
      { name: "Sean Kirkpatrick", credential: "Former AARO Director", detail: "Found 'no credible evidence' of ET activity" },
      { name: "Philip Klass", credential: "Aviation journalist (deceased)", detail: "Prominent skeptic who debunked many cases" },
      { name: "Condon Report", credential: "1969 USAF study", detail: "Concluded UFOs were not scientific anomalies" }
    ],
    evidence: [
      "Historical precedent: U-2 and SR-71 caused many 1950s-60s 'UFO' sightings",
      "Over 12,000 historical cases resolved as airborne clutter by AARO",
      "Technological feasibility of drone swarms mimicking UAP behaviors",
      "No public 'smoking gun' (craft/body) produced for peer review"
    ],
    weaknesses: [
      "Does not explain objects performing 100g+ maneuvers or transmedium travel",
      "Requires dismissing thousands of trained military observer reports",
      "Cannot account for simultaneous multi-sensor (radar + visual + IR) confirmations",
      "The 'Five Observables' exceed known materials science and propulsion"
    ],
    videos: [
      { title: "Mick West Analysis: Gimbal Video", url: "https://www.youtube.com/watch?v=qsEjV8DdSbs", platform: "YouTube" },
      { title: "AARO Congressional Briefing", url: "https://www.youtube.com/watch?v=Zt7klNiKbkY", platform: "C-SPAN" }
    ]
  },
  {
    id: 2,
    name: "Physical Non-Human",
    subtitle: "Material Beings from Elsewhere",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/30",
    borderColor: "border-blue-400 dark:border-blue-600",
    textAccent: "text-blue-700 dark:text-blue-300",
    Icon: Rocket,
    coreConcept: "UAP are physical 'nuts and bolts' spacecraft piloted by biological beings or AI probes. Origin may be extraterrestrial (other star systems), cryptoterrestrial (hidden Earth civilization), or extra-temporal (future humans).",
    subcategories: [
      { name: "Extraterrestrial (ETH)", examples: "Interstellar visitors, Von Neumann probes, biological entities from exoplanets" },
      { name: "Cryptoterrestrial (CTH)", examples: "Ancient Earth civilization (Atlantis), undersea bases, 'breakaway civilization', shadow biosphere" },
      { name: "Extra-Temporal", examples: "Future humans ('Greys' as evolved descendants), time-traveling anthropologists" },
      { name: "Artificial/Technological NHI", examples: "AGI probes, self-replicating machines, living technology, NHI-created drones" }
    ],
    proponents: [
      { name: "Col. Karl Nell (Ret.)", credential: "Former Army UAP Task Force", detail: "Stated 'zero doubt' NHI has interacted with humanity" },
      { name: "David Grusch", credential: "Former NGA/NRO, whistleblower", detail: "Testified to recovery of 'intact vehicles' and 'non-human biologics'" },
      { name: "Dr. Michael Masters", credential: "Prof. Biological Anthropology, Montana Tech", detail: "Argues 'Greys' match future human evolution trajectory" },
      { name: "Mac Tonnies", credential: "Author, 'The Cryptoterrestrials' (deceased)", detail: "Proposed indigenous non-human Earth civilization" },
      { name: "Catherine Austin Fitts", credential: "Former Asst. Secretary HUD", detail: "Claims trillions funded a 'Breakaway Civilization'" }
    ],
    evidence: [
      "2004 Nimitz 'Tic Tac': Multi-sensor confirmation (radar, FLIR, visual) of 100g+ maneuvers",
      "Whistleblower testimony on crash retrievals and 'non-human biologics'",
      "Transmedium observations: Objects entering/exiting oceans (USS Omaha, USS Jackson)",
      "Pentagon's $21T+ in unaccounted adjustments suggests massive off-book programs",
      "'Grey' morphology matches human evolutionary trajectory (encephalization, neoteny)"
    ],
    weaknesses: [
      "ETH: Interstellar distances are energetically prohibitive; no SETI radio signals detected",
      "ETH: If here, why no overt contact? (Fermi Paradox)",
      "CTH: Hard to hide industrial civilization from satellite surveillance",
      "Extra-temporal: Time travel raises causality paradoxes (Grandfather Paradox)",
      "No publicly peer-reviewed off-world materials or biologics"
    ],
    videos: [
      { title: "Col. Karl Nell - SOL Foundation 2024", url: "https://www.youtube.com/watch?v=8V3cQdLfBJQ", platform: "YouTube" },
      { title: "David Grusch Congressional Testimony", url: "https://www.youtube.com/watch?v=SNgoul4vyDM", platform: "C-SPAN" },
      { title: "Dr. Michael Masters on JRE #2428", url: "https://www.youtube.com/watch?v=eMRBHspLCLo", platform: "YouTube" }
    ]
  },
  {
    id: 3,
    name: "Meta-Physical",
    subtitle: "Non-Standard Physics",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50 dark:bg-violet-900/30",
    borderColor: "border-violet-400 dark:border-violet-600",
    textAccent: "text-violet-700 dark:text-violet-300",
    Icon: Atom,
    coreConcept: "UAP utilize 'metric engineering' to manipulate spacetime or manifest from higher dimensions (4D/5D), parallel universes, or a simulation substrate. They may be co-located in dimensions we cannot perceive.",
    subcategories: [
      { name: "Extra-Dimensional (EDH)", examples: "Higher spatial dimensions (4D+), compactified dimensions, hyperspace/'bulk'" },
      { name: "Inter-Dimensional (IDH)", examples: "Parallel universes, multiverse bleed-through, colliding branes, previous-aeon entities" },
      { name: "Simulation/Information-Based", examples: "Simulation hypothesis, holographic principle, 'glitches', admin interventions" },
      { name: "Ultraterrestrial (UTH)", examples: "Entities manipulating spacetime, scale-invariant beings, vibratory frequency shifts" }
    ],
    proponents: [
      { name: "Jacques Vallée, PhD", credential: "Astrophysicist, computer scientist, VC", detail: "UAP are a 'control system' adapting to cultural expectations across centuries" },
      { name: "Dr. Eric Davis", credential: "Aerospace physicist, AATIP consultant", detail: "Discussed wormholes and portal physics as entry mechanisms" },
      { name: "Hal Puthoff, PhD", credential: "Physicist, SRI remote viewing program", detail: "Proposed 'Ultraterrestrials' as viable hypothesis" },
      { name: "Tom Campbell", credential: "NASA physicist, author 'My Big TOE'", detail: "Reality is a 'data stream'; UAP are manipulations of that stream" },
      { name: "Donald Hoffman", credential: "Cognitive scientist, UCI", detail: "Spacetime is a 'user interface,' not fundamental reality" }
    ],
    evidence: [
      "'High Strangeness': Craft appearing/disappearing, passing through solid objects, shape-shifting",
      "'Hitchhiker Effect': Paranormal phenomena following witnesses home (Skinwalker Ranch)",
      "Alcubierre warp drive: Theoretical physics allows localized spacetime distortions",
      "'Impossible' physics: Instant acceleration (Mach 20 to 0) resembles simulation variable manipulation",
      "Observer effect: Phenomenon often seems reactive to being observed"
    ],
    weaknesses: [
      "'Interdimensional' is scientifically difficult to test or falsify",
      "No experimental evidence confirms macroscopic extra dimensions",
      "Simulation hypothesis is philosophically coherent but unprovable",
      "Relies heavily on subjective 'high strangeness' accounts",
      "Hard to build predictive scientific models for shape-shifting phenomena"
    ],
    videos: [
      { title: "Jacques Vallée - Theories of Everything", url: "https://www.youtube.com/watch?v=uXjIrPlwYQo", platform: "YouTube" },
      { title: "Tom Campbell on JRE", url: "https://www.youtube.com/watch?v=1jUmIOMDz6M", platform: "YouTube" },
      { title: "Eric Davis on Warp Drives", url: "https://www.youtube.com/watch?v=Qa5rTi5RMOU", platform: "YouTube" }
    ]
  },
  {
    id: 4,
    name: "Consciousness/Mental",
    subtitle: "Mind & Perception",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
    borderColor: "border-indigo-400 dark:border-indigo-600",
    textAccent: "text-indigo-700 dark:text-indigo-300",
    Icon: Brain,
    coreConcept: "UAP are not physical 'craft' but psychic constructs, manifestations of consciousness, or interactions between human minds and a quantum/informational field. The brain may act as an 'antenna' for the phenomenon.",
    subcategories: [
      { name: "Psycho-Social (PSH)", examples: "Mass hysteria, cultural bias, memetic virus, media-induced belief" },
      { name: "Neurological/Psychological", examples: "Hallucinations, altered states, neurodivergent perception, trauma responses, false memory" },
      { name: "Consciousness-Generated", examples: "Tulpas/thought-forms, Jungian archetypes, egregores, psi/psychic projection" },
      { name: "Observer-Dependent", examples: "Quantum observer effect, participatory universe, consciousness as fundamental substrate" }
    ],
    proponents: [
      { name: "Dr. Garry Nolan", credential: "Stanford Prof. of Pathology", detail: "Suggests caudate-putamen acts as 'antenna' for phenomenon; documented brain anomalies in experiencers" },
      { name: "John Mack, MD", credential: "Harvard psychiatrist (deceased)", detail: "Studied abduction experiencers; concluded experiences were 'real' to patients" },
      { name: "Carl Jung", credential: "Psychiatrist, founder of analytical psychology (deceased)", detail: "UAP are 'technological angels'—projections of collective unconscious" },
      { name: "Steven Greer, MD", credential: "CE-5 protocol developer", detail: "Consciousness itself functions as the signal for contact" },
      { name: "Chris Bledsoe", credential: "Experiencer, author", detail: "Claims UAP are spiritual entities responding to prayer/intent" }
    ],
    evidence: [
      "CE-5 protocols: Groups report successfully 'summoning' UAP using meditation/intent",
      "Brain anomalies: Medical documentation of structural changes in experiencers",
      "'Hitchhiker Effect': Paranormal 'contagion' suggesting cognitive/spiritual transmission",
      "Consistent cross-cultural patterns in contact experiences despite no prior exposure",
      "Phenomenon often displays apparent awareness of being observed"
    ],
    weaknesses: [
      "Relies heavily on anecdotal and subjective experience",
      "Difficult to produce hard sensor data for consciousness-based phenomena",
      "Does not explain physical traces (landing marks, radar returns, materials)",
      "Selection bias in CE-5 success reports",
      "Cannot account for multi-witness simultaneous observations with no prior coordination"
    ],
    videos: [
      { title: "Dr. Garry Nolan - Multiple Interviews", url: "https://www.youtube.com/watch?v=uTCc2-1tbBQ", platform: "YouTube" },
      { title: "Chris Bledsoe Story", url: "https://www.youtube.com/watch?v=NnLlGkpDL_8", platform: "YouTube" },
      { title: "Steven Greer CE-5 Explanation", url: "https://www.youtube.com/watch?v=Eco2s3-0zsQ", platform: "YouTube" }
    ]
  },
  {
    id: 5,
    name: "Spiritual/Religious",
    subtitle: "Traditional & Esoteric",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/30",
    borderColor: "border-amber-400 dark:border-amber-600",
    textAccent: "text-amber-700 dark:text-amber-300",
    Icon: Sparkles,
    coreConcept: "UAP are manifestations described throughout human religious and spiritual traditions—angels, demons, djinn, nature spirits, or entities from 'daimonic reality.' The phenomenon adapts its presentation to cultural/religious frameworks.",
    subcategories: [
      { name: "Traditional Religious", examples: "Angels/divine messengers, demons/fallen entities, djinn, deities/avatars, Marian apparitions" },
      { name: "Indigenous/Shamanic", examples: "Ancestors/spirit guides, nature spirits, shamanic entities, 'star people', sky beings" },
      { name: "Esoteric/Occult", examples: "Ascended masters, hermetic entities, theosophical beings, daimonic reality, elemental forces" },
      { name: "New Religious Movements", examples: "Contactee religions (Raëlism), UFO cults, syncretic interpretations, channeled entities" }
    ],
    proponents: [
      { name: "Diana Pasulka, PhD", credential: "Prof. Religious Studies, UNC Wilmington", detail: "Documents parallels between UAP experiences and religious phenomena" },
      { name: "Rev. Barry Downing", credential: "Presbyterian minister, author", detail: "Biblical events (Ezekiel's wheel, Star of Bethlehem) as UAP encounters" },
      { name: "Whitley Strieber", credential: "Author, 'Communion'", detail: "Describes encounters with entities defying simple ET categorization" },
      { name: "Graham Hancock", credential: "Author, ancient civilizations researcher", detail: "Links UAP to shamanic traditions and altered-state entities" },
      { name: "Jeffrey Kripal", credential: "Prof. Religious Studies, Rice University", detail: "Studies 'impossible' experiences at intersection of religion and paranormal" }
    ],
    evidence: [
      "Cross-cultural consistency: Similar entities described across isolated civilizations",
      "Historical continuity: 'Luminous visions' and aerial phenomena in religious texts worldwide",
      "Marian apparitions (Fatima 1917) witnessed by 70,000 with 'solar miracle'",
      "Indigenous traditions describe 'star people' contact predating modern UFO era",
      "Experiencer reports often include spiritual/transformative components"
    ],
    weaknesses: [
      "Relies on faith-based frameworks not amenable to scientific testing",
      "Cultural interpretation may impose meaning on ambiguous stimuli",
      "Does not explain physical/technological aspects of encounters",
      "Difficult to distinguish genuine phenomena from religious projection",
      "Competing religious frameworks offer contradictory interpretations"
    ],
    videos: [
      { title: "Diana Pasulka - American Cosmic", url: "https://www.youtube.com/watch?v=WxwVsWYkZ1o", platform: "YouTube" },
      { title: "Whitley Strieber Interviews", url: "https://www.youtube.com/watch?v=4HLWJupaNv4", platform: "YouTube" },
      { title: "Graham Hancock on Entities", url: "https://www.youtube.com/watch?v=IzhqGLv7X2s", platform: "YouTube" }
    ]
  },
  {
    id: 6,
    name: "Hybrid/Emergent",
    subtitle: "Complex Interactions",
    color: "from-teal-500 to-emerald-500",
    bgColor: "bg-teal-50 dark:bg-teal-900/30",
    borderColor: "border-teal-400 dark:border-teal-600",
    textAccent: "text-teal-700 dark:text-teal-300",
    Icon: Network,
    coreConcept: "The phenomenon is multifaceted—combining physical craft with psychic manipulation, operating as a 'control system' for human belief, or emerging from complex interactions between multiple sources and human consciousness.",
    subcategories: [
      { name: "Human-NHI Collaboration", examples: "Breakaway civilization, human-alien hybrids, reverse-engineered technology transfer" },
      { name: "Emergent Phenomena", examples: "Gaia hypothesis extension, collective consciousness manifestation, planetary 'immune response'" },
      { name: "Control System (Vallée)", examples: "Thermostat for human belief, social engineering by NHI, memetic programming, cultural guidance" },
      { name: "Zoo/Quarantine Hypothesis", examples: "Observation without interference, 'Galactic Federation' policy, cosmic 'prime directive'" }
    ],
    proponents: [
      { name: "Jacques Vallée, PhD", credential: "Astrophysicist, computer scientist", detail: "Proposed '6-layer model' combining physical, anti-physical, and psychic effects" },
      { name: "Dr. Eric Davis", credential: "Aerospace physicist", detail: "Co-authored 6-layer model; suggests phenomenon operates across multiple domains" },
      { name: "Richard Dolan", credential: "Historian, author", detail: "'Breakaway Civilization' with separate infrastructure and technology" },
      { name: "Karl Svozil", credential: "Physicist", detail: "Advocates 'methodological anarchy' (pluralism) because phenomenon doesn't fit one model" },
      { name: "Haim Eshed", credential: "Former Israeli space security chief", detail: "Claimed existence of 'Galactic Federation' with non-interference protocols" }
    ],
    evidence: [
      "Data includes both 'nuts and bolts' (radar) AND 'high strangeness' (telepathy)",
      "Phenomenon appears to adapt its presentation to observer expectations over centuries",
      "Multiple hypothesis types may each explain different subsets of cases",
      "Consistent interest in nuclear facilities suggests monitoring/intervention role",
      "Reports of human-NHI joint programs from multiple independent whistleblowers"
    ],
    weaknesses: [
      "Complexity makes it hard to build predictive scientific models",
      "Risk of becoming unfalsifiable 'waste bucket' for all unexplained phenomena",
      "Distinguishing interdimensional probe from future-human drone remains impossible",
      "Multiple explanations may indicate lack of underlying coherent phenomenon",
      "Conspiracy-adjacent framing reduces mainstream scientific engagement"
    ],
    videos: [
      { title: "Vallée & Davis 6-Layer Model", url: "https://www.youtube.com/watch?v=WpN5qjp3K7E", platform: "YouTube" },
      { title: "Richard Dolan on Breakaway Civilization", url: "https://www.youtube.com/watch?v=jWHApitp8-M", platform: "YouTube" },
      { title: "Curt Jaimungal - Theories of Everything", url: "https://www.youtube.com/c/TheoriesofEverything", platform: "YouTube" }
    ]
  },
  {
    id: 7,
    name: "Other/Unknown",
    subtitle: "Limits of Conception",
    color: "from-gray-600 to-gray-800",
    bgColor: "bg-gray-100 dark:bg-gray-800/50",
    borderColor: "border-gray-400 dark:border-gray-600",
    textAccent: "text-gray-700 dark:text-gray-300",
    Icon: HelpCircle,
    coreConcept: "Categories acknowledging that human conceptual frameworks may be fundamentally inadequate. The phenomenon may be something we cannot currently imagine, or multiple hypotheses may be simultaneously true.",
    subcategories: [
      { name: "Unimagined", examples: "Explanations within human capacity to understand but not yet conceived" },
      { name: "Unimaginable", examples: "Explanations beyond human conceptual capacity entirely—cognitively inaccessible" },
      { name: "None of the Above", examples: "All current hypotheses are wrong; truth is something completely different" },
      { name: "All of the Above", examples: "Multiple explanations simultaneously true for different subsets of phenomena" },
      { name: "'Something Else'", examples: "Definitionally indescribable; category exists to acknowledge the possibility" }
    ],
    proponents: [
      { name: "Karl Svozil", credential: "Physicist, Vienna University of Technology", detail: "Advocates 'methodological anarchy'—openness to explanations outside current paradigms" },
      { name: "Tim Lomas, PhD", credential: "Positive psychology researcher, Harvard", detail: "Co-authored cryptoterrestrial hypothesis paper; emphasizes epistemic humility" },
      { name: "Avi Loeb", credential: "Prof. Astronomy, Harvard", detail: "Argues we must remain open to explanations we haven't conceived" }
    ],
    evidence: [
      "Historical pattern: Many 'impossible' phenomena later explained by unconceived frameworks",
      "Phenomenon consistently defies categorization across 75+ years of study",
      "Different cases may genuinely have different explanations",
      "Human cognitive limits are well-documented; we may lack capacity to understand",
      "The 'trickster' quality of phenomenon suggests deliberate evasion of categorization"
    ],
    weaknesses: [
      "Functionally unfalsifiable by definition",
      "Risk of premature epistemic surrender",
      "May discourage rigorous investigation in favor of mysticism",
      "Doesn't provide actionable research directions",
      "Could be used to dismiss legitimate prosaic explanations"
    ],
    videos: [
      { title: "Avi Loeb on Scientific Open-Mindedness", url: "https://www.youtube.com/watch?v=cE2dHZ_M5S8", platform: "YouTube" },
      { title: "Tim Lomas - Cryptoterrestrial Paper Discussion", url: "https://www.youtube.com/watch?v=Pn-yYJdxX1k", platform: "YouTube" }
    ]
  }
];

interface SectionHeaderProps {
  title: string;
  color: string;
}

const SectionHeader = ({ title, color }: SectionHeaderProps) => (
  <div className={cn("flex items-center gap-2 mb-2", color)}>
    <h4 className="font-semibold text-sm uppercase tracking-wide">{title}</h4>
  </div>
);

interface CategoryCardProps {
  category: Category;
  isExpanded: boolean;
  onToggle: () => void;
}

const CategoryCard = ({ category, isExpanded, onToggle }: CategoryCardProps) => {
  const { Icon } = category;
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className={cn(
      "rounded-xl border-2 overflow-hidden transition-all duration-300 hover:shadow-lg",
      category.borderColor,
      category.bgColor
    )}>
      <button
        onClick={onToggle}
        className={cn(
          "w-full p-4 flex items-center gap-4 bg-gradient-to-r text-white",
          category.color
        )}
      >
        <div className="p-2 rounded-lg bg-white/20">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-bold text-lg">{category.id}. {category.name}</h3>
          <p className="text-white/80 text-sm">{category.subtitle}</p>
        </div>
        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>
      
      {isExpanded && (
        <div className="p-4">
          {/* Tab Navigation */}
          <div className="flex gap-1 mb-4 bg-white/50 dark:bg-black/20 rounded-lg p-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'proponents', label: 'Proponents' },
              { id: 'evidence', label: 'Evidence' },
              { id: 'weaknesses', label: 'Weaknesses' },
              { id: 'videos', label: 'Videos' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  activeTab === tab.id 
                    ? `bg-white dark:bg-slate-800 shadow ${category.textAccent}` 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-black/20'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'overview' && (
              <>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                  <SectionHeader title="Core Concept" color={category.textAccent} />
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{category.coreConcept}</p>
                </div>
                
                <div>
                  <SectionHeader title="Subcategories" color={category.textAccent} />
                  <div className="grid gap-2">
                    {category.subcategories.map((sub, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{category.id}.{idx + 1} {sub.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{sub.examples}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'proponents' && (
              <div className="space-y-3">
                <SectionHeader title="Key Proponents" color={category.textAccent} />
                {category.proponents.map((p, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{p.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{p.credential}</div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{p.detail}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'evidence' && (
              <div className="space-y-2">
                <SectionHeader title="Best Supporting Evidence" color={category.textAccent} />
                {category.evidence.map((item, idx) => (
                  <div key={idx} className="flex gap-3 bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <div className="flex-shrink-0 mt-0.5 text-emerald-500">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{item}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'weaknesses' && (
              <div className="space-y-2">
                <SectionHeader title="Main Weaknesses / Counter-Arguments" color={category.textAccent} />
                {category.weaknesses.map((item, idx) => (
                  <div key={idx} className="flex gap-3 bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                    <div className="flex-shrink-0 mt-0.5 text-red-400">
                      <XCircle className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{item}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'videos' && (
              <div className="space-y-2">
                <SectionHeader title="Key Video Resources" color={category.textAccent} />
                {category.videos.map((video, idx) => (
                  <a
                    key={idx}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500 hover:shadow-sm transition-all group"
                  >
                    <div className={cn("p-2 rounded-lg bg-gradient-to-r text-white", category.color)}>
                      <PlayCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {video.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{video.platform}</div>
                    </div>
                    <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function UAPTaxonomy() {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set([2]));
  const [showAll, setShowAll] = useState(false);

  const toggleCategory = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (showAll) setExpandedIds(new Set());
    else setExpandedIds(new Set(UAP_CATEGORIES.map(c => c.id)));
    setShowAll(!showAll);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Link */}
        <Link to="/framework" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Framework
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-sm mb-4">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            MECE Framework • Non-Advocacy • Falsifiable
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            UAP Origin Hypotheses
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            A structured, neutral taxonomy for classifying potential explanations 
            for Unidentified Anomalous Phenomena. Click any category to explore.
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={toggleAll}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
          >
            {showAll ? 'Collapse All' : 'Expand All'}
          </button>
        </div>

        {/* Categories */}
        <div className="grid gap-4">
          {UAP_CATEGORIES.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              isExpanded={expandedIds.has(category.id)}
              onToggle={() => toggleCategory(category.id)}
            />
          ))}
        </div>

        {/* AARO Semantics Note */}
        <div className="mt-8 p-4 bg-amber-900/30 rounded-xl border border-amber-700/50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-amber-400 font-semibold mb-2">Note on Government Terminology</h3>
              <p className="text-amber-200/80 text-sm leading-relaxed">
                AARO denies "extraterrestrial" programs but avoids the broader term "Non-Human Intelligence" (NHI) used in Congressional legislation. 
                If the source is interdimensional, cryptoterrestrial, or temporal, it is technically not "extraterrestrial"—creating a semantic loophole 
                where denials may be technically accurate while not addressing the full scope of the phenomenon.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Attribution */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="text-center text-sm text-slate-400">
            <p className="font-medium text-slate-300 mb-2">Attribution</p>
            <p>
              Synthesized from frameworks by:{' '}
              <span className="text-white">Col. Karl Nell (Ret.)</span> — SOL Foundation 2024 |{' '}
              <span className="text-white">Alex Gomez-Marin & Curt Jaimungal</span> — Theories of Everything |{' '}
              <span className="text-white">Bill Lamprey</span> — @btlamprey.bsky.social
            </p>
          </div>
        </div>

        {/* Design Principles Footer */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            Mutually Exclusive
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            Collectively Exhaustive
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
            Non-Advocacy
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
            Falsifiable Claims
          </span>
        </div>
      </div>
    </div>
  );
}