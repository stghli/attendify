
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has valid access code
    const hasValidAccess = localStorage.getItem("validAccessCode");
    
    if (hasValidAccess) {
      // If they have valid access, go to landing page
      navigate("/landing", { replace: true });
    } else {
      // If no valid access, go to code entry
      navigate("/code-entry", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Loading...</h1>
      </div>
    </div>
  );
};

export default Index;

