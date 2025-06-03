
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
        className={`flex justify-center mb-8 transition-all duration-700 delay-300 transform ${
          animationActive ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <div className="bg-emerald-100 rounded-full p-4 shadow-lg">
          <QrCode className="h-8 w-8 text-emerald-600" strokeWidth={1.5} />
        </div>
      </div>
      
      <CardHeader className="space-y-2 p-0 text-center">
        <CardTitle className={`text-3xl font-bold text-gray-800 transition-all duration-700 delay-400 transform ${
          animationActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}>
          Login
        </CardTitle>
      </CardHeader>
    </>
  );
};
