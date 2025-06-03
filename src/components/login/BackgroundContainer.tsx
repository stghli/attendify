
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
      {/* Abstract geometric background shapes */}
      <div className="absolute inset-0">
        {/* Large mint green organic shape */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/60 rounded-full transform translate-x-32 -translate-y-16" />
        
        {/* Blue geometric shapes */}
        <div className="absolute top-32 right-20 w-48 h-48 bg-blue-500 transform rotate-45 rounded-2xl" />
        <div className="absolute bottom-0 left-0 w-64 h-32 bg-blue-600 rounded-full transform -translate-x-20 translate-y-10" />
        
        {/* Additional mint green accents */}
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-emerald-300/40 rounded-full" />
        
        {/* Curved line accent */}
        <div className="absolute bottom-10 right-32 w-48 h-1 bg-yellow-400 transform rotate-12 rounded-full" />
      </div>
      
      <div 
        className={`w-full max-w-sm transition-all duration-700 ease-out transform ${
          animationActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        } z-10`}
      >
        {children}
      </div>
    </div>
  );
};
