
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

import Layout from "@/components/layout/Layout";
import PublicLayout from "@/components/layout/PublicLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import CodeEntry from "@/pages/CodeEntry";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import QrScannerPage from "@/pages/QrScannerPage";
import PublicQrScannerPage from "@/pages/PublicQrScannerPage";
import StudentsPage from "@/pages/StudentsPage";
import TeachersPage from "@/pages/TeachersPage";
import ClassesPage from "@/pages/ClassesPage";
import AttendancePage from "@/pages/AttendancePage";
import MyStudentsPage from "@/pages/MyStudentsPage";
import ReportsPage from "@/pages/ReportsPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes that don't require authentication */}
            <Route path="/public" element={<PublicLayout />}>
              <Route path="qr-scanner" element={<PublicQrScannerPage />} />
            </Route>
            
            {/* Entry point - starts with code entry */}
            <Route path="/" element={<Index />} />
            <Route path="/code-entry" element={<CodeEntry />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes with layout */}
            <Route path="/app" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="qr-scanner" element={<QrScannerPage />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="teachers" element={<TeachersPage />} />
              <Route path="classes" element={<ClassesPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="my-students" element={<MyStudentsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
              
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
