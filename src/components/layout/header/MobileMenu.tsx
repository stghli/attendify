
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
        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )
    }
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </NavLink>
);

const MobileMenu: React.FC<MobileMenuProps> = ({ user, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700";
      case "teacher":
        return "bg-green-100 text-green-700";
      case "scanner":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
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
      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Container */}
          <div className="absolute top-16 left-4 right-4 bg-white rounded-lg shadow-lg border overflow-hidden">
            <div className="p-4 space-y-4">
              {/* User Profile Section */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-md border">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                  <AvatarFallback className="text-sm">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.name}
                  </p>
                  <Badge className={cn(getRoleBadgeClass(user.role), "capitalize text-xs mt-1")}>
                    {user.role}
                  </Badge>
                </div>
              </div>
              
              {/* Navigation Items */}
              <nav className="space-y-1">
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
