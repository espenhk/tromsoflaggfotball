import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import HowIDidIt from "./pages/HowIDidIt.tsx";
import TrainingPlans from "./pages/TrainingPlans.tsx";
import Posisjoner from "./pages/Posisjoner.tsx";
import NotFound from "./pages/NotFound.tsx";
import { LanguageProvider } from "./i18n/LanguageProvider.tsx";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/how-i-did-it" element={<HowIDidIt />} />
            <Route path="/training-plans" element={<TrainingPlans />} />
            <Route path="/posisjoner" element={<Posisjoner />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
