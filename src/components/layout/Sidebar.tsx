
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  User, 
  Users, 
  Settings, 
  QrCode, 
  LogOut,
  FileText
} from "lucide-react";

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { authState, logout } = useAuth();
  const { user } = authState;

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => (
    <NavLink
      to={to}
      onClick={closeMobileSidebar}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground"
        )
      }
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </NavLink>
  );

  if (!user) {
    return null;
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border shrink-0 transition-transform duration-300 lg:static lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b border-sidebar-border px-4">
          <div className="flex items-center gap-2">
            <QrCode className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-sidebar-foreground">
              QR Attendance
            </span>
          </div>
        </div>

        {/* Main navigation */}
        <nav className="flex-1 overflow-auto p-3 space-y-1">
          <NavItem to="/dashboard" icon={Calendar} label="Dashboard" />
          
          {user.role === "admin" && (
            <>
              <NavItem to="/students" icon={User} label="Students" />
              <NavItem to="/teachers" icon={Users} label="Teachers" />
              <NavItem to="/qr-scanner" icon={QrCode} label="QR Scanner" />
              <NavItem to="/reports" icon={FileText} label="Reports" />
              <NavItem to="/settings" icon={Settings} label="Settings" />
            </>
          )}
          
          {user.role === "teacher" && (
            <>
              <NavItem to="/attendance" icon={Calendar} label="My Attendance" />
              <NavItem to="/my-students" icon={Users} label="My Students" />
              <NavItem to="/qr-scanner" icon={QrCode} label="QR Scanner" />
            </>
          )}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-sidebar-foreground">
                {user.name}
              </p>
              <p className="text-xs text-sidebar-foreground/70 capitalize">
                {user.role}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LogOut className="h-5 w-5 text-sidebar-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
