import React from 'react';

interface RoundTimerProps {
  timeLeft: number;
  roundDuration: number;
}

export const RoundTimer: React.FC<RoundTimerProps> = ({ timeLeft, roundDuration }) => {
  const progress = (timeLeft / roundDuration) * 100;

  return (
    <div className="w-full bg-secondary h-1.5">
      <div
        className="bg-accent h-1.5"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};
