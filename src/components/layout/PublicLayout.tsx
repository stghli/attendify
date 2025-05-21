
import React from "react";
import { Outlet } from "react-router-dom";

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      <Outlet />
    </div>
  );
};

export default PublicLayout;
