
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, LogOut } from "lucide-react";

interface User {
  name: string;
  role: string;
}

interface UserActionsProps {
  user: User;
  logout: () => void;
}

const UserActions: React.FC<UserActionsProps> = ({ user, logout }) => {
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

  return (
    <div className="flex items-center gap-2">
      {/* Notifications */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-full hover:bg-white/60 hover:scale-105 transition-all duration-300 relative"
      >
        <Bell className="h-3.5 w-3.5" />
        <Badge className="h-3 w-3 p-0 flex items-center justify-center absolute -top-1 -right-1 text-[8px] bg-red-500 text-white animate-pulse">
          2
        </Badge>
      </Button>

      {/* User Info */}
      <div className="hidden md:flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm hover:shadow-md transition-all duration-300">
        <Avatar className="h-6 w-6 border-2 border-primary/20">
          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
          <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
            {user.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-900 truncate max-w-20">
            {user.name}
          </span>
          <Badge className={`${getRoleBadgeClass(user.role)} capitalize text-[8px] h-3`}>
            {user.role}
          </Badge>
        </div>
      </div>

      {/* Logout */}
      <Button
        variant="ghost"
        size="icon"
        onClick={logout}
        className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-600 hover:scale-105 transition-all duration-300"
      >
        <LogOut className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default UserActions;
