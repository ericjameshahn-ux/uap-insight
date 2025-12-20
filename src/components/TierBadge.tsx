import { cn } from "@/lib/utils";

interface TierBadgeProps {
  tier: string;
  className?: string;
}

export const TierBadge = ({ tier, className }: TierBadgeProps) => {
  const getTierClass = (tier: string) => {
    switch (tier.toUpperCase()) {
      case 'HIGHEST':
        return 'conviction-highest';
      case 'HIGH':
        return 'conviction-high';
      case 'MEDIUM':
        return 'conviction-medium';
      case 'LOWER':
        return 'conviction-lower';
      default:
        return 'conviction-info';
    }
  };

  return (
    <span className={cn("conviction-badge", getTierClass(tier), className)}>
      {tier}
    </span>
  );
};
