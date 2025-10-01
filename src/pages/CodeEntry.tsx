
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
import { supabase } from "@/integrations/supabase/client";
import { accessCodeSchema } from "@/utils/validation";

const CodeEntry: React.FC = () => {
  const [code, setCode] = useState("");
  const [trustDevice, setTrustDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if already has valid access on mount - but don't auto-redirect
  useEffect(() => {
    const hasValidAccess = localStorage.getItem("validAccessCode");
    const accessTime = localStorage.getItem("accessTime");
    const currentTime = Date.now();
    
    // Check if access is valid and not expired (8 hours)
    if (hasValidAccess && accessTime && (currentTime - parseInt(accessTime)) < 8 * 60 * 60 * 1000) {
      // If they have valid access, go directly to landing
      navigate("/landing", { replace: true });
    } else {
      // Clear any expired access
      localStorage.removeItem("validAccessCode");
      localStorage.removeItem("accessTime");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate code format
    try {
      accessCodeSchema.parse(code);
    } catch {
      toast.error("Please enter a valid 4-digit code");
      return;
    }

    setIsLoading(true);
    
    try {
      // Validate code against database using RPC function
      const { data: isValid, error } = await supabase.rpc('validate_access_code', {
        input_code: code
      });

      if (error) throw error;

      if (isValid) {
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
        
        // Go directly to landing page without loader
        setTimeout(() => {
          navigate("/landing", { replace: true });
        }, 1000);
      } else {
        toast.error("Invalid access code", {
          description: "Please check your code and try again.",
          icon: <ShieldCheck className="h-4 w-4" />
        });
        setCode("");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Error validating code", {
        description: "Please try again later."
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <AnimatedClockBackground />
      
      <div className="relative z-10 w-full max-w-xs">
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-3xl overflow-hidden rounded-3xl border border-border/20 relative">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-3xl"></div>
          
          <CardContent className="p-5 relative z-10">
            {/* Compact Header */}
            <div className="text-center mb-5">
              <div className="relative inline-block mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-2xl flex items-center justify-center mx-auto shadow-xl relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 animate-pulse"></div>
                  <Key className="h-6 w-6 text-primary-foreground relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                {/* Floating sparkles */}
                <div className="absolute -top-0.5 -right-0.5">
                  <Sparkles className="h-2 w-2 text-primary/60 animate-pulse" />
                </div>
                <div className="absolute -bottom-0 -left-0">
                  <Sparkles className="h-1.5 w-1.5 text-secondary/60 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
              
              <h1 className="text-xl font-bold text-foreground mb-1 tracking-tight">
                Access Portal
              </h1>
              <p className="text-muted-foreground text-xs font-medium">
                Enter your access code
              </p>
            </div>

            {/* Compact OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-xs font-semibold text-foreground block text-center">
                  4-Digit Code
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={4}
                    value={code}
                    onChange={(value) => setCode(value)}
                    className="gap-1.5"
                    disabled={isLoading}
                  >
                    <InputOTPGroup>
                      {[0, 1, 2, 3].map((index) => (
                        <InputOTPSlot 
                          key={index}
                          index={index} 
                          className="w-10 h-10 text-base font-bold bg-background/80 border-2 border-border/40 rounded-lg text-foreground backdrop-blur-sm hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:scale-105 focus:scale-105 shadow-md hover:shadow-lg"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {/* Compact checkbox */}
              <div className="flex items-center justify-center space-x-2">
                <Checkbox
                  id="trust"
                  checked={trustDevice}
                  onCheckedChange={(checked) => setTrustDevice(checked as boolean)}
                  className="border-2 border-border/40 bg-background/80 data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-md backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 w-3.5 h-3.5"
                  disabled={isLoading}
                />
                <Label htmlFor="trust" className="text-xs text-muted-foreground cursor-pointer font-medium hover:text-foreground transition-colors duration-200">
                  Remember for 24 hours
                </Label>
              </div>

              {/* Compact gradient button */}
              <Button 
                type="submit" 
                className="w-full h-9 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-semibold text-xs rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-0 relative overflow-hidden group"
                disabled={code.length < 4 || isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-foreground mr-2"></div>
                    <span className="relative z-10">Verifying...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-3 w-3 mr-2 relative z-10 group-hover:rotate-12 transition-transform duration-200" />
                    <span className="relative z-10">Access System</span>
                  </>
                )}
              </Button>

              {/* Compact cancel link */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground text-xs font-medium transition-all duration-200 hover:underline underline-offset-2 hover:scale-105 disabled:opacity-50"
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
