// Reference data for citations and source links throughout the app

export interface Reference {
  id: string;
  title: string;
  source: string;
  url?: string;
  date?: string;
  excerpt?: string;
  internalSection?: string;
}

export const references: Record<string, Reference> = {
  // Legal & Statutory References
  'usc-3373': {
    id: 'usc-3373',
    title: '50 U.S.C. § 3373 - Unidentified Anomalous Phenomena',
    source: 'U.S. Code',
    url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title50-section3373',
    excerpt: 'Establishes AARO duties including requirement to "evaluate any threat posed by unidentified anomalous phenomena."',
    internalSection: 'f'
  },
  'schumer-amendment': {
    id: 'schumer-amendment',
    title: 'UAP Disclosure Act of 2023 (S.Amdt.797)',
    source: 'U.S. Senate',
    url: 'https://www.congress.gov/amendment/118th-congress/senate-amendment/797',
    date: '2023',
    excerpt: 'Included eminent domain provisions for "recovered technologies of unknown origin" held by private entities. Key provisions stripped by aerospace lobbying.',
    internalSection: 'f'
  },
  'gravel-v-us': {
    id: 'gravel-v-us',
    title: 'Gravel v. United States, 408 U.S. 606 (1972)',
    source: 'Supreme Court',
    url: 'https://supreme.justia.com/cases/federal/us/408/606/',
    date: '1972',
    excerpt: 'Established Speech or Debate Clause immunity for Congressional activities, protecting legislators from prosecution for legislative acts.',
  },
  
  // Government Reports & Documents
  'dod-ig-aaro': {
    id: 'dod-ig-aaro',
    title: 'DoD IG Evaluation of AARO Operations',
    source: 'Department of Defense Inspector General',
    url: 'https://www.dodig.mil/reports.html',
    date: '2024',
    excerpt: 'Found concerns regarding information sharing and coordination between AARO and other DoD components.',
    internalSection: 'f'
  },
  'robertson-panel': {
    id: 'robertson-panel',
    title: 'Robertson Panel Report (Durant Report)',
    source: 'Central Intelligence Agency',
    url: 'https://www.cia.gov/readingroom/',
    date: '1953',
    excerpt: 'CIA scientific panel recommended "public education campaign to reduce public interest" in UFOs, including use of Disney and celebrities for debunking.',
    internalSection: 'f'
  },
  'condon-report': {
    id: 'condon-report',
    title: 'Scientific Study of Unidentified Flying Objects (Condon Report)',
    source: 'University of Colorado / USAF',
    url: 'https://files.ncas.org/condon/',
    date: '1969',
    excerpt: 'Concluded UFO study had "not added to scientific knowledge" and recommended teachers "refrain from giving students credit" for UFO-related work.',
    internalSection: 'f'
  },
  'twining-memo': {
    id: 'twining-memo',
    title: 'Twining Memo (AMC Opinion Concerning "Flying Discs")',
    source: 'Air Materiel Command',
    date: 'September 23, 1947',
    excerpt: 'General Nathan Twining stated the phenomenon is "real and not visionary or fictitious" with objects showing "extreme rates of climb."',
    internalSection: 'd'
  },
  
  // Financial & Oversight
  'fasab-56': {
    id: 'fasab-56',
    title: 'FASAB Statement of Federal Financial Accounting Standards 56',
    source: 'Federal Accounting Standards Advisory Board',
    url: 'https://fasab.gov/accounting-standards/authoritative-source-of-gaap/',
    date: '2018',
    excerpt: 'Allows federal agencies to "misrepresent" financial statements for national security purposes, creating mechanism for hiding program funding.',
    internalSection: 'h'
  },
  'skidmore-adjustments': {
    id: 'skidmore-adjustments',
    title: '$21 Trillion in Unsupported Adjustments',
    source: 'Dr. Mark Skidmore, Michigan State University',
    url: 'https://missingmoney.solari.com/',
    date: '2017-2019',
    excerpt: 'Academic research documenting trillions in unsupported accounting adjustments at DoD and HUD, raising questions about off-books programs.',
    internalSection: 'h'
  },
  
  // Key Figure Statements
  'nelson-quote': {
    id: 'nelson-quote',
    title: 'NASA Administrator Bill Nelson on UAP',
    source: 'Multiple interviews',
    date: '2021-2023',
    excerpt: '"The hair stood up on the back of my neck" after receiving classified UAP briefings. Confirmed NASA actively investigating.',
    internalSection: 'a'
  },
  'ratcliffe-quote': {
    id: 'ratcliffe-quote',
    title: 'DNI John Ratcliffe on UAP',
    source: 'Fox News / Maria Bartiromo',
    url: 'https://www.foxnews.com/',
    date: 'March 2021',
    excerpt: '"Technologies that we don\'t have and frankly that we are not capable of defending against."',
    internalSection: 'a'
  },
  'grusch-testimony': {
    id: 'grusch-testimony',
    title: 'David Grusch Congressional Testimony',
    source: 'House Oversight Committee',
    url: 'https://www.congress.gov/',
    date: 'July 26, 2023',
    excerpt: 'Under oath: U.S. has recovered "non-human origin technical vehicles" and "non-human biologics." ICIG found complaint "credible and urgent."',
    internalSection: 'g'
  },
  'lacatski-dopsr': {
    id: 'lacatski-dopsr',
    title: '"Craft of Unknown Origin" Statement',
    source: 'Skinwalkers at the Pentagon (DOPSR-cleared)',
    date: '2021',
    excerpt: 'Pentagon-reviewed statement confirming U.S. possession of "craft of unknown origin" - approved for public release.',
    internalSection: 'g'
  },
  'guthrie-yale': {
    id: 'guthrie-yale',
    title: 'Legal Analysis of UAP Disclosure Barriers',
    source: 'Yale Law School Presentation',
    date: 'November 20, 2025',
    excerpt: '"No person has ever been prosecuted for disclosing classified information to Congress in private."',
    internalSection: 'f'
  },
  
  // Incidents & Evidence
  'nimitz-encounter': {
    id: 'nimitz-encounter',
    title: 'USS Nimitz "Tic Tac" Encounter',
    source: 'Navy pilots, radar operators, official acknowledgment',
    date: 'November 2004',
    excerpt: 'Multiple Navy personnel observed object demonstrating instantaneous acceleration, transmedium travel. Radar tracked descent from 28,000 ft to sea level in ~0.78 seconds.',
    internalSection: 'c'
  },
  
  // Lobbying & Opposition
  'aerospace-lobby': {
    id: 'aerospace-lobby',
    title: 'Aerospace Industry Opposition to UAP Disclosure',
    source: 'Congressional reporting, Politico, The Hill',
    date: '2023',
    excerpt: 'Defense contractors lobbied against eminent domain and disclosure provisions in UAP legislation. Key provisions stripped from final NDAA.',
    internalSection: 'f'
  }
};

// Helper to get a reference by ID
export function getReference(id: string): Reference | undefined {
  return references[id];
}
