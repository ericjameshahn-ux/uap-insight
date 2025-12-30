import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText, Shield, Landmark } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CrossReference {
  wdClaim: string;
  existingContent: string;
  figure?: string;
  section: string;
}

const sectionGRefs: CrossReference[] = [
  {
    wdClaim: "Wilson denied access to crash retrieval program",
    existingContent: "Grusch: 'denied access to multi-decade UAP crash retrieval program'",
    figure: "David Grusch",
    section: "G"
  },
  {
    wdClaim: "'Intact craft' - not debris",
    existingContent: "Lacatski: 'possesses a craft of unknown origin and successfully gained access to its interior'",
    figure: "James Lacatski",
    section: "G"
  },
  {
    wdClaim: "'Not of this Earth' admission by contractor",
    existingContent: "Hal Puthoff: 'over 10 craft' disclosed",
    figure: "Hal Puthoff",
    section: "G"
  },
  {
    wdClaim: "Contractor-controlled programs",
    existingContent: "Mellon: 'debris... squirreled away in aerospace company'",
    figure: "Christopher Mellon",
    section: "G"
  },
];

const sectionFRefs: CrossReference[] = [
  {
    wdClaim: "Career threats for pursuing access",
    existingContent: "Grusch: retaliation claims documented",
    figure: "David Grusch",
    section: "F"
  },
  {
    wdClaim: "Waived/carved-out SAPs hide programs",
    existingContent: "Guthrie: legal framework showing classification abuse",
    figure: "Michael Guthrie",
    section: "F"
  },
  {
    wdClaim: "Bigot list excludes Congress",
    existingContent: "'No person prosecuted for disclosure to Congress' - because none have access",
    section: "F"
  },
];

const sectionHRefs: CrossReference[] = [
  {
    wdClaim: "$75B alleged spend 1950-1972",
    existingContent: "Fitts: $21 trillion undocumented adjustments",
    figure: "Catherine Austin Fitts",
    section: "H"
  },
  {
    wdClaim: "Private contractor control",
    existingContent: "Jorjani: 'breakaway group' controls technology",
    figure: "Jason Jorjani",
    section: "H"
  },
  {
    wdClaim: "Programs operate without official oversight",
    existingContent: "UAP Disclosure Act: 'legacy programs' definition",
    section: "H"
  },
];

function ReferenceList({ refs, sectionId }: { refs: CrossReference[]; sectionId: string }) {
  return (
    <div className="space-y-3">
      {refs.map((ref, i) => (
        <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs border-indigo-500 text-indigo-600">
                WD Claim
              </Badge>
            </div>
            <p className="text-sm font-medium">{ref.wdClaim}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-2" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                Corroborating
              </Badge>
              {ref.figure && (
                <span className="text-xs text-muted-foreground">{ref.figure}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{ref.existingContent}</p>
          </div>
        </div>
      ))}
      <Link 
        to={`/section/${sectionId.toLowerCase()}`}
        className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
      >
        View Section {sectionId} <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

export function WilsonDavisCrossReferences() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Cross-Reference Analysis
        </CardTitle>
        <CardDescription>
          How Wilson-Davis claims corroborate existing Navigator content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="g" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="g" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Section G</span>
              <span className="sm:hidden">G</span>
            </TabsTrigger>
            <TabsTrigger value="f" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Section F</span>
              <span className="sm:hidden">F</span>
            </TabsTrigger>
            <TabsTrigger value="h" className="flex items-center gap-2">
              <Landmark className="h-4 w-4" />
              <span className="hidden sm:inline">Section H</span>
              <span className="sm:hidden">H</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="g" className="mt-4">
            <div className="mb-3">
              <h4 className="font-medium">USG May Have Materials</h4>
              <p className="text-sm text-muted-foreground">
                {sectionGRefs.length} Wilson-Davis claims find corroboration in existing Section G content
              </p>
            </div>
            <ReferenceList refs={sectionGRefs} sectionId="G" />
          </TabsContent>
          
          <TabsContent value="f" className="mt-4">
            <div className="mb-3">
              <h4 className="font-medium">USG Has More Data</h4>
              <p className="text-sm text-muted-foreground">
                {sectionFRefs.length} Wilson-Davis claims relate to classification barriers
              </p>
            </div>
            <ReferenceList refs={sectionFRefs} sectionId="F" />
          </TabsContent>
          
          <TabsContent value="h" className="mt-4">
            <div className="mb-3">
              <h4 className="font-medium">Breakaway Civilization</h4>
              <p className="text-sm text-muted-foreground">
                {sectionHRefs.length} Wilson-Davis claims support breakaway hypothesis
              </p>
            </div>
            <ReferenceList refs={sectionHRefs} sectionId="H" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
