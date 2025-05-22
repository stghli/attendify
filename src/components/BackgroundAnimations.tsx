
import React, { useEffect, useState } from "react";

interface AnimatedBubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
}

export const BackgroundAnimations: React.FC = () => {
  const [bubbles, setBubbles] = useState<AnimatedBubble[]>([]);

  // Enhanced colors for the bubbles - with higher opacity and more vibrant colors
  const colors = [
    "rgba(29, 155, 240, 0.4)", // Primary blue
    "rgba(29, 155, 240, 0.3)",
    "rgba(48, 193, 99, 0.4)",  // Secondary green
    "rgba(48, 193, 99, 0.3)",
    "rgba(120, 80, 240, 0.3)", // Purple
    "rgba(240, 80, 120, 0.3)"  // Pink
  ];

  useEffect(() => {
    // Create more bubbles
    const initialBubbles: AnimatedBubble[] = Array.from({ length: 15 }, (_, index) => ({
      id: index,
      x: Math.random() * 100, // percentage of viewport width
      y: Math.random() * 100, // percentage of viewport height
      size: 100 + Math.random() * 200, // larger size between 100px and 300px
      speed: 0.3 + Math.random() * 0.5, // slower speed for glassy effect
      opacity: 0.1 + Math.random() * 0.3, // lower opacity for glassy feel
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    setBubbles(initialBubbles);

    // Animation frame to move bubbles
    let animationId: number;
    let lastTime = 0;

    const animateBubbles = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      setBubbles(prev => prev.map(bubble => {
        // Move bubble upward and with more pronounced side-to-side motion
        let newY = bubble.y - bubble.speed * (deltaTime / 16);
        let newX = bubble.x + Math.sin(timestamp / 2000 + bubble.id) * 0.2; // More subtle horizontal movement

        // If bubble goes off-screen, reset from bottom
        if (newY < -15) {
          newY = 115;
          newX = Math.random() * 100;
        }

        return {
          ...bubble,
          x: newX,
          y: newY
        };
      }));

      animationId = requestAnimationFrame(animateBubbles);
    };

    animationId = requestAnimationFrame(animateBubbles);

    // Cleanup function
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-800 z-0">
      {/* Moving background gradient with animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 animate-gradient opacity-90"></div>
      
      {/* Animated bubbles with glassy effect */}
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute rounded-full"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            backgroundColor: bubble.color,
            opacity: bubble.opacity,
            filter: 'blur(40px)',
            transition: 'background-color 3s ease',
            animation: `float ${8 + bubble.id % 5}s ease-in-out infinite`
          }}
        />
      ))}

      {/* Additional floating elements */}
      <div className="absolute w-40 h-40 bg-white/10 rounded-full top-1/4 left-1/4 animate-float" 
           style={{ filter: 'blur(60px)', animationDelay: '0s' }}></div>
      <div className="absolute w-56 h-56 bg-blue-300/10 rounded-full bottom-1/4 right-1/4 animate-float" 
           style={{ filter: 'blur(70px)', animationDelay: '2s' }}></div>
      <div className="absolute w-32 h-32 bg-indigo-300/15 rounded-full top-3/4 left-1/3 animate-float" 
           style={{ filter: 'blur(50px)', animationDelay: '1s' }}></div>

      {/* Light mesh overlay for glass effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10"></div>
    </div>
  );
};
