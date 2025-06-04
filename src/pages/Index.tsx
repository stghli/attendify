
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { isAuthenticated, isLoading } = authState;

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // If authenticated, go to dashboard
        navigate("/dashboard");
      } else {
        // If not authenticated, go to code entry
        navigate("/code-entry");
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
