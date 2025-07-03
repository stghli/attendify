
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
    const clockElements: ClockElement[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 20 + Math.random() * 30,
      rotation: Math.random() * 360,
      opacity: 0.15 + Math.random() * 0.25,
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
      {/* System-themed gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/10 to-accent/15"></div>
      
      {/* Enhanced animated mesh background */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Large central clock - more visible */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-96 h-96 opacity-20">
          {/* Clock face */}
          <div className="w-full h-full rounded-full border-4 border-primary/30 bg-gradient-to-br from-card/20 to-primary/10 backdrop-blur-sm shadow-2xl">
            {/* Hour markers */}
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-10 bg-primary/50 rounded-full"
                style={{
                  top: '15px',
                  left: '50%',
                  transformOrigin: '50% 177px',
                  transform: `translateX(-50%) rotate(${i * 30}deg)`,
                }}
              />
            ))}
            
            {/* Minute markers */}
            {Array.from({ length: 60 }, (_, i) => i % 5 !== 0 && (
              <div
                key={i}
                className="absolute w-0.5 h-4 bg-primary/30 rounded-full"
                style={{
                  top: '20px',
                  left: '50%',
                  transformOrigin: '50% 172px',
                  transform: `translateX(-50%) rotate(${i * 6}deg)`,
                }}
              />
            ))}
            
            {/* Clock hands */}
            {/* Hour hand */}
            <div
              className="absolute top-1/2 left-1/2 w-2 bg-primary/70 rounded-full origin-bottom shadow-lg"
              style={{
                height: '90px',
                marginTop: '-90px',
                marginLeft: '-4px',
                transform: `rotate(${hourAngle}deg)`,
                transition: 'transform 0.5s ease-in-out',
              }}
            />
            
            {/* Minute hand */}
            <div
              className="absolute top-1/2 left-1/2 w-1.5 bg-primary/80 rounded-full origin-bottom shadow-lg"
              style={{
                height: '130px',
                marginTop: '-130px',
                marginLeft: '-3px',
                transform: `rotate(${minuteAngle}deg)`,
                transition: 'transform 0.5s ease-in-out',
              }}
            />
            
            {/* Second hand */}
            <div
              className="absolute top-1/2 left-1/2 w-0.5 bg-destructive/90 rounded-full origin-bottom shadow-lg"
              style={{
                height: '140px',
                marginTop: '-140px',
                marginLeft: '-1px',
                transform: `rotate(${secondAngle}deg)`,
                transition: seconds === 0 ? 'none' : 'transform 0.1s ease-out',
              }}
            />
            
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
          </div>
        </div>
      </div>

      {/* Floating clock icons - more visible */}
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
            className="text-primary/40" 
          />
        </div>
      ))}

      {/* Digital time display */}
      <div className="absolute top-8 right-8 text-primary/60 font-mono text-lg font-semibold bg-card/20 backdrop-blur-sm px-3 py-1 rounded-lg border border-primary/20">
        {currentTime.toLocaleTimeString()}
      </div>

      {/* System-themed glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute top-3/4 left-1/6 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '5s' }} />

      {/* Subtle overlay for better contrast */}
      <div className="absolute inset-0 bg-background/10"></div>
    </div>
  );
};

export default AnimatedClockBackground;
