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
    </div>
  );
};
export default DashboardHeader;