import { useState, useEffect } from "react";
import { supabase, TimelineEvent } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  FileText, 
  Radio, 
  Shield, 
  Users, 
  Microscope,
  Scale,
  MessageSquare,
  PlayCircle,
  ExternalLink,
  ChevronDown,
  Filter,
  Factory,
  Star
} from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
  SIGHTING: Radio,
  LEGISLATION: Scale,
  DISCLOSURE: FileText,
  PROGRAM: Shield,
  TESTIMONY: MessageSquare,
  DOCUMENT: FileText,
  INCIDENT: Radio,
  RESEARCH: Microscope,
  INSTITUTIONAL: Users,
  LEGAL: Scale,
  CONTRACTOR: Factory,
};

const categoryColors: Record<string, string> = {
  SIGHTING: "bg-amber-500/20 text-amber-300 border-amber-500/50",
  LEGISLATION: "bg-green-500/20 text-green-300 border-green-500/50",
  DISCLOSURE: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
  PROGRAM: "bg-blue-500/20 text-blue-300 border-blue-500/50",
  TESTIMONY: "bg-rose-500/20 text-rose-300 border-rose-500/50",
  DOCUMENT: "bg-purple-500/20 text-purple-300 border-purple-500/50",
  INCIDENT: "bg-orange-500/20 text-orange-300 border-orange-500/50",
  RESEARCH: "bg-indigo-500/20 text-indigo-300 border-indigo-500/50",
  INSTITUTIONAL: "bg-cyan-500/20 text-cyan-300 border-cyan-500/50",
  LEGAL: "bg-violet-500/20 text-violet-300 border-violet-500/50",
  CONTRACTOR: "bg-slate-500/20 text-slate-300 border-slate-500/50",
};

const tierColors: Record<string, string> = {
  HIGH: "bg-green-600 text-white",
  MEDIUM: "bg-yellow-600 text-white",
  LOWER: "bg-red-600 text-white",
};

const tierBorderColors: Record<string, string> = {
  HIGH: "border-l-green-500",
  MEDIUM: "border-l-yellow-500",
  LOWER: "border-l-red-500",
};

