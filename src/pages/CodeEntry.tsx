
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, Lock, Key, Sparkles } from "lucide-react";
import { toast } from "sonner";
import AnimatedClockBackground from "@/components/AnimatedClockBackground";

const CodeEntry: React.FC = () => {
  const [code, setCode] = useState("");
  const [trustDevice, setTrustDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Valid codes that allow access to the landing page
  const VALID_CODES = ["9768", "1234", "5678"];

  // Check if already has valid access on mount
  useEffect(() => {
    const hasValidAccess = localStorage.getItem("validAccessCode");
    const accessTime = localStorage.getItem("accessTime");
    const currentTime = Date.now();
    
    // Check if access is valid and not expired (8 hours)
    if (hasValidAccess && accessTime && (currentTime - parseInt(accessTime)) < 8 * 60 * 60 * 1000) {
      navigate("/landing", { replace: true });
    } else {
      // Clear any expired access
      localStorage.removeItem("validAccessCode");
      localStorage.removeItem("accessTime");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 4) {
      toast.error("Please enter a 4-digit code");
      return;
    }

    setIsLoading(true);
    
    // Add a slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (VALID_CODES.includes(code)) {
      // Set access flag and time in localStorage
      localStorage.setItem("validAccessCode", "true");
      localStorage.setItem("accessTime", Date.now().toString());
      
      if (trustDevice) {
        // Extended time for trusted devices (24 hours)
        localStorage.setItem("trustedDevice", "true");
      }
      
      toast.success("Access granted! Welcome to the system.", {
        description: "Redirecting to the main interface...",
        icon: <Sparkles className="h-4 w-4" />
      });
      
      // Smooth transition delay
      setTimeout(() => {
        navigate("/landing", { replace: true });
      }, 1500);
    } else {
      toast.error("Invalid access code", {
        description: "Please check your code and try again.",
        icon: <ShieldCheck className="h-4 w-4" />
      });
      setCode("");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <AnimatedClockBackground />
      
      <div className="relative z-10 w-full max-w-sm">
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-3xl overflow-hidden rounded-2xl border border-border/20 relative">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 rounded-2xl"></div>
          
          <CardContent className="p-6 relative z-10">
            {/* Compact Header */}
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-2xl flex items-center justify-center mx-auto shadow-xl relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 animate-pulse"></div>
                  <Key className="h-7 w-7 text-primary-foreground relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                {/* Floating sparkles */}
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-3 w-3 text-primary/60 animate-pulse" />
                </div>
                <div className="absolute -bottom-0.5 -left-0.5">
                  <Sparkles className="h-2 w-2 text-secondary/60 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
                Access Portal
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                Enter your access code
              </p>
            </div>

            {/* Compact OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="code" className="text-sm font-semibold text-foreground block text-center">
                  4-Digit Code
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={4}
                    value={code}
                    onChange={(value) => setCode(value)}
                    className="gap-2"
                    disabled={isLoading}
                  >
                    <InputOTPGroup>
                      {[0, 1, 2, 3].map((index) => (
                        <InputOTPSlot 
                          key={index}
                          index={index} 
                          className="w-12 h-12 text-lg font-bold bg-background/80 border-2 border-border/40 rounded-xl text-foreground backdrop-blur-sm hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:scale-105 focus:scale-105 shadow-md hover:shadow-lg"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {/* Compact checkbox */}
              <div className="flex items-center justify-center space-x-2 py-1">
                <Checkbox
                  id="trust"
                  checked={trustDevice}
                  onCheckedChange={(checked) => setTrustDevice(checked as boolean)}
                  className="border-2 border-border/40 bg-background/80 data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-md backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 w-4 h-4"
                  disabled={isLoading}
                />
                <Label htmlFor="trust" className="text-sm text-muted-foreground cursor-pointer font-medium hover:text-foreground transition-colors duration-200">
                  Remember for 24 hours
                </Label>
              </div>

              {/* Compact gradient button */}
              <Button 
                type="submit" 
                className="w-full h-10 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-semibold text-sm rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-0 relative overflow-hidden group"
                disabled={code.length < 4 || isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    <span className="relative z-10">Verifying...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2 relative z-10 group-hover:rotate-12 transition-transform duration-200" />
                    <span className="relative z-10">Access System</span>
                  </>
                )}
              </Button>

              {/* Compact cancel link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground text-sm font-medium transition-all duration-200 hover:underline underline-offset-2 hover:scale-105 disabled:opacity-50"
                  onClick={() => navigate("/")}
                  disabled={isLoading}
                >
                  ← Back to Home
                </button>
              </div>
            </form>
          </CardContent>
          
          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary opacity-50"></div>
        </Card>
      </div>
    </div>
  );
};

export default CodeEntry;
