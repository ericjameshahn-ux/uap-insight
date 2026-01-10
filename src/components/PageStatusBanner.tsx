import { Calendar, Construction, RefreshCw, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type PageStatus = 'stable' | 'under-construction' | 'major-updates-pending';

interface PageStatusBannerProps {
  lastUpdated: string;
  status: PageStatus;
  statusNote?: string;
}

const statusConfig = {
  stable: {
    icon: CheckCircle,
    label: 'Stable',
    badgeClass: 'bg-green-100 text-green-700 border-green-200',
    bannerClass: 'bg-muted/50 border-border',
  },
  'under-construction': {
    icon: Construction,
    label: '🚧 Under Construction',
    badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
    bannerClass: 'bg-amber-50/50 border-amber-200/50',
  },
  'major-updates-pending': {
    icon: RefreshCw,
    label: '↻ Updates Pending',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    bannerClass: 'bg-blue-50/50 border-blue-200/50',
  },
};

export function PageStatusBanner({ lastUpdated, status, statusNote }: PageStatusBannerProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div
      className={cn(
        'rounded-lg border px-4 py-2.5 mb-6',
        config.bannerClass
      )}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>Last updated: {lastUpdated}</span>
        </div>
        
        <Badge
          variant="outline"
          className={cn('text-xs font-medium', config.badgeClass)}
        >
          {status !== 'stable' && <StatusIcon className="h-3 w-3 mr-1" />}
          {config.label}
        </Badge>
      </div>
      
      {statusNote && (
        <p className="text-xs text-muted-foreground mt-1.5 pl-5">
          {statusNote}
        </p>
      )}
    </div>
  );
}
