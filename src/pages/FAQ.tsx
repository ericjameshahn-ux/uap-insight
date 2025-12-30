import { HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/20 rounded-lg">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Frequently Asked Questions
          </h1>
        </div>

        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              FAQ Coming Soon
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
              We're compiling answers to the most common questions about UAP 
              disclosure, the evidence framework, and how to navigate this site.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