const eras = [
  { start: 1940, end: 1959, label: "1940s-50s", subtitle: "The Modern Era Begins" },
  { start: 1960, end: 1979, label: "1960s-70s", subtitle: "Nuclear Incidents & Closure" },
  { start: 1980, end: 1999, label: "1980s-90s", subtitle: "International Cases" },
  { start: 2000, end: 2016, label: "2000s-2016", subtitle: "The Black Budget Era" },
  { start: 2017, end: 2025, label: "2017-Present", subtitle: "Disclosure & Legislation" },
];

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?]+)/);
  return match ? match[1] : null;
}

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [videos, setVideos] = useState<{ id: string; title: string; url: string; description: string | null; section_id: string | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEra, setActiveEra] = useState(4);
  const [filterTier, setFilterTier] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showMilestonesOnly, setShowMilestonesOnly] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: eventsData, error: eventsError } = await supabase
      .from("timeline_events")
      .select("*")
      .order("year", { ascending: false })
      .order("month", { ascending: false })
      .order("day", { ascending: false });

    if (eventsError) {
      console.error("Error fetching timeline events:", eventsError);
    } else {
      setEvents(eventsData || []);
    }

    const { data: videosData, error: videosError } = await supabase
      .from("videos")
      .select("id, title, url, description, section_id");

    if (videosError) {
      console.error("Error fetching videos:", videosError);
    } else {
      setVideos(videosData || []);
    }

    setLoading(false);
  };

  const filteredEvents = events.filter((event) => {
    const era = eras[activeEra];
    const inEra = event.year >= era.start && event.year <= era.end;
    const matchesTier = !filterTier || event.tier === filterTier;
    const matchesCategory = !filterCategory || event.category === filterCategory;
    const matchesMilestone = !showMilestonesOnly || event.is_milestone;
    return inEra && matchesTier && matchesCategory && matchesMilestone;
  });

  const eventsByYear = filteredEvents.reduce((acc, event) => {
    const year = event.year;
    if (!acc[year]) acc[year] = [];
    acc[year].push(event);
    return acc;
  }, {} as Record<number, TimelineEvent[]>);

  const years = Object.keys(eventsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  const getRelatedVideos = (event: TimelineEvent) => {
    if (event.year < 2024) return [];
    
    return videos.filter((video) => {
      if (event.key_figures) {
        for (const figure of event.key_figures) {
          const figureName = figure.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
          if (video.title.toLowerCase().includes(figureName.toLowerCase())) {
            return true;
          }
        }
      }
      const keywords = event.title.toLowerCase().split(" ").filter(w => w.length > 4);
      for (const keyword of keywords) {
        if (video.title.toLowerCase().includes(keyword)) {
          return true;
        }
      }
      return false;
    }).slice(0, 3);
  };

  const clearFilters = () => {
    setFilterTier(null);
    setFilterCategory(null);
    setShowMilestonesOnly(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Disclosure Timeline</h1>
          </div>
          <p className="text-muted-foreground">
            80+ years of UAP history — from the 1947 Roswell incident to modern Congressional hearings. 
            Click any event to explore details and related videos.
          </p>
        </div>

        {/* Era Navigation */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-4 mb-6 border-b border-border">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {eras.map((era, index) => (
              <button
                key={era.label}
                onClick={() => {
                  setActiveEra(index);
                  setExpandedEvent(null);
                }}
                className={`px-3 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${
                  activeEra === index
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                <div className="font-medium">{era.label}</div>
              </button>
            ))}
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              {(filterTier || filterCategory || showMilestonesOnly) && (
                <Badge variant="secondary" className="ml-1">
                  Active
                </Badge>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Credibility:</span>
                {["HIGH", "MEDIUM", "LOWER"].map((tier) => (
                  <Badge
                    key={tier}
                    variant={filterTier === tier ? "default" : "outline"}
                    className={`cursor-pointer ${filterTier === tier ? tierColors[tier] : ""}`}
                    onClick={() => setFilterTier(filterTier === tier ? null : tier)}
                  >
                    {tier}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Category:</span>
                {Object.keys(categoryColors).map((cat) => (
                  <Badge
                    key={cat}
                    variant={filterCategory === cat ? "default" : "outline"}
                    className={`cursor-pointer text-xs ${filterCategory === cat ? categoryColors[cat] : ""}`}
                    onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                <button
                  onClick={() => setShowMilestonesOnly(!showMilestonesOnly)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    showMilestonesOnly 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Star className="h-4 w-4" />
                  Milestones Only
                </button>
              </div>

              {(filterTier || filterCategory || showMilestonesOnly) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Vertical Timeline */}
        <div className="relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground mt-4">Loading timeline...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">No events match your filters.</p>
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

              {years.map((year) => (
                <div key={year} className="relative mb-8">
                  {/* Year marker */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative z-10 w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
                      <span className="text-primary-foreground font-bold text-lg">
                        {year.toString().slice(-2)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{year}</h2>
                      <p className="text-sm text-muted-foreground">
                        {eventsByYear[year].length} event{eventsByYear[year].length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {/* Events for this year */}
                  <div className="ml-20 space-y-3">
                    {eventsByYear[year].map((event) => {
                      const Icon = categoryIcons[event.category] || FileText;
                      const isExpanded = expandedEvent === event.id;
                      const relatedVideos = getRelatedVideos(event);

                      return (
                        <Card
                          key={event.id}
                          className={`cursor-pointer transition-all border-l-4 ${tierBorderColors[event.tier]} hover:shadow-md ${
                            isExpanded ? "ring-2 ring-primary/50" : ""
                          }`}
                          onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                        >
                          <CardContent className="p-4">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${categoryColors[event.category] || "bg-muted"}`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap gap-2 mb-1">
                                    <Badge className={tierColors[event.tier]} variant="secondary">
                                      {event.tier}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {event.category}
                                    </Badge>
                                    {event.is_milestone && (
                                      <Badge variant="default" className="bg-primary">
                                        MILESTONE
                                      </Badge>
                                    )}
                                  </div>
                                  <h3 className="font-semibold text-foreground leading-tight">
                                    {event.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">{event.date_display}</p>
                                </div>
                              </div>
                              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`} />
                            </div>

                            {/* Expanded Content */}
                            {isExpanded && (
                              <div className="mt-4 pt-4 border-t border-border space-y-4">
                                <p className="text-foreground leading-relaxed">
                                  {event.description}
                                </p>

                                {/* Key Figures */}
                                {event.key_figures && event.key_figures.length > 0 && (
                                  <div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                      <Users className="h-4 w-4" /> Key Figures
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {event.key_figures.map((figure) => (
                                        <Badge key={figure} variant="secondary">
                                          {figure.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Related Sections */}
                                {event.related_sections && event.related_sections.length > 0 && (
                                  <div>
                                    <div className="text-sm text-muted-foreground mb-2">
                                      Related Evidence
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {event.related_sections.map((section) => (
                                        <a
                                          key={section}
                                          href={`/section/${section}`}
                                          onClick={(e) => e.stopPropagation()}
                                          className="px-2 py-1 bg-primary/20 text-primary rounded text-xs hover:bg-primary/30 transition-colors"
                                        >
                                          Section {section}
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Related Videos (2024-2025 only) */}
                                {relatedVideos.length > 0 && (
                                  <div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                      <PlayCircle className="h-4 w-4" /> Related Videos
                                    </div>
                                    <div className="space-y-2">
                                      {relatedVideos.map((video) => {
                                        const videoId = getYouTubeId(video.url);
                                        return (
                                          <a
                                            key={video.id}
                                            href={video.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
                                          >
                                            {videoId && (
                                              <img
                                                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                                alt=""
                                                className="w-24 h-14 object-cover rounded"
                                              />
                                            )}
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                                {video.title}
                                              </p>
                                            </div>
                                            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                                          </a>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* Source */}
                                {event.source && (
                                  <p className="text-xs text-muted-foreground">
                                    Source: {event.source}
                                  </p>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">{events.length}</p>
              <p className="text-sm text-muted-foreground">Total Events</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {events.filter((e) => e.is_milestone).length}
              </p>
              <p className="text-sm text-muted-foreground">Key Milestones</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">
                {events.filter((e) => e.tier === "HIGH").length}
              </p>
              <p className="text-sm text-muted-foreground">HIGH Credibility</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
