
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Always redirect to code entry - no exceptions
    navigate("/code-entry", { replace: true });
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
