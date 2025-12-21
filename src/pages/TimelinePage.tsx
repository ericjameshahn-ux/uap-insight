import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  FileText, 
  Radio, 
  Shield, 
  Users, 
  Microscope,
  Scale,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  year: number;
  month: number | null;
  day: number | null;
  date_display: string;
  title: string;
  description: string;
  tier: "HIGH" | "MEDIUM" | "LOWER";
  category: string;
  related_sections: string[] | null;
  key_figures: string[] | null;
  source: string | null;
  is_milestone: boolean;
}

const categoryIcons: Record<string, React.ElementType> = {
  SIGHTING: Radio,
  LEGISLATION: Scale,
  DISCLOSURE: FileText,
  PROGRAM: Shield,
  TESTIMONY: MessageSquare,
  DOCUMENT: FileText,
  INCIDENT: Radio,
  RESEARCH: Microscope,
};

const categoryColors: Record<string, string> = {
  SIGHTING: "bg-blue-500/20 text-blue-300 border-blue-500/50",
  LEGISLATION: "bg-purple-500/20 text-purple-300 border-purple-500/50",
  DISCLOSURE: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
  PROGRAM: "bg-amber-500/20 text-amber-300 border-amber-500/50",
  TESTIMONY: "bg-rose-500/20 text-rose-300 border-rose-500/50",
  DOCUMENT: "bg-cyan-500/20 text-cyan-300 border-cyan-500/50",
  INCIDENT: "bg-orange-500/20 text-orange-300 border-orange-500/50",
  RESEARCH: "bg-indigo-500/20 text-indigo-300 border-indigo-500/50",
};

const tierColors: Record<string, string> = {
  HIGH: "bg-green-600 text-white",
  MEDIUM: "bg-yellow-600 text-white",
  LOWER: "bg-red-600 text-white",
};

