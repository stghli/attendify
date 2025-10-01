
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Home,
  Users,
  GraduationCap,
  Calendar,
  FileText,
  Settings,
  QrCode,
  BookOpen
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
        "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
        isActive
          ? "text-primary border-b-2 border-primary"
          : "text-muted-foreground"
      )
    }
  >
    <Icon className="h-4 w-4" />
    <span className="hidden sm:inline">{label}</span>
  </NavLink>
);

const Navigation: React.FC<NavigationProps> = ({ user }) => {
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
    <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
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
