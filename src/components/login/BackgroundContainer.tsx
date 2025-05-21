
import React, { ReactNode } from "react";
import { BackgroundAnimations } from "@/components/BackgroundAnimations";
import { Card } from "@/components/ui/card";

interface BackgroundContainerProps {
  children: ReactNode;
  animationActive: boolean;
}

export const BackgroundContainer: React.FC<BackgroundContainerProps> = ({ 
  children, 
  animationActive 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-8 overflow-hidden relative">
      {/* Background Animation Layer */}
      <BackgroundAnimations />
      
      <div 
        className={`max-w-md w-full transition-all duration-700 ease-out transform ${
          animationActive ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
        } z-10`}
      >
        {children}
        
        <div className={`mt-5 text-center text-sm text-gray-700 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md transition-all duration-500 delay-1500 transform ${
          animationActive ? "opacity-100" : "opacity-0"
        }`}>
          <p className="font-medium">
            For demo: admin@school.edu / admin123 or jsmith@school.edu / teacher123
          </p>
        </div>
      </div>
    </div>
  );
};
