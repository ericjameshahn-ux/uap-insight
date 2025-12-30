import { useState } from "react";
import { 
  Shield, 
  Eye, 
  Scale, 
  FileText, 
  Users, 
  AlertTriangle,
  ChevronDown,
  ExternalLink,
  Lock,
  Building2,
  Gavel
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const sections = [
  {
    id: "classification",
    icon: Lock,
    title: "Classification Basics",
    subtitle: "EO 13526 vs. Atomic Energy Act",
    content: {
      overview: "The U.S. classification system operates under two parallel authorities: Executive Order 13526 (national security) and the Atomic Energy Act (nuclear/RD information). Understanding this duality is crucial because UAP-related programs may fall under either or both.",
      keyPoints: [
        {
          title: "Executive Order 13526",
          description: "Governs classification of national security information. Defines three levels: Confidential, Secret, Top Secret. Information must meet specific criteria for each level."
        },
        {
          title: "Atomic Energy Act (1954)",
          description: "Creates a separate classification system for nuclear information (Restricted Data/Formerly Restricted Data). Uniquely, information is 'born classified' under this act."
        },
        {
          title: "Dual-Track Problem",
          description: "Programs involving both national security AND nuclear information can fall under both authorities, creating jurisdictional complexity that complicates oversight."
        }
      ],
      implication: "If UAP technology involves nuclear components or energy, it may be classified under the Atomic Energy Act—exempt from normal declassification procedures."
    }
  },
  {
    id: "saps",
    icon: Shield,
    title: "The SAP Hierarchy",
    subtitle: "Acknowledged → Unacknowledged → Waived",
    content: {
      overview: "Special Access Programs (SAPs) add layers of protection beyond standard classification. The hierarchy creates varying degrees of visibility even to those with TS/SCI clearances.",
      keyPoints: [
        {
          title: "Acknowledged SAPs",
          description: "The program's existence can be acknowledged, but details remain classified. Congress is briefed on these programs through normal oversight channels."
        },
        {
          title: "Unacknowledged SAPs (USAPs)",
          description: "Even the existence is classified. Only those with specific need-to-know are made aware the program exists at all."
        },
        {
          title: "Waived SAPs ('Deep Black')",
          description: "Exempt from standard congressional reporting. Under 10 U.S.C. § 119, SecDef can waive normal notification requirements. Only the 'Gang of Eight' may be briefed."
        }
      ],
      implication: "Waived SAPs can operate with minimal oversight. If UAP programs are Waived SAPs, even senior officials with TS/SCI clearances may be unaware of their existence."
    }
  },
  {
    id: "oversight",
    icon: Eye,
    title: "Who Oversees What",
    subtitle: "Gang of Eight, Defense Committees, IC IG",
    content: {
      overview: "Oversight of classified programs is distributed across multiple bodies, each with different access levels and authorities. The system is designed for checks and balances but can create accountability gaps.",
      keyPoints: [
        {
          title: "Gang of Eight",
          description: "House Speaker, Minority Leader, Senate Majority/Minority Leaders, plus Intelligence Committee chairs/ranking members. Briefed on the most sensitive covert actions."
        },
        {
          title: "Defense Committees (SASC, HASC)",
          description: "Armed Services Committees oversee DoD programs and budgets. Can request briefings but may be denied access to Waived SAPs."
        },
        {
          title: "Intelligence Committees (SSCI, HPSCI)",
          description: "Permanent Select/Select Committees on Intelligence. Primary oversight for intelligence community programs."
        },
        {
          title: "Inspectors General",
          description: "DoD IG, IC IG, and agency IGs investigate waste, fraud, and abuse. The IC IG received expanded authorities for UAP whistleblowers under recent legislation."
        }
      ],
      implication: "Congressional members have complained publicly about being denied access to UAP programs. The 2023-2024 NDAA provisions specifically address these access gaps."
    }
  },
  {
    id: "financial",
    icon: Building2,
    title: "Financial Obfuscation",
    subtitle: "FASAB 56 and 'Two Sets of Books'",
    content: {
      overview: "The 2018 Federal Accounting Standards Advisory Board Statement 56 (FASAB 56) allows federal agencies to modify financial statements to protect classified programs—legally creating discrepancies in public accounts.",
      keyPoints: [
        {
          title: "FASAB Statement 56",
          description: "Permits agencies to shift amounts between line items and modify public financial statements if disclosure would reveal classified activities. Enacted October 2018."
        },
        {
          title: "Black Budgets",
          description: "The 'National Intelligence Program' and 'Military Intelligence Program' budgets are classified. Combined, they exceed $100 billion annually."
        },
        {
          title: "IRAD Programs",
          description: "Independent Research and Development—contractor internal funding for R&D. Not subject to same oversight as government-funded programs."
        }
      ],
      implication: "Large programs can be financially hidden through legal mechanisms. The 2016 DoD IG report found $21 trillion in undocumented adjustments (1998-2015)."
    }
  },
  {
    id: "whistleblower",
    icon: Users,
    title: "Whistleblower Paths",
    subtitle: "ICWPA, Safe Harbor, 50 U.S.C. § 3373b",
    content: {
      overview: "Recent legislation has created new protected disclosure channels specifically for UAP-related information, addressing the unique challenges of reporting on unacknowledged programs.",
      keyPoints: [
        {
          title: "Intelligence Community Whistleblower Protection Act (ICWPA)",
          description: "Allows IC employees to report urgent concerns to congressional intelligence committees. Does not protect against security clearance revocation."
        },
        {
          title: "50 U.S.C. § 3373b (UAP Safe Harbor)",
          description: "Created by FY2023 NDAA. Provides specific protection for disclosure of UAP information to AARO, congressional committees, or IGs. Prohibits retaliation."
        },
        {
          title: "DOPSR Bypass",
          description: "UAP whistleblowers can report to specified recipients without Pre-Publication Review that normally applies to cleared personnel."
        }
      ],
      implication: "David Grusch used these channels. The creation of UAP-specific protections acknowledges that standard whistleblower paths may have been insufficient."
    }
  },
  {
    id: "legal",
    icon: Gavel,
    title: "Key Court Cases",
    subtitle: "Reynolds, Totten, Gravel",
    content: {
      overview: "Several Supreme Court decisions have shaped the government's ability to invoke secrecy in legal proceedings, sometimes with significant consequences for transparency.",
      keyPoints: [
        {
          title: "United States v. Reynolds (1953)",
          description: "Established the 'state secrets privilege.' The case that created it was later shown to involve government fraud—the 'secret' documents contained evidence of negligence, not national security information."
        },
        {
          title: "Totten v. United States (1875)",
          description: "Held that contracts for secret services cannot be enforced in court. Established that some agreements are so secret they cannot even be litigated."
        },
        {
          title: "Gravel v. United States (1972)",
          description: "Established that the Speech or Debate Clause protects members of Congress reading classified information into the record. Provides a constitutional disclosure path."
        }
      ],
      implication: "The state secrets privilege gives the executive branch broad power to prevent judicial review. The Reynolds precedent remains despite being built on deception."
    }
  }
];

const legalFramework = [
  {
    statute: "10 U.S.C. § 119",
    year: "1987",
    provision: "SAP Waiver Authority",
    description: "Allows Secretary of Defense to waive reporting requirements for Special Access Programs if deemed exceptionally sensitive."
  },
  {
    statute: "50 U.S.C. § 3373b",
    year: "2022",
    provision: "UAP Safe Harbor",
    description: "Protects individuals who disclose UAP information to authorized recipients from retaliation and security clearance actions."
  },
  {
    statute: "FASAB 56",
    year: "2018",
    provision: "Financial Concealment",
    description: "Permits modification of public financial statements to protect classified program information from disclosure."
  },
  {
    statute: "State Secrets Privilege",
    year: "1953",
    provision: "Reynolds Precedent",
    description: "Allows government to prevent disclosure of information in litigation if it would harm national security."
  }
];

export default function HowSecrecyWorks() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Understanding the Architecture of Secrecy</h1>
          </div>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Before you can assemble the mosaic of UAP evidence, you need to understand WHY information 
            might be fragmented. This page explains the legal and institutional mechanisms that enable 
            programs to remain hidden—even from congressional oversight.
          </p>
        </div>

        {/* Key Insight */}
        <Card className="mb-10 border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Why This Matters</h3>
                <p className="text-muted-foreground">
                  Critics often ask: "How could such programs remain secret?" The answer is that 
                  the U.S. has developed sophisticated legal and institutional mechanisms specifically 
                  designed to compartmentalize information. Understanding these mechanisms transforms 
                  "implausible secrecy" into "plausible deniability by design."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Accordion Sections */}
        <div className="mb-10">
          <Accordion type="single" collapsible className="space-y-4">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <AccordionItem 
                  key={section.id} 
                  value={section.id}
                  className="border border-border rounded-lg overflow-hidden bg-card"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-foreground">{section.title}</h3>
                        <p className="text-sm text-muted-foreground">{section.subtitle}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4 pt-2">
                      <p className="text-muted-foreground leading-relaxed">
                        {section.content.overview}
                      </p>
                      
                      <div className="grid gap-3">
                        {section.content.keyPoints.map((point, index) => (
                          <div key={index} className="p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-medium text-foreground mb-1">{point.title}</h4>
                            <p className="text-sm text-muted-foreground">{point.description}</p>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                        <p className="text-sm font-medium text-foreground">
                          <span className="text-primary">Implication:</span> {section.content.implication}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {/* Legal Framework Quick Reference */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4">Legal Framework Quick Reference</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {legalFramework.map((item) => (
              <Card key={item.statute} className="border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">{item.year}</Badge>
                    <CardTitle className="text-sm font-mono text-primary">{item.statute}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-medium text-foreground mb-1">{item.provision}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cross-Links */}
        <div className="grid gap-4 sm:grid-cols-2">
          <a 
            href="/section/f" 
            className="block p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-medium text-foreground">Section F: USG Has More Data</h4>
                <p className="text-sm text-muted-foreground">See the evidence these mechanisms protect</p>
              </div>
            </div>
          </a>
          <a 
            href="/institutional" 
            className="block p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-medium text-foreground">Institutional Ecosystem</h4>
                <p className="text-sm text-muted-foreground">Explore the organizations involved</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
