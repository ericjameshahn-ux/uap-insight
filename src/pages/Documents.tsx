import { useState, useEffect } from "react";
import { FileText, Download, ExternalLink, Filter, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { supabase, Document } from "@/lib/supabase";

const sectionOptions = ['ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
const AI_ASSISTANT_URL = "https://notebooklm.google.com/notebook/66050f25-44cd-4b42-9de0-46ba9979aad7";

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<Document[]>([]);
  const [sectionFilter, setSectionFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('documents')
        .select('*')
        .order('title');
      
      if (data) {
        setDocuments(data);
        setFilteredDocs(data);
      }
      setLoading(false);
    };

    fetchDocuments();
  }, []);

  useEffect(() => {
    if (sectionFilter === "ALL") {
      setFilteredDocs(documents);
    } else {
      setFilteredDocs(documents.filter(doc => doc.section_id?.toUpperCase() === sectionFilter));
    }
  }, [sectionFilter, documents]);

  const getFileIcon = (path: string) => {
    if (path.endsWith('.pdf')) return '📄';
    if (path.endsWith('.doc') || path.endsWith('.docx')) return '📝';
    if (path.endsWith('.xls') || path.endsWith('.xlsx')) return '📊';
    return '📁';
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold mb-2">Documents</h1>
        <p className="text-muted-foreground">
          Official documents, reports, and research papers related to UAP.
        </p>
      </div>

      {/* AI Research Assistant Card */}
      <div className="mb-8 animate-fade-in" style={{ animationDelay: '50ms' }}>
        <a 
          href={AI_ASSISTANT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block card-elevated p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all group"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                Query All Source Documents with AI
              </h2>
              <p className="text-sm text-muted-foreground mb-3">
                Ask questions about all source materials using NotebookLM's AI assistant. 
                Get instant answers, summaries, and cross-referenced insights from the entire document collection.
              </p>
              <Button size="sm" className="pointer-events-none">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open AI Assistant
              </Button>
            </div>
          </div>
        </a>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <Select value={sectionFilter} onValueChange={setSectionFilter}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by section" />
          </SelectTrigger>
          <SelectContent>
            {sectionOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option === 'ALL' ? 'All Sections' : `Section ${option}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card-elevated p-5 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc, i) => (
            <div 
              key={doc.id} 
              className="card-elevated p-5 animate-fade-in hover:shadow-md transition-shadow"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl">
                  {getFileIcon(doc.file_path)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{doc.title}</h3>
                  {doc.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {doc.description}
                    </p>
                  )}
                  {doc.section_id && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-muted rounded text-xs font-mono">
                      Section {doc.section_id.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <a
                  href={doc.file_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  {doc.file_path.startsWith('http') ? (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      View Document
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download
                    </>
                  )}
                </a>
              </div>
            </div>
          ))}

          {filteredDocs.length === 0 && (
            <div className="card-elevated p-12 text-center text-muted-foreground col-span-3">
              {documents.length === 0 
                ? "No documents available. Connect your Supabase database to load data."
                : "No documents match your filter."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
