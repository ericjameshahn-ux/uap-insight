import { FileText } from "lucide-react";
import { Document } from "@/lib/supabase";

interface DocumentCardProps {
  document: Document;
}

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground text-sm leading-tight">
            {document.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {document.description}
          </p>
        </div>
      </div>
    </div>
  );
}
