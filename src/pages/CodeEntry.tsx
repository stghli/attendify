
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, Lock, Key, Clock } from "lucide-react";
import { toast } from "sonner";
import AnimatedClockBackground from "@/components/AnimatedClockBackground";

const CodeEntry: React.FC = () => {
  const [code, setCode] = useState("");
  const [trustDevice, setTrustDevice] = useState(false);
  const navigate = useNavigate();

  // Valid codes that allow access to the landing page
  const VALID_CODES = ["9768", "1234", "5678"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (VALID_CODES.includes(code)) {
      // Set access flag in localStorage
      localStorage.setItem("validAccessCode", "true");
      
      toast.success("Access granted! Welcome to the system.", {
        description: "Redirecting to the main interface..."
      });
      navigate("/landing");
    } else {
      toast.error("Invalid access code", {
        description: "Please check your code and try again."
      });
      setCode("");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <AnimatedClockBackground />
      
      <div className="relative z-10 w-full max-w-sm">
        <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-2xl overflow-hidden rounded-3xl border border-border/50">
          <CardContent className="p-8">
            {/* Cute lock icon with system colors */}
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary via-primary/80 to-secondary rounded-2xl flex items-center justify-center mx-auto shadow-xl relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-secondary rounded-2xl blur-lg opacity-60 animate-pulse"></div>
                  <Key className="h-8 w-8 text-primary-foreground relative z-10" />
                </div>
              </div>
              
              <h1 className="text-xl font-bold text-foreground mb-2 tracking-tight">
                Secure Access
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                Enter your unique access code
              </p>
            </div>

            {/* Compact OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="code" className="text-sm font-semibold text-foreground block text-center">
                  Access Code
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={4}
                    value={code}
                    onChange={(value) => setCode(value)}
                    className="gap-2"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot 
                        index={0} 
                        className="w-12 h-12 text-lg font-bold bg-background/50 border-2 border-border rounded-xl text-foreground backdrop-blur-sm hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                      />
                      <InputOTPSlot 
                        index={1} 
                        className="w-12 h-12 text-lg font-bold bg-background/50 border-2 border-border rounded-xl text-foreground backdrop-blur-sm hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                      />
                      <InputOTPSlot 
                        index={2} 
                        className="w-12 h-12 text-lg font-bold bg-background/50 border-2 border-border rounded-xl text-foreground backdrop-blur-sm hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                      />
                      <InputOTPSlot 
                        index={3} 
                        className="w-12 h-12 text-lg font-bold bg-background/50 border-2 border-border rounded-xl text-foreground backdrop-blur-sm hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {/* Cute checkbox */}
              <div className="flex items-center justify-center space-x-2">
                <Checkbox
                  id="trust"
                  checked={trustDevice}
                  onCheckedChange={(checked) => setTrustDevice(checked as boolean)}
                  className="border-2 border-border bg-background/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-md backdrop-blur-sm"
                />
                <Label htmlFor="trust" className="text-sm text-muted-foreground cursor-pointer font-medium">
                  Remember this device
                </Label>
              </div>

              {/* Cute gradient button */}
              <Button 
                type="submit" 
                className="w-full h-10 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-0 relative overflow-hidden group"
                disabled={code.length < 4}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Lock className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10">Access System</span>
              </Button>

              {/* Cute cancel link */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors duration-300 hover:underline underline-offset-4"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CodeEntry;
