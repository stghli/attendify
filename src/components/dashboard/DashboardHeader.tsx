
import React from "react";
import { BarChart } from "lucide-react";

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
    <div className="flex items-center gap-3">
      <div className="hidden md:flex h-12 w-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl items-center justify-center shadow-md">
        <BarChart className="h-6 w-6 text-white" />
      </div>
      
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          {getGreeting()}, {userName}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your QR Attendance System today.
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
