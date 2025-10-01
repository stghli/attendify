import React from "react";
import { useNavigate } from "react-router-dom";

const Logo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate('/app/dashboard')}
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
    >
      <div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
        <span className="text-white font-bold text-sm">AS</span>
      </div>
      <span className="font-semibold text-lg hidden sm:inline">AttendSmart</span>
    </button>
  );
};

export default Logo;