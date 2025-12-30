import { useState, useMemo } from "react";
import { Search, FileText, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqData, themes } from "@/data/faqData";
import { BackButton } from "@/components/BackButton";

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  const filteredFAQs = useMemo(() => {
    return faqData.filter((faq) => {
      const matchesSearch =
        searchQuery === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTheme = !activeTheme || faq.theme === activeTheme;
      return matchesSearch && matchesTheme;
    });
  }, [searchQuery, activeTheme]);

  const getThemeInfo = (themeId: string) =>
    themes.find((t) => t.id === themeId);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <BackButton />
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            100 questions skeptics and researchers ask most—with sourced answers
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Theme Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-thin">
          <button
            onClick={() => setActiveTheme(null)}
            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              !activeTheme
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({faqData.length})
          </button>
          {themes.map((theme) => {
            const count = faqData.filter((f) => f.theme === theme.id).length;
            return (
              <button
                key={theme.id}
                onClick={() => setActiveTheme(theme.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTheme === theme.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{theme.icon}</span>
                {theme.label}
                <span className="opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredFAQs.length} of {faqData.length} questions
        </p>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-3">
          {filteredFAQs.map((faq) => {
            const themeInfo = getThemeInfo(faq.theme);
            return (
              <AccordionItem
                key={faq.id}
                value={`faq-${faq.id}`}
                className="border border-border rounded-lg px-4 bg-card"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-start gap-3 text-left">
                    <span className="text-xl mt-0.5">{themeInfo?.icon}</span>
                    <div className="flex-1">
                      <span className="font-medium text-foreground">
                        {faq.question}
                      </span>
                      <Badge
                        variant="outline"
                        className={`ml-3 text-xs ${themeInfo?.color}`}
                      >
                        {themeInfo?.label}
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-9 pb-2">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {faq.answer}
                    </p>

                    {/* Related Links */}
                    {(faq.relatedFigures?.length ||
                      faq.relatedSections?.length) && (
                      <div className="pt-3 border-t border-border">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">
                          Related Evidence
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {faq.relatedSections?.map((section) => (
                            <Link
                              key={section}
                              to={`/section/${section}`}
                              className="inline-flex items-center gap-1 text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded transition-colors"
                            >
                              <FileText className="w-3 h-3" />
                              Section {section}
                            </Link>
                          ))}
                          {faq.relatedFigures?.map((figure) => (
                            <Link
                              key={figure}
                              to={`/figures?search=${encodeURIComponent(figure)}`}
                              className="inline-flex items-center gap-1 text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded transition-colors"
                            >
                              <Users className="w-3 h-3" />
                              {figure}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* No Results */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No questions match your search.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveTheme(null);
              }}
              className="text-primary hover:underline mt-2"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
