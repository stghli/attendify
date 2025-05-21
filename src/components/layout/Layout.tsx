
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/context/AuthContext";

const Layout: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { authState } = useAuth();
  const { isAuthenticated, isLoading } = authState;
  const navigate = useNavigate();
  const location = useLocation();

  // Allow login page to be accessed without authentication
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    // If not loading and not authenticated and not on login page, redirect to login
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate, isLoginPage]);

  // Special case: if we're on login page and not authenticated, just show the login page
  if (!isAuthenticated && isLoginPage) {
    return <Outlet />;
  }

  // For all other routes, if not authenticated, don't render anything (redirection will happen)
  if (!isAuthenticated && !isLoginPage) {
    return null;
  }

  // If authenticated, show the full layout
  return (
    <div className="flex min-h-screen flex-col">
      <Header toggleMobileSidebar={toggleMobileSidebar} />
      <div className="flex flex-1">
        <Sidebar 
          isMobileOpen={isMobileOpen} 
          setIsMobileOpen={setIsMobileOpen} 
        />
        
        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
