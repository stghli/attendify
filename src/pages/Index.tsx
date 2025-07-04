

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Enhanced security check
    const hasValidAccess = localStorage.getItem("validAccessCode");
    const accessTime = localStorage.getItem("accessTime");
    const currentTime = Date.now();
    
    // Check if access is valid and not expired (8 hours)
    if (hasValidAccess && accessTime && (currentTime - parseInt(accessTime)) < 8 * 60 * 60 * 1000) {
      // If they have valid, non-expired access, go to landing page
      navigate("/landing", { replace: true });
    } else {
      // If no valid access or expired, clear storage and go to code entry
      localStorage.removeItem("validAccessCode");
      localStorage.removeItem("accessTime");
      navigate("/code-entry", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Validating Security...</h1>
        <p className="text-muted-foreground">Please wait while we verify your access</p>
      </div>
    </div>
  );
};

export default Index;

