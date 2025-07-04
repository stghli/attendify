
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, Lock } from "lucide-react";

const LandingHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleLockScreen = () => {
    // Clear access tokens to force re-authentication
    localStorage.removeItem("validAccessCode");
    localStorage.removeItem("accessTime");
    localStorage.removeItem("trustedDevice");
    
    // Navigate to code entry page
    navigate("/code-entry", { replace: true });
  };

  return (
    <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-10">
      <div className="flex justify-between gap-2">
        <Button asChild variant="outline" size="sm" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 text-xs px-3 py-2 h-9 font-medium shadow-lg">
          <Link to="/login">
            <LogIn className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Admin Login</span>
            <span className="sm:hidden">Admin</span>
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 text-xs px-3 py-2 h-9 font-medium shadow-lg"
          onClick={handleLockScreen}
        >
          <Lock className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Lock Screen</span>
          <span className="sm:hidden">Lock</span>
        </Button>
      </div>
    </div>
  );
};

export default LandingHeader;
