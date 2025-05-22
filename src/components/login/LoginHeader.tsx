
import React from "react";
import { QrCode, Sparkles } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface LoginHeaderProps {
  animationActive: boolean;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ animationActive }) => {
  return (
    <>
      <div 
        className={`flex justify-center mb-8 transition-all duration-1000 delay-300 transform ${
          animationActive ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-full p-6 shadow-xl backdrop-blur-sm bg-opacity-90 animate-pulse">
          <QrCode className="h-16 w-16 text-white" />
        </div>
      </div>
      
      <CardHeader className="space-y-2 pb-6">
        <div className="flex justify-between items-center">
          <CardTitle className={`text-4xl font-bold text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent transition-all duration-1000 delay-500 transform ${
            animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}>
            QR Attendance
          </CardTitle>
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
        </div>
        <CardDescription className={`text-center text-lg transition-all duration-1000 delay-700 transform ${
          animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}>
          Sign in to access your dashboard
        </CardDescription>
      </CardHeader>
    </>
  );
};
