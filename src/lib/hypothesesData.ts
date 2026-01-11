export interface Hypothesis {
  id: number;
  title: string;
  icon: string;
  gradient: string;
  summary: string;
  investmentImplications: string;
  figures: HypothesisFigure[];
  claims: HypothesisClaim[];
  featuredVideo: HypothesisVideo;
  additionalVideos: HypothesisVideo[];
}

export interface HypothesisFigure {
  name: string;
  role: string;
  credentials: string;
  icon?: string;
}

export interface HypothesisClaim {
  text: string;
  tier: 'HIGH' | 'MEDIUM' | 'LOWER';
}

export interface HypothesisVideo {
  title: string;
  url: string;
  description?: string;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const watchMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  
  return null;
}

export const hypotheses: Hypothesis[] = [
  {
    id: 1,
    title: 'Ancient/Remnant Technology',
    icon: '🏛️',
    gradient: 'from-slate-600 to-slate-800',
    summary: 'UAPs may be ancient or remnant technology—dormant systems or automated probes left behind by a civilization that has departed, died out, or moved on. They exhibit autonomous behavior patterns rather than biological pilot decision-making.',
    investmentImplications: 'Defense/Autonomous Systems (Anduril, autonomous interceptors), Space Domain Awareness (LeoLabs, orbital mapping), Edge Computing (AI at sensor level), Metamaterials (reverse engineering ancient alloys).',
    figures: [
      {
        name: 'Palmer Luckey',
        role: 'Founder, Anduril Industries',
        credentials: 'Founded Oculus VR; Built $14B defense tech company; Pentagon advisor on autonomous systems',
        icon: '🎮'
      }
    ],
    claims: [
      { text: 'UAP exhibit autonomous behavior patterns consistent with AI rather than biological pilots', tier: 'MEDIUM' },
      { text: 'Technology may be dormant systems that activate under certain conditions', tier: 'MEDIUM' },
      { text: 'Behavior suggests pre-programmed responses rather than real-time decision making', tier: 'MEDIUM' }
    ],
    featuredVideo: {
      title: 'Palmer Luckey Interview on UAP',
      url: 'https://www.youtube.com/watch?v=RBXXYpjs9TE',
      description: 'UAP discussion starts around 28:30 - Luckey discusses autonomous technology hypothesis'
    },
    additionalVideos: []
  },
  {
    id: 2,
    title: 'Extratemporal / Time Traveler',
    icon: '⏳',
    gradient: 'from-purple-600 to-violet-800',
    summary: 'UAP occupants may be future human descendants returning through time to study their evolutionary history. The "Grey" phenotype exhibits anatomical features consistent with projected human evolutionary trends. A future reproductive crisis may drive "gamete harvesting" missions to the past.',
    investmentImplications: 'Fertility/Biotech (IVF, artificial gametogenesis, genetic preservation), Therapeutic Gene Editing (CRISPR, error-correction), Temporal Physics (metamaterials research for spacetime manipulation).',
    figures: [
      {
        name: 'Dr. Michael Masters',
        role: 'Professor of Biological Anthropology, Montana Tech',
        credentials: 'PhD Anthropology; Expert in human evolutionary anatomy; Author of "Identified Flying Objects"',
        icon: '🧬'
      }
    ],
    claims: [
      { text: '"Grey" anatomy consistent with projected human evolutionary trends (larger cranium, smaller jaw, larger eyes)', tier: 'MEDIUM' },
      { text: 'Abduction accounts often involve reproductive procedures—consistent with gamete harvesting hypothesis', tier: 'LOWER' },
      { text: 'Future humans would have both motive (study origins) and means (advanced physics) to return', tier: 'MEDIUM' }
    ],
    featuredVideo: {
      title: 'Joe Rogan Experience #2428 - Dr. Michael Masters',
      url: 'https://youtu.be/shmDI4tMeuo',
      description: 'Full discussion of the extratemporal hypothesis and evolutionary biology'
    },
    additionalVideos: [
      { title: 'Identified Flying Objects - Extended Interview', url: 'https://youtu.be/NWvIvJHIYk0' },
      { title: 'Time Travel & UAP - Academic Perspective', url: 'https://youtu.be/Y26iMB0r-f8' }
    ]
  },
  {
    id: 3,
    title: 'Orbital Monitoring System',
    icon: '🛰️',
    gradient: 'from-blue-600 to-cyan-800',
    summary: 'Earth may be surrounded by an automated monitoring network predating human spaceflight. Jackson proposes a sphere hierarchy (interceptors, relays, drones). Villarroel\'s peer-reviewed VASCO research documents anomalous transients in 1950s astronomical plates—physical objects in orbit before Sputnik (1957).',
    investmentImplications: 'Optical SETI (commercial space observation), Space Domain Awareness (pre-Sputnik artifact mapping), RF Spectrum Monitoring (1.6 GHz signal analysis), Satellite Insurance (unmodeled risk factors).',
    figures: [
      {
        name: 'Patrick Jackson',
        role: 'Independent Researcher, Spheres Analysis',
        credentials: 'Former aerospace engineer; Systematic analysis of sphere-type UAP; Hierarchical classification system',
        icon: '🔴'
      },
      {
        name: 'Dr. Beatriz Villarroel',
        role: 'Astrophysicist, VASCO Project',
        credentials: 'PhD Astrophysics; Stockholm University; Peer-reviewed research on pre-Sputnik orbital anomalies',
        icon: '🔭'
      }
    ],
    claims: [
      { text: 'VASCO Project identified anomalous transients in 1950s photo plates—objects in orbit before Sputnik', tier: 'HIGH' },
      { text: 'Sphere-type UAP may represent hierarchical system: interceptors, relays, and reconnaissance drones', tier: 'MEDIUM' },
      { text: 'Consistent 1.6 GHz signals detected from multiple sphere encounters', tier: 'MEDIUM' }
    ],
    featuredVideo: {
      title: 'Patrick Jackson - Sphere Hierarchy Analysis',
      url: 'https://youtu.be/SGFrfW5seiI',
      description: 'Systematic breakdown of sphere-type UAP classification'
    },
    additionalVideos: [
      { title: 'Patrick Jackson - Extended Analysis', url: 'https://youtu.be/4DxEKqMoMI0' },
      { title: 'Dr. Villarroel - VASCO Project Overview', url: 'https://youtu.be/VhGqrHz6zcg' },
      { title: 'Dr. Villarroel - Pre-Sputnik Anomalies', url: 'https://youtu.be/1zRWi_r3HRM' }
    ]
  },
  {
    id: 4,
    title: 'Multiple Species / Types',
    icon: '👽',
    gradient: 'from-emerald-600 to-green-800',
    summary: 'UAP involve distinct biological species with different origins and intentions. Davis identifies four entity types: Earth-like humanoids (friendly), Greys (drones), non-humanoid EBEs (dangerous), and transmorphic entities (mind energy). Ramirez categorizes them as "strangers, visitors, and residents" with evidence of hybridization programs.',
    investmentImplications: 'Metamaterials (isotopic anomaly research), Bio-Defense (hybrid biology, adverse biological effects), Directed Energy (radiation shielding for craft proximity), Materials Science (negative refraction, exotic alloys).',
    figures: [
      {
        name: 'Dr. Eric Davis',
        role: 'Astrophysicist, EarthTech International',
        credentials: 'PhD Physics; Former Pentagon advisor; AATIP consultant; Co-author of Defense Intelligence Reference Documents',
        icon: '⚛️'
      },
      {
        name: 'John Ramirez',
        role: 'CIA Officer (Retired)',
        credentials: '25+ years CIA; Directorate of Science & Technology; GS-15; Specialized in foreign missile systems',
        icon: '🕵️'
      }
    ],
    claims: [
      { text: 'Four distinct entity types identified: humanoid (friendly), Grey (drones), non-humanoid EBE (dangerous), transmorphic', tier: 'LOWER' },
      { text: 'Materials recovered show isotopic ratios impossible through natural Earth processes', tier: 'HIGH' },
      { text: 'Evidence suggests long-term hybridization programs spanning decades', tier: 'LOWER' },
      { text: 'Different species have different intentions—not all are benevolent', tier: 'MEDIUM' }
    ],
    featuredVideo: {
      title: 'Dr. Eric Davis - Entity Classification',
      url: 'https://youtu.be/I2h5CJcjjkw',
      description: 'Davis discusses the four-type classification system for non-human entities'
    },
    additionalVideos: [
      { title: 'Eric Davis - Extended Physics Discussion', url: 'https://youtu.be/0DizznR72CM' },
      { title: 'John Ramirez - Strangers, Visitors, Residents', url: 'https://youtu.be/nS_Insp7i_Y' },
      { title: 'John Ramirez - Hybridization Evidence', url: 'https://youtu.be/KRdMTE-4Ymk' },
      { title: 'Ramirez - CIA Perspective', url: 'https://youtu.be/El5QcDe9L2I' },
      { title: 'Ramirez & Sarfatti Discussion', url: 'https://youtu.be/c3mxN1ScL-U' }
    ]
  },
  {
    id: 5,
    title: 'Historical / Religious Continuity',
    icon: '✨',
    gradient: 'from-amber-500 to-yellow-700',
    summary: 'UAP are a persistent non-human intelligence interpreted through each epoch\'s cultural lens—angels in antiquity, aliens in the technological age. Elite scientists (the "Invisible College") view UAP sites as intentional "donations" meant to guide human development. Vatican archives contain historical aerial phenomena reports dating to the 17th century.',
    investmentImplications: 'Human Performance (nootropics, cognitive optimization), Flow State Technology (transcranial stimulation), Venture Capital Signals ("Invisible College" founder identification), Tech Transfer ("donation" site commercialization).',
    figures: [
      {
        name: 'Dr. Diana Walsh Pasulka',
        role: 'Professor of Religious Studies, UNC Wilmington',
        credentials: 'PhD Philosophy of Religion; Chair of Philosophy & Religion; Author of "American Cosmic"',
        icon: '📚'
      }
    ],
    claims: [
      { text: 'UAP represent persistent non-human intelligence interpreted through cultural lens of each era', tier: 'MEDIUM' },
      { text: '"Invisible College" of elite scientists study crash sites as intentional technology "donations"', tier: 'MEDIUM' },
      { text: 'Vatican archives contain centuries of aerial phenomena documentation', tier: 'HIGH' },
      { text: 'Innovation correlates with proximity to UAP activity—possible guided development', tier: 'LOWER' }
    ],
    featuredVideo: {
      title: 'Joe Rogan Experience #2091 - Diana Pasulka',
      url: 'https://www.youtube.com/watch?v=71XphFGuORY',
      description: 'Full discussion of the religious/historical continuity hypothesis'
    },
    additionalVideos: [
      { title: 'American Cosmic - Extended Interview', url: 'https://youtu.be/aQhikls5Ye8' }
    ]
  },
  {
    id: 6,
    title: 'Extraterrestrial (ETH)',
    icon: '🛸',
    gradient: 'from-indigo-600 to-blue-800',
    summary: 'UAP are spacecraft from other star systems piloted by non-human biological or AI entities. This is the most widely recognized hypothesis in popular culture and is supported by testimony from credentialed government insiders claiming direct knowledge of recovered non-human craft.',
    investmentImplications: 'Space Domain Awareness (Galileo Project sensors), SETI Infrastructure (optical/radio monitoring), Propulsion Research (interstellar travel), Astrobiology (biosignature detection).',
    figures: [
      {
        name: 'Dr. Avi Loeb',
        role: 'Professor of Astronomy, Harvard University',
        credentials: 'Chair of Harvard Astronomy Dept; Founded Galileo Project; Author of "Extraterrestrial"; Former chair of Board on Physics and Astronomy',
        icon: '🔭'
      },
      {
        name: 'David Grusch',
        role: 'Intelligence Officer (NGA/NRO)',
        credentials: 'Former senior intelligence officer; Testified to Congress about recovered non-human craft; ICIG found complaint "credible and urgent"',
        icon: '🎖️'
      }
    ],
    claims: [
      { text: 'Grusch testified under oath that recovered craft are of "non-human intelligence" origin', tier: 'HIGH' },
      { text: 'Interstellar object \'Oumuamua exhibited anomalous acceleration inconsistent with natural objects', tier: 'MEDIUM' },
      { text: 'Multiple credentialed witnesses describe craft with performance exceeding human technology by centuries', tier: 'MEDIUM' }
    ],
    featuredVideo: {
      title: 'Avi Loeb on Lex Fridman Podcast',
      url: 'https://www.youtube.com/watch?v=plcc6E-E1uU',
      description: 'Discussion of Oumuamua, Galileo Project, and extraterrestrial hypothesis'
    },
    additionalVideos: [
      { title: 'Grusch Congressional Testimony', url: 'https://www.youtube.com/watch?v=KQ7Dw-739VY' },
      { title: 'Avi Loeb - Galileo Project Update', url: 'https://www.youtube.com/watch?v=bnUmhvuA2wg' }
    ]
  },
  {
    id: 7,
    title: 'Interdimensional (IDH)',
    icon: '🌀',
    gradient: 'from-violet-600 to-purple-800',
    summary: 'UAP originate from parallel dimensions or alternate realities, not outer space. Their behavior—instantaneous appearance/disappearance, reality distortion effects—is more consistent with dimensional shifting than interstellar travel. This framework connects UAP to centuries of "supernatural" encounters across cultures.',
    investmentImplications: 'Quantum Computing (dimensional modeling), Metamaterials (spacetime manipulation), Consciousness Tech (interface research), Advanced Physics (vacuum engineering).',
    figures: [
      {
        name: 'Dr. Jacques Vallée',
        role: 'Computer Scientist, Ufologist',
        credentials: 'PhD Computer Science; Former NASA/DOD consultant; Author of "Dimensions" and "Passport to Magonia"; Pioneered interdimensional hypothesis',
        icon: '💻'
      },
      {
        name: 'Dr. Hal Puthoff',
        role: 'Physicist, EarthTech International',
        credentials: 'PhD Physics Stanford; Former NSA/CIA; Founded government remote viewing program; AATIP consultant',
        icon: '⚛️'
      }
    ],
    claims: [
      { text: 'UAP behavior (instantaneous appearance/disappearance) more consistent with dimensional shift than space travel', tier: 'MEDIUM' },
      { text: 'Vallée\'s research shows UAP characteristics match historical "supernatural" encounters across cultures', tier: 'MEDIUM' },
      { text: 'Puthoff\'s "metric engineering" framework suggests manipulation of spacetime itself', tier: 'MEDIUM' },
      { text: 'Witness reports of "reality distortion" near craft suggest dimensional interface', tier: 'LOWER' }
    ],
    featuredVideo: {
      title: 'Jacques Vallée - Dimensions of the Phenomenon',
      url: 'https://www.youtube.com/watch?v=FslxSrzI-oc',
      description: 'Vallée discusses the interdimensional hypothesis and historical patterns'
    },
    additionalVideos: [
      { title: 'Hal Puthoff - Metric Engineering', url: 'https://www.youtube.com/watch?v=pPAXBgUAr_o' },
      { title: 'Vallée - Passport to Magonia Discussion', url: 'https://www.youtube.com/watch?v=WfbMxWlx2Rs' }
    ]
  },
  {
    id: 8,
    title: 'Cryptoterrestrial',
    icon: '🏠',
    gradient: 'from-teal-600 to-cyan-800',
    summary: 'UAP originate from hidden Earth-based civilizations—underwater, underground, or otherwise concealed from human detection. The high proportion of transmedium (air-to-water) UAP reports and persistent USO (Unidentified Submerged Object) sightings suggest an oceanic origin. A 2024 Harvard paper formally proposes this hypothesis for academic consideration.',
    investmentImplications: 'Ocean Exploration (deep sea tech, AUVs), Underwater Sensing (sonar, hydrophones), Marine Mining (strategic minerals), Submarine Tech (advanced propulsion).',
    figures: [
      {
        name: 'Tim Gallaudet',
        role: 'Rear Admiral USN (Ret.)',
        credentials: 'Former NOAA Administrator; Co-authored Harvard cryptoterrestrial paper (2024); Oceanographer',
        icon: '⚓'
      },
      {
        name: 'Dr. Mac Tonnies',
        role: 'Author, Researcher (deceased)',
        credentials: 'Coined term "cryptoterrestrial"; Author of "The Cryptoterrestrials"; Pioneered indigenous NHI hypothesis',
        icon: '📖'
      }
    ],
    claims: [
      { text: 'Harvard paper (Gallaudet co-author) formally proposes cryptoterrestrial hypothesis for academic consideration', tier: 'MEDIUM' },
      { text: '50%+ of UAP reports involve transmedium (air-to-water) capability suggesting ocean origin', tier: 'MEDIUM' },
      { text: 'USO (Unidentified Submerged Object) reports predate modern aviation', tier: 'MEDIUM' },
      { text: 'Alleged underwater bases (e.g., Catalina Island, Puerto Rico Trench) cited by multiple witnesses', tier: 'LOWER' }
    ],
    featuredVideo: {
      title: 'Tim Gallaudet - USO Evidence',
      url: 'https://www.youtube.com/watch?v=rYkGBiyXgD4',
      description: 'Rear Admiral Gallaudet discusses underwater UAP encounters'
    },
    additionalVideos: [
      { title: 'Gallaudet - Harvard Cryptoterrestrial Paper', url: 'https://www.youtube.com/watch?v=1QJH_b5NYwo' },
      { title: 'USO Compilation - Historical Cases', url: 'https://www.youtube.com/watch?v=AXJb_R5jBQs' }
    ]
  }
];

