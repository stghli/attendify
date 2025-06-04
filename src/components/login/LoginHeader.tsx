
import React from "react";
import { QrCode } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface LoginHeaderProps {
  animationActive: boolean;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ animationActive }) => {
  return (
    <>
      <div 
        className={`flex justify-center mb-6 transition-all duration-700 delay-300 transform ${
          animationActive ? "scale-100 opacity-100 rotate-0" : "scale-90 opacity-0 rotate-12"
        }`}
      >
        <div className="bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full p-4 shadow-lg border border-emerald-200/50">
          <QrCode className="h-8 w-8 text-emerald-600" strokeWidth={1.5} />
        </div>
      </div>
      
      <CardHeader className="space-y-1 p-0 text-center mb-6">
        <CardTitle className={`text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent transition-all duration-700 delay-400 transform ${
          animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}>
          Welcome Back
        </CardTitle>
        <p className={`text-sm text-gray-500 transition-all duration-700 delay-500 transform ${
          animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}>
          Sign in to continue
        </p>
      </CardHeader>
    </>
  );
};
