import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { BackButton } from "@/components/BackButton";
import { FigureCard } from "@/components/FigureCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WilsonDavisNetwork } from "@/components/WilsonDavisNetwork";
import { WilsonDavisCrossReferences } from "@/components/WilsonDavisCrossReferences";
import { WilsonDavisTierJustification } from "@/components/WilsonDavisTierJustification";
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  Video, 
  ExternalLink,
  Users,
  Calendar,
  Scale
} from "lucide-react";

const provenanceSteps = [
  { label: "Edgar Mitchell's Estate", date: "2016", description: "Documents found in astronaut's papers after death" },
  { label: '"Spaceman" (anonymous)', date: "2017-2018", description: "Anonymous associate provided copy" },
  { label: "James Rigney", date: "2018", description: "Australian researcher received document" },
  { label: "Grant Cameron", date: "2019", description: "Canadian researcher obtained copy" },
  { label: "Chase Williams / Imgur", date: "Apr 19, 2019", description: "Public leak via image hosting" },
  { label: "Congressional Record", date: "May 17, 2022", description: "Rep. Gallagher enters into official record" },
];

const evidenceFor = [
  "Davis effectively confirmed authorship (Sept 2024 - non-denial under direct questioning)",
  "Mellon explicitly identified Davis as author on X/Twitter",
  "Matches Davis's known writing style and areas of expertise",
  "Internal details consistent with 2002 timeframe",
  "Entered into Congressional Record by Rep. Gallagher",
  "Referenced in AARO Historical Report as 'credible'",
  "Mitchell's copy found in his estate papers",
];

const evidenceAgainst = [
  "Wilson categorically denies (offers to testify under oath)",
  "No physical evidence corroborates SAP claims",
  "Document could not be independently authenticated",
  "Wilson's career trajectory inconsistent with claimed obstruction",
  "Relies on secondhand chain of custody",
  "Some technical details questioned by analysts",
];

const wilsonDavisFigureIds = [
  'thomas-wilson', 'eric-davis', 'edgar-mitchell', 
  'paul-kaminski', 'michael-kostelnik', 'william-perry', 
  'will-miller', 'oke-shannon'
];

export default function WilsonDavisCaseStudy() {
  const { data: figures, isLoading: loadingFigures } = useQuery({
    queryKey: ['wilson-davis-figures'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('figures')
        .select('*')
        .in('id', wilsonDavisFigureIds);
      if (error) throw error;
      return data || [];
    }
  });

  const { data: claims } = useQuery({
    queryKey: ['wilson-davis-claims'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .or('source.ilike.%Wilson-Davis%,source.ilike.%Wilson Davis%');
      if (error) throw error;
      return data || [];
    }
  });

  const { data: timelineEvents } = useQuery({
    queryKey: ['wilson-davis-timeline'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .ilike('id', 'wdm-%')
        .order('year', { ascending: true });
      if (error) throw error;
      return data || [];
    }
  });

  const { data: videos } = useQuery({
    queryKey: ['wilson-davis-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .ilike('id', 'dolan-wilson-davis%');
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <BackButton className="text-white/70 hover:text-white mb-4" />
          <span className="text-xs uppercase tracking-wider text-indigo-300">Case Study</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">The Wilson-Davis Memo</h1>
          <p className="text-lg md:text-xl text-slate-300 mt-4">
            The most significant documentary claim in UAP disclosure history
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Badge variant="outline" className="border-amber-500 text-amber-300">
              Congressional Record
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-300">
              Author Confirmed
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-300">
              MEDIUM Tier
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-8 space-y-8">
        {/* Document Overview */}
        <Card className="border-l-4 border-indigo-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              A 13-page document authored by Dr. Eric Davis recording his October 16, 2002 
              conversation with Admiral Thomas Wilson. The memo alleges Wilson investigated 
              UAP-related Special Access Programs in 1997 and was denied access to a 
              contractor-controlled reverse engineering program despite his position as 
              Deputy Director of the Defense Intelligence Agency.
            </p>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground block">Date Created</span>
                <span className="font-medium">October 16, 2002</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Public Leak</span>
                <span className="font-medium">April 19, 2019</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Congressional Record</span>
                <span className="font-medium">May 17, 2022</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Author Confirmed</span>
                <span className="font-medium">September 2024</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Provenance Chain */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Document Provenance Chain
            </CardTitle>
            <CardDescription>
              The journey from Edgar Mitchell's estate to the Congressional Record
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Desktop horizontal layout */}
              <div className="hidden md:flex items-start justify-between relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-indigo-200" />
                {provenanceSteps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center relative z-10 flex-1">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium mt-3 text-center px-1">{step.label}</span>
                    <span className="text-xs text-muted-foreground text-center">{step.date}</span>
                  </div>
                ))}
              </div>
              
              {/* Mobile vertical layout */}
              <div className="md:hidden space-y-4">
                {provenanceSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      {index < provenanceSteps.length - 1 && (
                        <div className="w-0.5 h-8 bg-indigo-200 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <span className="text-sm font-medium">{step.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">({step.date})</span>
                      <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Figures */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Key Figures
            </CardTitle>
            <CardDescription>
              Individuals connected to the Wilson-Davis memo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingFigures ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : figures && figures.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {figures.map((figure) => (
                  <FigureCard key={figure.id} figure={figure} compact />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Figure data will be loaded from the database once available.
              </p>
            )}
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link to="/figures?search=wilson">
                  View All Related Figures <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Figure Network Visualization */}
        <WilsonDavisNetwork />

        {/* Evidence Assessment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-t-4 border-green-500">
            <CardHeader>
              <CardTitle className="text-green-700 dark:text-green-400 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Evidence FOR Authenticity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {evidenceFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-amber-500">
            <CardHeader>
              <CardTitle className="text-amber-700 dark:text-amber-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Legitimate Skeptical Concerns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {evidenceAgainst.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-1 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Evidence Tier Justification */}
        <WilsonDavisTierJustification />

        {/* Cross-Reference Analysis */}
        <WilsonDavisCrossReferences />

        {/* Falsifiability Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              What Would Prove This True or False?
            </CardTitle>
            <CardDescription>
              Applying falsifiable criteria to evaluate the memo's claims
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3">To VERIFY:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    Wilson recants denial under sworn testimony with immunity
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    Physical evidence from alleged programs emerges
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    SAP records declassified confirming program existence
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    "Gatekeepers" corroborate Wilson's account
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3">To FALSIFY:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    Technical analysis proves different document creation date
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    Definitive proof Wilson was elsewhere on Oct 16, 2002
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    Davis admits fabrication
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    Thorough classified review finds no such SAP ever existed
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentary Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Documentary Analysis
            </CardTitle>
            <CardDescription>
              Richard Dolan's comprehensive series on the Wilson-Davis memo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {videos && videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video) => (
                  <a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                      {video.title}
                    </h4>
                    {video.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                      <ExternalLink className="h-3 w-3" />
                      Watch on YouTube
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Documentary videos will be linked once available in the database.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/videos">
                    Browse All Videos <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline Events */}
        {timelineEvents && timelineEvents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline Events
              </CardTitle>
              <CardDescription>
                Key events in the Wilson-Davis memo story
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timelineEvents.slice(0, 8).map((event) => (
                  <div 
                    key={event.id} 
                    className="border-l-4 border-indigo-500 pl-4 py-2"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{event.year}</span>
                      <Badge variant="secondary" className="text-xs">{event.category}</Badge>
                    </div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                ))}
              </div>
              {timelineEvents.length > 8 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" asChild>
                    <Link to="/timeline">
                      View Full Timeline <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Related Sections */}
        <Card className="bg-muted/50">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold mb-1">Explore Related Evidence</h3>
                <p className="text-sm text-muted-foreground">
                  The Wilson-Davis memo relates to multiple evidence sections
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/section/f">Section F: USG Has More Data</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/section/g">Section G: USG May Have Materials</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/section/h">Section H: Breakaway Civilization</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
