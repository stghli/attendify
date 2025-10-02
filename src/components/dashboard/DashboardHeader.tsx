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
    <div className="border-b bg-card shadow-sm">
      <div className="px-6 py-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2.5 mt-0.5">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight mb-1">
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