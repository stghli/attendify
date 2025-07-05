
import React from "react";
import { BarChart3, Sparkles } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
  // Get the greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex items-center gap-3 sm:gap-6">
      <div className="hidden sm:flex relative">
        <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 transform rotate-3 hover:rotate-6 transition-transform duration-300">
          <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-amber-400 rounded-full flex items-center justify-center">
          <Sparkles className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-white" />
        </div>
      </div>
      
      <div className="flex-1">
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent leading-tight">
          {getGreeting()}, {userName}! 🇺🇸
        </h1>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1 font-medium">
          Welcome to your QR Attendance Dashboard
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
