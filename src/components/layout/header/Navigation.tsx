
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Home,
  Users,
  GraduationCap,
  Calendar,
  FileText,
  Settings,
  QrCode
} from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  role: string;
}

interface NavigationProps {
  user: User;
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

const Navigation: React.FC<NavigationProps> = ({ user }) => {
  const navigationItems = [
    { to: "/dashboard", icon: Home, label: "Dashboard", roles: ["admin", "teacher", "scanner"] },
    ...(user.role === "admin" ? [
      { to: "/students", icon: GraduationCap, label: "Students", roles: ["admin"] },
      { to: "/teachers", icon: Users, label: "Teachers", roles: ["admin"] },
      { to: "/reports", icon: FileText, label: "Reports", roles: ["admin"] },
      { to: "/settings", icon: Settings, label: "Settings", roles: ["admin"] },
    ] : []),
    ...(user.role === "teacher" ? [
      { to: "/attendance", icon: Calendar, label: "Attendance", roles: ["teacher"] },
      { to: "/my-students", icon: Users, label: "My Students", roles: ["teacher"] },
    ] : []),
    { to: "/qr-scanner", icon: QrCode, label: "QR Scanner", roles: ["admin", "teacher", "scanner"] },
  ];

  const filteredNavItems = navigationItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {filteredNavItems.map((item) => (
        <NavItem
          key={item.to}
          to={item.to}
          icon={item.icon}
          label={item.label}
        />
      ))}
    </nav>
  );
};

export default Navigation;
