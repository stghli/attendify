
import React from "react";

interface DashboardHeaderProps {
  userName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
  return (
    <div className="flex flex-col mb-6">
      <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
        Welcome, {userName}
      </h1>
      <p className="text-muted-foreground">
        Here's what's happening with your QR Attendance System today.
      </p>
    </div>
  );
};

export default DashboardHeader;
