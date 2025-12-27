import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Filter, Layers, ChevronDown, ExternalLink, Glasses } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================
// MOSAIC THEORY INTRODUCTION PAGE
// A comprehensive framework for evaluating evidence
// in environments where information is deliberately controlled
// ============================================

// Manhattan Project Data
const manhattanProject = {
  groundTruth: [
    { icon: '💰', text: '$2 billion project (~$30-60B today)' },
    { icon: '👥', text: '120,000+ workers across multiple states' },
    { icon: '⚛️', text: 'Development of world\'s first nuclear weapons' },
    { icon: '📅', text: '3+ years of active development (1942-1945)' },
    { icon: '🏭', text: 'Research facilities at Los Alamos, Oak Ridge, Hanford' },
    { icon: '🔬', text: 'Thousands of scientists, engineers, and support staff' },
  ],
  filter: [
    { icon: '🔒', label: 'Compartmentalization', text: 'Workers didn\'t know what they built' },
    { icon: '🏛️', label: 'Executive Exclusion', text: 'VP Truman not informed for 82 days' },
    { icon: '📜', label: 'Congressional Concealment', text: 'Only 7 leaders knew' },
    { icon: '📰', label: 'Cover Stories', text: 'Trinity test called "ammunition dump explosion"' },
    { icon: '🤫', label: 'Redirect Authority', text: 'Senator Truman told to "just leave that alone"' },
    { icon: '💵', label: 'Hidden Funding', text: 'Funding buried in appropriations bills' },
  ],
  assumptions: [
    { assumption: 'A project this big couldn\'t stay secret', reality: '120,000 workers, 3+ years—stayed secret' },
    { assumption: 'The Vice President would know', reality: 'Truman learned only after becoming President' },
    { assumption: 'Congress would be informed', reality: 'Only 7 leaders knew; others voted funding blindly' },
    { assumption: 'Journalists would uncover it', reality: 'Tight OpSec + wartime censorship' },
    { assumption: 'Scientists would talk', reality: 'Compartmentalization prevented full picture' },
  ],
  scenarios: [
    {
      title: 'Put Yourself in April 1945 (VP Truman)',
      icon: '🎖️',
      content: `Imagine you are Vice President Harry Truman on April 12, 1945.

You have just been told that President Roosevelt is dead. You are now the President of the United States. You're dealing with a world war on two fronts, millions of American troops deployed, the most important decisions in human history.

**What you DON'T know:**
• Your government has been building weapons that can destroy entire cities
• $2 billion has been spent on this project
• 120,000 Americans have been working on it
• The first test is just 3 months away
• You will have to decide whether to use these weapons

**The reveal:** Secretary of War Stimson finally briefs you on "a new explosive of almost unbelievable destructive power."

You were Vice President. You had security clearances. You thought you knew what your government was doing. You didn't.`
    },
    {
      title: 'Put Yourself as the Oversight Chairman (Senator Truman 1943)',
      icon: '🏛️',
      content: `Put yourself as Senator Harry Truman in 1943. You chair the Senate Special Committee to Investigate the National Defense Program. Your job is literally to find waste and fraud in military spending.

**Your investigators discover:**
• Massive unexplained construction in Washington State
• Billions of dollars in unaccounted spending
• Thousands of workers on mysterious projects

**You're about to investigate. Then you receive a message:**

Secretary of War Stimson asks you to "just leave that alone."

**Your decision:** You comply. You stop investigating.

**Why?** You trust that if it's secret, it must be important. You assume you'd be told if you needed to know. You believe the system is working as intended.

**What you didn't know:** You were protecting a program you weren't allowed to know about. Your own oversight committee was being redirected. The system was specifically designed to work around you.`
    }
  ],
  keyQuestion: 'How many times has Congressional oversight been redirected with phrases like "national security" or "need to know"? How would Congress know what they\'re not being told?'
};

