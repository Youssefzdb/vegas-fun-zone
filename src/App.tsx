import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { AdminProvider } from "@/contexts/AdminContext";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Slots from "./pages/Slots";
import Tables from "./pages/Tables";
import Crash from "./pages/Crash";
import LiveCasino from "./pages/LiveCasino";
import GamePage from "./pages/GamePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminProvider>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/slots" element={<Slots />} />
              <Route path="/tables" element={<Tables />} />
              <Route path="/crash" element={<Crash />} />
              <Route path="/live" element={<LiveCasino />} />
              <Route path="/game/:gameId" element={<GamePage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </AdminProvider>
  </QueryClientProvider>
);

export default App;
