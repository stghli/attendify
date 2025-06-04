
import React, { ReactNode, useEffect, useState } from "react";

interface BackgroundContainerProps {
  children: ReactNode;
  animationActive: boolean;
}

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  rotation: number;
}

export const BackgroundContainer: React.FC<BackgroundContainerProps> = ({ 
  children, 
  animationActive 
}) => {
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    // Create floating elements
    const elements: FloatingElement[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 20 + Math.random() * 60,
      speed: 0.3 + Math.random() * 0.7,
      color: [
        'rgba(147, 197, 253, 0.3)', // blue-300
        'rgba(167, 243, 208, 0.3)', // emerald-300  
        'rgba(196, 181, 253, 0.3)', // violet-300
        'rgba(251, 191, 36, 0.3)',  // amber-300
        'rgba(252, 165, 165, 0.3)', // red-300
      ][Math.floor(Math.random() * 5)],
      rotation: Math.random() * 360,
    }));
    setFloatingElements(elements);

    // Animate floating elements
    const interval = setInterval(() => {
      setFloatingElements(prev => prev.map(el => ({
        ...el,
        y: el.y <= -10 ? 110 : el.y - el.speed * 0.1,
        x: el.x + Math.sin(Date.now() * 0.001 + el.id) * 0.1,
        rotation: el.rotation + 0.5,
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-emerald-100/30 to-violet-100/50 animate-pulse"></div>
      
      {/* Floating animated elements */}
      {floatingElements.map(element => (
        <div
          key={element.id}
          className="absolute rounded-full transition-all duration-1000 ease-in-out"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            backgroundColor: element.color,
            transform: `rotate(${element.rotation}deg)`,
            filter: 'blur(2px)',
          }}
        />
      ))}
      
      {/* Geometric shapes */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-emerald-400/20 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
      <div className="absolute bottom-32 left-16 w-24 h-24 bg-gradient-to-br from-violet-400/20 to-pink-400/20 rounded-lg rotate-45 animate-pulse" style={{ animationDuration: '2s' }} />
      <div className="absolute top-1/3 left-10 w-16 h-16 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
      
      <div 
        className={`w-full max-w-sm transition-all duration-700 ease-out transform ${
          animationActive ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95"
        } z-10`}
      >
        {children}
      </div>
    </div>
  );
};
