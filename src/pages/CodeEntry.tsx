
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import AnimatedBackground from "@/components/AnimatedBackground";

const CodeEntry: React.FC = () => {
  const [code, setCode] = useState("");
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
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg overflow-hidden">
          <CardContent className="p-8">
            {/* Header with animated icon */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <ShieldCheck className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
                Secure Access
              </h1>
              <p className="text-slate-600 text-lg">Enter your event access code to continue</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex flex-col items-center space-y-6">
                {/* OTP Input with enhanced styling */}
                <div className="relative">
                  <InputOTP
                    maxLength={4}
                    value={code}
                    onChange={(value) => setCode(value)}
                    autoFocus
                  >
                    <InputOTPGroup className="gap-3">
                      <InputOTPSlot 
                        index={0} 
                        className="w-14 h-14 text-2xl font-bold border-2 border-slate-200 bg-white/70 backdrop-blur-sm rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-slate-300" 
                      />
                      <InputOTPSlot 
                        index={1} 
                        className="w-14 h-14 text-2xl font-bold border-2 border-slate-200 bg-white/70 backdrop-blur-sm rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-slate-300" 
                      />
                      <InputOTPSlot 
                        index={2} 
                        className="w-14 h-14 text-2xl font-bold border-2 border-slate-200 bg-white/70 backdrop-blur-sm rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-slate-300" 
                      />
                      <InputOTPSlot 
                        index={3} 
                        className="w-14 h-14 text-2xl font-bold border-2 border-slate-200 bg-white/70 backdrop-blur-sm rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-slate-300" 
                      />
                    </InputOTPGroup>
                  </InputOTP>
                  
                  {/* Animated underline */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300" 
                       style={{ width: code.length > 0 ? `${(code.length / 4) * 100}%` : '0%' }}></div>
                </div>
                
                <p className="text-sm text-slate-500 font-medium">Enter your 4-digit access code</p>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={code.length !== 4}
              >
                <span className="mr-2">Access System</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-2">Need help accessing the system?</p>
                <p className="text-xs text-slate-400">Contact your event administrator for assistance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CodeEntry;
