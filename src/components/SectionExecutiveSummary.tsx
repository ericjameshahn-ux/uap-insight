import { Lightbulb, MessageCircle } from "lucide-react";

interface SectionSummaryData {
  summary: string;
  bestQuestion: string;
}

const sectionSummaries: Record<string, SectionSummaryData> = {
  a: {
    summary: "The U.S. government has officially shifted from a stance of denial to acknowledgment, confirming that UAP are real physical objects requiring scientific study. This shift is evidenced by the establishment of the All-domain Anomaly Resolution Office (AARO), the passage of the UAP Disclosure Act provisions in the NDAA, and on-record statements from senior officials like Senate Majority Leader Chuck Schumer and Senator Marco Rubio regarding credible allegations of withheld information.",
    bestQuestion: "What specific legislation and official government statements since 2017 confirm the U.S. government no longer views UAP as a fringe topic?"
  },
  b: {
    summary: "UAP are not merely visual anomalies or sensor glitches; they have been registered simultaneously across multiple independent sensor platforms (radar, infrared, electro-optical) and by credible eyewitnesses. The 2004 USS Nimitz and 2015 USS Theodore Roosevelt incidents provide verified military data of objects tracking on Aegis radar while being visually engaged by pilots, confirming they are physical craft.",
    bestQuestion: "What specific multi-sensor data (radar, video, visual) corroborates the USS Nimitz and USS Theodore Roosevelt encounters?"
  },
  c: {
    summary: "Documented UAP exhibit the 'Five Observables'—instantaneous acceleration, hypersonic velocity without signatures, low observability, transmedium travel, and positive lift without flight surfaces—which defy current aerodynamic models. These capabilities suggest a mastery of 'metric engineering' or inertial mass reduction, allowing craft to manipulate the spacetime metric rather than relying on conventional propulsion.",
    bestQuestion: "How do the 'Five Observables' identified by AATIP challenge our current understanding of inertia and aerodynamics?"
  },
  d: {
    summary: "The UAP phenomenon is not modern; government interest dates back to at least World War II (Foo Fighters) and the 1947 Twining Memo, which classified 'flying discs' as real. Historical investigations like Project Blue Book and the Robertson Panel were largely designed to manage public perception and 'debunk' sightings to prevent mass hysteria, while serious cases were routed to classified channels.",
    bestQuestion: "What do documents like the Twining Memo and the Bolender Memo reveal about the military's private assessment of UFOs versus their public stance?"
  },
  e: {
    summary: "UAP incidents are global, with significant cases documented in Italy (1933), Brazil (1996), and the Soviet Union, indicating a worldwide presence. The 1996 Varginha incident serves as a critical case study of a multinational crash retrieval operation involving biological entities, with alleged U.S. military involvement in the extraction.",
    bestQuestion: "What details does the Varginha, Brazil incident provide about international crash retrieval operations and U.S. involvement?"
  },
  f: {
    summary: "Whistleblowers allege that a 'Legacy Program' managing UAP materials is hidden within Waived Special Access Programs (USAPs) and protected by the Atomic Energy Act of 1954 to evade standard oversight. Reports describe specific programs like 'Immaculate Constellation' that allegedly utilize AI to quarantine UAP surveillance data from the broader military enterprise.",
    bestQuestion: "How are the Atomic Energy Act and 'Waived SAPs' allegedly used to hide UAP programs from Congressional oversight?"
  },
  g: {
    summary: "High-ranking officials and program managers have stated that the U.S. possesses craft of unknown origin; specifically, Dr. James Lacatski (DIA) confirmed in a DoD-cleared book that the U.S. has accessed the interior of a craft with no engine or fuel tanks. David Grusch testified under oath that the U.S. has a multi-decade crash retrieval program that has recovered 'non-human biologics'.",
    bestQuestion: "What specific claims have Dr. James Lacatski and David Grusch made regarding the possession and interior conditions of recovered non-human craft?"
  },
  h: {
    summary: "The secrecy regime utilizes 'IRAD' (Independent Research and Development) funding to bury UAP reverse-engineering costs within corporate overhead, shielding them from audit. This structure privatizes the technology, keeping it out of the public domain to maintain a geopolitical advantage and avoid the 'ontological shock' of disclosure.",
    bestQuestion: "How is Independent Research and Development (IRAD) funding allegedly used to conceal UAP reverse-engineering programs within private aerospace companies?"
  },
  i: {
    summary: "The phenomenon exhibits a 'psychotronic' or cognitive interface, where pilots reportedly control craft via thought (consciousness interaction) rather than physical controls. Researchers suggest a link between quantum mechanics and consciousness (e.g., Orch-OR theory), and programs like AAWSAP investigated the 'Hitchhiker Effect,' where paranormal activity follows investigators home.",
    bestQuestion: "What evidence suggests a link between human consciousness, the 'Hitchhiker Effect,' and the control systems of UAP?"
  },
  j: {
    summary: "Theoretical models such as the 'Pais Effect' (inertial mass reduction via high-energy electromagnetic fields) and the 'Polarizable Vacuum' (metric engineering) offer a physics-based explanation for UAP capabilities. Patents filed by the U.S. Navy describe craft that can manipulate the quantum vacuum to reduce inertia, though practical application remains constrained by engineering limits.",
    bestQuestion: "Can you explain the 'Pais Effect' and how it theoretically allows for inertial mass reduction and transmedium travel?"
  },
  k: {
    summary: "Medical studies of UAP experiencers have identified specific physiological effects, including radiation burns and a structural anomaly in the brain's caudate-putamen region. The 1996 Varginha incident includes testimony of a lethal biological threat that killed a military police officer, suggesting distinct 'biodefense' implications.",
    bestQuestion: "What physiological effects and brain anomalies did Dr. Garry Nolan identify in patients who had close encounters with UAP?"
  },
  l: {
    summary: "The study of UAP is driving investment into 'adjacent' frontier technologies such as metamaterials (terahertz waveguides), compact fusion, and quantum sensing. Financial analysts identify a potential multi-trillion-dollar market impact if technologies related to vacuum energy or inertial mass reduction are commercialized.",
    bestQuestion: "What specific 'adjacent technologies' derived from UAP research are currently attracting private capital investment?"
  },
  m: {
    summary: "Disclosure represents a 'paradigm shift' fraught with risks of 'ontological shock,' economic disruption, and geopolitical instability. Organizations like the Sol Foundation are developing policy frameworks to manage a 'controlled disclosure' to prevent catastrophic societal collapse and integrate the reality of Non-Human Intelligence.",
    bestQuestion: "What is 'Ontological Shock,' and how does the Sol Foundation propose managing the societal impact of UAP disclosure?"
  },
  n: {
    summary: "Multiple competing hypotheses attempt to explain UAP origins: extraterrestrial visitors, interdimensional beings, time travelers, ancient breakaway civilizations, or advanced human black projects. Credentialed researchers increasingly favor non-binary frameworks where multiple explanations may coexist.",
    bestQuestion: "Which UAP origin hypotheses have the most supporting testimony from credentialed sources, and which have the strongest counter-arguments?"
  }
};

interface SectionExecutiveSummaryProps {
  sectionId: string;
}

export function SectionExecutiveSummary({ sectionId }: SectionExecutiveSummaryProps) {
  const data = sectionSummaries[sectionId.toLowerCase()];
  if (!data) return null;

  return (
    <div className="mb-6 animate-fade-in">
      <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 rounded-xl p-5 border border-amber-200 dark:border-amber-800/50 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-amber-400/20 dark:bg-amber-400/10 rounded-lg flex-shrink-0">
            <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="space-y-3 min-w-0">
            <div>
              <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-2">
                Key Insight
              </h3>
              <p className="text-sm text-amber-950 dark:text-amber-100 leading-relaxed">
                {data.summary}
              </p>
            </div>
            
            <div className="pt-2 border-t border-amber-200/50 dark:border-amber-700/50">
              <div className="flex items-start gap-2">
                <MessageCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  <span className="font-medium">Best research question:</span>{" "}
                  <span className="italic">"{data.bestQuestion}"</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
