import { HistoricalExample } from "./HistoricalExampleCard";

export const manhattanProject: HistoricalExample = {
  id: "manhattan",
  title: "The Manhattan Project (1942-1945)",
  subtitle: "How 120,000 workers kept the biggest secret in history",
  badge: "DECLASSIFIED PRECEDENT",
  groundTruth: [
    "$2 billion project (~$30-60B today)",
    "120,000+ workers across multiple states",
    "Development of world's first nuclear weapons",
    "3+ years of active development",
    "Research facilities at Los Alamos, Oak Ridge, Hanford",
  ],
  filter: [
    "Compartmentalization: Workers didn't know what they built",
    "Executive Exclusion: VP Truman not informed for 82 days",
    "Congressional Concealment: Only 7 leaders knew",
    'Cover Stories: Trinity test called "ammunition dump explosion"',
    'Senator Truman\'s committee told to "just leave that alone"',
    "Funding buried in appropriations bills",
  ],
  assumptions: [
    { assumption: "A project this big couldn't stay secret", reality: "120,000 workers, 3+ years—stayed secret" },
    { assumption: "The Vice President would know", reality: "Truman learned only after becoming President" },
    { assumption: "Congress would be informed", reality: "Only 7 leaders knew; others voted funding blindly" },
    { assumption: "Journalists would uncover it", reality: "Tight OpSec + wartime censorship" },
  ],
  immersionScenarios: [
    {
      title: "Put Yourself in April 1945 (VP Truman)",
      icon: "🎖️",
      content: `Imagine you are Vice President Harry Truman on April 12, 1945.

You have just been told that President Roosevelt is dead. You are now the President of the United States. You're dealing with a world war on two fronts, millions of American troops deployed, the most important decisions in human history.

What you DON'T know:
• Your government has been building weapons that can destroy entire cities
• 120,000 Americans have been working on this for 3+ years
• $2 billion has been spent—more than any project in history
• Your predecessor never told you
• Congress didn't tell you
• The military didn't tell you
• The press didn't tell you

Your assumption was: As Vice President, I know what's happening.

The reality was: You knew almost nothing about the most important program in the country.`,
      keyQuestion: "If the Vice President of the United States could be kept ignorant of the Manhattan Project while it was actively producing weapons, what might you be kept ignorant of today?",
    },
    {
      title: "Put Yourself as the Oversight Chairman (Senator Truman 1943)",
      icon: "🏛️",
      content: `Put yourself as Senator Harry Truman in 1943. You chair the Senate Special Committee to Investigate the National Defense Program. Your job is literally to find waste and fraud in military spending.

Your investigators discover:
• Massive unexplained construction in Washington State
• Billions of dollars in unaccounted spending
• Thousands of workers on mysterious projects

You're about to investigate. Then you receive a message:

Secretary of War Stimson asks you to "just leave that alone."

Your decision: You comply. You stop investigating.

Why? You trust that if it's secret, it must be important. You assume you'd be told if you needed to know. You believe the system is working as intended.

What you didn't know: You were protecting a program you weren't allowed to know about. Your own oversight committee was being redirected. The system was specifically designed to work around you.`,
      keyQuestion: 'How many times has Congressional oversight been redirected with phrases like "national security" or "need to know"? How would Congress know what they\'re not being told?',
    },
  ],
};

export const ghostArmy: HistoricalExample = {
  id: "ghost-army",
  title: "Operation Fortitude & The Ghost Army (1944)",
  subtitle: "How inflatable tanks fooled Nazi intelligence for 7 weeks",
  badge: "DECLASSIFIED DECEPTION",
  groundTruth: [
    "Real invasion target: Normandy, June 6, 1944",
    "156,000 troops for actual D-Day landing",
    "Months of genuine preparation",
    "23rd Headquarters Special Troops (1,100 men)",
  ],
  filter: [
    "FUSAG: Entire fake army created (First U.S. Army Group)",
    "Inflatable tanks, trucks, planes (93 lbs each, carried by 4 men)",
    "Fake radio traffic scripted as theater",
    'General Patton publicly "commanding" the phantom force',
    "Double agents feeding false intel (Agent Garbo)",
    "Fake military buildings, dummy landing craft",
    "Fake laundry on clotheslines for aerial recon",
  ],
  assumptions: [
    { assumption: "Patton wouldn't command a fake army", reality: "He did—it was the most feared name" },
    { assumption: "We'd spot fake equipment from recon", reality: "Inflatables fooled aerial photography" },
    { assumption: "Radio intercepts reveal truth", reality: "Traffic was scripted performance" },
    { assumption: "Calais is the obvious target", reality: "Obvious ≠ correct" },
    { assumption: "Our spy network would know", reality: "Double agents fed false intel" },
  ],
  keyInsight: "Even AFTER D-Day began, Hitler held back reinforcements for 7 WEEKS, believing Normandy was a feint. Trained military intelligence, with every analytical tool, was systematically deceived.",
  immersionScenarios: [
    {
      title: "Put Yourself in German Intelligence, June 1944",
      icon: "📡",
      content: `You are a German intelligence officer. You have:
• The best aerial reconnaissance in Europe
• A network of spies
• Radio intercept capabilities
• 4 years of experience analyzing Allied movements

You have been tracking the Allied buildup for months. You know:
• General Patton is commanding a massive army in Southeast England
• Thousands of tanks, trucks, and planes are visible
• Radio traffic confirms large-scale operations
• The logical target is Pas-de-Calais (shortest crossing)

What you DON'T know:
• The tanks are inflatable rubber—93 pounds each
• Four men can pick them up and carry them
• The radio traffic is scripted theater
• Patton is commanding nothing
• The entire army doesn't exist

On June 6, 1944, the invasion begins... at Normandy.

Your commander asks: "Is this the real invasion or a feint?"

You confidently answer: "This must be a feint. Patton's army is still in position for Calais. The real invasion is coming."

THE CONSEQUENCE: For SEVEN WEEKS after D-Day, German reinforcements were held back from Normandy—waiting for an invasion that would never come. By then, it was too late.`,
      keyQuestion: "If trained military intelligence professionals, with every analytical tool available, could be systematically deceived by inflatable tanks and fake radio traffic, what might we be missing today?",
    },
  ],
};

export const condonScenario = {
  title: "Put Yourself in 1970 (Graduate Student)",
  icon: "🎓",
  content: `You are a physics graduate student. You've heard about UFO sightings—intriguing, but probably nothing. Then you read the 1969 Condon Report, the official Air Force-commissioned study:

"[N]othing has come from the study of UFOs in the past 21 years that has added to scientific knowledge..."

The report concludes:

"...scientists and educators should strongly recommend that teachers refrain from giving students credit for work on UFO-related science fair projects."

Your career calculation:
• Established scientists say there's nothing here
• Working on this topic could hurt your career
• No one is getting grants for UFO research
• Colleagues will think you're not serious

Your decision: Stay away from this topic. Focus on "real" science.

What you didn't know: The Robertson Panel (CIA, 1953) had explicitly recommended: "...a public education campaign should be undertaken in order to reduce public interest in the subject."

The stigma wasn't accidental—it was DESIGNED. Your career instincts were being exploited as a control mechanism.`,
  keyQuestion: "How many other topics have been systematically removed from legitimate inquiry through coordinated stigma campaigns? How would you know?",
};
