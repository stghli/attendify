
import React, { ReactNode } from "react";

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
      {/* Abstract geometric background shapes matching the image */}
      <div className="absolute inset-0">
        {/* Large mint green organic shape - top right */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-300 rounded-full opacity-80" />
        
        {/* Blue geometric shape - top right */}
        <div className="absolute top-32 right-20 w-48 h-48 bg-blue-600 transform rotate-45 rounded-3xl" />
        
        {/* Blue curved shape - bottom left */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600 rounded-full" />
        
        {/* Additional mint green accent - right side */}
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-emerald-200 rounded-full transform translate-x-32 opacity-60" />
        
        {/* Yellow curved line accent */}
        <div className="absolute bottom-32 right-40 w-48 h-2 bg-yellow-400 transform rotate-12 rounded-full" />
        
        {/* Small blue accent - bottom */}
        <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-blue-500 rounded-full" />
      </div>
      
      <div 
        className={`w-full max-w-md transition-all duration-700 ease-out transform ${
          animationActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        } z-10`}
      >
        {children}
      </div>
    </div>
  );
};
