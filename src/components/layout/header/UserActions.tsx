
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
        return "bg-purple-100 text-purple-700";
      case "teacher":
        return "bg-green-100 text-green-700";
      case "scanner":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Notifications */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
      </Button>

      {/* User Info */}
      <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-md border bg-muted/50">
        <Avatar className="h-8 w-8">
          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
          <AvatarFallback className="text-xs">
            {user.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">
            {user.name}
          </span>
          <Badge className={`${getRoleBadgeClass(user.role)} capitalize text-xs w-fit`}>
            {user.role}
          </Badge>
        </div>
      </div>

      {/* Logout */}
      <Button
        variant="ghost"
        size="icon"
        onClick={logout}
        className="hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default UserActions;
