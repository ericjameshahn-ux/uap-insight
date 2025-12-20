import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  BookOpen,
  Database,
  Users,
  Atom,
  FileText,
  Video,
  ChevronDown,
  Menu,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { ConvictionBadge } from "@/components/ConvictionBadge";
import { cn } from "@/lib/utils";
import { supabase, Section } from "@/lib/supabase";

// Fallback sections data when database isn't connected
const fallbackSections: Section[] = [
  { id: 'intro', letter: 'INTRO', title: 'Introduction & Context', conviction: 'INFO', description: '', sort_order: 0 },
  { id: 'a', letter: 'A', title: 'UAP Exist', conviction: 'HIGH', description: '', sort_order: 1 },
  { id: 'b', letter: 'B', title: 'Real Physical Objects', conviction: 'HIGH', description: '', sort_order: 2 },
  { id: 'c', letter: 'C', title: 'Physics-Defying Capabilities', conviction: 'HIGH', description: '', sort_order: 3 },
  { id: 'd', letter: 'D', title: 'Historical Precedent', conviction: 'HIGH', description: '', sort_order: 4 },
  { id: 'e', letter: 'E', title: 'Global Phenomena', conviction: 'HIGH', description: '', sort_order: 5 },
  { id: 'f', letter: 'F', title: 'USG Has More Data', conviction: 'HIGH', description: '', sort_order: 6 },
  { id: 'g', letter: 'G', title: 'USG May Have Materials', conviction: 'MEDIUM-HIGH', description: '', sort_order: 7 },
  { id: 'h', letter: 'H', title: 'Breakaway Civilization & Finance', conviction: 'MEDIUM', description: '', sort_order: 8 },
  { id: 'i', letter: 'I', title: 'Consciousness & Contact', conviction: 'MEDIUM', description: '', sort_order: 9 },
  { id: 'j', letter: 'J', title: 'Physics R&D', conviction: 'MEDIUM', description: '', sort_order: 10 },
  { id: 'k', letter: 'K', title: 'NHI Biological Encounters', conviction: 'MEDIUM', description: '', sort_order: 11 },
  { id: 'l', letter: 'L', title: 'Adjacent Tech & Investment', conviction: 'MEDIUM-HIGH', description: '', sort_order: 12 },
  { id: 'm', letter: 'M', title: 'Other Adjacent Info', conviction: 'INFO', description: '', sort_order: 13 },
];

const utilityNav = [
  { title: "Claims Database", url: "/claims", icon: Database },
  { title: "Key Figures", url: "/figures", icon: Users },
  { title: "Physics Analysis", url: "/physics", icon: Atom },
  { title: "Documents", url: "/documents", icon: FileText },
  { title: "Videos", url: "/videos", icon: Video },
];

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [sections, setSections] = useState<Section[]>(fallbackSections);

  useEffect(() => {
    const fetchSections = async () => {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .order('sort_order');
      
      if (data && !error) {
        setSections(data);
      }
    };
    fetchSections();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className={cn("border-r border-sidebar-border", collapsed ? "w-14" : "w-64")}>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sm">UAP Research</span>
              <span className="text-xs text-muted-foreground">Navigator</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="scrollbar-thin">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-4 py-2">
            {!collapsed && "Research Sections"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sections.map((section) => {
                const path = section.letter === 'INTRO' ? '/' : `/section/${section.letter.toLowerCase()}`;
                const active = isActive(path);
                
                return (
                  <SidebarMenuItem key={section.id}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={path}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
                          active 
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                            : "hover:bg-sidebar-accent/50"
                        )}
                      >
                        <span className="font-mono font-medium text-xs w-8 shrink-0">
                          {section.letter}
                        </span>
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-sm truncate">{section.title}</span>
                            <ConvictionBadge conviction={section.conviction} className="text-[10px] shrink-0" />
                          </>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-4 py-2">
            {!collapsed && "Tools"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilityNav.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
                          active 
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                            : "hover:bg-sidebar-accent/50"
                        )}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
