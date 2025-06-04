
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  QrCode, 
  LogOut,
  Search,
  Bell,
  Home,
  Users,
  GraduationCap,
  Calendar,
  FileText,
  Settings,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

const Header: React.FC = () => {
  const { authState, logout } = useAuth();
  const { user } = authState;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) {
    return null;
  }

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
          "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-white/80 hover:shadow-lg hover:scale-105 group relative overflow-hidden",
          isActive
            ? "bg-white/90 text-primary shadow-lg backdrop-blur-sm border border-white/50"
            : "text-gray-700 hover:text-primary"
        )
      }
    >
      <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
      <span className="hidden md:inline">{label}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 translate-x-[100%] group-hover:translate-x-0 transition-transform duration-300 rounded-full"></div>
    </NavLink>
  );

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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                <QrCode className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-amber-400 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                QR Attendance 🇺🇸
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {filteredNavItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center border rounded-full bg-white/60 backdrop-blur-sm px-4 py-2 max-w-xs shadow-sm hover:shadow-md transition-shadow">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <Input 
              type="search" 
              placeholder="Search..." 
              className="h-6 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-sm placeholder:text-gray-400"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-white/60 hover:scale-105 transition-all duration-300 relative"
            >
              <Bell className="h-4 w-4" />
              <Badge className="h-4 w-4 p-0 flex items-center justify-center absolute -top-1 -right-1 text-[10px] bg-red-500 text-white animate-pulse">
                2
              </Badge>
            </Button>

            {/* User Info */}
            <div className="hidden md:flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300">
              <Avatar className="h-8 w-8 border-2 border-primary/20">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 truncate max-w-24">
                  {user.name}
                </span>
                <Badge className={`${getRoleBadgeClass(user.role)} capitalize text-xs h-4`}>
                  {user.role}
                </Badge>
              </div>
            </div>

            {/* Logout */}
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="rounded-full hover:bg-red-50 hover:text-red-600 hover:scale-105 transition-all duration-300"
            >
              <LogOut className="h-4 w-4" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden rounded-full hover:bg-white/60"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4">
            <nav className="flex flex-col gap-2 pt-4 border-t border-white/50">
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
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/50">
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <Badge className={`${getRoleBadgeClass(user.role)} capitalize text-xs`}>
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
