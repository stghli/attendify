
import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Home,
  Users,
  GraduationCap,
  Calendar,
  FileText,
  Settings,
  QrCode,
  BookOpen,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  name: string;
  role: string;
}

interface MobileMenuProps {
  user: User;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const NavItem = ({ to, icon: Icon, label, onClick }: { 
  to: string; 
  icon: React.ElementType; 
  label: string;
  onClick?: () => void;
}) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        "group relative flex items-center justify-between rounded-2xl px-5 py-4 text-sm font-medium transition-all duration-500 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98]",
        isActive
          ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 shadow-lg shadow-blue-500/20 border border-blue-200/50"
          : "text-gray-700 hover:text-blue-700"
      )
    }
  >
    <div className="flex items-center gap-4 relative z-10">
      <div className={cn(
        "p-3 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
        "bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 group-hover:shadow-lg group-hover:shadow-blue-500/20"
      )}>
        <Icon className="h-5 w-5 transition-all duration-500 group-hover:scale-110 group-hover:text-blue-600" />
      </div>
      <span className="text-base font-semibold tracking-wide">{label}</span>
    </div>
    <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-blue-500" />
    
    {/* Animated background gradient */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
  </NavLink>
);

const MobileMenu: React.FC<MobileMenuProps> = ({ user, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-700 border-purple-300/50 shadow-purple-500/20";
      case "teacher":
        return "bg-gradient-to-r from-emerald-500/20 to-green-600/20 text-emerald-700 border-emerald-300/50 shadow-emerald-500/20";
      case "scanner":
        return "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-700 border-blue-300/50 shadow-blue-500/20";
      default:
        return "bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-700 border-gray-300/50 shadow-gray-500/20";
    }
  };

  const navigationItems = [
    { to: "/app/dashboard", icon: Home, label: "Dashboard", roles: ["admin", "teacher", "scanner"] },
    ...(user.role === "admin" ? [
      { to: "/app/students", icon: GraduationCap, label: "Students", roles: ["admin"] },
      { to: "/app/teachers", icon: Users, label: "Teachers", roles: ["admin"] },
      { to: "/app/classes", icon: BookOpen, label: "Classes", roles: ["admin"] },
      { to: "/app/reports", icon: FileText, label: "Reports", roles: ["admin"] },
      { to: "/app/settings", icon: Settings, label: "Settings", roles: ["admin"] },
    ] : []),
    ...(user.role === "teacher" ? [
      { to: "/app/attendance", icon: Calendar, label: "Attendance", roles: ["teacher"] },
      { to: "/app/my-students", icon: Users, label: "My Students", roles: ["teacher"] },
    ] : []),
    { to: "/app/qr-scanner", icon: QrCode, label: "QR Scanner", roles: ["admin", "teacher", "scanner"] },
  ];

  const filteredNavItems = navigationItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <>
      {/* Enhanced Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden relative h-11 w-11 rounded-2xl hover:bg-blue-50/70 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105 active:scale-95 group"
      >
        <div className="relative">
          {isMobileMenuOpen ? (
            <X className="h-5 w-5 transition-all duration-300 rotate-90 text-blue-600" />
          ) : (
            <Menu className="h-5 w-5 transition-all duration-300 group-hover:text-blue-600" />
          )}
        </div>
        
        {/* Ripple effect background */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Button>

      {/* Enhanced Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-in fade-in duration-300">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-md"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Container */}
          <div className="absolute top-20 left-4 right-4 md:left-6 md:right-6 lg:left-8 lg:right-8 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/60 overflow-hidden animate-in slide-in-from-top-4 duration-500">
            
            {/* Header Gradient */}
            <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            
            <div className="p-6 space-y-6">
              {/* Enhanced User Profile Section */}
              <div className="flex items-center gap-5 p-5 bg-gradient-to-r from-blue-50/50 via-indigo-50/50 to-purple-50/50 rounded-2xl border border-blue-100/50 shadow-lg shadow-blue-500/5">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-3 border-white shadow-lg shadow-blue-500/20 ring-2 ring-blue-200/50">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-gray-900 truncate mb-2 tracking-wide">
                    {user.name}
                  </p>
                  <Badge className={cn(
                    getRoleBadgeClass(user.role),
                    "capitalize text-sm font-semibold px-4 py-1.5 border shadow-lg tracking-wide"
                  )}>
                    {user.role}
                  </Badge>
                </div>
              </div>
              
              {/* Enhanced Navigation Items */}
              <nav className="space-y-3">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-4">
                  Navigation
                </div>
                {filteredNavItems.map((item, index) => (
                  <div
                    key={item.to}
                    className="animate-in slide-in-from-left duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <NavItem
                      to={item.to}
                      icon={item.icon}
                      label={item.label}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  </div>
                ))}
              </nav>
              
              {/* Enhanced Footer */}
              <div className="pt-4 border-t border-gradient-to-r from-transparent via-gray-200 to-transparent">
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-medium">
                    QR Attendance System
                  </p>
                  <div className="mt-2 flex justify-center">
                    <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
