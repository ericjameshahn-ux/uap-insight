// Static figures data for use when Supabase is not connected
// This supplements the database with key historical and current figures

export interface StaticFigure {
  id: string;
  name: string;
  role: string;
  credentials: string;
  clearances?: string;
  tier: string;
  bio: string;
  videoUrls?: { title: string; url: string }[];
}

export const staticFigures: Record<string, StaticFigure> = {
  'harry-truman': {
    id: 'harry-truman',
    name: 'Harry S. Truman',
    role: 'Vice President & 33rd President of the United States',
    credentials: 'Senator, VP, President (1945-1953)',
    tier: 'HISTORICAL',
    bio: 'Harry Truman served as Vice President for only 82 days before becoming President upon FDR\'s death. Despite being VP, he was never informed about the Manhattan Project—the largest and most expensive secret program in U.S. history. He only learned of the atomic bomb after becoming President, demonstrating how even the highest officials can be kept out of compartmentalized programs.',
  },
  'george-patton': {
    id: 'george-patton',
    name: 'General George S. Patton',
    role: 'U.S. Army General, WWII Commander',
    credentials: 'Four-star General, Commander of Third Army',
    tier: 'HISTORICAL',
    bio: 'During Operation Fortitude, General Patton was publicly assigned to command FUSAG (First United States Army Group)—an entirely fictional army. German intelligence believed Patton, the most feared Allied general, would lead the main invasion at Pas-de-Calais. This deception kept German reinforcements away from Normandy for seven weeks after D-Day.',
  },
  'bill-nelson': {
    id: 'bill-nelson',
    name: 'Bill Nelson',
    role: 'NASA Administrator',
    credentials: 'Former U.S. Senator, Astronaut (STS-61-C)',
    clearances: 'Top Secret/SCI (former)',
    tier: 'HIGHEST',
    bio: 'Bill Nelson is the current NASA Administrator and former U.S. Senator from Florida. After receiving classified UAP briefings, he stated: "The hair stood up on the back of my neck" and confirmed NASA is actively investigating UAP. His statements carry significant weight given his access to classified intelligence and scientific expertise.',
    videoUrls: [
      { title: 'Bill Nelson on UAP Briefings', url: 'https://www.youtube.com/watch?v=example1' }
    ]
  },
  'john-ratcliffe': {
    id: 'john-ratcliffe',
    name: 'John Ratcliffe',
    role: 'Former Director of National Intelligence',
    credentials: 'DNI (2020-2021), Former U.S. Representative',
    clearances: 'Top Secret/SCI, SAP access',
    tier: 'HIGHEST',
    bio: 'John Ratcliffe served as the Director of National Intelligence under President Trump. He has stated publicly that UAP represent technology that "frankly engages in actions that are difficult to explain" and that "there are technologies that we don\'t have and frankly that we are not capable of defending against." His position gave him access to the most classified UAP intelligence.',
    videoUrls: [
      { title: 'Ratcliffe on Fox News discussing UAP', url: 'https://www.youtube.com/watch?v=example2' }
    ]
  },
  'david-grusch': {
    id: 'david-grusch',
    name: 'David Grusch',
    role: 'Former Intelligence Officer, UAP Whistleblower',
    credentials: 'NGA, NRO, UAP Task Force, AARO',
    clearances: 'Top Secret/SCI, SAP access',
    tier: 'HIGHEST',
    bio: 'David Grusch is a former intelligence officer who served on the UAP Task Force and worked with AARO. His complaint to the Intelligence Community Inspector General (ICIG) was found "credible and urgent." He testified before Congress that the U.S. has recovered "non-human origin technical vehicles" and "non-human biologics." His testimony is DOPSR-cleared, meaning it was reviewed and approved for public release by the Department of Defense.',
    videoUrls: [
      { title: 'Congressional Testimony (July 2023)', url: 'https://www.youtube.com/watch?v=example3' },
      { title: 'NewsNation Interview', url: 'https://www.youtube.com/watch?v=example4' }
    ]
  },
  'dillon-guthrie': {
    id: 'dillon-guthrie',
    name: 'Dillon Guthrie',
    role: 'Attorney, Legal Analyst',
    credentials: 'Yale Law School Presenter',
    tier: 'HIGH',
    bio: 'Dillon Guthrie is an attorney who presented detailed legal analysis at Yale in November 2025. His key finding: "No person has ever been prosecuted for disclosing classified information to Congress in private." This analysis demonstrates that many perceived legal barriers to disclosure are based on fear rather than actual prosecution risk, and that constitutional protections for Congressional testimony are robust.',
    videoUrls: [
      { title: 'Yale Presentation on UAP Disclosure Law', url: 'https://www.youtube.com/watch?v=example5' }
    ]
  },
  'chris-mellon': {
    id: 'chris-mellon',
    name: 'Christopher Mellon',
    role: 'Former Deputy Assistant Secretary of Defense for Intelligence',
    credentials: 'DASD Intelligence, Senate Intelligence Committee Staff',
    clearances: 'Top Secret/SCI, SAP access',
    tier: 'HIGHEST',
    bio: 'Chris Mellon served as Deputy Assistant Secretary of Defense for Intelligence under Clinton and Bush. He was instrumental in getting the 2017 New York Times UAP story published and has been a key advocate for disclosure. He leaked the "Gimbal" and "Go Fast" Navy UAP videos to the press and has testified that legacy UAP programs exist outside normal oversight.',
    videoUrls: [
      { title: 'Mellon on 60 Minutes', url: 'https://www.youtube.com/watch?v=example6' }
    ]
  },
  'daniel-sheehan': {
    id: 'daniel-sheehan',
    name: 'Daniel Sheehan',
    role: 'Constitutional Attorney',
    credentials: 'Harvard Law, Pentagon Papers, Iran-Contra, Karen Silkwood case',
    tier: 'HIGH',
    bio: 'Daniel Sheehan is a constitutional attorney with a history of major cases including the Pentagon Papers, Iran-Contra, and the Karen Silkwood case. He serves as legal counsel to UAP whistleblowers and has presented detailed analysis of the "Breakaway Hypothesis"—the theory that a faction within the national security state has operated UAP programs outside constitutional oversight since the 1940s.',
    videoUrls: [
      { title: 'Sheehan on the Breakaway Civilization', url: 'https://www.youtube.com/watch?v=example7' }
    ]
  },
  'james-lacatski': {
    id: 'james-lacatski',
    name: 'Dr. James Lacatski',
    role: 'Former DIA Intelligence Officer',
    credentials: 'Defense Intelligence Agency, AAWSAP Program Manager',
    clearances: 'Top Secret/SCI',
    tier: 'HIGHEST',
    bio: 'Dr. James Lacatski was the program manager for AAWSAP (Advanced Aerospace Weapon System Applications Program) at the Defense Intelligence Agency. His book "Skinwalkers at the Pentagon" (DOPSR-cleared) contains the statement that the U.S. possesses "craft of unknown origin." This is significant because DOPSR clearance means the Pentagon reviewed and approved this statement for public release.',
    videoUrls: [
      { title: 'Lacatski Interview on AAWSAP', url: 'https://www.youtube.com/watch?v=example8' }
    ]
  },
  'luis-elizondo': {
    id: 'luis-elizondo',
    name: 'Luis Elizondo',
    role: 'Former AATIP Director',
    credentials: 'Army Counterintelligence, AATIP, Pentagon',
    clearances: 'Top Secret/SCI, SAP access',
    tier: 'HIGHEST',
    bio: 'Luis Elizondo is a former Army counterintelligence officer who claims to have directed AATIP (Advanced Aerospace Threat Identification Program) at the Pentagon. He resigned in 2017 in protest of excessive secrecy. His book "Imminent" details his experiences and introduces the concept of a "sixth observable"—biological effects on witnesses. He has been a key figure in bringing UAP into mainstream discourse.',
    videoUrls: [
      { title: 'Elizondo on 60 Minutes', url: 'https://www.youtube.com/watch?v=example9' },
      { title: 'Theories of Everything Interview', url: 'https://www.youtube.com/watch?v=example10' }
    ]
  }
};

// Helper to find a figure by name (case-insensitive partial match)
export function findFigureByName(name: string): StaticFigure | undefined {
  const nameLower = name.toLowerCase();
  return Object.values(staticFigures).find(
    f => f.name.toLowerCase().includes(nameLower) || nameLower.includes(f.name.toLowerCase().split(' ')[1] || '')
  );
}
