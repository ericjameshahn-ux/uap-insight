import { useState, useEffect } from "react";
import { Star, Filter, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VideoCard } from "@/components/VideoCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase, Video } from "@/lib/supabase";
import { BackButton } from "@/components/BackButton";

const sectionOptions = ['ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];

export default function Videos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [sectionFilter, setSectionFilter] = useState("ALL");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('videos')
        .select('*')
        .order('recommended', { ascending: false });
      
      if (fetchError) {
        setError(fetchError);
      } else if (data) {
        setVideos(data);
        setFilteredVideos(data);
      }
      setLoading(false);
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    let filtered = videos;
    
    if (sectionFilter !== "ALL") {
      filtered = filtered.filter(video => video.section_id?.toUpperCase() === sectionFilter);
    }

    // Sort: recommended first
    filtered = [...filtered].sort((a, b) => {
      if (a.recommended && !b.recommended) return -1;
      if (!a.recommended && b.recommended) return 1;
      return 0;
    });

    setFilteredVideos(filtered);
  }, [sectionFilter, videos]);

  const recommendedCount = videos.filter(v => v.recommended).length;

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <BackButton />
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Failed to load videos</h1>
          <p className="text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <BackButton />
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold mb-2">Videos</h1>
        <p className="text-muted-foreground">
          Curated video content including interviews, documentaries, and hearings.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <Select value={sectionFilter} onValueChange={setSectionFilter}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by section" />
          </SelectTrigger>
          <SelectContent>
            {sectionOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option === 'ALL' ? 'All Sections' : `Section ${option}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          {recommendedCount} recommended videos
        </div>
      </div>

      {/* Videos Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card-elevated overflow-hidden animate-pulse">
              <div className="aspect-video bg-muted" />
              <div className="p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, i) => (
            <div 
              key={video.id} 
              className="animate-fade-in cursor-pointer"
              style={{ animationDelay: `${i * 50}ms` }}
              onClick={() => setSelectedVideo(video)}
            >
              <VideoCard video={video} />
            </div>
          ))}

          {filteredVideos.length === 0 && (
            <div className="card-elevated p-12 text-center text-muted-foreground col-span-3">
              {videos.length === 0 
                ? "No videos available. Connect your Supabase database to load data."
                : "No videos match your filter."}
            </div>
          )}
        </div>
      )}

      {/* Video Player Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedVideo && (
            <VideoCard video={selectedVideo} showEmbed />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
