import { Play, Star, ExternalLink, Clock } from "lucide-react";
import { Video } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  video: Video;
  showEmbed?: boolean;
}

// Extract YouTube video ID from various URL formats
function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

export function VideoCard({ video, showEmbed = false }: VideoCardProps) {
  const youtubeId = getYouTubeId(video.url);
  const isYouTube = isYouTubeUrl(video.url);

  return (
    <div className="card-elevated overflow-hidden animate-fade-in">
      {showEmbed && isYouTube && youtubeId ? (
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      ) : (
        <div className="aspect-video bg-muted flex items-center justify-center relative group">
          {isYouTube && youtubeId && (
            <img
              src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
              alt={video.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                // Fallback to default thumbnail
                e.currentTarget.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
              }}
            />
          )}
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
              <Play className="w-6 h-6 text-primary-foreground ml-1" />
            </div>
          </a>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground leading-tight flex-1">
            {video.title}
          </h3>
          {video.recommended && (
            <div className="shrink-0">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            </div>
          )}
        </div>
        
        {video.duration && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{video.duration}</span>
          </div>
        )}
        
        {video.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {video.description}
          </p>
        )}
        
        {!showEmbed && (
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary hover:underline"
          >
            {isYouTube ? "Watch on YouTube" : "Watch Video"}
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
