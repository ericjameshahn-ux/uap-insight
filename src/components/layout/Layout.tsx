import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { NotebookLMModal } from "@/components/NotebookLMModal";
import { useNotebookLMShortcut } from "@/hooks/useKeyboardShortcut";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [showNotebookLMModal, setShowNotebookLMModal] = useState(false);

  // Global keyboard shortcut for NotebookLM (Ctrl/Cmd + K)
  useNotebookLMShortcut(() => setShowNotebookLMModal(true));

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full overflow-x-hidden max-w-[100vw]">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          <header className="h-14 border-b border-border flex items-center px-4 sm:px-6 bg-card sticky top-0 z-10">
            <SidebarTrigger className="mr-3 md:mr-4 h-11 w-11 md:h-9 md:w-9 [&_svg]:h-5 [&_svg]:w-5 md:[&_svg]:h-4 md:[&_svg]:w-4" />
            <div className="flex-1" />
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Global NotebookLM Modal - triggered by Ctrl/Cmd + K */}
      <NotebookLMModal 
        isOpen={showNotebookLMModal} 
        onClose={() => setShowNotebookLMModal(false)} 
      />
    </SidebarProvider>
  );
}
