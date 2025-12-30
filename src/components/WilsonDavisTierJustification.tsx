import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, ArrowUp, ArrowDown } from "lucide-react";

const forHigherTier = [
  "Author (Davis) effectively confirmed via non-denial under direct questioning",
  "Mellon explicitly identified Davis as author on X/Twitter",
  "Entered Congressional Record by Rep. Gallagher (May 2022)",
  "Corroborated by Puthoff pre-leak (Jan 2018)",
  "Elizondo confirmed in 'Imminent' book",
  "Grusch testimony parallels memo claims exactly",
  "Davis congressional testimony exceeded memo claims (May 2025)",
];

const againstHigherTier = [
  "Central witness (Wilson) categorically denies - offers to testify under oath",
  "No physical evidence has emerged from alleged programs",
  "AARO alleges 'circular reporting' in Historical Report",
  "Other named individuals (Kaminski, Kostelnik) gave evasive responses",
  "Cannot independently authenticate document creation date",
];

export function WilsonDavisTierJustification() {
  return (
    <Card className="border-2 border-amber-500/50">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            <CardTitle>Evidence Tier Justification</CardTitle>
          </div>
          <Badge className="bg-amber-600 text-white text-lg px-4 py-1">
            MEDIUM TIER
          </Badge>
        </div>
        <CardDescription>
          Why Wilson-Davis claims are rated MEDIUM - not HIGH or LOWER
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Arguments for Higher Tier */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <ArrowUp className="h-5 w-5" />
              <h4 className="font-semibold">Arguments for HIGHER Tier</h4>
            </div>
            <ul className="space-y-2">
              {forHigherTier.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500 mt-0.5">+</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Arguments against Higher Tier */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <ArrowDown className="h-5 w-5" />
              <h4 className="font-semibold">Arguments Against HIGHER Tier</h4>
            </div>
            <ul className="space-y-2">
              {againstHigherTier.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-red-500 mt-0.5">−</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Verdict */}
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
          <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
            Verdict: MEDIUM Tier Appropriate
          </h4>
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Credible documentary evidence with significant corroboration from multiple independent sources. 
            However, extraordinary claims (intact craft, reverse engineering) require either Wilson's 
            sworn testimony or physical evidence for elevation to HIGH tier. The categorical denial by 
            the central witness, despite offering to testify under oath, prevents higher classification 
            until resolved.
          </p>
        </div>

        {/* Path to HIGH */}
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold text-sm mb-2">What Would Elevate to HIGH Tier?</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Wilson recants denial under sworn testimony (with immunity)</li>
            <li>• Physical evidence from alleged SAP emerges publicly</li>
            <li>• Declassified records confirm program existence</li>
            <li>• Named "gatekeepers" provide on-record corroboration</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
