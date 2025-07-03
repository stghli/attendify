
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
      
      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/10 backdrop-blur-2xl overflow-hidden rounded-3xl border border-white/20">
          <CardContent className="p-10">
            {/* Modern lock icon with glow effect */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
                  <Key className="h-10 w-10 text-white relative z-10" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-3 tracking-tight">
                Secure Access
              </h1>
              <p className="text-white/70 text-sm font-medium">
                Enter your unique access code
              </p>
            </div>

            {/* Modern OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="code" className="text-sm font-semibold text-white/90 block text-center">
                  Access Code
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={4}
                    value={code}
                    onChange={(value) => setCode(value)}
                    className="gap-3"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot 
                        index={0} 
                        className="w-14 h-14 text-xl font-bold bg-white/10 border-2 border-white/30 rounded-2xl text-white backdrop-blur-sm hover:border-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300"
                      />
                      <InputOTPSlot 
                        index={1} 
                        className="w-14 h-14 text-xl font-bold bg-white/10 border-2 border-white/30 rounded-2xl text-white backdrop-blur-sm hover:border-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300"
                      />
                      <InputOTPSlot 
                        index={2} 
                        className="w-14 h-14 text-xl font-bold bg-white/10 border-2 border-white/30 rounded-2xl text-white backdrop-blur-sm hover:border-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300"
                      />
                      <InputOTPSlot 
                        index={3} 
                        className="w-14 h-14 text-xl font-bold bg-white/10 border-2 border-white/30 rounded-2xl text-white backdrop-blur-sm hover:border-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {/* Modern checkbox */}
              <div className="flex items-center justify-center space-x-3">
                <Checkbox
                  id="trust"
                  checked={trustDevice}
                  onCheckedChange={(checked) => setTrustDevice(checked as boolean)}
                  className="border-2 border-white/30 bg-white/10 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 rounded-lg backdrop-blur-sm"
                />
                <Label htmlFor="trust" className="text-sm text-white/80 cursor-pointer font-medium">
                  Remember this device
                </Label>
              </div>

              {/* Modern gradient button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-0 relative overflow-hidden group"
                disabled={code.length < 4}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <Lock className="h-5 w-5 mr-2 relative z-10" />
                <span className="relative z-10">Access System</span>
              </Button>

              {/* Modern cancel link */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-300 hover:underline underline-offset-4"
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
