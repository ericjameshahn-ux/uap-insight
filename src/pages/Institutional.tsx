import { InstitutionalHierarchy } from "@/components/institutional/InstitutionalHierarchy";
import { ClassificationPyramid } from "@/components/institutional/ClassificationPyramid";
import { ContractorCard } from "@/components/institutional/ContractorCard";
import { RevolvingDoorTimeline } from "@/components/institutional/RevolvingDoorTimeline";
import { AlertTriangle } from "lucide-react";

const sampleContractors = [
  {
    name: "Lockheed Martin",
    tier: "HIGH" as const,
    description: "World's largest defense contractor. Skunk Works division pioneered stealth technology.",
    uapRelevance: "Named repeatedly by whistleblowers. Ben Rich alleged 'ET technology.' Houses multiple unacknowledged SAPs.",
    knownSaps: "Stealth aircraft, hypersonics, space systems",
    headquarters: "Bethesda, MD"
  },
  {
    name: "Northrop Grumman",
    tier: "HIGH" as const,
    description: "B-2 Spirit, B-21 Raider. Deep black programs spanning decades.",
    uapRelevance: "Alleged to hold 'recovered materials' programs. Multiple whistleblower references.",
    knownSaps: "Advanced aerospace, directed energy",
    headquarters: "Falls Church, VA"
  },
  {
    name: "Battelle Memorial Institute",
    tier: "MEDIUM" as const,
    description: "Research nonprofit managing national labs. Memory metals research.",
    uapRelevance: "Allegedly analyzed Roswell materials. Nitinol (memory metal) development timeline suspicious.",
    knownSaps: "Materials science, metallurgy",
    headquarters: "Columbus, OH"
  }
];

const sampleTimeline = {
  figureName: "James Woolsey",
  affiliations: [
    { organization: "U.S. Army", role: "Captain", startYear: 1968, endYear: 1970, isGovernment: true },
    { organization: "Senate Armed Services Committee", role: "General Counsel", startYear: 1970, endYear: 1973, isGovernment: true },
    { organization: "CIA", role: "Director", startYear: 1993, endYear: 1995, isGovernment: true },
    { organization: "Booz Allen Hamilton", role: "VP", startYear: 2002, endYear: 2008, isGovernment: false },
    { organization: "Lux Capital", role: "Venture Partner", startYear: 2016, endYear: null, isGovernment: false }
  ]
};

export default function InstitutionalPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-900 to-background py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            The Classified Aerospace Ecosystem
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Understanding the institutional infrastructure enabling unacknowledged programs
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">The Structure of Secrecy</h2>
            <p className="text-muted-foreground mb-4">
              The U.S. classified aerospace apparatus is not merely a government operation
              but a symbiosis of Executive Agencies, FFRDCs, and Prime Contractors.
            </p>
            <p className="text-muted-foreground">
              While oversight bodies exist, the mechanism of "Waived" Special Access Programs
              often creates accountability gaps, shielding operations from standard review.
            </p>
          </div>
          <InstitutionalHierarchy />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">The Security Apparatus</h2>
            <p className="text-muted-foreground mb-6">
              Security is not just about fences—it's about information compartmentalization.
              The system ensures individuals only know specific "slices" of a program.
            </p>

            <div className="space-y-4">
              <div className="flex gap-3 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-100" />
                </div>
                <div>
                  <h4 className="font-semibold text-red-300">Waived SAP</h4>
                  <p className="text-sm text-red-200/70">
                    Exempt from standard reporting. Existence denied. Limited to Gang of Eight.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 bg-orange-900/20 border border-orange-500/30 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-sm font-bold text-orange-100">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-orange-300">Acknowledged SAP</h4>
                  <p className="text-sm text-orange-200/70">
                    Existence known, details classified. "Black programs" with public names.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <ClassificationPyramid />
        </div>

        {/* Prime Contractors Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Prime Contractors</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            Private corporations that execute classified programs. These companies hold their own SAPs
            and employ the majority of cleared personnel working on advanced aerospace.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleContractors.map((contractor) => (
              <ContractorCard key={contractor.name} {...contractor} />
            ))}
          </div>
        </div>

        {/* Revolving Door Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">The Revolving Door</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            Career paths frequently alternate between government positions and private sector roles,
            creating networks of influence that span both worlds.
          </p>
          <div className="max-w-2xl">
            <RevolvingDoorTimeline {...sampleTimeline} />
          </div>
        </div>
      </div>
    </div>
  );
}
