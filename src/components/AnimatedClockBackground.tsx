
import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface ClockElement {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
  speed: number;
}

const AnimatedClockBackground: React.FC = () => {
  const [clocks, setClocks] = useState<ClockElement[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Create floating clock elements
    const clockElements: ClockElement[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 30 + Math.random() * 40,
      rotation: Math.random() * 360,
      opacity: 0.1 + Math.random() * 0.2,
      speed: 0.1 + Math.random() * 0.3,
    }));
    setClocks(clockElements);

    // Update current time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Animate floating clocks
    const animationInterval = setInterval(() => {
      setClocks(prev => prev.map(clock => ({
        ...clock,
        y: clock.y <= -10 ? 110 : clock.y - clock.speed * 0.05,
        x: clock.x + Math.sin(Date.now() * 0.0005 + clock.id) * 0.1,
        rotation: clock.rotation + 0.2,
      })));
    }, 100);

    return () => {
      clearInterval(timeInterval);
      clearInterval(animationInterval);
    };
  }, []);

  // Get current time components
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  // Calculate hand angles
  const secondAngle = (seconds * 6) - 90; // 6 degrees per second
  const minuteAngle = (minutes * 6) + (seconds * 0.1) - 90; // 6 degrees per minute + smooth seconds
  const hourAngle = ((hours % 12) * 30) + (minutes * 0.5) - 90; // 30 degrees per hour + smooth minutes

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Multi-layered gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-800/20 to-blue-800/30"></div>
      
      {/* Animated mesh background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Large central clock */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-80 h-80 opacity-10">
          {/* Clock face */}
          <div className="w-full h-full rounded-full border-4 border-white/20 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm">
            {/* Hour markers */}
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="absolute w-1 h-8 bg-white/30 rounded-full"
                style={{
                  top: '10px',
                  left: '50%',
                  transformOrigin: '50% 150px',
                  transform: `translateX(-50%) rotate(${i * 30}deg)`,
                }}
              />
            ))}
            
            {/* Clock hands */}
            {/* Hour hand */}
            <div
              className="absolute top-1/2 left-1/2 w-1.5 bg-white/60 rounded-full origin-bottom"
              style={{
                height: '80px',
                marginTop: '-80px',
                marginLeft: '-3px',
                transform: `rotate(${hourAngle}deg)`,
                transition: 'transform 0.5s ease-in-out',
              }}
            />
            
            {/* Minute hand */}
            <div
              className="absolute top-1/2 left-1/2 w-1 bg-white/70 rounded-full origin-bottom"
              style={{
                height: '110px',
                marginTop: '-110px',
                marginLeft: '-2px',
                transform: `rotate(${minuteAngle}deg)`,
                transition: 'transform 0.5s ease-in-out',
              }}
            />
            
            {/* Second hand */}
            <div
              className="absolute top-1/2 left-1/2 w-0.5 bg-red-400/80 rounded-full origin-bottom"
              style={{
                height: '120px',
                marginTop: '-120px',
                marginLeft: '-1px',
                transform: `rotate(${secondAngle}deg)`,
                transition: seconds === 0 ? 'none' : 'transform 0.1s ease-out',
              }}
            />
            
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white/80 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      </div>

      {/* Floating clock icons */}
      {clocks.map(clock => (
        <div
          key={clock.id}
          className="absolute transition-all duration-1000 ease-linear"
          style={{
            left: `${clock.x}%`,
            top: `${clock.y}%`,
            transform: `rotate(${clock.rotation}deg)`,
            opacity: clock.opacity,
          }}
        >
          <Clock 
            size={clock.size} 
            className="text-white/20" 
          />
        </div>
      ))}

      {/* Digital time display */}
      <div className="absolute top-8 right-8 text-white/40 font-mono text-sm">
        {currentTime.toLocaleTimeString()}
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute top-3/4 left-1/6 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '5s' }} />

      {/* Subtle overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20"></div>
    </div>
  );
};

export default AnimatedClockBackground;
