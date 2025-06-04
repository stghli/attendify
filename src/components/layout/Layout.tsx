
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import { useAuth } from "@/context/AuthContext";

const Layout: React.FC = () => {
  const { authState } = useAuth();
  const { isAuthenticated, isLoading } = authState;
  const navigate = useNavigate();

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // If not authenticated, don't render anything (redirection will happen)
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, show the full layout with top navigation
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      {/* Main content */}
      <main className="flex-1 p-4 lg:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
