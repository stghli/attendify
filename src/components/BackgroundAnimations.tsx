
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
    "rgba(29, 155, 240, 0.6)", // Primary blue
    "rgba(29, 155, 240, 0.5)",
    "rgba(48, 193, 99, 0.6)",  // Secondary green
    "rgba(48, 193, 99, 0.5)",
    "rgba(120, 80, 240, 0.5)", // Purple
    "rgba(240, 80, 120, 0.5)"  // Pink
  ];

  useEffect(() => {
    // Create more bubbles
    const initialBubbles: AnimatedBubble[] = Array.from({ length: 20 }, (_, index) => ({
      id: index,
      x: Math.random() * 100, // percentage of viewport width
      y: Math.random() * 100, // percentage of viewport height
      size: 50 + Math.random() * 200, // larger size between 50px and 250px
      speed: 0.5 + Math.random() * 0.7, // faster speed
      opacity: 0.2 + Math.random() * 0.4, // higher opacity between 0.2 and 0.6
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
        let newX = bubble.x + Math.sin(timestamp / 2000 + bubble.id) * 0.3; // More pronounced horizontal movement

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
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-200 z-0">
      {/* Moving background gradient with animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-200 animate-gradient opacity-90"></div>
      
      {/* Animated bubbles with pulse effect */}
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            backgroundColor: bubble.color,
            opacity: bubble.opacity,
            filter: 'blur(8px)',
            transition: 'background-color 2s ease',
            animation: `float ${5 + bubble.id % 5}s ease-in-out infinite`
          }}
        />
      ))}

      {/* Additional floating elements */}
      <div className="absolute w-32 h-32 bg-primary/20 rounded-full top-1/4 left-1/4 animate-float" style={{ filter: 'blur(20px)', animationDelay: '0s' }}></div>
      <div className="absolute w-40 h-40 bg-secondary/20 rounded-full bottom-1/4 right-1/4 animate-float" style={{ filter: 'blur(24px)', animationDelay: '2s' }}></div>
      <div className="absolute w-24 h-24 bg-primary/30 rounded-full top-3/4 left-1/3 animate-float" style={{ filter: 'blur(16px)', animationDelay: '1s' }}></div>

      {/* Subtle gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/40"></div>
    </div>
  );
};
