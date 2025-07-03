
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
        "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-all duration-300 hover:bg-white/80 hover:shadow-md hover:scale-105 group relative overflow-hidden",
        isActive
          ? "bg-white/90 text-primary shadow-md backdrop-blur-sm border border-white/50"
          : "text-gray-700 hover:text-primary"
      )
    }
  >
    <Icon className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
    <span className="hidden sm:inline text-xs">{label}</span>
    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 translate-x-[100%] group-hover:translate-x-0 transition-transform duration-300 rounded-full"></div>
  </NavLink>
);

const MobileMenu: React.FC<MobileMenuProps> = ({ user, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "teacher":
        return "bg-green-100 text-green-800";
      case "scanner":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        className="lg:hidden h-8 w-8 rounded-full hover:bg-white/60"
      >
        {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden pb-3">
          <nav className="flex flex-col gap-1 pt-3 border-t border-white/50">
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
          
          {/* Mobile User Info */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/50">
            <Avatar className="h-8 w-8 border-2 border-primary/20">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-900">{user.name}</p>
              <Badge className={`${getRoleBadgeClass(user.role)} capitalize text-[8px]`}>
                {user.role}
              </Badge>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
