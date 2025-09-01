import React from 'react';

interface TimerDisplayProps {
  seconds: number;
  isFullscreen: boolean;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ seconds, isFullscreen }) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const timeText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  const secondsText = secs.toString().padStart(2, '0');

  if (isFullscreen) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="text-8xl md:text-9xl lg:text-[12rem] font-mono font-light text-gray-100 tracking-wider mb-4">
          {timeText}
        </div>
        <div className="text-4xl md:text-5xl lg:text-6xl font-mono font-light text-gray-300 tracking-wider">
          {secondsText}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-6xl md:text-7xl font-mono font-light text-gray-100 tracking-wider mb-2">
        {timeText}
      </div>
      <div className="text-2xl md:text-3xl font-mono font-light text-gray-300 tracking-wider">
        {secondsText}
      </div>
    </div>
  );
};

export default TimerDisplay;