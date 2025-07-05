
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
  Menu,
  X
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
        "flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 hover:bg-white/90 hover:shadow-lg hover:scale-[1.02] group relative overflow-hidden",
        isActive
          ? "bg-white/95 text-primary shadow-lg backdrop-blur-sm border border-white/60 font-semibold"
          : "text-gray-700 hover:text-primary"
      )
    }
  >
    <div className="flex items-center gap-4 relative z-10 w-full">
      <div className={cn(
        "p-2.5 rounded-lg transition-all duration-300 group-hover:scale-110",
        "bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10"
      )}>
        <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
      </div>
      <span className="text-base font-medium">{label}</span>
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 translate-x-[100%] group-hover:translate-x-0 transition-transform duration-500 rounded-xl"></div>
  </NavLink>
);

const MobileMenu: React.FC<MobileMenuProps> = ({ user, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-200";
      case "teacher":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-200";
      case "scanner":
        return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-200";
    }
  };

  const navigationItems = [
    { to: "/app/dashboard", icon: Home, label: "Dashboard", roles: ["admin", "teacher", "scanner"] },
    ...(user.role === "admin" ? [
      { to: "/app/students", icon: GraduationCap, label: "Students", roles: ["admin"] },
      { to: "/app/teachers", icon: Users, label: "Teachers", roles: ["admin"] },
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
      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden h-10 w-10 rounded-full hover:bg-white/70 transition-all duration-300 hover:scale-105"
      >
        <div className="relative">
          {isMobileMenuOpen ? (
            <X className="h-5 w-5 transition-transform duration-300 rotate-90" />
          ) : (
            <Menu className="h-5 w-5 transition-transform duration-300" />
          )}
        </div>
      </Button>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
          <div className="absolute top-16 left-0 right-0 mx-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
            <div className="p-4 space-y-2">
              {/* Navigation Items */}
              <nav className="space-y-2">
                {filteredNavItems.map((item) => (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </nav>
              
              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4"></div>
              
              {/* Mobile User Info */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50/80 to-blue-50/80 rounded-xl border border-white/60">
                <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-lg">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/20 text-primary font-semibold">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-gray-900 truncate mb-1">
                    {user.name}
                  </p>
                  <Badge className={cn(
                    getRoleBadgeClass(user.role),
                    "capitalize text-xs font-medium px-3 py-1 border"
                  )}>
                    {user.role}
                  </Badge>
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
