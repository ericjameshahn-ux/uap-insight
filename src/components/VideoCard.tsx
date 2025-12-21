import { useState, useEffect } from "react";
import { Play, Star, ExternalLink, Clock, Eye, Bookmark, X } from "lucide-react";
import { Video, getUserId } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  video: Video;
  showEmbed?: boolean;
}

type ContentStatus = 'viewed' | 'later' | 'skip' | null;

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
  const [status, setStatus] = useState<ContentStatus>(null);

  // Load status from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`video-status-${video.id}`);
    if (saved) {
      setStatus(saved as ContentStatus);
    }
  }, [video.id]);

  const handleStatusChange = async (newStatus: ContentStatus) => {
    // Toggle off if clicking same status
    const finalStatus = status === newStatus ? null : newStatus;
    setStatus(finalStatus);

    // Save to localStorage
    if (finalStatus) {
      localStorage.setItem(`video-status-${video.id}`, finalStatus);
    } else {
      localStorage.removeItem(`video-status-${video.id}`);
    }

    // Save to database
    const userId = getUserId();
    if (finalStatus) {
      await supabase.from('user_progress').upsert({
        user_id: userId,
        content_type: 'video',
        content_id: video.id,
        status: finalStatus,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,content_type,content_id' });
    } else {
      await supabase.from('user_progress').delete()
        .eq('user_id', userId)
        .eq('content_type', 'video')
        .eq('content_id', video.id);
    }
  };

  return (
    <div className={cn(
      "card-elevated overflow-hidden animate-fade-in transition-all",
      status === 'viewed' && "ring-2 ring-green-500/30",
      status === 'later' && "ring-2 ring-yellow-500/30",
      status === 'skip' && "opacity-50"
    )}>
      {/* Status badge */}
      {status === 'viewed' && (
        <div className="absolute top-2 left-2 z-10 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
          <Eye className="w-3 h-3" /> Watched
        </div>
      )}
      {status === 'later' && (
        <div className="absolute top-2 left-2 z-10 bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
          <Bookmark className="w-3 h-3" /> Saved
        </div>
      )}

      <div className="relative">
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
      </div>
      
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

        {/* Bookmark Controls */}
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border">
          <button
            onClick={() => handleStatusChange('viewed')}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors",
              status === 'viewed'
                ? "bg-green-500/20 text-green-600"
                : "hover:bg-muted text-muted-foreground"
            )}
            title="Mark as watched"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleStatusChange('later')}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors",
              status === 'later'
                ? "bg-yellow-500/20 text-yellow-600"
                : "hover:bg-muted text-muted-foreground"
            )}
            title="Save for later"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleStatusChange('skip')}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors",
              status === 'skip'
                ? "bg-muted text-foreground"
                : "hover:bg-muted text-muted-foreground"
            )}
            title="Skip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          
          <div className="flex-1" />
          
          {!showEmbed && (
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              {isYouTube ? "Watch" : "View"}
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}