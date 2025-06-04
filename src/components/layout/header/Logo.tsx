
import React from "react";
import { QrCode, Sparkles } from "lucide-react";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="h-7 w-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md transform hover:rotate-6 transition-transform duration-300">
          <QrCode className="h-3.5 w-3.5 text-white" />
        </div>
        <div className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-amber-400 rounded-full animate-pulse"></div>
      </div>
      <div className="hidden md:block">
        <h1 className="text-sm font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          QR Attendance 🇺🇸
        </h1>
      </div>
    </div>
  );
};

export default Logo;
