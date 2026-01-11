import { useState, useEffect } from "react";
import { supabase, TimelineEvent } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/BackButton";
import { 
  Calendar, 
  FileText, 
  Radio, 
  Shield, 
  Users, 
  Microscope,
  Scale,
  MessageSquare,
  ExternalLink,
  ChevronDown,
  ChevronsDown,
  ChevronsUp,
  Filter,
  Factory,
  Star,
  Play,
  Video,
  Loader2
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
  // Removed: videos state - now only using junction table
  const [loading, setLoading] = useState(true);
  const [activeEra, setActiveEra] = useState(4);
  const [filterTier, setFilterTier] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterWilsonDavis, setFilterWilsonDavis] = useState(false);
  const [showMilestonesOnly, setShowMilestonesOnly] = useState(false);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [linkedVideosMap, setLinkedVideosMap] = useState<Record<string, { id: string; title: string; url: string; tier?: string; contextNote?: string }[]>>({});
  const [loadingVideos, setLoadingVideos] = useState<Set<string>>(new Set());
  const [eventVideoCountMap, setEventVideoCountMap] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch events
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

    // Note: Videos are fetched per-event via fetchLinkedVideos using junction table

    // Fetch video counts for all events (for showing video badges on cards)
    const { data: videoCountsData, error: videoCountsError } = await supabase
      .from("timeline_event_videos")
      .select("event_id");

    if (!videoCountsError && videoCountsData) {
      const countMap: Record<string, number> = {};
      videoCountsData.forEach(row => {
        countMap[row.event_id] = (countMap[row.event_id] || 0) + 1;
      });
      setEventVideoCountMap(countMap);
    }

    setLoading(false);
  };

  const filteredEvents = events.filter((event) => {
    const era = eras[activeEra];
    const inEra = event.year >= era.start && event.year <= era.end;
    const matchesTier = !filterTier || event.tier === filterTier;
    const matchesCategory = !filterCategory || event.category === filterCategory;
    const matchesMilestone = !showMilestonesOnly || event.is_milestone;
    const matchesWilsonDavis = !filterWilsonDavis || event.id.startsWith('wdm-');
    return inEra && matchesTier && matchesCategory && matchesMilestone && matchesWilsonDavis;
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

  // Stats for current era (filtered)
  const filteredMilestones = filteredEvents.filter(e => e.is_milestone).length;
  const filteredHighCredibility = filteredEvents.filter(e => e.tier === "HIGH").length;

  // REMOVED: Old keyword-based getRelatedVideos function
  // Videos are now ONLY fetched from timeline_event_videos junction table

  const clearFilters = () => {
    setFilterTier(null);
    setFilterCategory(null);
    setShowMilestonesOnly(false);
    setFilterWilsonDavis(false);
  };

  const isWilsonDavisEvent = (eventId: string) => eventId.startsWith('wdm-');
  const hasActiveFilters = filterTier || filterCategory || showMilestonesOnly || filterWilsonDavis;

  // Toggle individual event
  const toggleEvent = (eventId: string) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  // Expand all visible/filtered events
  const expandAll = () => {
    const allIds = new Set(filteredEvents.map(e => e.id));
    setExpandedEvents(allIds);
  };

  // Collapse all
  const collapseAll = () => {
    setExpandedEvents(new Set());
  };

  // Check if event is expanded
  const isEventExpanded = (eventId: string) => expandedEvents.has(eventId);

  // Get video count for event
  const getEventVideoCount = (eventId: string) => eventVideoCountMap[eventId] || 0;

  // Fetch linked videos from junction table when event is expanded
  const fetchLinkedVideos = async (eventId: string) => {
    if (linkedVideosMap[eventId] || loadingVideos.has(eventId)) return;
    
    setLoadingVideos(prev => new Set(prev).add(eventId));
    
    const { data, error } = await supabase
      .from('timeline_event_videos')
      .select(`
        display_order,
        context_note,
        videos (
          id,
          title,
          url,
          tier
        )
      `)
      .eq('event_id', eventId)
      .order('display_order');
    
    if (data && !error) {
      const videos = data
        .filter(row => row.videos)
        .map(row => {
          const videoData = row.videos as unknown as { id: string; title: string; url: string; tier?: string };
          return {
            ...videoData,
            contextNote: row.context_note
          };
        });
      setLinkedVideosMap(prev => ({ ...prev, [eventId]: videos }));
    }
    
    setLoadingVideos(prev => {
      const newSet = new Set(prev);
      newSet.delete(eventId);
      return newSet;
    });
  };

  // Watch for expanded events and fetch their videos
  useEffect(() => {
    expandedEvents.forEach(eventId => {
      if (!linkedVideosMap[eventId]) {
        fetchLinkedVideos(eventId);
      }
    });
  }, [expandedEvents]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <BackButton />
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Disclosure Timeline</h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            80+ years of UAP history — from the 1947 Roswell incident to modern Congressional hearings. 
            Click any event to explore details and related videos.
          </p>
        </div>

        {/* Sticky Header with Era Navigation, Stats & Filters */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm py-3 sm:py-4 mb-4 sm:mb-6 border-b border-border -mx-4 sm:-mx-6 px-4 sm:px-6">
          {/* Era Buttons Row */}
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {eras.map((era, index) => (
              <button
                key={era.label}
                onClick={() => {
                  setActiveEra(index);
                  setExpandedEvents(new Set());
                }}
                className={`px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm transition-all whitespace-nowrap min-h-[44px] flex items-center ${
                  activeEra === index
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                <div className="font-medium">{era.label}</div>
              </button>
            ))}
          </div>

          {/* Stats + Filter Toggle + Expand/Collapse Row */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50 gap-2">
            {/* Inline Stats */}
            <div className="hidden sm:flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-foreground">{filteredEvents.length}</span>
                <span className="text-muted-foreground">events</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-1.5">
                <Star className="w-3 h-3 text-primary fill-primary" />
                <span className="font-bold text-primary">{filteredMilestones}</span>
                <span className="text-muted-foreground">milestones</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-green-500">{filteredHighCredibility}</span>
                <span className="text-muted-foreground">high</span>
              </div>
            </div>

            {/* Mobile Stats */}
            <div className="flex sm:hidden items-center gap-2 text-xs">
              <span className="font-bold text-foreground">{filteredEvents.length}</span>
              <span className="text-muted-foreground">|</span>
              <span className="font-bold text-primary">{filteredMilestones}</span>
              <Star className="w-3 h-3 text-primary fill-primary" />
            </div>
            
            {/* Filter Toggle & Expand/Collapse */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded-lg transition-colors min-h-[36px] ${
                  hasActiveFilters
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 text-xs h-5 px-1.5">
                    Active
                  </Badge>
                )}
              </button>
              
              <div className="w-px h-6 bg-border" />
              
              <button
                onClick={expandAll}
                disabled={expandedEvents.size === filteredEvents.length}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50 min-h-[36px]"
              >
                <ChevronsDown className="w-4 h-4" />
                <span className="hidden sm:inline">Expand All</span>
              </button>
              <button
                onClick={collapseAll}
                disabled={expandedEvents.size === 0}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-50 min-h-[36px]"
              >
                <ChevronsUp className="w-4 h-4" />
                <span className="hidden sm:inline">Collapse</span>
              </button>
            </div>
          </div>

          {/* Filters Panel - Also Sticky */}
          {showFilters && (
            <div className="mt-3 p-3 sm:p-4 bg-muted/50 rounded-lg space-y-3 border border-border/50">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground font-medium">Credibility:</span>
                {["HIGH", "MEDIUM", "LOWER"].map((tier) => (
                  <Badge
                    key={tier}
                    variant={filterTier === tier ? "default" : "outline"}
                    className={`cursor-pointer min-h-[28px] flex items-center transition-all ${filterTier === tier ? tierColors[tier] : "hover:bg-muted"}`}
                    onClick={() => setFilterTier(filterTier === tier ? null : tier)}
                  >
                    {tier}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground font-medium">Category:</span>
                {Object.keys(categoryColors).map((cat) => (
                  <Badge
                    key={cat}
                    variant={filterCategory === cat ? "default" : "outline"}
                    className={`cursor-pointer text-xs min-h-[26px] flex items-center transition-all ${filterCategory === cat ? categoryColors[cat] : "hover:bg-muted"}`}
                    onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 border-t border-border/50">
                <button
                  onClick={() => setShowMilestonesOnly(!showMilestonesOnly)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors min-h-[36px] ${
                    showMilestonesOnly 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-background text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  <Star className="h-4 w-4" />
                  <span className="hidden sm:inline">Milestones Only</span>
                  <span className="sm:hidden">Milestones</span>
                </button>
                <button
                  onClick={() => setFilterWilsonDavis(!filterWilsonDavis)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors min-h-[36px] ${
                    filterWilsonDavis 
                      ? "bg-indigo-600 text-white" 
                      : "bg-background text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Wilson-Davis
                </button>
                
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters} 
                    className="min-h-[36px] ml-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    Clear all
                  </Button>
                )}
              </div>
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
                      const isExpanded = isEventExpanded(event.id);
                      const eventLinkedVideos = linkedVideosMap[event.id] || [];
                      const isLoadingEventVideos = loadingVideos.has(event.id);

                      return (
                        <Card
                          key={event.id}
                          className={`cursor-pointer transition-all border-l-4 hover:shadow-md ${
                            isWilsonDavisEvent(event.id) 
                              ? "border-l-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20" 
                              : tierBorderColors[event.tier]
                          } ${isExpanded ? "ring-2 ring-primary/50" : ""}`}
                          onClick={() => toggleEvent(event.id)}
                        >
                          <CardContent className="p-4">
                            {/* Header */}
                                <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${
                                  isWilsonDavisEvent(event.id) 
                                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/50" 
                                    : categoryColors[event.category] || "bg-muted"
                                }`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap gap-2 mb-1">
                                    {isWilsonDavisEvent(event.id) && (
                                      <Badge className="bg-indigo-600 text-white flex items-center gap-1">
                                        <FileText className="h-3 w-3" />
                                        Wilson-Davis
                                      </Badge>
                                    )}
                                    <Badge className={tierColors[event.tier]} variant="secondary">
                                      {event.tier}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {event.category}
                                    </Badge>
                                    {event.is_milestone && (
                                      <Badge variant="default" className="bg-primary flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-current" />
                                        MILESTONE
                                      </Badge>
                                    )}
                                    {/* Video count badge */}
                                    {getEventVideoCount(event.id) > 0 && (
                                      <Badge variant="secondary" className="bg-rose-500/20 text-rose-300 border-rose-500/50 flex items-center gap-1">
                                        <Video className="h-3 w-3" />
                                        {getEventVideoCount(event.id)}
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

                                {/* Linked Videos from Junction Table */}
                                {isLoadingEventVideos ? (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Loading videos...
                                  </div>
                                ) : eventLinkedVideos.length > 0 ? (
                                  <div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                                      <Play className="w-4 h-4" />
                                      Related Videos ({eventLinkedVideos.length})
                                    </div>
                                    <div className="space-y-2">
                                      {eventLinkedVideos.map((video) => {
                                        const videoId = getYouTubeId(video.url);
                                        return (
                                          <a
                                            key={video.id}
                                            href={video.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 group transition-colors"
                                          >
                                            <div className="w-28 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted relative">
                                              {videoId ? (
                                                <img
                                                  src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                                  alt={video.title}
                                                  className="w-full h-full object-cover"
                                                />
                                              ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                  <Video className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                              )}
                                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Play className="w-8 h-8 text-white fill-white" />
                                              </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium text-foreground group-hover:text-primary truncate">
                                                {video.title}
                                              </p>
                                              {video.contextNote && (
                                                <p className="text-xs text-primary mt-0.5">{video.contextNote}</p>
                                              )}
                                            </div>
                                            {video.tier === 'HIGH' && (
                                              <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                                                HIGH
                                              </span>
                                            )}
                                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                                          </a>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ) : null}

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

        {/* Stats Footer - Full database stats */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center mb-4">Full Database Statistics</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-2xl font-bold text-foreground">{events.length}</p>
              <p className="text-sm text-muted-foreground">Total Events</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10">
              <p className="text-2xl font-bold text-primary">
                {events.filter((e) => e.is_milestone).length}
              </p>
              <p className="text-sm text-muted-foreground">Key Milestones</p>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10">
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
