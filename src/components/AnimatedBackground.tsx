
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
  opacity: number;
}

interface WaveElement {
  id: number;
  path: string;
  color: string;
  animationDelay: number;
}

const AnimatedBackground: React.FC = () => {
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const [waves, setWaves] = useState<WaveElement[]>([]);

  useEffect(() => {
    // Create floating geometric elements
    const elements: FloatingElement[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 20 + Math.random() * 100,
      speed: 0.1 + Math.random() * 0.3,
      color: [
        'rgba(16, 185, 129, 0.1)',   // emerald-500
        'rgba(20, 184, 166, 0.1)',   // teal-500
        'rgba(59, 130, 246, 0.08)',  // blue-500
        'rgba(139, 69, 19, 0.05)',   // brown-600
        'rgba(245, 158, 11, 0.06)',  // amber-500
        'rgba(236, 72, 153, 0.05)',  // pink-500
      ][Math.floor(Math.random() * 6)],
      rotation: Math.random() * 360,
      rotationSpeed: 0.2 + Math.random() * 0.8,
      opacity: 0.3 + Math.random() * 0.7,
    }));
    setFloatingElements(elements);

    // Create wave elements
    const waveElements: WaveElement[] = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      path: `M0,${200 + i * 50} Q${250 + i * 50},${150 + i * 30} ${500 + i * 100},${180 + i * 40} T${1000 + i * 200},${160 + i * 50} T${1500 + i * 300},${170 + i * 45} L1500,1000 L0,1000 Z`,
      color: [
        'rgba(16, 185, 129, 0.03)',
        'rgba(20, 184, 166, 0.04)',
        'rgba(6, 182, 212, 0.03)',
        'rgba(14, 165, 233, 0.02)',
      ][i],
      animationDelay: i * 2,
    }));
    setWaves(waveElements);

    // Animate floating elements
    const interval = setInterval(() => {
      setFloatingElements(prev => prev.map(el => ({
        ...el,
        y: el.y <= -15 ? 115 : el.y - el.speed * 0.03,
        x: el.x + Math.sin(Date.now() * 0.0003 + el.id) * 0.08,
        rotation: el.rotation + el.rotationSpeed * 0.15,
      })));
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Multi-layer gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-50/30 to-cyan-50/40"></div>
      
      {/* Animated SVG waves */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        {waves.map((wave, index) => (
          <path
            key={wave.id}
            d={wave.path}
            fill={wave.color}
            className="animate-pulse"
            style={{
              animationDuration: `${8 + index * 2}s`,
              animationDelay: `${wave.animationDelay}s`,
            }}
          />
        ))}
      </svg>
      
      {/* Floating geometric elements */}
      {floatingElements.map(element => (
        <div
          key={element.id}
          className="absolute transition-all duration-1000 ease-in-out backdrop-blur-sm"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            backgroundColor: element.color,
            transform: `rotate(${element.rotation}deg)`,
            borderRadius: element.id % 3 === 0 ? '50%' : element.id % 3 === 1 ? '25%' : '15%',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            opacity: element.opacity,
          }}
        />
      ))}
      
      {/* Large decorative shapes */}
      <div className="absolute top-1/4 right-1/6 w-40 h-40 bg-gradient-to-br from-emerald-400/5 to-teal-400/8 rounded-full animate-pulse blur-xl" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-1/4 left-1/6 w-32 h-32 bg-gradient-to-br from-cyan-400/5 to-blue-400/8 rounded-full animate-pulse blur-xl" style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-teal-400/6 to-emerald-400/10 rounded-lg rotate-45 animate-bounce blur-lg" style={{ animationDuration: '10s' }} />
      <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-br from-blue-400/8 to-cyan-400/12 rounded-full animate-ping blur-sm" style={{ animationDuration: '7s' }} />
      
      {/* Particle effects */}
      <div className="absolute top-1/5 left-1/5 w-2 h-2 bg-emerald-400/40 rounded-full animate-bounce" style={{ animationDuration: '3s', animationDelay: '1s' }} />
      <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-teal-400/50 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '2s' }} />
      <div className="absolute bottom-1/3 left-2/3 w-3 h-3 bg-cyan-400/30 rounded-full animate-pulse" style={{ animationDuration: '5s' }} />
      
      {/* Subtle mesh overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[0.5px]"></div>
      
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-white/20 to-white/40"></div>
    </div>
  );
};

export default AnimatedBackground;
