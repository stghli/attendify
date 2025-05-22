
import React, { ReactNode } from "react";
import { BackgroundAnimations } from "@/components/BackgroundAnimations";

interface BackgroundContainerProps {
  children: ReactNode;
  animationActive: boolean;
}

export const BackgroundContainer: React.FC<BackgroundContainerProps> = ({ 
  children, 
  animationActive 
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 overflow-hidden relative">
      {/* Background Animation Layer */}
      <BackgroundAnimations />
      
      <div 
        className={`w-full max-w-md transition-all duration-700 ease-out transform ${
          animationActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        } z-10`}
      >
        {children}
      </div>
      
      <div className={`mt-6 text-center text-xs text-gray-500 transition-all duration-500 delay-1000 transform ${
        animationActive ? "opacity-100" : "opacity-0"
      } z-10`}>
        <p className="font-medium">
          QR Attendance System &copy; 2025
        </p>
      </div>
    </div>
  );
};
