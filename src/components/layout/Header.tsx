
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, Bell, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileSidebar }) => {
  const { authState } = useAuth();
  const { user } = authState;

  if (!user) {
    return null;
  }

  // Function to capitalize role for display
  const capitalizeRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:px-6 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMobileSidebar}
        className="lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="w-full flex justify-between items-center">
        <div>
          <h1 className="text-lg font-medium bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            QR Code Attendance System
          </h1>
        </div>
        
        <div className="hidden md:flex items-center border rounded-md bg-muted/40 px-3 max-w-xs">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="h-9 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-full relative">
            <Bell className="h-4 w-4" />
            <Badge className="h-4 w-4 p-0 flex items-center justify-center absolute -top-1 -right-1 text-[10px]">2</Badge>
          </Button>
          
          <div className="hidden md:flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-primary/20">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="text-sm font-medium bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {user.name}
              </span>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Badge variant="outline" className="px-1.5 py-0 h-4 text-[10px] bg-primary/5 text-primary capitalize">
                  {capitalizeRole(user.role)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
