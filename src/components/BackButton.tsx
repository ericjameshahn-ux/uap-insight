import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export function BackButton() {
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
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </button>
  );
}
