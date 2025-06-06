
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, Lock, Smartphone } from "lucide-react";
import { toast } from "sonner";
import AnimatedBackground from "@/components/AnimatedBackground";

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
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl overflow-hidden rounded-3xl">
          <CardContent className="p-10">
            {/* Phone illustration */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-40 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg relative overflow-hidden">
                  {/* Phone screen */}
                  <div className="w-16 h-28 bg-white rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                      <Lock className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  {/* Phone details */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-emerald-600 rounded-full"></div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 border-2 border-emerald-600 rounded-full"></div>
                </div>
                {/* Hand holding phone effect */}
                <div className="absolute -bottom-4 -left-6 w-16 h-12 bg-gradient-to-br from-orange-300 to-orange-400 rounded-t-full rounded-br-full transform rotate-12 opacity-80"></div>
                <div className="absolute -bottom-2 -right-4 w-12 h-8 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full transform -rotate-12 opacity-80"></div>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Two-step verification
              </h1>
              <p className="text-gray-600 text-sm mb-2">
                Thanks for keeping your account secure.
              </p>
              <p className="text-gray-600 text-sm">
                Check your mobile device: <span className="font-mono">(xxx)-xxx-0099</span>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium text-gray-700">
                  Your Verification Code
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-12 px-4 text-center text-lg font-mono bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  maxLength={6}
                  autoFocus
                />
              </div>

              {/* Trust device checkbox */}
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="trust"
                  checked={trustDevice}
                  onCheckedChange={(checked) => setTrustDevice(checked as boolean)}
                  className="border-gray-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                />
                <Label htmlFor="trust" className="text-sm text-gray-600 cursor-pointer">
                  This is a trusted device, don't ask again.{" "}
                  <span className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
                    Learn more
                  </span>
                </Label>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={code.length < 4}
              >
                <Lock className="h-5 w-5 mr-2" />
                Sign In Securely
              </Button>

              {/* Cancel link */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
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
