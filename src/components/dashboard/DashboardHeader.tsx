import React from "react";
import { BarChart3 } from "lucide-react";
interface DashboardHeaderProps {
  userName: string;
}
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName
}) => {
  // Get the greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  return (
    <div className="border-b bg-card">
      <div className="px-6 py-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {getGreeting()}, {userName}
            </h1>
            <p className="text-sm text-muted-foreground">
              Here's what's happening with your attendance system today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardHeader;