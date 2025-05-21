
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/context/AuthContext";

const Layout: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { authState } = useAuth();
  const { isAuthenticated } = authState;

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  if (!isAuthenticated) {
    return <Outlet />;
  }

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
