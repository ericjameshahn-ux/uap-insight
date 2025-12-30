import { Scale, FileText, Shield, Building2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const legalMechanisms = [
  {
    id: "usc119",
    icon: Shield,
    statute: "10 U.S.C. § 119",
    name: "SAP Waiver Authority",
    year: "1987",
    description: "Allows Secretary of Defense to waive normal congressional reporting for exceptionally sensitive Special Access Programs.",
    implication: "Programs can legally operate with only Gang of Eight oversight, bypassing normal defense committees."
  },
  {
    id: "usc3373b",
    icon: Users,
    statute: "50 U.S.C. § 3373b",
    name: "UAP Safe Harbor",
    year: "2022",
    description: "Protects individuals disclosing UAP information to AARO, congressional committees, or IGs from retaliation.",
    implication: "Created specifically because standard whistleblower channels were insufficient for UAP disclosure."
  },
  {
    id: "fasab56",
    icon: Building2,
    statute: "FASAB Statement 56",
    name: "Financial Concealment",
    year: "2018",
    description: "Permits agencies to modify public financial statements to protect classified program information from disclosure.",
    implication: "Large programs can be financially hidden through legal accounting adjustments—'two sets of books.'"
  },
  {
    id: "reynolds",
    icon: Scale,
    statute: "State Secrets Privilege",
    name: "Reynolds Precedent",
    year: "1953",
    description: "Allows government to prevent disclosure of information in litigation if it would harm national security.",
    implication: "The case establishing this privilege was later shown to involve fraud—the 'secrets' were evidence of negligence."
  },
  {
    id: "totten",
    icon: FileText,
    statute: "Totten Doctrine",
    name: "Secret Contracts",
    year: "1875",
    description: "Contracts for secret services cannot be enforced or even litigated in court.",
    implication: "Some agreements are so secret they exist outside the legal system entirely."
  }
];

export function LegalFrameworkCards() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">Legal Framework</h3>
        <p className="text-muted-foreground text-sm mb-4">
          The mechanisms that enable programs to remain hidden from oversight and public view.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {legalMechanisms.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.id} className="border-border hover:border-primary/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs font-mono">
                    {item.year}
                  </Badge>
                  <div className="p-1.5 bg-primary/10 rounded">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-sm font-mono text-primary mt-2">
                  {item.statute}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-foreground">{item.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg border-l-2 border-primary">
                  <p className="text-xs text-foreground">
                    <span className="font-semibold text-primary">Why it matters:</span>{" "}
                    {item.implication}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Learn more:</span>{" "}
          <a href="/how-secrecy-works" className="text-primary hover:underline">
            How Secrecy Works
          </a>{" "}
          — A complete guide to the classification system, oversight gaps, and whistleblower paths.
        </p>
      </div>
    </div>
  );
}
