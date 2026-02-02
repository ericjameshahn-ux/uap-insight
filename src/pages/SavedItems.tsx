import { useState, useEffect } from "react";
import { Eye, Bookmark, SkipForward, ExternalLink, Play } from "lucide-react";
import { supabase, Claim, Video } from "@/lib/supabase";
import { useAuth, useAuthenticatedAction } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SavedItem {
  id: string;
  user_id: string;
  content_type: 'video' | 'claim';
  content_id: string;
  status: 'viewed' | 'later' | 'skip';
  updated_at: string;
}

interface EnrichedClaim extends Claim {
  savedStatus: 'viewed' | 'later' | 'skip';
}

interface EnrichedVideo extends Video {
  savedStatus: 'viewed' | 'later' | 'skip';
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
  return match ? match[1] : null;
}

export default function SavedItems() {
  const [claims, setClaims] = useState<EnrichedClaim[]>([]);
  const [videos, setVideos] = useState<EnrichedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId, isLoading: authLoading, isAuthenticated } = useAuth();
  const { executeWithAuth } = useAuthenticatedAction();

  useEffect(() => {
    const fetchSavedItems = async () => {
      setLoading(true);

      // If not authenticated, only show localStorage items
      if (!userId) {
        // Check localStorage for any saved statuses
        const localSavedItems: SavedItem[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith('claim-status-') || key?.startsWith('video-status-')) {
            const status = localStorage.getItem(key);
            if (status && ['viewed', 'later', 'skip'].includes(status)) {
              const isVideo = key.startsWith('video-status-');
              const contentId = key.replace(/^(claim|video)-status-/, '');
              localSavedItems.push({
                id: key,
                user_id: 'local',
                content_type: isVideo ? 'video' : 'claim',
                content_id: contentId,
                status: status as 'viewed' | 'later' | 'skip',
                updated_at: new Date().toISOString()
              });
            }
          }
        }

        await fetchContentDetails(localSavedItems);
        setLoading(false);
        return;
      }

      // Fetch from Supabase with authenticated user ID
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      const mergedItems = progressData || [];
      await fetchContentDetails(mergedItems);
      setLoading(false);
    };

    const fetchContentDetails = async (items: SavedItem[]) => {
      const claimIds = items.filter(i => i.content_type === 'claim').map(i => i.content_id);
      const videoIds = items.filter(i => i.content_type === 'video').map(i => i.content_id);

      if (claimIds.length > 0) {
        const { data: claimsData } = await supabase
          .from('claims')
          .select('*')
          .in('id', claimIds);

        if (claimsData) {
          const enrichedClaims = claimsData.map(claim => {
            const saved = items.find(i => i.content_type === 'claim' && i.content_id === claim.id);
            return { ...claim, savedStatus: saved?.status || 'later' } as EnrichedClaim;
          });
          setClaims(enrichedClaims);
        }
      } else {
        setClaims([]);
      }

      if (videoIds.length > 0) {
        const { data: videosData } = await supabase
          .from('videos')
          .select('*')
          .in('id', videoIds);

        if (videosData) {
          const enrichedVideos = videosData.map(video => {
            const saved = items.find(i => i.content_type === 'video' && i.content_id === video.id);
            return { ...video, savedStatus: saved?.status || 'later' } as EnrichedVideo;
          });
          setVideos(enrichedVideos);
        }
      } else {
        setVideos([]);
      }
    };

    if (!authLoading) {
      fetchSavedItems();
    }
  }, [userId, authLoading]);

  const updateStatus = async (contentType: 'video' | 'claim', contentId: string, newStatus: 'viewed' | 'later' | 'skip') => {
    // Update localStorage for immediate feedback
    const key = `${contentType}-status-${contentId}`;
    localStorage.setItem(key, newStatus);
    
    // Update Supabase with authenticated user
    await executeWithAuth(async (authUserId) => {
      await supabase.from('user_progress').upsert({
        user_id: authUserId,
        content_type: contentType,
        content_id: contentId,
        status: newStatus,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,content_type,content_id' });
    });

    // Update local state
    if (contentType === 'claim') {
      setClaims(prev => prev.map(c => c.id === contentId ? { ...c, savedStatus: newStatus } : c));
    } else {
      setVideos(prev => prev.map(v => v.id === contentId ? { ...v, savedStatus: newStatus } : v));
    }
  };

  const laterClaims = claims.filter(c => c.savedStatus === 'later');
  const viewedClaims = claims.filter(c => c.savedStatus === 'viewed');
  const skippedClaims = claims.filter(c => c.savedStatus === 'skip');

  const laterVideos = videos.filter(v => v.savedStatus === 'later');
  const viewedVideos = videos.filter(v => v.savedStatus === 'viewed');
  const skippedVideos = videos.filter(v => v.savedStatus === 'skip');

  if (loading || authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalSaved = claims.length + videos.length;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Research Queue</h1>
        <p className="text-muted-foreground">
          {totalSaved > 0 
            ? `You have ${totalSaved} saved items across videos and claims.`
            : "No saved items yet. Browse sections and bookmark content to build your queue."
          }
        </p>
        {!isAuthenticated && totalSaved > 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
            ⚠️ Items saved locally only. Sign in to sync across devices.
          </p>
        )}
      </div>

      {totalSaved === 0 ? (
        <Card className="p-12 text-center">
          <Bookmark className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No saved items yet</h2>
          <p className="text-muted-foreground mb-4">
            Browse sections and use the bookmark buttons on videos and claims to save them here.
          </p>
          <Button asChild>
            <a href="/">Start Exploring</a>
          </Button>
        </Card>
      ) : (
        <Tabs defaultValue="later" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="later" className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              To Watch ({laterClaims.length + laterVideos.length})
            </TabsTrigger>
            <TabsTrigger value="viewed" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Viewed ({viewedClaims.length + viewedVideos.length})
            </TabsTrigger>
            <TabsTrigger value="skip" className="flex items-center gap-2">
              <SkipForward className="w-4 h-4" />
              Skipped ({skippedClaims.length + skippedVideos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="later" className="space-y-4">
            {laterVideos.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Videos</h3>
                {laterVideos.map(video => (
                  <VideoItemCard key={video.id} video={video} onStatusChange={updateStatus} />
                ))}
              </div>
            )}
            {laterClaims.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Claims</h3>
                {laterClaims.map(claim => (
                  <ClaimItemCard key={claim.id} claim={claim} onStatusChange={updateStatus} />
                ))}
              </div>
            )}
            {laterVideos.length === 0 && laterClaims.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No items saved for later.</p>
            )}
          </TabsContent>

          <TabsContent value="viewed" className="space-y-4">
            {viewedVideos.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Videos</h3>
                {viewedVideos.map(video => (
                  <VideoItemCard key={video.id} video={video} onStatusChange={updateStatus} />
                ))}
              </div>
            )}
            {viewedClaims.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Claims</h3>
                {viewedClaims.map(claim => (
                  <ClaimItemCard key={claim.id} claim={claim} onStatusChange={updateStatus} />
                ))}
              </div>
            )}
            {viewedVideos.length === 0 && viewedClaims.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No viewed items yet.</p>
            )}
          </TabsContent>

          <TabsContent value="skip" className="space-y-4">
            {skippedVideos.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Videos</h3>
                {skippedVideos.map(video => (
                  <VideoItemCard key={video.id} video={video} onStatusChange={updateStatus} />
                ))}
              </div>
            )}
            {skippedClaims.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Claims</h3>
                {skippedClaims.map(claim => (
                  <ClaimItemCard key={claim.id} claim={claim} onStatusChange={updateStatus} />
                ))}
              </div>
            )}
            {skippedVideos.length === 0 && skippedClaims.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No skipped items.</p>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function VideoItemCard({ 
  video, 
  onStatusChange 
}: { 
  video: EnrichedVideo; 
  onStatusChange: (type: 'video' | 'claim', id: string, status: 'viewed' | 'later' | 'skip') => void;
}) {
  const youtubeId = getYouTubeId(video.url);
  const thumbnail = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg` : null;

  return (
    <Card className="overflow-hidden">
      <div className="flex gap-4">
        <div className="w-32 h-20 shrink-0 bg-muted">
          {thumbnail ? (
            <img src={thumbnail} alt={video.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 py-3 pr-4">
          <h4 className="font-medium text-sm line-clamp-1">{video.title}</h4>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{video.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <a 
              href={video.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Watch <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-muted-foreground">|</span>
            <StatusButtons 
              currentStatus={video.savedStatus} 
              onStatusChange={(status) => onStatusChange('video', video.id, status)} 
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

function ClaimItemCard({ 
  claim, 
  onStatusChange 
}: { 
  claim: EnrichedClaim; 
  onStatusChange: (type: 'video' | 'claim', id: string, status: 'viewed' | 'later' | 'skip') => void;
}) {
  return (
    <Card className="p-4">
      <p className="font-medium text-sm line-clamp-2">{claim.claim}</p>
      <p className="text-xs text-muted-foreground mt-1">
        {claim.source} • Section {claim.section_id.toUpperCase()}
      </p>
      <div className="flex items-center gap-2 mt-2">
        <StatusButtons 
          currentStatus={claim.savedStatus} 
          onStatusChange={(status) => onStatusChange('claim', claim.id, status)} 
        />
      </div>
    </Card>
  );
}

function StatusButtons({ 
  currentStatus, 
  onStatusChange 
}: { 
  currentStatus: 'viewed' | 'later' | 'skip'; 
  onStatusChange: (status: 'viewed' | 'later' | 'skip') => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onStatusChange('viewed')}
        className={cn(
          "p-1 rounded hover:bg-muted transition-colors",
          currentStatus === 'viewed' && "text-green-500"
        )}
        title="Mark as viewed"
      >
        <Eye className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onStatusChange('later')}
        className={cn(
          "p-1 rounded hover:bg-muted transition-colors",
          currentStatus === 'later' && "text-yellow-500"
        )}
        title="Save for later"
      >
        <Bookmark className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onStatusChange('skip')}
        className={cn(
          "p-1 rounded hover:bg-muted transition-colors",
          currentStatus === 'skip' && "text-muted-foreground"
        )}
        title="Skip"
      >
        <SkipForward className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
