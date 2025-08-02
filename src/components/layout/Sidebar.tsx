
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  User, 
  Users, 
  Settings, 
  QrCode, 
  LogOut,
  FileText,
  Home,
  Book,
  GraduationCap
} from "lucide-react";

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { signOut } = useAuth();
  const { profile: user } = useUserProfile();

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => (
    <NavLink
      to={to}
      onClick={closeMobileSidebar}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground group relative overflow-hidden",
          isActive
            ? "bg-gradient-to-r from-sidebar-accent to-sidebar-accent/70 text-sidebar-accent-foreground font-medium shadow-sm"
            : "text-sidebar-foreground"
        )
      }
    >
      <div className="flex items-center gap-3 relative z-10">
        <Icon className="h-5 w-5" />
        <span className="text-sm">{label}</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 translate-x-[100%] group-hover:translate-x-0 transition-transform duration-300"></div>
    </NavLink>
  );

  if (!user) {
    return null;
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border shadow-md shrink-0 transition-transform duration-300 lg:static lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-sidebar-border px-4 bg-gradient-to-r from-sidebar-accent/30 to-transparent">
          <div className="flex items-center gap-2">
            <div className="relative">
              <QrCode className="h-7 w-7 text-primary" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground tracking-tight">
              QR Attendance
            </span>
          </div>
        </div>

        {/* Main navigation */}
        <nav className="flex-1 overflow-auto p-3 space-y-1.5">
          <NavItem to="/app/dashboard" icon={Home} label="Dashboard" />
          
          {user.role === "admin" && (
            <>
              <NavItem to="/app/students" icon={GraduationCap} label="Students" />
              <NavItem to="/app/teachers" icon={Users} label="Teachers" />
              <NavItem to="/app/qr-scanner" icon={QrCode} label="QR Scanner" />
              <NavItem to="/app/reports" icon={FileText} label="Reports" />
              <NavItem to="/app/settings" icon={Settings} label="Settings" />
            </>
          )}
          
          {user.role === "teacher" && (
            <>
              <NavItem to="/app/attendance" icon={Calendar} label="My Attendance" />
              <NavItem to="/app/my-students" icon={Users} label="My Students" />
              <NavItem to="/app/qr-scanner" icon={QrCode} label="QR Scanner" />
            </>
          )}
          
          {user.role === "scanner" && (
            <>
              <NavItem to="/app/qr-scanner" icon={QrCode} label="QR Scanner" />
            </>
          )}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.name}
              </p>
              <p className="text-xs text-sidebar-foreground/70 capitalize">
                {user.role}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className="hover:bg-sidebar-accent/40 hover:text-destructive"
            >
              <LogOut className="h-4 w-4 text-sidebar-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
