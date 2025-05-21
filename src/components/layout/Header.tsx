
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileSidebar }) => {
  const { authState } = useAuth();
  const { user } = authState;

  if (!user) {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMobileSidebar}
        className="lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </Button>
      <div className="w-full flex justify-between items-center">
        <h1 className="text-lg font-medium">QR Code Attendance System</h1>
        <div>
          <span className="text-sm text-muted-foreground hidden md:inline-block mr-2">
            Welcome, {user.name}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
