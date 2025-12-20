import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import SectionPage from "./pages/SectionPage";
import ClaimsDatabase from "./pages/ClaimsDatabase";
import KeyFigures from "./pages/KeyFigures";
import PhysicsAnalysis from "./pages/PhysicsAnalysis";
import Documents from "./pages/Documents";
import Videos from "./pages/Videos";
import JourneyPage from "./pages/JourneyPage";
import AboutQuiz from "./pages/AboutQuiz";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/section/:sectionId" element={<SectionPage />} />
            <Route path="/claims" element={<ClaimsDatabase />} />
            <Route path="/figures" element={<KeyFigures />} />
            <Route path="/physics" element={<PhysicsAnalysis />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/journey/:journeyId" element={<JourneyPage />} />
            <Route path="/about-quiz" element={<AboutQuiz />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
