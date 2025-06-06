
import React, { useEffect, useState } from "react";

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

const AnimatedBackground: React.FC = () => {
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    // Create floating elements with system colors
    const elements: FloatingElement[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 40 + Math.random() * 80,
      speed: 0.2 + Math.random() * 0.5,
      color: [
        'rgba(34, 197, 94, 0.1)',   // green-500
        'rgba(59, 130, 246, 0.1)',  // blue-500
        'rgba(168, 85, 247, 0.1)',  // violet-500
        'rgba(236, 72, 153, 0.1)',  // pink-500
        'rgba(245, 158, 11, 0.1)',  // amber-500
      ][Math.floor(Math.random() * 5)],
      rotation: Math.random() * 360,
      rotationSpeed: 0.5 + Math.random() * 1,
    }));
    setFloatingElements(elements);

    // Animate floating elements
    const interval = setInterval(() => {
      setFloatingElements(prev => prev.map(el => ({
        ...el,
        y: el.y <= -10 ? 110 : el.y - el.speed * 0.05,
        x: el.x + Math.sin(Date.now() * 0.0005 + el.id) * 0.1,
        rotation: el.rotation + el.rotationSpeed * 0.2,
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"></div>
      
      {/* Animated floating elements */}
      {floatingElements.map(element => (
        <div
          key={element.id}
          className="absolute rounded-full transition-all duration-1000 ease-in-out backdrop-blur-sm"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            backgroundColor: element.color,
            transform: `rotate(${element.rotation}deg)`,
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        />
      ))}
      
      {/* Additional geometric shapes */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-green-400/10 rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/3 left-1/5 w-24 h-24 bg-gradient-to-br from-violet-400/10 to-pink-400/10 rounded-lg rotate-45 animate-bounce" style={{ animationDuration: '6s' }} />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full animate-ping" style={{ animationDuration: '5s' }} />
      
      {/* Subtle overlay for better readability */}
      <div className="absolute inset-0 bg-white/30"></div>
    </div>
  );
};

export default AnimatedBackground;
