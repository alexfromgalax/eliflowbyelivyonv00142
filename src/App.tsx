import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Historie from "./pages/Historie";
import Bestellen from "./pages/Bestellen";
import Team from "./pages/Team";
import Finanzierung from "./pages/Finanzierung";
import Einstellungen from "./pages/Einstellungen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/historie" element={<Historie />} />
          <Route path="/bestellen" element={<Bestellen />} />
          <Route path="/team" element={<Team />} />
          <Route path="/finanzierung" element={<Finanzierung />} />
          <Route path="/einstellungen" element={<Einstellungen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
