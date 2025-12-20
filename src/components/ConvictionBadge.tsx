import { cn } from "@/lib/utils";

interface ConvictionBadgeProps {
  conviction: string;
  className?: string;
}

export const ConvictionBadge = ({ conviction, className }: ConvictionBadgeProps) => {
  const getConvictionClass = (conviction: string) => {
    const normalized = conviction.toLowerCase().replace(/[^a-z]/g, '');
    switch (normalized) {
      case 'highest':
        return 'conviction-highest';
      case 'high':
        return 'conviction-high';
      case 'mediumhigh':
        return 'conviction-medium-high';
      case 'medium':
        return 'conviction-medium';
      case 'lower':
        return 'conviction-lower';
      case 'info':
      default:
        return 'conviction-info';
    }
  };

  return (
    <span className={cn("conviction-badge", getConvictionClass(conviction), className)}>
      {conviction}
    </span>
  );
};
