import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, AlertTriangle } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { ConvictionBadge } from "@/components/ConvictionBadge";

const Sections = () => {
  const { data: sections, isLoading, error } = useQuery({
    queryKey: ['sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <BackButton />
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Failed to load sections</h1>
          <p className="text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <BackButton />
        <h1 className="text-2xl font-bold mb-2">Evidence Sections</h1>
        <p className="text-muted-foreground mb-8">13 categories of UAP evidence, organized by theme and conviction level</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(13)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <BackButton />
      <h1 className="text-2xl font-bold mb-2">Evidence Sections</h1>
      <p className="text-muted-foreground mb-8">
        13 categories of UAP evidence, organized by theme and conviction level
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections?.map((section, i) => (
          <Link 
            key={section.id} 
            to={`/section/${section.letter.toLowerCase()}`}
            className="animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all group">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center font-mono font-bold text-lg text-primary shrink-0">
                    {section.letter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {section.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <ConvictionBadge conviction={section.conviction} className="text-xs" />
                    </div>
                    {section.subtitle && (
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {section.subtitle}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sections;
