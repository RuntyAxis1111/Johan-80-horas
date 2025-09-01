import React from 'react';
import { Play, Pause, Square } from 'lucide-react';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  isFullscreen: boolean;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onStop,
  isFullscreen,
}) => {
  if (!isRunning) {
    return (
      <button
        onClick={onStart}
        className={`flex items-center space-x-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
          isFullscreen ? 'text-xl' : 'text-lg'
        }`}
      >
        <Play size={isFullscreen ? 28 : 24} />
        <span>Iniciar Focus</span>
      </button>
    );
  }

  return (
    <div className={`flex items-center space-x-4 ${isFullscreen ? 'text-xl' : 'text-lg'}`}>
      <button
        onClick={onPause}
        className="flex items-center space-x-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <Pause size={isFullscreen ? 24 : 20} />
        <span>Pausar</span>
      </button>
      
      <button
        onClick={onStop}
        className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <Square size={isFullscreen ? 24 : 20} />
        <span>Parar y Guardar</span>
      </button>
    </div>
  );
};

export default TimerControls;