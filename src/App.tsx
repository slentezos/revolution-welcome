import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Players from "./pages/Players";
import Trainers from "./pages/Trainers";
import About from "./pages/About";
import ForClubs from "./pages/ForClubs";
import BookCall from "./pages/BookCall";
import Dashboard from "./pages/Dashboard";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import Search from "./pages/Search";
import Messages from "./pages/dashboard/Messages";
import Opportunities from "./pages/dashboard/Opportunities";
import Events from "./pages/dashboard/Events";
import Profile from "./pages/dashboard/Profile";
import Auth from "./pages/Auth";
import PlayerProfile from "./pages/PlayerProfile";
import Home from "./pages/dashboard/Home";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/players" element={<Players />} />
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/about" element={<About />} />
            <Route path="/clubs" element={<ForClubs />} />
            <Route path="/book-call" element={<BookCall />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/home" element={<ProtectedRoute><DashboardProvider><DashboardLayout><Home /></DashboardLayout></DashboardProvider></ProtectedRoute>} />
            <Route path="/dashboard/search" element={<ProtectedRoute><DashboardProvider><Search /></DashboardProvider></ProtectedRoute>} />
            <Route path="/dashboard/messages" element={<ProtectedRoute><DashboardProvider><Messages /></DashboardProvider></ProtectedRoute>} />
            <Route path="/dashboard/player/:id" element={<ProtectedRoute><DashboardProvider><PlayerProfile /></DashboardProvider></ProtectedRoute>} />
            <Route path="/dashboard/opportunities" element={<ProtectedRoute><DashboardProvider><Opportunities /></DashboardProvider></ProtectedRoute>} />
            <Route path="/dashboard/events" element={<ProtectedRoute><DashboardProvider><Events /></DashboardProvider></ProtectedRoute>} />
            <Route path="/dashboard/profile" element={<ProtectedRoute><DashboardProvider><Profile /></DashboardProvider></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
