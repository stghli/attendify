
import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface ClockLoaderProps {
  onComplete?: () => void;
  duration?: number;
}

const ClockLoader: React.FC<ClockLoaderProps> = ({ onComplete, duration = 3000 }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 100));
        if (newProgress >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => {
            onComplete?.();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(progressTimer);
  }, [duration, onComplete]);

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
          
          {/* Progress ring */}
          <div className="absolute inset-0 rounded-full">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(59, 130, 246, 0.2)"
                strokeWidth="2"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgb(59, 130, 246)"
                strokeWidth="2"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="transition-all duration-300 ease-out"
              />
            </svg>
          </div>
          
          {/* Outer glow */}
          <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl animate-pulse"></div>
        </div>

        {/* Loading text */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            {progress < 50 ? 'Validating Access' : progress < 90 ? 'Authenticating...' : 'Access Granted'}
          </h2>
          <p className="text-blue-200/80 text-sm">
            {progress < 50 ? 'Please wait while we verify your credentials...' : 
             progress < 90 ? 'Checking security protocols...' : 'Welcome to the system!'}
          </p>
          
          {/* Progress bar */}
          <div className="w-48 mx-auto bg-slate-700/50 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="text-blue-300/60 text-xs font-mono">
            {Math.round(progress)}% Complete
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