// Operation Fortitude Data
const operationFortitude = {
  groundTruth: [
    { icon: '🎯', text: 'Real invasion target: Normandy, June 6, 1944' },
    { icon: '⚔️', text: '156,000 troops for actual D-Day landing' },
    { icon: '📋', text: 'Months of genuine preparation' },
    { icon: '👻', text: '23rd Headquarters Special Troops (1,100 men)' },
    { icon: '🏖️', text: 'Five beaches: Utah, Omaha, Gold, Juno, Sword' },
    { icon: '✈️', text: '13,000 aircraft, 5,000 ships in actual operation' },
  ],
  filter: [
    { icon: '🎪', label: 'FUSAG', text: 'Entire fake army created (First U.S. Army Group)' },
    { icon: '🎈', label: 'Inflatable Decoys', text: 'Tanks, trucks, planes (93 lbs each, carried by 4 men)' },
    { icon: '📻', label: 'Fake Radio Traffic', text: 'Scripted as theater performance' },
    { icon: '⭐', label: 'Patton\'s Assignment', text: 'General publicly "commanding" the phantom force' },
    { icon: '🕵️', label: 'Double Agents', text: 'Agent Garbo feeding false intel' },
    { icon: '👕', label: 'Fake Details', text: 'Laundry on clotheslines for aerial recon' },
  ],
  assumptions: [
    { assumption: 'Patton wouldn\'t command a fake army', reality: 'He did—it was the most feared name' },
    { assumption: 'We\'d spot fake equipment from recon', reality: 'Inflatables fooled aerial photography' },
    { assumption: 'Radio intercepts reveal truth', reality: 'Traffic was scripted performance' },
    { assumption: 'Calais is the obvious target', reality: 'Obvious ≠ correct' },
    { assumption: 'Our spy network would know', reality: 'Double agents fed false intel' },
  ],
  scenarios: [
    {
      title: 'Put Yourself in German Intelligence, June 1944',
      icon: '🔭',
      content: `You are a German intelligence officer. You have:
• The best aerial reconnaissance in Europe
• A network of spies
• Radio intercept capabilities
• 4 years of experience analyzing Allied movements

**You have been tracking the Allied buildup for months. You know:**
• General Patton is commanding a massive army in Southeast England
• Thousands of tanks, trucks, and planes are visible
• Radio traffic confirms large-scale operations
• The logical target is Pas-de-Calais (shortest crossing)

**What you DON'T know:**
• The tanks are inflatable rubber—93 pounds each
• Four men can pick them up and carry them
• The radio traffic is scripted theater
• Patton is commanding nothing
• The entire army doesn't exist

**On June 6, 1944, the invasion begins... at Normandy.**

Your commander asks: "Is this the real invasion or a feint?"

You confidently answer: "This must be a feint. Patton's army is still in position for Calais. The real invasion is coming."

**THE CONSEQUENCE:** For SEVEN WEEKS after D-Day, German reinforcements were held back from Normandy—waiting for an invasion that would never come. By then, it was too late.`
    }
  ],
  keyQuestion: 'If trained military intelligence professionals, with every analytical tool available, could be systematically deceived by inflatable tanks and fake radio traffic, what might we be missing today?'
};

