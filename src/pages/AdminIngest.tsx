import { useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { Shield, Upload, FileJson, ChevronDown, Plus, Trash2, Loader2 } from "lucide-react";

const INGEST_PASSWORD = "fdti2026";

// ─── Types ─────────────────────────────────────────────────
interface VideoForm {
  id: string;
  title: string;
  url: string;
  source_type: string;
  duration: string;
  tier: string;
  description: string;
  detailed_analysis: string;
  key_takeaways: string;
  related_sections: string;
  recommended: boolean;
  figures_in_video: string;
  host: string;
  date_published: string;
}

interface FigureForm {
  id: string;
  name: string;
  role: string;
  credentials: string;
  tier: string;
  bio: string;
  video_url: string;
}

interface ClaimForm {
  id: string;
  section_id: string;
  claim: string;
  tier: string;
  source: string;
  quote: string;
  date: string;
  figure_id: string;
  source_video_id: string;
}

const emptyVideo = (): VideoForm => ({
  id: "", title: "", url: "", source_type: "", duration: "", tier: "",
  description: "", detailed_analysis: "", key_takeaways: "", related_sections: "",
  recommended: false, figures_in_video: "", host: "", date_published: "",
});

const emptyFigure = (): FigureForm => ({
  id: "", name: "", role: "", credentials: "", tier: "", bio: "", video_url: "",
});

const emptyClaim = (): ClaimForm => ({
  id: "", section_id: "", claim: "", tier: "", source: "", quote: "", date: "",
  figure_id: "", source_video_id: "",
});

const SOURCE_TYPES = ["interview", "documentary", "hearing", "lecture", "podcast", "panel", "news"];
const VIDEO_TIERS = ["HIGH", "MEDIUM", "LOWER"];
const CLAIM_TIERS = ["HIGH", "MEDIUM", "LOWER"];
const FIGURE_TIERS = ["HIGHEST", "HIGH", "MEDIUM", "LOWER"];

// ─── Password Gate ─────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === INGEST_PASSWORD) {
      onUnlock();
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800">
        <CardHeader className="text-center">
          <Shield className="w-10 h-10 text-blue-400 mx-auto mb-2" />
          <CardTitle className="text-white">Ingest Access</CardTitle>
          <p className="text-sm text-slate-400">Enter the ingest password</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError(""); }}
              className="bg-slate-700 border-slate-600 text-white"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Unlock</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Select Dropdown ───────────────────────────────────────
