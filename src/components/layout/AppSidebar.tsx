import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Database,
  Users,
  Atom,
  FileText,
  Video,
  Sparkles,
  HelpCircle,
  Play,
  MessageSquare,
  Bookmark,
  Calendar,
  ChevronRight,
  Star,
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
  useSidebar,
} from "@/components/ui/sidebar";
import { ConvictionBadge } from "@/components/ConvictionBadge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase, Section } from "@/lib/supabase";

// Fallback sections data when database isn't connected
const fallbackSections: Section[] = [
  { id: 'framework', letter: 'START', title: 'Start Here: Framework', conviction: 'INFO', description: '', sort_order: -1 },
  { id: 'observables', letter: '5+1', title: 'The Six Observables', conviction: 'HIGH', description: '', sort_order: 0 },
  { id: 'hypotheses', letter: '🔮', title: 'Emerging Hypotheses', conviction: 'MEDIUM', description: '', sort_order: 0.5 },
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
  { title: "My Queue", url: "/saved", icon: Bookmark },
  { title: "Timeline", url: "/timeline", icon: Calendar },
  { title: "Claims Database", url: "/claims", icon: Database },
  { title: "Key Figures", url: "/figures", icon: Users },
  { title: "Physics Analysis", url: "/physics", icon: Atom },
  { title: "Documents", url: "/documents", icon: FileText },
  { title: "Videos", url: "/videos", icon: Video },
];

const AI_ASSISTANT_URL = "https://notebooklm.google.com/notebook/66050f25-44cd-4b42-9de0-46ba9979aad7";

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [sections, setSections] = useState<Section[]>(fallbackSections);
  
  // Path state
  const [userPath, setUserPath] = useState<string[]>([]);
  const [pathIndex, setPathIndex] = useState(0);
  const [archetypeName, setArchetypeName] = useState('');

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

    // Load path from localStorage
    const loadPath = () => {
      try {
        const pathData = localStorage.getItem('uap_path');
        const indexData = localStorage.getItem('uap_path_index');
        const nameData = localStorage.getItem('uap_archetype_name');
        
        console.log('🔍 AppSidebar loading path:');
        console.log('  Raw uap_path:', pathData);
        
        if (pathData && pathData !== 'null' && pathData !== '[]') {
          const parsed = JSON.parse(pathData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log('  Parsed path:', parsed);
            setUserPath(parsed);
            setPathIndex(parseInt(indexData || '0', 10));
            setArchetypeName(nameData || '');
          } else {
            console.log('  Path is empty, clearing state');
            setUserPath([]);
            setPathIndex(0);
            setArchetypeName('');
          }
        } else {
          console.log('  No path data found');
          setUserPath([]);
          setPathIndex(0);
          setArchetypeName('');
        }
      } catch (e) {
        console.error('❌ Error loading path:', e);
        setUserPath([]);
      }
    };
    
    loadPath();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadPath();
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;
  const isInPath = (letter: string) => userPath.includes(letter.toLowerCase());

  const progressPercent = userPath.length > 0 
    ? ((pathIndex + 1) / userPath.length) * 100 
    : 0;

  const handleContinuePath = () => {
    if (userPath.length > 0 && pathIndex < userPath.length) {
      navigate(`/section/${userPath[pathIndex]}`);
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
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
        {/* YOUR PATH Section */}
        {userPath.length > 0 && !collapsed && (
          <SidebarGroup className="border-b border-sidebar-border pb-4">
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-primary px-4 py-2 font-semibold">
              <Link to="/my-path" className="hover:underline">
                Your Path
              </Link>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{archetypeName}</p>
                    <p className="text-xs text-muted-foreground">
                      {pathIndex + 1}/{userPath.length} sections
                    </p>
                  </div>
                </div>
                <Progress value={progressPercent} className="h-1.5" />
                <div className="flex items-center gap-1 flex-wrap">
                  {userPath.map((s, i) => (
                    <Link
                      key={s}
                      to={`/section/${s}`}
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-mono uppercase transition-colors",
                        i === pathIndex
                          ? "bg-primary text-primary-foreground"
                          : i < pathIndex
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {s}
                    </Link>
                  ))}
                </div>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={handleContinuePath}
                >
                  <Play className="w-3 h-3 mr-1" />
                  Continue
                </Button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Collapsed state path indicator */}
        {userPath.length > 0 && collapsed && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={handleContinuePath}
                      className="flex items-center justify-center p-2 rounded-md bg-primary/10 hover:bg-primary/20"
                      title={`Continue: ${archetypeName}`}
                    >
                      <Play className="w-4 h-4 text-primary" />
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-4 py-2">
            {!collapsed && "Research Sections"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sections.filter(section => section.letter != null).map((section) => {
                const path = section.letter === 'START' 
                  ? '/intro' 
                  : section.letter === '5+1' 
                    ? '/observables' 
                    : section.letter === '🔮'
                      ? '/hypotheses'
                      : `/section/${section.letter.toLowerCase()}`;
                const active = isActive(path);
                const inPath = isInPath(section.letter);
                const isNextInPath = userPath.length > 0 && pathIndex < userPath.length && 
                  section.letter.toLowerCase() === userPath[pathIndex];
                const isCurrentInPath = inPath && section.letter.toLowerCase() === userPath[pathIndex];
                
                return (
                  <SidebarMenuItem key={section.id}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={path}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 rounded-md transition-all relative",
                          // Active page styling - prominent left border
                          active && "bg-primary/10 border-l-4 border-primary font-semibold",
                          // In path but not active
                          !active && inPath && "bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50",
                          // Next section in path gets pulse animation
                          !active && isNextInPath && "animate-pulse bg-amber-100 dark:bg-amber-900/40",
                          // Default styling
                          !active && !inPath && "hover:bg-sidebar-accent/50"
                        )}
                      >
                        {/* Arrow indicator for active page */}
                        {active && (
                          <ChevronRight className="w-3 h-3 text-primary shrink-0 -ml-1" />
                        )}
                        {/* Star indicator for path sections */}
                        {!active && inPath && !collapsed && (
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0 -ml-1" />
                        )}
                        <span className={cn(
                          "font-mono font-medium text-xs shrink-0",
                          active ? "text-primary w-6" : inPath ? "text-amber-600 dark:text-amber-400 font-bold w-8" : "w-8",
                        )}>
                          {section.letter}
                        </span>
                        {!collapsed && (
                          <>
                            <span className={cn(
                              "flex-1 text-sm truncate",
                              active && "text-primary",
                              !active && inPath && "text-amber-700 dark:text-amber-300"
                            )}>
                              {section.title}
                            </span>
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
              
              {/* UAP Navigator AI */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/chat"
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
                      isActive('/chat')
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "hover:bg-sidebar-accent/50 text-primary"
                    )}
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    {!collapsed && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">UAP Navigator AI</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary rounded font-semibold">NEW</span>
                      </div>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* AI Research Assistant (External) */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href={AI_ASSISTANT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2 rounded-md transition-colors hover:bg-sidebar-accent/50 text-muted-foreground"
                  >
                    <Sparkles className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="text-sm">NotebookLM Assistant</span>}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* About Section */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-4 py-2">
            {!collapsed && "About"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/about-quiz"
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
                      isActive('/about-quiz')
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                        : "hover:bg-sidebar-accent/50"
                    )}
                  >
                    <HelpCircle className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="text-sm">About the Quiz</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}