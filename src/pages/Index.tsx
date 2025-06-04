
import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ScanQrCode, LogIn } from "lucide-react";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { isAuthenticated, isLoading } = authState;

  useEffect(() => {
    // If authenticated, go directly to dashboard (login already completed)
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard");
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

  // Show landing page when not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <div className="text-center max-w-md px-4">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <ScanQrCode className="h-14 w-14 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">QR Attendance System</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Welcome to our school attendance tracking system. Check in quickly with your QR code!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/login">
                <LogIn className="h-5 w-5" />
                Admin Login
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/public/qr-scanner">
                <ScanQrCode className="h-5 w-5" />
                Scan QR Code
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null; // Will navigate to dashboard if authenticated
};

export default Index;