export const comparisonMatrix = {
  headers: ['Feature', 'Ancient Tech', 'Time Travel', 'Orbital Grid', 'Multi-Species', 'Religious', 'ETH', 'IDH', 'Crypto'],
  rows: [
    {
      feature: 'Origin',
      values: ['Ancient Earth', 'Future Earth', 'Earth Orbit', 'Interstellar', 'Metaphysical', 'Other Stars', 'Parallel Dims', 'Hidden Earth']
    },
    {
      feature: 'Nature',
      values: ['AI/Automated', 'Human Desc.', 'Defense Grid', 'Bio Entities', 'NHI/Teachers', 'Bio/AI', 'Unknown', 'Unknown']
    },
    {
      feature: 'Intent',
      values: ['Dormant', 'Study/Harvest', 'Monitoring', 'Obs./Hybrid', 'Guidance', 'Observation', 'Unknown', 'Coexistence']
    },
    {
      feature: 'Evidence',
      values: ['Sensor Data', 'Anatomy', 'Photo Plates', 'Materials', 'Archives', 'Testimony', 'Behavior', 'Transmedium']
    },
    {
      feature: 'Key Market',
      values: ['Defense/AI', 'Biotech', 'Space/SETI', 'Materials', 'Human Perf.', 'Space/SETI', 'Quantum', 'Ocean Tech']
    }
  ]
};
