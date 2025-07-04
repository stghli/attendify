
import React, { useState, useEffect } from "react";

interface CurrentTimeDisplayProps {
  currentTime: Date;
}

const CurrentTimeDisplay: React.FC<CurrentTimeDisplayProps> = ({ currentTime }) => {
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  return (
    <div className="text-center mb-4 sm:mb-6 lg:mb-8 mt-16 sm:mt-0">
      <p className="text-white/70 text-xs sm:text-sm mb-2 sm:mb-4 flex items-center justify-center gap-2">
        Current Time
      </p>
      <div className="flex items-center justify-center gap-1 sm:gap-2 lg:gap-4 text-white font-mono">
        <div className="text-center">
          <div className="text-2xl sm:text-3xl lg:text-6xl font-bold">
            {displayHours.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-white/60 mt-1">Hours</div>
        </div>
        <div className="text-xl sm:text-2xl lg:text-5xl font-bold text-white/60">:</div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl lg:text-6xl font-bold">
            {minutes.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-white/60 mt-1">Minutes</div>
        </div>
        <div className="text-xl sm:text-2xl lg:text-5xl font-bold text-white/60">:</div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl lg:text-6xl font-bold">
            {seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-white/60 mt-1">Seconds</div>
        </div>
        <div className="text-center ml-1 sm:ml-2 lg:ml-4">
          <div className="text-lg sm:text-xl lg:text-4xl font-bold">
            {ampm}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentTimeDisplay;