function Select({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  return (
    <select
      className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder || "-- Select --"}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ─── Main Ingest Page ──────────────────────────────────────
export default function AdminIngest() {
  const [unlocked, setUnlocked] = useState(false);
  const [video, setVideo] = useState<VideoForm>(emptyVideo());
  const [figures, setFigures] = useState<FigureForm[]>([emptyFigure()]);
  const [claims, setClaims] = useState<ClaimForm[]>([emptyClaim()]);
  const [figuresOpen, setFiguresOpen] = useState(false);
  const [claimsOpen, setClaimsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  // ── Video field updater ──
  const setV = (key: keyof VideoForm, val: any) => setVideo((v) => ({ ...v, [key]: val }));

  // ── Excel parsing ──
  const handleExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const wb = XLSX.read(ev.target?.result, { type: "array" });
        const sheetName = wb.SheetNames.find((n) => n.toLowerCase() === "videos") || wb.SheetNames[0];
        const sheet = wb.Sheets[sheetName];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        // Find first data row (skip header-like or example rows)
        const dataRow = rows.find((r) => {
          const id = String(r.id || r.ID || "").trim();
          return id.length > 3 && !/^(id|example|header)/i.test(id);
        });
        if (!dataRow) {
          toast({ title: "No data row found", description: "Could not find a valid data row in the VIDEOS sheet.", variant: "destructive" });
          return;
        }
        const get = (keys: string[]) => {
          for (const k of keys) {
            if (dataRow[k] !== undefined && dataRow[k] !== "") return String(dataRow[k]);
          }
          return "";
        };
        setVideo({
          id: get(["id", "ID"]),
          title: get(["title", "Title"]),
          url: get(["url", "URL"]),
          source_type: get(["source_type", "Source Type"]),
          duration: get(["duration", "Duration"]),
          tier: get(["tier", "Tier"]),
          description: get(["description", "Description"]),
          detailed_analysis: get(["detailed_analysis", "Detailed Analysis"]),
          key_takeaways: get(["key_takeaways", "Key Takeaways"]),
          related_sections: get(["related_sections", "Related Sections"]),
          recommended: ["true", "yes", "1", "TRUE"].includes(get(["recommended", "Recommended"]).toLowerCase()),
          figures_in_video: get(["figures_in_video", "Figures In Video"]),
          host: get(["host", "Host"]),
          date_published: get(["date_published", "Date Published"]),
        });
        toast({ title: "Excel parsed", description: `Loaded row from "${sheetName}" sheet.` });
      } catch (err: any) {
        toast({ title: "Parse error", description: err.message, variant: "destructive" });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // ── JSON parsing ──
  const [jsonInput, setJsonInput] = useState("");
  const handleJsonParse = () => {
    try {
      const obj = JSON.parse(jsonInput);
      setVideo({
        id: obj.id || "",
        title: obj.title || "",
        url: obj.url || "",
        source_type: obj.source_type || "",
        duration: obj.duration || "",
        tier: obj.tier || "",
        description: obj.description || "",
        detailed_analysis: obj.detailed_analysis || "",
        key_takeaways: obj.key_takeaways || "",
        related_sections: Array.isArray(obj.related_sections) ? obj.related_sections.join(", ") : (obj.related_sections || ""),
        recommended: !!obj.recommended,
        figures_in_video: Array.isArray(obj.figures_in_video) ? obj.figures_in_video.join(", ") : (obj.figures_in_video || ""),
        host: obj.host || "",
        date_published: obj.date_published || "",
      });
      toast({ title: "JSON parsed" });
    } catch (err: any) {
      toast({ title: "Invalid JSON", description: err.message, variant: "destructive" });
    }
  };

  // ── Figure helpers ──
  const updateFigure = (idx: number, key: keyof FigureForm, val: string) => {
    setFigures((f) => f.map((fig, i) => i === idx ? { ...fig, [key]: val } : fig));
  };
  const removeFigure = (idx: number) => setFigures((f) => f.filter((_, i) => i !== idx));

  // ── Claim helpers ──
  const updateClaim = (idx: number, key: keyof ClaimForm, val: string) => {
    setClaims((c) => c.map((cl, i) => i === idx ? { ...cl, [key]: val } : cl));
  };
  const removeClaim = (idx: number) => setClaims((c) => c.filter((_, i) => i !== idx));

  // ── Submit ──
  const handleSubmit = async () => {
    if (!video.id || !video.title) {
      toast({ title: "Video ID and Title are required", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    let inserted = { videos: 0, figures: 0, claims: 0 };

    try {
      // Parse array fields
      const relatedSections = video.related_sections
        ? video.related_sections.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      const figuresInVideo = video.figures_in_video
        ? video.figures_in_video.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const videoRow: any = {
        id: video.id,
        title: video.title,
        url: video.url || null,
        source_type: video.source_type || null,
        duration: video.duration || null,
        tier: video.tier || null,
        description: video.description || null,
        detailed_analysis: video.detailed_analysis || null,
        key_takeaways: video.key_takeaways || null,
        related_sections: relatedSections.length ? relatedSections : null,
        recommended: video.recommended,
        figures_in_video: figuresInVideo.length ? figuresInVideo : null,
        host: video.host || null,
        date_published: video.date_published || null,
      };

      const { error: vErr } = await supabase.from("videos").insert([videoRow]);
      if (vErr) throw new Error(`Video insert failed: ${vErr.message}`);
      inserted.videos = 1;

      // Figures
      const validFigures = figures.filter((f) => f.id && f.name);
      if (validFigures.length) {
        const figRows = validFigures.map((f) => ({
          id: f.id,
          name: f.name,
          role: f.role || null,
          credentials: f.credentials || null,
          tier: f.tier || null,
          bio: f.bio || null,
          video_url: f.video_url || null,
        }));
        const { error: fErr } = await supabase.from("figures").insert(figRows);
        if (fErr) throw new Error(`Figures insert failed: ${fErr.message}`);
        inserted.figures = validFigures.length;
      }

      // Claims
      const validClaims = claims.filter((c) => c.id && c.claim);
      if (validClaims.length) {
        const claimRows = validClaims.map((c) => ({
          id: c.id,
          section_id: c.section_id || null,
          claim: c.claim,
          tier: c.tier || null,
          source: c.source || null,
          quote: c.quote || null,
          date: c.date || null,
          figure_id: c.figure_id || null,
          source_video_id: c.source_video_id || null,
        }));
        const { error: cErr } = await supabase.from("claims").insert(claimRows);
        if (cErr) throw new Error(`Claims insert failed: ${cErr.message}`);
        inserted.claims = validClaims.length;
      }

      toast({
        title: "Success!",
        description: `Inserted ${inserted.videos} video, ${inserted.figures} figure(s), ${inserted.claims} claim(s).`,
      });

      // Reset
      setVideo(emptyVideo());
      setFigures([emptyFigure()]);
      setClaims([emptyClaim()]);
      setJsonInput("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400";
  const labelClass = "text-xs font-medium text-slate-300";

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="py-8 px-4 border-b border-slate-700">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-1">ADMIN</p>
          <h1 className="text-2xl font-bold">Content Ingest</h1>
          <p className="text-slate-400 text-sm mt-1">Add videos, figures, and claims from Excel or JSON</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Input Mode Tabs */}
        <Tabs defaultValue="excel">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="excel" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400">
              <Upload className="w-4 h-4 mr-2" /> Upload Excel
            </TabsTrigger>
            <TabsTrigger value="json" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400">
              <FileJson className="w-4 h-4 mr-2" /> Paste JSON
            </TabsTrigger>
          </TabsList>

          <TabsContent value="excel" className="mt-4">
            <Card className="border-slate-700 bg-slate-800">
              <CardContent className="pt-6">
                <Label className={labelClass}>Upload .xlsx file</Label>
                <Input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcel}
                  className={`${inputClass} mt-1 file:text-slate-300 file:bg-slate-600 file:border-0 file:rounded file:px-3 file:py-1 file:mr-3`}
                />
                <p className="text-xs text-slate-500 mt-2">
                  Expects a sheet named "VIDEOS" with column headers matching field names.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="json" className="mt-4">
            <Card className="border-slate-700 bg-slate-800">
              <CardContent className="pt-6 space-y-3">
                <Label className={labelClass}>Paste JSON object</Label>
                <Textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  rows={8}
                  placeholder='{"id": "...", "title": "...", ...}'
                  className={inputClass}
                />
                <Button onClick={handleJsonParse} size="sm" variant="secondary">
                  Parse JSON
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Video Form */}
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Video Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className={labelClass}>ID *</Label>
                <Input value={video.id} onChange={(e) => setV("id", e.target.value)} className={inputClass} placeholder="e.g. coulthart-ross-2023" />
              </div>
              <div className="space-y-1">
                <Label className={labelClass}>Title *</Label>
                <Input value={video.title} onChange={(e) => setV("title", e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-1">
                <Label className={labelClass}>URL</Label>
                <Input value={video.url} onChange={(e) => setV("url", e.target.value)} className={inputClass} placeholder="https://..." />
              </div>
              <div className="space-y-1">
                <Label className={labelClass}>Source Type</Label>
                <Select value={video.source_type} onChange={(v) => setV("source_type", v)} options={SOURCE_TYPES} />
              </div>
              <div className="space-y-1">
                <Label className={labelClass}>Duration</Label>
                <Input value={video.duration} onChange={(e) => setV("duration", e.target.value)} className={inputClass} placeholder="e.g. 1:23:45" />
              </div>
              <div className="space-y-1">
                <Label className={labelClass}>Tier</Label>
                <Select value={video.tier} onChange={(v) => setV("tier", v)} options={VIDEO_TIERS} />
              </div>
              <div className="space-y-1">
                <Label className={labelClass}>Host</Label>
                <Input value={video.host} onChange={(e) => setV("host", e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-1">
                <Label className={labelClass}>Date Published</Label>
                <Input type="date" value={video.date_published} onChange={(e) => setV("date_published", e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-1">
                <Label className={labelClass}>Related Sections (comma-sep)</Label>
                <Input value={video.related_sections} onChange={(e) => setV("related_sections", e.target.value)} className={inputClass} placeholder="a, b, c" />
              </div>
              <div className="space-y-1">
                <Label className={labelClass}>Figures in Video (comma-sep)</Label>
                <Input value={video.figures_in_video} onChange={(e) => setV("figures_in_video", e.target.value)} className={inputClass} placeholder="grusch, mellon" />
              </div>
              <div className="flex items-center gap-3 pt-5">
                <Switch checked={video.recommended} onCheckedChange={(v) => setV("recommended", v)} />
                <Label className="text-sm text-slate-300">Recommended</Label>
              </div>
            </div>
            <div className="space-y-1">
              <Label className={labelClass}>Description</Label>
              <Textarea value={video.description} onChange={(e) => setV("description", e.target.value)} rows={3} className={inputClass} />
            </div>
            <div className="space-y-1">
              <Label className={labelClass}>Detailed Analysis</Label>
              <Textarea value={video.detailed_analysis} onChange={(e) => setV("detailed_analysis", e.target.value)} rows={4} className={inputClass} />
            </div>
            <div className="space-y-1">
              <Label className={labelClass}>Key Takeaways</Label>
              <Textarea value={video.key_takeaways} onChange={(e) => setV("key_takeaways", e.target.value)} rows={3} className={inputClass} />
            </div>
          </CardContent>
        </Card>

        {/* Figures Collapsible */}
        <Collapsible open={figuresOpen} onOpenChange={setFiguresOpen}>
          <Card className="border-slate-700 bg-slate-800">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-slate-750">
                <CardTitle className="text-lg text-white flex items-center justify-between">
                  Also add figures ({figures.filter((f) => f.id).length})
                  <ChevronDown className={`w-5 h-5 transition-transform ${figuresOpen ? "rotate-180" : ""}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {figures.map((fig, idx) => (
                  <div key={idx} className="border border-slate-600 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-300">Figure {idx + 1}</span>
                      {figures.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => removeFigure(idx)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className={labelClass}>ID</Label>
                        <Input value={fig.id} onChange={(e) => updateFigure(idx, "id", e.target.value)} className={inputClass} placeholder="e.g. grusch" />
                      </div>
                      <div className="space-y-1">
                        <Label className={labelClass}>Name</Label>
                        <Input value={fig.name} onChange={(e) => updateFigure(idx, "name", e.target.value)} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <Label className={labelClass}>Role</Label>
                        <Input value={fig.role} onChange={(e) => updateFigure(idx, "role", e.target.value)} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <Label className={labelClass}>Credentials</Label>
                        <Input value={fig.credentials} onChange={(e) => updateFigure(idx, "credentials", e.target.value)} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <Label className={labelClass}>Tier</Label>
                        <Select value={fig.tier} onChange={(v) => updateFigure(idx, "tier", v)} options={FIGURE_TIERS} />
                      </div>
                      <div className="space-y-1">
                        <Label className={labelClass}>Video URL</Label>
                        <Input value={fig.video_url} onChange={(e) => updateFigure(idx, "video_url", e.target.value)} className={inputClass} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className={labelClass}>Bio</Label>
                      <Textarea value={fig.bio} onChange={(e) => updateFigure(idx, "bio", e.target.value)} rows={2} className={inputClass} />
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => setFigures((f) => [...f, emptyFigure()])} className="border-slate-600 text-slate-300">
                  <Plus className="w-4 h-4 mr-1" /> Add Figure
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Claims Collapsible */}
        <Collapsible open={claimsOpen} onOpenChange={setClaimsOpen}>
          <Card className="border-slate-700 bg-slate-800">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-slate-750">
                <CardTitle className="text-lg text-white flex items-center justify-between">
                  Also add claims ({claims.filter((c) => c.id).length})
                  <ChevronDown className={`w-5 h-5 transition-transform ${claimsOpen ? "rotate-180" : ""}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {claims.map((cl, idx) => (
                  <div key={idx} className="border border-slate-600 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-300">Claim {idx + 1}</span>
                      {claims.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => removeClaim(idx)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className={labelClass}>ID</Label>
                        <Input value={cl.id} onChange={(e) => updateClaim(idx, "id", e.target.value)} className={inputClass} placeholder="e.g. A-01" />
                      </div>
                      <div className="space-y-1">
                        <Label className={labelClass}>Section ID</Label>
                        <Input value={cl.section_id} onChange={(e) => updateClaim(idx, "section_id", e.target.value)} className={inputClass} placeholder="e.g. a" />
                      </div>
                      <div className="space-y-1">
                        <Label className={labelClass}>Tier</Label>
                        <Select value={cl.tier} onChange={(v) => updateClaim(idx, "tier", v)} options={CLAIM_TIERS} />
                      </div>
                      <div className="space-y-1">
                        <Label className={labelClass}>Source</Label>
                        <Input value={cl.source} onChange={(e) => updateClaim(idx, "source", e.target.value)} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <Label className={labelClass}>Date</Label>
                        <Input type="date" value={cl.date} onChange={(e) => updateClaim(idx, "date", e.target.value)} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <Label className={labelClass}>Figure ID</Label>
                        <Input value={cl.figure_id} onChange={(e) => updateClaim(idx, "figure_id", e.target.value)} className={inputClass} />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label className={labelClass}>Source Video ID</Label>
                        <Input value={cl.source_video_id} onChange={(e) => updateClaim(idx, "source_video_id", e.target.value)} className={inputClass} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className={labelClass}>Claim</Label>
                      <Textarea value={cl.claim} onChange={(e) => updateClaim(idx, "claim", e.target.value)} rows={2} className={inputClass} />
                    </div>
                    <div className="space-y-1">
                      <Label className={labelClass}>Quote</Label>
                      <Textarea value={cl.quote} onChange={(e) => updateClaim(idx, "quote", e.target.value)} rows={2} className={inputClass} />
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => setClaims((c) => [...c, emptyClaim()])} className="border-slate-600 text-slate-300">
                  <Plus className="w-4 h-4 mr-1" /> Add Claim
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Submit */}
        <Button onClick={handleSubmit} disabled={submitting} size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Inserting...</> : "Submit to Supabase"}
        </Button>
      </div>
    </div>
  );
}
