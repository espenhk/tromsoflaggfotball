import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import HowIDidIt from "./pages/HowIDidIt.tsx";
import TrainingPlans from "./pages/TrainingPlans.tsx";
import Posisjoner from "./pages/Posisjoner.tsx";
import MakeIgPost from "./pages/MakeIgPost.tsx";
import Pameldinger from "./pages/Pameldinger.tsx";
import AdminIndex from "./pages/AdminIndex.tsx";
import SosialtMock from "./pages/SosialtMock.tsx";
import AdminGate from "./components/AdminGate.tsx";
import NotFound from "./pages/NotFound.tsx";
import { LanguageProvider } from "./i18n/LanguageProvider.tsx";
import { ThemeProvider } from "./theme/ThemeProvider.tsx";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/how-i-did-it" element={<HowIDidIt />} />
            <Route path="/posisjoner" element={<Posisjoner />} />

            {/* Admin (password-protected) */}
            <Route path="/admin" element={<AdminGate />}>
              <Route index element={<AdminIndex />} />
              <Route path="pameldinger" element={<Pameldinger />} />
              <Route path="make-ig-post" element={<MakeIgPost />} />
              <Route path="training-plans" element={<TrainingPlans />} />
              <Route path="sosialt-mock" element={<SosialtMock />} />
            </Route>


            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
