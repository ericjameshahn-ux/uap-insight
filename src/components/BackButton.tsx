import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className }: BackButtonProps) {
  const navigate = useNavigate();
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    // Check if there's navigation history (more than the current page)
    setHasHistory(window.history.length > 1);
  }, []);

  if (!hasHistory) return null;

  return (
    <button
      onClick={() => navigate(-1)}
      className={cn(
        "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4",
        className
      )}
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </button>
  );
}

export default BackButton;
