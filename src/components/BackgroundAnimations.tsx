
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

  // Colors for the bubbles - using the primary and secondary colors
  const colors = [
    "rgba(29, 155, 240, 0.3)", // Primary blue
    "rgba(29, 155, 240, 0.2)",
    "rgba(48, 193, 99, 0.3)",  // Secondary green
    "rgba(48, 193, 99, 0.2)",
    "rgba(29, 155, 240, 0.15)",
    "rgba(48, 193, 99, 0.15)"
  ];

  useEffect(() => {
    // Create initial bubbles
    const initialBubbles: AnimatedBubble[] = Array.from({ length: 15 }, (_, index) => ({
      id: index,
      x: Math.random() * 100, // percentage of viewport width
      y: Math.random() * 100, // percentage of viewport height
      size: 50 + Math.random() * 150, // size between 50px and 200px
      speed: 0.3 + Math.random() * 0.4, // speed of movement
      opacity: 0.1 + Math.random() * 0.3, // opacity between 0.1 and 0.4
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
        // Move bubble upward and slightly to the side
        let newY = bubble.y - bubble.speed * (deltaTime / 16);
        let newX = bubble.x + Math.sin(timestamp / 3000 + bubble.id) * 0.1;

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
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 z-0">
      {/* Moving background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 animate-pulse opacity-80"></div>
      
      {/* Animated bubbles */}
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
            filter: 'blur(10px)',
            transition: 'background-color 3s ease',
          }}
        />
      ))}

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/30"></div>
    </div>
  );
};