const MosaicTheory = () => {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [expandedScenario1, setExpandedScenario1] = useState<number | null>(null);
  const [expandedScenario2, setExpandedScenario2] = useState<number | null>(null);
  const [glassesRevealed, setGlassesRevealed] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);
      
      if (heroRef.current) {
        const heroBottom = heroRef.current.offsetTop + heroRef.current.offsetHeight;
        setGlassesRevealed(scrollTop > heroBottom * 0.7);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderScenarioContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold mt-3 text-foreground">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('•')) {
        return <p key={i} className="ml-4 text-muted-foreground">{line}</p>;
      }
      return <p key={i} className="text-muted-foreground">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <div 
          className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-150"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Triangle Pattern Overlay */}
        <div 
          className={cn(
            "absolute inset-0 pointer-events-none transition-opacity duration-1000",
            glassesRevealed ? "opacity-30" : "opacity-0"
          )}
        >
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="triangles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <polygon points="10,0 20,20 0,20" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#triangles)"/>
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 bg-muted/50 px-4 py-2 rounded-full">
            <Glasses className="w-4 h-4" />
            8-12 minute read
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Before You Evaluate
            </span>
            <br />
            the Evidence...
          </h1>
          
          <p className="text-xl sm:text-2xl text-muted-foreground mb-6">
            Learn the framework that reveals what filters hide
          </p>
          
          <p className="text-base sm:text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-10">
            Financial analysts use Mosaic Theory to piece together material insights from scattered data.
            The same approach reveals patterns in information environments designed to obscure.
          </p>

          <Button
            onClick={() => document.getElementById('framework')?.scrollIntoView({ behavior: 'smooth' })}
            size="lg"
            className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white shadow-lg"
          >
            Begin Framework
            <ChevronDown className="ml-2 w-5 h-5 animate-bounce" />
          </Button>
        </div>

        {/* Glasses Silhouette */}
        <div 
          className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 transition-all duration-1000",
            glassesRevealed ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          )}
        >
          <div className="relative">
            <Glasses className="w-24 h-24 sm:w-32 sm:h-32 text-primary/30" />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-muted-foreground whitespace-nowrap">
              Your lens matters
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-6 h-6 text-muted-foreground animate-bounce" />
        </div>
      </section>

      {/* 3-Tier Model Section */}
      <section id="framework" className="py-16 sm:py-24 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            The 3-Tier Analytical Model
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Every piece of information you encounter has passed through layers of selection.
            Understanding these layers is the first step to seeing clearly.
          </p>

          <div className="space-y-6">
            {/* Tier 3: Observer Assumptions */}
            <div className="relative">
              <div className="absolute -left-4 sm:-left-8 top-1/2 -translate-y-1/2 text-6xl sm:text-8xl font-bold text-violet-500/10">3</div>
              <div className="relative bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/30 rounded-2xl p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                    <Eye className="w-6 h-6 text-violet-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Observer Assumptions</h3>
                    <p className="text-muted-foreground mb-4">The interpretive lens that shapes conclusions</p>
                    <p className="text-sm text-muted-foreground/80">
                      <span className="font-medium text-foreground">Key Question:</span> What beliefs and frameworks 
                      are you bringing to this analysis? What would need to be true for you to change your mind?
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-gradient-to-b from-violet-500/50 to-amber-500/50" />
            </div>

            {/* Tier 2: The Filter */}
            <div className="relative">
              <div className="absolute -left-4 sm:-left-8 top-1/2 -translate-y-1/2 text-6xl sm:text-8xl font-bold text-amber-500/10">2</div>
              <div className="relative bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                    <Filter className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">The Filter</h3>
                    <p className="text-muted-foreground mb-4">What gets projected, disclosed, or suppressed</p>
                    <p className="text-sm text-muted-foreground/80">
                      <span className="font-medium text-foreground">Key Question:</span> Who controls what information 
                      reaches you? What mechanisms exist to shape, delay, or prevent disclosure?
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-gradient-to-b from-amber-500/50 to-emerald-500/50" />
            </div>

            {/* Tier 1: Ground Truth */}
            <div className="relative">
              <div className="absolute -left-4 sm:-left-8 top-1/2 -translate-y-1/2 text-6xl sm:text-8xl font-bold text-emerald-500/10">1</div>
              <div className="relative bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Layers className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Ground Truth</h3>
                    <p className="text-muted-foreground mb-4">What actually exists or happened</p>
                    <p className="text-sm text-muted-foreground/80">
                      <span className="font-medium text-foreground">Key Question:</span> What is the underlying 
                      reality? This is what Mosaic Theory attempts to reconstruct from fragments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analyst Challenge Box */}
          <div className="mt-12 bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
            <p className="text-base">
              <span className="font-semibold text-primary">The analyst's challenge:</span>
              <span className="text-muted-foreground ml-2">
                Work backward from observable information, through the filter, to approximate 
                ground truth—while questioning your own assumptions.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Historical Precedent #1: Manhattan Project */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-sm uppercase tracking-wider text-muted-foreground">Historical Precedent #1</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">The Manhattan Project</h2>
            <p className="text-muted-foreground">(1942-1945)</p>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Header Image Placeholder */}
            <div className="relative h-48 sm:h-64 bg-gradient-to-br from-amber-900/50 to-slate-900">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <span className="text-4xl sm:text-6xl mb-2">☢️</span>
                <p className="text-lg sm:text-xl font-semibold text-white">Oak Ridge "Secret City" - 1944</p>
                <p className="text-sm text-white/70">"What you see here, stays here"</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  How 120,000 workers kept the biggest secret in history
                </h3>
                <span className="inline-block mt-2 text-xs uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-1 rounded">
                  Declassified Precedent
                </span>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="ground-truth" className="w-full">
              <TabsList className="w-full grid grid-cols-3 bg-muted/50 rounded-none border-b border-border">
                <TabsTrigger value="ground-truth" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <Layers className="w-4 h-4" />
                  <span className="hidden sm:inline">Ground Truth</span>
                </TabsTrigger>
                <TabsTrigger value="filter" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">The Filter</span>
                </TabsTrigger>
                <TabsTrigger value="assumptions" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Assumptions</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ground-truth" className="p-4 sm:p-6">
                <div className="grid sm:grid-cols-2 gap-3">
                  {manhattanProject.groundTruth.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="filter" className="p-4 sm:p-6">
                <div className="grid sm:grid-cols-2 gap-3">
                  {manhattanProject.filter.map((item, i) => (
                    <div key={i} className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-medium text-sm">{item.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="assumptions" className="p-4 sm:p-6">
                <div className="space-y-3">
                  {manhattanProject.assumptions.map((item, i) => (
                    <div key={i} className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-3 bg-muted/30 rounded-lg text-sm">
                      <div className="flex-1">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Assumption</span>
                        <span className="line-through text-muted-foreground">{item.assumption}</span>
                      </div>
                      <span className="hidden sm:block text-muted-foreground">→</span>
                      <div className="flex-1">
                        <span className="text-xs uppercase tracking-wider text-primary block mb-1">Reality</span>
                        <span>{item.reality}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Immersion Scenarios */}
            <div className="border-t border-border p-4 sm:p-6">
              <h4 className="font-semibold mb-4">Immersion Scenarios</h4>
              <div className="space-y-2">
                {manhattanProject.scenarios.map((scenario, i) => (
                  <div key={i} className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedScenario1(expandedScenario1 === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{scenario.icon}</span>
                        <span className="font-medium text-sm sm:text-base">{scenario.title}</span>
                      </div>
                      <ChevronDown className={cn(
                        "w-5 h-5 transition-transform",
                        expandedScenario1 === i && "rotate-180"
                      )} />
                    </button>
                    {expandedScenario1 === i && (
                      <div className="px-4 pb-4 pt-0 border-t border-border">
                        <div className="prose prose-sm dark:prose-invert max-w-none pt-4">
                          {renderScenarioContent(scenario.content)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Key Question */}
            <div className="border-t border-border p-4 sm:p-6 bg-amber-500/5">
              <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-2">The Key Question</h4>
              <p className="text-sm text-muted-foreground">{manhattanProject.keyQuestion}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Historical Precedent #2: Operation Fortitude */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-sm uppercase tracking-wider text-muted-foreground">Historical Precedent #2</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">Operation Fortitude & The Ghost Army</h2>
            <p className="text-muted-foreground">(1944)</p>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Header Image Placeholder */}
            <div className="relative h-48 sm:h-64 bg-gradient-to-br from-slate-700 to-slate-900">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <span className="text-4xl sm:text-6xl mb-2">🎈</span>
                <p className="text-lg sm:text-xl font-semibold text-white">Inflatable Sherman Tank - 93 lbs</p>
                <p className="text-sm text-white/70">Carried by 4 soldiers</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  How inflatable tanks fooled Nazi intelligence for 7 weeks
                </h3>
                <span className="inline-block mt-2 text-xs uppercase tracking-wider bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
                  Declassified Deception
                </span>
              </div>
            </div>

            {/* Critical Callout */}
            <div className="p-4 bg-red-500/10 border-b border-red-500/20">
              <p className="text-sm text-center">
                Even <span className="font-bold text-red-500">AFTER D-Day began</span>, Hitler held back reinforcements for 7 WEEKS, 
                believing Normandy was a feint. Trained military intelligence, with every analytical tool, was systematically deceived.
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="ground-truth" className="w-full">
              <TabsList className="w-full grid grid-cols-3 bg-muted/50 rounded-none border-b border-border">
                <TabsTrigger value="ground-truth" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <Layers className="w-4 h-4" />
                  <span className="hidden sm:inline">Ground Truth</span>
                </TabsTrigger>
                <TabsTrigger value="filter" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">The Filter</span>
                </TabsTrigger>
                <TabsTrigger value="assumptions" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Assumptions</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ground-truth" className="p-4 sm:p-6">
                <div className="grid sm:grid-cols-2 gap-3">
                  {operationFortitude.groundTruth.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="filter" className="p-4 sm:p-6">
                <div className="grid sm:grid-cols-2 gap-3">
                  {operationFortitude.filter.map((item, i) => (
                    <div key={i} className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-medium text-sm">{item.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="assumptions" className="p-4 sm:p-6">
                <div className="space-y-3">
                  {operationFortitude.assumptions.map((item, i) => (
                    <div key={i} className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-3 bg-muted/30 rounded-lg text-sm">
                      <div className="flex-1">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Assumption</span>
                        <span className="line-through text-muted-foreground">{item.assumption}</span>
                      </div>
                      <span className="hidden sm:block text-muted-foreground">→</span>
                      <div className="flex-1">
                        <span className="text-xs uppercase tracking-wider text-primary block mb-1">Reality</span>
                        <span>{item.reality}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Immersion Scenarios */}
            <div className="border-t border-border p-4 sm:p-6">
              <h4 className="font-semibold mb-4">Immersion Scenarios</h4>
              <div className="space-y-2">
                {operationFortitude.scenarios.map((scenario, i) => (
                  <div key={i} className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedScenario2(expandedScenario2 === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{scenario.icon}</span>
                        <span className="font-medium text-sm sm:text-base">{scenario.title}</span>
                      </div>
                      <ChevronDown className={cn(
                        "w-5 h-5 transition-transform",
                        expandedScenario2 === i && "rotate-180"
                      )} />
                    </button>
                    {expandedScenario2 === i && (
                      <div className="px-4 pb-4 pt-0 border-t border-border">
                        <div className="prose prose-sm dark:prose-invert max-w-none pt-4">
                          {renderScenarioContent(scenario.content)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Key Question */}
            <div className="border-t border-border p-4 sm:p-6 bg-cyan-500/5">
              <h4 className="font-semibold text-cyan-600 dark:text-cyan-400 mb-2">The Key Question</h4>
              <p className="text-sm text-muted-foreground">{operationFortitude.keyQuestion}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Application to UAP */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm uppercase tracking-wider text-muted-foreground">Applying the Framework</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">
              Now Consider the UAP Question
            </h2>
          </div>

          {/* Comparison Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* What We Know */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
              <h3 className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400 mb-4">
                <Layers className="w-5 h-5" />
                What's Been Acknowledged
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  'UAP exist as real physical objects (ODNI, Pentagon)',
                  'Multi-sensor confirmation by military systems',
                  'Physics-defying capabilities documented',
                  'Decades of documented incidents globally',
                  '"Not ours" - confirmed by multiple officials',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500">•</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What's Filtered */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
              <h3 className="flex items-center gap-2 font-semibold text-amber-600 dark:text-amber-400 mb-4">
                <Filter className="w-5 h-5" />
                Known Filter Mechanisms
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  'Classification barriers (SAP/USAP programs)',
                  '"More exists than released" (multiple DNIs)',
                  'Congressional oversight redirected',
                  'Whistleblower claims of retrieval programs',
                  '$21T+ in undocumented adjustments (DoD)',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* The Parallel */}
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-center mb-8">The Historical Parallel</h3>
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <span className="text-4xl">🔬</span>
                <p className="font-semibold">Manhattan Project</p>
                <p className="text-sm text-muted-foreground">120,000 workers</p>
                <p className="text-xs text-muted-foreground">didn't know they built the bomb</p>
              </div>
              <div className="space-y-2">
                <span className="text-4xl">🎈</span>
                <p className="font-semibold">Operation Fortitude</p>
                <p className="text-sm text-muted-foreground">7 weeks of deception</p>
                <p className="text-xs text-muted-foreground">fooled trained intelligence</p>
              </div>
              <div className="space-y-2">
                <span className="text-4xl">❓</span>
                <p className="font-semibold">UAP Programs</p>
                <p className="text-sm text-muted-foreground">80+ years</p>
                <p className="text-xs text-muted-foreground">of documented phenomena</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Examine the Evidence?
          </h2>
          <p className="text-muted-foreground mb-8">
            With this framework in mind, explore 13 categories of evidence, 
            100+ falsifiable claims, and 50+ credentialed witnesses—each 
            evaluated through the Mosaic Theory lens.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/quiz')}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500"
            >
              Take the Persona Quiz
              <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/section/a')}
            >
              Explore All Sections
              <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Quote */}
      <footer className="py-12 px-4 sm:px-6 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <blockquote className="text-lg sm:text-xl italic text-muted-foreground mb-4">
            "In wartime, truth is so precious that she should always be attended by a bodyguard of lies."
          </blockquote>
          <cite className="text-sm text-muted-foreground">— Winston Churchill</cite>
        </div>
      </footer>
    </div>
  );
};

export default MosaicTheory;