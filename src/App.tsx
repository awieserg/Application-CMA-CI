import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import RegionsPage from "./pages/RegionsPage";
import DistrictsPage from "./pages/DistrictsPage";
import ParoissesPage from "./pages/ParoissesPage";
import ParametresPage from "./pages/ParametresPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/regions" element={<RegionsPage />} />
            <Route path="/districts" element={<DistrictsPage />} />
            <Route path="/paroisses" element={<ParoissesPage />} />
            <Route path="/parametres" element={<ParametresPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;