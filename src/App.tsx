import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "./components/DashboardLayout";
import DashboardOverview from "./pages/DashboardOverview";
import DeviceList from "./pages/DeviceList";
import RealtimeMonitor from "./pages/RealtimeMonitor";
import AlertCenter from "./pages/AlertCenter";
import PerformanceAnalytics from "./pages/PerformanceAnalytics";
import NetworkTopology from "./pages/NetworkTopology";
import LogManagement from "./pages/LogManagement";
import SystemSettings from "./pages/SystemSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/devices" element={<DeviceList />} />
            <Route path="/monitor" element={<RealtimeMonitor />} />
            <Route path="/alerts" element={<AlertCenter />} />
            <Route path="/analytics" element={<PerformanceAnalytics />} />
            <Route path="/topology" element={<NetworkTopology />} />
            <Route path="/logs" element={<LogManagement />} />
            <Route path="/settings" element={<SystemSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
