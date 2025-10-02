
import React from "react";
import { BarChart3 } from "lucide-react";

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
    <div className="flex items-center gap-4">
      <div className="hidden sm:flex">
        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary rounded-lg flex items-center justify-center">
          <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
        </div>
      </div>
      
      <div className="flex-1">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
          {getGreeting()}, {userName}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-1">
          QR Attendance Dashboard
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
