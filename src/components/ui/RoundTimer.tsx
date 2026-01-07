import React from 'react';

interface RoundTimerProps {
  timeLeft: number;
  roundDuration: number;
}

export const RoundTimer: React.FC<RoundTimerProps> = ({ timeLeft, roundDuration }) => {
  const progress = (timeLeft / roundDuration) * 100;

  return (
    <div className="w-full bg-border h-1.5 overflow-hidden">
      <div
        className="bg-accent h-1.5 shadow-[0_0_12px_rgba(29,155,240,0.8)] transition-all duration-1000 ease-linear"
        style={{ 
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #1d9bf0 0%, #34d399 100%)' 
        }}
      ></div>
    </div>
  );
};
