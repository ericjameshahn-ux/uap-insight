import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, Plus, LogOut, Shield } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

// ─── Auth Gate ─────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      onLogin();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800">
        <CardHeader className="text-center">
          <Shield className="w-10 h-10 text-blue-400 mx-auto mb-2" />
          <CardTitle className="text-white">Admin Access</CardTitle>
          <p className="text-sm text-slate-400">Sign in with your admin account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Generic CRUD Table ────────────────────────────────────
interface CrudConfig {
  table: string;
  columns: { key: string; label: string; type: "text" | "textarea" | "boolean" | "select"; options?: string[] }[];
  idField?: string;
  orderBy?: string;
}

function CrudTable({ config }: { config: CrudConfig }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();
  const idField = config.idField || "id";

  const fetchRows = async () => {
    setLoading(true);
    let query = supabase.from(config.table).select("*");
    if (config.orderBy) query = query.order(config.orderBy);
    const { data, error } = await query;
    if (error) {
      toast({ title: "Error loading data", description: error.message, variant: "destructive" });
    } else {
      setRows(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchRows(); }, [config.table]);

  const resetForm = () => {
    const empty: Record<string, any> = {};
    config.columns.forEach((c) => {
      empty[c.key] = c.type === "boolean" ? false : "";
    });
    return empty;
  };

  const startNew = () => {
    setIsNew(true);
    setFormData(resetForm());
    setEditingRow({});
  };

  const startEdit = (row: any) => {
    setIsNew(false);
    const data: Record<string, any> = {};
    config.columns.forEach((c) => { data[c.key] = row[c.key] ?? (c.type === "boolean" ? false : ""); });
    setFormData(data);
    setEditingRow(row);
  };

  const handleSave = async () => {
    if (isNew) {
      const { error } = await supabase.from(config.table).insert([formData]);
      if (error) {
        toast({ title: "Insert failed", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Row added" });
    } else {
      const { error } = await supabase.from(config.table).update(formData).eq(idField, editingRow[idField]);
      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Row updated" });
    }
    setEditingRow(null);
    fetchRows();
  };

  const handleDelete = async (row: any) => {
    if (!confirm("Delete this row?")) return;
    const { error } = await supabase.from(config.table).delete().eq(idField, row[idField]);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Row deleted" });
    fetchRows();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{rows.length} rows</p>
        <Button onClick={startNew} size="sm">
          <Plus className="w-4 h-4 mr-1" /> Add New
        </Button>
      </div>

      {/* Edit/Create Form */}
      {editingRow && (
        <Card className="border-blue-500/50">
          <CardContent className="pt-6 space-y-3">
            {config.columns.map((col) => (
              <div key={col.key} className="space-y-1">
                <Label className="text-xs font-medium">{col.label}</Label>
                {col.type === "boolean" ? (
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!!formData[col.key]}
                      onCheckedChange={(v) => setFormData((f) => ({ ...f, [col.key]: v }))}
                    />
                    <span className="text-sm">{formData[col.key] ? "Yes" : "No"}</span>
                  </div>
                ) : col.type === "textarea" ? (
                  <Textarea
                    value={formData[col.key] || ""}
                    onChange={(e) => setFormData((f) => ({ ...f, [col.key]: e.target.value }))}
                    rows={3}
                  />
                ) : col.type === "select" && col.options ? (
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData[col.key] || ""}
                    onChange={(e) => setFormData((f) => ({ ...f, [col.key]: e.target.value }))}
                  >
                    <option value="">-- Select --</option>
                    {col.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <Input
                    value={formData[col.key] || ""}
                    onChange={(e) => setFormData((f) => ({ ...f, [col.key]: e.target.value }))}
                  />
                )}
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} size="sm">
                {isNew ? "Create" : "Save Changes"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEditingRow(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left font-medium">ID</th>
                {config.columns.slice(0, 4).map((col) => (
                  <th key={col.key} className="px-3 py-2 text-left font-medium">{col.label}</th>
                ))}
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((row) => (
                <tr key={row[idField]} className="hover:bg-muted/30">
                  <td className="px-3 py-2 font-mono text-xs max-w-[120px] truncate">{row[idField]}</td>
                  {config.columns.slice(0, 4).map((col) => (
                    <td key={col.key} className="px-3 py-2 max-w-[200px] truncate">
                      {col.type === "boolean" ? (row[col.key] ? "✓" : "—") : String(row[col.key] || "—")}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => startEdit(row)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(row)} className="text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── CRUD Configs ──────────────────────────────────────────
const videosConfig: CrudConfig = {
  table: "videos",
  orderBy: "created_at",
  columns: [
    { key: "title", label: "Title", type: "text" },
    { key: "url", label: "URL", type: "text" },
    { key: "section_id", label: "Section", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "tier", label: "Tier", type: "select", options: ["HIGH", "MEDIUM", "LOWER"] },
    { key: "recommended", label: "Recommended", type: "boolean" },
  ],
};

const claimsConfig: CrudConfig = {
  table: "claims",
  orderBy: "id",
  columns: [
    { key: "id", label: "ID (e.g. A-01)", type: "text" },
    { key: "section_id", label: "Section", type: "text" },
    { key: "claim", label: "Claim", type: "textarea" },
    { key: "tier", label: "Tier", type: "select", options: ["HIGHEST", "HIGH", "MEDIUM", "LOWER"] },
    { key: "source", label: "Source", type: "text" },
    { key: "quote", label: "Quote", type: "textarea" },
    { key: "date", label: "Date", type: "text" },
    { key: "figure_id", label: "Figure ID", type: "text" },
  ],
};

const figuresConfig: CrudConfig = {
  table: "figures",
  orderBy: "name",
  columns: [
    { key: "id", label: "ID (slug)", type: "text" },
    { key: "name", label: "Name", type: "text" },
    { key: "role", label: "Role", type: "text" },
    { key: "credentials", label: "Credentials", type: "text" },
    { key: "tier", label: "Tier", type: "select", options: ["HIGHEST", "HIGH", "MEDIUM", "LOWER"] },
    { key: "bio", label: "Bio", type: "textarea" },
  ],
};

// ─── Main Admin Page ───────────────────────────────────────
export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkAdminRole(session.user.id);
      } else {
        setIsAdmin(null);
        setCheckingAuth(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkAdminRole(session.user.id);
      } else {
        setCheckingAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    const { data } = await supabase.rpc('has_role', { _user_id: userId, _role: 'admin' });
    setIsAdmin(!!data);
    setCheckingAuth(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(null);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-slate-400">Checking authorization...</p>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onLogin={() => {}} />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <Card className="w-full max-w-md border-red-500/50 bg-slate-800">
          <CardContent className="pt-6 text-center space-y-4">
            <Shield className="w-10 h-10 text-red-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Access Denied</h2>
            <p className="text-slate-400 text-sm">
              Your account ({session.user.email}) does not have admin privileges.
            </p>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-8 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-1">
              ADMIN PANEL
            </p>
            <h1 className="text-2xl font-bold text-white">Content Manager</h1>
            <p className="text-slate-400 text-sm mt-1">{session.user.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-slate-300 border-slate-600">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="videos">
          <TabsList className="mb-6">
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="claims">Claims</TabsTrigger>
            <TabsTrigger value="figures">Figures</TabsTrigger>
          </TabsList>
          <TabsContent value="videos">
            <CrudTable config={videosConfig} />
          </TabsContent>
          <TabsContent value="claims">
            <CrudTable config={claimsConfig} />
          </TabsContent>
          <TabsContent value="figures">
            <CrudTable config={figuresConfig} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
