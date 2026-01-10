import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, Sparkles, BookOpen, ArrowRight, Clock, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThreeTierFramework } from "@/components/intro/ThreeTierFramework";
import { HistoricalExampleCard } from "@/components/intro/HistoricalExampleCard";
import { FilterMechanismCards } from "@/components/intro/FilterMechanismCards";
import { MosaicAssembly } from "@/components/intro/MosaicAssembly";
import { AssumptionAudit } from "@/components/intro/AssumptionAudit";
import { MetaLessonCard } from "@/components/intro/MetaLessonCard";
import { PersonaPathways } from "@/components/intro/PersonaPathways";
import { manhattanProject, ghostArmy, condonScenario } from "@/components/intro/introData";

export default function IntroFramework() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 overflow-x-hidden">
      {/* Hero Section */}
      <section className="min-h-[60vh] flex flex-col justify-center items-center text-center mb-16">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Clock className="w-4 h-4" />
          <span>8-12 minute read</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
          Before You Evaluate the Evidence...
        </h1>
        
        <p className="text-xl text-muted-foreground mb-4 max-w-2xl">
          Learn the framework that reveals what filters hide
        </p>
        
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          Financial analysts use Mosaic Theory to piece together material insights from scattered data. 
          The same approach reveals patterns in information environments designed to obscure.
        </p>

        <Button size="lg" asChild className="gap-2">
          <Link to="/framework">
            Begin Framework
            <ArrowDown className="w-4 h-4" />
          </Link>
        </Button>
      </section>

      {/* Main Content */}
      <div ref={contentRef} className="space-y-16">
        {/* 3-Tier Model */}
        <ThreeTierFramework />

        {/* Historical Example 1: Manhattan Project */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-center">Historical Precedent #1</h2>
          <HistoricalExampleCard example={manhattanProject} />
        </section>

        {/* Historical Example 2: Ghost Army */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-center">Historical Precedent #2</h2>
          <HistoricalExampleCard example={ghostArmy} />
        </section>

        {/* Condon Scenario as standalone */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">The Filter in Action</h2>
          <div className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{condonScenario.icon}</span>
              <h3 className="font-semibold text-lg">{condonScenario.title}</h3>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground mb-4">
              {condonScenario.content}
            </p>
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">The Key Question</p>
              <p className="text-sm font-medium">{condonScenario.keyQuestion}</p>
            </div>
          </div>
        </section>

        {/* Meta Lesson */}
        <MetaLessonCard />

        {/* UAP Application Intro */}
        <section className="text-center py-8 border-t border-b border-border">
          <h2 className="text-2xl font-bold mb-4">Now Apply the Framework</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
            If the Manhattan Project demonstrates that large-scale concealment IS possible, and Operation 
            Fortitude shows that trained analysts CAN be systematically deceived, we must ask:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 max-w-md mx-auto text-left">
            <li>• What evidence suggests a similar filter exists for UAP?</li>
            <li>• What are the documented mechanisms?</li>
            <li>• What assumptions might we be making incorrectly?</li>
          </ul>
        </section>

        {/* Filter Mechanisms */}
        <FilterMechanismCards />

        {/* Mosaic Assembly */}
        <MosaicAssembly />

        {/* Assumption Audit */}
        <AssumptionAudit />

        {/* Persona Pathways */}
        <PersonaPathways />

        {/* Final CTA */}
        <section className="text-center py-12 bg-gradient-to-b from-transparent to-primary/5 -mx-6 px-6 rounded-t-3xl">
          <h2 className="text-2xl font-bold mb-4">Ready to Evaluate the Evidence?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            You now have the framework. The question isn't whether large-scale deception is possible—history 
            proves it is. The question is whether it's happening now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="gap-2">
              <Link to="/about-quiz">
                <Sparkles className="w-4 h-4" />
                Take the Persona Quiz
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2">
              <Link to="/section/a">
                <BookOpen className="w-4 h-4" />
                Explore All Sections
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-110 z-50"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
