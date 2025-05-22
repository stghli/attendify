
import React from "react";
import { QrCode } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface LoginHeaderProps {
  animationActive: boolean;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ animationActive }) => {
  return (
    <>
      <div 
        className={`flex justify-center mb-8 transition-all duration-700 delay-300 transform ${
          animationActive ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-5 shadow-lg border border-blue-400/30">
          <QrCode className="h-12 w-12 text-white" strokeWidth={1.5} />
        </div>
      </div>
      
      <CardHeader className="space-y-2 p-0 text-center">
        <CardTitle className={`text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent transition-all duration-700 delay-400 transform ${
          animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}>
          Welcome Back
        </CardTitle>
        <CardDescription className={`text-base text-gray-600 transition-all duration-700 delay-500 transform ${
          animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}>
          Sign in to access your dashboard
        </CardDescription>
      </CardHeader>
    </>
  );
};
