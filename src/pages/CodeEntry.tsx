
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, Lock, Key, Clock, Sparkles } from "lucide-react";
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
    setIsLoading(true);
    
    // Add a slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (VALID_CODES.includes(code)) {
      // Set access flag and time in localStorage
      localStorage.setItem("validAccessCode", "true");
      localStorage.setItem("accessTime", Date.now().toString());
      
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
      
      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-card/90 backdrop-blur-3xl overflow-hidden rounded-3xl border border-border/30 relative">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-3xl"></div>
          
          <CardContent className="p-10 relative z-10">
            {/* Header with animated icon */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-3xl flex items-center justify-center mx-auto shadow-2xl relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-300 animate-pulse"></div>
                  <Key className="h-10 w-10 text-primary-foreground relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                {/* Floating sparkles */}
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-4 w-4 text-primary/60 animate-pulse" />
                </div>
                <div className="absolute -bottom-1 -left-1">
                  <Sparkles className="h-3 w-3 text-secondary/60 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-3 tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Secure Access Portal
              </h1>
              <p className="text-muted-foreground text-base font-medium leading-relaxed">
                Enter your unique access code to continue
              </p>
            </div>

            {/* Enhanced OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="code" className="text-base font-semibold text-foreground block text-center">
                  Access Code
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={4}
                    value={code}
                    onChange={(value) => setCode(value)}
                    className="gap-3"
                    disabled={isLoading}
                  >
                    <InputOTPGroup>
                      {[0, 1, 2, 3].map((index) => (
                        <InputOTPSlot 
                          key={index}
                          index={index} 
                          className="w-14 h-14 text-xl font-bold bg-background/70 border-2 border-border/50 rounded-2xl text-foreground backdrop-blur-sm hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 hover:scale-105 focus:scale-105 shadow-lg hover:shadow-xl"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {/* Enhanced checkbox */}
              <div className="flex items-center justify-center space-x-3 py-2">
                <Checkbox
                  id="trust"
                  checked={trustDevice}
                  onCheckedChange={(checked) => setTrustDevice(checked as boolean)}
                  className="border-2 border-border/50 bg-background/70 data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-lg backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 w-5 h-5"
                  disabled={isLoading}
                />
                <Label htmlFor="trust" className="text-base text-muted-foreground cursor-pointer font-medium hover:text-foreground transition-colors duration-300">
                  Remember this device for 8 hours
                </Label>
              </div>

              {/* Enhanced gradient button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 text-primary-foreground font-semibold text-base rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-0 relative overflow-hidden group"
                disabled={code.length < 4 || isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-3"></div>
                    <span className="relative z-10">Verifying...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-3 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="relative z-10">Access System</span>
                  </>
                )}
              </Button>

              {/* Enhanced cancel link */}
              <div className="text-center pt-4">
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground text-base font-medium transition-all duration-300 hover:underline underline-offset-4 hover:scale-105 disabled:opacity-50"
                  onClick={() => navigate("/")}
                  disabled={isLoading}
                >
                  ← Back to Home
                </button>
              </div>
            </form>
          </CardContent>
          
          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-60"></div>
        </Card>
      </div>
    </div>
  );
};

export default CodeEntry;