// Define era boundaries for the timeline
const eras = [
  { start: 1940, end: 1959, label: "1940s-50s", subtitle: "The Modern Era Begins" },
  { start: 1960, end: 1979, label: "1960s-70s", subtitle: "Nuclear Incidents & Closure" },
  { start: 1980, end: 1999, label: "1980s-90s", subtitle: "International Cases" },
  { start: 2000, end: 2016, label: "2000s-2016", subtitle: "The Black Budget Era" },
  { start: 2017, end: 2025, label: "2017-Present", subtitle: "Disclosure & Legislation" },
];

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [activeEra, setActiveEra] = useState(4); // Default to most recent era
  const [filterTier, setFilterTier] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("timeline_events")
      .select("*")
      .order("year", { ascending: true })
      .order("month", { ascending: true })
      .order("day", { ascending: true });

    if (error) {
      console.error("Error fetching timeline events:", error);
    } else {
      setEvents(data || []);
      // Auto-select first milestone in current era
      const currentEra = eras[activeEra];
      const firstMilestone = data?.find(
        (e: TimelineEvent) => e.is_milestone && e.year >= currentEra.start && e.year <= currentEra.end
      );
      if (firstMilestone) setSelectedEvent(firstMilestone);
    }
    setLoading(false);
  };

  const filteredEvents = events.filter((event) => {
    const era = eras[activeEra];
    const inEra = event.year >= era.start && event.year <= era.end;
    const matchesTier = !filterTier || event.tier === filterTier;
    const matchesCategory = !filterCategory || event.category === filterCategory;
    return inEra && matchesTier && matchesCategory;
  });

  const milestones = filteredEvents.filter((e) => e.is_milestone);

  const scrollTimeline = (direction: "left" | "right") => {
    if (timelineRef.current) {
      const scrollAmount = 400;
      timelineRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Disclosure Timeline</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            A chronological journey through 80+ years of UAP events, from the 1947 Roswell incident 
            to modern Congressional hearings. Click any event to explore details.
          </p>
        </div>
      </div>

      {/* Era Navigation */}
      <div className="border-b border-border bg-background/95 backdrop-blur sticky top-[104px] z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {eras.map((era, index) => (
              <button
                key={era.label}
                onClick={() => {
                  setActiveEra(index);
                  setSelectedEvent(null);
                }}
                className={cn(
                  "px-4 py-2 rounded-lg whitespace-nowrap transition-all",
                  activeEra === index
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <div className="font-medium">{era.label}</div>
                <div className="text-xs opacity-80">{era.subtitle}</div>
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mt-3 flex-wrap text-sm">
            <span className="text-muted-foreground">Filter:</span>
            {["HIGH", "MEDIUM", "LOWER"].map((tier) => (
              <Badge
                key={tier}
                variant={filterTier === tier ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all",
                  filterTier === tier && tierColors[tier]
                )}
                onClick={() => setFilterTier(filterTier === tier ? null : tier)}
              >
                {tier}
              </Badge>
            ))}
            <span className="text-muted-foreground">|</span>
            {Object.keys(categoryColors).slice(0, 5).map((cat) => (
              <Badge
                key={cat}
                variant={filterCategory === cat ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all text-xs",
                  filterCategory === cat && categoryColors[cat]
                )}
                onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="relative py-12 bg-gradient-to-b from-background to-muted/20">
        {/* Navigation arrows */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur"
          onClick={() => scrollTimeline("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur"
          onClick={() => scrollTimeline("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Timeline track */}
        <div
          ref={timelineRef}
          className="overflow-x-auto scrollbar-thin px-16 pb-8"
        >
          <div className="relative min-w-max py-16">
            {/* Main timeline line */}
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full" />

            {/* Year markers */}
            <div className="flex items-center gap-8">
              {loading ? (
                <div className="flex items-center justify-center py-20 w-full">
                  <div className="animate-pulse text-muted-foreground">Loading timeline events...</div>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="flex items-center justify-center py-20 w-full">
                  <div className="text-muted-foreground">No events found for this era. Add events to the timeline_events table.</div>
                </div>
              ) : (
                filteredEvents.map((event) => {
                  const Icon = categoryIcons[event.category] || FileText;
                  const isSelected = selectedEvent?.id === event.id;
                  
                  return (
                    <div key={event.id} className="flex flex-col items-center relative">
                      {/* Event marker */}
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className={cn(
                          "relative group transition-all duration-300",
                          isSelected ? "scale-110" : "hover:scale-105"
                        )}
                      >
                        {/* Milestone glow effect */}
                        {event.is_milestone && (
                          <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse" />
                        )}
                        
                        {/* Icon circle */}
                        <div
                          className={cn(
                            "relative w-14 h-14 rounded-full flex items-center justify-center transition-all border-2",
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/50"
                              : event.is_milestone
                                ? "bg-primary/20 text-primary border-primary/50 hover:bg-primary/30"
                                : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                          )}
                        >
                          <Icon className="h-6 w-6" />
                        </div>

                        {/* Connector to timeline */}
                        <div
                          className={cn(
                            "absolute left-1/2 -translate-x-1/2 w-0.5 h-8",
                            isSelected ? "bg-primary" : "bg-border"
                          )}
                          style={{ top: "100%" }}
                        />
                      </button>

                      {/* Year label */}
                      <div
                        className={cn(
                          "mt-10 text-sm font-mono transition-colors",
                          isSelected ? "text-primary font-bold" : "text-muted-foreground"
                        )}
                      >
                        {event.year}
                      </div>

                      {/* Mini title for milestones */}
                      {event.is_milestone && (
                        <div
                          className={cn(
                            "mt-1 text-xs max-w-[100px] text-center leading-tight",
                            isSelected ? "text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {event.title}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Card */}
      {selectedEvent && (
        <div className="max-w-4xl mx-auto px-4 -mt-4 mb-12 animate-fade-in">
          <Card className="border-2 border-primary/20 bg-card/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={tierColors[selectedEvent.tier]}>
                      {selectedEvent.tier}
                    </Badge>
                    <Badge variant="outline" className={categoryColors[selectedEvent.category]}>
                      {selectedEvent.category}
                    </Badge>
                    {selectedEvent.is_milestone && (
                      <Badge className="bg-primary text-primary-foreground">MILESTONE</Badge>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {selectedEvent.title}
                  </h2>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {selectedEvent.date_display}
                  </p>
                </div>
              </div>

              <p className="text-foreground/90 leading-relaxed mb-6">
                {selectedEvent.description}
              </p>

              {/* Key Figures */}
              {selectedEvent.key_figures && selectedEvent.key_figures.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" /> Key Figures
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.key_figures.map((figure) => (
                      <Badge key={figure} variant="secondary">
                        {figure.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Sections */}
              {selectedEvent.related_sections && selectedEvent.related_sections.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                    Related Evidence Sections
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.related_sections.map((section) => (
                      <Link
                        key={section}
                        to={`/section/${section.toLowerCase()}`}
                        className="inline-flex"
                      >
                        <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                          Section {section.toUpperCase()}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Source */}
              {selectedEvent.source && (
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Source: {selectedEvent.source}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats Footer */}
      <div className="border-t border-border bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">{events.length}</div>
              <div className="text-sm text-muted-foreground">Total Events</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">
                {events.filter((e) => e.is_milestone).length}
              </div>
              <div className="text-sm text-muted-foreground">Key Milestones</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500">
                {events.filter((e) => e.tier === "HIGH").length}
              </div>
              <div className="text-sm text-muted-foreground">HIGH Credibility</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">
                {new Set(events.flatMap((e) => e.key_figures || [])).size}
              </div>
              <div className="text-sm text-muted-foreground">Key Figures</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
