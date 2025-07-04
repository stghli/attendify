
import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const ClockLoader: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get current time components
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  // Calculate hand angles
  const secondAngle = (seconds * 6) - 90;
  const minuteAngle = (minutes * 6) + (seconds * 0.1) - 90;
  const hourAngle = ((hours % 12) * 30) + (minutes * 0.5) - 90;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_50%)]"></div>
        
        {/* Floating elements */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <Clock 
              size={20 + Math.random() * 30} 
              className="text-blue-400 animate-pulse" 
            />
          </div>
        ))}
      </div>

      {/* Main loader */}
      <div className="relative z-10 text-center">
        {/* Animated clock */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Clock face */}
          <div className="w-full h-full rounded-full border-4 border-blue-400/30 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm shadow-2xl relative">
            {/* Hour markers */}
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="absolute w-1 h-6 bg-blue-400/60 rounded-full"
                style={{
                  top: '8px',
                  left: '50%',
                  transformOrigin: '50% 56px',
                  transform: `translateX(-50%) rotate(${i * 30}deg)`,
                }}
              />
            ))}
            
            {/* Clock hands */}
            <div
              className="absolute top-1/2 left-1/2 w-1 bg-blue-400 rounded-full origin-bottom shadow-lg"
              style={{
                height: '32px',
                marginTop: '-32px',
                marginLeft: '-2px',
                transform: `rotate(${hourAngle}deg)`,
                transition: 'transform 0.5s ease-in-out',
              }}
            />
            
            <div
              className="absolute top-1/2 left-1/2 w-0.5 bg-blue-300 rounded-full origin-bottom shadow-lg"
              style={{
                height: '44px',
                marginTop: '-44px',
                marginLeft: '-1px',
                transform: `rotate(${minuteAngle}deg)`,
                transition: 'transform 0.5s ease-in-out',
              }}
            />
            
            <div
              className="absolute top-1/2 left-1/2 w-px bg-red-400 rounded-full origin-bottom shadow-lg"
              style={{
                height: '48px',
                marginTop: '-48px',
                marginLeft: '-0.5px',
                transform: `rotate(${secondAngle}deg)`,
                transition: seconds === 0 ? 'none' : 'transform 0.1s ease-out',
              }}
            />
            
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
          </div>
          
          {/* Outer glow */}
          <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl animate-pulse"></div>
        </div>

        {/* Loading text */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            Validating Access
          </h2>
          <p className="text-blue-200/80 text-sm">
            Please wait while we verify your credentials...
          </p>
          
          {/* Animated dots */}
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>

        {/* Digital time */}
        <div className="mt-8 text-blue-200/60 font-mono text-sm">
          {currentTime.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default ClockLoader;
